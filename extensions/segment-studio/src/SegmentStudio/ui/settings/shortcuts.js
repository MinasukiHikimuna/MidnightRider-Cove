import { h, useEffect, useState } from "../shared/runtime.js";

import { DEFAULT_PLAYBACK_SHORTCUT_CONFIG } from "../shared/constants.js";

import { SEGMENT_STUDIO_SHORTCUTS, filterSegmentStudioShortcuts, readPlaybackShortcutConfig, readShortcutBindingOverrides, resolveSegmentStudioShortcuts, shortcutBindingDisplayText, shortcutBindingFromEvent, shortcutBindingLabel, shortcutBindingsOverlap, shortcutModesOverlap, shouldExitShortcutCapture, splitShortcutCategoriesIntoColumns, writePlaybackShortcutConfig, writeShortcutBindingOverrides } from "../editor/model/shortcuts.js";

function PlaybackShortcutSettings() {
  const [config, setConfig] = useState(readPlaybackShortcutConfig);
  const fields = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1],
  ];
  function update(key, value) {
    setConfig((current) => writePlaybackShortcutConfig({ ...current, [key]: value }));
  }
  function reset() {
    setConfig(writePlaybackShortcutConfig(DEFAULT_PLAYBACK_SHORTCUT_CONFIG));
  }
  return h("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-labelledby": "segment-studio-playback-shortcuts-title" }, [
    h("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3" }, [
      h("div", { key: "copy" }, [
        h("h2", { key: "title", id: "segment-studio-playback-shortcuts-title", className: "font-semibold text-foreground" }, "Playback shortcuts"),
        h("p", { key: "description", className: "mt-1 text-xs text-secondary" }, "Configure seek intervals and frame-step sizes used by the keyboard-first editor. These settings are stored in this browser."),
      ]),
      h("button", { key: "reset", type: "button", onClick: reset, className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted/40" }, "Reset defaults"),
    ]),
    h("div", { key: "fields", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, fields.map(([key, label, minimum, maximum, step]) =>
      h("label", { key, className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, label),
        h("input", {
          key: "input",
          type: "number",
          min: minimum,
          max: maximum,
          step,
          value: config[key],
          onChange: (event) => update(key, event.target.value),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
        }),
      ]))),
  ]);
}

function ShortcutBindingSettings() {
  const [overrides, setOverrides] = useState(readShortcutBindingOverrides);
  const [capturingId, setCapturingId] = useState(null);
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const shortcuts = resolveSegmentStudioShortcuts(overrides);
  const filteredShortcuts = filterSegmentStudioShortcuts(shortcuts, query);
  const categoryGroups = splitShortcutCategoriesIntoColumns(filteredShortcuts, 1)[0];
  const categoryColumns = splitShortcutCategoriesIntoColumns(filteredShortcuts);

  function persist(next) {
    const saved = writeShortcutBindingOverrides(next);
    setOverrides(saved);
    return saved;
  }

  function capture(event, shortcutId) {
    if (shouldExitShortcutCapture(event)) {
      setCapturingId(null);
      setMessage("Shortcut capture canceled.");
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.key === "Escape") {
      setCapturingId(null);
      setMessage("Shortcut capture canceled.");
      return;
    }
    if (event.key === "Backspace" || event.key === "Delete") {
      persist({ ...overrides, [shortcutId]: [] });
      setCapturingId(null);
      setMessage("Shortcut unassigned. Reset it to restore the default.");
      return;
    }
    const binding = shortcutBindingFromEvent(event);
    if (!binding) return;
    const conflict = resolveSegmentStudioShortcuts(overrides).find((shortcut) =>
      shortcut.id !== shortcutId
      && shortcutModesOverlap(
        shortcut,
        SEGMENT_STUDIO_SHORTCUTS.find((candidate) => candidate.id === shortcutId),
      )
      && shortcut.bindings.some((candidate) => shortcutBindingsOverlap(binding, candidate)));
    if (conflict) {
      setMessage(`${shortcutBindingLabel(binding)} is already assigned to “${conflict.description}”.`);
      return;
    }
    persist({ ...overrides, [shortcutId]: [binding] });
    setCapturingId(null);
    setMessage(`Assigned ${shortcutBindingLabel(binding)}.`);
  }

  function reset(shortcutId) {
    const next = { ...overrides };
    delete next[shortcutId];
    persist(next);
    setCapturingId(null);
    setMessage("Default binding restored.");
  }

  function resetAll() {
    persist({});
    setCapturingId(null);
    setMessage("All default bindings restored.");
  }

  useEffect(() => {
    if (!capturingId) return undefined;
    function handleCaptureKeyDown(event) {
      event.stopImmediatePropagation();
      capture(event, capturingId);
    }
    document.addEventListener("keydown", handleCaptureKeyDown, true);
    return () => document.removeEventListener("keydown", handleCaptureKeyDown, true);
  }, [capturingId, overrides]);

  function renderShortcutRow(shortcut) {
    const bindingText = shortcutBindingDisplayText(shortcut, capturingId === shortcut.id);
    return h("div", {
      key: shortcut.id,
      className: "grid items-center gap-2 px-3 py-2",
      style: { gridTemplateColumns: "minmax(0,1fr) auto" },
    }, [
      h("span", { key: "description", className: "text-sm text-foreground" }, shortcut.description),
      h("div", { key: "binding-controls", className: "flex items-center gap-1" }, [
        h("button", {
          key: "capture",
          type: "button",
          onClick: () => { setCapturingId(shortcut.id); setMessage("Press the new shortcut, or Escape to cancel."); },
          "aria-pressed": capturingId === shortcut.id,
          "aria-label": `${bindingText} — change binding for ${shortcut.description}`,
          className: "min-w-24 rounded border border-border bg-card px-2 py-1 font-mono text-xs text-secondary",
        }, bindingText),
        h("button", {
          key: "reset",
          type: "button",
          disabled: !Object.hasOwn(overrides, shortcut.id),
          onClick: () => reset(shortcut.id),
          title: "Reset to default",
          "aria-label": `Reset ${shortcut.description} to default`,
          className: "px-1 text-sm text-accent hover:text-accent-strong disabled:opacity-30",
        }, h("span", { "aria-hidden": "true" }, "↻")),
      ]),
    ]);
  }

  function renderShortcutGroup(group, layout) {
    const headingId = `segment-studio-shortcut-category-${layout}-${group.index}`;
    return h("section", {
      key: group.category,
      className: "space-y-2",
      "aria-labelledby": headingId,
    }, [
      h("h3", {
        key: "heading",
        id: headingId,
        className: "text-sm font-semibold text-foreground",
      }, group.category),
      h("div", { key: "items", className: "divide-y divide-border rounded-md border border-border" },
        group.shortcuts.map(renderShortcutRow)),
    ]);
  }

  return h("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-labelledby": "segment-studio-shortcut-bindings-title" }, [
    h("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3" }, [
      h("div", { key: "copy" }, [
        h("h2", { key: "title", id: "segment-studio-shortcut-bindings-title", className: "font-semibold text-foreground" }, "Keyboard bindings"),
        h("p", { key: "description", className: "mt-1 text-xs text-secondary" }, "Select a binding and press a new key combination. Backspace unassigns it; conflicts are rejected. Bindings are stored in this browser."),
      ]),
      h("button", { key: "reset", type: "button", onClick: resetAll, className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted/40" }, "Reset all defaults"),
    ]),
    h("label", { key: "search", className: "block space-y-1 text-xs text-secondary" }, [
      h("span", { key: "label" }, "Search bindings"),
      h("input", {
        key: "input",
        type: "search",
        value: query,
        onChange: (event) => setQuery(event.target.value),
        placeholder: "Search actions, categories, or keys",
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
      }),
    ]),
    filteredShortcuts.length > 0
      ? h("div", { key: "groups", className: "contents" }, [
          h("div", { key: "mobile", className: "space-y-6 lg:hidden" },
            categoryGroups.map((group) => renderShortcutGroup(group, "mobile"))),
          h("div", { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
            categoryColumns.map((column, index) =>
              h("div", { key: index, className: "space-y-6" },
                column.map((group) => renderShortcutGroup(group, `desktop-${index}`))))),
        ])
      : h("p", { key: "empty", role: "status", className: "rounded-md border border-dashed border-border px-3 py-6 text-center text-sm text-secondary" },
          "No keyboard bindings match your search."),
    message ? h("p", { key: "message", role: "status", className: "text-sm text-secondary" }, message) : null,
  ]);
}

export { PlaybackShortcutSettings, ShortcutBindingSettings };
