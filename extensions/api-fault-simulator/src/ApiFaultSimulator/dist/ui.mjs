const cookieName = "cove-dev-api-fault";
const storageKey = "cove-api-fault-simulator";
const runtimeKey = "__coveApiFaultSimulator";
const maxLatencyMs = 60_000;
const healthFaultDurationMs = 60_000;

const modes = new Set(["normal", "offline", "timeout", "gateway", "latency"]);
const modeDescriptions = {
  normal: "Send API requests normally.",
  offline: "Reject matching API requests immediately.",
  timeout: "Leave matching requests pending until Cove aborts them.",
  gateway: "Return a synthetic Bad Gateway response for matching requests.",
  latency: "Delay matching API requests before continuing.",
};
const defaultState = {
  panelOpen: false,
  apiFaultMode: "normal",
  apiRequestFilter: "/api/*",
  latencyMs: 2_000,
  includeSystemHealth: false,
  healthFaultExpiresAt: 0,
};

function normalizeLatency(value) {
  const latency = Number(value);
  return Number.isFinite(latency) && latency >= 0
    ? Math.min(latency, maxLatencyMs)
    : defaultState.latencyMs;
}

function hasActiveHealthFault(state, now = Date.now()) {
  return state.includeSystemHealth === true
    && Number.isFinite(state.healthFaultExpiresAt)
    && state.healthFaultExpiresAt > now;
}

function clearExpiredHealthFault(state, now = Date.now()) {
  if (hasActiveHealthFault(state, now)) return;
  state.includeSystemHealth = false;
  state.healthFaultExpiresAt = 0;
}

export function applyUnavailablePreset(state, now = Date.now()) {
  state.apiFaultMode = "offline";
  state.apiRequestFilter = defaultState.apiRequestFilter;
  state.includeSystemHealth = true;
  state.healthFaultExpiresAt = now + healthFaultDurationMs;
}

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");
    const apiFaultMode = modes.has(stored.apiFaultMode)
      ? stored.apiFaultMode
      : defaultState.apiFaultMode;
    const healthFaultExpiresAt = Number(stored.healthFaultExpiresAt);
    const includeSystemHealth = stored.includeSystemHealth === true
      && Number.isFinite(healthFaultExpiresAt)
      && healthFaultExpiresAt > Date.now();

    return {
      panelOpen: stored.panelOpen === true,
      apiFaultMode,
      apiRequestFilter: typeof stored.apiRequestFilter === "string"
        ? stored.apiRequestFilter
        : defaultState.apiRequestFilter,
      latencyMs: normalizeLatency(stored.latencyMs),
      includeSystemHealth,
      healthFaultExpiresAt: includeSystemHealth ? healthFaultExpiresAt : 0,
    };
  } catch {
    return { ...defaultState };
  }
}

function saveState(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch {
    // Browser-local persistence is optional; the cookie still controls current requests.
  }

  // Remove the cookie previously used by the built-in tool before writing the scoped rule.
  document.cookie = `${cookieName}=; Path=/; Max-Age=0; SameSite=Lax`;
  const healthCookieLifetime = hasActiveHealthFault(state)
    ? `; Max-Age=${Math.max(1, Math.ceil((state.healthFaultExpiresAt - Date.now()) / 1_000))}`
    : "";
  document.cookie = state.apiFaultMode === "normal"
    ? `${cookieName}=; Path=/api; Max-Age=0; SameSite=Lax`
    : `${cookieName}=${encodeURIComponent(JSON.stringify(state))}; Path=/api${healthCookieLifetime}; SameSite=Lax`;
}

function renderPanel(element, state) {
  const active = state.apiFaultMode !== "normal";
  const description = modeDescriptions[state.apiFaultMode] ?? modeDescriptions.normal;
  const healthFaultActive = hasActiveHealthFault(state);

  element.innerHTML = `
    <div class="cove-api-fault-tools">
      ${state.panelOpen ? `
        <section aria-label="Cove API fault simulator" class="cove-api-fault-panel">
          <header>
            <strong>API Fault Simulator</strong>
            <button type="button" data-action="close" aria-label="Close API fault simulator">&times;</button>
          </header>
          <label>
            API behavior
            <select data-field="apiFaultMode">
              <option value="normal">Normal</option>
              <option value="offline">API unavailable</option>
              <option value="timeout">API timeout</option>
              <option value="gateway">Gateway 502</option>
              <option value="latency">Add latency</option>
            </select>
            <small>${description}</small>
          </label>
          ${active ? `
            <label>
              API request filter
              <input
                data-field="apiRequestFilter"
                placeholder="/api/*"
                spellcheck="false"
              >
              <small>Matches the path and query; use * as a wildcard.</small>
            </label>
          ` : ""}
          ${state.apiFaultMode === "latency" ? `
            <label>
              Latency (milliseconds)
              <input data-field="latencyMs" type="number" min="0" max="${maxLatencyMs}" step="250" value="${state.latencyMs}">
            </label>
          ` : ""}
          ${active ? `
            <label class="cove-api-fault-checkbox">
              <input data-field="includeSystemHealth" type="checkbox" ${healthFaultActive ? "checked" : ""}>
              <span>
                Include system health
                <small>Advanced: matching health requests fail for at most 60 seconds. Reloading may hide this control until the fault expires.</small>
              </span>
            </label>
            <p class="cove-api-fault-recovery-note">
              ${healthFaultActive
                ? "System health is temporarily included and will recover within 60 seconds. Authentication and extension-management requests remain online."
                : "System health, authentication, and extension-management requests remain online so the simulator can be recovered after a reload."}
            </p>
          ` : ""}
          <div class="cove-api-fault-actions">
            <button type="button" data-action="unavailable-preset" class="primary">Simulate API unavailable</button>
            <button type="button" data-action="restore">Restore normal API</button>
          </div>
          <small class="cove-api-fault-preset-note">The unavailable preset faults all API requests, including system health for up to 60 seconds.</small>
        </section>
      ` : ""}
      <button
        type="button"
        data-action="toggle"
        class="cove-api-fault-toggle ${active ? "active" : ""}"
        aria-expanded="${state.panelOpen}"
      >
        &#9888; API Faults${active ? `: ${state.apiFaultMode}` : ""}
      </button>
    </div>
  `;

  const modeSelect = element.querySelector("[data-field='apiFaultMode']");
  if (modeSelect) modeSelect.value = state.apiFaultMode;
  const filterInput = element.querySelector("[data-field='apiRequestFilter']");
  if (filterInput) filterInput.value = state.apiRequestFilter;
}

function mount(element) {
  element._dispose?.();
  const state = loadState();
  let healthExpiryTimer;

  const update = () => {
    clearExpiredHealthFault(state);
    saveState(state);
    render();
    if (healthExpiryTimer != null) window.clearTimeout(healthExpiryTimer);
    if (hasActiveHealthFault(state)) {
      healthExpiryTimer = window.setTimeout(() => {
        state.includeSystemHealth = false;
        state.healthFaultExpiresAt = 0;
        update();
      }, state.healthFaultExpiresAt - Date.now() + 1);
    }
  };
  const render = () => {
    renderPanel(element, state);

    element.querySelectorAll("[data-action]").forEach((control) => {
      control.addEventListener("click", () => {
        switch (control.dataset.action) {
          case "close":
            state.panelOpen = false;
            break;
          case "toggle":
            state.panelOpen = !state.panelOpen;
            break;
          case "unavailable-preset":
            applyUnavailablePreset(state);
            break;
          case "restore":
            state.apiFaultMode = "normal";
            state.includeSystemHealth = false;
            state.healthFaultExpiresAt = 0;
            break;
        }
        update();
      });
    });

    element.querySelectorAll("[data-field]").forEach((control) => {
      control.addEventListener("change", () => {
        const field = control.dataset.field;
        if (field === "latencyMs") {
          state.latencyMs = normalizeLatency(control.value);
        } else if (field === "includeSystemHealth") {
          state.includeSystemHealth = control.checked;
          state.healthFaultExpiresAt = control.checked ? Date.now() + healthFaultDurationMs : 0;
        } else if (field === "apiFaultMode") {
          state.apiFaultMode = control.value;
        } else if (field === "apiRequestFilter") {
          state.apiRequestFilter = control.value;
        }

        if (state.apiFaultMode === "normal") {
          state.includeSystemHealth = false;
          state.healthFaultExpiresAt = 0;
        }

        update();
      });
    });
  };

  const toggleWithKeyboard = (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "d") {
      event.preventDefault();
      state.panelOpen = !state.panelOpen;
      update();
    }
  };

  window.addEventListener("keydown", toggleWithKeyboard);
  element._dispose = () => {
    window.removeEventListener("keydown", toggleWithKeyboard);
    if (healthExpiryTimer != null) window.clearTimeout(healthExpiryTimer);
  };
  update();
}

// Custom element definitions cannot be replaced. Keep the element stable and let the
// active bundle own the implementation behind it for the duration of its lifecycle.
const runtime = { mount };
let active = false;
let previousRuntime;
if (!customElements.get("cove-api-fault-tools")) {
  customElements.define("cove-api-fault-tools", class extends HTMLElement {
    connectedCallback() {
      globalThis[runtimeKey]?.mount(this);
    }

    disconnectedCallback() {
      this._dispose?.();
    }
  });
}

export default {
  components: {},
  onLoad() {
    if (!active) {
      previousRuntime = globalThis[runtimeKey];
      globalThis[runtimeKey] = runtime;
      active = true;
    }
    document.querySelectorAll("cove-api-fault-tools").forEach(mount);
  },
  onUnload() {
    document.querySelectorAll("cove-api-fault-tools").forEach((element) => element._dispose?.());
    if (active && globalThis[runtimeKey] === runtime) {
      if (previousRuntime === undefined) {
        delete globalThis[runtimeKey];
      } else {
        globalThis[runtimeKey] = previousRuntime;
      }
    }
    previousRuntime = undefined;
    active = false;
  },
};
