import { expect, it } from "vitest";
import { sortReviews } from "../ReviewList";
import type { Review } from "../model";

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
