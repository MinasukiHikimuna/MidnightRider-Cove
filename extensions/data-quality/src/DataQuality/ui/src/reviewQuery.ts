import {
  boundedFilter,
  type OccurrenceReview,
  type VideoReview,
} from "./model";
export type MediaReview = VideoReview | OccurrenceReview;
export type PerformerScope = Omit<
  OccurrenceReview["occurrence"],
  "tagIds" | "multiple"
>;
export interface ReviewQuery {
  filter: Record<string, unknown>;
  objectFilter: Record<string, unknown>;
  searchMode: string;
  startFrom: "beginning" | "end";
  performerScope?: PerformerScope;
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
  "startFrom",
];
const allScope: PerformerScope = {
  targetMode: "all",
  performerIds: [],
  performerFilter: {},
  condition: "any",
  conditionTagIds: [],
  includeSubtags: true,
};
export function defaultQuery(review: MediaReview): ReviewQuery {
  const scope =
    review.entityType === "performerOccurrence" ? review.occurrence : undefined;
  return {
    filter: boundedFilter({
      q: "",
      sort: "date",
      direction: "desc",
      ...review.view.filter,
      page: 1,
    }),
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
          },
        }
      : {}),
  };
}
function object(value: string | null): Record<string, unknown> {
  if (!value) return {};
  const result = JSON.parse(value);
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
  const explicit = queryKeys.some((key) => params.has(key));
  if (!explicit) {
    const query = defaultQuery(review);
    return { query, startAtEnd: query.startFrom === "end" };
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
  if (review.entityType === "performerOccurrence") {
    performerScope = {
      ...allScope,
      ...object(params.get("performerScope")),
    } as PerformerScope;
    if (
      !["all", "selected", "filter"].includes(performerScope.targetMode) ||
      !["any", "includes", "includesAll", "excludes", "isNull"].includes(
        performerScope.condition,
      ) ||
      !Array.isArray(performerScope.performerIds) ||
      !Array.isArray(performerScope.conditionTagIds) ||
      typeof performerScope.includeSubtags !== "boolean" ||
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
      filter: boundedFilter(filter),
      objectFilter: object(params.get("filters")),
      searchMode: params.get("searchMode") ?? "text",
      startFrom,
      performerScope,
    },
    startAtEnd: !params.has("page") && startFrom === "end",
  };
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
  params.set("filters", JSON.stringify(query.objectFilter));
  params.set("searchMode", query.searchMode);
  params.set("startFrom", query.startFrom);
  if (query.performerScope)
    params.set("performerScope", JSON.stringify(query.performerScope));
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}?${params}${window.location.hash}`,
  );
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
  return saved.entityType === "performerOccurrence"
    ? {
        ...saved,
        view,
        occurrence: { ...saved.occurrence, ...query.performerScope },
      }
    : { ...saved, view };
}
