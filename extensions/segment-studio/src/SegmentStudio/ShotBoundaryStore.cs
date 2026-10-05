using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

/// <summary>
/// Where the editor's shot boundaries live. A video whose primary file has a set in Cove's native shot
/// storage, or that has no Segment Studio rows, is read and edited through Cove; a video that still has only
/// Segment Studio's own rows keeps using them. Hosts without native shot storage always use Segment Studio's
/// rows. Names no Cove shot type, so it loads on every supported host.
/// </summary>
public static class ShotBoundaryStore
{
    public static async Task<IReadOnlyList<ShotBoundaryResponse>> ListAsync(
        DbContext db, IServiceProvider services, int videoId, CancellationToken ct)
    {
        if (NativeShotSupport.IsAvailable
            && await NativeShotBoundaries.ListAsync(db, services, videoId, ct) is { } native)
            return native;
        return await ShotBoundaryService.ListAsync(db, videoId, ct);
    }

    public static async Task<ShotBoundaryMutationResult> SplitAsync(
        DbContext db, IServiceProvider services, int videoId, SplitShotBoundaryRequest request,
        Func<CancellationToken, Task<double?>> legacyDuration, CancellationToken ct)
    {
        if (NativeShotSupport.IsAvailable
            && await NativeShotBoundaries.SplitAsync(db, services, videoId, request, ct) is { } native)
            return native;
        var duration = await legacyDuration(ct);
        if (duration is null or <= 0)
            return new(ShotBoundaryMutationStatus.Invalid, Error: "The video duration is unavailable.");
        return await ShotBoundaryService.SplitAsync(db, videoId, request, duration.Value, ct);
    }

    public static async Task<ShotBoundaryMutationResult> MergeAsync(
        DbContext db, IServiceProvider services, int videoId, MergeShotBoundaryRequest request, CancellationToken ct)
    {
        if (NativeShotSupport.IsAvailable
            && await NativeShotBoundaries.MergeAsync(db, services, videoId, request, ct) is { } native)
            return native;
        return await ShotBoundaryService.MergeAsync(db, videoId, request, ct);
    }

    public static async Task<ShotBoundaryMutationResult> RestoreAsync(
        DbContext db, IServiceProvider services, int videoId, RestoreShotBoundariesRequest request,
        Func<CancellationToken, Task<double?>> legacyDuration, CancellationToken ct)
    {
        if (NativeShotSupport.IsAvailable
            && await NativeShotBoundaries.RestoreAsync(db, services, videoId, request, ct) is { } native)
            return native;
        var duration = await legacyDuration(ct);
        if (duration is null or <= 0)
            return new(ShotBoundaryMutationStatus.Invalid, Error: "The video duration is unavailable.");
        return await ShotBoundaryService.RestoreAsync(db, videoId, request, duration.Value, ct);
    }
}
