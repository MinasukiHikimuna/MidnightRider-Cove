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
