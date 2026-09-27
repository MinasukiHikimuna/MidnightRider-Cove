import { useEffect, useState } from "react";
import { mediaLabel } from "./api";
import { reviewMediaKind, type MediaKind, type OccurrenceReview } from "./model";
import { loadPerformerAnswers, type AnswerSummary } from "./performerAnswers";
import { ReviewTagBadge } from "./TagDisplay";

export interface PerformerAnswers {
  summary: AnswerSummary | null;
  error: string;
}
const NO_ANSWERS: PerformerAnswers = { summary: null, error: "" };

/**
 * The answers one performer already has, read again when the review's answers change or
 * `revision` does (after writes). Without a performer nothing is read.
 */
export function usePerformerAnswers(
  review: OccurrenceReview,
  performerId: number | null,
  revision = 0,
): PerformerAnswers {
  const [answers, setAnswers] = useState<PerformerAnswers>(NO_ANSWERS);
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
    setAnswers(NO_ANSWERS);
    if (performerId === null) return;
    const abort = new AbortController();
    loadPerformerAnswers(review, performerId, abort.signal)
      .then((summary) => {
        if (!abort.signal.aborted) setAnswers({ summary, error: "" });
      })
      .catch((failure) => {
        if (!abort.signal.aborted)
          setAnswers({
            summary: null,
            error: failure instanceof Error ? failure.message : "Request failed.",
          });
      });
    return () => abort.abort();
  }, [key, revision]);
  return answers;
}

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
  const answers = usePerformerAnswers(review, performerId, revision);
  return <ExistingAnswersView {...answers} mediaKind={reviewMediaKind(review)} />;
}

/** A performer's answers per condition category, with a Mixed badge where they differ. */
export function ExistingAnswersView({
  summary,
  error,
  mediaKind,
  className = "",
}: PerformerAnswers & { mediaKind: MediaKind; className?: string }) {
  const labels = mediaLabel(mediaKind);
  const items = (count: number) =>
    `${count.toLocaleString()} ${count === 1 ? labels.one : labels.many}`;
  return (
    <section
      className={`dq-panel-section dq-performer-answers ${className}`.trim()}
      aria-label="Existing answers"
    >
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
