import { previewActionEffect, type TagTrees } from "./effectPreview";
import { tagsAddedBy, type MediaReviewAction } from "./model";
import type { TagState } from "./reviewTags";

/**
 * Answer groups: a review's actions can be grouped, one group per question the item needs answered
 * (each action of a group being one answer), and a review can stay on an item until every group
 * has an answer there. Groups are named on the actions themselves; names match trimmed and
 * ignoring case, and an action without a name belongs to no group and never holds an item back.
 */

/** A group's identity: its name trimmed and in lower case; "" for an action without a group. */
export function groupKey(name: string | undefined): string {
  return (name ?? "").trim().toLocaleLowerCase();
}

export interface ActionGroup {
  key: string;
  /** The name as the group's first action spells it, trimmed. */
  name: string;
  /** The positions of the group's actions among the review's actions, in review order. */
  actions: number[];
}

/** The groups of a review's actions, in the order of each group's first action. */
export function actionGroups(
  actions: ReadonlyArray<Pick<MediaReviewAction, "group">>,
): ActionGroup[] {
  const groups = new Map<string, ActionGroup>();
  actions.forEach((action, index) => {
    const key = groupKey(action.group);
    if (!key) return;
    const group = groups.get(key);
    if (group) group.actions.push(index);
    else groups.set(key, { key, name: action.group!.trim(), actions: [index] });
  });
  return [...groups.values()];
}

/** Whether a review waits for its groups: the setting is on and some action has a group. */
export function waitsForGroups(review: {
  stayUntilGroupsAnswered?: boolean;
  actions: ReadonlyArray<Pick<MediaReviewAction, "group">>;
}): boolean {
  return (
    review.stayUntilGroupsAnswered === true &&
    review.actions.some((action) => groupKey(action.group) !== "")
  );
}

/** The item's tags as the groups read them. */
export type GroupTags = Pick<TagState, "ids" | "absent" | "applications">;

/**
 * The tags the item carries: an occurrence's come from its applications, as the effect preview
 * names them; a media item's are its ids.
 */
function carried(tags: GroupTags): Set<number> {
  return new Set(
    tags.applications
      ? tags.applications.map((application) => application.tag.id)
      : tags.ids,
  );
}

/** The tags an action records as confirmed absent. */
function tagsMarkedAbsentBy(action: MediaReviewAction): Set<number> {
  return new Set(
    action.steps.filter((step) => step.mode === "MARK_ABSENT").flatMap((step) => step.tagIds),
  );
}

/**
 * Whether the action can answer its group: it adds or marks present a tag, or marks one absent.
 * One that only removes tags, clears absences or has no steps answers nothing.
 */
export function answersGroup(action: MediaReviewAction): boolean {
  return tagsAddedBy(action).size > 0 || tagsMarkedAbsentBy(action).size > 0;
}

/** The groups none of whose actions can answer them: items would wait there until skipped. */
export function unanswerableGroups(actions: readonly MediaReviewAction[]): ActionGroup[] {
  return actionGroups(actions).filter(
    (group) => !group.actions.some((index) => answersGroup(actions[index])),
  );
}

export interface GroupStatus extends ActionGroup {
  /**
   * The group's actions whose answer the item holds, in review order; empty while the group is
   * still open. When some action's whole answer is there (every tag it adds is carried and every
   * tag it marks absent is recorded absent), only such actions are listed; otherwise every action
   * with part of its answer there.
   */
  answers: number[];
}

/**
 * Where the item stands on each group. A group is answered when the item carries a tag that one
 * of its actions adds (Add tags or Mark present), or has a recorded absence for a tag one of its
 * actions marks absent, so answers the item already had count as well as ones just given.
 */
export function groupStatus(
  actions: readonly MediaReviewAction[],
  tags: GroupTags,
): GroupStatus[] {
  const present = carried(tags);
  const absent = new Set(tags.absent);
  return actionGroups(actions).map((group) => {
    const whole: number[] = [];
    const partial: number[] = [];
    for (const index of group.actions) {
      const added = [...tagsAddedBy(actions[index])];
      const markedAbsent = [...tagsMarkedAbsentBy(actions[index])];
      const held = [
        ...added.map((id) => present.has(id)),
        ...markedAbsent.map((id) => absent.has(id)),
      ];
      if (!held.some(Boolean)) continue;
      partial.push(index);
      if (held.every(Boolean)) whole.push(index);
    }
    return { ...group, answers: whole.length ? whole : partial };
  });
}

/** The groups still waiting for an answer. */
export function openGroups(statuses: readonly GroupStatus[]): GroupStatus[] {
  return statuses.filter((status) => status.answers.length === 0);
}

/**
 * The item's tags once the action has run, as the effect preview foresees them (see
 * previewActionEffect): what it removes goes, what it adds comes, and its assessments move
 * absences. Until a tree it removes is resolved, only that tree's parent counts as removed.
 */
export function tagsAfterAction(
  action: MediaReviewAction,
  tags: GroupTags,
  trees: TagTrees,
): Pick<TagState, "ids" | "absent"> {
  const before = { ids: [...carried(tags)], absent: tags.absent };
  const effect = previewActionEffect(action, before, trees);
  const removed = new Set(effect.removed);
  const cleared = new Set(effect.absenceCleared);
  return {
    ids: [...before.ids.filter((id) => !removed.has(id)), ...effect.added],
    absent: [...before.absent.filter((id) => !cleared.has(id)), ...effect.markedAbsent],
  };
}
