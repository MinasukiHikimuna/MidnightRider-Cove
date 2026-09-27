import { useEffect, useMemo, useState } from "react";
import { request, type TagInfo } from "./api";

/**
 * Tags for action summaries and tag badges, shared by every view of the page. Cove has no filter
 * for a list of tag ids, so tags are read one at a time; this cache makes that one request per
 * distinct id: concurrent readers share the request in flight, and a tag read once is reused
 * until it goes stale. A reader that aborts stops only its own wait; the request itself is
 * cancelled once no reader waits for it. A tag that cannot be read resolves to null and is asked
 * for again later. Tags an item already carries (with their colours and display order) are
 * remembered as they are read, so previews and summaries show them the same way.
 */

/**
 * How long a later reader may reuse a tag. A mounted reader keeps what it read until its tags
 * change or it mounts again, as the per-component requests did before; this only bounds how
 * stale a tag can be when a new reader starts, for example when Find action opens.
 */
const TAG_TTL_MS = 10 * 60 * 1000;

// Stale entries stay until replaced: a tag read again keeps what only an item told about it.
const tags = new Map<number, { tag: TagInfo; at: number }>();
/**
 * Each tag group's display order, as items report it with their tags; Cove's tag endpoint does
 * not send it, so a tag read there borrows it from here.
 */
const groupOrders = new Map<number, number>();

interface InFlight {
  promise: Promise<TagInfo | null>;
  controller: AbortController;
  waiters: number;
}
const inFlight = new Map<number, InFlight>();

function withGroupOrder(tag: TagInfo): TagInfo {
  if (tag.tagGroupId == null || tag.tagGroupSortOrder != null) return tag;
  const order = groupOrders.get(tag.tagGroupId);
  return order === undefined ? tag : { ...tag, tagGroupSortOrder: order };
}

function store(tag: TagInfo) {
  if (tag.tagGroupId != null && typeof tag.tagGroupSortOrder === "number")
    groupOrders.set(tag.tagGroupId, tag.tagGroupSortOrder);
  tags.set(tag.id, { tag, at: Date.now() });
}

function cachedTag(id: number): TagInfo | undefined {
  const entry = tags.get(id);
  if (!entry || Date.now() - entry.at > TAG_TTL_MS) return undefined;
  return withGroupOrder(entry.tag);
}

/** The display data of a tag as Cove sends it, trimmed to what the review uses. */
function tagInfo(value: Partial<TagInfo> & { id: number; name: string }): TagInfo {
  return {
    id: value.id,
    name: value.name,
    sortName: value.sortName,
    color: value.color,
    tagGroupId: value.tagGroupId,
    tagGroupName: value.tagGroupName,
    tagGroupColor: value.tagGroupColor,
    tagGroupSortOrder: value.tagGroupSortOrder,
    imagePath: value.imagePath,
    hasImage: value.hasImage,
  };
}

/** Keep these tags, as an item just read carries them, for every later reader. */
export function rememberTags(list: Iterable<Partial<TagInfo> & { id: number; name?: string }>) {
  for (const tag of list) {
    const name = tag.name?.trim();
    if (Number.isSafeInteger(tag.id) && name) store(tagInfo({ ...tag, name }));
  }
}

function readTag(id: number): InFlight {
  const existing = inFlight.get(id);
  if (existing) return existing;
  const controller = new AbortController();
  const entry: InFlight = {
    controller,
    waiters: 0,
    promise: request<Partial<TagInfo> | null>(`/api/tags/${id}`, {
      signal: controller.signal,
    }).then(
      (tag) => {
        const name = tag?.name?.trim() || null;
        if (inFlight.get(id) === entry) inFlight.delete(id);
        if (!name) return null;
        const read = tagInfo({ ...tag, id, name });
        // Cove's tag endpoint sends neither the group's order nor whether the tag has an image;
        // an item may have told them already, possibly while this request ran.
        const prior = tags.get(id)?.tag;
        const sameGroup = prior?.tagGroupId === read.tagGroupId;
        const info: TagInfo = {
          ...read,
          tagGroupSortOrder: read.tagGroupSortOrder ?? (sameGroup ? prior?.tagGroupSortOrder : undefined),
          hasImage: read.hasImage ?? prior?.hasImage,
          imagePath: read.imagePath ?? prior?.imagePath,
        };
        store(info);
        return withGroupOrder(info);
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
  return new DOMException("The tag request was aborted.", "AbortError");
}

/** Tags already known, without asking Cove. Missing ids are unknown or stale. */
export function cachedTags(ids: Iterable<number>): Record<number, TagInfo> {
  const known: Record<number, TagInfo> = {};
  for (const id of ids) {
    const tag = cachedTag(id);
    if (tag !== undefined) known[id] = tag;
  }
  return known;
}

/**
 * Resolve these tags, null for tags that cannot be read. Rejects with an AbortError when the
 * signal aborts first.
 */
export function loadTags(
  ids: Iterable<number>,
  signal?: AbortSignal,
): Promise<Record<number, TagInfo | null>> {
  if (signal?.aborted) return Promise.reject(abortError());
  const result: Record<number, TagInfo | null> = {};
  const waiting: Array<{ id: number; entry: InFlight }> = [];
  for (const id of new Set(ids)) {
    const tag = cachedTag(id);
    if (tag !== undefined) result[id] = tag;
    else {
      const entry = readTag(id);
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
        entry.promise.then((tag) => [id, tag] as const),
      ),
    ).then((entries) => {
      if (done) return;
      done = true;
      signal?.removeEventListener("abort", abort);
      release();
      for (const [id, tag] of entries) result[id] = tag;
      resolve(result);
    });
  });
}

function namesOf<T extends TagInfo | null>(known: Record<number, T>): Record<number, string | null> {
  const names: Record<number, string | null> = {};
  for (const [id, tag] of Object.entries(known)) names[Number(id)] = tag?.name ?? null;
  return names;
}

/**
 * These tags, keyed by id: the tag once read, null when it cannot be read, and missing while it
 * loads.
 */
export function useTags(ids: readonly number[]): Record<number, TagInfo | null> {
  const key = [...new Set(ids)].sort((left, right) => left - right).join(",");
  const [state, setState] = useState(() => ({
    key,
    tags: cachedTags(parseKey(key)) as Record<number, TagInfo | null>,
  }));
  useEffect(() => {
    const wanted = parseKey(key);
    const known = cachedTags(wanted);
    setState({ key, tags: known });
    if (wanted.every((id) => id in known)) return;
    const controller = new AbortController();
    loadTags(wanted, controller.signal).then(
      (loaded) => setState({ key, tags: loaded }),
      () => {
        // Aborted: this reader moved on to other tags or unmounted.
      },
    );
    return () => controller.abort();
  }, [key]);
  return state.key === key ? state.tags : cachedTags(parseKey(key));
}

/**
 * Names for these tags, keyed by id: a string once read, null when the tag cannot be read, and
 * missing while it loads.
 */
export function useTagNames(ids: readonly number[]): Record<number, string | null> {
  const known = useTags(ids);
  return useMemo(() => namesOf(known), [known]);
}

function parseKey(key: string): number[] {
  return key ? key.split(",").map(Number) : [];
}

/** Forget every cached tag; requests in flight still finish for their readers. */
export function clearTagNameCache() {
  tags.clear();
  groupOrders.clear();
}
