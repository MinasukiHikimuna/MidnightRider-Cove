import { EntityReferenceSelector, h, useEffect, useMemo, useState } from "../../shared/runtime.js";
import { handleModalKey, trapModalFocus } from "../../shared/presentation.js";

function initialMappings(summary) {
  return Object.fromEntries((summary.rows || []).map((row) => [
    row.sourceTagId,
    row.correspondingTagId == null
      ? null
      : { id: row.correspondingTagId, label: row.correspondingTagName || `Tag ${row.correspondingTagId}` },
  ]));
}

function CorrespondingTagsDialog({
  summary,
  busy,
  error,
  onSave,
  onConvert,
  onClose,
}) {
  const fingerprint = (summary.rows || []).map((row) =>
    `${row.sourceTagId}:${row.correspondingTagId ?? ""}:${row.correspondingTagName || ""}`).join("|");
  const [draftMappings, setDraftMappings] = useState(() => initialMappings(summary));
  useEffect(() => {
    if (!busy) setDraftMappings(initialMappings(summary));
  }, [fingerprint]);
  const updates = useMemo(() => (summary.rows || []).flatMap((row) => {
    const draft = draftMappings[row.sourceTagId] || null;
    const draftId = draft?.id == null ? null : Number(draft.id);
    return draftId === (row.correspondingTagId ?? null)
      ? []
      : [{
        sourceTagId: row.sourceTagId,
        correspondingTagId: draftId,
        expectedUpdatedAt: row.mappingUpdatedAt ?? null,
      }];
  }), [fingerprint, draftMappings]);
  const dirty = updates.length > 0;
  const close = () => { if (!busy) onClose(); };

  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget) close(); },
    onKeyDownCapture: (event) => handleModalKey(event, { onCancel: close }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-corresponding-tags-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" },
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("div", { key: "heading", className: "flex items-start justify-between gap-4" }, [
        h("div", { key: "copy" }, [
          h("h2", { key: "title", id: "segment-studio-corresponding-tags-title", className: "text-lg font-semibold text-foreground" },
            "Corresponding tags"),
          h("p", { key: "summary", className: "mt-1 text-sm text-secondary" },
            `${summary.sourceTagCount} source tags · ${summary.mappedSourceTagCount} mapped · ${summary.approvedReadyCount} approved segments ready`),
        ]),
        h("button", {
          key: "close",
          type: "button",
          disabled: busy,
          onClick: close,
          className: "rounded-md border border-border px-2.5 py-1.5 text-sm text-secondary hover:bg-muted/40 disabled:opacity-50",
        }, "Close"),
      ]),
      h("p", { key: "help", className: "mt-3 text-xs text-secondary" },
        "A mapping records your preferred long-term library tag for this model label across Full scans. It does not change any segments until you choose a conversion action, and conversion keeps each segment's review state."),
    ]),
    h("div", { key: "rows", className: "min-h-0 flex-1 overflow-y-auto p-4" },
      h("div", { className: "space-y-2" }, (summary.rows || []).map((row) => {
        const selected = draftMappings[row.sourceTagId] || null;
        return h("section", {
          key: row.sourceTagId,
          className: "grid items-center gap-3 rounded-md border border-border bg-surface p-3 md:grid-cols-[minmax(10rem,1fr)_1.5rem_minmax(14rem,1.4fr)_auto]",
        }, [
          h("div", { key: "source", className: "min-w-0" }, [
            h("div", { key: "name", className: "truncate text-sm font-semibold text-foreground", title: row.sourceTagName }, row.sourceTagName),
            h("div", { key: "counts", className: "mt-0.5 text-[11px] text-secondary" },
              `${row.unreviewedCount} unreviewed · ${row.approvedCount} approved · ${row.rejectedCount} rejected`),
          ]),
          h("span", { key: "arrow", "aria-hidden": "true", className: "text-center text-secondary" }, "→"),
          h(EntityReferenceSelector, {
            key: `target:${row.sourceTagId}:${selected?.id ?? "none"}`,
            entityType: "tag",
            value: selected?.id ?? null,
            selectedDisplay: "input",
            selectedLabel: selected?.label || "",
            onChange: (tagId, option) => setDraftMappings((current) => ({
              ...current,
              [row.sourceTagId]: tagId == null ? null : {
                id: Number(tagId),
                label: option?.label || `Tag ${tagId}`,
              },
            })),
            disabled: busy,
            placeholder: "Choose a long-term library tag…",
            inputClassName: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground",
            creatable: false,
            allowCreate: false,
          }),
          h("button", {
            key: "clear",
            type: "button",
            disabled: busy || selected == null,
            onClick: () => setDraftMappings((current) => ({ ...current, [row.sourceTagId]: null })),
            className: "rounded-md border border-border px-2.5 py-1.5 text-xs text-secondary hover:bg-muted/40 disabled:opacity-40",
          }, "Clear"),
        ]);
      }))),
    error ? h("p", {
      key: "error",
      role: "alert",
      className: "mx-4 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive",
    }, error) : null,
    dirty ? h("p", { key: "dirty", className: "mx-5 mb-2 text-xs text-amber-300" },
      "Save mappings before converting segments.") : null,
    h("footer", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      h("button", {
        key: "save",
        type: "button",
        disabled: busy || !dirty,
        onClick: () => onSave(updates),
        className: "mr-auto rounded-md border border-accent/60 bg-accent/10 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/20 disabled:opacity-50",
      }, busy && dirty ? "Saving…" : "Save mappings"),
      h("button", {
        key: "unreviewed",
        type: "button",
        disabled: busy || dirty || summary.unreviewedReadyCount === 0,
        onClick: () => onConvert(["unreviewed"]),
        className: "rounded-md border border-amber-400/60 bg-amber-500/10 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-amber-500/20 disabled:opacity-50",
      }, `Convert unreviewed (${summary.unreviewedReadyCount})`),
      h("button", {
        key: "approved",
        type: "button",
        disabled: busy || dirty || summary.approvedReadyCount === 0,
        onClick: () => onConvert(["approved"]),
        className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/20 disabled:opacity-50",
      }, `Convert approved (${summary.approvedReadyCount})`),
    ]),
  ]));
}

export { CorrespondingTagsDialog };
