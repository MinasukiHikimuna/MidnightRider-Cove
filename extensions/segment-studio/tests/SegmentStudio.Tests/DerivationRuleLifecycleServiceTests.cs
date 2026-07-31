using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using System.Text.Json;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class DerivationRuleLifecycleServiceTests
{
    [Fact]
    public async Task DeletePhysicallyRemovesRuleAndOnlyItsOrphanedDerivations()
    {
        await using var fixture = await LifecycleFixture.CreateAsync();
        var graph = await fixture.AddFanInGraphAsync();
        fixture.Context.ChangeTracker.Clear();

        var directDelete = async () =>
        {
            var rule = await fixture.Context.Set<SegmentStudioDerivationRule>()
                .SingleAsync(candidate => candidate.Id == graph.DeletedRule.Id);
            fixture.Context.Remove(rule);
            await fixture.Context.SaveChangesAsync();
        };
        await Assert.ThrowsAsync<DbUpdateException>(directDelete);
        fixture.Context.ChangeTracker.Clear();

        var preview = await DerivationRuleLifecycleService.PreviewDeleteAsync(
            fixture.Context, graph.DeletedRule.Id, CancellationToken.None);

        Assert.Equal(3, preview.RemovedEdgeCount);
        Assert.Equal(2, preview.DeletedSegmentCount);
        Assert.Equal(1, preview.RetainedSharedSegmentCount);

        var result = await DerivationRuleLifecycleService.DeleteAsync(
            fixture.Context,
            graph.DeletedRule.Id,
            new DerivationRuleDeleteRequest(Guid.NewGuid(), preview.Fingerprint),
            TestPrincipal,
            AllowAuthorization.Instance,
            CancellationToken.None);

        Assert.Equal(preview.RemovedEdgeCount, result.RemovedEdgeCount);
        Assert.Null(await fixture.Context.Set<SegmentStudioDerivationRule>()
            .SingleOrDefaultAsync(rule => rule.Id == graph.DeletedRule.Id));
        Assert.NotNull(await fixture.Context.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(item => item.Id == graph.SharedItemId));
        Assert.Null(await fixture.Context.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(item => item.Id == graph.ExclusiveItemId));
        Assert.Null(await fixture.Context.Set<SegmentStudioItem>()
            .SingleOrDefaultAsync(item => item.Id == graph.DescendantItemId));
        Assert.All(
            await fixture.Context.Set<SegmentStudioDerivationEdge>().ToListAsync(),
            edge => Assert.NotEqual(graph.DeletedRule.Id, edge.RuleId));
        var inherited = await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion =>
                assertion.LineageNodeId == graph.SharedNodeId
                && assertion.Relation == "inherited")
            .OrderBy(assertion => assertion.SourceId)
            .ToListAsync();
        Assert.NotNull(inherited.Single(assertion => assertion.SourceId == 1).SupersededAt);
        Assert.Null(inherited.Single(assertion => assertion.SourceId == 2).SupersededAt);
    }

    [Fact]
    public async Task MaterializationIsOptionalAndCanCreateEveryPendingDirectDerivation()
    {
        await using var fixture = await LifecycleFixture.CreateAsync();
        var graph = await fixture.AddPendingRuleAsync();

        var preview = await DerivationRuleLifecycleService.PreviewMaterializationAsync(
            fixture.Context, graph.RuleId, CancellationToken.None);

        Assert.Equal(2, preview.SourceCount);
        Assert.Equal(2, preview.CreateCount);
        Assert.Equal(0, preview.AlreadyMaterializedCount);
        Assert.Empty(await fixture.Context.Set<SegmentStudioDerivationEdge>().ToListAsync());

        var request = new DerivationRuleMaterializationRequest(
            Guid.NewGuid(), preview.Fingerprint);
        var result = await DerivationRuleLifecycleService.MaterializeAsync(
            fixture.Context,
            graph.RuleId,
            request,
            actorUserId: TestPrincipal.UserId,
            TestPrincipal,
            AllowAuthorization.Instance,
            CancellationToken.None);
        var replay = await DerivationRuleLifecycleService.MaterializeAsync(
            fixture.Context,
            graph.RuleId,
            request,
            actorUserId: TestPrincipal.UserId,
            TestPrincipal,
            AllowAuthorization.Instance,
            CancellationToken.None);

        Assert.Equal(2, result.CreatedCount);
        Assert.True(replay.Replayed);
        Assert.Equal(result.CreatedCount, replay.CreatedCount);
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioDerivationEdge>().CountAsync());
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioItem>()
            .CountAsync(item => item.TagId == 20));
    }

    [Fact]
    public async Task RuleMaterializationNeverLinksANativeAnchorAsItsDerivedTarget()
    {
        await using var fixture = await LifecycleFixture.CreateAsync();
        var graph = await fixture.AddPendingRuleAsync();
        var now = DateTime.UtcNow;
        var nativeTarget = new SegmentStudioItem
        {
            NativeSegmentId = 99,
            CreatedAt = now,
            UpdatedAt = now,
        };
        fixture.Context.Add(nativeTarget);
        await fixture.Context.SaveChangesAsync();
        fixture.Context.Add(new SegmentStudioLineageNode
        {
            Id = Guid.NewGuid(), ItemId = nativeTarget.Id, State = "live",
            LastKnownVideoId = 1, LastKnownTagId = 20,
            LastKnownStartSec = 1, LastKnownEndSec = 2,
            CreatedAt = now, UpdatedAt = now,
        });
        await fixture.Context.SaveChangesAsync();

        var preview = await DerivationRuleLifecycleService.PreviewMaterializationAsync(
            fixture.Context, graph.RuleId, CancellationToken.None);

        Assert.Equal(2, preview.CreateCount);
        Assert.Equal(0, preview.LinkCount);
    }

    [Fact]
    public async Task RuleMaterializationAndEditingIgnoreUnrelatedLibraryProvenance()
    {
        await using var fixture = await LifecycleFixture.CreateAsync();
        var graph = await fixture.AddPendingRuleAsync();
        await fixture.AddUnrelatedProvenanceAsync(100_001);

        var materialization = await DerivationRuleLifecycleService.PreviewMaterializationAsync(
            fixture.Context, graph.RuleId, CancellationToken.None);
        var materialized = await DerivationRuleLifecycleService.MaterializeAsync(
            fixture.Context,
            graph.RuleId,
            new DerivationRuleMaterializationRequest(Guid.NewGuid(), materialization.Fingerprint),
            actorUserId: TestPrincipal.UserId,
            TestPrincipal,
            AllowAuthorization.Instance,
            CancellationToken.None);

        Assert.Equal(2, materialized.CreatedCount);

        var cleanup = await DerivationRuleLifecycleService.PreviewDeleteAsync(
            fixture.Context, graph.RuleId, CancellationToken.None);
        var saved = await DerivationRuleManagementService.SaveAsync(
            fixture.Context,
            new DerivationRuleSaveRequest(
                graph.RuleId,
                SourceTagId: 10,
                DerivedTagId: 20,
                SlotMappings: [],
                CleanupFingerprint: cleanup.Fingerprint),
            CancellationToken.None);

        Assert.Equal(graph.RuleId, saved.Id);
        Assert.Empty(await fixture.Context.Set<SegmentStudioDerivationEdge>().ToListAsync());
    }

    [Fact]
    public async Task PostgreSqlRuleDeleteTriggerPrunesExclusiveLineageAndRetiresSharedEvidence()
    {
        await WithPostgreSqlContextAsync(async context =>
        {
            var graph = await SeedPostgreSqlFanInAsync(context);
            var migration = new SegmentStudioExtension().GetMigrations()
                .Single(candidate => candidate.Name == "001_initial_schema");
            var functionsStart = migration.UpSql.IndexOf(
                "CREATE OR REPLACE FUNCTION segment_studio_delete_rule_derivations",
                StringComparison.Ordinal);
            var functionsEnd = migration.UpSql.IndexOf(
                "-- Triggers and foreign keys.",
                functionsStart,
                StringComparison.Ordinal);
            Assert.True(functionsStart >= 0);
            Assert.True(functionsEnd > functionsStart);
            await context.Database.ExecuteSqlRawAsync(
                migration.UpSql[functionsStart..functionsEnd]);
            await context.Database.ExecuteSqlRawAsync("""
                CREATE TRIGGER segment_studio_derivation_rules_delete_derivations
                    BEFORE DELETE ON segment_studio_derivation_rules
                    FOR EACH ROW
                    EXECUTE FUNCTION segment_studio_delete_rule_derivations()
                """);

            await context.Database.ExecuteSqlInterpolatedAsync(
                $"DELETE FROM segment_studio_derivation_rules WHERE id = {graph.DeletedRuleId}");
            context.ChangeTracker.Clear();

            Assert.False(await context.Set<SegmentStudioDerivationRule>()
                .AnyAsync(rule => rule.Id == graph.DeletedRuleId));
            Assert.True(await context.Set<SegmentStudioItem>()
                .AnyAsync(item => item.Id == graph.SharedItemId));
            Assert.False(await context.Set<SegmentStudioItem>()
                .AnyAsync(item => item.Id == graph.ExclusiveItemId));
            Assert.False(await context.Set<SegmentStudioItem>()
                .AnyAsync(item => item.Id == graph.DescendantItemId));
            Assert.Empty(await context.Set<SegmentStudioHistorySession>().ToListAsync());
            var inherited = await context.Set<SegmentStudioSegmentProvenance>()
                .Where(assertion =>
                    assertion.LineageNodeId == graph.SharedNodeId
                    && assertion.Relation == "inherited")
                .OrderBy(assertion => assertion.SourceId)
                .ToListAsync();
            Assert.NotNull(inherited[0].SupersededAt);
            Assert.Null(inherited[1].SupersededAt);
        });
    }

    [Fact]
    public async Task PostgreSqlEdgeCreationWaitsForRuleMutationRowLock()
    {
        await WithPostgreSqlContextAsync(async setup =>
        {
            var pending = await SeedPostgreSqlPendingRuleAsync(setup);
            var options = setup.Options;
            await using var writer = new TriggerDbContext(options);
            await using var creator = new TriggerDbContext(options);
            await using var writerTransaction = await writer.Database.BeginTransactionAsync();
            await writer.Set<SegmentStudioDerivationRule>()
                .FromSqlInterpolated($"""
                    SELECT *
                    FROM segment_studio_derivation_rules
                    WHERE id = {pending.RuleId}
                    FOR UPDATE
                    """)
                .SingleAsync();

            var creation = new DerivationGraphService().CreateEdgeAsync(
                creator,
                new DerivationEdgeCreate(
                    pending.SourceNodeId,
                    pending.TargetNodeId,
                    pending.RuleId,
                    null,
                    DateTime.UtcNow,
                    "{}"),
                CancellationToken.None);
            await Task.Delay(100);
            Assert.False(creation.IsCompleted);

            await writerTransaction.CommitAsync();
            await creation.WaitAsync(TimeSpan.FromSeconds(5));
            Assert.Single(await creator.Set<SegmentStudioDerivationEdge>().ToListAsync());
        });
    }

    private sealed record FanInGraph(
        SegmentStudioDerivationRule DeletedRule,
        Guid SharedNodeId,
        long SharedItemId,
        long ExclusiveItemId,
        long DescendantItemId);

    private sealed record PendingRule(Guid RuleId);

    private sealed record PostgreSqlFanIn(
        Guid DeletedRuleId,
        Guid SharedNodeId,
        long SharedItemId,
        long ExclusiveItemId,
        long DescendantItemId,
        long RemovedSourceId,
        long SupportingSourceId);

    private sealed record PostgreSqlPending(
        Guid RuleId,
        Guid SourceNodeId,
        Guid TargetNodeId);

    private static async Task WithPostgreSqlContextAsync(
        Func<TriggerDbContext, Task> action)
    {
        var connectionString = Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var schema = $"segment_studio_rule_lifecycle_test_{Guid.NewGuid():N}";
        var builder = new NpgsqlConnectionStringBuilder(connectionString) { SearchPath = schema };
        await using var admin = new NpgsqlConnection(connectionString);
        await admin.OpenAsync();
        await using (var createSchema = new NpgsqlCommand($"CREATE SCHEMA \"{schema}\"", admin))
            await createSchema.ExecuteNonQueryAsync();
        try
        {
            var options = new DbContextOptionsBuilder<TriggerDbContext>()
                .UseNpgsql(builder.ConnectionString).Options;
            await using var context = new TriggerDbContext(options);
            await context.Database.ExecuteSqlRawAsync(context.Database.GenerateCreateScript());
            await action(context);
        }
        finally
        {
            await using var dropSchema = new NpgsqlCommand($"DROP SCHEMA \"{schema}\" CASCADE", admin);
            await dropSchema.ExecuteNonQueryAsync();
        }
    }

    private static async Task<PostgreSqlFanIn> SeedPostgreSqlFanInAsync(
        TriggerDbContext context)
    {
        var now = DateTime.UtcNow;
        context.AddRange(
            new Video { Id = 1, Title = "Video" },
            new Tag { Id = 10, Name = "Source A" },
            new Tag { Id = 11, Name = "Source B" },
            new Tag { Id = 20, Name = "Derived" },
            new Tag { Id = 30, Name = "Descendant" });
        var removedSource = new SegmentStudioSource
        {
            Key = "removed", DisplayName = "Removed", MetadataJson = "{}",
            CreatedAt = now, UpdatedAt = now,
        };
        var supportingSource = new SegmentStudioSource
        {
            Key = "supporting", DisplayName = "Supporting", MetadataJson = "{}",
            CreatedAt = now, UpdatedAt = now,
        };
        context.AddRange(removedSource, supportingSource);
        await context.SaveChangesAsync();

        SegmentStudioItem Item(int tagId, double start) => new()
        {
            ReviewState = "approved",
            VideoId = 1,
            StartSec = start,
            EndSec = start + 1,
            TagId = tagId,
            Kind = "tag",
            SourceKey = "user",
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };
        var sourceA = Item(10, 1);
        var sourceB = Item(11, 1);
        var sourceA2 = Item(10, 3);
        var shared = Item(20, 1);
        var exclusive = Item(20, 3);
        var descendant = Item(30, 3);
        context.AddRange(sourceA, sourceB, sourceA2, shared, exclusive, descendant);
        await context.SaveChangesAsync();

        SegmentStudioLineageNode Node(SegmentStudioItem item) => new()
        {
            Id = Guid.NewGuid(),
            ItemId = item.Id,
            State = "live",
            LastKnownVideoId = 1,
            LastKnownTagId = item.TagId,
            LastKnownStartSec = item.StartSec,
            LastKnownEndSec = item.EndSec,
            CreatedAt = now,
            UpdatedAt = now,
        };
        var sourceANode = Node(sourceA);
        var sourceBNode = Node(sourceB);
        var sourceA2Node = Node(sourceA2);
        var sharedNode = Node(shared);
        var exclusiveNode = Node(exclusive);
        var descendantNode = Node(descendant);
        var deletedRule = PostgreSqlRule("delete", 10, 20, now);
        var supportingRule = PostgreSqlRule("support", 11, 20, now);
        var downstreamRule = PostgreSqlRule("downstream", 20, 30, now);
        context.AddRange(
            sourceANode, sourceBNode, sourceA2Node, sharedNode, exclusiveNode, descendantNode,
            deletedRule, supportingRule, downstreamRule);
        await context.SaveChangesAsync();
        context.AddRange(
            PostgreSqlEdge(sourceANode, sharedNode, deletedRule, now),
            PostgreSqlEdge(sourceBNode, sharedNode, supportingRule, now),
            PostgreSqlEdge(sourceA2Node, exclusiveNode, deletedRule, now),
            PostgreSqlEdge(exclusiveNode, descendantNode, downstreamRule, now),
            PostgreSqlProvenance(sourceANode.Id, removedSource.Id, "origin", now),
            PostgreSqlProvenance(sourceBNode.Id, supportingSource.Id, "origin", now),
            PostgreSqlProvenance(sharedNode.Id, removedSource.Id, "inherited", now),
            PostgreSqlProvenance(sharedNode.Id, supportingSource.Id, "inherited", now),
            new SegmentStudioHistorySession
            {
                UserId = 1,
                VideoId = 1,
                CreatedAt = now,
                UpdatedAt = now,
            });
        await context.SaveChangesAsync();
        return new(
            deletedRule.Id,
            sharedNode.Id,
            shared.Id,
            exclusive.Id,
            descendant.Id,
            removedSource.Id,
            supportingSource.Id);
    }

    private static async Task<PostgreSqlPending> SeedPostgreSqlPendingRuleAsync(
        TriggerDbContext context)
    {
        var now = DateTime.UtcNow;
        context.AddRange(
            new Video { Id = 1, Title = "Video" },
            new Tag { Id = 10, Name = "Source" },
            new Tag { Id = 20, Name = "Derived" });
        await context.SaveChangesAsync();
        var source = new SegmentStudioItem
        {
            ReviewState = "approved", VideoId = 1, StartSec = 1, EndSec = 2,
            TagId = 10, Kind = "tag", SourceKey = "user", Revision = 1,
            CreatedAt = now, UpdatedAt = now,
        };
        var target = new SegmentStudioItem
        {
            ReviewState = "unreviewed", VideoId = 1, StartSec = 1, EndSec = 2,
            TagId = 20, Kind = "tag", SourceKey = "user", Revision = 1,
            CreatedAt = now, UpdatedAt = now,
        };
        context.AddRange(source, target);
        await context.SaveChangesAsync();
        var sourceNode = PostgreSqlNode(source, now);
        var targetNode = PostgreSqlNode(target, now);
        var rule = PostgreSqlRule("pending", 10, 20, now);
        context.AddRange(sourceNode, targetNode, rule);
        await context.SaveChangesAsync();
        return new(rule.Id, sourceNode.Id, targetNode.Id);
    }

    private static SegmentStudioLineageNode PostgreSqlNode(
        SegmentStudioItem item,
        DateTime now) => new()
    {
        Id = Guid.NewGuid(),
        ItemId = item.Id,
        State = "live",
        LastKnownVideoId = item.VideoId!.Value,
        LastKnownTagId = item.TagId,
        LastKnownStartSec = item.StartSec,
        LastKnownEndSec = item.EndSec,
        CreatedAt = now,
        UpdatedAt = now,
    };

    private static SegmentStudioDerivationRule PostgreSqlRule(
        string key,
        int sourceTagId,
        int derivedTagId,
        DateTime now) => new()
    {
        Id = Guid.NewGuid(),
        Key = key,
        Version = "1",
        SourceTagId = sourceTagId,
        DerivedTagId = derivedTagId,
        MetadataJson = "{}",
        CreatedAt = now,
        UpdatedAt = now,
    };

    private static SegmentStudioDerivationEdge PostgreSqlEdge(
        SegmentStudioLineageNode source,
        SegmentStudioLineageNode derived,
        SegmentStudioDerivationRule rule,
        DateTime now) => new()
    {
        SourceNodeId = source.Id,
        DerivedNodeId = derived.Id,
        RuleId = rule.Id,
        RuleVersionAtCreation = rule.Version,
        SourceTagIdAtCreation = rule.SourceTagId,
        DerivedTagIdAtCreation = rule.DerivedTagId,
        MetadataJson = "{}",
        CreatedAt = now,
        UpdatedAt = now,
    };

    private static SegmentStudioSegmentProvenance PostgreSqlProvenance(
        Guid nodeId,
        long sourceId,
        string relation,
        DateTime now) => new()
    {
        LineageNodeId = nodeId,
        SourceId = sourceId,
        Relation = relation,
        MetadataJson = "{}",
        CreatedAt = now,
        UpdatedAt = now,
    };

    private sealed class LifecycleFixture(
        SqliteConnection connection,
        LifecycleDbContext context) : IAsyncDisposable
    {
        private readonly SqliteConnection _connection = connection;
        public LifecycleDbContext Context { get; } = context;

        public static async Task<LifecycleFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new LifecycleDbContext(
                new DbContextOptionsBuilder<LifecycleDbContext>().UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();
            context.AddRange(
                new Tag { Id = 10, Name = "Source A" },
                new Tag { Id = 11, Name = "Source B" },
                new Tag { Id = 20, Name = "Derived" },
                new Tag { Id = 30, Name = "Descendant" });
            await context.SaveChangesAsync();
            return new(connection, context);
        }

        public async Task<FanInGraph> AddFanInGraphAsync()
        {
            var now = DateTime.UtcNow;
            var sourceA = Item(1, 10, 1, now);
            var sourceB = Item(1, 11, 2, now);
            var sourceA2 = Item(2, 10, 3, now);
            var shared = Item(1, 20, 1, now);
            var exclusive = Item(2, 20, 3, now);
            var descendant = Item(2, 30, 3, now);
            Context.AddRange(sourceA, sourceB, sourceA2, shared, exclusive, descendant);
            await Context.SaveChangesAsync();

            var sourceANode = Node(sourceA, now);
            var sourceBNode = Node(sourceB, now);
            var sourceA2Node = Node(sourceA2, now);
            var sharedNode = Node(shared, now);
            var exclusiveNode = Node(exclusive, now);
            var descendantNode = Node(descendant, now);
            var deletedRule = Rule("delete", 10, 20, now);
            var supportingRule = Rule("support", 11, 20, now);
            var downstreamRule = Rule("downstream", 20, 30, now);
            Context.AddRange(
                sourceANode, sourceBNode, sourceA2Node, sharedNode, exclusiveNode, descendantNode,
                deletedRule, supportingRule, downstreamRule);
            await Context.SaveChangesAsync();
            Context.AddRange(
                Edge(sourceANode, sharedNode, deletedRule, now),
                Edge(sourceBNode, sharedNode, supportingRule, now),
                Edge(sourceA2Node, exclusiveNode, deletedRule, now),
                Edge(exclusiveNode, descendantNode, downstreamRule, now),
                Provenance(sourceANode.Id, 1, "origin", now),
                Provenance(sourceBNode.Id, 2, "origin", now),
                Provenance(sharedNode.Id, 1, "inherited", now),
                Provenance(sharedNode.Id, 2, "inherited", now));
            await Context.SaveChangesAsync();
            return new(deletedRule, sharedNode.Id, shared.Id, exclusive.Id, descendant.Id);
        }

        public async Task<PendingRule> AddPendingRuleAsync()
        {
            var now = DateTime.UtcNow;
            var first = Item(1, 10, 1, now);
            var second = Item(2, 10, 2, now);
            Context.AddRange(first, second);
            await Context.SaveChangesAsync();
            Context.AddRange(Node(first, now), Node(second, now));
            var rule = Rule("pending", 10, 20, now);
            Context.Add(rule);
            await Context.SaveChangesAsync();
            return new(rule.Id);
        }

        public async Task AddUnrelatedProvenanceAsync(int count)
        {
            var now = DateTime.UtcNow;
            var unrelatedNode = new SegmentStudioLineageNode
            {
                Id = Guid.NewGuid(),
                State = "live",
                LastKnownVideoId = 999,
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(unrelatedNode);
            await Context.SaveChangesAsync();

            var sideLength = (int)Math.Ceiling(Math.Sqrt(count));
            var metadata = "{}";
            await Context.Database.ExecuteSqlInterpolatedAsync($"""
                WITH RECURSIVE sequence(value) AS (
                    SELECT 0
                    UNION ALL
                    SELECT value + 1 FROM sequence WHERE value + 1 < {sideLength}
                )
                INSERT INTO "SegmentStudioSegmentProvenance"
                    ("LineageNodeId", "SourceId", "Relation", "MetadataJson", "CreatedAt", "UpdatedAt")
                SELECT
                    {unrelatedNode.Id},
                    (left_sequence.value * {sideLength}) + right_sequence.value + 1000,
                    'origin',
                    {metadata},
                    {now},
                    {now}
                FROM sequence AS left_sequence
                CROSS JOIN sequence AS right_sequence
                LIMIT {count}
                """);
        }

        private static SegmentStudioItem Item(
            int videoId, int tagId, double startSec, DateTime now) => new()
        {
            VideoId = videoId,
            TagId = tagId,
            StartSec = startSec,
            EndSec = startSec + 1,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = "approved",
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };

        private static SegmentStudioLineageNode Node(SegmentStudioItem item, DateTime now) => new()
        {
            Id = Guid.NewGuid(),
            ItemId = item.Id,
            State = "live",
            LastKnownVideoId = item.VideoId!.Value,
            LastKnownTagId = item.TagId,
            LastKnownStartSec = item.StartSec,
            LastKnownEndSec = item.EndSec,
            CreatedAt = now,
            UpdatedAt = now,
        };

        private static SegmentStudioDerivationRule Rule(
            string key, int sourceTagId, int derivedTagId, DateTime now) => new()
        {
            Id = Guid.NewGuid(),
            Key = key,
            Version = "1",
            SourceTagId = sourceTagId,
            DerivedTagId = derivedTagId,
            MetadataJson = "{}",
            CreatedAt = now,
            UpdatedAt = now,
        };

        private static SegmentStudioDerivationEdge Edge(
            SegmentStudioLineageNode source,
            SegmentStudioLineageNode derived,
            SegmentStudioDerivationRule rule,
            DateTime now) => new()
        {
            SourceNodeId = source.Id,
            DerivedNodeId = derived.Id,
            RuleId = rule.Id,
            RuleVersionAtCreation = rule.Version,
            SourceTagIdAtCreation = rule.SourceTagId,
            DerivedTagIdAtCreation = rule.DerivedTagId,
            MetadataJson = "{}",
            CreatedAt = now,
            UpdatedAt = now,
        };

        private static SegmentStudioSegmentProvenance Provenance(
            Guid nodeId,
            long sourceId,
            string relation,
            DateTime now) => new()
        {
            LineageNodeId = nodeId,
            SourceId = sourceId,
            Relation = relation,
            MetadataJson = "{}",
            CreatedAt = now,
            UpdatedAt = now,
        };

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class LifecycleDbContext(
        DbContextOptions<LifecycleDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Tag>(builder =>
            {
                builder.HasKey(tag => tag.Id);
                builder.Ignore(tag => tag.TagGroup);
                builder.Ignore(tag => tag.Aliases);
                builder.Ignore(tag => tag.ParentRelations);
                builder.Ignore(tag => tag.ChildRelations);
                builder.Ignore(tag => tag.RemoteIds);
                builder.Ignore(tag => tag.VideoTags);
                builder.Ignore(tag => tag.PerformerTags);
                builder.Ignore(tag => tag.ImageTags);
                builder.Ignore(tag => tag.GalleryTags);
                builder.Ignore(tag => tag.StudioTags);
                builder.Ignore(tag => tag.GroupTags);
            });
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>(builder =>
            {
                builder.HasKey(node => node.Id);
                builder.HasOne<SegmentStudioItem>().WithMany()
                    .HasForeignKey(node => node.ItemId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<SegmentStudioDerivationRule>(builder =>
            {
                builder.HasKey(rule => rule.Id);
                builder.HasIndex(rule => new { rule.SourceTagId, rule.DerivedTagId }).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioDerivationEdge>(builder =>
            {
                builder.HasKey(edge => edge.Id);
                builder.HasOne<SegmentStudioLineageNode>().WithMany()
                    .HasForeignKey(edge => edge.SourceNodeId)
                    .OnDelete(DeleteBehavior.Cascade);
                builder.HasOne<SegmentStudioLineageNode>().WithMany()
                    .HasForeignKey(edge => edge.DerivedNodeId)
                    .OnDelete(DeleteBehavior.Cascade);
                builder.HasOne<SegmentStudioDerivationRule>().WithMany()
                    .HasForeignKey(edge => edge.RuleId)
                    .OnDelete(DeleteBehavior.Restrict);
            });
            modelBuilder.Entity<SegmentStudioSegmentProvenance>()
                .HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
        }
    }

    private sealed class TriggerDbContext : DbContext
    {
        public TriggerDbContext(DbContextOptions<TriggerDbContext> options) : base(options) =>
            Options = options;

        public DbContextOptions<TriggerDbContext> Options { get; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Video>(builder =>
            {
                builder.ToTable("videos");
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
                builder.ToTable("tags");
                builder.HasKey(tag => tag.Id);
                builder.Ignore(tag => tag.TagGroup);
                builder.Ignore(tag => tag.Aliases);
                builder.Ignore(tag => tag.ParentRelations);
                builder.Ignore(tag => tag.ChildRelations);
                builder.Ignore(tag => tag.RemoteIds);
                builder.Ignore(tag => tag.VideoTags);
                builder.Ignore(tag => tag.PerformerTags);
                builder.Ignore(tag => tag.ImageTags);
                builder.Ignore(tag => tag.GalleryTags);
                builder.Ignore(tag => tag.StudioTags);
                builder.Ignore(tag => tag.GroupTags);
            });
            modelBuilder.Entity<Segment>(builder =>
            {
                builder.ToTable("segments");
                builder.HasKey(segment => segment.Id);
                builder.Ignore(segment => segment.Tag);
                builder.Property(segment => segment.Payload).HasConversion(
                    document => document == null ? null : document.RootElement.GetRawText(),
                    json => json == null ? null : JsonDocument.Parse(json));
            });
            modelBuilder.Entity<Performer>(builder =>
            {
                builder.ToTable("performers");
                builder.HasKey(performer => performer.Id);
                builder.Ignore(performer => performer.Urls);
                builder.Ignore(performer => performer.Aliases);
                builder.Ignore(performer => performer.PerformerTags);
                builder.Ignore(performer => performer.VideoPerformers);
                builder.Ignore(performer => performer.ImagePerformers);
                builder.Ignore(performer => performer.GalleryPerformers);
                builder.Ignore(performer => performer.RemoteIds);
            });
            modelBuilder.Entity<VideoPerformer>(builder =>
            {
                builder.ToTable("video_performers");
                builder.HasKey(link => new { link.VideoId, link.PerformerId });
                builder.Ignore(link => link.Video);
                builder.Ignore(link => link.Performer);
            });
            SegmentStudioModelConfiguration.Configure(modelBuilder);
        }
    }

    private static readonly CovePrincipal TestPrincipal = new()
    {
        UserId = 7,
        Username = "tester",
        Kind = PrincipalKind.User,
        Roles = new HashSet<string>(),
        Permissions = new HashSet<string> { "*" },
    };

    private sealed class AllowAuthorization : IAuthorizationService
    {
        public static AllowAuthorization Instance { get; } = new();
        public AuthorizationResult Authorize(
            CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            AuthorizationResult.Allow();
        public Task<AuthorizationResult> AuthorizeAsync(
            CovePrincipal? principal, string permission, EntityRef? entity, CancellationToken ct) =>
            Task.FromResult(AuthorizationResult.Allow());
        public void Require(
            CovePrincipal? principal, string permission, EntityRef? entity = null) { }
        public bool Has(CovePrincipal? principal, string permission) => true;
    }
}
