import { useEffect, useRef, useState, useSyncExternalStore, type SyntheticEvent } from "react";
import type { EntityMediaRenderProps } from "./hostContracts";
import { DEFAULT_SETTINGS, previewApi } from "./api";
import { getPreviewCacheSnapshot, loadPreviewCache, subscribePreviewCache } from "./indexCache";

function playWithoutSurfacingAutoplayErrors(video: HTMLVideoElement) {
  try {
    const result = video.play();
    if (result && typeof result.catch === "function") void result.catch(() => {});
  } catch { /* The static poster remains visible when playback is unavailable. */ }
}

function useReducedMotion() {
  const [query] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)"));
  const [reduced, setReduced] = useState(query.matches);
  useEffect(() => {
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, [query]);
  return reduced;
}

export function AnimatedTagMedia(props: EntityMediaRenderProps) {
  const { entityType, entityId, surface, imageUrl, alt, fit, loading, className, renderDefault } = props;
  const cache = useSyncExternalStore(subscribePreviewCache, getPreviewCacheSnapshot, getPreviewCacheSnapshot);
  const reducedMotion = useReducedMotion();
  const [nearViewport, setNearViewport] = useState(false);
  const [visible, setVisible] = useState(false);
  const [failed, setFailed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preview = cache.index?.items.find((item) => item.tagId === entityId);
  const settings = cache.settings ?? DEFAULT_SETTINGS;
  const supportedSurface = surface === "hover" || ((surface === "card" || surface === "hero") && settings.enabledSurfaces.includes(surface));
  const animated = entityType === "tag" && supportedSurface && !reducedMotion && !failed && Boolean(preview);

  useEffect(() => { void loadPreviewCache().catch(() => {}); }, []);
  useEffect(() => { setFailed(false); }, [preview?.version]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const lazyObserver = new IntersectionObserver(([entry]) => {
      setNearViewport(entry.isIntersecting || entry.intersectionRatio > 0);
    }, { rootMargin: "240px", threshold: 0.01 });
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setVisible(entry.isIntersecting && entry.intersectionRatio > 0);
    }, { threshold: 0.01 });
    lazyObserver.observe(video);
    visibilityObserver.observe(video);
    return () => { lazyObserver.disconnect(); visibilityObserver.disconnect(); };
  }, [animated, preview?.version]);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const sync = () => {
      if (animated && visible && !document.hidden && !reducedMotion) playWithoutSurfacingAutoplayErrors(video);
      else { video.pause(); video.muted = true; }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { document.removeEventListener("visibilitychange", sync); video.pause(); };
  }, [animated, nearViewport, preview?.version, reducedMotion, visible]);

  if (!animated || !preview) return <>{renderDefault()}</>;

  const onMouseEnter = (event: SyntheticEvent<HTMLVideoElement>) => {
    if (settings.hoverRestart) event.currentTarget.currentTime = 0;
    if (settings.hoverUnmute) event.currentTarget.muted = false;
  };
  const resolvedFit = surface === "card" && settings.cardFit !== "inherit" ? settings.cardFit : fit;
  const aspectClass = settings.matchCardAspectRatio ? `atp-aspect-${settings.aspectRatio.replace(":", "-")}` : "";

  return (
    <video
      ref={videoRef}
      aria-label={`Animated preview for ${alt}`}
      className={`${className ?? ""} atp-media ${aspectClass}`.trim()}
      style={{ width: "100%", height: "100%", objectFit: resolvedFit }}
      poster={imageUrl ?? undefined}
      preload={loading === "eager" && nearViewport ? "metadata" : "none"}
      src={nearViewport ? (preview.mediaUrl ?? previewApi.mediaUrl(entityId, preview.version)) : undefined}
      muted
      loop
      playsInline
      disableRemotePlayback
      onCanPlay={(event) => { if (visible && !document.hidden) playWithoutSurfacingAutoplayErrors(event.currentTarget); }}
      onError={() => setFailed(true)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={(event) => { event.currentTarget.muted = true; }}
    >
      {alt}
    </video>
  );
}
