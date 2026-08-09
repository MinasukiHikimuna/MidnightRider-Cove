import { createPortal, h, useEffect, useId, useRef, useState } from "../../shared/runtime.js";

import { REVIEW_STATES } from "../../shared/constants.js";

import { performerSlotLabel } from "./history.js";

function laneReviewCounts(segments) {
  const counts = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const segment of segments)
    if (Object.hasOwn(counts, segment.reviewState)) counts[segment.reviewState] += 1;
  return counts;
}

function finalizeSwimlane(lane) {
  const trackReservations = [];
  const markers = [...lane.segments]
    .sort((left, right) => left.startSec - right.startSec || left.id - right.id)
    .map((segment) => {
      const start = Number(segment.startSec) || 0;
      const parsedEnd = segment.endSec == null ? start : Number(segment.endSec);
      const end = Number.isFinite(parsedEnd) ? Math.max(start, parsedEnd) : start;
      let track = trackReservations.findIndex((reservation) => reservation.end <= start && reservation.start !== start);
      if (track < 0) track = trackReservations.length;
      trackReservations[track] = { start, end };
      return { segment, track };
    });
  const { segments, ...rest } = lane;
  return {
    ...rest,
    markers,
    counts: laneReviewCounts(segments),
    trackCount: Math.max(1, trackReservations.length),
  };
}

function qualifiedSlotLabels(slots) {
  const baseLabels = slots.map(performerSlotLabel);
  const totals = new Map();
  for (const label of baseLabels) totals.set(label, (totals.get(label) || 0) + 1);
  const seen = new Map();
  return new Map(slots.map((slot, index) => {
    const label = baseLabels[index];
    const occurrence = (seen.get(label) || 0) + 1;
    seen.set(label, occurrence);
    return [String(slot.slotDefinitionId), totals.get(label) > 1 ? `${label} ${occurrence}` : label];
  }));
}

function splitLaneByPerformerAssignments(lane, slotsBySegment) {
  const assignments = lane.segments.map((segment) => {
    const slots = slotsBySegment.get(segment.id) || [];
    const complete = slots.length > 0 && slots.every((slot) => Number(slot.performerId) > 0);
    const signature = complete
      ? slots.map((slot) => `${slot.slotDefinitionId}:${Number(slot.performerId)}`).join("|")
      : null;
    return { segment, slots, signature };
  });
  const completeSignatures = [...new Set(assignments.map((assignment) => assignment.signature).filter(Boolean))];
  if (completeSignatures.length === 0)
    return [finalizeSwimlane({ ...lane, performerLabel: null, performers: [], performerAssignments: [] })];

  const representativeSlots = completeSignatures.map((signature) =>
    assignments.find((assignment) => assignment.signature === signature).slots);
  const commonSlotIds = new Set((representativeSlots[0] || [])
    .filter((slot) => representativeSlots.every((slots) => slots.some((candidate) =>
      String(candidate.slotDefinitionId) === String(slot.slotDefinitionId)
      && Number(candidate.performerId) === Number(slot.performerId))))
    .map((slot) => String(slot.slotDefinitionId)));
  const sublanes = new Map();

  for (const assignment of assignments) {
    const key = assignment.signature || "unfilled";
    if (!sublanes.has(key)) {
      if (!assignment.signature) {
        sublanes.set(key, {
          ...lane,
          key: `${lane.key}:performers:unfilled`,
          performerLabel: "Unfilled performer slots",
          performers: [],
          performerAssignments: [],
          segments: [],
        });
      } else {
        const roleLabels = qualifiedSlotLabels(assignment.slots);
        const distinguishingSlots = assignment.slots.filter((slot) =>
          !commonSlotIds.has(String(slot.slotDefinitionId)));
        const displayedSlots = completeSignatures.length === 1 ? assignment.slots : distinguishingSlots;
        const performerLabel = displayedSlots.map((slot) =>
          `${roleLabels.get(String(slot.slotDefinitionId))} · ${slot.performerName || `Performer ${slot.performerId}`}`)
          .join(" · ");
        const performers = [...new Map(displayedSlots.map((slot) => [
          Number(slot.performerId),
          { id: Number(slot.performerId), name: slot.performerName || `Performer ${slot.performerId}` },
        ])).values()];
        const performerAssignments = assignment.slots.map((slot) => ({
          slotDefinitionId: String(slot.slotDefinitionId),
          label: roleLabels.get(String(slot.slotDefinitionId)),
          performer: {
            id: Number(slot.performerId),
            name: slot.performerName || `Performer ${slot.performerId}`,
          },
        }));
        sublanes.set(key, {
          ...lane,
          key: `${lane.key}:performers:${key}`,
          performerLabel,
          performers,
          performerAssignments,
          segments: [],
        });
      }
    }
    sublanes.get(key).segments.push(assignment.segment);
  }

  return [...sublanes.values()]
    .sort((left, right) => Number(left.performerLabel === "Unfilled performer slots")
      - Number(right.performerLabel === "Unfilled performer slots")
      || left.performerLabel.localeCompare(right.performerLabel)
      || left.key.localeCompare(right.key))
    .map(finalizeSwimlane);
}

export function groupSegmentsIntoSwimlanes(segments, segmentGroups = [], performerSlots = []) {
  const tagPlacement = new Map();
  for (const group of segmentGroups) {
    for (const tag of group.tags || []) {
      tagPlacement.set(tag.tagId, {
        segmentGroupId: group.id,
        segmentGroupName: group.name,
        segmentGroupSortOrder: group.sortOrder,
        segmentGroupTagSortOrder: tag.sortOrder,
      });
    }
  }
  const laneMap = new Map();
  for (const segment of segments) {
    const label = segment.tagName || "Tag segment";
    const key = segment.tagId == null ? `name:${label}` : `tag:${segment.tagId}`;
    if (!laneMap.has(key)) {
      laneMap.set(key, {
        key,
        tagId: segment.tagId,
        label,
        ...(tagPlacement.get(segment.tagId) || {
          segmentGroupId: null,
          segmentGroupName: null,
          segmentGroupSortOrder: Number.MAX_SAFE_INTEGER,
          segmentGroupTagSortOrder: Number.MAX_SAFE_INTEGER,
        }),
        segments: [],
      });
    }
    const lane = laneMap.get(key);
    lane.segments.push(segment);
  }

  const slotsBySegment = new Map();
  for (const slot of performerSlots || []) {
    if (!slotsBySegment.has(slot.segmentId)) slotsBySegment.set(slot.segmentId, []);
    slotsBySegment.get(slot.segmentId).push(slot);
  }
  for (const slots of slotsBySegment.values())
    slots.sort((left, right) => left.sortOrder - right.sortOrder
      || String(left.slotDefinitionId).localeCompare(String(right.slotDefinitionId)));

  return [...laneMap.values()]
    .sort((left, right) => left.segmentGroupSortOrder - right.segmentGroupSortOrder
      || left.segmentGroupTagSortOrder - right.segmentGroupTagSortOrder
      || left.label.localeCompare(right.label)
      || left.key.localeCompare(right.key))
    .flatMap((lane) => splitLaneByPerformerAssignments(lane, slotsBySegment));
}

export function segmentGroupAssignmentMutation(groups, tagId, targetGroupId) {
  const numericTagId = Number(tagId);
  const currentGroup = groups.find((group) =>
    (group.tags || []).some((tag) => Number(tag.tagId) === numericTagId));
  const numericTargetGroupId = targetGroupId == null || targetGroupId === ""
    ? null
    : Number(targetGroupId);

  if (numericTargetGroupId == null) {
    if (!currentGroup) return null;
    return {
      groupId: currentGroup.id,
      name: currentGroup.name,
      tagIds: currentGroup.tags
        .map((tag) => Number(tag.tagId))
        .filter((candidateTagId) => candidateTagId !== numericTagId),
    };
  }

  const targetGroup = groups.find((group) => Number(group.id) === numericTargetGroupId);
  if (!targetGroup || Number(currentGroup?.id) === numericTargetGroupId) return null;
  return {
    groupId: targetGroup.id,
    name: targetGroup.name,
    tagIds: [
      ...targetGroup.tags
        .map((tag) => Number(tag.tagId))
        .filter((candidateTagId) => candidateTagId !== numericTagId),
      numericTagId,
    ],
  };
}

export function groupSwimlanesBySegmentGroup(lanes) {
  const groups = [];
  for (const lane of lanes) {
    const key = lane.segmentGroupId == null ? "ungrouped" : `group:${lane.segmentGroupId}`;
    let group = groups.at(-1);
    if (!group || group.key !== key) {
      group = {
        key,
        id: lane.segmentGroupId,
        name: lane.segmentGroupName || "Ungrouped",
        lanes: [],
        counts: { unreviewed: 0, approved: 0, rejected: 0 },
      };
      groups.push(group);
    }
    group.lanes.push(lane);
    for (const state of REVIEW_STATES)
      group.counts[state] += Number(lane.counts?.[state]) || 0;
  }
  return groups;
}

const SEGMENT_RAIL_ROW_HEIGHTS = {
  group: 38,
  lane: 33,
  segment: 41,
};

export function buildSegmentRailRows(groupedLanes, collapsedGroupKeys = []) {
  const collapsed = new Set(collapsedGroupKeys || []);
  const rows = [];
  let top = 0;
  const push = (row) => {
    const height = SEGMENT_RAIL_ROW_HEIGHTS[row.kind];
    rows.push({ ...row, top, height });
    top += height;
  };
  for (const group of groupedLanes || []) {
    push({ kind: "group", key: `${group.key}:header`, group });
    if (collapsed.has(group.key)) continue;
    for (const lane of group.lanes || []) {
      push({ kind: "lane", key: `${lane.key}:label`, group, lane });
      for (const marker of lane.markers || [])
        push({ kind: "segment", key: `segment:${marker.segment.id}`, group, lane, segment: marker.segment });
    }
  }
  return { rows, height: top };
}

export function visibleVirtualRows(rows, scrollTop, viewportHeight, overscan = 240) {
  const minimum = Math.max(0, Number(scrollTop) - overscan);
  const maximum = Math.max(minimum, Number(scrollTop) + Math.max(0, Number(viewportHeight)) + overscan);
  return (rows || []).filter((row) => row.top + row.height >= minimum && row.top <= maximum);
}

export function buildTimelineRows(groupedLanes, collapsedGroupKeys = [], showHeaders = true) {
  const collapsed = new Set(collapsedGroupKeys || []);
  const rows = [];
  let top = 0;
  const push = (row, height) => {
    rows.push({ ...row, top, height });
    top += height;
  };
  for (const group of groupedLanes || []) {
    if (showHeaders)
      push({ kind: "group", key: `header:${group.key}`, group }, 32);
    if (collapsed.has(group.key)) continue;
    for (const [laneIndex, lane] of (group.lanes || []).entries()) {
      const height = Math.max(1.75, lane.trackCount * 1.25 + 0.5) * 16;
      push({ kind: "lane", key: lane.key, group, lane, laneIndex }, height);
    }
  }
  return { rows, height: top };
}

export function groupSelectedSwimlanes(lanes, selectedSegmentIds) {
  const selected = new Set(selectedSegmentIds || []);
  const selectedLanes = (lanes || []).map((lane) => {
    const markers = (lane.markers || []).filter(({ segment }) => selected.has(segment.id));
    if (markers.length === 0) return null;
    return {
      ...lane,
      selectedCount: markers.length,
      counts: laneReviewCounts(markers.map(({ segment }) => segment)),
      markers,
    };
  }).filter(Boolean);
  return groupSwimlanesBySegmentGroup(selectedLanes).map((group) => {
    const segments = group.lanes.flatMap((lane) => lane.markers.map(({ segment }) => segment));
    return {
      ...group,
      selectedCount: segments.length,
      counts: laneReviewCounts(segments),
    };
  });
}

export function selectedSwimlaneMerge(
  selectedGroups,
  { nativeOnly = false } = {},
) {
  const lanes = (selectedGroups || []).flatMap((group) => group.lanes || []);
  if (lanes.length !== 1 || (lanes[0].markers || []).length < 2) return null;
  const segments = lanes[0].markers.map(({ segment }) => segment)
    .sort((left, right) => left.startSec - right.startSec
      || (left.nativeSegmentId ?? left.itemId ?? left.id)
        - (right.nativeSegmentId ?? right.itemId ?? right.id));
  if (nativeOnly
      && segments.some((segment) => segment.nativeSegmentId == null))
    return null;
  if (!nativeOnly
      && new Set(segments.map((segment) =>
        segment.nativeSegmentId != null ? "native" : "extension")).size !== 1)
    return null;
  return {
    lane: lanes[0],
    segments,
    startSec: segments[0].startSec,
    endSec: Math.max(...segments.map((segment) => segment.endSec ?? segment.startSec)),
  };
}

export function applySegmentMergeDelta(detail, delta) {
  const removedSegmentIds = new Set(delta.removedSegmentIds || []);
  const removedItemIds = new Set(delta.removedItemIds || []);
  const survivor = delta.survivor;
  const segments = (detail.segments || [])
    .filter((segment) => !removedSegmentIds.has(segment.id))
    .map((segment) => segment.id === survivor.id ? { ...segment, ...survivor } : segment);
  if (!segments.some((segment) => segment.id === survivor.id)) segments.push(survivor);

  const performerSlots = delta.performerSlots == null
    ? detail.performerSlots
    : (detail.performerSlots || [])
      .filter((slot) => slot.segmentId !== survivor.id && !removedSegmentIds.has(slot.segmentId))
      .concat(delta.performerSlots);
  const performerSlotRevisions = { ...(detail.performerSlotRevisions || {}) };
  if (delta.performerSlotRevisions != null) {
    delete performerSlotRevisions[survivor.id];
    removedSegmentIds.forEach((segmentId) => delete performerSlotRevisions[segmentId]);
    Object.assign(performerSlotRevisions, delta.performerSlotRevisions);
  }

  const itemMetadata = { ...(detail.itemMetadata || {}) };
  if (delta.itemMetadata != null) {
    if (survivor.itemId != null) delete itemMetadata[survivor.itemId];
    removedItemIds.forEach((itemId) => delete itemMetadata[itemId]);
    Object.assign(itemMetadata, delta.itemMetadata);
  }
  return {
    ...detail,
    segments,
    performerSlots,
    performerSlotRevisions,
    itemMetadata,
    approvedSetVersion: delta.approvedSetVersion ?? detail.approvedSetVersion,
  };
}

export function normalizeCollapsedSegmentGroups(value) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((key) => key === "ungrouped" || /^group:\d+$/.test(key)))];
}

export function swimlaneDisplayLabel(lane) {
  return lane.performerLabel && lane.performerLabel !== "Unfilled performer slots"
    ? `${lane.label} · ${lane.performerLabel}`
    : lane.label;
}

function performerInitials(name) {
  return String(name || "?").split(/\s+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]?.toUpperCase()).join("") || "?";
}

function PerformerAvatar({ performer, compact = false, tooltip = null }) {
  const filled = Number(performer?.id) > 0;
  return h("span", {
    title: tooltip || undefined,
    "aria-label": tooltip || undefined,
    className: `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted font-semibold text-secondary ${
      compact
        ? "h-[1.125rem] w-[1.125rem] border-border text-[7px]"
        : `h-6 w-6 justify-self-end text-[8px] ${filled ? "border-border" : "border-dashed border-amber-500/50"}`}`,
  }, [
    h("span", {
      key: "fallback",
      "aria-hidden": "true",
      className: "flex h-full w-full items-center justify-center",
    }, filled ? performerInitials(performer.name) : "—"),
    filled ? h("img", {
      key: "image",
      src: `/api/performers/${performer.id}/image?max=64`,
      alt: "",
      loading: "lazy",
      className: "absolute inset-0 h-full w-full object-cover",
      onError: (event) => { event.currentTarget.style.display = "none"; },
    }) : null,
  ]);
}

function PerformerAssignmentRows({ assignments, className = "" }) {
  return h("span", {
    className: `grid items-center gap-x-3 gap-y-1.5 ${className}`,
    style: { gridTemplateColumns: "minmax(4.5rem, auto) minmax(0, 1fr) 1.5rem" },
  }, (assignments || []).flatMap((assignment) => [
    h("span", {
      key: `${assignment.key}:slot`,
      className: "truncate text-[10px] font-semibold uppercase tracking-wide text-secondary",
    }, assignment.label),
    h("span", {
      key: `${assignment.key}:performer`,
      className: "min-w-0 truncate text-xs text-foreground",
      title: assignment.title,
      "aria-label": assignment.title,
    }, assignment.performer?.name || "Unfilled"),
    h(PerformerAvatar, {
      key: `${assignment.key}:avatar`,
      performer: assignment.performer,
    }),
  ]));
}

function PerformerSublaneAvatars({ performers, performerAssignments, interactive = true }) {
  const triggerRef = useRef(null);
  const tooltipId = `performer-slots-${useId()}`;
  const [popoverPosition, setPopoverPosition] = useState(null);

  function updatePopoverPosition() {
    const bounds = triggerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const width = Math.max(0, Math.min(256, window.innerWidth - 16));
    const estimatedHeight = Math.min(window.innerHeight - 16, Math.max(48, (performerAssignments?.length || 0) * 36 + 16));
    const roomBelow = window.innerHeight - bounds.bottom;
    setPopoverPosition({
      left: Math.max(8, Math.min(window.innerWidth - width - 8, bounds.right - width)),
      top: roomBelow >= estimatedHeight + 8
        ? bounds.bottom + 4
        : Math.max(8, bounds.top - estimatedHeight - 4),
      width,
    });
  }

  useEffect(() => {
    if (!popoverPosition) return undefined;
    window.addEventListener("scroll", updatePopoverPosition, true);
    window.addEventListener("resize", updatePopoverPosition);
    return () => {
      window.removeEventListener("scroll", updatePopoverPosition, true);
      window.removeEventListener("resize", updatePopoverPosition);
    };
  }, [popoverPosition != null, performerAssignments?.length]);

  const assignmentLabel = (performerAssignments || []).map((assignment) =>
    `${assignment.label}: ${assignment.performer.name}`).join(", ") || "Performer assignments";
  if (!interactive) return h("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": assignmentLabel,
    title: assignmentLabel,
  }, performers.slice(0, 3).map((performer) => h(PerformerAvatar, {
    key: performer.id,
    performer,
    compact: true,
  })));

  return h("span", {
    ref: triggerRef,
    tabIndex: 0,
    className: "relative ml-auto flex shrink-0 -space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": assignmentLabel,
    "aria-describedby": tooltipId,
    onMouseEnter: updatePopoverPosition,
    onMouseLeave: () => setPopoverPosition(null),
    onFocus: updatePopoverPosition,
    onBlur: () => setPopoverPosition(null),
    onKeyDown: (event) => {
      if (event.key === "Escape") setPopoverPosition(null);
    },
  }, [
    ...performers.slice(0, 3).map((performer) => h(PerformerAvatar, {
      key: performer.id,
      performer,
      compact: true,
    })),
    popoverPosition ? createPortal(h("span", {
      id: tooltipId,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...popoverPosition, maxHeight: "calc(100vh - 1rem)" },
    }, h(PerformerAssignmentRows, {
      assignments: (performerAssignments || []).map((assignment) => ({
        ...assignment,
        key: assignment.slotDefinitionId,
      })),
    })), document.body) : null,
  ]);
}

export function expandedSwimlanes(lanes, collapsedGroupKeys) {
  const collapsed = new Set(normalizeCollapsedSegmentGroups(collapsedGroupKeys));
  return (lanes || []).filter((lane) => !collapsed.has(lane.segmentGroupId == null ? "ungrouped" : `group:${lane.segmentGroupId}`));
}

export function revealCollapsedSegmentGroup(collapsedGroupKeys, groupKey) {
  if (!groupKey) return normalizeCollapsedSegmentGroups(collapsedGroupKeys);
  return normalizeCollapsedSegmentGroups(collapsedGroupKeys).filter((key) => key !== groupKey);
}

export function toggleAllCollapsedSegmentGroups(collapsedGroupKeys, groupKeys) {
  const keys = normalizeCollapsedSegmentGroups(groupKeys);
  const collapsed = new Set(normalizeCollapsedSegmentGroups(collapsedGroupKeys));
  return keys.length > 0 && keys.every((key) => collapsed.has(key)) ? [] : keys;
}

export function segmentGroupKeyForSegment(lanes, segmentId) {
  const lane = (lanes || []).find((candidate) => candidate.markers.some((marker) => marker.segment.id === segmentId));
  if (!lane) return null;
  return lane.segmentGroupId == null ? "ungrouped" : `group:${lane.segmentGroupId}`;
}

function compareSegmentsForPlayhead(left, right, currentTime) {
  const time = Number(currentTime);
  if (!Number.isFinite(time)) return 0;
  const timing = (marker) => {
    const start = Number(marker.segment.startSec) || 0;
    const end = marker.segment.endSec == null ? start : Number(marker.segment.endSec);
    const validEnd = Number.isFinite(end) && end >= start ? end : start;
    const contains = start <= time && validEnd >= time;
    const distance = contains ? 0 : Math.min(Math.abs(time - start), Math.abs(time - validEnd));
    return { contains, distance, duration: validEnd - start, start };
  };
  const leftTiming = timing(left);
  const rightTiming = timing(right);
  return Number(rightTiming.contains) - Number(leftTiming.contains)
    || (leftTiming.contains && rightTiming.contains
      ? rightTiming.duration - leftTiming.duration
      : leftTiming.distance - rightTiming.distance)
    || leftTiming.start - rightTiming.start
    || left.segment.id - right.segment.id;
}

export function findSwimlaneSelection(lanes, selectedId, direction, currentTime = null) {
  const laneIndex = lanes.findIndex((lane) => lane.markers.some((marker) => marker.segment.id === selectedId));
  if (laneIndex < 0) {
    const candidates = [...(lanes[0]?.markers || [])];
    if (currentTime != null && Number.isFinite(Number(currentTime)))
      candidates.sort((left, right) => compareSegmentsForPlayhead(left, right, currentTime));
    return candidates[0]?.segment ?? null;
  }
  const lane = lanes[laneIndex];
  const markerIndex = lane.markers.findIndex((marker) => marker.segment.id === selectedId);
  if (direction === "left" || direction === "right") {
    const offset = direction === "left" ? -1 : 1;
    const targetIndex = Math.min(lane.markers.length - 1, Math.max(0, markerIndex + offset));
    return lane.markers[targetIndex]?.segment ?? null;
  }

  const targetLaneIndex = Math.min(lanes.length - 1, Math.max(0, laneIndex + (direction === "up" ? -1 : 1)));
  const currentStart = Number(lane.markers[markerIndex]?.segment.startSec) || 0;
  const hasPlayheadTime = currentTime != null && Number.isFinite(Number(currentTime));
  return targetLaneIndex === laneIndex
    ? lane.markers[markerIndex]?.segment ?? null
    : [...lanes[targetLaneIndex].markers]
        .sort(hasPlayheadTime
          ? (left, right) => compareSegmentsForPlayhead(left, right, Number(currentTime))
          : (left, right) => Math.abs(left.segment.startSec - currentStart) - Math.abs(right.segment.startSec - currentStart)
            || left.segment.startSec - right.segment.startSec || left.segment.id - right.segment.id)[0]?.segment ?? null;
}

export function findSwimlaneRangeSelection(lanes, selectedId, direction) {
  const lane = (lanes || []).find((candidate) => candidate.markers.some((marker) => marker.segment.id === selectedId));
  if (!lane) return null;
  const segment = findSwimlaneSelection([lane], selectedId, direction);
  return segment
    ? { segment, segmentIds: lane.markers.map((marker) => marker.segment.id) }
    : null;
}

export function findAdjacentSegmentGroupKey(groupKeys, selectedKey, direction) {
  if (!Array.isArray(groupKeys) || groupKeys.length === 0) return null;
  const currentIndex = groupKeys.indexOf(selectedKey);
  if (currentIndex < 0) return groupKeys[0];
  return groupKeys[Math.min(groupKeys.length - 1, Math.max(0, currentIndex + direction))];
}

export function reconcileSegmentGroupKey(groupKeys, selectedKey, fallbackKey) {
  if (!Array.isArray(groupKeys) || groupKeys.length === 0) return null;
  if (groupKeys.includes(selectedKey)) return selectedKey;
  return groupKeys.includes(fallbackKey) ? fallbackKey : groupKeys[0];
}

export { laneReviewCounts, finalizeSwimlane, qualifiedSlotLabels, splitLaneByPerformerAssignments, SEGMENT_RAIL_ROW_HEIGHTS, performerInitials, PerformerAvatar, PerformerAssignmentRows, PerformerSublaneAvatars, compareSegmentsForPlayhead };
