import { extensionFetch } from "@cove/runtime/api";
import type { ReviewAction, VideoReview } from "./model";
import { mergeReviews, parseReviews, validAction } from "./model";

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
  date?: string;
  studioName?: string;
  performers: Array<{ id: number; name: string }>;
  files: VideoFile[];
  updatedAt: string;
  parentVideoId?: number | null;
  clipStartSec?: number | null;
  clipEndSec?: number | null;
}

export interface VideoPage {
  items: Video[];
  totalCount: number;
}

const REVIEW_IMPORT_SCOPE = "ext:cove-data-quality:video-reviews";
const EXTENSION_STORAGE_PREFIX = "cove-data-quality-reviews-v1";
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
      };
      message = body.message || body.detail || message;
    } catch {
      // Keep the status message when the response is not JSON.
    }
    throw new Error(message);
  }
  if (response.status === 204 || response.status === 205) return undefined as T;
  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export async function loadReviews(): Promise<{
  reviews: VideoReview[];
  storageKey: string;
  canWrite: boolean;
}> {
  const me = await request<{ user: { id: string }; permissions: string[] }>(
    "/api/auth/me",
  );
  const storageKey = `${EXTENSION_STORAGE_PREFIX}:${me.user.id}`;
  const localSources = [
    storageKey,
    `cove-video-reviews-v1:${storageKey.split(":").at(-1)}`,
    "page-videos",
  ];
  const local: VideoReview[][] = [];
  const adoptedIds = new Set<string>();
  for (const key of localSources) {
    const raw = localStorage.getItem(key);
    if (raw) local.push(parseReviews(raw));
    const adopted: unknown = JSON.parse(
      localStorage.getItem(`${key}:account-imports`) ?? "[]",
    );
    if (
      !Array.isArray(adopted) ||
      !adopted.every((id) => typeof id === "string")
    )
      throw new Error(
        "Account import history could not be read. Existing browser reviews have been kept.",
      );
    for (const id of adopted) adoptedIds.add(id);
  }
  const records = await request<Array<{ uiOptions?: string | null }>>(
    `/api/savedfilters?mode=${encodeURIComponent(REVIEW_IMPORT_SCOPE)}`,
  );
  const account = records.flatMap((record) =>
    parseReviews(record.uiOptions ?? "[]"),
  );
  const localReviews = mergeReviews(...local);
  const localIds = new Set(localReviews.map((review) => review.id));
  const additions = account.filter(
    (review) => !localIds.has(review.id) && !adoptedIds.has(review.id),
  );
  const reviews = mergeReviews(localReviews, additions);
  for (const review of account) adoptedIds.add(review.id);
  localStorage.setItem(storageKey, JSON.stringify(reviews));
  localStorage.setItem(
    `${storageKey}:account-imports`,
    JSON.stringify([...adoptedIds]),
  );
  return {
    reviews,
    storageKey,
    canWrite:
      me.permissions.includes("*") || me.permissions.includes("videos.write"),
  };
}

export function saveReviews(storageKey: string, reviews: VideoReview[]): void {
  localStorage.setItem(storageKey, JSON.stringify(reviews));
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
        findFilter: filter,
        objectFilter,
        filterExpression,
      }),
    ),
  });
}

export function videoCoverUrl(video: Video): string {
  return `/api/videos/${video.id}/image?max=640&v=${encodeURIComponent(video.updatedAt)}`;
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

async function resolveTagTree(parentIds: number[]): Promise<number[]> {
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

export async function runReviewAction(
  action: ReviewAction,
  ids: number[],
): Promise<void> {
  if (
    !validAction(action) ||
    ids.length === 0 ||
    ids.some((id) => !Number.isSafeInteger(id) || id <= 0)
  ) {
    throw new Error("Choose videos and configure a valid action first.");
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
