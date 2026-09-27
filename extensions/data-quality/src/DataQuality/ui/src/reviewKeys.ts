import { useLayoutEffect, useMemo, useRef } from "react";
import {
  useKeySequence,
  type KeyboardActionInvocation,
} from "@cove/runtime/components";
import { ACTION_KEYS } from "./model";

/**
 * Review keys are fixed and work the same under every Cove keyboard preset: the review's actions
 * take the letters of ACTION_KEYS in order (Shift + the letter applies and stays in the
 * single-item review), - opens Find action, and Ctrl+A toggles grid select all (Cove reads ⌘ as
 * Ctrl, so ⌘A on a Mac too). They run through Cove's own dispatcher: useKeySequence registers
 * bindings without an action id with exactly the keys given, instead of looking them up in the
 * active preset. The price is that Cove's ? overview and Settings → Keyboard shortcuts do not
 * list them, so they cannot be rebound there.
 *
 * A "local" registration outranks Cove's list, player and global shortcuts, so f, g and k apply
 * actions on this page while their slot holds one; keys of empty slots are not registered and
 * keep whatever the active preset gives them. Cove skips text entry for these keys and, while
 * any dialog is open, every surface below its overlays. It does not filter key repeat for keys
 * it has no definition of, so a held key acts on its first stroke only. That relies on Cove
 * handing each action its invocation, which its useKeySequence typings leave out (see
 * runtime.d.ts).
 */

/** Opens Find action. */
export const FIND_ACTION_KEY = "-";
/** Grid select all; Cove reads ⌘ as Ctrl, so this one binding covers both. */
export const SELECT_ALL_KEY = "Ctrl+a";
/** How grid select all is shown. */
export const SELECT_ALL_KEY_LABEL = "Ctrl/⌘A";

type KeyBinding = Parameters<typeof useKeySequence>[0][number];

/** Runs only for the first stroke of a held key; Cove still claims the repeats. */
function firstStrokeOnly(run: () => void) {
  return (invocation?: KeyboardActionInvocation) => {
    if (!invocation?.repeat) run();
  };
}

export interface ReviewKeyHandlers {
  /**
   * "local" while the page itself takes keys; "overlay" for the grid preview, a dialog that
   * holds Cove's lower surfaces back.
   */
  surface: "local" | "overlay";
  /** Whether the keys belong to this view now; while false Cove keeps its own meaning. */
  enabled: boolean;
  /** How many of the review's actions exist; keys past them stay Cove's. */
  actionCount: number;
  onAction(index: number, stay: boolean): void;
  /** Omit where Find action has nothing to list. */
  onFind?(): void;
  /** Grid select all; registered only on the local surface. */
  onSelectAll?(): void;
}

/** Register the review's keys with Cove for as long as the calling view is mounted. */
export function useReviewKeys({
  surface,
  enabled,
  actionCount,
  onAction,
  onFind,
  onSelectAll,
}: ReviewKeyHandlers) {
  // The bindings change only with the set of keys, so Cove does not re-register them on every
  // render; they reach the latest handlers through this ref.
  const handlers = useRef({ onAction, onFind, onSelectAll });
  useLayoutEffect(() => {
    handlers.current = { onAction, onFind, onSelectAll };
  });
  const keyed = Math.max(0, Math.min(actionCount, ACTION_KEYS.length));
  const hasFind = Boolean(onFind) && actionCount > 0;
  const hasSelectAll = surface === "local" && Boolean(onSelectAll);
  const bindings = useMemo(() => {
    // Until Cove re-registers a changed list, it forwards each registered key by position to the
    // latest list, so the keys whose presence rarely changes come first and more actions only
    // append: a stroke in between never reaches another key's handler.
    const list: KeyBinding[] = [];
    if (hasSelectAll)
      list.push({
        keys: SELECT_ALL_KEY,
        surface: "local",
        action: firstStrokeOnly(() => handlers.current.onSelectAll?.()),
      });
    if (hasFind)
      list.push({
        keys: FIND_ACTION_KEY,
        surface,
        action: firstStrokeOnly(() => handlers.current.onFind?.()),
      });
    ACTION_KEYS.slice(0, keyed).forEach((key, index) =>
      list.push(
        {
          keys: key,
          surface,
          action: firstStrokeOnly(() => handlers.current.onAction(index, false)),
        },
        {
          keys: `Shift+${key}`,
          surface,
          action: firstStrokeOnly(() => handlers.current.onAction(index, true)),
        },
      ),
    );
    return list;
  }, [surface, keyed, hasFind, hasSelectAll]);
  useKeySequence(bindings, enabled);
}

export interface ReviewKeyLabels {
  /** The key of the action at this position; "" past the last action key. */
  action(index: number): string;
  /** The key that opens Find action. */
  find: string;
  /** The key for grid select all, as shown. */
  selectAll: string;
}

const REVIEW_KEY_LABELS: ReviewKeyLabels = {
  action: (index) => ACTION_KEYS[index] ?? "",
  find: FIND_ACTION_KEY,
  selectAll: SELECT_ALL_KEY_LABEL,
};

/** The keys to show on buttons, the pad and Find action: the fixed keys useReviewKeys registers. */
export function useReviewKeyLabels(): ReviewKeyLabels {
  return REVIEW_KEY_LABELS;
}
