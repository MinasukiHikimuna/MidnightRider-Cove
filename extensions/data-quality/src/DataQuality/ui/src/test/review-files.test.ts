import { expect, it } from "vitest";
import { readReviewFile, reviewFileName } from "../reviewFiles";

it("names a review's file after the review, in plain ASCII", () => {
  expect(reviewFileName({ name: "Hair colour" })).toBe("data-quality-review-hair-colour.json");
  expect(reviewFileName({ name: "  Väri & sävy (2) " })).toBe(
    "data-quality-review-vari-savy-2.json",
  );
  expect(reviewFileName({ name: "—" })).toBe("data-quality-review.json");
  expect(reviewFileName({ name: "a".repeat(90) })).toBe(
    `data-quality-review-${"a".repeat(60)}.json`,
  );
});

it("reads a review file with the stored reviews' validation, refusing large files unread", async () => {
  const review = {
    id: "one",
    name: "One",
    description: "",
    view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
    actions: [],
  };
  const file = (contents: string) => new File([contents], "reviews.json");
  await expect(readReviewFile(file(JSON.stringify([review])))).resolves.toEqual([review]);
  // The reasons speak of the file, not of stored data.
  await expect(readReviewFile(file("{"))).rejects.toThrow("It is not a JSON file.");
  for (const contents of [[{ id: "one" }], [review, review], { reviews: [review] }])
    await expect(readReviewFile(file(JSON.stringify(contents)))).rejects.toThrow(
      "It does not hold valid Data Quality reviews.",
    );
  const large = file("[]");
  let read = false;
  Object.defineProperty(large, "size", { value: 2_000_001 });
  Object.defineProperty(large, "text", { value: async () => ((read = true), "[]") });
  await expect(readReviewFile(large)).rejects.toThrow("Review files must be smaller than 2 MB.");
  expect(read).toBe(false);
});

it("keeps each action's key choice through a review file", async () => {
  const review = {
    id: "keys",
    name: "Keys",
    description: "",
    view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
    // Pinned, no key, Auto, a digit from an older version (Auto), and a key pinned twice.
    actions: ["s", "none", undefined, "3", "s"].map((shortcut, index) => ({
      id: `action-${index}`,
      label: `Action ${index + 1}`,
      steps: [],
      ...(shortcut === undefined ? {} : { shortcut }),
    })),
  };
  const read = await readReviewFile(new File([JSON.stringify([review], null, 2)], "keys.json"));
  expect(read).toEqual([review]);
});
