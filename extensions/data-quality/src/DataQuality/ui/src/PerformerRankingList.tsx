import { Flag, RefreshCw } from "@cove/runtime/lucide-react";
import type { ProfileTag } from "./attention";
import { PerformerAvatar } from "./PerformerAvatar";
import type { PerformerRanking } from "./performerRanking";

/** Without a way to tell the review's flags, nobody is flagged. */
const noFlags = (_tags: readonly ProfileTag[]) => "";

export function PerformerRankingList({
  ranking,
  busy,
  error,
  focus,
  disabled,
  labels,
  flagLabel = noFlags,
  onFocus,
  onMore,
  onRefresh,
}: {
  ranking: PerformerRanking | null;
  busy: boolean;
  error: string;
  focus?: number;
  disabled: boolean;
  labels: { one: string; many: string; queue: string };
  /**
   * The review's flags on a performer's profile tags in words, naming the categories they affect
   * ("Flagged: A (affects B)"), or empty when the flags do not flag the performer.
   */
  flagLabel?(tags: readonly ProfileTag[]): string;
  onFocus(performerId: number): void;
  onMore(): void;
  onRefresh(): void;
}) {
  const shown = ranking ? ranking.ranked.slice(0, ranking.limit) : [];
  // Performers left uncounted may still have work, unless they appear in nothing at all.
  const more =
    !!ranking &&
    (ranking.ranked.length > ranking.limit ||
      (ranking.candidates[ranking.cursor]?.total ?? 0) > 0);
  return (
    <div className="dq-performer-ranking">
      <div className="dq-performer-ranking-status">
        {error ? (
          <p role="alert">Could not rank performers. {error}</p>
        ) : busy ? (
          <p role="status">Counting matching {labels.many} per performer…</p>
        ) : ranking ? (
          <p>
            {shown.length
              ? `Most matching ${labels.queue}s first`
              : `No performer has matching ${labels.many}.`}
          </p>
        ) : null}
        <button
          type="button"
          className="dq-icon-button"
          aria-label="Refresh counts"
          title="Refresh counts"
          disabled={busy || disabled}
          onClick={onRefresh}
        >
          <RefreshCw aria-hidden="true" />
        </button>
      </div>
      <div className="dq-queue-list">
        {shown.map((performer) => {
          const count = `${performer.count.toLocaleString()} matching ${performer.count === 1 ? labels.one : labels.many}`;
          const flags = flagLabel(performer.tags);
          return (
            <button
              type="button"
              className="dq-queue-row dq-ranked-performer"
              key={performer.id}
              aria-label={`${performer.name}, ${count}${flags ? `. ${flags}` : ""}`}
              title={flags || undefined}
              aria-current={focus === performer.id ? "true" : undefined}
              disabled={disabled}
              onClick={() => onFocus(performer.id)}
            >
              <PerformerAvatar performer={performer} />
              <span className="dq-queue-row-title">{performer.name}</span>
              {flags && <Flag className="dq-flag-icon" aria-hidden="true" />}
              <span className="dq-ranked-count" aria-hidden="true">
                {performer.count.toLocaleString()}
              </span>
            </button>
          );
        })}
      </div>
      {more && !busy && !error && (
        <button
          type="button"
          className="dq-button dq-ranking-more"
          disabled={disabled}
          onClick={onMore}
        >
          Show more performers
        </button>
      )}
    </div>
  );
}
