import { useEffect, useRef, useState } from "react";
import { resolveTagTree, type TagInfo } from "./api";
import {
  isAssessmentMode,
  tagsAddedBy,
  type MediaReviewAction,
  type ReviewAction,
  type ReviewStep,
} from "./model";
import type { TagState } from "./reviewTags";
import { sortTagsForDisplay } from "./tagOrder";

/** Each tree removal's parent tag, mapped to that parent and all of its descendants. */
export type TagTrees = ReadonlyMap<number, readonly number[]>;

/** What applying an action would change on the item on screen, relative to its current tags. */
export interface ActionEffectPreview {
  /** Tags the item would gain, in the order the action names them. */
  added: number[];
  /** Tags the item has now and would lose, in the item's order. */
  removed: number[];
  /** Tags that would newly be recorded as confirmed absent. */
  markedAbsent: number[];
  /** Recorded absences that would be cleared. */
  absenceCleared: number[];
  /**
   * Tree removals whose trees are not resolved yet. Until they are, only the parent tag itself
   * counts as removed, so the removals may be incomplete.
   */
  unresolvedTrees: number[];
}

/** The parent tags of every tree removal in these actions, each once. */
export function removalTreeParents(actions: readonly ReviewAction[]): number[] {
  const parents = new Set<number>();
  for (const action of actions)
    if ("steps" in action)
      for (const step of action.steps)
        if (step.mode === "REMOVE_TREE") step.tagIds.forEach((id) => parents.add(id));
  return [...parents];
}

/**
 * Mirrors how an action runs (see runReviewAction and runOccurrenceAction): each tree removal
 * becomes a plain removal of the tree minus every tag the same action adds or marks present,
 * empty removals drop out, and plain steps run before assessment steps. MARK_PRESENT adds the
 * tags and clears their absence, MARK_ABSENT removes them and records their absence, and
 * CLEAR_ABSENCE touches only the absence. Occurrence tags are the same set of tag ids as the
 * occurrence's applications, so both kinds of item preview alike.
 */
export function previewActionEffect(
  action: MediaReviewAction,
  tags: Pick<TagState, "ids" | "absent">,
  trees: TagTrees,
): ActionEffectPreview {
  const kept = tagsAddedBy(action);
  const unresolvedTrees: number[] = [];
  const steps: ReviewStep[] = [];
  for (const step of action.steps) {
    if (step.mode !== "REMOVE_TREE") {
      steps.push(step);
      continue;
    }
    const tagIds = step.tagIds.flatMap((parent) => {
      const tree = trees.get(parent);
      if (!tree) unresolvedTrees.push(parent);
      return tree ?? [parent];
    });
    steps.push({ mode: "REMOVE", tagIds: tagIds.filter((id) => !kept.has(id)) });
  }
  const ordered = [
    ...steps.filter((step) => !isAssessmentMode(step.mode)),
    ...steps.filter((step) => isAssessmentMode(step.mode)),
  ];
  const present = new Set(tags.ids);
  const absent = new Set(tags.absent);
  for (const step of ordered)
    for (const id of step.tagIds)
      switch (step.mode) {
        case "ADD":
          present.add(id);
          break;
        case "REMOVE":
        case "REMOVE_TREE":
          present.delete(id);
          break;
        case "MARK_PRESENT":
          present.add(id);
          absent.delete(id);
          break;
        case "MARK_ABSENT":
          present.delete(id);
          absent.add(id);
          break;
        case "CLEAR_ABSENCE":
          absent.delete(id);
          break;
      }
  const before = new Set(tags.ids);
  const absentBefore = new Set(tags.absent);
  // Only tags the action names can be gained or become absent.
  const named = [...new Set(action.steps.flatMap((step) => step.tagIds))];
  return {
    added: named.filter((id) => present.has(id) && !before.has(id)),
    removed: [...before].filter((id) => !present.has(id)),
    markedAbsent: named.filter((id) => absent.has(id) && !absentBefore.has(id)),
    absenceCleared: [...absentBefore].filter((id) => !absent.has(id)),
    unresolvedTrees: [...new Set(unresolvedTrees)],
  };
}

/**
 * The item's current tags, with their display data where Cove sent it, in Cove's display order.
 * An occurrence reads them from its applications: TagState keeps its ids and names as separate
 * de-duplicated lists, so two tags sharing a name would misalign them. A media item keeps its
 * tags as read; ids and names line up for media, which covers states built without them.
 */
export function currentTags(
  tags: Pick<TagState, "ids" | "names" | "tags" | "applications">,
): TagInfo[] {
  let list: TagInfo[];
  if (tags.applications) {
    const seen = new Map<number, TagInfo>();
    for (const application of tags.applications)
      if (!seen.has(application.tag.id)) seen.set(application.tag.id, application.tag);
    list = [...seen.values()];
  } else
    list =
      tags.tags ?? tags.ids.map((id, index) => ({ id, name: tags.names[index] ?? "" }));
  return sortTagsForDisplay(list);
}

/**
 * The trees behind this review's tree removals, each resolved once for as long as the calling
 * view stays mounted (the workspace mounts once per review). A tree that cannot be read is asked
 * for again when the actions change; until then previews treat only its parent as removed.
 */
export function useTagTrees(actions: readonly ReviewAction[]): TagTrees {
  return useResolvedTrees(removalTreeParents(actions));
}

/**
 * These tags, each mapped to itself and all of its descendants, each resolved once for as long as
 * the calling view stays mounted. A tree that cannot be read is asked for again when the tags
 * change; a tag whose tree is not resolved yet is missing from the map.
 */
export function useResolvedTrees(parents: readonly number[]): TagTrees {
  const key = [...new Set(parents)]
    .sort((left, right) => left - right)
    .join(",");
  const [trees, setTrees] = useState<TagTrees>(() => new Map());
  const requested = useRef(new Set<number>());
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  useEffect(() => {
    const wanted = key ? key.split(",").map(Number) : [];
    for (const parent of wanted) {
      if (requested.current.has(parent)) continue;
      requested.current.add(parent);
      // A few small reads; one still running when the view closes only has its result ignored.
      resolveTagTree([parent]).then(
        (ids) => {
          if (mounted.current) setTrees((current) => new Map(current).set(parent, ids));
        },
        () => {
          requested.current.delete(parent);
        },
      );
    }
  }, [key]);
  return trees;
}
