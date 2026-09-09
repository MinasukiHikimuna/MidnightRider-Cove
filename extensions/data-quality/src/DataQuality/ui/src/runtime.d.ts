declare module "@cove/runtime/api" {
  export function extensionFetch(
    input: string,
    init?: RequestInit & { timeoutMs?: number | null },
  ): Promise<Response>;
}

declare module "@cove/runtime/components" {
  import type { ComponentType, CSSProperties, ReactNode } from "react";
  export type DragHandleProps = import("react").HTMLAttributes<HTMLElement>;
  export function SortableList<T>(props: {
    items: T[];
    getKey(item: T): string | number;
    onReorder(items: T[]): void;
    disabled?: boolean;
    className?: string;
    renderItem(
      item: T,
      state: {
        index: number;
        isOver: boolean;
        dragHandleProps: DragHandleProps;
      },
    ): ReactNode;
  }): ReactNode;
  export const DetailListPagination: ComponentType<{
    filter: { page?: number; perPage?: number; [key: string]: unknown };
    totalCount: number;
    className?: string;
    ariaLabel?: string;
    onFilterChange(filter: {
      page?: number;
      perPage?: number;
      [key: string]: unknown;
    }): void;
  }>;
  export const DetailListToolbar: ComponentType<{
    filter: { page?: number; perPage?: number; [key: string]: unknown };
    onFilterChange(filter: {
      page?: number;
      perPage?: number;
      [key: string]: unknown;
    }): void;
    totalCount: number;
    sortOptions: Array<{ value: string; label: string }>;
    showSearch?: boolean;
    showSort?: boolean;
    displayMode?: "grid" | "list" | "wall";
    onDisplayModeChange?(mode: "grid" | "list" | "wall"): void;
    availableDisplayModes?: Array<"grid" | "list" | "wall">;
    zoomLevel?: number;
    onZoomChange?(level: number): void;
    cardSizeEntityType?: string;
    criteriaDefinitions?: typeof VIDEO_CRITERIA;
    objectFilter?: Record<string, unknown>;
    onObjectFilterChange?(filter: Record<string, unknown>): void;
    showPagingControls?: boolean;
  }>;
  export const EntityDetailTabs: ComponentType<{
    tabs: Array<{
      key: string;
      label: string;
      count?: number;
      disabled?: boolean;
    }>;
    activeTab: string;
    onTabChange(key: string): void;
    className?: string;
  }>;
  export const VideoCard: ComponentType<{
    video: {
      id: number;
      title?: string;
      details?: string;
      date?: string;
      studioId?: number;
      studioName?: string;
      organized: boolean;
      urls: string[];
      tags: Array<{ id: number; name: string }>;
      performers: Array<{
        id: number;
        name: string;
        imagePath?: string | null;
      }>;
      groups: Array<{ id: number; name: string }>;
      galleries: Array<{ id: number; title?: string }>;
      files: Array<{
        id: number;
        basename: string;
        width?: number;
        height?: number;
        duration?: number;
      }>;
      createdAt: string;
      updatedAt: string;
      parentVideoId?: number | null;
      clipStartSec?: number | null;
      clipEndSec?: number | null;
    };
    onClick(): void;
    selected?: boolean;
    onSelect?(): void;
    onNavigate?(route: { page: string; id?: number }): void;
    onQuickView?(): void;
  }>;
  export const TagTile: ComponentType<{
    tag: {
      id: number;
      name: string;
      description?: string;
      imagePath?: string;
      favorite: boolean;
      organized: boolean;
      tagGroupId?: number | null;
      tagGroupName?: string | null;
      tagGroupColor?: string | null;
      aliases: string[];
      videoCount?: number;
      segmentCount?: number;
      imageCount?: number;
      galleryCount?: number;
      groupCount?: number;
      performerCount?: number;
      studioCount?: number;
      audioCount?: number;
      textCount?: number;
    };
    onClick(): void;
    selected?: boolean;
    onSelect?(): void;
    selecting?: boolean;
    onNavigate?(route: { page: string; id?: number }): void;
  }>;
  export const VIDEO_CRITERIA: Array<{
    id: string;
    label: string;
    filterKey: string;
  }>;
  export const TAG_CRITERIA: typeof VIDEO_CRITERIA;
  export const TAG_SORT_OPTIONS: Array<{ value: string; label: string }>;
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
  export const Grid3X3: Icon;
  export const GripVertical: Icon;
  export const LayoutGrid: Icon;
  export const List: Icon;
  export const Loader2: Icon;
  export const Pencil: Icon;
  export const Play: Icon;
  export const Plus: Icon;
  export const RotateCcw: Icon;
  export const Save: Icon;
  export const Settings: Icon;
  export const Tags: Icon;
  export const Trash2: Icon;
  export const Upload: Icon;
  export const X: Icon;
  export const ZoomIn: Icon;
  export const ZoomOut: Icon;
}
