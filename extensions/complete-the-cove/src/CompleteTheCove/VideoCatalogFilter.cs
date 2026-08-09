using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;

namespace CompleteTheCove;

internal static class VideoCatalogFilter
{
    public static IQueryable<CompletionVideo> Apply(
        HttpRequest request,
        IQueryable<CompletionVideo> query,
        IReadOnlyDictionary<int, IReadOnlyCollection<int>>? coveTagDescendants = null,
        IReadOnlyDictionary<int, IReadOnlyCollection<int>>? coveStudioDescendants = null)
    {
        query = ApplyFacet(
            query,
            ParseValues(request.Query["performer"], allowCoveIds: true),
            ParseValues(request.Query["excludePerformer"], allowCoveIds: true),
            ParseMode(request.Query["performerMode"]),
            video => video.Performers.Any(performer => performer.CovePerformerId != null),
            value => value.CoveId is int coveId
                ? video => video.Performers.Any(performer => performer.CovePerformerId == coveId)
                : video => video.RemoteEndpoint == value.Endpoint
                    && video.Performers.Any(performer => performer.RemoteId == value.RemoteId));
        query = ApplyFacet(
            query,
            ParseValues(request.Query["tag"], allowCoveIds: true),
            ParseValues(request.Query["excludeTag"], allowCoveIds: true),
            ParseMode(request.Query["tagMode"]),
            video => video.Tags.Any(tag => tag.CoveTagId != null),
            value => TagMatch(value, coveTagDescendants));

        var includeSubstudios = bool.TryParse(
            request.Query["includeSubstudios"],
            out var parsedIncludeSubstudios) && parsedIncludeSubstudios;
        var studioIncludes = ParseValues(request.Query["studio"], allowCoveIds: true);
        var studioExcludes = ParseValues(request.Query["excludeStudio"], allowCoveIds: true);
        var studioMode = ParseMode(request.Query["studioMode"]);
        var studioValues = studioIncludes.Concat(studioExcludes).ToArray();
        var legacyStudioPresence = studioMode is FacetMode.Null or FacetMode.NotNull
            && studioValues.Any(value => value.CoveId is null)
            && studioValues.All(value => value.CoveId is null);
        query = ApplyFacet(
            query,
            studioIncludes,
            studioExcludes,
            studioMode,
            legacyStudioPresence
                ? video => video.StudioRemoteId != null
                : video => video.CoveStudioId != null,
            value => value.CoveId is int coveId
                ? StudioMatch(coveId, coveStudioDescendants)
                : includeSubstudios
                    ? video => video.RemoteEndpoint == value.Endpoint
                        && (video.StudioRemoteId == value.RemoteId
                            || video.ParentStudioRemoteId == value.RemoteId)
                    : video => video.RemoteEndpoint == value.Endpoint
                        && video.StudioRemoteId == value.RemoteId);
        return query;
    }

    private static IQueryable<CompletionVideo> ApplyFacet(
        IQueryable<CompletionVideo> query,
        IReadOnlyList<FacetValue> includes,
        IReadOnlyList<FacetValue> excludes,
        FacetMode mode,
        Expression<Func<CompletionVideo, bool>> hasValue,
        Func<FacetValue, Expression<Func<CompletionVideo, bool>>> matches)
    {
        query = mode switch
        {
            FacetMode.Null => query.Where(Not(hasValue)),
            FacetMode.NotNull => query.Where(hasValue),
            FacetMode.All => includes.Aggregate(
                query,
                (current, value) => current.Where(matches(value))),
            _ when includes.Count > 0 => query.Where(Or(includes.Select(matches))),
            _ => query,
        };
        return excludes.Aggregate(
            query,
            (current, value) => current.Where(Not(matches(value))));
    }

    private static IReadOnlyList<FacetValue> ParseValues(IEnumerable<string?> values, bool allowCoveIds) =>
        values
            .Select(value => ParseValue(value, allowCoveIds))
            .Where(value => value is not null)
            .Select(value => value!)
            .Distinct()
            .ToList();

    private static FacetValue? ParseValue(string? value, bool allowCoveIds)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        if (allowCoveIds && int.TryParse(value, out var coveId) && coveId > 0)
            return new(null, null, coveId);
        var separator = value.IndexOf('|');
        if (separator <= 0 || separator == value.Length - 1) return null;
        return new(
            CompletionCatalog.NormalizeEndpoint(value[..separator]),
            value[(separator + 1)..],
            null);
    }

    private static FacetMode ParseMode(string? value) =>
        value?.ToString().ToLowerInvariant() switch
        {
            "all" => FacetMode.All,
            "null" => FacetMode.Null,
            "not-null" => FacetMode.NotNull,
            _ => FacetMode.Any,
        };

    private static Expression<Func<CompletionVideo, bool>> Or(
        IEnumerable<Expression<Func<CompletionVideo, bool>>> predicates)
    {
        var parameter = Expression.Parameter(typeof(CompletionVideo), "video");
        var body = predicates
            .Select(predicate => new ParameterReplacer(predicate.Parameters[0], parameter)
                .Visit(predicate.Body)!)
            .Aggregate(Expression.OrElse);
        return Expression.Lambda<Func<CompletionVideo, bool>>(body, parameter);
    }

    private static Expression<Func<CompletionVideo, bool>> Not(
        Expression<Func<CompletionVideo, bool>> predicate) =>
        Expression.Lambda<Func<CompletionVideo, bool>>(
            Expression.Not(predicate.Body),
            predicate.Parameters);

    private static Expression<Func<CompletionVideo, bool>> TagMatch(
        FacetValue value,
        IReadOnlyDictionary<int, IReadOnlyCollection<int>>? coveTagDescendants)
    {
        if (value.CoveId is int coveId)
        {
            var ids = coveTagDescendants != null && coveTagDescendants.TryGetValue(coveId, out var descendants)
                ? descendants
                : [coveId];
            return video => video.Tags.Any(tag => tag.CoveTagId != null && ids.Contains(tag.CoveTagId.Value));
        }
        return video => video.RemoteEndpoint == value.Endpoint
            && video.Tags.Any(tag => tag.RemoteId == value.RemoteId);
    }

    private static Expression<Func<CompletionVideo, bool>> StudioMatch(
        int coveId,
        IReadOnlyDictionary<int, IReadOnlyCollection<int>>? coveStudioDescendants)
    {
        var ids = coveStudioDescendants != null && coveStudioDescendants.TryGetValue(coveId, out var descendants)
            ? descendants
            : [coveId];
        return video => video.CoveStudioId != null && ids.Contains(video.CoveStudioId.Value);
    }

    private sealed class ParameterReplacer(
        ParameterExpression source,
        ParameterExpression target) : ExpressionVisitor
    {
        protected override Expression VisitParameter(ParameterExpression node) =>
            node == source ? target : base.VisitParameter(node);
    }

    private sealed record FacetValue(string? Endpoint, string? RemoteId, int? CoveId);
    private enum FacetMode { Any, All, Null, NotNull }
}
