import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  previewOccurrenceBatch,
  runOccurrenceBatch,
  undoOccurrenceBatch,
} from "../batchOccurrences";
import type { OccurrenceReview, VideoReviewAction } from "../model";
import type { OccurrenceApplication } from "../occurrences";
const fetch = vi.mocked(extensionFetch);
const action: VideoReviewAction = {
  id: "answer",
  label: "Answer",
  steps: [
    { mode: "REMOVE", tagIds: [22] },
    { mode: "ADD", tagIds: [21] },
  ],
};
const rule: OccurrenceReview = {
  id: "batch",
  name: "Batch",
  description: "",
  entityType: "performerOccurrence",
  actions: [action],
  view: {
    filter: {
      page: 3,
      perPage: 40,
      sort: "random",
      sorts: [{ field: "date" }],
    },
    objectFilter: { studio: "fixture" },
    displayMode: "grid",
    searchMode: "text",
  },
  occurrence: {
    targetMode: "selected",
    performerIds: [11],
    performerFilter: {},
    condition: "any",
    conditionTagIds: [],
    tagIds: [],
    multiple: true,
  },
};
let apps: OccurrenceApplication[];
let videos: Array<{
  id: number;
  title: string;
  files: [];
  updatedAt: string;
  performers: { id: number; name: string }[];
}>;
let nextId: number;
let failDelete: boolean;
let failReads: boolean;
let writes: string[];
let queries: Record<string, any>[];
function add(video: number, performer: number, tag: number) {
  apps.push({
    id: nextId++,
    hostType: "video",
    hostId: video,
    contextType: "performer",
    contextId: performer,
    tag: { id: tag, name: `Tag ${tag}` },
  });
}
const ids = (video: number, performer = 11) =>
  apps
    .filter((a) => a.hostId === video && a.contextId === performer)
    .map((a) => a.tag.id)
    .sort((a, b) => a - b);
function fixtures(count: number) {
  videos = Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    title: `Scene ${index + 1}`,
    files: [],
    updatedAt: "",
    performers: [
      { id: 11, name: "Target" },
      { id: 12, name: "Partner" },
    ],
  }));
}
const response = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status }));
beforeEach(() => {
  fetch.mockReset();
  apps = [];
  nextId = 1;
  failDelete = false;
  failReads = false;
  writes = [];
  queries = [];
  fixtures(1);
  fetch.mockImplementation((path, init) => {
    const url = new URL(String(path), "http://test");
    const body = init?.body ? JSON.parse(String(init.body)) : {};
    if (url.pathname === "/api/videos/find") {
      queries.push(body);
      // Model a shrinking queue after approvals, with filtering handled by the server.
      const eligible = videos.filter(
        (video) =>
          !body.filterExpression ||
          !JSON.stringify(body.filterExpression).includes('"excludes"') ||
          !ids(video.id).includes(21),
      );
      const { page, perPage } = body.findFilter;
      return response({
        items: eligible.slice((page - 1) * perPage, page * perPage),
        totalCount: eligible.length,
      });
    }
    if (url.pathname === "/api/performers/find")
      return response({ items: [{ id: 11 }], totalCount: 1 });
    if (url.pathname.startsWith("/api/videos/"))
      return response(
        videos.find((v) => v.id === Number(url.pathname.split("/").pop())),
      );
    if (url.pathname === "/api/tags/find")
      return response({ items: [{ id: 22 }, { id: 23 }], totalCount: 2 });
    if (url.pathname.startsWith("/api/tags/"))
      return response({ id: 20, name: "Group" });
    if (url.pathname.startsWith("/api/tagapplications")) {
      if (init?.method === "POST") {
        writes.push(`add:${body.hostId}:${body.contextId}:${body.tagId}`);
        add(body.hostId, body.contextId, body.tagId);
        return response({});
      }
      if (init?.method === "DELETE") {
        writes.push(`delete:${url.pathname}`);
        if (failDelete) return response({ message: "Delete failed" }, 500);
        apps = apps.filter(
          (a) => a.id !== Number(url.pathname.split("/").pop()),
        );
        return response({});
      }
      if (failReads) return response({ message: "Read failed" }, 500);
      return response(
        apps.filter(
          (a) =>
            a.hostId === Number(url.searchParams.get("hostId")) &&
            (!url.searchParams.has("contextId") ||
              a.contextId === Number(url.searchParams.get("contextId"))),
        ),
      );
    }
    throw new Error(`Unexpected request ${path}`);
  });
});
const preview = (review = rule, selected = action) =>
  previewOccurrenceBatch(review, selected, new AbortController().signal);
const run = (
  batch: Awaited<ReturnType<typeof preview>>,
  replace = false,
  retry = false,
) =>
  runOccurrenceBatch(
    batch,
    replace,
    () => false,
    () => {},
    retry,
  );

it("freezes 1300 matching pairs across pages before a shrinking-filter run and preserves partners", async () => {
  fixtures(1300);
  for (const video of videos) {
    add(video.id, 11, 99);
    add(video.id, 12, 22);
  }
  const batch = await preview({
    ...rule,
    occurrence: {
      ...rule.occurrence,
      condition: "excludes",
      conditionTagIds: [21],
    },
  });
  expect(batch.entries).toHaveLength(1300);
  expect(writes).toEqual([]);
  expect(queries).toHaveLength(6);
  expect(queries[0].findFilter).toMatchObject({
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
  });
  expect(queries[0].findFilter.sorts).toBeUndefined();
  expect(JSON.stringify(queries[0].filterExpression)).toContain(
    '"studio":"fixture"',
  );
  await run(batch);
  expect(batch.entries.every((e) => e.status === "changed")).toBe(true);
  expect(queries).toHaveLength(6);
  expect(ids(1)).toEqual([21, 99]);
  expect(ids(1300)).toEqual([21, 99]);
  expect(ids(1300, 12)).toEqual([22]);
  expect(writes).toHaveLength(1300);
}, 20000);

it("skips conflicts by default, replaces explicitly, and leaves already correct answers alone", async () => {
  fixtures(3);
  add(1, 11, 22);
  add(2, 11, 21);
  add(3, 11, 99);
  const first = await preview();
  await run(first);
  expect(first.entries.map((e) => e.status)).toEqual([
    "skipped",
    "unchanged",
    "changed",
  ]);
  expect(ids(1)).toEqual([22]);
  expect(writes).toHaveLength(1);
  const second = await preview();
  await run(second, true);
  expect(ids(1)).toEqual([21]);
  expect(ids(3)).toEqual([21, 99]);
});

it("resolves removal trees once and computes ordered net changes without false conflicts", async () => {
  add(1, 11, 21);
  add(1, 11, 23);
  const batch = await preview(rule, {
    ...action,
    steps: [
      { mode: "REMOVE_TREE", tagIds: [20] },
      { mode: "REMOVE", tagIds: [21] },
      { mode: "ADD", tagIds: [21] },
    ],
  });
  expect(batch.entries[0].conflict).toBe(true);
  expect(batch.entries[0].desired).toEqual([21]);
  await run(batch, true);
  expect(ids(1)).toEqual([21]);
  expect(
    fetch.mock.calls.filter(([path]) => path === "/api/tags/find"),
  ).toHaveLength(1);
  const noConflict = await preview(rule, {
    ...action,
    steps: [
      { mode: "REMOVE", tagIds: [21] },
      { mode: "ADD", tagIds: [21] },
    ],
  });
  expect(noConflict.entries[0].conflict).toBe(false);
  expect(noConflict.entries[0].status).toBe("unchanged");
});

it("skips affected concurrent edits and detects replaced application identities", async () => {
  add(1, 11, 22);
  const batch = await preview();
  apps = [];
  add(1, 11, 22);
  await run(batch, true);
  expect(batch.entries[0].status).toBe("skipped");
  expect(writes).toEqual([]);
});

it("retains partial changes, retries only failures, and undoes the combined operation", async () => {
  fixtures(2);
  add(1, 11, 22);
  add(1, 11, 99);
  const batch = await preview();
  failDelete = true;
  await run(batch, true);
  expect(batch.entries.map((e) => e.status)).toEqual(["failed", "changed"]);
  expect(ids(1)).toEqual([21, 22, 99]);
  expect(batch.entries[0].operation?.tags.added).toEqual([21]);
  failDelete = false;
  const previous = writes.length;
  await run(batch, true, true);
  expect(writes.slice(previous)).toHaveLength(1);
  expect(batch.entries.every((e) => e.status === "changed")).toBe(true);
  add(1, 11, 98);
  await undoOccurrenceBatch(
    batch,
    () => false,
    () => {},
  );
  expect(ids(1)).toEqual([22, 98, 99]);
  expect(ids(2)).toEqual([]);
  expect(batch.entries.every((e) => !e.operation)).toBe(true);
});

it("does not overwrite an undo conflict and permits retry after a partial undo", async () => {
  const batch = await preview();
  await run(batch);
  apps = [];
  add(1, 11, 21);
  await undoOccurrenceBatch(
    batch,
    () => false,
    () => {},
  );
  expect(batch.entries[0].error).toContain("Undo conflict");
  expect(ids(1)).toEqual([21]);
});

it("stops scheduling after cancellation and continues only remaining occurrences", async () => {
  fixtures(20);
  const batch = await preview();
  let cancelled = false;
  await runOccurrenceBatch(
    batch,
    false,
    () => cancelled,
    () => {
      cancelled = true;
    },
  );
  expect(batch.entries.filter((e) => e.status === "changed")).toHaveLength(5);
  expect(batch.entries.filter((e) => e.status === "pending")).toHaveLength(15);
  await run(batch);
  expect(writes).toHaveLength(20);
});

it("fails removed performer links without writes", async () => {
  const batch = await preview();
  videos[0].performers = [];
  await run(batch);
  expect(batch.entries[0].status).toBe("failed");
  expect(writes).toEqual([]);
});

it("handles empty matches and aborted previews without writes", async () => {
  fixtures(0);
  expect((await preview()).entries).toEqual([]);
  const controller = new AbortController();
  controller.abort();
  await expect(
    previewOccurrenceBatch(rule, action, controller.signal),
  ).rejects.toThrow();
  expect(writes).toEqual([]);
});

it("resolves performer criteria and preserves occurrence filtering", async () => {
  add(1, 11, 21);
  const batch = await preview({
    ...rule,
    occurrence: {
      ...rule.occurrence,
      targetMode: "filter",
      performerFilter: { gender: "fixture" },
      condition: "isNull",
    },
  });
  expect(batch.entries).toEqual([]);
  expect(
    fetch.mock.calls.some(([path]) => path === "/api/performers/find"),
  ).toBe(true);
});

it("undo preserves later changes to action tags that the batch itself did not change", async () => {
  add(1, 11, 21);
  const batch = await preview(rule, {
    ...action,
    steps: [{ mode: "ADD", tagIds: [21, 23] }],
  });
  await run(batch);
  apps = apps.filter((a) => a.tag.id !== 21);
  await undoOccurrenceBatch(
    batch,
    () => false,
    () => {},
  );
  expect(ids(1)).toEqual([]);
  expect(batch.entries[0].operation).toBeUndefined();
});

it("retains the remaining undo delta after an undo delete fails", async () => {
  add(1, 11, 22);
  const batch = await preview();
  await run(batch, true);
  failDelete = true;
  await undoOccurrenceBatch(
    batch,
    () => false,
    () => {},
  );
  expect(ids(1)).toEqual([21, 22]);
  expect(batch.entries[0].operation?.tags).toEqual({
    added: [21],
    removed: [],
  });
  failDelete = false;
  await undoOccurrenceBatch(
    batch,
    () => false,
    () => {},
  );
  expect(ids(1)).toEqual([22]);
  expect(batch.entries[0].operation).toBeUndefined();
});

it("blocks blind retries when the write outcome cannot be read", async () => {
  const batch = await preview();
  const original = fetch.getMockImplementation()!;
  fetch.mockImplementation((path, init) => {
    const response = original(path, init);
    if (String(path) === "/api/tagapplications" && init?.method === "POST")
      failReads = true;
    return response;
  });
  await run(batch);
  expect(batch.entries[0].unverified).toBe(true);
  expect(batch.entries[0].status).toBe("failed");
  failReads = false;
  const previous = writes.length;
  await run(batch, false, true);
  expect(writes).toHaveLength(previous);
  expect(batch.entries[0].error).toContain("fresh preview");
});

it("cancels removal-tree loading through the request abort signal", async () => {
  const controller = new AbortController();
  const original = fetch.getMockImplementation()!;
  fetch.mockImplementation((path, init) => {
    if (String(path) === "/api/tags/find") {
      expect(init?.signal).toBe(controller.signal);
      return new Promise((_, reject) => {
        init!.signal!.addEventListener(
          "abort",
          () => reject(new DOMException("Aborted", "AbortError")),
          { once: true },
        );
        controller.abort();
      });
    }
    return original(path, init);
  });
  await expect(
    previewOccurrenceBatch(
      rule,
      { ...action, steps: [{ mode: "REMOVE_TREE", tagIds: [20] }] },
      controller.signal,
    ),
  ).rejects.toThrow("Aborted");
  expect(writes).toEqual([]);
});

it("deduplicates repeated video-performer pairs during enumeration", async () => {
  const original = fetch.getMockImplementation()!;
  fetch.mockImplementation((path, init) =>
    String(path) === "/api/videos/find"
      ? response({ items: [videos[0], videos[0]], totalCount: 2 })
      : original(path, init),
  );
  const batch = await preview();
  expect(batch.entries).toHaveLength(1);
  await run(batch);
  expect(writes).toHaveLength(1);
});
