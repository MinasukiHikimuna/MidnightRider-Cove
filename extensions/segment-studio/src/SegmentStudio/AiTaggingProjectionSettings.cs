using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Cove.Plugins;

namespace SegmentStudio;

/// <summary>
/// Identifies the exact bytes an analysis ran against.
/// </summary>
/// <remarks>
/// Candidate keys are derived from this, so a re-run over an unchanged file
/// re-derives the keys a reviewer has already seen, while replacing or re-encoding
/// the file produces new ones rather than silently attaching old review decisions
/// to different content. The digest shape is the one the superseded analysis
/// service used.
/// </remarks>
public static class SourceFingerprint
{
    public static string For(string path)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(path);
        string payload;
        try
        {
            var info = new FileInfo(path);
            // Size and modification time together are what the service used: cheap
            // to read, and enough to notice the file changed without hashing a
            // multi-gigabyte video on every run.
            var mtimeNanoseconds =
                (info.LastWriteTimeUtc.Ticks - DateTime.UnixEpoch.Ticks) * 100L;
            payload = Compose(info.FullName, mtimeNanoseconds, info.Length);
        }
        catch (Exception error) when (
            error is IOException or UnauthorizedAccessException or ArgumentException)
        {
            // An unreadable file still needs a stable key, and the path alone gives
            // one; it simply cannot notice that the content changed.
            payload = Compose(path, 0, 0);
        }
        return $"sha256:{Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(payload)))}";
    }

    private static string Compose(string canonicalPath, long mtimeNanoseconds, long sizeBytes)
        => $"{{\"canonicalPath\":{JsonSerializer.Serialize(canonicalPath)},"
            + $"\"mtimeNs\":{mtimeNanoseconds},\"sizeBytes\":{sizeBytes}}}";
}

public sealed record AiTaggingProjectionSettings
{
    /// <summary>
    /// How a native tagging run is applied: <c>full</c> queues candidates for
    /// review, <c>basic</c> writes segments straight to the library.
    /// </summary>
    public string Mode { get; init; } = SegmentStudioModes.Full;

    public AiTaggingProjectionSettings Normalize()
        => this with { Mode = SegmentStudioModes.NormalizePublic(Mode) };
}

public interface IAiTaggingProjectionSettingsStore
{
    Task<AiTaggingProjectionSettings> LoadAsync(CancellationToken ct = default);
    Task<AiTaggingProjectionSettings> SaveAsync(
        AiTaggingProjectionSettings settings, CancellationToken ct = default);
}

/// <summary>
/// Where a native tagging run's output goes.
/// </summary>
/// <remarks>
/// Full Scan used the requesting user's output mode, but a native AI run is not
/// anchored to a user, so this is a deployment-wide setting instead. It defaults
/// to review rather than direct writes: queued candidates can be discarded, while
/// segments written straight into the library have to be cleaned up by hand.
/// </remarks>
public sealed class AiTaggingProjectionSettingsStore(Func<IExtensionStore> storeFactory)
    : IAiTaggingProjectionSettingsStore
{
    private const string SettingsKey = "ai-tagging-projection";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<AiTaggingProjectionSettings> LoadAsync(CancellationToken ct = default)
    {
        var payload = await storeFactory().GetAsync(SettingsKey, ct);
        if (string.IsNullOrWhiteSpace(payload))
            return new();
        try
        {
            return (JsonSerializer.Deserialize<AiTaggingProjectionSettings>(payload, JsonOptions)
                ?? new()).Normalize();
        }
        catch (Exception error) when (error is JsonException or InvalidOperationException)
        {
            // An unreadable setting must not silently become direct writes.
            return new();
        }
    }

    public async Task<AiTaggingProjectionSettings> SaveAsync(
        AiTaggingProjectionSettings settings, CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(settings);
        var normalized = settings.Normalize();
        await storeFactory().SetAsync(
            SettingsKey, JsonSerializer.Serialize(normalized, JsonOptions), ct);
        return normalized;
    }
}
