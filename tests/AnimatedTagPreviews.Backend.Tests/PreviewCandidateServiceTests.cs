using AnimatedTagPreviews;
using Cove.Core.Interfaces;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewCandidateServiceTests
{
    [Fact]
    public async Task Approve_publishes_then_removes_candidate_before_deleting_replaced_blob()
    {
        var events = new List<string>();
        var state = new CandidateState(events)
        {
            Current = Preview("old-blob", "old-version"),
            Candidate = Candidate("candidate-blob"),
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs(events), new PreviewMutationGate());

        var result = await service.ApproveAsync(7, 9, state.Candidate.CandidateId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result.ReplacedExisting);
        Assert.Equal("candidate-blob", state.Current!.BlobId);
        Assert.Null(state.Candidate);
        Assert.NotNull(state.Receipt);
        Assert.Equal(
            ["state.candidate.save", "state.publish:candidate-blob", "state.receipt.save", "state.candidate.remove", "blob.delete:old-blob", "state.untrack:old-blob"],
            events);
    }

    [Fact]
    public async Task Approve_retry_finishes_candidate_removal_and_replaced_blob_cleanup_after_publication_succeeded()
    {
        var events = new List<string>();
        var state = new CandidateState(events)
        {
            Current = Preview("old-blob", "old-version"),
            Candidate = Candidate("candidate-blob"),
            FailRemoveOnce = true,
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs(events), new PreviewMutationGate());
        var candidateId = state.Candidate.CandidateId;

        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.ApproveAsync(7, 9, candidateId, CancellationToken.None));
        var retried = await service.ApproveAsync(7, 9, candidateId, CancellationToken.None);

        Assert.NotNull(retried);
        Assert.True(retried.AlreadyApproved);
        Assert.Equal("candidate-blob", state.Current!.BlobId);
        Assert.Null(state.Candidate);
        Assert.NotNull(state.Receipt);
        Assert.Equal(1, events.Count(item => item == "state.publish:candidate-blob"));
        Assert.Contains("blob.delete:old-blob", events);
    }

    [Fact]
    public async Task Approve_is_idempotent_after_candidate_was_fully_committed_and_removed()
    {
        var state = new CandidateState([])
        {
            Current = Preview("old-blob", "old-version"),
            Candidate = Candidate("candidate-blob"),
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs([]), new PreviewMutationGate());
        var candidateId = state.Candidate.CandidateId;

        var first = await service.ApproveAsync(7, 9, candidateId, CancellationToken.None);
        var retried = await service.ApproveAsync(7, 9, candidateId, CancellationToken.None);

        Assert.NotNull(first);
        Assert.NotNull(retried);
        Assert.True(retried.AlreadyApproved);
        Assert.Equal(first.Published, retried.Published);
        Assert.Null(state.Candidate);
        Assert.NotNull(state.Receipt);
    }

    [Fact]
    public async Task Discard_removes_candidate_before_deleting_blob_and_keeps_ownership_when_delete_fails()
    {
        var events = new List<string>();
        var state = new CandidateState(events) { Candidate = Candidate("candidate-blob") };
        var blobs = new CandidateBlobs(events) { FailDelete = true };
        var service = new PreviewCandidateService(state, blobs, new PreviewMutationGate());

        var result = await service.DiscardAsync(7, 9, state.Candidate.CandidateId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.False(result.BlobDeleted);
        Assert.Null(state.Candidate);
        Assert.Equal(["state.candidate.remove", "blob.delete:candidate-blob"], events);
    }

    [Fact]
    public async Task Candidate_operations_reject_video_tag_and_candidate_path_mismatches()
    {
        var state = new CandidateState([]) { Candidate = Candidate("candidate-blob") };
        var service = new PreviewCandidateService(state, new CandidateBlobs([]), new PreviewMutationGate());

        Assert.Null(await service.ApproveAsync(8, 9, state.Candidate.CandidateId, CancellationToken.None));
        Assert.Null(await service.ApproveAsync(7, 10, state.Candidate.CandidateId, CancellationToken.None));
        Assert.Null(await service.DiscardAsync(7, 9, Guid.NewGuid().ToString("N"), CancellationToken.None));
        Assert.NotNull(state.Candidate);
    }

    [Fact]
    public async Task Approval_retry_does_not_overwrite_a_newer_preview()
    {
        var candidate = Candidate("candidate-blob") with
        {
            ApprovalStartedAt = DateTimeOffset.UtcNow.AddMinutes(-1),
            PreviousBlobId = "old-blob",
            PreviousVersion = "old-version",
        };
        var state = new CandidateState([])
        {
            Current = Preview("newer-blob", "newer-version"),
            Candidate = candidate,
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs([]), new PreviewMutationGate());

        await Assert.ThrowsAsync<PreviewCandidateStaleApprovalException>(() =>
            service.ApproveAsync(7, 9, candidate.CandidateId, CancellationToken.None));

        Assert.Equal("newer-blob", state.Current.BlobId);
        Assert.NotNull(state.Candidate);
    }

    [Fact]
    public async Task Approval_retry_rejects_a_newer_publication_that_reuses_the_predecessor_blob()
    {
        var candidate = Candidate("candidate-blob") with
        {
            ApprovalStartedAt = DateTimeOffset.UtcNow.AddMinutes(-1),
            PreviousBlobId = "shared-blob",
            PreviousVersion = "previous-version",
        };
        var state = new CandidateState([])
        {
            Current = Preview("shared-blob", "newer-version"),
            Candidate = candidate,
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs([]), new PreviewMutationGate());

        await Assert.ThrowsAsync<PreviewCandidateStaleApprovalException>(() =>
            service.ApproveAsync(7, 9, candidate.CandidateId, CancellationToken.None));

        Assert.Equal("newer-version", state.Current.Version);
        Assert.NotNull(state.Candidate);
    }

    [Fact]
    public async Task Discard_conflicts_after_successful_approval_even_after_candidate_removal()
    {
        var state = new CandidateState([]) { Candidate = Candidate("candidate-blob") };
        var service = new PreviewCandidateService(state, new CandidateBlobs([]), new PreviewMutationGate());
        var candidateId = state.Candidate.CandidateId;
        await service.ApproveAsync(7, 9, candidateId, CancellationToken.None);

        await Assert.ThrowsAsync<PreviewCandidateAlreadyPublishedException>(() =>
            service.DiscardAsync(7, 9, candidateId, CancellationToken.None));
    }

    [Fact]
    public async Task Approve_reports_replacement_without_deleting_when_blob_storage_deduplicated_the_payload()
    {
        var events = new List<string>();
        var state = new CandidateState(events)
        {
            Current = Preview("shared-blob", "old-version"),
            Candidate = Candidate("shared-blob"),
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs(events), new PreviewMutationGate());

        var result = await service.ApproveAsync(7, 9, state.Candidate.CandidateId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.True(result.ReplacedExisting);
        Assert.DoesNotContain(events, item => item.StartsWith("blob.delete:", StringComparison.Ordinal));
        Assert.DoesNotContain(events, item => item.StartsWith("state.untrack:", StringComparison.Ordinal));
    }

    [Fact]
    public async Task Discard_retains_a_deduplicated_blob_still_used_by_the_published_preview()
    {
        var events = new List<string>();
        var state = new CandidateState(events)
        {
            Current = Preview("shared-blob", "published-version"),
            Candidate = Candidate("shared-blob"),
        };
        var service = new PreviewCandidateService(state, new CandidateBlobs(events), new PreviewMutationGate());

        var result = await service.DiscardAsync(7, 9, state.Candidate.CandidateId, CancellationToken.None);

        Assert.NotNull(result);
        Assert.False(result.BlobDeleted);
        Assert.True(result.BlobRetained);
        Assert.Null(state.Candidate);
        Assert.DoesNotContain(events, item => item.StartsWith("blob.delete:", StringComparison.Ordinal));
        Assert.DoesNotContain(events, item => item.StartsWith("state.untrack:", StringComparison.Ordinal));
    }

    private static PreviewCandidateRecord Candidate(string blobId) => new(
        Guid.NewGuid().ToString("N"),
        7,
        9,
        blobId,
        Recipe(),
        DateTimeOffset.UtcNow);

    private static PreviewRecord Preview(string blobId, string version) => new(9, blobId, version, Recipe());

    private static PreviewRecipe Recipe() => new(
        7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch);

    private sealed class CandidateState(List<string> events) : IPreviewStateStore
    {
        public PreviewRecord? Current { get; set; }
        public PreviewCandidateRecord? Candidate { get; set; }
        public PreviewApprovalReceipt? Receipt { get; set; }
        public bool FailRemoveOnce { get; set; }

        public Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default) => Task.FromResult(Current);
        public Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default)
        {
            events.Add($"state.publish:{record.BlobId}");
            var old = Current;
            Current = record;
            return Task.FromResult(old);
        }
        public Task<PreviewCandidateRecord?> GetCandidateAsync(string candidateId, CancellationToken ct = default)
            => Task.FromResult(Candidate?.CandidateId == candidateId ? Candidate : null);
        public Task SaveCandidateAsync(PreviewCandidateRecord record, CancellationToken ct = default)
        {
            events.Add("state.candidate.save");
            Candidate = record;
            return Task.CompletedTask;
        }
        public Task<PreviewCandidateRecord?> RemoveCandidateAsync(string candidateId, CancellationToken ct = default)
        {
            events.Add("state.candidate.remove");
            if (FailRemoveOnce)
            {
                FailRemoveOnce = false;
                throw new InvalidOperationException("simulated removal failure");
            }
            var old = Candidate;
            Candidate = null;
            return Task.FromResult(old);
        }
        public Task<PreviewApprovalReceipt?> GetApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
            => Task.FromResult(Receipt?.CandidateId == candidateId ? Receipt : null);
        public Task SaveApprovalReceiptAsync(PreviewApprovalReceipt receipt, CancellationToken ct = default)
        {
            events.Add("state.receipt.save");
            Receipt = receipt;
            return Task.CompletedTask;
        }
        public Task<IReadOnlyList<PreviewApprovalReceipt>> GetApprovalReceiptsAsync(CancellationToken ct = default)
            => Task.FromResult<IReadOnlyList<PreviewApprovalReceipt>>(Receipt is null ? [] : [Receipt]);
        public Task<PreviewApprovalReceipt?> RemoveApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
        {
            var old = Receipt?.CandidateId == candidateId ? Receipt : null;
            Receipt = null;
            return Task.FromResult(old);
        }
        public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default)
        {
            events.Add($"state.untrack:{blobId}");
            return Task.CompletedTask;
        }

        public Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default)
            => Task.FromResult<IReadOnlyList<PreviewRecord>>(Current is null ? [] : [Current]);
        public Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<PreviewCandidateRecord>> GetCandidatesAsync(CancellationToken ct = default)
            => Task.FromResult<IReadOnlyList<PreviewCandidateRecord>>(Candidate is null ? [] : [Candidate]);
        public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class CandidateBlobs(List<string> events) : IBlobService
    {
        public bool FailDelete { get; set; }
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default)
        {
            events.Add($"blob.delete:{blobId}");
            return FailDelete
                ? Task.FromException(new InvalidOperationException("simulated deletion failure"))
                : Task.CompletedTask;
        }
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
    }
}
