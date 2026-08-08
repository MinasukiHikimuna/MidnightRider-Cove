import { h, useEffect, useMemo, useRef, useState } from "../shared/runtime.js";

import { EMPTY_EDITOR_HISTORY, REVIEW_STATES } from "../shared/constants.js";

import { activeEditorFilterCount, filterEditorSegments, normalizeEditorSegmentFilters, readHideDerivedSegmentsPreference, reconcileFilteredSelectedSegmentId, reconcileSelectedSegmentIds, resolveSelectedSegments, resolveVisibleSelectedSegment, writeHideDerivedSegmentsPreference } from "./model/selection.js";

import { readPlaybackShortcutConfig } from "./model/shortcuts.js";

import { requestJson } from "../shared/api.js";

import { findUniquePerformerSlotAssignment } from "../discovery/model.js";

import { isEditorShortcutOwner } from "../shared/presentation.js";

import { buildSegmentRailRows, expandedSwimlanes, groupSegmentsIntoSwimlanes, groupSelectedSwimlanes, groupSwimlanesBySegmentGroup, reconcileSegmentGroupKey, revealCollapsedSegmentGroup, segmentGroupKeyForSegment, visibleVirtualRows } from "./model/swimlanes.js";

import { calculateTimelineRatioBounds, clampEditorPanelWidth, clampTimelineRatioForHeight } from "./model/timeline.js";

import { indexPerformerSlotsBySegment, performerSlotStatusFromSegmentSlots } from "./model/history.js";

import { readCollapsedSegmentGroups, readEditorLayout, useWideEditorLayout, writeCollapsedSegmentGroups, writeEditorLayout } from "./model/layout.js";

import { SegmentEditorView } from "./SegmentEditorView.js";
import { provenanceSourceLabel } from "./SegmentDetails.js";

import { createSelectionActions } from "./actions/selection.js";
import { createPrimarySegmentActions } from "./actions/primary.js";
import { createReviewActions } from "./actions/review.js";
import { createWorkflowActions } from "./actions/workflow.js";
import { createHistoryAndLayoutActions } from "./actions/history-and-layout.js";
import { createShortcutHandler } from "./actions/shortcuts.js";
import { useSegmentAnalysis } from "./hooks/useSegmentAnalysis.js";
import { hideCollectedFeedbackSegments } from "./model/feedback.js";

const EMPTY_EDITOR_COLLECTION = Object.freeze([]);

function SegmentEditor({ detail, onDetailChange, onConflict, onReload, onSlotsChanged, splitLayout, initialSegmentId, compatibilityMode = false, profile, onNavigate }) {
  const [selectedSegmentId, setSelectedSegmentId] = useState(null);
  const [selectedSegmentIds, setSelectedSegmentIds] = useState([]);
  const selectedSegmentIdRef = useRef(null);
  const selectionAnchorIdRef = useRef(null);
  const selectionRangeBaseIdsRef = useRef([]);
  const detailPanelRef = useRef(null);
  const [editorFilters, setEditorFilters] = useState(() => normalizeEditorSegmentFilters({}));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [hideDerivedSegments, setHideDerivedSegments] = useState(readHideDerivedSegmentsPreference);
  const [currentTime, setCurrentTime] = useState(0);
  const [savingSegmentId, setSavingSegmentId] = useState(null);
  const [savingShot, setSavingShot] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [editorLayout, setEditorLayout] = useState(readEditorLayout);
  const [mediaStackHeight, setMediaStackHeight] = useState(0);
  const [horizontalLayoutSize, setHorizontalLayoutSize] = useState({ workspace: 0, focusRow: 0, focusRowHeight: 0 });
  const [history, setHistory] = useState(EMPTY_EDITOR_HISTORY);
  const historyRef = useRef(EMPTY_EDITOR_HISTORY);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySaving, setHistorySaving] = useState(false);
  const [tagEditing, setTagEditing] = useState(false);
  const [firstSegmentTagOpen, setFirstSegmentTagOpen] = useState(false);
  const mergeSavingRef = useRef(false);
  const [mergeConfirmation, setMergeConfirmation] = useState(null);
  const mergeCancelButtonRef = useRef(null);
  const reviewSavingRef = useRef(false);
  const binEmptyingRef = useRef(false);
  const [collapsedSegmentGroups, setCollapsedSegmentGroups] = useState(readCollapsedSegmentGroups);
  const [selectedSegmentGroupKey, setSelectedSegmentGroupKey] = useState(null);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [incorrectExamplesOpen, setIncorrectExamplesOpen] = useState(false);
  const [autoAssignOpen, setAutoAssignOpen] = useState(false);
  const [autoAssigning, setAutoAssigning] = useState(false);
  const [autoAssignError, setAutoAssignError] = useState("");
  const {
    analysisError,
    analysisProvenanceRepair,
    analysisRun,
    analysisStatus,
    backfillAnalysisProvenance,
    importNativeSegments,
    nativeImportState,
    startFullAnalysis,
  } = useSegmentAnalysis(detail.video.id, onReload, compatibilityMode);
  const [materializeOpen, setMaterializeOpen] = useState(false);
  const [materializePreview, setMaterializePreview] = useState(null);
  const [materializeLoading, setMaterializeLoading] = useState(false);
  const [materializing, setMaterializing] = useState(false);
  const [materializeError, setMaterializeError] = useState("");
  const [configuringTag, setConfiguringTag] = useState(null);
  const materializeButtonRef = useRef(null);
  const materializeCancelButtonRef = useRef(null);
  const materializeRestoreFocusRef = useRef(false);
  const [incorrectExamples, setIncorrectExamples] = useState([]);
  const [exportingExamples, setExportingExamples] = useState(false);
  const [removingExampleId, setRemovingExampleId] = useState(null);
  const [provenance, setProvenance] = useState({ key: null, loading: false, error: null, items: [] });
  const [lineage, setLineage] = useState({ loading: false, error: null, data: null });
  const wideLayout = useWideEditorLayout();
  const seekRef = useRef(null);
  const playbackControlsRef = useRef(null);
  const shortcutHandlerRef = useRef(null);
  const pendingInitialSeekRef = useRef(initialSegmentId);
  const centerTimelineRef = useRef(null);
  const mediaStackRef = useRef(null);
  const focusRowRef = useRef(null);
  const workspaceRef = useRef(null);
  const editorRef = useRef(null);
  const railToggleRef = useRef(null);
  const filtersButtonRef = useRef(null);
  const slotButtonRef = useRef(null);
  const tagSearchRef = useRef(null);
  const pendingTagEditSegmentIdRef = useRef(null);
  const pendingFirstSegmentStartSecRef = useRef(null);
  const pendingDuplicateRef = useRef(null);
  const savingShotRef = useRef(false);
  const railScrollRef = useRef(null);
  const [railViewport, setRailViewport] = useState({ scrollTop: 0, height: 512 });
  useEffect(() => {
    if (!materializeOpen || materializing || !materializeError) return undefined;
    const frame = requestAnimationFrame(() => materializeCancelButtonRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [materializeOpen, materializing, materializeError]);
  useEffect(() => {
    if (!materializeRestoreFocusRef.current || materializeOpen || materializeLoading) return undefined;
    const frame = requestAnimationFrame(() => {
      materializeButtonRef.current?.focus({ preventScroll: true });
      materializeRestoreFocusRef.current = false;
    });
    return () => cancelAnimationFrame(frame);
  }, [materializeOpen, materializeLoading]);
  const video = detail.video;
  const segments = detail.segments || EMPTY_EDITOR_COLLECTION;
  const segmentGroups = detail.segmentGroups || EMPTY_EDITOR_COLLECTION;
  const performerSlots = detail.performerSlots || EMPTY_EDITOR_COLLECTION;
  const performerSlotsAvailable = compatibilityMode
    && detail.performerSlotsAvailable !== false;
  const videoPerformers = useMemo(
    () => (detail.performerCandidates || []).filter((performer) => performer.isVideoPerformer),
    [detail.performerCandidates],
  );
  const shotBoundaries = detail.shotBoundaries || EMPTY_EDITOR_COLLECTION;
  const performerSlotsBySegment = useMemo(
    () => indexPerformerSlotsBySegment(performerSlots),
    [performerSlots],
  );
  const autoAssignCandidates = useMemo(() => segments.map((segment) => {
    const slots = performerSlotsBySegment.get(segment.id) || [];
    return {
      ...segment,
      slots,
      assignment: slots.every((slot) => slot.performerId == null)
        ? findUniquePerformerSlotAssignment(slots, videoPerformers)
        : null,
    };
  }).filter((segment) => segment.slots.length > 0 && segment.assignment != null),
  [segments, performerSlotsBySegment, videoPerformers]);
  const videoFrameRate = Number(video.videoFile?.frameRate) > 0 ? Number(video.videoFile.frameRate) : 30;
  function closeTagEditing() {
    setTagEditing(false);
    requestAnimationFrame(() => editorRef.current?.focus({ preventScroll: true }));
  }

  function closeFirstSegmentTagDialog() {
    if (savingSegmentId != null) return;
    pendingFirstSegmentStartSecRef.current = null;
    setFirstSegmentTagOpen(false);
    setSaveMessage("");
    requestAnimationFrame(() => editorRef.current?.focus({ preventScroll: true }));
  }

  function closeEditorFilters() {
    setFiltersOpen(false);
    requestAnimationFrame(() => {
      if (filtersButtonRef.current?.isConnected)
        filtersButtonRef.current.focus({ preventScroll: true });
      else
        editorRef.current?.focus({ preventScroll: true });
    });
  }

  useEffect(() => {
    if (pendingTagEditSegmentIdRef.current === selectedSegmentId) {
      pendingTagEditSegmentIdRef.current = null;
      setTagEditing(true);
    } else {
      setTagEditing(false);
    }
  }, [selectedSegmentId]);

  useEffect(() => {
    if (!tagEditing) return;
    const input = tagSearchRef.current?.querySelector("input");
    input?.focus({ preventScroll: true });
    input?.select();
  }, [tagEditing, selectedSegmentId]);

  useEffect(() => {
    const nextSegmentId = detail.segments.some((segment) => segment.id === initialSegmentId) ? initialSegmentId : detail.segments[0]?.id ?? null;
    setSelectedSegmentId(nextSegmentId);
    setSelectedSegmentIds(nextSegmentId == null ? [] : [nextSegmentId]);
    selectionAnchorIdRef.current = nextSegmentId;
    selectionRangeBaseIdsRef.current = [];
    setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
      groupSegmentsIntoSwimlanes(detail.segments || [], detail.segmentGroups || [], detail.performerSlots || []),
      nextSegmentId,
    ));
    setEditorFilters(normalizeEditorSegmentFilters({}));
    setFiltersOpen(false);
    pendingFirstSegmentStartSecRef.current = null;
    setFirstSegmentTagOpen(false);
    setTimelineZoom(1);
    setSaveMessage("");
    setHistory(EMPTY_EDITOR_HISTORY);
    historyRef.current = EMPTY_EDITOR_HISTORY;
    setHistoryOpen(false);
    editorRef.current?.focus({ preventScroll: true });
  }, [video.id, initialSegmentId]);

  useEffect(() => {
    const controller = new AbortController();
    requestJson(`/videos/${video.id}/incorrect-examples`, { signal: controller.signal })
      .then(setIncorrectExamples)
      .catch((error) => { if (error.name !== "AbortError") setIncorrectExamples([]); });
    return () => controller.abort();
  }, [video.id, profile?.effectiveMode]);

  useEffect(() => {
    const controller = new AbortController();
    requestJson(`/videos/${video.id}/history`, { signal: controller.signal })
      .then((loaded) => {
        const next = loaded || EMPTY_EDITOR_HISTORY;
        historyRef.current = next;
        setHistory(next);
      })
      .catch((error) => {
        if (error.name !== "AbortError")
          setSaveMessage(error.message || "Unable to load editor history.");
      });
    return () => controller.abort();
  }, [video.id]);

  useEffect(() => {
    writeEditorLayout(editorLayout);
  }, [editorLayout.timelineRatio, editorLayout.markerRailOpen, editorLayout.detailWidth, editorLayout.markerRailWidth, editorLayout.swimlaneTitleWidth]);

  useEffect(() => {
    writeCollapsedSegmentGroups(collapsedSegmentGroups);
  }, [collapsedSegmentGroups]);

  useEffect(() => {
    writeHideDerivedSegmentsPreference(hideDerivedSegments);
  }, [hideDerivedSegments]);

  useEffect(() => {
    const element = mediaStackRef.current;
    if (!splitLayout || !element || typeof ResizeObserver === "undefined") return undefined;
    const update = () => {
      const height = element.clientHeight;
      setMediaStackHeight(height);
      setEditorLayout((layout) => {
        const timelineRatio = clampTimelineRatioForHeight(layout.timelineRatio, height);
        return timelineRatio === layout.timelineRatio ? layout : { ...layout, timelineRatio };
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    update();
    return () => observer.disconnect();
  }, [splitLayout]);

  useEffect(() => {
    if (!wideLayout || typeof ResizeObserver === "undefined") return undefined;
    const workspace = workspaceRef.current;
    const focusRow = focusRowRef.current;
    if (!workspace || !focusRow) return undefined;
    const update = () => setHorizontalLayoutSize({
      workspace: workspace.clientWidth,
      focusRow: focusRow.clientWidth,
      focusRowHeight: focusRow.clientHeight,
    });
    const observer = new ResizeObserver(update);
    observer.observe(workspace);
    observer.observe(focusRow);
    update();
    return () => observer.disconnect();
  }, [wideLayout, editorLayout.markerRailOpen]);

  const visibleSegments = useMemo(
    () => hideCollectedFeedbackSegments(
      filterEditorSegments(
        segments,
        performerSlots,
        editorFilters,
        compatibilityMode && hideDerivedSegments,
        segmentGroups,
      ),
      incorrectExamples,
      true,
    ),
    [
      segments,
      performerSlots,
      editorFilters,
      hideDerivedSegments,
      segmentGroups,
      compatibilityMode,
      incorrectExamples,
    ],
  );
  const visibleCounts = Object.fromEntries(REVIEW_STATES.map((state) =>
    [state, visibleSegments.filter((segment) => segment.reviewState === state).length]));
  const approvalFacetSegments = hideCollectedFeedbackSegments(
    filterEditorSegments(
      segments,
      performerSlots,
      { ...editorFilters, reviewStates: REVIEW_STATES },
      compatibilityMode && hideDerivedSegments,
      segmentGroups,
    ),
    incorrectExamples,
    true,
  );
  const approvalFacetCounts = Object.fromEntries(REVIEW_STATES.map((state) =>
    [state, approvalFacetSegments.filter((segment) => segment.reviewState === state).length]));
  const provenanceSources = [...new Set(segments.map((segment) => segment.sourceKey).filter(Boolean))]
    .sort((left, right) => provenanceSourceLabel(left).localeCompare(provenanceSourceLabel(right)));
  const activeFilterCount = activeEditorFilterCount(
    editorFilters,
    compatibilityMode && hideDerivedSegments,
  );
  const selectedSegment = resolveVisibleSelectedSegment(visibleSegments, selectedSegmentId);
  const selectedSegments = resolveSelectedSegments(visibleSegments, selectedSegmentIds);
  const canMoveSelectionToBin = !compatibilityMode
    && selectedSegments.length > 0
    && selectedSegments.every((segment) => segment.nativeSegmentId != null);
  const visibleSegmentIds = visibleSegments.map((segment) => segment.id);
  const visibleSegmentIdsFingerprint = visibleSegmentIds.join("|");
  selectedSegmentIdRef.current = selectedSegment?.id ?? null;
  const selectedPerformerSlots = performerSlotsBySegment.get(selectedSegment?.id) || [];
  const selectedSlotStatus = performerSlotStatusFromSegmentSlots(selectedPerformerSlots);
  const allSwimlanes = useMemo(
    () => groupSegmentsIntoSwimlanes(visibleSegments, segmentGroups, performerSlots),
    [visibleSegments, segmentGroups, performerSlots],
  );
  const selectedGroups = useMemo(
    () => groupSelectedSwimlanes(allSwimlanes, selectedSegmentIds),
    [allSwimlanes, selectedSegmentIds],
  );
  const groupedSegmentRail = useMemo(() => groupSwimlanesBySegmentGroup(allSwimlanes), [allSwimlanes]);
  const segmentRailLayout = useMemo(
    () => buildSegmentRailRows(groupedSegmentRail, collapsedSegmentGroups),
    [groupedSegmentRail, collapsedSegmentGroups],
  );
  const visibleSegmentRailRows = useMemo(
    () => visibleVirtualRows(
      segmentRailLayout.rows,
      railViewport.scrollTop,
      railViewport.height,
    ),
    [segmentRailLayout, railViewport],
  );
  const swimlanes = useMemo(
    () => expandedSwimlanes(allSwimlanes, collapsedSegmentGroups),
    [allSwimlanes, collapsedSegmentGroups],
  );
  const selectedSegmentGroupForSegment = selectedSegment ? segmentGroupKeyForSegment(allSwimlanes, selectedSegment.id) : null;
  const segmentGroupKeys = segmentGroups.length > 0 ? groupedSegmentRail.map((group) => group.key) : [];
  const segmentGroupKeysFingerprint = segmentGroupKeys.join("|");
  const timelineDuration = Math.max(
    0,
    Number(video.videoFile?.duration) || 0,
    ...segments.map((segment) => Number(segment.endSec ?? segment.startSec) || 0),
  );
  const mediaDuration = Number(video.videoFile?.duration) > 0 ? Number(video.videoFile.duration) : null;
  const historyActions = history.actions || [];
  const playbackShortcutConfig = readPlaybackShortcutConfig();

  useEffect(() => {
    const reconciledId = reconcileFilteredSelectedSegmentId(segments, visibleSegments, selectedSegmentId);
    if (reconciledId !== selectedSegmentId)
      setSelectedSegmentId(reconciledId);
  }, [segments, visibleSegments, selectedSegmentId]);

  useEffect(() => {
    setSelectedSegmentIds((current) => {
      const reconciled = reconcileSelectedSegmentIds(
        current,
        visibleSegmentIds,
        selectedSegment?.id ?? null,
      );
      return reconciled.length === current.length && reconciled.every((id, index) => id === current[index])
        ? current
        : reconciled;
    });
  }, [visibleSegmentIdsFingerprint, selectedSegment?.id]);

  useEffect(() => {
    const itemId = selectedSegment?.itemId;
    const nativeSegmentId = selectedSegment?.nativeSegmentId;
    const provenanceKey = itemId != null
      ? `item:${itemId}`
      : nativeSegmentId != null
        ? `native:${nativeSegmentId}`
        : null;
    if (provenanceKey == null) {
      setProvenance({ key: null, loading: false, error: "Provenance is unavailable for this segment.", items: [] });
      setLineage({ loading: false, error: "Lineage is unavailable until this segment has a stable Segment Studio item.", data: null });
      return undefined;
    }
    const controller = new AbortController();
    setProvenance({ key: provenanceKey, loading: true, error: null, items: [] });
    requestJson(itemId != null
      ? `/items/${itemId}/provenance`
      : `/videos/${video.id}/segments/${nativeSegmentId}/provenance`, {
      signal: controller.signal,
    })
      .then((items) => setProvenance({ key: provenanceKey, loading: false, error: null, items: items || [] }))
      .catch((error) => {
        if (error.name !== "AbortError")
          setProvenance({ key: provenanceKey, loading: false, error: "Provenance could not be loaded.", items: [] });
      });
    if (itemId != null) {
      setLineage({ loading: true, error: null, data: null });
      requestJson(`/items/${itemId}/lineage`, { signal: controller.signal })
        .then((data) => setLineage({ loading: false, error: null, data }))
        .catch((error) => {
          if (error.name !== "AbortError")
            setLineage({ loading: false, error: "Lineage could not be loaded.", data: null });
        });
    } else {
      setLineage({ loading: false, error: "Lineage is available in Full mode.", data: null });
    }
    return () => controller.abort();
  }, [selectedSegment?.itemId, selectedSegment?.nativeSegmentId, video.id]);

  useEffect(() => {
    setStartInput(selectedSegment == null ? "" : String(selectedSegment.startSec));
    setEndInput(selectedSegment?.endSec == null ? "" : String(selectedSegment.endSec));
  }, [selectedSegment?.id, selectedSegment?.startSec, selectedSegment?.endSec]);

  useEffect(() => {
    if (!selectedSegmentGroupForSegment) return;
    setCollapsedSegmentGroups((current) => revealCollapsedSegmentGroup(current, selectedSegmentGroupForSegment));
  }, [video.id, initialSegmentId, selectedSegmentGroupForSegment]);

  useEffect(() => {
    setSelectedSegmentGroupKey((current) =>
      reconcileSegmentGroupKey(segmentGroupKeys, current, selectedSegmentGroupForSegment));
  }, [video.id, segmentGroupKeysFingerprint, selectedSegmentGroupForSegment]);

  useEffect(() => {
    if (!editorLayout.markerRailOpen || selectedSegment?.id == null) return;
    const scrollElement = railScrollRef.current;
    const row = segmentRailLayout.rows.find((candidate) =>
      candidate.kind === "segment" && candidate.segment.id === selectedSegment.id);
    if (!scrollElement || !row) return;
    const rowBottom = row.top + row.height;
    let nextScrollTop = scrollElement.scrollTop;
    if (row.top < scrollElement.scrollTop)
      nextScrollTop = row.top;
    else if (rowBottom > scrollElement.scrollTop + scrollElement.clientHeight)
      nextScrollTop = Math.max(0, rowBottom - scrollElement.clientHeight);
    if (nextScrollTop !== scrollElement.scrollTop)
      scrollElement.scrollTop = nextScrollTop;
    setRailViewport({ scrollTop: nextScrollTop, height: scrollElement.clientHeight });
  }, [selectedSegment?.id, segmentRailLayout, editorLayout.markerRailOpen]);

  useEffect(() => {
    const scrollElement = railScrollRef.current;
    if (!editorLayout.markerRailOpen || !scrollElement) return undefined;
    const update = () => setRailViewport({
      scrollTop: scrollElement.scrollTop,
      height: scrollElement.clientHeight,
    });
    if (typeof ResizeObserver === "undefined") {
      update();
      return undefined;
    }
    const observer = new ResizeObserver(update);
    observer.observe(scrollElement);
    update();
    return () => observer.disconnect();
  }, [editorLayout.markerRailOpen]);
  const { revealSegmentGroupForSelection, replaceSegmentSelection, selectSegment, selectSegmentCollection, selectAllVideoSegments } = createSelectionActions({
    allSwimlanes,
    editorRef,
    performerSlots,
    seekRef,
    segmentGroups,
    segments,
    selectedSegmentId,
    selectedSegmentIds,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setCollapsedSegmentGroups,
    setEditorFilters,
    setHideDerivedSegments,
    setSaveMessage,
    setSelectedSegmentGroupKey,
    setSelectedSegmentId,
    setSelectedSegmentIds,
  });
  const { acceptHistory, recordHistoryAction, mutateSegment, completeReview, createSegment, splitSegment, duplicateSegment, saveTiming, applyShortcutTiming } = createPrimarySegmentActions({
    compatibilityMode,
    currentTime,
    detail,
    editorFilters,
    endInput,
    hideDerivedSegments,
    historyRef,
    mediaDuration,
    onConflict,
    onDetailChange,
    onReload,
    pendingDuplicateRef,
    pendingFirstSegmentStartSecRef,
    pendingTagEditSegmentIdRef,
    replaceSegmentSelection,
    savingSegmentId,
    segments,
    selectedSegment,
    selectedSegmentIdRef,
    selectedSegments,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setEditorFilters,
    setFirstSegmentTagOpen,
    setHideDerivedSegments,
    setHistory,
    setHistoryOpen,
    setSaveMessage,
    setSavingSegmentId,
    setSelectedSegmentGroupKey,
    setSelectedSegmentId,
    setSelectedSegmentIds,
    startInput,
    timelineDuration,
    video,
  });
  const { closeMergeConfirmation, mergeSelectedSwimlane, saveSelectedReviewState } = createReviewActions({
    acceptHistory,
    compatibilityMode,
    detailPanelRef,
    historyRef,
    mergeSavingRef,
    onConflict,
    onReload,
    recordHistoryAction,
    revealSegmentGroupForSelection,
    reviewSavingRef,
    savingSegmentId,
    selectedGroups,
    selectedSegment,
    selectedSegmentIdRef,
    selectedSegments,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setMergeConfirmation,
    setSaveMessage,
    setSavingSegmentId,
    setSelectedSegmentId,
    setSelectedSegmentIds,
    video,
  });
  const { toggleIncorrectExample, removeIncorrectExample, captureTrainingExport, deleteRejectedSegments, autoAssignPerformers, previewDerivedSegments, closeMaterializeDialog, materializeDerivedSegments, saveTag, moveToBin, emptyRecyclingBin } = createWorkflowActions({
    acceptHistory,
    allSwimlanes,
    autoAssignCandidates,
    autoAssigning,
    binEmptyingRef,
    canMoveSelectionToBin,
    closeTagEditing,
    compatibilityMode,
    detail,
    editorRef,
    exportingExamples,
    incorrectExamples,
    lineage,
    materializeButtonRef,
    materializePreview,
    materializeRestoreFocusRef,
    materializing,
    mutateSegment,
    onConflict,
    onDetailChange,
    onReload,
    recordHistoryAction,
    removingExampleId,
    revealSegmentGroupForSelection,
    savingSegmentId,
    segments,
    selectedSegment,
    selectedSegmentIdRef,
    selectedSegments,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setAutoAssignError,
    setAutoAssignOpen,
    setAutoAssigning,
    setExportingExamples,
    setIncorrectExamples,
    setMaterializeError,
    setMaterializeLoading,
    setMaterializeOpen,
    setMaterializePreview,
    setMaterializing,
    setRemovingExampleId,
    setSaveMessage,
    setSavingSegmentId,
    setSelectedSegmentGroupKey,
    setSelectedSegmentId,
    setSelectedSegmentIds,
    video,
  });
  const { applySegmentHistoryState, applyPerformerSlotHistoryState, applyHistoryState, restoreHistoryTarget, updateTimelineRatio, updateTimelineRatioFromPointer, handleSeparatorPointerDown, handleSeparatorPointerMove, handleSeparatorKeyDown, panelWidthMaximum, updatePanelWidth, handlePanelSeparatorPointer, panelSeparatorProps, toggleSegmentRail, toggleSegmentGroup, mutateShotBoundary, restoreShotBoundaries } = createHistoryAndLayoutActions({
    acceptHistory,
    compatibilityMode,
    currentTime,
    detail,
    editorLayout,
    focusRowRef,
    history,
    historyRef,
    historySaving,
    horizontalLayoutSize,
    mediaStackHeight,
    mediaStackRef,
    onDetailChange,
    onReload,
    railToggleRef,
    recordHistoryAction,
    savingSegmentId,
    savingShot,
    savingShotRef,
    setCollapsedSegmentGroups,
    setEditorLayout,
    setHistorySaving,
    setSaveMessage,
    setSavingSegmentId,
    setSavingShot,
    shotBoundaries,
    timelineDuration,
    video,
    workspaceRef,
  });
  const { handleShortcut } = createShortcutHandler({
    allSwimlanes,
    applyShortcutTiming,
    centerTimelineRef,
    compatibilityMode,
    createSegment,
    currentTime,
    deleteRejectedSegments,
    duplicateSegment,
    editorLayout,
    editorRef,
    emptyRecyclingBin,
    lineage,
    mediaDuration,
    mergeSelectedSwimlane,
    moveToBin,
    mutateShotBoundary,
    playbackControlsRef,
    playbackShortcutConfig,
    saveSelectedReviewState,
    seekRef,
    segmentGroupKeys,
    selectSegment,
    selectedSegment,
    selectedSegmentGroupForSegment,
    selectedSegmentGroupKey,
    selectedSegments,
    setCollapsedSegmentGroups,
    setIncorrectExamplesOpen,
    setQuickSearchOpen,
    setSaveMessage,
    setSelectedSegmentGroupKey,
    setTagEditing,
    setTimelineZoom,
    shotBoundaries,
    slotButtonRef,
    splitSegment,
    swimlanes,
    timelineDuration,
    toggleIncorrectExample,
    toggleSegmentGroup,
    updateTimelineRatio,
    videoFrameRate,
    visibleSegments,
  });

  shortcutHandlerRef.current = handleShortcut;
  useEffect(() => {
    const ownerDocument = editorRef.current?.ownerDocument ?? document;
    const listener = (event) => {
      if (!isEditorShortcutOwner(event, editorRef.current)) return;
      shortcutHandlerRef.current?.(event);
    };
    ownerDocument.addEventListener("keydown", listener, true);
    return () => ownerDocument.removeEventListener("keydown", listener, true);
  }, []);

  const timelineRatioBounds = calculateTimelineRatioBounds(mediaStackHeight);
  const markerRailWidth = clampEditorPanelWidth(editorLayout.markerRailWidth, panelWidthMaximum("markerRailWidth"));
  const detailWidth = clampEditorPanelWidth(editorLayout.detailWidth, panelWidthMaximum("detailWidth"));
  return h(SegmentEditorView, {
    activeFilterCount,
    allSwimlanes,
    analysisError,
    analysisProvenanceRepair,
    analysisRun,
    analysisStatus,
    approvalFacetCounts,
    autoAssignCandidates,
    autoAssignError,
    autoAssignOpen,
    autoAssignPerformers,
    autoAssigning,
    backfillAnalysisProvenance,
    captureTrainingExport,
    removeIncorrectExample,
    centerTimelineRef,
    closeEditorFilters,
    closeFirstSegmentTagDialog,
    closeMaterializeDialog,
    closeMergeConfirmation,
    closeTagEditing,
    collapsedSegmentGroups,
    compatibilityMode,
    completeReview,
    configuringTag,
    createSegment,
    currentTime,
    detail,
    detailPanelRef,
    detailWidth,
    duplicateSegment,
    editorFilters,
    editorLayout,
    editorRef,
    exportingExamples,
    filtersButtonRef,
    filtersOpen,
    firstSegmentTagOpen,
    focusRowRef,
    handleSeparatorKeyDown,
    handleSeparatorPointerDown,
    handleSeparatorPointerMove,
    hideDerivedSegments,
    history,
    historyOpen,
    historySaving,
    horizontalLayoutSize,
    importNativeSegments,
    incorrectExamples,
    incorrectExamplesOpen,
    removingExampleId,
    lineage,
    markerRailWidth,
    materializeButtonRef,
    materializeCancelButtonRef,
    materializeDerivedSegments,
    materializeError,
    materializeLoading,
    materializeOpen,
    materializePreview,
    materializing,
    mediaStackRef,
    mergeCancelButtonRef,
    mergeConfirmation,
    mergeSavingRef,
    mergeSelectedSwimlane,
    nativeImportState,
    onNavigate,
    onReload,
    onSlotsChanged,
    panelSeparatorProps,
    pendingInitialSeekRef,
    performerSlots,
    performerSlotsAvailable,
    playbackControlsRef,
    previewDerivedSegments,
    provenance,
    provenanceSources,
    quickSearchOpen,
    railScrollRef,
    railToggleRef,
    recordHistoryAction,
    restoreHistoryTarget,
    saveMessage,
    saveTag,
    saveTiming,
    savingSegmentId,
    seekRef,
    segmentGroups,
    segmentRailLayout,
    segments,
    selectAllVideoSegments,
    selectSegment,
    selectSegmentCollection,
    selectedGroups,
    selectedPerformerSlots,
    selectedSegment,
    selectedSegmentGroupKey,
    selectedSegmentIds,
    selectedSegments,
    selectedSlotStatus,
    setAutoAssignError,
    setAutoAssignOpen,
    setConfiguringTag,
    setCurrentTime,
    setEditorFilters,
    setEditorLayout,
    setFiltersOpen,
    setHideDerivedSegments,
    setHistoryOpen,
    setIncorrectExamplesOpen,
    setQuickSearchOpen,
    setRailViewport,
    setSelectedSegmentGroupKey,
    setSelectedSegmentId,
    setShortcutsOpen,
    setTimelineZoom,
    shotBoundaries,
    shortcutsOpen,
    slotButtonRef,
    splitLayout,
    splitSegment,
    startFullAnalysis,
    tagEditing,
    tagSearchRef,
    timelineDuration,
    timelineRatioBounds,
    timelineZoom,
    toggleSegmentGroup,
    toggleSegmentRail,
    updateTimelineRatio,
    video,
    videoPerformers,
    visibleCounts,
    visibleSegmentRailRows,
    visibleSegments,
    wideLayout,
    workspaceRef,
  });
}

export { SegmentEditor };
