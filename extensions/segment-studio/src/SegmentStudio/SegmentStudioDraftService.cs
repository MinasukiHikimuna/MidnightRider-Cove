using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public enum SegmentDraftMutationStatus
{
    Updated,
    NotFound,
    Forbidden,
    Conflict,
    Invalid,
}

public sealed record CreateSegmentDraftRequest(
    Guid OperationId,
    int TagId,
    double StartSec,
    double? EndSec);

public sealed record UpdateSegmentDraftRequest(
    Guid OperationId,
    long ExpectedRevision,
    double StartSec,
    double? EndSec,
    int TagId,
    string? ReviewState = null);

public sealed record SplitSegmentDraftRequest(
    Guid OperationId,
    long ExpectedRevision,
    double SplitSec);

public sealed record DuplicateSegmentDraftRequest(
    Guid OperationId,
    long ExpectedRevision,
    double? StartSec = null);

public sealed record MergeSegmentDraftRequest(
    Guid OperationId,
    long SourceItemId,
    long ExpectedTargetRevision,
    long ExpectedSourceRevision);

public sealed record MergeSegmentDraftSelectionItem(
    Guid OperationId,
    long ItemId,
    long ExpectedRevision);

public sealed record MergeSegmentDraftSelectionRequest(
    long SurvivorItemId,
    long ExpectedSurvivorRevision,
    IReadOnlyList<MergeSegmentDraftSelectionItem> ConsumedDrafts);

public sealed record SegmentDraftSnapshot(
    long ItemId,
    int? NativeSegmentId,
    int VideoId,
    int TagId,
    double StartSec,
    double? EndSec,
    string ReviewState,
    bool Published,
    long Revision,
    DateTime UpdatedAt);

public sealed record SegmentDraftMutationResult(
    SegmentDraftMutationStatus Status,
    SegmentDraftSnapshot? Draft = null,
    string? Error = null,
    bool Replayed = false,
    SegmentDraftSnapshot? CreatedDraft = null,
    string? Code = null);

public static class SegmentStudioDraftService
{
    private const string CreateKind = "create-draft";
    private const string UpdateKind = "update-draft";
    private const string SplitKind = "split-draft";
    private const string DuplicateKind = "duplicate-draft";
    private const string MergeKind = "merge-drafts";

    public static async Task<SegmentDraftMutationResult> CreateAsync(
        DbContext db,
        int videoId,
        CreateSegmentDraftRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var validationError = Validate(request.StartSec, request.EndSec);
        if (validationError is not null)
            return new(SegmentDraftMutationStatus.Invalid, Error: validationError);
        var accessError = await AuthorizeWriteAsync(db, videoId, principal, authorization, ct);
        if (accessError is not null)
            return accessError;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var fingerprint = Fingerprint(CreateKind, videoId, request.TagId, request.StartSec, request.EndSec);
        var lockError = await LockOperationAsync(db, request.OperationId, ct);
        if (lockError is not null)
            return lockError;
        var replay = await ReplayAsync(db, request.OperationId, CreateKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == request.TagId, ct))
            return new(SegmentDraftMutationStatus.Invalid, Error: "Tag not found.");

        var now = DateTime.UtcNow;
        var item = new SegmentStudioItem
        {
            ReviewState = "approved",
            RepresentationSchemaVersion = 1,
            VideoId = videoId,
            TagId = request.TagId,
            StartSec = request.StartSec,
            EndSec = request.EndSec,
            Kind = "tag",
            SourceKey = "segment-studio/user",
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(item);
        await db.SaveChangesAsync(ct);
        var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
            principal, authorization, ct);
        if (slotAccess.Allowed
            && await PerformerSlotAutoAssignmentService.TryAssignItemAsync(db, item, ct))
            await db.SaveChangesAsync(ct);
        var result = new SegmentDraftMutationResult(SegmentDraftMutationStatus.Updated, ToSnapshot(item));
        db.Add(CreateReceipt(request.OperationId, CreateKind, fingerprint, principal, item.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentDraftMutationResult> UpdateAsync(
        DbContext db,
        int videoId,
        long itemId,
        UpdateSegmentDraftRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var validationError = Validate(request.StartSec, request.EndSec);
        if (validationError is not null)
            return new(SegmentDraftMutationStatus.Invalid, Error: validationError);
        if (request.ReviewState is not null and not ("unreviewed" or "approved" or "rejected"))
            return new(SegmentDraftMutationStatus.Invalid, Error: "Review state is invalid.");
        var accessError = await AuthorizeWriteAsync(db, videoId, principal, authorization, ct);
        if (accessError is not null)
            return accessError;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var fingerprint = Fingerprint(UpdateKind, videoId, itemId, request.ExpectedRevision,
            request.TagId, request.StartSec, request.EndSec, request.ReviewState);
        var lockError = await LockOperationAsync(db, request.OperationId, ct);
        if (lockError is not null)
            return lockError;
        var replay = await ReplayAsync(db, request.OperationId, UpdateKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;
        await LockItemAsync(db, itemId, ct);
        replay = await ReplayAsync(db, request.OperationId, UpdateKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var item = await db.Set<SegmentStudioItem>().SingleOrDefaultAsync(candidate =>
            candidate.Id == itemId
            && candidate.NativeSegmentId == null
            && candidate.VideoId == videoId
            && candidate.ReviewState != null, ct);
        if (item is null)
            return new(SegmentDraftMutationStatus.NotFound, Error: "Draft not found.");
        if (item.Revision != request.ExpectedRevision)
            return new(SegmentDraftMutationStatus.Conflict, ToSnapshot(item),
                "This draft changed in another session. Reload it before saving again.");
        if (!await db.Set<Tag>().AsNoTracking().AnyAsync(tag => tag.Id == request.TagId, ct))
            return new(SegmentDraftMutationStatus.Invalid, Error: "Tag not found.");

        var tagChanged = item.TagId != request.TagId;
        if (tagChanged && await DerivedTagGuard.IsDerivedItemAsync(db, item.Id, ct))
            return new(
                SegmentDraftMutationStatus.Conflict,
                ToSnapshot(item),
                "This segment's tag is determined by its derivation rule.",
                Code: "DERIVED_TAG_IMMUTABLE");
        if (tagChanged && await DerivedTagGuard.HasOutgoingEdgesAsync(db, item.Id, ct))
            return new(
                SegmentDraftMutationStatus.Conflict,
                ToSnapshot(item),
                "This segment has derived descendants and requires lineage reconciliation before retagging.",
                Code: "LINEAGE_COMPONENT_PROTECTED");
        var contentChanged = tagChanged || item.StartSec != request.StartSec || item.EndSec != request.EndSec;
        var nextReviewState = request.ReviewState ?? item.ReviewState;
        var changed = contentChanged || item.ReviewState != nextReviewState;
        if (changed)
        {
            if (tagChanged)
            {
                var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
                    principal, authorization, ct);
                await PerformerSlotRetaggingService.RemapAsync(
                    db, item.Id, item.TagId!.Value, request.TagId, ct,
                    autoAssignMissingSlots: slotAccess.Allowed);
            }
            item.StartSec = request.StartSec;
            item.EndSec = request.EndSec;
            item.TagId = request.TagId;
            item.ReviewState = nextReviewState;
            item.Revision++;
            item.UpdatedAt = DateTime.UtcNow;
            if (nextReviewState == "rejected")
                await DerivedSegmentRejectionService.RejectDescendantsAsync(db, item.Id, ct);
        }
        var result = new SegmentDraftMutationResult(SegmentDraftMutationStatus.Updated, ToSnapshot(item));
        db.Add(CreateReceipt(request.OperationId, UpdateKind, fingerprint, principal, item.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentDraftMutationResult> SplitAsync(
        DbContext db,
        int videoId,
        long itemId,
        SplitSegmentDraftRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (!double.IsFinite(request.SplitSec) || request.SplitSec < 0)
            return new(SegmentDraftMutationStatus.Invalid, Error: "Split time must be finite and non-negative.");
        var accessError = await AuthorizeWriteAsync(db, videoId, principal, authorization, ct);
        if (accessError is not null)
            return accessError;
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var fingerprint = Fingerprint(SplitKind, videoId, itemId, request.ExpectedRevision, request.SplitSec);
        var lockError = await LockOperationAsync(db, request.OperationId, ct);
        if (lockError is not null)
            return lockError;
        var replay = await ReplayAsync(db, request.OperationId, SplitKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;
        await LockItemAsync(db, itemId, ct);
        replay = await ReplayAsync(db, request.OperationId, SplitKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;

        var item = await LoadOwnedDraftAsync(db, videoId, itemId, ct);
        if (item is null)
            return new(SegmentDraftMutationStatus.NotFound, Error: "Draft not found.");
        if (item.Revision != request.ExpectedRevision)
            return new(SegmentDraftMutationStatus.Conflict, ToSnapshot(item),
                "This draft changed in another session. Reload it before splitting it.");
        if (request.SplitSec <= item.StartSec
            || (item.EndSec is not null && request.SplitSec >= item.EndSec))
            return new(SegmentDraftMutationStatus.Invalid, ToSnapshot(item),
                "Split time must be inside the draft range.");

        var originalEnd = item.EndSec;
        var now = DateTime.UtcNow;
        var second = CloneOwnedCanonical(item, now);
        second.StartSec = request.SplitSec;
        second.EndSec = originalEnd;
        second.ReviewState = item.ReviewState;
        item.EndSec = request.SplitSec;
        item.Revision++;
        item.UpdatedAt = now;
        db.Add(second);
        await db.SaveChangesAsync(ct);
        await CopySlotsAsync(db, item.Id, second.Id, now, ct);

        var result = new SegmentDraftMutationResult(
            SegmentDraftMutationStatus.Updated,
            ToSnapshot(item),
            CreatedDraft: ToSnapshot(second));
        db.Add(CreateReceipt(request.OperationId, SplitKind, fingerprint, principal, item.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentDraftMutationResult> DuplicateAsync(
        DbContext db,
        int videoId,
        long itemId,
        DuplicateSegmentDraftRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        ISegmentDuplicationProvenanceService duplicateProvenance,
        CancellationToken ct)
    {
        var accessError = await AuthorizeWriteAsync(db, videoId, principal, authorization, ct);
        if (accessError is not null)
            return accessError;
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        if (request.StartSec is not null && (!double.IsFinite(request.StartSec.Value) || request.StartSec.Value < 0))
            return new(SegmentDraftMutationStatus.Invalid, Error: "Duplicate start time must be finite and non-negative.");
        var fingerprint = Fingerprint(DuplicateKind, videoId, itemId, request.ExpectedRevision, request.StartSec);
        var lockError = await LockOperationAsync(db, request.OperationId, ct);
        if (lockError is not null)
            return lockError;
        var replay = await ReplayAsync(db, request.OperationId, DuplicateKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;
        await LockItemAsync(db, itemId, ct);
        replay = await ReplayAsync(db, request.OperationId, DuplicateKind, fingerprint, principal, ct);
        if (replay is not null)
            return replay;
        try
        {
            await SegmentStudioRolloutService.EnsureWritesEnabledAsync(db, ct);
        }
        catch (LineageConflictException exception)
        {
            return new(
                SegmentDraftMutationStatus.Conflict,
                Error: exception.Message,
                Code: exception.Code);
        }

        var item = await LoadOwnedDraftAsync(db, videoId, itemId, ct);
        if (item is null)
            return new(SegmentDraftMutationStatus.NotFound, Error: "Draft not found.");
        if (item.Revision != request.ExpectedRevision)
            return new(SegmentDraftMutationStatus.Conflict, ToSnapshot(item),
                "This draft changed in another session. Reload it before duplicating it.");
        var now = DateTime.UtcNow;
        var duplicate = CloneOwnedCanonical(item, now);
        if (request.StartSec is not null)
        {
            var duration = item.EndSec is null ? null : item.EndSec - item.StartSec;
            duplicate.StartSec = request.StartSec.Value;
            duplicate.EndSec = duration is null ? null : request.StartSec.Value + duration.Value;
        }
        db.Add(duplicate);
        await db.SaveChangesAsync(ct);
        await CopySlotsAsync(db, item.Id, duplicate.Id, now, ct);
        var slotAccess = await SegmentStudioAuthorization.AuthorizePerformerSlotReadAsync(
            principal, authorization, ct);
        if (slotAccess.Allowed)
            await PerformerSlotAutoAssignmentService.TryAssignItemAsync(
                db, duplicate, ct, videoId);
        await duplicateProvenance.CopyAsync(db, item.Id, duplicate.Id, ct);
        var result = new SegmentDraftMutationResult(
            SegmentDraftMutationStatus.Updated,
            ToSnapshot(item),
            CreatedDraft: ToSnapshot(duplicate));
        db.Add(CreateReceipt(request.OperationId, DuplicateKind, fingerprint, principal, item.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    public static async Task<SegmentDraftMutationResult> MergeAsync(
        DbContext db,
        int videoId,
        long targetItemId,
        MergeSegmentDraftRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (targetItemId == request.SourceItemId)
            return new(SegmentDraftMutationStatus.Invalid, Error: "Choose two different drafts to merge.");
        var accessError = await AuthorizeWriteAsync(db, videoId, principal, authorization, ct);
        if (accessError is not null) return accessError;
        var deleteAccess = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsDelete, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!deleteAccess.Allowed)
            return new(SegmentDraftMutationStatus.Forbidden,
                Error: deleteAccess.Reason ?? "You cannot delete segments for this video.");
        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var fingerprint = Fingerprint(MergeKind, videoId, targetItemId, request.SourceItemId,
            request.ExpectedTargetRevision, request.ExpectedSourceRevision);
        var lockError = await LockOperationAsync(db, request.OperationId, ct);
        if (lockError is not null) return lockError;
        var replay = await ReplayAsync(db, request.OperationId, MergeKind, fingerprint, principal, ct);
        if (replay is not null) return replay;
        await LockItemAsync(db, Math.Min(targetItemId, request.SourceItemId), ct);
        await LockItemAsync(db, Math.Max(targetItemId, request.SourceItemId), ct);
        replay = await ReplayAsync(db, request.OperationId, MergeKind, fingerprint, principal, ct);
        if (replay is not null) return replay;

        var items = await db.Set<SegmentStudioItem>().Where(item =>
            item.VideoId == videoId && item.NativeSegmentId == null
            && item.Kind == "tag" && item.TagId != null && item.StartSec != null && item.ReviewState != null
            && (item.Id == targetItemId || item.Id == request.SourceItemId)).ToListAsync(ct);
        var target = items.SingleOrDefault(item => item.Id == targetItemId);
        var source = items.SingleOrDefault(item => item.Id == request.SourceItemId);
        if (target is null || source is null)
            return new(SegmentDraftMutationStatus.NotFound, Error: "Merge source or target draft was not found.");
        if (target.Revision != request.ExpectedTargetRevision || source.Revision != request.ExpectedSourceRevision)
            return new(SegmentDraftMutationStatus.Conflict, Error: "A merge draft changed. Reload before trying again.");
        if (target.TagId != source.TagId)
            return new(SegmentDraftMutationStatus.Invalid,
                Error: "Merge requires drafts from the same swimlane.");
        var mergeSlots = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            .Where(slot => slot.ItemId == target.Id || slot.ItemId == source.Id)
            .ToListAsync(ct);
        if (SlotSignature(mergeSlots.Where(slot => slot.ItemId == target.Id))
            != SlotSignature(mergeSlots.Where(slot => slot.ItemId == source.Id)))
            return new(SegmentDraftMutationStatus.Invalid,
                Error: "Merge requires drafts from the same performer swimlane.");
        var first = target.StartSec < source.StartSec
            || (target.StartSec == source.StartSec && target.Id < source.Id) ? target : source;
        var consumed = first.Id == target.Id ? source : target;
        foreach (var item in items)
        {
            if (!string.IsNullOrWhiteSpace(item.ExtensionImageBlobId))
                return new(SegmentDraftMutationStatus.Conflict,
                    Error: "Drafts with extension images cannot be merged.");
        }
        double? mergedEndSec = Math.Max(
            first.EndSec ?? first.StartSec.GetValueOrDefault(),
            consumed.EndSec ?? consumed.StartSec.GetValueOrDefault());
        var lineageError = await SegmentMergeLineageService.ConsolidateRootsAsync(
            db, first.Id, consumed.Id, videoId, first.TagId!.Value, first.StartSec!.Value, mergedEndSec, ct);
        if (lineageError is not null)
            return new(SegmentDraftMutationStatus.Conflict, Error: lineageError);
        first.EndSec = mergedEndSec;
        first.SourceKey = "user";
        first.SourceRunId = null;
        first.Confidence = null;
        first.Revision++;
        first.UpdatedAt = DateTime.UtcNow;
        db.Remove(consumed);
        await db.SaveChangesAsync(ct);
        var result = new SegmentDraftMutationResult(SegmentDraftMutationStatus.Updated, ToSnapshot(first));
        db.Add(CreateReceipt(request.OperationId, MergeKind, fingerprint, principal, first.Id, result));
        await db.SaveChangesAsync(ct);
        return result;
    }

    private static string SlotSignature(IEnumerable<SegmentStudioSegmentSlot> slots) =>
        string.Join("|", slots.OrderBy(slot => slot.SlotDefinitionId)
            .Select(slot => $"{slot.SlotDefinitionId:N}:{slot.PerformerId}"));

    private static async Task<SegmentDraftMutationResult?> AuthorizeWriteAsync(
        DbContext db,
        int videoId,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return new(SegmentDraftMutationStatus.NotFound, Error: "Video not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
        return access.Allowed
            ? null
            : new(SegmentDraftMutationStatus.Forbidden, Error: access.Reason ?? "You cannot edit segments for this video.");
    }

    private static string? Validate(double startSec, double? endSec)
    {
        if (!double.IsFinite(startSec) || (endSec is not null && !double.IsFinite(endSec.Value)))
            return "Segment timing must be finite.";
        if (startSec < 0 || (endSec is not null && endSec < startSec))
            return "Segment timing is invalid.";
        return null;
    }

    private static Task<SegmentStudioItem?> LoadOwnedDraftAsync(
        DbContext db,
        int videoId,
        long itemId,
        CancellationToken ct) => db.Set<SegmentStudioItem>().SingleOrDefaultAsync(candidate =>
            candidate.Id == itemId
            && candidate.NativeSegmentId == null
            && candidate.VideoId == videoId
            && candidate.ReviewState != null, ct);

    private static SegmentStudioItem CloneOwnedCanonical(SegmentStudioItem source, DateTime now) => new()
    {
        ReviewState = "approved",
        RepresentationSchemaVersion = source.RepresentationSchemaVersion,
        VideoId = source.VideoId,
        StartSec = source.StartSec,
        EndSec = source.EndSec,
        TagId = source.TagId,
        Kind = source.Kind,
        RefId = source.RefId,
        PayloadJson = source.PayloadJson,
        SourceKey = source.SourceKey,
        SourceRunId = source.SourceRunId,
        Confidence = source.Confidence,
        Title = source.Title,
        ColorHint = source.ColorHint,
        // Blob references are exclusive. Split/duplicate retain the existing image
        // on the stable source item rather than silently sharing its ownership.
        ExtensionImageBlobId = null,
        Revision = 1,
        CreatedAt = now,
        UpdatedAt = now,
    };

    private static async Task CopySlotsAsync(
        DbContext db,
        long sourceItemId,
        long targetItemId,
        DateTime now,
        CancellationToken ct)
    {
        var slots = await db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            .Where(slot => slot.ItemId == sourceItemId)
            .Select(slot => new { slot.SlotDefinitionId, slot.PerformerId })
            .ToListAsync(ct);
        db.AddRange(slots.Select(slot => new SegmentStudioSegmentSlot
        {
            ItemId = targetItemId,
            SlotDefinitionId = slot.SlotDefinitionId,
            PerformerId = slot.PerformerId,
            CreatedAt = now,
        }));
        if (slots.Count > 0)
            await db.SaveChangesAsync(ct);
    }

    private static SegmentDraftSnapshot ToSnapshot(SegmentStudioItem item) => new(
        item.Id,
        item.NativeSegmentId,
        item.VideoId!.Value,
        item.TagId!.Value,
        item.StartSec!.Value,
        item.EndSec,
        item.ReviewState!,
        false,
        item.Revision,
        item.UpdatedAt);

    private static SegmentStudioSegmentOperation CreateReceipt(
        Guid operationId,
        string kind,
        string fingerprint,
        CovePrincipal? principal,
        long itemId,
        SegmentDraftMutationResult result) => new()
        {
            OperationId = operationId,
            Kind = kind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = fingerprint,
            ItemId = itemId,
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = DateTime.UtcNow,
        };

    private static async Task<SegmentDraftMutationResult?> ReplayAsync(
        DbContext db,
        Guid operationId,
        string kind,
        string fingerprint,
        CovePrincipal? principal,
        CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == operationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != kind
            || receipt.RequestFingerprint != fingerprint
            || receipt.ActorUserId != principal?.UserId)
            return new(SegmentDraftMutationStatus.Conflict, Error: "The operation ID was already used for a different request.");
        var result = JsonSerializer.Deserialize<SegmentDraftMutationResult>(receipt.ResultPayloadJson!)!;
        return result with { Replayed = true };
    }

    private static async Task<SegmentDraftMutationResult?> LockOperationAsync(
        DbContext db,
        Guid operationId,
        CancellationToken ct)
    {
        if (operationId == Guid.Empty)
            return new(SegmentDraftMutationStatus.Invalid, Error: "Operation ID is required.");
        if (db.Database.IsRelational())
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_xact_lock(hashtextextended({operationId.ToString()}, 0))", ct);
        return null;
    }

    private static async Task LockItemAsync(DbContext db, long itemId, CancellationToken ct)
    {
        if (!db.Database.IsRelational())
            return;
        _ = await db.Database.SqlQuery<long>(
                $"SELECT id AS \"Value\" FROM segment_studio_items WHERE id = {itemId} FOR UPDATE")
            .SingleOrDefaultAsync(ct);
    }

    private static string Fingerprint(string kind, params object?[] values)
    {
        var canonical = JsonSerializer.Serialize(new { kind, values });
        return Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(canonical))).ToLowerInvariant();
    }
}
