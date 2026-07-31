import { h, useEffect, useRef, useState } from "../shared/runtime.js";

import { requestJson } from "../shared/api.js";

import { requestedOwnedItemId, requestedSegmentId } from "../discovery/model.js";

import { isCurrentEditorRequest } from "./model/timeline.js";

import { useSplitEditorLayout } from "./model/layout.js";

import { SegmentEditor } from "./SegmentEditor.js";

function SegmentStudioEditorPage({
  videoId, onNavigate, compatibilityMode = false, profile,
}) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const loadRequestRef = useRef(0);
  const actionRequestRef = useRef(0);
  const currentVideoRef = useRef(videoId);
  const splitLayout = useSplitEditorLayout();
  currentVideoRef.current = videoId;
  const editorPath = (requestedVideoId) =>
    `/videos/${requestedVideoId}/editor`;

  async function loadEditor(requestId, requestedVideoId, controller) {
    const loaded = await requestJson(editorPath(requestedVideoId), controller ? { signal: controller.signal } : undefined);
    if (!isCurrentEditorRequest(requestId, controller ? loadRequestRef.current : actionRequestRef.current, requestedVideoId, currentVideoRef.current)) return false;
    setDetail(loaded);
    return true;
  }

  useEffect(() => {
    const requestId = ++loadRequestRef.current;
    const requestedVideoId = videoId;
    const controller = new AbortController();
    setDetail(null);
    setLoading(true);
    setError("");
    loadEditor(requestId, requestedVideoId, controller)
      .catch((requestError) => { if (isCurrentEditorRequest(requestId, loadRequestRef.current, requestedVideoId, currentVideoRef.current) && requestError.name !== "AbortError") setError(requestError.message || "Unable to load the editor."); })
      .finally(() => { if (isCurrentEditorRequest(requestId, loadRequestRef.current, requestedVideoId, currentVideoRef.current)) setLoading(false); });
    return () => { loadRequestRef.current++; actionRequestRef.current++; controller.abort(); };
  }, [videoId]);

  function updateDetail(nextDetail, expectedVideoId) {
    setDetail((current) => {
      if (current?.video.id !== expectedVideoId) return current;
      return typeof nextDetail === "function" ? nextDetail(current) : nextDetail;
    });
  }

  async function reloadAfterConflict() {
    const requestedVideoId = videoId;
    const requestId = ++actionRequestRef.current;
    try {
      const loaded = await requestJson(editorPath(requestedVideoId));
      if (!isCurrentEditorRequest(requestId, actionRequestRef.current, requestedVideoId, currentVideoRef.current)) return null;
      setDetail(loaded);
      setError("A newer canonical segment was loaded. Your stale change was not applied.");
      return loaded;
    } catch (requestError) {
      if (isCurrentEditorRequest(requestId, actionRequestRef.current, requestedVideoId, currentVideoRef.current)) setError(requestError.message || "Unable to reload the latest segment.");
      return null;
    }
  }

  async function reloadAfterSlotChange() {
    const requestedVideoId = videoId;
    const requestId = ++actionRequestRef.current;
    try {
      const loaded = await requestJson(editorPath(requestedVideoId));
      if (!isCurrentEditorRequest(requestId, actionRequestRef.current, requestedVideoId, currentVideoRef.current)) return null;
      setDetail(loaded);
      setError("");
      return loaded;
    } catch (requestError) {
      if (isCurrentEditorRequest(requestId, actionRequestRef.current, requestedVideoId, currentVideoRef.current)) setError(requestError.message || "Unable to reload performer slots.");
      return null;
    }
  }

  return h("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${splitLayout ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: splitLayout ? {
      height: "calc(100dvh - 3.25rem)",
      margin: "-1rem -1.5rem -1.25rem",
      width: "calc(100% + 3rem)",
    } : undefined,
  }, [
    error ? h("div", { key: "error", className: "rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, error) : null,
    loading ? h("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading editor…") : null,
    detail ? h(SegmentEditor, {
      key: detail.video.id,
      detail,
      onDetailChange: updateDetail,
      onConflict: reloadAfterConflict,
      onReload: reloadAfterSlotChange,
      onSlotsChanged: reloadAfterSlotChange,
      splitLayout,
      profile,
      initialSegmentId: requestedOwnedItemId() ? -requestedOwnedItemId() : requestedSegmentId(),
      compatibilityMode,
      onNavigate,
    }) : null,
  ]);
}

export { SegmentStudioEditorPage };
