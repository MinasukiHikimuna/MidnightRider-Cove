import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown, Plus } from "@cove/runtime/lucide-react";
import { groupKey } from "./answerGroups";
import { isComposingKey, type MediaReviewAction } from "./model";

/** One row of the group field's list. */
export interface GroupOption {
  /** No group, a group the review has, or the typed name as a new group. */
  kind: "none" | "group" | "new";
  /** The group's name as listed; "" for No group. */
  name: string;
  /** It is the action's group now (No group while the action has none). */
  selected: boolean;
}

/**
 * The group field's list: **No group**, then the review's groups, then **New group** for a typed
 * name no other action has. Opened without typing, it lists every group the actions name, the
 * action's own included. Once something is typed, it lists the groups the other actions name that
 * contain the text (ignoring case and surrounding spaces), and offers the text as a new group when
 * none of them has that name. The action's group, or No group, is the selected row.
 */
export function groupOptions(
  /** The groups the review's actions name, as the first of each spells it, in their order. */
  groupNames: readonly string[],
  /** The groups the other actions name: a name none of them has is a new group. */
  otherGroupNames: readonly string[],
  /** The action's group as it stands, typed text included. */
  value: string | undefined,
  /** What was typed since the list opened, which filters it; null while nothing was. */
  typed: string | null,
): GroupOption[] {
  const own = groupKey(value);
  const options: GroupOption[] = [{ kind: "none", name: "", selected: !own }];
  if (typed === null) {
    for (const name of groupNames)
      options.push({ kind: "group", name, selected: groupKey(name) === own });
    return options;
  }
  const needle = groupKey(typed);
  for (const name of otherGroupNames)
    if (groupKey(name).includes(needle))
      options.push({ kind: "group", name, selected: groupKey(name) === own });
  if (needle && !otherGroupNames.some((name) => groupKey(name) === needle))
    options.push({ kind: "new", name: typed.trim(), selected: needle === own });
  return options;
}

function optionKey(option: GroupOption): string {
  return option.kind === "group" ? `group:${groupKey(option.name)}` : option.kind;
}

/** The action without an answer group. */
function ungrouped(action: MediaReviewAction): MediaReviewAction {
  const { group: _group, ...rest } = action;
  return rest;
}

/** Room kept between the field and its list. */
const LIST_GAP = 4;
/** The tallest the list grows before it scrolls: about six rows. */
const LIST_MAX_HEIGHT = 240;

/**
 * The elements that clip the field when they scroll or overflow (the drawer's body, the drawer
 * itself): the list hangs on the page and closes once the field has left their view.
 */
function clippingAncestors(element: HTMLElement): HTMLElement[] {
  const clipping: HTMLElement[] = [];
  for (let node = element.parentElement; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (style.overflowX !== "visible" || style.overflowY !== "visible") clipping.push(node);
  }
  return clipping;
}

/**
 * Whether the field can be seen: inside every clipping ancestor's box, and not under something
 * drawn over it, such as the Actions tab's toolbar, which stays put while the rows scroll under it.
 * The field's own list never counts as covering it.
 */
function fieldInView(
  box: HTMLElement,
  popup: HTMLElement,
  rect: DOMRect,
  clipping: readonly HTMLElement[],
): boolean {
  for (const node of clipping) {
    const clip = node.getBoundingClientRect();
    if (rect.bottom < clip.top || rect.top > clip.bottom || rect.right < clip.left || rect.left > clip.right)
      return false;
  }
  if (typeof document.elementFromPoint !== "function") return true;
  const hit = document.elementFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);
  return !hit || box.contains(hit) || popup.contains(hit);
}

/**
 * The action's answer group: free text with a list of the review's groups under it, drawn by the
 * extension in Cove's style (a native datalist looks different in every browser). Typing edits the
 * group directly, as before: names match trimmed and ignoring case, leaving the field trims the
 * name, and an empty one is no group. The list offers No group, the review's groups (filtered by
 * what is typed) and the typed name as a new group; it follows the ARIA combobox pattern, with
 * the chevron outside the Tab order. Typing, ↓ or Alt + ↓ opens it, ↑ / ↓ move, Enter picks, Esc
 * closes only the list (not the drawer around it) and Tab closes it keeping what was typed; a click
 * or tap on the field or the chevron opens it and one outside closes it. A tapped chevron gives the
 * list focus rather than the field, so no on-screen keyboard comes up; focus anywhere but the field
 * and its list closes the list, so its Esc never waits in another field. The list hangs on the page,
 * outside the drawer's scrolling body that would cut it off, and follows the field as that body
 * scrolls. A group is one question that takes one answer, which the help under the field says; in
 * occurrence reviews that is also what lets a performer's answers there count as mixed
 * (performerAnswers.ts).
 */
export function GroupField({
  action,
  groupNames,
  otherGroupNames,
  occurrence,
  onChange,
}: {
  action: MediaReviewAction;
  /** The groups the review's actions name, the action's own included. */
  groupNames: readonly string[];
  /** The groups the other actions name. */
  otherGroupNames: readonly string[];
  occurrence: boolean;
  onChange(action: MediaReviewAction): void;
}) {
  const inputId = useId();
  const listId = useId();
  const helpId = useId();
  const field = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const chevron = useRef<HTMLButtonElement>(null);
  const clipping = useRef<HTMLElement[]>([]);
  // Whether the chevron's press came from a touch: a tap on it opens the list without bringing up
  // the on-screen keyboard.
  const touchPress = useRef(false);
  // Whether the list takes focus once it is drawn: a tapped chevron opens it without focusing the
  // field, and focus must not stay in another field while the list is open.
  const focusList = useRef(false);
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const value = action.group ?? "";
  const options = useMemo(
    () => groupOptions(groupNames, otherGroupNames, value, typed),
    [groupNames, otherGroupNames, value, typed],
  );
  const keys = options.map(optionKey);
  const active = activeKey === null ? -1 : keys.indexOf(activeKey);
  const optionId = (index: number) => `${listId}-option-${index}`;

  const set = (next: string) => onChange(next ? { ...action, group: next } : ungrouped(action));
  const trim = () => {
    const current = input.current?.value ?? value;
    if (current.trim() !== current) set(current.trim());
  };
  function show(activate: string | null) {
    setTyped(null);
    setActiveKey(activate);
    setOpen(true);
  }
  /** Whether a node is the field (its name, input and chevron) or its list. */
  const within = (node: EventTarget | null) =>
    node instanceof Node && (field.current?.contains(node) || list.current?.contains(node)) === true;
  function close() {
    // Focus in the list stays by the field, on the chevron, which brings up no on-screen keyboard.
    if (list.current?.contains(document.activeElement)) chevron.current?.focus({ preventScroll: true });
    setOpen(false);
    setTyped(null);
    setActiveKey(null);
  }
  function pick(option: GroupOption) {
    // The group the action already has, perhaps spelt differently by another action, picked
    // without typing: kept as the action spells it, so picking it changes nothing. After typing,
    // the field takes the picked row's spelling, as a pick shows.
    if (!(option.kind === "group" && option.selected && typed === null))
      set(option.kind === "none" ? "" : option.name);
    close();
  }

  // The list hangs under the field, as wide as it (above it when it does not fit below and there
  // is more room above), and closes once the field is out of view. It moves first: where it was
  // drawn before a scroll must not count as covering the field.
  function place() {
    const anchor = box.current;
    const popup = list.current;
    if (!anchor || !popup) return;
    const rect = anchor.getBoundingClientRect();
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop ?? 0;
    const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
    const below = bottom - rect.bottom - LIST_GAP;
    const above = rect.top - top - LIST_GAP;
    const wanted = Math.min(popup.scrollHeight, LIST_MAX_HEIGHT);
    const upwards = below < wanted && above > below;
    popup.style.left = `${rect.left}px`;
    popup.style.width = `${rect.width}px`;
    popup.style.top = `${upwards ? rect.top - LIST_GAP : rect.bottom + LIST_GAP}px`;
    popup.style.transform = upwards ? "translateY(-100%)" : "";
    popup.style.maxHeight = `${Math.max(0, Math.min(LIST_MAX_HEIGHT, upwards ? above : below))}px`;
    if (!fieldInView(anchor, popup, rect, clipping.current)) close();
  }
  // Once per opening, before the first placement: what can hide the field, and focus for a list
  // opened by a tap.
  useLayoutEffect(() => {
    if (!open) return;
    if (box.current) clipping.current = clippingAncestors(box.current);
    if (focusList.current) list.current?.focus({ preventScroll: true });
    focusList.current = false;
  }, [open]);
  // After every render while open: the options, and the rows above the field, may have changed.
  useLayoutEffect(() => {
    if (open) place();
  });
  useEffect(() => {
    if (!open) return;
    const follow = () => place();
    // A press outside the field and its list closes the list; the field's name counts as the
    // field, so pressing it does not close the list only for its click to open it again. In the
    // bubble phase, as Cove's own menus listen.
    const pressOutside = (event: PointerEvent) => {
      if (!within(event.target)) close();
    };
    // Scroll events do not bubble: each element that can scroll the field away is listened to,
    // and the window for the page itself.
    const scrollers: EventTarget[] = [...clipping.current, window];
    const viewport = window.visualViewport;
    for (const scroller of scrollers) scroller.addEventListener("scroll", follow);
    window.addEventListener("resize", follow);
    viewport?.addEventListener("resize", follow);
    viewport?.addEventListener("scroll", follow);
    document.addEventListener("pointerdown", pressOutside);
    return () => {
      for (const scroller of scrollers) scroller.removeEventListener("scroll", follow);
      window.removeEventListener("resize", follow);
      viewport?.removeEventListener("resize", follow);
      viewport?.removeEventListener("scroll", follow);
      document.removeEventListener("pointerdown", pressOutside);
    };
  }, [open]);
  useEffect(() => {
    if (active >= 0) list.current?.children[active]?.scrollIntoView?.({ block: "nearest" });
  }, [active]);

  // The keys of the field and, while it has focus, of its list; Esc is the wrapper's.
  function handleKey(event: ReactKeyboardEvent<HTMLElement>) {
    // Keys that compose a character belong to the input method.
    if (isComposingKey(event)) return;
    const vertical = event.key === "ArrowDown" || event.key === "ArrowUp";
    if (vertical && !open) {
      // Alt + ↓ only opens the list; ↓ and ↑ open it on the action's group, as a select does, so
      // Enter right away leaves the group as it is.
      if (event.altKey && event.key === "ArrowUp") return;
      event.preventDefault();
      show(event.altKey ? null : groupKey(value) ? `group:${groupKey(value)}` : "none");
      return;
    }
    if (!open) return;
    if (vertical) {
      event.preventDefault();
      if (event.altKey) {
        if (event.key === "ArrowUp") close();
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      // Once something is typed, ↓ starts on the first match (or New group) rather than on No
      // group, so typing part of a name, ↓ and Enter never clears the group; ↑ reaches No group.
      const first = typed !== null && groupKey(typed) && keys.length > 1 ? 1 : 0;
      const next =
        active < 0
          ? step > 0
            ? first
            : keys.length - 1
          : (active + step + keys.length) % keys.length;
      setActiveKey(keys[next]);
    } else if (event.key === "Enter") {
      // Picks the active row, or keeps what was typed; claimed, so nothing else acts on it.
      event.preventDefault();
      if (active >= 0) pick(options[active]);
      else {
        trim();
        close();
      }
    }
  }
  // The list has focus after a tap on the chevron; a keyboard can carry on from there.
  function handleListKey(event: ReactKeyboardEvent<HTMLUListElement>) {
    if (event.key === "Tab") {
      // Tab goes on from the field, not from the end of the page where the list hangs: closing
      // moves focus to the chevron, after the field, and Shift + Tab starts from the field itself,
      // so the browser's Tab carries on as from the field.
      close();
      if (event.shiftKey) input.current?.focus();
      return;
    }
    // AltGr arrives as Ctrl + Alt on Windows; its characters are typing too, as are dead keys.
    const altGraph = event.getModifierState("AltGraph");
    const typing =
      event.key === "Dead" ||
      (event.key.length === 1 && !event.metaKey && (altGraph || (!event.ctrlKey && !event.altKey)));
    if (typing) {
      // Typing goes to the field, which filters the list as it would have.
      input.current?.focus();
      return;
    }
    handleKey(event);
  }

  return (
    <div
      // While the list is open, Esc closes only the list, wherever in the field or the list focus
      // is (the list is a portal, but its keys come here); the drawer's Esc, which would close the
      // editor, waits. Focus anywhere else closes the list, so Esc cannot find it open there.
      onKeyDown={(event) => {
        if (!open || event.key !== "Escape" || isComposingKey(event)) return;
        event.preventDefault();
        event.stopPropagation();
        close();
      }}
    >
      <div ref={field} className="dq-action-field">
        <label
          className="dq-action-field-name"
          htmlFor={inputId}
          // While the list is open a press on the name keeps focus in the field, which a blur would
          // close the list for; the click still reaches the field.
          onMouseDown={(event) => {
            if (open) event.preventDefault();
          }}
        >
          Group
        </label>
        <div ref={box} className="dq-combobox">
          <input
            ref={input}
            id={inputId}
            className="dq-input dq-action-group-input"
            role="combobox"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={open && active >= 0 ? optionId(active) : undefined}
            aria-describedby={helpId}
            placeholder="No group"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(event) => {
              set(event.target.value);
              setTyped(event.target.value);
              setActiveKey(null);
              setOpen(true);
            }}
            onClick={() => {
              if (!open) show(null);
            }}
            onKeyDown={handleKey}
            onBlur={() => {
              close();
              trim();
            }}
          />
          <button
            ref={chevron}
            type="button"
            className="dq-combobox-toggle"
            tabIndex={-1}
            aria-label="Show groups"
            aria-expanded={open}
            aria-controls={open ? listId : undefined}
            onPointerDown={(event) => {
              touchPress.current = event.pointerType === "touch";
            }}
            // The press itself leaves focus where it is, so the list is not closed by a blur.
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => {
              const touch = touchPress.current;
              touchPress.current = false;
              const inField = document.activeElement === input.current;
              if (open) close();
              else {
                // A tap opens the list with focus in it, not in the field, so no on-screen
                // keyboard comes up, and none stays in another field whose keys would miss the list.
                focusList.current = touch && !inField;
                show(null);
              }
              if (!touch || inField) input.current?.focus();
            }}
          >
            <ChevronDown aria-hidden="true" />
          </button>
        </div>
      </div>
      <p className="dq-actions-hint dq-action-field-help" id={helpId}>
        {occurrence
          ? "A group is one question with one answer per item; when a chosen performer's items hold two different answers of a group, Existing answers marks it Mixed."
          : "A group is one question with one answer per item."}
      </p>
      {open &&
        createPortal(
          <ul
            ref={list}
            id={listId}
            role="listbox"
            aria-label="Groups"
            className="dq-combobox-list"
            // Focusable for a list opened by a tap, which then has focus and names its active row.
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? optionId(active) : undefined}
            // A press on a row, a gap or the scroll bar leaves focus in the field, or the list.
            onMouseDown={(event) => event.preventDefault()}
            onKeyDown={handleListKey}
            onBlur={(event) => {
              if (!within(event.relatedTarget)) close();
            }}
          >
            {options.map((option, index) => (
              <li
                key={keys[index]}
                id={optionId(index)}
                role="option"
                aria-selected={option.selected}
                className="dq-combobox-option"
                data-kind={option.kind}
                data-active={index === active || undefined}
                onMouseMove={() => {
                  if (index !== active) setActiveKey(keys[index]);
                }}
                onClick={() => pick(option)}
              >
                {option.kind === "new" && <Plus aria-hidden="true" />}
                <span className="dq-combobox-option-name">
                  {option.kind === "none"
                    ? "No group"
                    : option.kind === "new"
                      ? `New group “${option.name}”`
                      : option.name}
                </span>
                {option.selected && <Check className="dq-combobox-check" aria-hidden="true" />}
              </li>
            ))}
          </ul>,
          document.body,
        )}
    </div>
  );
}
