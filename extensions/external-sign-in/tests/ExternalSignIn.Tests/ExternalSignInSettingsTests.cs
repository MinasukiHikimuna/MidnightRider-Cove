using System.Text.Json;
using Cove.Plugins;

namespace ExternalSignIn.Tests;

public sealed class ExternalSignInSettingsTests
{
    [Fact]
    public void Valid_update_normalizes_shared_fields_and_preserves_provider_secret()
    {
        var current = ValidSettings();
        var request = ValidUpdate() with
        {
            OidcProviders =
            [
                ValidProviderUpdate() with
                {
                    ButtonLabel = "  Sign in with Authentik  ",
                    ClientId = " cove-client ",
                    ClientSecret = "",
                    Scopes = ["profile", "openid", "profile", "email"],
                },
            ],
            CovePublicUrl = "https://cove.example.invalid/",
            TrustedHeaderEnabled = true,
            TrustedHeaderProviderId = null,
            TrustedHeaderSubjectName = "X-Authentik-Uid",
            TrustedHeaderDisplayName = "X-Authentik-Username",
            TrustedProxyCidrs = ["192.0.2.14", "2001:db8::/64"],
        };

        var result = ExternalSignInSettingsValidator.ValidateUpdate(request, current);

        Assert.True(result.IsValid);
        var provider = Assert.Single(result.Value!.OidcProviders);
        Assert.Equal("client-secret", provider.ClientSecret);
        Assert.Equal("Sign in with Authentik", provider.ButtonLabel);
        Assert.Equal(["openid", "profile", "email"], provider.Scopes);
        Assert.Equal("https://cove.example.invalid", result.Value.CovePublicUrl);
        Assert.StartsWith("trusted-header-", result.Value.TrustedHeaderProviderId, StringComparison.Ordinal);
        Assert.Equal(["192.0.2.14/32", "2001:db8::/64"], result.Value.TrustedProxyCidrs);
    }

    [Fact]
    public void New_provider_ids_are_generated_by_the_server_and_issuers_are_unique()
    {
        var generated = ExternalSignInSettingsValidator.ValidateUpdate(
            ValidUpdate() with { OidcProviders = [ValidProviderUpdate() with { Id = null }] },
            ExternalSignInSettings.Default);
        var duplicate = ExternalSignInSettingsValidator.ValidateUpdate(
            ValidUpdate() with
            {
                OidcProviders =
                [
                    ValidProviderUpdate(),
                    ValidProviderUpdate() with { Id = "second" },
                ],
            },
            ExternalSignInSettings.Default);

        Assert.True(generated.IsValid);
        Assert.Matches("^[a-f0-9]{32}$", Assert.Single(generated.Value!.OidcProviders).Id);
        Assert.Contains("oidcProviders[1].issuer", duplicate.Errors.Keys);
    }

    [Fact]
    public void Persisted_oidc_provider_issuer_is_immutable()
    {
        var current = ValidSettings() with
        {
            TrustedHeaderProviderId = "proxy-authority",
        };
        var result = ExternalSignInSettingsValidator.ValidateUpdate(
            ValidUpdate() with
            {
                OidcProviders =
                [
                    ValidProviderUpdate() with
                    {
                        Issuer = "https://replacement.example.invalid/application/o/cove/",
                    },
                ],
                TrustedHeaderProviderId = "replacement-authority",
            },
            current);

        Assert.Contains("oidcProviders[0].issuer", result.Errors.Keys);
        Assert.DoesNotContain("trustedHeaderProviderId", result.Errors.Keys);
    }

    [Fact]
    public void Oidc_requires_https_unless_the_development_override_is_explicit()
    {
        var request = ValidUpdate() with
        {
            OidcProviders =
            [
                ValidProviderUpdate() with
                {
                    Issuer = "http://idp.example.invalid/application/o/cove/",
                },
            ],
        };

        var rejected = ExternalSignInSettingsValidator.ValidateUpdate(request, ExternalSignInSettings.Default);
        var allowed = ExternalSignInSettingsValidator.ValidateUpdate(
            request with
            {
                AllowInsecureDevelopmentIssuer = true,
                CovePublicUrl = "http://cove.example.invalid",
            },
            ExternalSignInSettings.Default);

        Assert.Contains("oidcProviders[0].issuer", rejected.Errors.Keys);
        Assert.True(allowed.IsValid);
    }

    [Fact]
    public void Enabled_modes_require_complete_safe_configuration()
    {
        var request = ValidUpdate() with
        {
            OidcProviders =
            [
                ValidProviderUpdate() with { ClientId = "", ClientSecret = "" },
            ],
            TrustedHeaderEnabled = true,
            TrustedHeaderSubjectName = "bad header name",
            TrustedProxyCidrs = ["all-private-networks", "192.0.2.0/99"],
        };

        var result = ExternalSignInSettingsValidator.ValidateUpdate(request, ExternalSignInSettings.Default);

        Assert.False(result.IsValid);
        Assert.Contains("oidcProviders[0].clientId", result.Errors.Keys);
        Assert.Contains("oidcProviders[0].clientSecret", result.Errors.Keys);
        Assert.Contains("trustedHeaderSubjectName", result.Errors.Keys);
        Assert.Contains("trustedProxyCidrs", result.Errors.Keys);
    }

    [Fact]
    public void Response_contract_never_serializes_client_secrets()
    {
        var response = ExternalSignInSettingsResponse.From(ValidSettings());

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        Assert.DoesNotContain("client-secret", json, StringComparison.Ordinal);
        Assert.DoesNotContain("\"clientSecret\":", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"clientSecretConfigured\":true", json, StringComparison.Ordinal);
    }

    [Fact]
    public async Task Legacy_single_provider_settings_migrate_without_treating_username_as_a_stable_header_subject()
    {
        var storage = new MemoryStore();
        await storage.SetAsync("settings", """
            {
              "oidcEnabled": true,
              "oidcButtonLabel": "Legacy OIDC",
              "oidcIssuer": "https://idp.example.invalid/application/o/cove/",
              "oidcClientId": "legacy-client",
              "covePublicUrl": "https://cove.example.invalid",
              "usernameClaim": "preferred_username",
              "scopes": ["openid", "profile"],
              "allowInsecureDevelopmentIssuer": false,
              "trustedHeaderEnabled": true,
              "trustedHeaderName": "X-Legacy-Username",
              "trustedProxyCidrs": ["192.0.2.14/32"]
            }
            """);
        await storage.SetAsync("oidc-client-secret", "legacy-secret");
        var store = new ExternalSignInSettingsStore(() => storage);

        await store.LoadAsync();

        var provider = Assert.Single(store.Current.OidcProviders);
        Assert.Equal("legacy-oidc", provider.Id);
        Assert.Equal("legacy-secret", provider.ClientSecret);
        Assert.False(store.Current.TrustedHeaderEnabled);
        Assert.Equal("X-Authentik-Uid", store.Current.TrustedHeaderSubjectName);
        Assert.Equal("X-Legacy-Username", store.Current.TrustedHeaderDisplayName);
        var persisted = await storage.GetAllAsync();
        Assert.Equal("legacy-secret", persisted["oidc-client-secret:legacy-oidc"]);
        Assert.DoesNotContain("oidc-client-secret", persisted.Keys);
        Assert.DoesNotContain("legacy-secret", persisted["settings"], StringComparison.Ordinal);
        Assert.Contains("\"version\":2", persisted["settings"], StringComparison.Ordinal);
    }

    [Fact]
    public async Task Removing_a_provider_deletes_only_its_namespaced_secret_after_public_settings_change()
    {
        var storage = new MemoryStore();
        var store = new ExternalSignInSettingsStore(() => storage);
        await store.UpdateAsync(ValidUpdate() with
        {
            OidcProviders =
            [
                ValidProviderUpdate(),
                ValidProviderUpdate() with
                {
                    Id = "second",
                    Issuer = "https://second.example.invalid/application/o/cove/",
                    ClientSecret = "second-secret",
                },
            ],
        });

        var result = await store.UpdateAsync(ValidUpdate());

        Assert.True(result.IsValid);
        var values = await storage.GetAllAsync();
        Assert.Contains("oidc-client-secret:authentik", values.Keys);
        Assert.DoesNotContain("oidc-client-secret:second", values.Keys);
    }

    internal static ExternalSignInSettings ValidSettings() => ExternalSignInSettings.Default with
    {
        CovePublicUrl = "https://cove.example.invalid",
        OidcProviders =
        [
            new OidcProviderSettings(
                "authentik",
                true,
                "Sign in with Authentik",
                "https://idp.example.invalid/application/o/cove/",
                "cove-client",
                "client-secret",
                "preferred_username",
                ["openid", "profile", "email"]),
        ],
    };

    internal static ExternalSignInSettingsUpdate ValidUpdate() => new()
    {
        CovePublicUrl = "https://cove.example.invalid",
        OidcProviders = [ValidProviderUpdate()],
        TrustedHeaderLabel = "Trusted reverse proxy",
        TrustedHeaderSubjectName = "X-Authentik-Uid",
        TrustedHeaderDisplayName = "X-Authentik-Username",
    };

    internal static OidcProviderSettingsUpdate ValidProviderUpdate() => new()
    {
        Id = "authentik",
        Enabled = true,
        ButtonLabel = "Sign in with Authentik",
        Issuer = "https://idp.example.invalid/application/o/cove/",
        ClientId = "cove-client",
        ClientSecret = "client-secret",
        DisplayClaim = "preferred_username",
        Scopes = ["openid", "profile", "email"],
    };

    private sealed class MemoryStore : IExtensionStore
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
