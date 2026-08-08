import { findSegmentByStableIdentity, shotBoundaryFingerprint } from "../model/shortcuts.js";
import { completeOperation, operationIdFor, requestJson } from "../../shared/api.js";
import { historyActionsForTarget } from "../model/history.js";
import { calculateEditorPanelMaximum, calculateTimelineRatioBounds, calculateTimelineRatioFromPointer, clampEditorPanelWidth, clampTimelineRatioForHeight } from "../model/timeline.js";
import { DEFAULT_EDITOR_LAYOUT } from "../../shared/constants.js";
import { normalizeCollapsedSegmentGroups } from "../model/swimlanes.js";

function createHistoryAndLayoutActions(context) {
  const { acceptHistory, compatibilityMode, currentTime, detail, editorLayout, focusRowRef, history, historyRef, historySaving, horizontalLayoutSize, mediaStackHeight, mediaStackRef, onDetailChange, onReload, railToggleRef, recordHistoryAction, savingSegmentId, savingShot, savingShotRef, setCollapsedSegmentGroups, setEditorLayout, setHistorySaving, setSaveMessage, setSavingSegmentId, setSavingShot, shotBoundaries, timelineDuration, video, workspaceRef } = context;

  async function applySegmentHistoryState(targetState, sourceState, loaded) {
      const targets = targetState.type === "segment" ? [targetState] : targetState.segments || [];
      const sources = sourceState?.type === "segment" ? [sourceState] : sourceState?.segments || [];
      let currentDetail = loaded;
      for (const [index, target] of targets.entries()) {
        const source = sources[index];
        const targetWantsNative = target.identity?.nativeSegmentId != null
          || target.identity?.published === true;
        const sourceBinItemId =
          source?.identity?.recycleBinItemId ?? source?.identity?.itemId;
        let current = findSegmentByStableIdentity(currentDetail.segments, source?.identity)
          || findSegmentByStableIdentity(currentDetail.segments, target.identity);
        if (!current
            && targetWantsNative
            && sourceBinItemId != null
            && source.identity.revision != null) {
          const operationKey = `history-restore:${video.id}:${sourceBinItemId}:${source.identity.revision}`;
          await requestJson(`/bin/${sourceBinItemId}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              expectedRevision: source.identity.revision,
            }),
          });
          completeOperation(operationKey);
          currentDetail = await onReload();
          current = currentDetail.segments.find((candidate) =>
            candidate.tagId === target.values.tagId
            && candidate.startSec === target.values.startSec
            && candidate.endSec === target.values.endSec);
        }
        if (!current)
          throw new Error("A segment in this history state no longer exists.");
        const currentIsNative = current.nativeSegmentId != null
          || current.published === true;
        if (currentIsNative !== targetWantsNative) {
          if (targetWantsNative) {
            const currentBinItemId =
              current.recycleBinItemId ?? current.itemId ?? sourceBinItemId;
            if (currentBinItemId == null)
              throw new Error("This recycled segment can no longer be restored.");
            const operationKey = `history-restore:${video.id}:${currentBinItemId}:${current.revision}:${target.values.reviewState ?? "native"}`;
            await requestJson(`/bin/${currentBinItemId}/restore`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                expectedRevision: current.revision,
              }),
            });
            completeOperation(operationKey);
          } else {
            const operationKey = `history-bin:${video.id}:${current.nativeSegmentId}:${current.updatedAt}:${target.values.reviewState}`;
            await requestJson(`/videos/${video.id}/segments/${current.nativeSegmentId}/move-to-bin`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: operationIdFor(operationKey),
                expectedUpdatedAt: current.updatedAt,
                reviewState: target.values.reviewState,
              }),
            });
            completeOperation(operationKey);
          }
          currentDetail = await onReload();
          if (!targetWantsNative)
            continue;
          current = findSegmentByStableIdentity(currentDetail.segments, target.identity)
            || currentDetail.segments.find((candidate) =>
              candidate.tagId === target.values.tagId
              && candidate.startSec === target.values.startSec
              && candidate.endSec === target.values.endSec);
          if (!current)
            throw new Error("The restored segment could not be found.");
        }
        const values = target.values;
        if (current.nativeSegmentId == null && current.itemId != null) {
          const operationKey = `history-draft-update:${video.id}:${current.itemId}:${current.revision}:${values.tagId}:${values.startSec}:${values.endSec ?? "open"}:${values.reviewState}`;
          await requestJson(`/videos/${video.id}/drafts/${current.itemId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: operationIdFor(operationKey),
              expectedRevision: current.revision,
              ...values,
            }),
          });
          completeOperation(operationKey);
        } else {
          await requestJson(`/videos/${video.id}/segments/${current.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, expectedUpdatedAt: current.updatedAt }),
          });
        }
        currentDetail = await onReload();
      }
      return currentDetail;
    }

    async function applyPerformerSlotHistoryState(state, loaded) {
      for (const target of state.targets || []) {
        const segment = findSegmentByStableIdentity(loaded.segments, target.identity);
        if (!segment)
          throw new Error("A segment in this performer-assignment history no longer exists.");
        const revision = loaded.performerSlotRevisions?.[segment.id];
        await requestJson(segment.published
          ? `/videos/${video.id}/segments/${segment.nativeSegmentId}/slots`
          : `/videos/${video.id}/drafts/${segment.itemId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision,
            assignments: target.assignments,
          }),
        });
        loaded = await onReload();
      }
      return loaded;
    }

    async function applyHistoryState(
      step,
      loaded,
      pendingOperationKeys = [],
    ) {
      const state = step.state;
      if (!compatibilityMode
          && (state?.type === "segment" || state?.type === "segments")) {
        const operationKey =
          `basic-history:${video.id}:${historyRef.current.revision}:${step.action.sequence}:${step.direction}`;
        const restored = await requestJson(`/videos/${video.id}/history/native-state`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: operationIdFor(operationKey),
            expectedHistoryRevision: historyRef.current.revision,
            actionSequence: step.action.sequence,
            direction: step.direction,
          }),
        });
        acceptHistory(restored.history);
        pendingOperationKeys.push(operationKey);
        return onReload();
      }
      const sourceState = step.direction === "backward"
        ? step.action.afterState
        : step.action.beforeState;
      if (state?.type === "composite") {
        let current = loaded;
        const sourceStates = sourceState?.type === "composite"
          ? sourceState.states || []
          : [];
        for (const [index, childState] of (state.states || []).entries()) {
          const sourceChild = sourceStates[index];
          current = await applyHistoryState({
            ...step,
            state: childState,
            action: {
              ...step.action,
              beforeState: step.direction === "backward"
                ? childState
                : sourceChild,
              afterState: step.direction === "backward"
                ? sourceChild
                : childState,
            },
          }, current, pendingOperationKeys);
        }
        return current;
      }
      if (state?.type === "segment" || state?.type === "segments")
        return applySegmentHistoryState(
          state,
          sourceState,
          loaded,
        );
      if (state?.type === "performerSlots")
        return applyPerformerSlotHistoryState(state, loaded);
      if (state?.type === "shots") {
        const currentFingerprint = shotBoundaryFingerprint(loaded.shotBoundaries || []);
        const updated = await requestJson(`/videos/${video.id}/shot-boundaries/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: operationIdFor(`history-shots:${video.id}:${currentFingerprint}:${state.fingerprint}`),
            expectedFingerprint: currentFingerprint,
            boundaries: state.boundaries,
          }),
        });
        return { ...loaded, shotBoundaries: updated };
      }
      throw new Error("This history action cannot be restored.");
    }

    async function restoreHistoryTarget(targetSequence) {
      if (historySaving || savingSegmentId != null || savingShot
          || targetSequence === history.cursorSequence)
        return;
      const steps = historyActionsForTarget(history, targetSequence);
      if (steps.length === 0) return;
      setHistorySaving(true);
      setSavingSegmentId(-1);
      setSaveMessage(`Restoring ${steps.length} history ${steps.length === 1 ? "action" : "actions"}…`);
      try {
        let loaded = detail;
        const pendingOperationKeys = [];
        for (const step of steps)
          loaded = await applyHistoryState(
            step,
            loaded,
            pendingOperationKeys,
          );
        const next = compatibilityMode
          ? await requestJson(`/videos/${video.id}/history/cursor`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: crypto.randomUUID(),
              expectedRevision: historyRef.current.revision,
              targetSequence,
            }),
          })
          : historyRef.current;
        pendingOperationKeys.forEach(completeOperation);
        acceptHistory(next);
        await onReload();
        setSaveMessage("History restored.");
      } catch (error) {
        if (error.status === 409 && error.payload?.current)
          acceptHistory(error.payload.current);
        await onReload();
        setSaveMessage(error.message || "Unable to restore editor history.");
      } finally {
        setSavingSegmentId(null);
        setHistorySaving(false);
      }
    }

    function updateTimelineRatio(timelineRatio) {
      setEditorLayout((layout) => ({ ...layout, timelineRatio: clampTimelineRatioForHeight(timelineRatio, mediaStackHeight) }));
    }

    function updateTimelineRatioFromPointer(event) {
      const bounds = mediaStackRef.current?.getBoundingClientRect();
      if (!bounds) return;
      updateTimelineRatio(calculateTimelineRatioFromPointer(event.clientY, bounds.top, bounds.height));
    }

    function handleSeparatorPointerDown(event) {
      event.currentTarget.setPointerCapture(event.pointerId);
      updateTimelineRatioFromPointer(event);
    }

    function handleSeparatorPointerMove(event) {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) updateTimelineRatioFromPointer(event);
    }

    function handleSeparatorKeyDown(event) {
      const step = event.shiftKey ? 0.1 : 0.05;
      let nextRatio = null;
      if (event.key === "ArrowUp") nextRatio = editorLayout.timelineRatio + step;
      if (event.key === "ArrowDown") nextRatio = editorLayout.timelineRatio - step;
      const bounds = calculateTimelineRatioBounds(mediaStackHeight);
      if (event.key === "Home") nextRatio = bounds.minimum;
      if (event.key === "End") nextRatio = bounds.maximum;
      if (nextRatio == null) return;
      event.preventDefault();
      event.stopPropagation();
      updateTimelineRatio(nextRatio);
    }

    function panelWidthMaximum(key) {
      const containerWidth = key === "detailWidth" ? horizontalLayoutSize.focusRow : horizontalLayoutSize.workspace;
      const railMaximum = horizontalLayoutSize.workspace > 0
        ? calculateEditorPanelMaximum(horizontalLayoutSize.workspace, 600)
        : 560;
      const effectiveRailWidth = clampEditorPanelWidth(editorLayout.markerRailWidth, railMaximum);
      const reservedWidth = key === "detailWidth"
        ? 344 + (editorLayout.markerRailOpen ? effectiveRailWidth + 24 : 0)
        : 600;
      return containerWidth > 0 ? calculateEditorPanelMaximum(containerWidth, reservedWidth) : 560;
    }

    function updatePanelWidth(key, width) {
      setEditorLayout((layout) => ({ ...layout, [key]: clampEditorPanelWidth(width, panelWidthMaximum(key)) }));
    }

    function handlePanelSeparatorPointer(event, key) {
      const bounds = key === "detailWidth"
        ? focusRowRef.current?.getBoundingClientRect()
        : workspaceRef.current?.getBoundingClientRect();
      if (!bounds) return;
      updatePanelWidth(key, key === "detailWidth" ? event.clientX - bounds.left : bounds.right - event.clientX);
    }

    function panelSeparatorProps(key, label) {
      const maximum = panelWidthMaximum(key);
      const width = clampEditorPanelWidth(editorLayout[key], maximum);
      return {
        role: "separator",
        tabIndex: 0,
        "aria-label": label,
        "aria-orientation": "vertical",
        "aria-valuemin": 240,
        "aria-valuemax": Math.round(maximum),
        "aria-valuenow": Math.round(width),
        "aria-valuetext": `${Math.round(width)} pixels wide`,
        title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
        onPointerDown: (event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          handlePanelSeparatorPointer(event, key);
        },
        onPointerMove: (event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) handlePanelSeparatorPointer(event, key);
        },
        onKeyDown: (event) => {
          const step = event.shiftKey ? 40 : 16;
          let delta = null;
          if (event.key === "ArrowLeft") delta = key === "detailWidth" ? -step : step;
          if (event.key === "ArrowRight") delta = key === "detailWidth" ? step : -step;
          let nextWidth = delta == null ? null : width + delta;
          if (event.key === "Home") nextWidth = 240;
          if (event.key === "End") nextWidth = maximum;
          if (nextWidth == null) return;
          event.preventDefault();
          event.stopPropagation();
          updatePanelWidth(key, nextWidth);
        },
        onDoubleClick: () => updatePanelWidth(key, DEFAULT_EDITOR_LAYOUT[key]),
        className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
        style: { touchAction: "none", cursor: "col-resize" },
      };
    }

    function toggleSegmentRail() {
      setEditorLayout((layout) => ({ ...layout, markerRailOpen: !layout.markerRailOpen }));
      requestAnimationFrame(() => railToggleRef.current?.focus({ preventScroll: true }));
    }

    function toggleSegmentGroup(groupKey) {
      setCollapsedSegmentGroups((current) => current.includes(groupKey)
        ? current.filter((key) => key !== groupKey)
        : normalizeCollapsedSegmentGroups([...current, groupKey]));
    }

    async function mutateShotBoundary(kind, recordHistory = true, timeSec = currentTime) {
      if (savingShotRef.current) return null;
      const duration = Number(video.videoFile?.duration) || timelineDuration;
      const shotRevision = shotBoundaryFingerprint(shotBoundaries);
      const operationKey = `shot-${kind}:${video.id}:${timeSec.toFixed(3)}:${duration.toFixed(3)}:${shotRevision}`;
      savingShotRef.current = true;
      setSavingShot(true);
      setSaveMessage(kind === "split" ? "Adding shot boundary…" : "Merging shots…");
      try {
        const updated = await requestJson(`/videos/${video.id}/shot-boundaries/${kind}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(kind === "split"
            ? { operationId: operationIdFor(operationKey), timeSec }
            : { operationId: operationIdFor(operationKey), timeSec }),
        });
        completeOperation(operationKey);
        onDetailChange((current) => ({ ...current, shotBoundaries: updated }), video.id);
        if (recordHistory)
          await recordHistoryAction(
            "shots.update",
            kind === "split" ? "Added shot boundary" : "Merged shots",
            {
              type: "shots",
              boundaries: shotBoundaries,
              fingerprint: shotRevision,
            },
            {
              type: "shots",
              boundaries: updated,
              fingerprint: shotBoundaryFingerprint(updated),
            },
          );
        setSaveMessage(kind === "split" ? "Shot boundary added." : "Shots merged.");
        return updated;
      } catch (error) {
        setSaveMessage(error.message || "Unable to edit shot boundaries.");
        return null;
      } finally {
        savingShotRef.current = false;
        setSavingShot(false);
      }
    }

    async function restoreShotBoundaries(entry) {
      if (savingShotRef.current) return null;
      const operationKey = `shot-restore:${video.id}:${entry.afterFingerprint}`;
      savingShotRef.current = true;
      setSavingShot(true);
      setSaveMessage("Undoing shot edit…");
      try {
        const updated = await requestJson(`/videos/${video.id}/shot-boundaries/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: operationIdFor(operationKey),
            expectedFingerprint: entry.afterFingerprint,
            boundaries: entry.before,
          }),
        });
        completeOperation(operationKey);
        onDetailChange((current) => ({ ...current, shotBoundaries: updated }), video.id);
        return updated;
      } catch (error) {
        setSaveMessage(error.message || "Unable to undo the shot edit.");
        return null;
      } finally {
        savingShotRef.current = false;
        setSavingShot(false);
      }
    }

  return { applySegmentHistoryState, applyPerformerSlotHistoryState, applyHistoryState, restoreHistoryTarget, updateTimelineRatio, updateTimelineRatioFromPointer, handleSeparatorPointerDown, handleSeparatorPointerMove, handleSeparatorKeyDown, panelWidthMaximum, updatePanelWidth, handlePanelSeparatorPointer, panelSeparatorProps, toggleSegmentRail, toggleSegmentGroup, mutateShotBoundary, restoreShotBoundaries };
}

export { createHistoryAndLayoutActions };
