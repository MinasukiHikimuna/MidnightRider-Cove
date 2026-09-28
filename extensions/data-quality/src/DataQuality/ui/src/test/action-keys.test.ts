import { describe, expect, it } from "vitest";
import {
  ACTION_KEYS,
  actionKeyChoice,
  actionKeyMap,
  parseReviews,
  reviewValidation,
  withActionKey,
  type MediaReviewAction,
  type VideoReview,
} from "../model";

function actions(...shortcuts: Array<string | undefined>): MediaReviewAction[] {
  return shortcuts.map((shortcut, index) => ({
    id: `action-${index}`,
    label: `Action ${index + 1}`,
    steps: [],
    ...(shortcut === undefined ? {} : { shortcut }),
  }));
}
const keysOf = (list: readonly MediaReviewAction[]) => actionKeyMap(list).keys;

describe("actionKeyMap", () => {
  it("gives Auto actions the free keys in keyboard order, never n or m", () => {
    const keys = keysOf(actions(...Array<undefined>(27).fill(undefined)));
    expect(keys.join("")).toBe("qwertyuiopåasdfghjklöäzxcvb");
    expect(keys).not.toContain("n");
    expect(keys).not.toContain("m");
    expect(ACTION_KEYS).toHaveLength(27);
  });

  it("places pinned actions first and fills the rest around them", () => {
    // Pinned to s, Auto, pinned to a, Auto, pinned to q.
    const map = actionKeyMap(actions("s", undefined, "a", undefined, "q"));
    expect(map.keys).toEqual(["s", "w", "a", "e", "q"]);
    expect([...map.actionOn.entries()].sort()).toEqual([
      ["a", 2],
      ["e", 3],
      ["q", 4],
      ["s", 0],
      ["w", 1],
    ]);
    expect(map.duplicatePins.size).toBe(0);
  });

  it("leaves No key actions and Auto actions past the free keys without a key", () => {
    const list = actions("none", ...Array<undefined>(28).fill(undefined), "b");
    const map = actionKeyMap(list);
    expect(map.keys[0]).toBe("");
    // 26 keys are free once b is pinned: the 27th and 28th Auto actions get none.
    expect(map.keys.slice(1, 27).join("")).toBe("qwertyuiopåasdfghjklöäzxcv");
    expect(map.keys.slice(27, 29)).toEqual(["", ""]);
    expect(map.keys[29]).toBe("b");
    expect(map.actionOn.size).toBe(27);
  });

  it("keeps a key pinned twice with the first action and turns the later ones Auto", () => {
    const map = actionKeyMap(actions(undefined, "w", "w", "q"));
    expect(map.keys).toEqual(["e", "w", "r", "q"]);
    expect([...map.duplicatePins]).toEqual([2]);
  });

  it("reads saved digits and other values as Auto", () => {
    const list = actions("1", "Q", "n", "ArrowRight", "", "g");
    expect(list.map(actionKeyChoice)).toEqual(["auto", "auto", "auto", "auto", "auto", "g"]);
    expect(keysOf(list)).toEqual(["q", "w", "e", "r", "t", "g"]);
    expect(actionKeyMap(list).duplicatePins.size).toBe(0);
  });
});

describe("withActionKey", () => {
  it("pins a free key, and turns the action Auto or keyless", () => {
    const list = actions(undefined, undefined);
    const pinned = withActionKey(list, 1, "k");
    expect(pinned[1].shortcut).toBe("k");
    expect(keysOf(pinned)).toEqual(["q", "k"]);
    // Only the chosen action changes.
    expect(pinned[0]).toBe(list[0]);
    const auto = withActionKey(pinned, 1, "auto");
    expect(auto[1]).not.toHaveProperty("shortcut");
    expect(keysOf(auto)).toEqual(["q", "w"]);
    const none = withActionKey(pinned, 1, "none");
    expect(none[1].shortcut).toBe("none");
    expect(keysOf(none)).toEqual(["q", ""]);
  });

  it("swaps with the action on the key, which takes the chooser's pinned key", () => {
    const list = actions("a", "s", undefined);
    const swapped = withActionKey(list, 0, "s");
    expect(swapped.map((action) => action.shortcut)).toEqual(["s", "a", undefined]);
    expect(keysOf(swapped)).toEqual(["s", "a", "q"]);
  });

  it("turns the action on the key Auto when the chooser had no pin", () => {
    // Pinned to s, then an Auto action on q.
    const list = actions("s", undefined);
    const moved = withActionKey(list, 1, "s");
    expect(moved.map((action) => action.shortcut)).toEqual([undefined, "s"]);
    expect(keysOf(moved)).toEqual(["q", "s"]);
    // Taking an Auto action's key pins the chooser there and moves the other one on.
    const taken = withActionKey(actions(undefined, undefined, "none"), 2, "q");
    expect(keysOf(taken)).toEqual(["w", "e", "q"]);
  });

  it("pins an Auto action to the key it already has", () => {
    const list = actions(undefined, "q");
    const pinned = withActionKey(list, 0, "w");
    expect(pinned[0].shortcut).toBe("w");
    expect(pinned[1]).toBe(list[1]);
    expect(keysOf(pinned)).toEqual(["w", "q"]);
  });

  it("settles a key pinned twice in favour of the choice just made", () => {
    // The first and third action are both pinned to w; the third one chooses w again.
    const list = actions("w", undefined, "w");
    const settled = withActionKey(list, 2, "w");
    expect(settled.map((action) => action.shortcut)).toEqual([undefined, undefined, "w"]);
    expect(keysOf(settled)).toEqual(["q", "e", "w"]);
    expect(actionKeyMap(settled).duplicatePins.size).toBe(0);
    // A swap hands the chooser's pin over whole: a later duplicate of it turns Auto.
    const swapped = withActionKey(actions("a", "s", "a"), 0, "s");
    expect(swapped.map((action) => action.shortcut)).toEqual(["s", "a", undefined]);
    expect(keysOf(swapped)).toEqual(["s", "a", "q"]);
  });
});

describe("saved key choices", () => {
  const review = (list: MediaReviewAction[]): VideoReview => ({
    id: "r",
    name: "Review",
    description: "",
    view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
    actions: list,
  });

  it("accepts pinned keys, no key, legacy values and duplicate pins, and keeps them as saved", () => {
    const list = actions("s", "none", "1", "s", undefined);
    expect(reviewValidation(review(list))).toBe("");
    const [read] = parseReviews(JSON.stringify([review(list)]));
    expect(read.actions.map((action) => action.shortcut)).toEqual(["s", "none", "1", "s", undefined]);
  });

  it("refuses a saved key that is not text", () => {
    const list = [{ id: "a", label: "A", steps: [], shortcut: 1 }] as unknown as MediaReviewAction[];
    expect(() => parseReviews(JSON.stringify([review(list)]))).toThrow();
  });
});
