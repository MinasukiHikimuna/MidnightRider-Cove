import { DEFAULT_EDITOR_LAYOUT, OPEN_SEGMENT_NAVIGATION_DURATION_SECONDS, PLAYHEAD_NAVIGATION_WINDOW_SECONDS, PLAYHEAD_ROUNDING_TOLERANCE_SECONDS, TIMELINE_END_MARGIN_PX } from "../../shared/constants.js";

export function validateSegmentTiming(startSec, endSec, duration) {
  if (!Number.isFinite(startSec) || (endSec != null && !Number.isFinite(endSec)))
    return { error: "Enter finite start and end times." };
  const hasDurationBound = Number.isFinite(duration) && duration > 0;
  if (startSec < 0 || (hasDurationBound && startSec > duration)
    || (endSec != null && (endSec < 0 || (hasDurationBound && endSec > duration))))
    return { error: "Timing must stay within the video." };
  if (endSec != null && endSec < startSec) return { error: "End time cannot be before start time." };
  return { startSec, endSec };
}

export function findUnreviewedSelection(lanes, selectedId, direction, global = false) {
  const laneIndex = lanes.findIndex((lane) => lane.markers.some((marker) => marker.segment.id === selectedId));
  if (laneIndex < 0) {
    if (!global) return null;
    const unreviewed = lanes.flatMap((lane) => lane.markers.map((marker) => marker.segment))
      .filter((segment) => segment.reviewState === "unreviewed");
    return direction < 0 ? unreviewed.at(-1) ?? null : unreviewed[0] ?? null;
  }

  const lane = lanes[laneIndex];
  const markerIndex = lane.markers.findIndex((marker) => marker.segment.id === selectedId);
  if (!global) {
    const candidates = direction < 0 ? lane.markers.slice(0, markerIndex).reverse() : lane.markers.slice(markerIndex + 1);
    return candidates.find((marker) => marker.segment.reviewState === "unreviewed")?.segment ?? null;
  }

  const ordered = lanes.flatMap((item) => item.markers.map((marker) => marker.segment));
  const selectedIndex = ordered.findIndex((segment) => segment.id === selectedId);
  const candidates = direction < 0 ? ordered.slice(0, selectedIndex).reverse() : ordered.slice(selectedIndex + 1);
  return candidates.find((segment) => segment.reviewState === "unreviewed") ?? null;
}

export function findSegmentNearPlayhead(lanes, currentTime, direction, selectedId = null) {
  const time = Number(currentTime);
  if (!Number.isFinite(time)) return null;
  const candidates = lanes.flatMap((lane, laneIndex) => lane.markers
    .filter(({ segment }) => {
      const start = Number(segment.startSec);
      const end = segment.endSec == null
        ? start + OPEN_SEGMENT_NAVIGATION_DURATION_SECONDS
        : Number(segment.endSec);
      return Number.isFinite(start) && Number.isFinite(end) && end >= start
        && start <= time + PLAYHEAD_NAVIGATION_WINDOW_SECONDS + PLAYHEAD_ROUNDING_TOLERANCE_SECONDS
        && end >= time - PLAYHEAD_NAVIGATION_WINDOW_SECONDS - PLAYHEAD_ROUNDING_TOLERANCE_SECONDS;
    })
    .map(({ segment }) => ({ segment, laneIndex })))
    .sort((left, right) => left.laneIndex - right.laneIndex
      || Math.abs(left.segment.startSec - time) - Math.abs(right.segment.startSec - time)
      || left.segment.id - right.segment.id);
  if (candidates.length === 0) return null;

  const selectedLaneIndex = lanes.findIndex((lane) => lane.markers.some((marker) => marker.segment.id === selectedId));
  if (selectedLaneIndex < 0) return direction < 0 ? candidates.at(-1).segment : candidates[0].segment;
  const otherLanes = candidates.filter((candidate) => candidate.laneIndex !== selectedLaneIndex);
  if (otherLanes.length === 0) return direction < 0 ? candidates.at(-1).segment : candidates[0].segment;
  if (direction < 0) {
    return otherLanes.findLast((candidate) => candidate.laneIndex < selectedLaneIndex)?.segment
      ?? otherLanes.at(-1).segment;
  }
  return otherLanes.find((candidate) => candidate.laneIndex > selectedLaneIndex)?.segment
    ?? otherLanes[0].segment;
}

export function clampTimelineZoom(value) {
  return Math.min(8, Math.max(1, Math.round(Number(value) * 4) / 4));
}

export function buildTimelineTicks(duration, count = 6) {
  if (!Number.isFinite(duration) || duration <= 0) return [0];
  const tickCount = Math.max(2, Math.floor(count));
  return Array.from({ length: tickCount }, (_, index) => duration * index / (tickCount - 1));
}

export function buildMinuteTimelineTicks(duration) {
  if (!Number.isFinite(duration) || duration <= 0) return [0];
  return Array.from({ length: Math.floor(duration / 60) + 1 }, (_, index) => index * 60);
}

export function calculateMinuteTimelineWidth(duration, zoom = 1, pixelsPerMinute = 48) {
  if (!Number.isFinite(duration) || duration <= 0) return Math.max(1, pixelsPerMinute);
  return Math.ceil(duration / 60) * Math.max(1, pixelsPerMinute) * Math.max(1, zoom);
}

export function calculateMinuteLabelStride(duration, trackWidth, zoom = 1, minimumSpacing = 48) {
  const minuteCount = Math.max(1, Math.ceil((Number(duration) || 0) / 60));
  const availableWidth = Math.max(1, Number(trackWidth) || 0) * Math.max(1, Number(zoom) || 1);
  return Math.max(1, Math.ceil(minuteCount * Math.max(1, minimumSpacing) / availableWidth));
}

export function timelineTickAlignment(index, count, percent = null) {
  if (index <= 0) return "translate-x-0";
  if (index >= count - 1 && (percent == null || percent >= 100)) return "translate-x-0";
  return "-translate-x-1/2";
}

export function timelineTickPosition(index, count, percent) {
  if (count <= 1) return { left: "0%" };
  return index >= count - 1 && percent >= 100 ? { right: "0" } : { left: `${percent}%` };
}

export function calculateCenteredTimelineScroll(currentTime, duration, contentWidth, viewportWidth, labelWidth = 160, endMargin = 0) {
  if (!(duration > 0) || !(contentWidth > viewportWidth)) return 0;
  const timelineWidth = Math.max(0, contentWidth - labelWidth - Math.max(0, Number(endMargin) || 0));
  const playheadPosition = labelWidth + Math.min(1, Math.max(0, currentTime / duration)) * timelineWidth;
  return Math.min(contentWidth - viewportWidth, Math.max(0, playheadPosition - viewportWidth / 2));
}

export function timelineTimePercent(time, duration) {
  const numericTime = Number(time);
  return duration > 0 && Number.isFinite(numericTime)
    ? Math.min(1, Math.max(0, numericTime / duration)) * 100
    : 0;
}

export function calculateTimelinePlayheadPosition(currentTime, duration, labelWidthRem = 10) {
  const percent = timelineTimePercent(currentTime, duration);
  const ratio = percent / 100;
  return {
    percent,
    labelOffsetRem: Math.max(0, Number(labelWidthRem) || 0) * (1 - ratio),
  };
}

export function timelinePlayheadHorizontalStyle(playhead, includesLabelGutter = false) {
  return {
    left: includesLabelGutter
      ? `calc(${playhead.labelOffsetRem}rem + ${playhead.percent}%)`
      : `${playhead.percent}%`,
    transform: "translateX(-50%)",
  };
}

export function timelineContentStyle(zoom, endMarginPx = TIMELINE_END_MARGIN_PX) {
  return {
    width: `${zoom * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(endMarginPx) || 0)}px`,
  };
}

export function clampTimelineRatio(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return DEFAULT_EDITOR_LAYOUT.timelineRatio;
  return Math.min(0.7, Math.max(0.25, numeric));
}

export function calculateEditorPanelMaximum(containerWidth, reservedWidth) {
  const available = Number(containerWidth) - Number(reservedWidth);
  return Math.min(560, Math.max(240, Number.isFinite(available) ? available : 560));
}

export function clampEditorPanelWidth(value, maximum = 560) {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_EDITOR_LAYOUT.detailWidth;
  return Math.min(calculateEditorPanelMaximum(maximum, 0), Math.max(240, value));
}

export function clampSwimlaneTitleWidth(value, maximum = 400) {
  if (typeof value !== "number" || !Number.isFinite(value)) return DEFAULT_EDITOR_LAYOUT.swimlaneTitleWidth;
  return Math.min(Math.max(160, maximum), Math.max(160, value));
}

export function calculateSwimlaneTitleMaximum(containerWidth) {
  if (!(containerWidth > 0)) return 400;
  return Math.min(400, Math.max(160, containerWidth - 320));
}

export function calculateTimelineRatioBounds(containerHeight) {
  const availableHeight = Math.max(1, Number(containerHeight) - 12);
  if (availableHeight < 480) return { minimum: DEFAULT_EDITOR_LAYOUT.timelineRatio, maximum: DEFAULT_EDITOR_LAYOUT.timelineRatio };
  const minimum = Math.max(0.25, 224 / availableHeight);
  const maximum = Math.min(0.7, 1 - 256 / availableHeight);
  return { minimum, maximum: Math.max(minimum, maximum) };
}

export function clampTimelineRatioForHeight(value, containerHeight) {
  const ratio = clampTimelineRatio(value);
  if (!(containerHeight > 0)) return ratio;
  const bounds = calculateTimelineRatioBounds(containerHeight);
  return Math.min(bounds.maximum, Math.max(bounds.minimum, ratio));
}

export function parseEditorLayout(raw) {
  if (!raw) return { ...DEFAULT_EDITOR_LAYOUT };
  try {
    const parsed = JSON.parse(raw);
    const storedRatio = parsed?.timelineRatio;
    return {
      timelineRatio: typeof storedRatio === "number" && Number.isFinite(storedRatio)
        ? clampTimelineRatio(storedRatio)
        : DEFAULT_EDITOR_LAYOUT.timelineRatio,
      markerRailOpen: typeof parsed?.markerRailOpen === "boolean" ? parsed.markerRailOpen : true,
      detailWidth: clampEditorPanelWidth(parsed?.detailWidth),
      markerRailWidth: clampEditorPanelWidth(parsed?.markerRailWidth),
      swimlaneTitleWidth: clampSwimlaneTitleWidth(parsed?.swimlaneTitleWidth),
    };
  } catch {
    return { ...DEFAULT_EDITOR_LAYOUT };
  }
}

export function calculateTimelineRatioFromPointer(clientY, containerTop, containerHeight) {
  if (!(containerHeight > 0)) return DEFAULT_EDITOR_LAYOUT.timelineRatio;
  return clampTimelineRatioForHeight((containerTop + containerHeight - clientY) / containerHeight, containerHeight);
}

export function calculateVerticalRevealOffset(markerTop, markerBottom, visibleTop, visibleBottom, margin = 2) {
  const inset = Math.max(0, Number(margin) || 0);
  if (markerTop < visibleTop + inset) return markerTop - visibleTop - inset;
  if (markerBottom > visibleBottom - inset) return markerBottom - visibleBottom + inset;
  return 0;
}

export function findSegmentFromPlayhead(segments, currentTime, direction, selectedId = null) {
  const ordered = [...segments].sort((left, right) => left.startSec - right.startSec || left.id - right.id);
  const selectedIndex = ordered.findIndex((segment) => segment.id === selectedId);
  const selectedStart = Number(ordered[selectedIndex]?.startSec);
  const numericCurrentTime = Number(currentTime);
  if (selectedIndex >= 0 && Number.isFinite(selectedStart) && Number.isFinite(numericCurrentTime)
      && Math.abs(selectedStart - numericCurrentTime) <= PLAYHEAD_ROUNDING_TOLERANCE_SECONDS) {
    return ordered[selectedIndex + (direction < 0 ? -1 : 1)] ?? null;
  }
  if (direction < 0) return ordered.findLast((segment) => segment.startSec < numericCurrentTime) ?? null;
  return ordered.find((segment) => segment.startSec > numericCurrentTime) ?? null;
}

export function isCurrentEditorRequest(requestId, currentRequestId, videoId, currentVideoId) {
  return requestId === currentRequestId && videoId === currentVideoId;
}
