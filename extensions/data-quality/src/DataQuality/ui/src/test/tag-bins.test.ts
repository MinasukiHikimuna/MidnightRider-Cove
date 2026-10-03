import { describe, expect, it } from "vitest";
import { splitQueueBins, toggleQueueBin, withQueueBin } from "../TagPresentation";
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
      const binned = withQueueBin(withQueueBin(review(base), 5), 7);
      expect(splitQueueBins(binned.view.objectFilter)).toEqual({ base, bins: [5, 7] });
    }
    expect(splitQueueBins(plain)).toEqual({ base: plain, bins: [] });
  });

  it("switches a bin on and off, back to the saved filter", () => {
    const saved = review({ ...plain, _filterExpression: expression });
    const one = toggleQueueBin(saved, 5);
    expect(one.view.objectFilter).toEqual(withQueueBin(saved, 5).view.objectFilter);
    const two = toggleQueueBin(one, 7);
    expect(splitQueueBins(two.view.objectFilter).bins).toEqual([5, 7]);
    // Lifting the first bin keeps the second in place.
    const second = toggleQueueBin(two, 5);
    expect(second.view.objectFilter).toEqual(withQueueBin(saved, 7).view.objectFilter);
    expect(toggleQueueBin(second, 7).view.objectFilter).toEqual(saved.view.objectFilter);
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
    expect(splitQueueBins(own)).toEqual({ base: own, bins: [] });
    expect(splitQueueBins({ ...own, organized: true })).toEqual({
      base: { ...own, organized: true },
      bins: [],
    });
  });
});

describe("queue tag bins against the saved filter", () => {
  const leaf = (id: number) => ({ filter: { tagsCriterion: { value: [id], modifier: "INCLUDES", depth: 0 } } });

  it("returns to the saved filter itself, whatever its key order, once the bins are lifted", () => {
    // The expression first: rebuilt in withQueueBin's order this would read as another queue.
    const savedFilter = { _filterExpression: { operator: "OR", children: [leaf(9)] }, organized: true };
    const saved = review(savedFilter);
    const binned = toggleQueueBin(saved, 5, savedFilter);
    expect(splitQueueBins(binned.view.objectFilter, savedFilter)).toEqual({ base: savedFilter, bins: [5] });
    expect(toggleQueueBin(binned, 5, savedFilter).view.objectFilter).toBe(savedFilter);
  });

  it("never reads the saved filter's own exact-tag condition as a bin", () => {
    const savedFilter = { _filterExpression: { operator: "AND", children: [leaf(9)] } };
    expect(splitQueueBins(savedFilter, savedFilter)).toEqual({ base: savedFilter, bins: [] });
    const binned = toggleQueueBin(review(savedFilter), 5, savedFilter);
    expect(splitQueueBins(binned.view.objectFilter, savedFilter).bins).toEqual([5]);
    // Without the saved filter to stop at, the same shape would be peeled as a bin too.
    expect(splitQueueBins(binned.view.objectFilter).bins).toEqual([9, 5]);
  });
});

describe("queue filter bins", () => {
  const women = {
    performerCountCriterion: { value: 2, modifier: "EQUALS" },
    performerFilterCriterion: {
      mode: "EVERY",
      objectFilter: { genderCriterion: { value: "FEMALE", modifier: "EQUALS" } },
    },
  };
  const scoped = {
    _filterExpression: {
      operator: "AND",
      relatedScope: { filterKey: "performerFilterCriterion", matchMode: "DISTINCT" },
      children: [{ filter: { organized: true } }],
    },
  };
  const mixed = { ...women, _filterExpression: scoped._filterExpression };
  const bins = [
    { key: "ff", label: "Two women", filter: women, group: "Makeup" },
    { key: "fm", label: "Scoped", filter: scoped, group: "Makeup" },
    { key: "both", label: "Both", filter: mixed },
  ];
  function configured(objectFilter: Record<string, unknown>): VideoReview {
    return { ...review(objectFilter), presentation: { filterBins: bins } };
  }
  const plain = { titleCriterion: { value: "x", modifier: "INCLUDES" } };

  it("finds filter bins of every shape among tag bins, over every filter shape", () => {
    for (const base of [{}, plain, { _filterExpression: { operator: "OR", children: [] } }]) {
      const binned = ["ff", 5, "both", "fm"].reduce<VideoReview>(
        (current, bin) => withQueueBin(current, bin),
        configured(base),
      );
      expect(splitQueueBins(binned.view.objectFilter, undefined, bins)).toEqual({
        base,
        bins: ["ff", 5, "both", "fm"],
      });
    }
  });

  it("writes a filter bin as its criteria, its expression, or both", () => {
    const children = (bin: string) =>
      (withQueueBin(configured({}), bin).view.objectFilter._filterExpression as { children: unknown[] })
        .children;
    expect(children("ff")).toEqual([{ filter: women }]);
    expect(children("fm")).toEqual([{ group: scoped._filterExpression }]);
    expect(children("both")).toEqual([
      {
        group: {
          operator: "AND",
          children: [{ filter: women }, { group: scoped._filterExpression }],
        },
      },
    ]);
  });

  it("keeps a group pick-one, and other bins in place", () => {
    const saved = configured(plain);
    const first = toggleQueueBin(toggleQueueBin(saved, 5, plain), "ff", plain);
    const swapped = toggleQueueBin(first, "fm", plain);
    expect(splitQueueBins(swapped.view.objectFilter, plain, bins).bins).toEqual([5, "fm"]);
    const added = toggleQueueBin(swapped, "both", plain);
    expect(splitQueueBins(added.view.objectFilter, plain, bins).bins).toEqual([5, "fm", "both"]);
    const lifted = ["fm", "both", 5].reduce<VideoReview>(
      (current, bin) => toggleQueueBin(current, bin, plain),
      added,
    );
    expect(lifted.view.objectFilter).toBe(plain);
  });

  it("leaves a filter it has no definition for, or an unset filter, as the queue's own", () => {
    const binned = withQueueBin(configured(plain), "ff").view.objectFilter;
    expect(splitQueueBins(binned)).toEqual({ base: binned, bins: [] });
    expect(withQueueBin(configured(plain), "missing").view.objectFilter).toBe(plain);
    const unset = { ...review(plain), presentation: { filterBins: [{ key: "new", label: "", filter: {} }] } };
    expect(withQueueBin(unset, "new").view.objectFilter).toBe(plain);
  });
});
