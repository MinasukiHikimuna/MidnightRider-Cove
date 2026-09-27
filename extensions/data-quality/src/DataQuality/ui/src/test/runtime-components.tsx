import React from "react";

/*
 * A stand-in for Cove's keyboard dispatch (the KeyboardShortcutProvider behind useKeySequence),
 * enough to drive the extension's fixed review keys from ordinary keydown events.
 *
 * useKeySequence registers each binding the way Cove registers one without an action id: as its
 * own "legacy:<index>:<keys>" entry bound to exactly the keys given (the user's keyboard preset
 * plays no part), on the binding's surface ("page" by default), enabled or disabled with the
 * whole call, calling the latest action with { sequence, target, repeat }. A binding with an id
 * would follow the user's preset instead, so the stand-in rejects it. Cove's own shortcuts that
 * compete for these keys are registered, with their Cove Native keys, by the doubles of the host
 * components that own them: Filters on f (list toolbar, list surface) and fullscreen on f,
 * play/pause on Space and k, and mute on m (video player, player surface).
 *
 * One window capture listener normalizes each stroke the way Cove does and collects the enabled
 * entries bound to it, skipping text entry (nothing modelled here may run in it), key repeat for
 * Cove's own shortcuts only (Cove drops it for defined actions that are not repeatable, which
 * these are not; fixed keys have no definition), and surfaces below "viewer" while any dialog is
 * in the document. The highest surface wins; different ids bound to the same key there conflict
 * (Cove shows a notice; recorded in testKeyboardConflicts), and among entries sharing an id the
 * most recently registered one runs, as Cove registers a changed registration again at the end.
 * A resolved or conflicting stroke is claimed before any extension listener sees it.
 *
 * Not modelled: chord prefixes (with an empty "g" slot, Cove waits for a "g …" chord), presets
 * other than Cove Native for Cove's own shortcuts, and the delay before Cove sees a changed
 * registration.
 */
type TestKeyInvocation = { sequence: string; target: EventTarget | null; repeat: boolean };
type TestKeyEntry = {
  id: string;
  /** The stroke as Cove normalizes it, for example "Shift+q" or "Ctrl+a". */
  stroke: string;
  surface: string;
  enabled: boolean;
  /** Cove's own shortcuts have a (non-repeatable) definition, so Cove drops their key repeat. */
  defined: boolean;
  action(invocation: TestKeyInvocation): void;
};
const SURFACE_PRIORITY: Record<string, number> = {
  global: 0,
  page: 10,
  detail: 20,
  list: 30,
  player: 30,
  local: 40,
  viewer: 50,
  overlay: 60,
};
const mountedKeyEntries = new Set<React.MutableRefObject<TestKeyEntry[]>>();
/** Strokes that two different entries claimed at once, as Cove's conflict notice reports them. */
export const testKeyboardConflicts: string[] = [];

function isLetter(key: string) {
  return Array.from(key).length === 1 && key.toLowerCase() !== key.toUpperCase();
}
function strokeOf(modifiers: { ctrl: boolean; alt: boolean; shift: boolean }, key: string) {
  const letter = isLetter(key);
  const parts: string[] = [];
  if (modifiers.ctrl) parts.push("Ctrl");
  if (modifiers.alt) parts.push("Alt");
  // Cove records Shift only for letters and named keys: Shift+- is whatever character it types.
  if (modifiers.shift && (letter || key.length > 1)) parts.push("Shift");
  parts.push(letter ? key.toLowerCase() : key);
  return parts.join("+");
}
function normalizeTestEvent(event: KeyboardEvent): string | null {
  const key = event.key === " " ? "Space" : event.key;
  if (!key || ["Control", "Shift", "Alt", "Meta"].includes(key)) return null;
  // Cove reads ⌘ as Ctrl.
  return strokeOf(
    { ctrl: event.ctrlKey || event.metaKey, alt: event.altKey, shift: event.shiftKey },
    key,
  );
}
/** A binding as Cove normalizes it; only single strokes are modelled. */
function normalizeTestBinding(keys: string): string {
  const value = keys.trim();
  if (!value || /\s/.test(value))
    throw new Error(`'${keys}' is not a single stroke; chords are not modelled.`);
  const parts = value.endsWith("+")
    ? [...value.slice(0, -1).split("+").filter(Boolean), "+"]
    : value.split("+");
  const key = parts.pop()!;
  const modifiers = new Set(parts.map((part) => part.toLowerCase()));
  return strokeOf(
    {
      ctrl: ["ctrl", "control", "cmd", "command", "meta"].some((name) => modifiers.has(name)),
      alt: modifiers.has("alt") || modifiers.has("option"),
      shift: modifiers.has("shift"),
    },
    key,
  );
}

function useTestKeyEntries(entries: TestKeyEntry[]) {
  const current = React.useRef(entries);
  React.useLayoutEffect(() => {
    current.current = entries;
  });
  // Registered again, at the end, whenever an id, key, surface or enablement changes.
  const registration = entries
    .map((entry) => [entry.id, entry.stroke, entry.surface, entry.enabled].join("\u001e"))
    .join("\u001d");
  React.useEffect(() => {
    mountedKeyEntries.add(current);
    return () => {
      mountedKeyEntries.delete(current);
    };
  }, [registration]);
}

export function useKeySequence(
  bindings: Array<{
    id?: string;
    keys: string;
    surface?: string;
    action(invocation?: TestKeyInvocation): void;
  }>,
  enabled = true,
) {
  useTestKeyEntries(
    bindings.map((binding, index) => {
      if (binding.id !== undefined)
        throw new Error(
          `'${binding.id}' would follow the user's keyboard preset; review keys are fixed.`,
        );
      return {
        id: `legacy:${index}:${binding.keys}`,
        stroke: normalizeTestBinding(binding.keys),
        surface: binding.surface ?? "page",
        enabled,
        defined: false,
        action: (invocation) => binding.action(invocation),
      };
    }),
  );
}

/** One of Cove's own shortcuts, registered by the double of the host component that owns it. */
function useTestCoveShortcut(
  id: string,
  keys: string[],
  surface: string,
  enabled: boolean,
  action: () => void,
) {
  useTestKeyEntries(
    keys.map((key) => ({
      id,
      stroke: normalizeTestBinding(key),
      surface,
      enabled,
      defined: true,
      action: () => action(),
    })),
  );
}

/** Cove's player shortcuts that have no counterpart in testVideoControls. */
export const testPlayerShortcuts = { fullscreen: vi.fn(), mute: vi.fn() };

/** The enabled fixed keys, as "surface:stroke" (for example "local:Shift+q"), for assertions. */
export function activeTestKeys(): string[] {
  return [...mountedKeyEntries].flatMap((entries) =>
    entries.current
      .filter((entry) => entry.enabled && !entry.defined)
      .map((entry) => `${entry.surface}:${entry.stroke}`),
  );
}

if (typeof window !== "undefined")
  window.addEventListener(
    "keydown",
    (event) => {
      const stroke = normalizeTestEvent(event);
      if (!stroke) return;
      const target = event.target as HTMLElement | null;
      if (
        target?.isContentEditable ||
        target?.getAttribute?.("contenteditable") === "true" ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName ?? "")
      )
        return;
      const overlay =
        document.querySelector("[role='dialog'], [aria-modal='true']") != null ||
        (target instanceof Element && target.closest("[role='listbox'], [role='menu']") != null);
      const matches: Array<{ entry: TestKeyEntry; priority: number }> = [];
      for (const entries of mountedKeyEntries)
        for (const entry of entries.current) {
          if (!entry.enabled || entry.stroke !== stroke) continue;
          if (event.repeat && entry.defined) continue;
          const priority = SURFACE_PRIORITY[entry.surface] ?? SURFACE_PRIORITY.page;
          if (overlay && priority < SURFACE_PRIORITY.viewer) continue;
          matches.push({ entry, priority });
        }
      if (!matches.length) return;
      const highest = Math.max(...matches.map((match) => match.priority));
      const winners = matches.filter((match) => match.priority === highest);
      event.preventDefault();
      event.stopImmediatePropagation();
      if (new Set(winners.map((match) => match.entry.id)).size > 1) {
        testKeyboardConflicts.push(stroke);
        return;
      }
      winners
        .at(-1)!
        .entry.action({ sequence: stroke, target: event.target, repeat: event.repeat });
    },
    { capture: true },
  );

export const testVideoControls = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  toggle: vi.fn(),
  seekBy: vi.fn(),
};
export function VideoPlayer({
  videoId,
  autostart,
  extensionSurface,
  keyboardShortcutsEnabled,
  onPlaybackStateChange,
  clip,
  onPlaybackControlRegister,
}: {
  videoId?: number;
  autostart?: boolean;
  extensionSurface?: string;
  keyboardShortcutsEnabled?: boolean;
  onPlaybackStateChange?: (playing: boolean) => void;
  clip?: { start: number; end?: number | null; loop?: boolean };
  onPlaybackControlRegister?: (controls: typeof testVideoControls) => void;
}) {
  onPlaybackControlRegister?.(testVideoControls);
  // Cove's player shortcuts (Cove Native keys), on by default as in Cove.
  const playerKeys = keyboardShortcutsEnabled ?? true;
  useTestCoveShortcut("player.playPause", ["Space", "k"], "player", playerKeys, () =>
    testVideoControls.toggle(),
  );
  useTestCoveShortcut("player.mute", ["m"], "player", playerKeys, () => testPlayerShortcuts.mute());
  useTestCoveShortcut("player.fullscreen", ["f"], "player", playerKeys, () =>
    testPlayerShortcuts.fullscreen(),
  );
  return <div data-testid={extensionSurface ? "video-player" : "video-player-preload"} data-video-id={videoId} data-autostart={autostart} data-keyboard-shortcuts-enabled={keyboardShortcutsEnabled} data-clip={clip ? JSON.stringify(clip) : undefined}><button onClick={() => onPlaybackStateChange?.(true)}>Play review video</button><button onClick={() => onPlaybackStateChange?.(false)}>Pause review video</button></div>;
}
export function AudioPlayer({
  streamUrl,
  title,
  coverUrl,
  duration,
  autostart,
  onPlaybackStateChange,
}: {
  streamUrl: string;
  title: string;
  coverUrl?: string | null;
  duration: number;
  autostart?: boolean;
  onPlaybackStateChange?: (playing: boolean) => void;
}) {
  return (
    <div
      data-testid="audio-player"
      data-stream-url={streamUrl}
      data-title={title}
      data-cover-url={coverUrl ?? undefined}
      data-duration={duration}
      data-autostart={autostart}
    >
      <button onClick={() => onPlaybackStateChange?.(true)}>Play review audio</button>
    </div>
  );
}
export function NarrativeText({
  children,
  className,
}: {
  children?: string | null;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
export function EntityReferenceMultiSelector({
  placeholder,
  values = [], onChange, disabled,
}: {
  placeholder?: string;
  values?: number[]; onChange?: (ids: number[]) => void; disabled?: boolean;
}) {
  return <input data-testid="tag-selector" placeholder={placeholder} disabled={disabled} value={values.join(",")} onChange={(event) => onChange?.(event.target.value.split(",").filter(Boolean).map(Number))} />;
}
export function formatDuration(seconds: number) {
  return `${seconds}s`;
}
export function getResolutionLabel(width?: number, height?: number) {
  return width && height ? `${width}x${height}` : "";
}

export function VideoCard({
  video,
  onClick,
  selected,
  onSelect,
  onNavigate,
  onQuickView,
}: React.ComponentProps<typeof import("@cove/runtime/components").VideoCard>) {
  const [coverFailed, setCoverFailed] = React.useState(false);
  const title = video.title || video.files[0]?.basename || "Untitled";
  return (
    <div
      className={`video-card relative flex h-full flex-col overflow-hidden rounded border bg-card ${
        selected ? "border-accent ring-2 ring-accent" : "border-border"
      }`}
    >
      <a
        href={`/video/${video.id}`}
        aria-label={`Open video ${title}`}
        className="absolute inset-0 z-[1]"
        onClick={(event) => {
          event.preventDefault();
          onClick();
        }}
      />
      <div className="video-card-preview card-media relative aspect-video overflow-hidden bg-black">
        {coverFailed ? (
          <div className="video-card-cover-fallback" />
        ) : (
          <img
            src={`/cover-${video.id}.jpg`}
            alt=""
            loading="lazy"
            className="video-card-preview-image h-full w-full"
            onError={() => setCoverFailed(true)}
          />
        )}
        {onSelect ? (
          <button
            type="button"
            aria-label={selected ? "Deselect item" : "Select item"}
            onClick={(event) => {
              event.stopPropagation();
              onSelect();
            }}
          />
        ) : null}
        {onQuickView ? (
          <button type="button" title="Quick View" onClick={onQuickView} />
        ) : null}
      </div>
      <div className="card-body flex min-h-0 flex-1 flex-col gap-1.5 border-t border-border/50 px-2.5 pb-2 pt-2">
        <p className="card-title line-clamp-2 font-semibold">{title}</p>
        <div>{[video.date, video.studioName].filter(Boolean).join(" · ")}</div>
        <div>
          {video.performers.map((performer) => (
            <a
              key={performer.id}
              href={`/performer/${performer.id}`}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onNavigate?.({ page: "performer", id: performer.id });
              }}
            >
              {performer.name}
            </a>
          ))}
        </div>
        {video.details ? <p>{video.details}</p> : null}
      </div>
      <hr />
      <div className="card-popovers">
        {video.performers.length ? (
          <button title="Performers">{video.performers.length}</button>
        ) : null}
        {video.tags.length ? (
          <button title="Tags">{video.tags.length}</button>
        ) : null}
        {video.groups.length ? (
          <button title="Groups">{video.groups.length}</button>
        ) : null}
        {video.galleries.length ? (
          <button title="Galleries">{video.galleries.length}</button>
        ) : null}
        {video.organized ? <span title="Organized" /> : null}
      </div>
    </div>
  );
}

/** Cove's tag badge: its colours and group dot as data, for assertions. */
export function TagBadge({
  name,
  tag,
  onClick,
}: React.ComponentProps<typeof import("@cove/runtime/components").TagBadge>) {
  return (
    <span
      className="tag-badge"
      data-color={tag?.color ?? undefined}
      data-group-color={tag?.tagGroupColor ?? undefined}
      data-clickable={onClick ? "true" : undefined}
    >
      {name}
    </span>
  );
}

export function TagTile({
  tag,
  onClick,
  selected,
  onSelect,
}: React.ComponentProps<typeof import("@cove/runtime/components").TagTile>) {
  return (
    <div className={selected ? "selected" : ""}>
      <a
        href={`/tag/${tag.id}`}
        onClick={(event) => {
          event.preventDefault();
          onClick();
        }}
      >
        <span className="card-title">{tag.name}</span>
      </a>
      {tag.tagGroupName ? <span>{tag.tagGroupName}</span> : null}
      {onSelect ? (
        <button
          type="button"
          aria-label={selected ? "Deselect item" : "Select item"}
          onClick={onSelect}
        />
      ) : null}
    </div>
  );
}

const RELATED_PERFORMER_CRITERIA = [
  {
    id: "tags",
    label: "Tags",
    type: "multiId",
    entityType: "tags",
    filterKey: "tagsCriterion",
  },
  {
    id: "tagDuration",
    label: "Tag Duration",
    type: "tagDuration",
    entityType: "tags",
    filterKey: "tagDurationCriterion",
  },
];
export const VIDEO_CRITERIA = [
  {
    id: "title",
    label: "Title",
    type: "string",
    filterKey: "titleCriterion",
  },
  {
    id: "tags",
    label: "Tags",
    type: "multiId",
    entityType: "tags",
    filterKey: "tagsCriterion",
  },
  {
    id: "tagDuration",
    label: "Tag Duration",
    type: "tagDuration",
    entityType: "tags",
    filterKey: "tagDurationCriterion",
  },
  {
    id: "hash",
    label: "Hash",
    type: "hash",
    filterKey: "fingerprintCriterion",
    options: [
      { value: "oshash", label: "OSHash" },
      { value: "md5", label: "MD5" },
      { value: "phash", label: "pHash" },
    ],
  },
  {
    id: "relatedPerformers",
    label: "Related Performers",
    type: "related",
    entityType: "performers",
    filterKey: "performerFilterCriterion",
    supportsDistinctSiblingMatches: true,
    relatedCriteria: () => RELATED_PERFORMER_CRITERIA,
  },
  {
    id: "remoteId",
    label: "Remote ID",
    type: "remoteId",
    filterKey: "remoteIdValueCriterion",
    secondaryFilterKey: "remoteIdCriterion",
  },
];
export const VIDEO_SORT_OPTIONS = [{ value: "date", label: "Date" }, { value: "title", label: "Title" }];
export const TAG_CRITERIA = [
  {
    id: "tagGroup",
    label: "Tag Group",
    type: "multiId",
    entityType: "tagGroups",
    filterKey: "tagGroupsCriterion",
  },
];
export const TAG_SORT_OPTIONS = [{ value: "name", label: "Name" }];
export const AUDIO_CRITERIA = [
  { id: "title", label: "Title", filterKey: "titleCriterion" },
  { id: "performers", label: "Performers", filterKey: "performersCriterion" },
];
export const AUDIO_SORT_OPTIONS = [
  { value: "date", label: "Date" },
  { value: "title", label: "Title" },
];
export const testFilterControls = {
  result: { organized: true } as Record<string, unknown>,
};
export function FilterDialog({
  open,
  onApply,
  onClose,
  customSections,
}: {
  open?: boolean;
  onApply(filter: Record<string, unknown>): void;
  onClose(): void;
  customSections?: Array<{ id: string }>;
}) {
  if (open === false) return null;
  return (
    <div
      role="dialog"
      aria-label="Video filters"
      data-custom-sections={customSections?.map((section) => section.id).join(",")}
    >
      <button aria-label="Edit filter: Nested criterion">Nested criterion</button>
      <button onClick={() => (testFilterControls.result = {})}>Clear all</button>
      <button
        aria-label="Dismiss filters"
        onClick={() => {
          testFilterControls.result = { organized: true };
          onClose();
        }}
      >
        Backdrop
      </button>
      <button onClick={() => onApply(testFilterControls.result)}>
        Apply filters
      </button>
      <button onClick={onClose}>Cancel filters</button>
    </div>
  );
}

export function DetailListToolbar({
  filter,
  onFilterChange,
  totalCount,
  sortOptions,
  showSearch,
  showSort = true,
  displayMode,
  onDisplayModeChange,
  availableDisplayModes = [],
  zoomLevel,
  onZoomChange,
  criteriaDefinitions: givenCriteria,
  objectFilter = {},
  customFieldEntityType,
  onObjectFilterChange,
  metadataByline,
}: {
  filter: Record<string, unknown>;
  onFilterChange(filter: Record<string, unknown>): void;
  totalCount: number;
  sortOptions: Array<{ value: string; label: string }>;
  showSearch?: boolean;
  showSort?: boolean;
  displayMode?: "grid" | "list" | "wall";
  onDisplayModeChange?(mode: "grid" | "list" | "wall"): void;
  availableDisplayModes?: Array<"grid" | "list" | "wall">;
  zoomLevel?: number;
  onZoomChange?(level: number): void;
  criteriaDefinitions?: Array<{
    id: string;
    label: string;
    filterKey: string;
  }>;
  objectFilter?: Record<string, unknown>;
  onObjectFilterChange?(filter: Record<string, unknown>): void;
  customFieldEntityType?: string;
  metadataByline?: React.ReactNode;
}) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const criteriaDefinitions = givenCriteria ?? [];
  // Cove's Filters shortcut, which a Data Quality action on f outranks.
  useTestCoveShortcut(
    "list.filters",
    ["f"],
    "list",
    Boolean(givenCriteria && onObjectFilterChange),
    () => setFiltersOpen(true),
  );
  const activeCount = Object.keys(objectFilter).length;
  const perPage = Number(filter.perPage) || 24;
  const page = Number(filter.page) || 1;
  const start = totalCount ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(page * perPage, totalCount);
  return (
    <>
      <div
        role="toolbar"
        aria-label="Video list controls"
        data-custom-field-entity-type={customFieldEntityType}
        data-object-filter={JSON.stringify(objectFilter)}
      >
        <span>{totalCount ? `${start}–${end} of ${totalCount}` : "0 items"}</span>
        {metadataByline}
        {showSearch && (
          <input
            aria-label="Search list"
            value={String(filter.q ?? "")}
            onChange={(event) =>
              onFilterChange({ ...filter, q: event.target.value, page: 1 })
            }
          />
        )}
        {showSort && (
          <>
            <select
              value={String(filter.sort ?? sortOptions[0]?.value ?? "")}
              onChange={(event) =>
                onFilterChange({ ...filter, sort: event.target.value, page: 1 })
              }
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              aria-label={filter.direction === "asc" ? "Ascending" : "Descending"}
              onClick={() =>
                onFilterChange({
                  ...filter,
                  direction: filter.direction === "asc" ? "desc" : "asc",
                  page: 1,
                })
              }
            />
          </>
        )}
        <button
          type="button"
          aria-label={activeCount ? `Filters, ${activeCount} active` : "Filters"}
          onClick={() => setFiltersOpen(true)}
        >
          Filters
        </button>
        {displayMode && onDisplayModeChange && (
          <div role="group" aria-label="Review view">
            {availableDisplayModes.map((mode) => (
              <button
                key={mode}
                type="button"
                aria-label={mode === "grid" ? "Grid" : "Wall"}
                aria-pressed={displayMode === mode}
                onClick={() => onDisplayModeChange(mode)}
              />
            ))}
          </div>
        )}
        <select
          aria-label="Items per page"
          value={Number(filter.perPage) || 40}
          onChange={(event) =>
            onFilterChange({
              ...filter,
              perPage: Number(event.target.value),
              page: 1,
            })
          }
        >
          {[20, 24, 40, 60, 120, 250, 500, 1000].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        {zoomLevel !== undefined && onZoomChange && (
          <input
            type="range"
            min="0"
            max="8"
            step="0.25"
            value={zoomLevel}
            aria-label={`Card size: ${Math.round(225 + zoomLevel * 50)}px`}
            onChange={(event) => onZoomChange(Number(event.target.value))}
          />
        )}
      </div>
      {activeCount > 0 && (
        <div role="region" aria-label="Applied filters">
          {Object.keys(objectFilter).map((key) => {
            const label =
              criteriaDefinitions.find(
                (criterion) => criterion.filterKey === key,
              )?.label ?? key;
            const value = Array.isArray(objectFilter[key])
              ? objectFilter[key]
                  .map((item) =>
                    item && typeof item === "object" && "label" in item
                      ? String(item.label)
                      : "",
                  )
                  .filter(Boolean)
                  .join(", ")
              : "";
            return (
              <React.Fragment key={key}>
                <button
                  type="button"
                  aria-label={`Edit filter: ${label}`}
                  onClick={() => setFiltersOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key !== "Delete" && event.key !== "Backspace")
                      return;
                    const next = { ...objectFilter };
                    delete next[key];
                    onObjectFilterChange?.(next);
                    onFilterChange({ ...filter, page: 1 });
                  }}
                >
                  {label}{value ? `: ${value}` : ""}
                </button>
                <button
                  type="button"
                  aria-label={`Remove filter: ${label}`}
                  onClick={() => {
                    const next = { ...objectFilter };
                    delete next[key];
                    onObjectFilterChange?.(next);
                    onFilterChange({ ...filter, page: 1 });
                  }}
                >
                  Remove
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
      {filtersOpen && (
        <FilterDialog
          onClose={() => setFiltersOpen(false)}
          onApply={(nextFilter) => {
            onObjectFilterChange?.(nextFilter);
            onFilterChange({ ...filter, page: 1 });
            setFiltersOpen(false);
          }}
        />
      )}
    </>
  );
}

// Runtime contract stub; pointer and keyboard behavior is verified in Cove and the live UI.
export function SortableList<T>({
  items,
  getKey,
  onReorder,
  renderItem,
  disabled,
  className,
}: Parameters<typeof import("@cove/runtime/components").SortableList<T>>[0]) {
  return (
    <div role="list" className={className}>
      {items.map((item, index) => (
        <div role="listitem" key={getKey(item)}>
          {renderItem(item, {
            index,
            isOver: false,
            dragHandleProps: {
              onKeyDown: (event) => {
                if (
                  disabled ||
                  !event.altKey ||
                  !["ArrowUp", "ArrowDown"].includes(event.key)
                )
                  return;
                event.preventDefault();
                const target = index + (event.key === "ArrowUp" ? -1 : 1);
                if (target < 0 || target >= items.length) return;
                const next = [...items];
                next.splice(target, 0, ...next.splice(index, 1));
                onReorder(next);
              },
            },
          })}
        </div>
      ))}
    </div>
  );
}

export function EntityDetailTabs({
  tabs,
  activeTab,
  onTabChange,
}: React.ComponentProps<
  typeof import("@cove/runtime/components").EntityDetailTabs
>) {
  return (
    <div role="tablist" aria-label="Detail tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          role="tab"
          aria-selected={tab.key === activeTab}
          disabled={tab.disabled}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function DetailListPagination({
  filter,
  totalCount,
  onFilterChange,
}: React.ComponentProps<
  typeof import("@cove/runtime/components").DetailListPagination
>) {
  const page = filter.page ?? 1;
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / (filter.perPage ?? 24)),
  );
  React.useEffect(() => { if (totalCount > 0 && page > totalPages) onFilterChange({ ...filter, page: totalPages }); }, [page, totalPages, totalCount]);
  const goTo = (page: number) => onFilterChange({ ...filter, page });
  if (totalPages <= 1) return null;
  return (
    <>
      <button disabled={page <= 1} onClick={() => goTo(1)}>
        First page
      </button>
      <button disabled={page <= 1} onClick={() => goTo(page - 1)}>
        Previous page
      </button>
      <span aria-current="page">{page}</span>
      <button disabled={page >= totalPages} onClick={() => goTo(page + 1)}>
        Next page
      </button>
      <button disabled={page >= totalPages} onClick={() => goTo(totalPages)}>
        Last page
      </button>
    </>
  );
}

export function useCustomFieldFilterSection(entityType?: string) {
  return entityType === "video"
    ? { id: "custom-fields", label: "Custom Fields", filterKey: "customFieldCriteria" }
    : undefined;
}
