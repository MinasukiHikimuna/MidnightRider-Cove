import {
  mediaCollection,
  request,
  requireConfirmedAbsentField,
  requireOccurrenceAbsenceField,
  setOccurrenceAbsence,
} from "./api";
import type { MediaKind } from "./model";
import {
  checkUndo,
  difference,
  readTags,
  type ReviewItem,
  type TagChange,
  type TagState,
  type UndoOperation,
} from "./reviewTags";

/**
 * Recent changes: what each applied action, tag edit or batch changed, kept in this browser so it
 * can be undone after the dialog, the review or the page that made it has closed. Only what an
 * undo needs is kept: the tags and absences each item gained and lost, and for occurrence tags the
 * applications the change created, so an undo can tell them from ones made since.
 */
export interface ChangedItem {
  mediaId: number;
  title: string;
  performer?: { id: number; name: string };
  tags: TagChange;
  absence: TagChange;
  /** Occurrence applications of the added tags, as the change left them. */
  applications?: { id: number; tagId: number }[];
  /** Tag names as the change saw them, for tags the page may not have loaded since. */
  names: Record<number, string>;
  /** Set once the item's change is undone, or found undone already. */
  undone?: boolean;
  /** Why the last undo of this item stopped. */
  error?: string;
}
export interface ChangeRecord {
  id: string;
  /** Milliseconds since the epoch. */
  at: number;
  label: string;
  reviewName: string;
  /** The review it was made in, so an undo brings items back only there. */
  reviewId?: string;
  kind: MediaKind;
  items: ChangedItem[];
}

/** Older records are dropped beyond this many, or beyond HISTORY_SIZE, oldest first. */
export const HISTORY_LIMIT = 50;
/**
 * The most text the history keeps, about a third of a browser's usual storage, so Cove, other
 * extensions and this extension's own reviews and progress keep room of their own.
 */
export const HISTORY_SIZE = 1_500_000;
let scope = "";
const listeners = new Set<() => void>();

/** The account whose history is read and written: the reviews' storage key. */
export function setHistoryScope(key: string) {
  if (scope === key) return;
  scope = key;
  notify();
}
const storageKey = () => (scope ? `${scope}:history` : "");
function notify() {
  listeners.forEach((listener) => listener());
}
export function subscribeHistory(listener: () => void): () => void {
  listeners.add(listener);
  // Another tab of the same account records and undoes changes too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === storageKey()) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const isIds = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((id) => Number.isSafeInteger(id));
const isChange = (value: unknown): value is TagChange =>
  typeof value === "object" &&
  value !== null &&
  isIds((value as TagChange).added) &&
  isIds((value as TagChange).removed);
function isItem(value: unknown): value is ChangedItem {
  const item = value as ChangedItem;
  return (
    typeof value === "object" &&
    value !== null &&
    Number.isSafeInteger(item.mediaId) &&
    isChange(item.tags) &&
    isChange(item.absence) &&
    (item.performer === undefined || Number.isSafeInteger(item.performer?.id))
  );
}
function isRecord(value: unknown): value is ChangeRecord {
  const record = value as ChangeRecord;
  return (
    typeof value === "object" &&
    value !== null &&
    typeof record.id === "string" &&
    typeof record.at === "number" &&
    (record.kind === "video" || record.kind === "audio") &&
    Array.isArray(record.items) &&
    record.items.every(isItem)
  );
}

/** The stored history, newest first; anything this version cannot read is left out. */
export function loadHistory(): ChangeRecord[] {
  const key = storageKey();
  if (!key) return [];
  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) ?? "[]");
    return Array.isArray(value)
      ? value.filter(isRecord).map((record) => ({
          ...record,
          label: String(record.label ?? ""),
          reviewName: String(record.reviewName ?? ""),
          reviewId: typeof record.reviewId === "string" ? record.reviewId : undefined,
          items: record.items.map((item) => ({
            ...item,
            title: String(item.title ?? ""),
            names: typeof item.names === "object" && item.names ? item.names : {},
          })),
        }))
      : [];
  } catch {
    return [];
  }
}
/**
 * Stores the records, newest first, dropping the oldest ones beyond HISTORY_LIMIT or HISTORY_SIZE
 * or the browser's room, though never the record named by `required`. Says whether everything
 * wanted was stored: when `required` cannot fit even alone, the history is stored as it would be
 * without it. Each record is measured once, so a batch's large record never costs more than that.
 */
function save(records: ChangeRecord[], required?: string): boolean {
  const key = storageKey();
  if (!key) return false;
  let kept = [...records];
  const sizes = new Map<ChangeRecord, number>();
  let size = 2;
  /** Drops the oldest record but the required one, and says whether there was one. */
  const dropOldest = () => {
    let oldest = kept.length - 1;
    while (oldest >= 0 && kept[oldest].id === required) oldest--;
    if (oldest < 0) return false;
    size -= sizes.get(kept[oldest]) ?? 0;
    kept.splice(oldest, 1);
    return true;
  };
  while (kept.length > HISTORY_LIMIT) dropOldest();
  for (const record of kept) {
    sizes.set(record, JSON.stringify(record).length + 1);
    size += sizes.get(record)!;
  }
  const fits = () => {
    while (size > HISTORY_SIZE) if (!dropOldest()) return false;
    return true;
  };
  while (fits()) {
    try {
      localStorage.setItem(key, JSON.stringify(kept));
      notify();
      return true;
    } catch {
      // Out of the browser's room: the oldest record goes, and the rest is tried again.
      if (!dropOldest()) break;
    }
  }
  if (required !== undefined) save(records.filter((item) => item.id !== required));
  return false;
}

/**
 * Adds a record, or replaces the one with its id (a batch updates its record after each run and
 * undo). A record whose items changed nothing is left out, and replacing with one removes it.
 * Says whether the change can be undone from Recent changes: false when there is no account yet,
 * the browser refuses storage, or the record is too large to keep. It never throws, so a failure
 * to record never fails the write it records.
 */
export function recordChange(record: ChangeRecord): boolean {
  try {
    const items = record.items.filter((item) => item.undone || hasChange(item));
    const others = loadHistory().filter((item) => item.id !== record.id);
    if (!items.some((item) => !item.undone)) {
      save(others);
      return true;
    }
    return save([{ ...record, items }, ...others].sort((a, b) => b.at - a.at), record.id);
  } catch {
    return false;
  }
}
export function clearHistory() {
  save([]);
}

const hasChange = (item: Pick<ChangedItem, "tags" | "absence">) =>
  [item.tags, item.absence].some(
    (change) => change.added.length > 0 || change.removed.length > 0,
  );

/** The tags of a review item's before and after states that differ, as a recorded item. */
export function changedItem(
  item: ReviewItem,
  title: string,
  before: TagState,
  after: TagState,
  touched?: readonly number[],
): ChangedItem {
  const only = (ids: number[]) =>
    touched ? ids.filter((id) => touched.includes(id)) : ids;
  const tags = difference(only(before.ids), only(after.ids));
  const absence = difference(only(before.absent), only(after.absent));
  const names: Record<number, string> = {};
  for (const state of [before, after]) {
    state.tags?.forEach((tag) => (names[tag.id] = tag.name));
    state.applications?.forEach((a) => (names[a.tag.id] = a.tag.name));
    if (!state.tags && !state.applications)
      state.ids.forEach((id, index) => {
        if (state.names[index]) names[id] = state.names[index];
      });
  }
  const performer = item.occurrence?.performer;
  return {
    mediaId: item.media.id,
    title,
    performer: performer && { id: performer.id, name: performer.name },
    tags,
    absence,
    applications: after.applications
      ?.filter((a) => tags.added.includes(a.tag.id))
      .map((a) => ({ id: a.id, tagId: a.tag.id })),
    names: Object.fromEntries(
      [...tags.added, ...tags.removed, ...absence.added, ...absence.removed]
        .filter((id) => names[id])
        .map((id) => [id, names[id]]),
    ),
  };
}

/** An item as far as reading its tags needs. */
function reviewItem(item: ChangedItem): ReviewItem {
  const media = { id: item.mediaId } as ReviewItem["media"];
  return {
    key: item.performer ? `${item.mediaId}:${item.performer.id}` : String(item.mediaId),
    media,
    occurrence: item.performer && {
      key: `${item.mediaId}:${item.performer.id}`,
      media,
      performer: item.performer as NonNullable<ReviewItem["occurrence"]>["performer"],
      applications: [],
    },
  };
}
function operation(item: ChangedItem): UndoOperation {
  const after: TagState = {
    ids: item.tags.added,
    names: [],
    absent: item.absence.added,
    applications: item.applications?.map((a) => ({
      id: a.id,
      hostType: "",
      hostId: item.mediaId,
      tag: { id: a.tagId, name: item.names[a.tagId] ?? "" },
    })),
  };
  return {
    item: reviewItem(item),
    before: { ids: item.tags.removed, names: [], absent: item.absence.removed },
    after,
    tags: item.tags,
    absence: item.absence,
  };
}
/** The part of an item's change that the current state still shows. */
function remaining(item: ChangedItem, current: TagState): ChangedItem {
  return {
    ...item,
    tags: {
      added: item.tags.added.filter((id) => current.ids.includes(id)),
      removed: item.tags.removed.filter((id) => !current.ids.includes(id)),
    },
    absence: {
      added: item.absence.added.filter((id) => current.absent.includes(id)),
      removed: item.absence.removed.filter((id) => !current.absent.includes(id)),
    },
  };
}

/**
 * Restores the tags and absences an item's change touched, and nothing else. Only what the item
 * still shows of the change is undone: a tag already put back by hand is left alone, and an item
 * already as it was before counts as undone. An occurrence tag the change added that has been
 * applied again since is a conflict, and nothing is written: deleting it would remove a newer tag.
 * Absences an undo removes go first and ones it restores last, so a failure in between never
 * leaves an absence that contradicts the tags.
 */
export async function undoItem(kind: MediaKind, change: ChangedItem): Promise<ChangedItem> {
  const target = reviewItem(change);
  const withAbsence = change.absence.added.length + change.absence.removed.length > 0;
  const current = await readTags(kind, target, withAbsence);
  const item = remaining(change, current);
  if (!hasChange(item)) return { ...change, undone: true, error: undefined };
  checkUndo(operation(item), current);
  const performerId = item.performer?.id;
  const absenceKey = withAbsence
    ? performerId === undefined
      ? await requireConfirmedAbsentField(kind)
      : await requireOccurrenceAbsenceField(kind)
    : "";
  const absence = async (tagIds: number[], mode: "ADD" | "REMOVE") => {
    if (!tagIds.length) return;
    if (performerId !== undefined)
      await setOccurrenceAbsence(absenceKey, kind, item.mediaId, performerId, tagIds, mode);
    else
      await request(`/api/${mediaCollection(kind)}/bulk`, {
        method: "POST",
        body: JSON.stringify({
          ids: [item.mediaId],
          customFields: { [absenceKey]: tagIds },
          customFieldMode: mode,
        }),
      });
  };
  try {
    await absence(item.absence.added, "REMOVE");
    if (performerId !== undefined) {
      for (const application of current.applications ?? [])
        if (item.tags.added.includes(application.tag.id))
          await request(`/api/tagapplications/${application.id}`, { method: "DELETE" });
      for (const tagId of item.tags.removed)
        await request("/api/tagapplications", {
          method: "POST",
          body: JSON.stringify({
            hostType: kind,
            hostId: item.mediaId,
            contextType: "performer",
            contextId: performerId,
            tagId,
            sourceKey: "user",
          }),
        });
    } else
      for (const [tagMode, tagIds] of [
        ["REMOVE", item.tags.added],
        ["ADD", item.tags.removed],
      ] as const)
        if (tagIds.length)
          await request(`/api/${mediaCollection(kind)}/bulk`, {
            method: "POST",
            body: JSON.stringify({ ids: [item.mediaId], tagMode, tagIds }),
          });
    await absence(item.absence.removed, "ADD");
  } catch (error) {
    // Whatever landed is undone; the rest stays recorded, to undo again once inspected. A write
    // whose answer was lost may have landed in full, which the read shows.
    const state = await readTags(kind, target, withAbsence).catch(() => null);
    const left = state ? remaining(item, state) : item;
    if (!hasChange(left)) return { ...change, undone: true, error: undefined };
    throw Object.assign(new Error(message(error)), { left });
  }
  const after = await readTags(kind, target, withAbsence);
  const left = remaining(item, after);
  if (hasChange(left))
    throw Object.assign(new Error("Undo did not restore every affected tag."), { left });
  // The whole change stays listed, as it was made.
  return { ...change, undone: true, error: undefined };
}

const message = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";

/**
 * Undoes a record's items that are not undone yet, a few at a time, and saves each outcome as it
 * lands: an item that stops keeps what is left of its change and why, to undo again.
 */
export async function undoRecord(
  id: string,
  progress: (done: number, total: number) => void = () => {},
): Promise<{ undone: number; failed: number }> {
  const record = loadHistory().find((item) => item.id === id);
  if (!record) throw new Error("This change is no longer in the history.");
  const items = [...record.items];
  const pending = items.flatMap((item, index) => (item.undone ? [] : [index]));
  let next = 0;
  let done = 0;
  let failed = 0;
  // Outcomes are stored every second and at the end, not per item: a large batch would otherwise
  // rewrite the whole history thousands of times.
  let stored = Date.now();
  const store = () => {
    stored = Date.now();
    const latest = loadHistory();
    const at = latest.findIndex((item) => item.id === id);
    if (at >= 0) {
      latest[at] = { ...latest[at], items };
      save(latest);
    }
  };
  await Promise.all(
    Array.from({ length: Math.min(4, pending.length) }, async () => {
      while (next < pending.length) {
        const index = pending[next++];
        try {
          items[index] = await undoItem(record.kind, items[index]);
        } catch (error) {
          failed++;
          const left = (error as { left?: ChangedItem }).left ?? items[index];
          items[index] = { ...left, undone: false, error: message(error) };
        }
        if (Date.now() - stored > 1000) store();
        progress(++done, pending.length);
      }
    }),
  );
  store();
  return { undone: done - failed, failed };
}

/** Reads items a few at a time, keeping their order; a failed read fails the whole call. */
export async function readEach<T, R>(
  items: readonly T[],
  read: (item: T) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(6, items.length) }, async () => {
      while (next < items.length) {
        const index = next++;
        results[index] = await read(items[index]);
      }
    }),
  );
  return results;
}

/** An item's key as the review queues key their items. */
export const itemKey = (item: ChangedItem) =>
  item.performer ? `${item.mediaId}:${item.performer.id}` : String(item.mediaId);

export const newRecordId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
