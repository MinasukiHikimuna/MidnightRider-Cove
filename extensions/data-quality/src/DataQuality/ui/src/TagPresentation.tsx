import { useEffect, useRef, useState } from "react";
import { Check } from "@cove/runtime/lucide-react";
import { countMedia, resolveTagTree, type MediaItem } from "./api";
import type { FilterBin, VideoReview } from "./model";
import { objectFiltersEqual } from "./objectFiltersEqual";
import { useTagNames } from "./tagNames";

export function usePresentationTags(review: VideoReview | null) {
  const [ids, setIds] = useState<Record<number, number[]>>({});
  const [error, setError] = useState("");
  const annotatedParents = (
    review?.presentation?.annotations ?? []
  ).includes("tags")
    ? (review?.presentation?.annotationParents ?? [])
    : [];
  const parents = JSON.stringify([
    ...new Set([
      ...annotatedParents,
      ...(review?.presentation?.binParents ?? []),
    ]),
  ]);
  useEffect(() => {
    let current = true;
    setIds({});
    setError("");
    void Promise.all(
      (JSON.parse(parents) as number[]).map(
        async (id) => [id, await resolveTagTree([id])] as const,
      ),
    )
      .then((entries) => {
        if (current) setIds(Object.fromEntries(entries));
      })
      .catch(() => {
        if (current)
          setError(
            "Tag annotations and bins could not load. Check tag read permission, then reopen the review to retry.",
          );
      });
    return () => {
      current = false;
    };
  }, [parents]);
  return { ids, error };
}

export function presentedVideo(
  video: MediaItem,
  review: VideoReview | null,
  trees: Record<number, number[]>,
): MediaItem {
  const settings = review?.presentation;
  const fields = settings?.annotations ?? [];
  const parents = settings?.annotationParents ?? [];
  return {
    ...video,
    details: undefined,
    organized: false,
    groups: [],
    galleries: [],
    date: fields.includes("date") ? video.date : undefined,
    studioId: fields.includes("studio") ? video.studioId : undefined,
    studioName: fields.includes("studio") ? video.studioName : undefined,
    performers: fields.includes("performers") ? video.performers : [],
    tags:
      fields.includes("tags") && parents.length > 0
        ? (video.tags ?? []).filter((tag) =>
            parents.some(
              (parent) => parent !== tag.id && trees[parent]?.includes(tag.id),
            ),
          )
        : [],
  };
}

/**
 * What a card shows of a video beyond its cover and title, for the grid preview to show too: the
 * performers when Card details has them, and the matching tags (null while cards show no tags).
 */
export function presentedDetails(
  video: MediaItem,
  review: VideoReview | null,
  trees: Record<number, number[]>,
): { performers: string[]; tags: Array<{ id: number; name: string }> | null } {
  const presented = presentedVideo(video, review, trees);
  const settings = review?.presentation;
  const fields = settings?.annotations ?? [];
  return {
    performers: fields.includes("performers")
      ? (presented.performers ?? []).map((performer) => performer.name)
      : [],
    tags:
      fields.includes("tags") && settings?.annotationParents?.length
        ? (presented.tags ?? [])
        : null,
  };
}

/**
 * Queue tag bins for the grid's chip row: "On this page", then a toggle chip per descendant tag
 * of the review's bin parents found on the loaded page, with its page count. A pressed chip
 * narrows the queue to that tag; pressing it again lifts the narrowing. A chip in use stays
 * offered even when no card on the page carries its tag any more.
 */
export function TagBins({
  videos,
  review,
  savedObjectFilter,
  trees,
  disabled,
  onToggle,
}: {
  videos: MediaItem[];
  review: VideoReview;
  /** The review's saved queue filter, where the bins' conditions end. */
  savedObjectFilter: Record<string, unknown>;
  trees: Record<number, number[]>;
  disabled: boolean;
  onToggle(id: number): void;
}) {
  const parents = review.presentation?.binParents ?? [];
  const allowed = new Set(
    parents.flatMap((id) => (trees[id] ?? []).filter((child) => child !== id)),
  );
  // Once the bin trees are known, only their tags count as bins in use.
  const treesKnown = parents.every((id) => trees[id]);
  const active = splitQueueBins(
    review.view.objectFilter,
    savedObjectFilter,
    review.presentation?.filterBins,
  ).bins.filter(
    (id): id is number => typeof id === "number" && (!treesKnown || allowed.has(id)),
  );
  const bins = new Map<number, { name: string; count: number }>();
  for (const video of videos)
    for (const tag of video.tags ?? [])
      if (allowed.has(tag.id)) {
        const bin = bins.get(tag.id) ?? { name: tag.name, count: 0 };
        bin.count++;
        bins.set(tag.id, bin);
      }
  const absent = active.filter((id) => !bins.has(id));
  const absentNames = useTagNames(absent);
  for (const id of absent)
    bins.set(id, {
      name: absentNames[id] === undefined ? "…" : (absentNames[id] ?? "Unavailable tag"),
      count: 0,
    });
  if (!parents.length) return null;
  const shown = [...bins].sort((a, b) => a[1].name.localeCompare(b[1].name));
  return (
    <div className="dq-bins" role="group" aria-label="Tag bins on this page">
      <span className="dq-bins-label" aria-hidden="true">
        On this page
      </span>
      {shown.map(([id, bin]) => {
        const pressed = active.includes(id);
        return (
          <button
            className="dq-bin"
            type="button"
            aria-pressed={pressed}
            title={pressed ? `Show every video again, not only ${bin.name}` : `Show only videos tagged ${bin.name}`}
            disabled={disabled}
            key={id}
            onClick={() => onToggle(id)}
          >
            {pressed && <Check aria-hidden="true" />}
            {bin.name} <span className="dq-bin-count">{bin.count}</span>
          </button>
        );
      })}
      {!shown.length && <span className="dq-bins-empty">No matching tag bins on this page.</span>}
    </div>
  );
}

/**
 * Queue filter bins for the grid's chip row, after the tag bins: a toggle chip per filter bin of
 * the review, in its group, counted over the whole queue as it would read with the chip pressed.
 * Pressing a chip of a group lifts the group's other chip; pressing it again lifts its own.
 */
export function FilterBins({
  review,
  savedObjectFilter,
  queueFilter,
  queueCount,
  disabled,
  countsPaused,
  onToggle,
}: {
  review: VideoReview;
  savedObjectFilter: Record<string, unknown>;
  /** The queue's find filter (search, sort, page), which the counts keep. */
  queueFilter: Record<string, unknown>;
  /** The loaded queue's total, which a pressed chip shows. */
  queueCount: number | null;
  disabled: boolean;
  /** Holds the counts back while the queue is busy or its criteria are not yet known. */
  countsPaused: boolean;
  onToggle(key: string): void;
}) {
  const definitions = review.presentation?.filterBins ?? [];
  const pressed = splitQueueBins(review.view.objectFilter, savedObjectFilter, definitions).bins;
  const counts = useFilterBinCounts(review, savedObjectFilter, queueFilter, countsPaused);
  if (!definitions.length) return null;
  const groups = new Map<string, FilterBin[]>();
  for (const bin of definitions) {
    const group = bin.group?.trim() ?? "";
    groups.set(group, [...(groups.get(group) ?? []), bin]);
  }
  return (
    <>
      {[...groups].map(([group, bins]) => (
        <div
          className="dq-bins"
          role="group"
          aria-label={group ? `${group} bins` : "Filter bins"}
          key={group}
        >
          {group && (
            <span className="dq-bins-label" aria-hidden="true">
              {group}
            </span>
          )}
          {bins.map((bin) => {
            const on = pressed.includes(bin.key);
            const count = on ? queueCount : counts[bin.key];
            return (
              <button
                className="dq-bin"
                type="button"
                aria-pressed={on}
                title={
                  on
                    ? `Show every video again, not only ${bin.label}`
                    : `Show only videos matching ${bin.label}`
                }
                disabled={disabled}
                key={bin.key}
                onClick={() => onToggle(bin.key)}
              >
                {on && <Check aria-hidden="true" />}
                {bin.label}{" "}
                <span className="dq-bin-count">
                  {count === undefined || count === null ? "…" : count}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </>
  );
}

/**
 * How many videos each unpressed filter bin would leave in the queue, by key: missing while a
 * count loads or when it could not. Counts wait while the queue is busy, and are taken again only
 * when the queue's criteria change, not when it only turns a page.
 */
function useFilterBinCounts(
  review: VideoReview,
  savedObjectFilter: Record<string, unknown>,
  queueFilter: Record<string, unknown>,
  paused: boolean,
): Record<string, number> {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const { page: _page, ...criteria } = queueFilter;
  const signature = JSON.stringify([
    review.view.objectFilter,
    review.view.searchMode,
    review.presentation?.filterBins ?? [],
    savedObjectFilter,
    criteria,
  ]);
  // The criteria whose counts are shown or loading; cleared when loading them was cut short.
  const counted = useRef<string | null>(null);
  useEffect(() => {
    if (paused || counted.current === signature) return;
    counted.current = signature;
    setCounts({});
    let outstanding = 0;
    const controller = new AbortController();
    const pressed = splitQueueBins(
      review.view.objectFilter,
      savedObjectFilter,
      review.presentation?.filterBins,
    ).bins;
    for (const bin of review.presentation?.filterBins ?? []) {
      if (pressed.includes(bin.key)) continue;
      outstanding++;
      void countMedia(toggleQueueBin(review, bin.key, savedObjectFilter), queueFilter, controller.signal)
        .then((count) => {
          if (!controller.signal.aborted) setCounts((current) => ({ ...current, [bin.key]: count }));
        })
        .catch(() => {
          // The chip keeps its placeholder; pressing it still loads the queue and its error.
        })
        .finally(() => {
          if (!controller.signal.aborted) outstanding--;
        });
    }
    return () => {
      // Counts cut short are taken again once the queue is free.
      if (outstanding > 0) counted.current = null;
      controller.abort();
    };
    // The signature stands for the review, saved filter and queue filter it is built from.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, paused]);
  return counts;
}

type Expression = { operator?: unknown; children?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * A pressed queue bin: a tag bin by its tag's ID, a filter bin by its key. Either narrows the
 * queue as one more AND layer over the criteria it was pressed on.
 */
export type QueueBin = number | string;

/** The tag of a bin condition, as withQueueBin writes it: exactly that tag, without subtags. */
function binTagId(child: unknown): number | null {
  if (!isRecord(child) || Object.keys(child).length !== 1 || !isRecord(child.filter)) return null;
  const filter = child.filter;
  if (Object.keys(filter).length !== 1 || !isRecord(filter.tagsCriterion)) return null;
  const { value, modifier, depth, ...rest } = filter.tagsCriterion;
  return Array.isArray(value) &&
    value.length === 1 &&
    typeof value[0] === "number" &&
    modifier === "INCLUDES" &&
    depth === 0 &&
    !Object.keys(rest).length
    ? value[0]
    : null;
}

/** A filter bin's condition as one expression child: its criteria, its expression, or both. */
function filterBinNode(filter: Record<string, unknown>): Record<string, unknown> {
  const { _filterExpression, ...plain } = filter;
  if (!_filterExpression) return { filter: plain };
  if (!Object.keys(plain).length) return { group: _filterExpression };
  return {
    group: { operator: "AND", children: [{ filter: plain }, { group: _filterExpression }] },
  };
}

/**
 * The bin a layer's condition stands for: a filter bin whose condition it is, else the tag of an
 * exact-tag condition.
 */
function binOf(child: unknown, filterBins: readonly FilterBin[]): QueueBin | null {
  const bin = filterBins.find((candidate) =>
    objectFiltersEqual(child, filterBinNode(candidate.filter)),
  );
  return bin ? bin.key : binTagId(child);
}

/**
 * The bins applied to a queue filter, outermost last, and the filter they were applied to.
 * Undoes withQueueBin layer by layer: each layer is an AND of the previous plain criteria (when
 * there were any), the previous expression (when there was one) and the bin's condition. Peeling
 * stops at the review's saved filter, so a saved condition of the same shape is never taken for a
 * bin; the base is then that saved filter itself. A filter bin is known by its condition, so only
 * the given definitions are found; any other layer stays part of the base.
 */
export function splitQueueBins(
  objectFilter: Record<string, unknown>,
  saved?: Record<string, unknown>,
  filterBins: readonly FilterBin[] = [],
): {
  base: Record<string, unknown>;
  bins: QueueBin[];
} {
  let base = objectFilter;
  const bins: QueueBin[] = [];
  for (;;) {
    if (saved && objectFiltersEqual(base, saved)) {
      base = saved;
      break;
    }
    const keys = Object.keys(base);
    if (keys.length !== 1 || keys[0] !== "_filterExpression") break;
    const expression = base._filterExpression as Expression;
    if (!isRecord(expression) || expression.operator !== "AND" || !Array.isArray(expression.children))
      break;
    const children: unknown[] = expression.children;
    const bin = binOf(children.at(-1), filterBins);
    if (bin == null || children.length > 3) break;
    let plain: Record<string, unknown> = {};
    let group: Record<string, unknown> | null = null;
    let layered = true;
    for (const [index, child] of children.slice(0, -1).entries()) {
      if (!isRecord(child) || Object.keys(child).length !== 1) layered = false;
      else if (index === 0 && isRecord(child.filter) && Object.keys(child.filter).length)
        plain = child.filter;
      else if (!group && isRecord(child.group)) group = child.group;
      else layered = false;
    }
    if (!layered) break;
    bins.unshift(bin);
    base = group ? { ...plain, _filterExpression: group } : plain;
  }
  return { base, bins };
}

/**
 * The review with this bin applied, or lifted when it already is. Other bins keep their order,
 * except a filter bin of the same group, which pressing this one lifts; with none left, the
 * queue's filter is the saved one again, as saved.
 */
export function toggleQueueBin(
  review: VideoReview,
  bin: QueueBin,
  saved?: Record<string, unknown>,
): VideoReview {
  const filterBins = review.presentation?.filterBins ?? [];
  const { base, bins } = splitQueueBins(review.view.objectFilter, saved, filterBins);
  const groupOf = (key: QueueBin) =>
    filterBins.find((candidate) => candidate.key === key)?.group?.trim() || null;
  const group = groupOf(bin);
  const next = bins.includes(bin)
    ? bins.filter((other) => other !== bin)
    : [...bins.filter((other) => !group || groupOf(other) !== group), bin];
  return next.reduce(withQueueBin, { ...review, view: { ...review.view, objectFilter: base } });
}

/** The review narrowed by one more bin; a filter bin the review does not define is left out. */
export function withQueueBin(review: VideoReview, bin: QueueBin): VideoReview {
  let condition: Record<string, unknown>;
  if (typeof bin === "number")
    condition = { filter: { tagsCriterion: { value: [bin], modifier: "INCLUDES", depth: 0 } } };
  else {
    const definition = review.presentation?.filterBins?.find((candidate) => candidate.key === bin);
    if (!definition || !Object.keys(definition.filter).length) return review;
    condition = filterBinNode(definition.filter);
  }
  const { _filterExpression, ...ordinary } = review.view.objectFilter;
  return {
    ...review,
    view: {
      ...review.view,
      objectFilter: {
        _filterExpression: {
          operator: "AND",
          children: [
            ...(Object.keys(ordinary).length ? [{ filter: ordinary }] : []),
            ...(_filterExpression ? [{ group: _filterExpression }] : []),
            condition,
          ],
        },
      },
    },
  };
}
