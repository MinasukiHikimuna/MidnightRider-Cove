import { useEffect, useState } from "react";
import { resolveTagTree, type Video } from "./api";
import type { VideoReview } from "./model";

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

export function annotations(
  video: Video,
  review: VideoReview | null,
  trees: Record<number, number[]>,
): string {
  const settings = review?.presentation;
  const fields = settings?.annotations ?? [];
  const parents = settings?.annotationParents ?? [];
  return [
    fields.includes("date") && video.date,
    fields.includes("studio") && video.studioName,
    fields.includes("performers") &&
      video.performers.map((p) => p.name).join(", "),
    fields.includes("tags") &&
      parents.length > 0 &&
      (video.tags ?? [])
        .filter(
          (tag) =>
            parents.some(
              (parent) => parent !== tag.id && trees[parent]?.includes(tag.id),
            ),
        )
        .map((tag) => tag.name)
        .join(", "),
  ]
    .filter(Boolean)
    .join(" · ");
}

export function TagBins({
  videos,
  review,
  trees,
  disabled,
  onChoose,
}: {
  videos: Video[];
  review: VideoReview;
  trees: Record<number, number[]>;
  disabled: boolean;
  onChoose(id: number): void;
}) {
  const allowed = new Set(
    (review.presentation?.binParents ?? []).flatMap((id) =>
      (trees[id] ?? []).filter((child) => child !== id),
    ),
  );
  const bins = new Map<number, { name: string; count: number }>();
  for (const video of videos)
    for (const tag of video.tags ?? [])
      if (allowed.has(tag.id)) {
        const bin = bins.get(tag.id) ?? { name: tag.name, count: 0 };
        bin.count++;
        bins.set(tag.id, bin);
      }
  if (!review.presentation?.binParents?.length) return null;
  return (
    <div className="dq-row" aria-label="Tag bins">
      <span>Tags on this page:</span>
      {[...bins]
        .sort((a, b) => a[1].name.localeCompare(b[1].name))
        .map(([id, bin]) => (
          <button
            className="dq-button"
            type="button"
            disabled={disabled}
            key={id}
            onClick={() => onChoose(id)}
          >
            {bin.name} ({bin.count})
          </button>
        ))}
      {!bins.size && <span>No matching tag bins on this page.</span>}
    </div>
  );
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
