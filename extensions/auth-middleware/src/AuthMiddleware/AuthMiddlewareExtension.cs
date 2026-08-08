using System.Net;
using Cove.Core.Auth;
using Cove.Plugins;
using Cove.Sdk;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace AuthMiddleware;

public sealed class AuthMiddlewareExtension : FullExtensionBase, IMiddlewareExtension
{
    public const string ExtensionId = "com.midnightrider.auth-middleware";
    public const string ApiBase = "/api/plugins/com.midnightrider.auth-middleware";

    private TrustedHeaderAuthenticator? _trustedHeader;
    private IAuthMiddlewareSettingsProvider? _settings;

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context)
    {
        services.AddSingleton<AuthMiddlewareSettingsStore>(_ => new AuthMiddlewareSettingsStore(() => Store));
        services.AddSingleton<IAuthMiddlewareSettingsStore>(provider =>
            provider.GetRequiredService<AuthMiddlewareSettingsStore>());
        services.AddSingleton<IAuthMiddlewareSettingsProvider>(provider =>
            provider.GetRequiredService<AuthMiddlewareSettingsStore>());
        services.AddSingleton<TrustedHeaderAuthenticator>();
        services.AddSingleton(provider => new OidcFlowStore(
            provider.GetService<TimeProvider>() ?? TimeProvider.System));
        services.AddSingleton<IOidcProtocolClient>(_ =>
        {
            var handler = new SocketsHttpHandler
            {
                AllowAutoRedirect = false,
                AutomaticDecompression = DecompressionMethods.GZip
                    | DecompressionMethods.Deflate
                    | DecompressionMethods.Brotli,
                ConnectTimeout = TimeSpan.FromSeconds(5),
                PooledConnectionLifetime = TimeSpan.FromMinutes(5),
                UseCookies = false,
            };
            return new OidcProtocolClient(new HttpClient(handler)
            {
                Timeout = Timeout.InfiniteTimeSpan,
            });
        });
    }

    public override async Task InitializeAsync(IServiceProvider services, CancellationToken ct = default)
    {
        var store = services.GetRequiredService<IAuthMiddlewareSettingsStore>();
        await store.LoadAsync(ct);
        _settings = store;
        _trustedHeader = services.GetRequiredService<TrustedHeaderAuthenticator>();
    }

    public override Task ShutdownAsync(CancellationToken ct = default)
    {
        _trustedHeader = null;
        _settings = null;
        return Task.CompletedTask;
    }

    public override UIManifest GetUIManifest()
    {
        var builder = ManifestBuilder()
            .AddSettingsTab(
                "extensions/com.midnightrider.auth-middleware",
                "External authentication",
                order: 115,
                icon: "shield-check",
                description: "Configure OpenID Connect and trusted reverse-proxy authentication.",
                searchKeywords: ["OIDC", "SSO", "Authentik", "proxy", "header"])
            .AddSettingsSection(
                "extensions/com.midnightrider.auth-middleware",
                "Authentication middleware",
                "AuthMiddlewareSettings",
                "com.midnightrider.auth-middleware:settings",
                100);

        var settings = _settings?.Current;
        if (settings?.OidcReady == true)
        {
            builder.AddLoginMethod(
                "oidc",
                settings.OidcButtonLabel,
                $"{ApiBase}/oidc/start",
                order: 10);
        }

        return builder.Build();
    }

    public Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        // Capture once so a concurrent runtime unload cannot null the field between the check and
        // invocation. An in-flight request may finish with the already-created singleton; new
        // requests fail closed through the host chain after shutdown removes the extension.
        var trustedHeader = _trustedHeader;
        return trustedHeader is null
            ? next(context)
            : trustedHeader.InvokeAsync(context, next);
    }

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet($"{ApiBase}/oidc/start", StartOidcAsync)
            .RequireRateLimiting("auth-strict")
            .AllowCoveAnonymous();
        endpoints.MapGet($"{ApiBase}/oidc/callback", CompleteOidcAsync)
            .RequireRateLimiting("auth-strict")
            .AllowCoveAnonymous();
        endpoints.MapGet($"{ApiBase}/settings", GetSettings)
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPut($"{ApiBase}/settings", PutSettingsAsync)
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost($"{ApiBase}/oidc/test", TestOidcAsync)
            .RequireCovePermission(Permissions.ExtensionsConfigure);
    }

    private static async Task<IResult> StartOidcAsync(
        HttpContext context,
        string? returnUrl,
        IAuthMiddlewareSettingsProvider settingsProvider,
        IOidcProtocolClient protocol,
        OidcFlowStore flows,
        IExtensionLoginSessionService sessions,
        ILogger<AuthMiddlewareExtension> logger,
        CancellationToken ct)
    {
        SetNoStore(context);
        var settings = settingsProvider.Current;
        var safeReturnUrl = NormalizeReturnUrl(returnUrl);
        if (!settings.OidcReady)
            return Results.Redirect(LoginRedirect(error: true, returnUrl: safeReturnUrl));

        try
        {
            var provider = await protocol.DiscoverAsync(settings, ct);
            var browserBinding = sessions.BeginBrowserSession(context);
            var flow = flows.Create(settings, provider, browserBinding, safeReturnUrl);
            var authorizationUri = protocol.BuildAuthorizationUri(
                settings,
                provider,
                flow,
                CallbackUri(settings));
            return Results.Redirect(authorizationUri.AbsoluteUri);
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("The authentication extension could not start the configured OIDC flow");
            return Results.Redirect(LoginRedirect(error: true, returnUrl: safeReturnUrl));
        }
    }

    private static async Task<IResult> CompleteOidcAsync(
        HttpContext context,
        OidcFlowStore flows,
        IOidcProtocolClient protocol,
        IExtensionLoginSessionService sessions,
        ILogger<AuthMiddlewareExtension> logger,
        CancellationToken ct)
    {
        SetNoStore(context);
        var state = SingleQueryValue(context, "state", 256);
        var flow = flows.TryGet(state);
        if (flow is null)
            return Results.Redirect(LoginRedirect(error: true, returnUrl: null));

        // Browser binding is checked before the authorization code is exchanged or the flow is
        // consumed. A callback copied to another browser cannot create or burn the original login.
        if (!sessions.IsBrowserSession(context, flow.BrowserBinding))
            return Results.Redirect(LoginRedirect(error: true, returnUrl: null));

        if (flows.TryTake(state, flow) is null)
            return Results.Redirect(LoginRedirect(error: true, returnUrl: flow.ReturnUrl));

        if (context.Request.Query.ContainsKey("error"))
            return Results.Redirect(LoginRedirect(error: true, returnUrl: flow.ReturnUrl));

        var code = SingleQueryValue(context, "code", 4096);
        if (code is null)
            return Results.Redirect(LoginRedirect(error: true, returnUrl: flow.ReturnUrl));

        try
        {
            var identity = await protocol.ExchangeAndValidateAsync(
                flow.Settings,
                flow.Provider,
                new OidcTokenExchange(
                    code,
                    flow.CodeVerifier,
                    flow.Nonce,
                    CallbackUri(flow.Settings)),
                ct);
            var completion = await sessions.CompleteAsync(
                context,
                flow.BrowserBinding,
                ExtensionId,
                identity.Username,
                ct);
            return completion.Failure == ExtensionLoginCompletionFailure.None
                   && !string.IsNullOrWhiteSpace(completion.Code)
                ? Results.Redirect(LoginRedirect(code: completion.Code, returnUrl: flow.ReturnUrl))
                : Results.Redirect(LoginRedirect(error: true, returnUrl: flow.ReturnUrl));
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("The authentication extension rejected an OIDC callback");
            return Results.Redirect(LoginRedirect(error: true, returnUrl: flow.ReturnUrl));
        }
    }

    private static IResult GetSettings(IAuthMiddlewareSettingsProvider settings) =>
        Results.Ok(AuthMiddlewareSettingsResponse.From(settings.Current));

    private static async Task<IResult> PutSettingsAsync(
        AuthMiddlewareSettingsUpdate request,
        IAuthMiddlewareSettingsStore settings,
        CancellationToken ct)
    {
        var result = await settings.UpdateAsync(request, ct);
        return result.IsValid
            ? Results.Ok(AuthMiddlewareSettingsResponse.From(result.Value!))
            : Results.ValidationProblem(result.Errors);
    }

    private static async Task<IResult> TestOidcAsync(
        IAuthMiddlewareSettingsProvider settingsProvider,
        IOidcProtocolClient protocol,
        ILogger<AuthMiddlewareExtension> logger,
        CancellationToken ct)
    {
        var settings = settingsProvider.Current;
        if (!settings.OidcReady)
            return Results.BadRequest(new { message = "Save a complete OIDC configuration first." });

        try
        {
            await protocol.DiscoverAsync(settings, ct);
            return Results.Ok(new { ready = true });
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("The authentication extension OIDC discovery test failed");
            return Results.BadRequest(new { message = "OIDC discovery or signing-key validation failed." });
        }
    }

    private static Uri CallbackUri(AuthMiddlewareSettings settings) =>
        new($"{settings.CovePublicUrl}{ApiBase}/oidc/callback", UriKind.Absolute);

    private static string? NormalizeReturnUrl(string? value)
    {
        if (string.IsNullOrWhiteSpace(value)
            || value.Length > 2048
            || !value.StartsWith("/", StringComparison.Ordinal)
            || value.StartsWith("//", StringComparison.Ordinal)
            || value.Contains('\\')
            || value.Any(char.IsControl)
            || !Uri.TryCreate(value, UriKind.Relative, out _))
        {
            return null;
        }

        var resolved = new Uri(new Uri("https://cove.invalid"), value);
        return resolved.AbsolutePath == "/login" ? null : value;
    }

    private static string? SingleQueryValue(HttpContext context, string name, int maximumLength)
    {
        if (!context.Request.Query.TryGetValue(name, out var values) || values.Count != 1)
            return null;
        var value = values[0];
        return !string.IsNullOrWhiteSpace(value)
               && value.Length <= maximumLength
               && !value.Any(char.IsControl)
            ? value
            : null;
    }

    private static void SetNoStore(HttpContext context)
    {
        context.Response.Headers.CacheControl = "no-store";
        context.Response.Headers.Pragma = "no-cache";
    }

    private static string LoginRedirect(
        string? code = null,
        bool error = false,
        string? returnUrl = null)
    {
        var query = new QueryBuilder();
        if (!string.IsNullOrWhiteSpace(returnUrl))
            query.Add("redirect", returnUrl);
        var fragment = !string.IsNullOrWhiteSpace(code)
            ? $"#external_login_code={Uri.EscapeDataString(code)}"
            : error
                ? "#external_login_error=failed"
                : string.Empty;
        return "/login" + query.ToQueryString() + fragment;
    }
}
