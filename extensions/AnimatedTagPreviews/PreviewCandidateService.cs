using Cove.Core.Interfaces;

namespace AnimatedTagPreviews;

public sealed record PreviewCandidateApproval(
    string CandidateId,
    PreviewRecord Published,
    bool ReplacedExisting,
    bool AlreadyApproved);

public sealed record PreviewCandidateDiscard(
    PreviewCandidateRecord Candidate,
    bool BlobDeleted,
    bool BlobRetained);

public interface IPreviewCandidateService
{
    Task<PreviewCandidateApproval?> ApproveAsync(
        int videoId,
        int tagId,
        string candidateId,
        CancellationToken ct);

    Task<PreviewCandidateDiscard?> DiscardAsync(
        int videoId,
        int tagId,
        string candidateId,
        CancellationToken ct);
}

public sealed class PreviewCandidateService(
    IPreviewStateStore state,
    IBlobService blobs,
    PreviewMutationGate mutations) : IPreviewCandidateService
{
    public async Task<PreviewCandidateApproval?> ApproveAsync(
        int videoId,
        int tagId,
        string candidateId,
        CancellationToken ct)
    {
        await using var mutation = await mutations.AcquireAsync(ct);
        var receipt = await state.GetApprovalReceiptAsync(candidateId, ct);
        if (receipt is not null)
        {
            if (receipt.VideoId != videoId || receipt.TagId != tagId)
                return null;
            var receiptPreview = await state.GetPreviewAsync(tagId, ct);
            if (receiptPreview is null
                || !string.Equals(receiptPreview.Version, receipt.Version, StringComparison.Ordinal))
                throw new PreviewCandidateStaleApprovalException();

            await state.RemoveCandidateAsync(candidateId, CancellationToken.None);
            if (receipt.ReplacedExisting
                && !string.IsNullOrEmpty(receipt.PreviousBlobId)
                && !string.Equals(receipt.PreviousBlobId, receiptPreview.BlobId, StringComparison.Ordinal))
                await TryDeleteAndUntrackAsync(receipt.PreviousBlobId);
            return new PreviewCandidateApproval(candidateId, receiptPreview, receipt.ReplacedExisting, AlreadyApproved: true);
        }

        var candidate = await GetMatchingCandidateAsync(videoId, tagId, candidateId, ct);
        if (candidate is null)
            return null;

        var current = await state.GetPreviewAsync(tagId, ct);
        var alreadyApproved = IsPublishedCandidate(current, candidate);
        if (!alreadyApproved)
        {
            if (candidate.ApprovalStartedAt is not null
                && (!string.Equals(current?.BlobId, candidate.PreviousBlobId, StringComparison.Ordinal)
                    || !string.Equals(current?.Version, candidate.PreviousVersion, StringComparison.Ordinal)))
                throw new PreviewCandidateStaleApprovalException();

            if (candidate.ApprovalStartedAt is null)
            {
                candidate = candidate with
                {
                    ApprovalStartedAt = DateTimeOffset.UtcNow,
                    PreviousBlobId = current?.BlobId,
                    PreviousVersion = current?.Version,
                };
                await state.SaveCandidateAsync(candidate, CancellationToken.None);
            }
            current = await state.PublishAsync(
                new PreviewRecord(candidate.TagId, candidate.BlobId, candidate.CandidateId, candidate.Recipe),
                CancellationToken.None);
        }

        var published = new PreviewRecord(candidate.TagId, candidate.BlobId, candidate.CandidateId, candidate.Recipe);
        var replacedExisting = !string.IsNullOrEmpty(candidate.PreviousVersion);
        receipt = new PreviewApprovalReceipt(
            candidate.CandidateId,
            candidate.VideoId,
            candidate.TagId,
            candidate.CandidateId,
            replacedExisting,
            candidate.PreviousBlobId,
            candidate.PreviousVersion,
            DateTimeOffset.UtcNow);
        await state.SaveApprovalReceiptAsync(receipt, CancellationToken.None);
        await state.RemoveCandidateAsync(candidate.CandidateId, CancellationToken.None);

        var replacedBlobId = candidate.PreviousBlobId;
        if (replacedExisting
            && !string.IsNullOrEmpty(replacedBlobId)
            && !string.Equals(replacedBlobId, candidate.BlobId, StringComparison.Ordinal))
            await TryDeleteAndUntrackAsync(replacedBlobId!);

        return new PreviewCandidateApproval(candidateId, published, replacedExisting, alreadyApproved);
    }

    public async Task<PreviewCandidateDiscard?> DiscardAsync(
        int videoId,
        int tagId,
        string candidateId,
        CancellationToken ct)
    {
        await using var mutation = await mutations.AcquireAsync(ct);
        var receipt = await state.GetApprovalReceiptAsync(candidateId, ct);
        if (receipt is not null)
        {
            if (receipt.VideoId != videoId || receipt.TagId != tagId)
                return null;
            throw new PreviewCandidateAlreadyPublishedException();
        }
        var candidate = await GetMatchingCandidateAsync(videoId, tagId, candidateId, ct);
        if (candidate is null)
            return null;

        var current = await state.GetPreviewAsync(tagId, ct);
        if (IsPublishedCandidate(current, candidate))
            throw new PreviewCandidateAlreadyPublishedException();

        await state.RemoveCandidateAsync(candidate.CandidateId, CancellationToken.None);
        var cleanup = await TryDeleteAndUntrackAsync(candidate.BlobId);
        return new PreviewCandidateDiscard(candidate, cleanup.Deleted, cleanup.Retained);
    }

    private async Task<PreviewCandidateRecord?> GetMatchingCandidateAsync(
        int videoId,
        int tagId,
        string candidateId,
        CancellationToken ct)
    {
        var candidate = await state.GetCandidateAsync(candidateId, ct);
        return candidate is not null
            && candidate.VideoId == videoId
            && candidate.TagId == tagId
            ? candidate
            : null;
    }

    private async Task<(bool Deleted, bool Retained)> TryDeleteAndUntrackAsync(string blobId)
    {
        if (await IsReferencedAsync(blobId))
            return (Deleted: false, Retained: true);
        try
        {
            await blobs.DeleteBlobAsync(blobId, CancellationToken.None);
            await state.UntrackOwnedBlobAsync(blobId, CancellationToken.None);
            return (Deleted: true, Retained: false);
        }
        catch
        {
            // The published candidate wins. The durable marker remains for orphan cleanup.
            return (Deleted: false, Retained: false);
        }
    }

    private async Task<bool> IsReferencedAsync(string blobId)
        => (await state.GetPreviewsAsync(CancellationToken.None))
                .Any(preview => string.Equals(preview.BlobId, blobId, StringComparison.Ordinal))
            || (await state.GetCandidatesAsync(CancellationToken.None))
                .Any(candidate => string.Equals(candidate.BlobId, blobId, StringComparison.Ordinal));

    private static bool IsPublishedCandidate(PreviewRecord? current, PreviewCandidateRecord candidate)
        => current is not null
            && string.Equals(current.Version, candidate.CandidateId, StringComparison.Ordinal)
            && string.Equals(current.BlobId, candidate.BlobId, StringComparison.Ordinal);
}

public sealed class PreviewCandidateAlreadyPublishedException : Exception
{
    public PreviewCandidateAlreadyPublishedException()
        : base("The preview candidate has already been published and cannot be discarded.") { }
}

public sealed class PreviewCandidateStaleApprovalException : Exception
{
    public PreviewCandidateStaleApprovalException()
        : base("A newer preview was published while this candidate was awaiting approval.") { }
}
