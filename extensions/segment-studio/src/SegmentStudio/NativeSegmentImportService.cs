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
            .AsNoTracking()
            .OrderBy(segment => segment.Id)
            .ToListAsync(ct);
        var aiSegmentIds = segments
            .Where(segment => segment.SourceKey.StartsWith(
                "ext:ai.", StringComparison.OrdinalIgnoreCase))
            .Select(segment => segment.Id)
            .ToArray();
        foreach (var batch in aiSegmentIds.Chunk(
                     NativeAiProvenanceIngestionService.MaximumBatchSize))
        {
            await nativeAiIngestion.IngestAsync(
                db,
                new NativeAiIngestionRequest(
                    VideoId: videoId,
                    BatchSize: batch.Length,
                    OnlyMissingProvenance: true,
                    SegmentIds: batch),
                ct);
        }
        if (request.ReviewState == "approved")
        {
            var segmentIds = segments.Select(segment => segment.Id).ToArray();
            var anchoredIds = await db.Set<SegmentStudioItem>()
                .AsNoTracking()
                .Where(item => item.NativeSegmentId != null
                    && segmentIds.Contains(item.NativeSegmentId.Value))
                .Select(item => item.NativeSegmentId!.Value)
                .ToListAsync(ct);
            var anchored = anchoredIds.ToHashSet();
            var now = DateTime.UtcNow;
            db.AddRange(segments
                .Where(segment => !anchored.Contains(segment.Id))
                .Select(segment => new SegmentStudioItem
                {
                    NativeSegmentId = segment.Id,
                    RepresentationSchemaVersion = 1,
                    Revision = 0,
                    CreatedAt = now,
                    UpdatedAt = now,
                }));
            await db.SaveChangesAsync(ct);
            return new NativeSegmentImportResult(segments.Count, request.ReviewState);
        }

        foreach (var batch in segments.Chunk(5000))
        {
            var transition = await SegmentOwnershipTransitionService.MoveManyNativeToOwnedAsync(
                db,
                videoId,
                new NativeToOwnedTransitionBatchRequest(
                    ChildOperationId(request.OperationId, batch[0].Id),
                    batch.Select(segment => new NativeToOwnedTransitionItem(
                        segment.Id, segment.UpdatedAt)).ToArray(),
                    ReviewState: "unreviewed"),
                principal,
                authorization,
                blobs,
                ct);
            if (transition.Status != SegmentTransitionStatus.Updated)
                throw new InvalidOperationException(
                    transition.Error ?? "The native segments could not be imported.");
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
