import { beforeEach, expect, it, vi } from "vitest";
import { extensionFetch } from "@cove/runtime/api";
import {
  planTags,
  previewOccurrenceBatch,
  runOccurrenceBatch,
  undoOccurrenceBatch,
} from "../batchOccurrences";
import type { OccurrenceReview, MediaReviewAction } from "../model";
import type { OccurrenceApplication } from "../occurrences";
const fetch = vi.mocked(extensionFetch);
const action: MediaReviewAction = {
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
let trees: Record<number, number[]>;
let names: Record<number, string>;
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
  trees = {};
  names = {};
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
    if (url.pathname === "/api/tags/find") {
      const tree = trees[body.objectFilter?.parentsCriterion?.value?.[0]];
      return tree
        ? response({ items: tree.map((id) => ({ id })), totalCount: tree.length })
        : response({ items: [{ id: 22 }, { id: 23 }], totalCount: 2 });
    }
    if (url.pathname.startsWith("/api/tags/")) {
      const id = Number(url.pathname.split("/").pop());
      return response({ id, name: names[id] ?? "Group" });
    }
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
const preview = (review = rule, selected: MediaReviewAction | MediaReviewAction[] = action) =>
  previewOccurrenceBatch(
    review,
    Array.isArray(selected) ? selected : [selected],
    new AbortController().signal,
  );
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
  expect(
    planTags(batch.entries[0].before.ids, batch.action, batch.categories, true).desired,
  ).toEqual([21]);
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

it("keeps each answer's own tags out of its tree removal, whatever the step order", async () => {
  fixtures(2);
  add(1, 11, 23);
  add(2, 11, 21);
  trees[20] = [21, 22, 23];
  const onlyOne = (id: string, tag: number): MediaReviewAction => ({
    id,
    label: `Only ${tag}`,
    steps: [
      { mode: "ADD", tagIds: [tag] },
      { mode: "REMOVE_TREE", tagIds: [20] },
    ],
  });
  const batch = await preview(rule, onlyOne("21", 21));
  expect(batch.action.steps).toEqual([
    { mode: "ADD", tagIds: [21] },
    { mode: "REMOVE", tagIds: [20, 22, 23] },
  ]);
  expect(batch.entries.map((entry) => [entry.conflict, entry.status])).toEqual([
    [true, "pending"],
    [false, "unchanged"],
  ]);
  const reversed = await preview(rule, {
    ...onlyOne("21", 21),
    steps: [
      { mode: "REMOVE_TREE", tagIds: [20] },
      { mode: "ADD", tagIds: [21] },
    ],
  });
  expect(reversed.action.steps).toEqual([
    { mode: "REMOVE", tagIds: [20, 22, 23] },
    { mode: "ADD", tagIds: [21] },
  ]);
  expect(
    reversed.entries.map((entry) => planTags(entry.before.ids, reversed.action, [], true).desired),
  ).toEqual([[21], [21]]);
  await run(batch, true);
  expect(ids(1)).toEqual([21]);
  expect(ids(2)).toEqual([21]);
  // Every answer spares only its own tags, so the later of two answers from one tree wins.
  const both = await preview(rule, [onlyOne("21", 21), onlyOne("22", 22)]);
  expect(
    planTags([21], both.action, both.categories, true).desired,
  ).toEqual([22]);
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
    previewOccurrenceBatch(rule, [action], controller.signal),
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

it("enumerates occurrences matching a condition subtree when subtags are included", async () => {
  add(1, 11, 23);
  add(2, 11, 24);
  const batch = await preview({
    ...rule,
    occurrence: {
      ...rule.occurrence,
      condition: "includes",
      conditionTagIds: [22],
      includeSubtags: true,
    },
  });
  expect(batch.entries.map((entry) => entry.item.key)).toEqual(["1:11"]);
  expect(JSON.stringify(queries[0])).toContain('"depth":-1');
  const exact = await preview({
    ...rule,
    occurrence: {
      ...rule.occurrence,
      condition: "includes",
      conditionTagIds: [22],
      includeSubtags: false,
    },
  });
  expect(exact.entries).toEqual([]);
  expect(JSON.stringify(queries.at(-1))).toContain('"depth":0');
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
      [{ ...action, steps: [{ mode: "REMOVE_TREE", tagIds: [20] }] }],
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

const small: MediaReviewAction = { id: "small", label: "Small", steps: [{ mode: "ADD", tagIds: [31] }] };
const medium: MediaReviewAction = { id: "medium", label: "Medium", steps: [{ mode: "ADD", tagIds: [32] }] };
const natural: MediaReviewAction = { id: "natural", label: "Natural", steps: [{ mode: "ADD", tagIds: [41] }] };
const categorized: OccurrenceReview = {
  ...rule,
  actions: [small, medium, natural],
  occurrence: {
    ...rule.occurrence,
    condition: "excludesAll",
    conditionTagIds: [30, 40],
    includeSubtags: true,
  },
};

it("applies several answers in one pass and fills only the condition categories that are still empty", async () => {
  trees = { 30: [31, 32], 40: [41, 42] };
  fixtures(4);
  add(2, 11, 41);
  add(3, 11, 31);
  add(4, 11, 42);
  const batch = await preview(categorized, [medium, natural]);
  expect(batch.actions.map((selected) => selected.id)).toEqual(["medium", "natural"]);
  expect(batch.action.steps).toEqual([...medium.steps, ...natural.steps]);
  expect(batch.categories).toEqual([
    [30, 31, 32],
    [40, 41, 42],
  ]);
  expect(batch.entries.map((entry) => entry.status)).toEqual([
    "pending",
    "pending",
    "pending",
    "pending",
  ]);
  await run(batch);
  expect([ids(1), ids(2), ids(3), ids(4)]).toEqual([
    [32, 41],
    [32, 41],
    [31, 41],
    [32, 42],
  ]);
  expect(batch.entries.every((entry) => entry.status === "changed")).toBe(true);
  await undoOccurrenceBatch(batch, () => false, () => {});
  expect([ids(1), ids(2), ids(3), ids(4)]).toEqual([[], [41], [31], [42]]);
});

it("replaces a different existing category answer only when conflicts are replaced", async () => {
  trees = { 30: [31, 32], 40: [41, 42] };
  add(1, 11, 31);
  await run(await preview(categorized, [medium, natural]), true);
  expect(ids(1)).toEqual([32, 41]);
});

it("skips without writing when every category it would fill already has a different answer", async () => {
  trees = { 30: [31, 32], 40: [41, 42], 50: [51] };
  add(1, 11, 31);
  add(1, 11, 42);
  // Still missing the third category, so the occurrence is in the queue.
  const batch = await preview(
    { ...categorized, occurrence: { ...categorized.occurrence, conditionTagIds: [30, 40, 50] } },
    [medium, natural],
  );
  expect(batch.entries[0].status).toBe("pending");
  await run(batch);
  expect(batch.entries[0].status).toBe("skipped");
  expect(batch.entries[0].error).toContain("existing answer");
  expect(writes).toEqual([]);
  expect(ids(1)).toEqual([31, 42]);
});

it("refuses two answers for the same condition category before any write", async () => {
  trees = { 30: [31, 32], 40: [41, 42] };
  names = { 30: "Size" };
  await expect(preview(categorized, [small, medium])).rejects.toThrow(
    "Small and Medium answer the same condition tag, Size. Choose one of them.",
  );
  await expect(preview(categorized, [])).rejects.toThrow(
    "Choose a configured occurrence tag action.",
  );
  expect(writes).toEqual([]);
});

it("plans category answers without changing explicit removals or unrelated tags", () => {
  const categories = [[30, 31, 32]];
  const answer: MediaReviewAction = { id: "a", label: "A", steps: [{ mode: "ADD", tagIds: [32, 50] }] };
  expect(planTags([31], answer, categories, false)).toEqual({
    desired: [31, 50],
    conflict: false,
    skipped: false,
    kept: [{ tagIds: [32], existing: [31] }],
    replaced: [],
  });
  expect(planTags([31], answer, categories, true)).toEqual({
    desired: [32, 50],
    conflict: false,
    skipped: false,
    kept: [],
    replaced: [31],
  });
  expect(planTags([32], answer, categories, false).desired).toEqual([32, 50]);
  expect(planTags([], answer, [], false).desired).toEqual([32, 50]);
  const replaceTree: MediaReviewAction = {
    id: "b",
    label: "B",
    steps: [
      { mode: "REMOVE", tagIds: [30, 31, 32] },
      { mode: "ADD", tagIds: [32] },
    ],
  };
  expect(planTags([31], replaceTree, categories, false)).toEqual({
    desired: [31],
    conflict: true,
    skipped: true,
    kept: [],
    replaced: [],
  });
  expect(planTags([31], replaceTree, categories, true)).toEqual({
    desired: [32],
    conflict: true,
    skipped: false,
    kept: [],
    replaced: [],
  });
});

it("completes a partly written category replacement on retry", async () => {
  trees = { 30: [31, 32], 40: [41, 42] };
  add(1, 11, 31);
  const batch = await preview(categorized, [medium]);
  failDelete = true;
  await run(batch, true);
  expect(ids(1)).toEqual([31, 32]);
  expect(batch.entries[0].status).toBe("failed");
  failDelete = false;
  await run(batch, true, true);
  expect(ids(1)).toEqual([32]);
  expect(batch.entries[0].status).toBe("changed");
  await undoOccurrenceBatch(batch, () => false, () => {});
  expect(ids(1)).toEqual([31]);
});

it("never treats an answer's own tag as a different answer", () => {
  const categories = [[30, 31, 32, 33]];
  const pair: MediaReviewAction = { id: "a", label: "A", steps: [{ mode: "ADD", tagIds: [32, 33] }] };
  expect(planTags([32], pair, categories, true).desired.sort()).toEqual([32, 33]);
  expect(planTags([32], pair, categories, false)).toMatchObject({ desired: [32, 33], kept: [] });
  const present: MediaReviewAction = { id: "b", label: "B", steps: [{ mode: "ADD", tagIds: [31] }] };
  expect(planTags([31, 32], present, categories, true).desired.sort()).toEqual([31, 32]);
});

it("fills categories only for conditions that look for missing tags with subtags", async () => {
  trees = { 30: [31, 32], 40: [41, 42] };
  add(1, 11, 31);
  const including = await preview(
    { ...categorized, occurrence: { ...categorized.occurrence, condition: "includes" } },
    [medium],
  );
  expect(including.categories).toEqual([]);
  await run(including);
  expect(ids(1)).toEqual([31, 32]);
  const exact = await preview(
    {
      ...categorized,
      occurrence: { ...categorized.occurrence, includeSubtags: false, conditionTagIds: [40] },
    },
    [medium],
  );
  expect(exact.categories).toEqual([]);
});

it("reports a retried occurrence as changed when the failed attempt had fully landed", async () => {
  const batch = await preview();
  const original = fetch.getMockImplementation()!;
  let failConfirm = true;
  fetch.mockImplementation((path, init) => {
    const url = new URL(String(path), "http://test");
    // The write lands, but the read confirming it inside the save fails once.
    if (
      failConfirm &&
      url.pathname === "/api/tagapplications" &&
      !init?.method &&
      url.searchParams.has("contextId") &&
      writes.length
    ) {
      failConfirm = false;
      return response({ message: "Read failed" }, 500);
    }
    return original(path, init);
  });
  await run(batch);
  expect(batch.entries[0].status).toBe("failed");
  expect(batch.entries[0].operation?.tags.added).toEqual([21]);
  await run(batch, false, true);
  expect(ids(1)).toEqual([21]);
  expect(batch.entries[0].status).toBe("changed");
});
