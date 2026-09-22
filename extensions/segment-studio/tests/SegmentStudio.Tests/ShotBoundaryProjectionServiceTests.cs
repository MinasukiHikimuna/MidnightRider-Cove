using System.Text.Json;
using AI.Extensions.Abstractions;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging.Abstractions;
using SegmentStudio;
using Xunit;

namespace SegmentStudio.Tests;

public class ShotBoundaryProjectionServiceTests
{
    // ── the partition contract ───────────────────────────────────────────

    [Fact]
    public void ContiguousPartitionIsValid()
        => Assert.True(ShotBoundaryProjectionService.IsValidShotBoundaryResult(
            [B(0, 4), B(4, 8), B(8, 12)], 12));

    [Theory]
    [InlineData(0.0, 4.0, 5.0, 12.0)]   // gap between boundaries
    [InlineData(0.0, 6.0, 4.0, 12.0)]   // overlap
    [InlineData(1.0, 4.0, 4.0, 12.0)]   // does not start at zero
    [InlineData(0.0, 4.0, 4.0, 20.0)]   // does not reach the duration
    public void NonPartitionsAreRejected(double s1, double e1, double s2, double duration)
        => Assert.False(ShotBoundaryProjectionService.IsValidShotBoundaryResult(
            [B(s1, e1), B(s2, 12)], duration));

    [Fact]
    public void EmptyResultIsRejected()
        => Assert.False(ShotBoundaryProjectionService.IsValidShotBoundaryResult([], 12));

    // ── projection ───────────────────────────────────────────────────────

    [Fact]
    public async Task WritesBoundariesWhenNoneExist()
    {
        await using var fixture = await Fixture.CreateAsync();
        var result = await Project(fixture, [B(0, 4), B(4, 8), B(8, 12)]);

        Assert.Null(result.SkippedReason);
        Assert.False(result.Replaced);
        Assert.Equal(3, result.Written);

        var rows = await fixture.Context.Set<SegmentStudioShotBoundary>().OrderBy(r => r.StartSec).ToListAsync();
        Assert.Equal(3, rows.Count);
        Assert.All(rows, row => Assert.Equal("omnishotcut", row.Source));
        Assert.Equal(12, rows[^1].EndSec);
    }

    [Fact]
    public async Task KeepsExistingBoundariesUnlessReplacingIsRequested()
    {
        await using var fixture = await Fixture.CreateAsync();
        await Project(fixture, [B(0, 12)]);

        var result = await Project(fixture, [B(0, 4), B(4, 8), B(8, 12)]);

        Assert.Equal("boundaries_exist", result.SkippedReason);
        Assert.Single(await fixture.Context.Set<SegmentStudioShotBoundary>().ToListAsync());
    }

    [Fact]
    public async Task ReplacesExistingBoundariesWhenAsked()
    {
        await using var fixture = await Fixture.CreateAsync();
        await Project(fixture, [B(0, 12)]);

        var result = await Project(fixture, [B(0, 4), B(4, 8), B(8, 12)], replace: true);

        Assert.True(result.Replaced);
        Assert.Equal(3, result.Written);
        Assert.Equal(3, await fixture.Context.Set<SegmentStudioShotBoundary>().CountAsync());
    }

    [Fact]
    public async Task RejectsABoundarySetThatIsNotAPartition()
    {
        await using var fixture = await Fixture.CreateAsync();
        var exception = await Assert.ThrowsAsync<SegmentStudioAnalysisPersistenceException>(
            () => Project(fixture, [B(0, 4), B(5, 12)]));
        Assert.Equal("invalid_shot_boundaries", exception.Code);
        Assert.Empty(await fixture.Context.Set<SegmentStudioShotBoundary>().ToListAsync());
    }

    [Fact]
    public async Task RecordsProvenanceInMetadata()
    {
        await using var fixture = await Fixture.CreateAsync();
        await Project(fixture, [B(0, 12, "Hard_Cut")]);

        var row = await fixture.Context.Set<SegmentStudioShotBoundary>().SingleAsync();
        using var metadata = JsonDocument.Parse(row.MetadataJson!);
        Assert.Equal("run-1", metadata.RootElement.GetProperty("runId").GetString());
        Assert.Equal("omnishotcut_shot_boundaries", metadata.RootElement.GetProperty("model").GetString());
        Assert.Equal("clean_shot", metadata.RootElement.GetProperty("mode").GetString());
        Assert.Equal("Hard_Cut", metadata.RootElement.GetProperty("transitionAfter").GetString());
    }

    // ── contributor dispatch ─────────────────────────────────────────────

    [Fact]
    public async Task ContributorProjectsAssetScopeAnalysis()
    {
        await using var fixture = await Fixture.CreateAsync();
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(Dispatch(fixture, """
        {
          "model": "omnishotcut_shot_boundaries",
          "mode": "clean_shot",
          "duration_seconds": 12.0,
          "boundaries": [
            {"start_seconds": 0.0, "end_seconds": 4.0, "transition_after": null},
            {"start_seconds": 4.0, "end_seconds": 8.0, "transition_after": "Hard_Cut"},
            {"start_seconds": 8.0, "end_seconds": 12.0, "transition_after": "Hard_Cut"}
          ]
        }
        """));

        Assert.Equal(3, result.PreparedCounts["shot_boundaries"]);
        Assert.Empty(result.Notes);
        Assert.Equal(3, await fixture.Context.Set<SegmentStudioShotBoundary>().CountAsync());
    }

    [Fact]
    public async Task ContributorReportsWhenTheServerReturnedNoShotBoundaries()
    {
        await using var fixture = await Fixture.CreateAsync();
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(
            Dispatch(fixture, payload: null));

        Assert.Equal(0, result.PreparedCounts["shot_boundaries"]);
        Assert.Contains(result.Notes, note => note.Contains("no shot-boundary output"));
    }

    [Fact]
    public async Task ContributorIgnoresRunsNotAnchoredToAVideo()
    {
        await using var fixture = await Fixture.CreateAsync();
        var contributor = fixture.CreateContributor();

        var result = await contributor.DispatchAsync(
            Dispatch(fixture, """{"boundaries":[{"start_seconds":0.0,"end_seconds":12.0}]}""",
                hostEntityType: "image"));

        Assert.Contains(result.Notes, note => note.Contains("not anchored to a Cove video"));
        Assert.Empty(await fixture.Context.Set<SegmentStudioShotBoundary>().ToListAsync());
    }

    [Fact]
    public async Task ContributorProjectsInsideATransaction()
    {
        // The shot-boundary mutation locks are transaction-scoped advisory locks,
        // so Postgres rejects a projection that runs without one. SQLite does not,
        // which is why this asserts the invariant directly rather than relying on
        // the provider to enforce it.
        await using var fixture = await Fixture.CreateAsync(probe: new TransactionProbe());

        await fixture.CreateContributor().DispatchAsync(Dispatch(fixture, """
        {"duration_seconds": 12.0, "boundaries": [{"start_seconds": 0.0, "end_seconds": 12.0}]}
        """));

        Assert.True(fixture.Probe!.SawTransaction, "the projection must run inside a transaction");
    }

    private sealed class TransactionProbe : IShotBoundaryProjectionService
    {
        private readonly ShotBoundaryProjectionService _inner = new();

        public bool SawTransaction { get; private set; }

        public Task<ShotBoundaryProjectionResult> ProjectAsync(
            DbContext db, ShotBoundaryProjectionRequest request, CancellationToken ct = default)
        {
            SawTransaction = db.Database.CurrentTransaction is not null;
            return _inner.ProjectAsync(db, request, ct);
        }
    }

    // ── helpers ──────────────────────────────────────────────────────────

    private const int VideoId = 42;

    private static SegmentStudioAnalysisBoundary B(double start, double end, string? transition = null)
        => new(start, end, transition);

    private static async Task<ShotBoundaryProjectionResult> Project(
        Fixture fixture, SegmentStudioAnalysisBoundary[] boundaries, bool replace = false)
    {
        var service = new ShotBoundaryProjectionService();
        var result = await service.ProjectAsync(fixture.Context, new ShotBoundaryProjectionRequest(
            VideoId, boundaries, 12, Guid.NewGuid(), "run-1", "omnishotcut_shot_boundaries", "clean_shot")
        { Replace = replace });
        await fixture.Context.SaveChangesAsync();
        return result;
    }

    private static AiDispatchRequest Dispatch(
        Fixture fixture, string? payload, string hostEntityType = "video")
    {
        var other = payload is null
            ? new Dictionary<string, string>()
            : new Dictionary<string, string> { ["shot_boundaries"] = payload };

        return new AiDispatchRequest(
            new AiRunContext("run-1", AiMediaKinds.Video, "/media/example.mp4", "/media/example.mp4",
                hostEntityType, VideoId, 12.0, 2.0),
            // Only the shot-boundary claim: these cases are about that projection,
            // and the contributor now also routes tagging.
            [.. fixture.CreateContributor().Describe().Claims
                .Where(claim => claim.ClaimId == SegmentStudioAiContributor.ShotBoundaryClaimId)],
            new AiAnalyzeResult
            {
                MediaKind = AiMediaKinds.Video,
                AssetId = "/media/example.mp4",
                DurationSeconds = 12.0,
                AssetAnalysis = new AiAnalysisNode { Other = other },
            });
    }

    private sealed class Fixture(
        SqliteConnection connection,
        ShotDbContext context,
        ServiceProvider services,
        TransactionProbe? probe) : IAsyncDisposable
    {
        public ShotDbContext Context { get; } = context;

        public TransactionProbe? Probe { get; } = probe;

        public static async Task<Fixture> CreateAsync(TransactionProbe? probe = null)
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new ShotDbContext(new DbContextOptionsBuilder<ShotDbContext>()
                .UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();

            // The contributor opens its own scope per dispatch, so it needs a
            // container that resolves the same context the assertions read from.
            var services = new ServiceCollection();
            services.AddSingleton<DbContext>(context);
            if (probe is null)
                services.AddSingleton<IShotBoundaryProjectionService, ShotBoundaryProjectionService>();
            else
                services.AddSingleton<IShotBoundaryProjectionService>(probe);
            return new Fixture(connection, context, services.BuildServiceProvider(), probe);
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

    private sealed class ShotDbContext(DbContextOptions<ShotDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioShotBoundary>(builder =>
            {
                builder.ToTable("segment_studio_shot_boundaries");
                builder.HasKey(row => row.Id);
                builder.Property(row => row.Id).ValueGeneratedOnAdd();
                builder.HasIndex(row => new { row.VideoId, row.StartSec }).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioShotBoundaryOperation>(builder =>
            {
                builder.ToTable("segment_studio_shot_boundary_operations");
                builder.HasKey(row => row.OperationId);
            });
        }
    }
}
