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

const NBSP = "\u00a0";
const answers = (...counts: Array<[number, string, number]>) =>
  counts.map(([id, name, count]) => ({ id, name, count }));
/** A row whose answers are not mixed, or mixed in the categories given. */
const row = (
  key: string,
  kind: AnswerCategory["kind"],
  members: number[],
  tags: ReturnType<typeof answers>,
  mixed: AnswerCategory["mixed"] = [],
): AnswerCategory => ({ key, kind, name: key, members, tags, mixed });
/** A row taking one answer, as answerCategories gives it: mixed with two or more answers. */
const oneAnswer = (
  key: string,
  kind: AnswerCategory["kind"],
  members: number[],
  tags: ReturnType<typeof answers>,
): AnswerCategory =>
  row(key, kind, members, tags, tags.length > 1 ? [{ key, name: key, members, tags }] : []);

it("finds mixed answers where a category taking one answer holds a second one, with the counts", () => {
  const rows = [
    oneAnswer("tag:10", "condition", [10, 11, 12], answers([11, "Round", 40], [12, "Square", 12])),
    oneAnswer("tag:20", "condition", [20, 21, 22], answers([21, "Red", 30])),
    // A category holding several answers at once shows its counts without being mixed.
    row("tag:60", "condition", [60, 61, 62], answers([61, "Left", 5], [62, "Right", 3])),
    oneAnswer("group:size", "group", [31, 32], answers([31, "Small", 2], [32, "Large", 1])),
    oneAnswer("group:none", "group", [41, 42], []),
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

it("takes a mixed answer group inside a category holding several answers as its own entry", () => {
  const form = {
    key: "group:form",
    name: "Form",
    members: [11, 12],
    tags: answers([11, "Round", 4], [12, "Square", 1]),
  };
  const shape = row(
    "tag:10",
    "condition",
    [10, 11, 12, 13],
    answers([11, "Round", 4], [13, "Striped", 2], [12, "Square", 1]),
    [form],
  );
  // The same group inside two overlapping categories counts once.
  expect(mixedAttention([shape, { ...shape, key: "tag:9" }])).toHaveLength(1);
  // Named after the group, with its answers alone: the category's other answers are not mixed.
  const [entry] = mixedAttention([shape]);
  expect(entry).toEqual({
    key: "group:form",
    name: "Form",
    tagIds: [11, 12],
    flags: [],
    mixed: answers([11, "Round", 4], [12, "Square", 1]),
  });
  expect(attentionReasons(entry)).toEqual([`Mixed: Round${NBSP}4 · Square${NBSP}1`]);
  // So an answer elsewhere in the category touches nothing mixed.
  expect(touches(action([{ mode: "ADD", tagIds: [13] }]), entry, new Map())).toBe(false);
  expect(touches(action([{ mode: "ADD", tagIds: [12] }]), entry, new Map())).toBe(true);
  // A flag on that category whose tree is not known stays so beside the group's answers.
  const unknown = () => ({ name: "Shape", tagIds: [10], resolved: false });
  const joined = combineAttention(
    flagAttention([{ tagId: 7, categoryTagId: 10 }], profile, unknown),
    mixedAttention([shape]),
  );
  expect(joined.map((item) => [item.key, item.unresolved])).toEqual([
    ["tag:10", true],
    ["group:form", undefined],
  ]);
});

it("leaves a mixed group to a condition category taking one answer that holds it too", () => {
  // Condition category 10 holds several answers; 20 inside it takes one answer, and the group
  // generated with its only-one answers holds 21 and 22, inside both.
  const held = answers([21, "One", 2], [22, "Two", 1]);
  const group = { key: "group:inner", name: "Inner", members: [21, 22], tags: held };
  const outer = row(
    "tag:10",
    "condition",
    [10, 20, 21, 22, 23],
    answers([21, "One", 2], [23, "Other", 2], [22, "Two", 1]),
    [group],
  );
  const inner = oneAnswer("tag:20", "condition", [20, 21, 22], held);
  // Said once, by the category; the outer row still carries its badge (its mixed list).
  expect(mixedAttention([outer, inner]).map((entry) => entry.key)).toEqual(["tag:20"]);
  expect(outer.mixed).toEqual([group]);
  // Without such a category the group speaks for itself.
  expect(mixedAttention([outer]).map((entry) => entry.key)).toEqual(["group:inner"]);
  // Another group's answers do not cover it either.
  const other = oneAnswer("group:wide", "group", [21, 22, 23], held);
  expect(mixedAttention([outer, other]).map((entry) => entry.key)).toEqual([
    "group:inner",
    "group:wide",
  ]);
});

it("joins a flag and mixed answers on the same category, the whole review first", () => {
  const flagged = flagAttention(flags, profile, category);
  const mixed = mixedAttention([
    oneAnswer("tag:10", "condition", [10, 11, 12, 13], answers([11, "Round", 4], [12, "Square", 1])),
    oneAnswer("group:size", "group", [31, 32], answers([31, "Small", 2], [32, "Large", 1])),
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
  // Mixed answers of a category taking one answer bring its tags: then it is known.
  const [joined] = combineAttention(
    [shape],
    mixedAttention([
      oneAnswer("tag:10", "condition", [10, 11, 12], answers([11, "Round", 2], [12, "Square", 1])),
    ]),
  );
  expect(joined.unresolved).toBeUndefined();
  expect(touches(round, joined, new Map())).toBe(true);
});
