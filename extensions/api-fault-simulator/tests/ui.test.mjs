import assert from "node:assert/strict";
import test from "node:test";

globalThis.HTMLElement = class {};
globalThis.customElements = {
  get: () => true,
  define: () => {},
};

const { applyUnavailablePreset } = await import("../src/ApiFaultSimulator/dist/ui.mjs");

test("unavailable preset faults every API request and temporarily includes system health", () => {
  const now = 123_000;
  const state = {
    apiFaultMode: "gateway",
    apiRequestFilter: "/api/videos*",
    includeSystemHealth: false,
    healthFaultExpiresAt: 0,
  };

  applyUnavailablePreset(state, now);

  assert.equal(state.apiFaultMode, "offline");
  assert.equal(state.apiRequestFilter, "/api/*");
  assert.equal(state.includeSystemHealth, true);
  assert.equal(state.healthFaultExpiresAt, now + 60_000);
});
