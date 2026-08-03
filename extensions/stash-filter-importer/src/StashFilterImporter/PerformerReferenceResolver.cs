using Cove.Core.Interfaces;

namespace StashFilterImporter;

internal sealed record PerformerReference(string Endpoint, string RemoteId);
internal sealed record PerformerResolution(int? TargetId, string Status);

internal interface IPerformerReferenceResolver
{
    Task<IReadOnlyDictionary<int, PerformerResolution>> ResolveAsync(
        IReadOnlyDictionary<int, IReadOnlyList<PerformerReference>> references,
        CancellationToken ct);
}

internal sealed class CovePerformerReferenceResolver(IPerformerRepository performers) : IPerformerReferenceResolver
{
    public async Task<IReadOnlyDictionary<int, PerformerResolution>> ResolveAsync(
        IReadOnlyDictionary<int, IReadOnlyList<PerformerReference>> references,
        CancellationToken ct)
    {
        var matchesByReference = new Dictionary<(string Endpoint, string RemoteId), HashSet<int>>(ReferenceComparer.Instance);
        foreach (var endpointGroup in references.Values.SelectMany(value => value)
                     .GroupBy(reference => reference.Endpoint, StringComparer.Ordinal))
        {
            var remoteIds = endpointGroup.Select(reference => reference.RemoteId)
                .Distinct(StringComparer.Ordinal).ToArray();
            var matches = await performers.FindByNamesOrRemoteIdsAsync([], endpointGroup.Key, remoteIds, ct);
            foreach (var performer in matches)
            {
                foreach (var remote in performer.RemoteIds.Where(remote =>
                             string.Equals(remote.Endpoint, endpointGroup.Key, StringComparison.Ordinal)
                             && remoteIds.Contains(remote.RemoteId, StringComparer.Ordinal)))
                {
                    var key = (endpointGroup.Key, remote.RemoteId);
                    if (!matchesByReference.TryGetValue(key, out var ids))
                        matchesByReference[key] = ids = [];
                    ids.Add(performer.Id);
                }
            }
        }

        var output = new Dictionary<int, PerformerResolution>();
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
            HashCode.Combine(StringComparer.Ordinal.GetHashCode(value.Endpoint),
                StringComparer.Ordinal.GetHashCode(value.RemoteId));
    }
}
