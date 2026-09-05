using MidnightRider.Cove.DiscoveryWidgets;
using System.Diagnostics;

namespace DiscoveryWidgets.Tests;

public sealed class PerformerConnectionGraphTests
{
    private static readonly PerformerConnectionPerson Alpha = new(1, "Alpha", null, 99);
    private static readonly PerformerConnectionPerson Bravo = new(2, "Bravo", null, 2);
    private static readonly PerformerConnectionPerson Charlie = new(3, "Charlie", null, 2);
    private static readonly PerformerConnectionPerson Delta = new(4, "Delta", null, 2);
    private static readonly PerformerConnectionPerson Isolated = new(5, "Isolated", null, 1);

    private static PerformerConnectionGraph BuildGraph()
        => new([
            new(Alpha, new(10, "Alpha and Bravo", null, null)),
            new(Bravo, new(10, "Alpha and Bravo", null, null)),
            new(Alpha, new(11, "Alpha and Charlie", null, null)),
            new(Charlie, new(11, "Alpha and Charlie", null, null)),
            new(Charlie, new(12, "Charlie and Delta", null, null)),
            new(Delta, new(12, "Charlie and Delta", null, null)),
            new(Isolated, new(13, "Solo", null, null)),
        ]);

    [Fact]
    public void FindsTheShortestPerformerChainAndPreservesConnectingVideos()
    {
        var result = BuildGraph().FindShortestPath(Bravo.Id, Delta.Id, maxDegrees: 6);

        Assert.NotNull(result);
        Assert.Equal(3, result.Degrees);
        Assert.Equal([Bravo.Id, Alpha.Id, Charlie.Id, Delta.Id],
            result.Steps.Select(step => step.From.Id).Append(result.End.Id));
        Assert.Equal([10, 11, 12], result.Steps.Select(step => step.Video.Id));
        Assert.Equal(1, result.Start.VideoCount);
    }

    [Fact]
    public void HonorsTheMaximumDegreeBound()
    {
        Assert.Null(BuildGraph().FindShortestPath(Bravo.Id, Delta.Id, maxDegrees: 2));
    }

    [Fact]
    public void ReturnsAZeroDegreeChainForTheSameVisiblePerformer()
    {
        var result = BuildGraph().FindShortestPath(Alpha.Id, Alpha.Id, maxDegrees: 6);

        Assert.NotNull(result);
        Assert.Equal(0, result.Degrees);
        Assert.Empty(result.Steps);
        Assert.Equal(Alpha.Id, result.Start.Id);
        Assert.Equal(Alpha.Id, result.End.Id);
        Assert.Equal(2, result.Start.VideoCount);
    }

    [Fact]
    public void RandomChainsAreDeterministicConnectedAndIgnoreSoloAppearances()
    {
        var graph = BuildGraph();

        var first = graph.FindRandomPath(seed: 42, maxDegrees: 6);
        var second = graph.FindRandomPath(seed: 42, maxDegrees: 6);

        Assert.NotNull(first);
        Assert.NotNull(second);
        Assert.Equal(first.Start.Id, second.Start.Id);
        Assert.Equal(first.End.Id, second.End.Id);
        Assert.Equal(first.Steps.Select(step => step.Video.Id), second.Steps.Select(step => step.Video.Id));
        Assert.InRange(first.Degrees, 1, 6);
        Assert.DoesNotContain(Isolated.Id, first.Steps.Select(step => step.From.Id).Append(first.End.Id));
        Assert.Equal(3, graph.VideoCount);
    }

    [Fact]
    public void HighFanoutVideosAreExpandedInLinearTime()
    {
        const int castSize = 12_000;
        var sharedVideo = new PerformerConnectionVideo(20, "Large ensemble", null, null);
        var bridgeVideo = new PerformerConnectionVideo(21, "Bridge", null, null);
        var appearances = new List<PerformerConnectionAppearance>(castSize + 2);
        for (var performerId = 1; performerId <= castSize; performerId++)
        {
            appearances.Add(new(
                new(performerId, $"Performer {performerId}", null, 1),
                sharedVideo));
        }

        appearances.Add(new(
            new(castSize, $"Performer {castSize}", null, 2),
            bridgeVideo));
        appearances.Add(new(
            new(castSize + 1, "Target", null, 1),
            bridgeVideo));
        var graph = new PerformerConnectionGraph(appearances);

        var stopwatch = Stopwatch.StartNew();
        var result = graph.FindShortestPath(1, castSize + 1, maxDegrees: 6);
        stopwatch.Stop();

        Assert.NotNull(result);
        Assert.Equal(2, result.Degrees);
        Assert.True(stopwatch.Elapsed < TimeSpan.FromMilliseconds(250),
            $"A high-fanout traversal took {stopwatch.Elapsed.TotalMilliseconds:N0} ms.");
    }
}
