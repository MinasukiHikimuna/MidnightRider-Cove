using System.Linq.Expressions;
using Microsoft.AspNetCore.Http;

namespace CompleteTheCove;

internal static class SceneCatalogFilter
{
    public static IQueryable<CompletionScene> Apply(
        HttpRequest request,
        IQueryable<CompletionScene> query)
    {
        query = ApplyFacet(
            query,
            ParseValues(request.Query["performer"]),
            ParseValues(request.Query["excludePerformer"]),
            ParseMode(request.Query["performerMode"]),
            scene => scene.Performers.Any(),
            value => scene => scene.RemoteEndpoint == value.Endpoint
                && scene.Performers.Any(performer => performer.RemoteId == value.RemoteId));
        query = ApplyFacet(
            query,
            ParseValues(request.Query["tag"]),
            ParseValues(request.Query["excludeTag"]),
            ParseMode(request.Query["tagMode"]),
            scene => scene.Tags.Any(),
            value => scene => scene.RemoteEndpoint == value.Endpoint
                && scene.Tags.Any(tag => tag.RemoteId == value.RemoteId));

        var includeSubstudios = bool.TryParse(
            request.Query["includeSubstudios"],
            out var parsedIncludeSubstudios) && parsedIncludeSubstudios;
        query = ApplyFacet(
            query,
            ParseValues(request.Query["studio"]),
            ParseValues(request.Query["excludeStudio"]),
            ParseMode(request.Query["studioMode"]),
            scene => scene.StudioRemoteId != null,
            value => includeSubstudios
                ? scene => scene.RemoteEndpoint == value.Endpoint
                    && (scene.StudioRemoteId == value.RemoteId
                        || scene.ParentStudioRemoteId == value.RemoteId)
                : scene => scene.RemoteEndpoint == value.Endpoint
                    && scene.StudioRemoteId == value.RemoteId);
        return query;
    }

    private static IQueryable<CompletionScene> ApplyFacet(
        IQueryable<CompletionScene> query,
        IReadOnlyList<FacetValue> includes,
        IReadOnlyList<FacetValue> excludes,
        FacetMode mode,
        Expression<Func<CompletionScene, bool>> hasValue,
        Func<FacetValue, Expression<Func<CompletionScene, bool>>> matches)
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

    private static IReadOnlyList<FacetValue> ParseValues(IEnumerable<string?> values) =>
        values
            .Select(ParseValue)
            .Where(value => value is not null)
            .Select(value => value!)
            .Distinct()
            .ToList();

    private static FacetValue? ParseValue(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)) return null;
        var separator = value.IndexOf('|');
        if (separator <= 0 || separator == value.Length - 1) return null;
        return new(
            CompletionCatalog.NormalizeEndpoint(value[..separator]),
            value[(separator + 1)..]);
    }

    private static FacetMode ParseMode(string? value) =>
        value?.ToString().ToLowerInvariant() switch
        {
            "all" => FacetMode.All,
            "null" => FacetMode.Null,
            "not-null" => FacetMode.NotNull,
            _ => FacetMode.Any,
        };

    private static Expression<Func<CompletionScene, bool>> Or(
        IEnumerable<Expression<Func<CompletionScene, bool>>> predicates)
    {
        var parameter = Expression.Parameter(typeof(CompletionScene), "scene");
        var body = predicates
            .Select(predicate => new ParameterReplacer(predicate.Parameters[0], parameter)
                .Visit(predicate.Body)!)
            .Aggregate(Expression.OrElse);
        return Expression.Lambda<Func<CompletionScene, bool>>(body, parameter);
    }

    private static Expression<Func<CompletionScene, bool>> Not(
        Expression<Func<CompletionScene, bool>> predicate) =>
        Expression.Lambda<Func<CompletionScene, bool>>(
            Expression.Not(predicate.Body),
            predicate.Parameters);

    private sealed class ParameterReplacer(
        ParameterExpression source,
        ParameterExpression target) : ExpressionVisitor
    {
        protected override Expression VisitParameter(ParameterExpression node) =>
            node == source ? target : base.VisitParameter(node);
    }

    private sealed record FacetValue(string Endpoint, string RemoteId);
    private enum FacetMode { Any, All, Null, NotNull }
}
