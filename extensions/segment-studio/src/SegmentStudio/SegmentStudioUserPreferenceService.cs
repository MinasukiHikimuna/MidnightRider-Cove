using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class SegmentStudioUserPreferenceService
{
    public const string DefaultMode = SegmentStudioModes.LegacyBasic;

    public static async Task<string> GetModeAsync(
        DbContext db,
        int userId,
        CancellationToken ct)
    {
        return await db.Set<SegmentStudioUserPreference>()
            .AsNoTracking()
            .Where(preference => preference.UserId == userId)
            .Select(preference => preference.Mode)
            .SingleOrDefaultAsync(ct)
            ?? DefaultMode;
    }

    public static async Task<string> SetModeAsync(
        DbContext db,
        int userId,
        string mode,
        CancellationToken ct)
    {
        mode = SegmentStudioModes.ToStored(mode);

        if (db.Database.ProviderName?.Contains("Npgsql", StringComparison.Ordinal) == true)
        {
            var updatedAt = DateTime.UtcNow;
            await db.Database.ExecuteSqlInterpolatedAsync($"""
                INSERT INTO segment_studio_user_preferences (user_id, mode, updated_at)
                VALUES ({userId}, {mode}, {updatedAt})
                ON CONFLICT (user_id) DO UPDATE
                SET mode = EXCLUDED.mode, updated_at = EXCLUDED.updated_at
                """, ct);
            return mode;
        }

        var preference = await db.Set<SegmentStudioUserPreference>()
            .SingleOrDefaultAsync(candidate => candidate.UserId == userId, ct);
        if (preference is null)
        {
            preference = new SegmentStudioUserPreference
            {
                UserId = userId,
                Mode = mode,
                UpdatedAt = DateTime.UtcNow,
            };
            db.Add(preference);
        }
        else
        {
            preference.Mode = mode;
            preference.UpdatedAt = DateTime.UtcNow;
        }

        await db.SaveChangesAsync(ct);
        return preference.Mode;
    }
}
