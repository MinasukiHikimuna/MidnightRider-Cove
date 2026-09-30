import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ActionBar } from "../ActionBar";
import { KeyCap } from "../ActionPad";
import type { MediaReviewAction, TagReviewAction } from "../model";
import { setViewportWidth } from "./viewport";
// The bar's own styles, for what phone-sized windows hide (jsdom applies them, without layout).
import "../styles.css";

const api = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: api.request,
}));

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function actions(count: number): MediaReviewAction[] {
  return Array.from({ length: count }, (_, index) => ({
    id: `action-${index + 1}`,
    label: `Action ${index + 1}`,
    steps: [{ mode: "ADD" as const, tagIds: [100 + index] }],
  }));
}

function bar(list: readonly (MediaReviewAction | TagReviewAction)[], props: Partial<Parameters<typeof ActionBar>[0]> = {}) {
  const onApply = vi.fn();
  const onFind = vi.fn();
  const { unmount } = render(
    <ActionBar
      actions={list}
      isDisabled={() => false}
      busy={false}
      onApply={onApply}
      onFind={onFind}
      summary={<p className="dq-bar-target">2 selected</p>}
      hints="Hints"
      {...props}
    />,
  );
  return { onApply, onFind, unmount, region: screen.getByRole("region", { name: "Actions" }) };
}

it("shows a tile per action key, says what each does, and counts the rest under Find action", async () => {
  api.request.mockImplementation(async (path: string) => ({ name: `Tag ${path.split("/").at(-1)}` }));
  const { onApply, onFind, region } = bar(actions(33));
  const tiles = within(region).getAllByRole("button", { name: /^([a-zåäö]|Comma|Period) Action/ });
  expect(tiles).toHaveLength(31);
  // The bottom line ends on n, m, comma and period.
  expect(tiles.slice(-4).map((tile) => tile.getAttribute("aria-keyshortcuts"))).toEqual([
    "n",
    "m",
    ",",
    ".",
  ]);
  expect(within(region).getByRole("button", { name: "Period Action 31" })).toBeInTheDocument();
  const first = within(region).getByRole("button", { name: "q Action 1" });
  expect(first).toHaveAttribute("aria-keyshortcuts", "q");
  await waitFor(() => expect(first).toHaveAccessibleDescription("+ Tag 100"));
  // Pointing at a tile shows its effect just above the bar; leaving it hides the line again.
  fireEvent.mouseEnter(first);
  expect(region.querySelector(".dq-bar-effect")).toHaveTextContent("qAction 1+ Tag 100");
  fireEvent.mouseLeave(first);
  expect(region.querySelector(".dq-bar-effect")).toBeNull();
  fireEvent.click(first);
  expect(onApply).toHaveBeenCalledWith(expect.objectContaining({ label: "Action 1" }));
  const find = within(region).getByRole("button", { name: "Find action, 2 more" });
  expect(find).toHaveAttribute("aria-keyshortcuts", "-");
  fireEvent.click(find);
  expect(onFind).toHaveBeenCalledTimes(1);
});

it("gives each keyboard row that holds actions a line of its own, in key order", () => {
  api.request.mockResolvedValue({ name: "Tag" });
  const list = actions(5);
  // Pinned to s and a, three Auto actions, and one without a key.
  list[0] = { ...list[0], shortcut: "s" };
  list[4] = { ...list[4], shortcut: "a" };
  list.push({ id: "none", label: "Hidden", steps: [], shortcut: "none" });
  const { region } = bar(list);
  const lines = [...region.querySelectorAll<HTMLElement>(".dq-bar-line")];
  expect(lines).toHaveLength(2);
  const labels = (line: HTMLElement) =>
    within(line)
      .getAllByRole("button")
      .map((tile) => tile.getAttribute("aria-label") ?? tile.textContent);
  expect(labels(lines[0])).toEqual(["q Action 2", "w Action 3", "e Action 4"]);
  // The a row keeps its order by key, not by review order, and Find action closes the last line.
  expect(labels(lines[1])).toEqual(["a Action 5", "s Action 1", "Find action, 1 more"]);
  expect(within(region).queryByRole("button", { name: /Hidden/ })).not.toBeInTheDocument();
});

it("keeps Find action when no action has a key", () => {
  const { region } = bar([{ id: "none", label: "Hidden", steps: [], shortcut: "none" }]);
  const lines = [...region.querySelectorAll<HTMLElement>(".dq-bar-line")];
  expect(lines).toHaveLength(1);
  expect(within(lines[0]).getByRole("button", { name: "Find action, 1 more" })).toBeInTheDocument();
});

it("names a tag action's group and says when there are no actions", () => {
  const assign: TagReviewAction = { id: "assign", label: "Classify", effect: { mode: "SET_TAG_GROUP", tagGroupId: 8 } };
  const first = bar([assign], { tagGroups: [{ id: 8, name: "Classification" }] });
  expect(screen.getByRole("button", { name: "q Classify" })).toHaveAccessibleDescription("Assign Classification");
  first.unmount();
  bar([]);
  expect(screen.getByText("This review has no actions.")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Find action/ })).not.toBeInTheDocument();
});

it("reads a running action out and pauses the tiles without fading them", () => {
  const { region } = bar(actions(2), { busy: true, isDisabled: () => true, status: "Applying action to 2 selected videos…" });
  expect(region).toHaveClass("dq-bar-busy");
  expect(region.querySelector(".dq-bar-tiles")).toHaveAttribute("aria-busy", "true");
  expect(within(region).getByRole("status")).toHaveTextContent("Applying action to 2 selected videos…");
  expect(within(region).getByRole("button", { name: "q Action 1" })).toBeDisabled();
});

/** jsdom has no layout: give the bar and its parts fixed widths. */
function layout(widths: Record<string, number>) {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
  const width = (element: HTMLElement) =>
    Object.entries(widths).find(([name]) => element.classList.contains(name))?.[1] ?? 0;
  vi.spyOn(HTMLElement.prototype, "offsetWidth", "get").mockImplementation(function (this: HTMLElement) {
    return width(this);
  });
  vi.spyOn(HTMLElement.prototype, "clientWidth", "get").mockImplementation(function (this: HTMLElement) {
    return width(this);
  });
}

it("puts the summary on a line of its own when the tiles then need fewer rows", () => {
  layout({ "dq-action-bar": 1000, "dq-bar-summary": 300, "dq-bar-hints": 250, "dq-bar-tile": 120 });
  // Lines of 11 tiles and of 9 tiles plus Find action: 4 + 4 rows beside the summary (3 a row),
  // 1 + 2 + 2 under it (8 a row).
  expect(bar(actions(20)).region).toHaveClass("dq-bar-stacked");
});

it("keeps the summary beside the tiles when that takes no more rows", () => {
  layout({ "dq-action-bar": 1000, "dq-bar-summary": 300, "dq-bar-hints": 250, "dq-bar-tile": 120 });
  // 3 tiles on one line: 1 row beside the summary, 1 + 1 under it.
  expect(bar(actions(2)).region).not.toHaveClass("dq-bar-stacked");
});

it("puts the summary on its own line at a tie when that keeps each keyboard row on one line", () => {
  layout({ "dq-action-bar": 1000, "dq-bar-summary": 300, "dq-bar-hints": 250, "dq-bar-tile": 120 });
  // Three actions on q, w, e and three on a, s, d, then Find action: beside the summary (3 a row)
  // the q row fits and the a row wraps, 1 + 2 rows; under it 1 + 1 + 1, the rows unbroken.
  const list = actions(6);
  list[3] = { ...list[3], shortcut: "a" };
  list[4] = { ...list[4], shortcut: "s" };
  list[5] = { ...list[5], shortcut: "d" };
  expect(bar(list).region).toHaveClass("dq-bar-stacked");
});

it("counts every keyboard row's line on its own when choosing the layout", () => {
  layout({ "dq-action-bar": 1000, "dq-bar-summary": 300, "dq-bar-hints": 250, "dq-bar-tile": 120 });
  // Nine actions on the q row and one on a, then Find action: beside the summary (3 a row) the
  // lines take 3 + 1 rows, under it 1 + 2 + 1 with the q row still broken, so the summary stays
  // beside them. As one flow of 11 tiles, they would have taken 4 rows beside it and 1 + 2 under.
  const list = actions(10);
  list[9] = { ...list[9], shortcut: "a" };
  expect(bar(list).region).not.toHaveClass("dq-bar-stacked");
});

it("pauses every tile, Find action included, and says why while the review is edited", () => {
  const { region, onApply, onFind } = bar(actions(2), { paused: true });
  expect(region).toHaveClass("dq-bar-paused");
  expect(within(region).getByText("Actions are paused while you edit the review")).toBeInTheDocument();
  const tile = within(region).getByRole("button", { name: "q Action 1" });
  expect(tile).toBeDisabled();
  expect(within(region).getByRole("button", { name: "Find action" })).toBeDisabled();
  fireEvent.mouseEnter(tile);
  expect(region.querySelector(".dq-bar-effect:not(.dq-bar-paused-note)")).toBeNull();
  fireEvent.click(tile);
  expect(onApply).not.toHaveBeenCalled();
  expect(onFind).not.toHaveBeenCalled();
});

describe("phone-sized windows", () => {
  const keysOf = (group: HTMLElement) =>
    [...group.querySelectorAll<HTMLElement>("button")].map((tile) => tile.getAttribute("aria-keyshortcuts"));
  const summary = (
    <>
      <p className="dq-bar-target">2 selected</p>
      <button type="button" className="dq-text-button">
        Select all
        <KeyCap binding="Ctrl/⌘A" hidden />
      </button>
    </>
  );

  it("shows plain buttons in key order under the summary, one group per keyboard row, without key caps or key hints", async () => {
    setViewportWidth(390);
    api.request.mockImplementation(async (path: string) => ({ name: `Tag ${path.split("/").at(-1)}` }));
    const list = actions(5);
    list[0] = { ...list[0], shortcut: "s" };
    list[4] = { ...list[4], shortcut: "a" };
    list.push({ id: "none", label: "Hidden", steps: [], shortcut: "none" });
    const { region, onApply, onFind } = bar(list, { summary, hints: undefined, keyHints: "Arrows move" });
    expect(region).toHaveClass("dq-bar-mobile");
    expect(region).not.toHaveClass("dq-bar-stacked");
    expect(region.querySelector(".dq-bar-line")).toBeNull();
    const groups = [...region.querySelectorAll<HTMLElement>(".dq-bar-tiles .dq-mobile-group")];
    expect(groups).toHaveLength(2);
    expect(keysOf(groups[0])).toEqual(["q", "w", "e"]);
    expect(keysOf(groups[1])).toEqual(["a", "s", "-"]);
    // Labels without keys; Find named Find, without the - key's cap.
    const first = within(groups[0]).getByRole("button", { name: "Action 2" });
    await waitFor(() => expect(first).toHaveAccessibleDescription("+ Tag 101"));
    const find = within(groups[1]).getByRole("button", { name: "Find, 1 more" });
    expect(find).toHaveTextContent(/^Find1 more$/);
    expect(region.querySelector(".dq-bar-tiles kbd")).toBeNull();
    // The summary's key caps are hidden, and the keyboard hints left out.
    expect(within(region).getByRole("button", { name: /Select all/ }).querySelector("kbd")).not.toBeVisible();
    expect(region).not.toHaveTextContent("Arrows move");
    // Under a mouse, never on touch, the effect line above the bar shows without a key cap, and a
    // tap ends it.
    fireEvent.pointerEnter(first, { pointerType: "touch" });
    fireEvent.mouseEnter(first);
    expect(region.querySelector(".dq-bar-effect")).toBeNull();
    fireEvent.pointerEnter(first, { pointerType: "mouse" });
    expect(region.querySelector(".dq-bar-effect")).toHaveTextContent(/^Action 2\+ Tag 101$/);
    fireEvent.click(first);
    expect(onApply).toHaveBeenCalledWith(list[1]);
    expect(region.querySelector(".dq-bar-effect")).toBeNull();
    fireEvent.click(find);
    expect(onFind).toHaveBeenCalledTimes(1);
    // Touch-sized buttons in a list that scrolls within part of the window.
    expect(parseFloat(getComputedStyle(first).minHeight)).toBeGreaterThanOrEqual(44);
    expect(getComputedStyle(region.querySelector(".dq-bar-tiles")!).overflowY).toBe("auto");
  });

  it("keeps notes, which say why actions cannot run", () => {
    setViewportWidth(390);
    api.request.mockResolvedValue({ name: "Tag" });
    const { region } = bar(actions(1), { hints: "Needs write permission.", keyHints: "Arrows move" });
    expect(within(region).getByText("Needs write permission.")).toBeInTheDocument();
    expect(region).not.toHaveTextContent("Arrows move");
  });

  it("switches between the keyboard rows and the buttons at 760 px", () => {
    setViewportWidth(761);
    api.request.mockResolvedValue({ name: "Tag" });
    const { region } = bar(actions(3), { hints: undefined, keyHints: "Arrows move" });
    expect(region).not.toHaveClass("dq-bar-mobile");
    expect(within(region).getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
    expect(region).toHaveTextContent("Arrows move");
    act(() => setViewportWidth(760));
    expect(region).toHaveClass("dq-bar-mobile");
    expect(within(region).getByRole("button", { name: "Action 1" })).toBeInTheDocument();
    expect(region.querySelector(".dq-bar-tiles kbd")).toBeNull();
    expect(region).not.toHaveTextContent("Arrows move");
    act(() => setViewportWidth(1024));
    expect(region).not.toHaveClass("dq-bar-mobile");
    expect(within(region).getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
  });

  it("ends a preview when the window crosses the breakpoint, which takes its tile away", () => {
    setViewportWidth(1024);
    api.request.mockResolvedValue({ name: "Tag" });
    const { region } = bar(actions(2), { hints: undefined });
    fireEvent.mouseEnter(within(region).getByRole("button", { name: "q Action 1" }));
    expect(region.querySelector(".dq-bar-effect")).toHaveTextContent(/Action 1/);
    act(() => setViewportWidth(390));
    expect(region.querySelector(".dq-bar-effect")).toBeNull();
    act(() => within(region).getByRole("button", { name: "Action 2" }).focus());
    expect(region.querySelector(".dq-bar-effect")).toHaveTextContent(/Action 2/);
    act(() => setViewportWidth(1024));
    expect(region.querySelector(".dq-bar-effect")).toBeNull();
  });

  it("pauses every button, Find included, while the review is edited", () => {
    setViewportWidth(390);
    api.request.mockResolvedValue({ name: "Tag" });
    const { region, onApply } = bar(actions(2), { paused: true });
    expect(region).toHaveClass("dq-bar-mobile dq-bar-paused");
    expect(within(region).getByText("Actions are paused while you edit the review")).toBeInTheDocument();
    const tile = within(region).getByRole("button", { name: "Action 1" });
    expect(tile).toBeDisabled();
    expect(within(region).getByRole("button", { name: "Find" })).toBeDisabled();
    fireEvent.click(tile);
    expect(onApply).not.toHaveBeenCalled();
  });
});
