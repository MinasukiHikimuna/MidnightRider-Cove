import { h, useEffect, useMemo, useRef, useState } from "../../shared/runtime.js";

import { resolveSegmentStudioShortcuts, shortcutAvailableInMode, shortcutBindingLabel, splitShortcutCategoriesIntoColumns } from "../model/shortcuts.js";

import { formatTime } from "../../shared/api.js";

import { filterSegmentQuickSearch, groupAutoAssignCandidates, shouldShowQuickSearchGroups } from "../../discovery/model.js";

import { SegmentStateBadge, handleModalKey, segmentGroupHeaderBackground, trapModalFocus } from "../../shared/presentation.js";

import { PerformerAvatar, PerformerSublaneAvatars } from "../model/swimlanes.js";

import { LaneReviewCounts } from "../PerformerSlotEditors.js";

import { provenanceSourceLabel } from "../SegmentDetails.js";

import { groupIncorrectExamplesByTag } from "../model/feedback.js";

function KeyboardShortcutsDialog({ reviewMode, overrides, onClose }) {
  const visibleShortcuts = resolveSegmentStudioShortcuts(overrides)
    .filter((shortcut) => shortcutAvailableInMode(shortcut, reviewMode));
  const categoryGroups = splitShortcutCategoriesIntoColumns(visibleShortcuts, 1)[0];
  const categoryColumns = splitShortcutCategoriesIntoColumns(visibleShortcuts);
  const renderCategorySection = ({ category, shortcuts }) => {
    const rows = shortcuts.map((shortcut) => h("div", { key: shortcut.id, className: "flex items-center justify-between text-sm" }, [
        h("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, shortcut.description),
        h("span", { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" }, shortcut.bindings.map((binding, index) =>
          h("kbd", { key: `${shortcut.id}:${index}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, shortcutBindingLabel(binding)))),
      ]));
    return h("section", { key: category, className: "space-y-2", "aria-label": `${category} shortcuts` }, [
      h("h3", { key: "heading", className: "mb-3 font-semibold text-primary" }, category),
      h("div", { key: "items", className: "space-y-1" }, rows),
    ]);
  };
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); },
    onKeyDownCapture: (event) => handleModalKey(event, { onCancel: onClose }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-shortcuts-title",
    className: "flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
  }, [
    h("header", { key: "header", className: "flex shrink-0 items-center justify-between gap-4 p-6 pb-4" }, [
      h("h2", { key: "title", id: "segment-studio-shortcuts-title", className: "text-xl font-bold text-foreground" }, "Keyboard shortcuts"),
      h("button", { key: "close", type: "button", autoFocus: true, onClick: onClose, className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground", "aria-label": "Close keyboard shortcuts" }, "×"),
    ]),
    h("div", { key: "body", className: "min-h-0 overflow-y-auto px-6 pb-6" }, [
      h("div", { key: "mobile", className: "space-y-6 lg:hidden" }, categoryGroups.map(renderCategorySection)),
      h("div", { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
        categoryColumns.map((column, index) => h("div", { key: index, className: "space-y-6" }, column.map(renderCategorySection)))),
    ]),
  ]));
}

function IncorrectExamplesDialog({
  examples, exporting, removingExampleId, onExport, onRemove, onClose,
}) {
  const exampleGroups = groupIncorrectExamplesByTag(examples);
  const [expandedTagNames, setExpandedTagNames] = useState([]);
  const tagNamesFingerprint = exampleGroups
    .map((group) => group.tagName).join("|");
  useEffect(() => {
    const available = new Set(exampleGroups.map((group) => group.tagName));
    setExpandedTagNames((current) =>
      current.filter((tagName) => available.has(tagName)));
  }, [tagNamesFingerprint]);
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => {
      if (event.target === event.currentTarget && !exporting && removingExampleId == null) onClose();
    },
    onKeyDownCapture: (event) => handleModalKey(event, {
      onCancel: exporting || removingExampleId != null ? undefined : onClose,
    }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" },
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      h("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${examples.length} registered-AI example${examples.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`),
    ]),
    h("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
    h("div", { key: "items", className: "space-y-3" }, examples.length
      ? exampleGroups.map((group, groupIndex) => {
        const expanded = expandedTagNames.includes(group.tagName);
        const detailsId = `incorrect-example-tag-${groupIndex}`;
        return h("section", {
          key: group.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card",
        }, [
          h("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": expanded,
            "aria-controls": detailsId,
            onClick: () => setExpandedTagNames((current) =>
              expanded
                ? current.filter((tagName) => tagName !== group.tagName)
                : [...current, group.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: segmentGroupHeaderBackground(false) },
          }, [
            h("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              expanded ? "▾" : "▸"),
            h("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              group.tagName),
            h("span", { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${group.examples.length} example${group.examples.length === 1 ? "" : "s"}`),
          ]),
          expanded ? h("div", {
            key: "examples",
            id: detailsId,
            className: "divide-y divide-border border-t border-border",
          }, group.examples.map((example) => {
            const timeLabel = `${formatTime(example.startSec)}${example.endSec == null ? "" : ` – ${formatTime(example.endSec)}`}`;
            const removing = removingExampleId === example.id;
            return h("div", {
              key: example.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm",
            }, [
              h("span", { key: "time", className: "font-mono text-xs text-secondary" },
                timeLabel),
              h("button", {
                key: "remove",
                type: "button",
                disabled: exporting || removingExampleId != null,
                onClick: () => onRemove(example),
                "aria-label": `${removing ? "Restoring" : "Restore to review"} ${group.tagName} example at ${timeLabel}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50",
              }, removing ? "Restoring…" : "Restore to review"),
            ]);
          })) : null,
        ]);
      })
      : [h("p", { key: "empty", className: "text-sm text-secondary" }, "Select one or more segments and press C to collect incorrect examples.")]),
    h("p", { key: "artifact-help", className: "mt-4 text-xs text-secondary" },
      "The ZIP contains sampled JPEG frames, legacy metadata.json, and a provenance-rich manifest.json. Download it for manual submission; Segment Studio does not upload it automatically."),
    ]),
    h("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      h("button", {
        key: "cancel",
        type: "button",
        autoFocus: true,
        disabled: exporting || removingExampleId != null,
        onClick: onClose,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50",
      }, "Cancel"),
      h("button", {
        key: "confirm",
        type: "button",
        disabled: exporting || removingExampleId != null
          || examples.length === 0,
        onClick: onExport,
        className: "rounded-md border border-cyan-400/60 bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-cyan-500/30 disabled:opacity-50",
      }, exporting ? "Capturing frames…" : `Download ${examples.length} Example${examples.length === 1 ? "" : "s"}`),
    ]),
  ]));
}

function SegmentQuickSearchDialog({ segments, onSelect, onClose }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const activeOptionRef = useRef(null);
  const results = useMemo(() => filterSegmentQuickSearch(segments, query), [segments, query]);
  const selectedIndex = Math.min(activeIndex, Math.max(0, results.length - 1));
  const showGroups = shouldShowQuickSearchGroups(results);
  useEffect(() => {
    activeOptionRef.current?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex, query]);
  const chooseActive = () => {
    const result = results[selectedIndex];
    if (result) onSelect(result.segment || result);
  };
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); },
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (event) => {
      if (event.key === "Tab") {
        trapModalFocus(event);
      } else if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        const offset = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((current) =>
          results.length ? (current + offset + results.length) % results.length : 0);
      } else if (event.key === "Enter" && !event.nativeEvent?.isComposing) {
        event.preventDefault();
        event.stopPropagation();
        chooseActive();
      }
    },
  }, [
    h("header", { key: "header", className: "border-b border-border p-4" }, [
      h("h2", { key: "title", id: "segment-studio-quick-search-title", className: "text-base font-semibold text-foreground" },
        "Select a segment"),
      h("input", {
        key: "input",
        type: "search",
        autoFocus: true,
        value: query,
        onChange: (event) => { setQuery(event.target.value); setActiveIndex(0); },
        placeholder: "Search segment tags…",
        "aria-label": "Search segment tags",
        "aria-controls": "segment-studio-quick-search-results",
        "aria-activedescendant": results[selectedIndex]
          ? `segment-quick-search-${(results[selectedIndex].segment || results[selectedIndex]).id}`
          : undefined,
        className: "mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent",
      }),
    ]),
    h("div", {
      key: "results",
      id: "segment-studio-quick-search-results",
      role: "listbox",
      "aria-label": "Matching segments",
      className: "min-h-0 flex-1 overflow-y-auto p-2",
    }, results.length
      ? results.flatMap((result, index) => {
          const segment = result.segment || result;
          const timeLabel = segment.endSec == null
            ? formatTime(segment.startSec)
            : `${formatTime(segment.startSec)} – ${formatTime(segment.endSec)}`;
          const provenanceLabel = `${provenanceSourceLabel(segment.sourceKey)}${
            segment.confidence == null ? "" : ` · ${Math.round(segment.confidence * 100)}%`}`;
          const active = index === selectedIndex;
          const previousGroupKey = index > 0 ? results[index - 1].groupKey : null;
          const groupHeader = showGroups && result.groupKey !== previousGroupKey
            ? h("div", {
                key: `group:${result.groupKey}`,
                role: "presentation",
                className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0",
              }, result.groupName)
            : null;
          const option = h("button", {
            key: segment.id,
            id: `segment-quick-search-${segment.id}`,
            ref: active ? activeOptionRef : null,
            type: "button",
            role: "option",
            "aria-selected": active,
            onMouseEnter: () => setActiveIndex(index),
            onClick: () => onSelect(segment),
            className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${
              active ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`,
          }, [
            showGroups ? h("span", { key: "group", className: "sr-only" }, `${result.groupName} group`) : null,
            h(SegmentStateBadge, { key: "review", state: segment.reviewState, includeLabel: false }),
            h("span", { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
              segment.tagName || "Tag segment"),
            result.performers?.length ? h(PerformerSublaneAvatars, {
              key: "performers",
              performers: result.performers,
              performerAssignments: result.performerAssignments,
            }) : null,
            h("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
              timeLabel),
            h("span", {
              key: "provenance",
              className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
              title: provenanceLabel,
            }, provenanceLabel),
          ]);
          return groupHeader ? [groupHeader, option] : [option];
        })
      : h("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search.")),
  ]));
}

function groupApprovedDraftsForPublishing(segments) {
  const groups = new Map();
  for (const draft of segments || []) {
    if (draft.published || draft.reviewState !== "approved") continue;
    const key = String(draft.tagId ?? `name:${draft.tagName || ""}`);
    if (!groups.has(key)) groups.set(key, {
      key,
      tagName: draft.tagName || "Tag segment",
      drafts: [],
    });
    groups.get(key).drafts.push(draft);
  }
  return [...groups.values()]
    .map((group) => ({
      ...group,
      drafts: group.drafts.sort((left, right) =>
        left.startSec - right.startSec
          || String(left.id).localeCompare(String(right.id))),
    }))
    .sort((left, right) =>
      left.tagName.localeCompare(right.tagName)
        || left.key.localeCompare(right.key));
}

function ApprovedDraftPublishingDialog({
  drafts, processing, error, cancelButtonRef, onConfirm, onClose,
}) {
  const groups = useMemo(() => groupApprovedDraftsForPublishing(drafts), [drafts]);
  const [expandedGroupKeys, setExpandedGroupKeys] = useState([]);
  const draftCount = groups.reduce((total, group) => total + group.drafts.length, 0);
  const toggleGroup = (key) => setExpandedGroupKeys((current) =>
    current.includes(key)
      ? current.filter((candidate) => candidate !== key)
      : [...current, key]);
  const groupPanelId = (group) =>
    `segment-studio-publish-approved-${group.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget && !processing) onClose(); },
    onKeyDownCapture: (event) => handleModalKey(event, {
      onCancel: processing ? undefined : onClose,
      onConfirm: draftCount > 0 && !processing ? onConfirm : undefined,
    }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" },
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("h2", { key: "title", id: "segment-studio-publish-approved-title", className: "text-lg font-semibold text-foreground" },
        "Publish approved drafts?"),
      h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
        "These approved drafts will become native Cove segments. Expand a tag to inspect timing and provenance before publishing."),
    ]),
    h("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      h("dl", { key: "summary", className: "mb-4 grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 text-sm" }, [
        ["Approved drafts", draftCount],
        ["Tags", groups.length],
      ].flatMap(([label, value]) => [
        h("dt", { key: `${label}:label`, className: "text-secondary" }, label),
        h("dd", { key: `${label}:value`, className: "font-semibold text-foreground" }, String(value)),
      ])),
      groups.length
        ? h("div", { key: "groups", className: "space-y-2" }, groups.map((group) => {
            const expanded = expandedGroupKeys.includes(group.key);
            return h("section", { key: group.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
              h("button", {
                key: "toggle",
                type: "button",
                disabled: processing,
                "aria-expanded": expanded,
                "aria-controls": groupPanelId(group),
                onClick: () => toggleGroup(group.key),
                className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
                style: { background: segmentGroupHeaderBackground(false) },
              }, [
                h("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, expanded ? "▾" : "▸"),
                h("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, group.tagName),
                h("span", { key: "count", className: "shrink-0 text-xs text-secondary" },
                  `${group.drafts.length} draft${group.drafts.length === 1 ? "" : "s"}`),
              ]),
              expanded ? h("div", {
                key: "drafts",
                id: groupPanelId(group),
                className: "divide-y divide-border border-t border-border",
              }, group.drafts.map((draft) => {
                const timeLabel = draft.endSec == null
                  ? formatTime(draft.startSec)
                  : `${formatTime(draft.startSec)} – ${formatTime(draft.endSec)}`;
                const provenanceLabel = `${provenanceSourceLabel(draft.sourceKey)}${
                  draft.confidence == null ? "" : ` · ${Math.round(draft.confidence * 100)}%`}`;
                return h("div", { key: draft.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
                  h(SegmentStateBadge, { key: "review", state: draft.reviewState, includeLabel: false }),
                  h("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, timeLabel),
                  h("span", {
                    key: "provenance",
                    className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                    title: provenanceLabel,
                  }, provenanceLabel),
                ]);
              })) : null,
            ]);
          }))
        : h("p", { key: "empty", className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
            "No unpublished approved drafts are available."),
    ]),
    error ? h("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, error) : null,
    h("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      h("button", {
        key: "cancel",
        ref: cancelButtonRef,
        type: "button",
        autoFocus: true,
        disabled: processing,
        onClick: onClose,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50",
      }, "Cancel"),
      h("button", {
        key: "confirm",
        type: "button",
        disabled: processing || draftCount === 0,
        onClick: onConfirm,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50",
      }, processing ? "Publishing…" : `Publish ${draftCount} approved draft${draftCount === 1 ? "" : "s"}`),
    ]),
  ]));
}

function AutoAssignPerformersDialog({ candidates, processing, error, onConfirm, onClose }) {
  const groups = groupAutoAssignCandidates(candidates);
  const [expandedGroups, setExpandedGroups] = useState(() => new Set());
  const [selectedGroups, setSelectedGroups] = useState(() => new Set(groups.map((group) => group.key)));
  const selectedCandidates = groups.flatMap((group) => selectedGroups.has(group.key) ? group.candidates : []);
  const toggleExpanded = (key) => setExpandedGroups((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });
  const toggleSelected = (key) => setSelectedGroups((current) => {
    const next = new Set(current);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    return next;
  });
  const assignmentLabel = (group) => group.assignment.map(({ slot, performer }) =>
    `${slot.label || `Slot ${slot.sortOrder + 1}`}: ${performer.name}`).join(", ");
  const groupPanelId = (group) => `segment-studio-auto-assign-${group.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget && !processing) onClose(); },
    onKeyDownCapture: (event) => {
      if (event.key === "Enter" && event.target instanceof HTMLInputElement) return;
      handleModalKey(event, {
        onCancel: processing ? undefined : onClose,
        onConfirm: selectedCandidates.length && !processing ? () => onConfirm(selectedCandidates) : undefined,
      });
    },
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("h2", { key: "title", id: "segment-studio-auto-assign-title", className: "text-lg font-semibold text-foreground" }, "Auto-Assign Performers"),
      h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
        `${candidates.length} unfilled segment${candidates.length === 1 ? "" : "s"} ${candidates.length === 1 ? "has" : "have"} one valid complete assignment. Only these reviewed segments can change.`),
    ]),
    h("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" },
      candidates.length
        ? h("div", { className: "space-y-3" }, groups.map((group) =>
            h("section", { key: group.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
              h("header", {
                key: "header",
                className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
                style: { background: segmentGroupHeaderBackground(false) },
              }, [
                h("input", {
                  key: "selected",
                  type: "checkbox",
                  checked: selectedGroups.has(group.key),
                  disabled: processing,
                  onChange: () => toggleSelected(group.key),
                  "aria-label": `Include ${group.tagName} assignment: ${assignmentLabel(group)}`,
                  className: "h-4 w-4 shrink-0 accent-violet-500",
                }),
                h("button", {
                  key: "toggle",
                  type: "button",
                  disabled: processing,
                  "aria-expanded": expandedGroups.has(group.key),
                  "aria-controls": groupPanelId(group),
                  "aria-label": `${expandedGroups.has(group.key) ? "Collapse" : "Expand"} ${group.tagName} assignment: ${assignmentLabel(group)}`,
                  onClick: () => toggleExpanded(group.key),
                  className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50",
                }, expandedGroups.has(group.key) ? "▾" : "▸"),
                h("span", { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
                  group.tagName),
                h("span", { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
                  group.assignment.map(({ slot, performer }) => {
                    const slotLabel = slot.label || `Slot ${slot.sortOrder + 1}`;
                    return h("span", {
                      key: slot.slotDefinitionId,
                      className: "flex items-center gap-1",
                      "aria-label": `${slotLabel}: ${performer.name}`,
                    }, [
                      h("span", {
                        key: "assignment",
                        "aria-hidden": "true",
                        className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                        title: `${slotLabel}: ${performer.name}`,
                      }, `${slotLabel}: ${performer.name}`),
                      h(PerformerAvatar, {
                        key: "avatar",
                        performer: { id: performer.performerId, name: performer.name },
                        compact: true,
                      }),
                    ]);
                  })),
                h(LaneReviewCounts, { key: "states", counts: group.counts }),
                h("button", {
                  key: "assign-group",
                  type: "button",
                  disabled: processing,
                  onClick: () => onConfirm(group.candidates),
                  "aria-label": `Auto-Assign ${group.tagName}: ${assignmentLabel(group)}`,
                  className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50",
                }, `Auto-Assign (${group.candidates.length})`),
              ]),
              expandedGroups.has(group.key) ? h("div", { key: "segments", id: groupPanelId(group), className: "divide-y divide-border/70" },
                group.candidates.map((candidate) => {
                  const timeLabel = candidate.endSec == null
                    ? formatTime(candidate.startSec)
                    : `${formatTime(candidate.startSec)} – ${formatTime(candidate.endSec)}`;
                  const provenanceLabel = `${provenanceSourceLabel(candidate.sourceKey)}${
                    candidate.confidence == null ? "" : ` · ${Math.round(candidate.confidence * 100)}%`}`;
                  return h("div", {
                    key: candidate.id,
                    className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5",
                  }, [
                    h(SegmentStateBadge, { key: "review", state: candidate.reviewState, includeLabel: false }),
                    h("span", { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                      candidate.tagName || "Tag segment"),
                    h("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                      timeLabel),
                    h("span", {
                      key: "provenance",
                      className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                      title: provenanceLabel,
                    }, provenanceLabel),
                  ]);
                })) : null,
            ])))
        : h("p", { className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
            "No segments have completely unfilled performer slots.")),
    error ? h("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, error) : null,
    h("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      h("button", { key: "cancel", type: "button", disabled: processing, onClick: onClose, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      h("button", {
        key: "confirm",
        type: "button",
        autoFocus: true,
        disabled: processing || selectedCandidates.length === 0,
        onClick: () => onConfirm(selectedCandidates),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50",
      }, processing ? "Assigning…" : `Auto-Assign ${selectedCandidates.length} Segment${selectedCandidates.length === 1 ? "" : "s"}`),
    ]),
  ]));
}

function MergeSelectionDialog({
  merge,
  processing,
  undoable = false,
  cancelButtonRef,
  onConfirm,
  onClose,
}) {
  const [skipFuture, setSkipFuture] = useState(false);
  if (!merge) return null;
  const endLabel = merge.endSec == null ? "open end" : formatTime(merge.endSec);
  return h("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (event) => { if (event.target === event.currentTarget && !processing) onClose(); },
    onKeyDownCapture: (event) => handleModalKey(event, {
      onCancel: processing ? undefined : onClose,
      onConfirm: processing ? undefined : () => onConfirm(skipFuture),
    }),
  }, h("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: trapModalFocus,
    className: "w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl",
  }, [
    h("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      h("h2", { key: "title", id: "segment-studio-merge-title", className: "text-lg font-semibold text-foreground" },
        `Merge ${merge.segments.length} selected segments?`),
      h("p", { key: "range", className: "mt-1 font-mono text-xs text-secondary" },
        `${formatTime(merge.startSec)} – ${endLabel}`),
    ]),
    h("div", { key: "body", className: "space-y-3 px-5 py-4 text-sm text-secondary" }, [
      h("p", { key: "survivor" },
        undoable
          ? "The chronologically first segment is retained and replaces the other selected native ranges."
          : "The chronologically first segment is retained and the others are permanently removed."),
      h("p", { key: "provenance" },
        undoable
          ? "The merged result becomes manually sourced. You can undo the native merge from the editor toolbar."
          : "The merged result becomes manually sourced; model, confidence, and active provenance are removed. This cannot be undone."),
      h("label", { key: "skip", className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-foreground" }, [
        h("input", {
          key: "input",
          type: "checkbox",
          checked: skipFuture,
          onChange: (event) => setSkipFuture(event.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]",
        }),
        h("span", { key: "label" }, "Do not ask again"),
      ]),
    ]),
    h("footer", { key: "footer", className: "flex justify-end gap-2 border-t border-border px-5 py-4" }, [
      h("button", {
        key: "cancel",
        ref: cancelButtonRef,
        type: "button",
        autoFocus: true,
        disabled: processing,
        onClick: onClose,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50",
      }, "Cancel"),
      h("button", {
        key: "confirm",
        type: "button",
        disabled: processing,
        onClick: () => onConfirm(skipFuture),
        className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25 disabled:opacity-50",
      }, processing ? "Merging…" : "Merge segments"),
    ]),
  ]));
}

export { KeyboardShortcutsDialog, IncorrectExamplesDialog, SegmentQuickSearchDialog, ApprovedDraftPublishingDialog, AutoAssignPerformersDialog, MergeSelectionDialog, groupApprovedDraftsForPublishing };
