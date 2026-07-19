import { previewApi, type PreviewIndex, type PreviewSettings } from "./api";

let index: PreviewIndex | null = null;
let settings: PreviewSettings | null = null;
let indexPromise: Promise<PreviewIndex> | null = null;
let settingsPromise: Promise<PreviewSettings> | null = null;
let epoch = 0;
const listeners = new Set<() => void>();
let snapshot: { index: PreviewIndex | null; settings: PreviewSettings | null } = { index, settings };

const emit = () => {
  snapshot = { index, settings };
  listeners.forEach((listener) => listener());
};
export const subscribePreviewCache = (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener); };
export const getPreviewCacheSnapshot = () => snapshot;

export function loadPreviewCache() {
  const requestEpoch = epoch;
  if (index === null) {
    indexPromise ??= previewApi.getIndex().then((next) => { if (requestEpoch === epoch) { index = next; emit(); } return next; }).finally(() => { if (requestEpoch === epoch) indexPromise = null; });
  }
  if (settings === null) {
    settingsPromise ??= previewApi.getSettings().then((next) => { if (requestEpoch === epoch) { settings = next; emit(); } return next; }).finally(() => { if (requestEpoch === epoch) settingsPromise = null; });
  }
  return Promise.all([
    index === null ? indexPromise! : Promise.resolve(index),
    settings === null ? settingsPromise! : Promise.resolve(settings),
  ]);
}

export function invalidatePreviewIndex() {
  index = null;
  emit();
  return loadPreviewCache();
}

export function updateCachedSettings(next: PreviewSettings) { settings = next; emit(); }
export function __resetPreviewCacheForTests() { epoch += 1; index = null; settings = null; indexPromise = null; settingsPromise = null; snapshot = { index, settings }; listeners.clear(); }
