using System.Net.Http.Headers;
using System.Text.Json;
using Cove.Core.Interfaces;

namespace CompleteTheCove;

public sealed class TpdbDiscoveryClient : ICompletionDiscovery, IDisposable
{
    private const int PageSize = 25;
    private readonly HttpClient _http;
    private readonly string _endpoint;
    public string Endpoint => _endpoint;

    public TpdbDiscoveryClient(MetadataServerInstance server, HttpMessageHandler? handler = null)
    {
        if (!Uri.TryCreate(server.Endpoint, UriKind.Absolute, out var serverUri) || serverUri.Scheme != Uri.UriSchemeHttps)
            throw new InvalidOperationException($"The configured {server.Name} endpoint must use HTTPS.");

        _endpoint = CompletionCatalog.NormalizeEndpoint(server.Endpoint);
        _http = handler is null ? new HttpClient() : new HttpClient(handler);
        _http.BaseAddress = new Uri("https://api.theporndb.net/");
        if (!string.IsNullOrWhiteSpace(server.ApiKey))
            _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", server.ApiKey);
    }

    public async Task<IReadOnlyList<SourceVideo>> DiscoverAsync(CompletionTarget target, CancellationToken ct)
    {
        string path;
        if (target.EntityType == CompletionTargetType.Tag)
        {
            var tagId = await ResolveTagIdAsync(target.RemoteId, target.DisplayName, ct);
            path = $"scenes?tags%5B{Escape(tagId)}%5D={Escape(target.DisplayName)}";
        }
        else
        {
            path = target.EntityType == CompletionTargetType.Performer
                ? $"performers/{Escape(target.RemoteId)}/scenes"
                : $"sites/{Escape(target.RemoteId)}/scenes";
        }
        return await QueryVideosAsync(path, ct);
    }

    private async Task<string> ResolveTagIdAsync(string remoteId, string name, CancellationToken ct)
    {
        if (!string.IsNullOrWhiteSpace(remoteId) && remoteId.All(char.IsAsciiDigit))
            return remoteId;

        using var response = await _http.GetAsync($"tags?q={Escape(name)}&per_page=100", ct);
        if (!response.IsSuccessStatusCode)
            throw new HttpRequestException($"TPDB tag request failed with {(int)response.StatusCode}.");

        using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
        if (!document.RootElement.TryGetProperty("data", out var data) || data.ValueKind != JsonValueKind.Array)
            throw new InvalidOperationException("TPDB returned an invalid tag response.");

        var matches = data.EnumerateArray().ToArray();
        var tag = matches.FirstOrDefault(item => string.Equals(Scalar(item, "uuid"), remoteId, StringComparison.OrdinalIgnoreCase));
        if (tag.ValueKind == JsonValueKind.Undefined)
            tag = matches.FirstOrDefault(item => string.Equals(Text(item, "name"), name, StringComparison.OrdinalIgnoreCase));
        return tag.ValueKind == JsonValueKind.Undefined || Scalar(tag, "id") is not { } id
            ? throw new InvalidOperationException("The tracked tag was not found in TPDB's REST catalog.")
            : id;
    }

    private async Task<IReadOnlyList<SourceVideo>> QueryVideosAsync(string path, CancellationToken ct)
    {
        var results = new Dictionary<string, SourceVideo>(StringComparer.Ordinal);
        for (var page = 1; ; page++)
        {
            var separator = path.Contains('?', StringComparison.Ordinal) ? '&' : '?';
            using var response = await _http.GetAsync($"{path}{separator}page={page}&per_page={PageSize}", ct);
            if (!response.IsSuccessStatusCode)
                throw new HttpRequestException($"TPDB request failed with {(int)response.StatusCode}.");

            using var document = JsonDocument.Parse(await response.Content.ReadAsStringAsync(ct));
            var root = document.RootElement;
            if (!root.TryGetProperty("data", out var data) || data.ValueKind != JsonValueKind.Array)
                throw new InvalidOperationException("TPDB returned an invalid video response.");

            foreach (var video in data.EnumerateArray().Select(MapVideo))
                results.TryAdd(video.RemoteIds[0].Normalized, video);

            if (IsLastPage(root, data.GetArrayLength(), page))
                break;
        }
        return results.Values.ToArray();
    }

    private SourceVideo MapVideo(JsonElement video)
    {
        var remoteId = Scalar(video, "id") ?? throw new InvalidOperationException("TPDB returned a video without an id.");
        var studio = video.TryGetProperty("site", out var site) && site.ValueKind == JsonValueKind.Object ? MapStudio(site) : null;
        var performers = Array(video, "performers").Select(MapPerformer).Where(x => x is not null).Cast<SourcePerformer>().ToArray();
        var tags = Array(video, "tags").Select(MapTag).Where(x => x is not null).Cast<SourceTag>().ToArray();
        var urls = new List<string>();
        AddUrl(urls, Text(video, "url"));
        if (video.TryGetProperty("links", out var links) && links.ValueKind == JsonValueKind.Object)
            foreach (var link in links.EnumerateObject()) AddUrl(urls, link.Value.ValueKind == JsonValueKind.String ? link.Value.GetString() : null);

        return new SourceVideo(0, Text(video, "title"), Text(video, "external_id") ?? Text(video, "sku"), Text(video, "description"), null,
            Text(video, "date"), false, false, null, urls, [new(_endpoint, remoteId)], studio, tags, performers, CoverUrl(video));
    }

    private SourceStudio? MapStudio(JsonElement site)
    {
        var remoteId = Scalar(site, "uuid") ?? Scalar(site, "id");
        var name = Text(site, "name");
        if (remoteId is null || name is null) return null;

        SourceStudio? parent = null;
        var parentJson = Object(site, "network") ?? Object(site, "parent");
        if (parentJson is { } parentValue)
        {
            var parentId = Scalar(parentValue, "uuid") ?? Scalar(parentValue, "id");
            var parentName = Text(parentValue, "name");
            if (parentId is not null && parentName is not null)
                parent = new(0, parentName, false, Text(parentValue, "description"), false, Urls(parentValue), [], [new(_endpoint, parentId)]);
        }

        return new(0, name, false, Text(site, "description"), false, Urls(site), [], [new(_endpoint, remoteId)], parent);
    }

    private SourcePerformer? MapPerformer(JsonElement item)
    {
        var performer = Object(item, "parent") ?? item;
        var remoteId = Scalar(performer, "id") ?? Scalar(performer, "uuid");
        var name = Text(performer, "name");
        if (remoteId is null || name is null) return null;

        var extras = Object(performer, "extras");
        return new(0, name, Text(performer, "disambiguation"), Text(performer, "gender") ?? (extras is { } value ? Text(value, "gender") : null),
            null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, false, null,
            Urls(performer), Strings(performer, "aliases"), [new(_endpoint, remoteId)]);
    }

    private SourceTag? MapTag(JsonElement tag)
    {
        var remoteId = Scalar(tag, "uuid") ?? Scalar(tag, "id");
        var name = Text(tag, "name");
        return remoteId is null || name is null ? null : new(0, name, null, null, false, [], [new(_endpoint, remoteId)], false);
    }

    private static bool IsLastPage(JsonElement root, int itemCount, int page)
    {
        if (!root.TryGetProperty("meta", out var meta) || meta.ValueKind != JsonValueKind.Object)
            return itemCount < PageSize;
        var last = Integer(meta, "last") ?? Integer(meta, "last_page");
        var current = Integer(meta, "current_page") ?? page;
        return last.HasValue ? current >= last.Value : itemCount < PageSize;
    }

    private static string? CoverUrl(JsonElement video)
    {
        var background = Object(video, "background");
        return (background is { } value ? Text(value, "full") : null)
            ?? Text(video, "image") ?? Text(video, "back_image") ?? Text(video, "poster_image") ?? Text(video, "poster");
    }

    private static JsonElement? Object(JsonElement value, string name) => value.TryGetProperty(name, out var item) && item.ValueKind == JsonValueKind.Object ? item : null;
    private static IEnumerable<JsonElement> Array(JsonElement value, string name) => value.TryGetProperty(name, out var item) && item.ValueKind == JsonValueKind.Array ? item.EnumerateArray() : [];
    private static string? Text(JsonElement value, string name) => value.TryGetProperty(name, out var item) && item.ValueKind == JsonValueKind.String ? item.GetString() : null;
    private static string? Scalar(JsonElement value, string name)
    {
        if (!value.TryGetProperty(name, out var item)) return null;
        return item.ValueKind switch { JsonValueKind.String => item.GetString(), JsonValueKind.Number => item.GetRawText(), _ => null };
    }
    private static int? Integer(JsonElement value, string name) => value.TryGetProperty(name, out var item) && item.TryGetInt32(out var result) ? result : null;
    private static string[] Strings(JsonElement value, string name) => Array(value, name).Where(x => x.ValueKind == JsonValueKind.String).Select(x => x.GetString()!).ToArray();
    private static string[] Urls(JsonElement value)
    {
        var urls = new List<string>();
        AddUrl(urls, Text(value, "url"));
        return urls.ToArray();
    }
    private static void AddUrl(List<string> urls, string? url)
    {
        if (!string.IsNullOrWhiteSpace(url) && !urls.Contains(url, StringComparer.OrdinalIgnoreCase)) urls.Add(url);
    }
    private static string Escape(string value) => Uri.EscapeDataString(value);
    public void Dispose() => _http.Dispose();
}
