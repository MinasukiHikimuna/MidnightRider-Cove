import { useEffect, useMemo, useRef, useState } from "react";
import {
  EntityReferenceMultiSelector,
  VideoPlayer,
  useKeySequence,
} from "@cove/runtime/components";
import {
  loadProgress,
  request,
  saveProgress,
  videoCoverUrl,
  videoStreamUrl,
} from "./api";
import {
  boundedFilter,
  actionShortcut,
  isReviewShortcutTarget,
  occurrenceAnswerSignature,
  queueSignature,
  type OccurrenceReview,
  type VideoReviewAction,
} from "./model";
import {
  loadOccurrencePage,
  resolvePerformers,
  saveOccurrenceTags,
  runOccurrenceAction,
  type Occurrence,
  type OccurrenceOutcome,
} from "./occurrences";
import type { ReviewProgress } from "./storage";

export function OccurrenceSettings({
  review,
  onChange,
  choices = false,
}: {
  review: OccurrenceReview;
  onChange(review: OccurrenceReview): void;
  choices?: boolean;
}) {
  const settings = review.occurrence;
  const update = (change: Partial<OccurrenceReview["occurrence"]>) =>
    onChange({ ...review, occurrence: { ...settings, ...change } });
  if (choices)
    return (
      <fieldset className="dq-queue-fields">
        <legend>Tag choices</legend>
        <p>
          Choose the tags this review can change on the active performer’s
          appearance in a scene. Other tags are preserved.
        </p>
        <EntityReferenceMultiSelector
          entityType="tag"
          values={settings.tagIds}
          onChange={(tagIds) => update({ tagIds })}
          placeholder="Search review tag choices..."
          allowCreate={false}
        />
        <label className="dq-checkbox">
          <input
            type="checkbox"
            checked={settings.multiple}
            onChange={(event) => update({ multiple: event.target.checked })}
          />
          Allow multiple tags, for example when a hairstyle changes during the
          scene
        </label>
        <p>
          Save & next performer records the selected tags, including an explicit
          empty answer. Cannot determine records an inconclusive outcome without
          changing tags. Skip leaves the occurrence unresolved.
        </p>
      </fieldset>
    );
  return (
    <fieldset className="dq-queue-fields">
      <legend>Occurrence condition (optional)</legend>
      <p>
        Leave this unrestricted to review any appearance. Choose performers
        temporarily in the review workspace.
      </p>
      <label>
        Occurrence condition
        <select
          aria-label="Occurrence condition"
          value={settings.condition}
          onChange={(event) =>
            update({
              condition: event.target.value as typeof settings.condition,
            })
          }
        >
          <option value="any">Any occurrence tags</option>
          <option value="includes">Has any selected tag</option>
          <option value="includesAll">Has all selected tags</option>
          <option value="excludes">Has none of the selected tags</option>
          <option value="isNull">Has no occurrence tags</option>
        </select>
      </label>
      {!["any", "isNull"].includes(settings.condition) && (
        <EntityReferenceMultiSelector
          entityType="tag"
          values={settings.conditionTagIds}
          onChange={(conditionTagIds) => update({ conditionTagIds })}
          placeholder="Search occurrence condition tags..."
          allowCreate={false}
        />
      )}
      <p>
        Conditions check exact tags on the same performer’s occurrence,
        independently of scene tags and the performer’s profile.
      </p>
    </fieldset>
  );
}

export function OccurrenceWorkspace({
  review: savedReview,
  storageKey,
  canWrite,
  onBusy,
}: {
  review: OccurrenceReview;
  storageKey: string;
  canWrite: boolean;
  onBusy(value: boolean): void;
}) {
  const [performerIds, setPerformerIds] = useState<number[]>([]);
  const [shortcutTarget, setShortcutTarget] = useState(() =>
    isReviewShortcutTarget(document.activeElement),
  );
  useEffect(() => {
    const update = (event: FocusEvent) =>
      setShortcutTarget(isReviewShortcutTarget(event.target));
    document.addEventListener("focusin", update);
    return () => document.removeEventListener("focusin", update);
  }, []);
  const review = useMemo(
    () => ({
      ...savedReview,
      occurrence: {
        ...savedReview.occurrence,
        targetMode: performerIds.length
          ? ("selected" as const)
          : ("all" as const),
        performerIds,
        performerFilter: {},
      },
    }),
    [savedReview, performerIds],
  );
  const [items, setItems] = useState<Occurrence[]>([]);
  const [page, setPage] = useState(1);
  const [totalScenes, setTotalScenes] = useState(0);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const [outcomes, setOutcomes] = useState<Record<string, OccurrenceOutcome>>(
    {},
  );
  const [selected, setSelected] = useState<number[]>([]);
  const [names, setNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [syncError, setSyncError] = useState("");
  const [retry, setRetry] = useState(0);
  const targets = useRef<number[] | null>(null);
  const latestProgress = useRef<ReviewProgress | null>(null);
  const controller = useRef<AbortController | null>(null);
  const skipped = useRef(new Set<string>());
  const current = items.find((item) => item.key === focusedKey) ?? null;
  const currentIndex = items.findIndex((item) => item.key === focusedKey);
  const perPage = Number(boundedFilter(review.view.filter).perPage);
  const lastPage = Math.max(1, Math.ceil(totalScenes / perPage));

  const progress = (
    nextPage: number,
    nextKey: string | null,
    nextOutcomes = outcomes,
  ): ReviewProgress => ({
    version: 1,
    signature: queueSignature(review),
    filter: { ...review.view.filter, page: nextPage },
    focusedId: nextKey ? Number(nextKey.split(":")[0]) : null,
    index: 0,
    displayMode: "grid",
    cardSize: null,
    updatedAt: Date.now(),
    occurrence: {
      answerSignature: occurrenceAnswerSignature(review),
      focusedKey: nextKey,
      outcomes: nextOutcomes,
    },
  });
  async function persist(value: ReviewProgress) {
    latestProgress.current = value;
    try {
      await saveProgress(storageKey, review.id, value);
    } catch (error) {
      setSyncError(
        `Progress sync failed. Retry sync before leaving this browser. ${error instanceof Error ? error.message : "Request failed."}`,
      );
    }
  }
  function focus(item: Occurrence | null) {
    setNotice("");
    setFocusedKey(item?.key ?? null);
    setSelected(
      item
        ? [
            ...new Set(
              item.applications
                .map((application) => application.tag.id)
                .filter((id) => review.occurrence.tagIds.includes(id)),
            ),
          ]
        : [],
    );
  }

  useEffect(() => {
    const abort = new AbortController();
    controller.current = abort;
    setLoading(true);
    setReady(false);
    setError("");
    setItems([]);
    setFocusedKey(null);
    setSelected([]);
    setOutcomes({});
    setTotalScenes(0);
    latestProgress.current = null;
    skipped.current.clear();
    void (async () => {
      const saved = await loadProgress(storageKey, review.id);
      const answerCompatible = saved?.occurrence?.answerSignature === undefined || saved.occurrence.answerSignature === occurrenceAnswerSignature(review);
      const resume = answerCompatible && saved?.signature === queueSignature(review) ? saved : null;
      const nextOutcomes =
        saved?.occurrence?.answerSignature === occurrenceAnswerSignature(review)
          ? saved.occurrence.outcomes
          : saved?.occurrence?.answerSignature === undefined
            ? (resume?.occurrence?.outcomes ?? {})
            : {};
      const performerIds = await resolvePerformers(review, abort.signal);
      const tagNames = await Promise.all(
        (review.actions.length ? [] : review.occurrence.tagIds).map(
          async (id) =>
            [
              id,
              (
                await request<{ name: string }>(`/api/tags/${id}`, {
                  signal: abort.signal,
                })
              ).name,
            ] as const,
        ),
      );
      let nextPage = resume ? Number(boundedFilter(resume.filter).page) : 1;
      let result = await loadOccurrencePage(
        review,
        performerIds,
        nextPage,
        abort.signal,
      );
      const end = Math.max(1, Math.ceil(result.totalCount / perPage));
      if ((!resume && review.view.startFrom === "end") || nextPage > end) {
        nextPage = end;
        result = await loadOccurrencePage(
          review,
          performerIds,
          nextPage,
          abort.signal,
        );
      }
      let next =
        result.items.find(
          (item) => item.key === resume?.occurrence?.focusedKey,
        ) ?? result.items.find((item) => !nextOutcomes[item.key]);
      const direction = review.view.startFrom === "end" ? -1 : 1;
      while (
        !next &&
        (direction === 1
          ? nextPage < Math.ceil(result.totalCount / perPage)
          : nextPage > 1)
      ) {
        nextPage += direction;
        result = await loadOccurrencePage(
          review,
          performerIds,
          nextPage,
          abort.signal,
        );
        next = result.items.find((item) => !nextOutcomes[item.key]);
      }
      if (abort.signal.aborted) return;
      targets.current = performerIds;
      setNames(Object.fromEntries(tagNames));
      setOutcomes(nextOutcomes);
      setItems(result.items);
      setPage(nextPage);
      setTotalScenes(result.totalCount);
      focus(next ?? null);
      setReady(true);
    })()
      .catch((error) => {
        if (!abort.signal.aborted)
          setError(
            error instanceof Error
              ? error.message
              : "Could not load occurrences.",
          );
      })
      .finally(() => {
        if (!abort.signal.aborted) setLoading(false);
      });
    return () => abort.abort();
  }, [review, storageKey, retry]);

  useEffect(() => {
    onBusy(pending || loading);
    return () => onBusy(false);
  }, [pending, loading, onBusy]);

  async function changePage(nextPage: number, nextOutcomes = outcomes) {
    if (!ready || pending || loading) return;
    setLoading(true);
    setError("");
    try {
      const result = await loadOccurrencePage(
        review,
        targets.current,
        nextPage,
        controller.current?.signal,
      );
      const end = Math.max(1, Math.ceil(result.totalCount / perPage));
      if (nextPage > end) {
        await changePage(end, nextOutcomes);
        return;
      }
      setItems(result.items);
      setPage(nextPage);
      setTotalScenes(result.totalCount);
      const next = result.items.find((item) => !nextOutcomes[item.key]) ?? null;
      focus(next);
      await persist(progress(nextPage, next?.key ?? null, nextOutcomes));
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not load occurrences.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function finish(
    outcome?: OccurrenceOutcome,
    action?: VideoReviewAction,
  ) {
    if (!ready || !current || busy.current || loading || (outcome && !canWrite))
      return;
    busy.current = true;
    setPending(true);
    onBusy(true);
    setError("");
    try {
      if (outcome === "reviewed") {
        const applications = action
          ? await runOccurrenceAction(review, current, action)
          : await saveOccurrenceTags(review, current, selected);
        setItems((items) =>
          items.map((item) =>
            item.key === current.key ? { ...item, applications } : item,
          ),
        );
      }
      const nextOutcomes = { ...outcomes };
      if (outcome) nextOutcomes[current.key] = outcome;
      else skipped.current.add(current.key);
      setOutcomes(nextOutcomes);
      const next =
        items
          .slice(currentIndex + 1)
          .find(
            (item) => !nextOutcomes[item.key] && !skipped.current.has(item.key),
          ) ?? null;
      // Keep the loaded page stable while tagging; dynamic membership can change underneath it.
      if (next) {
        focus(next);
        await persist(progress(page, next.key, nextOutcomes));
      } else {
        // Persist the answer before fetching more work. Re-read this page first so
        // scenes shifting into it after tag writes are not skipped by offset paging.
        await persist(progress(page, null, nextOutcomes));
        await new Promise((resolve) => window.setTimeout(resolve, 1100));
        let nextPage = page;
        const direction = review.view.startFrom === "end" ? -1 : 1;
        while (true) {
          const result = await loadOccurrencePage(
            review,
            targets.current,
            nextPage,
            controller.current?.signal,
          );
          const end = Math.max(1, Math.ceil(result.totalCount / perPage));
          if (nextPage > end) {
            nextPage = end;
            continue;
          }
          const candidate = result.items.find(
            (item) => !nextOutcomes[item.key] && !skipped.current.has(item.key),
          );
          if (
            candidate ||
            (direction === 1 ? nextPage >= end : nextPage <= 1)
          ) {
            setItems(result.items);
            setPage(nextPage);
            setTotalScenes(result.totalCount);
            focus(candidate ?? null);
            await persist(
              progress(nextPage, candidate?.key ?? null, nextOutcomes),
            );
            if (!candidate)
              setNotice(
                "No more unresolved occurrences in this direction. Skipped performers remain unresolved and can be revisited from the scene pages.",
              );
            break;
          }
          nextPage += direction;
        }
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save this occurrence.",
      );
    } finally {
      busy.current = false;
      setPending(false);
      onBusy(false);
    }
  }

  const remaining = items.filter((item) => !outcomes[item.key]).length;
  useKeySequence(
    review.actions.map((action, index) => ({
      keys: actionShortcut(action, index),
      surface: "local" as const,
      action: (context?: { repeat: boolean; target: EventTarget | null }) => {
        if (context?.repeat || (context && !isReviewShortcutTarget(context.target))) return;
        void finish(action.steps.length ? "reviewed" : undefined, action);
      },
    })).filter((binding) => binding.keys),
    ready && !pending && !loading && shortcutTarget,
  );
  return (
    <section
      className="dq-occurrence-workspace"
      aria-label="Performer occurrence review"
      tabIndex={0}
      onKeyDown={(event) => {
        event.stopPropagation();
        if (
          event.defaultPrevented ||
          event.ctrlKey ||
          event.altKey ||
          event.metaKey ||
          event.repeat ||
          !isReviewShortcutTarget(event.target)
        )
          return;
        const action = review.actions.find(
          (action, index) => actionShortcut(action, index) === event.key,
        );
        if (action) {
          event.preventDefault();
          void finish(action.steps.length ? "reviewed" : undefined, action);
        }
      }}
    >
      <div className="dq-occurrence-toolbar">
        <div className="dq-occurrence-filter">
          <strong>Filter performers</strong>
          <EntityReferenceMultiSelector
            entityType="performer"
            values={performerIds}
            onChange={(ids) => {
              setReady(false);
              setPerformerIds(ids);
            }}
            placeholder="All performers — select performers..."
            disabled={pending || loading}
            allowCreate={false}
          />
          <p>
            {performerIds.length
              ? "Only selected performers are reviewed. This filter does not change the saved review."
              : "All performers in matching scenes. Select one or more to focus this session."}
          </p>
          {performerIds.length > 0 && (
            <button
              type="button"
              className="dq-button"
              disabled={pending || loading}
              onClick={() => {
                setReady(false);
                setPerformerIds([]);
              }}
            >
              Clear performer filter
            </button>
          )}
        </div>
        <p role="status">
          {loading
            ? "Loading performer occurrences…"
            : `${remaining} unresolved of ${items.length} performer ${items.length === 1 ? "occurrence" : "occurrences"} on this page · ${totalScenes} matching ${totalScenes === 1 ? "scene" : "scenes"}`}
        </p>
        <button
          type="button"
          className="dq-button"
          disabled={!ready || pending || loading || page <= 1}
          onClick={() => void changePage(page - 1)}
        >
          Previous scene page
        </button>
        <span>
          Scene page {page} of {lastPage}
        </span>
        <button
          type="button"
          className="dq-button"
          disabled={!ready || pending || loading}
          onClick={() => void changePage(page)}
        >
          Refresh page
        </button>
        <button
          type="button"
          className="dq-button"
          disabled={!ready || pending || loading || page >= lastPage}
          onClick={() => void changePage(page + 1)}
        >
          Next scene page
        </button>
      </div>
      {error && (
        <p role="alert">
          {error}{" "}
          {!pending && (
            <button
              type="button"
              onClick={() => setRetry((value) => value + 1)}
            >
              Reload queue
            </button>
          )}
        </p>
      )}
      {notice && <p role="status">{notice}</p>}
      {syncError && (
        <p role="alert">
          {syncError}{" "}
          {latestProgress.current && (
            <button
              type="button"
              onClick={() => {
                setSyncError("");
                void persist(latestProgress.current!);
              }}
            >
              Retry progress sync
            </button>
          )}
        </p>
      )}
      {!loading && !current && (
        <p>
          {items.length
            ? "No active performer. Choose an occurrence below to review or revisit it."
            : "No performer occurrences match on this page."}
        </p>
      )}
      <fieldset
        disabled={!ready || pending || loading}
        className="dq-occurrence-content"
      >
        {current && (
          <>
            <div className="dq-occurrence-media">
              <a
                href={`/video/${current.video.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {current.video.title ||
                  current.video.files[0]?.basename ||
                  "Open scene"}
              </a>
              <VideoPlayer
                key={current.video.id}
                videoId={current.video.id}
                streamUrl={videoStreamUrl(current.video.id)}
                posterUrl={videoCoverUrl(current.video)}
                duration={current.video.files[0]?.duration ?? 0}
                format={current.video.files[0]?.format}
                audioCodec={current.video.files[0]?.audioCodec}
                extensionSurface="quick-view"
                showAbLoop
                clip={
                  current.video.parentVideoId != null
                    ? {
                        start: current.video.clipStartSec ?? 0,
                        end: current.video.clipEndSec,
                        loop: false,
                      }
                    : undefined
                }
              />
            </div>
            <div className="dq-occurrence-panel">
              <h2>Reviewing {current.performer.name}</h2>
              <p>Tags apply only to this performer in this scene.</p>
              <div
                className="dq-occurrence-performers"
                aria-label="Performers in this scene"
              >
                {items
                  .filter((item) => item.video.id === current.video.id)
                  .map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="dq-button"
                      aria-pressed={item.key === current.key}
                      onClick={() => {
                        focus(item);
                        void persist(progress(page, item.key));
                      }}
                    >
                      {item.performer.imagePath ? (
                        <img
                          src={`/api/performers/${item.performer.id}/image?max=96`}
                          alt=""
                          onError={(event) => {
                            event.currentTarget.hidden = true;
                          }}
                        />
                      ) : (
                        <span
                          className="dq-occurrence-avatar"
                          aria-hidden="true"
                        >
                          {item.performer.name.slice(0, 1)}
                        </span>
                      )}
                      {item.performer.name} ·{" "}
                      {outcomes[item.key] === "reviewed"
                        ? "Reviewed"
                        : outcomes[item.key] === "cannotDetermine"
                          ? "Cannot determine"
                          : "Unresolved"}
                    </button>
                  ))}
              </div>
              <p>
                Current occurrence tags:{" "}
                {current.applications.length
                  ? [
                      ...new Set(
                        current.applications.map((item) => item.tag.name),
                      ),
                    ].join(", ")
                  : "None"}
              </p>
              {review.actions.length === 0 &&
                review.occurrence.tagIds.length > 0 && (
                  <fieldset
                    disabled={!canWrite}
                    className="dq-occurrence-choices"
                  >
                    <legend>Occurrence tags</legend>
                    {review.occurrence.tagIds.map((id) => (
                      <label key={id}>
                        <input
                          type={
                            review.occurrence.multiple ? "checkbox" : "radio"
                          }
                          name="occurrence-tag"
                          checked={selected.includes(id)}
                          onChange={(event) =>
                            setSelected(
                              review.occurrence.multiple
                                ? event.target.checked
                                  ? [...selected, id]
                                  : selected.filter((value) => value !== id)
                                : [id],
                            )
                          }
                        />
                        {names[id] ?? "Loading tag…"}
                      </label>
                    ))}
                    <label>
                      <input
                        type={review.occurrence.multiple ? "checkbox" : "radio"}
                        name="occurrence-tag"
                        checked={selected.length === 0}
                        onChange={() => setSelected([])}
                      />
                      No applicable tags
                    </label>
                  </fieldset>
                )}
              {review.actions.length === 0 &&
                review.occurrence.tagIds.length === 0 && (
                  <p>Use Edit review → Actions to add your review actions.</p>
                )}
              <div className="dq-occurrence-actions">
                {review.actions.map((action, index) => (
                  <button
                    key={action.id}
                    type="button"
                    className="dq-button primary"
                    disabled={!canWrite && action.steps.length > 0}
                    onClick={() =>
                      void finish(
                        action.steps.length ? "reviewed" : undefined,
                        action,
                      )
                    }
                    title={`Apply to ${current.performer.name} in this scene`}
                  >
                    {actionShortcut(action, index) && (
                      <kbd>{actionShortcut(action, index)}</kbd>
                    )}{" "}
                    {action.label}
                  </button>
                ))}
                {review.actions.length === 0 &&
                  review.occurrence.tagIds.length > 0 && (
                    <button
                      type="button"
                      className="dq-button primary"
                      disabled={
                        !canWrite ||
                        (!review.occurrence.multiple && selected.length > 1)
                      }
                      onClick={() => void finish("reviewed")}
                    >
                      {pending ? "Saving…" : "Save & next performer"}
                    </button>
                  )}
                <button
                  type="button"
                  className="dq-button"
                  disabled={!canWrite}
                  onClick={() => void finish("cannotDetermine")}
                >
                  Cannot determine & next
                </button>
                <button
                  type="button"
                  className="dq-button"
                  onClick={() => void finish()}
                >
                  Skip performer
                </button>
              </div>
              {!canWrite && (
                <p>
                  Tag write permission is required to save occurrence reviews.
                </p>
              )}
            </div>
          </>
        )}
        <details className="dq-occurrence-list" open={!current}>
          <summary>All {items.length} occurrences on this scene page</summary>
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className="dq-button"
              aria-pressed={item.key === focusedKey}
              onClick={() => {
                focus(item);
                void persist(progress(page, item.key));
              }}
            >
              {item.performer.name} — {item.video.title || "Scene"} ·{" "}
              {outcomes[item.key] === "reviewed"
                ? "Reviewed"
                : outcomes[item.key] === "cannotDetermine"
                  ? "Cannot determine"
                  : "Unresolved"}
            </button>
          ))}
        </details>
      </fieldset>
    </section>
  );
}
