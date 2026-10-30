using System.Text.Json;
using System.Text.RegularExpressions;
using AI.Extensions.Abstractions;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using SegmentStudio;
using Xunit;

namespace SegmentStudio.Tests;

public sealed class AiTaggingProjectionServiceTests
{
    // ── the run status PostgreSQL accepts ────────────────────────────────

    [Fact]
    public void CompletedStatusIsOneTheRunStatusConstraintPermits()
    {
        // These tests run on SQLite, which does not enforce check constraints, so a
        // status PostgreSQL rejects would pass every projection test here and then
        // fail the final save of a finished run, discarding everything it produced.
        // The constraint is read from the migrations the extension applies.
        var sql = string.Concat(new SegmentStudioExtension().GetMigrations()
            .Select(migration => migration.UpSql));
        var definition = sql.LastIndexOf(
            "CK_segment_studio_analysis_runs_status", StringComparison.Ordinal);
        Assert.True(definition >= 0, "no migration defines the run status constraint");
        var end = sql.IndexOf('\n', definition);
        var constraint = end < 0 ? sql[definition..] : sql[definition..end];
        var permitted = Regex.Matches(constraint, "'([a-z_]+)'")
            .Select(match => match.Groups[1].Value)
            .ToArray();

        Assert.NotEmpty(permitted);
        Assert.Contains(AiTaggingProjectionService.CompletedStatus, permitted);
    }

    // ── projection ───────────────────────────────────────────────────────

    [Fact]
    public async Task ProjectionQueuesCandidatesAndDraftsWithoutWritingLibrarySegments()
    {
        await using var fixture = await Fixture.CreateAsync();
        var runId = Guid.NewGuid();

        var result = await fixture.ProjectAsync(runId,
            Candidate("k1", "Kissing", 1, 3),
            Candidate("k2", "Dancing", 5, 7));

        Assert.Equal(2, result.CandidateCount);
        var run = Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        Assert.Equal(runId, run.Id);
        Assert.Equal(AiTaggingProjectionService.CompletedStatus, run.Status);
        Assert.Equal("""["aiTagging"]""", run.AnalysesJson);
        Assert.Equal(Fixture.VideoId, run.VideoId);
        Assert.Equal(Fixture.VideoFileId, run.VideoFileId);
        Assert.Equal(Fixture.Fingerprint, run.SourceFingerprint);
        Assert.NotNull(run.CompletedAt);

        var candidates = await fixture.Context.Set<SegmentStudioAnalysisCandidate>()
            .OrderBy(candidate => candidate.StartSec).ToListAsync();
        Assert.Equal(["k1", "k2"], candidates.Select(candidate => candidate.CandidateKey));
        Assert.All(candidates, candidate =>
        {
            Assert.Equal("unreviewed", candidate.ReviewState);
            Assert.NotNull(candidate.ItemId);
            Assert.NotNull(candidate.SourceTagId);
        });

        var drafts = await fixture.Context.Set<SegmentStudioItem>().ToListAsync();
        Assert.Equal(2, drafts.Count);
        Assert.All(drafts, draft =>
        {
            Assert.Equal("unreviewed", draft.ReviewState);
            Assert.Equal("ext:ai.tagging", draft.SourceKey);
            Assert.Equal(runId.ToString(), draft.SourceRunId);
            Assert.Null(draft.NativeSegmentId);
        });

        // Labels that were not Cove tags yet become tags, so each draft has one...
        Assert.Equal(["Dancing", "Kissing"],
            (await fixture.Context.Set<Tag>().OrderBy(tag => tag.Name).ToListAsync())
                .Select(tag => tag.Name));
        // ...but no segment reaches the library until a reviewer accepts it.
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
    }

    [Fact]
    public async Task ProjectionRecordsEachDraftsAiOrigin()
    {
        // Collecting a draft as AI feedback, and exporting it, require an AI
        // provenance assertion; without one every draft is refused.
        await using var fixture = await Fixture.CreateAsync();
        var runId = Guid.NewGuid();
        var request = new AiTaggingProjectionRequest(
            Fixture.VideoId, Fixture.VideoFileId, runId, Fixture.Fingerprint,
            [
                Candidate("k1", "Kissing", 1, 3, "actions", 0.75),
                Candidate("k2", "Dancing", 5, 7, "unmatched", null),
            ])
        {
            AiRunId = "ai-run-1",
            Models =
            [
                new AiModelDescriptor("actions_30", "actions_30", Categories: ["actions"], Version: "3.0"),
                new AiModelDescriptor("body_20", "body_20", Categories: ["bodyparts"], Version: "2.0"),
            ],
        };

        await fixture.ProjectAsync(request);
        // A retried dispatch records nothing twice.
        await fixture.ProjectAsync(request);

        var source = Assert.Single(await fixture.Context.Set<SegmentStudioSource>().ToListAsync());
        Assert.Equal(AiTaggingProjectionService.SourceKey, source.Key);
        Assert.Equal("ai", source.Category);
        var activity = Assert.Single(await fixture.Context.Set<SegmentStudioProvenanceActivity>().ToListAsync());
        Assert.Equal("ai-analysis", activity.Kind);
        Assert.Equal(source.Id, activity.SourceId);
        Assert.Equal(runId.ToString(), activity.ExternalRunId);
        Assert.Contains("ai-run-1", activity.MetadataJson);

        var drafts = await fixture.Context.Set<SegmentStudioItem>().ToListAsync();
        var nodes = await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync();
        var assertions = await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync();
        Assert.Equal(2, assertions.Count);
        Assert.All(assertions, assertion =>
        {
            Assert.Equal(source.Id, assertion.SourceId);
            Assert.Equal(activity.Id, assertion.ActivityId);
            Assert.Equal("origin", assertion.Relation);
            Assert.Null(assertion.SupersededAt);
        });
        AssertOrigin("Kissing", "actions", "actions_30", "3.0", 0.75f);
        AssertOrigin("Dancing", "unmatched", null, null, null);

        void AssertOrigin(string tag, string modelKey, string? identifier, string? version, float? confidence)
        {
            var tagId = fixture.Context.Set<Tag>().Single(candidate => candidate.Name == tag).Id;
            var draft = Assert.Single(drafts, candidate => candidate.TagId == tagId);
            var node = Assert.Single(nodes, candidate => candidate.ItemId == draft.Id);
            var assertion = Assert.Single(assertions, candidate => candidate.LineageNodeId == node.Id);
            Assert.Equal(modelKey, assertion.ModelKey);
            Assert.Equal(identifier, assertion.ModelIdentifier);
            Assert.Equal(version, assertion.ModelVersion);
            Assert.Equal(confidence, assertion.Confidence);
        }
    }

    [Fact]
    public async Task ReprojectingARunReplacesItsCandidatesAndReusesMatchingDrafts()
    {
        await using var fixture = await Fixture.CreateAsync();
        var runId = Guid.NewGuid();
        await fixture.ProjectAsync(runId,
            Candidate("k1", "Kissing", 1, 3),
            Candidate("k2", "Dancing", 5, 7));
        var firstDraft = (await fixture.Context.Set<SegmentStudioAnalysisCandidate>()
            .SingleAsync(candidate => candidate.CandidateKey == "k1")).ItemId;

        // A retried dispatch derives the same run id; one span is unchanged and
        // one moved.
        await fixture.ProjectAsync(runId,
            Candidate("k1", "Kissing", 1, 3),
            Candidate("k3", "Dancing", 5, 9));

        var candidates = await fixture.Context.Set<SegmentStudioAnalysisCandidate>()
            .OrderBy(candidate => candidate.StartSec).ToListAsync();
        Assert.Equal(["k1", "k3"], candidates.Select(candidate => candidate.CandidateKey));
        Assert.Equal(firstDraft, candidates[0].ItemId);
        Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        // The unchanged span reused its draft; only the moved one needed a new draft.
        Assert.Equal(3, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task AnExistingTagIsReusedRatherThanDuplicated()
    {
        await using var fixture = await Fixture.CreateAsync();
        var existing = new Tag { Name = "Kissing", SortName = "Kissing" };
        fixture.Context.Add(existing);
        await fixture.Context.SaveChangesAsync();

        await fixture.ProjectAsync(Guid.NewGuid(), Candidate("k1", "kissing", 1, 3));

        var tag = Assert.Single(await fixture.Context.Set<Tag>().ToListAsync());
        Assert.Equal(existing.Id, tag.Id);
        Assert.Equal(existing.Id,
            (await fixture.Context.Set<SegmentStudioAnalysisCandidate>().SingleAsync()).SourceTagId);
    }

    [Fact]
    public async Task AReusedHandMadeDraftIsNotAttributedToTheAi()
    {
        // A draft a user made that happens to match an AI span is reused rather than
        // duplicated, but it must not become collectable as an incorrect AI example.
        await using var fixture = await Fixture.CreateAsync();
        var tag = new Tag { Name = "Kissing", SortName = "Kissing" };
        fixture.Context.Add(tag);
        await fixture.Context.SaveChangesAsync();
        var handMade = new SegmentStudioItem
        {
            VideoId = Fixture.VideoId,
            StartSec = 1,
            EndSec = 3,
            TagId = tag.Id,
            Kind = "tag",
            Title = "Kissing",
            ReviewState = "approved",
            SourceKey = "user",
            Revision = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(handMade);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.ChangeTracker.Clear();

        await fixture.ProjectAsync(Guid.NewGuid(),
            Candidate("k1", "Kissing", 1, 3),
            Candidate("k2", "Dancing", 5, 7));

        Assert.Equal(handMade.Id, (await fixture.Context.Set<SegmentStudioAnalysisCandidate>()
            .SingleAsync(candidate => candidate.CandidateKey == "k1")).ItemId);
        var aiDraft = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(item => item.SourceKey == AiTaggingProjectionService.SourceKey);
        var node = Assert.Single(await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync());
        Assert.Equal(aiDraft.Id, node.ItemId);
        Assert.Equal(node.Id, Assert.Single(
            await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync()).LineageNodeId);
    }

    // ── the contributor's path for a video ───────────────────────────────

    [Fact]
    public async Task TheContributorStoresAVideoRunInOneTransaction()
    {
        await using var fixture = await Fixture.CreateAsync(probe: true);
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(new AiDispatchRequest(
            new AiRunContext("run-1", AiMediaKinds.Video, "/media/example.mp4", "/media/example.mp4",
                "video", Fixture.VideoId, 10.0, 1.0),
            contributor.Describe().Claims,
            new AiAnalyzeResult
            {
                MediaKind = AiMediaKinds.Video,
                DurationSeconds = 10.0,
                FrameIntervalSeconds = 1.0,
                Frames =
                [
                    Frame(0, ("model", "Kissing", 0.9)),
                    Frame(1, ("model", "Kissing", 0.8)),
                    Frame(2),
                ],
            }));

        Assert.Equal(1, result.PreparedCounts?["tagging"]);
        Assert.True(fixture.Probe!.SawTransaction, "the projection must run inside a transaction");
        var run = Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        Assert.Equal(Fixture.VideoFileId, run.VideoFileId);
        Assert.Equal(AiTaggingProjectionService.CompletedStatus, run.Status);
        Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<Segment>().ToListAsync());
    }

    [Fact]
    public async Task ATaggingRunSpansTheIntervalItsFramesWereSampledAtRatherThanTheReportedOne()
    {
        // The AI server reports 0.5 s when the request names no frame interval while sampling 2 s apart.
        await using var fixture = await Fixture.CreateAsync();
        var contributor = fixture.CreateContributor();
        var request = VideoRequest(
            "run-1",
            contributor.Describe().Claims,
            Frame(0, ("actions", "Kissing", 0.9)), Frame(2, ("actions", "Kissing", 0.9)), Frame(4));
        var reportedHalfSecond = request with
        {
            Context = request.Context with { FrameIntervalSeconds = 0.5 },
            Result = new AiAnalyzeResult
            {
                MediaKind = request.Result.MediaKind,
                DurationSeconds = request.Result.DurationSeconds,
                FrameIntervalSeconds = 0.5,
                Models = request.Result.Models,
                Frames = request.Result.Frames,
            },
        };

        await contributor.DispatchAsync(reportedHalfSecond);

        var candidate = Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Equal((0d, 4d), (candidate.StartSec, candidate.EndSec));
    }

    // ── raw predictions ──────────────────────────────────────────────────

    [Fact]
    public async Task ATaggingRunAlsoKeepsEveryPredictionBelowTheReviewFloor()
    {
        await using var fixture = await Fixture.CreateAsync();
        await fixture.AddAiRunAsync("run-1", """{"threshold":0.2,"frameInterval":1}""");
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(VideoRequest(
            "run-1",
            [contributor.Describe().Claims.Single(claim => claim.ClaimId == SegmentStudioAiContributor.TaggingClaimId)],
            Frame(1, ("actions", "Kissing", 0.8), ("actions", "Dancing", 0.21)),
            Frame(0, ("actions", "Kissing", 0.9), ("actions", "Kissing", 0.4), ("bodyparts", "Hands", null)),
            Frame(2)));

        Assert.Equal(2, result.PreparedCounts?["tagging"]);
        // Only spans above the floor became drafts; an unscored prediction is not a weak one...
        Assert.Equal(
            ["Hands", "Kissing"],
            (await fixture.Context.Set<SegmentStudioAnalysisCandidate>().ToListAsync())
                .Select(candidate => candidate.TagName).Order(StringComparer.Ordinal));
        // ...while the raw row keeps every prediction, frame by frame.
        var run = Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        var raw = Assert.Single(await fixture.Context.Set<SegmentStudioAiRawResult>().ToListAsync());
        Assert.Equal(run.Id, raw.RunId);
        Assert.Equal(Fixture.VideoId, raw.VideoId);
        Assert.Equal("run-1", raw.AiRunId);
        Assert.Equal(0.2, raw.Threshold);
        Assert.Equal(1.0, raw.FrameIntervalSeconds);
        Assert.Equal(10.0, raw.DurationSeconds);
        Assert.Equal(3, raw.FrameCount);
        Assert.Equal(AiRawResultBuilder.SchemaVersion, raw.SchemaVersion);
        Assert.Equal(
            """{"tags":{"actions":{"Dancing":[[1,0.21]],"Kissing":[[0,0.9],[1,0.8]]},"bodyparts":{"Hands":[[0,null]]}}}""",
            raw.PayloadJson);
        Assert.Equal(
            """[{"configName":"tagger_v2","name":"Tagger","version":"2.1","type":"tagging","categories":["actions","bodyparts"]}]""",
            raw.ModelsJson);
    }

    [Fact]
    public async Task ATaggingRunWithNothingAboveTheFloorStillKeepsItsPredictions()
    {
        await using var fixture = await Fixture.CreateAsync();
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(VideoRequest(
            "run-1",
            [contributor.Describe().Claims.Single(claim => claim.ClaimId == SegmentStudioAiContributor.TaggingClaimId)],
            Frame(0, ("actions", "Kissing", 0.3))));

        Assert.Equal(0, result.PreparedCounts?["tagging"]);
        Assert.Contains(result.Notes ?? [], note => note.Contains("above the confidence floor", StringComparison.Ordinal));
        Assert.Empty(await fixture.Context.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        var run = Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        Assert.Equal("""["aiTagging"]""", run.AnalysesJson);
        var raw = Assert.Single(await fixture.Context.Set<SegmentStudioAiRawResult>().ToListAsync());
        // No journal entry for the run: the threshold is unknown, not guessed.
        Assert.Null(raw.Threshold);
        Assert.Equal("""{"tags":{"actions":{"Kissing":[[0,0.3]]}}}""", raw.PayloadJson);
    }

    // ── published segments ───────────────────────────────────────────────

    [Fact]
    public async Task AReviewRunLeavesOutSpansThatPublishedSegmentsOfTheSameTagAlreadyCover()
    {
        await using var fixture = await Fixture.CreateAsync();
        var kissing = await fixture.AddTagAsync("Kissing");
        // 0–2 is three-quarters covered; 5–9 only 1.5 of 4 seconds, and a published
        // moment without an end covers nothing.
        await fixture.AddPublishedAsync(kissing, 0, 1.5);
        await fixture.AddPublishedAsync(kissing, 5, 6);
        await fixture.AddPublishedAsync(kissing, 6.5, 7);
        await fixture.AddPublishedAsync(kissing, 8, null);
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(VideoRequest(
            "run-1",
            contributor.Describe().Claims,
            Frame(0, ("actions", "Kissing", 0.9), ("actions", "Dancing", 0.9)),
            Frame(1, ("actions", "Kissing", 0.9)),
            Frame(2),
            Frame(3),
            Frame(4),
            Frame(5, ("actions", "Kissing", 0.9)),
            Frame(6, ("actions", "Kissing", 0.9)),
            Frame(7, ("actions", "Kissing", 0.9)),
            Frame(8, ("actions", "Kissing", 0.9))));

        Assert.Equal(2, result.PreparedCounts?["tagging"]);
        // Another tag's published segment does not cover Dancing.
        Assert.Equal(
            [("Dancing", 0d, 1d), ("Kissing", 5d, 9d)],
            (await fixture.Context.Set<SegmentStudioAnalysisCandidate>().ToListAsync())
                .Select(candidate => (candidate.TagName, candidate.StartSec, candidate.EndSec))
                .OrderBy(candidate => candidate.TagName, StringComparer.Ordinal));
        Assert.Contains("Left out 1 tag span(s) that published segments already cover.", result.Notes ?? []);
        Assert.Equal(2, (await fixture.Context.Set<SegmentStudioItem>().ToListAsync()).Count);
        Assert.Equal(4, (await fixture.Context.Set<Segment>().ToListAsync()).Count);
        // The raw predictions still hold every frame, covered or not.
        var raw = Assert.Single(await fixture.Context.Set<SegmentStudioAiRawResult>().ToListAsync());
        Assert.Contains("\"Kissing\":[[0,0.9],[1,0.9],[5,0.9]", raw.PayloadJson);
    }

    [Fact]
    public async Task ARunWhosePublishedSegmentsCoverEverythingStillKeepsItsPredictions()
    {
        await using var fixture = await Fixture.CreateAsync();
        var kissing = await fixture.AddTagAsync("Kissing");
        await fixture.AddPublishedAsync(kissing, 0, 2);
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(VideoRequest(
            "run-1", contributor.Describe().Claims, Frame(0, ("actions", "Kissing", 0.9))));

        Assert.Equal(0, result.PreparedCounts?["tagging"]);
        Assert.DoesNotContain(result.Notes ?? [], note => note.Contains("above the confidence floor", StringComparison.Ordinal));
        Assert.Empty(await fixture.Context.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioAiRawResult>().ToListAsync());
    }

    [Theory]
    [InlineData(0, 2, 1.2)]   // two overlapping segments count once
    [InlineData(1, 2, 0.2)]   // only the part inside the span counts
    [InlineData(3, 4, 0)]     // segments outside the span cover nothing
    public void CoverageCountsOverlappingPublishedSegmentsOnce(double start, double end, double expected)
    {
        var covered = AiTaggingProjectionService.CoveredSeconds(start, end, [(0.5, 1.2), (0, 0.6), (10, 12)]);

        Assert.Equal(expected, covered, 9);
    }

    [Fact]
    public async Task ARetriedDispatchReplacesItsRawRowInsteadOfAddingOne()
    {
        await using var fixture = await Fixture.CreateAsync();
        var contributor = fixture.CreateContributor();

        await contributor.DispatchAsync(VideoRequest("run-1", contributor.Describe().Claims, Frame(0, ("actions", "Kissing", 0.5))));
        fixture.Context.ChangeTracker.Clear();
        await contributor.DispatchAsync(VideoRequest("run-1", contributor.Describe().Claims, Frame(0, ("actions", "Kissing", 0.6))));
        fixture.Context.ChangeTracker.Clear();

        Assert.Single(await fixture.Context.Set<SegmentStudioAnalysisRun>().ToListAsync());
        var raw = Assert.Single(await fixture.Context.Set<SegmentStudioAiRawResult>().ToListAsync());
        Assert.Equal("""{"tags":{"actions":{"Kissing":[[0,0.6]]}}}""", raw.PayloadJson);
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private static AiDispatchRequest VideoRequest(
        string runId, IReadOnlyList<AiCapabilityClaim> claims, params AiTemporalSlice[] frames)
        => new(
            new AiRunContext(runId, AiMediaKinds.Video, "/media/example.mp4", "/media/example.mp4",
                "video", Fixture.VideoId, 10.0, 1.0),
            claims,
            new AiAnalyzeResult
            {
                MediaKind = AiMediaKinds.Video,
                DurationSeconds = 10.0,
                FrameIntervalSeconds = 1.0,
                Models =
                [
                    new AiModelDescriptor("tagger_v2", "Tagger", "tagging", ["tagging"], ["frame"],
                        ["actions", "bodyparts"], "2.1", Active: true, Loaded: true),
                ],
                Frames = frames,
            });

    private static AiTaggingCandidate Candidate(string key, string tag, double start, double end)
        => new(key, "tag", tag, tag, start, end, 0.9, "model", 2);

    private static AiTaggingCandidate Candidate(
        string key, string tag, double start, double end, string modelKey, double? confidence)
        => new(key, "tag", tag, tag, start, end, confidence, modelKey, 2);

    private static AiTemporalSlice Frame(double time, params (string Model, string Tag, double? Confidence)[] tags)
        => new(
            SliceKind: "frame",
            Index: (int)time,
            TimeSeconds: time,
            StartSeconds: null,
            EndSeconds: null,
            Analysis: new AiAnalysisNode
            {
                Tags = tags.Select(tag => new AiTagPrediction(tag.Model, tag.Tag, tag.Confidence)).ToArray(),
            });

    private sealed class TransactionProbe(IAiTaggingProjectionService inner) : IAiTaggingProjectionService
    {
        public bool SawTransaction { get; private set; }

        public Task<AiTaggingProjectionResult> ProjectAsync(
            DbContext db, AiTaggingProjectionRequest request, CancellationToken ct)
        {
            SawTransaction = db.Database.CurrentTransaction is not null;
            return inner.ProjectAsync(db, request, ct);
        }
    }

    private sealed class Fixture(
        SqliteConnection connection,
        ProjectionDbContext context,
        ServiceProvider services,
        TransactionProbe? probe) : IAsyncDisposable
    {
        public const int VideoId = 7;
        public const int VideoFileId = 10;
        public const string Fingerprint = "sha256:source";

        public ProjectionDbContext Context { get; } = context;

        public TransactionProbe? Probe { get; } = probe;

        public static async Task<Fixture> CreateAsync(bool probe = false)
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new ProjectionDbContext(new DbContextOptionsBuilder<ProjectionDbContext>()
                .UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();
            context.Add(new Video { Id = VideoId });
            context.Add(new VideoFile { Id = VideoFileId, VideoId = VideoId, Path = "/media/example.mp4" });
            await context.SaveChangesAsync();

            // The contributor opens its own scope per dispatch, so it needs a
            // container that resolves the same context the assertions read from.
            var projection = new AiTaggingProjectionService(
                new TestTagRepository(context),
                new SegmentSourceRegistry(),
                new ProvenanceActivityService(),
                new LineageNodeService(),
                new SegmentProvenanceService());
            var transactionProbe = probe ? new TransactionProbe(projection) : null;
            var services = new ServiceCollection();
            services.AddSingleton<DbContext>(context);
            services.AddSingleton<IAiTaggingProjectionService>(
                transactionProbe is null ? projection : transactionProbe);
            return new Fixture(connection, context, services.BuildServiceProvider(), transactionProbe);
        }

        public async Task<AiTaggingProjectionResult> ProjectAsync(AiTaggingProjectionRequest request)
        {
            var result = await services.GetRequiredService<IAiTaggingProjectionService>().ProjectAsync(
                Context, request, CancellationToken.None);
            Context.ChangeTracker.Clear();
            return result;
        }

        public async Task<AiTaggingProjectionResult> ProjectAsync(
            Guid runId, params AiTaggingCandidate[] candidates)
        {
            var result = await services.GetRequiredService<IAiTaggingProjectionService>().ProjectAsync(
                Context,
                new AiTaggingProjectionRequest(VideoId, VideoFileId, runId, Fingerprint, candidates),
                CancellationToken.None);
            Context.ChangeTracker.Clear();
            return result;
        }

        public async Task<int> AddTagAsync(string name)
        {
            var tag = new Tag { Name = name, SortName = name };
            Context.Add(tag);
            await Context.SaveChangesAsync();
            Context.ChangeTracker.Clear();
            return tag.Id;
        }

        /// <summary>A native Cove segment of the video, as a completed review publishes it.</summary>
        public async Task AddPublishedAsync(int tagId, double start, double? end)
        {
            Context.Add(new Segment
            {
                HostType = SegmentHostType.Video,
                HostId = VideoId,
                StartSec = start,
                EndSec = end,
                TagId = tagId,
                Kind = "tag",
                SourceKey = "segment-studio/user",
            });
            await Context.SaveChangesAsync();
            Context.ChangeTracker.Clear();
        }

        /// <summary>AI Core's journal entry for a run, which it writes before analysis.</summary>
        public async Task AddAiRunAsync(string runKey, string requestJson)
        {
            Context.Add(new AiRun
            {
                RunKey = runKey,
                SourceKey = "ext:ai.core",
                TargetType = AiRunTargetType.Video,
                TargetId = VideoId,
                Request = JsonDocument.Parse(requestJson),
            });
            await Context.SaveChangesAsync();
            Context.ChangeTracker.Clear();
        }

        public SegmentStudioAiContributor CreateContributor()
            => new(services.GetRequiredService<IServiceScopeFactory>(),
                NullLogger<SegmentStudioAiContributor>.Instance);

        public async ValueTask DisposeAsync()
        {
            await services.DisposeAsync();
            await Context.DisposeAsync();
            await connection.DisposeAsync();
        }
    }

    internal sealed class TestTagRepository(DbContext db) : ITagRepository
    {
        public async Task<Dictionary<string, Tag>> FindOrCreateByNamesAsync(
            IReadOnlyList<string> names, CancellationToken ct = default)
        {
            var byName = (await db.Set<Tag>().ToListAsync(ct))
                .ToDictionary(tag => tag.Name, StringComparer.OrdinalIgnoreCase);
            foreach (var name in names.Where(name => !string.IsNullOrWhiteSpace(name))
                         .Select(name => name.Trim())
                         .Distinct(StringComparer.OrdinalIgnoreCase))
            {
                if (byName.ContainsKey(name)) continue;
                var tag = new Tag { Name = name, SortName = name };
                db.Add(tag);
                byName[name] = tag;
            }
            await db.SaveChangesAsync(ct);
            return byName;
        }

        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default)
            => db.Set<Tag>().FindAsync([id], ct).AsTask();
        public Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken ct = default)
            => Task.FromResult<IReadOnlyList<Tag>>(db.Set<Tag>().ToList());
        public Task<Tag> AddAsync(Tag entity, CancellationToken ct = default)
            => throw new NotSupportedException();
        public Task UpdateAsync(Tag entity, CancellationToken ct = default)
            => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default)
            => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default)
            => db.Set<Tag>().CountAsync(ct);
        public Task<(IReadOnlyList<Tag> Items, int TotalCount)> FindAsync(
            TagFilter? filter, FindFilter? findFilter, CancellationToken ct = default)
            => throw new NotSupportedException();
        public Task<Tag?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default)
            => GetByIdAsync(id, ct);
        public Task<Tag?> GetByNameAsync(string name, CancellationToken ct = default)
            => db.Set<Tag>().FirstOrDefaultAsync(tag => tag.Name == name, ct);
        public async Task<IReadOnlyList<Tag>> FindByNamesAsync(
            IReadOnlyList<string> names, CancellationToken ct = default)
        {
            var normalized = names.Select(name => name.ToLowerInvariant()).ToArray();
            return await db.Set<Tag>().Where(tag => normalized.Contains(tag.Name.ToLower())).ToListAsync(ct);
        }
    }

    private sealed class ProjectionDbContext(DbContextOptions<ProjectionDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<BaseFileEntity>().HasKey(file => file.Id);
            modelBuilder.Entity<BaseFileEntity>().HasDiscriminator<string>("FileType")
                .HasValue<BaseFileEntity>("Base")
                .HasValue<VideoFile>("Video");
            modelBuilder.Entity<BaseFileEntity>().Ignore(file => file.ParentFolder);
            modelBuilder.Entity<BaseFileEntity>().Ignore(file => file.Fingerprints);
            modelBuilder.Entity<VideoFile>().Ignore(file => file.Video);
            modelBuilder.Entity<VideoFile>().Ignore(file => file.Captions);
            modelBuilder.Entity<Video>(builder =>
            {
                builder.HasKey(video => video.Id);
                builder.Ignore(video => video.Studio);
                builder.Ignore(video => video.ParentVideo);
                builder.Ignore(video => video.ChildVideos);
                builder.Ignore(video => video.Urls);
                builder.Ignore(video => video.Files);
                builder.Ignore(video => video.VideoTags);
                builder.Ignore(video => video.VideoPerformers);
                builder.Ignore(video => video.VideoGalleries);
                builder.Ignore(video => video.GroupItems);
                builder.Ignore(video => video.RemoteIds);
                builder.Ignore(video => video.PlayHistory);
            });
            modelBuilder.Entity<Tag>(builder =>
            {
                builder.HasKey(tag => tag.Id);
                builder.Ignore(tag => tag.Aliases);
                builder.Ignore(tag => tag.ParentRelations);
                builder.Ignore(tag => tag.ChildRelations);
                builder.Ignore(tag => tag.RemoteIds);
                builder.Ignore(tag => tag.TagGroup);
                builder.Ignore(tag => tag.VideoTags);
                builder.Ignore(tag => tag.PerformerTags);
                builder.Ignore(tag => tag.ImageTags);
                builder.Ignore(tag => tag.GalleryTags);
                builder.Ignore(tag => tag.StudioTags);
                builder.Ignore(tag => tag.GroupTags);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Ignore(segment => segment.Payload);
            });
            modelBuilder.Entity<SegmentStudioAnalysisRun>().HasKey(run => run.Id);
            modelBuilder.Entity<SegmentStudioAiRawResult>().HasKey(result => result.RunId);
            modelBuilder.Entity<AiRun>(builder =>
            {
                builder.HasKey(run => run.Id);
                builder.Property(run => run.Request).HasConversion(
                    document => document == null ? null : document.RootElement.GetRawText(),
                    text => text == null ? null : JsonDocument.Parse(text, default));
                builder.Ignore(run => run.Models);
                builder.Ignore(run => run.Summary);
            });
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().HasKey(candidate => candidate.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().Ignore(candidate => candidate.Run);
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasIndex(node => node.ItemId).IsUnique();
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
        }
    }
}
