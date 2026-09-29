import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";
import * as runtimeComponents from "@cove/runtime/components";

const h = React.createElement;
const SEGMENT_SAMPLE_SIZE = 100;
const MAXIMUM_MOMENTS = 8;
const TAG_SCAN_PAGE_SIZE = 60;
const TAG_SCAN_PAGES = 20;

// Cove's tag cards frame their media at 16:9. Contributed entity.media always declares its shape in
// data-entity-media-aspect-ratio, which Cove's hover frame follows, but the Tags grid cards take that shape only
// when Animated Tag Previews is set to match it, which it marks with an atp-aspect-* class on the media.
export const DEFAULT_MEDIA_ASPECT_RATIO = "16 / 9";
const CARD_SHAPE_OPT_IN = /(^|\s)atp-aspect-\S+/;

// Hosts older than the EntityMedia export lack it, and a named import of a missing export would fail the whole
// bundle, so these are read from the namespace and fall back to local rendering.
const EntityMedia = runtimeComponents.EntityMedia;
const NarrativeText = runtimeComponents.NarrativeText;
const useAppConfig = runtimeComponents.useAppConfig ?? (() => null);

// Pure model helpers, exported for tests/tag-of-the-day-model.test.mjs.

export function clamp(value, min, max, fallback) {
  const number = value === null || value === "" ? Number.NaN : Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

export const MOMENT_SOURCES = [
  { value: "any", label: "No preference", hint: "Mix tagged moments and tagged videos." },
  { value: "prefer", label: "Prefer tagged moments", hint: "Show moments first, and tagged videos when there are too few." },
  { value: "only", label: "Only tags with tagged moments", hint: "Feature only tags that have tagged moments, and show only those." },
];

export function readSettings(configuration) {
  const source = MOMENT_SOURCES.some((option) => option.value === configuration?.momentSource)
    ? configuration.momentSource
    : "prefer";
  return {
    minimumVideos: clamp(configuration?.minimumVideos, 1, 1000, 3),
    momentCount: clamp(configuration?.momentCount, 0, MAXIMUM_MOMENTS, 4),
    momentSource: source,
  };
}

export function dailyKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function stableSeed(...parts) {
  const value = parts.join(":");
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) & 0x7fffffff;
}

// Mulberry32: a small seeded generator whose output is uniform in [0, 1). A plain LCG taken modulo the
// range is not, because its low bits repeat in short cycles and favour the first items of the list.
function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = Math.imul(state ^ (state >>> 15), state | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function deterministicShuffle(items, seed) {
  const result = [...items];
  const random = seededRandom(seed || 1);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

// A shuffle draws a fresh random revision instead of counting up, so it does not replay the same sequence after
// every reload. The revision is remembered for the widget and day, so a reload keeps the shuffled tag and
// midnight starts again from the day's own pick (revision 0).
export function shuffleStorageKey(instanceId) {
  return `com.midnightrider.tag-of-the-day:shuffle:${instanceId}`;
}

export function storedRevision(raw, day) {
  try {
    const stored = JSON.parse(raw);
    return stored?.day === day && Number.isSafeInteger(stored.revision) && stored.revision > 0 ? stored.revision : 0;
  } catch {
    return 0;
  }
}

export function randomRevision(randomValue = Math.random()) {
  return 1 + Math.floor(randomValue * 0x7ffffffe);
}

// Reads a `width:height` or `width / height` declaration the way Cove's hover frame does, as a CSS aspect-ratio.
export function parseAspectRatio(raw) {
  const match = typeof raw === "string" ? raw.match(/^\s*(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)\s*$/) : null;
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  return Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0 ? `${width} / ${height}` : null;
}

// The shape a tag card gives this media: the declared one when the media opts into card shaping, else none.
export function cardAspectRatio(declared, className) {
  return CARD_SHAPE_OPT_IN.test(className ?? "") ? parseAspectRatio(declared) : null;
}

export function aspectRatioValue(aspectRatio) {
  const [width, height] = aspectRatio.split("/").map(Number);
  return width / height;
}

function segmentMoment(segment) {
  return {
    kind: "segment",
    key: `segment-${segment.id}`,
    segmentId: segment.id,
    videoId: segment.videoId,
    videoTitle: segment.videoTitle,
    title: segment.title,
    startSec: segment.startSec,
    endSec: segment.endSec,
  };
}

function videoMoment(video) {
  return {
    kind: "video",
    key: `video-${video.id}`,
    videoId: video.id,
    videoTitle: video.title,
    imagePath: video.imagePath,
    updatedAt: video.updatedAt,
    duration: video.files?.[0]?.duration || 0,
  };
}

// Takes moments in order, first one per video, then further moments from videos already shown. A tagged video is
// never repeated, since its still would only duplicate a moment from it.
function takeSpread(candidates, count) {
  const picked = [];
  const repeats = [];
  const shown = new Set();
  for (const moment of candidates) {
    if (!shown.has(moment.videoId)) {
      shown.add(moment.videoId);
      picked.push(moment);
    } else if (moment.kind === "segment") {
      repeats.push(moment);
    }
  }
  return [...picked, ...repeats].slice(0, count);
}

// Moments for the featured tag. "prefer" shows the sampled segments, spread across as many videos as possible,
// before any tagged video; "any" mixes segments and tagged videos at random; "only" shows segments alone.
export function pickMoments(segments, videos, count, seed, source = "prefer") {
  if (count <= 0) return [];
  const segmentMoments = takeSpread(deterministicShuffle(segments, seed).map(segmentMoment), segments.length);
  if (source === "only") return segmentMoments.slice(0, count);
  const videoMoments = videos.map(videoMoment);
  // Equal-sized pools, so a tag with many segments still shows its tagged videos about as often as its moments.
  if (source === "any") {
    const pool = [...segmentMoments.slice(0, count), ...videoMoments.slice(0, count)];
    return takeSpread(deterministicShuffle(pool, stableSeed(seed, "mix")), count);
  }
  const moments = segmentMoments.slice(0, count);
  const shown = new Set(moments.map((moment) => moment.videoId));
  for (const moment of videoMoments) {
    if (moments.length >= count) break;
    if (shown.has(moment.videoId)) continue;
    shown.add(moment.videoId);
    moments.push(moment);
  }
  return moments;
}

export function momentLength(moment) {
  if (moment.kind === "video") return moment.duration > 0 ? moment.duration : null;
  return Number.isFinite(moment.endSec) && moment.endSec > moment.startSec ? moment.endSec - moment.startSec : null;
}

export function formatDuration(seconds) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remaining = value % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
    : `${minutes}:${String(remaining).padStart(2, "0")}`;
}

export function countLabel(count, singular, plural) {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

// The tag's usage, each opening the tag page on the matching tab. Only non-zero counts are listed.
export function tagFacts(tag) {
  return [
    { key: "videos", value: tag.videoCount || 0, singular: "Video", plural: "Videos", tab: "videos" },
    { key: "segments", value: tag.segmentCount || 0, singular: "Tagged moment", plural: "Tagged moments", tab: "segments" },
    { key: "performers", value: tag.performerCount || 0, singular: "Performer", plural: "Performers", tab: "performers" },
  ].filter((fact) => fact.value > 0);
}

export function momentsHeading(moments, tag) {
  const segments = moments.filter((moment) => moment.kind === "segment").length;
  if (segments === moments.length && (tag.segmentCount || 0) > 0) {
    return { title: "Tagged moments", total: `${moments.length.toLocaleString()} of ${(tag.segmentCount || 0).toLocaleString()}` };
  }
  if (segments === 0) {
    return { title: "Tagged videos", total: `${moments.length.toLocaleString()} of ${(tag.videoCount || 0).toLocaleString()}` };
  }
  return { title: "Tagged moments and videos", total: null };
}

// Widget runtime.

function useDailyKey() {
  const [key, setKey] = React.useState(() => dailyKey());
  React.useEffect(() => {
    let timeout;
    const refresh = () => setKey(dailyKey());
    const schedule = () => {
      clearTimeout(timeout);
      const now = new Date();
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1);
      timeout = setTimeout(() => {
        refresh();
        schedule();
      }, Math.max(1_000, next.getTime() - now.getTime()));
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
        schedule();
      }
    };
    schedule();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);
  return key;
}

async function requestJson(path, init) {
  const response = await extensionFetch(path, init);
  if (!response.ok) {
    let detail = "";
    try {
      const problem = await response.json();
      detail = problem?.detail || problem?.title || "";
    } catch {}
    throw new Error(detail || `Cove returned ${response.status}.`);
  }
  return response.json();
}

function find(entity, findFilter, objectFilter, signal) {
  return requestJson(`/api/${entity}/find`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findFilter, objectFilter }),
    signal,
  });
}

const HOST_API = { find, requestJson };

// Cove's tag filter has no segment count, so a tag with tagged moments is found by walking the same seeded random
// order a page at a time; segmentCount is in each result.
// `capped` is true when the scan stopped at its page limit rather than at the end of the tags.
export async function findFeaturedTag(api, { minimumVideos, requireMoments, seed }, signal) {
  const objectFilter = { videoCountCriterion: { value: minimumVideos - 1, modifier: "greaterThan" } };
  const perPage = requireMoments ? TAG_SCAN_PAGE_SIZE : 1;
  const pages = requireMoments ? TAG_SCAN_PAGES : 1;
  for (let page = 1; page <= pages; page += 1) {
    const result = await api.find("tags", { page, perPage, sort: "random", direction: "asc", seed }, objectFilter, signal);
    const items = result.items ?? [];
    const tag = requireMoments ? items.find((candidate) => (candidate.segmentCount || 0) > 0) : items[0];
    if (tag) return { tag, capped: false };
    const total = Number.isFinite(result.totalCount) ? result.totalCount : Number.POSITIVE_INFINITY;
    if (items.length < perPage || page * perPage >= total) return { tag: null, capped: false };
  }
  return { tag: null, capped: requireMoments };
}

export async function loadTagOfTheDay(api, { day, instanceId, minimumVideos, momentCount, momentSource, revision }, signal) {
  const { tag, capped } = await findFeaturedTag(api, {
    minimumVideos,
    requireMoments: momentSource === "only",
    seed: stableSeed(day, instanceId, "tag", revision),
  }, signal);
  if (!tag) return { tag: null, moments: [], capped };
  if (momentCount === 0) return { tag, moments: [] };

  const segments = (tag.segmentCount || 0) > 0
    ? await api.requestJson(`/api/tags/${tag.id}/segments?count=${SEGMENT_SAMPLE_SIZE}`, { signal })
    : [];
  const sample = Array.isArray(segments) ? segments : [];
  const momentSeed = stableSeed(day, instanceId, "moments", revision);
  const needsVideos = momentSource === "any" || (momentSource === "prefer" && sample.length < momentCount);
  const videos = needsVideos
    ? (await api.find("videos", {
      page: 1,
      perPage: momentCount,
      sort: "random",
      direction: "asc",
      seed: stableSeed(day, instanceId, "videos", revision),
    }, { tagsCriterion: { value: [tag.id], modifier: "includes" } }, signal)).items ?? []
    : [];
  return { tag, moments: pickMoments(sample, videos, momentCount, momentSeed, momentSource) };
}

// Keeps the previous result on screen while a shuffle or midnight refresh loads, so the widget dims instead of collapsing.
function useTagOfTheDay(request) {
  const [attempt, setAttempt] = React.useState(0);
  const [state, setState] = React.useState({ loading: true, value: undefined, error: null });
  const { day, instanceId, minimumVideos, momentCount, momentSource, revision } = request;
  React.useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ loading: true, value: previous.value, error: null }));
    loadTagOfTheDay(HOST_API, request, controller.signal)
      .then((value) => setState({ loading: false, value, error: null }))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ loading: false, value: undefined, error: error instanceof Error ? error : new Error("Unable to load today’s tag.") });
      });
    return () => controller.abort();
  }, [day, instanceId, minimumVideos, momentCount, momentSource, revision, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}

function readStorage(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

function useShuffleRevision(day, instanceId) {
  const key = shuffleStorageKey(instanceId);
  const [shuffled, setShuffled] = React.useState(() => ({ key, day, revision: storedRevision(readStorage(key), day) }));
  let current = shuffled;
  // A new day or widget reads its stored shuffle once, during render, instead of on every later render.
  if (shuffled.key !== key || shuffled.day !== day) {
    current = { key, day, revision: storedRevision(readStorage(key), day) };
    setShuffled(current);
  }
  // Dated by the clock rather than the rendered day, so a click just after midnight is not saved under yesterday.
  const shuffle = () => {
    const next = { key, day: dailyKey(), revision: randomRevision() };
    writeStorage(key, JSON.stringify({ day: next.day, revision: next.revision }));
    setShuffled(next);
  };
  return [current.revision, shuffle];
}

function useReducedMotion() {
  const [reduced, setReduced] = React.useState(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);
  React.useEffect(() => {
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!query) return undefined;
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  return reduced;
}

function useImageFit() {
  const appConfig = useAppConfig();
  return appConfig?.config?.ui?.imageObjectFit === "contain" ? "contain" : "cover";
}

function TagIcon({ size = 40 }) {
  return h("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
    h("path", { d: "M12.6 2.6A2 2 0 0 0 11.2 2H4a2 2 0 0 0-2 2v7.2a2 2 0 0 0 .6 1.4l8.7 8.7a2.4 2.4 0 0 0 3.4 0l6.6-6.6a2.4 2.4 0 0 0 0-3.4Z" }),
    h("circle", { cx: 7.5, cy: 7.5, r: 1.2 }));
}

function ShuffleIcon() {
  return h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
    h("path", { d: "M16 3h5v5" }), h("path", { d: "M4 20 21 3" }), h("path", { d: "M21 16v5h-5" }),
    h("path", { d: "m15 15 6 6" }), h("path", { d: "M4 4l5 5" }));
}

function PlayIcon() {
  return h("svg", { width: 9, height: 9, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true },
    h("path", { d: "M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" }));
}

function WarningIcon() {
  return h("svg", { width: 40, height: 40, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
    h("path", { d: "M12 3 2.5 20h19L12 3Z" }), h("path", { d: "M12 10v4.5" }), h("path", { d: "M12 17.5h.01" }));
}

function StaticTagImage({ tag, fit }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [tag.imagePath]);
  if (!tag.imagePath || failed) {
    return h("span", { className: "totd-media__fallback" }, h(TagIcon));
  }
  return h("img", {
    src: tag.imagePath,
    alt: tag.name,
    className: `totd-media__image totd-fit-${fit}`,
    loading: "eager",
    decoding: "async",
    onError: () => setFailed(true),
  });
}

// The tag's primary media, rendered through Cove's entity.media boundary like a tag card, so a contributed animated
// preview plays here too. The frame takes the shape a Tags grid card gives it (see cardAspectRatio).
function TagMedia({ tag, onOpen }) {
  const frameRef = React.useRef(null);
  const fit = useImageFit();
  const [aspectRatio, setAspectRatio] = React.useState(DEFAULT_MEDIA_ASPECT_RATIO);

  React.useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return undefined;
    const update = () => {
      const media = frame.querySelector("[data-entity-media-aspect-ratio]");
      const next = cardAspectRatio(media?.dataset.entityMediaAspectRatio, media?.getAttribute("class")) ?? DEFAULT_MEDIA_ASPECT_RATIO;
      setAspectRatio((current) => (current === next ? current : next));
    };
    update();
    const observer = new MutationObserver(update);
    observer.observe(frame, { attributes: true, attributeFilter: ["data-entity-media-aspect-ratio", "class"], childList: true, subtree: true });
    return () => observer.disconnect();
  }, [tag.id]);

  const renderDefault = () => h(StaticTagImage, { tag, fit });
  const media = EntityMedia
    ? h(EntityMedia, {
      entityType: "tag",
      entityId: tag.id,
      surface: "card",
      imageUrl: tag.imagePath ?? null,
      alt: tag.name,
      fit,
      loading: "eager",
      className: `totd-media__content totd-fit-${fit}`,
      renderDefault,
    })
    : renderDefault();

  return h("button", {
    ref: frameRef,
    type: "button",
    className: "totd-media",
    style: { "--totd-ratio": aspectRatio, "--totd-ratio-value": aspectRatioValue(aspectRatio) },
    "data-aspect-ratio": aspectRatio,
    onClick: onOpen,
    "aria-label": `Open tag ${tag.name}`,
  }, media);
}

function Description({ text }) {
  const ref = React.useRef(null);
  const [clipped, setClipped] = React.useState(false);
  React.useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return undefined;
    const measure = () => setClipped(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = typeof ResizeObserver === "function" ? new ResizeObserver(measure) : null;
    observer?.observe(element);
    return () => observer?.disconnect();
  }, [text]);
  return h("div", { ref, className: `totd-description${clipped ? " is-clipped" : ""}` },
    NarrativeText ? h(NarrativeText, null, text) : h("p", null, text));
}

function momentPoster(moment) {
  if (moment.kind === "segment") return `/api/segments/${moment.segmentId}/image?max=640`;
  if (moment.imagePath) return moment.imagePath;
  const version = moment.updatedAt ? `&v=${encodeURIComponent(moment.updatedAt)}` : "";
  return `/api/videos/${moment.videoId}/image?max=640${version}`;
}

function momentFallbackPoster(moment) {
  return moment.kind === "segment" ? `/api/stream/video/${moment.videoId}/screenshot?seconds=${encodeURIComponent(moment.startSec)}` : null;
}

// Plays the tagged stretch muted while the moment is hovered or focused, like Cove's segment cards; a video without
// a segment plays its generated preview clip. The source is released once the element has left the page, because
// Chromium keeps downloading a detached media element until it is garbage collected.
function MomentPreview({ moment }) {
  const videoRef = React.useRef(null);
  const [failed, setFailed] = React.useState(false);
  const segment = moment.kind === "segment";
  const src = segment ? `/api/stream/video/${moment.videoId}` : `/api/stream/video/${moment.videoId}/preview`;

  React.useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (!video || video.isConnected) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, failed]);

  if (failed) return null;
  return h("video", {
    ref: videoRef,
    className: "totd-moment__video",
    src,
    muted: true,
    autoPlay: true,
    playsInline: true,
    loop: !segment,
    disableRemotePlayback: true,
    preload: "auto",
    "aria-hidden": true,
    onLoadedMetadata: (event) => {
      if (segment) event.currentTarget.currentTime = moment.startSec;
    },
    onTimeUpdate: (event) => {
      const end = Number.isFinite(moment.endSec) && moment.endSec > moment.startSec ? moment.endSec : moment.startSec + 30;
      if (segment && event.currentTarget.currentTime >= end) event.currentTarget.currentTime = moment.startSec;
    },
    // A stretch that runs to the end of the file ends the video instead of reaching its end time, so loop it here.
    onEnded: (event) => {
      if (!segment) return;
      event.currentTarget.currentTime = moment.startSec;
      event.currentTarget.play().catch(() => {});
    },
    onError: () => setFailed(true),
  });
}

function Moment({ moment, reducedMotion, onNavigate }) {
  const [poster, setPoster] = React.useState(() => momentPoster(moment));
  const [posterFailed, setPosterFailed] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const length = momentLength(moment);
  const title = moment.videoTitle || "Untitled video";
  const subtitle = moment.kind === "segment" ? (moment.title || "Tagged moment") : "Tagged video";
  const onPosterError = () => {
    const fallback = momentFallbackPoster(moment);
    if (fallback && poster !== fallback) setPoster(fallback);
    else setPosterFailed(true);
  };
  const open = () => onNavigate(moment.kind === "segment"
    ? { page: "video", id: moment.videoId, seekTo: moment.startSec }
    : { page: "video", id: moment.videoId });

  return h("button", {
    type: "button",
    className: "totd-moment",
    onClick: open,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onFocus: (event) => setFocused(event.currentTarget.matches(":focus-visible")),
    onBlur: () => setFocused(false),
    "aria-label": moment.kind === "segment"
      ? `Play ${title} from ${formatDuration(moment.startSec)}, ${subtitle}`
      : `Play ${title}`,
  },
  h("span", { className: "totd-moment__media" },
    posterFailed ? null : h("img", { src: poster, alt: "", loading: "lazy", decoding: "async", onError: onPosterError }),
    (hovered || focused) && !reducedMotion ? h(MomentPreview, { moment }) : null,
    moment.kind === "segment"
      ? h("span", { className: "totd-badge totd-badge--start" }, h(PlayIcon), formatDuration(moment.startSec))
      : null,
    length ? h("span", { className: "totd-badge totd-badge--length" }, formatDuration(length)) : null),
  h("span", { className: "totd-moment__text" },
    h("span", { className: "totd-moment__title" }, title),
    h("span", { className: "totd-moment__subtitle" }, subtitle)));
}

function Moments({ tag, moments, reducedMotion, onNavigate }) {
  const heading = momentsHeading(moments, tag);
  return h("div", { className: "totd-moments" },
    h("div", { className: "totd-moments__header" },
      h("span", { className: "totd-moments__title" }, heading.title),
      heading.total ? h("span", { className: "totd-moments__total" }, heading.total) : null),
    h("div", {
      className: "totd-moments__items",
      role: "group",
      "aria-label": heading.title,
    }, moments.map((moment) => h(Moment, { key: moment.key, moment, reducedMotion, onNavigate }))));
}

function Message({ icon, tone, title, children, action }) {
  return h("div", { className: `totd-message totd-message--${tone}`, role: tone === "error" ? "alert" : undefined },
    h("span", { className: "totd-message__icon" }, icon),
    h("strong", null, title),
    h("p", null, children),
    action || null);
}

function Skeleton() {
  return h("div", { className: "totd-skeleton", role: "status", "aria-label": "Loading today’s tag" },
    h("span", { className: "totd-skeleton__media" }),
    h("span", { className: "totd-skeleton__lines" },
      h("span", { className: "totd-skeleton__line" }),
      h("span", { className: "totd-skeleton__line" }),
      h("span", { className: "totd-skeleton__line totd-skeleton__line--short" })));
}

function Featured({ tag, moments, momentCount, reducedMotion, onNavigate }) {
  const openTag = (detailTab) => onNavigate(detailTab ? { page: "tag", id: tag.id, detailTab } : { page: "tag", id: tag.id });
  const facts = tagFacts(tag);
  const aliases = (tag.aliases || []).filter(Boolean);
  return h(React.Fragment, null,
    h("div", { className: "totd-hero" },
      h(TagMedia, { tag, onOpen: () => openTag() }),
      h("div", { className: "totd-info" },
        tag.tagGroupName || aliases.length > 0
          ? h("div", { className: "totd-meta" },
            tag.tagGroupName
              ? h("span", { className: "totd-group" },
                h("span", { className: "totd-group__dot", style: { background: tag.tagGroupColor || "currentColor" }, "aria-hidden": true }),
                tag.tagGroupName)
              : null,
            aliases.length > 0 ? h("span", { className: "totd-aliases" }, `Also known as ${aliases.slice(0, 3).join(", ")}`) : null)
          : null,
        tag.description
          ? h(Description, { text: tag.description })
          : h("p", { className: "totd-description totd-description--empty" }, "This tag has no description yet."),
        facts.length > 0
          ? h("div", { className: "totd-facts" }, facts.map((fact) => h("button", {
            key: fact.key,
            type: "button",
            className: "totd-fact",
            onClick: () => openTag(fact.tab),
            "aria-label": `${countLabel(fact.value, fact.singular.toLowerCase(), fact.plural.toLowerCase())}, open on the tag page`,
          },
          h("span", { className: "totd-fact__value" }, fact.value.toLocaleString()),
          h("span", { className: "totd-fact__label" }, fact.value === 1 ? fact.singular : fact.plural))))
          : null)),
    momentCount > 0
      ? moments.length > 0
        ? h(Moments, { tag, moments, reducedMotion, onNavigate })
        : h("p", { className: "totd-inline-empty" }, "No tagged moments or videos are available to preview.")
      : null,
    h("button", { type: "button", className: "totd-pill totd-open-bottom", onClick: () => openTag() }, "Open Tag"));
}

function TagOfTheDayWidget({ configuration, instanceId, onNavigate }) {
  const { minimumVideos, momentCount, momentSource } = readSettings(configuration);
  const day = useDailyKey();
  const reducedMotion = useReducedMotion();
  const [revision, shuffle] = useShuffleRevision(day, instanceId);
  const state = useTagOfTheDay({ day, instanceId, minimumVideos, momentCount, momentSource, revision });
  const tag = state.value?.tag;

  let body;
  if (state.error) {
    body = h(Message, {
      icon: h(WarningIcon), tone: "error", title: "Couldn’t Load Today’s Tag",
      action: h("button", { type: "button", className: "totd-pill totd-pill--accent", onClick: state.retry }, "Try Again"),
    }, state.error.message);
  } else if (state.value === undefined) {
    body = h(Skeleton);
  } else if (!tag) {
    body = h(Message, { icon: h(TagIcon), tone: "empty", title: "No Tag to Feature" },
      momentSource === "only"
        ? state.value.capped
          ? `None of the first ${(TAG_SCAN_PAGE_SIZE * TAG_SCAN_PAGES).toLocaleString()} tags on at least ${countLabel(minimumVideos, "video", "videos")} has tagged moments. Shuffle to look through others, or allow tags without moments in this widget’s settings.`
          : `No tag on at least ${countLabel(minimumVideos, "video", "videos")} has tagged moments yet. You can lower the minimum or allow tags without moments in this widget’s settings.`
        : `No tag is on at least ${countLabel(minimumVideos, "video", "videos")} yet. You can lower the minimum in this widget’s settings.`);
  } else {
    body = h("div", { className: "totd-body", "aria-busy": state.loading },
      h(Featured, { tag, moments: state.value.moments, momentCount, reducedMotion, onNavigate }));
  }

  return h("section", { className: "totd", "aria-label": tag ? `Tag of the Day, ${tag.name}` : "Tag of the Day" },
    h("div", { className: "totd-card" },
      h("header", { className: "totd-header" },
        h("div", { className: "totd-heading" },
          h("span", { className: "totd-eyebrow" }, "Tag of the Day"),
          tag ? h("h2", null, tag.name) : null),
        h("div", { className: "totd-actions" },
          h("button", {
            type: "button",
            className: "totd-shuffle",
            onClick: () => { if (!state.loading) shuffle(); },
            "aria-disabled": state.loading,
            "aria-label": "Shuffle Tag of the Day",
            title: "Shuffle Tag of the Day",
          }, h(ShuffleIcon)),
          tag ? h("button", { type: "button", className: "totd-open", onClick: () => onNavigate({ page: "tag", id: tag.id }) }, "Open Tag") : null)),
      body));
}

function Stepper({ id, label, value, min, max, onChange, fewer, more }) {
  return h("div", { className: "totd-editor__row" },
    h("span", { id: `${id}-label` }, label),
    h("div", { className: "totd-stepper", role: "group", "aria-labelledby": `${id}-label` },
      h("button", { type: "button", onClick: () => onChange(value - 1), disabled: value <= min, "aria-label": fewer }, "−"),
      h("output", { "aria-live": "polite" }, value),
      h("button", { type: "button", onClick: () => onChange(value + 1), disabled: value >= max, "aria-label": more }, "+")));
}

function TagOfTheDayEditor({ configuration, onChange, onValidityChange }) {
  const { minimumVideos, momentCount, momentSource } = readSettings(configuration);
  React.useEffect(() => onValidityChange(true), [onValidityChange]);
  const update = (key, value) => onChange({ ...(configuration || {}), [key]: value });
  return h("fieldset", { className: "totd-editor" },
    h("legend", null, "Tag of the Day"),
    h("p", { className: "totd-editor__lead" }, "Choose which tags can be featured and how many tagged moments to show with them."),
    h("div", { className: "totd-editor__group" },
      h(Stepper, {
        id: "totd-minimum", label: "Minimum videos", value: minimumVideos, min: 1, max: 1000,
        onChange: (value) => update("minimumVideos", clamp(value, 1, 1000, 3)), fewer: "Require fewer videos", more: "Require more videos",
      }),
      h("input", {
        type: "range", min: 1, max: 100, value: Math.min(100, minimumVideos), "aria-labelledby": "totd-minimum-label",
        onChange: (event) => update("minimumVideos", Number(event.target.value)),
      }),
      h("span", { className: "totd-editor__hint" }, "Only tags on at least this many videos are featured.")),
    h("div", { className: "totd-editor__group" },
      h(Stepper, {
        id: "totd-moments", label: "Moments shown", value: momentCount, min: 0, max: MAXIMUM_MOMENTS,
        onChange: (value) => update("momentCount", clamp(value, 0, MAXIMUM_MOMENTS, 4)), fewer: "Show fewer moments", more: "Show more moments",
      }),
      h("input", {
        type: "range", min: 0, max: MAXIMUM_MOMENTS, value: momentCount, "aria-labelledby": "totd-moments-label",
        onChange: (event) => update("momentCount", Number(event.target.value)),
      })),
    h("div", { className: "totd-editor__choices", role: "radiogroup", "aria-labelledby": "totd-source-label" },
      h("span", { id: "totd-source-label", className: "totd-editor__choices-label" }, "Tagged moments"),
      MOMENT_SOURCES.map((option) => h("label", { key: option.value, className: "totd-editor__choice" },
        h("input", {
          type: "radio",
          name: "totd-moment-source",
          value: option.value,
          checked: momentSource === option.value,
          onChange: () => update("momentSource", option.value),
        }),
        h("span", { className: "totd-editor__toggle-text" },
          h("span", null, option.label),
          h("span", { className: "totd-editor__hint" }, option.hint))))),
    h("p", { className: "totd-editor__note" }, "The tag changes at midnight. Shuffle picks another tag and other moments."));
}

export default {
  components: {
    TagOfTheDayWidget,
    TagOfTheDayEditor,
  },
};
