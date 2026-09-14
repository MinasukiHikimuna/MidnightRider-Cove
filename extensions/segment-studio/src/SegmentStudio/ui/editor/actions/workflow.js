import { completeOperation, confirmEmptyRecyclingBin, dependencyDeletionAllowed, operationDiscardsMissingImage, operationIdFor, rememberMissingImageDiscard, requestDownload, requestJson } from "../../shared/api.js";
import { findSegmentByStableIdentity, heldTagReady, queueCreatedSegmentTagChoice, shouldRestoreTransitionSelection } from "../model/shortcuts.js";
import { createPendingChangeId, heldTagChangeFor } from "../model/pending-changes.js";
import { resolveSegmentTarget, segmentIdentity } from "../model/save-queue.js";
import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { incorrectExampleHistoryState, segmentsHistoryState } from "../model/history.js";
import { notifyRecyclingBinChanged } from "../../shared/navigation.js";
import { CLEARED_SEGMENT_SELECTION_ID, editorVisibilityIncludingSegment, nextSegmentAfterRemoval, nextUnreviewedAfterRemoval } from "../model/selection.js";
import { segmentGroupKeyForSegment } from "../model/swimlanes.js";
import { applyFeedbackEditorDelta, extractFeedbackFrames, feedbackResultMatchesAction, feedbackSelectionPlan } from "../model/feedback.js";
import { removeSegmentsProjection } from "../model/optimistic.js";

function createWorkflowActions(context) {
  const { acceptHistory, acquireSaveLock, allSwimlanes, autoAssignCandidates, autoAssigning, binEmptyingRef, canMoveSelectionToBin, closeTagEditing, compatibilityMode, creatingSegmentId, detail, editorFilters, editorRef, cancelSaveTasks, dispatchPendingChanges, enqueueSave, exportingExamples, hideDerivedSegments, incorrectExamples, lineage, materializeButtonRef, materializePreview, materializeRestoreFocusRef, materializing, mutateSegment, runSegmentMutation, pendingChanges, onConflict, onDetailChange, onReload, performerSlots, recordHistoryAction, refreshMaterializationPreview, removingExampleId, revealSegmentGroupForSelection, savingSegmentId, segmentGroups, segments, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setAutoAssignError, setAutoAssignOpen, setAutoAssigning, setEditorFilters, setExportingExamples, setHideDerivedSegments, setIncorrectExamples, setMaterializeError, setMaterializeLoading, setMaterializeOpen, setMaterializePreview, setMaterializing, setRejectedDeletionPreview, setRemovingExampleId, setSaveMessage, setSelectedSegmentGroupKey, setSelectedSegmentId, setSelectedSegmentIds, video } = context;

  async function toggleIncorrectExample() {
      if (selectedSegments.length === 0 || !selectedSegment || savingSegmentId != null) return;
      const plan = feedbackSelectionPlan(selectedSegments, incorrectExamples);
      const candidates = plan.segments;
      if (candidates.length === 0) return;
      const identities = selectedSegments.map((segment) => ({
        id: segment.id,
        itemId: segment.itemId,
        nativeSegmentId: segment.nativeSegmentId,
      }));
      const activeIdentity =
        identities.find((identity) => identity.id === selectedSegment.id)
        || identities[0];
      const completed = [];
      const failures = [];
      let historyWarning = false;
      let workingDetail = detail;
      // Replay deltas onto the latest projection unless a refetch already replaced it.
      let refetchedDetail = false;
      const appliedDeltas = [];
      const releaseSaveLock = acquireSaveLock("feedback", activeIdentity.id);
      if (!releaseSaveLock) return;
      setSaveMessage(plan.action === "remove"
        ? `Removing ${candidates.length} selected incorrect example${candidates.length === 1 ? "" : "s"}…`
        : `Collecting ${candidates.length} selected segment${candidates.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const submitAction = async (segment, example) => {
          const usesNativeIdentity = segment.nativeSegmentId != null;
          const operationKey = plan.action === "remove"
            ? `incorrect-example-remove:${video.id}:${example?.id}:${example?.revision}:${example?.representationRevision}`
            : `incorrect-example-collect:${video.id}:${usesNativeIdentity ? `native:${segment.nativeSegmentId}:${segment.updatedAt}` : `item:${segment.itemId}:${segment.revision}`}`;
          if (plan.action === "remove" && !example)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let result;
          try {
            result = plan.action === "remove"
              ? await requestJson(
              `/videos/${video.id}/incorrect-examples/${example.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: operationIdFor(operationKey),
                  expectedExampleRevision: example.revision,
                  expectedRepresentationRevision:
                    example.representationRevision,
                }),
              },
            )
              : await requestJson(`/videos/${video.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                nativeSegmentId: usesNativeIdentity
                  ? segment.nativeSegmentId
                  : null,
                itemId: usesNativeIdentity ? null : segment.itemId,
                expectedUpdatedAt: usesNativeIdentity
                  ? segment.updatedAt
                  : null,
                expectedRevision: usesNativeIdentity
                  ? null
                  : segment.revision,
              }),
              });
          } catch (error) {
            error.operationKey = operationKey;
            throw error;
          }
          if (!feedbackResultMatchesAction(plan.action, result))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          completeOperation(operationKey);
          return result;
        };
        for (const segment of candidates) {
          const example = plan.action === "remove"
            ? incorrectExamples.find((candidate) =>
              candidate.itemId != null && candidate.itemId === segment.itemId)
            : null;
          try {
            const identity = identities.find((candidate) =>
              candidate.id === segment.id);
            let submittedSegment = findSegmentByStableIdentity(
              workingDetail?.segments, identity) || segment;
            let result;
            try {
              result = await submitAction(submittedSegment, example);
            } catch (error) {
              if (error.status === 409
                && error.payload?.result?.code === "OPERATION_REPLAYED") {
                workingDetail = await requestJson(
                  `/videos/${video.id}/editor`);
                refetchedDetail = true;
                appliedDeltas.length = 0;
                completeOperation(error.operationKey);
                result = error.payload.result;
              } else {
                if (plan.action !== "collect" || error.status !== 409) throw error;
                const refreshed = await requestJson(
                  `/videos/${video.id}/editor`);
                workingDetail = refreshed;
                refetchedDetail = true;
                appliedDeltas.length = 0;
                const current = findSegmentByStableIdentity(
                  refreshed?.segments, identity);
                if (!current) throw error;
                submittedSegment = current;
                result = await submitAction(submittedSegment, null);
              }
            }
            if (identity && result.itemId != null) identity.itemId = result.itemId;
            workingDetail = applyFeedbackEditorDelta(
              workingDetail, result.editorDelta);
            appliedDeltas.push(result.editorDelta);
            const completion = { segment, result, example };
            completed.push(completion);
          } catch (error) {
            failures.push(error);
            if (![400, 404, 409].includes(error.status)) break;
          }
        }
        if (compatibilityMode && completed.length > 0) {
          const beforeCollected = plan.action === "remove";
          const count = completed.length;
          const recorded = await recordHistoryAction(
            beforeCollected ? "feedback.remove" : "feedback.collect",
            beforeCollected
              ? `Removed ${count} incorrect AI example${count === 1 ? "" : "s"}`
              : `Collected ${count} incorrect AI example${count === 1 ? "" : "s"}`,
            incorrectExampleHistoryState(completed, beforeCollected),
            incorrectExampleHistoryState(completed, !beforeCollected),
          );
          if (!recorded) historyWarning = true;
        }
        if (completed.some(({ result }) =>
          result.representation === "basicNativeBin"))
          notifyRecyclingBinChanged();
        const transitionSelectionOwned = shouldRestoreTransitionSelection(
          selectedSegmentIdRef.current, activeIdentity.id,
        );
        const activeCollected = plan.action === "collect"
          && completed.some(({ segment }) => segment.id === activeIdentity.id);
        const completedIds = completed.map(({ segment }) => segment.id);
        const nextCandidate = activeCollected
          ? nextUnreviewedAfterRemoval(
            allSwimlanes, completedIds, activeIdentity.id)
          : null;
        const selectionGuardId = activeCollected
          ? nextCandidate?.id ?? null
          : activeIdentity.id;
        if (transitionSelectionOwned && activeCollected) {
          setSelectedSegmentIds(nextCandidate ? [nextCandidate.id] : []);
          setSelectedSegmentId(nextCandidate?.id ?? CLEARED_SEGMENT_SELECTION_ID);
          selectionAnchorIdRef.current = nextCandidate?.id ?? null;
          selectionRangeBaseIdsRef.current = [];
        }
        const examples = await requestJson(`/videos/${video.id}/incorrect-examples`);
        setIncorrectExamples(examples);
        const updatedDetail = workingDetail;
        onDetailChange(refetchedDetail
          ? updatedDetail
          : (current) => appliedDeltas.reduce(applyFeedbackEditorDelta, current), video.id);
        if (transitionSelectionOwned && shouldRestoreTransitionSelection(
          selectedSegmentIdRef.current, selectionGuardId,
        )) {
          let reloadedSelection;
          let reloadedActive;
          if (activeCollected) {
            reloadedActive = nextCandidate
              ? findSegmentByStableIdentity(updatedDetail?.segments, {
                id: nextCandidate.id,
                itemId: nextCandidate.itemId,
                nativeSegmentId: nextCandidate.nativeSegmentId,
              })
              : null;
            reloadedSelection = reloadedActive ? [reloadedActive] : [];
          } else {
            reloadedSelection = identities
              .map((identity) => findSegmentByStableIdentity(updatedDetail?.segments, identity))
              .filter(Boolean);
            reloadedActive =
              findSegmentByStableIdentity(updatedDetail?.segments, activeIdentity)
              || reloadedSelection[0]
              || null;
          }
          setSelectedSegmentIds(reloadedSelection.map((segment) => segment.id));
          setSelectedSegmentId(reloadedActive?.id
            ?? (activeCollected ? CLEARED_SEGMENT_SELECTION_ID : null));
          selectionAnchorIdRef.current = reloadedActive?.id ?? null;
          selectionRangeBaseIdsRef.current = [];
          setSelectedSegmentGroupKey(reloadedActive
            ? segmentGroupKeyForSegment(allSwimlanes, reloadedActive.id)
            : null);
          if (reloadedActive) revealSegmentGroupForSelection(reloadedActive.id);
        }
        if (failures.length > 0) {
          const detail = failures[0]?.message
            || "Only segments with registered AI provenance can be collected.";
          if (completed.length === 0) setSaveMessage(detail);
          else if (plan.action === "remove") {
            setSaveMessage(
              `Partially removed ${completed.length} of ${candidates.length} selected incorrect examples. ${detail}`,
            );
          } else {
            setSaveMessage(
              `Partially collected ${completed.length} of ${candidates.length} selected segments. ${detail}`,
            );
          }
        } else if (plan.action === "remove") {
          setSaveMessage(
            `${completed.length} incorrect example${completed.length === 1 ? "" : "s"} removed and ${completed.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`,
          );
        } else {
          const basicCount = completed.filter(({ result }) =>
            result.representation === "basicNativeBin").length;
          setSaveMessage(basicCount === completed.length
            ? `${completed.length} incorrect AI example${completed.length === 1 ? "" : "s"} collected and moved to the recycling bin.`
            : `${completed.length} incorrect AI example${completed.length === 1 ? "" : "s"} collected and ${completed.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        if (historyWarning)
          setSaveMessage("The change saved, but editor history could not be updated.");
      } catch (error) {
        setSaveMessage(error.message || "Unable to update the selected incorrect examples.");
      } finally {
        releaseSaveLock();
      }
    }

    async function removeIncorrectExample(example) {
      if (!example || removingExampleId != null || exportingExamples) return;
      // Removal records editor history and changes segments, so it holds the save lock like other saves.
      const releaseSaveLock = acquireSaveLock("feedback", -1);
      if (!releaseSaveLock) {
        setSaveMessage("Wait for the current save to finish before removing the incorrect example.");
        return;
      }
      try {
        await runIncorrectExampleRemoval(example);
      } finally {
        releaseSaveLock();
      }
    }

    async function runIncorrectExampleRemoval(example) {
      setRemovingExampleId(example.id);
      const operationKey =
        `incorrect-example-remove:${video.id}:${example.id}:${example.revision}:${example.representationRevision}`;
      try {
        let result;
        let replayed = false;
        try {
          result = await requestJson(
            `/videos/${video.id}/incorrect-examples/${example.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                expectedExampleRevision: example.revision,
                expectedRepresentationRevision:
                  example.representationRevision,
              }),
            },
          );
        } catch (error) {
          if (error.status !== 409
            || error.payload?.result?.code !== "OPERATION_REPLAYED")
            throw error;
          result = error.payload.result;
          replayed = true;
        }
        completeOperation(operationKey);
        let historyRecorded = true;
        if (compatibilityMode) {
          const segment = findSegmentByStableIdentity(detail.segments, {
            itemId: example.itemId,
          }) || {
            id: example.itemId == null ? null : -example.itemId,
            itemId: example.itemId,
            nativeSegmentId: null,
            published: false,
            revision: example.representationRevision,
          };
          const completed = [{ segment, result, example }];
          historyRecorded = await recordHistoryAction(
            "feedback.remove",
            "Removed 1 incorrect AI example",
            incorrectExampleHistoryState(completed, true),
            incorrectExampleHistoryState(completed, false),
          );
        }
        const refreshed = await requestJson(
          `/videos/${video.id}/incorrect-examples`);
        setIncorrectExamples(refreshed);
        if (replayed)
          await onReload();
        else
          onDetailChange(
            (current) => applyFeedbackEditorDelta(current, result.editorDelta),
            video.id,
          );
        if (example.representation === "basicNativeBin")
          notifyRecyclingBinChanged();
        if (!historyRecorded)
          setSaveMessage("The change saved, but editor history could not be updated.");
        else if (replayed)
          setSaveMessage(compatibilityMode
            ? "Incorrect example removal was already applied and added to history."
            : "Incorrect example removal was already applied.");
        else
          setSaveMessage(example.representation === "basicNativeBin"
            ? "Incorrect example removed and its native segment restored."
            : "Incorrect example removed and segment returned to unreviewed.");
      } catch (error) {
        if (error.status === 409) await onConflict();
        setSaveMessage(error.message || "Unable to remove the incorrect example.");
      } finally {
        setRemovingExampleId(null);
      }
    }

    async function captureTrainingExport() {
      if (exportingExamples || removingExampleId != null
          || incorrectExamples.length === 0) return;
      setExportingExamples(true);
      const operationKey = `incorrect-example-export:${video.id}:${
        incorrectExamples.map((example) =>
          `${example.id}:${example.revision}:${example.representationRevision}`)
          .join(",")}`;
      try {
        const capture = await extractFeedbackFrames(
          video.id, incorrectExamples);
        const form = new FormData();
        form.append("metadata", JSON.stringify({
          operationId: operationIdFor(operationKey),
          examples: capture.captures,
        }));
        for (const frame of capture.files)
          form.append(frame.fieldName, frame.file);
        const result = await requestJson(
          `/videos/${video.id}/incorrect-examples/export`,
          { method: "POST", body: form },
        );
        const download = await requestDownload(result.downloadUrl);
        const url = URL.createObjectURL(download.blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = download.fileName;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        const completed = await requestJson(
          `/training-exports/${result.id}/complete`,
          { method: "POST" },
        );
        completeOperation(operationKey);
        setIncorrectExamples(await requestJson(
          `/videos/${video.id}/incorrect-examples`));
        setSaveMessage(
          `Downloaded ${result.exampleCount} incorrect example${result.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${completed.clearedExampleCount} from the working collection.`,
        );
      } catch (error) {
        setSaveMessage(error.message
          || "Unable to capture and download the training export. The working collection was kept.");
      } finally {
        setExportingExamples(false);
      }
    }

    async function deleteRejectedSegments(confirmedPreview = null) {
      const rejectedSegments = segments.filter((segment) => segment.reviewState === "rejected");
      const rejectedCount = rejectedSegments.length;
      const hasProtectedFullExamples = incorrectExamples.some((example) =>
        example.representation === "fullItem");
      if (confirmedPreview == null && rejectedCount === 0 && !hasProtectedFullExamples) {
        setSaveMessage("There are no rejected segments to delete.");
        return;
      }
      if (confirmedPreview == null) {
        const releaseSaveLock = acquireSaveLock("delete-rejected", -1);
        if (!releaseSaveLock) return;
        setSaveMessage("Preparing deletion summary…");
        try {
          const preview = await requestJson(`/videos/${video.id}/rejected/deletion/preview`, { method: "POST" });
          const deletedCount = Number(preview.deletedSegmentCount) || 0;
          const deferredCount = Number(preview.deferredRejectedSegmentCount) || 0;
          const protectedExampleCount = Number(preview.protectedIncorrectExampleCount) || 0;
          if (deletedCount === 0) {
            if (deferredCount > 0) {
              setSaveMessage(
                `${deferredCount} feedback-protected rejected segment${deferredCount === 1 ? "" : "s"} kept. ${protectedExampleCount} AI feedback example${protectedExampleCount === 1 ? "" : "s"} must be exported before ${deferredCount === 1 ? "this segment can" : "these segments can"} be deleted.`,
              );
            } else {
              setSaveMessage("There are no rejected segments to delete.");
            }
            return;
          }
          if (!dependencyDeletionAllowed(preview, setSaveMessage)) return;
          setRejectedDeletionPreview(preview);
          setSaveMessage("");
        } catch (error) {
          setSaveMessage(error.message || "Unable to prepare rejected segment deletion.");
        } finally {
          releaseSaveLock();
        }
        return;
      }
      const preview = confirmedPreview;
      const deferredCount = Number(preview.deferredRejectedSegmentCount) || 0;
      const previousSelectionId = selectedSegmentIdRef.current;
      const optimisticDetail = deferredCount === 0
        ? removeSegmentsProjection(detail, rejectedSegments.map((segment) => segment.id))
        : detail;
      const nextSelectedSegment = optimisticDetail.segments.find((segment) => segment.reviewState === "unreviewed")
        || optimisticDetail.segments[0]
        || null;
      const releaseSaveLock = acquireSaveLock("delete-rejected", -1);
      if (!releaseSaveLock) return;
      setRejectedDeletionPreview(null);
      setSaveMessage("Deleting rejected segments…");
      // Hide the rejected segments until the deletion is confirmed; a failure only drops this entry.
      const pendingChangeId = deferredCount === 0 ? createPendingChangeId() : null;
      if (pendingChangeId) {
        dispatchPendingChanges({
          type: "add",
          entry: { id: pendingChangeId, op: "remove", targets: rejectedSegments.map(segmentIdentity) },
        });
        setSelectedSegmentIds(nextSelectedSegment ? [nextSelectedSegment.id] : []);
        setSelectedSegmentId(nextSelectedSegment?.id ?? null);
        selectionAnchorIdRef.current = nextSelectedSegment?.id ?? null;
        selectionRangeBaseIdsRef.current = [];
      }
      try {
        const operationKey = `rejected-dependency-delete:${video.id}:${preview.fingerprint}`;
        const result = await requestJson(`/videos/${video.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: operationIdFor(operationKey),
            fingerprint: preview.fingerprint,
          }),
        });
        completeOperation(operationKey);
        await onReload();
        if (pendingChangeId) dispatchPendingChanges({ type: "settle", key: pendingChangeId });
        if (result.deletedSegmentCount > 0)
          acceptHistory(EMPTY_EDITOR_HISTORY);
        const retainedMessage = deferredCount > 0
          ? ` ${deferredCount} feedback-protected rejected segment${deferredCount === 1 ? " was" : "s were"} kept for a later post-export batch.`
          : "";
        setSaveMessage(`${result.deletedSegmentCount} segment${result.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${retainedMessage}`);
      } catch (error) {
        if (pendingChangeId) dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        setSelectedSegmentIds(previousSelectionId == null ? [] : [previousSelectionId]);
        setSelectedSegmentId(previousSelectionId);
        selectionAnchorIdRef.current = previousSelectionId;
        selectionRangeBaseIdsRef.current = [];
        setSaveMessage(error.message || "Unable to delete rejected segments.");
      } finally {
        releaseSaveLock();
      }
    }

    async function autoAssignPerformers(candidates = autoAssignCandidates) {
      if (autoAssigning || candidates.length === 0) return;
      const releaseSaveLock = acquireSaveLock("auto-assign", -1);
      if (!releaseSaveLock) {
        setAutoAssignError("Wait for the current save to finish before assigning performers.");
        return;
      }
      try {
        await runAutoAssign(candidates);
      } finally {
        releaseSaveLock();
      }
    }

    async function runAutoAssign(candidates) {
      setAutoAssigning(true);
      setAutoAssignError("");
      try {
        const result = await requestJson(`/videos/${video.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: candidates.flatMap((segment) => segment.nativeSegmentId == null ? [] : [segment.nativeSegmentId]),
            itemIds: candidates.flatMap((segment) => segment.published || segment.itemId == null ? [] : [segment.itemId]),
          }),
        });
        setAutoAssignOpen(false);
        await onReload();
        setSaveMessage(`${result.assignedSegmentCount} segment${result.assignedSegmentCount === 1 ? "" : "s"} received ${result.assignedSlotCount} performer-slot assignment${result.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (error) {
        setAutoAssignError(error.message || "Unable to auto-assign performers.");
      } finally {
        setAutoAssigning(false);
      }
    }

    async function previewDerivedSegments() {
      setMaterializeOpen(true);
      setMaterializeError("");
      if (materializePreview) return;
      setMaterializeLoading(true);
      refreshMaterializationPreview();
    }

    function closeMaterializeDialog() {
      materializeRestoreFocusRef.current = true;
      setMaterializeOpen(false);
      requestAnimationFrame(() => materializeButtonRef.current?.focus({ preventScroll: true }));
    }

    async function materializeDerivedSegments() {
      if (!materializePreview || materializing
          || materializePreview.createCount + materializePreview.linkCount === 0)
        return;
      const releaseSaveLock = acquireSaveLock("materialize", -1);
      if (!releaseSaveLock) {
        setMaterializeError("Wait for the current save to finish before materializing derived segments.");
        return;
      }
      try {
        await runMaterialization();
      } finally {
        releaseSaveLock();
      }
    }

    async function runMaterialization() {
      setMaterializing(true);
      setMaterializeError("");
      let result;
      try {
        const operationKey = `materialize-derived:${video.id}:${materializePreview.fingerprint}`;
        result = await requestJson(`/videos/${video.id}/derived-segments/materialize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: operationIdFor(operationKey),
            fingerprint: materializePreview.fingerprint,
            maxDepth: 3,
          }),
        });
        completeOperation(operationKey);
      } catch (error) {
        if (error.status === 409) setMaterializePreview(null);
        setMaterializeError(error.message || "Unable to materialize derived segments.");
        setMaterializing(false);
        return;
      }

      setMaterializePreview((current) => current ? { ...current, createCount: 0, linkCount: 0 } : current);
      try {
        await onReload();
        closeMaterializeDialog();
        setMaterializePreview(null);
        const changed = result.createdCount + result.linkedCount;
        setSaveMessage(`${result.createdCount} derived segment${result.createdCount === 1 ? "" : "s"} created and ${result.linkedCount} existing segment${result.linkedCount === 1 ? "" : "s"} linked.`);
        if (changed === 0) setSaveMessage("Every applicable derivation was already materialized.");
      } catch {
        setMaterializeError("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
      }
      setMaterializing(false);
    }

    async function saveTag(tagId, tagName = null) {
      const optimisticValues = {
        tagId,
        ...(tagName ? { tagName } : {}),
        // The previous tag's sort name would misplace the destination lane until the reload.
        tagSortName: null,
      };
      if (selectedSegments.length > 1) {
        const candidates = selectedSegments.filter((segment) => segment.tagId !== tagId);
        if (candidates.length === 0) {
          closeTagEditing();
          return;
        }
        const identities = selectedSegments.map((segment) => ({
          id: segment.id,
          itemId: segment.itemId,
          nativeSegmentId: segment.nativeSegmentId,
        }));
        const signature = selectedSegments.map((segment) =>
          !compatibilityMode || segment.nativeSegmentId != null
            ? `native:${segment.nativeSegmentId}:${segment.updatedAt}`
            : `item:${segment.itemId}:${segment.revision}`).sort().join(",");
        const operationKey = `bulk-tag:${video.id}:${tagId}:${signature}`;
        const releaseSaveLock = acquireSaveLock("tag", selectedSegment?.id ?? candidates[0].id);
        if (!releaseSaveLock) return;
        setSaveMessage(`Changing tag for ${candidates.length} selected segment${candidates.length === 1 ? "" : "s"}…`);
        // Show the new tag on top of the server projection until the change is confirmed or fails.
        const pendingChangeId = createPendingChangeId();
        dispatchPendingChanges({
          type: "add",
          entry: { id: pendingChangeId, op: "patch", targets: candidates.map(segmentIdentity), values: optimisticValues },
        });
        closeTagEditing();
        try {
          const historyReceiptId = !compatibilityMode
            ? crypto.randomUUID()
            : null;
          await requestJson(`/videos/${video.id}/segments/tag`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              tagId,
              historyReceiptId,
              segments: selectedSegments.map((segment) => {
                const native = !compatibilityMode
                  || segment.nativeSegmentId != null;
                return {
                  nativeSegmentId: native ? segment.nativeSegmentId : null,
                  itemId: native ? null : segment.itemId,
                  expectedUpdatedAt: native ? segment.updatedAt : null,
                  expectedRevision: native ? null : segment.revision,
                };
              }),
            }),
          });
          completeOperation(operationKey);
          const beforeState = segmentsHistoryState(
            selectedSegments,
            compatibilityMode,
          );
          const loaded = await onReload();
          dispatchPendingChanges({ type: "settle", key: pendingChangeId });
          const changedSegments = identities
            .map((identity) => findSegmentByStableIdentity(loaded?.segments, identity))
            .filter(Boolean);
          await recordHistoryAction(
            "segments.tag",
            `Changed tag for ${candidates.length} segment${candidates.length === 1 ? "" : "s"}`,
            beforeState,
            segmentsHistoryState(changedSegments, compatibilityMode),
            historyReceiptId,
          );
          const reloadedSelection = identities
            .map((identity) => findSegmentByStableIdentity(loaded?.segments, identity))
            .filter(Boolean);
          setSelectedSegmentIds(reloadedSelection.map((segment) => segment.id));
          setSelectedSegmentId(reloadedSelection.find((segment) => segment.id === selectedSegment?.id)?.id
            ?? reloadedSelection[0]?.id
            ?? null);
          closeTagEditing();
          setSaveMessage(`${candidates.length} selected segment${candidates.length === 1 ? "" : "s"} retagged.`);
        } catch (error) {
          dispatchPendingChanges({ type: "discard", key: pendingChangeId });
          const restoredSelection = identities
            .map((identity) => findSegmentByStableIdentity(detail.segments, identity))
            .filter(Boolean);
          const restoredActive = findSegmentByStableIdentity(detail.segments, {
            id: selectedSegment?.id,
            itemId: selectedSegment?.itemId,
            nativeSegmentId: selectedSegment?.nativeSegmentId,
          }) || restoredSelection[0] || null;
          setSelectedSegmentIds(restoredSelection.map((segment) => segment.id));
          setSelectedSegmentId(restoredActive?.id ?? null);
          selectionAnchorIdRef.current = restoredActive?.id ?? null;
          selectionRangeBaseIdsRef.current = [];
          if (error.status === 409) await onConflict();
          setSaveMessage(error.message || "Unable to change the selected segment tags.");
        } finally {
          releaseSaveLock();
        }
        return;
      }
      if (selectedSegments.length !== 1 || !selectedSegment) return;
      const heldChange = heldTagChangeFor(pendingChanges, selectedSegment);
      if (selectedSegment.id === creatingSegmentId || heldChange) {
        // The new segment is still saving or its held choice is not saved yet: show the choice now and save it once possible.
        const heldChoice = heldChange
          ? { segmentId: selectedSegment.id, tagId: heldChange.values.tagId, tagName: heldChange.meta.tagName }
          : null;
        const queue = queueCreatedSegmentTagChoice(heldChoice, selectedSegment, tagId, tagName);
        if (heldChange) {
          cancelSaveTasks((task) => task.meta?.pendingChangeId === heldChange.id);
          dispatchPendingChanges({ type: "discard", key: heldChange.id });
        }
        if (queue) holdCreatedSegmentTag(selectedSegment, queue);
        if (queue) {
          // Keep the held segment selected even when the displayed tag falls outside the active filters.
          const visibility = editorVisibilityIncludingSegment(
            { ...selectedSegment, tagId: queue.tagId },
            performerSlots,
            editorFilters,
            hideDerivedSegments,
            segmentGroups,
          );
          setEditorFilters(visibility.filters);
          setHideDerivedSegments(visibility.hideDerivedSegments);
          setSaveMessage("Tag change queued…");
        } else if (heldChange) {
          setSaveMessage("");
        }
        closeTagEditing();
        return;
      }
      if (tagId === selectedSegment.tagId) {
        closeTagEditing();
        return;
      }
      if (selectedSegment.itemId != null && lineage.data?.children?.length > 0) {
        // Preview and execute each hold the save lock, but the confirmation is asked without it so a
        // pending decision does not block other saves; a change made meanwhile makes the execute conflict.
        const releasePreviewLock = acquireSaveLock("lineage-tag", selectedSegment.id);
        if (!releasePreviewLock) return;
        setSaveMessage("Checking lineage impact…");
        let preview;
        try {
          preview = await requestJson(`/items/${selectedSegment.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: selectedSegment.revision, tagId }),
          });
        } catch (error) {
          if (error.status === 409) {
            setSaveMessage("Lineage changed — loading the latest segments…");
            await onConflict();
          } else {
            setSaveMessage(error.message || "Unable to reconcile the lineage.");
          }
          return;
        } finally {
          releasePreviewLock();
        }
        const destructive = preview.deletedItemIds.length > 0 || preview.removedEdgeIds.length > 0;
        if (destructive && !window.confirm(
          `Changing this tag removes ${preview.removedEdgeIds.length} lineage edge${preview.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${preview.deletedItemIds.length} derived segment${preview.deletedItemIds.length === 1 ? "" : "s"}. Continue?`,
        )) {
          setSaveMessage("Tag change canceled.");
          return;
        }
        const releaseSaveLock = acquireSaveLock("lineage-tag", selectedSegment.id);
        if (!releaseSaveLock) {
          setSaveMessage("Wait for the current save to finish before changing the tag.");
          return;
        }
        const pendingChangeId = createPendingChangeId();
        dispatchPendingChanges({
          type: "add",
          entry: { id: pendingChangeId, op: "patch", targets: [segmentIdentity(selectedSegment)], values: optimisticValues },
        });
        closeTagEditing();
        try {
          const operationKey = `tag-change:${selectedSegment.itemId}:${selectedSegment.revision}:${preview.componentFingerprint}:${tagId}`;
          await requestJson(`/items/${selectedSegment.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              expectedRevision: selectedSegment.revision,
              componentFingerprint: preview.componentFingerprint,
              tagId,
            }),
          });
          completeOperation(operationKey);
          await onReload();
          dispatchPendingChanges({ type: "settle", key: pendingChangeId });
          closeTagEditing();
          setSaveMessage(destructive ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (error) {
          dispatchPendingChanges({ type: "discard", key: pendingChangeId });
          setSelectedSegmentIds([selectedSegment.id]);
          setSelectedSegmentId(selectedSegment.id);
          selectionAnchorIdRef.current = selectedSegment.id;
          selectionRangeBaseIdsRef.current = [];
          if (error.status === 409) {
            setSaveMessage("Lineage changed — loading the latest segments…");
            await onConflict();
          } else {
            setSaveMessage(error.message || "Unable to reconcile the lineage.");
          }
        } finally {
          releaseSaveLock();
        }
        return;
      }
      closeTagEditing();
      await mutateSegment(selectedSegment, {
        startSec: selectedSegment.startSec,
        endSec: selectedSegment.endSec,
        tagId,
      }, true, null, true, optimisticValues);
    }

    function holdCreatedSegmentTag(segment, choice) {
      const pendingChangeId = createPendingChangeId();
      dispatchPendingChanges({
        type: "add",
        entry: {
          id: pendingChangeId,
          op: "patch",
          targets: [segmentIdentity(segment)],
          values: { tagId: choice.tagId, tagName: choice.tagName || "Tag segment", tagSortName: null },
          meta: { kind: "held-tag", tagName: choice.tagName },
        },
      });
      const createChange = pendingChanges.find((entry) => entry.op === "insert" && entry.segment.id === segment.id);
      enqueueSave({
        kind: "held-tag",
        whenBusy: "enqueue",
        targets: [segmentIdentity(segment)],
        dependsOn: createChange?.taskId ?? null,
        meta: { pendingChangeId },
        ready: (saveContext, task) => {
          const target = resolveSegmentTarget(saveContext.segments, task.targets[0]);
          return !target || heldTagReady(saveContext, target.id);
        },
        run: (saveContext) => applyHeldCreatedSegmentTag(saveContext, pendingChangeId, choice),
      });
    }

    async function applyHeldCreatedSegmentTag(saveContext, pendingChangeId, choice) {
      // Save against the held segment itself, whatever is selected now; a brand-new segment has no lineage to reconcile.
      const [segment] = saveContext.resolveTargets();
      if (!segment || segment.tagId === choice.tagId) {
        dispatchPendingChanges({ type: "discard", key: pendingChangeId });
        return;
      }
      // The user may have moved on, so a failure must not pull the selection back to where the save started.
      const saved = await runSegmentMutation(segment, {
        startSec: segment.startSec,
        endSec: segment.endSec,
        tagId: choice.tagId,
      }, {
        pendingChangeId,
        restoreSelectionOnFailure: false,
        onReload: saveContext.onReload,
        onConflict: saveContext.onConflict,
      });
      if (!saved)
        setSaveMessage(`The new segment was not retagged${choice.tagName ? ` to ${choice.tagName}` : ""}. Choose its tag again.`);
    }

    async function moveToBin() {
      if (!canMoveSelectionToBin || !selectedSegment || savingSegmentId != null) return;
      const candidates = [...selectedSegments].sort((left, right) =>
        Number(left.nativeSegmentId ?? left.id) - Number(right.nativeSegmentId ?? right.id));
      const selectedIds = new Set(candidates.map((segment) => segment.id));
      const signature = candidates
        .map((segment) => `${segment.nativeSegmentId ?? segment.id}:${segment.updatedAt}`)
        .join("|");
      const releaseSaveLock = acquireSaveLock("bin", selectedSegment.id);
      if (!releaseSaveLock) return;
      setSaveMessage(`Moving ${candidates.length} segment${candidates.length === 1 ? "" : "s"} to recycling bin…`);
      const operationKey = `bulk-move:${video.id}:${signature}`;
      const operationId = operationIdFor(operationKey);
      const historyReceiptId = !compatibilityMode
        ? crypto.randomUUID()
        : null;
      try {
        const submit = (discardMissingImage = false) => requestJson(`/videos/${video.id}/segments/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId,
              segments: candidates.map((segment) => ({
                segmentId: segment.nativeSegmentId ?? segment.id,
                expectedUpdatedAt: segment.updatedAt,
              })),
              discardMissingImage,
              ...(compatibilityMode ? { reviewState: "rejected" } : {}),
              historyReceiptId,
            }),
          });
        let transition;
        try {
          transition = await submit(
            operationDiscardsMissingImage(operationKey));
        } catch (error) {
          if (error.payload?.code !== "missing-image" || !window.confirm(`${error.message}\n\nContinue and discard the missing image reference?`)) throw error;
          rememberMissingImageDiscard(operationKey);
          transition = await submit(true);
        }
        completeOperation(operationKey);
        notifyRecyclingBinChanged();
        const movedByNativeId = new Map((transition.items || []).map((item) => [
          Number(item.segmentId),
          item,
        ]));
        await recordHistoryAction(
          "segments.moveToBin",
          `Moved ${candidates.length} segment${candidates.length === 1 ? "" : "s"} to recycling bin`,
          segmentsHistoryState(candidates, false),
          segmentsHistoryState(candidates.map((segment) => {
            const moved = movedByNativeId.get(
              Number(segment.nativeSegmentId ?? segment.id));
            return {
              ...segment,
              recycleBinItemId: moved?.itemId ?? null,
              nativeSegmentId: null,
              published: false,
              revision: moved?.revision ?? null,
            };
          }), false),
          historyReceiptId,
        );
        const nextSelection = nextSegmentAfterRemoval(allSwimlanes, selectedIds, selectedSegment.id);
        onDetailChange((current) => ({
          ...current,
          segments: (current.segments || []).filter((segment) => !selectedIds.has(segment.id)),
        }), video.id);
        setSelectedSegmentIds(nextSelection ? [nextSelection.id] : []);
        setSelectedSegmentId(nextSelection?.id ?? null);
        selectionAnchorIdRef.current = nextSelection?.id ?? null;
        selectionRangeBaseIdsRef.current = [];
        if (nextSelection) {
          setSelectedSegmentGroupKey(segmentGroupKeyForSegment(allSwimlanes, nextSelection.id));
          revealSegmentGroupForSelection(nextSelection.id);
        }
        requestAnimationFrame(() => editorRef.current?.focus({ preventScroll: true }));
        setSaveMessage(`Moved ${candidates.length} segment${candidates.length === 1 ? "" : "s"} to recycling bin.`);
      } catch (error) {
        const conflictCode = error.payload?.code || error.payload?.result?.code;
        if (error.status === 409 && conflictCode === "CANONICAL_SEGMENT_CHANGED")
          await onConflict();
        else
          setSaveMessage(error.message || "Unable to move the selected segments to the recycling bin.");
      } finally {
        releaseSaveLock();
      }
    }

    async function emptyRecyclingBin() {
      if (compatibilityMode || binEmptyingRef.current || savingSegmentId != null) return;
      binEmptyingRef.current = true;
      setSaveMessage("Checking the recycling bin…");
      try {
        const snapshot = await requestJson("/bin");
        const outcome = await confirmEmptyRecyclingBin(snapshot, () =>
          setSaveMessage("Emptying the recycling bin…"));
        if (outcome.status === "empty") {
          setSaveMessage("The recycling bin is empty.");
          return;
        }
        if (outcome.status === "canceled") {
          setSaveMessage("The recycling bin was not emptied.");
          return;
        }
        setSaveMessage(`${outcome.segmentCount} segment${outcome.segmentCount === 1 ? "" : "s"} from ${outcome.sceneCount} scene${outcome.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (error) {
        setSaveMessage(error.message || "Unable to empty the recycling bin.");
      } finally {
        binEmptyingRef.current = false;
      }
    }

  return { toggleIncorrectExample, removeIncorrectExample, captureTrainingExport, deleteRejectedSegments, autoAssignPerformers, previewDerivedSegments, closeMaterializeDialog, materializeDerivedSegments, saveTag, moveToBin, emptyRecyclingBin };
}

export { createWorkflowActions };
