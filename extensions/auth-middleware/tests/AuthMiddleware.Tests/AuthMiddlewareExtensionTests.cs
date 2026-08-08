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
    public async Task Manifest_advertises_each_ready_provider_with_login_and_link_actions()
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
            .UpdateAsync(AuthMiddlewareSettingsTests.ValidUpdate() with
            {
                OidcProviders =
                [
                    AuthMiddlewareSettingsTests.ValidProviderUpdate(),
                    AuthMiddlewareSettingsTests.ValidProviderUpdate() with
                    {
                        Id = "second",
                        ButtonLabel = "Sign in with Second IdP",
                        Issuer = "https://second.example.invalid/application/o/cove/",
                    },
                ],
            });
        var methods = extension.GetUIManifest().LoginMethods;

        Assert.True(update.IsValid);
        Assert.Collection(
            methods,
            method =>
            {
                Assert.Equal("oidc-authentik", method.Id);
                Assert.Equal($"{AuthMiddlewareExtension.ApiBase}/oidc/authentik/start", method.StartUrl);
                Assert.Equal($"{AuthMiddlewareExtension.ApiBase}/oidc/authentik/link/start", method.LinkStartUrl);
            },
            method => Assert.Equal("oidc-second", method.Id));
        var values = await memory.GetAllAsync();
        Assert.Equal("client-secret", values["oidc-client-secret:authentik"]);
        Assert.DoesNotContain("client-secret", values["settings"], StringComparison.Ordinal);
    }

    [Fact]
    public async Task Trusted_header_manifest_is_linkable_but_hidden_from_the_login_page()
    {
        var extension = Extension();
        ((IStatefulExtension)extension).SetStore(new MemoryExtensionStore());
        var services = new ServiceCollection();
        services.AddLogging();
        extension.ConfigureServices(services, null!);
        await using var provider = services.BuildServiceProvider();
        await extension.InitializeAsync(provider);
        var update = AuthMiddlewareSettingsTests.ValidUpdate() with
        {
            OidcProviders = [],
            CovePublicUrl = "",
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        Assert.True((await provider.GetRequiredService<IAuthMiddlewareSettingsStore>()
            .UpdateAsync(update)).IsValid);

        var method = Assert.Single(extension.GetUIManifest().LoginMethods);

        Assert.Equal("trusted-header", method.Id);
        Assert.False(method.ShowOnLoginPage);
        Assert.Equal($"{AuthMiddlewareExtension.ApiBase}/trusted-header/link/start", method.LinkStartUrl);
    }

    [Fact]
    public async Task Shutdown_makes_trusted_header_middleware_fail_closed_for_new_requests()
    {
        var extension = Extension();
        ((IStatefulExtension)extension).SetStore(new MemoryExtensionStore());
        var services = new ServiceCollection();
        services.AddLogging();
        extension.ConfigureServices(services, null!);
        await using var provider = services.BuildServiceProvider();
        await extension.InitializeAsync(provider);
        var update = AuthMiddlewareSettingsTests.ValidUpdate() with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedProxyCidrs = ["192.0.2.14/32"],
        };
        Assert.True((await provider.GetRequiredService<IAuthMiddlewareSettingsStore>()
            .UpdateAsync(update)).IsValid);

        var beforeShutdown = new DefaultHttpContext();
        beforeShutdown.Connection.RemoteIpAddress = IPAddress.Parse("192.0.2.14");
        beforeShutdown.Request.Headers["X-Authentik-Uid"] = "stable-subject";
        beforeShutdown.Request.Headers["X-Authentik-Username"] = "existing-user";
        await extension.InvokeAsync(beforeShutdown, _ => Task.CompletedTask);
        Assert.True(beforeShutdown.TryGetExtensionIdentityAssertion(out _));

        await extension.ShutdownAsync();
        var afterShutdown = new DefaultHttpContext();
        afterShutdown.Connection.RemoteIpAddress = IPAddress.Parse("192.0.2.14");
        afterShutdown.Request.Headers["X-Authentik-Uid"] = "stable-subject";
        var nextCalled = false;
        await extension.InvokeAsync(afterShutdown, _ =>
        {
            nextCalled = true;
            return Task.CompletedTask;
        });

        Assert.True(nextCalled);
        Assert.False(afterShutdown.TryGetExtensionIdentityAssertion(out _));
    }

    [Fact]
    public async Task Start_and_callback_complete_a_browser_bound_subject_flow_and_preserve_return_url()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        await using var app = await StartAppAsync(protocol, sessions);
        var client = app.GetTestClient();

        var start = await client.GetAsync($"{AuthMiddlewareExtension.ApiBase}/oidc/authentik/start?returnUrl=%2Fsettings%3Ftab%3Dsecurity");
        var callback = await client.GetAsync(
            $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&code=provider-code");

        Assert.Equal(HttpStatusCode.Redirect, start.StatusCode);
        Assert.True(start.Headers.CacheControl?.NoStore);
        Assert.Equal("https://idp.example.invalid/authorize", start.Headers.Location!.GetLeftPart(UriPartial.Path));
        Assert.Equal(
            "/login?redirect=%2Fsettings%3Ftab%3Dsecurity#external_login_code=cove-ticket",
            callback.Headers.Location!.OriginalString);
        Assert.Equal("provider-code", protocol.Exchange!.Code);
        Assert.Equal("stable-subject", sessions.CompletedIdentity!.Subject);
        Assert.Equal("https://idp.example.invalid/application/o/cove/", sessions.CompletedIdentity.ProviderId);
        Assert.Equal("existing-user", sessions.CompletedIdentity.AccountLabel);
    }

    [Fact]
    public async Task Unlinked_subject_returns_a_specific_non_sensitive_login_error()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions
        {
            Completion = new ExtensionLoginCompletion(null, ExtensionLoginCompletionFailure.IdentityUnlinked),
        };
        await using var app = await StartAppAsync(protocol, sessions);
        var client = app.GetTestClient();
        await client.GetAsync($"{AuthMiddlewareExtension.ApiBase}/oidc/authentik/start");

        var callback = await client.GetAsync(
            $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&code=provider-code");

        Assert.Equal("/login#external_login_error=unlinked", callback.Headers.Location!.OriginalString);
    }

    [Fact]
    public async Task Oidc_link_flow_prepares_confirmation_instead_of_logging_in()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        var links = new FakeLinks();
        await using var app = await StartAppAsync(protocol, sessions, links);
        var client = app.GetTestClient();

        var start = await client.PostAsync(
            $"{AuthMiddlewareExtension.ApiBase}/oidc/authentik/link/start",
            content: null);
        var callback = await client.GetAsync(
            $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&code=provider-code");

        Assert.Equal(HttpStatusCode.OK, start.StatusCode);
        Assert.Equal(OidcFlowPurpose.Link, protocol.Flow!.Purpose);
        Assert.Equal("intent-token", protocol.Flow.LinkIntentToken);
        Assert.Equal("/settings/my/account#external_link_code=link-confirmation", callback.Headers.Location!.OriginalString);
        Assert.Equal("stable-subject", links.PreparedIdentity!.Subject);
        Assert.Null(sessions.CompletedIdentity);
    }

    [Fact]
    public async Task Trusted_header_link_uses_stable_subject_and_returns_a_confirmation_code()
    {
        var links = new FakeLinks();
        var settings = AuthMiddlewareSettingsTests.ValidSettings() with
        {
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = "proxy-authority",
            TrustedProxyCidrs = ["127.0.0.1/32"],
        };
        await using var app = await StartAppAsync(
            new FakeProtocol(),
            new FakeSessions(),
            links,
            configuredSettings: settings);
        var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"{AuthMiddlewareExtension.ApiBase}/trusted-header/link/start");
        request.Headers.Add("X-Authentik-Uid", "stable-subject");
        request.Headers.Add("X-Authentik-Username", "existing-user");

        var response = await app.GetTestClient().SendAsync(request);
        var body = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains("link-confirmation", body, StringComparison.Ordinal);
        Assert.Equal("stable-subject", links.PreparedIdentity!.Subject);
        Assert.Equal("proxy-authority", links.PreparedIdentity.ProviderId);
        Assert.Equal("existing-user", links.PreparedIdentity.AccountLabel);
    }

    [Fact]
    public async Task Wrong_browser_is_rejected_before_exchange_without_consuming_the_flow()
    {
        var protocol = new FakeProtocol();
        var sessions = new FakeSessions();
        await using var app = await StartAppAsync(protocol, sessions);
        var client = app.GetTestClient();
        await client.GetAsync($"{AuthMiddlewareExtension.ApiBase}/oidc/authentik/start?returnUrl=%2Fsettings");
        var callback = $"{AuthMiddlewareExtension.ApiBase}/oidc/callback?state={Uri.EscapeDataString(protocol.Flow!.State)}&code=provider-code";
        sessions.BrowserMatches = false;

        var wrongBrowser = await client.GetAsync(callback);
        sessions.BrowserMatches = true;
        var originalBrowser = await client.GetAsync(callback);

        Assert.Equal(
            "/login?redirect=%2Fsettings#external_login_error=failed",
            wrongBrowser.Headers.Location!.OriginalString);
        Assert.Equal(1, protocol.ExchangeCount);
        Assert.Equal("/login?redirect=%2Fsettings#external_login_code=cove-ticket", originalBrowser.Headers.Location!.OriginalString);
    }

    [Fact]
    public async Task Settings_response_exposes_secret_presence_per_provider_only()
    {
        await using var app = await StartAppAsync(new FakeProtocol(), new FakeSessions());

        var response = await app.GetTestClient()
            .GetFromJsonAsync<AuthMiddlewareSettingsResponse>($"{AuthMiddlewareExtension.ApiBase}/settings");

        var provider = Assert.Single(response!.OidcProviders);
        Assert.True(provider.ClientSecretConfigured);
        Assert.DoesNotContain(
            provider.GetType().GetProperties(),
            property => property.Name.Equals("ClientSecret", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task Provider_with_existing_links_cannot_be_deleted_but_can_be_disabled()
    {
        var identities = new FakeIdentities { ProviderLinkCount = 1 };
        await using var app = await StartAppAsync(new FakeProtocol(), new FakeSessions(), identities: identities);
        var client = app.GetTestClient();

        var remove = await client.PutAsJsonAsync(
            $"{AuthMiddlewareExtension.ApiBase}/settings",
            AuthMiddlewareSettingsTests.ValidUpdate() with { OidcProviders = [] });
        var disable = await client.PutAsJsonAsync(
            $"{AuthMiddlewareExtension.ApiBase}/settings",
            AuthMiddlewareSettingsTests.ValidUpdate() with
            {
                OidcProviders =
                [
                    AuthMiddlewareSettingsTests.ValidProviderUpdate() with
                    {
                        Enabled = false,
                        ClientSecret = "",
                    },
                ],
            });
        var removeAfterDisable = await client.PutAsJsonAsync(
            $"{AuthMiddlewareExtension.ApiBase}/settings",
            AuthMiddlewareSettingsTests.ValidUpdate() with { OidcProviders = [] });

        Assert.Equal(HttpStatusCode.Conflict, remove.StatusCode);
        Assert.Equal(HttpStatusCode.OK, disable.StatusCode);
        Assert.Equal(HttpStatusCode.Conflict, removeAfterDisable.StatusCode);
    }

    [Fact]
    public async Task Disabled_trusted_header_authority_can_be_replaced_only_after_its_links_are_removed()
    {
        var identities = new FakeIdentities { ProviderLinkCount = 1 };
        var current = AuthMiddlewareSettingsTests.ValidSettings() with
        {
            TrustedHeaderEnabled = false,
            TrustedHeaderProviderId = "old-proxy-authority",
        };
        await using var app = await StartAppAsync(
            new FakeProtocol(),
            new FakeSessions(),
            identities: identities,
            configuredSettings: current);
        var request = AuthMiddlewareSettingsTests.ValidUpdate() with
        {
            TrustedHeaderProviderId = "new-proxy-authority",
        };

        var linked = await app.GetTestClient().PutAsJsonAsync(
            $"{AuthMiddlewareExtension.ApiBase}/settings",
            request);
        identities.ProviderLinkCount = 0;
        var unlinked = await app.GetTestClient().PutAsJsonAsync(
            $"{AuthMiddlewareExtension.ApiBase}/settings",
            request);

        Assert.Equal(HttpStatusCode.Conflict, linked.StatusCode);
        Assert.Equal(HttpStatusCode.OK, unlinked.StatusCode);
    }

    [Fact]
    public void Routes_explicitly_declare_anonymous_authenticated_and_admin_access()
    {
        var builder = WebApplication.CreateBuilder();
        RegisterServices(builder.Services, new FakeProtocol(), new FakeSessions());
        var app = builder.Build();
        Extension().MapEndpoints(app);
        var routes = ((IEndpointRouteBuilder)app).DataSources.SelectMany(source => source.Endpoints).ToArray();

        var start = routes.Single(endpoint => endpoint.DisplayName?.Contains("/oidc/{providerId}/start", StringComparison.Ordinal) == true);
        var link = routes.Single(endpoint => endpoint.DisplayName?.Contains("/oidc/{providerId}/link/start", StringComparison.Ordinal) == true);
        var callback = routes.Single(endpoint => endpoint.DisplayName?.Contains("/oidc/callback", StringComparison.Ordinal) == true);
        var settings = routes.Single(endpoint => endpoint.DisplayName?.StartsWith($"HTTP: GET {AuthMiddlewareExtension.ApiBase}/settings", StringComparison.Ordinal) == true);

        Assert.NotNull(start.Metadata.GetMetadata<CoveAllowAnonymousMetadata>());
        Assert.NotNull(callback.Metadata.GetMetadata<CoveAllowAnonymousMetadata>());
        Assert.NotNull(link.Metadata.GetMetadata<CoveAllowWithoutPermissionMetadata>());
        Assert.Equal("auth-strict", start.Metadata.GetMetadata<EnableRateLimitingAttribute>()?.PolicyName);
        Assert.Equal([Permissions.ExtensionsConfigure],
            settings.Metadata.GetMetadata<CovePermissionRequirementMetadata>()!.Permissions);
    }

    private static async Task<WebApplication> StartAppAsync(
        FakeProtocol protocol,
        FakeSessions sessions,
        FakeLinks? links = null,
        FakeIdentities? identities = null,
        AuthMiddlewareSettings? configuredSettings = null)
    {
        var builder = WebApplication.CreateBuilder(new WebApplicationOptions { EnvironmentName = "Testing" });
        builder.WebHost.UseTestServer();
        RegisterServices(builder.Services, protocol, sessions, links, identities, configuredSettings);
        var app = builder.Build();
        app.Use((context, next) =>
        {
            context.Connection.RemoteIpAddress = IPAddress.Loopback;
            return next();
        });
        Extension().MapEndpoints(app);
        await app.StartAsync();
        return app;
    }

    private static void RegisterServices(
        IServiceCollection services,
        FakeProtocol protocol,
        FakeSessions sessions,
        FakeLinks? links = null,
        FakeIdentities? identities = null,
        AuthMiddlewareSettings? configuredSettings = null)
    {
        var settings = configuredSettings ?? AuthMiddlewareSettingsTests.ValidSettings();
        var fixedSettings = new FixedSettingsStore(settings);
        services.AddSingleton<IAuthMiddlewareSettingsProvider>(fixedSettings);
        services.AddSingleton<IAuthMiddlewareSettingsStore>(fixedSettings);
        services.AddSingleton<IOidcProtocolClient>(protocol);
        services.AddSingleton(new OidcFlowStore(TimeProvider.System));
        services.AddSingleton<IExtensionLoginSessionService>(sessions);
        services.AddSingleton<IExtensionIdentityLinkService>(links ?? new FakeLinks());
        services.AddSingleton<IExternalIdentityService>(identities ?? new FakeIdentities());
        services.AddSingleton<TrustedHeaderAuthenticator>();
        services.AddLogging();
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

    private sealed class FixedSettingsStore(AuthMiddlewareSettings settings)
        : IAuthMiddlewareSettingsStore
    {
        public AuthMiddlewareSettings Current { get; private set; } = settings;
        public Task LoadAsync(CancellationToken ct = default) => Task.CompletedTask;
        public Task<AuthMiddlewareSettingsValidation> UpdateAsync(
            AuthMiddlewareSettingsUpdate request,
            CancellationToken ct = default)
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

        public Task<OidcProviderConfiguration> DiscoverAsync(
            AuthMiddlewareSettings settings,
            OidcProviderSettings oidcProvider,
            CancellationToken ct) => Task.FromResult(new OidcProviderConfiguration(
                oidcProvider.Issuer,
                new Uri("https://idp.example.invalid/authorize"),
                new Uri("https://idp.example.invalid/token"),
                new Uri("https://idp.example.invalid/jwks"),
                Array.Empty<SecurityKey>()));

        public Uri BuildAuthorizationUri(
            AuthMiddlewareSettings settings,
            OidcProviderSettings oidcProvider,
            OidcProviderConfiguration provider,
            OidcLoginFlow flow,
            Uri redirectUri)
        {
            Flow = flow;
            return new Uri($"https://idp.example.invalid/authorize?state={Uri.EscapeDataString(flow.State)}");
        }

        public Task<OidcIdentity> ExchangeAndValidateAsync(
            AuthMiddlewareSettings settings,
            OidcProviderSettings oidcProvider,
            OidcProviderConfiguration provider,
            OidcTokenExchange exchange,
            CancellationToken ct)
        {
            Exchange = exchange;
            ExchangeCount++;
            return Task.FromResult(new OidcIdentity("stable-subject", "existing-user"));
        }
    }

    private sealed class FakeSessions : IExtensionLoginSessionService
    {
        public bool BrowserMatches { get; set; } = true;
        public ExtensionIdentityAssertion? CompletedIdentity { get; private set; }
        public ExtensionLoginCompletion Completion { get; set; } = new(
            "cove-ticket",
            ExtensionLoginCompletionFailure.None);

        public string BeginBrowserSession(HttpContext context) => "browser-binding";
        public bool IsBrowserSession(HttpContext context, string browserBinding) =>
            BrowserMatches && browserBinding == "browser-binding";
        public Task<ExtensionLoginCompletion> CompleteAsync(
            HttpContext context,
            string browserBinding,
            ExtensionIdentityAssertion assertion,
            CancellationToken ct = default)
        {
            CompletedIdentity = assertion;
            return Task.FromResult(Completion);
        }
        public Task<ExtensionLoginRedemption?> RedeemAsync(
            HttpContext context,
            string code,
            CancellationToken ct = default) => Task.FromResult<ExtensionLoginRedemption?>(null);
    }

    private sealed class FakeLinks : IExtensionIdentityLinkService
    {
        public ExtensionIdentityAssertion? PreparedIdentity { get; private set; }
        public ExtensionIdentityLinkIntent? BeginLink(HttpContext context, string extensionId, string providerId) =>
            new("intent-token", "browser-binding");
        public Task<ExtensionIdentityLinkPreparation> PrepareLinkAsync(
            HttpContext context,
            string intentToken,
            string browserBinding,
            ExtensionIdentityAssertion assertion,
            CancellationToken ct = default)
        {
            PreparedIdentity = assertion;
            return Task.FromResult(new ExtensionIdentityLinkPreparation(
                "link-confirmation",
                ExtensionIdentityLinkPreparationFailure.None));
        }
        public Task<ExtensionIdentityLinkPreparation> PrepareDirectLinkAsync(
            HttpContext context,
            ExtensionIdentityAssertion assertion,
            CancellationToken ct = default) => PrepareLinkAsync(context, "", "", assertion, ct);
    }

    private sealed class FakeIdentities : IExternalIdentityService
    {
        public int ProviderLinkCount { get; set; }
        public Task<int?> ResolveUserIdAsync(ExtensionIdentityAssertion assertion, CancellationToken ct = default) =>
            Task.FromResult<int?>(null);
        public Task MarkUsedAsync(ExtensionIdentityAssertion assertion, CancellationToken ct = default) => Task.CompletedTask;
        public Task<IReadOnlyList<ExternalIdentityLinkDto>> ListForUserAsync(int userId, CancellationToken ct = default) =>
            Task.FromResult<IReadOnlyList<ExternalIdentityLinkDto>>([]);
        public Task<ExternalIdentityLinkDto> CreateLinkAsync(int userId, ExtensionIdentityAssertion assertion, CovePrincipal? actor, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task RemoveLinkAsync(int userId, int linkId, CovePrincipal? actor, CancellationToken ct = default) =>
            throw new NotSupportedException();
        public Task<int> CountProviderLinksAsync(string extensionId, string providerId, CancellationToken ct = default) =>
            Task.FromResult(ProviderLinkCount);
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
