using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class LineageIntegrityServiceTests
{
    [Fact]
    public async Task DetectsExternalRootAndDerivedTagChangesAndPersistsIssues()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.RootItem.TagId = 99;
        graph.DerivedItem.TagId = 98;
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.RootItem.Id, true, CancellationToken.None);

        Assert.Contains(result.Issues, issue => issue.Kind == "root-tag-mismatch");
        Assert.Contains(result.Issues, issue => issue.Kind == "derived-tag-mismatch");
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioLineageIssue>()
            .CountAsync(issue => issue.State == "open"));
    }

    [Fact]
    public async Task DetectsMissingEndpointsRuleCycleAndCrossVideoEdge()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.RootNode.State = "missing";
        graph.RootNode.ItemId = null;
        graph.DerivedNode.LastKnownVideoId = 2;
        graph.Edge.RuleId = Guid.NewGuid();
        fixture.Context.Add(new SegmentStudioDerivationEdge
        {
            SourceNodeId = graph.DerivedNode.Id,
            DerivedNodeId = graph.RootNode.Id,
            RuleId = Guid.NewGuid(),
            SourceTagIdAtCreation = 20,
            DerivedTagIdAtCreation = 10,
            MetadataJson = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.DerivedItem.Id, false, CancellationToken.None);

        Assert.Contains(result.Issues, issue => issue.Kind == "missing-endpoint");
        Assert.Contains(result.Issues, issue => issue.Kind == "missing-rule");
        Assert.Contains(result.Issues, issue => issue.Kind == "cross-video-edge");
        Assert.Contains(result.Issues, issue => issue.Kind == "cycle");
    }

    [Fact]
    public async Task RepeatedUnchangedFullScanDoesNotDuplicateIssues()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.DerivedItem.TagId = 99;
        await fixture.Context.SaveChangesAsync();

        var first = await fixture.Service.RunFullScanAsync(
            fixture.Context, 7, 100, CancellationToken.None);
        var second = await fixture.Service.RunFullScanAsync(
            fixture.Context, 7, 100, CancellationToken.None);

        Assert.Equal("completed", first.State);
        Assert.Equal("completed", second.State);
        Assert.Single(await fixture.Context.Set<SegmentStudioLineageIssue>()
            .Where(issue => issue.State == "open")
            .ToListAsync());
    }

    [Fact]
    public async Task ResumedScanRestartsWhenANonNewestNativeSegmentIsDeleted()
    {
        await using var fixture = await Fixture.CreateAsync();
        await fixture.AddGraphAsync();
        var older = new Segment
        {
            HostType = SegmentHostType.Video,
            HostId = 1,
            Kind = "tag",
            TagId = 10,
            SourceKey = "user",
            StartSec = 1,
            CreatedAt = DateTime.UtcNow.AddMinutes(-2),
            UpdatedAt = DateTime.UtcNow.AddMinutes(-2),
        };
        var newer = new Segment
        {
            HostType = SegmentHostType.Video,
            HostId = 1,
            Kind = "tag",
            TagId = 20,
            SourceKey = "user",
            StartSec = 2,
            CreatedAt = DateTime.UtcNow.AddMinutes(-1),
            UpdatedAt = DateTime.UtcNow.AddMinutes(-1),
        };
        fixture.Context.AddRange(older, newer);
        await fixture.Context.SaveChangesAsync();
        var first = await fixture.Service.RunFullScanAsync(
            fixture.Context, 7, 1, CancellationToken.None);
        var firstFingerprint = first.SourceFingerprint;

        fixture.Context.Remove(older);
        await fixture.Context.SaveChangesAsync();
        var resumed = await fixture.Service.RunFullScanAsync(
            fixture.Context, 7, 1, CancellationToken.None);

        Assert.NotEqual(firstFingerprint, resumed.SourceFingerprint);
        Assert.Equal("pending", resumed.State);
    }

    [Fact]
    public async Task DetectsRuleVersionDrift()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.Rule.Version = "2";
        graph.Rule.UpdatedAt = DateTime.UtcNow;
        await fixture.Context.SaveChangesAsync();

        var result = await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.RootItem.Id, false, CancellationToken.None);

        var issue = Assert.Single(result.Issues, issue => issue.Kind == "missing-rule-version");
        Assert.Contains("\"expected\":\"1\"", issue.DetailsJson);
        Assert.Contains("\"actual\":\"2\"", issue.DetailsJson);
    }

    [Fact]
    public async Task RecalculateRepairRefreshesRuleVersionSnapshot()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.Rule.Version = "2";
        graph.Rule.UpdatedAt = DateTime.UtcNow;
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.RootItem.Id, true, CancellationToken.None);
        var issue = await fixture.Context.Set<SegmentStudioLineageIssue>()
            .SingleAsync(candidate => candidate.IssueKind == "missing-rule-version");
        var preview = await fixture.Service.PreviewRepairAsync(
            fixture.Context, issue.Id, "recalculate", CancellationToken.None);

        await fixture.Service.ExecuteRepairAsync(
            fixture.Context,
            issue.Id,
            new LineageRepairExecuteRequest(Guid.NewGuid(), "recalculate", preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal("2", graph.Edge.RuleVersionAtCreation);
        Assert.Equal("resolved", issue.State);
    }

    [Fact]
    public async Task RestoreTagRepairIsFingerprintGuardedAndTransactional()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.DerivedItem.TagId = 99;
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.DerivedItem.Id, true, CancellationToken.None);
        var issue = await fixture.Context.Set<SegmentStudioLineageIssue>()
            .SingleAsync(candidate => candidate.IssueKind == "derived-tag-mismatch");
        var preview = await fixture.Service.PreviewRepairAsync(
            fixture.Context, issue.Id, "restore-tag", CancellationToken.None);

        var operationId = Guid.NewGuid();
        var request = new LineageRepairExecuteRequest(
            operationId, "restore-tag", preview.Fingerprint);
        await fixture.Service.ExecuteRepairAsync(
            fixture.Context,
            issue.Id,
            request,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        await fixture.Service.ExecuteRepairAsync(
            fixture.Context,
            issue.Id,
            request,
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal(20, graph.DerivedItem.TagId);
        Assert.Equal("resolved", issue.State);
        Assert.NotNull(issue.ResolvedAt);
        Assert.Single(await fixture.Context.Set<SegmentStudioSegmentOperation>()
            .Where(operation => operation.OperationId == operationId)
            .ToListAsync());
    }

    [Fact]
    public async Task ConcurrentChangeInvalidatesRepairPreviewAndIgnoredIssueStaysBlocking()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.DerivedItem.TagId = 99;
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.DerivedItem.Id, true, CancellationToken.None);
        var issue = await fixture.Context.Set<SegmentStudioLineageIssue>()
            .SingleAsync(candidate => candidate.IssueKind == "derived-tag-mismatch");
        var restorePreview = await fixture.Service.PreviewRepairAsync(
            fixture.Context, issue.Id, "restore-tag", CancellationToken.None);
        graph.DerivedNode.UpdatedAt = graph.DerivedNode.UpdatedAt.AddSeconds(1);
        await fixture.Context.SaveChangesAsync();

        var stale = await Assert.ThrowsAsync<LineageConflictException>(() =>
            fixture.Service.ExecuteRepairAsync(
                fixture.Context,
                issue.Id,
                new LineageRepairExecuteRequest(
                    Guid.NewGuid(), "restore-tag", restorePreview.Fingerprint),
                fixture.Principal,
                fixture.Authorization,
                CancellationToken.None));
        Assert.Equal("LINEAGE_COMPONENT_CHANGED", stale.Code);

        var ignorePreview = await fixture.Service.PreviewRepairAsync(
            fixture.Context, issue.Id, "ignore", CancellationToken.None);
        await fixture.Service.ExecuteRepairAsync(
            fixture.Context,
            issue.Id,
            new LineageRepairExecuteRequest(Guid.NewGuid(), "ignore", ignorePreview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);
        Assert.Equal("ignored", issue.State);
        Assert.Null(issue.ResolvedAt);

        await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.DerivedItem.Id, true, CancellationToken.None);
        Assert.Single(await fixture.Context.Set<SegmentStudioLineageIssue>()
            .Where(candidate => candidate.IssueFingerprint == issue.IssueFingerprint)
            .ToListAsync());
        Assert.False(await fixture.Context.Set<SegmentStudioLineageIssue>()
            .AnyAsync(candidate => candidate.IssueFingerprint == issue.IssueFingerprint
                && candidate.State == "open"));
    }

    [Fact]
    public async Task ComponentOnlyCycleIssueCanBeIgnored()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        fixture.Context.Add(new SegmentStudioDerivationEdge
        {
            SourceNodeId = graph.DerivedNode.Id,
            DerivedNodeId = graph.RootNode.Id,
            RuleId = graph.Rule.Id,
            RuleVersionAtCreation = graph.Rule.Version,
            SourceTagIdAtCreation = 20,
            DerivedTagIdAtCreation = 10,
            MetadataJson = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        });
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.RootItem.Id, true, CancellationToken.None);
        var issue = await fixture.Context.Set<SegmentStudioLineageIssue>()
            .SingleAsync(candidate => candidate.IssueKind == "cycle");
        Assert.NotNull(issue.LineageNodeId);
        var preview = await fixture.Service.PreviewRepairAsync(
            fixture.Context, issue.Id, "ignore", CancellationToken.None);

        await fixture.Service.ExecuteRepairAsync(
            fixture.Context,
            issue.Id,
            new LineageRepairExecuteRequest(Guid.NewGuid(), "ignore", preview.Fingerprint),
            fixture.Principal,
            fixture.Authorization,
            CancellationToken.None);

        Assert.Equal("ignored", issue.State);
    }

    [Fact]
    public async Task RemoveRepairDeletesAnInconsistentComponentAndReplays()
    {
        await using var fixture = await Fixture.CreateAsync();
        var graph = await fixture.AddGraphAsync();
        graph.DerivedItem.TagId = 99;
        await fixture.Context.SaveChangesAsync();
        await fixture.Service.ValidateItemAsync(
            fixture.Context, graph.DerivedItem.Id, true, CancellationToken.None);
        var issue = await fixture.Context.Set<SegmentStudioLineageIssue>()
            .SingleAsync(candidate => candidate.IssueKind == "derived-tag-mismatch");
        var preview = await fixture.Service.PreviewRepairAsync(
            fixture.Context, issue.Id, "remove", CancellationToken.None);
        var request = new LineageRepairExecuteRequest(
            Guid.NewGuid(), "remove", preview.Fingerprint);

        await fixture.Service.ExecuteRepairAsync(
            fixture.Context, issue.Id, request, fixture.Principal, fixture.Authorization,
            CancellationToken.None);
        await fixture.Service.ExecuteRepairAsync(
            fixture.Context, issue.Id, request, fixture.Principal, fixture.Authorization,
            CancellationToken.None);

        Assert.Empty(await fixture.Context.Set<SegmentStudioItem>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioLineageNode>().ToListAsync());
        Assert.Empty(await fixture.Context.Set<SegmentStudioLineageIssue>().ToListAsync());
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private Fixture(SqliteConnection connection, IntegrityDbContext context)
        {
            _connection = connection;
            Context = context;
            Authorization = new AllowAuthorizationService();
            var graph = new DerivationGraphService();
            var reconciliation = new LineageReconciliationService(graph);
            var deletion = new SegmentLineageDeletionService();
            Service = new LineageIntegrityService(reconciliation, deletion);
        }

        public IntegrityDbContext Context { get; }
        public LineageIntegrityService Service { get; }
        public AllowAuthorizationService Authorization { get; }
        public CovePrincipal Principal { get; } = CovePrincipal.System();

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<IntegrityDbContext>()
                .UseSqlite(connection)
                .Options;
            var context = new IntegrityDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return new Fixture(connection, context);
        }

        public async Task<GraphState> AddGraphAsync()
        {
            var now = DateTime.UtcNow;
            Context.AddRange(
                new Tag { Id = 10, Name = "Root tag" },
                new Tag { Id = 20, Name = "Derived tag" });
            var rootItem = Item(1, 10, now);
            var derivedItem = Item(1, 20, now);
            Context.AddRange(rootItem, derivedItem);
            await Context.SaveChangesAsync();
            var rootNode = Node(rootItem.Id, 1, 10, now);
            var derivedNode = Node(derivedItem.Id, 1, 20, now);
            var rule = new SegmentStudioDerivationRule
            {
                Id = Guid.NewGuid(),
                Key = "rule",
                Version = "1",
                SourceTagId = 10,
                DerivedTagId = 20,
                MetadataJson = "{}",
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.AddRange(rootNode, derivedNode, rule);
            await Context.SaveChangesAsync();
            var edge = new SegmentStudioDerivationEdge
            {
                SourceNodeId = rootNode.Id,
                DerivedNodeId = derivedNode.Id,
                RuleId = rule.Id,
                RuleVersionAtCreation = rule.Version,
                SourceTagIdAtCreation = 10,
                DerivedTagIdAtCreation = 20,
                MetadataJson = "{}",
                CreatedAt = now,
                UpdatedAt = now,
            };
            Context.Add(edge);
            await Context.SaveChangesAsync();
            return new(rootItem, derivedItem, rootNode, derivedNode, rule, edge);
        }

        private static SegmentStudioItem Item(int videoId, int tagId, DateTime now) => new()
        {
            VideoId = videoId,
            TagId = tagId,
            StartSec = 1,
            Kind = "tag",
            SourceKey = "user",
            ReviewState = "unreviewed",
            Revision = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };

        private static SegmentStudioLineageNode Node(
            long itemId, int videoId, int tagId, DateTime now) => new()
        {
            Id = Guid.NewGuid(),
            ItemId = itemId,
            State = "live",
            LastKnownVideoId = videoId,
            LastKnownTagId = tagId,
            LastKnownStartSec = 1,
            CreatedAt = now,
            UpdatedAt = now,
        };

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed record GraphState(
        SegmentStudioItem RootItem,
        SegmentStudioItem DerivedItem,
        SegmentStudioLineageNode RootNode,
        SegmentStudioLineageNode DerivedNode,
        SegmentStudioDerivationRule Rule,
        SegmentStudioDerivationEdge Edge);

    private sealed class IntegrityDbContext(
        DbContextOptions<IntegrityDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioItem>(builder =>
            {
                builder.HasKey(item => item.Id);
                builder.Ignore(item => item.Slots);
            });
            modelBuilder.Entity<SegmentStudioLineageNode>().HasKey(node => node.Id);
            modelBuilder.Entity<SegmentStudioDerivationRule>().HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>().HasKey(edge => edge.Id);
            modelBuilder.Entity<SegmentStudioLineageIssue>().HasKey(issue => issue.Id);
            modelBuilder.Entity<SegmentStudioLineageScanRun>().HasKey(run => run.Id);
            modelBuilder.Entity<SegmentStudioSegmentOperation>().HasKey(operation => operation.OperationId);
            modelBuilder.Entity<SegmentStudioSegmentProvenance>().HasKey(assertion => assertion.Id);
            modelBuilder.Entity<SegmentStudioSource>().HasKey(source => source.Id);
            modelBuilder.Entity<SegmentStudioProvenanceActivity>().HasKey(activity => activity.Id);
            modelBuilder.Entity<SegmentStudioBlobCleanupOutbox>().HasKey(entry => entry.Id);
            modelBuilder.Entity<SegmentStudioUserPreference>().HasKey(preference => preference.UserId);
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
                builder.Ignore(segment => segment.Payload);
                builder.Ignore(segment => segment.Tag);
            });
        }
    }

    public sealed class AllowAuthorizationService : IAuthorizationService
    {
        public AuthorizationResult Authorize(
            CovePrincipal? principal, string permission, EntityRef? entity = null) =>
            AuthorizationResult.Allow();
        public Task<AuthorizationResult> AuthorizeAsync(
            CovePrincipal? principal, string permission, EntityRef? entity,
            CancellationToken ct) =>
            Task.FromResult(AuthorizationResult.Allow());
        public void Require(CovePrincipal? principal, string permission, EntityRef? entity = null) { }
        public bool Has(CovePrincipal? principal, string permission) => true;
    }
}
