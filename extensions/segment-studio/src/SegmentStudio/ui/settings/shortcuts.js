import { h, useState } from "../shared/runtime.js";

import { DEFAULT_PLAYBACK_SHORTCUT_CONFIG } from "../shared/constants.js";

import { readPlaybackShortcutConfig, writePlaybackShortcutConfig } from "../editor/model/shortcuts.js";

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

export { PlaybackShortcutSettings };
