export function historyActionsForTarget(history, targetSequence) {
  const cursor = Number(history?.cursorSequence) || 0;
  const target = Number(targetSequence) || 0;
  const actions = [...(history?.actions || [])];
  if (target < cursor)
    return actions
      .filter((action) => action.sequence > target && action.sequence <= cursor)
      .sort((left, right) => right.sequence - left.sequence)
      .map((action) => ({ action, direction: "backward", state: action.beforeState }));
  return actions
    .filter((action) => action.sequence > cursor && action.sequence <= target)
    .sort((left, right) => left.sequence - right.sequence)
    .map((action) => ({ action, direction: "forward", state: action.afterState }));
}

export function segmentHistoryIdentity(segment, includeFullWorkflowMetadata = true) {
  const nativeSegmentId =
    segment?.nativeSegmentId ?? (segment?.published ? segment?.id ?? null : null);
  if (!includeFullWorkflowMetadata) {
    return {
      nativeSegmentId,
      recycleBinItemId: segment?.recycleBinItemId ?? null,
      revision: segment?.revision ?? null,
      updatedAt: segment?.updatedAt ?? null,
    };
  }
  return {
    itemId: segment?.itemId ?? null,
    nativeSegmentId,
    published: nativeSegmentId != null,
    revision: segment?.revision ?? null,
  };
}

export function segmentHistoryState(segment, includeFullWorkflowMetadata = true) {
  return {
    type: "segment",
    identity: segmentHistoryIdentity(segment, includeFullWorkflowMetadata),
    values: {
      startSec: segment.startSec,
      endSec: segment.endSec ?? null,
      tagId: segment.tagId,
      sourceKey: segment.sourceKey || "user",
      sourceRunId: segment.sourceRunId ?? null,
      confidence: segment.confidence ?? null,
      ...(!includeFullWorkflowMetadata
        ? {
          kind: segment.kind || "tag",
          refId: segment.refId ?? null,
          payloadJson: segment.payloadJson ?? null,
          title: segment.title ?? null,
          colorHint: segment.colorHint ?? null,
          imageBlobId: segment.imageBlobId ?? null,
          createdAt: segment.createdAt,
          fieldProvenance: segment.fieldProvenance || [],
        }
        : {}),
      ...(includeFullWorkflowMetadata
        ? { reviewState: segment.reviewState }
        : {}),
    },
  };
}

export function segmentsHistoryState(
  segments,
  includeFullWorkflowMetadata = true,
) {
  return {
    type: "segments",
    segments: (segments || []).map((segment) => ({
      identity: segmentHistoryIdentity(segment, includeFullWorkflowMetadata),
      values: {
        startSec: segment.startSec,
        endSec: segment.endSec ?? null,
        tagId: segment.tagId,
        sourceKey: segment.sourceKey || "user",
        sourceRunId: segment.sourceRunId ?? null,
        confidence: segment.confidence ?? null,
        ...(!includeFullWorkflowMetadata
          ? {
            kind: segment.kind || "tag",
            refId: segment.refId ?? null,
            payloadJson: segment.payloadJson ?? null,
            title: segment.title ?? null,
            colorHint: segment.colorHint ?? null,
            imageBlobId: segment.imageBlobId ?? null,
            createdAt: segment.createdAt,
            fieldProvenance: segment.fieldProvenance || [],
          }
          : {}),
        ...(includeFullWorkflowMetadata
          ? { reviewState: segment.reviewState }
          : {}),
      },
    })),
  };
}

export function performerSlotHistoryState(targets) {
  return {
    type: "performerSlots",
    targets: (targets || []).map((target) => ({
      identity: {
        itemId: target.itemId ?? null,
        nativeSegmentId: target.segmentId ?? null,
      },
      revision: target.revision,
      assignments: (target.slots || []).map((slot) => ({
        slotDefinitionId: slot.slotDefinitionId,
        performerId: slot.performerId ?? null,
      })),
    })),
  };
}

export function performerSlotsForSegment(slots, segmentId) {
  return (slots || [])
    .filter((slot) => slot.segmentId === segmentId)
    .sort((left, right) => left.sortOrder - right.sortOrder
      || String(left.slotDefinitionId).localeCompare(String(right.slotDefinitionId)));
}

export function indexPerformerSlotsBySegment(slots) {
  const index = new Map();
  for (const slot of slots || []) {
    const segmentSlots = index.get(slot.segmentId);
    if (segmentSlots) segmentSlots.push(slot);
    else index.set(slot.segmentId, [slot]);
  }
  for (const segmentSlots of index.values())
    segmentSlots.sort((left, right) => left.sortOrder - right.sortOrder
      || String(left.slotDefinitionId).localeCompare(String(right.slotDefinitionId)));
  return index;
}

export function performerSlotStatusFromSegmentSlots(segmentSlots) {
  if (!segmentSlots?.length) return "not-applicable";
  const filled = segmentSlots.filter((slot) => Number(slot.performerId) > 0).length;
  if (filled === 0) return "empty";
  return filled === segmentSlots.length ? "complete" : "partial";
}

export function nextUnapprovedAfterRejectedDeletion(lanes, deletedSegmentIds) {
  const deleted = deletedSegmentIds instanceof Set
    ? deletedSegmentIds
    : new Set(deletedSegmentIds || []);
  const orderedLanes = lanes || [];
  const firstAffectedLane = orderedLanes.findIndex((lane) =>
    (lane.markers || []).some((marker) => deleted.has(marker.segment.id)));
  if (firstAffectedLane < 0)
    return null;
  for (const lane of orderedLanes.slice(firstAffectedLane)) {
    const candidate = (lane.markers || []).find((marker) =>
      !deleted.has(marker.segment.id) && marker.segment.reviewState === "unreviewed");
    if (candidate)
      return candidate.segment;
  }
  return null;
}

export function sharedPerformerSlotShape(slots, segments) {
  const sets = (segments || []).map((segment) => performerSlotsForSegment(slots, segment.id));
  if (sets.length === 0 || sets.some((set) => set.length === 0)) return null;
  const shape = (set) => set.map((slot) => JSON.stringify({
    label: performerSlotLabel(slot),
    genderHints: [...(slot.genderHints || [])].sort(),
    allowSamePerformerInMultipleSlots: slot.allowSamePerformerInMultipleSlots === true,
  })).join("|");
  return sets.every((set) => shape(set) === shape(sets[0])) ? sets : null;
}

export function sharedTagPerformerSlotShape(slots, segments) {
  if (new Set((segments || []).map((segment) => segment.tagId)).size !== 1) return null;
  return sharedPerformerSlotShape(slots, segments);
}

export function multiSelectionActionHint({ mergeable, reviewable, tagEditable = false, slotsEditable }) {
  const actions = [
    mergeable ? "merged (R)" : null,
    tagEditable ? "retagged (Q)" : null,
    reviewable ? "approved (Z)" : null,
    reviewable ? "rejected (X)" : null,
    slotsEditable ? "assigned performers (G)" : null,
  ].filter(Boolean);
  if (actions.length === 0) return "Choose one segment to edit it.";
  if (actions.length === 1) return `Selected segments can be ${actions[0]}.`;
  return `Selected segments can be ${actions.slice(0, -1).join(", ")} or ${actions.at(-1)}.`;
}

export function performerSlotStatus(slots, segmentId) {
  return performerSlotStatusFromSegmentSlots(performerSlotsForSegment(slots, segmentId));
}

export function performerSlotLabel(slot) {
  const label = String(slot?.label || "").trim();
  return label || `Slot ${Math.max(0, Number(slot?.sortOrder) || 0) + 1}`;
}

export function suggestDerivationRuleSlotMappings(sourceSlots, derivedSlots) {
  const normalizedLabel = (slot) =>
    performerSlotLabel(slot).trim().toLocaleLowerCase().replaceAll(/\s+/g, " ");
  const slotOrder = (left, right) =>
    (Number(left.sortOrder) || 0) - (Number(right.sortOrder) || 0)
    || String(left.id).localeCompare(String(right.id));
  const groupByLabel = (slots) => {
    const groups = new Map();
    for (const slot of slots || []) {
      const label = normalizedLabel(slot);
      if (!groups.has(label)) groups.set(label, []);
      groups.get(label).push(slot);
    }
    return groups;
  };
  const sourceByLabel = groupByLabel(sourceSlots);
  const derivedByLabel = groupByLabel(derivedSlots);
  const mappings = [];
  for (const [label, matchingSourceSlots] of sourceByLabel) {
    const matchingDerivedSlots = derivedByLabel.get(label);
    if (!matchingDerivedSlots || matchingSourceSlots.length !== matchingDerivedSlots.length)
      continue;
    const orderedSources = [...matchingSourceSlots].sort(slotOrder);
    const orderedDerived = [...matchingDerivedSlots].sort(slotOrder);
    orderedSources.forEach((sourceSlot, index) => mappings.push({
      sourceSlotDefinitionId: sourceSlot.id,
      derivedSlotDefinitionId: orderedDerived[index].id,
    }));
  }
  return mappings;
}

export function applyDerivationRuleSlotSuggestions(draft, sourceSlots, derivedSlots) {
  if (!draft || draft.ruleId != null || (draft.slotMappings || []).length > 0)
    return draft;
  const slotMappings = suggestDerivationRuleSlotMappings(sourceSlots, derivedSlots);
  return slotMappings.length === 0
    ? draft
    : { ...draft, slotMappings, slotMappingsSuggested: true };
}

export function performerSlotPresentation(slot) {
  const label = performerSlotLabel(slot);
  const performerId = Number(slot?.performerId);
  const filled = performerId > 0;
  const performerName = String(slot?.performerName || "").trim();
  const performer = filled ? performerName || `Performer ${performerId}` : "Unfilled";
  const hints = (slot?.genderHints || []).map(formatGenderHint).filter(Boolean);
  return {
    label,
    performer,
    filled,
    title: `${label}${hints.length ? ` (${hints.join("/")})` : ""}: ${performer}`,
  };
}

export function formatGenderHint(value) {
  const normalized = String(value || "").trim().toLowerCase().replaceAll("_", " ");
  return normalized ? `${normalized[0].toUpperCase()}${normalized.slice(1)}` : "";
}
