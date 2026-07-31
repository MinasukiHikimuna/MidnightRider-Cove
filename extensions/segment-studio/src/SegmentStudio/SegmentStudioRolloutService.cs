using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentStudioRolloutUpdate(bool Paused);

public sealed record SegmentStudioTelemetry(
    bool Paused,
    bool RequiresLegacyNormalization,
    long Sources,
    long Activities,
    long LiveNodes,
    long MissingNodes,
    long ActiveAssertions,
    long Edges,
    long OpenIssues,
    long PendingScans,
    DateTime? LastCompletedScanAt);

public static class SegmentStudioRolloutService
{
    public static async Task<SegmentStudioInstallationState> GetAsync(
        DbContext db,
        CancellationToken ct)
    {
        var state = await db.Set<SegmentStudioInstallationState>()
            .SingleOrDefaultAsync(candidate => candidate.Id == 1, ct);
        if (state is not null)
            return state;
        state = new SegmentStudioInstallationState
        {
            Id = 1,
            RequiresLegacyNormalization = false,
            LineageRolloutPaused = false,
            UpdatedAt = DateTime.UtcNow,
        };
        db.Add(state);
        await db.SaveChangesAsync(ct);
        return state;
    }

    public static async Task SetPausedAsync(
        DbContext db,
        bool paused,
        CancellationToken ct)
    {
        var state = await GetAsync(db, ct);
        state.LineageRolloutPaused = paused;
        state.UpdatedAt = DateTime.UtcNow;
        await db.SaveChangesAsync(ct);
    }

    public static async Task EnsureWritesEnabledAsync(DbContext db, CancellationToken ct)
    {
        if (db.Model.FindEntityType(typeof(SegmentStudioInstallationState)) is null)
            return;
        var paused = await db.Set<SegmentStudioInstallationState>()
            .AsNoTracking()
            .Where(state => state.Id == 1)
            .Select(state => (bool?)state.LineageRolloutPaused)
            .SingleOrDefaultAsync(ct);
        if (paused == true)
            throw new LineageConflictException(
                "LINEAGE_ROLLOUT_PAUSED",
                "Lineage writes are paused by an administrator.");
    }

    public static async Task<SegmentStudioTelemetry> GetTelemetryAsync(
        DbContext db,
        CancellationToken ct)
    {
        var state = await GetAsync(db, ct);
        return new SegmentStudioTelemetry(
            state.LineageRolloutPaused,
            state.RequiresLegacyNormalization,
            await db.Set<SegmentStudioSource>().LongCountAsync(ct),
            await db.Set<SegmentStudioProvenanceActivity>().LongCountAsync(ct),
            await db.Set<SegmentStudioLineageNode>().LongCountAsync(node => node.State == "live", ct),
            await db.Set<SegmentStudioLineageNode>().LongCountAsync(node => node.State == "missing", ct),
            await db.Set<SegmentStudioSegmentProvenance>().LongCountAsync(
                assertion => assertion.SupersededAt == null, ct),
            await db.Set<SegmentStudioDerivationEdge>().LongCountAsync(ct),
            await db.Set<SegmentStudioLineageIssue>().LongCountAsync(issue => issue.State == "open", ct),
            await db.Set<SegmentStudioLineageScanRun>().LongCountAsync(
                run => run.State == "pending" || run.State == "running", ct),
            await db.Set<SegmentStudioLineageScanRun>().AsNoTracking()
                .Where(run => run.State == "completed")
                .MaxAsync(run => (DateTime?)run.CompletedAt, ct));
    }
}
