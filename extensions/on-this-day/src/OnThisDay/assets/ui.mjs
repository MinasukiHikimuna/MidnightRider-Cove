import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";

const h = React.createElement;
const FIND_CONCURRENCY = 4;
const VIDEOS_PER_YEAR = 8;

// Pure model helpers, exported for tests/on-this-day-model.test.mjs.

export function clamp(value, min, max, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(max, Math.max(min, Math.round(number))) : fallback;
}

export function readSettings(configuration) {
  return {
    count: clamp(configuration?.count, 1, 12, 6),
    historyYears: clamp(configuration?.historyYears, 1, 50, 20),
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

export function deterministicShuffle(items, seed) {
  const result = [...items];
  let state = seed || 1;
  for (let index = result.length - 1; index > 0; index -= 1) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const swapIndex = state % (index + 1);
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
}

// Past years, newest first, in which today's month and day exist (so 29 February only searches leap years).
export function anniversaryYears(date, historyYears) {
  const month = date.getMonth();
  const day = date.getDate();
  return Array.from({ length: historyYears }, (_, index) => date.getFullYear() - index - 1)
    .filter((year) => {
      const candidate = new Date(year, month, day);
      return candidate.getFullYear() === year && candidate.getMonth() === month && candidate.getDate() === day;
    });
}

export function isoDate(year, date) {
  return `${year}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function yearsAgoLabel(year, today) {
  const years = today.getFullYear() - year;
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

// Chooses which found anniversaries to show: a seeded sample of `count` years, listed newest first,
// with the sample's first pick as the featured year.
export function selectMemories(found, count, seed) {
  const sample = deterministicShuffle(found, seed).slice(0, count);
  const featuredYear = sample[0]?.year ?? null;
  return {
    memories: [...sample].sort((left, right) => right.year - left.year),
    featuredYear,
  };
}

export function countLabel(count) {
  return count === 1 ? "1 video" : `${count.toLocaleString()} videos`;
}

// Grid cells for a year's thumbnail: one still fills it, and two to four stills tile it as a mosaic.
export function mosaicCells(count) {
  switch (Math.min(4, Math.max(1, count))) {
    case 1: return [{ column: "1 / 3", row: "1 / 3" }];
    case 2: return [{ column: "1 / 2", row: "1 / 3" }, { column: "2 / 3", row: "1 / 3" }];
    case 3: return [{ column: "1 / 2", row: "1 / 3" }, { column: "2 / 3", row: "1 / 2" }, { column: "2 / 3", row: "2 / 3" }];
    default: return [{ column: "1 / 2", row: "1 / 2" }, { column: "2 / 3", row: "1 / 2" }, { column: "1 / 2", row: "2 / 3" }, { column: "2 / 3", row: "2 / 3" }];
  }
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

function dateFromKey(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

async function findVideos(findFilter, objectFilter, signal) {
  const response = await extensionFetch("/api/videos/find", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ findFilter, objectFilter }),
    signal,
  });
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

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;
  const workers = Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}

async function loadMemories({ day, instanceId, count, historyYears, revision }, signal) {
  const today = dateFromKey(day);
  const years = anniversaryYears(today, historyYears);
  const perYear = await mapWithConcurrency(years, FIND_CONCURRENCY, async (year) => {
    const response = await findVideos({
      page: 1,
      perPage: VIDEOS_PER_YEAR,
      sort: "random",
      direction: "asc",
      seed: stableSeed(day, instanceId, year, revision),
    }, { dateCriterion: { value: isoDate(year, today), modifier: "equals" } }, signal);
    const videos = response.items ?? [];
    return videos.length > 0 ? { year, videos, total: Math.max(response.totalCount ?? 0, videos.length) } : null;
  });
  return selectMemories(perYear.filter(Boolean), count, stableSeed(day, instanceId, "memories", revision));
}

// Keeps the previous result on screen while a shuffle or midnight refresh loads, so the widget dims instead of collapsing.
function useMemories(request) {
  const [attempt, setAttempt] = React.useState(0);
  const [state, setState] = React.useState({ loading: true, value: null, error: null });
  const { day, instanceId, count, historyYears, revision } = request;
  React.useEffect(() => {
    const controller = new AbortController();
    setState((previous) => ({ loading: true, value: previous.value, error: null }));
    loadMemories(request, controller.signal)
      .then((value) => setState({ loading: false, value, error: null }))
      .catch((error) => {
        if (error?.name === "AbortError") return;
        setState({ loading: false, value: null, error: error instanceof Error ? error : new Error("Unable to load memories.") });
      });
    return () => controller.abort();
  }, [day, instanceId, count, historyYears, revision, attempt]);
  return { ...state, retry: () => setAttempt((value) => value + 1) };
}

function videoImage(video) {
  if (video.imagePath) return video.imagePath;
  const version = video.updatedAt ? `&v=${encodeURIComponent(video.updatedAt)}` : "";
  return `/api/videos/${video.id}/image?max=1280${version}`;
}

function videoDuration(video) {
  return video?.files?.[0]?.duration || 0;
}

function Still({ video, className, style }) {
  const [failed, setFailed] = React.useState(false);
  React.useEffect(() => setFailed(false), [video.id]);
  return h("span", { className, style },
    failed ? null : h("img", { src: videoImage(video), alt: "", loading: "lazy", decoding: "async", onError: () => setFailed(true) }));
}

function ShuffleIcon() {
  return h("svg", { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
    h("path", { d: "M16 3h5v5" }), h("path", { d: "M4 20 21 3" }), h("path", { d: "M21 16v5h-5" }),
    h("path", { d: "m15 15 6 6" }), h("path", { d: "M4 4l5 5" }));
}

function PlayIcon() {
  return h("svg", { width: 22, height: 22, viewBox: "0 0 24 24", fill: "currentColor", "aria-hidden": true },
    h("path", { d: "M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" }));
}

function CalendarIcon() {
  return h("svg", { width: 40, height: 40, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
    h("rect", { x: 3, y: 4.5, width: 18, height: 16, rx: 3 }), h("path", { d: "M3 9.5h18" }), h("path", { d: "M8 2.5v4" }), h("path", { d: "M16 2.5v4" }));
}

function WarningIcon() {
  return h("svg", { width: 40, height: 40, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true },
    h("path", { d: "M12 3 2.5 20h19L12 3Z" }), h("path", { d: "M12 10v4.5" }), h("path", { d: "M12 17.5h.01" }));
}

function Featured({ memory, video, today, onNavigate }) {
  const { year } = memory;
  const title = video.title || "Untitled";
  const meta = [video.studioName, videoDuration(video) > 0 ? formatDuration(videoDuration(video)) : null].filter(Boolean).join(" · ");
  return h("button", {
    type: "button",
    className: "otd-featured",
    onClick: () => onNavigate({ page: "video", id: video.id }),
    "aria-label": `Play ${title}, ${yearsAgoLabel(year, today)}`,
  },
  h("span", { className: "otd-featured__media" },
    h(Still, { video, className: "otd-featured__still" }),
    h("span", { className: "otd-featured__scrim", "aria-hidden": true })),
  h("span", { className: "otd-featured__caption" },
    h("span", { className: "otd-featured__text" },
      h("span", { className: "otd-featured__when" }, `${yearsAgoLabel(year, today)} · ${year}`),
      h("span", { className: "otd-featured__title" }, title),
      meta ? h("span", { className: "otd-featured__meta" }, meta) : null),
    h("span", { className: "otd-featured__play", "aria-hidden": true }, h(PlayIcon))));
}

// Every fetched video from the selected year; a final tile opens the full list when the year has more than were fetched.
function Filmstrip({ memory, selectedVideoId, onSelect, onSeeAll }) {
  const hidden = memory.total - memory.videos.length;
  return h("div", { className: "otd-strip" },
    h("div", { className: "otd-strip__header" },
      h("span", { className: "otd-strip__title" }, `${countLabel(memory.total)} from ${memory.year}`),
      h("button", { type: "button", className: "otd-see-all", onClick: onSeeAll, "aria-label": `See all videos from ${memory.year}` }, "See All")),
    h("div", { className: "otd-strip__items", role: "group", "aria-label": `Videos from ${memory.year}` },
      memory.videos.map((video) => {
        const duration = videoDuration(video);
        return h("button", {
          key: video.id,
          type: "button",
          className: "otd-strip__item",
          "aria-pressed": video.id === selectedVideoId,
          "aria-label": video.title || "Untitled",
          onClick: () => onSelect(video.id),
        },
        h(Still, { video, className: "otd-strip__still" }),
        duration > 0 ? h("span", { className: "otd-badge" }, formatDuration(duration)) : null);
      }),
      hidden > 0 ? h("button", {
        type: "button",
        className: "otd-strip__item otd-strip__more",
        onClick: onSeeAll,
        "aria-label": `See all ${countLabel(memory.total)} from ${memory.year}`,
      }, `+${hidden.toLocaleString()}`) : null));
}

function YearList({ memories, selectedYear, today, onSelect }) {
  return h("div", { className: "otd-list", role: "group", "aria-label": "Years with this date" },
    h("span", { className: "otd-list__heading", "aria-hidden": true }, "Years with this date"),
    memories.map(({ year, videos, total }) => {
      const cells = mosaicCells(videos.length);
      return h("button", {
        key: year,
        type: "button",
        className: "otd-row",
        "aria-pressed": year === selectedYear,
        "aria-label": `${year}, ${yearsAgoLabel(year, today)}, ${countLabel(total)}`,
        onClick: () => onSelect(year),
      },
      h("span", { className: "otd-row__mosaic", "aria-hidden": true },
        cells.map((cell, index) => h(Still, {
          key: videos[index].id,
          video: videos[index],
          className: "otd-row__cell",
          style: { gridColumn: cell.column, gridRow: cell.row },
        }))),
      h("span", { className: "otd-row__text" },
        h("span", { className: "otd-row__when" }, yearsAgoLabel(year, today)),
        h("span", { className: "otd-row__year" }, year)),
      h("span", { className: "otd-row__count" }, countLabel(total)));
    }));
}

function YearChips({ memories, selectedYear, onSelect }) {
  return h("div", { className: "otd-chips", role: "group", "aria-label": "Choose a year" },
    memories.map(({ year, total }) => h("button", {
      key: year,
      type: "button",
      className: "otd-chip",
      "aria-pressed": year === selectedYear,
      "aria-label": `${year}, ${countLabel(total)}`,
      onClick: () => onSelect(year),
    }, h("span", { className: "otd-chip__year" }, year), h("span", { className: "otd-chip__count", "aria-hidden": true }, total))));
}

function Message({ icon, tone, title, children, action }) {
  return h("div", { className: `otd-message otd-message--${tone}`, role: tone === "error" ? "alert" : undefined },
    h("span", { className: "otd-message__icon" }, icon),
    h("strong", null, title),
    h("p", null, children),
    action || null);
}

function Skeleton() {
  return h("div", { className: "otd-skeleton", role: "status", "aria-label": "Loading memories" },
    h("span", { className: "otd-skeleton__hero" }),
    h("span", { className: "otd-skeleton__line" }),
    h("span", { className: "otd-skeleton__line otd-skeleton__line--short" }));
}

function OnThisDayWidget({ configuration, instanceId, onNavigate }) {
  const { count, historyYears } = readSettings(configuration);
  const day = useDailyKey();
  const today = dateFromKey(day);
  const [revision, setRevision] = React.useState(0);
  const state = useMemories({ day, instanceId, count, historyYears, revision });
  const [selection, setSelection] = React.useState({ year: null, videoId: null });
  React.useEffect(() => setSelection({ year: state.value?.featuredYear ?? null, videoId: null }), [state.value]);

  const dateLabel = today.toLocaleDateString(undefined, { month: "long", day: "numeric" });
  const memories = state.value?.memories ?? [];
  const selected = memories.find((memory) => memory.year === selection.year) ?? memories[0];
  const video = selected?.videos.find((candidate) => candidate.id === selection.videoId) ?? selected?.videos[0];
  const selectYear = (year) => setSelection({ year, videoId: null });
  const seeAll = () => onNavigate({
    page: "videos",
    listFilter: { q: "", page: 1, sort: "title", direction: "asc" },
    listObjectFilter: { dateCriterion: { value: isoDate(selected.year, today), modifier: "equals" } },
  });

  let body;
  if (state.error) {
    body = h(Message, {
      icon: h(WarningIcon), tone: "error", title: "Couldn’t Load Memories",
      action: h("button", { type: "button", className: "otd-pill", onClick: state.retry }, "Try Again"),
    }, state.error.message);
  } else if (!state.value) {
    body = h(Skeleton);
  } else if (!selected) {
    body = h(Message, { icon: h(CalendarIcon), tone: "empty", title: "No Memories Yet" },
      `Nothing in your library was released on ${dateLabel} in the last ${historyYears === 1 ? "year" : `${historyYears} years`}. You can look further back in this widget’s settings.`);
  } else {
    body = h("div", { className: "otd-body", "aria-busy": state.loading },
      h("div", { className: "otd-main" },
        h(Featured, { memory: selected, video, today, onNavigate }),
        h(YearChips, { memories, selectedYear: selected.year, onSelect: selectYear }),
        h(Filmstrip, {
          memory: selected,
          selectedVideoId: video.id,
          onSelect: (videoId) => setSelection({ year: selected.year, videoId }),
          onSeeAll: seeAll,
        })),
      h(YearList, { memories, selectedYear: selected.year, today, onSelect: selectYear }));
  }

  return h("section", { className: "otd", "aria-label": `On This Day, ${dateLabel}` },
    h("div", { className: "otd-card" },
      h("header", { className: "otd-header" },
        h("div", { className: "otd-heading" },
          h("span", { className: "otd-eyebrow" }, "On This Day"),
          h("h2", null, dateLabel)),
        h("button", {
          type: "button",
          className: "otd-shuffle",
          onClick: () => setRevision((value) => value + 1),
          disabled: state.loading,
          "aria-label": "Shuffle memories",
          title: "Shuffle memories",
        }, h(ShuffleIcon))),
      body));
}

function OnThisDayEditor({ configuration, onChange, onValidityChange }) {
  const { count, historyYears } = readSettings(configuration);
  React.useEffect(() => onValidityChange(true), [onValidityChange]);
  const update = (key, value) => onChange({ ...(configuration || {}), [key]: value });
  return h("fieldset", { className: "otd-editor" },
    h("legend", null, "On This Day"),
    h("p", { className: "otd-editor__lead" }, "Choose how many years to show and how far back to look."),
    h("div", { className: "otd-editor__group" },
      h("div", { className: "otd-editor__row" },
        h("span", { id: "otd-count-label" }, "Years shown"),
        h("div", { className: "otd-stepper", role: "group", "aria-labelledby": "otd-count-label" },
          h("button", { type: "button", onClick: () => update("count", count - 1), disabled: count <= 1, "aria-label": "Show fewer years" }, "−"),
          h("output", { "aria-live": "polite" }, count),
          h("button", { type: "button", onClick: () => update("count", count + 1), disabled: count >= 12, "aria-label": "Show more years" }, "+"))),
      h("div", { className: "otd-editor__range" },
        h("div", { className: "otd-editor__row otd-editor__row--flush" },
          h("label", { htmlFor: "otd-history" }, "Look back"),
          h("span", { className: "otd-editor__value" }, historyYears === 1 ? "1 year" : `${historyYears} years`)),
        h("input", {
          id: "otd-history",
          type: "range",
          min: 1,
          max: 50,
          value: historyYears,
          onChange: (event) => update("historyYears", Number(event.target.value)),
        }),
        h("div", { className: "otd-editor__scale", "aria-hidden": true }, h("span", null, "1 year"), h("span", null, "50 years")))),
    h("p", { className: "otd-editor__note" }, "Memories refresh at midnight. Shuffle picks a different set of years and different videos from each."));
}

export default {
  components: {
    OnThisDayWidget,
    OnThisDayEditor,
  },
};
