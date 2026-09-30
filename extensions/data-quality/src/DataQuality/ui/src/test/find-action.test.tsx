import { fireEvent, render, screen, within } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { FindAction, actionEffectParts } from "../FindAction";

const api = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: api.request,
}));

it("summarizes effects with signs and words, never colour alone", () => {
  expect(
    actionEffectParts(
      {
        id: "a",
        label: "Several",
        steps: [
          { mode: "ADD", tagIds: [1] },
          { mode: "REMOVE_TREE", tagIds: [2] },
          { mode: "REMOVE", tagIds: [3] },
          { mode: "MARK_ABSENT", tagIds: [4] },
          { mode: "MARK_PRESENT", tagIds: [1] },
          { mode: "CLEAR_ABSENCE", tagIds: [2] },
        ],
      },
      { 1: "One", 2: "Two", 3: null },
    ),
  ).toEqual([
    { text: "+ One", tone: "add" },
    { text: "− Two tree", tone: "remove" },
    { text: "− Unavailable tag", tone: "remove" },
    { text: "Mark … absent", tone: "assess" },
    { text: "Mark One present", tone: "assess" },
    { text: "Clear Two absence", tone: "neutral" },
  ]);
  expect(actionEffectParts({ id: "s", label: "Next", steps: [] }, {})).toEqual([
    { text: "Skip", tone: "neutral" },
  ]);
  expect(
    actionEffectParts(
      { id: "g", label: "Group", effect: { mode: "SET_TAG_GROUP", tagGroupId: 8 } },
      {},
      [{ id: 8, name: "Classification" }],
    ),
  ).toEqual([{ text: "Assign Classification", tone: "neutral" }]);
  expect(
    actionEffectParts({ id: "u", label: "None", effect: { mode: "CLEAR_TAG_GROUP" } }, {}),
  ).toEqual([{ text: "Set Ungrouped", tone: "neutral" }]);
});

it("filters by label, skips disabled rows on Enter and applies with the mouse", () => {
  api.request.mockResolvedValue({ name: "Tag" });
  const onApply = vi.fn();
  const onClose = vi.fn();
  render(
    <FindAction
      actions={[
        { id: "one", label: "Kitchen", steps: [{ mode: "ADD", tagIds: [1] }] },
        { id: "two", label: "Garden", steps: [] },
        { id: "three", label: "Garage", steps: [] },
      ]}
      isDisabled={(action) => action.id === "two"}
      onApply={onApply}
      onClose={onClose}
    />,
  );
  const dialog = screen.getByRole("dialog", { name: "Find an action" });
  const search = within(dialog).getByRole("combobox", { name: "Find an action" });
  expect(search).toHaveFocus();
  fireEvent.change(search, { target: { value: "GAR" } });
  const options = within(dialog).getAllByRole("option");
  expect(options.map((option) => option.textContent)).toEqual([
    "wGardenSkip",
    "eGarageSkip",
  ]);
  expect(options[0]).toBeDisabled();
  fireEvent.keyDown(search, { key: "Enter" });
  expect(onApply).not.toHaveBeenCalled();
  // Keys composing a character belong to the input method: the Enter that commits one applies
  // nothing, the Esc that cancels one does not close Find action.
  fireEvent.keyDown(search, { key: "ArrowDown" });
  fireEvent.keyDown(search, { key: "Enter", isComposing: true });
  fireEvent.keyDown(search, { key: "Enter", keyCode: 229 });
  fireEvent.keyDown(search, { key: "Escape", isComposing: true });
  fireEvent.keyDown(search, { key: "Escape", keyCode: 229 });
  expect(onApply).not.toHaveBeenCalled();
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.keyDown(search, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
  onClose.mockClear();
  fireEvent.click(options[1], { shiftKey: true });
  expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ id: "three" }), true);
  fireEvent.mouseDown(document.querySelector(".dq-find-backdrop")!);
  expect(onClose).toHaveBeenCalled();
});

it("lists the keyed actions in key order, then the ones without a key in review order", () => {
  const onApply = vi.fn();
  render(
    <FindAction
      actions={[
        { id: "late", label: "Late", steps: [], shortcut: "b" },
        { id: "hidden", label: "Hidden", steps: [], shortcut: "none" },
        { id: "auto", label: "Auto", steps: [] },
        { id: "early", label: "Early", steps: [], shortcut: "a" },
        { id: "also", label: "Also hidden", steps: [], shortcut: "none" },
      ]}
      onApply={onApply}
      onClose={vi.fn()}
    />,
  );
  const dialog = screen.getByRole("dialog", { name: "Find an action" });
  expect(within(dialog).getAllByRole("option").map((option) => option.textContent)).toEqual([
    "qAutoSkip",
    "aEarlySkip",
    "bLateSkip",
    "·HiddenSkip",
    "·Also hiddenSkip",
  ]);
  // ↓ goes down the list in that order.
  const search = within(dialog).getByRole("combobox", { name: "Find an action" });
  fireEvent.keyDown(search, { key: "ArrowDown" });
  fireEvent.keyDown(search, { key: "Enter" });
  expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ id: "early" }), false);
});

it("keeps the keyboard in the search field after any click in the panel", () => {
  const onApply = vi.fn();
  render(
    <FindAction
      actions={[
        { id: "one", label: "Kitchen", steps: [] },
        { id: "two", label: "Garden", steps: [] },
      ]}
      isDisabled={(action) => action.id === "two"}
      canStay={false}
      onApply={onApply}
      onClose={vi.fn()}
    />,
  );
  const dialog = screen.getByRole("dialog", { name: "Find an action" });
  const search = within(dialog).getByRole("combobox", { name: "Find an action" });
  const [enabled, disabled] = within(dialog).getAllByRole("option");
  // A cancelled mousedown moves no focus.
  expect(fireEvent.mouseDown(disabled)).toBe(false);
  expect(fireEvent.mouseDown(enabled)).toBe(false);
  expect(fireEvent.mouseDown(dialog.querySelector(".dq-find-hints")!)).toBe(false);
  expect(fireEvent.mouseDown(search)).toBe(true);
  expect(search).toHaveFocus();
  // Where applying always moves on, Shift+Enter does too, and no hint promises otherwise.
  expect(within(dialog).queryAllByText(/applies and stays/)).toHaveLength(0);
  fireEvent.keyDown(search, { key: "Enter", shiftKey: true });
  expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ id: "one" }), false);
});

it("ignores the auto-repeat of a key held down since before it opened, such as the - that opened it", () => {
  render(
    <FindAction
      actions={[{ id: "one", label: "Kitchen", steps: [] }]}
      onApply={vi.fn()}
      onClose={vi.fn()}
    />,
  );
  const search = screen.getByRole("combobox", { name: "Find an action" });
  // A prevented keydown types nothing: holding - on would otherwise fill the field with "---".
  expect(fireEvent.keyDown(search, { key: "-", code: "Slash", repeat: true })).toBe(false);
  // Shift pressed during the hold still leaves the same physical key held.
  expect(fireEvent.keyDown(search, { key: "_", code: "Slash", shiftKey: true, repeat: true })).toBe(
    false,
  );
  // Pressed again here, the key types as usual, and so does its repeat, Shift joining the hold
  // included: it is still the same physical key.
  expect(fireEvent.keyDown(search, { key: "-", code: "Slash" })).toBe(true);
  expect(fireEvent.keyDown(search, { key: "-", code: "Slash", repeat: true })).toBe(true);
  expect(fireEvent.keyDown(search, { key: "_", code: "Slash", shiftKey: true, repeat: true })).toBe(
    true,
  );
  expect(fireEvent.keyDown(search, { key: "k", code: "KeyK", repeat: true })).toBe(false);
  expect(fireEvent.keyDown(search, { key: "k", code: "KeyK" })).toBe(true);
});

it("keeps repeating a key first pressed while composing, such as a Backspace that empties the composition", () => {
  render(
    <FindAction
      actions={[{ id: "one", label: "Kitchen", steps: [] }]}
      onApply={vi.fn()}
      onClose={vi.fn()}
    />,
  );
  const search = screen.getByRole("combobox", { name: "Find an action" });
  // The press belongs to the input method (Safari's key code 229, or isComposing)…
  expect(fireEvent.keyDown(search, { key: "Backspace", code: "Backspace", keyCode: 229 })).toBe(true);
  // …but it was pressed here, so its repeats once the composition has ended keep deleting.
  expect(fireEvent.keyDown(search, { key: "Backspace", code: "Backspace", repeat: true })).toBe(true);
  expect(fireEvent.keyDown(search, { key: "Delete", code: "Delete", isComposing: true })).toBe(true);
  expect(fireEvent.keyDown(search, { key: "Delete", code: "Delete", repeat: true })).toBe(true);
  // A key held since before Find action opened still repeats nothing.
  expect(fireEvent.keyDown(search, { key: "x", code: "KeyX", repeat: true })).toBe(false);
});

it("does not close on a held Esc that cancelled a composition", () => {
  const onClose = vi.fn();
  render(
    <FindAction
      actions={[{ id: "one", label: "Kitchen", steps: [] }]}
      onApply={vi.fn()}
      onClose={onClose}
    />,
  );
  const search = screen.getByRole("combobox", { name: "Find an action" });
  fireEvent.keyDown(search, { key: "Escape", code: "Escape", isComposing: true });
  fireEvent.keyDown(search, { key: "Escape", code: "Escape", repeat: true });
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.keyDown(search, { key: "Escape", code: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
});
