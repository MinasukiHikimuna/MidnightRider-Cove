import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  answerCategories,
  loadPerformerAnswers,
  oneAnswerCategory,
  type AnswerSummary,
} from "../performerAnswers";
import { mixedAttention } from "../attention";
import type { MediaReviewAction, OccurrenceReview } from "../model";

const fetchMock = vi.mocked(extensionFetch);
const review: OccurrenceReview = {
  id: "answers",
  name: "Answers",
  description: "",
  entityType: "performerOccurrence",
  actions: [
    { id: "medium", label: "Medium", steps: [{ mode: "ADD", tagIds: [32] }] },
    { id: "perky", label: "Perky", steps: [{ mode: "ADD", tagIds: [50] }] },
  ],
  view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
  occurrence: {
    targetMode: "all",
    performerIds: [],
    performerFilter: {},
    condition: "excludesAll",
    conditionTagIds: [30, 40],
    includeSubtags: true,
    tagIds: [],
    multiple: true,
  },
};
const application = (hostId: number, contextId: number, tag: number) => ({
  id: hostId * 100 + tag,
  hostType: "video",
  hostId,
  contextType: "performer",
  contextId,
  tag: { id: tag, name: `Tag ${tag}` },
});
const response = (body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
let requested: string[];
beforeEach(() => {
  fetchMock.mockReset();
  requested = [];
  fetchMock.mockImplementation((path, init) => {
    requested.push(String(path));
    const url = new URL(String(path), "http://test");
    if (url.pathname === "/api/tagapplications")
      return response([
        application(1, 11, 32),
        application(1, 11, 41),
        application(2, 11, 32),
        application(2, 11, 42),
        application(3, 11, 50),
        application(4, 11, 99),
        application(5, 12, 31),
      ]);
    if (url.pathname === "/api/tags/find") {
      const root = JSON.parse(String(init!.body)).objectFilter.parentsCriterion.value[0];
      const tree = root === 30 ? [31, 32] : [41, 42];
      return response({ items: tree.map((id) => ({ id })), totalCount: tree.length });
    }
    if (url.pathname.startsWith("/api/tags/")) {
      const id = Number(url.pathname.split("/").pop());
      return response({ id, name: id === 30 ? "Size" : "Augmentation" });
    }
    throw new Error(`Unexpected request ${path}`);
  });
});

it("summarizes one performer's answers per condition category, most used first", async () => {
  expect(await loadPerformerAnswers(review, 11, new AbortController().signal)).toEqual({
    answered: 3,
    groups: [
      {
        id: 30,
        name: "Size",
        members: [30, 31, 32],
        tags: [{ id: 32, name: "Tag 32", count: 2 }],
      },
      {
        id: 40,
        name: "Augmentation",
        members: [40, 41, 42],
        tags: [
          { id: 41, name: "Tag 41", count: 1 },
          { id: 42, name: "Tag 42", count: 1 },
        ],
      },
      {
        id: null,
        name: "Other review tags",
        members: [50],
        tags: [{ id: 50, name: "Tag 50", count: 1 }],
      },
    ],
  });
  expect(requested[0]).toBe(
    "/api/tagapplications?hostType=video&contextType=performer&contextId=11",
  );
});

it("lists only the review's action tags when the condition has no categories", async () => {
  const summary = await loadPerformerAnswers(
    { ...review, occurrence: { ...review.occurrence, condition: "any", conditionTagIds: [] } },
    11,
    new AbortController().signal,
  );
  expect(summary).toEqual({
    answered: 3,
    groups: [
      {
        id: null,
        name: "Review tags",
        members: [32, 50],
        tags: [
          { id: 32, name: "Tag 32", count: 2 },
          { id: 50, name: "Tag 50", count: 1 },
        ],
      },
    ],
  });
});

it("counts a legacy review's tag choices as the answers to summarize", async () => {
  const summary = await loadPerformerAnswers(
    {
      ...review,
      actions: [],
      occurrence: { ...review.occurrence, condition: "any", conditionTagIds: [], tagIds: [41, 42] },
    },
    11,
    new AbortController().signal,
  );
  expect(summary).toEqual({
    answered: 2,
    groups: [
      {
        id: null,
        name: "Review tags",
        members: [41, 42],
        tags: [
          { id: 41, name: "Tag 41", count: 1 },
          { id: 42, name: "Tag 42", count: 1 },
        ],
      },
    ],
  });
});

it("keeps each answer's badge data and orders equally frequent answers like Cove", async () => {
  const withGroup = (hostId: number, tag: number, name: string, order: number | null) => ({
    ...application(hostId, 11, tag),
    tag: {
      id: tag,
      name,
      color: "#224466",
      tagGroupId: order == null ? null : 7,
      tagGroupName: order == null ? null : "Group",
      tagGroupColor: order == null ? null : "#664422",
      tagGroupSortOrder: order,
    },
  });
  fetchMock.mockImplementation((path, init) => {
    const url = new URL(String(path), "http://test");
    if (url.pathname === "/api/tagapplications")
      return response([
        // Tag 41 is alphabetically first but ungrouped, so the grouped tag 42 comes first.
        withGroup(1, 41, "Alpha", null),
        withGroup(2, 42, "Beta", 1),
      ]);
    if (url.pathname === "/api/tags/find") {
      const root = JSON.parse(String(init!.body)).objectFilter.parentsCriterion.value[0];
      const tree = root === 30 ? [31, 32] : [41, 42];
      return response({ items: tree.map((id) => ({ id })), totalCount: tree.length });
    }
    const id = Number(url.pathname.split("/").pop());
    return response({ id, name: id === 30 ? "Size" : "Augmentation" });
  });
  const summary = await loadPerformerAnswers(review, 11, new AbortController().signal);
  expect(summary.groups[1].tags).toEqual([
    expect.objectContaining({ id: 42, name: "Beta", tagGroupColor: "#664422", count: 1 }),
    expect.objectContaining({ id: 41, name: "Alpha", color: "#224466", count: 1 }),
  ]);
});

// Answers per category: condition categories, then answer groups outside them, then the rest.
const held = (id: number, count: number) => ({ id, name: `Tag ${id}`, count });
const summary: AnswerSummary = {
  answered: 9,
  groups: [
    { id: 30, name: "Size", members: [30, 31, 32], tags: [held(32, 5), held(31, 2)] },
    { id: 40, name: "Kind", members: [40, 41, 42], tags: [held(41, 3)] },
    { id: null, name: "Other review tags", members: [50, 51, 60], tags: [held(51, 2), held(50, 4), held(60, 1)] },
  ],
};
const answer = (id: string, group: string | undefined, tag: number): MediaReviewAction => ({
  id,
  label: id,
  ...(group === undefined ? {} : { group }),
  steps: [{ mode: "ADD", tagIds: [tag] }],
});
/** An answer as "Only one per performer" makes it: add the tag, remove the rest of a tree. */
const onlyOne = (id: string, tag: number, tree: number): MediaReviewAction => ({
  id,
  label: id,
  steps: [
    { mode: "ADD", tagIds: [tag] },
    { mode: "REMOVE_TREE", tagIds: [tree] },
  ],
});
const NO_TREES = new Map<number, number[]>();

it("gives answer groups outside the condition categories rows of their own", () => {
  const actions = [
    // Inside the Size category entirely: Size shows these answers already.
    answer("small", "Measure", 31),
    answer("large", "measure ", 32),
    // Outside every condition category: a row of its own, its answers taken from the rest.
    answer("plain", "Finish", 50),
    answer("shiny", "Finish", 51),
    // A group none of whose answers the performer holds still gets its row.
    answer("wide", "Width", 70),
    // Ungrouped: stays with the other review tags.
    answer("note", undefined, 60),
  ];
  const rows = answerCategories(summary, actions, NO_TREES);
  expect(rows.map((row) => [row.key, row.kind, row.name])).toEqual([
    ["tag:30", "condition", "Size"],
    ["tag:40", "condition", "Kind"],
    ["group:finish", "group", "Finish"],
    ["group:width", "group", "Width"],
    ["other", "other", "Other review tags"],
  ]);
  expect(rows[0].members).toEqual([30, 31, 32]);
  // Most frequent first.
  expect(rows[2].tags).toEqual([held(50, 4), held(51, 2)]);
  expect(rows[2].members).toEqual([50, 51]);
  expect(rows[3].tags).toEqual([]);
  expect(rows[4].tags).toEqual([held(60, 1)]);
  expect(rows[4].members).toEqual([60]);
  // A group takes one answer: two there are mixed, as in the group inside Size; the rest never are.
  expect(rows.map((row) => row.mixed.map((found) => found.key))).toEqual([
    ["group:measure"],
    [],
    ["group:finish"],
    [],
    [],
  ]);
  expect(rows[2].mixed).toEqual([
    { key: "group:finish", name: "Finish", members: [50, 51], tags: [held(50, 4), held(51, 2)] },
  ]);
});

it("counts a group's answers wherever the performer holds them, a group across categories too", () => {
  // One answer in Size, one in Kind: no single category holds the group.
  const rows = answerCategories(
    summary,
    [answer("a", "Mixed up", 32), answer("b", "Mixed up", 41)],
    NO_TREES,
  );
  expect(rows.map((row) => row.key)).toEqual(["tag:30", "tag:40", "group:mixed up", "other"]);
  expect(rows[2].tags).toEqual([held(32, 5), held(41, 3)]);
  // Mixed in the group, while each category keeps one of its answers and several are allowed.
  expect(rows.map((row) => row.mixed.length)).toEqual([0, 0, 1, 0]);
});

it("keeps the rows as they were without answer groups, and names the rest alone", () => {
  expect(
    answerCategories(summary, [answer("a", undefined, 50)], NO_TREES).map((row) => row.key),
  ).toEqual(["tag:30", "tag:40", "other"]);
  const alone: AnswerSummary = {
    answered: 1,
    groups: [{ id: null, name: "Review tags", members: [50], tags: [held(50, 1)] }],
  };
  expect(answerCategories(alone, [], NO_TREES).map((row) => row.name)).toEqual(["Review tags"]);
  // With a group row before them, the rest are the other review tags.
  expect(
    answerCategories(
      { ...alone, groups: [{ id: null, name: "Review tags", members: [50, 51], tags: [held(50, 1)] }] },
      [answer("x", "Finish", 51)],
      NO_TREES,
    ).map((row) => row.name),
  ).toEqual(["Finish", "Other review tags"]);
  // The rest only shows while it holds answers.
  expect(
    answerCategories(
      { answered: 0, groups: [{ id: null, name: "Review tags", members: [50], tags: [] }] },
      [],
      NO_TREES,
    ),
  ).toEqual([]);
});

it("counts the answers of a category that holds several at once without mixing them", () => {
  // Size holds two answers, but nothing says it takes one: no only-one answer, no group.
  const rows = answerCategories(
    summary,
    [answer("small", undefined, 31), answer("large", undefined, 32)],
    NO_TREES,
  );
  expect(rows[0]).toMatchObject({ key: "tag:30", tags: [held(32, 5), held(31, 2)], mixed: [] });
  // Answers in two different groups inside it are no mix either.
  const split = answerCategories(
    summary,
    [answer("small", "Width", 31), answer("large", "Height", 32)],
    NO_TREES,
  );
  expect(split[0].mixed).toEqual([]);
});

it("finds the condition categories that take one answer from their only-one answers", () => {
  const size = [30, 31, 32];
  // The category's own tree: known before the tree is resolved.
  expect(oneAnswerCategory(30, size, [onlyOne("small", 31, 30)], NO_TREES)).toBe(true);
  // A tree above the category counts once it is resolved and holds the whole category.
  const above = [onlyOne("small", 31, 1)];
  expect(oneAnswerCategory(30, size, above, NO_TREES)).toBe(false);
  expect(oneAnswerCategory(30, size, above, new Map([[1, [1, 30, 31, 32, 40]]]))).toBe(true);
  expect(oneAnswerCategory(30, size, above, new Map([[1, [1, 31, 32]]]))).toBe(false);
  // A tree under the category holds only part of it.
  expect(oneAnswerCategory(30, size, [onlyOne("small", 31, 31)], new Map([[31, [31]]]))).toBe(false);
  // Mark present adds too.
  const present: MediaReviewAction = {
    id: "present",
    label: "present",
    steps: [
      { mode: "MARK_PRESENT", tagIds: [32] },
      { mode: "REMOVE_TREE", tagIds: [30] },
    ],
  };
  expect(oneAnswerCategory(30, size, [present], NO_TREES)).toBe(true);
  // The same answer must add a tag of the category and remove its tree.
  expect(oneAnswerCategory(30, size, [onlyOne("red", 41, 30)], NO_TREES)).toBe(false);
  const clear: MediaReviewAction = {
    id: "clear",
    label: "clear",
    steps: [{ mode: "REMOVE_TREE", tagIds: [30] }],
  };
  expect(oneAnswerCategory(30, size, [clear], NO_TREES)).toBe(false);
  expect(oneAnswerCategory(30, size, [answer("small", undefined, 31), clear], NO_TREES)).toBe(false);
  // A plain removal of the category's tag is no tree removal.
  const remove: MediaReviewAction = {
    id: "remove",
    label: "remove",
    steps: [
      { mode: "ADD", tagIds: [31] },
      { mode: "REMOVE", tagIds: [30] },
    ],
  };
  expect(oneAnswerCategory(30, size, [remove], NO_TREES)).toBe(false);
});

it("mixes the answers of a condition category that takes one answer, and only then", () => {
  const actions = [onlyOne("small", 31, 1), onlyOne("large", 32, 1)];
  // Until the tree above Size is known, Size holds several answers.
  expect(answerCategories(summary, actions, NO_TREES)[0].mixed).toEqual([]);
  const rows = answerCategories(summary, actions, new Map([[1, [1, 30, 31, 32]]]));
  expect(rows[0].mixed).toEqual([
    { key: "tag:30", name: "Size", members: [30, 31, 32], tags: [held(32, 5), held(31, 2)] },
  ]);
  // Kind takes one answer too, but holds one.
  expect(
    answerCategories(summary, [...actions, onlyOne("one", 41, 40)], NO_TREES)[1].mixed,
  ).toEqual([]);
  // Taking one answer, the whole category counts, a group inside it included, once.
  const grouped = answerCategories(
    summary,
    [
      onlyOne("small", 31, 30),
      { ...onlyOne("large", 32, 30), group: "Measure" },
      answer("s", "Measure", 31),
    ],
    NO_TREES,
  );
  expect(grouped[0].mixed.map((found) => found.key)).toEqual(["tag:30"]);
});

it("names a group inside nested condition categories once, after the one taking one answer", () => {
  // Condition category 30 holds 31 and more; 31 is a condition category too, whose answers,
  // generated with "Only one per performer", remove its tree and form its group.
  const nested: AnswerSummary = {
    answered: 4,
    groups: [
      {
        id: 30,
        name: "Outer",
        members: [30, 31, 32, 33, 34],
        tags: [held(32, 3), held(34, 2), held(33, 1)],
      },
      { id: 31, name: "Inner", members: [31, 32, 33], tags: [held(32, 3), held(33, 1)] },
    ],
  };
  const actions = [
    { ...onlyOne("a", 32, 31), group: "Inner" },
    { ...onlyOne("b", 33, 31), group: "Inner" },
  ];
  for (const trees of [NO_TREES, new Map([[31, [31, 32, 33]]])]) {
    const rows = answerCategories(nested, actions, trees);
    // Outer holds several answers and is mixed through the group; Inner takes one answer.
    expect(rows.map((row) => row.mixed.map((found) => found.key))).toEqual([
      ["group:inner"],
      ["tag:31"],
    ]);
    // Needing attention once, by the category.
    expect(mixedAttention(rows).map((entry) => [entry.key, entry.name])).toEqual([
      ["tag:31", "Inner"],
    ]);
  }
});
