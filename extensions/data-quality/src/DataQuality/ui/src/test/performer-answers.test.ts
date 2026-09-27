import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import { loadPerformerAnswers } from "../performerAnswers";
import type { OccurrenceReview } from "../model";

const fetchMock = vi.mocked(extensionFetch);
const review: OccurrenceReview = {
  id: "answers",
  name: "Answers",
  description: "",
  entityType: "performerOccurrence",
  actions: [
    { id: "medium", label: "Medium", steps: [{ mode: "ADD", tagIds: [32] }] },
    { id: "perky", label: "Perky", steps: [{ mode: "ADD", tagIds: [50] }] },
  ],
  view: { filter: {}, objectFilter: {}, displayMode: "grid", searchMode: "text" },
  occurrence: {
    targetMode: "all",
    performerIds: [],
    performerFilter: {},
    condition: "excludesAll",
    conditionTagIds: [30, 40],
    includeSubtags: true,
    tagIds: [],
    multiple: true,
  },
};
const application = (hostId: number, contextId: number, tag: number) => ({
  id: hostId * 100 + tag,
  hostType: "video",
  hostId,
  contextType: "performer",
  contextId,
  tag: { id: tag, name: `Tag ${tag}` },
});
const response = (body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
let requested: string[];
beforeEach(() => {
  fetchMock.mockReset();
  requested = [];
  fetchMock.mockImplementation((path, init) => {
    requested.push(String(path));
    const url = new URL(String(path), "http://test");
    if (url.pathname === "/api/tagapplications")
      return response([
        application(1, 11, 32),
        application(1, 11, 41),
        application(2, 11, 32),
        application(2, 11, 42),
        application(3, 11, 50),
        application(4, 11, 99),
        application(5, 12, 31),
      ]);
    if (url.pathname === "/api/tags/find") {
      const root = JSON.parse(String(init!.body)).objectFilter.parentsCriterion.value[0];
      const tree = root === 30 ? [31, 32] : [41, 42];
      return response({ items: tree.map((id) => ({ id })), totalCount: tree.length });
    }
    if (url.pathname.startsWith("/api/tags/")) {
      const id = Number(url.pathname.split("/").pop());
      return response({ id, name: id === 30 ? "Size" : "Augmentation" });
    }
    throw new Error(`Unexpected request ${path}`);
  });
});

it("summarizes one performer's answers per condition category, most used first", async () => {
  expect(await loadPerformerAnswers(review, 11, new AbortController().signal)).toEqual({
    answered: 3,
    groups: [
      { id: 30, name: "Size", tags: [{ id: 32, name: "Tag 32", count: 2 }] },
      {
        id: 40,
        name: "Augmentation",
        tags: [
          { id: 41, name: "Tag 41", count: 1 },
          { id: 42, name: "Tag 42", count: 1 },
        ],
      },
      { id: null, name: "Other review tags", tags: [{ id: 50, name: "Tag 50", count: 1 }] },
    ],
  });
  expect(requested[0]).toBe(
    "/api/tagapplications?hostType=video&contextType=performer&contextId=11",
  );
});

it("lists only the review's action tags when the condition has no categories", async () => {
  const summary = await loadPerformerAnswers(
    { ...review, occurrence: { ...review.occurrence, condition: "any", conditionTagIds: [] } },
    11,
    new AbortController().signal,
  );
  expect(summary).toEqual({
    answered: 3,
    groups: [
      {
        id: null,
        name: "Review tags",
        tags: [
          { id: 32, name: "Tag 32", count: 2 },
          { id: 50, name: "Tag 50", count: 1 },
        ],
      },
    ],
  });
});

it("counts a legacy review's tag choices as the answers to summarize", async () => {
  const summary = await loadPerformerAnswers(
    {
      ...review,
      actions: [],
      occurrence: { ...review.occurrence, condition: "any", conditionTagIds: [], tagIds: [41, 42] },
    },
    11,
    new AbortController().signal,
  );
  expect(summary).toEqual({
    answered: 2,
    groups: [
      {
        id: null,
        name: "Review tags",
        tags: [
          { id: 41, name: "Tag 41", count: 1 },
          { id: 42, name: "Tag 42", count: 1 },
        ],
      },
    ],
  });
});
