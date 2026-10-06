using System.Text.Json;
using Cove.Core.DTOs;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;
using Xunit;

namespace SegmentStudio.Tests;

public sealed class NativeShotBoundariesTests
{
    private const int VideoId = 7;
    private const int FileId = 70;

    [Fact]
    public async Task ListsTheNativeSetAsEditorRowsCarryingTheSetRevisionAndShotDetails()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 3,
            Shot(0, 4, startFrame: 0, endFrame: 96, shotType: "Wide"),
            Shot(4, 10, startFrame: 96, endFrame: 240, transitionIn: "Hard_Cut")));

        var rows = await NativeShotBoundaries.ListAsync(db, shots, VideoId, default);

        Assert.NotNull(rows);
        Assert.Collection(rows,
            row =>
            {
                Assert.Equal((RowId(1), 0d, 4d, 3L, "omnishotcut_shot_boundaries"), (row.Id, row.StartSec, row.EndSec, row.Revision, row.Source));
                Assert.Equal(DateTimeKind.Utc, row.CreatedAt.Kind);
                using var metadata = JsonDocument.Parse(row.Metadata!);
                Assert.Equal("Wide", metadata.RootElement.GetProperty("shotType").GetString());
                Assert.Equal(96, metadata.RootElement.GetProperty("endFrame").GetInt32());
            },
            row => Assert.Equal((RowId(2), 4d, 10d, 3L), (row.Id, row.StartSec, row.EndSec, row.Revision)));
        Assert.Equal($"{RowId(1)}:3,{RowId(2)}:3", ShotBoundaryService.Fingerprint(rows));
    }

    [Fact]
    public void ASetWrittenAgainAtTheSameRevisionHasADifferentFingerprint()
    {
        var first = Set(revision: 1, Shot(0, 4), Shot(4, 10));
        var rewritten = first with { Id = first.Id + 1 };

        Assert.NotEqual(
            ShotBoundaryService.Fingerprint(NativeShotBoundaries.ToResponses(VideoId, first)),
            ShotBoundaryService.Fingerprint(NativeShotBoundaries.ToResponses(VideoId, rewritten)));
    }

    [Fact]
    public async Task LeavesAVideoWithOnlySegmentStudioRowsOnTheLegacyTable()
    {
        await using var db = CreateDb();
        await AddLegacyRowAsync(db);
        var shots = new FakeShotService(null);

        Assert.Null(await NativeShotBoundaries.ListAsync(db, shots, VideoId, default));
        Assert.Null(await NativeShotBoundaries.SplitAsync(db, shots, NoPrimaryFile, VideoId, new(Guid.NewGuid(), 2), default));
        Assert.Empty(shots.Calls);
    }

    [Fact]
    public async Task PrefersTheNativeSetOverSegmentStudioRows()
    {
        await using var db = CreateDb();
        await AddLegacyRowAsync(db);
        var shots = new FakeShotService(Set(revision: 1, Shot(0, 10)));

        var rows = await NativeShotBoundaries.ListAsync(db, shots, VideoId, default);

        Assert.Equal([RowId(1)], rows!.Select(row => row.Id));
    }

    [Fact]
    public async Task ListsNoShotsNativelyForAVideoWithNeither()
    {
        await using var db = CreateDb();

        Assert.Equal([], await NativeShotBoundaries.ListAsync(db, new FakeShotService(null), VideoId, default));
        Assert.Null(await NativeShotBoundaries.ListAsync(db, (IVideoShotService?)null, VideoId, default));
    }

    [Fact]
    public async Task SplitsAgainstTheVersionItReadAndReplaysTheSameOperationWithoutEditingTwice()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 2, Shot(0, 10)));
        var operation = Guid.NewGuid();

        var first = await NativeShotBoundaries.SplitAsync(db, shots, NoPrimaryFile, VideoId, new(operation, 4), default);
        var replay = await NativeShotBoundaries.SplitAsync(db, shots, NoPrimaryFile, VideoId, new(operation, 4), default);
        var reused = await NativeShotBoundaries.SplitAsync(db, shots, NoPrimaryFile, VideoId, new(operation, 6), default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, first!.Status);
        Assert.Equal([0d, 4d], first.Boundaries!.Select(row => row.StartSec));
        var split = Assert.IsType<VideoShotSplitRequest>(Assert.Single(shots.Calls));
        Assert.Equal((FileId, 4d, 2), (split.FileId, split.AtSec, split.Expected!.Revision));
        Assert.Equal(ShotBoundaryMutationStatus.Updated, replay!.Status);
        Assert.Equal(first.Boundaries!.Select(row => row.Id), replay.Boundaries!.Select(row => row.Id));
        Assert.Equal(ShotBoundaryMutationStatus.Conflict, reused!.Status);
        Assert.Single(shots.Calls);
        Assert.Equal("split", Assert.Single(db.Set<SegmentStudioShotBoundaryOperation>()).Kind);
    }

    [Fact]
    public async Task DrawsTheFirstShotsByHandOnThePrimaryFileWhenNothingIsStored()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(null);

        var result = await NativeShotBoundaries.SplitAsync(
            db, shots, (_, _) => Task.FromResult<int?>(FileId), VideoId, new(Guid.NewGuid(), 4), default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, result!.Status);
        var split = Assert.IsType<VideoShotSplitRequest>(Assert.Single(shots.Calls));
        Assert.Equal(FileId, split.FileId);
        Assert.Null(split.Expected);
    }

    [Fact]
    public async Task ReportsANativeConflictAndKeepsNoReceipt()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 1, Shot(0, 4), Shot(4, 10))) { NextStatus = VideoShotEditStatus.Conflict };

        var result = await NativeShotBoundaries.MergeAsync(db, shots, VideoId, new(Guid.NewGuid(), 4), default);

        Assert.Equal(ShotBoundaryMutationStatus.Conflict, result!.Status);
        Assert.Empty(db.Set<SegmentStudioShotBoundaryOperation>());
    }

    [Fact]
    public async Task RefusesAnUndoWhenTheShotsChangedSinceTheEditorLoadedThem()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 5, Shot(0, 10)));

        var result = await NativeShotBoundaries.RestoreAsync(
            db, shots, NoPrimaryFile, VideoId, new(Guid.NewGuid(), $"{RowId(1)}:4", [Restore(1, 0, 10)]), default);

        Assert.Equal(ShotBoundaryMutationStatus.Conflict, result!.Status);
        Assert.Empty(shots.Calls);
    }

    [Fact]
    public async Task RestoresAnUndoSnapshotWithItsShotDetailsAgainstTheCurrentVersion()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 4, Shot(0, 4), Shot(4, 10)));
        IReadOnlyList<ShotBoundaryRestoreItem> snapshot =
        [
            Restore(1, 0, 10, """{"shotType":"Wide","startFrame":0,"endFrame":240}"""),
        ];

        var result = await NativeShotBoundaries.RestoreAsync(
            db, shots, NoPrimaryFile, VideoId, new(Guid.NewGuid(), $"{RowId(1)}:4,{RowId(2)}:4", snapshot), default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, result!.Status);
        var replace = Assert.IsType<VideoShotReplaceRequest>(Assert.Single(shots.Calls));
        Assert.Equal(4, replace.Expected!.Revision);
        var input = Assert.Single(replace.Shots);
        Assert.Equal((0d, 10d, "Wide", 0, 240), (input.StartSec, input.EndSec, input.ShotType, input.StartFrame, input.EndFrame));
    }

    [Fact]
    public async Task DropsFramesFromAnUndoSnapshotUnlessEveryShotHasThem()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 1, Shot(0, 10)));

        await NativeShotBoundaries.RestoreAsync(db, shots, NoPrimaryFile, VideoId, new(Guid.NewGuid(), $"{RowId(1)}:1",
        [
            Restore(1, 0, 4, """{"startFrame":0,"endFrame":96}"""),
            Restore(2, 4, 10, """{"transitionIn":"Hard_Cut"}"""),
        ]), default);

        var replace = Assert.IsType<VideoShotReplaceRequest>(Assert.Single(shots.Calls));
        Assert.All(replace.Shots, input => Assert.Null(input.StartFrame));
        Assert.Equal("Hard_Cut", replace.Shots[1].TransitionIn);
    }

    [Fact]
    public async Task RestoresAnEmptySnapshotByDeletingTheSet()
    {
        await using var db = CreateDb();
        var shots = new FakeShotService(Set(revision: 1, Shot(0, 4), Shot(4, 10)));

        var result = await NativeShotBoundaries.RestoreAsync(db, shots, NoPrimaryFile, VideoId, new(Guid.NewGuid(), $"{RowId(1)}:1,{RowId(2)}:1", []), default);

        Assert.Equal(ShotBoundaryMutationStatus.Updated, result!.Status);
        Assert.Empty(result.Boundaries!);
        Assert.Equal(1, Assert.IsType<VideoShotDeleteRequest>(Assert.Single(shots.Calls)).Expected!.Revision);
    }

    // The editor row id of the shot at a 1-based position in the set with id 700.
    private static long RowId(int position) => (700L << 20) | (uint)position;

    private static readonly Func<int, CancellationToken, Task<int?>> NoPrimaryFile = (_, _) => Task.FromResult<int?>(null);

    private static VideoShotSetDto Set(int revision, params VideoShotDto[] shots) => new()
    {
        Id = 700, FileId = FileId, VideoId = VideoId, IsPrimaryFile = true, SourceKey = "ext:ai.shots",
        Model = "omnishotcut_shot_boundaries", DurationSec = shots.Max(shot => shot.EndSec), ShotCount = shots.Length,
        Revision = revision, CreatedAt = new DateTime(2026, 10, 5, 8, 0, 0, DateTimeKind.Unspecified),
        UpdatedAt = new DateTime(2026, 10, 5, 8, 0, 0, DateTimeKind.Unspecified), Shots = shots,
    };

    private static VideoShotDto Shot(double start, double end, int? startFrame = null, int? endFrame = null,
        string? shotType = null, string? transitionIn = null) => new()
    {
        StartSec = start, EndSec = end, StartFrame = startFrame, EndFrame = endFrame,
        ShotType = shotType, TransitionIn = transitionIn,
    };

    private static ShotBoundaryRestoreItem Restore(long id, double start, double end, string? metadata = null) =>
        new(id, start, end, "omnishotcut_shot_boundaries", metadata, 1, DateTime.UtcNow, DateTime.UtcNow);

    private static async Task AddLegacyRowAsync(ShotDbContext db)
    {
        db.Add(new SegmentStudioShotBoundary
        {
            VideoId = VideoId, StartSec = 0, EndSec = 10, Source = "manual",
            CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow,
        });
        await db.SaveChangesAsync();
    }

    private static ShotDbContext CreateDb() => new(new DbContextOptionsBuilder<ShotDbContext>()
        .UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);

    // Only the two Segment Studio tables the native path touches, without the Cove model behind them.
    private sealed class ShotDbContext(DbContextOptions<ShotDbContext> options) : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioShotBoundary>().HasKey(row => row.Id);
            modelBuilder.Entity<SegmentStudioShotBoundaryOperation>().HasKey(row => row.OperationId);
        }
    }

    /// <summary>One file's set, edited the way Cove's service would and checked against its revision.</summary>
    private sealed class FakeShotService(VideoShotSetDto? set) : IVideoShotService
    {
        private VideoShotSetDto? _set = set;

        public List<object> Calls { get; } = [];
        public VideoShotEditStatus? NextStatus { get; set; }

        public Task<VideoShotSetDto?> GetForVideoAsync(int videoId, CancellationToken cancellationToken = default) =>
            Task.FromResult(videoId == VideoId ? _set : null);

        public Task<VideoShotEditResult> SplitAsync(VideoShotSplitRequest request, CancellationToken cancellationToken = default)
        {
            Calls.Add(request);
            if (Refused(request.Expected) is { } refused) return Task.FromResult(refused);
            var shots = (_set?.Shots ?? [Shot(0, 10)]).ToList();
            var at = shots.FindIndex(shot => shot.StartSec < request.AtSec && request.AtSec < shot.EndSec);
            var target = shots[at];
            shots[at] = target with { EndSec = request.AtSec };
            shots.Insert(at + 1, target with { StartSec = request.AtSec });
            return Task.FromResult(Updated(shots));
        }

        public Task<VideoShotEditResult> MergeAsync(VideoShotMergeRequest request, CancellationToken cancellationToken = default)
        {
            Calls.Add(request);
            return Task.FromResult(Refused(request.Expected) ?? Updated(_set!.Shots!.ToList()));
        }

        public Task<VideoShotEditResult> ReplaceShotsAsync(VideoShotReplaceRequest request, CancellationToken cancellationToken = default)
        {
            Calls.Add(request);
            return Task.FromResult(Refused(request.Expected) ?? Updated(request.Shots
                .Select(input => Shot(input.StartSec, input.EndSec, input.StartFrame, input.EndFrame, input.ShotType, input.TransitionIn))
                .ToList()));
        }

        public Task<VideoShotEditResult> DeleteAsync(VideoShotDeleteRequest request, CancellationToken cancellationToken = default)
        {
            Calls.Add(request);
            if (Refused(request.Expected) is { } refused) return Task.FromResult(refused);
            _set = null;
            return Task.FromResult(new VideoShotEditResult { Status = VideoShotEditStatus.Deleted });
        }

        private VideoShotEditResult? Refused(VideoShotSetVersion? expected)
        {
            if (NextStatus is { } status)
                return new VideoShotEditResult { Status = status, Error = "refused", Set = _set };
            return expected is null ? (_set is null ? null : Conflict())
                : _set is null || _set.Id != expected.SetId || _set.Revision != expected.Revision ? Conflict() : null;
        }

        private VideoShotEditResult Conflict() => new() { Status = VideoShotEditStatus.Conflict, Error = "conflict", Set = _set };

        private VideoShotEditResult Updated(List<VideoShotDto> shots)
        {
            _set = (_set ?? Set(0, shots.ToArray())) with { Revision = (_set?.Revision ?? 0) + 1, Shots = shots, ShotCount = shots.Count };
            return new VideoShotEditResult { Status = VideoShotEditStatus.Updated, Set = _set };
        }

        public Task<VideoShotSetDto?> GetForFileAsync(int fileId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<VideoShotSetDto>> ListForVideoAsync(int videoId, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<IReadOnlyDictionary<int, VideoShotSetDto>> GetSummariesForFilesAsync(IReadOnlyCollection<int> fileIds, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<VideoShotWriteResult> WriteSetAsync(VideoShotSetWrite write, CancellationToken cancellationToken = default) => throw new NotSupportedException();
        public Task<VideoShotEditResult> MoveCutAsync(VideoShotMoveCutRequest request, CancellationToken cancellationToken = default) => throw new NotSupportedException();
    }
}
