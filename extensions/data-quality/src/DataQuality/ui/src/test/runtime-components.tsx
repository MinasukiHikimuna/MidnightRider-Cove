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
