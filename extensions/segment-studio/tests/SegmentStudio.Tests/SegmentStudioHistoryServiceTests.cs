using System.Text.Json;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using SegmentStudio;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioHistoryServiceTests
{
    [Fact]
    public async Task HistoryIsPerUserAndVideoAndRetainsTenActions()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        long revision = 0;
        for (var index = 1; index <= 12; index++)
        {
            var result = await SegmentStudioHistoryService.AppendAsync(
                fixture.Context,
                userId: 7,
                videoId: 22,
                new SegmentStudioHistoryRecordRequest(
                    revision,
                    "segment.update",
                    $"Change {index}",
                    Json($"{{\"value\":{index - 1}}}"),
                    Json($"{{\"value\":{index}}}")),
                CancellationToken.None);
            Assert.Equal(SegmentStudioHistoryMutationStatus.Updated, result.Status);
            revision = result.Value!.Revision;
        }

        var history = await SegmentStudioHistoryService.GetAsync(
            fixture.Context, userId: 7, videoId: 22, CancellationToken.None);
        Assert.Equal(10, history.Actions.Count);
        Assert.Equal(3, history.Actions[0].Sequence);
        Assert.Equal(2, history.BaselineSequence);
        Assert.Equal(12, history.CursorSequence);
        Assert.Empty((await SegmentStudioHistoryService.GetAsync(
            fixture.Context, userId: 8, videoId: 22, CancellationToken.None)).Actions);
    }

    [Fact]
    public async Task MovingBackwardThenAppendingTruncatesTheForwardBranch()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var first = await AppendAsync(fixture.Context, 0, "First");
        var second = await AppendAsync(fixture.Context, first.Revision, "Second");
        var third = await AppendAsync(fixture.Context, second.Revision, "Third");

        var moved = await SegmentStudioHistoryService.MoveCursorAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            new SegmentStudioHistoryCursorRequest(Guid.NewGuid(), third.Revision, first.Actions[0].Sequence),
            CancellationToken.None);
        Assert.Equal(SegmentStudioHistoryMutationStatus.Updated, moved.Status);

        var branched = await AppendAsync(fixture.Context, moved.Value!.Revision, "Replacement");
        Assert.Equal(["First", "Replacement"], branched.Actions.Select(action => action.Label));
        Assert.Equal(branched.Actions[^1].Sequence, branched.CursorSequence);
    }

    [Fact]
    public async Task StaleRevisionCannotMoveOrAppendHistory()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var current = await AppendAsync(fixture.Context, 0, "First");

        var append = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            new SegmentStudioHistoryRecordRequest(
                0, "segment.update", "Stale", Json("{}"), Json("{}")),
            CancellationToken.None);
        Assert.Equal(SegmentStudioHistoryMutationStatus.Conflict, append.Status);

        var move = await SegmentStudioHistoryService.MoveCursorAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            new SegmentStudioHistoryCursorRequest(Guid.NewGuid(), 0, current.BaselineSequence),
            CancellationToken.None);
        Assert.Equal(SegmentStudioHistoryMutationStatus.Conflict, move.Status);
    }

    [Fact]
    public async Task ClearingVideoRemovesEveryUsersHistory()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        await AppendAsync(fixture.Context, 0, "First");
        await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 8,
            videoId: 22,
            new SegmentStudioHistoryRecordRequest(
                0, "segment.update", "Other", Json("{}"), Json("{}")),
            CancellationToken.None);

        await SegmentStudioHistoryService.ClearVideoAsync(
            fixture.Context, videoId: 22, CancellationToken.None);

        Assert.Empty((await SegmentStudioHistoryService.GetAsync(
            fixture.Context, 7, 22, CancellationToken.None)).Actions);
        Assert.Empty((await SegmentStudioHistoryService.GetAsync(
            fixture.Context, 8, 22, CancellationToken.None)).Actions);
    }

    [Fact]
    public async Task BasicAndFullHistoriesAreIndependent()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var receiptId = Guid.NewGuid();
        var before = Json(
            """{"type":"segment","identity":{"nativeSegmentId":1},"values":{}}""");
        var after = Json(
            """{"type":"segment","identity":{"nativeSegmentId":1},"values":{}}""");
        await BasicNativeHistoryReceiptService.RecordAsync(
            fixture.Context,
            receiptId,
            7,
            new(22, "segment.update", "Basic change", before, after),
            CancellationToken.None);
        var basic = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            SegmentStudioModes.Basic,
            new SegmentStudioHistoryRecordRequest(
                0,
                "segment.update",
                "Basic change",
                Json("""{"type":"segments","segments":[]}"""),
                Json("""{"type":"segments","segments":[]}"""),
                receiptId),
            CancellationToken.None);
        var full = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            SegmentStudioModes.Full,
            new SegmentStudioHistoryRecordRequest(
                0, "segment.review", "Full review", Json("{}"), Json("{}")),
            CancellationToken.None);

        var basicHistory = await SegmentStudioHistoryService.GetAsync(
            fixture.Context, 7, 22, SegmentStudioModes.Basic,
            CancellationToken.None);
        Assert.Equal(
            ["Basic change"],
            basicHistory.Actions.Select(action => action.Label));
        Assert.Equal(
            1,
            basicHistory.Actions[0].BeforeState
                .GetProperty("identity")
                .GetProperty("nativeSegmentId")
                .GetInt32());
        Assert.Equal(
            ["Full review"],
            (await SegmentStudioHistoryService.GetAsync(
                fixture.Context, 7, 22, SegmentStudioModes.Full,
                CancellationToken.None)).Actions.Select(action => action.Label));
        Assert.Equal(1, basic.Value!.CursorSequence);
        Assert.Equal(1, full.Value!.CursorSequence);
    }

    [Fact]
    public async Task BasicHistoryRejectsClientStateWithoutServerReceipt()
    {
        await using var fixture = await HistoryFixture.CreateAsync();

        var result = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            SegmentStudioModes.Basic,
            new SegmentStudioHistoryRecordRequest(
                0,
                "segment.create",
                "Forged create",
                Json("""{"type":"segments","segments":[]}"""),
                Json(
                    """{"type":"segment","identity":{},"values":{"tagId":1,"startSec":0}}""")),
            CancellationToken.None);

        Assert.Equal(
            SegmentStudioHistoryMutationStatus.Invalid,
            result.Status);
        Assert.Empty(await fixture.Context
            .Set<SegmentStudioHistoryAction>()
            .ToListAsync());
    }

    [Theory]
    [InlineData("segments.review")]
    [InlineData("shots.update")]
    public async Task BasicHistoryRejectsFullOnlyActions(string kind)
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var result = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            SegmentStudioModes.Basic,
            new SegmentStudioHistoryRecordRequest(
                0,
                kind,
                "Full-only change",
                Json("""{"type":"segment","identity":{"nativeSegmentId":1},"values":{}}"""),
                Json("""{"type":"segment","identity":{"nativeSegmentId":1},"values":{}}""")),
            CancellationToken.None);

        Assert.Equal(SegmentStudioHistoryMutationStatus.Invalid, result.Status);
    }

    [Fact]
    public async Task BasicHistoryRejectsReviewMetadata()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var result = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            userId: 7,
            videoId: 22,
            SegmentStudioModes.Basic,
            new SegmentStudioHistoryRecordRequest(
                0,
                "segment.update",
                "Changed segment",
                Json("""{"type":"segment","identity":{"nativeSegmentId":1},"values":{"reviewState":"approved"}}"""),
                Json("""{"type":"segment","identity":{"nativeSegmentId":1},"values":{}}""")),
            CancellationToken.None);

        Assert.Equal(SegmentStudioHistoryMutationStatus.Invalid, result.Status);
    }

    [Fact]
    public async Task BasicCursorCannotSkipNativeStateRestoration()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var receiptId = Guid.NewGuid();
        var state = Json(
            """{"type":"segment","identity":{"nativeSegmentId":1},"values":{}}""");
        await BasicNativeHistoryReceiptService.RecordAsync(
            fixture.Context,
            receiptId,
            7,
            new(22, "segment.update", "Basic change", state, state),
            CancellationToken.None);
        var appended = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            7,
            22,
            SegmentStudioModes.Basic,
            new(0, "ignored", "ignored", Json("{}"), Json("{}"), receiptId),
            CancellationToken.None);

        var moved = await SegmentStudioHistoryService.MoveCursorAsync(
            fixture.Context,
            7,
            22,
            SegmentStudioModes.Basic,
            new(
                Guid.NewGuid(),
                appended.Value!.Revision,
                appended.Value.BaselineSequence),
            CancellationToken.None);

        Assert.Equal(
            SegmentStudioHistoryMutationStatus.Invalid,
            moved.Status);
        Assert.Equal(
            appended.Value.CursorSequence,
            moved.Value!.CursorSequence);
    }

    [Fact]
    public async Task BasicHistoryPruningScrubsReceiptAndPreventsReuse()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var receiptIds = new List<Guid>();
        long revision = 0;
        for (var index = 1; index <= 11; index++)
        {
            var receiptId = Guid.NewGuid();
            receiptIds.Add(receiptId);
            var state = Json(
                $"{{\"type\":\"segment\",\"identity\":{{\"nativeSegmentId\":{index}}},\"values\":{{}}}}");
            await BasicNativeHistoryReceiptService.RecordAsync(
                fixture.Context,
                receiptId,
                7,
                new(
                    22,
                    "segment.update",
                    $"Basic change {index}",
                    state,
                    state),
                CancellationToken.None);
            var appended = await SegmentStudioHistoryService.AppendAsync(
                fixture.Context,
                7,
                22,
                SegmentStudioModes.Basic,
                new(
                    revision,
                    "ignored",
                    "ignored",
                    Json("{}"),
                    Json("{}"),
                    receiptId),
                CancellationToken.None);
            Assert.Equal(
                SegmentStudioHistoryMutationStatus.Updated,
                appended.Status);
            revision = appended.Value!.Revision;
        }

        var expired = await fixture.Context
            .Set<SegmentStudioSegmentOperation>()
            .SingleAsync(operation =>
                operation.OperationId == receiptIds[0]);
        Assert.Equal(
            "basic-native-history-receipt-expired",
            expired.Kind);
        Assert.Null(expired.ResultPayloadJson);
        Assert.True(await BasicNativeHistoryReceiptService.ExistsAsync(
            fixture.Context,
            receiptIds[0],
            7,
            22,
            CancellationToken.None));

        var reused = await SegmentStudioHistoryService.AppendAsync(
            fixture.Context,
            7,
            22,
            SegmentStudioModes.Basic,
            new(
                revision,
                "segment.update",
                "Reused",
                Json("{}"),
                Json("{}"),
                receiptIds[0]),
            CancellationToken.None);
        Assert.Equal(
            SegmentStudioHistoryMutationStatus.Invalid,
            reused.Status);
    }

    [Fact]
    public async Task BasicModeCleanupScrubsUnappendedReceipts()
    {
        await using var fixture = await HistoryFixture.CreateAsync();
        var receiptId = Guid.NewGuid();
        var state = Json(
            """{"type":"segment","identity":{"nativeSegmentId":1},"values":{"payloadJson":"sensitive"}}""");
        await BasicNativeHistoryReceiptService.RecordAsync(
            fixture.Context,
            receiptId,
            7,
            new(22, "segment.update", "Basic change", state, state),
            CancellationToken.None);

        await SegmentStudioHistoryService.ClearBasicUserAsync(
            fixture.Context, 7, CancellationToken.None);

        var expired = await fixture.Context
            .Set<SegmentStudioSegmentOperation>()
            .SingleAsync(operation => operation.OperationId == receiptId);
        Assert.Equal(
            "basic-native-history-receipt-expired",
            expired.Kind);
        Assert.Null(expired.ResultPayloadJson);
    }

    private static async Task<SegmentStudioHistoryView> AppendAsync(
        DbContext db,
        long revision,
        string label)
    {
        var result = await SegmentStudioHistoryService.AppendAsync(
            db,
            userId: 7,
            videoId: 22,
            new SegmentStudioHistoryRecordRequest(
                revision,
                "segment.update",
                label,
                Json("{\"before\":true}"),
                Json("{\"after\":true}")),
            CancellationToken.None);
        return result.Value!;
    }

    private static JsonElement Json(string value)
    {
        using var document = JsonDocument.Parse(value);
        return document.RootElement.Clone();
    }

    private sealed class HistoryFixture : IAsyncDisposable
    {
        private readonly SqliteConnection _connection;

        private HistoryFixture(SqliteConnection connection, HistoryDbContext context)
        {
            _connection = connection;
            Context = context;
        }

        public HistoryDbContext Context { get; }

        public static async Task<HistoryFixture> CreateAsync()
        {
            var connection = new SqliteConnection("Data Source=:memory:");
            await connection.OpenAsync();
            var options = new DbContextOptionsBuilder<HistoryDbContext>()
                .UseSqlite(connection)
                .Options;
            var context = new HistoryDbContext(options);
            await context.Database.EnsureCreatedAsync();
            return new HistoryFixture(connection, context);
        }

        public async ValueTask DisposeAsync()
        {
            await Context.DisposeAsync();
            await _connection.DisposeAsync();
        }
    }

    private sealed class HistoryDbContext(DbContextOptions<HistoryDbContext> options)
        : DbContext(options)
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SegmentStudioHistorySession>(builder =>
            {
                builder.HasKey(session => session.Id);
                builder.Property(session => session.Id).ValueGeneratedOnAdd();
                builder.HasIndex(session => new { session.UserId, session.VideoId, session.Mode }).IsUnique();
            });
            modelBuilder.Entity<SegmentStudioHistoryAction>(builder =>
            {
                builder.HasKey(action => action.Id);
                builder.Property(action => action.Id).ValueGeneratedOnAdd();
                builder.HasIndex(action => new { action.SessionId, action.Sequence }).IsUnique();
                builder.HasOne(action => action.Session).WithMany(session => session.Actions)
                    .HasForeignKey(action => action.SessionId).OnDelete(DeleteBehavior.Cascade);
            });
            modelBuilder.Entity<SegmentStudioSegmentOperation>()
                .HasKey(operation => operation.OperationId);
        }
    }
}
