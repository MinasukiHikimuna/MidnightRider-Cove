import React from "react";

export const useKeySequence = vi.fn();

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
  onPlaybackStateChange,
  clip,
  onPlaybackControlRegister,
}: {
  videoId?: number;
  autostart?: boolean;
  extensionSurface?: string;
  onPlaybackStateChange?: (playing: boolean) => void;
  clip?: { start: number; end?: number | null; loop?: boolean };
  onPlaybackControlRegister?: (controls: typeof testVideoControls) => void;
}) {
  onPlaybackControlRegister?.(testVideoControls);
  return <div data-testid={extensionSurface ? "video-player" : "video-player-preload"} data-video-id={videoId} data-autostart={autostart} data-clip={clip ? JSON.stringify(clip) : undefined}><button onClick={() => onPlaybackStateChange?.(true)}>Play review video</button><button onClick={() => onPlaybackStateChange?.(false)}>Pause review video</button></div>;
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
export const testFilterControls = {
  result: { organized: true } as Record<string, unknown>,
};
export function FilterDialog({
  open,
  onApply,
  onClose,
}: {
  open?: boolean;
  onApply(filter: Record<string, unknown>): void;
  onClose(): void;
}) {
  if (open === false) return null;
  return (
    <div role="dialog" aria-label="Video filters">
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
  criteriaDefinitions = [],
  objectFilter = {},
  onObjectFilterChange,
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
}) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const activeCount = Object.keys(objectFilter).length;
  const perPage = Number(filter.perPage) || 24;
  const page = Number(filter.page) || 1;
  const start = totalCount ? (page - 1) * perPage + 1 : 0;
  const end = Math.min(page * perPage, totalCount);
  return (
    <>
      <div role="toolbar" aria-label="Video list controls">
        <span>{totalCount ? `${start}–${end} of ${totalCount}` : "0 items"}</span>
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
