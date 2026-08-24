import { SEGMENT_STUDIO_SHORTCUTS, findAdjacentShot, frameStepSeconds, shortcutAvailableInMode, shortcutRequiresSingleSegment } from "../model/shortcuts.js";
import { percentageSeekTime } from "../model/selection.js";
import { findAdjacentSegmentGroupKey, findSwimlaneRangeSelection, findSwimlaneSelection, toggleAllCollapsedSegmentGroups } from "../model/swimlanes.js";
import { clampTimelineZoom, findNearestSegmentInCurrentSwimlane, findSegmentFromPlayhead, findSegmentNearPlayhead, findUnreviewedSelection } from "../model/timeline.js";
import { readTimingClipboard, writeTimingClipboard } from "../model/layout.js";

function createShortcutHandler(context) {
  const { allSwimlanes, applyShortcutTiming, centerTimelineRef, compatibilityMode, createSegment, currentTime, deleteRejectedSegments, duplicateSegment, editorLayout, editorRef, emptyRecyclingBin, lineage, mediaDuration, mergeSelectedSwimlane, moveToBin, mutateShotBoundary, openPublishApprovedDialog, playbackControlsRef, playbackShortcutConfig, saveSelectedReviewState, seekRef, segmentGroupKeys, selectSegment, selectedSegment, selectedSegmentGroupForSegment, selectedSegmentGroupKey, selectedSegments, setCollapsedSegmentGroups, setIncorrectExamplesOpen, setQuickSearchOpen, setSaveMessage, setSelectedSegmentGroupKey, setTagEditing, setTimelineZoom, shotBoundaries, slotButtonRef, splitSegment, swimlanes, timelineDuration, toggleIncorrectExample, toggleSegmentGroup, updateTimelineRatio, videoFrameRate, visibleSegments } = context;

  function executeShortcut(shortcut, invocation) {
      if (selectedSegments.length > 1 && shortcutRequiresSingleSegment(shortcut.id)) {
        return;
      }
      let action = null;
      if (shortcut.id === "video.playPause") action = () => playbackControlsRef.current?.toggle();
      if (shortcut.id === "video.seekSmallBackward") action = () => playbackControlsRef.current?.seekBy(-playbackShortcutConfig.smallSeekTime);
      if (shortcut.id === "video.seekSmallForward") action = () => playbackControlsRef.current?.seekBy(playbackShortcutConfig.smallSeekTime);
      if (shortcut.id === "video.seekMediumBackward") action = () => playbackControlsRef.current?.seekBy(-playbackShortcutConfig.mediumSeekTime);
      if (shortcut.id === "video.seekMediumForward") action = () => playbackControlsRef.current?.seekBy(playbackShortcutConfig.mediumSeekTime);
      if (shortcut.id === "video.seekLongBackward") action = () => playbackControlsRef.current?.seekBy(-playbackShortcutConfig.longSeekTime);
      if (shortcut.id === "video.seekLongForward") action = () => playbackControlsRef.current?.seekBy(playbackShortcutConfig.longSeekTime);
      if (shortcut.id === "video.playSelected" && selectedSegment) action = () => {
        seekRef.current?.(selectedSegment.startSec, true);
        requestAnimationFrame(() => editorRef.current?.focus({ preventScroll: true }));
      };
      if (shortcut.id === "video.playPreviousSegment" || shortcut.id === "video.playNextSegment") action = () => {
        const target = findSwimlaneSelection(
          swimlanes,
          selectedSegment?.id,
          shortcut.id === "video.playPreviousSegment" ? "left" : "right",
        );
        if (!target || target.id === selectedSegment?.id) return;
        selectSegment(target, { focusEditor: true, seekToSegment: false });
        seekRef.current?.(target.startSec, true);
      };
      if (shortcut.id.startsWith("video.seekPercent")) action = () => {
        const digit = Number(shortcut.id.slice("video.seekPercent".length)) / 10;
        seekRef.current?.(percentageSeekTime(mediaDuration ?? timelineDuration, digit), false);
      };
      if (shortcut.id === "video.jumpToSegmentStart" && selectedSegment)
        action = () => seekRef.current?.(selectedSegment.startSec, false);
      if (shortcut.id === "video.jumpToSegmentEnd" && selectedSegment)
        action = () => seekRef.current?.(selectedSegment.endSec ?? selectedSegment.startSec, false);
      if (shortcut.id === "video.jumpToVideoStart") action = () => seekRef.current?.(0, false);
      if (shortcut.id === "video.jumpToVideoEnd") action = () => seekRef.current?.(timelineDuration, false);
      if (shortcut.id.startsWith("video.frame")) action = () => {
        const stepKind = shortcut.id.includes("Small") ? "small" : shortcut.id.includes("Medium") ? "medium" : "long";
        const frameCount = playbackShortcutConfig[`${stepKind}FrameStep`] * (shortcut.id.endsWith("Backward") ? -1 : 1);
        playbackControlsRef.current?.pause();
        playbackControlsRef.current?.seekBy(frameStepSeconds(frameCount, videoFrameRate));
      };
      if (shortcut.id.startsWith("navigation.swimlane")) action = () => {
        const direction = shortcut.id.slice("navigation.swimlane".length).toLowerCase();
        const target = findSwimlaneSelection(swimlanes, selectedSegment?.id, direction, currentTime);
        if (target) selectSegment(target, { focusEditor: true, seekToSegment: false });
      };
      if (shortcut.id === "navigation.extendSwimlaneLeft" || shortcut.id === "navigation.extendSwimlaneRight") action = () => {
        const range = findSwimlaneRangeSelection(
          allSwimlanes,
          selectedSegment?.id,
          shortcut.id.endsWith("Left") ? "left" : "right",
        );
        if (range) selectSegment(range.segment, {
          focusEditor: true,
          seekToSegment: false,
          rangeSegmentIds: range.segmentIds,
        });
      };
      if (shortcut.id === "navigation.segmentGroupUp" || shortcut.id === "navigation.segmentGroupDown") action = () => {
        const targetKey = findAdjacentSegmentGroupKey(
          segmentGroupKeys,
          selectedSegmentGroupKey ?? selectedSegmentGroupForSegment,
          shortcut.id.endsWith("Up") ? -1 : 1,
        );
        if (targetKey) setSelectedSegmentGroupKey(targetKey);
      };
      if (shortcut.id === "navigation.previousAtPlayhead" || shortcut.id === "navigation.nextAtPlayhead") action = () => {
        const target = findSegmentFromPlayhead(visibleSegments, currentTime, shortcut.id === "navigation.previousAtPlayhead" ? -1 : 1, selectedSegment?.id);
        if (target) selectSegment(target, { focusEditor: true, seekToSegment: false });
      };
      if (shortcut.id === "navigation.nearestInCurrentSwimlane") action = () => {
        const target = findNearestSegmentInCurrentSwimlane(
          swimlanes, selectedSegment?.id, currentTime);
        if (target) selectSegment(target, { focusEditor: true, seekToSegment: false });
      };
      if (shortcut.id.includes("Unreviewed")) action = () => {
        const target = findUnreviewedSelection(
          swimlanes,
          selectedSegment?.id,
          shortcut.id.startsWith("navigation.previous") ? -1 : 1,
          shortcut.id.endsWith("Global"),
        );
        if (target) selectSegment(target, { focusEditor: true, seekToSegment: false });
      };
      if (shortcut.id === "navigation.nextTouchingPlayhead" || shortcut.id === "navigation.previousTouchingPlayhead") action = () => {
        const target = findSegmentNearPlayhead(swimlanes, currentTime, shortcut.id === "navigation.previousTouchingPlayhead" ? -1 : 1, selectedSegment?.id);
        if (target) selectSegment(target, { focusEditor: true, seekToSegment: false });
      };
      if (shortcut.id === "navigation.quickSearch") action = () => setQuickSearchOpen(true);
      if (shortcut.id === "navigation.previousShot" || shortcut.id === "navigation.nextShot") action = () => {
        const shot = findAdjacentShot(shotBoundaries, currentTime, shortcut.id === "navigation.previousShot" ? -1 : 1);
        if (shot) seekRef.current?.(shot.startSec, false);
      };
      if (shortcut.id === "shot.split") action = () => mutateShotBoundary("split");
      if (shortcut.id === "shot.merge") action = () => mutateShotBoundary("merge");
      if (shortcut.id === "marker.create") action = () => createSegment();
      if (shortcut.id === "marker.duplicate") action = () => duplicateSegment(false);
      if (shortcut.id === "marker.duplicateAtPlayhead") action = () => duplicateSegment(true);
      if (shortcut.id === "marker.split") action = () => splitSegment();
      if (shortcut.id === "marker.editTag") action = () => {
        if (selectedSegments.length > 1 && selectedSegments.some((segment) => segment.isDerived)) {
          setSaveMessage("Derived segments cannot be retagged because their tags are set by derivation rules.");
          return;
        }
        if (lineage.data?.tagReadOnly) {
          setSaveMessage("This tag is read-only because it is set by a derivation rule.");
          return;
        }
        setTagEditing(true);
      };
      if (shortcut.id === "marker.setStart" && selectedSegment)
        action = () => applyShortcutTiming(currentTime, selectedSegment.endSec);
      if (shortcut.id === "marker.setEnd" && selectedSegment)
        action = () => applyShortcutTiming(selectedSegment.startSec, currentTime);
      if (shortcut.id === "marker.copyTiming" && selectedSegment) action = () => {
        setSaveMessage(writeTimingClipboard(selectedSegment) ? "Segment timing copied." : "Unable to copy segment timing.");
      };
      if (shortcut.id === "marker.pasteTiming" && selectedSegment) action = () => {
        const timing = readTimingClipboard();
        if (!timing) {
          setSaveMessage("No copied segment timing is available.");
          return;
        }
        applyShortcutTiming(timing.startSec, timing.endSec);
      };
      if (shortcut.id === "marker.mergeSelection") action = () => mergeSelectedSwimlane();
      if (shortcut.id === "marker.moveToBin") action = () => moveToBin();
      if (shortcut.id === "marker.toggleIncorrectExample" && selectedSegment) action = () => toggleIncorrectExample();
      if (shortcut.id === "marker.openIncorrectExamples") action = () => setIncorrectExamplesOpen(true);
      if (shortcut.id === "markerGroup.toggleCollapse" && selectedSegmentGroupKey)
        action = () => toggleSegmentGroup(selectedSegmentGroupKey);
      if (shortcut.id === "markerGroup.toggleAll")
        action = () => setCollapsedSegmentGroups((current) =>
          toggleAllCollapsedSegmentGroups(current, segmentGroupKeys));
      if (shortcut.id === "marker.assignSlots") action = () => slotButtonRef.current?.click();
      if (shortcut.id === "navigation.zoomIn") action = () => setTimelineZoom((value) => clampTimelineZoom(value + 0.5));
      if (shortcut.id === "navigation.zoomOut") action = () => setTimelineZoom((value) => clampTimelineZoom(value - 0.5));
      if (shortcut.id === "navigation.resetZoom") action = () => setTimelineZoom(1);
      if (shortcut.id === "navigation.centerPlayhead") action = () => centerTimelineRef.current?.();
      if (shortcut.id === "layout.growSwimlanes") action = () => updateTimelineRatio(editorLayout.timelineRatio + 0.05);
      if (shortcut.id === "layout.shrinkSwimlanes") action = () => updateTimelineRatio(editorLayout.timelineRatio - 0.05);
      if (shortcut.id === "marker.confirm" && selectedSegment) action = () => saveSelectedReviewState("approved");
      if (shortcut.id === "system.publishApproved") action = () => openPublishApprovedDialog(invocation.target);
      if (shortcut.id === "marker.reject" && selectedSegment) action = () => saveSelectedReviewState("rejected");
      if (shortcut.id === "system.emptyBin") action = () => emptyRecyclingBin();
      if (shortcut.id === "system.deleteRejected") action = () => deleteRejectedSegments();
      if (!action) return;
      action();
    }

  function executeShortcutById(shortcutId, invocation) {
    const shortcut = SEGMENT_STUDIO_SHORTCUTS.find((candidate) => candidate.id === shortcutId);
    if (shortcut && shortcutAvailableInMode(shortcut, compatibilityMode)) executeShortcut(shortcut, invocation);
  }

  return { executeShortcutById };
}

export { createShortcutHandler };
