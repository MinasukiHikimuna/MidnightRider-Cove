import { REVIEW_STATES } from "../shared/constants.js";

const BROWSE_URL_OPTIONS = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"],
};

const BROWSE_FILTER_CRITERIA = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: REVIEW_STATES.map((state) => ({ value: state, label: state[0].toUpperCase() + state.slice(1) })) },
];

export function selectedBrowseStates(value) {
  const selected = String(value || "").split(",").filter((state) => REVIEW_STATES.includes(state));
  return selected.length === 0 ? [...REVIEW_STATES] : [...new Set(selected)];
}

export function parseBrowseSlotFilters(value) {
  return parseBrowseSlotState(value).values;
}

function parseBrowseSlotState(value) {
  if (!value) return { activityTagId: null, values: {} };
  try {
    const parsed = JSON.parse(String(value));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") return { activityTagId: null, values: {} };
    const rawValues = parsed.values && typeof parsed.values === "object" && !Array.isArray(parsed.values) ? parsed.values : parsed;
    return {
      activityTagId: Number.isInteger(Number(parsed.activityTagId)) && Number(parsed.activityTagId) > 0 ? Number(parsed.activityTagId) : null,
      values: Object.fromEntries(Object.entries(rawValues).filter(([slotId, performerId]) =>
        slotId && Number.isInteger(Number(performerId)) && Number(performerId) > 0)),
    };
  } catch {
    return { activityTagId: null, values: {} };
  }
}

export function serializeBrowseSlotFilters(activityTagId, values) {
  return Object.keys(values || {}).length ? JSON.stringify({ activityTagId, values }) : undefined;
}

export function buildBrowseRequest(filter, objectFilter) {
  const activityTagIds = criterionIds(objectFilter.activitiesCriterion, objectFilter.activityId);
  const performerIds = criterionIds(objectFilter.performersCriterion, objectFilter.performerId);
  const activityId = activityTagIds.length === 1 ? activityTagIds[0] : null;
  const slotState = parseBrowseSlotState(objectFilter.slots);
  const slotAssignments = activityId && (slotState.activityTagId == null || slotState.activityTagId === activityId) ? Object.entries(slotState.values).map(([slotDefinitionId, performerId]) => ({
    slotDefinitionId,
    performerId: Number(performerId),
  })) : [];
  return {
    query: String(filter.q || "").trim() || null,
    activityTagId: activityId,
    activityTagIds,
    includeActivitySubtags: objectFilter.activitiesCriterion?.depth === -1,
    reviewStates: selectedCriterionStates(objectFilter.reviewStateCriterion, objectFilter.states),
    slotAssignments,
    page: Math.max(1, Number(filter.page) || 1),
    perPage: Math.max(1, Number(filter.perPage) || 24),
    sort: filter.sort || "default",
    direction: filter.direction || "desc",
    performerIds,
  };
}

function criterionIds(criterion, legacyValue) {
  const values = Array.isArray(criterion?.value) ? criterion.value : [legacyValue];
  return [...new Set(values.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
}

function selectedCriterionStates(criterion, legacyValue) {
  return REVIEW_STATES.includes(criterion?.value) ? [criterion.value] : selectedBrowseStates(legacyValue);
}

export function browseEditorHref(item) {
  return item.published === false && item.itemId != null
    ? `/segment-studio/${item.videoId}?item=${encodeURIComponent(item.itemId)}`
    : `/segment-studio/${item.videoId}?segment=${encodeURIComponent(item.segmentId ?? item.id)}`;
}

export function browseClipEnd(item) {
  const start = Number(item.startSec) || 0;
  const explicitEnd = Number(item.endSec);
  if (item.endSec != null && Number.isFinite(explicitEnd)) return Math.max(start, explicitEnd);
  const duration = Number(item.videoFile?.duration);
  return Number.isFinite(duration) && duration > start ? duration : start + 0.001;
}

export function requestedSegmentId(search = typeof window === "undefined" ? "" : window.location.search) {
  const id = Number(new URLSearchParams(search).get("segment"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function requestedOwnedItemId(search = typeof window === "undefined" ? "" : window.location.search) {
  const id = Number(new URLSearchParams(search).get("item"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

export function performInitialSegmentSeek(segmentId, segments, seek) {
  if (typeof seek !== "function" || segmentId == null) return false;
  const segment = (segments || []).find((candidate) => candidate.id === segmentId);
  if (!segment) return false;
  seek(segment.startSec, false);
  return true;
}

export function performerOptionId(performer) {
  return performer?.id ?? performer?.performerId;
}

export function videoPerformerOptions(performers) {
  return (performers || []).filter((performer) => performer.isVideoPerformer);
}

export function videoPerformerSlotAssignments(slots, performers) {
  const allowedIds = new Set(videoPerformerOptions(performers).map((performer) => String(performerOptionId(performer))));
  return Object.fromEntries((slots || []).map((slot) => [
    slot.slotDefinitionId,
    slot.performerId != null && allowedIds.has(String(slot.performerId)) ? String(slot.performerId) : "",
  ]));
}

export function normalizeGender(value) {
  return String(value || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}

function interchangeableSlotKey(slot) {
  return `${String(slot.label || "").trim()}|${(slot.genderHints || []).map(normalizeGender).sort().join(",")}`;
}

export function generatePerformerSlotAssignmentRecommendations(slots, performers, limit = 9) {
  if (!slots?.length || !performers?.length) return [];
  const labeledSlots = slots.filter((slot) => String(slot.label || "").trim());
  if (labeledSlots.length > 0 && labeledSlots.length < slots.length) return [];
  const allowSame = slots[0].allowSamePerformerInMultipleSlots === true;
  const maximum = Math.max(0, Math.min(9, Math.floor(Number(limit)) || 0));
  if (maximum === 0) return [];

  if (labeledSlots.length === 0 && slots.every((slot) => !slot.genderHints?.length)
      && slots.length === performers.length && !allowSame) {
    const orderedSlots = [...slots].sort((left, right) =>
      String(left.slotDefinitionId).localeCompare(String(right.slotDefinitionId)));
    const orderedPerformers = [...performers].sort((left, right) =>
      String(left.name).localeCompare(String(right.name)) || Number(performerOptionId(left)) - Number(performerOptionId(right)));
    return [{
      assignments: Object.fromEntries(orderedSlots.map((slot, index) =>
        [String(slot.slotDefinitionId), String(performerOptionId(orderedPerformers[index]))])),
      description: orderedPerformers.map((performer) => performer.name).join(", "),
    }];
  }

  const recommendations = [];
  const seen = new Set();
  const current = [];
  const compatiblePerformerIndexes = slots.map((slot) => performers
    .map((performer, index) => ({ performer, index }))
    .filter(({ performer }) => !slot.genderHints?.length || slot.genderHints.some((hint) =>
      normalizeGender(hint) === normalizeGender(performer.gender || performer.genderIdentity)))
    .map(({ index }) => index));
  const maximumAssignedCount = allowSame
    ? compatiblePerformerIndexes.filter((indexes) => indexes.length > 0).length
    : maximumBipartiteAssignmentCount(compatiblePerformerIndexes, performers.length);
  if (maximumAssignedCount === 0) return [];
  const performerOrder = new Map(performers.map((performer, index) => [String(performerOptionId(performer)), index]));
  function collect(index, used, assignedCount) {
    if (recommendations.length >= maximum) return;
    const remainingCompatibleIndexes = compatiblePerformerIndexes.slice(index);
    const remainingAssignableCount = allowSame
      ? remainingCompatibleIndexes.filter((indexes) => indexes.length > 0).length
      : maximumBipartiteAssignmentCount(remainingCompatibleIndexes.map((indexes) =>
        indexes.filter((performerIndex) => !used.has(String(performerOptionId(performers[performerIndex]))))), performers.length);
    if (assignedCount + remainingAssignableCount < maximumAssignedCount) return;
    if (index === slots.length) {
      if (assignedCount !== maximumAssignedCount) return;
      const assignments = Object.fromEntries(current.map(({ slot, performer }) =>
        [String(slot.slotDefinitionId), performer ? String(performerOptionId(performer)) : ""]));
      const key = labeledSlots.length === 0
        ? Object.values(assignments).sort().join(",")
        : [...new Set(slots.map((slot) => String(slot.label || "")))].map((label) =>
          `${label}:${current.filter(({ slot }) => String(slot.label || "") === label)
            .map(({ performer }) => performer ? String(performerOptionId(performer)) : "").sort().join(",")}`).join("|");
      if (!seen.has(key) && recommendations.length < maximum) {
        seen.add(key);
        recommendations.push({
          assignments,
          description: current.map(({ slot, performer }) =>
            labeledSlots.length
              ? `${slot.label}: ${performer?.name || "Unassigned"}`
              : performer?.name || "Unassigned").join(", "),
        });
      }
      return;
    }
    const slot = slots[index];
    const equivalentPredecessor = [...current].reverse().find(({ slot: assignedSlot }) =>
      interchangeableSlotKey(assignedSlot) === interchangeableSlotKey(slot));
    const minimumPerformerOrder = equivalentPredecessor
      ? performerOrder.get(String(performerOptionId(equivalentPredecessor.performer)))
      : -1;
    for (const performerIndex of compatiblePerformerIndexes[index]) {
      const performer = performers[performerIndex];
      const performerId = performerOptionId(performer);
      if (performerIndex < minimumPerformerOrder) continue;
      if (performerId == null || (!allowSame && used.has(String(performerId)))) continue;
      current.push({ slot, performer });
      if (!allowSame) used.add(String(performerId));
      collect(index + 1, used, assignedCount + 1);
      if (!allowSame) used.delete(String(performerId));
      current.pop();
      if (recommendations.length >= maximum) return;
    }
    current.push({ slot, performer: null });
    collect(index + 1, used, assignedCount);
    current.pop();
  }
  collect(0, new Set(), 0);
  return recommendations;
}

function maximumBipartiteAssignmentCount(compatiblePerformerIndexes, performerCount) {
  const matchedSlotByPerformer = Array(performerCount).fill(-1);
  function match(slotIndex, visitedPerformers) {
    for (const performerIndex of compatiblePerformerIndexes[slotIndex]) {
      if (visitedPerformers.has(performerIndex)) continue;
      visitedPerformers.add(performerIndex);
      if (matchedSlotByPerformer[performerIndex] === -1
          || match(matchedSlotByPerformer[performerIndex], visitedPerformers)) {
        matchedSlotByPerformer[performerIndex] = slotIndex;
        return true;
      }
    }
    return false;
  }
  return compatiblePerformerIndexes.reduce((count, _, slotIndex) =>
    count + (match(slotIndex, new Set()) ? 1 : 0), 0);
}

export function findUniquePerformerSlotAssignment(slots, performers) {
  if (!slots?.length || !performers?.length) return null;
  const hasLabels = slots.some((slot) => String(slot.label || "").trim());
  if (hasLabels && slots.some((slot) => !String(slot.label || "").trim())) return null;
  const allowSame = slots[0].allowSamePerformerInMultipleSlots === true;
  if (!hasLabels && slots.every((slot) => !slot.genderHints?.length)
      && slots.length === performers.length && !allowSame) {
    const orderedSlots = [...slots].sort((a, b) => String(a.slotDefinitionId).localeCompare(String(b.slotDefinitionId)));
    const orderedPerformers = [...performers].sort((a, b) => String(a.name).localeCompare(String(b.name)) || a.performerId - b.performerId);
    return orderedSlots.map((slot, index) => ({ slot, performer: orderedPerformers[index] }));
  }
  const results = new Map();
  const current = [];
  function search(index, used) {
    if (results.size > 1) return;
    if (index === slots.length) {
      const key = [...new Set(slots.map((slot) => slot.label || ""))].map((label) =>
        `${label}:${current.filter((pair) => (pair.slot.label || "") === label).map((pair) => pair.performer.performerId).sort((a, b) => a - b).join(",")}`).join("|");
      if (!results.has(key)) results.set(key, [...current]);
      return;
    }
    const slot = slots[index];
    for (const performer of performers) {
      if (!allowSame && used.has(performer.performerId)) continue;
      if (slot.genderHints?.length && !slot.genderHints.some((hint) => normalizeGender(hint) === normalizeGender(performer.gender))) continue;
      current.push({ slot, performer });
      if (!allowSame) used.add(performer.performerId);
      search(index + 1, used);
      if (!allowSame) used.delete(performer.performerId);
      current.pop();
    }
  }
  search(0, new Set());
  return results.size === 1 ? [...results.values()][0] : null;
}

export function groupAutoAssignCandidates(candidates) {
  const groups = new Map();
  for (const candidate of candidates || []) {
    const assignment = candidate.assignment || [];
    const signature = assignment
      .map(({ slot, performer }) => `${slot.slotDefinitionId}:${performer.performerId}`)
      .join("|");
    const key = `${candidate.tagId}:${signature}`;
    if (!groups.has(key))
      groups.set(key, {
        key,
        tagName: candidate.tagName || "Tag segment",
        candidates: [],
        assignment,
        counts: { unreviewed: 0, approved: 0, rejected: 0 },
      });
    const group = groups.get(key);
    group.candidates.push(candidate);
    group.counts[candidate.reviewState] = (group.counts[candidate.reviewState] || 0) + 1;
  }
  return [...groups.values()].map((group) => ({
    ...group,
    candidates: [...group.candidates].sort((left, right) =>
      left.startSec - right.startSec
      || (left.endSec ?? left.startSec) - (right.endSec ?? right.startSec)
      || left.id - right.id),
  }));
}

export function filterSegmentQuickSearch(segments, query, limit = 20) {
  const needle = String(query || "").trim().toLocaleLowerCase();
  const matches = (segment) => {
    if (!needle) return true;
    const label = String(segment.segment?.tagName || segment.tagName || "").toLocaleLowerCase();
    if (label.includes(needle)) return true;
    let cursor = -1;
    for (const character of needle) {
      const next = label.indexOf(character, cursor + 1);
      if (next < 0) return false;
      cursor = next;
    }
    return true;
  };
  return (segments || []).filter(matches)
    .slice(0, Math.max(1, Number(limit) || 20));
}

export function buildSegmentQuickSearchEntries(lanes) {
  return (lanes || []).flatMap((lane) => lane.markers.map((marker) => ({
    segment: marker.segment,
    laneKey: lane.key,
    groupKey: lane.segmentGroupId == null ? "ungrouped" : `group:${lane.segmentGroupId}`,
    groupName: lane.segmentGroupName || "Ungrouped",
    performers: lane.performers || [],
    performerAssignments: lane.performerAssignments || [],
  })));
}

export function shouldShowQuickSearchGroups(entries) {
  return new Set((entries || []).map((entry) => entry.groupKey)).size > 1;
}

export function rankPerformerOptions(performers, videoPerformers, genderHints) {
  const performerId = performerOptionId;
  const videoIds = new Set((videoPerformers || []).map(performerId));
  const hints = new Set((genderHints || []).map(normalizeGender));
  const unique = new Map([...(videoPerformers || []), ...(performers || [])].map((performer) => [performerId(performer), performer]));
  return [...unique.values()].sort((left, right) => {
    const leftVideo = left.isVideoPerformer ?? videoIds.has(performerId(left)); const rightVideo = right.isVideoPerformer ?? videoIds.has(performerId(right));
    if (leftVideo !== rightVideo) return rightVideo - leftVideo;
    const leftGender = normalizeGender(left.gender || left.genderIdentity);
    const rightGender = normalizeGender(right.gender || right.genderIdentity);
    const leftMatch = left.matchesGenderHint ?? hints.has(leftGender); const rightMatch = right.matchesGenderHint ?? hints.has(rightGender);
    return rightMatch - leftMatch || String(left.name).localeCompare(String(right.name)) || performerId(left) - performerId(right);
  });
}

export { BROWSE_FILTER_CRITERIA, BROWSE_URL_OPTIONS, interchangeableSlotKey };
