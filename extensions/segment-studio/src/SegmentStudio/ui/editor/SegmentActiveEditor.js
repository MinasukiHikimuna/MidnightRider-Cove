import { EntityReferenceSelector, React, h, useEffect, useRef, useState } from "../shared/runtime.js";

import { formatTime } from "../shared/api.js";

import { SegmentStateBadge, handleModalKey, shouldAcceptCurrentTagFromEnter } from "../shared/presentation.js";

import { PerformerAssignmentRows } from "./model/swimlanes.js";

import { performerSlotPresentation, sharedTagPerformerSlotShape } from "./model/history.js";

import { MultiPerformerSlotAssignmentEditor, PerformerSlotAssignmentEditor, PerformerSlotStatusBadge } from "./PerformerSlotEditors.js";

import { DerivedSegmentIcon, MultiSegmentSelectionDetails, SegmentProvenanceDisclosure } from "./SegmentDetails.js";

function SegmentActiveEditor({
  compatibilityMode, selectedSegment, selectedSegments = [], selectedGroups = [], saveMessage, savingSegmentId,
  saveTag,
  saveTiming,
  slotStatus, performerSlotsAvailable, selectedPerformerSlots, performerSlots, detail, video, slotButtonRef, tagSearchRef,
  onSlotsChanged, onRecordHistory, splitSegment, duplicateSegment, provenance, lineage, onNavigateLineageItem,
  tagEditing, onCancelTagEditing, detailPanelRef, onReduceSelection,
}) {
  const scrollRef = useRef(null);
  const slotDialogRef = useRef(null);
  const confirmSlotButtonRef = useRef(null);
  const recommendationShortcutRef = useRef(null);
  const multiRecommendationShortcutRef = useRef(null);
  const [slotsOpen, setSlotsOpen] = useState(false);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setSlotsOpen(false);
  }, [selectedSegment?.id]);

  useEffect(() => {
    if (!slotsOpen) return undefined;
    slotDialogRef.current?.querySelector("input, select, button")?.focus({ preventScroll: true });
    return undefined;
  }, [slotsOpen]);

  function closeSlots() {
    setSlotsOpen(false);
    requestAnimationFrame(() => slotButtonRef.current?.focus({ preventScroll: true }));
  }

  if (selectedSegments.length > 1) {
    const tagEditable = !selectedSegments.some((segment) => segment.isDerived);
    const sharedSlotSets = compatibilityMode && performerSlotsAvailable
      ? sharedTagPerformerSlotShape(performerSlots, selectedSegments)
      : null;
    const slotTargets = sharedSlotSets?.map((slots, index) => {
      const segment = selectedSegments[index];
      return {
        segmentId: segment.nativeSegmentId,
        itemId: segment.published ? null : segment.itemId,
        revision: detail.performerSlotRevisions?.[segment.id],
        slots,
      };
    }) || [];
    return h(React.Fragment, null, [
      h(MultiSegmentSelectionDetails, {
        key: "details",
        selectedGroups,
        selectedSegments,
        activeSegmentId: selectedSegment?.id,
        detailPanelRef,
        onReduceSelection,
        reviewable: compatibilityMode,
        tagEditable,
        slotsEditable: slotTargets.length > 0,
        onEditSlots: () => setSlotsOpen(true),
        slotButtonRef,
        saveMessage,
      }),
      tagEditing && tagEditable ? h("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (event) => { if (event.target === event.currentTarget) onCancelTagEditing(); },
        onKeyDownCapture: (event) => handleModalKey(event, { onCancel: onCancelTagEditing }),
      }, h("section", {
        ref: tagSearchRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "segment-studio-multi-tag-dialog-title",
        className: "w-full max-w-lg space-y-3 rounded-lg border border-border bg-card p-4 shadow-2xl",
      }, [
        h("header", { key: "header", className: "space-y-1" }, [
          h("h2", {
            key: "title",
            id: "segment-studio-multi-tag-dialog-title",
            className: "text-base font-semibold text-foreground",
          }, `Change tag for ${selectedSegments.length} segments`),
          h("p", { key: "description", className: "text-xs text-secondary" },
            "Choose one tag to apply across the complete selection."),
        ]),
        h(EntityReferenceSelector, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (tagId) => tagId == null ? onCancelTagEditing() : saveTag(tagId),
          disabled: savingSegmentId != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: false,
          allowCreate: false,
        }),
        h("button", {
          key: "cancel",
          type: "button",
          onClick: onCancelTagEditing,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40",
        }, "Cancel"),
      ])) : null,
      slotsOpen && slotTargets.length > 0 ? h("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (event) => { if (event.target === event.currentTarget) closeSlots(); },
        onKeyDownCapture: (event) => {
          const editable = typeof event.target?.closest === "function"
            ? event.target.closest("input, textarea, select, [contenteditable='true']")
            : null;
          if (!editable && !event.repeat && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey
              && /^[1-9]$/.test(event.key)
              && multiRecommendationShortcutRef.current?.(Number(event.key) - 1)) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          handleModalKey(event, { onCancel: closeSlots });
        },
      }, h("section", {
        ref: slotDialogRef,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "segment-studio-multi-slot-dialog-title",
        tabIndex: -1,
        className: "flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
      }, [
        h("header", { key: "header", className: "flex items-start justify-between gap-4 border-b border-border px-4 py-3" }, [
          h("div", { key: "copy" }, [
            h("h2", { key: "title", id: "segment-studio-multi-slot-dialog-title", className: "text-base font-semibold text-foreground" }, "Performer slots"),
            h("p", { key: "description", className: "mt-0.5 text-xs text-secondary" }, "Assign the shared performer-slot shape across the selection."),
          ]),
          h("button", { key: "close", type: "button", onClick: closeSlots, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×"),
        ]),
        h("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, h(MultiPerformerSlotAssignmentEditor, {
          videoId: video.id,
          targets: slotTargets,
          performerCandidates: detail.performerCandidates || [],
          shortcutRef: multiRecommendationShortcutRef,
          onSaved: async ({ beforeState, afterState }) => {
            await onRecordHistory(
              "performer-slots.assign",
              `Assigned performers to ${slotTargets.length} segments`,
              beforeState,
              afterState,
            );
            closeSlots();
            onSlotsChanged();
          },
          onConflict: onSlotsChanged,
        })),
      ])) : null,
    ]);
  }

  return h("div", {
    ref: (node) => {
      scrollRef.current = node;
      if (detailPanelRef) detailPanelRef.current = node;
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent",
  }, [
    h("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      h("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        compatibilityMode && selectedSegment ? h(SegmentStateBadge, { key: "state", state: selectedSegment.reviewState, includeLabel: false }) : null,
        selectedSegment?.isDerived ? h(DerivedSegmentIcon, { key: "derived" }) : null,
        selectedSegment && tagEditing ? h("div", {
          key: "tag-editor",
          ref: tagSearchRef,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              onCancelTagEditing();
            }
          },
          onKeyDown: (event) => {
            if (!shouldAcceptCurrentTagFromEnter(event, selectedSegment.tagName)) return;
            event.preventDefault();
            event.stopPropagation();
            saveTag(selectedSegment.tagId);
          },
        }, h(EntityReferenceSelector, {
            entityType: "tag",
            value: selectedSegment.tagId,
            selectedDisplay: "input",
            selectedLabel: selectedSegment.tagName,
            onChange: (tagId) => tagId == null ? onCancelTagEditing() : saveTag(tagId),
            disabled: savingSegmentId != null || lineage.data?.tagReadOnly === true,
            placeholder: "Find a tag…",
            inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
            creatable: false,
            allowCreate: false,
          })) : selectedSegment
          ? h("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, selectedSegment.tagName || "Tag segment")
          : h("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected"),
      ]),
      selectedSegment ? h("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        h("span", { key: "start" }, formatTime(selectedSegment.startSec)),
        selectedSegment.endSec == null ? null : h("span", { key: "time-separator" }, "–"),
        selectedSegment.endSec == null ? null : h("span", { key: "end" }, formatTime(selectedSegment.endSec)),
      ]) : null,
      compatibilityMode && selectedSegment && (slotStatus === "empty" || slotStatus === "partial")
        ? h("div", { key: "slots-row" }, h(PerformerSlotStatusBadge, { status: slotStatus }))
        : null,
      selectedSegment && performerSlotsAvailable && selectedPerformerSlots.length > 0
        ? h("div", {
            key: "slot-assignments",
            role: "group",
            "aria-label": "Performer slots",
            className: "rounded-md border border-border bg-surface p-2",
          }, h(PerformerAssignmentRows, {
            assignments: selectedPerformerSlots.map((slot) => {
            const presentation = performerSlotPresentation(slot);
              return {
                key: String(slot.slotDefinitionId),
                label: presentation.label,
                performer: presentation.filled
                  ? { id: Number(slot.performerId), name: presentation.performer }
                  : null,
                title: presentation.title,
              };
            }),
          }))
        : null,
      saveMessage ? h("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, saveMessage) : null,
    ]),
    selectedSegment ? h(SegmentProvenanceDisclosure, {
      key: `provenance:${selectedSegment.id}`,
      segment: selectedSegment,
      provenance,
    }) : null,
    selectedSegment ? h("div", { key: "controls", hidden: true }, [
      h("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        h("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        lineage.loading
          ? h("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…")
          : lineage.error
            ? h("p", { key: "error", className: "mt-1 text-xs text-secondary" }, lineage.error)
            : lineage.data
              ? h("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
                  h("p", { key: "summary" },
                    `${lineage.data.derived ? "Derived segment" : "Root segment"} · ${lineage.data.componentSize} segment${lineage.data.componentSize === 1 ? "" : "s"} · ${lineage.data.integrityState}`),
                  lineage.data.parents?.length
                    ? h("div", { key: "parents" }, [
                        h("span", { key: "label" }, "Parents: "),
                        ...lineage.data.parents.map((parent) => h("button", {
                          key: parent.nodeId,
                          type: "button",
                          onClick: () => onNavigateLineageItem(parent.itemId),
                          className: "mr-1 underline decoration-dotted hover:text-foreground",
                        }, `${parent.ruleKey} ${parent.ruleVersion}`)),
                      ])
                    : null,
                  lineage.data.children?.length
                    ? h("p", { key: "children" }, `Children: ${lineage.data.children.length}`)
                    : null,
                ])
              : h("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded."),
      ]),
      h("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        h("button", { key: "apply", type: "button", disabled: savingSegmentId != null, onClick: saveTiming, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        compatibilityMode ? h("button", {
          key: "slots",
          ref: slotButtonRef,
          type: "button",
          disabled: !performerSlotsAvailable || selectedPerformerSlots.length === 0,
          onClick: () => setSlotsOpen(true),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: !performerSlotsAvailable ? "Performer slot details are unavailable for your current access."
            : selectedPerformerSlots.length === 0 ? "No performer slots are defined for this segment tag."
            : "Assign performers; candidates matching each slot's gender hints are ranked first.",
        }, selectedPerformerSlots.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        h("button", {
          key: "split",
          type: "button",
          disabled: savingSegmentId != null,
          onClick: splitSegment,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
        }, "Split at playhead"),
        h("button", {
          key: "duplicate",
          type: "button",
          disabled: savingSegmentId != null,
          onClick: () => duplicateSegment(false),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
        }, "Duplicate in place"),
        h("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: savingSegmentId != null,
          onClick: () => duplicateSegment(true),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
        }, "Duplicate at playhead"),
      ]),
    ]) : null,
    slotsOpen && compatibilityMode && selectedSegment && performerSlotsAvailable && selectedPerformerSlots.length > 0
      ? h("div", {
          key: "performer-slot-dialog-overlay",
          className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
          onMouseDown: (event) => { if (event.target === event.currentTarget) closeSlots(); },
          onKeyDownCapture: (event) => {
            const editable = typeof event.target?.closest === "function"
              ? event.target.closest("input, textarea, select, [contenteditable='true']")
              : null;
            if (!editable && !event.repeat && !event.ctrlKey && !event.altKey && !event.metaKey && !event.shiftKey
                && /^[1-9]$/.test(event.key)
                && recommendationShortcutRef.current?.(Number(event.key) - 1)) {
              event.preventDefault();
              event.stopPropagation();
              return;
            }
            handleModalKey(event, {
              onCancel: closeSlots,
              onConfirm: () => confirmSlotButtonRef.current?.click(),
            });
          },
        }, h("section", {
          ref: slotDialogRef,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": "segment-studio-slot-dialog-title",
          "data-performer-slot-dialog": "true",
          className: "flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
        }, [
          h("header", { key: "header", className: "flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-3" }, [
            h("div", { key: "copy" }, [
              h("h2", { key: "title", id: "segment-studio-slot-dialog-title", className: "text-base font-semibold text-foreground" }, "Performer slots"),
              h("p", { key: "description", className: "mt-0.5 text-xs text-secondary" }, "Candidates matching each slot's gender hints are ranked first."),
            ]),
            h("button", { key: "close", type: "button", onClick: closeSlots, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×"),
          ]),
          h("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, h(PerformerSlotAssignmentEditor, {
            key: `${selectedSegment.id}:${detail.performerSlotsRevision || detail.slotRevision || ""}`,
            videoId: video.id,
            segmentId: selectedSegment.nativeSegmentId,
            itemId: selectedSegment.published ? null : selectedSegment.itemId,
            slots: selectedPerformerSlots,
            revision: detail.performerSlotRevisions?.[selectedSegment.id],
            performerCandidates: detail.performerCandidates || [],
            confirmRef: confirmSlotButtonRef,
            shortcutRef: recommendationShortcutRef,
            onSaved: async (saved, { beforeState, afterState }) => {
              await onRecordHistory(
                "performer-slots.assign",
                "Assigned performers",
                beforeState,
                afterState,
              );
              closeSlots();
              onSlotsChanged(saved);
            },
            onConflict: onSlotsChanged,
          })),
        ]))
      : null,
  ]);
}

export { SegmentActiveEditor };
