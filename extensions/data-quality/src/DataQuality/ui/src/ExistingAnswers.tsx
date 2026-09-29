import { useEffect, useState } from "react";
import { Flag } from "@cove/runtime/lucide-react";
import { mediaLabel } from "./api";
import type { AttentionEntry } from "./attention";
import type { MediaKind, MediaReviewAction, OccurrenceReview } from "./model";
import { answerCategories, loadPerformerAnswers, type AnswerSummary } from "./performerAnswers";
import { ReviewTagBadge } from "./TagDisplay";

export interface PerformerAnswers {
  summary: AnswerSummary | null;
  error: string;
}
const NO_ANSWERS: PerformerAnswers = { summary: null, error: "" };

/**
 * The answers one performer already has, read again when the review's answers change or
 * `revision` does (after writes). Without a review or a performer nothing is read. A read after
 * writes keeps the answers it replaces until it lands, so what they show (Mixed badges, the
 * performer's mixed answers) does not blink out on every write.
 */
export function usePerformerAnswers(
  review: OccurrenceReview | null,
  performerId: number | null,
  revision = 0,
): PerformerAnswers {
  const settings = review?.occurrence;
  const key = JSON.stringify([
    review?.entityType,
    performerId,
    settings?.condition,
    settings?.conditionTagIds,
    settings?.includeSubtags,
    settings?.tagIds,
    review?.actions.map((action) => action.steps),
  ]);
  const [answers, setAnswers] = useState<{ key: string; value: PerformerAnswers }>({
    key,
    value: NO_ANSWERS,
  });
  useEffect(() => {
    // Another performer or other answers start over; the same ones stay while read again.
    setAnswers((current) => (current.key === key ? current : { key, value: NO_ANSWERS }));
    if (review === null || performerId === null) return;
    const abort = new AbortController();
    loadPerformerAnswers(review, performerId, abort.signal)
      .then((summary) => {
        if (!abort.signal.aborted) setAnswers({ key, value: { summary, error: "" } });
      })
      .catch((failure) => {
        if (!abort.signal.aborted)
          // The error shows; answers read before for the same performer still count meanwhile.
          setAnswers((current) => ({
            key,
            value: {
              summary: current.key === key ? current.value.summary : null,
              error: failure instanceof Error ? failure.message : "Request failed.",
            },
          }));
      });
    return () => abort.abort();
  }, [key, revision]);
  return answers.key === key ? answers.value : NO_ANSWERS;
}

/**
 * A performer's answers per category (answerCategories): a Mixed badge where they differ, and a
 * flag badge on the categories a flag of theirs affects.
 */
export function ExistingAnswersView({
  summary,
  error,
  mediaKind,
  actions = [],
  flags = [],
  className = "",
}: PerformerAnswers & {
  mediaKind: MediaKind;
  /** The review's actions, whose answer groups outside the condition categories get rows too. */
  actions?: readonly MediaReviewAction[];
  /** Where the performer's flags ask for attention; a category they touch shows its flags. */
  flags?: readonly AttentionEntry[];
  className?: string;
}) {
  const labels = mediaLabel(mediaKind);
  const items = (count: number) =>
    `${count.toLocaleString()} ${count === 1 ? labels.one : labels.many}`;
  const rows = summary ? answerCategories(summary, actions) : [];
  const flagsOn = (members: readonly number[]) => [
    ...new Set(
      flags
        .filter((entry) => entry.tagIds?.some((id) => members.includes(id)))
        .flatMap((entry) => entry.flags),
    ),
  ];
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
        rows.map((row) => {
          const flagged = row.kind === "other" ? [] : flagsOn(row.members);
          return (
            <div className="dq-answer-group" key={row.key}>
              <div className="dq-answer-category">
                <span>{row.name}</span>
                {row.kind !== "other" && row.tags.length > 1 && (
                  <span
                    className="dq-badge dq-badge-warning"
                    title="This performer has different answers in this category."
                  >
                    <Flag aria-hidden="true" />
                    Mixed
                  </span>
                )}
                {flagged.length > 0 && (
                  <span
                    className="dq-badge dq-badge-warning dq-answer-flag"
                    title={`Flagged: ${flagged.join(", ")}`}
                  >
                    <Flag aria-hidden="true" />
                    <span className="dq-answer-flag-names">
                      <span className="dq-sr-only">Flagged: </span>
                      {flagged.join(", ")}
                    </span>
                  </span>
                )}
              </div>
              {row.tags.length ? (
                <ul className="dq-tags" aria-label={row.name}>
                  {row.tags.map((tag) => (
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
          );
        })
      )}
    </section>
  );
}
