using System.Text.Json;
using AnimatedTagPreviews;
using Cove.Plugins;

namespace AnimatedTagPreviews.Backend.Tests;

public sealed class PreviewStateStoreTests
{
    [Fact]
    public async Task Preview_is_persisted_as_one_atomic_json_record_without_bytes_or_paths()
    {
        var extensionStore = new MemoryExtensionStore();
        var state = new PreviewStateStore(() => extensionStore);
        var record = new PreviewRecord(
            9,
            "blob-id",
            "content-version",
            new PreviewRecipe(7, 11, 1.5, 5, 0.5, 0.25, 1.8, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch));

        await state.PublishAsync(record);

        var all = await extensionStore.GetAllAsync();
        var stored = Assert.Single(all);
        Assert.Equal("preview:tag:9", stored.Key);
        Assert.Contains("\"blobId\":\"blob-id\"", stored.Value, StringComparison.Ordinal);
        Assert.Contains("\"recipe\"", stored.Value, StringComparison.Ordinal);
        Assert.DoesNotContain("base64", stored.Value, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("/media/", stored.Value, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Candidate_metadata_is_durable_and_addressed_by_unguessable_candidate_id()
    {
        var extensionStore = new MemoryExtensionStore();
        var state = new PreviewStateStore(() => extensionStore);
        var candidateId = Guid.NewGuid().ToString("N");
        var candidate = new PreviewCandidateRecord(
            candidateId,
            7,
            9,
            "candidate-blob",
            new PreviewRecipe(7, 11, 1.5, 5, 0.5, 0.25, 1.8, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch),
            DateTimeOffset.UnixEpoch);

        await state.SaveCandidateAsync(candidate);
        var reloaded = await new PreviewStateStore(() => extensionStore).GetCandidateAsync(candidateId);

        Assert.Equal(candidate, reloaded);
        var stored = Assert.Single(await extensionStore.GetAllAsync());
        Assert.Equal($"candidate:{candidateId}", stored.Key);
        Assert.Contains("\"blobId\":\"candidate-blob\"", stored.Value, StringComparison.Ordinal);
        Assert.DoesNotContain("/media/", stored.Value, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Approval_receipt_survives_candidate_removal_without_becoming_a_candidate_blob_reference()
    {
        var extensionStore = new MemoryExtensionStore();
        var state = new PreviewStateStore(() => extensionStore);
        var candidateId = Guid.NewGuid().ToString("N");
        var receipt = new PreviewApprovalReceipt(
            candidateId,
            7,
            9,
            candidateId,
            ReplacedExisting: true,
            PreviousBlobId: "previous-blob",
            PreviousVersion: "previous-version",
            DateTimeOffset.UnixEpoch);

        await state.SaveApprovalReceiptAsync(receipt);
        var reloaded = await new PreviewStateStore(() => extensionStore).GetApprovalReceiptAsync(candidateId);

        Assert.Equal(receipt, reloaded);
        var stored = Assert.Single(await extensionStore.GetAllAsync());
        Assert.Equal($"approval-receipt:{candidateId}", stored.Key);
        Assert.Contains("previous-blob", stored.Value, StringComparison.Ordinal);
        Assert.DoesNotContain("candidate-blob", stored.Value, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Older_settings_gain_the_new_aspect_and_fit_defaults()
    {
        var extensionStore = new MemoryExtensionStore();
        await extensionStore.SetAsync("settings", """{"defaultDurationSeconds":5,"maximumDurationSeconds":10,"defaultWidth":720,"maximumWidth":720,"frameRate":24,"minimumBitrateKbps":300,"maximumBitrateKbps":2500,"encodingTimeoutSeconds":120,"enabledSurfaces":["card","hero"],"hoverRestart":true,"hoverUnmute":false}""");
        var settings = await new PreviewStateStore(() => extensionStore).GetSettingsAsync();

        Assert.Equal("4:3", settings.AspectRatio);
        Assert.Equal("inherit", settings.CardFit);
        Assert.True(settings.MatchCardAspectRatio);
    }

    [Fact]
    public async Task Entity_filter_tracks_presence_and_absence_after_publish_and_delete()
    {
        var extensionStore = new MemoryExtensionStore();
        var state = new PreviewStateStore(() => extensionStore);
        var provider = new AnimatedPreviewEntityFilterProvider(state);
        var record = new PreviewRecord(
            9,
            "blob-id",
            "content-version",
            new PreviewRecipe(7, 11, 1.5, 5, 0.5, 0.25, 1.8, 720, "libvpx-vp9", 2140, 24, DateTimeOffset.UnixEpoch));

        await state.PublishAsync(record);
        var present = await provider.ResolveAsync(Request(true), default);
        var absent = await provider.ResolveAsync(Request(false), default);

        Assert.Equal([9], present.MatchingEntityIds);
        Assert.Equal([8, 10], absent.MatchingEntityIds);
        var publishedRevision = present.Revision;

        await state.RemovePreviewAsync(9);
        var afterDelete = await provider.ResolveAsync(Request(true), default);

        Assert.Empty(afterDelete.MatchingEntityIds);
        Assert.NotEqual(publishedRevision, afterDelete.Revision);
    }

    private static ExtensionEntityFilterRequest Request(bool value) => new(
        "com.midnightrider.animated-tag-previews",
        "tags",
        "has-preview",
        "equals",
        JsonSerializer.SerializeToElement(value),
        [8, 9, 10],
        new ExtensionFilterPrincipal(null, "system", "System", [], ["*"]));

    private sealed class MemoryExtensionStore : IExtensionStore
    {
        private readonly Dictionary<string, string> _values = new(StringComparer.Ordinal);
        public Task<string?> GetAsync(string key, CancellationToken ct = default)
            => Task.FromResult(_values.GetValueOrDefault(key));
        public Task SetAsync(string key, string value, CancellationToken ct = default)
        {
            _values[key] = value;
            return Task.CompletedTask;
        }
        public Task DeleteAsync(string key, CancellationToken ct = default)
        {
            _values.Remove(key);
            return Task.CompletedTask;
        }
        public Task<Dictionary<string, string>> GetAllAsync(CancellationToken ct = default)
            => Task.FromResult(new Dictionary<string, string>(_values, StringComparer.Ordinal));
    }
}
