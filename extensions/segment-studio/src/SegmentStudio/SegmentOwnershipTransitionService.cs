using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public enum SegmentTransitionStatus
{
    Updated,
    NotFound,
    Forbidden,
    Conflict,
    Invalid,
    MissingImage,
}

public sealed record MoveToBinRequest(
    Guid OperationId,
    DateTime ExpectedUpdatedAt,
    bool DiscardMissingImage = false,
    string ReviewState = "rejected",
    Guid? HistoryReceiptId = null,
    bool PreserveLineage = false);
public sealed record BulkMoveToBinItem(int SegmentId, DateTime ExpectedUpdatedAt);
public sealed record BulkMoveToBinRequest(
    Guid OperationId,
    IReadOnlyList<BulkMoveToBinItem> Segments,
    bool DiscardMissingImage = false,
    string ReviewState = "rejected",
    Guid? HistoryReceiptId = null);
public sealed record BulkMoveToBinItemResult(int SegmentId, long ItemId, long Revision);
public sealed record BulkMoveToBinResult(
    SegmentTransitionStatus Status,
    IReadOnlyList<BulkMoveToBinItemResult>? Items = null,
    int? VideoId = null,
    string? Error = null,
    bool Replayed = false,
    string? Code = null);
public sealed record OwnedSegmentMutationRequest(Guid OperationId, long ExpectedRevision, bool DiscardMissingImage = false);
public sealed record EmptyBinRequest(Guid OperationId, string ExpectedFingerprint);
public sealed record SegmentTransitionResult(
    SegmentTransitionStatus Status,
    long? ItemId = null,
    int? NativeSegmentId = null,
    long? Revision = null,
    int? VideoId = null,
    string? Error = null,
    bool Replayed = false,
    string? Code = null);
public sealed record BinSnapshot(
    IReadOnlyList<RejectedSegmentItem> Items,
    int TotalCount,
    string Fingerprint);
public sealed record EmptyBinResult(
    SegmentTransitionStatus Status,
    int DeletedCount = 0,
    IReadOnlyList<int>? VideoIds = null,
    string? Error = null,
    bool Replayed = false);

public sealed record RejectedSegmentItem(
    long ItemId,
    int VideoId,
    string? VideoTitle,
    int TagId,
    string? TagName,
    double StartSec,
    double? EndSec,
    string SourceKey,
    string? SourceRunId,
    float? Confidence,
    string? Title,
    string? ImageBlobId,
    long Revision,
    DateTime UpdatedAt);

public static class SegmentOwnershipTransitionService
{
    private const string MoveKind = "move-to-bin";
    private const string BulkMoveKind = "bulk-move-to-bin";
    private const string RestoreKind = "restore-from-bin";
    private const string PurgeKind = "purge-bin-item";
    private const string EmptyBinKind = "empty-bin";

    public static async Task<SegmentTransitionResult> MoveToBinAsync(
        DbContext db,
        int videoId,
        int segmentId,
        MoveToBinRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.ReviewState is not ("unreviewed" or "rejected"))
            return new(SegmentTransitionStatus.Invalid, Error: "Native segments can only move to Unreviewed or Rejected draft state.");
        var fingerprint = Fingerprint(MoveKind, videoId, segmentId, request.ExpectedUpdatedAt,
            request.DiscardMissingImage, request.ReviewState, request.PreserveLineage);
        var replay = await ReplayAsync(db, request.OperationId, MoveKind, fingerprint, principal, ct);
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden, Error: access.Reason ?? "You cannot delete segments for this video.");
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        await LockNativeSegmentAsync(db, segmentId, ct);
        replay = await ReplayAsync(db, request.OperationId, MoveKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var segment = await db.Set<Segment>().SingleOrDefaultAsync(candidate =>
            candidate.Id == segmentId
            && candidate.HostType == SegmentHostType.Video
            && candidate.HostId == videoId
            && candidate.Kind == "tag"
            && candidate.TagId != null, ct);
        if (segment is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Segment not found.");
        if (segment.UpdatedAt != request.ExpectedUpdatedAt)
            return new(SegmentTransitionStatus.Conflict, NativeSegmentId: segment.Id, VideoId: videoId,
                Error: "This segment changed in another session. Reload it before moving it to the bin.");
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == segment.TagId, ct))
            return new(SegmentTransitionStatus.Invalid, Error: "The segment tag no longer exists.");

        var imageError = await ValidateImageAsync(blobs, segment.ImageBlobId, request.DiscardMissingImage, ct);
        if (imageError is not null)
            return new(SegmentTransitionStatus.MissingImage, NativeSegmentId: segment.Id, VideoId: videoId, Error: imageError);

        var item = await db.Set<SegmentStudioItem>().SingleOrDefaultAsync(candidate => candidate.NativeSegmentId == segmentId, ct);
        if (item is not null && !request.PreserveLineage)
        {
            var pruning = await BasicBinLineagePruningService.ApplyAsync(
                db, [item.Id], principal, authorization, ct);
            if (!pruning.Succeeded)
                return new(
                    SegmentTransitionStatus.Conflict,
                    item.Id,
                    segment.Id,
                    item.Revision,
                    videoId,
                    pruning.Error,
                    Code: pruning.Code);
        }
        var now = DateTime.UtcNow;
        if (item is null)
        {
            item = new SegmentStudioItem { CreatedAt = now };
            db.Add(item);
        }

        PopulateOwnedItem(item, segment, request.ReviewState, request.DiscardMissingImage, now);

        // An existing anchor already has a stable lineage node. Update every
        // eligible descendant in this same SaveChanges unit before the native
        // representation is removed.
        if (request.ReviewState == "rejected" && item.Id != 0)
            await DerivedSegmentRejectionService.RejectDescendantsAsync(db, item.Id, ct);

        // Persist the ownership change before deleting the tracked native entity so the
        // native FK cascade cannot remove the stable metadata anchor or its slots.
        await db.SaveChangesAsync(ct);
        segment.ImageBlobId = null;
        db.Remove(segment);
        var result = new SegmentTransitionResult(
            SegmentTransitionStatus.Updated, item.Id, null, item.Revision, videoId);
        db.Add(CreateReceipt(request.OperationId, MoveKind, fingerprint, principal, item.Id, segmentId, null, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<BulkMoveToBinResult> MoveManyToBinAsync(
        DbContext db,
        int videoId,
        BulkMoveToBinRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        if (request.ReviewState is not ("unreviewed" or "rejected"))
            return new(SegmentTransitionStatus.Invalid, Error: "Native segments can only move to Unreviewed or Rejected draft state.");
        if (request.Segments.Count is < 1 or > 5000)
            return new(SegmentTransitionStatus.Invalid, Error: "Select between 1 and 5000 native segments.");
        if (request.Segments.Select(item => item.SegmentId).Distinct().Count() != request.Segments.Count)
            return new(SegmentTransitionStatus.Invalid, Error: "A native segment can only appear once.");

        var orderedRequests = request.Segments.OrderBy(item => item.SegmentId).ToArray();
        var fingerprint = Fingerprint(BulkMoveKind, videoId, orderedRequests, request.DiscardMissingImage, request.ReviewState);
        var replay = await ReplayBulkAsync(db, request.OperationId, fingerprint, principal, ct);
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden, Error: access.Reason ?? "You cannot delete segments for this video.");
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        await LockNativeSegmentsAsync(db, orderedRequests.Select(item => item.SegmentId).ToArray(), ct);
        replay = await ReplayBulkAsync(db, request.OperationId, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var requestedById = orderedRequests.ToDictionary(item => item.SegmentId);
        var segmentIds = requestedById.Keys.ToArray();
        var segments = await db.Set<Segment>().AsNoTracking()
            .Where(segment => segmentIds.Contains(segment.Id)
                && segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .OrderBy(segment => segment.Id)
            .ToListAsync(ct);
        if (segments.Count != segmentIds.Length)
            return new(SegmentTransitionStatus.NotFound, Error: "One or more selected segments no longer exist.");
        if (segments.Any(segment => segment.UpdatedAt != requestedById[segment.Id].ExpectedUpdatedAt))
            return new(SegmentTransitionStatus.Conflict, VideoId: videoId,
                Error: "One or more selected segments changed in another session. Reload before moving them to the bin.",
                Code: "CANONICAL_SEGMENT_CHANGED");

        var tagIds = segments.Select(segment => segment.TagId!.Value).Distinct().ToArray();
        var existingTagCount = await db.Set<Tag>().AsNoTracking().CountAsync(tag => tagIds.Contains(tag.Id), ct);
        if (existingTagCount != tagIds.Length)
            return new(SegmentTransitionStatus.Invalid, Error: "One or more segment tags no longer exist.");
        foreach (var segment in segments)
        {
            var imageError = await ValidateImageAsync(blobs, segment.ImageBlobId, request.DiscardMissingImage, ct);
            if (imageError is not null)
                return new(SegmentTransitionStatus.MissingImage, VideoId: videoId, Error: imageError);
        }

        var itemsByNativeId = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId != null && segmentIds.Contains(item.NativeSegmentId.Value))
            .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
        var existingItemIds = itemsByNativeId.Values.Select(item => item.Id).ToArray();
        var pruning = await BasicBinLineagePruningService.ApplyAsync(
            db, existingItemIds, principal, authorization, ct);
        if (!pruning.Succeeded)
            return new(
                SegmentTransitionStatus.Conflict,
                VideoId: videoId,
                Error: pruning.Error,
                Code: pruning.Code);
        var now = DateTime.UtcNow;
        BulkMoveToBinItemResult[] movedItems;
        if (db.Database.IsRelational())
        {
            var unregisteredSegments = segments
                .Where(segment => !itemsByNativeId.ContainsKey(segment.Id))
                .ToArray();
            if (unregisteredSegments.Length > 0)
            {
                db.AddRange(unregisteredSegments.Select(segment => new SegmentStudioItem
                {
                    NativeSegmentId = segment.Id,
                    CreatedAt = now,
                    UpdatedAt = now,
                }));
                await db.SaveChangesAsync(ct);
                itemsByNativeId = await db.Set<SegmentStudioItem>().AsNoTracking()
                    .Where(item => item.NativeSegmentId != null && segmentIds.Contains(item.NativeSegmentId.Value))
                    .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
            }
            var itemIds = itemsByNativeId.Values.Select(item => item.Id).ToArray();
            var updated = await db.Database.ExecuteSqlInterpolatedAsync($"""
                UPDATE segment_studio_items AS item
                SET native_segment_id = NULL,
                    review_state = {request.ReviewState},
                    representation_schema_version = 1,
                    video_id = segment."HostId",
                    start_sec = segment."StartSec",
                    end_sec = segment."EndSec",
                    tag_id = segment."TagId",
                    kind = segment."Kind",
                    ref_id = segment."RefId",
                    payload = segment."Payload",
                    source_key = segment."SourceKey",
                    source_run_id = segment."SourceRunId",
                    confidence = segment."Confidence",
                    title = segment."Title",
                    color_hint = segment."ColorHint",
                    extension_image_blob_id = CASE
                        WHEN {request.DiscardMissingImage} THEN NULL
                        ELSE segment."ImageBlobId"
                    END,
                    revision = item.revision + 1,
                    updated_at = {now}
                FROM segments AS segment
                WHERE item.native_segment_id = segment."Id"
                  AND segment."Id" = ANY ({segmentIds})
                """, ct);
            if (updated != segmentIds.Length)
                return new(SegmentTransitionStatus.Conflict, VideoId: videoId,
                    Error: "The selected segments changed while the bulk update was running.");
            if (request.ReviewState == "rejected")
                await DerivedSegmentRejectionService.RejectDescendantsAsync(db, itemIds, ct);
            await db.Set<Segment>()
                .Where(segment => segmentIds.Contains(segment.Id))
                .ExecuteUpdateAsync(setters => setters.SetProperty(segment => segment.ImageBlobId, (string?)null), ct);
            await db.Set<Segment>()
                .Where(segment => segmentIds.Contains(segment.Id))
                .ExecuteDeleteAsync(ct);
            movedItems = segments.Select(segment =>
            {
                var item = itemsByNativeId[segment.Id];
                return new BulkMoveToBinItemResult(segment.Id, item.Id, item.Revision + 1);
            }).ToArray();
        }
        else
        {
            var trackedSegments = await db.Set<Segment>()
                .Where(segment => segmentIds.Contains(segment.Id))
                .OrderBy(segment => segment.Id)
                .ToListAsync(ct);
            var trackedItems = await db.Set<SegmentStudioItem>()
                .Where(item => item.NativeSegmentId != null && segmentIds.Contains(item.NativeSegmentId.Value))
                .ToDictionaryAsync(item => item.NativeSegmentId!.Value, ct);
            foreach (var segment in trackedSegments.Where(segment => !trackedItems.ContainsKey(segment.Id)))
            {
                var item = new SegmentStudioItem
                {
                    NativeSegmentId = segment.Id,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(item);
                trackedItems.Add(segment.Id, item);
            }
            foreach (var segment in trackedSegments)
                PopulateOwnedItem(trackedItems[segment.Id], segment, request.ReviewState, request.DiscardMissingImage, now);
            await db.SaveChangesAsync(ct);
            if (request.ReviewState == "rejected")
                await DerivedSegmentRejectionService.RejectDescendantsAsync(
                    db, trackedItems.Values.Select(item => item.Id).ToArray(), ct);
            foreach (var segment in trackedSegments)
            {
                segment.ImageBlobId = null;
                db.Remove(segment);
            }
            movedItems = trackedSegments.Select(segment =>
            {
                var item = trackedItems[segment.Id];
                return new BulkMoveToBinItemResult(segment.Id, item.Id, item.Revision);
            }).ToArray();
        }
        var result = new BulkMoveToBinResult(
            SegmentTransitionStatus.Updated,
            movedItems,
            videoId);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = BulkMoveKind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentTransitionResult> RestoreAsync(
        DbContext db,
        long itemId,
        OwnedSegmentMutationRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        var fingerprint = Fingerprint(RestoreKind, itemId, request.ExpectedRevision, request.DiscardMissingImage);
        var replay = await ReplayAsync(db, request.OperationId, RestoreKind, fingerprint, principal, ct);
        if (replay is not null && replay.Status != SegmentTransitionStatus.Updated)
            return replay;
        if (replay is not null)
        {
            if (replay.VideoId is not int replayVideoId
                || !await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == replayVideoId, ct))
                return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
            var replayAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, replayVideoId), ct);
            return replayAccess.Allowed
                ? replay
                : new(SegmentTransitionStatus.Forbidden, Error: replayAccess.Reason ?? "You cannot restore segments for this video.");
        }

        await LockItemAsync(db, itemId, ct);
        replay = await ReplayAsync(db, request.OperationId, RestoreKind, fingerprint, principal, ct);
        if (replay is not null)
        {
            if (replay.Status != SegmentTransitionStatus.Updated)
                return replay;
            if (replay.VideoId is not int replayVideoId
                || !await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == replayVideoId, ct))
                return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
            var replayAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, replayVideoId), ct);
            return replayAccess.Allowed
                ? replay
                : new(SegmentTransitionStatus.Forbidden, Error: replayAccess.Reason ?? "You cannot restore segments for this video.");
        }

        var item = await db.Set<SegmentStudioItem>().SingleOrDefaultAsync(candidate => candidate.Id == itemId, ct);
        if (item is null || item.NativeSegmentId is not null || item.ReviewState != "rejected" || item.VideoId is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Rejected segment not found.");
        var videoId = item.VideoId.Value;
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden, ItemId: itemId, VideoId: videoId,
                Error: access.Reason ?? "You cannot restore segments for this video.");
        if (item.Revision != request.ExpectedRevision)
            return new(SegmentTransitionStatus.Conflict, item.Id, Revision: item.Revision, VideoId: videoId,
                Error: "This rejected segment changed in another session. Reload it before restoring it.");
        if (await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .AnyAsync(example => example.ItemId == item.Id, ct))
            return new(
                SegmentTransitionStatus.Conflict,
                item.Id,
                Revision: item.Revision,
                VideoId: videoId,
                Error: "Remove this segment from the incorrect-example collection before restoring it.",
                Code: "INCORRECT_EXAMPLE_PROTECTED");
        if (item.TagId is null || !await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == item.TagId, ct))
            return new(SegmentTransitionStatus.Invalid, item.Id, Revision: item.Revision, VideoId: videoId,
                Error: "The segment tag no longer exists.");

        var imageError = await ValidateImageAsync(blobs, item.ExtensionImageBlobId, request.DiscardMissingImage, ct);
        if (imageError is not null)
            return new(SegmentTransitionStatus.MissingImage, item.Id, Revision: item.Revision, VideoId: videoId, Error: imageError);

        var now = DateTime.UtcNow;
        var segment = new Segment
        {
            HostType = SegmentHostType.Video,
            HostId = videoId,
            StartSec = item.StartSec!.Value,
            EndSec = item.EndSec,
            TagId = item.TagId,
            Kind = item.Kind,
            RefId = item.RefId,
            Payload = item.PayloadJson is null ? null : JsonDocument.Parse(item.PayloadJson),
            SourceKey = item.SourceKey!,
            SourceRunId = item.SourceRunId,
            Confidence = item.Confidence,
            Title = item.Title,
            ColorHint = item.ColorHint,
            ImageBlobId = request.DiscardMissingImage ? null : item.ExtensionImageBlobId,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(segment);
        await db.SaveChangesAsync(ct);

        item.NativeSegmentId = segment.Id;
        ClearOwnedRepresentation(item);
        item.Revision++;
        item.UpdatedAt = now;
        var result = new SegmentTransitionResult(
            SegmentTransitionStatus.Updated, item.Id, segment.Id, item.Revision, videoId);
        db.Add(CreateReceipt(request.OperationId, RestoreKind, fingerprint, principal, item.Id, null, segment.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentTransitionResult> PurgeAsync(
        DbContext db,
        long itemId,
        OwnedSegmentMutationRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var fingerprint = Fingerprint(PurgeKind, itemId, request.ExpectedRevision);
        var replay = await ReplayAsync(db, request.OperationId, PurgeKind, fingerprint, principal, ct);
        if (replay is not null && replay.Status != SegmentTransitionStatus.Updated)
            return replay;
        if (replay is not null)
        {
            if (replay.VideoId is not int replayVideoId
                || !await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == replayVideoId, ct))
                return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
            var replayAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, replayVideoId), ct);
            return replayAccess.Allowed
                ? replay
                : new(SegmentTransitionStatus.Forbidden, Error: replayAccess.Reason ?? "You cannot permanently delete segments for this video.");
        }

        await LockItemAsync(db, itemId, ct);
        replay = await ReplayAsync(db, request.OperationId, PurgeKind, fingerprint, principal, ct);
        if (replay is not null)
        {
            if (replay.Status != SegmentTransitionStatus.Updated)
                return replay;
            if (replay.VideoId is not int replayVideoId
                || !await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == replayVideoId, ct))
                return new(SegmentTransitionStatus.NotFound, Error: "Video not found.");
            var replayAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, replayVideoId), ct);
            return replayAccess.Allowed
                ? replay
                : new(SegmentTransitionStatus.Forbidden, Error: replayAccess.Reason ?? "You cannot permanently delete segments for this video.");
        }

        var item = await db.Set<SegmentStudioItem>().SingleOrDefaultAsync(candidate => candidate.Id == itemId, ct);
        if (item is null || item.NativeSegmentId is not null || item.ReviewState != "rejected" || item.VideoId is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Rejected segment not found.");
        var videoId = item.VideoId.Value;
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden, ItemId: itemId, VideoId: videoId,
                Error: access.Reason ?? "You cannot permanently delete segments for this video.");
        if (item.Revision != request.ExpectedRevision)
            return new(SegmentTransitionStatus.Conflict, item.Id, Revision: item.Revision, VideoId: videoId,
                Error: "This rejected segment changed in another session. Reload it before deleting it.");
        if (await DerivedTagGuard.IsDerivedItemAsync(db, item.Id, ct)
            || await DerivedTagGuard.HasOutgoingEdgesAsync(db, item.Id, ct))
            return new(
                SegmentTransitionStatus.Conflict,
                item.Id,
                Revision: item.Revision,
                VideoId: videoId,
                Error: "This segment has derivation relationships. Delete it from the Full Segments inventory.",
                Code: "DERIVATION_DELETE_REQUIRED");
        if (await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .AnyAsync(example => example.ItemId == item.Id, ct))
            return new(
                SegmentTransitionStatus.Conflict,
                item.Id,
                Revision: item.Revision,
                VideoId: videoId,
                Error: "Remove this segment from the incorrect-example collection before deleting it.",
                Code: "INCORRECT_EXAMPLE_PROTECTED");

        var blobId = item.ExtensionImageBlobId;
        var result = new SegmentTransitionResult(SegmentTransitionStatus.Updated, item.Id, Revision: item.Revision, VideoId: videoId);
        db.Add(CreateReceipt(request.OperationId, PurgeKind, fingerprint, principal, null, null, null, result));
        if (!db.Database.IsRelational() && !string.IsNullOrWhiteSpace(blobId))
        {
            db.Add(new SegmentStudioBlobCleanupOutbox
            {
                BlobId = blobId,
                Status = "pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
        }
        db.Remove(item);
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<IReadOnlyList<RejectedSegmentItem>> ListRejectedAsync(
        DbContext db,
        int? videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var candidateVideoIds = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId == null
                && item.ReviewState == "rejected"
                && item.VideoId != null
                && !db.Set<SegmentStudioLineageNode>().Any(node =>
                    node.ItemId == item.Id
                    && db.Set<SegmentStudioDerivationEdge>().Any(edge =>
                        edge.SourceNodeId == node.Id || edge.DerivedNodeId == node.Id))
                && (videoId == null || item.VideoId == videoId))
            .Select(item => item.VideoId!.Value)
            .Distinct()
            .ToListAsync(ct);
        var visibleVideoIds = new List<int>(candidateVideoIds.Count);
        foreach (var candidateVideoId in candidateVideoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsRead,
                EntityRef.Of(EntityKinds.Video, candidateVideoId), ct);
            if (access.Allowed)
                visibleVideoIds.Add(candidateVideoId);
        }

        var query = from item in db.Set<SegmentStudioItem>().AsNoTracking()
                    join video in db.Set<Video>().AsNoTracking() on item.VideoId equals video.Id
                    join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
                    where item.NativeSegmentId == null
                        && item.ReviewState == "rejected"
                        && item.VideoId != null
                        && !db.Set<SegmentStudioLineageNode>().Any(node =>
                            node.ItemId == item.Id
                            && db.Set<SegmentStudioDerivationEdge>().Any(edge =>
                                edge.SourceNodeId == node.Id || edge.DerivedNodeId == node.Id))
                        && visibleVideoIds.Contains(item.VideoId.Value)
                    select new { Item = item, Video = video, Tag = tag };
        if (videoId is int id)
            query = query.Where(row => row.Item.VideoId == id);
        return await query.OrderByDescending(row => row.Item.UpdatedAt).ThenByDescending(row => row.Item.Id)
            .Select(row => new RejectedSegmentItem(
                row.Item.Id, row.Video.Id, row.Video.Title ?? row.Video.FileSearchText,
                row.Tag.Id, row.Tag.Name, row.Item.StartSec!.Value, row.Item.EndSec,
                row.Item.SourceKey!, row.Item.SourceRunId, row.Item.Confidence, row.Item.Title,
                row.Item.ExtensionImageBlobId, row.Item.Revision, row.Item.UpdatedAt))
            .ToListAsync(ct);
    }

    public static async Task<BinSnapshot> GetBinAsync(
        DbContext db,
        int? videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var items = await ListRejectedAsync(db, videoId, principal, authorization, ct);
        return new(items, items.Count, BinFingerprint(items));
    }

    public static async Task<EmptyBinResult> EmptyBinAsync(
        DbContext db,
        EmptyBinRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        if (string.IsNullOrWhiteSpace(request.ExpectedFingerprint))
            return new(SegmentTransitionStatus.Invalid, Error: "The recycling-bin fingerprint is required.");

        var requestFingerprint = Fingerprint(EmptyBinKind, request.ExpectedFingerprint);
        var replay = await ReplayEmptyBinAsync(
            db, request.OperationId, requestFingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var snapshot = await GetBinAsync(db, null, principal, authorization, ct);
        if (!string.Equals(snapshot.Fingerprint, request.ExpectedFingerprint, StringComparison.Ordinal))
            return new(SegmentTransitionStatus.Conflict, Error: "The recycling bin changed. Reload it before emptying.");

        var videoIds = snapshot.Items.Select(item => item.VideoId).Distinct().Order().ToArray();
        foreach (var videoId in videoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, videoId), ct);
            if (!access.Allowed)
                return new(SegmentTransitionStatus.Forbidden,
                    Error: access.Reason ?? "You cannot permanently delete every segment in the recycling bin.");
        }

        var itemIds = snapshot.Items.Select(item => item.ItemId).Order().ToArray();
        await LockItemsAsync(db, itemIds, ct);
        replay = await ReplayEmptyBinAsync(
            db, request.OperationId, requestFingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var lockedSnapshot = await GetBinAsync(db, null, principal, authorization, ct);
        if (!string.Equals(lockedSnapshot.Fingerprint, request.ExpectedFingerprint, StringComparison.Ordinal))
            return new(SegmentTransitionStatus.Conflict, Error: "The recycling bin changed. Reload it before emptying.");
        if (await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .AnyAsync(example => example.ItemId != null
                && itemIds.Contains(example.ItemId.Value), ct))
            return new(SegmentTransitionStatus.Conflict,
                Error: "Remove protected incorrect examples before emptying the recycling bin.");

        var items = await db.Set<SegmentStudioItem>()
            .Where(item => itemIds.Contains(item.Id))
            .OrderBy(item => item.Id)
            .ToListAsync(ct);
        if (items.Count != itemIds.Length)
            return new(SegmentTransitionStatus.Conflict, Error: "The recycling bin changed. Reload it before emptying.");

        if (!db.Database.IsRelational())
        {
            foreach (var blobId in items.Select(item => item.ExtensionImageBlobId)
                .Where(blobId => !string.IsNullOrWhiteSpace(blobId)).Distinct())
            {
                db.Add(new SegmentStudioBlobCleanupOutbox
                {
                    BlobId = blobId!,
                    Status = "pending",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
            }
        }

        var result = new EmptyBinResult(
            SegmentTransitionStatus.Updated, items.Count, videoIds);
        db.RemoveRange(items);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = EmptyBinKind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = requestFingerprint,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<int> ProcessPendingBlobCleanupAsync(
        DbContext db,
        IBlobService blobs,
        int maximumCount,
        CancellationToken ct)
    {
        var staleProcessingBefore = DateTime.UtcNow.AddMinutes(-5);
        var entries = await db.Set<SegmentStudioBlobCleanupOutbox>()
            .Where(entry => entry.Status == "pending"
                || entry.Status == "failed"
                || (entry.Status == "processing" && entry.UpdatedAt < staleProcessingBefore))
            .OrderBy(entry => entry.CreatedAt)
            .ThenBy(entry => entry.Id)
            .Take(Math.Clamp(maximumCount, 1, 100))
            .ToListAsync(ct);
        var completed = 0;
        foreach (var entry in entries)
        {
            entry.Status = "processing";
            entry.AttemptCount++;
            entry.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
            try
            {
                await blobs.DeleteBlobAsync(entry.BlobId, ct);
                entry.Status = "completed";
                entry.LastError = null;
                completed++;
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                entry.Status = "failed";
                entry.LastError = exception.Message;
            }
            entry.UpdatedAt = DateTime.UtcNow;
            await db.SaveChangesAsync(ct);
        }
        return completed;
    }

    private static async Task<string?> ValidateImageAsync(
        IBlobService blobs,
        string? blobId,
        bool discardMissingImage,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(blobId) || discardMissingImage)
            return null;
        var blob = await blobs.GetBlobAsync(blobId, ct);
        if (blob is null)
            return "The segment image is missing. Repair it or explicitly discard the image before continuing.";
        await blob.Value.Stream.DisposeAsync();
        return null;
    }

    private static void ClearOwnedRepresentation(SegmentStudioItem item)
    {
        item.ReviewState = null;
        item.VideoId = null;
        item.StartSec = null;
        item.EndSec = null;
        item.TagId = null;
        item.Kind = null;
        item.RefId = null;
        item.PayloadJson = null;
        item.SourceKey = null;
        item.SourceRunId = null;
        item.Confidence = null;
        item.Title = null;
        item.ColorHint = null;
        item.ExtensionImageBlobId = null;
    }

    private static SegmentStudioSegmentOperation CreateReceipt(
        Guid operationId,
        string kind,
        string fingerprint,
        CovePrincipal? principal,
        long? itemId,
        int? sourceNativeSegmentId,
        int? resultNativeSegmentId,
        SegmentTransitionResult result) => new()
        {
            OperationId = operationId,
            Kind = kind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            ItemId = itemId,
            SourceNativeSegmentId = sourceNativeSegmentId,
            ResultNativeSegmentId = resultNativeSegmentId,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        };

    private static void PopulateOwnedItem(
        SegmentStudioItem item,
        Segment segment,
        string reviewState,
        bool discardMissingImage,
        DateTime now)
    {
        item.NativeSegmentId = null;
        item.ReviewState = reviewState;
        item.RepresentationSchemaVersion = 1;
        item.VideoId = segment.HostId;
        item.StartSec = segment.StartSec;
        item.EndSec = segment.EndSec;
        item.TagId = segment.TagId;
        item.Kind = segment.Kind;
        item.RefId = segment.RefId;
        item.PayloadJson = segment.Payload?.RootElement.GetRawText();
        item.SourceKey = segment.SourceKey;
        item.SourceRunId = segment.SourceRunId;
        item.Confidence = segment.Confidence;
        item.Title = segment.Title;
        item.ColorHint = segment.ColorHint;
        item.ExtensionImageBlobId = discardMissingImage ? null : segment.ImageBlobId;
        item.Revision++;
        item.UpdatedAt = now;
    }

    private static async Task<BulkMoveToBinResult?> ReplayBulkAsync(
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
        if (receipt.Kind != BulkMoveKind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return new(SegmentTransitionStatus.Conflict, Error: "The operation ID was already used for a different request.");
        var result = JsonSerializer.Deserialize<BulkMoveToBinResult>(receipt.ResultPayloadJson!);
        return result is null
            ? new(SegmentTransitionStatus.Conflict, Error: "The saved operation result could not be read.")
            : result with { Replayed = true };
    }

    private static async Task<SegmentTransitionResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string kind,
        string fingerprint,
        CovePrincipal? principal,
        CancellationToken ct)
    {
        if (operationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != kind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return new(SegmentTransitionStatus.Conflict, Error: "The operation ID was already used for a different request.");
        var result = receipt.ResultPayloadJson is null
            ? new SegmentTransitionResult(SegmentTransitionStatus.Updated, receipt.ItemId, receipt.ResultNativeSegmentId)
            : JsonSerializer.Deserialize<SegmentTransitionResult>(receipt.ResultPayloadJson)!;
        return result with { Replayed = true };
    }

    private static async Task<EmptyBinResult?> ReplayEmptyBinAsync(
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
        if (receipt.Kind != EmptyBinKind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return new(SegmentTransitionStatus.Conflict,
                Error: "The operation ID was already used for a different request.");
        var result = JsonSerializer.Deserialize<EmptyBinResult>(receipt.ResultPayloadJson!);
        return result is null
            ? new(SegmentTransitionStatus.Conflict, Error: "The saved operation result could not be read.")
            : result with { Replayed = true };
    }

    private static string BinFingerprint(IEnumerable<RejectedSegmentItem> items) =>
        Fingerprint("bin-snapshot", items
            .OrderBy(item => item.ItemId)
            .Select(item => new { item.ItemId, item.Revision })
            .ToArray());

    private static string Fingerprint(string kind, params object?[] values)
    {
        var canonical = JsonSerializer.Serialize(new { kind, values });
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(canonical))).ToLowerInvariant();
    }

    private static async Task LockNativeSegmentAsync(DbContext db, int segmentId, CancellationToken ct)
    {
        if (!db.Database.IsRelational())
            return;
        _ = await db.Database.SqlQuery<int>(
                $"SELECT \"Id\" AS \"Value\" FROM segments WHERE \"Id\" = {segmentId} FOR UPDATE")
            .SingleOrDefaultAsync(ct);
    }

    private static async Task LockNativeSegmentsAsync(DbContext db, int[] segmentIds, CancellationToken ct)
    {
        if (!db.Database.IsRelational())
            return;
        _ = await db.Database.SqlQuery<int>($"""
                SELECT "Id" AS "Value" FROM segments
                WHERE "Id" = ANY ({segmentIds})
                ORDER BY "Id"
                FOR UPDATE
                """)
            .ToArrayAsync(ct);
    }

    private static async Task LockItemAsync(DbContext db, long itemId, CancellationToken ct)
    {
        if (!db.Database.IsRelational())
            return;
        _ = await db.Database.SqlQuery<long>(
                $"SELECT id AS \"Value\" FROM segment_studio_items WHERE id = {itemId} FOR UPDATE")
            .SingleOrDefaultAsync(ct);
    }

    private static async Task LockItemsAsync(DbContext db, long[] itemIds, CancellationToken ct)
    {
        if (!db.Database.IsRelational() || itemIds.Length == 0)
            return;
        _ = await db.Database.SqlQuery<long>($"""
                SELECT id AS "Value" FROM segment_studio_items
                WHERE id = ANY ({itemIds})
                ORDER BY id
                FOR UPDATE
                """)
            .ToArrayAsync(ct);
    }
}
