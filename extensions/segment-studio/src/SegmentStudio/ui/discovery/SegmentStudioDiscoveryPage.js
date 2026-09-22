import { ExtensionSelectionActions, ListPage, getDefaultFilter, h, useEffect, useListUrlState, useMemo, useRef, useState } from "../shared/runtime.js";

import { requestJson } from "../shared/api.js";

import { DISCOVERY_FILTER_CRITERIA, DISCOVERY_SORT_OPTIONS, DISCOVERY_URL_OPTIONS, DiscoveryCard, DiscoveryRow, buildDiscoverySearchParams, updateDiscoverySelection } from "./components.js";

import { SegmentStudioTabs } from "../shared/navigation.js";

const DISCOVERY_SAVED_FILTER_SCOPE = "ext:com.midnightrider.segment-studio:videos";

function SegmentStudioDiscoveryPage({
  onNavigate, compatibilityMode = false, mode = "editor", profile,
}) {
  const urlOptions = useMemo(() => {
    const saved = getDefaultFilter(DISCOVERY_SAVED_FILTER_SCOPE);
    const savedDisplayMode = saved?.uiOptions?.displayMode;
    return saved ? {
      ...DISCOVERY_URL_OPTIONS,
      defaultFilter: { ...DISCOVERY_URL_OPTIONS.defaultFilter, ...(saved.findFilter || {}) },
      defaultObjectFilter: saved.objectFilter || {},
      defaultDisplayMode: DISCOVERY_URL_OPTIONS.allowedDisplayModes.includes(savedDisplayMode) ? savedDisplayMode : DISCOVERY_URL_OPTIONS.defaultDisplayMode,
    } : DISCOVERY_URL_OPTIONS;
  }, []);
  const { filter, objectFilter, displayMode, setFilter, setObjectFilter, setDisplayMode } = useListUrlState(urlOptions);
  const [result, setResult] = useState({ items: [], totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryNonce, setRetryNonce] = useState(0);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const requestRef = useRef(0);
  const selectionAnchorRef = useRef(null);
  const serializedFilter = JSON.stringify(filter);
  const serializedObjectFilter = JSON.stringify(objectFilter);
  const showReviewStates = compatibilityMode || mode === "review";

  useEffect(() => {
    selectionAnchorRef.current = null;
    setSelectedIds(new Set());
  }, [serializedFilter, serializedObjectFilter]);

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
  }, [serializedFilter, serializedObjectFilter, compatibilityMode, mode, retryNonce]);

  function updateFilter(next) { setFilter({ ...next, page: next.page || 1 }); }
  function updateObjectFilter(next) { setObjectFilter(next); setFilter({ ...filter, page: 1 }); }
  function toggleSelection(videoId, selectRange = false) {
    setSelectedIds((current) => updateDiscoverySelection(
      current,
      result.items.map((item) => item.videoId),
      videoId,
      selectionAnchorRef.current,
      selectRange,
    ));
    selectionAnchorRef.current = videoId;
  }
  function selectAll() {
    selectionAnchorRef.current = null;
    setSelectedIds(new Set(result.items.map((item) => item.videoId)));
  }
  function selectNone() {
    selectionAnchorRef.current = null;
    setSelectedIds(new Set());
  }
  function invertSelection() {
    selectionAnchorRef.current = null;
    setSelectedIds((current) => new Set(result.items
      .map((item) => item.videoId)
      .filter((videoId) => !current.has(videoId))));
  }
  const criteriaDefinitions = (compatibilityMode || mode === "review")
    ? DISCOVERY_FILTER_CRITERIA
    : DISCOVERY_FILTER_CRITERIA.filter((criterion) => !["reviewState", "shotBoundaries"].includes(criterion.id));

  return h("div", { className: "w-full space-y-5" }, [
    h(SegmentStudioTabs, {
      key: "tabs",
      active: "videos",
      onNavigate,
      showBin: !compatibilityMode && mode === "editor",
      profile,
    }),
    h(ListPage, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: DISCOVERY_SAVED_FILTER_SCOPE,
      cardSizeEntityType: "video",
      maxPageSize: 1000,
      filter,
      onFilterChange: updateFilter,
      totalCount: result.totalCount,
      isLoading: loading,
      error: error ? new Error(error) : null,
      onRetry: () => setRetryNonce((value) => value + 1),
      sortOptions: compatibilityMode || mode === "review" ? [...DISCOVERY_SORT_OPTIONS, { value: "unreviewed_count", label: "Unreviewed count" }] : DISCOVERY_SORT_OPTIONS,
      displayMode,
      onDisplayModeChange: setDisplayMode,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions,
      objectFilter,
      onObjectFilterChange: updateObjectFilter,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: showReviewStates ? selectedIds : undefined,
      onSelectAll: showReviewStates ? selectAll : undefined,
      onSelectNone: showReviewStates ? selectNone : undefined,
      onInvertSelection: showReviewStates ? invertSelection : undefined,
      // The host renders whatever extensions contribute for a video selection, so
      // Run AI here is the same action, and the same dialog, as the native videos
      // page. Only the contributed actions are rendered: Segment Studio's own
      // ownership and lineage rules govern deletion, so the native bulk mutations
      // that would bypass them stay out of this bar.
      selectionActions: showReviewStates && selectedIds.size > 0
        ? h(ExtensionSelectionActions, { entityType: "video", selectedIds })
        : null,
    }, [
      !loading && result.items.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !loading && displayMode === "grid" ? h("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, result.items.map((item) => h(DiscoveryCard, { key: item.videoId, item, onNavigate, showReviewStates, selected: selectedIds.has(item.videoId), selectionActive: selectedIds.size > 0, onSelect: showReviewStates ? toggleSelection : null }))) : null,
      !loading && displayMode === "list" ? h("section", { key: "rows", className: "space-y-3" }, result.items.map((item) => h(DiscoveryRow, { key: item.videoId, item, onNavigate, showReviewStates, selected: selectedIds.has(item.videoId), selectionActive: selectedIds.size > 0, onSelect: showReviewStates ? toggleSelection : null }))) : null,
    ]),
  ]);
}

export { SegmentStudioDiscoveryPage };
