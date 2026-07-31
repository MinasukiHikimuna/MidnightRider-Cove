import { h } from "../../shared/runtime.js";

import { formatTime } from "../../shared/api.js";

import { handleModalKey, trapModalFocus } from "../../shared/presentation.js";

export function groupMaterializationOutputs(outputs) {
  const groups = new Map();
  for (const output of outputs || []) {
    const key = String(output.rootItemId || `${output.rootTagName}:${output.rootStartSec}`);
    if (!groups.has(key)) groups.set(key, {
      key,
      rootTagName: output.rootTagName || output.sourceTagName,
      rootStartSec: output.rootStartSec,
      outputs: [],
    });
    groups.get(key).outputs.push(output);
  }
  return [...groups.values()];
}

function DerivedSegmentMaterializationDialog({ preview, loading, processing, error, cancelButtonRef, onConfirm, onClose }) {
  const changeCount = preview ? preview.createCount + preview.linkCount : 0;
  const visibleOutputs = preview?.outputs?.slice(0, 200) || [];
  const outputGroups = groupMaterializationOutputs(visibleOutputs);
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget && !processing) onClose(); },
    onKeyDownCapture: (event) => handleModalKey(event, {
      onCancel: processing ? undefined : onClose,
      onConfirm: preview && changeCount > 0 && !processing ? onConfirm : undefined,
    }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" },
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("h2", { key: "title", id: "segment-studio-materialize-derived-title", className: "text-lg font-semibold text-foreground" }, "Auto-Materialize Derived Segments"),
      h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
        "Preview derivation rules before creating or linking any segments."),
    ]),
    h("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" },
      loading
        ? h("p", { className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" }, "Analyzing derived segments…")
        : preview ? h("div", { className: "space-y-4" }, [
            h("dl", { key: "summary", className: "grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 text-sm sm:grid-cols-5" }, [
              ["Source roots", preview.sourceCount],
              ["Create", preview.createCount],
              ["Link existing", preview.linkCount],
              ["Already materialized", preview.alreadyMaterializedCount],
              ["Conflicts skipped", preview.conflictCount || 0],
            ].flatMap(([label, value]) => [
              h("dt", { key: `${label}:label`, className: "text-secondary" }, label),
              h("dd", { key: `${label}:value`, className: "font-semibold text-foreground" }, String(value)),
            ])),
            preview.conflictCount > 0
              ? h("p", { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
                  `${preview.conflictCount} existing derivation ${preview.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`)
              : null,
            outputGroups.length
              ? h("div", { key: "outputs", className: "space-y-2" }, [
                  ...outputGroups.map((group) => h("article", {
                    key: group.key,
                    className: "rounded-md border border-border bg-surface p-3",
                  }, [
                    h("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
                      h("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                        `${group.rootTagName} @ ${formatTime(group.rootStartSec)}`),
                      h("span", { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                        `${group.outputs.length} ${group.outputs.length === 1 ? "change" : "changes"}`),
                    ]),
                    h("div", { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
                      group.outputs.map((output, index) => h("div", {
                        key: `${output.ruleId}:${output.depth}:${index}`,
                        className: "flex min-w-0 items-center gap-2 text-sm",
                        style: { marginLeft: `${Math.max(0, output.depth - 1) * 1.25}rem` },
                      }, [
                        h("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                        h("span", { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                          `${output.sourceTagName} → ${output.derivedTagName}`),
                        h("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${output.depth}`),
                        h("span", { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                          output.action === "create" ? "Create" : "Link existing"),
                      ]))),
                  ])),
                  (preview.outputs?.length || 0) > visibleOutputs.length
                    ? h("p", { key: "more", className: "text-xs text-secondary" },
                        `${preview.outputs.length - visibleOutputs.length} additional output${preview.outputs.length - visibleOutputs.length === 1 ? "" : "s"} omitted from this preview list.`)
                    : null,
                ])
              : h("p", { key: "empty", className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
                  preview.conflictCount > 0
                    ? "No safe materialization changes are available until the conflicting lineage is resolved."
                    : "Every applicable derivation is already materialized."),
          ]) : null),
    error ? h("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, error) : null,
    h("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      h("button", { key: "cancel", ref: cancelButtonRef, type: "button", autoFocus: true, disabled: processing, onClick: onClose, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      h("button", {
        key: "confirm",
        type: "button",
        disabled: loading || processing || changeCount === 0,
        onClick: onConfirm,
        className: "rounded-md border border-indigo-400/60 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-indigo-500/30 disabled:opacity-50",
      }, processing ? "Materializing…" : `Materialize ${changeCount} change${changeCount === 1 ? "" : "s"}`),
    ]),
  ]));
}

export { DerivedSegmentMaterializationDialog };
