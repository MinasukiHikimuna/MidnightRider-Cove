import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import {
  cachedTagNames,
  loadTagNames,
  useTagNames,
} from "../tagNames";

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
  expect(cachedTagNames([1, 2, 4])).toEqual({ 1: "One", 2: "Two" });
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
