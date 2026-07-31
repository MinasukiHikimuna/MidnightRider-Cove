import { EntityReferenceMultiSelector, EntityReferenceSelector, formatDuration, h } from "../shared/runtime.js";

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

export function buildDiscoverySearchParams(filter, objectFilter, workflow = null) {
  const params = new URLSearchParams();
  if (filter.q) params.set("q", filter.q);
  if (filter.page) params.set("page", String(filter.page));
  if (filter.perPage) params.set("perPage", String(filter.perPage));
  if (filter.sort) params.set("sort", filter.sort);
  if (filter.direction) params.set("direction", filter.direction);
  if (filter.sort === "random" && Number.isInteger(filter.seed) && filter.seed > 0) params.set("seed", String(filter.seed));
  const segmentTagId = Number(objectFilter.segmentTagId ?? objectFilter.tagId) || null;
  if (segmentTagId) params.set("segmentTagId", String(segmentTagId));
  const videoTagIds = normalizeDiscoveryIds(objectFilter.videoTagIds);
  if (videoTagIds.length > 0) params.set("videoTagIds", videoTagIds.join(","));
  const performerIds = normalizeDiscoveryIds(objectFilter.performerIds);
  if (performerIds.length > 0) params.set("performerIds", performerIds.join(","));
  const studioId = Number(objectFilter.studioId) || null;
  if (studioId) params.set("studioId", String(studioId));
  if (workflow && objectFilter.reviewState) params.set("reviewState", String(objectFilter.reviewState));
  if (workflow) params.set("workflow", workflow);
  if (objectFilter.segments === "has") params.set("hasSegments", "true");
  if (objectFilter.segments === "none") params.set("hasSegments", "false");
  if (workflow && objectFilter.shotBoundaries === "has") params.set("hasShotBoundaries", "true");
  if (workflow && objectFilter.shotBoundaries === "none") params.set("hasShotBoundaries", "false");
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

function DiscoveryFilters({ objectFilter, setObjectFilter, onClear, compatibilityMode = false }) {
  function update(key, value) {
    const next = { ...objectFilter };
    if (key === "segmentTagId") delete next.tagId;
    if (value == null || value === "") delete next[key];
    else next[key] = value;
    setObjectFilter(next);
  }
  const selectClass = "rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground";
  const selectorClass = `${selectClass} w-full`;
  const segmentTagId = Number(objectFilter.segmentTagId ?? objectFilter.tagId) || undefined;
  return h("section", { className: "space-y-4 rounded-lg border border-border bg-surface p-4" }, [
    h("div", { key: "heading", className: "flex items-center justify-between gap-3" }, [
      h("h2", { key: "title", className: "text-sm font-semibold text-foreground" }, "Filters"),
      h("button", {
        key: "clear",
        type: "button",
        onClick: onClear,
        disabled: Object.keys(objectFilter).length === 0,
        className: "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 disabled:opacity-50",
      }, "Clear filters"),
    ]),
    h("fieldset", { key: "segment-data", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4" }, [
      h("legend", { key: "legend", className: "mb-2 text-sm font-semibold text-foreground" }, "Segment data"),
      h("label", { key: "segments", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Segment presence"),
        h("select", { key: "control", value: objectFilter.segments || "", onChange: (event) => update("segments", event.target.value), className: `${selectClass} w-full` }, [
          h("option", { key: "all", value: "" }, "Any"),
          h("option", { key: "has", value: "has" }, "Has segments"),
          h("option", { key: "none", value: "none" }, "No segments"),
        ]),
      ]),
      compatibilityMode ? h("label", { key: "review", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Review state"),
        h("select", { key: "control", value: objectFilter.reviewState || "", onChange: (event) => update("reviewState", event.target.value), className: `${selectClass} w-full` }, [
          h("option", { key: "all", value: "" }, "Any"),
          h("option", { key: "unreviewed", value: "unreviewed" }, "Has unreviewed"),
          h("option", { key: "approved", value: "approved" }, "Has approved"),
          h("option", { key: "rejected", value: "rejected" }, "Has rejected"),
        ]),
      ]) : null,
      h("label", { key: "segment-tag", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Segment tag"),
        h(EntityReferenceSelector, {
          key: "control",
          entityType: "tag",
          value: segmentTagId,
          onChange: (tagId) => update("segmentTagId", tagId),
          placeholder: "Search Segment tags…",
          inputClassName: selectorClass,
          creatable: false,
          allowCreate: false,
        }),
      ]),
      compatibilityMode ? h("label", { key: "shots", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Shot boundaries"),
        h("select", { key: "control", value: objectFilter.shotBoundaries || "", onChange: (event) => update("shotBoundaries", event.target.value), className: `${selectClass} w-full` }, [
          h("option", { key: "all", value: "" }, "Any"),
          h("option", { key: "has", value: "has" }, "Has"),
          h("option", { key: "none", value: "none" }, "None"),
        ]),
      ]) : null,
    ]),
    h("fieldset", { key: "video-metadata", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, [
      h("legend", { key: "legend", className: "mb-2 text-sm font-semibold text-foreground" }, "Video metadata"),
      h("label", { key: "video-tags", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Video tags"),
        h(EntityReferenceMultiSelector, {
          key: "control",
          entityType: "tag",
          values: normalizeDiscoveryIds(objectFilter.videoTagIds),
          onChange: (tagIds) => update("videoTagIds", tagIds.length > 0 ? tagIds : null),
          placeholder: "Search Video tags…",
          inputClassName: selectorClass,
          creatable: false,
          allowCreate: false,
        }),
      ]),
      h("label", { key: "performers", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Performers"),
        h(EntityReferenceMultiSelector, {
          key: "control",
          entityType: "performer",
          values: normalizeDiscoveryIds(objectFilter.performerIds),
          onChange: (performerIds) => update("performerIds", performerIds.length > 0 ? performerIds : null),
          placeholder: "Search performers…",
          inputClassName: selectorClass,
          creatable: false,
          allowCreate: false,
        }),
      ]),
      h("label", { key: "studio", className: "space-y-1 text-xs text-secondary" }, [
        h("span", { key: "label" }, "Studio"),
        h(EntityReferenceSelector, {
          key: "control",
          entityType: "studio",
          value: Number(objectFilter.studioId) || undefined,
          onChange: (studioId) => update("studioId", studioId),
          placeholder: "Search studios…",
          inputClassName: selectorClass,
          creatable: false,
          allowCreate: false,
        }),
      ]),
    ]),
  ]);
}

export { DISCOVERY_URL_OPTIONS, DISCOVERY_SORT_OPTIONS, setPlainLinkNavigation, setBackLinkNavigation, SegmentSummary, DiscoveryCard, DiscoveryRow, DiscoveryFilters };
