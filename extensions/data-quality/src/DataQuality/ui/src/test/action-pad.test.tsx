import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { ActionPad, createActionPreviewStore } from "../ActionPad";
import type { MediaKind, MediaReviewAction } from "../model";
import type { TagState } from "../reviewTags";
import { testKeyboardBindings } from "./runtime-components";

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
    mediaKind = "video",
    disabled = () => false,
    trees = new Map(),
    tags = null,
  }: {
    mediaKind?: MediaKind;
    disabled?(action: MediaReviewAction): boolean;
    trees?: Map<number, number[]>;
    tags?: TagState | null;
  } = {},
) {
  const preview = createActionPreviewStore();
  const onApply = vi.fn();
  const onFind = vi.fn();
  const view = render(
    <ActionPad
      actions={actions}
      mediaKind={mediaKind}
      isDisabled={disabled}
      busy={false}
      tags={tags}
      trees={trees}
      preview={preview}
      onApply={onApply}
      onFind={onFind}
      findDisabled={false}
    />,
  );
  return { ...view, preview, onApply, onFind };
}

const rows = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>(".dq-pad-row"),
];
const effectLine = (container: HTMLElement) =>
  container.querySelector(".dq-pad-effect") as HTMLElement;

it("lays actions on the keyboard rows they use and names what unassigned keys still do", () => {
  const { container, onFind } = pad(numbered(13));
  expect(rows(container)).toHaveLength(2);
  expect(rows(container)[0].querySelectorAll(".dq-pad-slot")).toHaveLength(11);
  expect(screen.getByRole("button", { name: "q Action 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "å Action 11" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "s Action 13" })).toBeInTheDocument();
  // f, g and k keep Cove's meaning while their slots are empty, and say which.
  const second = rows(container)[1];
  expect(second).toHaveTextContent("Fullscreen · filters");
  expect(second).toHaveTextContent("Go to…");
  expect(second).toHaveTextContent("Play / pause");
  expect(second.querySelectorAll(".dq-pad-free")).toHaveLength(9);
  // Without a bottom row, Find action lives in the pad's header.
  expect(effectLine(container)).toHaveTextContent("13 actions");
  fireEvent.click(screen.getByRole("button", { name: "Find action" }));
  expect(onFind).toHaveBeenCalledTimes(1);
});

it("adds the bottom row, with Find action counting the actions past the last key", () => {
  const { container, onFind } = pad(numbered(30));
  expect(rows(container)).toHaveLength(3);
  const bottom = rows(container)[2];
  expect(within(bottom).getByRole("button", { name: "z Action 23" })).toBeInTheDocument();
  expect(within(bottom).getByRole("button", { name: "b Action 27" })).toBeInTheDocument();
  // n, m, comma and full stop are not action keys; with a video, m still mutes.
  expect([...bottom.querySelectorAll(".dq-pad-fixed kbd")].map((key) => key.textContent)).toEqual([
    "n",
    "m",
    ",",
    ".",
  ]);
  expect(bottom).toHaveTextContent("Mute");
  expect(screen.queryByRole("button", { name: /Action 28/ })).not.toBeInTheDocument();
  fireEvent.click(within(bottom).getByRole("button", { name: "Find action, 3 more" }));
  expect(onFind).toHaveBeenCalledTimes(1);
  expect(screen.getAllByRole("button", { name: /^Find action/ })).toHaveLength(1);
  expect(effectLine(container)).toHaveTextContent("30 actions · 27 on keys, 3 more under -");
});

it("shows audio reviews only the Cove keys that still act without a video", () => {
  const { container } = pad(numbered(12), { mediaKind: "audio" });
  const second = rows(container)[1];
  expect(second).toHaveTextContent("Filters");
  expect(second).not.toHaveTextContent("Fullscreen");
  expect(second).not.toHaveTextContent("Play / pause");
});

it("labels each tile with the key Cove's active preset gives it", () => {
  testKeyboardBindings["action-01"] = ["1", "Shift+1"];
  testKeyboardBindings["action-02"] = [];
  testKeyboardBindings["action-15"] = ["Ctrl+f"];
  const { container } = pad(numbered(12));
  // Tiles keep their places; the caps follow the preset.
  expect(screen.getByRole("button", { name: "1 Action 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Action 2" }).querySelector("kbd")).toBeNull();
  // A rebound empty slot no longer claims Cove's meaning for f.
  const fSlot = rows(container)[1].querySelectorAll(".dq-pad-slot")[3];
  expect(fSlot).toHaveTextContent("Ctrl+f");
  expect(fSlot).not.toHaveTextContent("Fullscreen");
});

it("applies, stays with the pin or Shift, and marks absence actions", () => {
  const actions: MediaReviewAction[] = [
    { id: "a", label: "Present", steps: [{ mode: "ADD", tagIds: [1] }] },
    { id: "b", label: "Not visible", steps: [{ mode: "MARK_ABSENT", tagIds: [2] }] },
    { id: "c", label: "Next", steps: [] },
  ];
  const { onApply } = pad(actions, { disabled: (action) => action.id === "b" });
  fireEvent.click(screen.getByRole("button", { name: "q Present" }));
  fireEvent.click(screen.getByRole("button", { name: "q Present" }), { shiftKey: true });
  fireEvent.click(screen.getByRole("button", { name: "Apply and stay: Present" }));
  expect(onApply.mock.calls).toEqual([
    [actions[0], false],
    [actions[0], true],
    [actions[0], true],
  ]);
  const absent = screen.getByRole("button", { name: "w Not visible absent" });
  expect(absent).toBeDisabled();
  expect(screen.getByRole("button", { name: "Apply and stay: Not visible" })).toBeDisabled();
  // An action without steps only moves on, so it has nothing to apply and stay.
  expect(screen.queryByRole("button", { name: "Apply and stay: Next" })).not.toBeInTheDocument();
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
  // Focus previews too, and moving to the tile's pin keeps the preview.
  act(() => tile.focus());
  expect(preview.get()).toBe(actions[0]);
  const pin = screen.getByRole("button", { name: "Apply and stay: Choose child" });
  act(() => pin.focus());
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
