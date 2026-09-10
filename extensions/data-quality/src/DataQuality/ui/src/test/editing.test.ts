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
  it("assigns fixed Q–P shortcuts by action position", () => {
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
    expect(actionShortcut(a, 0)).toBe("q");
    expect(actionShortcut(a, 9)).toBe("p");
    expect(actionShortcut(a, 10)).toBe("");
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
