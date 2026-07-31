using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class DerivationDependencyPlannerTests
{
    [Fact]
    public void DeletingOneFanInSourceRetainsTheSharedBranch()
    {
        var rootA = Guid.NewGuid();
        var rootB = Guid.NewGuid();
        var shared = Guid.NewGuid();
        var leaf = Guid.NewGuid();
        var edges = new[]
        {
            Edge(1, rootA, shared),
            Edge(2, rootB, shared),
            Edge(3, shared, leaf),
        };

        var plan = DerivationDependencyPlanner.ForDeletedNodes(edges, [rootA]);

        Assert.Equal([rootA], plan.DeletedNodeIds.Order());
        Assert.Equal([1], plan.RemovedEdgeIds.Order());
        Assert.Equal(1, plan.RetainedSharedNodeCount);
    }

    [Fact]
    public void DeletingEveryFanInSourceCascadesThroughUnsupportedDescendants()
    {
        var rootA = Guid.NewGuid();
        var rootB = Guid.NewGuid();
        var shared = Guid.NewGuid();
        var leaf = Guid.NewGuid();
        var edges = new[]
        {
            Edge(1, rootA, shared),
            Edge(2, rootB, shared),
            Edge(3, shared, leaf),
        };

        var plan = DerivationDependencyPlanner.ForDeletedNodes(edges, [rootA, rootB]);

        Assert.Equal(
            new[] { rootA, rootB, shared, leaf }.Order(),
            plan.DeletedNodeIds.Order());
        Assert.Equal([1, 2, 3], plan.RemovedEdgeIds.Order());
        Assert.Equal(0, plan.RetainedSharedNodeCount);
    }

    [Fact]
    public void ExplicitlyDeletingASharedDerivedNodeRetainsItsSources()
    {
        var rootA = Guid.NewGuid();
        var rootB = Guid.NewGuid();
        var shared = Guid.NewGuid();
        var leaf = Guid.NewGuid();
        var edges = new[]
        {
            Edge(1, rootA, shared),
            Edge(2, rootB, shared),
            Edge(3, shared, leaf),
        };

        var plan = DerivationDependencyPlanner.ForDeletedNodes(edges, [shared]);

        Assert.Equal(new[] { shared, leaf }.Order(), plan.DeletedNodeIds.Order());
        Assert.Equal([1, 2, 3], plan.RemovedEdgeIds.Order());
        Assert.DoesNotContain(rootA, plan.DeletedNodeIds);
        Assert.DoesNotContain(rootB, plan.DeletedNodeIds);
    }

    private static SegmentStudioDerivationEdge Edge(long id, Guid source, Guid derived) =>
        new()
        {
            Id = id,
            SourceNodeId = source,
            DerivedNodeId = derived,
        };
}
