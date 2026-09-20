import {
  CONFIRMED_ABSENT_TAGS_KEY,
  mediaCollection,
  occurrenceAbsentTagIds,
  request,
  readMedia,
  runReviewAction,
  type MediaItem,
} from "./api";
import {
  runOccurrenceAction,
  saveOccurrenceTags,
  type Occurrence,
  type OccurrenceApplication,
} from "./occurrences";
import {
  isOccurrenceReview,
  reviewMediaKind,
  type MediaKind,
  type MediaReview,
  type MediaReviewAction,
} from "./model";
export interface ReviewItem {
  key: string;
  media: MediaItem;
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
function path(kind: MediaKind, item: ReviewItem) {
  return `/api/tagapplications?hostType=${kind}&hostId=${item.media.id}&contextType=performer&contextId=${item.occurrence!.performer.id}`;
}
// Batches only change tags, so they skip the media read that occurrence absences need.
export async function readTags(
  kind: MediaKind,
  item: ReviewItem,
  withAbsence = true,
): Promise<TagState> {
  if (item.occurrence) {
    const absent = withAbsence
      ? occurrenceAbsentTagIds(
          await readMedia(kind, item.media.id),
          item.occurrence.performer.id,
        )
      : [];
    const applications = (
      await request<OccurrenceApplication[]>(path(kind, item))
    ).filter(
      (a) =>
        a.hostType === kind &&
        a.hostId === item.media.id &&
        a.contextType === "performer" &&
        a.contextId === item.occurrence!.performer.id,
    );
    return {
      ids: [...new Set(applications.map((a) => a.tag.id))],
      names: [...new Set(applications.map((a) => a.tag.name))],
      absent,
      applications,
    };
  }
  const media = await readMedia(kind, item.media.id);
  const tags = (media.tags ?? []).filter(
    (t) => t.canRemove !== false || t.isDerived !== true,
  );
  const absentKey =
    Object.keys(media.customFields ?? {}).find(
      (key) => key.toLowerCase() === CONFIRMED_ABSENT_TAGS_KEY,
    ) ?? CONFIRMED_ABSENT_TAGS_KEY;
  const absent = media.customFields?.[absentKey] ?? [];
  if (!Array.isArray(absent) || absent.some((id) => !Number.isSafeInteger(id)))
    throw new Error(
      `Confirmed absent tags are invalid. Inspect the ${kind} before editing.`,
    );
  return { ids: tags.map((t) => t.id), names: tags.map((t) => t.name), absent };
}
export async function editTags(
  review: MediaReview,
  item: ReviewItem,
  change: TagChange,
) {
  if (item.occurrence && isOccurrenceReview(review)) {
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
        await request(
          `/api/${mediaCollection(reviewMediaKind(review))}/bulk`,
          {
            method: "POST",
            body: JSON.stringify({ ids: [item.media.id], tagMode, tagIds }),
          },
        );
    }
  }
}
export async function applyTags(
  review: MediaReview,
  item: ReviewItem,
  action: MediaReviewAction,
) {
  if (item.occurrence && isOccurrenceReview(review))
    await runOccurrenceAction(review, item.occurrence, action);
  else
    await runReviewAction(reviewMediaKind(review), action, [item.media.id]);
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
