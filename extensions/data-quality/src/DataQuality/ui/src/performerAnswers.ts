import { request } from "./api";
import { reviewMediaKind, type OccurrenceReview } from "./model";
import {
  resolveConditionGroups,
  type OccurrenceApplication,
} from "./occurrences";

export interface AnswerGroup {
  /** The condition tag the answers belong to; null for review tags outside every category. */
  id: number | null;
  name: string;
  tags: Array<{ id: number; name: string; count: number }>;
}
export interface AnswerSummary {
  /** Items where the performer holds at least one of these answers. */
  answered: number;
  groups: AnswerGroup[];
}

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
    const hosts = new Map<number, { name: string; hosts: Set<number> }>();
    for (const application of own) {
      if (!members.has(application.tag.id)) continue;
      const tag = hosts.get(application.tag.id) ?? {
        name: application.tag.name,
        hosts: new Set<number>(),
      };
      tag.hosts.add(application.hostId);
      hosts.set(application.tag.id, tag);
    }
    return [...hosts]
      .map(([id, tag]) => ({ id, name: tag.name, count: tag.hosts.size }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  };
  const groups: AnswerGroup[] = categories.map((members, index) => ({
    id: settings.conditionTagIds[index],
    name: names[index],
    tags: group(new Set(members)),
  }));
  if (others.size)
    groups.push({
      id: null,
      name: categories.length ? "Other review tags" : "Review tags",
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
