import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";
import { ChevronDown, ChevronRight, Database, Upload } from "@cove/runtime/lucide-react";

const h = React.createElement;
const { useMemo, useState } = React;
const API = "/api/plugins/com.midnightrider.stash-filter-importer";
const PATH_STORAGE_KEY = "com.midnightrider.stash-filter-importer.stashDbPath";

function loadRememberedPath() {
  try { return localStorage.getItem(PATH_STORAGE_KEY) || ""; }
  catch { return ""; }
}

function rememberPath(value) {
  try { localStorage.setItem(PATH_STORAGE_KEY, value); }
  catch { /* Browser storage is optional; keep the path in component state. */ }
}

async function request(url, options) {
  const response = await extensionFetch(url, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const error = new Error(body?.message || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return response.status === 204 ? null : response.json();
}

function normalizeName(value) { return value.trim().toLowerCase(); }
function savedFilterKey(mode, name) { return `${mode}\u0000${normalizeName(name)}`; }
function classifyExistingFilters(filters, existing) {
  const byName = new Map(existing.map((item) => [savedFilterKey(item.mode, item.name), item]));
  const alreadyInCove = new Set();
  for (const filter of filters) {
    const match = filter.payload
      ? byName.get(savedFilterKey(filter.payload.mode, filter.name))
      : null;
    if (match) alreadyInCove.add(filter.sourceId);
  }
  return alreadyInCove;
}
function isTerminalResult(result) { return result?.status === "exists" || result?.status === "success"; }
function isRowDisabled(filter, alreadyInCove, result) { return !filter.importable || alreadyInCove || isTerminalResult(result); }

const ENTITY_TYPES = [
  { mode: "SCENES", label: "Videos" },
  { mode: "IMAGES", label: "Images" },
  { mode: "GALLERIES", label: "Galleries" },
  { mode: "SCENE_MARKERS", label: "Segments" },
  { mode: "PERFORMERS", label: "Performers" },
  { mode: "TAGS", label: "Tags" },
  { mode: "STUDIOS", label: "Studios" },
];
const ENTITY_TYPE_BY_MODE = new Map(ENTITY_TYPES.map((item) => [item.mode, item]));

function formatMode(mode) {
  if (!mode) return "Unknown";
  const known = ENTITY_TYPE_BY_MODE.get(mode);
  if (known) return known.label;
  return mode.toLowerCase().replace(/(^|_)([a-z])/g, (_match, prefix, letter) =>
    `${prefix === "_" ? " " : ""}${letter.toUpperCase()}`);
}

function groupFilters(filters) {
  const groups = ENTITY_TYPES.map(({ mode, label }) => ({ mode, label, filters: [] }));
  const byMode = new Map(groups.map((group) => [group.mode, group]));
  const extraGroups = new Map();
  for (const filter of filters) {
    let group = byMode.get(filter.sourceMode) || extraGroups.get(filter.sourceMode);
    if (!group) {
      group = { mode: filter.sourceMode, label: formatMode(filter.sourceMode), filters: [] };
      extraGroups.set(filter.sourceMode, group);
    }
    group.filters.push(filter);
  }
  const ordered = [...groups, ...[...extraGroups.values()].sort((left, right) =>
    left.label.localeCompare(right.label, undefined, { sensitivity: "base" }))];
  return ordered.map((group) => ({
    ...group,
    filters: [...group.filters].sort((left, right) =>
      left.name.localeCompare(right.name, undefined, { sensitivity: "base" })
      || left.sourceId.localeCompare(right.sourceId)),
  }));
}
function filterFiltersByStatus(filters, statuses) {
  return filters.filter((filter) => statuses.has(filter.status));
}

function clearSelectionForStatus(selected, filters, status) {
  const hiddenIds = new Set(filters
    .filter((filter) => filter.status === status)
    .map((filter) => filter.sourceId));
  return new Set([...selected].filter((id) => !hiddenIds.has(id)));
}

function emptyGroupMessage(filters, mode) {
  return filters.some((filter) => filter.sourceMode === mode)
    ? "No filters match the selected statuses."
    : "No saved filters found.";
}

function summarizeFilters(filters) {
  const summary = { direct: 0, adapted: 0, unsupported: 0, importable: 0 };
  for (const filter of filters) {
    if (Object.hasOwn(summary, filter.status) && filter.status !== "importable") summary[filter.status] += 1;
    if (filter.importable) summary.importable += 1;
  }
  return summary;
}

function importSummaryText(summary) {
  const total = summary.direct + summary.adapted + summary.unsupported;
  const primaryNoun = total === 1 ? "filter" : "filters";
  return {
    primary: `${summary.importable} of ${total} ${primaryNoun} ${total === 1 ? "is" : "are"} importable.`,
    adapted: summary.adapted > 0
      ? summary.adapted === 1
        ? "1 importable filter is adapted and may not match Stash 100%."
        : `${summary.adapted} importable filters are adapted and may not match Stash 100%.`
      : "",
    unsupported: summary.unsupported > 0
      ? `${summary.unsupported} ${summary.unsupported === 1 ? "filter is" : "filters are"} unsupported.`
      : "",
  };
}

function selectableFilterIds(filters, alreadyInCove, results) {
  return filters
    .filter((filter) => !isRowDisabled(
      filter,
      alreadyInCove.has(filter.sourceId),
      results[filter.sourceId],
    ))
    .map((filter) => filter.sourceId);
}

function selectionState(filters, selectedIds, alreadyInCove, results) {
  const ids = selectableFilterIds(filters, alreadyInCove, results);
  const selected = ids.filter((id) => selectedIds.has(id)).length;
  return { all: ids.length > 0 && selected === ids.length, some: selected > 0, selected, total: ids.length };
}

function toggleFilterSelection(current, filters, alreadyInCove, results) {
  const ids = selectableFilterIds(filters, alreadyInCove, results);
  const remove = ids.length > 0 && ids.every((id) => current.has(id));
  const next = new Set(current);
  for (const id of ids) remove ? next.delete(id) : next.add(id);
  return next;
}

async function importReadyFilters(filters, selectedIds, existing, priorResults, create, onProgress) {
  const nextResults = { ...priorResults };
  const names = new Set(existing.map((item) => savedFilterKey(item.mode, item.name)));
  for (const filter of filters) {
    if (!selectedIds.has(filter.sourceId) || !filter.importable
      || isTerminalResult(nextResults[filter.sourceId])) continue;
    const nameKey = savedFilterKey(filter.payload.mode, filter.name);
    if (names.has(nameKey)) {
      nextResults[filter.sourceId] = { status: "exists", message: "Already in Cove" };
      onProgress({ ...nextResults });
      continue;
    }
    try {
      await create(filter.payload);
      names.add(nameKey);
      nextResults[filter.sourceId] = { status: "success", message: "Imported" };
    } catch (reason) {
      nextResults[filter.sourceId] = reason?.status === 409
        ? { status: "exists", message: "Already in Cove" }
        : { status: "failure", message: reason instanceof Error ? reason.message : "Import failed" };
    }
    onProgress({ ...nextResults });
  }
  return nextResults;
}

async function loadExistingFilters(filters) {
  const modes = [...new Set(filters.map((filter) => filter.payload?.mode).filter(Boolean))];
  const responses = await Promise.all(modes.map((mode) =>
    request(`/api/savedfilters?mode=${encodeURIComponent(mode)}`)));
  return responses.flat();
}

const STATUS_LABELS = {
  direct: "Direct",
  adapted: "Adapted",
  unsupported: "Unsupported",
};

function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  return h("span", {
    className: `stash-filter-importer-badge stash-filter-importer-badge-${status}`,
    title: status === "adapted" ? "May not match Stash 100%." : undefined,
  }, label);
}

function ImportSummary({ summary, label, compact = false }) {
  const text = importSummaryText(summary);
  return h("div", {
    className: `stash-filter-importer-summary${compact ? " stash-filter-importer-summary-compact" : ""}`,
    "aria-label": label,
  }, [
    h("p", { key: "primary", className: "stash-filter-importer-summary-primary" }, text.primary),
    text.adapted || text.unsupported
      ? h("div", { key: "notes", className: "stash-filter-importer-summary-notes" }, [
        text.adapted ? h("span", {
          key: "adapted", className: "stash-filter-importer-summary-adapted",
        }, text.adapted) : null,
        text.unsupported ? h("span", {
          key: "unsupported", className: "stash-filter-importer-summary-unsupported",
        }, text.unsupported) : null,
      ])
      : null,
  ]);
}

function SelectionToggle({ label, filters, selected, alreadyInCove, results, disabled, onToggle }) {
  const state = selectionState(filters, selected, alreadyInCove, results);
  return h("label", { className: "stash-filter-importer-selection-toggle" }, [
    h("input", {
      key: "input",
      type: "checkbox",
      checked: state.all,
      disabled: disabled || state.total === 0,
      ref: (input) => { if (input) input.indeterminate = state.some && !state.all; },
      onChange: onToggle,
    }),
    h("span", { key: "label" }, label),
  ]);
}

function StatusFilter({ statuses, onToggle }) {
  return h("fieldset", { className: "stash-filter-importer-status-filter" }, [
    h("legend", { key: "legend" }, "Filter by status"),
    ...Object.entries(STATUS_LABELS).map(([status, label]) => h("label", { key: status }, [
      h("input", {
        key: "input", type: "checkbox", checked: statuses.has(status),
        "aria-label": `Show ${label}`,
        onChange: () => onToggle(status),
      }),
      h("span", { key: "label" }, label),
    ])),
  ]);
}

function FilterRow({ filter, selected, alreadyInCove, result, onToggle }) {
  const [expanded, setExpanded] = useState(false);
  const disabled = isRowDisabled(filter, alreadyInCove, result);
  const completion = alreadyInCove || isTerminalResult(result);
  const completionLabel = result?.status === "success" ? "Imported" : "Already in Cove";
  const rulesId = `stash-filter-importer-rules-${filter.sourceMode}-${filter.sourceId}`;
  return h("article", { className: "stash-filter-importer-row" }, [
    h("div", { key: "main", className: "stash-filter-importer-row-main" }, [
      completion ? h("span", {
        key: "completion", className: "stash-filter-importer-completion", "aria-label": completionLabel, title: completionLabel,
      }, "✅") : h("input", {
        key: "select", type: "checkbox", "aria-label": `Select ${filter.name}`,
        checked: selected, disabled, onChange: () => onToggle(filter.sourceId),
      }),
      h("button", {
        key: "expand", type: "button", className: "stash-filter-importer-expand",
        "aria-controls": rulesId,
        "aria-expanded": expanded,
        "aria-label": `${expanded ? "Hide" : "Show"} details for ${filter.name || "untitled filter"}`,
        onClick: () => setExpanded((value) => !value),
      }, h(expanded ? ChevronDown : ChevronRight, { className: "stash-filter-importer-icon" })),
      h("div", { key: "identity", className: "stash-filter-importer-identity" }, [
        h("strong", { key: "name" }, filter.name || "Untitled filter"),
      ]),
      h(StatusBadge, { key: "status", status: filter.status }),
      result && result.status !== "exists" && result.status !== "success"
        ? h("span", { key: "result", className: `stash-filter-importer-result-${result.status}` }, result.message)
        : null,
    ]),
    expanded ? h("ul", { key: "rules", id: rulesId, className: "stash-filter-importer-rules" },
      filter.rules.map((rule, index) => h("li", { key: `${rule.source}-${index}` }, [
        h(StatusBadge, { key: "status", status: rule.status }),
        h("code", { key: "source" }, rule.source),
        rule.target ? h("span", { key: "target" }, ` → ${rule.target}`) : null,
        h("span", { key: "explanation" }, rule.explanation),
      ]))) : null,
  ]);
}

function StashFilterImporterPage() {
  const [path, setPath] = useState(loadRememberedPath);
  const [analysis, setAnalysis] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [alreadyInCove, setAlreadyInCove] = useState(new Set());
  const [visibleStatuses, setVisibleStatuses] = useState(new Set(Object.keys(STATUS_LABELS)));
  const [results, setResults] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const visibleFilters = useMemo(() => filterFiltersByStatus(analysis?.filters || [], visibleStatuses), [analysis, visibleStatuses]);
  const groups = useMemo(() => groupFilters(visibleFilters), [visibleFilters]);
  const summary = useMemo(() => summarizeFilters(analysis?.filters || []), [analysis]);
  const selectedCount = useMemo(() => selectionState(
    analysis?.filters || [], selected, alreadyInCove, results,
  ).selected, [analysis, selected, alreadyInCove, results]);

  async function analyze() {
    setBusy(true); setError(""); setAnalysis(null); setSelected(new Set()); setResults({});
    setAlreadyInCove(new Set());
    try {
      const inventory = await request(`${API}/analyze`, { method: "POST", body: JSON.stringify({ stashDbPath: path }) });
      const existing = await loadExistingFilters(inventory.filters);
      const classifications = classifyExistingFilters(inventory.filters, existing);
      setAlreadyInCove(classifications);
      setAnalysis(inventory);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Analysis failed.");
    } finally { setBusy(false); }
  }

  function toggle(id) {
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleMany(filters) {
    setSelected((current) => toggleFilterSelection(
      current, filters, alreadyInCove, results,
    ));
  }

  function toggleStatus(status) {
    const next = new Set(visibleStatuses);
    if (next.has(status)) {
      next.delete(status);
      setSelected((current) => clearSelectionForStatus(current, analysis?.filters || [], status));
    } else next.add(status);
    setVisibleStatuses(next);
  }

  async function importSelected() {
    if (!analysis || selectedCount === 0) return;
    setBusy(true); setError("");
    try {
      const existing = await loadExistingFilters(analysis.filters);
      const nextResults = await importReadyFilters(
        analysis.filters, selected, existing, results,
        (payload) => request("/api/savedfilters", { method: "POST", body: JSON.stringify(payload) }),
        setResults);
      setResults(nextResults);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Import failed.");
    } finally { setBusy(false); }
  }

  return h("div", { className: "stash-filter-importer-page" }, [
    h("header", { key: "header" }, [
      h("h1", { key: "title" }, "Stash Filter Importer"),
      h("p", { key: "description" }, "Cove and Stash use different filter models, so saved filters cannot be migrated one-to-one and Cove does not migrate them automatically. This extension adds adapters for compatible criteria and lets you review potential mismatches before importing."),
    ]),
    h("section", { key: "analyze", className: "stash-filter-importer-analyze" }, [
      h(Database, { key: "icon", className: "stash-filter-importer-database-icon" }),
      h("label", { key: "label" }, [
        h("span", { key: "text" }, "Server-side Stash database path"),
        h("input", {
          key: "input", value: path, onChange: (event) => {
            const nextPath = event.target.value;
            setPath(nextPath);
            rememberPath(nextPath);
          },
          placeholder: "/mounted/path/stash-go.sqlite", autoComplete: "off",
        }),
      ]),
      h("button", { key: "button", type: "button", disabled: busy || !path.trim(), onClick: analyze }, busy ? "Working…" : "Analyze"),
    ]),
    error ? h("p", { key: "error", role: "alert", className: "stash-filter-importer-error" }, error) : null,
    analysis ? h(React.Fragment, { key: "analysis" }, [
      h(ImportSummary, { key: "summary", summary, label: "Analysis summary" }),
      h("div", { key: "toolbar", className: "stash-filter-importer-toolbar" }, [
        h(StatusFilter, { key: "status-filter", statuses: visibleStatuses, onToggle: toggleStatus }),
        h(SelectionToggle, {
          key: "select-all", label: "Select all importable filters", filters: visibleFilters,
          selected, alreadyInCove, results, disabled: busy,
          onToggle: () => toggleMany(visibleFilters),
        }),
        h("div", { key: "actions", className: "stash-filter-importer-toolbar-actions" }, [
          h("span", { key: "selection" }, `${selectedCount} selected`),
          h("button", { key: "import", type: "button", disabled: busy || selectedCount === 0, onClick: importSelected }, [
            h(Upload, { key: "icon", className: "stash-filter-importer-icon" }),
            h("span", { key: "text" }, busy ? "Importing…" : "Import selected"),
          ]),
        ]),
      ]),
      h("div", { key: "sections", className: "stash-filter-importer-entity-sections" },
        groups.map((group, index) => {
          const headingId = `stash-filter-importer-entity-${index}`;
          return h("section", {
            key: group.mode,
            className: "stash-filter-importer-entity-section",
            "aria-labelledby": headingId,
          }, [
            h("header", { key: "header", className: "stash-filter-importer-entity-header" }, [
              h("div", { key: "summary", className: "stash-filter-importer-entity-summary" }, [
                h("div", { key: "title", className: "stash-filter-importer-entity-title" }, [
                  h("h2", { key: "heading", id: headingId }, group.label),
                ]),
                group.filters.length > 0 ? h(ImportSummary, {
                  key: "counts", summary: summarizeFilters(group.filters),
                  label: `${group.label} summary`, compact: true,
                }) : null,
              ]),
              h(SelectionToggle, {
                key: "select", label: `Select all in ${group.label}`, filters: group.filters,
                selected, alreadyInCove, results, disabled: busy,
                onToggle: () => toggleMany(group.filters),
              }),
            ]),
            group.filters.length > 0
              ? h("div", { key: "filters", className: "stash-filter-importer-list" },
                group.filters.map((filter) => h(FilterRow, {
                  key: filter.sourceId, filter, selected: selected.has(filter.sourceId),
                  alreadyInCove: alreadyInCove.has(filter.sourceId),
                  result: results[filter.sourceId], onToggle: toggle,
                })))
              : h("p", { key: "empty", className: "stash-filter-importer-empty" },
                emptyGroupMessage(analysis?.filters || [], group.mode)),
          ]);
        })),
    ]) : null,
  ]);
}

export default { components: { StashFilterImporterPage } };
