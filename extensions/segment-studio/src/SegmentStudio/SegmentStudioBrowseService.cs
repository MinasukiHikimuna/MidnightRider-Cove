using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record BrowseActivity(int TagId, string Name, int SegmentCount, bool HasSlots);
public sealed record BrowsePerformer(int Id, string Name, int AssignmentCount);
public sealed record BrowseFacetSlot(Guid Id, string? Label, int SortOrder, IReadOnlyList<string> GenderHints, IReadOnlyList<BrowsePerformer> Performers);
public sealed record BrowseFacets(BrowseActivity Activity, string Revision, IReadOnlyList<BrowseFacetSlot> Slots);
public sealed record BrowseSlotFilter(Guid SlotDefinitionId, int PerformerId);
public sealed record BrowseRequest(string? Query, int? ActivityTagId, IReadOnlyList<string>? ReviewStates,
    IReadOnlyList<BrowseSlotFilter>? SlotAssignments, int Page = 1, int PerPage = 24, string? Sort = null,
    int? PerformerId = null, IReadOnlyList<int>? ActivityTagIds = null, IReadOnlyList<int>? PerformerIds = null,
    bool IncludeActivitySubtags = false, string? Direction = null);
public sealed record BrowseActivityRef(int TagId, string Name);
public sealed record BrowseSlotValue(Guid SlotDefinitionId, string? Label, int SortOrder, int PerformerId, string PerformerName);
public sealed record BrowseVideoFile(int Id, string Format, double Duration, string AudioCodec);
public sealed record BrowseSegment(string Key, int? SegmentId, long? ItemId, int VideoId, string? VideoTitle,
    double StartSec, double? EndSec, BrowseActivityRef Activity, string Residence, string ReviewState,
    bool Published, long Revision, IReadOnlyList<BrowseSlotValue> Slots, DateTime VideoUpdatedAt,
    DateTime SegmentUpdatedAt, BrowseVideoFile? VideoFile);
public sealed record BrowseResult(IReadOnlyList<BrowseSegment> Items, int Total, int Page, int PerPage, bool PerformerSlotsAvailable);

public static class SegmentStudioBrowseService
{
    public static async Task<IReadOnlyList<BrowseActivity>> ActivitiesAsync(DbContext db, string? query, CancellationToken ct)
    {
        var native = from segment in db.Set<Segment>().AsNoTracking()
                     join video in db.Set<Video>().AsNoTracking() on segment.HostId equals video.Id
                     join tag in db.Set<Tag>().AsNoTracking() on segment.TagId equals tag.Id
                     where segment.HostType == SegmentHostType.Video && segment.Kind == "tag" && segment.TagId != null
                     select new BrowseActivityRow { TagId = tag.Id, TagName = tag.Name };
        var owned = from item in db.Set<SegmentStudioItem>().AsNoTracking()
                    join video in db.Set<Video>().AsNoTracking() on item.VideoId equals video.Id
                    join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
                    where item.NativeSegmentId == null && item.VideoId != null && item.TagId != null
                        && item.StartSec != null && item.Kind == "tag" && item.ReviewState != null
                    select new BrowseActivityRow { TagId = tag.Id, TagName = tag.Name };
        IQueryable<BrowseActivityRow> candidates = native.Concat(owned);
        if (!string.IsNullOrWhiteSpace(query))
        {
            var term = query.Trim().ToLower();
            candidates = candidates.Where(row => row.TagName.ToLower().Contains(term));
        }
        var counts = await candidates.GroupBy(row => new { row.TagId, row.TagName })
            .Select(group => new { group.Key.TagId, Name = group.Key.TagName, Count = group.Count() })
            .OrderBy(row => row.Name).ThenBy(row => row.TagId).Take(100).ToListAsync(ct);
        var tagIds = counts.Select(row => row.TagId).ToArray();
        var withSlots = await db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking()
            .Where(set => tagIds.Contains(set.TagId) && set.Definitions.Any()).Select(set => set.TagId).ToListAsync(ct);
        return counts.Select(row => new BrowseActivity(row.TagId, row.Name, row.Count, withSlots.Contains(row.TagId))).ToArray();
    }

    public static async Task<BrowseFacets?> FacetsAsync(DbContext db, int tagId, CancellationToken ct)
    {
        var activity = await db.Set<Tag>().AsNoTracking().Where(tag => tag.Id == tagId)
            .Select(tag => new { tag.Id, tag.Name }).SingleOrDefaultAsync(ct);
        if (activity is null) return null;
        var nativeCount = await (from segment in db.Set<Segment>().AsNoTracking()
                                 join video in db.Set<Video>().AsNoTracking() on segment.HostId equals video.Id
                                 where segment.HostType == SegmentHostType.Video && segment.Kind == "tag" && segment.TagId == tagId
                                 select segment.Id).CountAsync(ct);
        var ownedCount = await (from item in db.Set<SegmentStudioItem>().AsNoTracking()
                                join video in db.Set<Video>().AsNoTracking() on item.VideoId equals video.Id
                                where item.NativeSegmentId == null && item.VideoId != null && item.TagId == tagId
                                    && item.StartSec != null && item.Kind == "tag" && item.ReviewState != null
                                select item.Id).CountAsync(ct);
        var count = nativeCount + ownedCount;
        var definitions = await PerformerSlotMutationService.LoadDefinitionsAsync(db, tagId, ct);
        if (definitions is null) return new(new(activity.Id, activity.Name, count, false), "", []);
        var definitionIds = definitions.Definitions.Select(item => item.Id).ToArray();
        var nativeItemIds = await (from item in db.Set<SegmentStudioItem>().AsNoTracking()
                                   join segment in db.Set<Segment>().AsNoTracking() on item.NativeSegmentId equals segment.Id
                                   join video in db.Set<Video>().AsNoTracking() on segment.HostId equals video.Id
                                   where segment.HostType == SegmentHostType.Video && segment.Kind == "tag" && segment.TagId == tagId
                                   select item.Id).ToListAsync(ct);
        var ownedItemIds = await (from item in db.Set<SegmentStudioItem>().AsNoTracking()
                                  join video in db.Set<Video>().AsNoTracking() on item.VideoId equals video.Id
                                  where item.NativeSegmentId == null && item.VideoId != null && item.TagId == tagId
                                      && item.StartSec != null && item.Kind == "tag" && item.ReviewState != null
                                  select item.Id).ToListAsync(ct);
        var eligibleItemIds = nativeItemIds.Concat(ownedItemIds).Distinct().ToArray();
        var performers = await (from slot in db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
                                join performer in db.Set<Performer>().AsNoTracking() on slot.PerformerId equals performer.Id
                                where definitionIds.Contains(slot.SlotDefinitionId) && eligibleItemIds.Contains(slot.ItemId)
                                group performer by new { slot.SlotDefinitionId, performer.Id, performer.Name } into grouped
                                select new { grouped.Key.SlotDefinitionId, grouped.Key.Id, grouped.Key.Name, Count = grouped.Count() })
            .ToListAsync(ct);
        var slots = definitions.Definitions.Select(definition => new BrowseFacetSlot(definition.Id, definition.Label,
            definition.SortOrder, definition.GenderHints, performers.Where(item => item.SlotDefinitionId == definition.Id)
                .OrderBy(item => item.Name).ThenBy(item => item.Id).Select(item => new BrowsePerformer(item.Id, item.Name, item.Count)).ToArray())).ToArray();
        return new(new(activity.Id, activity.Name, count, slots.Length != 0), definitions.Revision, slots);
    }

    public static async Task<(BrowseResult? Result, string? Error)> SearchAsync(DbContext db, BrowseRequest request, bool includePerformers, CancellationToken ct)
    {
        var page = Math.Clamp(request.Page, 1, 1_000_000); var perPage = Math.Clamp(request.PerPage, 1, 100);
        if (!string.IsNullOrWhiteSpace(request.Sort) && !request.Sort.Equals("default", StringComparison.OrdinalIgnoreCase))
            return (null, "Sort is invalid.");
        var filters = request.SlotAssignments ?? [];
        if (filters.Count != 0 && request.ActivityTagId is null) return (null, "Slot filters require an activity.");
        if (filters.Count != 0 && !includePerformers) return (null, "Slot filters require unrestricted performer read access.");
        var activityTagIds = (request.ActivityTagIds ?? []).Concat(request.ActivityTagId is int activityTagId ? [activityTagId] : []).Where(id => id > 0).Distinct().ToArray();
        if (request.IncludeActivitySubtags) activityTagIds = await ExpandTagIdsAsync(db, activityTagIds, ct);
        var performerIds = (request.PerformerIds ?? []).Concat(request.PerformerId is int performerIdValue ? [performerIdValue] : []).Where(id => id > 0).Distinct().ToArray();
        if (request.PerformerId is <= 0 || (request.PerformerIds?.Any(id => id <= 0) ?? false)) return (null, "Performer filter is invalid.");
        if (performerIds.Length != 0 && !includePerformers) return (null, "Performer filter requires unrestricted performer read access.");
        if (request.ActivityTagId is int tagId)
        {
            var valid = await db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                .Where(definition => definition.SlotDefinitionSet.TagId == tagId).Select(definition => definition.Id).ToListAsync(ct);
            if (filters.Any(filter => !valid.Contains(filter.SlotDefinitionId))) return (null, "A slot filter does not belong to the selected activity.");
        }
        var states = (request.ReviewStates ?? []).Distinct(StringComparer.OrdinalIgnoreCase).Select(item => item.ToLowerInvariant()).ToArray();
        if (states.Any(state => state is not ("unreviewed" or "approved" or "rejected"))) return (null, "Review state is invalid.");
        var native =
            from segment in db.Set<Segment>().AsNoTracking()
            join video in db.Set<Video>().AsNoTracking() on segment.HostId equals video.Id
            join tag in db.Set<Tag>().AsNoTracking() on segment.TagId equals tag.Id
            join item in db.Set<SegmentStudioItem>().AsNoTracking() on segment.Id equals item.NativeSegmentId into anchors
            from anchor in anchors.DefaultIfEmpty()
            where segment.HostType == SegmentHostType.Video && segment.Kind == "tag" && segment.TagId != null
            select new BrowseRow
            {
                SegmentId = segment.Id,
                ItemId = anchor == null ? null : anchor.Id,
                VideoId = video.Id,
                VideoTitle = video.Title ?? video.FileSearchText,
                StartSec = segment.StartSec,
                EndSec = segment.EndSec,
                TagId = tag.Id,
                TagName = tag.Name,
                Residence = "native",
                ReviewState = "approved",
                Published = true,
                Revision = anchor == null ? 0 : anchor.Revision,
                VideoUpdatedAt = video.UpdatedAt,
                SegmentUpdatedAt = segment.UpdatedAt,
                VideoSearchText = video.SearchText,
                FileSearchText = video.FileSearchText,
            };
        var owned =
            from item in db.Set<SegmentStudioItem>().AsNoTracking()
            join video in db.Set<Video>().AsNoTracking() on item.VideoId equals video.Id
            join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
            where item.NativeSegmentId == null && item.VideoId != null && item.TagId != null
                && item.StartSec != null && item.Kind == "tag" && item.ReviewState != null
            select new BrowseRow
            {
                SegmentId = null,
                ItemId = item.Id,
                VideoId = video.Id,
                VideoTitle = video.Title ?? video.FileSearchText,
                StartSec = item.StartSec!.Value,
                EndSec = item.EndSec,
                TagId = tag.Id,
                TagName = tag.Name,
                Residence = "extension",
                ReviewState = item.ReviewState!,
                Published = false,
                Revision = item.Revision,
                VideoUpdatedAt = video.UpdatedAt,
                SegmentUpdatedAt = item.UpdatedAt,
                VideoSearchText = video.SearchText,
                FileSearchText = video.FileSearchText,
            };
        IQueryable<BrowseRow> query = native.Concat(owned);
        if (activityTagIds.Length != 0) query = query.Where(row => activityTagIds.Contains(row.TagId));
        if (states.Length != 0) query = query.Where(row => states.Contains(row.ReviewState));
        if (performerIds.Length != 0) query = query.Where(row =>
            db.Set<SegmentStudioSegmentSlot>().Any(slot =>
                row.ItemId != null && slot.ItemId == row.ItemId && performerIds.Contains(slot.PerformerId)));
        foreach (var filter in filters) query = query.Where(row => db.Set<SegmentStudioSegmentSlot>().Any(slot => row.ItemId != null
            && slot.ItemId == row.ItemId
            && slot.SlotDefinitionId == filter.SlotDefinitionId && slot.PerformerId == filter.PerformerId));
        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var term = request.Query.Trim().ToLower();
            query = query.Where(row => (row.VideoTitle != null && row.VideoTitle.ToLower().Contains(term))
                || (row.VideoSearchText != null && row.VideoSearchText.ToLower().Contains(term))
                || (row.FileSearchText != null && row.FileSearchText.ToLower().Contains(term))
                || row.TagName.ToLower().Contains(term)
                || (includePerformers && db.Set<SegmentStudioSegmentSlot>().Any(slot => row.ItemId != null && slot.ItemId == row.ItemId
                    && db.Set<Performer>().Any(performer => performer.Id == slot.PerformerId && performer.Name.ToLower().Contains(term)))));
        }
        var total = await query.CountAsync(ct);
        var ascending = request.Direction?.Equals("asc", StringComparison.OrdinalIgnoreCase) == true;
        var ordered = ascending
            ? query.OrderBy(row => row.VideoUpdatedAt).ThenBy(row => row.VideoId)
            : query.OrderByDescending(row => row.VideoUpdatedAt).ThenByDescending(row => row.VideoId);
        var rows = await ordered.ThenBy(row => row.StartSec).ThenByDescending(row => row.Published)
            .ThenBy(row => row.SegmentId).ThenBy(row => row.ItemId)
            .Skip((page - 1) * perPage).Take(perPage)
            .ToListAsync(ct);
        var videoIds = rows.Select(row => row.VideoId).Distinct().ToArray();
        var videoFiles = await db.Set<Video>().AsNoTracking()
            .Where(video => videoIds.Contains(video.Id))
            .Select(video => new
            {
                video.Id,
                File = video.Files.OrderBy(file => file.Id)
                    .Select(file => new BrowseVideoFile(file.Id, file.Format, file.Duration, file.AudioCodec))
                    .FirstOrDefault(),
            })
            .ToDictionaryAsync(row => row.Id, row => row.File, ct);
        var itemIds = rows.Where(row => row.ItemId != null).Select(row => row.ItemId!.Value).ToArray();
        var slots = includePerformers ? await (from slot in db.Set<SegmentStudioSegmentSlot>().AsNoTracking()
            join definition in db.Set<SegmentStudioSlotDefinition>().AsNoTracking() on slot.SlotDefinitionId equals definition.Id
            join performer in db.Set<Performer>().AsNoTracking() on slot.PerformerId equals performer.Id
            where itemIds.Contains(slot.ItemId)
            select new { slot.ItemId, Value = new BrowseSlotValue(definition.Id, definition.Label, definition.SortOrder, performer.Id, performer.Name) }).ToListAsync(ct) : [];
        var materialized = rows.Select(row => new BrowseSegment(
            row.SegmentId is int nativeId ? $"native:{nativeId}" : $"item:{row.ItemId}",
            row.SegmentId, row.ItemId, row.VideoId, row.VideoTitle, row.StartSec, row.EndSec,
            new(row.TagId, row.TagName), row.Residence, row.ReviewState, row.Published, row.Revision,
            slots.Where(slot => slot.ItemId == row.ItemId).Select(slot => slot.Value)
                .OrderBy(slot => slot.SortOrder).ThenBy(slot => slot.SlotDefinitionId).ToArray(),
            row.VideoUpdatedAt, row.SegmentUpdatedAt, videoFiles.GetValueOrDefault(row.VideoId))).ToArray();
        return (new(materialized, total, page, perPage, includePerformers), null);
    }

    private static async Task<int[]> ExpandTagIdsAsync(DbContext db, IReadOnlyList<int> ids, CancellationToken ct)
    {
        if (ids.Count == 0) return [];
        var relations = await db.Set<TagParent>().AsNoTracking().Select(link => new { link.ParentId, link.ChildId }).ToListAsync(ct);
        var children = relations.GroupBy(link => link.ParentId).ToDictionary(group => group.Key, group => group.Select(link => link.ChildId).ToArray());
        var expanded = new HashSet<int>(ids);
        var pending = new Queue<int>(ids);
        while (pending.TryDequeue(out var parentId))
            if (children.TryGetValue(parentId, out var childIds))
                foreach (var childId in childIds)
                    if (expanded.Add(childId)) pending.Enqueue(childId);
        return expanded.ToArray();
    }

    private sealed class BrowseRow
    {
        public int? SegmentId { get; init; }
        public long? ItemId { get; init; }
        public int VideoId { get; init; }
        public string? VideoTitle { get; init; }
        public double StartSec { get; init; }
        public double? EndSec { get; init; }
        public int TagId { get; init; }
        public string TagName { get; init; } = "";
        public string Residence { get; init; } = "";
        public string ReviewState { get; init; } = "";
        public bool Published { get; init; }
        public long Revision { get; init; }
        public DateTime VideoUpdatedAt { get; init; }
        public DateTime SegmentUpdatedAt { get; init; }
        public string? VideoSearchText { get; init; }
        public string? FileSearchText { get; init; }
    }

    private sealed class BrowseActivityRow
    {
        public int TagId { get; init; }
        public string TagName { get; init; } = "";
    }
}
