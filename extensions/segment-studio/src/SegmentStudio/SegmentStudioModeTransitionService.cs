using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record SegmentStudioModeTransitionPreview(
    string CurrentMode,
    string TargetMode,
    int RecyclingBinCount,
    int ProtectedRecyclingBinCount,
    int ExtensionOwnedSegmentCount,
    string RecyclingBinFingerprint);

public static class SegmentStudioModeTransitionService
{
    public static async Task<SegmentStudioModeTransitionPreview> PreviewAsync(
        DbContext db,
        string currentMode,
        string targetMode,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        var normalizedCurrentMode =
            SegmentStudioModes.NormalizePublic(currentMode);
        var normalizedTargetMode =
            SegmentStudioModes.NormalizePublic(
                SegmentStudioModes.ToStored(targetMode));
        var fullBin = await BasicNativeRecycleBinService.GetAsync(
            db, null, principal, authorization, ct);
        var bin = await BasicNativeRecycleBinService
            .GetModeSwitchSnapshotAsync(
                db, principal, authorization, ct);
        var ownedRows = await db.Set<SegmentStudioItem>()
            .AsNoTracking()
            .Where(item =>
                item.NativeSegmentId == null
                && item.VideoId != null
                && item.TagId != null
                && item.StartSec != null
                && item.ReviewState != null)
            .Select(item => new { item.Id, VideoId = item.VideoId!.Value })
            .ToListAsync(ct);
        var visibleVideoIds = new HashSet<int>();
        foreach (var videoId in ownedRows
                     .Select(row => row.VideoId)
                     .Distinct()
                     .Order())
        {
            var access = await authorization.AuthorizeAsync(
                principal,
                Permissions.SegmentsRead,
                EntityRef.Of(EntityKinds.Video, videoId),
                ct);
            if (access.Allowed)
                visibleVideoIds.Add(videoId);
        }
        return new SegmentStudioModeTransitionPreview(
            normalizedCurrentMode,
            normalizedTargetMode,
            bin.TotalCount,
            fullBin.TotalCount - bin.TotalCount,
            ownedRows.Count(row => visibleVideoIds.Contains(row.VideoId)),
            bin.Fingerprint);
    }
}
