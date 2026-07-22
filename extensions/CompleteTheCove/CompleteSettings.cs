using System.Text.Json;
using Cove.Core.Interfaces;

namespace CompleteTheCove;

public sealed record CompleteSettings(
    IReadOnlySet<string> ExcludedTagNames,
    IReadOnlySet<string>? SelectedMetadataEndpoints = null)
{
    public static CompleteSettings From(CoveConfiguration configuration)
    {
        configuration.PluginConfigurations.TryGetValue("complete-the-cove", out var values);
        values ??= [];
        var raw = Read(values, "excluded_tags") ?? string.Empty;
        var selected = Read(values, "selected_metadata_endpoints") ?? string.Empty;
        return new(
            raw.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .ToHashSet(StringComparer.OrdinalIgnoreCase),
            selected.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
                .Select(CompletionCatalog.NormalizeEndpoint)
                .ToHashSet(StringComparer.OrdinalIgnoreCase));
    }

    private static string? Read(IReadOnlyDictionary<string, object?> values, string key) =>
        values.TryGetValue(key, out var value) ? value switch
        {
            string text => text.Trim(),
            JsonElement { ValueKind: JsonValueKind.String } json => json.GetString()?.Trim(),
            _ => Convert.ToString(value)?.Trim(),
        } : null;
}
