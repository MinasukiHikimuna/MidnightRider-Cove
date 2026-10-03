import { afterEach, describe, expect, it } from "vitest";
import {
  boundedFilter,
  getNextReviewFocus,
  isOccurrenceReview,
  queueSignature,
  reviewMediaKind,
  supportsMultipleReviewMode,
  getReviewActionTargets,
  isEditableTarget,
  isReviewGridArrowTarget,
  isReviewEscapeTarget,
  reviewGridArrowDelta,
  parseReviews,
  reviewEntityType,
  reviewValidation,
  toggleShownReviewSelection,
  validAction,
  type VideoReview,
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

it("round-trips queue filter bins on video reviews and refuses malformed or misplaced ones", () => {
  const bin = { key: "ff", label: "Two women", group: "Makeup", filter: { performerCountCriterion: { value: 2, modifier: "EQUALS" } } };
  const rule = { id: "bins", name: "Bins", description: "", view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" }, actions: [], presentation: { filterBins: [bin] } };
  expect(parseReviews(JSON.stringify([rule]))).toEqual([rule]);
  for (const filterBins of [
    [{ ...bin, key: "" }],
    [{ ...bin, label: 1 }],
    [{ ...bin, group: 1 }],
    [{ ...bin, filter: [] }],
    [bin, { ...bin, label: "Again" }],
    {},
  ])
    expect(() => parseReviews(JSON.stringify([{ ...rule, presentation: { filterBins } }]))).toThrow(/could not be read/i);
  expect(() => parseReviews(JSON.stringify([{ ...rule, entityType: "audio" }]))).toThrow(/could not be read/i);
  // A bin is saved only once it is named and filters something.
  expect(reviewValidation(rule as VideoReview)).toBe("");
  for (const unfinished of [{ ...bin, label: " " }, { ...bin, filter: {} }])
    expect(reviewValidation({ ...rule, presentation: { filterBins: [unfinished] } } as VideoReview)).toMatch(/filter bin/i);
});

it("round-trips answer groups and their setting, refusing them where they do not belong", () => {
  const view = { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" };
  const media = (extra: object = {}, action: object = {}) => ({
    id: "groups",
    name: "Groups",
    description: "",
    view,
    actions: [{ id: "a", label: "A", steps: [{ mode: "ADD", tagIds: [1] }], ...action }],
    ...extra,
  });
  const grouped = media({ stayUntilGroupsAnswered: true }, { group: " Size " });
  expect(parseReviews(JSON.stringify([grouped]))).toEqual([grouped]);
  const occurrence = {
    ...media({ stayUntilGroupsAnswered: false }, { group: "Size" }),
    entityType: "audioPerformerOccurrence",
    occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: true },
  };
  expect(parseReviews(JSON.stringify([occurrence]))).toEqual([occurrence]);
  expect(() => parseReviews(JSON.stringify([media({ stayUntilGroupsAnswered: "yes" })]))).toThrow(/could not be read/i);
  expect(() => parseReviews(JSON.stringify([media({}, { group: 3 })]))).toThrow(/could not be read/i);
  // Tag reviews set tag groups, not tags: answer groups have nothing to wait for there.
  const tag = (extra: object = {}, action: object = {}) => ({
    ...media(extra),
    entityType: "tag",
    actions: [{ id: "t", label: "T", effect: { mode: "SKIP" }, ...action }],
  });
  expect(parseReviews(JSON.stringify([tag()]))).toHaveLength(1);
  expect(() => parseReviews(JSON.stringify([tag({ stayUntilGroupsAnswered: true })]))).toThrow(/could not be read/i);
  expect(() => parseReviews(JSON.stringify([tag({}, { group: "Size" })]))).toThrow(/could not be read/i);
});

it("round-trips the select-all-on-load preference and rejects non-boolean values", () => {
  const rule = { id: "select", name: "Select", description: "", view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text", reviewMode: "multiple", selectAllOnLoad: true }, actions: [] };
  expect(parseReviews(JSON.stringify([rule]))).toEqual([rule]);
  expect(() => parseReviews(JSON.stringify([{ ...rule, view: { ...rule.view, selectAllOnLoad: "yes" } }]))).toThrow(/could not be read/i);
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

describe("review grid Escape", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  function element(html: string): HTMLElement {
    document.body.innerHTML = html;
    return document.body.querySelector<HTMLElement>("[data-target]")!;
  }
  it("accept the body, cards, the action bar, the pager and the review preview", () => {
    expect(isReviewEscapeTarget(document.body)).toBe(true);
    expect(isReviewEscapeTarget(element("<article class='dq-review-card' tabindex='0' data-target>Card</article>"))).toBe(true);
    expect(isReviewEscapeTarget(element('<section class="dq-action-bar"><button data-target>Select all</button></section>'))).toBe(true);
    expect(isReviewEscapeTarget(element('<span class="dq-pager"><button data-target>Next page</button></span>'))).toBe(true);
    expect(isReviewEscapeTarget(element('<article class="dq-review-card"><a href="/x" data-target>Link</a></article>'))).toBe(true);
    expect(isReviewEscapeTarget(element('<div role="dialog" class="dq-preview"><button data-target>Apply</button></div>'))).toBe(true);
  });
  it("yield to text entry, media controls and other dialogs", () => {
    expect(isReviewEscapeTarget(element("<input data-target />"))).toBe(false);
    expect(isReviewEscapeTarget(element("<textarea data-target></textarea>"))).toBe(false);
    expect(isReviewEscapeTarget(element("<select data-target></select>"))).toBe(false);
    expect(isReviewEscapeTarget(element('<div contenteditable="true" data-target></div>'))).toBe(false);
    expect(isReviewEscapeTarget(element('<div data-review-player-controls><button data-target>Play</button></div>'))).toBe(false);
    expect(isReviewEscapeTarget(element('<div role="dialog"><button data-target>Apply filters</button></div>'))).toBe(false);
    expect(isReviewEscapeTarget(null)).toBe(false);
  });
});

it("treats fields that take typed keys as editable, where focus stays put", () => {
  const element = (html: string) => {
    document.body.innerHTML = html;
    return document.body.querySelector<HTMLElement>("[data-target]")!;
  };
  for (const html of [
    '<input aria-label="Search list" data-target />',
    '<input type="number" data-target />',
    "<textarea data-target></textarea>",
    "<select data-target></select>",
    '<div contenteditable="true"><span data-target>Text</span></div>',
  ])
    expect(isEditableTarget(element(html)), html).toBe(true);
  for (const html of [
    "<button data-target>Filters</button>",
    "<article tabindex='0' data-target>Card</article>",
    '<div contenteditable="false" data-target></div>',
  ])
    expect(isEditableTarget(element(html)), html).toBe(false);
  expect(isEditableTarget(document.body)).toBe(false);
  expect(isEditableTarget(null)).toBe(false);
  // A field already removed from the page holds nothing.
  const detached = document.createElement("input");
  expect(isEditableTarget(detached)).toBe(false);
  document.body.innerHTML = "";
});

it("keeps Escape away from host-owned controls inside the page", () => {
  document.body.innerHTML = '<fieldset class="dq-review-toolbar"><button data-target>Sort</button></fieldset>';
  expect(isReviewEscapeTarget(document.body.querySelector("[data-target]"))).toBe(false);
  document.body.innerHTML = '<header class="dq-review-header"><button data-target>Edit review</button></header>';
  expect(isReviewEscapeTarget(document.body.querySelector("[data-target]"))).toBe(false);
  document.body.innerHTML = "";
});

describe("audio reviews", () => {
  const view = {
    filter: { page: 1, perPage: 40 },
    objectFilter: {},
    displayMode: "grid",
    searchMode: "text",
  };
  const action = {
    id: "tag",
    label: "Tag",
    steps: [{ mode: "ADD" as const, tagIds: [3] }],
  };
  const audioReview = {
    id: "a",
    name: "Audio review",
    description: "",
    entityType: "audio" as const,
    view: { ...view, displayMode: "grid" as const, reviewMode: "single" as const },
    actions: [action],
  };
  const audioOccurrenceReview = {
    id: "ao",
    name: "Audio occurrences",
    description: "",
    entityType: "audioPerformerOccurrence" as const,
    view: { ...view, displayMode: "grid" as const },
    actions: [action],
    occurrence: {
      targetMode: "all" as const,
      performerIds: [],
      performerFilter: {},
      condition: "any" as const,
      conditionTagIds: [],
      tagIds: [3],
      multiple: true,
    },
  };

  it("routes the new entity types to the audio media kind", () => {
    expect(reviewMediaKind(audioReview)).toBe("audio");
    expect(reviewMediaKind(audioOccurrenceReview)).toBe("audio");
    expect(reviewMediaKind({ ...audioReview, entityType: "video" })).toBe("video");
    expect(isOccurrenceReview(audioOccurrenceReview)).toBe(true);
    expect(isOccurrenceReview(audioReview)).toBe(false);
  });

  it("keeps the multiple-item layout on video reviews only", () => {
    expect(supportsMultipleReviewMode(audioReview)).toBe(false);
    expect(
      reviewValidation({
        ...audioReview,
        view: { ...audioReview.view, reviewMode: "multiple" },
      }),
    ).toBe("Only video reviews support the multiple-item layout.");
    expect(reviewValidation(audioReview)).toBe("");
    expect(reviewValidation(audioOccurrenceReview)).toBe("");
  });

  it("accepts saved audio reviews and rejects grid-only presentation on them", () => {
    const saved = JSON.stringify([audioReview, audioOccurrenceReview]);
    expect(parseReviews(saved).map((review) => review.entityType)).toEqual([
      "audio",
      "audioPerformerOccurrence",
    ]);
    expect(() =>
      parseReviews(
        JSON.stringify([{ ...audioReview, presentation: { annotations: ["tags"] } }]),
      ),
    ).toThrow(/could not be read/);
    expect(() =>
      parseReviews(
        JSON.stringify([
          { ...audioReview, view: { ...audioReview.view, reviewMode: "multiple" } },
        ]),
      ),
    ).toThrow(/could not be read/);
  });

  it("separates audio and video queues that are otherwise identical", () => {
    expect(queueSignature(audioReview)).not.toBe(
      queueSignature({ ...audioReview, entityType: "video" }),
    );
    expect(queueSignature(audioOccurrenceReview)).not.toBe(
      queueSignature({ ...audioOccurrenceReview, entityType: "performerOccurrence" }),
    );
  });
});

it("caps an audio queue page at the size Cove's audio endpoint applies", () => {
  expect(boundedFilter({ page: 1, perPage: 1000 }, "video").perPage).toBe(1000);
  expect(boundedFilter({ page: 1, perPage: 1000 }, "audio").perPage).toBe(250);
  expect(boundedFilter({ page: 1, perPage: 40 }, "audio").perPage).toBe(40);
  // The default stays the same for both kinds.
  expect(boundedFilter({ page: 1 }, "audio").perPage).toBe(40);
});
