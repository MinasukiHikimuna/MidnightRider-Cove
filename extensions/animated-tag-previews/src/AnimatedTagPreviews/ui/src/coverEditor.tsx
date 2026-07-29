import { useEffect, useRef, useState, useSyncExternalStore, type DragEvent } from "react";
import { previewApi, type PreviewDetails } from "./api";
import type { EntityCoverEditorContext } from "./hostContracts";
import { getPreviewCacheSnapshot, invalidatePreviewIndex, loadPreviewCache, subscribePreviewCache } from "./indexCache";

export function AnimatedTagCoverEditor(context: EntityCoverEditorContext) {
  if (context.entityType !== "tag" || context.coverKey !== "primary") return null;
  return <AnimatedTagPrimaryCoverEditor {...context} />;
}

function refreshHostCoverState() {
  window.history.go(0);
}

function AnimatedTagPrimaryCoverEditor(context: EntityCoverEditorContext) {
  const cache = useSyncExternalStore(subscribePreviewCache, getPreviewCacheSnapshot, getPreviewCacheSnapshot);
  const inputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [details, setDetails] = useState<PreviewDetails | null>(null);
  const [customImageConflict, setCustomImageConflict] = useState(false);
  const [fallbackPreview, setFallbackPreview] = useState<{ tagId: number; version: string; mediaUrl?: string } | null>(null);
  const [switchedToImage, setSwitchedToImage] = useState(false);
  const cachedPreview = cache.index?.items.find((item) => item.tagId === context.entityId);
  const preview = cachedPreview ?? fallbackPreview ?? undefined;
  const hasCustomImage = customImageConflict || Boolean(details?.hasCustomImage);

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
        if (current && next.version === preview.version) {
          setDetails(next);
          setCustomImageConflict(false);
        }
      })
      .catch(() => {});
    return () => { current = false; };
  }, [context.entityId, preview?.version]);
  useEffect(() => {
    if (preview) setSwitchedToImage(false);
    else setCustomImageConflict(false);
  }, [preview?.version]);

  const upload = async (file?: File) => {
    if (!file || busy || !context.canEdit) return;
    if (file.type && file.type !== "video/webm") {
      setError("Choose a WebM video file.");
      return;
    }
    setBusy(true);
    setError(undefined);
    setCustomImageConflict(false);
    setFallbackPreview(null);
    try {
      const published = await previewApi.uploadMedia(context.entityId, file);
      let cleanupFailed = false;
      try {
        await previewApi.deleteCustomImage(context.entityId);
      } catch {
        cleanupFailed = true;
      }
      if (cleanupFailed)
        setFallbackPreview({ tagId: context.entityId, version: published.version });
      try { await invalidatePreviewIndex(); } catch { /* A later cache load retries the invalidated index. */ }
      if (cleanupFailed) {
        setCustomImageConflict(true);
        setError("The animated preview was saved, but the custom image could not be removed. Keep the animated preview to retry cleanup, or use the image cover instead.");
      } else refreshHostCoverState();
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

  const useImageCover = async () => {
    if (!preview || busy || !context.canEdit) return;
    setBusy(true);
    setError(undefined);
    try {
      await previewApi.deleteMedia(context.entityId);
      try { await invalidatePreviewIndex(); } catch { /* A later cache load retries the invalidated index. */ }
      setDetails(null);
      setCustomImageConflict(false);
      setFallbackPreview(null);
      setSwitchedToImage(true);
      refreshHostCoverState();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not switch to the image cover.");
    } finally {
      setBusy(false);
    }
  };

  const replaceWithImage = async (file?: File) => {
    if (!file || !preview || busy || !context.canEdit) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }
    setBusy(true);
    setError(undefined);
    try {
      await previewApi.uploadCustomImage(context.entityId, file);
      try {
        await previewApi.deleteMedia(context.entityId);
      } catch {
        setCustomImageConflict(true);
        setDetails((current) => current ? { ...current, hasCustomImage: true } : current);
        setError("The image was saved, but the animated preview could not be removed. Use the image cover to retry.");
        return;
      }
      try { await invalidatePreviewIndex(); } catch { /* A later cache load retries the invalidated index. */ }
      setDetails(null);
      setFallbackPreview(null);
      setSwitchedToImage(true);
      refreshHostCoverState();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not upload the image. The animated preview is still active.");
    } finally {
      setBusy(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const keepAnimatedPreview = async () => {
    if (!preview || busy || !context.canEdit) return;
    setBusy(true);
    setError(undefined);
    try {
      await previewApi.deleteCustomImage(context.entityId);
      setCustomImageConflict(false);
      setDetails((current) => current ? { ...current, hasCustomImage: false } : current);
      refreshHostCoverState();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not remove the custom image.");
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
        muted
        loop
        autoPlay
        playsInline
        disableRemotePlayback
      /> : <span>{preview ? "Animated preview available" : "Drop a custom WebM here"}</span>}
      {busy ? <span className="atp-cover-busy">Updating cover…</span> : null}
    </div>
    <input ref={inputRef} className="atp-hidden-input" type="file" accept="video/webm,.webm" disabled={!context.canEdit || busy} onChange={(event) => void upload(event.target.files?.[0])} />
    <input ref={imageInputRef} className="atp-hidden-input" type="file" accept="image/jpeg,image/png,image/webp,image/gif" disabled={!context.canEdit || busy} onChange={(event) => void replaceWithImage(event.target.files?.[0])} />
    <div className="atp-cover-actions">
      <button type="button" className="atp-button" disabled={!context.canEdit || busy} onClick={() => inputRef.current?.click()}>{preview ? "Replace WebM" : "Upload WebM"}</button>
      {preview && !hasCustomImage ? <button type="button" className="atp-button" disabled={!context.canEdit || busy} onClick={() => imageInputRef.current?.click()}>Replace with image…</button> : null}
    </div>
    {preview && !hasCustomImage ? <p className="atp-cover-mode">The animated preview is active. Use “Replace with image…” here to switch cover types.</p> : null}
    {preview && hasCustomImage ? <div className="atp-cover-conflict" role="alert">
      <p>Both a custom image and an animated preview are stored. Choose which cover to keep.</p>
      <div className="atp-cover-conflict-actions">
        <button type="button" className="atp-button" disabled={!context.canEdit || busy} onClick={() => void keepAnimatedPreview()}>Keep animated preview</button>
        <button type="button" className="atp-button" disabled={!context.canEdit || busy} onClick={() => void useImageCover()}>Use image cover</button>
      </div>
    </div> : null}
    {preview && details?.version === preview.version ? <PreviewSource details={details} /> : null}
    {switchedToImage ? <p className="atp-cover-success" role="status">The image cover is now active.</p> : null}
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
