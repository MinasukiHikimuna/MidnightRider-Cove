import { useLayoutEffect, useMemo, useRef } from "react";
import {
  useKeySequence,
  type KeyboardActionInvocation,
} from "@cove/runtime/components";
import {
  ACTION_KEYS,
  actionKeyMap,
  type ActionKey,
  type ActionKeyMap,
  type ReviewAction,
} from "./model";

/**
 * Review keys are fixed and work the same under every Cove keyboard preset: each action has the
 * key actionKeyMap gives it (Shift + the key applies and stays in the single-item review), - opens
 * Find action, and Ctrl+A toggles grid select all (Cove reads ⌘ as Ctrl, so ⌘A on a Mac too).
 * They run through Cove's own dispatcher: useKeySequence registers bindings without an action id
 * with exactly the keys given, instead of looking them up in the active preset. The price is that
 * Cove's ? overview and Settings → Keyboard shortcuts do not list them, so they cannot be rebound
 * there.
 *
 * A "local" registration outranks Cove's list, player and global shortcuts. On the local surface
 * (the single-item review and the grid) f, g and k are always registered: they apply the action
 * placed on them, and on an empty key they do nothing, so Cove's Filters and fullscreen, its
 * "g …" go-to chords and play/pause never fire there. Other empty keys are not registered (Cove
 * binds none of them on these pages). Cove skips text entry for these keys and, while any dialog
 * is open, every surface below its overlays; the grid preview is such a dialog and registers its
 * keys on the overlay surface. Cove does not filter key repeat for keys it has no definition of,
 * so a held key acts on its first stroke only. That relies on Cove handing each action its
 * invocation, which its useKeySequence typings leave out (see runtime.d.ts).
 */

/** Opens Find action. */
export const FIND_ACTION_KEY = "-";
/** Grid select all; Cove reads ⌘ as Ctrl, so this one binding covers both. */
export const SELECT_ALL_KEY = "Ctrl+a";
/** How grid select all is shown. */
export const SELECT_ALL_KEY_LABEL = "Ctrl/⌘A";
/**
 * Keys Cove uses on review pages (Filters and fullscreen, the go-to chords, play/pause), which the
 * single-item review and the grid claim whether or not an action sits on them.
 */
export const CLAIMED_KEYS: readonly ActionKey[] = ["f", "g", "k"];
const SHIFT = "Shift+";

type KeyBinding = Parameters<typeof useKeySequence>[0][number];

export interface ReviewKeyHandlers {
  /**
   * "local" while the page itself takes keys; "overlay" for the grid preview, a dialog that
   * holds Cove's lower surfaces back.
   */
  surface: "local" | "overlay";
  /** Whether the keys belong to this view now; while false Cove keeps its own meaning. */
  enabled: boolean;
  /** The review's actions, which take their keys from actionKeyMap. */
  actions: readonly ReviewAction[];
  /** Applies the action at this position among `actions`. */
  onAction(index: number, stay: boolean): void;
  /** Omit where Find action has nothing to list. */
  onFind?(): void;
  /** Grid select all; registered only on the local surface. */
  onSelectAll?(): void;
}

/** A review's action keys, worked out again only when its actions change. */
export function useActionKeyMap(actions: ReadonlyArray<Pick<ReviewAction, "shortcut">>): ActionKeyMap {
  return useMemo(() => actionKeyMap(actions), [actions]);
}

/** Register the review's keys with Cove for as long as the calling view is mounted. */
export function useReviewKeys({
  surface,
  enabled,
  actions,
  onAction,
  onFind,
  onSelectAll,
}: ReviewKeyHandlers) {
  const keyMap = useActionKeyMap(actions);
  // The bindings change only with the set of keys, so Cove does not re-register them on every
  // render; they reach the latest key map and handlers through this ref.
  const latest = useRef({ keyMap, onAction, onFind, onSelectAll });
  useLayoutEffect(() => {
    latest.current = { keyMap, onAction, onFind, onSelectAll };
  });
  const hasFind = Boolean(onFind) && actions.length > 0;
  const hasSelectAll = surface === "local" && Boolean(onSelectAll);
  const keys = ACTION_KEYS.filter(
    (key) => keyMap.actionOn.has(key) || (surface === "local" && CLAIMED_KEYS.includes(key)),
  ).join(" ");
  const bindings = useMemo(() => {
    // Every binding acts on the stroke Cove resolved, not on its own place in the list: until
    // Cove registers a changed list, it forwards each registered binding by position to the
    // latest list, which after a change of keys may hold another key there.
    const dispatch = (stroke: string) => {
      const current = latest.current;
      if (stroke === SELECT_ALL_KEY) current.onSelectAll?.();
      else if (stroke === FIND_ACTION_KEY) current.onFind?.();
      else {
        const stay = stroke.startsWith(SHIFT);
        const index = current.keyMap.actionOn.get(
          (stay ? stroke.slice(SHIFT.length) : stroke) as ActionKey,
        );
        // An empty f, g or k is claimed and does nothing.
        if (index !== undefined) current.onAction(index, stay);
      }
    };
    // Held keys act on their first stroke only; Cove still claims the repeats.
    const binding = (stroke: string, bindingSurface = surface): KeyBinding => ({
      keys: stroke,
      surface: bindingSurface,
      action: (invocation?: KeyboardActionInvocation) => {
        if (!invocation?.repeat) dispatch(invocation?.sequence ?? stroke);
      },
    });
    const list: KeyBinding[] = [];
    if (hasSelectAll) list.push(binding(SELECT_ALL_KEY, "local"));
    if (hasFind) list.push(binding(FIND_ACTION_KEY));
    for (const key of keys ? keys.split(" ") : [])
      list.push(binding(key), binding(`${SHIFT}${key}`));
    return list;
  }, [surface, keys, hasFind, hasSelectAll]);
  useKeySequence(bindings, enabled);
}

export interface ReviewKeyLabels {
  /** The key that opens Find action. */
  find: string;
  /** The key for grid select all, as shown. */
  selectAll: string;
}

const REVIEW_KEY_LABELS: ReviewKeyLabels = {
  find: FIND_ACTION_KEY,
  selectAll: SELECT_ALL_KEY_LABEL,
};

/**
 * The fixed keys to show on buttons, the pad and Find action; each action's own key comes from
 * its review's key map (useActionKeyMap).
 */
export function useReviewKeyLabels(): ReviewKeyLabels {
  return REVIEW_KEY_LABELS;
}
