import { applySegmentMergeDelta, selectedSwimlaneMerge } from "../model/swimlanes.js";
import { readMergeConfirmationPreference, writeMergeConfirmationPreference } from "../model/selection.js";
import { completeOperation, formatTime, operationIdFor, requestJson } from "../../shared/api.js";
import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { createQueuedReviewRequest, findSegmentByStableIdentity, shouldRestoreTransitionSelection, toggledSelectionReviewState } from "../model/shortcuts.js";
import { segmentsHistoryState } from "../model/history.js";
import { mergeSegmentsProjection, patchSegmentProjection, restoreSegmentFieldsProjection, restoreSegmentsProjection } from "../model/optimistic.js";

function createReviewActions(context) {
  const { acceptHistory, compatibilityMode, detail, detailPanelRef, historyRef, mergeSavingRef, onConflict, onDetailChange, onReload, pendingReviewStateRef, recordHistoryAction, revealSegmentGroupForSelection, reviewSavingRef, savingSegmentId, selectedGroups, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setMergeConfirmation, setSaveMessage, setSavingSegmentId, setSelectedSegmentId, setSelectedSegmentIds, video } = context;

  function closeMergeConfirmation() {
      setMergeConfirmation(null);
      requestAnimationFrame(() => detailPanelRef.current?.focus({ preventScroll: true }));
    }

    async function mergeSelectedSwimlane(
      confirmed = false,
      skipFutureConfirmation = false,
      confirmedMerge = null,
    ) {
      if (mergeSavingRef.current || savingSegmentId != null) return;
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
      closeMergeConfirmation();
      const endLabel = merge.endSec == null ? "open end" : formatTime(merge.endSec);

      mergeSavingRef.current = true;
      let survivor = merge.segments[0];
      const basicBeforeState = !compatibilityMode
        ? segmentsHistoryState(merge.segments, false)
        : null;
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      const originalSelectionIds = merge.segments.map((segment) => segment.id);
      const optimisticDetail = mergeSegmentsProjection(detail, merge.segments);
      setSavingSegmentId(survivor.id);
      onDetailChange(optimisticDetail, video.id);
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
          onDetailChange(applySegmentMergeDelta(detail, delta), video.id);
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
          onDetailChange(applySegmentMergeDelta(detail, delta), video.id);
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
        onDetailChange((current) => restoreSegmentsProjection(
          restoreSegmentFieldsProjection(current, [merge.segments[0]], [
            "startSec", "endSec", "sourceKey", "sourceRunId", "confidence", "isDerived",
          ]),
          merge.segments.slice(1),
        ), video.id);
        setSelectedSegmentIds(originalSelectionIds);
        setSelectedSegmentId(selectedSegment?.id ?? originalSelectionIds[0] ?? null);
        selectionAnchorIdRef.current = selectedSegment?.id ?? originalSelectionIds[0] ?? null;
        selectionRangeBaseIdsRef.current = [];
        if (error.status === 409) await onConflict();
        else setSaveMessage(error.message || "Unable to merge selected segments.");
      } finally {
        mergeSavingRef.current = false;
        setSavingSegmentId(null);
      }
    }

    async function saveSelectedReviewState(
      requestedState,
      reviewSegments = selectedSegments,
      reviewSegment = selectedSegment,
    ) {
      if (reviewSegments.length === 0 || reviewSavingRef.current) return;
      if (savingSegmentId != null) {
        pendingReviewStateRef.current.push(createQueuedReviewRequest(
          requestedState,
          reviewSegments,
          reviewSegment,
        ));
        setSaveMessage(`${requestedState === "approved" ? "Approval" : "Rejection"} queued…`);
        return;
      }
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
      reviewSavingRef.current = true;
      setSavingSegmentId(reviewSegment?.id ?? candidates[0].id);
      setSaveMessage(`Updating ${candidates.length} selected segment${candidates.length === 1 ? "" : "s"}…`);
      const optimisticDetail = patchSegmentProjection(
        detail,
        candidates.map((segment) => segment.id),
        { reviewState },
      );
      onDetailChange(optimisticDetail, video.id);
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
        const requiresProjectionReload = reviewState === "rejected"
          || (result.items || []).some((item) => item.requestedNativeSegmentId != null
            && item.nativeSegmentId !== item.requestedNativeSegmentId);
        if (requiresProjectionReload) {
          restoreSelection(await onReload());
          setSaveMessage(`${result.updatedCount} selected segment${result.updatedCount === 1 ? "" : "s"} ${reviewState === "rejected" ? "rejected" : "reset to unreviewed"}.`);
          return;
        }
        const updatedDetail = {
            ...detail,
            approvedSetVersion: result.approvedSetVersion || detail.approvedSetVersion,
            segments: (detail.segments || []).map((segment) => {
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
          };
        onDetailChange(updatedDetail, video.id);
        restoreSelection(updatedDetail);
        setSaveMessage(`${result.updatedCount} selected segment${result.updatedCount === 1 ? "" : "s"} ${reviewState === "approved" ? "approved" : reviewState === "rejected" ? "rejected" : "reset to unreviewed"}.`);
      } catch (error) {
        onDetailChange((current) => restoreSegmentFieldsProjection(
          current,
          candidates,
          ["reviewState"],
        ), video.id);
        if (error.status === 409 && error.payload?.currentHistory)
          acceptHistory(error.payload.currentHistory);
        const restoredDetail = error.status === 409 ? await onConflict() : detail;
        restoreSelection(restoredDetail, true);
        setSaveMessage(error.message || "Unable to update the selected segments.");
      } finally {
        reviewSavingRef.current = false;
        setSavingSegmentId(null);
      }
    }

  return { closeMergeConfirmation, mergeSelectedSwimlane, saveSelectedReviewState };
}

export { createReviewActions };
