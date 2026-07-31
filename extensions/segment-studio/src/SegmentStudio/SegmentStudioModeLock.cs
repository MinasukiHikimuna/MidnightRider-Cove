using System.Data;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class SegmentStudioModeLock
{
    private const int LockNamespace = 1_397_705_555;

    public static async Task<IAsyncDisposable> AcquireSharedAsync(
        DbContext db,
        int userId,
        CancellationToken ct)
    {
        if (!UsesPostgres(db))
            return NoOpAsyncDisposable.Instance;
        var connection = db.Database.GetDbConnection();
        var closeConnection = connection.State != ConnectionState.Open;
        if (closeConnection)
            await db.Database.OpenConnectionAsync(ct);
        try
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_lock_shared({LockNamespace}, {userId})",
                ct);
            return new SharedLock(db, userId, closeConnection);
        }
        catch
        {
            if (closeConnection)
                await db.Database.CloseConnectionAsync();
            throw;
        }
    }

    public static async Task AcquireExclusiveTransactionAsync(
        DbContext db,
        int userId,
        CancellationToken ct)
    {
        if (!UsesPostgres(db))
            return;
        if (db.Database.CurrentTransaction is null)
            throw new InvalidOperationException(
                "The exclusive Segment Studio mode lock requires a transaction.");
        await db.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT pg_advisory_xact_lock({LockNamespace}, {userId})",
            ct);
    }

    private static bool UsesPostgres(DbContext db) =>
        db.Database.ProviderName?.Contains(
            "Npgsql",
            StringComparison.Ordinal) == true;

    private sealed class SharedLock(
        DbContext db,
        int userId,
        bool closeConnection) : IAsyncDisposable
    {
        private bool _disposed;

        public async ValueTask DisposeAsync()
        {
            if (_disposed)
                return;
            _disposed = true;
            try
            {
                await db.Database.ExecuteSqlInterpolatedAsync(
                    $"SELECT pg_advisory_unlock_shared({LockNamespace}, {userId})");
            }
            finally
            {
                if (closeConnection)
                    await db.Database.CloseConnectionAsync();
            }
        }
    }

    private sealed class NoOpAsyncDisposable : IAsyncDisposable
    {
        public static NoOpAsyncDisposable Instance { get; } = new();
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }
}
