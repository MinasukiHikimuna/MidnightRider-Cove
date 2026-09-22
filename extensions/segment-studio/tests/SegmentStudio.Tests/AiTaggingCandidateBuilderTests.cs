using AI.Extensions.Abstractions;
using SegmentStudio;
using Xunit;

namespace SegmentStudio.Tests;

public sealed class AiTaggingCandidateBuilderTests
{
    private const string Fingerprint = "sha256:source";

    private static AiTemporalSlice Frame(double time, params (string Model, string Tag, double? Confidence)[] tags)
        => new(
            SliceKind: "frame",
            Index: (int)(time * 10),
            TimeSeconds: time,
            StartSeconds: null,
            EndSeconds: null,
            Analysis: new AiAnalysisNode
            {
                Tags = tags
                    .Select(tag => new AiTagPrediction(tag.Model, tag.Tag, tag.Confidence))
                    .ToArray(),
            });

    private static IReadOnlyList<AiTaggingCandidate> Build(
        IReadOnlyList<AiTemporalSlice> frames,
        double duration = 100,
        double interval = 1,
        double floor = 0.35)
        => AiTaggingCandidateBuilder.Build(frames, Fingerprint, duration, interval, floor);

    [Fact]
    public void ConsecutiveObservationsOfATagCollapseIntoOneSpan()
    {
        var candidates = Build([
            Frame(0, ("m", "kissing", 0.9)),
            Frame(1, ("m", "kissing", 0.8)),
            Frame(2, ("m", "kissing", 0.7)),
        ]);

        var candidate = Assert.Single(candidates);
        Assert.Equal("kissing", candidate.TagName);
        Assert.Equal(0, candidate.StartSeconds);
        // Three observations at 0,1,2 plus the interval the last one stands for.
        Assert.Equal(3, candidate.EndSeconds);
        Assert.Equal(3, candidate.ObservationCount);
    }

    [Fact]
    public void ATagThatStopsAndResumesProducesTwoSpans()
    {
        var candidates = Build([
            Frame(0, ("m", "kissing", 0.9)),
            Frame(1),
            Frame(2, ("m", "kissing", 0.9)),
        ]);

        Assert.Equal(2, candidates.Count);
        Assert.Equal((0d, 1d), (candidates[0].StartSeconds, candidates[0].EndSeconds));
        Assert.Equal((2d, 3d), (candidates[1].StartSeconds, candidates[1].EndSeconds));
    }

    [Fact]
    public void ASingleObservationStillCoversTheIntervalItStandsFor()
    {
        var candidate = Assert.Single(Build([Frame(5, ("m", "kissing", 0.9))]));
        Assert.Equal(5, candidate.StartSeconds);
        Assert.Equal(6, candidate.EndSeconds);
    }

    [Fact]
    public void PredictionsBelowTheConfidenceFloorAreDropped()
    {
        Assert.Empty(Build([Frame(0, ("m", "kissing", 0.2))], floor: 0.35));
    }

    [Fact]
    public void AnUnscoredPredictionSurvivesTheConfidenceFloor()
    {
        // A model that reports no confidence is not a low-confidence model; the
        // floor must not silently discard everything it produces.
        var candidate = Assert.Single(Build([Frame(0, ("m", "kissing", null))], floor: 0.9));
        Assert.Null(candidate.Confidence);
    }

    [Fact]
    public void ARunKeepsItsStrongestConfidence()
    {
        var candidate = Assert.Single(Build([
            Frame(0, ("m", "kissing", 0.6)),
            Frame(1, ("m", "kissing", 0.95)),
            Frame(2, ("m", "kissing", 0.7)),
        ]));
        Assert.Equal(0.95, candidate.Confidence);
    }

    [Fact]
    public void AnUnscoredObservationDoesNotDisplaceAScoredOne()
    {
        var candidate = Assert.Single(Build([
            Frame(0, ("m", "kissing", 0.8)),
            Frame(1, ("m", "kissing", null)),
        ]));
        Assert.Equal(0.8, candidate.Confidence);
    }

    [Fact]
    public void RepeatedPredictionsOnOneFrameKeepTheStrongest()
    {
        var candidate = Assert.Single(Build([
            Frame(0, ("m", "kissing", 0.4), ("m", "kissing", 0.92)),
        ]));
        Assert.Equal(0.92, candidate.Confidence);
        Assert.Equal(1, candidate.ObservationCount);
    }

    [Fact]
    public void TheSameTagFromDifferentModelsStaysSeparate()
    {
        var candidates = Build([Frame(0, ("a", "kissing", 0.9), ("b", "kissing", 0.9))]);
        Assert.Equal(2, candidates.Count);
        Assert.Equal(["a", "b"], candidates.Select(candidate => candidate.ModelKey).Order());
    }

    [Fact]
    public void SpansAreClampedToTheAssetDuration()
    {
        var candidate = Assert.Single(Build([Frame(9.5, ("m", "kissing", 0.9))], duration: 10));
        Assert.Equal(10, candidate.EndSeconds);
    }

    [Fact]
    public void FramesOutOfOrderAreAggregatedAsIfOrdered()
    {
        // The walk closes a run the first time a frame omits its tag, so an
        // unordered feed would otherwise fragment one span into several.
        var shuffled = Build([
            Frame(2, ("m", "kissing", 0.9)),
            Frame(0, ("m", "kissing", 0.9)),
            Frame(1, ("m", "kissing", 0.9)),
        ]);
        var candidate = Assert.Single(shuffled);
        Assert.Equal((0d, 3d), (candidate.StartSeconds, candidate.EndSeconds));
    }

    [Fact]
    public void TagNamesAreTrimmedAndNormalized()
    {
        var candidate = Assert.Single(Build([Frame(0, ("m", "  kissing  ", 0.9))]));
        Assert.Equal("kissing", candidate.TagName);
        Assert.Equal("kissing", candidate.Title);
        Assert.Equal("tag", candidate.Kind);
    }

    [Fact]
    public void AZeroLengthSpanIsNotEmitted()
    {
        // Everything is clamped to a zero duration, so nothing survives.
        Assert.Empty(Build([Frame(0, ("m", "kissing", 0.9))], duration: 0));
    }

    [Fact]
    public void TheSameSpanReDerivesTheSameCandidateKey()
    {
        var first = Assert.Single(Build([Frame(0, ("m", "kissing", 0.9))]));
        var second = Assert.Single(Build([Frame(0, ("m", "kissing", 0.5))]));
        // The key addresses the span, not the score a particular run gave it.
        Assert.Equal(first.CandidateKey, second.CandidateKey);
        Assert.StartsWith("sha256:", first.CandidateKey);
    }

    [Theory]
    [InlineData("other", "kissing", 0d)]
    [InlineData("m", "hugging", 0d)]
    [InlineData("m", "kissing", 1d)]
    public void CandidateKeysDistinguishModelTagAndSpan(string model, string tag, double time)
    {
        var baseline = Assert.Single(Build([Frame(0, ("m", "kissing", 0.9))]));
        var other = Assert.Single(Build([Frame(time, (model, tag, 0.9))]));
        Assert.NotEqual(baseline.CandidateKey, other.CandidateKey);
    }

    [Fact]
    public void CandidatesAreOrderedDeterministically()
    {
        var candidates = Build([
            Frame(1, ("m", "zebra", 0.9), ("m", "apple", 0.9)),
            Frame(0, ("m", "mango", 0.9)),
        ]);
        Assert.Equal(
            [(0d, "mango"), (1d, "apple"), (1d, "zebra")],
            candidates.Select(candidate => (candidate.StartSeconds, candidate.TagName)));
    }

    [Fact]
    public void AFrameWithoutAnalysisIsTolerated()
    {
        var candidates = Build([
            new AiTemporalSlice("frame", 0, 0, null, null, new AiAnalysisNode()),
            Frame(1, ("m", "kissing", 0.9)),
        ]);
        Assert.Single(candidates);
    }
}

public sealed class AiTaggingCandidateBuilderParityTests
{
    /// <summary>
    /// The case the superseded Python service asserted on, carried over verbatim so
    /// the port is pinned to the original's own expectations rather than to a
    /// reading of its source: two scored observations two seconds apart, a
    /// sub-floor tag that must vanish, and a third frame that closes the run.
    /// </summary>
    [Fact]
    public void MatchesTheSupersededServiceOnItsOwnAggregationCase()
    {
        AiTemporalSlice Frame(int index, double time, params AiTagPrediction[] tags)
            => new("frame", index, time, null, null, new AiAnalysisNode { Tags = tags });

        var candidates = AiTaggingCandidateBuilder.Build(
            [
                Frame(0, 0.0, new AiTagPrediction("model", "keep", 0.7), new AiTagPrediction("model", "low", 0.1)),
                Frame(1, 2.0, new AiTagPrediction("model", "keep", 0.9)),
                Frame(2, 4.0),
            ],
            sourceFingerprint: "sha256:source",
            durationSeconds: 10.0,
            frameIntervalSeconds: 2.0,
            confidenceFloor: 0.35);

        var candidate = Assert.Single(candidates);
        Assert.Equal(0, candidate.StartSeconds);
        Assert.Equal(4, candidate.EndSeconds);
        Assert.Equal(0.9, candidate.Confidence);
        Assert.Equal(2, candidate.ObservationCount);
        Assert.StartsWith("sha256:", candidate.CandidateKey);
    }
}

public sealed class AiTaggingProjectionStatusTests
{
    /// <summary>
    /// The run row is written at the very end of a successful analysis, so a status
    /// the database rejects throws away everything the run produced — and the tests
    /// run on SQLite, which does not enforce the check constraint that rejects it.
    /// This pins the written status to a value PostgreSQL accepts.
    /// </summary>
    [Fact]
    public void CompletedStatusIsOneTheDatabaseAccepts()
        => Assert.Contains(
            AiTaggingProjectionService.CompletedStatus,
            AiTaggingProjectionService.AllowedRunStatuses);

    [Fact]
    public void TheReviewUiTreatsThatStatusAsFinished()
    {
        // The editor reloads a run it sees as "completed"; a different terminal
        // word would store fine and then never surface its candidates.
        Assert.Equal("completed", AiTaggingProjectionService.CompletedStatus);
    }
}
