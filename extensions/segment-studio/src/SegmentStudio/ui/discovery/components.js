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

const SEGMENT_STUDIO_EXTENSION_ID = "com.midnightrider.segment-studio";

/** Cove's own Has Segments counts only native segments; Segment Studio's filter replaces it here. */
const CORE_CRITERIA_REPLACED_BY_SEGMENT_STUDIO = new Set(["hasSegments"]);

/** Sorts the old Segment Studio endpoint ran itself; Cove's video search cannot order by them. */
const RETIRED_DISCOVERY_SORTS = new Set(["segment_count", "unreviewed_count"]);

const CRITERION_MODIFIERS = {
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  GREATER_THAN: "greaterThan",
  LESS_THAN: "lessThan",
  INCLUDES: "includes",
  EXCLUDES: "excludes",
  INCLUDES_ALL: "includesAll",
  EXCLUDES_ALL: "excludesAll",
  IS_NULL: "isNull",
  NOT_NULL: "notNull",
  BETWEEN: "between",
  NOT_BETWEEN: "notBetween",
  MATCHES_REGEX: "matchesRegex",
  NOT_MATCHES_REGEX: "notMatchesRegex",
  UNDER_PATH: "underPath",
  NOT_UNDER_PATH: "notUnderPath",
};

function segmentStudioCriterion(filterId, modifier, value) {
  return { extensionId: SEGMENT_STUDIO_EXTENSION_ID, filterId, modifier, value };
}

function legacyPresence(value) {
  if (typeof value === "boolean") return value;
  if (value === "has") return true;
  if (value === "none") return false;
  return null;
}

function legacySegmentTagsCriterion(criterion) {
  const value = normalizeDiscoveryIds(criterion?.value);
  const excludes = normalizeDiscoveryIds(criterion?.excludes);
  const modifier = { INCLUDES_ALL: "includesall", EXCLUDES: "excludes", IS_NULL: "isnull", NOT_NULL: "notnull" }[criterion?.modifier] ?? "includes";
  if (modifier === "isnull" || modifier === "notnull") return segmentStudioCriterion("segment-tags", modifier, {});
  if (value.length === 0 && (modifier === "excludes" || excludes.length === 0)) return null;
  return segmentStudioCriterion("segment-tags", modifier, {
    ...(value.length > 0 ? { value } : {}),
    ...(excludes.length > 0 && modifier !== "excludes" ? { excludes } : {}),
    ...(criterion?.depth === -1 ? { depth: -1 } : {}),
  });
}

/**
 * Rewrites views saved and links made before Segment Studio used Cove's video search: Segment
 * Studio's own criteria become its extension filters and the old ID shortcuts become Cove's
 * entity criteria. Criteria already in Segment Studio's current form win over legacy ones, and
 * outside Full mode the Full-only review-state and shot-boundary criteria are dropped, as the old
 * endpoint ignored them. Returns the same object when nothing needed rewriting.
 */
export function migrateLegacyDiscoveryFilter(objectFilter = {}, { fullMode = true } = {}) {
  const legacyKeys = [
    "hasSegmentsCriterion", "segments", "reviewStateCriterion", "reviewState", "shotBoundariesCriterion",
    "shotBoundaries", "segmentTagsCriterion", "segmentTagId", "tagId", "videoTagIds", "performerIds", "studioId",
  ];
  if (!legacyKeys.some((key) => Object.hasOwn(objectFilter, key))) return objectFilter;
  const next = { ...objectFilter };
  legacyKeys.forEach((key) => delete next[key]);
  const added = [];
  const hasSegments = legacyPresence(objectFilter.hasSegmentsCriterion?.value ?? objectFilter.segments);
  if (hasSegments !== null) added.push(segmentStudioCriterion("has-segments", "equals", hasSegments));
  const reviewState = objectFilter.reviewStateCriterion?.value ?? objectFilter.reviewState;
  if (fullMode && ["unreviewed", "approved", "rejected"].includes(reviewState)) added.push(segmentStudioCriterion("review-state", "equals", reviewState));
  const shotBoundaries = legacyPresence(objectFilter.shotBoundariesCriterion?.value ?? objectFilter.shotBoundaries);
  if (fullMode && shotBoundaries !== null) added.push(segmentStudioCriterion("has-shot-boundaries", "equals", shotBoundaries));
  const segmentTagId = Number(objectFilter.segmentTagId ?? objectFilter.tagId) || null;
  const segmentTags = objectFilter.segmentTagsCriterion
    ? legacySegmentTagsCriterion(objectFilter.segmentTagsCriterion)
    : segmentTagId ? legacySegmentTagsCriterion({ value: [segmentTagId] }) : null;
  if (segmentTags) added.push(segmentTags);
  const videoTagIds = normalizeDiscoveryIds(objectFilter.videoTagIds);
  if (videoTagIds.length > 0 && !next.tagsCriterion) next.tagsCriterion = { modifier: "INCLUDES", value: videoTagIds };
  const performerIds = normalizeDiscoveryIds(objectFilter.performerIds);
  if (performerIds.length > 0 && !next.performersCriterion) next.performersCriterion = { modifier: "INCLUDES", value: performerIds };
  const studioId = Number(objectFilter.studioId) || null;
  if (studioId && !next.studiosCriterion) next.studiosCriterion = { modifier: "INCLUDES", value: [studioId] };
  const kept = Array.isArray(objectFilter.extensionCriteria) ? objectFilter.extensionCriteria : [];
  const current = new Set(kept.filter((criterion) => criterion?.extensionId === SEGMENT_STUDIO_EXTENSION_ID).map((criterion) => criterion.filterId));
  const extensionCriteria = [...kept, ...added.filter((criterion) => !current.has(criterion.filterId))];
  if (extensionCriteria.length > 0) next.extensionCriteria = extensionCriteria;
  else delete next.extensionCriteria;
  return next;
}

/** Falls back to the default order for the sorts Cove's video search does not offer. */
export function migrateLegacyDiscoverySort(filter) {
  if (!RETIRED_DISCOVERY_SORTS.has(filter?.sort)) return filter;
  return { ...filter, sort: DISCOVERY_URL_OPTIONS.defaultFilter.sort, direction: DISCOVERY_URL_OPTIONS.defaultFilter.direction };
}

function normalizeCriterionModifiers(value) {
  if (Array.isArray(value)) return value.map(normalizeCriterionModifiers);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([key, entry]) => [
    key,
    key === "modifier" && typeof entry === "string" ? (CRITERION_MODIFIERS[entry] ?? entry) : normalizeCriterionModifiers(entry),
  ]));
}

/** The body for Cove's `POST /api/videos/find`, the same request Cove's Videos page sends. */
export function buildDiscoveryFindRequest(filter, objectFilter, { fullMode = true } = {}) {
  const listFilter = migrateLegacyDiscoverySort(filter);
  const findFilter = {
    page: listFilter.page || 1,
    perPage: listFilter.perPage || DISCOVERY_URL_OPTIONS.defaultFilter.perPage,
    sort: listFilter.sort || DISCOVERY_URL_OPTIONS.defaultFilter.sort,
    direction: listFilter.direction || DISCOVERY_URL_OPTIONS.defaultFilter.direction,
  };
  if (listFilter.q) findFilter.q = listFilter.q;
  if (findFilter.sort === "random" && Number.isInteger(listFilter.seed) && listFilter.seed > 0) findFilter.seed = listFilter.seed;
  const migrated = { ...migrateLegacyDiscoveryFilter(objectFilter, { fullMode }) };
  // Compilation grouping is a Videos page presentation; /find always returns plain videos.
  delete migrated.includeCompilationGroups;
  // The advanced filter travels beside the object filter, as on Cove's Videos page.
  const { _filterExpression: filterExpression, ...plain } = migrated;
  return {
    findFilter,
    objectFilter: normalizeCriterionModifiers(plain),
    ...(filterExpression?.children?.length ? { filterExpression: normalizeCriterionModifiers(filterExpression) } : {}),
  };
}

/** Core video criteria for the Videos tab; Segment Studio's own filters arrive as extension criteria. */
export function discoveryCriteria(videoCriteria) {
  return videoCriteria.filter((criterion) => !CORE_CRITERIA_REPLACED_BY_SEGMENT_STUDIO.has(criterion.id));
}

/** Maps one Cove video plus its Segment Studio counts onto a discovery card item. */
export function toDiscoveryItem(video, counts) {
  const file = Array.isArray(video.files) && video.files.length > 0 ? video.files[0] : null;
  return {
    videoId: video.id,
    title: video.title?.trim() || file?.basename || `Video ${video.id}`,
    details: video.details ?? null,
    date: video.date ?? null,
    organized: Boolean(video.organized),
    isVr: Boolean(video.isVr),
    duration: Number(file?.duration) || 0,
    updatedAt: video.updatedAt,
    segmentCount: counts?.segmentCount ?? 0,
    unreviewedCount: counts?.unreviewedCount ?? 0,
    approvedCount: counts?.approvedCount ?? 0,
    rejectedCount: counts?.rejectedCount ?? 0,
  };
}

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

export function normalizeDiscoveryIds(value) {
  const values = Array.isArray(value) ? value : String(value || "").split(",");
  return [...new Set(values.map(Number).filter((id) => Number.isInteger(id) && id > 0))];
}

function updateDiscoverySelection(current, visibleIds, videoId, anchorId = null, selectRange = false) {
  const next = new Set(current);
  const anchorIndex = visibleIds.indexOf(anchorId);
  const videoIndex = visibleIds.indexOf(videoId);
  if (selectRange && anchorIndex >= 0 && videoIndex >= 0) {
    const start = Math.min(anchorIndex, videoIndex);
    const end = Math.max(anchorIndex, videoIndex);
    visibleIds.slice(start, end + 1).forEach((id) => next.add(id));
  } else if (next.has(videoId)) next.delete(videoId);
  else next.add(videoId);
  return next;
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

function DiscoverySelectionButton({ item, selected, selectionActive, onSelect }) {
  if (!onSelect) return null;
  return h("button", {
    type: "button",
    "aria-label": selected ? "Deselect item" : "Select item",
    "aria-pressed": selected,
    onClick: (event) => { event.preventDefault(); event.stopPropagation(); onSelect(item.videoId, event.shiftKey); },
    className: `absolute left-0.5 top-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-md transition-opacity ${selected || selectionActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`,
  }, h("span", {
    className: `flex h-4 w-4 items-center justify-center rounded border shadow-sm ${selected ? "border-accent bg-accent text-white" : "border-border bg-background/95 text-transparent"}`,
  }, h("svg", {
    viewBox: "0 0 16 16",
    className: "h-3 w-3",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  }, h("path", { d: "M3.5 8.25 6.5 11.25 12.5 4.75" }))));
}

function DiscoveryCard({ item, onNavigate, showReviewStates = false, selected = false, selectionActive = false, onSelect = null }) {
  const route = { page: "segment-studio", id: item.videoId };
  return h("article", {
    onClick: selectionActive ? (event) => {
      if (event.button === 0) onSelect(item.videoId, event.shiftKey);
    } : undefined,
    className: `group relative flex min-h-full flex-col overflow-hidden rounded-md border bg-card shadow-sm transition-colors hover:border-accent/60 ${selectionActive ? "cursor-pointer" : ""} ${selected ? "border-accent ring-2 ring-accent" : "border-border"}`,
  }, [
    selectionActive ? null : h("a", {
      key: "link",
      href: `/segment-studio/${item.videoId}`,
      onClick: (event) => setPlainLinkNavigation(event, onNavigate, route),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${item.title}`,
    }),
    h("div", { key: "media", className: "relative aspect-video bg-black" }, [
      h("img", { key: "image", src: `/api/videos/${item.videoId}/image?maxDimension=640&v=${encodeURIComponent(item.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      h(DiscoverySelectionButton, { key: "selection", item, selected, selectionActive, onSelect }),
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

function DiscoveryRow({ item, onNavigate, showReviewStates = false, selected = false, selectionActive = false, onSelect = null }) {
  const route = { page: "segment-studio", id: item.videoId };
  return h("article", {
    onClick: selectionActive ? (event) => {
      if (event.button === 0) onSelect(item.videoId, event.shiftKey);
    } : undefined,
    className: `group relative overflow-hidden rounded-md border bg-card ${selectionActive ? "cursor-pointer" : ""} ${selected ? "border-accent ring-2 ring-accent" : "border-border"}`,
  }, [
    h(DiscoverySelectionButton, { key: "selection", item, selected, selectionActive, onSelect }),
    h(selectionActive ? "div" : "a", {
      key: "link",
    href: selectionActive ? undefined : `/segment-studio/${item.videoId}`,
    onClick: selectionActive ? undefined : (event) => setPlainLinkNavigation(event, onNavigate, route),
    className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": `Open segment editor for ${item.title}`,
  }, [
    h("img", { key: "image", src: `/api/videos/${item.videoId}/image?maxDimension=320&v=${encodeURIComponent(item.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
    h("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
      h("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, item.title),
      h(SegmentSummary, { key: "segments", item, showReviewStates }),
    ]),
    h("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›"),
    ]),
  ]);
}

export { DISCOVERY_URL_OPTIONS, setPlainLinkNavigation, setBackLinkNavigation, updateDiscoverySelection, SegmentSummary, DiscoveryCard, DiscoveryRow };
