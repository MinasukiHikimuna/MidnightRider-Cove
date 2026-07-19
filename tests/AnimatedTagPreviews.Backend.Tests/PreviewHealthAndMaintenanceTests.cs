using System.Diagnostics;
using AnimatedTagPreviews;
using Cove.Core.Entities;
using Cove.Core.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewHealthAndMaintenanceTests
{
    [Fact]
    public void Extension_registration_resolves_maintenance_from_a_validated_request_scope()
    {
        var services = new ServiceCollection();
        services.AddSingleton<IBlobService>(new RecordingDeleteBlobs());
        services.AddScoped<ITagRepository>(_ => new MaintenanceTags());
        new AnimatedTagPreviewsExtension().ConfigureServices(services, null!);
        using var provider = services.BuildServiceProvider(new ServiceProviderOptions { ValidateScopes = true });
        using var scope = provider.CreateScope();

        Assert.IsType<PreviewMaintenanceService>(
            scope.ServiceProvider.GetRequiredService<IPreviewMaintenanceService>());
    }

    [Fact]
    public async Task Health_requires_ffmpeg_ffprobe_and_libvpx_vp9()
    {
        var healthy = await new PreviewHealthService(
            new ProbeRunner(hasVp9: true),
            new CoveConfiguration { FfmpegPath = "configured-ffmpeg", FfprobePath = "configured-ffprobe" })
            .GetAsync(CancellationToken.None);
        var missingEncoder = await new PreviewHealthService(
            new ProbeRunner(hasVp9: false),
            new CoveConfiguration())
            .GetAsync(CancellationToken.None);

        Assert.True(healthy.Healthy);
        Assert.True(healthy.Vp9Encoder.Compatible);
        Assert.False(missingEncoder.Healthy);
        Assert.False(missingEncoder.Vp9Encoder.Compatible);
        Assert.DoesNotContain("configured-ffmpeg", healthy.Ffmpeg.Version ?? string.Empty, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Orphan_cleanup_is_dry_run_and_does_not_delete_blobs()
    {
        var state = new MaintenanceState
        {
            Previews = [Record(1, "referenced")],
            Owned = [
                new OwnedBlobRecord("referenced", 1, DateTimeOffset.UnixEpoch),
                new OwnedBlobRecord("orphan", 2, DateTimeOffset.UnixEpoch),
            ],
        };
        var blobs = new RecordingDeleteBlobs();
        var maintenance = new PreviewMaintenanceService(state, blobs, new MaintenanceTags(1), new PreviewMutationGate());

        var result = await maintenance.CleanupOrphansAsync(dryRun: true, expectedVersion: null, CancellationToken.None);

        Assert.True(result.DryRun);
        Assert.Single(result.BlobIds);
        Assert.Equal("orphan", result.BlobIds[0]);
        Assert.Empty(blobs.Deleted);
    }

    [Fact]
    public async Task Live_durable_candidate_is_a_referenced_blob_not_an_orphan()
    {
        var candidate = Candidate("live-candidate", "candidate-blob", DateTimeOffset.UtcNow);
        var state = new MaintenanceState
        {
            Candidates = [candidate],
            Owned = [new OwnedBlobRecord(candidate.BlobId, candidate.TagId, candidate.CreatedAt)],
        };
        var maintenance = new PreviewMaintenanceService(
            state,
            new RecordingDeleteBlobs(),
            new MaintenanceTags(candidate.TagId),
            new PreviewMutationGate());

        var result = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);

        Assert.Empty(result.BlobIds);
        Assert.Equal(1, result.ReferencedBlobCount);
        Assert.Single(state.Candidates);
    }

    [Fact]
    public async Task Expired_candidate_is_removed_and_its_blob_is_cleaned_after_approved_dry_run()
    {
        var events = new List<string>();
        var candidate = Candidate("expired-candidate", "candidate-blob", DateTimeOffset.UtcNow.AddDays(-2));
        var state = new MaintenanceState(events)
        {
            Candidates = [candidate],
            Owned = [new OwnedBlobRecord(candidate.BlobId, candidate.TagId, candidate.CreatedAt)],
        };
        var maintenance = new PreviewMaintenanceService(
            state,
            new RecordingDeleteBlobs(events),
            new MaintenanceTags(candidate.TagId),
            new PreviewMutationGate());

        var dryRun = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);
        var result = await maintenance.CleanupOrphansAsync(false, dryRun.SnapshotVersion, CancellationToken.None);

        Assert.Equal(["candidate-blob"], dryRun.BlobIds);
        Assert.Empty(state.Candidates);
        Assert.Equal(1, result.DeletedBlobCount);
        Assert.Equal(
            ["state.candidate.remove:expired-candidate", "blob.delete:candidate-blob", "state.untrack:candidate-blob"],
            events);
    }

    [Fact]
    public async Task Expired_candidate_sharing_the_live_published_blob_is_counted_and_removed_without_blob_deletion()
    {
        var events = new List<string>();
        var candidate = Candidate("stale-candidate", "shared-blob", DateTimeOffset.UtcNow.AddDays(-2));
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "shared-blob")],
            Candidates = [candidate],
            Owned = [new OwnedBlobRecord("shared-blob", 9, candidate.CreatedAt)],
        };
        var blobs = new RecordingDeleteBlobs(events);
        var maintenance = new PreviewMaintenanceService(state, blobs, new MaintenanceTags(9), new PreviewMutationGate());

        var dryRun = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);
        var completed = await maintenance.CleanupOrphansAsync(false, dryRun.SnapshotVersion, CancellationToken.None);

        Assert.Empty(dryRun.BlobIds);
        Assert.Equal(1, dryRun.StalePreviewCandidateCount);
        Assert.False(string.IsNullOrEmpty(dryRun.SnapshotVersion));
        Assert.Equal(1, completed.StalePreviewCandidateCount);
        Assert.Empty(state.Candidates);
        Assert.Empty(blobs.Deleted);
        Assert.Equal(["state.candidate.remove:stale-candidate"], events);
    }

    [Fact]
    public async Task Stale_published_preview_sharing_a_live_preview_blob_is_counted_and_removed_without_blob_deletion()
    {
        var events = new List<string>();
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "shared-blob"), Record(10, "shared-blob")],
            Owned = [new OwnedBlobRecord("shared-blob", 9, DateTimeOffset.UnixEpoch)],
        };
        var blobs = new RecordingDeleteBlobs(events);
        var maintenance = new PreviewMaintenanceService(state, blobs, new MaintenanceTags(10), new PreviewMutationGate());

        var dryRun = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);
        var completed = await maintenance.CleanupOrphansAsync(false, dryRun.SnapshotVersion, CancellationToken.None);

        Assert.Empty(dryRun.BlobIds);
        Assert.Equal(1, dryRun.StalePreviewRecordCount);
        Assert.False(string.IsNullOrEmpty(dryRun.SnapshotVersion));
        Assert.Equal(1, completed.StalePreviewRecordCount);
        Assert.Equal([10], state.Previews.Select(preview => preview.TagId));
        Assert.Empty(blobs.Deleted);
        Assert.Equal(["state.remove:9"], events);
    }

    [Fact]
    public async Task Approved_cleanup_completes_all_destructive_work_after_request_cancellation()
    {
        var events = new List<string>();
        using var request = new CancellationTokenSource();
        var candidate = Candidate("stale-candidate", "candidate-blob", DateTimeOffset.UtcNow.AddDays(-2));
        var receipt = new PreviewApprovalReceipt(
            "stale-receipt", 7, 10, "version", false, null, null, DateTimeOffset.UtcNow.AddDays(-2));
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "preview-blob")],
            Candidates = [candidate],
            Receipts = [receipt],
            Owned = [
                new OwnedBlobRecord("preview-blob", 9, DateTimeOffset.UnixEpoch),
                new OwnedBlobRecord("candidate-blob", 10, candidate.CreatedAt),
                new OwnedBlobRecord("orphan-blob", 11, DateTimeOffset.UnixEpoch),
            ],
            CancelAfterFirstMutation = request,
        };
        var blobs = new RecordingDeleteBlobs(events);
        var maintenance = new PreviewMaintenanceService(state, blobs, new MaintenanceTags(10), new PreviewMutationGate());
        var dryRun = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);

        var completed = await maintenance.CleanupOrphansAsync(false, dryRun.SnapshotVersion, request.Token);

        Assert.True(request.IsCancellationRequested);
        Assert.Empty(state.Previews);
        Assert.Empty(state.Candidates);
        Assert.Empty(state.Receipts);
        Assert.Equal(3, completed.DeletedBlobCount);
        Assert.Equal(
            [
                "state.remove:9",
                "state.candidate.remove:stale-candidate",
                "state.receipt.remove:stale-receipt",
                "blob.delete:candidate-blob", "state.untrack:candidate-blob",
                "blob.delete:orphan-blob", "state.untrack:orphan-blob",
                "blob.delete:preview-blob", "state.untrack:preview-blob",
            ],
            events);
    }

    [Fact]
    public async Task Approved_orphan_cleanup_deletes_payload_before_untracking_ownership()
    {
        var events = new List<string>();
        var state = new MaintenanceState(events)
        {
            Owned = [new OwnedBlobRecord("orphan", 2, DateTimeOffset.UnixEpoch)],
        };
        var blobs = new RecordingDeleteBlobs(events);
        var maintenance = new PreviewMaintenanceService(state, blobs, new MaintenanceTags(), new PreviewMutationGate());

        var dryRun = await maintenance.CleanupOrphansAsync(dryRun: true, expectedVersion: null, CancellationToken.None);
        var result = await maintenance.CleanupOrphansAsync(dryRun: false, dryRun.SnapshotVersion, CancellationToken.None);

        Assert.False(result.DryRun);
        Assert.Equal(1, result.DeletedBlobCount);
        Assert.Empty(result.FailedBlobIds);
        Assert.Equal(["blob.delete:orphan", "state.untrack:orphan"], events);
    }

    [Fact]
    public async Task Orphan_cleanup_waits_for_in_flight_preview_publication()
    {
        var state = new MaintenanceState();
        var gate = new PreviewMutationGate();
        var maintenance = new PreviewMaintenanceService(state, new RecordingDeleteBlobs(), new MaintenanceTags(), gate);
        var held = await gate.AcquireAsync(CancellationToken.None);
        Task<OrphanCleanupResponse> cleanup;
        try
        {
            cleanup = maintenance.CleanupOrphansAsync(dryRun: true, expectedVersion: null, CancellationToken.None);

            Assert.False(cleanup.IsCompleted);
            Assert.Equal(0, state.PreviewReadCount);

            await held.DisposeAsync();
            await cleanup;
        }
        finally
        {
            await held.DisposeAsync();
        }

        Assert.Equal(1, state.PreviewReadCount);
    }

    [Fact]
    public async Task Cleanup_reports_and_removes_media_for_deleted_tags_only_after_matching_dry_run()
    {
        var state = new MaintenanceState
        {
            Previews = [Record(9, "deleted-tag-blob")],
            Owned = [new OwnedBlobRecord("deleted-tag-blob", 9, DateTimeOffset.UnixEpoch)],
        };
        var blobs = new RecordingDeleteBlobs();
        var maintenance = new PreviewMaintenanceService(state, blobs, new MaintenanceTags(), new PreviewMutationGate());

        var dryRun = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);
        await Assert.ThrowsAsync<OrphanSetChangedException>(() =>
            maintenance.CleanupOrphansAsync(false, "stale-approval", CancellationToken.None));
        Assert.Single(state.Previews);

        var deleted = await maintenance.CleanupOrphansAsync(false, dryRun.SnapshotVersion, CancellationToken.None);

        Assert.Empty(state.Previews);
        Assert.Equal(["deleted-tag-blob"], blobs.Deleted);
        Assert.Equal(1, deleted.DeletedBlobCount);
    }

    [Fact]
    public async Task Deleting_preview_removes_extension_state_without_mutating_the_tag()
    {
        var tag = new Tag { Id = 9, Name = "Kissing", UpdatedAt = DateTime.UnixEpoch };
        var state = new MaintenanceState
        {
            Previews = [Record(9, "preview-blob")],
        };
        var maintenance = new PreviewMaintenanceService(state, new RecordingDeleteBlobs(), new MaintenanceTags(tag), new PreviewMutationGate());

        var result = await maintenance.DeleteAsync(9, CancellationToken.None);

        Assert.True(result.Deleted);
        Assert.Equal(DateTime.UnixEpoch, tag.UpdatedAt);
        Assert.Empty(state.Previews);
    }

    [Fact]
    public async Task Deleting_preview_keeps_state_blob_cleanup_order()
    {
        var events = new List<string>();
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "preview-blob")],
        };
        var maintenance = new PreviewMaintenanceService(state, new RecordingDeleteBlobs(events), new MaintenanceTags(9), new PreviewMutationGate());

        var result = await maintenance.DeleteAsync(9, CancellationToken.None);

        Assert.True(result.Deleted);
        Assert.True(result.BlobDeleted);
        Assert.Equal(["state.remove:9", "blob.delete:preview-blob", "state.untrack:preview-blob"], events);
    }

    [Fact]
    public async Task Deleting_preview_retains_a_deduplicated_blob_referenced_by_another_published_preview()
    {
        var events = new List<string>();
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "shared-blob"), Record(10, "shared-blob")],
        };
        var maintenance = new PreviewMaintenanceService(
            state,
            new RecordingDeleteBlobs(events),
            new MaintenanceTags(9, 10),
            new PreviewMutationGate());

        var result = await maintenance.DeleteAsync(9, CancellationToken.None);

        Assert.True(result.Deleted);
        Assert.False(result.BlobDeleted);
        Assert.Equal(["state.remove:9"], events);
        Assert.Single(state.Previews);
    }

    [Fact]
    public async Task Deleting_preview_retains_a_blob_referenced_by_a_private_candidate()
    {
        var events = new List<string>();
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "shared-blob")],
            Candidates = [Candidate("candidate", "shared-blob", DateTimeOffset.UtcNow)],
        };
        var maintenance = new PreviewMaintenanceService(
            state,
            new RecordingDeleteBlobs(events),
            new MaintenanceTags(9),
            new PreviewMutationGate());

        var result = await maintenance.DeleteAsync(9, CancellationToken.None);

        Assert.True(result.Deleted);
        Assert.False(result.BlobDeleted);
        Assert.Equal(["state.remove:9"], events);
    }

    [Fact]
    public async Task Expired_approval_receipt_is_removed_without_treating_the_published_blob_as_an_orphan()
    {
        var events = new List<string>();
        var receipt = new PreviewApprovalReceipt(
            "approved-candidate",
            7,
            9,
            "published-version",
            ReplacedExisting: false,
            PreviousBlobId: null,
            PreviousVersion: null,
            DateTimeOffset.UtcNow.AddDays(-2));
        var state = new MaintenanceState(events)
        {
            Previews = [Record(9, "published-blob") with { Version = "published-version" }],
            Receipts = [receipt],
            Owned = [new OwnedBlobRecord("published-blob", 9, DateTimeOffset.UtcNow.AddDays(-2))],
        };
        var maintenance = new PreviewMaintenanceService(
            state,
            new RecordingDeleteBlobs(events),
            new MaintenanceTags(9),
            new PreviewMutationGate());

        var dryRun = await maintenance.CleanupOrphansAsync(true, null, CancellationToken.None);
        var completed = await maintenance.CleanupOrphansAsync(false, dryRun.SnapshotVersion, CancellationToken.None);

        Assert.Empty(dryRun.BlobIds);
        Assert.Equal(1, dryRun.ExpiredApprovalReceiptCount);
        Assert.Equal(1, completed.ExpiredApprovalReceiptCount);
        Assert.Empty(state.Receipts);
        Assert.Equal(["state.receipt.remove:approved-candidate"], events);
    }

    private static PreviewRecord Record(int tagId, string blobId) => new(
        tagId,
        blobId,
        "version",
        new PreviewRecipe(7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch));

    private static PreviewCandidateRecord Candidate(string candidateId, string blobId, DateTimeOffset createdAt) => new(
        candidateId,
        7,
        9,
        blobId,
        new PreviewRecipe(7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, createdAt),
        createdAt);

    private sealed class ProbeRunner(bool hasVp9) : IExternalToolRunner
    {
        public Task<ToolRunResult> RunAsync(ProcessStartInfo startInfo, TimeSpan timeout, int outputLimit, CancellationToken ct)
        {
            var isProbe = startInfo.FileName.Contains("ffprobe", StringComparison.OrdinalIgnoreCase);
            var output = isProbe
                ? "ffprobe version 7.1"
                : $"ffmpeg version 7.1\n V..... {(hasVp9 ? "libvpx-vp9" : "libx264")}";
            return Task.FromResult(new ToolRunResult(0, output, string.Empty, false));
        }
    }

    private sealed class RecordingDeleteBlobs(List<string>? events = null) : IBlobService
    {
        public List<string> Deleted { get; } = [];
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();
            Deleted.Add(blobId);
            events?.Add($"blob.delete:{blobId}");
            return Task.CompletedTask;
        }
    }

    private sealed class MaintenanceState(List<string>? events = null) : IPreviewStateStore
    {
        public IReadOnlyList<PreviewRecord> Previews { get; set; } = [];
        public IReadOnlyList<OwnedBlobRecord> Owned { get; set; } = [];
        public IReadOnlyList<PreviewCandidateRecord> Candidates { get; set; } = [];
        public IReadOnlyList<PreviewApprovalReceipt> Receipts { get; set; } = [];
        public CancellationTokenSource? CancelAfterFirstMutation { get; set; }
        private int _mutationCount;
        public int PreviewReadCount { get; private set; }
        public Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default)
        {
            PreviewReadCount++;
            return Task.FromResult(Previews);
        }
        public Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();
            var record = Previews.FirstOrDefault(preview => preview.TagId == tagId);
            Previews = Previews.Where(preview => preview.TagId != tagId).ToArray();
            events?.Add($"state.remove:{tagId}");
            CancelAfterFirstMutationIfNeeded();
            return Task.FromResult(record);
        }
        public Task<PreviewCandidateRecord?> GetCandidateAsync(string candidateId, CancellationToken ct = default)
            => Task.FromResult(Candidates.FirstOrDefault(candidate => candidate.CandidateId == candidateId));
        public Task<IReadOnlyList<PreviewCandidateRecord>> GetCandidatesAsync(CancellationToken ct = default)
            => Task.FromResult(Candidates);
        public Task SaveCandidateAsync(PreviewCandidateRecord record, CancellationToken ct = default)
            => throw new NotSupportedException();
        public Task<PreviewCandidateRecord?> RemoveCandidateAsync(string candidateId, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();
            var record = Candidates.FirstOrDefault(candidate => candidate.CandidateId == candidateId);
            Candidates = Candidates.Where(candidate => candidate.CandidateId != candidateId).ToArray();
            events?.Add($"state.candidate.remove:{candidateId}");
            CancelAfterFirstMutationIfNeeded();
            return Task.FromResult(record);
        }
        public Task<PreviewApprovalReceipt?> GetApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
            => Task.FromResult(Receipts.FirstOrDefault(receipt => receipt.CandidateId == candidateId));
        public Task<IReadOnlyList<PreviewApprovalReceipt>> GetApprovalReceiptsAsync(CancellationToken ct = default)
            => Task.FromResult(Receipts);
        public Task SaveApprovalReceiptAsync(PreviewApprovalReceipt receipt, CancellationToken ct = default)
            => throw new NotSupportedException();
        public Task<PreviewApprovalReceipt?> RemoveApprovalReceiptAsync(string candidateId, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();
            var receipt = Receipts.FirstOrDefault(item => item.CandidateId == candidateId);
            Receipts = Receipts.Where(item => item.CandidateId != candidateId).ToArray();
            events?.Add($"state.receipt.remove:{candidateId}");
            CancelAfterFirstMutationIfNeeded();
            return Task.FromResult(receipt);
        }
        public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default)
        {
            ct.ThrowIfCancellationRequested();
            events?.Add($"state.untrack:{blobId}");
            return Task.CompletedTask;
        }
        public Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default) => Task.FromResult(Owned);

        private void CancelAfterFirstMutationIfNeeded()
        {
            _mutationCount++;
            if (_mutationCount == 1)
                CancelAfterFirstMutation?.Cancel();
        }
    }

    private sealed class MaintenanceTags : ITagRepository
    {
        private readonly Dictionary<int, Tag> _existing;

        public MaintenanceTags()
            : this(Array.Empty<int>()) { }

        public MaintenanceTags(params int[] existingIds)
            : this(existingIds.Select(id => new Tag { Id = id, Name = $"Tag {id}" }).ToArray()) { }

        public MaintenanceTags(Tag existing)
            : this([existing]) { }

        private MaintenanceTags(Tag[] existing)
            => _existing = existing.ToDictionary(tag => tag.Id);

        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default) => Task.FromResult(_existing.GetValueOrDefault(id));
        public Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag> AddAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<Tag> Items, int TotalCount)> FindAsync(TagFilter? filter, FindFilter? findFilter, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByNameAsync(string name, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Tag>> FindByNamesAsync(IReadOnlyList<string> names, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Dictionary<string, Tag>> FindOrCreateByNamesAsync(IReadOnlyList<string> names, CancellationToken ct = default) => throw new NotSupportedException();
    }
}
