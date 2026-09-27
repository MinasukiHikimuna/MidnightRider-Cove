import {
  CONFIRMED_ABSENT_OCCURRENCE_TAGS_KEY,
  findMedia,
  occurrenceAbsentTagIds,
  requireOccurrenceAbsenceField,
  setOccurrenceAbsence,
  normalizeCriteria,
  request,
  readMedia,
  resolveRemovalTrees,
  resolveTagTree,
  type MediaItem,
  type Tag,
} from "./api";
import {
  conditionSeeksMissingTags,
  isAssessmentMode,
  reviewMediaKind,
  targetsAllPerformers,
  validAction,
  type MediaReview,
  type OccurrenceReview,
  type MediaReviewAction,
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
  media: MediaItem;
  performer: MediaItem["performers"][number];
  applications: OccurrenceApplication[];
}
export type OccurrenceOutcome = "reviewed" | "cannotDetermine";

export async function runOccurrenceAction(
  review: OccurrenceReview,
  occurrence: Occurrence,
  action: MediaReviewAction,
): Promise<OccurrenceApplication[]> {
  if (!validAction(action))
    throw new Error("Configure an occurrence tag action first.");
  if (!action.steps.length) return occurrence.applications;
  const kind = reviewMediaKind(review);
  // Verified before any write, so a missing field cannot strand a half-applied assessment.
  const absenceFieldKey = action.steps.some((step) => isAssessmentMode(step.mode))
    ? await requireOccurrenceAbsenceField(kind)
    : "";
  const steps = await resolveRemovalTrees(action);
  let applications = occurrence.applications;
  // Plain steps run before assessments, matching the order video reviews use.
  for (const step of [
    ...steps.filter((step) => !isAssessmentMode(step.mode)),
    ...steps.filter((step) => isAssessmentMode(step.mode)),
  ]) {
    // Order each pair of writes so a failure in between leaves an unassessed occurrence,
    // never a recorded absence that contradicts the occurrence's tags.
    const absence = (mode: "ADD" | "REMOVE") =>
      setOccurrenceAbsence(
        absenceFieldKey,
        kind,
        occurrence.media.id,
        occurrence.performer.id,
        step.tagIds,
        mode,
      );
    if (step.mode === "MARK_PRESENT" || step.mode === "CLEAR_ABSENCE")
      await absence("REMOVE");
    if (step.mode !== "CLEAR_ABSENCE")
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
        ["ADD", "MARK_PRESENT"].includes(step.mode) ? step.tagIds : [],
      );
    if (step.mode === "MARK_ABSENT") await absence("ADD");
  }
  return applications;
}

export async function resolvePerformers(
  review: OccurrenceReview,
  signal?: AbortSignal,
): Promise<number[] | null> {
  const settings = review.occurrence;
  if (targetsAllPerformers(settings)) return null;
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

function hidesConfirmedAbsent(settings: OccurrenceReview["occurrence"]) {
  return (
    conditionSeeksMissingTags(settings.condition) &&
    settings.hideConfirmedAbsent !== false
  );
}

// Retain the host expression and AND it with a separate, same-link target clause.
export function occurrenceSceneReview(
  review: OccurrenceReview,
  performerIds: number[] | null,
): MediaReview {
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
            depth: settings.includeSubtags === false ? 0 : -1,
          },
        }),
  };
  // "No value equals" lets Cove drop answered scenes itself, keeping pages full. It is only
  // exact for one performer and one tag, where missing that tag is the whole condition: a scene
  // with two targets, or a rule with two tags, may still hold an unanswered occurrence, so those
  // cases are hidden per occurrence instead.
  const answeredPair =
    hidesConfirmedAbsent(settings) &&
    performerIds?.length === 1 &&
    settings.conditionTagIds.length === 1
      ? `${performerIds[0]}:${settings.conditionTagIds[0]}`
      : null;
  return {
    ...review,
    entityType: reviewMediaKind(review),
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
            ...(answeredPair
              ? [
                  {
                    filter: {
                      customFieldCriteria: [
                        {
                          key: CONFIRMED_ABSENT_OCCURRENCE_TAGS_KEY,
                          type: "text",
                          modifier: "notEquals",
                          value: answeredPair,
                        },
                      ],
                    },
                  },
                ]
              : []),
          ],
        },
      },
    },
  };
}

/**
 * Each selected condition tag with its subtree when subtags are included; each group answers the
 * condition on its own, so "all" and "missing at least one" count roots, not descendants.
 */
export async function resolveConditionGroups(
  settings: OccurrenceReview["occurrence"],
  signal?: AbortSignal,
): Promise<number[][]> {
  if (["any", "isNull"].includes(settings.condition)) return [];
  return settings.includeSubtags === false
    ? settings.conditionTagIds.map((id) => [id])
    : Promise.all(
        settings.conditionTagIds.map((id) => resolveTagTree([id], signal)),
      );
}

/** "Has any" or "missing at least one" of no tags matches nothing, whatever Cove returns. */
export function conditionCannotMatch(
  settings: OccurrenceReview["occurrence"],
): boolean {
  return (
    ["includes", "excludesAll"].includes(settings.condition) &&
    !settings.conditionTagIds.length
  );
}

export function occurrenceMatches(
  settings: OccurrenceReview["occurrence"],
  tagIds: number[],
  conditionTagGroups: number[][] = settings.conditionTagIds.map((id) => [id]),
): boolean {
  const tags = new Set(tagIds);
  const matchesGroup = (group: number[]) => group.some((id) => tags.has(id));
  switch (settings.condition) {
    case "any":
      return true;
    case "isNull":
      return tags.size === 0;
    case "includes":
      return conditionTagGroups.some(matchesGroup);
    case "includesAll":
      return conditionTagGroups.every(matchesGroup);
    case "excludes":
      return !conditionTagGroups.some(matchesGroup);
    case "excludesAll":
      return !conditionTagGroups.every(matchesGroup);
  }
}

/**
 * An occurrence already answered "absent" for every condition tag it misses has nothing left to
 * review. Cove cannot filter on a per-performer pair, so it is hidden here. For "has none of"
 * that is every condition tag; for "missing at least one" only the tags it actually lacks.
 */
function confirmedAbsent(
  settings: OccurrenceReview["occurrence"],
  media: MediaItem,
  performerId: number,
  tagIds: number[],
  conditionTagGroups: number[][],
): boolean {
  if (!hidesConfirmedAbsent(settings)) return false;
  const absent = occurrenceAbsentTagIds(media, performerId);
  return settings.conditionTagIds.every(
    (id, index) =>
      absent.includes(id) ||
      conditionTagGroups[index].some((tag) => tagIds.includes(tag)),
  );
}

export async function loadOccurrencePage(
  review: OccurrenceReview,
  performerIds: number[] | null,
  page: number,
  signal?: AbortSignal,
) {
  // Cove ignores an empty tag list, so without this every scene page would be read and emptied.
  if (performerIds?.length === 0 || conditionCannotMatch(review.occurrence))
    return { items: [] as Occurrence[], totalCount: 0 };
  const kind = reviewMediaKind(review);
  const result = await findMedia(
    occurrenceSceneReview(review, performerIds),
    { ...review.view.filter, page },
    signal,
  );
  const allowed = performerIds === null ? null : new Set(performerIds);
  // Resolve once per host page, shared by all performers.
  const settings = review.occurrence;
  const conditionTagGroups = result.items.length
    ? await resolveConditionGroups(settings, signal)
    : [];
  const items: Occurrence[][] = new Array(result.items.length);
  // Limit concurrent reads. Only the displayed host page needs occurrence data.
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, result.items.length) }, async () => {
      while (next < result.items.length) {
        const index = next++;
        const media = result.items[index];
        const applications = await request<OccurrenceApplication[]>(
          `/api/tagapplications?hostType=${kind}&hostId=${media.id}&contextType=performer`,
          { signal },
        );
        items[index] = media.performers
          .filter((performer) => allowed === null || allowed.has(performer.id))
          .flatMap((performer) => {
            const own = applications.filter(
              (application) =>
                application.hostType === kind &&
                application.hostId === media.id &&
                application.contextType === "performer" &&
                application.contextId === performer.id,
            );
            const tagIds = own.map((item) => item.tag.id);
            return occurrenceMatches(review.occurrence, tagIds, conditionTagGroups) &&
              !confirmedAbsent(settings, media, performer.id, tagIds, conditionTagGroups)
              ? [
                  {
                    key: `${media.id}:${performer.id}`,
                    media,
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
  const kind = reviewMediaKind(review);
  // Read again before writing, so unrelated changes are preserved and removed links fail safely.
  const media = await readMedia(kind, occurrence.media.id);
  if (
    !media.performers.some(
      (performer) => performer.id === occurrence.performer.id,
    )
  )
    throw new Error(
      `This performer is no longer linked to the ${kind}. Refresh the queue.`,
    );
  const path = `/api/tagapplications?hostType=${kind}&hostId=${media.id}&contextType=performer&contextId=${occurrence.performer.id}`;
  const applications = (await request<OccurrenceApplication[]>(path)).filter(
    (application) =>
      application.hostType === kind &&
      application.hostId === media.id &&
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
            hostType: kind,
            hostId: media.id,
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
