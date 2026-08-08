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
  oidcEnabled: true,
  oidcButtonLabel: "Sign in with Authentik",
  oidcIssuer: "https://idp.example.invalid/application/o/cove/",
  oidcClientId: "cove-client",
  oidcClientSecretConfigured: true,
  covePublicUrl: "https://cove.example.invalid",
};

describe("authentication middleware settings", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => resetApiTransportForTests());

  it("keeps the configured secret write-only when saving unrelated changes", async () => {
    const requests: Array<{ path: string; init?: RequestInit }> = [];
    setApiTransportForTests(async (path, init) => {
      requests.push({ path, init });
      return path === "/settings" && init?.method === "PUT" ? configured : configured;
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
    expect(body).not.toHaveProperty("oidcClientSecret");
    expect(body.clearOidcClientSecret).toBe(false);
    expect(body.oidcButtonLabel).toBe("Continue with SSO");
  });

  it("requires an explicit clear action before removing the stored secret", async () => {
    let savedBody: Record<string, unknown> | undefined;
    setApiTransportForTests(async (path, init) => {
      if (init?.method === "PUT") {
        savedBody = JSON.parse(String(init.body));
        return { ...configured, oidcClientSecretConfigured: false };
      }
      return configured;
    });
    const user = userEvent.setup();
    render(<SettingsComponent />);

    await user.click(await screen.findByLabelText("Clear the stored client secret when saving"));
    await user.click(screen.getByRole("button", { name: "Save settings" }));

    await waitFor(() => expect(savedBody).toBeDefined());
    expect(savedBody?.clearOidcClientSecret).toBe(true);
    expect(savedBody).not.toHaveProperty("oidcClientSecret");
  });
});
