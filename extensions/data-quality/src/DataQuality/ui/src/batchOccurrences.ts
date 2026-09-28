import { request, resolveRemovalTrees } from "./api";
import {
  conditionSeeksMissingTags,
  reviewMediaKind,
  validAction,
  type OccurrenceReview,
  type MediaReviewAction,
} from "./model";
import {
  loadOccurrencePage,
  resolveConditionGroups,
  resolvePerformers,
} from "./occurrences";
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
  /** The answers remove existing tags; skipped unless conflicts are replaced. */
  conflict: boolean;
  status: BatchStatus;
  error?: string;
  operation?: UndoOperation;
  unverified?: boolean;
}
export interface OccurrenceBatch {
  review: OccurrenceReview;
  /** The chosen answers, in review order. */
  actions: MediaReviewAction[];
  /** The chosen answers as one ordered action, with removal trees resolved. */
  action: MediaReviewAction;
  /** Each condition tag with its subtree: at most one answer per category is added. */
  categories: number[][];
  touched: number[];
  entries: BatchEntry[];
}
/** Answers a category already holds, kept instead of the batch answer. */
export interface KeptAnswer {
  tagIds: number[];
  existing: number[];
}
export interface TagPlan {
  desired: number[];
  conflict: boolean;
  /** A conflict that is not being replaced leaves the occurrence untouched. */
  skipped: boolean;
  kept: KeptAnswer[];
  replaced: number[];
}
/**
 * Two chosen answers add tags to the same condition category. The preview refuses them before
 * reading any occurrence; the reviewer has to change the answers, not retry.
 */
export class ConflictingAnswersError extends Error {}
const message = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";
const sorted = (ids: number[]) => [...ids].sort((a, b) => a - b);
const same = (a: number[], b: number[]) =>
  JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));
const changed = (operation: UndoOperation) =>
  !!(operation.tags.added.length || operation.tags.removed.length);

/**
 * The tags an occurrence ends with. Removals in the answers are conflicts, as before. Beyond
 * that, a batch fills a condition category only while it is empty: an answer added to a
 * category that already holds a different one keeps the existing answer, or replaces it when
 * conflicts are replaced. The answers' own tags are never a different answer. Tags outside
 * every category are added as configured.
 */
export function planTags(
  ids: number[],
  action: MediaReviewAction,
  categories: number[][],
  replace: boolean,
): TagPlan {
  const before = new Set(ids);
  const desired = new Set(ids);
  for (const step of action.steps)
    for (const id of step.tagIds) {
      if (step.mode === "ADD") desired.add(id);
      else desired.delete(id);
    }
  const conflict = ids.some((id) => !desired.has(id));
  if (conflict && !replace)
    return { desired: [...ids], conflict, skipped: true, kept: [], replaced: [] };
  const answered = new Set(
    action.steps.filter((step) => step.mode === "ADD").flatMap((step) => step.tagIds),
  );
  const kept: KeptAnswer[] = [];
  const replaced: number[] = [];
  for (const category of categories) {
    const added = category.filter((id) => desired.has(id) && !before.has(id));
    const existing = category.filter(
      (id) => desired.has(id) && before.has(id) && !answered.has(id),
    );
    if (!added.length || !existing.length) continue;
    if (replace) {
      existing.forEach((id) => desired.delete(id));
      replaced.push(...existing);
    } else {
      added.forEach((id) => desired.delete(id));
      kept.push({ tagIds: added, existing });
    }
  }
  return { desired: [...desired], conflict, skipped: false, kept, replaced };
}

export function combineActions(actions: MediaReviewAction[]): MediaReviewAction {
  if (actions.length === 1) return actions[0];
  return {
    id: actions.map((action) => action.id).join("+"),
    label: actions.map((action) => action.label).join(" + "),
    steps: actions.flatMap((action) => action.steps),
  };
}

async function requireOneAnswerPerCategory(
  review: OccurrenceReview,
  actions: MediaReviewAction[],
  categories: number[][],
  signal: AbortSignal,
) {
  for (const [index, category] of categories.entries()) {
    const answering = actions.filter((action) =>
      action.steps.some(
        (step) =>
          step.mode === "ADD" && step.tagIds.some((id) => category.includes(id)),
      ),
    );
    if (answering.length < 2) continue;
    const id = review.occurrence.conditionTagIds[index];
    let name = `tag ${id}`;
    try {
      name = (await request<{ name: string }>(`/api/tags/${id}`, { signal })).name;
    } catch {
      signal.throwIfAborted();
    }
    throw new ConflictingAnswersError(
      `${answering.map((action) => action.label).join(" and ")} answer the same condition tag, ${name}. Choose one of them.`,
    );
  }
}

export async function previewOccurrenceBatch(
  input: OccurrenceReview,
  selected: MediaReviewAction[],
  signal: AbortSignal,
  progress: (count: number) => void = () => {},
): Promise<OccurrenceBatch> {
  if (
    !selected.length ||
    selected.some(
      (answer) =>
        !validAction(answer, input.entityType) ||
        !answer.steps.length ||
        answer.steps.some(
          (step) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(step.mode),
        ),
    )
  )
    throw new Error("Choose a configured occurrence tag action.");
  const review = structuredClone(input);
  const actions = structuredClone(selected);
  // Only a condition looking for missing tags names categories to fill; "has any" or "has all"
  // tags are present already, and without subtags a category would be a single tag.
  const categories =
    conditionSeeksMissingTags(review.occurrence.condition) &&
    review.occurrence.includeSubtags !== false
      ? await resolveConditionGroups(review.occurrence, signal)
      : [];
  await requireOneAnswerPerCategory(review, actions, categories, signal);
  // Each answer's tree removals spare that answer's own tags, as when it is applied on its own.
  const resolved = await Promise.all(
    actions.map(async (answer) => ({
      ...answer,
      steps: await resolveRemovalTrees(answer, signal),
    })),
  );
  const action = structuredClone(combineActions(resolved));
  signal.throwIfAborted();
  // Category members are affected too: a changed existing answer changes the plan.
  const touched = [
    ...new Set([
      ...action.steps.flatMap((step) => step.tagIds),
      ...categories.flat(),
    ]),
  ];
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
      // Replacing is the widest plan: without a change there, nothing can change.
      const plan = planTags(before.ids, action, categories, true);
      entries.set(occurrence.key, {
        item: { key: occurrence.key, media: occurrence.media, occurrence },
        before,
        expected: before,
        conflict: plan.conflict,
        status: same(before.ids, plan.desired) ? "unchanged" : "pending",
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
  return {
    review,
    actions,
    action,
    categories,
    touched,
    entries: [...entries.values()],
  };
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

/** The occurrences a run processes: the pending ones, or on a retry the failed ones. */
export function runEntries(batch: OccurrenceBatch, retry = false): BatchEntry[] {
  return batch.entries.filter((e) =>
    retry ? e.status === "failed" : e.status === "pending",
  );
}

/** The occurrences an undo processes: those with a recorded change. */
export function undoEntries(batch: OccurrenceBatch): BatchEntry[] {
  return batch.entries.filter((e) => e.operation);
}

export async function runOccurrenceBatch(
  batch: OccurrenceBatch,
  replaceConflicts: boolean,
  cancelled: () => boolean,
  update: () => void,
  retry = false,
) {
  await workers(
    runEntries(batch, retry),
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
        before = await readTags(reviewMediaKind(batch.review), entry.item, false);
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
      // Plan from the previewed state, so a retry completes a partly written plan instead of
      // planning again from it; affected tags were just checked against what was expected.
      const plan = planTags(
        entry.before.ids,
        batch.action,
        batch.categories,
        replaceConflicts,
      );
      const desired = [
        ...before.ids.filter((id) => !batch.touched.includes(id)),
        ...plan.desired.filter((id) => batch.touched.includes(id)),
      ];
      const delta = difference(before.ids, desired);
      if (!delta.added.length && !delta.removed.length) {
        // A retry after a write that fully landed has nothing left to do; that change stands.
        const kept = !entry.operation && plan.kept.length > 0;
        entry.status = entry.operation ? "changed" : kept ? "skipped" : "unchanged";
        entry.error = kept
          ? "Kept the existing answer in each category it would fill."
          : undefined;
        return;
      }
      let failure: unknown;
      try {
        await editTags(batch.review, entry.item, delta);
      } catch (error) {
        failure = error;
      }
      let verified = false;
      try {
        const after = await readTags(reviewMediaKind(batch.review), entry.item, false);
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
            const after = await readTags(reviewMediaKind(batch.review), entry.item, false);
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
    undoEntries(batch),
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
        const current = await readTags(reviewMediaKind(batch.review), entry.item, false);
        checkUndo(operation, current);
        started = true;
        await editTags(batch.review, entry.item, {
          added: operation.tags.removed,
          removed: operation.tags.added,
        });
        const after = await readTags(reviewMediaKind(batch.review), entry.item, false);
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
            const after = await readTags(reviewMediaKind(batch.review), entry.item, false);
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
