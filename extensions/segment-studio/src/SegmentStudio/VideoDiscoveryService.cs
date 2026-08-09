using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record VideoDiscoveryQuery(
    int Page = 1,
    int PerPage = 24,
    string? Query = null,
    string? Sort = null,
    string? Direction = null,
    int? Seed = null,
    bool? HasSegments = null,
    string? ReviewState = null,
    int? SegmentTagId = null,
    IReadOnlyList<int>? SegmentTagIds = null,
    IReadOnlyList<int>? ExcludedSegmentTagIds = null,
    string? SegmentTagMode = null,
    bool IncludeSegmentSubtags = false,
    IReadOnlyList<int>? VideoTagIds = null,
    IReadOnlyList<int>? ExcludedVideoTagIds = null,
    string? VideoTagMode = null,
    bool IncludeVideoSubtags = false,
    IReadOnlyList<int>? PerformerIds = null,
    IReadOnlyList<int>? ExcludedPerformerIds = null,
    string? PerformerMode = null,
    int? StudioId = null,
    IReadOnlyList<int>? StudioIds = null,
    IReadOnlyList<int>? ExcludedStudioIds = null,
    string? StudioMode = null,
    bool IncludeSubstudios = false,
    bool? HasShotBoundaries = null,
    string? Workflow = null);

public sealed record VideoDiscoveryItem(
    int VideoId,
    string Title,
    string? Details,
    string? Date,
    bool Organized,
    bool IsVr,
    double Duration,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    int SegmentCount,
    int UnreviewedCount,
    int ApprovedCount,
    int RejectedCount);

public sealed record VideoDiscoveryResult(
    IReadOnlyList<VideoDiscoveryItem> Items,
    int TotalCount,
    int Page,
    int PerPage);

public static class VideoDiscoveryService
{
    public static async Task<VideoDiscoveryResult> FindAsync(
        DbContext db,
        VideoDiscoveryQuery request,
        CancellationToken ct)
    {
        var page = Math.Max(1, request.Page);
        var perPage = Math.Clamp(request.PerPage, 1, 1000);
        var videos = db.Set<Video>().AsNoTracking().AsQueryable();
        var videoFiles = db.Set<VideoFile>().AsNoTracking();
        var segments = SegmentRows(db, request.Workflow);

        var search = request.Query?.Trim().ToLowerInvariant();
        if (!string.IsNullOrEmpty(search))
        {
            videos = videos.Where(video =>
                (video.Title != null && video.Title.ToLower().Contains(search))
                || (video.Code != null && video.Code.ToLower().Contains(search))
                || (video.SearchText != null && video.SearchText.ToLower().Contains(search))
                || (video.FileSearchText != null && video.FileSearchText.ToLower().Contains(search)));
        }

        if (request.HasSegments is true)
            videos = videos.Where(video => segments.Any(segment => segment.VideoId == video.Id));
        else if (request.HasSegments is false)
            videos = videos.Where(video => !segments.Any(segment => segment.VideoId == video.Id));

        var segmentTagIds = NormalizeIds(request.SegmentTagIds)
            .Concat(request.SegmentTagId is > 0 ? [request.SegmentTagId.Value] : [])
            .Distinct().ToArray();
        var excludedSegmentTagIds = NormalizeIds(request.ExcludedSegmentTagIds);
        var segmentTagGroups = await ExpandTagGroupsAsync(db, segmentTagIds, request.IncludeSegmentSubtags, ct);
        var excludedSegmentTags = await ExpandTagIdsAsync(db, excludedSegmentTagIds, request.IncludeSegmentSubtags, ct);
        if (request.SegmentTagMode == "null") videos = videos.Where(video => !segments.Any(segment => segment.VideoId == video.Id));
        else if (request.SegmentTagMode == "not-null") videos = videos.Where(video => segments.Any(segment => segment.VideoId == video.Id));
        else if (request.SegmentTagMode == "all")
            foreach (var group in segmentTagGroups) videos = videos.Where(video => segments.Any(segment => segment.VideoId == video.Id && group.Contains(segment.TagId)));
        else if (segmentTagGroups.Length > 0)
        {
            var includedSegmentTags = segmentTagGroups.SelectMany(ids => ids).Distinct().ToArray();
            videos = videos.Where(video => segments.Any(segment => segment.VideoId == video.Id && includedSegmentTags.Contains(segment.TagId)));
        }
        if (excludedSegmentTags.Length > 0)
            videos = videos.Where(video => !segments.Any(segment => segment.VideoId == video.Id && excludedSegmentTags.Contains(segment.TagId)));

        if (request.ReviewState is "unreviewed" or "approved" or "rejected")
        {
            var reviewState = request.ReviewState;
            videos = videos.Where(video => segments.Any(segment =>
                segment.VideoId == video.Id && segment.ReviewState == reviewState));
        }

        var effectiveVideoTags = EffectiveVideoTags(db);
        var videoTagGroups = await ExpandTagGroupsAsync(db, NormalizeIds(request.VideoTagIds), request.IncludeVideoSubtags, ct);
        var excludedVideoTagIds = await ExpandTagIdsAsync(db, NormalizeIds(request.ExcludedVideoTagIds), request.IncludeVideoSubtags, ct);
        if (request.VideoTagMode == "null") videos = videos.Where(video => !effectiveVideoTags.Any(tag => tag.VideoId == video.Id));
        else if (request.VideoTagMode == "not-null") videos = videos.Where(video => effectiveVideoTags.Any(tag => tag.VideoId == video.Id));
        else if (request.VideoTagMode == "all")
            foreach (var group in videoTagGroups) videos = videos.Where(video => effectiveVideoTags.Any(tag => tag.VideoId == video.Id && group.Contains(tag.TagId)));
        else if (videoTagGroups.Length > 0)
        {
            var includedVideoTagIds = videoTagGroups.SelectMany(ids => ids).Distinct().ToArray();
            videos = videos.Where(video => effectiveVideoTags.Any(tag => tag.VideoId == video.Id && includedVideoTagIds.Contains(tag.TagId)));
        }
        if (excludedVideoTagIds.Length > 0)
            videos = videos.Where(video => !effectiveVideoTags.Any(tag => tag.VideoId == video.Id && excludedVideoTagIds.Contains(tag.TagId)));

        var videoPerformers = db.Set<VideoPerformer>().AsNoTracking();
        var performerIds = NormalizeIds(request.PerformerIds);
        var excludedPerformerIds = NormalizeIds(request.ExcludedPerformerIds);
        if (request.PerformerMode == "null") videos = videos.Where(video => !videoPerformers.Any(link => link.VideoId == video.Id));
        else if (request.PerformerMode == "not-null") videos = videos.Where(video => videoPerformers.Any(link => link.VideoId == video.Id));
        else if (request.PerformerMode == "all")
            foreach (var performerId in performerIds) videos = videos.Where(video => videoPerformers.Any(link => link.VideoId == video.Id && link.PerformerId == performerId));
        else if (performerIds.Length > 0)
            videos = videos.Where(video => videoPerformers.Any(link => link.VideoId == video.Id && performerIds.Contains(link.PerformerId)));
        if (excludedPerformerIds.Length > 0)
            videos = videos.Where(video => !videoPerformers.Any(link => link.VideoId == video.Id && excludedPerformerIds.Contains(link.PerformerId)));

        var studioIds = NormalizeIds(request.StudioIds)
            .Concat(request.StudioId is > 0 ? [request.StudioId.Value] : [])
            .Distinct().ToArray();
        var studioGroups = await ExpandStudioGroupsAsync(db, studioIds, request.IncludeSubstudios, ct);
        var excludedStudioIds = (await ExpandStudioGroupsAsync(db, NormalizeIds(request.ExcludedStudioIds), request.IncludeSubstudios, ct))
            .SelectMany(ids => ids).Distinct().ToArray();
        var visibleStudios = db.Set<Studio>().AsNoTracking();
        if (request.StudioMode == "null") videos = videos.Where(video => video.StudioId == null || !visibleStudios.Any(studio => studio.Id == video.StudioId));
        else if (request.StudioMode == "not-null") videos = videos.Where(video => video.StudioId != null && visibleStudios.Any(studio => studio.Id == video.StudioId));
        else if (request.StudioMode == "all")
        {
            foreach (var group in studioGroups)
                videos = videos.Where(video => video.StudioId != null && group.Contains(video.StudioId.Value)
                    && visibleStudios.Any(studio => studio.Id == video.StudioId));
        }
        else if (studioGroups.Length > 0)
        {
            var includedStudioIds = studioGroups.SelectMany(ids => ids).Distinct().ToArray();
            videos = videos.Where(video => video.StudioId != null && includedStudioIds.Contains(video.StudioId.Value)
                && visibleStudios.Any(studio => studio.Id == video.StudioId));
        }
        if (excludedStudioIds.Length > 0)
            videos = videos.Where(video => video.StudioId == null || !excludedStudioIds.Contains(video.StudioId.Value));

        if (request.HasShotBoundaries is not null)
        {
            var shotBoundaries = db.Set<SegmentStudioShotBoundary>().AsNoTracking();
            videos = request.HasShotBoundaries.Value
                ? videos.Where(video => shotBoundaries.Any(boundary => boundary.VideoId == video.Id))
                : videos.Where(video => !shotBoundaries.Any(boundary => boundary.VideoId == video.Id));
        }

        var rows = videos.Select(video => new DiscoveryRow
        {
            VideoId = video.Id,
            Title = video.Title
                ?? videoFiles.Where(file => file.VideoId == video.Id)
                    .OrderBy(file => file.Id)
                    .Select(file => file.Basename)
                    .FirstOrDefault()
                ?? "",
            Details = video.Details,
            Date = video.Date,
            Organized = video.Organized,
            IsVr = video.IsVr,
            Duration = video.MaxDuration,
            CreatedAt = video.CreatedAt,
            UpdatedAt = video.UpdatedAt,
            SegmentCount = segments.Count(segment => segment.VideoId == video.Id),
            UnreviewedCount = segments.Count(segment => segment.VideoId == video.Id && segment.ReviewState == "unreviewed"),
            ApprovedCount = segments.Count(segment => segment.VideoId == video.Id && segment.ReviewState == "approved"),
            RejectedCount = segments.Count(segment => segment.VideoId == video.Id && segment.ReviewState == "rejected"),
        });

        var totalCount = await rows.CountAsync(ct);
        rows = ApplySort(rows, request.Sort, request.Direction, request.Seed);
        var materialized = await rows
            .Skip((page - 1) * perPage)
            .Take(perPage)
            .ToListAsync(ct);

        var items = materialized.Select(row => new VideoDiscoveryItem(
            row.VideoId,
            string.IsNullOrWhiteSpace(row.Title) ? $"Video {row.VideoId}" : row.Title,
            row.Details,
            row.Date?.ToString("yyyy-MM-dd"),
            row.Organized,
            row.IsVr,
            row.Duration,
            row.CreatedAt,
            row.UpdatedAt,
            row.SegmentCount,
            row.UnreviewedCount,
            row.ApprovedCount,
            row.RejectedCount)).ToList();

        return new(items, totalCount, page, perPage);
    }

    private static int[] NormalizeIds(IReadOnlyList<int>? ids) =>
        ids?.Where(id => id > 0).Distinct().ToArray() ?? [];

    private static async Task<int[][]> ExpandTagGroupsAsync(DbContext db, IReadOnlyList<int> ids, bool includeDescendants, CancellationToken ct)
    {
        if (!includeDescendants || ids.Count == 0) return ids.Select(id => new[] { id }).ToArray();
        var relations = await db.Set<TagParent>().AsNoTracking().Select(link => new { link.ParentId, link.ChildId }).ToListAsync(ct);
        var children = relations.GroupBy(link => link.ParentId).ToDictionary(group => group.Key, group => group.Select(link => link.ChildId).ToArray());
        return ids.Select(id => ExpandHierarchy(id, children)).ToArray();
    }

    private static async Task<int[]> ExpandTagIdsAsync(DbContext db, IReadOnlyList<int> ids, bool includeDescendants, CancellationToken ct) =>
        (await ExpandTagGroupsAsync(db, ids, includeDescendants, ct)).SelectMany(group => group).Distinct().ToArray();

    private static async Task<int[][]> ExpandStudioGroupsAsync(DbContext db, IReadOnlyList<int> ids, bool includeDescendants, CancellationToken ct)
    {
        if (!includeDescendants || ids.Count == 0) return ids.Select(id => new[] { id }).ToArray();
        var relations = await db.Set<Studio>().AsNoTracking().Where(studio => studio.ParentId != null)
            .Select(studio => new { ParentId = studio.ParentId!.Value, ChildId = studio.Id }).ToListAsync(ct);
        var children = relations.GroupBy(link => link.ParentId).ToDictionary(group => group.Key, group => group.Select(link => link.ChildId).ToArray());
        return ids.Select(id => ExpandHierarchy(id, children)).ToArray();
    }

    private static int[] ExpandHierarchy(int rootId, IReadOnlyDictionary<int, int[]> children)
    {
        var expanded = new HashSet<int> { rootId };
        var pending = new Queue<int>();
        pending.Enqueue(rootId);
        while (pending.TryDequeue(out var parentId))
            if (children.TryGetValue(parentId, out var childIds))
                foreach (var childId in childIds)
                    if (expanded.Add(childId)) pending.Enqueue(childId);
        return expanded.ToArray();
    }

    private static IQueryable<DiscoveryVideoTagRow> EffectiveVideoTags(DbContext db)
    {
        var direct = db.Set<VideoTag>().AsNoTracking()
            .Select(link => new DiscoveryVideoTagRow
            {
                VideoId = link.VideoId,
                TagId = link.TagId,
            });
        var occurrenceDerived =
            from application in db.Set<TagApplication>().AsNoTracking()
            join tag in db.Set<Tag>().AsNoTracking() on application.TagId equals tag.Id
            where application.HostType == AffinityHostType.Video
                && application.ContextType == null
                && application.ContextId == null
                && ((tag.MinOccurrenceSec == null && tag.MinOccurrencePercent == null)
                    || (tag.MinOccurrenceSec != null
                        && application.TotalDurationSec != null
                        && application.TotalDurationSec.Value >= tag.MinOccurrenceSec.Value)
                    || (tag.MinOccurrencePercent != null
                        && application.TotalDurationSec != null
                        && application.HostDurationSec != null
                        && application.HostDurationSec.Value > 0d
                        && application.TotalDurationSec.Value * 100d / application.HostDurationSec.Value >= tag.MinOccurrencePercent.Value))
            select new DiscoveryVideoTagRow
            {
                VideoId = application.HostId,
                TagId = application.TagId,
            };
        return direct.Concat(occurrenceDerived);
    }

    private static IQueryable<DiscoverySegmentRow> SegmentRows(DbContext db, string? workflow)
    {
        if (workflow == "basic")
        {
            return db.Set<Segment>().AsNoTracking()
                .Where(segment => segment.HostType == SegmentHostType.Video
                    && segment.Kind == "tag"
                    && segment.TagId != null)
                .Select(segment => new DiscoverySegmentRow
                {
                    VideoId = segment.HostId,
                    TagId = segment.TagId!.Value,
                    ReviewState = "",
                });
        }
        if (workflow == "full")
        {
            var native = db.Set<Segment>().AsNoTracking()
                .Where(segment => segment.HostType == SegmentHostType.Video && segment.Kind == "tag" && segment.TagId != null)
                .Select(segment => new DiscoverySegmentRow
                {
                    VideoId = segment.HostId,
                    TagId = segment.TagId!.Value,
                    ReviewState = "approved",
                });
            var owned = db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.NativeSegmentId == null && item.VideoId != null && item.TagId != null
                    && item.StartSec != null && item.Kind == "tag" && item.ReviewState != null)
                .Select(item => new DiscoverySegmentRow
                {
                    VideoId = item.VideoId!.Value,
                    TagId = item.TagId!.Value,
                    ReviewState = item.ReviewState!,
                });
            return native.Concat(owned);
        }

        return db.Set<SegmentStudioReviewSegment>().AsNoTracking().Select(segment => new DiscoverySegmentRow
        {
            VideoId = segment.VideoId,
            TagId = segment.TagId,
            ReviewState = segment.ReviewState,
        });
    }

    private static IQueryable<DiscoveryRow> ApplySort(
        IQueryable<DiscoveryRow> rows,
        string? sort,
        string? direction,
        int? seed)
    {
        var descending = string.Equals(direction, "desc", StringComparison.OrdinalIgnoreCase);
        var randomSeed = Math.Abs((long)(seed ?? 1));
        if (randomSeed == 0)
            randomSeed = 1;
        return (sort, descending) switch
        {
            ("random", true) => rows
                .OrderByDescending(row => ((long)row.VideoId * 17L + randomSeed * 31L) % 13L)
                .ThenByDescending(row => ((long)row.VideoId * 101L + randomSeed * 131L) % 97L)
                .ThenByDescending(row => ((long)row.VideoId * 1103515245L + randomSeed * 12345L) % 2147483647L)
                .ThenByDescending(row => row.VideoId),
            ("random", false) => rows
                .OrderBy(row => ((long)row.VideoId * 17L + randomSeed * 31L) % 13L)
                .ThenBy(row => ((long)row.VideoId * 101L + randomSeed * 131L) % 97L)
                .ThenBy(row => ((long)row.VideoId * 1103515245L + randomSeed * 12345L) % 2147483647L)
                .ThenBy(row => row.VideoId),
            ("created_at", true) => rows.OrderByDescending(row => row.CreatedAt).ThenByDescending(row => row.VideoId),
            ("created_at", false) => rows.OrderBy(row => row.CreatedAt).ThenBy(row => row.VideoId),
            ("updated_at", true) => rows.OrderByDescending(row => row.UpdatedAt).ThenByDescending(row => row.VideoId),
            ("updated_at", false) => rows.OrderBy(row => row.UpdatedAt).ThenBy(row => row.VideoId),
            ("segment_count", true) => rows.OrderByDescending(row => row.SegmentCount).ThenBy(row => row.Title).ThenBy(row => row.VideoId),
            ("segment_count", false) => rows.OrderBy(row => row.SegmentCount).ThenBy(row => row.Title).ThenBy(row => row.VideoId),
            ("unreviewed_count", true) => rows.OrderByDescending(row => row.UnreviewedCount).ThenBy(row => row.Title).ThenBy(row => row.VideoId),
            ("unreviewed_count", false) => rows.OrderBy(row => row.UnreviewedCount).ThenBy(row => row.Title).ThenBy(row => row.VideoId),
            (_, true) => rows.OrderByDescending(row => row.Title).ThenByDescending(row => row.VideoId),
            _ => rows.OrderBy(row => row.Title).ThenBy(row => row.VideoId),
        };
    }

    private sealed class DiscoveryRow
    {
        public int VideoId { get; init; }
        public string Title { get; init; } = "";
        public string? Details { get; init; }
        public DateOnly? Date { get; init; }
        public bool Organized { get; init; }
        public bool IsVr { get; init; }
        public double Duration { get; init; }
        public DateTime CreatedAt { get; init; }
        public DateTime UpdatedAt { get; init; }
        public int SegmentCount { get; init; }
        public int UnreviewedCount { get; init; }
        public int ApprovedCount { get; init; }
        public int RejectedCount { get; init; }
    }

    private sealed class DiscoverySegmentRow
    {
        public int VideoId { get; init; }
        public int TagId { get; init; }
        public string ReviewState { get; init; } = "";
    }

    private sealed class DiscoveryVideoTagRow
    {
        public int VideoId { get; init; }
        public int TagId { get; init; }
    }
}
