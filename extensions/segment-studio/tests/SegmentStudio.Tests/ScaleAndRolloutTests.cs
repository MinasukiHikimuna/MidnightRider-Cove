using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class ScaleAndRolloutTests
{
    [Fact]
    public async Task RolloutCanPauseAndResumeWritesWithoutDeletingState()
    {
        await using var fixture = await Fixture.CreateAsync();
        var state = await SegmentStudioRolloutService.GetAsync(
            fixture.Context, CancellationToken.None);
        Assert.False(state.LineageRolloutPaused);

        await SegmentStudioRolloutService.SetPausedAsync(
            fixture.Context, true, CancellationToken.None);
        var blocked = await Assert.ThrowsAsync<LineageConflictException>(() =>
            SegmentStudioRolloutService.EnsureWritesEnabledAsync(
                fixture.Context, CancellationToken.None));
        Assert.Equal("LINEAGE_ROLLOUT_PAUSED", blocked.Code);

        await SegmentStudioRolloutService.SetPausedAsync(
            fixture.Context, false, CancellationToken.None);
        await SegmentStudioRolloutService.EnsureWritesEnabledAsync(
            fixture.Context, CancellationToken.None);
        Assert.Single(await fixture.Context.Set<SegmentStudioInstallationState>()
            .ToListAsync());
    }

    [Fact]
    public async Task OpenIssueApiIsStablyPaginatedAndBounded()
    {
        await using var fixture = await Fixture.CreateAsync();
        for (var index = 0; index < 205; index++)
        {
            fixture.Context.Add(new SegmentStudioLineageIssue
            {
                Id = Guid.NewGuid(),
                IssueFingerprint = $"issue-{index}",
                ComponentKey = "component",
                IssueKind = "cycle",
                State = "open",
                DetailsJson = "{}",
                FirstDetectedAt = DateTime.UtcNow.AddMinutes(-index),
                LastDetectedAt = DateTime.UtcNow.AddMinutes(-index),
            });
        }
        await fixture.Context.SaveChangesAsync();
        var service = new LineageIntegrityService(null!, null!);

        var first = await service.ListIssuesAsync(
            fixture.Context, 1, 500, CancellationToken.None);
        var third = await service.ListIssuesAsync(
            fixture.Context, 3, 100, CancellationToken.None);

        Assert.Equal(205, first.Total);
        Assert.Equal(100, first.PerPage);
        Assert.Equal(100, first.Items.Count);
        Assert.Equal(5, third.Items.Count);
        Assert.Empty(first.Items.Select(issue => issue.Id)
            .Intersect(third.Items.Select(issue => issue.Id)));
    }

    [Fact]
    public async Task LargeComponentTraversalUsesBatchesAndReturnsEveryEdge()
    {
        await using var fixture = await Fixture.CreateAsync();
        var rule = new SegmentStudioDerivationRule
        {
            Id = Guid.NewGuid(),
            Key = "scale",
            Version = "1",
            SourceTagId = 1,
            DerivedTagId = 2,
            MetadataJson = "{}",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };
        fixture.Context.Add(rule);
        var node = Guid.NewGuid();
        var firstNode = node;
        for (var index = 0; index < 1_200; index++)
        {
            var next = Guid.NewGuid();
            fixture.Context.Add(new SegmentStudioDerivationEdge
            {
                SourceNodeId = node,
                DerivedNodeId = next,
                RuleId = rule.Id,
                RuleVersionAtCreation = "1",
                SourceTagIdAtCreation = 1,
                DerivedTagIdAtCreation = 2,
                MetadataJson = "{}",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            });
            node = next;
        }
        await fixture.Context.SaveChangesAsync();

        var edges = await new DerivationGraphService().GetComponentEdgesAsync(
            fixture.Context, firstNode, CancellationToken.None);

        Assert.Equal(1_200, edges.Count);
    }

    private sealed class Fixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;
        private Fixture(SqliteConnection connection, ScaleDbContext context)
        {
            _connection = connection;
            Context = context;
        }

        public ScaleDbContext Context { get; }

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new ScaleDbContext(
                new DbContextOptionsBuilder<ScaleDbContext>()
                    .UseSqlite(connection)
                    .Options);
            await context.Database.EnsureCreatedAsync();
            return new Fixture(connection, context);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class ScaleDbContext(DbContextOptions<ScaleDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioInstallationState>()
                .HasKey(state => state.Id);
            modelBuilder.Entity<SegmentStudioLineageIssue>()
                .HasKey(issue => issue.Id);
            modelBuilder.Entity<SegmentStudioDerivationRule>()
                .HasKey(rule => rule.Id);
            modelBuilder.Entity<SegmentStudioDerivationEdge>()
                .HasKey(edge => edge.Id);
        }
    }
}
