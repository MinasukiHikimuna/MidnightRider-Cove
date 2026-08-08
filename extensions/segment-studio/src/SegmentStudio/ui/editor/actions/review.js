import { selectedSwimlaneMerge } from "../model/swimlanes.js";
import { readMergeConfirmationPreference, writeMergeConfirmationPreference } from "../model/selection.js";
import { completeOperation, formatTime, operationIdFor, requestJson } from "../../shared/api.js";
import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { findSegmentByStableIdentity, shouldRestoreTransitionSelection, toggledSelectionReviewState } from "../model/shortcuts.js";
import { segmentsHistoryState } from "../model/history.js";

function createReviewActions(context) {
  const { acceptHistory, compatibilityMode, detail, detailPanelRef, historyRef, mergeSavingRef, onConflict, onDetailChange, onReload, recordHistoryAction, revealSegmentGroupForSelection, reviewSavingRef, savingSegmentId, selectedGroups, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setMergeConfirmation, setSaveMessage, setSavingSegmentId, setSelectedSegmentId, setSelectedSegmentIds, video } = context;

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
      setSavingSegmentId(survivor.id);
      try {
        const consumedSegments = merge.segments.slice(1);
        if (!compatibilityMode || survivor.nativeSegmentId != null) {
          const operations = consumedSegments.map((consumed) => {
            const key = `merge-native-selection:${video.id}:${survivor.id}:${consumed.id}:${survivor.updatedAt}:${consumed.updatedAt}`;
            return { key, operationId: operationIdFor(key), segmentId: consumed.id, expectedUpdatedAt: consumed.updatedAt };
          });
          survivor = {
            ...survivor,
            ...await requestJson(`/videos/${video.id}/segments/merge-selection`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                survivorSegmentId: survivor.id,
                expectedSurvivorUpdatedAt: survivor.updatedAt,
                consumedSegments: operations.map(({ key: _key, ...operation }) => operation),
                historyReceiptId,
              }),
            }),
          };
          operations.forEach(({ key }) => completeOperation(key));
        } else {
          const operations = consumedSegments.map((consumed) => {
            const key = `merge-draft-selection:${video.id}:${survivor.itemId}:${consumed.itemId}:${survivor.revision}:${consumed.revision}`;
            return { key, operationId: operationIdFor(key), itemId: consumed.itemId, expectedRevision: consumed.revision };
          });
          const result = await requestJson(`/videos/${video.id}/drafts/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorItemId: survivor.itemId,
              expectedSurvivorRevision: survivor.revision,
              consumedDrafts: operations.map(({ key: _key, ...operation }) => operation),
            }),
          });
          survivor = { ...survivor, ...result.draft };
          operations.forEach(({ key }) => completeOperation(key));
        }
        const loaded = await onReload();
        const reloadedSurvivor = findSegmentByStableIdentity(
          loaded?.segments,
          { nativeSegmentId: survivor.nativeSegmentId ?? survivor.id },
        ) || survivor;
        setSelectedSegmentIds([reloadedSurvivor.id]);
        setSelectedSegmentId(reloadedSurvivor.id);
        selectionAnchorIdRef.current = reloadedSurvivor.id;
        selectionRangeBaseIdsRef.current = [];
        if (compatibilityMode) {
          acceptHistory(EMPTY_EDITOR_HISTORY);
        } else {
          await recordHistoryAction(
            "segments.merge",
            `Merged ${merge.segments.length} segments`,
            basicBeforeState,
            segmentsHistoryState([reloadedSurvivor], false),
            historyReceiptId,
          );
        }
        revealSegmentGroupForSelection(reloadedSurvivor.id);
        setSaveMessage(`${merge.segments.length} segments merged into ${formatTime(merge.startSec)} – ${endLabel}.`);
      } catch (error) {
        if (error.status === 409) await onConflict();
        else setSaveMessage(error.message || "Unable to merge selected segments.");
      } finally {
        mergeSavingRef.current = false;
        setSavingSegmentId(null);
      }
    }

    async function saveSelectedReviewState(requestedState) {
      if (selectedSegments.length === 0 || reviewSavingRef.current || savingSegmentId != null) return;
      const reviewState = toggledSelectionReviewState(selectedSegments, requestedState);
      const candidates = selectedSegments.filter((segment) => segment.reviewState !== reviewState);
      if (candidates.length === 0) return;
      const identities = selectedSegments.map((segment) => ({
        id: segment.id,
        itemId: segment.itemId,
        nativeSegmentId: segment.nativeSegmentId,
      }));
      const activeIdentity = identities.find((identity) => identity.id === selectedSegment?.id) || identities[0];
      const restoreSelection = (loaded) => {
        if (!loaded?.segments) return;
        if (!shouldRestoreTransitionSelection(selectedSegmentIdRef.current, activeIdentity.id))
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
      setSavingSegmentId(selectedSegment?.id ?? candidates[0].id);
      setSaveMessage(`Updating ${candidates.length} selected segment${candidates.length === 1 ? "" : "s"}…`);
      try {
        const result = await requestJson(`/videos/${video.id}/segments/review-state`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedHistoryRevision: historyRef.current.revision,
            reviewState,
            segments: selectedSegments.map((segment) => segment.published
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
        if (error.status === 409 && error.payload?.currentHistory)
          acceptHistory(error.payload.currentHistory);
        if (error.status === 409)
          restoreSelection(await onConflict());
        setSaveMessage(error.message || "Unable to update the selected segments.");
      } finally {
        reviewSavingRef.current = false;
        setSavingSegmentId(null);
      }
    }

  return { closeMergeConfirmation, mergeSelectedSwimlane, saveSelectedReviewState };
}

export { createReviewActions };
