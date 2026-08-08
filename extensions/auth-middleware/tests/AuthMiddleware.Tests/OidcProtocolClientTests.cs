using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.IdentityModel.Tokens;

namespace AuthMiddleware.Tests;

public sealed class OidcProtocolClientTests
{
    private const string ValidCodeVerifier = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~";

    [Fact]
    public async Task Exchanges_the_code_with_pkce_and_validates_a_signed_identity_token()
    {
        using var fixture = new OidcFixture(nonce: "expected-nonce");
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var settings = fixture.Settings;
        var provider = await client.DiscoverAsync(settings, CancellationToken.None);

        var identity = await client.ExchangeAndValidateAsync(
            settings,
            provider,
            new OidcTokenExchange(
                "authorization-code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None);

        Assert.Equal("existing-user", identity.Username);
        Assert.Equal("authorization-code", fixture.Handler.TokenForm["code"]);
        Assert.Equal(ValidCodeVerifier, fixture.Handler.TokenForm["code_verifier"]);
        Assert.Equal("authorization_code", fixture.Handler.TokenForm["grant_type"]);
        Assert.Equal(settings.OidcClientSecret, fixture.Handler.TokenForm["client_secret"]);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("wrong-nonce")]
    public async Task Rejects_a_missing_or_mismatched_nonce(string? nonce)
    {
        using var fixture = new OidcFixture(nonce);
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        await Assert.ThrowsAsync<OidcProtocolException>(() => client.ExchangeAndValidateAsync(
            fixture.Settings,
            provider,
            new OidcTokenExchange(
                "code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_discovery_with_a_different_issuer()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            DiscoveryIssuer = "https://other.example.invalid/",
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));

        await Assert.ThrowsAsync<OidcProtocolException>(() =>
            client.DiscoverAsync(fixture.Settings, CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_insecure_endpoints_from_an_https_issuer()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            EndpointScheme = "http",
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));

        await Assert.ThrowsAsync<OidcProtocolException>(() =>
            client.DiscoverAsync(fixture.Settings, CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_an_identity_token_for_another_audience()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            TokenAudience = "another-client",
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        await Assert.ThrowsAsync<OidcProtocolException>(() => client.ExchangeAndValidateAsync(
            fixture.Settings,
            provider,
            new OidcTokenExchange(
                "code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_an_identity_token_signed_by_an_unpublished_key()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            SignWithUnpublishedKey = true,
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        await Assert.ThrowsAsync<OidcProtocolException>(() => client.ExchangeAndValidateAsync(
            fixture.Settings,
            provider,
            new OidcTokenExchange(
                "code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_an_identity_token_for_a_different_authorized_party()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            AuthorizedParty = "another-client",
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        await Assert.ThrowsAsync<OidcProtocolException>(() => client.ExchangeAndValidateAsync(
            fixture.Settings,
            provider,
            new OidcTokenExchange(
                "code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_duplicate_username_claims()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            DuplicateUsernameClaim = true,
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        await Assert.ThrowsAsync<OidcProtocolException>(() => client.ExchangeAndValidateAsync(
            fixture.Settings,
            provider,
            new OidcTokenExchange(
                "code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_an_expired_identity_token()
    {
        using var fixture = new OidcFixture("expected-nonce")
        {
            ExpiresUtc = DateTime.UtcNow.AddMinutes(-2),
        };
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));
        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        await Assert.ThrowsAsync<OidcProtocolException>(() => client.ExchangeAndValidateAsync(
            fixture.Settings,
            provider,
            new OidcTokenExchange(
                "code",
                ValidCodeVerifier,
                "expected-nonce",
                new Uri("https://cove.example.invalid/api/plugins/com.midnightrider.auth-middleware/oidc/callback")),
            CancellationToken.None));
    }

    [Fact]
    public async Task Discovers_a_slashless_issuer_without_changing_its_identity()
    {
        using var fixture = new OidcFixture(
            "expected-nonce",
            "https://idp.example.invalid");
        using var client = new OidcProtocolClient(new HttpClient(fixture.Handler));

        var provider = await client.DiscoverAsync(fixture.Settings, CancellationToken.None);

        Assert.Equal("https://idp.example.invalid", provider.Issuer);
        Assert.Equal(
            "/.well-known/openid-configuration",
            fixture.Handler.DiscoveryRequestPath);
    }

    private sealed class OidcFixture : IDisposable
    {
        private readonly RSA _rsa = RSA.Create(2048);
        private readonly RSA _unpublishedRsa = RSA.Create(2048);
        private readonly string? _nonce;
        public AuthMiddlewareSettings Settings { get; }
        public FakeOidcHandler Handler { get; }
        public string DiscoveryIssuer { get; set; }
        public string TokenAudience { get; set; }
        public bool SignWithUnpublishedKey { get; set; }
        public string EndpointScheme { get; set; } = "https";
        public string? AuthorizedParty { get; set; }
        public bool DuplicateUsernameClaim { get; set; }
        public DateTime? ExpiresUtc { get; set; }

        public OidcFixture(
            string? nonce,
            string issuer = "https://idp.example.invalid/application/o/cove/")
        {
            _nonce = nonce;
            Settings = AuthMiddlewareSettings.Default with
            {
                OidcEnabled = true,
                OidcIssuer = issuer,
                OidcClientId = "cove-client",
                OidcClientSecret = "client-secret",
                CovePublicUrl = "https://cove.example.invalid",
                UsernameClaim = "preferred_username",
                Scopes = ["openid", "profile"],
            };
            DiscoveryIssuer = Settings.OidcIssuer;
            TokenAudience = Settings.OidcClientId;
            Handler = new FakeOidcHandler(this);
        }

        public string CreateToken()
        {
            var key = new RsaSecurityKey(SignWithUnpublishedKey ? _unpublishedRsa : _rsa)
            {
                KeyId = SignWithUnpublishedKey ? "unpublished-key" : "test-key",
            };
            var claims = new List<Claim>
            {
                new("sub", "subject-1"),
                new("preferred_username", "existing-user"),
            };
            if (_nonce is not null) claims.Add(new Claim("nonce", _nonce));
            if (AuthorizedParty is not null) claims.Add(new Claim("azp", AuthorizedParty));
            if (DuplicateUsernameClaim) claims.Add(new Claim("preferred_username", "other-user"));
            var token = new JwtSecurityToken(
                issuer: Settings.OidcIssuer,
                audience: TokenAudience,
                claims: claims,
                notBefore: DateTime.UtcNow.AddMinutes(-10),
                expires: ExpiresUtc ?? DateTime.UtcNow.AddMinutes(5),
                signingCredentials: new SigningCredentials(key, SecurityAlgorithms.RsaSha256));
            token.Header["kid"] = key.KeyId;
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string Jwks()
        {
            var parameters = _rsa.ExportParameters(false);
            return JsonSerializer.Serialize(new
            {
                keys = new[]
                {
                    new
                    {
                        kty = "RSA",
                        use = "sig",
                        kid = "test-key",
                        alg = "RS256",
                        n = Base64UrlEncoder.Encode(parameters.Modulus),
                        e = Base64UrlEncoder.Encode(parameters.Exponent),
                    },
                },
            });
        }

        public void Dispose()
        {
            _rsa.Dispose();
            _unpublishedRsa.Dispose();
        }

        public sealed class FakeOidcHandler(OidcFixture owner) : HttpMessageHandler
        {
            public Dictionary<string, string> TokenForm { get; } = new(StringComparer.Ordinal);
            public string? DiscoveryRequestPath { get; private set; }

            protected override async Task<HttpResponseMessage> SendAsync(
                HttpRequestMessage request,
                CancellationToken cancellationToken)
            {
                if (request.RequestUri!.AbsolutePath.EndsWith(".well-known/openid-configuration", StringComparison.Ordinal))
                {
                    DiscoveryRequestPath = request.RequestUri.AbsolutePath;
                    return Json(new
                    {
                        issuer = owner.DiscoveryIssuer,
                        authorization_endpoint = $"{owner.EndpointScheme}://idp.example.invalid/application/o/authorize/",
                        token_endpoint = $"{owner.EndpointScheme}://idp.example.invalid/application/o/token/",
                        jwks_uri = $"{owner.EndpointScheme}://idp.example.invalid/application/o/cove/jwks/",
                    });
                }

                if (request.RequestUri.AbsolutePath.EndsWith("/jwks/", StringComparison.Ordinal))
                {
                    return new HttpResponseMessage(HttpStatusCode.OK)
                    {
                        Content = new StringContent(owner.Jwks(), Encoding.UTF8, "application/json"),
                    };
                }

                if (request.RequestUri.AbsolutePath.EndsWith("/token/", StringComparison.Ordinal))
                {
                    var body = await request.Content!.ReadAsStringAsync(cancellationToken);
                    foreach (var pair in body.Split('&', StringSplitOptions.RemoveEmptyEntries))
                    {
                        var parts = pair.Split('=', 2);
                        TokenForm[WebUtility.UrlDecode(parts[0])] = WebUtility.UrlDecode(parts.ElementAtOrDefault(1) ?? "");
                    }
                    return Json(new { id_token = owner.CreateToken(), token_type = "Bearer", access_token = "not-used" });
                }

                return new HttpResponseMessage(HttpStatusCode.NotFound);
            }

            private static HttpResponseMessage Json<T>(T value) => new(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonSerializer.Serialize(value), Encoding.UTF8, "application/json"),
            };
        }
    }
}
