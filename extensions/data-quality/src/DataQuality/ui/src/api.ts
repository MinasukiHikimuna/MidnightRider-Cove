import { extensionFetch } from "@cove/runtime/api";
import type {
  ReviewAction,
  TagReview,
  TagReviewAction,
  VideoReview,
  VideoReviewAction,
} from "./model";
import {
  hasAssessmentSteps,
  isAssessmentMode,
  validAction,
  boundedFilter,
} from "./model";

export const CONFIRMED_ABSENT_TAGS_KEY = "confirmed_absent_tags";
const CONFIRMED_ABSENT_TAGS_LABEL = "Confirmed absent tags";
// Custom fields attach to whole entities, so a performer occurrence cannot own one. Its
// confirmed absences live on the video as "<performerId>:<tagId>" text values instead.
export const CONFIRMED_ABSENT_OCCURRENCE_TAGS_KEY =
  "confirmed_absent_occurrence_tags";

interface AbsenceField {
  key: string;
  label: string;
  type: "tag" | "text";
  subject: string;
}
const VIDEO_ABSENCE_FIELD: AbsenceField = {
  key: CONFIRMED_ABSENT_TAGS_KEY,
  label: CONFIRMED_ABSENT_TAGS_LABEL,
  type: "tag",
  subject: "tag assessments",
};
const OCCURRENCE_ABSENCE_FIELD: AbsenceField = {
  key: CONFIRMED_ABSENT_OCCURRENCE_TAGS_KEY,
  label: "Confirmed absent occurrence tags",
  type: "text",
  subject: "occurrence tag assessments",
};

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

export function normalizeCriteria(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalizeCriteria);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [
        key,
        key === "modifier" && typeof entry === "string"
          ? (MODIFIERS[entry] ?? entry)
          : key === "key" &&
              typeof entry === "string" &&
              [
                CONFIRMED_ABSENT_TAGS_KEY,
                CONFIRMED_ABSENT_OCCURRENCE_TAGS_KEY,
              ].includes(entry.toLowerCase())
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

// Video detail GETs use Cove's one-second output cache, varied by query.
// Mutations and conflict checks need fresh membership rather than a cached snapshot.
const detailReadPrefix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
let detailReadSequence = 0;
export function readVideo(id: number): Promise<Video> {
  return request<Video>(`/api/videos/${id}?dqRead=${detailReadPrefix}-${++detailReadSequence}`, { cache: "no-store" });
}

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

export async function resolveTagTree(parentIds: number[], signal?: AbortSignal): Promise<number[]> {
  const ids = new Set<number>();
  for (const parentId of parentIds) {
    await request(`/api/tags/${parentId}`, { signal });
    ids.add(parentId);
    for (let page = 1; ; page++) {
      const result = await request<{
        items: Array<{ id: number }>;
        totalCount: number;
      }>("/api/tags/find", {
        method: "POST",
        signal,
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

function definitionProblem(
  field: AbsenceField,
  definition: CustomFieldDefinition,
): string {
  const problems: string[] = [];
  if (definition.type !== field.type) problems.push(`type "${field.type}"`);
  if (!definition.isMultiValue) problems.push("multiple values enabled");
  if (!definition.entityTypes.includes("video"))
    problems.push("video applicability");
  if (!definition.filterable) problems.push("filtering enabled");
  return problems.length
    ? `The ${field.key} custom field is incompatible. It must have ${problems.join(", ")}.`
    : "";
}

async function absenceFieldStatus(
  field: AbsenceField,
): Promise<ConfirmedAbsentTagsFieldStatus> {
  const definitions =
    await request<CustomFieldDefinition[]>("/api/custom-fields");
  const definition = definitions.find(
    (item) => item.key.toLowerCase() === field.key,
  );
  if (!definition)
    return {
      kind: "missing",
      message: `Create the ${field.label} custom field before applying ${field.subject}.`,
    };
  const message = definitionProblem(field, definition);
  return message
    ? { kind: "incompatible", message }
    : { kind: "ready", definition, message: "" };
}

async function createAbsenceField(field: AbsenceField): Promise<void> {
  const status = await absenceFieldStatus(field);
  if (status.kind === "ready") return;
  if (status.kind === "incompatible") throw new Error(status.message);
  await request("/api/custom-fields", {
    method: "POST",
    body: JSON.stringify({
      key: field.key,
      label: field.label,
      type: field.type,
      entityTypes: ["video"],
      filterable: true,
      sortable: false,
      isMultiValue: true,
    }),
  });
}

export function getConfirmedAbsentTagsFieldStatus() {
  return absenceFieldStatus(VIDEO_ABSENCE_FIELD);
}

export function createConfirmedAbsentTagsField() {
  return createAbsenceField(VIDEO_ABSENCE_FIELD);
}

export function getOccurrenceAbsenceFieldStatus() {
  return absenceFieldStatus(OCCURRENCE_ABSENCE_FIELD);
}

export function createOccurrenceAbsenceField() {
  return createAbsenceField(OCCURRENCE_ABSENCE_FIELD);
}

function uniqueIds(ids: readonly number[]): number[] {
  return [...new Set(ids)];
}

/**
 * Tag ids confirmed absent for one performer, read from the video's custom fields. The field
 * is plain text anyone can edit in Cove, so values that are not pairs are ignored rather than
 * allowed to block tagging every performer on the video.
 */
export function occurrenceAbsentTagIds(
  video: Pick<Video, "customFields">,
  performerId: number,
): number[] {
  const fields = video.customFields ?? {};
  const key = Object.keys(fields).find(
    (item) => item.toLowerCase() === CONFIRMED_ABSENT_OCCURRENCE_TAGS_KEY,
  );
  const values = key === undefined ? [] : fields[key];
  return uniqueIds(
    (Array.isArray(values) ? values : [])
      .filter(
        (value): value is string =>
          typeof value === "string" && /^[1-9]\d*:[1-9]\d*$/.test(value),
      )
      .map((value) => value.split(":").map(Number))
      .filter(([performer]) => performer === performerId)
      .map(([, tagId]) => tagId),
  );
}

/** Resolves the occurrence absence field's key, so callers can verify it before any write. */
export async function requireOccurrenceAbsenceField(): Promise<string> {
  let status: ConfirmedAbsentTagsFieldStatus;
  try {
    status = await getOccurrenceAbsenceFieldStatus();
  } catch (error) {
    throw new Error(
      `Could not verify the ${OCCURRENCE_ABSENCE_FIELD.label} custom field. ${error instanceof Error ? error.message : "Request failed."}`,
    );
  }
  if (status.kind !== "ready") throw new Error(status.message);
  return status.definition.key;
}

/**
 * One bulk request merges the pairs server-side, so other performers' pairs and unrelated
 * custom fields on the video are never read or resent.
 */
export async function setOccurrenceAbsence(
  fieldKey: string,
  videoId: number,
  performerId: number,
  tagIds: readonly number[],
  mode: "ADD" | "REMOVE",
): Promise<void> {
  await request("/api/videos/bulk", {
    method: "POST",
    body: JSON.stringify({
      ids: [videoId],
      customFields: {
        [fieldKey]: uniqueIds(tagIds).map((tagId) => `${performerId}:${tagId}`),
      },
      customFieldMode: mode,
    }),
  });
}

type BulkVideoUpdate = {
  ids: number[];
  tagIds?: number[];
  tagMode?: "ADD" | "REMOVE";
  customFields?: Record<string, number[]>;
  customFieldMode?: "ADD" | "REMOVE";
};

/**
 * Every review step becomes exactly one bulk request for all selected videos. Assessment
 * steps pair the tag change with the confirmed-absent custom field in the same request, so
 * Cove merges both server-side and no per-video read or rewrite is needed.
 */
function bulkStepRequest(
  step: { mode: VideoReviewAction["steps"][number]["mode"]; tagIds: number[] },
  ids: number[],
  absentFieldKey: string | null,
): BulkVideoUpdate {
  const tagIds = [...step.tagIds];
  const absentField = (mode: "ADD" | "REMOVE") => {
    if (absentFieldKey === null)
      throw new Error(
        `The ${CONFIRMED_ABSENT_TAGS_LABEL} custom field is not available.`,
      );
    return { customFields: { [absentFieldKey]: tagIds }, customFieldMode: mode };
  };
  switch (step.mode) {
    case "ADD":
      return { ids, tagIds, tagMode: "ADD" };
    case "REMOVE":
    case "REMOVE_TREE":
      return { ids, tagIds, tagMode: "REMOVE" };
    case "MARK_PRESENT":
      return { ids, tagIds, tagMode: "ADD", ...absentField("REMOVE") };
    case "MARK_ABSENT":
      return { ids, tagIds, tagMode: "REMOVE", ...absentField("ADD") };
    case "CLEAR_ABSENCE":
      return { ids, ...absentField("REMOVE") };
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
  let absentFieldKey: string | null = null;
  if (hasAssessmentSteps(action)) {
    let status: ConfirmedAbsentTagsFieldStatus;
    try {
      status = await getConfirmedAbsentTagsFieldStatus();
    } catch (error) {
      throw new Error(
        `Could not verify the ${CONFIRMED_ABSENT_TAGS_LABEL} custom field. ${error instanceof Error ? error.message : "Request failed."}`,
      );
    }
    if (status.kind !== "ready") throw new Error(status.message);
    absentFieldKey = status.definition.key;
  }
  const targets = uniqueIds(ids);
  const steps = await Promise.all(
    action.steps.map(async (step) => ({
      mode: step.mode,
      tagIds:
        step.mode === "REMOVE_TREE"
          ? await resolveTagTree(step.tagIds)
          : uniqueIds(step.tagIds),
    })),
  );
  // Legacy ADD/REMOVE steps run before assessment steps, as the per-video path always did,
  // so a saved action that mixes both keeps its final outcome.
  const orderedSteps = [
    ...steps.filter((step) => !isAssessmentMode(step.mode)),
    ...steps.filter((step) => isAssessmentMode(step.mode)),
  ];
  const requests = orderedSteps.map((step) =>
    bulkStepRequest(step, targets, absentFieldKey),
  );
  for (let index = 0; index < requests.length; index++) {
    try {
      await request("/api/videos/bulk", {
        method: "POST",
        body: JSON.stringify(requests[index]),
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
