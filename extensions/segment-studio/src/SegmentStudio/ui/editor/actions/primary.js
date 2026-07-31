import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { completeOperation, operationIdFor, requestJson } from "../../shared/api.js";
import { segmentHistoryState, segmentsHistoryState } from "../model/history.js";
import { duplicateIdentityFromResponse, duplicateOperationKey, findPublishedSelectionIdentity, findSegmentByStableIdentity, resolveSegmentCreationAction } from "../model/shortcuts.js";
import { groupSegmentsIntoSwimlanes, segmentGroupKeyForSegment } from "../model/swimlanes.js";
import { editorVisibilityIncludingSegment } from "../model/selection.js";
import { validateSegmentTiming } from "../model/timeline.js";

function shouldReloadAfterSegmentMutation(segment, values, compatibilityMode) {
  return true;
}

function createPrimarySegmentActions(context) {
  const { compatibilityMode, currentTime, detail, editorFilters, endInput, hideDerivedSegments, historyRef, mediaDuration, onConflict, onDetailChange, onReload, pendingDuplicateRef, pendingFirstSegmentStartSecRef, pendingTagEditSegmentIdRef, replaceSegmentSelection, savingSegmentId, segments, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setEditorFilters, setFirstSegmentTagOpen, setHideDerivedSegments, setHistory, setHistoryOpen, setSaveMessage, setSavingSegmentId, setSelectedSegmentGroupKey, setSelectedSegmentId, setSelectedSegmentIds, startInput, timelineDuration, video } = context;

  function acceptHistory(next) {
      historyRef.current = next || EMPTY_EDITOR_HISTORY;
      setHistory(historyRef.current);
    }

    async function recordHistoryAction(
      kind,
      label,
      beforeState,
      afterState,
      receiptId = null,
    ) {
      try {
        const next = await requestJson(`/videos/${video.id}/history/actions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedRevision: historyRef.current.revision,
            kind,
            label,
            beforeState,
            afterState,
            receiptId,
          }),
        });
        acceptHistory(next);
        return true;
      } catch (error) {
        if (error.status === 409 && error.payload?.current)
          acceptHistory(error.payload.current);
        setSaveMessage("The change saved, but editor history could not be updated.");
        return false;
      }
    }

    async function mutateSegment(segment, values, recordHistory = true, historyLabel = null) {
      if (!segment || savingSegmentId != null) return null;
      const historyReceiptId =
        recordHistory && !compatibilityMode ? crypto.randomUUID() : null;
      setSavingSegmentId(segment.id);
      setSaveMessage(recordHistory ? "Saving directly to Cove…" : "Restoring history…");
      try {
        if (compatibilityMode
            && segment.nativeSegmentId == null
            && segment.itemId != null) {
          const operationKey = `draft-update:${video.id}:${segment.itemId}:${segment.revision}:${values.tagId}:${values.startSec}:${values.endSec ?? "open"}:${values.reviewState ?? segment.reviewState}`;
          const result = await requestJson(`/videos/${video.id}/drafts/${segment.itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              expectedRevision: segment.revision,
              startSec: values.startSec,
              endSec: values.endSec,
              tagId: values.tagId,
              reviewState: values.reviewState,
            }),
          });
          completeOperation(operationKey);
          if (recordHistory)
            await recordHistoryAction(
              "segment.update",
              historyLabel || "Changed segment",
              segmentHistoryState(segment, compatibilityMode),
              segmentHistoryState(
                { ...segment, ...result.draft },
                compatibilityMode,
              ),
            );
          await onReload();
          setSaveMessage(result.draft?.reviewState === "approved" ? "Approved draft saved" : "Draft saved");
          return result.draft;
        }
        const saved = await requestJson(`/videos/${video.id}/segments/${segment.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            expectedUpdatedAt: segment.updatedAt,
            historyReceiptId,
          }),
        });
        const nextSegments = segments
          .map((item) => item.id === segment.id ? saved : item)
          .sort((left, right) => left.startSec - right.startSec || left.id - right.id);
        if (shouldReloadAfterSegmentMutation(segment, values, compatibilityMode)) await onReload();
        else onDetailChange({ ...detail, segments: nextSegments }, video.id);
        if (recordHistory)
          await recordHistoryAction(
            "segment.update",
            historyLabel || "Changed segment",
            segmentHistoryState(segment, compatibilityMode),
            segmentHistoryState(
              { ...segment, ...saved },
              compatibilityMode,
            ),
            historyReceiptId,
          );
        setSaveMessage(recordHistory ? "Saved to Cove" : "History restored");
        return saved;
      } catch (requestError) {
        if (requestError.status === 409) {
          setSaveMessage("Conflict — loading the latest segment…");
          await onConflict();
        } else {
          setSaveMessage(requestError.message || "Unable to save the segment.");
        }
        return null;
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function completeReview() {
      if (!compatibilityMode) return;
      const approvedDraftCount = segments.filter((segment) => !segment.published && segment.reviewState === "approved").length;
      if (approvedDraftCount === 0 || savingSegmentId != null) return;
      const operationKey = `complete-review:${video.id}:${detail.approvedSetVersion}`;
      setSavingSegmentId(-1);
      setSaveMessage(`Publishing ${approvedDraftCount} Approved draft${approvedDraftCount === 1 ? "" : "s"}…`);
      try {
        const result = await requestJson(`/videos/${video.id}/complete-review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: operationIdFor(operationKey),
            expectedApprovedSetVersion: detail.approvedSetVersion,
          }),
        });
        completeOperation(operationKey);
        acceptHistory(EMPTY_EDITOR_HISTORY);
        setHistoryOpen(false);
        const loaded = await onReload();
        const publishedSelection = findPublishedSelectionIdentity(
          segments,
          selectedSegmentIdRef.current,
          result.published,
        );
        const reloadedSelection = publishedSelection
          ? findSegmentByStableIdentity(loaded?.segments, publishedSelection)
          : null;
        if (reloadedSelection) setSelectedSegmentId(reloadedSelection.id);
        setSaveMessage(`${result.published.length} Approved draft${result.published.length === 1 ? "" : "s"} published to Cove.`);
      } catch (error) {
        if (error.status === 409) await onConflict();
        else setSaveMessage(error.message || "Unable to complete the review.");
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function createSegment(requestedTagId = null) {
      if (savingSegmentId != null) return;
      const pendingStartSec = requestedTagId != null ? pendingFirstSegmentStartSecRef.current : null;
      const startSec = Number.isFinite(pendingStartSec) ? pendingStartSec : currentTime;
      const endSec = Math.min(timelineDuration, startSec + 20);
      if (endSec <= startSec) {
        setSaveMessage("Move the playhead before the end of the video to create a segment.");
        return;
      }
      const creation = resolveSegmentCreationAction(segments, selectedSegment, requestedTagId);
      if (creation.kind === "choose-tag") {
        pendingFirstSegmentStartSecRef.current = startSec;
        setSaveMessage("");
        setFirstSegmentTagOpen(true);
        return;
      }
      if (creation.kind === "invalid-selection") {
        setSaveMessage("Select a swimlane before creating a segment.");
        return;
      }
      const { tagId } = creation;
      const operationKey = `create-draft:${video.id}:${tagId}:${startSec}`;
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      setSavingSegmentId(-1);
      try {
        let createdIdentity;
        if (compatibilityMode) {
          const result = await requestJson(`/videos/${video.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: operationIdFor(operationKey), tagId, startSec, endSec }),
          });
          completeOperation(operationKey);
          createdIdentity = { itemId: result.draft?.itemId };
        } else {
          const created = await requestJson(`/videos/${video.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId,
              startSec,
              endSec,
              historyReceiptId,
            }),
          });
          createdIdentity = { nativeSegmentId: created.id };
        }
        pendingFirstSegmentStartSecRef.current = null;
        setFirstSegmentTagOpen(false);
        const loaded = await onReload();
        const createdSegment = findSegmentByStableIdentity(loaded?.segments, createdIdentity);
        if (createdSegment) {
          if (!compatibilityMode)
            await recordHistoryAction(
              "segment.create",
              "Created segment",
              segmentsHistoryState([], false),
              segmentsHistoryState([createdSegment], false),
              historyReceiptId,
            );
          if (creation.openTagEditor)
            pendingTagEditSegmentIdRef.current = createdSegment.id;
          replaceSegmentSelection(createdSegment.id);
          setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
            groupSegmentsIntoSwimlanes(loaded.segments || [], loaded.segmentGroups || [], loaded.performerSlots || []),
            createdSegment.id,
          ));
        } else {
          setSaveMessage("Segment created, but it could not be selected.");
        }
      } catch (error) {
        setSaveMessage(error.message || "Unable to create the draft.");
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function splitSegment() {
      if (selectedSegments.length !== 1 || !selectedSegment || savingSegmentId != null) return;
      const splitSec = currentTime;
      if (splitSec <= selectedSegment.startSec || (selectedSegment.endSec != null && splitSec >= selectedSegment.endSec)) {
        setSaveMessage("Move the playhead inside the selected segment before splitting.");
        return;
      }
      const operationKey = `split-draft:${selectedSegment.itemId}:${selectedSegment.revision}:${splitSec}`;
      const beforeState = !compatibilityMode
        ? segmentsHistoryState([selectedSegment], false)
        : null;
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      setSavingSegmentId(selectedSegment.id);
      try {
        let splitIdentity = null;
        if (compatibilityMode && selectedSegment.nativeSegmentId == null) {
          await requestJson(`/videos/${video.id}/drafts/${selectedSegment.itemId}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              expectedRevision: selectedSegment.revision,
              splitSec,
            }),
          });
          completeOperation(operationKey);
        } else {
          const split = await requestJson(`/videos/${video.id}/segments/${selectedSegment.id}/split`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: selectedSegment.updatedAt,
              splitSec,
              historyReceiptId,
            }),
          });
          splitIdentity = { nativeSegmentId: split.id };
        }
        const loaded = await onReload();
        if (!compatibilityMode) {
          const splitSegments = [
            findSegmentByStableIdentity(loaded?.segments, {
              nativeSegmentId:
                selectedSegment.nativeSegmentId ?? selectedSegment.id,
            }),
            findSegmentByStableIdentity(
              loaded?.segments,
              splitIdentity,
            ),
          ].filter(Boolean);
          await recordHistoryAction(
            "segment.split",
            "Split segment",
            beforeState,
            segmentsHistoryState(splitSegments, false),
            historyReceiptId,
          );
        }
        setSaveMessage(compatibilityMode
          ? `Segment split; both ranges remain ${selectedSegment.reviewState}.`
          : "Segment split.");
      } catch (error) {
        if (error.status === 409) await onConflict();
        else setSaveMessage(error.message || "Unable to split the draft.");
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function duplicateSegment(atPlayhead = false) {
      if (selectedSegments.length !== 1 || !selectedSegment || savingSegmentId != null) return;
      const startSec = atPlayhead ? currentTime : selectedSegment.startSec;
      const operationKey = duplicateOperationKey(video.id, selectedSegment, atPlayhead, startSec);
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      setSavingSegmentId(selectedSegment.id);
      try {
        const pendingDuplicate = pendingDuplicateRef.current?.operationKey === operationKey
          ? pendingDuplicateRef.current
          : null;
        let duplicateIdentity = pendingDuplicate?.duplicateIdentity ?? null;
        if (duplicateIdentity == null
            && compatibilityMode
            && selectedSegment.nativeSegmentId == null) {
          const result = await requestJson(`/videos/${video.id}/drafts/${selectedSegment.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              expectedRevision: selectedSegment.revision,
              startSec: atPlayhead ? startSec : null,
            }),
          });
          duplicateIdentity = duplicateIdentityFromResponse(false, result);
          pendingDuplicateRef.current = { operationKey, duplicateIdentity };
        } else if (duplicateIdentity == null) {
          const duplicate = await requestJson(`/videos/${video.id}/segments/${selectedSegment.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: selectedSegment.updatedAt,
              startSec: atPlayhead ? startSec : null,
              historyReceiptId,
            }),
          });
          duplicateIdentity = duplicateIdentityFromResponse(true, duplicate);
          pendingDuplicateRef.current = { operationKey, duplicateIdentity };
        }
        const loaded = await onReload();
        const duplicatedSegment = findSegmentByStableIdentity(loaded?.segments, duplicateIdentity);
        if (duplicatedSegment) {
          if (!compatibilityMode)
            await recordHistoryAction(
              "segment.duplicate",
              "Duplicated segment",
              segmentsHistoryState([], false),
              segmentsHistoryState([duplicatedSegment], false),
              historyReceiptId,
            );
          const visibility = editorVisibilityIncludingSegment(
            duplicatedSegment,
            loaded.performerSlots || [],
            editorFilters,
            hideDerivedSegments,
            loaded.segmentGroups || [],
          );
          setEditorFilters(visibility.filters);
          setHideDerivedSegments(visibility.hideDerivedSegments);
          setSelectedSegmentIds([duplicatedSegment.id]);
          setSelectedSegmentId(duplicatedSegment.id);
          selectionAnchorIdRef.current = duplicatedSegment.id;
          selectionRangeBaseIdsRef.current = [];
          setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
            groupSegmentsIntoSwimlanes(loaded.segments || [], loaded.segmentGroups || [], loaded.performerSlots || []),
            duplicatedSegment.id,
          ));
          if (compatibilityMode && selectedSegment.nativeSegmentId == null)
            completeOperation(operationKey);
          pendingDuplicateRef.current = null;
          setSaveMessage(atPlayhead
            ? "Duplicate created at the playhead."
            : "Duplicate created in place.");
        } else {
          setSaveMessage("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
        }
      } catch (error) {
        if (pendingDuplicateRef.current?.operationKey === operationKey)
          setSaveMessage("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
        else if (error.status === 409) await onConflict();
        else setSaveMessage(error.message || "Unable to duplicate the draft.");
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function saveTiming() {
      if (selectedSegments.length !== 1 || !selectedSegment) return;
      const startSec = Number(startInput);
      const endSec = endInput.trim() === "" ? null : Number(endInput);
      const validation = validateSegmentTiming(startSec, endSec, mediaDuration);
      if (validation.error) {
        setSaveMessage(validation.error);
        return;
      }
      if (startSec === selectedSegment.startSec && endSec === selectedSegment.endSec) {
        setSaveMessage("Timing is unchanged.");
        return;
      }
      await mutateSegment(selectedSegment, { startSec, endSec, tagId: selectedSegment.tagId });
    }

    async function applyShortcutTiming(startSec, endSec) {
      if (selectedSegments.length !== 1 || !selectedSegment) return;
      const validation = validateSegmentTiming(startSec, endSec, mediaDuration);
      if (validation.error) {
        setSaveMessage(validation.error);
        return;
      }
      if (startSec === selectedSegment.startSec && endSec === selectedSegment.endSec) {
        setSaveMessage("Timing is unchanged.");
        return;
      }
      await mutateSegment(selectedSegment, { startSec, endSec, tagId: selectedSegment.tagId });
    }

  return { acceptHistory, recordHistoryAction, mutateSegment, completeReview, createSegment, splitSegment, duplicateSegment, saveTiming, applyShortcutTiming };
}

export { createPrimarySegmentActions, shouldReloadAfterSegmentMutation };
