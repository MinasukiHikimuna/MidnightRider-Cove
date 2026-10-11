using System.Linq.Expressions;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record BrowseActivity(int TagId, string Name, int SegmentCount, bool HasSlots);
/// <summary>Performer slots that share a label, merged across tags; <see cref="Key"/> ignores case and spacing.</summary>
public sealed record BrowseSlotRole(string Key, string Label, int TagCount, IReadOnlyList<Guid> SlotDefinitionIds);
/// <summary>
/// Matches segments by the performers in one slot role (<see cref="Role"/> is a role key, or null or "*" for any slot).
/// <see cref="Performers"/> is evaluated per assigned slot, like Cove's Related Performers filter on videos;
/// <see cref="Unassigned"/> requires (true) or rules out (false) a slot of the role that nobody fills.
/// </summary>
public sealed record BrowseRoleFilter(string? Role, RelatedFilterCriterion<PerformerFilter>? Performers = null, bool? Unassigned = null);
/// <summary>The Segments list's filters; the request's top level and every leaf of its filter expression use this shape.</summary>
public sealed record BrowseCriteria(IReadOnlyList<int>? ActivityTagIds = null, bool IncludeActivitySubtags = false,
    IReadOnlyList<string>? ReviewStates = null, BrowseRoleFilter? SlottedPerformer = null);
public sealed record BrowseRequest(string? Query, IReadOnlyList<string>? ReviewStates = null,
    int Page = 1, int PerPage = 24, string? Sort = null, IReadOnlyList<int>? ActivityTagIds = null,
    bool IncludeActivitySubtags = false, string? Direction = null, BrowseRoleFilter? SlottedPerformer = null,
    FilterExpression<BrowseCriteria>? FilterExpression = null);
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

    public const string AnySlotRole = "*";
    private const int MaxRoleFilters = 16;

    /// <summary>Slot labels compare case-insensitively with surrounding and repeated whitespace ignored; unlabeled slots have no role.</summary>
    public static string? SlotRoleKey(string? label)
    {
        if (string.IsNullOrWhiteSpace(label)) return null;
        return string.Join(' ', label.Split((char[]?)null, StringSplitOptions.RemoveEmptyEntries)).ToLowerInvariant();
    }

    public static async Task<IReadOnlyList<BrowseSlotRole>> RolesAsync(DbContext db, CancellationToken ct)
    {
        var definitions = await LoadRoleDefinitionsAsync(db, ct);
        return definitions.Where(definition => definition.Key is not null)
            .GroupBy(definition => definition.Key!)
            .Select(group => new BrowseSlotRole(group.Key,
                group.GroupBy(definition => definition.Label!.Trim()).OrderByDescending(spelling => spelling.Count())
                    .ThenBy(spelling => spelling.Key, StringComparer.Ordinal).First().Key,
                group.Select(definition => definition.TagId).Distinct().Count(),
                group.Select(definition => definition.Id).Order().ToArray()))
            .OrderByDescending(role => role.TagCount).ThenBy(role => role.Label, StringComparer.OrdinalIgnoreCase)
            .ToArray();
    }

    private static async Task<IReadOnlyList<RoleDefinition>> LoadRoleDefinitionsAsync(DbContext db, CancellationToken ct)
    {
        var rows = await (from definition in db.Set<SegmentStudioSlotDefinition>().AsNoTracking()
                          join set in db.Set<SegmentStudioSlotDefinitionSet>().AsNoTracking() on definition.SlotDefinitionSetId equals set.Id
                          join tag in db.Set<Tag>().AsNoTracking() on set.TagId equals tag.Id
                          select new { definition.Id, definition.Label, set.TagId }).ToListAsync(ct);
        return rows.Select(row => new RoleDefinition(row.Id, row.Label, SlotRoleKey(row.Label), row.TagId)).ToArray();
    }

    private sealed record RoleDefinition(Guid Id, string? Label, string? Key, int TagId);

    /// <param name="findPerformerIds">Finds the ids of the performers matching a performer filter and search, for slotted performers' nested performer conditions.</param>
    public static async Task<(BrowseResult? Result, string? Error)> SearchAsync(DbContext db, BrowseRequest request, bool includePerformers, CancellationToken ct,
        Func<PerformerFilter?, FindFilter, CancellationToken, Task<IReadOnlyCollection<int>>>? findPerformerIds = null)
    {
        var page = Math.Clamp(request.Page, 1, 1_000_000); var perPage = Math.Clamp(request.PerPage, 1, 100);
        if (!string.IsNullOrWhiteSpace(request.Sort) && !request.Sort.Equals("default", StringComparison.OrdinalIgnoreCase))
            return (null, "Sort is invalid.");
        var context = new FilterContext(db, includePerformers, findPerformerIds);
        Expression<Func<BrowseRow, bool>>? criteriaPredicate, expressionPredicate;
        try
        {
            criteriaPredicate = await CriteriaPredicateAsync(context, new(request.ActivityTagIds, request.IncludeActivitySubtags,
                request.ReviewStates, request.SlottedPerformer), ct);
            expressionPredicate = request.FilterExpression is { } expression ? await ExpressionPredicateAsync(context, expression, 1, ct) : null;
        }
        catch (BrowseFilterException error)
        {
            return (null, error.Message);
        }
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
                VideoDate = video.Date,
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
                VideoDate = video.Date,
                VideoUpdatedAt = video.UpdatedAt,
                SegmentUpdatedAt = item.UpdatedAt,
                VideoSearchText = video.SearchText,
                FileSearchText = video.FileSearchText,
            };
        IQueryable<BrowseRow> query = native.Concat(owned);
        if (criteriaPredicate is not null) query = query.Where(criteriaPredicate);
        if (expressionPredicate is not null) query = query.Where(expressionPredicate);
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

    private const int MaxExpressionDepth = 8;
    private const int MaxExpressionConditions = 32;
    private const int MaxDistinctConditions = 8;
    private const string SlottedPerformerFilterKey = "slottedPerformerCriterion";

    private sealed class BrowseFilterException(string message) : Exception(message);

    private sealed class FilterContext(DbContext db, bool includePerformers,
        Func<PerformerFilter?, FindFilter, CancellationToken, Task<IReadOnlyCollection<int>>>? findPerformerIds)
    {
        public DbContext Db { get; } = db;
        public bool IncludePerformers { get; } = includePerformers;
        public Func<PerformerFilter?, FindFilter, CancellationToken, Task<IReadOnlyCollection<int>>>? FindPerformerIds { get; } = findPerformerIds;
        public IReadOnlyList<RoleDefinition>? RoleDefinitions { get; set; }
        public Dictionary<int, int[]>? TagChildren { get; set; }
        public int Conditions { get; set; }
        public int SlottedPerformers { get; set; }
        private readonly Dictionary<string, IReadOnlyCollection<int>> _performerIds = [];

        // Each lookup loads every matching performer, so identical conditions within one request share the answer.
        public async Task<IReadOnlyCollection<int>> FindPerformerIdsOnceAsync(PerformerFilter? filter, FindFilter find, CancellationToken ct)
        {
            var key = System.Text.Json.JsonSerializer.Serialize(new { filter, find.Q });
            if (!_performerIds.TryGetValue(key, out var ids)) _performerIds[key] = ids = await FindPerformerIds!(filter, find, ct);
            return ids;
        }
    }

    private static async Task<Expression<Func<BrowseRow, bool>>?> CriteriaPredicateAsync(FilterContext context, BrowseCriteria criteria, CancellationToken ct)
    {
        var parts = new List<Expression<Func<BrowseRow, bool>>>();
        var activityTagIds = (criteria.ActivityTagIds ?? []).Where(id => id > 0).Distinct().ToArray();
        if (criteria.IncludeActivitySubtags) activityTagIds = await ExpandTagIdsAsync(context, activityTagIds, ct);
        if (activityTagIds.Length != 0) parts.Add(row => activityTagIds.Contains(row.TagId));
        var states = (criteria.ReviewStates ?? []).Distinct(StringComparer.OrdinalIgnoreCase).Select(item => item.ToLowerInvariant()).ToArray();
        if (states.Any(state => state is not ("unreviewed" or "approved" or "rejected"))) throw new BrowseFilterException("Review state is invalid.");
        if (states.Length != 0) parts.Add(row => states.Contains(row.ReviewState));
        if (criteria.SlottedPerformer is { } role) parts.Add(RolePredicate(await RoleQueryAsync(context, role, ct)));
        return parts.Count == 0 ? null : Combine(parts, or: false);
    }

    // Evaluates the list's advanced filter like Cove's own lists: AND, OR, NOT and "just one" groups over partial filters.
    // An AND group scoped to slotted performers with distinct matches needs each of its conditions met by a different slot.
    private static async Task<Expression<Func<BrowseRow, bool>>> ExpressionPredicateAsync(FilterContext context,
        FilterExpression<BrowseCriteria> expression, int depth, CancellationToken ct)
    {
        if (depth > MaxExpressionDepth) throw new BrowseFilterException($"Filter groups can be nested at most {MaxExpressionDepth} deep.");
        if (expression.Children.Count == 0) throw new BrowseFilterException("A filter group needs a condition.");
        if (expression.Operator == FilterExpressionOperator.Not && expression.Children.Count != 1)
            throw new BrowseFilterException("A NOT filter group needs exactly one condition.");
        var distinct = expression.Operator == FilterExpressionOperator.And
            && (expression.RelatedScope is { MatchMode: RelatedScopeMatchMode.Distinct } scope
                    && string.Equals(scope.FilterKey, SlottedPerformerFilterKey, StringComparison.OrdinalIgnoreCase)
                || expression.RelatedScope is null && expression.DistinctRelatedMatches);
        var predicates = new List<Expression<Func<BrowseRow, bool>>>();
        var distinctRoles = new List<RoleQuery>();
        foreach (var child in expression.Children)
        {
            if ((child.Filter is null) == (child.Group is null)) throw new BrowseFilterException("A filter condition is invalid.");
            if (child.Group is { } group)
            {
                predicates.Add(await ExpressionPredicateAsync(context, group, depth + 1, ct));
                continue;
            }
            if (++context.Conditions > MaxExpressionConditions)
                throw new BrowseFilterException($"At most {MaxExpressionConditions} filter conditions are supported.");
            var leaf = child.Filter!;
            if (distinct && leaf.SlottedPerformer is { } role && (leaf.ActivityTagIds ?? []).Count == 0 && (leaf.ReviewStates ?? []).Count == 0)
            {
                var roleQuery = await RoleQueryAsync(context, role, ct);
                if (roleQuery.DistinctEligible)
                {
                    distinctRoles.Add(roleQuery);
                    continue;
                }
                predicates.Add(RolePredicate(roleQuery));
                continue;
            }
            predicates.Add(await CriteriaPredicateAsync(context, leaf, ct) ?? (row => true));
        }
        if (distinctRoles.Count > MaxDistinctConditions)
            throw new BrowseFilterException($"At most {MaxDistinctConditions} slotted performers can each require a different slot.");
        if (distinctRoles.Count == 1) predicates.Add(RolePredicate(distinctRoles[0]));
        else if (distinctRoles.Count > 1) predicates.Add(DistinctSlotsPredicate(distinctRoles));
        return expression.Operator switch
        {
            FilterExpressionOperator.Or => Combine(predicates, or: true),
            FilterExpressionOperator.Not => Not(predicates[0]),
            FilterExpressionOperator.JustOne => ExactlyOne(predicates),
            _ => Combine(predicates, or: false),
        };
    }

    private static Expression<Func<BrowseRow, bool>> ExactlyOne(IReadOnlyList<Expression<Func<BrowseRow, bool>>> predicates)
    {
        var row = Expression.Parameter(typeof(BrowseRow), "row");
        var count = predicates.Select(predicate => (Expression)Expression.Condition(Replace(predicate.Body, (predicate.Parameters[0], row)),
                Expression.Constant(1), Expression.Constant(0)))
            .Aggregate(Expression.Add);
        return Expression.Lambda<Func<BrowseRow, bool>>(Expression.Equal(count, Expression.Constant(1)), row);
    }

    // row => C0.Any(c0 => same item && m0 && C1.Any(c1 => same item && m1 && c1.Slot != c0.Slot && ...))
    private static Expression<Func<BrowseRow, bool>> DistinctSlotsPredicate(IReadOnlyList<RoleQuery> roles)
    {
        var row = Expression.Parameter(typeof(BrowseRow), "row");
        var candidates = roles.Select((_, index) => Expression.Parameter(typeof(RoleSlotCandidate), $"slot{index}")).ToArray();
        Expression Build(int index)
        {
            var candidate = candidates[index];
            var itemId = Expression.Property(row, nameof(BrowseRow.ItemId));
            Expression body = Expression.AndAlso(Expression.NotEqual(itemId, Expression.Constant(null, typeof(long?))),
                Expression.Equal(Expression.Convert(Expression.Property(candidate, nameof(RoleSlotCandidate.ItemId)), typeof(long?)), itemId));
            if (roles[index].Match is { } match)
                body = Expression.AndAlso(body, Replace(match.Body, (match.Parameters[0], candidate), (match.Parameters[1], row)));
            for (var previous = 0; previous < index; previous++)
                body = Expression.AndAlso(body, Expression.NotEqual(Expression.Property(candidate, nameof(RoleSlotCandidate.SlotDefinitionId)),
                    Expression.Property(candidates[previous], nameof(RoleSlotCandidate.SlotDefinitionId))));
            if (index + 1 < roles.Count) body = Expression.AndAlso(body, Build(index + 1));
            return Expression.Call(typeof(Queryable), nameof(Queryable.Any), [typeof(RoleSlotCandidate)], roles[index].Candidates.Expression,
                Expression.Quote(Expression.Lambda<Func<RoleSlotCandidate, bool>>(body, candidate)));
        }
        return Expression.Lambda<Func<BrowseRow, bool>>(Build(0), row);
    }

    private static bool HasPerformerConditions(RelatedFilterCriterion<PerformerFilter> criterion)
        => !string.IsNullOrWhiteSpace(criterion.FindFilter?.Q)
            || criterion.ObjectFilter is not null && typeof(PerformerFilter).GetProperties().Any(property => HasFilterValue(property.GetValue(criterion.ObjectFilter)));

    private static bool HasFilterValue(object? value) => value switch
    {
        null => false,
        string text => !string.IsNullOrWhiteSpace(text),
        System.Collections.IEnumerable sequence => sequence.Cast<object>().Any(),
        _ => true,
    };

    private static bool HasMultiIdCondition(MultiIdCriterion? criterion)
        => criterion is not null && (criterion.Modifier is CriterionModifier.IsNull or CriterionModifier.NotNull
            || criterion.Value.Any(id => id > 0) || criterion.Excludes?.Any(id => id > 0) == true || criterion.RequiredIds?.Any(id => id > 0) == true);

    // Resolves nested performer conditions like Cove's Related Performers filter: "match any" unions the text search
    // and each condition on its own; otherwise one search applies them all.
    private static async Task<IReadOnlyCollection<int>> MatchPerformersAsync(RelatedFilterCriterion<PerformerFilter> criterion,
        Func<PerformerFilter?, FindFilter, CancellationToken, Task<IReadOnlyCollection<int>>> findPerformerIds, CancellationToken ct)
    {
        FindFilter Find(string? q) => new() { Q = string.IsNullOrWhiteSpace(q) ? null : q, Page = 1, PerPage = int.MaxValue };
        if (criterion.ConditionOperator != RelatedFilterConditionOperator.Or)
            return await findPerformerIds(criterion.ObjectFilter, Find(criterion.FindFilter?.Q), ct);
        var ids = new HashSet<int>();
        if (!string.IsNullOrWhiteSpace(criterion.FindFilter?.Q)) ids.UnionWith(await findPerformerIds(null, Find(criterion.FindFilter.Q), ct));
        if (criterion.ObjectFilter is not { } filter) return ids;
        foreach (var property in typeof(PerformerFilter).GetProperties())
        {
            var value = property.GetValue(filter);
            if (!HasFilterValue(value)) continue;
            if (property.Name == nameof(PerformerFilter.CustomFieldCriteria))
            {
                foreach (var customField in filter.CustomFieldCriteria)
                    ids.UnionWith(await findPerformerIds(new() { CustomFieldCriteria = [customField] }, Find(null), ct));
                continue;
            }
            if (property.Name == nameof(PerformerFilter.RemoteIdCriterion) && HasFilterValue(filter.RemoteIdValueCriterion)) continue;
            var branch = new PerformerFilter();
            property.SetValue(branch, value);
            if (property.Name == nameof(PerformerFilter.RemoteIdValueCriterion)) branch.RemoteIdCriterion = filter.RemoteIdCriterion;
            ids.UnionWith(await findPerformerIds(branch, Find(null), ct));
        }
        return ids;
    }

    /// <summary>One slotted-performer condition prepared for a query: the role's assigned slots, the per-slot match, and role-wide parts.</summary>
    private sealed record RoleQuery(DbContext Db, Guid[] DefinitionIds, BrowseRoleFilter Role, IQueryable<RoleSlotCandidate> Candidates,
        Expression<Func<RoleSlotCandidate, BrowseRow, bool>>? Match, IReadOnlyList<Expression<Func<BrowseRow, bool>>> RoleParts)
    {
        public RelatedFilterCriterion<PerformerFilter>? Criterion => Role.Performers;
        public bool LegacyNone => Criterion is { Exclude: true, Mode: RelatedFilterMode.AtLeastOne };
        public bool Or => Criterion?.ConditionOperator == RelatedFilterConditionOperator.Or;
        // A condition that one assigned slot satisfies on its own, so a distinct group can give it its own slot.
        public bool DistinctEligible => RoleParts.Count == 0 && Criterion is { Mode: RelatedFilterMode.AtLeastOne, Exclude: false };
    }

    private static async Task<RoleQuery> RoleQueryAsync(FilterContext context, BrowseRoleFilter role, CancellationToken ct)
    {
        if (++context.SlottedPerformers > MaxRoleFilters) throw new BrowseFilterException($"At most {MaxRoleFilters} slotted performer filters are supported.");
        if (!context.IncludePerformers) throw new BrowseFilterException("Slotted performer filters require unrestricted performer read access.");
        if (role.Performers is null && role.Unassigned is null) throw new BrowseFilterException("A slotted performer filter needs a condition.");
        var db = context.Db;
        context.RoleDefinitions ??= await LoadRoleDefinitionsAsync(db, ct);
        var anySlot = role.Role is null or AnySlotRole;
        var key = anySlot ? null : SlotRoleKey(role.Role);
        var definitionIds = context.RoleDefinitions.Where(definition => anySlot || (key is not null && definition.Key == key)).Select(definition => definition.Id).ToArray();
        var criterion = role.Performers;
        IReadOnlyCollection<int>? matchedPerformerIds = null;
        if (criterion is not null && HasPerformerConditions(criterion))
        {
            if (context.FindPerformerIds is null) throw new BrowseFilterException("Performer conditions are unavailable.");
            matchedPerformerIds = await MatchPerformersAsync(criterion, context.FindPerformerIdsOnceAsync, ct);
        }
        var occurrenceGroups = criterion?.PerformerOccurrenceTagsCriterion is { } occurrence && HasMultiIdCondition(occurrence)
            ? await OccurrenceTagGroupsAsync(context, occurrence, ct) : null;

        var roleSlots = db.Set<SegmentStudioSegmentSlot>().Where(slot => definitionIds.Contains(slot.SlotDefinitionId));
        var candidates = from slot in roleSlots
                         join performer in db.Set<Performer>() on slot.PerformerId equals performer.Id
                         select new RoleSlotCandidate { ItemId = slot.ItemId, SlotDefinitionId = slot.SlotDefinitionId, PerformerId = slot.PerformerId, Birthdate = performer.Birthdate };
        var parts = new List<Expression<Func<BrowseRow, bool>>>();
        if (role.Unassigned is bool unassigned)
        {
            var roleDefinitions = db.Set<SegmentStudioSlotDefinition>().Where(definition => definitionIds.Contains(definition.Id));
            Expression<Func<BrowseRow, bool>> hasOpenSlot = row => roleDefinitions.Any(definition => definition.SlotDefinitionSet.TagId == row.TagId
                && !db.Set<SegmentStudioSegmentSlot>().Any(slot => row.ItemId != null && slot.ItemId == row.ItemId && slot.SlotDefinitionId == definition.Id));
            parts.Add(unassigned ? hasOpenSlot : Combine(
                [row => roleDefinitions.Any(definition => definition.SlotDefinitionSet.TagId == row.TagId), Not(hasOpenSlot)], or: false));
        }
        return new(db, definitionIds, role, candidates, criterion is null ? null : RoleSlotMatch(db, criterion, matchedPerformerIds, occurrenceGroups), parts);
    }

    // Mirrors Cove's Related Performers semantics over the assigned slots of one role. Per-slot conditions (performer
    // conditions, specific performers, age then, occurrence tags) honor the mode: "at least one" needs a matching
    // assignment, "every" and "none" need at least one assignment (the legacy exclude flag does not). With no per-slot
    // condition, "none" means nobody is assigned to the role. The unassigned check describes the whole role and combines
    // with the per-slot part by the condition operator.
    private static Expression<Func<BrowseRow, bool>> RolePredicate(RoleQuery role)
    {
        var parts = role.RoleParts.ToList();
        if (role.Criterion is { } criterion)
        {
            var mode = role.LegacyNone ? RelatedFilterMode.None : criterion.Mode;
            parts.Add(mode switch
            {
                RelatedFilterMode.Every => Combine([AnyCandidate(role.Candidates, null, false), Not(AnyCandidate(role.Candidates, role.Match, true))], or: false),
                RelatedFilterMode.None when role.Match is null => Not(AnyCandidate(role.Candidates, null, false)),
                RelatedFilterMode.None when role.LegacyNone => Not(AnyCandidate(role.Candidates, role.Match, false)),
                RelatedFilterMode.None => Combine([AnyCandidate(role.Candidates, null, false), Not(AnyCandidate(role.Candidates, role.Match, false))], or: false),
                _ => AnyCandidate(role.Candidates, role.Match, false),
            });
        }
        return Combine(parts, role.Or);
    }

    private static Expression<Func<RoleSlotCandidate, BrowseRow, bool>>? RoleSlotMatch(DbContext db, RelatedFilterCriterion<PerformerFilter> criterion,
        IReadOnlyCollection<int>? matchedPerformerIds, OccurrenceTagGroups? occurrenceGroups)
    {
        var conditions = new List<Expression<Func<RoleSlotCandidate, BrowseRow, bool>>>();
        if (matchedPerformerIds is not null)
        {
            var ids = matchedPerformerIds.ToArray();
            conditions.Add((candidate, _) => ids.Contains(candidate.PerformerId));
        }
        // As in Cove, the listed performers are a condition on one assigned performer, so "includes all" of several never matches.
        if (criterion.PerformerIdsCriterion is { } specific
            && (specific.Value.Count != 0 || (specific.Excludes?.Count ?? 0) != 0))
        {
            var included = specific.Value.ToArray();
            var excluded = (specific.Excludes ?? []).ToArray();
            conditions.Add(specific.Modifier == CriterionModifier.IncludesAll && included.Distinct().Count() > 1
                ? (_, _) => false
                : specific.Modifier == CriterionModifier.Excludes
                ? (candidate, _) => !included.Contains(candidate.PerformerId) && !excluded.Contains(candidate.PerformerId)
                : (candidate, _) => (included.Length == 0 || included.Contains(candidate.PerformerId)) && !excluded.Contains(candidate.PerformerId));
        }
        if (criterion.AgeAtHostDateCriterion is { } age) conditions.Add(AgeAtVideoDate(age));
        if (occurrenceGroups is not null) conditions.Add(OccurrenceTags(db, occurrenceGroups));
        if (conditions.Count == 0) return null;
        var candidateParameter = Expression.Parameter(typeof(RoleSlotCandidate), "candidate");
        var rowParameter = Expression.Parameter(typeof(BrowseRow), "row");
        var bodies = conditions.Select(condition => Replace(condition.Body,
            (condition.Parameters[0], candidateParameter), (condition.Parameters[1], rowParameter)));
        var body = bodies.Aggregate((left, right) => criterion.ConditionOperator == RelatedFilterConditionOperator.Or
            ? Expression.OrElse(left, right) : Expression.AndAlso(left, right));
        return Expression.Lambda<Func<RoleSlotCandidate, BrowseRow, bool>>(body, candidateParameter, rowParameter);
    }

    /// <summary>Occurrence tag ids with sub-tags expanded: each value or required id becomes a group any of whose tags counts.</summary>
    private sealed record OccurrenceTagGroups(CriterionModifier Modifier, int[][] Values, int[] Excluded, int[][] Required);

    private static async Task<OccurrenceTagGroups> OccurrenceTagGroupsAsync(FilterContext context, MultiIdCriterion criterion, CancellationToken ct)
    {
        async Task<int[]> Group(int tagId, bool expand) => expand ? await ExpandTagIdsAsync(context, [tagId], ct) : [tagId];
        var values = new List<int[]>();
        foreach (var tagId in criterion.Value.Where(id => id > 0).Distinct()) values.Add(await Group(tagId, criterion.Depth == -1));
        var required = new List<int[]>();
        foreach (var tagId in (criterion.RequiredIds ?? []).Where(id => id > 0).Distinct()) required.Add(await Group(tagId, criterion.RequiredIdsDepth == -1));
        var excluded = (criterion.Excludes ?? []).Where(id => id > 0).Distinct().ToArray();
        if (criterion.Depth == -1 && excluded.Length != 0) excluded = await ExpandTagIdsAsync(context, excluded, ct);
        return new(criterion.Modifier, [.. values], excluded, [.. required]);
    }

    // The tags on the slot performer's occurrence in the segment's video, matched like Cove's "Occurrence Tags".
    private static Expression<Func<RoleSlotCandidate, BrowseRow, bool>> OccurrenceTags(DbContext db, OccurrenceTagGroups groups)
    {
        var applications = db.Set<TagApplication>().Where(application => application.HostType == AffinityHostType.Video
            && application.ContextType == "performer" && application.ContextId != null);
        Expression<Func<RoleSlotCandidate, BrowseRow, bool>> Has(int[] tagIds) => (candidate, row) => applications.Any(application =>
            application.HostId == row.VideoId && application.ContextId == candidate.PerformerId && tagIds.Contains(application.TagId));
        var conditions = new List<Expression<Func<RoleSlotCandidate, BrowseRow, bool>>>();
        var allValues = groups.Values.SelectMany(group => group).Distinct().ToArray();
        switch (groups.Modifier)
        {
            case CriterionModifier.IsNull:
                conditions.Add((candidate, row) => !applications.Any(application => application.HostId == row.VideoId && application.ContextId == candidate.PerformerId));
                break;
            case CriterionModifier.NotNull:
                conditions.Add((candidate, row) => applications.Any(application => application.HostId == row.VideoId && application.ContextId == candidate.PerformerId));
                break;
            case CriterionModifier.IncludesAll:
                conditions.AddRange(groups.Values.Select(Has));
                break;
            case CriterionModifier.Excludes when allValues.Length != 0:
                conditions.Add(NotMatch(Has(allValues)));
                break;
            case CriterionModifier.ExcludesAll when groups.Values.Length != 0:
                conditions.Add(NotMatch(AllOf(groups.Values.Select(Has).ToArray())));
                break;
            default:
                if (allValues.Length != 0) conditions.Add(Has(allValues));
                break;
        }
        if (groups.Excluded.Length != 0) conditions.Add(NotMatch(Has(groups.Excluded)));
        conditions.AddRange(groups.Required.Select(Has));
        return conditions.Count == 0 ? (_, _) => true : AllOf([.. conditions]);
    }

    private static Expression<Func<RoleSlotCandidate, BrowseRow, bool>> AllOf(Expression<Func<RoleSlotCandidate, BrowseRow, bool>>[] conditions)
    {
        var candidate = Expression.Parameter(typeof(RoleSlotCandidate), "candidate");
        var row = Expression.Parameter(typeof(BrowseRow), "row");
        var body = conditions.Select(condition => Replace(condition.Body, (condition.Parameters[0], candidate), (condition.Parameters[1], row)))
            .Aggregate(Expression.AndAlso);
        return Expression.Lambda<Func<RoleSlotCandidate, BrowseRow, bool>>(body, candidate, row);
    }

    private static Expression<Func<RoleSlotCandidate, BrowseRow, bool>> NotMatch(Expression<Func<RoleSlotCandidate, BrowseRow, bool>> condition)
        => Expression.Lambda<Func<RoleSlotCandidate, BrowseRow, bool>>(Expression.Not(condition.Body), condition.Parameters);

    private static Expression<Func<BrowseRow, bool>> Combine(IReadOnlyList<Expression<Func<BrowseRow, bool>>> predicates, bool or)
    {
        var row = Expression.Parameter(typeof(BrowseRow), "row");
        var body = predicates.Select(predicate => Replace(predicate.Body, (predicate.Parameters[0], row)))
            .Aggregate((left, right) => or ? Expression.OrElse(left, right) : Expression.AndAlso(left, right));
        return Expression.Lambda<Func<BrowseRow, bool>>(body, row);
    }

    // Age in whole years on the video's date, matching Cove's "Age (then)" performer condition.
    private static Expression<Func<RoleSlotCandidate, BrowseRow, bool>> AgeAtVideoDate(IntCriterion criterion)
    {
        var value = criterion.Value;
        var value2 = criterion.Value2 ?? value;
        var (low, high, negate) = criterion.Modifier switch
        {
            CriterionModifier.Equals => (value, value, false),
            CriterionModifier.NotEquals => (value, value, true),
            CriterionModifier.GreaterThan => (value + 1, int.MaxValue, false),
            CriterionModifier.LessThan => (int.MinValue, value - 1, false),
            CriterionModifier.Between => (value, value2, false),
            CriterionModifier.NotBetween => (value, value2, true),
            _ => (0, 0, false),
        };
        return criterion.Modifier switch
        {
            CriterionModifier.IsNull => (candidate, row) => row.VideoDate == null || candidate.Birthdate == null,
            CriterionModifier.NotNull => (candidate, row) => row.VideoDate != null && candidate.Birthdate != null,
            CriterionModifier.Equals or CriterionModifier.NotEquals or CriterionModifier.GreaterThan or CriterionModifier.LessThan
                or CriterionModifier.Between or CriterionModifier.NotBetween => (candidate, row) => row.VideoDate != null && candidate.Birthdate != null
                && negate != (row.VideoDate.Value.Year - candidate.Birthdate.Value.Year
                    - ((row.VideoDate.Value.Month < candidate.Birthdate.Value.Month || (row.VideoDate.Value.Month == candidate.Birthdate.Value.Month && row.VideoDate.Value.Day < candidate.Birthdate.Value.Day)) ? 1 : 0) >= low
                    && row.VideoDate.Value.Year - candidate.Birthdate.Value.Year
                    - ((row.VideoDate.Value.Month < candidate.Birthdate.Value.Month || (row.VideoDate.Value.Month == candidate.Birthdate.Value.Month && row.VideoDate.Value.Day < candidate.Birthdate.Value.Day)) ? 1 : 0) <= high),
            _ => (_, _) => false,
        };
    }

    // row => candidates.Any(candidate => candidate.ItemId == row.ItemId [&& (!)match(candidate, row)])
    private static Expression<Func<BrowseRow, bool>> AnyCandidate(IQueryable<RoleSlotCandidate> candidates,
        Expression<Func<RoleSlotCandidate, BrowseRow, bool>>? match, bool negateMatch)
    {
        var row = Expression.Parameter(typeof(BrowseRow), "row");
        var candidate = Expression.Parameter(typeof(RoleSlotCandidate), "candidate");
        var itemId = Expression.Property(row, nameof(BrowseRow.ItemId));
        Expression body = Expression.AndAlso(Expression.NotEqual(itemId, Expression.Constant(null, typeof(long?))),
            Expression.Equal(Expression.Convert(Expression.Property(candidate, nameof(RoleSlotCandidate.ItemId)), typeof(long?)), itemId));
        if (match is not null)
        {
            var matched = Replace(match.Body, (match.Parameters[0], candidate), (match.Parameters[1], row));
            body = Expression.AndAlso(body, negateMatch ? Expression.Not(matched) : matched);
        }
        else if (negateMatch) body = Expression.Constant(false);
        var any = Expression.Call(typeof(Queryable), nameof(Queryable.Any), [typeof(RoleSlotCandidate)], candidates.Expression,
            Expression.Quote(Expression.Lambda<Func<RoleSlotCandidate, bool>>(body, candidate)));
        return Expression.Lambda<Func<BrowseRow, bool>>(any, row);
    }

    private static Expression<Func<BrowseRow, bool>> Not(Expression<Func<BrowseRow, bool>> predicate)
        => Expression.Lambda<Func<BrowseRow, bool>>(Expression.Not(predicate.Body), predicate.Parameters);

    private static Expression Replace(Expression body, params (ParameterExpression From, Expression To)[] replacements)
        => new ParameterReplacer(replacements.ToDictionary(item => item.From, item => item.To)).Visit(body);

    private sealed class ParameterReplacer(Dictionary<ParameterExpression, Expression> replacements) : ExpressionVisitor
    {
        protected override Expression VisitParameter(ParameterExpression node)
            => replacements.TryGetValue(node, out var replacement) ? replacement : base.VisitParameter(node);
    }

    private sealed class RoleSlotCandidate
    {
        public long ItemId { get; init; }
        public Guid SlotDefinitionId { get; init; }
        public int PerformerId { get; init; }
        public DateOnly? Birthdate { get; init; }
    }

    private static async Task<int[]> ExpandTagIdsAsync(FilterContext context, IReadOnlyList<int> ids, CancellationToken ct)
    {
        if (ids.Count == 0) return [];
        context.TagChildren ??= (await context.Db.Set<TagParent>().AsNoTracking().Select(link => new { link.ParentId, link.ChildId }).ToListAsync(ct))
            .GroupBy(link => link.ParentId).ToDictionary(group => group.Key, group => group.Select(link => link.ChildId).ToArray());
        var expanded = new HashSet<int>(ids);
        var pending = new Queue<int>(ids);
        while (pending.TryDequeue(out var parentId))
            if (context.TagChildren.TryGetValue(parentId, out var childIds))
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
        public DateOnly? VideoDate { get; init; }
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
