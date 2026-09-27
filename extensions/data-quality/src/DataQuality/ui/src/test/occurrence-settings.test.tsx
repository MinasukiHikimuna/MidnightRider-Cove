import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import { OccurrenceSettings, PerformerFlagSettings } from "../OccurrenceReview";
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

it("offers the missing-at-least-one condition with absence hiding in the rule editor", () => {
  render(<OccurrenceSettings review={review} onChange={() => {}} />);
  expect(screen.getByRole("combobox", { name: "Occurrence condition" })).toHaveValue("excludesAll");
  expect(screen.getByRole("option", { name: "Missing at least one selected tag" })).toBeInTheDocument();
  expect(screen.getByRole("checkbox", { name: "Hide occurrences confirmed absent" })).toBeChecked();
});
