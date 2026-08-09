import { h, useEffect, useRef, useRegisterExtensionKeyboardActions, useState } from "../shared/runtime.js";

import { completeOperation, confirmEmptyRecyclingBin, formatTime, operationDiscardsMissingImage, operationIdFor, rememberMissingImageDiscard, requestJson } from "../shared/api.js";

import { canHandleEditorShortcutEvent } from "../shared/presentation.js";

import { SegmentStudioTabs, notifyRecyclingBinChanged } from "../shared/navigation.js";

function SegmentStudioBinPage({ onNavigate, profile }) {
  const [items, setItems] = useState([]);
  const [fingerprint, setFingerprint] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState(null);
  const [message, setMessage] = useState("");
  const emptyBinRef = useRef(null);

  async function load(signal) {
    const loaded = await requestJson("/bin", signal ? { signal } : undefined);
    setItems(loaded.items || []);
    setFingerprint(loaded.fingerprint || "");
    setTotalCount(Number(loaded.totalCount) || 0);
    return loaded;
  }

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    load(controller.signal)
      .catch((error) => { if (error.name !== "AbortError") setMessage(error.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  useRegisterExtensionKeyboardActions("segment-studio", [{
    id: "system.emptyBin",
    surface: "local",
    canHandle: ({ event }) => {
      const ownerDocument = event.target?.ownerDocument ?? document;
      return canHandleEditorShortcutEvent(event, ownerDocument);
    },
    action: () => emptyBinRef.current?.(),
  }]);

  async function restore(item) {
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    setBusyItemId(item.itemId);
    setMessage("");
    const operationKey = `restore:${item.itemId}:${item.revision}`;
    const operationId = operationIdFor(operationKey);
    try {
      const submit = (discardMissingImage = false) => requestJson(`/bin/${item.itemId}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId, expectedRevision: item.revision, discardMissingImage }),
        });
      try {
        await submit(operationDiscardsMissingImage(operationKey));
      } catch (error) {
        if (error.payload?.code !== "missing-image" || !window.confirm(`${error.message}\n\nContinue and discard the missing image reference?`)) throw error;
        rememberMissingImageDiscard(operationKey);
        await submit(true);
      }
      completeOperation(operationKey);
      await load();
      notifyRecyclingBinChanged();
      setMessage("Segment restored with a new native ID.");
    } catch (error) {
      setMessage(error.message || "Unable to restore the segment.");
      if (error.status === 409) await load();
    } finally {
      setBusyItemId(null);
    }
  }

  async function emptyBin() {
    if (busyItemId != null) return;
    try {
      const outcome = await confirmEmptyRecyclingBin({
        items,
        fingerprint,
        totalCount,
      }, () => {
        setBusyItemId(-1);
        setMessage("");
      });
      if (outcome.status !== "emptied") return;
      await load();
      notifyRecyclingBinChanged();
      setMessage(`${outcome.segmentCount} segment${outcome.segmentCount === 1 ? "" : "s"} from ${outcome.sceneCount} scene${outcome.sceneCount === 1 ? "" : "s"} permanently deleted.`);
    } catch (error) {
      setMessage(error.message || "Unable to empty the recycling bin.");
      if (error.status === 409) await load();
    } finally {
      setBusyItemId(null);
    }
  }
  emptyBinRef.current = emptyBin;

  return h("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    h(SegmentStudioTabs, {
      key: "tabs", active: "bin", onNavigate, showBin: true, profile,
    }),
    h("header", { key: "header", className: "flex flex-wrap items-start justify-between gap-3" }, [
      h("div", { key: "copy", className: "space-y-2" }, [
        h("h1", { key: "title", className: "text-2xl font-semibold" }, "Recycling bin"),
        h("p", { key: "description", className: "max-w-3xl text-sm text-secondary" }, "Segments moved here from Basic mode can be restored individually. Restoring recreates the native content with a new native ID; external relationships to the old ID are not restored."),
      ]),
      h("button", {
        key: "empty",
        type: "button",
        disabled: loading || busyItemId != null || totalCount === 0,
        onClick: emptyBin,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50",
      }, busyItemId === -1 ? "Emptying…" : `Empty recycling bin${totalCount ? ` (${totalCount})` : ""}`),
    ]),
    message ? h("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, message) : null,
    loading ? h("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !loading && items.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...items.map((item) => h("article", { key: item.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      h("div", { key: "copy", className: "min-w-0 flex-1" }, [
        h("h2", { key: "title", className: "truncate font-semibold" }, `${item.tagName || "Tag segment"} · ${item.videoTitle || `Video ${item.videoId}`}`),
        h("p", { key: "time", className: "font-mono text-xs text-secondary" }, item.endSec == null ? formatTime(item.startSec) : `${formatTime(item.startSec)} – ${formatTime(item.endSec)}`),
        h("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${item.sourceKey || "unknown"}`),
      ]),
      h("a", { key: "video", href: `/video/${item.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      h("button", { key: "restore", type: "button", disabled: busyItemId != null, onClick: () => restore(item), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore"),
    ])),
  ]);
}

export { SegmentStudioBinPage };
