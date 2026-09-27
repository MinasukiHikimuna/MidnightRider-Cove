import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { ActionBar } from "../ActionBar";
import type { MediaReviewAction, TagReviewAction } from "../model";

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
  const { onApply, onFind, region } = bar(actions(29));
  const tiles = within(region).getAllByRole("button", { name: /^[a-zåäö] Action/ });
  expect(tiles).toHaveLength(27);
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
  // 21 tiles: 7 rows beside the summary (3 a row), 1 + 3 rows under it (8 a row).
  expect(bar(actions(20)).region).toHaveClass("dq-bar-stacked");
});

it("keeps the summary beside the tiles when that takes no more rows", () => {
  layout({ "dq-action-bar": 1000, "dq-bar-summary": 300, "dq-bar-hints": 250, "dq-bar-tile": 120 });
  // 4 tiles: 2 rows beside the summary, 1 + 1 under it.
  expect(bar(actions(3)).region).not.toHaveClass("dq-bar-stacked");
});
