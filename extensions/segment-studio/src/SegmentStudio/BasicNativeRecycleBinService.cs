using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class BasicNativeRecycleBinService
{
    private const string MoveKind = "basic-native-bin-move";
    private const string BulkMoveKind = "basic-native-bin-bulk-move";
    private const string RestoreKind = "basic-native-bin-restore";
    private const string PurgeKind = "basic-native-bin-purge";
    private const string EmptyKind = "basic-native-bin-empty";
    private const string ModeSwitchEmptyKind =
        "basic-native-bin-mode-switch-empty";

    public static async Task<SegmentTransitionResult> MoveAsync(
        DbContext db,
        int videoId,
        int segmentId,
        NativeToOwnedTransitionRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct,
        bool preserveStableAnchor = false)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        var fingerprint = Fingerprint(MoveKind, videoId, segmentId,
            request.ExpectedUpdatedAt, request.DiscardMissingImage,
            preserveStableAnchor);
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete,
            EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden,
                Error: access.Reason ?? "You cannot delete segments for this video.");
        var replay = await ReplayAsync<SegmentTransitionResult>(
            db, request.OperationId, MoveKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var segment = await db.Set<Segment>().SingleOrDefaultAsync(candidate =>
            candidate.Id == segmentId
            && candidate.HostType == SegmentHostType.Video
            && candidate.HostId == videoId
            && candidate.Kind == "tag"
            && candidate.TagId != null, ct);
        if (segment is null)
            return new(SegmentTransitionStatus.NotFound, Error: "Segment not found.");
        if (segment.UpdatedAt != request.ExpectedUpdatedAt)
            return new(SegmentTransitionStatus.Conflict,
                NativeSegmentId: segment.Id,
                VideoId: videoId,
                Error: "This segment changed in another session. Reload it before moving it to the bin.",
                Code: "CANONICAL_SEGMENT_CHANGED");
        SegmentStudioItem? stableAnchor = null;
        SegmentStudioLineageNode? lineageNode = null;
        if (preserveStableAnchor)
        {
            stableAnchor = await db.Set<SegmentStudioItem>()
                .Include(item => item.Slots)
                .SingleOrDefaultAsync(
                    item => item.NativeSegmentId == segment.Id, ct);
            if (stableAnchor is not null)
            {
                lineageNode = await db.Set<SegmentStudioLineageNode>()
                    .SingleOrDefaultAsync(
                        node => node.ItemId == stableAnchor.Id, ct);
            }
        }
        else
        {
            var guard = await GuardNativeOnlyAsync(db, [segment.Id], ct);
            if (guard is not null)
                return guard;
        }
        var imageError = await ValidateImageAsync(
            blobs, segment.ImageBlobId, request.DiscardMissingImage, ct);
        if (imageError is not null)
            return new(SegmentTransitionStatus.MissingImage,
                NativeSegmentId: segment.Id, VideoId: videoId, Error: imageError);

        var provenance = await LoadFieldProvenanceAsync(
            db, [segment.Id], ct);
        var entry = CreateEntry(
            segment,
            request.DiscardMissingImage,
            provenance.GetValueOrDefault(segment.Id),
            stableAnchor is null
                ? null
                : SerializeAnchor(stableAnchor, lineageNode));
        db.Add(entry);
        RemoveFieldProvenance(db, provenance.Values.SelectMany(rows => rows));
        await db.SaveChangesAsync(ct);
        if (stableAnchor is not null)
        {
            if (lineageNode is not null)
            {
                lineageNode.ItemId = null;
                lineageNode.State = "missing";
                lineageNode.MissingSince ??= DateTime.UtcNow;
                lineageNode.UpdatedAt = DateTime.UtcNow;
            }
            db.Remove(stableAnchor);
            await db.SaveChangesAsync(ct);
        }
        segment.ImageBlobId = null;
        db.Remove(segment);
        var result = new SegmentTransitionResult(
            SegmentTransitionStatus.Updated,
            ItemId: entry.Id,
            Revision: entry.Revision,
            VideoId: videoId);
        db.Add(Receipt(
            request.OperationId, MoveKind, fingerprint, principal,
            segment.Id, null, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<NativeToOwnedTransitionBatchResult> MoveManyAsync(
        DbContext db,
        int videoId,
        NativeToOwnedTransitionBatchRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid, Error: "Operation ID is required.");
        if (request.Segments.Count is < 1 or > 5000)
            return new(SegmentTransitionStatus.Invalid,
                Error: "Select between 1 and 5000 native segments.");
        if (request.Segments.Select(item => item.SegmentId).Distinct().Count()
            != request.Segments.Count)
            return new(SegmentTransitionStatus.Invalid,
                Error: "A native segment can only appear once.");
        var ordered = request.Segments.OrderBy(item => item.SegmentId).ToArray();
        var fingerprint = Fingerprint(
            BulkMoveKind, videoId, ordered, request.DiscardMissingImage);
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete,
            EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden,
                Error: access.Reason ?? "You cannot delete segments for this video.");
        var replay = await ReplayAsync<NativeToOwnedTransitionBatchResult>(
            db, request.OperationId, BulkMoveKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var requested = ordered.ToDictionary(item => item.SegmentId);
        var ids = requested.Keys.ToArray();
        var segments = await db.Set<Segment>()
            .Where(segment => ids.Contains(segment.Id)
                && segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .OrderBy(segment => segment.Id)
            .ToListAsync(ct);
        if (segments.Count != ids.Length)
            return new(SegmentTransitionStatus.NotFound,
                Error: "One or more selected segments no longer exist.");
        if (segments.Any(segment =>
                segment.UpdatedAt != requested[segment.Id].ExpectedUpdatedAt))
            return new(SegmentTransitionStatus.Conflict,
                VideoId: videoId,
                Error: "One or more selected segments changed in another session. Reload before moving them to the bin.",
                Code: "CANONICAL_SEGMENT_CHANGED");
        var guard = await GuardNativeOnlyAsync(db, ids, ct);
        if (guard is not null)
            return new(guard.Status, VideoId: videoId, Error: guard.Error, Code: guard.Code);
        foreach (var segment in segments)
        {
            var imageError = await ValidateImageAsync(
                blobs, segment.ImageBlobId, request.DiscardMissingImage, ct);
            if (imageError is not null)
                return new(SegmentTransitionStatus.MissingImage,
                    VideoId: videoId, Error: imageError);
        }

        var provenance = await LoadFieldProvenanceAsync(db, ids, ct);
        var entries = segments.Select(segment =>
            CreateEntry(
                segment,
                request.DiscardMissingImage,
                provenance.GetValueOrDefault(segment.Id),
                preservedAnchorJson: null)).ToArray();
        db.AddRange(entries);
        RemoveFieldProvenance(db, provenance.Values.SelectMany(rows => rows));
        await db.SaveChangesAsync(ct);
        foreach (var segment in segments)
        {
            segment.ImageBlobId = null;
            db.Remove(segment);
        }
        var items = segments.Zip(entries, (segment, entry) =>
            new NativeToOwnedTransitionItemResult(
                segment.Id, entry.Id, entry.Revision)).ToArray();
        var result = new NativeToOwnedTransitionBatchResult(
            SegmentTransitionStatus.Updated, items, videoId);
        db.Add(Receipt(
            request.OperationId, BulkMoveKind, fingerprint, principal,
            null, null, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<BinSnapshot> GetAsync(
        DbContext db,
        int? videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var candidateVideoIds = await db.Set<SegmentStudioNativeRecycleBinEntry>()
            .AsNoTracking()
            .Where(entry => videoId == null || entry.VideoId == videoId)
            .Select(entry => entry.VideoId)
            .Distinct()
            .ToListAsync(ct);
        var visible = new List<int>(candidateVideoIds.Count);
        foreach (var candidateVideoId in candidateVideoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsRead,
                EntityRef.Of(EntityKinds.Video, candidateVideoId), ct);
            if (access.Allowed)
                visible.Add(candidateVideoId);
        }
        var items = await (
                from entry in db.Set<SegmentStudioNativeRecycleBinEntry>().AsNoTracking()
                join video in db.Set<Video>().AsNoTracking()
                    on entry.VideoId equals video.Id
                join tag in db.Set<Tag>().AsNoTracking()
                    on entry.TagId equals tag.Id
                where visible.Contains(entry.VideoId)
                    && (videoId == null || entry.VideoId == videoId)
                orderby entry.UpdatedAt descending, entry.Id descending
                select new RejectedSegmentItem(
                    entry.Id,
                    entry.VideoId,
                    video.Title ?? video.FileSearchText,
                    entry.TagId,
                    tag.Name,
                    entry.StartSec,
                    entry.EndSec,
                    entry.SourceKey,
                    entry.SourceRunId,
                    entry.Confidence,
                    entry.Title,
                    entry.ImageBlobId,
                    entry.Revision,
                    entry.UpdatedAt))
            .ToListAsync(ct);
        return new(items, items.Count, BinFingerprint(items));
    }

    public static async Task<BinSnapshot> GetModeSwitchSnapshotAsync(
        DbContext db,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var snapshot = await GetAsync(
            db, null, principal, authorization, ct);
        var protectedIds = await db.Set<SegmentStudioIncorrectExample>()
            .AsNoTracking()
            .Where(example => example.NativeBinEntryId != null)
            .Select(example => example.NativeBinEntryId!.Value)
            .ToListAsync(ct);
        var protectedSet = protectedIds.ToHashSet();
        var items = snapshot.Items
            .Where(item => !protectedSet.Contains(item.ItemId))
            .ToArray();
        return new(items, items.Length, BinFingerprint(items));
    }

    public static async Task<SegmentTransitionResult> RestoreAsync(
        DbContext db,
        long entryId,
        OwnedSegmentMutationRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct,
        long? permittedIncorrectExampleId = null)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid,
                Error: "Operation ID is required.");
        var fingerprint = Fingerprint(
            RestoreKind, entryId, request.ExpectedRevision,
            request.DiscardMissingImage);
        var replay = await ReplayAsync<SegmentTransitionResult>(
            db, request.OperationId, RestoreKind, fingerprint, principal, ct);
        if (replay is not null)
        {
            if (replay.VideoId is not int replayVideoId)
                return replay;
            var replayAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsWrite,
                EntityRef.Of(EntityKinds.Video, replayVideoId), ct);
            return replayAccess.Allowed
                ? replay
                : new(SegmentTransitionStatus.Forbidden,
                    Error: replayAccess.Reason
                        ?? "You cannot restore segments for this video.");
        }
        var entry = await db.Set<SegmentStudioNativeRecycleBinEntry>()
            .SingleOrDefaultAsync(candidate => candidate.Id == entryId, ct);
        if (entry is null)
            return new(SegmentTransitionStatus.NotFound,
                Error: "Recycling-bin segment not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, entry.VideoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden,
                ItemId: entryId, VideoId: entry.VideoId,
                Error: access.Reason ?? "You cannot restore segments for this video.");
        if (entry.Revision != request.ExpectedRevision)
            return new(SegmentTransitionStatus.Conflict,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: "This recycling-bin segment changed. Reload before restoring it.");
        var protectedExample = await db.Set<SegmentStudioIncorrectExample>()
            .SingleOrDefaultAsync(example =>
                example.NativeBinEntryId == entry.Id, ct);
        if (protectedExample is not null
            && protectedExample.Id != permittedIncorrectExampleId)
            return new(
                SegmentTransitionStatus.Conflict,
                entry.Id,
                Revision: entry.Revision,
                VideoId: entry.VideoId,
                Error: "Remove this segment from the incorrect-example collection before restoring it.",
                Code: "INCORRECT_EXAMPLE_PROTECTED");
        if (!await db.Set<Tag>().AsNoTracking()
                .AnyAsync(tag => tag.Id == entry.TagId, ct))
            return new(SegmentTransitionStatus.Invalid,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: "The segment tag no longer exists.");
        var imageError = await ValidateImageAsync(
            blobs, entry.ImageBlobId, request.DiscardMissingImage, ct);
        if (imageError is not null)
            return new(SegmentTransitionStatus.MissingImage,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: imageError);
        var preservedAnchor = DeserializeAnchor(entry.PreservedAnchorJson);
        if (!string.IsNullOrWhiteSpace(entry.PreservedAnchorJson)
            && preservedAnchor is null)
            return new(SegmentTransitionStatus.Invalid,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: "The preserved segment provenance cannot be restored.");
        if (preservedAnchor is not null
            && await db.Set<SegmentStudioItem>().AsNoTracking()
                .AnyAsync(item => item.Id == preservedAnchor.ItemId, ct))
            return new(SegmentTransitionStatus.Conflict,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: "The preserved segment identity is already in use.");
        if (preservedAnchor?.LineageNodeId is Guid expectedLineageNodeId
            && !await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .AnyAsync(node => node.Id == expectedLineageNodeId, ct))
            return new(SegmentTransitionStatus.Invalid,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: "The preserved segment lineage cannot be restored.");

        var now = DateTime.UtcNow;
        var segment = new Segment
        {
            HostType = SegmentHostType.Video,
            HostId = entry.VideoId,
            StartSec = entry.StartSec,
            EndSec = entry.EndSec,
            TagId = entry.TagId,
            Kind = entry.Kind,
            RefId = entry.RefId,
            Payload = entry.PayloadJson is null
                ? null
                : JsonDocument.Parse(entry.PayloadJson),
            SourceKey = entry.SourceKey,
            SourceRunId = entry.SourceRunId,
            Confidence = entry.Confidence,
            Title = entry.Title,
            ColorHint = entry.ColorHint,
            ImageBlobId = request.DiscardMissingImage ? null : entry.ImageBlobId,
            CreatedAt = entry.NativeCreatedAt,
            UpdatedAt = now,
        };
        db.Add(segment);
        await db.SaveChangesAsync(ct);
        if (preservedAnchor is not null)
        {
            var anchor = new SegmentStudioItem
            {
                Id = preservedAnchor.ItemId,
                NativeSegmentId = segment.Id,
                RepresentationSchemaVersion =
                    preservedAnchor.RepresentationSchemaVersion,
                Revision = preservedAnchor.Revision,
                CreatedAt = preservedAnchor.CreatedAt,
                UpdatedAt = preservedAnchor.UpdatedAt,
            };
            db.Add(anchor);
            await db.SaveChangesAsync(ct);
            if (preservedAnchor.Slots.Count > 0)
            {
                db.AddRange(preservedAnchor.Slots.Select(slot =>
                    new SegmentStudioSegmentSlot
                    {
                        ItemId = anchor.Id,
                        SlotDefinitionId = slot.SlotDefinitionId,
                        PerformerId = slot.PerformerId,
                        CreatedAt = slot.CreatedAt,
                    }));
            }
            if (preservedAnchor.LineageNodeId is Guid lineageNodeId)
            {
                var node = await db.Set<SegmentStudioLineageNode>()
                    .SingleOrDefaultAsync(
                        candidate => candidate.Id == lineageNodeId, ct);
                if (node is not null)
                {
                    node.ItemId = anchor.Id;
                    node.State = "live";
                    node.MissingSince = null;
                    node.LastKnownVideoId = entry.VideoId;
                    node.LastKnownTagId = entry.TagId;
                    node.LastKnownStartSec = entry.StartSec;
                    node.LastKnownEndSec = entry.EndSec;
                    node.UpdatedAt = DateTime.UtcNow;
                }
            }
        }
        RestoreFieldProvenance(db, entry, segment.Id);
        await db.SaveChangesAsync(ct);
        entry.ImageBlobId = null;
        await db.SaveChangesAsync(ct);
        if (protectedExample is not null)
            db.Remove(protectedExample);
        db.Remove(entry);
        var result = new SegmentTransitionResult(
            SegmentTransitionStatus.Updated,
            entry.Id,
            segment.Id,
            entry.Revision,
            entry.VideoId);
        db.Add(Receipt(
            request.OperationId, RestoreKind, fingerprint, principal,
            null, segment.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentTransitionResult> PurgeAsync(
        DbContext db,
        long entryId,
        OwnedSegmentMutationRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid,
                Error: "Operation ID is required.");
        var fingerprint = Fingerprint(PurgeKind, entryId, request.ExpectedRevision);
        var replay = await ReplayAsync<SegmentTransitionResult>(
            db, request.OperationId, PurgeKind, fingerprint, principal, ct);
        if (replay is not null)
        {
            if (replay.VideoId is not int replayVideoId)
                return replay;
            var replayAccess = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsDelete,
                EntityRef.Of(EntityKinds.Video, replayVideoId), ct);
            return replayAccess.Allowed
                ? replay
                : new(SegmentTransitionStatus.Forbidden,
                    Error: replayAccess.Reason
                        ?? "You cannot permanently delete this segment.");
        }
        var entry = await db.Set<SegmentStudioNativeRecycleBinEntry>()
            .SingleOrDefaultAsync(candidate => candidate.Id == entryId, ct);
        if (entry is null)
            return new(SegmentTransitionStatus.NotFound,
                Error: "Recycling-bin segment not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete,
            EntityRef.Of(EntityKinds.Video, entry.VideoId), ct);
        if (!access.Allowed)
            return new(SegmentTransitionStatus.Forbidden,
                ItemId: entry.Id, VideoId: entry.VideoId,
                Error: access.Reason ?? "You cannot permanently delete this segment.");
        if (entry.Revision != request.ExpectedRevision)
            return new(SegmentTransitionStatus.Conflict,
                entry.Id, Revision: entry.Revision, VideoId: entry.VideoId,
                Error: "This recycling-bin segment changed. Reload before deleting it.");
        if (await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .AnyAsync(example => example.NativeBinEntryId == entry.Id, ct))
            return new(
                SegmentTransitionStatus.Conflict,
                entry.Id,
                Revision: entry.Revision,
                VideoId: entry.VideoId,
                Error: "Remove this segment from the incorrect-example collection before deleting it.",
                Code: "INCORRECT_EXAMPLE_PROTECTED");
        QueueBlobCleanupForInMemory(db, [entry]);
        var result = new SegmentTransitionResult(
            SegmentTransitionStatus.Updated,
            entry.Id,
            Revision: entry.Revision,
            VideoId: entry.VideoId);
        await SegmentStudioHistoryService.ClearBasicVideoAsync(
            db, entry.VideoId, ct);
        db.Remove(entry);
        db.Add(Receipt(
            request.OperationId, PurgeKind, fingerprint, principal,
            null, null, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<EmptyBinResult> EmptyAsync(
        DbContext db,
        EmptyBinRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct,
        bool preserveIncorrectExamples = false)
    {
        if (request.OperationId == Guid.Empty)
            return new(SegmentTransitionStatus.Invalid,
                Error: "Operation ID is required.");
        if (string.IsNullOrWhiteSpace(request.ExpectedFingerprint))
            return new(SegmentTransitionStatus.Invalid,
                Error: "The recycling-bin fingerprint is required.");
        var operationKind = preserveIncorrectExamples
            ? ModeSwitchEmptyKind
            : EmptyKind;
        var fingerprint = Fingerprint(
            operationKind, request.ExpectedFingerprint);
        var replay = await ReplayAsync<EmptyBinResult>(
            db, request.OperationId, operationKind, fingerprint, principal, ct);
        if (replay is not null)
        {
            foreach (var videoId in replay.VideoIds ?? [])
            {
                var access = await authorization.AuthorizeAsync(
                    principal, Permissions.SegmentsDelete,
                    EntityRef.Of(EntityKinds.Video, videoId), ct);
                if (!access.Allowed)
                    return new(SegmentTransitionStatus.Forbidden,
                        Error: access.Reason
                            ?? "You cannot permanently delete every segment in the recycling bin.");
            }
            return replay;
        }
        await LockBinAsync(db, ct);
        var snapshot = preserveIncorrectExamples
            ? await GetModeSwitchSnapshotAsync(
                db, principal, authorization, ct)
            : await GetAsync(
                db, null, principal, authorization, ct);
        if (snapshot.Fingerprint != request.ExpectedFingerprint)
            return new(SegmentTransitionStatus.Conflict,
                Error: "The recycling bin changed. Reload it before emptying.");
        var videoIds = snapshot.Items.Select(item => item.VideoId)
            .Distinct().Order().ToArray();
        foreach (var videoId in videoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsDelete,
                EntityRef.Of(EntityKinds.Video, videoId), ct);
            if (!access.Allowed)
                return new(SegmentTransitionStatus.Forbidden,
                    Error: access.Reason
                        ?? "You cannot permanently delete every segment in the recycling bin.");
        }
        var ids = snapshot.Items.Select(item => item.ItemId).Order().ToArray();
        var entries = await db.Set<SegmentStudioNativeRecycleBinEntry>()
            .Where(entry => ids.Contains(entry.Id))
            .OrderBy(entry => entry.Id)
            .ToListAsync(ct);
        if (entries.Count != ids.Length)
            return new(SegmentTransitionStatus.Conflict,
                Error: "The recycling bin changed. Reload it before emptying.");
        if (!preserveIncorrectExamples
            && await db.Set<SegmentStudioIncorrectExample>().AsNoTracking()
            .AnyAsync(example =>
                example.NativeBinEntryId != null
                && ids.Contains(example.NativeBinEntryId.Value), ct))
            return new(
                SegmentTransitionStatus.Conflict,
                Error: "Remove protected incorrect examples before emptying the recycling bin.");
        QueueBlobCleanupForInMemory(db, entries);
        var result = new EmptyBinResult(
            SegmentTransitionStatus.Updated, entries.Count, videoIds);
        foreach (var videoId in videoIds)
            await SegmentStudioHistoryService.ClearBasicVideoAsync(
                db, videoId, ct);
        db.RemoveRange(entries);
        db.Add(Receipt(
            request.OperationId, operationKind, fingerprint, principal,
            null, null, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    private static async Task<SegmentTransitionResult?> GuardNativeOnlyAsync(
        DbContext db,
        int[] segmentIds,
        CancellationToken ct)
    {
        if (await db.Set<SegmentStudioItem>().AsNoTracking()
            .AnyAsync(item => item.NativeSegmentId != null
                && segmentIds.Contains(item.NativeSegmentId.Value), ct))
            return new(
                SegmentTransitionStatus.Conflict,
                Error: "A selected segment has Full-mode metadata. Switch to Full mode before removing it.",
                Code: "FULL_METADATA_PROTECTED");
        return null;
    }

    private static SegmentStudioNativeRecycleBinEntry CreateEntry(
        Segment segment,
        bool discardMissingImage,
        IReadOnlyList<FieldProvenance>? provenance,
        string? preservedAnchorJson)
    {
        var now = DateTime.UtcNow;
        return new()
        {
            VideoId = segment.HostId,
            TagId = segment.TagId!.Value,
            StartSec = segment.StartSec,
            EndSec = segment.EndSec,
            Kind = segment.Kind ?? "tag",
            RefId = segment.RefId,
            PayloadJson = segment.Payload?.RootElement.GetRawText(),
            SourceKey = segment.SourceKey,
            SourceRunId = segment.SourceRunId,
            Confidence = segment.Confidence,
            Title = segment.Title,
            ColorHint = segment.ColorHint,
            ImageBlobId = discardMissingImage ? null : segment.ImageBlobId,
            FieldProvenanceJson = JsonSerializer.Serialize(
                (provenance ?? []).Select(row =>
                    new NativeFieldProvenanceSnapshot(
                        row.FieldKey,
                        row.ValueJson,
                        row.SourceKey,
                        row.SourceRunId,
                        row.ModelKey,
                        row.Confidence,
                        row.CreatedAt,
                        row.UpdatedAt))),
            PreservedAnchorJson = preservedAnchorJson,
            Revision = 1,
            NativeCreatedAt = segment.CreatedAt,
            CreatedAt = now,
            UpdatedAt = now,
        };
    }

    private static string SerializeAnchor(
        SegmentStudioItem item,
        SegmentStudioLineageNode? node) =>
        JsonSerializer.Serialize(new PreservedAnchorSnapshot(
            item.Id,
            item.RepresentationSchemaVersion,
            item.Revision,
            item.CreatedAt,
            item.UpdatedAt,
            node?.Id,
            item.Slots.Select(slot => new PreservedSlotSnapshot(
                slot.SlotDefinitionId,
                slot.PerformerId,
                slot.CreatedAt)).ToArray()));

    private static PreservedAnchorSnapshot? DeserializeAnchor(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return null;
        try
        {
            return JsonSerializer.Deserialize<PreservedAnchorSnapshot>(json);
        }
        catch (JsonException)
        {
            return null;
        }
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

    private static async Task<Dictionary<int, List<FieldProvenance>>>
        LoadFieldProvenanceAsync(
            DbContext db,
            int[] segmentIds,
            CancellationToken ct)
    {
        if (db.Model.FindEntityType(typeof(FieldProvenance)) is null)
            return [];
        return (await db.Set<FieldProvenance>()
                .Where(row =>
                    row.HostType == AffinityHostType.Segment
                    && segmentIds.Contains(row.HostId))
                .OrderBy(row => row.Id)
                .ToListAsync(ct))
            .GroupBy(row => row.HostId)
            .ToDictionary(group => group.Key, group => group.ToList());
    }

    private static void RemoveFieldProvenance(
        DbContext db,
        IEnumerable<FieldProvenance> rows)
    {
        var materialized = rows.ToArray();
        if (materialized.Length > 0)
            db.RemoveRange(materialized);
    }

    private static void RestoreFieldProvenance(
        DbContext db,
        SegmentStudioNativeRecycleBinEntry entry,
        int nativeSegmentId)
    {
        if (db.Model.FindEntityType(typeof(FieldProvenance)) is null)
            return;
        IReadOnlyList<NativeFieldProvenanceSnapshot> snapshots;
        try
        {
            snapshots = JsonSerializer.Deserialize<
                IReadOnlyList<NativeFieldProvenanceSnapshot>>(
                    entry.FieldProvenanceJson) ?? [];
        }
        catch (JsonException)
        {
            snapshots = [];
        }
        db.AddRange(snapshots.Select(snapshot => new FieldProvenance
        {
            HostType = AffinityHostType.Segment,
            HostId = nativeSegmentId,
            FieldKey = snapshot.FieldKey,
            ValueJson = snapshot.ValueJson,
            SourceKey = snapshot.SourceKey,
            SourceRunId = snapshot.SourceRunId,
            ModelKey = snapshot.ModelKey,
            Confidence = snapshot.Confidence,
            CreatedAt = snapshot.CreatedAt,
            UpdatedAt = snapshot.UpdatedAt,
        }));
    }

    private static void QueueBlobCleanupForInMemory(
        DbContext db,
        IEnumerable<SegmentStudioNativeRecycleBinEntry> entries)
    {
        if (db.Database.IsRelational())
            return;
        foreach (var blobId in entries.Select(entry => entry.ImageBlobId)
            .Where(blobId => !string.IsNullOrWhiteSpace(blobId))
            .Distinct())
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

    private static SegmentStudioSegmentOperation Receipt<T>(
        Guid operationId,
        string kind,
        string fingerprint,
        CovePrincipal? principal,
        int? sourceNativeSegmentId,
        int? resultNativeSegmentId,
        T result) => new()
        {
            OperationId = operationId,
            Kind = kind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            SourceNativeSegmentId = sourceNativeSegmentId,
            ResultNativeSegmentId = resultNativeSegmentId,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        };

    private static async Task<T?> ReplayAsync<T>(
        DbContext db,
        Guid operationId,
        string kind,
        string fingerprint,
        CovePrincipal? principal,
        CancellationToken ct) where T : class
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>()
            .AsNoTracking()
            .SingleOrDefaultAsync(operation =>
                operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != kind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return Conflict<T>();
        return JsonSerializer.Deserialize<T>(receipt.ResultPayloadJson!)
            ?? Conflict<T>();
    }

    private static T Conflict<T>() where T : class
    {
        object value = typeof(T) == typeof(NativeToOwnedTransitionBatchResult)
            ? new NativeToOwnedTransitionBatchResult(
                SegmentTransitionStatus.Conflict,
                Error: "The operation ID was already used for a different request.")
            : typeof(T) == typeof(EmptyBinResult)
                ? new EmptyBinResult(
                    SegmentTransitionStatus.Conflict,
                    Error: "The operation ID was already used for a different request.")
                : new SegmentTransitionResult(
                    SegmentTransitionStatus.Conflict,
                    Error: "The operation ID was already used for a different request.");
        return (T)value;
    }

    private static string BinFingerprint(IEnumerable<RejectedSegmentItem> items) =>
        Fingerprint("basic-native-bin-snapshot", items
            .OrderBy(item => item.ItemId)
            .Select(item => new { item.ItemId, item.Revision })
            .ToArray());

    private static string Fingerprint(string kind, params object?[] values)
    {
        var canonical = JsonSerializer.Serialize(new { kind, values });
        return Convert.ToHexString(SHA256.HashData(
            Encoding.UTF8.GetBytes(canonical))).ToLowerInvariant();
    }

    private static async Task LockBinAsync(DbContext db, CancellationToken ct)
    {
        if (!db.Database.IsRelational())
            return;
        await db.Database.ExecuteSqlRawAsync(
            "LOCK TABLE segment_studio_native_recycle_bin IN SHARE ROW EXCLUSIVE MODE",
            ct);
    }

    private sealed record NativeFieldProvenanceSnapshot(
        string FieldKey,
        string? ValueJson,
        string SourceKey,
        string SourceRunId,
        string ModelKey,
        float? Confidence,
        DateTime CreatedAt,
        DateTime UpdatedAt);
    private sealed record PreservedAnchorSnapshot(
        long ItemId,
        int RepresentationSchemaVersion,
        long Revision,
        DateTime CreatedAt,
        DateTime UpdatedAt,
        Guid? LineageNodeId,
        IReadOnlyList<PreservedSlotSnapshot> Slots);
    private sealed record PreservedSlotSnapshot(
        Guid SlotDefinitionId,
        int PerformerId,
        DateTime CreatedAt);
}
