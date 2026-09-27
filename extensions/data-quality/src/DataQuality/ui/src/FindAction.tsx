import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { Search } from "@cove/runtime/lucide-react";
import type { TagTrees } from "./effectPreview";
import { tagsAddedBy, type ReviewAction, type ReviewStep } from "./model";
import { useReviewKeyLabels } from "./reviewKeys";
import { useTagNames } from "./tagNames";

export interface EffectPart {
  text: string;
  tone: "add" | "remove" | "assess" | "neutral";
}

function stepPart(mode: ReviewStep["mode"], name: string, spares = false): EffectPart {
  switch (mode) {
    case "ADD":
      return { text: `+ ${name}`, tone: "add" };
    case "REMOVE":
      return { text: `− ${name}`, tone: "remove" };
    case "REMOVE_TREE":
      // A tree removal spares the tags the same action adds, so it clears "the rest" of the tree.
      return { text: spares ? `− rest of ${name}` : `− ${name} tree`, tone: "remove" };
    case "MARK_PRESENT":
      return { text: `Mark ${name} present`, tone: "assess" };
    case "MARK_ABSENT":
      return { text: `Mark ${name} absent`, tone: "assess" };
    case "CLEAR_ABSENCE":
      return { text: `Clear ${name} absence`, tone: "neutral" };
  }
}

/**
 * A short account of what an action changes, one part per tag: "+" adds, "−" removes, and
 * assessments say so in words, so the summary never depends on colour. With the resolved
 * removal trees, a tree removal that spares a tag the action adds reads "− rest of <tree>".
 */
export function actionEffectParts(
  action: ReviewAction,
  tagNames: Record<number, string | null>,
  tagGroups: ReadonlyArray<{ id: number; name: string }> = [],
  trees?: TagTrees,
): EffectPart[] {
  if ("effect" in action) {
    const effect = action.effect;
    if (effect.mode === "SKIP") return [{ text: "Skip", tone: "neutral" }];
    if (effect.mode === "CLEAR_TAG_GROUP")
      return [{ text: "Set Ungrouped", tone: "neutral" }];
    const group = tagGroups.find((item) => item.id === effect.tagGroupId);
    return [
      {
        text: group ? `Assign ${group.name}` : "Unavailable tag group",
        tone: "neutral",
      },
    ];
  }
  if (!action.steps.length) return [{ text: "Skip", tone: "neutral" }];
  const kept = tagsAddedBy(action);
  const spares = (parent: number) =>
    kept.has(parent) || [...kept].some((id) => trees?.get(parent)?.includes(id));
  return action.steps.flatMap((step) =>
    step.tagIds.map((id) =>
      stepPart(
        step.mode,
        tagNames[id] === undefined ? "…" : (tagNames[id] ?? "Unavailable tag"),
        step.mode === "REMOVE_TREE" && spares(id),
      ),
    ),
  );
}

function actionTagIds(actions: readonly ReviewAction[]): number[] {
  return actions.flatMap((action) =>
    "steps" in action ? action.steps.flatMap((step) => step.tagIds) : [],
  );
}

/**
 * Find action: type part of an action's name, choose with ↑/↓, Enter applies and advances,
 * Shift+Enter applies and stays where the view can stay, Esc closes. Lists every action, keyed or
 * not, so actions past the 27 action keys stay reachable from the keyboard.
 */
export function FindAction({
  actions,
  tagGroups,
  trees,
  isDisabled,
  canStay = true,
  onApply,
  onClose,
}: {
  actions: readonly ReviewAction[];
  tagGroups?: ReadonlyArray<{ id: number; name: string }>;
  /** Resolved removal trees, for "− rest of <tree>" wording. */
  trees?: TagTrees;
  isDisabled?(action: ReviewAction): boolean;
  /** False where applying always moves on (the grid and its preview). */
  canStay?: boolean;
  onApply(action: ReviewAction, stay: boolean): void;
  onClose(): void;
}) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<Element | null>(null);
  const host = useRef<HTMLElement | null>(null);
  const baseId = useId();
  const tagNames = useTagNames(useMemo(() => actionTagIds(actions), [actions]));
  const keys = useReviewKeyLabels();
  const rows = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return actions
      .map((action, index) => ({ action, index, key: keys.action(index) }))
      .filter((row) => !needle || row.action.label.toLocaleLowerCase().includes(needle));
  }, [actions, keys, query]);
  const active = rows.length ? Math.min(highlight, rows.length - 1) : -1;
  const optionId = (index: number) => `${baseId}-option-${index}`;

  useLayoutEffect(() => {
    opener.current = document.activeElement;
    // Inside the grid preview, the preview keeps its own keys only while it holds focus.
    host.current =
      root.current?.parentElement?.closest<HTMLElement>('[role="dialog"]') ?? null;
    input.current?.focus({ preventScroll: true });
    return () => {
      const previous = opener.current;
      if (previous instanceof HTMLElement && previous.isConnected)
        previous.focus({ preventScroll: true });
      // The opener may have gone or been disabled by the action just applied.
      if (document.activeElement !== previous && host.current?.isConnected)
        host.current.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (active < 0) return;
    list.current
      ?.querySelector<HTMLElement>(`[id="${optionId(rows[active].index)}"]`)
      ?.scrollIntoView?.({ block: "nearest" });
  }, [active, rows]);

  function apply(row: (typeof rows)[number] | undefined, stay: boolean) {
    if (!row || isDisabled?.(row.action)) return;
    onApply(row.action, canStay && stay);
  }
  function handleKey(event: ReactKeyboardEvent<HTMLElement>) {
    // Every key typed here belongs to Find action, not to the page or player behind it.
    event.stopPropagation();
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (!event.repeat) apply(rows[active], event.shiftKey);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!rows.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      setHighlight((active + step + rows.length) % rows.length);
    } else if (event.key === "Tab") {
      // The list is chosen with the arrow keys; keep focus in the search field.
      event.preventDefault();
      input.current?.focus();
    }
  }

  return (
    <>
      <div className="dq-find-backdrop" aria-hidden="true" onMouseDown={onClose} />
      <div
        ref={root}
        role="dialog"
        aria-label="Find an action"
        className="dq-find-action"
        onKeyDown={handleKey}
        // A click anywhere in the panel, even on a disabled row or the hints, keeps typing,
        // the arrow keys and Esc in the search field.
        onMouseDown={(event) => {
          if (event.target !== input.current) event.preventDefault();
        }}
      >
        <label className="dq-find-search">
          <Search aria-hidden="true" />
          <input
            ref={input}
            type="text"
            role="combobox"
            aria-label="Find an action"
            aria-autocomplete="list"
            aria-expanded="true"
            aria-controls={`${baseId}-list`}
            aria-activedescendant={active >= 0 ? optionId(rows[active].index) : undefined}
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setHighlight(0);
            }}
          />
          <kbd aria-hidden="true">Esc</kbd>
        </label>
        {rows.length ? (
          <ul
            ref={list}
            id={`${baseId}-list`}
            role="listbox"
            aria-label="Review actions"
            className="dq-find-list"
          >
            {rows.map((row, position) => (
              <li key={row.action.id} role="none">
                <button
                  type="button"
                  role="option"
                  id={optionId(row.index)}
                  tabIndex={-1}
                  aria-selected={position === active}
                  disabled={isDisabled?.(row.action) ?? false}
                  onClick={(event) => apply(row, event.shiftKey)}
                >
                  {row.key ? (
                    <kbd>{row.key}</kbd>
                  ) : (
                    <span className="dq-find-no-key" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <span className="dq-find-label">{row.action.label}</span>
                  <span className="dq-find-effect">
                    {actionEffectParts(row.action, tagNames, tagGroups, trees).map(
                      (part, index) => (
                        <span key={index} data-effect-tone={part.tone}>
                          {part.text}
                        </span>
                      ),
                    )}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dq-find-empty" role="status">
            No action matches “{query.trim()}”.
          </p>
        )}
        <p className="dq-find-hints" aria-hidden="true">
          <span>
            <kbd>Enter</kbd> applies
          </span>
          {canStay && (
            <span>
              <kbd>Shift</kbd>
              <kbd>Enter</kbd> applies and stays
            </span>
          )}
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> choose
          </span>
        </p>
      </div>
    </>
  );
}

/** The button that opens Find action with the mouse; its key (-) does the same. */
export function FindActionButton({
  onClick,
  disabled,
  className = "dq-button",
}: {
  onClick(): void;
  disabled?: boolean;
  className?: string;
}) {
  const key = useReviewKeyLabels().find;
  return (
    <button
      type="button"
      className={`${className} dq-find-button`}
      aria-keyshortcuts={key}
      disabled={disabled}
      onClick={onClick}
    >
      <Search aria-hidden="true" />
      Find action
      <kbd aria-hidden="true">{key}</kbd>
    </button>
  );
}
