using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Diagnostics;
using System.Text.Json;
using System.Text.Json.Serialization;
using Cove.Plugins;
using Microsoft.Extensions.Logging;

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

public sealed record SegmentStudioAnalysisRunError(
    string Code,
    string Phase,
    bool Retryable,
    int? UpstreamHttpStatus,
    string? UpstreamErrorCode);

public sealed record SegmentStudioAnalysisRunStatus(
    string SchemaVersion,
    Guid RequestId,
    Guid RunId,
    string ServiceVersion,
    string Phase,
    DateTimeOffset PhaseStartedAt,
    double ElapsedSeconds,
    int? CompletedUnits,
    int? TotalUnits,
    SegmentStudioAnalysisRunError? Error,
    SegmentStudioAnalyzeVideoResponse? Result);

public sealed record SegmentStudioAnalysisProgress(
    Guid RequestId,
    Guid RunId,
    string Phase,
    DateTimeOffset PhaseStartedAt,
    double ElapsedSeconds,
    int? CompletedUnits,
    int? TotalUnits);

public sealed class SegmentStudioAnalysisServiceException(
    HttpStatusCode statusCode,
    string code,
    string message,
    bool retryable = false,
    Exception? innerException = null,
    string? phase = null,
    int? upstreamHttpStatus = null,
    string? upstreamErrorCode = null)
    : Exception(message, innerException)
{
    public HttpStatusCode StatusCode { get; } = statusCode;
    public string Code { get; } = code;
    public bool Retryable { get; } = retryable;
    public string? Phase { get; } = phase;
    public int? UpstreamHttpStatus { get; } = upstreamHttpStatus;
    public string? UpstreamErrorCode { get; } = upstreamErrorCode;
}

public interface ISegmentStudioAnalysisClient
{
    Task<SegmentStudioAnalysisReadyResponse> ReadyAsync(CancellationToken ct = default);
    Task<IReadOnlyList<SegmentStudioAnalysisCatalogModel>> GetCatalogAsync(CancellationToken ct = default);
    Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
        SegmentStudioAnalyzeVideoRequest request,
        CancellationToken ct = default);
    Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
        SegmentStudioAnalyzeVideoRequest request,
        IProgress<SegmentStudioAnalysisProgress>? progress,
        CancellationToken ct = default)
        => AnalyzeVideoAsync(request, ct);
}

public sealed class SegmentStudioAnalysisClient(
    HttpClient httpClient,
    ISegmentStudioAnalysisSettingsStore settings,
    ILogger<SegmentStudioAnalysisClient> logger) : ISegmentStudioAnalysisClient
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
        => await AnalyzeVideoAsync(request, progress: null, ct);

    public async Task<SegmentStudioAnalyzeVideoResponse> AnalyzeVideoAsync(
        SegmentStudioAnalyzeVideoRequest request,
        IProgress<SegmentStudioAnalysisProgress>? progress,
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
        var started = Stopwatch.GetTimestamp();
        logger.LogInformation(
            "Dispatching Segment Studio analysis {RequestId} for {AnalysisCount} analysis kind(s): {Analyses}",
            request.RequestId,
            normalized.Analyses.Count,
            string.Join(",", normalized.Analyses));
        try
        {
            var (accepted, statusPath) = await StartAnalysisAsync(normalized, ct);
            ReportProgress(accepted, progress);
            var status = accepted;
            while (status.Phase is not "completed" and not "failed")
            {
                status = await SendAsync<SegmentStudioAnalysisRunStatus>(
                    HttpMethod.Get, statusPath, null, ct);
                EnsureCorrelatedStatus(request.RequestId, accepted.RunId, status);
                ReportProgress(status, progress);
                if (status.Phase is not "completed" and not "failed")
                    await Task.Delay(TimeSpan.FromSeconds(1), ct);
            }
            if (status.Phase == "failed")
                throw CreateRunFailure(status);
            var response = status.Result
                ?? throw new SegmentStudioAnalysisServiceException(
                    HttpStatusCode.BadGateway,
                    "invalid_response",
                    "The Segment Studio analysis service completed without a result.");
            if (response.RequestId != request.RequestId || response.RunId != accepted.RunId)
                throw new SegmentStudioAnalysisServiceException(
                    HttpStatusCode.BadGateway,
                    "invalid_response",
                    "The Segment Studio analysis service returned a mismatched analysis result.");
            logger.LogInformation(
                "Segment Studio analysis {RequestId} completed as service run {ServiceRunId} in {ElapsedMs} ms (service reported {ServiceSeconds} s)",
                request.RequestId,
                response.RunId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds,
                response.Metrics.TotalSeconds);
            return response;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            logger.LogInformation(
                "Segment Studio analysis {RequestId} was cancelled after {ElapsedMs} ms",
                request.RequestId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds);
            throw;
        }
        catch (SegmentStudioAnalysisServiceException exception)
        {
            logger.LogWarning(
                exception,
                "Segment Studio analysis {RequestId} failed after {ElapsedMs} ms: status={StatusCode}, code={ErrorCode}, phase={Phase}, retryable={Retryable}, upstreamStatus={UpstreamStatus}, upstreamCode={UpstreamCode}",
                request.RequestId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds,
                (int)exception.StatusCode,
                exception.Code,
                exception.Phase,
                exception.Retryable,
                exception.UpstreamHttpStatus,
                exception.UpstreamErrorCode);
            throw;
        }
        catch (Exception exception)
        {
            logger.LogError(
                exception,
                "Segment Studio analysis {RequestId} failed after {ElapsedMs} ms before a service response was available",
                request.RequestId,
                Stopwatch.GetElapsedTime(started).TotalMilliseconds);
            throw;
        }
    }

    private async Task<(SegmentStudioAnalysisRunStatus Status, string StatusPath)> StartAnalysisAsync(
        SegmentStudioAnalyzeVideoRequest requestBody,
        CancellationToken ct)
    {
        var settings = await _settings.LoadAsync(ct);
        settings.EnsureConfigured();
        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            new Uri(settings.BaseUri!, "/v1/analyze-video"))
        {
            Content = JsonContent.Create(requestBody, options: JsonOptions),
        };
        request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        HttpResponseMessage response;
        try
        {
            response = await _httpClient.SendAsync(
                request, HttpCompletionOption.ResponseHeadersRead, ct);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
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
        using (response)
        {
        if (!response.IsSuccessStatusCode)
            throw await CreateServiceExceptionAsync(response, ct);
        if (response.StatusCode != HttpStatusCode.Accepted)
            throw new SegmentStudioAnalysisServiceException(
                HttpStatusCode.BadGateway,
                "invalid_response",
                "The Segment Studio analysis service did not accept the analysis asynchronously.");
        var location = response.Headers.Location
            ?? throw new SegmentStudioAnalysisServiceException(
                HttpStatusCode.BadGateway,
                "invalid_response",
                "The Segment Studio analysis service omitted the analysis status location.");
        var statusUri = location.IsAbsoluteUri ? location : new Uri(settings.BaseUri!, location);
        if (!SameOrigin(settings.BaseUri!, statusUri))
            throw new SegmentStudioAnalysisServiceException(
                HttpStatusCode.BadGateway,
                "invalid_response",
                "The Segment Studio analysis service returned an invalid analysis status location.");
        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        var status = await JsonSerializer.DeserializeAsync<SegmentStudioAnalysisRunStatus>(
            stream, JsonOptions, ct)
            ?? throw new SegmentStudioAnalysisServiceException(
                HttpStatusCode.BadGateway,
                "invalid_response",
                "The Segment Studio analysis service returned an empty acceptance response.");
        EnsureCorrelatedStatus(requestBody.RequestId, status.RunId, status);
            return (status, statusUri.PathAndQuery);
        }
    }

    private static bool SameOrigin(Uri expected, Uri actual)
        => string.Equals(expected.Scheme, actual.Scheme, StringComparison.OrdinalIgnoreCase)
            && string.Equals(expected.Host, actual.Host, StringComparison.OrdinalIgnoreCase)
            && expected.Port == actual.Port;

    private static void EnsureCorrelatedStatus(
        Guid requestId,
        Guid runId,
        SegmentStudioAnalysisRunStatus status)
    {
        if (status.RequestId != requestId || status.RunId != runId)
            throw new SegmentStudioAnalysisServiceException(
                HttpStatusCode.BadGateway,
                "invalid_response",
                "The Segment Studio analysis service returned mismatched run status.");
    }

    private static void ReportProgress(
        SegmentStudioAnalysisRunStatus status,
        IProgress<SegmentStudioAnalysisProgress>? progress)
        => progress?.Report(new(
            status.RequestId,
            status.RunId,
            status.Phase,
            status.PhaseStartedAt,
            status.ElapsedSeconds,
            status.CompletedUnits,
            status.TotalUnits));

    private static SegmentStudioAnalysisServiceException CreateRunFailure(
        SegmentStudioAnalysisRunStatus status)
    {
        var error = status.Error;
        var phase = error?.Phase ?? status.Phase;
        var detail = $"Video analysis failed during {FormatPhase(phase)}.";
        return new(
            HttpStatusCode.BadGateway,
            error?.Code ?? "analysis_failed",
            detail,
            error?.Retryable ?? false,
            phase: phase,
            upstreamHttpStatus: error?.UpstreamHttpStatus,
            upstreamErrorCode: error?.UpstreamErrorCode);
    }

    public static string FormatPhase(string phase) => phase switch
    {
        "queued" => "Queued for analysis",
        "probing" => "Inspecting source video",
        "building_proxy" => "Building analysis proxy",
        "waiting_for_ai" => "Waiting for AI service",
        "ai_tagging" => "Running AI analysis",
        "omnishotcut" => "Detecting shot boundaries",
        "finalizing" => "Finalizing analysis results",
        "completed" => "Analysis complete",
        "failed" => "Analysis failed",
        _ => "Running video analysis",
    };

    public static double EstimateProgress(
        SegmentStudioAnalysisProgress progress,
        IReadOnlyList<SegmentStudioAnalysisKind> analyses)
    {
        var includesAi = analyses.Contains(SegmentStudioAnalysisKind.AiTagging);
        var includesShots = analyses.Contains(SegmentStudioAnalysisKind.OmniShotCut);
        var (start, end) = progress.Phase switch
        {
            "queued" => (0.02, 0.04),
            "probing" => (0.05, 0.10),
            "building_proxy" => (0.12, 0.30),
            "waiting_for_ai" => (0.32, 0.38),
            "ai_tagging" when includesShots => (0.40, 0.68),
            "ai_tagging" => (0.40, 0.88),
            "omnishotcut" when includesAi => (0.70, 0.90),
            "omnishotcut" => (0.32, 0.90),
            "finalizing" => (0.92, 0.98),
            "completed" => (1.0, 1.0),
            _ => (0.02, 0.02),
        };
        if (progress.CompletedUnits is not int completed
            || progress.TotalUnits is not int total
            || total <= 0)
            return start;
        return start + ((end - start) * Math.Clamp((double)completed / total, 0, 1));
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
