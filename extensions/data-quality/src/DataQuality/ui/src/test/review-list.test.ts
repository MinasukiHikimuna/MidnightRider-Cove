import { afterEach, expect, it, vi } from "vitest";
import { readListOrder, sortReviews, writeListOrder } from "../ReviewList";
import { copyName, duplicateReview, type Review } from "../model";

const LIST_ORDER_KEY = "data-quality.reviews-sort.v1";
afterEach(() => localStorage.removeItem(LIST_ORDER_KEY));

const review = (id: string, name: string) =>
  ({
    id,
    name,
    description: "",
    view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
    actions: [],
  }) as Review;
const reviews = [
  review("b", "Review 10"),
  review("a", "review 9"),
  review("c", "Counting"),
  review("d", "Failed"),
  review("e", "Also 10"),
];
const ids = (sorted: Review[]) => sorted.map((item) => item.id);

it("sorts reviews by name in natural, case-insensitive order either way", () => {
  expect(ids(sortReviews(reviews, {}, "name", "asc"))).toEqual(["e", "c", "d", "a", "b"]);
  expect(ids(sortReviews(reviews, {}, "name", "desc"))).toEqual(["b", "a", "d", "c", "e"]);
});

it("sorts by matching count with the reviews still counting or without a count last, ties by name", () => {
  const counts = { a: 5, b: 10, d: null, e: 10 };
  expect(ids(sortReviews(reviews, counts, "count", "asc"))).toEqual(["a", "e", "b", "c", "d"]);
  expect(ids(sortReviews(reviews, counts, "count", "desc"))).toEqual(["b", "e", "a", "d", "c"]);
  // The reviews passed in keep their order.
  expect(ids(reviews)).toEqual(["b", "a", "c", "d", "e"]);
});

it("remembers the list's sort in this browser under a versioned key", () => {
  expect(readListOrder()).toEqual({ sort: "name", direction: "asc" });
  writeListOrder({ sort: "count", direction: "desc" });
  expect(JSON.parse(localStorage.getItem(LIST_ORDER_KEY)!)).toEqual({
    sort: "count",
    direction: "desc",
  });
  expect(readListOrder()).toEqual({ sort: "count", direction: "desc" });
});

it("falls back to by name, ascending, for a stored sort it cannot read", () => {
  for (const stored of [
    "{broken",
    "null",
    '"count"',
    '{"sort":"size","direction":"asc"}',
    '{"sort":"count","direction":"up"}',
  ]) {
    localStorage.setItem(LIST_ORDER_KEY, stored);
    expect(readListOrder()).toEqual({ sort: "name", direction: "asc" });
  }
});

it("sorts as chosen without storage, which may refuse to be read or written", () => {
  vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
    throw new Error("Storage is disabled.");
  });
  vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    throw new Error("Storage is disabled.");
  });
  expect(readListOrder()).toEqual({ sort: "name", direction: "asc" });
  expect(() => writeListOrder({ sort: "count", direction: "asc" })).not.toThrow();
  vi.restoreAllMocks();
});

it("names a copy after its review, numbering it past the copies already there", () => {
  expect(copyName("Review 10", reviews)).toBe("Review 10 copy");
  const copies = [...reviews, review("f", "Review 10 copy"), review("g", " review 10 COPY 2 ")];
  expect(copyName("Review 10", copies)).toBe("Review 10 copy 3");
  // A copy of a copy is named after it in turn.
  expect(copyName("Review 10 copy", copies)).toBe("Review 10 copy copy");
});

it("duplicates a review under a new id and its copy's name, sharing nothing with it", () => {
  const source = { ...review("a", "review 9"), actions: [{ id: "x", label: "X", steps: [] }] } as Review;
  const copy = duplicateReview(source, reviews, "new-id");
  expect(copy).toEqual({ ...source, id: "new-id", name: "review 9 copy" });
  expect(copy.actions).not.toBe(source.actions);
  expect(copy.view).not.toBe(source.view);
});
