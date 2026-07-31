using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record BulkSegmentTagTarget(
    int? NativeSegmentId,
    long? ItemId,
    DateTime? ExpectedUpdatedAt,
    long? ExpectedRevision);

public sealed record BulkSegmentTagRequest(
    Guid OperationId,
    int TagId,
    IReadOnlyList<BulkSegmentTagTarget> Segments,
    Guid? HistoryReceiptId = null);

public enum BulkSegmentTagStatus
{
    Updated,
    NotFound,
    Forbidden,
    Conflict,
    Invalid,
}

public sealed record BulkSegmentTagResult(
    BulkSegmentTagStatus Status,
    int UpdatedCount = 0,
    IReadOnlyList<int>? NativeSegmentIds = null,
    string? Error = null,
    bool Replayed = false,
    string? Code = null);

public static class BulkSegmentTagService
{
    private const string OperationKind = "bulk-change-tag";

    public static async Task<BulkSegmentTagResult> UpdateAsync(
        DbContext db,
        int videoId,
        BulkSegmentTagRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct,
        bool preserveExtensionMetadata = true)
    {
        if (request.OperationId == Guid.Empty)
            return new(BulkSegmentTagStatus.Invalid, Error: "Operation ID is required.");
        if (request.TagId <= 0)
            return new(BulkSegmentTagStatus.Invalid, Error: "Tag is required.");
        if (request.Segments.Count is < 2 or > 5000)
            return new(BulkSegmentTagStatus.Invalid, Error: "Select between 2 and 5000 segments.");
        if (request.Segments.Any(target =>
                (target.NativeSegmentId is null) == (target.ItemId is null)
                || target.NativeSegmentId is not null && target.ExpectedUpdatedAt is null
                || target.ItemId is not null && target.ExpectedRevision is null))
            return new(BulkSegmentTagStatus.Invalid, Error: "Every selected segment must have one complete stable identity.");
        if (!preserveExtensionMetadata
            && request.Segments.Any(target => target.ItemId is not null))
            return new(
                BulkSegmentTagStatus.Invalid,
                Error: "Basic mode can retag only native Cove segments.");

        var orderedTargets = request.Segments
            .OrderBy(target => target.NativeSegmentId is null ? 1 : 0)
            .ThenBy(target => target.NativeSegmentId)
            .ThenBy(target => target.ItemId)
            .ToArray();
        var identities = orderedTargets
            .Select(target => target.NativeSegmentId is int nativeId ? $"native:{nativeId}" : $"item:{target.ItemId}")
            .ToArray();
        if (identities.Distinct(StringComparer.Ordinal).Count() != identities.Length)
            return new(BulkSegmentTagStatus.Invalid, Error: "A segment can only appear once.");
        var fingerprint = Fingerprint(videoId, request.TagId, orderedTargets);
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(BulkSegmentTagStatus.Forbidden, Error: access.Reason ?? "You cannot edit segments for this video.");
        var replay = await ReplayAsync(db, request.OperationId, fingerprint, principal, ct);
        if (replay is not null)
            return replay;
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == request.TagId, ct))
            return new(BulkSegmentTagStatus.Invalid, Error: "Tag not found.");

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        replay = await ReplayAsync(db, request.OperationId, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var nativeIds = orderedTargets
            .Where(target => target.NativeSegmentId is not null)
            .Select(target => target.NativeSegmentId!.Value)
            .ToArray();
        var itemIds = orderedTargets
            .Where(target => target.ItemId is not null)
            .Select(target => target.ItemId!.Value)
            .ToArray();
        var nativeSegments = await db.Set<Segment>().AsNoTracking()
            .Where(segment => nativeIds.Contains(segment.Id)
                && segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .ToDictionaryAsync(segment => segment.Id, ct);
        var drafts = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => itemIds.Contains(item.Id)
                && item.NativeSegmentId == null
                && item.VideoId == videoId
                && item.ReviewState != null
                && item.TagId != null
                && item.StartSec != null)
            .ToDictionaryAsync(item => item.Id, ct);
        if (nativeSegments.Count != nativeIds.Length || drafts.Count != itemIds.Length)
            return new(BulkSegmentTagStatus.NotFound, Error: "One or more selected segments no longer exist.");

        foreach (var target in orderedTargets)
        {
            if (target.NativeSegmentId is int nativeId)
            {
                var segment = nativeSegments[nativeId];
                if (segment.UpdatedAt != target.ExpectedUpdatedAt)
                    return new(BulkSegmentTagStatus.Conflict,
                        Error: "One or more selected segments changed. Reload before changing their tag.");
                if (segment.TagId == request.TagId)
                    continue;
                var nativeResult = await DirectSegmentReviewService.UpdateAuthorizedAsync(
                    db,
                    videoId,
                    nativeId,
                    new DirectSegmentMutationRequest(
                        null, segment.StartSec, segment.EndSec, segment.UpdatedAt, request.TagId),
                    principal,
                    authorization,
                    ct,
                    preserveExtensionMetadata);
                if (nativeResult.Status != DirectSegmentMutationStatus.Updated)
                    return FromDirect(nativeResult);
                continue;
            }

            var item = drafts[target.ItemId!.Value];
            if (item.Revision != target.ExpectedRevision)
                return new(BulkSegmentTagStatus.Conflict,
                    Error: "One or more selected segments changed. Reload before changing their tag.");
            if (item.TagId == request.TagId)
                continue;
            var operationId = ChildOperationId(request.OperationId, item.Id);
            var draftResult = await SegmentStudioDraftService.UpdateAsync(
                db,
                videoId,
                item.Id,
                new UpdateSegmentDraftRequest(
                    operationId,
                    item.Revision,
                    item.StartSec!.Value,
                    item.EndSec,
                    request.TagId),
                principal,
                authorization,
                ct);
            if (draftResult.Status != SegmentDraftMutationStatus.Updated)
                return FromDraft(draftResult);
        }

        var changedNativeIds = nativeIds
            .Where(nativeId => nativeSegments[nativeId].TagId != request.TagId)
            .ToArray();
        var updatedCount = orderedTargets.Count(target =>
            target.NativeSegmentId is int nativeId
                ? nativeSegments[nativeId].TagId != request.TagId
                : drafts[target.ItemId!.Value].TagId != request.TagId);
        var value = new BulkSegmentTagResult(
            BulkSegmentTagStatus.Updated,
            updatedCount,
            changedNativeIds);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = OperationKind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            ResultPayloadJson = JsonSerializer.Serialize(value),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        return value;
    }

    private static BulkSegmentTagResult FromDirect(DirectSegmentMutationResult result) =>
        new(result.Status switch
        {
            DirectSegmentMutationStatus.NotFound => BulkSegmentTagStatus.NotFound,
            DirectSegmentMutationStatus.Forbidden => BulkSegmentTagStatus.Forbidden,
            DirectSegmentMutationStatus.Conflict => BulkSegmentTagStatus.Conflict,
            _ => BulkSegmentTagStatus.Invalid,
        }, Error: result.Error, Code: result.Code);

    private static BulkSegmentTagResult FromDraft(SegmentDraftMutationResult result) =>
        new(result.Status switch
        {
            SegmentDraftMutationStatus.NotFound => BulkSegmentTagStatus.NotFound,
            SegmentDraftMutationStatus.Forbidden => BulkSegmentTagStatus.Forbidden,
            SegmentDraftMutationStatus.Conflict => BulkSegmentTagStatus.Conflict,
            _ => BulkSegmentTagStatus.Invalid,
        }, Error: result.Error, Code: result.Code);

    private static async Task<BulkSegmentTagResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string fingerprint,
        CovePrincipal? principal,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != OperationKind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return new(BulkSegmentTagStatus.Conflict,
                Error: "The operation ID was already used for a different request.");
        var result = JsonSerializer.Deserialize<BulkSegmentTagResult>(receipt.ResultPayloadJson!);
        return result is null
            ? new(BulkSegmentTagStatus.Conflict, Error: "The saved operation result could not be read.")
            : result with { Replayed = true };
    }

    private static string Fingerprint(int videoId, int tagId, IReadOnlyList<BulkSegmentTagTarget> targets)
    {
        var canonical = JsonSerializer.Serialize(new { videoId, tagId, targets });
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(canonical))).ToLowerInvariant();
    }

    private static Guid ChildOperationId(Guid operationId, long itemId)
    {
        var input = operationId.ToByteArray().Concat(BitConverter.GetBytes(itemId)).ToArray();
        return new Guid(SHA256.HashData(input).AsSpan(0, 16));
    }
}
