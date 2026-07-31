using Cove.Core.Auth;
using Cove.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public sealed record CreateBasicNativeSegmentRequest(
    int TagId,
    double StartSec,
    double? EndSec,
    Guid? HistoryReceiptId = null);

public sealed record BasicNativeSegmentSnapshot(
    int Id,
    int NativeSegmentId,
    int VideoId,
    int TagId,
    string? TagName,
    double StartSec,
    double? EndSec,
    DateTime UpdatedAt,
    string SourceKey,
    string? SourceRunId,
    float? Confidence);

public static class BasicNativeSegmentService
{
    public static async Task<BasicNativeSegmentSnapshot> CreateAsync(
        DbContext db,
        int videoId,
        CreateBasicNativeSegmentRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        CancellationToken ct)
    {
        if (request.TagId <= 0)
            throw new ArgumentException("Tag is required.");
        if (!double.IsFinite(request.StartSec)
            || request.StartSec < 0
            || request.EndSec is double end
                && (!double.IsFinite(end) || end < request.StartSec))
            throw new ArgumentException("Segment timing is invalid.");
        var access = await authorization.AuthorizeAsync(
            principal,
            Permissions.SegmentsWrite,
            EntityRef.Of(EntityKinds.Video, videoId),
            ct);
        if (!access.Allowed)
            throw new UnauthorizedAccessException(
                access.Reason ?? "You cannot create segments for this video.");
        if (!await db.Set<Video>().AsNoTracking()
                .AnyAsync(video => video.Id == videoId, ct))
            throw new KeyNotFoundException("Video not found.");
        var tagName = await db.Set<Tag>().AsNoTracking()
            .Where(tag => tag.Id == request.TagId)
            .Select(tag => tag.Name)
            .SingleOrDefaultAsync(ct);
        if (tagName is null)
            throw new ArgumentException("Tag not found.");

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        var now = DateTime.UtcNow;
        var segment = new Segment
        {
            HostType = SegmentHostType.Video,
            HostId = videoId,
            TagId = request.TagId,
            Kind = "tag",
            StartSec = request.StartSec,
            EndSec = request.EndSec,
            SourceKey = "user",
            CreatedAt = now,
            UpdatedAt = now,
        };
        db.Add(segment);
        await db.SaveChangesAsync(ct);
        return new(
            segment.Id,
            segment.Id,
            videoId,
            request.TagId,
            tagName,
            segment.StartSec,
            segment.EndSec,
            segment.UpdatedAt,
            segment.SourceKey,
            segment.SourceRunId,
            segment.Confidence);
    }
}
