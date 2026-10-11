using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

/// <summary>
/// Segment Studio's video list predicates. Cove's own video search owns text matching, core
/// filters, sorting and paging; these filters only add membership from Segment Studio's data, so
/// they work in Segment Studio's Videos tab and on Cove's Videos page alike.
/// </summary>
public static class SegmentStudioVideoFilters
{
    public const string EntityType = "videos";
    public const string HasSegments = "has-segments";
    public const string ReviewState = "review-state";
    public const string HasShotBoundaries = "has-shot-boundaries";
    public const string SegmentTags = "segment-tags";

    public static UIManifestBuilder AddTo(UIManifestBuilder builder) => builder
        .AddExtensionListFilter(EntityType, HasSegments, "Segment Studio: Has segments", "boolean", HasSegments,
            order: 60, modifiers: ["EQUALS"])
        .AddExtensionListFilter(EntityType, ReviewState, "Segment Studio: Review state (Full)", "enum", ReviewState,
            order: 62, modifiers: ["EQUALS"], options:
            [
                new UIListFilterOption("unreviewed", "Has unreviewed"),
                new UIListFilterOption("approved", "Has approved"),
                new UIListFilterOption("rejected", "Has rejected"),
            ])
        .AddExtensionListFilter(EntityType, HasShotBoundaries, "Segment Studio: Has shot boundaries (Full)", "boolean",
            HasShotBoundaries, order: 63, modifiers: ["EQUALS"]);

    /// <summary>
    /// The segment tag picker. Built as a record rather than through
    /// <c>UIManifestBuilder.AddExtensionEntityListFilter</c> so this package keeps compiling against
    /// Cove packages that predate that helper. The filter itself needs a host that executes multi-ID
    /// extension criteria: 1.5 rejects it as invalid, and 1.4 ignores every extension criterion on
    /// the video list, so the minimum Cove version must cover that support before release.
    /// </summary>
    public static UIListFilterContribution SegmentTagsFilter(string extensionId) => new(
        SegmentTags,
        EntityType,
        "Segment Studio: Segment tags",
        "multiid",
        extensionId,
        EntityReferenceType: "tags",
        Modifiers: ["INCLUDES", "INCLUDES_ALL", "EXCLUDES", "IS_NULL", "NOT_NULL"],
        Order: 61)
    {
        FilterId = SegmentTags,
    };

    /// <summary>The segment rows a user's workflow sees: native segments in Basic, plus owned review work in Full.</summary>
    internal static async Task<string> WorkflowForAsync(DbContext db, int? userId, CancellationToken ct)
    {
        if (userId is not int id)
            return SegmentStudioWorkflows.Basic;
        var profile = await SegmentStudioFeatureProfileService.GetAsync(db, id, ct);
        if (!profile.Has(SegmentStudioCapabilities.SegmentReview))
            return SegmentStudioWorkflows.Basic;
        return profile.LegacyCompatibilityRequired ? SegmentStudioWorkflows.Compatibility : SegmentStudioWorkflows.Full;
    }

    internal static IQueryable<SegmentStudioVideoSegmentRow> SegmentRows(DbContext db, string workflow)
    {
        if (workflow == SegmentStudioWorkflows.Basic)
        {
            return db.Set<Segment>().AsNoTracking()
                .Where(segment => segment.HostType == SegmentHostType.Video
                    && segment.Kind == "tag"
                    && segment.TagId != null)
                .Select(segment => new SegmentStudioVideoSegmentRow
                {
                    VideoId = segment.HostId,
                    TagId = segment.TagId!.Value,
                    ReviewState = "approved",
                });
        }
        if (workflow == SegmentStudioWorkflows.Full)
        {
            var native = db.Set<Segment>().AsNoTracking()
                .Where(segment => segment.HostType == SegmentHostType.Video && segment.Kind == "tag" && segment.TagId != null)
                .Select(segment => new SegmentStudioVideoSegmentRow
                {
                    VideoId = segment.HostId,
                    TagId = segment.TagId!.Value,
                    ReviewState = "approved",
                });
            var owned = db.Set<SegmentStudioItem>().AsNoTracking()
                .Where(item => item.NativeSegmentId == null && item.VideoId != null && item.TagId != null
                    && item.StartSec != null && item.Kind == "tag" && item.ReviewState != null)
                .Select(item => new SegmentStudioVideoSegmentRow
                {
                    VideoId = item.VideoId!.Value,
                    TagId = item.TagId!.Value,
                    ReviewState = item.ReviewState!,
                });
            return native.Concat(owned);
        }

        return db.Set<SegmentStudioReviewSegment>().AsNoTracking().Select(segment => new SegmentStudioVideoSegmentRow
        {
            VideoId = segment.VideoId,
            TagId = segment.TagId,
            ReviewState = segment.ReviewState,
        });
    }

    /// <summary>Per-video segment counts for one page of Cove's video search results.</summary>
    public static async Task<IReadOnlyList<SegmentStudioVideoSegmentCounts>> CountsAsync(
        DbContext db,
        string workflow,
        IReadOnlyCollection<int> videoIds,
        CancellationToken ct)
    {
        var requested = videoIds.Where(id => id > 0).Distinct().ToArray();
        if (requested.Length == 0)
            return [];
        // Cove's video query filters apply the caller's read scope; never describe other videos.
        var readable = (await db.Set<Video>().AsNoTracking()
            .Where(video => requested.Contains(video.Id))
            .Select(video => video.Id)
            .ToListAsync(ct)).ToHashSet();
        var ids = requested.Where(readable.Contains).ToArray();
        if (ids.Length == 0)
            return [];
        var counts = await SegmentRows(db, workflow)
            .Where(row => ids.Contains(row.VideoId))
            .GroupBy(row => row.VideoId)
            .Select(group => new SegmentStudioVideoSegmentCounts(
                group.Key,
                group.Count(),
                group.Count(row => row.ReviewState == "unreviewed"),
                group.Count(row => row.ReviewState == "approved"),
                group.Count(row => row.ReviewState == "rejected")))
            .ToDictionaryAsync(row => row.VideoId, ct);
        return ids
            .Select(id => counts.GetValueOrDefault(id) ?? new SegmentStudioVideoSegmentCounts(id, 0, 0, 0, 0))
            .ToArray();
    }

    /// <summary>
    /// The videos a criterion matches. A null result means "every video", so presence filters
    /// answer with the smaller of a set and its complement without listing the whole library.
    /// </summary>
    public static async Task<VideoMembership> MembershipAsync(
        DbContext db,
        string workflow,
        string filterId,
        string modifier,
        JsonElement value,
        CancellationToken ct)
    {
        var segments = SegmentRows(db, workflow);
        // Review states and shot boundaries are Full-only data: Basic users get no matches rather
        // than a hint about work their mode cannot read.
        if (workflow == SegmentStudioWorkflows.Basic && filterId is ReviewState or HasShotBoundaries)
            return VideoMembership.None;
        switch (filterId)
        {
            case HasSegments:
                return VideoMembership.Of(await VideosAsync(segments, ct), include: value.GetBoolean());
            case ReviewState:
                var state = value.GetString();
                if (state is not ("unreviewed" or "approved" or "rejected"))
                    return VideoMembership.None;
                return VideoMembership.Of(await VideosAsync(segments.Where(row => row.ReviewState == state), ct), include: true);
            case HasShotBoundaries:
                var boundaries = await db.Set<SegmentStudioShotBoundary>().AsNoTracking()
                    .Select(boundary => boundary.VideoId).Distinct().ToListAsync(ct);
                return VideoMembership.Of(boundaries.ToHashSet(), include: value.GetBoolean());
            case SegmentTags:
                return await SegmentTagMembershipAsync(db, segments, modifier, value, ct);
            default:
                return VideoMembership.None;
        }
    }

    private static async Task<VideoMembership> SegmentTagMembershipAsync(
        DbContext db,
        IQueryable<SegmentStudioVideoSegmentRow> segments,
        string modifier,
        JsonElement value,
        CancellationToken ct)
    {
        if (modifier is "isnull" or "notnull")
            return VideoMembership.Of(await VideosAsync(segments, ct), include: modifier == "notnull");

        var includedIds = ReadIds(value, "value");
        var excludedIds = ReadIds(value, "excludes");
        var includeDescendants = value.TryGetProperty("depth", out var depth) && depth.GetInt32() == -1;
        if (modifier == "excludes")
            (includedIds, excludedIds) = ([], includedIds);

        var groups = await ExpandTagGroupsAsync(db, includedIds, includeDescendants, ct);
        HashSet<int>? matches = null;
        if (modifier == "includesall")
        {
            foreach (var group in groups)
            {
                var videos = await VideosAsync(segments.Where(row => group.Contains(row.TagId)), ct);
                matches = matches is null ? videos : [.. matches.Where(videos.Contains)];
            }
        }
        else if (groups.Length > 0)
        {
            var anyTag = groups.SelectMany(group => group).Distinct().ToArray();
            matches = await VideosAsync(segments.Where(row => anyTag.Contains(row.TagId)), ct);
        }

        var excludedTags = (await ExpandTagGroupsAsync(db, excludedIds, includeDescendants, ct))
            .SelectMany(group => group).Distinct().ToArray();
        var excludedVideos = excludedTags.Length == 0
            ? []
            : await VideosAsync(segments.Where(row => excludedTags.Contains(row.TagId)), ct);
        return matches is null
            ? VideoMembership.Of(excludedVideos, include: false)
            : VideoMembership.Of(matches.Where(id => !excludedVideos.Contains(id)).ToHashSet(), include: true);
    }

    private static async Task<HashSet<int>> VideosAsync(IQueryable<SegmentStudioVideoSegmentRow> rows, CancellationToken ct) =>
        (await rows.Select(row => row.VideoId).Distinct().ToListAsync(ct)).ToHashSet();

    private static int[] ReadIds(JsonElement value, string property) =>
        value.TryGetProperty(property, out var ids) && ids.ValueKind == JsonValueKind.Array
            ? ids.EnumerateArray().Select(id => id.GetInt32()).Where(id => id > 0).Distinct().ToArray()
            : [];

    internal static async Task<int[][]> ExpandTagGroupsAsync(DbContext db, IReadOnlyList<int> ids, bool includeDescendants, CancellationToken ct)
    {
        if (!includeDescendants || ids.Count == 0) return ids.Select(id => new[] { id }).ToArray();
        var relations = await db.Set<TagParent>().AsNoTracking().Select(link => new { link.ParentId, link.ChildId }).ToListAsync(ct);
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
}

public static class SegmentStudioWorkflows
{
    public const string Basic = "basic";
    public const string Full = "full";
    public const string Compatibility = "compatibility";
}

public sealed record SegmentStudioVideoSegmentCounts(
    int VideoId,
    int SegmentCount,
    int UnreviewedCount,
    int ApprovedCount,
    int RejectedCount);

internal sealed class SegmentStudioVideoSegmentRow
{
    public int VideoId { get; init; }
    public int TagId { get; init; }
    public string ReviewState { get; init; } = "";
}

/// <summary>A set of videos, or every video except a set.</summary>
public sealed record VideoMembership(IReadOnlySet<int> Videos, bool Include)
{
    public static VideoMembership None { get; } = new(new HashSet<int>(), true);

    public static VideoMembership Of(IReadOnlySet<int> videos, bool include) => new(videos, include);

    public bool Contains(int videoId) => Videos.Contains(videoId) == Include;
}

/// <summary>
/// Resolves <see cref="SegmentStudioVideoFilters"/> against Cove's authorized candidates. Cove opens
/// one scope per criterion execution, so the membership is computed once and serves every batch
/// under one revision.
/// </summary>
public sealed class SegmentStudioVideoFilterProvider(
    DbContext db,
    ICurrentPrincipalAccessor principals,
    IAuthorizationService authorization) : IExtensionEntityFilterProvider
{
    private readonly string _revision = Guid.NewGuid().ToString("N");
    private readonly Dictionary<string, VideoMembership> _memberships = new(StringComparer.Ordinal);

    public IReadOnlyCollection<ExtensionEntityFilterDefinition> Filters { get; } =
    [
        new(SegmentStudioVideoFilters.HasSegments, SegmentStudioVideoFilters.EntityType),
        new(SegmentStudioVideoFilters.ReviewState, SegmentStudioVideoFilters.EntityType),
        new(SegmentStudioVideoFilters.HasShotBoundaries, SegmentStudioVideoFilters.EntityType),
        new(SegmentStudioVideoFilters.SegmentTags, SegmentStudioVideoFilters.EntityType),
    ];

    public async Task<ExtensionEntityFilterResult> ResolveAsync(ExtensionEntityFilterRequest request, CancellationToken ct)
    {
        var key = $"{request.Principal.UserId}|{request.FilterId}|{request.Modifier}|{request.Value.GetRawText()}";
        if (!_memberships.TryGetValue(key, out var membership))
        {
            membership = await LoadAsync(request, ct);
            _memberships[key] = membership;
        }
        return new ExtensionEntityFilterResult(
            request.CandidateIds.Where(membership.Contains).ToArray(),
            _revision);
    }

    private async Task<VideoMembership> LoadAsync(ExtensionEntityFilterRequest request, CancellationToken ct)
    {
        var access = await SegmentStudioAuthorization.AuthorizeReadAsync(principals.Current, authorization, videoId: null, ct);
        if (!access.Allowed)
            return VideoMembership.None;
        var workflow = await SegmentStudioVideoFilters.WorkflowForAsync(db, request.Principal.UserId, ct);
        return await SegmentStudioVideoFilters.MembershipAsync(db, workflow, request.FilterId, request.Modifier, request.Value, ct);
    }
}

public sealed record SegmentStudioSegmentCountsRequest(IReadOnlyList<int>? VideoIds);
