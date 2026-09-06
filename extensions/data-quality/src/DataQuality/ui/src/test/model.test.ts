import { describe, expect, it } from "vitest";
import {
  getNextReviewFocus,
  getReviewActionTargets,
  parseReviews,
  reviewValidation,
  toggleShownReviewSelection,
  validAction,
} from "../model";

describe("Data Quality review model", () => {
  it("keeps explicit selection separate from focus", () => {
    expect(getReviewActionTargets(new Set([8, 3]), 5)).toEqual([3, 8]);
    expect(getReviewActionTargets(new Set(), 5)).toEqual([5]);
  });

  it("advances to a surviving successor after an action changes membership", () => {
    expect(getNextReviewFocus([1, 2, 3], [1, 3], 2, true)).toBe(3);
    expect(getNextReviewFocus([1, 2, 3], [1, 2], 3, true)).toBe(2);
    expect(getNextReviewFocus([1, 2], [1, 2], 1, false)).toBe(1);
  });

  it("toggles all currently shown items without clearing unrelated selection", () => {
    expect([...toggleShownReviewSelection(new Set([9]), [1, 2])]).toEqual([
      9, 1, 2,
    ]);
    expect([...toggleShownReviewSelection(new Set([1, 2, 9]), [1, 2])]).toEqual(
      [9],
    );
  });

  it("validates imported reviews and action steps", () => {
    const action = {
      id: "tag",
      label: "Tag",
      steps: [{ mode: "ADD" as const, tagIds: [3] }],
    };
    expect(validAction(action)).toBe(true);
    expect(
      parseReviews(
        JSON.stringify([
          {
            id: "review",
            name: "Review",
            description: "",
            view: {
              filter: {},
              objectFilter: {},
              displayMode: "wall",
              searchMode: "text",
            },
            actions: [action],
          },
        ]),
      ),
    ).toHaveLength(1);
    expect(() => parseReviews('[{"id":"broken"}]')).toThrow(
      /could not be read/i,
    );
  });

  it("accepts assessment modes and rejects contradictory tag assessments", () => {
    const base = {
      id: "review",
      name: "Review",
      description: "",
      view: {
        filter: {},
        objectFilter: {},
        displayMode: "grid" as const,
        searchMode: "text",
      },
    };
    const mixed = {
      id: "assess",
      label: "Assess",
      steps: [
        { mode: "MARK_PRESENT" as const, tagIds: [3, 3] },
        { mode: "MARK_ABSENT" as const, tagIds: [4] },
        { mode: "CLEAR_ABSENCE" as const, tagIds: [5] },
      ],
    };
    expect(validAction(mixed)).toBe(true);
    expect(reviewValidation({ ...base, actions: [mixed] })).toBe("");
    expect(
      reviewValidation({
        ...base,
        actions: [
          {
            ...mixed,
            steps: [
              { mode: "MARK_PRESENT", tagIds: [3] },
              { mode: "MARK_ABSENT", tagIds: [3] },
            ],
          },
        ],
      }),
    ).toMatch(/contradictory/i);
  });
});
