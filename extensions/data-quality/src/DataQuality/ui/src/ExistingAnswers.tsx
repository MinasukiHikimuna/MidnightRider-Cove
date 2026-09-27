import { useEffect, useState } from "react";
import { mediaLabel } from "./api";
import { reviewMediaKind, type OccurrenceReview } from "./model";
import { loadPerformerAnswers, type AnswerSummary } from "./performerAnswers";
import { ReviewTagBadge } from "./TagDisplay";

export function ExistingAnswers({
  review,
  performerId,
  revision = 0,
}: {
  review: OccurrenceReview;
  performerId: number;
  /** Changes after writes, so the summary reflects them. */
  revision?: number;
}) {
  const [summary, setSummary] = useState<AnswerSummary | null>(null);
  const [error, setError] = useState("");
  const labels = mediaLabel(reviewMediaKind(review));
  const settings = review.occurrence;
  const key = JSON.stringify([
    review.entityType,
    performerId,
    settings.condition,
    settings.conditionTagIds,
    settings.includeSubtags,
    settings.tagIds,
    review.actions.map((action) => action.steps),
  ]);
  useEffect(() => {
    const abort = new AbortController();
    setSummary(null);
    setError("");
    loadPerformerAnswers(review, performerId, abort.signal)
      .then((result) => {
        if (!abort.signal.aborted) setSummary(result);
      })
      .catch((failure) => {
        if (!abort.signal.aborted)
          setError(failure instanceof Error ? failure.message : "Request failed.");
      });
    return () => abort.abort();
  }, [key, revision]);
  const items = (count: number) =>
    `${count.toLocaleString()} ${count === 1 ? labels.one : labels.many}`;
  return (
    <section className="dq-panel-section dq-performer-answers" aria-label="Existing answers">
      <div className="dq-panel-heading">
        <h3 className="dq-eyebrow">Existing answers</h3>
        {summary && (
          <span>
            {summary.answered ? `${items(summary.answered)} answered` : "none answered yet"}
          </span>
        )}
      </div>
      {error ? (
        <p role="alert">Could not load existing answers. {error}</p>
      ) : !summary ? (
        <p className="dq-muted">Loading existing answers…</p>
      ) : (
        summary.groups
          .filter((group) => group.id !== null || group.tags.length)
          .map((group) => (
            <div className="dq-answer-group" key={group.id ?? "other"}>
              <div className="dq-answer-category">
                <span>{group.name}</span>
                {group.id !== null && group.tags.length > 1 && (
                  <span
                    className="dq-badge dq-badge-warning"
                    title="This performer has different answers in this category."
                  >
                    Mixed
                  </span>
                )}
              </div>
              {group.tags.length ? (
                <ul className="dq-tags" aria-label={group.name}>
                  {group.tags.map((tag) => (
                    <li className="dq-tag" key={tag.id}>
                      <ReviewTagBadge tag={tag} />
                      <span className="dq-chip-count" aria-hidden="true">
                        {tag.count.toLocaleString()}
                      </span>
                      <span className="dq-sr-only">, {items(tag.count)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="dq-muted">None</p>
              )}
            </div>
          ))
      )}
    </section>
  );
}
