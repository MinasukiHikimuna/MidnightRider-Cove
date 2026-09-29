import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";

const h = React.createElement;
const CANDIDATES_ENDPOINT = "/api/plugins/com.midnightrider.blast-from-the-past/candidates";
const HISTORY_CONCURRENCY = 4;
const VIDEO_BATCH_SIZE = 24;
const POOL_TARGET = 36;

// How far a like may sit from its session, and from the pause or playback it is matched to.
const SESSION_LEAD_MS = 10_000;
const SESSION_TAIL_MS = 120_000;
const PAUSE_BEFORE_MS = 90_000;
const PAUSE_AFTER_MS = 15_000;
const RUN_GAP_MS = 120_000;

// Pure model helpers, exported for tests/blast-from-the-past-model.test.mjs.

export function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

export function readSettings(configuration) {
  return {
    count: clamp(configuration?.count, 1, 12, 6),
    leadSeconds: clamp(configuration?.leadSeconds, 0, 120, 15),
    clipSeconds: clamp(configuration?.clipSeconds, 5, 180, 30),
    autoplay: typeof configuration?.autoplay === "boolean" ? configuration.autoplay : true,
  };
}

// A fresh seed for every load and shuffle, so each visit shows a different set of moments.
export function randomSeed() {
  const values = new Uint32Array(1);
  globalThis.crypto.getRandomValues(values);
  return (values[0] & 0x7fffffff) || 1;
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

function time(value) {
  if (value == null) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isMovingSeek(event) {
  const from = Number(event.meta?.fromSec);
  const to = Number(event.meta?.toSec);
  return event.kind === "seek" && Number.isFinite(to) && (!Number.isFinite(from) || Math.abs(to - from) >= 1);
}

// Normalizes a video history response into millisecond timestamps.
export function parseHistory(history) {
  const sessions = (history?.sessions ?? []).map((session) => ({
    startedAt: time(session.startedAt),
    lastSeenAt: time(session.lastSeenAt),
    endedAt: time(session.endedAt),
    lastPositionSec: session.lastPositionSec ?? null,
    mediaDurationSec: Number(session.mediaDurationSec) || 0,
    runs: (session.intervals ?? [])
      .map((run) => ({ startSec: Number(run.startSec), endSec: Number(run.endSec), recordedAt: time(run.recordedAt) }))
      .filter((run) => run.endSec > run.startSec && run.recordedAt != null),
  })).filter((session) => session.startedAt != null && session.lastSeenAt != null);
  const events = (history?.events ?? [])
    .filter((event) => event.kind === "pause" || event.kind === "seek")
    .map((event) => ({ kind: event.kind, at: time(event.at), meta: event.meta ?? {} }))
    .filter((event) => event.at != null)
    .sort((left, right) => left.at - right.at);
  const likes = (history?.likeHistory ?? []).map(time).filter((value) => value != null);
  return { sessions, events, likes };
}

// The playback session a like belongs to: the latest one that was running, or had just stopped, when the like was made.
export function findSession(likeAt, sessions) {
  let match = null;
  for (const session of sessions) {
    const end = session.endedAt ?? session.lastSeenAt;
    if (likeAt < session.startedAt - SESSION_LEAD_MS || likeAt > end + SESSION_TAIL_MS) continue;
    if (!match || session.startedAt > match.startedAt) match = session;
  }
  return match;
}

// Cove records when a like happened but not where in the video. Recover the position from, in order of trust:
// a pause shortly before the like (playback stopped there), a pause shortly after it (stepped back by the gap),
// the watched run that was playing at that moment, and finally where the session stopped.
export function estimateLikePosition(likeAt, session, events) {
  if (!session) return null;
  const sessionEvents = events.filter((event) => event.at >= session.startedAt - SESSION_LEAD_MS);

  const pauseBefore = sessionEvents.filter((event) => event.kind === "pause" && event.at <= likeAt && event.at >= likeAt - PAUSE_BEFORE_MS).at(-1);
  if (pauseBefore && Number.isFinite(Number(pauseBefore.meta.positionSec))) {
    const pausedAt = Number(pauseBefore.meta.positionSec);
    const resumed = session.runs.some((run) => run.recordedAt > pauseBefore.at + 1_000 && run.recordedAt <= likeAt && run.endSec > pausedAt + 2);
    if (!resumed) {
      const scrub = sessionEvents.filter((event) => isMovingSeek(event) && event.at > pauseBefore.at && event.at <= likeAt).at(-1);
      return { positionSec: scrub ? Number(scrub.meta.toSec) : pausedAt, precision: "exact" };
    }
  }

  const pauseAfter = sessionEvents.find((event) => event.kind === "pause" && event.at > likeAt && event.at <= likeAt + PAUSE_AFTER_MS);
  if (pauseAfter && Number.isFinite(Number(pauseAfter.meta.positionSec))
    && !sessionEvents.some((event) => isMovingSeek(event) && event.at > likeAt && event.at < pauseAfter.at)) {
    const rate = Number(pauseAfter.meta.playbackRate) || 1;
    return { positionSec: Math.max(0, Number(pauseAfter.meta.positionSec) - ((pauseAfter.at - likeAt) / 1000) * rate), precision: "estimated" };
  }

  // A run's recordedAt is when its last stretch was saved, so a like made during the run lies that much playback before its end.
  let playing = null;
  let stopped = null;
  for (const run of session.runs) {
    if (run.recordedAt >= likeAt) {
      const position = run.endSec - (run.recordedAt - likeAt) / 1000;
      if (position >= run.startSec - 1 && (!playing || run.recordedAt < playing.recordedAt)) playing = { recordedAt: run.recordedAt, position };
    } else if (likeAt - run.recordedAt <= RUN_GAP_MS && (!stopped || run.recordedAt > stopped.recordedAt)) {
      stopped = run;
    }
  }
  if (playing) return { positionSec: Math.max(0, playing.position), precision: "estimated" };
  if (stopped) return { positionSec: stopped.endSec, precision: "estimated" };
  if (session.lastPositionSec != null && likeAt >= session.lastSeenAt - 1_000) {
    return { positionSec: Number(session.lastPositionSec), precision: "estimated" };
  }
  return null;
}

// Every like of a video that can be placed in one of its playback sessions. Likes without a session (such as
// ones imported from another app) are skipped, and repeated likes of the same moment count once.
export function collectMoments(video, history) {
  const { sessions, events, likes } = parseHistory(history);
  const moments = [];
  for (const likeAt of likes) {
    const session = findSession(likeAt, sessions);
    const estimate = estimateLikePosition(likeAt, session, events);
    if (!estimate) continue;
    if (moments.some((moment) => moment.session === session && Math.abs(moment.positionSec - estimate.positionSec) < 5)) continue;
    moments.push({
      id: `${video.id}:${likeAt}`,
      video,
      likeAt,
      session,
      positionSec: estimate.positionSec,
      precision: estimate.precision,
      durationSec: session.mediaDurationSec || Number(video?.files?.[0]?.duration) || 0,
    });
  }
  return moments.map(({ session, ...moment }) => moment);
}

export function selectMoments(pool, count, seed) {
  return deterministicShuffle(pool, seed).slice(0, count);
}

// Scans the candidate videos in random order: loads a batch through findVideos, which drops videos the
// viewer can no longer see, then reads their histories until there are enough moments to choose from.
export async function scanCandidates(videoIds, seed, { findVideos, fetchHistory, target = POOL_TARGET, batchSize = VIDEO_BATCH_SIZE, concurrency = HISTORY_CONCURRENCY }) {
  const order = deterministicShuffle(videoIds, seed);
  const pool = [];
  for (let offset = 0; offset < order.length && pool.length < target; offset += batchSize) {
    const batch = order.slice(offset, offset + batchSize);
    const byId = new Map((await findVideos(batch)).map((video) => [video.id, video]));
    const videos = batch.map((id) => byId.get(id)).filter(Boolean);
    let cursor = 0;
    const workers = Array.from({ length: Math.min(concurrency, videos.length) }, async () => {
      while (cursor < videos.length && pool.length < target) {
        const video = videos[cursor];
        cursor += 1;
        const history = await fetchHistory(video.id);
        if (history) pool.push(...collectMoments(video, history));
      }
    });
    await Promise.all(workers);
  }
  return pool.sort((left, right) => right.likeAt - left.likeAt);
}

export function clipWindow(positionSec, durationSec, leadSeconds, clipSeconds) {
  const start = Math.max(0, positionSec - leadSeconds);
  const end = durationSec > 0 ? Math.min(durationSec, start + clipSeconds) : start + clipSeconds;
  return { start, end: Math.max(start, end) };
}

function percent(value, total) {
  return total > 0 ? Math.round((value / total) * 10000) / 100 : 0;
}

export function isInClip(seconds, clip) {
  return seconds >= clip.start - 0.5 && seconds < clip.end;
}

// Where the clip window and the like sit on a scrubber spanning the whole video.
export function scrubberMarks(positionSec, clip, durationSec) {
  const total = Math.max(durationSec, clip.end);
  return {
    total,
    clip: { left: percent(clip.start, total), width: Math.max(0.6, percent(clip.end - clip.start, total)) },
    like: percent(positionSec, total),
  };
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

export function spanLabel(seconds) {
  const value = Math.max(0, Math.round(seconds));
  if (value < 60) return `${value}s`;
  const minutes = Math.floor(value / 60);
  const remaining = value % 60;
  return remaining ? `${minutes} min ${remaining}s` : `${minutes} min`;
}

export function clipSummary(leadSeconds, clipSeconds) {
  const after = clipSeconds - leadSeconds;
  if (leadSeconds === 0) return `Plays ${spanLabel(clipSeconds)} starting at the like.`;
  if (after > 0) return `Plays from ${spanLabel(leadSeconds)} before the like to ${spanLabel(after)} after it.`;
  if (after === 0) return `Plays the ${spanLabel(clipSeconds)} leading up to the like.`;
  return `Plays ${spanLabel(clipSeconds)} and stops ${spanLabel(-after)} before the like.`;
}

export function agoLabel(then, now = Date.now()) {
  const startOfDay = (value) => { const date = new Date(value); return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime(); };
  const days = Math.max(0, Math.round((startOfDay(now) - startOfDay(then)) / 86_400_000));
  const plural = (count, unit) => `${count} ${unit}${count === 1 ? "" : "s"} ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return plural(days, "day");
  if (days < 30) return plural(Math.floor(days / 7), "week");
  if (days < 365) return plural(Math.max(1, Math.floor(days / 30)), "month");
  return plural(Math.floor(days / 365), "year");
}

export function precisionLabel(precision) {
  return precision === "exact" ? "Paused at the like" : "Estimated moment";
}

// Widget runtime.

async function readJson(response) {
  if (response.ok) return response.json();
  let detail = "";
  try {
    const problem = await response.json();
    detail = problem?.detail || problem?.title || problem?.message || "";
  } catch {}
  throw new Error(detail || `Cove returned ${response.status}.`);
}

// The videos the viewer liked during one of their own playback sessions, found by the extension's endpoint.
async function fetchCandidateIds(signal) {
  const body = await readJson(await extensionFetch(CANDIDATES_ENDPOINT, { signal }));
  return Array.isArray(body?.videoIds) ? body.videoIds : [];
}

async function findVideos(ids, signal) {
  const response = await extensionFetch("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findFilter: { page: 1, perPage: ids.length }, objectFilter: { ids } }),
    signal,
  });
  return (await readJson(response)).items ?? [];
}

async function fetchHistory(videoId, signal) {
  const response = await extensionFetch(`/api/videos/${videoId}/history`, { signal });
  if (response.status === 404) return null;
  return readJson(response);
}

async function loadPool(seed, signal) {
  const videoIds = await fetchCandidateIds(signal);
  return scanCandidates(videoIds, seed, {
    findVideos: (ids) => findVideos(ids, signal),
    fetchHistory: (videoId) => fetchHistory(videoId, signal),
  });
}

function usePool(seed) {
  const [attempt, setAttempt] = React.useState(0);
  const [state, setState] = React.useState({ loading: true, value: null, error: null });
  React.useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ loading: true, value: previous.value, error: null }));
    loadPool(seed, controller.signal)
      .then((value) => setState({ loading: false, value, error: null }))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ loading: false, value: null, error: error instanceof Error ? error : new Error("Unable to load moments.") });
      });
    return () => controller.abort();
  }, [attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}

function videoImage(video) {
  if (video.imagePath) return video.imagePath;
  const version = video.updatedAt ? `&v=${encodeURIComponent(video.updatedAt)}` : "";
  return `/api/videos/${video.id}/image?max=1280${version}`;
}

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
}

function Still({ video, className }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [video.id]);
  return h("span", { className },
    failed ? null : h("img", { src: videoImage(video), alt: "", loading: "lazy", decoding: "async", onError: () => setFailed(true) }));
}

function Icon({ children, size = 20, fill = "none" }) {
  return h("svg", {
    width: size, height: size, viewBox: "0 0 24 24", fill, stroke: fill === "none" ? "currentColor" : "none",
    strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true,
  }, children);
}

const ShuffleIcon = () => h(Icon, { size: 18 }, h("path", { d: "M16 3h5v5" }), h("path", { d: "M4 20 21 3" }), h("path", { d: "M21 16v5h-5" }), h("path", { d: "m15 15 6 6" }), h("path", { d: "M4 4l5 5" }));
const PlayIcon = () => h(Icon, { size: 22, fill: "currentColor" }, h("path", { d: "M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" }));
const PauseIcon = () => h(Icon, { size: 20, fill: "currentColor" }, h("rect", { x: 6, y: 5, width: 4, height: 14, rx: 1 }), h("rect", { x: 14, y: 5, width: 4, height: 14, rx: 1 }));
const MutedIcon = () => h(Icon, { size: 18 }, h("path", { d: "M11 5 6 9H3v6h3l5 4V5Z" }), h("path", { d: "m22 9-6 6" }), h("path", { d: "m16 9 6 6" }));
const SoundIcon = () => h(Icon, { size: 18 }, h("path", { d: "M11 5 6 9H3v6h3l5 4V5Z" }), h("path", { d: "M15.5 8.5a5 5 0 0 1 0 7" }), h("path", { d: "M19 5a10 10 0 0 1 0 14" }));
const HeartIcon = ({ size = 12, outline = false }) => h(Icon, { size, fill: outline ? "none" : "currentColor" },
  h("path", { d: "M12 20.5s-7.5-4.6-7.5-10.1A4.4 4.4 0 0 1 12 7.6a4.4 4.4 0 0 1 7.5 2.8c0 5.5-7.5 10.1-7.5 10.1Z" }));
const WarningIcon = () => h(Icon, { size: 40 }, h("path", { d: "M12 3 2.5 20h19L12 3Z" }), h("path", { d: "M12 10v4.5" }), h("path", { d: "M12 17.5h.01" }));

// Plays a moment over a scrubber for the whole video. It opens on the clip window and loops it; moving the
// playhead outside the window plays on from there, and "Back to the moment" returns to the loop. The original
// file is streamed; if the browser cannot play it, Cove's transcoder is asked to start at the wanted point instead.
function MomentPlayer({ moment, settings, onWatch }) {
  const clip = clipWindow(moment.positionSec, moment.durationSec, settings.leadSeconds, settings.clipSeconds);
  const videoRef = React.useRef(null);
  const userPaused = React.useRef(false);
  const looping = React.useRef(true);
  const dragging = React.useRef(false);
  const transcodeTimer = React.useRef(null);
  const [inMoment, setInMoment] = React.useState(true);
  const [transcodeStart, setTranscodeStart] = React.useState(null);
  const [failed, setFailed] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const [buffering, setBuffering] = React.useState(false);
  const [position, setPosition] = React.useState(clip.start);
  const [mediaDuration, setMediaDuration] = React.useState(0);
  const shouldAutoplay = settings.autoplay && !prefersReducedMotion();
  const id = moment.video.id;
  const offset = transcodeStart ?? 0;
  const src = transcodeStart == null
    ? `/api/stream/video/${id}#t=${clip.start.toFixed(2)}`
    : `/api/stream/video/${id}/transcode?start=${transcodeStart}`;
  const marks = scrubberMarks(moment.positionSec, clip, moment.durationSec || mediaDuration);

  React.useEffect(() => () => clearTimeout(transcodeTimer.current), []);

  // A removed <video> keeps downloading until it is garbage collected, so earlier players would compete with the
  // current one for the connection. Release each element once it has left the page, which aborts its download;
  // one still on the page (as in a StrictMode effect replay) is the live player and is left alone.
  React.useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (!video || video.isConnected) return;
      video.pause();
      video.removeAttribute("src");
      video.load();
    };
  }, [src, failed]);

  const play = () => {
    const video = videoRef.current;
    if (video) video.play().catch(() => setPlaying(false));
  };

  // Direct streams seek in place; the transcoder is restarted at the target instead.
  const jump = (seconds) => {
    const video = videoRef.current;
    setPosition(seconds);
    if (transcodeStart == null) {
      if (video) video.currentTime = seconds;
    } else if (Math.floor(seconds) === transcodeStart && video) {
      video.currentTime = 0;
    } else {
      setTranscodeStart(Math.floor(seconds));
    }
  };

  const seek = (seconds) => {
    const target = Math.min(Math.max(0, seconds), marks.total);
    looping.current = isInClip(target, clip);
    setInMoment(looping.current);
    if (transcodeStart == null) {
      jump(target);
    } else {
      setPosition(target);
      clearTimeout(transcodeTimer.current);
      transcodeTimer.current = setTimeout(() => jump(target), 300);
    }
  };

  const backToMoment = () => {
    looping.current = true;
    setInMoment(true);
    jump(clip.start);
    if (!userPaused.current) play();
  };

  // Pause while scrolled out of view; resume an autoplaying clip when it returns, unless the viewer paused it.
  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
      else if (shouldAutoplay && !userPaused.current) play();
    }, { threshold: 0.4 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [src, shouldAutoplay]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      userPaused.current = false;
      play();
    } else {
      userPaused.current = true;
      video.pause();
    }
  };

  const title = moment.video.title || "Untitled";
  const date = new Date(moment.likeAt).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
  const meta = [moment.video.studioName, `liked at ${formatDuration(moment.positionSec)}`].filter(Boolean).join(" · ");
  const watchFrom = Math.floor(inMoment ? clip.start : position);

  return h("div", { className: "bftp-player" },
    h("div", { className: "bftp-player__frame" },
      failed
        ? h(Still, { video: moment.video, className: "bftp-player__still" })
        : h("video", {
          ref: videoRef,
          key: src,
          className: "bftp-player__video",
          src,
          poster: videoImage(moment.video),
          muted,
          playsInline: true,
          preload: "metadata",
          "aria-label": `Clip of ${title}`,
          onLoadedMetadata: (event) => {
            const video = event.currentTarget;
            if (transcodeStart == null && Number.isFinite(video.duration)) setMediaDuration(video.duration);
            if (transcodeStart == null && Math.abs(video.currentTime - position) > 0.5) video.currentTime = position;
            if (shouldAutoplay && !userPaused.current) play();
            else if (playing) play();
          },
          onTimeUpdate: (event) => {
            const video = event.currentTarget;
            const current = video.currentTime + offset;
            if (looping.current && current >= clip.end - 0.05) {
              jump(clip.start);
              return;
            }
            if (!dragging.current) setPosition(current);
          },
          onEnded: () => {
            if (looping.current) {
              jump(clip.start);
              if (!userPaused.current) play();
            }
          },
          onPlay: () => setPlaying(true),
          onPause: () => {
            setPlaying(false);
            setBuffering(false);
          },
          onLoadStart: () => setBuffering((shouldAutoplay && !userPaused.current) || playing),
          onWaiting: () => setBuffering(true),
          onPlaying: () => setBuffering(false),
          onCanPlay: () => setBuffering(false),
          onError: () => {
            if (transcodeStart == null) setTranscodeStart(Math.floor(position));
            else setFailed(true);
          },
        }),
      buffering && !failed ? h("span", { className: "bftp-player__loading", role: "status", "aria-label": "Loading video" }, h("span", { className: "bftp-spinner" })) : null,
      h("span", { className: "bftp-player__chips" },
        inMoment
          ? h("span", { className: "bftp-chip" }, `Moment · ${formatDuration(clip.start)} – ${formatDuration(clip.end)}`)
          : h("button", { type: "button", className: "bftp-chip bftp-chip--action", onClick: backToMoment }, "Back to the moment"),
        h("span", { className: "bftp-chip bftp-chip--quiet" }, precisionLabel(moment.precision)))),
    failed ? null : h("div", { className: "bftp-scrub" },
      h("div", { className: "bftp-scrub__bar" },
        h("span", { className: "bftp-scrub__track", "aria-hidden": true },
          h("span", { className: "bftp-scrub__played", style: { width: `${percent(position, marks.total)}%` } }),
          h("span", { className: "bftp-scrub__clip", style: { left: `${marks.clip.left}%`, width: `${marks.clip.width}%` } }),
          h("span", { className: "bftp-scrub__like", style: { left: `${marks.like}%` } }, h(HeartIcon, { size: 10 }))),
        h("input", {
          type: "range",
          className: "bftp-scrub__input",
          min: 0,
          max: Math.max(1, Math.round(marks.total)),
          step: 1,
          value: Math.round(position),
          "aria-label": "Playback position",
          "aria-valuetext": `${formatDuration(position)} of ${formatDuration(marks.total)}`,
          onPointerDown: () => { dragging.current = true; },
          onPointerUp: () => { dragging.current = false; },
          onChange: (event) => seek(Number(event.target.value)),
        })),
      h("div", { className: "bftp-scrub__times", "aria-hidden": true },
        h("span", null, formatDuration(position)),
        h("span", null, formatDuration(marks.total)))),
    h("div", { className: "bftp-player__caption" },
      h("div", { className: "bftp-player__text" },
        h("span", { className: "bftp-player__when" }, `${agoLabel(moment.likeAt)} · ${date}`),
        h("span", { className: "bftp-player__title" }, title),
        h("span", { className: "bftp-player__meta" }, meta)),
      h("div", { className: "bftp-player__actions" },
        h("button", { type: "button", className: "bftp-watch", onClick: () => onWatch(watchFrom) }, `Watch from ${formatDuration(watchFrom)}`),
        failed ? null : h("button", {
          type: "button",
          className: "bftp-round bftp-round--quiet",
          onClick: () => setMuted((value) => !value),
          "aria-label": muted ? "Unmute" : "Mute",
          "aria-pressed": !muted,
        }, muted ? h(MutedIcon) : h(SoundIcon)),
        failed ? null : h("button", {
          type: "button",
          className: "bftp-round",
          onClick: toggle,
          "aria-label": playing ? "Pause" : "Play",
        }, playing ? h(PauseIcon) : h(PlayIcon)))));
}

function MomentList({ moments, selectedId, onSelect }) {
  return h("div", { className: "bftp-list" },
    h("div", { className: "bftp-list__header" },
      h("span", null, "Liked moments"),
      h("span", null, `${moments.length} shown`)),
    h("div", { className: "bftp-list__items", role: "group", "aria-label": "Liked moments" },
      moments.map((moment) => h("button", {
        key: moment.id,
        type: "button",
        className: "bftp-row",
        "aria-pressed": moment.id === selectedId,
        onClick: () => onSelect(moment.id),
      },
      h("span", { className: "bftp-row__thumb" },
        h(Still, { video: moment.video, className: "bftp-row__still" }),
        moment.durationSec > 0 ? h("span", { className: "bftp-row__track", "aria-hidden": true },
          h("span", { style: { left: `${percent(moment.positionSec, moment.durationSec)}%` } })) : null),
      h("span", { className: "bftp-row__text" },
        h("span", { className: "bftp-row__when" }, agoLabel(moment.likeAt)),
        h("span", { className: "bftp-row__title" }, moment.video.title || "Untitled"),
        h("span", { className: "bftp-row__meta" }, `Liked at ${formatDuration(moment.positionSec)} · ${moment.precision === "exact" ? "exact" : "estimated"}`))))));
}

function Message({ icon, tone, title, children, action }) {
  return h("div", { className: `bftp-message bftp-message--${tone}`, role: tone === "error" ? "alert" : undefined },
    h("span", { className: "bftp-message__icon" }, icon),
    h("strong", null, title),
    h("p", null, children),
    action || null);
}

function Skeleton() {
  return h("div", { className: "bftp-skeleton", role: "status", "aria-label": "Finding liked moments" },
    h("span", { className: "bftp-skeleton__hero" }),
    h("span", { className: "bftp-skeleton__line" }),
    h("span", { className: "bftp-skeleton__line bftp-skeleton__line--short" }));
}

function BlastFromThePastWidget({ configuration, onNavigate }) {
  const settings = readSettings(configuration);
  const [seed, setSeed] = React.useState(randomSeed);
  const [loadSeed] = React.useState(randomSeed);
  const state = usePool(loadSeed);
  const moments = React.useMemo(
    () => selectMoments(state.value ?? [], settings.count, seed),
    [state.value, settings.count, seed],
  );
  const [selectedId, setSelectedId] = React.useState(null);
  const selected = moments.find((moment) => moment.id === selectedId) ?? moments[0];

  let body;
  if (state.error) {
    body = h(Message, {
      icon: h(WarningIcon), tone: "error", title: "Couldn’t Load Moments",
      action: h("button", { type: "button", className: "bftp-pill", onClick: state.retry }, "Try Again"),
    }, state.error.message);
  } else if (!state.value) {
    body = h(Skeleton);
  } else if (!selected) {
    body = h(Message, { icon: h(HeartIcon, { size: 40, outline: true }), tone: "empty", title: "No Moments Yet" },
      "Like a video while you’re watching it, and that moment will come back here.");
  } else {
    body = h("div", { className: "bftp-body", "aria-busy": state.loading },
      h(MomentPlayer, {
        key: `${selected.id}:${settings.leadSeconds}:${settings.clipSeconds}`,
        moment: selected,
        settings,
        onWatch: (seekTo) => onNavigate({ page: "video", id: selected.video.id, seekTo }),
      }),
      h(MomentList, { moments, selectedId: selected.id, onSelect: setSelectedId }));
  }

  return h("section", { className: "bftp", "aria-label": "Blast From The Past" },
    h("div", { className: "bftp-card" },
      h("header", { className: "bftp-header" },
        h("div", { className: "bftp-heading" },
          h("span", { className: "bftp-eyebrow" }, "Blast From The Past"),
          h("h2", null, "Moments you liked")),
        h("button", {
          type: "button",
          className: "bftp-shuffle",
          onClick: () => {
            setSelectedId(null);
            setSeed(randomSeed());
          },
          disabled: !state.value || state.value.length <= 1,
          "aria-label": "Shuffle moments",
          title: "Shuffle moments",
        }, h(ShuffleIcon))),
      body));
}

function BlastFromThePastEditor({ configuration, onChange, onValidityChange }) {
  const settings = readSettings(configuration);
  const { count, leadSeconds, clipSeconds, autoplay } = settings;
  React.useEffect(() => onValidityChange(true), [onValidityChange]);
  const update = (key, value) => onChange({ ...(configuration || {}), [key]: value });
  const span = Math.max(leadSeconds, clipSeconds) + 20;
  const previewPercent = (value) => `${Math.round((value / (span + 10)) * 10000) / 100}%`;

  const slider = (id, label, key, value, min, max, minLabel, maxLabel) => h("div", { className: "bftp-editor__range" },
    h("div", { className: "bftp-editor__row bftp-editor__row--flush" },
      h("label", { htmlFor: id }, label),
      h("span", { className: "bftp-editor__value" }, spanLabel(value))),
    h("input", { id, type: "range", min, max, step: 1, value, onChange: (event) => update(key, Number(event.target.value)) }),
    h("div", { className: "bftp-editor__scale", "aria-hidden": true }, h("span", null, minLabel), h("span", null, maxLabel)));

  return h("fieldset", { className: "bftp-editor" },
    h("legend", null, "Blast From The Past"),
    h("p", { className: "bftp-editor__lead" }, "Choose which part of each liked moment to replay."),
    h("div", { className: "bftp-editor__group" },
      slider("bftp-lead", "Start before the like", "leadSeconds", leadSeconds, 0, 120, "0s", "2 min"),
      slider("bftp-length", "Clip length", "clipSeconds", clipSeconds, 5, 180, "5s", "3 min"),
      h("div", { className: "bftp-editor__preview" },
        h("div", { className: "bftp-editor__bar", "aria-hidden": true },
          h("span", { className: "bftp-editor__clip", style: { left: previewPercent(10), width: previewPercent(clipSeconds) } }),
          h("span", { className: "bftp-editor__like", style: { left: previewPercent(10 + leadSeconds) } })),
        h("span", { "aria-live": "polite" }, clipSummary(leadSeconds, clipSeconds)))),
    h("div", { className: "bftp-editor__group" },
      h("div", { className: "bftp-editor__row" },
        h("span", { id: "bftp-count-label" }, "Moments shown"),
        h("div", { className: "bftp-stepper", role: "group", "aria-labelledby": "bftp-count-label" },
          h("button", { type: "button", onClick: () => update("count", count - 1), disabled: count <= 1, "aria-label": "Show fewer moments" }, "−"),
          h("output", { "aria-live": "polite" }, count),
          h("button", { type: "button", onClick: () => update("count", count + 1), disabled: count >= 12, "aria-label": "Show more moments" }, "+"))),
      h("label", { className: "bftp-editor__row bftp-editor__toggle" },
        h("span", null, "Play clips automatically"),
        h("input", { type: "checkbox", role: "switch", checked: autoplay, onChange: (event) => update("autoplay", event.target.checked) }))),
    h("p", { className: "bftp-editor__note" },
      "Clips autoplay muted and pause when scrolled away. Cove records when you liked a video, not where, so the moment comes from a pause at the like or is estimated from that session’s playback."));
}

export default {
  components: {
    BlastFromThePastWidget,
    BlastFromThePastEditor,
  },
};
