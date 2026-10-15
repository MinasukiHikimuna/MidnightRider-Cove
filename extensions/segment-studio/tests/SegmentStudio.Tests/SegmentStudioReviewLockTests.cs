namespace SegmentStudio.Tests;

using System.Data;
using Microsoft.EntityFrameworkCore;
using Npgsql;

public sealed class SegmentStudioReviewLockTests
{
    [Fact]
    public async Task SessionLockExcludesTransactionLockHoldersUntilDisposed()
    {
        var connectionString =
            Environment.GetEnvironmentVariable("COVE__Postgres__ConnectionString")
            ?? Environment.GetEnvironmentVariable("DATABASE_URL");
        if (string.IsNullOrWhiteSpace(connectionString))
            return;

        var videoId = Random.Shared.Next(int.MinValue, -1);
        await using var db = new LockDbContext(
            new DbContextOptionsBuilder<LockDbContext>().UseNpgsql(connectionString).Options);
        await using var other = new NpgsqlConnection(connectionString);
        await other.OpenAsync();

        await using (await SegmentStudioReviewLock.AcquireSessionAsync(db, videoId, CancellationToken.None))
        {
            Assert.Null(db.Database.CurrentTransaction);
            Assert.False(await TryTransactionLockAsync(other, videoId));
        }

        Assert.True(await TryTransactionLockAsync(other, videoId));
        Assert.Equal(ConnectionState.Closed, db.Database.GetDbConnection().State);
    }

    private static async Task<bool> TryTransactionLockAsync(NpgsqlConnection connection, int videoId)
    {
        await using var transaction = await connection.BeginTransactionAsync();
        await using var command = new NpgsqlCommand(
            "SELECT pg_try_advisory_xact_lock(hashtextextended(@key, 0))", connection, transaction);
        command.Parameters.AddWithValue("key", "segment-studio:review:" + videoId);
        var acquired = (bool)(await command.ExecuteScalarAsync())!;
        await transaction.RollbackAsync();
        return acquired;
    }

    private sealed class LockDbContext(DbContextOptions<LockDbContext> options) : DbContext(options);
}
