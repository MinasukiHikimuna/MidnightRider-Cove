import { expect, it } from "vitest";
import {
  attentionReasons,
  attentionText,
  categoriesTouched,
  combineAttention,
  flagAttention,
  flagCategoryIds,
  flagSummary,
  flagTagIds,
  mixedAttention,
  performerFlagTags,
  touchedAttention,
  touchedTags,
  touches,
  type AttentionEntry,
} from "../attention";
import type { MediaReviewAction, PerformerFlag } from "../model";
import type { AnswerCategory } from "../performerAnswers";

// A shape category (tag 10 with 11 and 12 under it) and a colour category (20 with 21 and 22).
const categories: Record<number, { name: string; tagIds: number[]; resolved: boolean }> = {
  10: { name: "Shape", tagIds: [10, 11, 12], resolved: true },
  20: { name: "Colour", tagIds: [20, 21, 22], resolved: true },
};
const category = (id: number) => categories[id];
const flags: PerformerFlag[] = [
  { tagId: 7, categoryTagId: 10 },
  { tagId: 8 },
  { tagId: 9, categoryTagId: 10 },
  { tagId: 9, categoryTagId: 20 },
];
const profile = [
  { id: 1, name: "Unrelated" },
  { id: 7, name: "Shape changed" },
  { id: 8, name: "Anything changed" },
  { id: 9, name: "Both changed" },
];
const action = (steps: MediaReviewAction["steps"]): MediaReviewAction => ({
  id: "a",
  label: "A",
  steps,
});
const entry = (key: string, tagIds: number[] | null): AttentionEntry => ({
  key,
  name: key,
  tagIds,
  flags: ["Flag"],
  mixed: [],
});

it("lists the flag tags and the categories a review's flags use, each once", () => {
  expect(flagTagIds(flags)).toEqual([7, 8, 9]);
  expect(flagCategoryIds(flags)).toEqual([10, 20]);
  expect(performerFlagTags(flags, profile).map((tag) => tag.id)).toEqual([7, 8, 9]);
});

it("groups a performer's flags by the category they affect, the whole review first", () => {
  expect(flagAttention(flags, profile, category)).toEqual([
    { key: "review", name: "", tagIds: null, flags: ["Anything changed"], mixed: [] },
    {
      key: "tag:10",
      name: "Shape",
      tagIds: [10, 11, 12],
      flags: ["Shape changed", "Both changed"],
      mixed: [],
    },
    { key: "tag:20", name: "Colour", tagIds: [20, 21, 22], flags: ["Both changed"], mixed: [] },
  ]);
  // Only the flag tags the performer carries count.
  expect(flagAttention(flags, [{ id: 7, name: "Shape changed" }], category)).toEqual([
    { key: "tag:10", name: "Shape", tagIds: [10, 11, 12], flags: ["Shape changed"], mixed: [] },
  ]);
  expect(flagAttention(flags, [{ id: 1, name: "Unrelated" }], category)).toEqual([]);
  expect(flagAttention([], profile, category)).toEqual([]);
  // Names keep the profile's order, as a performer's flags always read.
  expect(flagAttention([{ tagId: 9 }, { tagId: 7 }], profile, category)[0].flags).toEqual([
    "Shape changed",
    "Both changed",
  ]);
});

const answers = (...counts: Array<[number, string, number]>) =>
  counts.map(([id, name, count]) => ({ id, name, count }));
const row = (
  key: string,
  kind: AnswerCategory["kind"],
  members: number[],
  tags: ReturnType<typeof answers>,
): AnswerCategory => ({ key, kind, name: key, members, tags });

it("finds mixed answers where a category holds a second distinct answer, with the counts", () => {
  const rows = [
    row("tag:10", "condition", [10, 11, 12], answers([11, "Round", 40], [12, "Square", 12])),
    row("tag:20", "condition", [20, 21, 22], answers([21, "Red", 30])),
    row("group:size", "group", [31, 32], answers([31, "Small", 2], [32, "Large", 1])),
    row("group:none", "group", [41, 42], []),
    // The review's other tags are no category: different tags there are no mixed answers.
    row("other", "other", [51, 52], answers([51, "One", 3], [52, "Two", 1])),
  ];
  const mixed = mixedAttention(rows);
  expect(mixed.map((item) => item.key)).toEqual(["tag:10", "group:size"]);
  expect(mixed[0]).toEqual({
    key: "tag:10",
    name: "tag:10",
    tagIds: [10, 11, 12],
    flags: [],
    mixed: answers([11, "Round", 40], [12, "Square", 12]),
  });
  expect(attentionReasons(mixed[0])).toEqual(["Mixed: Round\u00a040 · Square\u00a012"]);
  expect(attentionReasons(mixed[1])).toEqual(["Mixed: Small\u00a02 · Large\u00a01"]);
});

it("joins a flag and mixed answers on the same category, the whole review first", () => {
  const flagged = flagAttention(flags, profile, category);
  const mixed = mixedAttention([
    row("tag:10", "condition", [10, 11, 12, 13], answers([11, "Round", 4], [12, "Square", 1])),
    row("group:size", "group", [31, 32], answers([31, "Small", 2], [32, "Large", 1])),
  ]);
  const combined = combineAttention(mixed, flagged);
  expect(combined.map((item) => item.key)).toEqual(["review", "tag:10", "group:size", "tag:20"]);
  const shape = combined[1];
  expect(shape.flags).toEqual(["Shape changed", "Both changed"]);
  expect(shape.mixed.map((tag) => tag.name)).toEqual(["Round", "Square"]);
  // The category's tags as either side knows them.
  expect([...shape.tagIds!].sort()).toEqual([10, 11, 12, 13]);
  expect(attentionReasons(shape)).toEqual([
    "Flagged: Shape changed, Both changed",
    "Mixed: Round\u00a04 · Square\u00a01",
  ]);
  expect(attentionText(shape)).toBe(
    "tag:10 (Flagged: Shape changed, Both changed; Mixed: Round\u00a04 · Square\u00a01)",
  );
  expect(attentionText(combined[0])).toBe("Flagged: Anything changed");
  // The inputs are left as they were.
  expect(flagged[1].flags).toEqual(["Shape changed", "Both changed"]);
  expect(mixed[0].flags).toEqual([]);
});

it("touches a category with the tags an answer adds, removes or marks absent", () => {
  const shape = entry("shape", [10, 11, 12]);
  const trees = new Map([[1, [1, 11]]]);
  expect(touches(action([{ mode: "ADD", tagIds: [11] }]), shape, trees)).toBe(true);
  expect(touches(action([{ mode: "REMOVE", tagIds: [12] }]), shape, trees)).toBe(true);
  expect(touches(action([{ mode: "MARK_PRESENT", tagIds: [10] }]), shape, trees)).toBe(true);
  expect(touches(action([{ mode: "MARK_ABSENT", tagIds: [12] }]), shape, trees)).toBe(true);
  // Clearing an absence changes no answer.
  expect(touches(action([{ mode: "CLEAR_ABSENCE", tagIds: [11] }]), shape, trees)).toBe(false);
  expect(touches(action([{ mode: "ADD", tagIds: [21] }]), shape, trees)).toBe(false);
  // A tree removal touches its whole tree once resolved, its parent alone until then.
  expect(touches(action([{ mode: "REMOVE_TREE", tagIds: [1] }]), shape, trees)).toBe(true);
  expect(touches(action([{ mode: "REMOVE_TREE", tagIds: [2] }]), shape, trees)).toBe(false);
  expect(touches(action([{ mode: "REMOVE_TREE", tagIds: [10] }]), shape, new Map())).toBe(true);
  expect([...touchedTags(action([{ mode: "REMOVE_TREE", tagIds: [1] }]), trees)]).toEqual([1, 11]);
  // Every answer touches the whole review, even one without steps.
  expect(touches(action([]), entry("review", null), trees)).toBe(true);
});

it("keeps the categories chosen answers touch, and the whole review always", () => {
  const entries = [entry("review", null), entry("shape", [10, 11, 12]), entry("colour", [20, 21])];
  const round = action([{ mode: "ADD", tagIds: [11] }]);
  const red = action([{ mode: "ADD", tagIds: [21] }]);
  const other = action([{ mode: "ADD", tagIds: [99] }]);
  expect(touchedAttention([], entries, new Map()).map((item) => item.key)).toEqual(["review"]);
  expect(touchedAttention([other], entries, new Map()).map((item) => item.key)).toEqual(["review"]);
  expect(touchedAttention([round], entries, new Map()).map((item) => item.key)).toEqual([
    "review",
    "shape",
  ]);
  expect(touchedAttention([round, red], entries, new Map()).map((item) => item.key)).toEqual([
    "review",
    "shape",
    "colour",
  ]);
  // A key carries a flag for the categories only, never for the whole review alone.
  expect(categoriesTouched(round, entries, new Map()).map((item) => item.key)).toEqual(["shape"]);
  expect(categoriesTouched(other, entries, new Map())).toEqual([]);
});

it("names the categories a performer's flags affect in the flag summary", () => {
  const name = (id: number) => categories[id].name;
  expect(flagSummary(flags, profile, name)).toBe(
    "Flagged: Shape changed (affects Shape), Anything changed, Both changed (affects Shape, Colour)",
  );
  // A tag that also flags the whole review says so among its categories.
  expect(
    flagSummary([{ tagId: 7 }, { tagId: 7, categoryTagId: 20 }], profile, name),
  ).toBe("Flagged: Shape changed (affects whole review, Colour)");
  // Flags for the whole review alone read as they always have.
  expect(flagSummary([{ tagId: 8 }], profile, name)).toBe("Flagged: Anything changed");
  expect(flagSummary(flags, [{ id: 1, name: "Unrelated" }], name)).toBe("");
});

it("counts a flag category whose tree is not known as touched by any chosen answer", () => {
  // The Shape tree could not be read: only its own tag is known.
  const unknown = (id: number) =>
    id === 10 ? { name: "Shape", tagIds: [10], resolved: false } : category(id);
  const [shape] = flagAttention([{ tagId: 7, categoryTagId: 10 }], profile, unknown);
  expect(shape).toMatchObject({ key: "tag:10", tagIds: [10], unresolved: true });
  const round = action([{ mode: "ADD", tagIds: [11] }]);
  // The batch warns for any chosen answer rather than miss one of the tree's tags...
  expect(touchedAttention([], [shape], new Map())).toEqual([]);
  expect(touchedAttention([round], [shape], new Map())).toEqual([shape]);
  // ...while keys carry a flag only where they touch what is known.
  expect(categoriesTouched(round, [shape], new Map())).toEqual([]);
  expect(categoriesTouched(action([{ mode: "ADD", tagIds: [10] }]), [shape], new Map())).toEqual([
    shape,
  ]);
  // Mixed answers bring the category's tags: then it is known.
  const [joined] = combineAttention(
    [shape],
    mixedAttention([
      row("tag:10", "condition", [10, 11, 12], answers([11, "Round", 2], [12, "Square", 1])),
    ]),
  );
  expect(joined.unresolved).toBeUndefined();
  expect(touches(round, joined, new Map())).toBe(true);
});
