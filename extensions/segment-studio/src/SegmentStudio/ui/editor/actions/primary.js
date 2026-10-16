import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { completeOperation, operationIdFor, requestJson } from "../../shared/api.js";
import { segmentHistoryState, segmentsHistoryState } from "../model/history.js";
import { duplicateIdentityFromResponse, duplicateOperationKey, findPublishedSelectionIdentity, findSegmentByStableIdentity, resolveSegmentCreationAction } from "../model/shortcuts.js";
import { groupSegmentsIntoSwimlanes, segmentGroupKeyForSegment } from "../model/swimlanes.js";
import { editorVisibilityIncludingSegment } from "../model/selection.js";
import { validateSegmentTiming } from "../model/timeline.js";
import { dropTemporarySegmentProjection, insertSegmentProjection, patchPerformerSlotProjection } from "../model/optimistic.js";
import { applyPendingChanges, createPendingChangeId, heldTagChangeFor } from "../model/pending-changes.js";
import { isEditorHeldByOtherWork, isSegmentCreationPending, isTemporarySegment, segmentIdentity } from "../model/save-queue.js";
// The editor-delta reducer is shared with the feedback flow; it is not feedback-specific.
import { applyFeedbackEditorDelta } from "../model/feedback.js";

function shouldReloadAfterSegmentMutation(segment, values, compatibilityMode) {
  return values.tagId !== segment.tagId
    || (values.reviewState != null && values.reviewState !== segment.reviewState);
}

function createPrimarySegmentActions(context) {
  const { acquireSaveLock, compatibilityMode, getRequestedSelectionId, dispatchPendingChanges, displayedSelectedSegment, enqueueSave, getSaveQueueSnapshot, pendingChanges, retargetSaveTasks, currentTime, detail, editorFilters, endInput, hideDerivedSegments, historyRef, mediaDuration, onConflict, onDetailChange, onReload, optimisticSegmentIdRef, pendingDuplicateRef, pendingFirstSegmentStartSecRef, pendingTagEditSegmentIdRef, performerSlots, replaceSegmentSelection, savingSegmentId, segments, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setCreatingSegmentId, setEditorFilters, setFirstSegmentTagOpen, setHideDerivedSegments, setHistory, setHistoryOpen, setPublishApprovedError, setSaveMessage, setSelectedSegmentGroupKey, setSelectedSegmentId, setSelectedSegmentIds, setTagEditing, startInput, tagEditingRef, timelineDuration, video } = context;

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

    // Saves one segment as a queued task: the change shows at once and waits behind earlier saves
    // instead of being refused while another segment saves. Work that holds the whole editor still refuses it.
    async function mutateSegment(segment, values, recordHistory = true, historyLabel = null, optimistic = false, optimisticValues = values, restoreSelectionOnFailure = true) {
      if (!segment || isTemporarySegment(segment) || isEditorHeldByOtherWork(getSaveQueueSnapshot())) return null;
      // Only the fields this edit changes are sent over the segment as it is when the task runs, so
      // it does not undo an earlier edit of another field that is still waiting in the queue.
      const [shown = segment] = applyPendingChanges([segment], (pendingChanges || []).filter((entry) => entry.op !== "insert"));
      const changedValues = Object.fromEntries(Object.entries(values).filter(([key, value]) => value !== shown[key]));
      const pendingChangeId = optimistic ? createPendingChangeId() : null;
      const requestedSelectionId = getRequestedSelectionId?.();
      // Shown values default to the changed fields alone, so they do not mask another queued edit either.
      if (pendingChangeId) dispatchPendingChanges({
        type: "add",
        entry: {
          id: pendingChangeId,
          op: "patch",
          targets: [segmentIdentity(segment)],
          values: optimisticValues === values ? changedValues : optimisticValues,
        },
      });
      const task = enqueueSave({
        kind: "segment",
        lockId: segment.id,
        targets: [segmentIdentity(segment)],
        whenBusy: "enqueue",
        // Save against the segment as it is when the task runs, so a save queued behind another
        // save of the same segment sends that save's revision.
        run: (saveContext) => {
          const [current] = saveContext.resolveTargets();
          if (!current) {
            if (pendingChangeId) dispatchPendingChanges({ type: "discard", key: pendingChangeId });
            setSaveMessage("The segment changed before its save could run.");
            return null;
          }
          const currentValues = Object.fromEntries(Object.keys(values).map((key) => [key, current[key]]));
          return runSegmentMutation(current, { ...currentValues, ...changedValues }, {
            recordHistory,
            historyLabel,
            pendingChangeId,
            restoreSelectionOnFailure,
            requestedSelectionId,
          });
        },
      });
      if (!task) {
        if (pendingChangeId) dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        return null;
      }
      const outcome = await task.done;
      if (outcome.status !== "fulfilled") {
        if (pendingChangeId) dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        return null;
      }
      return outcome.value ?? null;
    }

    // Saves one segment without taking the save lock, for callers that already hold it (queue tasks).
    // `pendingChangeId` reuses an entry that is already displayed; `optimisticValues` adds one.
    async function runSegmentMutation(segment, values, {
      recordHistory = true,
      historyLabel = null,
      optimisticValues = null,
      pendingChangeId: existingPendingChangeId = null,
      restoreSelectionOnFailure = true,
      // The selection when the edit was requested, which a queued save captures before it waits.
      requestedSelectionId = getRequestedSelectionId?.(),
      onReload: reload = onReload,
      onConflict: conflict = onConflict,
    } = {}) {
      // The selection when the edit was requested; a queued save may run after the user moved on.
      const previousSelectionIds = selectedSegments.map((item) => item.id);
      const previousActiveId = selectedSegment?.id ?? selectedSegmentIdRef.current;
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
      // A change that reaches beyond the segment's own fields is applied from the server's description
      // of it, and only refetches the whole projection when the server could not describe it.
      const showProjectionChange = async (editorDelta) => {
        if (editorDelta) {
          onDetailChange((current) => applyFeedbackEditorDelta(current, editorDelta), video.id);
          confirmPendingChange(true);
          return;
        }
        confirmPendingChange((await reload()) != null);
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
            await showProjectionChange(result.editorDelta);
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
        const { editorDelta, ...saved } = await requestJson(`/videos/${video.id}/segments/${segment.id}`, {
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
          await showProjectionChange(editorDelta);
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
        // Restore the selection only if the user has not moved on while the save waited or ran.
        if (pendingChangeId && restoreSelectionOnFailure
            && (getRequestedSelectionId == null || getRequestedSelectionId() === requestedSelectionId)) {
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

    // A structural save shows its result from the server's description of the change, and only
    // refetches the whole projection when there is none. Returns the projection the result is in.
    async function showStructuralResult(editorDelta, committedDetail, reload) {
      if (!editorDelta) return reload();
      onDetailChange((current) => applyFeedbackEditorDelta(current, editorDelta), video.id);
      return applyFeedbackEditorDelta(committedDetail, editorDelta);
    }

    async function createSegment(requestedTagId = null, requestedTagName = null) {
      const queueSnapshot = getSaveQueueSnapshot();
      if (isEditorHeldByOtherWork(queueSnapshot) || isSegmentCreationPending(queueSnapshot) || blockedByHeldTag()) return;
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
      const insertId = createPendingChangeId();
      // The create is a save-queue task so work requested for the new segment (a held tag, a review) waits for it.
      const task = enqueueSave({
        kind: "create",
        lockId: -1,
        whenBusy: "enqueue",
        run: (saveContext) => runCreate(saveContext),
      });
      if (!task) return;
      // The new segment shows at once, even while earlier saves are still running.
      dispatchPendingChanges({ type: "add", entry: { id: insertId, taskId: task.id, op: "insert", segment: optimisticSegment } });
      setFirstSegmentTagOpen(false);
      if (creation.openTagEditor) {
        // Open the tag editor on the optimistic segment so typing can start before the save round-trip.
        setCreatingSegmentId(optimisticSegment.id);
        pendingTagEditSegmentIdRef.current = optimisticSegment.id;
        setTagEditing(true);
      }
      replaceSegmentSelection(optimisticSegment.id);
      setSelectedSegmentGroupKey(optimisticGroupKey);
      const outcome = await task.done;
      if (outcome.status === "cancelled") {
        dispatchPendingChanges({ type: "discard", key: insertId });
        setCreatingSegmentId(null);
        if (selectedSegmentIdRef.current === optimisticSegment.id) replaceSegmentSelection(previousSelectionId);
      }

      async function runCreate({ detail: committedDetail, onReload: reload }) {
        try {
          let createdIdentity;
          let editorDelta = null;
          if (compatibilityMode) {
            const result = await requestJson(`/videos/${video.id}/drafts`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ operationId: operationIdFor(operationKey), tagId, startSec, endSec }),
            });
            completeOperation(operationKey);
            createdIdentity = { itemId: result.draft?.itemId };
            editorDelta = result.editorDelta ?? null;
            // The server assigned performer slots while creating the draft: show them on the temporary
            // segment now instead of after the reload.
            if (result.performerSlots != null && !editorDelta)
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
          const loaded = await showStructuralResult(editorDelta, committedDetail, reload);
          // The saved projection carries the new segment, so the temporary one goes in the same batch.
          dispatchPendingChanges({ type: "discard", key: insertId });
          if (!loaded) {
            // The temporary segment is gone, so drop the slots shown on it.
            onDetailChange((current) => dropTemporarySegmentProjection(current, optimisticSegment.id), video.id);
            if (selectedSegmentIdRef.current === optimisticSegment.id) replaceSegmentSelection(previousSelectionId);
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
            // Swap selection in the same batch as the saved segment, unless the user has moved on,
            // so the editor never shows a fallback segment.
            if (selectedSegmentIdRef.current === optimisticSegment.id) {
              replaceSegmentSelection(createdSegment.id);
              setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
                groupSegmentsIntoSwimlanes(loaded.segments || [], loaded.segmentGroups || [], loaded.performerSlots || []),
                createdSegment.id,
              ));
            }
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
          onDetailChange((current) => dropTemporarySegmentProjection(current, optimisticSegment.id), video.id);
          // Leave the selection alone if the user moved on while the create waited or ran.
          if (selectedSegmentIdRef.current === optimisticSegment.id) replaceSegmentSelection(previousSelectionId);
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

    // A split shows both halves at once and saves as a queued task, so it waits behind other saves
    // instead of being refused while another segment saves.
    async function splitSegment() {
      if (selectedSegments.length !== 1 || !selectedSegment || isTemporarySegment(selectedSegment)
          || isEditorHeldByOtherWork(getSaveQueueSnapshot()) || blockedByHeldTag()) return;
      // Validate against what the editor shows, which includes saves still waiting in the queue.
      const shown = displayedSelectedSegment?.id === selectedSegment.id ? displayedSelectedSegment : selectedSegment;
      const splitSec = currentTime;
      if (splitSec <= shown.startSec || (shown.endSec != null && splitSec >= shown.endSec)) {
        setSaveMessage("Move the playhead inside the selected segment before splitting.");
        return;
      }
      const sourceIdentity = segmentIdentity(selectedSegment);
      const secondHalf = {
        ...shown,
        id: optimisticSegmentIdRef.current--,
        itemId: null,
        nativeSegmentId: null,
        startSec: splitSec,
        endSec: shown.endSec,
        revision: 0,
        updatedAt: null,
      };
      const trimId = createPendingChangeId();
      const insertId = createPendingChangeId();
      dispatchPendingChanges({ type: "add", entry: { id: trimId, op: "patch", targets: [sourceIdentity], values: { endSec: splitSec } } });
      dispatchPendingChanges({ type: "add", entry: { id: insertId, op: "insert", segment: secondHalf } });
      const discardShownSplit = () => {
        dispatchPendingChanges({ type: "discard", key: trimId });
        dispatchPendingChanges({ type: "discard", key: insertId });
      };
      const task = enqueueSave({
        kind: "split",
        lockId: selectedSegment.id,
        targets: [sourceIdentity],
        whenBusy: "enqueue",
        run: (saveContext) => runSplit(saveContext),
      });
      if (!task) {
        discardShownSplit();
        return;
      }
      const outcome = await task.done;
      if (outcome.status !== "fulfilled") discardShownSplit();

      async function runSplit({ detail: committedDetail, resolveTargets, onReload: reload, onConflict: conflict }) {
        // Split the segment as it is now, so a split queued behind another save sends its revision.
        const [source] = resolveTargets();
        if (!source || splitSec <= source.startSec || (source.endSec != null && splitSec >= source.endSec)) {
          discardShownSplit();
          setSaveMessage(source
            ? "The segment changed before the split could run; move the playhead inside it and split again."
            : "The segment changed before the split could run.");
          return;
        }
        const operationKey = `split-draft:${source.itemId}:${source.revision}:${splitSec}`;
        const beforeState = !compatibilityMode
          ? segmentsHistoryState([source], false)
          : null;
        const historyReceiptId = !compatibilityMode
          ? crypto.randomUUID()
          : null;
        try {
          let splitIdentity;
          let editorDelta;
          if (compatibilityMode && source.nativeSegmentId == null) {
            const result = await requestJson(`/videos/${video.id}/drafts/${source.itemId}/split`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                expectedRevision: source.revision,
                splitSec,
              }),
            });
            completeOperation(operationKey);
            splitIdentity = { itemId: result.createdDraft?.itemId };
            editorDelta = result.editorDelta ?? null;
          } else {
            const split = await requestJson(`/videos/${video.id}/segments/${source.id}/split`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                expectedUpdatedAt: source.updatedAt,
                splitSec,
                historyReceiptId,
              }),
            });
            splitIdentity = { nativeSegmentId: split.id };
            editorDelta = split.editorDelta ?? null;
          }
          const loaded = await showStructuralResult(editorDelta, committedDetail, reload);
          const savedHalf = findSegmentByStableIdentity(loaded?.segments, splitIdentity);
          if (savedHalf) {
            // Work aimed at the shown second half follows it to its saved identity.
            dispatchPendingChanges({ type: "retarget", temporaryId: secondHalf.id, identity: segmentIdentity(savedHalf) });
            retargetSaveTasks(secondHalf.id, segmentIdentity(savedHalf));
            if (selectedSegmentIdRef.current === secondHalf.id) replaceSegmentSelection(savedHalf.id);
          } else if (selectedSegmentIdRef.current === secondHalf.id) {
            replaceSegmentSelection(source.id);
          }
          // The saved projection carries both halves, so the shown split goes in the same batch.
          dispatchPendingChanges({ type: "confirm", key: trimId, applied: loaded != null });
          dispatchPendingChanges({ type: "discard", key: insertId });
          if (!compatibilityMode) {
            const splitSegments = [
              findSegmentByStableIdentity(loaded?.segments, {
                nativeSegmentId:
                  source.nativeSegmentId ?? source.id,
              }),
              savedHalf,
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
            ? `Segment split; both ranges remain ${source.reviewState}.`
            : "Segment split.");
        } catch (error) {
          discardShownSplit();
          if (selectedSegmentIdRef.current === secondHalf.id) replaceSegmentSelection(source.id);
          if (error.status === 409) await conflict();
          else setSaveMessage(error.message || "Unable to split the draft.");
        }
      }
    }

    async function duplicateSegment(atPlayhead = false) {
      const queueSnapshot = getSaveQueueSnapshot();
      if (selectedSegments.length !== 1 || !selectedSegment || isTemporarySegment(selectedSegment)
          || isEditorHeldByOtherWork(queueSnapshot) || isSegmentCreationPending(queueSnapshot) || blockedByHeldTag()) return;
      const startSec = atPlayhead
        ? currentTime
        : (displayedSelectedSegment?.id === selectedSegment.id ? displayedSelectedSegment : selectedSegment).startSec;
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      const source = selectedSegment;
      const previousSelectionId = selectedSegmentIdRef.current;
      // The copy shows the range the editor shows, which includes a timing save still waiting in the queue.
      const shown = displayedSelectedSegment?.id === source.id ? displayedSelectedSegment : source;
      const duration = shown.endSec == null ? null : shown.endSec - shown.startSec;
      // The copy is shown at once with the source's tag, provenance and slots, so it stays visible under the
      // same filters as the source; the server confirms it on reload.
      const optimisticSegment = {
        ...source,
        id: optimisticSegmentIdRef.current--,
        itemId: null,
        nativeSegmentId: null,
        startSec,
        endSec: duration == null ? null : startSec + duration,
        // Full mode creates the copy as an approved draft, even from a published segment; match it so a
        // queued review toggles as displayed and the copy waits for Publish approved like other drafts.
        reviewState: compatibilityMode ? "approved" : source.reviewState,
        published: compatibilityMode ? false : source.published,
        revision: 0,
        updatedAt: null,
      };
      const sourceSlots = (performerSlots || []).filter((slot) => slot.segmentId === source.id);
      const insertId = createPendingChangeId();
      const dropTemporary = () => {
        dispatchPendingChanges({ type: "discard", key: insertId });
        if (sourceSlots.length > 0)
          onDetailChange((current) => dropTemporarySegmentProjection(current, optimisticSegment.id), video.id);
      };
      // A duplicate is a save-queue task like a create, so a tag typed on the copy waits for its saved identity.
      const task = enqueueSave({
        kind: "duplicate",
        lockId: -1,
        targets: [segmentIdentity(source)],
        whenBusy: "enqueue",
        run: (saveContext) => runDuplicate(saveContext),
      });
      if (!task) return;
      // The copy shows at once, even while earlier saves are still running.
      dispatchPendingChanges({ type: "add", entry: { id: insertId, taskId: task.id, op: "insert", segment: optimisticSegment } });
      if (sourceSlots.length > 0)
        onDetailChange((current) => patchPerformerSlotProjection(current, optimisticSegment.id, sourceSlots), video.id);
      // An in-place copy usually wants a different tag, so open the tag field on it like a new segment.
      if (!atPlayhead) {
        setCreatingSegmentId(optimisticSegment.id);
        pendingTagEditSegmentIdRef.current = optimisticSegment.id;
        setTagEditing(true);
      }
      replaceSegmentSelection(optimisticSegment.id);
      const outcome = await task.done;
      if (outcome.status === "cancelled") {
        dropTemporary();
        setCreatingSegmentId(null);
        if (selectedSegmentIdRef.current === optimisticSegment.id) replaceSegmentSelection(previousSelectionId);
      }

      async function runDuplicate({ detail: committedDetail, resolveTargets, onReload: reload, onConflict: conflict }) {
        // Copy the segment as it is now, so a duplicate queued behind a save of it sends that save's revision.
        const [current] = resolveTargets();
        const operationKey = current ? duplicateOperationKey(video.id, current, atPlayhead, startSec) : null;
        try {
          // Failing the task drops a tag held for the copy, like any other failed duplicate.
          if (!current) throw new Error("The segment changed before the duplicate could run.");
          const pendingDuplicate = pendingDuplicateRef.current?.operationKey === operationKey
            ? pendingDuplicateRef.current
            : null;
          let duplicateIdentity = pendingDuplicate?.duplicateIdentity ?? null;
          let editorDelta = null;
          if (duplicateIdentity == null && compatibilityMode) {
            const draftDuplicatePath = current.nativeSegmentId == null
              ? `/videos/${video.id}/drafts/${current.itemId}/duplicate`
              : `/videos/${video.id}/segments/${current.nativeSegmentId}/duplicate-draft`;
            const result = await requestJson(draftDuplicatePath, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                ...(current.nativeSegmentId == null
                  ? { expectedRevision: current.revision }
                  : { expectedUpdatedAt: current.updatedAt }),
                startSec: atPlayhead ? startSec : null,
              }),
            });
            duplicateIdentity = duplicateIdentityFromResponse(false, result);
            editorDelta = result.editorDelta ?? null;
            pendingDuplicateRef.current = { operationKey, duplicateIdentity };
          } else if (duplicateIdentity == null) {
            const duplicate = await requestJson(`/videos/${video.id}/segments/${current.id}/duplicate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                expectedUpdatedAt: current.updatedAt,
                startSec: atPlayhead ? startSec : null,
                historyReceiptId,
              }),
            });
            duplicateIdentity = duplicateIdentityFromResponse(true, duplicate);
            pendingDuplicateRef.current = { operationKey, duplicateIdentity };
          }
          const loaded = await showStructuralResult(editorDelta, committedDetail, reload);
          // The saved projection carries the copy, so the temporary one goes in the same batch.
          dropTemporary();
          const duplicatedSegment = findSegmentByStableIdentity(loaded?.segments, duplicateIdentity);
          if (!duplicatedSegment) {
            if (selectedSegmentIdRef.current === optimisticSegment.id) {
              setTagEditing(false);
              replaceSegmentSelection(previousSelectionId);
            }
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
          // Swap selection in the same batch as the saved copy, unless the user has moved on,
          // so the editor never shows a fallback segment.
          if (selectedSegmentIdRef.current === optimisticSegment.id) {
            replaceSegmentSelection(duplicatedSegment.id);
            setSelectedSegmentGroupKey(segmentGroupKeyForSegment(
              groupSegmentsIntoSwimlanes(loaded.segments || [], loaded.segmentGroups || [], loaded.performerSlots || []),
              duplicatedSegment.id,
            ));
          }
          if (compatibilityMode)
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
          if (selectedSegmentIdRef.current === optimisticSegment.id) {
            setTagEditing(false);
            replaceSegmentSelection(previousSelectionId);
          }
          if (operationKey != null && pendingDuplicateRef.current?.operationKey === operationKey)
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
      const shown = displayedSelectedSegment?.id === selectedSegment.id ? displayedSelectedSegment : selectedSegment;
      if (startSec === shown.startSec && endSec === shown.endSec) {
        setSaveMessage("Timing is unchanged.");
        return;
      }
      await mutateSegment(selectedSegment, { startSec, endSec, tagId: shown.tagId }, true, null, true);
    }

    async function applyShortcutTiming(startSec, endSec) {
      if (selectedSegments.length !== 1 || !selectedSegment) return;
      const validation = validateSegmentTiming(startSec, endSec, mediaDuration);
      if (validation.error) {
        setSaveMessage(validation.error);
        return;
      }
      const shown = displayedSelectedSegment?.id === selectedSegment.id ? displayedSelectedSegment : selectedSegment;
      if (startSec === shown.startSec && endSec === shown.endSec) {
        setSaveMessage("Timing is unchanged.");
        return;
      }
      await mutateSegment(selectedSegment, { startSec, endSec, tagId: shown.tagId }, true, null, true);
    }

  return { acceptHistory, recordHistoryAction, mutateSegment, runSegmentMutation, completeReview, createSegment, splitSegment, duplicateSegment, saveTiming, applyShortcutTiming };
}

export { createPrimarySegmentActions, shouldReloadAfterSegmentMutation };
