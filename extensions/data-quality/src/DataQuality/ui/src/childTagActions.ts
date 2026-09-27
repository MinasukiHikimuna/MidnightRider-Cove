import { mediaCollection, normalizeCriteria, request } from "./api";
import {
  isOccurrenceReview,
  reviewMediaKind,
  tagsAddedBy,
  type MediaKind,
  type MediaReview,
  type MediaReviewAction,
} from "./model";

/** A direct child of a parent tag, with how often it is used where the review writes tags. */
export interface ChildTag {
  id: number;
  name: string;
  uses: number;
}

export interface ChildTagGroup {
  parent: { id: number; name: string };
  children: ChildTag[];
}

interface TagListItem {
  id: number;
  name: string;
  videoCount?: number;
  audioCount?: number;
}

const CHILD_PAGE = 1000;

/**
 * A parent tag's direct children, most used first. Video and audio reviews count the media
 * tagged with each child. Occurrence reviews count the media where a performer's appearance has
 * it instead: a tag used on appearances can be almost absent from media tags.
 */
export async function loadChildTagGroup(
  review: MediaReview,
  parentId: number,
  signal?: AbortSignal,
): Promise<ChildTagGroup> {
  const parent = await request<{ id: number; name: string }>(
    `/api/tags/${parentId}`,
    { signal },
  );
  const children = new Map<number, TagListItem>();
  for (let page = 1; ; page++) {
    const result = await request<{ items: TagListItem[]; totalCount: number }>(
      "/api/tags/find",
      {
        method: "POST",
        signal,
        body: JSON.stringify(
          normalizeCriteria({
            findFilter: {
              page,
              perPage: CHILD_PAGE,
              sort: "name",
              direction: "asc",
            },
            objectFilter: {
              parentsCriterion: { value: [parentId], modifier: "INCLUDES" },
            },
          }),
        ),
      },
    );
    for (const child of result.items) children.set(child.id, child);
    if (page * CHILD_PAGE >= result.totalCount) break;
    if (!result.items.length)
      throw new Error("Child tag paging ended before every child was loaded.");
  }
  const tags = [...children.values()];
  const kind = reviewMediaKind(review);
  const uses = isOccurrenceReview(review)
    ? await countOccurrenceUses(
        kind,
        tags.map((tag) => tag.id),
        signal,
      )
    : tags.map((tag) => (kind === "audio" ? tag.audioCount : tag.videoCount) ?? 0);
  return {
    parent: { id: parentId, name: parent.name },
    children: tags
      .map((tag, index) => ({ id: tag.id, name: tag.name, uses: uses[index] }))
      .sort(
        (left, right) =>
          right.uses - left.uses ||
          left.name.localeCompare(right.name, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
      ),
  };
}

/** Counts the media where some performer's appearance carries the tag itself. */
function occurrenceUseQuery(tagId: number): string {
  return JSON.stringify(
    normalizeCriteria({
      findFilter: { page: 1, perPage: 1 },
      objectFilter: {
        performerFilterCriterion: {
          mode: "atLeastOne",
          conditionOperator: "and",
          performerOccurrenceTagsCriterion: {
            modifier: "includes",
            value: [tagId],
            depth: 0,
          },
        },
      },
    }),
  );
}

/** One aggregate count per tag, five at a time. The first failure stops the rest. */
async function countOccurrenceUses(
  kind: MediaKind,
  tagIds: number[],
  signal?: AbortSignal,
): Promise<number[]> {
  const counts = new Array<number>(tagIds.length).fill(0);
  const counting = new AbortController();
  const stop = () => counting.abort(signal?.reason);
  if (signal?.aborted) stop();
  signal?.addEventListener("abort", stop, { once: true });
  let next = 0;
  try {
    await Promise.all(
      Array.from({ length: Math.min(5, tagIds.length) }, async () => {
        try {
          while (next < tagIds.length && !counting.signal.aborted) {
            const index = next++;
            counts[index] = (
              await request<{ count: number }>(
                `/api/${mediaCollection(kind)}/aggregate`,
                {
                  method: "POST",
                  signal: counting.signal,
                  body: occurrenceUseQuery(tagIds[index]),
                },
              )
            ).count;
          }
        } catch (error) {
          counting.abort();
          throw error;
        }
      }),
    );
  } finally {
    signal?.removeEventListener("abort", stop);
  }
  counting.signal.throwIfAborted();
  return counts;
}

/** Offers a tag with several chosen parents once, under the first of them. */
export function distinctChildGroups(groups: ChildTagGroup[]): ChildTagGroup[] {
  const offered = new Set<number>();
  return groups.map((group) => ({
    ...group,
    children: group.children.filter((child) => {
      if (offered.has(child.id)) return false;
      offered.add(child.id);
      return true;
    }),
  }));
}

/** Every chosen parent of each child, in the order the parents were chosen. */
export function parentsOfChildren(groups: ChildTagGroup[]): Map<number, number[]> {
  const parents = new Map<number, number[]>();
  for (const group of groups)
    for (const child of group.children)
      parents.set(child.id, [...(parents.get(child.id) ?? []), group.parent.id]);
  return parents;
}

/** The actions adding each tag, so an action generated for one of them would repeat them. */
export function actionsByAddedTag(
  actions: MediaReviewAction[],
): Map<number, MediaReviewAction[]> {
  const adding = new Map<number, MediaReviewAction[]>();
  for (const action of actions)
    for (const id of tagsAddedBy(action))
      adding.set(id, [...(adding.get(id) ?? []), action]);
  return adding;
}

/**
 * An action that adds one child tag. For each "only one" parent it belongs to, it also removes
 * that parent's tree, which spares the tag the action adds, so the child ends up as the only
 * tag in those trees.
 */
export function childTagAction(
  child: Pick<ChildTag, "id" | "name">,
  onlyOneParentIds: number[],
): MediaReviewAction {
  return {
    id: crypto.randomUUID(),
    label: child.name,
    steps: [
      { mode: "ADD", tagIds: [child.id] },
      ...(onlyOneParentIds.length
        ? [{ mode: "REMOVE_TREE" as const, tagIds: onlyOneParentIds }]
        : []),
    ],
  };
}
