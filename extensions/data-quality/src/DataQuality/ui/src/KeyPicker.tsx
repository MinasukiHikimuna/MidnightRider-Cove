import {
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Pin } from "@cove/runtime/lucide-react";
import { KeyCap } from "./ActionPad";
import {
  ACTION_KEY_ROWS,
  NO_ACTION_KEY,
  actionKeyChoice,
  isActionKey,
  type ActionKeyChoice,
  type ActionKeyMap,
  type ReviewAction,
} from "./model";

/** Keys shown after b but never offered: they step through the grid preview. */
const PREVIEW_KEYS = ["n", "m"];
/** What the arrow keys move through: the offered keys by row, then Auto and No key. */
const NAVIGATION: ReadonlyArray<readonly ActionKeyChoice[]> = [
  ...ACTION_KEY_ROWS,
  ["auto", NO_ACTION_KEY],
];

/** "Q", as the key caps show it. */
function keyName(key: string): string {
  return key.toLocaleUpperCase();
}

/** The action's choice as it works: a pin that an earlier action holds as well acts as Auto. */
function effectiveChoice(
  actions: readonly ReviewAction[],
  keyMap: ActionKeyMap,
  index: number,
): ActionKeyChoice {
  return keyMap.duplicatePins.has(index) ? "auto" : actionKeyChoice(actions[index]);
}

/**
 * An action's key in its editor row, as a button that opens the key picker: a small keyboard map
 * where each key shows the action that holds it, pinned or placed by Auto, or nothing. Choosing a
 * key pins the action to it, and the action that held the key takes this one's pinned key (a swap)
 * or, without one, turns Auto (see withActionKey); Auto and No key are the other choices. Arrow
 * keys move between the choices, Enter chooses, Esc closes; focus then returns to this button.
 */
export function ActionKeyButton({
  actions,
  index,
  keyMap,
  name,
  onChoose,
}: {
  /** The review's actions, as edited. */
  actions: readonly ReviewAction[];
  /** The position of this row's action among them. */
  index: number;
  keyMap: ActionKeyMap;
  /** The action's name as its row shows it. */
  name: string;
  onChoose(choice: ActionKeyChoice): void;
}) {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const key = keyMap.keys[index];
  const choice = effectiveChoice(actions, keyMap, index);
  const pinned = isActionKey(choice);
  const takenPin = keyMap.duplicatePins.has(index)
    ? ` (${keyName(actions[index].shortcut ?? "")} is pinned twice)`
    : "";
  const state = key
    ? `${keyName(key)}, ${pinned ? "pinned" : "Auto"}${takenPin}`
    : choice === NO_ACTION_KEY
      ? "no key, Find action only"
      : `no key: Auto found no free key${takenPin}`;
  const close = () => {
    setOpen(false);
    button.current?.focus();
  };
  return (
    <>
      <button
        ref={button}
        type="button"
        className="dq-key-button"
        aria-label={`Key for ${name}: ${state}`}
        aria-haspopup="dialog"
        aria-expanded={open}
        title="Choose the key"
        onClick={() => setOpen(!open)}
      >
        {key ? <KeyCap binding={key} /> : <span className="dq-key dq-key-none">·</span>}
        {pinned && <Pin aria-hidden="true" />}
      </button>
      {open && (
        <KeyPicker
          actions={actions}
          index={index}
          keyMap={keyMap}
          name={name}
          onChoose={(next) => {
            onChoose(next);
            close();
          }}
          onClose={close}
        />
      )}
    </>
  );
}

function KeyPicker({
  actions,
  index,
  keyMap,
  name,
  onChoose,
  onClose,
}: {
  actions: readonly ReviewAction[];
  index: number;
  keyMap: ActionKeyMap;
  name: string;
  onChoose(choice: ActionKeyChoice): void;
  onClose(): void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const own = keyMap.keys[index];
  const choice = effectiveChoice(actions, keyMap, index);
  // The one key of the map in the Tab order; the arrow keys move it.
  const [gridKey, setGridKey] = useState(own || "q");
  const button = (value: string) =>
    panel.current?.querySelector<HTMLButtonElement>(`[data-choice="${value}"]`) ?? null;

  useLayoutEffect(() => {
    // The action's key has focus, or else its choice, Auto or No key.
    button(own || choice)?.focus();
    panel.current?.scrollIntoView?.({ block: "nearest" });
  }, []);

  function focusChoice(value: ActionKeyChoice) {
    if (isActionKey(value)) setGridKey(value);
    button(value)?.focus();
  }
  function handleKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      // Closes the picker only, not the drawer around it.
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key === "Tab") {
      // A dialog: Tab goes round its stops (the map's key, Auto, No key).
      const stops = [...(panel.current?.querySelectorAll<HTMLElement>("button[tabindex='0']") ?? [])];
      const at = stops.indexOf(document.activeElement as HTMLElement);
      event.preventDefault();
      stops[(at + (event.shiftKey ? -1 : 1) + stops.length) % stops.length]?.focus();
      return;
    }
    const current = (event.target as HTMLElement).dataset?.choice as ActionKeyChoice | undefined;
    const row = current ? NAVIGATION.findIndex((choices) => choices.includes(current)) : -1;
    if (!current || row < 0) return;
    const column = NAVIGATION[row].indexOf(current);
    // Up and down keep the column, or take the nearest one on a shorter row.
    const nearest = (target: readonly ActionKeyChoice[] | undefined) =>
      target?.[Math.min(column, target.length - 1)];
    const moves: Record<string, ActionKeyChoice | undefined> = {
      ArrowLeft: NAVIGATION[row][column - 1],
      ArrowRight: NAVIGATION[row][column + 1],
      ArrowUp: nearest(NAVIGATION[row - 1]),
      ArrowDown: nearest(NAVIGATION[row + 1]),
      Home: NAVIGATION[row][0],
      End: NAVIGATION[row].at(-1),
    };
    if (!Object.hasOwn(moves, event.key)) return;
    event.preventDefault();
    const next = moves[event.key];
    if (next) focusChoice(next);
  }

  const holder = (key: string) => {
    const at = isActionKey(key) ? keyMap.actionOn.get(key) : undefined;
    if (at === undefined) return null;
    return {
      own: at === index,
      label: actions[at].label.trim() || "New action",
      pinned: actionKeyChoice(actions[at]) === key,
    };
  };
  return (
    <>
      {/* A press outside closes the picker, leaving focus on the key button. */}
      <div
        className="dq-key-picker-backdrop"
        aria-hidden="true"
        onMouseDown={(event) => {
          event.preventDefault();
          onClose();
        }}
      />
      <div
        ref={panel}
        role="dialog"
        aria-label={`Key for ${name}`}
        className="dq-key-picker"
        onKeyDown={handleKey}
      >
        <p className="dq-key-picker-title">
          Key for <strong>{name}</strong>
        </p>
        <div className="dq-key-picker-keys" role="group" aria-label="Keys">
          {ACTION_KEY_ROWS.map((row, rowIndex) => (
            <div key={rowIndex} className="dq-key-picker-row" data-indent={rowIndex}>
              {row.map((key) => {
                const held = holder(key);
                const state = held
                  ? `${held.own ? "this action" : held.label}, ${held.pinned ? "pinned" : "Auto"}`
                  : "free";
                return (
                  <button
                    key={key}
                    type="button"
                    className={`dq-key-choice${held ? "" : " dq-key-choice-free"}${held?.own ? " dq-key-choice-own" : ""}`}
                    data-choice={key}
                    tabIndex={key === gridKey ? 0 : -1}
                    aria-label={`${keyName(key)}: ${state}`}
                    aria-pressed={Boolean(held?.own && held.pinned)}
                    title={held ? `${held.label} (${held.pinned ? "pinned" : "Auto"})` : undefined}
                    onFocus={() => setGridKey(key)}
                    onClick={() => onChoose(key)}
                  >
                    <span className="dq-key-choice-head">
                      <KeyCap binding={key} />
                      {held?.pinned && <Pin aria-hidden="true" />}
                    </span>
                    {held && <span className="dq-key-choice-label">{held.label}</span>}
                  </button>
                );
              })}
              {rowIndex === ACTION_KEY_ROWS.length - 1 &&
                PREVIEW_KEYS.map((key) => (
                  <button
                    key={key}
                    type="button"
                    className="dq-key-choice dq-key-choice-free"
                    aria-label={`${keyName(key)}: not available, it steps through the grid preview`}
                    title="Steps through the grid preview"
                    disabled
                  >
                    <span className="dq-key-choice-head">
                      <KeyCap binding={key} />
                    </span>
                  </button>
                ))}
            </div>
          ))}
        </div>
        <div className="dq-key-picker-choices">
          <button
            type="button"
            className="dq-key-picker-choice"
            data-choice="auto"
            tabIndex={0}
            aria-pressed={choice === "auto"}
            onClick={() => onChoose("auto")}
          >
            <strong>Auto</strong>
            <span>the next free key</span>
          </button>
          <button
            type="button"
            className="dq-key-picker-choice"
            data-choice={NO_ACTION_KEY}
            tabIndex={0}
            aria-pressed={choice === NO_ACTION_KEY}
            onClick={() => onChoose(NO_ACTION_KEY)}
          >
            <strong>No key</strong>
            <span>Find action only</span>
          </button>
          <p className="dq-key-picker-hint">
            The action on the key you choose takes this one&apos;s pinned key, or Auto.
          </p>
        </div>
      </div>
    </>
  );
}
