import { applySegmentMergeDelta, selectedSwimlaneMerge } from "../model/swimlanes.js";
import { readMergeConfirmationPreference, writeMergeConfirmationPreference } from "../model/selection.js";
import { completeOperation, formatTime, operationIdFor, requestJson } from "../../shared/api.js";
import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { createQueuedReviewRequest, findSegmentByStableIdentity, resolveQueuedReviewRequest, shouldRestoreTransitionSelection, toggledSelectionReviewState } from "../model/shortcuts.js";
import { segmentsHistoryState } from "../model/history.js";
import { savingSegmentIdFrom, segmentIdentity, targetsOverlap } from "../model/save-queue.js";
import { createPendingChangeId } from "../model/pending-changes.js";
import { mergeSegmentsProjection } from "../model/optimistic.js";
// The editor-delta reducer is shared with the feedback flow; it is not feedback-specific.
import { applyFeedbackEditorDelta } from "../model/feedback.js";

function createReviewActions(context) {
  const { acceptHistory, acquireSaveLock, compatibilityMode, detail, detailPanelRef, dispatchPendingChanges, enqueueSave, getSaveQueueSnapshot, stableSaveIdentity, historyRef, onConflict, onDetailChange, onReload, recordHistoryAction, revealSegmentGroupForSelection, savingSegmentId, selectedGroups, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setMergeConfirmation, setSaveMessage, setSelectedSegmentId, setSelectedSegmentIds, video } = context;

  function closeMergeConfirmation() {
      setMergeConfirmation(null);
      requestAnimationFrame(() => detailPanelRef.current?.focus({ preventScroll: true }));
    }

    async function mergeSelectedSwimlane(
      confirmed = false,
      skipFutureConfirmation = false,
      confirmedMerge = null,
    ) {
      if (savingSegmentId != null) return;
      const merge = confirmedMerge || selectedSwimlaneMerge(
        selectedGroups,
        { nativeOnly: !compatibilityMode },
      );
      if (!merge) {
        setSaveMessage("Select at least two segments from one swimlane.");
        return;
      }
      if (!confirmed && readMergeConfirmationPreference()) {
        setMergeConfirmation(merge);
        return;
      }
      if (skipFutureConfirmation)
        writeMergeConfirmationPreference(false);
      const endLabel = merge.endSec == null ? "open end" : formatTime(merge.endSec);
      let survivor = merge.segments[0];
      const basicBeforeState = !compatibilityMode
        ? segmentsHistoryState(merge.segments, false)
        : null;
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      const originalSelectionIds = merge.segments.map((segment) => segment.id);
      // Show the merged span on top of the server projection until the merge is confirmed or fails.
      const mergedSurvivor = mergeSegmentsProjection(detail, merge.segments).segments
        .find((segment) => segment.id === survivor.id);
      const mergeValues = {
        startSec: mergedSurvivor.startSec,
        endSec: mergedSurvivor.endSec,
        sourceKey: mergedSurvivor.sourceKey,
        sourceRunId: mergedSurvivor.sourceRunId,
        confidence: mergedSurvivor.confidence,
        isDerived: mergedSurvivor.isDerived,
      };
      const releaseSaveLock = acquireSaveLock("merge", merge.segments[0].id);
      if (!releaseSaveLock) return;
      closeMergeConfirmation();
      const pendingChangeId = createPendingChangeId();
      dispatchPendingChanges({
        type: "add",
        entry: { id: pendingChangeId, op: "merge", targets: merge.segments.map(segmentIdentity), values: mergeValues },
      });
      setSelectedSegmentIds([survivor.id]);
      setSelectedSegmentId(survivor.id);
      selectionAnchorIdRef.current = survivor.id;
      selectionRangeBaseIdsRef.current = [];
      try {
        const consumedSegments = merge.segments.slice(1);
        if (!compatibilityMode || survivor.nativeSegmentId != null) {
          const operations = consumedSegments.map((consumed) => {
            const key = `merge-native-selection:${video.id}:${survivor.id}:${consumed.id}:${survivor.updatedAt}:${consumed.updatedAt}`;
            return { key, operationId: operationIdFor(key), segmentId: consumed.id, expectedUpdatedAt: consumed.updatedAt };
          });
          const delta = await requestJson(`/videos/${video.id}/segments/merge-selection`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                survivorSegmentId: survivor.id,
                expectedSurvivorUpdatedAt: survivor.updatedAt,
                consumedSegments: operations.map(({ key: _key, ...operation }) => operation),
                historyReceiptId,
              }),
            });
          survivor = delta.survivor;
          onDetailChange((current) => applySegmentMergeDelta(current, delta), video.id);
          dispatchPendingChanges({ type: "confirm", key: pendingChangeId, applied: true });
          operations.forEach(({ key }) => completeOperation(key));
        } else {
          const operations = consumedSegments.map((consumed) => {
            const key = `merge-draft-selection:${video.id}:${survivor.itemId}:${consumed.itemId}:${survivor.revision}:${consumed.revision}`;
            return { key, operationId: operationIdFor(key), itemId: consumed.itemId, expectedRevision: consumed.revision };
          });
          const delta = await requestJson(`/videos/${video.id}/drafts/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorItemId: survivor.itemId,
              expectedSurvivorRevision: survivor.revision,
              consumedDrafts: operations.map(({ key: _key, ...operation }) => operation),
            }),
          });
          survivor = delta.survivor;
          onDetailChange((current) => applySegmentMergeDelta(current, delta), video.id);
          dispatchPendingChanges({ type: "confirm", key: pendingChangeId, applied: true });
          operations.forEach(({ key }) => completeOperation(key));
        }
        setSelectedSegmentIds([survivor.id]);
        setSelectedSegmentId(survivor.id);
        selectionAnchorIdRef.current = survivor.id;
        selectionRangeBaseIdsRef.current = [];
        if (compatibilityMode) {
          acceptHistory(EMPTY_EDITOR_HISTORY);
        } else {
          await recordHistoryAction(
            "segments.merge",
            `Merged ${merge.segments.length} segments`,
            basicBeforeState,
            segmentsHistoryState([survivor], false),
            historyReceiptId,
          );
        }
        revealSegmentGroupForSelection(survivor.id);
        setSaveMessage(`${merge.segments.length} segments merged into ${formatTime(merge.startSec)} – ${endLabel}.`);
      } catch (error) {
        dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        setSelectedSegmentIds(originalSelectionIds);
        setSelectedSegmentId(selectedSegment?.id ?? originalSelectionIds[0] ?? null);
        selectionAnchorIdRef.current = selectedSegment?.id ?? originalSelectionIds[0] ?? null;
        selectionRangeBaseIdsRef.current = [];
        if (error.status === 409) await onConflict();
        else setSaveMessage(error.message || "Unable to merge selected segments.");
      } finally {
        releaseSaveLock();
      }
    }

    // Review decisions wait their turn behind any running save, including another review, and are
    // resolved against the segments as they are when the decision runs.
    function saveSelectedReviewState(
      requestedState,
      requestedSegments = selectedSegments,
      requestedSegment = selectedSegment,
    ) {
      if (requestedSegments.length === 0) return Promise.resolve(null);
      const request = createQueuedReviewRequest(requestedState, requestedSegments, requestedSegment);
      const activeIndex = Math.max(0, request.identities.indexOf(request.activeIdentity));
      // Read the queue directly: a save started earlier in this render is not in `savingSegmentId` yet.
      const queueSnapshot = getSaveQueueSnapshot();
      const waiting = savingSegmentIdFrom(queueSnapshot) != null
        || queueSnapshot.queued.some((task) => targetsOverlap(task.targets, request.identities.map(stableSaveIdentity)));
      const task = enqueueSave({
        kind: "review",
        lockId: request.activeIdentity.id,
        targets: request.identities,
        whenBusy: "enqueue",
        // The queue may retarget identities (a created segment receiving its saved id), so read them when the task runs.
        run: (saveContext) => runReviewDecision(saveContext, {
          ...request,
          identities: saveContext.targets,
          activeIdentity: saveContext.targets[activeIndex],
        }),
      });
      if (!task) {
        setSaveMessage("Wait for the history restore to finish.");
        return Promise.resolve(null);
      }
      if (waiting) setSaveMessage(`${requestedState === "approved" ? "Approval" : "Rejection"} queued…`);
      return task.done;
    }

    async function runReviewDecision({ detail, segments, onConflict, onReload }, request) {
      const resolved = resolveQueuedReviewRequest(request, segments);
      if (!resolved) {
        setSaveMessage("The queued review could not find its segment after refreshing.");
        return;
      }
      const { requestedState, selectedSegments: reviewSegments, selectedSegment: reviewSegment } = resolved;
      const reviewState = toggledSelectionReviewState(reviewSegments, requestedState);
      const candidates = reviewSegments.filter((segment) => segment.reviewState !== reviewState);
      if (candidates.length === 0) return;
      const identities = reviewSegments.map((segment) => ({
        id: segment.id,
        itemId: segment.itemId,
        nativeSegmentId: segment.nativeSegmentId,
      }));
      const activeIdentity = identities.find((identity) => identity.id === reviewSegment?.id) || identities[0];
      const restoreSelection = (loaded, force = false) => {
        if (!loaded?.segments) return;
        if (!force && !shouldRestoreTransitionSelection(selectedSegmentIdRef.current, activeIdentity.id))
          return;
        const reloadedSelection = identities
          .map((identity) => findSegmentByStableIdentity(loaded?.segments, identity))
          .filter(Boolean);
        const reloadedActive = findSegmentByStableIdentity(loaded?.segments, activeIdentity)
          || reloadedSelection[0]
          || null;
        setSelectedSegmentIds(reloadedSelection.map((segment) => segment.id));
        setSelectedSegmentId(reloadedActive?.id ?? null);
        selectionAnchorIdRef.current = reloadedActive?.id ?? null;
        selectionRangeBaseIdsRef.current = [];
      };
      setSaveMessage(`Updating ${candidates.length} selected segment${candidates.length === 1 ? "" : "s"}…`);
      const pendingChangeId = createPendingChangeId();
      dispatchPendingChanges({
        type: "add",
        entry: { id: pendingChangeId, op: "patch", targets: candidates.map(segmentIdentity), values: { reviewState } },
      });
      try {
        const result = await requestJson(`/videos/${video.id}/segments/review-state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedHistoryRevision: historyRef.current.revision,
            reviewState,
            segments: reviewSegments.map((segment) => segment.published
              ? {
                nativeSegmentId: segment.nativeSegmentId,
                expectedUpdatedAt: segment.updatedAt,
              }
              : {
                itemId: segment.itemId,
                expectedRevision: segment.revision,
              }),
          }),
        });
        const resultByIdentity = new Map((result.items || []).map((item) => [
          item.requestedNativeSegmentId != null
            ? `native:${item.requestedNativeSegmentId}`
            : `item:${item.requestedItemId}`,
          item,
        ]));
        identities.forEach((identity) => {
          const item = resultByIdentity.get(identity.nativeSegmentId != null
            ? `native:${identity.nativeSegmentId}`
            : `item:${identity.itemId}`);
          if (!item) return;
          identity.nativeSegmentId = item.nativeSegmentId;
          identity.itemId = item.itemId;
        });
        if (result.history) acceptHistory(result.history);
        // Moving a published segment to the recycling bin changes identities and the import
        // counts the projection carries, so that case still refetches it. A rejection cascades
        // through derivations, so it also refetches unless the server described what changed.
        const requiresProjectionReload = (reviewState === "rejected" && !result.editorDelta)
          || (result.items || []).some((item) =>
            item.requestedNativeSegmentId != null
              && item.nativeSegmentId !== item.requestedNativeSegmentId);
        if (requiresProjectionReload) {
          const loaded = await onReload();
          dispatchPendingChanges({ type: "confirm", key: pendingChangeId, applied: loaded != null });
          restoreSelection(loaded);
          setSaveMessage(`${result.updatedCount} selected segment${result.updatedCount === 1 ? "" : "s"} ${reviewState === "rejected" ? "rejected" : "reset to unreviewed"}.`);
          return;
        }
        // Rejecting cascades through derivations, so the server describes the cascaded rows
        // instead of leaving the editor to refetch the whole projection to find them.
        const applyReviewResult = result.editorDelta
          ? (base) => applyFeedbackEditorDelta(base, result.editorDelta)
          : (base) => ({
            ...base,
            approvedSetVersion: result.approvedSetVersion || base.approvedSetVersion,
            segments: (base.segments || []).map((segment) => {
              const item = resultByIdentity.get(segment.nativeSegmentId != null
                ? `native:${segment.nativeSegmentId}`
                : `item:${segment.itemId}`);
              return item ? {
                ...segment,
                id: item.nativeSegmentId != null ? item.nativeSegmentId : -item.itemId,
                itemId: item.itemId,
                nativeSegmentId: item.nativeSegmentId,
                published: item.nativeSegmentId != null,
                reviewState,
                revision: item.nativeSegmentId != null ? segment.revision : item.revision,
                updatedAt: item.updatedAt,
              } : segment;
            }),
          });
        // Apply to the latest projection so changes that landed during the save are kept.
        onDetailChange(applyReviewResult, video.id);
        dispatchPendingChanges({ type: "confirm", key: pendingChangeId, applied: true });
        restoreSelection(applyReviewResult(detail));
        setSaveMessage(`${result.updatedCount} selected segment${result.updatedCount === 1 ? "" : "s"} ${reviewState === "approved" ? "approved" : reviewState === "rejected" ? "rejected" : "reset to unreviewed"}.`);
      } catch (error) {
        dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        if (error.status === 409 && error.payload?.currentHistory)
          acceptHistory(error.payload.currentHistory);
        const restoredDetail = error.status === 409 ? await onConflict() : detail;
        restoreSelection(restoredDetail, true);
        setSaveMessage(error.message || "Unable to update the selected segments.");
      }
    }

  return { closeMergeConfirmation, mergeSelectedSwimlane, saveSelectedReviewState };
}

export { createReviewActions };
