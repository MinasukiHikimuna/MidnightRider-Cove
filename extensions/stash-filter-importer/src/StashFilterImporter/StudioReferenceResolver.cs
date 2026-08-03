using Cove.Core.Interfaces;

namespace StashFilterImporter;

internal sealed record StudioReference(string Endpoint, string RemoteId);
internal sealed record StudioResolution(int? TargetId, string Status);

internal interface IStudioReferenceResolver
{
    Task<IReadOnlyDictionary<int, StudioResolution>> ResolveAsync(
        IReadOnlyDictionary<int, IReadOnlyList<StudioReference>> references,
        CancellationToken ct);
}

internal sealed class CoveStudioReferenceResolver(IStudioRepository studios) : IStudioReferenceResolver
{
    public async Task<IReadOnlyDictionary<int, StudioResolution>> ResolveAsync(
        IReadOnlyDictionary<int, IReadOnlyList<StudioReference>> references,
        CancellationToken ct)
    {
        if (references.Count == 0)
            return new Dictionary<int, StudioResolution>();

        var matchesByReference =
            new Dictionary<(string Endpoint, string RemoteId), HashSet<int>>(ReferenceComparer.Instance);
        var referencedPairs = references.Values.SelectMany(value => value)
            .Select(reference => (reference.Endpoint, reference.RemoteId))
            .ToHashSet(ReferenceComparer.Instance);
        foreach (var endpointGroup in referencedPairs.GroupBy(reference => reference.Endpoint, StringComparer.Ordinal))
        {
            var (matches, _) = await studios.FindAsync(
                new StudioFilter
                {
                    RemoteIdCriterion = new() { Value = endpointGroup.Key, Modifier = CriterionModifier.Equals }
                },
                new FindFilter { PerPage = int.MaxValue },
                ct);
            foreach (var studio in matches)
            {
                foreach (var remote in studio.RemoteIds)
                {
                    var reference = (remote.Endpoint, remote.RemoteId);
                    if (!referencedPairs.Contains(reference)) continue;
                    if (!matchesByReference.TryGetValue(reference, out var ids))
                        matchesByReference[reference] = ids = [];
                    ids.Add(studio.Id);
                }
            }
        }
        var output = new Dictionary<int, StudioResolution>();
        foreach (var (sourceId, sourceReferences) in references)
        {
            var candidateIds = new HashSet<int>();
            var ambiguous = false;
            foreach (var reference in sourceReferences)
            {
                if (!matchesByReference.TryGetValue((reference.Endpoint, reference.RemoteId), out var ids))
                    continue;
                if (ids.Count > 1) ambiguous = true;
                candidateIds.UnionWith(ids);
            }

            output[sourceId] = ambiguous || candidateIds.Count > 1
                ? new(null, "ambiguous")
                : candidateIds.Count == 1
                    ? new(candidateIds.Single(), "matched")
                    : new(null, "missing");
        }
        return output;
    }

    private sealed class ReferenceComparer : IEqualityComparer<(string Endpoint, string RemoteId)>
    {
        internal static readonly ReferenceComparer Instance = new();
        public bool Equals((string Endpoint, string RemoteId) x, (string Endpoint, string RemoteId) y) =>
            string.Equals(x.Endpoint, y.Endpoint, StringComparison.Ordinal)
            && string.Equals(x.RemoteId, y.RemoteId, StringComparison.Ordinal);
        public int GetHashCode((string Endpoint, string RemoteId) value) =>
            HashCode.Combine(
                StringComparer.Ordinal.GetHashCode(value.Endpoint),
                StringComparer.Ordinal.GetHashCode(value.RemoteId));
    }
}
