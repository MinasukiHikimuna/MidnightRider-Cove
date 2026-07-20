import { useEffect, useRef, useState, useSyncExternalStore, type DragEvent } from "react";
import { previewApi, type PreviewDetails } from "./api";
import type { EntityCoverEditorContext } from "./hostContracts";
import { getPreviewCacheSnapshot, invalidatePreviewIndex, loadPreviewCache, subscribePreviewCache } from "./indexCache";

export function AnimatedTagCoverEditor(context: EntityCoverEditorContext) {
  if (context.entityType !== "tag" || context.coverKey !== "primary") return null;
  return <AnimatedTagPrimaryCoverEditor {...context} />;
}

function AnimatedTagPrimaryCoverEditor(context: EntityCoverEditorContext) {
  const cache = useSyncExternalStore(subscribePreviewCache, getPreviewCacheSnapshot, getPreviewCacheSnapshot);
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [details, setDetails] = useState<PreviewDetails | null>(null);
  const preview = cache.index?.items.find((item) => item.tagId === context.entityId);

  useEffect(() => { void loadPreviewCache().catch(() => {}); }, []);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);
  useEffect(() => {
    let current = true;
    setDetails(null);
    if (!preview) return () => { current = false; };
    void previewApi.previewDetails(context.entityId, preview.version)
      .then((next) => {
        if (current && next.version === preview.version) setDetails(next);
      })
      .catch(() => {});
    return () => { current = false; };
  }, [context.entityId, preview?.version]);

  const upload = async (file?: File) => {
    if (!file || busy || !context.canEdit) return;
    if (file.type && file.type !== "video/webm") {
      setError("Choose a WebM video file.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await previewApi.uploadMedia(context.entityId, file);
      await invalidatePreviewIndex();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not upload the custom WebM.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    void upload(event.dataTransfer.files[0]);
  };

  const remove = async () => {
    if (!preview || busy || !window.confirm("Delete the animated preview for this tag? The static tag image will remain.")) return;
    setBusy(true);
    setError(undefined);
    try {
      await previewApi.deleteMedia(context.entityId);
      await invalidatePreviewIndex();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete the animated preview.");
    } finally {
      setBusy(false);
    }
  };

  const mediaUrl = preview && (preview.mediaUrl ?? previewApi.mediaUrl(context.entityId, preview.version));
  return <section className="atp-cover-editor" aria-label="Animated preview">
    <div className="atp-cover-heading">Animated preview</div>
    <div
      className="atp-cover-drop"
      onDrop={drop}
      onDragOver={(event) => event.preventDefault()}
      onClick={() => !busy && context.canEdit && inputRef.current?.click()}
    >
      {mediaUrl && !reducedMotion ? <video
        aria-label="Current animated preview"
        src={mediaUrl}
        poster={context.currentImageUrl ?? undefined}
        muted
        loop
        autoPlay
        playsInline
        disableRemotePlayback
      /> : preview && context.currentImageUrl ? <img src={context.currentImageUrl} alt="Static tag cover" /> : <span>{preview ? "Animated preview available" : "Drop a custom WebM here"}</span>}
      {busy ? <span className="atp-cover-busy">Processing WebM…</span> : null}
    </div>
    <input ref={inputRef} className="atp-hidden-input" type="file" accept="video/webm,.webm" disabled={!context.canEdit || busy} onChange={(event) => void upload(event.target.files?.[0])} />
    <div className="atp-cover-actions">
      <button type="button" className="atp-button" disabled={!context.canEdit || busy} onClick={() => inputRef.current?.click()}>{preview ? "Replace WebM" : "Upload WebM"}</button>
      {preview ? <button type="button" className="atp-button atp-danger" disabled={!context.canEdit || busy} onClick={() => void remove()}>Delete preview</button> : null}
    </div>
    {preview && details?.version === preview.version ? <PreviewSource details={details} /> : null}
    <p className="atp-cover-help">Stored as supplied after WebM, VP9, duration, dimensions, and stream validation.</p>
    {error ? <p className="atp-error" role="alert">{error}</p> : null}
  </section>;
}

function PreviewSource({ details }: { details: PreviewDetails }) {
  if (details.origin === "uploaded") {
    return <p className="atp-cover-source"><span>Source:</span> Uploaded file</p>;
  }
  if (!details.source) {
    return <p className="atp-cover-source"><span>Source:</span> Source video unavailable</p>;
  }

  const timestamp = formatSourceTimestamp(details.source.startSeconds);
  const href = `/video/${details.source.videoId}?t=${encodeURIComponent(String(details.source.startSeconds))}`;
  return <p className="atp-cover-source"><span>Source:</span> <a href={href} aria-label={`Open source video at ${timestamp}`}>Open video at {timestamp}</a></p>;
}

function formatSourceTimestamp(seconds: number) {
  const totalMilliseconds = Math.round(seconds * 1000);
  const minutes = Math.floor(totalMilliseconds / 60_000);
  const wholeSeconds = Math.floor((totalMilliseconds % 60_000) / 1000);
  const milliseconds = totalMilliseconds % 1000;
  const fraction = milliseconds ? `.${milliseconds.toString().padStart(3, "0").replace(/0+$/, "")}` : "";
  return `${minutes.toString().padStart(2, "0")}:${wholeSeconds.toString().padStart(2, "0")}${fraction}`;
}
