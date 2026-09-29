import { useCallback, useState, useSyncExternalStore } from "react";

/**
 * Phone-sized windows. Their width leaves no room for the keyboard-shaped action layouts and
 * touch has neither Shift nor hover, so there the single-item pad, the grid's bar and the
 * preview's bar become plain grids of touch-sized buttons without key caps, and the single-item
 * review offers a Stay on this item switch. The width is the page's existing phone breakpoint
 * (styles.css: the reviews table drops its Type column, the tag list its extra columns and the
 * batch dialog its second column at 760 px). Wider windows, desktop ones and most tablets, keep
 * the keyboard layouts: there the stacked pad still gives each of a row's 11 keys about 60 px,
 * while a phone would leave them under 30.
 */
export const MOBILE_QUERY = "(max-width: 760px)";

/** Whether the window matches a media query (read once), following it as the window changes. */
export function useMediaQuery(query: string): boolean {
  // One list for the component's life: matchMedia makes a new one on every call.
  const [list] = useState(() =>
    typeof window.matchMedia === "function" ? window.matchMedia(query) : null,
  );
  const subscribe = useCallback(
    (onChange: () => void) => {
      list?.addEventListener("change", onChange);
      return () => list?.removeEventListener("change", onChange);
    },
    [list],
  );
  return useSyncExternalStore(subscribe, () => list?.matches ?? false, () => false);
}

/** Whether the window is phone-sized (MOBILE_QUERY). */
export function useMobileLayout(): boolean {
  return useMediaQuery(MOBILE_QUERY);
}
