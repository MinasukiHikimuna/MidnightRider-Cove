import {
  useId,
  useMemo,
  useSyncExternalStore,
  type FocusEvent as ReactFocusEvent,
  type ReactNode,
} from "react";
import { Ban, Pin, Search } from "@cove/runtime/lucide-react";
import { actionEffectParts } from "./FindAction";
import { previewActionEffect, type TagTrees } from "./effectPreview";
import {
  ACTION_KEYS,
  type MediaKind,
  type MediaReviewAction,
} from "./model";
import { useReviewKeyLabels } from "./reviewKeys";
import type { TagState } from "./reviewTags";
import { useTagNames } from "./tagNames";

/**
 * The action being previewed: the pad tile under the pointer or with focus. It lives outside
 * React state so hovering along the pad re-renders only the effect line and the tag chips, not
 * the whole workspace and its player.
 */
export interface ActionPreviewStore {
  get(): MediaReviewAction | null;
  set(action: MediaReviewAction | null): void;
  /** Clears the preview only while it still shows this action. */
  clear(action: MediaReviewAction): void;
  subscribe(listener: () => void): () => void;
}

export function createActionPreviewStore(): ActionPreviewStore {
  let current: MediaReviewAction | null = null;
  const listeners = new Set<() => void>();
  const set = (action: MediaReviewAction | null) => {
    if (action === current) return;
    current = action;
    listeners.forEach((listener) => listener());
  };
  return {
    get: () => current,
    set,
    clear: (action) => {
      if (current === action) set(null);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export function useActionPreview(store: ActionPreviewStore): MediaReviewAction | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/** The pad's keyboard rows, by action slot: q…å, a…ä, then z…b followed by the fixed keys. */
const ROWS = [
  { indent: 0, slots: range(0, 11), fixed: [] },
  { indent: 1, slots: range(11, 22), fixed: [] },
  { indent: 2, slots: range(22, 27), fixed: ["n", "m", ",", "."] },
] as const;

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, index) => start + index);
}

/**
 * What an unassigned key still does in Cove on this page: an empty slot's key is not registered,
 * so it keeps Cove's own meaning (with a video on screen, f opens Filters and toggles
 * fullscreen, which is why Cove reports a conflict for it). These are the Cove Native preset's
 * keys; extensions cannot read Cove's own bindings, so other presets may differ.
 */
function coveKeyLabel(key: string, mediaKind: MediaKind): string {
  if (key === "g") return "Go to…";
  if (key === "f") return mediaKind === "video" ? "Fullscreen · filters" : "Filters";
  if (mediaKind === "video" && key === "k") return "Play / pause";
  if (mediaKind === "video" && key === "m") return "Mute";
  return "";
}

/** One key cap; single characters show in upper case, as printed on a keyboard. */
function KeyCap({ binding }: { binding: string }) {
  return (
    <kbd className={Array.from(binding).length === 1 ? "dq-key dq-key-letter" : "dq-key"}>
      {binding}
    </kbd>
  );
}

function hasAbsence(action: MediaReviewAction): boolean {
  return action.steps.some((step) => step.mode === "MARK_ABSENT");
}

/**
 * Review actions laid out like the keyboard: action N sits on its key's place, so the pad mirrors
 * the hand position. Rows without any action are left out; the bottom row also carries Find
 * action for the actions past the last key. Hovering or focusing a tile previews its effect above
 * the pad and on the current tags.
 */
export function ActionPad({
  actions,
  mediaKind,
  isDisabled,
  busy,
  tags,
  trees,
  preview,
  onApply,
  onFind,
  findDisabled,
}: {
  actions: readonly MediaReviewAction[];
  mediaKind: MediaKind;
  isDisabled(action: MediaReviewAction): boolean;
  /** A write or load is running: tiles refuse input without fading. */
  busy: boolean;
  /** The current item's tags, to say when the previewed action would change nothing. */
  tags: TagState | null;
  trees: TagTrees;
  preview: ActionPreviewStore;
  onApply(action: MediaReviewAction, stay: boolean): void;
  onFind(): void;
  findDisabled: boolean;
}) {
  const keys = useReviewKeyLabels();
  const baseId = useId();
  const names = useTagNames(
    useMemo(() => actions.flatMap((item) => item.steps.flatMap((step) => step.tagIds)), [actions]),
  );
  const rows = ROWS.filter((row) => row.slots.some((slot) => slot < actions.length));
  const bottomRow = rows.length === ROWS.length;
  const extra = Math.max(0, actions.length - ACTION_KEYS.length);

  const previewHandlers = (action: MediaReviewAction) => ({
    onMouseEnter: () => preview.set(action),
    onMouseLeave: () => preview.clear(action),
    onFocus: () => preview.set(action),
    onBlur: (event: ReactFocusEvent<HTMLElement>) => {
      // Moving between a tile and its pin button keeps the preview.
      if (!event.currentTarget.contains(event.relatedTarget as Node | null))
        preview.clear(action);
    },
  });

  const tile = (slot: number): ReactNode => {
    const action = actions[slot];
    const binding = keys.action(slot);
    if (!action) {
      const label = coveKeyLabel(binding, mediaKind);
      return (
        <div
          key={slot}
          className={`dq-pad-slot dq-pad-free${label ? " dq-pad-reserved" : ""}`}
          aria-hidden="true"
        >
          <KeyCap binding={binding} />
          {label && <span className="dq-pad-label">{label}</span>}
        </div>
      );
    }
    const disabled = isDisabled(action);
    const effectId = `${baseId}-effect-${slot}`;
    return (
      <div key={slot} className="dq-pad-slot" {...previewHandlers(action)}>
        {/* What the action changes, read out with the tile (the line above the pad is visual). */}
        <span id={effectId} className="dq-sr-only">
          {actionEffectParts(action, names, [], trees)
            .map((part) => part.text)
            .join(", ")}
        </span>
        <button
          type="button"
          className="dq-pad-tile"
          title={action.label}
          aria-keyshortcuts={binding}
          aria-describedby={effectId}
          disabled={disabled}
          onClick={(event) => onApply(action, event.shiftKey)}
        >
          {/* The spaces keep the accessible name readable: "q Observation absent". */}
          <KeyCap binding={binding} />{" "}
          <span className="dq-pad-label">{action.label}</span>
          {hasAbsence(action) && " "}
          {hasAbsence(action) && (
            <span className="dq-pad-marker">
              <Ban aria-hidden="true" />
              absent
            </span>
          )}
        </button>
        {action.steps.length > 0 && (
          <button
            type="button"
            className="dq-pad-pin"
            aria-label={`Apply and stay: ${action.label}`}
            title="Apply and stay (Shift)"
            disabled={disabled}
            onClick={() => onApply(action, true)}
          >
            <Pin aria-hidden="true" />
          </button>
        )}
      </div>
    );
  };

  return (
    <section className="dq-pad" aria-label="Actions" aria-busy={busy || undefined}>
      <div className="dq-pad-header">
        <PadEffectLine
          actions={actions}
          names={names}
          tags={tags}
          trees={trees}
          preview={preview}
          extra={extra}
          findKey={keys.find}
        />
        <span className="dq-pad-hint">
          <kbd className="dq-key">Shift</kbd>
          <span>+ key applies and stays</span>
        </span>
        {!bottomRow && (
          <button
            type="button"
            className="dq-pad-find-button"
            aria-label="Find action"
            aria-keyshortcuts={keys.find}
            disabled={findDisabled}
            onClick={onFind}
          >
            <KeyCap binding={keys.find} />
            <span aria-hidden="true">Find action</span>
          </button>
        )}
      </div>
      {rows.map((row) => (
        <div key={row.indent} className="dq-pad-row" data-indent={row.indent}>
          {row.slots.map(tile)}
          {row.fixed.map((key) => {
            const label = coveKeyLabel(key, mediaKind);
            return (
              <div
                key={key}
                className={`dq-pad-slot dq-pad-free dq-pad-fixed${label ? " dq-pad-reserved" : ""}`}
                aria-hidden="true"
              >
                <KeyCap binding={key} />
                {label && <span className="dq-pad-label">{label}</span>}
              </div>
            );
          })}
          {row.fixed.length > 0 && (
            <div className="dq-pad-slot">
              <button
                type="button"
                className="dq-pad-tile dq-pad-find"
                aria-label={extra ? `Find action, ${extra} more` : "Find action"}
                aria-keyshortcuts={keys.find}
                disabled={findDisabled}
                onClick={onFind}
              >
                <KeyCap binding={keys.find} />
                <span className="dq-pad-label">
                  <Search aria-hidden="true" />
                  {extra ? `${extra} more` : "Find action"}
                </span>
              </button>
            </div>
          )}
        </div>
      ))}
    </section>
  );
}

/**
 * Above the pad: what the previewed action does ("R Blonde + Blonde − rest of Hair colour"),
 * or how many actions there are and how many only Find action reaches.
 */
function PadEffectLine({
  actions,
  names,
  tags,
  trees,
  preview,
  extra,
  findKey,
}: {
  actions: readonly MediaReviewAction[];
  names: Record<number, string | null>;
  tags: TagState | null;
  trees: TagTrees;
  preview: ActionPreviewStore;
  extra: number;
  findKey: string;
}) {
  const keys = useReviewKeyLabels();
  const action = useActionPreview(preview);
  const index = action ? actions.indexOf(action) : -1;
  if (!action || index < 0)
    return (
      <p className="dq-pad-effect dq-pad-summary">
        {actions.length === 1 ? "1 action" : `${actions.length} actions`}
        {extra > 0 && (
          <>
            {` · ${ACTION_KEYS.length} on keys, ${extra} more under `}
            <KeyCap binding={findKey} />
          </>
        )}
      </p>
    );
  const binding = keys.action(index);
  const effect = tags && action.steps.length ? previewActionEffect(action, tags, trees) : null;
  const unchanged =
    effect &&
    !effect.unresolvedTrees.length &&
    ![effect.added, effect.removed, effect.markedAbsent, effect.absenceCleared].some(
      (ids) => ids.length,
    );
  return (
    <p className="dq-pad-effect">
      {binding && <KeyCap binding={binding} />}
      <strong>{action.label}</strong>
      {actionEffectParts(action, names, [], trees).map((part, position) => (
        <span key={position} data-effect-tone={part.tone}>
          {part.text}
        </span>
      ))}
      {unchanged && <span className="dq-pad-unchanged">· already so here</span>}
    </p>
  );
}
