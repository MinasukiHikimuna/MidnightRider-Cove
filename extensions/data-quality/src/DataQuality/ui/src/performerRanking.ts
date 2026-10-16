import { countMedia, normalizeCriteria, request, requestIfFound } from "./api";
import type { ProfileTag } from "./attention";
import { reviewMediaKind, targetsAllPerformers, type OccurrenceReview } from "./model";
import { conditionCannotMatch, loadOccurrencePage, occurrenceSceneReview } from "./occurrences";

export interface RankedPerformer {
  id: number;
  name: string;
  /** Matching items for this performer: the work its queue still holds. */
  count: number;
  /** Every item the performer appears in, which bounds the count. */
  total: number;
  /**
   * The tags on the performer's profile, as read with the performer: the review's flags are
   * matched against them when shown, so changing the flags never counts anyone again.
   */
  tags: ProfileTag[];
}
type Candidate = Omit<RankedPerformer, "count">;
export interface PerformerRanking {
  signature: string;
  /** What the candidates depend on, so criteria changes can reuse them. */
  candidatesKey: string;
  /** In-scope performers, most items first. */
  candidates: Candidate[];
  /** Candidates before this index have been counted. */
  cursor: number;
  /** Counted performers with matching items, most first. */
  ranked: RankedPerformer[];
  limit: number;
  /** Nobody left uncounted can reach the first `limit` places. */
  complete: boolean;
  /** Taken while counts were still in flight: shown, never continued. */
  partial?: boolean;
}
interface PerformerDto {
  id: number;
  name: string;
  videoCount?: number;
  audioCount?: number;
  tags?: Array<{ id: number; name: string }>;
}

/** Queue criteria decide the ranking; paging, sort order and performer flags do not. */
export function rankingSignature(review: OccurrenceReview): string {
  const {
    page: _page,
    perPage: _perPage,
    sort: _sort,
    direction: _direction,
    sorts: _sorts,
    seed: _seed,
    ...filter
  } = review.view.filter;
  const {
    performerFlags: _flags,
    flagPerformerTagIds: _older,
    ...occurrence
  } = review.occurrence;
  return JSON.stringify([
    review.entityType,
    filter,
    review.view.objectFilter,
    review.view.searchMode,
    occurrence,
  ]);
}

function candidatesKey(review: OccurrenceReview): string {
  const settings = review.occurrence;
  return JSON.stringify([
    reviewMediaKind(review),
    settings.targetMode,
    settings.targetMode === "selected" ? settings.performerIds : [],
    settings.targetMode === "filter" ? settings.performerFilter : {},
  ]);
}

async function loadCandidates(
  review: OccurrenceReview,
  signal: AbortSignal,
): Promise<Candidate[]> {
  const audio = reviewMediaKind(review) === "audio";
  const candidate = (performer: PerformerDto): Candidate => ({
    id: performer.id,
    name: performer.name,
    total: (audio ? performer.audioCount : performer.videoCount) ?? 0,
    tags: (performer.tags ?? []).map((tag) => ({ id: tag.id, name: tag.name })),
  });
  const settings = review.occurrence;
  const candidates: Candidate[] = [];
  if (settings.targetMode === "selected" && settings.performerIds.length > 0) {
    for (const id of settings.performerIds) {
      const performer = await requestIfFound<PerformerDto>(
        `/api/performers/${id}`,
        { signal },
      );
      // A performer deleted since the review was saved has nothing left to rank.
      if (performer) candidates.push(candidate(performer));
    }
  } else {
    const { _filterExpression: filterExpression, ...objectFilter } =
      settings.targetMode === "filter" ? settings.performerFilter : {};
    for (let page = 1; ; page++) {
      const result = await request<{ items: PerformerDto[]; totalCount: number }>(
        "/api/performers/find",
        {
          method: "POST",
          signal,
          body: JSON.stringify(
            normalizeCriteria({
              findFilter: {
                page,
                perPage: 1000,
                sort: audio ? "audio_count" : "video_count",
                direction: "desc",
              },
              objectFilter,
              filterExpression,
            }),
          ),
        },
      );
      candidates.push(...result.items.map(candidate));
      if (page * 1000 >= result.totalCount || !result.items.length) break;
    }
  }
  // Order by the totals actually returned, so each one bounds everyone after it.
  return candidates.sort((a, b) => b.total - a.total || a.id - b.id);
}

/**
 * Up to this many matching scenes, the whole queue is read once and every performer's occurrences
 * counted from it, which beats counting performers one by one when few of them match much. Larger
 * queues are counted one performer at a time, most items first, as only the first places need it.
 */
export const LOCAL_RANKING_SCENES = 3000;
const LOCAL_RANKING_PAGE = 250;

/**
 * Each in-scope performer's matching occurrences, read from the queue's own scene pages, or null
 * when the queue holds more scenes than reading it whole is worth.
 */
async function countAllInQueue(
  review: OccurrenceReview,
  performerIds: number[] | null,
  signal: AbortSignal,
  onPage: (counts: Map<number, number>) => void,
): Promise<Map<number, number> | null> {
  const scenes = occurrenceSceneReview(review, performerIds);
  if ((await countMedia(scenes, scenes.view.filter, signal)) > LOCAL_RANKING_SCENES) return null;
  // A fixed order, so no scene is read on two pages or missed between them.
  const { sorts: _sorts, seed: _seed, ...filter } = review.view.filter;
  const paged: OccurrenceReview = {
    ...review,
    view: {
      ...review.view,
      // Cove breaks ties in creation time by id, so pages neither overlap nor shift under a write.
      filter: { ...filter, perPage: LOCAL_RANKING_PAGE, sort: "created_at", direction: "asc" },
    },
  };
  const counts = new Map<number, number>();
  for (let page = 1; ; page++) {
    signal.throwIfAborted();
    const result = await loadOccurrencePage(paged, performerIds, page, signal);
    for (const occurrence of result.items)
      counts.set(occurrence.performer.id, (counts.get(occurrence.performer.id) ?? 0) + 1);
    onPage(counts);
    if (page * LOCAL_RANKING_PAGE >= result.totalCount) return counts;
  }
}

export function countPerformer(
  review: OccurrenceReview,
  performerId: number,
  signal?: AbortSignal,
): Promise<number> {
  const scene = occurrenceSceneReview(review, [performerId]);
  return countMedia(scene, scene.view.filter, signal);
}

function insertRanked(ranked: RankedPerformer[], performer: RankedPerformer) {
  const index = ranked.findIndex(
    (item) =>
      item.count < performer.count ||
      (item.count === performer.count &&
        item.name.localeCompare(performer.name) > 0),
  );
  ranked.splice(index < 0 ? ranked.length : index, 0, performer);
}

function isComplete(
  candidates: Candidate[],
  cursor: number,
  ranked: RankedPerformer[],
  limit: number,
) {
  if (cursor >= candidates.length) return true;
  const total = candidates[cursor].total;
  if (total <= 0) return true;
  // A total equal to the last place could still tie it and win on name.
  return ranked.length >= limit && total < ranked[limit - 1].count;
}

/**
 * Counts performers, most items first, until nobody left can reach the first `limit` places:
 * a performer's matching items never exceed everything they appear in. The first places are
 * then exact without counting the whole library. Continue a ranking to show more places.
 */
export async function extendRanking(
  review: OccurrenceReview,
  previous: PerformerRanking | null,
  limit: number,
  signal: AbortSignal,
  options: { concurrency?: number; onProgress?(ranking: PerformerRanking): void } = {},
): Promise<PerformerRanking> {
  const signature = rankingSignature(review);
  const key = candidatesKey(review);
  const cannotMatch = conditionCannotMatch(review.occurrence);
  // A partial snapshot counts claimed candidates whose counts never arrived; start over,
  // keeping the loaded performers while the scope they came from is unchanged.
  const base: PerformerRanking =
    previous?.signature === signature && !previous.partial
      ? previous
      : {
          signature,
          // Nobody was loaded for a condition that cannot match, so nothing may reuse it.
          candidatesKey: cannotMatch ? "" : key,
          candidates: cannotMatch
            ? []
            : previous?.candidatesKey === key
              ? previous.candidates
              : await loadCandidates(review, signal),
          cursor: 0,
          ranked: [],
          limit,
          complete: false,
        };
  const { candidates } = base;
  // A fresh ranking of a queue small enough to read whole is counted from it in one pass, for
  // every performer at once.
  if (base.cursor === 0 && !base.ranked.length && candidates.length > 1) {
    const byId = new Map(candidates.map((candidate) => [candidate.id, candidate]));
    const rankedFrom = (counts: Map<number, number>) =>
      [...counts]
        .flatMap(([id, count]) => {
          const candidate = byId.get(id);
          return candidate && count > 0 ? [{ ...candidate, count }] : [];
        })
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
    // Should reading the queue fail, the performers are counted one by one instead.
    const counts = await countAllInQueue(
      review,
      targetsAllPerformers(review.occurrence) ? null : candidates.map((candidate) => candidate.id),
      signal,
      (sofar) =>
        options.onProgress?.({ ...base, ranked: rankedFrom(sofar), limit, complete: false, partial: true }),
    ).catch(() => {
      signal.throwIfAborted();
      return null;
    });
    if (counts)
      return { ...base, cursor: candidates.length, ranked: rankedFrom(counts), limit, complete: true };
  }
  const ranked = [...base.ranked];
  let cursor = base.cursor;
  let stopped = false;
  const snapshot = (partial: boolean): PerformerRanking => ({
    ...base,
    cursor,
    ranked: [...ranked],
    limit,
    complete: !partial && isComplete(candidates, cursor, ranked, limit),
    ...(partial ? { partial } : {}),
  });
  try {
    await Promise.all(
      Array.from({ length: options.concurrency ?? 6 }, async () => {
        while (!stopped && !isComplete(candidates, cursor, ranked, limit)) {
          signal.throwIfAborted();
          const candidate = candidates[cursor++];
          const count = await countPerformer(review, candidate.id, signal);
          if (count > 0) insertRanked(ranked, { ...candidate, count });
          options.onProgress?.(snapshot(true));
        }
      }),
    );
  } catch (error) {
    stopped = true;
    throw error;
  }
  signal.throwIfAborted();
  return snapshot(false);
}

/** Applies a fresh count after a write; performers not yet counted are left for extending. */
export function recountRanked(
  ranking: PerformerRanking,
  performerId: number,
  count: number,
): PerformerRanking {
  const index = ranking.candidates.findIndex((item) => item.id === performerId);
  if (ranking.partial || index < 0 || index >= ranking.cursor) return ranking;
  const ranked = ranking.ranked.filter((item) => item.id !== performerId);
  if (count > 0) insertRanked(ranked, { ...ranking.candidates[index], count });
  return {
    ...ranking,
    ranked,
    complete: isComplete(ranking.candidates, ranking.cursor, ranked, ranking.limit),
  };
}
