import {
  findVideos,
  normalizeCriteria,
  request,
  readVideo,
  resolveTagTree,
  type Video,
  type Tag,
} from "./api";
import {
  validAction,
  type OccurrenceReview,
  type VideoReview,
  type VideoReviewAction,
} from "./model";

export interface OccurrenceApplication {
  id: number;
  hostType: string;
  hostId: number;
  contextType?: string | null;
  contextId?: number | null;
  tag: Pick<Tag, "id" | "name">;
}
export interface Occurrence {
  key: string;
  video: Video;
  performer: Video["performers"][number];
  applications: OccurrenceApplication[];
}
export type OccurrenceOutcome = "reviewed" | "cannotDetermine";

export async function runOccurrenceAction(
  review: OccurrenceReview,
  occurrence: Occurrence,
  action: VideoReviewAction,
): Promise<OccurrenceApplication[]> {
  if (
    !validAction(action) ||
    action.steps.some(
      (step) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(step.mode),
    )
  )
    throw new Error("Configure an occurrence tag action first.");
  if (!action.steps.length) return occurrence.applications;
  const steps = await Promise.all(
    action.steps.map(async (step) => ({
      ...step,
      tagIds:
        step.mode === "REMOVE_TREE"
          ? await resolveTagTree(step.tagIds)
          : step.tagIds,
    })),
  );
  let applications = occurrence.applications;
  for (const step of steps) {
    applications = await saveOccurrenceTags(
      {
        ...review,
        occurrence: {
          ...review.occurrence,
          tagIds: step.tagIds,
          multiple: true,
        },
      },
      occurrence,
      step.mode === "ADD" ? step.tagIds : [],
    );
  }
  return applications;
}

export async function resolvePerformers(
  review: OccurrenceReview,
  signal?: AbortSignal,
): Promise<number[] | null> {
  const settings = review.occurrence;
  if (settings.targetMode === "all" || (settings.targetMode === "filter" && Object.keys(settings.performerFilter).length === 0)) return null;
  if (settings.targetMode === "selected") return settings.performerIds;
  const ids = new Set<number>();
  const { _filterExpression: filterExpression, ...objectFilter } =
    settings.performerFilter;
  for (let page = 1; ; page++) {
    const result = await request<{
      items: { id: number }[];
      totalCount: number;
    }>("/api/performers/find", {
      method: "POST",
      signal,
      body: JSON.stringify(
        normalizeCriteria({
          findFilter: { page, perPage: 1000, sort: "id", direction: "asc" },
          objectFilter,
          filterExpression,
        }),
      ),
    });
    result.items.forEach((item) => ids.add(item.id));
    if (page * 1000 >= result.totalCount) return [...ids];
    if (!result.items.length)
      throw new Error("Performer paging ended before all targets were loaded.");
  }
}

// Retain the scene expression and AND it with a separate, same-link target clause.
export function occurrenceSceneReview(
  review: OccurrenceReview,
  performerIds: number[] | null,
): VideoReview {
  const { _filterExpression, ...sceneFilter } = review.view.objectFilter;
  const settings = review.occurrence;
  const performerFilterCriterion = {
    mode: "atLeastOne",
    conditionOperator: "and",
    ...(performerIds === null
      ? {}
      : {
          performerIdsCriterion: { modifier: "includes", value: performerIds },
        }),
    ...(settings.condition === "any"
      ? {}
      : {
          performerOccurrenceTagsCriterion: {
            modifier: settings.condition,
            value: settings.conditionTagIds,
          },
        }),
  };
  return {
    ...review,
    entityType: "video",
    actions: [],
    view: {
      ...review.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...(_filterExpression ? [{ group: _filterExpression }] : []),
            { filter: sceneFilter },
            { filter: { performerFilterCriterion } },
          ],
        },
      },
    },
  };
}

export function occurrenceMatches(
  settings: OccurrenceReview["occurrence"],
  tagIds: number[],
): boolean {
  const tags = new Set(tagIds);
  switch (settings.condition) {
    case "any":
      return true;
    case "isNull":
      return tags.size === 0;
    case "includes":
      return settings.conditionTagIds.some((id) => tags.has(id));
    case "includesAll":
      return settings.conditionTagIds.every((id) => tags.has(id));
    case "excludes":
      return settings.conditionTagIds.every((id) => !tags.has(id));
  }
}

export async function loadOccurrencePage(
  review: OccurrenceReview,
  performerIds: number[] | null,
  page: number,
  signal?: AbortSignal,
) {
  if (performerIds?.length === 0)
    return { items: [] as Occurrence[], totalCount: 0 };
  const result = await findVideos(
    occurrenceSceneReview(review, performerIds),
    { ...review.view.filter, page },
    signal,
  );
  const allowed = performerIds === null ? null : new Set(performerIds);
  const items: Occurrence[][] = new Array(result.items.length);
  // Limit concurrent reads. Only the displayed scene page needs occurrence data.
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, result.items.length) }, async () => {
      while (next < result.items.length) {
        const index = next++;
        const video = result.items[index];
        const applications = await request<OccurrenceApplication[]>(
          `/api/tagapplications?hostType=video&hostId=${video.id}&contextType=performer`,
          { signal },
        );
        items[index] = video.performers
          .filter((performer) => allowed === null || allowed.has(performer.id))
          .flatMap((performer) => {
            const own = applications.filter(
              (application) =>
                application.hostType === "video" &&
                application.hostId === video.id &&
                application.contextType === "performer" &&
                application.contextId === performer.id,
            );
            return occurrenceMatches(
              review.occurrence,
              own.map((item) => item.tag.id),
            )
              ? [
                  {
                    key: `${video.id}:${performer.id}`,
                    video,
                    performer,
                    applications: own,
                  },
                ]
              : [];
          });
      }
    }),
  );
  return { items: items.flat(), totalCount: result.totalCount };
}

export async function saveOccurrenceTags(
  review: OccurrenceReview,
  occurrence: Occurrence,
  selected: number[],
): Promise<OccurrenceApplication[]> {
  const configured = new Set(review.occurrence.tagIds);
  if (
    selected.some((id) => !configured.has(id)) ||
    (!review.occurrence.multiple && selected.length > 1)
  )
    throw new Error("Choose only the configured tags for this review.");
  // Read again before writing, so unrelated changes are preserved and removed links fail safely.
  const video = await readVideo(occurrence.video.id);
  if (
    !video.performers.some(
      (performer) => performer.id === occurrence.performer.id,
    )
  )
    throw new Error(
      "This performer is no longer linked to the scene. Refresh the queue.",
    );
  const path = `/api/tagapplications?hostType=video&hostId=${video.id}&contextType=performer&contextId=${occurrence.performer.id}`;
  const applications = (await request<OccurrenceApplication[]>(path)).filter(
    (application) =>
      application.hostType === "video" &&
      application.hostId === video.id &&
      application.contextType === "performer" &&
      application.contextId === occurrence.performer.id,
  );
  const desired = new Set(selected);
  try {
    for (const tagId of desired) {
      if (!applications.some((item) => item.tag.id === tagId))
        await request("/api/tagapplications", {
          method: "POST",
          body: JSON.stringify({
            hostType: "video",
            hostId: video.id,
            contextType: "performer",
            contextId: occurrence.performer.id,
            tagId,
            sourceKey: "user",
          }),
        });
    }
    for (const application of applications) {
      if (
        configured.has(application.tag.id) &&
        !desired.has(application.tag.id)
      )
        await request(`/api/tagapplications/${application.id}`, {
          method: "DELETE",
        });
    }
    return await request<OccurrenceApplication[]>(path);
  } catch (error) {
    throw new Error(
      `Saving stopped; some tag changes may have been applied. Your choices are kept. Retry to finish saving. ${error instanceof Error ? error.message : "Request failed."}`,
    );
  }
}
