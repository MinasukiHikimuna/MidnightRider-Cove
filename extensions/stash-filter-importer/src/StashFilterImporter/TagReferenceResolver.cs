using Cove.Core.Interfaces;

namespace StashFilterImporter;

internal sealed record TagResolution(int? TargetId, string Status);

internal interface ITagReferenceResolver
{
    Task<IReadOnlyDictionary<string, TagResolution>> ResolveAsync(
        IReadOnlyCollection<string> names,
        CancellationToken ct);
}

internal sealed class CoveTagReferenceResolver(ITagRepository tags) : ITagReferenceResolver
{
    public async Task<IReadOnlyDictionary<string, TagResolution>> ResolveAsync(
        IReadOnlyCollection<string> names,
        CancellationToken ct)
    {
        var distinctNames = names
            .Where(name => !string.IsNullOrWhiteSpace(name))
            .Distinct(StringComparer.OrdinalIgnoreCase)
            .ToArray();
        var matches = await tags.FindByNamesAsync(distinctNames, ct);
        var matchesByName = matches
            .GroupBy(tag => tag.Name, StringComparer.OrdinalIgnoreCase)
            .ToDictionary(
                group => group.Key,
                group => group.Select(tag => tag.Id).Distinct().ToArray(),
                StringComparer.OrdinalIgnoreCase);

        return distinctNames.ToDictionary(
            name => name,
            name => !matchesByName.TryGetValue(name, out var ids)
                ? new TagResolution(null, "missing")
                : ids.Length == 1
                    ? new TagResolution(ids[0], "matched")
                    : new TagResolution(null, "ambiguous"),
            StringComparer.OrdinalIgnoreCase);
    }
}
