import { useEffect, useState } from "react";
import { request } from "./api";

/**
 * Tag names for action summaries, shared by every view of the page. Cove has no filter for a list
 * of tag ids, so names are read one tag at a time; this cache makes that one request per distinct
 * id: concurrent readers share the request in flight, and a name read once is reused until it
 * goes stale. A reader that aborts stops only its own wait; the request itself is cancelled once
 * no reader waits for it. A tag that cannot be read resolves to null and is asked for again later.
 */

/**
 * How long a later reader may reuse a name. A mounted reader keeps what it read until its tags
 * change or it mounts again, as the per-component requests did before; this only bounds how
 * stale a name can be when a new reader starts, for example when Find action opens.
 */
const NAME_TTL_MS = 10 * 60 * 1000;

const names = new Map<number, { name: string; at: number }>();

interface InFlight {
  promise: Promise<string | null>;
  controller: AbortController;
  waiters: number;
}
const inFlight = new Map<number, InFlight>();

function cachedName(id: number): string | undefined {
  const entry = names.get(id);
  if (!entry) return undefined;
  if (Date.now() - entry.at > NAME_TTL_MS) {
    names.delete(id);
    return undefined;
  }
  return entry.name;
}

function readName(id: number): InFlight {
  const existing = inFlight.get(id);
  if (existing) return existing;
  const controller = new AbortController();
  const entry: InFlight = {
    controller,
    waiters: 0,
    promise: request<{ name?: string }>(`/api/tags/${id}`, {
      signal: controller.signal,
    }).then(
      (tag) => {
        const name = tag?.name?.trim() || null;
        if (inFlight.get(id) === entry) inFlight.delete(id);
        if (name) names.set(id, { name, at: Date.now() });
        return name;
      },
      () => {
        if (inFlight.get(id) === entry) inFlight.delete(id);
        return null;
      },
    ),
  };
  inFlight.set(id, entry);
  return entry;
}

function abortError() {
  return new DOMException("The tag name request was aborted.", "AbortError");
}

/** Names already known, without asking Cove. Missing ids are unknown or stale. */
export function cachedTagNames(ids: Iterable<number>): Record<number, string> {
  const known: Record<number, string> = {};
  for (const id of ids) {
    const name = cachedName(id);
    if (name !== undefined) known[id] = name;
  }
  return known;
}

/**
 * Resolve the names of these tags, null for tags that cannot be read. Rejects with an AbortError
 * when the signal aborts first.
 */
export function loadTagNames(
  ids: Iterable<number>,
  signal?: AbortSignal,
): Promise<Record<number, string | null>> {
  if (signal?.aborted) return Promise.reject(abortError());
  const result: Record<number, string | null> = {};
  const waiting: Array<{ id: number; entry: InFlight }> = [];
  for (const id of new Set(ids)) {
    const name = cachedName(id);
    if (name !== undefined) result[id] = name;
    else {
      const entry = readName(id);
      entry.waiters += 1;
      waiting.push({ id, entry });
    }
  }
  if (!waiting.length) return Promise.resolve(result);
  return new Promise((resolve, reject) => {
    let done = false;
    const release = () => {
      for (const { id, entry } of waiting) {
        entry.waiters -= 1;
        if (entry.waiters === 0 && inFlight.get(id) === entry) {
          inFlight.delete(id);
          entry.controller.abort();
        }
      }
    };
    const abort = () => {
      if (done) return;
      done = true;
      release();
      reject(abortError());
    };
    signal?.addEventListener("abort", abort, { once: true });
    void Promise.all(
      waiting.map(({ id, entry }) =>
        entry.promise.then((name) => [id, name] as const),
      ),
    ).then((entries) => {
      if (done) return;
      done = true;
      signal?.removeEventListener("abort", abort);
      release();
      for (const [id, name] of entries) result[id] = name;
      resolve(result);
    });
  });
}

/**
 * Names for these tags, keyed by id: a string once read, null when the tag cannot be read, and
 * missing while it loads.
 */
export function useTagNames(ids: readonly number[]): Record<number, string | null> {
  const key = [...new Set(ids)].sort((left, right) => left - right).join(",");
  const [state, setState] = useState(() => ({
    key,
    names: cachedTagNames(parseKey(key)) as Record<number, string | null>,
  }));
  useEffect(() => {
    const wanted = parseKey(key);
    const known = cachedTagNames(wanted);
    setState({ key, names: known });
    if (wanted.every((id) => id in known)) return;
    const controller = new AbortController();
    loadTagNames(wanted, controller.signal).then(
      (loaded) => setState({ key, names: loaded }),
      () => {
        // Aborted: this reader moved on to other tags or unmounted.
      },
    );
    return () => controller.abort();
  }, [key]);
  return state.key === key ? state.names : cachedTagNames(parseKey(key));
}

function parseKey(key: string): number[] {
  return key ? key.split(",").map(Number) : [];
}

/** Forget every cached name; requests in flight still finish for their readers. */
export function clearTagNameCache() {
  names.clear();
}
