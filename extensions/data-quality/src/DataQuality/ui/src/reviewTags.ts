import {
  CONFIRMED_ABSENT_TAGS_KEY,
  request,
  readVideo,
  resolveTagTree,
  runReviewAction,
  type Video,
} from "./api";
import {
  runOccurrenceAction,
  saveOccurrenceTags,
  type Occurrence,
  type OccurrenceApplication,
} from "./occurrences";
import type { MediaReview } from "./reviewQuery";
import type { VideoReviewAction } from "./model";
export interface ReviewItem {
  key: string;
  video: Video;
  occurrence?: Occurrence;
}
export interface TagState {
  ids: number[];
  names: string[];
  absent: number[];
  applications?: OccurrenceApplication[];
}
export interface TagChange {
  added: number[];
  removed: number[];
}
export interface UndoOperation {
  item: ReviewItem;
  before: TagState;
  after: TagState;
  tags: TagChange;
  absence: TagChange;
}
export function difference(before: number[], after: number[]): TagChange {
  return {
    added: after.filter((id) => !before.includes(id)),
    removed: before.filter((id) => !after.includes(id)),
  };
}
function path(item: ReviewItem) {
  return `/api/tagapplications?hostType=video&hostId=${item.video.id}&contextType=performer&contextId=${item.occurrence!.performer.id}`;
}
export async function readTags(item: ReviewItem): Promise<TagState> {
  if (item.occurrence) {
    const applications = (
      await request<OccurrenceApplication[]>(path(item))
    ).filter(
      (a) =>
        a.hostType === "video" &&
        a.hostId === item.video.id &&
        a.contextType === "performer" &&
        a.contextId === item.occurrence!.performer.id,
    );
    return {
      ids: [...new Set(applications.map((a) => a.tag.id))],
      names: [...new Set(applications.map((a) => a.tag.name))],
      absent: [],
      applications,
    };
  }
  const video = await readVideo(item.video.id);
  const tags = (video.tags ?? []).filter(
    (t) => t.canRemove !== false || t.isDerived !== true,
  );
  const absentKey =
    Object.keys(video.customFields ?? {}).find(
      (key) => key.toLowerCase() === CONFIRMED_ABSENT_TAGS_KEY,
    ) ?? CONFIRMED_ABSENT_TAGS_KEY;
  const absent = video.customFields?.[absentKey] ?? [];
  if (!Array.isArray(absent) || absent.some((id) => !Number.isSafeInteger(id)))
    throw new Error(
      "Confirmed absent tags are invalid. Inspect the video before editing.",
    );
  return { ids: tags.map((t) => t.id), names: tags.map((t) => t.name), absent };
}
export async function editTags(
  review: MediaReview,
  item: ReviewItem,
  change: TagChange,
) {
  if (item.occurrence && review.entityType === "performerOccurrence") {
    await saveOccurrenceTags(
      {
        ...review,
        occurrence: {
          ...review.occurrence,
          tagIds: [...change.added, ...change.removed],
          multiple: true,
        },
      },
      item.occurrence,
      change.added,
    );
  } else {
    for (const [tagMode, tagIds] of [
      ["ADD", change.added],
      ["REMOVE", change.removed],
    ] as const) {
      if (tagIds.length)
        await request("/api/videos/bulk", {
          method: "POST",
          body: JSON.stringify({ ids: [item.video.id], tagMode, tagIds }),
        });
    }
  }
}
export async function applyTags(
  review: MediaReview,
  item: ReviewItem,
  action: VideoReviewAction,
) {
  if (item.occurrence && review.entityType === "performerOccurrence")
    await runOccurrenceAction(review, item.occurrence, action);
  else await runReviewAction(action, [item.video.id]);
}
export async function actionTagIds(action: VideoReviewAction) {
  return [
    ...new Set(
      (
        await Promise.all(
          action.steps.map((s) =>
            s.mode === "REMOVE_TREE" ? resolveTagTree(s.tagIds) : s.tagIds,
          ),
        )
      ).flat(),
    ),
  ];
}
export function undoOperation(
  item: ReviewItem,
  before: TagState,
  after: TagState,
  touched: number[],
): UndoOperation {
  const only = (ids: number[]) => ids.filter((id) => touched.includes(id));
  return {
    item,
    before,
    after,
    tags: difference(only(before.ids), only(after.ids)),
    absence: difference(only(before.absent), only(after.absent)),
  };
}
export function checkUndo(operation: UndoOperation, current: TagState) {
  for (const [delta, ids] of [
    [operation.tags, current.ids],
    [operation.absence, current.absent],
  ] as const) {
    if (
      delta.added.some((id) => !ids.includes(id)) ||
      delta.removed.some((id) => ids.includes(id))
    )
      throw new Error(
        "Undo conflict: affected tags changed since this operation. Inspect the item; no undo changes were made.",
      );
  }
  if (current.applications) {
    for (const id of operation.tags.added) {
      const expected = operation.after.applications
        ?.filter((a) => a.tag.id === id)
        .map((a) => a.id)
        .sort();
      const actual = current.applications
        .filter((a) => a.tag.id === id)
        .map((a) => a.id)
        .sort();
      if (JSON.stringify(expected) !== JSON.stringify(actual))
        throw new Error(
          "Undo conflict: an affected occurrence application changed. No undo changes were made.",
        );
    }
  }
}
export async function undoTags(review: MediaReview, operation: UndoOperation) {
  const current = await readTags(operation.item);
  checkUndo(operation, current);
  // Custom-field changes require the video update API; retain all other fields.
  if (operation.absence.added.length || operation.absence.removed.length) {
    const video = await readVideo(operation.item.video.id);
    const latest = await readTags(operation.item);
    const absentKey =
      Object.keys(video.customFields ?? {}).find(
        (key) => key.toLowerCase() === CONFIRMED_ABSENT_TAGS_KEY,
      ) ?? CONFIRMED_ABSENT_TAGS_KEY;
    checkUndo(operation, latest);
    await request(`/api/videos/${video.id}`, {
      method: "PUT",
      body: JSON.stringify({
        tagIds: [
          ...latest.ids.filter((id) => !operation.tags.added.includes(id)),
          ...operation.tags.removed,
        ],
        customFields: {
          ...video.customFields,
          [absentKey]: [
            ...latest.absent.filter(
              (id) => !operation.absence.added.includes(id),
            ),
            ...operation.absence.removed,
          ],
        },
      }),
    });
  } else
    await editTags(review, operation.item, {
      added: operation.tags.removed,
      removed: operation.tags.added,
    });
}
