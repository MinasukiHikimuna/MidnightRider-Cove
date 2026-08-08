using System.Text.Json;
using Cove.Plugins;

namespace AuthMiddleware;

public interface IAuthMiddlewareSettingsStore : IAuthMiddlewareSettingsProvider
{
    Task LoadAsync(CancellationToken ct = default);
    Task<AuthMiddlewareSettingsValidation> UpdateAsync(
        AuthMiddlewareSettingsUpdate request,
        CancellationToken ct = default);
}

internal sealed class AuthMiddlewareSettingsStore(Func<IExtensionStore> storeFactory)
    : IAuthMiddlewareSettingsStore
{
    private const string SettingsKey = "settings";
    private const string LegacyClientSecretKey = "oidc-client-secret";
    private const string ClientSecretKeyPrefix = "oidc-client-secret:";
    private const string LegacyProviderId = "legacy-oidc";
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    private readonly SemaphoreSlim _gate = new(1, 1);
    private AuthMiddlewareSettings _current = AuthMiddlewareSettings.Default;

    public AuthMiddlewareSettings Current => Volatile.Read(ref _current);

    public async Task LoadAsync(CancellationToken ct = default)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var store = storeFactory();
            var publicJson = await store.GetAsync(SettingsKey, ct);
            if (string.IsNullOrWhiteSpace(publicJson))
            {
                Volatile.Write(ref _current, AuthMiddlewareSettings.Default);
                return;
            }

            var persisted = DeserializeCurrent(publicJson);
            if (persisted is not null)
            {
                var candidate = await persisted.ToSettingsAsync(store, ct);
                Volatile.Write(ref _current, ValidatePersisted(candidate));
                return;
            }

            var legacy = DeserializeLegacy(publicJson);
            if (legacy is null)
            {
                Volatile.Write(ref _current, AuthMiddlewareSettings.Default);
                return;
            }

            var legacySecret = await store.GetAsync(LegacyClientSecretKey, ct) ?? string.Empty;
            var legacyCandidate = legacy.ToSettings(legacySecret);
            var legacyValidation = AuthMiddlewareSettingsValidator.ValidateUpdate(
                AuthMiddlewareSettingsValidator.ToUpdate(legacyCandidate),
                legacyCandidate);
            var migrated = legacyValidation.Value ?? AuthMiddlewareSettings.Default;
            Volatile.Write(ref _current, migrated);
            if (legacyValidation.IsValid)
                await PersistAsync(store, migrated, [], deleteLegacySecret: true, ct);
        }
        finally
        {
            _gate.Release();
        }
    }

    public async Task<AuthMiddlewareSettingsValidation> UpdateAsync(
        AuthMiddlewareSettingsUpdate request,
        CancellationToken ct = default)
    {
        await _gate.WaitAsync(ct);
        try
        {
            var current = Current;
            var validation = AuthMiddlewareSettingsValidator.ValidateUpdate(request, current);
            if (!validation.IsValid)
                return validation;

            var next = validation.Value!;
            await PersistAsync(storeFactory(), next, current.OidcProviders, deleteLegacySecret: true, ct);
            Volatile.Write(ref _current, next);
            return validation;
        }
        finally
        {
            _gate.Release();
        }
    }

    private static async Task PersistAsync(
        IExtensionStore store,
        AuthMiddlewareSettings settings,
        IReadOnlyCollection<OidcProviderSettings> previousProviders,
        bool deleteLegacySecret,
        CancellationToken ct)
    {
        // Write active secrets before publishing settings that refer to them. Clearing a secret is
        // fail-closed if interrupted; removed-provider secrets are deleted only after publication.
        foreach (var provider in settings.OidcProviders)
        {
            if (provider.ClientSecret.Length == 0)
                await store.DeleteAsync(SecretKey(provider.Id), ct);
            else
                await store.SetAsync(SecretKey(provider.Id), provider.ClientSecret, ct);
        }

        await store.SetAsync(
            SettingsKey,
            JsonSerializer.Serialize(PersistedSettings.From(settings), JsonOptions),
            ct);

        var retained = settings.OidcProviders.Select(provider => provider.Id).ToHashSet(StringComparer.Ordinal);
        foreach (var removed in previousProviders.Where(provider => !retained.Contains(provider.Id)))
            await store.DeleteAsync(SecretKey(removed.Id), ct);
        if (deleteLegacySecret)
            await store.DeleteAsync(LegacyClientSecretKey, ct);
    }

    private static AuthMiddlewareSettings ValidatePersisted(AuthMiddlewareSettings candidate)
    {
        var validation = AuthMiddlewareSettingsValidator.ValidateUpdate(
            AuthMiddlewareSettingsValidator.ToUpdate(candidate),
            candidate);
        return validation.Value ?? AuthMiddlewareSettings.Default;
    }

    private static PersistedSettings? DeserializeCurrent(string json)
    {
        try
        {
            using var document = JsonDocument.Parse(json);
            if (!document.RootElement.TryGetProperty("version", out var version)
                || version.ValueKind != JsonValueKind.Number
                || !version.TryGetInt32(out var value)
                || value != 2)
            {
                return null;
            }
            return JsonSerializer.Deserialize<PersistedSettings>(json, JsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static LegacyPersistedSettings? DeserializeLegacy(string json)
    {
        try
        {
            return JsonSerializer.Deserialize<LegacyPersistedSettings>(json, JsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private static string SecretKey(string providerId) => ClientSecretKeyPrefix + providerId;

    private sealed record PersistedSettings(
        int Version,
        string CovePublicUrl,
        bool AllowInsecureDevelopmentIssuer,
        PersistedOidcProvider[] OidcProviders,
        bool TrustedHeaderEnabled,
        string TrustedHeaderProviderId,
        string TrustedHeaderLabel,
        string TrustedHeaderSubjectName,
        string TrustedHeaderDisplayName,
        string[] TrustedProxyCidrs)
    {
        public static PersistedSettings From(AuthMiddlewareSettings settings) => new(
            2,
            settings.CovePublicUrl,
            settings.AllowInsecureDevelopmentIssuer,
            [.. settings.OidcProviders.Select(PersistedOidcProvider.From)],
            settings.TrustedHeaderEnabled,
            settings.TrustedHeaderProviderId,
            settings.TrustedHeaderLabel,
            settings.TrustedHeaderSubjectName,
            settings.TrustedHeaderDisplayName,
            [.. settings.TrustedProxyCidrs]);

        public async Task<AuthMiddlewareSettings> ToSettingsAsync(
            IExtensionStore store,
            CancellationToken ct)
        {
            var providers = new List<OidcProviderSettings>();
            foreach (var provider in OidcProviders ?? [])
            {
                var secret = await store.GetAsync(SecretKey(provider.Id), ct) ?? string.Empty;
                providers.Add(provider.ToSettings(secret));
            }
            return new AuthMiddlewareSettings(
                CovePublicUrl ?? string.Empty,
                AllowInsecureDevelopmentIssuer,
                [.. providers],
                TrustedHeaderEnabled,
                TrustedHeaderProviderId ?? string.Empty,
                TrustedHeaderLabel ?? string.Empty,
                TrustedHeaderSubjectName ?? string.Empty,
                TrustedHeaderDisplayName ?? string.Empty,
                TrustedProxyCidrs: TrustedProxyCidrs ?? []);
        }
    }

    private sealed record PersistedOidcProvider(
        string Id,
        bool Enabled,
        string ButtonLabel,
        string Issuer,
        string ClientId,
        string DisplayClaim,
        string[] Scopes)
    {
        public static PersistedOidcProvider From(OidcProviderSettings settings) => new(
            settings.Id,
            settings.Enabled,
            settings.ButtonLabel,
            settings.Issuer,
            settings.ClientId,
            settings.DisplayClaim,
            [.. settings.Scopes]);

        public OidcProviderSettings ToSettings(string secret) => new(
            Id ?? string.Empty,
            Enabled,
            ButtonLabel ?? string.Empty,
            Issuer ?? string.Empty,
            ClientId ?? string.Empty,
            secret,
            DisplayClaim ?? string.Empty,
            Scopes ?? []);
    }

    private sealed record LegacyPersistedSettings(
        bool OidcEnabled,
        string? OidcButtonLabel,
        string? OidcIssuer,
        string? OidcClientId,
        string? CovePublicUrl,
        string? UsernameClaim,
        string[]? Scopes,
        bool AllowInsecureDevelopmentIssuer,
        bool TrustedHeaderEnabled,
        string? TrustedHeaderName,
        string[]? TrustedProxyCidrs)
    {
        public AuthMiddlewareSettings ToSettings(string clientSecret)
        {
            var hasOidc = OidcEnabled
                || !string.IsNullOrWhiteSpace(OidcIssuer)
                || !string.IsNullOrWhiteSpace(OidcClientId)
                || clientSecret.Length > 0;
            var providers = hasOidc
                ? new[]
                {
                    new OidcProviderSettings(
                        LegacyProviderId,
                        OidcEnabled,
                        OidcButtonLabel ?? "Sign in with OpenID Connect",
                        OidcIssuer ?? string.Empty,
                        OidcClientId ?? string.Empty,
                        clientSecret,
                        UsernameClaim ?? "preferred_username",
                        Scopes ?? ["openid", "profile", "email"]),
                }
                : [];

            // The legacy header was documented as a username, not a stable authority subject. Keep
            // it as display metadata but require an administrator to review and re-enable this mode.
            return new AuthMiddlewareSettings(
                CovePublicUrl ?? string.Empty,
                AllowInsecureDevelopmentIssuer,
                providers,
                TrustedHeaderEnabled: false,
                TrustedHeaderProviderId: string.Empty,
                TrustedHeaderLabel: "Trusted reverse proxy",
                TrustedHeaderSubjectName: "X-Authentik-Uid",
                TrustedHeaderDisplayName: TrustedHeaderName ?? "X-Authentik-Username",
                TrustedProxyCidrs ?? []);
        }
    }
}
