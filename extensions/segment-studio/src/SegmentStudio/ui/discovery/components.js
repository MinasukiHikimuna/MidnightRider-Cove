import { formatDuration, h } from "../shared/runtime.js";

import { REVIEW_STATES } from "../shared/constants.js";

import { SEGMENT_STATE_PRESENTATION, StateBadge } from "../shared/presentation.js";

const DISCOVERY_URL_OPTIONS = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"],
};

const DISCOVERY_SORT_OPTIONS = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" },
];

const DISCOVERY_FILTER_CRITERIA = [
  { id: "hasSegments", label: "Has Segments", type: "bool", filterKey: "hasSegmentsCriterion" },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: [
    { value: "unreviewed", label: "Has unreviewed" },
    { value: "approved", label: "Has approved" },
    { value: "rejected", label: "Has rejected" },
  ] },
  { id: "segmentTags", label: "Segment Tags", type: "multiId", entityType: "tags", filterKey: "segmentTagsCriterion", hierarchyToggleLabel: "Include sub-tags" },
  { id: "shotBoundaries", label: "Has Shot Boundaries", type: "bool", filterKey: "shotBoundariesCriterion" },
  { id: "tags", label: "Video Tags", type: "multiId", entityType: "tags", filterKey: "tagsCriterion", hierarchyToggleLabel: "Include sub-tags" },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion" },
  { id: "studios", label: "Studios", type: "multiId", entityType: "studios", filterKey: "studiosCriterion", hierarchyToggleLabel: "Include sub-studios" },
];

function setPlainLinkNavigation(event, onNavigate, route) {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  event.preventDefault();
  onNavigate(route);
}

function setBackLinkNavigation(event, onNavigate, fallbackRoute) {
  if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) return;
  event.preventDefault();
  if (window.history.length > 1) window.history.back();
  else onNavigate(fallbackRoute);
}

function criterionIds(criterion, key = "value") {
  return Array.isArray(criterion?.[key])
    ? [...new Set(criterion[key].map(Number).filter((value) => Number.isInteger(value) && value > 0))]
    : [];
}

function appendCriterion(params, criterion, name, hierarchyKey = null) {
  const includes = criterionIds(criterion);
  const excludes = criterionIds(criterion, "excludes");
  includes.forEach((value) => params.append(name, String(value)));
  excludes.forEach((value) => params.append(`exclude${name[0].toUpperCase()}${name.slice(1)}`, String(value)));
  const mode = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[criterion?.modifier];
  if (mode) params.set(`${name}Mode`, mode);
  if (hierarchyKey && criterion?.depth === -1 && (includes.length > 0 || excludes.length > 0)) params.set(hierarchyKey, "true");
}

export function buildDiscoverySearchParams(filter, objectFilter, workflow = null) {
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.perPage) params.set("perPage", String(filter.perPage));
  if (filter.sort) params.set("sort", filter.sort);
  if (filter.direction) params.set("direction", filter.direction);
  if (filter.sort === "random" && Number.isInteger(filter.seed) && filter.seed > 0) params.set("seed", String(filter.seed));
  const hasSegments = objectFilter.hasSegmentsCriterion?.value;
  if (typeof hasSegments === "boolean") params.set("hasSegments", String(hasSegments));
  else if (objectFilter.segments === "has") params.set("hasSegments", "true");
  else if (objectFilter.segments === "none") params.set("hasSegments", "false");
  appendCriterion(params, objectFilter.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags");
  appendCriterion(params, objectFilter.tagsCriterion, "videoTag", "includeVideoSubtags");
  appendCriterion(params, objectFilter.performersCriterion, "performer");
  appendCriterion(params, objectFilter.studiosCriterion, "studio", "includeSubstudios");
  const segmentTagId = Number(objectFilter.segmentTagId ?? objectFilter.tagId) || null;
  if (segmentTagId && !params.has("segmentTag")) params.set("segmentTagId", String(segmentTagId));
  const videoTagIds = normalizeDiscoveryIds(objectFilter.videoTagIds);
  if (videoTagIds.length > 0 && !params.has("videoTag")) params.set("videoTagIds", videoTagIds.join(","));
  const performerIds = normalizeDiscoveryIds(objectFilter.performerIds);
  if (performerIds.length > 0 && !params.has("performer")) params.set("performerIds", performerIds.join(","));
  const studioId = Number(objectFilter.studioId) || null;
  if (studioId && !params.has("studio")) params.set("studioId", String(studioId));
  const reviewState = objectFilter.reviewStateCriterion?.value ?? objectFilter.reviewState;
  if (workflow && ["unreviewed", "approved", "rejected"].includes(reviewState)) params.set("reviewState", reviewState);
  if (workflow) params.set("workflow", workflow);
  const hasShotBoundaries = objectFilter.shotBoundariesCriterion?.value;
  if (workflow && typeof hasShotBoundaries === "boolean") params.set("hasShotBoundaries", String(hasShotBoundaries));
  else if (workflow && objectFilter.shotBoundaries === "has") params.set("hasShotBoundaries", "true");
  else if (workflow && objectFilter.shotBoundaries === "none") params.set("hasShotBoundaries", "false");
  return params;
}

export function normalizeDiscoveryIds(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
}

function SegmentSummary({ item, showReviewStates = false }) {
  if (item.segmentCount === 0) return h("div", { className: "text-[11px]" }, h(StateBadge, null, "No tag segments"));
  if (!showReviewStates) return h("div", { className: "text-[11px]" },
    h(StateBadge, null, `${item.segmentCount} tag segment${item.segmentCount === 1 ? "" : "s"}`));
  return h("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, REVIEW_STATES.flatMap((state) => {
    const count = Number(item[`${state}Count`]) || 0;
    if (count === 0) return [];
    const presentation = SEGMENT_STATE_PRESENTATION[state];
    return [h("span", {
      key: state,
      title: `${count} ${state} segment${count === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: presentation.badge,
    }, `${presentation.symbol} ${count}`)];
  }));
}

function DiscoveryCard({ item, onNavigate, showReviewStates = false }) {
  const route = { page: "segment-studio", id: item.videoId };
  return h("article", { className: "group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/60" }, [
    h("a", {
      key: "link",
      href: `/segment-studio/${item.videoId}`,
      onClick: (event) => setPlainLinkNavigation(event, onNavigate, route),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${item.title}`,
    }),
    h("div", { key: "media", className: "relative aspect-video bg-black" }, [
      h("img", { key: "image", src: `/api/videos/${item.videoId}/image?maxDimension=640&v=${encodeURIComponent(item.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      item.duration > 0 ? h("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, formatDuration(item.duration)) : null,
    ]),
    h("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      h("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, item.title),
      h("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        item.date ? h("span", { key: "date" }, item.date) : null,
        item.organized ? h("span", { key: "organized" }, "Organized") : null,
        item.isVr ? h("span", { key: "vr" }, "VR") : null,
      ]),
      h("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, h(SegmentSummary, { item, showReviewStates })),
    ]),
  ]);
}

function DiscoveryRow({ item, onNavigate, showReviewStates = false }) {
  const route = { page: "segment-studio", id: item.videoId };
  return h("article", { className: "overflow-hidden rounded-md border border-border bg-card" }, h("a", {
    href: `/segment-studio/${item.videoId}`,
    onClick: (event) => setPlainLinkNavigation(event, onNavigate, route),
    className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": `Open segment editor for ${item.title}`,
  }, [
    h("img", { key: "image", src: `/api/videos/${item.videoId}/image?maxDimension=320&v=${encodeURIComponent(item.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
    h("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
      h("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, item.title),
      h(SegmentSummary, { key: "segments", item, showReviewStates }),
    ]),
    h("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›"),
  ]));
}

export { DISCOVERY_URL_OPTIONS, DISCOVERY_SORT_OPTIONS, DISCOVERY_FILTER_CRITERIA, setPlainLinkNavigation, setBackLinkNavigation, SegmentSummary, DiscoveryCard, DiscoveryRow };
