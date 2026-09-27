import { describe, expect, it } from "vitest";
import { splitTagBins, toggleTagBin, withTagBin } from "../TagPresentation";
import type { VideoReview } from "../model";

function review(objectFilter: Record<string, unknown>): VideoReview {
  return {
    id: "review",
    name: "Review",
    description: "",
    view: {
      filter: { page: 1, perPage: 40 },
      objectFilter,
      displayMode: "grid",
      searchMode: "text",
    },
    actions: [],
  };
}

describe("queue tag bins", () => {
  const plain = { titleCriterion: { value: "x", modifier: "INCLUDES" } };
  const expression = { operator: "OR", children: [{ filter: { organized: true } }] };

  it("finds the bins applied to a queue and the filter underneath, for every filter shape", () => {
    for (const base of [{}, plain, { _filterExpression: expression }, { ...plain, _filterExpression: expression }]) {
      const binned = withTagBin(withTagBin(review(base), 5), 7);
      expect(splitTagBins(binned.view.objectFilter)).toEqual({ base, bins: [5, 7] });
    }
    expect(splitTagBins(plain)).toEqual({ base: plain, bins: [] });
  });

  it("switches a bin on and off, back to the saved filter", () => {
    const saved = review({ ...plain, _filterExpression: expression });
    const one = toggleTagBin(saved, 5);
    expect(one.view.objectFilter).toEqual(withTagBin(saved, 5).view.objectFilter);
    const two = toggleTagBin(one, 7);
    expect(splitTagBins(two.view.objectFilter).bins).toEqual([5, 7]);
    // Lifting the first bin keeps the second in place.
    const second = toggleTagBin(two, 5);
    expect(second.view.objectFilter).toEqual(withTagBin(saved, 7).view.objectFilter);
    expect(toggleTagBin(second, 7).view.objectFilter).toEqual(saved.view.objectFilter);
  });

  it("leaves other expressions alone", () => {
    const own = {
      _filterExpression: {
        operator: "AND",
        children: [
          { filter: plain },
          // Includes subtags, so it is not a bin.
          { filter: { tagsCriterion: { value: [5], modifier: "INCLUDES", depth: -1 } } },
        ],
      },
    };
    expect(splitTagBins(own)).toEqual({ base: own, bins: [] });
    expect(splitTagBins({ ...own, organized: true })).toEqual({
      base: { ...own, organized: true },
      bins: [],
    });
  });
});

describe("queue tag bins against the saved filter", () => {
  const leaf = (id: number) => ({ filter: { tagsCriterion: { value: [id], modifier: "INCLUDES", depth: 0 } } });

  it("returns to the saved filter itself, whatever its key order, once the bins are lifted", () => {
    // The expression first: rebuilt in withTagBin's order this would read as another queue.
    const savedFilter = { _filterExpression: { operator: "OR", children: [leaf(9)] }, organized: true };
    const saved = review(savedFilter);
    const binned = toggleTagBin(saved, 5, savedFilter);
    expect(splitTagBins(binned.view.objectFilter, savedFilter)).toEqual({ base: savedFilter, bins: [5] });
    expect(toggleTagBin(binned, 5, savedFilter).view.objectFilter).toBe(savedFilter);
  });

  it("never reads the saved filter's own exact-tag condition as a bin", () => {
    const savedFilter = { _filterExpression: { operator: "AND", children: [leaf(9)] } };
    expect(splitTagBins(savedFilter, savedFilter)).toEqual({ base: savedFilter, bins: [] });
    const binned = toggleTagBin(review(savedFilter), 5, savedFilter);
    expect(splitTagBins(binned.view.objectFilter, savedFilter).bins).toEqual([5]);
    // Without the saved filter to stop at, the same shape would be peeled as a bin too.
    expect(splitTagBins(binned.view.objectFilter).bins).toEqual([9, 5]);
  });
});
