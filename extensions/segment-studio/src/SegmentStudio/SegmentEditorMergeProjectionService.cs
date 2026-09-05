using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentEditorMergeSurvivor(
    string Key,
    long Id,
    long? ItemId,
    int? NativeSegmentId,
    int VideoId,
    int TagId,
    string? TagName,
    string? TagSortName,
    double StartSec,
    double? EndSec,
    string ReviewState,
    string Residence,
    bool Published,
    long Revision,
    DateTime UpdatedAt,
    string SourceKey,
    string? SourceRunId,
    float? Confidence,
    bool IsDerived);

public sealed record SegmentEditorMergeDelta(
    SegmentEditorMergeSurvivor Survivor,
    IReadOnlyList<long> RemovedSegmentIds,
    IReadOnlyList<long> RemovedItemIds,
    IReadOnlyList<PerformerSlotEditorItem>? PerformerSlots,
    IReadOnlyDictionary<long, string>? PerformerSlotRevisions,
    IReadOnlyDictionary<long, SegmentEditorItemMetadata>? ItemMetadata,
    string? ApprovedSetVersion);

public static class SegmentEditorMergeProjectionService
{
    public static async Task<SegmentEditorMergeDelta> LoadNativeAsync(
        DbContext db,
        DirectSegmentSnapshot snapshot,
        IReadOnlyList<int> removedNativeSegmentIds,
        IReadOnlyList<long> removedItemIds,
        bool includeExtensionIdentity,
        bool includePerformerSlots,
        bool includeItemMetadata,
        bool includeApprovedSetVersion,
        CancellationToken ct)
    {
        var itemId = includeExtensionIdentity
            ? await db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.NativeSegmentId == snapshot.Id)
                .Select(item => (long?)item.Id)
                .SingleOrDefaultAsync(ct)
            : null;
        var tag = await db.Set<Cove.Core.Entities.Tag>().AsNoTracking()
            .Where(tag => tag.Id == snapshot.TagId)
            .Select(tag => new { tag.Name, tag.SortName })
            .SingleOrDefaultAsync(ct);
        var survivor = new SegmentEditorMergeSurvivor(
            $"native:{snapshot.Id}", snapshot.Id, itemId, snapshot.Id,
            snapshot.VideoId, snapshot.TagId, tag?.Name, tag?.SortName, snapshot.StartSec,
            snapshot.EndSec, includeApprovedSetVersion ? "approved" : snapshot.ReviewState,
            "native", true, 0, snapshot.UpdatedAt,
            snapshot.SourceKey, snapshot.SourceRunId, snapshot.Confidence, false);
        return await LoadCollectionsAsync(
            db, survivor, removedNativeSegmentIds.Select(id => (long)id).ToArray(),
            removedItemIds, includePerformerSlots, includeItemMetadata,
            includeApprovedSetVersion, ct);
    }

    public static async Task<SegmentEditorMergeDelta> LoadDraftAsync(
        DbContext db,
        SegmentDraftSnapshot snapshot,
        IReadOnlyList<long> removedItemIds,
        bool includePerformerSlots,
        bool includeItemMetadata,
        bool includeApprovedSetVersion,
        CancellationToken ct)
    {
        var canonical = await (
                from item in db.Set<SegmentStudioItem>().AsNoTracking()
                join tag in db.Set<Cove.Core.Entities.Tag>().AsNoTracking() on item.TagId equals tag.Id
                where item.Id == snapshot.ItemId
                select new { tag.Name, tag.SortName, item.SourceKey, item.SourceRunId, item.Confidence })
            .SingleAsync(ct);
        var survivor = new SegmentEditorMergeSurvivor(
            $"item:{snapshot.ItemId}", -snapshot.ItemId, snapshot.ItemId, null,
            snapshot.VideoId, snapshot.TagId, canonical.Name, canonical.SortName, snapshot.StartSec,
            snapshot.EndSec, snapshot.ReviewState, "extension", false,
            snapshot.Revision, snapshot.UpdatedAt, canonical.SourceKey!,
            canonical.SourceRunId, canonical.Confidence, false);
        return await LoadCollectionsAsync(
            db, survivor, removedItemIds.Select(id => -id).ToArray(), removedItemIds,
            includePerformerSlots, includeItemMetadata, includeApprovedSetVersion, ct);
    }

    private static async Task<SegmentEditorMergeDelta> LoadCollectionsAsync(
        DbContext db,
        SegmentEditorMergeSurvivor survivor,
        IReadOnlyList<long> removedSegmentIds,
        IReadOnlyList<long> removedItemIds,
        bool includePerformerSlots,
        bool includeItemMetadata,
        bool includeApprovedSetVersion,
        CancellationToken ct)
    {
        IReadOnlyList<PerformerSlotEditorItem>? slots = null;
        IReadOnlyDictionary<long, string>? revisions = null;
        if (includePerformerSlots)
        {
            var nativeTags = survivor.NativeSegmentId is int nativeId
                ? new Dictionary<int, int> { [nativeId] = survivor.TagId }
                : new Dictionary<int, int>();
            var ownedTags = survivor.NativeSegmentId is null && survivor.ItemId is long itemId
                ? new Dictionary<long, int> { [itemId] = survivor.TagId }
                : new Dictionary<long, int>();
            slots = await PerformerSlotEditorService.LoadUnifiedAsync(db, nativeTags, ownedTags, ct);
            revisions = await PerformerSlotMutationService.LoadUnifiedAssignmentRevisionsAsync(
                db, nativeTags, ownedTags, slots, ct);
        }

        IReadOnlyDictionary<long, SegmentEditorItemMetadata>? metadata = null;
        if (includeItemMetadata && survivor.ItemId is long metadataItemId)
        {
            var nodeId = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
                .Where(node => node.ItemId == metadataItemId && node.State == "live")
                .Select(node => (Guid?)node.Id)
                .SingleOrDefaultAsync(ct);
            metadata = new Dictionary<long, SegmentEditorItemMetadata>
            {
                [metadataItemId] = new(
                    [],
                    new SegmentLineageDto(
                        nodeId, false, false, 1,
                        nodeId is null ? "consistent" : "unchecked", [], [])),
            };
        }

        return new(
            survivor,
            removedSegmentIds,
            removedItemIds,
            slots,
            revisions,
            metadata,
            includeApprovedSetVersion
                ? await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(
                    db, survivor.VideoId, ct)
                : null);
    }
}
