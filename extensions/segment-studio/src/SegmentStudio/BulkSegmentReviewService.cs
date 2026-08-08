using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record BulkSegmentReviewTarget(
    int? NativeSegmentId,
    long? ItemId,
    DateTime? ExpectedUpdatedAt,
    long? ExpectedRevision);

public sealed record BulkSegmentReviewRequest(
    Guid OperationId,
    long ExpectedHistoryRevision,
    string ReviewState,
    IReadOnlyList<BulkSegmentReviewTarget> Segments);

public sealed record BulkSegmentReviewItemResult(
    int? RequestedNativeSegmentId,
    long? RequestedItemId,
    int? NativeSegmentId,
    long? ItemId,
    long? Revision,
    DateTime? UpdatedAt);

public enum BulkSegmentReviewStatus
{
    Updated,
    NotFound,
    Forbidden,
    Conflict,
    Invalid,
    MissingImage,
}

public sealed record BulkSegmentReviewResult(
    BulkSegmentReviewStatus Status,
    int UpdatedCount = 0,
    IReadOnlyList<BulkSegmentReviewItemResult>? Items = null,
    SegmentStudioHistoryView? History = null,
    string? Error = null,
    bool Replayed = false,
    string? Code = null);

public static class BulkSegmentReviewService
{
    private const string OperationKind = "bulk-review-state";

    public static async Task<BulkSegmentReviewResult> UpdateAsync(
        DbContext db,
        int videoId,
        BulkSegmentReviewRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(BulkSegmentReviewStatus.Invalid, Error: "Operation ID is required.");
        if (request.ReviewState is not ("unreviewed" or "approved" or "rejected"))
            return new(BulkSegmentReviewStatus.Invalid, Error: "Review state must be approved, rejected, or unreviewed.");
        if (request.Segments is null || request.Segments.Count == 0)
            return new(BulkSegmentReviewStatus.Invalid, Error: "Select at least one segment.");
        if (request.Segments.Any(target =>
                (target.NativeSegmentId is null) == (target.ItemId is null)
                || target.NativeSegmentId is not null && target.ExpectedUpdatedAt is null
                || target.ItemId is not null && target.ExpectedRevision is null))
            return new(BulkSegmentReviewStatus.Invalid,
                Error: "Every selected segment must have one complete stable identity.");

        var orderedTargets = request.Segments
            .OrderBy(target => target.NativeSegmentId is null ? 1 : 0)
            .ThenBy(target => target.NativeSegmentId)
            .ThenBy(target => target.ItemId)
            .ToArray();
        var identities = orderedTargets.Select(IdentityKey).ToArray();
        if (identities.Distinct(StringComparer.Ordinal).Count() != identities.Length)
            return new(BulkSegmentReviewStatus.Invalid, Error: "A segment can only appear once.");

        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(BulkSegmentReviewStatus.Forbidden,
                Error: access.Reason ?? "You cannot edit segments for this video.");
        if (principal?.UserId is not int userId)
            return new(BulkSegmentReviewStatus.Forbidden,
                Error: "A signed-in user is required to update review state.");

        var fingerprint = Fingerprint(videoId, request, orderedTargets);
        var replay = await ReplayAsync(db, request.OperationId, fingerprint, userId, ct);
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        replay = await ReplayAsync(db, request.OperationId, fingerprint, userId, ct);
        if (replay is not null)
            return replay;

        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return new(BulkSegmentReviewStatus.NotFound, Error: "Video not found.");

        var nativeTargets = orderedTargets
            .Where(target => target.NativeSegmentId is not null)
            .ToArray();
        var draftTargets = orderedTargets
            .Where(target => target.ItemId is not null)
            .ToArray();
        var nativeIds = nativeTargets.Select(target => target.NativeSegmentId!.Value).ToArray();
        var itemIds = draftTargets.Select(target => target.ItemId!.Value).ToArray();
        var nativeById = await db.Set<Segment>()
            .Where(segment => nativeIds.Contains(segment.Id)
                && segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .ToDictionaryAsync(segment => segment.Id, ct);
        var draftById = await db.Set<SegmentStudioItem>()
            .Where(item => itemIds.Contains(item.Id)
                && item.NativeSegmentId == null
                && item.VideoId == videoId
                && item.ReviewState != null
                && item.TagId != null
                && item.StartSec != null)
            .ToDictionaryAsync(item => item.Id, ct);
        if (nativeById.Count != nativeIds.Length || draftById.Count != itemIds.Length)
            return new(BulkSegmentReviewStatus.NotFound,
                Error: "One or more selected segments no longer exist.");
        if (nativeTargets.Any(target =>
                nativeById[target.NativeSegmentId!.Value].UpdatedAt != target.ExpectedUpdatedAt)
            || draftTargets.Any(target =>
                draftById[target.ItemId!.Value].Revision != target.ExpectedRevision))
            return new(BulkSegmentReviewStatus.Conflict,
                Error: "One or more selected segments changed. Reload before updating review state.");

        var nativeAnchors = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId != null && nativeIds.Contains(item.NativeSegmentId.Value))
            .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
        var beforeRows = orderedTargets.Select(target => target.NativeSegmentId is int nativeId
            ? StateRow.FromNative(nativeById[nativeId], nativeAnchors.GetValueOrDefault(nativeId))
            : StateRow.FromDraft(draftById[target.ItemId!.Value])).ToArray();
        var changedRows = beforeRows
            .Where(row => row.ReviewState != request.ReviewState)
            .ToArray();
        if (changedRows.Length == 0)
            return new(BulkSegmentReviewStatus.Invalid,
                Error: "Every selected segment already has that review state.");

        var transitionNativeIds = changedRows
            .Where(row => row.NativeSegmentId is not null && request.ReviewState != "approved")
            .Select(row => row.NativeSegmentId!.Value)
            .ToArray();
        NativeToOwnedTransitionBatchResult? transition = null;
        if (transitionNativeIds.Length > 0)
        {
            var transitionAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsDelete,
                EntityRef.Of(EntityKinds.Video, videoId), ct);
            if (!transitionAccess.Allowed)
                return new(BulkSegmentReviewStatus.Forbidden,
                    Error: transitionAccess.Reason ?? "You cannot move published segments back into review.");
            var transitionOperationId = ChildOperationId(request.OperationId, "native-transition");
            transition = await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
                db,
                videoId,
                new NativeToOwnedTransitionBatchRequest(
                    transitionOperationId,
                    transitionNativeIds.Select(id => new NativeToOwnedTransitionItem(
                        id, nativeById[id].UpdatedAt)).ToArray(),
                    ReviewState: request.ReviewState),
                principal,
                authorization,
                blobs,
                ct);
            if (transition.Status != SegmentTransitionStatus.Updated)
                return FromTransition(transition);
        }

        var now = DateTime.UtcNow;
        var approvedNativeIds = changedRows
            .Where(row => row.NativeSegmentId is not null && request.ReviewState == "approved")
            .Select(row => row.NativeSegmentId!.Value)
            .ToArray();
        var approvedNativeIdSet = approvedNativeIds.ToHashSet();
        foreach (var nativeId in approvedNativeIds)
        {
            var segment = nativeById[nativeId];
            segment.Payload = DirectSegmentReviewService.MergeReviewState(
                segment.Payload, request.ReviewState);
            segment.UpdatedAt = DirectSegmentReviewService.NextTimestamp(segment.UpdatedAt);
        }

        var changedDraftIds = changedRows
            .Where(row => row.ItemId is not null && row.NativeSegmentId is null)
            .Select(row => row.ItemId!.Value)
            .ToArray();
        var changedDraftIdSet = changedDraftIds.ToHashSet();
        if (approvedNativeIds.Length > 0)
            await db.SaveChangesAsync(ct);
        if (changedDraftIds.Length > 0 && db.Database.IsRelational())
        {
            foreach (var itemId in changedDraftIds)
                db.Entry(draftById[itemId]).State = EntityState.Detached;
            var affected = await db.Set<SegmentStudioItem>()
                .Where(item => changedDraftIds.Contains(item.Id)
                    && item.NativeSegmentId == null
                    && item.VideoId == videoId
                    && item.ReviewState != null)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(item => item.ReviewState, request.ReviewState)
                    .SetProperty(item => item.Revision, item => item.Revision + 1)
                    .SetProperty(item => item.UpdatedAt, now), ct);
            if (affected != changedDraftIds.Length)
                return new(BulkSegmentReviewStatus.Conflict,
                    Error: "The selected segments changed while the bulk update was running.");
        }
        else if (changedDraftIds.Length > 0)
        {
            foreach (var itemId in changedDraftIds)
            {
                var item = draftById[itemId];
                item.ReviewState = request.ReviewState;
                item.Revision++;
                item.UpdatedAt = now;
            }
            await db.SaveChangesAsync(ct);
        }
        if (request.ReviewState == "rejected" && changedDraftIds.Length > 0)
        {
            await DerivedSegmentRejectionService.RejectDescendantsAsync(db, changedDraftIds, ct);
            await db.SaveChangesAsync(ct);
        }

        var transitionByNativeId = (transition?.Items ?? [])
            .ToDictionary(item => item.SegmentId);
        var afterRows = beforeRows.Select(row =>
        {
            if (row.NativeSegmentId is int nativeId
                && transitionByNativeId.TryGetValue(nativeId, out var moved))
                return row with
                {
                    ItemId = moved.ItemId,
                    NativeSegmentId = null,
                    Published = false,
                    Revision = moved.Revision,
                    UpdatedAt = now,
                    ReviewState = request.ReviewState,
                };
            if (row.NativeSegmentId is int approvedNativeId
                && approvedNativeIdSet.Contains(approvedNativeId))
                return row with
                {
                    UpdatedAt = nativeById[approvedNativeId].UpdatedAt,
                    ReviewState = request.ReviewState,
                };
            if (row.ItemId is long itemId && changedDraftIdSet.Contains(itemId))
                return row with
                {
                    Revision = row.Revision + 1,
                    UpdatedAt = now,
                    ReviewState = request.ReviewState,
                };
            return row;
        }).ToArray();
        var changedKeys = changedRows.Select(row => row.RequestIdentity).ToHashSet(StringComparer.Ordinal);
        var beforeState = HistoryState(beforeRows.Where(row => changedKeys.Contains(row.RequestIdentity)));
        var afterState = HistoryState(afterRows.Where(row => changedKeys.Contains(row.RequestIdentity)));
        var history = await SegmentStudioHistoryService.AppendTrustedFullWithinLockAsync(
            db,
            userId,
            videoId,
            request.ExpectedHistoryRevision,
            "segments.review",
            HistoryLabel(request.ReviewState, changedRows.Length),
            beforeState,
            afterState,
            ct);
        if (history.Status != SegmentStudioHistoryMutationStatus.Updated)
            return new(BulkSegmentReviewStatus.Conflict,
                History: history.Value,
                Error: history.Error ?? "Editor history changed. Reload before updating review state.");

        var result = new BulkSegmentReviewResult(
            BulkSegmentReviewStatus.Updated,
            changedRows.Length,
            afterRows.Select(row => new BulkSegmentReviewItemResult(
                row.RequestedNativeSegmentId,
                row.RequestedItemId,
                row.NativeSegmentId,
                row.ItemId,
                row.Revision,
                row.UpdatedAt)).ToArray(),
            history.Value);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = OperationKind,
            ActorUserId = userId,
            RequestFingerprint = fingerprint,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        return result;
    }

    private static BulkSegmentReviewResult FromTransition(
        NativeToOwnedTransitionBatchResult result) =>
        new(result.Status switch
        {
            SegmentTransitionStatus.NotFound => BulkSegmentReviewStatus.NotFound,
            SegmentTransitionStatus.Forbidden => BulkSegmentReviewStatus.Forbidden,
            SegmentTransitionStatus.Conflict => BulkSegmentReviewStatus.Conflict,
            SegmentTransitionStatus.MissingImage => BulkSegmentReviewStatus.MissingImage,
            _ => BulkSegmentReviewStatus.Invalid,
        }, Error: result.Error, Code: result.Code);

    private static async Task<BulkSegmentReviewResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string fingerprint,
        int userId,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != OperationKind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != userId)
            return new(BulkSegmentReviewStatus.Conflict,
                Error: "The operation ID was already used for a different request.");
        var result = JsonSerializer.Deserialize<BulkSegmentReviewResult>(
            receipt.ResultPayloadJson!);
        return result is null
            ? new(BulkSegmentReviewStatus.Conflict,
                Error: "The saved operation result could not be read.")
            : result with { Replayed = true };
    }

    private static string IdentityKey(BulkSegmentReviewTarget target) =>
        target.NativeSegmentId is int nativeId
            ? $"native:{nativeId}"
            : $"item:{target.ItemId}";

    private static string Fingerprint(
        int videoId,
        BulkSegmentReviewRequest request,
        IReadOnlyList<BulkSegmentReviewTarget> targets)
    {
        var canonical = JsonSerializer.Serialize(new
        {
            videoId,
            request.ExpectedHistoryRevision,
            request.ReviewState,
            targets,
        });
        return Convert.ToHexString(SHA256.HashData(
            Encoding.UTF8.GetBytes(canonical))).ToLowerInvariant();
    }

    private static Guid ChildOperationId(Guid operationId, string discriminator)
    {
        var input = operationId.ToByteArray()
            .Concat(Encoding.UTF8.GetBytes(discriminator)).ToArray();
        return new Guid(SHA256.HashData(input).AsSpan(0, 16));
    }

    private static string HistoryLabel(string reviewState, int count) =>
        reviewState == "approved"
            ? $"Approved {count} segment{(count == 1 ? "" : "s")}"
            : reviewState == "rejected"
                ? $"Rejected {count} segment{(count == 1 ? "" : "s")}"
                : $"Reset {count} segment{(count == 1 ? "" : "s")} to unreviewed";

    private static JsonElement HistoryState(IEnumerable<StateRow> rows) =>
        JsonSerializer.SerializeToElement(new
        {
            type = "segments",
            segments = rows.Select(row => new
            {
                identity = new
                {
                    itemId = row.ItemId,
                    nativeSegmentId = row.NativeSegmentId,
                    published = row.Published,
                    revision = row.Revision,
                },
                values = new
                {
                    startSec = row.StartSec,
                    endSec = row.EndSec,
                    tagId = row.TagId,
                    sourceKey = row.SourceKey,
                    sourceRunId = row.SourceRunId,
                    confidence = row.Confidence,
                    reviewState = row.ReviewState,
                },
            }).ToArray(),
        });

    private sealed record StateRow(
        int? RequestedNativeSegmentId,
        long? RequestedItemId,
        int? NativeSegmentId,
        long? ItemId,
        bool Published,
        long? Revision,
        DateTime? UpdatedAt,
        int TagId,
        double StartSec,
        double? EndSec,
        string SourceKey,
        string? SourceRunId,
        float? Confidence,
        string ReviewState)
    {
        public string RequestIdentity => RequestedNativeSegmentId is int nativeId
            ? $"native:{nativeId}"
            : $"item:{RequestedItemId}";

        public static StateRow FromNative(Segment segment, SegmentStudioItem? anchor) =>
            new(
                segment.Id,
                null,
                segment.Id,
                anchor?.Id,
                true,
                anchor?.Revision,
                segment.UpdatedAt,
                segment.TagId!.Value,
                segment.StartSec,
                segment.EndSec,
                segment.SourceKey,
                segment.SourceRunId,
                segment.Confidence,
                DirectSegmentReviewService.ReadReviewState(segment.Payload));

        public static StateRow FromDraft(SegmentStudioItem item) =>
            new(
                null,
                item.Id,
                null,
                item.Id,
                false,
                item.Revision,
                item.UpdatedAt,
                item.TagId!.Value,
                item.StartSec!.Value,
                item.EndSec,
                item.SourceKey ?? "user",
                item.SourceRunId,
                item.Confidence,
                item.ReviewState!);
    }
}
