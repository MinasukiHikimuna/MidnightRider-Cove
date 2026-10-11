import { ListPage, PERFORMER_CRITERIA, VideoPlayer, getDefaultFilter, h, useEffect, useListUrlState, useMemo, useRef, useState } from "../shared/runtime.js";

import { completeOperation, confirmDependencyDeletion, dependencyDeletionAllowed, formatTime, operationDiscardsMissingImage, operationIdFor, rememberMissingImageDiscard, requestJson } from "../shared/api.js";

import { BROWSE_FILTER_CRITERIA, BROWSE_URL_OPTIONS, browseClipEnd, browseEditorHref, buildBrowseRequest, migrateLegacyBrowseFilter, slottedPerformerCriterion, withoutSlottedPerformers } from "../discovery/model.js";

import { SegmentStateBadge, segmentRailItemStyle } from "../shared/presentation.js";

import { PerformerSublaneAvatars } from "../editor/model/swimlanes.js";

import { performerSlotLabel } from "../editor/model/history.js";

import { SegmentStudioTabs } from "../shared/navigation.js";

function BrowseSegmentCard({ item, selected, busy, onSelect, onRestore, onPurge }) {
  const slots = [...(item.slots || [])].sort((left, right) => left.sortOrder - right.sortOrder || String(left.slotDefinitionId).localeCompare(String(right.slotDefinitionId)));
  const performers = [...new Map(slots.map((slot) => [
    slot.performerId,
    { id: slot.performerId, name: slot.performerName },
  ])).values()];
  const performerAssignments = slots.map((slot) => ({
    slotDefinitionId: slot.slotDefinitionId,
    label: performerSlotLabel(slot),
    performer: { id: slot.performerId, name: slot.performerName },
  }));
  const href = browseEditorHref(item);
  return h("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: segmentRailItemStyle(selected),
  }, [
    h("button", { key: "select", type: "button", onClick: onSelect, "data-segment-key": item.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${item.activity?.name || "segment"}, ${item.reviewState}, ${formatTime(item.startSec)} to ${item.endSec == null ? "end of video" : formatTime(item.endSec)}` }, [
      h("div", { key: "image", className: "relative aspect-video bg-black" }, [
        h("img", {
          key: "image",
          src: `/api/stream/video/${item.videoId}/screenshot?seconds=${encodeURIComponent(item.startSec)}&v=${encodeURIComponent(item.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover",
        }),
        h("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, item.endSec == null ? `${formatTime(item.startSec)} → end` : `${formatTime(item.startSec)} – ${formatTime(item.endSec)}`),
      ]),
      h("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        h("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          h(SegmentStateBadge, { key: "state", state: item.reviewState, includeLabel: false }),
          h("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, item.activity?.name || "Tag segment"),
          performers.length ? h(PerformerSublaneAvatars, {
            key: "performers",
            performers,
            performerAssignments,
            interactive: false,
          }) : null,
        ]),
        h("div", { key: "video", className: "line-clamp-1 text-xs text-secondary", title: item.videoTitle }, item.videoTitle),
      ]),
    ]),
    h("div", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-2.5 py-1.5 text-right" },
      item.reviewState === "rejected" && !item.published ? [
        h("button", { key: "restore", type: "button", disabled: busy, onClick: () => onRestore(item), className: "text-xs font-semibold text-accent hover:underline disabled:opacity-50" }, "Restore"),
        h("button", { key: "purge", type: "button", disabled: busy, onClick: () => onPurge(item), className: "text-xs font-semibold text-red-400 hover:underline disabled:opacity-50" }, "Delete permanently"),
      ] : h("a", {
        href,
        className: "text-xs font-semibold text-accent hover:underline",
      }, "Edit segment")),
  ]);
}

function BrowsePlayer({ item, index, count, onPrevious, onNext, onClose, onNavigate }) {
  if (!item) return null;
  const file = item.videoFile;
  return h("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    file ? h("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, h(VideoPlayer, {
      streamUrl: `/api/stream/video/${item.videoId}`,
      posterUrl: `/api/stream/video/${item.videoId}/screenshot?seconds=${encodeURIComponent(item.startSec)}&v=${encodeURIComponent(item.videoUpdatedAt || "")}`,
      format: file.format,
      audioCodec: file.audioCodec,
      duration: file.duration,
      videoId: item.videoId,
      clip: { start: item.startSec, end: browseClipEnd(item), loop: false },
      autostart: true,
      trackingEnabled: false,
    })) : h("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    h("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      h("button", { key: "previous", type: "button", disabled: index <= 0, onClick: onPrevious, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      h("span", { key: "position", className: "text-xs text-secondary" }, `${index + 1} of ${count}`),
      h("button", { key: "next", type: "button", disabled: index < 0 || index >= count - 1, onClick: onNext, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      h("button", { key: "close", type: "button", onClick: onClose, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      h("a", { key: "edit", href: browseEditorHref(item), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment"),
    ]),
  ]);
}

function SegmentStudioBrowsePage({ onNavigate, profile }) {
  const urlOptions = useMemo(() => {
    const saved = getDefaultFilter("ext:com.midnightrider.segment-studio:segments");
    return saved ? {
      ...BROWSE_URL_OPTIONS,
      defaultFilter: { ...BROWSE_URL_OPTIONS.defaultFilter, ...(saved.findFilter || {}) },
      defaultObjectFilter: saved.objectFilter || {},
    } : BROWSE_URL_OPTIONS;
  }, []);
  const { filter, objectFilter, setFilter, setObjectFilter } = useListUrlState(urlOptions);
  const [roles, setRoles] = useState(null);
  const [rolesError, setRolesError] = useState("");
  const [rolesAttempt, setRolesAttempt] = useState(0);
  const [result, setResult] = useState({ items: [], totalCount: 0, performerSlotsAvailable: true });
  const [selectedKey, setSelectedKey] = useState(null);
  const [busyKey, setBusyKey] = useState(null);
  const [refreshToken, setRefreshToken] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const requestRef = useRef(0);
  const migratedFilter = migrateLegacyBrowseFilter(objectFilter, roles);
  const migrationPending = migratedFilter.slots !== undefined;
  const request = buildBrowseRequest(filter, migratedFilter);
  const performerSlotsAvailable = result.performerSlotsAvailable !== false;
  const criteria = useMemo(() => performerSlotsAvailable
    ? [...BROWSE_FILTER_CRITERIA, slottedPerformerCriterion(roles, objectFilter, PERFORMER_CRITERIA)] : BROWSE_FILTER_CRITERIA,
  [roles, objectFilter, performerSlotsAvailable]);
  const serializedRequest = JSON.stringify(request);

  useEffect(() => {
    const controller = new AbortController();
    setRolesError("");
    requestJson("/browse/roles", { signal: controller.signal }).then(setRoles).catch((requestError) => {
      if (requestError.name === "AbortError") return;
      if (requestError.status === 403) {
        setRoles([]);
        setResult((current) => ({ ...current, performerSlotsAvailable: false }));
      } else {
        // Older slot links wait for the roles so their assignments are not widened to Any Slot.
        setRolesError(requestError.message || "Unable to load performer slot roles.");
      }
    });
    return () => controller.abort();
  }, [rolesAttempt]);

  useEffect(() => {
    if (migratedFilter !== objectFilter && !migrationPending) setObjectFilter(migratedFilter);
  }, [migratedFilter, objectFilter, migrationPending]);

  useEffect(() => {
    if (migrationPending) return undefined;
    const requestId = ++requestRef.current;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    requestJson("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(request), signal: controller.signal })
      .then((loaded) => { if (requestId === requestRef.current) setResult({ ...loaded, totalCount: loaded.totalCount ?? loaded.total ?? 0 }); })
      .catch((requestError) => {
        if (requestId !== requestRef.current || requestError.name === "AbortError") return;
        if (requestError.status === 400 && requestError.message.includes("unrestricted performer read access")) {
          setResult((current) => ({ ...current, performerSlotsAvailable: false }));
          setObjectFilter(withoutSlottedPerformers(migratedFilter));
          setMessage("Performer slot filters were cleared because performer details are unavailable.");
          return;
        }
        setError(requestError.message);
      })
      .finally(() => { if (requestId === requestRef.current) setLoading(false); });
    return () => { requestRef.current++; controller.abort(); };
  }, [serializedRequest, refreshToken, migrationPending]);

  const selectedIndex = result.items.findIndex((item) => item.key === selectedKey);
  const selected = result.items[selectedIndex] || null;
  function replaceObjectFilter(next) { setObjectFilter(next); setFilter({ ...filter, page: 1 }); }
  function closePreview() {
    const trigger = document.querySelector(`[data-segment-key="${selectedKey}"]`);
    setSelectedKey(null);
    requestAnimationFrame(() => trigger?.focus());
  }
  async function restoreRejected(item) {
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    setBusyKey(item.key);
    setMessage("");
    const operationKey = `browse-restore:${item.itemId}:${item.revision}`;
    const operationId = operationIdFor(operationKey);
    try {
      const submit = (discardMissingImage = false) => requestJson(`/bin/${item.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId,
          expectedRevision: item.revision,
          discardMissingImage,
        }),
      });
      try {
        await submit(operationDiscardsMissingImage(operationKey));
      } catch (restoreError) {
        if (restoreError.payload?.code !== "missing-image"
            || !window.confirm(`${restoreError.message}\n\nContinue and discard the missing image reference?`))
          throw restoreError;
        rememberMissingImageDiscard(operationKey);
        await submit(true);
      }
      completeOperation(operationKey);
      if (selectedKey === item.key) setSelectedKey(null);
      setMessage("Segment restored to Cove.");
      setRefreshToken((value) => value + 1);
    } catch (restoreError) {
      setMessage(restoreError.message || "Unable to restore the segment.");
      if (restoreError.status === 409) setRefreshToken((value) => value + 1);
    } finally {
      setBusyKey(null);
    }
  }
  async function purgeRejected(item) {
    setBusyKey(item.key);
    setMessage("");
    try {
      const preview = await requestJson(`/items/${item.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: item.revision }),
      });
      if (!dependencyDeletionAllowed(preview, setMessage)
          || !confirmDependencyDeletion(preview))
        return;
      const operationKey = `browse-dependency-delete:${item.itemId}:${preview.fingerprint}`;
      await requestJson(`/items/${item.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: operationIdFor(operationKey),
          fingerprint: preview.fingerprint,
        }),
      });
      completeOperation(operationKey);
      if (selectedKey === item.key) setSelectedKey(null);
      setMessage(`${preview.deletedSegmentCount} segment${preview.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`);
      setRefreshToken((value) => value + 1);
    } catch (purgeError) {
      setMessage(purgeError.message || "Unable to permanently delete the segment.");
      if (purgeError.status === 409) setRefreshToken((value) => value + 1);
    } finally {
      setBusyKey(null);
    }
  }
  return h("div", { className: "w-full space-y-5" }, [
    h(SegmentStudioTabs, {
      key: "tabs", active: "segments", onNavigate, profile,
    }),
    h(ListPage, {
      key: "list", title: "Segments", pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video", maxPageSize: 100,
      filter, onFilterChange: setFilter, totalCount: result.totalCount, isLoading: loading,
      error: error ? new Error(error) : null, onRetry: () => setRefreshToken((value) => value + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid", availableDisplayModes: ["grid"],
      criteriaDefinitions: criteria, objectFilter: migratedFilter, supportsFilterExpressions: true,
      onObjectFilterChange: replaceObjectFilter, searchPlaceholder: "Search segments...",
    }, [
    h(BrowsePlayer, { key: "player", item: selected, index: selectedIndex, count: result.items.length, onPrevious: () => setSelectedKey(result.items[selectedIndex - 1]?.key), onNext: () => setSelectedKey(result.items[selectedIndex + 1]?.key), onClose: closePreview, onNavigate }),
    rolesError ? h("div", { key: "roles-error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, [
      h("span", { key: "text" }, `Performer slot roles could not be loaded: ${rolesError}`),
      h("button", { key: "retry", type: "button", onClick: () => setRolesAttempt((value) => value + 1), className: "font-semibold text-accent hover:underline" }, "Retry"),
    ]) : null,
    message ? h("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, message) : null,
    !loading && result.items.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
    !loading ? h("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, result.items.map((item) => h(BrowseSegmentCard, {
      key: item.key,
      item,
      selected: item.key === selectedKey,
      busy: busyKey === item.key,
      onSelect: () => setSelectedKey(item.key),
      onRestore: restoreRejected,
      onPurge: purgeRejected,
    }))) : null,
    ]),
  ]);
}

export { BrowseSegmentCard, BrowsePlayer, SegmentStudioBrowsePage };
