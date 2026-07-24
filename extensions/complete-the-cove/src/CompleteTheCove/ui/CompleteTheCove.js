import React from "@cove/runtime/react";
import { createPortal } from "@cove/runtime/react-dom";
import { ConfirmDialog, DetailListPagination, MediaDetailLayout, PerformerTile, TagBadge } from "@cove/runtime/components";
import { extensionFetch } from "@cove/runtime/api";
import { RefreshCw, ChevronDown, Search, Puzzle, ExternalLink, Check, X, AlertTriangle, ArrowDown, ArrowUp, Users, Building2, Tags, Eye, EyeOff, MoreHorizontal } from "@cove/runtime/lucide-react";

const h = React.createElement;
const { useEffect, useId, useMemo, useRef, useState } = React;
const API = "/api/plugins/complete-the-cove";

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Invalid Date";
  return `${date.toISOString().slice(0, 19).replace("T", " ")} UTC`;
}

function formatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Invalid Date" : date.toISOString().slice(0, 10);
}

function performerImageUrl(performer) {
  return performer.covePerformerId ? `/api/performers/${performer.covePerformerId}/image?max=640` : null;
}

function providerLabel(endpoint) {
  const host = (() => { try { return new URL(endpoint).hostname.toLocaleLowerCase(); } catch { return endpoint || ""; } })();
  if (host.includes("stashdb.org")) return "StashDB";
  if (host.includes("theporndb.net")) return "TPDB";
  return host.replace(/^api\.|^www\./, "") || "Metadata server";
}

function normalizeProviderEndpoint(endpoint) {
  try { return new URL(endpoint.trim()).href.replace(/\/$/, ""); }
  catch { return endpoint.trim().replace(/\/$/, ""); }
}

function remoteVideoUrl(video) {
  try {
    const url = new URL(video.remoteEndpoint);
    if (url.hostname.includes("stashdb.org")) return `https://stashdb.org/scenes/${video.remoteId}`;
    if (url.hostname.includes("theporndb.net")) return `https://theporndb.net/scenes/${video.remoteId}`;
  } catch { /* ignore malformed provider endpoints */ }
  return null;
}

const DEFAULT_CATALOG_FILTERS = Object.freeze({
  q: "", provider: "",
  performer: [], excludePerformer: [], performerMode: "any",
  studio: [], excludeStudio: [], studioMode: "any", includeSubstudios: false,
  tag: [], excludeTag: [], tagMode: "any",
  showIgnored: false, sort: "release", direction: "desc", page: 1,
});
const CATALOG_FILTER_KEYS = [
  "q", "provider",
  "performer", "excludePerformer", "performerMode",
  "studio", "excludeStudio", "studioMode", "includeSubstudios",
  "tag", "excludeTag", "tagMode",
  "showIgnored", "sort", "direction", "page",
];
const SCOPED_CATALOG_FILTER_KEYS = Object.freeze({
  q: "ctcQ", provider: "ctcProvider",
  performer: "ctcPerformer", excludePerformer: "ctcExcludePerformer", performerMode: "ctcPerformerMode",
  studio: "ctcStudio", excludeStudio: "ctcExcludeStudio", studioMode: "ctcStudioMode", includeSubstudios: "ctcIncludeSubstudios",
  tag: "ctcTag", excludeTag: "ctcExcludeTag", tagMode: "ctcTagMode",
  showIgnored: "ctcShowIgnored", sort: "ctcSort", direction: "ctcDirection", page: "ctcPage",
});

function catalogFilterKey(key, pathname = window.location.pathname) {
  return /^\/(performer|studio|tag)\/\d+$/.test(pathname) ? SCOPED_CATALOG_FILTER_KEYS[key] : key;
}

function readCatalogFilters() {
  const params = new URLSearchParams(window.location.search);
  const value = (key) => params.get(catalogFilterKey(key));
  const values = (key) => params.getAll(catalogFilterKey(key)).filter(Boolean);
  const mode = (key) => ["all", "null", "not-null"].includes(value(key)) ? value(key) : "any";
  const parsedPage = Number(value("page"));
  return {
    q: value("q") || "",
    provider: value("provider") || "",
    performer: values("performer"),
    excludePerformer: values("excludePerformer"),
    performerMode: mode("performerMode"),
    studio: values("studio"),
    excludeStudio: values("excludeStudio"),
    studioMode: mode("studioMode"),
    includeSubstudios: value("includeSubstudios") === "true",
    tag: values("tag"),
    excludeTag: values("excludeTag"),
    tagMode: mode("tagMode"),
    showIgnored: value("showIgnored") === "true",
    sort: value("sort") === "title" ? "title" : "release",
    direction: value("direction") === "asc" ? "asc" : "desc",
    page: Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1,
  };
}

function appendCatalogFilterParams(params, filters, key = (name) => name) {
  if (filters.q) params.set(key("q"), filters.q);
  if (filters.provider) params.set(key("provider"), filters.provider);
  for (const facet of ["performer", "studio", "tag"]) {
    for (const value of filters[facet] || []) params.append(key(facet), value);
    const excludeKey = `exclude${facet[0].toLocaleUpperCase()}${facet.slice(1)}`;
    for (const value of filters[excludeKey] || []) params.append(key(excludeKey), value);
    const modeKey = `${facet}Mode`;
    if (filters[modeKey] && filters[modeKey] !== "any") params.set(key(modeKey), filters[modeKey]);
  }
  if (filters.includeSubstudios) params.set(key("includeSubstudios"), "true");
  if (filters.showIgnored) params.set(key("showIgnored"), "true");
  if (filters.sort !== DEFAULT_CATALOG_FILTERS.sort) params.set(key("sort"), filters.sort);
  if (filters.direction !== DEFAULT_CATALOG_FILTERS.direction) params.set(key("direction"), filters.direction);
  if (filters.page > 1) params.set(key("page"), String(filters.page));
  return params;
}

function writeCatalogFilters(filters) {
  const params = new URLSearchParams(window.location.search);
  const key = (name) => catalogFilterKey(name);
  CATALOG_FILTER_KEYS.forEach((name) => params.delete(key(name)));
  appendCatalogFilterParams(params, filters, key);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) window.history.replaceState(null, "", nextUrl);
}

function catalogApiQuery(filters, scope) {
  const params = appendCatalogFilterParams(new URLSearchParams(), filters);
  params.set("perPage", "24");
  if (scope) {
    params.set("targetType", scope.type);
    params.set("targetId", String(scope.entityId));
  }
  return params.toString();
}

function catalogQueryString() {
  const params = new URLSearchParams(window.location.search);
  if (window.location.pathname === "/missing-videos") params.delete("view");
  return params.toString();
}

function normalizeLegacyTabParams(params) {
  if (params.get("tab") === "ext:missing-scenes") params.set("tab", "ext:missing-videos");
  return params;
}

function missingVideoDetailUrl(videoId) {
  const params = new URLSearchParams(catalogQueryString());
  params.delete("ctcReturnTo");
  if (/^\/(performer|studio|tag)\/\d+$/.test(window.location.pathname)) params.set("ctcReturnTo", window.location.pathname);
  const query = params.toString();
  return `/missing-video/${videoId}${query ? `?${query}` : ""}`;
}

function missingVideosCatalogUrl() {
  const params = normalizeLegacyTabParams(new URLSearchParams(catalogQueryString()));
  const returnTo = params.get("ctcReturnTo");
  params.delete("ctcReturnTo");
  const path = returnTo && /^\/(performer|studio|tag)\/\d+$/.test(returnTo) ? returnTo : "/missing-videos";
  const query = params.toString();
  return `${path}${query ? `?${query}` : ""}`;
}

function readCatalogLocation() {
  const params = new URLSearchParams(window.location.search);
  const targetType = ["performer", "studio", "tag"].includes(params.get("targetType")) ? params.get("targetType") : null;
  const parsedTargetId = Number(params.get("targetId"));
  return {
    view: params.get("view") === "tracked" ? "tracked" : "videos",
    targetType,
    targetId: targetType && Number.isInteger(parsedTargetId) && parsedTargetId > 0 ? parsedTargetId : null,
  };
}

function writeCatalogLocation(location) {
  const params = new URLSearchParams(window.location.search);
  params.delete("view"); params.delete("targetType"); params.delete("targetId");
  if (location.view === "tracked") params.set("view", "tracked");
  if (location.view === "videos" && location.targetType && location.targetId) {
    params.set("targetType", location.targetType);
    params.set("targetId", String(location.targetId));
  }
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
  if (`${window.location.pathname}${window.location.search}` !== nextUrl) window.history.pushState(null, "", nextUrl);
}

function navigateUrl(url) {
  window.history.pushState(null, "", url);
  window.dispatchEvent(new CustomEvent("cove-locationchange"));
}

function replaceUrl(url) {
  window.history.replaceState(null, "", url);
  window.dispatchEvent(new CustomEvent("cove-locationchange"));
}

function normalizeLegacyTabLocation() {
  if (!/^\/(performer|studio|tag)\/\d+$/.test(window.location.pathname)) return;
  const params = new URLSearchParams(window.location.search);
  if (normalizeLegacyTabParams(params).toString() === window.location.search.slice(1)) return;
  replaceUrl(`${window.location.pathname}?${params}`);
}

normalizeLegacyTabLocation();

function readVideoCardMinWidth() {
  try {
    const storedValue = window.localStorage.getItem("cove.cardSize.video");
    const storedLevel = storedValue == null ? Number.NaN : Number(storedValue);
    const level = Number.isFinite(storedLevel) ? Math.min(8, Math.max(0, storedLevel)) : 1;
    return Math.round(225 + level * 50);
  } catch {
    return 275;
  }
}

async function request(url, options) {
  const response = await extensionFetch(url, { headers: { "Content-Type": "application/json", ...(options?.headers || {}) }, ...options });
  if (!response.ok) {
    let message = response.statusText || "Request failed.";
    try { const body = await response.json(); message = body.message || body.detail || message; } catch { /* ignore */ }
    throw new Error(message);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function runRefresh(body) {
  const started = await request("/api/extensions/complete-the-cove/jobs/refresh-catalog/run", { method: "POST", body: JSON.stringify(body) });
  for (;;) {
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
    const job = await request(`${API}/refresh/${encodeURIComponent(started.jobId)}`);
    if (job.completedAt || ["Completed", "Failed", "Cancelled", 2, 3, 4].includes(job.status)) {
      if (job.error) throw new Error(job.error);
      return;
    }
  }
}

function VideoMetadataPopover({ Icon, items, label, kind }) {
  const anchorRef = useRef(null);
  const panelRef = useRef(null);
  const closeTimerRef = useRef(null);
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState({});
  const cancelClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, 120);
  };
  const show = () => {
    cancelClose();
    const rect = anchorRef.current?.getBoundingClientRect();
    if (rect) {
      const width = Math.min(280, Math.max(180, window.innerWidth - 16));
      const left = Math.min(window.innerWidth - width - 8, Math.max(8, rect.left + rect.width / 2 - width / 2));
      const availableAbove = Math.max(0, rect.top - 14);
      const availableBelow = Math.max(0, window.innerHeight - rect.bottom - 14);
      const placeAbove = availableAbove >= 160 || availableAbove > availableBelow;
      setStyle(placeAbove
        ? { position: "fixed", zIndex: 9999, width, left, bottom: window.innerHeight - rect.top + 6, maxHeight: availableAbove }
        : { position: "fixed", zIndex: 9999, width, left, top: rect.bottom + 6, maxHeight: availableBelow });
    }
    setOpen(true);
  };
  useEffect(() => cancelClose, []);
  useEffect(() => {
    if (!open) return undefined;
    const dismiss = () => setOpen(false);
    const dismissOnScroll = (event) => {
      if (!panelRef.current?.contains(event.target)) dismiss();
    };
    const onKeyDown = (event) => { if (event.key === "Escape") dismiss(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", dismiss);
    window.addEventListener("scroll", dismissOnScroll, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", dismiss);
      window.removeEventListener("scroll", dismissOnScroll, true);
    };
  }, [open]);
  return h(React.Fragment, null, [
    h("button", { key: "anchor", ref: anchorRef, type: "button", className: "complete-the-cove-card-stat", onMouseEnter: show, onMouseLeave: scheduleClose, onFocus: show, onBlur: scheduleClose, onClick: (event) => { event.preventDefault(); event.stopPropagation(); open ? setOpen(false) : show(); }, "aria-label": `${items.length} ${label.toLocaleLowerCase()}`, "aria-expanded": open, "aria-controls": panelId }, [h(Icon, { key: "icon", className: "h-3.5 w-3.5" }), h("span", { key: "count" }, String(items.length))]),
    open ? createPortal(h("div", { ref: panelRef, id: panelId, className: "complete-the-cove-card-popover-panel", style, role: "dialog", "aria-label": label, onMouseEnter: cancelClose, onMouseLeave: scheduleClose }, [
      h("div", { key: "heading", className: "complete-the-cove-card-popover-heading" }, label),
      h("div", { key: "items", className: `complete-the-cove-card-popover-items complete-the-cove-card-popover-items-${kind}` }, items.map((item, index) => {
        if (kind !== "performers") return h("div", { key: item.remoteId || `${item.name}-${index}`, className: "complete-the-cove-card-popover-tag" }, [h(Tags, { key: "icon", className: "h-3.5 w-3.5 shrink-0 text-muted" }), h("span", { key: "name", title: item.name }, item.name)]);
        const imageUrl = performerImageUrl(item);
        const content = [
          h("div", { key: "portrait", className: "complete-the-cove-card-popover-portrait" }, imageUrl ? [
            h("img", { key: "image", src: imageUrl, alt: "", loading: "lazy", className: "complete-the-cove-card-popover-portrait-image", onError: (event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "flex"; } }),
            h("div", { key: "fallback", className: "complete-the-cove-card-popover-portrait-fallback" }, h(Users, { className: "h-8 w-8 text-muted" })),
          ] : h(Users, { className: "h-8 w-8 text-muted" })),
          h("span", { key: "name", title: item.name }, item.disambiguation ? `${item.name} (${item.disambiguation})` : item.name),
        ];
        return item.covePerformerId
          ? h("a", { key: item.remoteId || `${item.name}-${index}`, href: `/performer/${item.covePerformerId}`, className: "complete-the-cove-card-popover-performer", onClick: (event) => { event.preventDefault(); navigateUrl(`/performer/${item.covePerformerId}`); } }, content)
          : h("div", { key: item.remoteId || `${item.name}-${index}`, className: "complete-the-cove-card-popover-performer" }, content);
      })),
    ]), document.body) : null,
  ]);
}

function MissingBanner() {
  return h("div", { className: "complete-the-cove-missing-banner", "aria-label": "Missing video" }, "MISSING");
}

function MissingVideoCard({ video, onNavigate }) {
  const performers = video.performers || [];
  const tags = video.tags || [];
  const title = video.title || "Untitled video";
  const openVideo = (event) => {
    event?.preventDefault();
    navigateUrl(missingVideoDetailUrl(video.id));
  };
  return h("div", {
    className: "complete-the-cove-card video-card group relative flex h-full flex-col overflow-hidden rounded border border-border bg-card text-left",
  }, [
    h("a", {
      key: "link",
      href: missingVideoDetailUrl(video.id),
      onClick: openVideo,
      className: "complete-the-cove-card-link absolute inset-0 z-[1] rounded",
      "aria-label": `Open missing video ${title}`,
    }),
    h("div", { key: "content", className: "contents" }, [
    h("div", { key: "image", className: "complete-the-cove-card-preview card-media relative aspect-video overflow-hidden bg-black" }, [
      video.coverUrl
        ? h("img", { key: "cover", src: video.coverUrl, alt: `Cover for ${title}`, loading: "lazy", className: "complete-the-cove-card-preview-image h-full w-full object-cover" })
        : h("div", { key: "placeholder", className: "flex h-full items-center justify-center text-muted" }, h(Puzzle, { className: "h-8 w-8" })),
    ]),
    h("div", { key: "body", className: "complete-the-cove-card-body card-body flex min-h-0 flex-1 flex-col gap-1.5 border-t border-border/50 px-2.5 pb-2 pt-2" }, [
      h("div", { key: "heading" }, [
        h("p", { key: "title", className: "complete-the-cove-card-title card-title line-clamp-2 font-semibold leading-snug text-foreground", title }, title),
        h("div", { key: "meta", className: "complete-the-cove-card-meta mt-1 flex items-center gap-2 text-muted" }, [h("span", { key: "provider" }, providerLabel(video.remoteEndpoint)), video.releaseDate ? h("span", { key: "date" }, video.releaseDate) : null, video.studioName ? h("span", { key: "studio", className: "truncate" }, video.studioName) : null]),
      ]),
      performers.length ? h("div", { key: "performers", className: "complete-the-cove-card-performers relative flex flex-wrap items-center gap-1.5 overflow-hidden" }, [
        ...performers.slice(0, 4).map((performer) => h("span", { key: performer.remoteId, className: "complete-the-cove-performer-badge flex min-w-0 items-center gap-1 rounded-full border border-border bg-surface px-1.5 py-0.5" }, [performerImageUrl(performer) ? h("span", { key: "portrait", className: "complete-the-cove-performer-badge-portrait" }, [h("img", { key: "image", src: performerImageUrl(performer), alt: "", loading: "lazy", onError: (event) => { event.currentTarget.style.display = "none"; event.currentTarget.nextElementSibling.style.display = "block"; } }), h(Users, { key: "fallback", className: "complete-the-cove-performer-badge-fallback h-3.5 w-3.5 text-muted" })]) : h(Users, { key: "icon", className: "h-3.5 w-3.5 shrink-0 text-muted" }), h("span", { key: "name", className: "max-w-[80px] truncate text-[10px] text-secondary" }, performer.name)])),
        performers.length > 4 ? h("span", { key: "more", className: "text-[10px] text-muted" }, `+${performers.length - 4}`) : null,
      ]) : null,
      video.details ? h("p", { key: "details", className: "complete-the-cove-card-details line-clamp-2 text-xs leading-snug text-secondary" }, video.details) : null,
    ]),
    h("hr", { key: "divider", className: "my-0 border-border/50" }),
    h("div", { key: "popovers", className: "complete-the-cove-card-popovers card-popovers relative z-10 flex min-h-[28px] flex-wrap items-center justify-center gap-1 rounded-b px-2 py-1.5" }, performers.length || tags.length ? [
      performers.length ? h(VideoMetadataPopover, { key: "performer-count", Icon: Users, label: "Performers", kind: "performers", items: performers }) : null,
      tags.length ? h(VideoMetadataPopover, { key: "tag-count", Icon: Tags, label: "Tags", kind: "tags", items: tags }) : null,
    ] : h("span", { className: "select-none text-[10px] text-muted/30" }, " ")),
    ]),
  ]);
}

function RefreshSplitButton({ providers = [], refresh, refreshing, disabled = refreshing, label = "Refresh", title = "Refresh all providers" }) {
  const enabled = providers.filter((provider) => provider.enabled === true);
  return h("div", { className: "complete-the-cove-refresh-group" }, [
    h("button", { key: "all", type: "button", disabled, onClick: () => refresh(), title, "aria-label": title, className: `complete-the-cove-refresh bg-accent font-semibold text-white disabled:opacity-60 ${enabled.length ? "" : "complete-the-cove-refresh-only"}` }, [h(RefreshCw, { key: "icon", className: `h-4 w-4 ${refreshing ? "animate-spin" : ""}` }), refreshing ? "Queued" : label]),
    enabled.length ? h("details", { key: "choices", className: "complete-the-cove-refresh-choices relative" }, [
      h("summary", { key: "trigger", title: "Choose metadata provider", "aria-label": "Choose metadata provider", "aria-disabled": disabled, onClick: (event) => { if (disabled) event.preventDefault(); }, className: `complete-the-cove-refresh-arrow bg-accent text-white [&::-webkit-details-marker]:hidden ${disabled ? "pointer-events-none opacity-60" : ""}` }, h(ChevronDown, { className: "h-4 w-4" })),
      h("div", { key: "menu", className: "complete-the-cove-refresh-menu absolute right-0 top-full z-20 mt-1 min-w-56 rounded-md border border-border bg-card p-1 shadow-lg" }, enabled.map((provider) => h("button", { key: provider.endpoint, type: "button", disabled, onClick: (event) => { event.currentTarget.closest("details")?.removeAttribute("open"); refresh(provider); }, className: "block w-full rounded px-3 py-2 text-left text-sm text-secondary hover:bg-input hover:text-foreground disabled:opacity-60" }, `Refresh from ${provider.name || providerLabel(provider.endpoint)}`)))
    ]) : null,
  ]);
}

function cloneCatalogFilters(filters) {
  return {
    ...filters,
    performer: [...(filters.performer || [])],
    excludePerformer: [...(filters.excludePerformer || [])],
    studio: [...(filters.studio || [])],
    excludeStudio: [...(filters.excludeStudio || [])],
    tag: [...(filters.tag || [])],
    excludeTag: [...(filters.excludeTag || [])],
  };
}

function activeCatalogFilterCount(filters) {
  let count = 0;
  for (const facet of ["performer", "studio", "tag"]) {
    const excludeKey = `exclude${facet[0].toLocaleUpperCase()}${facet.slice(1)}`;
    count += (filters[facet] || []).length + (filters[excludeKey] || []).length;
    if (filters[`${facet}Mode`] !== "any") count += 1;
  }
  if (filters.includeSubstudios) count += 1;
  return count;
}

function FacetCriterion({ facet, label, values, draft, setDraft, allowSubstudios = false }) {
  const [search, setSearch] = useState("");
  const excludeKey = `exclude${facet[0].toLocaleUpperCase()}${facet.slice(1)}`;
  const modeKey = `${facet}Mode`;
  const included = draft[facet] || [];
  const excluded = draft[excludeKey] || [];
  const normalizedSearch = search.trim().toLocaleLowerCase();
  const matching = values.filter((item) => !normalizedSearch || item.name.toLocaleLowerCase().includes(normalizedSearch));
  const selectedValues = new Set([...included, ...excluded]);
  const displayed = [
    ...values.filter((item) => selectedValues.has(item.value)),
    ...matching.filter((item) => !selectedValues.has(item.value)),
  ].slice(0, 150);
  const updateSelection = (value, selection) => setDraft((current) => {
    const nextIncluded = (current[facet] || []).filter((item) => item !== value);
    const nextExcluded = (current[excludeKey] || []).filter((item) => item !== value);
    if (selection === "include" && !included.includes(value)) nextIncluded.push(value);
    if (selection === "exclude" && !excluded.includes(value)) nextExcluded.push(value);
    return { ...current, [facet]: nextIncluded, [excludeKey]: nextExcluded };
  });
  const modeOptions = [
    ["any", "Includes"],
    ["all", "Includes All"],
    ["null", "Is Null"],
    ["not-null", "Not Null"],
  ];
  const selectionDisabled = ["null", "not-null"].includes(draft[modeKey]);
  return h("section", { className: "complete-the-cove-filter-criterion" }, [
    h("div", { key: "heading", className: "complete-the-cove-filter-criterion-heading" }, [
      h("h3", { key: "title" }, label),
      h("span", { key: "count", className: "text-xs text-muted" }, `${included.length} included · ${excluded.length} excluded`),
    ]),
    h("div", { key: "modes", className: "complete-the-cove-filter-modes", role: "group", "aria-label": `${label} matching mode` }, modeOptions.map(([value, text]) => h("button", {
      key: value,
      type: "button",
      onClick: () => setDraft((current) => ({ ...current, [modeKey]: value })),
      className: `complete-the-cove-filter-mode ${draft[modeKey] === value ? "complete-the-cove-filter-choice-active" : ""}`,
      "aria-pressed": draft[modeKey] === value,
    }, text))),
    allowSubstudios ? h("label", { key: "substudios", className: "complete-the-cove-filter-checkbox" }, [
      h("input", { key: "input", type: "checkbox", checked: draft.includeSubstudios, onChange: (event) => setDraft((current) => ({ ...current, includeSubstudios: event.target.checked })) }),
      h("span", { key: "label" }, "Include sub-studios"),
    ]) : null,
    h("div", { key: "search", className: "complete-the-cove-filter-search" }, [
      h(Search, { key: "icon", className: "h-4 w-4 text-muted" }),
      h("input", { key: "input", value: search, onChange: (event) => setSearch(event.target.value), placeholder: `Search ${label.toLocaleLowerCase()}...`, "aria-label": `Search ${label.toLocaleLowerCase()}` }),
    ]),
    h("div", { key: "values", className: `complete-the-cove-filter-values ${selectionDisabled ? "complete-the-cove-filter-values-disabled" : ""}` }, displayed.length ? displayed.map((item) => {
      const isIncluded = included.includes(item.value);
      const isExcluded = excluded.includes(item.value);
      return h("div", { key: item.value, className: "complete-the-cove-filter-value" }, [
        h("button", { key: "include", type: "button", disabled: selectionDisabled, onClick: () => updateSelection(item.value, "include"), className: `complete-the-cove-filter-value-action ${isIncluded ? "complete-the-cove-filter-choice-active" : ""}`, title: `Include ${item.name}`, "aria-label": `Include ${item.name}`, "aria-pressed": isIncluded }, h(Check, { className: "h-3.5 w-3.5" })),
        h("button", { key: "exclude", type: "button", disabled: selectionDisabled, onClick: () => updateSelection(item.value, "exclude"), className: `complete-the-cove-filter-value-action ${isExcluded ? "complete-the-cove-filter-exclude-active" : ""}`, title: `Exclude ${item.name}`, "aria-label": `Exclude ${item.name}`, "aria-pressed": isExcluded }, h(X, { className: "h-3.5 w-3.5" })),
        h("span", { key: "name", title: item.name }, item.name),
        h("span", { key: "count", className: "text-xs text-muted" }, item.count.toLocaleString()),
      ]);
    }) : h("div", { className: "p-4 text-center text-sm text-muted" }, "No matching values.")),
    matching.length > displayed.length ? h("p", { key: "limit", className: "mt-2 text-xs text-muted" }, `Showing the first ${displayed.length.toLocaleString()} matches. Refine the search to see more.`) : null,
  ]);
}

function CatalogFilterPanel({ open, filters, facets, onApply, onClose }) {
  const [draft, setDraft] = useState(() => cloneCatalogFilters(filters));
  useEffect(() => { if (open) setDraft(cloneCatalogFilters(filters)); }, [open, filters]);
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);
  if (!open) return null;
  const clearAll = () => setDraft((current) => ({
    ...current,
    performer: [], excludePerformer: [], performerMode: "any",
    studio: [], excludeStudio: [], studioMode: "any", includeSubstudios: false,
    tag: [], excludeTag: [], tagMode: "any",
  }));
  return createPortal(h("div", { className: "complete-the-cove-filter-backdrop", onMouseDown: (event) => { if (event.target === event.currentTarget) onClose(); } }, h("div", { className: "complete-the-cove-filter-panel", role: "dialog", "aria-modal": true, "aria-labelledby": "complete-the-cove-filter-title" }, [
    h("header", { key: "header", className: "complete-the-cove-filter-header" }, [
      h("div", { key: "copy" }, [h("h2", { key: "title", id: "complete-the-cove-filter-title", className: "text-lg font-semibold" }, "Filter Missing Videos"), h("p", { key: "help", className: "text-xs text-muted" }, "Criteria are combined together. Included values follow each criterion's matching mode; excluded values never match.")]),
      h("button", { key: "close", type: "button", onClick: onClose, className: "complete-the-cove-icon-button text-secondary", title: "Close filters", "aria-label": "Close filters" }, h(X, { className: "h-4 w-4" })),
    ]),
    h("div", { key: "body", className: "complete-the-cove-filter-body" }, [
      h(FacetCriterion, { key: "performers", facet: "performer", label: "Performers", values: facets.performers || [], draft, setDraft }),
      h(FacetCriterion, { key: "studios", facet: "studio", label: "Studios", values: facets.studios || [], draft, setDraft, allowSubstudios: true }),
      h(FacetCriterion, { key: "tags", facet: "tag", label: "Tags", values: facets.tags || [], draft, setDraft }),
    ]),
    h("footer", { key: "footer", className: "complete-the-cove-filter-footer" }, [
      h("button", { key: "clear", type: "button", onClick: clearAll, className: "rounded-md border border-border px-3 py-2 text-sm text-secondary hover:text-foreground" }, "Clear All"),
      h("div", { key: "actions", className: "flex gap-2" }, [
        h("button", { key: "cancel", type: "button", onClick: onClose, className: "rounded-md border border-border px-3 py-2 text-sm text-secondary hover:text-foreground" }, "Cancel"),
        h("button", { key: "apply", type: "button", onClick: () => onApply({ ...draft, page: 1 }), className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white" }, "Apply"),
      ]),
    ]),
  ])), document.body);
}

function CatalogControls({ filters, setFilters, facets, refresh, refreshing, providers, total, perPage }) {
  const [searchText, setSearchText] = useState(filters.q || "");
  const [filterOpen, setFilterOpen] = useState(false);
  useEffect(() => { setSearchText(filters.q || ""); }, [filters.q]);
  useEffect(() => {
    if (searchText.trim() === (filters.q || "").trim()) return;
    const timeout = window.setTimeout(() => setFilters((current) => ({ ...current, q: searchText.trim(), page: 1 })), 350);
    return () => window.clearTimeout(timeout);
  }, [searchText, filters.q, setFilters]);

  const start = total > 0 ? (filters.page - 1) * perPage + 1 : 0;
  const end = Math.min(filters.page * perPage, total);
  const activeFilterCount = activeCatalogFilterCount(filters);
  const clearSearch = () => { setSearchText(""); setFilters((current) => ({ ...current, q: "", page: 1 })); };
  return h("div", { className: "complete-the-cove-toolbar" }, [
    h("span", { key: "count", className: "complete-the-cove-count text-muted" }, total > 0 ? `${start}–${end} of ${total.toLocaleString()}` : "0 items"),
    h("form", { key: "search", className: "complete-the-cove-search", onSubmit: (event) => { event.preventDefault(); setFilters((current) => ({ ...current, q: searchText.trim(), page: 1 })); } }, [
      h(Search, { key: "icon", className: "complete-the-cove-search-icon text-muted" }),
      h("input", { key: "input", type: "text", value: searchText, onChange: (event) => setSearchText(event.target.value), onKeyDown: (event) => { if (event.key === "Escape" && searchText) clearSearch(); }, placeholder: "Search missing videos...", "aria-label": "Search missing videos", className: "complete-the-cove-search-input border border-border bg-card/70 text-foreground placeholder:text-muted" }),
      searchText ? h("button", { key: "clear", type: "button", onClick: clearSearch, className: "complete-the-cove-search-clear text-muted", title: "Clear search", "aria-label": "Clear search" }, h(X, { className: "h-3.5 w-3.5" })) : null,
    ]),
    h("select", { key: "provider", "aria-label": "All providers", value: filters.provider, onChange: (event) => setFilters((current) => ({ ...current, provider: event.target.value, page: 1 })), className: "complete-the-cove-select complete-the-cove-provider-select rounded-md border border-border bg-input text-foreground" }, [h("option", { key: "", value: "" }, "All providers"), ...(facets.providers || []).map((item) => h("option", { key: item.value, value: item.value }, `${providerLabel(item.value)} (${item.count})`))]),
    h("button", { key: "filter", type: "button", onClick: () => setFilterOpen(true), className: `complete-the-cove-filter-trigger ${activeFilterCount ? "complete-the-cove-filter-trigger-active" : ""}`, "aria-haspopup": "dialog" }, [h(MoreHorizontal, { key: "icon", className: "h-4 w-4" }), h("span", { key: "label" }, "Filter"), activeFilterCount ? h("span", { key: "count", className: "complete-the-cove-filter-trigger-count" }, String(activeFilterCount)) : null]),
    h("details", { key: "options", className: "relative" }, [
      h("summary", { key: "trigger", title: "More catalog options", "aria-label": "More catalog options", className: "complete-the-cove-icon-button flex cursor-pointer list-none items-center justify-center text-secondary [&::-webkit-details-marker]:hidden" }, h(MoreHorizontal, { className: "h-4 w-4" })),
      h("div", { key: "menu", className: "absolute right-0 top-full z-20 mt-1 min-w-48 rounded-md border border-border bg-card p-2 shadow-lg" }, h("label", { className: "flex cursor-pointer items-center gap-2 whitespace-nowrap px-2 py-1.5 text-sm text-secondary" }, [h("input", { key: "input", type: "checkbox", checked: filters.showIgnored, onChange: (event) => setFilters((current) => ({ ...current, showIgnored: event.target.checked, page: 1 })) }), h(EyeOff, { key: "icon", className: "h-4 w-4" }), h("span", { key: "label" }, "Show ignored videos")]))
    ]),
    h("div", { key: "sort", className: "complete-the-cove-sort" }, [
      h("select", { key: "field", "aria-label": "Sort missing videos", value: filters.sort, onChange: (event) => setFilters((current) => ({ ...current, sort: event.target.value, page: 1 })), className: "complete-the-cove-select rounded-md border border-border bg-input text-foreground" }, [h("option", { key: "release", value: "release" }, "Release date"), h("option", { key: "title", value: "title" }, "Title")]),
      h("button", { key: "direction", type: "button", onClick: () => setFilters((current) => ({ ...current, direction: current.direction === "asc" ? "desc" : "asc", page: 1 })), className: "complete-the-cove-icon-button text-secondary", title: filters.direction === "asc" ? "Ascending" : "Descending", "aria-label": filters.direction === "asc" ? "Ascending" : "Descending" }, filters.direction === "desc" ? h(ArrowDown, { className: "h-3.5 w-3.5" }) : h(ArrowUp, { className: "h-3.5 w-3.5" })),
    ]),
    refresh ? h(RefreshSplitButton, { key: "refresh", providers, refresh, refreshing }) : null,
    h(CatalogFilterPanel, { key: "filter-panel", open: filterOpen, filters, facets, onApply: (next) => { setFilters(next); setFilterOpen(false); }, onClose: () => setFilterOpen(false) }),
  ]);
}

function clampCatalogPage(page, totalCount, perPage) {
  return Math.min(Math.max(1, page), Math.max(1, Math.ceil(totalCount / Math.max(1, perPage))));
}

function clampCatalogFilters(filters, data, currentQuery) {
  if (data.total == null || data.query !== currentQuery) return filters;
  const page = clampCatalogPage(filters.page, data.total, data.perPage);
  return page === filters.page ? filters : { ...filters, page };
}

function VideoGrid({ scope, onNavigate, allowRefresh = true, onRefreshed }) {
  const [cardMinWidth] = useState(readVideoCardMinWidth);
  const [filters, setFilters] = useState(readCatalogFilters);
  const [data, setData] = useState({ items: [], total: null, page: 1, perPage: 24 });
  const [facets, setFacets] = useState({ providers: [], performers: [], studios: [], tags: [] });
  const [providers, setProviders] = useState([]);
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [reloadVersion, setReloadVersion] = useState(0);
  useEffect(() => { writeCatalogFilters(filters); }, [filters]);
  useEffect(() => {
    const onPopState = () => setFilters(readCatalogFilters());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);
  const query = useMemo(() => catalogApiQuery(filters, scope), [filters, scope?.type, scope?.entityId]);
  useEffect(() => { let cancelled = false; const requestQuery = query; request(`${API}/videos?${requestQuery}`).then((value) => { if (!cancelled) { setData({ ...value, query: requestQuery }); setError(""); } }).catch((err) => !cancelled && setError(err.message)); return () => { cancelled = true; }; }, [query, reloadVersion]);
  useEffect(() => { request(`${API}/facets?showIgnored=${filters.showIgnored}`).then(setFacets).catch(() => {}); }, [filters.showIgnored, reloadVersion]);
  useEffect(() => { request(`${API}/providers`).then(setProviders).catch(() => {}); }, []);
  useEffect(() => {
    setFilters((current) => clampCatalogFilters(current, data, query));
  }, [data.total, data.perPage, data.query, query]);
  async function refresh(provider) {
    setRefreshing(true); setError("");
    try {
      const body = { ...(scope ? { entityType: scope.type, entityId: String(scope.entityId) } : {}), ...(provider ? { providerEndpoint: provider.endpoint } : {}) };
      await runRefresh(body);
      setReloadVersion((current) => current + 1);
      onRefreshed?.();
    } catch (err) { setError(err.message); } finally { setRefreshing(false); }
  }
  return h("div", null, [
    h(CatalogControls, { key: "controls", filters, setFilters, facets, providers, refresh: allowRefresh ? refresh : null, refreshing, total: data.total || 0, perPage: data.perPage }),
    data.total == null ? null : h(DetailListPagination, { key: "pagination-top", filter: { ...filters, perPage: data.perPage }, onFilterChange: setFilters, totalCount: data.total }),
    error ? h("div", { key: "error", className: "complete-the-cove-content mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200" }, error) : null,
    data.items.length ? h("div", { key: "grid", className: "complete-the-cove-content complete-the-cove-grid", style: { "--card-min-width": `${cardMinWidth}px` } }, data.items.map((video) => h(MissingVideoCard, { key: video.id, video, onNavigate })))
      : h("div", { key: "empty", className: "complete-the-cove-content rounded-lg border border-dashed border-border p-12 text-center text-secondary" }, "No missing videos match this view."),
    data.total == null ? null : h(DetailListPagination, { key: "pagination-bottom", filter: { ...filters, perPage: data.perPage }, onFilterChange: setFilters, totalCount: data.total }),
  ]);
}

function ProviderProgress({ providers = [] }) {
  if (!providers.length) return h("div", { className: "complete-the-cove-progress-empty text-muted" }, "Refresh to calculate progress");
  return h("div", { className: "complete-the-cove-progress-list" }, providers.map((provider) => {
    const percentage = provider.eligibleVideoCount > 0
      ? Math.round((provider.ownedVideoCount / provider.eligibleVideoCount) * 100)
      : null;
    const detail = percentage === null
      ? "No eligible videos"
      : `${provider.ownedVideoCount.toLocaleString()} of ${provider.eligibleVideoCount.toLocaleString()} owned`;
    return h("div", { key: provider.endpoint, className: `complete-the-cove-progress ${provider.lastRefreshError ? "complete-the-cove-progress-stale" : ""}`, title: provider.lastRefreshError || `Last measured ${formatDateTime(provider.lastSuccessfulRefreshAt)}` }, [
      h("div", { key: "heading", className: "complete-the-cove-progress-heading" }, [
        h("span", { key: "provider", className: "font-medium" }, providerLabel(provider.endpoint)),
        h("span", { key: "percentage", className: provider.lastRefreshError ? "text-amber-300" : "text-accent" }, percentage === null ? "—" : `${percentage}%`),
      ]),
      h("div", { key: "bar", className: "complete-the-cove-progress-bar", role: "progressbar", "aria-label": `${providerLabel(provider.endpoint)} completion`, "aria-valuemin": 0, "aria-valuemax": 100, "aria-valuenow": percentage ?? 0 }, h("span", { className: "complete-the-cove-progress-fill", style: { width: `${percentage ?? 0}%` } })),
      h("div", { key: "detail", className: "complete-the-cove-progress-detail text-muted" }, [h("span", { key: "counts" }, detail), provider.lastRefreshError ? h("span", { key: "stale", className: "text-amber-300" }, "Last successful measurement") : null]),
    ]);
  }));
}

const TARGET_SECTIONS = [
  { type: "performer", label: "Performers", singular: "performer", Icon: Users },
  { type: "studio", label: "Studios", singular: "studio", Icon: Building2 },
  { type: "tag", label: "Tags", singular: "tag", Icon: Tags },
];

function TargetRow({ target, providers, refreshKey, onRefresh, onOpen, onUntrack }) {
  const refreshing = refreshKey === `${target.type}:${target.entityId}`;
  return h("div", { className: "complete-the-cove-target-row border-border bg-card" }, [
    h("button", { key: "main", type: "button", onClick: () => onOpen(target), className: "complete-the-cove-target-main text-left" }, [
      h("span", { key: "name", className: "complete-the-cove-target-name font-medium text-foreground" }, target.displayName),
      h("span", { key: "count", className: "complete-the-cove-target-count text-accent" }, `${target.missingVideoCount.toLocaleString()} missing ${target.missingVideoCount === 1 ? "video" : "videos"}`),
      h("span", { key: "tracked", className: "complete-the-cove-target-meta text-muted" }, `Tracked ${formatDate(target.selectedAt)}`),
      h("span", { key: "refresh-state", className: `complete-the-cove-target-meta ${target.lastRefreshError ? "text-amber-300" : "text-muted"}` }, target.lastRefreshError || (target.lastRefreshAt ? `Last refreshed ${formatDateTime(target.lastRefreshAt)}` : "Not refreshed yet")),
      h(ProviderProgress, { key: "progress", providers: target.providers }),
    ]),
    h("div", { key: "actions", className: "complete-the-cove-target-actions" }, [
      h(RefreshSplitButton, { key: "refresh", providers, disabled: Boolean(refreshKey), refreshing, refresh: (provider) => onRefresh(target, provider), title: `Refresh ${target.displayName} from all providers` }),
      h("button", { key: "untrack", type: "button", disabled: Boolean(refreshKey), onClick: () => onUntrack(target), title: `Stop tracking ${target.displayName}`, "aria-label": `Stop tracking ${target.displayName}`, className: "complete-the-cove-target-action text-secondary disabled:opacity-50" }, h(X, { className: "h-4 w-4" })),
    ]),
  ]);
}

function TrackedRecordsView({ overview, loading, error, reload, onOpen }) {
  const [searchText, setSearchText] = useState("");
  const [refreshKey, setRefreshKey] = useState("");
  const [providers, setProviders] = useState([]);
  const [actionError, setActionError] = useState("");
  const [pendingUntrack, setPendingUntrack] = useState(null);
  const [untracking, setUntracking] = useState(false);
  const [untrackError, setUntrackError] = useState("");
  const query = searchText.trim().toLocaleLowerCase();
  const visibleItems = overview.items.filter((target) => !query || target.displayName.toLocaleLowerCase().includes(query));
  useEffect(() => { request(`${API}/providers`).then(setProviders).catch(() => {}); }, []);

  async function refresh(target, provider) {
    const key = `${target.type}:${target.entityId}`;
    setRefreshKey(key); setActionError("");
    try { await runRefresh({ entityType: target.type, entityId: String(target.entityId), ...(provider ? { providerEndpoint: provider.endpoint } : {}) }); await reload(); }
    catch (err) { setActionError(err.message); await reload(); }
    finally { setRefreshKey(""); }
  }
  async function untrack() {
    if (!pendingUntrack) return;
    setUntracking(true); setUntrackError("");
    try {
      await request(`${API}/targets/${pendingUntrack.type}/${pendingUntrack.entityId}`, { method: "DELETE" });
      setPendingUntrack(null); await reload();
    } catch (err) { setUntrackError(err.message); }
    finally { setUntracking(false); }
  }

  if (loading) return h("div", { className: "complete-the-cove-overview-state text-secondary" }, "Loading tracked records...");
  if (error) return h("div", { className: "complete-the-cove-overview-state" }, [h("p", { key: "error", className: "text-red-300" }, error), h("button", { key: "retry", type: "button", onClick: reload, className: "mt-3 rounded-md bg-accent px-3 py-2 text-sm font-semibold text-white" }, "Retry")]);
  return h("div", null, [
    h("div", { key: "toolbar", className: "complete-the-cove-target-toolbar border-border bg-card" }, [
      h("span", { key: "count", className: "complete-the-cove-count text-muted" }, query ? `${visibleItems.length.toLocaleString()} of ${overview.totals.all.toLocaleString()} tracked` : `${overview.totals.all.toLocaleString()} tracked`),
      h("div", { key: "search", className: "complete-the-cove-search" }, [h(Search, { key: "icon", className: "complete-the-cove-search-icon text-muted" }), h("input", { key: "input", value: searchText, onChange: (event) => setSearchText(event.target.value), onKeyDown: (event) => { if (event.key === "Escape") setSearchText(""); }, placeholder: "Search tracked records...", "aria-label": "Search tracked records", className: "complete-the-cove-search-input border border-border bg-input text-foreground placeholder:text-muted" }), searchText ? h("button", { key: "clear", type: "button", onClick: () => setSearchText(""), className: "complete-the-cove-search-clear text-muted", title: "Clear search", "aria-label": "Clear search" }, h(X, { className: "h-3.5 w-3.5" })) : null]),
    ]),
    actionError ? h("div", { key: "action-error", className: "mb-4 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200" }, actionError) : null,
    overview.totals.all === 0 ? h("div", { key: "empty", className: "complete-the-cove-overview-state text-secondary" }, "No records are tracked yet. Track a performer, studio, or tag from its Missing Videos tab.") : null,
    overview.totals.all > 0 && visibleItems.length === 0 ? h("div", { key: "no-results", className: "mb-4 rounded-lg border border-dashed border-border p-8 text-center text-secondary" }, "No tracked records match this search.") : null,
    ...TARGET_SECTIONS.map(({ type, label, Icon }) => {
      const items = visibleItems.filter((target) => target.type === type);
      const total = overview.items.filter((target) => target.type === type).length;
      return h("section", { key: type, className: "complete-the-cove-target-section" }, [
        h("h2", { key: "heading", className: "complete-the-cove-target-heading" }, [h(Icon, { key: "icon", className: "h-4 w-4 text-accent" }), h("span", { key: "label" }, label), h("span", { key: "count", className: "complete-the-cove-section-count text-muted" }, query ? `${items.length}/${total}` : String(total))]),
        items.length ? h("div", { key: "rows", className: "complete-the-cove-target-rows" }, items.map((target) => h(TargetRow, { key: `${target.type}:${target.entityId}`, target, providers, refreshKey, onRefresh: refresh, onOpen, onUntrack: (item) => { setUntrackError(""); setPendingUntrack(item); } }))) : h("div", { key: "empty", className: "complete-the-cove-target-empty border-border text-muted" }, query && total ? "No matches in this section." : `No tracked ${label.toLocaleLowerCase()}.`),
      ]);
    }),
    h(ConfirmDialog, { key: "confirm", open: Boolean(pendingUntrack), title: pendingUntrack ? `Stop tracking ${pendingUntrack.displayName}?` : "Stop tracking?", message: "Missing videos linked only to this record will be removed from the catalog.", confirmLabel: "Stop tracking", onConfirm: untrack, onCancel: () => { if (!untracking) { setPendingUntrack(null); setUntrackError(""); } }, isPending: untracking, errorMessage: untrackError }),
  ]);
}

function MissingVideosPage({ onNavigate }) {
  const [location, setLocation] = useState(readCatalogLocation);
  const [overview, setOverview] = useState({ items: [], totals: { all: 0, performer: 0, studio: 0, tag: 0 } });
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const loadOverview = async () => {
    setOverviewLoading(true);
    try { setOverview(await request(`${API}/targets`)); setOverviewError(""); }
    catch (err) { setOverviewError(err.message); }
    finally { setOverviewLoading(false); }
  };
  useEffect(() => { loadOverview(); }, []);
  useEffect(() => { const onPopState = () => setLocation(readCatalogLocation()); window.addEventListener("popstate", onPopState); return () => window.removeEventListener("popstate", onPopState); }, []);
  const navigateCatalog = (next) => { writeCatalogLocation(next); setLocation(next); };
  const selectedTarget = location.targetType && location.targetId ? overview.items.find((target) => target.type === location.targetType && target.entityId === location.targetId) : null;
  const scope = location.targetType && location.targetId ? { type: location.targetType, entityId: location.targetId } : null;
  const activeTabId = location.view === "tracked" ? "complete-the-cove-tab-tracked" : "complete-the-cove-tab-videos";
  const handleTabKey = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextView = event.key === "Home" ? "videos" : event.key === "End" ? "tracked" : location.view === "videos" ? "tracked" : "videos";
    navigateCatalog({ view: nextView, targetType: null, targetId: null });
    window.requestAnimationFrame(() => document.getElementById(`complete-the-cove-tab-${nextView}`)?.focus());
  };
  return h("div", { className: "mx-auto max-w-[1800px]" }, [
    h("div", { key: "header", className: "mb-3" }, [h("h1", { key: "title", className: "text-2xl font-semibold" }, "Missing Videos"), h("p", { key: "description", className: "mt-1 text-sm text-secondary" }, "Remote videos missing from this Cove for your tracked performers, studios, and tags.")]),
    h("div", { key: "tabs", className: "complete-the-cove-tabs border-border", role: "tablist", "aria-label": "Missing Videos views" }, [
      h("button", { key: "videos", id: "complete-the-cove-tab-videos", type: "button", role: "tab", "aria-selected": location.view === "videos", "aria-controls": "complete-the-cove-panel", tabIndex: location.view === "videos" ? 0 : -1, onKeyDown: handleTabKey, onClick: () => navigateCatalog({ view: "videos", targetType: null, targetId: null }), className: `complete-the-cove-tab ${location.view === "videos" ? "complete-the-cove-tab-active" : ""}` }, "Missing Videos"),
      h("button", { key: "tracked", id: "complete-the-cove-tab-tracked", type: "button", role: "tab", "aria-selected": location.view === "tracked", "aria-controls": "complete-the-cove-panel", tabIndex: location.view === "tracked" ? 0 : -1, onKeyDown: handleTabKey, onClick: () => navigateCatalog({ view: "tracked", targetType: null, targetId: null }), className: `complete-the-cove-tab ${location.view === "tracked" ? "complete-the-cove-tab-active" : ""}` }, ["Tracked", !overviewLoading ? h("span", { key: "count", className: "complete-the-cove-tab-count" }, overview.totals.all.toLocaleString()) : null]),
    ]),
    h("div", { key: "content", id: "complete-the-cove-panel", role: "tabpanel", "aria-labelledby": activeTabId, className: "complete-the-cove-panel" }, location.view === "tracked"
      ? h(TrackedRecordsView, { overview, loading: overviewLoading, error: overviewError, reload: loadOverview, onOpen: (target) => navigateCatalog({ view: "videos", targetType: target.type, targetId: target.entityId }) })
      : h("div", null, [
        scope ? h("div", { key: "scope", className: `complete-the-cove-scope ${selectedTarget || overviewLoading ? "border-accent/40 bg-accent/10" : "border-amber-500/40 bg-amber-500/10"}` }, [h("div", { key: "copy", className: "min-w-0 flex-1" }, [h("div", { key: "title", className: "text-sm font-medium" }, overviewLoading ? "Loading tracked record..." : overviewError ? "Could not load tracked record details" : selectedTarget ? `Missing videos for ${selectedTarget.displayName}` : "Tracked record is no longer available"), h("div", { key: "detail", className: "text-xs text-secondary" }, overviewLoading ? "The video catalog remains scoped to this record." : overviewError ? `${overviewError} The video catalog remains scoped.` : selectedTarget ? `${selectedTarget.missingVideoCount.toLocaleString()} linked ${selectedTarget.missingVideoCount === 1 ? "video" : "videos"}` : "No videos should remain linked to this record."), selectedTarget ? h(ProviderProgress, { key: "progress", providers: selectedTarget.providers }) : null]), h("button", { key: "clear", type: "button", onClick: () => navigateCatalog({ view: "videos", targetType: null, targetId: null }), className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:text-foreground" }, "Show all")]) : null,
        h(VideoGrid, { key: scope ? `${scope.type}:${scope.entityId}` : "all", scope, onNavigate, onRefreshed: loadOverview }),
      ])),
  ]);
}

function EntityTab({ entityId, type, onNavigate }) {
  const [state, setState] = useState(null); const [error, setError] = useState(""); const [busy, setBusy] = useState(false);
  const url = `${API}/targets/${type}/${entityId}`;
  const load = () => request(url).then(setState).catch((err) => setError(err.message));
  useEffect(() => { load(); }, [url]);
  async function toggle() { setBusy(true); setError(""); try { await request(url, { method: state?.tracked ? "DELETE" : "POST", body: state?.tracked ? undefined : "{}" }); await load(); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  if (!state) return h("p", { className: "text-sm text-secondary" }, error || "Loading completion status...");
  if (!state.tracked) return h("div", { className: "rounded-lg border border-border bg-card p-6 text-center" }, [h(Puzzle, { key: "icon", className: "mx-auto h-8 w-8 text-accent" }), h("h3", { key: "title", className: "mt-3 text-lg font-semibold" }, "Track missing videos"), h("p", { key: "help", className: "mx-auto mt-1 max-w-lg text-sm text-secondary" }, "Track this entity across each configured metadata provider where it has a remote identity."), error ? h("p", { key: "error", className: "mt-3 text-sm text-red-300" }, error) : null, h("button", { key: "track", disabled: busy, onClick: toggle, className: "mt-4 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" }, busy ? "Tracking..." : "Track this entity")]);
  return h("div", null, [h("div", { key: "status", className: "mb-4 rounded-lg border border-border bg-card p-3" }, [h("div", { key: "heading", className: "flex flex-wrap items-center justify-between gap-3" }, [h("div", { key: "copy" }, [h("div", { key: "title", className: "inline-flex items-center gap-2 text-sm font-medium" }, [state.tracked.lastRefreshError ? h(AlertTriangle, { key: "status-icon", className: "h-4 w-4 text-amber-400" }) : h(Check, { key: "status-icon", className: "h-4 w-4 text-green-400" }), "Tracked for completion"]), h("div", { key: "detail", className: "text-xs text-secondary" }, state.tracked.lastRefreshError || (state.tracked.lastRefreshAt ? `Last refreshed ${formatDateTime(state.tracked.lastRefreshAt)}` : "Not refreshed yet"))]), h("button", { key: "untrack", disabled: busy, onClick: toggle, className: "inline-flex items-center gap-1 rounded border border-border px-3 py-1.5 text-sm text-secondary hover:text-foreground" }, [h(X, { key: "icon", className: "h-4 w-4" }), "Untrack"])]), h(ProviderProgress, { key: "progress", providers: state.tracked.providers })]), h(VideoGrid, { key: "grid", scope: { type, entityId }, onNavigate })]);
}

function MissingVideoDetailPage({ id, onNavigate }) {
  const [video, setVideo] = useState(null); const [error, setError] = useState("");
  const [ignoreBusy, setIgnoreBusy] = useState(false); const [ignoreError, setIgnoreError] = useState("");
  useEffect(() => { request(`${API}/videos/${id}`).then(setVideo).catch((err) => setError(err.message)); }, [id]);
  async function toggleIgnored() {
    setIgnoreBusy(true); setIgnoreError("");
    try {
      await request(`${API}/videos/${id}/ignore`, { method: video.isIgnored ? "DELETE" : "POST" });
      setVideo((current) => ({ ...current, isIgnored: !current.isIgnored }));
    } catch (err) { setIgnoreError(err.message); } finally { setIgnoreBusy(false); }
  }
  const media = video?.coverUrl ? h("div", { className: "relative flex min-h-0 flex-1 items-center justify-center overflow-hidden bg-black" }, [
    h("img", { key: "cover", src: video.coverUrl, alt: `Cover for ${video.title || "Untitled video"}`, className: "relative h-full w-full object-contain" }),
    h(MissingBanner, { key: "missing" }),
  ]) : h("div", { className: "flex h-full w-full items-center justify-center bg-black text-muted" }, "No cover available");
  const sourceUrl = video ? remoteVideoUrl(video) : null;
  const metadataRows = video ? [["Created", formatDate(video.createdAt)], ["Updated", formatDate(video.updatedAt)], ["Studio Code", video.code]].filter((x) => x[1]) : [];
  const studioImageUrl = video?.coveStudioId ? `/api/studios/${video.coveStudioId}/image?max=640` : null;
  const headerImage = studioImageUrl ? h("button", { type: "button", onClick: () => onNavigate({ page: "studio", id: video.coveStudioId }), className: "block", title: video.studioName || "Studio" }, h("img", { src: studioImageUrl, alt: video.studioName || "Studio", className: "h-20 w-auto max-w-full object-contain", onError: (event) => { event.currentTarget.style.display = "none"; } })) : null;
  const subtitle = video ? h("div", { className: "flex flex-wrap items-start gap-4 text-sm text-secondary" }, h("div", { className: "flex min-w-0 flex-1 flex-col gap-1" }, [video.releaseDate ? h("span", { key: "date" }, video.releaseDate) : null, video.studioName ? h(video.coveStudioId ? "button" : "span", { key: "studio", type: video.coveStudioId ? "button" : undefined, onClick: video.coveStudioId ? () => onNavigate({ page: "studio", id: video.coveStudioId }) : undefined, className: video.coveStudioId ? "w-fit font-medium text-accent hover:underline" : "w-fit font-medium" }, video.studioName) : null, video.code ? h("span", { key: "code" }, `Code ${video.code}`) : null])) : undefined;
  const content = video ? h("div", { className: "space-y-4" }, [
    h("div", { key: "ignore", className: "flex flex-wrap items-center gap-3" }, [h("button", { key: "button", type: "button", disabled: ignoreBusy, onClick: toggleIgnored, className: "inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:text-foreground disabled:opacity-60" }, [h(video.isIgnored ? Eye : EyeOff, { key: "icon", className: "h-4 w-4" }), h("span", { key: "label" }, ignoreBusy ? "Saving..." : video.isIgnored ? "Unignore" : "Ignore")]), ignoreError ? h("span", { key: "error", className: "text-sm text-red-300" }, ignoreError) : null]),
    h("dl", { key: "metadata", className: "grid gap-y-1.5 text-sm", style: { gridTemplateColumns: "auto 1fr" } }, metadataRows.flatMap(([label, value]) => [h("dt", { key: `${label}-l`, className: "pr-3 text-muted" }, label), h("dd", { key: `${label}-v`, className: "text-foreground" }, value)])),
    video.details ? h("p", { key: "details", className: "whitespace-pre-wrap text-sm text-foreground" }, video.details) : null,
    video.tags?.length ? h("section", { key: "tags" }, [h("h6", { className: "mb-2 text-sm text-muted" }, "Tags"), h("div", { className: "flex flex-wrap gap-1.5" }, video.tags.map((tag) => h(TagBadge, { key: tag.remoteId, name: tag.name, tag: tag.coveTagId ? { id: tag.coveTagId, name: tag.name } : undefined, onClick: tag.coveTagId ? () => onNavigate({ page: "tag", id: tag.coveTagId }) : undefined })))]) : null,
    video.performers?.length ? h("section", { key: "performers" }, [h("h6", { className: "mb-2 text-sm text-muted" }, `Performer${video.performers.length > 1 ? "s" : ""}`), h("div", { className: video.performers.length > 1 ? "grid grid-cols-2 gap-3" : "grid max-w-[220px] gap-3" }, video.performers.map((performer) => performer.covePerformerId ? h(PerformerTile, { key: performer.remoteId, performer: { id: performer.covePerformerId, name: performer.name, imagePath: performerImageUrl(performer) }, onClick: () => onNavigate({ page: "performer", id: performer.covePerformerId }), onNavigate }) : h("div", { key: performer.remoteId, className: "rounded border border-border bg-card p-3 text-sm" }, performer.name)))]) : null,
    sourceUrl || video.urls?.length ? h("section", { key: "links" }, [h("h6", { className: "mb-2 text-sm text-muted" }, "URLs"), h("div", { className: "space-y-2" }, [sourceUrl ? h("div", { key: "metadata", className: "flex flex-wrap gap-2" }, h("a", { href: sourceUrl, target: "_blank", rel: "noopener noreferrer", title: `Open ${providerLabel(video.remoteEndpoint)} metadata page`, "aria-label": `Open ${providerLabel(video.remoteEndpoint)} metadata page`, className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs text-accent transition hover:border-accent/60 hover:text-accent-hover" }, [h(ExternalLink, { key: "icon", className: "h-3 w-3" }), h("span", { key: "label" }, providerLabel(video.remoteEndpoint))])) : null, video.urls?.length ? h("div", { key: "urls", className: "space-y-1" }, video.urls.map((url) => h("a", { key: url, href: url, target: "_blank", rel: "noopener noreferrer", className: "block break-all text-sm text-accent hover:underline" }, url))) : null])]) : null,
  ]) : null;
  return h(MediaDetailLayout, { title: video?.title || "Missing video", headerImage, subtitle, backLabel: "Back to Missing Videos", onGoBack: () => {
    navigateUrl(missingVideosCatalogUrl());
  }, media, mediaFullBleed: true, isLoading: !video && !error, error }, content);
}

function LegacyMissingVideosPage() {
  useEffect(() => { replaceUrl(`/missing-videos${window.location.search}`); }, []);
  return null;
}

function LegacyMissingVideoDetailPage({ id }) {
  useEffect(() => { replaceUrl(`/missing-video/${id}${window.location.search}`); }, [id]);
  return null;
}

function CompleteTheCoveSettings() {
  const [value, setValue] = useState(""); const [providers, setProviders] = useState([]); const [selected, setSelected] = useState([]); const [message, setMessage] = useState(""); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  useEffect(() => { Promise.all([request("/api/plugins/complete-the-cove/config"), request("/api/plugins/complete-the-cove/providers")]).then(([config, available]) => { const configured = (config.selected_metadata_endpoints || "").split(",").map(normalizeProviderEndpoint).filter(Boolean); setValue(config.excluded_tags || ""); setProviders(available); setSelected(configured.length ? configured : available.map((item) => item.endpoint)); }).catch((err) => setMessage(err.message)).finally(() => setLoading(false)); }, []);
  function toggle(endpoint) { setSelected((current) => current.includes(endpoint) ? current.filter((item) => item !== endpoint) : [...current, endpoint]); }
  async function save() { setSaving(true); setMessage(""); try { await request("/api/plugins/complete-the-cove/config", { method: "POST", body: JSON.stringify({ excluded_tags: value, selected_metadata_endpoints: selected.join(",") }) }); setMessage("Settings saved. Refresh the catalog to apply provider changes."); } catch (err) { setMessage(err.message); } finally { setSaving(false); } }
  return h("div", { className: "space-y-4" }, [h("fieldset", { key: "providers", className: "space-y-2" }, [h("legend", { key: "legend", className: "text-sm font-medium" }, "Metadata providers"), h("p", { key: "help", className: "text-xs text-secondary" }, "Select one or more configured providers for tracking and catalog refreshes."), loading ? h("p", { key: "loading", className: "text-sm text-secondary" }, "Loading configured providers...") : providers.length === 0 ? h("p", { key: "empty", className: "text-sm text-secondary" }, "No compatible metadata providers are configured in Cove.") : null, ...providers.map((provider) => h("label", { key: provider.endpoint, className: "flex items-center gap-2 text-sm" }, [h("input", { key: "input", type: "checkbox", checked: selected.includes(provider.endpoint), onChange: () => toggle(provider.endpoint) }), h("span", { key: "name" }, provider.name), h("span", { key: "endpoint", className: "text-xs text-secondary" }, providerLabel(provider.endpoint))]))]), h("label", { key: "excluded", className: "block" }, [h("span", { key: "label", className: "block text-sm font-medium" }, "Excluded remote tags"), h("span", { key: "help", className: "block text-xs text-secondary" }, "Comma-separated exact tag names. Matching is case-insensitive."), h("input", { key: "input", value, onChange: (event) => setValue(event.target.value), placeholder: "Tag name, Another tag", className: "mt-2 w-full rounded-md border border-border bg-card px-3 py-2 text-sm" })]), h("div", { key: "actions", className: "flex items-center justify-end gap-3" }, [message ? h("span", { key: "message", className: "text-sm text-secondary" }, message) : null, h("button", { key: "save", disabled: loading || saving || selected.length === 0, onClick: save, className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white disabled:opacity-60" }, saving ? "Saving..." : "Save")])]);
}

export default { components: {
  MissingVideosPage, MissingVideoDetailPage, LegacyMissingVideosPage, LegacyMissingVideoDetailPage,
  MissingPerformerVideosTab: (props) => h(EntityTab, { ...props, type: "performer" }),
  MissingStudioVideosTab: (props) => h(EntityTab, { ...props, type: "studio" }),
  MissingTagVideosTab: (props) => h(EntityTab, { ...props, type: "tag" }),
  CompleteTheCoveSettings,
} };
