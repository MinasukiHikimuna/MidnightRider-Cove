using System.Data;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class SegmentStudioReviewLock
{
    public static async Task AcquireAsync(DbContext db, int videoId, CancellationToken ct)
    {
        if (!IsNpgsql(db))
            return;

        await db.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT pg_advisory_xact_lock(hashtextextended({Key(videoId)}, 0))", ct);
    }

    /// <summary>
    /// Takes the same review lock as <see cref="AcquireAsync"/> without an explicit transaction,
    /// so a caller can save Cove blob references (which Cove rejects inside explicit transactions)
    /// while still serializing against every other review-lock holder for the video. The lock is
    /// held on the context's connection until the returned handle is disposed.
    /// </summary>
    public static async Task<IAsyncDisposable> AcquireSessionAsync(
        DbContext db, int videoId, CancellationToken ct)
    {
        if (!IsNpgsql(db))
            return NoLock.Instance;

        await db.Database.OpenConnectionAsync(ct);
        try
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_lock(hashtextextended({Key(videoId)}, 0))", ct);
        }
        catch
        {
            await db.Database.CloseConnectionAsync();
            throw;
        }
        return new SessionLock(db, videoId);
    }

    private static bool IsNpgsql(DbContext db) =>
        db.Database.ProviderName is not null
        && db.Database.ProviderName.Contains("Npgsql", StringComparison.Ordinal);

    private static string Key(int videoId) => "segment-studio:review:" + videoId;

    private sealed class SessionLock(DbContext db, int videoId) : IAsyncDisposable
    {
        private int _disposed;

        public async ValueTask DisposeAsync()
        {
            if (Interlocked.Exchange(ref _disposed, 1) != 0)
                return;
            try
            {
                // A pooled connection keeps session locks until it is reset on reuse, so release
                // the lock explicitly. A broken connection has already released it server-side.
                if (db.Database.GetDbConnection().State == ConnectionState.Open)
                    await db.Database.ExecuteSqlInterpolatedAsync(
                        $"SELECT pg_advisory_unlock(hashtextextended({Key(videoId)}, 0))",
                        CancellationToken.None);
            }
            finally
            {
                await db.Database.CloseConnectionAsync();
            }
        }
    }

    private sealed class NoLock : IAsyncDisposable
    {
        public static NoLock Instance { get; } = new();
        public ValueTask DisposeAsync() => ValueTask.CompletedTask;
    }
}
