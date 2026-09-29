import { describe, expect, it } from "vitest";
import {
  actionGroups,
  answersGroup,
  groupKey,
  groupStatus,
  openGroups,
  tagsAfterAction,
  unanswerableGroups,
  waitsForGroups,
} from "../answerGroups";
import type { MediaReviewAction } from "../model";
import type { OccurrenceApplication } from "../occurrences";

// Two questions: "Kind" (tags 1 and 2, one pair of opposites) and "Size" (tags 11–13 under 10).
const actions: MediaReviewAction[] = [
  {
    id: "first",
    label: "First kind",
    group: "Kind",
    steps: [
      { mode: "ADD", tagIds: [1] },
      { mode: "REMOVE", tagIds: [2] },
    ],
  },
  {
    id: "second",
    label: "Second kind",
    group: " kind ",
    steps: [
      { mode: "ADD", tagIds: [2] },
      { mode: "REMOVE", tagIds: [1] },
    ],
  },
  { id: "small", label: "Small", group: "Size", steps: [{ mode: "ADD", tagIds: [11] }, { mode: "REMOVE_TREE", tagIds: [10] }] },
  { id: "large", label: "Large", group: "SIZE", steps: [{ mode: "MARK_PRESENT", tagIds: [13] }, { mode: "REMOVE_TREE", tagIds: [10] }] },
  { id: "none", label: "No size", group: "size", steps: [{ mode: "MARK_ABSENT", tagIds: [11, 12, 13] }] },
  { id: "note", label: "Note", steps: [{ mode: "ADD", tagIds: [30] }] },
  { id: "spaces", label: "Spaces", group: "   ", steps: [{ mode: "ADD", tagIds: [31] }] },
];
const media = (ids: number[], absent: number[] = []) => ({ ids, absent });
const state = (statuses: ReturnType<typeof groupStatus>) =>
  Object.fromEntries(statuses.map((group) => [group.name, group.answers.map((index) => actions[index].label)]));
const trees = new Map([[10, [10, 11, 12, 13]]]);

describe("answer groups", () => {
  it("names groups trimmed, matching them ignoring case, and leaves blank names ungrouped", () => {
    expect(groupKey("  Size ")).toBe("size");
    expect(groupKey("   ")).toBe("");
    expect(groupKey(undefined)).toBe("");
    // In the order of each group's first action, spelled as that action spells it.
    expect(actionGroups(actions)).toEqual([
      { key: "kind", name: "Kind", actions: [0, 1] },
      { key: "size", name: "Size", actions: [2, 3, 4] },
    ]);
  });

  it("knows which actions can answer, and which groups nothing answers", () => {
    expect(actions.map(answersGroup)).toEqual([true, true, true, true, true, true, true]);
    const removals: MediaReviewAction[] = [
      ...actions,
      { id: "drop", label: "Drop", group: "Cleanup", steps: [{ mode: "REMOVE_TREE", tagIds: [10] }] },
      { id: "clear", label: "Clear", group: "cleanup", steps: [{ mode: "CLEAR_ABSENCE", tagIds: [11] }] },
      { id: "pass", label: "Pass", group: "Cleanup", steps: [] },
    ];
    expect(removals.slice(7).map(answersGroup)).toEqual([false, false, false]);
    expect(unanswerableGroups(removals).map((group) => group.name)).toEqual(["Cleanup"]);
    expect(unanswerableGroups(actions)).toEqual([]);
  });

  it("waits only when the setting is on and some action has a group", () => {
    expect(waitsForGroups({ actions })).toBe(false);
    expect(waitsForGroups({ stayUntilGroupsAnswered: false, actions })).toBe(false);
    expect(waitsForGroups({ stayUntilGroupsAnswered: true, actions })).toBe(true);
    expect(waitsForGroups({ stayUntilGroupsAnswered: true, actions: actions.slice(5) })).toBe(false);
  });

  it("counts a group answered by a tag one of its actions adds or marks present", () => {
    expect(state(groupStatus(actions, media([])))).toEqual({ Kind: [], Size: [] });
    expect(state(groupStatus(actions, media([2])))).toEqual({ Kind: ["Second kind"], Size: [] });
    // Mark present answers as Add tags does; an ungrouped action's tag answers nothing.
    expect(state(groupStatus(actions, media([13, 30])))).toEqual({ Kind: [], Size: ["Large"] });
  });

  it("counts a group answered by a recorded absence one of its actions marks", () => {
    expect(state(groupStatus(actions, media([], [12])))).toEqual({ Kind: [], Size: ["No size"] });
    // An absence the group's actions never record answers nothing.
    expect(state(groupStatus(actions, media([], [1])))).toEqual({ Kind: [], Size: [] });
  });

  it("names the actions whose whole answer the item holds, else those holding part of it", () => {
    expect(state(groupStatus(actions, media([], [11, 12, 13])))).toEqual({ Kind: [], Size: ["No size"] });
    expect(state(groupStatus(actions, media([], [11])))).toEqual({ Kind: [], Size: ["No size"] });
    // A whole answer outranks part of another one.
    expect(state(groupStatus(actions, media([11], [12])))).toEqual({ Kind: [], Size: ["Small"] });
    // Both kinds carried: two answers, both listed.
    expect(state(groupStatus(actions, media([1, 2, 11])))).toEqual({
      Kind: ["First kind", "Second kind"],
      Size: ["Small"],
    });
  });

  it("reads an occurrence's tags from its applications", () => {
    const application = (id: number): OccurrenceApplication =>
      ({ id: 100 + id, hostType: "video", hostId: 1, contextType: "performer", contextId: 5, tag: { id, name: `Tag ${id}` } }) as OccurrenceApplication;
    const occurrence = { ids: [], absent: [12], applications: [application(1)] };
    expect(state(groupStatus(actions, occurrence))).toEqual({ Kind: ["First kind"], Size: ["No size"] });
    expect(tagsAfterAction(actions[1], occurrence, trees)).toEqual({ ids: [2], absent: [12] });
  });

  it("foresees the item's tags after an action, as the effect preview does", () => {
    // A tree removal spares the tag its action adds; unresolved, only the parent goes.
    expect(tagsAfterAction(actions[2], media([12, 30]), trees)).toEqual({ ids: [30, 11], absent: [] });
    expect(tagsAfterAction(actions[2], media([12, 30]), new Map())).toEqual({ ids: [12, 30, 11], absent: [] });
    // Mark present clears the absence; mark absent removes the tags and records their absence.
    expect(tagsAfterAction(actions[3], media([11], [13]), trees)).toEqual({ ids: [13], absent: [] });
    expect(tagsAfterAction(actions[4], media([1, 12]), trees)).toEqual({ ids: [1], absent: [11, 12, 13] });
  });

  it("leaves a group open until an answer is given or already there", () => {
    const open = (action: MediaReviewAction, tags: { ids: number[]; absent: number[] }) =>
      openGroups(groupStatus(actions, tagsAfterAction(action, tags, trees))).map((group) => group.name);
    expect(open(actions[0], media([]))).toEqual(["Size"]);
    expect(open(actions[2], media([1]))).toEqual([]);
    // The item already had its size: the kind alone completes it. A tag no action of the group
    // adds is no answer.
    expect(open(actions[1], media([11]))).toEqual([]);
    expect(open(actions[1], media([12]))).toEqual(["Size"]);
    // An ungrouped action answers nothing and completes whatever is already complete.
    expect(open(actions[5], media([]))).toEqual(["Kind", "Size"]);
    expect(open(actions[5], media([2], [11]))).toEqual([]);
    // Removing an answer reopens its group.
    expect(open({ id: "clear", label: "Clear", steps: [{ mode: "REMOVE_TREE", tagIds: [10] }] }, media([1, 11]))).toEqual(["Size"]);
  });
});
