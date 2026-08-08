const BASE = "/api/plugins/com.midnightrider.auth-middleware";

export interface AuthMiddlewareSettings {
  oidcEnabled: boolean;
  oidcButtonLabel: string;
  oidcIssuer: string;
  oidcClientId: string;
  oidcClientSecretConfigured: boolean;
  covePublicUrl: string;
  usernameClaim: string;
  scopes: string[];
  allowInsecureDevelopmentIssuer: boolean;
  trustedHeaderEnabled: boolean;
  trustedHeaderName: string;
  trustedProxyCidrs: string[];
}

export interface AuthMiddlewareSettingsUpdate extends Omit<AuthMiddlewareSettings, "oidcClientSecretConfigured"> {
  oidcClientSecret?: string;
  clearOidcClientSecret: boolean;
}

export const DEFAULT_SETTINGS: AuthMiddlewareSettings = {
  oidcEnabled: false,
  oidcButtonLabel: "Sign in with OpenID Connect",
  oidcIssuer: "",
  oidcClientId: "",
  oidcClientSecretConfigured: false,
  covePublicUrl: "",
  usernameClaim: "preferred_username",
  scopes: ["openid", "profile", "email"],
  allowInsecureDevelopmentIssuer: false,
  trustedHeaderEnabled: false,
  trustedHeaderName: "X-Authentik-Username",
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
  testOidc: () => transport("/oidc/test", { method: "POST" }) as Promise<{ ready: boolean }>,
};

export function setApiTransportForTests(next: Transport) { transport = next; }
export function resetApiTransportForTests() { transport = request; }
