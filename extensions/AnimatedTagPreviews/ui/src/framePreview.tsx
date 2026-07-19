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
  const [imageUrl, setImageUrl] = useState<string>();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let active = true;
    let frameCallbackId: number | undefined;
    let fallbackTimer: number | undefined;
    const capture = () => {
      if (!active || !video.videoWidth || !video.videoHeight) return;
      const canvas = document.createElement("canvas");
      const ratio = aspectRatioValue(aspectRatio);
      canvas.width = 160;
      canvas.height = Math.round(160 / ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      const sourceWidth = Math.min(video.videoWidth, video.videoHeight * ratio) / crop.zoom;
      const sourceHeight = sourceWidth / ratio;
      const sourceX = (video.videoWidth - sourceWidth) * crop.anchorX;
      const sourceY = (video.videoHeight - sourceHeight) * crop.anchorY;
      context.drawImage(video, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
      setImageUrl(canvas.toDataURL("image/jpeg", 0.7));
    };
    const captureDecodedFrame = () => {
      if (typeof video.requestVideoFrameCallback === "function") {
        frameCallbackId = video.requestVideoFrameCallback(() => {
          if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
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
      if (Math.abs(video.currentTime - target) < 0.0005) capture();
      else video.currentTime = target;
    };
    video.addEventListener("loadeddata", seek);
    video.addEventListener("seeked", captureDecodedFrame);
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) seek();
    return () => {
      active = false;
      if (fallbackTimer != null) window.clearTimeout(fallbackTimer);
      if (frameCallbackId != null && typeof video.cancelVideoFrameCallback === "function") video.cancelVideoFrameCallback(frameCallbackId);
      video.removeEventListener("loadeddata", seek);
      video.removeEventListener("seeked", captureDecodedFrame);
    };
  }, [aspectRatio, crop.anchorX, crop.anchorY, crop.zoom, seconds]);

  return <>
    <img src={imageUrl} alt={alt} />
    <video ref={videoRef} src={mediaUrl} muted preload="auto" hidden aria-hidden="true" />
  </>;
}
