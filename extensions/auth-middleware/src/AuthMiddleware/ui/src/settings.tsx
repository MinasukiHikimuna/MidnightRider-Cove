import { useEffect, useState } from "react";
import {
  authMiddlewareApi,
  DEFAULT_SETTINGS,
  type AuthMiddlewareSettings as Settings,
  type AuthMiddlewareSettingsUpdate,
} from "./api";

function splitValues(value: string): string[] {
  return value
    .split(/[\s,]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

export function AuthMiddlewareSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [clientSecret, setClientSecret] = useState("");
  const [clearClientSecret, setClearClientSecret] = useState(false);
  const [scopes, setScopes] = useState(DEFAULT_SETTINGS.scopes.join(" "));
  const [trustedProxies, setTrustedProxies] = useState("");
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState("Loading authentication settings…");

  useEffect(() => {
    let active = true;
    authMiddlewareApi.getSettings()
      .then(value => {
        if (!active) return;
        setSettings(value);
        setScopes(value.scopes.join(" "));
        setTrustedProxies(value.trustedProxyCidrs.join("\n"));
        setStatus("");
      })
      .catch(reason => {
        if (active) setStatus(reason instanceof Error ? reason.message : "Could not load authentication settings.");
      })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, []);

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) =>
    setSettings(current => ({ ...current, [key]: value }));

  const payload = (): AuthMiddlewareSettingsUpdate => ({
    oidcEnabled: settings.oidcEnabled,
    oidcButtonLabel: settings.oidcButtonLabel,
    oidcIssuer: settings.oidcIssuer,
    oidcClientId: settings.oidcClientId,
    ...(clientSecret ? { oidcClientSecret: clientSecret } : {}),
    clearOidcClientSecret: clearClientSecret,
    covePublicUrl: settings.covePublicUrl,
    usernameClaim: settings.usernameClaim,
    scopes: splitValues(scopes),
    allowInsecureDevelopmentIssuer: settings.allowInsecureDevelopmentIssuer,
    trustedHeaderEnabled: settings.trustedHeaderEnabled,
    trustedHeaderName: settings.trustedHeaderName,
    trustedProxyCidrs: splitValues(trustedProxies),
  });

  const save = async () => {
    setBusy(true);
    setStatus("Saving authentication settings…");
    try {
      const saved = await authMiddlewareApi.saveSettings(payload());
      setSettings(saved);
      setScopes(saved.scopes.join(" "));
      setTrustedProxies(saved.trustedProxyCidrs.join("\n"));
      setClientSecret("");
      setClearClientSecret(false);
      setStatus("Settings saved. Reload the sign-in page to verify the available login methods.");
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : "Could not save authentication settings.");
    } finally {
      setBusy(false);
    }
  };

  const testOidc = async () => {
    setBusy(true);
    setStatus("Checking OIDC discovery and signing keys…");
    try {
      await authMiddlewareApi.testOidc();
      setStatus("OIDC discovery and signing keys are reachable.");
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : "OIDC discovery failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="authmw-settings" aria-labelledby="authmw-title">
      <header>
        <h3 id="authmw-title">Authentication middleware</h3>
        <p>
          External identities must match an existing active Cove username. Cove keeps ownership of
          account status, roles, permissions, sessions, and audit events.
        </p>
      </header>

      <fieldset disabled={busy}>
        <legend>OpenID Connect</legend>
        <label className="authmw-check">
          <input
            type="checkbox"
            checked={settings.oidcEnabled}
            onChange={event => update("oidcEnabled", event.target.checked)}
          />
          Enable OpenID Connect login
        </label>
        <div className="authmw-grid">
          <label>
            Login button label
            <input value={settings.oidcButtonLabel} onChange={event => update("oidcButtonLabel", event.target.value)} />
          </label>
          <label>
            Issuer
            <input
              type="url"
              placeholder="https://identity.example/application/o/cove/"
              value={settings.oidcIssuer}
              onChange={event => update("oidcIssuer", event.target.value)}
            />
          </label>
          <label>
            Client ID
            <input value={settings.oidcClientId} onChange={event => update("oidcClientId", event.target.value)} />
          </label>
          <label>
            Client secret
            <input
              type="password"
              autoComplete="new-password"
              value={clientSecret}
              placeholder={settings.oidcClientSecretConfigured ? "Configured; leave blank to keep" : "Required when OIDC is enabled"}
              onChange={event => {
                setClientSecret(event.target.value);
                if (event.target.value) setClearClientSecret(false);
              }}
            />
          </label>
          <label>
            Cove public URL
            <input
              type="url"
              placeholder="https://cove.example"
              value={settings.covePublicUrl}
              onChange={event => update("covePublicUrl", event.target.value)}
            />
          </label>
          <label>
            Username claim
            <input value={settings.usernameClaim} onChange={event => update("usernameClaim", event.target.value)} />
          </label>
          <label className="authmw-wide">
            Scopes
            <input value={scopes} onChange={event => setScopes(event.target.value)} />
          </label>
        </div>
        {settings.oidcClientSecretConfigured ? (
          <label className="authmw-check">
            <input
              type="checkbox"
              checked={clearClientSecret}
              onChange={event => {
                setClearClientSecret(event.target.checked);
                if (event.target.checked) setClientSecret("");
              }}
            />
            Clear the stored client secret when saving
          </label>
        ) : null}
        <label className="authmw-check authmw-warning">
          <input
            type="checkbox"
            checked={settings.allowInsecureDevelopmentIssuer}
            onChange={event => update("allowInsecureDevelopmentIssuer", event.target.checked)}
          />
          Allow an HTTP issuer and Cove URL for isolated development only
        </label>
        <p className="authmw-help">
          Callback: <code>/api/plugins/com.midnightrider.auth-middleware/oidc/callback</code>
        </p>
      </fieldset>

      <fieldset disabled={busy}>
        <legend>Trusted reverse-proxy header</legend>
        <label className="authmw-check">
          <input
            type="checkbox"
            checked={settings.trustedHeaderEnabled}
            onChange={event => update("trustedHeaderEnabled", event.target.checked)}
          />
          Enable trusted-header authentication
        </label>
        <div className="authmw-grid">
          <label>
            Username header
            <input value={settings.trustedHeaderName} onChange={event => update("trustedHeaderName", event.target.value)} />
          </label>
          <label className="authmw-wide">
            Trusted direct-proxy IPs or CIDRs
            <textarea
              rows={4}
              placeholder={"192.0.2.10/32\n2001:db8::10/128"}
              value={trustedProxies}
              onChange={event => setTrustedProxies(event.target.value)}
            />
          </label>
        </div>
        <p className="authmw-help authmw-warning">
          Trust the narrowest direct peer range. The extension deliberately ignores forwarded-address
          headers when deciding whether the identity header is trusted.
        </p>
      </fieldset>

      <div className="authmw-actions">
        <button type="button" onClick={() => void save()} disabled={busy}>Save settings</button>
        <button
          type="button"
          onClick={() => void testOidc()}
          disabled={busy || !settings.oidcClientSecretConfigured}
        >
          Test saved OIDC configuration
        </button>
      </div>
      <p className="authmw-status" role="status" aria-live="polite">{status}</p>
    </section>
  );
}
