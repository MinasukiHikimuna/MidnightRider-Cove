import React from "react";

export const testVideoControls = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  toggle: vi.fn(),
  seekBy: vi.fn(),
};
export function VideoPlayer({
  autostart,
  onPlaybackControlRegister,
}: {
  autostart?: boolean;
  onPlaybackControlRegister?: (controls: typeof testVideoControls) => void;
}) {
  onPlaybackControlRegister?.(testVideoControls);
  return <div data-testid="video-player" data-autostart={autostart} />;
}
export function EntityReferenceMultiSelector({
  placeholder,
}: {
  placeholder?: string;
}) {
  return <input data-testid="tag-selector" placeholder={placeholder} />;
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

export const VIDEO_CRITERIA = [];
export const VIDEO_SORT_OPTIONS = [{ value: "date", label: "Date" }];
export function countActiveObjectFilters(
  _criteria: unknown[],
  objectFilter: Record<string, unknown>,
) {
  return Object.keys(objectFilter).length;
}
export function ActiveObjectFilterChips({
  objectFilter,
  ariaLabel,
  onEdit,
}: {
  objectFilter: Record<string, unknown>;
  ariaLabel?: string;
  onEdit(target: unknown): void;
}) {
  return (
    <div role="region" aria-label={ariaLabel}>
      {Object.keys(objectFilter).map((key) => (
        <button
          key={key}
          aria-label={`Edit filter ${key}`}
          onClick={() => onEdit(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );
}
export const testFilterControls = {
  result: { organized: true } as Record<string, unknown>,
};
export function FilterDialog({
  onApply,
  onClose,
}: {
  onApply(filter: Record<string, unknown>): void;
  onClose(): void;
}) {
  return (
    <div role="dialog" aria-label="Video filters">
      <button onClick={() => onApply(testFilterControls.result)}>
        Apply filters
      </button>
      <button onClick={onClose}>Cancel filters</button>
    </div>
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
