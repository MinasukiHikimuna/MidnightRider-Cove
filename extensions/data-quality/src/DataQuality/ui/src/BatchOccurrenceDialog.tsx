import {
  presentCustomFieldCriteria,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
import { useEffect, useRef, useState } from "react";
import {
  DetailListToolbar,
  VIDEO_CRITERIA,
  PERFORMER_CRITERIA,
} from "@cove/runtime/components";
import { request } from "./api";
import type { OccurrenceReview } from "./model";
import { difference } from "./reviewTags";
import {
  previewOccurrenceBatch,
  runOccurrenceBatch,
  undoOccurrenceBatch,
  type OccurrenceBatch,
} from "./batchOccurrences";

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

export function BatchOccurrenceDialog({
  review,
  disabled,
  hidden = false,
  onOpen,
  onClose,
  onWrite,
}: {
  review: OccurrenceReview;
  disabled: boolean;
  hidden?: boolean;
  onOpen(): void;
  onClose(wrote: boolean): void;
  onWrite(): void;
}) {
  const [open, setOpen] = useState(false);
  const [batch, setBatch] = useState<OccurrenceBatch | null>(null);
  const [selected, setSelected] = useState("");
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [names, setNames] = useState<Record<number, string>>({});
  const [started, setStarted] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const displayReview = started && batch ? batch.review : review;
  const [freshRequested, setFreshRequested] = useState(false);
  const [performerNames, setPerformerNames] = useState<string[]>([]);
  const [inspecting, setInspecting] = useState(false);
  const [, refresh] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const cancel = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const wrote = useRef(false);
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
  function close() {
    if (running.current) return;
    setOpen(false);
    latest.current.onClose(wrote.current);
    wrote.current = false;
    requestAnimationFrame(() => opener.current?.focus());
  }
  async function preview() {
    const action = review.actions.find((a) => a.id === selected);
    if (!action || running.current) return;
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
      const result = await previewOccurrenceBatch(
        review,
        action,
        controller.current.signal,
        (count) =>
          setNotice(`Loaded ${count.toLocaleString()} matching occurrences…`),
      );
      const labels = await loadLabels(
        [
          ...new Set([
            ...result.touched,
            ...result.review.occurrence.conditionTagIds,
            ...unresolvedCustomFieldTagIds(result.review.view.objectFilter),
          ]),
        ],
        "tags",
        controller.current.signal,
      );
      controller.current.signal.throwIfAborted();
      setNames(Object.fromEntries(labels));
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
      running.current = false;
      setBusy(false);
      update();
    }
  }
  const entries = batch?.entries ?? [];
  const conflicts = entries.filter((e) => e.conflict);
  const count = (status: string) =>
    entries.filter((e) => e.status === status).length;
  const actions =
    started && batch
      ? [batch.action]
      : review.actions.filter((a) => a.steps.length);
  const hasUndo = entries.some((e) => e.operation);
  const tagNames = (ids: number[]) =>
    ids.map((id) => names[id] ?? `Tag ${id}`).join(", ") || "None";
  return (
    <>
      <button
        type="button"
        className="dq-button"
        hidden={hidden}
        ref={opener}
        disabled={disabled || !actions.length}
        onClick={() => {
          if (!started) {
            setBatch(null);
            setNotice("");
            setError("");
          }
          onOpen();
          setOpen(true);
          setSelected(
            actions.some((a) => a.id === selected)
              ? selected
              : (actions[0]?.id ?? ""),
          );
        }}
      >
        {started ? "Batch results / undo" : "Apply to all matching occurrences"}
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
            Apply one answer across all matching pages. Only targeted performer
            occurrences change.
          </p>
          <p>
            Keep this page open while running. Results and undo last until you
            leave this workspace.
          </p>
          <fieldset disabled={busy || started}>
            <legend>Batch scope and action</legend>
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
              {displayReview.occurrence.condition === "any"
                ? "Any occurrence tags"
                : {
                    includes: "Has any selected tag",
                    includesAll: "Has all selected tags",
                    excludes: "Has none of the selected tags",
                    isNull: "Has no occurrence tags",
                  }[displayReview.occurrence.condition]}
              .
            </p>
            {displayReview.occurrence.conditionTagIds.length > 0 && batch && (
              <p>
                Condition tags:{" "}
                {tagNames(displayReview.occurrence.conditionTagIds)}.
              </p>
            )}
            <p>
              Search: {String(displayReview.view.filter.q || "Any")}.{" "}
              {Object.keys(displayReview.view.objectFilter).length === 0 &&
                "Scene filters: None."}
            </p>
            <fieldset
              className="dq-batch-filter-summary"
              disabled
              aria-label="Batch scene filters"
            >
              <DetailListToolbar
                filter={displayReview.view.filter}
                objectFilter={presentCustomFieldCriteria(
                  displayReview.view.objectFilter,
                  names,
                )}
                criteriaDefinitions={[
                  ...VIDEO_CRITERIA,
                  {
                    id: "custom-fields",
                    label: "Custom Fields",
                    filterKey: "customFieldCriteria",
                  },
                ]}
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
            {!actions.length && (
              <p>
                Configure an occurrence tag action in this review before
                starting a batch.
              </p>
            )}
            <label>
              Answer{" "}
              <select
                aria-label="Batch answer"
                value={selected}
                onChange={(event) => {
                  setSelected(event.target.value);
                  setBatch(null);
                  setNotice("");
                }}
              >
                {actions.map((action) => (
                  <option value={action.id} key={action.id}>
                    {action.label}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="button"
              className="dq-button"
              disabled={!actions.length}
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
              Conflicts are existing tags this action removes. Configure
              opposite answers as removals.
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
                      entries.map((e) => e.item.video.id),
                    ).size.toLocaleString()}{" "}
                    scenes
                  </strong>
                </p>
                {!started ? (
                  <p>
                    {entries
                      .filter(
                        (e) =>
                          e.status === "pending" && (replace || !e.conflict),
                      )
                      .length.toLocaleString()}{" "}
                    to change; {count("unchanged").toLocaleString()} already
                    correct; {conflicts.length.toLocaleString()} conflicts (
                    {replace ? "will replace" : "will skip"}).
                  </p>
                ) : (
                  <p>
                    {count("changed")} changed; {count("unchanged")} unchanged;{" "}
                    {count("skipped")} skipped; {count("failed")} failed;{" "}
                    {count("pending")} remaining.
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
                    ...new Set(
                      entries
                        .filter((e) => replace || !e.conflict)
                        .flatMap(
                          (e) => difference(e.before.ids, e.desired).added,
                        ),
                    ),
                  ])}
                  . Planned removals:{" "}
                  {tagNames([
                    ...new Set(
                      entries
                        .filter((e) => replace || !e.conflict)
                        .flatMap(
                          (e) => difference(e.before.ids, e.desired).removed,
                        ),
                    ),
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
                              href={`/video/${entry.item.video.id}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {entry.item.occurrence?.performer.name} —{" "}
                              {entry.item.video.title || "Scene"}
                            </a>
                          </td>
                          <td>
                            {entry.conflict && <strong>Conflict. </strong>}
                            {started
                              ? `${entry.status}. ${entry.error ?? ""}`
                              : `Add: ${tagNames(difference(entry.before.ids, entry.desired).added)}; Remove: ${tagNames(difference(entry.before.ids, entry.desired).removed)}`}
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
          {freshRequested && (
            <div role="group" aria-label="Discard batch results">
              <p>
                Starting a new batch discards these results and their undo
                history. Existing tag changes remain.
              </p>
              <button
                type="button"
                className="dq-button"
                disabled={busy}
                onClick={() => {
                  setBatch(null);
                  setStarted(false);
                  setReplace(false);
                  setSelected(
                    review.actions.find((action) => action.steps.length)?.id ??
                      "",
                  );
                  setUndoing(false);
                  setNotice("");
                  setFreshRequested(false);
                }}
              >
                Discard results and start new batch
              </button>
              <button
                type="button"
                className="dq-button"
                onClick={() => setFreshRequested(false)}
              >
                Keep results
              </button>
            </div>
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
                onClick={() => setFreshRequested(true)}
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
