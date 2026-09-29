import { BatchOccurrenceDialog } from "./BatchOccurrenceDialog";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AUDIO_CRITERIA,
  AUDIO_SORT_OPTIONS,
  AudioPlayer,
  DetailListToolbar,
  EntityReferenceMultiSelector,
  FilterDialog,
  formatDuration,
  getResolutionLabel,
  PERFORMER_CRITERIA,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  VideoPlayer,
} from "@cove/runtime/components";
import {
  Ban,
  ExternalLink,
  Film,
  Flag,
  Headphones,
  SkipForward,
  Tag,
} from "@cove/runtime/lucide-react";
import {
  findMedia,
  mediaCoverUrl,
  mediaLabel,
  mediaStreamUrl,
  request,
  type MediaItem,
  type TagGroup,
  type TagInfo,
} from "./api";
import {
  ActionPad,
  createActionPreviewStore,
  useActionPreview,
  type ActionPreviewStore,
} from "./ActionPad";
import {
  groupStatus,
  openGroups,
  tagsAfterAction,
  waitsForGroups,
  type GroupStatus,
} from "./answerGroups";
import {
  attentionReasons,
  combineAttention,
  flagAttention,
  flagCategoryIds,
  flagSummary,
  mixedAttention,
  performerFlagTags,
  type AttentionEntry,
  type ProfileTag,
} from "./attention";
import {
  currentTags,
  previewActionEffect,
  useResolvedTrees,
  useTagTrees,
  type TagTrees,
} from "./effectPreview";
import { draftSignature, EditorDrawer } from "./EditorDrawer";
import { MediaDescription } from "./MediaDescription";
import { ExistingAnswersView, usePerformerAnswers } from "./ExistingAnswers";
import { FindAction } from "./FindAction";
import { PerformerAvatar } from "./PerformerAvatar";
import { PerformerRankingList } from "./PerformerRankingList";
import {
  LayoutSwitch,
  MoreMenu,
  ReviewHeader,
  ReviewPager,
  type MoreMenuItem,
} from "./ReviewHeader";
import { ScopePopover } from "./ScopePopover";
import {
  countPerformer,
  extendRanking,
  rankingSignature,
  recountRanked,
  type PerformerRanking,
} from "./performerRanking";
import { answerCategories } from "./performerAnswers";
import { rememberProfile, usePerformerProfile } from "./performerProfiles";
import {
  hasAssessmentSteps,
  isOccurrenceReview,
  performerFlags,
  reviewEntityType,
  reviewMediaKind,
  reviewValidation,
  boundedFilter,
  type MediaKind,
  type MediaReviewAction,
  type PerformerFlag,
} from "./model";
import { loadOccurrencePage, resolvePerformers } from "./occurrences";
import { useReviewKeys } from "./reviewKeys";
import { useTags } from "./tagNames";
import { ReviewTagBadge } from "./TagDisplay";
import { sortTagsForDisplay } from "./tagOrder";
import { useMobileLayout } from "./viewport";
import {
  defaultQuery,
  effectiveReview,
  focusedReview,
  normalizedReview,
  queryDiffers,
  readQuery,
  savableQuery,
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
/** Only tag reviews assign tag groups; media reviews edit their actions without any. */
const NO_TAG_GROUPS: readonly TagGroup[] = [];
/**
 * Host dialogs, not the extension's own scope popover or editor drawer, hold focus while they are
 * open.
 */
const HOST_DIALOG = '[role="dialog"]:not(.dq-scope-popover):not(.dq-drawer), dialog[open]';

interface StayedCursor {
  key: string;
  page: number;
  before: string[];
  after: string[];
}

/** Page-level controls the workspace shows in its header: they belong to the page, not the queue. */
export interface WorkspacePageControls {
  /** Back to the list of reviews. */
  onBack?(): void;
  /** The More menu's items, around the workspace's own Edit review. */
  moreItems?(edit: { onSelect(): void; disabled?: boolean }): MoreMenuItem[];
  /** Video reviews: switch this visit to the card grid. */
  onGrid?(): void;
  /** The page's notices, shown under the header. */
  notices?: ReactNode;
  /** The page is saving (a duplicate of this review): the way back, Edit review and the layout wait. */
  busy?: boolean;
}

/** "Studio · 2024-08-11 · 1080p · 27:31" for the title line; parts the item lacks are left out. */
function mediaMeta(media: MediaItem, kind: MediaKind): string {
  const file = media.files[0];
  return [
    media.studioName,
    media.date,
    kind === "video" ? getResolutionLabel(file?.width, file?.height) : "",
    file?.duration ? formatDuration(file.duration) : "",
  ]
    .filter(Boolean)
    .join(" · ");
}

function QueueThumbnail({ media, kind }: { media: MediaItem; kind: MediaKind }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="dq-queue-thumb" aria-hidden="true">
      {failed ? (
        kind === "audio" ? (
          <Headphones />
        ) : (
          <Film />
        )
      ) : (
        <img
          src={mediaCoverUrl(kind, media, 160)}
          alt=""
          loading="lazy"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}

/**
 * The item's current tags as Cove's badges, in Cove's display order, with the previewed action's
 * effect drawn over them: "+" and a dashed outline for tags it adds, "−" and a strike-through for
 * tags it removes, and an "absent" mark for tags it records as confirmed absent. Only this part
 * re-renders while the pointer moves along the pad.
 */
function CurrentTags({
  tags,
  preview,
  showPreview,
  trees,
  actionTagIds,
  label,
}: {
  tags: TagState | null;
  preview: ActionPreviewStore;
  /** False while the tags are being edited by hand. */
  showPreview: boolean;
  trees: TagTrees;
  actionTagIds: readonly number[];
  label: string;
}) {
  const previewed = useActionPreview(preview);
  const action = showPreview ? previewed : null;
  const absentIds = tags?.absent;
  const known = useTags(
    useMemo(() => [...actionTagIds, ...(absentIds ?? [])], [actionTagIds, absentIds]),
  );
  // Tags the item does not carry come from the shared tag cache, with Cove's badge data.
  const tagOf = (id: number): TagInfo =>
    known[id] ?? { id, name: known[id] === undefined ? "…" : "Unavailable tag" };
  const inOrder = (ids: readonly number[]) => sortTagsForDisplay(ids.map(tagOf));
  const effect = action && tags ? previewActionEffect(action, tags, trees) : null;
  const chips = tags ? currentTags(tags) : [];
  const has = new Set(chips.map((chip) => chip.id));
  const removed = new Set(effect?.removed);
  const markedAbsent = new Set(effect?.markedAbsent);
  const cleared = new Set(effect?.absenceCleared);
  const absentMark = (
    <span className="dq-chip-marker">
      <Ban aria-hidden="true" />
      absent
    </span>
  );
  const added = inOrder(effect?.added ?? []);
  const newlyAbsent = inOrder((effect?.markedAbsent ?? []).filter((id) => !has.has(id)));
  return (
    <section className="dq-panel-section" aria-label={label}>
      <h3 className="dq-eyebrow">Current tags</h3>
      {!tags ? (
        <p className="dq-muted">Loading…</p>
      ) : (
        <>
          {chips.length || added.length || newlyAbsent.length ? (
            <ul className="dq-tags" aria-label="Current tags">
              {chips.map((tag) =>
                removed.has(tag.id) ? (
                  <li key={tag.id} className="dq-tag dq-tag-removed">
                    <del>
                      − <ReviewTagBadge tag={tag} />
                    </del>
                    {markedAbsent.has(tag.id) && absentMark}
                  </li>
                ) : (
                  <li key={tag.id} className="dq-tag">
                    <ReviewTagBadge tag={tag} />
                  </li>
                ),
              )}
              {added.map((tag) => (
                <li key={`added-${tag.id}`} className="dq-tag dq-tag-added">
                  <ins>
                    + <ReviewTagBadge tag={tag} />
                  </ins>
                </li>
              ))}
              {newlyAbsent.map((tag) => (
                <li key={`absent-${tag.id}`} className="dq-tag dq-tag-absent-new">
                  <ins>
                    <ReviewTagBadge tag={tag} />
                  </ins>
                  {absentMark}
                </li>
              ))}
            </ul>
          ) : (
            <p className="dq-muted">None</p>
          )}
          {tags.absent.length > 0 && (
            <>
              <h4 className="dq-subheading">Confirmed absent</h4>
              <ul className="dq-tags" aria-label="Confirmed absent tags">
                {inOrder(tags.absent).map((tag) => (
                  <li
                    key={tag.id}
                    className={`dq-tag dq-tag-absent${cleared.has(tag.id) ? " dq-tag-removed" : ""}`}
                  >
                    <Ban aria-hidden="true" />
                    {cleared.has(tag.id) ? (
                      <del>
                        − <ReviewTagBadge tag={tag} />
                      </del>
                    ) : (
                      <ReviewTagBadge tag={tag} />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </section>
  );
}

/**
 * Where the performer on screen needs attention (attention.ts): flags for the whole review as a
 * badge each, as they always read, then each category with its reasons, a flag marking each.
 */
function AttentionList({ entries }: { entries: readonly AttentionEntry[] }) {
  return (
    <ul className="dq-attention" aria-label="Needs attention">
      {entries.map((entry) => (
        <li key={entry.key} className="dq-attention-item">
          {entry.tagIds !== null && <span className="dq-attention-category">{entry.name}</span>}
          {attentionReasons(entry).map((reason) => (
            <span key={reason} className="dq-badge dq-badge-warning dq-flag-badge">
              <Flag aria-hidden="true" />
              {reason}
            </span>
          ))}
        </li>
      ))}
    </ul>
  );
}

export function ReviewWorkspace({
  review: saved,
  canWrite,
  canAssess = true,
  onBusy,
  onSaveDefaults,
  editRequest = 0,
  onEditRequestHandled,
  pageControls,
  stayOnTap: pageStayOnTap,
  onStayOnTapChange,
}: {
  review: MediaReview;
  canWrite: boolean;
  canAssess?: boolean;
  onBusy(value: boolean): void;
  onSaveDefaults?(review: MediaReview): Promise<unknown>;
  /** A new non-zero value opens the editor once the first queue has loaded. */
  editRequest?: number;
  /** Called once a request has opened the editor, so a later mount does not open it again. */
  onEditRequestHandled?(): void;
  pageControls?: WorkspacePageControls;
  /**
   * Phone-sized windows: Stay on this item, held by the page so it lasts from review to review
   * until the page reloads. Without it the workspace keeps its own.
   */
  stayOnTap?: boolean;
  onStayOnTapChange?(stay: boolean): void;
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
  // Why the drawer's last save failed.
  const [ruleError, setRuleError] = useState("");
  const drawerRef = useRef<HTMLElement>(null);
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
  // Touch has neither Shift nor the pad's hover pin: in phone-sized windows the pad's Stay on this
  // item switch makes a tapped action, in the pad or in Find action, apply and stay.
  const mobile = useMobileLayout();
  const [ownStayOnTap, setOwnStayOnTap] = useState(false);
  const stayOnTap = pageStayOnTap ?? ownStayOnTap;
  const setStayOnTap = onStayOnTapChange ?? setOwnStayOnTap;
  useEffect(() => {
    if (loading || performerDialog || !filterReturnFocus.current) return;
    const frame = requestAnimationFrame(() => {
      if (document.querySelector(HOST_DIALOG)) return;
      const target = filterReturnFocus.current;
      filterReturnFocus.current = null;
      // Only hand back focus that was lost, never take it from where the reviewer is now (for
      // example typing a search after cancelling the dialog).
      const active = document.activeElement;
      if (active && active !== document.body) return;
      if (target?.isConnected && !target.disabled) target.focus();
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
  // The focused performer as read: their name and profile tags, whose flags the review looks for.
  const [focusPerformer, setFocusPerformer] = useState<{
    id: number;
    name: string;
    tags: ProfileTag[];
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
  useEffect(() => {
    if (!focusId) {
      setFocusPerformer(null);
      return;
    }
    let active = true;
    request<{ name: string; tags?: unknown }>(`/api/performers/${focusId}`)
      .then((performer) => {
        // A fresh read: the item column keeps it for this performer too.
        const tags = rememberProfile(focusId, performer.tags);
        if (active) setFocusPerformer({ id: focusId, name: performer.name, tags });
      })
      // The ranking's details, when it has this performer, stand in for a failed read.
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [focusId]);
  // Performer flags (attention.ts): the review's pairs, the categories they affect with their
  // trees, resolved once while the review is open, and those categories' names.
  const flagsKey = JSON.stringify(
    isOccurrenceReview(scopedReview) ? performerFlags(scopedReview.occurrence) : [],
  );
  const flags = useMemo<PerformerFlag[]>(() => JSON.parse(flagsKey), [flagsKey]);
  const categoryIds = useMemo(() => flagCategoryIds(flags), [flags]);
  const categoryTrees = useResolvedTrees(categoryIds);
  const categoryTags = useTags(categoryIds);
  const categoryName = (id: number) =>
    categoryTags[id]?.name ?? (categoryTags[id] === null ? "Unavailable tag" : "…");
  const flagCategory = (id: number) => ({
    name: categoryName(id),
    tagIds: categoryTrees.get(id) ?? [id],
    resolved: categoryTrees.has(id),
  });
  // The focused performer's existing answers: shown in the item column, and where they differ
  // (mixed answers) the performer needs attention too.
  const focusAnswers = usePerformerAnswers(
    isOccurrenceReview(scopedReview) ? scopedReview : null,
    focusId ?? null,
    answersRevision,
  );
  const queueDefaultsChanged = queryDiffers(saved, query);
  // What saving the queue would change: tag bins (carried over from the grid in the URL) never
  // count, as the review never keeps them.
  const savableQueueChanged = queryDiffers(saved, savableQuery(saved, query));
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
    if (mutating && (!canWrite || !tags)) return;
    if (action && hasAssessmentSteps(action) && !canAssess) return;
    // Answer groups: a plain action (a key, a tile or Find action; not Shift, the pin or Stay on
    // this item) stays on the item while one of the review's groups would still be open after it.
    // The item's tags and the action's foreseen effect decide at once, so moving on can start
    // before the write ends; Skip and Edit tags move on as always.
    const waitingForGroups =
      !stay &&
      !adHoc &&
      !legacy &&
      mutating &&
      action !== undefined &&
      tags !== null &&
      waitsForGroups(saved) &&
      openGroups(groupStatus(saved.actions, tagsAfterAction(action, tags, trees))).length > 0;
    lock.current = true;
    setPending(true);
    setError("");
    setNotice("");
    const currentIndex = items.findIndex((item) => item.key === current.key);
    const optimisticNext =
      mutating && !stay && !waitingForGroups && currentIndex >= 0
        ? (items[currentIndex + 1] ?? null)
        : null;
    if (optimisticNext) {
      setItems((currentItems) =>
        currentItems.filter((item) => item.key !== current.key),
      );
      showItem(optimisticNext, true);
    }
    let savedTags = false;
    // The groups the saved tags leave open, while the item waits for them.
    let openAfter: GroupStatus[] = [];
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
        // The saved tags have the last word: when they answer every group after all, move on.
        if (waitingForGroups) openAfter = openGroups(groupStatus(saved.actions, after));
        setNotice(
          openAfter.length
            ? `Tags saved. Staying until answered: ${openAfter.map((group) => group.name).join(", ")}.`
            : "Tags saved.",
        );
        if (current.occurrence) {
          void recountAfterWrite(current.occurrence.performer.id);
          setAnswersRevision((value) => value + 1);
        }
      }
      if (!alive.current || deferredRestore.current) return;
      // Waiting for open groups leaves the queue as it is, with the item marked in it and the next
      // one preloaded: the action that answers the last group then moves on at once, and its
      // refresh reconciles the queue, an item that has left it meanwhile included.
      if (mutating) {
        if (!openAfter.length) await advance(true, stay, !stay);
      } else if (!stay) await advance();
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
    actions: saved.actions,
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
    // The draft is the saved review; the queue's criteria join it as they are while it is edited,
    // so criteria changed before editing began are unsaved changes too.
    setRuleDraft(structuredClone(saved));
    setRuleError("");
    setNotice("");
    setError("");
  }
  useEffect(() => {
    // The page clears a handled request, so the next one counts again.
    if (!editRequest) {
      handledEditRequest.current = 0;
      return;
    }
    if (editRequest !== handledEditRequest.current && initialLoadSettled && !loading) {
      handledEditRequest.current = editRequest;
      beginRuleEdit();
      onEditRequestHandled?.();
    }
  }, [editRequest, loading, initialLoadSettled]);
  function finishRuleEdit() {
    setRuleDraft(null);
    setRuleError("");
    requestAnimationFrame(() => {
      // Only an opener still on the page takes focus back; the page itself would drop it.
      const opener = ruleOpener.current;
      if (opener?.isConnected && opener !== document.body) opener.focus();
    });
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
      savableQuery(savedRef.current, queryRef.current),
    );
    const invalid = reviewValidation(updated);
    if (invalid) {
      setRuleError(invalid);
      return;
    }
    lock.current = true;
    setPending(true);
    setRuleError("");
    try {
      const result = await onSaveDefaults(updated);
      if (result === false) throw new Error("Could not save review.");
      finishRuleEdit();
      setNotice("Review saved.");
    } catch (error) {
      setRuleError(
        "Could not save review. Your edits are still open. " + errorText(error),
      );
    } finally {
      endOperation();
    }
  }
  async function saveQueryDefaults() {
    if (!onSaveDefaults || lock.current) return;
    const query = savableQuery(savedRef.current, queryRef.current);
    const updated = effectiveReview(savedRef.current, {
      ...query,
      filter: { ...query.filter, page: 1 },
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
  const focusInfo: { id: number; name: string; flags: ProfileTag[] } | null =
    focusPerformer && focusPerformer.id === query.performerFocus
      ? { ...focusPerformer, flags: performerFlagTags(flags, focusPerformer.tags) }
      : rankedFocus
        ? { ...rankedFocus, flags: performerFlagTags(flags, rankedFocus.tags) }
        : null;
  /**
   * A performer's flag tags where the page knows their profile already: the focus read, or the
   * ranking, whose performers keep their whole profile, so flags changed since still match.
   */
  const knownFlagTags = (performerId: number): ProfileTag[] | undefined => {
    if (focusPerformer?.id === performerId)
      return performerFlagTags(flags, focusPerformer.tags);
    const candidate = ranking?.candidates.find((item) => item.id === performerId);
    return candidate ? performerFlagTags(flags, candidate.tags) : undefined;
  };
  // The performer on screen: their flags, from what is known or else one read of their profile
  // (kept for the session), and while they are the focused one their mixed answers.
  const shownPerformer = current?.occurrence?.performer.id ?? null;
  const shownKnown = shownPerformer === null ? undefined : knownFlagTags(shownPerformer);
  const shownProfile = usePerformerProfile(
    flags.length > 0 &&
      shownPerformer !== null &&
      shownPerformer !== query.performerFocus &&
      shownKnown === undefined
      ? shownPerformer
      : null,
  );
  const shownFlagTags =
    shownKnown ?? (shownProfile ? performerFlagTags(flags, shownProfile) : []);
  const focusMixed =
    focusAnswers.summary && query.performerFocus
      ? mixedAttention(answerCategories(focusAnswers.summary, definition.actions))
      : [];
  const focusFlagEntries = flagAttention(flags, focusInfo?.flags ?? [], flagCategory);
  const shownEntries = combineAttention(
    flagAttention(flags, shownFlagTags, flagCategory),
    shownPerformer !== null && shownPerformer === query.performerFocus ? focusMixed : [],
  );
  // Stable while nothing changes, as the pad works out its keys' flags from them.
  const shownKey = JSON.stringify(shownEntries);
  const shownAttention = useMemo<AttentionEntry[]>(() => shownEntries, [shownKey]);
  const focusFlagsKey = JSON.stringify(focusFlagEntries);
  const focusAttention = useMemo<AttentionEntry[]>(() => focusFlagEntries, [focusFlagsKey]);
  const flagLabel = (carried: readonly ProfileTag[]) => flagSummary(flags, carried, categoryName);
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

  const previewStore = useRef<ActionPreviewStore | null>(null);
  previewStore.current ??= createActionPreviewStore();
  const preview = previewStore.current;
  const trees = useTagTrees(definition.actions);
  const actionTagIds = useMemo(
    () => definition.actions.flatMap((action) => action.steps.flatMap((step) => step.tagIds)),
    [definition.actions],
  );
  const queueList = useRef<HTMLDivElement>(null);
  // Keep the item on screen visible in the queue as the review moves on. Only the list scrolls:
  // scrollIntoView would also move the page or the workspace around it.
  useEffect(() => {
    const list = queueList.current;
    const row = list?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!list || !row) return;
    const bounds = list.getBoundingClientRect();
    const place = row.getBoundingClientRect();
    if (place.top < bounds.top) list.scrollTop -= bounds.top - place.top;
    else if (place.bottom > bounds.bottom) list.scrollTop += place.bottom - bounds.bottom;
  }, [current?.key, queueView]);
  // After a partner switch the clicked partner leaves the list; focus the one just left.
  const panelBody = useRef<HTMLDivElement>(null);
  const partnerFocus = useRef<string | null>(null);
  useEffect(() => {
    const key = partnerFocus.current;
    if (!key) return;
    partnerFocus.current = null;
    const buttons = [...(panelBody.current?.querySelectorAll<HTMLElement>(".dq-partner") ?? [])];
    (buttons.find((button) => button.dataset.partnerKey === key) ?? buttons[0])?.focus();
  }, [current?.key]);
  // Header controls that leave or reshape the view wait for any running write, load or edit.
  const busy = pending || loading || editing || !!ruleDraft;
  // The drawer edits the review as Save would store it: the draft with the live queue's criteria,
  // without tag bins. Unsaved changes are measured against the saved review.
  const ruleView = useMemo(
    () => (ruleDraft ? effectiveReview(ruleDraft, savableQuery(saved, query)) : null),
    [ruleDraft, saved, query],
  );
  const ruleDirty = useMemo(
    () =>
      ruleView != null &&
      draftSignature(normalizedReview(ruleView)) !== draftSignature(normalizedReview(saved)),
    [ruleView, saved],
  );
  function retryAfterError() {
    if (current) {
      void readTags(mediaKind, current)
        .then(setTags)
        .catch((error) => setError(errorText(error)));
    } else replaceQuery(queryRef.current);
  }
  const errorMessage = error ? (
    <p role="alert">
      {error}{" "}
      <button type="button" disabled={pending} onClick={retryAfterError}>
        {current ? "Reload tags" : "Retry queue"}
      </button>
    </p>
  ) : null;
  // Between items (a write, a load, or the next item's tags on their way) controls only pause;
  // fading them for a moment on every action would flicker.
  const settling = pending || loading || (current != null && !tags);
  const perPage = Math.max(1, Number(query.filter.perPage) || 1);
  // A load clears the total; the pager keeps the last known page count meanwhile.
  const knownPages = useRef(1);
  if (!loading) knownPages.current = Math.max(1, Math.ceil(total / perPage));
  const pages = knownPages.current;
  const partners =
    scope && current
      ? items.filter(
          (item) => item.media.id === current.media.id && item.key !== current.key,
        )
      : [];
  const title = (media: ReviewItem["media"]) =>
    media.title ||
    media.files[0]?.basename ||
    `${mediaKind === "audio" ? "Audio" : "Video"} ${media.id}`;
  const meta = current ? mediaMeta(current.media, mediaKind) : "";

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
      onClickCapture={(event) => {
        // Remember what opened a filter dialog, to hand focus back to it once the queue reloads.
        const button =
          event.target instanceof Element ? event.target.closest("button") : null;
        const label =
          button?.getAttribute("aria-label") ?? button?.textContent?.trim() ?? "";
        if (
          button &&
          !button.closest(HOST_DIALOG) &&
          /^(Filters|Edit filter:|Edit criteria)/.test(label)
        )
          filterReturnFocus.current = button;
      }}
    >
      <ReviewHeader
        name={saved.name}
        description={saved.description}
        entityType={reviewEntityType(saved)}
        onBack={pageControls?.onBack}
        backDisabled={busy || !!pageControls?.busy}
        // While the drawer is open, Edit review takes focus back to it.
        onEdit={ruleDraft ? () => drawerRef.current?.focus() : beginRuleEdit}
        editDisabled={!ruleDraft && (busy || !onSaveDefaults || !!pageControls?.busy)}
        editing={!!ruleDraft}
        toolbar={
          // Not disabled while the queue reloads: a search being typed keeps its focus (a
          // disabled field would drop it to the page, where the next letters are action keys),
          // and a newer query supersedes the load in flight.
          <fieldset className="dq-review-toolbar" disabled={pending || editing}>
            <legend className="dq-sr-only">
              {mediaKind === "audio" ? "Audio filters" : "Scene filters"}
            </legend>
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
              metadataByline={
                <ReviewPager
                  page={Math.min(Math.max(1, page || 1), pages)}
                  pages={pages}
                  onPage={(next) =>
                    replaceQuery({
                      ...queryRef.current,
                      filter: boundedFilter(
                        { ...queryRef.current.filter, page: next },
                        mediaKind,
                      ),
                    })
                  }
                />
              }
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
          </fieldset>
        }
        trailing={
          <>
            {scope && (
              <ScopePopover
                scope={scope}
                disabled={pending || editing}
                editing={!!ruleDraft}
                onChange={updateScope}
                onEditCriteria={() => setPerformerDialog(true)}
              />
            )}
            {pageControls?.onGrid && (
              <LayoutSwitch
                mode="single"
                disabled={busy || !!pageControls.busy}
                onChange={() => pageControls.onGrid?.()}
              />
            )}
          </>
        }
        trailingEnd={
          <>
            {isOccurrenceReview(review) && canWrite && (
              <BatchOccurrenceDialog
                review={review}
                disabled={blocked || !!ruleDraft}
                performerAttention={query.performerFocus ? focusAttention : undefined}
                trees={trees}
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
                      if (!alive.current) return;
                      // Busy straight into the reload, as replaceQuery does, so the review never
                      // looks ready for a frame in between (Batch… hands focus back only then).
                      // A queue whose URL could not be read does not load, so it is not marked.
                      if (!initialError.current) setLoading(true);
                      setRevision(value => value + 1);
                    });
                  } else endOperation();
                }}
              />
            )}
            {pageControls?.moreItems && (
              <MoreMenu
                disabled={busy}
                items={pageControls.moreItems({
                  onSelect: beginRuleEdit,
                  disabled: !onSaveDefaults,
                })}
              />
            )}
          </>
        }
        chipsStart={
          query.performerFocus ? (
            <div className="dq-focus-chip" role="group" aria-label="Performer focus">
              <PerformerAvatar
                performer={{
                  id: query.performerFocus,
                  name: focusInfo?.name ?? "",
                }}
              />
              <span>
                Only{" "}
                <strong>{focusInfo?.name ?? `performer ${query.performerFocus}`}</strong>
              </span>
              {focusInfo?.flags.length ? (
                <span className="dq-focus-flag" title={flagLabel(focusInfo.flags)}>
                  <Flag aria-hidden="true" />
                  <span className="dq-sr-only">{flagLabel(focusInfo.flags)}</span>
                </span>
              ) : null}
              <button
                type="button"
                className="dq-chip-button"
                disabled={blocked}
                onClick={clearFocus}
              >
                Show all performers
              </button>
            </div>
          ) : undefined
        }
        queueDiffers={queueDefaultsChanged}
        // While the drawer is open the queue is the draft's preview, which its Save review keeps.
        queueChange={
          !ruleDraft && queueDefaultsChanged
            ? {
                // Tag bins alone leave nothing to save: a review never keeps them.
                onSave: savableQueueChanged ? () => void saveQueryDefaults() : undefined,
                saveDisabled: blocked || !onSaveDefaults,
                onReset: () => {
                  const defaults = defaultQuery(saved);
                  replaceQuery(defaults, defaults.startFrom === "end");
                },
                resetDisabled: blocked,
              }
            : undefined
        }
        chipsEnd={
          ruleDraft ? <span className="dq-defaults-note">Previewing the draft</span> : undefined
        }
      />
      {pageControls?.notices}
      <div className="dq-review-area">
        {ruleDraft && ruleView && (
          <EditorDrawer
            drawerRef={drawerRef}
            draft={ruleView}
            onChange={(next) => setRuleDraft(next as MediaReview)}
            direction={query.startFrom}
            onDirectionChange={(startFrom) => replaceQuery({ ...queryRef.current, startFrom })}
            tagGroups={NO_TAG_GROUPS}
            trees={trees}
            saving={pending}
            saveDisabled={loading}
            error={ruleError}
            dirty={ruleDirty}
            criteriaChanged={savableQueueChanged}
            notices={errorMessage && <div className="dq-review-feedback">{errorMessage}</div>}
            onSave={() => void saveRuleEdit()}
            onCancel={cancelRuleEdit}
          />
        )}
        <div className="dq-review-main">
          <div className="dq-review-body">
            <div className="dq-review-stage">
              {current ? (
                <>
                  <div className="dq-stage-title">
                    <h2 className="dq-review-video-title">
                      <a
                        href={`/${mediaKind}/${current.media.id}`}
                        target="_blank"
                        rel="noreferrer"
                        title={`Open this ${labels.one} in a new tab`}
                      >
                        <span>{title(current.media)}</span>
                        <ExternalLink aria-hidden="true" />
                      </a>
                    </h2>
                    {meta && <span className="dq-stage-meta">{meta}</span>}
                  </div>
                  <div className="dq-review-media">
                    <div className="dq-player-frame">
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
                    </div>
                    {mediaKind === "audio" && (
                      <MediaDescription
                        key={current.media.id}
                        details={current.media.details}
                        label={labels.one}
                      />
                    )}
                  </div>
                </>
              ) : (
                <p role="status" className="dq-stage-status">
                  {loading
                    ? "Loading review…"
                    : total
                      ? "Reached the end in this direction."
                      : `No matching ${labels.many}.`}
                </p>
              )}
              {definition.actions.length > 0 ? (
                <ActionPad
                  actions={definition.actions}
                  mediaKind={mediaKind}
                  isDisabled={(action) => editing || actionBlocked(action)}
                  busy={settling}
                  tags={tags}
                  trees={trees}
                  preview={preview}
                  onApply={(action, stay) => void execute(action, stay)}
                  onFind={() => setFindOpen(true)}
                  findDisabled={editing || !!ruleDraft}
                  paused={!!ruleDraft}
                  waitForGroups={waitsForGroups(definition)}
                  attention={shownAttention}
                  stayOnTap={stayOnTap}
                  onStayOnTapChange={setStayOnTap}
                />
              ) : (
                isOccurrenceReview(saved) &&
                saved.occurrence.tagIds.length > 0 && (
                  <fieldset
                    className="dq-tag-choices"
                    disabled={!canWrite || pending || editing || !tags || !!ruleDraft || !current}
                  >
                    <legend>Tag choices</legend>
                    {saved.occurrence.tagIds.map((id) => (
                      <label key={id}>
                        <input
                          type={saved.occurrence.multiple ? "checkbox" : "radio"}
                          name="legacy-choice"
                          checked={legacySelected.includes(id)}
                          onChange={(event) =>
                            setLegacySelected(
                              saved.occurrence.multiple
                                ? event.target.checked
                                  ? [...legacySelected, id]
                                  : legacySelected.filter((value) => value !== id)
                                : [id],
                            )
                          }
                        />
                        {legacyNames[id] ?? "Loading tag…"}
                      </label>
                    ))}
                    <div className="dq-row">
                      <button
                        type="button"
                        className="dq-button"
                        onClick={() => setLegacySelected([])}
                      >
                        No applicable tags
                      </button>
                      <button
                        type="button"
                        className="dq-button"
                        onClick={() => void execute(undefined, true, false, true)}
                      >
                        Save choices
                      </button>
                      <button
                        type="button"
                        className="dq-button primary"
                        onClick={() => void execute(undefined, false, false, true)}
                      >
                        Save & next performer
                      </button>
                    </div>
                  </fieldset>
                )
              )}
            </div>
            <aside className="dq-review-panel" aria-label="Current item">
              <div className="dq-panel-body" ref={panelBody}>
                {current && (
                  <>
                    <section className="dq-panel-section dq-reviewing">
                      <h2 className="dq-eyebrow">
                        Reviewing{" "}
                        <span className="dq-sr-only">
                          {current.occurrence
                            ? current.occurrence.performer.name
                            : `this ${labels.one}`}
                        </span>
                      </h2>
                      <div className="dq-reviewing-who">
                        {current.occurrence && (
                          <PerformerAvatar performer={current.occurrence.performer} />
                        )}
                        <div>
                          <p className="dq-reviewing-name" aria-hidden="true">
                            {current.occurrence
                              ? current.occurrence.performer.name
                              : `This ${labels.one}`}
                          </p>
                          <p className="dq-reviewing-note">
                            {scope
                              ? `Tags apply to this performer in this ${labels.queue}`
                              : `Tags apply to the whole ${labels.one}`}
                          </p>
                        </div>
                      </div>
                      {shownAttention.length > 0 && (
                        <AttentionList entries={shownAttention} />
                      )}
                    </section>
                    {partners.length > 0 && (
                      <section
                        className="dq-panel-section"
                        aria-label={`Also in this ${labels.queue}`}
                      >
                        <h3 className="dq-eyebrow">Also in this {labels.queue}</h3>
                        <div className="dq-partners">
                          {partners.map((item) => (
                            <button
                              type="button"
                              className="dq-partner"
                              title={item.occurrence?.performer.name}
                              aria-label={item.occurrence?.performer.name}
                              data-partner-key={item.key}
                              disabled={blocked}
                              key={item.key}
                              onClick={() => {
                                partnerFocus.current = current.key;
                                showItem(item);
                                setError("");
                              }}
                            >
                              {item.occurrence && (
                                <PerformerAvatar performer={item.occurrence.performer} />
                              )}
                              <span>{item.occurrence?.performer.name}</span>
                            </button>
                          ))}
                        </div>
                      </section>
                    )}
                    <CurrentTags
                      tags={tags}
                      preview={preview}
                      showPreview={!editing}
                      trees={trees}
                      actionTagIds={actionTagIds}
                      label={`Current ${scope ? "occurrence" : labels.one} tags`}
                    />
                    {editing && (
                      <fieldset
                        ref={editor}
                        disabled={pending}
                        className="dq-panel-section dq-tag-editor"
                      >
                        <legend className="dq-eyebrow">
                          Edit {scope ? "occurrence" : labels.one} tags
                        </legend>
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
                              requestAnimationFrame(() => editButton.current?.focus());
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </fieldset>
                    )}
                  </>
                )}
                {/* Stays while the focused queue loads or runs out, so it is not read again. */}
                {isOccurrenceReview(scopedReview) && query.performerFocus && (
                  <ExistingAnswersView
                    {...focusAnswers}
                    mediaKind={mediaKind}
                    actions={definition.actions}
                    flags={focusAttention}
                  />
                )}
              </div>
              <div className="dq-panel-footer">
                <div className="dq-review-feedback" aria-live="polite">
                  {/* While the editor drawer covers this column, it shows the error instead. */}
                  {!ruleDraft && errorMessage}
                  {notice && <p role="status">{notice}</p>}
                </div>
                {!canWrite && (
                  <p className="dq-muted">Write permission is required to change tags.</p>
                )}
                {current && (
                  <div className="dq-panel-actions" aria-busy={settling || undefined}>
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
                      <Tag aria-hidden="true" />
                      Edit tags
                    </button>
                    <button
                      type="button"
                      className="dq-button"
                      disabled={blocked || !!ruleDraft}
                      onClick={() => void execute()}
                    >
                      <SkipForward aria-hidden="true" />
                      Skip{scope ? " performer" : ` ${labels.one}`}
                    </button>
                  </div>
                )}
              </div>
            </aside>
            <aside className="dq-review-queue" aria-label="Review queue">
              {scope && (
                <div
                  className="dq-segmented dq-segmented-fill"
                  role="group"
                  aria-label="Queue view"
                >
                  <button
                    type="button"
                    aria-pressed={queueView === "items"}
                    onClick={() => setQueueView("items")}
                  >
                    {mediaKind === "audio" ? "Audios" : "Scenes"}
                  </button>
                  <button
                    type="button"
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
                  flagLabel={flagLabel}
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
                <div className="dq-queue-list" ref={queueList}>
                  {items.map((item) => {
                    const active = current?.key === item.key;
                    return (
                      <button
                        type="button"
                        className="dq-queue-row"
                        key={item.key}
                        title={queueItemLabel(item)}
                        aria-label={queueItemLabel(item)}
                        aria-current={active ? "true" : undefined}
                        disabled={blocked}
                        onClick={() => {
                          showItem(item);
                          setError("");
                          setNotice("");
                        }}
                      >
                        <QueueThumbnail media={item.media} kind={mediaKind} />
                        <span className="dq-queue-row-text">
                          <span className="dq-queue-row-title">{mediaTitle(item.media)}</span>
                          <span className="dq-queue-row-meta">
                            {item.occurrence && (
                              <>
                                <PerformerAvatar performer={item.occurrence.performer} />
                                <span className="dq-queue-row-performer">
                                  {item.occurrence.performer.name}
                                </span>
                              </>
                            )}
                            <span className="dq-queue-row-detail">
                              {[
                                item.media.date,
                                item.occurrence
                                  ? ""
                                  : item.media.files[0]?.duration
                                    ? formatDuration(item.media.files[0].duration)
                                    : "",
                              ]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
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
      {findOpen && (
        <FindAction
          actions={saved.actions}
          trees={trees}
          isDisabled={(action) => actionBlocked(action as MediaReviewAction)}
          tapStays={mobile && stayOnTap}
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
