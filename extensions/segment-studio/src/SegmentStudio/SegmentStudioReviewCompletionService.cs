using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Core.Auth;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace SegmentStudio;

public enum ReviewCompletionStatus
{
    Completed,
    NothingToPublish,
    NotFound,
    Forbidden,
    Conflict,
    MissingImage,
}

public sealed record CompleteReviewRequest(Guid OperationId, string ExpectedApprovedSetVersion);
public sealed record PublishedDraftIdentity(long ItemId, int NativeSegmentId);
public sealed record ReviewCompletionResult(
    ReviewCompletionStatus Status,
    IReadOnlyList<PublishedDraftIdentity> Published,
    string ApprovedSetVersion,
    string? Error = null,
    bool Replayed = false);

public static class SegmentStudioReviewCompletionService
{
    private const string OperationKind = "complete-review";

    public static async Task<string> GetApprovedSetVersionAsync(DbContext db, int videoId, CancellationToken ct)
    {
        var rows = await db.Set<SegmentStudioItem>().AsNoTracking()
            .Where(item => item.NativeSegmentId == null
                && item.VideoId == videoId
                && item.ReviewState == "approved")
            .OrderBy(item => item.Id)
            .Select(item => new { item.Id, item.Revision })
            .ToListAsync(ct);
        return Hash(JsonSerializer.Serialize(rows));
    }

    public static async Task<ReviewCompletionResult> CompleteAsync(
        DbContext db,
        int videoId,
        CompleteReviewRequest request,
        CovePrincipal? principal,
        IAuthorizationService authorization,
        IBlobService blobs,
        CancellationToken ct)
    {
        if (request.OperationId == Guid.Empty)
            return Empty(ReviewCompletionStatus.Conflict, "", "Operation ID is required.");
        if (!await db.Set<Video>().AsNoTracking().AnyAsync(video => video.Id == videoId, ct))
            return Empty(ReviewCompletionStatus.NotFound, "", "Video not found.");
        var access = await authorization.AuthorizeAsync(
            principal, Permissions.SegmentsWrite, EntityRef.Of(EntityKinds.Video, videoId), ct);
        if (!access.Allowed)
            return Empty(ReviewCompletionStatus.Forbidden, "", access.Reason ?? "You cannot publish segments for this video.");
        var replay = await ReplayAsync(db, videoId, request, principal, ct);
        if (replay is not null)
            return replay;

        await SegmentStudioReviewLock.AcquireAsync(db, videoId, ct);
        replay = await ReplayAsync(db, videoId, request, principal, ct);
        if (replay is not null)
            return replay;

        var currentVersion = await GetApprovedSetVersionAsync(db, videoId, ct);
        if (!CryptographicOperations.FixedTimeEquals(
                Encoding.UTF8.GetBytes(currentVersion),
                Encoding.UTF8.GetBytes(request.ExpectedApprovedSetVersion ?? "")))
            return Empty(ReviewCompletionStatus.Conflict, currentVersion,
                "Approved drafts changed in another session. Reload before completing the review.");

        var approved = await db.Set<SegmentStudioItem>()
            .Where(item => item.NativeSegmentId == null
                && item.VideoId == videoId
                && item.ReviewState == "approved")
            .OrderBy(item => item.Id)
            .ToListAsync(ct);
        if (approved.Count == 0)
            return Empty(ReviewCompletionStatus.NothingToPublish, currentVersion, "There are no Approved drafts to publish.");
        var approvedItemIds = approved.Select(item => item.Id).ToArray();
        var approvedNodeIds = await db.Set<SegmentStudioLineageNode>().AsNoTracking()
            .Where(node => node.ItemId != null && approvedItemIds.Contains(node.ItemId.Value))
            .Select(node => node.Id)
            .ToListAsync(ct);
        var blockedByIntegrity = false;
        if (approvedNodeIds.Count > 0)
        {
            var edges = await LineageScaleQueries.LoadComponentEdgesAsync(
                db, approvedNodeIds, tracking: false, ct);
            var componentNodeIds = edges
                .SelectMany(edge => new[] { edge.SourceNodeId, edge.DerivedNodeId })
                .Concat(approvedNodeIds)
                .ToHashSet();
            var componentEdgeIds = edges
                .Where(edge => componentNodeIds.Contains(edge.SourceNodeId)
                    && componentNodeIds.Contains(edge.DerivedNodeId))
                .Select(edge => edge.Id)
                .ToArray();
            var componentKeys = new HashSet<string>();
            foreach (var approvedNodeId in approvedNodeIds)
            {
                var memberIds = new HashSet<Guid> { approvedNodeId };
                var changed = true;
                while (changed)
                {
                    changed = false;
                    foreach (var edge in edges)
                    {
                        if (memberIds.Contains(edge.SourceNodeId) && memberIds.Add(edge.DerivedNodeId))
                            changed = true;
                        if (memberIds.Contains(edge.DerivedNodeId) && memberIds.Add(edge.SourceNodeId))
                            changed = true;
                    }
                }
                componentKeys.Add(Hash(string.Join("|", memberIds.Order())));
            }
            blockedByIntegrity = await db.Set<SegmentStudioLineageIssue>().AsNoTracking()
                .AnyAsync(issue => (issue.State == "open" || issue.State == "ignored")
                    && ((issue.LineageNodeId != null && componentNodeIds.Contains(issue.LineageNodeId.Value))
                        || (issue.EdgeId != null && componentEdgeIds.Contains(issue.EdgeId.Value))
                        || componentKeys.Contains(issue.ComponentKey)), ct);
        }
        if (blockedByIntegrity)
            return Empty(
                ReviewCompletionStatus.Conflict,
                currentVersion,
                "A selected lineage component has an unresolved integrity issue.");

        foreach (var item in approved)
        {
            if (string.IsNullOrWhiteSpace(item.ExtensionImageBlobId))
                continue;
            var blob = await blobs.GetBlobAsync(item.ExtensionImageBlobId, ct);
            if (blob is null)
                return Empty(ReviewCompletionStatus.MissingImage, currentVersion,
                    "An Approved draft references an image that is no longer available.");
            await blob.Value.Stream.DisposeAsync();
        }

        var now = DateTime.UtcNow;
        var published = new List<PublishedDraftIdentity>(approved.Count);
        foreach (var item in approved)
        {
            var segment = new Segment
            {
                HostType = SegmentHostType.Video,
                HostId = videoId,
                StartSec = item.StartSec!.Value,
                EndSec = item.EndSec,
                TagId = item.TagId,
                Kind = item.Kind,
                RefId = item.RefId,
                Payload = item.PayloadJson is null ? null : JsonDocument.Parse(item.PayloadJson),
                SourceKey = item.SourceKey!,
                SourceRunId = item.SourceRunId,
                Confidence = item.Confidence,
                Title = item.Title,
                ColorHint = item.ColorHint,
                ImageBlobId = item.ExtensionImageBlobId,
                CreatedAt = now,
                UpdatedAt = now,
            };
            db.Add(segment);
            await db.SaveChangesAsync(ct);
            item.NativeSegmentId = segment.Id;
            ClearOwnedRepresentation(item);
            item.Revision++;
            item.UpdatedAt = now;
            published.Add(new(item.Id, segment.Id));
        }
        await db.SaveChangesAsync(ct);

        var nextVersion = await GetApprovedSetVersionAsync(db, videoId, ct);
        var result = new ReviewCompletionResult(
            ReviewCompletionStatus.Completed, published, nextVersion);
        db.Add(new SegmentStudioSegmentOperation
        {
            OperationId = request.OperationId,
            Kind = OperationKind,
            ActorUserId = principal?.UserId,
            RequestFingerprint = Fingerprint(videoId, request.ExpectedApprovedSetVersion ?? ""),
            ResultPayloadJson = JsonSerializer.Serialize(result),
            CreatedAt = now,
        });
        await db.SaveChangesAsync(ct);
        return result;
    }

    private static void ClearOwnedRepresentation(SegmentStudioItem item)
    {
        item.ReviewState = null;
        item.VideoId = null;
        item.StartSec = null;
        item.EndSec = null;
        item.TagId = null;
        item.Kind = null;
        item.RefId = null;
        item.PayloadJson = null;
        item.SourceKey = null;
        item.SourceRunId = null;
        item.Confidence = null;
        item.Title = null;
        item.ColorHint = null;
        item.ExtensionImageBlobId = null;
    }

    private static async Task<ReviewCompletionResult?> ReplayAsync(
        DbContext db, int videoId, CompleteReviewRequest request, CovePrincipal? principal, CancellationToken ct)
    {
        var receipt = await db.Set<SegmentStudioSegmentOperation>().AsNoTracking()
            .SingleOrDefaultAsync(operation => operation.OperationId == request.OperationId, ct);
        if (receipt is null)
            return null;
        if (receipt.Kind != OperationKind
            || receipt.ActorUserId != principal?.UserId
            || receipt.RequestFingerprint != Fingerprint(videoId, request.ExpectedApprovedSetVersion ?? ""))
            return Empty(ReviewCompletionStatus.Conflict, "", "The operation ID was already used for another request.");
        return JsonSerializer.Deserialize<ReviewCompletionResult>(receipt.ResultPayloadJson!)! with { Replayed = true };
    }

    private static ReviewCompletionResult Empty(ReviewCompletionStatus status, string version, string error) =>
        new(status, [], version, error);

    private static string Fingerprint(int videoId, string version) => Hash(
        JsonSerializer.Serialize(new { kind = OperationKind, videoId, version }));

    private static string Hash(string value) =>
        Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(value))).ToLowerInvariant();
}
