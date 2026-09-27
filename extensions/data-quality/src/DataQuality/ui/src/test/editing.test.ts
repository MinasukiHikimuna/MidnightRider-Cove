import { describe, expect, it } from "vitest";
import {
  actionShortcut,
  moveItem,
  reviewValidation,
  resumeFocus,
  boundedFilter,
} from "../model";

describe("review editing and resumption", () => {
  it("moves ordered operations without modifying the original or losing identities", () => {
    const steps = [
      { mode: "ADD", tagIds: [1] },
      { mode: "REMOVE", tagIds: [1] },
    ];
    expect(moveItem(steps, 1, -1)).toEqual([steps[1], steps[0]]);
    expect(steps[0].mode).toBe("ADD");
    expect(moveItem(steps, 0, -1)).toEqual(steps);
  });
  it("assigns the 27 letter keys by action position, never n or m", () => {
    const base = {
      id: "r",
      name: "Review",
      description: "",
      view: {
        filter: {},
        objectFilter: {},
        displayMode: "grid" as const,
        searchMode: "text",
      },
      actions: [],
    };
    const a = { id: "a", label: "Skip", steps: [] };
    const keys = Array.from({ length: 28 }, (_, index) => actionShortcut(a, index));
    expect(keys.join("")).toBe("qwertyuiopåasdfghjklöäzxcvb");
    expect(keys[0]).toBe("q");
    expect(keys[10]).toBe("å");
    expect(keys[11]).toBe("a");
    expect(keys[14]).toBe("f");
    expect(keys[15]).toBe("g");
    expect(keys[18]).toBe("k");
    expect(keys[26]).toBe("b");
    expect(keys[27]).toBe("");
    expect(keys).not.toContain("n");
    expect(keys).not.toContain("m");
    // The saved shortcut field is kept for old exports but never decides the key.
    expect(actionShortcut({ ...a, shortcut: "1" }, 1)).toBe("w");
    expect(reviewValidation({ ...base, actions: [{ ...a, shortcut: "1" }] })).toBe("");
  });
  it("resumes by identity then clamped index when results change", () => {
    expect(resumeFocus([9, 4, 7], 4, 0)).toBe(4);
    expect(resumeFocus([9, 7], 4, 1)).toBe(7);
    expect(resumeFocus([9], 4, 20)).toBe(9);
    expect(resumeFocus([], 4, 20)).toBe(null);
  });
  it("bounds large and malformed page requests", () => {
    expect(boundedFilter({ page: -5, perPage: 100000 })).toMatchObject({
      page: 1,
      perPage: 1000,
    });
    expect(boundedFilter({ page: "invalid", perPage: 0 })).toMatchObject({
      page: 1,
      perPage: 40,
    });
  });
});
