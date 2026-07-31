using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class SegmentStudioReviewLock
{
    public static async Task AcquireAsync(DbContext db, int videoId, CancellationToken ct)
    {
        if (db.Database.ProviderName is null
            || !db.Database.ProviderName.Contains("Npgsql", StringComparison.Ordinal))
            return;

        await db.Database.ExecuteSqlInterpolatedAsync(
            $"SELECT pg_advisory_xact_lock(hashtextextended({"segment-studio:review:" + videoId}, 0))", ct);
    }
}
