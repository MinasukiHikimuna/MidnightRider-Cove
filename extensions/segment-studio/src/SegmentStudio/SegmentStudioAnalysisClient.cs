using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using Cove.Plugins;

namespace SegmentStudio;

public sealed record SegmentStudioAnalysisSettings
{
    public string BaseUrl { get; init; } = string.Empty;

    [JsonIgnore]
    public string? ConfigurationError { get; init; }

    [JsonIgnore]
    public Uri? BaseUri => Uri.TryCreate(BaseUrl, UriKind.Absolute, out var uri)
        ? uri
        : null;

    public bool IsConfigured =>
        BaseUri is not null
        && string.IsNullOrWhiteSpace(ConfigurationError);

    public static SegmentStudioAnalysisSettings FromValues(string? baseUrl)
        => new SegmentStudioAnalysisSettings
        {
            BaseUrl = baseUrl ?? string.Empty,
        }.Normalize();

    public SegmentStudioAnalysisSettings Normalize()
    {
        var baseUrl = (BaseUrl ?? string.Empty).Trim();
        if (baseUrl.Length == 0)
        {
            return this with { BaseUrl = string.Empty, ConfigurationError = null };
        }

        if (!Uri.TryCreate(baseUrl, UriKind.Absolute, out var uri)
            || uri.Scheme is not ("http" or "https"))
        {
            throw new InvalidOperationException(
                "Server URL must be an absolute HTTP or HTTPS URL.");
        }

        if (!string.IsNullOrEmpty(uri.UserInfo)
            || uri.AbsolutePath is not ("" or "/")
            || !string.IsNullOrEmpty(uri.Query)
            || !string.IsNullOrEmpty(uri.Fragment))
        {
            throw new InvalidOperationException(
                "Server URL must contain only the scheme, host, and optional port.");
        }

        return this with
        {
            BaseUrl = uri.ToString().TrimEnd('/'),
            ConfigurationError = null,
        };
    }

    public void EnsureConfigured()
    {
        if (IsConfigured)
        {
            return;
        }

        throw new SegmentStudioAnalysisNotConfiguredException(
            ConfigurationError
            ?? "Segment Studio analysis is disabled. Configure the Server URL in Segment Studio settings.");
    }
}

public sealed class SegmentStudioAnalysisNotConfiguredException(string message)
    : InvalidOperationException(message);

public interface ISegmentStudioAnalysisSettingsStore
{
    Task<SegmentStudioAnalysisSettings> LoadAsync(CancellationToken ct = default);
    Task<SegmentStudioAnalysisSettings> SaveAsync(
        SegmentStudioAnalysisSettings settings,
        CancellationToken ct = default);
}

public sealed class SegmentStudioAnalysisSettingsStore(Func<IExtensionStore> storeFactory)
    : ISegmentStudioAnalysisSettingsStore
{
    private const string SettingsKey = "analysis-settings";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);

    public async Task<SegmentStudioAnalysisSettings> LoadAsync(CancellationToken ct = default)
    {
        var payload = await storeFactory().GetAsync(SettingsKey, ct);
        if (string.IsNullOrWhiteSpace(payload))
        {
            return new();
        }

        try
        {
            return (JsonSerializer.Deserialize<SegmentStudioAnalysisSettings>(payload, JsonOptions)
                ?? new()).Normalize();
        }
        catch (Exception error) when (error is JsonException or InvalidOperationException)
        {
            return new()
            {
                ConfigurationError = "The stored analysis Server URL is invalid. Save it again in Segment Studio settings.",
            };
        }
    }

    public async Task<SegmentStudioAnalysisSettings> SaveAsync(
        SegmentStudioAnalysisSettings settings,
        CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(settings);
        var normalized = settings.Normalize();
        await storeFactory().SetAsync(
            SettingsKey,
            JsonSerializer.Serialize(normalized, JsonOptions),
            ct);
        return normalized;
    }
}

[JsonConverter(typeof(JsonStringEnumConverter<SegmentStudioAnalysisKind>))]
public enum SegmentStudioAnalysisKind
{
    [JsonStringEnumMemberName("aiTagging")]
    AiTagging,
    [JsonStringEnumMemberName("omnishotcut")]
    OmniShotCut,
}

public sealed record SegmentStudioAnalyzeVideoRequest(
    Guid RequestId,
    string SourcePath,
    IReadOnlyList<SegmentStudioAnalysisKind> Analyses,
    SegmentStudioAnalysisProxyOptions? Proxy = null,
    SegmentStudioAnalysisAiOptions? Ai = null,
    [property: JsonPropertyName("omnishotcut")]
    SegmentStudioAnalysisOmniShotCutOptions? OmniShotCut = null)
{
    public string SchemaVersion { get; init; } = "1";
}

public sealed record SegmentStudioAnalysisProxyOptions(bool Enabled = true);

public sealed record SegmentStudioAnalysisAiOptions(
    IReadOnlyList<string>? Models = null,
    IReadOnlyList<string>? CategoriesToSkip = null,
    double FrameIntervalSeconds = 2,
    double Threshold = 0.5,
    double CandidateConfidenceFloor = 0.35,
    bool ReturnConfidence = true,
    bool VrVideo = false,
    string LoadPolicy = "load_if_cheap",
    string? PipelineName = null);

public sealed record SegmentStudioAnalysisOmniShotCutOptions(
    string Mode = "clean_shot",
    int NumContextFrames = 0);

public sealed record SegmentStudioAnalysisReadyResponse(
    bool Ok,
    string ServiceVersion,
    string SchemaVersion,
    IReadOnlyDictionary<string, JsonElement> Checks);

public sealed record SegmentStudioAnalysisCatalogModel(
    string? ConfigName,
    string? Name,
    int? Identifier,
    JsonElement? Version,
    IReadOnlyList<string>? Categories,
    string? Type,
    IReadOnlyList<string>? Capabilities,
    IReadOnlyList<string>? SupportedScopes,
    bool? Active,
    bool? Loaded,
    JsonElement? Info,
    JsonElement? ImageSize,
    bool? ArtifactAvailable,
    bool? Incompatible,
    string? IncompatibilityReason);

public sealed record SegmentStudioAnalyzeVideoResponse(
    string SchemaVersion,
    Guid RequestId,
    Guid RunId,
    string ServiceVersion,
    string Status,
    SegmentStudioAnalysisSource Source,
    SegmentStudioAnalysisProxies Proxies,
    SegmentStudioAnalysisAiResult? Ai,
    [property: JsonPropertyName("omnishotcut")]
    SegmentStudioAnalysisOmniShotCutResult? OmniShotCut,
    SegmentStudioAnalysisMetrics Metrics,
    IReadOnlyList<string> Warnings);

public sealed record SegmentStudioAnalysisSource(
    string Fingerprint,
    long SizeBytes,
    long MtimeNs,
    double DurationSeconds,
    double Fps,
    int Width,
    int Height,
    long FrameCount);

public sealed record SegmentStudioAnalysisProxies(
    string CacheKey,
    string SettingsVersion,
    SegmentStudioAnalysisProxy? Ai,
    [property: JsonPropertyName("omnishotcut")]
    SegmentStudioAnalysisProxy? OmniShotCut);

public sealed record SegmentStudioAnalysisProxy(
    int Width,
    int Height,
    double Fps,
    bool CacheHit,
    long SizeBytes);

public sealed record SegmentStudioAnalysisAiResult(
    IReadOnlyList<SegmentStudioAnalysisModel> Models,
    double FrameIntervalSeconds,
    IReadOnlyList<SegmentStudioAnalysisSegment> Segments);

public sealed record SegmentStudioAnalysisModel(
    string ConfigName,
    string? Name,
    int? Identifier,
    JsonElement? Version,
    IReadOnlyList<string>? Categories);

public sealed record SegmentStudioAnalysisSegment(
    string CandidateKey,
    string Kind,
    string TagName,
    string Title,
    double StartSeconds,
    double EndSeconds,
    double? Confidence,
    string ModelKey,
    int ObservationCount);

public sealed record SegmentStudioAnalysisOmniShotCutResult(
    string ModelRevision,
    string Mode,
    IReadOnlyList<SegmentStudioAnalysisBoundary> Boundaries,
    IReadOnlyDictionary<string, IReadOnlyDictionary<string, int>> LabelCounts);

public sealed record SegmentStudioAnalysisBoundary(
    double StartSeconds,
    double EndSeconds,
    string? TransitionAfter);

public sealed record SegmentStudioAnalysisMetrics(
    double ProbeSeconds,
    double ProxySeconds,
    double? AiSeconds,
    [property: JsonPropertyName("omnishotcutSeconds")]
    double? OmniShotCutSeconds,
    double TotalSeconds);

public sealed class SegmentStudioAnalysisServiceException(
    HttpStatusCode statusCode,
    string code,
    string message,
    bool retryable = false,
    Exception? innerException = null)
    : Exception(message, innerException)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
    public string Code { get; } = code;
    public bool Retryable { get; } = retryable;
}

public interface ISegmentStudioAnalysisClient
{
    Task<SegmentStudioAnalysisReadyResponse> ReadyAsync(CancellationToken ct = default);
    Task<IReadOnlyList<SegmentStudioAnalysisCatalogModel>> GetCatalogAsync(CancellationToken ct = default);
    Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
        SegmentStudioAnalyzeVideoRequest request,
        CancellationToken ct = default);
}

public sealed class SegmentStudioAnalysisClient(
    HttpClient httpClient,
    ISegmentStudioAnalysisSettingsStore settings) : ISegmentStudioAnalysisClient
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
        Converters = { new JsonStringEnumConverter<SegmentStudioAnalysisKind>(JsonNamingPolicy.CamelCase) },
    };

    private readonly HttpClient _httpClient = httpClient;
    private readonly ISegmentStudioAnalysisSettingsStore _settings = settings;

    public Task<SegmentStudioAnalysisReadyResponse> ReadyAsync(CancellationToken ct = default)
        => SendAsync<SegmentStudioAnalysisReadyResponse>(
            HttpMethod.Get, "/readyz", null, ct);

    public Task<IReadOnlyList<SegmentStudioAnalysisCatalogModel>> GetCatalogAsync(CancellationToken ct = default)
        => SendCatalogAsync(ct);

    public async Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
        SegmentStudioAnalyzeVideoRequest request,
        CancellationToken ct = default)
    {
        ArgumentNullException.ThrowIfNull(request);
        var normalized = request with
        {
            Proxy = request.Proxy ?? new SegmentStudioAnalysisProxyOptions(),
            Ai = request.Analyses.Contains(SegmentStudioAnalysisKind.AiTagging)
                ? request.Ai ?? new SegmentStudioAnalysisAiOptions()
                : null,
            OmniShotCut = request.Analyses.Contains(SegmentStudioAnalysisKind.OmniShotCut)
                ? request.OmniShotCut ?? new SegmentStudioAnalysisOmniShotCutOptions()
                : null,
        };
        return await SendAsync<SegmentStudioAnalyzeVideoResponse>(
            HttpMethod.Post,
            "/v1/analyze-video",
            JsonContent.Create(normalized, options: JsonOptions),
            ct);
    }

    private async Task<IReadOnlyList<SegmentStudioAnalysisCatalogModel>> SendCatalogAsync(CancellationToken ct)
    {
        var result = await SendAsync<List<SegmentStudioAnalysisCatalogModel>>(
            HttpMethod.Get, "/v1/ai/catalog", null, ct);
        return result;
    }

    private async Task<T> SendAsync<T>(
        HttpMethod method,
        string relativePath,
        HttpContent? content,
        CancellationToken ct)
    {
        var settings = await _settings.LoadAsync(ct);
        settings.EnsureConfigured();
        using var request = new HttpRequestMessage(
            method,
            new Uri(settings.BaseUri!, relativePath))
        {
            Content = content,
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        try
        {
            using (var response = await _httpClient.SendAsync(
                request, HttpCompletionOption.ResponseHeadersRead, ct))
            {
                if (!response.IsSuccessStatusCode)
                {
                    throw await CreateServiceExceptionAsync(response, ct);
                }

                await using var stream = await response.Content.ReadAsStreamAsync(ct);
                var value = await JsonSerializer.DeserializeAsync<T>(stream, JsonOptions, ct);
                return value
                    ?? throw new SegmentStudioAnalysisServiceException(
                        HttpStatusCode.BadGateway,
                        "invalid_response",
                        "The Segment Studio analysis service returned an empty response.");
            }
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch (SegmentStudioAnalysisServiceException)
        {
            throw;
        }
        catch (Exception error)
        {
            throw new SegmentStudioAnalysisServiceException(
                HttpStatusCode.BadGateway,
                "service_unavailable",
                "The Segment Studio analysis service could not be reached.",
                retryable: true,
                error);
        }
    }

    private static async Task<SegmentStudioAnalysisServiceException> CreateServiceExceptionAsync(
        HttpResponseMessage response,
        CancellationToken ct)
    {
        string code = "service_error";
        var detail = "The Segment Studio analysis service could not complete the request.";
        var retryable = (int)response.StatusCode >= 500 || response.StatusCode == HttpStatusCode.TooManyRequests;
        try
        {
            await using var stream = await response.Content.ReadAsStreamAsync(ct);
            using var document = await JsonDocument.ParseAsync(stream, cancellationToken: ct);
            var root = document.RootElement;
            if (root.TryGetProperty("code", out var codeElement)
                && codeElement.ValueKind == JsonValueKind.String
                && !string.IsNullOrWhiteSpace(codeElement.GetString()))
            {
                code = codeElement.GetString()!;
            }

            if (root.TryGetProperty("detail", out var detailElement)
                && detailElement.ValueKind == JsonValueKind.String
                && !string.IsNullOrWhiteSpace(detailElement.GetString()))
            {
                detail = detailElement.GetString()!;
            }

            if (root.TryGetProperty("retryable", out var retryableElement)
                && retryableElement.ValueKind is JsonValueKind.True or JsonValueKind.False)
            {
                retryable = retryableElement.GetBoolean();
            }
        }
        catch (JsonException)
        {
            // Keep the stable sanitized fallback rather than surfacing an upstream body.
        }

        return new(response.StatusCode, code, detail, retryable);
    }
}
