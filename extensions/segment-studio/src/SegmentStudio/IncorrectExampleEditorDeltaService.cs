using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SegmentStudio;

public sealed record IncorrectExampleSegmentIdentityChange(
    long PreviousId,
    long CurrentId);

public sealed record IncorrectExampleEditorDelta(
    IReadOnlyList<SegmentEditorMergeSurvivor> UpsertedSegments,
    IReadOnlyList<long> RemovedSegmentIds,
    IReadOnlyList<IncorrectExampleSegmentIdentityChange> IdentityChanges,
    string? ApprovedSetVersion,
    IReadOnlyList<IncorrectExampleBasicEditorSegment>? UpsertedBasicSegments = null);

public sealed record IncorrectExampleBasicFieldProvenance(
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

public sealed record IncorrectExampleBasicEditorSegment(
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
    IReadOnlyList<IncorrectExampleBasicFieldProvenance> FieldProvenance);

public static class IncorrectExampleEditorDeltaService
{
    public static async Task<IncorrectExampleEditorDelta> LoadItemClosureAsync(
        DbContext db,
        int videoId,
        IReadOnlyCollection<long> rootItemIds,
        IReadOnlyCollection<long> removedSegmentIds,
        IReadOnlyCollection<IncorrectExampleSegmentIdentityChange> identityChanges,
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

    public static async Task<IncorrectExampleEditorDelta> LoadNativeAsync(
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

    public static async Task<IncorrectExampleEditorDelta> LoadBasicNativeAsync(
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
                .Select(row => new IncorrectExampleBasicFieldProvenance(
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
        var basic = new IncorrectExampleBasicEditorSegment(
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

    public static IncorrectExampleEditorDelta RemovedNative(long nativeSegmentId) =>
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
            .Where(item => itemIds.Contains(item.Id) && item.VideoId == videoId)
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
