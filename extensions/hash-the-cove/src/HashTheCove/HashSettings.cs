using System.Text.Json;
using Cove.Core.Interfaces;

namespace HashTheCove;

public sealed record HashSettings(
    bool XxHash = false,
    bool Sha256 = false,
    bool Sha1 = false,
    bool HashVideos = true,
    bool HashGalleries = true)
{
    public static HashSettings From(CoveConfiguration configuration)
    {
        configuration.PluginConfigurations.TryGetValue("com.midnightrider.hash-the-cove", out var values);
        values ??= [];

        return new HashSettings(
            ReadBoolean(values, "xxhash", false),
            ReadBoolean(values, "sha256", false),
            ReadBoolean(values, "sha1", false),
            ReadBoolean(values, "hash_videos", true),
            ReadBoolean(values, "hash_galleries", true));
    }

    public IReadOnlyList<string> EnabledAlgorithms =>
        (XxHash ? new[] { "xxhash" } : [])
        .Concat(Sha256 ? new[] { "sha256" } : [])
        .Concat(Sha1 ? new[] { "sha1" } : [])
        .ToArray();

    private static bool ReadBoolean(
        IReadOnlyDictionary<string, object?> values,
        string name,
        bool defaultValue)
    {
        if (!values.TryGetValue(name, out var value) || value is null)
            return defaultValue;

        return value switch
        {
            bool boolean => boolean,
            JsonElement { ValueKind: JsonValueKind.True } => true,
            JsonElement { ValueKind: JsonValueKind.False } => false,
            string text when bool.TryParse(text, out var parsed) => parsed,
            _ => defaultValue,
        };
    }
}
