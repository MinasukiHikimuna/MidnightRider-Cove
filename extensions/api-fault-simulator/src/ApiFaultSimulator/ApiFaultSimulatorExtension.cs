using System.Text.Json;
using System.Text.RegularExpressions;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Http;

namespace MidnightRider.Cove.ApiFaultSimulator;

public sealed class ApiFaultSimulatorExtension : CoveExtensionBase, IMiddlewareExtension
{
    public const string CookieName = "cove-dev-api-fault";
    public const string FloatingUiSlot = "app-floating-ui";
    private const double DefaultLatencyMs = 2_000;
    private const double MaxLatencyMs = 60_000;
    private const long MaxHealthFaultDurationMs = 60_000;
    private static readonly TimeSpan TimeoutDuration = TimeSpan.FromSeconds(30);

    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private static readonly HashSet<string> FaultModes = new(StringComparer.Ordinal)
    {
        "normal",
        "offline",
        "timeout",
        "gateway",
        "latency",
    };

    public override UIManifest GetUIManifest() => new()
    {
        Slots =
        [
            new UISlotContribution(
                "api-fault-simulator",
                FloatingUiSlot,
                Id,
                "html",
                Html: "<cove-api-fault-tools></cove-api-fault-tools>",
                Order: 100),
        ],
    };

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        if (!context.Request.Path.StartsWithSegments("/api") || IsAlwaysRecoveryEndpoint(context.Request.Path))
        {
            await next(context);
            return;
        }

        var rule = ReadRule(context);
        if (IsSystemHealthEndpoint(context.Request.Path) && !ShouldFaultSystemHealth(rule))
        {
            await next(context);
            return;
        }

        if (rule is null
            || rule.ApiFaultMode == "normal"
            || !MatchesFilter(
                $"{context.Request.Path}{context.Request.QueryString}",
                rule.ApiRequestFilter))
        {
            await next(context);
            return;
        }

        switch (rule.ApiFaultMode)
        {
            case "offline":
                context.Abort();
                return;
            case "timeout":
                if (await DelayAsync(TimeoutDuration.TotalMilliseconds, context.RequestAborted))
                {
                    context.Response.StatusCode = StatusCodes.Status504GatewayTimeout;
                    context.Response.ContentType = "text/plain; charset=utf-8";
                    context.Response.Headers.CacheControl = "no-store";
                    await context.Response.WriteAsync("Simulated API timeout", context.RequestAborted);
                }
                return;
            case "gateway":
                context.Response.StatusCode = StatusCodes.Status502BadGateway;
                context.Response.ContentType = "text/plain; charset=utf-8";
                context.Response.Headers.CacheControl = "no-store";
                await context.Response.WriteAsync("Simulated gateway failure", context.RequestAborted);
                return;
            case "latency":
                if (await DelayAsync(rule.LatencyMs, context.RequestAborted))
                    await next(context);
                return;
            default:
                await next(context);
                return;
        }
    }

    private static bool IsAlwaysRecoveryEndpoint(PathString path) =>
        path.StartsWithSegments("/api/auth") ||
        path.StartsWithSegments("/api/extensions");

    private static bool IsSystemHealthEndpoint(PathString path) =>
        path.StartsWithSegments("/api/system/status");

    private static bool ShouldFaultSystemHealth(ApiFaultRule? rule)
    {
        var now = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();
        return rule is { IncludeSystemHealth: true }
            && rule.HealthFaultExpiresAt > now
            && rule.HealthFaultExpiresAt <= now + MaxHealthFaultDurationMs;
    }

    private static ApiFaultRule? ReadRule(HttpContext context)
    {
        if (!context.Request.Cookies.TryGetValue(CookieName, out var encodedRule)
            || string.IsNullOrWhiteSpace(encodedRule))
        {
            return null;
        }

        try
        {
            var rule = JsonSerializer.Deserialize<ApiFaultRule>(
                Uri.UnescapeDataString(encodedRule),
                JsonOptions);
            if (rule is null || !FaultModes.Contains(rule.ApiFaultMode))
                return null;
            if (!double.IsFinite(rule.LatencyMs) || rule.LatencyMs < 0)
                rule.LatencyMs = DefaultLatencyMs;
            rule.LatencyMs = Math.Min(rule.LatencyMs, MaxLatencyMs);
            if (string.IsNullOrWhiteSpace(rule.ApiRequestFilter))
                rule.ApiRequestFilter = "/api/*";
            return rule;
        }
        catch (JsonException)
        {
            return null;
        }
        catch (UriFormatException)
        {
            return null;
        }
    }

    private static bool MatchesFilter(string pathAndQuery, string filter)
    {
        var pattern = filter.Trim();
        if (pattern.Length == 0)
            return true;

        var expression = $"\\A{Regex.Escape(pattern).Replace("\\*", ".*", StringComparison.Ordinal)}\\z";
        try
        {
            return Regex.IsMatch(
                pathAndQuery,
                expression,
                RegexOptions.CultureInvariant,
                TimeSpan.FromMilliseconds(50));
        }
        catch (RegexMatchTimeoutException)
        {
            return false;
        }
    }

    private static async Task<bool> DelayAsync(double milliseconds, CancellationToken cancellationToken)
    {
        var boundedMilliseconds = Math.Min(milliseconds, int.MaxValue - 1d);
        try
        {
            await Task.Delay(TimeSpan.FromMilliseconds(boundedMilliseconds), cancellationToken);
            return true;
        }
        catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
        {
            return false;
        }
    }

    private sealed class ApiFaultRule
    {
        public string ApiFaultMode { get; set; } = "normal";
        public string ApiRequestFilter { get; set; } = "/api/*";
        public double LatencyMs { get; set; } = DefaultLatencyMs;
        public bool IncludeSystemHealth { get; set; }
        public long HealthFaultExpiresAt { get; set; }
    }
}
