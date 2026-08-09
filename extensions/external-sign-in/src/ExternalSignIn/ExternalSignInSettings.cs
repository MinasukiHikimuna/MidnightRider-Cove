using System.Collections.ObjectModel;

namespace ExternalSignIn;

public sealed record OidcProviderSettings(
    string Id,
    bool Enabled,
    string ButtonLabel,
    string Issuer,
    string ClientId,
    string ClientSecret,
    string DisplayClaim,
    string[] Scopes)
{
    public bool IsReady(ExternalSignInSettings settings) => Enabled
        && Issuer.Length > 0
        && ClientId.Length > 0
        && ClientSecret.Length > 0
        && settings.CovePublicUrl.Length > 0
        && Scopes.Contains("openid", StringComparer.Ordinal);
}

public sealed record ExternalSignInSettings(
    string CovePublicUrl,
    bool AllowInsecureDevelopmentIssuer,
    OidcProviderSettings[] OidcProviders,
    bool TrustedHeaderEnabled,
    string TrustedHeaderProviderId,
    string TrustedHeaderLabel,
    string TrustedHeaderSubjectName,
    string TrustedHeaderDisplayName,
    string[] TrustedProxyCidrs)
{
    public static ExternalSignInSettings Default => new(
        CovePublicUrl: string.Empty,
        AllowInsecureDevelopmentIssuer: false,
        OidcProviders: [],
        TrustedHeaderEnabled: false,
        TrustedHeaderProviderId: string.Empty,
        TrustedHeaderLabel: "Trusted reverse proxy",
        TrustedHeaderSubjectName: "X-Authentik-Uid",
        TrustedHeaderDisplayName: "X-Authentik-Username",
        TrustedProxyCidrs: []);

    public bool TrustedHeaderReady => TrustedHeaderEnabled
        && TrustedHeaderProviderId.Length > 0
        && TrustedHeaderSubjectName.Length > 0
        && TrustedProxyCidrs.Length > 0;

    public OidcProviderSettings? FindOidcProvider(string? id) =>
        string.IsNullOrWhiteSpace(id)
            ? null
            : OidcProviders.FirstOrDefault(provider =>
                string.Equals(provider.Id, id, StringComparison.Ordinal));
}

public sealed record OidcProviderSettingsUpdate
{
    public string? Id { get; init; }
    public bool Enabled { get; init; }
    public string? ButtonLabel { get; init; }
    public string? Issuer { get; init; }
    public string? ClientId { get; init; }
    public string? ClientSecret { get; init; }
    public bool ClearClientSecret { get; init; }
    public string? DisplayClaim { get; init; }
    public string[]? Scopes { get; init; }
}

public sealed record ExternalSignInSettingsUpdate
{
    public string? CovePublicUrl { get; init; }
    public bool AllowInsecureDevelopmentIssuer { get; init; }
    public OidcProviderSettingsUpdate[]? OidcProviders { get; init; }
    public bool TrustedHeaderEnabled { get; init; }
    public string? TrustedHeaderProviderId { get; init; }
    public string? TrustedHeaderLabel { get; init; }
    public string? TrustedHeaderSubjectName { get; init; }
    public string? TrustedHeaderDisplayName { get; init; }
    public string[]? TrustedProxyCidrs { get; init; }
}

public sealed record OidcProviderSettingsResponse(
    string Id,
    bool Enabled,
    string ButtonLabel,
    string Issuer,
    string ClientId,
    bool ClientSecretConfigured,
    string DisplayClaim,
    string[] Scopes)
{
    public static OidcProviderSettingsResponse From(OidcProviderSettings settings) => new(
        settings.Id,
        settings.Enabled,
        settings.ButtonLabel,
        settings.Issuer,
        settings.ClientId,
        settings.ClientSecret.Length > 0,
        settings.DisplayClaim,
        [.. settings.Scopes]);
}

public sealed record ExternalSignInSettingsResponse(
    string CovePublicUrl,
    bool AllowInsecureDevelopmentIssuer,
    OidcProviderSettingsResponse[] OidcProviders,
    bool TrustedHeaderEnabled,
    string TrustedHeaderProviderId,
    string TrustedHeaderLabel,
    string TrustedHeaderSubjectName,
    string TrustedHeaderDisplayName,
    string[] TrustedProxyCidrs)
{
    public static ExternalSignInSettingsResponse From(ExternalSignInSettings settings) => new(
        settings.CovePublicUrl,
        settings.AllowInsecureDevelopmentIssuer,
        [.. settings.OidcProviders.Select(OidcProviderSettingsResponse.From)],
        settings.TrustedHeaderEnabled,
        settings.TrustedHeaderProviderId,
        settings.TrustedHeaderLabel,
        settings.TrustedHeaderSubjectName,
        settings.TrustedHeaderDisplayName,
        [.. settings.TrustedProxyCidrs]);
}

public sealed record ExternalSignInSettingsValidation(
    ExternalSignInSettings? Value,
    IReadOnlyDictionary<string, string[]> Errors)
{
    public bool IsValid => Value is not null && Errors.Count == 0;
}

public static class ExternalSignInSettingsValidator
{
    private const int MaximumOidcProviders = 16;
    private const int MaximumProxyNetworks = 64;

    public static ExternalSignInSettingsValidation ValidateUpdate(
        ExternalSignInSettingsUpdate request,
        ExternalSignInSettings current)
    {
        ArgumentNullException.ThrowIfNull(request);
        ArgumentNullException.ThrowIfNull(current);

        var errors = new Dictionary<string, string[]>(StringComparer.Ordinal);
        var allowInsecure = request.AllowInsecureDevelopmentIssuer;
        var covePublicUrl = NormalizePublicOrigin(
            request.CovePublicUrl ?? current.CovePublicUrl,
            allowInsecure,
            out var publicUrlError);
        if (publicUrlError is not null)
            errors["covePublicUrl"] = [publicUrlError];

        var providerRequests = request.OidcProviders
            ?? [.. current.OidcProviders.Select(ToUpdate)];
        if (providerRequests.Length > MaximumOidcProviders)
            errors["oidcProviders"] = [$"At most {MaximumOidcProviders} OIDC providers may be configured."];

        var providers = new List<OidcProviderSettings>();
        var ids = new HashSet<string>(StringComparer.Ordinal);
        var issuers = new HashSet<string>(StringComparer.Ordinal);
        for (var index = 0; index < providerRequests.Length && index < MaximumOidcProviders; index++)
        {
            var candidate = providerRequests[index] ?? new OidcProviderSettingsUpdate();
            var prefix = $"oidcProviders[{index}]";
            var id = string.IsNullOrWhiteSpace(candidate.Id)
                ? Guid.NewGuid().ToString("N")
                : NormalizeRouteId(candidate.Id);
            if (id is null)
            {
                errors[$"{prefix}.id"] = ["The provider ID is invalid."];
                continue;
            }
            if (!ids.Add(id))
            {
                errors[$"{prefix}.id"] = ["Provider IDs must be unique."];
                continue;
            }

            var existing = current.FindOidcProvider(id);
            var buttonLabel = NormalizeText(candidate.ButtonLabel ?? existing?.ButtonLabel, 80);
            if (buttonLabel is null)
                errors[$"{prefix}.buttonLabel"] = ["Enter a label of at most 80 characters."];

            var issuer = NormalizeIssuer(
                candidate.Issuer ?? existing?.Issuer,
                allowInsecure,
                out var issuerError);
            if (issuerError is not null)
                errors[$"{prefix}.issuer"] = [issuerError];
            if (existing is not null
                && existing.Issuer.Length > 0
                && issuer is not null
                && !string.Equals(existing.Issuer, issuer, StringComparison.Ordinal))
            {
                errors[$"{prefix}.issuer"] = ["The issuer is immutable; add a new provider instead."];
            }
            if (!string.IsNullOrEmpty(issuer) && !issuers.Add(issuer))
                errors[$"{prefix}.issuer"] = ["Each OIDC issuer may be configured only once."];

            var clientId = NormalizeText(candidate.ClientId ?? existing?.ClientId, 512, allowEmpty: true);
            if (clientId is null)
                errors[$"{prefix}.clientId"] = ["The client ID is too long or contains control characters."];

            var clientSecret = candidate.ClearClientSecret
                ? string.Empty
                : string.IsNullOrEmpty(candidate.ClientSecret)
                    ? existing?.ClientSecret ?? string.Empty
                    : candidate.ClientSecret;
            if (clientSecret.Length > 4096 || clientSecret.Any(char.IsControl))
                errors[$"{prefix}.clientSecret"] = ["The client secret is too long or contains control characters."];

            var displayClaim = NormalizeClaimName(candidate.DisplayClaim ?? existing?.DisplayClaim ?? "preferred_username");
            if (displayClaim is null)
                errors[$"{prefix}.displayClaim"] = ["Enter a claim name without whitespace or control characters."];

            var scopes = NormalizeScopes(candidate.Scopes ?? existing?.Scopes, out var scopesError);
            if (scopesError is not null)
                errors[$"{prefix}.scopes"] = [scopesError];

            if (candidate.Enabled)
            {
                if (string.IsNullOrEmpty(issuer))
                    errors.TryAdd($"{prefix}.issuer", ["The issuer is required when this provider is enabled."]);
                if (string.IsNullOrEmpty(clientId))
                    errors[$"{prefix}.clientId"] = ["The client ID is required when this provider is enabled."];
                if (string.IsNullOrEmpty(clientSecret))
                    errors[$"{prefix}.clientSecret"] = ["The client secret is required when this provider is enabled."];
                if (string.IsNullOrEmpty(covePublicUrl))
                    errors.TryAdd("covePublicUrl", ["The Cove public URL is required when OIDC is enabled."]);
                if (scopes is not null && !scopes.Contains("openid", StringComparer.Ordinal))
                    errors[$"{prefix}.scopes"] = ["OIDC scopes must include openid."];
            }

            if (buttonLabel is not null
                && issuer is not null
                && clientId is not null
                && displayClaim is not null
                && scopes is not null)
            {
                providers.Add(new OidcProviderSettings(
                    id,
                    candidate.Enabled,
                    buttonLabel,
                    issuer,
                    clientId,
                    clientSecret,
                    displayClaim,
                    scopes));
            }
        }

        var trustedHeaderProviderId = request.TrustedHeaderProviderId ?? current.TrustedHeaderProviderId;
        if (string.IsNullOrWhiteSpace(trustedHeaderProviderId) && request.TrustedHeaderEnabled)
            trustedHeaderProviderId = $"trusted-header-{Guid.NewGuid():N}";
        trustedHeaderProviderId = NormalizeText(trustedHeaderProviderId, 256, allowEmpty: true);
        if (trustedHeaderProviderId is null)
            errors["trustedHeaderProviderId"] = ["The trusted-header authority ID is invalid."];
        var trustedHeaderLabel = NormalizeText(
            request.TrustedHeaderLabel ?? current.TrustedHeaderLabel,
            80);
        if (trustedHeaderLabel is null)
            errors["trustedHeaderLabel"] = ["Enter a provider label of at most 80 characters."];

        var trustedHeaderSubjectName = NormalizeHeaderName(
            request.TrustedHeaderSubjectName ?? current.TrustedHeaderSubjectName,
            allowEmpty: !request.TrustedHeaderEnabled);
        if (trustedHeaderSubjectName is null)
            errors["trustedHeaderSubjectName"] = ["Enter a valid stable-subject HTTP header name."];

        var trustedHeaderDisplayName = NormalizeHeaderName(
            request.TrustedHeaderDisplayName ?? current.TrustedHeaderDisplayName,
            allowEmpty: true);
        if (trustedHeaderDisplayName is null)
            errors["trustedHeaderDisplayName"] = ["Enter a valid display-name HTTP header name or leave it blank."];

        var trustedProxyCidrs = NormalizeProxyNetworks(
            request.TrustedProxyCidrs ?? current.TrustedProxyCidrs,
            out var proxyError);
        if (proxyError is not null)
            errors["trustedProxyCidrs"] = [proxyError];

        if (request.TrustedHeaderEnabled)
        {
            if (string.IsNullOrEmpty(trustedHeaderProviderId))
                errors["trustedHeaderProviderId"] = ["A stable authority ID is required."];
            if (string.IsNullOrEmpty(trustedHeaderSubjectName))
                errors["trustedHeaderSubjectName"] = ["A stable-subject header is required."];
            if (trustedProxyCidrs is null || trustedProxyCidrs.Length == 0)
                errors["trustedProxyCidrs"] = ["At least one trusted direct-proxy IP or CIDR is required."];
        }

        if (errors.Count > 0)
            return new(null, new ReadOnlyDictionary<string, string[]>(errors));

        return new(
            new ExternalSignInSettings(
                covePublicUrl!,
                allowInsecure,
                [.. providers],
                request.TrustedHeaderEnabled,
                trustedHeaderProviderId!,
                trustedHeaderLabel!,
                trustedHeaderSubjectName!,
                trustedHeaderDisplayName!,
                trustedProxyCidrs!),
            new ReadOnlyDictionary<string, string[]>(errors));
    }

    public static ExternalSignInSettingsUpdate ToUpdate(ExternalSignInSettings settings) => new()
    {
        CovePublicUrl = settings.CovePublicUrl,
        AllowInsecureDevelopmentIssuer = settings.AllowInsecureDevelopmentIssuer,
        OidcProviders = [.. settings.OidcProviders.Select(ToUpdate)],
        TrustedHeaderEnabled = settings.TrustedHeaderEnabled,
        TrustedHeaderProviderId = settings.TrustedHeaderProviderId,
        TrustedHeaderLabel = settings.TrustedHeaderLabel,
        TrustedHeaderSubjectName = settings.TrustedHeaderSubjectName,
        TrustedHeaderDisplayName = settings.TrustedHeaderDisplayName,
        TrustedProxyCidrs = [.. settings.TrustedProxyCidrs],
    };

    private static OidcProviderSettingsUpdate ToUpdate(OidcProviderSettings provider) => new()
    {
        Id = provider.Id,
        Enabled = provider.Enabled,
        ButtonLabel = provider.ButtonLabel,
        Issuer = provider.Issuer,
        ClientId = provider.ClientId,
        ClientSecret = provider.ClientSecret,
        DisplayClaim = provider.DisplayClaim,
        Scopes = [.. provider.Scopes],
    };

    private static string? NormalizeRouteId(string? value)
    {
        var normalized = value?.Trim();
        return normalized is { Length: > 0 and <= 64 }
               && normalized.All(character => char.IsAsciiLetterOrDigit(character) || character is '-' or '_')
            ? normalized
            : null;
    }

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

    private static string? NormalizeClaimName(string? value)
    {
        var normalized = NormalizeText(value, 128);
        return normalized is not null && !normalized.Any(char.IsWhiteSpace)
            ? normalized
            : null;
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
        return text;
    }

    private static string? NormalizePublicOrigin(string? value, bool allowHttp, out string? error)
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
        var scopes = new List<string>();
        foreach (var raw in values ?? ["openid", "profile", "email"])
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

    private static string? NormalizeHeaderName(string? value, bool allowEmpty)
    {
        var header = value?.Trim() ?? string.Empty;
        if (allowEmpty && header.Length == 0)
            return string.Empty;
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
