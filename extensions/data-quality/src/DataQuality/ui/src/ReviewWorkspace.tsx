import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  DetailListToolbar,
  DetailListPagination,
  EntityReferenceMultiSelector,
  FilterDialog,
  PERFORMER_CRITERIA,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  VideoPlayer,
} from "@cove/runtime/components";
import { RotateCcw, Save } from "@cove/runtime/lucide-react";
import { findVideos, request, videoCoverUrl, videoStreamUrl } from "./api";
import {
  reviewValidation,
  actionShortcut,
  boundedFilter,
  isReviewShortcutTarget,
  queueSignature,
  type OccurrenceReview,
  type VideoReviewAction,
} from "./model";
import { loadOccurrencePage, resolvePerformers } from "./occurrences";
import { objectFiltersEqual } from "./objectFiltersEqual";
import {
  defaultQuery,
  effectiveReview,
  readQuery,
  writeQuery,
  type MediaReview,
  type ReviewQuery,
} from "./reviewQuery";
import {
  applyTags,
  difference,
  editTags,
  readTags,
  type ReviewItem,
  type TagState,
} from "./reviewTags";

function PerformerAvatar({
  performer,
}: {
  performer: { id: number; name: string };
}) {
  return (
    <span className="dq-performer-avatar" aria-hidden="true">
      <span>
        {performer.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((part) => part[0])
          .join("")
          .toUpperCase() || "?"}
      </span>
      <img
        key={performer.id}
        src={`/api/performers/${performer.id}/image?max=64`}
        alt=""
        loading="lazy"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </span>
  );
}

export function orderedItems(items: ReviewItem[], backwards: boolean) {
  if (!backwards) return items;
  const scenes = new Map<number, ReviewItem[]>();
  for (const item of items)
    scenes.set(item.video.id, [...(scenes.get(item.video.id) ?? []), item]);
  return [...scenes.values()].reverse().flat();
}
import {
  presentCustomFieldCriteria,
  preserveCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";

export function ReviewActionControls({
  actions,
  disabled,
  canWrite,
  onApply,
}: {
  actions: VideoReviewAction[];
  disabled: boolean;
  canWrite: boolean;
  onApply(action: VideoReviewAction, stay: boolean): void;
}) {
  const [names, setNames] = useState<Record<number, string>>({});
  useEffect(() => {
    let active = true;
    void Promise.all(
      [
        ...new Set(
          actions.flatMap((action) =>
            action.steps.flatMap((step) => step.tagIds),
          ),
        ),
      ].map(async (id) => {
        try {
          return [
            id,
            (await request<{ name: string }>(`/api/tags/${id}`)).name,
          ] as const;
        } catch {
          return [id, "Unavailable tag"] as const;
        }
      }),
    ).then((entries) => {
      if (active) setNames(Object.fromEntries(entries));
    });
    return () => {
      active = false;
    };
  }, [actions]);
  const verbs = {
    ADD: "Add",
    REMOVE: "Remove",
    REMOVE_TREE: "Remove tree",
    MARK_PRESENT: "Mark present",
    MARK_ABSENT: "Mark absent",
    CLEAR_ABSENCE: "Clear absence",
  };
  return (
    <div className="dq-review-actions">
      <p>
        Actions apply and advance. Shift-click or Shift + shortcut applies and
        stays.
      </p>
      {actions.map((action, index) => (
        <div className="dq-action-pair" key={action.id}>
          <button
            type="button"
            className="dq-button primary"
            disabled={disabled || (!canWrite && action.steps.length > 0)}
            onClick={(event) => onApply(action, event.shiftKey)}
          >
            <span>
              {actionShortcut(action, index) && <kbd>{actionShortcut(action, index)}</kbd>} {action.label}
            </span>
          </button>
          {action.steps.length > 0 && (
            <button
              type="button"
              className="dq-button dq-apply-stay-button"
              disabled={disabled || !canWrite}
              aria-label={`Apply & stay: ${action.label}`}
              title={`Apply & stay: ${action.label}`}
              onClick={() => onApply(action, true)}
            >
              <Save aria-hidden="true" />
            </button>
          )}
          {action.steps.length > 0 && (
            <small className="dq-review-action-summary">
              {action.steps
                .map(
                  (step) =>
                    `${verbs[step.mode]}: ${step.tagIds.map((id) => names[id] ?? "Loading tag…").join(", ")}`,
                )
                .join("; ")}
            </small>
          )}
        </div>
      ))}
    </div>
  );
}

interface StayedCursor {
  key: string;
  page: number;
  before: string[];
  after: string[];
}

export function ReviewWorkspace({
  review: saved,
  canWrite,
  onBusy,
  onSaveDefaults,
  editRequest = 0,
  renderRuleEditor,
}: {
  review: MediaReview;
  canWrite: boolean;
  onBusy(value: boolean): void;
  onSaveDefaults?(review: MediaReview): Promise<unknown>;
  editRequest?: number;
  renderRuleEditor?(
    draft: MediaReview,
    onChange: (draft: MediaReview) => void,
    saving: boolean,
  ): ReactNode;
}) {
  const initial = useRef<ReturnType<typeof readQuery> | null>(null);
  const initialError = useRef("");
  if (!initial.current) {
    try {
      initial.current = readQuery(
        saved,
        new URLSearchParams(window.location.search),
      );
    } catch (error) {
      initialError.current = errorText(error);
      initial.current = { query: defaultQuery(saved), startAtEnd: false };
    }
  }
  const [ruleDraft, setRuleDraft] = useState<MediaReview | null>(null);
  const ruleSnapshot = useRef<{
    error: string;
    url: string;
    query: ReviewQuery;
    items: ReviewItem[];
    current: ReviewItem | null;
    total: number;
    targets: number[] | null;
    stayedCursor: StayedCursor | null;
  } | null>(null);
  const ruleOpener = useRef<HTMLElement | null>(null);
  const activeLoad = useRef<AbortController | null>(null);
  const [initialLoadSettled, setInitialLoadSettled] = useState(Boolean(initialError.current));
  const handledEditRequest = useRef(0);
  const [query, setQuery] = useState(initial.current.query);
  const queryRef = useRef(query);
  queryRef.current = query;
  const [revision, setRevision] = useState(0);
  const startAtEnd = useRef(initial.current.startAtEnd);
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [current, setCurrent] = useState<ReviewItem | null>(null);
  const stayedCursor = useRef<StayedCursor | null>(null);
  const [autostartVideoId, setAutostartVideoId] = useState<number | null>(null);
  const [playerRevision, setPlayerRevision] = useState(0);
  const nextItemToPreload = useMemo(() => {
    if (!current) return null;
    const currentIndex = items.findIndex((item) => item.key === current.key);
    if (currentIndex < 0) return null;
    return (
      items
        .slice(currentIndex + 1)
        .find((item) => item.video.id !== current.video.id) ?? null
    );
  }, [current, items]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const lock = useRef(false);
  const alive = useRef(true);
  const deferredRestore = useRef<{
    query: ReviewQuery;
    startAtEnd: boolean;
  } | null>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const [error, setError] = useState(initialError.current);
  const [notice, setNotice] = useState("");
  const [tags, setTags] = useState<TagState | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number[]>([]);
  const editorBase = useRef<number[]>([]);
  const editButton = useRef<HTMLButtonElement>(null);
  const filterReturnFocus = useRef<HTMLButtonElement | null>(null);
  const editor = useRef<HTMLFieldSetElement>(null);
  useEffect(() => {
    if (editing)
      editor.current?.querySelector<HTMLInputElement>("input")?.focus();
  }, [editing]);
  const [performerDialog, setPerformerDialog] = useState(false);
  useEffect(() => {
    if (loading || performerDialog || !filterReturnFocus.current) return;
    const frame = requestAnimationFrame(() => {
      if (document.querySelector('[role="dialog"], dialog[open]')) return;
      const target = filterReturnFocus.current;
      if (target?.isConnected && !target.disabled) target.focus();
      filterReturnFocus.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [loading, performerDialog, revision]);
  const [legacySelected, setLegacySelected] = useState<number[]>([]);
  const [legacyNames, setLegacyNames] = useState<Record<number, string>>({});
  const targets = useRef<number[] | null>(null);
  const lastWriteAt = useRef(0);
  const allowCustomFieldRemoval = useRef(false);
  const [customFieldNames, setCustomFieldNames] = useState<
    Record<string, string>
  >({});
  useEffect(() => {
    let active = true;
    void Promise.all(
      unresolvedCustomFieldTagIds(query.objectFilter).map(
        async (id) =>
          [
            String(id),
            (await request<{ name: string }>(`/api/tags/${id}`)).name,
          ] as const,
      ),
    )
      .then((entries) => {
        if (active) setCustomFieldNames(Object.fromEntries(entries));
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [query.objectFilter]);
  const generation = useRef(0);
  const savedRef = useRef(saved);
  savedRef.current = saved;
  const definition = ruleDraft ?? saved;
  const review = useMemo(
    () => effectiveReview(definition, query),
    [definition, query],
  );
  const reviewRef = useRef(review);
  reviewRef.current = review;
  const queueDefaultsChanged =
    query.startFrom !== (saved.view.startFrom ?? "end") ||
    !objectFiltersEqual(
      JSON.parse(queueSignature(effectiveReview(saved, query))),
      JSON.parse(queueSignature(effectiveReview(saved, defaultQuery(saved)))),
    );
  const blocked = pending || loading || editing;
  const page = Number(query.filter.page);

  function replaceQuery(next: ReviewQuery, end = false) {
    if (lock.current) return;
    initialError.current = "";
    startAtEnd.current = end;
    queryRef.current = next;
    setQuery(next);
    setTotal(0);
    setLoading(true);
    if (!end) writeQuery(saved.id, next);
    setRevision((value) => value + 1);
  }
  function endOperation() {
    lock.current = false;
    setPending(false);
    if (alive.current && deferredRestore.current) {
      const next = deferredRestore.current;
      deferredRestore.current = null;
      replaceQuery(next.query, next.startAtEnd);
    }
  }
  useEffect(() => {
    const restore = () => {
      if (
        new URLSearchParams(window.location.search).get("review") !== saved.id
      )
        return;
      try {
        const restored = readQuery(
          savedRef.current,
          new URLSearchParams(window.location.search),
        );
        if (lock.current) deferredRestore.current = restored;
        else replaceQuery(restored.query, restored.startAtEnd);
      } catch (error) {
        setError(errorText(error));
      }
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [saved.id]);
  useEffect(() => {
    onBusy(pending || loading || editing || !!ruleDraft);
    return () => onBusy(false);
  }, [pending, loading, editing, !!ruleDraft, onBusy]);

  async function fetchPage(
    rule: MediaReview,
    nextPage: number,
    signal?: AbortSignal,
  ) {
    if (rule.entityType === "performerOccurrence") {
      const result = await loadOccurrencePage(
        rule,
        targets.current,
        nextPage,
        signal,
      );
      return {
        items: result.items.map((occurrence) => ({
          key: occurrence.key,
          video: occurrence.video,
          occurrence,
        })),
        totalCount: result.totalCount,
      };
    }
    const result = await findVideos(
      rule,
      { ...rule.view.filter, page: nextPage },
      signal,
    );
    return {
      items: result.items.map((video) => ({ key: String(video.id), video })),
      totalCount: result.totalCount,
    };
  }
  function acceptPage(
    result: { items: ReviewItem[]; totalCount: number },
    nextPage: number,
    next: ReviewItem | null,
    resumePlayback = false,
    preserveOrder = false,
  ) {
    if (!alive.current || deferredRestore.current) return;
    setInitialLoadSettled(true);
    setItems(
      preserveOrder
        ? result.items
        : orderedItems(result.items, queryRef.current.startFrom === "end"),
    );
    setTotal(result.totalCount);
    showItem(next, resumePlayback);
    const nextQuery = {
      ...queryRef.current,
      filter: { ...queryRef.current.filter, page: nextPage },
    };
    queryRef.current = nextQuery;
    setQuery(nextQuery);
    writeQuery(saved.id, nextQuery);
  }
  function showItem(next: ReviewItem | null, resumePlayback = false) {
    if (next?.key !== current?.key) stayedCursor.current = null;
    if (next?.video.id !== current?.video.id) {
      setAutostartVideoId(resumePlayback && next ? next.video.id : null);
    }
    setCurrent(next);
  }
  useEffect(() => {
    if (initialError.current) return;
    const controller = new AbortController();
    activeLoad.current = controller;
    const token = ++generation.current;
    setLoading(true);
    setError("");
    setNotice("");
    stayedCursor.current = null;
    setAutostartVideoId(null);
    setCurrent(null);
    setItems([]);
    setEditing(false);
    void (async () => {
      const rule = effectiveReview(savedRef.current, queryRef.current);
      targets.current =
        rule.entityType === "performerOccurrence"
          ? await resolvePerformers(rule, controller.signal)
          : null;
      let nextPage = Number(rule.view.filter.page);
      let result = await fetchPage(rule, nextPage, controller.signal);
      const end = Math.max(
        1,
        Math.ceil(result.totalCount / Number(rule.view.filter.perPage)),
      );
      if (startAtEnd.current || nextPage > end) {
        nextPage = end;
        result = await fetchPage(rule, nextPage, controller.signal);
      }
      startAtEnd.current = false;
      if (token !== generation.current || controller.signal.aborted) return;
      const ordered = orderedItems(result.items, rule.view.startFrom === "end");
      acceptPage(result, nextPage, ordered[0] ?? null);
    })()
      .catch((error) => {
        if (!controller.signal.aborted && token === generation.current)
          setError(errorText(error));
      })
      .finally(() => {
        if (!controller.signal.aborted && token === generation.current) {
          setInitialLoadSettled(true);
          setLoading(false);
        }
      });
    return () => {
      controller.abort();
      generation.current++;
    };
  }, [revision, saved.id]);

  useEffect(() => {
    setTags(null);
    if (!current) return;
    let active = true;
    void readTags(current)
      .then((state) => {
        if (!active) return;
        setTags(state);
        setLegacySelected(
          saved.entityType === "performerOccurrence"
            ? state.ids.filter((id) => saved.occurrence.tagIds.includes(id))
            : [],
        );
      })
      .catch((error) => {
        if (active)
          setError(`Could not load current tags. ${errorText(error)}`);
      });
    return () => {
      active = false;
    };
  }, [current]);
  useEffect(() => {
    if (saved.entityType !== "performerOccurrence" || saved.actions.length)
      return;
    let active = true;
    void Promise.all(
      saved.occurrence.tagIds.map(
        async (id) =>
          [
            id,
            (await request<{ name: string }>(`/api/tags/${id}`)).name,
          ] as const,
      ),
    )
      .then((names) => {
        if (active) setLegacyNames(Object.fromEntries(names));
      })
      .catch((error) => {
        if (active) setError(errorText(error));
      });
    return () => {
      active = false;
    };
  }, [saved]);

  async function advance(refresh = false, stay = false, resumePlayback = false) {
    if (!current) return;
    const index = items.findIndex((item) => item.key === current.key);
    const direction = query.startFrom === "end" ? -1 : 1;
    // Apply & stay may remove the current row. Retain its place among the old
    // keys so the next action cannot return to a skipped row or reverse refill.
    const cursor = stayedCursor.current?.key === current.key
      ? stayedCursor.current
      : { key: current.key, page, before: items.slice(0, index + 1).map(item => item.key), after: items.slice(index + 1).map(item => item.key) };
    const remainingKeys = new Set(cursor.after);
    const visitedKeys = new Set(cursor.before);
    const nextLoaded = items.find(item => remainingKeys.has(item.key) ||
      ((direction === 1 || page < cursor.page) && stayedCursor.current?.key === current.key && !visitedKeys.has(item.key)));
    if (!refresh && nextLoaded) {
      showItem(nextLoaded, resumePlayback);
      return;
    }
    // Only loaded-page keys are excluded during boundary reconciliation. Manual
    // page navigation starts a fresh cursor and makes every matching item available.
    const loadedKeys = refresh ? visitedKeys : new Set(items.map(item => item.key));
    const cacheWait = 1100 - (Date.now() - lastWriteAt.current);
    if (cacheWait > 0)
      await new Promise((resolve) => window.setTimeout(resolve, cacheWait));
    // In reverse traversal, refills on the current page come from the side
    // already traversed. Move to the preceding page instead.
    let nextPage = direction === -1 && !refresh ? Math.max(1, page - 1) : page;
    while (alive.current && !deferredRestore.current) {
      let result = await fetchPage(review, nextPage);
      const end = Math.max(
        1,
        Math.ceil(result.totalCount / Number(query.filter.perPage)),
      );
      if (nextPage > end) {
        nextPage = end;
        result = await fetchPage(review, nextPage);
      }
      const orderedResult = orderedItems(result.items, direction === -1);
      const resultByKey = new Map(orderedResult.map((item) => [item.key, item]));
      const preservedRemaining = refresh
        ? cursor.after.flatMap((key) => {
            const item = resultByKey.get(key);
            return item ? [item] : [];
          })
        : [];
      const preservedKeys = new Set(preservedRemaining.map((item) => item.key));
      const reconciledResult = refresh
        ? {
            ...result,
            items: [
              ...preservedRemaining,
              ...orderedResult.filter(
                (item) =>
                  item.key !== current.key && !preservedKeys.has(item.key),
              ),
            ],
          }
        : result;
      if (stay) {
        stayedCursor.current = cursor;
        acceptPage(reconciledResult, nextPage, current, false, refresh);
        return;
      }
      const candidate =
        direction === -1 && page === 1 && !refresh
          ? undefined
          : reconciledResult.items.find(
              (item) => !loadedKeys.has(item.key) &&
                // A reverse-page refill comes from scenes already traversed.
                // Keep remaining partners, then continue on the preceding page.
                (!(refresh && direction === -1 && nextPage === cursor.page) || remainingKeys.has(item.key)),
            );
      if (candidate || (direction === -1 ? nextPage <= 1 : nextPage >= end)) {
        acceptPage(
          reconciledResult,
          nextPage,
          candidate ?? null,
          resumePlayback,
          refresh,
        );
        if (!candidate)
          setNotice(
            result.totalCount
              ? "Reached the end in this direction. Matching items remain available from the scene pages."
              : "No matching scenes.",
          );
        return;
      }
      nextPage += direction;
    }
  }
  async function execute(
    action?: VideoReviewAction,
    stay = false,
    adHoc = false,
    legacy = false,
  ) {
    if (ruleDraft || !current || lock.current || loading || (editing && !adHoc))
      return;
    const mutating = adHoc || legacy || Boolean(action?.steps.length);
    const autoplayNext = mutating && !stay;
    if (mutating && (!canWrite || !tags)) return;
    lock.current = true;
    setPending(true);
    setError("");
    setNotice("");
    const currentIndex = items.findIndex((item) => item.key === current.key);
    const optimisticNext =
      mutating && !stay && currentIndex >= 0
        ? (items[currentIndex + 1] ?? null)
        : null;
    if (optimisticNext) {
      setItems((currentItems) =>
        currentItems.filter((item) => item.key !== current.key),
      );
      showItem(optimisticNext, true);
    }
    let savedTags = false;
    try {
      if (mutating) {
        const before = await readTags(current);
        if (action) {
          await applyTags(review, current, action);
        } else {
          const base =
            legacy && saved.entityType === "performerOccurrence"
              ? saved.occurrence.tagIds.filter((id) => before.ids.includes(id))
              : editorBase.current;
          const selected = legacy ? legacySelected : draft;
          const change = difference(base, selected);
          await editTags(review, current, change);
        }
        lastWriteAt.current = Date.now();
        const after = await readTags(current);
        if (!optimisticNext) setTags(after);
        savedTags = true;
        setEditing(false);
        setNotice("Tags saved.");
      }
      if (!alive.current || deferredRestore.current) return;
      if (mutating) await advance(true, stay, autoplayNext);
      else if (!stay) await advance();
      if (stay && adHoc) requestAnimationFrame(() => editButton.current?.focus());
    } catch (error) {
      setError(
        savedTags
          ? `Tags saved, but the queue could not advance. Retry navigation with Skip. ${errorText(error)}`
          : mutating
            ? `Saving stopped; some changes may have applied. Your inputs are kept. Inspect current tags and retry to finish. ${errorText(error)}`
            : `Could not advance. ${errorText(error)}`,
      );
      if (mutating && !savedTags) {
        if (optimisticNext) {
          setItems(items);
          setAutostartVideoId(null);
          setPlayerRevision((revision) => revision + 1);
          setCurrent(current);
        }
        lastWriteAt.current = Date.now();
        try {
          setTags(await readTags(current));
        } catch {
          setTags(null);
          setError(
            (previous) =>
              `${previous} Current tags could not be refreshed; reload tags before retrying.`,
          );
        }
      }
    } finally {
      endOperation();
    }
  }
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        editing ||
        ruleDraft ||
        pending ||
        loading ||
        performerDialog ||
        event.defaultPrevented ||
        event.repeat ||
        event.ctrlKey ||
        event.altKey ||
        event.metaKey ||
        !isReviewShortcutTarget(event.target) ||
        document.querySelector('[role="dialog"], dialog[open]')
      )
        return;
      const key = event.key.toLowerCase();
      const action = saved.actions.find(
        (action, index) => actionShortcut(action, index) === key,
      );
      if (!action) return;
      event.preventDefault();
      event.stopPropagation();
      void execute(action, event.shiftKey);
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  });
  function beginRuleEdit() {
    if (!onSaveDefaults || ruleDraft || lock.current || editing) return;
    ruleOpener.current = document.activeElement as HTMLElement;
    ruleSnapshot.current = {
      error,
      url:
        window.location.pathname +
        window.location.search +
        window.location.hash,
      query: structuredClone(queryRef.current),
      items,
      current,
      total,
      targets: targets.current,
      stayedCursor: stayedCursor.current,
    };
    setRuleDraft(structuredClone(effectiveReview(saved, queryRef.current)));
    setNotice("");
    setError("");
  }
  useEffect(() => {
    if (
      editRequest &&
      editRequest !== handledEditRequest.current &&
      initialLoadSettled &&
      !loading
    ) {
      handledEditRequest.current = editRequest;
      beginRuleEdit();
    }
  }, [editRequest, loading, initialLoadSettled]);
  function finishRuleEdit() {
    setRuleDraft(null);
    requestAnimationFrame(() => ruleOpener.current?.focus());
  }
  function cancelRuleEdit() {
    const snapshot = ruleSnapshot.current;
    if (!snapshot || pending) return;
    activeLoad.current?.abort();
    generation.current++;
    queryRef.current = snapshot.query;
    setQuery(snapshot.query);
    setItems(snapshot.items);
    setCurrent(snapshot.current);
    setTotal(snapshot.total);
    targets.current = snapshot.targets;
    stayedCursor.current = snapshot.stayedCursor;
    setLoading(false);
    setError(snapshot.error);
    setNotice("");
    window.history.replaceState(window.history.state, "", snapshot.url);
    finishRuleEdit();
  }
  async function saveRuleEdit() {
    if (!ruleDraft || !onSaveDefaults || lock.current) return;
    const updated = effectiveReview(
      { ...ruleDraft, name: ruleDraft.name.trim() },
      queryRef.current,
    );
    const invalid = reviewValidation(updated);
    if (invalid) {
      setError(invalid);
      return;
    }
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await onSaveDefaults(updated);
      if (result === false) throw new Error("Could not save review.");
      finishRuleEdit();
      setNotice("Review saved.");
    } catch (error) {
      setError(
        "Could not save review. Your edits are still open. " + errorText(error),
      );
    } finally {
      endOperation();
    }
  }
  async function saveQueryDefaults() {
    if (!onSaveDefaults || lock.current) return;
    const updated = effectiveReview(saved, {
      ...queryRef.current,
      filter: { ...queryRef.current.filter, page: 1 },
    });
    lock.current = true;
    setPending(true);
    setError("");
    try {
      const result = await onSaveDefaults(updated);
      if (result === false) throw new Error("Could not save review.");
      setNotice("Queue saved to this review.");
    } catch (error) {
      setError("Could not save queue. " + errorText(error));
    } finally {
      endOperation();
    }
  }
  const scope = query.performerScope;
  const updateScope = (
    change: Partial<NonNullable<ReviewQuery["performerScope"]>>,
  ) =>
    replaceQuery({
      ...queryRef.current,
      filter: { ...queryRef.current.filter, page: 1 },
      performerScope: { ...scope!, ...change },
    });

  return (
    <section
      className="dq-review-workspace"
      aria-label={scope ? "Performer occurrence review" : "Video review"}
    >
      {ruleDraft && (
        <section className="dq-rule-editor" aria-label="Edit review rule">
          <h2>Edit review</h2>
          <p>
            Preview matching scenes below. Save review keeps all rule changes;
            Cancel restores your previous view.
          </p>
          <fieldset disabled={pending}>
            {renderRuleEditor?.(
              effectiveReview(ruleDraft, query),
              setRuleDraft,
              pending,
            )}
            <label>
              Review direction
              <select
                aria-label="Review direction"
                value={query.startFrom}
                onChange={(event) =>
                  replaceQuery({
                    ...queryRef.current,
                    startFrom: event.target.value as "beginning" | "end",
                  })
                }
              >
                <option value="end">Start from the end</option>
                <option value="beginning">Start from the beginning</option>
              </select>
            </label>
          </fieldset>
          <div className="dq-row">
            <button
              className="dq-button primary"
              type="button"
              disabled={pending || loading}
              onClick={() => void saveRuleEdit()}
            >
              Save review
            </button>
            <button
              className="dq-button"
              type="button"
              disabled={pending}
              onClick={cancelRuleEdit}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
      <fieldset
        className="dq-review-filters"
        disabled={blocked}
        onClickCapture={(event) => {
          const button =
            event.target instanceof Element
              ? event.target.closest("button")
              : null;
          const label =
            button?.getAttribute("aria-label") ??
            button?.textContent?.trim() ??
            "";
          if (
            button &&
            !button.closest('[role="dialog"], dialog') &&
            /^(Filters|Edit filter:|Edit performer criteria)/.test(label)
          )
            filterReturnFocus.current = button;
        }}
      >
        <legend>Scene filters</legend>
        <div
          className="dq-queue-toolbar"
          onKeyDownCapture={(event) => {
            if (event.key === "Escape") allowCustomFieldRemoval.current = false;
            if (
              ["Delete", "Backspace"].includes(event.key) &&
              event.target instanceof Element &&
              event.target.closest("button")?.getAttribute("aria-label") ===
                "Edit filter: Custom Fields"
            )
              allowCustomFieldRemoval.current = true;
          }}
          onClickCapture={(event) => {
            const button =
              event.target instanceof Element
                ? event.target.closest("button")
                : null;
            if (
              button?.getAttribute("aria-label") ===
                "Remove filter: Custom Fields" ||
              button?.textContent?.trim() === "Clear all"
            )
              allowCustomFieldRemoval.current = true;
            else if (
              /^(Cancel|Filters)/.test(button?.textContent?.trim() ?? "") ||
              /^(Close|Dismiss)/.test(button?.getAttribute("aria-label") ?? "")
            )
              allowCustomFieldRemoval.current = false;
          }}
        >
          <DetailListToolbar
            filter={query.filter}
            objectFilter={presentCustomFieldCriteria(
              query.objectFilter,
              customFieldNames,
            )}
            criteriaDefinitions={[
              ...VIDEO_CRITERIA,
              {
                id: "custom-fields",
                label: "Custom Fields",
                filterKey: "customFieldCriteria",
              },
            ]}
            totalCount={total}
            sortOptions={VIDEO_SORT_OPTIONS}
            showSearch
            showSort
            showPagingControls={false}
            onFilterChange={(filter) => {
              if (
                filter.sort !== queryRef.current.filter.sort ||
                filter.direction !== queryRef.current.filter.direction
              )
                filter = { ...filter, sorts: undefined };
              replaceQuery({
                ...queryRef.current,
                filter: boundedFilter(filter),
              });
            }}
            onObjectFilterChange={(objectFilter) => {
              const next = preserveCustomFieldCriteria(
                queryRef.current.objectFilter,
                stripCustomFieldPresentation(objectFilter),
                allowCustomFieldRemoval.current,
              );
              allowCustomFieldRemoval.current = false;
              replaceQuery({
                ...queryRef.current,
                objectFilter: next,
                filter: { ...queryRef.current.filter, page: 1 },
              });
            }}
          />
          {!ruleDraft && queueDefaultsChanged && (
            <div className="dq-review-defaults">
              <button
                type="button"
                className="dq-button"
                aria-label="Save changes to review filters"
                title="Save changes to review filters"
                disabled={!onSaveDefaults}
                onClick={() => void saveQueryDefaults()}
              >
                <Save aria-hidden="true" />
              </button>
              <button
                type="button"
                className="dq-button"
                aria-label="Reset to default review filters"
                title="Reset to default review filters"
                onClick={() => {
                  const defaults = defaultQuery(saved);
                  replaceQuery(defaults, defaults.startFrom === "end");
                }}
              >
                <RotateCcw aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        {scope && (
          <div className="dq-scope-controls">
            <label>
              Performers to review{" "}
              <select
                value={scope.targetMode}
                onChange={(event) =>
                  updateScope({
                    targetMode: event.target.value as typeof scope.targetMode,
                  })
                }
              >
                <option value="all">All performers</option>
                <option value="selected">Specific performers</option>
                <option value="filter">Matching performer criteria</option>
              </select>
            </label>
            {scope.targetMode === "selected" && (
              <EntityReferenceMultiSelector
                entityType="performer"
                values={scope.performerIds}
                onChange={(performerIds) => updateScope({ performerIds })}
                placeholder="Select performers to review..."
                allowCreate={false}
              />
            )}
            {scope.targetMode === "filter" && (
              <>
                <button
                  type="button"
                  className="dq-button"
                  onClick={() => setPerformerDialog(true)}
                >
                  Edit performer criteria
                </button>
                <div className="dq-performer-criteria">
                  <DetailListToolbar
                    filter={{}}
                    onFilterChange={() => {}}
                    totalCount={0}
                    sortOptions={[]}
                    showSearch={false}
                    showSort={false}
                    showPagingControls={false}
                    criteriaDefinitions={PERFORMER_CRITERIA}
                    objectFilter={scope.performerFilter}
                    onObjectFilterChange={(performerFilter) =>
                      updateScope({ performerFilter })
                    }
                  />
                </div>
              </>
            )}
            <label>
              Occurrence tags{" "}
              <select
                value={scope.condition}
                onChange={(event) =>
                  updateScope({
                    condition: event.target.value as typeof scope.condition,
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
            {!["any", "isNull"].includes(scope.condition) && (
              <>
                <EntityReferenceMultiSelector
                  entityType="tag"
                  values={scope.conditionTagIds}
                  onChange={(conditionTagIds) => updateScope({ conditionTagIds })}
                  placeholder="Occurrence condition tags..."
                  allowCreate={false}
                />
                <label className="dq-checkbox">
                  <input
                    type="checkbox"
                    checked={scope.includeSubtags ?? true}
                    onChange={(event) => updateScope({ includeSubtags: event.target.checked })}
                  />
                  Include subtags
                </label>
              </>
            )}
          </div>
        )}
      </fieldset>
      {scope && (
        <FilterDialog
          open={performerDialog}
          onClose={() => setPerformerDialog(false)}
          criteria={PERFORMER_CRITERIA}
          activeFilter={scope.performerFilter}
          supportsFilterExpressions
          subjectLabel="performers to review"
          onApply={(performerFilter) => {
            setPerformerDialog(false);
            updateScope({ performerFilter });
          }}
        />
      )}
      <div className="dq-review-feedback" aria-live="polite">
        {error && (
          <p role="alert">
            {error}{" "}
            <button
              type="button"
              disabled={pending}
              onClick={() => {
                if (current) {
                  void readTags(current)
                    .then(setTags)
                    .catch((error) => setError(errorText(error)));
                } else replaceQuery(queryRef.current);
              }}
            >
              {current ? "Reload tags" : "Retry queue"}
            </button>
          </p>
        )}
        {notice && <p role="status">{notice}</p>}
      </div>
      <div className="dq-review-layout">
        <aside className="dq-review-queue" aria-label="Review queue">
          <fieldset disabled={blocked}>
            <DetailListPagination
              filter={query.filter}
              totalCount={total}
              onFilterChange={(filter) =>
                replaceQuery({ ...query, filter: boundedFilter(filter) })
              }
            />
          </fieldset>
          <div className="dq-review-queue-items">
            {items.map((item) => (
              <button
                type="button"
                className="dq-button"
                key={item.key}
                title={`${item.occurrence ? `${item.occurrence.performer.name} — ` : ""}${item.video.title || item.video.files[0]?.basename || "Scene"}`}
                aria-label={`${item.occurrence ? `${item.occurrence.performer.name} — ` : ""}${item.video.title || item.video.files[0]?.basename || "Scene"}`}
                disabled={blocked}
                aria-pressed={current?.key === item.key}
                onClick={() => {
                  showItem(item);
                  setError("");
                  setNotice("");
                }}
              >
                {item.occurrence && (
                  <PerformerAvatar performer={item.occurrence.performer} />
                )}
                <span className="dq-queue-scene-title">
                  {item.video.title || item.video.files[0]?.basename || "Scene"}
                </span>
              </button>
            ))}
          </div>
        </aside>
        <div className="dq-review-inspector">
          {current ? (
            <>
              <div className="dq-review-media">
                <h2 className="dq-review-video-title">
                  <a
                    href={`/video/${current.video.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {current.video.title ||
                      current.video.files[0]?.basename ||
                      `Video ${current.video.id}`}
                  </a>
                </h2>
                {[current, nextItemToPreload].filter(Boolean).map((item) => {
                  const playerItem = item as ReviewItem;
                  const active = playerItem.key === current.key;
                  return (
                    <div
                      key={`${playerItem.video.id}:${playerRevision}`}
                      className={active ? "dq-review-video-current" : "dq-review-video-preload"}
                      aria-hidden={active ? undefined : true}
                      inert={active ? undefined : true}
                    >
                      <VideoPlayer
                        videoId={playerItem.video.id}
                        streamUrl={videoStreamUrl(playerItem.video.id)}
                        posterUrl={active ? videoCoverUrl(playerItem.video) : undefined}
                        duration={playerItem.video.files[0]?.duration ?? 0}
                        format={playerItem.video.files[0]?.format}
                        audioCodec={playerItem.video.files[0]?.audioCodec}
                        extensionSurface={active ? "quick-view" : undefined}
                        autostart={active && autostartVideoId === playerItem.video.id}
                        keyboardShortcutsEnabled={active}
                        showAbLoop={active}
                        clip={
                          playerItem.video.parentVideoId != null
                            ? {
                                start: playerItem.video.clipStartSec ?? 0,
                                end: playerItem.video.clipEndSec,
                                loop: false,
                              }
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
              <div className="dq-review-panel">
                <h2>
                  {current.occurrence
                    ? `Reviewing ${current.occurrence.performer.name}`
                    : "Reviewing this video"}
                </h2>
                <p>
                  {scope
                    ? "Tags apply only to this performer in this video."
                    : "Tags apply to the video."}
                </p>
                {scope && (
                  <div
                    className="dq-review-partners"
                    aria-label="Matching scene partners"
                  >
                    {items
                      .filter((item) => item.video.id === current.video.id)
                      .map((item) => (
                        <button
                          type="button"
                          className="dq-button dq-partner-button"
                          title={item.occurrence?.performer.name}
                          aria-label={item.occurrence?.performer.name}
                          disabled={blocked}
                          key={item.key}
                          aria-pressed={item.key === current.key}
                          onClick={() => {
                            showItem(item);
                            setError("");
                          }}
                        >
                          {item.occurrence && (
                            <PerformerAvatar
                              performer={item.occurrence.performer}
                            />
                          )}
                        </button>
                      ))}
                  </div>
                )}
                <p>
                  Current {scope ? "occurrence" : "video"} tags:{" "}
                  {tags ? tags.names.join(", ") || "None" : "Loading…"}
                </p>
                {tags?.absent.length ? (
                  <p>
                    Confirmed absent tags:{" "}
                    <EntityReferenceMultiSelector
                      entityType="tag"
                      values={tags.absent}
                      onChange={() => {}}
                      disabled
                      allowCreate={false}
                    />
                  </p>
                ) : null}
                {editing ? (
                  <fieldset
                    ref={editor}
                    disabled={pending}
                    className="dq-tag-editor"
                  >
                    <legend>Edit {scope ? "occurrence" : "video"} tags</legend>
                    <EntityReferenceMultiSelector
                      entityType="tag"
                      values={draft}
                      onChange={setDraft}
                      placeholder="Choose tags for this item..."
                      allowCreate={false}
                    />
                    <div className="dq-row">
                      <button
                        type="button"
                        className="dq-button primary"
                        disabled={!tags}
                        onClick={() => void execute(undefined, true, true)}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="dq-button"
                        disabled={!tags}
                        onClick={() => void execute(undefined, false, true)}
                      >
                        Save & next
                      </button>
                      <button
                        type="button"
                        className="dq-button"
                        onClick={() => {
                          setEditing(false);
                          requestAnimationFrame(() =>
                            editButton.current?.focus(),
                          );
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </fieldset>
                ) : (
                  <>
                    <ReviewActionControls
                      actions={definition.actions}
                      canWrite={canWrite}
                      disabled={pending || loading || !tags || !!ruleDraft}
                      onApply={(action, stay) => void execute(action, stay)}
                    />
                    {saved.entityType === "performerOccurrence" &&
                      !saved.actions.length &&
                      saved.occurrence.tagIds.length > 0 && (
                        <fieldset
                          disabled={
                            !canWrite || pending || !tags || !!ruleDraft
                          }
                        >
                          <legend>Tag choices</legend>
                          {saved.occurrence.tagIds.map((id) => (
                            <label key={id}>
                              <input
                                type={
                                  saved.occurrence.multiple
                                    ? "checkbox"
                                    : "radio"
                                }
                                name="legacy-choice"
                                checked={legacySelected.includes(id)}
                                onChange={(event) =>
                                  setLegacySelected(
                                    saved.occurrence.multiple
                                      ? event.target.checked
                                        ? [...legacySelected, id]
                                        : legacySelected.filter(
                                            (value) => value !== id,
                                          )
                                      : [id],
                                  )
                                }
                              />
                              {legacyNames[id] ?? "Loading tag…"}
                            </label>
                          ))}
                          <button
                            type="button"
                            onClick={() => setLegacySelected([])}
                          >
                            No applicable tags
                          </button>
                          <button
                            type="button"
                            className="dq-button"
                            onClick={() =>
                              void execute(undefined, true, false, true)
                            }
                          >
                            Save choices
                          </button>
                          <button
                            type="button"
                            className="dq-button primary"
                            onClick={() =>
                              void execute(undefined, false, false, true)
                            }
                          >
                            Save & next performer
                          </button>
                        </fieldset>
                      )}
                  </>
                )}
                <div className="dq-row">
                  <button
                    type="button"
                    ref={editButton}
                    className="dq-button"
                    disabled={blocked || !!ruleDraft || !canWrite || !tags}
                    onClick={() => {
                      editorBase.current = [...tags!.ids];
                      setDraft([...tags!.ids]);
                      setEditing(true);
                    }}
                  >
                    Edit tags
                  </button>
                  <button
                    type="button"
                    className="dq-button"
                    disabled={blocked || !!ruleDraft}
                    onClick={() => void execute()}
                  >
                    Skip{scope ? " performer" : " video"}
                  </button>
                </div>
                {!canWrite && (
                  <p>Write permission is required to change tags.</p>
                )}
              </div>
            </>
          ) : (
            <p role="status">
              {loading
                ? "Loading review…"
                : total
                  ? "Reached the end in this direction."
                  : "No matching scenes."}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
