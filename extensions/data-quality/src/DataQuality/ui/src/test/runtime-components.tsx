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
export function EntityReferenceMultiSelector() {
  return <div data-testid="tag-selector" />;
}
export function formatDuration(seconds: number) {
  return `${seconds}s`;
}
export function getResolutionLabel(width?: number, height?: number) {
  return width && height ? `${width}x${height}` : "";
}

export const VIDEO_CRITERIA = [];
export const VIDEO_SORT_OPTIONS = [{ value: "date", label: "Date" }];
export function FilterDialog({
  onApply,
  onClose,
}: {
  onApply(filter: Record<string, unknown>): void;
  onClose(): void;
}) {
  return (
    <div role="dialog" aria-label="Video filters">
      <button onClick={() => onApply({ organized: true })}>
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

export function EntityDetailTabs({ tabs, activeTab, onTabChange }: React.ComponentProps<typeof import("@cove/runtime/components").EntityDetailTabs>) {
  return <div role="tablist" aria-label="Detail tabs">{tabs.map(tab => <button key={tab.key} role="tab" aria-selected={tab.key === activeTab} disabled={tab.disabled} onClick={() => onTabChange(tab.key)}>{tab.label}</button>)}</div>;
}

export function DetailListPagination({ filter, totalCount, onFilterChange }: React.ComponentProps<typeof import("@cove/runtime/components").DetailListPagination>) {
  const page = filter.page ?? 1;
  const totalPages = Math.max(1, Math.ceil(totalCount / (filter.perPage ?? 24)));
  const goTo = (page: number) => onFilterChange({ ...filter, page });
  if (totalPages <= 1) return null;
  return <>
    <button disabled={page <= 1} onClick={() => goTo(1)}>First page</button>
    <button disabled={page <= 1} onClick={() => goTo(page - 1)}>Previous page</button>
    <span aria-current="page">{page}</span>
    <button disabled={page >= totalPages} onClick={() => goTo(page + 1)}>Next page</button>
    <button disabled={page >= totalPages} onClick={() => goTo(totalPages)}>Last page</button>
  </>;
}
