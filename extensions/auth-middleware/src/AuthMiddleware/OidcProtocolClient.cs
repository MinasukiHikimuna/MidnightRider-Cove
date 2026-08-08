using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.IdentityModel.Tokens;

namespace AuthMiddleware;

public sealed record OidcProviderConfiguration(
    string Issuer,
    Uri AuthorizationEndpoint,
    Uri TokenEndpoint,
    Uri JwksUri,
    IReadOnlyList<SecurityKey> SigningKeys);

public sealed record OidcTokenExchange(
    string Code,
    string CodeVerifier,
    string ExpectedNonce,
    Uri RedirectUri);

public sealed record OidcIdentity(string Subject, string? AccountLabel);

public sealed class OidcProtocolException(string message) : Exception(message);

public interface IOidcProtocolClient
{
    Task<OidcProviderConfiguration> DiscoverAsync(
        AuthMiddlewareSettings settings,
        OidcProviderSettings oidcProvider,
        CancellationToken ct);

    Uri BuildAuthorizationUri(
        AuthMiddlewareSettings settings,
        OidcProviderSettings oidcProvider,
        OidcProviderConfiguration provider,
        OidcLoginFlow flow,
        Uri redirectUri);

    Task<OidcIdentity> ExchangeAndValidateAsync(
        AuthMiddlewareSettings settings,
        OidcProviderSettings oidcProvider,
        OidcProviderConfiguration provider,
        OidcTokenExchange exchange,
        CancellationToken ct);
}

public sealed class OidcProtocolClient(HttpClient http) : IOidcProtocolClient, IDisposable
{
    private const int MaximumDocumentBytes = 256 * 1024;
    private const int MaximumSigningKeys = 64;
    private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(15);
    private static readonly string[] AllowedSigningAlgorithms =
    [
        "RS256", "RS384", "RS512",
        "PS256", "PS384", "PS512",
        "ES256", "ES384", "ES512",
    ];

    public async Task<OidcProviderConfiguration> DiscoverAsync(
        AuthMiddlewareSettings settings,
        OidcProviderSettings oidcProvider,
        CancellationToken ct)
    {
        if (!oidcProvider.IsReady(settings))
            throw new OidcProtocolException("OIDC is not fully configured.");

        try
        {
            var discoveryUri = new Uri(
                oidcProvider.Issuer
                + (oidcProvider.Issuer.EndsWith("/", StringComparison.Ordinal) ? string.Empty : "/")
                + ".well-known/openid-configuration");
            using var discovery = await GetJsonAsync(discoveryUri, ct);
            var root = discovery.RootElement;
            var issuer = RequiredString(root, "issuer");
            if (!FixedTimeEquals(issuer, oidcProvider.Issuer))
                throw new OidcProtocolException("The discovery issuer does not match the configured issuer.");

            var allowHttpEndpoints = settings.AllowInsecureDevelopmentIssuer
                && Uri.TryCreate(oidcProvider.Issuer, UriKind.Absolute, out var configuredIssuer)
                && configuredIssuer.Scheme == Uri.UriSchemeHttp;
            var authorizationEndpoint = RequiredEndpoint(root, "authorization_endpoint", allowHttpEndpoints);
            var tokenEndpoint = RequiredEndpoint(root, "token_endpoint", allowHttpEndpoints);
            var jwksUri = RequiredEndpoint(root, "jwks_uri", allowHttpEndpoints);

            using var jwksDocument = await GetJsonAsync(jwksUri, ct);
            var keySet = new JsonWebKeySet(jwksDocument.RootElement.GetRawText());
            var signingKeys = keySet.GetSigningKeys();
            if (signingKeys.Count is 0 or > MaximumSigningKeys)
                throw new OidcProtocolException("The provider did not publish a usable signing key.");

            return new OidcProviderConfiguration(
                issuer,
                authorizationEndpoint,
                tokenEndpoint,
                jwksUri,
                [.. signingKeys]);
        }
        catch (OidcProtocolException)
        {
            throw;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            throw new OidcProtocolException("OIDC discovery failed.");
        }
    }

    public Uri BuildAuthorizationUri(
        AuthMiddlewareSettings settings,
        OidcProviderSettings oidcProvider,
        OidcProviderConfiguration provider,
        OidcLoginFlow flow,
        Uri redirectUri)
    {
        var query = new Dictionary<string, string?>
        {
            ["client_id"] = oidcProvider.ClientId,
            ["redirect_uri"] = redirectUri.AbsoluteUri,
            ["response_type"] = "code",
            ["scope"] = string.Join(' ', oidcProvider.Scopes),
            ["state"] = flow.State,
            ["nonce"] = flow.Nonce,
            ["code_challenge"] = flow.CodeChallenge,
            ["code_challenge_method"] = "S256",
        };
        if (flow.Purpose == OidcFlowPurpose.Link)
            query["prompt"] = "select_account";
        return new Uri(QueryHelpers.AddQueryString(provider.AuthorizationEndpoint.AbsoluteUri, query));
    }

    public async Task<OidcIdentity> ExchangeAndValidateAsync(
        AuthMiddlewareSettings settings,
        OidcProviderSettings oidcProvider,
        OidcProviderConfiguration provider,
        OidcTokenExchange exchange,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(exchange.Code)
            || exchange.Code.Length > 4096
            || string.IsNullOrWhiteSpace(exchange.CodeVerifier)
            || exchange.CodeVerifier.Length is < 43 or > 128
            || string.IsNullOrWhiteSpace(exchange.ExpectedNonce))
        {
            throw new OidcProtocolException("The authorization response is invalid.");
        }

        try
        {
            using var content = new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["grant_type"] = "authorization_code",
                ["code"] = exchange.Code,
                ["redirect_uri"] = exchange.RedirectUri.AbsoluteUri,
                ["client_id"] = oidcProvider.ClientId,
                ["client_secret"] = oidcProvider.ClientSecret,
                ["code_verifier"] = exchange.CodeVerifier,
            });
            using var request = new HttpRequestMessage(HttpMethod.Post, provider.TokenEndpoint)
            {
                Content = content,
            };
            using var tokenDocument = await SendJsonAsync(
                request,
                "The provider rejected the authorization code.",
                ct);
            var idToken = RequiredString(tokenDocument.RootElement, "id_token");
            if (idToken.Length > 64 * 1024)
                throw new OidcProtocolException("The identity token is too large.");

            return ValidateIdentityToken(oidcProvider, provider, exchange.ExpectedNonce, idToken);
        }
        catch (OidcProtocolException)
        {
            throw;
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch
        {
            throw new OidcProtocolException("The authorization response could not be validated.");
        }
    }

    private static OidcIdentity ValidateIdentityToken(
        OidcProviderSettings settings,
        OidcProviderConfiguration provider,
        string expectedNonce,
        string idToken)
    {
        var handler = new JwtSecurityTokenHandler { MapInboundClaims = false };
        var parameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = settings.Issuer,
            ValidateAudience = true,
            ValidAudience = settings.ClientId,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = provider.SigningKeys,
            RequireSignedTokens = true,
            ValidateLifetime = true,
            RequireExpirationTime = true,
            ClockSkew = TimeSpan.FromMinutes(1),
            ValidAlgorithms = AllowedSigningAlgorithms,
        };

        ClaimsPrincipal principal;
        SecurityToken validated;
        try
        {
            principal = handler.ValidateToken(idToken, parameters, out validated);
        }
        catch
        {
            throw new OidcProtocolException("The identity token is invalid.");
        }

        if (validated is not JwtSecurityToken jwt)
            throw new OidcProtocolException("The identity token format is invalid.");

        var subjects = principal.FindAll("sub").Select(claim => claim.Value).ToArray();
        if (subjects.Length != 1 || string.IsNullOrWhiteSpace(subjects[0]))
            throw new OidcProtocolException("The identity token subject is invalid.");

        var audiences = jwt.Audiences.Distinct(StringComparer.Ordinal).ToArray();
        var authorizedParty = principal.FindAll("azp").Select(claim => claim.Value).ToArray();
        if ((audiences.Length > 1 && authorizedParty.Length != 1)
            || (authorizedParty.Length > 0
                && (authorizedParty.Length != 1
                    || !FixedTimeEquals(authorizedParty[0], settings.ClientId))))
        {
            throw new OidcProtocolException("The identity token authorized party is invalid.");
        }

        var nonces = principal.FindAll("nonce").Select(claim => claim.Value).ToArray();
        if (nonces.Length != 1 || !FixedTimeEquals(nonces[0], expectedNonce))
            throw new OidcProtocolException("The identity token nonce is invalid.");

        var accountLabels = principal.FindAll(settings.DisplayClaim).Select(claim => claim.Value.Trim()).ToArray();
        if (accountLabels.Length > 1
            || (accountLabels.Length == 1
                && (string.IsNullOrWhiteSpace(accountLabels[0])
                    || accountLabels[0].Length > 256
                    || accountLabels[0].Any(char.IsControl))))
        {
            throw new OidcProtocolException("The configured display claim is invalid.");
        }

        var subject = subjects[0];
        if (subject.Length > 512 || subject.Any(char.IsControl))
            throw new OidcProtocolException("The identity token subject is invalid.");

        // `sub` is opaque and case-sensitive. Do not trim or normalize it.
        return new OidcIdentity(subject, accountLabels.SingleOrDefault());
    }

    private async Task<JsonDocument> GetJsonAsync(Uri uri, CancellationToken ct)
    {
        using var request = new HttpRequestMessage(HttpMethod.Get, uri);
        request.Headers.Accept.ParseAdd("application/json");
        return await SendJsonAsync(
            request,
            "The provider metadata request failed.",
            ct);
    }

    private async Task<JsonDocument> SendJsonAsync(
        HttpRequestMessage request,
        string statusFailure,
        CancellationToken ct)
    {
        using var timeout = CancellationTokenSource.CreateLinkedTokenSource(ct);
        timeout.CancelAfter(RequestTimeout);
        try
        {
            using var response = await http.SendAsync(
                request,
                HttpCompletionOption.ResponseHeadersRead,
                timeout.Token);
            if (!response.IsSuccessStatusCode)
                throw new OidcProtocolException(statusFailure);
            return await ReadJsonAsync(response, timeout.Token);
        }
        catch (OperationCanceledException) when (ct.IsCancellationRequested)
        {
            throw;
        }
        catch (OperationCanceledException)
        {
            throw new OidcProtocolException("The identity provider request timed out.");
        }
    }

    private static async Task<JsonDocument> ReadJsonAsync(
        HttpResponseMessage response,
        CancellationToken ct)
    {
        if (response.Content.Headers.ContentLength > MaximumDocumentBytes)
            throw new OidcProtocolException("The identity provider response is too large.");
        await response.Content.LoadIntoBufferAsync(MaximumDocumentBytes, ct);
        await using var stream = await response.Content.ReadAsStreamAsync(ct);
        return await JsonDocument.ParseAsync(stream, cancellationToken: ct);
    }

    private static string RequiredString(JsonElement parent, string propertyName)
    {
        if (!parent.TryGetProperty(propertyName, out var value)
            || value.ValueKind != JsonValueKind.String
            || string.IsNullOrWhiteSpace(value.GetString()))
        {
            throw new OidcProtocolException($"The provider response is missing {propertyName}.");
        }

        return value.GetString()!;
    }

    private static Uri RequiredEndpoint(JsonElement parent, string propertyName, bool allowHttp)
    {
        var value = RequiredString(parent, propertyName);
        if (!Uri.TryCreate(value, UriKind.Absolute, out var uri)
            || !string.IsNullOrEmpty(uri.UserInfo)
            || !string.IsNullOrEmpty(uri.Fragment)
            || (uri.Scheme != Uri.UriSchemeHttps
                && !(allowHttp && uri.Scheme == Uri.UriSchemeHttp)))
        {
            throw new OidcProtocolException($"The provider {propertyName} is invalid.");
        }

        return uri;
    }

    private static bool FixedTimeEquals(string left, string right)
    {
        var leftHash = SHA256.HashData(Encoding.UTF8.GetBytes(left));
        var rightHash = SHA256.HashData(Encoding.UTF8.GetBytes(right));
        return CryptographicOperations.FixedTimeEquals(leftHash, rightHash);
    }

    public void Dispose() => http.Dispose();
}
