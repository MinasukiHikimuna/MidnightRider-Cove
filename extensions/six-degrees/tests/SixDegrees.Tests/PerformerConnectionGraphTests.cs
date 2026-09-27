using MidnightRider.Cove.SixDegrees;
using System.Diagnostics;

namespace SixDegrees.Tests;

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
    public void RandomPairsAreDrawnFromEveryReachablePerformerRatherThanTheFarthest()
    {
        // A line of four performers, each sharing one video with the next.
        var performers = Enumerable.Range(1, 4)
            .Select(id => new PerformerConnectionPerson(id, $"Performer {id}", null, 0))
            .ToArray();
        var appearances = new List<PerformerConnectionAppearance>();
        for (var index = 0; index < performers.Length - 1; index++)
        {
            var video = new PerformerConnectionVideo(100 + index, $"Video {index}", null, null);
            appearances.Add(new(performers[index], video));
            appearances.Add(new(performers[index + 1], video));
        }
        var graph = new PerformerConnectionGraph(appearances);

        var paths = Enumerable.Range(0, 400)
            .Select(seed => graph.FindRandomPath(seed, maxDegrees: 6))
            .ToArray();

        Assert.All(paths, path =>
        {
            Assert.NotNull(path);
            Assert.True(path.IsRandom);
            Assert.NotEqual(path.Start.Id, path.End.Id);
            Assert.Equal(Math.Abs(path.End.Id - path.Start.Id), path.Degrees);
        });
        var pairs = paths.Select(path => (path!.Start.Id, path.End.Id)).Distinct().Count();
        Assert.Equal(12, pairs);
        Assert.Equal([1, 2, 3], paths.Select(path => path!.Degrees).Distinct().Order());
    }

    [Fact]
    public void RandomPairsStayWithinTheMaximumDegreeBound()
    {
        var performers = Enumerable.Range(1, 5)
            .Select(id => new PerformerConnectionPerson(id, $"Performer {id}", null, 0))
            .ToArray();
        var appearances = new List<PerformerConnectionAppearance>();
        for (var index = 0; index < performers.Length - 1; index++)
        {
            var video = new PerformerConnectionVideo(100 + index, $"Video {index}", null, null);
            appearances.Add(new(performers[index], video));
            appearances.Add(new(performers[index + 1], video));
        }
        var graph = new PerformerConnectionGraph(appearances);

        Assert.All(Enumerable.Range(0, 200), seed =>
            Assert.InRange(graph.FindRandomPath(seed, maxDegrees: 2)!.Degrees, 1, 2));
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
