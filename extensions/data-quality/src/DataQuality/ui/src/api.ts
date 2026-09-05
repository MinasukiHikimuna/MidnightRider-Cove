import { extensionFetch } from "@cove/runtime/api";
import type { ReviewAction, VideoReview } from "./model";
import { validAction, boundedFilter } from "./model";

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
  tags?: Array<{ id: number; name: string }>;
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

// Cove's public filtered-query endpoint caches an identical request for one second.
// No public invalidation/conditional-read API exists. Keep the action pending until
// that cache expires, including after partial failure, before refreshing membership.
export function settleReviewWrites(action: ReviewAction): Promise<void> {
  return action.steps.length
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
