using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class SegmentStudioCompatibilityService
{
    public static async Task<bool> RequiresLegacyUiAsync(DbContext db, CancellationToken ct)
    {
        return await db.Set<SegmentStudioInstallationState>().AsNoTracking()
            .Where(state => state.Id == 1)
            .Select(state => state.RequiresLegacyNormalization)
            .SingleAsync(ct);
    }
}
