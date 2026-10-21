import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Undo2, X } from "@cove/runtime/lucide-react";
import { mediaLabel } from "./api";
import {
  clearHistory,
  HISTORY_LIMIT,
  itemKey,
  loadHistory,
  subscribeHistory,
  undoRecord,
  type ChangeRecord,
  type ChangedItem,
} from "./history";
import { useTagNames } from "./tagNames";

function itemCount(record: ChangeRecord) {
  const count = record.items.length;
  const occurrences = record.items.some((item) => item.performer);
  const { one, many } = mediaLabel(record.kind);
  return `${count.toLocaleString()} ${occurrences ? (count === 1 ? "occurrence" : "occurrences") : count === 1 ? one : many}`;
}

function ChangeParts({
  item,
  names,
}: {
  item: ChangedItem;
  names: Record<number, string | null>;
}) {
  const name = (id: number) => item.names[id] ?? names[id] ?? `Tag ${id}`;
  const parts = [
    ...item.tags.added.map((id) => ({ id, text: `+ ${name(id)}`, kind: "added" })),
    ...item.tags.removed.map((id) => ({ id, text: `− ${name(id)}`, kind: "removed" })),
    ...item.absence.added.map((id) => ({ id, text: `Absent: ${name(id)}`, kind: "absent" })),
    ...item.absence.removed.map((id) => ({
      id,
      text: `No longer absent: ${name(id)}`,
      kind: "present",
    })),
  ];
  return (
    <span className="dq-history-parts">
      {parts.map((part) => (
        <span key={`${part.kind}-${part.id}`} className={`dq-history-part ${part.kind}`}>
          {part.text}
        </span>
      ))}
    </span>
  );
}

function Record({
  record,
  busy,
  progress,
  onUndo,
}: {
  record: ChangeRecord;
  busy: boolean;
  progress?: { done: number; total: number };
  onUndo(): void;
}) {
  const ids = useMemo(
    () =>
      [
        ...new Set(
          record.items.flatMap((item) => [
            ...item.tags.added,
            ...item.tags.removed,
            ...item.absence.added,
            ...item.absence.removed,
          ]),
        ),
      ].filter((id) => record.items.every((item) => !item.names[id])),
    [record],
  );
  const names = useTagNames(ids);
  const undone = record.items.filter((item) => item.undone).length;
  const failed = record.items.filter((item) => !item.undone && item.error).length;
  const open = record.items.length - undone;
  // A batch can hold thousands of items: they are rendered only while their list is open.
  const [expanded, setExpanded] = useState(record.items.length === 1);
  useEffect(() => {
    if (failed) setExpanded(true);
  }, [failed > 0]);
  return (
    <section className="dq-history-record" aria-label={record.label}>
      <div className="dq-history-head">
        <div className="dq-history-title">
          <strong>{record.label}</strong>
          <span className="dq-history-meta">
            {record.reviewName} · {new Date(record.at).toLocaleString()} · {itemCount(record)}
          </span>
          <span className="dq-history-status" role="status">
            {progress
              ? `Undoing… ${progress.done.toLocaleString()} of ${progress.total.toLocaleString()}`
              : !open
                ? "Undone"
                : failed
                  ? `${failed.toLocaleString()} could not be undone. Inspect them below, then undo again.`
                  : undone
                    ? `${undone.toLocaleString()} undone, ${open.toLocaleString()} still applied`
                    : ""}
          </span>
        </div>
        <button
          type="button"
          className="dq-button"
          disabled={busy || !open}
          onClick={onUndo}
        >
          <Undo2 aria-hidden="true" />
          Undo
        </button>
      </div>
      <details
        className="dq-history-items"
        open={expanded}
        onToggle={(event) => setExpanded(event.currentTarget.open)}
      >
        <summary>
          {record.items.length === 1 ? "Show the change" : `Show all ${itemCount(record)}`}
        </summary>
        {expanded && (
        <ul>
          {record.items.map((item) => (
            <li
              key={`${item.mediaId}:${item.performer?.id ?? ""}`}
              className={item.undone ? "undone" : undefined}
            >
              <a href={`/${record.kind}/${item.mediaId}`} target="_blank" rel="noreferrer">
                {item.performer ? `${item.performer.name} — ` : ""}
                {item.title}
              </a>
              <ChangeParts item={item} names={names} />
              {item.undone && <span className="dq-history-undone">Undone</span>}
              {!item.undone && item.error && (
                <span className="dq-history-error">{item.error}</span>
              )}
            </li>
          ))}
        </ul>
        )}
      </details>
    </section>
  );
}

/**
 * What Data Quality changed in this browser, newest first, each change with its own Undo. Undo
 * restores only what each item still shows of the change, and keeps later edits to other tags.
 */
export function RecentChanges({
  onClose,
  onUndone,
}: {
  onClose(): void;
  /**
   * Called after an undo, with the change as it left it and the queue keys of the items this undo
   * restored, so the page can read what it shows again and bring them back into view.
   */
  onUndone(record: ChangeRecord, keys: string[]): void;
}) {
  const ids = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [records, setRecords] = useState(loadHistory);
  const [running, setRunning] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number }>();
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const clearButton = useRef<HTMLButtonElement>(null);
  const keepButton = useRef<HTMLButtonElement>(null);
  useEffect(() => subscribeHistory(() => setRecords(loadHistory())), []);
  useEffect(() => {
    // Focus goes back to whatever opened the dialog (the list's button, or the More menu's button).
    const opener = document.activeElement as HTMLElement | null;
    dialog.current?.showModal();
    body.current?.focus();
    return () => {
      if (opener?.isConnected) opener.focus();
    };
  }, []);
  // Asking replaces the button that had focus, and answering removes the question: focus follows.
  const asked = useRef(false);
  useEffect(() => {
    if (confirmClear) keepButton.current?.focus();
    else if (asked.current)
      (clearButton.current?.disabled === false ? clearButton.current : body.current)?.focus();
    asked.current = confirmClear;
  }, [confirmClear]);
  const busy = running !== null;
  async function undo(record: ChangeRecord) {
    const pending = new Set(record.items.filter((item) => !item.undone).map(itemKey));
    setRunning(record.id);
    setConfirmClear(false);
    setError("");
    setProgress({ done: 0, total: record.items.filter((item) => !item.undone).length });
    try {
      await undoRecord(record.id, (done, total) => setProgress({ done, total }));
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      setRunning(null);
      setProgress(undefined);
      const after = loadHistory().find((item) => item.id === record.id) ?? record;
      onUndone(
        after,
        after.items
          .filter((item) => item.undone && pending.has(itemKey(item)))
          .map(itemKey),
      );
      // The Undo button was disabled while it ran, which drops focus to the page behind the dialog,
      // where Esc and the review's keys would act; keep it in the dialog.
      requestAnimationFrame(() => {
        if (!dialog.current?.contains(document.activeElement)) body.current?.focus();
      });
    }
  }
  return (
    <dialog
      ref={dialog}
      className="dq-batch-dialog dq-history-dialog"
      aria-labelledby={`${ids}-title`}
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClose={() => {
        if (busy) dialog.current?.showModal();
        else onClose();
      }}
    >
      <div className="dq-batch-header">
        <Undo2 aria-hidden="true" />
        <h2 id={`${ids}-title`}>Recent changes</h2>
        <button
          type="button"
          className="dq-batch-close"
          aria-label="Close dialog"
          disabled={busy}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </button>
      </div>
      <div className="dq-batch-body" ref={body} tabIndex={-1} role="group" aria-label="Recorded changes">
        <p className="dq-history-intro">
          What Data Quality changed from this browser, newest first; the last{" "}
          {HISTORY_LIMIT} changes are kept. Undo restores only the tags a change touched, where
          they are still as it left them, and keeps later edits.
        </p>
        {error && (
          <p role="alert" className="dq-alert">
            {error}
          </p>
        )}
        {records.length ? (
          records.map((record) => (
            <Record
              key={record.id}
              record={record}
              busy={busy}
              progress={running === record.id ? progress : undefined}
              onUndo={() => void undo(record)}
            />
          ))
        ) : (
          <p className="dq-history-empty">No changes recorded yet.</p>
        )}
      </div>
      <div className="dq-batch-footer">
        {confirmClear ? (
          <>
            <span>Forget every recorded change? Nothing is undone.</span>
            <button
              type="button"
              className="dq-button dq-button-danger"
              disabled={busy}
              onClick={() => {
                clearHistory();
                setConfirmClear(false);
              }}
            >
              Clear history
            </button>
            <button
              ref={keepButton}
              type="button"
              className="dq-button"
              onClick={() => setConfirmClear(false)}
            >
              Keep it
            </button>
          </>
        ) : (
          <button
            ref={clearButton}
            type="button"
            className="dq-button"
            disabled={busy || !records.length}
            onClick={() => setConfirmClear(true)}
          >
            Clear history…
          </button>
        )}
        <span className="dq-batch-footer-space" />
        <button type="button" className="dq-button" disabled={busy} onClick={onClose}>
          Close
        </button>
      </div>
    </dialog>
  );
}
