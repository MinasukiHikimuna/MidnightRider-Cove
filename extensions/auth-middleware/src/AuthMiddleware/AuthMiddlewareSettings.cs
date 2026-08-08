using System.Collections.ObjectModel;

namespace AuthMiddleware;

public sealed record AuthMiddlewareSettings(
    bool OidcEnabled,
    string OidcButtonLabel,
    string OidcIssuer,
    string OidcClientId,
    string OidcClientSecret,
    string CovePublicUrl,
    string UsernameClaim,
    string[] Scopes,
    bool AllowInsecureDevelopmentIssuer,
    bool TrustedHeaderEnabled,
    string TrustedHeaderName,
    string[] TrustedProxyCidrs)
{
    public static AuthMiddlewareSettings Default => new(
        OidcEnabled: false,
        OidcButtonLabel: "Sign in with OpenID Connect",
        OidcIssuer: string.Empty,
        OidcClientId: string.Empty,
        OidcClientSecret: string.Empty,
        CovePublicUrl: string.Empty,
        UsernameClaim: "preferred_username",
        Scopes: ["openid", "profile", "email"],
        AllowInsecureDevelopmentIssuer: false,
        TrustedHeaderEnabled: false,
        TrustedHeaderName: "X-Authentik-Username",
        TrustedProxyCidrs: []);

    public bool OidcReady => OidcEnabled
        && OidcIssuer.Length > 0
        && OidcClientId.Length > 0
        && OidcClientSecret.Length > 0
        && CovePublicUrl.Length > 0
        && Scopes.Contains("openid", StringComparer.Ordinal);
}

public sealed record AuthMiddlewareSettingsUpdate
{
    public bool OidcEnabled { get; init; }
    public string? OidcButtonLabel { get; init; }
    public string? OidcIssuer { get; init; }
    public string? OidcClientId { get; init; }
    public string? OidcClientSecret { get; init; }
    public bool ClearOidcClientSecret { get; init; }
    public string? CovePublicUrl { get; init; }
    public string? UsernameClaim { get; init; }
    public string[]? Scopes { get; init; }
    public bool AllowInsecureDevelopmentIssuer { get; init; }
    public bool TrustedHeaderEnabled { get; init; }
    public string? TrustedHeaderName { get; init; }
    public string[]? TrustedProxyCidrs { get; init; }
}

public sealed record AuthMiddlewareSettingsResponse(
    bool OidcEnabled,
    string OidcButtonLabel,
    string OidcIssuer,
    string OidcClientId,
    bool OidcClientSecretConfigured,
    string CovePublicUrl,
    string UsernameClaim,
    string[] Scopes,
    bool AllowInsecureDevelopmentIssuer,
    bool TrustedHeaderEnabled,
    string TrustedHeaderName,
    string[] TrustedProxyCidrs)
{
    public static AuthMiddlewareSettingsResponse From(AuthMiddlewareSettings settings) => new(
        settings.OidcEnabled,
        settings.OidcButtonLabel,
        settings.OidcIssuer,
        settings.OidcClientId,
        settings.OidcClientSecret.Length > 0,
        settings.CovePublicUrl,
        settings.UsernameClaim,
        [.. settings.Scopes],
        settings.AllowInsecureDevelopmentIssuer,
        settings.TrustedHeaderEnabled,
        settings.TrustedHeaderName,
        [.. settings.TrustedProxyCidrs]);
}

public sealed record AuthMiddlewareSettingsValidation(
    AuthMiddlewareSettings? Value,
    IReadOnlyDictionary<string, string[]> Errors)
{
    public bool IsValid => Value is not null && Errors.Count == 0;
}

public static class AuthMiddlewareSettingsValidator
{
    private const int MaximumProxyNetworks = 64;

    public static AuthMiddlewareSettingsValidation ValidateUpdate(
        AuthMiddlewareSettingsUpdate request,
        AuthMiddlewareSettings current)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(current);

        var errors = new Dictionary<string, string[]>(StringComparer.Ordinal);
        var buttonLabel = NormalizeText(request.OidcButtonLabel ?? current.OidcButtonLabel, 80);
        if (buttonLabel is null)
            errors["oidcButtonLabel"] = ["Enter a label of at most 80 characters."];

        var issuer = NormalizeIssuer(
            request.OidcIssuer ?? current.OidcIssuer,
            request.AllowInsecureDevelopmentIssuer,
            out var issuerError);
        if (issuerError is not null)
            errors["oidcIssuer"] = [issuerError];

        var clientId = NormalizeText(request.OidcClientId ?? current.OidcClientId, 512, allowEmpty: true);
        if (clientId is null)
            errors["oidcClientId"] = ["The client ID is too long or contains control characters."];

        var clientSecret = request.ClearOidcClientSecret
            ? string.Empty
            : string.IsNullOrEmpty(request.OidcClientSecret)
                ? current.OidcClientSecret
                : request.OidcClientSecret;
        if (clientSecret.Length > 4096 || clientSecret.Any(char.IsControl))
            errors["oidcClientSecret"] = ["The client secret is too long or contains control characters."];

        var covePublicUrl = NormalizePublicOrigin(
            request.CovePublicUrl ?? current.CovePublicUrl,
            request.AllowInsecureDevelopmentIssuer,
            out var publicUrlError);
        if (publicUrlError is not null)
            errors["covePublicUrl"] = [publicUrlError];

        var usernameClaim = NormalizeText(request.UsernameClaim ?? current.UsernameClaim, 128);
        if (usernameClaim is null || usernameClaim.Any(char.IsWhiteSpace))
            errors["usernameClaim"] = ["Enter a claim name without whitespace or control characters."];

        var scopes = NormalizeScopes(request.Scopes ?? current.Scopes, out var scopesError);
        if (scopesError is not null)
            errors["scopes"] = [scopesError];

        var trustedHeaderName = NormalizeHeaderName(request.TrustedHeaderName ?? current.TrustedHeaderName);
        if (trustedHeaderName is null)
            errors["trustedHeaderName"] = ["Enter a valid HTTP header name."];

        var trustedProxyCidrs = NormalizeProxyNetworks(request.TrustedProxyCidrs ?? current.TrustedProxyCidrs, out var proxyError);
        if (proxyError is not null)
            errors["trustedProxyCidrs"] = [proxyError];

        if (request.OidcEnabled)
        {
            if (string.IsNullOrEmpty(issuer))
                errors.TryAdd("oidcIssuer", ["The issuer is required when OIDC is enabled."]);
            if (string.IsNullOrEmpty(clientId))
                errors["oidcClientId"] = ["The client ID is required when OIDC is enabled."];
            if (string.IsNullOrEmpty(clientSecret))
                errors["oidcClientSecret"] = ["The client secret is required when OIDC is enabled."];
            if (string.IsNullOrEmpty(covePublicUrl))
                errors.TryAdd("covePublicUrl", ["The Cove public URL is required when OIDC is enabled."]);
            if (scopes is not null && !scopes.Contains("openid", StringComparer.Ordinal))
                errors["scopes"] = ["OIDC scopes must include openid."];
        }

        if (request.TrustedHeaderEnabled)
        {
            if (trustedHeaderName is null)
                errors["trustedHeaderName"] = ["A valid username header is required when trusted-header authentication is enabled."];
            if (trustedProxyCidrs is null || trustedProxyCidrs.Length == 0)
                errors["trustedProxyCidrs"] = ["At least one trusted direct-proxy IP or CIDR is required."];
        }

        if (errors.Count > 0)
            return new(null, new ReadOnlyDictionary<string, string[]>(errors));

        return new(
            new AuthMiddlewareSettings(
                request.OidcEnabled,
                buttonLabel!,
                issuer!,
                clientId!,
                clientSecret,
                covePublicUrl!,
                usernameClaim!,
                scopes!,
                request.AllowInsecureDevelopmentIssuer,
                request.TrustedHeaderEnabled,
                trustedHeaderName!,
                trustedProxyCidrs!),
            new ReadOnlyDictionary<string, string[]>(errors));
    }

    public static AuthMiddlewareSettingsUpdate ToUpdate(AuthMiddlewareSettings settings) => new()
    {
        OidcEnabled = settings.OidcEnabled,
        OidcButtonLabel = settings.OidcButtonLabel,
        OidcIssuer = settings.OidcIssuer,
        OidcClientId = settings.OidcClientId,
        OidcClientSecret = settings.OidcClientSecret,
        CovePublicUrl = settings.CovePublicUrl,
        UsernameClaim = settings.UsernameClaim,
        Scopes = [.. settings.Scopes],
        AllowInsecureDevelopmentIssuer = settings.AllowInsecureDevelopmentIssuer,
        TrustedHeaderEnabled = settings.TrustedHeaderEnabled,
        TrustedHeaderName = settings.TrustedHeaderName,
        TrustedProxyCidrs = [.. settings.TrustedProxyCidrs],
    };

    private static string? NormalizeText(string? value, int maximumLength, bool allowEmpty = false)
    {
        var normalized = value?.Trim() ?? string.Empty;
        if ((!allowEmpty && normalized.Length == 0)
            || normalized.Length > maximumLength
            || normalized.Any(char.IsControl))
        {
            return null;
        }

        return normalized;
    }

    private static string? NormalizeIssuer(string? value, bool allowHttp, out string? error)
    {
        error = null;
        var text = value?.Trim() ?? string.Empty;
        if (text.Length == 0)
            return string.Empty;
        if (text.Length > 2048
            || text.Contains('\\')
            || text.Any(char.IsControl)
            || !Uri.TryCreate(text, UriKind.Absolute, out var uri)
            || !string.IsNullOrEmpty(uri.UserInfo)
            || !string.IsNullOrEmpty(uri.Query)
            || !string.IsNullOrEmpty(uri.Fragment))
        {
            error = "Enter an absolute issuer URL without credentials, query, or fragment.";
            return null;
        }

        if (!string.Equals(uri.Scheme, Uri.UriSchemeHttps, StringComparison.OrdinalIgnoreCase)
            && !(allowHttp && string.Equals(uri.Scheme, Uri.UriSchemeHttp, StringComparison.OrdinalIgnoreCase)))
        {
            error = "The issuer must use HTTPS unless the insecure development override is enabled.";
            return null;
        }

        // The OIDC issuer is an exact identifier, not merely a network location. In particular,
        // providers may distinguish an issuer with a trailing slash from one without it, so retain
        // the administrator-supplied form after validation and compare discovery metadata to it.
        return text;
    }

    private static string? NormalizePublicOrigin(
        string? value,
        bool allowHttp,
        out string? error)
    {
        error = null;
        var text = value?.Trim() ?? string.Empty;
        if (text.Length == 0)
            return string.Empty;
        if (text.Length > 2048
            || text.Contains('\\')
            || text.Any(char.IsControl)
            || !Uri.TryCreate(text, UriKind.Absolute, out var uri)
            || !string.IsNullOrEmpty(uri.UserInfo)
            || !string.IsNullOrEmpty(uri.Query)
            || !string.IsNullOrEmpty(uri.Fragment)
            || (uri.AbsolutePath.Length > 0 && uri.AbsolutePath != "/"))
        {
            error = "Enter the Cove public origin only, including scheme and optional port.";
            return null;
        }

        if (uri.Scheme != Uri.UriSchemeHttps
            && !(allowHttp && uri.Scheme == Uri.UriSchemeHttp))
        {
            error = "The Cove public URL must use HTTPS unless the insecure development override is enabled.";
            return null;
        }

        return uri.GetLeftPart(UriPartial.Authority).TrimEnd('/');
    }

    private static string[]? NormalizeScopes(string[]? values, out string? error)
    {
        error = null;
        var source = values ?? [];
        var scopes = new List<string>();
        foreach (var raw in source)
        {
            var scope = raw?.Trim() ?? string.Empty;
            if (scope.Length == 0)
                continue;
            if (scope.Length > 256 || scope.Any(char.IsWhiteSpace) || scope.Any(char.IsControl))
            {
                error = "Each scope must be a single value of at most 256 characters.";
                return null;
            }
            if (!scopes.Contains(scope, StringComparer.Ordinal))
                scopes.Add(scope);
        }

        if (scopes.Remove("openid"))
            scopes.Insert(0, "openid");
        return [.. scopes];
    }

    private static string? NormalizeHeaderName(string? value)
    {
        var header = value?.Trim() ?? string.Empty;
        return header.Length is > 0 and <= 128 && header.All(IsHeaderTokenCharacter)
            ? header
            : null;
    }

    private static bool IsHeaderTokenCharacter(char value) =>
        char.IsAsciiLetterOrDigit(value)
        || value is '!' or '#' or '$' or '%' or '&' or '\'' or '*' or '+' or '-' or '.' or '^' or '_' or '`' or '|' or '~';

    private static string[]? NormalizeProxyNetworks(string[]? values, out string? error)
    {
        error = null;
        var source = values ?? [];
        if (source.Length > MaximumProxyNetworks)
        {
            error = $"At most {MaximumProxyNetworks} trusted proxy networks may be configured.";
            return null;
        }

        var networks = new List<string>();
        foreach (var raw in source)
        {
            if (string.IsNullOrWhiteSpace(raw))
                continue;
            if (!TrustedProxyMatcher.TryNormalizeNetwork(raw, out var network))
            {
                error = "Every trusted proxy must be an IP address or CIDR.";
                return null;
            }
            if (!networks.Contains(network, StringComparer.Ordinal))
                networks.Add(network);
        }

        return [.. networks];
    }
}
