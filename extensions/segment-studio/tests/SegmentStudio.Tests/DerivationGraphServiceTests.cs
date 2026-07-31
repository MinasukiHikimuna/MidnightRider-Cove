using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class DerivationGraphServiceTests
{
    [Fact]
    public async Task CreatesMultiLevelGraphAndCopiesInheritedOrigin()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var graph = new DerivationGraphService();

        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Child.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None);
        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Child.Id, fixture.Grandchild.Id, fixture.SecondRule.Id, null, null, "{}"),
            CancellationToken.None);

        Assert.Equal(2, await fixture.Context.Set<SegmentStudioDerivationEdge>().CountAsync());
        var inherited = await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .Where(assertion => assertion.LineageNodeId == fixture.Grandchild.Id)
            .SingleAsync();
        Assert.Equal("inherited", inherited.Relation);
        Assert.Equal(fixture.Source.Id, inherited.SourceId);

        await new SegmentProvenanceService().AppendAsync(
            fixture.Context,
            new SegmentProvenanceAppend(
                fixture.Root.Id, fixture.Source.Id, "origin", null, "later", null, null,
                null, null, "{}"),
            CancellationToken.None);
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .CountAsync(assertion => assertion.LineageNodeId == fixture.Grandchild.Id));
    }

    [Fact]
    public async Task RejectsSelfDuplicateCycleAndCrossVideoEdges()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var graph = new DerivationGraphService();

        await AssertCodeAsync("LINEAGE_CYCLE", () => graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Root.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None));
        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Child.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None);
        await AssertCodeAsync("LINEAGE_RULE_MISMATCH", () => graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Child.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None));
        var reverseRule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(), Key = "reverse", Version = "1", SourceTagId = 20,
            DerivedTagId = 10, MetadataJson = "{}",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(reverseRule);
        await fixture.Context.SaveChangesAsync();
        await AssertCodeAsync("LINEAGE_CYCLE", () => graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Child.Id, fixture.Root.Id, reverseRule.Id, null, null, "{}"),
            CancellationToken.None));
        await AssertCodeAsync("LINEAGE_CROSS_VIDEO", () => graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.OtherVideo.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None));
    }

    [Fact]
    public async Task MultipleParentsMustAgreeOnDerivedTag()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var graph = new DerivationGraphService();
        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Child.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None);
        var conflictingRule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(),
            Key = "conflict",
            Version = "1",
            SourceTagId = fixture.ParentTwo.LastKnownTagId!.Value,
            DerivedTagId = 99,
            MetadataJson = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(conflictingRule);
        await fixture.Context.SaveChangesAsync();

        await AssertCodeAsync("LINEAGE_RULE_MISMATCH", () => graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.ParentTwo.Id, fixture.Child.Id, conflictingRule.Id, null, null, "{}"),
            CancellationToken.None));
    }

    [Fact]
    public async Task RejectsANativeSegmentAsADerivedEndpoint()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        fixture.Context.Add(new SegmentStudioItem
        {
            Id = fixture.Child.ItemId!.Value,
            NativeSegmentId = 42,
            VideoId = fixture.Child.LastKnownVideoId,
            TagId = fixture.Child.LastKnownTagId,
            StartSec = fixture.Child.LastKnownStartSec,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = "approved",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await fixture.Context.SaveChangesAsync();

        await AssertCodeAsync("NATIVE_DERIVED_NOT_ALLOWED", () =>
            new DerivationGraphService().CreateEdgeAsync(
                fixture.Context,
                new DerivationEdgeCreate(
                    fixture.Root.Id,
                    fixture.Child.Id,
                    fixture.FirstRule.Id,
                    null,
                    null,
                    "{}"),
                CancellationToken.None));
    }

    [Fact]
    public async Task SupportsBranchesAndAgreeingMultipleParents()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var graph = new DerivationGraphService();
        var agreeingRule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(), Key = "agree", Version = "1",
            SourceTagId = fixture.ParentTwo.LastKnownTagId!.Value, DerivedTagId = 20,
            MetadataJson = "{}", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(agreeingRule);
        await fixture.Context.SaveChangesAsync();

        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Child.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None);
        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.OtherChild.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None);
        await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.ParentTwo.Id, fixture.Child.Id, agreeingRule.Id, null, null, "{}"),
            CancellationToken.None);

        Assert.Equal(2, await fixture.Context.Set<SegmentStudioDerivationEdge>()
            .CountAsync(edge => edge.SourceNodeId == fixture.Root.Id));
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioDerivationEdge>()
            .CountAsync(edge => edge.DerivedNodeId == fixture.Child.Id));
    }

    [Fact]
    public async Task DeriveCreatesReviewableDraftAndReplaysIdempotently()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var now = DateTime.UtcNow;
        var sourceItem = new SegmentStudioItem
        {
            VideoId = 1, TagId = 10, StartSec = 4, EndSec = 8, Kind = "tag",
            SourceKey = "user", ReviewState = "approved", Revision = 3,
            CreatedAt = now, UpdatedAt = now,
        };
        fixture.Context.Add(sourceItem);
        await fixture.Context.SaveChangesAsync();
        var service = new LineageMutationService(
            new LineageNodeService(),
            new DerivationRuleService(),
            new DerivationGraphService());
        var request = new DeriveSegmentRequest(Guid.NewGuid(), 3, fixture.FirstRule.Id);

        var created = await service.DeriveAsync(
            fixture.Context, sourceItem.Id, request, 7, CancellationToken.None);
        var replayed = await service.DeriveAsync(
            fixture.Context, sourceItem.Id, request, 7, CancellationToken.None);
        var derived = await fixture.Context.Set<SegmentStudioItem>().SingleAsync(item => item.Id == created.ItemId);

        Assert.Equal("unreviewed", derived.ReviewState);
        Assert.Equal(20, derived.TagId);
        Assert.Equal(1, derived.Revision);
        Assert.True(replayed.Replayed);
        Assert.Equal(created.ItemId, replayed.ItemId);
        Assert.Single(await fixture.Context.Set<SegmentStudioDerivationEdge>()
            .Where(edge => edge.DerivedNodeId == created.LineageNodeId)
            .ToListAsync());
    }

    [Fact]
    public async Task RemovingLastSupportingEdgeRetiresInheritedAssertion()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var graph = new DerivationGraphService();
        var edge = await graph.CreateEdgeAsync(fixture.Context,
            new DerivationEdgeCreate(fixture.Root.Id, fixture.Child.Id, fixture.FirstRule.Id, null, null, "{}"),
            CancellationToken.None);

        await graph.RemoveEdgeAsync(fixture.Context, edge.Id, CancellationToken.None);

        var assertion = await fixture.Context.Set<SegmentStudioSegmentProvenance>()
            .SingleAsync(candidate => candidate.LineageNodeId == fixture.Child.Id);
        Assert.NotNull(assertion.SupersededAt);
    }

    [Fact]
    public async Task RuleRegistrationIsIdempotentButRejectsDefinitionDrift()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var service = new DerivationRuleService();
        var registration = new DerivationRuleRegistration(
            Guid.NewGuid(), "immutable", "1", 40, 41, """{"kind":"test"}""");

        var first = await service.RegisterAsync(fixture.Context, registration, CancellationToken.None);
        var replay = await service.RegisterAsync(fixture.Context, registration, CancellationToken.None);
        var conflict = await Assert.ThrowsAsync<LineageConflictException>(() =>
            service.RegisterAsync(
                fixture.Context,
                registration with { MetadataJson = """{"kind":"changed"}""" },
                CancellationToken.None));

        Assert.Equal(first.Id, replay.Id);
        Assert.Equal("LINEAGE_RULE_MISMATCH", conflict.Code);
    }

    [Fact]
    public async Task RuleRegistrationRejectsDuplicateRelationshipsAndCycles()
    {
        await using var fixture = await GraphFixture.CreateAsync();
        var service = new DerivationRuleService();

        await AssertCodeAsync("LINEAGE_RULE_DUPLICATE", () =>
            service.RegisterAsync(
                fixture.Context,
                new DerivationRuleRegistration(
                    Guid.NewGuid(), "duplicate", "1", 10, 20, "{}"),
                CancellationToken.None));
        await AssertCodeAsync("LINEAGE_CYCLE", () =>
            service.RegisterAsync(
                fixture.Context,
                new DerivationRuleRegistration(
                    Guid.NewGuid(), "cycle", "1", 30, 10, "{}"),
                CancellationToken.None));

        Assert.Equal(2, await fixture.Context.Set<SegmentStudioDerivationRule>().CountAsync());
    }

    private static async Task AssertCodeAsync(string code, Func<Task> action)
    {
        var exception = await Assert.ThrowsAsync<LineageConflictException>(action);
        Assert.Equal(code, exception.Code);
    }

    private sealed class GraphFixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private GraphFixture(
            SqliteConnection connection,
            GraphDbContext context,
            SegmentStudioLineageNode root,
            SegmentStudioLineageNode parentTwo,
            SegmentStudioLineageNode child,
            SegmentStudioLineageNode grandchild,
            SegmentStudioLineageNode otherChild,
            SegmentStudioLineageNode otherVideo,
            SegmentStudioDerivationRule firstRule,
            SegmentStudioDerivationRule secondRule,
            SegmentStudioSource source)
        {
            _connection = connection;
            Context = context;
            Root = root;
            ParentTwo = parentTwo;
            Child = child;
            Grandchild = grandchild;
            OtherChild = otherChild;
            OtherVideo = otherVideo;
            FirstRule = firstRule;
            SecondRule = secondRule;
            Source = source;
        }

        public GraphDbContext Context { get; }
        public SegmentStudioLineageNode Root { get; }
        public SegmentStudioLineageNode ParentTwo { get; }
        public SegmentStudioLineageNode Child { get; }
        public SegmentStudioLineageNode Grandchild { get; }
        public SegmentStudioLineageNode OtherChild { get; }
        public SegmentStudioLineageNode OtherVideo { get; }
        public SegmentStudioDerivationRule FirstRule { get; }
        public SegmentStudioDerivationRule SecondRule { get; }
        public SegmentStudioSource Source { get; }

        public static async Task<GraphFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<GraphDbContext>().UseSqlite(connection).Options;
            var context = new GraphDbContext(options);
            await context.Database.EnsureCreatedAsync();
            var now = DateTime.UtcNow;
            SegmentStudioLineageNode Node(int video, int tag) => new()
            {
                Id = Guid.NewGuid(), State = "live", ItemId = Random.Shared.NextInt64(1, long.MaxValue),
                LastKnownVideoId = video, LastKnownTagId = tag, LastKnownStartSec = 1,
                CreatedAt = now, UpdatedAt = now,
            };
            var root = Node(1, 10);
            var parentTwo = Node(1, 12);
            var child = Node(1, 20);
            var grandchild = Node(1, 30);
            var otherChild = Node(1, 20);
            var otherVideo = Node(2, 20);
            var firstRule = new SegmentStudioDerivationRule
            {
                Id = Guid.NewGuid(), Key = "first", Version = "1", SourceTagId = 10,
                DerivedTagId = 20, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            };
            var secondRule = new SegmentStudioDerivationRule
            {
                Id = Guid.NewGuid(), Key = "second", Version = "1", SourceTagId = 20,
                DerivedTagId = 30, MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            };
            var source = new SegmentStudioSource
            {
                Key = "user", DisplayName = "User", MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            };
            context.AddRange(root, parentTwo, child, grandchild, otherChild, otherVideo, firstRule, secondRule, source);
            await context.SaveChangesAsync();
            context.Add(new SegmentStudioSegmentProvenance
            {
                LineageNodeId = root.Id, SourceId = source.Id, Relation = "origin",
                MetadataJson = "{}", CreatedAt = now, UpdatedAt = now,
            });
            await context.SaveChangesAsync();
            return new GraphFixture(connection, context, root, parentTwo, child, grandchild, otherChild, otherVideo, firstRule, secondRule, source);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class GraphDbContext(DbContextOptions<GraphDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioLineageNode>().HasIndex(node => node.ItemId).IsUnique();
            modelBuilder.Entity<SegmentStudioDerivationRule>().HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>()
                .HasIndex(edge => new { edge.SourceNodeId, edge.DerivedNodeId, edge.RuleId }).IsUnique();
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
        }
    }
}
