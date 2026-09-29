import {
  useId,
  useMemo,
  useSyncExternalStore,
  type FocusEvent as ReactFocusEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Ban, Check, Pencil, Pin, Search } from "@cove/runtime/lucide-react";
import {
  actionGroups,
  answersGroup,
  groupStatus,
  openGroups,
  type ActionGroup,
  type GroupStatus,
} from "./answerGroups";
import { actionEffectParts } from "./FindAction";
import { previewActionEffect, type TagTrees } from "./effectPreview";
import {
  ACTION_KEY_ROWS,
  canApplyAndStay,
  type ActionKey,
  type ActionKeyMap,
  type MediaKind,
  type MediaReviewAction,
} from "./model";
import { useActionKeyMap, useReviewKeyLabels } from "./reviewKeys";
import type { TagState } from "./reviewTags";
import { useTagNames } from "./tagNames";
import { useMobileLayout } from "./viewport";

/**
 * The action being previewed: the pad or bar tile under the pointer or with focus. It lives
 * outside React state so hovering along the tiles re-renders only the effect line (and, in the
 * single-item workspace, the tag chips), not the whole view and its player.
 */
export interface ActionPreviewStore<A = MediaReviewAction> {
  get(): A | null;
  set(action: A | null): void;
  /** Clears the preview only while it still shows this action. */
  clear(action: A): void;
  subscribe(listener: () => void): () => void;
}

export function createActionPreviewStore<A = MediaReviewAction>(): ActionPreviewStore<A> {
  let current: A | null = null;
  const listeners = new Set<() => void>();
  const set = (action: A | null) => {
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

export function useActionPreview<A>(store: ActionPreviewStore<A>): A | null {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

/**
 * The preview handlers of a phone-sized button: a mouse pointing at it or focus on it shows what
 * it does, a touch never does. Touch has no hover to end a preview, and on iOS a page that changes
 * as a tap "hovers" a button can swallow that tap.
 */
export function mobilePreviewHandlers<A>(preview: ActionPreviewStore<A>, action: A) {
  return {
    onPointerEnter: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") preview.set(action);
    },
    onPointerLeave: (event: ReactPointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse") preview.clear(action);
    },
    onFocus: () => preview.set(action),
    onBlur: () => preview.clear(action),
  };
}

/** The pad's keyboard rows: q…å, a…ä, then z…b followed by keys that apply no action. */
const ROWS: ReadonlyArray<{ indent: number; keys: readonly ActionKey[]; fixed: readonly string[] }> =
  ACTION_KEY_ROWS.map((keys, indent) => ({
    indent,
    keys,
    fixed: indent === 2 ? ["n", "m", ",", "."] : [],
  }));

/**
 * What a key that applies no action still does in the single-item review: with a video, Cove's
 * player mutes on m (Cove Native preset). Empty action keys do nothing there, f, g and k
 * included, so none of them is labelled.
 */
function coveKeyLabel(key: string, mediaKind: MediaKind): string {
  return mediaKind === "video" && key === "m" ? "Mute" : "";
}

/**
 * One key cap; single characters show in upper case, as printed on a keyboard. Hidden from
 * assistive technology where the control names its key through aria-keyshortcuts instead.
 */
export function KeyCap({ binding, hidden }: { binding: string; hidden?: boolean }) {
  return (
    <kbd
      className={Array.from(binding).length === 1 ? "dq-key dq-key-letter" : "dq-key"}
      aria-hidden={hidden || undefined}
    >
      {binding}
    </kbd>
  );
}

function hasAbsence(action: MediaReviewAction): boolean {
  return action.steps.some((step) => step.mode === "MARK_ABSENT");
}

/**
 * The positions of the actions that have a key, one list per keyboard row that holds any, in key
 * order: the grid bar's lines and the groups of the phone-sized layout.
 */
export function actionsByKeyRow(keyMap: ActionKeyMap): number[][] {
  return ACTION_KEY_ROWS.map((row) => row.flatMap((key) => keyMap.actionOn.get(key) ?? [])).filter(
    (group) => group.length > 0,
  );
}

/**
 * Phone-sized windows (see viewport.ts): the actions as a plain grid of touch-sized buttons,
 * without key caps or empty keys, in key order, with a wider gap between the keyboard rows' groups
 * so the grouping that pinned keys give still reads. Find closes the last group; it also stands
 * alone when no action has a key.
 */
export function MobileActionGroups({
  groups,
  renderAction,
  find,
}: {
  groups: ReadonlyArray<readonly number[]>;
  renderAction(index: number): ReactNode;
  find: ReactNode;
}) {
  const shown = groups.length ? groups : [[]];
  return (
    <>
      {shown.map((group, position) => (
        <div key={position} className="dq-mobile-group">
          {group.map(renderAction)}
          {position === shown.length - 1 && find}
        </div>
      ))}
    </>
  );
}

/**
 * Find action as a phone-sized button: named Find, as it reads, without the - key's cap, and
 * counting the actions only Find reaches.
 */
export function MobileFindButton({
  extra,
  findKey,
  disabled,
  onFind,
}: {
  /** How many actions have no key. */
  extra: number;
  findKey: string;
  disabled: boolean;
  onFind(): void;
}) {
  return (
    <button
      type="button"
      className="dq-mobile-tile dq-mobile-find"
      aria-label={extra > 0 ? `Find, ${extra} more` : "Find"}
      aria-keyshortcuts={findKey}
      disabled={disabled}
      onClick={onFind}
    >
      <span className="dq-mobile-find-name">
        <Search aria-hidden="true" />
        Find
      </span>
      {extra > 0 && <span className="dq-mobile-more">{extra} more</span>}
    </button>
  );
}

/**
 * The review's answer groups on the item on screen (answerGroups.ts): each group's name, then a
 * check and the answer the item holds, or a ring while the group is still open. Until the item's
 * tags are known it lists the names alone.
 */
function GroupChecklist({
  groups,
  statuses,
  actions,
}: {
  groups: readonly ActionGroup[];
  /** Null while the item's tags load. */
  statuses: readonly GroupStatus[] | null;
  actions: readonly MediaReviewAction[];
}) {
  return (
    <ul
      className="dq-group-checklist"
      aria-label="Answer groups"
      title="A plain action moves on once every group has an answer"
    >
      {(statuses ?? groups).map((group) => {
        const answers = statuses ? (group as GroupStatus).answers : null;
        const state = !answers ? "unknown" : answers.length ? "answered" : "open";
        return (
          <li key={group.key} className="dq-group" data-state={state}>
            <span className="dq-group-name">{group.name}</span>
            {state === "answered" && (
              <>
                <Check aria-hidden="true" />
                <span className="dq-sr-only">, answered:</span>{" "}
                <span className="dq-group-answer">
                  {answers!.map((index) => actions[index].label).join(", ")}
                </span>
              </>
            )}
            {state === "open" && (
              <>
                <span className="dq-group-ring" aria-hidden="true" />
                <span className="dq-sr-only">, not answered yet</span>
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Phone-sized windows: touch has neither Shift nor the hover pin, so while this switch is on a
 * tapped action applies and stays on the item. It is not remembered, and keys keep their meaning.
 */
function StaySwitch({ checked, onChange }: { checked: boolean; onChange(checked: boolean): void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className="dq-stay-switch"
      onClick={() => onChange(!checked)}
    >
      <span className="dq-stay-track" aria-hidden="true" />
      Stay on this item
    </button>
  );
}

/**
 * Review actions laid out like the keyboard: each action sits on its key's place (actionKeyMap),
 * so the pad mirrors the hand position, with empty keys between them. Rows without any action are
 * left out; the bottom row also carries Find action, which counts the actions without a key.
 * Hovering or focusing a tile previews its effect above the pad and on the current tags. Phone-sized
 * windows get plain groups of buttons instead (MobileActionGroups) and the Stay on this item switch.
 * A review that waits for its answer groups shows them as a checklist in the header (above the
 * buttons on phones) and marks the actions of the groups still open.
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
  paused = false,
  waitForGroups = false,
  stayOnTap = false,
  onStayOnTapChange,
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
  /** The review is being edited: the pad says so and dims its tiles, which stay disabled. */
  paused?: boolean;
  /**
   * The review stays on an item until every answer group is answered: the pad lists the groups
   * with the item's answers and marks the actions of the open ones.
   */
  waitForGroups?: boolean;
  /** Phone-sized windows: a tapped action applies and stays (the Stay on this item switch). */
  stayOnTap?: boolean;
  /** Turns Stay on this item on or off; without it phone-sized windows show no switch. */
  onStayOnTapChange?(stay: boolean): void;
}) {
  const keys = useReviewKeyLabels();
  const keyMap = useActionKeyMap(actions);
  const mobile = useMobileLayout();
  const baseId = useId();
  const names = useTagNames(
    useMemo(() => actions.flatMap((item) => item.steps.flatMap((step) => step.tagIds)), [actions]),
  );
  const rows = ROWS.filter((row) => row.keys.some((key) => keyMap.actionOn.has(key)));
  const bottomRow = rows.includes(ROWS[2]);
  const extra = actions.length - keyMap.actionOn.size;
  // Answer groups, while the review waits for them and is not being edited.
  const answerGroups = useMemo(
    () => (waitForGroups && !paused ? actionGroups(actions) : []),
    [waitForGroups, paused, actions],
  );
  const statuses = useMemo(
    () => (answerGroups.length && tags ? groupStatus(actions, tags) : null),
    [answerGroups, actions, tags],
  );
  // Each action that can answer a group still open, with that group's name.
  const openGroupOf = new Map(
    openGroups(statuses ?? []).flatMap((group) =>
      group.actions
        .filter((index) => answersGroup(actions[index]))
        .map((index) => [index, group.name] as const),
    ),
  );
  const checklist = answerGroups.length > 0 && (
    <GroupChecklist groups={answerGroups} statuses={statuses} actions={actions} />
  );
  /** What the action changes, read out with its tile or button, and whose open group it answers. */
  const description = (index: number): string => {
    const effect = actionEffectParts(actions[index], names, [], trees)
      .map((part) => part.text)
      .join(", ");
    const group = openGroupOf.get(index);
    return group === undefined ? effect : `${effect}. ${group}: not answered yet`;
  };

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

  const tile = (binding: ActionKey): ReactNode => {
    const index = keyMap.actionOn.get(binding);
    const action = index === undefined ? undefined : actions[index];
    if (!action)
      return (
        <div
          key={binding}
          className="dq-pad-slot dq-pad-free"
          aria-hidden="true"
          title="No action on this key: it does nothing here"
        >
          <KeyCap binding={binding} />
        </div>
      );
    const disabled = isDisabled(action);
    const effectId = `${baseId}-effect-${binding}`;
    return (
      <div key={binding} className="dq-pad-slot" {...(paused ? {} : previewHandlers(action))}>
        {/* What the action changes, read out with the tile (the line above the pad is visual). */}
        <span id={effectId} className="dq-sr-only">
          {description(index!)}
        </span>
        <button
          type="button"
          className="dq-pad-tile"
          title={action.label}
          aria-keyshortcuts={binding}
          aria-describedby={effectId}
          data-group-open={openGroupOf.has(index!) || undefined}
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
        {canApplyAndStay(action) && (
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

  const pausedNote = (
    <p className="dq-pad-paused-note">
      <Pencil aria-hidden="true" />
      Actions are paused while you edit the review
    </p>
  );

  if (mobile) {
    const groups = actionsByKeyRow(keyMap);
    const mobileTile = (index: number): ReactNode => {
      const action = actions[index];
      const binding = keyMap.keys[index];
      return (
        <button
          key={binding}
          type="button"
          className="dq-mobile-tile"
          title={action.label}
          aria-keyshortcuts={binding}
          aria-describedby={`${baseId}-effect-${binding}`}
          data-group-open={openGroupOf.has(index) || undefined}
          disabled={isDisabled(action)}
          onClick={(event) => {
            // A tap that focused the button leaves no preview behind for the next item.
            preview.clear(action);
            onApply(action, event.shiftKey || (stayOnTap && canApplyAndStay(action)));
          }}
          {...(paused ? {} : mobilePreviewHandlers(preview, action))}
        >
          <span className="dq-mobile-label">{action.label}</span>
          {hasAbsence(action) && " "}
          {hasAbsence(action) && (
            <span className="dq-pad-marker">
              <Ban aria-hidden="true" />
              absent
            </span>
          )}
        </button>
      );
    };
    return (
      <section
        className={`dq-pad dq-pad-mobile${paused ? " dq-pad-paused" : ""}`}
        aria-label={paused ? "Actions, paused while editing" : "Actions"}
        aria-busy={busy || undefined}
      >
        <div className="dq-pad-header">
          {paused ? (
            pausedNote
          ) : (
            <PadEffectLine
              actions={actions}
              keyMap={keyMap}
              names={names}
              tags={tags}
              trees={trees}
              preview={preview}
              findKey={keys.find}
              mobile
            />
          )}
          {onStayOnTapChange && <StaySwitch checked={stayOnTap} onChange={onStayOnTapChange} />}
        </div>
        {checklist}
        <div className="dq-mobile-actions">
          <MobileActionGroups
            groups={groups}
            renderAction={mobileTile}
            find={
              <MobileFindButton
                extra={extra}
                findKey={keys.find}
                disabled={findDisabled}
                onFind={onFind}
              />
            }
          />
        </div>
        {/* What each action changes, read out with its button; the line above is visual. */}
        <div hidden>
          {groups.flat().map((index) => (
            <span key={index} id={`${baseId}-effect-${keyMap.keys[index]}`}>
              {description(index)}
            </span>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      className={`dq-pad${paused ? " dq-pad-paused" : ""}`}
      aria-label={paused ? "Actions, paused while editing" : "Actions"}
      aria-busy={busy || undefined}
    >
      <div className="dq-pad-header">
        {paused ? (
          pausedNote
        ) : (
          <>
            <PadEffectLine
              actions={actions}
              keyMap={keyMap}
              names={names}
              tags={tags}
              trees={trees}
              preview={preview}
              findKey={keys.find}
            />
            {checklist}
            <span className="dq-pad-hint">
              <kbd className="dq-key">Shift</kbd>
              <span>+ key applies and stays</span>
            </span>
          </>
        )}
        {!bottomRow && (
          <button
            type="button"
            className="dq-pad-find-button"
            aria-label={extra ? `Find action, ${extra} more` : "Find action"}
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
          {row.keys.map(tile)}
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
 * or how many actions there are and how many only Find action reaches. Phone-sized windows show
 * no keys: the count alone, and the effect without its key cap.
 */
function PadEffectLine({
  actions,
  keyMap,
  names,
  tags,
  trees,
  preview,
  findKey,
  mobile = false,
}: {
  actions: readonly MediaReviewAction[];
  keyMap: ActionKeyMap;
  names: Record<number, string | null>;
  tags: TagState | null;
  trees: TagTrees;
  preview: ActionPreviewStore;
  findKey: string;
  mobile?: boolean;
}) {
  const action = useActionPreview(preview);
  const index = action ? actions.indexOf(action) : -1;
  if (!action || index < 0) {
    const keyed = keyMap.actionOn.size;
    return (
      <p className="dq-pad-effect dq-pad-summary">
        {actions.length === 1 ? "1 action" : `${actions.length} actions`}
        {!mobile && keyed < actions.length && (
          <>
            {` · ${keyed} on keys, ${actions.length - keyed} more under `}
            <KeyCap binding={findKey} />
          </>
        )}
      </p>
    );
  }
  const binding = keyMap.keys[index];
  const effect = tags && action.steps.length ? previewActionEffect(action, tags, trees) : null;
  const unchanged =
    effect &&
    !effect.unresolvedTrees.length &&
    ![effect.added, effect.removed, effect.markedAbsent, effect.absenceCleared].some(
      (ids) => ids.length,
    );
  return (
    <p className="dq-pad-effect">
      {binding && !mobile && <KeyCap binding={binding} />}
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
