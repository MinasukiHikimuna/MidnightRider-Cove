const BASE = "/api/plugins/com.midnightrider.auth-middleware";

export interface OidcProviderSettings {
  id: string;
  enabled: boolean;
  buttonLabel: string;
  issuer: string;
  clientId: string;
  clientSecretConfigured: boolean;
  displayClaim: string;
  scopes: string[];
}

export interface AuthMiddlewareSettings {
  covePublicUrl: string;
  allowInsecureDevelopmentIssuer: boolean;
  oidcProviders: OidcProviderSettings[];
  trustedHeaderEnabled: boolean;
  trustedHeaderProviderId: string;
  trustedHeaderLabel: string;
  trustedHeaderSubjectName: string;
  trustedHeaderDisplayName: string;
  trustedProxyCidrs: string[];
}

export interface OidcProviderSettingsUpdate extends Omit<OidcProviderSettings, "clientSecretConfigured" | "id"> {
  id?: string;
  clientSecret?: string;
  clearClientSecret: boolean;
}

export interface AuthMiddlewareSettingsUpdate extends Omit<AuthMiddlewareSettings, "oidcProviders"> {
  oidcProviders: OidcProviderSettingsUpdate[];
}

export const DEFAULT_SETTINGS: AuthMiddlewareSettings = {
  covePublicUrl: "",
  allowInsecureDevelopmentIssuer: false,
  oidcProviders: [],
  trustedHeaderEnabled: false,
  trustedHeaderProviderId: "",
  trustedHeaderLabel: "Trusted reverse proxy",
  trustedHeaderSubjectName: "X-Authentik-Uid",
  trustedHeaderDisplayName: "X-Authentik-Username",
  trustedProxyCidrs: [],
};

async function request(path: string, init: RequestInit = {}): Promise<unknown> {
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: unknown; errors?: Record<string, string[]> } | null;
    const validation = body?.errors
      ? Object.values(body.errors).flat().filter(value => typeof value === "string").join(" ")
      : "";
    const message = validation || (typeof body?.message === "string" ? body.message : `Request failed (${response.status}).`);
    throw new Error(message);
  }
  return response.status === 204 ? undefined : response.json();
}

type Transport = (path: string, init?: RequestInit) => Promise<unknown>;
let transport: Transport = request;

export const authMiddlewareApi = {
  getSettings: () => transport("/settings") as Promise<AuthMiddlewareSettings>,
  saveSettings: (settings: AuthMiddlewareSettingsUpdate) => transport("/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  }) as Promise<AuthMiddlewareSettings>,
  testOidc: (providerId: string) => transport(`/oidc/${encodeURIComponent(providerId)}/test`, { method: "POST" }) as Promise<{ ready: boolean }>,
};

export function setApiTransportForTests(next: Transport) { transport = next; }
export function resetApiTransportForTests() { transport = request; }
