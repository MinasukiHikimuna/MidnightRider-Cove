import { previewApi, type PreviewIndex, type PreviewSettings } from "./api";

let index: PreviewIndex | null = null;
let settings: PreviewSettings | null = null;
let indexPromise: Promise<PreviewIndex> | null = null;
let settingsPromise: Promise<PreviewSettings> | null = null;
let indexEpoch = 0;
let settingsEpoch = 0;
const listeners = new Set<() => void>();
const channelName = "midnight-rider:animated-tag-previews:index";
let broadcastChannel: BroadcastChannel | null = null;
let snapshot: { index: PreviewIndex | null; settings: PreviewSettings | null } = { index, settings };

const emit = () => {
  snapshot = { index, settings };
  listeners.forEach((listener) => listener());
};
export const subscribePreviewCache = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
export const getPreviewCacheSnapshot = () => snapshot;

function getBroadcastChannel() {
  if (broadcastChannel || typeof BroadcastChannel === "undefined") return broadcastChannel;
  broadcastChannel = new BroadcastChannel(channelName);
  broadcastChannel.addEventListener("message", () => { void invalidatePreviewIndex(false).catch(() => {}); });
  return broadcastChannel;
}

export function loadPreviewCache() {
  getBroadcastChannel();
  const requestIndexEpoch = indexEpoch;
  const requestSettingsEpoch = settingsEpoch;
  if (index === null) {
    indexPromise ??= previewApi.getIndex().then((next) => { if (requestIndexEpoch === indexEpoch) { index = next; emit(); } return next; }).finally(() => { if (requestIndexEpoch === indexEpoch) indexPromise = null; });
  }
  if (settings === null) {
    settingsPromise ??= previewApi.getSettings().then((next) => { if (requestSettingsEpoch === settingsEpoch) { settings = next; emit(); } return next; }).finally(() => { if (requestSettingsEpoch === settingsEpoch) settingsPromise = null; });
  }
  return Promise.all([
    index === null ? indexPromise! : Promise.resolve(index),
    settings === null ? settingsPromise! : Promise.resolve(settings),
  ]);
}

export function invalidatePreviewIndex(broadcast = true) {
  indexEpoch += 1;
  index = null;
  indexPromise = null;
  emit();
  if (broadcast) getBroadcastChannel()?.postMessage({ type: "invalidate" });
  return loadPreviewCache();
}

export function updateCachedSettings(next: PreviewSettings) { settings = next; emit(); }
export function __resetPreviewCacheForTests() { indexEpoch += 1; settingsEpoch += 1; index = null; settings = null; indexPromise = null; settingsPromise = null; snapshot = { index, settings }; listeners.clear(); broadcastChannel?.close(); broadcastChannel = null; }
