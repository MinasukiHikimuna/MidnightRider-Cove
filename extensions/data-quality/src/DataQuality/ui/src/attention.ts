import type { TagTrees } from "./effectPreview";
import type { MediaReviewAction, PerformerFlag } from "./model";
import type { AnswerCategory, AnswerCount, MixedAnswers } from "./performerAnswers";

/**
 * Category-aware attention: a performer can need attention in a category of an occurrence review,
 * for one of two reasons. A flag: a tag on the performer's profile that the review's performer
 * flags name, paired with the category it affects (a tag and everything under it, or the whole
 * review). Mixed answers: the performer already holds two or more answers in a category that takes
 * one answer (an answer group, or a condition category an "only one" action covers, see
 * answerCategories); a category that holds several answers at once is never mixed. Answers that
 * add, remove or mark absent a tag of such a category touch it, which is where the review shows
 * the reasons: the batch dialog's warning, the pad's keys and the answer groups' checklist.
 */

/** A tag on a performer's profile. */
export interface ProfileTag {
  id: number;
  name: string;
}

/** The key of the whole review's entry, which every answer touches. */
export const WHOLE_REVIEW = "review";

/** One category where a performer needs attention, with the reasons. */
export interface AttentionEntry {
  /** WHOLE_REVIEW, "tag:<id>" for a tag with everything under it, or "group:<key>". */
  key: string;
  /** The category's name; empty for the whole review. */
  name: string;
  /** The category's tags; null for the whole review. */
  tagIds: readonly number[] | null;
  /** The names of the performer's flag tags that point here. */
  flags: string[];
  /** The answers the performer holds here when they differ, most frequent first; else empty. */
  mixed: readonly AnswerCount[];
  /**
   * A flag's category whose tree is not resolved (yet, or at all): its tags are the category tag
   * alone, so the batch warning counts it as touched by any answer rather than miss it.
   */
  unresolved?: boolean;
}

/** The profile tags the review's flags look for, each once, in flag order. */
export function flagTagIds(flags: readonly PerformerFlag[]): number[] {
  return [...new Set(flags.map((flag) => flag.tagId))];
}

/** The category tags the review's flags affect, each once, in flag order. */
export function flagCategoryIds(flags: readonly PerformerFlag[]): number[] {
  return [
    ...new Set(flags.flatMap((flag) => (flag.categoryTagId === undefined ? [] : [flag.categoryTagId]))),
  ];
}

/** Of a performer's profile tags, the ones the review's flags look for. */
export function performerFlagTags(
  flags: readonly PerformerFlag[],
  profile: readonly ProfileTag[],
): ProfileTag[] {
  const ids = new Set(flagTagIds(flags));
  return profile.filter((tag) => ids.has(tag.id));
}

/** A flag category as the review knows it so far: its name, and its tree once resolved. */
export interface FlagCategory {
  name: string;
  tagIds: readonly number[];
  /** False while the tree is not known: `tagIds` is then the category tag alone. */
  resolved: boolean;
}

/**
 * Where a performer's flag tags ask for attention: one entry for the flags without a category (the
 * whole review), first, then one per affected category. Flag names keep the profile's order, as the
 * performer's flags always read.
 */
export function flagAttention(
  flags: readonly PerformerFlag[],
  carried: readonly ProfileTag[],
  category: (id: number) => FlagCategory,
): AttentionEntry[] {
  const entries = new Map<string, AttentionEntry>();
  const entry = (key: string, create: () => AttentionEntry) => {
    const found = entries.get(key) ?? create();
    entries.set(key, found);
    return found;
  };
  for (const tag of performerFlagTags(flags, carried))
    for (const flag of flags) {
      if (flag.tagId !== tag.id) continue;
      const found =
        flag.categoryTagId === undefined
          ? entry(WHOLE_REVIEW, () => ({
              key: WHOLE_REVIEW,
              name: "",
              tagIds: null,
              flags: [],
              mixed: [],
            }))
          : entry(`tag:${flag.categoryTagId}`, () => {
              const { name, tagIds, resolved } = category(flag.categoryTagId!);
              return {
                key: `tag:${flag.categoryTagId}`,
                name,
                tagIds,
                flags: [],
                mixed: [],
                ...(resolved ? {} : { unresolved: true }),
              };
            });
      if (!found.flags.includes(tag.name)) found.flags.push(tag.name);
    }
  const all = [...entries.values()];
  return [
    ...all.filter((item) => item.key === WHOLE_REVIEW),
    ...all.filter((item) => item.key !== WHOLE_REVIEW),
  ];
}

/**
 * The categories where the performer's existing answers differ: any second distinct answer in a
 * category that takes one answer (AnswerCategory.mixed), each once. In a condition category that
 * holds several answers at once, that is an answer group inside it, whose own answers count,
 * unless a condition category taking one answer holds the group too and says so already (a
 * condition category inside another).
 */
export function mixedAttention(categories: readonly AnswerCategory[]): AttentionEntry[] {
  const found = categories.flatMap((category) => category.mixed);
  const covered = (group: MixedAnswers) =>
    group.key.startsWith("group:") &&
    found.some(
      (category) =>
        category.key.startsWith("tag:") &&
        group.members.every((id) => category.members.includes(id)),
    );
  const entries = new Map<string, AttentionEntry>();
  for (const item of found)
    if (!entries.has(item.key) && !covered(item))
      entries.set(item.key, {
        key: item.key,
        name: item.name,
        tagIds: item.members,
        flags: [],
        mixed: item.tags,
      });
  return [...entries.values()];
}

/**
 * Flags and mixed answers together, one entry per category (a flag on a condition category and
 * that category's mixed answers share one): the whole review first, then as the lists give them.
 */
export function combineAttention(...lists: ReadonlyArray<readonly AttentionEntry[]>): AttentionEntry[] {
  const entries = new Map<string, AttentionEntry>();
  for (const entry of lists.flat()) {
    const found = entries.get(entry.key);
    if (!found) {
      entries.set(entry.key, { ...entry, flags: [...entry.flags] });
      continue;
    }
    for (const flag of entry.flags) if (!found.flags.includes(flag)) found.flags.push(flag);
    if (!found.mixed.length) found.mixed = entry.mixed;
    // Mixed answers come with the category's tags: then it is known either way.
    if (found.unresolved && !entry.unresolved) delete found.unresolved;
    // Mixed answers know the category's tags from the answers, a flag from its resolved tree.
    if (found.tagIds !== null && entry.tagIds !== null)
      found.tagIds = [...new Set([...found.tagIds, ...entry.tagIds])];
  }
  const all = [...entries.values()];
  return [
    ...all.filter((entry) => entry.key === WHOLE_REVIEW),
    ...all.filter((entry) => entry.key !== WHOLE_REVIEW),
  ];
}

/**
 * The tags an action touches: those it adds, removes or marks absent, a tree removal's whole tree
 * once resolved (its parent until then). Clearing an absence touches nothing.
 */
export function touchedTags(action: MediaReviewAction, trees: TagTrees): Set<number> {
  const touched = new Set<number>();
  for (const step of action.steps) {
    if (step.mode === "CLEAR_ABSENCE") continue;
    for (const id of step.tagIds)
      for (const tag of step.mode === "REMOVE_TREE" ? (trees.get(id) ?? [id]) : [id])
        touched.add(tag);
  }
  return touched;
}

/** Whether the action touches the entry's category; every action touches the whole review. */
export function touches(
  action: MediaReviewAction,
  entry: AttentionEntry,
  trees: TagTrees,
): boolean {
  if (entry.tagIds === null) return true;
  const touched = touchedTags(action, trees);
  return entry.tagIds.some((id) => touched.has(id));
}

/**
 * The categories any of these actions touch, and the whole review's entry always. A category whose
 * tree is not known counts as touched by any action, to warn rather than miss it.
 */
export function touchedAttention(
  actions: readonly MediaReviewAction[],
  entries: readonly AttentionEntry[],
  trees: TagTrees,
): AttentionEntry[] {
  return entries.filter(
    (entry) =>
      entry.tagIds === null ||
      (entry.unresolved && actions.length > 0) ||
      actions.some((action) => touches(action, entry, trees)),
  );
}

/** The categories (never the whole review) an action touches: where its key carries a flag. */
export function categoriesTouched(
  action: MediaReviewAction,
  entries: readonly AttentionEntry[],
  trees: TagTrees,
): AttentionEntry[] {
  return entries.filter((entry) => entry.tagIds !== null && touches(action, entry, trees));
}

/** "Mixed: Medium 40 · Big 12", each count kept on the line of its answer. */
export function mixedText(mixed: readonly AnswerCount[]): string {
  return `Mixed: ${mixed.map((tag) => `${tag.name}\u00a0${tag.count.toLocaleString()}`).join(" · ")}`;
}

/** The entry's reasons in words: "Flagged: A, B", then "Mixed: Medium 40 · Big 12". */
export function attentionReasons(entry: AttentionEntry): string[] {
  return [
    ...(entry.flags.length ? [`Flagged: ${entry.flags.join(", ")}`] : []),
    ...(entry.mixed.length ? [mixedText(entry.mixed)] : []),
  ];
}

/** "Size (Flagged: A; Mixed: B 2 · C 1)", or the reasons alone for the whole review. */
export function attentionText(entry: AttentionEntry): string {
  const reasons = attentionReasons(entry).join("; ");
  return entry.tagIds === null ? reasons : `${entry.name} (${reasons})`;
}

/**
 * The performer's flags for a tooltip or a label: "Flagged: A", naming the categories a flag
 * affects, "Flagged: A (affects Size), B"; "whole review" joins them when the same tag also flags
 * the whole review. Empty without flags.
 */
export function flagSummary(
  flags: readonly PerformerFlag[],
  carried: readonly ProfileTag[],
  categoryName: (id: number) => string,
): string {
  const parts = performerFlagTags(flags, carried).map((tag) => {
    const pairs = flags.filter((flag) => flag.tagId === tag.id);
    if (pairs.every((flag) => flag.categoryTagId === undefined)) return tag.name;
    const affects = pairs.map((flag) =>
      flag.categoryTagId === undefined ? "whole review" : categoryName(flag.categoryTagId),
    );
    return `${tag.name} (affects ${[...new Set(affects)].join(", ")})`;
  });
  return parts.length ? `Flagged: ${parts.join(", ")}` : "";
}
