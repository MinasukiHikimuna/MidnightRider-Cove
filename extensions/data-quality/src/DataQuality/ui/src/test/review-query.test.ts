import { expect, it } from "vitest";
import {
  defaultQuery,
  readQuery,
  writeQuery,
  effectiveReview,
} from "../reviewQuery";
import type { OccurrenceReview } from "../model";
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
  expect(effective.view.objectFilter).toEqual({ organized: false });
});
it("rejects malformed criteria instead of silently restoring hidden defaults", () => {
  expect(() => readQuery(review, new URLSearchParams("filters=[]"))).toThrow();
  expect(() =>
    readQuery(
      review,
      new URLSearchParams('performerScope={"targetMode":"invalid"}'),
    ),
  ).toThrow();
});
