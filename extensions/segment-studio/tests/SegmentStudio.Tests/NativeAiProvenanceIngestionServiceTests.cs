using System.Text.Json;
using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Npgsql;
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
    public async Task ExplicitSegmentBatchIngestsOnlySelectedSegments()
    {
        await using var fixture = await AiFixture.CreateAsync();
        fixture.AddRun("run-selected", """[{"identifier":525,"version":1,"categories":["actions"]}]""");
        var first = fixture.AddSegment(1, "run-selected", 0.5f, """{"modelKey":"actions"}""");
        fixture.AddSegment(2, "run-selected", 0.6f, """{"modelKey":"actions"}""");
        var third = fixture.AddSegment(3, "run-selected", 0.7f, """{"modelKey":"actions"}""");
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.IngestAsync(
            fixture.Context,
            new NativeAiIngestionRequest(
                VideoId: 7,
                BatchSize: 2,
                OnlyMissingProvenance: true,
                SegmentIds: [first.Id, third.Id]),
            CancellationToken.None);

        Assert.Equal(2, result.ProcessedCount);
        Assert.False(result.HasMore);
        Assert.Equal(
            [first.Id, third.Id],
            await fixture.Context.Set<SegmentStudioItem>()
                .OrderBy(item => item.NativeSegmentId)
                .Select(item => item.NativeSegmentId!.Value)
                .ToArrayAsync());
    }

    [Fact]
    public async Task ConcurrentPostgresAnchorCreationIsAdoptedByBatchIngestion()
    {
        var connectionString = Environment.GetEnvironmentVariable(
                "COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_ai_ingestion_test_{Guid.NewGuid():N}";
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
            var options = new DbContextOptionsBuilder<AiDbContext>()
                .UseNpgsql(builder.ConnectionString)
                .Options;
            int segmentId;
            await using (var setup = new AiDbContext(options))
            {
                await setup.Database.ExecuteSqlRawAsync(
                    setup.Database.GenerateCreateScript());
                setup.Add(new AiRun
                {
                    RunKey = "concurrent-run",
                    SourceKey = "ext:ai.tagging",
                    TargetType = AiRunTargetType.Video,
                    TargetId = 7,
                    Status = AiRunStatus.Completed,
                    Models = JsonDocument.Parse(
                        """[{"identifier":530,"version":1,"categories":["actions"]}]"""),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                });
                var segment = new Segment
                {
                    HostType = SegmentHostType.Video,
                    HostId = 7,
                    StartSec = 1,
                    EndSec = 2,
                    TagId = 11,
                    Kind = "tag",
                    SourceKey = "ext:ai.tagging",
                    SourceRunId = "concurrent-run",
                    Payload = JsonDocument.Parse("""{"modelKey":"actions"}"""),
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };
                setup.Add(segment);
                await setup.SaveChangesAsync();
                segmentId = segment.Id;
            }

            await using var writer = new AiDbContext(options);
            await using var ingestionContext = new AiDbContext(options);
            await using var writerTransaction =
                await writer.Database.BeginTransactionAsync();
            writer.Add(new SegmentStudioItem
            {
                NativeSegmentId = segmentId,
                RepresentationSchemaVersion = 1,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
            await writer.SaveChangesAsync();

            var service = new NativeAiProvenanceIngestionService(
                new SegmentSourceRegistry(),
                new ProvenanceActivityService(),
                new LineageNodeService(),
                new SegmentProvenanceService());
            var ingestionTask = service.IngestAsync(
                ingestionContext,
                new NativeAiIngestionRequest(
                    VideoId: 7,
                    BatchSize: 1,
                    OnlyMissingProvenance: true,
                    SegmentIds: [segmentId]),
                CancellationToken.None);
            await Task.Delay(100);
            Assert.False(ingestionTask.IsCompleted);

            await writerTransaction.CommitAsync();
            var result = await ingestionTask.WaitAsync(TimeSpan.FromSeconds(5));

            Assert.Equal(1, result.ProcessedCount);
            Assert.Equal(0, result.CreatedItemCount);
            Assert.Equal(1, await ingestionContext.Set<SegmentStudioItem>()
                .CountAsync(item => item.NativeSegmentId == segmentId));
            Assert.Single(await ingestionContext.Set<SegmentStudioLineageNode>()
                .ToListAsync());
            Assert.Single(await ingestionContext
                .Set<SegmentStudioSegmentProvenance>().ToListAsync());
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand(
                $"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
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
                builder.ToTable("segment_studio_items");
                builder.HasKey(item => item.Id);
                builder.Property(item => item.Id).HasColumnName("id");
                builder.Property(item => item.NativeSegmentId).HasColumnName("native_segment_id");
                builder.Property(item => item.ReviewState).HasColumnName("review_state");
                builder.Property(item => item.RepresentationSchemaVersion).HasColumnName("representation_schema_version");
                builder.Property(item => item.VideoId).HasColumnName("video_id");
                builder.Property(item => item.StartSec).HasColumnName("start_sec");
                builder.Property(item => item.EndSec).HasColumnName("end_sec");
                builder.Property(item => item.TagId).HasColumnName("tag_id");
                builder.Property(item => item.Kind).HasColumnName("kind");
                builder.Property(item => item.RefId).HasColumnName("ref_id");
                builder.Property(item => item.PayloadJson).HasColumnName("payload").HasColumnType("jsonb");
                builder.Property(item => item.SourceKey).HasColumnName("source_key");
                builder.Property(item => item.SourceRunId).HasColumnName("source_run_id");
                builder.Property(item => item.Confidence).HasColumnName("confidence");
                builder.Property(item => item.Title).HasColumnName("title");
                builder.Property(item => item.ColorHint).HasColumnName("color_hint");
                builder.Property(item => item.ExtensionImageBlobId).HasColumnName("extension_image_blob_id");
                builder.Property(item => item.Revision).HasColumnName("revision");
                builder.Property(item => item.CreatedAt).HasColumnName("created_at");
                builder.Property(item => item.UpdatedAt).HasColumnName("updated_at");
                builder.HasIndex(item => item.NativeSegmentId).IsUnique();
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioSource>(builder =>
            {
                builder.ToTable("segment_studio_sources");
                builder.HasKey(source => source.Id);
                builder.Property(source => source.Id).HasColumnName("id");
                builder.Property(source => source.Key).HasColumnName("key");
                builder.Property(source => source.DisplayName).HasColumnName("display_name");
                builder.Property(source => source.Category).HasColumnName("category");
                builder.Property(source => source.Provider).HasColumnName("provider");
                builder.Property(source => source.DefaultModelIdentifier).HasColumnName("default_model_identifier");
                builder.Property(source => source.Description).HasColumnName("description");
                builder.Property(source => source.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
                builder.Property(source => source.CreatedAt).HasColumnName("created_at");
                builder.Property(source => source.UpdatedAt).HasColumnName("updated_at");
                builder.HasIndex(source => source.Key).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioProvenanceActivity>(builder =>
            {
                builder.ToTable("segment_studio_provenance_activities");
                builder.HasKey(activity => activity.Id);
                builder.Property(activity => activity.Id).HasColumnName("id");
                builder.Property(activity => activity.Key).HasColumnName("key");
                builder.Property(activity => activity.Kind).HasColumnName("kind");
                builder.Property(activity => activity.SourceId).HasColumnName("source_id");
                builder.Property(activity => activity.ExternalRunId).HasColumnName("external_run_id");
                builder.Property(activity => activity.Status).HasColumnName("status");
                builder.Property(activity => activity.StartedAt).HasColumnName("started_at");
                builder.Property(activity => activity.CompletedAt).HasColumnName("completed_at");
                builder.Property(activity => activity.RequestJson).HasColumnName("request").HasColumnType("jsonb");
                builder.Property(activity => activity.ModelsJson).HasColumnName("models").HasColumnType("jsonb");
                builder.Property(activity => activity.SummaryJson).HasColumnName("summary").HasColumnType("jsonb");
                builder.Property(activity => activity.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
                builder.Property(activity => activity.CreatedAt).HasColumnName("created_at");
                builder.Property(activity => activity.UpdatedAt).HasColumnName("updated_at");
                builder.HasIndex(activity => activity.Key).IsUnique();
                builder.HasIndex(activity => new { activity.SourceId, activity.ExternalRunId })
                    .IsUnique()
                    .HasFilter("external_run_id IS NOT NULL");
            });
            modelBuilder.Entity<SegmentStudioLineageNode>(builder =>
            {
                builder.ToTable("segment_studio_lineage_nodes");
                builder.HasKey(node => node.Id);
                builder.Property(node => node.Id).HasColumnName("id");
                builder.Property(node => node.ItemId).HasColumnName("item_id");
                builder.Property(node => node.State).HasColumnName("state");
                builder.Property(node => node.LastKnownVideoId).HasColumnName("last_known_video_id");
                builder.Property(node => node.LastKnownTagId).HasColumnName("last_known_tag_id");
                builder.Property(node => node.LastKnownStartSec).HasColumnName("last_known_start_sec");
                builder.Property(node => node.LastKnownEndSec).HasColumnName("last_known_end_sec");
                builder.Property(node => node.MissingSince).HasColumnName("missing_since");
                builder.Property(node => node.CreatedAt).HasColumnName("created_at");
                builder.Property(node => node.UpdatedAt).HasColumnName("updated_at");
                builder.HasIndex(node => node.ItemId)
                    .IsUnique()
                    .HasFilter("item_id IS NOT NULL");
            });
            modelBuilder.Entity<SegmentStudioSegmentProvenance>(builder =>
            {
                builder.ToTable("segment_studio_segment_provenance");
                builder.HasKey(assertion => assertion.Id);
                builder.Property(assertion => assertion.Id).HasColumnName("id");
                builder.Property(assertion => assertion.LineageNodeId).HasColumnName("lineage_node_id");
                builder.Property(assertion => assertion.SourceId).HasColumnName("source_id");
                builder.Property(assertion => assertion.Relation).HasColumnName("relation");
                builder.Property(assertion => assertion.ActivityId).HasColumnName("activity_id");
                builder.Property(assertion => assertion.ModelKey).HasColumnName("model_key");
                builder.Property(assertion => assertion.ModelIdentifier).HasColumnName("model_identifier");
                builder.Property(assertion => assertion.ModelVersion).HasColumnName("model_version");
                builder.Property(assertion => assertion.Confidence).HasColumnName("confidence");
                builder.Property(assertion => assertion.RecordedAt).HasColumnName("recorded_at");
                builder.Property(assertion => assertion.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
                builder.Property(assertion => assertion.SupersededAt).HasColumnName("superseded_at");
                builder.Property(assertion => assertion.CreatedAt).HasColumnName("created_at");
                builder.Property(assertion => assertion.UpdatedAt).HasColumnName("updated_at");
                builder.HasIndex(assertion => new
                    {
                        assertion.LineageNodeId,
                        assertion.SourceId,
                        assertion.Relation,
                        assertion.ActivityId,
                        assertion.ModelKey,
                        assertion.ModelIdentifier,
                        assertion.ModelVersion,
                    })
                    .IsUnique()
                    .HasFilter("superseded_at IS NULL");
            });
            modelBuilder.Entity<SegmentStudioDerivationEdge>(builder =>
            {
                builder.ToTable("segment_studio_derivation_edges");
                builder.HasKey(edge => edge.Id);
                builder.Property(edge => edge.Id).HasColumnName("id");
                builder.Property(edge => edge.SourceNodeId).HasColumnName("source_node_id");
                builder.Property(edge => edge.DerivedNodeId).HasColumnName("derived_node_id");
                builder.Property(edge => edge.RuleId).HasColumnName("rule_id");
                builder.Property(edge => edge.RuleVersionAtCreation).HasColumnName("rule_version_at_creation");
                builder.Property(edge => edge.SourceTagIdAtCreation).HasColumnName("source_tag_id_at_creation");
                builder.Property(edge => edge.DerivedTagIdAtCreation).HasColumnName("derived_tag_id_at_creation");
                builder.Property(edge => edge.ActivityId).HasColumnName("activity_id");
                builder.Property(edge => edge.RecordedAt).HasColumnName("recorded_at");
                builder.Property(edge => edge.MetadataJson).HasColumnName("metadata").HasColumnType("jsonb");
                builder.Property(edge => edge.CreatedAt).HasColumnName("created_at");
                builder.Property(edge => edge.UpdatedAt).HasColumnName("updated_at");
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.ToTable("segments");
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
