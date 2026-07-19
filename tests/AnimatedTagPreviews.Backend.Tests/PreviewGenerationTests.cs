using System.Diagnostics;
using AnimatedTagPreviews;
using Cove.Core.Entities;
using Cove.Core.Interfaces;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewGenerationTests : IDisposable
{
    private readonly string _root = Path.Combine(Path.GetTempPath(), $"animated-preview-tests-{Guid.NewGuid():N}");

    [Fact]
    public async Task Successful_replacement_publishes_new_mapping_before_deleting_old_blob()
    {
        var harness = CreateHarness();
        harness.State.Current = ExistingRecord("old-blob");
        harness.Blobs.NextBlobId = "new-blob";

        var result = await harness.Service.GenerateAsync(7, 9, ValidRequest(), new PreviewCommitGuard(), new NullProgress(), CancellationToken.None);

        Assert.True(result.ReplacedExisting);
        Assert.Equal("new-blob", harness.State.Current!.BlobId);
        Assert.Equal(DateTime.UnixEpoch, harness.Tags.Tag.UpdatedAt);
        Assert.Equal(
            ["blob.store", "state.track:new-blob", "state.publish:new-blob", "blob.delete:old-blob", "state.untrack:old-blob"],
            harness.Events);
        Assert.False(File.Exists(harness.Temporary.LastPath));
    }

    [Fact]
    public async Task Failed_mapping_publication_preserves_old_mapping_and_deletes_new_blob()
    {
        var harness = CreateHarness();
        harness.State.Current = ExistingRecord("old-blob");
        harness.State.FailPublish = true;
        harness.Blobs.NextBlobId = "new-blob";

        await Assert.ThrowsAsync<PreviewGenerationException>(() =>
            harness.Service.GenerateAsync(7, 9, ValidRequest(), new PreviewCommitGuard(), new NullProgress(), CancellationToken.None));

        Assert.Equal("old-blob", harness.State.Current!.BlobId);
        Assert.Equal(
            ["blob.store", "state.track:new-blob", "state.publish:new-blob", "blob.delete:new-blob", "state.untrack:new-blob"],
            harness.Events);
        Assert.False(File.Exists(harness.Temporary.LastPath));
    }

    [Fact]
    public async Task Cancellation_is_propagated_and_temporary_file_is_removed()
    {
        var harness = CreateHarness();
        harness.Runner.Cancel = true;

        await Assert.ThrowsAsync<OperationCanceledException>(() =>
            harness.Service.GenerateAsync(7, 9, ValidRequest(), new PreviewCommitGuard(), new NullProgress(), new CancellationToken(canceled: true)));

        Assert.Empty(harness.Events);
        Assert.False(File.Exists(harness.Temporary.LastPath));
    }

    [Fact]
    public async Task Publication_waits_for_the_shared_mutation_gate_after_storing_the_blob()
    {
        var gate = new PreviewMutationGate();
        var harness = CreateHarness(gate);
        var held = await gate.AcquireAsync(CancellationToken.None);
        try
        {
            var generation = harness.Service.GenerateAsync(7, 9, ValidRequest(), new PreviewCommitGuard(), new NullProgress(), CancellationToken.None);

            Assert.False(generation.IsCompleted);
            Assert.Equal(["blob.store"], harness.Events);

            await held.DisposeAsync();
            await generation;
        }
        finally
        {
            await held.DisposeAsync();
        }

        Assert.Contains("state.publish:new-blob", harness.Events);
    }

    [Fact]
    public async Task Publishing_preview_does_not_mutate_core_tag_state()
    {
        var harness = CreateHarness();
        harness.State.Current = ExistingRecord("old-blob");

        var result = await harness.Service.GenerateAsync(7, 9, ValidRequest(), new PreviewCommitGuard(), new NullProgress(), CancellationToken.None);

        Assert.True(result.ReplacedExisting);
        Assert.Equal("new-blob", harness.State.Current!.BlobId);
        Assert.Equal(DateTime.UnixEpoch, harness.Tags.Tag.UpdatedAt);
        Assert.Equal(
            ["blob.store", "state.track:new-blob", "state.publish:new-blob", "blob.delete:old-blob", "state.untrack:old-blob"],
            harness.Events);
    }

    [Fact]
    public void Source_selection_is_deterministic_and_rejects_files_from_other_videos()
    {
        Directory.CreateDirectory(_root);
        var lower = MakeFile(2, 7, 640, 360, 1000, "lower.mp4");
        var highestLaterId = MakeFile(5, 7, 1920, 1080, 3000, "highest-b.mp4");
        var highest = MakeFile(4, 7, 1920, 1080, 3000, "highest-a.mp4");
        var other = MakeFile(8, 99, 4000, 3000, 9000, "other.mp4");
        var video = new Video { Id = 7, Files = [lower, highestLaterId, highest, other] };

        var automatic = PreviewSourceResolver.Resolve(video, null);
        var invalidExplicit = PreviewSourceResolver.Resolve(video, other.Id);

        Assert.True(automatic.IsValid);
        Assert.Equal(highest.Id, automatic.Value!.File.Id);
        Assert.False(invalidExplicit.IsValid);
        Assert.DoesNotContain(_root, invalidExplicit.Errors[0], StringComparison.Ordinal);
    }

    private Harness CreateHarness(PreviewMutationGate? mutations = null)
    {
        Directory.CreateDirectory(_root);
        var source = MakeFile(11, 7, 1920, 1080, 4_000_000, "source.mp4");
        var video = new Video { Id = 7, Files = [source] };
        var events = new List<string>();
        var state = new FakeState(events);
        var blobs = new FakeBlobs(events);
        var runner = new FakeRunner();
        var temporary = new FakeTemporary(_root);
        var tags = new StubTagRepository(new Tag { Id = 9, Name = "Tag", UpdatedAt = DateTime.UnixEpoch });
        var service = new PreviewGenerationService(
            new StubVideoRepository(video),
            tags,
            blobs,
            state,
            runner,
            new HealthyDependencies(),
            mutations ?? new PreviewMutationGate(),
            temporary,
            new CoveConfiguration { FfmpegPath = "ffmpeg", FfprobePath = "ffprobe", CachePath = _root });
        return new Harness(service, state, blobs, runner, temporary, tags, events);
    }

    private VideoFile MakeFile(int id, int videoId, int width, int height, long bitrate, string name)
    {
        var path = Path.Combine(_root, name);
        File.WriteAllBytes(path, [1]);
        return new VideoFile
        {
            Id = id,
            VideoId = videoId,
            Width = width,
            Height = height,
            BitRate = bitrate,
            Duration = 60,
            Basename = name,
            Path = path,
        };
    }

    private static GeneratePreviewRequest ValidRequest() => new(11, 1, 5, 0.5, 0.5, 1, null);

    private static PreviewRecord ExistingRecord(string blobId) => new(
        9,
        blobId,
        "old-version",
        new PreviewRecipe(7, 11, 1, 5, 0.5, 0.5, 1, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch));

    public void Dispose()
    {
        try { Directory.Delete(_root, recursive: true); }
        catch (DirectoryNotFoundException) { }
    }

    private sealed record Harness(
        PreviewGenerationService Service,
        FakeState State,
        FakeBlobs Blobs,
        FakeRunner Runner,
        FakeTemporary Temporary,
        StubTagRepository Tags,
        List<string> Events);

    private sealed class FakeRunner : IExternalToolRunner
    {
        public bool Cancel { get; set; }

        public Task<ToolRunResult> RunAsync(ProcessStartInfo startInfo, TimeSpan timeout, int outputLimit, CancellationToken ct)
        {
            if (Cancel)
                throw new OperationCanceledException(ct);
            if (startInfo.FileName == "ffprobe")
                return Task.FromResult(new ToolRunResult(0,
                    "{\"streams\":[{\"codec_name\":\"vp9\",\"width\":720,\"height\":540}],\"format\":{\"format_name\":\"matroska,webm\",\"duration\":\"5.0\"}}",
                    string.Empty,
                    false));
            File.WriteAllBytes(startInfo.ArgumentList[^1], [1, 2, 3]);
            return Task.FromResult(new ToolRunResult(0, string.Empty, string.Empty, false));
        }
    }

    private sealed class HealthyDependencies : IPreviewHealthService
    {
        public Task<PreviewHealthResponse> GetAsync(CancellationToken ct) => Task.FromResult(new PreviewHealthResponse(
            true,
            new ToolHealth(true, true, "ffmpeg version test", null),
            new ToolHealth(true, true, "ffprobe version test", null),
            new ToolHealth(true, true, null, null)));
    }

    private sealed class FakeTemporary(string root) : ITemporaryFileProvider
    {
        public string LastPath { get; private set; } = string.Empty;
        public string CreateWebmPath() => LastPath = Path.Combine(root, "temporary.webm");
        public void DeleteIfExists(string path) => File.Delete(path);
    }

    private sealed class FakeBlobs(List<string> events) : IBlobService
    {
        public string NextBlobId { get; set; } = "new-blob";
        public Task<string> StoreBlobAsync(Stream data, string contentType, CancellationToken ct = default)
        {
            events.Add("blob.store");
            Assert.Equal("video/webm", contentType);
            return Task.FromResult(NextBlobId);
        }
        public Task<(Stream Stream, string ContentType)?> GetBlobAsync(string blobId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteBlobAsync(string blobId, CancellationToken ct = default)
        {
            events.Add($"blob.delete:{blobId}");
            return Task.CompletedTask;
        }
    }

    private sealed class FakeState(List<string> events) : IPreviewStateStore
    {
        public PreviewRecord? Current { get; set; }
        public bool FailPublish { get; set; }
        public Task<PreviewSettings> GetSettingsAsync(CancellationToken ct = default) => Task.FromResult(PreviewSettings.Default);
        public Task SaveSettingsAsync(PreviewSettings settings, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> GetPreviewAsync(int tagId, CancellationToken ct = default) => Task.FromResult(Current);
        public Task<IReadOnlyList<PreviewRecord>> GetPreviewsAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<PreviewRecord?> PublishAsync(PreviewRecord record, CancellationToken ct = default)
        {
            events.Add($"state.publish:{record.BlobId}");
            if (FailPublish)
                throw new InvalidOperationException("simulated persistence failure");
            var old = Current;
            Current = record;
            return Task.FromResult(old);
        }
        public Task<PreviewRecord?> RemovePreviewAsync(int tagId, CancellationToken ct = default) => throw new NotSupportedException();
        public Task TrackOwnedBlobAsync(OwnedBlobRecord record, CancellationToken ct = default)
        {
            events.Add($"state.track:{record.BlobId}");
            return Task.CompletedTask;
        }
        public Task UntrackOwnedBlobAsync(string blobId, CancellationToken ct = default)
        {
            events.Add($"state.untrack:{blobId}");
            return Task.CompletedTask;
        }
        public Task<IReadOnlyList<OwnedBlobRecord>> GetOwnedBlobsAsync(CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class StubVideoRepository(Video video) : IVideoRepository
    {
        public Task<Video?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default) => Task.FromResult(id == video.Id ? video : null);
        public Task<Video?> GetByIdAsync(int id, CancellationToken ct = default) => Task.FromResult(id == video.Id ? video : null);
        public Task<IReadOnlyList<Video>> GetAllAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Video> AddAsync(Video entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Video entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<Video> Items, int TotalCount)> FindAsync(VideoFilter? filter, FindFilter? findFilter, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<VideoPerformer>> GetVideoPerformersAsync(IReadOnlyList<int> videoIds, CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class StubTagRepository(Tag tag) : ITagRepository
    {
        public Tag Tag => tag;
        public Task<Tag?> GetByIdAsync(int id, CancellationToken ct = default) => Task.FromResult(id == tag.Id ? tag : null);
        public Task<IReadOnlyList<Tag>> GetAllAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag> AddAsync(Tag entity, CancellationToken ct = default) => throw new NotSupportedException();
        public Task UpdateAsync(Tag entity, CancellationToken ct = default)
            => throw new NotSupportedException("Preview generation must not perform a full tag update.");
        public Task DeleteAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<int> CountAsync(CancellationToken ct = default) => throw new NotSupportedException();
        public Task<(IReadOnlyList<Tag> Items, int TotalCount)> FindAsync(TagFilter? filter, FindFilter? findFilter, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByIdWithRelationsAsync(int id, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Tag?> GetByNameAsync(string name, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<IReadOnlyList<Tag>> FindByNamesAsync(IReadOnlyList<string> names, CancellationToken ct = default) => throw new NotSupportedException();
        public Task<Dictionary<string, Tag>> FindOrCreateByNamesAsync(IReadOnlyList<string> names, CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class NullProgress : IJobProgress
    {
        public void Report(double progress, string? subTask = null) { }
    }
}
