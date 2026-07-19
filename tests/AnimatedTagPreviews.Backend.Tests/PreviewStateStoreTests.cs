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
    public async Task Older_settings_gain_the_new_aspect_and_fit_defaults()
    {
        var extensionStore = new MemoryExtensionStore();
        await extensionStore.SetAsync("settings", """{"defaultDurationSeconds":5,"maximumDurationSeconds":10,"defaultWidth":720,"maximumWidth":720,"frameRate":24,"minimumBitrateKbps":300,"maximumBitrateKbps":2500,"encodingTimeoutSeconds":120,"enabledSurfaces":["card","hero"],"hoverRestart":true,"hoverUnmute":false}""");
        var settings = await new PreviewStateStore(() => extensionStore).GetSettingsAsync();

        Assert.Equal("4:3", settings.AspectRatio);
        Assert.Equal("inherit", settings.CardFit);
        Assert.True(settings.MatchCardAspectRatio);
    }

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
