import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import {
  useReviewKeyLabels,
  useReviewKeys,
  type ReviewKeyHandlers,
  type ReviewKeyLabels,
} from "../reviewKeys";
import { activeTestKeys } from "./runtime-components";

function Keys(props: ReviewKeyHandlers) {
  useReviewKeys(props);
  return null;
}

function keys(overrides: Partial<ReviewKeyHandlers> = {}) {
  const handlers = { onAction: vi.fn(), onFind: vi.fn(), onSelectAll: vi.fn() };
  const props: ReviewKeyHandlers = {
    surface: "local",
    enabled: true,
    actionCount: 27,
    ...handlers,
    ...overrides,
  };
  return { ...render(<Keys {...props} />), ...handlers, props };
}

it("registers each action's key and Shift+key, - for Find action and Ctrl+A for select all", () => {
  keys({ actionCount: 30 });
  const active = activeTestKeys();
  // The stand-in rejects bindings with an action id, which would follow Cove's keyboard preset.
  expect(active).toHaveLength(2 + 27 * 2);
  expect(active.slice(0, 6)).toEqual([
    "local:Ctrl+a",
    "local:-",
    "local:q",
    "local:Shift+q",
    "local:w",
    "local:Shift+w",
  ]);
  expect(active).toEqual(
    expect.arrayContaining([
      "local:å",
      "local:Shift+å",
      "local:ö",
      "local:Shift+ä",
      "local:b",
      "local:Shift+b",
      "local:-",
      "local:Ctrl+a",
    ]),
  );
  // n and m step through the grid preview; they never apply an action.
  expect(active.filter((key) => /:(Shift\+)?[nm]$/.test(key))).toEqual([]);
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

it("registers only the keys of existing actions, and none while disabled", () => {
  const { rerender, props, onAction } = keys({ actionCount: 14 });
  expect(activeTestKeys()).toContain("local:d");
  expect(activeTestKeys()).not.toContain("local:f");
  // An empty slot's key is left alone for Cove.
  expect(fireEvent.keyDown(document.body, { key: "f" })).toBe(true);
  rerender(<Keys {...props} enabled={false} />);
  expect(activeTestKeys()).toEqual([]);
  expect(fireEvent.keyDown(document.body, { key: "q" })).toBe(true);
  // Without actions Find action has nothing to list; select all remains.
  rerender(<Keys {...props} actionCount={0} />);
  expect(activeTestKeys()).toEqual(["local:Ctrl+a"]);
  expect(onAction).not.toHaveBeenCalled();
});

it("puts the preview's keys on the overlay surface, without select all", () => {
  keys({ surface: "overlay", actionCount: 2 });
  expect(activeTestKeys()).toEqual([
    "overlay:-",
    "overlay:q",
    "overlay:Shift+q",
    "overlay:w",
    "overlay:Shift+w",
  ]);
});

it("keeps every key in its place when actions are added", () => {
  // Until Cove registers the longer list, it forwards strokes by position to the latest one.
  const { rerender, props } = keys({ actionCount: 2 });
  const before = activeTestKeys();
  rerender(<Keys {...props} actionCount={3} />);
  const after = activeTestKeys();
  expect(after.slice(0, before.length)).toEqual(before);
  expect(after.slice(before.length)).toEqual(["local:e", "local:Shift+e"]);
});

it("leaves every key to text fields", () => {
  const { onAction, onFind, onSelectAll } = keys();
  render(<input aria-label="Notes" />);
  const field = screen.getByRole("textbox", { name: "Notes" });
  for (const init of [{ key: "q" }, { key: "Q", shiftKey: true }, { key: "-" }, { key: "a", ctrlKey: true }])
    expect(fireEvent.keyDown(field, init)).toBe(true);
  expect(onAction).not.toHaveBeenCalled();
  expect(onFind).not.toHaveBeenCalled();
  expect(onSelectAll).not.toHaveBeenCalled();
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

it("labels actions, Find action and select all with the fixed keys", () => {
  const seen: ReviewKeyLabels[] = [];
  function Labels() {
    seen.push(useReviewKeyLabels());
    return null;
  }
  render(<Labels />);
  const shown = seen[0];
  expect([0, 10, 11, 14, 15, 18, 20, 21, 26, 27].map((index) => shown.action(index))).toEqual([
    "q",
    "å",
    "a",
    "f",
    "g",
    "k",
    "ö",
    "ä",
    "b",
    "",
  ]);
  expect(shown.find).toBe("-");
  expect(shown.selectAll).toBe("Ctrl/⌘A");
});
