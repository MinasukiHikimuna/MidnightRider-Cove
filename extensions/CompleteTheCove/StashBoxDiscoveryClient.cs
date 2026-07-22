using System.Net.Http.Json;
using System.Text.Json;
using Cove.Core.Interfaces;

namespace CompleteTheCove;

public interface ICompletionDiscovery
{
    string Endpoint { get; }
    Task<IReadOnlyList<SourceVideo>> DiscoverAsync(CompletionTarget target, CancellationToken ct);
}

public interface ICompletionDiscoveryProvider
{
    string Name { get; }
    bool Supports(MetadataServerInstance server);
    ICompletionDiscovery Create(MetadataServerInstance server);
}

public sealed class StashBoxDiscoveryProvider : ICompletionDiscoveryProvider
{
    public string Name => "StashBox";
    public bool Supports(MetadataServerInstance server) => string.Equals(server.Name, Name, StringComparison.OrdinalIgnoreCase)
        || string.Equals(server.Name, "StashDB", StringComparison.OrdinalIgnoreCase)
        || Host(server.Endpoint).EndsWith("stashdb.org", StringComparison.OrdinalIgnoreCase)
        || IsGraphQlEndpoint(server.Endpoint) && !Host(server.Endpoint).EndsWith("theporndb.net", StringComparison.OrdinalIgnoreCase);
    public ICompletionDiscovery Create(MetadataServerInstance server) => new StashBoxDiscoveryClient(server);
    private static string Host(string endpoint) => Uri.TryCreate(endpoint, UriKind.Absolute, out var uri) ? uri.Host : "";
    private static bool IsGraphQlEndpoint(string endpoint) => Uri.TryCreate(endpoint, UriKind.Absolute, out var uri)
        && uri.Scheme == Uri.UriSchemeHttps && uri.AbsolutePath.TrimEnd('/').EndsWith("/graphql", StringComparison.OrdinalIgnoreCase);
}

public sealed class TpdbDiscoveryProvider : ICompletionDiscoveryProvider
{
    public string Name => "TPDB";
    public bool Supports(MetadataServerInstance server) => string.Equals(server.Name, Name, StringComparison.OrdinalIgnoreCase) || Host(server.Endpoint).EndsWith("theporndb.net", StringComparison.OrdinalIgnoreCase);
    public ICompletionDiscovery Create(MetadataServerInstance server) => new TpdbDiscoveryClient(server);
    private static string Host(string endpoint) => Uri.TryCreate(endpoint, UriKind.Absolute, out var uri) ? uri.Host : "";
}

public static class CompletionDiscoveryProviders
{
    private static readonly ICompletionDiscoveryProvider[] Providers = [new TpdbDiscoveryProvider(), new StashBoxDiscoveryProvider()];
    public static IReadOnlyList<ICompletionDiscovery> CreateConfigured(
        CoveConfiguration configuration,
        IReadOnlySet<string>? selectedEndpoints = null,
        string? requestedEndpoint = null)
    {
        var requested = string.IsNullOrWhiteSpace(requestedEndpoint) ? null : CompletionCatalog.NormalizeEndpoint(requestedEndpoint);
        return SelectServers(configuration, selectedEndpoints)
            .Where(server => requested is null || string.Equals(CompletionCatalog.NormalizeEndpoint(server.Endpoint), requested, StringComparison.OrdinalIgnoreCase))
            .Select(server => (Server: server, Provider: Providers.FirstOrDefault(provider => provider.Supports(server))))
            .Where(item => item.Provider is not null)
            .Select(item => item.Provider!.Create(item.Server)).ToList();
    }
    public static IReadOnlyList<string> SupportedEndpoints(CoveConfiguration configuration, IReadOnlySet<string>? selectedEndpoints = null) => SelectServers(configuration, selectedEndpoints)
        .Where(server => Providers.Any(provider => provider.Supports(server))).Select(server => CompletionCatalog.NormalizeEndpoint(server.Endpoint)).Distinct(StringComparer.OrdinalIgnoreCase).ToList();
    public static IReadOnlyList<MetadataServerInstance> SupportedServers(CoveConfiguration configuration) => configuration.Scraping.MetadataServers
        .Where(server => Providers.Any(provider => provider.Supports(server)))
        .DistinctBy(server => CompletionCatalog.NormalizeEndpoint(server.Endpoint), StringComparer.OrdinalIgnoreCase).ToList();
    private static IEnumerable<MetadataServerInstance> SelectServers(CoveConfiguration configuration, IReadOnlySet<string>? selectedEndpoints)
    {
        var selected = selectedEndpoints?.Select(CompletionCatalog.NormalizeEndpoint).ToHashSet(StringComparer.OrdinalIgnoreCase);
        return configuration.Scraping.MetadataServers
            .Where(server => selected is null || selected.Count == 0 || selected.Contains(CompletionCatalog.NormalizeEndpoint(server.Endpoint)));
    }
}

public class StashBoxDiscoveryClient : ICompletionDiscovery, IDisposable
{
    private readonly HttpClient _http;
    private readonly string _endpoint;
    public string Endpoint => _endpoint;

    public StashBoxDiscoveryClient(MetadataServerInstance server, HttpMessageHandler? handler = null)
    {
        if (!Uri.TryCreate(server.Endpoint, UriKind.Absolute, out var serverUri) || serverUri.Scheme != Uri.UriSchemeHttps)
            throw new InvalidOperationException($"The configured {server.Name} endpoint must use HTTPS.");
        _endpoint = CompletionCatalog.NormalizeEndpoint(server.Endpoint);
        _http = handler is null ? new HttpClient() : new HttpClient(handler);
        _http.BaseAddress = serverUri;
        _http.DefaultRequestHeaders.Add("ApiKey", server.ApiKey);
    }

    public async Task<IReadOnlyList<SourceVideo>> DiscoverAsync(CompletionTarget target, CancellationToken ct)
    {
        var results = new Dictionary<string, SourceVideo>(StringComparer.Ordinal);
        var ids = target.EntityType == CompletionTargetType.Studio
            ? await StudioIdsAsync(target.RemoteId, ct)
            : [target.RemoteId];
        foreach (var id in ids)
        {
            for (var page = 1; ; page++)
            {
                var pageResult = await QueryScenesAsync(target.EntityType, id, page, ct);
                foreach (var video in pageResult.Items)
                    results.TryAdd(video.RemoteIds[0].Normalized, video);
                if (pageResult.Items.Count == 0 || pageResult.Items.Count < 25) break;
            }
        }
        return results.Values.ToArray();
    }

    private async Task<IReadOnlyList<string>> StudioIdsAsync(string id, CancellationToken ct)
    {
        const string query = "query($id: ID!) { findStudio(id: $id) { child_studios { id } } }";
        using var doc = await SendAsync(query, new { id }, ct);
        return new[] { id }.Concat(doc.RootElement.GetProperty("data").GetProperty("findStudio").GetProperty("child_studios").EnumerateArray().Select(x => x.GetProperty("id").GetString()!)).ToArray();
    }

    private async Task<(List<SourceVideo> Items, int Count)> QueryScenesAsync(CompletionTargetType mode, string id, int page, CancellationToken ct)
    {
        var field = mode switch { CompletionTargetType.Performer => "performers", CompletionTargetType.Studio => "studios", _ => "tags" };
        var query = $$"""
          query($ids: [ID!]!, $page: Int!) { queryScenes(input: { {{field}}: { value: $ids, modifier: INCLUDES }, per_page: 25, page: $page }) { count scenes {
            id title details release_date code urls { url } images { url } studio { id name parent { id name } }
            performers { performer { id name disambiguation gender aliases } } tags { id name }
          } } }
          """;
        using var doc = await SendAsync(query, new { ids = new[] { id }, page }, ct);
        var root = doc.RootElement.GetProperty("data").GetProperty("queryScenes");
        var items = root.GetProperty("scenes").EnumerateArray().Select(scene => MapVideo(scene, _endpoint)).ToList();
        return (items, root.GetProperty("count").GetInt32());
    }

    public static SourceVideo MapVideo(JsonElement scene, string endpoint)
    {
        var remoteId = scene.GetProperty("id").GetString()!;
        SourceStudio? studio = null;
        if (scene.TryGetProperty("studio", out var studioJson) && studioJson.ValueKind == JsonValueKind.Object)
        {
            SourceStudio? parent = null;
            if (studioJson.TryGetProperty("parent", out var parentJson) && parentJson.ValueKind == JsonValueKind.Object)
                parent = new(0, parentJson.GetProperty("name").GetString()!, false, null, false, [], [], [new(endpoint, parentJson.GetProperty("id").GetString()!)]);
            studio = new(0, studioJson.GetProperty("name").GetString()!, false, null, false, [], [], [new(endpoint, studioJson.GetProperty("id").GetString()!)], parent);
        }
        var performers = scene.GetProperty("performers").EnumerateArray().Select(x => x.GetProperty("performer")).Where(x => x.ValueKind == JsonValueKind.Object).Select(x =>
            new SourcePerformer(0, x.GetProperty("name").GetString()!, Text(x, "disambiguation"), Text(x, "gender"), null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, false, null, [], Strings(x, "aliases"), [new(endpoint, x.GetProperty("id").GetString()!)])).ToArray();
        var tags = scene.GetProperty("tags").EnumerateArray().Select(x => new SourceTag(0, x.GetProperty("name").GetString()!, null, null, false, [], [new(endpoint, x.GetProperty("id").GetString()!)], false)).ToArray();
        var coverUrl = scene.TryGetProperty("images", out var images) && images.ValueKind == JsonValueKind.Array
            ? images.EnumerateArray().Select(x => Text(x, "url")).FirstOrDefault(x => !string.IsNullOrWhiteSpace(x)) : null;
        return new SourceVideo(0, Text(scene, "title"), Text(scene, "code"), Text(scene, "details"), null, Text(scene, "release_date"), false, false, null,
            scene.GetProperty("urls").EnumerateArray().Select(x => x.GetProperty("url").GetString()!).ToArray(), [new(endpoint, remoteId)], studio, tags, performers, coverUrl);
    }

    private async Task<JsonDocument> SendAsync(string query, object variables, CancellationToken ct)
    {
        using var response = await _http.PostAsJsonAsync("", new { query, variables }, ct);
        var payload = await response.Content.ReadAsStringAsync(ct);
        if (!response.IsSuccessStatusCode) throw new HttpRequestException($"Metadata server request failed with {(int)response.StatusCode}.");
        var doc = JsonDocument.Parse(payload);
        if (doc.RootElement.TryGetProperty("errors", out var errors))
        {
            var message = errors[0].GetProperty("message").GetString();
            doc.Dispose();
            throw new InvalidOperationException($"Metadata server query failed: {message}");
        }
        return doc;
    }
    private static string? Text(JsonElement value, string name) => value.TryGetProperty(name, out var item) && item.ValueKind == JsonValueKind.String ? item.GetString() : null;
    private static string[] Strings(JsonElement value, string name) => value.TryGetProperty(name, out var item) && item.ValueKind == JsonValueKind.Array ? item.EnumerateArray().Select(x => x.GetString()!).ToArray() : [];
    public void Dispose() => _http.Dispose();
}
