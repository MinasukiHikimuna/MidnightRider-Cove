import { countMedia, normalizeCriteria, request, requestIfFound } from "./api";
import { reviewMediaKind, type OccurrenceReview } from "./model";
import { conditionCannotMatch, occurrenceSceneReview } from "./occurrences";

export interface RankedPerformer {
  id: number;
  name: string;
  /** Matching items for this performer: the work its queue still holds. */
  count: number;
  /** Every item the performer appears in, which bounds the count. */
  total: number;
  /** The review's flag tags on the performer's profile. */
  flags: string[];
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

/** Queue criteria decide the ranking; paging and sort order do not. */
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
  return JSON.stringify([
    review.entityType,
    filter,
    review.view.objectFilter,
    review.view.searchMode,
    review.occurrence,
  ]);
}

function candidatesKey(review: OccurrenceReview): string {
  const settings = review.occurrence;
  return JSON.stringify([
    reviewMediaKind(review),
    settings.targetMode,
    settings.targetMode === "selected" ? settings.performerIds : [],
    settings.targetMode === "filter" ? settings.performerFilter : {},
    settings.flagPerformerTagIds ?? [],
  ]);
}

async function loadCandidates(
  review: OccurrenceReview,
  signal: AbortSignal,
): Promise<Candidate[]> {
  const audio = reviewMediaKind(review) === "audio";
  const flagIds = new Set(review.occurrence.flagPerformerTagIds ?? []);
  const candidate = (performer: PerformerDto): Candidate => ({
    id: performer.id,
    name: performer.name,
    total: (audio ? performer.audioCount : performer.videoCount) ?? 0,
    flags: (performer.tags ?? [])
      .filter((tag) => flagIds.has(tag.id))
      .map((tag) => tag.name),
  });
  const settings = review.occurrence;
  const candidates: Candidate[] = [];
  if (settings.targetMode === "selected") {
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
