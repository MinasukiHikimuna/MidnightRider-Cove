import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { PerformerFlagSettings, TagChoiceSettings } from "../OccurrenceReview";
import type { OccurrenceReview } from "../model";

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

it("saves performer flag tags with the rule and drops the field once cleared", () => {
  const onChange = vi.fn();
  const { rerender } = render(<PerformerFlagSettings review={review} onChange={onChange} />);
  fireEvent.change(screen.getByPlaceholderText("Search performer flag tags..."), {
    target: { value: "7,8" },
  });
  expect(onChange).toHaveBeenLastCalledWith({
    ...review,
    occurrence: { ...review.occurrence, flagPerformerTagIds: [7, 8] },
  });
  const flagged = { ...review, occurrence: { ...review.occurrence, flagPerformerTagIds: [7] } };
  rerender(<PerformerFlagSettings review={flagged} onChange={onChange} />);
  fireEvent.change(screen.getByPlaceholderText("Search performer flag tags..."), {
    target: { value: "" },
  });
  expect(onChange.mock.lastCall![0].occurrence).not.toHaveProperty("flagPerformerTagIds");
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
