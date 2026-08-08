using System.Net;
using System.Net.Http.Json;
using Cove.Core.Auth;
using Cove.Plugins;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace AuthMiddleware.Tests;

public sealed class AuthMiddlewareExtensionTests
{
    [Fact]
    public async Task Manifest_advertises_login_only_after_complete_oidc_settings_are_saved()
    {
        var extension = Extension();
        var memory = new MemoryExtensionStore();
        ((IStatefulExtension)extension).SetStore(memory);
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton(TimeProvider.System);
        extension.ConfigureServices(services, null!);
        await using var provider = services.BuildServiceProvider();
        await extension.InitializeAsync(provider);

        Assert.Empty(extension.GetUIManifest().LoginMethods);
        Assert.Contains(extension.GetUIManifest().SettingsPanels,
            panel => panel.ComponentName == "AuthMiddlewareSettings");

        var update = await provider.GetRequiredService<IAuthMiddlewareSettingsStore>()
            .UpdateAsync(ValidSettingsUpdate());
        var method = Assert.Single(extension.GetUIManifest().LoginMethods);

        Assert.True(update.IsValid);
        Assert.Equal("oidc", method.Id);
        Assert.Equal("Sign in with Authentik", method.Label);
        Assert.Equal($"{AuthMiddlewareExtension.ApiBase}/oidc/start", method.StartUrl);
        var values = await memory.GetAllAsync();
        Assert.Equal("client-secret", values["oidc-client-secret"]);
        Assert.DoesNotContain("client-secret", values["settings"], StringComparison.Ordinal);
    }

    [Fact]
    public async Task Shutdown_makes_trusted_header_middleware_fail_closed_for_new_requests()
    {
        var extension = Extension();
        ((IStatefulExtension)extension).SetStore(new MemoryExtensionStore());
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddSingleton(TimeProvider.System);
        extension.ConfigureServices(services, null!);
        await using var provider = services.BuildServiceProvider();
        await extension.InitializeAsync(provider);
        var update = ValidSettingsUpdate() with
        {
            TrustedHeaderEnabled = true,
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        Assert.True((await provider.GetRequiredService<IAuthMiddlewareSettingsStore>()
            .UpdateAsync(update)).IsValid);

        var beforeShutdown = new DefaultHttpContext();
        beforeShutdown.Connection.RemoteIpAddress = IPAddress.Parse("192.0.2.14");
        beforeShutdown.Request.Headers["X-Authentik-Username"] = "existing-user";
        await extension.InvokeAsync(beforeShutdown, _ => Task.CompletedTask);
        Assert.True(beforeShutdown.TryGetExtensionUserAssertion(out _));

        await extension.ShutdownAsync();
        var afterShutdown = new DefaultHttpContext();
        afterShutdown.Connection.RemoteIpAddress = IPAddress.Parse("192.0.2.14");
        afterShutdown.Request.Headers["X-Authentik-Username"] = "existing-user";
        var nextCalled = false;
        await extension.InvokeAsync(afterShutdown, _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        Assert.True(nextCalled);
        Assert.False(afterShutdown.TryGetExtensionUserAssertion(out _));
    }

    [Fact]
    public async Task Start_and_callback_complete_a_browser_bound_flow_and_preserve_return_url()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        await using var app = await StartAppAsync(protocol, sessions);
        var client = app.GetTestClient();

        var start = await client.GetAsync($"{AuthMiddlewareExtension.ApiBase}/oidc/start?returnUrl=%2Fsettings%3Ftab%3Dsecurity");
        var callback = await client.GetAsync(
            $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&code=provider-code");

        Assert.Equal(HttpStatusCode.Redirect, start.StatusCode);
        Assert.True(start.Headers.CacheControl?.NoStore);
        Assert.Equal("https://idp.example.invalid/authorize", start.Headers.Location!.GetLeftPart(UriPartial.Path));
        Assert.Equal(HttpStatusCode.Redirect, callback.StatusCode);
        Assert.True(callback.Headers.CacheControl?.NoStore);
        Assert.Equal(
            "/login?redirect=%2Fsettings%3Ftab%3Dsecurity#external_login_code=cove-ticket",
            callback.Headers.Location!.OriginalString);
        Assert.Equal(1, protocol.ExchangeCount);
        Assert.Equal("provider-code", protocol.Exchange!.Code);
        Assert.Equal(protocol.Flow.CodeVerifier, protocol.Exchange.CodeVerifier);
        Assert.Equal(protocol.Flow.Nonce, protocol.Exchange.ExpectedNonce);
        Assert.Equal("existing-user", sessions.CompletedUsername);
        Assert.Equal(AuthMiddlewareExtension.ExtensionId, sessions.CompletedExtensionId);
    }

    [Fact]
    public async Task Wrong_browser_is_rejected_before_exchange_without_consuming_the_flow()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        await using var app = await StartAppAsync(protocol, sessions);
        var client = app.GetTestClient();
        await client.GetAsync($"{AuthMiddlewareExtension.ApiBase}/oidc/start?returnUrl=%2Fsettings");
        var callback = $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&code=provider-code";
        sessions.BrowserMatches = false;

        var wrongBrowser = await client.GetAsync(callback);
        sessions.BrowserMatches = true;
        var originalBrowser = await client.GetAsync(callback);

        Assert.Equal("/login#external_login_error=failed", wrongBrowser.Headers.Location!.OriginalString);
        Assert.Equal(1, protocol.ExchangeCount);
        Assert.Equal(
            "/login?redirect=%2Fsettings#external_login_code=cove-ticket",
            originalBrowser.Headers.Location!.OriginalString);
    }

    [Fact]
    public async Task Provider_error_consumes_state_without_exchanging_a_code()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        await using var app = await StartAppAsync(protocol, sessions);
        var client = app.GetTestClient();
        await client.GetAsync($"{AuthMiddlewareExtension.ApiBase}/oidc/start");
        var callback = $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&error=access_denied";

        var first = await client.GetAsync(callback);
        var replay = await client.GetAsync(callback);

        Assert.Equal("/login#external_login_error=failed", first.Headers.Location!.OriginalString);
        Assert.Equal("/login#external_login_error=failed", replay.Headers.Location!.OriginalString);
        Assert.Equal(0, protocol.ExchangeCount);
    }

    [Fact]
    public async Task Settings_response_exposes_only_secret_presence()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        await using var app = await StartAppAsync(protocol, sessions);

        var response = await app.GetTestClient()
            .GetFromJsonAsync<AuthMiddlewareSettingsResponse>($"{AuthMiddlewareExtension.ApiBase}/settings");

        Assert.NotNull(response);
        Assert.True(response.OidcClientSecretConfigured);
        Assert.DoesNotContain(
            response.GetType().GetProperties(),
            property => property.Name.Equals("OidcClientSecret", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public void Routes_explicitly_declare_anonymous_and_admin_only_access()
    {
        var builder = WebApplication.CreateBuilder();
        builder.Services.AddSingleton<IAuthMiddlewareSettingsProvider>(new FixedSettings(ValidSettings()));
        builder.Services.AddSingleton<IAuthMiddlewareSettingsStore>(new FixedSettingsStore(ValidSettings()));
        builder.Services.AddSingleton<IOidcProtocolClient>(new FakeProtocol());
        builder.Services.AddSingleton(new OidcFlowStore(TimeProvider.System));
        builder.Services.AddSingleton<IExtensionLoginSessionService>(new FakeSessions());
        var app = builder.Build();
        Extension().MapEndpoints(app);
        var routes = ((IEndpointRouteBuilder)app).DataSources.SelectMany(source => source.Endpoints).ToArray();

        var start = routes.Single(endpoint => endpoint.DisplayName?.Contains("/oidc/start", StringComparison.Ordinal) == true);
        var callback = routes.Single(endpoint => endpoint.DisplayName?.Contains("/oidc/callback", StringComparison.Ordinal) == true);
        var settings = routes.Single(endpoint => endpoint.DisplayName?.StartsWith($"HTTP: GET {AuthMiddlewareExtension.ApiBase}/settings", StringComparison.Ordinal) == true);

        Assert.NotNull(start.Metadata.GetMetadata<CoveAllowAnonymousMetadata>());
        Assert.NotNull(callback.Metadata.GetMetadata<CoveAllowAnonymousMetadata>());
        Assert.Equal("auth-strict", start.Metadata.GetMetadata<EnableRateLimitingAttribute>()?.PolicyName);
        Assert.Equal("auth-strict", callback.Metadata.GetMetadata<EnableRateLimitingAttribute>()?.PolicyName);
        Assert.Equal(
            [Permissions.ExtensionsConfigure],
            settings.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
    }

    private static async Task<WebApplication> StartAppAsync(
        FakeProtocol protocol,
        FakeSessions sessions)
    {
        var settings = ValidSettings();
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton<IAuthMiddlewareSettingsProvider>(new FixedSettings(settings));
        builder.Services.AddSingleton<IAuthMiddlewareSettingsStore>(new FixedSettingsStore(settings));
        builder.Services.AddSingleton<IOidcProtocolClient>(protocol);
        builder.Services.AddSingleton(new OidcFlowStore(TimeProvider.System));
        builder.Services.AddSingleton<IExtensionLoginSessionService>(sessions);
        var app = builder.Build();
        Extension().MapEndpoints(app);
        await app.StartAsync();
        return app;
    }

    private static AuthMiddlewareExtension Extension()
    {
        var extension = new AuthMiddlewareExtension();
        ((IManifestAware)extension).ApplyManifest(new ExtensionManifestFile
        {
            Id = AuthMiddlewareExtension.ExtensionId,
            Name = "Authentication Middleware",
            Version = "0.1.0",
        });
        return extension;
    }

    private static AuthMiddlewareSettings ValidSettings() => AuthMiddlewareSettings.Default with
    {
        OidcEnabled = true,
        OidcButtonLabel = "Sign in with Authentik",
        OidcIssuer = "https://idp.example.invalid/application/o/cove/",
        OidcClientId = "cove-client",
        OidcClientSecret = "client-secret",
        CovePublicUrl = "https://cove.example.invalid",
        Scopes = ["openid", "profile", "email"],
    };

    private static AuthMiddlewareSettingsUpdate ValidSettingsUpdate() => new()
    {
        OidcEnabled = true,
        OidcButtonLabel = "Sign in with Authentik",
        OidcIssuer = "https://idp.example.invalid/application/o/cove/",
        OidcClientId = "cove-client",
        OidcClientSecret = "client-secret",
        CovePublicUrl = "https://cove.example.invalid",
        UsernameClaim = "preferred_username",
        Scopes = ["openid", "profile", "email"],
        TrustedHeaderName = "X-Authentik-Username",
    };

    private sealed class FixedSettings(AuthMiddlewareSettings settings) : IAuthMiddlewareSettingsProvider
    {
        public AuthMiddlewareSettings Current => settings;
    }

    private sealed class FixedSettingsStore(AuthMiddlewareSettings settings) : IAuthMiddlewareSettingsStore
    {
        public AuthMiddlewareSettings Current { get; private set; } = settings;
        public Task LoadAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task<AuthMiddlewareSettingsValidation> UpdateAsync(AuthMiddlewareSettingsUpdate request, CancellationToken ct = default)
        {
            var result = AuthMiddlewareSettingsValidator.ValidateUpdate(request, Current);
            if (result.IsValid) Current = result.Value!;
            return Task.FromResult(result);
        }
    }

    private sealed class FakeProtocol : IOidcProtocolClient
    {
        public OidcLoginFlow? Flow { get; private set; }
        public OidcTokenExchange? Exchange { get; private set; }
        public int ExchangeCount { get; private set; }

        public Task<OidcProviderConfiguration> DiscoverAsync(AuthMiddlewareSettings settings, CancellationToken ct) =>
            Task.FromResult(new OidcProviderConfiguration(
                settings.OidcIssuer,
                new Uri("https://idp.example.invalid/authorize"),
                new Uri("https://idp.example.invalid/token"),
                new Uri("https://idp.example.invalid/jwks"),
                Array.Empty<SecurityKey>()));

        public Uri BuildAuthorizationUri(
            AuthMiddlewareSettings settings,
            OidcProviderConfiguration provider,
            OidcLoginFlow flow,
            Uri redirectUri)
        {
            Flow = flow;
            return new Uri($"https://idp.example.invalid/authorize?state={Uri.EscapeDataString(flow.State)}");
        }

        public Task<OidcIdentity> ExchangeAndValidateAsync(
            AuthMiddlewareSettings settings,
            OidcProviderConfiguration provider,
            OidcTokenExchange exchange,
            CancellationToken ct)
        {
            Exchange = exchange;
            ExchangeCount++;
            return Task.FromResult(new OidcIdentity("existing-user"));
        }
    }

    private sealed class FakeSessions : IExtensionLoginSessionService
    {
        public bool BrowserMatches { get; set; } = true;
        public string? CompletedUsername { get; private set; }
        public string? CompletedExtensionId { get; private set; }

        public string BeginBrowserSession(HttpContext context) => "browser-binding";
        public bool IsBrowserSession(HttpContext context, string browserBinding) =>
            BrowserMatches && browserBinding == "browser-binding";
        public Task<ExtensionLoginCompletion> CompleteAsync(
            HttpContext context,
            string browserBinding,
            string extensionId,
            string username,
            CancellationToken ct = default)
        {
            CompletedUsername = username;
            CompletedExtensionId = extensionId;
            return Task.FromResult(new ExtensionLoginCompletion(
                "cove-ticket",
                ExtensionLoginCompletionFailure.None));
        }
        public Task<ExtensionLoginRedemption?> RedeemAsync(
            HttpContext context,
            string code,
            CancellationToken ct = default) =>
            Task.FromResult<ExtensionLoginRedemption?>(null);
    }

    private sealed class MemoryExtensionStore : IExtensionStore
    {
        private readonly Dictionary<string, string> _values = new(StringComparer.Ordinal);
        public Task<string?> GetAsync(string key, CancellationToken ct = default) =>
            Task.FromResult(_values.GetValueOrDefault(key));
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
        public Task<Dictionary<string, string>> GetAllAsync(CancellationToken ct = default) =>
            Task.FromResult(new Dictionary<string, string>(_values, StringComparer.Ordinal));
    }
}
