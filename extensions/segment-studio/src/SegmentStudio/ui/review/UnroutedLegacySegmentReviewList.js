import { DetailListPagination, h, useEffect, useRef, useState } from "../shared/runtime.js";

import { REVIEW_STATES } from "../shared/constants.js";

import { findEditorShortcut, initialReviewFilter, readReviewFilter, writeReviewFilter } from "../editor/model/shortcuts.js";

import { completeOperation, confirmDependencyDeletion, dependencyDeletionAllowed, formatTime, operationIdFor, requestJson } from "../shared/api.js";

import { isEditableTarget } from "../shared/presentation.js";

import { setPlainLinkNavigation } from "../discovery/components.js";

import { SegmentStudioTabs } from "../shared/navigation.js";

function reviewStateLabel(item) {
  if (item.published) return "Published";
  if (item.reviewState === "approved") return "Approved draft";
  return `${item.reviewState[0].toUpperCase()}${item.reviewState.slice(1)} draft`;
}

// Unrouted migration reference: keep union mutations here until they move into
// SegmentStudioBrowsePage, but never expose the retired dense-list presentation.
function UnroutedLegacySegmentReviewList({ mode, onModeChange, onNavigate, initialVideoId = null, focused = false }) {
  const reviewButtonClass = "rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/40 disabled:opacity-50";
  const reviewRef = useRef(null);
  const [filter, setFilter] = useState(() => initialReviewFilter(readReviewFilter(), initialVideoId, focused));
  const [result, setResult] = useState({ items: [], total: 0, counts: { unreviewed: 0, approved: 0, rejected: 0, unpublished: 0, total: 0 } });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);
  const serializedFilter = JSON.stringify(filter);

  useEffect(() => { if (!focused) writeReviewFilter(filter); }, [serializedFilter, focused]);
  useEffect(() => { if (focused) reviewRef.current?.focus({ preventScroll: true }); }, [focused, initialVideoId]);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    requestJson("/review/segments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: filter.query || null,
        videoId: filter.videoId || null,
        reviewStates: filter.reviewState === "all" ? [] : [filter.reviewState],
        page: filter.page,
        perPage: filter.perPage,
        sort: filter.sort,
        direction: filter.direction,
        basicInventoryOnly: mode === "editor",
      }),
      signal: controller.signal,
    }).then(setResult)
      .catch((error) => { if (error.name !== "AbortError") setMessage(error.message || "Unable to load review items."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [serializedFilter, refreshToken, mode]);

  function updateFilter(values) { setFilter((current) => ({ ...current, ...values, page: values.page || 1 })); }
  async function runMutation(operationKey, path, body, method = "POST") {
    const operationId = operationIdFor(operationKey);
    try {
      const response = await requestJson(path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId, ...body }),
      });
      completeOperation(operationKey);
      setMessage("Draft changes saved.");
      setRefreshToken((value) => value + 1);
      return response;
    } catch (error) {
      setMessage(error.message || "Unable to change the draft.");
      if (error.status === 409) setRefreshToken((value) => value + 1);
      return null;
    }
  }

  async function createDraft() {
    const videoId = Number(window.prompt("Cove video ID for the new draft", initialVideoId || ""));
    const tagId = Number(window.prompt("Segment tag ID"));
    const startSec = Number(window.prompt("Start seconds", "0"));
    const endText = window.prompt("End seconds (leave empty for open-ended)", "");
    const endSec = endText == null || endText.trim() === "" ? null : Number(endText);
    if (!Number.isInteger(videoId) || videoId <= 0 || !Number.isInteger(tagId) || tagId <= 0
      || !Number.isFinite(startSec) || (endSec != null && !Number.isFinite(endSec))) {
      setMessage("Enter valid video, tag, and timing values.");
      return;
    }
    await runMutation(`create:${videoId}:${tagId}:${startSec}:${endSec ?? "open"}`, `/videos/${videoId}/drafts`, { tagId, startSec, endSec });
  }

  async function editDraft(item) {
    const tagId = Number(window.prompt("Segment tag ID", String(item.tagId)));
    const startSec = Number(window.prompt("Start seconds", String(item.startSec)));
    const endText = window.prompt("End seconds (leave empty for open-ended)", item.endSec == null ? "" : String(item.endSec));
    const endSec = endText == null || endText.trim() === "" ? null : Number(endText);
    if (!Number.isInteger(tagId) || tagId <= 0 || !Number.isFinite(startSec) || (endSec != null && !Number.isFinite(endSec))) return;
    await runMutation(`edit:${item.itemId}:${item.revision}:${tagId}:${startSec}:${endSec ?? "open"}`,
      `/videos/${item.videoId}/drafts/${item.itemId}`, { expectedRevision: item.revision, tagId, startSec, endSec }, "PUT");
  }

  async function splitDraft(item) {
    const splitSec = Number(window.prompt("Split at seconds", String(item.startSec)));
    if (!Number.isFinite(splitSec)) return;
    await runMutation(`split:${item.itemId}:${item.revision}:${splitSec}`,
      `/videos/${item.videoId}/drafts/${item.itemId}/split`, { expectedRevision: item.revision, splitSec });
  }

  async function duplicateDraft(item) {
    if (!window.confirm("Duplicate this draft as Unreviewed? Any retained image stays with the original item.")) return;
    await runMutation(`duplicate:${item.itemId}:${item.revision}`,
      `/videos/${item.videoId}/drafts/${item.itemId}/duplicate`, { expectedRevision: item.revision });
  }

  async function restoreRejected(item) {
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    await runMutation(`restore:${item.itemId}:${item.revision}`, `/bin/${item.itemId}/restore`, {
      expectedRevision: item.revision,
      discardMissingImage: false,
    });
  }

  async function purgeRejected(item) {
    try {
      const preview = await requestJson(`/items/${item.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: item.revision }),
      });
      if (!dependencyDeletionAllowed(preview, setMessage)
          || !confirmDependencyDeletion(preview))
        return;
      await runMutation(
        `dependency-delete:${item.itemId}:${preview.fingerprint}`,
        `/items/${item.itemId}/delete/execute`,
        { fingerprint: preview.fingerprint },
      );
    } catch (error) {
      setMessage(error.message || "Unable to permanently delete the segment.");
      if (error.status === 409) setRefreshToken((value) => value + 1);
    }
  }

  async function deleteRejectedSegments() {
    const rejectedCount = Number(result.counts.rejected) || 0;
    if (rejectedCount === 0 || !initialVideoId) {
      setMessage("This video has no rejected segments to delete.");
      return;
    }
    try {
      const preview = await requestJson(`/videos/${initialVideoId}/rejected/deletion/preview`, { method: "POST" });
      if (!dependencyDeletionAllowed(preview, setMessage)
          || !confirmDependencyDeletion(preview))
        return;
      const operationKey = `rejected-dependency-delete:${initialVideoId}:${preview.fingerprint}`;
      const deleted = await requestJson(`/videos/${initialVideoId}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: operationIdFor(operationKey),
          fingerprint: preview.fingerprint,
        }),
      });
      completeOperation(operationKey);
      setMessage(`Deleted ${deleted.deletedSegmentCount} segment${deleted.deletedSegmentCount === 1 ? "" : "s"}.`);
      setRefreshToken((value) => value + 1);
    } catch (error) {
      setMessage(error.message || "Unable to delete rejected segments.");
    }
  }

  function handleReviewShortcut(event) {
    if (!focused || isEditableTarget(event.target) || document.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']")) return;
    const shortcut = findEditorShortcut(event, true);
    if (!shortcut) return;
  }

  return h("div", { ref: reviewRef, tabIndex: focused ? -1 : undefined, onKeyDownCapture: handleReviewShortcut, className: "mx-auto w-full max-w-6xl space-y-5 p-4 outline-none sm:p-6" }, [
    !focused ? h(SegmentStudioTabs, { key: "tabs", active: "segments", onNavigate }) : null,
    h("header", { key: "header", className: "flex flex-wrap items-start justify-between gap-3" }, [
      h("div", { key: "copy" }, [
        h("h1", { key: "title", className: "text-2xl font-semibold" }, focused ? "Video review" : "Segments"),
        h("p", { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" }, focused
          ? "Review this video's published Cove segments and unpublished Segment Studio drafts."
          : "Published Cove segments and unpublished Segment Studio drafts share this inventory."),
      ]),
      h("div", { key: "actions", className: "flex items-start gap-3" }, [
        focused ? h("a", {
          key: "exit",
          href: "/segment-studio",
          onClick: (event) => setPlainLinkNavigation(event, onNavigate, { page: "segment-studio" }),
          "aria-label": "Exit video review to Videos",
          className: "mt-5 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted/40",
        }, "← Videos") : null,
      ]),
    ]),
    h("section", { key: "filters", className: "grid gap-3 rounded-lg border border-border bg-surface p-4 sm:grid-cols-4" }, [
      h("label", { key: "query", className: "space-y-1 text-xs text-secondary" }, [h("span", null, "Search"), h("input", { type: "search", value: filter.query, onChange: (event) => updateFilter({ query: event.target.value }), className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm" })]),
      h("label", { key: "state", className: "space-y-1 text-xs text-secondary" }, [h("span", null, "State"), h("select", { value: filter.reviewState, onChange: (event) => updateFilter({ reviewState: event.target.value }), className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm" }, [h("option", { value: "all" }, "All states"), ...REVIEW_STATES.map((state) => h("option", { key: state, value: state }, state))])]),
      h("label", { key: "sort", className: "space-y-1 text-xs text-secondary" }, [h("span", null, "Order"), h("select", { value: filter.sort, onChange: (event) => updateFilter({ sort: event.target.value }), className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm" }, [h("option", { value: "default" }, "Default"), h("option", { value: "time" }, "Time"), h("option", { value: "updated" }, "Updated")])]),
      h("label", { key: "direction", className: "space-y-1 text-xs text-secondary" }, [h("span", null, "Direction"), h("select", { value: filter.direction, onChange: (event) => updateFilter({ direction: event.target.value }), className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm" }, [h("option", { value: "asc" }, "Ascending"), h("option", { value: "desc" }, "Descending")])]),
    ]),
    h("p", { key: "counts", className: "text-sm text-secondary" }, `${result.counts.total} eligible · ${result.counts.approved} approved · ${result.counts.unreviewed} unreviewed · ${result.counts.rejected} rejected · ${result.counts.unpublished} unpublished`),
    message ? h("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm" }, message) : null,
    loading ? h("p", { key: "loading", role: "status" }, "Loading review items…") : null,
    !loading && result.items.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No review items match these filters.") : null,
    ...result.items.map((item) => h("article", { key: item.key, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      h("div", { key: "copy", className: "min-w-0 flex-1" }, [
        h("h2", { key: "title", className: "font-semibold" }, `${item.tagName || `Tag ${item.tagId}`} · ${item.videoTitle || `Video ${item.videoId}`}`),
        h("p", { key: "meta", className: "text-xs text-secondary" }, `${reviewStateLabel(item)} · ${formatTime(item.startSec)}${item.endSec == null ? "" : ` – ${formatTime(item.endSec)}`}`),
      ]),
      item.published || mode === "review" ? h("a", {
        key: "editor",
        href: item.published
          ? `/segment-studio/${item.videoId}?segment=${item.nativeSegmentId}`
          : `/segment-studio/${item.videoId}?item=${item.itemId}`,
        className: "text-sm font-medium text-accent hover:underline",
      }, "Open editor") : mode === "editor" && item.reviewState === "rejected" ? [
        h("button", { key: "restore", type: "button", onClick: () => restoreRejected(item), className: reviewButtonClass }, "Restore"),
        h("button", { key: "purge", type: "button", onClick: () => purgeRejected(item), className: reviewButtonClass }, "Delete permanently"),
      ] : null,
    ])),
    h(DetailListPagination, { key: "pagination", filter, onFilterChange: setFilter, totalCount: result.total, ariaLabel: "Review pagination" }),
  ]);
}

export { reviewStateLabel, UnroutedLegacySegmentReviewList };
