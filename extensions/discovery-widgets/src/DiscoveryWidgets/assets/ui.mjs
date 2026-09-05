import React from "@cove/runtime/react";
import { extensionFetch } from "@cove/runtime/api";
import {
  DAY_MS,
  anniversaryYears,
  clamp,
  dailyKey,
  deterministicShuffle,
  isEmptyResult,
  randomSeed,
  readBoolean,
} from "./discovery-utils.mjs";

const h = React.createElement;
const MINUTE = 60;

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

function useRandomization() {
  const [revision, setRevision] = React.useState(0);
  return [revision, () => setRevision((value) => value + 1)];
}

async function fetchJson(path, options = {}) {
  const response = await extensionFetch(path, options);
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

function postJson(path, body, signal) {
  return fetchJson(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal,
  });
}

function find(entity, findFilter, objectFilter, signal) {
  return postJson(`/api/${entity}/find`, { findFilter, objectFilter }, signal);
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

function useAsyncData(loader, dependencies) {
  const [revision, setRevision] = React.useState(0);
  const [state, setState] = React.useState({ loading: true, value: null, error: null });
  React.useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true, value: null, error: null });
    Promise.resolve(loader(controller.signal))
      .then((value) => setState({ loading: false, value, error: null }))
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setState({ loading: false, value: null, error: error instanceof Error ? error : new Error("Unable to load this widget.") });
        }
      });
    return () => controller.abort();
  }, [...dependencies, revision]);
  return { ...state, retry: () => setRevision((value) => value + 1) };
}

function videoCover(video, seconds) {
  if (Number.isFinite(seconds)) return `/api/stream/video/${video.id}/screenshot?seconds=${encodeURIComponent(seconds)}`;
  if (video.imagePath) return video.imagePath;
  const version = video.updatedAt ? `&v=${encodeURIComponent(video.updatedAt)}` : "";
  return `/api/videos/${video.id}/image?max=960${version}`;
}

function performerImage(performer) {
  return performer?.imagePath || null;
}

function formatDuration(seconds) {
  const value = Math.max(0, Math.round(Number(seconds) || 0));
  const hours = Math.floor(value / 3600);
  const minutes = Math.floor((value % 3600) / 60);
  const remaining = value % 60;
  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`
    : `${minutes}:${String(remaining).padStart(2, "0")}`;
}

function videoDuration(video) {
  if (Number.isFinite(video?.clipStartSec) && Number.isFinite(video?.clipEndSec)) {
    return Math.max(0, video.clipEndSec - video.clipStartSec);
  }
  return video?.files?.[0]?.duration || 0;
}

function navigateList(onNavigate, page, findFilter, objectFilter) {
  onNavigate({ page, listFilter: { q: "", page: 1, ...findFilter }, listObjectFilter: objectFilter });
}

function WidgetFrame({ title, eyebrow, action, state, empty, children }) {
  return h("section", { className: "discovery-widget" },
    h("header", { className: "discovery-widget__header" },
      h("div", null,
        eyebrow ? h("span", { className: "discovery-widget__eyebrow" }, eyebrow) : null,
        h("h2", null, title)),
      action || null),
    state.loading
      ? h("div", { className: "discovery-skeleton", "aria-label": `Loading ${title}` },
          h("span", null), h("span", null), h("span", null))
      : state.error
        ? h("div", { className: "discovery-message", role: "alert" },
            h("strong", null, `Unable to load ${title}`),
            h("p", null, state.error.message),
            h("button", { type: "button", onClick: state.retry }, "Retry"))
        : isEmptyResult(state.value)
          ? h("div", { className: "discovery-message" },
              h("strong", null, "Nothing qualifies yet"),
              h("p", null, empty))
          : children);
}

function ViewAllButton({ onClick }) {
  return h("button", { type: "button", className: "discovery-link", onClick }, "View All", h("span", { "aria-hidden": true }, " →"));
}

function RandomizeButton({ title, onClick, disabled }) {
  return h("button", {
    type: "button",
    className: "discovery-randomize",
    onClick,
    disabled,
    title: `Randomize ${title}`,
    "aria-label": `Randomize ${title}`,
  }, h("span", { "aria-hidden": true }, "↻"), h("span", null, "Randomize"));
}

function WidgetActions({ children }) {
  return h("div", { className: "discovery-widget__actions" }, children);
}

function VideoCard({ video, onNavigate, subtitle, seconds }) {
  const duration = videoDuration(video);
  return h("button", {
    type: "button",
    className: "discovery-video-card",
    onClick: () => onNavigate({ page: "video", id: video.id, ...(Number.isFinite(seconds) ? { seekTo: seconds } : {}) }),
  },
  h("span", { className: "discovery-video-card__media" },
    h("img", { src: videoCover(video, seconds), alt: "", loading: "lazy" }),
    duration > 0 ? h("span", { className: "discovery-video-card__duration" }, formatDuration(duration)) : null),
  h("span", { className: "discovery-video-card__title" }, video.title || "Untitled"),
  h("span", { className: "discovery-video-card__meta" }, subtitle || video.date || video.studioName || ""));
}

function VideoGrid({ videos, onNavigate }) {
  return h("div", { className: "discovery-video-grid" }, videos.map((video) => h(VideoCard, { key: video.id, video, onNavigate })));
}

function OnThisDayWidget({ configuration, instanceId, onNavigate }) {
  const count = clamp(configuration?.count, 1, 12, 6);
  const historyYears = clamp(configuration?.historyYears, 1, 50, 20);
  const day = useDailyKey();
  const [randomization, randomize] = useRandomization();
  const state = useAsyncData(async (signal) => {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    const years = anniversaryYears(now, historyYears);
    const results = await mapWithConcurrency(years, 4, async (year) => {
      const exactDate = `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
      const response = await find("videos", {
        page: 1, perPage: 1, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, year, randomization),
      }, { dateCriterion: { value: exactDate, modifier: "equals" } }, signal);
      return response.items?.[0] || null;
    });
    return deterministicShuffle(results.filter(Boolean), randomSeed(day, instanceId, "anniversaries", randomization)).slice(0, count);
  }, [day, instanceId, count, historyYears, randomization]);
  return h(WidgetFrame, {
    title: "On This Day",
    eyebrow: new Date().toLocaleDateString(undefined, { month: "long", day: "numeric" }),
    state,
    action: h(RandomizeButton, { title: "On This Day", onClick: randomize, disabled: state.loading }),
    empty: `No videos have this date within the previous ${historyYears} years. Try a longer history window.`,
  }, state.value ? h(VideoGrid, { videos: state.value, onNavigate }) : null);
}

function TagSample({ sample, onNavigate }) {
  const video = sample.video || { id: sample.videoId, title: sample.videoTitle };
  return h("button", {
    type: "button",
    className: "discovery-tag-sample",
    onClick: () => onNavigate({ page: "video", id: video.id, ...(Number.isFinite(sample.startSec) ? { seekTo: sample.startSec } : {}) }),
  },
  h("img", { src: videoCover(video, sample.startSec), alt: "", loading: "lazy" }),
  h("span", null,
    h("small", null, Number.isFinite(sample.startSec) ? `Tagged moment · ${formatDuration(sample.startSec)}` : "Sample video"),
    h("strong", null, video.title || sample.videoTitle || "Untitled")));
}

function TagOfTheDayWidget({ configuration, instanceId, onNavigate }) {
  const minimumVideos = clamp(configuration?.minimumVideos, 1, 1000, 3);
  const preferSegments = readBoolean(configuration?.preferSegments, true);
  const day = useDailyKey();
  const [randomization, randomize] = useRandomization();
  const state = useAsyncData(async (signal) => {
    const tags = await find("tags", {
      page: 1, perPage: 1, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "tag", randomization),
    }, { videoCountCriterion: { value: minimumVideos - 1, modifier: "greaterThan" } }, signal);
    const tag = tags.items?.[0];
    if (!tag) return null;

    let sample = null;
    if (preferSegments) {
      const segments = await fetchJson(`/api/tags/${tag.id}/segments?count=100`, { signal });
      if (segments.length > 0) sample = segments[randomSeed(day, instanceId, "segment", randomization) % segments.length];
    }
    if (!sample) {
      const videos = await find("videos", {
        page: 1, perPage: 1, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "tag-video", randomization),
      }, { tagsCriterion: { value: [tag.id], modifier: "includes" } }, signal);
      if (videos.items?.[0]) sample = { video: videos.items[0] };
    }
    return { tag, sample };
  }, [day, instanceId, minimumVideos, preferSegments, randomization]);
  const result = state.value;
  return h(WidgetFrame, {
    title: "Tag of the Day",
    eyebrow: "Daily discovery",
    state,
    action: h(RandomizeButton, { title: "Tag of the Day", onClick: randomize, disabled: state.loading }),
    empty: `No tag currently has at least ${minimumVideos} videos. Lower the minimum in widget settings.`,
  }, result ? h("div", { className: "discovery-spotlight" },
    h("button", { type: "button", className: "discovery-spotlight__identity", onClick: () => onNavigate({ page: "tag", id: result.tag.id }) },
      result.tag.imagePath
        ? h("img", { src: result.tag.imagePath, alt: "", loading: "lazy" })
        : h("span", { className: "discovery-spotlight__fallback", "aria-hidden": true }, "#"),
      h("span", null,
        h("strong", null, result.tag.name),
        h("small", null, `${result.tag.videoCount || 0} videos`))),
    h("div", { className: "discovery-spotlight__copy" },
      h("p", null, result.tag.description || "No description has been added for this tag yet."),
      h("button", { type: "button", className: "discovery-link", onClick: () => onNavigate({ page: "tag", id: result.tag.id }) }, "Explore tag →")),
    result.sample ? h(TagSample, { sample: result.sample, onNavigate }) : h("p", { className: "discovery-inline-empty" }, "No tagged preview is available.")) : null);
}

function ForgottenFavoritesWidget({ configuration, instanceId, onNavigate }) {
  const count = clamp(configuration?.count, 1, 12, 6);
  const minimumRating = clamp(configuration?.minimumRating, 1, 100, 80);
  const inactiveDays = clamp(configuration?.inactiveDays, 1, 3650, 180);
  const day = useDailyKey();
  const [randomization, randomize] = useRandomization();
  const cutoff = React.useMemo(() => new Date(Date.now() - inactiveDays * DAY_MS).toISOString(), [day, inactiveDays]);
  const objectFilter = React.useMemo(() => ({
    ratingCriterion: { value: minimumRating - 1, modifier: "greaterThan" },
    lastPlayedAtCriterion: { value: cutoff, modifier: "lessThan" },
  }), [minimumRating, cutoff]);
  const state = useAsyncData(async (signal) => {
    const response = await find("videos", {
      page: 1, perPage: count, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "favorites", randomization),
    }, objectFilter, signal);
    return response.items || [];
  }, [day, instanceId, count, minimumRating, inactiveDays, cutoff, randomization]);
  return h(WidgetFrame, {
    title: "Forgotten Favorites",
    eyebrow: `Rated ${minimumRating}+ · idle ${inactiveDays}+ days`,
    state,
    action: h(WidgetActions, null,
      h(ViewAllButton, { onClick: () => navigateList(onNavigate, "videos", { sort: "last_played_at", direction: "asc" }, objectFilter) }),
      h(RandomizeButton, { title: "Forgotten Favorites", onClick: randomize, disabled: state.loading })),
    empty: "Nothing highly rated has been waiting that long. Lower the rating or inactivity threshold.",
  }, state.value ? h(VideoGrid, { videos: state.value, onNavigate }) : null);
}

function QuickWatchWidget({ configuration, instanceId, onNavigate }) {
  const count = clamp(configuration?.count, 1, 12, 6);
  const maximumMinutes = clamp(configuration?.maximumMinutes, 1, 600, 30);
  const unwatchedOnly = readBoolean(configuration?.unwatchedOnly, true);
  const day = useDailyKey();
  const [randomization, randomize] = useRandomization();
  const objectFilter = React.useMemo(() => ({
    durationCriterion: { value: maximumMinutes * MINUTE + 1, modifier: "lessThan" },
    ...(unwatchedOnly ? { playCountCriterion: { value: 0, modifier: "equals" } } : {}),
  }), [maximumMinutes, unwatchedOnly]);
  const state = useAsyncData(async (signal) => {
    const response = await find("videos", {
      page: 1, perPage: count, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "quick", randomization),
    }, objectFilter, signal);
    return response.items || [];
  }, [day, instanceId, count, maximumMinutes, unwatchedOnly, randomization]);
  return h(WidgetFrame, {
    title: "Quick Watch",
    eyebrow: `${maximumMinutes} minutes or less${unwatchedOnly ? " · unwatched" : ""}`,
    state,
    action: h(WidgetActions, null,
      h(ViewAllButton, { onClick: () => navigateList(onNavigate, "videos", { sort: "duration", direction: "asc" }, objectFilter) }),
      h(RandomizeButton, { title: "Quick Watch", onClick: randomize, disabled: state.loading })),
    empty: "No videos match this time budget. Increase the duration or include previously watched videos.",
  }, state.value ? h(VideoGrid, { videos: state.value, onNavigate }) : null);
}

function PerformerSpotlightWidget({ configuration, instanceId, onNavigate }) {
  const minimumVideos = clamp(configuration?.minimumVideos, 1, 1000, 3);
  const sampleCount = clamp(configuration?.sampleCount, 1, 8, 4);
  const day = useDailyKey();
  const [randomization, randomize] = useRandomization();
  const state = useAsyncData(async (signal) => {
    const performers = await find("performers", {
      page: 1, perPage: 1, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "performer", randomization),
    }, { videoCountCriterion: { value: minimumVideos - 1, modifier: "greaterThan" } }, signal);
    const summary = performers.items?.[0];
    if (!summary) return null;
    const [performer, videos] = await Promise.all([
      fetchJson(`/api/performers/${summary.id}`, { signal }),
      find("videos", {
        page: 1, perPage: sampleCount, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "performer-videos", randomization),
      }, { performersCriterion: { value: [summary.id], modifier: "includes" } }, signal),
    ]);
    return { performer, videos: videos.items || [] };
  }, [day, instanceId, minimumVideos, sampleCount, randomization]);
  const result = state.value;
  return h(WidgetFrame, {
    title: "Performer Spotlight",
    eyebrow: "Daily spotlight",
    state,
    action: h(RandomizeButton, { title: "Performer Spotlight", onClick: randomize, disabled: state.loading }),
    empty: `No performer currently has at least ${minimumVideos} videos. Lower the minimum in widget settings.`,
  }, result ? h("div", { className: "discovery-performer" },
    h("button", { type: "button", className: "discovery-performer__profile", onClick: () => onNavigate({ page: "performer", id: result.performer.id }) },
      performerImage(result.performer)
        ? h("img", { src: performerImage(result.performer), alt: "", loading: "lazy" })
        : h("span", { className: "discovery-spotlight__fallback", "aria-hidden": true }, "★"),
      h("span", null,
        h("strong", null, result.performer.name),
        h("small", null, `${result.performer.videoCount || 0} videos · ${result.performer.galleryCount || 0} galleries`))),
    h("div", { className: "discovery-performer__body" },
      h("p", null, result.performer.details || "No performer details have been added yet."),
      h("button", { type: "button", className: "discovery-link", onClick: () => onNavigate({ page: "performer", id: result.performer.id }) }, "View performer →"),
      result.videos.length ? h(VideoGrid, { videos: result.videos, onNavigate }) : h("p", { className: "discovery-inline-empty" }, "No sample videos are available."))) : null);
}

async function findMixedProgressGroup(groups, minimumVideos, signal) {
  for (const group of groups) {
    const page = await fetchJson(`/api/groups/${group.id}/items/page?page=1&perPage=100`, { signal });
    const videoIds = [...new Set((page.items || []).map((item) => item.videoId).filter((id) => Number.isInteger(id) && id > 0))];
    if (videoIds.length < minimumVideos) continue;
    const engagement = await postJson("/api/engagement/batch", { hostType: "video", hostIds: videoIds }, signal);
    const byId = new Map(engagement.map((item) => [item.hostId, item]));
    const completedIds = videoIds.filter((id) => (byId.get(id)?.completeCount || 0) > 0);
    const incompleteIds = videoIds.filter((id) => (byId.get(id)?.completeCount || 0) === 0);
    if (completedIds.length === 0 || incompleteIds.length === 0) continue;
    const nextVideo = await fetchJson(`/api/videos/${incompleteIds[0]}`, { signal });
    return { group, completed: completedIds.length, total: videoIds.length, nextVideo };
  }
  return null;
}

function ContinueCollectionWidget({ configuration, instanceId, onNavigate }) {
  const minimumVideos = clamp(configuration?.minimumVideos, 2, 100, 3);
  const candidateCount = clamp(configuration?.candidateCount, 1, 20, 8);
  const day = useDailyKey();
  const [randomization, randomize] = useRandomization();
  const state = useAsyncData(async (signal) => {
    const groups = await find("groups", {
      page: 1, perPage: candidateCount, sort: "random", direction: "asc", seed: randomSeed(day, instanceId, "groups", randomization),
    }, { videoCountCriterion: { value: minimumVideos - 1, modifier: "greaterThan" } }, signal);
    return findMixedProgressGroup(groups.items || [], minimumVideos, signal);
  }, [day, instanceId, minimumVideos, candidateCount, randomization]);
  const result = state.value;
  const percent = result ? Math.round((result.completed / result.total) * 100) : 0;
  return h(WidgetFrame, {
    title: "Continue a Collection",
    eyebrow: "Pick up where you left off",
    state,
    action: h(RandomizeButton, { title: "Continue a Collection", onClick: randomize, disabled: state.loading }),
    empty: `No collection in today's ${candidateCount} candidates has both completed and unfinished videos. Increase the candidate pool or come back tomorrow.`,
  }, result ? h("div", { className: "discovery-collection" },
    h("button", { type: "button", className: "discovery-collection__group", onClick: () => onNavigate({ page: "group", id: result.group.id }) },
      result.group.frontImagePath
        ? h("img", { src: result.group.frontImagePath, alt: "", loading: "lazy" })
        : h("span", { className: "discovery-spotlight__fallback", "aria-hidden": true }, "▶"),
      h("span", null, h("small", null, "Collection"), h("strong", null, result.group.name))),
    h("div", { className: "discovery-collection__progress" },
      h("span", null, `${result.completed} of ${result.total} completed`),
      h("span", null, `${percent}%`),
      h("div", null, h("i", { style: { width: `${percent}%` } })),
      h("button", { type: "button", className: "discovery-link", onClick: () => onNavigate({ page: "group", id: result.group.id }) }, "Open collection →")),
    h("div", { className: "discovery-collection__next" },
      h("small", null, "Next up"),
      h(VideoCard, { video: result.nextVideo, onNavigate }))) : null);
}

const CURATION_ISSUES = {
  unorganized: { label: "Unorganized", filter: { organizedCriterion: { value: false } } },
  "missing-title": { label: "Missing title", filter: { titleCriterion: { value: "", modifier: "isNull" } } },
  "missing-date": { label: "Missing date", filter: { dateCriterion: { value: "", modifier: "isNull" } } },
  "missing-details": { label: "Missing details", filter: { detailsCriterion: { value: "", modifier: "isNull" } } },
  untagged: { label: "Untagged", filter: { tagCountCriterion: { value: 0, modifier: "equals" } } },
};

function CurationQueueWidget({ configuration, onNavigate }) {
  const count = clamp(configuration?.count, 1, 12, 6);
  const issueKey = Object.hasOwn(CURATION_ISSUES, configuration?.issue) ? configuration.issue : "unorganized";
  const issue = CURATION_ISSUES[issueKey];
  const state = useAsyncData(async (signal) => {
    const response = await find("videos", { page: 1, perPage: count, sort: "updated_at", direction: "asc" }, issue.filter, signal);
    return response.items || [];
  }, [count, issueKey]);
  return h(WidgetFrame, {
    title: "Curation Queue",
    eyebrow: issue.label,
    state,
    action: h(ViewAllButton, { onClick: () => navigateList(onNavigate, "videos", { sort: "updated_at", direction: "asc" }, issue.filter) }),
    empty: `There are no videos matching “${issue.label}”. Choose another curation issue in widget settings.`,
  }, state.value ? h(VideoGrid, { videos: state.value, onNavigate }) : null);
}

function EditorShell({ description, children }) {
  return h("fieldset", { className: "discovery-editor" }, h("legend", null, "Widget settings"), h("p", null, description), children);
}

function NumberField({ label, value, min, max, onChange }) {
  return h("label", null,
    h("span", null, label),
    h("input", { type: "number", value: value ?? "", min, max, onChange: (event) => onChange(event.target.value === "" ? "" : Number(event.target.value)) }));
}

function CheckboxField({ label, checked, onChange }) {
  return h("label", { className: "discovery-editor__check" },
    h("input", { type: "checkbox", checked, onChange: (event) => onChange(event.target.checked) }), h("span", null, label));
}

function SelectField({ label, value, options, onChange }) {
  return h("label", null, h("span", null, label), h("select", { value, onChange: (event) => onChange(event.target.value) },
    options.map((option) => h("option", { key: option.value, value: option.value }, option.label))));
}

function useValidity(valid, message, onValidityChange) {
  React.useEffect(() => onValidityChange(valid, valid ? undefined : message), [valid, message, onValidityChange]);
}

function change(configuration, onChange, key, value) {
  onChange({ ...(configuration || {}), [key]: value });
}

function OnThisDayEditor({ configuration, onChange, onValidityChange }) {
  const count = configuration?.count ?? 6;
  const years = configuration?.historyYears ?? 20;
  const valid = count >= 1 && count <= 12 && years >= 1 && years <= 50;
  useValidity(valid, "Use 1–12 items and a history window of 1–50 years.", onValidityChange);
  return h(EditorShell, { description: "Choose how many anniversaries to show and how far back to search." },
    h(NumberField, { label: "Videos", value: count, min: 1, max: 12, onChange: (value) => change(configuration, onChange, "count", value) }),
    h(NumberField, { label: "History (years)", value: years, min: 1, max: 50, onChange: (value) => change(configuration, onChange, "historyYears", value) }));
}

function TagOfTheDayEditor({ configuration, onChange, onValidityChange }) {
  const minimum = configuration?.minimumVideos ?? 3;
  const valid = minimum >= 1 && minimum <= 1000;
  useValidity(valid, "Minimum videos must be between 1 and 1000.", onValidityChange);
  return h(EditorShell, { description: "Set the minimum tag usage and whether tagged moments should be preferred." },
    h(NumberField, { label: "Minimum videos", value: minimum, min: 1, max: 1000, onChange: (value) => change(configuration, onChange, "minimumVideos", value) }),
    h(CheckboxField, { label: "Prefer tagged segment previews", checked: readBoolean(configuration?.preferSegments, true), onChange: (value) => change(configuration, onChange, "preferSegments", value) }));
}

function ForgottenFavoritesEditor({ configuration, onChange, onValidityChange }) {
  const count = configuration?.count ?? 6;
  const rating = configuration?.minimumRating ?? 80;
  const days = configuration?.inactiveDays ?? 180;
  const valid = count >= 1 && count <= 12 && rating >= 1 && rating <= 100 && days >= 1 && days <= 3650;
  useValidity(valid, "Use 1–12 items, a rating from 1–100, and 1–3650 inactive days.", onValidityChange);
  return h(EditorShell, { description: "Define what counts as a favorite and how long it must have been idle." },
    h(NumberField, { label: "Videos", value: count, min: 1, max: 12, onChange: (value) => change(configuration, onChange, "count", value) }),
    h(NumberField, { label: "Minimum rating", value: rating, min: 1, max: 100, onChange: (value) => change(configuration, onChange, "minimumRating", value) }),
    h(NumberField, { label: "Inactive days", value: days, min: 1, max: 3650, onChange: (value) => change(configuration, onChange, "inactiveDays", value) }));
}

function QuickWatchEditor({ configuration, onChange, onValidityChange }) {
  const count = configuration?.count ?? 6;
  const minutes = configuration?.maximumMinutes ?? 30;
  const valid = count >= 1 && count <= 12 && minutes >= 1 && minutes <= 600;
  useValidity(valid, "Use 1–12 items and a duration of 1–600 minutes.", onValidityChange);
  return h(EditorShell, { description: "Set the available time and whether watched videos should be excluded." },
    h(NumberField, { label: "Videos", value: count, min: 1, max: 12, onChange: (value) => change(configuration, onChange, "count", value) }),
    h(NumberField, { label: "Maximum minutes", value: minutes, min: 1, max: 600, onChange: (value) => change(configuration, onChange, "maximumMinutes", value) }),
    h(CheckboxField, { label: "Only show unwatched videos", checked: readBoolean(configuration?.unwatchedOnly, true), onChange: (value) => change(configuration, onChange, "unwatchedOnly", value) }));
}

function PerformerSpotlightEditor({ configuration, onChange, onValidityChange }) {
  const minimum = configuration?.minimumVideos ?? 3;
  const samples = configuration?.sampleCount ?? 4;
  const valid = minimum >= 1 && minimum <= 1000 && samples >= 1 && samples <= 8;
  useValidity(valid, "Minimum videos must be 1–1000 and samples must be 1–8.", onValidityChange);
  return h(EditorShell, { description: "Control performer eligibility and the number of sample videos." },
    h(NumberField, { label: "Minimum videos", value: minimum, min: 1, max: 1000, onChange: (value) => change(configuration, onChange, "minimumVideos", value) }),
    h(NumberField, { label: "Sample videos", value: samples, min: 1, max: 8, onChange: (value) => change(configuration, onChange, "sampleCount", value) }));
}

function ContinueCollectionEditor({ configuration, onChange, onValidityChange }) {
  const minimum = configuration?.minimumVideos ?? 3;
  const candidates = configuration?.candidateCount ?? 8;
  const valid = minimum >= 2 && minimum <= 100 && candidates >= 1 && candidates <= 20;
  useValidity(valid, "Minimum videos must be 2–100 and candidates must be 1–20.", onValidityChange);
  return h(EditorShell, { description: "Choose the minimum collection size and how many daily candidates Cove should inspect." },
    h(NumberField, { label: "Minimum videos", value: minimum, min: 2, max: 100, onChange: (value) => change(configuration, onChange, "minimumVideos", value) }),
    h(NumberField, { label: "Candidate groups", value: candidates, min: 1, max: 20, onChange: (value) => change(configuration, onChange, "candidateCount", value) }));
}

function CurationQueueEditor({ configuration, onChange, onValidityChange }) {
  const count = configuration?.count ?? 6;
  const valid = count >= 1 && count <= 12;
  useValidity(valid, "Video count must be between 1 and 12.", onValidityChange);
  const issue = Object.hasOwn(CURATION_ISSUES, configuration?.issue) ? configuration.issue : "unorganized";
  return h(EditorShell, { description: "Select one actionable metadata issue for this queue." },
    h(NumberField, { label: "Videos", value: count, min: 1, max: 12, onChange: (value) => change(configuration, onChange, "count", value) }),
    h(SelectField, { label: "Issue", value: issue, options: Object.entries(CURATION_ISSUES).map(([value, item]) => ({ value, label: item.label })), onChange: (value) => change(configuration, onChange, "issue", value) }));
}

export default {
  components: {
    OnThisDayWidget,
    OnThisDayEditor,
    TagOfTheDayWidget,
    TagOfTheDayEditor,
    ForgottenFavoritesWidget,
    ForgottenFavoritesEditor,
    QuickWatchWidget,
    QuickWatchEditor,
    PerformerSpotlightWidget,
    PerformerSpotlightEditor,
    ContinueCollectionWidget,
    ContinueCollectionEditor,
    CurationQueueWidget,
    CurationQueueEditor,
  },
};
