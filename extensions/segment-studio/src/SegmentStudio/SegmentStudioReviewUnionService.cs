using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record ReviewUnionRequest(
    string? Query = null,
    int? VideoId = null,
    int? TagId = null,
    IReadOnlyList<string>? ReviewStates = null,
    int Page = 1,
    int PerPage = 50,
    string? Sort = null,
    string? Direction = null,
    bool BasicInventoryOnly = false);

public sealed record ReviewUnionCounts(int Unreviewed, int Approved, int Rejected, int Unpublished, int Total);

public sealed record ReviewUnionItem(
    string Key,
    long? ItemId,
    int? NativeSegmentId,
    int VideoId,
    string? VideoTitle,
    int TagId,
    string? TagName,
    double StartSec,
    double? EndSec,
    string Residence,
    string ReviewState,
    bool Published,
    long Revision,
    DateTime UpdatedAt);

public sealed record ReviewUnionResult(
    IReadOnlyList<ReviewUnionItem> Items,
    int Total,
    int Page,
    int PerPage,
    ReviewUnionCounts Counts);

public static class SegmentStudioReviewUnionService
{
    private static readonly string[] ReviewStates = ["unreviewed", "approved", "rejected"];
    private static readonly string[] Sorts = ["default", "time", "updated"];

    public static async Task<(ReviewUnionResult? Result, string? Error)> SearchAuthorizedAsync(
        DbContext db,
        ReviewUnionRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var sort = string.IsNullOrWhiteSpace(request.Sort) ? "default" : request.Sort.ToLowerInvariant();
        var direction = string.IsNullOrWhiteSpace(request.Direction) ? "asc" : request.Direction.ToLowerInvariant();
        if (!Sorts.Contains(sort, StringComparer.Ordinal))
            return (null, "Sort is invalid.");
        if (direction is not ("asc" or "desc"))
            return (null, "Direction is invalid.");

        var states = (request.ReviewStates ?? [])
            .Select(state => state.ToLowerInvariant())
            .Distinct(StringComparer.Ordinal)
            .ToArray();
        if (states.Any(state => !ReviewStates.Contains(state, StringComparer.Ordinal)))
            return (null, "Review state is invalid.");

        var candidateVideoIds = await EligibleNativeSegments(db)
            .Select(segment => segment.HostId)
            .Concat(EligibleOwnedItems(db).Select(item => item.VideoId!.Value))
            .Where(videoId => request.VideoId == null || videoId == request.VideoId)
            .Distinct()
            .ToListAsync(ct);
        var allowedVideoIds = new List<int>(candidateVideoIds.Count);
        foreach (var videoId in candidateVideoIds)
        {
            var access = await authorization.AuthorizeAsync(
                principal, Permissions.SegmentsRead, EntityRef.Of(EntityKinds.Video, videoId), ct);
            if (access.Allowed)
                allowedVideoIds.Add(videoId);
        }

        var native =
            from segment in EligibleNativeSegments(db)
            join video in db.Set<Video>().AsNoTracking() on segment.HostId equals video.Id
            join tag in db.Set<Tag>().AsNoTracking() on segment.TagId equals tag.Id
            join item in db.Set<SegmentStudioItem>().AsNoTracking() on segment.Id equals item.NativeSegmentId into anchors
            from anchor in anchors.DefaultIfEmpty()
            where allowedVideoIds.Contains(segment.HostId)
            select new ReviewUnionRow
            {
                ItemId = anchor == null ? null : anchor.Id,
                NativeSegmentId = segment.Id,
                VideoId = video.Id,
                VideoTitle = video.Title ?? video.FileSearchText,
                TagId = tag.Id,
                TagName = tag.Name,
                StartSec = segment.StartSec,
                EndSec = segment.EndSec,
                Residence = "native",
                ReviewState = "approved",
                Published = true,
                Revision = anchor == null ? 0 : anchor.Revision,
                UpdatedAt = segment.UpdatedAt,
                VideoSearchText = video.SearchText,
                FileSearchText = video.FileSearchText,
            };
        var owned =
            from item in EligibleOwnedItems(db)
            join video in db.Set<Video>().AsNoTracking() on item.VideoId equals video.Id
            join tag in db.Set<Tag>().AsNoTracking() on item.TagId equals tag.Id
            where allowedVideoIds.Contains(item.VideoId!.Value)
            select new ReviewUnionRow
            {
                ItemId = item.Id,
                NativeSegmentId = null,
                VideoId = video.Id,
                VideoTitle = video.Title ?? video.FileSearchText,
                TagId = tag.Id,
                TagName = tag.Name,
                StartSec = item.StartSec!.Value,
                EndSec = item.EndSec,
                Residence = "extension",
                ReviewState = item.ReviewState!,
                Published = false,
                Revision = item.Revision,
                UpdatedAt = item.UpdatedAt,
                VideoSearchText = video.SearchText,
                FileSearchText = video.FileSearchText,
            };

        IQueryable<ReviewUnionRow> scoped = native.Concat(owned);
        if (request.BasicInventoryOnly)
            scoped = scoped.Where(row => row.Published || row.ReviewState == "rejected");
        if (request.TagId is int tagId)
            scoped = scoped.Where(row => row.TagId == tagId);
        if (!string.IsNullOrWhiteSpace(request.Query))
        {
            var term = request.Query.Trim().ToLower();
            scoped = scoped.Where(row =>
                (row.VideoTitle != null && row.VideoTitle.ToLower().Contains(term))
                || (row.VideoSearchText != null && row.VideoSearchText.ToLower().Contains(term))
                || (row.FileSearchText != null && row.FileSearchText.ToLower().Contains(term))
                || row.TagName.ToLower().Contains(term));
        }

        var groupedCounts = await scoped
            .GroupBy(row => row.ReviewState)
            .Select(group => new { State = group.Key, Count = group.Count() })
            .ToDictionaryAsync(group => group.State, group => group.Count, ct);
        var counts = new ReviewUnionCounts(
            groupedCounts.GetValueOrDefault("unreviewed"),
            groupedCounts.GetValueOrDefault("approved"),
            groupedCounts.GetValueOrDefault("rejected"),
            await scoped.CountAsync(row => !row.Published, ct),
            groupedCounts.Values.Sum());

        if (states.Length != 0)
            scoped = scoped.Where(row => states.Contains(row.ReviewState));
        var total = await scoped.CountAsync(ct);
        var page = Math.Clamp(request.Page, 1, 1_000_000);
        var perPage = Math.Clamp(request.PerPage, 1, 100);
        var ordered = ApplyOrdering(scoped, sort, direction);
        var rows = await ordered.Skip((page - 1) * perPage).Take(perPage).ToListAsync(ct);
        var items = rows.Select(row => new ReviewUnionItem(
            row.NativeSegmentId is int nativeId ? $"native:{nativeId}" : $"item:{row.ItemId}",
            row.ItemId,
            row.NativeSegmentId,
            row.VideoId,
            row.VideoTitle,
            row.TagId,
            row.TagName,
            row.StartSec,
            row.EndSec,
            row.Residence,
            row.ReviewState,
            row.Published,
            row.Revision,
            row.UpdatedAt)).ToArray();
        return (new ReviewUnionResult(items, total, page, perPage, counts), null);
    }

    private static IQueryable<Segment> EligibleNativeSegments(DbContext db) => db.Set<Segment>()
        .AsNoTracking()
        .Where(segment =>
            segment.HostType == SegmentHostType.Video
            && segment.Kind == "tag"
            && segment.TagId != null);

    private static IQueryable<SegmentStudioItem> EligibleOwnedItems(DbContext db) => db.Set<SegmentStudioItem>()
        .AsNoTracking()
        .Where(item =>
            item.NativeSegmentId == null
            && item.VideoId != null
            && item.TagId != null
            && item.StartSec != null
            && item.Kind == "tag"
            && item.ReviewState != null);

    private static IOrderedQueryable<ReviewUnionRow> ApplyOrdering(
        IQueryable<ReviewUnionRow> query,
        string sort,
        string direction)
    {
        if (sort == "time")
        {
            return direction == "desc"
                ? query.OrderByDescending(row => row.StartSec).ThenByDescending(row => row.UpdatedAt)
                    .ThenByDescending(row => row.NativeSegmentId).ThenByDescending(row => row.ItemId)
                : query.OrderBy(row => row.StartSec).ThenBy(row => row.UpdatedAt)
                    .ThenBy(row => row.NativeSegmentId).ThenBy(row => row.ItemId);
        }
        if (sort == "updated")
        {
            return direction == "desc"
                ? query.OrderByDescending(row => row.UpdatedAt).ThenByDescending(row => row.VideoId)
                    .ThenBy(row => row.StartSec).ThenByDescending(row => row.NativeSegmentId).ThenByDescending(row => row.ItemId)
                : query.OrderBy(row => row.UpdatedAt).ThenBy(row => row.VideoId)
                    .ThenBy(row => row.StartSec).ThenBy(row => row.NativeSegmentId).ThenBy(row => row.ItemId);
        }
        return direction == "desc"
            ? query.OrderByDescending(row => row.VideoId).ThenByDescending(row => row.StartSec)
                .ThenByDescending(row => row.NativeSegmentId).ThenByDescending(row => row.ItemId)
            : query.OrderBy(row => row.VideoId).ThenBy(row => row.StartSec)
                .ThenByDescending(row => row.Published).ThenBy(row => row.NativeSegmentId).ThenBy(row => row.ItemId);
    }

    private sealed class ReviewUnionRow
    {
        public long? ItemId { get; init; }
        public int? NativeSegmentId { get; init; }
        public int VideoId { get; init; }
        public string? VideoTitle { get; init; }
        public int TagId { get; init; }
        public string TagName { get; init; } = "";
        public double StartSec { get; init; }
        public double? EndSec { get; init; }
        public string Residence { get; init; } = "";
        public string ReviewState { get; init; } = "";
        public bool Published { get; init; }
        public long Revision { get; init; }
        public DateTime UpdatedAt { get; init; }
        public string? VideoSearchText { get; init; }
        public string? FileSearchText { get; init; }
    }
}
