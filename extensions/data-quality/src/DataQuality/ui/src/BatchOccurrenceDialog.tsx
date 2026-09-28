import {
  presentCustomFieldCriteria,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
import { Fragment, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import {
  DetailListToolbar,
  AUDIO_CRITERIA,
  VIDEO_CRITERIA,
  PERFORMER_CRITERIA,
} from "@cove/runtime/components";
import { Check, ChevronLeft, Flag, Layers, Undo2, X } from "@cove/runtime/lucide-react";
import { KeyCap } from "./ActionPad";
import { mediaLabel, request, type TagInfo } from "./api";
import {
  ConflictingAnswersError,
  planTags,
  previewOccurrenceBatch,
  runEntries,
  runOccurrenceBatch,
  undoEntries,
  undoOccurrenceBatch,
  type BatchEntry,
  type BatchStatus,
  type OccurrenceBatch,
} from "./batchOccurrences";
import type { TagTrees } from "./effectPreview";
import { ExistingAnswersView, usePerformerAnswers } from "./ExistingAnswers";
import { actionEffectParts, actionTagIds, type EffectPart } from "./FindAction";
import {
  conditionSeeksMissingTags,
  hasAssessmentSteps,
  OCCURRENCE_CONDITION_LABELS,
  reviewMediaKind,
  targetsAllPerformers,
  type MediaKind,
  type MediaReviewAction,
  type OccurrenceCondition,
  type OccurrenceReview,
} from "./model";
import { PerformerAvatar } from "./PerformerAvatar";
import { useActionKeyMap } from "./reviewKeys";
import { difference } from "./reviewTags";
import { ReviewTagBadge, WithoutTagImagePreviews } from "./TagDisplay";
import { namesOf, useTags } from "./tagNames";
import { sortTagsForDisplay } from "./tagOrder";

/** The scope names this many chosen performers; the rest are counted. */
const SHOWN_PERFORMERS = 5;

// Closing the dialog aborts the reads in flight.
function loadPerformerNames(ids: number[], signal: AbortSignal) {
  return Promise.all(
    ids.map(async (id) => {
      try {
        return (await request<{ name: string }>(`/api/performers/${id}`, { signal })).name;
      } catch {
        signal.throwIfAborted();
        return `Performer ${id}`;
      }
    }),
  );
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

type Step = "answers" | "preview" | "run";
type RunKind = "apply" | "retry" | "undo";
/**
 * The latest run, retry or undo. A retry or an undo counts the occurrences it processes itself
 * (`done` of `total`); a run counts the whole batch as the results do.
 */
interface Progress {
  kind: RunKind;
  total: number;
  done: number;
  stopped: boolean;
}
type PreviewGroup = "matching" | "change" | "correct" | "different";
const PREVIEW_GROUPS: ReadonlySet<string> = new Set<PreviewGroup>([
  "matching",
  "change",
  "correct",
  "different",
]);
/** The occurrences listed under the counts: a count's group, or those skipped or failed for one reason. */
interface Listed {
  group: PreviewGroup | BatchStatus;
  reason?: string;
}

const STEPS: Array<{ id: Step; label: string }> = [
  { id: "answers", label: "Answers" },
  { id: "preview", label: "Preview" },
  { id: "run", label: "Run" },
];
const RESULTS: Array<{ status: BatchStatus; label: string; tone?: "add" | "warn" }> = [
  { status: "changed", label: "Changed", tone: "add" },
  { status: "unchanged", label: "Unchanged" },
  { status: "skipped", label: "Skipped", tone: "warn" },
  { status: "failed", label: "Failed" },
  { status: "pending", label: "Remaining" },
];
/** What a condition with tags asks of an occurrence, followed by those tags. */
const CONDITION_WITH_TAGS: Partial<Record<OccurrenceCondition, string>> = {
  includes: "Has any of",
  includesAll: "Has all of",
  excludes: "Has none of",
  excludesAll: "Missing any of",
};
/** Long lists stay responsive; the counts above them are always complete. */
const LIST_LIMIT = 250;

/** An item's name as the queue shows it: its title, else its file name. */
function itemTitle(entry: BatchEntry, mediaKind: MediaKind) {
  const media = entry.item.media;
  return media.title || media.files?.[0]?.basename || (mediaKind === "audio" ? "Audio" : "Scene");
}

function Stepper({ step }: { step: Step }) {
  const current = STEPS.findIndex((item) => item.id === step);
  return (
    <ol className="dq-batch-steps" aria-label="Steps">
      {STEPS.map((item, index) => {
        const state = index < current ? "done" : index === current ? "current" : "next";
        return (
          <li key={item.id} data-state={state} aria-current={state === "current" ? "step" : undefined}>
            <span className="dq-batch-step-mark" aria-hidden="true">
              {state === "done" ? <Check /> : index + 1}
            </span>
            {item.label}
            {state === "done" && <span className="dq-sr-only">, done</span>}
          </li>
        );
      })}
    </ol>
  );
}

function Effect({ parts, id }: { parts: EffectPart[]; id?: string }) {
  return (
    <span className="dq-batch-effect" id={id}>
      {/* Spaces between the parts read well in a description; the flex layout ignores them. */}
      {parts.map((part, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span data-effect-tone={part.tone}>{part.text}</span>
        </Fragment>
      ))}
    </span>
  );
}

/** A count that lists its occurrences below while pressed; an empty count lists nothing. */
function StatTile({
  value,
  label,
  detail,
  tone,
  pressed,
  onToggle,
}: {
  value: number;
  label: string;
  detail?: string;
  tone?: "add" | "warn";
  pressed: boolean;
  onToggle(): void;
}) {
  return (
    <button
      type="button"
      className="dq-batch-stat"
      data-tone={value ? tone : undefined}
      aria-pressed={pressed && value > 0}
      disabled={!value}
      onClick={onToggle}
    >
      <span className="dq-batch-stat-value">{value.toLocaleString()}</span>{" "}
      <span className="dq-batch-stat-label">{label}</span>
      {detail && (
        <>
          {" "}
          <span className="dq-batch-stat-detail">{detail}</span>
        </>
      )}
    </button>
  );
}

/** Tags as Cove's badges, additions with "+", removals struck through with "−". */
function TagChanges({
  added,
  removed,
  tag,
  label,
}: {
  added: number[];
  removed: number[];
  tag(id: number): TagInfo;
  label?: string;
}) {
  return (
    <ul className="dq-tags" aria-label={label}>
      {sortTagsForDisplay(added.map(tag)).map((info) => (
        <li key={`added-${info.id}`} className="dq-tag dq-tag-added">
          <ins>
            + <ReviewTagBadge tag={info} />
          </ins>
        </li>
      ))}
      {sortTagsForDisplay(removed.map(tag)).map((info) => (
        <li key={`removed-${info.id}`} className="dq-tag dq-tag-removed">
          <del>
            − <ReviewTagBadge tag={info} />
          </del>
        </li>
      ))}
    </ul>
  );
}

function OccurrenceList({
  title,
  entries,
  mediaKind,
  resultHeading,
  describe,
}: {
  title: string;
  entries: BatchEntry[];
  mediaKind: MediaKind;
  resultHeading: string;
  describe(entry: BatchEntry): ReactNode;
}) {
  return (
    <section className="dq-batch-list" aria-label={title}>
      <div className="dq-panel-heading">
        <h3 className="dq-eyebrow">{title}</h3>
        {entries.length > LIST_LIMIT && (
          <span>
            First {LIST_LIMIT.toLocaleString()} of {entries.length.toLocaleString()}
          </span>
        )}
      </div>
      <div className="dq-batch-list-scroll">
        <table>
          <thead>
            <tr>
              <th scope="col">Occurrence</th>
              <th scope="col">Date</th>
              <th scope="col">{resultHeading}</th>
            </tr>
          </thead>
          <tbody>
            {entries.slice(0, LIST_LIMIT).map((entry) => (
              <tr key={entry.item.key}>
                <td>
                  <a
                    href={`/${mediaKind}/${entry.item.media.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {entry.item.occurrence?.performer.name} — {itemTitle(entry, mediaKind)}
                  </a>
                </td>
                <td className="dq-batch-list-date">{entry.item.media.date ?? ""}</td>
                <td>{describe(entry)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** A run's results in one pass over the batch, which a run updates once per occurrence. */
function tally(entries: BatchEntry[]) {
  const counts: Record<BatchStatus, number> = {
    pending: 0,
    changed: 0,
    unchanged: 0,
    skipped: 0,
    failed: 0,
  };
  const reasons = new Map<string, { status: BatchStatus; error: string; count: number }>();
  let recorded = 0;
  let retryable = false;
  for (const entry of entries) {
    counts[entry.status] += 1;
    if (entry.operation) recorded += 1;
    if (entry.status === "failed" && !entry.unverified) retryable = true;
    if ((entry.status === "skipped" || entry.status === "failed") && entry.error) {
      const key = `${entry.status}\u0000${entry.error}`;
      const reason = reasons.get(key) ?? { status: entry.status, error: entry.error, count: 0 };
      reason.count += 1;
      reasons.set(key, reason);
    }
  }
  return { counts, reasons: [...reasons.values()], recorded, retryable };
}

export function BatchOccurrenceDialog({
  review,
  disabled,
  performerFlags = [],
  trees,
  onOpen,
  onClose,
  onWrite,
}: {
  review: OccurrenceReview;
  disabled: boolean;
  /** Flag tags on the one performer this batch targets. */
  performerFlags?: string[];
  /** The review's resolved tree removals, so answers read "− rest of <tree>" as elsewhere. */
  trees?: TagTrees;
  onOpen(): void;
  onClose(wrote: boolean): void;
  onWrite(): void;
}) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("answers");
  const [batch, setBatch] = useState<OccurrenceBatch | null>(null);
  // The tags the previewed occurrences carry, with Cove's display data.
  const [carried, setCarried] = useState<Record<number, TagInfo>>({});
  const [selected, setSelected] = useState<string[]>([]);
  const [replace, setReplace] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  // The last preview refused the chosen answers (two in one condition category): previewing them
  // again cannot help, so the preview step offers Change answers instead.
  const [refused, setRefused] = useState(false);
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState<Progress | null>(null);
  const [listed, setListed] = useState<Listed | null>(null);
  const [performerNames, setPerformerNames] = useState<string[]>([]);
  const [answersRevision, setAnswersRevision] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const returnFocus = useRef(false);
  const cancel = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const wrote = useRef(false);
  const lastWrite = useRef(0);
  const running = useRef(false);
  const latest = useRef({ onClose, onWrite });
  latest.current = { onClose, onWrite };
  const ids = useId();
  // A run moves to the Run step, which stays until New batch or Close drops its results.
  const started = step === "run";
  const undoing = progress?.kind === "undo";
  // Completed results keep describing the batch that ran until they are dropped.
  const displayReview = started && batch ? batch.review : review;
  // Answers show the keys the review's actions have, whichever of them the batch lists.
  const keyMap = useActionKeyMap(displayReview.actions);
  const settings = displayReview.occurrence;
  const mediaKind = reviewMediaKind(displayReview);
  const labels = mediaLabel(mediaKind);
  const hostLabel = labels.queue;
  const actions =
    started && batch
      ? batch.actions
      : // Batches change tags only; assessments are answered one occurrence at a time.
        review.actions.filter((a) => a.steps.length && !hasAssessmentSteps(a));
  const chosen = actions.filter((action) => selected.includes(action.id));
  const singlePerformer =
    settings.targetMode === "selected" && settings.performerIds.length === 1;
  const answers = usePerformerAnswers(
    displayReview,
    open && singlePerformer ? settings.performerIds[0] : null,
    answersRevision,
  );
  const customFieldTagIds = unresolvedCustomFieldTagIds(displayReview.view.objectFilter);
  const shownTags = useTags(
    open
      ? [...actionTagIds(actions), ...settings.conditionTagIds, ...customFieldTagIds]
      : [],
  );
  const effectNames = useMemo(() => namesOf(shownTags), [shownTags]);
  const tagInfo = (id: number): TagInfo =>
    carried[id] ?? shownTags[id] ?? { id, name: `Tag ${id}` };
  const customFieldNames = JSON.stringify(
    Object.fromEntries(
      customFieldTagIds.flatMap((id) => {
        const name = shownTags[id]?.name;
        return name ? [[String(id), name]] : [];
      }),
    ),
  );
  // Cove's toolbar gets the same filter object until the filter or a tag name changes.
  const presentedFilter = useMemo(
    () =>
      presentCustomFieldCriteria(displayReview.view.objectFilter, JSON.parse(customFieldNames)),
    [displayReview.view.objectFilter, customFieldNames],
  );
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    dialog.current?.querySelector<HTMLElement>(".dq-batch-answer input")?.focus();
  }, [open]);
  // A step change, or a finished run, removes the control that had focus; keep focus in the
  // dialog on the step's content instead of losing it to the page.
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const root = dialog.current;
      const active = document.activeElement;
      if (!root || (active && active !== document.body && root.contains(active))) return;
      const target =
        step === "answers"
          ? (root.querySelector<HTMLElement>(".dq-batch-answer input:checked") ??
            root.querySelector<HTMLElement>(".dq-batch-answer input"))
          : root.querySelector<HTMLElement>("[data-batch-focus]");
      (target ?? body.current)?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, step, busy, batch]);
  // Closing hands focus back to Batch… once the workspace lets it be used again (after a write
  // it refreshes first), unless the reviewer has moved on meanwhile.
  useEffect(() => {
    if (open || disabled || !returnFocus.current) return;
    const frame = requestAnimationFrame(() => {
      const button = opener.current;
      if (!returnFocus.current || !button || button.disabled) return;
      returnFocus.current = false;
      const active = document.activeElement;
      if (!active || active === document.body) button.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, disabled]);
  useEffect(() => {
    if (!open || settings.targetMode !== "selected") return;
    const abort = new AbortController();
    setPerformerNames([]);
    void loadPerformerNames(settings.performerIds.slice(0, SHOWN_PERFORMERS), abort.signal)
      .then((names) => {
        if (!abort.signal.aborted) setPerformerNames(names);
      })
      .catch(() => {});
    return () => abort.abort();
  }, [open, settings.targetMode, JSON.stringify(settings.performerIds)]);
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
    setStep("answers");
    setBatch(null);
    setCarried({});
    setProgress(null);
    setReplace(false);
    setSelected([]);
    setNotice("");
    setError("");
    setRefused(false);
    setListed(null);
  }
  function close() {
    if (running.current) return;
    setOpen(false);
    latest.current.onClose(wrote.current);
    wrote.current = false;
    reset();
    returnFocus.current = true;
  }
  function toggle(id: string, checked: boolean) {
    setSelected((current) =>
      checked ? [...current, id] : current.filter((item) => item !== id),
    );
    setBatch(null);
    setCarried({});
    setNotice("");
    setError("");
    setRefused(false);
    setListed(null);
  }
  // A refusal stays in view on the answers until they change.
  function back() {
    setStep("answers");
    setListed(null);
    setNotice("");
  }
  function showPreview() {
    setStep("preview");
    // The preview stays until the answers change; a run re-reads each occurrence anyway.
    if (!batch) void preview();
  }
  function stop() {
    cancel.current = true;
    controller.current?.abort();
    setNotice("Stopping after in-flight operations settle…");
  }
  function toggleList(next: Listed) {
    setListed((current) =>
      current?.group === next.group && current.reason === next.reason ? null : next,
    );
  }
  const isListed = (group: Listed["group"], reason?: string) =>
    listed?.group === group && listed.reason === reason;
  async function preview() {
    if (!chosen.length || running.current) return;
    running.current = true;
    setBusy(true);
    setError("");
    setRefused(false);
    setNotice("Loading all matching occurrences…");
    setBatch(null);
    setCarried({});
    setListed(null);
    const abort = new AbortController();
    controller.current = abort;
    try {
      await settle(lastWrite.current, abort.signal);
      const result = await previewOccurrenceBatch(review, chosen, abort.signal, (count) =>
        setNotice(`Loaded ${count.toLocaleString()} matching occurrences…`),
      );
      abort.signal.throwIfAborted();
      // Tags already on the occurrences carry their names and colours.
      const tags: Record<number, TagInfo> = {};
      for (const entry of result.entries)
        for (const application of entry.before.applications ?? [])
          tags[application.tag.id] = application.tag;
      setCarried(tags);
      setBatch(result);
      setNotice("Preview ready. No tags have been changed.");
    } catch (failure) {
      setError(
        abort.signal.aborted
          ? "Preview cancelled. No tags were changed."
          : failure instanceof Error
            ? failure.message
            : String(failure),
      );
      setRefused(!abort.signal.aborted && failure instanceof ConflictingAnswersError);
      setNotice("");
    } finally {
      running.current = false;
      setBusy(false);
      controller.current = null;
    }
  }
  async function run(kind: RunKind) {
    if (!batch || running.current) return;
    const total = (kind === "undo" ? undoEntries(batch) : runEntries(batch, kind === "retry"))
      .length;
    running.current = true;
    cancel.current = false;
    wrote.current = true;
    latest.current.onWrite();
    setBusy(true);
    setStep("run");
    setError("");
    setProgress({ kind, total, done: 0, stopped: false });
    setNotice(
      kind === "undo"
        ? "Undoing the batch. Keep this page open until it finishes."
        : "Applying the answers. Keep this page open until it finishes.",
    );
    // Called once per processed occurrence; it also shows each result as it lands.
    const update = () =>
      setProgress((current) => current && { ...current, done: current.done + 1 });
    let failed = false;
    try {
      if (kind === "undo") await undoOccurrenceBatch(batch, () => cancel.current, update);
      else
        await runOccurrenceBatch(batch, replace, () => cancel.current, update, kind === "retry");
      setNotice(
        cancel.current
          ? "Stopped after in-flight operations settled. Completed changes are retained."
          : kind === "undo"
            ? "Batch undo finished. Inspect any failures below."
            : "Batch finished. Inspect skipped or failed occurrences below.",
      );
    } catch (failure) {
      failed = true;
      setNotice("");
      setError(failure instanceof Error ? failure.message : String(failure));
    } finally {
      lastWrite.current = Date.now();
      running.current = false;
      // An unexpected error ends the run early too; what it completed stays, with its undo.
      const stopped = cancel.current || failed;
      setProgress((current) => current && { ...current, stopped });
      setBusy(false);
      setAnswersRevision((value) => value + 1);
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
  const change = (entry: BatchEntry) => difference(entry.before.ids, plan(entry).desired);
  const changing = (entry: BatchEntry) => {
    const delta = change(entry);
    return (
      entry.status === "pending" && (delta.added.length > 0 || delta.removed.length > 0)
    );
  };
  // A tag the answers would remove, or another answer already in a condition category.
  const differs = (entry: BatchEntry) =>
    entry.conflict || plan(entry).kept.length > 0 || plan(entry).replaced.length > 0;
  // The preview's counts; statuses only change once a run starts, which leaves the preview.
  const previewStats = useMemo(() => {
    const list = batch?.entries ?? [];
    return {
      willChange: list.filter(changing).length,
      correct: list.filter((entry) => entry.status === "unchanged").length,
      different: list.filter(differs).length,
      hosts: new Set(list.map((entry) => entry.item.media.id)).size,
      added: [...new Set(list.flatMap((entry) => change(entry).added))],
      removed: [...new Set(list.flatMap((entry) => change(entry).removed))],
    };
  }, [plans]);
  const dated = useMemo(
    () =>
      (batch?.entries ?? [])
        .filter((entry) => entry.item.media.date)
        .sort((a, b) => a.item.media.date!.localeCompare(b.item.media.date!)),
    [batch],
  );
  const runStats = started ? tally(entries) : null;
  const keyOf = (id: string) =>
    keyMap.keys[displayReview.actions.findIndex((action) => action.id === id)] ?? "";
  const effectOf = (action: MediaReviewAction) =>
    actionEffectParts(action, effectNames, [], trees);
  const categorized =
    conditionSeeksMissingTags(settings.condition) &&
    settings.includeSubtags !== false &&
    settings.conditionTagIds.length > 0;
  const earliest = dated[0];
  const latestDated = dated.length > 1 ? dated[dated.length - 1] : undefined;
  const itemHref = (entry: BatchEntry) => `/${mediaKind}/${entry.item.media.id}`;
  const performerName = singlePerformer ? performerNames[0] : undefined;
  const previewGroups: Record<PreviewGroup, { title: string; test(entry: BatchEntry): boolean }> =
    {
      matching: { title: "Matching occurrences", test: () => true },
      change: { title: "Occurrences that will change", test: changing },
      correct: { title: "Occurrences already correct", test: (e) => e.status === "unchanged" },
      different: { title: "Occurrences with a different answer", test: differs },
    };

  function scopeChips() {
    const conditionPrefix = CONDITION_WITH_TAGS[settings.condition];
    const conditionWithTags = !!conditionPrefix && settings.conditionTagIds.length > 0;
    const shownPerformers = settings.performerIds.slice(0, SHOWN_PERFORMERS);
    const query = String(displayReview.view.filter.q ?? "").trim();
    const hidesAbsent =
      settings.condition === "excludes"
        ? "Occurrences confirmed absent for every condition tag are hidden and left unchanged."
        : "Occurrences confirmed absent for every condition tag they miss are hidden and left unchanged.";
    return (
      <div className="dq-batch-scope" role="group" aria-label="Batch scope">
        <span className="dq-batch-scope-label">Uses this queue</span>
        {targetsAllPerformers(settings) ? (
          <span className="dq-batch-chip">All performers</span>
        ) : settings.targetMode === "selected" ? (
          <>
            {shownPerformers.map((id, index) => (
              <span key={id} className="dq-batch-chip dq-batch-chip-performer">
                <PerformerAvatar performer={{ id, name: performerNames[index] ?? "" }} />
                {performerNames[index] ?? "…"}
              </span>
            ))}
            {settings.performerIds.length > shownPerformers.length && (
              <span className="dq-batch-chip">
                {(settings.performerIds.length - shownPerformers.length).toLocaleString()} more
                performers
              </span>
            )}
          </>
        ) : (
          <>
            <span className="dq-batch-chip">Performer criteria</span>
            <fieldset
              className="dq-batch-filter-summary"
              disabled
              aria-label="Batch performer criteria"
            >
              <DetailListToolbar
                filter={{}}
                objectFilter={settings.performerFilter}
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
          </>
        )}
        <span className="dq-batch-chip">
          {conditionWithTags ? conditionPrefix : OCCURRENCE_CONDITION_LABELS[settings.condition]}
          {conditionWithTags && (
            <span className="dq-batch-chip-tags">
              {sortTagsForDisplay(settings.conditionTagIds.map(tagInfo)).map((tag) => (
                <ReviewTagBadge key={tag.id} tag={tag} />
              ))}
            </span>
          )}
        </span>
        {conditionWithTags && (
          <span className="dq-batch-chip">
            {settings.includeSubtags === false ? "Exact tags only" : "Include subtags"}
          </span>
        )}
        {conditionSeeksMissingTags(settings.condition) &&
          settings.hideConfirmedAbsent !== false && (
            <span className="dq-batch-chip" title={hidesAbsent}>
              Hides confirmed absent
              <span className="dq-sr-only">: {hidesAbsent}</span>
            </span>
          )}
        {query && <span className="dq-batch-chip">Search “{query}”</span>}
        {Object.keys(displayReview.view.objectFilter).length > 0 && (
          <fieldset
            className="dq-batch-filter-summary"
            disabled
            aria-label={`Batch ${hostLabel} filters`}
          >
            <DetailListToolbar
              filter={displayReview.view.filter}
              objectFilter={presentedFilter}
              criteriaDefinitions={mediaKind === "audio" ? AUDIO_CRITERIA : VIDEO_CRITERIA}
              customFieldEntityType={mediaKind}
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
      </div>
    );
  }

  function flagCallout(links: boolean) {
    if (!performerFlags.length) return null;
    return (
      <div className="dq-batch-flag" role="note">
        <Flag aria-hidden="true" />
        <div>
          <p>
            <strong>{performerName || "This performer"}</strong> is flagged:{" "}
            <strong>{performerFlags.join(", ")}</strong>. Check the earliest and latest{" "}
            {labels.many} before applying, or narrow the batch with a date filter.
          </p>
          {links && earliest && (
            <p className="dq-batch-flag-links">
              <a href={itemHref(earliest)} target="_blank" rel="noreferrer">
                Earliest · {itemTitle(earliest, mediaKind)} · {earliest.item.media.date}
              </a>
              {latestDated && (
                <a href={itemHref(latestDated)} target="_blank" rel="noreferrer">
                  Latest · {itemTitle(latestDated, mediaKind)} · {latestDated.item.media.date}
                </a>
              )}
            </p>
          )}
        </div>
      </div>
    );
  }

  function answersStep() {
    return (
      <>
        {scopeChips()}
        {flagCallout(false)}
        <div className={`dq-batch-pick${singlePerformer ? " dq-batch-pick-answers" : ""}`}>
          <fieldset className="dq-batch-answers-field">
            <legend className="dq-eyebrow">Answers</legend>
            <p className="dq-muted">
              Tick the answers to apply to every matching occurrence, on all pages. They run
              together in review order, with one preview, one run and one undo. To include
              already answered occurrences, remove filters that exclude them.
            </p>
            <div className="dq-batch-answers">
              {actions.map((action, index) => {
                const key = keyOf(action.id);
                return (
                  <label key={action.id} className="dq-batch-answer">
                    <input
                      type="checkbox"
                      checked={selected.includes(action.id)}
                      aria-labelledby={`${ids}-answer-${index}`}
                      aria-describedby={`${ids}-effect-${index}`}
                      onChange={(event) => toggle(action.id, event.target.checked)}
                    />
                    <span className="dq-batch-answer-key">
                      {key && <KeyCap binding={key} hidden />}
                    </span>
                    <span className="dq-batch-answer-text">
                      <span
                        id={`${ids}-answer-${index}`}
                        className="dq-batch-answer-label"
                        title={action.label}
                      >
                        {action.label}
                      </span>
                      <Effect id={`${ids}-effect-${index}`} parts={effectOf(action)} />
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>
          {singlePerformer && (
            <ExistingAnswersView {...answers} mediaKind={mediaKind} className="dq-batch-card" />
          )}
        </div>
      </>
    );
  }

  function previewResults(current: OccurrenceBatch) {
    const stats = previewStats;
    const group =
      listed && PREVIEW_GROUPS.has(listed.group) ? (listed.group as PreviewGroup) : null;
    const groupEntries = group ? entries.filter(previewGroups[group].test) : [];
    const describe = (entry: BatchEntry) => {
      const planned = plan(entry);
      // A skipped conflict shows what replacing it would do.
      const shown = planned.skipped
        ? difference(
            entry.before.ids,
            planTags(entry.before.ids, current.action, current.categories, true).desired,
          )
        : change(entry);
      const none = !shown.added.length && !shown.removed.length;
      return (
        <div className="dq-batch-plan">
          {planned.skipped && (
            <span className="dq-batch-plan-note">Keeps its answer unless replaced:</span>
          )}
          {!none ? (
            <TagChanges added={shown.added} removed={shown.removed} tag={tagInfo} />
          ) : (
            !planned.kept.length && <span className="dq-muted">No change</span>
          )}
          {planned.kept.map((kept, index) => (
            <span key={index} className="dq-batch-plan-kept">
              Keeps{" "}
              {sortTagsForDisplay(kept.existing.map(tagInfo)).map((tag) => (
                <ReviewTagBadge key={tag.id} tag={tag} />
              ))}{" "}
              instead of{" "}
              {sortTagsForDisplay(kept.tagIds.map(tagInfo)).map((tag) => (
                <ReviewTagBadge key={tag.id} tag={tag} />
              ))}
            </span>
          ))}
        </div>
      );
    };
    return (
      <>
        <section className="dq-batch-results" aria-label="Preview">
          <div className="dq-batch-stats">
            <StatTile
              value={entries.length}
              label={entries.length === 1 ? "matching occurrence" : "matching occurrences"}
              detail={`in ${stats.hosts.toLocaleString()} ${stats.hosts === 1 ? hostLabel : `${hostLabel}s`}`}
              pressed={isListed("matching")}
              onToggle={() => toggleList({ group: "matching" })}
            />
            <StatTile
              value={stats.willChange}
              label="will change"
              tone="add"
              pressed={isListed("change")}
              onToggle={() => toggleList({ group: "change" })}
            />
            <StatTile
              value={stats.correct}
              label="already correct, no write"
              pressed={isListed("correct")}
              onToggle={() => toggleList({ group: "correct" })}
            />
            <StatTile
              value={stats.different}
              label={replace ? "replace a different answer" : "keep a different answer"}
              tone="warn"
              pressed={isListed("different")}
              onToggle={() => toggleList({ group: "different" })}
            />
          </div>
          {groupEntries.length > 0 ? (
            <OccurrenceList
              title={previewGroups[group!].title}
              entries={groupEntries}
              mediaKind={mediaKind}
              resultHeading="Planned change"
              describe={describe}
            />
          ) : (
            entries.length > 0 && (
              <p className="dq-batch-hint">Select a count to list its occurrences.</p>
            )
          )}
          {entries.length > 0 && (
            <p className="dq-batch-dates">
              <span>
                {earliest
                  ? `Dates ${earliest.item.media.date}${latestDated ? ` to ${latestDated.item.media.date}` : ""}`
                  : "No dates"}
              </span>
              {earliest && (
                <a
                  href={itemHref(earliest)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open earliest ${labels.one}, ${earliest.item.media.date}`}
                  title={itemTitle(earliest, mediaKind)}
                >
                  Open earliest
                </a>
              )}
              {latestDated && (
                <a
                  href={itemHref(latestDated)}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open latest ${labels.one}, ${latestDated.item.media.date}`}
                  title={itemTitle(latestDated, mediaKind)}
                >
                  Open latest
                </a>
              )}
              {dated.length < entries.length && (
                <span>{(entries.length - dated.length).toLocaleString()} without a date</span>
              )}
            </p>
          )}
          {(stats.added.length > 0 || stats.removed.length > 0) && (
            <div className="dq-batch-planned">
              <span className="dq-batch-planned-label">Tag changes</span>
              <TagChanges
                added={stats.added}
                removed={stats.removed}
                tag={tagInfo}
                label="Tag changes"
              />
            </div>
          )}
        </section>
        {stats.different > 0 && (
          <div className="dq-batch-choice">
            <span id={`${ids}-choice`} className="dq-batch-choice-label">
              Occurrences with a different answer
            </span>
            <div
              className="dq-segmented dq-segmented-fill"
              role="group"
              aria-labelledby={`${ids}-choice`}
            >
              <button type="button" aria-pressed={!replace} onClick={() => setReplace(false)}>
                Keep their answer
              </button>
              <button type="button" aria-pressed={replace} onClick={() => setReplace(true)}>
                Replace it
              </button>
            </div>
            <p className="dq-muted">
              A different answer is a tag the chosen answers would remove
              {categorized
                ? ", or another answer already in a condition category (each condition tag with its subtags); keeping it still fills the empty categories"
                : ""}
              . Configure opposite answers as removals.
            </p>
          </div>
        )}
      </>
    );
  }

  function previewStep() {
    return (
      <>
        {scopeChips()}
        {flagCallout(true)}
        <div className={`dq-batch-cards${singlePerformer ? "" : " dq-batch-cards-one"}`}>
          <section className="dq-batch-card" aria-labelledby={`${ids}-chosen`}>
            <div className="dq-panel-heading">
              <h3 id={`${ids}-chosen`} className="dq-eyebrow">
                Answers to apply
              </h3>
              <button type="button" className="dq-link-button" disabled={busy} onClick={back}>
                Change
              </button>
            </div>
            <ul className="dq-batch-chosen">
              {chosen.map((action) => {
                const key = keyOf(action.id);
                return (
                  <li key={action.id}>
                    <span className="dq-batch-chosen-chip">
                      {key && <KeyCap binding={key} hidden />}
                      {action.label}
                    </span>
                    <Effect parts={effectOf(action)} />
                  </li>
                );
              })}
            </ul>
          </section>
          {singlePerformer && (
            <ExistingAnswersView {...answers} mediaKind={mediaKind} className="dq-batch-card" />
          )}
        </div>
        {busy ? (
          <div className="dq-batch-loading" aria-hidden="true">
            <span className="dq-batch-bar dq-batch-bar-busy">
              <span />
            </span>
          </div>
        ) : (
          batch && previewResults(batch)
        )}
      </>
    );
  }

  function runStep(stats: ReturnType<typeof tally>) {
    const shown = progress ?? { kind: "apply" as const, total: 0, done: 0, stopped: false };
    // A run counts every matching occurrence, as the results do; a retry or an undo its own.
    const done = shown.kind === "apply" ? entries.length - stats.counts.pending : shown.done;
    const total = shown.kind === "apply" ? entries.length : shown.total;
    const title = busy
      ? shown.kind === "undo"
        ? "Undoing batch…"
        : shown.kind === "retry"
          ? "Retrying failed occurrences…"
          : "Applying answers…"
      : shown.kind === "undo"
        ? shown.stopped
          ? "Undo stopped"
          : "Undo finished"
        : shown.stopped
          ? "Stopped"
          : "Finished";
    const percent = total ? Math.round((done / total) * 100) : 100;
    const status =
      listed && !PREVIEW_GROUPS.has(listed.group) ? (listed.group as BatchStatus) : null;
    const statusLabel = (value: BatchStatus) =>
      RESULTS.find((result) => result.status === value)!.label;
    const statusEntries = status
      ? entries.filter(
          (entry) => entry.status === status && (!listed!.reason || entry.error === listed!.reason),
        )
      : [];
    return (
      <>
        <div className="dq-batch-progress">
          <div className="dq-panel-heading">
            <h3 tabIndex={-1} data-batch-focus="">
              {title}
            </h3>
            <span>
              {done.toLocaleString()} of {total.toLocaleString()} processed
            </span>
          </div>
          <span
            className="dq-batch-bar"
            role="progressbar"
            aria-label="Batch progress"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={done}
          >
            <span style={{ width: `${percent}%` }} />
          </span>
          {!busy && shown.kind === "undo" && (
            <p className="dq-batch-undone">
              Restored {(shown.total - stats.recorded).toLocaleString()} of{" "}
              {shown.total.toLocaleString()} {shown.total === 1 ? "change" : "changes"}.
            </p>
          )}
        </div>
        <section className="dq-batch-results" aria-label="Results">
          <div className="dq-batch-stats" data-count="5">
            {RESULTS.map((result) => (
              <StatTile
                key={result.status}
                value={stats.counts[result.status]}
                label={result.label}
                tone={result.tone}
                pressed={isListed(result.status)}
                onToggle={() => toggleList({ group: result.status })}
              />
            ))}
          </div>
          {stats.reasons.length > 0 && (
            <ul className="dq-batch-reasons">
              {stats.reasons.map((reason) => {
                const open = isListed(reason.status, reason.error);
                return (
                  <li key={`${reason.status}-${reason.error}`}>
                    <span>
                      {reason.count.toLocaleString()} {reason.status}: {reason.error}
                    </span>
                    <button
                      type="button"
                      className="dq-link-button"
                      aria-expanded={open}
                      onClick={() => toggleList({ group: reason.status, reason: reason.error })}
                    >
                      {open ? "Hide them" : "Show them"}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {statusEntries.length > 0 ? (
            <OccurrenceList
              title={
                listed!.reason
                  ? `${statusLabel(status!)}: ${listed!.reason}`
                  : `${statusLabel(status!)} occurrences`
              }
              entries={statusEntries}
              mediaKind={mediaKind}
              resultHeading="Result"
              describe={(entry) => entry.error ?? statusLabel(entry.status)}
            />
          ) : (
            <p className="dq-batch-hint">Select a count to list its occurrences.</p>
          )}
        </section>
        {stats.recorded > 0 && (
          <div className="dq-batch-undo">
            <button
              type="button"
              className="dq-button"
              disabled={busy}
              onClick={() => void run("undo")}
            >
              <Undo2 aria-hidden="true" />
              Undo batch
            </button>
            <p>
              {!undoing
                ? `Undo reverses ${stats.recorded === 1 ? "this change" : `these ${stats.recorded.toLocaleString()} changes`} and keeps later edits.`
                : shown.stopped || busy
                  ? `${stats.recorded.toLocaleString()} ${stats.recorded === 1 ? "change is" : "changes are"} still recorded.`
                  : `${stats.recorded.toLocaleString()} ${stats.recorded === 1 ? "change" : "changes"} could not be undone; undo again once their conflicts are resolved.`}{" "}
              It lasts until you close this dialog or start a new batch.
            </p>
          </div>
        )}
      </>
    );
  }

  // Each footer action has its own key: a button must never turn into another under focus
  // (a focused Cancel preview becoming Apply would start the writes on the next Enter).
  function footerAction(): ReactNode {
    if (step === "answers")
      return (
        <button
          key="preview"
          type="button"
          className="dq-button primary"
          disabled={!chosen.length}
          onClick={showPreview}
        >
          Preview all matches
        </button>
      );
    if (step === "preview") {
      if (busy)
        return (
          <button key="cancel-preview" type="button" className="dq-button" onClick={stop}>
            Cancel preview
          </button>
        );
      if (batch)
        return (
          <button
            key="apply"
            type="button"
            className="dq-button primary"
            disabled={!previewStats.willChange}
            onClick={() => void run("apply")}
          >
            Apply to {previewStats.willChange.toLocaleString()}{" "}
            {previewStats.willChange === 1 ? "occurrence" : "occurrences"}
          </button>
        );
      // Refused answers only change on the Answers step, where the refusal stays in view.
      if (refused)
        return (
          <button key="change-answers" type="button" className="dq-button primary" onClick={back}>
            Change answers
          </button>
        );
      return (
        <button
          key="again"
          type="button"
          className="dq-button primary"
          onClick={() => void preview()}
        >
          Preview again
        </button>
      );
    }
    if (busy)
      return (
        <button key="cancel-run" type="button" className="dq-button" onClick={stop}>
          {undoing ? "Cancel undo" : "Cancel run"}
        </button>
      );
    if (undoing || !runStats) return null;
    return (
      <Fragment key="after-run">
        {runStats.retryable && (
          <button type="button" className="dq-button" onClick={() => void run("retry")}>
            Retry failed
          </button>
        )}
        {runStats.counts.pending > 0 && (
          <button
            type="button"
            className="dq-button primary"
            onClick={() => void run("apply")}
          >
            Continue
          </button>
        )}
      </Fragment>
    );
  }

  // The dialog is a modal <dialog>, in the browser's top layer above Cove's tag image previews.
  return (
    <WithoutTagImagePreviews>
      <button
        type="button"
        className="dq-header-button"
        ref={opener}
        title="Apply answers to all matching occurrences"
        disabled={disabled || !actions.length}
        onClick={() => {
          reset();
          onOpen();
          setOpen(true);
        }}
      >
        <Layers aria-hidden="true" />
        Batch…
      </button>
      {open && (
        <dialog
          ref={dialog}
          className="dq-batch-dialog"
          aria-labelledby={`${ids}-title`}
          aria-modal="true"
          onCancel={(event) => {
            event.preventDefault();
            close();
          }}
          onClose={() => {
            // Chrome closes a modal on a second Esc without a cancel it lets us refuse. Keep a
            // running batch in view; otherwise finish closing as Close does.
            if (running.current) dialog.current?.showModal();
            else close();
          }}
        >
          <div className="dq-batch-header">
            <Layers aria-hidden="true" />
            <h2 id={`${ids}-title`}>Apply to all matching occurrences</h2>
            <button
              type="button"
              className="dq-batch-close"
              aria-label="Close dialog"
              disabled={busy}
              onClick={close}
            >
              <X aria-hidden="true" />
            </button>
          </div>
          <Stepper step={step} />
          <div
            className="dq-batch-body"
            ref={body}
            role="group"
            tabIndex={-1}
            data-batch-focus={step === "preview" ? "" : undefined}
            aria-label={`${STEPS.find((item) => item.id === step)!.label} step`}
          >
            <div className="dq-batch-messages" aria-live="polite">
              {notice && <p role="status">{notice}</p>}
              {error && (
                <p role="alert" className="dq-alert">
                  {error}
                </p>
              )}
            </div>
            {step === "answers"
              ? answersStep()
              : step === "preview"
                ? previewStep()
                : runStep(runStats!)}
          </div>
          <div className="dq-batch-footer">
            {step === "preview" && (
              <button type="button" className="dq-button" disabled={busy} onClick={back}>
                <ChevronLeft aria-hidden="true" />
                Back
              </button>
            )}
            {step === "run" && (
              <button type="button" className="dq-button" disabled={busy} onClick={reset}>
                New batch
              </button>
            )}
            <span className="dq-batch-footer-space" />
            <button type="button" className="dq-button" disabled={busy} onClick={close}>
              Close
            </button>
            {footerAction()}
          </div>
        </dialog>
      )}
    </WithoutTagImagePreviews>
  );
}
