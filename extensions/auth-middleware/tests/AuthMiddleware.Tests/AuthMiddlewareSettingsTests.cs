using System.Text.Json;

namespace AuthMiddleware.Tests;

public sealed class AuthMiddlewareSettingsTests
{
    [Fact]
    public void Valid_update_normalizes_urls_scopes_and_proxy_networks_while_preserving_a_blank_secret()
    {
        var current = AuthMiddlewareSettings.Default with { OidcClientSecret = "existing-secret" };
        var request = new AuthMiddlewareSettingsUpdate
        {
            OidcEnabled = true,
            OidcButtonLabel = "  Sign in with Authentik  ",
            OidcIssuer = "https://idp.example.invalid/application/o/cove-dev",
            OidcClientId = " cove-client ",
            OidcClientSecret = "",
            CovePublicUrl = "https://cove.example.invalid/",
            UsernameClaim = " preferred_username ",
            Scopes = ["profile", "openid", "profile", "email"],
            TrustedHeaderEnabled = true,
            TrustedHeaderName = "X-Authentik-Username",
            TrustedProxyCidrs = ["192.0.2.14", "2001:db8::/64"],
        };

        var result = AuthMiddlewareSettingsValidator.ValidateUpdate(request, current);

        Assert.True(result.IsValid);
        Assert.Equal("existing-secret", result.Value!.OidcClientSecret);
        Assert.Equal("Sign in with Authentik", result.Value.OidcButtonLabel);
        Assert.Equal("https://idp.example.invalid/application/o/cove-dev", result.Value.OidcIssuer);
        Assert.Equal("https://cove.example.invalid", result.Value.CovePublicUrl);
        Assert.Equal(["openid", "profile", "email"], result.Value.Scopes);
        Assert.Equal(["192.0.2.14/32", "2001:db8::/64"], result.Value.TrustedProxyCidrs);
    }

    [Fact]
    public void Oidc_requires_https_unless_the_development_override_is_explicit()
    {
        var request = ValidOidcUpdate() with { OidcIssuer = "http://idp.example.invalid/application/o/cove/" };

        var rejected = AuthMiddlewareSettingsValidator.ValidateUpdate(request, AuthMiddlewareSettings.Default);
        var allowed = AuthMiddlewareSettingsValidator.ValidateUpdate(
            request with { AllowInsecureDevelopmentIssuer = true },
            AuthMiddlewareSettings.Default);

        Assert.Contains("oidcIssuer", rejected.Errors.Keys);
        Assert.True(allowed.IsValid);
    }

    [Fact]
    public void Oidc_requires_an_https_cove_origin_unless_the_development_override_is_explicit()
    {
        var request = ValidOidcUpdate() with { CovePublicUrl = "http://cove.example.invalid" };

        var rejected = AuthMiddlewareSettingsValidator.ValidateUpdate(
            request,
            AuthMiddlewareSettings.Default);
        var allowed = AuthMiddlewareSettingsValidator.ValidateUpdate(
            request with { AllowInsecureDevelopmentIssuer = true },
            AuthMiddlewareSettings.Default);

        Assert.Contains("covePublicUrl", rejected.Errors.Keys);
        Assert.True(allowed.IsValid);
    }

    [Fact]
    public void Enabled_modes_require_complete_safe_configuration()
    {
        var request = ValidOidcUpdate() with
        {
            OidcClientId = "",
            OidcClientSecret = "",
            TrustedHeaderEnabled = true,
            TrustedHeaderName = "bad header name",
            TrustedProxyCidrs = ["all-private-networks", "192.0.2.0/99"],
        };

        var result = AuthMiddlewareSettingsValidator.ValidateUpdate(request, AuthMiddlewareSettings.Default);

        Assert.False(result.IsValid);
        Assert.Contains("oidcClientId", result.Errors.Keys);
        Assert.Contains("oidcClientSecret", result.Errors.Keys);
        Assert.Contains("trustedHeaderName", result.Errors.Keys);
        Assert.Contains("trustedProxyCidrs", result.Errors.Keys);
    }

    [Fact]
    public void Response_contract_never_serializes_the_client_secret()
    {
        var response = AuthMiddlewareSettingsResponse.From(
            AuthMiddlewareSettings.Default with { OidcClientSecret = "do-not-return" });

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions(JsonSerializerDefaults.Web));

        Assert.DoesNotContain("do-not-return", json, StringComparison.Ordinal);
        Assert.DoesNotContain("\"oidcClientSecret\":", json, StringComparison.OrdinalIgnoreCase);
        Assert.Contains("\"oidcClientSecretConfigured\":true", json, StringComparison.Ordinal);
    }

    private static AuthMiddlewareSettingsUpdate ValidOidcUpdate() => new()
    {
        OidcEnabled = true,
        OidcButtonLabel = "Sign in with OIDC",
        OidcIssuer = "https://idp.example.invalid/application/o/cove/",
        OidcClientId = "cove-client",
        OidcClientSecret = "secret",
        CovePublicUrl = "https://cove.example.invalid",
        UsernameClaim = "preferred_username",
        Scopes = ["openid", "profile"],
    };
}
