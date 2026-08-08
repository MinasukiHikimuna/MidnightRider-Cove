import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_SETTINGS,
  resetApiTransportForTests,
  setApiTransportForTests,
  type AuthMiddlewareSettings,
} from "../api";
import { AuthMiddlewareSettings as SettingsComponent } from "../settings";

const configured: AuthMiddlewareSettings = {
  ...DEFAULT_SETTINGS,
  covePublicUrl: "https://cove.example.invalid",
  oidcProviders: [
    {
      id: "authentik",
      enabled: true,
      buttonLabel: "Sign in with Authentik",
      issuer: "https://idp.example.invalid/application/o/cove/",
      clientId: "cove-client",
      clientSecretConfigured: true,
      displayClaim: "preferred_username",
      scopes: ["openid", "profile", "email"],
    },
  ],
};

describe("authentication middleware settings", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => resetApiTransportForTests());

  it("keeps each configured provider secret write-only when saving unrelated changes", async () => {
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      requests.push({ path, init });
      return configured;
    });
    const user = userEvent.setup();
    render(<SettingsComponent />);

    const secret = await screen.findByLabelText("Client secret");
    expect(secret).toHaveValue("");
    expect(secret).toHaveAttribute("placeholder", "Configured; leave blank to keep");
    await user.clear(screen.getByLabelText("Login button label"));
    await user.type(screen.getByLabelText("Login button label"), "Continue with SSO");
    await user.click(screen.getByRole("button", { name: "Save settings" }));

    await waitFor(() => expect(requests.some(request => request.init?.method === "PUT")).toBe(true));
    const saved = requests.find(request => request.init?.method === "PUT")!;
    const body = JSON.parse(String(saved.init?.body));
    expect(body.oidcProviders[0]).not.toHaveProperty("clientSecret");
    expect(body.oidcProviders[0].clearClientSecret).toBe(false);
    expect(body.oidcProviders[0].buttonLabel).toBe("Continue with SSO");
  });

  it("requires an explicit per-provider clear action before removing a stored secret", async () => {
    let savedBody: Record<string, any> | undefined;
    setApiTransportForTests(async (_path, init) => {
      if (init?.method === "PUT") {
        savedBody = JSON.parse(String(init.body));
        return {
          ...configured,
          oidcProviders: [{ ...configured.oidcProviders[0], clientSecretConfigured: false }],
        };
      }
      return configured;
    });
    const user = userEvent.setup();
    render(<SettingsComponent />);

    await user.click(await screen.findByLabelText("Clear this provider's stored client secret when saving"));
    await user.click(screen.getByRole("button", { name: "Save settings" }));

    await waitFor(() => expect(savedBody).toBeDefined());
    expect(savedBody!.oidcProviders[0].clearClientSecret).toBe(true);
    expect(savedBody!.oidcProviders[0]).not.toHaveProperty("clientSecret");
  });

  it("adds a provider without choosing its persistent ID in the browser", async () => {
    let savedBody: Record<string, any> | undefined;
    const savedWithGeneratedProvider: AuthMiddlewareSettings = {
      ...DEFAULT_SETTINGS,
      covePublicUrl: "https://cove.example.invalid",
      oidcProviders: [
        {
          id: "server-generated-id",
          enabled: false,
          buttonLabel: "Sign in with OpenID Connect",
          issuer: "",
          clientId: "",
          clientSecretConfigured: false,
          displayClaim: "preferred_username",
          scopes: ["openid", "profile", "email"],
        },
      ],
    };
    setApiTransportForTests(async (_path, init) => {
      if (init?.method === "PUT") {
        savedBody = JSON.parse(String(init.body));
        return savedWithGeneratedProvider;
      }
      return DEFAULT_SETTINGS;
    });
    const user = userEvent.setup();
    render(<SettingsComponent />);

    await user.click(await screen.findByRole("button", { name: "Add provider" }));
    await user.click(screen.getByRole("button", { name: "Save settings" }));

    await waitFor(() => expect(savedBody).toBeDefined());
    expect(savedBody!.oidcProviders[0]).not.toHaveProperty("id");
    expect(await screen.findByText("(immutable)")).toBeInTheDocument();
  });
});
