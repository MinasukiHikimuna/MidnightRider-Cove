using System.Text.Json;
using System.Text.Json.Nodes;
using System.Security.Cryptography;
using System.Text;
using Cove.Core.Auth;
using Cove.Core.DTOs;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public enum DirectSegmentMutationStatus
{
    Updated,
    NotFound,
    Forbidden,
    Conflict,
    Invalid,
}

public sealed record DirectSegmentMutationRequest(
    string? ReviewState,
    double StartSec,
    double? EndSec,
    DateTime ExpectedUpdatedAt,
    int? TagId = null,
    Guid? HistoryReceiptId = null);

public sealed record DuplicateNativeSegmentRequest(
    DateTime ExpectedUpdatedAt,
    double? StartSec = null,
    Guid? HistoryReceiptId = null);
public sealed record SplitNativeSegmentRequest(
    DateTime ExpectedUpdatedAt,
    double SplitSec,
    Guid? HistoryReceiptId = null);
public sealed record MergeNativeSegmentsRequest(
    Guid OperationId,
    int SourceSegmentId,
    DateTime ExpectedTargetUpdatedAt,
    DateTime ExpectedSourceUpdatedAt,
    Guid? HistoryReceiptId = null);

public sealed record MergeNativeSegmentSelectionItem(
    Guid OperationId,
    int SegmentId,
    DateTime ExpectedUpdatedAt);

public sealed record MergeNativeSegmentSelectionRequest(
    int SurvivorSegmentId,
    DateTime ExpectedSurvivorUpdatedAt,
    IReadOnlyList<MergeNativeSegmentSelectionItem> ConsumedSegments,
    Guid? HistoryReceiptId = null);

public sealed record DirectSegmentSnapshot(
    int Id,
    int VideoId,
    int TagId,
    string? TagName,
    double StartSec,
    double? EndSec,
    string ReviewState,
    DateTime UpdatedAt,
    string SourceKey,
    string? SourceRunId,
    float? Confidence,
    IReadOnlyList<FieldProvenanceDto>? FieldProvenance = null);

public sealed record DirectSegmentMutationResult(
    DirectSegmentMutationStatus Status,
    DirectSegmentSnapshot? Segment = null,
    string? Error = null,
    IReadOnlyDictionary<string, object?>? ChangedFields = null,
    string? Code = null,
    bool Replayed = false);

public static class DirectSegmentReviewService
{
    private const string StudioProperty = "segmentStudio";
    private const string OriginalPayloadProperty = "segmentStudioOriginalPayload";
    private const string PayloadWrappedProperty = "payloadWrapped";

    public static async Task<DirectSegmentMutationResult> MergeAuthorizedAsync(
        DbContext db,
        int videoId,
        int targetSegmentId,
        MergeNativeSegmentsRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct,
        bool preserveExtensionMetadata = true)
    {
        if (targetSegmentId == request.SourceSegmentId)
            return new(DirectSegmentMutationStatus.Invalid, Error: "Choose two different segments to merge.");
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return new(DirectSegmentMutationStatus.NotFound, Error: "Video not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return new(DirectSegmentMutationStatus.Forbidden, Error: access.Reason ?? "You cannot edit segments for this video.");
        var deleteAccess = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!deleteAccess.Allowed)
            return new(DirectSegmentMutationStatus.Forbidden, Error: deleteAccess.Reason ?? "You cannot delete segments for this video.");
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var fingerprint = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(new
        {
            videoId, targetSegmentId, request.SourceSegmentId,
            request.ExpectedTargetUpdatedAt, request.ExpectedSourceUpdatedAt,
        })))).ToLowerInvariant();
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == request.OperationId, ct);
        if (receipt is not null)
        {
            if (receipt.Kind != "merge-native" || receipt.RequestFingerprint != fingerprint
                || receipt.ActorUserId != principal?.UserId)
                return new(DirectSegmentMutationStatus.Conflict, Error: "Operation ID was already used for another request.");
            var replayed = JsonSerializer.Deserialize<DirectSegmentSnapshot>(receipt.ResultPayloadJson!);
            return new(DirectSegmentMutationStatus.Updated, replayed, Replayed: true);
        }
        var segments = db.Database.IsRelational()
            ? await db.Set<Segment>().FromSqlInterpolated(
                $"SELECT * FROM segments WHERE \"Id\" IN ({targetSegmentId}, {request.SourceSegmentId}) ORDER BY \"Id\" FOR UPDATE")
                .ToListAsync(ct)
            : await db.Set<Segment>().Where(segment =>
                segment.Id == targetSegmentId || segment.Id == request.SourceSegmentId).ToListAsync(ct);
        segments = segments.Where(segment => segment.HostType == SegmentHostType.Video
            && segment.HostId == videoId && segment.Kind == "tag" && segment.TagId != null).ToList();
        var target = segments.SingleOrDefault(segment => segment.Id == targetSegmentId);
        var source = segments.SingleOrDefault(segment => segment.Id == request.SourceSegmentId);
        if (target is null || source is null)
            return new(DirectSegmentMutationStatus.NotFound, Error: "Merge source or target was not found.");
        if (target.UpdatedAt != request.ExpectedTargetUpdatedAt || source.UpdatedAt != request.ExpectedSourceUpdatedAt)
            return new(DirectSegmentMutationStatus.Conflict, Error: "A merge segment changed. Reload before trying again.");
        if (target.TagId != source.TagId)
            return new(DirectSegmentMutationStatus.Invalid,
                Error: "Merge requires segments from the same swimlane.");

        var first = target.StartSec < source.StartSec || (target.StartSec == source.StartSec && target.Id < source.Id) ? target : source;
        var consumed = first.Id == target.Id ? source : target;
        var anchors = await db.Set<SegmentStudioItem>().Where(item =>
            item.NativeSegmentId == target.Id || item.NativeSegmentId == source.Id).ToListAsync(ct);
        if (!preserveExtensionMetadata
            && anchors.Any(anchor => anchor.NativeSegmentId == consumed.Id))
            return new(
                DirectSegmentMutationStatus.Conflict,
                Error: "This merge would discard hidden Full-mode metadata. Switch to Full mode to merge these segments.");
        var anchorIds = anchors.Select(anchor => anchor.Id).ToArray();
        if (preserveExtensionMetadata)
        {
            var mergeSlots = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                .Where(slot => anchorIds.Contains(slot.ItemId)).ToListAsync(ct);
            var targetAnchorId = anchors.SingleOrDefault(anchor => anchor.NativeSegmentId == target.Id)?.Id;
            var sourceAnchorId = anchors.SingleOrDefault(anchor => anchor.NativeSegmentId == source.Id)?.Id;
            var targetSlots = mergeSlots.Where(slot => slot.ItemId == targetAnchorId);
            var sourceSlots = mergeSlots.Where(slot => slot.ItemId == sourceAnchorId);
            if (SlotSignature(targetSlots) != SlotSignature(sourceSlots))
                return new(DirectSegmentMutationStatus.Invalid,
                    Error: "Merge requires segments from the same performer swimlane.");
        }
        foreach (var anchor in anchors)
        {
            if (!string.IsNullOrWhiteSpace(anchor.ExtensionImageBlobId)
                || await DerivedTagGuard.IsDerivedItemAsync(db, anchor.Id, ct)
                || await DerivedTagGuard.HasOutgoingEdgesAsync(db, anchor.Id, ct))
                return new(DirectSegmentMutationStatus.Conflict,
                    Error: "Segments with lineage or extension images cannot be merged.");
        }
        first.EndSec = Math.Max(first.EndSec ?? first.StartSec, consumed.EndSec ?? consumed.StartSec);
        first.SourceKey = "user";
        first.SourceRunId = null;
        first.Confidence = null;
        var firstAnchor = anchors.SingleOrDefault(anchor => anchor.NativeSegmentId == first.Id);
        var consumedAnchor = anchors.SingleOrDefault(anchor => anchor.NativeSegmentId == consumed.Id);
        if (preserveExtensionMetadata
            && firstAnchor is null
            && consumedAnchor is not null)
        {
            consumedAnchor.NativeSegmentId = first.Id;
            firstAnchor = consumedAnchor;
            consumedAnchor = null;
        }
        if (preserveExtensionMetadata && firstAnchor is not null)
        {
            var lineageError = await SegmentMergeLineageService.ConsolidateRootsAsync(
                db,
                firstAnchor.Id,
                consumedAnchor?.Id ?? -1,
                videoId,
                first.TagId!.Value,
                first.StartSec,
                first.EndSec,
                ct);
            if (lineageError is not null)
                return new(DirectSegmentMutationStatus.Conflict, Error: lineageError);
            if (consumedAnchor is not null) db.Remove(consumedAnchor);
        }
        first.UpdatedAt = NextTimestamp(first.UpdatedAt > consumed.UpdatedAt ? first.UpdatedAt : consumed.UpdatedAt);
        db.Remove(consumed);
        await db.SaveChangesAsync(ct);
        var snapshot = ToSnapshot(first);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = "merge-native",
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            SourceNativeSegmentId = request.SourceSegmentId,
            ResultNativeSegmentId = first.Id,
            ResultPayloadJson = JsonSerializer.Serialize(snapshot),
            CreatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync(ct);
        return new(DirectSegmentMutationStatus.Updated, snapshot);
    }

    private static string SlotSignature(IEnumerable<SegmentStudioSegmentSlot>? slots) =>
        string.Join("|", (slots ?? []).OrderBy(slot => slot.SlotDefinitionId)
            .Select(slot => $"{slot.SlotDefinitionId:N}:{slot.PerformerId}"));

    public static async Task<DirectSegmentMutationResult> DuplicateAuthorizedAsync(
        DbContext db,
        int videoId,
        int segmentId,
        DuplicateNativeSegmentRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        ISegmentDuplicationProvenanceService duplicateProvenance,
        CancellationToken ct,
        bool preserveExtensionMetadata = true)
    {
        var (source, error) = await LoadStructuralSourceAsync(
            db, videoId, segmentId, request.ExpectedUpdatedAt, principal, authorization, ct);
        if (error is not null) return error;
        try
        {
            if (preserveExtensionMetadata)
                await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
        }
        catch (LineageConflictException exception)
        {
            return new(
                DirectSegmentMutationStatus.Conflict,
                Error: exception.Message,
                Code: exception.Code);
        }
        if (request.StartSec is not null && (!double.IsFinite(request.StartSec.Value) || request.StartSec.Value < 0))
            return new(DirectSegmentMutationStatus.Invalid, Error: "Duplicate start time must be finite and non-negative.");

        var now = NextTimestamp(source!.UpdatedAt);
        var duplicate = Clone(source, now, preserveExtensionMetadata);
        if (request.StartSec is not null)
        {
            var duration = source.EndSec is null ? null : source.EndSec - source.StartSec;
            duplicate.StartSec = request.StartSec.Value;
            duplicate.EndSec = duration is null ? null : request.StartSec.Value + duration.Value;
        }
        source.UpdatedAt = now;
        db.Add(duplicate);
        await db.SaveChangesAsync(ct);
        if (!preserveExtensionMetadata)
            return new(DirectSegmentMutationStatus.Updated, ToSnapshot(duplicate));
        var anchors = await CopyNativeSlotsAsync(db, source.Id, duplicate.Id, now, ct);
        if (anchors is not null)
        {
            await duplicateProvenance.CopyAsync(db, anchors.Value.SourceItemId, anchors.Value.TargetItemId, ct);
            var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                principal, authorization, ct);
            if (slotAccess.Allowed)
            {
                var targetItem = await db.Set<SegmentStudioItem>()
                    .SingleAsync(item => item.Id == anchors.Value.TargetItemId, ct);
                await PerformerSlotAutoAssignmentService.TryAssignItemAsync(
                    db, targetItem, ct, videoId);
                await db.SaveChangesAsync(ct);
            }
        }
        else
        {
            var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                principal, authorization, ct);
            if (slotAccess.Allowed)
            {
                var targetItem = new SegmentStudioItem
                {
                    NativeSegmentId = duplicate.Id,
                    RepresentationSchemaVersion = 1,
                    Revision = 0,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(targetItem);
                await db.SaveChangesAsync(ct);
                if (await PerformerSlotAutoAssignmentService.TryAssignItemAsync(
                        db, targetItem, ct, videoId))
                    await db.SaveChangesAsync(ct);
            }
        }
        return new(DirectSegmentMutationStatus.Updated, ToSnapshot(duplicate));
    }

    public static async Task<DirectSegmentMutationResult> SplitAuthorizedAsync(
        DbContext db,
        int videoId,
        int segmentId,
        SplitNativeSegmentRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct,
        bool preserveExtensionMetadata = true)
    {
        var (source, error) = await LoadStructuralSourceAsync(
            db, videoId, segmentId, request.ExpectedUpdatedAt, principal, authorization, ct);
        if (error is not null) return error;
        if (!double.IsFinite(request.SplitSec)
            || request.SplitSec <= source!.StartSec
            || (source.EndSec is not null && request.SplitSec >= source.EndSec))
            return new(DirectSegmentMutationStatus.Invalid, Error: "Split time must be inside the segment range.");

        var now = NextTimestamp(source.UpdatedAt);
        var second = Clone(source, now, preserveExtensionMetadata);
        second.StartSec = request.SplitSec;
        source.EndSec = request.SplitSec;
        source.UpdatedAt = now;
        db.Add(second);
        await db.SaveChangesAsync(ct);
        if (preserveExtensionMetadata)
            await CopyNativeSlotsAsync(db, source.Id, second.Id, now, ct);
        return new(DirectSegmentMutationStatus.Updated, ToSnapshot(second));
    }

    public static async Task<DirectSegmentMutationResult> UpdateAuthorizedAsync(
        DbContext db,
        int videoId,
        int segmentId,
        DirectSegmentMutationRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct,
        bool preserveExtensionMetadata = true)
    {
        if (!preserveExtensionMetadata && request.ReviewState is not null)
            return new(
                DirectSegmentMutationStatus.Invalid,
                Error: "Review states are unavailable in Basic mode.");
        var videoExists = await db.Set<Video>()
            .AsNoTracking()
            .AnyAsync(video => video.Id == videoId, ct);
        if (!videoExists)
            return new(DirectSegmentMutationStatus.NotFound, Error: "Video not found.");

        var access = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        if (!access.Allowed)
            return new(DirectSegmentMutationStatus.Forbidden, Error: access.Reason ?? "You cannot edit segments for this video.");

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var validationError = Validate(request);
        if (validationError is not null)
            return new(DirectSegmentMutationStatus.Invalid, Error: validationError);

        var current = await db.Set<Segment>()
            .AsNoTracking()
            .Where(segment =>
                segment.Id == segmentId
                && segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .Select(segment => new SegmentMutationRow(
                segment.Id,
                segment.HostId,
                segment.TagId!.Value,
                null,
                segment.StartSec,
                segment.EndSec,
                segment.Payload,
                segment.UpdatedAt,
                segment.SourceKey,
                segment.SourceRunId,
                segment.Confidence))
            .SingleOrDefaultAsync(ct);
        if (current is null)
            return new(DirectSegmentMutationStatus.NotFound, Error: "Segment not found.");
        if (current.UpdatedAt != request.ExpectedUpdatedAt)
            return new(DirectSegmentMutationStatus.Conflict, ToSnapshot(current), "This segment changed in another session. Reload it before saving again.");

        var payload = request.ReviewState is null
            ? current.Payload
            : MergeReviewState(current.Payload, request.ReviewState);
        var tagId = request.TagId ?? current.TagId;
        long? itemId = null;
        if (tagId != current.TagId
            && await DerivedTagGuard.IsDerivedNativeSegmentAsync(db, segmentId, ct))
            return new(
                DirectSegmentMutationStatus.Conflict,
                ToSnapshot(current),
                "This segment's tag is determined by its derivation rule.",
                Code: "DERIVED_TAG_IMMUTABLE");
        if (tagId != current.TagId)
        {
            itemId = await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.NativeSegmentId == segmentId)
                .Select(item => (long?)item.Id)
                .SingleOrDefaultAsync(ct);
            if (!preserveExtensionMetadata && itemId is not null)
                return new(
                    DirectSegmentMutationStatus.Conflict,
                    ToSnapshot(current),
                    "This segment has hidden Full-mode metadata. Switch to Full mode before changing its tag.",
                    Code: "FULL_METADATA_PROTECTED");
            if (itemId is not null
                && await DerivedTagGuard.HasOutgoingEdgesAsync(db, itemId.Value, ct))
                return new(
                    DirectSegmentMutationStatus.Conflict,
                    ToSnapshot(current),
                    "This segment has derived descendants and requires lineage reconciliation before retagging.",
                    Code: "LINEAGE_COMPONENT_PROTECTED");
        }
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == tagId, ct))
            return new(DirectSegmentMutationStatus.Invalid, Error: "Tag not found.");
        var changedFields = BuildChangedFields(current, request, payload);
        var updatedAt = NextTimestamp(current.UpdatedAt);

        var cascadeRejection = request.ReviewState == "rejected"
            && await db.Set<SegmentStudioItem>().AsNoTracking()
                .AnyAsync(item => item.NativeSegmentId == segmentId, ct);
        Segment? trackedSegment = null;
        if (db.Database.IsRelational() && !cascadeRejection)
        {
            var affected = await db.Set<Segment>()
                .Where(segment =>
                    segment.Id == segmentId
                    && segment.HostType == SegmentHostType.Video
                    && segment.HostId == videoId
                    && segment.Kind == "tag"
                    && segment.TagId != null
                    && segment.UpdatedAt == request.ExpectedUpdatedAt)
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(segment => segment.StartSec, request.StartSec)
                    .SetProperty(segment => segment.EndSec, request.EndSec)
                    .SetProperty(segment => segment.TagId, tagId)
                    .SetProperty(segment => segment.Payload, payload)
                    .SetProperty(segment => segment.UpdatedAt, updatedAt), ct);
            if (affected == 0)
            {
                var latest = await LoadSnapshotAsync(db, videoId, segmentId, ct);
                return new(DirectSegmentMutationStatus.Conflict, latest, "This segment changed in another session. Reload it before saving again.");
            }
        }
        else
        {
            trackedSegment = await db.Set<Segment>()
                .SingleOrDefaultAsync(segment =>
                    segment.Id == segmentId
                    && segment.HostType == SegmentHostType.Video
                    && segment.HostId == videoId
                    && segment.Kind == "tag"
                    && segment.TagId != null, ct);
            if (trackedSegment is null)
                return new(DirectSegmentMutationStatus.NotFound, Error: "Segment not found.");
            if (trackedSegment.UpdatedAt != request.ExpectedUpdatedAt)
                return new(DirectSegmentMutationStatus.Conflict, ToSnapshot(trackedSegment), "This segment changed in another session. Reload it before saving again.");

            trackedSegment.StartSec = request.StartSec;
            trackedSegment.EndSec = request.EndSec;
            trackedSegment.TagId = tagId;
            trackedSegment.Payload = payload;
            trackedSegment.UpdatedAt = updatedAt;
        }

        if (cascadeRejection)
        {
            var rootItemId = await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.NativeSegmentId == segmentId)
                .Select(item => item.Id)
                .SingleAsync(ct);
            await DerivedSegmentRejectionService.RejectDescendantsAsync(db, rootItemId, ct);
        }

        if (preserveExtensionMetadata
            && tagId != current.TagId
            && itemId is not null)
        {
            var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                principal, authorization, ct);
            await PerformerSlotRetaggingService.RemapAsync(
                db, itemId.Value, current.TagId, tagId, ct,
                autoAssignMissingSlots: slotAccess.Allowed);
        }
        if (!db.Database.IsRelational()
            || cascadeRejection
            || preserveExtensionMetadata
                && tagId != current.TagId
                && itemId is not null)
            await db.SaveChangesAsync(ct);
        if (trackedSegment is not null)
            db.Entry(trackedSegment).State = EntityState.Detached;
        var saved = await LoadSnapshotAsync(db, videoId, segmentId, ct);
        return saved is null
            ? new(DirectSegmentMutationStatus.NotFound, Error: "Segment not found.")
            : new(DirectSegmentMutationStatus.Updated, saved, ChangedFields: changedFields);
    }

    public static string ReadReviewState(JsonDocument? payload)
    {
        if (payload is null || payload.RootElement.ValueKind != JsonValueKind.Object)
            return "unreviewed";
        if (!payload.RootElement.TryGetProperty(StudioProperty, out var studio)
            || studio.ValueKind != JsonValueKind.Object
            || !studio.TryGetProperty("reviewState", out var reviewState)
            || reviewState.ValueKind != JsonValueKind.String)
            return "unreviewed";

        var state = reviewState.GetString();
        return state is "approved" or "rejected" ? state : "unreviewed";
    }

    private static string? Validate(DirectSegmentMutationRequest request)
    {
        if (request.ReviewState is not null and not ("unreviewed" or "approved" or "rejected"))
            return "Review state must be approved, rejected, or unreviewed.";
        if (!double.IsFinite(request.StartSec)
            || (request.EndSec is not null && !double.IsFinite(request.EndSec.Value)))
            return "Segment timing must be finite.";
        if (request.EndSec is not null && request.EndSec < request.StartSec)
            return "Segment end must not be before its start.";
        return null;
    }

    private static async Task<(Segment? Source, DirectSegmentMutationResult? Error)> LoadStructuralSourceAsync(
        DbContext db,
        int videoId,
        int segmentId,
        DateTime expectedUpdatedAt,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return (null, new(DirectSegmentMutationStatus.NotFound, Error: "Video not found."));
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return (null, new(DirectSegmentMutationStatus.Forbidden, Error: access.Reason ?? "You cannot edit segments for this video."));
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var source = await db.Set<Segment>().SingleOrDefaultAsync(segment =>
            segment.Id == segmentId
            && segment.HostType == SegmentHostType.Video
            && segment.HostId == videoId
            && segment.Kind == "tag"
            && segment.TagId != null, ct);
        if (source is null)
            return (null, new(DirectSegmentMutationStatus.NotFound, Error: "Segment not found."));
        if (source.UpdatedAt != expectedUpdatedAt)
            return (null, new(DirectSegmentMutationStatus.Conflict, ToSnapshot(source),
                "This segment changed in another session. Reload it before continuing."));
        return (source, null);
    }

    private static Segment Clone(
        Segment source,
        DateTime now,
        bool preserveExtensionMetadata = true) => new()
    {
        HostType = source.HostType,
        HostId = source.HostId,
        StartSec = source.StartSec,
        EndSec = source.EndSec,
        TagId = source.TagId,
        Kind = source.Kind,
        RefId = source.RefId,
        Payload = preserveExtensionMetadata
            ? source.Payload is null
                ? null
                : JsonDocument.Parse(source.Payload.RootElement.GetRawText())
            : RemoveReviewState(
                source.Payload is null
                    ? null
                    : JsonNode.Parse(source.Payload.RootElement.GetRawText())),
        SourceKey = source.SourceKey,
        SourceRunId = source.SourceRunId,
        Confidence = source.Confidence,
        Title = source.Title,
        ColorHint = source.ColorHint,
        CreatedAt = now,
        UpdatedAt = now,
    };

    private static async Task<NativeAnchorCopy?> CopyNativeSlotsAsync(
        DbContext db,
        int sourceSegmentId,
        int targetSegmentId,
        DateTime now,
        CancellationToken ct)
    {
        var sourceItemId = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId == sourceSegmentId)
            .Select(item => (long?)item.Id)
            .SingleOrDefaultAsync(ct);
        if (sourceItemId is null) return null;
        var slots = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            .Where(slot => slot.ItemId == sourceItemId.Value)
            .Select(slot => new { slot.SlotDefinitionId, slot.PerformerId })
            .ToListAsync(ct);
        var targetItem = new SegmentStudioItem
        {
            NativeSegmentId = targetSegmentId,
            RepresentationSchemaVersion = 1,
            Revision = 0,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(targetItem);
        await db.SaveChangesAsync(ct);
        db.AddRange(slots.Select(slot => new SegmentStudioSegmentSlot
        {
            ItemId = targetItem.Id,
            SlotDefinitionId = slot.SlotDefinitionId,
            PerformerId = slot.PerformerId,
            CreatedAt = now,
        }));
        if (slots.Count > 0)
            await db.SaveChangesAsync(ct);
        return new NativeAnchorCopy(sourceItemId.Value, targetItem.Id);
    }

    private readonly record struct NativeAnchorCopy(long SourceItemId, long TargetItemId);

    internal static JsonDocument? MergeReviewState(JsonDocument? payload, string reviewState)
    {
        JsonNode? root = payload is null ? null : JsonNode.Parse(payload.RootElement.GetRawText());
        if (reviewState == "unreviewed")
            return RemoveReviewState(root);

        JsonObject container;
        var payloadWrapped = false;
        if (root is JsonObject objectRoot)
        {
            container = objectRoot;
        }
        else
        {
            container = new JsonObject();
            if (root is not null)
            {
                container[OriginalPayloadProperty] = root;
                payloadWrapped = true;
            }
        }

        var studio = container[StudioProperty] as JsonObject ?? new JsonObject();
        studio["schemaVersion"] = 1;
        studio["reviewState"] = reviewState;
        if (payloadWrapped)
            studio[PayloadWrappedProperty] = true;
        container[StudioProperty] = studio;
        return JsonDocument.Parse(container.ToJsonString());
    }

    private static JsonDocument? RemoveReviewState(JsonNode? root)
    {
        if (root is not JsonObject container)
            return root is null ? null : JsonDocument.Parse(root.ToJsonString());
        if (container[StudioProperty] is not JsonObject studio)
            return JsonDocument.Parse(container.ToJsonString());

        var payloadWrapped = studio[PayloadWrappedProperty] is JsonValue wrappedValue
            && wrappedValue.TryGetValue<bool>(out var wrapped)
            && wrapped;
        studio.Remove("reviewState");
        if (payloadWrapped)
            studio.Remove(PayloadWrappedProperty);
        if (studio.Count == 1
            && studio["schemaVersion"] is JsonValue schemaVersion
            && schemaVersion.TryGetValue<int>(out var version)
            && version == 1)
            container.Remove(StudioProperty);

        if (payloadWrapped
            && container.Count == 1
            && container.TryGetPropertyValue(OriginalPayloadProperty, out var original))
            return original is null ? null : JsonDocument.Parse(original.ToJsonString());
        return container.Count == 0 ? null : JsonDocument.Parse(container.ToJsonString());
    }

    private static IReadOnlyDictionary<string, object?> BuildChangedFields(
        SegmentMutationRow current,
        DirectSegmentMutationRequest request,
        JsonDocument? payload)
    {
        var fields = new Dictionary<string, object?>();
        if (!current.StartSec.Equals(request.StartSec))
            fields["start_sec"] = request.StartSec;
        if (current.EndSec != request.EndSec)
            fields["end_sec"] = request.EndSec;
        if (request.TagId is int tagId && current.TagId != tagId)
            fields["tag_id"] = tagId;
        if (!string.Equals(PayloadText(current.Payload), PayloadText(payload), StringComparison.Ordinal))
            fields["payload"] = payload?.RootElement.Clone();
        return fields;
    }

    private static string? PayloadText(JsonDocument? payload) => payload?.RootElement.GetRawText();

    internal static DateTime NextTimestamp(DateTime current)
    {
        var now = DateTime.UtcNow;
        var minimum = current.AddTicks(10);
        return now >= minimum ? now : minimum;
    }

    private static async Task<DirectSegmentSnapshot?> LoadSnapshotAsync(
        DbContext db,
        int videoId,
        int segmentId,
        CancellationToken ct)
    {
        var row = await db.Set<Segment>()
            .AsNoTracking()
            .Where(segment =>
                segment.Id == segmentId
                && segment.HostType == SegmentHostType.Video
                && segment.HostId == videoId
                && segment.Kind == "tag"
                && segment.TagId != null)
            .Select(segment => new SegmentMutationRow(
                segment.Id,
                segment.HostId,
                segment.TagId!.Value,
                null,
                segment.StartSec,
                segment.EndSec,
                segment.Payload,
                segment.UpdatedAt,
                segment.SourceKey,
                segment.SourceRunId,
                segment.Confidence))
            .SingleOrDefaultAsync(ct);
        if (row is null)
            return null;
        var tagName = await db.Set<Tag>()
            .AsNoTracking()
            .Where(tag => tag.Id == row.TagId)
            .Select(tag => tag.Name)
            .SingleOrDefaultAsync(ct);
        return ToSnapshot(row) with { TagName = tagName };
    }

    private static DirectSegmentSnapshot ToSnapshot(SegmentMutationRow segment) => new(
        segment.Id,
        segment.VideoId,
        segment.TagId,
        segment.TagName,
        segment.StartSec,
        segment.EndSec,
        ReadReviewState(segment.Payload),
        segment.UpdatedAt,
        segment.SourceKey,
        segment.SourceRunId,
        segment.Confidence);

    private static DirectSegmentSnapshot ToSnapshot(Segment segment) => new(
        segment.Id,
        segment.HostId,
        segment.TagId!.Value,
        segment.Tag?.Name,
        segment.StartSec,
        segment.EndSec,
        ReadReviewState(segment.Payload),
        segment.UpdatedAt,
        segment.SourceKey,
        segment.SourceRunId,
        segment.Confidence);

    private sealed record SegmentMutationRow(
        int Id,
        int VideoId,
        int TagId,
        string? TagName,
        double StartSec,
        double? EndSec,
        JsonDocument? Payload,
        DateTime UpdatedAt,
        string SourceKey,
        string? SourceRunId,
        float? Confidence);
}
