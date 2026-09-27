import { useEffect, useState } from "react";
import { Check } from "@cove/runtime/lucide-react";
import { resolveTagTree, type MediaItem } from "./api";
import type { VideoReview } from "./model";
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
  const active = splitTagBins(review.view.objectFilter, savedObjectFilter).bins.filter(
    (id) => !treesKnown || allowed.has(id),
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

type Expression = { operator?: unknown; children?: unknown };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** The tag of a bin condition, as withTagBin writes it: exactly that tag, without subtags. */
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

/**
 * The bins applied to a queue filter, outermost last, and the filter they were applied to.
 * Undoes withTagBin layer by layer: each layer is an AND of the previous plain criteria (when
 * there were any), the previous expression (when there was one) and the bin's tag. Peeling stops
 * at the review's saved filter, so a saved condition of the same shape is never taken for a bin;
 * the base is then that saved filter itself.
 */
export function splitTagBins(
  objectFilter: Record<string, unknown>,
  saved?: Record<string, unknown>,
): {
  base: Record<string, unknown>;
  bins: number[];
} {
  let base = objectFilter;
  const bins: number[] = [];
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
    const id = binTagId(children.at(-1));
    if (id == null || children.length > 3) break;
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
    bins.unshift(id);
    base = group ? { ...plain, _filterExpression: group } : plain;
  }
  return { base, bins };
}

/**
 * The review with this bin applied, or lifted when it already is. Other bins keep their order;
 * with none left, the queue's filter is the saved one again, as saved.
 */
export function toggleTagBin(
  review: VideoReview,
  tagId: number,
  saved?: Record<string, unknown>,
): VideoReview {
  const { base, bins } = splitTagBins(review.view.objectFilter, saved);
  const next = bins.includes(tagId) ? bins.filter((id) => id !== tagId) : [...bins, tagId];
  return next.reduce(withTagBin, { ...review, view: { ...review.view, objectFilter: base } });
}

export function withTagBin(review: VideoReview, tagId: number): VideoReview {
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
            {
              filter: {
                tagsCriterion: {
                  value: [tagId],
                  modifier: "INCLUDES",
                  depth: 0,
                },
              },
            },
          ],
        },
      },
    },
  };
}
