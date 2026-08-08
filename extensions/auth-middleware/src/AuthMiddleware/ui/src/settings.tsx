import { useEffect, useState } from "react";
import {
  authMiddlewareApi,
  DEFAULT_SETTINGS,
  type AuthMiddlewareSettings as Settings,
  type AuthMiddlewareSettingsUpdate,
  type OidcProviderSettings,
} from "./api";

function splitValues(value: string): string[] {
  return value.split(/[\s,]+/).map(item => item.trim()).filter(Boolean);
}

type DraftProvider = OidcProviderSettings & {
  draftKey: string;
  scopesText: string;
};

let nextDraftId = 1;

function toDraft(provider: OidcProviderSettings): DraftProvider {
  return {
    ...provider,
    draftKey: provider.id || `new-${nextDraftId++}`,
    scopesText: provider.scopes.join(" "),
  };
}

function newProvider(): DraftProvider {
  return toDraft({
    id: "",
    enabled: false,
    buttonLabel: "Sign in with OpenID Connect",
    issuer: "",
    clientId: "",
    clientSecretConfigured: false,
    displayClaim: "preferred_username",
    scopes: ["openid", "profile", "email"],
  });
}

export function AuthMiddlewareSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [providers, setProviders] = useState<DraftProvider[]>([]);
  const [clientSecrets, setClientSecrets] = useState<Record<string, string>>({});
  const [clearedSecrets, setClearedSecrets] = useState<Set<string>>(new Set());
  const [trustedProxies, setTrustedProxies] = useState("");
  const [busy, setBusy] = useState(true);
  const [status, setStatus] = useState("Loading authentication settings…");

  const applySettings = (value: Settings) => {
    setSettings(value);
    setProviders(value.oidcProviders.map(toDraft));
    setTrustedProxies(value.trustedProxyCidrs.join("\n"));
  };

  useEffect(() => {
    let active = true;
    authMiddlewareApi.getSettings()
      .then(value => {
        if (!active) return;
        applySettings(value);
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

  const updateProvider = <K extends keyof DraftProvider>(draftKey: string, key: K, value: DraftProvider[K]) =>
    setProviders(current => current.map(provider =>
      provider.draftKey === draftKey ? { ...provider, [key]: value } : provider));

  const payload = (): AuthMiddlewareSettingsUpdate => ({
    covePublicUrl: settings.covePublicUrl,
    allowInsecureDevelopmentIssuer: settings.allowInsecureDevelopmentIssuer,
    oidcProviders: providers.map(provider => ({
      ...(provider.id ? { id: provider.id } : {}),
      enabled: provider.enabled,
      buttonLabel: provider.buttonLabel,
      issuer: provider.issuer,
      clientId: provider.clientId,
      ...(clientSecrets[provider.draftKey] ? { clientSecret: clientSecrets[provider.draftKey] } : {}),
      clearClientSecret: clearedSecrets.has(provider.draftKey),
      displayClaim: provider.displayClaim,
      scopes: splitValues(provider.scopesText),
    })),
    trustedHeaderEnabled: settings.trustedHeaderEnabled,
    trustedHeaderProviderId: settings.trustedHeaderProviderId,
    trustedHeaderLabel: settings.trustedHeaderLabel,
    trustedHeaderSubjectName: settings.trustedHeaderSubjectName,
    trustedHeaderDisplayName: settings.trustedHeaderDisplayName,
    trustedProxyCidrs: splitValues(trustedProxies),
  });

  const save = async () => {
    setBusy(true);
    setStatus("Saving authentication settings…");
    try {
      const saved = await authMiddlewareApi.saveSettings(payload());
      applySettings(saved);
      setClientSecrets({});
      setClearedSecrets(new Set());
      setStatus("Settings saved. Existing identities remain linked by immutable provider authority and subject.");
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : "Could not save authentication settings.");
    } finally {
      setBusy(false);
    }
  };

  const testOidc = async (provider: DraftProvider) => {
    if (!provider.id) return;
    setBusy(true);
    setStatus(`Checking ${provider.buttonLabel} discovery and signing keys…`);
    try {
      await authMiddlewareApi.testOidc(provider.id);
      setStatus(`${provider.buttonLabel} discovery and signing keys are reachable.`);
    } catch (reason) {
      setStatus(reason instanceof Error ? reason.message : "OIDC discovery failed.");
    } finally {
      setBusy(false);
    }
  };

  const removeProvider = (provider: DraftProvider) => {
    setProviders(current => current.filter(candidate => candidate.draftKey !== provider.draftKey));
    setStatus(provider.id
      ? "Save to delete this provider. Deletion is blocked while any Cove user remains linked; disable it first if needed."
      : "Unsaved provider removed.");
  };

  return (
    <section className="authmw-settings" aria-labelledby="authmw-title">
      <header>
        <h3 id="authmw-title">Authentication middleware</h3>
        <p>
          Link each external identity explicitly to a Cove user. Provider names and email claims are
          display-only; authentication uses the provider authority and its exact stable subject.
        </p>
      </header>

      <fieldset disabled={busy}>
        <legend>Shared OpenID Connect settings</legend>
        <div className="authmw-grid">
          <label>
            Cove public URL
            <input
              type="url"
              placeholder="https://cove.example"
              value={settings.covePublicUrl}
              onChange={event => update("covePublicUrl", event.target.value)}
            />
          </label>
        </div>
        <label className="authmw-check authmw-warning">
          <input
            type="checkbox"
            checked={settings.allowInsecureDevelopmentIssuer}
            onChange={event => update("allowInsecureDevelopmentIssuer", event.target.checked)}
          />
          Allow HTTP issuers and a Cove HTTP URL for isolated development only
        </label>
        <p className="authmw-help">
          Callback for every provider: <code>/api/plugins/com.midnightrider.auth-middleware/oidc/callback</code>
        </p>
      </fieldset>

      <div className="authmw-provider-heading">
        <h4>OpenID Connect providers</h4>
        <button type="button" onClick={() => setProviders(current => [...current, newProvider()])} disabled={busy}>
          Add provider
        </button>
      </div>

      {providers.length === 0 ? <p className="authmw-help">No OIDC providers are configured.</p> : null}
      {providers.map((provider, index) => (
        <fieldset key={provider.draftKey} disabled={busy}>
          <legend>{provider.buttonLabel || `OIDC provider ${index + 1}`}</legend>
          <label className="authmw-check">
            <input
              type="checkbox"
              checked={provider.enabled}
              onChange={event => updateProvider(provider.draftKey, "enabled", event.target.checked)}
            />
            Enable this provider for login and account linking
          </label>
          <div className="authmw-grid">
            <label>
              Login button label
              <input value={provider.buttonLabel} onChange={event => updateProvider(provider.draftKey, "buttonLabel", event.target.value)} />
            </label>
            <label>
              Issuer {provider.id ? <span className="authmw-muted">(immutable)</span> : null}
              <input
                type="url"
                placeholder="https://identity.example/application/o/cove/"
                value={provider.issuer}
                readOnly={!!provider.id}
                onChange={event => updateProvider(provider.draftKey, "issuer", event.target.value)}
              />
            </label>
            <label>
              Client ID
              <input value={provider.clientId} onChange={event => updateProvider(provider.draftKey, "clientId", event.target.value)} />
            </label>
            <label>
              Client secret
              <input
                type="password"
                autoComplete="new-password"
                value={clientSecrets[provider.draftKey] ?? ""}
                placeholder={provider.clientSecretConfigured ? "Configured; leave blank to keep" : "Required when enabled"}
                onChange={event => {
                  setClientSecrets(current => ({ ...current, [provider.draftKey]: event.target.value }));
                  if (event.target.value) {
                    setClearedSecrets(current => {
                      const next = new Set(current);
                      next.delete(provider.draftKey);
                      return next;
                    });
                  }
                }}
              />
            </label>
            <label>
              Display claim
              <input value={provider.displayClaim} onChange={event => updateProvider(provider.draftKey, "displayClaim", event.target.value)} />
            </label>
            <label className="authmw-wide">
              Scopes
              <input value={provider.scopesText} onChange={event => updateProvider(provider.draftKey, "scopesText", event.target.value)} />
            </label>
          </div>
          {provider.clientSecretConfigured ? (
            <label className="authmw-check">
              <input
                type="checkbox"
                checked={clearedSecrets.has(provider.draftKey)}
                onChange={event => {
                  setClearedSecrets(current => {
                    const next = new Set(current);
                    if (event.target.checked) next.add(provider.draftKey); else next.delete(provider.draftKey);
                    return next;
                  });
                  if (event.target.checked) setClientSecrets(current => ({ ...current, [provider.draftKey]: "" }));
                }}
              />
              Clear this provider&apos;s stored client secret when saving
            </label>
          ) : null}
          <div className="authmw-actions">
            <button type="button" onClick={() => void testOidc(provider)} disabled={!provider.id || !provider.clientSecretConfigured}>
              Test saved provider
            </button>
            <button type="button" className="authmw-danger" onClick={() => removeProvider(provider)}>
              Delete provider
            </button>
          </div>
        </fieldset>
      ))}

      <fieldset disabled={busy}>
        <legend>Trusted reverse-proxy identity</legend>
        <label className="authmw-check">
          <input
            type="checkbox"
            checked={settings.trustedHeaderEnabled}
            onChange={event => update("trustedHeaderEnabled", event.target.checked)}
          />
          Enable trusted-header authentication and account linking
        </label>
        <div className="authmw-grid">
          <label>
            Provider label
            <input value={settings.trustedHeaderLabel} onChange={event => update("trustedHeaderLabel", event.target.value)} />
          </label>
          <label>
            Authority ID {settings.trustedHeaderProviderId ? <span className="authmw-muted">(disable and unlink to replace)</span> : null}
            <input
              value={settings.trustedHeaderProviderId}
              readOnly={settings.trustedHeaderEnabled}
              placeholder="Generated when first enabled"
              onChange={event => update("trustedHeaderProviderId", event.target.value)}
            />
          </label>
          <label>
            Stable subject header
            <input value={settings.trustedHeaderSubjectName} onChange={event => update("trustedHeaderSubjectName", event.target.value)} />
          </label>
          <label>
            Optional display-name header
            <input value={settings.trustedHeaderDisplayName} onChange={event => update("trustedHeaderDisplayName", event.target.value)} />
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
          The subject header must be stable and unique within this authority. The proxy must remove
          client-supplied identity headers, and only its direct peer address may be trusted.
        </p>
      </fieldset>

      <div className="authmw-actions">
        <button type="button" onClick={() => void save()} disabled={busy}>Save settings</button>
      </div>
      <p className="authmw-status" role="status" aria-live="polite">{status}</p>
    </section>
  );
}
