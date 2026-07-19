using System.Diagnostics;
using AnimatedTagPreviews;
using Cove.Core.Entities;
using Cove.Core.Interfaces;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewHealthAndMaintenanceTests
{
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

    private static PreviewRecord Record(int tagId, string blobId) => new(
        tagId,
        blobId,
        "version",
        new PreviewRecipe(7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch));

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
            Deleted.Add(blobId);
            events?.Add($"blob.delete:{blobId}");
            return Task.CompletedTask;
        }
    }

    private sealed class MaintenanceState(List<string>? events = null) : IPreviewStateStore
    {
        public IReadOnlyList<PreviewRecord> Previews { get; set; } = [];
        public IReadOnlyList<OwnedBlobRecord> Owned { get; set; } = [];
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
            var record = Previews.FirstOrDefault(preview => preview.TagId == tagId);
            Previews = Previews.Where(preview => preview.TagId != tagId).ToArray();
            events?.Add($"state.remove:{tagId}");
            return Task.FromResult(record);
        }
        public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default)
        {
            events?.Add($"state.untrack:{blobId}");
            return Task.CompletedTask;
        }
        public Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default) => Task.FromResult(Owned);
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
