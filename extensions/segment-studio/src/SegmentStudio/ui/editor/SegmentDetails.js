import { h, useEffect, useState } from "../shared/runtime.js";

import { formatTime } from "../shared/api.js";

import { SegmentStateBadge } from "../shared/presentation.js";

import { laneReviewCounts, selectedSwimlaneMerge, swimlaneDisplayLabel } from "./model/swimlanes.js";

import { multiSelectionActionHint } from "./model/history.js";

import { LaneReviewCounts } from "./PerformerSlotEditors.js";

export function provenanceSourceLabel(sourceKey, sourceDisplayName = null) {
  const key = String(sourceKey || "").trim().toLowerCase();
  if (key === "ext:segment-studio:stash-marker-studio" || key === "stash-marker-studio"
    || key === "stash-marker-studio:manual")
    return "Stash Marker Studio · legacy";
  if (key === "stash-marker-studio:skier-ai") return "Stash Marker Studio AI · legacy";
  if (key === "segment-studio/user" || key === "user") return "Manual";
  if (key === "ext:ai.tagging") return "Cove AI Tagging";
  if (sourceDisplayName?.trim()) return sourceDisplayName.trim();
  if (key === "tpdb") return "TPDB";
  if (!key) return "Origin unavailable";
  return key.split(/[:/._-]+/).filter(Boolean).slice(-2)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}

export function compactProvenanceSummary(provenance, fallbackSourceKey) {
  if (provenance?.loading) return "Loading origin…";
  const assertions = Array.isArray(provenance?.items) ? provenance.items : [];
  if (assertions.length === 0) return provenanceSourceLabel(fallbackSourceKey);
  const labels = [...new Set(assertions.map((assertion) =>
    provenanceSourceLabel(assertion.sourceKey, assertion.sourceDisplayName)))];
  return labels.length === 1 ? labels[0] : `${labels[0]} +${labels.length - 1}`;
}

function DerivedSegmentIcon() {
  return h("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent",
  }, "↳");
}

function EditorToolbarIcon({ name }) {
  const paths = {
    filter: [
      h("path", { key: "shape", d: "M3 5h18l-7 8v5l-4 2v-7L3 5Z" }),
    ],
    keyboard: [
      h("rect", { key: "frame", x: "3", y: "6", width: "18", height: "12", rx: "2" }),
      h("path", { key: "keys", d: "M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h.01M11 14h6" }),
    ],
    history: [
      h("path", { key: "shape", d: "M3 12a9 9 0 1 0 3-6.7L3 8" }),
      h("path", { key: "arrow", d: "M3 3v5h5M12 7v5l3 2" }),
    ],
    list: [
      h("path", { key: "rows", d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" }),
    ],
  };
  return h("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: "h-3.5 w-3.5 shrink-0",
  }, paths[name] || null);
}

function DerivedVisibilityIcon({ hidden }) {
  return h("span", { className: "flex items-center gap-0.5", "aria-hidden": "true" }, [
    h("svg", {
      key: "eye",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      className: "h-4 w-4",
    }, [
      h("path", { key: "outline", d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" }),
      h("circle", { key: "pupil", cx: 12, cy: 12, r: 2.5 }),
      hidden ? h("path", { key: "slash", d: "M4 4l16 16" }) : null,
    ]),
    h(DerivedSegmentIcon, { key: "derived" }),
  ]);
}

function SegmentProvenanceDisclosure({ segment, provenance }) {
  const [open, setOpen] = useState(false);
  const provenanceKey = segment.itemId != null
    ? `item:${segment.itemId}`
    : segment.nativeSegmentId != null
      ? `native:${segment.nativeSegmentId}`
      : null;
  const currentProvenance = provenance.key === provenanceKey
    ? provenance
    : { loading: true, error: null, items: [] };
  const assertions = Array.isArray(currentProvenance.items) ? currentProvenance.items : [];
  const detailsId = `segment-provenance-${segment.id}`;
  const summary = compactProvenanceSummary(currentProvenance, segment.sourceKey);
  const confidence = segment.confidence == null
    ? ""
    : ` · ${Math.round(segment.confidence * 100)}%`;
  return h("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    h("button", {
      key: "toggle",
      type: "button",
      onClick: () => setOpen((value) => !value),
      "aria-expanded": open,
      "aria-controls": detailsId,
      className: "flex w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left",
    }, [
      h("span", { key: "chevron", "aria-hidden": "true", className: "w-3 shrink-0 text-[10px] text-secondary" }, open ? "▼" : "▶"),
      h("span", { key: "heading", className: "shrink-0 text-[11px] font-semibold text-foreground" }, "Provenance"),
      h("span", { key: "summary", className: "min-w-0 flex-1 truncate text-right text-[11px] text-secondary" },
        `${summary}${confidence}`),
    ]),
    open ? h("div", { key: "details", id: detailsId, className: "space-y-2 border-t border-border px-3 py-2" },
      currentProvenance.loading
        ? h("p", { className: "text-xs text-secondary" }, "Loading provenance…")
        : currentProvenance.error
          ? h("p", { className: "text-xs text-secondary" }, currentProvenance.error)
          : assertions.length === 0
            ? h("p", { className: "text-xs text-secondary" },
              segment.sourceKey?.includes("stash-marker-studio")
                ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment."
                : "No detailed provenance was recorded for this segment.")
            : assertions.map((assertion) => {
              const model = assertion.modelIdentifier || assertion.modelKey;
              const value = assertion.value == null
                ? null
                : typeof assertion.value === "string"
                  ? assertion.value
                  : JSON.stringify(assertion.value);
              return h("div", { key: assertion.id || `${assertion.fieldKey}:${assertion.sourceKey}:${assertion.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
                h("div", { key: "source", className: "font-medium text-foreground" },
                  provenanceSourceLabel(assertion.sourceKey, assertion.sourceDisplayName)),
                assertion.fieldKey
                  ? h("div", { key: "field", className: "text-secondary" },
                    `Field ${assertion.fieldKey}${value == null ? "" : ` · ${value}`}`)
                  : null,
                assertion.relation === "inherited"
                  ? h("div", { key: "relation", className: "text-secondary" }, "Inherited origin")
                  : null,
                model ? h("div", { key: "model", className: "text-secondary" },
                  `Model ${model}${assertion.modelVersion ? ` · ${assertion.modelVersion}` : ""}`) : null,
                assertion.activityExternalRunId || assertion.sourceRunId
                  ? h("div", { key: "run", className: "break-all text-secondary" }, `Run ${assertion.activityExternalRunId || assertion.sourceRunId}`)
                  : null,
                assertion.confidence != null
                  ? h("div", { key: "confidence", className: "text-secondary" },
                    `Confidence ${Math.round(assertion.confidence * 100)}%`) : null,
                assertion.recordedAt || assertion.createdAt
                  ? h("div", { key: "recorded", className: "text-secondary" }, `Recorded ${assertion.recordedAt || assertion.createdAt}`) : null,
              ]);
            })) : null,
  ]);
}

function MultiSegmentSelectionDetails({
  selectedGroups,
  selectedSegments,
  activeSegmentId,
  detailPanelRef,
  onReduceSelection,
  reviewable,
  tagEditable,
  slotsEditable,
  onEditSlots,
  slotButtonRef,
  saveMessage,
}) {
  const [expandedLaneKeys, setExpandedLaneKeys] = useState([]);
  const selectedLaneKeys = selectedGroups.flatMap((group) => group.lanes.map((lane) => lane.key));
  const selectedLaneKeysFingerprint = selectedLaneKeys.join("|");
  useEffect(() => {
    const available = new Set(selectedLaneKeys);
    setExpandedLaneKeys((current) => current.filter((key) => available.has(key)));
  }, [selectedLaneKeysFingerprint]);
  const counts = laneReviewCounts(selectedSegments);
  const mergeable = Boolean(selectedSwimlaneMerge(
    selectedGroups,
    { nativeOnly: !reviewable },
  ));

  return h("section", {
    ref: detailPanelRef,
    tabIndex: -1,
    "aria-label": "Selected segment details",
    className: "min-h-0 space-y-3 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent",
  }, [
    h("header", { key: "summary", className: "space-y-1" }, [
      h("div", { key: "title", className: "text-sm font-semibold text-foreground" },
        `${selectedSegments.length} segments selected`),
      h("div", { key: "scope", className: "text-xs text-secondary" },
        `${selectedLaneKeys.length} swimlane${selectedLaneKeys.length === 1 ? "" : "s"} · ${selectedGroups.length} group${selectedGroups.length === 1 ? "" : "s"}`),
      reviewable ? h(LaneReviewCounts, { key: "counts", counts }) : null,
    ]),
    h("p", { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      multiSelectionActionHint({ mergeable, reviewable, tagEditable, slotsEditable })),
    slotsEditable ? h("button", {
      key: "slots",
      ref: slotButtonRef,
      type: "button",
      onClick: onEditSlots,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40",
    }, "Edit performer slots") : null,
    saveMessage ? h("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary",
    }, saveMessage) : null,
    ...selectedGroups.map((group) => h("section", {
      key: group.key,
      "data-selected-segment-group": group.key,
      className: "space-y-1.5",
    }, [
      h("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        h("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, group.name),
        h("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${group.selectedCount} selected`),
      ]),
      ...group.lanes.map((lane) => {
        const expanded = expandedLaneKeys.includes(lane.key);
        const containsActive = lane.markers.some(({ segment }) => segment.id === activeSegmentId);
        const detailsId = `selected-segment-lane-${lane.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return h("div", {
          key: lane.key,
          "data-selected-segment-lane": lane.key,
          className: `rounded-md border ${containsActive ? "border-accent bg-accent/10" : "border-border bg-surface"}`,
        }, [
          h("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": expanded,
            "aria-controls": detailsId,
            "aria-current": containsActive ? "true" : undefined,
            onClick: () => setExpandedLaneKeys((current) =>
              expanded ? current.filter((key) => key !== lane.key) : [...current, lane.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left",
          }, [
            h("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, expanded ? "▾" : "▸"),
            h("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, swimlaneDisplayLabel(lane)),
            h("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(lane.selectedCount)),
            reviewable
              ? h(LaneReviewCounts, { key: "states", counts: lane.counts })
              : null,
          ]),
          expanded ? h("div", {
            key: "segments",
            id: detailsId,
            className: "space-y-1 border-t border-border p-1.5",
          }, lane.markers.map(({ segment }) => {
            const timeLabel = segment.endSec == null
              ? formatTime(segment.startSec)
              : `${formatTime(segment.startSec)} – ${formatTime(segment.endSec)}`;
            return h("button", {
              key: segment.id,
              type: "button",
              onClick: () => onReduceSelection(segment),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${segment.id === activeSegmentId ? "bg-accent/15" : ""}`,
              "aria-label": reviewable
                ? `${segment.tagName || "Segment"}, ${segment.reviewState}, ${timeLabel}`
                : `${segment.tagName || "Segment"}, ${timeLabel}`,
              "aria-current": segment.id === activeSegmentId ? "true" : undefined,
            }, [
              reviewable
                ? h(SegmentStateBadge, {
                  key: "state", state: segment.reviewState, includeLabel: false,
                })
                : null,
              segment.isDerived ? h(DerivedSegmentIcon, { key: "derived" }) : null,
              h("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, timeLabel),
              h("span", { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                provenanceSourceLabel(segment.sourceKey)),
            ]);
          })) : null,
        ]);
      }),
    ])),
  ]);
}

export { DerivedSegmentIcon, EditorToolbarIcon, DerivedVisibilityIcon, SegmentProvenanceDisclosure, MultiSegmentSelectionDetails };
