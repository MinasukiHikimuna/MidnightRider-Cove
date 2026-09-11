export function patchSegmentProjection(detail, segmentIds, values) {
  const ids = new Set(segmentIds || []);
  return {
    ...detail,
    segments: (detail.segments || [])
      .map((segment) => ids.has(segment.id) ? { ...segment, ...values } : segment)
      .sort((left, right) => left.startSec - right.startSec || left.id - right.id),
  };
}
