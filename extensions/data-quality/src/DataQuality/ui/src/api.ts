import { extensionFetch } from "@cove/runtime/api";
import type {
  ReviewAction,
  TagReview,
  TagReviewAction,
  VideoReview,
  VideoReviewAction,
} from "./model";
import { hasAssessmentSteps, validAction, boundedFilter } from "./model";

export const CONFIRMED_ABSENT_TAGS_KEY = "confirmed_absent_tags";
const CONFIRMED_ABSENT_TAGS_LABEL = "Confirmed absent tags";

interface CustomFieldDefinition {
  key: string;
  label?: string;
  type: string;
  entityTypes: string[];
  filterable: boolean;
  isMultiValue: boolean;
}

export type ConfirmedAbsentTagsFieldStatus =
  | { kind: "ready"; definition: CustomFieldDefinition; message: "" }
  | { kind: "missing" | "incompatible"; message: string };

export interface VideoFile {
  id: number;
  basename: string;
  format?: string;
  width?: number;
  height?: number;
  duration?: number;
  audioCodec?: string;
}

export interface Video {
  id: number;
  title?: string;
  details?: string;
  date?: string;
  studioId?: number;
  studioName?: string;
  tags?: Array<{
    id: number;
    name: string;
    isDerived?: boolean;
    canRemove?: boolean;
  }>;
  customFields?: Record<string, unknown> | null;
  performers: Array<{
    id: number;
    name: string;
    imagePath?: string | null;
  }>;
  groups?: Array<{ id: number; name: string }>;
  galleries?: Array<{ id: number; title?: string }>;
  organized?: boolean;
  urls?: string[];
  files: VideoFile[];
  createdAt?: string;
  updatedAt: string;
  parentVideoId?: number | null;
  clipStartSec?: number | null;
  clipEndSec?: number | null;
}

export interface VideoPage {
  items: Video[];
  totalCount: number;
}

export interface Tag {
  id: number;
  name: string;
  description?: string;
  imagePath?: string;
  favorite: boolean;
  organized: boolean;
  tagGroupId?: number | null;
  tagGroupName?: string | null;
  tagGroupColor?: string | null;
  aliases: string[];
  videoCount?: number;
  segmentCount?: number;
  imageCount?: number;
  galleryCount?: number;
  groupCount?: number;
  performerCount?: number;
  studioCount?: number;
  audioCount?: number;
  textCount?: number;
}

export interface TagPage {
  items: Tag[];
  totalCount: number;
}

export interface TagGroup {
  id: number;
  name: string;
  description?: string | null;
  color?: string | null;
  sortOrder: number;
  tagCount: number;
}

const MODIFIERS: Record<string, string> = {
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  GREATER_THAN: "greaterThan",
  LESS_THAN: "lessThan",
  INCLUDES: "includes",
  EXCLUDES: "excludes",
  INCLUDES_ALL: "includesAll",
  EXCLUDES_ALL: "excludesAll",
  IS_NULL: "isNull",
  NOT_NULL: "notNull",
  BETWEEN: "between",
  NOT_BETWEEN: "notBetween",
  MATCHES_REGEX: "matchesRegex",
  NOT_MATCHES_REGEX: "notMatchesRegex",
  UNDER_PATH: "underPath",
  NOT_UNDER_PATH: "notUnderPath",
};

function normalizeCriteria(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeCriteria);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        key === "modifier" && typeof entry === "string"
          ? (MODIFIERS[entry] ?? entry)
          : key === "key" &&
              typeof entry === "string" &&
              entry.toLowerCase() === CONFIRMED_ABSENT_TAGS_KEY.toLowerCase()
            ? entry.toLowerCase()
            : normalizeCriteria(entry),
      ]),
    );
  }
  return value;
}

export async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (!(options.body instanceof FormData) && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await extensionFetch(path, { ...options, headers });
  if (!response.ok) {
    let message = response.statusText || `Request failed (${response.status}).`;
    try {
      const body = (await response.json()) as {
        message?: string;
        detail?: string;
        error?: string;
      };
      message = body.message || body.detail || body.error || message;
    } catch {
      // Keep the status message when the response is not JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204 || response.status === 205) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export {
  loadReviews,
  saveReviews,
  loadProgress,
  saveProgress,
} from "./storage";

export async function findVideos(
  review: VideoReview,
  filter: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const objectFilter = { ...review.view.objectFilter };
  const filterExpression = objectFilter._filterExpression;
  delete objectFilter._filterExpression;
  delete objectFilter.includeCompilationGroups;
  if (
    review.view.searchMode === "visual" &&
    typeof filter.q === "string" &&
    filter.q.trim()
  ) {
    throw new Error(
      "Visual similarity review searches are not available to extensions yet.",
    );
  }
  return request<VideoPage>("/api/videos/find", {
    method: "POST",
    signal,
    body: JSON.stringify(
      normalizeCriteria({
        findFilter: boundedFilter(filter),
        objectFilter,
        filterExpression,
      }),
    ),
  });
}

export async function findTags(
  review: TagReview,
  filter: Record<string, unknown>,
  signal?: AbortSignal,
) {
  const objectFilter = { ...review.view.objectFilter };
  delete objectFilter._filterExpression;
  return request<TagPage>("/api/tags/find", {
    method: "POST",
    signal,
    body: JSON.stringify(
      normalizeCriteria({
        findFilter: boundedFilter(filter),
        objectFilter,
      }),
    ),
  });
}

export function listTagGroups(signal?: AbortSignal): Promise<TagGroup[]> {
  return request<TagGroup[]>("/api/taggroups", { signal });
}

export function videoCoverUrl(video: Video): string {
  return `/api/videos/${video.id}/image?max=1280&v=${encodeURIComponent(video.updatedAt)}`;
}

export function videoStreamUrl(videoId: number): string {
  return `/api/stream/video/${videoId}`;
}

export function videoScreenshotUrl(video: Video): string {
  return `/api/stream/video/${video.id}/screenshot?v=${encodeURIComponent(video.updatedAt)}`;
}

export function videoPreviewUrl(videoId: number): string {
  return `/api/stream/video/${videoId}/preview`;
}

export function videoPreviewStatusUrl(videoId: number): string {
  return `/api/stream/video/${videoId}/preview/status`;
}

// Cove's public filtered-query endpoint caches an identical request for one second.
// No public invalidation/conditional-read API exists. Keep the action pending until
// that cache expires, including after partial failure, before refreshing membership.
export function settleReviewWrites(action: ReviewAction): Promise<void> {
  return "steps" in action && action.steps.length
    ? new Promise((resolve) => window.setTimeout(resolve, 1100))
    : Promise.resolve();
}

export async function resolveTagTree(parentIds: number[]): Promise<number[]> {
  const ids = new Set<number>();
  for (const parentId of parentIds) {
    await request(`/api/tags/${parentId}`);
    ids.add(parentId);
    for (let page = 1; ; page++) {
      const result = await request<{
        items: Array<{ id: number }>;
        totalCount: number;
      }>("/api/tags/find", {
        method: "POST",
        body: JSON.stringify(
          normalizeCriteria({
            findFilter: { page, perPage: 1000, sort: "id", direction: "asc" },
            objectFilter: {
              parentsCriterion: {
                value: [parentId],
                modifier: "INCLUDES",
                depth: -1,
              },
            },
          }),
        ),
      });
      for (const tag of result.items) ids.add(tag.id);
      if (page * 1000 >= result.totalCount) break;
      if (!result.items.length)
        throw new Error(
          "Tag hierarchy paging ended before all descendants were loaded.",
        );
    }
  }
  return [...ids];
}

function definitionProblem(definition: CustomFieldDefinition): string {
  const problems: string[] = [];
  if (definition.type !== "tag") problems.push('type "tag"');
  if (!definition.isMultiValue) problems.push("multiple values enabled");
  if (!definition.entityTypes.includes("video"))
    problems.push("video applicability");
  if (!definition.filterable) problems.push("filtering enabled");
  return problems.length
    ? `The ${CONFIRMED_ABSENT_TAGS_KEY} custom field is incompatible. It must have ${problems.join(", ")}.`
    : "";
}

export async function getConfirmedAbsentTagsFieldStatus(): Promise<ConfirmedAbsentTagsFieldStatus> {
  const definitions =
    await request<CustomFieldDefinition[]>("/api/custom-fields");
  const definition = definitions.find(
    (item) =>
      item.key.toLowerCase() === CONFIRMED_ABSENT_TAGS_KEY.toLowerCase(),
  );
  if (!definition)
    return {
      kind: "missing",
      message: `Create the ${CONFIRMED_ABSENT_TAGS_LABEL} custom field before applying tag assessments.`,
    };
  const message = definitionProblem(definition);
  return message
    ? { kind: "incompatible", message }
    : { kind: "ready", definition, message: "" };
}

export async function createConfirmedAbsentTagsField(): Promise<void> {
  const status = await getConfirmedAbsentTagsFieldStatus();
  if (status.kind === "ready") return;
  if (status.kind === "incompatible") throw new Error(status.message);
  await request("/api/custom-fields", {
    method: "POST",
    body: JSON.stringify({
      key: CONFIRMED_ABSENT_TAGS_KEY,
      label: CONFIRMED_ABSENT_TAGS_LABEL,
      type: "tag",
      entityTypes: ["video"],
      filterable: true,
      sortable: false,
      isMultiValue: true,
    }),
  });
}

function uniqueIds(ids: readonly number[]): number[] {
  return [...new Set(ids)];
}

function customFieldTagIds(value: unknown): number[] {
  if (value == null) return [];
  if (
    !Array.isArray(value) ||
    value.some((id) => !Number.isSafeInteger(id) || Number(id) <= 0)
  )
    throw new Error(
      `The ${CONFIRMED_ABSENT_TAGS_KEY} value is not a valid tag list.`,
    );
  return uniqueIds(value as number[]);
}

function directlyAssignedTagIds(video: Video): number[] {
  return uniqueIds(
    (video.tags ?? [])
      .filter((tag) => tag.canRemove !== false || tag.isDerived !== true)
      .map((tag) => tag.id),
  );
}

async function runAssessmentAction(
  action: VideoReviewAction,
  ids: number[],
): Promise<void> {
  let status: ConfirmedAbsentTagsFieldStatus;
  try {
    status = await getConfirmedAbsentTagsFieldStatus();
  } catch (error) {
    throw new Error(
      `Could not verify the ${CONFIRMED_ABSENT_TAGS_LABEL} custom field. ${error instanceof Error ? error.message : "Request failed."}`,
    );
  }
  if (status.kind !== "ready") throw new Error(status.message);

  const resolvedSteps = await Promise.all(
    action.steps.map(async (step) => ({
      ...step,
      tagIds:
        step.mode === "REMOVE_TREE"
          ? await resolveTagTree(step.tagIds)
          : uniqueIds(step.tagIds),
    })),
  );
  const legacySteps = resolvedSteps.filter((step) =>
    ["ADD", "REMOVE", "REMOVE_TREE"].includes(step.mode),
  );
  const assessmentSteps = resolvedSteps.filter((step) =>
    ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(step.mode),
  );
  const targets = uniqueIds(ids);
  const fieldKey = status.definition.key;
  let completed = 0;
  for (const id of targets) {
    try {
      const video = await request<Video>(`/api/videos/${id}`);
      const originalTagIds = directlyAssignedTagIds(video);
      const originalCustomFields = { ...(video.customFields ?? {}) };
      const rawAbsent = originalCustomFields[fieldKey];
      const originalAbsentIds = customFieldTagIds(rawAbsent);
      const tagIds = new Set(originalTagIds);
      const absentIds = new Set(originalAbsentIds);

      for (const step of legacySteps) {
        for (const tagId of step.tagIds) {
          if (step.mode === "ADD") tagIds.add(tagId);
          else tagIds.delete(tagId);
        }
      }
      for (const step of assessmentSteps) {
        for (const tagId of step.tagIds) {
          if (step.mode === "MARK_PRESENT") {
            tagIds.add(tagId);
            absentIds.delete(tagId);
          } else if (step.mode === "MARK_ABSENT") {
            tagIds.delete(tagId);
            absentIds.add(tagId);
          } else {
            absentIds.delete(tagId);
          }
        }
      }

      const nextTagIds = [...tagIds];
      const nextAbsentIds = [...absentIds];
      const unchanged =
        JSON.stringify(originalTagIds) === JSON.stringify(nextTagIds) &&
        JSON.stringify(originalAbsentIds) === JSON.stringify(nextAbsentIds) &&
        (rawAbsent === undefined
          ? nextAbsentIds.length === 0
          : JSON.stringify(rawAbsent) === JSON.stringify(originalAbsentIds));
      if (!unchanged) {
        await request(`/api/videos/${id}`, {
          method: "PUT",
          body: JSON.stringify({
            tagIds: nextTagIds,
            customFields: {
              ...originalCustomFields,
              [fieldKey]: nextAbsentIds,
            },
          }),
        });
      }
      completed++;
    } catch (error) {
      throw new Error(
        `Assessment stopped after ${completed} video${completed === 1 ? "" : "s"} completed; video ${id} was affected. Refresh and inspect it before retrying. ${error instanceof Error ? error.message : "Request failed."}`,
      );
    }
  }
}

export async function runReviewAction(
  action: VideoReviewAction,
  ids: number[],
): Promise<void> {
  if (
    !validAction(action) ||
    ids.length === 0 ||
    ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
  ) {
    throw new Error("Choose videos and configure a valid action first.");
  }
  if (hasAssessmentSteps(action)) {
    await runAssessmentAction(action, ids);
    return;
  }
  const steps = await Promise.all(
    action.steps.map(async (step) => ({
      mode: step.mode === "ADD" ? "ADD" : "REMOVE",
      tagIds:
        step.mode === "REMOVE_TREE"
          ? await resolveTagTree(step.tagIds)
          : step.tagIds,
    })),
  );
  for (let index = 0; index < steps.length; index++) {
    try {
      await request("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify({
          ids: [...ids],
          tagIds: [...steps[index].tagIds],
          tagMode: steps[index].mode,
        }),
      });
    } catch (error) {
      throw new Error(
        `Step ${index + 1} failed; ${index} earlier step(s) completed. Refresh and check the selected videos before retrying. ${error instanceof Error ? error.message : "Request failed."}`,
      );
    }
  }
}

export async function runTagReviewAction(
  action: TagReviewAction,
  ids: number[],
): Promise<void> {
  if (
    !validAction(action, "tag") ||
    ids.length === 0 ||
    ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
  ) {
    throw new Error("Choose tags and configure a valid action first.");
  }
  if (action.effect.mode === "SKIP") return;
  await request("/api/tags/bulk", {
    method: "POST",
    body: JSON.stringify(
      action.effect.mode === "SET_TAG_GROUP"
        ? { ids: [...new Set(ids)], tagGroupId: action.effect.tagGroupId }
        : { ids: [...new Set(ids)], clearFields: ["tagGroupId"] },
    ),
  });
}
