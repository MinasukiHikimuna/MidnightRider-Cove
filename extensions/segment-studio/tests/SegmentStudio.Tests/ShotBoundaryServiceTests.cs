namespace SegmentStudio.Tests;

using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

public sealed class ShotBoundaryServiceTests
{
    [Fact]
    public async Task FirstSplitCreatesCompleteAdjacentShotRanges()
    {
        await using var fixture = await Fixture.CreateAsync();

        var result = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, result.Status);
        Assert.Collection(result.Boundaries!,
            first => Assert.Equal((0d, 4d), (first.StartSec, first.EndSec)),
            second => Assert.Equal((4d, 10d), (second.StartSec, second.EndSec)));
    }

    [Fact]
    public async Task SplitAndMergeRoundTripWithoutCreatingCanonicalSegments()
    {
        await using var fixture = await Fixture.CreateAsync();
        var first = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);

        var split = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 7), 10, default);
        var merged = await ShotBoundaryService.MergeAsync(
            fixture.Context, 7, new MergeShotBoundaryRequest(Guid.NewGuid(), 7), default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, split.Status);
        Assert.Equal(ShotBoundaryMutationStatus.Updated, merged.Status);
        Assert.Equal(first.Boundaries!.Select(row => (row.StartSec, row.EndSec)),
            merged.Boundaries!.Select(row => (row.StartSec, row.EndSec)));
    }

    [Fact]
    public async Task ReplayedOperationReturnsStoredResultWithoutDuplicatingRanges()
    {
        await using var fixture = await Fixture.CreateAsync();
        var operationId = Guid.NewGuid();
        var request = new SplitShotBoundaryRequest(operationId, 4);

        var first = await ShotBoundaryService.SplitAsync(fixture.Context, 7, request, 10, default);
        var replay = await ShotBoundaryService.SplitAsync(fixture.Context, 7, request, 10, default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, replay.Status);
        Assert.Equal(first.Boundaries!.Select(row => row.Id), replay.Boundaries!.Select(row => row.Id));
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioShotBoundary>().CountAsync());
    }

    [Fact]
    public async Task SplitRejectsExistingBoundaryAndOutOfRangeTimes()
    {
        await using var fixture = await Fixture.CreateAsync();
        await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);

        var duplicate = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);
        var outside = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 11), 10, default);

        Assert.Equal(ShotBoundaryMutationStatus.Invalid, duplicate.Status);
        Assert.Equal(ShotBoundaryMutationStatus.Invalid, outside.Status);
    }

    [Fact]
    public async Task OperationIdCannotBeReusedForAnotherMutation()
    {
        await using var fixture = await Fixture.CreateAsync();
        var operationId = Guid.NewGuid();
        await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(operationId, 4), 10, default);

        var conflict = await ShotBoundaryService.MergeAsync(
            fixture.Context, 7, new MergeShotBoundaryRequest(operationId, 4), default);

        Assert.Equal(ShotBoundaryMutationStatus.Conflict, conflict.Status);
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioShotBoundary>().CountAsync());
    }

    [Fact]
    public async Task MergeRejectsVideoStartAndNonexistentBoundaries()
    {
        await using var fixture = await Fixture.CreateAsync();
        await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);

        var start = await ShotBoundaryService.MergeAsync(
            fixture.Context, 7, new MergeShotBoundaryRequest(Guid.NewGuid(), 0), default);
        var missing = await ShotBoundaryService.MergeAsync(
            fixture.Context, 7, new MergeShotBoundaryRequest(Guid.NewGuid(), 6), default);

        Assert.Equal(ShotBoundaryMutationStatus.Invalid, start.Status);
        Assert.Equal(ShotBoundaryMutationStatus.Invalid, missing.Status);
    }

    [Fact]
    public async Task RestoreReinstatesExactIdentityProvenanceAndRevisionAfterMerge()
    {
        await using var fixture = await Fixture.CreateAsync();
        await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);
        var right = await fixture.Context.Set<SegmentStudioShotBoundary>()
            .SingleAsync(row => row.StartSec == 4);
        right.Source = "pyscenedetect";
        right.MetadataJson = """{"threshold":27}""";
        right.Revision = 8;
        await fixture.Context.SaveChangesAsync();
        var before = await ShotBoundaryService.ListAsync(fixture.Context, 7, default);

        var merged = await ShotBoundaryService.MergeAsync(
            fixture.Context, 7, new MergeShotBoundaryRequest(Guid.NewGuid(), 4), default);
        var restored = await ShotBoundaryService.RestoreAsync(
            fixture.Context,
            7,
            new RestoreShotBoundariesRequest(
                Guid.NewGuid(),
                string.Join(",", merged.Boundaries!.Select(row => $"{row.Id}:{row.Revision}")),
                before.Select(row => new ShotBoundaryRestoreItem(
                    row.Id, row.StartSec, row.EndSec, row.Source, row.Metadata,
                    row.Revision, AsUtc(row.CreatedAt), AsUtc(row.UpdatedAt))).ToArray()),
            10,
            default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, restored.Status);
        Assert.Equal(
            before.Select(row => (row.Id, row.StartSec, row.EndSec, row.Source, row.Metadata, row.Revision)),
            restored.Boundaries!.Select(row => (row.Id, row.StartSec, row.EndSec, row.Source, row.Metadata, row.Revision)));
    }

    [Fact]
    public async Task RestoreCanUndoTheFirstSplitToAnEmptySnapshot()
    {
        await using var fixture = await Fixture.CreateAsync();
        var split = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);

        var restored = await ShotBoundaryService.RestoreAsync(
            fixture.Context,
            7,
            new RestoreShotBoundariesRequest(
                Guid.NewGuid(),
                string.Join(",", split.Boundaries!.Select(row => $"{row.Id}:{row.Revision}")),
                []),
            10,
            default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, restored.Status);
        Assert.Empty(restored.Boundaries!);
        Assert.Empty(await fixture.Context.Set<SegmentStudioShotBoundary>().ToListAsync());
    }

    [Fact]
    public async Task RestoreOperationIdCannotBeReplayedWithADifferentSnapshot()
    {
        await using var fixture = await Fixture.CreateAsync();
        var split = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);
        var expected = string.Join(",", split.Boundaries!.Select(row => $"{row.Id}:{row.Revision}"));
        var operationId = Guid.NewGuid();
        var first = await ShotBoundaryService.RestoreAsync(
            fixture.Context, 7,
            new RestoreShotBoundariesRequest(operationId, expected, []), 10, default);

        var conflict = await ShotBoundaryService.RestoreAsync(
            fixture.Context, 7,
            new RestoreShotBoundariesRequest(
                operationId,
                expected,
                split.Boundaries!.Select(row => new ShotBoundaryRestoreItem(
                    row.Id, row.StartSec, row.EndSec, row.Source, row.Metadata,
                    row.Revision, AsUtc(row.CreatedAt), AsUtc(row.UpdatedAt))).ToArray()),
            10,
            default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, first.Status);
        Assert.Equal(ShotBoundaryMutationStatus.Conflict, conflict.Status);
    }

    [Fact]
    public async Task RestoreRejectsNullSnapshotsAndMalformedMetadata()
    {
        await using var fixture = await Fixture.CreateAsync();
        var split = await ShotBoundaryService.SplitAsync(
            fixture.Context, 7, new SplitShotBoundaryRequest(Guid.NewGuid(), 4), 10, default);
        var expected = string.Join(",", split.Boundaries!.Select(row => $"{row.Id}:{row.Revision}"));
        var first = split.Boundaries![0];
        var second = split.Boundaries[1];

        var nullSnapshot = await ShotBoundaryService.RestoreAsync(
            fixture.Context, 7,
            new RestoreShotBoundariesRequest(Guid.NewGuid(), expected, null!), 10, default);
        var malformed = await ShotBoundaryService.RestoreAsync(
            fixture.Context, 7,
            new RestoreShotBoundariesRequest(
                Guid.NewGuid(),
                expected,
                [
                    new(first.Id, first.StartSec, first.EndSec, first.Source, "{",
                        first.Revision, AsUtc(first.CreatedAt), AsUtc(first.UpdatedAt)),
                    new(second.Id, second.StartSec, second.EndSec, second.Source, second.Metadata,
                        second.Revision, AsUtc(second.CreatedAt), AsUtc(second.UpdatedAt)),
                ]),
            10,
            default);

        Assert.Equal(ShotBoundaryMutationStatus.Invalid, nullSnapshot.Status);
        Assert.Equal(ShotBoundaryMutationStatus.Invalid, malformed.Status);
        Assert.Equal(2, await fixture.Context.Set<SegmentStudioShotBoundary>().CountAsync());
    }

    private static DateTime AsUtc(DateTime value) => DateTime.SpecifyKind(value, DateTimeKind.Utc);

    private sealed class Fixture(SqliteConnection connection, ShotDbContext context) : IAsyncDisposable
    {
        public ShotDbContext Context { get; } = context;

        public static async Task<Fixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var context = new ShotDbContext(new DbContextOptionsBuilder<ShotDbContext>()
                .UseSqlite(connection).Options);
            await context.Database.EnsureCreatedAsync();
            return new Fixture(connection, context);
        }

        public async ValueTask DisposeAsync()
        {
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
