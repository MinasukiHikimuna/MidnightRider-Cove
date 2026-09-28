import { describe, expect, it } from "vitest";
import { moveItem, resumeFocus, boundedFilter } from "../model";

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
