import { request, type TagInfo } from "./api";
import { actionGroups } from "./answerGroups";
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
}

/**
 * A performer's answers per category: each condition category, then each answer group that no
 * single condition category holds entirely (its answers being the tags its actions add), then the
 * review's other tags. A group inside a condition category shows there already. Two or more
 * answers in a condition category or a group are mixed answers (see attention.ts).
 */
export function answerCategories(
  summary: AnswerSummary,
  actions: readonly MediaReviewAction[],
): AnswerCategory[] {
  const held = new Map<number, AnswerCount>();
  for (const group of summary.groups) for (const tag of group.tags) held.set(tag.id, tag);
  const members = (group: AnswerGroup) => group.members ?? group.tags.map((tag) => tag.id);
  const rows: AnswerCategory[] = summary.groups
    .filter((group) => group.id !== null)
    .map((group) => ({
      key: `tag:${group.id}`,
      kind: "condition",
      name: group.name,
      members: members(group),
      tags: group.tags,
    }));
  const conditions = rows.map((row) => new Set(row.members));
  const grouped = new Set<number>();
  for (const group of actionGroups(actions)) {
    const answers = [
      ...new Set(group.actions.flatMap((index) => [...tagsAddedBy(actions[index])])),
    ];
    if (!answers.length || conditions.some((tags) => answers.every((id) => tags.has(id))))
      continue;
    answers.forEach((id) => grouped.add(id));
    rows.push({
      key: `group:${group.key}`,
      kind: "group",
      name: group.name,
      members: answers,
      tags: answers.flatMap((id) => held.get(id) ?? []).sort(byFrequency),
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
    });
  return rows;
}
