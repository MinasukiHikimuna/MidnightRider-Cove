declare module "@cove/runtime/api" {
  export function extensionFetch(
    input: string,
    init?: RequestInit & { timeoutMs?: number | null },
  ): Promise<Response>;
}

declare module "@cove/runtime/components" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";
  export const VIDEO_CRITERIA: Array<{
    id: string;
    label: string;
    filterKey: string;
  }>;
  export const VIDEO_SORT_OPTIONS: Array<{ value: string; label: string }>;
  export const FilterDialog: ComponentType<{
    open: boolean;
    onClose(): void;
    criteria: typeof VIDEO_CRITERIA;
    activeFilter: Record<string, unknown>;
    onApply(filter: Record<string, unknown>): void;
    supportsFilterExpressions?: boolean;
    subjectLabel?: string;
  }>;
  export const VideoPlayer: ComponentType<{
    autostart?: boolean;
    streamUrl: string;
    posterUrl?: string;
    format?: string;
    audioCodec?: string;
    duration: number;
    videoId?: number;
    showAbLoop?: boolean;
    extensionSurface?: "detail" | "quick-view" | "compilation";
    onPlaybackControlRegister?: (controls: {
      play(): Promise<void>;
      pause(): void;
      toggle(): void;
      seekBy(seconds: number): void;
    }) => void | (() => void);
    videoStyle?: CSSProperties;
    clip?: { start: number; end?: number | null; loop?: boolean };
  }>;
  export const EntityReferenceMultiSelector: ComponentType<{
    entityType: "tag";
    values: number[];
    onChange(values: number[]): void;
    placeholder?: string;
    disabled?: boolean;
    allowCreate?: boolean;
    selectedDisplay?: "chip" | "input";
    children?: ReactNode;
  }>;
  export function formatDuration(seconds: number): string;
  export function getResolutionLabel(width?: number, height?: number): string;
  export const testVideoControls: {
    play: { (...args: unknown[]): Promise<void>; mockReset(): void };
    pause: { (...args: unknown[]): void; mockReset(): void };
    toggle: { (...args: unknown[]): void; mockReset(): void };
    seekBy: { (...args: unknown[]): void; mockReset(): void };
  };
}

declare module "@cove/runtime/lucide-react" {
  import type { ComponentType, SVGProps } from "react";
  type Icon = ComponentType<
    SVGProps<SVGSVGElement> & { size?: number | string }
  >;
  export const AlertTriangle: Icon;
  export const Check: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const ExternalLink: Icon;
  export const Film: Icon;
  export const Loader2: Icon;
  export const Pencil: Icon;
  export const Play: Icon;
  export const Plus: Icon;
  export const Trash2: Icon;
  export const Upload: Icon;
  export const X: Icon;
}
