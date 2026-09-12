import { ListPage, getDefaultFilter, h, useEffect, useListUrlState, useMemo, useRef, useState } from "../shared/runtime.js";

import { requestJson } from "../shared/api.js";

import { DISCOVERY_FILTER_CRITERIA, DISCOVERY_SORT_OPTIONS, DISCOVERY_URL_OPTIONS, DiscoveryCard, DiscoveryRow, buildDiscoverySearchParams, updateDiscoverySelection } from "./components.js";

import { SegmentStudioTabs } from "../shared/navigation.js";
import { createBulkAnalysisCoordinator, runSelectedDiscoveryAnalysis } from "./analysis.js";
import { ChevronDown } from "@cove/runtime/lucide-react";

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
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [scanState, setScanState] = useState({ busy: false, error: "", announcement: "" });
  const requestRef = useRef(0);
  const selectionAnchorRef = useRef(null);
  const scanCoordinatorRef = useRef(null);
  if (!scanCoordinatorRef.current)
    scanCoordinatorRef.current = createBulkAnalysisCoordinator();
  const serializedFilter = JSON.stringify(filter);
  const serializedObjectFilter = JSON.stringify(objectFilter);
  const showReviewStates = compatibilityMode || mode === "review";

  useEffect(() => {
    scanCoordinatorRef.current.selectionChanged();
    selectionAnchorRef.current = null;
    setSelectedIds(new Set());
    setScanState((current) => ({ busy: current.busy, error: "", announcement: "" }));
  }, [serializedFilter, serializedObjectFilter]);

  useEffect(() => {
    if (!showReviewStates) return undefined;
    const controller = new AbortController();
    requestJson("/analysis/status", { signal: controller.signal })
      .then(setAnalysisStatus)
      .catch((requestError) => {
        if (requestError.name !== "AbortError")
          setAnalysisStatus({ configured: true, ready: false, error: requestError.message || "Unable to check Full Scan readiness." });
      });
    return () => controller.abort();
  }, [showReviewStates]);

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
  async function startSelectedAnalysis(analyses = ["aiTagging", "omnishotcut"]) {
    const operation = scanCoordinatorRef.current.begin();
    if (!operation) return;
    setScanState({ busy: true, error: "", announcement: "" });
    try {
      const outcome = await runSelectedDiscoveryAnalysis(
        [...selectedIds], analyses, requestJson, (message) => window.confirm(message),
      );
      if (outcome.cancelled) {
        setScanState({ busy: false, error: "", announcement: "" });
        return;
      }
      if (outcome.queuedIds.length > 0
          && scanCoordinatorRef.current.ownsCurrentSelection(operation)) {
        if (outcome.queuedIds.includes(selectionAnchorRef.current))
          selectionAnchorRef.current = null;
        setSelectedIds((current) => {
          const next = new Set(current);
          outcome.queuedIds.forEach((videoId) => next.delete(videoId));
          return next;
        });
      }
      setScanState({
        busy: false,
        announcement: outcome.queuedIds.length > 0
          ? `${outcome.queuedIds.length} ${outcome.queuedIds.length === 1 ? "scan" : "scans"} queued.`
          : "",
        error: outcome.failed.length > 0
          ? `${outcome.failed.length} selected ${outcome.failed.length === 1 ? "video could" : "videos could"} not be queued. ${outcome.failed[0].error}`
          : "",
      });
    } catch (scanError) {
      setScanState({ busy: false, error: scanError.message || "Unable to queue the selected scans.", announcement: "" });
    } finally {
      scanCoordinatorRef.current.finish(operation);
    }
  }
  const criteriaDefinitions = (compatibilityMode || mode === "review")
    ? DISCOVERY_FILTER_CRITERIA
    : DISCOVERY_FILTER_CRITERIA.filter((criterion) => !["reviewState", "shotBoundaries"].includes(criterion.id));
  const scanUnavailable = analysisStatus === null
    || analysisStatus.configured === false
    || analysisStatus.ready === false;
  const scanDisabled = scanState.busy || scanUnavailable;
  const scanTitle = analysisStatus?.error
    || (analysisStatus === null
      ? "Checking Full Scan availability"
      : analysisStatus.configured === false
        ? "Configure the analysis service before running Full Scan"
        : analysisStatus.ready === false
          ? "Full Scan is currently unavailable"
          : "Run AI tagging and shot boundary analysis for selected videos");
  const scanLabel = scanState.busy
    ? "Queueing scans…"
    : analysisStatus === null
      ? "Checking Full Scan…"
      : analysisStatus.configured === false
        ? "Full Scan not configured"
        : analysisStatus.ready === false
          ? "Full Scan unavailable"
          : "Full Scan selected";

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
      selectionActions: showReviewStates ? h("div", { className: "inline-flex items-stretch" }, [
        h("button", {
          key: "full",
          type: "button",
          disabled: scanDisabled,
          onClick: () => startSelectedAnalysis(),
          title: scanTitle,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50",
        }, scanLabel),
        h("details", { key: "choices", className: "relative flex" }, [
          h("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": scanDisabled,
            title: scanTitle,
            onClick: (event) => {
              if (scanDisabled) event.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${scanDisabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`,
          }, h(ChevronDown, { className: "h-4 w-4" })),
          h("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]],
          ].map(([label, analyses]) => h("button", {
            key: label,
            type: "button",
            disabled: scanState.busy,
            onClick: (event) => {
              event.currentTarget.closest("details")?.removeAttribute("open");
              startSelectedAnalysis(analyses);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50",
          }, label))),
        ]),
      ]) : null,
    }, [
      h("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, scanState.announcement),
      scanState.error ? h("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, scanState.error) : null,
      !loading && result.items.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !loading && displayMode === "grid" ? h("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, result.items.map((item) => h(DiscoveryCard, { key: item.videoId, item, onNavigate, showReviewStates, selected: selectedIds.has(item.videoId), selectionActive: selectedIds.size > 0, onSelect: showReviewStates ? toggleSelection : null }))) : null,
      !loading && displayMode === "list" ? h("section", { key: "rows", className: "space-y-3" }, result.items.map((item) => h(DiscoveryRow, { key: item.videoId, item, onNavigate, showReviewStates, selected: selectedIds.has(item.videoId), selectionActive: selectedIds.size > 0, onSelect: showReviewStates ? toggleSelection : null }))) : null,
    ]),
  ]);
}

export { SegmentStudioDiscoveryPage };
