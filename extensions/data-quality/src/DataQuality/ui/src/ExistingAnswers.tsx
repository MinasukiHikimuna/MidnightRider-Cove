import { useEffect, useState } from "react";
import { Flag } from "@cove/runtime/lucide-react";
import { groupKey } from "./answerGroups";
import { mediaLabel } from "./api";
import { mixedAttention, mixedEntriesFor, type AttentionEntry } from "./attention";
import { NO_TREES, type TagTrees } from "./effectPreview";
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

/** Where a row is mixed, in the words of its badge (see mixedIn). */
interface MixedIn {
  /** The places inside the row that the badge names: none when the row's own answers differ. */
  names: string[];
  /**
   * Whether answers differ here beyond those places: in a place with the row's own name, which
   * would only repeat it, or in answers only categories outside the row speak for (see `note`).
   */
  here: boolean;
  /**
   * Where the attention lists the answers mixed here when categories around the row, or beside
   * it, speak for them: " (listed under Body)", or " (partly listed under Cut)" while the rest are
   * listed under the row's own name. Empty when no category outside the row speaks for any.
   */
  note: string;
}

/**
 * Where a row is mixed, as the performer's attention names it (a mixed condition category taking
 * one answer speaks for each mixed category it holds, see mixedAttention). The row's own mixed
 * answers need no name, only the categories they are listed under when one speaks for them. Each
 * mixed answer group inside a row holding several answers is named by the places inside the row
 * that speak for it, less one with the row's own name, which would only repeat it; a group only
 * categories outside the row speak for is "here", listed under them.
 */
function mixedIn(row: AnswerCategory, entries: readonly AttentionEntry[]): MixedIn {
  const inRow = (entry: AttentionEntry) =>
    entry.tagIds?.every((id) => row.members.includes(id)) ?? false;
  const names = new Set<string>();
  const under = new Set<string>();
  for (const found of row.mixed) {
    const speakers = mixedEntriesFor(found, entries).filter((entry) => entry.key !== row.key);
    const inside = found.key === row.key ? [] : speakers.filter(inRow);
    if (inside.length) inside.forEach((entry) => names.add(entry.name));
    else speakers.forEach((entry) => under.add(entry.name));
  }
  const own = groupKey(row.name);
  const others = [...names].filter((name) => groupKey(name) !== own);
  const ownName = others.length < names.size;
  const note = under.size
    ? ` (${ownName ? "partly " : ""}listed under ${[...under].join(", ")})`
    : "";
  return { names: others, here: ownName || under.size > 0, note };
}

/** What a row's Mixed badge says in full: where the different answers are. */
function mixedTitle(row: AnswerCategory, { names, here, note }: MixedIn): string {
  const self = `this ${row.kind === "group" ? "group" : "category"}${note}`;
  const where = !names.length
    ? self
    : here
      ? `${self} and in ${names.join(", ")}`
      : names.join(", ");
  return `This performer has different answers in ${where}.`;
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
  // Where the performer's attention names the mixed answers: the badges name the same places.
  const mixedEntries = mixedAttention(rows);
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
          const mixed = mixedIn(row, mixedEntries);
          // The tooltip's note on where answers mixed here are listed, also for readers who
          // cannot hover the badge: screen readers hear it where the tooltip places it.
          const note = mixed.note ? <span className="dq-sr-only">{mixed.note}</span> : null;
          return (
            <div className="dq-answer-group" key={row.key}>
              <div className="dq-answer-category">
                <span>{row.name}</span>
                {row.mixed.length > 0 && (
                  <span
                    className="dq-badge dq-badge-warning dq-answer-mixed"
                    title={mixedTitle(row, mixed)}
                  >
                    <Flag aria-hidden="true" />
                    Mixed
                    {/* Where a row holding several answers is mixed, as the flags are named. */}
                    {mixed.names.length > 0 ? (
                      <span className="dq-answer-mixed-names">
                        {mixed.here && " here"}
                        {note}
                        {` ${mixed.here ? "and in" : "in"} ${mixed.names.join(", ")}`}
                      </span>
                    ) : (
                      note
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
