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

namespace ExternalSignIn;

public sealed class ExternalSignInExtension : FullExtensionBase, IMiddlewareExtension
{
    public const string ExtensionId = "com.midnightrider.external-sign-in";
    public const string ApiBase = "/api/plugins/com.midnightrider.external-sign-in";

    private TrustedHeaderAuthenticator? _trustedHeader;
    private IExternalSignInSettingsProvider? _settings;

    public override void ConfigureServices(IServiceCollection services, ExtensionContext context)
    {
        services.AddSingleton<ExternalSignInSettingsStore>(_ => new ExternalSignInSettingsStore(() => Store));
        services.AddSingleton<IExternalSignInSettingsStore>(provider =>
            provider.GetRequiredService<ExternalSignInSettingsStore>());
        services.AddSingleton<IExternalSignInSettingsProvider>(provider =>
            provider.GetRequiredService<ExternalSignInSettingsStore>());
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
        var store = services.GetRequiredService<IExternalSignInSettingsStore>();
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
                "extensions/com.midnightrider.external-sign-in",
                "External sign-in",
                order: 115,
                icon: "shield-check",
                description: "Configure OpenID Connect and trusted reverse-proxy sign-in.",
                searchKeywords: ["OIDC", "SSO", "Authentik", "proxy", "header"])
            .AddSettingsSection(
                "extensions/com.midnightrider.external-sign-in",
                "External sign-in",
                "ExternalSignInSettings",
                "com.midnightrider.external-sign-in:settings",
                100);

        var settings = _settings?.Current;
        if (settings is null)
            return builder.Build();

        var order = 10;
        foreach (var provider in settings.OidcProviders.Where(provider => provider.IsReady(settings)))
        {
            builder.AddLoginMethod(
                $"oidc-{provider.Id}",
                provider.ButtonLabel,
                $"{ApiBase}/oidc/{provider.Id}/start",
                order: order++,
                linkStartUrl: $"{ApiBase}/oidc/{provider.Id}/link/start");
        }

        if (settings.TrustedHeaderReady)
        {
            builder.AddLoginMethod(
                "trusted-header",
                settings.TrustedHeaderLabel,
                $"{ApiBase}/trusted-header/start",
                order: order,
                linkStartUrl: $"{ApiBase}/trusted-header/link/start",
                showOnLoginPage: false);
        }

        return builder.Build();
    }

    public Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var trustedHeader = _trustedHeader;
        return trustedHeader is null
            ? next(context)
            : trustedHeader.InvokeAsync(context, next);
    }

    public override void MapEndpoints(IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet($"{ApiBase}/oidc/{{providerId}}/start", StartOidcAsync)
            .RequireRateLimiting("auth-strict")
            .AllowCoveAnonymous();
        endpoints.MapPost($"{ApiBase}/oidc/{{providerId}}/link/start", StartOidcLinkAsync)
            .RequireRateLimiting("auth-strict")
            .AllowWithoutCovePermission();
        endpoints.MapGet($"{ApiBase}/oidc/callback", CompleteOidcAsync)
            .RequireRateLimiting("auth-strict")
            .AllowCoveAnonymous();
        endpoints.MapGet($"{ApiBase}/trusted-header/start", StartTrustedHeaderAsync)
            .RequireRateLimiting("auth-strict")
            .AllowCoveAnonymous();
        endpoints.MapPost($"{ApiBase}/trusted-header/link/start", StartTrustedHeaderLinkAsync)
            .RequireRateLimiting("auth-strict")
            .AllowWithoutCovePermission();
        endpoints.MapGet($"{ApiBase}/settings", GetSettings)
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPut($"{ApiBase}/settings", PutSettingsAsync)
            .RequireCovePermission(Permissions.ExtensionsConfigure);
        endpoints.MapPost($"{ApiBase}/oidc/{{providerId}}/test", TestOidcAsync)
            .RequireCovePermission(Permissions.ExtensionsConfigure);
    }

    private static async Task<IResult> StartOidcAsync(
        HttpContext context,
        string providerId,
        string? returnUrl,
        IExternalSignInSettingsProvider settingsProvider,
        IOidcProtocolClient protocol,
        OidcFlowStore flows,
        IExtensionLoginSessionService sessions,
        ILogger<ExternalSignInExtension> logger,
        CancellationToken ct)
    {
        SetNoStore(context);
        var settings = settingsProvider.Current;
        var providerSettings = settings.FindOidcProvider(providerId);
        var safeReturnUrl = NormalizeReturnUrl(returnUrl);
        if (providerSettings?.IsReady(settings) != true)
            return Results.Redirect(LoginRedirect("failed", returnUrl: safeReturnUrl));

        try
        {
            var provider = await protocol.DiscoverAsync(settings, providerSettings, ct);
            var browserBinding = sessions.BeginBrowserSession(context);
            var flow = flows.Create(settings, providerSettings, provider, browserBinding, safeReturnUrl);
            var authorizationUri = protocol.BuildAuthorizationUri(
                settings,
                providerSettings,
                provider,
                flow,
                CallbackUri(settings));
            return Results.Redirect(authorizationUri.AbsoluteUri);
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("External Sign-In could not start OIDC provider {ProviderId}", providerId);
            return Results.Redirect(LoginRedirect("failed", returnUrl: safeReturnUrl));
        }
    }

    private static async Task<IResult> StartOidcLinkAsync(
        HttpContext context,
        string providerId,
        IExternalSignInSettingsProvider settingsProvider,
        IOidcProtocolClient protocol,
        OidcFlowStore flows,
        IExtensionIdentityLinkService links,
        ILogger<ExternalSignInExtension> logger,
        CancellationToken ct)
    {
        SetNoStore(context);
        var settings = settingsProvider.Current;
        var providerSettings = settings.FindOidcProvider(providerId);
        if (providerSettings?.IsReady(settings) != true)
            return Results.NotFound(new { message = "The OIDC provider is unavailable." });

        try
        {
            var provider = await protocol.DiscoverAsync(settings, providerSettings, ct);
            var intent = links.BeginLink(context, ExtensionId, providerSettings.Issuer);
            if (intent is null)
                return Results.Unauthorized();
            var flow = flows.Create(
                settings,
                providerSettings,
                provider,
                intent.BrowserBinding,
                returnUrl: null,
                purpose: OidcFlowPurpose.Link,
                linkIntentToken: intent.Token);
            var authorizationUri = protocol.BuildAuthorizationUri(
                settings,
                providerSettings,
                provider,
                flow,
                CallbackUri(settings));
            return Results.Ok(new { redirectUrl = authorizationUri.AbsoluteUri });
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("External Sign-In could not start an OIDC link for provider {ProviderId}", providerId);
            return Results.BadRequest(new { message = "The OIDC provider could not be reached." });
        }
    }

    private static async Task<IResult> CompleteOidcAsync(
        HttpContext context,
        OidcFlowStore flows,
        IOidcProtocolClient protocol,
        IExternalSignInSettingsProvider settingsProvider,
        IExtensionLoginSessionService sessions,
        IExtensionIdentityLinkService links,
        ILogger<ExternalSignInExtension> logger,
        CancellationToken ct)
    {
        SetNoStore(context);
        var state = SingleQueryValue(context, "state", 256);
        var flow = flows.TryGet(state);
        if (flow is null)
            return Results.Redirect(LoginRedirect("failed"));

        var currentSettings = settingsProvider.Current;
        var currentProvider = currentSettings.FindOidcProvider(flow.OidcProvider.Id);
        if (currentProvider?.IsReady(currentSettings) != true
            || !string.Equals(currentProvider.Issuer, flow.OidcProvider.Issuer, StringComparison.Ordinal))
        {
            return Results.Redirect(FlowFailureRedirect(flow));
        }

        if (!sessions.IsBrowserSession(context, flow.BrowserBinding))
            return Results.Redirect(FlowFailureRedirect(flow));
        if (flows.TryTake(state, flow) is null)
            return Results.Redirect(FlowFailureRedirect(flow));
        if (context.Request.Query.ContainsKey("error"))
            return Results.Redirect(FlowFailureRedirect(flow));

        var code = SingleQueryValue(context, "code", 4096);
        if (code is null)
            return Results.Redirect(FlowFailureRedirect(flow));

        try
        {
            var identity = await protocol.ExchangeAndValidateAsync(
                flow.Settings,
                flow.OidcProvider,
                flow.Provider,
                new OidcTokenExchange(
                    code,
                    flow.CodeVerifier,
                    flow.Nonce,
                    CallbackUri(flow.Settings)),
                ct);
            var assertion = new ExtensionIdentityAssertion(
                ExtensionId,
                flow.OidcProvider.Issuer,
                identity.Subject,
                "oidc",
                flow.OidcProvider.ButtonLabel,
                identity.AccountLabel);

            if (flow.Purpose == OidcFlowPurpose.Link)
            {
                var preparation = await links.PrepareLinkAsync(
                    context,
                    flow.LinkIntentToken ?? string.Empty,
                    flow.BrowserBinding,
                    assertion,
                    ct);
                return preparation.Failure == ExtensionIdentityLinkPreparationFailure.None
                       && !string.IsNullOrWhiteSpace(preparation.Code)
                    ? Results.Redirect(ExternalLinkRedirect(preparation.Code))
                    : Results.Redirect(ExternalLinkRedirect(error: "failed"));
            }

            var completion = await sessions.CompleteAsync(
                context,
                flow.BrowserBinding,
                assertion,
                ct);
            if (completion.Failure == ExtensionLoginCompletionFailure.None
                && !string.IsNullOrWhiteSpace(completion.Code))
            {
                return Results.Redirect(LoginRedirect(code: completion.Code, returnUrl: flow.ReturnUrl));
            }
            return Results.Redirect(LoginRedirect(
                completion.Failure == ExtensionLoginCompletionFailure.IdentityUnlinked ? "unlinked" : "failed",
                returnUrl: flow.ReturnUrl));
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("External Sign-In rejected an OIDC callback");
            return Results.Redirect(FlowFailureRedirect(flow));
        }
    }

    private static IResult StartTrustedHeaderAsync(
        HttpContext context,
        TrustedHeaderAuthenticator trustedHeader)
    {
        SetNoStore(context);
        return trustedHeader.TryGetIdentity(context, out _)
            ? Results.Redirect("/")
            : Results.Redirect(LoginRedirect("failed"));
    }

    private static async Task<IResult> StartTrustedHeaderLinkAsync(
        HttpContext context,
        TrustedHeaderAuthenticator trustedHeader,
        IExtensionIdentityLinkService links,
        CancellationToken ct)
    {
        SetNoStore(context);
        if (!trustedHeader.TryGetIdentity(context, out var assertion))
            return Results.BadRequest(new { message = "The trusted proxy did not provide a valid stable identity." });

        var preparation = await links.PrepareDirectLinkAsync(context, assertion, ct);
        return preparation.Failure switch
        {
            ExtensionIdentityLinkPreparationFailure.None when !string.IsNullOrWhiteSpace(preparation.Code) =>
                Results.Ok(new { confirmationCode = preparation.Code }),
            ExtensionIdentityLinkPreparationFailure.IdentityConflict =>
                Results.Conflict(new { message = "This external identity is already linked to another Cove user." }),
            _ => Results.BadRequest(new { message = "The trusted identity could not be prepared for linking." }),
        };
    }

    private static IResult GetSettings(IExternalSignInSettingsProvider settings) =>
        Results.Ok(ExternalSignInSettingsResponse.From(settings.Current));

    private static async Task<IResult> PutSettingsAsync(
        ExternalSignInSettingsUpdate request,
        IExternalSignInSettingsStore settings,
        IExternalIdentityService identities,
        CancellationToken ct)
    {
        var preview = ExternalSignInSettingsValidator.ValidateUpdate(request, settings.Current);
        if (!preview.IsValid)
            return Results.ValidationProblem(preview.Errors);

        var currentTrustedProviderId = settings.Current.TrustedHeaderProviderId;
        if (currentTrustedProviderId.Length > 0
            && !string.Equals(
                currentTrustedProviderId,
                preview.Value!.TrustedHeaderProviderId,
                StringComparison.Ordinal))
        {
            if (settings.Current.TrustedHeaderEnabled)
            {
                return Results.Conflict(new
                {
                    code = "PROVIDER_MUST_BE_DISABLED",
                    message = "Disable trusted-header authentication and save before replacing its authority ID.",
                });
            }
            if (await identities.CountProviderLinksAsync(ExtensionId, currentTrustedProviderId, ct) > 0)
            {
                return Results.Conflict(new
                {
                    code = "PROVIDER_HAS_LINKS",
                    message = "Unlink every Cove account from the trusted-header authority before replacing it.",
                });
            }
        }

        var retainedIds = preview.Value!.OidcProviders
            .Select(provider => provider.Id)
            .ToHashSet(StringComparer.Ordinal);
        foreach (var removed in settings.Current.OidcProviders.Where(provider => !retainedIds.Contains(provider.Id)))
        {
            if (removed.Enabled)
            {
                return Results.Conflict(new
                {
                    code = "PROVIDER_MUST_BE_DISABLED",
                    message = $"Disable {removed.ButtonLabel} and save before deleting it.",
                });
            }
            if (removed.Issuer.Length > 0
                && await identities.CountProviderLinksAsync(ExtensionId, removed.Issuer, ct) > 0)
            {
                return Results.Conflict(new
                {
                    code = "PROVIDER_HAS_LINKS",
                    message = $"Unlink every Cove account from {removed.ButtonLabel} before deleting the provider. You can disable it instead.",
                });
            }
        }

        var result = await settings.UpdateAsync(request, ct);
        return result.IsValid
            ? Results.Ok(ExternalSignInSettingsResponse.From(result.Value!))
            : Results.ValidationProblem(result.Errors);
    }

    private static async Task<IResult> TestOidcAsync(
        string providerId,
        IExternalSignInSettingsProvider settingsProvider,
        IOidcProtocolClient protocol,
        ILogger<ExternalSignInExtension> logger,
        CancellationToken ct)
    {
        var settings = settingsProvider.Current;
        var provider = settings.FindOidcProvider(providerId);
        if (provider?.IsReady(settings) != true)
            return Results.BadRequest(new { message = "Save a complete, enabled OIDC provider first." });

        try
        {
            await protocol.DiscoverAsync(settings, provider, ct);
            return Results.Ok(new { ready = true });
        }
        catch (OidcProtocolException)
        {
            logger.LogWarning("External Sign-In OIDC discovery test failed for provider {ProviderId}", providerId);
            return Results.BadRequest(new { message = "OIDC discovery or signing-key validation failed." });
        }
    }

    private static Uri CallbackUri(ExternalSignInSettings settings) =>
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

    private static string FlowFailureRedirect(OidcLoginFlow flow) =>
        flow.Purpose == OidcFlowPurpose.Link
            ? ExternalLinkRedirect(error: "failed")
            : LoginRedirect("failed", returnUrl: flow.ReturnUrl);

    private static string LoginRedirect(
        string? error = null,
        string? code = null,
        string? returnUrl = null)
    {
        var query = new QueryBuilder();
        if (!string.IsNullOrWhiteSpace(returnUrl))
            query.Add("redirect", returnUrl);
        var fragment = !string.IsNullOrWhiteSpace(code)
            ? $"#external_login_code={Uri.EscapeDataString(code)}"
            : !string.IsNullOrWhiteSpace(error)
                ? $"#external_login_error={Uri.EscapeDataString(error)}"
                : string.Empty;
        return "/login" + query.ToQueryString() + fragment;
    }

    private static string ExternalLinkRedirect(string? code = null, string? error = null)
    {
        var fragment = !string.IsNullOrWhiteSpace(code)
            ? $"#external_link_code={Uri.EscapeDataString(code)}"
            : !string.IsNullOrWhiteSpace(error)
                ? $"#external_link_error={Uri.EscapeDataString(error)}"
                : string.Empty;
        return "/settings/my/account" + fragment;
    }
}
