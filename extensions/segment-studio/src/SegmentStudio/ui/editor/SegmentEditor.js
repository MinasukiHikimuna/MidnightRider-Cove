import { h, useEffect, useLayoutEffect, useMemo, useReducer, useRef, useRegisterExtensionKeyboardActions, useState, useSyncExternalStore } from "../shared/runtime.js";

import { EMPTY_EDITOR_HISTORY, REVIEW_STATES, SEGMENT_STUDIO_EXTENSION_ID } from "../shared/constants.js";

import { CLEARED_SEGMENT_SELECTION_ID, activeEditorFilterCount, filterEditorSegments, normalizeEditorSegmentFilters, readHideDerivedSegmentsPreference, reconcileSelectedSegmentIds, resolveEditorSegmentSelection, resolveSelectedSegments, writeHideDerivedSegmentsPreference } from "./model/selection.js";

import { SEGMENT_STUDIO_SHORTCUTS, readPlaybackShortcutConfig, shortcutAvailableInMode, shotBoundaryFingerprint } from "./model/shortcuts.js";

import { requestJson } from "../shared/api.js";

import { findUniquePerformerSlotAssignment } from "../discovery/model.js";

import { buildSegmentRailRows, expandedSwimlanes, groupSegmentsIntoSwimlanes, groupSelectedSwimlanes, groupSwimlanesBySegmentGroup, reconcileSegmentGroupKey, revealCollapsedSegmentGroup, segmentGroupKeyForSegment, visibleVirtualRows } from "./model/swimlanes.js";

import { calculateTimelineRatioBounds, clampEditorPanelWidth, clampTimelineRatioForHeight, findInitialSegmentSelection, findUnreviewedSelection } from "./model/timeline.js";

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
import { createSaveQueue, isKindRunning, savingSegmentIdFrom, segmentIdentity, targetsOverlap } from "./model/save-queue.js";
import { applyPendingChanges, pendingChangesReducer, pendingInsertedSegments, prunePendingChanges } from "./model/pending-changes.js";

const EMPTY_EDITOR_COLLECTION = Object.freeze([]);

function restorePublishApprovedFocus(target, fallback) {
  const focusTarget = target?.isConnected
      && target.disabled !== true
      && target.tagName !== "BODY"
      && typeof target.focus === "function"
    ? target
    : fallback;
  focusTarget?.focus?.({ preventScroll: true });
}

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
  // Every editor save runs through one queue; the saving segment id is derived from what it is running.
  const saveContextRef = useRef(null);
  const [saveQueue] = useState(() => createSaveQueue({
    getContext: () => saveContextRef.current,
    drainAfterSettle: false,
  }));
  const saveQueueSnapshot = useSyncExternalStore(saveQueue.subscribe, saveQueue.getSnapshot);
  const savingSegmentId = savingSegmentIdFrom(saveQueueSnapshot);
  const acquireSaveLock = (kind, lockId) => saveQueue.acquire({ kind, lockId });
  const enqueueSave = (spec) => saveQueue.enqueue(spec);
  const stableSaveIdentity = (identity) => saveQueue.stableIdentity(identity);
  const saveQueueMountedRef = useRef(false);
  useEffect(() => {
    saveQueueMountedRef.current = true;
    return () => {
      saveQueueMountedRef.current = false;
      // StrictMode remounts synchronously; only a real unmount leaves the flag false.
      queueMicrotask(() => {
        if (!saveQueueMountedRef.current) saveQueue.dispose();
      });
    };
  }, []);
  const cancelSaveTasks = (predicate) => saveQueue.cancel(predicate);
  const retargetSaveTasks = (temporaryId, identity) => saveQueue.retarget(temporaryId, identity);
  const getSaveQueueSnapshot = saveQueue.getSnapshot;
  // Unconfirmed edits shown on top of the server projection; actions keep reading server segments.
  const [pendingChanges, dispatchPendingChanges] = useReducer(pendingChangesReducer, []);
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
  const tagEditingRef = useRef(false);
  tagEditingRef.current = tagEditing;
  const [creatingSegmentId, setCreatingSegmentId] = useState(null);
  // A tag picked for a new segment before it can be saved; it is displayed but saved only once the segment is idle.
  const [firstSegmentTagOpen, setFirstSegmentTagOpen] = useState(false);
  const [mergeConfirmation, setMergeConfirmation] = useState(null);
  const [rejectedDeletionPreview, setRejectedDeletionPreview] = useState(null);
  const mergeCancelButtonRef = useRef(null);
  const [publishApprovedOpen, setPublishApprovedOpen] = useState(false);
  const [publishApprovedError, setPublishApprovedError] = useState("");
  const publishApprovedCancelButtonRef = useRef(null);
  const publishApprovedRestoreFocusRef = useRef(null);
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
    analysisRun,
    analysisStatus,
    importNativeSegments,
    nativeImportState,
    startFullAnalysis,
  } = useSegmentAnalysis(
    detail.video.id,
    onReload,
    compatibilityMode,
    detail.shotBoundaries?.length || 0,
    shotBoundaryFingerprint(detail.shotBoundaries || []),
    (kind, lockId) => saveQueue.acquire({ kind, lockId }),
  );
  const [materializeOpen, setMaterializeOpen] = useState(false);
  const [materializePreview, setMaterializePreview] = useState(null);
  const [materializeLoading, setMaterializeLoading] = useState(compatibilityMode);
  const [materializeRefreshToken, setMaterializeRefreshToken] = useState(0);
  const [materializing, setMaterializing] = useState(false);
  const [materializeError, setMaterializeError] = useState("");
  const [configuringTag, setConfiguringTag] = useState(null);
  const materializeButtonRef = useRef(null);
  const materializeCancelButtonRef = useRef(null);
  const materializeRestoreFocusRef = useRef(false);
  const [incorrectExamples, setIncorrectExamples] = useState([]);
  const [exportingExamples, setExportingExamples] = useState(false);
  const [removingExampleId, setRemovingExampleId] = useState(null);
  const wideLayout = useWideEditorLayout();
  const seekRef = useRef(null);
  const playbackControlsRef = useRef(null);
  const shortcutHandlerRef = useRef(null);
  const pendingInitialSeekRef = useRef(initialSegmentId);
  const centerTimelineRef = useRef(null);
  const mediaStackRef = useRef(null);
  const commonActionsRef = useRef(null);
  const focusRowRef = useRef(null);
  const workspaceRef = useRef(null);
  const editorRef = useRef(null);
  const railToggleRef = useRef(null);
  const filtersButtonRef = useRef(null);
  const slotButtonRef = useRef(null);
  const tagSearchRef = useRef(null);
  const pendingTagEditSegmentIdRef = useRef(null);
  const pendingFirstSegmentStartSecRef = useRef(null);
  const optimisticSegmentIdRef = useRef(-1_000_000_000_000);
  const pendingDuplicateRef = useRef(null);
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
  const materializeInventoryFingerprint = useMemo(() => JSON.stringify({
    segments: segments.map((segment) => [
        segment.id,
        segment.itemId,
        segment.nativeSegmentId,
        segment.tagId,
        segment.startSec,
        segment.endSec,
        segment.reviewState,
        segment.published,
        segment.sourceKey,
        segment.sourceRunId,
        segment.confidence,
        segment.revision,
        segment.updatedAt,
      ]),
    performerSlots: (detail.performerSlots || EMPTY_EDITOR_COLLECTION).map((slot) => [
      slot.segmentId,
      slot.slotDefinitionId,
      slot.performerId,
      slot.sortOrder,
    ]),
    itemMetadata: detail.itemMetadata || {},
  }), [segments, detail.performerSlots, detail.itemMetadata]);
  useEffect(() => {
    if (!compatibilityMode) {
      setMaterializePreview(null);
      setMaterializeLoading(false);
      return undefined;
    }
    if (savingSegmentId != null) {
      setMaterializeLoading(true);
      return undefined;
    }
    let active = true;
    setMaterializeLoading(true);
    const timer = setTimeout(() => {
      requestJson(`/videos/${video.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 }),
      }).then((preview) => {
        if (!active) return;
        setMaterializePreview(preview);
        setMaterializeError("");
      }).catch((error) => {
        if (!active) return;
        setMaterializePreview(null);
        setMaterializeError(error.message || "Unable to preview derived segments.");
      }).finally(() => {
        if (active) setMaterializeLoading(false);
      });
    }, 150);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [compatibilityMode, video.id, materializeInventoryFingerprint, materializeRefreshToken, savingSegmentId]);
  const refreshMaterializationPreview = () =>
    setMaterializeRefreshToken((current) => current + 1);
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
    // Only reclaim focus from an open tag field; a deferred save must not pull focus from wherever the user moved on to.
    const wasEditing = tagEditingRef.current;
    setTagEditing(false);
    if (wasEditing) requestAnimationFrame(() => editorRef.current?.focus({ preventScroll: true }));
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
    // Keep text typed while a new segment was still saving when its selection moves to the saved id.
    if (document.activeElement === input) return;
    input?.focus({ preventScroll: true });
    input?.select();
  }, [tagEditing, selectedSegmentId]);

  useEffect(() => {
    // A tag input that unmounts while focused (for example after a failed create) would strand focus on the page body.
    if (tagEditing) return;
    const ownerDocument = editorRef.current?.ownerDocument;
    if (ownerDocument && ownerDocument.activeElement === ownerDocument.body)
      editorRef.current.focus({ preventScroll: true });
  }, [tagEditing]);

  useEffect(() => {
    const initialSwimlanes = groupSegmentsIntoSwimlanes(
      filterEditorSegments(detail.segments, detail.performerSlots || [], normalizeEditorSegmentFilters({}),
        compatibilityMode && hideDerivedSegments, detail.segmentGroups || []),
      detail.segmentGroups || [], detail.performerSlots || [],
    );
    const nextSegmentId = detail.segments.find((segment) => segment.id === initialSegmentId)?.id
      ?? findInitialSegmentSelection(initialSwimlanes)?.id ?? null;
    setSelectedSegmentId(nextSegmentId);
    setSelectedSegmentIds(nextSegmentId == null ? [] : [nextSegmentId]);
    selectionAnchorIdRef.current = nextSegmentId;
    selectionRangeBaseIdsRef.current = [];
    setSelectedSegmentGroupKey(segmentGroupKeyForSegment(initialSwimlanes, nextSegmentId));
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
      const height = Math.max(0, element.clientHeight - (commonActionsRef.current?.offsetHeight || 0));
      setMediaStackHeight(height);
      setEditorLayout((layout) => {
        const timelineRatio = clampTimelineRatioForHeight(layout.timelineRatio, height);
        return timelineRatio === layout.timelineRatio ? layout : { ...layout, timelineRatio };
      });
    };
    const observer = new ResizeObserver(update);
    observer.observe(element);
    if (commonActionsRef.current) observer.observe(commonActionsRef.current);
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

  const displayedSegments = useMemo(
    () => applyPendingChanges(segments, pendingChanges),
    [segments, pendingChanges],
  );
  useLayoutEffect(() => {
    // Confirmed changes are dropped before paint in the render that carries the confirmed data.
    if (prunePendingChanges(pendingChanges, detail) !== pendingChanges) dispatchPendingChanges({ type: "prune", detail });
  }, [detail, pendingChanges]);
  const visibleSegments = useMemo(
    () => hideCollectedFeedbackSegments(
      filterEditorSegments(
        displayedSegments,
        performerSlots,
        editorFilters,
        compatibilityMode && hideDerivedSegments,
        segmentGroups,
      ),
      incorrectExamples,
      true,
    ),
    [
      displayedSegments,
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
      displayedSegments,
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
  const provenanceSources = [...new Set(displayedSegments.map((segment) => segment.sourceKey).filter(Boolean))]
    .sort((left, right) => provenanceSourceLabel(left).localeCompare(provenanceSourceLabel(right)));
  const activeFilterCount = activeEditorFilterCount(
    editorFilters,
    compatibilityMode && hideDerivedSegments,
  );
  const allSwimlanes = useMemo(
    () => groupSegmentsIntoSwimlanes(visibleSegments, segmentGroups, performerSlots),
    [visibleSegments, segmentGroups, performerSlots],
  );
  const displayedSelectedSegment = resolveEditorSegmentSelection(
    allSwimlanes,
    selectedSegmentId,
    initialSegmentId,
  );
  // Visibility follows the displayed tag, but actions read and write the server projection.
  // Temporary segments are only pending inserts, so actions see them alongside the server segments.
  const actionSegments = useMemo(() => {
    const inserted = pendingInsertedSegments(pendingChanges);
    return inserted.length === 0 ? segments : [...segments, ...inserted];
  }, [segments, pendingChanges]);
  const selectedSegment = displayedSelectedSegment == null
    ? null
    : actionSegments.find((segment) => segment.id === displayedSelectedSegment.id) || displayedSelectedSegment;
  const selectedSegments = resolveSelectedSegments(actionSegments, resolveSelectedSegments(visibleSegments, selectedSegmentIds)
    .map((segment) => segment.id));
  const canMoveSelectionToBin = !compatibilityMode
    && selectedSegments.length > 0
    && selectedSegments.every((segment) => segment.nativeSegmentId != null);
  const visibleSegmentIds = visibleSegments.map((segment) => segment.id);
  const visibleSegmentIdsFingerprint = visibleSegmentIds.join("|");
  selectedSegmentIdRef.current = selectedSegment?.id ?? null;
  const selectedPerformerSlots = performerSlotsBySegment.get(selectedSegment?.id) || [];
  const selectedSlotStatus = performerSlotStatusFromSegmentSlots(selectedPerformerSlots);
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
  const hasPreviousUnreviewed = findUnreviewedSelection(swimlanes, selectedSegment?.id, -1, true) != null;
  const hasNextUnreviewed = findUnreviewedSelection(swimlanes, selectedSegment?.id, 1, true) != null;
  const selectedSegmentGroupForSegment = selectedSegment ? segmentGroupKeyForSegment(allSwimlanes, selectedSegment.id) : null;
  const segmentGroupKeys = segmentGroups.length > 0 ? groupedSegmentRail.map((group) => group.key) : [];
  const segmentGroupKeysFingerprint = segmentGroupKeys.join("|");
  const timelineDuration = Math.max(
    0,
    Number(video.videoFile?.duration) || 0,
    ...displayedSegments.map((segment) => Number(segment.endSec ?? segment.startSec) || 0),
  );
  const mediaDuration = Number(video.videoFile?.duration) > 0 ? Number(video.videoFile.duration) : null;
  const historyActions = history.actions || [];
  const playbackShortcutConfig = readPlaybackShortcutConfig();

  useEffect(() => {
    const reconciledId = selectedSegmentId === CLEARED_SEGMENT_SELECTION_ID
      ? selectedSegmentId
      : selectedSegment?.id ?? null;
    if (reconciledId !== selectedSegmentId)
      setSelectedSegmentId(reconciledId);
  }, [selectedSegment, selectedSegmentId]);

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

  const selectedItemMetadata = selectedSegment?.itemId == null
    ? null
    : detail.itemMetadata?.[selectedSegment.itemId] || null;
  const provenance = {
    key: selectedSegment?.itemId != null
      ? `item:${selectedSegment.itemId}`
      : selectedSegment?.nativeSegmentId != null
        ? `native:${selectedSegment.nativeSegmentId}`
        : null,
    loading: false,
    error: detail.itemMetadataAvailable === false
      ? "Provenance is unavailable."
      : null,
    items: detail.itemMetadataAvailable
      ? selectedItemMetadata?.provenance
        || selectedSegment?.fieldProvenance
        || []
      : [],
  };
  const lineage = selectedSegment?.itemId != null
    ? {
        loading: false,
        error: detail.lineageMetadataAvailable === false ? "Lineage is unavailable." : null,
        data: detail.lineageMetadataAvailable ? selectedItemMetadata?.lineage || null : null,
      }
    : {
        loading: false,
        error: "Lineage is available in Full mode.",
        data: null,
      };

  useEffect(() => {
    setStartInput(displayedSelectedSegment == null ? "" : String(displayedSelectedSegment.startSec));
    setEndInput(displayedSelectedSegment?.endSec == null ? "" : String(displayedSelectedSegment.endSec));
  }, [displayedSelectedSegment?.id, displayedSelectedSegment?.startSec, displayedSelectedSegment?.endSec]);

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
  const { acceptHistory, recordHistoryAction, mutateSegment, runSegmentMutation, completeReview, createSegment, splitSegment, duplicateSegment, saveTiming, applyShortcutTiming } = createPrimarySegmentActions({
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
    optimisticSegmentIdRef,
    pendingDuplicateRef,
    pendingFirstSegmentStartSecRef,
    pendingTagEditSegmentIdRef,
    enqueueSave,
    pendingChanges,
    retargetSaveTasks,
    replaceSegmentSelection,
    savingSegmentId,
    segments,
    selectedSegment,
    selectedSegmentIdRef,
    selectedSegments,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setCreatingSegmentId,
    setEditorFilters,
    setFirstSegmentTagOpen,
    setHideDerivedSegments,
    setHistory,
    setHistoryOpen,
    setPublishApprovedError,
    setSaveMessage,
    acquireSaveLock,
    dispatchPendingChanges,
    setSelectedSegmentGroupKey,
    setSelectedSegmentId,
    setSelectedSegmentIds,
    setTagEditing,
    startInput,
    tagEditingRef,
    timelineDuration,
    video,
  });
  function openPublishApprovedDialog(trigger = null) {
    if (!compatibilityMode
        || savingSegmentId != null
        || !segments.some((segment) => !segment.published && segment.reviewState === "approved")) return;
    const ownerDocument = editorRef.current?.ownerDocument ?? document;
    const activeElement = ownerDocument.activeElement === ownerDocument.body
      ? null
      : ownerDocument.activeElement;
    publishApprovedRestoreFocusRef.current = trigger?.isConnected
        && trigger !== ownerDocument.body
      ? trigger
      : activeElement;
    setPublishApprovedError("");
    setPublishApprovedOpen(true);
  }
  function closePublishApprovedDialog() {
    if (savingSegmentId != null) return;
    setPublishApprovedOpen(false);
    setPublishApprovedError("");
    requestAnimationFrame(() => {
      restorePublishApprovedFocus(
        publishApprovedRestoreFocusRef.current,
        editorRef.current,
      );
      publishApprovedRestoreFocusRef.current = null;
    });
  }
  async function publishApprovedDrafts() {
    if (await completeReview()) closePublishApprovedDialog();
  }
  const { closeMergeConfirmation, mergeSelectedSwimlane, saveSelectedReviewState } = createReviewActions({
    acceptHistory,
    compatibilityMode,
    detail,
    detailPanelRef,
    getSaveQueueSnapshot,
    historyRef,
    onConflict,
    onDetailChange,
    onReload,
    recordHistoryAction,
    revealSegmentGroupForSelection,
    savingSegmentId,
    selectedGroups,
    selectedSegment,
    selectedSegmentIdRef,
    selectedSegments,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setMergeConfirmation,
    setSaveMessage,
    acquireSaveLock,
    dispatchPendingChanges,
    enqueueSave,
    stableSaveIdentity,
    setSelectedSegmentId,
    setSelectedSegmentIds,
    video,
  });
  const cancelQueuedReviewsForSegments = (cancelledSegments) => {
    const cancelledTargets = (cancelledSegments || []).map(segmentIdentity);
    saveQueue.cancel((task) => task.kind === "review" && targetsOverlap(task.targets, cancelledTargets));
  };
  // Queued saves start only after the previous save's results have rendered, so they read fresh data.
  // The settles this render has seen; the commit below lets queued saves start only if it saw them all.
  const renderedSettleCount = saveQueue.settledCount();
  useLayoutEffect(() => {
    // Captured after commit, so queued saves never read data from a render that did not happen.
    saveQueue.markCommitted(renderedSettleCount);
    saveContextRef.current = {
      detail,
      segments,
      onConflict,
      onDetailChange,
      onReload,
      tagEditing,
      selectedSegmentIds,
      activeSegmentId: selectedSegment?.id ?? null,
    };
  });
  useEffect(() => {
    saveQueue.poke();
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
    creatingSegmentId,
    detail,
    editorFilters,
    editorRef,
    exportingExamples,
    hideDerivedSegments,
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
    performerSlots,
    cancelSaveTasks,
    dispatchPendingChanges,
    enqueueSave,
    stableSaveIdentity,
    pendingChanges,
    runSegmentMutation,
    recordHistoryAction,
    refreshMaterializationPreview,
    removingExampleId,
    revealSegmentGroupForSelection,
    savingSegmentId,
    segmentGroups,
    segments,
    selectedSegment,
    selectedSegmentIdRef,
    selectedSegments,
    selectionAnchorIdRef,
    selectionRangeBaseIdsRef,
    setAutoAssignError,
    setAutoAssignOpen,
    setAutoAssigning,
    setEditorFilters,
    setExportingExamples,
    setHideDerivedSegments,
    setIncorrectExamples,
    setMaterializeError,
    setMaterializeLoading,
    setMaterializeOpen,
    setMaterializePreview,
    setMaterializing,
    setRemovingExampleId,
    setRejectedDeletionPreview,
    setSaveMessage,
    acquireSaveLock,
    setSelectedSegmentGroupKey,
    setSelectedSegmentId,
    setSelectedSegmentIds,
    video,
  });
  const { applySegmentHistoryState, applyPerformerSlotHistoryState, applyHistoryState, restoreHistoryTarget, updateTimelineRatio, updateTimelineRatioFromPointer, handleSeparatorPointerDown, handleSeparatorPointerMove, handleSeparatorKeyDown, panelWidthMaximum, updatePanelWidth, handlePanelSeparatorPointer, panelSeparatorProps, toggleSegmentRail, toggleSegmentGroup, mutateShotBoundary } = createHistoryAndLayoutActions({
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
    commonActionsRef,
    onDetailChange,
    onReload,
    railToggleRef,
    recordHistoryAction,
    savingSegmentId,
    setCollapsedSegmentGroups,
    setEditorLayout,
    setHistorySaving,
    setIncorrectExamples,
    setSaveMessage,
    acquireSaveLock,
    enqueueSave,
    getSaveQueueSnapshot,
    shotBoundaries,
    timelineDuration,
    video,
    workspaceRef,
  });
  const { executeShortcutById, stepVideoFrame } = createShortcutHandler({
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
    openPublishApprovedDialog,
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

  shortcutHandlerRef.current = executeShortcutById;
  const keyboardActions = useMemo(() => SEGMENT_STUDIO_SHORTCUTS.map((shortcut) => ({
      id: shortcut.id,
      enabled: shortcutAvailableInMode(shortcut, compatibilityMode),
      surface: "local",
      action: (invocation) => shortcutHandlerRef.current?.(shortcut.id, invocation),
    })), [compatibilityMode]);
  useRegisterExtensionKeyboardActions(SEGMENT_STUDIO_EXTENSION_ID, keyboardActions);

  const timelineRatioBounds = calculateTimelineRatioBounds(mediaStackHeight);
  const markerRailWidth = clampEditorPanelWidth(editorLayout.markerRailWidth, panelWidthMaximum("markerRailWidth"));
  const detailWidth = clampEditorPanelWidth(editorLayout.detailWidth, panelWidthMaximum("detailWidth"));
  return h(SegmentEditorView, {
    activeFilterCount,
    allSwimlanes,
    analysisError,
    analysisRun,
    analysisStatus,
    approvalFacetCounts,
    autoAssignCandidates,
    autoAssignError,
    autoAssignOpen,
    autoAssignPerformers,
    autoAssigning,
    canMoveSelectionToBin,
    captureTrainingExport,
    cancelQueuedReviewsForSegments,
    removeIncorrectExample,
    rejectedDeletionPreview,
    centerTimelineRef,
    closeEditorFilters,
    closeFirstSegmentTagDialog,
    closeMaterializeDialog,
    closeMergeConfirmation,
    closePublishApprovedDialog,
    closeTagEditing,
    collapsedSegmentGroups,
    commonActionsRef,
    compatibilityMode,
    configuringTag,
    createSegment,
    currentTime,
    deleteRejectedSegments,
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
    hasNextUnreviewed,
    hasPreviousUnreviewed,
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
    mergeSaving: isKindRunning(saveQueueSnapshot, "merge"),
    mergeSelectedSwimlane,
    nativeImportState,
    onNavigate,
    onDetailChange,
    openPublishApprovedDialog,
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
    publishApprovedCancelButtonRef,
    publishApprovedDrafts,
    publishApprovedError,
    publishApprovedOpen,
    quickSearchOpen,
    railScrollRef,
    railToggleRef,
    recordHistoryAction,
    restoreHistoryTarget,
    runEditorAction: executeShortcutById,
    stepVideoFrame,
    saveMessage,
    setSaveMessage,
    saveTag,
    saveTiming,
    savingSegmentId,
    acquireSaveLock,
    seekRef,
    segmentGroups,
    segmentRailLayout,
    segments: displayedSegments,
    selectAllVideoSegments,
    selectSegment,
    selectSegmentCollection,
    selectedGroups,
    selectedPerformerSlots,
    selectedSegment: displayedSelectedSegment,
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
    setRejectedDeletionPreview,
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
    creatingSegmentId,
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

export { SegmentEditor, restorePublishApprovedFocus };
