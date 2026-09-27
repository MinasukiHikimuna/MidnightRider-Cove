import { describe, expect, it } from "vitest";
import {
  currentTags,
  previewActionEffect,
  removalTreeParents,
} from "../effectPreview";
import { actionEffectParts } from "../FindAction";
import type { MediaReviewAction, ReviewStep } from "../model";

const action = (...steps: ReviewStep[]): MediaReviewAction => ({
  id: "a",
  label: "Action",
  steps,
});
const state = (ids: number[], absent: number[] = []) => ({ ids, absent });
// Parent 10 holds 11, 12 and 13; parent 20 holds 21.
const trees = new Map([
  [10, [10, 11, 12, 13]],
  [20, [20, 21]],
]);

describe("previewActionEffect", () => {
  it("adds and removes plain tags, ignoring what is already so", () => {
    expect(
      previewActionEffect(
        action({ mode: "ADD", tagIds: [1, 2] }, { mode: "REMOVE", tagIds: [3, 4] }),
        state([2, 3]),
        trees,
      ),
    ).toEqual({
      added: [1],
      removed: [3],
      markedAbsent: [],
      absenceCleared: [],
      unresolvedTrees: [],
    });
  });

  it("removes a tree except the tags the same action adds or marks present, in either order", () => {
    const expected = { added: [11], removed: [12, 10] };
    for (const steps of [
      [
        { mode: "REMOVE_TREE", tagIds: [10] },
        { mode: "ADD", tagIds: [11] },
      ],
      [
        { mode: "ADD", tagIds: [11] },
        { mode: "REMOVE_TREE", tagIds: [10] },
      ],
    ] as ReviewStep[][])
      expect(previewActionEffect(action(...steps), state([12, 10, 30]), trees)).toMatchObject(
        expected,
      );
    // A tag marked present is spared as well, and keeps its place when already there.
    expect(
      previewActionEffect(
        action({ mode: "REMOVE_TREE", tagIds: [10] }, { mode: "MARK_PRESENT", tagIds: [13] }),
        state([13, 12], [13]),
        trees,
      ),
    ).toMatchObject({ added: [], removed: [12], absenceCleared: [13] });
  });

  it("runs plain steps before assessment steps, as the action does", () => {
    // Listed first, the absence still wins over the later plain ADD of the same tag.
    expect(
      previewActionEffect(
        action({ mode: "MARK_ABSENT", tagIds: [5] }, { mode: "ADD", tagIds: [5] }),
        state([]),
        trees,
      ),
    ).toMatchObject({ added: [], removed: [], markedAbsent: [5] });
    // MARK_PRESENT after a plain REMOVE of the same tag leaves it present.
    expect(
      previewActionEffect(
        action({ mode: "MARK_PRESENT", tagIds: [6] }, { mode: "REMOVE", tagIds: [6] }),
        state([6]),
        trees,
      ),
    ).toMatchObject({ added: [], removed: [], markedAbsent: [] });
  });

  it("records and clears absences", () => {
    expect(
      previewActionEffect(action({ mode: "MARK_ABSENT", tagIds: [7, 8] }), state([7], [8]), trees),
    ).toEqual({
      added: [],
      removed: [7],
      markedAbsent: [7],
      absenceCleared: [],
      unresolvedTrees: [],
    });
    expect(
      previewActionEffect(action({ mode: "MARK_PRESENT", tagIds: [8] }), state([], [8]), trees),
    ).toMatchObject({ added: [8], absenceCleared: [8] });
    // Clearing an absence touches only the absence.
    expect(
      previewActionEffect(action({ mode: "CLEAR_ABSENCE", tagIds: [8, 9] }), state([9], [8]), trees),
    ).toEqual({
      added: [],
      removed: [],
      markedAbsent: [],
      absenceCleared: [8],
      unresolvedTrees: [],
    });
  });

  it("resolves several trees of one step, leaving an unresolved one at its parent", () => {
    expect(
      previewActionEffect(
        action({ mode: "REMOVE_TREE", tagIds: [10, 40] }),
        state([12, 40, 41, 30]),
        trees,
      ),
    ).toMatchObject({ removed: [12, 40], unresolvedTrees: [40] });
  });

  it("removes a tag in a removed tree that the same action marks absent, and records the absence", () => {
    // Only tags the action adds or marks present are spared from its tree removals.
    expect(
      previewActionEffect(
        action({ mode: "MARK_ABSENT", tagIds: [12] }, { mode: "REMOVE_TREE", tagIds: [10] }),
        state([11, 12]),
        trees,
      ),
    ).toMatchObject({ added: [], removed: [11, 12], markedAbsent: [12] });
  });

  it("counts only the parent of a tree that is not resolved yet, and says so", () => {
    expect(
      previewActionEffect(action({ mode: "REMOVE_TREE", tagIds: [40] }), state([40, 41]), trees),
    ).toMatchObject({ removed: [40], unresolvedTrees: [40] });
  });

  it("changes nothing for a skip", () => {
    expect(previewActionEffect(action(), state([1], [2]), trees)).toEqual({
      added: [],
      removed: [],
      markedAbsent: [],
      absenceCleared: [],
      unresolvedTrees: [],
    });
  });
});

describe("currentTags", () => {
  it("names occurrence tags from their applications, whatever the name lists hold", () => {
    // Two tags share a name, so the de-duplicated names list is one shorter than the ids.
    expect(
      currentTags({
        ids: [1, 2, 3],
        names: ["Same", "Other"],
        applications: [
          { id: 100, hostType: "video", hostId: 9, tag: { id: 1, name: "Same" } },
          { id: 101, hostType: "video", hostId: 9, tag: { id: 2, name: "Same" } },
          { id: 102, hostType: "video", hostId: 9, tag: { id: 3, name: "Other" } },
          { id: 103, hostType: "video", hostId: 9, tag: { id: 3, name: "Other" } },
        ],
      }),
    ).toEqual([
      { id: 3, name: "Other" },
      { id: 1, name: "Same" },
      { id: 2, name: "Same" },
    ]);
  });

  it("pairs media tag ids with their names", () => {
    expect(currentTags({ ids: [4, 5], names: ["Four", "Five"] })).toEqual([
      { id: 5, name: "Five" },
      { id: 4, name: "Four" },
    ]);
  });

  it("keeps a media item's tags with their display data, in Cove's display order", () => {
    const grouped = {
      id: 7,
      name: "Grouped",
      color: "#336699",
      tagGroupId: 2,
      tagGroupName: "Group",
      tagGroupColor: "#993366",
      tagGroupSortOrder: 1,
    };
    expect(
      currentTags({
        ids: [6, 7],
        names: ["Plain", "Grouped"],
        tags: [{ id: 6, name: "Plain" }, grouped],
      }),
    ).toEqual([grouped, { id: 6, name: "Plain" }]);
  });
});

describe("removal wording", () => {
  it("lists every tree parent once", () => {
    expect(
      removalTreeParents([
        action({ mode: "REMOVE_TREE", tagIds: [10, 20] }),
        action({ mode: "ADD", tagIds: [1] }, { mode: "REMOVE_TREE", tagIds: [10] }),
        { id: "t", label: "Tag review", effect: { mode: "SKIP" } },
      ]),
    ).toEqual([10, 20]);
  });

  it("says a tree removal clears the rest of the tree when the action keeps a tag in it", () => {
    const names = { 10: "Parent", 11: "Child", 20: "Other", 30: "Elsewhere" };
    const keeps = action({ mode: "ADD", tagIds: [11] }, { mode: "REMOVE_TREE", tagIds: [10] });
    expect(actionEffectParts(keeps, names, [], trees)).toEqual([
      { text: "+ Child", tone: "add" },
      { text: "− rest of Parent", tone: "remove" },
    ]);
    // Without the resolved tree, or with the kept tag outside it, the whole tree goes.
    expect(actionEffectParts(keeps, names)[1].text).toBe("− Parent tree");
    expect(
      actionEffectParts(
        action({ mode: "ADD", tagIds: [30] }, { mode: "REMOVE_TREE", tagIds: [20] }),
        names,
        [],
        trees,
      )[1].text,
    ).toBe("− Other tree");
    // Keeping the parent itself also leaves "the rest".
    expect(
      actionEffectParts(
        action({ mode: "MARK_PRESENT", tagIds: [20] }, { mode: "REMOVE_TREE", tagIds: [20] }),
        names,
      )[1].text,
    ).toBe("− rest of Other");
  });
});
