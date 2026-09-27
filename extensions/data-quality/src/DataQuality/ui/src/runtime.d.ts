declare module "@cove/runtime/api" {
  export function extensionFetch(
    input: string,
    init?: RequestInit & { timeoutMs?: number | null },
  ): Promise<Response>;
}

declare module "@cove/runtime/components" {
  /**
   * Registers keys with Cove's keyboard dispatcher while the calling component is mounted, all
   * enabled or disabled together. A binding without an action id (the only form declared here)
   * is registered with exactly the keys given, on its surface ("page" by default), whatever
   * keyboard preset the user has; Cove does not list it in its shortcut overview or settings,
   * and does not filter key repeat for it.
   *
   * Cove's own typings declare the action without arguments. Its dispatcher nevertheless passes
   * the binding's action the invocation that resolved it (observed from v1.4.0-rc.1 through the
   * current host), which is the only way to tell a held key's repeats apart; declared here so
   * callers treat it as possibly missing. Without Cove's keyboard provider (never inside Cove)
   * the hook listens on its own and calls the action without an invocation.
   */
  export function useKeySequence(
    bindings: Array<{
      keys: string;
      action: (invocation?: KeyboardActionInvocation) => void;
      surface?: "local" | "overlay";
    }>,
    enabled?: boolean,
  ): void;
  /** Host-owned dispatch context supplied after Cove resolves and claims a shortcut. */
  export interface KeyboardActionInvocation {
    /** The normalized sequence that resolved the action, for example "q" or "Shift+q". */
    sequence: string;
    target: EventTarget | null;
    /** Whether the stroke came from a held key repeating. */
    repeat: boolean;
  }
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
  export type CustomFieldEntityType =
    | "video"
    | "image"
    | "audio"
    | "text"
    | "gallery"
    | "performer"
    | "tag"
    | "group"
    | "studio"
    | "face";
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
    customFieldEntityType?: CustomFieldEntityType;
    objectFilter?: Record<string, unknown>;
    onObjectFilterChange?(filter: Record<string, unknown>): void;
    showPagingControls?: boolean;
    /** Shown after the range text ("1–40 of 172"); present since before the extension's floor. */
    metadataByline?: ReactNode;
  }>;
  /**
   * Cove's tag badge, as its video page shows tags: coloured by the tag's colour or else its
   * group's, with the group's dot. Static without onClick. Exported to extensions from the start.
   */
  export const TagBadge: ComponentType<{
    name: string;
    tag?: {
      id?: number;
      name?: string;
      color?: string | null;
      tagGroupColor?: string | null;
      imagePath?: string | null;
      hasImage?: boolean;
    };
    color?: string | null;
    groupColor?: string | null;
    onClick?(): void;
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
  export const PERFORMER_CRITERIA: typeof VIDEO_CRITERIA;
  export const AUDIO_CRITERIA: typeof VIDEO_CRITERIA;
  export const TAG_SORT_OPTIONS: Array<{ value: string; label: string }>;
  export const VIDEO_SORT_OPTIONS: Array<{ value: string; label: string }>;
  export const AUDIO_SORT_OPTIONS: Array<{ value: string; label: string }>;
  export const NarrativeText: ComponentType<{
    children?: string | null;
    className?: string;
  }>;
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
    onPlaybackStateChange?: (playing: boolean) => void;
    streamUrl: string;
    posterUrl?: string;
    format?: string;
    audioCodec?: string;
    duration: number;
    videoId?: number;
    showAbLoop?: boolean;
    keyboardShortcutsEnabled?: boolean;
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
  export const AudioPlayer: ComponentType<{
    streamUrl: string;
    format: string;
    title: string;
    subtitle?: string;
    coverUrl?: string | null;
    duration: number;
    resumeTime?: number;
    hasVideoTrack?: boolean;
    trackingEnabled?: boolean;
    autostart?: boolean;
    autostartToken?: number;
    onPlay?: () => void;
    onPause?: () => void;
    onPlaybackStateChange?: (playing: boolean) => void;
    onEnded?: () => void;
    clip?: { start: number; end?: number | null; loop?: boolean };
  }>;
  export const EntityReferenceMultiSelector: ComponentType<{
    entityType: "tag" | "performer";
    values: number[];
    onChange(values: number[]): void;
    placeholder?: string;
    disabled?: boolean;
    allowCreate?: boolean;
    selectedDisplay?: "chip" | "input";
    children?: ReactNode;
    /**
     * Replaces the wrapper's layout classes (chips above the search field by default). The review
     * lays chips and field out on one line through it (.dq-chip-input in styles.css), which relies
     * on the chips sitting in a div of their own as spans; a host that changes that markup falls
     * back to its stacked layout.
     */
    containerClassName?: string;
    /** Replaces the search field's classes. */
    inputClassName?: string;
    /**
     * The search field's accessible name. Cove v1.5.0 and later; earlier hosts ignore it and the
     * field keeps only its placeholder.
     */
    inputAriaLabel?: string;
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
  export const Ban: Icon;
  export const Check: Icon;
  export const ChevronDown: Icon;
  export const ChevronLeft: Icon;
  export const ChevronRight: Icon;
  export const Copy: Icon;
  export const ExternalLink: Icon;
  export const Film: Icon;
  export const Flag: Icon;
  export const Grid3X3: Icon;
  export const GripVertical: Icon;
  export const Headphones: Icon;
  export const Layers: Icon;
  export const LayoutGrid: Icon;
  export const List: Icon;
  export const Loader2: Icon;
  export const MoreHorizontal: Icon;
  export const Pencil: Icon;
  export const Pin: Icon;
  export const Play: Icon;
  export const Plus: Icon;
  export const RectangleHorizontal: Icon;
  export const RefreshCw: Icon;
  export const RotateCcw: Icon;
  export const Save: Icon;
  export const Search: Icon;
  export const Settings: Icon;
  export const SkipForward: Icon;
  export const Tag: Icon;
  export const Tags: Icon;
  export const Trash2: Icon;
  export const Upload: Icon;
  export const Users: Icon;
  export const X: Icon;
  export const ZoomIn: Icon;
  export const ZoomOut: Icon;
}
