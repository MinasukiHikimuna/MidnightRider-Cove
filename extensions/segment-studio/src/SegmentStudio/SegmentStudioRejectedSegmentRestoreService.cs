using Cove.Core.Auth;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public static class SegmentStudioRejectedSegmentRestoreService
{
    public static bool UsesBasicStorage(string mode) =>
        SegmentStudioModes.NormalizePublic(mode) == SegmentStudioModes.Basic;

    public static Task<SegmentTransitionResult> RestoreAsync(
        DbContext db,
        string mode,
        long itemId,
        OwnedSegmentMutationRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct) =>
        UsesBasicStorage(mode)
            ? BasicNativeRecycleBinService.RestoreAsync(
                db, itemId, request, principal, authorization, blobs, ct)
            : SegmentOwnershipTransitionService.RestoreAsync(
                db, itemId, request, principal, authorization, blobs, ct);
}
