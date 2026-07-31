import { completeOperation, confirmDependencyDeletion, confirmEmptyRecyclingBin, dependencyDeletionAllowed, operationDiscardsMissingImage, operationIdFor, rememberMissingImageDiscard, requestDownload, requestJson } from "../../shared/api.js";
import { findSegmentByStableIdentity, shouldRestoreTransitionSelection } from "../model/shortcuts.js";
import { EMPTY_EDITOR_HISTORY } from "../../shared/constants.js";
import { segmentsHistoryState } from "../model/history.js";
import { notifyRecyclingBinChanged } from "../../shared/navigation.js";
import { nextSegmentAfterRemoval } from "../model/selection.js";
import { segmentGroupKeyForSegment } from "../model/swimlanes.js";
import { extractFeedbackFrames, feedbackResultMatchesAction, feedbackSelectionPlan } from "../model/feedback.js";

function createWorkflowActions(context) {
  const { acceptHistory, allSwimlanes, autoAssignCandidates, autoAssigning, binEmptyingRef, canMoveSelectionToBin, closeTagEditing, compatibilityMode, detail, editorRef, exportingExamples, incorrectExamples, lineage, materializeButtonRef, materializePreview, materializeRestoreFocusRef, materializing, mutateSegment, onConflict, onDetailChange, onReload, recordHistoryAction, removingExampleId, revealSegmentGroupForSelection, savingSegmentId, segments, selectedSegment, selectedSegmentIdRef, selectedSegments, selectionAnchorIdRef, selectionRangeBaseIdsRef, setAutoAssignError, setAutoAssignOpen, setAutoAssigning, setExportingExamples, setIncorrectExamples, setMaterializeError, setMaterializeLoading, setMaterializeOpen, setMaterializePreview, setMaterializing, setRemovingExampleId, setSaveMessage, setSavingSegmentId, setSelectedSegmentGroupKey, setSelectedSegmentId, setSelectedSegmentIds, video } = context;

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
      setSavingSegmentId(activeIdentity.id);
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
          const result = plan.action === "remove"
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
            let submittedSegment = segment;
            let result;
            try {
              result = await submitAction(submittedSegment, example);
            } catch (error) {
              if (plan.action !== "collect" || error.status !== 409) throw error;
              const refreshed = await requestJson(
                `/videos/${video.id}/editor`);
              const identity = identities.find((candidate) =>
                candidate.id === segment.id);
              const current = findSegmentByStableIdentity(
                refreshed?.segments, identity);
              if (!current) throw error;
              submittedSegment = current;
              result = await submitAction(submittedSegment, null);
            }
            const identity = identities.find((candidate) => candidate.id === segment.id);
            if (identity && result.itemId != null) identity.itemId = result.itemId;
            completed.push({ segment, result });
          } catch (error) {
            failures.push(error);
            if (![400, 404, 409].includes(error.status)) break;
          }
        }
        if (completed.some(({ result }) =>
          result.representation === "basicNativeBin"))
          notifyRecyclingBinChanged();
        const examples = await requestJson(`/videos/${video.id}/incorrect-examples`);
        setIncorrectExamples(examples);
        const loaded = await onReload();
        if (shouldRestoreTransitionSelection(
          selectedSegmentIdRef.current, activeIdentity.id,
        )) {
          const reloadedSelection = identities
            .map((identity) => findSegmentByStableIdentity(loaded?.segments, identity))
            .filter(Boolean);
          const reloadedActive =
            findSegmentByStableIdentity(loaded?.segments, activeIdentity)
            || reloadedSelection[0]
            || null;
          setSelectedSegmentIds(reloadedSelection.map((segment) => segment.id));
          setSelectedSegmentId(reloadedActive?.id ?? null);
          selectionAnchorIdRef.current = reloadedActive?.id ?? null;
          selectionRangeBaseIdsRef.current = [];
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
      } catch (error) {
        setSaveMessage(error.message || "Unable to update the selected incorrect examples.");
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function removeIncorrectExample(example) {
      if (!example || removingExampleId != null || exportingExamples) return;
      setRemovingExampleId(example.id);
      const operationKey =
        `incorrect-example-remove:${video.id}:${example.id}:${example.revision}:${example.representationRevision}`;
      try {
        await requestJson(
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
        completeOperation(operationKey);
        const refreshed = await requestJson(
          `/videos/${video.id}/incorrect-examples`);
        setIncorrectExamples(refreshed);
        await onReload();
        if (example.representation === "basicNativeBin")
          notifyRecyclingBinChanged();
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
        await onReload();
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

    async function deleteRejectedSegments() {
      const rejectedSegments = segments.filter((segment) => segment.reviewState === "rejected");
      const rejectedCount = rejectedSegments.length;
      if (rejectedCount === 0) {
        setSaveMessage("There are no rejected segments to delete.");
        return;
      }
      setSavingSegmentId(-1);
      setSaveMessage("Preparing deletion summary…");
      try {
        const preview = await requestJson(`/videos/${video.id}/rejected/deletion/preview`, { method: "POST" });
        if (!dependencyDeletionAllowed(preview, setSaveMessage)
            || !confirmDependencyDeletion(preview))
          return;
        setSaveMessage("Deleting rejected segments…");
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
        if (result.deletedSegmentCount > 0)
          acceptHistory(EMPTY_EDITOR_HISTORY);
        setSaveMessage(`${result.deletedSegmentCount} segment${result.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (error) {
        setSaveMessage(error.message || "Unable to delete rejected segments.");
      } finally {
        setSavingSegmentId(null);
      }
    }

    async function autoAssignPerformers() {
      if (autoAssigning || autoAssignCandidates.length === 0) return;
      setAutoAssigning(true);
      setAutoAssignError("");
      try {
        const result = await requestJson(`/videos/${video.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: autoAssignCandidates.flatMap((segment) => segment.nativeSegmentId == null ? [] : [segment.nativeSegmentId]),
            itemIds: autoAssignCandidates.flatMap((segment) => segment.published || segment.itemId == null ? [] : [segment.itemId]),
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
      setMaterializePreview(null);
      setMaterializeError("");
      setMaterializeLoading(true);
      try {
        const preview = await requestJson(`/videos/${video.id}/derived-segments/preview`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ maxDepth: 3 }),
        });
        setMaterializePreview(preview);
      } catch (error) {
        setMaterializeError(error.message || "Unable to preview derived segments.");
      } finally {
        setMaterializeLoading(false);
      }
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

    async function saveTag(tagId) {
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
        setSavingSegmentId(selectedSegment?.id ?? candidates[0].id);
        setSaveMessage(`Changing tag for ${candidates.length} selected segment${candidates.length === 1 ? "" : "s"}…`);
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
          if (error.status === 409) await onConflict();
          setSaveMessage(error.message || "Unable to change the selected segment tags.");
        } finally {
          setSavingSegmentId(null);
        }
        return;
      }
      if (selectedSegments.length !== 1 || !selectedSegment) return;
      if (tagId === selectedSegment.tagId) {
        closeTagEditing();
        return;
      }
      if (selectedSegment.itemId != null && lineage.data?.children?.length > 0) {
        setSavingSegmentId(selectedSegment.id);
        setSaveMessage("Checking lineage impact…");
        try {
          const preview = await requestJson(`/items/${selectedSegment.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: selectedSegment.revision, tagId }),
          });
          const destructive = preview.deletedItemIds.length > 0 || preview.removedEdgeIds.length > 0;
          if (destructive && !window.confirm(
            `Changing this tag removes ${preview.removedEdgeIds.length} lineage edge${preview.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${preview.deletedItemIds.length} derived segment${preview.deletedItemIds.length === 1 ? "" : "s"}. Continue?`,
          )) {
            setSaveMessage("Tag change canceled.");
            return;
          }
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
          closeTagEditing();
          setSaveMessage(destructive ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (error) {
          if (error.status === 409) {
            setSaveMessage("Lineage changed — loading the latest segments…");
            await onConflict();
          } else {
            setSaveMessage(error.message || "Unable to reconcile the lineage.");
          }
        } finally {
          setSavingSegmentId(null);
        }
        return;
      }
      await mutateSegment(selectedSegment, {
        startSec: selectedSegment.startSec,
        endSec: selectedSegment.endSec,
        tagId,
      });
      closeTagEditing();
    }

    async function moveToBin() {
      if (!canMoveSelectionToBin || !selectedSegment || savingSegmentId != null) return;
      const candidates = [...selectedSegments].sort((left, right) =>
        Number(left.nativeSegmentId ?? left.id) - Number(right.nativeSegmentId ?? right.id));
      const selectedIds = new Set(candidates.map((segment) => segment.id));
      const signature = candidates
        .map((segment) => `${segment.nativeSegmentId ?? segment.id}:${segment.updatedAt}`)
        .join("|");
      setSavingSegmentId(selectedSegment.id);
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
        const nextSegments = segments.filter((segment) => !selectedIds.has(segment.id));
        const nextSelection = nextSegmentAfterRemoval(allSwimlanes, selectedIds, selectedSegment.id);
        onDetailChange({ ...detail, segments: nextSegments }, video.id);
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
        setSavingSegmentId(null);
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
