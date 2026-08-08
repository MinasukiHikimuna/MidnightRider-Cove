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
    private const string ClientSecretKey = "oidc-client-secret";
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
            var secret = await store.GetAsync(ClientSecretKey, ct) ?? string.Empty;
            var persisted = Deserialize(publicJson) ?? PersistedSettings.From(AuthMiddlewareSettings.Default);
            var candidate = persisted.ToSettings(secret);
            var validation = AuthMiddlewareSettingsValidator.ValidateUpdate(
                AuthMiddlewareSettingsValidator.ToUpdate(candidate),
                candidate);
            Volatile.Write(ref _current, validation.Value ?? AuthMiddlewareSettings.Default);
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
            var validation = AuthMiddlewareSettingsValidator.ValidateUpdate(request, Current);
            if (!validation.IsValid)
                return validation;

            var next = validation.Value!;
            var store = storeFactory();
            if (next.OidcClientSecret.Length == 0)
                await store.DeleteAsync(ClientSecretKey, ct);
            else
                await store.SetAsync(ClientSecretKey, next.OidcClientSecret, ct);

            await store.SetAsync(
                SettingsKey,
                JsonSerializer.Serialize(PersistedSettings.From(next), JsonOptions),
                ct);
            Volatile.Write(ref _current, next);
            return validation;
        }
        finally
        {
            _gate.Release();
        }
    }

    private static PersistedSettings? Deserialize(string? json)
    {
        if (string.IsNullOrWhiteSpace(json))
            return null;
        try
        {
            return JsonSerializer.Deserialize<PersistedSettings>(json, JsonOptions);
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private sealed record PersistedSettings(
        bool OidcEnabled,
        string OidcButtonLabel,
        string OidcIssuer,
        string OidcClientId,
        string CovePublicUrl,
        string UsernameClaim,
        string[] Scopes,
        bool AllowInsecureDevelopmentIssuer,
        bool TrustedHeaderEnabled,
        string TrustedHeaderName,
        string[] TrustedProxyCidrs)
    {
        public static PersistedSettings From(AuthMiddlewareSettings settings) => new(
            settings.OidcEnabled,
            settings.OidcButtonLabel,
            settings.OidcIssuer,
            settings.OidcClientId,
            settings.CovePublicUrl,
            settings.UsernameClaim,
            [.. settings.Scopes],
            settings.AllowInsecureDevelopmentIssuer,
            settings.TrustedHeaderEnabled,
            settings.TrustedHeaderName,
            [.. settings.TrustedProxyCidrs]);

        public AuthMiddlewareSettings ToSettings(string clientSecret) => new(
            OidcEnabled,
            OidcButtonLabel,
            OidcIssuer,
            OidcClientId,
            clientSecret,
            CovePublicUrl,
            UsernameClaim,
            Scopes ?? [],
            AllowInsecureDevelopmentIssuer,
            TrustedHeaderEnabled,
            TrustedHeaderName,
            TrustedProxyCidrs ?? []);
    }
}
