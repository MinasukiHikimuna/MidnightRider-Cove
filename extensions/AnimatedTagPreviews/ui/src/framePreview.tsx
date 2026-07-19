import { useEffect, useRef, useState } from "react";
import { aspectRatioValue, type CropRecipe, type PreviewAspectRatio } from "./cropGeometry";

export function previewFrameTimestamps(start: number, duration: number, frameRate: number, playbackSpeed = 1) {
  const frameDuration = Number.isFinite(frameRate) && frameRate > 0 ? playbackSpeed / frameRate : 0.01;
  return { first: start, last: Math.max(start, start + duration - frameDuration) };
}

export function DecodedFramePreview({ mediaUrl, seconds, crop, aspectRatio, alt }: {
  mediaUrl: string;
  seconds: number;
  crop: CropRecipe;
  aspectRatio: PreviewAspectRatio;
  alt: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const requestIdRef = useRef(0);
  const [preview, setPreview] = useState<{ imageUrl?: string; status: "loading" | "ready" | "error" }>({ status: "loading" });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const requestId = ++requestIdRef.current;
    let active = true;
    let frameCallbackId: number | undefined;
    let fallbackTimer: number | undefined;
    const isCurrent = () => active && requestIdRef.current === requestId;
    const fail = () => {
      if (isCurrent()) setPreview((current) => ({ ...current, status: "error" }));
    };
    setPreview((current) => ({ ...current, status: "loading" }));
    const capture = () => {
      if (!isCurrent()) return;
      if (!video.videoWidth || !video.videoHeight) { fail(); return; }
      try {
        const canvas = document.createElement("canvas");
        const ratio = aspectRatioValue(aspectRatio);
        canvas.width = 160;
        canvas.height = Math.round(160 / ratio);
        const context = canvas.getContext("2d");
        if (!context) { fail(); return; }
        const sourceWidth = Math.min(video.videoWidth, video.videoHeight * ratio) / crop.zoom;
        const sourceHeight = sourceWidth / ratio;
        const sourceX = (video.videoWidth - sourceWidth) * crop.anchorX;
        const sourceY = (video.videoHeight - sourceHeight) * crop.anchorY;
        context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/jpeg", 0.7);
        if (!imageUrl) { fail(); return; }
        if (isCurrent()) setPreview({ imageUrl, status: "ready" });
      } catch {
        fail();
      }
    };
    const captureDecodedFrame = () => {
      if (typeof video.requestVideoFrameCallback === "function") {
        frameCallbackId = video.requestVideoFrameCallback(() => {
          if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
          fallbackTimer = undefined;
          frameCallbackId = undefined;
          capture();
        });
        // Paused, hidden videos do not reliably deliver a video-frame callback
        // after seeking in every browser. By this point `seeked` has fired, so a
        // short fallback still draws the decoded target rather than an old keyframe.
        fallbackTimer = window.setTimeout(capture, 150);
      } else {
        capture();
      }
    };
    const seek = () => {
      const target = Math.max(0, Math.min(seconds, Number.isFinite(video.duration) ? video.duration : seconds));
      // Crop-only changes reuse the already-decoded frame and should redraw
      // immediately; no new presented frame exists to trigger rVFC.
      try {
        if (Math.abs(video.currentTime - target) < 0.0005) {
          if (!video.seeking && video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) capture();
        }
        else video.currentTime = target;
      } catch {
        fail();
      }
    };
    video.addEventListener("loadeddata", seek);
    video.addEventListener("seeked", captureDecodedFrame);
    video.addEventListener("error", fail);
    // A rapid timing update can arrive while an earlier seek has reduced the
    // ready state to metadata-only. Retarget immediately instead of waiting for
    // loadeddata, which does not fire for every seek.
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seek();
    return () => {
      active = false;
      if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
      if (frameCallbackId != null && typeof video.cancelVideoFrameCallback === "function") video.cancelVideoFrameCallback(frameCallbackId);
      video.removeEventListener("loadeddata", seek);
      video.removeEventListener("seeked", captureDecodedFrame);
      video.removeEventListener("error", fail);
    };
  }, [aspectRatio, crop.anchorX, crop.anchorY, crop.zoom, mediaUrl, seconds]);

  const loadingLabel = preview.imageUrl ? `Updating ${alt}` : `Loading ${alt}`;

  return <div className="atp-frame-preview" aria-busy={preview.status === "loading"}>
    {preview.imageUrl ? <img src={preview.imageUrl} alt={alt} /> : null}
    {preview.status !== "ready" ? <span
      className={`atp-frame-state is-${preview.status}`}
      role="status"
      aria-label={preview.status === "loading" ? loadingLabel : `Could not update ${alt}`}
    ><span aria-hidden="true">{preview.status === "loading" ? "" : "!"}</span></span> : null}
    <video ref={videoRef} src={mediaUrl} muted preload="auto" hidden aria-hidden="true" />
  </div>;
}
