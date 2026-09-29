import { request, type TagInfo } from "./api";
import { actionGroups } from "./answerGroups";
import type { TagTrees } from "./effectPreview";
import {
  reviewMediaKind,
  tagsAddedBy,
  type MediaReviewAction,
  type OccurrenceReview,
} from "./model";
import {
  resolveConditionGroups,
  type OccurrenceApplication,
} from "./occurrences";
import { rememberTags } from "./tagNames";
import { compareTagsForDisplay } from "./tagOrder";

/** One of the performer's answers, with the number of their items that hold it. */
export type AnswerCount = TagInfo & { count: number };

export interface AnswerGroup {
  /** The condition tag the answers belong to; null for review tags outside every category. */
  id: number | null;
  name: string;
  /**
   * Every tag of the group: the condition tag with its subtree (as the condition reads it), or the
   * review's other tags. Missing in summaries from before categories knew their tags.
   */
  members?: number[];
  /** Most frequent first; equally frequent answers in Cove's display order. */
  tags: AnswerCount[];
}
export interface AnswerSummary {
  /** Items where the performer holds at least one of these answers. */
  answered: number;
  groups: AnswerGroup[];
}

const byFrequency = (a: AnswerCount, b: AnswerCount) =>
  b.count - a.count || compareTagsForDisplay(a, b);

/**
 * The answers one performer already has across all of their items, grouped by the review's
 * condition categories. It shows what the rest of a batch is likely to need, and a category
 * holding different answers points at a change during the performer's career.
 */
export async function loadPerformerAnswers(
  review: OccurrenceReview,
  performerId: number,
  signal: AbortSignal,
): Promise<AnswerSummary> {
  const kind = reviewMediaKind(review);
  const settings = review.occurrence;
  const [applications, categories] = await Promise.all([
    request<OccurrenceApplication[]>(
      `/api/tagapplications?hostType=${kind}&contextType=performer&contextId=${performerId}`,
      { signal },
    ),
    resolveConditionGroups(settings, signal),
  ]);
  const own = applications.filter(
    (application) =>
      application.hostType === kind &&
      application.contextType === "performer" &&
      application.contextId === performerId,
  );
  // These carry Cove's display data; previews of the same answers show them alike.
  rememberTags(own.map((application) => application.tag));
  const names = await Promise.all(
    categories.map(async (_, index) => {
      const id = settings.conditionTagIds[index];
      return (await request<{ name: string }>(`/api/tags/${id}`, { signal })).name;
    }),
  );
  const categorized = new Set(categories.flat());
  // Tags the review can add: its actions' answers, or a legacy review's tag choices.
  const others = new Set(
    [
      ...review.actions
        .flatMap((action) => action.steps)
        .filter((step) => step.mode === "ADD" || step.mode === "MARK_PRESENT")
        .flatMap((step) => step.tagIds),
      ...settings.tagIds,
    ].filter((id) => !categorized.has(id)),
  );
  const group = (members: Set<number>) => {
    const hosts = new Map<number, { tag: TagInfo; hosts: Set<number> }>();
    for (const application of own) {
      if (!members.has(application.tag.id)) continue;
      const entry = hosts.get(application.tag.id) ?? {
        tag: application.tag,
        hosts: new Set<number>(),
      };
      entry.hosts.add(application.hostId);
      hosts.set(application.tag.id, entry);
    }
    return [...hosts.values()]
      .map((entry) => ({ ...entry.tag, count: entry.hosts.size }))
      .sort(byFrequency);
  };
  const groups: AnswerGroup[] = categories.map((members, index) => ({
    id: settings.conditionTagIds[index],
    name: names[index],
    members,
    tags: group(new Set(members)),
  }));
  if (others.size)
    groups.push({
      id: null,
      name: categories.length ? "Other review tags" : "Review tags",
      members: [...others],
      tags: group(others),
    });
  const relevant = new Set([...categorized, ...others]);
  return {
    answered: new Set(
      own
        .filter((application) => relevant.has(application.tag.id))
        .map((application) => application.hostId),
    ).size,
    groups,
  };
}

/** Two or more different answers the performer holds in a category that takes one answer. */
export interface MixedAnswers {
  /** The category's key: its row's, or "group:<key>" for an answer group inside a row. */
  key: string;
  name: string;
  /** The category's tags: an answer that changes one of them touches the mixed answers. */
  members: readonly number[];
  /** The answers the performer holds there, most frequent first. */
  tags: AnswerCount[];
}

/** One row of a performer's existing answers: a category and the answers they hold there. */
export interface AnswerCategory {
  /** "tag:<condition tag id>", "group:<answer group key>", or "other" for the other review tags. */
  key: string;
  kind: "condition" | "group" | "other";
  name: string;
  /** The category's tags: the condition tag's tree, the group's answers, or the other tags. */
  members: readonly number[];
  /** The answers the performer holds here, most frequent first. */
  tags: AnswerCount[];
  /**
   * Where the row's answers are mixed. Only a category that takes one answer can be: the row
   * itself when it is an answer group or a one-answer condition category (oneAnswerCategory),
   * otherwise each answer group inside the condition category. Empty when none is mixed: a
   * category that holds several answers at once shows its counts without being mixed.
   */
  mixed: MixedAnswers[];
}

/**
 * Whether a condition category holds one answer at a time: some action adds (Add tags or Mark
 * present) a tag of the category and removes a tree that holds the whole category, the category's
 * own tag or one above it, as "Only one per performer" generates. The trees are the review's tree
 * removals as resolved so far (see useTagTrees); before a tree is known, only a removal of the
 * category's own tag counts.
 */
export function oneAnswerCategory(
  categoryId: number,
  members: readonly number[],
  actions: readonly MediaReviewAction[],
  trees: TagTrees,
): boolean {
  const inside = new Set([categoryId, ...members]);
  const holdsCategory = (parent: number) => {
    if (parent === categoryId) return true;
    const tree = trees.get(parent);
    if (!tree) return false;
    const removed = new Set(tree);
    return [...inside].every((id) => removed.has(id));
  };
  return actions.some(
    (action) =>
      [...tagsAddedBy(action)].some((id) => inside.has(id)) &&
      action.steps.some(
        (step) => step.mode === "REMOVE_TREE" && step.tagIds.some(holdsCategory),
      ),
  );
}

/**
 * A performer's answers per category: each condition category, then each answer group that no
 * single condition category holds entirely (its answers being the tags its actions add), then the
 * review's other tags. A group inside a condition category shows there already, and makes that
 * row mixed when it is (AnswerCategory.mixed). `trees` are the review's tree removals as resolved
 * so far, which tell the condition categories that take one answer (oneAnswerCategory).
 */
export function answerCategories(
  summary: AnswerSummary,
  actions: readonly MediaReviewAction[],
  trees: TagTrees,
): AnswerCategory[] {
  const held = new Map<number, AnswerCount>();
  for (const group of summary.groups) for (const tag of group.tags) held.set(tag.id, tag);
  const heldOf = (ids: readonly number[]) =>
    ids.flatMap((id) => held.get(id) ?? []).sort(byFrequency);
  const members = (group: AnswerGroup) => group.members ?? group.tags.map((tag) => tag.id);
  // Each answer group with its answers, the tags its actions add, and those the performer holds.
  const groups = actionGroups(actions).flatMap((group) => {
    const answers = [
      ...new Set(group.actions.flatMap((index) => [...tagsAddedBy(actions[index])])),
    ];
    return answers.length ? [{ ...group, answers, tags: heldOf(answers) }] : [];
  });
  // Two or more answers in a category that takes one.
  const mixed = (category: MixedAnswers): MixedAnswers[] =>
    category.tags.length > 1 ? [category] : [];
  const rows: AnswerCategory[] = summary.groups
    .filter((group): group is AnswerGroup & { id: number } => group.id !== null)
    .map((group) => {
      const key = `tag:${group.id}`;
      const memberIds = members(group);
      const inside = new Set(memberIds);
      return {
        key,
        kind: "condition",
        name: group.name,
        members: memberIds,
        tags: group.tags,
        mixed: oneAnswerCategory(group.id, memberIds, actions, trees)
          ? mixed({ key, name: group.name, members: memberIds, tags: group.tags })
          : // A category that holds several answers is mixed where a group inside it is.
            groups
              .filter((answerGroup) => answerGroup.answers.every((id) => inside.has(id)))
              .flatMap((answerGroup) =>
                mixed({
                  key: `group:${answerGroup.key}`,
                  name: answerGroup.name,
                  members: answerGroup.answers,
                  tags: answerGroup.tags,
                }),
              ),
      };
    });
  const conditions = rows.map((row) => new Set(row.members));
  const grouped = new Set<number>();
  for (const group of groups) {
    if (conditions.some((tags) => group.answers.every((id) => tags.has(id)))) continue;
    group.answers.forEach((id) => grouped.add(id));
    const key = `group:${group.key}`;
    rows.push({
      key,
      kind: "group",
      name: group.name,
      members: group.answers,
      tags: group.tags,
      // An answer group is one question: it takes one answer.
      mixed: mixed({ key, name: group.name, members: group.answers, tags: group.tags }),
    });
  }
  const other = summary.groups.find((group) => group.id === null);
  const rest = other?.tags.filter((tag) => !grouped.has(tag.id)) ?? [];
  if (other && rest.length)
    rows.push({
      key: "other",
      kind: "other",
      name: rows.length ? "Other review tags" : "Review tags",
      members: members(other).filter((id) => !grouped.has(id)),
      tags: rest,
      mixed: [],
    });
  return rows;
}
