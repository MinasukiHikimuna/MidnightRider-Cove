using System.Diagnostics;
using System.Text.Json;
using MidnightRider.Cove.ApiFaultSimulator;
using Cove.Plugins;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;

namespace ApiFaultSimulator.Tests;

public sealed class ApiFaultSimulatorExtensionTests
{
    [Theory]
    [InlineData("/api/auth/refresh")]
    [InlineData("/api/extensions/manifest")]
    [InlineData("/api/extensions/assets/com.midnightrider.api-fault-simulator/assets/ui.mjs")]
    public async Task InvokeAsync_PassesRecoveryEndpointsEvenWhenTheFilterMatches(string path)
    {
        var nextCalled = false;
        var extension = new ApiFaultSimulatorExtension();
        var (context, _) = CreateContext(path, new { apiFaultMode = "gateway", apiRequestFilter = "/api/*", latencyMs = 2_000 });

        await extension.InvokeAsync(context, _ => { nextCalled = true; return Task.CompletedTask; });

        Assert.True(nextCalled);
        Assert.Equal(StatusCodes.Status200OK, context.Response.StatusCode);
    }

    [Fact]
    public async Task InvokeAsync_PassesSystemHealthUnlessItIsTemporarilyIncluded()
    {
        var calls = 0;
        var extension = new ApiFaultSimulatorExtension();
        var (excluded, _) = CreateContext(
            "/api/system/status",
            new { apiFaultMode = "gateway", apiRequestFilter = "/api/*", includeSystemHealth = false });
        var (expired, _) = CreateContext(
            "/api/system/status",
            new
            {
                apiFaultMode = "gateway",
                apiRequestFilter = "/api/*",
                includeSystemHealth = true,
                healthFaultExpiresAt = DateTimeOffset.UtcNow.AddSeconds(-1).ToUnixTimeMilliseconds(),
            });
        var (tooLong, _) = CreateContext(
            "/api/system/status",
            new
            {
                apiFaultMode = "gateway",
                apiRequestFilter = "/api/*",
                includeSystemHealth = true,
                healthFaultExpiresAt = DateTimeOffset.UtcNow.AddMinutes(2).ToUnixTimeMilliseconds(),
            });

        await extension.InvokeAsync(excluded, _ => { calls++; return Task.CompletedTask; });
        await extension.InvokeAsync(expired, _ => { calls++; return Task.CompletedTask; });
        await extension.InvokeAsync(tooLong, _ => { calls++; return Task.CompletedTask; });

        Assert.Equal(3, calls);
    }

    [Fact]
    public async Task InvokeAsync_FaultsSystemHealthDuringTheTemporaryWindow()
    {
        var nextCalled = false;
        var extension = new ApiFaultSimulatorExtension();
        var (context, _) = CreateContext(
            "/api/system/status",
            new
            {
                apiFaultMode = "gateway",
                apiRequestFilter = "/api/*",
                includeSystemHealth = true,
                healthFaultExpiresAt = DateTimeOffset.UtcNow.AddMinutes(1).ToUnixTimeMilliseconds(),
            });
        context.Response.Body = new MemoryStream();

        await extension.InvokeAsync(context, _ => { nextCalled = true; return Task.CompletedTask; });

        Assert.False(nextCalled);
        Assert.Equal(StatusCodes.Status502BadGateway, context.Response.StatusCode);
    }

    [Fact]
    public void GetUIManifest_ContributesTheFloatingHtmlElement()
    {
        var extension = new ApiFaultSimulatorExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile { Id = "com.midnightrider.api-fault-simulator", Name = "API Fault Simulator", Version = "1.0.0" });

        var slot = Assert.Single(extension.GetUIManifest().Slots);

        Assert.Equal("app-floating-ui", slot.Slot);
        Assert.Equal("html", slot.ContentType);
        Assert.Equal("<cove-api-fault-tools></cove-api-fault-tools>", slot.Html);
    }

    [Fact]
    public async Task InvokeAsync_AbortsMatchingRequestWithoutCallingNext()
    {
        var nextCalled = false;
        var extension = new ApiFaultSimulatorExtension();
        var (context, lifetime) = CreateContext("/api/stream/video/42", new { apiFaultMode = "offline", apiRequestFilter = "/api/*", latencyMs = 2_000 });

        await extension.InvokeAsync(context, _ => { nextCalled = true; return Task.CompletedTask; });

        Assert.True(lifetime.Aborted);
        Assert.False(nextCalled);
    }

    [Fact]
    public async Task InvokeAsync_ReturnsGatewayFailureForMatchingPathAndQuery()
    {
        var nextCalled = false;
        var extension = new ApiFaultSimulatorExtension();
        var (context, _) = CreateContext("/api/videos?q=search", new { apiFaultMode = "gateway", apiRequestFilter = "/api/videos?q=*", latencyMs = 2_000 });
        context.Response.Body = new MemoryStream();

        await extension.InvokeAsync(context, _ => { nextCalled = true; return Task.CompletedTask; });

        Assert.False(nextCalled);
        Assert.Equal(StatusCodes.Status502BadGateway, context.Response.StatusCode);
        context.Response.Body.Position = 0;
        Assert.Equal("Simulated gateway failure", await new StreamReader(context.Response.Body).ReadToEndAsync());
    }

    [Fact]
    public async Task InvokeAsync_PassesUnmatchedAndNonApiRequests()
    {
        var calls = 0;
        var extension = new ApiFaultSimulatorExtension();
        var (unmatched, _) = CreateContext(
            "/api/stream/video/42",
            new { apiFaultMode = "offline", apiRequestFilter = "/api/videos?q=*", latencyMs = 2_000 });
        var (frontend, _) = CreateContext(
            "/videos",
            new { apiFaultMode = "offline", apiRequestFilter = "*", latencyMs = 2_000 });

        await extension.InvokeAsync(unmatched, _ =>
        {
            calls++;
            return Task.CompletedTask;
        });
        await extension.InvokeAsync(frontend, _ =>
        {
            calls++;
            return Task.CompletedTask;
        });

        Assert.Equal(2, calls);
    }

    [Fact]
    public async Task InvokeAsync_IgnoresMalformedRuleCookie()
    {
        var nextCalled = false;
        var extension = new ApiFaultSimulatorExtension();
        var context = new DefaultHttpContext();
        context.Request.Path = "/api/videos";
        context.Request.Headers.Cookie = $"{ApiFaultSimulatorExtension.CookieName}=not-json";

        await extension.InvokeAsync(context, _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        Assert.True(nextCalled);
    }

    [Fact]
    public async Task InvokeAsync_DelaysMatchingRequestBeforeCallingNext()
    {
        var extension = new ApiFaultSimulatorExtension();
        var (context, _) = CreateContext("/api/videos", new { apiFaultMode = "latency", apiRequestFilter = "/api/*", latencyMs = 40 });
        var stopwatch = Stopwatch.StartNew();

        await extension.InvokeAsync(context, _ => Task.CompletedTask);

        Assert.True(stopwatch.ElapsedMilliseconds >= 25, $"Expected injected latency, observed {stopwatch.ElapsedMilliseconds} ms.");
    }

    [Fact]
    public async Task InvokeAsync_HoldsTimeoutRequestUntilCallerCancels()
    {
        var nextCalled = false;
        var extension = new ApiFaultSimulatorExtension();
        var (context, lifetime) = CreateContext(
            "/api/videos",
            new { apiFaultMode = "timeout", apiRequestFilter = "/api/*", latencyMs = 2_000 });

        var request = extension.InvokeAsync(context, _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });
        await Task.Delay(20);
        Assert.False(request.IsCompleted);

        lifetime.Abort();
        await request;

        Assert.False(nextCalled);
    }

    private static (DefaultHttpContext Context, RecordingLifetimeFeature Lifetime) CreateContext(string pathAndQuery, object rule)
    {
        var target = new Uri($"http://cove.local{pathAndQuery}");
        var lifetime = new RecordingLifetimeFeature();
        var context = new DefaultHttpContext();
        context.Features.Set<IHttpRequestLifetimeFeature>(lifetime);
        context.Request.Path = target.AbsolutePath;
        context.Request.QueryString = new QueryString(target.Query);
        context.Request.Headers.Cookie = $"{ApiFaultSimulatorExtension.CookieName}={Uri.EscapeDataString(JsonSerializer.Serialize(rule))}";
        return (context, lifetime);
    }

    private sealed class RecordingLifetimeFeature : IHttpRequestLifetimeFeature
    {
        private readonly CancellationTokenSource _cancellation = new();
        public bool Aborted { get; private set; }
        public CancellationToken RequestAborted { get => _cancellation.Token; set { } }
        public void Abort() { Aborted = true; _cancellation.Cancel(); }
    }
}
