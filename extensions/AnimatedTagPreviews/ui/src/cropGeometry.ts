import type { MediaPlayerContentRect } from "@cove/runtime/components";

export interface CropRecipe {
  anchorX: number;
  anchorY: number;
  zoom: number;
}

export interface CropRect extends MediaPlayerContentRect {}
export type PreviewAspectRatio = "1:1" | "4:3" | "16:9";
export const aspectRatioValue = (value: PreviewAspectRatio) => value === "16:9" ? 16 / 9 : value === "4:3" ? 4 / 3 : 1;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));

export function normalizeCrop(recipe: CropRecipe): CropRecipe {
  return {
    anchorX: clamp(recipe.anchorX, 0, 1),
    anchorY: clamp(recipe.anchorY, 0, 1),
    zoom: clamp(recipe.zoom, 1, 8),
  };
}

export function cropRectFromRecipe(
  recipe: CropRecipe,
  contentRect: MediaPlayerContentRect,
  intrinsicWidth: number,
  intrinsicHeight: number,
  aspectRatio: PreviewAspectRatio = "1:1",
): CropRect {
  const normalized = normalizeCrop(recipe);
  if (contentRect.width <= 0 || contentRect.height <= 0 || intrinsicWidth <= 0 || intrinsicHeight <= 0) {
    return { left: contentRect.left, top: contentRect.top, width: 0, height: 0 };
  }

  const scaleX = contentRect.width / intrinsicWidth;
  const scaleY = contentRect.height / intrinsicHeight;
  const ratio = aspectRatioValue(aspectRatio);
  const sourceWidth = Math.min(intrinsicWidth, intrinsicHeight * ratio) / normalized.zoom;
  const sourceHeight = sourceWidth / ratio;
  const width = sourceWidth * scaleX;
  const height = sourceHeight * scaleY;
  return {
    left: contentRect.left + (contentRect.width - width) * normalized.anchorX,
    top: contentRect.top + (contentRect.height - height) * normalized.anchorY,
    width,
    height,
  };
}

export function moveCropByPixels(
  recipe: CropRecipe,
  contentRect: MediaPlayerContentRect,
  deltaX: number,
  deltaY: number,
  aspectRatio: PreviewAspectRatio = "1:1",
): CropRecipe {
  const normalized = normalizeCrop(recipe);
  const ratio = aspectRatioValue(aspectRatio);
  const width = Math.min(contentRect.width, contentRect.height * ratio) / normalized.zoom;
  const height = width / ratio;
  const availableX = Math.max(0, contentRect.width - width);
  const availableY = Math.max(0, contentRect.height - height);
  return normalizeCrop({
    ...normalized,
    anchorX: availableX ? normalized.anchorX + deltaX / availableX : 0.5,
    anchorY: availableY ? normalized.anchorY + deltaY / availableY : 0.5,
  });
}

export function resizeCropByPixels(recipe: CropRecipe, contentRect: MediaPlayerContentRect, delta: number, aspectRatio: PreviewAspectRatio = "1:1"): CropRecipe {
  const normalized = normalizeCrop(recipe);
  const ratio = aspectRatioValue(aspectRatio);
  const maximumWidth = Math.max(1, Math.min(contentRect.width, contentRect.height * ratio));
  const currentWidth = maximumWidth / normalized.zoom;
  const nextWidth = clamp(currentWidth + delta, maximumWidth / 8, maximumWidth);
  return normalizeCrop({ ...normalized, zoom: maximumWidth / nextWidth });
}

export function clampTiming(startSeconds: number, durationSeconds: number, sourceDuration: number) {
  const finiteDuration = Math.max(0, Number.isFinite(sourceDuration) ? sourceDuration : 0);
  if (finiteDuration === 0) return { startSeconds: 0, durationSeconds: 0 };
  const minimumDuration = Math.min(0.25, finiteDuration);
  const start = clamp(startSeconds, 0, finiteDuration - minimumDuration);
  return {
    startSeconds: start,
    durationSeconds: clamp(durationSeconds, minimumDuration, finiteDuration - start),
  };
}
