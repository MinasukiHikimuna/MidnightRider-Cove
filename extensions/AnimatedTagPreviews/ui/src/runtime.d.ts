declare module "@cove/runtime/components" {
  import type { ComponentType } from "react";
  export type MediaPlayerSurface = "detail" | "quick-view" | "compilation";
  export interface MediaPlayerContentRect { left: number; top: number; width: number; height: number }
  export interface MediaPlayerExtensionContext {
    hostType: "video";
    hostId: number;
    surface: MediaPlayerSurface;
    currentTime: number;
    duration: number;
    playing: boolean;
    playbackRate?: number;
    intrinsicWidth: number;
    intrinsicHeight: number;
    contentRect: MediaPlayerContentRect;
    play(): Promise<void>;
    pause(): void;
    seek(seconds: number): void;
    setPlaybackRate?(rate: number): void;
    acquireInteractionMode(options?: { hideNativeControls?: boolean; pauseTracking?: boolean; pausePlayback?: boolean }): () => void;
  }
  export interface EntityReferenceOption { id: number; label: string; secondaryLabel?: string }
  export const EntityReferenceSelector: ComponentType<{
    entityType: "tag";
    value?: number;
    onChange(value: number | undefined, option?: EntityReferenceOption): void;
    placeholder?: string;
    disabled?: boolean;
    allowCreate?: boolean;
  }>;
}
