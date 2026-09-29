import { useEffect, useState } from "react";
import { Flag } from "@cove/runtime/lucide-react";
import { mediaLabel } from "./api";
import type { AttentionEntry } from "./attention";
import type { TagTrees } from "./effectPreview";
import type { MediaKind, MediaReviewAction, OccurrenceReview } from "./model";
import {
  answerCategories,
  loadPerformerAnswers,
  type AnswerCategory,
  type AnswerSummary,
} from "./performerAnswers";
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

const NO_TREES: TagTrees = new Map();

/**
 * The answer groups whose different answers mark the row mixed, when the row is a category that
 * holds several answers at once; empty when the row's own answers are mixed.
 */
function mixedGroups(row: AnswerCategory): string[] {
  return row.mixed.filter((found) => found.key !== row.key).map((found) => found.name);
}

/** What a row's Mixed badge says in full: where the different answers are. */
function mixedTitle(row: AnswerCategory): string {
  const groups = mixedGroups(row);
  if (groups.length) return `This performer has different answers in ${groups.join(", ")}.`;
  return `This performer has different answers in this ${row.kind === "group" ? "group" : "category"}.`;
}

/**
 * A performer's answers per category (answerCategories): a Mixed badge where they differ in a
 * category that takes one answer, and a flag badge on the categories a flag of theirs affects.
 */
export function ExistingAnswersView({
  summary,
  error,
  mediaKind,
  actions = [],
  trees = NO_TREES,
  flags = [],
  className = "",
}: PerformerAnswers & {
  mediaKind: MediaKind;
  /**
   * The review's actions: their answer groups outside the condition categories get rows too, and
   * with `trees`, the review's resolved tree removals, they tell the categories that take one
   * answer, the only ones that can be mixed.
   */
  actions?: readonly MediaReviewAction[];
  trees?: TagTrees;
  /** Where the performer's flags ask for attention; a category they touch shows its flags. */
  flags?: readonly AttentionEntry[];
  className?: string;
}) {
  const labels = mediaLabel(mediaKind);
  const items = (count: number) =>
    `${count.toLocaleString()} ${count === 1 ? labels.one : labels.many}`;
  const rows = summary ? answerCategories(summary, actions, trees) : [];
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
          const groups = mixedGroups(row);
          return (
            <div className="dq-answer-group" key={row.key}>
              <div className="dq-answer-category">
                <span>{row.name}</span>
                {row.mixed.length > 0 && (
                  <span
                    className="dq-badge dq-badge-warning dq-answer-mixed"
                    title={mixedTitle(row)}
                  >
                    <Flag aria-hidden="true" />
                    Mixed
                    {/* The groups a row holding several answers is mixed in, as the flags are named. */}
                    {groups.length > 0 && (
                      <span className="dq-answer-mixed-names"> in {groups.join(", ")}</span>
                    )}
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
