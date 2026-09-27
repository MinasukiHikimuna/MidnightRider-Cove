import { PerformerAvatar } from "./PerformerAvatar";
import type { PerformerRanking } from "./performerRanking";

export function PerformerRankingList({
  ranking,
  busy,
  error,
  focus,
  disabled,
  labels,
  onFocus,
  onMore,
  onRefresh,
}: {
  ranking: PerformerRanking | null;
  busy: boolean;
  error: string;
  focus?: number;
  disabled: boolean;
  labels: { one: string; many: string };
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
              ? `Most matching ${labels.many} first.`
              : `No performer has matching ${labels.many}.`}
          </p>
        ) : null}
        <button
          type="button"
          className="dq-button"
          disabled={busy || disabled}
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>
      <div className="dq-review-queue-items">
        {shown.map((performer) => {
          const count = `${performer.count.toLocaleString()} matching ${performer.count === 1 ? labels.one : labels.many}`;
          const flags = performer.flags.length
            ? `Flagged: ${performer.flags.join(", ")}`
            : "";
          return (
            <button
              type="button"
              className="dq-button dq-ranked-performer"
              key={performer.id}
              aria-label={`${performer.name}, ${count}${flags ? `. ${flags}` : ""}`}
              title={flags || undefined}
              aria-pressed={focus === performer.id}
              disabled={disabled}
              onClick={() => onFocus(performer.id)}
            >
              <PerformerAvatar performer={performer} />
              <span className="dq-queue-scene-title">{performer.name}</span>
              {flags && (
                <span className="dq-performer-flag" aria-hidden="true">
                  Flag
                </span>
              )}
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
          className="dq-button"
          disabled={disabled}
          onClick={onMore}
        >
          Show more performers
        </button>
      )}
    </div>
  );
}
