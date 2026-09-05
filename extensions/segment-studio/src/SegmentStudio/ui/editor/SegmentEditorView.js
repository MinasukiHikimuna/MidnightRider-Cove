import { formatTime } from "../shared/api.js";
import { DerivedSegmentIcon, EditorToolbarIcon, provenanceSourceLabel } from "./SegmentDetails.js";
import { h, useExtensionKeyboardBindings, useMemo, VideoPlayer } from "../shared/runtime.js";
import { segmentRailItemStyle, SegmentStateBadge } from "../shared/presentation.js";
import { setBackLinkNavigation } from "../discovery/components.js";
import { PerformerAvatar, PerformerSublaneAvatars, swimlaneDisplayLabel } from "./model/swimlanes.js";
import { buildSegmentQuickSearchEntries, performerOptionId, performInitialSegmentSeek } from "../discovery/model.js";
import { LaneReviewCounts } from "./PerformerSlotEditors.js";
import { SegmentStudioBinAction, SegmentStudioSettingsAction } from "../shared/navigation.js";
import { EditorFiltersDialog, FirstSegmentTagDialog } from "./dialogs/EditorFiltersDialog.js";
import { ApprovedDraftPublishingDialog, AutoAssignPerformersDialog, IncorrectExamplesDialog, KeyboardShortcutsDialog, MergeSelectionDialog, SegmentQuickSearchDialog } from "./dialogs/EditorDialogs.js";
import { DerivedSegmentMaterializationDialog } from "./dialogs/MaterializationDialog.js";
import { SegmentActiveEditor } from "./SegmentActiveEditor.js";
import { DEFAULT_EDITOR_LAYOUT } from "../shared/constants.js";
import { SwimlaneTimeline } from "./SwimlaneTimeline.js";
import { InlineTagConfigurationDialog } from "./dialogs/InlineTagConfigurationDialog.js";
import { ChevronDown } from "@cove/runtime/lucide-react";

function SegmentEditorView(props) {
  const { activeFilterCount, allSwimlanes, analysisError, analysisRun, analysisStatus, approvalFacetCounts, autoAssignCandidates, autoAssignError, autoAssignOpen, autoAssignPerformers, autoAssigning, captureTrainingExport, centerTimelineRef, closeEditorFilters, closeFirstSegmentTagDialog, closeMaterializeDialog, closeMergeConfirmation, closePublishApprovedDialog, closeTagEditing, collapsedSegmentGroups, compatibilityMode, configuringTag, createSegment, currentTime, detail, detailPanelRef, detailWidth, duplicateSegment, editorFilters, editorLayout, editorRef, exportingExamples, filtersButtonRef, filtersOpen, firstSegmentTagOpen, focusRowRef, handleSeparatorKeyDown, handleSeparatorPointerDown, handleSeparatorPointerMove, hideDerivedSegments, history, historyOpen, historySaving, horizontalLayoutSize, importNativeSegments, incorrectExamples, incorrectExamplesOpen, lineage, markerRailWidth, materializeButtonRef, materializeCancelButtonRef, materializeDerivedSegments, materializeError, materializeLoading, materializeOpen, materializePreview, materializing, mediaStackRef, mergeCancelButtonRef, mergeConfirmation, mergeSavingRef, mergeSelectedSwimlane, nativeImportState, onNavigate, onReload, onSlotsChanged, openPublishApprovedDialog, panelSeparatorProps, pendingInitialSeekRef, performerSlots, performerSlotsAvailable, playbackControlsRef, previewDerivedSegments, provenance, provenanceSources, publishApprovedCancelButtonRef, publishApprovedDrafts, publishApprovedError, publishApprovedOpen, quickSearchOpen, railScrollRef, railToggleRef, recordHistoryAction, removeIncorrectExample, removingExampleId, restoreHistoryTarget, saveMessage, saveTag, saveTiming, savingSegmentId, seekRef, segmentGroups, segmentRailLayout, segments, selectAllVideoSegments, selectSegment, selectSegmentCollection, selectedGroups, selectedPerformerSlots, selectedSegment, selectedSegmentGroupKey, selectedSegmentIds, selectedSegments, selectedSlotStatus, setAutoAssignError, setAutoAssignOpen, setConfiguringTag, setCurrentTime, setEditorFilters, setEditorLayout, setFiltersOpen, setHideDerivedSegments, setHistoryOpen, setIncorrectExamplesOpen, setQuickSearchOpen, setRailViewport, setSelectedSegmentGroupKey, setSelectedSegmentId, setShortcutsOpen, setTimelineZoom, shotBoundaries, shortcutsOpen, slotButtonRef, splitLayout, splitSegment, startFullAnalysis, tagEditing, tagSearchRef, timelineDuration, timelineRatioBounds, timelineZoom, toggleSegmentGroup, toggleSegmentRail, updateTimelineRatio, video, videoPerformers, visibleCounts, visibleSegmentRailRows, visibleSegments, wideLayout, workspaceRef } = props;
  const approvedDrafts = useMemo(
    () => segments.filter((segment) => !segment.published && segment.reviewState === "approved"),
    [segments],
  );
  const shortcutBindings = useExtensionKeyboardBindings("segment-studio");
  const approvedDraftCount = approvedDrafts.length;
  const materializeChangeCount = materializePreview
    ? materializePreview.createCount + materializePreview.linkCount
    : null;

  function renderSegmentRailItem(segment) {
      const selected = selectedSegmentIds.includes(segment.id);
      const active = segment.id === selectedSegment?.id;
      const timeLabel = segment.endSec == null ? formatTime(segment.startSec) : `${formatTime(segment.startSec)} – ${formatTime(segment.endSec)}`;
      const provenanceLabel = `${provenanceSourceLabel(segment.sourceKey)}${segment.confidence != null ? ` · ${Math.round(segment.confidence * 100)}%` : ""}`;
      return h("button", {
        key: segment.id,
        type: "button",
        onClick: (event) => selectSegment(segment, { additive: event.metaKey || event.ctrlKey }),
        "aria-pressed": selected,
        "aria-current": active ? "true" : undefined,
        "data-selected-segment-shortcut-target": active ? "true" : undefined,
        "aria-label": compatibilityMode ? `${segment.tagName || "Tag segment"}, ${segment.reviewState}${segment.isDerived ? ", derived segment" : ""}, ${timeLabel}` : `${segment.tagName || "Tag segment"}${segment.isDerived ? ", derived segment" : ""}, ${timeLabel}`,
        className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
        style: segmentRailItemStyle(selected, active),
      }, [
        h("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
          compatibilityMode ? h(SegmentStateBadge, { key: "review", state: segment.reviewState, includeLabel: false }) : null,
          segment.isDerived ? h(DerivedSegmentIcon, { key: "derived" }) : null,
          h("span", { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
            segment.tagName || "Tag segment"),
          h("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, timeLabel),
          h("span", {
            key: "provenance",
            className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
            title: provenanceLabel,
          }, provenanceLabel),
        ]),
      ]);
    }

  const headerUtilityClass = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50";
  const currentUndoAction = [...(history.actions || [])]
    .reverse()
    .find((action) => action.sequence <= history.cursorSequence);

    return h("section", {
      ref: editorRef,
      tabIndex: -1,
      "aria-label": "Segment Studio segment editor",
      className: `${splitLayout ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`,
    }, [
      h("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
        h("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
          h("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
            h("a", {
              key: "exit",
              href: "/segment-studio",
              onClick: (event) => setBackLinkNavigation(event, onNavigate, { page: "segment-studio" }),
              "aria-label": "Go back",
              title: "Go back",
              className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent",
            }, "←"),
            h("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, h("a", {
              href: `/video/${video.id}`,
              className: "hover:underline focus:underline focus:outline-none",
              title: video.title || `Video ${video.id}`,
            }, video.title || `Video ${video.id}`)),
            ...videoPerformers.map((performer) => h(PerformerAvatar, {
              key: performerOptionId(performer),
              performer: { id: performerOptionId(performer), name: performer.name },
              compact: true,
              tooltip: performer.name,
            })),
            compatibilityMode ? h(LaneReviewCounts, { key: "review-counts", counts: visibleCounts }) : null,
          ]),
          h("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
            !compatibilityMode ? h(SegmentStudioBinAction, { key: "bin", onNavigate, compact: true }) : null,
            h(SegmentStudioSettingsAction, { key: "settings", onNavigate, compact: true }),
          ]),
        ]),
        compatibilityMode && detail.nativeImportCount > 0 ? h("div", {
          key: "native-import",
          className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs",
        }, [
          h("span", { key: "message", className: "mr-auto text-amber-100" },
            `${detail.nativeImportCount} Cove segment${detail.nativeImportCount === 1 ? "" : "s"} ${detail.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`),
          nativeImportState.busy ? h("span", {
            key: "progress",
            role: "status",
            className: "font-medium text-foreground",
          }, nativeImportState.reviewState === "approved"
            ? "Importing as approved…"
            : "Importing for review…") : [
            h("button", {
              key: "review",
              type: "button",
              onClick: () => importNativeSegments("unreviewed"),
              className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20",
            }, "Import for review"),
            h("button", {
              key: "approved",
              type: "button",
              onClick: () => importNativeSegments("approved"),
              className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20",
            }, "Import as approved"),
          ],
          nativeImportState.error ? h("span", {
            key: "error",
            role: "alert",
            className: "w-full text-red-300",
          }, nativeImportState.error) : null,
        ]) : null,
        analysisError && analysisStatus?.configured !== false ? h("div", {
          key: "analysis-error",
          role: "alert",
          className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300",
        }, analysisError) : null,
        h("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
          h("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
            compatibilityMode ? h("div", {
              key: "full-analysis",
              className: "inline-flex items-stretch",
            }, [
              h("button", {
                key: "run",
                type: "button",
                disabled: analysisStatus?.configured === false
                  || analysisStatus?.ready === false
                  || analysisRun?.status === "queued"
                  || analysisRun?.status === "running",
                onClick: () => startFullAnalysis(),
                title: analysisStatus?.error
                  || "Run AI tagging and shot boundary analysis into the Full review workflow",
                className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50",
              }, analysisStatus?.configured === false
              ? "Full Scan not configured"
              : analysisStatus?.ready === false
                ? "Full Scan unavailable"
                : analysisRun?.status === "queued"
              ? "Full Scan queued…"
              : analysisRun?.status === "running"
                ? "Full Scan running…"
                : "Full Scan"),
              h("details", { key: "choices", className: "relative flex" }, [
                h("summary", {
                  key: "summary",
                  "aria-label": "Choose Full Scan analyses",
                  "aria-disabled": analysisStatus?.configured === false
                    || analysisStatus?.ready === false
                    || analysisRun?.status === "queued"
                    || analysisRun?.status === "running",
                  title: "Choose analyses",
                  onClick: (event) => {
                    if (analysisStatus?.configured === false
                      || analysisStatus?.ready === false
                      || analysisRun?.status === "queued"
                      || analysisRun?.status === "running") event.preventDefault();
                  },
                  onKeyDown: (event) => {
                    if ((event.key === "Enter" || event.key === " ")
                      && (analysisStatus?.configured === false
                        || analysisStatus?.ready === false
                        || analysisRun?.status === "queued"
                        || analysisRun?.status === "running")) event.preventDefault();
                  },
                  className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${analysisStatus?.configured === false
                    || analysisStatus?.ready === false
                    || analysisRun?.status === "queued"
                    || analysisRun?.status === "running"
                    ? "pointer-events-none cursor-default opacity-50"
                    : "cursor-pointer hover:opacity-90"}`,
                }, h(ChevronDown, { className: "h-4 w-4" })),
                h("div", {
                  key: "menu",
                  className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl",
                }, [
                  ["AI analysis only", ["aiTagging"]],
                  ["Shot boundaries only", ["omnishotcut"]],
                ].map(([label, analyses]) => h("button", {
                  key: label,
                  type: "button",
                  disabled: analysisStatus?.configured === false
                    || analysisStatus?.ready === false
                    || analysisRun?.status === "queued"
                    || analysisRun?.status === "running",
                  onClick: (event) => {
                    event.currentTarget.closest("details")?.removeAttribute("open");
                    startFullAnalysis(analyses);
                  },
                  className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50",
                }, label))),
              ]),
            ]) : null,
            compatibilityMode ? h("button", {
              key: "auto-assign-performers",
              type: "button",
              disabled: savingSegmentId != null || autoAssignCandidates.length === 0,
              onClick: () => { setAutoAssignError(""); setAutoAssignOpen(true); },
              title: "Auto-assign performers to segments with one valid complete slot match",
              className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50",
            }, `Auto-Assign Performers${autoAssignCandidates.length ? ` (${autoAssignCandidates.length})` : ""}`) : null,
            compatibilityMode ? h("button", {
              key: "materialize-derived",
              ref: materializeButtonRef,
              type: "button",
              disabled: savingSegmentId != null || materializeLoading || materializing
                || materializeChangeCount === 0,
              onClick: previewDerivedSegments,
              title: "Preview and materialize segments implied by derivation rules",
              className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50",
            }, materializeLoading
              ? "Analyzing…"
              : `Auto-Materialize${materializeChangeCount != null ? ` (${materializeChangeCount})` : ""}`) : null,
            compatibilityMode ? h("button", {
              key: "complete-review",
              type: "button",
              disabled: savingSegmentId != null || approvedDraftCount === 0,
              onClick: (event) => openPublishApprovedDialog(event.currentTarget),
              "aria-haspopup": "dialog",
              "aria-expanded": publishApprovedOpen,
              className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50",
            }, `Publish approved${approvedDraftCount ? ` (${approvedDraftCount})` : ""}`) : null,
            h("button", {
              key: "feedback",
              type: "button",
              disabled: exportingExamples || removingExampleId != null
                || incorrectExamples.length === 0,
              onClick: () => setIncorrectExamplesOpen(true),
              "aria-haspopup": "dialog",
              "aria-expanded": incorrectExamplesOpen,
              "aria-label": `Open AI feedback collection, ${incorrectExamples.length} example${incorrectExamples.length === 1 ? "" : "s"}`,
              title: "Manage incorrect examples (Shift+C)",
              className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50",
            }, `AI Feedback${incorrectExamples.length ? ` (${incorrectExamples.length})` : ""}`),
          ]),
          h("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
            h("button", {
              key: "filters",
              ref: filtersButtonRef,
              type: "button",
              onClick: () => setFiltersOpen(true),
              "aria-haspopup": "dialog",
              "aria-expanded": filtersOpen,
              className: `${headerUtilityClass} ${activeFilterCount ? "border-accent bg-accent/20 text-foreground" : ""}`,
            }, [
              h(EditorToolbarIcon, { key: "icon", name: "filter" }),
              h("span", { key: "label" }, `Filter${activeFilterCount ? ` (${activeFilterCount})` : ""}`),
            ]),
            h("button", {
              key: "shortcuts",
              type: "button",
              onClick: () => setShortcutsOpen(true),
              className: headerUtilityClass,
            }, [h(EditorToolbarIcon, { key: "icon", name: "keyboard" }), h("span", { key: "label" }, "Shortcuts")]),
            h("button", {
              key: "history",
              type: "button",
              disabled: (compatibilityMode
                ? history.actions.length === 0
                : currentUndoAction == null)
                || savingSegmentId != null
                || historySaving,
              onClick: compatibilityMode
                ? () => setHistoryOpen((open) => !open)
                : () => restoreHistoryTarget(
                    currentUndoAction.sequence - 1,
                  ),
              "aria-haspopup": compatibilityMode ? "dialog" : undefined,
              "aria-expanded": compatibilityMode ? historyOpen : undefined,
              className: headerUtilityClass,
            }, [
              h(EditorToolbarIcon, { key: "icon", name: "history" }),
              h("span", { key: "label" }, compatibilityMode
                ? `History${history.actions.length ? ` (${history.actions.length})` : ""}`
                : currentUndoAction
                  ? `Undo ${currentUndoAction.label}`
                  : "Undo"),
            ]),
            h("button", {
              key: "rail",
              ref: railToggleRef,
              type: "button",
              onClick: toggleSegmentRail,
              "aria-controls": "segment-studio-segment-rail",
              "aria-expanded": editorLayout.markerRailOpen,
              className: headerUtilityClass,
            }, [
              h(EditorToolbarIcon, { key: "icon", name: "list" }),
              h("span", { key: "label" }, editorLayout.markerRailOpen ? "Hide segment rail" : "Show segment rail"),
            ]),
          ]),
        ]),
      ]),
      compatibilityMode && historyOpen ? h("section", {
        key: "history-panel",
        role: "dialog",
        "aria-label": "Editor history",
        className: "z-20 w-full max-w-md self-end rounded-md border border-border bg-surface p-2 shadow-lg",
      }, [
        h("div", { key: "heading", className: "flex items-center justify-between gap-3 px-2 py-1" }, [
          h("h2", { key: "title", className: "text-sm font-semibold text-foreground" }, "Editor history"),
          h("button", {
            key: "close",
            type: "button",
            onClick: () => setHistoryOpen(false),
            className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40",
          }, "Close"),
        ]),
        h("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
          ...[...history.actions].reverse().map((action) => h("button", {
            key: action.sequence,
            type: "button",
            disabled: historySaving,
            onClick: () => restoreHistoryTarget(action.sequence),
            "aria-current": history.cursorSequence === action.sequence ? "step" : undefined,
            className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${
              action.sequence > history.cursorSequence ? "text-secondary" : "text-foreground"
            } ${history.cursorSequence === action.sequence ? "bg-accent/15" : ""}`,
          }, [
            h("span", { key: "label", className: "min-w-0 flex-1 truncate" }, action.label),
            h("time", {
              key: "time",
              dateTime: action.createdAt,
              className: "shrink-0 text-[10px] text-secondary",
            }, new Date(action.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })),
          ])),
          h("button", {
            key: "baseline",
            type: "button",
            disabled: historySaving,
            onClick: () => restoreHistoryTarget(history.baselineSequence),
            "aria-current": history.cursorSequence === history.baselineSequence ? "step" : undefined,
            className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${
              history.cursorSequence === history.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"
            }`,
          }, "Before recent changes"),
        ]),
      ]) : null,
      filtersOpen ? h(EditorFiltersDialog, {
        key: "editor-filters",
        filters: editorFilters,
        hideDerivedSegments,
        performers: videoPerformers,
        provenanceSources,
        reviewCounts: approvalFacetCounts,
        segments,
        segmentGroups,
        reviewMode: compatibilityMode,
        onChange: setEditorFilters,
        onHideDerivedChange: setHideDerivedSegments,
        onClose: closeEditorFilters,
      }) : null,
      firstSegmentTagOpen ? h(FirstSegmentTagDialog, {
        key: "first-segment-tag-dialog",
        saving: savingSegmentId != null,
        error: saveMessage,
        onSelect: (tagId) => createSegment(tagId),
        onClose: closeFirstSegmentTagDialog,
      }) : null,
      quickSearchOpen ? h(SegmentQuickSearchDialog, {
        key: "quick-search-dialog",
        segments: buildSegmentQuickSearchEntries(allSwimlanes),
        onSelect: (segment) => {
          setQuickSearchOpen(false);
          selectSegment(segment, { focusEditor: true, seekToSegment: false });
        },
        onClose: () => {
          setQuickSearchOpen(false);
          requestAnimationFrame(() => editorRef.current?.focus({ preventScroll: true }));
        },
      }) : null,
      autoAssignOpen ? h(AutoAssignPerformersDialog, {
        key: "auto-assign-dialog",
        candidates: autoAssignCandidates,
        processing: autoAssigning,
        error: autoAssignError,
        onConfirm: autoAssignPerformers,
        onClose: () => setAutoAssignOpen(false),
      }) : null,
      mergeConfirmation ? h(MergeSelectionDialog, {
        key: "merge-selection-dialog",
        merge: mergeConfirmation,
        processing: mergeSavingRef.current,
        undoable: !compatibilityMode,
        cancelButtonRef: mergeCancelButtonRef,
        onConfirm: (skipFuture) => mergeSelectedSwimlane(true, skipFuture, mergeConfirmation),
        onClose: closeMergeConfirmation,
      }) : null,
      materializeOpen ? h(DerivedSegmentMaterializationDialog, {
        key: "materialize-derived-dialog",
        preview: materializePreview,
        loading: materializeLoading,
        processing: materializing,
        error: materializeError,
        cancelButtonRef: materializeCancelButtonRef,
        onConfirm: materializeDerivedSegments,
        onClose: () => { if (!materializing) closeMaterializeDialog(); },
      }) : null,
      h("div", {
        key: "workspace",
        ref: workspaceRef,
        className: `${splitLayout ? "min-h-0 flex-1" : ""} relative grid gap-2`,
      }, [
        editorLayout.markerRailOpen ? h("aside", {
          key: "segment-rail",
          id: "segment-studio-segment-rail",
          "aria-label": "Segment rail",
          className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
          style: wideLayout
            ? { position: "absolute", top: 0, right: 0, width: markerRailWidth, height: horizontalLayoutSize.focusRowHeight || "16rem", zIndex: 1 }
            : { height: "32rem" },
        }, [
          segments.length === 0
            ? h("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.")
            : visibleSegments.length === 0
              ? h("p", { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
                  "No segments match the current editor filters.")
              : h("div", {
                  key: "segments",
                  ref: railScrollRef,
                  onScroll: (event) => setRailViewport({
                    scrollTop: event.currentTarget.scrollTop,
                    height: event.currentTarget.clientHeight,
                  }),
                  className: "min-h-0 flex-1 overflow-y-auto p-2",
                }, h("div", {
                  className: "relative",
                  style: { height: segmentRailLayout.height },
                }, visibleSegmentRailRows.map((row) => {
                  let content;
                  if (row.kind === "group") {
                    const collapsed = collapsedSegmentGroups.includes(row.group.key);
                    const segmentCount = row.group.lanes.reduce((total, lane) => total + lane.markers.length, 0);
                    content = h("button", {
                      type: "button",
                      onClick: () => {
                        setSelectedSegmentGroupKey(row.group.key);
                        toggleSegmentGroup(row.group.key);
                      },
                      "aria-expanded": !collapsed,
                      "aria-current": selectedSegmentGroupKey === row.group.key ? "true" : undefined,
                      "data-segment-rail-group": row.group.key,
                      className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${selectedSegmentGroupKey === row.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`,
                    }, [
                      h("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, collapsed ? "▸" : "▾"),
                      h("span", { key: "name", className: "min-w-0 flex-1 truncate", title: row.group.name }, row.group.name),
                      h("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, segmentCount),
                      compatibilityMode && collapsed
                        ? h(LaneReviewCounts, { key: "states", counts: row.group.counts })
                        : null,
                    ]);
                  } else if (row.kind === "lane") {
                    content = h("div", {
                      className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
                      title: swimlaneDisplayLabel(row.lane),
                      "aria-label": swimlaneDisplayLabel(row.lane),
                    }, [
                      h("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, row.lane.label),
                      row.lane.performers?.length ? h(PerformerSublaneAvatars, {
                        key: "performers",
                        performers: row.lane.performers,
                        performerAssignments: row.lane.performerAssignments,
                      }) : null,
                      compatibilityMode ? h(LaneReviewCounts, { key: "states", counts: row.lane.counts }) : null,
                    ]);
                  } else {
                    content = renderSegmentRailItem(row.segment);
                  }
                  return h("div", {
                    key: row.key,
                    className: "absolute left-0 right-0",
                    style: { top: row.top, height: row.height },
                  }, content);
                }))),
        ]) : null,
        h("div", { key: "review-pane", className: `${splitLayout ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
          h("div", {
            key: "media-stack",
            ref: mediaStackRef,
            className: `${splitLayout ? "min-h-0 flex-1" : ""} grid`,
            style: splitLayout ? {
              gridTemplateRows: `minmax(16rem, ${(1 - editorLayout.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${editorLayout.timelineRatio * 100}fr)`,
            } : { rowGap: "0.5rem" },
          }, [
            h("div", {
              key: "focus-row",
              ref: focusRowRef,
              className: "grid min-h-0 gap-2",
              style: wideLayout ? {
                gridTemplateColumns: editorLayout.markerRailOpen
                  ? `${detailWidth}px 0.5rem minmax(0,1fr) 0.5rem ${markerRailWidth}px`
                  : `${detailWidth}px 0.5rem minmax(0,1fr)`,
              } : undefined,
            }, [
              h(SegmentActiveEditor, {
                key: "tools",
                compatibilityMode,
                selectedSegment,
                selectedSegments,
                selectedGroups,
                saveMessage,
                savingSegmentId,
                saveTag,
                slotStatus: selectedSlotStatus,
                performerSlotsAvailable,
                selectedPerformerSlots,
                performerSlots,
                detail,
                video,
                slotButtonRef,
                tagSearchRef,
                tagEditing,
                onCancelTagEditing: closeTagEditing,
                detailPanelRef,
                onReduceSelection: (segment) => {
                  selectSegment(segment);
                  requestAnimationFrame(() => detailPanelRef.current?.focus({ preventScroll: true }));
                },
                saveTiming,
                onSlotsChanged,
                onRecordHistory: recordHistoryAction,
                splitSegment,
                duplicateSegment,
                provenance,
                lineage,
                onNavigateLineageItem: (itemId) => {
                  const target = segments.find((segment) => segment.itemId === itemId);
                  if (target) setSelectedSegmentId(target.id);
                },
              }),
              wideLayout ? h("div", { key: "detail-separator", ...panelSeparatorProps("detailWidth", "Resize segment details") },
                h("span", { className: "h-16 w-1 rounded-full bg-border" })) : null,
              video.videoFile
              ? h("div", { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
                  h("div", { className: "h-full min-h-0 w-full" }, h(VideoPlayer, {
                    streamUrl: `/api/stream/video/${video.id}`,
                    posterUrl: `/api/stream/video/${video.id}/screenshot?v=${encodeURIComponent(video.updatedAt || "")}`,
                    format: video.videoFile.format,
                    audioCodec: video.videoFile.audioCodec,
                    duration: video.videoFile.duration,
                    videoId: video.id,
                    trackingEnabled: false,
                    onSeekRegister: (seek) => {
                      seekRef.current = seek;
                      if (performInitialSegmentSeek(pendingInitialSeekRef.current, segments, seek)) pendingInitialSeekRef.current = null;
                    },
                    onPlaybackControlRegister: (controls) => { playbackControlsRef.current = controls; },
                    onTimeUpdate: setCurrentTime,
                  })))
              : h("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
              wideLayout && editorLayout.markerRailOpen
                ? h("div", { key: "rail-separator", ...panelSeparatorProps("markerRailWidth", "Resize segment rail") },
                  h("span", { className: "h-16 w-1 rounded-full bg-border" }))
                : null,
              wideLayout && editorLayout.markerRailOpen
                ? h("div", { key: "rail-placeholder", "aria-hidden": "true" })
                : null,
            ]),
            splitLayout ? h("div", {
              key: "separator",
              role: "separator",
              tabIndex: 0,
              "aria-label": "Resize player and swimlanes",
              "aria-orientation": "horizontal",
              "aria-valuemin": Math.round(timelineRatioBounds.minimum * 100),
              "aria-valuemax": Math.round(timelineRatioBounds.maximum * 100),
              "aria-valuenow": Math.round(editorLayout.timelineRatio * 100),
              "aria-valuetext": `Swimlanes use ${Math.round(editorLayout.timelineRatio * 100)} percent of the media area`,
              title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
              onPointerDown: handleSeparatorPointerDown,
              onPointerMove: handleSeparatorPointerMove,
              onKeyDown: handleSeparatorKeyDown,
              onDoubleClick: () => updateTimelineRatio(DEFAULT_EDITOR_LAYOUT.timelineRatio),
              className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
              style: { touchAction: "none", cursor: "row-resize" },
            }, h("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
            h("div", { key: "timeline", className: "min-h-0", style: splitLayout ? undefined : { height: "20rem" } }, h(SwimlaneTimeline, {
              segments: visibleSegments,
              shotBoundaries,
              segmentGroups,
              performerSlots,
              collapsedGroupKeys: collapsedSegmentGroups,
              selectedGroupKey: selectedSegmentGroupKey,
              selectedSegmentId: selectedSegment?.id,
              selectedSegmentIds,
              duration: timelineDuration,
              currentTime,
              zoom: timelineZoom,
              onZoomChange: setTimelineZoom,
              onSelectGroup: setSelectedSegmentGroupKey,
              onToggleGroup: toggleSegmentGroup,
              onSelect: (segment, options) => selectSegment(segment, options),
              onSelectSegments: selectSegmentCollection,
              onSelectAll: selectAllVideoSegments,
              onConfigureTag: (tag) => setConfiguringTag(tag),
              onSeekTime: (time) => seekRef.current?.(time, false),
              centerRef: centerTimelineRef,
              showReviewState: compatibilityMode,
              swimlaneTitleWidth: editorLayout.swimlaneTitleWidth,
              onSwimlaneTitleWidthChange: (swimlaneTitleWidth) =>
                setEditorLayout((layout) => ({ ...layout, swimlaneTitleWidth })),
            })),
          ]),
        ]),
      ]),
      configuringTag ? h(InlineTagConfigurationDialog, {
        key: `configure-tag:${configuringTag.tagId}`,
        tagId: configuringTag.tagId,
        tagName: configuringTag.tagName,
        performerSlotsEnabled: compatibilityMode,
        onSaved: onReload,
        onClose: () => {
          const trigger = configuringTag.trigger;
          setConfiguringTag(null);
          requestAnimationFrame(() => {
            if (trigger?.isConnected) trigger.focus({ preventScroll: true });
            else editorRef.current?.focus({ preventScroll: true });
          });
        },
      }) : null,
      publishApprovedOpen ? h(ApprovedDraftPublishingDialog, {
        key: "publish-approved-dialog",
        drafts: approvedDrafts,
        processing: savingSegmentId === -1,
        error: publishApprovedError,
        cancelButtonRef: publishApprovedCancelButtonRef,
        onConfirm: publishApprovedDrafts,
        onClose: closePublishApprovedDialog,
      }) : null,
      shortcutsOpen ? h(KeyboardShortcutsDialog, {
        key: "shortcuts-dialog",
        reviewMode: compatibilityMode,
        bindings: shortcutBindings,
        onClose: () => setShortcutsOpen(false),
      }) : null,
      incorrectExamplesOpen ? h(IncorrectExamplesDialog, {
        key: "incorrect-examples-dialog",
        examples: incorrectExamples,
        exporting: exportingExamples,
        removingExampleId,
        onExport: captureTrainingExport,
        onRemove: removeIncorrectExample,
        onClose: () => setIncorrectExamplesOpen(false),
      }) : null,
    ]);
}

export { SegmentEditorView };
