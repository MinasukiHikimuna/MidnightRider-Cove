export function patchSegmentProjection(detail, segmentIds, values) {
  const ids = new Set(segmentIds || []);
  return {
    ...detail,
    segments: (detail.segments || [])
      .map((segment) => ids.has(segment.id) ? { ...segment, ...values } : segment)
      .sort((left, right) => left.startSec - right.startSec || left.id - right.id),
  };
}

export function insertSegmentProjection(detail, segment) {
  return {
    ...detail,
    segments: [...(detail.segments || []), segment]
      .sort((left, right) => left.startSec - right.startSec || left.id - right.id),
  };
}

export function removeSegmentsProjection(detail, segmentIds) {
  const ids = new Set(segmentIds || []);
  return {
    ...detail,
    segments: (detail.segments || []).filter((segment) => !ids.has(segment.id)),
  };
}

export function mergeSegmentsProjection(detail, mergedSegments) {
  const ordered = [...(mergedSegments || [])]
    .sort((left, right) => left.startSec - right.startSec || left.id - right.id);
  const survivor = ordered[0];
  if (!survivor) return detail;
  const consumedIds = new Set(ordered.slice(1).map((segment) => segment.id));
  const optimisticSurvivor = {
    ...survivor,
    startSec: ordered[0].startSec,
    endSec: Math.max(...ordered.map((segment) => segment.endSec ?? segment.startSec)),
    sourceKey: "user",
    sourceRunId: null,
    confidence: null,
    isDerived: false,
  };
  return {
    ...detail,
    segments: (detail.segments || [])
      .filter((segment) => !consumedIds.has(segment.id))
      .map((segment) => segment.id === survivor.id ? optimisticSurvivor : segment)
      .sort((left, right) => left.startSec - right.startSec || left.id - right.id),
  };
}
