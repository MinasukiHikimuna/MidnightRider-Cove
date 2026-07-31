using System.Security.Cryptography;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record NativeSegmentImportRequest(Guid OperationId, string ReviewState);
public sealed record NativeSegmentImportResult(int ImportedCount, string ReviewState);

public interface INativeSegmentImportService
{
    Task<int> CountAvailableAsync(DbContext db, int videoId, CancellationToken ct);
    Task<NativeSegmentImportResult> ImportAsync(
        DbContext db,
        int videoId,
        NativeSegmentImportRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct);
}

public sealed class NativeSegmentImportService(
    INativeAiProvenanceIngestionService nativeAiIngestion)
    : INativeSegmentImportService
{
    public Task<int> CountAvailableAsync(DbContext db, int videoId, CancellationToken ct) =>
        EligibleUnimported(db, videoId).CountAsync(ct);

    public async Task<NativeSegmentImportResult> ImportAsync(
        DbContext db,
        int videoId,
        NativeSegmentImportRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.ReviewState is not ("approved" or "unreviewed"))
            throw new ArgumentException("Review state must be approved or unreviewed.");
        var permission = request.ReviewState == "unreviewed"
            ? Permissions.SegmentsDelete
            : Permissions.SegmentsWrite;
        var access = await authorization.AuthorizeAsync(
            principal, permission, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            throw new UnauthorizedAccessException(access.Reason ?? "You cannot import segments for this video.");

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var segments = await EligibleUnimported(db, videoId)
            .OrderBy(segment => segment.Id)
            .ToListAsync(ct);
        foreach (var segment in segments)
        {
            if (segment.SourceKey.StartsWith("ext:ai.", StringComparison.OrdinalIgnoreCase))
            {
                await nativeAiIngestion.IngestAsync(
                    db,
                    new NativeAiIngestionRequest(
                        SegmentId: segment.Id,
                        VideoId: videoId,
                        BatchSize: 1,
                        OnlyMissingProvenance: true),
                    ct);
            }
            var item = await db.Set<SegmentStudioItem>()
                .SingleOrDefaultAsync(candidate => candidate.NativeSegmentId == segment.Id, ct);
            if (item is null)
            {
                var now = DateTime.UtcNow;
                item = new SegmentStudioItem
                {
                    NativeSegmentId = segment.Id,
                    RepresentationSchemaVersion = 1,
                    Revision = 0,
                    CreatedAt = now,
                    UpdatedAt = now,
                };
                db.Add(item);
                await db.SaveChangesAsync(ct);
            }
            if (request.ReviewState == "approved")
                continue;

            var transition = await SegmentOwnershipTransitionService.MoveToBinAsync(
                db,
                videoId,
                segment.Id,
                new MoveToBinRequest(
                    ChildOperationId(request.OperationId, segment.Id),
                    segment.UpdatedAt,
                    ReviewState: "unreviewed"),
                principal,
                authorization,
                blobs,
                ct);
            if (transition.Status != SegmentTransitionStatus.Updated)
                throw new InvalidOperationException(
                    transition.Error ?? $"Native segment {segment.Id} could not be imported.");
        }
        return new NativeSegmentImportResult(segments.Count, request.ReviewState);
    }

    private static IQueryable<Segment> EligibleUnimported(DbContext db, int videoId) =>
        db.Set<Segment>().Where(segment =>
            segment.HostType == SegmentHostType.Video
            && segment.HostId == videoId
            && segment.Kind == "tag"
            && segment.TagId != null
            && !db.Set<SegmentStudioItem>().Any(item => item.NativeSegmentId == segment.Id));

    private static Guid ChildOperationId(Guid operationId, int segmentId)
    {
        var input = operationId.ToByteArray().Concat(BitConverter.GetBytes(segmentId)).ToArray();
        return new Guid(SHA256.HashData(input).AsSpan(0, 16));
    }
}
