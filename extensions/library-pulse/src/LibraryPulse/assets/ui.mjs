import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";

const METRICS = {
  videos: { label: "Videos", path: "/api/videos?page=1&perPage=1" },
  galleries: { label: "Galleries", path: "/api/galleries?page=1&perPage=1" },
  groups: { label: "Groups", path: "/api/groups?page=1&perPage=1" },
  performers: { label: "Performers", path: "/api/performers?page=1&perPage=1" },
  studios: { label: "Studios", path: "/api/studios?page=1&perPage=1" },
  tags: { label: "Tags", path: "/api/tags?page=1&perPage=1" },
};

function normalizeMetrics(configuration, useDefaults = true) {
  const selected = Array.isArray(configuration?.metrics) ? configuration.metrics : [];
  const valid = selected.filter((key) => Object.hasOwn(METRICS, key));
  return valid.length || !useDefaults ? valid.slice(0, 6) : ["videos", "galleries", "groups", "performers"];
}

async function loadMetric(key, signal) {
  const response = await extensionFetch(METRICS[key].path, { signal });
  if (!response.ok) throw new Error(`${METRICS[key].label} returned ${response.status}`);
  const body = await response.json();
  return [key, Number(body.totalCount ?? 0)];
}

function LibraryPulseWidget({ configuration }) {
  const metrics = React.useMemo(() => normalizeMetrics(configuration), [configuration]);
  const [state, setState] = React.useState({ loading: true, values: {}, error: null, revision: 0 });

  React.useEffect(() => {
    const controller = new AbortController();
    setState((current) => ({ ...current, loading: true, error: null }));
    Promise.all(metrics.map((key) => loadMetric(key, controller.signal)))
      .then((entries) => setState((current) => ({ ...current, loading: false, values: Object.fromEntries(entries), error: null })))
      .catch((error) => {
        if (error?.name !== "AbortError") setState((current) => ({ ...current, loading: false, error: error instanceof Error ? error.message : "Unable to load library totals." }));
      });
    return () => controller.abort();
  }, [metrics, state.revision]);

  return React.createElement("section", { className: "library-pulse" },
    React.createElement("div", { className: "library-pulse__header" },
      React.createElement("div", null,
        React.createElement("h2", null, "Library Pulse"),
        React.createElement("span", { className: "library-pulse__badge" }, "Extension")),
      state.error ? React.createElement("button", { type: "button", onClick: () => setState((current) => ({ ...current, revision: current.revision + 1 })) }, "Retry") : null),
    state.error
      ? React.createElement("p", { className: "library-pulse__error", role: "alert" }, state.error)
      : React.createElement("div", { className: "library-pulse__grid" }, metrics.map((key) =>
          React.createElement("article", { className: "library-pulse__metric", key },
            React.createElement("span", null, METRICS[key].label),
            state.loading
              ? React.createElement("span", { className: "library-pulse__skeleton", "aria-label": `Loading ${METRICS[key].label}` })
              : React.createElement("strong", null, new Intl.NumberFormat().format(state.values[key] ?? 0))))));
}

function LibraryPulseEditor({ configuration, onChange, onValidityChange }) {
  const selected = normalizeMetrics(configuration, false);
  React.useEffect(() => onValidityChange(selected.length > 0, selected.length ? undefined : "Select at least one metric."), [selected.length, onValidityChange]);
  const toggle = (key) => {
    const next = selected.includes(key) ? selected.filter((item) => item !== key) : [...selected, key];
    onChange({ ...(configuration ?? {}), metrics: next });
  };
  return React.createElement("fieldset", { className: "library-pulse-editor" },
    React.createElement("legend", null, "Metrics"),
    React.createElement("p", null, "Choose up to six totals. The widget chooses its own column count from the available container width."),
    Object.entries(METRICS).map(([key, metric]) => React.createElement("label", { key },
      React.createElement("input", { type: "checkbox", checked: selected.includes(key), disabled: !selected.includes(key) && selected.length >= 6, onChange: () => toggle(key) }),
      React.createElement("span", null, metric.label))));
}

export default {
  components: { LibraryPulseWidget, LibraryPulseEditor },
};
