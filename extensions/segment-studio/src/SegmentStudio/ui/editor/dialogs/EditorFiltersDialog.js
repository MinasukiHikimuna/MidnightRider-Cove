import { EntityReferenceSelector, h, useEffect, useRef, useState } from "../../shared/runtime.js";

import { REVIEW_STATES } from "../../shared/constants.js";

import { dualRangeValueFromPointer, normalizeEditorSegmentFilters, updateDualRangeValues } from "../model/selection.js";

import { performerOptionId } from "../../discovery/model.js";

import { SEGMENT_STATE_PRESENTATION, handleModalKey, trapModalFocus } from "../../shared/presentation.js";

import { DerivedVisibilityIcon, provenanceSourceLabel } from "../SegmentDetails.js";

function DualRangeSlider({ minimum, maximum, onChange }) {
  const trackRef = useRef(null);
  const [coincidentTop, setCoincidentTop] = useState("maximum");
  const commit = (kind, value) => {
    const next = updateDualRangeValues(minimum, maximum, kind, value);
    setCoincidentTop(next.coincidentTop);
    onChange({ minimum: next.minimum, maximum: next.maximum });
  };
  const updateFromPointer = (kind, event) => {
    const bounds = trackRef.current?.getBoundingClientRect();
    if (!bounds) return;
    commit(kind, dualRangeValueFromPointer(event.clientX, bounds.left, bounds.width));
  };
  const handlePointerDown = (kind, event) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    updateFromPointer(kind, event);
  };
  const handlePointerMove = (kind, event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId))
      updateFromPointer(kind, event);
  };
  const handleKeyDown = (kind, event) => {
    const value = kind === "minimum" ? minimum : maximum;
    const lower = kind === "minimum" ? 0 : minimum;
    const upper = kind === "minimum" ? maximum : 1;
    const delta = event.shiftKey ? 0.1 : 0.01;
    let next = null;
    if (["ArrowLeft", "ArrowDown"].includes(event.key)) next = value - delta;
    if (["ArrowRight", "ArrowUp"].includes(event.key)) next = value + delta;
    if (event.key === "PageDown") next = value - 0.1;
    if (event.key === "PageUp") next = value + 0.1;
    if (event.key === "Home") next = lower;
    if (event.key === "End") next = upper;
    if (next == null) return;
    event.preventDefault();
    commit(kind, Math.min(upper, Math.max(lower, next)));
  };
  const thumb = (kind, value) => h("span", {
    key: kind,
    role: "slider",
    tabIndex: 0,
    "aria-label": kind === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((kind === "minimum" ? 0 : minimum) * 100),
    "aria-valuemax": Math.round((kind === "minimum" ? maximum : 1) * 100),
    "aria-valuenow": Math.round(value * 100),
    "aria-valuetext": `${Math.round(value * 100)} percent`,
    onPointerDown: (event) => handlePointerDown(kind, event),
    onPointerMove: (event) => handlePointerMove(kind, event),
    onKeyDown: (event) => handleKeyDown(kind, event),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${value * 100}%`,
      touchAction: "none",
      zIndex: minimum === maximum && coincidentTop === kind ? 2 : 1,
    },
  });
  return h("div", { className: "space-y-2", "data-confidence-range": "true" }, [
    h("div", { key: "values", className: "flex items-center justify-between gap-4 text-xs text-secondary" }, [
      h("span", { key: "minimum" }, ["Minimum ", h("strong", { key: "value", className: "font-mono text-foreground" }, `${Math.round(minimum * 100)}%`)]),
      h("span", { key: "maximum" }, ["Maximum ", h("strong", { key: "value", className: "font-mono text-foreground" }, `${Math.round(maximum * 100)}%`)]),
    ]),
    h("div", { key: "track-wrap", className: "px-2 py-2" },
      h("div", {
        ref: trackRef,
        className: "relative h-2 rounded-full bg-muted",
      }, [
        h("span", {
          key: "selected-range",
          "aria-hidden": "true",
          className: "absolute inset-y-0 rounded-full bg-accent",
          style: { left: `${minimum * 100}%`, right: `${(1 - maximum) * 100}%` },
        }),
        thumb("minimum", minimum),
        thumb("maximum", maximum),
      ])),
  ]);
}

function FirstSegmentTagDialog({ saving, error, onSelect, onClose }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const input = dialogRef.current?.querySelector("input");
    input?.focus({ preventScroll: true });
  }, []);
  const close = () => { if (!saving) onClose(); };
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget) close(); },
    onKeyDownCapture: (event) => handleModalKey(event, { onCancel: close }),
  }, h("section", {
    ref: dialogRef,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "w-full max-w-lg space-y-4 rounded-lg border border-border bg-card p-5 shadow-2xl",
  }, [
    h("header", { key: "header", className: "space-y-1" }, [
      h("h2", {
        key: "title",
        id: "segment-studio-first-segment-tag-title",
        className: "text-lg font-semibold text-foreground",
      }, "Choose a tag for the first segment"),
      h("p", { key: "description", className: "text-sm text-secondary" },
        "The selected tag creates the first swimlane at the playhead."),
    ]),
    h(EntityReferenceSelector, {
      key: "tag",
      entityType: "tag",
      value: null,
      selectedDisplay: "input",
      selectedLabel: "",
      onChange: (tagId) => { if (tagId != null) onSelect(tagId); },
      disabled: saving,
      placeholder: "Find a tag…",
      inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
      creatable: false,
      allowCreate: false,
    }),
    error ? h("p", { key: "error", role: "status", className: "text-sm text-red-300" }, error) : null,
    h("div", { key: "actions", className: "flex justify-end" }, h("button", {
      type: "button",
      disabled: saving,
      onClick: close,
      className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40 disabled:opacity-50",
    }, saving ? "Creating…" : "Cancel")),
  ]));
}

function EditorFiltersDialog({
  filters, hideDerivedSegments, performers, provenanceSources, reviewCounts,
  segments, segmentGroups, reviewMode = false,
  onChange, onHideDerivedChange, onClose,
}) {
  const normalized = normalizeEditorSegmentFilters(filters);
  const tagOptions = [...new Map((segments || []).map((segment) => [
    Number(segment.tagId),
    segment.tagName || `Tag ${segment.tagId}`,
  ])).entries()].sort((left, right) =>
    left[1].localeCompare(right[1]) || left[0] - right[0]);
  const update = (values) => onChange(normalizeEditorSegmentFilters({ ...normalized, ...values }));
  const toggleReviewState = (state) => update({
    reviewStates: normalized.reviewStates.includes(state)
      ? normalized.reviewStates.filter((candidate) => candidate !== state)
      : [...normalized.reviewStates, state],
  });
  const optionClass = (selected) =>
    `rounded-md border px-2.5 py-1.5 text-xs font-medium ${
      selected
        ? "border-accent bg-accent/20 text-foreground"
        : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); },
    onKeyDownCapture: (event) => handleModalKey(event, { onCancel: onClose }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
  }, [
    h("header", { key: "header", className: "flex items-start justify-between gap-4 border-b border-border px-5 py-4" }, [
      h("div", { key: "copy" }, [
        h("h2", { id: "segment-studio-editor-filters-title", className: "text-lg font-semibold text-foreground" }, "Editor filters"),
        h("p", { className: "mt-1 text-sm text-secondary" },
          "These filters apply to the segment rail, swimlanes, selection, counts, and keyboard navigation."),
      ]),
      h("button", {
        key: "close",
        type: "button",
        autoFocus: true,
        onClick: onClose,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground",
      }, "×"),
    ]),
    h("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      reviewMode ? h("fieldset", { key: "approval", className: "space-y-2" }, [
        h("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        h("div", { className: "flex flex-wrap gap-2" }, REVIEW_STATES.map((state) => {
          const selected = normalized.reviewStates.includes(state);
          const presentation = SEGMENT_STATE_PRESENTATION[state];
          return h("button", {
            key: state,
            type: "button",
            onClick: () => toggleReviewState(state),
            "aria-pressed": selected,
            className: optionClass(selected),
          }, `${presentation.symbol} ${state} (${reviewCounts[state] || 0})`);
        })),
      ]) : null,
      reviewMode ? h("fieldset", { key: "performer", className: "space-y-2" }, [
        h("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        h("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        h("div", { className: "flex flex-wrap gap-2" }, [
          h("button", {
            key: "any",
            type: "button",
            onClick: () => update({ performerId: null }),
            "aria-pressed": normalized.performerId == null,
            className: optionClass(normalized.performerId == null),
          }, "All performers"),
          ...performers.map((performer) => {
            const performerId = Number(performerOptionId(performer));
            return h("button", {
              key: performerId,
              type: "button",
              onClick: () => update({ performerId }),
              "aria-pressed": normalized.performerId === performerId,
              className: optionClass(normalized.performerId === performerId),
            }, performer.name);
          }),
        ]),
      ]) : null,
      h("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        h("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          h("span", { key: "label" }, "Tag"),
          h("select", {
            key: "select",
            value: normalized.tagId ?? "",
            onChange: (event) => update({
              tagId: event.target.value === ""
                ? null
                : Number(event.target.value),
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
          }, [
            h("option", { key: "all", value: "" }, "All tags"),
            ...tagOptions.map(([tagId, tagName]) =>
              h("option", { key: tagId, value: tagId }, tagName)),
          ]),
        ]),
        h("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary",
        }, [
          h("span", { key: "label" }, "Segment group"),
          h("select", {
            key: "select",
            value: normalized.segmentGroupId ?? "",
            onChange: (event) => update({
              segmentGroupId: event.target.value === ""
                ? null
                : event.target.value === "ungrouped"
                  ? "ungrouped"
                  : Number(event.target.value),
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
          }, [
            h("option", { key: "all", value: "" }, "All Segment groups"),
            ...(segmentGroups || []).map((group) =>
              h("option", { key: group.id, value: group.id }, group.name)),
            h("option", { key: "ungrouped", value: "ungrouped" }, "Ungrouped"),
          ]),
        ]),
      ]),
      h("fieldset", { key: "provenance", className: "space-y-2" }, [
        h("legend", { className: "text-sm font-semibold text-foreground" }, "Provenance"),
        h("div", { className: "flex flex-wrap gap-2" }, [
          h("button", {
            key: "all",
            type: "button",
            onClick: () => update({ sourceKey: null }),
            "aria-pressed": normalized.sourceKey == null,
            className: optionClass(normalized.sourceKey == null),
          }, "All provenance"),
          ...provenanceSources.map((sourceKey) => h("button", {
            key: sourceKey,
            type: "button",
            onClick: () => update({ sourceKey }),
            "aria-pressed": normalized.sourceKey === sourceKey,
            title: sourceKey,
            className: optionClass(normalized.sourceKey === sourceKey),
          }, provenanceSourceLabel(sourceKey))),
        ]),
      ]),
      h("fieldset", { key: "confidence", className: "space-y-3" }, [
        h("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        h("p", { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."),
        h(DualRangeSlider, {
          minimum: normalized.confidenceMin,
          maximum: normalized.confidenceMax,
          onChange: ({ minimum, maximum }) => update({
            confidenceMin: minimum,
            confidenceMax: maximum,
          }),
        }),
        h("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary",
        }, [
          h("input", {
            key: "input",
            type: "checkbox",
            checked: normalized.includeUnscored,
            onChange: (event) => update({
              includeUnscored: event.target.checked,
            }),
            className: "h-4 w-4 accent-[var(--color-accent)]",
          }),
          h("span", { key: "label" }, "Include unscored segments"),
        ]),
      ]),
      reviewMode ? h("label", { key: "derived", className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground" }, [
        h("input", {
          key: "input",
          type: "checkbox",
          checked: hideDerivedSegments,
          onChange: (event) => onHideDerivedChange(event.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]",
        }),
        h(DerivedVisibilityIcon, { key: "icon", hidden: hideDerivedSegments }),
        h("span", { key: "label" }, "Hide derived segments"),
      ]) : null,
    ]),
    h("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      h("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          onChange(normalizeEditorSegmentFilters({}));
          if (reviewMode) onHideDerivedChange(false);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40",
      }, "Reset filters"),
      h("button", {
        key: "done",
        type: "button",
        onClick: onClose,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground",
      }, "Done"),
    ]),
  ]));
}

export { DualRangeSlider, FirstSegmentTagDialog, EditorFiltersDialog };
