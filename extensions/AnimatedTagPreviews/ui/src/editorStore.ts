type Listener = () => void;
export interface EditorRequest { hostId: number; opener: HTMLElement | null; sequence: number }

let current: EditorRequest | null = null;
let sequence = 0;
const listeners = new Set<Listener>();

export function openEditor(hostId: number, opener: HTMLElement | null) {
  current = { hostId, opener, sequence: ++sequence };
  listeners.forEach((listener) => listener());
}

export function isEditorCurrent(hostId: number, expectedSequence: number) {
  return current?.hostId === hostId && current.sequence === expectedSequence;
}

export function closeEditor(hostId: number, restoreFocus = true, expectedSequence?: number) {
  if (current?.hostId !== hostId || (expectedSequence != null && current.sequence !== expectedSequence)) return;
  const opener = current.opener;
  current = null;
  listeners.forEach((listener) => listener());
  if (restoreFocus) queueMicrotask(() => opener?.focus());
}

export function subscribeEditor(listener: Listener) { listeners.add(listener); return () => listeners.delete(listener); }
export function getEditorSnapshot() { return current; }
export function unloadEditorStore() {
  const opener = current?.opener;
  current = null;
  listeners.forEach((listener) => listener());
  opener?.focus();
}
export function __resetEditorStoreForTests() { current = null; listeners.clear(); sequence = 0; }
