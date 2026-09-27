import { BatchOccurrenceDialog } from "./BatchOccurrenceDialog";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AUDIO_CRITERIA,
  AUDIO_SORT_OPTIONS,
  AudioPlayer,
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
import {
  findMedia,
  mediaCoverUrl,
  mediaLabel,
  mediaStreamUrl,
  request,
} from "./api";
import { MediaDescription } from "./MediaDescription";
import { ExistingAnswers } from "./ExistingAnswers";
import { FindAction, FindActionButton } from "./FindAction";
import { PerformerAvatar } from "./PerformerAvatar";
import { PerformerRankingList } from "./PerformerRankingList";
import {
  countPerformer,
  extendRanking,
  rankingSignature,
  recountRanked,
  type PerformerRanking,
} from "./performerRanking";
import {
  conditionSeeksMissingTags,
  hasAssessmentSteps,
  isOccurrenceReview,
  OCCURRENCE_CONDITION_LABELS,
  OCCURRENCE_CONDITIONS,
  reviewMediaKind,
  reviewValidation,
  boundedFilter,
  queueSignature,
  type MediaKind,
  type OccurrenceReview,
  type MediaReviewAction,
} from "./model";
import { loadOccurrencePage, resolvePerformers } from "./occurrences";
import { objectFiltersEqual } from "./objectFiltersEqual";
import { useReviewKeyLabels, useReviewKeys } from "./reviewKeys";
import { useTagNames } from "./tagNames";
import {
  defaultQuery,
  effectiveReview,
  focusedReview,
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

export function orderedItems(items: ReviewItem[], backwards: boolean) {
  if (!backwards) return items;
  const scenes = new Map<number, ReviewItem[]>();
  for (const item of items)
    scenes.set(item.media.id, [...(scenes.get(item.media.id) ?? []), item]);
  return [...scenes.values()].reverse().flat();
}
import {
  presentCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
const errorText = (error: unknown) =>
  error instanceof Error ? error.message : "Request failed.";
const RANKING_PAGE = 50;

export function ReviewActionControls({
  actions,
  disabled,
  canWrite,
  canAssess = true,
  onApply,
  onFind,
}: {
  actions: MediaReviewAction[];
  disabled: boolean;
  canWrite: boolean;
  /** False while assessments cannot be recorded: the absence field or a permission is missing. */
  canAssess?: boolean;
  onApply(action: MediaReviewAction, stay: boolean): void;
  onFind?(): void;
}) {
  const names = useTagNames(
    useMemo(
      () => actions.flatMap((action) => action.steps.flatMap((step) => step.tagIds)),
      [actions],
    ),
  );
  const tagName = (id: number) =>
    names[id] === undefined ? "Loading tag…" : (names[id] ?? "Unavailable tag");
  const keys = useReviewKeyLabels();
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
        Actions apply and advance. Shift-click or Shift + key applies and
        stays.
      </p>
      {onFind && (
        <FindActionButton disabled={!actions.length} onClick={onFind} />
      )}
      {actions.map((action, index) => (
        <div className="dq-action-pair" key={action.id}>
          <button
            type="button"
            className="dq-button primary"
            disabled={
              disabled ||
              (!canWrite && action.steps.length > 0) ||
              (!canAssess && hasAssessmentSteps(action))
            }
            onClick={(event) => onApply(action, event.shiftKey)}
          >
            <span>
              {keys.action(index) && <kbd>{keys.action(index)}</kbd>} {action.label}
            </span>
          </button>
          {action.steps.length > 0 && (
            <button
              type="button"
              className="dq-button dq-apply-stay-button"
              disabled={
                disabled || !canWrite || (!canAssess && hasAssessmentSteps(action))
              }
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
                    `${verbs[step.mode]}: ${step.tagIds.map(tagName).join(", ")}`,
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
  canAssess = true,
  onBusy,
  onSaveDefaults,
  editRequest = 0,
  renderRuleEditor,
}: {
  review: MediaReview;
  canWrite: boolean;
  canAssess?: boolean;
  onBusy(value: boolean): void;
  onSaveDefaults?(review: MediaReview): Promise<unknown>;
  editRequest?: number;
  renderRuleEditor?(
    draft: MediaReview,
    onChange: (draft: MediaReview) => void,
    saving: boolean,
  ): ReactNode;
}) {
  const mediaKind: MediaKind = reviewMediaKind(saved);
  const labels = mediaLabel(mediaKind);
  const fallbackTitle = mediaKind === "audio" ? "Audio" : "Scene";
  const mediaTitle = (media: ReviewItem["media"]) =>
    media.title || media.files[0]?.basename || fallbackTitle;
  const queueItemLabel = (item: ReviewItem) =>
    `${item.occurrence ? `${item.occurrence.performer.name} — ` : ""}${mediaTitle(item.media)}`;
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
  const [autostartMediaId, setAutostartMediaId] = useState<number | null>(null);
  const [playerRevision, setPlayerRevision] = useState(0);
  const nextItemToPreload = useMemo(() => {
    if (!current) return null;
    const currentIndex = items.findIndex((item) => item.key === current.key);
    if (currentIndex < 0) return null;
    return (
      items
        .slice(currentIndex + 1)
        .find((item) => item.media.id !== current.media.id) ?? null
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
  const [findOpen, setFindOpen] = useState(false);
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
  const presentedObjectFilter = useMemo(
    () => presentCustomFieldCriteria(query.objectFilter, customFieldNames),
    [customFieldNames, query.objectFilter],
  );
  const generation = useRef(0);
  const savedRef = useRef(saved);
  savedRef.current = saved;
  const definition = ruleDraft ?? saved;
  // The review's own scope. A performer focus narrows only the queue and batches below it.
  const scopedReview = useMemo(
    () => effectiveReview(definition, query),
    [definition, query],
  );
  const review = useMemo(
    () => focusedReview(scopedReview, query.performerFocus),
    [scopedReview, query.performerFocus],
  );
  const reviewRef = useRef(review);
  reviewRef.current = review;
  const scopedRef = useRef(scopedReview);
  scopedRef.current = scopedReview;
  const [queueView, setQueueView] = useState<"items" | "performers">("items");
  const [ranking, setRanking] = useState<PerformerRanking | null>(null);
  // A finished run clears its marker at once, while a render committed just before it may still
  // hold the run's last partial snapshot. Deciding from these refs, written in step with that
  // marker, keeps such a render's effect from starting the same count again.
  const rankingNow = useRef<PerformerRanking | null>(null);
  const rankingFailedFor = useRef("");
  function storeRanking(
    update:
      | PerformerRanking
      | null
      | ((current: PerformerRanking | null) => PerformerRanking | null),
  ) {
    const next = typeof update === "function" ? update(rankingNow.current) : update;
    rankingNow.current = next;
    setRanking(next);
  }
  const [rankingBusy, setRankingBusy] = useState(false);
  const [rankingError, setRankingError] = useState<{
    signature: string;
    message: string;
  } | null>(null);
  const rankingRun = useRef<{
    signature: string;
    controller: AbortController;
  } | null>(null);
  const signature = isOccurrenceReview(scopedReview)
    ? rankingSignature(scopedReview)
    : "";
  const [answersRevision, setAnswersRevision] = useState(0);
  const [focusPerformer, setFocusPerformer] = useState<{
    id: number;
    name: string;
    flags: string[];
  } | null>(null);
  useEffect(() => () => rankingRun.current?.controller.abort(), []);
  // A run for criteria no longer shown would only overwrite the ranking; stop it.
  useEffect(() => {
    const active = rankingRun.current;
    if (!active || active.signature === signature) return;
    active.controller.abort();
    rankingRun.current = null;
    setRankingBusy(false);
  }, [signature]);
  // Rank when the performer list is shown, again after criteria change, and to refill it.
  useEffect(() => {
    const current = rankingNow.current;
    if (
      queueView !== "performers" ||
      !signature ||
      rankingRun.current?.signature === signature ||
      rankingFailedFor.current === signature ||
      (current?.signature === signature && current.complete)
    )
      return;
    // Any previous ranking may lend its loaded performers; only a matching one continues.
    const same = current?.signature === signature ? current : null;
    void runRanking(current, same?.limit ?? RANKING_PAGE);
    // A run stopped before its first count leaves the ranking empty; the busy flag restarts it.
  }, [queueView, signature, ranking, rankingError, rankingBusy]);
  const focusId = query.performerFocus;
  const flagKey = JSON.stringify(
    isOccurrenceReview(scopedReview)
      ? (scopedReview.occurrence.flagPerformerTagIds ?? [])
      : [],
  );
  useEffect(() => {
    if (!focusId) {
      setFocusPerformer(null);
      return;
    }
    let active = true;
    const flagIds = new Set<number>(JSON.parse(flagKey));
    request<{ name: string; tags?: Array<{ id: number; name: string }> }>(
      `/api/performers/${focusId}`,
    )
      .then((performer) => {
        if (active)
          setFocusPerformer({
            id: focusId,
            name: performer.name,
            flags: (performer.tags ?? [])
              .filter((tag) => flagIds.has(tag.id))
              .map((tag) => tag.name),
          });
      })
      // The ranking's details, when it has this performer, stand in for a failed read.
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [focusId, flagKey]);
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
    if (isOccurrenceReview(rule)) {
      const result = await loadOccurrencePage(
        rule,
        targets.current,
        nextPage,
        signal,
      );
      return {
        items: result.items.map((occurrence) => ({
          key: occurrence.key,
          media: occurrence.media,
          occurrence,
        })),
        totalCount: result.totalCount,
      };
    }
    const result = await findMedia(
      rule,
      { ...rule.view.filter, page: nextPage },
      signal,
    );
    return {
      items: result.items.map((media) => ({ key: String(media.id), media })),
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
    if (next?.media.id !== current?.media.id) {
      setAutostartMediaId(resumePlayback && next ? next.media.id : null);
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
    setAutostartMediaId(null);
    setCurrent(null);
    setItems([]);
    setEditing(false);
    void (async () => {
      const rule = focusedReview(
        effectiveReview(savedRef.current, queryRef.current),
        queryRef.current.performerFocus,
      );
      targets.current =
        isOccurrenceReview(rule)
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
      // Occurrences are filtered after Cove pages the scenes, so a page can come back with
      // nothing to review while others still hold work. Keep going in the queue's direction.
      const step = rule.view.startFrom === "end" ? -1 : 1;
      while (
        isOccurrenceReview(rule) &&
        !result.items.length &&
        nextPage + step >= 1 &&
        nextPage + step <= end &&
        !controller.signal.aborted
      ) {
        nextPage += step;
        result = await fetchPage(rule, nextPage, controller.signal);
      }
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
    void readTags(mediaKind, current)
      .then((state) => {
        if (!active) return;
        setTags(state);
        setLegacySelected(
          isOccurrenceReview(saved)
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
    if (!isOccurrenceReview(saved) || saved.actions.length)
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
              ? `Reached the end in this direction. Matching items remain available from the ${labels.queue} pages.`
              : `No matching ${labels.many}.`,
          );
        return;
      }
      nextPage += direction;
    }
  }
  async function execute(
    action?: MediaReviewAction,
    stay = false,
    adHoc = false,
    legacy = false,
  ) {
    if (ruleDraft || !current || lock.current || loading || (editing && !adHoc))
      return;
    const mutating = adHoc || legacy || Boolean(action?.steps.length);
    const autoplayNext = mutating && !stay;
    if (mutating && (!canWrite || !tags)) return;
    if (action && hasAssessmentSteps(action) && !canAssess) return;
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
        const before = await readTags(mediaKind, current);
        if (action) {
          await applyTags(review, current, action);
        } else {
          const base =
            legacy && isOccurrenceReview(saved)
              ? saved.occurrence.tagIds.filter((id) => before.ids.includes(id))
              : editorBase.current;
          const selected = legacy ? legacySelected : draft;
          const change = difference(base, selected);
          await editTags(review, current, change);
        }
        lastWriteAt.current = Date.now();
        const after = await readTags(mediaKind, current);
        if (!optimisticNext) setTags(after);
        savedTags = true;
        setEditing(false);
        setNotice("Tags saved.");
        if (current.occurrence) {
          void recountAfterWrite(current.occurrence.performer.id);
          setAnswersRevision((value) => value + 1);
        }
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
          setAutostartMediaId(null);
          setPlayerRevision((revision) => revision + 1);
          setCurrent(current);
        }
        lastWriteAt.current = Date.now();
        try {
          setTags(await readTags(mediaKind, current));
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
  // Action keys belong to the workspace while an item is shown, or is about to be, and no tag
  // editor, rule editor or dialog of its own is open. They stay claimed while a write or load
  // runs, when execute ignores them, so a quick f, g or k never falls through to Cove's
  // fullscreen, go-to chords or play/pause in between items.
  const keysActive =
    !editing &&
    !ruleDraft &&
    !performerDialog &&
    !findOpen &&
    (current != null || loading || pending);
  useReviewKeys({
    surface: "local",
    enabled: keysActive,
    actionCount: saved.actions.length,
    onAction: (index, stay) => {
      const action = saved.actions[index];
      if (action) void execute(action, stay);
    },
    onFind: () => setFindOpen(true),
  });
  const actionBlocked = (action: MediaReviewAction) =>
    pending ||
    loading ||
    !tags ||
    !!ruleDraft ||
    (!canWrite && action.steps.length > 0) ||
    (!canAssess && hasAssessmentSteps(action));
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
  ) => {
    const { performerFocus, ...rest } = queryRef.current;
    // A focused performer belongs to the scope it was picked from; a new scope drops it.
    const keepFocus =
      performerFocus &&
      !("targetMode" in change || "performerIds" in change || "performerFilter" in change);
    replaceQuery({
      ...rest,
      ...(keepFocus ? { performerFocus } : {}),
      filter: { ...rest.filter, page: 1 },
      performerScope: { ...scope!, ...change },
    });
  };
  async function runRanking(base: PerformerRanking | null, limit: number) {
    const rule = scopedRef.current;
    if (!isOccurrenceReview(rule)) return;
    rankingRun.current?.controller.abort();
    const run = {
      signature: rankingSignature(rule),
      controller: new AbortController(),
    };
    rankingRun.current = run;
    rankingFailedFor.current = "";
    setRankingBusy(true);
    setRankingError(null);
    try {
      const next = await extendRanking(rule, base, limit, run.controller.signal, {
        onProgress: (partial) => {
          if (rankingRun.current === run) storeRanking(partial);
        },
      });
      if (rankingRun.current === run) storeRanking(next);
    } catch (error) {
      if (rankingRun.current === run && !run.controller.signal.aborted) {
        rankingFailedFor.current = run.signature;
        setRankingError({ signature: run.signature, message: errorText(error) });
      }
    } finally {
      if (rankingRun.current === run) {
        rankingRun.current = null;
        setRankingBusy(false);
      }
    }
  }
  // Counts are stale after the write; keep the loaded performers and count them again.
  function invalidateRanking() {
    rankingRun.current?.controller.abort();
    rankingRun.current = null;
    setRankingBusy(false);
    storeRanking((ranked) => (ranked ? { ...ranked, partial: true, complete: false } : ranked));
  }
  // A single write changes one performer's count; recount just that one.
  async function recountAfterWrite(performerId: number) {
    const rule = scopedRef.current;
    if (!isOccurrenceReview(rule)) return;
    if (rankingRun.current) {
      invalidateRanking();
      return;
    }
    const key = rankingSignature(rule);
    // A stale ranking is counted again anyway when shown.
    if (rankingNow.current?.signature !== key || rankingNow.current.partial) return;
    const wait = 1100 - (Date.now() - lastWriteAt.current);
    if (wait > 0) await new Promise((resolve) => window.setTimeout(resolve, wait));
    try {
      const count = await countPerformer(rule, performerId);
      // A run started meanwhile would overwrite this count with the one from before the write.
      if (rankingRun.current) {
        invalidateRanking();
        return;
      }
      storeRanking((ranked) =>
        ranked?.signature === key ? recountRanked(ranked, performerId, count) : ranked,
      );
    } catch {
      storeRanking((ranked) =>
        ranked?.signature === key ? { ...ranked, partial: true, complete: false } : ranked,
      );
    }
  }
  const rankedFocus = query.performerFocus
    ? ranking?.candidates.find((item) => item.id === query.performerFocus)
    : undefined;
  // Never show the previously focused performer while the next one loads.
  const focusInfo =
    focusPerformer?.id === query.performerFocus ? focusPerformer : (rankedFocus ?? null);
  function focusOn(performerId: number) {
    if (lock.current) return;
    const next = {
      ...queryRef.current,
      performerFocus: performerId,
      filter: { ...queryRef.current.filter, page: 1 },
    };
    replaceQuery(next, next.startFrom === "end");
    setQueueView("items");
  }
  function clearFocus() {
    const { performerFocus: _focus, ...rest } = queryRef.current;
    replaceQuery(
      { ...rest, filter: { ...rest.filter, page: 1 } },
      rest.startFrom === "end",
    );
  }

  return (
    <section
      className={`dq-review-workspace${mediaKind === "audio" ? " dq-audio" : ""}`}
      aria-label={
        scope
          ? mediaKind === "audio"
            ? "Audio performer occurrence review"
            : "Performer occurrence review"
          : mediaKind === "audio"
            ? "Audio review"
            : "Video review"
      }
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
        <legend>{mediaKind === "audio" ? "Audio filters" : "Scene filters"}</legend>
        <div className="dq-queue-toolbar">
          <DetailListToolbar
            filter={query.filter}
            objectFilter={presentedObjectFilter}
            criteriaDefinitions={
              mediaKind === "audio" ? AUDIO_CRITERIA : VIDEO_CRITERIA
            }
            customFieldEntityType={mediaKind}
            totalCount={total}
            sortOptions={
              mediaKind === "audio" ? AUDIO_SORT_OPTIONS : VIDEO_SORT_OPTIONS
            }
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
                filter: boundedFilter(filter, mediaKind),
              });
            }}
            onObjectFilterChange={(objectFilter) => {
              replaceQuery({
                ...queryRef.current,
                objectFilter: stripCustomFieldPresentation(
                  objectFilter,
                  customFieldNames,
                  queryRef.current.objectFilter,
                ),
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
                placeholder="All performers..."
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
            {query.performerFocus && (
              <div
                className="dq-performer-focus"
                role="group"
                aria-label="Performer focus"
              >
                <PerformerAvatar
                  performer={{
                    id: query.performerFocus,
                    name: focusInfo?.name ?? "",
                  }}
                />
                <span>
                  Only {focusInfo?.name ?? `performer ${query.performerFocus}`}
                </span>
                {focusInfo?.flags.length ? (
                  <span className="dq-performer-flag">
                    Flagged: {focusInfo.flags.join(", ")}
                  </span>
                ) : null}
                <button type="button" className="dq-button" onClick={clearFocus}>
                  Show all performers
                </button>
              </div>
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
                {OCCURRENCE_CONDITIONS.map((condition) => (
                  <option value={condition} key={condition}>
                    {OCCURRENCE_CONDITION_LABELS[condition]}
                  </option>
                ))}
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
                {conditionSeeksMissingTags(scope.condition) && (
                  <label className="dq-checkbox">
                    <input
                      type="checkbox"
                      checked={scope.hideConfirmedAbsent ?? true}
                      onChange={(event) => updateScope({ hideConfirmedAbsent: event.target.checked })}
                    />
                    Hide occurrences confirmed absent
                  </label>
                )}
              </>
            )}
          </div>
        )}
        {isOccurrenceReview(scopedReview) && query.performerFocus && (
          <ExistingAnswers
            review={scopedReview}
            performerId={query.performerFocus}
            revision={answersRevision}
          />
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
      {isOccurrenceReview(review) && canWrite && (
        <BatchOccurrenceDialog
          review={review}
          hidden={!!ruleDraft}
          disabled={blocked || !!ruleDraft}
          performerFlags={query.performerFocus ? focusInfo?.flags : undefined}
          onOpen={() => { lock.current = true; setPending(true); }}
          onWrite={() => { lastWriteAt.current = Date.now(); }}
          onClose={(wrote) => {
            if (wrote) {
              lastWriteAt.current = Date.now();
              const focused = queryRef.current.performerFocus;
              if (focused) void recountAfterWrite(focused);
              else invalidateRanking();
              setAnswersRevision((value) => value + 1);
              void new Promise(resolve => window.setTimeout(resolve, 1100)).then(() => {
                endOperation();
                if (alive.current) setRevision(value => value + 1);
              });
            } else endOperation();
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
                  void readTags(mediaKind, current)
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
          {scope && (
            <div className="dq-queue-view" role="group" aria-label="Queue view">
              <button
                type="button"
                className="dq-button"
                aria-pressed={queueView === "items"}
                onClick={() => setQueueView("items")}
              >
                {mediaKind === "audio" ? "Audios" : "Scenes"}
              </button>
              <button
                type="button"
                className="dq-button"
                aria-pressed={queueView === "performers"}
                onClick={() => setQueueView("performers")}
              >
                Performers
              </button>
            </div>
          )}
          {scope && queueView === "performers" ? (
            <PerformerRankingList
              ranking={ranking?.signature === signature ? ranking : null}
              busy={rankingBusy}
              error={
                rankingError?.signature === signature ? rankingError.message : ""
              }
              focus={query.performerFocus}
              disabled={blocked}
              labels={labels}
              onFocus={focusOn}
              onMore={() => {
                const current = rankingNow.current;
                if (current) void runRanking(current, current.limit + RANKING_PAGE);
              }}
              onRefresh={() => {
                storeRanking(null);
                void runRanking(null, RANKING_PAGE);
              }}
            />
          ) : (
            <>
              <fieldset disabled={blocked}>
                <DetailListPagination
                  filter={query.filter}
                  totalCount={total}
                  onFilterChange={(filter) =>
                    replaceQuery({ ...query, filter: boundedFilter(filter, mediaKind) })
                  }
                />
              </fieldset>
              <div className="dq-review-queue-items">
                {items.map((item) => (
                  <button
                    type="button"
                    className="dq-button"
                    key={item.key}
                    title={queueItemLabel(item)}
                    aria-label={queueItemLabel(item)}
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
                      {mediaTitle(item.media)}
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
        <div className="dq-review-inspector">
          {current ? (
            <>
              <div className="dq-review-media">
                <h2 className="dq-review-video-title">
                  <a
                    href={`/${mediaKind}/${current.media.id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {current.media.title ||
                      current.media.files[0]?.basename ||
                      `${mediaKind === "audio" ? "Audio" : "Video"} ${current.media.id}`}
                  </a>
                </h2>
                {[current, nextItemToPreload].filter(Boolean).map((item) => {
                  const playerItem = item as ReviewItem;
                  const active = playerItem.key === current.key;
                  return (
                    <div
                      key={`${playerItem.media.id}:${playerRevision}`}
                      className={active ? "dq-review-video-current" : "dq-review-video-preload"}
                      aria-hidden={active ? undefined : true}
                      inert={active ? undefined : true}
                    >
                      {mediaKind === "audio" ? (
                        <AudioPlayer
                          streamUrl={mediaStreamUrl("audio", playerItem.media.id)}
                          format={playerItem.media.files[0]?.format ?? ""}
                          title={mediaTitle(playerItem.media)}
                          coverUrl={
                            active ? mediaCoverUrl("audio", playerItem.media) : undefined
                          }
                          duration={playerItem.media.files[0]?.duration ?? 0}
                          autostart={
                            active && autostartMediaId === playerItem.media.id
                          }
                        />
                      ) : (
                        <VideoPlayer
                          videoId={playerItem.media.id}
                          streamUrl={mediaStreamUrl("video", playerItem.media.id)}
                          posterUrl={
                            active ? mediaCoverUrl("video", playerItem.media) : undefined
                          }
                          duration={playerItem.media.files[0]?.duration ?? 0}
                          format={playerItem.media.files[0]?.format}
                          audioCodec={playerItem.media.files[0]?.audioCodec}
                          extensionSurface={active ? "quick-view" : undefined}
                          autostart={active && autostartMediaId === playerItem.media.id}
                          keyboardShortcutsEnabled={active}
                          showAbLoop={active}
                          clip={
                            playerItem.media.parentVideoId != null
                              ? {
                                  start: playerItem.media.clipStartSec ?? 0,
                                  end: playerItem.media.clipEndSec,
                                  loop: false,
                                }
                              : undefined
                          }
                        />
                      )}
                    </div>
                  );
                })}
                {mediaKind === "audio" && (
                  <MediaDescription
                    key={current.media.id}
                    details={current.media.details}
                    label={labels.one}
                  />
                )}
              </div>
              <div className="dq-review-panel">
                <h2>
                  {current.occurrence
                    ? `Reviewing ${current.occurrence.performer.name}`
                    : `Reviewing this ${labels.one}`}
                </h2>
                <p>
                  {scope
                    ? `Tags apply only to this performer in this ${labels.one}.`
                    : `Tags apply to the ${labels.one}.`}
                </p>
                {scope && (
                  <div
                    className="dq-review-partners"
                    aria-label={`Matching ${labels.queue} partners`}
                  >
                    {items
                      .filter((item) => item.media.id === current.media.id)
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
                  Current {scope ? "occurrence" : labels.one} tags:{" "}
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
                    <legend>Edit {scope ? "occurrence" : labels.one} tags</legend>
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
                      canAssess={canAssess}
                      disabled={pending || loading || !tags || !!ruleDraft}
                      onApply={(action, stay) => void execute(action, stay)}
                      onFind={ruleDraft ? undefined : () => setFindOpen(true)}
                    />
                    {isOccurrenceReview(saved) &&
                      !saved.actions.length &&
                      saved.occurrence.tagIds.length > 0 && (
                        <fieldset
                          className="dq-tag-choices"
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
                    Skip{scope ? " performer" : ` ${labels.one}`}
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
                  : `No matching ${labels.many}.`}
            </p>
          )}
        </div>
      </div>
      {findOpen && (
        <FindAction
          actions={saved.actions}
          isDisabled={(action) => actionBlocked(action as MediaReviewAction)}
          onApply={(action, stay) => {
            setFindOpen(false);
            void execute(action as MediaReviewAction, stay);
          }}
          onClose={() => setFindOpen(false)}
        />
      )}
    </section>
  );
}
