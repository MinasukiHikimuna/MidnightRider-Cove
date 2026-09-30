import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import type { MediaReviewAction } from "../model";
import {
  useReviewKeyLabels,
  useReviewKeys,
  type ReviewKeyHandlers,
  type ReviewKeyLabels,
} from "../reviewKeys";
import {
  activeTestKeys,
  invokeTestBinding,
  testGlobalShortcuts,
  testKeyboardConflicts,
  testPlayerShortcuts,
  testVideoControls,
  VideoPlayer,
} from "./runtime-components";

function Keys(props: ReviewKeyHandlers) {
  useReviewKeys(props);
  return null;
}

function actions(count: number, shortcuts: Record<number, string> = {}): MediaReviewAction[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `action-${index}`,
    label: `Action ${index + 1}`,
    steps: [],
    ...(shortcuts[index] === undefined ? {} : { shortcut: shortcuts[index] }),
  }));
}

function keys(overrides: Partial<ReviewKeyHandlers> = {}) {
  const handlers = { onAction: vi.fn(), onFind: vi.fn(), onSelectAll: vi.fn() };
  const props: ReviewKeyHandlers = {
    surface: "local",
    enabled: true,
    actions: actions(27),
    ...handlers,
    ...overrides,
  };
  return { ...render(<Keys {...props} />), ...handlers, props };
}

it("registers each placed key and Shift+key, - for Find action and Ctrl+A for select all", () => {
  keys({ actions: actions(34) });
  const active = activeTestKeys();
  // The stand-in rejects bindings with an action id, which would follow Cove's keyboard preset.
  // 29 letters with Shift, then comma and period with what Shift makes them type.
  expect(active).toHaveLength(2 + 29 * 2 + 2 * 3);
  expect(active.slice(0, 6)).toEqual([
    "local:Ctrl+a",
    "local:-",
    "local:q",
    "local:Shift+q",
    "local:w",
    "local:Shift+w",
  ]);
  expect(active).toEqual(
    expect.arrayContaining(["local:å", "local:Shift+å", "local:ö", "local:Shift+ä", "local:Shift+b"]),
  );
  expect(active.slice(-10)).toEqual([
    "local:n",
    "local:Shift+n",
    "local:m",
    "local:Shift+m",
    "local:,",
    "local:;",
    "local:<",
    "local:.",
    "local::",
    "local:>",
  ]);
});

it("applies on n, m, comma and period, and stays with Shift on them", () => {
  const { onAction } = keys({ actions: actions(31) });
  fireEvent.keyDown(document.body, { key: "n", code: "KeyN" });
  fireEvent.keyDown(document.body, { key: "M", code: "KeyM", shiftKey: true });
  fireEvent.keyDown(document.body, { key: ",", code: "Comma" });
  fireEvent.keyDown(document.body, { key: ".", code: "Period" });
  expect(onAction.mock.calls).toEqual([
    [27, false],
    [28, true],
    [29, false],
    [30, false],
  ]);
});

it("stays on Shift + comma or period by the key pressed, whatever character it types", () => {
  const { onAction } = keys({ actions: actions(31) });
  // Finnish/Swedish: Shift + comma types ;, Shift + period types :.
  expect(fireEvent.keyDown(document.body, { key: ";", code: "Comma", shiftKey: true })).toBe(false);
  expect(fireEvent.keyDown(document.body, { key: ":", code: "Period", shiftKey: true })).toBe(false);
  // US and UK: < and >.
  fireEvent.keyDown(document.body, { key: "<", code: "Comma", shiftKey: true });
  fireEvent.keyDown(document.body, { key: ">", code: "Period", shiftKey: true });
  expect(onAction.mock.calls).toEqual([
    [29, true],
    [30, true],
    [29, true],
    [30, true],
  ]);
  onAction.mockClear();
  // The same characters from other keys apply nothing: the Finnish/Swedish < key left of Z,
  // with and without Shift, and a US semicolon key; nor do they without Shift or with Alt.
  for (const init of [
    { key: "<", code: "IntlBackslash" },
    { key: ">", code: "IntlBackslash", shiftKey: true },
    { key: ";", code: "Semicolon" },
    { key: ":", code: "Semicolon", shiftKey: true },
    { key: ";", code: "Comma" },
  ])
    fireEvent.keyDown(document.body, init);
  expect(onAction).not.toHaveBeenCalled();
  // A repeat of a held Shift + comma applies nothing either.
  fireEvent.keyDown(document.body, { key: ";", code: "Comma", shiftKey: true, repeat: true });
  // Without the key event (not while Cove dispatches one), the character applies nothing.
  invokeTestBinding(";");
  invokeTestBinding(":", { sequence: ":" });
  expect(onAction).not.toHaveBeenCalled();
});

it("applies on a key, stays with Shift and a key, and acts on a held key only once", () => {
  const { onAction } = keys();
  fireEvent.keyDown(document.body, { key: "q" });
  fireEvent.keyDown(document.body, { key: "Å", shiftKey: true });
  fireEvent.keyDown(document.body, { key: "f" });
  fireEvent.keyDown(document.body, { key: "G", shiftKey: true });
  fireEvent.keyDown(document.body, { key: "b" });
  expect(onAction.mock.calls).toEqual([
    [0, false],
    [10, true],
    [14, false],
    [15, true],
    [26, false],
  ]);
  // Cove passes a held key's repeats on; they are claimed, so nothing else acts on them either.
  expect(fireEvent.keyDown(document.body, { key: "q", repeat: true })).toBe(false);
  expect(fireEvent.keyDown(document.body, { key: "Q", shiftKey: true, repeat: true })).toBe(false);
  expect(onAction).toHaveBeenCalledTimes(5);
});

it("puts pinned actions on their keys and leaves other empty keys unregistered", () => {
  // Pinned to s, Auto, no key, pinned to a, Auto.
  const { onAction } = keys({ actions: actions(5, { 0: "s", 2: "none", 3: "a" }) });
  const active = activeTestKeys();
  for (const key of ["q", "w", "a", "s"]) {
    expect(active).toContain(`local:${key}`);
    expect(active).toContain(`local:Shift+${key}`);
  }
  for (const key of ["e", "d", "h", "b"]) expect(active).not.toContain(`local:${key}`);
  fireEvent.keyDown(document.body, { key: "s" });
  fireEvent.keyDown(document.body, { key: "q" });
  fireEvent.keyDown(document.body, { key: "A", shiftKey: true });
  fireEvent.keyDown(document.body, { key: "w" });
  expect(onAction.mock.calls).toEqual([
    [0, false],
    [1, false],
    [3, true],
    [4, false],
  ]);
  // An empty key other than f, g and k stays unclaimed.
  expect(fireEvent.keyDown(document.body, { key: "e" })).toBe(true);
});

it("reads the physical key only from the keydown Cove is dispatching for the stroke", () => {
  const { onAction } = keys({ actions: actions(31) });
  const target = document.createElement("div");
  document.body.append(target);
  // Stand-ins for a stroke Cove dispatches while another event is on its way: only the keydown
  // at the invocation's target counts.
  const during = (type: string, init: KeyboardEventInit, invocationTarget: EventTarget) => {
    const listener = () => invokeTestBinding(";", { sequence: ";", target: invocationTarget });
    target.addEventListener(type, listener);
    fireEvent(target, new KeyboardEvent(type, { bubbles: true, ...init }));
    target.removeEventListener(type, listener);
  };
  // A key Cove binds nothing to, so the event reaches the listener.
  const shiftComma = { key: "F13", code: "Comma", shiftKey: true };
  during("keydown", shiftComma, document.body);
  during("keyup", shiftComma, target);
  expect(onAction).not.toHaveBeenCalled();
  during("keydown", shiftComma, target);
  expect(onAction.mock.calls).toEqual([[29, true]]);
  target.remove();
});

it("claims f, g, k, n, m, comma and period while they hold no action, so Cove's own uses never fire", () => {
  testVideoControls.toggle.mockClear();
  testPlayerShortcuts.mute.mockClear();
  const { rerender, props, onAction } = keys({ actions: actions(2) });
  render(<VideoPlayer videoId={1} extensionSurface="data-quality" />);
  for (const key of ["f", "g", "k", "n", "m"]) {
    expect(activeTestKeys()).toContain(`local:${key}`);
    expect(activeTestKeys()).toContain(`local:Shift+${key}`);
  }
  for (const key of [",", ";", "<", ".", ":", ">"]) expect(activeTestKeys()).toContain(`local:${key}`);
  for (const init of [
    { key: "f" },
    { key: "g" },
    { key: "k" },
    { key: "n" },
    { key: "m" },
    { key: ",", code: "Comma" },
    { key: ".", code: "Period" },
    { key: "F", shiftKey: true },
    { key: "G", shiftKey: true },
    { key: "K", shiftKey: true },
    { key: "N", shiftKey: true },
    { key: "M", shiftKey: true },
    { key: ";", code: "Comma", shiftKey: true },
    { key: ":", code: "Period", shiftKey: true },
  ])
    expect(fireEvent.keyDown(document.body, init)).toBe(false);
  expect(onAction).not.toHaveBeenCalled();
  expect(testPlayerShortcuts.mute).not.toHaveBeenCalled();
  expect(testPlayerShortcuts.fullscreen).not.toHaveBeenCalled();
  expect(testVideoControls.toggle).not.toHaveBeenCalled();
  expect(testGlobalShortcuts.goTo).not.toHaveBeenCalled();
  expect(testKeyboardConflicts).toEqual([]);
  // Released, the keys are Cove's again.
  rerender(<Keys {...props} enabled={false} />);
  fireEvent.keyDown(document.body, { key: "f" });
  fireEvent.keyDown(document.body, { key: "g" });
  fireEvent.keyDown(document.body, { key: "k" });
  fireEvent.keyDown(document.body, { key: "m" });
  expect(testPlayerShortcuts.mute).toHaveBeenCalledTimes(1);
  expect(testPlayerShortcuts.fullscreen).toHaveBeenCalledTimes(1);
  expect(testGlobalShortcuts.goTo).toHaveBeenCalledTimes(1);
  expect(testVideoControls.toggle).toHaveBeenCalledTimes(1);
  expect(onAction).not.toHaveBeenCalled();
});

it("registers none while disabled, and select all and f, g and k without actions", () => {
  const { rerender, props, onAction } = keys({ actions: actions(14) });
  rerender(<Keys {...props} enabled={false} />);
  expect(activeTestKeys()).toEqual([]);
  expect(fireEvent.keyDown(document.body, { key: "q" })).toBe(true);
  // Without actions Find action has nothing to list; select all and the claimed keys remain.
  rerender(<Keys {...props} actions={[]} />);
  expect(activeTestKeys()).toEqual([
    "local:Ctrl+a",
    "local:f",
    "local:Shift+f",
    "local:g",
    "local:Shift+g",
    "local:k",
    "local:Shift+k",
    "local:n",
    "local:Shift+n",
    "local:m",
    "local:Shift+m",
    "local:,",
    "local:;",
    "local:<",
    "local:.",
    "local::",
    "local:>",
  ]);
  expect(fireEvent.keyDown(document.body, { key: "f" })).toBe(false);
  expect(fireEvent.keyDown(document.body, { key: "m" })).toBe(false);
  expect(onAction).not.toHaveBeenCalled();
});

it("puts the preview's keys on the overlay surface, without select all, claiming the same keys", () => {
  keys({ surface: "overlay", actions: actions(2) });
  expect(activeTestKeys()).toEqual([
    "overlay:-",
    "overlay:q",
    "overlay:Shift+q",
    "overlay:w",
    "overlay:Shift+w",
    ...["f", "g", "k", "n", "m"].flatMap((key) => [`overlay:${key}`, `overlay:Shift+${key}`]),
    "overlay:,",
    "overlay:;",
    "overlay:<",
    "overlay:.",
    "overlay::",
    "overlay:>",
  ]);
});

it("acts on the stroke Cove resolved, whichever binding Cove hands it to", () => {
  const { onAction, onFind } = keys({ actions: actions(2, { 0: "a", 1: "s" }) });
  // Until Cove registers a changed list, it forwards a stroke to the binding at the same place.
  invokeTestBinding("a", { sequence: "Shift+s" });
  invokeTestBinding("Shift+a", { sequence: "-" });
  invokeTestBinding("a", { sequence: "s", repeat: true });
  // Without an invocation (Cove's own fallback listener), the binding's own key.
  invokeTestBinding("s");
  expect(onAction.mock.calls).toEqual([
    [1, true],
    [1, false],
  ]);
  expect(onFind).toHaveBeenCalledTimes(1);
});

it("follows the keys when the actions change", () => {
  const { rerender, props, onAction } = keys({ actions: actions(2, { 0: "w", 1: "q" }) });
  fireEvent.keyDown(document.body, { key: "q" });
  rerender(<Keys {...props} actions={actions(2, { 0: "q", 1: "w" })} />);
  fireEvent.keyDown(document.body, { key: "q" });
  rerender(<Keys {...props} actions={actions(3, { 2: "e" })} />);
  fireEvent.keyDown(document.body, { key: "e" });
  expect(onAction.mock.calls).toEqual([
    [1, false],
    [0, false],
    [2, false],
  ]);
});

it("leaves every key to text fields", () => {
  const { onAction, onFind, onSelectAll } = keys({ actions: actions(31) });
  render(<input aria-label="Notes" />);
  const field = screen.getByRole("textbox", { name: "Notes" });
  for (const init of [
    { key: "q" },
    { key: "Q", shiftKey: true },
    { key: "f" },
    { key: "m" },
    { key: ",", code: "Comma" },
    { key: ";", code: "Comma", shiftKey: true },
    { key: "-" },
    { key: "a", ctrlKey: true },
  ])
    expect(fireEvent.keyDown(field, init)).toBe(true);
  expect(onAction).not.toHaveBeenCalled();
  expect(onFind).not.toHaveBeenCalled();
  expect(onSelectAll).not.toHaveBeenCalled();
});

it("opens Find action on - and toggles select all on Ctrl+A or ⌘A", () => {
  const { onFind, onSelectAll } = keys();
  fireEvent.keyDown(document.body, { key: "-" });
  fireEvent.keyDown(document.body, { key: "-", repeat: true });
  fireEvent.keyDown(document.body, { key: "a", ctrlKey: true });
  fireEvent.keyDown(document.body, { key: "a", metaKey: true });
  fireEvent.keyDown(document.body, { key: "a", ctrlKey: true, repeat: true });
  expect(onFind).toHaveBeenCalledTimes(1);
  expect(onSelectAll).toHaveBeenCalledTimes(2);
});

it("calls the handlers of the latest render", () => {
  const earlier = vi.fn();
  const later = vi.fn();
  const { rerender, props } = keys({ onAction: earlier });
  rerender(<Keys {...props} onAction={later} />);
  fireEvent.keyDown(document.body, { key: "w" });
  expect(earlier).not.toHaveBeenCalled();
  expect(later).toHaveBeenCalledWith(1, false);
});

it("labels Find action and select all with their fixed keys", () => {
  const seen: ReviewKeyLabels[] = [];
  function Labels() {
    seen.push(useReviewKeyLabels());
    return null;
  }
  render(<Labels />);
  expect(seen[0]).toEqual({ find: "-", selectAll: "Ctrl/⌘A" });
});
