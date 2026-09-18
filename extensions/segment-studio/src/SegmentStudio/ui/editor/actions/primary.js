import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { completeOperation, operationIdFor, requestJson } from "../../shared/api.js";
import { segmentHistoryState, segmentsHistoryState } from "../model/history.js";
import { duplicateIdentityFromResponse, duplicateOperationKey, findPublishedSelectionIdentity, findSegmentByStableIdentity, resolveSegmentCreationAction } from "../model/shortcuts.js";
import { groupSegmentsIntoSwimlanes, segmentGroupKeyForSegment } from "../model/swimlanes.js";
import { editorVisibilityIncludingSegment } from "../model/selection.js";
import { validateSegmentTiming } from "../model/timeline.js";
import { insertSegmentProjection, patchPerformerSlotProjection } from "../model/optimistic.js";
import { createPendingChangeId, heldTagChangeFor } from "../model/pending-changes.js";
import { segmentIdentity } from "../model/save-queue.js";

function shouldReloadAfterSegmentMutation(segment, values, compatibilityMode) {
  return values.tagId !== segment.tagId
    || (values.reviewState != null && values.reviewState !== segment.reviewState);
}

function createPrimarySegmentActions(context) {
  const { acquireSaveLock, compatibilityMode, dispatchPendingChanges, enqueueSave, pendingChanges, retargetSaveTasks, currentTime, detail, editorFilters, endInput, hideDerivedSegments, historyRef, mediaDuration, onConflict, onDetailChange, onReload, optimisticSegmentIdRef, pendingDuplicateRef, pendingFirstSegmentStartSecRef, pendingTagEditSegmentIdRef, performerSlots, replaceSegmentSelection, savingSegmentId, segments, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setCreatingSegmentId, setEditorFilters, setFirstSegmentTagOpen, setHideDerivedSegments, setHistory, setHistoryOpen, setPublishApprovedError, setSaveMessage, setSelectedSegmentGroupKey, setSelectedSegmentId, setSelectedSegmentIds, setTagEditing, startInput, tagEditingRef, timelineDuration, video } = context;

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

    async function mutateSegment(segment, values, recordHistory = true, historyLabel = null, optimistic = false, optimisticValues = values, restoreSelectionOnFailure = true) {
      if (!segment || savingSegmentId != null) return null;
      const releaseSaveLock = acquireSaveLock("segment", segment.id);
      if (!releaseSaveLock) return null;
      try {
        return await runSegmentMutation(segment, values, {
          recordHistory,
          historyLabel,
          optimisticValues: optimistic ? optimisticValues : null,
          restoreSelectionOnFailure,
        });
      } finally {
        releaseSaveLock();
      }
    }

    // Saves one segment without taking the save lock, for callers that already hold it (queue tasks).
    // `pendingChangeId` reuses an entry that is already displayed; `optimisticValues` adds one.
    async function runSegmentMutation(segment, values, {
      recordHistory = true,
      historyLabel = null,
      optimisticValues = null,
      pendingChangeId: existingPendingChangeId = null,
      restoreSelectionOnFailure = true,
      onReload: reload = onReload,
      onConflict: conflict = onConflict,
    } = {}) {
      const previousSelectionIds = selectedSegments.map((item) => item.id);
      const previousActiveId = selectedSegmentIdRef.current;
      const historyReceiptId =
        recordHistory && !compatibilityMode ? crypto.randomUUID() : null;
      setSaveMessage(recordHistory ? "Saving directly to Cove…" : "Restoring history…");
      // Show the edit on top of the server projection until the save is confirmed or fails.
      const pendingChangeId = existingPendingChangeId ?? (optimisticValues ? createPendingChangeId() : null);
      if (optimisticValues && !existingPendingChangeId) dispatchPendingChanges({
        type: "add",
        entry: { id: pendingChangeId, op: "patch", targets: [segmentIdentity(segment)], values: optimisticValues },
      });
      const confirmPendingChange = (applied) => {
        if (pendingChangeId) dispatchPendingChanges({ type: "confirm", key: pendingChangeId, applied });
      };
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
          // A tag change remaps and auto-assigns the draft's slots; show the server's result before the reload.
          if (result.performerSlots != null)
            onDetailChange((current) => patchPerformerSlotProjection(current, segment.id, result.performerSlots, result.performerSlotRevision), video.id);
          const updatedDraft = {
            ...segment,
            ...result.draft,
            id: segment.id,
            itemId: segment.itemId,
          };
          if (recordHistory)
            await recordHistoryAction(
              "segment.update",
              historyLabel || "Changed segment",
              segmentHistoryState(segment, compatibilityMode),
              segmentHistoryState(
                updatedDraft,
                compatibilityMode,
              ),
            );
          if (shouldReloadAfterSegmentMutation(segment, values, compatibilityMode)) {
            confirmPendingChange((await reload()) != null);
          } else {
            // Apply to the latest projection so changes that landed during the save are kept.
            onDetailChange((current) => ({
              ...current,
              approvedSetVersion: result.approvedSetVersion || current.approvedSetVersion,
              segments: (current.segments || [])
                .map((item) => item.id === segment.id ? updatedDraft : item)
                .sort((left, right) => left.startSec - right.startSec || left.id - right.id),
            }), video.id);
            confirmPendingChange(true);
          }
          setSaveMessage(result.draft?.reviewState === "approved" ? "Approved draft saved" : "Draft saved");
          return updatedDraft;
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
        const updatedSegment = {
          ...segment,
          ...saved,
          reviewState: values.reviewState ?? segment.reviewState,
        };
        if (shouldReloadAfterSegmentMutation(segment, values, compatibilityMode)) {
          confirmPendingChange((await reload()) != null);
        } else {
          onDetailChange((current) => ({
            ...current,
            segments: (current.segments || [])
              .map((item) => item.id === segment.id ? updatedSegment : item)
              .sort((left, right) => left.startSec - right.startSec || left.id - right.id),
          }), video.id);
          confirmPendingChange(true);
        }
        if (recordHistory)
          await recordHistoryAction(
            "segment.update",
            historyLabel || "Changed segment",
            segmentHistoryState(segment, compatibilityMode),
            segmentHistoryState(
              updatedSegment,
              compatibilityMode,
            ),
            historyReceiptId,
          );
        setSaveMessage(recordHistory ? "Saved to Cove" : "History restored");
        return updatedSegment;
      } catch (requestError) {
        if (pendingChangeId) dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        if (pendingChangeId && restoreSelectionOnFailure) {
          setSelectedSegmentIds(previousSelectionIds);
          setSelectedSegmentId(previousActiveId);
          selectionAnchorIdRef.current = previousActiveId;
          selectionRangeBaseIdsRef.current = [];
        }
        if (requestError.status === 409) {
          setSaveMessage("Conflict — loading the latest segment…");
          await conflict();
        } else {
          setSaveMessage(requestError.message || "Unable to save the segment.");
        }
        return null;
      }
    }

    async function completeReview() {
      if (!compatibilityMode) return false;
      const approvedDraftCount = segments.filter((segment) => !segment.published && segment.reviewState === "approved").length;
      if (approvedDraftCount === 0 || savingSegmentId != null) return false;
      const operationKey = `complete-review:${video.id}:${detail.approvedSetVersion}`;
      const releaseSaveLock = acquireSaveLock("publish", -1);
      if (!releaseSaveLock) return false;
      setPublishApprovedError("");
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
        return true;
      } catch (error) {
        const message = error.status === 409
          ? "The approved drafts changed. Review the updated list and try again."
          : error.message || "Unable to publish the approved drafts.";
        if (error.status === 409) await onConflict();
        setPublishApprovedError(message);
        setSaveMessage(message);
        return false;
      } finally {
        releaseSaveLock();
      }
    }

    async function createSegment(requestedTagId = null, requestedTagName = null) {
      if (savingSegmentId != null || blockedByHeldTag()) return;
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
      const previousSelectionId = selectedSegmentIdRef.current;
      const optimisticSegment = {
        ...(selectedSegment || {}),
        id: optimisticSegmentIdRef.current--,
        itemId: null,
        nativeSegmentId: null,
        published: false,
        tagId,
        tagName: requestedTagName || selectedSegment?.tagName || "Tag segment",
        tagSortName: tagId === selectedSegment?.tagId ? selectedSegment?.tagSortName || null : null,
        startSec,
        endSec,
        // Full mode creates manual drafts already approved; match it so a queued review toggles as displayed.
        reviewState: compatibilityMode ? "approved" : "unreviewed",
        revision: 0,
        updatedAt: null,
        sourceKey: "user",
        sourceRunId: null,
        confidence: null,
        isDerived: false,
      };
      const optimisticDetail = insertSegmentProjection(detail, optimisticSegment);
      const optimisticGroupKey = segmentGroupKeyForSegment(
        groupSegmentsIntoSwimlanes(optimisticDetail.segments, optimisticDetail.segmentGroups || [], optimisticDetail.performerSlots || []),
        optimisticSegment.id,
      );
      // The create is a save-queue task so work requested for the new segment (a held tag, a review) waits for it.
      const task = enqueueSave({
        kind: "create",
        lockId: -1,
        run: (saveContext) => runCreate(saveContext),
      });
      if (!task) return;
      await task.done;

      async function runCreate({ onReload: reload, taskId }) {
        const insertId = createPendingChangeId();
        dispatchPendingChanges({ type: "add", entry: { id: insertId, taskId, op: "insert", segment: optimisticSegment } });
        setFirstSegmentTagOpen(false);
        if (creation.openTagEditor) {
          // Open the tag editor on the optimistic segment so typing can start before the save round-trip.
          setCreatingSegmentId(optimisticSegment.id);
          pendingTagEditSegmentIdRef.current = optimisticSegment.id;
          setTagEditing(true);
        }
        replaceSegmentSelection(optimisticSegment.id);
        setSelectedSegmentGroupKey(optimisticGroupKey);
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
            // The server assigned performer slots while creating the draft: show them on the temporary
            // segment now instead of after the reload.
            if (result.performerSlots != null)
              onDetailChange((current) => patchPerformerSlotProjection(current, optimisticSegment.id, result.performerSlots, result.performerSlotRevision), video.id);
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
          const loaded = await reload();
          // The reloaded projection carries the saved segment, so the temporary one goes in the same batch.
          dispatchPendingChanges({ type: "discard", key: insertId });
          if (!loaded) {
            // The temporary segment is gone, so drop the slots shown on it.
            onDetailChange((current) => patchPerformerSlotProjection(current, optimisticSegment.id, []), video.id);
            replaceSegmentSelection(previousSelectionId);
            setSaveMessage(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${creation.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
            return;
          }
          const createdSegment = findSegmentByStableIdentity(loaded?.segments, createdIdentity);
          if (createdSegment) {
            // Work aimed at the temporary segment follows it to its saved identity.
            dispatchPendingChanges({ type: "retarget", temporaryId: optimisticSegment.id, identity: segmentIdentity(createdSegment) });
            retargetSaveTasks(optimisticSegment.id, segmentIdentity(createdSegment));
            if (creation.openTagEditor) {
              if (tagEditingRef.current)
                pendingTagEditSegmentIdRef.current = createdSegment.id;
              setCreatingSegmentId(createdSegment.id);
            }
            // Swap selection in the same batch as the reload so the editor never shows a fallback segment.
            replaceSegmentSelection(createdSegment.id);
            setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
              groupSegmentsIntoSwimlanes(loaded.segments || [], loaded.segmentGroups || [], loaded.performerSlots || []),
              createdSegment.id,
            ));
            if (!compatibilityMode)
              await recordHistoryAction(
                "segment.create",
                "Created segment",
                segmentsHistoryState([], false),
                segmentsHistoryState([createdSegment], false),
                historyReceiptId,
              );
          } else {
            setTagEditing(false);
            setSaveMessage(`Segment created, but it could not be selected${creation.openTagEditor ? "; choose its tag again if you picked one" : ""}.`);
          }
        } catch (error) {
          dispatchPendingChanges({ type: "discard", key: insertId });
          replaceSegmentSelection(previousSelectionId);
          if (requestedTagId != null) setFirstSegmentTagOpen(true);
          setSaveMessage(error.message || "Unable to create the draft.");
          throw error;
        } finally {
          setCreatingSegmentId(null);
        }
      }
    }

    function blockedByHeldTag() {
      if (!heldTagChangeFor(pendingChanges, selectedSegment)) return false;
      setSaveMessage("Close the tag field to save the new segment's tag first.");
      return true;
    }

    async function splitSegment() {
      if (selectedSegments.length !== 1 || !selectedSegment || savingSegmentId != null || blockedByHeldTag()) return;
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
      const releaseSaveLock = acquireSaveLock("split", selectedSegment.id);
      if (!releaseSaveLock) return;
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
        releaseSaveLock();
      }
    }

    async function duplicateSegment(atPlayhead = false) {
      if (selectedSegments.length !== 1 || !selectedSegment || savingSegmentId != null || blockedByHeldTag()) return;
      const startSec = atPlayhead ? currentTime : selectedSegment.startSec;
      const operationKey = duplicateOperationKey(video.id, selectedSegment, atPlayhead, startSec);
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      const source = selectedSegment;
      const previousSelectionId = selectedSegmentIdRef.current;
      const duration = source.endSec == null ? null : source.endSec - source.startSec;
      // The copy is shown at once with the source's tag, provenance and slots, so it stays visible under the
      // same filters as the source; the server confirms it on reload.
      const optimisticSegment = {
        ...source,
        id: optimisticSegmentIdRef.current--,
        itemId: null,
        nativeSegmentId: null,
        startSec,
        endSec: duration == null ? null : startSec + duration,
        // Full mode creates the copy already approved; match it so a queued review toggles as displayed.
        reviewState: compatibilityMode ? "approved" : source.reviewState,
        revision: 0,
        updatedAt: null,
      };
      const sourceSlots = (performerSlots || []).filter((slot) => slot.segmentId === source.id);
      // A duplicate is a save-queue task like a create, so a tag typed on the copy waits for its saved identity.
      const task = enqueueSave({
        kind: "duplicate",
        lockId: -1,
        targets: [segmentIdentity(source)],
        run: (saveContext) => runDuplicate(saveContext),
      });
      if (!task) return;
      await task.done;

      async function runDuplicate({ onReload: reload, onConflict: conflict, taskId }) {
        const insertId = createPendingChangeId();
        dispatchPendingChanges({ type: "add", entry: { id: insertId, taskId, op: "insert", segment: optimisticSegment } });
        if (sourceSlots.length > 0)
          onDetailChange((current) => patchPerformerSlotProjection(current, optimisticSegment.id, sourceSlots), video.id);
        // An in-place copy usually wants a different tag, so open the tag field on it like a new segment.
        if (!atPlayhead) {
          setCreatingSegmentId(optimisticSegment.id);
          pendingTagEditSegmentIdRef.current = optimisticSegment.id;
          setTagEditing(true);
        }
        replaceSegmentSelection(optimisticSegment.id);
        const dropTemporary = () => {
          dispatchPendingChanges({ type: "discard", key: insertId });
          if (sourceSlots.length > 0)
            onDetailChange((current) => patchPerformerSlotProjection(current, optimisticSegment.id, []), video.id);
        };
        try {
          const pendingDuplicate = pendingDuplicateRef.current?.operationKey === operationKey
            ? pendingDuplicateRef.current
            : null;
          let duplicateIdentity = pendingDuplicate?.duplicateIdentity ?? null;
          if (duplicateIdentity == null
              && compatibilityMode
              && source.nativeSegmentId == null) {
            const result = await requestJson(`/videos/${video.id}/drafts/${source.itemId}/duplicate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                expectedRevision: source.revision,
                startSec: atPlayhead ? startSec : null,
              }),
            });
            duplicateIdentity = duplicateIdentityFromResponse(false, result);
            pendingDuplicateRef.current = { operationKey, duplicateIdentity };
          } else if (duplicateIdentity == null) {
            const duplicate = await requestJson(`/videos/${video.id}/segments/${source.id}/duplicate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                expectedUpdatedAt: source.updatedAt,
                startSec: atPlayhead ? startSec : null,
                historyReceiptId,
              }),
            });
            duplicateIdentity = duplicateIdentityFromResponse(true, duplicate);
            pendingDuplicateRef.current = { operationKey, duplicateIdentity };
          }
          const loaded = await reload();
          // The reloaded projection carries the saved copy, so the temporary one goes in the same batch.
          dropTemporary();
          const duplicatedSegment = findSegmentByStableIdentity(loaded?.segments, duplicateIdentity);
          if (!duplicatedSegment) {
            setTagEditing(false);
            replaceSegmentSelection(previousSelectionId);
            setSaveMessage(loaded
              ? "Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection."
              : "Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
            return;
          }
          // Work aimed at the temporary copy follows it to its saved identity.
          dispatchPendingChanges({ type: "retarget", temporaryId: optimisticSegment.id, identity: segmentIdentity(duplicatedSegment) });
          retargetSaveTasks(optimisticSegment.id, segmentIdentity(duplicatedSegment));
          const visibility = editorVisibilityIncludingSegment(
            duplicatedSegment,
            loaded.performerSlots || [],
            editorFilters,
            hideDerivedSegments,
            loaded.segmentGroups || [],
          );
          setEditorFilters(visibility.filters);
          setHideDerivedSegments(visibility.hideDerivedSegments);
          if (!atPlayhead && tagEditingRef.current)
            pendingTagEditSegmentIdRef.current = duplicatedSegment.id;
          // Swap selection in the same batch as the reload so the editor never shows a fallback segment.
          replaceSegmentSelection(duplicatedSegment.id);
          setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
            groupSegmentsIntoSwimlanes(loaded.segments || [], loaded.segmentGroups || [], loaded.performerSlots || []),
            duplicatedSegment.id,
          ));
          if (compatibilityMode && source.nativeSegmentId == null)
            completeOperation(operationKey);
          pendingDuplicateRef.current = null;
          setSaveMessage(atPlayhead
            ? "Duplicate created at the playhead."
            : "Duplicate created in place.");
          // History goes last so its own warning is not overwritten and the selection is already settled.
          if (!compatibilityMode)
            await recordHistoryAction(
              "segment.duplicate",
              "Duplicated segment",
              segmentsHistoryState([], false),
              segmentsHistoryState([duplicatedSegment], false),
              historyReceiptId,
            );
        } catch (error) {
          dropTemporary();
          setTagEditing(false);
          replaceSegmentSelection(previousSelectionId);
          if (pendingDuplicateRef.current?.operationKey === operationKey)
            setSaveMessage("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.");
          else if (error.status === 409) await conflict();
          else setSaveMessage(error.message || "Unable to duplicate the draft.");
          // The task fails, so a tag held for the copy is dropped instead of reporting its own failure.
          throw error;
        } finally {
          setCreatingSegmentId(null);
        }
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
      await mutateSegment(selectedSegment, { startSec, endSec, tagId: selectedSegment.tagId }, true, null, true);
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
      await mutateSegment(selectedSegment, { startSec, endSec, tagId: selectedSegment.tagId }, true, null, true);
    }

  return { acceptHistory, recordHistoryAction, mutateSegment, runSegmentMutation, completeReview, createSegment, splitSegment, duplicateSegment, saveTiming, applyShortcutTiming };
}

export { createPrimarySegmentActions, shouldReloadAfterSegmentMutation };
