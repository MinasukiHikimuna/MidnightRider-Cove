import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  countPerformer,
  extendRanking,
  rankingSignature,
  recountRanked,
} from "../performerRanking";
import type { OccurrenceReview } from "../model";

const fetchMock = vi.mocked(extensionFetch);
const review: OccurrenceReview = {
  id: "ranking",
  name: "Ranking",
  description: "",
  entityType: "performerOccurrence",
  actions: [],
  view: {
    filter: { page: 3, perPage: 40, sort: "date", direction: "desc", q: "" },
    objectFilter: { studioId: 9 },
    displayMode: "grid",
    searchMode: "text",
  },
  occurrence: {
    targetMode: "filter",
    performerIds: [],
    performerFilter: { gender: "FEMALE" },
    condition: "excludesAll",
    conditionTagIds: [30, 40],
    includeSubtags: true,
    flagPerformerTagIds: [7],
    tagIds: [],
    multiple: true,
  },
};
// Totals descend; counts do not follow them, so only the totals can bound what is left.
const basePerformers = [
  { id: 1, name: "A", videoCount: 100, audioCount: 1, count: 5 },
  { id: 2, name: "B", videoCount: 90, audioCount: 2, count: 90 },
  { id: 3, name: "C", videoCount: 80, audioCount: 3, count: 60 },
  { id: 4, name: "D", videoCount: 50, audioCount: 4, count: 50 },
  { id: 5, name: "E", videoCount: 40, audioCount: 5, count: 40 },
  { id: 6, name: "F", videoCount: 30, audioCount: 6, count: 30 },
  { id: 7, name: "G", videoCount: 20, audioCount: 7, count: 0 },
  { id: 8, name: "H", videoCount: 0, audioCount: 0, count: 0 },
];
const performers = basePerformers.map((performer) => ({ ...performer }));
let counts: Record<number, number>;
let aggregates: Array<{ path: string; body: any }>;
let finds: any[];
const response = (body: unknown) =>
  Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));
const dto = (performer: (typeof performers)[number]) => ({
  id: performer.id,
  name: performer.name,
  videoCount: performer.videoCount,
  audioCount: performer.audioCount,
  tags: performer.id === 4 ? [{ id: 7, name: "Changed" }, { id: 8, name: "Other" }] : [],
});
const counted = (body: any) =>
  JSON.stringify(body).match(/"performerIdsCriterion":\{"modifier":"includes","value":\[(\d+)\]/)![1];
beforeEach(() => {
  fetchMock.mockReset();
  performers.splice(0, performers.length, ...basePerformers.map((performer) => ({ ...performer })));
  counts = Object.fromEntries(performers.map((p) => [p.id, p.count]));
  aggregates = [];
  finds = [];
  fetchMock.mockImplementation((path, init) => {
    const url = new URL(String(path), "http://test");
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (url.pathname === "/api/performers/find") {
      finds.push(body);
      const { page, perPage } = body.findFilter;
      // The server orders by its own link count, which a restricted reader's totals need not follow.
      const ordered = [...performers].reverse();
      return response({
        items: ordered.slice((page - 1) * perPage, page * perPage).map(dto),
        totalCount: performers.length,
      });
    }
    if (url.pathname.startsWith("/api/performers/")) {
      const performer = performers.find(
        (p) => p.id === Number(url.pathname.split("/").pop()),
      )!;
      return response(dto(performer));
    }
    if (url.pathname.endsWith("/aggregate")) {
      aggregates.push({ path: url.pathname, body });
      return response({ count: counts[Number(counted(body))], duration: 0, fileSize: 0 });
    }
    throw new Error(`Unexpected request ${path}`);
  });
});
const signal = () => new AbortController().signal;

it("ranks performers by matching videos and stops once no remaining total can reach the list", async () => {
  const ranking = await extendRanking(review, null, 3, signal(), { concurrency: 1 });
  expect(ranking.ranked.slice(0, ranking.limit).map((p) => [p.name, p.count])).toEqual([
    ["B", 90],
    ["C", 60],
    ["D", 50],
  ]);
  // After D, the third place holds 50 and E can reach at most 40.
  expect(aggregates.map((request) => counted(request.body))).toEqual(["1", "2", "3", "4"]);
  expect(ranking.complete).toBe(true);
  expect(finds[0]).toMatchObject({
    findFilter: { page: 1, sort: "video_count", direction: "desc" },
    objectFilter: { gender: "FEMALE" },
  });
});

it("asks each count with the queue's own scene filters and occurrence condition", async () => {
  await extendRanking(review, null, 1, signal(), { concurrency: 1 });
  const body = aggregates[0].body;
  expect(aggregates[0].path).toBe("/api/videos/aggregate");
  expect(body.findFilter).toMatchObject({ page: 1, perPage: 1 });
  expect(JSON.stringify(body.filterExpression)).toContain('"studioId":9');
  expect(JSON.stringify(body.filterExpression)).toContain(
    '"performerOccurrenceTagsCriterion":{"modifier":"excludesAll","value":[30,40],"depth":-1}',
  );
  expect(await countPerformer(review, 3, signal())).toBe(60);
});

it("extends the same ranking for more places and keeps its exact order", async () => {
  const first = await extendRanking(review, null, 3, signal(), { concurrency: 1 });
  const more = await extendRanking(review, first, 5, signal(), { concurrency: 1 });
  expect(more.ranked.slice(0, more.limit).map((p) => p.name)).toEqual(["B", "C", "D", "E", "F"]);
  expect(finds).toHaveLength(1);
  expect(more.complete).toBe(true);
  // Everyone who could still have work was counted; the zero-total performer never was.
  expect(aggregates.map((request) => counted(request.body))).not.toContain("8");
});

it("flags performers that carry one of the review's flag tags", async () => {
  const ranking = await extendRanking(review, null, 3, signal(), { concurrency: 1 });
  expect(ranking.ranked.find((p) => p.name === "D")?.flags).toEqual(["Changed"]);
  expect(ranking.ranked.find((p) => p.name === "B")?.flags).toEqual([]);
});

it("recounts one performer after a write and resumes when the list shrinks", async () => {
  const ranking = await extendRanking(review, null, 3, signal(), { concurrency: 1 });
  const finished = recountRanked(ranking, 2, 0);
  expect(finished.ranked.map((p) => p.name)).toEqual(["C", "D", "A"]);
  expect(finished.complete).toBe(false);
  expect(recountRanked(finished, 6, 12)).toBe(finished);
  const resumed = await extendRanking(review, finished, 3, signal(), { concurrency: 1 });
  expect(resumed.ranked.slice(0, 3).map((p) => p.name)).toEqual(["C", "D", "E"]);
  expect(resumed.complete).toBe(true);
});

it("ranks only the performers a review selects, and audio reviews by audio totals", async () => {
  const selected = await extendRanking(
    { ...review, occurrence: { ...review.occurrence, targetMode: "selected", performerIds: [5, 3] } },
    null,
    50,
    signal(),
  );
  expect(finds).toEqual([]);
  expect(selected.ranked.map((p) => p.name)).toEqual(["C", "E"]);
  const audio = await extendRanking(
    { ...review, entityType: "audioPerformerOccurrence" },
    null,
    1,
    signal(),
    { concurrency: 1 },
  );
  expect(finds.at(-1).findFilter.sort).toBe("audio_count");
  expect(aggregates.at(-1)!.path).toBe("/api/audios/aggregate");
  expect(audio.ranked[0]).toMatchObject({ name: "F", total: 6 });
});

it("keys a ranking by the queue criteria, not by paging or sort", () => {
  const moved = { ...review, view: { ...review.view, filter: { ...review.view.filter, page: 9, sort: "title" } } };
  expect(rankingSignature(moved)).toBe(rankingSignature(review));
  const narrowed = { ...review, occurrence: { ...review.occurrence, conditionTagIds: [30] } };
  expect(rankingSignature(narrowed)).not.toBe(rankingSignature(review));
});

it("stops counting when cancelled", async () => {
  const controller = new AbortController();
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) => {
    if (String(path).endsWith("/aggregate")) controller.abort();
    return original(path, init);
  });
  await expect(
    extendRanking(review, null, 3, controller.signal, { concurrency: 1 }),
  ).rejects.toThrow();
  expect(aggregates).toHaveLength(1);
});

it("never continues a snapshot taken while counts were still in flight", async () => {
  let release!: () => void;
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) => {
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (String(path).endsWith("/aggregate") && counted(body) === "1" && !release)
      return new Promise((resolve, reject) => {
        init!.signal!.addEventListener("abort", () => reject(init!.signal!.reason), { once: true });
        release = () => resolve(new Response(JSON.stringify({ count: 99 }), { status: 200 }));
      });
    return original(path, init);
  });
  counts[1] = 99;
  const controller = new AbortController();
  const snapshots: Awaited<ReturnType<typeof extendRanking>>[] = [];
  const run = extendRanking(review, null, 1, controller.signal, {
    concurrency: 3,
    onProgress: (snapshot) => snapshots.push(snapshot),
  });
  await vi.waitFor(() => expect(snapshots.length).toBeGreaterThanOrEqual(2));
  controller.abort();
  await expect(run).rejects.toThrow();
  const partial = snapshots.at(-1)!;
  expect(partial).toMatchObject({ partial: true, complete: false });
  const resumed = await extendRanking(review, partial, 1, signal(), { concurrency: 1 });
  expect(resumed.ranked[0]).toMatchObject({ name: "A", count: 99 });
  expect(resumed.complete).toBe(true);
  expect(resumed.partial).toBeUndefined();
  expect(recountRanked(partial, 2, 1)).toBe(partial);
  release?.();
});

it("counts a performer who could still tie the last place", async () => {
  performers.splice(0, performers.length,
    { id: 1, name: "Zed", videoCount: 50, audioCount: 0, count: 50 },
    { id: 2, name: "Amy", videoCount: 50, audioCount: 0, count: 50 },
    { id: 3, name: "Bea", videoCount: 10, audioCount: 0, count: 10 },
  );
  counts = Object.fromEntries(performers.map((p) => [p.id, p.count]));
  const ranking = await extendRanking(review, null, 1, signal(), { concurrency: 1 });
  expect(ranking.ranked[0].name).toBe("Amy");
  expect(aggregates.map((request) => counted(request.body))).toEqual(["1", "2"]);
});

it("reuses the loaded performers when only the occurrence criteria change", async () => {
  const first = await extendRanking(review, null, 3, signal(), { concurrency: 1 });
  const narrowed = { ...review, occurrence: { ...review.occurrence, conditionTagIds: [30] } };
  const second = await extendRanking(narrowed, first, 3, signal(), { concurrency: 1 });
  expect(finds).toHaveLength(1);
  expect(second.signature).toBe(rankingSignature(narrowed));
  const women = { ...review, occurrence: { ...review.occurrence, performerFilter: { gender: "MALE" } } };
  await extendRanking(women, second, 3, signal(), { concurrency: 1 });
  expect(finds).toHaveLength(2);
});

it("skips a selected performer that no longer exists but reports other failures", async () => {
  const original = fetchMock.getMockImplementation()!;
  fetchMock.mockImplementation((path, init) => {
    if (String(path) === "/api/performers/98")
      return Promise.resolve(new Response(JSON.stringify({ message: "Not found" }), { status: 404 }));
    if (String(path) === "/api/performers/97")
      return Promise.resolve(new Response(JSON.stringify({ message: "Server busy" }), { status: 503 }));
    return original(path, init);
  });
  const selected = (performerIds: number[]) => ({
    ...review,
    occurrence: { ...review.occurrence, targetMode: "selected" as const, performerIds },
  });
  expect((await extendRanking(selected([5, 98]), null, 50, signal())).ranked.map((p) => p.name)).toEqual(["E"]);
  await expect(extendRanking(selected([5, 97]), null, 50, signal())).rejects.toThrow("Server busy");
});

it("ranks nobody when a condition needs tags and none are chosen", async () => {
  for (const condition of ["includes", "excludesAll"] as const) {
    const ranking = await extendRanking(
      { ...review, occurrence: { ...review.occurrence, condition, conditionTagIds: [] } },
      null,
      50,
      signal(),
    );
    expect(ranking).toMatchObject({ ranked: [], complete: true });
  }
  expect(finds).toEqual([]);
  expect(aggregates).toEqual([]);
});

it("finds the same first places when counting several performers at once", async () => {
  performers.splice(0, performers.length,
    ...Array.from({ length: 40 }, (_, index) => ({
      id: index + 1,
      name: `P${String(index + 1).padStart(2, "0")}`,
      videoCount: 400 - index * 7,
      audioCount: 0,
      count: (index * 37) % 101,
    })),
  );
  counts = Object.fromEntries(performers.map((p) => [p.id, p.count]));
  const expected = [...performers]
    .filter((p) => p.count > 0)
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 5)
    .map((p) => p.name);
  const ranking = await extendRanking(review, null, 5, signal(), { concurrency: 6 });
  expect(ranking.ranked.slice(0, 5).map((p) => p.name)).toEqual(expected);
  expect(ranking.complete).toBe(true);
});

it("lends no performers from a condition that could not match", async () => {
  const empty = await extendRanking(
    { ...review, occurrence: { ...review.occurrence, conditionTagIds: [] } },
    null,
    3,
    signal(),
  );
  expect(empty.candidatesKey).toBe("");
  const ranking = await extendRanking(review, empty, 3, signal(), { concurrency: 1 });
  expect(finds).toHaveLength(1);
  expect(ranking.ranked.slice(0, 3).map((p) => p.name)).toEqual(["B", "C", "D"]);
});
