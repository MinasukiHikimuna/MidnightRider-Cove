import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { TagInfo } from "../api";
import { cachedTags, loadTags, rememberTags, useTagNames, useTags } from "../tagNames";

const api = vi.hoisted(() => ({ request: vi.fn() }));
vi.mock("../api", async (original) => ({
  ...(await original<typeof import("../api")>()),
  request: api.request,
}));

beforeEach(() => {
  api.request.mockReset();
});
afterEach(() => {
  vi.useRealTimers();
});

/** The names of loaded tags, null for tags that cannot be read. */
function names(tags: Record<number, TagInfo | null>) {
  return Object.fromEntries(Object.entries(tags).map(([id, tag]) => [id, tag?.name ?? null]));
}
const loadTagNames = (ids: number[], signal?: AbortSignal) => loadTags(ids, signal).then(names);

function abortable(signals: AbortSignal[]) {
  return (_path: string, init: RequestInit) => {
    signals.push(init.signal!);
    return new Promise((_, reject) =>
      init.signal!.addEventListener("abort", () =>
        reject(new DOMException("Aborted", "AbortError")),
      ),
    );
  };
}

it("requests each distinct tag once, sharing requests in flight", async () => {
  const pending = new Map<string, (value: unknown) => void>();
  api.request.mockImplementation(
    (path: string) => new Promise((resolve) => pending.set(path, resolve)),
  );
  const first = loadTagNames([1, 2, 2]);
  const second = loadTagNames([2, 3]);
  expect(api.request.mock.calls.map(([path]) => path)).toEqual([
    "/api/tags/1",
    "/api/tags/2",
    "/api/tags/3",
  ]);
  pending.get("/api/tags/1")!({ name: "One" });
  pending.get("/api/tags/2")!({ name: " Two " });
  pending.get("/api/tags/3")!({ name: "Three" });
  await expect(first).resolves.toEqual({ 1: "One", 2: "Two" });
  await expect(second).resolves.toEqual({ 2: "Two", 3: "Three" });
  // Later readers use the names already read.
  await expect(loadTagNames([3, 1])).resolves.toEqual({ 1: "One", 3: "Three" });
  expect(api.request).toHaveBeenCalledTimes(3);
  expect(names(cachedTags([1, 2, 4]))).toEqual({ 1: "One", 2: "Two" });
});

it("lets one reader abort without cancelling a request another still waits for", async () => {
  const signals: AbortSignal[] = [];
  let resolveTag!: (value: unknown) => void;
  api.request.mockImplementation((_path: string, init: RequestInit) => {
    signals.push(init.signal!);
    return new Promise((resolve) => {
      resolveTag = resolve;
    });
  });
  const leaving = new AbortController();
  const left = loadTagNames([5], leaving.signal);
  const staying = loadTagNames([5]);
  leaving.abort();
  await expect(left).rejects.toMatchObject({ name: "AbortError" });
  expect(signals).toHaveLength(1);
  expect(signals[0].aborted).toBe(false);
  resolveTag({ name: "Five" });
  await expect(staying).resolves.toEqual({ 5: "Five" });
});

it("cancels the request once its last reader aborts, and asks again later", async () => {
  const signals: AbortSignal[] = [];
  api.request.mockImplementation(abortable(signals));
  const controller = new AbortController();
  const reading = loadTagNames([6], controller.signal);
  controller.abort();
  await expect(reading).rejects.toMatchObject({ name: "AbortError" });
  expect(signals[0].aborted).toBe(true);
  api.request.mockResolvedValue({ name: "Six" });
  await expect(loadTagNames([6])).resolves.toEqual({ 6: "Six" });
  expect(api.request).toHaveBeenCalledTimes(2);
});

it("resolves an unreadable tag to null without remembering the failure", async () => {
  api.request
    .mockRejectedValueOnce(new Error("Not found"))
    .mockResolvedValueOnce({ name: "Seven" });
  await expect(loadTagNames([7])).resolves.toEqual({ 7: null });
  await expect(loadTagNames([7])).resolves.toEqual({ 7: "Seven" });
});

it("reads a name again once it has gone stale", async () => {
  vi.useFakeTimers({ now: new Date("2026-01-01T10:00:00Z"), toFake: ["Date"] });
  api.request.mockResolvedValue({ name: "Nine" });
  await loadTagNames([9]);
  vi.setSystemTime(new Date("2026-01-01T10:05:00Z"));
  await loadTagNames([9]);
  expect(api.request).toHaveBeenCalledTimes(1);
  vi.setSystemTime(new Date("2026-01-01T10:11:00Z"));
  await loadTagNames([9]);
  expect(api.request).toHaveBeenCalledTimes(2);
});

it("gives components the shared names, from the cache once read", async () => {
  api.request.mockResolvedValue({ name: "Eight" });
  const first = renderHook(({ ids }) => useTagNames(ids), {
    initialProps: { ids: [8, 8] },
  });
  expect(first.result.current).toEqual({});
  await waitFor(() => expect(first.result.current).toEqual({ 8: "Eight" }));
  first.unmount();
  const second = renderHook(() => useTagNames([8]));
  expect(second.result.current).toEqual({ 8: "Eight" });
  expect(api.request).toHaveBeenCalledTimes(1);
});

it("keeps each tag's badge data and display keys, from Cove's tag or from an item", async () => {
  api.request.mockResolvedValue({
    id: 21,
    name: "Read",
    sortName: "Sorted",
    color: "#123456",
    tagGroupId: 4,
    tagGroupName: "Group",
    tagGroupColor: "#654321",
    description: "Not kept",
  });
  await expect(loadTags([21])).resolves.toEqual({
    21: {
      id: 21,
      name: "Read",
      sortName: "Sorted",
      color: "#123456",
      tagGroupId: 4,
      tagGroupName: "Group",
      tagGroupColor: "#654321",
      tagGroupSortOrder: undefined,
      imagePath: undefined,
      hasImage: undefined,
    },
  });
  // Tags an item carries are remembered as they are, so they are not asked for again.
  rememberTags([
    { id: 22, name: "From an item", tagGroupId: 4, tagGroupSortOrder: 2, hasImage: true },
    { id: 23, name: "  " },
  ]);
  expect(cachedTags([22, 23])).toEqual({
    22: expect.objectContaining({ id: 22, name: "From an item", tagGroupSortOrder: 2, hasImage: true }),
  });
  const hook = renderHook(() => useTags([22]));
  expect(hook.result.current[22]).toMatchObject({ name: "From an item" });
  expect(names(cachedTags([22]))).toEqual({ 22: "From an item" });
  expect(api.request).toHaveBeenCalledTimes(1);
});

it("keeps what an item told about a tag when Cove's tag endpoint reads it again", async () => {
  // The item arrives while the tag's own read is on its way; the read lacks the group's order.
  let resolveTag!: (value: unknown) => void;
  api.request.mockImplementation(() => new Promise((resolve) => (resolveTag = resolve)));
  const reading = loadTags([31]);
  rememberTags([{ id: 31, name: "Tag", tagGroupId: 5, tagGroupSortOrder: 3, hasImage: true }]);
  resolveTag({ id: 31, name: "Tag", tagGroupId: 5, tagGroupName: "Group" });
  await expect(reading).resolves.toMatchObject({
    31: { tagGroupSortOrder: 3, hasImage: true, tagGroupName: "Group" },
  });
  expect(cachedTags([31])[31]).toMatchObject({ tagGroupSortOrder: 3, hasImage: true });
});

it("gives a tag read from Cove's tag endpoint the display order its group has on items", async () => {
  rememberTags([{ id: 41, name: "On an item", tagGroupId: 6, tagGroupSortOrder: 1 }]);
  api.request.mockResolvedValue({ id: 42, name: "Read", tagGroupId: 6 });
  await expect(loadTags([42])).resolves.toMatchObject({ 42: { tagGroupSortOrder: 1 } });
  // A tag that moved to another group does not keep the old group's order.
  rememberTags([{ id: 43, name: "Moved", tagGroupId: 7, tagGroupSortOrder: 9 }]);
  vi.useFakeTimers({ now: Date.now() + 11 * 60 * 1000, toFake: ["Date"] });
  api.request.mockResolvedValue({ id: 43, name: "Moved", tagGroupId: 8 });
  await expect(loadTags([43])).resolves.toMatchObject({ 43: { tagGroupId: 8, tagGroupSortOrder: undefined } });
});
