import {
  presentCustomFieldCriteria,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  DetailListToolbar,
  AUDIO_CRITERIA,
  VIDEO_CRITERIA,
  PERFORMER_CRITERIA,
} from "@cove/runtime/components";
import { mediaLabel, request } from "./api";
import {
  conditionSeeksMissingTags,
  hasAssessmentSteps,
  OCCURRENCE_CONDITION_LABELS,
  reviewMediaKind,
  type OccurrenceReview,
} from "./model";
import { difference } from "./reviewTags";
import {
  planTags,
  previewOccurrenceBatch,
  runOccurrenceBatch,
  undoOccurrenceBatch,
  type BatchEntry,
  type OccurrenceBatch,
} from "./batchOccurrences";
import { ExistingAnswers } from "./ExistingAnswers";

// Bound label reads as well as occurrence work; cancellation aborts in-flight reads.
async function loadLabels(
  ids: number[],
  entity: "tags" | "performers",
  signal: AbortSignal,
) {
  const labels: Array<readonly [number, string]> = new Array(ids.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(5, ids.length) }, async () => {
      while (next < ids.length) {
        signal.throwIfAborted();
        const index = next++,
          id = ids[index];
        try {
          labels[index] = [
            id,
            (
              await request<{ name: string }>(`/api/${entity}/${id}`, {
                signal,
              })
            ).name,
          ];
        } catch (error) {
          signal.throwIfAborted();
          labels[index] = [
            id,
            `${entity === "tags" ? "Tag" : "Performer"} ${id}`,
          ];
        }
      }
    }),
  );
  return labels;
}

// Cove caches an identical filtered query for about a second after a write.
function settle(since: number, signal: AbortSignal) {
  const wait = 1100 - (Date.now() - since);
  if (wait <= 0) return Promise.resolve();
  return new Promise<void>((resolve, reject) => {
    const timer = window.setTimeout(resolve, wait);
    signal.addEventListener(
      "abort",
      () => {
        window.clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

export function BatchOccurrenceDialog({
  review,
  disabled,
  hidden = false,
  performerFlags = [],
  onOpen,
  onClose,
  onWrite,
}: {
  review: OccurrenceReview;
  disabled: boolean;
  hidden?: boolean;
  /** Flag tags on the one performer this batch targets. */
  performerFlags?: string[];
  onOpen(): void;
  onClose(wrote: boolean): void;
  onWrite(): void;
}) {
  const [open, setOpen] = useState(false);
  const [batch, setBatch] = useState<OccurrenceBatch | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [names, setNames] = useState<Record<number, string>>({});
  const [started, setStarted] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const displayReview = started && batch ? batch.review : review;
  const mediaKind = reviewMediaKind(displayReview);
  const labels = mediaLabel(mediaKind);
  const hostLabel = labels.queue;
  const fallbackTitle = mediaKind === "audio" ? "Audio" : "Scene";
  const [performerNames, setPerformerNames] = useState<string[]>([]);
  const [inspecting, setInspecting] = useState(false);
  const [, refresh] = useState(0);
  const [answersRevision, setAnswersRevision] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const cancel = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const wrote = useRef(false);
  const lastWrite = useRef(0);
  const running = useRef(false);
  const latest = useRef({ onClose, onWrite });
  latest.current = { onClose, onWrite };
  useEffect(() => {
    if (open) dialog.current?.showModal();
  }, [open]);
  useEffect(() => {
    if (!open || displayReview.occurrence.targetMode !== "selected") return;
    const abort = new AbortController();
    setPerformerNames([]);
    void loadLabels(
      displayReview.occurrence.performerIds,
      "performers",
      abort.signal,
    )
      .then((labels) => {
        if (!abort.signal.aborted)
          setPerformerNames(labels.map(([, name]) => name));
      })
      .catch(() => {});
    return () => abort.abort();
  }, [
    open,
    displayReview.occurrence.targetMode,
    JSON.stringify(displayReview.occurrence.performerIds),
  ]);
  useEffect(
    () => () => {
      cancel.current = true;
      controller.current?.abort();
    },
    [],
  );
  useEffect(() => {
    if (!busy) return;
    const prevent = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", prevent);
    return () => window.removeEventListener("beforeunload", prevent);
  }, [busy]);
  // Results and undo last only while the dialog stays open on this batch.
  function reset() {
    setBatch(null);
    setStarted(false);
    setUndoing(false);
    setReplace(false);
    setSelected([]);
    setNotice("");
    setError("");
    setInspecting(false);
  }
  function close() {
    if (running.current) return;
    setOpen(false);
    latest.current.onClose(wrote.current);
    wrote.current = false;
    reset();
    requestAnimationFrame(() => opener.current?.focus());
  }
  const actions =
    started && batch
      ? batch.actions
      : // Batches change tags only; assessments are answered one occurrence at a time.
        review.actions.filter((a) => a.steps.length && !hasAssessmentSteps(a));
  async function preview() {
    const chosen = actions.filter((action) => selected.includes(action.id));
    if (!chosen.length || running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    setNotice("Loading all matching occurrences…");
    setBatch(null);
    setStarted(false);
    setUndoing(false);
    setInspecting(false);
    controller.current = new AbortController();
    try {
      await settle(lastWrite.current, controller.current.signal);
      const result = await previewOccurrenceBatch(
        review,
        chosen,
        controller.current.signal,
        (count) =>
          setNotice(`Loaded ${count.toLocaleString()} matching occurrences…`),
      );
      // Tags already on the occurrences carry their names; ask only for the rest.
      const known = new Map<number, string>();
      for (const entry of result.entries)
        for (const application of entry.before.applications ?? [])
          known.set(application.tag.id, application.tag.name);
      const labels = await loadLabels(
        [
          ...new Set([
            ...result.actions.flatMap((action) =>
              action.steps.flatMap((step) => step.tagIds),
            ),
            ...result.review.occurrence.conditionTagIds,
            ...unresolvedCustomFieldTagIds(result.review.view.objectFilter),
          ]),
        ].filter((id) => !known.has(id)),
        "tags",
        controller.current.signal,
      );
      controller.current.signal.throwIfAborted();
      setNames({ ...Object.fromEntries(known), ...Object.fromEntries(labels) });
      setBatch(result);
      setNotice("Preview ready. No tags have been changed.");
    } catch (error) {
      setError(
        controller.current.signal.aborted
          ? "Preview cancelled. No tags were changed."
          : String(error instanceof Error ? error.message : error),
      );
      setNotice("");
    } finally {
      running.current = false;
      setBusy(false);
      controller.current = null;
    }
  }
  async function run(kind: "apply" | "retry" | "undo") {
    if (!batch || running.current) return;
    running.current = true;
    cancel.current = false;
    wrote.current = true;
    latest.current.onWrite();
    setBusy(true);
    setStarted(true);
    setError("");
    if (kind === "undo") setUndoing(true);
    setNotice(kind === "undo" ? "Undoing batch…" : "Applying batch…");
    const update = () => refresh((n) => n + 1);
    try {
      if (kind === "undo")
        await undoOccurrenceBatch(batch, () => cancel.current, update);
      else
        await runOccurrenceBatch(
          batch,
          replace,
          () => cancel.current,
          update,
          kind === "retry",
        );
      setNotice(
        cancel.current
          ? "Stopped after in-flight operations settled. Completed changes are retained."
          : kind === "undo"
            ? "Batch undo finished. Inspect any failures below."
            : "Batch finished. Inspect skipped or failed occurrences below.",
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      lastWrite.current = Date.now();
      running.current = false;
      setBusy(false);
      setAnswersRevision((value) => value + 1);
      update();
    }
  }
  const entries = batch?.entries ?? [];
  const plans = useMemo(
    () =>
      new Map(
        (batch?.entries ?? []).map((entry) => [
          entry.item.key,
          planTags(entry.before.ids, batch!.action, batch!.categories, replace),
        ]),
      ),
    [batch, replace],
  );
  const plan = (entry: BatchEntry) => plans.get(entry.item.key)!;
  const change = (entry: BatchEntry) =>
    difference(entry.before.ids, plan(entry).desired);
  const changing = (entry: BatchEntry) => {
    const delta = change(entry);
    return (
      entry.status === "pending" &&
      (delta.added.length > 0 || delta.removed.length > 0)
    );
  };
  const planText = (entry: BatchEntry) => {
    const current = plan(entry);
    // A skipped conflict shows what replacing it would do.
    const shown = current.skipped
      ? difference(
          entry.before.ids,
          planTags(entry.before.ids, batch!.action, batch!.categories, true)
            .desired,
        )
      : change(entry);
    return [
      current.skipped ? "Skipped unless conflicting answers are replaced. " : "",
      `Add: ${tagNames(shown.added)}; Remove: ${tagNames(shown.removed)}`,
      ...current.kept.map(
        (kept) =>
          `; Keeps ${tagNames(kept.existing)} instead of ${tagNames(kept.tagIds)}`,
      ),
    ].join("");
  };
  const conflicts = entries.filter((e) => e.conflict);
  const differing = entries.filter(
    (entry) => plan(entry).kept.length || plan(entry).replaced.length,
  );
  const count = (status: string) =>
    entries.filter((e) => e.status === status).length;
  const hasUndo = entries.some((e) => e.operation);
  const tagNames = (ids: number[]) =>
    ids.map((id) => names[id] ?? `Tag ${id}`).join(", ") || "None";
  const dated = entries
    .filter((entry) => entry.item.media.date)
    .sort((a, b) => a.item.media.date!.localeCompare(b.item.media.date!));
  const dateLink = (entry: BatchEntry, which: string) => (
    <a
      href={`/${mediaKind}/${entry.item.media.id}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`${which} ${labels.one}, ${entry.item.media.date}`}
      title={entry.item.media.title || fallbackTitle}
    >
      {entry.item.media.date}
    </a>
  );
  const singlePerformer =
    displayReview.occurrence.targetMode === "selected" &&
    displayReview.occurrence.performerIds.length === 1;
  const categorized =
    conditionSeeksMissingTags(displayReview.occurrence.condition) &&
    displayReview.occurrence.includeSubtags !== false &&
    displayReview.occurrence.conditionTagIds.length > 0;
  return (
    <>
      <button
        type="button"
        className="dq-button"
        hidden={hidden}
        ref={opener}
        disabled={disabled || !actions.length}
        onClick={() => {
          reset();
          onOpen();
          setOpen(true);
        }}
      >
        Apply to all matching occurrences
      </button>
      {open && (
        <dialog
          ref={dialog}
          className="dq-batch-dialog"
          aria-labelledby="dq-batch-title"
          aria-modal="true"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
        >
          <h2 id="dq-batch-title">Batch occurrence approval</h2>
          <p>
            Apply one or more answers across all matching pages. Only targeted
            performer occurrences change.
          </p>
          <p>
            Keep this page open while running. Results and undo last until you
            close this dialog or start a new batch.
          </p>
          <fieldset disabled={busy || started}>
            <legend>Batch scope and answers</legend>
            <p>
              Uses your current filters. To include every existing appearance,
              remove filters that exclude already answered occurrences.
            </p>
            <p>
              Performer scope:{" "}
              {displayReview.occurrence.targetMode === "all"
                ? "All performers"
                : displayReview.occurrence.targetMode === "selected"
                  ? performerNames.join(", ") ||
                    `${displayReview.occurrence.performerIds.length} selected performer(s)`
                  : "Matching performer criteria"}
              . Occurrence condition:{" "}
              {OCCURRENCE_CONDITION_LABELS[displayReview.occurrence.condition]}.
            </p>
            {performerFlags.length > 0 && (
              <p className="dq-batch-flag">
                <strong>Flagged: {performerFlags.join(", ")}.</strong> Check the
                earliest and latest {labels.many} before applying, or narrow
                the batch with a date filter.
              </p>
            )}
            {conditionSeeksMissingTags(displayReview.occurrence.condition) &&
              displayReview.occurrence.hideConfirmedAbsent !== false && (
                <p>
                  {displayReview.occurrence.condition === "excludes"
                    ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged."
                    : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged."}
                </p>
              )}
            {displayReview.occurrence.conditionTagIds.length > 0 && batch && (
              <p>
                Condition tags:{" "}
                {tagNames(displayReview.occurrence.conditionTagIds)}
                {displayReview.occurrence.includeSubtags === false
                  ? " (exact tags only)"
                  : " (including subtags)"}
                .
              </p>
            )}
            <p>
              Search: {String(displayReview.view.filter.q || "Any")}.{" "}
              {Object.keys(displayReview.view.objectFilter).length === 0 &&
                `${hostLabel[0].toUpperCase()}${hostLabel.slice(1)} filters: None.`}
            </p>
            <fieldset
              className="dq-batch-filter-summary"
              disabled
              aria-label={`Batch ${hostLabel} filters`}
            >
              <DetailListToolbar
                filter={displayReview.view.filter}
                objectFilter={presentCustomFieldCriteria(
                  displayReview.view.objectFilter,
                  names,
                )}
                criteriaDefinitions={mediaKind === "audio" ? AUDIO_CRITERIA : VIDEO_CRITERIA}
                customFieldEntityType={mediaKind}
                totalCount={0}
                sortOptions={[]}
                showSearch
                showSort={false}
                showPagingControls={false}
                onFilterChange={() => {}}
                onObjectFilterChange={() => {}}
              />
            </fieldset>
            {displayReview.occurrence.targetMode === "filter" && (
              <fieldset
                className="dq-batch-filter-summary"
                disabled
                aria-label="Batch performer criteria"
              >
                <DetailListToolbar
                  filter={{}}
                  objectFilter={displayReview.occurrence.performerFilter}
                  criteriaDefinitions={PERFORMER_CRITERIA}
                  totalCount={0}
                  sortOptions={[]}
                  showSearch={false}
                  showSort={false}
                  showPagingControls={false}
                  onFilterChange={() => {}}
                  onObjectFilterChange={() => {}}
                />
              </fieldset>
            )}
            {singlePerformer && (
              <ExistingAnswers
                review={displayReview}
                performerId={displayReview.occurrence.performerIds[0]}
                revision={answersRevision}
              />
            )}
            {!actions.length && (
              <p>
                Configure an occurrence tag action in this review before
                starting a batch.
              </p>
            )}
            <fieldset className="dq-batch-answers">
              <legend>Answers</legend>
              {actions.map((action) => (
                <label key={action.id} className="dq-checkbox">
                  <input
                    type="checkbox"
                    checked={started || selected.includes(action.id)}
                    onChange={(event) => {
                      setSelected(
                        event.target.checked
                          ? [...selected, action.id]
                          : selected.filter((id) => id !== action.id),
                      );
                      setBatch(null);
                      setNotice("");
                      setError("");
                    }}
                  />
                  {action.label}
                </label>
              ))}
            </fieldset>
            <button
              type="button"
              className="dq-button"
              disabled={!selected.length}
              onClick={() => void preview()}
            >
              Preview all matches
            </button>
            <label>
              Conflicting answers{" "}
              <select
                aria-label="Conflicting answers"
                value={replace ? "replace" : "skip"}
                onChange={(event) =>
                  setReplace(event.target.value === "replace")
                }
              >
                <option value="skip">Skip conflicts</option>
                <option value="replace">Replace conflicting answers</option>
              </select>
            </label>
            <p>
              Conflicts are existing tags an answer removes. Configure opposite
              answers as removals.
              {categorized &&
                " Each condition tag with its subtags is a category: an answer is added only where its category is still empty, and a different existing answer is kept unless conflicting answers are replaced."}
            </p>
          </fieldset>
          <div aria-live="polite">
            {notice && <p role="status">{notice}</p>}
            {error && <p role="alert">{error}</p>}
            {batch && (
              <>
                <p>
                  <strong>
                    {entries.length.toLocaleString()} occurrences in{" "}
                    {new Set(
                      entries.map((e) => e.item.media.id),
                    ).size.toLocaleString()}{" "}
                    {hostLabel}s
                  </strong>
                </p>
                {!started ? (
                  <p>
                    {entries.filter(changing).length.toLocaleString()} to
                    change; {count("unchanged").toLocaleString()} already
                    correct; {conflicts.length.toLocaleString()} conflicts (
                    {replace ? "will replace" : "will skip"}).
                    {differing.length > 0 &&
                      ` ${differing.length.toLocaleString()} already have a different answer in a category (${replace ? "will replace" : "kept"}).`}
                  </p>
                ) : (
                  <p>
                    {count("changed")} changed; {count("unchanged")} unchanged;{" "}
                    {count("skipped")} skipped; {count("failed")} failed;{" "}
                    {count("pending")} remaining.
                  </p>
                )}
                {entries.length > 0 && (
                  <p>
                    Dates:{" "}
                    {dated.length ? (
                      <>
                        {dateLink(dated[0], "Earliest")}
                        {dated.length > 1 && (
                          <> to {dateLink(dated[dated.length - 1], "Latest")}</>
                        )}
                      </>
                    ) : (
                      "none"
                    )}
                    {dated.length < entries.length &&
                      `; ${(entries.length - dated.length).toLocaleString()} without a date`}
                    .
                  </p>
                )}
              </>
            )}
          </div>
          {batch && (
            <>
              {!started && (
                <p>
                  Planned additions:{" "}
                  {tagNames([
                    ...new Set(entries.flatMap((e) => change(e).added)),
                  ])}
                  . Planned removals:{" "}
                  {tagNames([
                    ...new Set(entries.flatMap((e) => change(e).removed)),
                  ])}
                  .
                </p>
              )}
              <button
                type="button"
                className="dq-button"
                onClick={() => setInspecting(!inspecting)}
              >
                {inspecting
                  ? "Hide occurrence details"
                  : "Inspect occurrences and conflicts"}
              </button>
              {inspecting && (
                <div className="dq-batch-items">
                  <table>
                    <thead>
                      <tr>
                        <th>Occurrence</th>
                        <th>Changes / result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {entries.map((entry) => (
                        <tr key={entry.item.key}>
                          <td>
                            <a
                              href={`/${mediaKind}/${entry.item.media.id}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {entry.item.occurrence?.performer.name} —{" "}
                              {entry.item.media.title || fallbackTitle}
                            </a>
                          </td>
                          <td>
                            {entry.conflict && <strong>Conflict. </strong>}
                            {started
                              ? `${entry.status}. ${entry.error ?? ""}`
                              : planText(entry)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <div className="dq-row">
                {!undoing && (
                  <>
                    <button
                      type="button"
                      className="dq-button primary"
                      disabled={busy || !count("pending")}
                      onClick={() => void run("apply")}
                    >
                      {started ? "Continue remaining" : "Apply batch"}
                    </button>
                    {started && count("failed") > 0 && (
                      <button
                        type="button"
                        className="dq-button"
                        disabled={busy}
                        onClick={() => void run("retry")}
                      >
                        Retry failed occurrences
                      </button>
                    )}
                  </>
                )}
                {hasUndo && (
                  <button
                    type="button"
                    className="dq-button"
                    disabled={busy}
                    onClick={() => void run("undo")}
                  >
                    Undo batch
                  </button>
                )}
              </div>
            </>
          )}
          <div className="dq-row">
            {busy && (
              <button
                type="button"
                className="dq-button"
                onClick={() => {
                  cancel.current = true;
                  controller.current?.abort();
                  setNotice("Stopping after in-flight operations settle…");
                }}
              >
                Cancel {controller.current ? "preview" : "run"}
              </button>
            )}
            {started && (
              <button
                type="button"
                className="dq-button"
                disabled={busy}
                onClick={reset}
              >
                New batch
              </button>
            )}
            <button
              type="button"
              className="dq-button"
              disabled={busy}
              onClick={close}
            >
              Close
            </button>
          </div>
        </dialog>
      )}
    </>
  );
}
