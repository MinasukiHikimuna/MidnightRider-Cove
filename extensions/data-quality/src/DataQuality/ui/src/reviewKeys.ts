import { useMemo } from "react";
import {
  useExtensionKeyboardBindings,
  useRegisterExtensionKeyboardActions,
  type ExtensionKeyboardActionRegistration,
  type KeyboardActionInvocation,
} from "@cove/runtime/components";
import { ACTION_KEYS } from "./model";

/**
 * Review keys run through Cove's keyboard system. The extension manifest declares one keyboard
 * action per action key ("Review action 1" … "Review action 27", bound to the key and Shift+key),
 * Find action (-) and Select all on page (Ctrl+A, ⌘A on a Mac); this module attaches the page's
 * handlers while it is mounted. Cove then resolves each key against its own shortcuts: a local
 * registration outranks the list, player and global ones, so f, g and k apply actions on this page
 * while their slot holds one, and a slot registered disabled leaves the key to Cove. Cove also
 * skips text entry and, while any dialog is open, every surface below its overlays. The keys a
 * user actually has come from Cove's active keyboard preset, which may rebind or unbind them.
 */
export const EXTENSION_ID = "com.midnightrider.data-quality";

export const FIND_ACTION_ID = "find-action";
export const SELECT_ALL_ID = "select-all";

/** The manifest id of the keyboard action for the action at this position. */
export function actionSlotId(index: number): string {
  return `action-${String(index + 1).padStart(2, "0")}`;
}

function lastStrokeHasShift(sequence: string): boolean {
  const stroke = sequence.split(" ").at(-1) ?? "";
  return stroke.split("+").includes("Shift");
}

/** Shift + an action key applies the action and stays on the item. */
export function staysOnItem(invocation: KeyboardActionInvocation): boolean {
  return lastStrokeHasShift(invocation.sequence);
}

export interface ReviewKeyHandlers {
  /**
   * "local" while the page itself takes keys; "overlay" for the grid preview, a dialog that
   * holds Cove's lower surfaces back.
   */
  surface: "local" | "overlay";
  /** Whether the keys belong to this view now; while false Cove keeps its own meaning. */
  enabled: boolean;
  /** How many of the review's actions exist; slots beyond them stay disabled. */
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
  const hasFind = Boolean(onFind);
  const hasSelectAll = surface === "local" && Boolean(onSelectAll);
  // Cove re-registers only when ids, surfaces or enablement change and always calls the latest
  // handlers, so these closures may change on every render.
  const registrations: ExtensionKeyboardActionRegistration[] = ACTION_KEYS.map(
    (_, index) => ({
      id: actionSlotId(index),
      surface,
      enabled: enabled && index < actionCount,
      action: (invocation: KeyboardActionInvocation) =>
        onAction(index, staysOnItem(invocation)),
    }),
  );
  registrations.push({
    id: FIND_ACTION_ID,
    surface,
    enabled: enabled && hasFind && actionCount > 0,
    action: () => onFind?.(),
  });
  if (hasSelectAll)
    registrations.push({
      id: SELECT_ALL_ID,
      surface: "local",
      enabled,
      action: () => onSelectAll?.(),
    });
  useRegisterExtensionKeyboardActions(EXTENSION_ID, registrations);
}

/** Cove reads ⌘ as Ctrl, so the one binding covers both. */
export const SELECT_ALL_KEY_LABEL = "Ctrl/⌘A";

export interface ReviewKeyLabels {
  /** The key shown for the action at this position; "" when it has none. */
  action(index: number): string;
  /** The key that opens Find action; "" when it has none. */
  find: string;
  /** The key for grid select all; "" when it has none. */
  selectAll: string;
  /**
   * True when every key this review's actions would use is unbound in Cove's active preset, for
   * example a personal preset copied before these keys existed: then no action key works at all.
   */
  allUnbound(actionCount: number): boolean;
}

/**
 * The keys to show, from Cove's active keyboard preset. Rebound keys show as rebound; an unbound
 * action shows no key. Before Cove reports a binding, the defaults stand in.
 */
export function useReviewKeyLabels(): ReviewKeyLabels {
  const bindings = useExtensionKeyboardBindings(EXTENSION_ID);
  return useMemo(() => {
    const label = (id: string, fallback: string) => {
      const alternatives = bindings[id];
      if (!alternatives) return fallback;
      return (
        alternatives.find((binding) => !lastStrokeHasShift(binding)) ??
        alternatives[0] ??
        ""
      );
    };
    const action = (index: number) =>
      index < ACTION_KEYS.length ? label(actionSlotId(index), ACTION_KEYS[index]) : "";
    const selectAll = label(SELECT_ALL_ID, "Ctrl+a");
    return {
      action,
      find: label(FIND_ACTION_ID, "-"),
      selectAll: selectAll === "Ctrl+a" ? SELECT_ALL_KEY_LABEL : selectAll,
      allUnbound: (actionCount: number) => {
        const keyed = Math.min(actionCount, ACTION_KEYS.length);
        return keyed > 0 && Array.from({ length: keyed }, (_, index) => action(index)).every((key) => !key);
      },
    };
  }, [bindings]);
}
