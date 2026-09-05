export const testVideoControls = {
  play: vi.fn().mockResolvedValue(undefined),
  pause: vi.fn(),
  toggle: vi.fn(),
  seekBy: vi.fn(),
};
export function VideoPlayer({
  onPlaybackControlRegister,
}: {
  onPlaybackControlRegister?: (controls: typeof testVideoControls) => void;
}) {
  onPlaybackControlRegister?.(testVideoControls);
  return <div data-testid="video-player" />;
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
