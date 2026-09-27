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

    private static PerformerConnectionPerson Person(int id) => new(id, $"Performer {id}", null, 0);

    // Performers 1…count in a line, each sharing one video with the next; video n is dated in year firstYear + n.
    // The last performer also has a later solo video, so exactly one performer has the newest video.
    private static PerformerConnectionGraph Line(int count, int firstYear = 2000, bool duosOnly = false)
    {
        var appearances = new List<PerformerConnectionAppearance>
        {
            new(Person(count), new PerformerConnectionVideo(99, "Solo", $"{firstYear + count + 10}-01-01", null)),
        };
        for (var id = 1; id < count; id++)
        {
            var video = new PerformerConnectionVideo(100 + id, $"Video {id}", $"{firstYear + id}-06-01", null);
            appearances.Add(new(Person(id), video));
            appearances.Add(new(Person(id + 1), video));
        }
        return new(appearances, duosOnly);
    }

    [Fact]
    public void DuosOnlyIgnoresVideosWithMoreThanTwoPerformersButKeepsVideoCounts()
    {
        var duo = new PerformerConnectionVideo(10, "Duo", null, null);
        var trio = new PerformerConnectionVideo(11, "Trio", null, null);
        var secondDuo = new PerformerConnectionVideo(12, "Second duo", null, null);
        PerformerConnectionAppearance[] appearances =
        [
            new(Person(1), duo), new(Person(2), duo),
            new(Person(2), trio), new(Person(3), trio), new(Person(4), trio),
            new(Person(4), secondDuo), new(Person(5), secondDuo),
        ];

        var everything = new PerformerConnectionGraph(appearances);
        var duos = new PerformerConnectionGraph(appearances, duosOnly: true);

        Assert.Equal(3, everything.FindShortestPath(1, 5, maxDegrees: 6)!.Degrees);
        Assert.True(duos.ContainsPerformer(1));
        Assert.Null(duos.FindShortestPath(1, 5, maxDegrees: 6));
        Assert.Equal(2, duos.VideoCount);
        var pair = duos.FindShortestPath(1, 2, maxDegrees: 6)!;
        Assert.Equal(2, pair.End.VideoCount);
    }

    [Fact]
    public void LongestChainsJoinTheEndsOfTheLibraryFromAnyStart()
    {
        var graph = Line(6);

        Assert.All(Enumerable.Range(0, 50), seed =>
        {
            var path = graph.FindLongestPath(seed, maxDegrees: 6)!;
            Assert.Equal(5, path.Degrees);
            Assert.Equal([1, 6], new[] { path.Start.Id, path.End.Id }.Order());
        });
    }

    [Fact]
    public void LongestChainsStayWithinTheDegreeLimit()
    {
        Assert.All(Enumerable.Range(0, 50), seed =>
            Assert.Equal(2, Line(8).FindLongestPath(seed, maxDegrees: 2)!.Degrees));
    }

    [Fact]
    public void ChainsAcrossTheYearsRunFromTheOldestTenthToTheNewestTenth()
    {
        var span = Line(6, firstYear: 1990).FindPathAcrossYears(seed: 7, maxDegrees: 6);

        Assert.NotNull(span);
        Assert.Equal(1, span.Path.Start.Id);
        Assert.Equal(6, span.Path.End.Id);
        Assert.Equal(1991, span.StartFirstYear);
        Assert.Equal(2006, span.EndLastYear);
        Assert.Equal(5, span.Path.Degrees);
    }

    [Fact]
    public void ChainsAcrossTheYearsNeedTheNewestTenthWithinTheLimit()
    {
        Assert.Null(Line(6).FindPathAcrossYears(seed: 7, maxDegrees: 4));
    }

    [Fact]
    public void TheHubIsThePerformerClosestToEveryoneAndPathsEndThere()
    {
        // Performer 1 shares a video with each of 2…6, and 6 continues a line to 9.
        var appearances = new List<PerformerConnectionAppearance>();
        var videoId = 100;
        foreach (var (from, to) in new[] { (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (6, 7), (7, 8), (8, 9) })
        {
            var video = new PerformerConnectionVideo(videoId++, "Video", null, null);
            appearances.Add(new(Person(from), video));
            appearances.Add(new(Person(to), video));
        }
        var graph = new PerformerConnectionGraph(appearances);

        var hub = graph.FindHub();

        Assert.NotNull(hub);
        Assert.Equal(1, hub.PerformerId);
        Assert.Equal(1.8, hub.AverageDegrees);
        var starts = Enumerable.Range(0, 100)
            .Select(seed => graph.FindPathToHub(seed, maxDegrees: 6, hub.PerformerId)!)
            .ToArray();
        Assert.All(starts, path =>
        {
            Assert.Equal(1, path.End.Id);
            Assert.NotEqual(1, path.Start.Id);
        });
        Assert.True(starts.Select(path => path.Start.Id).Distinct().Count() > 4);
        Assert.All(Enumerable.Range(0, 50), seed =>
            Assert.InRange(graph.FindPathToHub(seed, maxDegrees: 2, hub.PerformerId)!.Degrees, 1, 2));
    }

    [Fact]
    public void LongestChainsStartInTheLargestGroupEvenAmongManyIsolatedDuos()
    {
        var appearances = new List<PerformerConnectionAppearance>();
        for (var id = 1; id < 6; id++)
        {
            var video = new PerformerConnectionVideo(100 + id, "Line", null, null);
            appearances.Add(new(Person(id), video));
            appearances.Add(new(Person(id + 1), video));
        }
        for (var pair = 0; pair < 200; pair++)
        {
            var video = new PerformerConnectionVideo(1000 + pair, "Duo", null, null);
            appearances.Add(new(Person(1000 + pair * 2), video));
            appearances.Add(new(Person(1001 + pair * 2), video));
        }
        var graph = new PerformerConnectionGraph(appearances);

        Assert.All(Enumerable.Range(0, 100), seed =>
            Assert.Equal(5, graph.FindLongestPath(seed, maxDegrees: 6)!.Degrees));
    }

    [Fact]
    public void TheHubComesFromTheLargestGroupRatherThanTheBusiestVideo()
    {
        // A 30-performer ensemble gives its cast the most co-appearances, but a 40-performer line is the larger group.
        var appearances = new List<PerformerConnectionAppearance>();
        var ensemble = new PerformerConnectionVideo(1, "Ensemble", null, null);
        for (var id = 1; id <= 30; id++)
            appearances.Add(new(Person(id), ensemble));
        for (var id = 101; id < 140; id++)
        {
            var video = new PerformerConnectionVideo(id, "Line", null, null);
            appearances.Add(new(Person(id), video));
            appearances.Add(new(Person(id + 1), video));
        }
        var graph = new PerformerConnectionGraph(appearances);

        var hub = graph.FindHub();

        Assert.NotNull(hub);
        Assert.InRange(hub.PerformerId, 119, 121);
        Assert.True(graph.IsInLargestGroup(hub.PerformerId));
        Assert.False(graph.IsInLargestGroup(1));
        Assert.False(graph.IsInLargestGroup(9999));
    }

    [Fact]
    public void ChainsAcrossTheYearsFindTheOnlyOldPerformerWhoReachesTheNewest()
    {
        // The oldest tenth holds 161 performers: the first two of a line that reaches the newest performers, and 159 of
        // 800 old performers in isolated duos who reach no one new. Sampling a subset of starts would often miss the line.
        var appearances = new List<PerformerConnectionAppearance>();
        for (var pair = 0; pair < 400; pair++)
        {
            var video = new PerformerConnectionVideo(1000 + pair, "Old duo", "1980-01-01", null);
            appearances.Add(new(Person(1000 + pair * 2), video));
            appearances.Add(new(Person(1001 + pair * 2), video));
        }
        var years = new[] { "1970-01-01", "1995-01-01", "2010-01-01", "2030-01-01" };
        for (var step = 0; step < years.Length; step++)
        {
            var video = new PerformerConnectionVideo(100 + step, "Line", years[step], null);
            appearances.Add(new(Person(1 + step), video));
            appearances.Add(new(Person(2 + step), video));
        }
        for (var pair = 0; pair < 400; pair++)
        {
            var video = new PerformerConnectionVideo(5000 + pair, "Middle duo", "2000-01-01", null);
            appearances.Add(new(Person(5000 + pair * 2), video));
            appearances.Add(new(Person(5001 + pair * 2), video));
        }
        var graph = new PerformerConnectionGraph(appearances);

        Assert.All(Enumerable.Range(0, 20), seed =>
        {
            var span = graph.FindPathAcrossYears(seed, maxDegrees: 6);
            Assert.NotNull(span);
            Assert.Contains(span.Path.Start.Id, new[] { 1, 2 });
            Assert.Contains(span.Path.End.Id, new[] { 3, 4, 5 });
            Assert.Equal(1970, span.StartFirstYear);
        });
    }

    [Fact]
    public void ChainsAcrossTheYearsNeedDatedPerformers()
    {
        var undated = new PerformerConnectionVideo(1, "Undated", null, null);
        var graph = new PerformerConnectionGraph([new(Person(1), undated), new(Person(2), undated)]);

        Assert.Null(graph.FindPathAcrossYears(seed: 1, maxDegrees: 6));
    }

    [Fact]
    public void SignaturesMatchForTheSameLinkedLibraryWhateverTheRowOrder()
    {
        var first = new PerformerConnectionVideo(1, "First", null, null);
        var second = new PerformerConnectionVideo(2, "Second", null, null);
        PerformerConnectionAppearance[] rows = [new(Person(1), first), new(Person(2), first), new(Person(2), second), new(Person(3), second)];

        Assert.Equal(new PerformerConnectionGraph(rows).Signature, new PerformerConnectionGraph(rows.Reverse()).Signature);
        Assert.NotEqual(new PerformerConnectionGraph(rows).Signature, new PerformerConnectionGraph(rows.Take(3)).Signature);
    }
}
