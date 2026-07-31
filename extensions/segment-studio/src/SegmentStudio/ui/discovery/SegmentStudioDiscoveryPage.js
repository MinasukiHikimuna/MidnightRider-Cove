import { DetailListPagination, DetailListToolbar, h, useEffect, useListUrlState, useRef, useState } from "../shared/runtime.js";

import { requestJson } from "../shared/api.js";

import { DISCOVERY_SORT_OPTIONS, DISCOVERY_URL_OPTIONS, DiscoveryCard, DiscoveryFilters, DiscoveryRow, buildDiscoverySearchParams } from "./components.js";

import { SegmentStudioTabs } from "../shared/navigation.js";

function SegmentStudioDiscoveryPage({
  onNavigate, compatibilityMode = false, mode = "editor", profile,
}) {
  const { filter, objectFilter, displayMode, setFilter, setObjectFilter, setDisplayMode } = useListUrlState(DISCOVERY_URL_OPTIONS);
  const [result, setResult] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestRef = useRef(0);
  const serializedFilter = JSON.stringify(filter);
  const serializedObjectFilter = JSON.stringify(objectFilter);
  const showReviewStates = compatibilityMode || mode === "review";

  useEffect(() => {
    const requestId = ++requestRef.current;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    requestJson(`/videos?${buildDiscoverySearchParams(filter, objectFilter, compatibilityMode ? "compatibility" : mode === "review" ? "full" : null)}`, { signal: controller.signal })
      .then((loaded) => { if (requestId === requestRef.current) setResult(loaded); })
      .catch((requestError) => { if (requestId === requestRef.current && requestError.name !== "AbortError") setError(requestError.message || "Unable to discover videos."); })
      .finally(() => { if (requestId === requestRef.current) setLoading(false); });
    return () => { requestRef.current++; controller.abort(); };
  }, [serializedFilter, serializedObjectFilter, compatibilityMode, mode]);

  function updateFilter(next) { setFilter({ ...next, page: next.page || 1 }); }
  function updateObjectFilter(next) { setObjectFilter(next); setFilter({ ...filter, page: 1 }); }
  function clearObjectFilters() { setObjectFilter({}); setFilter({ ...filter, page: 1 }); }

  return h("div", { className: "w-full space-y-5" }, [
    h(SegmentStudioTabs, {
      key: "tabs",
      active: "videos",
      onNavigate,
      showBin: !compatibilityMode && mode === "editor",
      profile,
    }),
    h("h1", { key: "title", className: "sr-only" }, "Videos"),
    h(DiscoveryFilters, { key: "filters", objectFilter, setObjectFilter: updateObjectFilter, onClear: clearObjectFilters, compatibilityMode: compatibilityMode || mode === "review" }),
    h(DetailListToolbar, { key: "toolbar", filter, onFilterChange: updateFilter, totalCount: result.totalCount, sortOptions: compatibilityMode || mode === "review" ? [...DISCOVERY_SORT_OPTIONS, { value: "unreviewed_count", label: "Unreviewed count" }] : DISCOVERY_SORT_OPTIONS, showSearch: true, displayMode, onDisplayModeChange: setDisplayMode, availableDisplayModes: ["grid", "list"], showPagingControls: false }),
    h(DetailListPagination, { key: "top-pagination", filter, onFilterChange: updateFilter, totalCount: result.totalCount, ariaLabel: "Videos pagination above results" }),
    error ? h("div", { key: "error", className: "rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, error) : null,
    loading ? h("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading videos…") : null,
    !loading && result.items.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
    !loading && displayMode === "grid" ? h("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(275px, 1fr))" } }, result.items.map((item) => h(DiscoveryCard, { key: item.videoId, item, onNavigate, showReviewStates }))) : null,
    !loading && displayMode === "list" ? h("section", { key: "list", className: "space-y-3" }, result.items.map((item) => h(DiscoveryRow, { key: item.videoId, item, onNavigate, showReviewStates }))) : null,
    h(DetailListPagination, { key: "bottom-pagination", filter, onFilterChange: updateFilter, totalCount: result.totalCount, ariaLabel: "Videos pagination below results" }),
  ]);
}

export { SegmentStudioDiscoveryPage };
