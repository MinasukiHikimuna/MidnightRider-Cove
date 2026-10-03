import {
  boundedFilter,
  isOccurrenceReview,
  OCCURRENCE_CONDITIONS,
  queueSignature,
  reviewEntityType,
  reviewMediaKind,
  type FilterBin,
  type MediaReview,
  type OccurrenceReview,
  type Review,
  type VideoReview,
} from "./model";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { objectFiltersEqual } from "./objectFiltersEqual";
import { splitQueueBins } from "./TagPresentation";
export type { MediaReview } from "./model";
export type PerformerScope = Omit<
  OccurrenceReview["occurrence"],
  "tagIds" | "multiple" | "performerFlags" | "flagPerformerTagIds"
>;
export interface ReviewQuery {
  filter: Record<string, unknown>;
  objectFilter: Record<string, unknown>;
  searchMode: string;
  startFrom: "beginning" | "end";
  performerScope?: PerformerScope;
  /**
   * Narrows an occurrence queue and its batches to one performer. Navigation state only:
   * saving queue criteria or the rule never writes it into the review.
   */
  performerFocus?: number;
}
export const queryKeys = [
  "q",
  "page",
  "perPage",
  "sort",
  "direction",
  "sorts",
  "seed",
  "filters",
  "searchMode",
  "performerScope",
  "performer",
  "startFrom",
];
const allScope: PerformerScope = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: true,
  hideConfirmedAbsent: true,
};
export function defaultQuery(review: MediaReview): ReviewQuery {
  const scope =
    isOccurrenceReview(review) ? review.occurrence : undefined;
  return {
    filter: boundedFilter({
      q: "",
      sort: "date",
      direction: "desc",
      ...review.view.filter,
      page: 1,
    }, reviewMediaKind(review)),
    objectFilter: structuredClone(review.view.objectFilter),
    searchMode: review.view.searchMode,
    startFrom: review.view.startFrom ?? "end",
    ...(scope
      ? {
          performerScope: {
            targetMode: scope.targetMode,
            performerIds: [...scope.performerIds],
            performerFilter: structuredClone(scope.performerFilter),
            condition: scope.condition,
            conditionTagIds: [...scope.conditionTagIds],
            includeSubtags: scope.includeSubtags ?? true,
            hideConfirmedAbsent: scope.hideConfirmedAbsent ?? true,
          },
        }
      : {}),
  };
}
/**
 * Criteria in a review link, compressed: a large filter expression written as JSON outgrew what
 * servers accept in a request line (a review's link reached 15 KB; Cove's API refuses 8 KB and
 * its dev server 16 KB of headers, so reloading the page failed with HTTP 431).
 */
function encodeCriteria(value: Record<string, unknown>): string {
  return compressToEncodedURIComponent(JSON.stringify(value));
}
/** Criteria from a review link: compressed, or plain JSON as links made before held them. */
export function readCriteria(value: string | null): Record<string, unknown> {
  if (!value) return {};
  const json = value.startsWith("{") ? value : decompressFromEncodedURIComponent(value);
  const result = json ? JSON.parse(json) : null;
  if (!result || typeof result !== "object" || Array.isArray(result))
    throw new Error(
      "Invalid review URL criteria. Reset to review defaults to recover.",
    );
  return result;
}
export function readQuery(
  review: MediaReview,
  params: URLSearchParams,
): { query: ReviewQuery; startAtEnd: boolean } {
  let performerFocus: number | undefined;
  if (isOccurrenceReview(review) && params.has("performer")) {
    performerFocus = Number(params.get("performer"));
    if (!Number.isSafeInteger(performerFocus) || performerFocus <= 0)
      throw new Error("Invalid performer focus in review URL.");
  }
  // A focus alone narrows the saved queue; it does not replace its criteria.
  const explicit = queryKeys.some((key) => key !== "performer" && params.has(key));
  if (!explicit) {
    const query = defaultQuery(review);
    return {
      query: performerFocus ? { ...query, performerFocus } : query,
      startAtEnd: query.startFrom === "end",
    };
  }
  // Query-bearing links never inherit hidden saved criteria.
  const filter: Record<string, unknown> = {
    q: params.get("q") ?? "",
    page: Number(params.get("page") ?? 1),
    perPage: Number(params.get("perPage") ?? 40),
    sort: params.get("sort") ?? "date",
    direction: params.get("direction") === "asc" ? "asc" : "desc",
  };
  if (params.has("seed")) filter.seed = Number(params.get("seed"));
  if (params.get("sorts")) {
    const sorts = params
      .get("sorts")!
      .split(",")
      .map((part) => {
        const at = part.lastIndexOf(":");
        return { key: part.slice(0, at), direction: part.slice(at + 1) };
      });
    if (sorts.some((s) => !s.key || !["asc", "desc"].includes(s.direction)))
      throw new Error("Invalid review URL sort.");
    filter.sorts = sorts;
    filter.sort = sorts[0].key;
    filter.direction = sorts[0].direction;
  }
  let performerScope: PerformerScope | undefined;
  if (isOccurrenceReview(review)) {
    performerScope = {
      ...allScope,
      ...readCriteria(params.get("performerScope")),
    } as PerformerScope;
    if (
      !["all", "selected", "filter"].includes(performerScope.targetMode) ||
      !OCCURRENCE_CONDITIONS.includes(performerScope.condition) ||
      !Array.isArray(performerScope.performerIds) ||
      !Array.isArray(performerScope.conditionTagIds) ||
      typeof performerScope.includeSubtags !== "boolean" ||
      typeof performerScope.hideConfirmedAbsent !== "boolean" ||
      [...performerScope.performerIds, ...performerScope.conditionTagIds].some(
        (id) => !Number.isSafeInteger(id) || id <= 0,
      ) ||
      !performerScope.performerFilter ||
      typeof performerScope.performerFilter !== "object" ||
      Array.isArray(performerScope.performerFilter)
    )
      throw new Error("Invalid performer scope in review URL.");
  }
  const startFrom =
    params.get("startFrom") === "beginning" ? "beginning" : "end";
  return {
    query: {
      filter: boundedFilter(filter, reviewMediaKind(review)),
      objectFilter: readCriteria(params.get("filters")),
      searchMode: params.get("searchMode") ?? "text",
      startFrom,
      performerScope,
      ...(performerFocus ? { performerFocus } : {}),
    },
    startAtEnd: !params.has("page") && startFrom === "end",
  };
}
/**
 * The state of a history entry the page pushed when a review was opened from the list: the entry
 * before it is the list's. Cove reads a route only from a state with a page, so it reads this
 * entry's route from its URL, as for the page's other entries.
 */
const OPENED_FROM_LIST = { dataQualityOpenedFromList: true } as const;

/** Whether the current history entry is a review opened from the list. */
export function openedFromList(): boolean {
  const state: unknown = window.history.state;
  return (
    !!state &&
    typeof state === "object" &&
    (state as Record<string, unknown>).dataQualityOpenedFromList === true
  );
}

/**
 * Changes the page's URL: a review opened from the list adds a history entry, so Back returns to
 * the list; every other change (queue criteria, another review from within one) replaces the
 * current entry, which stays a review opened from the list if it was one.
 */
export function writePageUrl(url: string, { openingFromList = false } = {}) {
  if (openingFromList) window.history.pushState({ ...OPENED_FROM_LIST }, "", url);
  else window.history.replaceState(openedFromList() ? { ...OPENED_FROM_LIST } : null, "", url);
}

export function writeQuery(id: string, query: ReviewQuery) {
  const params = new URLSearchParams(window.location.search);
  queryKeys.forEach((key) => params.delete(key));
  params.set("review", id);
  for (const key of ["q", "page", "perPage", "sort", "direction", "seed"]) {
    if (query.filter[key] !== undefined)
      params.set(key, String(query.filter[key]));
  }
  if (Array.isArray(query.filter.sorts))
    params.set(
      "sorts",
      query.filter.sorts.map((s) => `${s.key}:${s.direction}`).join(","),
    );
  params.set("filters", encodeCriteria(query.objectFilter));
  params.set("searchMode", query.searchMode);
  params.set("startFrom", query.startFrom);
  if (query.performerScope)
    params.set("performerScope", encodeCriteria(query.performerScope));
  if (query.performerFocus)
    params.set("performer", String(query.performerFocus));
  writePageUrl(`${window.location.pathname}?${params}${window.location.hash}`);
}
export function effectiveReview(
  saved: MediaReview,
  query: ReviewQuery,
): MediaReview {
  const view = {
    ...saved.view,
    filter: query.filter,
    objectFilter: query.objectFilter,
    searchMode: query.searchMode,
    startFrom: query.startFrom,
  };
  return isOccurrenceReview(saved)
    ? {
        ...saved,
        view,
        occurrence: { ...saved.occurrence, ...query.performerScope },
      }
    : { ...saved, view };
}

/**
 * A review with its queue criteria as a review link reads them: a missing search, sort or
 * direction filled in, the page and page size bounded, the traversal direction and the performer
 * scope's defaults explicit. Two reviews that load the same queue normalize alike, so comparing
 * them tells what saving one over the other would change.
 */
export function normalizedReview<T extends Review>(review: T): T {
  const media = review as unknown as MediaReview;
  return effectiveReview(media, defaultQuery(media)) as unknown as T;
}

/** Whether a queue shows other criteria than the review's saved ones; its page never counts. */
export function queryDiffers(saved: MediaReview, query: ReviewQuery): boolean {
  return (
    query.startFrom !== (saved.view.startFrom ?? "end") ||
    !objectFiltersEqual(
      JSON.parse(queueSignature(effectiveReview(saved, query))),
      JSON.parse(queueSignature(effectiveReview(saved, defaultQuery(saved)))),
    )
  );
}

/** The filter bins of a review, by which its pressed filter bins are known. */
export function filterBinsOf(...reviews: Review[]): FilterBin[] {
  return reviews.flatMap((review) =>
    reviewEntityType(review) === "video"
      ? ((review as VideoReview).presentation?.filterBins ?? [])
      : [],
  );
}

/**
 * Queue bins narrow a video queue for the visit only; a review never saves them. This is the
 * review with its bins lifted: down to its saved filter, or to the criteria the bins were pressed
 * on, which saving keeps. Filter bins are known by the definitions of either review.
 */
export function withoutQueueBins<T extends Review>(review: T, saved: Review): T {
  if (reviewEntityType(review) !== "video") return review;
  const { base, bins } = splitQueueBins(
    review.view.objectFilter,
    saved.view.objectFilter,
    filterBinsOf(review, saved),
  );
  return bins.length ? { ...review, view: { ...review.view, objectFilter: base } } : review;
}

/** The query as the review would save it: without its queue bins. */
export function savableQuery(saved: MediaReview, query: ReviewQuery): ReviewQuery {
  if (reviewEntityType(saved) !== "video") return query;
  const { base, bins } = splitQueueBins(
    query.objectFilter,
    saved.view.objectFilter,
    filterBinsOf(saved),
  );
  return bins.length ? { ...query, objectFilter: base } : query;
}

/** The queue and batch target for a focused performer; saved criteria never see the focus. */
export function focusedReview<T extends MediaReview>(
  review: T,
  performerFocus: number | undefined,
): T {
  if (!performerFocus || !isOccurrenceReview(review)) return review;
  return {
    ...review,
    occurrence: {
      ...review.occurrence,
      targetMode: "selected",
      performerIds: [performerFocus],
    },
  };
}
