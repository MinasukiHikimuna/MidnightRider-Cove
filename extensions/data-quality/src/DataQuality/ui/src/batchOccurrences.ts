import { resolveTagTree } from "./api";
import {
  validAction,
  type OccurrenceReview,
  type VideoReviewAction,
} from "./model";
import { loadOccurrencePage, resolvePerformers } from "./occurrences";
import {
  checkUndo,
  difference,
  editTags,
  readTags,
  undoOperation,
  type ReviewItem,
  type TagState,
  type UndoOperation,
} from "./reviewTags";

export type BatchStatus =
  "pending" | "changed" | "unchanged" | "skipped" | "failed";
export interface BatchEntry {
  item: ReviewItem;
  before: TagState;
  expected: TagState;
  desired: number[];
  conflict: boolean;
  status: BatchStatus;
  error?: string;
  operation?: UndoOperation;
  unverified?: boolean;
}
export interface OccurrenceBatch {
  review: OccurrenceReview;
  action: VideoReviewAction;
  touched: number[];
  entries: BatchEntry[];
}
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";
const sorted = (ids: number[]) => [...ids].sort((a, b) => a - b);
const same = (a: number[], b: number[]) =>
  JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
const changed = (operation: UndoOperation) =>
  !!(operation.tags.added.length || operation.tags.removed.length);

export function desiredTags(
  ids: number[],
  action: VideoReviewAction,
): number[] {
  const desired = new Set(ids);
  for (const step of action.steps)
    for (const id of step.tagIds) {
      if (step.mode === "ADD") desired.add(id);
      else desired.delete(id);
    }
  return [...desired];
}

export async function previewOccurrenceBatch(
  input: OccurrenceReview,
  selected: VideoReviewAction,
  signal: AbortSignal,
  progress: (count: number) => void = () => {},
): Promise<OccurrenceBatch> {
  if (
    !validAction(selected, "performerOccurrence") ||
    !selected.steps.length ||
    selected.steps.some(
      (step) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(step.mode),
    )
  )
    throw new Error("Choose a configured occurrence tag action.");
  const review = structuredClone(input);
  const action = structuredClone(selected);
  for (const step of action.steps) {
    if (step.mode === "REMOVE_TREE") {
      step.tagIds = await resolveTagTree(step.tagIds, signal);
      step.mode = "REMOVE";
    }
  }
  signal.throwIfAborted();
  const touched = [...new Set(action.steps.flatMap((step) => step.tagIds))];
  // Stable enumeration is independent of the visible page and random/multi-column sorting.
  review.view.filter = {
    ...review.view.filter,
    page: 1,
    perPage: 250,
    sort: "id",
    direction: "asc",
    sorts: undefined,
  };
  const performers = await resolvePerformers(review, signal);
  const entries = new Map<string, BatchEntry>();
  for (let page = 1; ; page++) {
    signal.throwIfAborted();
    const result = await loadOccurrencePage(review, performers, page, signal);
    for (const occurrence of result.items) {
      const before: TagState = {
        ids: [...new Set(occurrence.applications.map((a) => a.tag.id))],
        names: occurrence.applications.map((a) => a.tag.name),
        absent: [],
        applications: occurrence.applications,
      };
      const desired = desiredTags(before.ids, action);
      entries.set(occurrence.key, {
        item: { key: occurrence.key, video: occurrence.video, occurrence },
        before,
        expected: before,
        desired,
        conflict: difference(before.ids, desired).removed.length > 0,
        status: same(before.ids, desired) ? "unchanged" : "pending",
      });
    }
    progress(entries.size);
    if (page * 250 >= result.totalCount) break;
    // A page can legitimately contain no occurrences when links change during enumeration.
    if (page > 100000)
      throw new Error(
        "The matching scene list did not finish loading. Narrow the filters and retry.",
      );
  }
  signal.throwIfAborted();
  return { review, action, touched, entries: [...entries.values()] };
}

function sameAffected(a: TagState, b: TagState, touched: number[]) {
  const own = (state: TagState) =>
    state.ids.filter((id) => touched.includes(id));
  if (!same(own(a), own(b))) return false;
  const applications = (state: TagState) =>
    (state.applications ?? [])
      .filter((a) => touched.includes(a.tag.id))
      .map((a) => a.id);
  return same(applications(a), applications(b));
}

async function workers(
  entries: BatchEntry[],
  cancelled: () => boolean,
  work: (entry: BatchEntry) => Promise<void>,
  update: () => void,
) {
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, entries.length) }, async () => {
      while (!cancelled() && next < entries.length) {
        const entry = entries[next++];
        await work(entry);
        update();
      }
    }),
  );
}

export async function runOccurrenceBatch(
  batch: OccurrenceBatch,
  replaceConflicts: boolean,
  cancelled: () => boolean,
  update: () => void,
  retry = false,
) {
  const entries = batch.entries.filter((e) =>
    retry ? e.status === "failed" : e.status === "pending",
  );
  await workers(
    entries,
    cancelled,
    async (entry) => {
      if (entry.conflict && !replaceConflicts) {
        entry.status = "skipped";
        entry.error = "Conflicting answer skipped.";
        return;
      }
      if (entry.unverified) {
        entry.error =
          "The previous write could not be verified. Inspect this occurrence and create a fresh preview before further changes.";
        return;
      }
      let before: TagState;
      try {
        before = await readTags(entry.item);
        if (!sameAffected(entry.expected, before, batch.touched)) {
          entry.status = "skipped";
          entry.error =
            "Affected tags changed since preview. Create a fresh preview to include this occurrence.";
          return;
        }
      } catch (error) {
        entry.status = "failed";
        entry.error = message(error);
        return;
      }
      // Apply the final action delta once, retaining tags outside the action.
      const desired = desiredTags(before.ids, batch.action);
      const delta = difference(before.ids, desired);
      let failure: unknown;
      try {
        await editTags(batch.review, entry.item, delta);
      } catch (error) {
        failure = error;
      }
      let verified = false;
      try {
        const after = await readTags(entry.item);
        verified = true;
        entry.expected = after;
        const operation = undoOperation(
          entry.item,
          entry.before,
          after,
          batch.touched,
        );
        entry.operation = changed(operation) ? operation : undefined;
        if (failure) throw failure;
        if (
          !same(
            after.ids.filter((id) => batch.touched.includes(id)),
            desired.filter((id) => batch.touched.includes(id)),
          )
        )
          throw new Error(
            "The saved tags do not match the chosen answer. Inspect the occurrence before retrying.",
          );
        entry.status = entry.operation ? "changed" : "unchanged";
        entry.error = undefined;
      } catch (error) {
        entry.status = "failed";
        entry.error = message(error);
        // A failed read leaves the write outcome unknown; never blindly retry it.
        if (!verified) {
          try {
            const after = await readTags(entry.item);
            entry.expected = after;
            const operation = undoOperation(
              entry.item,
              entry.before,
              after,
              batch.touched,
            );
            entry.operation = changed(operation) ? operation : undefined;
          } catch {
            entry.unverified = true;
          }
        }
      }
    },
    update,
  );
}

export async function undoOccurrenceBatch(
  batch: OccurrenceBatch,
  cancelled: () => boolean,
  update: () => void,
) {
  await workers(
    batch.entries.filter((e) => e.operation),
    cancelled,
    async (entry) => {
      const operation = entry.operation!;
      if (entry.unverified) {
        entry.error =
          "Undo unavailable: the previous write could not be verified. Inspect this occurrence.";
        return;
      }
      const touched = [...operation.tags.added, ...operation.tags.removed];
      let started = false;
      try {
        const current = await readTags(entry.item);
        checkUndo(operation, current);
        started = true;
        await editTags(batch.review, entry.item, {
          added: operation.tags.removed,
          removed: operation.tags.added,
        });
        const after = await readTags(entry.item);
        if (
          !same(
            after.ids.filter((id) => touched.includes(id)),
            entry.before.ids.filter((id) => touched.includes(id)),
          )
        )
          throw new Error("Undo did not restore all affected tags.");
        entry.operation = undefined;
        entry.expected = after;
        entry.status = "unchanged";
        entry.error = undefined;
      } catch (error) {
        entry.error = `Undo stopped: ${message(error)}`;
        entry.status = "failed";
        if (started) {
          try {
            const after = await readTags(entry.item);
            const remaining = undoOperation(
              entry.item,
              entry.before,
              after,
              touched,
            );
            entry.operation = changed(remaining) ? remaining : undefined;
            entry.expected = after;
          } catch {
            entry.unverified = true;
          }
        }
      }
    },
    update,
  );
}
