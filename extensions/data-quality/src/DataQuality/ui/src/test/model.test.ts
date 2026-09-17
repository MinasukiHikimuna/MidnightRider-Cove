import { afterEach, describe, expect, it } from "vitest";
import {
  getNextReviewFocus,
  getReviewActionTargets,
  isReviewGridArrowTarget,
  reviewGridArrowDelta,
  parseReviews,
  reviewEntityType,
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

  it("keeps legacy reviews as videos and validates tag group actions", () => {
    const [legacy] = parseReviews(
      JSON.stringify([
        {
          id: "legacy",
          name: "Legacy",
          description: "",
          view: {
            filter: {},
            objectFilter: {},
            displayMode: "grid",
            searchMode: "text",
          },
          actions: [],
        },
      ]),
    );
    expect(reviewEntityType(legacy)).toBe("video");

    const tagReview = {
      id: "tags",
      entityType: "tag" as const,
      name: "Group tags",
      description: "",
      view: {
        filter: { page: 1, perPage: 40, sort: "name", direction: "asc" },
        objectFilter: {
          tagGroupsCriterion: { value: [], modifier: "IS_NULL" },
        },
        displayMode: "list" as const,
        searchMode: "text",
      },
      actions: [
        {
          id: "assign",
          label: "Assign",
          effect: { mode: "SET_TAG_GROUP" as const, tagGroupId: 7 },
        },
        {
          id: "clear",
          label: "Ungrouped",
          effect: { mode: "CLEAR_TAG_GROUP" as const },
        },
        { id: "skip", label: "Skip", effect: { mode: "SKIP" as const } },
      ],
    };
    expect(reviewValidation(tagReview)).toBe("");
    expect(parseReviews(JSON.stringify([tagReview]))).toEqual([tagReview]);
    expect(() =>
      parseReviews(
        JSON.stringify([
          { ...tagReview, view: { ...tagReview.view, displayMode: "wall" } },
        ]),
      ),
    ).toThrow(/could not be read/i);
    expect(() =>
      parseReviews(
        JSON.stringify([
          {
            ...tagReview,
            actions: [
              {
                id: "mixed",
                label: "Mixed",
                effect: { mode: "SKIP" },
                steps: [],
              },
            ],
          },
        ]),
      ),
    ).toThrow(/could not be read/i);
    expect(
      reviewValidation({
        ...tagReview,
        actions: [
          {
            id: "bad",
            label: "Bad",
            effect: { mode: "SET_TAG_GROUP", tagGroupId: 0 },
          },
        ],
      } as typeof tagReview),
    ).toMatch(/complete every action/i);
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

it("round-trips explicit video layouts and card tag parents and rejects unknown layouts", () => {
  const rule = { id: "layout", name: "Layout", description: "", view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text", reviewMode: "multiple" }, actions: [], presentation: { annotations: ["tags"], annotationParents: [100] } };
  expect(parseReviews(JSON.stringify([rule]))).toEqual([rule]);
  expect(() => parseReviews(JSON.stringify([{ ...rule, view: { ...rule.view, reviewMode: "unknown" } }]))).toThrow(/could not be read/i);
});

describe("review grid arrow keys", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  function element(html: string) {
    const host = document.createElement("div");
    host.innerHTML = html;
    document.body.appendChild(host);
    return host.querySelector("[data-target]") as HTMLElement;
  }

  it("maps arrow keys onto grid offsets", () => {
    expect(reviewGridArrowDelta("ArrowLeft", 4)).toBe(-1);
    expect(reviewGridArrowDelta("ArrowRight", 4)).toBe(1);
    expect(reviewGridArrowDelta("ArrowUp", 4)).toBe(-4);
    expect(reviewGridArrowDelta("ArrowDown", 4)).toBe(4);
    expect(reviewGridArrowDelta("Enter", 4)).toBe(0);
  });

  it("yields arrow keys from the body and plain controls to the grid", () => {
    expect(isReviewGridArrowTarget(document.body)).toBe(true);
    expect(isReviewGridArrowTarget(element("<button data-target>Grid</button>"))).toBe(true);
    expect(isReviewGridArrowTarget(element('<a href="/x" data-target>Link</a>'))).toBe(true);
    expect(isReviewGridArrowTarget(element("<h1 data-target>Title</h1>"))).toBe(true);
    expect(isReviewGridArrowTarget(null)).toBe(false);
  });

  it("leaves arrow keys to controls that own them", () => {
    for (const html of [
      "<input data-target />",
      '<input type="range" data-target />',
      "<textarea data-target></textarea>",
      "<select data-target></select>",
      "<div contenteditable data-target></div>",
      '<div contenteditable="true" data-target></div>',
      '<div role="combobox" data-target></div>',
      '<div role="listbox"><div role="option" data-target></div></div>',
      '<div role="menu"><button role="menuitem" data-target></button></div>',
      '<div role="radiogroup"><button role="radio" data-target></button></div>',
      '<div role="slider" data-target></div>',
      '<div role="tablist"><button role="tab" data-target></button></div>',
      '<div role="dialog"><button data-target></button></div>',
      '<div aria-modal="true"><button data-target></button></div>',
      "<div data-review-player-controls><button data-target></button></div>",
    ]) {
      expect(isReviewGridArrowTarget(element(html)), html).toBe(false);
    }
    expect(
      isReviewGridArrowTarget(element('<div contenteditable="false" data-target></div>')),
    ).toBe(true);
  });
});
