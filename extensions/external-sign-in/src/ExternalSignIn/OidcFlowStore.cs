using System.Security.Cryptography;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace ExternalSignIn;

public enum OidcFlowPurpose
{
    Login,
    Link,
}

public sealed record OidcLoginFlow(
    string State,
    string Nonce,
    string CodeVerifier,
    string CodeChallenge,
    string BrowserBinding,
    string? ReturnUrl,
    ExternalSignInSettings Settings,
    OidcProviderSettings OidcProvider,
    OidcProviderConfiguration Provider,
    OidcFlowPurpose Purpose,
    string? LinkIntentToken,
    DateTimeOffset CreatedAt);

public sealed class OidcFlowStore(TimeProvider timeProvider)
{
    private const int MaximumFlows = 2048;
    private static readonly TimeSpan FlowLifetime = TimeSpan.FromMinutes(10);
    private readonly object _gate = new();
    private readonly Dictionary<string, OidcLoginFlow> _flows = new(StringComparer.Ordinal);

    public OidcLoginFlow Create(
        ExternalSignInSettings settings,
        OidcProviderSettings oidcProvider,
        OidcProviderConfiguration provider,
        string browserBinding,
        string? returnUrl,
        OidcFlowPurpose purpose = OidcFlowPurpose.Login,
        string? linkIntentToken = null)
    {
        ArgumentNullException.ThrowIfNull(settings);
        ArgumentNullException.ThrowIfNull(oidcProvider);
        ArgumentNullException.ThrowIfNull(provider);
        if (string.IsNullOrWhiteSpace(browserBinding))
            throw new ArgumentException("A browser binding is required.", nameof(browserBinding));
        if (purpose == OidcFlowPurpose.Link && string.IsNullOrWhiteSpace(linkIntentToken))
            throw new ArgumentException("A link intent is required for a link flow.", nameof(linkIntentToken));

        var verifier = RandomToken(64);
        var challenge = Base64UrlEncoder.Encode(SHA256.HashData(Encoding.ASCII.GetBytes(verifier)));
        var flow = new OidcLoginFlow(
            RandomToken(32),
            RandomToken(32),
            verifier,
            challenge,
            browserBinding,
            returnUrl,
            settings,
            oidcProvider,
            provider,
            purpose,
            linkIntentToken,
            timeProvider.GetUtcNow());

        lock (_gate)
        {
            SweepExpired(flow.CreatedAt);
            if (_flows.Count >= MaximumFlows)
            {
                var oldest = _flows.MinBy(entry => entry.Value.CreatedAt);
                _flows.Remove(oldest.Key);
            }
            _flows[flow.State] = flow;
        }
        return flow;
    }

    public OidcLoginFlow? TryGet(string? state)
    {
        if (!IsValidState(state))
            return null;
        lock (_gate)
        {
            SweepExpired(timeProvider.GetUtcNow());
            return _flows.GetValueOrDefault(state!);
        }
    }

    public OidcLoginFlow? TryTake(string? state, OidcLoginFlow expected)
    {
        ArgumentNullException.ThrowIfNull(expected);
        if (!IsValidState(state))
            return null;
        lock (_gate)
        {
            SweepExpired(timeProvider.GetUtcNow());
            if (!_flows.TryGetValue(state!, out var current) || !ReferenceEquals(current, expected))
                return null;
            _flows.Remove(state!);
            return current;
        }
    }

    private void SweepExpired(DateTimeOffset now)
    {
        foreach (var state in _flows
                     .Where(entry => now - entry.Value.CreatedAt >= FlowLifetime)
                     .Select(entry => entry.Key)
                     .ToArray())
        {
            _flows.Remove(state);
        }
    }

    private static bool IsValidState(string? value) =>
        !string.IsNullOrWhiteSpace(value)
        && value.Length <= 256
        && !value.Any(char.IsControl);

    private static string RandomToken(int byteCount) =>
        Base64UrlEncoder.Encode(RandomNumberGenerator.GetBytes(byteCount));
}
