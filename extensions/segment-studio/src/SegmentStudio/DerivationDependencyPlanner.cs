namespace SegmentStudio;

public sealed record DerivationDependencyPlan(
    IReadOnlySet<Guid> DeletedNodeIds,
    IReadOnlySet<long> RemovedEdgeIds,
    int RetainedSharedNodeCount);

public static class DerivationDependencyPlanner
{
    public static DerivationDependencyPlan ForDeletedNodes(
        IReadOnlyList<SegmentStudioDerivationEdge> edges,
        IEnumerable<Guid> deletedNodeIds)
    {
        var deleted = deletedNodeIds.ToHashSet();
        var removed = edges
            .Where(edge =>
                deleted.Contains(edge.SourceNodeId)
                || deleted.Contains(edge.DerivedNodeId))
            .Select(edge => edge.Id)
            .ToHashSet();
        return Complete(edges, deleted, removed);
    }

    public static DerivationDependencyPlan ForRemovedEdges(
        IReadOnlyList<SegmentStudioDerivationEdge> edges,
        IEnumerable<long> removedEdgeIds)
    {
        return Complete(edges, [], removedEdgeIds.ToHashSet());
    }

    private static DerivationDependencyPlan Complete(
        IReadOnlyList<SegmentStudioDerivationEdge> edges,
        HashSet<Guid> deletedNodeIds,
        HashSet<long> removedEdgeIds)
    {
        while (true)
        {
            var addedNode = false;
            foreach (var nodeId in edges
                .Where(edge => removedEdgeIds.Contains(edge.Id))
                .Select(edge => edge.DerivedNodeId)
                .Distinct()
                .Where(nodeId => !deletedNodeIds.Contains(nodeId)))
            {
                if (edges.Any(edge =>
                        edge.DerivedNodeId == nodeId
                        && !removedEdgeIds.Contains(edge.Id)))
                    continue;
                addedNode |= deletedNodeIds.Add(nodeId);
            }

            var addedEdge = false;
            foreach (var edge in edges.Where(edge =>
                    deletedNodeIds.Contains(edge.SourceNodeId)
                    || deletedNodeIds.Contains(edge.DerivedNodeId)))
                addedEdge |= removedEdgeIds.Add(edge.Id);
            if (!addedNode && !addedEdge)
                break;
        }

        var retainedSharedNodeCount = edges
            .Where(edge =>
                removedEdgeIds.Contains(edge.Id)
                && !deletedNodeIds.Contains(edge.DerivedNodeId)
                && edges.Any(incoming =>
                    incoming.DerivedNodeId == edge.DerivedNodeId
                    && !removedEdgeIds.Contains(incoming.Id)))
            .Select(edge => edge.DerivedNodeId)
            .Distinct()
            .Count();
        return new(
            deletedNodeIds,
            removedEdgeIds,
            retainedSharedNodeCount);
    }
}
