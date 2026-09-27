import { useEffect, useState } from "react";
import { mediaLabel } from "./api";
import { reviewMediaKind, type OccurrenceReview } from "./model";
import { loadPerformerAnswers, type AnswerSummary } from "./performerAnswers";

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
  return (
    <section className="dq-performer-answers" aria-label="Existing answers">
      <h3>Existing answers</h3>
      {error ? (
        <p role="alert">Could not load existing answers. {error}</p>
      ) : !summary ? (
        <p>Loading existing answers…</p>
      ) : (
        <>
          <p>
            {summary.answered
              ? `Answered on ${summary.answered.toLocaleString()} of this performer’s ${labels.many}.`
              : `None of this performer’s ${labels.many} is answered yet.`}
          </p>
          <ul>
            {summary.groups
              .filter((group) => group.id !== null || group.tags.length)
              .map((group) => (
                <li key={group.id ?? "other"}>
                  {group.name}:{" "}
                  {group.tags.length
                    ? group.tags
                        .map((tag) => `${tag.name} ×${tag.count.toLocaleString()}`)
                        .join(", ")
                    : "None"}
                  {group.id !== null && group.tags.length > 1 && (
                    <strong className="dq-answers-mixed"> Mixed answers</strong>
                  )}
                </li>
              ))}
          </ul>
        </>
      )}
    </section>
  );
}
