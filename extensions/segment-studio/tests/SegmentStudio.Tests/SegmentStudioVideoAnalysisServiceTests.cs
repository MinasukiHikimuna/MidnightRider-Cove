namespace SegmentStudio.Tests;

using System.Net;
using System.Text.Json;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Npgsql;

public sealed class SegmentStudioVideoAnalysisServiceTests
{
    [Fact]
    public void PersistenceTransactionIsWrappedInExecutionStrategy()
    {
        var source = File.ReadAllText(Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "..", "..",
            "src", "SegmentStudio", "SegmentStudioVideoAnalysisService.cs"));

        var strategy = source.IndexOf("db.Database.CreateExecutionStrategy()", StringComparison.Ordinal);
        var execute = source.IndexOf("strategy.ExecuteAsync", strategy, StringComparison.Ordinal);
        var transaction = source.IndexOf("BeginTransactionAsync", execute, StringComparison.Ordinal);

        Assert.True(strategy >= 0);
        Assert.True(execute > strategy);
        Assert.True(transaction > execute);
    }

    [Fact]
    public void FullAnalysisDoesNotIncludeLegacyProvenanceRepair()
    {
        var sourceRoot = Path.Combine(
            AppContext.BaseDirectory, "..", "..", "..", "..", "..",
            "src", "SegmentStudio");
        var analysis = File.ReadAllText(Path.Combine(
            sourceRoot, "SegmentStudioVideoAnalysisService.cs"));
        var provenance = File.ReadAllText(Path.Combine(
            sourceRoot, "SegmentStudioAnalysisProvenanceService.cs"));

        Assert.DoesNotContain("ext:segment-studio.analysis", analysis);
        Assert.DoesNotContain("ext:segment-studio.analysis", provenance);
        Assert.DoesNotContain("SupersedeLegacySourceAsync", provenance);
    }

    [Fact]
    public async Task ChildVideoUsesItsParentVideoFile()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new Video { Id = 8, ParentVideoId = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        await db.SaveChangesAsync();
        var client = new FakeClient(Response() with { Ai = null, OmniShotCut = null });
        var service = CreateService(client, db);

        var run = await service.CreateRunAsync(
            db, 8, new([SegmentStudioAnalysisKind.AiTagging]), default);
        await service.ExecuteRunAsync(
            db, run.Id, new([SegmentStudioAnalysisKind.AiTagging]), default);

        Assert.Equal(10, run.VideoFileId);
        Assert.Equal("/mnt/media/source.mp4", client.Request!.SourcePath);
    }

    [Fact]
    public async Task ExecuteRunStoresCandidatesDraftsAndOmniShotCutBoundaries()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var client = new FakeClient(Response());
        var service = CreateService(client, db);

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var savedRun = await db.Set<SegmentStudioAnalysisRun>().SingleAsync();
        Assert.Equal("completed", savedRun.Status);
        Assert.Equal("/mnt/media/source.mp4", client.Request!.SourcePath);
        Assert.NotNull(Assert.Single(
            await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync()).ItemId);
        var draft = Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("unreviewed", draft.ReviewState);
        Assert.Equal(20, draft.TagId);
        Assert.Equal("ext:ai.tagging", draft.SourceKey);
        Assert.Equal("Cove AI Tagging",
            Assert.Single(await db.Set<SegmentStudioSource>().ToListAsync()).DisplayName);
        var activity = Assert.Single(await db.Set<SegmentStudioProvenanceActivity>().ToListAsync());
        Assert.Equal("ai-analysis", activity.Kind);
        var assertion = Assert.Single(await db.Set<SegmentStudioSegmentProvenance>().ToListAsync());
        Assert.Equal("Example tag", assertion.ModelKey);
        Assert.Equal("1", assertion.ModelIdentifier);
        Assert.Equal("1", assertion.ModelVersion);
        Assert.Equal(0.8f, assertion.Confidence);
        Assert.Contains("observationCount", assertion.MetadataJson);
        Assert.Equal(2, await db.Set<SegmentStudioShotBoundary>().CountAsync());
        Assert.All(await db.Set<SegmentStudioShotBoundary>().ToListAsync(),
            boundary => Assert.Equal("omnishotcut", boundary.Source));
    }

    [Fact]
    public async Task FullRunCreatesMissingModelTagsAndRecordsTheirSourceIdentity()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()), db);

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var tag = Assert.Single(await db.Set<Tag>().ToListAsync());
        Assert.Equal("Example tag", tag.Name);
        var candidate = Assert.Single(
            await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Equal(tag.Id, candidate.SourceTagId);
        Assert.Equal(tag.Id,
            Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync()).TagId);
    }

    [Fact]
    public async Task FullRunLeavesAmbiguousCaseInsensitiveModelTagsUnresolved()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example Tag" });
        db.Add(new Tag { Id = 21, Name = "EXAMPLE TAG" });
        await db.SaveChangesAsync();
        var response = Response() with
        {
            Ai = Response().Ai! with
            {
                Segments = [new(
                    "candidate-1", "tag", "example tag", "Example", 1, 4,
                    .8, "Example tag", 2)],
            },
        };
        var service = CreateService(new FakeClient(response), db);

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var candidate = Assert.Single(
            await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Null(candidate.SourceTagId);
        Assert.Null(candidate.ItemId);
        Assert.Empty(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("completed", (await db.Set<SegmentStudioAnalysisRun>()
            .SingleAsync()).Status);
    }

    [Fact]
    public async Task FullRunPreservesExactIdentityForCaseVariantModelTags()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example Tag" });
        db.Add(new Tag { Id = 21, Name = "example tag" });
        await db.SaveChangesAsync();
        var response = Response() with
        {
            Ai = Response().Ai! with
            {
                Segments =
                [
                    new("candidate-1", "tag", "Example Tag", "First", 1, 4,
                        .8, "Example tag", 2),
                    new("candidate-2", "tag", "example tag", "Second", 5, 8,
                        .7, "Example tag", 2),
                ],
            },
        };
        var service = CreateService(new FakeClient(response), db);

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var candidates = await db.Set<SegmentStudioAnalysisCandidate>()
            .OrderBy(candidate => candidate.CandidateKey)
            .ToListAsync();
        Assert.Equal([20, 21], candidates.Select(candidate => candidate.SourceTagId));
        Assert.Equal(
            [20, 21],
            (await db.Set<SegmentStudioItem>().OrderBy(item => item.StartSec)
                .ToListAsync()).Select(item => item.TagId));
    }

    [Fact]
    public async Task FailedFullRunRollsBackTagsCreatedForModelLabels()
    {
        await using var connection = new SqliteConnection("Data Source=:memory:");
        await connection.OpenAsync();
        await using var db = new AnalysisDbContext(
            new DbContextOptionsBuilder<AnalysisDbContext>()
                .UseSqlite(connection)
                .Options);
        await db.Database.EnsureCreatedAsync();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile
        {
            Id = 10,
            VideoId = 7,
            Path = "/mnt/media/source.mp4",
        });
        var originalBoundaryCreatedAt = DateTime.UtcNow;
        db.Add(new SegmentStudioShotBoundary
        {
            VideoId = 7,
            StartSec = 0,
            EndSec = 10,
            Source = "pyscenedetect",
            Revision = 1,
            CreatedAt = originalBoundaryCreatedAt,
            UpdatedAt = originalBoundaryCreatedAt,
        });
        await db.SaveChangesAsync();
        var originalBoundaryId = await db.Set<SegmentStudioShotBoundary>()
            .Select(boundary => boundary.Id)
            .SingleAsync();
        var service = CreateService(
            new FakeClient(Response()),
            db,
            new ThrowingProvenanceService());
        var request = new StartSegmentStudioAnalysisRequest(
            ReplaceShotBoundaries: true,
            ExpectedShotBoundaryFingerprint: $"{originalBoundaryId}:1");
        var run = await service.CreateRunAsync(db, 7, request, default);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.ExecuteRunAsync(db, run.Id, request, default));

        db.ChangeTracker.Clear();
        Assert.Empty(await db.Set<Tag>().ToListAsync());
        Assert.Empty(await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Empty(await db.Set<SegmentStudioItem>().ToListAsync());
        var originalBoundary = Assert.Single(
            await db.Set<SegmentStudioShotBoundary>().ToListAsync());
        Assert.Equal("pyscenedetect", originalBoundary.Source);
        Assert.Equal(originalBoundaryCreatedAt, originalBoundary.CreatedAt);
        Assert.Equal("failed", (await db.Set<SegmentStudioAnalysisRun>()
            .SingleAsync()).Status);
    }

    [Fact]
    public async Task BasicRunCreatesIdempotentNativeSegmentsWithoutReviewOrShots()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile {
            Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4",
        });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var client = new FakeClient(Response());
        var service = CreateService(client, db);

        var first = await service.CreateRunAsync(
            db, 7, new(), SegmentStudioModes.Basic, default);
        await service.ExecuteRunAsync(
            db, first.Id, new(), SegmentStudioModes.Basic, default);
        var second = await service.CreateRunAsync(
            db, 7, new(), SegmentStudioModes.Basic, default);
        await service.ExecuteRunAsync(
            db, second.Id, new(), SegmentStudioModes.Basic, default);
        await service.ExecuteRunAsync(
            db, second.Id, new(), SegmentStudioModes.Basic, default);

        Assert.Equal(
            [SegmentStudioAnalysisKind.AiTagging],
            client.Request!.Analyses);
        var native = Assert.Single(await db.Set<Segment>().ToListAsync());
        Assert.Equal(7, native.HostId);
        Assert.Equal(20, native.TagId);
        Assert.Equal("ext:ai.tagging", native.SourceKey);
        Assert.Equal(second.Id.ToString(), native.SourceRunId);
        var fieldEvidence = await db.Set<FieldProvenance>()
            .Where(row =>
                row.HostType == AffinityHostType.Segment
                && row.HostId == native.Id)
            .ToListAsync();
        Assert.Equal(10, fieldEvidence.Count);
        Assert.All(
            fieldEvidence,
            row => Assert.Equal("model", row.ModelKey));
        Assert.Equal(
            new[] { first.Id.ToString(), second.Id.ToString() }
                .Order()
                .ToArray(),
            fieldEvidence
                .Select(row => row.SourceRunId)
                .Distinct()
                .Order()
                .ToArray());
        Assert.Empty(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty(await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync());
        Assert.Empty(await db.Set<SegmentStudioShotBoundary>().ToListAsync());
    }

    [Fact]
    public void BasicAnalysisRejectsShotBoundaryRequests()
    {
        var exception = Assert.Throws<ArgumentException>(() =>
            SegmentStudioVideoAnalysisService.NormalizeAnalyses(
                [SegmentStudioAnalysisKind.OmniShotCut],
                SegmentStudioModes.Basic));

        Assert.Contains("unavailable in Basic mode", exception.Message);
    }

    [Fact]
    public async Task RepeatedRunReusesMatchingDraftsAndPreservesExistingBoundaries()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()), db);

        var first = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, first.Id, new(), default);
        var boundaryIds = await db.Set<SegmentStudioShotBoundary>()
            .OrderBy(boundary => boundary.Id)
            .Select(boundary => boundary.Id)
            .ToArrayAsync();

        var second = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, second.Id, new(), default);

        Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        var candidates = await db.Set<SegmentStudioAnalysisCandidate>()
            .OrderBy(candidate => candidate.CreatedAt)
            .ToListAsync();
        Assert.Equal(2, candidates.Count);
        Assert.Equal(candidates[0].ItemId, candidates[1].ItemId);
        Assert.Equal(boundaryIds, await db.Set<SegmentStudioShotBoundary>()
            .OrderBy(boundary => boundary.Id)
            .Select(boundary => boundary.Id)
            .ToArrayAsync());
    }

    [Fact]
    public async Task ConfirmedRunReplacesExistingShotBoundaries()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new SegmentStudioShotBoundary
        {
            VideoId = 7, StartSec = 0, EndSec = 10, Source = "pyscenedetect",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync();
        var originalId = await db.Set<SegmentStudioShotBoundary>()
            .Select(boundary => boundary.Id)
            .SingleAsync();
        var service = CreateService(new FakeClient(Response()), db);
        var request = new StartSegmentStudioAnalysisRequest(
            [SegmentStudioAnalysisKind.OmniShotCut],
            ReplaceShotBoundaries: true,
            ExpectedShotBoundaryFingerprint: $"{originalId}:1");

        var run = await service.CreateRunAsync(db, 7, request, default);
        await service.ExecuteRunAsync(db, run.Id, request, default);

        var boundaries = await db.Set<SegmentStudioShotBoundary>()
            .OrderBy(boundary => boundary.StartSec)
            .ToListAsync();
        Assert.Equal(2, boundaries.Count);
        Assert.DoesNotContain(boundaries, boundary => boundary.Id == originalId);
        Assert.All(boundaries, boundary => Assert.Equal("omnishotcut", boundary.Source));
        Assert.Equal([0d, 5d], boundaries.Select(boundary => boundary.StartSec));
        Assert.Equal([5d, 10d], boundaries.Select(boundary => boundary.EndSec));
    }

    [Fact]
    public async Task ConfirmedRunPreservesBoundariesChangedWhileAnalysisWasRunning()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new SegmentStudioShotBoundary
        {
            VideoId = 7, StartSec = 0, EndSec = 10, Source = "pyscenedetect",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync();
        var boundary = await db.Set<SegmentStudioShotBoundary>().SingleAsync();
        var request = new StartSegmentStudioAnalysisRequest(
            [SegmentStudioAnalysisKind.OmniShotCut],
            ReplaceShotBoundaries: true,
            ExpectedShotBoundaryFingerprint: $"{boundary.Id}:1");
        var service = CreateService(new FakeClient(Response()), db);
        var run = await service.CreateRunAsync(db, 7, request, default);
        boundary.Revision = 2;
        boundary.UpdatedAt = now.AddSeconds(1);
        await db.SaveChangesAsync();

        var exception = await Assert.ThrowsAsync<SegmentStudioAnalysisPersistenceException>(
            () => service.ExecuteRunAsync(db, run.Id, request, default));

        Assert.Equal("shot_boundaries_changed", exception.Code);
        db.ChangeTracker.Clear();
        var preserved = Assert.Single(
            await db.Set<SegmentStudioShotBoundary>().ToListAsync());
        Assert.Equal(2, preserved.Revision);
        var savedRun = await db.Set<SegmentStudioAnalysisRun>().SingleAsync();
        Assert.Equal("failed", savedRun.Status);
        Assert.Equal("shot_boundaries_changed", savedRun.ErrorCode);
    }

    [Fact]
    public async Task PostgreSqlReplacementRejectsEditCommittedAfterConfirmation()
    {
        var connectionString = Environment.GetEnvironmentVariable(
                "COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_analysis_replace_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString)
        {
            SearchPath = schema,
        };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema = new NpgsqlCommand(
                         $"CREATE SCHEMA \"{schema}\"", admin))
            await createSchema.ExecuteNonQueryAsync();

        try
        {
            var options = new DbContextOptionsBuilder<AnalysisDbContext>()
                .UseNpgsql(builder.ConnectionString)
                .Options;
            long boundaryId;
            await using (var setup = new AnalysisDbContext(options))
            {
                await setup.Database.ExecuteSqlRawAsync(
                    setup.Database.GenerateCreateScript());
                var now = DateTime.UtcNow;
                setup.Add(new Video { Id = 7 });
                setup.Add(new VideoFile
                {
                    Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4",
                });
                var boundary = new SegmentStudioShotBoundary
                {
                    VideoId = 7,
                    StartSec = 0,
                    EndSec = 10,
                    Source = "pyscenedetect",
                    Revision = 1,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                setup.Add(boundary);
                await setup.SaveChangesAsync();
                boundaryId = boundary.Id;
            }

            var request = new StartSegmentStudioAnalysisRequest(
                [SegmentStudioAnalysisKind.OmniShotCut],
                ReplaceShotBoundaries: true,
                ExpectedShotBoundaryFingerprint: $"{boundaryId}:1");
            Guid runId;
            await using (var analysisContext = new AnalysisDbContext(options))
            {
                var service = CreateService(
                    new FakeClient(Response()), analysisContext);
                var run = await service.CreateRunAsync(
                    analysisContext, 7, request, default);
                runId = run.Id;
            }
            await using (var writer = new AnalysisDbContext(options))
            {
                var boundary = await writer.Set<SegmentStudioShotBoundary>()
                    .SingleAsync();
                boundary.Revision = 2;
                boundary.UpdatedAt = DateTime.UtcNow.AddSeconds(1);
                await writer.SaveChangesAsync();
            }
            await using (var analysisContext = new AnalysisDbContext(options))
            {
                var service = CreateService(
                    new FakeClient(Response()), analysisContext);
                var exception = await Assert.ThrowsAsync<SegmentStudioAnalysisPersistenceException>(
                    () => service.ExecuteRunAsync(
                        analysisContext, runId, request, default));
                Assert.Equal("shot_boundaries_changed", exception.Code);
            }
            await using (var verify = new AnalysisDbContext(options))
            {
                var preserved = Assert.Single(
                    await verify.Set<SegmentStudioShotBoundary>().ToListAsync());
                Assert.Equal(2, preserved.Revision);
                var savedRun = await verify.Set<SegmentStudioAnalysisRun>()
                    .SingleAsync();
                Assert.Equal("failed", savedRun.Status);
                Assert.Equal("shot_boundaries_changed", savedRun.ErrorCode);
            }
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand(
                $"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    [Fact]
    public async Task ConfirmedRunPreservesExistingBoundariesWhenResultCoverageIsInvalid()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new SegmentStudioShotBoundary
        {
            VideoId = 7, StartSec = 0, EndSec = 10, Source = "pyscenedetect",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync();
        var boundaryId = await db.Set<SegmentStudioShotBoundary>()
            .Select(boundary => boundary.Id)
            .SingleAsync();
        var invalid = Response() with
        {
            OmniShotCut = Response().OmniShotCut! with
            {
                Boundaries = [new(0, 9, null)],
            },
        };
        var request = new StartSegmentStudioAnalysisRequest(
            [SegmentStudioAnalysisKind.OmniShotCut],
            ReplaceShotBoundaries: true,
            ExpectedShotBoundaryFingerprint: $"{boundaryId}:1");
        var service = CreateService(new FakeClient(invalid), db);
        var run = await service.CreateRunAsync(db, 7, request, default);

        var exception = await Assert.ThrowsAsync<SegmentStudioAnalysisPersistenceException>(
            () => service.ExecuteRunAsync(db, run.Id, request, default));

        Assert.Equal("invalid_shot_boundaries", exception.Code);
        db.ChangeTracker.Clear();
        Assert.Equal(
            "pyscenedetect",
            Assert.Single(await db.Set<SegmentStudioShotBoundary>().ToListAsync()).Source);
        var savedRun = await db.Set<SegmentStudioAnalysisRun>().SingleAsync();
        Assert.Equal("failed", savedRun.Status);
        Assert.Equal("invalid_shot_boundaries", savedRun.ErrorCode);
    }

    [Fact]
    public async Task ReplacementWithoutShotBoundaryAnalysisIsRejected()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()), db);
        var request = new StartSegmentStudioAnalysisRequest(
            [SegmentStudioAnalysisKind.AiTagging],
            ReplaceShotBoundaries: true);

        var exception = await Assert.ThrowsAsync<ArgumentException>(
            () => service.CreateRunAsync(db, 7, request, default));

        Assert.Contains("requires shot-boundary analysis", exception.Message);
    }

    [Fact]
    public async Task MatchingManualDraftIsReusedWithoutChangingItsSource()
    {
        await using var db = CreateContext();
        var now = DateTime.UtcNow;
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        db.Add(new Tag { Id = 20, Name = "Example tag" });
        db.Add(new SegmentStudioItem
        {
            VideoId = 7, TagId = 20, StartSec = 1, EndSec = 4, Kind = "tag",
            Title = "Example", ReviewState = "approved", SourceKey = "user",
            Revision = 1, CreatedAt = now, UpdatedAt = now,
        });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(Response()), db);

        var run = await service.CreateRunAsync(db, 7, new(), default);
        await service.ExecuteRunAsync(db, run.Id, new(), default);

        var item = Assert.Single(await db.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("user", item.SourceKey);
        Assert.Equal("approved", item.ReviewState);
        Assert.Equal(item.Id,
            Assert.Single(await db.Set<SegmentStudioAnalysisCandidate>().ToListAsync()).ItemId);
    }

    [Fact]
    public async Task ExecuteRunStoresSanitizedFailure()
    {
        await using var db = CreateContext();
        db.Add(new Video { Id = 7 });
        db.Add(new VideoFile { Id = 10, VideoId = 7, Path = "/mnt/media/source.mp4" });
        await db.SaveChangesAsync();
        var service = CreateService(new FakeClient(
            new SegmentStudioAnalysisServiceException(
                HttpStatusCode.ServiceUnavailable, "gpu_busy", "Analysis service is busy.", true)), db);
        var run = await service.CreateRunAsync(
            db, 7, new([SegmentStudioAnalysisKind.OmniShotCut]), default);

        await Assert.ThrowsAsync<SegmentStudioAnalysisServiceException>(
            () => service.ExecuteRunAsync(
                db, run.Id, new([SegmentStudioAnalysisKind.OmniShotCut]), default));

        var savedRun = await db.Set<SegmentStudioAnalysisRun>().SingleAsync();
        Assert.Equal("failed", savedRun.Status);
        Assert.Equal("gpu_busy", savedRun.ErrorCode);
        Assert.Equal("Analysis service is busy.", savedRun.ErrorMessage);
    }

    private static AnalysisDbContext CreateContext() => new(
        new DbContextOptionsBuilder<AnalysisDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    private static SegmentStudioVideoAnalysisService CreateService(
        ISegmentStudioAnalysisClient client,
        AnalysisDbContext db,
        ISegmentStudioAnalysisProvenanceService? provenance = null) => new(
        client,
        new TestTagRepository(db),
        provenance ?? new SegmentStudioAnalysisProvenanceService(
                new SegmentSourceRegistry(),
                new ProvenanceActivityService(),
                new LineageNodeService(),
                new SegmentProvenanceService()),
        NullLogger<SegmentStudioVideoAnalysisService>.Instance);

    private sealed class ThrowingProvenanceService
        : ISegmentStudioAnalysisProvenanceService
    {
        public Task<int> ProjectAsync(
            DbContext db,
            SegmentStudioAnalysisRun run,
            SegmentStudioAnalyzeVideoRequest request,
            SegmentStudioAnalyzeVideoResponse response,
            IReadOnlyList<SegmentStudioAnalysisCandidate> candidates,
            CancellationToken ct) => throw new InvalidOperationException(
                "Synthetic provenance failure after tag creation.");
    }

    private sealed class TestTagRepository(AnalysisDbContext db) : ITagRepository
    {
        private AnalysisDbContext Context => db;

        public async Task<Dictionary<string, Tag>> FindOrCreateByNamesAsync(
            IReadOnlyList<string> names,
            CancellationToken ct = default)
        {
            var normalized = names.Where(name => !string.IsNullOrWhiteSpace(name))
                .Select(name => name.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray();
            var existing = await Context.Set<Tag>().ToListAsync(ct);
            var byName = existing.ToDictionary(
                tag => tag.Name,
                StringComparer.OrdinalIgnoreCase);
            foreach (var name in normalized)
            {
                if (byName.ContainsKey(name)) continue;
                var tag = new Tag { Name = name, SortName = name };
                Context.Add(tag);
                byName[name] = tag;
            }
            await Context.SaveChangesAsync(ct);
            return byName;
        }

        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default) =>
            Context.Set<Tag>().FindAsync([id], ct).AsTask();
        public Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<Tag>>(Context.Set<Tag>().ToList());
        public Task<Tag> AddAsync(Tag entity, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task UpdateAsync(Tag entity, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) =>
            Context.Set<Tag>().CountAsync(ct);
        public Task<(IReadOnlyList<Tag> Items, int TotalCount)> FindAsync(
            TagFilter? filter,
            FindFilter? findFilter,
            CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByIdWithRelationsAsync(
            int id,
            CancellationToken ct = default) => GetByIdAsync(id, ct);
        public Task<Tag?> GetByNameAsync(
            string name,
            CancellationToken ct = default) => Context.Set<Tag>()
                .FirstOrDefaultAsync(tag => tag.Name == name, ct);
        public async Task<IReadOnlyList<Tag>> FindByNamesAsync(
            IReadOnlyList<string> names,
            CancellationToken ct = default)
        {
            var normalized = names.Select(name => name.ToLowerInvariant())
                .ToArray();
            return await Context.Set<Tag>()
                .Where(tag => normalized.Contains(tag.Name.ToLower()))
                .ToListAsync(ct);
        }
    }

    private static SegmentStudioAnalyzeVideoResponse Response() => new(
        "1",
        Guid.NewGuid(),
        Guid.NewGuid(),
        "0.1.0",
        "completed",
        new("fingerprint", 100, 200, 10, 25, 1280, 720, 250),
        new("cache", "v1", null, null),
        new(
            [new("model", "Model", 1, JsonDocument.Parse("\"1\"").RootElement, ["Example tag"])],
            2,
            [new("candidate-1", "tag", "Example tag", "Example", 1, 4, .8, "Example tag", 2)]),
        new(
            "revision",
            "clean_shot",
            [new(0, 5, "cut"), new(5, 10, null)],
            new Dictionary<string, IReadOnlyDictionary<string, int>>()),
        new(1, 2, 3, 4, 10),
        []);

    private sealed class FakeClient : ISegmentStudioAnalysisClient
    {
        private readonly SegmentStudioAnalyzeVideoResponse? _response;
        private readonly Exception? _exception;

        public FakeClient(SegmentStudioAnalyzeVideoResponse response) => _response = response;
        public FakeClient(Exception exception) => _exception = exception;
        public SegmentStudioAnalyzeVideoRequest? Request { get; private set; }

        public Task<SegmentStudioAnalysisReadyResponse> ReadyAsync(CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<IReadOnlyList<SegmentStudioAnalysisCatalogModel>> GetCatalogAsync(CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
            SegmentStudioAnalyzeVideoRequest request, CancellationToken ct = default)
        {
            Request = request;
            return _exception is not null
                ? Task.FromException<SegmentStudioAnalyzeVideoResponse>(_exception)
                : Task.FromResult(_response!);
        }
    }

    private sealed class AnalysisDbContext(DbContextOptions<AnalysisDbContext> options) : DbContext(options)
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
                builder.Property(segment => segment.Payload).HasConversion(
                    document => document == null
                        ? null
                        : document.RootElement.GetRawText(),
                    json => json == null
                        ? null
                        : JsonDocument.Parse(json));
            });
            modelBuilder.Entity<FieldProvenance>()
                .HasKey(row => row.Id);
            modelBuilder.Entity<SegmentStudioAnalysisRun>().HasKey(run => run.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().HasKey(candidate => candidate.Id);
            modelBuilder.Entity<SegmentStudioAnalysisCandidate>().Ignore(candidate => candidate.Run);
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioShotBoundary>().HasKey(boundary => boundary.Id);
            modelBuilder.Entity<SegmentStudioSource>(builder =>
            {
                builder.HasKey(source => source.Id);
                builder.HasIndex(source => source.Key).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioProvenanceActivity>(builder =>
            {
                builder.HasKey(activity => activity.Id);
                builder.HasIndex(activity => activity.Key).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioLineageNode>(builder =>
            {
                builder.HasKey(node => node.Id);
                builder.HasIndex(node => node.ItemId).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioSegmentProvenance>(
                builder => builder.HasKey(assertion => assertion.Id));
            modelBuilder.Entity<SegmentStudioDerivationEdge>(
                builder => builder.HasKey(edge => edge.Id));
        }
    }
}
