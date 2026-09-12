using System.Data;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

internal static class SegmentStudioAnalysisRunLock
{
    private const int LockNamespace = 1_397_705_556;

    public static async Task<IAsyncDisposable> AcquireAsync(
        DbContext db,
        int videoId,
        CancellationToken ct)
    {
        if (db.Database.ProviderName?.Contains(
                "Npgsql",
                StringComparison.Ordinal) != true)
            return NoOpAsyncDisposable.Instance;

        var connection = db.Database.GetDbConnection();
        var closeConnection = connection.State != ConnectionState.Open;
        if (closeConnection)
            await db.Database.OpenConnectionAsync(ct);
        try
        {
            await db.Database.ExecuteSqlInterpolatedAsync(
                $"SELECT pg_advisory_lock({LockNamespace}, {videoId})",
                ct);
            return new AnalysisRunLock(db, videoId, closeConnection);
        }
        catch
        {
            if (closeConnection)
                await db.Database.CloseConnectionAsync();
            throw;
        }
    }

    private sealed class AnalysisRunLock(
        DbContext db,
        int videoId,
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
                    $"SELECT pg_advisory_unlock({LockNamespace}, {videoId})");
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
