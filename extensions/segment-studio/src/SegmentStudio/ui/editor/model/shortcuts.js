import { DEFAULT_PLAYBACK_SHORTCUT_CONFIG, PLAYBACK_SHORTCUTS_STORAGE_KEY, PLAYHEAD_ROUNDING_TOLERANCE_SECONDS, REVIEW_FILTER_STORAGE_KEY, REVIEW_STATES, SHORTCUT_BINDINGS_STORAGE_KEY } from "../../shared/constants.js";

export const SEGMENT_STUDIO_SHORTCUTS = [
  { id: "video.playPause", category: "Playback", bindings: [{ key: " " }, { key: "k" }], description: "Play or pause" },
  { id: "video.seekSmallBackward", category: "Playback", bindings: [{ key: "j" }], description: "Seek backward by the small interval" },
  { id: "video.seekSmallForward", category: "Playback", bindings: [{ key: "l" }], description: "Seek forward by the small interval" },
  { id: "video.seekMediumBackward", category: "Playback", bindings: [], description: "Seek backward by the medium interval" },
  { id: "video.seekMediumForward", category: "Playback", bindings: [], description: "Seek forward by the medium interval" },
  { id: "video.seekLongBackward", category: "Playback", bindings: [{ key: "j", ctrl: true, shift: true }], description: "Seek backward by the long interval" },
  { id: "video.seekLongForward", category: "Playback", bindings: [{ key: "l", ctrl: true, shift: true }], description: "Seek forward by the long interval" },
  { id: "video.playSelected", category: "Playback", bindings: [{ key: "Enter" }], description: "Play from the selected segment" },
  { id: "video.playPreviousSegment", category: "Playback", bindings: [{ key: "j", shift: true }], description: "Select and play the previous segment in this swimlane" },
  { id: "video.playNextSegment", category: "Playback", bindings: [{ key: "l", shift: true }], description: "Select and play the next segment in this swimlane" },
  ...Array.from({ length: 9 }, (_, index) => {
    const digit = index + 1;
    return {
      id: `video.seekPercent${digit * 10}`,
      category: "Playback",
      bindings: [{ key: String(digit) }],
      description: `Seek to ${digit * 10}% of the video`,
    };
  }),
  { id: "video.jumpToSegmentStart", category: "Playback", bindings: [{ key: "i" }], description: "Jump to the selected segment start" },
  { id: "video.jumpToVideoStart", category: "Playback", bindings: [{ key: "i", shift: true }], description: "Jump to the video start" },
  { id: "video.jumpToSegmentEnd", category: "Playback", bindings: [{ key: "o" }], description: "Jump to the selected segment end" },
  { id: "video.jumpToVideoEnd", category: "Playback", bindings: [{ key: "o", shift: true }], description: "Jump to the video end" },
  { id: "video.frameSmallBackward", category: "Playback", bindings: [{ key: "," }], description: "Step backward by the small frame count" },
  { id: "video.frameSmallForward", category: "Playback", bindings: [{ key: "." }], description: "Step forward by the small frame count" },
  { id: "video.frameMediumBackward", category: "Playback", bindings: [{ key: ",", code: "Comma", shift: true, label: "Shift+," }, { key: ";" }], description: "Step backward by the medium frame count" },
  { id: "video.frameMediumForward", category: "Playback", bindings: [{ key: ".", code: "Period", shift: true, label: "Shift+." }, { key: ":" }], description: "Step forward by the medium frame count" },
  { id: "video.frameLongBackward", category: "Playback", bindings: [{ key: ";", ctrl: true, label: "Ctrl+;" }, { key: ";", ctrl: true, shift: true, label: "Ctrl+Shift+;" }], description: "Step backward by the long frame count" },
  { id: "video.frameLongForward", category: "Playback", bindings: [{ key: ":", ctrl: true, shift: true, label: "Ctrl+Shift+:" }], description: "Step forward by the long frame count" },
  { id: "navigation.swimlaneUp", category: "Selection", bindings: [{ key: "ArrowUp" }], description: "Select nearest segment in the swimlane above" },
  { id: "navigation.swimlaneDown", category: "Selection", bindings: [{ key: "ArrowDown" }], description: "Select nearest segment in the swimlane below" },
  { id: "navigation.segmentGroupUp", category: "Selection", bindings: [{ key: "ArrowUp", shift: true }], description: "Select the swimlane group above" },
  { id: "navigation.segmentGroupDown", category: "Selection", bindings: [{ key: "ArrowDown", shift: true }], description: "Select the swimlane group below" },
  { id: "navigation.swimlaneLeft", category: "Selection", bindings: [{ key: "ArrowLeft" }], description: "Select previous segment in this swimlane" },
  { id: "navigation.swimlaneRight", category: "Selection", bindings: [{ key: "ArrowRight" }], description: "Select next segment in this swimlane" },
  { id: "navigation.extendSwimlaneLeft", category: "Selection", bindings: [{ key: "ArrowLeft", shift: true }], description: "Extend selection to the previous segment in this swimlane" },
  { id: "navigation.extendSwimlaneRight", category: "Selection", bindings: [{ key: "ArrowRight", shift: true }], description: "Extend selection to the next segment in this swimlane" },
  { id: "navigation.previousAtPlayhead", category: "Selection", bindings: [{ key: "[" }], description: "Select previous segment at the playhead" },
  { id: "navigation.nextAtPlayhead", category: "Selection", bindings: [{ key: "]" }], description: "Select next segment at the playhead" },
  { id: "navigation.nearestInCurrentSwimlane", category: "Selection", bindings: [{ key: "p" }], description: "Select the segment nearest the playhead in this swimlane" },
  { id: "navigation.previousUnreviewedInSwimlane", category: "Selection", bindings: [{ key: "n" }], description: "Select previous unreviewed segment in this swimlane", reviewOnly: true },
  { id: "navigation.previousUnreviewedGlobal", category: "Selection", bindings: [{ key: "n", shift: true }], description: "Select previous unreviewed segment across swimlanes", reviewOnly: true },
  { id: "navigation.nextUnreviewedInSwimlane", category: "Selection", bindings: [{ key: "m" }], description: "Select next unreviewed segment in this swimlane", reviewOnly: true },
  { id: "navigation.nextUnreviewedGlobal", category: "Selection", bindings: [{ key: "m", shift: true }], description: "Select next unreviewed segment across swimlanes", reviewOnly: true },
  { id: "navigation.nextTouchingPlayhead", category: "Selection", bindings: [{ key: "Tab" }], description: "Select next segment near the playhead" },
  { id: "navigation.previousTouchingPlayhead", category: "Selection", bindings: [{ key: "Tab", shift: true }], description: "Select previous segment near the playhead" },
  { id: "navigation.quickSearch", category: "Selection", bindings: [{ key: "f" }], description: "Quick-search visible segments" },
  { id: "navigation.previousShot", category: "Shots", bindings: [{ key: "y" }], description: "Jump to previous shot", reviewOnly: true },
  { id: "navigation.nextShot", category: "Shots", bindings: [{ key: "u" }], description: "Jump to next shot", reviewOnly: true },
  { id: "shot.split", category: "Shots", bindings: [{ key: "a", shift: true }, { key: "v" }], description: "Add or split a shot boundary at the playhead", reviewOnly: true },
  { id: "shot.merge", category: "Shots", bindings: [{ key: "v", shift: true }], description: "Remove the shot boundary at the playhead and merge adjacent shots", reviewOnly: true },
  { id: "markerGroup.toggleCollapse", category: "Segment groups", bindings: [{ key: "b" }], description: "Collapse or expand the selected segment group" },
  { id: "markerGroup.toggleAll", category: "Segment groups", bindings: [{ key: "b", shift: true }], description: "Collapse or expand all segment groups" },
  { id: "marker.create", category: "Editing", bindings: [{ key: "a" }], description: "Create segment at the playhead" },
  { id: "marker.duplicate", category: "Editing", bindings: [{ key: "d" }], description: "Duplicate selected segment in place" },
  { id: "marker.duplicateAtPlayhead", category: "Editing", bindings: [{ key: "d", shift: true }], description: "Duplicate selected segment at the playhead" },
  { id: "marker.split", category: "Editing", bindings: [{ key: "s" }], description: "Split selected segment at the playhead" },
  { id: "marker.editTag", category: "Editing", bindings: [{ key: "q" }], description: "Edit the selected segment tag" },
  { id: "marker.setStart", category: "Editing", bindings: [{ key: "w" }], description: "Set selected segment start to the playhead" },
  { id: "marker.setEnd", category: "Editing", bindings: [{ key: "e" }], description: "Set selected segment end to the playhead" },
  { id: "marker.copyTiming", category: "Editing", bindings: [{ key: "t" }], description: "Copy selected segment timing" },
  { id: "marker.pasteTiming", category: "Editing", bindings: [{ key: "t", shift: true }], description: "Paste copied timing onto the selected segment" },
  { id: "marker.mergeSelection", category: "Editing", bindings: [{ key: "r" }], description: "Merge selected segments in one swimlane" },
  { id: "marker.moveToBin", category: "Editing", bindings: [{ key: "x" }], description: "Move selected segments to the recycling bin", basicOnly: true },
  { id: "system.emptyBin", category: "Editing", bindings: [{ key: "x", shift: true }], description: "Empty the recycling bin", basicOnly: true },
  { id: "marker.toggleIncorrectExample", category: "AI feedback", bindings: [{ key: "c" }], description: "Collect selected eligible AI segments as incorrect examples" },
  { id: "marker.openIncorrectExamples", category: "AI feedback", bindings: [{ key: "c", shift: true }], description: "Manage incorrect examples and download an AI Feedback ZIP" },
  { id: "marker.assignSlots", category: "Editing", bindings: [{ key: "g" }], description: "Assign performers to segment slots", reviewOnly: true },
  { id: "navigation.centerPlayhead", category: "Timeline", bindings: [{ key: "h" }], description: "Center timeline on playhead" },
  { id: "navigation.zoomIn", category: "Timeline", bindings: [{ key: "+" }, { key: "=" }], description: "Zoom in" },
  { id: "navigation.zoomOut", category: "Timeline", bindings: [{ key: "-" }, { key: "_" }], description: "Zoom out" },
  { id: "navigation.resetZoom", category: "Timeline", bindings: [{ key: "0" }], description: "Fit timeline" },
  { id: "layout.growSwimlanes", category: "Timeline", bindings: [{ key: "ArrowUp", platform: true }], description: "Give swimlanes more height" },
  { id: "layout.shrinkSwimlanes", category: "Timeline", bindings: [{ key: "ArrowDown", platform: true }], description: "Give swimlanes less height" },
  { id: "marker.confirm", category: "Review", bindings: [{ key: "z" }], description: "Approve or unapprove segment", reviewOnly: true },
  { id: "system.publishApproved", category: "Review", bindings: [{ key: "z", shift: true }], description: "Preview approved draft publishing", reviewOnly: true },
  { id: "marker.reject", category: "Review", bindings: [{ key: "x" }], description: "Reject or unreject segment", reviewOnly: true },
  { id: "system.deleteRejected", category: "Review", bindings: [{ key: "x", shift: true }], description: "Delete all rejected segments", reviewOnly: true },
];

const SINGLE_SEGMENT_SHORTCUT_IDS = new Set([
  "video.playSelected",
  "video.jumpToSegmentStart",
  "video.jumpToSegmentEnd",
  "marker.duplicate",
  "marker.duplicateAtPlayhead",
  "marker.split",
  "marker.setStart",
  "marker.setEnd",
  "marker.copyTiming",
  "marker.pasteTiming",
]);

export function shortcutRequiresSingleSegment(shortcutId) {
  return SINGLE_SEGMENT_SHORTCUT_IDS.has(shortcutId);
}

function normalizeShortcutBinding(value) {
  if (!value || typeof value !== "object" || typeof value.key !== "string") return null;
  const key = value.key === " " ? " " : value.key.trim();
  const requestedCode = typeof value.code === "string" ? value.code.trim() : "";
  const code = ["Comma", "Period"].includes(requestedCode) ? requestedCode : "";
  if (!key || key.length > 32 || ["Control", "Shift", "Alt", "Meta"].includes(key)) return null;
  return {
    key,
    ...(code && code.length <= 32 ? { code } : {}),
    ...(value.ctrl ? { ctrl: true } : {}),
    ...(value.alt ? { alt: true } : {}),
    ...(value.shift ? { shift: true } : {}),
    ...(value.meta ? { meta: true } : {}),
    ...(value.platform ? { platform: true } : {}),
  };
}

export function parseShortcutBindingOverrides(raw) {
  try {
    const value = typeof raw === "string" ? JSON.parse(raw || "{}") : raw;
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const knownIds = new Set(SEGMENT_STUDIO_SHORTCUTS.map((shortcut) => shortcut.id));
    return Object.fromEntries(Object.entries(value)
      .filter(([id, bindings]) => knownIds.has(id) && Array.isArray(bindings))
      .map(([id, bindings]) => [id, bindings.slice(0, 4).map(normalizeShortcutBinding).filter(Boolean)]));
  } catch {
    return {};
  }
}

function readShortcutBindingOverrides() {
  try { return parseShortcutBindingOverrides(window.localStorage.getItem(SHORTCUT_BINDINGS_STORAGE_KEY)); }
  catch { return {}; }
}

function writeShortcutBindingOverrides(value) {
  const normalized = parseShortcutBindingOverrides(value);
  try { window.localStorage.setItem(SHORTCUT_BINDINGS_STORAGE_KEY, JSON.stringify(normalized)); }
  catch { /* Shortcut bindings remain usable for this render without persistence. */ }
  return normalized;
}

export function resolveSegmentStudioShortcuts(overrides = {}) {
  const normalized = parseShortcutBindingOverrides(overrides);
  return SEGMENT_STUDIO_SHORTCUTS.map((shortcut) => ({
    ...shortcut,
    bindings: Object.hasOwn(normalized, shortcut.id) ? normalized[shortcut.id] : shortcut.bindings,
  }));
}

export function splitShortcutCategoriesIntoColumns(shortcuts, columnCount = 2) {
  const categories = [...new Set(shortcuts.map((shortcut) => shortcut.category))];
  const groups = categories.map((category, index) => ({
    category,
    index,
    shortcuts: shortcuts.filter((shortcut) => shortcut.category === category),
  }));
  const count = Math.max(1, Math.min(groups.length || 1, Math.floor(columnCount) || 1));
  const columns = Array.from({ length: count }, () => ({ groups: [], weight: 0 }));
  [...groups]
    .sort((left, right) => (right.shortcuts.length - left.shortcuts.length) || (left.index - right.index))
    .forEach((group) => {
      const column = columns.reduce((lightest, candidate) => candidate.weight < lightest.weight ? candidate : lightest);
      column.groups.push(group);
      column.weight += group.shortcuts.length + 2;
    });
  return columns.map((column) => column.groups.sort((left, right) => left.index - right.index));
}

export function shortcutBindingFromEvent(event) {
  const key = String(event.key || "");
  if (!key || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(key)) return null;
  return normalizeShortcutBinding({
    key,
    code: event.code,
    ctrl: event.ctrlKey,
    alt: event.altKey,
    shift: event.shiftKey,
    meta: event.metaKey,
  });
}

export function shouldExitShortcutCapture(event) {
  return event.key === "Tab" && !event.ctrlKey && !event.altKey && !event.metaKey;
}

function shortcutBindingMatches(event, binding) {
  const eventKey = String(event.key || "").toLowerCase();
  const bindingKey = binding.key.toLowerCase();
  const physicalKeyMatches = binding.code
    && String(event.code || "").toLowerCase() === binding.code.toLowerCase();
  if (eventKey !== bindingKey && !physicalKeyMatches) return false;
  const implicitShift = "+_?:<>".includes(binding.key);
  const modifiersMatch = binding.platform
    ? Boolean(event.ctrlKey) !== Boolean(event.metaKey)
    : Boolean(event.ctrlKey) === Boolean(binding.ctrl) && Boolean(event.metaKey) === Boolean(binding.meta);
  return modifiersMatch
    && Boolean(event.altKey) === Boolean(binding.alt)
    && (implicitShift && !binding.shift ? true : Boolean(event.shiftKey) === Boolean(binding.shift));
}

function shortcutCodeMatchesKey(code, key) {
  const family = {
    comma: [",", "<"],
    period: [".", ">"],
  }[String(code || "").toLowerCase()];
  return Boolean(family?.includes(String(key || "").toLowerCase()));
}

export function shortcutBindingsOverlap(left, right) {
  if (!left || !right) return false;
  const keysMatch = String(left.key).toLowerCase() === String(right.key).toLowerCase();
  const codesMatch = left.code && right.code
    && String(left.code).toLowerCase() === String(right.code).toLowerCase();
  const leftCodeMatchesRightKey = shortcutCodeMatchesKey(left.code, right.key);
  const rightCodeMatchesLeftKey = shortcutCodeMatchesKey(right.code, left.key);
  if (!keysMatch && !codesMatch && !leftCodeMatchesRightKey && !rightCodeMatchesLeftKey) return false;
  const eventKey = leftCodeMatchesRightKey ? right.key : left.key;
  const eventCode = leftCodeMatchesRightKey ? left.code
    : rightCodeMatchesLeftKey ? right.code
      : codesMatch ? left.code : left.code || right.code;
  for (const ctrlKey of [false, true])
    for (const metaKey of [false, true])
      for (const altKey of [false, true])
        for (const shiftKey of [false, true]) {
          const event = {
            key: eventKey,
            code: eventCode,
            ctrlKey,
            metaKey,
            altKey,
            shiftKey,
          };
          if (shortcutBindingMatches(event, left) && shortcutBindingMatches(event, right)) return true;
        }
  return false;
}

export function shortcutAvailableInMode(shortcut, reviewMode = false) {
  return (!shortcut.reviewOnly || reviewMode) && (!shortcut.basicOnly || !reviewMode);
}

export function shortcutModesOverlap(left, right) {
  return [false, true].some((reviewMode) =>
    shortcutAvailableInMode(left, reviewMode) && shortcutAvailableInMode(right, reviewMode));
}

export function findEditorShortcut(event, reviewMode = false, overrides = {}) {
  return resolveSegmentStudioShortcuts(overrides).find((shortcut) => shortcutAvailableInMode(shortcut, reviewMode)
    && shortcut.bindings.some((binding) => shortcutBindingMatches(event, binding))) || null;
}

function shortcutBindingLabel(binding) {
  if (binding.label) return binding.label;
  return [binding.platform ? "Ctrl/Cmd" : binding.ctrl ? "Ctrl" : null, binding.alt ? "Alt" : null, binding.shift ? "Shift" : null,
    binding.meta ? "Meta" : null, binding.key === " " ? "Space" : binding.key].filter(Boolean).join("+");
}

export function shortcutBindingDisplayText(shortcut, capturing = false) {
  if (capturing) return "Press keys…";
  return shortcut.bindings.length ? shortcut.bindings.map(shortcutBindingLabel).join(" / ") : "Unassigned";
}

export function filterSegmentStudioShortcuts(shortcuts, query) {
  const normalizedQuery = String(query || "").trim().toLowerCase();
  if (!normalizedQuery) return shortcuts;
  return shortcuts.filter((shortcut) =>
    [shortcut.description, shortcut.category, shortcutBindingDisplayText(shortcut)]
      .some((value) => String(value || "").toLowerCase().includes(normalizedQuery)));
}

export function normalizeSegmentStudioMode(value) {
  return value === "review" ? "review" : "editor";
}

export function findSegmentByStableIdentity(segments, { itemId = null, nativeSegmentId = null } = {}) {
  if (itemId != null) {
    const item = (segments || []).find((segment) => segment.itemId === itemId);
    if (item) return item;
  }
  return nativeSegmentId == null
    ? null
    : (segments || []).find((segment) => segment.nativeSegmentId === nativeSegmentId) || null;
}

export function toggledSelectionReviewState(selectedSegments, state) {
  return (selectedSegments || []).length > 0
    && selectedSegments.every((segment) => segment.reviewState === state)
    ? "unreviewed"
    : state;
}

export function duplicateIdentityFromResponse(sourcePublished, response) {
  if (sourcePublished) {
    const nativeSegmentId = response?.nativeSegmentId ?? response?.id ?? null;
    if (nativeSegmentId == null) throw new Error("Duplicate response did not include a stable native identity.");
    return { nativeSegmentId };
  }
  const itemId = response?.createdDraft?.itemId ?? null;
  if (itemId == null) throw new Error("Duplicate response did not include a stable item identity.");
  return { itemId };
}

export function duplicateOperationKey(videoId, segment, atPlayhead, startSec) {
  const location = atPlayhead ? startSec : "in-place";
  return segment?.published
    ? `duplicate-native:${videoId}:${segment.nativeSegmentId ?? segment.id}:${segment.updatedAt}:${location}`
    : `duplicate-draft:${videoId}:${segment?.itemId}:${segment?.revision}:${location}`;
}

export function resolveSegmentCreationAction(segments, selectedSegment, requestedTagId = null) {
  const requested = Number(requestedTagId);
  if (requestedTagId != null && Number.isInteger(requested) && requested > 0)
    return { kind: "create", tagId: requested, openTagEditor: false };
  const selected = Number(selectedSegment?.tagId);
  if (Number.isInteger(selected) && selected > 0)
    return { kind: "create", tagId: selected, openTagEditor: true };
  return (segments || []).length === 0
    ? { kind: "choose-tag" }
    : { kind: "invalid-selection" };
}

export function shouldRestoreTransitionSelection(currentSelectionId, operatedSelectionId) {
  return currentSelectionId === operatedSelectionId;
}

export function findPublishedSelectionIdentity(segments, currentSelectionId, published) {
  const current = (segments || []).find((segment) => segment.id === currentSelectionId);
  return current?.itemId == null
    ? null
    : (published || []).find((identity) => identity.itemId === current.itemId) || null;
}

export function findAdjacentShot(shots, timeSec, direction) {
  const ordered = [...(shots || [])].sort((left, right) => left.startSec - right.startSec || left.id - right.id);
  if (direction < 0)
    return ordered.filter((shot) => shot.startSec < timeSec - PLAYHEAD_ROUNDING_TOLERANCE_SECONDS).at(-1) || null;
  return ordered.find((shot) => shot.startSec > timeSec + PLAYHEAD_ROUNDING_TOLERANCE_SECONDS) || null;
}

export function shotBoundaryFingerprint(shots) {
  return [...(shots || [])].sort((left, right) => left.startSec - right.startSec || left.id - right.id)
    .map((shot) => `${shot.id}:${shot.revision}`).join(",");
}

export function normalizeReviewFilter(value) {
  const candidate = value && typeof value === "object" ? value : {};
  return {
    query: typeof candidate.query === "string" ? candidate.query : "",
    reviewState: REVIEW_STATES.includes(candidate.reviewState) ? candidate.reviewState : "all",
    sort: ["default", "time", "updated"].includes(candidate.sort) ? candidate.sort : "default",
    direction: candidate.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(candidate.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(candidate.perPage) || 24)),
  };
}

export function initialReviewFilter(stored, videoId = null, focused = false) {
  const base = focused ? normalizeReviewFilter({}) : normalizeReviewFilter(stored);
  return videoId ? { ...base, videoId } : base;
}

function readReviewFilter() {
  try { return normalizeReviewFilter(JSON.parse(window.localStorage.getItem(REVIEW_FILTER_STORAGE_KEY) || "{}")); }
  catch { return normalizeReviewFilter({}); }
}

function writeReviewFilter(value) {
  try { window.localStorage.setItem(REVIEW_FILTER_STORAGE_KEY, JSON.stringify(normalizeReviewFilter(value))); }
  catch { /* Review filters remain usable without persistence. */ }
}

function boundedNumber(value, fallback, minimum, maximum) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.min(maximum, Math.max(minimum, numeric)) : fallback;
}

export function parsePlaybackShortcutConfig(raw) {
  try {
    const value = raw ? JSON.parse(raw) : {};
    return {
      smallSeekTime: boundedNumber(value.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: boundedNumber(value.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: boundedNumber(value.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(boundedNumber(value.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(boundedNumber(value.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(boundedNumber(value.longFrameStep, 30, 1, 300)),
    };
  } catch {
    return { ...DEFAULT_PLAYBACK_SHORTCUT_CONFIG };
  }
}

export function frameStepSeconds(frameCount, framesPerSecond = 30) {
  const fps = Number(framesPerSecond);
  return Number(frameCount) / (Number.isFinite(fps) && fps > 0 ? fps : 30);
}

function readPlaybackShortcutConfig() {
  try { return parsePlaybackShortcutConfig(window.localStorage.getItem(PLAYBACK_SHORTCUTS_STORAGE_KEY)); }
  catch { return { ...DEFAULT_PLAYBACK_SHORTCUT_CONFIG }; }
}

function writePlaybackShortcutConfig(value) {
  const normalized = parsePlaybackShortcutConfig(JSON.stringify(value));
  try { window.localStorage.setItem(PLAYBACK_SHORTCUTS_STORAGE_KEY, JSON.stringify(normalized)); }
  catch { /* Playback settings remain usable without persistence. */ }
  return normalized;
}

export { SINGLE_SEGMENT_SHORTCUT_IDS, normalizeShortcutBinding, readShortcutBindingOverrides, writeShortcutBindingOverrides, shortcutBindingMatches, shortcutCodeMatchesKey, shortcutBindingLabel, readReviewFilter, writeReviewFilter, boundedNumber, readPlaybackShortcutConfig, writePlaybackShortcutConfig };
