using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SegmentStudio;

public sealed record SegmentEditorIdentityChange(
    long PreviousId,
    long CurrentId);

public sealed record SegmentEditorDelta(
    IReadOnlyList<SegmentEditorMergeSurvivor> UpsertedSegments,
    IReadOnlyList<long> RemovedSegmentIds,
    IReadOnlyList<SegmentEditorIdentityChange> IdentityChanges,
    string? ApprovedSetVersion,
    IReadOnlyList<SegmentEditorBasicSegment>? UpsertedBasicSegments = null,
    // Every performer slot of the upserted segments and their assignment revisions, when the
    // delta carries them; the editor replaces those segments' slots with these.
    IReadOnlyList<PerformerSlotEditorItem>? PerformerSlots = null,
    IReadOnlyDictionary<long, string>? PerformerSlotRevisions = null);

public sealed record SegmentEditorBasicFieldProvenance(
    int NativeSegmentId,
    string FieldKey,
    [property: JsonIgnore] string? ValueJson,
    string SourceKey,
    string SourceRunId,
    string ModelKey,
    float? Confidence,
    DateTime CreatedAt,
    DateTime UpdatedAt)
{
    [JsonPropertyName("value")]
    public JsonElement? Value
    {
        get
        {
            if (ValueJson is null) return null;
            using var document = JsonDocument.Parse(ValueJson);
            return document.RootElement.Clone();
        }
    }
}

public sealed record SegmentEditorBasicSegment(
    string Key,
    long Id,
    int NativeSegmentId,
    int VideoId,
    int TagId,
    string? TagName,
    string? TagSortName,
    double StartSec,
    double? EndSec,
    string Kind,
    string? RefId,
    string? PayloadJson,
    DateTime UpdatedAt,
    string SourceKey,
    string? SourceRunId,
    float? Confidence,
    string? Title,
    string? ColorHint,
    string? ImageBlobId,
    DateTime CreatedAt,
    IReadOnlyList<SegmentEditorBasicFieldProvenance> FieldProvenance);

public static class SegmentEditorDeltaService
{
    // The widest change an editor mutation describes itself; a wider one leaves the editor to reload.
    public const int MutationDeltaRowLimit = 200;

    /// <summary>
    /// What an editor mutation of <paramref name="rootItemIds"/> changed, including the performer
    /// slots of every changed row when <paramref name="includePerformerSlots"/> is set, so the editor
    /// can show it without refetching its whole projection. Null when the change is too wide.
    /// </summary>
    public static async Task<SegmentEditorDelta?> LoadMutationDeltaAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> rootItemIds,
        bool includePerformerSlots,
        CancellationToken ct)
    {
        var delta = await LoadBoundedItemClosureAsync(
            db, videoId, rootItemIds, [], [], MutationDeltaRowLimit, ct);
        if (delta is null || !includePerformerSlots) return delta;
        var nativeTagIds = delta.UpsertedSegments
            .Where(segment => segment.NativeSegmentId is not null)
            .ToDictionary(segment => segment.NativeSegmentId!.Value, segment => segment.TagId);
        var ownedTagIds = delta.UpsertedSegments
            .Where(segment => segment.NativeSegmentId is null && segment.ItemId is not null)
            .ToDictionary(segment => segment.ItemId!.Value, segment => segment.TagId);
        var slots = await PerformerSlotEditorService.LoadUnifiedAsync(db, nativeTagIds, ownedTagIds, ct);
        var revisions = await PerformerSlotMutationService.LoadUnifiedAssignmentRevisionsAsync(
            db, nativeTagIds, ownedTagIds, slots, ct);
        return delta with { PerformerSlots = slots, PerformerSlotRevisions = revisions };
    }

    /// <summary>
    /// <see cref="LoadMutationDeltaAsync"/> for native segments, starting from the Segment Studio
    /// items that anchor them. A native segment without an anchor is not shown by the Full editor.
    /// </summary>
    public static async Task<SegmentEditorDelta?> LoadNativeMutationDeltaAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<int> nativeSegmentIds,
        bool includePerformerSlots,
        CancellationToken ct)
    {
        var anchorIds = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId != null && nativeSegmentIds.Contains(item.NativeSegmentId.Value))
            .Select(item => item.Id)
            .ToArrayAsync(ct);
        // Nothing to describe means the editor cannot trust a delta, so it reloads instead.
        if (anchorIds.Length == 0) return null;
        return await LoadMutationDeltaAsync(db, videoId, anchorIds, includePerformerSlots, ct);
    }

    /// <summary>
    /// The same closure as <see cref="LoadItemClosureAsync"/>, or null when it spans more
    /// than <paramref name="maxItems"/> rows. A caller that can fall back to a full editor
    /// reload uses this so one response, and the replay receipt storing it, stay bounded
    /// however wide the derivation graph under those roots turns out to be.
    /// </summary>
    public static async Task<SegmentEditorDelta?> LoadBoundedItemClosureAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> rootItemIds,
        IReadOnlyCollection<long> removedSegmentIds,
        IReadOnlyCollection<SegmentEditorIdentityChange> identityChanges,
        int maxItems,
        CancellationToken ct)
    {
        var itemIds = await ReachableItemIdsAsync(db, videoId, rootItemIds, ct);
        if (itemIds.Count > maxItems) return null;
        return new(
            await LoadItemsAsync(db, videoId, itemIds, ct),
            removedSegmentIds.ToArray(),
            identityChanges.ToArray(),
            await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(
                db, videoId, ct));
    }

    public static async Task<SegmentEditorDelta> LoadItemClosureAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> rootItemIds,
        IReadOnlyCollection<long> removedSegmentIds,
        IReadOnlyCollection<SegmentEditorIdentityChange> identityChanges,
        CancellationToken ct)
    {
        var itemIds = await ReachableItemIdsAsync(db, videoId, rootItemIds, ct);
        var segments = await LoadItemsAsync(db, videoId, itemIds, ct);
        return new(
            segments,
            removedSegmentIds.ToArray(),
            identityChanges.ToArray(),
            await SegmentStudioReviewCompletionService.GetApprovedSetVersionAsync(
                db, videoId, ct));
    }

    public static async Task<SegmentEditorDelta> LoadNativeAsync(
        DbContext db,
        int videoId,
        int nativeSegmentId,
        CancellationToken ct)
    {
        var segment = await (
                from candidate in db.Set<Segment>().AsNoTracking()
                join tag in db.Set<Tag>().AsNoTracking()
                    on candidate.TagId equals tag.Id
                where candidate.Id == nativeSegmentId
                    && candidate.HostType == SegmentHostType.Video
                    && candidate.HostId == videoId
                    && candidate.Kind == "tag"
                select new SegmentEditorMergeSurvivor(
                    $"native:{candidate.Id}",
                    candidate.Id,
                    null,
                    candidate.Id,
                    videoId,
                    candidate.TagId!.Value,
                    tag.Name,
                    tag.SortName,
                    candidate.StartSec,
                    candidate.EndSec,
                    "unreviewed",
                    "native",
                    true,
                    0,
                    candidate.UpdatedAt,
                    candidate.SourceKey,
                    candidate.SourceRunId,
                    candidate.Confidence,
                    false))
            .SingleAsync(ct);
        return new(
            [segment],
            [],
            [],
            null);
    }

    public static async Task<SegmentEditorDelta> LoadBasicNativeAsync(
        DbContext db,
        int videoId,
        int nativeSegmentId,
        bool includeFieldProvenance,
        CancellationToken ct)
    {
        var segment = await db.Set<Segment>().AsNoTracking()
            .SingleAsync(candidate =>
                candidate.Id == nativeSegmentId
                && candidate.HostType == SegmentHostType.Video
                && candidate.HostId == videoId
                && candidate.Kind == "tag", ct);
        var tag = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tag.Id == segment.TagId)
            .Select(tag => new { tag.Name, tag.SortName })
            .SingleAsync(ct);
        var provenance = !includeFieldProvenance
            || db.Model.FindEntityType(typeof(FieldProvenance)) is null
            ? []
            : await db.Set<FieldProvenance>().AsNoTracking()
                .Where(row =>
                    row.HostType == AffinityHostType.Segment
                    && row.HostId == nativeSegmentId)
                .OrderBy(row => row.Id)
                .Select(row => new SegmentEditorBasicFieldProvenance(
                    row.HostId,
                    row.FieldKey,
                    row.ValueJson,
                    row.SourceKey,
                    row.SourceRunId,
                    row.ModelKey,
                    row.Confidence,
                    row.CreatedAt,
                    row.UpdatedAt))
                .ToListAsync(ct);
        var basic = new SegmentEditorBasicSegment(
            $"native:{segment.Id}",
            segment.Id,
            segment.Id,
            videoId,
            segment.TagId!.Value,
            tag.Name,
            tag.SortName,
            segment.StartSec,
            segment.EndSec,
            segment.Kind ?? "tag",
            segment.RefId?.ToString(),
            segment.Payload?.RootElement.GetRawText(),
            segment.UpdatedAt,
            segment.SourceKey,
            segment.SourceRunId,
            segment.Confidence,
            segment.Title,
            segment.ColorHint,
            segment.ImageBlobId,
            segment.CreatedAt,
            provenance);
        return new([], [], [], null, [basic]);
    }

    public static SegmentEditorDelta RemovedNative(long nativeSegmentId) =>
        new([], [nativeSegmentId], [], null);

    private static async Task<IReadOnlyCollection<long>> ReachableItemIdsAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> rootItemIds,
        CancellationToken ct)
    {
        var nodes = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.LastKnownVideoId == videoId && node.State == "live")
            .Select(node => new { node.Id, node.ItemId })
            .ToListAsync(ct);
        var rootNodes = nodes
            .Where(node => node.ItemId is long itemId && rootItemIds.Contains(itemId))
            .Select(node => node.Id)
            .ToArray();
        if (rootNodes.Length == 0) return rootItemIds.ToArray();

        var reachable = rootNodes.ToHashSet();
        var frontier = rootNodes;
        while (frontier.Length > 0)
        {
            var next = await db.Set<SegmentStudioDerivationEdge>().AsNoTracking()
                .Where(edge => frontier.Contains(edge.SourceNodeId))
                .Select(edge => edge.DerivedNodeId)
                .Distinct()
                .ToArrayAsync(ct);
            frontier = next.Where(reachable.Add).ToArray();
        }

        return nodes
            .Where(node => reachable.Contains(node.Id) && node.ItemId is not null)
            .Select(node => node.ItemId!.Value)
            .Concat(rootItemIds)
            .Distinct()
            .ToArray();
    }

    private static async Task<IReadOnlyList<SegmentEditorMergeSurvivor>> LoadItemsAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> itemIds,
        CancellationToken ct)
    {
        if (itemIds.Count == 0) return [];
        var items = await db.Set<SegmentStudioItem>().AsNoTracking()
            // Native anchors carry no video id; their segments are scoped to the video below.
            .Where(item => itemIds.Contains(item.Id)
                && (item.VideoId == videoId || item.NativeSegmentId != null))
            .ToListAsync(ct);
        var ownedIds = items
            .Where(item => item.NativeSegmentId is null && item.ReviewState is not null)
            .Select(item => item.Id)
            .ToArray();
        var owned = await (
                from item in db.Set<SegmentStudioItem>().AsNoTracking()
                join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
                where ownedIds.Contains(item.Id)
                select new SegmentEditorMergeSurvivor(
                    $"item:{item.Id}",
                    -item.Id,
                    item.Id,
                    null,
                    videoId,
                    item.TagId!.Value,
                    tag.Name,
                    tag.SortName,
                    item.StartSec!.Value,
                    item.EndSec,
                    item.ReviewState!,
                    "extension",
                    false,
                    item.Revision,
                    item.UpdatedAt,
                    item.SourceKey!,
                    item.SourceRunId,
                    item.Confidence,
                    false))
            .ToListAsync(ct);

        var nativeItemIds = items
            .Where(item => item.NativeSegmentId is not null)
            .ToDictionary(item => item.NativeSegmentId!.Value, item => item.Id);
        var nativeIds = nativeItemIds.Keys.ToArray();
        var nativeRows = await (
                from segment in db.Set<Segment>().AsNoTracking()
                join tag in db.Set<Tag>().AsNoTracking() on segment.TagId equals tag.Id
                where nativeIds.Contains(segment.Id)
                    && segment.HostType == SegmentHostType.Video
                    && segment.HostId == videoId
                    && segment.Kind == "tag"
                select new
                {
                    segment.Id,
                    TagId = segment.TagId!.Value,
                    TagName = tag.Name,
                    TagSortName = tag.SortName,
                    segment.StartSec,
                    segment.EndSec,
                    segment.UpdatedAt,
                    segment.SourceKey,
                    segment.SourceRunId,
                    segment.Confidence,
                })
            .ToListAsync(ct);
        var native = nativeRows.Select(segment => new SegmentEditorMergeSurvivor(
            $"native:{segment.Id}",
            segment.Id,
            nativeItemIds[segment.Id],
            segment.Id,
            videoId,
            segment.TagId,
            segment.TagName,
            segment.TagSortName,
            segment.StartSec,
            segment.EndSec,
            "approved",
            "native",
            true,
            0,
            segment.UpdatedAt,
            segment.SourceKey,
            segment.SourceRunId,
            segment.Confidence,
            false));

        var derivedItemIds = await DerivedTagGuard.LoadDerivedItemIdsAsync(
            db, items.Select(item => item.Id).ToArray(), ct);
        return owned.Concat(native)
            .Select(segment => segment with
            {
                IsDerived = segment.ItemId is long itemId
                    && derivedItemIds.Contains(itemId),
            })
            .OrderBy(segment => segment.StartSec)
            .ThenBy(segment => segment.Key, StringComparer.Ordinal)
            .ToArray();
    }
}
