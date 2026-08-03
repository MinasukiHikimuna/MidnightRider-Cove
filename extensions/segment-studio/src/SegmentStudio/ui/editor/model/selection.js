import { HIDE_DERIVED_SEGMENTS_STORAGE_KEY, MERGE_CONFIRMATION_STORAGE_KEY, REVIEW_STATES } from "../../shared/constants.js";

export const CLEARED_SEGMENT_SELECTION_ID = "__segment-studio-cleared-selection__";

export function parseHideDerivedSegmentsPreference(value) {
  return value === "true";
}

export function parseMergeConfirmationPreference(value) {
  return value !== "false";
}

function readMergeConfirmationPreference() {
  try {
    return parseMergeConfirmationPreference(window.localStorage.getItem(MERGE_CONFIRMATION_STORAGE_KEY));
  } catch {
    return true;
  }
}

function writeMergeConfirmationPreference(value) {
  try {
    window.localStorage.setItem(MERGE_CONFIRMATION_STORAGE_KEY, String(Boolean(value)));
  } catch {
    // Confirmation remains enabled when browser storage is unavailable.
  }
}

export function filterDerivedSegments(segments, hideDerivedSegments) {
  return hideDerivedSegments ? segments.filter((segment) => !segment.isDerived) : segments;
}

export function normalizeEditorSegmentFilters(filters = {}) {
  const reviewStates = REVIEW_STATES.filter((state) =>
    Array.isArray(filters.reviewStates) ? filters.reviewStates.includes(state) : true);
  const performerId = Number(filters.performerId);
  const tagId = Number(filters.tagId);
  const parsedSegmentGroupId = Number(filters.segmentGroupId);
  const segmentGroupId = filters.segmentGroupId === "ungrouped"
    ? "ungrouped"
    : parsedSegmentGroupId > 0
      ? parsedSegmentGroupId
      : null;
  const sourceKey = String(filters.sourceKey || "").trim() || null;
  const normalizeConfidence = (value, fallback) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? Math.min(1, Math.max(0, numeric)) : fallback;
  };
  const firstConfidence = normalizeConfidence(filters.confidenceMin, 0);
  const secondConfidence = normalizeConfidence(filters.confidenceMax, 1);
  return {
    reviewStates,
    performerId: performerId > 0 ? performerId : null,
    tagId: tagId > 0 ? tagId : null,
    segmentGroupId,
    sourceKey,
    confidenceMin: Math.min(firstConfidence, secondConfidence),
    confidenceMax: Math.max(firstConfidence, secondConfidence),
    includeUnscored: filters.includeUnscored !== false,
  };
}

export function filterEditorSegments(
  segments,
  performerSlots,
  filters,
  hideDerivedSegments = false,
  segmentGroups = [],
) {
  const normalized = normalizeEditorSegmentFilters(filters);
  const performerSegmentIds = normalized.performerId == null
    ? null
    : new Set((performerSlots || [])
      .filter((slot) => Number(slot.performerId) === normalized.performerId)
      .map((slot) => slot.segmentId));
  const groupedTagIds = new Set((segmentGroups || [])
    .flatMap((group) => group.tags || [])
    .map((tag) => Number(tag.tagId)));
  const segmentGroupTagIds = normalized.segmentGroupId == null
    ? null
    : normalized.segmentGroupId === "ungrouped"
      ? null
      : new Set((segmentGroups || [])
        .find((group) => Number(group.id) === normalized.segmentGroupId)
        ?.tags?.map((tag) => Number(tag.tagId)) || []);
  return filterDerivedSegments(segments || [], hideDerivedSegments).filter((segment) => {
    if (segment.reviewState != null
        && !normalized.reviewStates.includes(segment.reviewState))
      return false;
    if (performerSegmentIds && !performerSegmentIds.has(segment.id)) return false;
    if (normalized.tagId != null
        && Number(segment.tagId) !== normalized.tagId)
      return false;
    if (segmentGroupTagIds && !segmentGroupTagIds.has(Number(segment.tagId)))
      return false;
    if (normalized.segmentGroupId === "ungrouped"
        && groupedTagIds.has(Number(segment.tagId)))
      return false;
    if (normalized.sourceKey != null && segment.sourceKey !== normalized.sourceKey) return false;
    const confidence = Number(segment.confidence);
    if (segment.confidence == null || !Number.isFinite(confidence))
      return normalized.includeUnscored;
    return confidence >= normalized.confidenceMin
      && confidence <= normalized.confidenceMax;
  });
}

export function editorVisibilityIncludingSegment(
  segment,
  performerSlots,
  filters,
  hideDerivedSegments = false,
  segmentGroups = [],
) {
  const normalized = normalizeEditorSegmentFilters(filters);
  if (!segment) return { filters: normalized, hideDerivedSegments };
  if (!normalized.reviewStates.includes(segment.reviewState))
    normalized.reviewStates = normalizeEditorSegmentFilters({
      ...normalized,
      reviewStates: [...normalized.reviewStates, segment.reviewState],
    }).reviewStates;
  if (normalized.performerId != null && !(performerSlots || []).some((slot) =>
    slot.segmentId === segment.id && Number(slot.performerId) === normalized.performerId))
    normalized.performerId = null;
  if (normalized.tagId != null && Number(segment.tagId) !== normalized.tagId)
    normalized.tagId = null;
  if (normalized.segmentGroupId != null) {
    const groupedTagIds = new Set((segmentGroups || [])
      .flatMap((group) => group.tags || [])
      .map((tag) => Number(tag.tagId)));
    if (normalized.segmentGroupId === "ungrouped") {
      if (groupedTagIds.has(Number(segment.tagId)))
        normalized.segmentGroupId = null;
    } else {
      const selectedGroup = (segmentGroups || []).find((group) =>
        Number(group.id) === normalized.segmentGroupId);
      if (!selectedGroup?.tags?.some((tag) =>
        Number(tag.tagId) === Number(segment.tagId)))
        normalized.segmentGroupId = null;
    }
  }
  if (normalized.sourceKey != null && segment.sourceKey !== normalized.sourceKey)
    normalized.sourceKey = null;
  const confidence = Number(segment.confidence);
  if (segment.confidence != null && Number.isFinite(confidence)) {
    normalized.confidenceMin = Math.min(normalized.confidenceMin, Math.floor(confidence * 100) / 100);
    normalized.confidenceMax = Math.max(normalized.confidenceMax, Math.ceil(confidence * 100) / 100);
  }
  if (segment.confidence == null || !Number.isFinite(confidence))
    normalized.includeUnscored = true;
  return {
    filters: normalizeEditorSegmentFilters(normalized),
    hideDerivedSegments: hideDerivedSegments && !segment.isDerived,
  };
}

export function activeEditorFilterCount(filters, hideDerivedSegments = false) {
  const normalized = normalizeEditorSegmentFilters(filters);
  return Number(normalized.reviewStates.length !== REVIEW_STATES.length)
    + Number(normalized.performerId != null)
    + Number(normalized.tagId != null)
    + Number(normalized.segmentGroupId != null)
    + Number(normalized.sourceKey != null)
    + Number(normalized.confidenceMin > 0 || normalized.confidenceMax < 1)
    + Number(!normalized.includeUnscored)
    + Number(hideDerivedSegments);
}

export function dualRangeValueFromPointer(clientX, trackLeft, trackWidth) {
  const pointer = Number(clientX);
  const left = Number(trackLeft);
  const width = Number(trackWidth);
  if (!Number.isFinite(pointer) || !Number.isFinite(left) || !(width > 0)) return 0;
  return Math.round(Math.min(1, Math.max(0, (pointer - left) / width)) * 100) / 100;
}

export function updateDualRangeValues(minimum, maximum, kind, value) {
  const boundedValue = Math.round(Math.min(1, Math.max(0, Number(value))) * 100) / 100;
  if (kind === "minimum") {
    const nextMinimum = Math.min(boundedValue, maximum);
    return {
      minimum: nextMinimum,
      maximum,
      coincidentTop: nextMinimum === maximum ? "maximum" : "minimum",
    };
  }
  const nextMaximum = Math.max(boundedValue, minimum);
  return {
    minimum,
    maximum: nextMaximum,
    coincidentTop: nextMaximum === minimum ? "minimum" : "maximum",
  };
}

export function resolveVisibleSelectedSegment(segments, selectedSegmentId) {
  if (selectedSegmentId === CLEARED_SEGMENT_SELECTION_ID) return null;
  return segments.find((segment) => segment.id === selectedSegmentId) || segments[0] || null;
}

export function reconcileFilteredSelectedSegmentId(allSegments, visibleSegments, selectedSegmentId) {
  if (selectedSegmentId == null || !allSegments.some((segment) => segment.id === selectedSegmentId))
    return selectedSegmentId;
  if (visibleSegments.some((segment) => segment.id === selectedSegmentId))
    return selectedSegmentId;
  return visibleSegments[0]?.id ?? null;
}

export function updateSegmentSelection(selectedSegmentIds, activeSegmentId, targetSegmentId, additive = false) {
  const current = [...new Set((selectedSegmentIds || []).filter((id) => id != null))];
  if (!additive) return { selectedSegmentIds: [targetSegmentId], activeSegmentId: targetSegmentId };
  if (!current.includes(targetSegmentId))
    return { selectedSegmentIds: [...current, targetSegmentId], activeSegmentId: targetSegmentId };
  const remaining = current.filter((id) => id !== targetSegmentId);
  if (remaining.length === 0)
    return { selectedSegmentIds: current, activeSegmentId };
  return {
    selectedSegmentIds: remaining,
    activeSegmentId: targetSegmentId === activeSegmentId
      ? remaining.at(-1) ?? null
      : activeSegmentId,
  };
}

export function updateSegmentCollectionSelection(selectedSegmentIds, activeSegmentId, targetSegmentIds) {
  const current = [...new Set((selectedSegmentIds || []).filter((id) => id != null))];
  const targets = [...new Set((targetSegmentIds || []).filter((id) => id != null))];
  if (targets.length === 0)
    return { selectedSegmentIds: current, activeSegmentId };
  const targetSet = new Set(targets);
  if (targets.every((id) => current.includes(id))) {
    const remaining = current.filter((id) => !targetSet.has(id));
    return remaining.length === 0
      ? { selectedSegmentIds: current, activeSegmentId }
      : {
          selectedSegmentIds: remaining,
          activeSegmentId: targetSet.has(activeSegmentId) ? remaining.at(-1) : activeSegmentId,
        };
  }
  return {
    selectedSegmentIds: [...new Set([...current, ...targets])],
    activeSegmentId: targets[0],
  };
}

export function updateSegmentRangeSelection(
  selectedSegmentIds,
  activeSegmentId,
  targetSegmentId,
  rangeSegmentIds,
  additive = false,
) {
  const laneIds = [...new Set((rangeSegmentIds || []).filter((id) => id != null))];
  const anchorIndex = laneIds.indexOf(activeSegmentId);
  const targetIndex = laneIds.indexOf(targetSegmentId);
  if (anchorIndex < 0 || targetIndex < 0)
    return updateSegmentSelection(selectedSegmentIds, activeSegmentId, targetSegmentId, additive);
  const range = laneIds.slice(Math.min(anchorIndex, targetIndex), Math.max(anchorIndex, targetIndex) + 1);
  return {
    selectedSegmentIds: additive
      ? [...new Set([...(selectedSegmentIds || []), ...range])]
      : range,
    activeSegmentId: targetSegmentId,
  };
}

export function updateAnchoredSegmentSelection(
  selection,
  targetSegmentId,
  rangeSegmentIds = null,
  additive = false,
) {
  const selectedSegmentIds = selection?.selectedSegmentIds || [];
  const activeSegmentId = selection?.activeSegmentId ?? null;
  const anchorSegmentId = selection?.anchorSegmentId ?? activeSegmentId;
  const rangeBaseSegmentIds = selection?.rangeBaseSegmentIds || [];
  if (rangeSegmentIds) {
    const laneIds = [...new Set(rangeSegmentIds)];
    if (!laneIds.includes(anchorSegmentId) || !laneIds.includes(targetSegmentId)) {
      return {
        selectedSegmentIds: [targetSegmentId],
        activeSegmentId: targetSegmentId,
        anchorSegmentId: targetSegmentId,
        rangeBaseSegmentIds: [],
      };
    }
    const base = additive
      ? [...new Set([...rangeBaseSegmentIds, ...selectedSegmentIds])]
      : rangeBaseSegmentIds;
    const next = updateSegmentRangeSelection(base, anchorSegmentId, targetSegmentId, laneIds, true);
    return {
      ...next,
      anchorSegmentId,
      rangeBaseSegmentIds: base,
    };
  }

  const next = updateSegmentSelection(selectedSegmentIds, activeSegmentId, targetSegmentId, additive);
  if (!additive) {
    return {
      ...next,
      anchorSegmentId: targetSegmentId,
      rangeBaseSegmentIds: [],
    };
  }
  const nextAnchorSegmentId = next.selectedSegmentIds.includes(targetSegmentId)
    ? targetSegmentId
    : next.activeSegmentId;
  return {
    ...next,
    anchorSegmentId: nextAnchorSegmentId,
    rangeBaseSegmentIds: next.selectedSegmentIds.filter((id) => id !== nextAnchorSegmentId),
  };
}

export function reconcileSelectedSegmentIds(selectedSegmentIds, availableSegmentIds, activeSegmentId) {
  const orderedAvailable = [...new Set((availableSegmentIds || []).filter((id) => id != null))];
  const available = new Set(orderedAvailable);
  const reconciled = [...new Set((selectedSegmentIds || []).filter((id) => available.has(id)))];
  if (activeSegmentId != null && available.has(activeSegmentId) && !reconciled.includes(activeSegmentId))
    reconciled.push(activeSegmentId);
  if (reconciled.length === 0 && (selectedSegmentIds || []).length > 0 && orderedAvailable.length > 0)
    reconciled.push(orderedAvailable[0]);
  return reconciled;
}

export function selectAllVideoSegmentIds(segments) {
  return [...new Set((segments || []).map((segment) => segment.id).filter((id) => id != null))];
}

function segmentTimelineDistance(reference, candidate) {
  const referenceStart = Number(reference?.startSec) || 0;
  const referenceEnd = Math.max(referenceStart, Number(reference?.endSec ?? referenceStart) || referenceStart);
  const candidateStart = Number(candidate?.startSec) || 0;
  const candidateEnd = Math.max(candidateStart, Number(candidate?.endSec ?? candidateStart) || candidateStart);
  if (candidateEnd < referenceStart) return referenceStart - candidateEnd;
  if (candidateStart > referenceEnd) return candidateStart - referenceEnd;
  return 0;
}

function closestSegmentOnTimeline(markers, reference, removedIds) {
  return (markers || [])
    .map((marker) => marker.segment)
    .filter((segment) => segment && !removedIds.has(segment.id))
    .sort((left, right) =>
      segmentTimelineDistance(reference, left) - segmentTimelineDistance(reference, right)
      || Math.abs(Number(left.startSec) - Number(reference.startSec))
        - Math.abs(Number(right.startSec) - Number(reference.startSec))
      || Number(left.startSec) - Number(right.startSec)
      || Number(left.id) - Number(right.id))[0] ?? null;
}

export function nextSegmentAfterRemoval(lanes, removedSegmentIds, activeSegmentId) {
  const orderedLanes = lanes || [];
  const removedIds = new Set(removedSegmentIds || []);
  const activeLaneIndex = orderedLanes.findIndex((lane) =>
    (lane.markers || []).some(({ segment }) => segment.id === activeSegmentId));
  const activeSegment = activeLaneIndex < 0
    ? null
    : orderedLanes[activeLaneIndex].markers.find(({ segment }) => segment.id === activeSegmentId)?.segment;
  if (!activeSegment) {
    for (const lane of orderedLanes) {
      const first = (lane.markers || []).find(({ segment }) => !removedIds.has(segment.id));
      if (first) return first.segment;
    }
    return null;
  }

  const sameLane = closestSegmentOnTimeline(
    orderedLanes[activeLaneIndex].markers,
    activeSegment,
    removedIds,
  );
  if (sameLane) return sameLane;

  const fallbackLane = orderedLanes
    .map((lane, index) => ({ lane, index }))
    .filter(({ lane }) => (lane.markers || []).some(({ segment }) => !removedIds.has(segment.id)))
    .sort((left, right) =>
      Math.abs(left.index - activeLaneIndex) - Math.abs(right.index - activeLaneIndex)
      || Number(left.index < activeLaneIndex) - Number(right.index < activeLaneIndex)
      || left.index - right.index)[0]?.lane;
  return closestSegmentOnTimeline(fallbackLane?.markers, activeSegment, removedIds);
}

export function nextUnreviewedAfterRemoval(lanes, removedSegmentIds, activeSegmentId) {
  const removedIds = new Set(removedSegmentIds || []);
  const ordered = (lanes || []).flatMap((lane) =>
    (lane.markers || []).map(({ segment }) => segment).filter(Boolean));
  const activeIndex = ordered.findIndex((segment) => segment.id === activeSegmentId);
  const candidates = activeIndex < 0 ? ordered : ordered.slice(activeIndex + 1);
  return candidates.find((segment) =>
    !removedIds.has(segment.id) && segment.reviewState === "unreviewed") ?? null;
}

export function percentageSeekTime(duration, digit) {
  const boundedDuration = Math.max(0, Number(duration) || 0);
  const boundedDigit = Math.min(9, Math.max(0, Math.trunc(Number(digit) || 0)));
  return boundedDuration * boundedDigit / 10;
}

export function resolveSelectedSegments(segments, selectedSegmentIds) {
  const byId = new Map((segments || []).map((segment) => [segment.id, segment]));
  return [...new Set(selectedSegmentIds || [])].map((id) => byId.get(id)).filter(Boolean);
}

function readHideDerivedSegmentsPreference() {
  try {
    return parseHideDerivedSegmentsPreference(window.localStorage.getItem(HIDE_DERIVED_SEGMENTS_STORAGE_KEY));
  } catch {
    return false;
  }
}

function writeHideDerivedSegmentsPreference(value) {
  try {
    window.localStorage.setItem(HIDE_DERIVED_SEGMENTS_STORAGE_KEY, String(Boolean(value)));
  } catch {
    // Storage can be unavailable in private or embedded browsing contexts.
  }
}

export { readMergeConfirmationPreference, writeMergeConfirmationPreference, segmentTimelineDistance, closestSegmentOnTimeline, readHideDerivedSegmentsPreference, writeHideDerivedSegmentsPreference };
