/**
 * A window.matchMedia stand-in, which jsdom lacks: "(min-width: Npx)" and "(max-width: Npx)"
 * queries (all of them must hold) match against a window width the test sets, and each list the
 * page asked for hears "change" when a new width crosses its query. Without a width set, the page
 * sees no matchMedia at all, as in every other test.
 */
interface TestMediaQueryList {
  media: string;
  matches: boolean;
  listeners: Set<(event: { matches: boolean; media: string }) => void>;
}

let width: number | null = null;
const lists = new Set<TestMediaQueryList>();

function matchesAt(media: string, at: number): boolean {
  const parts = [...media.matchAll(/\((min|max)-width:\s*(\d+(?:\.\d+)?)px\)/g)];
  return (
    parts.length > 0 &&
    parts.every(([, kind, value]) => (kind === "min" ? at >= Number(value) : at <= Number(value)))
  );
}

function matchMedia(media: string) {
  const list: TestMediaQueryList = {
    media,
    matches: matchesAt(media, width ?? 0),
    listeners: new Set(),
  };
  lists.add(list);
  return {
    media,
    get matches() {
      return list.matches;
    },
    onchange: null,
    addEventListener: (type: string, listener: (event: { matches: boolean; media: string }) => void) => {
      if (type === "change") list.listeners.add(listener);
    },
    removeEventListener: (type: string, listener: (event: { matches: boolean; media: string }) => void) => {
      if (type === "change") list.listeners.delete(listener);
    },
    addListener: (listener: (event: { matches: boolean; media: string }) => void) => list.listeners.add(listener),
    removeListener: (listener: (event: { matches: boolean; media: string }) => void) =>
      list.listeners.delete(listener),
    dispatchEvent: () => true,
  } as unknown as MediaQueryList;
}

/** Sets the window's width (CSS px) for media queries; wrap in act() once something rendered. */
export function setViewportWidth(next: number) {
  width = next;
  window.matchMedia = matchMedia;
  for (const list of lists) {
    const matches = matchesAt(list.media, next);
    if (matches === list.matches) continue;
    list.matches = matches;
    for (const listener of [...list.listeners]) listener({ matches, media: list.media });
  }
}

/** Takes matchMedia away again (setup.ts does so before every test). */
export function resetViewport() {
  width = null;
  lists.clear();
  delete (window as { matchMedia?: unknown }).matchMedia;
}
