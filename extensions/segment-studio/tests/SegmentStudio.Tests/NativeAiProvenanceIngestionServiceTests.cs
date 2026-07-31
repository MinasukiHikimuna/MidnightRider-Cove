using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class NativeAiProvenanceIngestionServiceTests
{
    [Fact]
    public async Task CompleteRunCreatesNativeItemActivityAndResolvedAssertion()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-1", """
            [
              {"name":"action-model","identifier":400,"version":"2.1","categories":["actions"]},
              {"name":"body-model","identifier":401,"version":"1.0","categories":["bodyparts"]}
            ]
            """);
        var segment = fixture.AddSegment(
            1, "run-1", 0.87f, """{"modelKey":"actions","observationCount":4}""");
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        Assert.Equal(1, result.IngestedCount);
        Assert.Empty(result.UnresolvedIssues);
        var item = Assert.Single(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal(segment.Id, item.NativeSegmentId);
        Assert.Null(item.ReviewState);
        Assert.Null(item.VideoId);
        var activity = Assert.Single(
            await fixture.Context.Set<SegmentStudioProvenanceActivity>().ToListAsync());
        Assert.Equal("run-1", activity.ExternalRunId);
        Assert.Equal("""[{"name":"action-model","identifier":400,"version":"2.1","categories":["actions"]},{"name":"body-model","identifier":401,"version":"1.0","categories":["bodyparts"]}]""",
            activity.ModelsJson);
        var assertion = Assert.Single(
            await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync());
        Assert.Equal("actions", assertion.ModelKey);
        Assert.Equal("400", assertion.ModelIdentifier);
        Assert.Equal("2.1", assertion.ModelVersion);
        Assert.Equal(0.87f, assertion.Confidence);
        Assert.Contains("observationCount", assertion.MetadataJson);
        Assert.DoesNotContain("modelKey", assertion.MetadataJson);
    }

    [Fact]
    public async Task MissingRunAndMissingModelKeyRemainValidButAreReported()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddSegment(1, "missing-run", null, """{"observationCount":2}""");
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        Assert.Equal(
            ["missing-model-key", "missing-run"],
            result.UnresolvedIssues.Select(issue => issue.Kind).Order().ToArray());
        var assertion = Assert.Single(
            await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync());
        Assert.Null(assertion.ModelKey);
        Assert.Null(assertion.ModelIdentifier);
        Assert.Null(assertion.Confidence);
        Assert.Equal("origin", assertion.Relation);
    }

    [Fact]
    public async Task RunKeyResolutionAllowsUmbrellaSourceAndValidatesTheVideoTarget()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun(
            "umbrella-run",
            """[{"identifier":450,"version":1,"categories":["actions"]}]""",
            sourceKey: "ext:ai.core");
        fixture.AddSegment(1, "umbrella-run", 0.8f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        Assert.DoesNotContain(result.UnresolvedIssues, issue => issue.Kind == "missing-run");
        Assert.Equal("450", Assert.Single(
            await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync())
            .ModelIdentifier);
    }

    [Fact]
    public async Task AmbiguousModelResolutionRetainsCandidatesWithoutFabricatingIdentity()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-2", """
            [
              {"name":"first","identifier":"model-a","version":"1","categories":["actions"]},
              {"name":"second","identifier":"model-b","version":"2","categories":["actions"]}
            ]
            """);
        fixture.AddSegment(1, "run-2", 0.5f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        Assert.Equal("ambiguous-model", Assert.Single(result.UnresolvedIssues).Kind);
        var assertion = Assert.Single(
            await fixture.Context.Set<SegmentStudioSegmentProvenance>().ToListAsync());
        Assert.Null(assertion.ModelIdentifier);
        Assert.Null(assertion.ModelVersion);
        Assert.Contains("modelCandidates", assertion.MetadataJson);
        Assert.Contains("model-a", assertion.MetadataJson);
        Assert.Contains("model-b", assertion.MetadataJson);
    }

    [Fact]
    public async Task RepeatedAndIncrementalIngestionAreIdempotentAndBounded()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-3", """[{"identifier":500,"version":1,"categories":["actions"]}]""");
        fixture.AddSegment(1, "run-3", 0.5f, """{"modelKey":"actions"}""");
        fixture.AddSegment(2, "run-3", 0.6f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();

        var first = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 1),
            CancellationToken.None);
        var second = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(AfterSegmentId: first.NextCursor, BatchSize: 1),
            CancellationToken.None);
        await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        Assert.True(first.HasMore);
        Assert.False(second.HasMore);
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioLineageNode>().CountAsync());
        Assert.Equal(2,
            await fixture.Context.Set<SegmentStudioSegmentProvenance>().CountAsync());
        Assert.Single(await fixture.Context.Set<SegmentStudioProvenanceActivity>().ToListAsync());
    }

    [Fact]
    public async Task UnanchoredIngestionAdvancesBeyondTheFirstBatch()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-page", """[{"identifier":550,"version":1,"categories":["actions"]}]""");
        var preAnchored = fixture.AddSegment(
            1, "run-page", 0.5f, """{"modelKey":"actions"}""");
        fixture.AddSegment(2, "run-page", 0.6f, """{"modelKey":"actions"}""");
        fixture.AddSegment(3, "run-page", 0.7f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();
        fixture.Context.Add(new SegmentStudioItem
        {
            NativeSegmentId = preAnchored.Id,
            RepresentationSchemaVersion = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await fixture.Context.SaveChangesAsync();

        var first = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 2, OnlyMissingProvenance: true),
            CancellationToken.None);
        var second = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(BatchSize: 2, OnlyMissingProvenance: true),
            CancellationToken.None);

        Assert.True(first.HasMore);
        Assert.False(second.HasMore);
        Assert.Equal(2, first.ProcessedCount);
        Assert.Equal(1, second.ProcessedCount);
        Assert.Equal(3, await fixture.Context.Set<SegmentStudioItem>().CountAsync());
    }

    [Fact]
    public async Task EditedNativeSegmentRefreshesNodeAndSupersedesChangedOriginEvidence()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-4", """[{"identifier":600,"version":1,"categories":["actions"]}]""");
        var segment = fixture.AddSegment(
            1, "run-4", 0.7f, """{"modelKey":"actions"}""");
        var derivedItem = new SegmentStudioItem
        {
            VideoId = 7,
            TagId = 88,
            StartSec = 2,
            EndSec = 3,
            ReviewState = "approved",
            RepresentationSchemaVersion = 1,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(derivedItem);
        await fixture.Context.SaveChangesAsync();
        var derivedNode = new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(),
            ItemId = derivedItem.Id,
            State = "active",
            LastKnownVideoId = 7,
            LastKnownTagId = 88,
            LastKnownStartSec = 2,
            LastKnownEndSec = 3,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(derivedNode);
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.IngestAsync(
            fixture.Context, new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);
        var originNode = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(node => node.ItemId != derivedItem.Id);
        fixture.Context.Add(new SegmentStudioDerivationEdge
        {
            SourceNodeId = originNode.Id,
            DerivedNodeId = derivedNode.Id,
            RuleId = Guid.NewGuid(),
            RuleVersionAtCreation = "1",
            SourceTagIdAtCreation = segment.TagId!.Value,
            DerivedTagIdAtCreation = 88,
            MetadataJson = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await fixture.Context.SaveChangesAsync();
        var originalOrigin = await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .SingleAsync(assertion => assertion.Relation == "origin");
        await new SegmentProvenanceService().AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(
                derivedNode.Id,
                originalOrigin.SourceId,
                "inherited",
                originalOrigin.ActivityId,
                originalOrigin.ModelKey,
                originalOrigin.ModelIdentifier,
                originalOrigin.ModelVersion,
                originalOrigin.Confidence,
                originalOrigin.RecordedAt,
                originalOrigin.MetadataJson),
            CancellationToken.None);

        segment.TagId = 99;
        segment.StartSec = 8;
        segment.Confidence = 0.9f;
        segment.Payload = JsonDocument.Parse(
            """{"modelKey":"actions","observationCount":5}""");
        segment.UpdatedAt = DateTime.UtcNow;
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(SegmentId: segment.Id, BatchSize: 20),
            CancellationToken.None);

        var item = await fixture.Context.Set<SegmentStudioItem>()
            .SingleAsync(candidate => candidate.NativeSegmentId == segment.Id);
        Assert.Null(item.ReviewState);
        var node = await fixture.Context.Set<SegmentStudioLineageNode>()
            .SingleAsync(candidate => candidate.ItemId == item.Id);
        Assert.Equal(99, node.LastKnownTagId);
        Assert.Equal(8, node.LastKnownStartSec);
        var assertions = await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .OrderBy(assertion => assertion.CreatedAt)
            .ToListAsync();
        Assert.Equal(4, assertions.Count);
        Assert.Equal(2, assertions.Count(assertion => assertion.SupersededAt != null));
        var active = assertions.Where(assertion => assertion.SupersededAt == null).ToList();
        Assert.Equal(2, active.Count);
        Assert.All(active, assertion => Assert.Equal(0.9f, assertion.Confidence));
        Assert.All(active, assertion =>
            Assert.Contains("\"observationCount\":5", assertion.MetadataJson));
    }

    [Fact]
    public async Task RetainedActivitySnapshotDoesNotDegradeAfterAiRunIsPurged()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-retained", """[{"identifier":650,"version":3,"categories":["actions"]}]""");
        var segment = fixture.AddSegment(
            1, "run-retained", 0.75f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.IngestAsync(
            fixture.Context, new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        fixture.Context.Remove(await fixture.Context.Set<AiRun>().SingleAsync());
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(SegmentId: segment.Id, BatchSize: 20),
            CancellationToken.None);

        var assertion = Assert.Single(await fixture.Context
            .Set<SegmentStudioSegmentProvenance>()
            .Where(candidate => candidate.SupersededAt == null)
            .ToListAsync());
        Assert.Equal("650", assertion.ModelIdentifier);
        Assert.Equal("3", assertion.ModelVersion);
    }

    [Fact]
    public async Task DeletedNativeSegmentIsNotRedirectedIntoADraft()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-5", """[{"identifier":700,"version":1,"categories":["actions"]}]""");
        var segment = fixture.AddSegment(
            1, "run-5", 0.7f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.IngestAsync(
            fixture.Context, new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        fixture.Context.Remove(segment);
        await fixture.Context.SaveChangesAsync();
        var item = await fixture.Context.Set<SegmentStudioItem>().SingleAsync();
        fixture.Context.Remove(item);
        var node = await fixture.Context.Set<SegmentStudioLineageNode>().SingleAsync();
        node.ItemId = null;
        node.State = "missing";
        node.MissingSince = DateTime.UtcNow;
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.IngestAsync(
            fixture.Context, new NativeAiIngestionRequest(BatchSize: 20),
            CancellationToken.None);

        Assert.Equal(0, result.IngestedCount);
        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Equal("missing",
            Assert.Single(await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync()).State);
    }

    private sealed class AiFixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private AiFixture(SqliteConnection connection, AiDbContext context)
        {
            _connection = connection;
            Context = context;
            Service = new NativeAiProvenanceIngestionService(
                new SegmentSourceRegistry(),
                new ProvenanceActivityService(),
                new LineageNodeService(),
                new SegmentProvenanceService());
        }

        public AiDbContext Context { get; }
        public NativeAiProvenanceIngestionService Service { get; }

        public static async Task<AiFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<AiDbContext>()
                .UseSqlite(connection)
                .Options;
            var context = new AiDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return new AiFixture(connection, context);
        }

        public void AddRun(
            string runKey,
            string models,
            string sourceKey = "ext:ai.tagging")
        {
            Context.Add(new AiRun
            {
                RunKey = runKey,
                SourceKey = sourceKey,
                TargetType = AiRunTargetType.Video,
                TargetId = 7,
                Status = AiRunStatus.Completed,
                Request = JsonDocument.Parse("""{"scope":"video"}"""),
                Models = JsonDocument.Parse(models),
                Summary = JsonDocument.Parse("""{"segments":2}"""),
                StartedAt = DateTime.UtcNow.AddMinutes(-1),
                CompletedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow.AddMinutes(-1),
                UpdatedAt = DateTime.UtcNow,
            });
        }

        public Segment AddSegment(int offset, string? runKey, float? confidence, string payload)
        {
            var segment = new Segment
            {
                HostType = SegmentHostType.Video,
                HostId = 7,
                StartSec = offset,
                EndSec = offset + 0.5,
                TagId = 10 + offset,
                Kind = "tag",
                SourceKey = "ext:ai.tagging",
                SourceRunId = runKey,
                Confidence = confidence,
                Payload = JsonDocument.Parse(payload),
                CreatedAt = DateTime.UtcNow.AddSeconds(offset),
                UpdatedAt = DateTime.UtcNow.AddSeconds(offset),
            };
            Context.Add(segment);
            return segment;
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class AiDbContext(DbContextOptions<AiDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.HasIndex(item => item.NativeSegmentId).IsUnique();
                builder.Ignore(item => item.Slots);
            });
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
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Property(segment => segment.Payload).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
            });
            modelBuilder.Entity<AiRun>(builder =>
            {
                builder.HasKey(run => run.Id);
                builder.Property(run => run.Request).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
                builder.Property(run => run.Models).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
                builder.Property(run => run.Summary).HasConversion(
                    value => value == null ? null : value.RootElement.GetRawText(),
                    value => value == null ? null : JsonDocument.Parse(value, default));
            });
        }
    }
}
