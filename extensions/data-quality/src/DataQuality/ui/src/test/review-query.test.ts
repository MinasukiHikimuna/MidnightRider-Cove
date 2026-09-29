import { expect, it } from "vitest";
import {
  defaultQuery,
  readQuery,
  writeQuery,
  effectiveReview,
  focusedReview,
  normalizedReview,
  queryDiffers,
  savableQuery,
  withoutTagBins,
} from "../reviewQuery";
import type { OccurrenceReview, VideoReview } from "../model";
import { withTagBin } from "../TagPresentation";
const review: OccurrenceReview = {
  id: "r",
  name: "Review",
  description: "",
  entityType: "performerOccurrence",
  actions: [],
  view: {
    filter: { perPage: 5, sort: "date", direction: "asc", q: "saved" },
    objectFilter: { organized: false },
    displayMode: "grid",
    searchMode: "text",
    startFrom: "end",
  },
  occurrence: {
    targetMode: "filter",
    performerIds: [],
    performerFilter: { gender: "FEMALE" },
    condition: "excludes",
    conditionTagIds: [2],
    tagIds: [3],
    multiple: true,
  },
};
it("serializes saved defaults as a complete query, independent of later defaults", () => {
  const initial = readQuery(review, new URLSearchParams("review=r"));
  expect(initial.startAtEnd).toBe(true);
  writeQuery("r", initial.query);
  const params = new URLSearchParams(window.location.search);
  expect(params.get("filters")).toBe('{"organized":false}');
  expect(params.get("q")).toBe("saved");
  const changed = {
    ...review,
    view: { ...review.view, objectFilter: { organized: true } },
  };
  expect(readQuery(changed, params).query).toEqual(initial.query);
  expect(readQuery(changed, params).startAtEnd).toBe(false);
});
it("does not merge saved criteria into explicit empty or partial URLs", () => {
  const result = readQuery(review, new URLSearchParams("filters={}&q=&page=3"));
  expect(result.query.objectFilter).toEqual({});
  expect(result.query.filter.q).toBe("");
  expect(result.query.filter.page).toBe(3);
  expect(result.query.performerScope?.targetMode).toBe("all");
  expect(result.query.performerScope?.condition).toBe("any");
  expect(result.startAtEnd).toBe(false);
});
it("round trips performer scope, occurrence conditions, multicolumn sort and explicit page", () => {
  const query = defaultQuery(review);
  query.performerScope = {
    ...query.performerScope!,
    targetMode: "selected",
    performerIds: [4, 5],
    includeSubtags: false,
  };
  query.filter = {
    ...query.filter,
    page: 4,
    sorts: [
      { key: "date", direction: "asc" },
      { key: "id", direction: "desc" },
    ],
  };
  writeQuery("r", query);
  expect(new URLSearchParams(window.location.search).get("sorts")).toBe(
    "date:asc,id:desc",
  );
  expect(
    readQuery(review, new URLSearchParams(window.location.search)).query,
  ).toEqual(query);
  const effective = effectiveReview(review, query) as OccurrenceReview;
  expect(effective.occurrence.tagIds).toEqual([3]);
  expect(effective.occurrence.performerIds).toEqual([4, 5]);
  expect(effective.occurrence.includeSubtags).toBe(false);
  expect(effective.view.objectFilter).toEqual({ organized: false });
});
it("rejects malformed criteria instead of silently restoring hidden defaults", () => {
  expect(() => readQuery(review, new URLSearchParams('performerScope={"includeSubtags":"false"}'))).toThrow();
  expect(() => readQuery(review, new URLSearchParams("filters=[]"))).toThrow();
  expect(() =>
    readQuery(
      review,
      new URLSearchParams('performerScope={"targetMode":"invalid"}'),
    ),
  ).toThrow();
});

it("restores the saved subtag choice and defaults older reviews to including subtags", () => {
  expect(defaultQuery(review).performerScope?.includeSubtags).toBe(true);
  const exact = { ...review, occurrence: { ...review.occurrence, includeSubtags: false } };
  expect(defaultQuery(exact).performerScope?.includeSubtags).toBe(false);
  const legacyScope = { ...review.occurrence };
  const params = new URLSearchParams({ performerScope: JSON.stringify(legacyScope) });
  expect(readQuery(exact, params).query.performerScope?.includeSubtags).toBe(true);
});
it("defaults hiding confirmed-absent occurrences on and keeps an explicit opt-out", () => {
  expect(defaultQuery(review).performerScope?.hideConfirmedAbsent).toBe(true);
  const shown = { ...review, occurrence: { ...review.occurrence, hideConfirmedAbsent: false } };
  expect(defaultQuery(shown).performerScope?.hideConfirmedAbsent).toBe(false);
  expect(() => readQuery(review, new URLSearchParams('performerScope={"hideConfirmedAbsent":"false"}'))).toThrow();
});

it("round trips a missing-at-least-one condition and a performer focus that the review never saves", () => {
  const query = defaultQuery(review);
  query.performerScope = {
    ...query.performerScope!,
    condition: "excludesAll",
    conditionTagIds: [2, 4],
  };
  query.performerFocus = 7;
  writeQuery("r", query);
  const params = new URLSearchParams(window.location.search);
  expect(params.get("performer")).toBe("7");
  expect(readQuery(review, params).query).toEqual(query);
  const effective = effectiveReview(review, query) as OccurrenceReview;
  expect(effective.occurrence).toMatchObject({
    condition: "excludesAll",
    conditionTagIds: [2, 4],
    targetMode: "filter",
    performerIds: [],
  });
  expect(focusedReview(effective, query.performerFocus).occurrence).toMatchObject({
    targetMode: "selected",
    performerIds: [7],
    condition: "excludesAll",
    performerFilter: { gender: "FEMALE" },
  });
  expect(focusedReview(effective, undefined)).toBe(effective);
  expect(defaultQuery(review).performerFocus).toBeUndefined();
  query.performerFocus = undefined;
  writeQuery("r", query);
  expect(new URLSearchParams(window.location.search).has("performer")).toBe(false);
});

it("rejects an invalid performer focus and keeps flag tags out of the URL scope", () => {
  expect(() => readQuery(review, new URLSearchParams("performer=abc"))).toThrow(
    "Invalid performer focus",
  );
  expect(() => readQuery(review, new URLSearchParams("performer=0"))).toThrow();
  const flagged = {
    ...review,
    occurrence: {
      ...review.occurrence,
      flagPerformerTagIds: [9],
      performerFlags: [{ tagId: 8, categoryTagId: 30 }],
    },
  };
  const query = defaultQuery(flagged);
  expect(query.performerScope).not.toHaveProperty("flagPerformerTagIds");
  expect(query.performerScope).not.toHaveProperty("performerFlags");
  const effective = (effectiveReview(flagged, query) as OccurrenceReview).occurrence;
  expect(effective.flagPerformerTagIds).toEqual([9]);
  expect(effective.performerFlags).toEqual([{ tagId: 8, categoryTagId: 30 }]);
});

it("keeps the saved queue when a link carries only a performer focus", () => {
  const saved = {
    ...review,
    view: { ...review.view, filter: { ...review.view.filter, sort: "title" }, startFrom: "beginning" as const },
  };
  const { query, startAtEnd } = readQuery(saved, new URLSearchParams("review=r&performer=12"));
  expect(query).toEqual({ ...defaultQuery(saved), performerFocus: 12 });
  expect(query.performerScope?.condition).toBe("excludes");
  expect(query.objectFilter).toEqual({ organized: false });
  expect(startAtEnd).toBe(false);
});

const videoReview: VideoReview = {
  id: "v",
  name: "Video review",
  description: "",
  actions: [],
  view: {
    // As new reviews save it: no search yet, and no direction for older ones.
    filter: { page: 1, perPage: 40, sort: "date", direction: "desc" },
    objectFilter: { organized: false },
    displayMode: "grid",
    searchMode: "text",
  },
};
const binned = (objectFilter: Record<string, unknown>, tagId: number) =>
  withTagBin({ ...videoReview, view: { ...videoReview.view, objectFilter } }, tagId).view.objectFilter;

it("normalizes a review's criteria the way a review link reads them", () => {
  // A link round trip fills in the search and the direction; the queue is the same.
  const linked = readQuery(videoReview, new URLSearchParams("review=v&page=3&perPage=40&sort=date&direction=desc&filters=%7B%22organized%22%3Afalse%7D&searchMode=text&startFrom=end")).query;
  expect(
    JSON.stringify(normalizedReview(effectiveReview(videoReview, linked))),
  ).toBe(JSON.stringify(normalizedReview(videoReview)));
  expect(normalizedReview(videoReview).view).toMatchObject({
    filter: { q: "", page: 1, perPage: 40 },
    startFrom: "end",
  });
  expect(queryDiffers(videoReview, linked)).toBe(false);
  expect(queryDiffers(videoReview, { ...linked, filter: { ...linked.filter, q: "x" } })).toBe(true);
  expect(queryDiffers(videoReview, { ...linked, startFrom: "beginning" })).toBe(true);
});

it("leaves queue tag bins out of what a video review saves, down to the saved filter", () => {
  const query = defaultQuery(videoReview);
  const one = binned(videoReview.view.objectFilter, 5);
  const two = withTagBin({ ...videoReview, view: { ...videoReview.view, objectFilter: one } }, 7).view.objectFilter;
  // Bins alone: the savable query is the saved one, so nothing differs that saving would keep.
  expect(savableQuery(videoReview, { ...query, objectFilter: two }).objectFilter).toBe(
    videoReview.view.objectFilter,
  );
  expect(queryDiffers(videoReview, { ...query, objectFilter: two })).toBe(true);
  expect(queryDiffers(videoReview, savableQuery(videoReview, { ...query, objectFilter: two }))).toBe(false);
  // Bins pressed on changed criteria: saving keeps the criteria, not the bins.
  const changed = { organized: true };
  expect(
    savableQuery(videoReview, { ...query, objectFilter: binned(changed, 5) }).objectFilter,
  ).toEqual(changed);
  const live = { ...videoReview, view: { ...videoReview.view, objectFilter: binned(changed, 5) } };
  expect(withoutTagBins(live, videoReview).view.objectFilter).toEqual(changed);
  // Without bins, nothing changes.
  const plain = { ...query, objectFilter: changed };
  expect(savableQuery(videoReview, plain)).toBe(plain);
  expect(withoutTagBins(videoReview, videoReview)).toBe(videoReview);
  // A saved condition of a bin's shape is the review's own and stays.
  const savedBin = { ...videoReview, view: { ...videoReview.view, objectFilter: one } };
  expect(savableQuery(savedBin, { ...query, objectFilter: one }).objectFilter).toBe(one);
  // Only video reviews have bins.
  const occurrenceQuery = { ...defaultQuery(review), objectFilter: binned(review.view.objectFilter, 5) };
  expect(savableQuery(review, occurrenceQuery)).toBe(occurrenceQuery);
});
