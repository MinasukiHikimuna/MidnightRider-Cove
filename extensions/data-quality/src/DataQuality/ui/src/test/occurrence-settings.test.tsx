import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, expect, it, vi } from "vitest";
import { PerformerFlagSettings, TagChoiceSettings } from "../OccurrenceReview";
import type { OccurrenceReview } from "../model";

const api = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: api.request,
}));
beforeEach(() => {
  api.request.mockImplementation(async (path: string) => {
    const id = Number(path.split("/").at(-1));
    return { id, name: `Tag ${id}` };
  });
});

const review: OccurrenceReview = {
  id: "r",
  name: "Review",
  description: "",
  entityType: "performerOccurrence",
  actions: [],
  view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
  occurrence: {
    targetMode: "all",
    performerIds: [],
    performerFilter: {},
    condition: "excludesAll",
    conditionTagIds: [21, 22],
    tagIds: [],
    multiple: true,
  },
};

/** Renders the settings as the drawer does: each change becomes the review shown. */
function editFlags(start: OccurrenceReview) {
  let current = start;
  const onChange = vi.fn((next: OccurrenceReview) => {
    current = next;
    view.rerender(<PerformerFlagSettings review={current} onChange={onChange} />);
  });
  const view = render(<PerformerFlagSettings review={current} onChange={onChange} />);
  return { onChange, flags: () => current.occurrence };
}
const pairs = () => within(screen.getByRole("list", { name: "Performer flags" }));

it("adds performer flags for the whole review and pairs each with the category it affects", async () => {
  const { flags } = editFlags(review);
  expect(screen.queryByRole("list", { name: "Performer flags" })).toBeNull();
  fireEvent.change(screen.getByRole("textbox", { name: "Add a performer flag" }), {
    target: { value: "7" },
  });
  expect(flags().performerFlags).toEqual([{ tagId: 7 }]);
  expect(await pairs().findByText("Tag 7")).toBeInTheDocument();
  const affects = pairs().getByRole("textbox", { name: "Affects, Tag 7" });
  expect(affects).toHaveAttribute("placeholder", "Whole review");
  // The condition categories come first, as suggestions.
  const suggestions = within(pairs().getByRole("group", { name: "Suggested categories for Tag 7" }));
  expect(suggestions.getAllByRole("button").map((button) => button.textContent)).toEqual([
    "Whole review",
    "Tag 21",
    "Tag 22",
  ]);
  expect(suggestions.getByRole("button", { name: "Whole review" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  fireEvent.click(suggestions.getByRole("button", { name: "Tag 22" }));
  expect(flags().performerFlags).toEqual([{ tagId: 7, categoryTagId: 22 }]);
  expect(suggestions.getByRole("button", { name: "Tag 22" })).toHaveAttribute("aria-pressed", "true");
  // Any other tag can be searched for.
  fireEvent.change(pairs().getByRole("textbox", { name: "Affects, Tag 7" }), {
    target: { value: "40" },
  });
  expect(flags().performerFlags).toEqual([{ tagId: 7, categoryTagId: 40 }]);
  // The same tag can flag another category too; a pair given twice is kept once.
  fireEvent.change(screen.getByRole("textbox", { name: "Add a performer flag" }), {
    target: { value: "7" },
  });
  fireEvent.change(screen.getByRole("textbox", { name: "Add a performer flag" }), {
    target: { value: "7" },
  });
  expect(flags().performerFlags).toEqual([{ tagId: 7, categoryTagId: 40 }, { tagId: 7 }]);
  // Clearing Affects returns a flag to the whole review.
  fireEvent.change(pairs().getAllByRole("textbox", { name: "Affects, Tag 7" })[0], {
    target: { value: "" },
  });
  expect(flags().performerFlags).toEqual([{ tagId: 7 }]);
  fireEvent.click(pairs().getByRole("button", { name: "Remove flag Tag 7" }));
  expect(flags()).not.toHaveProperty("performerFlags");
  expect(screen.queryByRole("list", { name: "Performer flags" })).toBeNull();
});

it("shows older flag tags as whole-review flags and moves them to the pairs once changed", async () => {
  const older = { ...review, occurrence: { ...review.occurrence, flagPerformerTagIds: [7, 8] } };
  const { flags, onChange } = editFlags(older);
  expect(await pairs().findByText("Tag 8")).toBeInTheDocument();
  expect(pairs().getAllByRole("listitem")).toHaveLength(2);
  expect(onChange).not.toHaveBeenCalled();
  fireEvent.click(
    within(pairs().getByRole("group", { name: "Suggested categories for Tag 8" })).getByRole(
      "button",
      { name: "Tag 21" },
    ),
  );
  expect(flags()).not.toHaveProperty("flagPerformerTagIds");
  expect(flags().performerFlags).toEqual([{ tagId: 7 }, { tagId: 8, categoryTagId: 21 }]);
});

it("offers no category the same tag flags already, and keeps each pair's row as it changes", async () => {
  const { flags } = editFlags({
    ...review,
    occurrence: {
      ...review.occurrence,
      performerFlags: [{ tagId: 7, categoryTagId: 21 }, { tagId: 7 }, { tagId: 8 }],
    },
  });
  expect(await pairs().findByText("Tag 8")).toBeInTheDocument();
  const [first, second] = pairs().getAllByRole("group", { name: "Suggested categories for Tag 7" });
  // The other pair of tag 7 flags the whole review, and the first pair Tag 21.
  expect(within(first).getByRole("button", { name: "Whole review" })).toBeDisabled();
  expect(within(first).getByRole("button", { name: "Tag 22" })).toBeEnabled();
  expect(within(second).getByRole("button", { name: "Tag 21" })).toBeDisabled();
  expect(within(second).getByRole("button", { name: "Whole review" })).toBeEnabled();
  // A category change keeps the row, and its focus, in place.
  const row = pairs().getAllByRole("listitem")[0];
  const button = within(first).getByRole("button", { name: "Tag 22" });
  button.focus();
  fireEvent.click(button);
  expect(flags().performerFlags).toEqual([
    { tagId: 7, categoryTagId: 22 },
    { tagId: 7 },
    { tagId: 8 },
  ]);
  expect(pairs().getAllByRole("listitem")[0]).toBe(row);
  expect(button).toHaveFocus();
});

it("suggests no categories when the condition has none", async () => {
  editFlags({
    ...review,
    occurrence: { ...review.occurrence, condition: "any", performerFlags: [{ tagId: 7 }] },
  });
  expect(await pairs().findByText("Tag 7")).toBeInTheDocument();
  expect(pairs().queryByRole("group")).toBeNull();
});

// The occurrence condition lives in the header's Scope popover (see occurrence-workspace tests).
it("edits a legacy review's tag choices and whether several may be chosen", () => {
  const onChange = vi.fn();
  const legacy = { ...review, occurrence: { ...review.occurrence, tagIds: [31, 32] } };
  render(<TagChoiceSettings review={legacy} onChange={onChange} />);
  const choices = screen.getByPlaceholderText("Search review tag choices...");
  expect(choices).toHaveValue("31,32");
  fireEvent.change(choices, { target: { value: "31" } });
  expect(onChange).toHaveBeenLastCalledWith({
    ...legacy,
    occurrence: { ...legacy.occurrence, tagIds: [31] },
  });
  fireEvent.click(screen.getByRole("checkbox", { name: /Allow multiple tags/ }));
  expect(onChange.mock.lastCall![0].occurrence.multiple).toBe(false);
});
