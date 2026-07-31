using System.Net;
using System.Text;
using System.Text.Json;
using Cove.Plugins;

namespace SegmentStudio.Tests;

public sealed class SegmentStudioAnalysisClientTests
{
    [Fact]
    public async Task ReadyAsync_SendsNoAuthorizationAndParsesChecks()
    {
        var handler = new StubHandler(request =>
        {
            Assert.Equal(HttpMethod.Get, request.Method);
            Assert.Equal("/readyz", request.RequestUri!.AbsolutePath);
            Assert.Null(request.Headers.Authorization);
            return Json(HttpStatusCode.OK, """
                {
                  "ok": true,
                  "serviceVersion": "0.1.0",
                  "schemaVersion": "1",
                  "checks": {
                    "cuda": { "ok": true, "deviceCount": 1 }
                  }
                }
                """);
        });

        var client = CreateClient(handler);
        var ready = await client.ReadyAsync();

        Assert.True(ready.Ok);
        Assert.Equal("0.1.0", ready.ServiceVersion);
        Assert.True(ready.Checks["cuda"].GetProperty("ok").GetBoolean());
    }

    [Fact]
    public async Task AnalyzeVideoAsync_SerializesV1ContractAndParsesCandidates()
    {
        var requestId = Guid.NewGuid();
        var runId = Guid.NewGuid();
        var handler = new StubHandler(request =>
        {
            Assert.Equal("/v1/analyze-video", request.RequestUri!.AbsolutePath);
            Assert.Null(request.Headers.Authorization);
            var body = JsonDocument.Parse(request.Content!.ReadAsStringAsync().GetAwaiter().GetResult()).RootElement;
            Assert.Equal("1", body.GetProperty("schemaVersion").GetString());
            Assert.Equal(requestId, body.GetProperty("requestId").GetGuid());
            Assert.Equal("/mnt/media/source.mp4", body.GetProperty("sourcePath").GetString());
            Assert.Equal(["aiTagging", "omnishotcut"],
                body.GetProperty("analyses").EnumerateArray().Select(item => item.GetString()!).ToArray());
            Assert.Equal(2, body.GetProperty("ai").GetProperty("frameIntervalSeconds").GetDouble());
            Assert.Equal("clean_shot", body.GetProperty("omnishotcut").GetProperty("mode").GetString());

            return Json(HttpStatusCode.OK, $$"""
                {
                  "schemaVersion": "1",
                  "requestId": "{{requestId}}",
                  "runId": "{{runId}}",
                  "serviceVersion": "0.1.0",
                  "status": "completed",
                  "source": {
                    "fingerprint": "sha256:source",
                    "sizeBytes": 100,
                    "mtimeNs": 200,
                    "durationSeconds": 10,
                    "fps": 25,
                    "width": 1920,
                    "height": 1080,
                    "frameCount": 250
                  },
                  "proxies": {
                    "cacheKey": "cache",
                    "settingsVersion": "v1",
                    "ai": { "width": 512, "height": 288, "fps": 0.5, "cacheHit": false, "sizeBytes": 10 },
                    "omnishotcut": { "width": 128, "height": 96, "fps": 25, "cacheHit": false, "sizeBytes": 20 }
                  },
                  "ai": {
                    "models": [{ "configName": "model", "name": "Model", "version": 1 }],
                    "frameIntervalSeconds": 2,
                    "segments": [{
                      "candidateKey": "sha256:candidate",
                      "kind": "tag",
                      "tagName": "Example",
                      "title": "Example",
                      "startSeconds": 1,
                      "endSeconds": 3,
                      "confidence": 0.8,
                      "modelKey": "model",
                      "observationCount": 2
                    }]
                  },
                  "omnishotcut": {
                    "modelRevision": "revision",
                    "mode": "clean_shot",
                    "boundaries": [
                      { "startSeconds": 0, "endSeconds": 5 },
                      { "startSeconds": 5, "endSeconds": 10 }
                    ],
                    "labelCounts": {}
                  },
                  "metrics": {
                    "probeSeconds": 0.1,
                    "proxySeconds": 1,
                    "aiSeconds": 2,
                    "omnishotcutSeconds": 3,
                    "totalSeconds": 6.1
                  },
                  "warnings": []
                }
                """);
        });

        var result = await CreateClient(handler).AnalyzeVideoAsync(new(
            requestId,
            "/mnt/media/source.mp4",
            [SegmentStudioAnalysisKind.AiTagging, SegmentStudioAnalysisKind.OmniShotCut]));

        Assert.Equal(runId, result.RunId);
        Assert.Equal("sha256:source", result.Source.Fingerprint);
        var segment = Assert.Single(result.Ai!.Segments);
        Assert.Equal("sha256:candidate", segment.CandidateKey);
        Assert.Equal(2, result.OmniShotCut!.Boundaries.Count);
    }

    [Fact]
    public async Task AnalyzeVideoAsync_ThrowsSanitizedServiceException()
    {
        var handler = new StubHandler(_ => Json(HttpStatusCode.BadGateway, """
            {
              "code": "ai_server_unavailable",
              "detail": "The AI analysis service could not complete the request.",
              "retryable": true
            }
            """));

        var exception = await Assert.ThrowsAsync<SegmentStudioAnalysisServiceException>(() =>
            CreateClient(handler).AnalyzeVideoAsync(new(
                Guid.NewGuid(),
                "/mnt/media/source.mp4",
                [SegmentStudioAnalysisKind.AiTagging])));

        Assert.Equal(HttpStatusCode.BadGateway, exception.StatusCode);
        Assert.Equal("ai_server_unavailable", exception.Code);
        Assert.True(exception.Retryable);
        Assert.DoesNotContain("/mnt/media/source.mp4", exception.Message);
    }

    [Fact]
    public void Settings_Normalize_AllowsDisabledAndValidatesConfiguredUrl()
    {
        var disabled = SegmentStudioAnalysisSettings.FromValues(null);
        Assert.False(disabled.IsConfigured);
        Assert.False(new SegmentStudioAnalysisSettings { BaseUrl = null! }.Normalize().IsConfigured);

        Assert.Throws<InvalidOperationException>(() =>
            SegmentStudioAnalysisSettings.FromValues("ftp://analysis"));
        Assert.Throws<InvalidOperationException>(() =>
            SegmentStudioAnalysisSettings.FromValues("http://user:password@analysis"));
        Assert.Throws<InvalidOperationException>(() =>
            SegmentStudioAnalysisSettings.FromValues("http://analysis/service"));
        Assert.Throws<InvalidOperationException>(() =>
            SegmentStudioAnalysisSettings.FromValues("http://analysis?target=other"));
        Assert.Throws<InvalidOperationException>(() =>
            SegmentStudioAnalysisSettings.FromValues("http://analysis#fragment"));

        var settings = SegmentStudioAnalysisSettings.FromValues(
            "http://analysis:8766/");

        Assert.Equal("http://analysis:8766", settings.BaseUrl);
        Assert.Equal(new Uri("http://analysis:8766"), settings.BaseUri);
    }

    [Fact]
    public async Task SettingsStore_RoundTripsNormalizedBaseUrl()
    {
        var extensionStore = new MemoryExtensionStore();
        var store = new SegmentStudioAnalysisSettingsStore(() => extensionStore);

        Assert.False((await store.LoadAsync()).IsConfigured);

        var saved = await store.SaveAsync(
            SegmentStudioAnalysisSettings.FromValues("http://analysis:8766/"));

        Assert.Equal("http://analysis:8766", saved.BaseUrl);
        Assert.Equal(saved, await store.LoadAsync());
    }

    [Fact]
    public async Task SettingsStore_FailsClosedForCorruptData()
    {
        var extensionStore = new MemoryExtensionStore();
        await extensionStore.SetAsync("analysis-settings", "{not-json");
        var settings = await new SegmentStudioAnalysisSettingsStore(
            () => extensionStore).LoadAsync();

        Assert.False(settings.IsConfigured);
        Assert.NotNull(settings.ConfigurationError);
    }

    [Fact]
    public async Task Client_LoadsTheLatestSavedUrlForEveryRequest()
    {
        var extensionStore = new MemoryExtensionStore();
        var settings = new SegmentStudioAnalysisSettingsStore(() => extensionStore);
        await settings.SaveAsync(SegmentStudioAnalysisSettings.FromValues("http://first:8766"));
        var hosts = new List<string>();
        var client = new SegmentStudioAnalysisClient(
            new HttpClient(new StubHandler(request =>
            {
                hosts.Add(request.RequestUri!.Host);
                return Json(HttpStatusCode.OK, """
                    { "ok": true, "serviceVersion": "0.1.0", "schemaVersion": "1", "checks": {} }
                    """);
            })),
            settings);

        await client.ReadyAsync();
        await settings.SaveAsync(SegmentStudioAnalysisSettings.FromValues("http://second:8766"));
        await client.ReadyAsync();

        Assert.Equal(["first", "second"], hosts);
    }

    private static SegmentStudioAnalysisClient CreateClient(HttpMessageHandler handler)
        => new(
            new HttpClient(handler),
            new FixedSettingsStore(
                SegmentStudioAnalysisSettings.FromValues("http://analysis:8766")));

    private static HttpResponseMessage Json(HttpStatusCode status, string body)
        => new(status)
        {
            Content = new StringContent(body, Encoding.UTF8, "application/json"),
        };

    private sealed class StubHandler(Func<HttpRequestMessage, HttpResponseMessage> respond)
        : HttpMessageHandler
    {
        protected override Task<HttpResponseMessage> SendAsync(
            HttpRequestMessage request,
            CancellationToken cancellationToken)
            => Task.FromResult(respond(request));
    }

    private sealed class FixedSettingsStore(SegmentStudioAnalysisSettings settings)
        : ISegmentStudioAnalysisSettingsStore
    {
        public Task<SegmentStudioAnalysisSettings> LoadAsync(CancellationToken ct = default)
            => Task.FromResult(settings);

        public Task<SegmentStudioAnalysisSettings> SaveAsync(
            SegmentStudioAnalysisSettings next,
            CancellationToken ct = default) => throw new NotSupportedException();
    }

    private sealed class MemoryExtensionStore : IExtensionStore
    {
        private readonly Dictionary<string, string> _values = [];

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
            => Task.FromResult(new Dictionary<string, string>(_values));
    }
}
