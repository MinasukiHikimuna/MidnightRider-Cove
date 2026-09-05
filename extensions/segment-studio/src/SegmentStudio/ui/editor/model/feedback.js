export function feedbackFrameTimestamps(startValue, endValue) {
  const start = Number(startValue);
  if (!Number.isFinite(start)) return [];
  const end = endValue == null ? null : Number(endValue);
  if (!Number.isFinite(end) || end <= start) return [roundFeedbackTimestamp(start)];
  const duration = end - start;
  const offsets = duration < 30
    ? [4]
    : duration < 60
      ? [4, 20]
      : duration < 120
        ? [4, 20, 50]
        : [4, 20, 50, 100];
  const lastInside = Math.max(start, end - 0.001);
  return [...new Set(offsets
    .map((offset) => roundFeedbackTimestamp(Math.min(lastInside, start + offset))))];
}

export function feedbackSelectionPlan(selectedSegments, incorrectExamples) {
  const selected = Array.isArray(selectedSegments)
    ? selectedSegments.filter(Boolean)
    : [];
  const collectedItemIds = new Set(
    (Array.isArray(incorrectExamples) ? incorrectExamples : [])
      .map((example) => example?.itemId)
      .filter((itemId) => itemId != null),
  );
  const isCollected = (segment) =>
    segment?.itemId != null && collectedItemIds.has(segment.itemId);
  const remove = selected.length > 0 && selected.every(isCollected);
  return {
    action: remove ? "remove" : "collect",
    segments: selected,
  };
}

export function feedbackResultMatchesAction(action, result) {
  return result?.collected === (action === "collect");
}

export function applyFeedbackEditorDelta(detail, delta) {
  if (!detail || !delta) return detail;
  const removedIds = new Set(delta.removedSegmentIds || []);
  const identityChanges = new Map(
    (delta.identityChanges || []).map((change) => [change.previousId, change.currentId]),
  );
  const upserted = new Map(
    [...(delta.upsertedSegments || []), ...(delta.upsertedBasicSegments || [])]
      .map((segment) => [segment.id, segment]),
  );
  const nextSegments = (detail.segments || [])
    .filter((segment) => !removedIds.has(segment.id))
    .map((segment) => upserted.has(segment.id)
      ? { ...segment, ...upserted.get(segment.id) }
      : segment);
  const retainedIds = new Set(nextSegments.map((segment) => segment.id));
  for (const segment of upserted.values()) {
    if (!retainedIds.has(segment.id)) nextSegments.push(segment);
  }
  nextSegments.sort((left, right) =>
    Number(left.startSec) - Number(right.startSec)
      || String(left.key || "").localeCompare(String(right.key || "")));

  const nextSlots = (detail.performerSlots || [])
    .filter((slot) => !removedIds.has(slot.segmentId)
      || identityChanges.has(slot.segmentId))
    .map((slot) => identityChanges.has(slot.segmentId)
      ? { ...slot, segmentId: identityChanges.get(slot.segmentId) }
      : slot);
  const nextRevisions = {};
  for (const [segmentId, revision] of Object.entries(
    detail.performerSlotRevisions || {},
  )) {
    const numericId = Number(segmentId);
    if (removedIds.has(numericId) && !identityChanges.has(numericId)) continue;
    nextRevisions[identityChanges.get(numericId) ?? segmentId] = revision;
  }

  return {
    ...detail,
    approvedSetVersion:
      delta.approvedSetVersion || detail.approvedSetVersion,
    segments: nextSegments,
    performerSlots: nextSlots,
    performerSlotRevisions: nextRevisions,
  };
}

export function hideCollectedFeedbackSegments(segments, incorrectExamples, hide) {
  const candidates = Array.isArray(segments) ? segments : [];
  if (!hide) return candidates;
  const collectedItemIds = new Set(
    (Array.isArray(incorrectExamples) ? incorrectExamples : [])
      .map((example) => example?.itemId)
      .filter((itemId) => itemId != null),
  );
  if (collectedItemIds.size === 0) return candidates;
  return candidates.filter((segment) =>
    segment?.itemId == null || !collectedItemIds.has(segment.itemId));
}

export function groupIncorrectExamplesByTag(examples) {
  if (!Array.isArray(examples)) return [];
  const groups = [];
  const groupsByTag = new Map();
  for (const example of examples) {
    if (!example) continue;
    const tagName = String(example.tagName || "").trim() || "Tag segment";
    let group = groupsByTag.get(tagName);
    if (!group) {
      group = { tagName, examples: [] };
      groupsByTag.set(tagName, group);
      groups.push(group);
    }
    group.examples.push(example);
  }
  return groups;
}

export async function extractFeedbackFrames(videoId, examples) {
  if (!Array.isArray(examples) || examples.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const video = document.createElement("video");
  video.preload = "auto";
  video.muted = true;
  video.playsInline = true;
  video.style.cssText =
    "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none";
  document.body.append(video);
  try {
    video.src = `/api/stream/video/${encodeURIComponent(videoId)}`;
    await waitForMediaEvent(video, "loadeddata");
    if (!video.videoWidth || !video.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context)
      throw new Error("This browser cannot capture video frames.");
    const captures = [];
    const files = [];
    for (const [exampleIndex, example] of examples.entries()) {
      const frames = [];
      const timestamps = feedbackFrameTimestamps(
        example.startSec, example.endSec);
      for (const [frameIndex, timestampSec] of timestamps.entries()) {
        if (Math.abs(video.currentTime - timestampSec) > 0.0005) {
          video.currentTime = timestampSec;
          await waitForMediaEvent(video, "seeked");
        }
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const blob = await canvasJpeg(canvas);
        const fieldName = `example-${exampleIndex + 1}-frame-${frameIndex + 1}`;
        frames.push({ fieldName, timestampSec });
        files.push({
          fieldName,
          file: new File(
            [blob],
            `${fieldName}.jpg`,
            { type: "image/jpeg" },
          ),
        });
      }
      captures.push({
        exampleId: example.id,
        expectedExampleRevision: example.revision,
        expectedRepresentationRevision: example.representationRevision,
        frames,
      });
    }
    return { captures, files };
  } finally {
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  }
}

function waitForMediaEvent(media, eventName) {
  if (eventName === "loadedmetadata" && media.readyState >= 1)
    return Promise.resolve();
  if (eventName === "loadeddata" && media.readyState >= 2)
    return Promise.resolve();
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => finish(
        reject,
        new Error("Timed out while reading video frames.")),
      30000,
    );
    const onSuccess = () => finish(resolve);
    const onError = () => finish(
      reject,
      new Error("The video could not be decoded for frame capture."));
    const finish = (callback, value) => {
      clearTimeout(timeout);
      media.removeEventListener(eventName, onSuccess);
      media.removeEventListener("error", onError);
      callback(value);
    };
    media.addEventListener(eventName, onSuccess, { once: true });
    media.addEventListener("error", onError, { once: true });
  });
}

function canvasJpeg(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => blob
        ? resolve(blob)
        : reject(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95,
    );
  });
}

function roundFeedbackTimestamp(value) {
  return Math.round(value * 1000) / 1000;
}
