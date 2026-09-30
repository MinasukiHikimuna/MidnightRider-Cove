import { act, cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ActionPad, createActionPreviewStore } from "../ActionPad";
import type { AttentionEntry } from "../attention";
import type { MediaReviewAction } from "../model";
import type { TagState } from "../reviewTags";
import { setViewportWidth } from "./viewport";
// The pad's own styles, for where its controls sit (jsdom applies them, without layout).
import "../styles.css";

const api = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: api.request,
}));

beforeEach(() => {
  api.request.mockImplementation(async (path: string) => ({
    name: `Tag ${path.split("/").at(-1)}`,
  }));
});

function numbered(count: number): MediaReviewAction[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `numbered-${index + 1}`,
    label: `Action ${index + 1}`,
    steps: [{ mode: "ADD" as const, tagIds: [100 + index] }],
  }));
}

function pad(
  actions: MediaReviewAction[],
  {
    disabled = () => false,
    trees = new Map(),
    tags = null,
    paused = false,
    waitForGroups = false,
    attention,
  }: {
    disabled?(action: MediaReviewAction): boolean;
    trees?: Map<number, number[]>;
    tags?: TagState | null;
    paused?: boolean;
    waitForGroups?: boolean;
    attention?: AttentionEntry[];
  } = {},
) {
  const preview = createActionPreviewStore();
  const onApply = vi.fn();
  const onFind = vi.fn();
  const view = render(
    <ActionPad
      actions={actions}
      isDisabled={disabled}
      busy={false}
      tags={tags}
      trees={trees}
      preview={preview}
      onApply={onApply}
      onFind={onFind}
      findDisabled={paused}
      paused={paused}
      waitForGroups={waitForGroups}
      attention={attention}
    />,
  );
  return { ...view, preview, onApply, onFind };
}

const rows = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>(".dq-pad-row"),
];
const effectLine = (container: HTMLElement) =>
  container.querySelector(".dq-pad-effect") as HTMLElement;

it("lays actions on the keyboard rows they use, empty keys all alike", () => {
  const { container, onFind } = pad(numbered(13));
  expect(rows(container)).toHaveLength(2);
  expect(rows(container)[0].querySelectorAll(".dq-pad-slot")).toHaveLength(11);
  expect(screen.getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "å Action 11" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "s Action 13" })).toBeInTheDocument();
  // Empty keys, f, g and k included, do nothing on review pages and name nothing.
  const second = rows(container)[1];
  const free = [...second.querySelectorAll<HTMLElement>(".dq-pad-free")];
  expect(free.map((slot) => slot.textContent)).toEqual(["d", "f", "g", "h", "j", "k", "l", "ö", "ä"]);
  for (const slot of free) {
    expect(slot).toHaveClass("dq-pad-slot dq-pad-free", { exact: true });
    expect(slot).toHaveAttribute("title", "No action on this key: it does nothing here");
  }
  // Without a bottom row, Find action lives in the pad's header.
  expect(effectLine(container)).toHaveTextContent("13 actions");
  fireEvent.click(screen.getByRole("button", { name: "Find action" }));
  expect(onFind).toHaveBeenCalledTimes(1);
});

it("places pinned actions on their keys with empty keys between them", () => {
  const actions = numbered(14);
  actions[11] = { ...actions[11], shortcut: "a" };
  actions[12] = { ...actions[12], shortcut: "s" };
  actions[0] = { ...actions[0], shortcut: "å" };
  actions[13] = { ...actions[13], shortcut: "none" };
  const { container } = pad(actions);
  // Without a bottom row, the header's Find action counts the action without a key.
  expect(screen.getByRole("button", { name: "Find action, 1 more" })).toHaveClass("dq-pad-find-button");
  const [first, second] = rows(container);
  // The Auto actions fill the first row around the pin on å; a and s sit alone on the second.
  const tileKeys = (row: HTMLElement) =>
    [...row.querySelectorAll(".dq-pad-tile")].map((tile) => tile.getAttribute("aria-keyshortcuts"));
  expect(tileKeys(first)).toEqual(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"]);
  expect(tileKeys(second)).toEqual(["a", "s"]);
  expect(within(first).getByRole("button", { name: "q Action 2" })).toBeInTheDocument();
  expect(within(first).getByRole("button", { name: "å Action 1" })).toBeInTheDocument();
  expect(within(second).getByRole("button", { name: "a Action 12" })).toBeInTheDocument();
  expect(within(second).getByRole("button", { name: "s Action 13" })).toBeInTheDocument();
  expect(second.querySelectorAll(".dq-pad-free")).toHaveLength(9);
  expect(rows(container)).toHaveLength(2);
});

it("leaves out rows without actions, keeping the bottom row's Find action with its count", () => {
  // One action on z, one without a key, the rest nowhere.
  const actions: MediaReviewAction[] = [
    { id: "z", label: "Low", steps: [], shortcut: "z" },
    { id: "none", label: "Hidden", steps: [], shortcut: "none" },
  ];
  const { container } = pad(actions);
  expect(rows(container)).toHaveLength(1);
  expect(within(rows(container)[0]).getByRole("button", { name: "z Low" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Hidden/ })).not.toBeInTheDocument();
  // One Find action: the bottom row's tile, counting the action without a key.
  expect(screen.getAllByRole("button", { name: /^Find action/ })).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Find action, 1 more" })).toBeInTheDocument();
  expect(effectLine(container)).toHaveTextContent("2 actions · 1 on keys, 1 more under -");
});

it("adds the bottom row, z to the period, with Find action counting the actions past the last key", () => {
  const { container, onApply, onFind } = pad(numbered(34));
  expect(rows(container)).toHaveLength(3);
  const bottom = rows(container)[2];
  expect(within(bottom).getByRole("button", { name: "z Action 23" })).toBeInTheDocument();
  expect(within(bottom).getByRole("button", { name: "b Action 27" })).toBeInTheDocument();
  // n, m, comma and period hold actions 28 to 31, then comes the Find action tile.
  expect([...bottom.querySelectorAll("kbd")].map((key) => key.textContent)).toEqual([
    ..."zxcvbnm,.",
    "-",
  ]);
  for (const [key, number] of [["n", 28], ["m", 29], [",", 30], [".", 31]] as const) {
    // Screen readers may skip punctuation, so the comma and period are named in words.
    const spoken = key === "," ? "Comma" : key === "." ? "Period" : key;
    const tile = within(bottom).getByRole("button", { name: `${spoken} Action ${number}` });
    expect(tile).toHaveAttribute("aria-keyshortcuts", key);
    fireEvent.click(tile);
  }
  expect(onApply.mock.calls.map(([action]) => action.label)).toEqual([
    "Action 28",
    "Action 29",
    "Action 30",
    "Action 31",
  ]);
  expect(bottom).not.toHaveTextContent("Mute");
  expect(screen.queryByRole("button", { name: /Action 32/ })).not.toBeInTheDocument();
  fireEvent.click(within(bottom).getByRole("button", { name: "Find action, 3 more" }));
  expect(onFind).toHaveBeenCalledTimes(1);
  expect(screen.getAllByRole("button", { name: /^Find action/ })).toHaveLength(1);
  expect(effectLine(container)).toHaveTextContent("34 actions · 31 on keys, 3 more under -");
});

it("leaves an empty m, comma and period dimmed and unlabelled, like every empty key", () => {
  const { container } = pad(numbered(28));
  const bottom = rows(container)[2];
  expect(within(bottom).getByRole("button", { name: "n Action 28" })).toBeInTheDocument();
  const empty = [...bottom.querySelectorAll(".dq-pad-free")];
  expect(empty.map((slot) => slot.textContent)).toEqual(["m", ",", "."]);
  expect(bottom.querySelector(".dq-pad-free .dq-sr-only")).toBeNull();
  for (const slot of empty) {
    expect(slot).toHaveAttribute("title", "No action on this key: it does nothing here");
    expect(slot.querySelector(".dq-pad-label")).toBeNull();
  }
  expect(bottom).not.toHaveTextContent("Mute");
});

it("applies, stays with Shift, and marks absence actions", () => {
  const actions: MediaReviewAction[] = [
    { id: "a", label: "Present", steps: [{ mode: "ADD", tagIds: [1] }] },
    { id: "b", label: "Not visible", steps: [{ mode: "MARK_ABSENT", tagIds: [2] }] },
    { id: "c", label: "Next", steps: [] },
  ];
  const { onApply } = pad(actions, { disabled: (action) => action.id === "b" });
  fireEvent.click(screen.getByRole("button", { name: "q Present" }));
  fireEvent.click(screen.getByRole("button", { name: "q Present" }), { shiftKey: true });
  expect(onApply.mock.calls).toEqual([
    [actions[0], false],
    [actions[0], true],
  ]);
  const absent = screen.getByRole("button", { name: "w Not visible absent" });
  expect(absent).toBeDisabled();
});

it("has no Apply and stay button on its tiles: Shift is the way, as its hint says", () => {
  const { container } = pad([
    { id: "a", label: "Present", steps: [{ mode: "ADD", tagIds: [1] }] },
    { id: "b", label: "Not visible", steps: [{ mode: "MARK_ABSENT", tagIds: [2] }] },
  ]);
  expect(screen.queryByRole("button", { name: /apply and stay/i })).not.toBeInTheDocument();
  // Each tile is the only control in its place, so Tab goes from tile to tile.
  const slots = [...container.querySelectorAll(".dq-pad-slot:not(.dq-pad-free)")];
  expect(slots).toHaveLength(2);
  for (const slot of slots) expect(slot.querySelectorAll("button")).toHaveLength(1);
  expect(screen.getByRole("region", { name: "Actions" })).toHaveTextContent(
    "Shift+ key or Shift-click applies and stays",
  );
});

it("previews the tile under the pointer or with focus, in words above the pad", async () => {
  const actions: MediaReviewAction[] = [
    {
      id: "a",
      label: "Choose child",
      steps: [
        { mode: "ADD", tagIds: [11] },
        { mode: "REMOVE_TREE", tagIds: [10] },
      ],
    },
    { id: "b", label: "Other", steps: [{ mode: "ADD", tagIds: [12] }] },
  ];
  const { container, preview } = pad(actions, {
    trees: new Map([[10, [10, 11, 12]]]),
    tags: { ids: [12], names: ["Tag 12"], absent: [] },
  });
  const tile = screen.getByRole("button", { name: "q Choose child" });
  const slot = tile.parentElement!;
  fireEvent.mouseEnter(slot);
  expect(preview.get()).toBe(actions[0]);
  await waitFor(() =>
    expect(effectLine(container)).toHaveTextContent("qChoose child+ Tag 11− rest of Tag 10"),
  );
  fireEvent.mouseLeave(slot);
  expect(preview.get()).toBeNull();
  expect(effectLine(container)).toHaveTextContent("2 actions");
  // Focus previews too.
  act(() => tile.focus());
  expect(preview.get()).toBe(actions[0]);
  act(() => screen.getByRole("button", { name: "w Other" }).focus());
  expect(preview.get()).toBe(actions[1]);
  // An action that would change nothing on this item says so.
  await waitFor(() => expect(effectLine(container)).toHaveTextContent("wOther+ Tag 12· already so here"));
  act(() => (document.activeElement as HTMLElement).blur());
  expect(preview.get()).toBeNull();
});

it("does not call an action a no-op while one of its trees is still loading", async () => {
  const actions: MediaReviewAction[] = [
    { id: "a", label: "Clear", steps: [{ mode: "REMOVE_TREE", tagIds: [10] }] },
  ];
  const { container } = pad(actions, { tags: { ids: [], names: [], absent: [] } });
  fireEvent.mouseEnter(screen.getByRole("button", { name: "q Clear" }).parentElement!);
  await waitFor(() => expect(effectLine(container)).toHaveTextContent("qClear− Tag 10 tree"));
  expect(effectLine(container)).not.toHaveTextContent("already so here");
});

it("describes each tile's effect for assistive technology", async () => {
  pad([{ id: "a", label: "Present", steps: [{ mode: "ADD", tagIds: [1] }] }]);
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "q Present" })).toHaveAccessibleDescription("+ Tag 1"),
  );
});

it("says its actions wait while the review is edited, and previews none of them", () => {
  const { container, preview } = pad(numbered(2), { paused: true, disabled: () => true });
  const region = screen.getByRole("region", { name: "Actions, paused while editing" });
  expect(region).toHaveTextContent("Actions are paused while you edit the review");
  expect(region).not.toHaveTextContent("applies and stays");
  expect(container.querySelector(".dq-pad-effect")).toBeNull();
  const tile = screen.getByRole("button", { name: "q Action 1" });
  expect(tile).toBeDisabled();
  fireEvent.mouseEnter(tile.parentElement!);
  expect(preview.get()).toBeNull();
});

describe("phone-sized windows", () => {
  const mobileTiles = (group: HTMLElement) =>
    [...group.querySelectorAll<HTMLElement>("button")].map((tile) => tile.getAttribute("aria-keyshortcuts"));

  it("lays the actions out as plain buttons in key order, one group per keyboard row, without key caps or empty keys", async () => {
    setViewportWidth(390);
    const actions = numbered(14);
    actions[0] = { ...actions[0], shortcut: "å" };
    actions[11] = { ...actions[11], shortcut: "a" };
    actions[12] = { ...actions[12], shortcut: "s" };
    actions[13] = { ...actions[13], shortcut: "none" };
    actions.push({ id: "absent", label: "Not visible", steps: [{ mode: "MARK_ABSENT", tagIds: [2] }], shortcut: "z" });
    const { container, onApply, onFind } = pad(actions);
    const region = screen.getByRole("region", { name: "Actions" });
    expect(region).toHaveClass("dq-pad-mobile");
    // No key caps, empty or fixed keys or keyboard row offsets.
    expect(region.querySelector("kbd")).toBeNull();
    expect(region.querySelector(".dq-pad-row, .dq-pad-slot")).toBeNull();
    // In key order: the Auto actions around the pin on å, a and s alone, then z and Find.
    const groups = [...region.querySelectorAll<HTMLElement>(".dq-mobile-group")];
    expect(groups).toHaveLength(3);
    expect(mobileTiles(groups[0])).toEqual(["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å"]);
    expect(mobileTiles(groups[1])).toEqual(["a", "s"]);
    expect(mobileTiles(groups[2])).toEqual(["z", "-"]);
    // Labels without their keys, the absence marker kept; the keys still work and are announced.
    expect(within(groups[0]).getByRole("button", { name: "Action 2" })).toHaveAttribute("aria-keyshortcuts", "q");
    expect(within(groups[0]).getByRole("button", { name: "Action 1" })).toHaveAttribute("aria-keyshortcuts", "å");
    expect(within(groups[2]).getByRole("button", { name: "Not visible absent" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Action 14/ })).not.toBeInTheDocument();
    await waitFor(() =>
      expect(within(groups[1]).getByRole("button", { name: "Action 12" })).toHaveAccessibleDescription("+ Tag 111"),
    );
    // Find is named Find, as it reads, without the - key's cap, and counts the action without a key.
    const find = within(groups[2]).getByRole("button", { name: "Find, 1 more" });
    expect(find).toHaveTextContent(/^Find1 more$/);
    fireEvent.click(find);
    expect(onFind).toHaveBeenCalledTimes(1);
    // The count alone above the buttons, with no key hints.
    expect(effectLine(container)).toHaveTextContent(/^15 actions$/);
    expect(region).not.toHaveTextContent("applies and stays");
    // A tap applies and moves on.
    fireEvent.click(within(groups[1]).getByRole("button", { name: "Action 12" }));
    expect(onApply).toHaveBeenCalledWith(actions[11], false);
    // Touch-sized buttons whose labels may take up to three lines, groups further apart than the
    // buttons within them.
    const tile = within(groups[1]).getByRole("button", { name: "Action 12" });
    expect(parseFloat(getComputedStyle(tile).minHeight)).toBeGreaterThanOrEqual(44);
    expect(getComputedStyle(tile.querySelector(".dq-mobile-label")!).getPropertyValue("-webkit-line-clamp")).toBe("3");
    const between = parseFloat(getComputedStyle(region.querySelector(".dq-mobile-actions")!).gap);
    const inGroup = parseFloat(getComputedStyle(groups[0]).gap);
    expect(inGroup).toBeGreaterThan(0);
    expect(between).toBeGreaterThan(inGroup);
    // Find alone when no action has a key.
    cleanup();
    pad([{ id: "none", label: "Hidden", steps: [], shortcut: "none" }]);
    const only = screen.getByRole("region", { name: "Actions" }).querySelectorAll(".dq-mobile-group");
    expect(only).toHaveLength(1);
    expect(within(only[0] as HTMLElement).getAllByRole("button")).toEqual([
      screen.getByRole("button", { name: "Find, 1 more" }),
    ]);
  });

  it("switches between the keyboard layout and the buttons at 760 px", () => {
    setViewportWidth(761);
    pad(numbered(13));
    const region = () => screen.getByRole("region", { name: "Actions" });
    expect(region()).not.toHaveClass("dq-pad-mobile");
    expect(screen.getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
    expect(region().querySelectorAll(".dq-pad-free").length).toBeGreaterThan(0);
    act(() => setViewportWidth(760));
    expect(region()).toHaveClass("dq-pad-mobile");
    expect(screen.getByRole("button", { name: "Action 1" })).toBeInTheDocument();
    expect(region().querySelector("kbd, .dq-pad-free")).toBeNull();
    act(() => setViewportWidth(1280));
    expect(region()).not.toHaveClass("dq-pad-mobile");
    expect(screen.getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
  });

  it("offers Stay on this item: taps then apply and stay, while an action without steps still moves on", () => {
    setViewportWidth(390);
    const actions: MediaReviewAction[] = [
      { id: "a", label: "Present", steps: [{ mode: "ADD", tagIds: [1] }] },
      { id: "c", label: "Next", steps: [] },
    ];
    const onApply = vi.fn();
    function Harness() {
      const [stay, setStay] = useState(false);
      return (
        <ActionPad
          actions={actions}
          isDisabled={() => false}
          busy={false}
          tags={null}
          trees={new Map()}
          preview={createActionPreviewStore()}
          onApply={onApply}
          onFind={() => {}}
          findDisabled={false}
          stayOnTap={stay}
          onStayOnTapChange={setStay}
        />
      );
    }
    render(<Harness />);
    const toggle = screen.getByRole("switch", { name: "Stay on this item" });
    expect(toggle).not.toBeChecked();
    expect(parseFloat(getComputedStyle(toggle).minHeight)).toBeGreaterThanOrEqual(44);
    const present = screen.getByRole("button", { name: "Present" });
    fireEvent.click(present);
    fireEvent.click(present, { shiftKey: true });
    fireEvent.click(toggle);
    expect(toggle).toBeChecked();
    fireEvent.click(present);
    // Staying on an item with an action that changes nothing would do nothing at all.
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(toggle);
    expect(toggle).not.toBeChecked();
    fireEvent.click(present);
    expect(onApply.mock.calls).toEqual([
      [actions[0], false],
      [actions[0], true],
      [actions[0], true],
      [actions[1], false],
      [actions[0], false],
    ]);
    // Wider windows have no switch, and a click there moves on even with it left on.
    fireEvent.click(toggle);
    act(() => setViewportWidth(1024));
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "q Present" }));
    expect(onApply).toHaveBeenLastCalledWith(actions[0], false);
    // Back at phone width the switch shows it is still on.
    act(() => setViewportWidth(390));
    expect(screen.getByRole("switch", { name: "Stay on this item" })).toBeChecked();
  });

  it("previews under a mouse or with focus, never on touch, without a key cap, and a tap ends the preview", async () => {
    setViewportWidth(390);
    const { container, preview } = pad(numbered(2));
    const tile = screen.getByRole("button", { name: "Action 1" });
    // A touch "entering" the button, and the mouse events a browser makes up for it, preview
    // nothing: on iOS a page changing then can swallow the tap.
    fireEvent.pointerEnter(tile, { pointerType: "touch" });
    fireEvent.mouseEnter(tile);
    expect(preview.get()).toBeNull();
    fireEvent.pointerEnter(tile, { pointerType: "mouse" });
    expect(preview.get()).not.toBeNull();
    await waitFor(() => expect(effectLine(container)).toHaveTextContent(/^Action 1\+ Tag 100$/));
    expect(effectLine(container).querySelector("kbd")).toBeNull();
    fireEvent.pointerLeave(tile, { pointerType: "mouse" });
    expect(preview.get()).toBeNull();
    // A tap that focused the button (as Android does) leaves no preview for the next item.
    act(() => tile.focus());
    expect(preview.get()).not.toBeNull();
    fireEvent.click(tile);
    expect(preview.get()).toBeNull();
    act(() => tile.blur());
    expect(preview.get()).toBeNull();
  });

  it("ends a preview when the window crosses the breakpoint, which takes its tile away", async () => {
    setViewportWidth(1024);
    const actions = numbered(2);
    const { container, preview } = pad(actions);
    fireEvent.mouseEnter(screen.getByRole("button", { name: "q Action 1" }).parentElement!);
    await waitFor(() => expect(effectLine(container)).toHaveTextContent(/Action 1/));
    // The tile under the pointer goes with the keyboard layout, and no pointer leaves it.
    act(() => setViewportWidth(390));
    expect(preview.get()).toBeNull();
    expect(effectLine(container)).toHaveTextContent(/^2 actions$/);
    // The other way round too: a button focused on the phone layout goes with it.
    act(() => screen.getByRole("button", { name: "Action 2" }).focus());
    expect(preview.get()).toBe(actions[1]);
    act(() => setViewportWidth(1024));
    expect(preview.get()).toBeNull();
    expect(effectLine(container)).not.toHaveTextContent(/Action 2/);
  });

  it("says its buttons wait while the review is edited, and previews none of them", () => {
    setViewportWidth(390);
    const { preview } = pad(numbered(2), { paused: true, disabled: () => true });
    const region = screen.getByRole("region", { name: "Actions, paused while editing" });
    expect(region).toHaveClass("dq-pad-mobile dq-pad-paused");
    expect(region).toHaveTextContent("Actions are paused while you edit the review");
    const tile = screen.getByRole("button", { name: "Action 1" });
    expect(tile).toBeDisabled();
    fireEvent.pointerEnter(tile, { pointerType: "mouse" });
    expect(preview.get()).toBeNull();
    expect(screen.getByRole("button", { name: "Find" })).toBeDisabled();
    // The note wraps beside the Stay switch rather than running under it.
    expect(getComputedStyle(region.querySelector(".dq-pad-paused-note")!).whiteSpace).toBe("normal");
  });
});

describe("answer groups", () => {
  // "Kind" (two actions, names matching ignoring case), "Size" (a size and a recorded absence) and
  // an ungrouped action.
  const grouped: MediaReviewAction[] = [
    { id: "one", label: "Kind one", group: "Kind", steps: [{ mode: "ADD", tagIds: [1] }] },
    { id: "two", label: "Kind two", group: "KIND ", steps: [{ mode: "ADD", tagIds: [2] }] },
    { id: "small", label: "Small", group: "Size", steps: [{ mode: "ADD", tagIds: [11] }] },
    { id: "none", label: "No size", group: "Size", steps: [{ mode: "MARK_ABSENT", tagIds: [11] }] },
    { id: "note", label: "Note", steps: [{ mode: "ADD", tagIds: [30] }] },
    // In a group, but without steps it answers nothing: never marked.
    { id: "next", label: "Next one", group: "Size", steps: [] },
  ];
  const items = () =>
    within(screen.getByRole("list", { name: "Answer groups" }))
      .getAllByRole("listitem")
      .map((item) => [item.textContent, item.dataset.state]);
  const marked = (container: HTMLElement) =>
    [...container.querySelectorAll<HTMLElement>("[data-group-open]")].map((tile) => tile.title);

  it("lists the groups with the item's answers in the header and marks the open groups' actions", async () => {
    const { container } = pad(grouped, {
      waitForGroups: true,
      tags: { ids: [2, 30], names: [], absent: [] },
    });
    const header = container.querySelector(".dq-pad-header")!;
    expect(within(header as HTMLElement).getByRole("list", { name: "Answer groups" })).toBeInTheDocument();
    expect(items()).toEqual([
      ["Kind, answered: Kind two", "answered"],
      ["Size, not answered yet", "open"],
    ]);
    expect(marked(container)).toEqual(["Small", "No size"]);
    // Each tile's description names the open group it answers; the others only their effect.
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "r No size absent" })).toHaveAccessibleDescription(
        "Mark Tag 11 absent. Size: not answered yet",
      ),
    );
    expect(screen.getByRole("button", { name: "q Kind one" })).toHaveAccessibleDescription("+ Tag 1");
    expect(screen.getByRole("button", { name: "y Next one" })).toHaveAccessibleDescription("Skip");
  });

  it("keeps the checklist, the Shift hint and Find action together, each group's full text in its tooltip", () => {
    const { container } = pad(grouped, {
      waitForGroups: true,
      tags: { ids: [1, 2], names: [], absent: [] },
    });
    const header = container.querySelector<HTMLElement>(".dq-pad-header")!;
    expect(header).toHaveClass("dq-pad-header-groups");
    // Together on the header's second line, under the effect line.
    const end = header.querySelector<HTMLElement>(":scope > .dq-pad-header-end")!;
    expect([...end.children].map((child) => child.className)).toEqual([
      "dq-group-checklist",
      "dq-pad-hint",
      "dq-pad-find-button",
    ]);
    // A name or answer cut short by the header is there in full.
    expect(
      within(end).getAllByRole("listitem").map((item) => item.getAttribute("title")),
    ).toEqual(["Kind: Kind one, Kind two", "Size: not answered yet"]);
  });

  it("leaves the header of a review without groups as it was", () => {
    const { container } = pad(numbered(2));
    const header = container.querySelector<HTMLElement>(".dq-pad-header")!;
    expect(header).not.toHaveClass("dq-pad-header-groups");
    expect([...header.children].map((child) => child.className)).toEqual([
      "dq-pad-effect dq-pad-summary",
      "dq-pad-hint",
      "dq-pad-find-button",
    ]);
  });

  it("names the groups alone until the item's tags are known", () => {
    const { container, rerender } = pad(grouped, { waitForGroups: true });
    expect(items()).toEqual([
      ["Kind", "unknown"],
      ["Size", "unknown"],
    ]);
    expect(marked(container)).toEqual([]);
    rerender(
      <ActionPad
        actions={grouped}
        isDisabled={() => false}
        busy={false}
        tags={{ ids: [], names: [], absent: [11] }}
        trees={new Map()}
        preview={createActionPreviewStore()}
        onApply={() => {}}
        onFind={() => {}}
        findDisabled={false}
        waitForGroups
      />,
    );
    expect(items()).toEqual([
      ["Kind, not answered yet", "open"],
      ["Size, answered: No size", "answered"],
    ]);
    expect(marked(container)).toEqual(["Kind one", "Kind two"]);
  });

  it("shows nothing of the groups while the review does not wait for them or is edited", () => {
    const tags = { ids: [], names: [], absent: [] };
    const { container, unmount } = pad(grouped, { tags });
    expect(screen.queryByRole("list", { name: "Answer groups" })).toBeNull();
    expect(marked(container)).toEqual([]);
    unmount();
    const paused = pad(grouped, { tags, waitForGroups: true, paused: true, disabled: () => true });
    expect(screen.queryByRole("list", { name: "Answer groups" })).toBeNull();
    expect(marked(paused.container)).toEqual([]);
  });

  it("puts the checklist above the buttons in phone-sized windows and marks the open groups' buttons", () => {
    setViewportWidth(390);
    const { container } = pad(grouped, {
      waitForGroups: true,
      tags: { ids: [1], names: [], absent: [] },
    });
    const region = screen.getByRole("region", { name: "Actions" });
    const list = within(region).getByRole("list", { name: "Answer groups" });
    const buttons = region.querySelector(".dq-mobile-actions")!;
    expect(list.compareDocumentPosition(buttons) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(region.querySelector(".dq-pad-header")!.contains(list)).toBe(false);
    expect(getComputedStyle(list).flexWrap).toBe("wrap");
    expect(items()).toEqual([
      ["Kind, answered: Kind one", "answered"],
      ["Size, not answered yet", "open"],
    ]);
    expect(marked(container)).toEqual(["Small", "No size"]);
  });
});

describe("attention", () => {
  // A size question and a kind question; the performer needs attention in Size (flagged, mixed
  // answers) and for the whole review.
  const actions: MediaReviewAction[] = [
    { id: "small", label: "Small", group: "Size", steps: [{ mode: "ADD", tagIds: [11] }] },
    {
      id: "large",
      label: "Large",
      group: "Size",
      steps: [
        { mode: "ADD", tagIds: [12] },
        { mode: "REMOVE_TREE", tagIds: [10] },
      ],
    },
    { id: "one", label: "Kind one", group: "Kind", steps: [{ mode: "ADD", tagIds: [21] }] },
    // Clearing an absence changes no answer.
    { id: "clear", label: "Clear", steps: [{ mode: "CLEAR_ABSENCE", tagIds: [11] }] },
    // Removes the size tree without adding a size: it still changes the category.
    { id: "reset", label: "Reset", steps: [{ mode: "REMOVE_TREE", tagIds: [10] }] },
  ];
  const size: AttentionEntry = {
    key: "tag:10",
    name: "Size",
    tagIds: [10, 11, 12],
    flags: ["Changed"],
    mixed: [
      { id: 11, name: "Small", count: 40 },
      { id: 12, name: "Large", count: 12 },
    ],
  };
  const whole: AttentionEntry = {
    key: "review",
    name: "",
    tagIds: null,
    flags: ["Anything"],
    mixed: [],
  };
  const flagged = (container: HTMLElement) =>
    [...container.querySelectorAll<HTMLElement>(".dq-pad-tile[data-attention]")].map(
      (tile) => tile.title,
    );
  // A count stays on the line of its answer.
  const reasons = "Size (Flagged: Changed; Mixed: Small\u00a040 · Large\u00a012)";

  it("flags the keys whose actions touch a category that needs attention, with the reasons", async () => {
    const { container } = pad(actions, {
      attention: [whole, size],
      tags: { ids: [], names: [], absent: [] },
    });
    expect(flagged(container)).toEqual(["Small", "Large", "Reset"]);
    const small = screen.getByRole("button", { name: "q Small" });
    expect(small.querySelector(".dq-pad-flag")).toHaveAttribute("title", `Needs attention: ${reasons}`);
    // The mark is for the eye: the tile's description says it, its name stays as it was.
    expect(small.querySelector(".dq-pad-flag")).toHaveAttribute("aria-hidden", "true");
    await waitFor(() =>
      expect(small).toHaveAccessibleDescription(`+ Tag 11. Needs attention: ${reasons}`),
    );
    expect(screen.getByRole("button", { name: "e Kind one" })).toHaveAccessibleDescription("+ Tag 21");
    expect(screen.getByRole("button", { name: "e Kind one" }).querySelector(".dq-pad-flag")).toBeNull();
  });

  it("flags nothing for the whole review alone, nor while the review is edited", () => {
    const { container, unmount } = pad(actions, { attention: [whole] });
    expect(flagged(container)).toEqual([]);
    unmount();
    const paused = pad(actions, { attention: [size], paused: true, disabled: () => true });
    expect(flagged(paused.container)).toEqual([]);
  });

  it("follows a tree removal to the tree it resolves to", () => {
    const kind: AttentionEntry = { ...size, key: "tag:20", name: "Kind", tagIds: [20, 21] };
    // Tag 10's tree reaches into Kind here, so removing it changes Kind too.
    const { container } = pad(actions, { attention: [kind], trees: new Map([[10, [10, 11, 12, 21]]]) });
    expect(flagged(container)).toEqual(["Large", "Kind one", "Reset"]);
  });

  it("flags the answer groups whose answers touch such a category in the checklist", () => {
    pad(actions, {
      attention: [size],
      waitForGroups: true,
      tags: { ids: [11], names: [], absent: [] },
    });
    const items = within(screen.getByRole("list", { name: "Answer groups" })).getAllByRole(
      "listitem",
    );
    expect(items.map((item) => item.dataset.attention ?? "")).toEqual(["true", ""]);
    // Text content reads the non-breaking spaces as plain ones.
    expect(items[0]).toHaveTextContent(
      `Size, needs attention: ${reasons.replace(/\u00a0/g, " ")}, answered: Small`,
    );
    expect(items[0]).toHaveAttribute("title", `Size: Small. Needs attention: ${reasons}`);
    expect(items[1]).toHaveAttribute("title", "Kind: not answered yet");
    expect(items[0].querySelector(".dq-group-flag svg")).not.toBeNull();
  });

  it("names each category once for a group whose actions touch it", () => {
    const kind: AttentionEntry = { ...size, key: "tag:20", name: "Kind", tagIds: [20, 21], mixed: [] };
    // Both Size answers touch Size; the second also removes Kind's tag.
    const twoWays: MediaReviewAction[] = [
      { id: "s", label: "Small", group: "Size", steps: [{ mode: "ADD", tagIds: [11] }] },
      {
        id: "l",
        label: "Large",
        group: "Size",
        steps: [
          { mode: "ADD", tagIds: [12] },
          { mode: "REMOVE", tagIds: [21] },
        ],
      },
    ];
    pad(twoWays, { attention: [size, kind], waitForGroups: true, tags: { ids: [], names: [], absent: [] } });
    const [group] = within(screen.getByRole("list", { name: "Answer groups" })).getAllByRole("listitem");
    expect(group).toHaveAttribute(
      "title",
      `Size: not answered yet. Needs attention: ${reasons}; Kind (Flagged: Changed)`,
    );
  });

  it("flags the buttons in phone-sized windows too", () => {
    setViewportWidth(390);
    const { container } = pad(actions, { attention: [size] });
    const buttons = [...container.querySelectorAll<HTMLElement>(".dq-mobile-tile[data-attention]")];
    expect(buttons.map((button) => button.title)).toEqual(["Small", "Large", "Reset"]);
    expect(buttons[0].querySelector(".dq-pad-flag")).toHaveAttribute(
      "title",
      `Needs attention: ${reasons}`,
    );
  });
});
