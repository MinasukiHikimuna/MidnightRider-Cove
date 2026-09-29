import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  ConfirmDialog,
  DetailListToolbar,
  TAG_CRITERIA,
  TAG_SORT_OPTIONS,
  TagTile,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  VideoCard,
  VideoPlayer,
} from "@cove/runtime/components";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  Film,
  Grid3X3,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  Trash2,
  X,
} from "@cove/runtime/lucide-react";
import {
  createConfirmedAbsentTagsField,
  createOccurrenceAbsenceField,
  findTags,
  findMedia,
  getConfirmedAbsentTagsFieldStatus,
  getOccurrenceAbsenceFieldStatus,
  listTagGroups,
  loadReviews,
  loadProgress,
  saveProgress,
  request,
  runReviewAction,
  runTagReviewAction,
  settleReviewWrites,
  saveReviews,
  StaleReviewsError,
  videoPreviewStatusUrl,
  videoPreviewUrl,
  videoScreenshotUrl,
  mediaStreamUrl,
  type Tag,
  type TagGroup,
  type MediaItem,
  type ConfirmedAbsentTagsFieldStatus,
} from "./api";
import {
  getNextReviewFocus,
  isOccurrenceReview,
  mediaKindOf,
  getReviewActionTargets,
  hasAssessmentSteps,
  isEditableTarget,
  isReviewShortcutTarget,
  isReviewEscapeTarget,
  isReviewGridArrowTarget,
  reviewGridArrowDelta,
  mergeReviews,
  reviewEntityType,
  toggleShownReviewSelection,
  type Review,
  type ReviewAction,
  type TagReview,
  type MediaReview,
  type VideoReview,
  type MediaReviewAction,
  type ReviewEntityType,
} from "./model";
import { ActionBar } from "./ActionBar";
import { draftSignature, EditorDrawer } from "./EditorDrawer";
import { KeyCap } from "./ActionPad";
import { FindAction } from "./FindAction";
import { useTagTrees, type TagTrees } from "./effectPreview";
import {
  CardViewSwitch,
  LayoutSwitch,
  MoreMenu,
  ReviewHeader,
  ReviewPager,
  type MoreMenuItem,
} from "./ReviewHeader";
import { ReviewWorkspace } from "./ReviewWorkspace";
import {
  readListOrder,
  ReviewList,
  sortReviews,
  writeListOrder,
  type ListOrder,
  type ReviewCounts,
} from "./ReviewList";
import { newReview, NewReviewDialog, type ReviewDraft } from "./NewReviewDialog";
import { downloadReviews, exportReview, readReviewFile } from "./reviewFiles";
import { useReviewKeyLabels, useReviewKeys } from "./reviewKeys";
import { useMobileLayout } from "./viewport";
import {
  queryKeys,
  readQuery,
  defaultQuery,
  effectiveReview,
  normalizedReview,
  openedFromList,
  withoutTagBins,
  writePageUrl,
  writeQuery,
} from "./reviewQuery";
import { occurrenceSceneReview, resolvePerformers } from "./occurrences";
import { objectFiltersEqual } from "./objectFiltersEqual";
export { objectFiltersEqual } from "./objectFiltersEqual";
import "./styles.css";
import {
  usePresentationTags,
  presentedVideo,
  splitTagBins,
  TagBins,
  toggleTagBin,
} from "./TagPresentation";
import {
  presentCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
import {
  reviewValidation,
  boundedFilter,
  duplicateReview,
  resumeFocus,
  queueSignature,
} from "./model";

type ReviewDisplayMode = "grid" | "list" | "wall";
type ReviewEntity = MediaItem | Tag;
interface ReviewPage {
  items: ReviewEntity[];
  totalCount: number;
}
/** Where the reviews are kept: the account, the account without write access, or this browser. */
type StorageMode = "account" | "readOnly" | "browser";
const STORAGE_SUMMARY: Record<StorageMode, string> = {
  account: "saved to your account",
  readOnly: "saved to your account, read-only",
  browser: "saved in this browser only",
};
/** Where focus goes once the reviews list shows: its heading, or the row of a review. */
type ListFocus = "heading" | { reviewId: string };
/** The grid as it was when its editor drawer opened, for Cancel to restore. */
interface GridEditSnapshot {
  temporaryReview: Review | null;
  filter: Record<string, unknown>;
  loadedFilter: Record<string, unknown>;
  queue: ReviewPage;
  queueError: string;
  retryFromEnd: boolean;
  selectedIds: Set<number>;
  focusedId: number | null;
  pageCursor: { page: number; ids: Set<number> } | null;
  url: string;
}

/**
 * A review with the queue's live criteria, as saving it would store them: the grid's drawer
 * previews its draft on the queue. Queue tag bins stay out; they only narrow the visit.
 */
function withLiveCriteria(
  draft: Review,
  live: Review,
  filter: Record<string, unknown>,
  saved: Review,
): Review {
  return withoutTagBins(
    {
      ...draft,
      view: {
        ...draft.view,
        filter: { ...filter, page: 1 },
        objectFilter: live.view.objectFilter,
        searchMode: live.view.searchMode,
      },
    } as Review,
    saved,
  );
}

/**
 * The grid's temporary review once the queue's criteria were saved: none, as the queue is the
 * saved one, except for tag bins pressed on it, which stay pressed and are all it differs by.
 */
function pressedBinsAfterSave(saved: Review, live: Review): Review | null {
  const binned =
    reviewEntityType(live) === "video" &&
    splitTagBins(live.view.objectFilter, saved.view.objectFilter).bins.length > 0;
  return binned
    ? ({ ...saved, view: { ...saved.view, objectFilter: live.view.objectFilter } } as Review)
    : null;
}

/**
 * Whether a review's queue criteria load the same queue as the saved review's: compared as a
 * review link reads them (missing search, sort or direction filled in, key order aside), as the
 * editor drawer and Save to review compare, so the grid never calls a queue temporary for a
 * difference of form alone.
 */
function sameQueue(review: Review, saved: Review): boolean {
  return objectFiltersEqual(
    JSON.parse(queueSignature(normalizedReview(review))),
    JSON.parse(queueSignature(normalizedReview(saved))),
  );
}

const defaultCardSize = 180;

function initialDisplayMode(review: Review): ReviewDisplayMode {
  if (reviewEntityType(review) === "tag")
    return review.view.displayMode === "list" ? "list" : "grid";
  return review.view.displayMode === "wall" ? "wall" : "grid";
}

function supportedDisplayMode(
  value: unknown,
  entityType: ReviewEntityType = "video",
): ReviewDisplayMode {
  if (entityType === "tag") return value === "list" ? "list" : "grid";
  return value === "wall" ? "wall" : "grid";
}

function selectedReviewId() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}

/** The URL names the review shown, or none for the list; opening one from the list adds an entry. */
function writeSelectedReviewId(reviewId: string, openingFromList = false) {
  const params = new URLSearchParams(window.location.search);
  queryKeys.forEach(key => params.delete(key));
  if (reviewId) params.set("review", reviewId);
  else params.delete("review");
  const query = params.toString();
  writePageUrl(`${window.location.pathname}${query ? `?${query}` : ""}`, { openingFromList });
}

function pageFilter(value: Record<string, unknown>) {
  return boundedFilter({ ...value, page: 1 });
}

function videoTitle(video: MediaItem) {
  return video.title || video.files[0]?.basename || `Video ${video.id}`;
}

function consumeShortcut(
  event: ReactKeyboardEvent<HTMLElement> | KeyboardEvent,
) {
  event.preventDefault();
  event.stopPropagation();
  if ("nativeEvent" in event) event.nativeEvent.stopImmediatePropagation();
  else event.stopImmediatePropagation();
}

/** The grid's card views: videos show cards or a wall of playing previews, tags cards or a list. */
const VIDEO_CARD_VIEWS = [
  { value: "grid", label: "Cards", icon: <LayoutGrid aria-hidden="true" /> },
  { value: "wall", label: "Wall", icon: <Grid3X3 aria-hidden="true" /> },
] as const;
const TAG_CARD_VIEWS = [
  { value: "grid", label: "Cards", icon: <LayoutGrid aria-hidden="true" /> },
  { value: "list", label: "List", icon: <List aria-hidden="true" /> },
] as const;
const NO_ACTIONS: readonly ReviewAction[] = [];

/** From this width an open review fits the window (see .dq-page-fit in styles.css). */
const FIT_WIDTH_QUERY = "(min-width: 900px)";
function subscribeFitWidth(onChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => {};
  const query = window.matchMedia(FIT_WIDTH_QUERY);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function fitWidthNow() {
  return typeof window.matchMedia === "function" && window.matchMedia(FIT_WIDTH_QUERY).matches;
}

export function DataQualityPage({
  onNavigate,
}: {
  onNavigate: (route: { page: string; id?: number }) => void;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [unassignedLegacy] = useState(() => {
    try {
      return localStorage.getItem("page-videos") !== null;
    } catch {
      return false;
    }
  });
  const [storageKey, setStorageKey] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const [canWriteVideos, setCanWriteVideos] = useState(false);
  const [canWriteAudios, setCanWriteAudios] = useState(false);
  const [canWriteTags, setCanWriteTags] = useState(false);
  const [canReadTagGroups, setCanReadTagGroups] = useState(false);
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [tagGroupsError, setTagGroupsError] = useState("");
  const [canConfigure, setCanConfigure] = useState(true);
  const [storageMode, setStorageMode] = useState<StorageMode>("account");
  const [storageNotice, setStorageNotice] = useState("");
  const [progressError, setProgressError] = useState("");
  const [progressLoadBlocked, setProgressLoadBlocked] = useState(false);
  const [progressReady, setProgressReady] = useState(false);
  // "<review id>:<query revision>" of the last load that finished, for requests waiting on it.
  const [loadedFor, setLoadedFor] = useState("");
  const [activeId, setActiveId] = useState(selectedReviewId);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;
  const [reviewCounts, setReviewCounts] = useState<ReviewCounts>({});
  const reviewCountsRef = useRef(reviewCounts);
  reviewCountsRef.current = reviewCounts;
  // For browser navigation, which reads them outside a render.
  const reviewsRef = useRef(reviews);
  reviewsRef.current = reviews;
  const reviewsLoadingRef = useRef(reviewsLoading);
  reviewsLoadingRef.current = reviewsLoading;
  // The page went back in history to the list itself (All reviews, a deletion) and waits for it.
  const leavingForList = useRef(false);
  // A save that finishes after the page is gone (Cove went elsewhere) must not write the URL.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  // Counts belong to one visit of the list: back from a review, every review counts again.
  const [countsForList, setCountsForList] = useState(!activeId);
  if (countsForList !== !activeId) {
    setCountsForList(!activeId);
    if (!activeId) setReviewCounts({});
  }
  // The list's sort, remembered in this browser.
  const [listOrder, setListOrder] = useState(readListOrder);
  const { sort: listSort, direction: listDirection } = listOrder;
  const changeListOrder = (change: Partial<ListOrder>) => {
    const next = { ...listOrder, ...change };
    setListOrder(next);
    writeListOrder(next);
  };
  const listHeadingRef = useRef<HTMLHeadingElement>(null);
  const listFocus = useRef<ListFocus | null>(null);
  // What the last import, duplicate or deletion did, under the page's header: on the list, or in
  // the open review when duplicating or deleting it failed.
  const [pageNotice, setPageNotice] = useState<{ text: string; alert: boolean } | null>(null);
  const [importing, setImporting] = useState(false);
  // A duplicate being saved, before it opens.
  const [duplicating, setDuplicating] = useState(false);
  // New review, and Delete… awaiting confirmation. Both are modal: while either is open the grid's
  // own keys wait, as Cove's wait for any dialog.
  const [creating, setCreating] = useState<ReviewDraft | null>(null);
  const [deleting, setDeleting] = useState<{ review: Review; pending: boolean } | null>(null);
  const pageDialogOpen = !!creating || !!deleting;
  const pageDialogRef = useRef(pageDialogOpen);
  pageDialogRef.current = pageDialogOpen;
  // Nothing else on the list changes the reviews while one of these saves.
  const listLocked = importing || !!deleting || duplicating;
  // A request to open the active review's editor drawer (Edit on the list, a created review);
  // whichever view shows the review opens it once its queue has loaded, then clears the request.
  const [editRequest, setEditRequest] = useState(0);
  // The single-item review's Stay on this item switch (phone-sized windows), kept here so it lasts
  // from review to review until the page reloads; it is never stored.
  const [stayOnTap, setStayOnTap] = useState(false);
  // The grid's editor drawer: the review's definition being edited (its queue criteria stay the
  // live queue's), and the save state.
  const [gridEditor, setGridEditor] = useState<{
    draft: Review;
    saving: boolean;
    error: string;
  } | null>(null);
  const gridEditSnapshot = useRef<GridEditSnapshot | null>(null);
  const gridEditOpener = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const [temporaryReview, setTemporaryReview] = useState<Review | null>(
    null,
  );
  const savedReview = reviews.find((item) => item.id === activeId) ?? null;
  const review = useMemo(
    () =>
      temporaryReview?.id === activeId && savedReview
        ? { ...savedReview, view: {
            ...savedReview.view,
            filter: temporaryReview.view.filter,
            objectFilter: temporaryReview.view.objectFilter,
            searchMode: temporaryReview.view.searchMode,
            startFrom: temporaryReview.view.startFrom,
          } }
        : savedReview,
    [temporaryReview, activeId, savedReview],
  );
  const entityType = review ? reviewEntityType(review) : "video";
  const mediaKind = mediaKindOf(entityType);
  const occurrenceReview = review ? isOccurrenceReview(review) : false;
  const videoReview = entityType === "video" ? (review as VideoReview | null) : null;
  // Occurrence absences use their own field; only reviews that assess need it set up.
  const occurrenceAssessments = occurrenceReview && !!review?.actions.some(hasAssessmentSteps);
  const showsAbsenceSetup = !!videoReview || entityType === "audio" || occurrenceAssessments;
  const [layoutOverride, setLayoutOverride] = useState<{ id: string; mode: "single" | "multiple" } | null>(null);
  const reviewMode = layoutOverride?.id === review?.id ? layoutOverride?.mode : review?.view.reviewMode ?? "single";
  const usesWorkspace =
    occurrenceReview || entityType === "audio" || (entityType === "video" && reviewMode === "single");
  const [queryRevision, setQueryRevision] = useState(0);
  const readyQueryRevision = useRef(-1);
  const deferredNavigation = useRef(false);
  const usesWorkspaceRef = useRef(usesWorkspace);
  usesWorkspaceRef.current = usesWorkspace;
  // Registered once for the page's lifetime. Cove's own popstate listener runs first and renders
  // at once, which runs this page's pending effects in the middle of the dispatch: a listener
  // replaced then (as when a deleted review leaves for the list) would miss that Back.
  useEffect(() => {
    const restore = () => {
      const workspace = usesWorkspaceRef.current;
      if (!workspace && pendingRef.current) {
        deferredNavigation.current = true;
        return;
      }
      // A URL write still pending from the last render must not overwrite the URL navigated to.
      readyQueryRevision.current = -1;
      followHistory();
      if (!workspace) setQueryRevision(value => value + 1);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const canWriteMedia = mediaKind === "audio" ? canWriteAudios : canWriteVideos;
  const writeSubject =
    entityType === "tag" ? "Tag" : mediaKind === "audio" ? "Audio" : "Video";
  const canWriteCurrent = entityType === "tag" ? canWriteTags : canWriteMedia;
  const pendingToolbarObjectFilter = useRef<Record<string, unknown> | null>(
    null,
  );
  const presentationTags = usePresentationTags(videoReview);
  const [filter, setFilter] = useState<Record<string, unknown>>({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc",
  });
  const [loadedFilter, setLoadedFilter] = useState<Record<string, unknown>>({
    page: 1,
    perPage: 40,
  });
  const [queue, setQueue] = useState<ReviewPage>({ items: [], totalCount: 0 });
  // Opening another review straight from a card grid (a duplicate once created, or browser
  // navigation) renders it before its load resets the page: a tag review's items must never be
  // drawn as video cards, or the reverse, nor the last review's filter be saved as this one's
  // progress. The queue and its readiness belong to the review they were loaded for.
  const [queueReviewId, setQueueReviewId] = useState(activeId);
  if (queueReviewId !== activeId) {
    setQueueReviewId(activeId);
    setQueue({ items: [], totalCount: 0 });
    setProgressReady(false);
  }
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState("");
  const [queueUrlError, setQueueUrlError] = useState(false);
  const [queueRetryFromEnd, setQueueRetryFromEnd] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set());
  const selectedRef = useRef(selectedIds);
  selectedRef.current = selectedIds;
  const selectionVersions = useRef(new Map<number, number>());
  const selectAllOnLoad = review?.view.selectAllOnLoad === true;
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const focusedRef = useRef(focusedId);
  focusedRef.current = focusedId;
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewOpenRef = useRef(previewOpen);
  previewOpenRef.current = previewOpen;
  const previewVideoRef = useRef<MediaItem | null>(null);
  const [findOpen, setFindOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState<ReviewDisplayMode>("grid");
  const [cardSize, setCardSize] = useState(defaultCardSize);
  const [pending, setPending] = useState(false);
  // The grid's Save to review is writing the queue's criteria to the review.
  const [queueSaving, setQueueSaving] = useState(false);
  const pendingRef = useRef(false);
  const [pendingTargetLabel, setPendingTargetLabel] = useState("");
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const [absenceFieldStatus, setAbsenceFieldStatus] =
    useState<ConfirmedAbsentTagsFieldStatus | null>(null);
  const [absenceFieldError, setAbsenceFieldError] = useState("");
  const [absenceFieldPending, setAbsenceFieldPending] = useState(false);
  const [customFieldTagNames, setCustomFieldTagNames] = useState<
    Record<string, string>
  >({});
  const cardRefs = useRef(new Map<number, HTMLElement>());
  const gridRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  // An open review fills the window below Cove's navbar: in the single-item workspace only its
  // queue and side column scroll, in the grid only the cards. The page's top offset (navbar plus
  // the host's main padding) and the main padding under it are measured rather than assumed.
  const fitsWindow = !!review;
  // The grid's cards scroll on their own only where the page fits the window.
  const cardsScroll =
    useSyncExternalStore(subscribeFitWidth, fitWidthNow, () => false) && fitsWindow;
  const [fitOffsets, setFitOffsets] = useState({ top: 0, bottom: 0 });
  useLayoutEffect(() => {
    if (!fitsWindow) return;
    const measure = () => {
      const page = pageRef.current;
      if (!page) return;
      const top = Math.round(page.getBoundingClientRect().top + window.scrollY);
      const main = page.closest("main");
      const bottom = main ? Math.round(parseFloat(getComputedStyle(main).paddingBottom) || 0) : 0;
      setFitOffsets((current) =>
        current.top === top && current.bottom === bottom ? current : { top, bottom },
      );
    };
    measure();
    // Content above the page can change height without a window resize.
    const observer =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    observer?.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [fitsWindow]);
  // The action bar floats over the bottom of the grid; a card brought into view must clear it.
  const [dockHeight, setDockHeight] = useState(0);
  const dockObserver = useRef<ResizeObserver | null>(null);
  const dockRef = useCallback((node: HTMLDivElement | null) => {
    dockObserver.current?.disconnect();
    dockObserver.current = null;
    if (!node || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() =>
      setDockHeight(Math.round(node.getBoundingClientRect().height)),
    );
    observer.observe(node);
    dockObserver.current = observer;
  }, []);
  const loadGeneration = useRef(0);
  const actionGeneration = useRef(0);
  const queueAbort = useRef<AbortController | null>(null);
  // The cards this page held when the reviewer arrived on it. Items that
  // appear later are refills, and in reverse traversal they arrive from the
  // pages already passed, so they must not hold the cursor here.
  const pageCursor = useRef<{ page: number; ids: Set<number> } | null>(null);
  // The grid's action wording ("− rest of <tree>"), for its actions and the drawer's draft; the
  // single-item workspace resolves its own.
  const trees = useTagTrees(
    review && !usesWorkspace
      ? gridEditor
        ? [...review.actions, ...gridEditor.draft.actions]
        : review.actions
      : NO_ACTIONS,
  );
  // The grid's drawer edits the review as Save would store it: the draft with the live criteria.
  const gridDraft = useMemo(
    () =>
      gridEditor && review && savedReview
        ? withLiveCriteria(gridEditor.draft, review, filter, savedReview)
        : null,
    [gridEditor, review, filter, savedReview],
  );
  // What Save to review would store: the saved review with the queue's criteria and direction,
  // without its tag bins.
  const savableQueue = useMemo(
    () =>
      review && savedReview
        ? withoutTagBins(
            { ...savedReview, view: { ...review.view, filter: { ...filter, page: 1 } } } as Review,
            savedReview,
          )
        : null,
    [review, savedReview, filter],
  );
  // Both are measured against the saved review, so criteria changed before the drawer opened show
  // as the draft's changes too, and bins never count.
  const savedSignature = useMemo(
    () => (savedReview ? draftSignature(normalizedReview(savedReview)) : ""),
    [savedReview],
  );
  const savableQueueDiffers = useMemo(
    () => savableQueue != null && draftSignature(normalizedReview(savableQueue)) !== savedSignature,
    [savableQueue, savedSignature],
  );
  const gridDirty = useMemo(
    () => gridDraft != null && draftSignature(normalizedReview(gridDraft)) !== savedSignature,
    [gridDraft, savedSignature],
  );

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);
  // What an import or a deletion did stays a while; a refused import stays until the next action.
  useEffect(() => {
    if (!pageNotice || pageNotice.alert) return;
    const timeout = window.setTimeout(() => setPageNotice(null), 6000);
    return () => window.clearTimeout(timeout);
  }, [pageNotice]);

  useEffect(() => {
    const ids = videoReview
      ? unresolvedCustomFieldTagIds(videoReview.view.objectFilter)
      : [];
    setCustomFieldTagNames({});
    if (!ids.length) return;
    const controller = new AbortController();
    let current = true;
    void Promise.all(
      ids.map(async (id) => {
        try {
          const tag = await request<{ name?: string }>(`/api/tags/${id}`, {
            signal: controller.signal,
          });
          return tag.name?.trim() ? ([String(id), tag.name] as const) : null;
        } catch {
          return null;
        }
      }),
    ).then((entries) => {
      if (current)
        setCustomFieldTagNames(
          Object.fromEntries(entries.filter((entry) => entry !== null)),
        );
    });
    return () => {
      current = false;
      controller.abort();
    };
  }, [videoReview?.id, videoReview?.view.objectFilter]);

  const toolbarObjectFilter = useMemo(
    () =>
      videoReview
        ? presentCustomFieldCriteria(
            videoReview.view.objectFilter,
            customFieldTagNames,
          )
        : (review?.view.objectFilter ?? {}),
    [customFieldTagNames, review, videoReview],
  );

  const loadAllReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError("");
    try {
      const result = await loadReviews();
      setReviews(result.reviews);
      setStorageKey(result.storageKey);
      setCanWriteVideos(result.canWriteVideos ?? result.canWrite);
      setCanWriteAudios(result.canWriteAudios ?? false);
      setCanWriteTags(result.canWriteTags ?? false);
      setCanReadTagGroups(result.canReadTagGroups ?? false);
      setCanConfigure(result.canConfigure ?? true);
      setStorageMode(result.storage ?? "account");
      setStorageNotice(result.storageNotice ?? "");
      if (activeId && !result.reviews.some((item) => item.id === activeId)) {
        setActiveId("");
        writeSelectedReviewId("");
      }
    } catch (error) {
      setReviewsError(
        error instanceof Error ? error.message : "Could not load reviews.",
      );
    } finally {
      setReviewsLoading(false);
    }
  }, [activeId]);

  useEffect(() => {
    if (!canReadTagGroups) {
      setTagGroups([]);
      setTagGroupsError("");
      return;
    }
    const controller = new AbortController();
    setTagGroupsError("");
    void listTagGroups(controller.signal)
      .then(setTagGroups)
      .catch((error) => {
        if (!controller.signal.aborted)
          setTagGroupsError(
            error instanceof Error
              ? error.message
              : "Could not load tag groups.",
          );
      });
    return () => controller.abort();
  }, [canReadTagGroups]);

  useEffect(() => {
    void loadAllReviews();
  }, []);

  // Each review on the list counts its matching items on its own. An import or a deletion counts
  // only the reviews without a count (new ones, or ones whose count failed); the others keep theirs.
  useEffect(() => {
    if (activeId || reviews.length === 0) return;
    const controller = new AbortController();
    for (const item of reviews) {
      if (typeof reviewCountsRef.current[item.id] === "number") continue;
      const countRequest =
        isOccurrenceReview(item)
          ? resolvePerformers(item, controller.signal).then(ids => ids?.length === 0 ? { items: [], totalCount: 0 } : findMedia(occurrenceSceneReview(item, ids), { ...item.view.filter, page: 1, perPage: 1 }, controller.signal))
          : reviewEntityType(item) === "tag"
          ? findTags(
              item as TagReview,
              boundedFilter({ ...item.view.filter, page: 1, perPage: 1 }),
              controller.signal,
            )
          : findMedia(
              item as MediaReview,
              boundedFilter({ ...item.view.filter, page: 1, perPage: 1 }),
              controller.signal,
            );
      void countRequest
        .then((result) => {
          if (!controller.signal.aborted)
            setReviewCounts((current) => ({
              ...current,
              [item.id]: result.totalCount,
            }));
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setReviewCounts((current) => ({ ...current, [item.id]: null }));
        });
    }
    return () => controller.abort();
  }, [activeId, reviews]);

  // Back from a review, the list's heading takes focus; after a deletion, the review that took the
  // deleted one's place (or the heading, when none is left). A deletion sets the target as its
  // confirmation closes, which may render after the list already lost the row.
  useLayoutEffect(() => {
    const target = listFocus.current;
    if (activeId || reviewsLoading || !target) return;
    listFocus.current = null;
    const row =
      target === "heading"
        ? null
        : [...(pageRef.current?.querySelectorAll<HTMLElement>("[data-review-id]") ?? [])].find(
            (link) => link.dataset.reviewId === target.reviewId,
          );
    (row ?? listHeadingRef.current)?.focus();
  }, [activeId, reviewsLoading, deleting, reviews]);

  const absenceFieldGeneration = useRef(0);
  const refreshAbsenceFieldStatus = useCallback(async () => {
    // The two review kinds check different fields; a slow answer for one must not label the other.
    const generation = ++absenceFieldGeneration.current;
    setAbsenceFieldStatus(null);
    setAbsenceFieldError("");
    try {
      const status =
        await (occurrenceAssessments
          ? getOccurrenceAbsenceFieldStatus(mediaKind)
          : getConfirmedAbsentTagsFieldStatus(mediaKind));
      if (generation === absenceFieldGeneration.current)
        setAbsenceFieldStatus(status);
    } catch (error) {
      if (generation !== absenceFieldGeneration.current) return;
      setAbsenceFieldStatus(null);
      setAbsenceFieldError(
        "Tag assessment setup could not be checked. " +
          (error instanceof Error ? error.message : "Request failed."),
      );
    }
  }, [occurrenceAssessments, mediaKind]);

  useEffect(() => {
    void refreshAbsenceFieldStatus();
  }, [refreshAbsenceFieldStatus]);

  const fetchQueue = useCallback(
    async (
      targetReview: Review,
      targetFilter: Record<string, unknown>,
      startFromEnd = false,
      selectAll = false,
    ) => {
      const generation = ++loadGeneration.current;
      queueAbort.current?.abort();
      const controller = new AbortController();
      queueAbort.current = controller;
      targetFilter = boundedFilter(targetFilter);
      const requestedPage = Number(targetFilter.page);
      if (startFromEnd) targetFilter = { ...targetFilter, page: 1 };
      setFilter(targetFilter);
      setQueueRetryFromEnd(startFromEnd);
      setQueueLoading(true);
      setQueueError("");
      try {
        const load = (nextFilter: Record<string, unknown>) =>
          reviewEntityType(targetReview) === "tag"
            ? findTags(
                targetReview as TagReview,
                nextFilter,
                controller.signal,
              )
            : findMedia(
                targetReview as VideoReview,
                nextFilter,
                controller.signal,
              );
        let result: ReviewPage = await load(targetFilter);
        const lastPage = Math.max(
          1,
          Math.ceil(result.totalCount / Number(targetFilter.perPage)),
        );
        const targetPage = startFromEnd
          ? lastPage
          : Math.min(requestedPage, lastPage);
        if (Number(targetFilter.page) !== targetPage) {
          targetFilter = { ...targetFilter, page: targetPage };
          result = await load(targetFilter);
        }
        if (generation === loadGeneration.current) {
          // Landing on a different page starts a fresh cursor; a post-action
          // refresh of the same page keeps the arrival set it recorded.
          if (pageCursor.current?.page !== targetPage)
            pageCursor.current = {
              page: targetPage,
              ids: new Set(result.items.map((item) => item.id)),
            };
          setQueue(result);
          // Only genuine page loads select everything; callers decide, so a
          // post-action refresh never re-expands a selection the reviewer
          // trimmed by hand.
          if (selectAll)
            updateSelection(
              () => new Set(result.items.map((item) => item.id)),
            );
          setFilter(targetFilter);
          setLoadedFilter(targetFilter);
        }
        return result;
      } catch (error) {
        if (generation === loadGeneration.current) {
          setQueueError(
            error instanceof Error
              ? error.message
              : "Could not load the review queue.",
          );
        }
        throw error;
      } finally {
        if (generation === loadGeneration.current) setQueueLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    actionGeneration.current += 1;
    readyQueryRevision.current = -1;
    loadGeneration.current += 1;
    queueAbort.current?.abort();
    // A reload from scratch (another review or layout, or browser navigation) leaves nothing for
    // an open editor to restore.
    setGridEditor(null);
    gridEditSnapshot.current = null;
    setProgressReady(false);
    setLoadedFor("");
    setProgressError("");
    setProgressLoadBlocked(false);
    setSelectedIds(new Set());
    selectionVersions.current.clear();
    setFocusedId(null);
    setPreviewOpen(false);
    setPending(false);
    pendingRef.current = false;
    setPendingTargetLabel("");
    setMessage("");
    setActionError("");
    setQueue({ items: [], totalCount: 0 });
    pageCursor.current = null;
    setQueueUrlError(false);
    if (!review || usesWorkspace) {
      setQueueLoading(false);
      // The single-item workspace keeps its own query, read from the URL, apart from the saved
      // review it is given; back in the grid, the URL tells again what is temporary.
      setTemporaryReview(null);
      return;
    }
    let current = true;
    setQueueLoading(true);
    void (async () => {
      let target = savedReview ?? review;
      setTemporaryReview(null);
      let urlQuery: ReturnType<typeof readQuery> | null = null;
      const params = new URLSearchParams(window.location.search);
      if (reviewEntityType(review) === "video" && queryKeys.some(key => params.has(key))) {
        try {
          const saved = target as VideoReview;
          urlQuery = readQuery(saved, params);
          const adjusted = effectiveReview(saved, urlQuery.query);
          if (urlQuery.query.startFrom !== (saved.view.startFrom ?? "end") || !objectFiltersEqual(
            JSON.parse(queueSignature(adjusted)),
            JSON.parse(queueSignature(effectiveReview(saved, defaultQuery(saved)))),
          )) {
            target = adjusted;
            setTemporaryReview(target);
          }
        } catch (error) {
          setQueueUrlError(true);
          setQueueError(error instanceof Error ? error.message : "Could not read review URL.");
          setQueueLoading(false);
          return;
        }
      }
      let progress = null;
      try {
        progress = await loadProgress(storageKey, review.id);
      } catch (error) {
        if (current) {
          setProgressLoadBlocked(true);
          setProgressError(
            error instanceof Error ? error.message : "Could not load progress.",
          );
        }
      }
      if (!current) return;
      const resume =
        progress?.signature === queueSignature(target) ? progress : null;
      const nextFilter = urlQuery ? urlQuery.query.filter : resume
        ? boundedFilter(resume.filter)
        : pageFilter(target.view.filter);
      setFilter(nextFilter);
      setDisplayMode(
        resume
          ? supportedDisplayMode(resume.displayMode, reviewEntityType(review))
          : initialDisplayMode(review),
      );
      setCardSize(
        resume ? (resume.cardSize ?? defaultCardSize) : defaultCardSize,
      );
      try {
        const result = await fetchQueue(
          target,
          nextFilter,
          urlQuery ? urlQuery.startAtEnd : !resume && target.view.startFrom !== "beginning",
          target.view.selectAllOnLoad === true,
        );
        if (!current) return;
        const nextFocus = resumeFocus(
          result.items.map((item) => item.id),
          resume?.focusedId ?? null,
          resume?.index ?? 0,
        );
        setFocusedId(nextFocus);
        focusCard(nextFocus);
      } catch {
        /* The queue exposes its retry state. */
      }
      if (current) {
        readyQueryRevision.current = queryRevision;
        setProgressReady(true);
        setLoadedFor(`${review.id}:${queryRevision}`);
      }
    })();
    return () => {
      current = false;
      actionGeneration.current++;
      loadGeneration.current++;
      queueAbort.current?.abort();
    };
  }, [review?.id, usesWorkspace, queryRevision]);

  // Edit on the reviews list (or a review just created) opens a card grid review's drawer once
  // its queue has loaded. Such requests come with the review's own URL, which chooseReview writes
  // without query state; should one ever meet a queue URL that cannot be read, which stops the
  // load, it is dropped rather than left to open the drawer much later. A copy that opens while
  // the review it came from still saves its queue waits for that save (see openGridEditor).
  useEffect(() => {
    if (!editRequest || usesWorkspace || !review) return;
    if (queueUrlError) {
      setEditRequest(0);
      return;
    }
    if (pending || gridEditor || queueSaving || loadedFor !== `${review.id}:${queryRevision}`)
      return;
    setEditRequest(0);
    openGridEditor();
  }, [
    editRequest,
    usesWorkspace,
    review?.id,
    loadedFor,
    pending,
    queueSaving,
    queryRevision,
    queueUrlError,
  ]);

  useEffect(() => {
    if (!videoReview || usesWorkspace || !progressReady || queueLoading || queueError || pending || deferredNavigation.current || readyQueryRevision.current !== queryRevision) return;
    writeQuery(videoReview.id, {
      filter,
      objectFilter: videoReview.view.objectFilter,
      searchMode: videoReview.view.searchMode,
      startFrom: videoReview.view.startFrom ?? "end",
    });
  }, [videoReview, usesWorkspace, progressReady, queueLoading, queueError, filter, pending, queryRevision]);

  const itemIds = useMemo(
    () => queue.items.map((item) => item.id),
    [queue.items],
  );
  useEffect(() => {
    if (
      !progressReady ||
      !review ||
      !storageKey ||
      queueLoading ||
      queueError ||
      pending ||
      temporaryReview?.id === review.id ||
      progressLoadBlocked ||
      readyQueryRevision.current !== queryRevision
    )
      return;
    const progress = {
      version: 1 as const,
      signature: queueSignature(review),
      filter,
      focusedId,
      index: Math.max(0, itemIds.indexOf(focusedId ?? -1)),
      displayMode,
      cardSize,
      updatedAt: Date.now(),
    };
    try {
      localStorage.setItem(
        storageKey + ":progress:" + review.id,
        JSON.stringify(progress),
      );
    } catch {
      /* Account save still attempted. */
    }
    if (progressError) return;
    let current = true;
    const timer = window.setTimeout(() => {
      void saveProgress(storageKey, review.id, progress).catch((error) => {
        if (current)
          setProgressError(
            "Progress is kept in this browser, but account sync failed. " +
              (error instanceof Error ? error.message : "Retry."),
          );
      });
    }, 600);
    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [
    progressReady,
    storageKey,
    review,
    queueLoading,
    queueError,
    pending,
    filter,
    focusedId,
    itemIds,
    displayMode,
    cardSize,
    temporaryReview,
    progressError,
    progressLoadBlocked,
    queryRevision,
  ]);

  const focusedEntity =
    queue.items.find((item) => item.id === focusedId) ?? null;
  const focusedVideo =
    entityType === "video" ? (focusedEntity as MediaItem | null) : null;
  if (previewOpen && focusedVideo) previewVideoRef.current = focusedVideo;
  const previewVideo =
    focusedVideo ?? (previewOpen ? previewVideoRef.current : null);
  const targets = getReviewActionTargets(selectedIds, focusedId);
  const allShownSelected =
    itemIds.length > 0 && itemIds.every((id) => selectedIds.has(id));

  const focusCard = useCallback((id: number | null, scroll = true) => {
    if (id == null) return;
    window.requestAnimationFrame(() => {
      // Never pull focus out of a field the reviewer is in, such as the search
      // that just reloaded the queue: on a card, their next letters would apply
      // actions. Nor out of the editor drawer, whose draft the reload previews,
      // nor from behind the page's New review or Delete… dialog.
      // The card still becomes the focused one for the keys.
      if (
        pageDialogRef.current ||
        isEditableTarget(document.activeElement) ||
        document.activeElement?.closest(".dq-drawer")
      )
        return;
      const card = cardRefs.current.get(id);
      card?.focus({ preventScroll: true });
      if (scroll) card?.scrollIntoView({ block: "nearest", inline: "nearest" });
    });
  }, []);

  useEffect(() => {
    if (progressReady && !previewOpenRef.current) focusCard(focusedRef.current);
  }, [progressReady, focusCard]);

  useEffect(() => {
    if (queueLoading || !itemIds.length) return;
    if (focusedRef.current == null || !itemIds.includes(focusedRef.current)) {
      setFocusedId(itemIds[0]);
      if (!previewOpenRef.current) focusCard(itemIds[0]);
    }
  }, [focusCard, itemIds, queueLoading]);

  const updateSelection = useCallback(
    (update: (current: Set<number>) => Set<number>) => {
      setSelectedIds((current) => {
        const next = update(current);
        for (const id of new Set([...current, ...next])) {
          if (current.has(id) !== next.has(id))
            selectionVersions.current.set(
              id,
              (selectionVersions.current.get(id) ?? 0) + 1,
            );
        }
        return next;
      });
    },
    [],
  );

  const moveFocus = useCallback(
    (delta: number) => {
      if (!itemIds.length) return;
      const currentIndex = Math.max(
        0,
        itemIds.indexOf(focusedRef.current ?? itemIds[0]),
      );
      const nextId =
        itemIds[
          Math.max(0, Math.min(itemIds.length - 1, currentIndex + delta))
        ];
      setFocusedId(nextId);
      if (!previewOpenRef.current) focusCard(nextId);
    },
    [focusCard, itemIds],
  );

  const execute = useCallback(
    async (action: ReviewAction) => {
      const changesData =
        "steps" in action
          ? action.steps.length > 0
          : action.effect.mode !== "SKIP";
      const tagGroupId =
        "effect" in action && action.effect.mode === "SET_TAG_GROUP"
          ? action.effect.tagGroupId
          : null;
      const unavailableTagGroup =
        tagGroupId != null &&
        (!canReadTagGroups ||
          !tagGroups.some((group) => group.id === tagGroupId));
      const unavailableTagGroupAccess =
        "effect" in action && changesData && !canReadTagGroups;
      const actionTargets = getReviewActionTargets(
        selectedRef.current,
        focusedRef.current,
      );
      if (!review || pendingRef.current || queueLoading || queueError) return;
      // A shortcut that silently does nothing is indistinguishable from a
      // broken key, so name the reason the action cannot run.
      const blocked =
        changesData && !canWriteCurrent
          ? `${writeSubject} write permission is required to apply ${action.label}.`
          : unavailableTagGroupAccess || unavailableTagGroup
            ? `${action.label} needs a tag group that is unavailable.`
            : hasAssessmentSteps(action) && absenceFieldStatus?.kind !== "ready"
              ? `Set up tag assessments before applying ${action.label}.`
              : !actionTargets.length
                ? `Select or focus a ${entityType} before applying ${action.label}.`
                : "";
      if (blocked) {
        setActionError(blocked);
        return;
      }
      const generation = ++actionGeneration.current;
      const reviewId = review.id;
      const previousIds = [...itemIds];
      const previousQueue = queue;
      const previousFocus = focusedRef.current;
      const previousSelection = new Set(selectedRef.current);
      const versions = new Map(
        actionTargets.map((id) => [id, selectionVersions.current.get(id) ?? 0]),
      );
      const isCurrent = () =>
        generation === actionGeneration.current && review.id === reviewId;
      pendingRef.current = true;
      setPending(true);
      setPendingTargetLabel(
        selectedRef.current.size
          ? `${actionTargets.length} selected ${entityType}s`
          : `the focused ${entityType}`,
      );
      setMessage("");
      setActionError("");
      const optimisticItems = previousQueue.items.filter(
        (item) => !actionTargets.includes(item.id),
      );
      const optimisticIds = optimisticItems.map((item) => item.id);
      const optimisticFocus = getNextReviewFocus(
        previousIds,
        optimisticIds,
        previousFocus,
        actionTargets.includes(previousFocus ?? -1),
      );
      setQueue({
        items: optimisticItems,
        totalCount: previousQueue.totalCount,
      });
      setSelectedIds((current) => {
        const next = new Set(current);
        for (const id of actionTargets) next.delete(id);
        return next;
      });
      setFocusedId(optimisticFocus);
      if (!previewOpenRef.current) focusCard(optimisticFocus);
      let succeeded = false;
      try {
        if ("effect" in action)
          await runTagReviewAction(action, actionTargets);
        else await runReviewAction(mediaKind, action, actionTargets);
        succeeded = true;
        if (!isCurrent()) return;
        setSelectedIds((current) => {
          const next = new Set(current);
          for (const id of actionTargets)
            if ((selectionVersions.current.get(id) ?? 0) === versions.get(id))
              next.delete(id);
          return next;
        });
        setMessage(
          `${action.label}: ${actionTargets.length} ${entityType}${actionTargets.length === 1 ? "" : "s"} ${changesData ? "updated" : "skipped"}.`,
        );
      } catch (error) {
        if (!isCurrent()) return;
        setQueue(previousQueue);
        setSelectedIds((current) => {
          const next = new Set(current);
          for (const id of actionTargets)
            if (
              previousSelection.has(id) &&
              (selectionVersions.current.get(id) ?? 0) === versions.get(id)
            )
              next.add(id);
          return next;
        });
        setFocusedId(previousFocus);
        if (!previewOpenRef.current) focusCard(previousFocus);
        setActionError(
          error instanceof Error ? error.message : "Action failed.",
        );
      }
      try {
        await settleReviewWrites(action);
        if (!isCurrent()) return;
        // Applying to the whole page is effectively a page turn, so the next
        // page arrives selected like a fresh load; a hand-trimmed selection
        // stays trimmed.
        const targetSet = new Set(actionTargets);
        const reselect =
          selectAllOnLoad &&
          previousIds.length > 0 &&
          previousIds.every((id) => targetSet.has(id));
        const refreshed = await fetchQueue(review, filter, false, reselect);
        if (!isCurrent()) return;
        let nextIds = refreshed.items.map((item) => item.id);
        // Reviews that start from the end walk towards the first page, so a
        // card that was not here on arrival shifted in from the pages already
        // reviewed. Once this page's own cards are answered, continue towards
        // the head instead of turning back to the tail the reviewer left.
        const arrived = pageCursor.current;
        const ownCardsLeft =
          arrived?.page === Number(filter.page) &&
          nextIds.some((id) => arrived.ids.has(id));
        const reverse = (review.view.startFrom ?? "end") !== "beginning";
        if (
          refreshed.totalCount > 0 &&
          Number(filter.page) > 1 &&
          (!nextIds.length || (reverse && !ownCardsLeft))
        ) {
          const previousPage = Math.max(1, Number(filter.page) - 1);
          const previousFilter = { ...filter, page: previousPage };
          setFilter(previousFilter);
          const previousResult = await fetchQueue(
            review,
            previousFilter,
            false,
            reselect,
          );
          nextIds = previousResult.items.map((item) => item.id);
          setSelectedIds(
            (current) =>
              new Set([...current].filter((id) => nextIds.includes(id))),
          );
          const nextFocus = nextIds.at(-1) ?? null;
          setFocusedId(nextFocus);
          if (!previewOpenRef.current) focusCard(nextFocus);
        } else {
          setSelectedIds(
            (current) =>
              new Set([...current].filter((id) => nextIds.includes(id))),
          );
          const nextFocus = getNextReviewFocus(
            previousIds,
            nextIds,
            previousFocus,
            succeeded && actionTargets.includes(previousFocus ?? -1),
          );
          setFocusedId(nextFocus);
          if (previewOpenRef.current && nextFocus == null)
            setPreviewOpen(false);
          if (!previewOpenRef.current) focusCard(nextFocus);
        }
      } catch (error) {
        if (isCurrent()) {
          setActionError(
            (current) =>
              `${current ? `${current} ` : ""}${succeeded ? "The action completed, but " : ""}the queue could not be refreshed. ${error instanceof Error ? error.message : "Refresh failed."}`,
          );
        }
      } finally {
        if (isCurrent()) {
          pendingRef.current = false;
          setPending(false);
          setPendingTargetLabel("");
          if (deferredNavigation.current) {
            deferredNavigation.current = false;
            followHistory();
            setQueryRevision(value => value + 1);
          }
        }
      }
    },
    [
      canWriteCurrent,
      canReadTagGroups,
      tagGroups,
      entityType,
      absenceFieldStatus,
      fetchQueue,
      filter,
      focusCard,
      itemIds,
      queue,
      queueLoading,
      queueError,
      review,
    ],
  );

  function gridColumnCount() {
    if (displayMode === "list") return 1;
    const grid = gridRef.current?.firstElementChild;
    const template = grid ? getComputedStyle(grid).gridTemplateColumns : "";
    return Math.max(1, template.split(" ").filter(Boolean).length);
  }

  // Action letters, Find action (-) and select all (Ctrl/⌘A) are fixed keys
  // registered with Cove's dispatcher below. Escape, Space and Enter stay here, on a
  // document listener like the arrow keys, so they keep working after focus
  // drifts to the page body or a sidebar button; only keys pressed inside this
  // page, or with nothing focused, belong to the review.
  const shortcutRef = useRef<(event: KeyboardEvent) => void>(() => {});
  shortcutRef.current = (event) => {
    if (usesWorkspace) return;
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    )
      return;
    if (pageDialogOpen) return;
    const target = event.target;
    const withinPage =
      target instanceof Node && pageRef.current?.contains(target) === true;
    const unfocused =
      target === document.body || target === document.documentElement;
    if (!withinPage && !unfocused) return;
    // Find action, in the grid or the preview, owns the keys while open; its
    // search field handles them, and Escape closes it from anywhere else.
    if (findOpen) {
      if (event.key === "Escape") {
        consumeShortcut(event);
        setFindOpen(false);
      }
      return;
    }
    if (previewOpen && event.key === "Escape") {
      consumeShortcut(event);
      setPreviewOpen(false);
      focusCard(focusedRef.current);
      return;
    }
    if (!isReviewEscapeTarget(target)) return;
    const plainTarget = isReviewShortcutTarget(target);
    if (event.key === "Escape") {
      consumeShortcut(event);
      updateSelection(() => new Set());
      return;
    }
    if (!previewOpen && event.key === " " && plainTarget) {
      consumeShortcut(event);
      if (focusedId != null)
        updateSelection((current) => toggleOne(current, focusedId));
      return;
    }
    if (pending || queueLoading) return;
    if (previewOpen) return;
    if (event.key === "Enter" && focusedId != null && plainTarget) {
      // The preview would cover the editor drawer, and its actions pause meanwhile; a tag still
      // opens in a new tab.
      if (entityType !== "tag" && gridEditor) return;
      consumeShortcut(event);
      if (entityType === "tag")
        window.open(`/tag/${focusedId}`, "_blank", "noopener,noreferrer");
      else setPreviewOpen(true);
      return;
    }
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) => shortcutRef.current(event);
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  const gridArrowNavigationRef = useRef<(event: KeyboardEvent) => void>(
    () => {},
  );
  gridArrowNavigationRef.current = (event) => {
    if (usesWorkspace || pageDialogOpen || previewOpen || findOpen) return;
    if (pending || queueLoading || !itemIds.length) return;
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    )
      return;
    // Only keys pressed inside this page, or with nothing focused at all,
    // belong to the grid; host chrome outside the page keeps its own keys.
    const target = event.target;
    const withinPage =
      target instanceof Node && pageRef.current?.contains(target) === true;
    const unfocused =
      target === document.body || target === document.documentElement;
    if (!withinPage && !unfocused) return;
    if (!event.key.startsWith("Arrow")) return;
    if (!isReviewGridArrowTarget(target)) return;
    const delta = reviewGridArrowDelta(event.key, gridColumnCount());
    if (!delta) return;
    event.preventDefault();
    // Keys from inside the page were fully consumed before this refactor;
    // keep that so host document listeners do not double-handle them.
    if (withinPage) event.stopImmediatePropagation();
    else event.stopPropagation();
    moveFocus(delta);
  };

  useEffect(() => {
    const listener = (event: KeyboardEvent) =>
      gridArrowNavigationRef.current(event);
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);

  // The queue toolbar (with its pager) waits out an action and the review's
  // first load. It stays live while its own changes reload the queue: a search
  // being typed keeps its focus (disabled, it would drop focus to the page,
  // where the next letters are action keys), and a newer query supersedes the
  // load in flight.
  // While the editor drawer or Save to review saves, the queue being saved stays as it is.
  const gridSaving = gridEditor?.saving === true || queueSaving;
  const toolbarLocked = pending || (queueLoading && !progressReady) || gridSaving;

  // The grid's action keys, Find action and select all, while the grid itself
  // takes keys. The preview registers its own keys on the overlay surface.
  // Like the letters before them, they stay claimed while an action runs;
  // execute then names the reason or waits for the refresh.
  const keyLabels = useReviewKeyLabels();
  useReviewKeys({
    surface: "local",
    // With nothing to act on (an empty or failed queue) the keys stay Cove's, so f still opens
    // Filters to fix the queue; while a load or an action runs they stay claimed.
    enabled:
      !!review &&
      !usesWorkspace &&
      !pageDialogOpen &&
      !gridEditor &&
      !previewOpen &&
      !findOpen &&
      !queueError &&
      (queue.items.length > 0 || queueLoading || pending),
    actions: review?.actions ?? NO_ACTIONS,
    onAction: (index) => {
      const action = review?.actions[index];
      if (action) void execute(action);
    },
    onFind: () => setFindOpen(true),
    onSelectAll: () =>
      updateSelection((current) => toggleShownReviewSelection(current, itemIds)),
  });
  // Find action belongs to the view on screen; another review or layout, or
  // opening or closing the preview, closes it.
  useEffect(() => setFindOpen(false), [usesWorkspace, previewOpen, review?.id]);

  // Disables the action bar's tiles, and Find action's rows alike, so both offer
  // exactly what a click could apply.
  function gridActionBlocked(action: ReviewAction) {
    const changesData =
      "steps" in action ? action.steps.length > 0 : action.effect.mode !== "SKIP";
    const targetGroupId =
      "effect" in action && action.effect.mode === "SET_TAG_GROUP"
        ? action.effect.tagGroupId
        : null;
    const groupUnavailable =
      targetGroupId != null && !tagGroups.some((item) => item.id === targetGroupId);
    return (
      pending ||
      queueLoading ||
      !!queueError ||
      (changesData && !canWriteCurrent) ||
      ("effect" in action && changesData && (!canReadTagGroups || groupUnavailable)) ||
      (hasAssessmentSteps(action) && absenceFieldStatus?.kind !== "ready") ||
      !targets.length
    );
  }

  function chooseReview(id: string) {
    setLayoutOverride(null);
    setEditRequest(0);
    setPageNotice(null);
    setActiveId(id);
    // Opened from the list, a review gets a history entry of its own, so Back returns to the list.
    writeSelectedReviewId(id, !!id && !review);
  }

  /**
   * Back to the list. A review opened from the list goes back to the list's history entry, as the
   * browser's Back does, rather than leave a copy of the list behind it (once, however often this
   * is asked before the list shows); a review opened any other way (its own link, a new tab) turns
   * its entry into the list's.
   */
  function leaveForList() {
    if (leavingForList.current) return;
    if (openedFromList()) {
      leavingForList.current = true;
      window.history.back();
    } else chooseReview("");
  }

  /**
   * Browser Back or Forward: the page shows what the URL names. Back from a review to the list
   * focuses that review's row, unless All reviews asked for the heading; a request to open a
   * review's drawer stays with that review. Only refs and state setters: the page's popstate
   * listener keeps the copy of its first render.
   */
  function followHistory() {
    const own = leavingForList.current;
    leavingForList.current = false;
    let next = selectedReviewId();
    // A review deleted since its entry was left: that entry shows the list, under its URL.
    if (next && !reviewsLoadingRef.current && !reviewsRef.current.some((item) => item.id === next)) {
      next = "";
      writeSelectedReviewId("");
    }
    const current = activeIdRef.current;
    if (next !== current) {
      setEditRequest(0);
      // The browser's Back and Forward leave the last view's notice behind; All reviews and a
      // deletion say what they did themselves.
      if (!own) setPageNotice(null);
      if (!next && current) listFocus.current ??= { reviewId: current };
    }
    setActiveId(next);
  }

  function showAllReviews() {
    listFocus.current = "heading";
    setPageNotice(null);
    leaveForList();
  }

  /** Opens a review with its editor drawer, which its view opens once the queue has loaded. */
  function editReview(id: string) {
    if (id !== activeId) chooseReview(id);
    setEditRequest((value) => value + 1);
  }

  /** New review: the dialog asks for the kind, name and description. */
  function startCreating() {
    setPageNotice(null);
    setCreating({
      review: newReview("video", { id: crypto.randomUUID(), name: "", description: "" }),
      saving: false,
      error: "",
    });
  }

  /**
   * Duplicate: the copy ("<name> copy", then "copy 2", …) is saved at once and opens with its
   * editor drawer, where it can be renamed. A failure says why under the page's header, and focus
   * stays on the menu it came from.
   */
  async function duplicate(source: Review) {
    if (listLocked || !canConfigure) return;
    setPageNotice(null);
    const id = crypto.randomUUID();
    let copy!: Review;
    const startedOn = activeId;
    setDuplicating(true);
    try {
      // The copy is of the review as saved when the duplicate's turn comes, and its name is free
      // among the reviews saved then: a save of the review that ran first is in the copy too.
      const saved = await updateReviews((current) => {
        copy = duplicateReview(
          current.find((item) => item.id === source.id) ?? source,
          current,
          id,
        );
        return [...current, copy];
      });
      if (!saved) throw new Error("Could not save reviews.");
      // The review's own navigation waits while the copy saves, but the browser's Back and
      // Forward do not: somewhere else by now, the page stays there and says what was saved.
      if (!mountedRef.current) return;
      if (activeIdRef.current !== startedOn)
        setPageNotice({ text: `Saved the copy “${copy.name}”.`, alert: false });
      else editReview(copy.id);
    } catch (error) {
      setPageNotice({
        text: `“${source.name}” was not duplicated. ${listSaveFailure(error)}`,
        alert: true,
      });
    } finally {
      setDuplicating(false);
    }
  }

  /** Create & configure: the review is saved, then opens with its editor drawer. */
  async function createReview() {
    if (!creating || creating.saving) return;
    const created = { ...creating.review, name: creating.review.name.trim() } as Review;
    const invalid = reviewValidation(created);
    if (invalid) {
      setCreating({ ...creating, error: invalid });
      return;
    }
    setCreating({ ...creating, saving: true, error: "" });
    try {
      if (!(await updateReviews((current) => [...current, created])))
        throw new Error("Could not save reviews.");
      if (!mountedRef.current) return;
      setCreating(null);
      editReview(created.id);
    } catch (error) {
      setCreating(
        (current) =>
          current && {
            ...current,
            saving: false,
            error:
              "Could not save reviews. Your edits are still open. " +
              (error instanceof Error ? error.message : "Retry saving."),
          },
      );
    }
  }

  /**
   * Delete… confirmed: the review goes, from the list or from its own view. A failed deletion
   * closes the confirmation, which hands focus back to the menu it came from, and says why under
   * the page's header.
   */
  async function deleteReview() {
    if (!deleting || deleting.pending) return;
    const target = deleting.review;
    // On the list, focus then moves to the review that takes the deleted one's place.
    const order = sortReviews(reviews, reviewCounts, listSort, listDirection).map((item) => item.id);
    const rest = order.filter((id) => id !== target.id);
    const successor = rest[Math.min(order.indexOf(target.id), rest.length - 1)];
    setDeleting({ review: target, pending: true });
    try {
      if (!(await updateReviews((current) => current.filter((item) => item.id !== target.id))))
        throw new Error("Could not save reviews.");
      // Deleting the open review leaves it for the list, which starts at its heading.
      listFocus.current =
        target.id !== activeId && successor ? { reviewId: successor } : "heading";
      setPageNotice({ text: `Deleted “${target.name}”.`, alert: false });
    } catch (error) {
      setPageNotice({ text: `“${target.name}” was not deleted. ${listSaveFailure(error)}`, alert: true });
    } finally {
      setDeleting(null);
    }
  }

  /**
   * Import adds the reviews of a review file that the list does not have yet; a review already in
   * the list (the same id) stays as it is. A deleted review comes back when imported again.
   */
  async function importReviews(file: File) {
    if (listLocked || !canConfigure) return;
    setPageNotice(null);
    setImporting(true);
    try {
      const imported = await readReviewFile(file);
      // What the file adds is decided against the reviews saved when the import's turn comes.
      let added = 0;
      if (
        imported.length &&
        !(await updateReviews((current) => {
          const merged = mergeReviews(current, imported);
          added = merged.length - current.length;
          return added ? merged : current;
        }))
      )
        throw new Error("Could not save reviews.");
      const kept = imported.length - added;
      setPageNotice({
        alert: false,
        text: !imported.length
          ? "Nothing to import: the file holds no reviews."
          : !added
            ? "Nothing imported: the reviews in this file are already in the list."
            : `Imported ${added === 1 ? "1 review" : `${added} reviews`}.` +
              (kept === 1
                ? " 1 review already in the list stays as it is."
                : kept
                  ? ` ${kept} reviews already in the list stay as they are.`
                  : ""),
      });
    } catch (error) {
      setPageNotice({ alert: true, text: `Could not import “${file.name}”. ${listSaveFailure(error)}` });
    } finally {
      setImporting(false);
    }
  }

  /**
   * Why an import, a duplicate or a deletion failed, in the list's words: the list keeps no draft
   * to export.
   */
  function listSaveFailure(error: unknown) {
    if (error instanceof StaleReviewsError)
      return "Reviews changed in another browser. Reload the page to get them, then try again.";
    return error instanceof Error ? error.message : "Try again.";
  }

  /** A saved review's own items, on its row in the list and in its More menu. */
  function reviewMenuItems(target: Review): MoreMenuItem[] {
    const locked = !canConfigure || listLocked;
    return [
      {
        label: "Duplicate",
        icon: <Copy aria-hidden="true" />,
        disabled: locked,
        onSelect: () => void duplicate(target),
      },
      {
        label: "Export",
        icon: <Download aria-hidden="true" />,
        onSelect: () => exportReview(target),
      },
      {
        label: "Delete…",
        icon: <Trash2 aria-hidden="true" />,
        danger: true,
        separated: true,
        disabled: locked,
        onSelect: () => {
          setPageNotice(null);
          setDeleting({ review: target, pending: false });
        },
      },
    ];
  }

  /**
   * An open review's More menu: Edit review (the view's own), the review's items, All reviews.
   * While a duplicate saves, before the copy opens, the review is neither edited nor left.
   */
  function openReviewMenuItems(
    target: Review,
    edit: { onSelect(): void; disabled?: boolean },
  ): MoreMenuItem[] {
    return [
      {
        label: "Edit review",
        icon: <Pencil aria-hidden="true" />,
        ...edit,
        disabled: edit.disabled || duplicating,
      },
      ...reviewMenuItems(target),
      {
        label: "All reviews",
        icon: <ChevronLeft aria-hidden="true" />,
        separated: true,
        disabled: duplicating,
        onSelect: showAllReviews,
      },
    ];
  }

  /**
   * Saves a change to the reviews. The change is applied to the list as last saved when the save's
   * turn comes (see saveReviews), never to this render's copy of it, so a duplicate, an import or a
   * deletion started while another save runs keeps that save's change, and the other way round.
   */
  async function updateReviews(change: (current: Review[]) => Review[]): Promise<boolean> {
    if (!storageKey) return false;
    let before: Review[] = [];
    const saved = await saveReviews(storageKey, (current) => {
      before = current;
      const next = change(current);
      return next === current ? current : next.map(withoutPreferredCardSize);
    });
    setReviews(saved);
    // A save can outlast the page (Cove shows another page by then): it leaves nothing to follow.
    if (!mountedRef.current) return true;
    // The review open when the save lands, which need not be the one open when it began.
    const openId = activeIdRef.current;
    if (openId && !saved.some((item) => item.id === openId)) leaveForList();
    const previous = before.find((item) => item.id === openId);
    const updated = saved.find((item) => item.id === openId);
    if (updated && previous) {
      // The header's Single | Grid switch lasts the visit, until the review's own layout changes.
      if ((updated.view.reviewMode ?? "single") !== (previous.view.reviewMode ?? "single"))
        setLayoutOverride(null);
      if (updated.view.displayMode !== previous.view.displayMode)
        setDisplayMode(initialDisplayMode(updated));
    }
    // Every save of the open review stores the queue's own criteria, so the queue and its URL
    // stay as they are; whoever saved says what remains temporary (see pressedBinsAfterSave).
    return true;
  }

  /** Saves one review's new definition in its place, over whatever else was saved meanwhile. */
  function saveReview(updated: Review): Promise<boolean> {
    return updateReviews((current) => withReview(current, updated));
  }

  /**
   * A save asked for by the open review's view (its drawer or Save to review), which says how it
   * went. A duplicate saved just before it opens its copy while this save waits its turn: when
   * the view that asked is gone by then, a failure is said under the page's header instead.
   */
  function saveFromView(updated: Review): Promise<boolean> {
    return saveReview(updated).catch((error: unknown) => {
      if (activeIdRef.current !== updated.id) reportLeftSaveFailure(updated, error);
      throw error;
    });
  }

  /**
   * A save of a review the page has left meanwhile failed: the page says so under its header,
   * naming the review as saved (a failed rename never showed its new name anywhere).
   */
  function reportLeftSaveFailure(target: Review, error: unknown) {
    if (!mountedRef.current) return;
    const name = reviewsRef.current.find((item) => item.id === target.id)?.name ?? target.name;
    setPageNotice({ text: `“${name}” was not saved. ${listSaveFailure(error)}`, alert: true });
  }

  if (reviewsLoading)
    return <CenteredStatus label="Loading reviews…" />;
  if (reviewsError)
    return (
      <>
        <button
          className="dq-button"
          onClick={() =>
            void exportRecovery().catch((error) =>
              setReviewsError(
                "Could not export browser reviews. " +
                  (error instanceof Error ? error.message : "Retry."),
              ),
            )
          }
        >
          Export browser reviews
        </button>
        <ErrorState
          message={reviewsError}
          onRetry={() => void loadAllReviews()}
        />
      </>
    );

  const pageNotices = (
    <>
      {storageNotice && <p className="dq-status">{storageNotice}</p>}
      {showsAbsenceSetup && absenceFieldStatus?.kind === "missing" && (
        <div role="status" className="dq-status">
          {absenceFieldStatus.message}{" "}
          <button
            type="button"
            disabled={absenceFieldPending}
            onClick={() => {
              setAbsenceFieldPending(true);
              setAbsenceFieldError("");
              void (occurrenceAssessments
                ? createOccurrenceAbsenceField(mediaKind)
                : createConfirmedAbsentTagsField(mediaKind)
              )
                .then(refreshAbsenceFieldStatus)
                .catch((error) =>
                  setAbsenceFieldError(
                    `Could not create the ${occurrenceAssessments ? "Confirmed absent occurrence tags" : "Confirmed absent tags"} custom field. ` +
                      (error instanceof Error
                        ? error.message
                        : "Request failed."),
                  ),
                )
                .finally(() => setAbsenceFieldPending(false));
            }}
          >
            {absenceFieldPending ? "Setting up…" : "Set up tag assessments"}
          </button>
        </div>
      )}
      {showsAbsenceSetup && (absenceFieldStatus?.kind === "incompatible" || absenceFieldError) && (
        <div role="alert" className="dq-alert">
          <AlertTriangle />
          {absenceFieldError || absenceFieldStatus?.message}
          <button
            type="button"
            disabled={absenceFieldPending}
            onClick={() => {
              setAbsenceFieldPending(true);
              void refreshAbsenceFieldStatus().finally(() =>
                setAbsenceFieldPending(false),
              );
            }}
          >
            {absenceFieldPending ? "Checking…" : "Check again"}
          </button>
        </div>
      )}
      {unassignedLegacy && (
        <details>
          <summary>Unassigned legacy browser reviews</summary>
          <p>
            These old reviews have no account owner. They have not been copied
            into this account. Export them for recovery, then import the reviews
            only into the intended account. The original data and deletion
            history stay in this browser.
          </p>
          <button
            className="dq-button"
            type="button"
            onClick={() => {
              const raw = localStorage.getItem("page-videos") ?? "[]";
              const url = URL.createObjectURL(
                new Blob([raw], { type: "application/json" }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = "data-quality-unassigned-legacy-reviews.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export unassigned reviews
          </button>
        </details>
      )}
      {progressError && (
        <p role="alert">
          {progressError}{" "}
          <button
            type="button"
            onClick={() => {
              setProgressError("");
              setProgressLoadBlocked(false);
            }}
          >
            {progressLoadBlocked
              ? "Start fresh progress"
              : "Retry progress sync"}
          </button>
        </p>
      )}
      {pageNotice &&
        (pageNotice.alert ? (
          <p role="alert" className="dq-alert">
            <AlertTriangle aria-hidden="true" />
            {pageNotice.text}
          </p>
        ) : (
          // The page's live region announces it.
          <p className="dq-status" aria-hidden="true">
            {pageNotice.text}
          </p>
        ))}
    </>
  );

  return (
    <div
      ref={pageRef}
      className={`data-quality-page${fitsWindow ? " dq-page-fit" : ""}`}
      style={
        fitsWindow
          ? ({
              "--dq-fit-top": `${fitOffsets.top}px`,
              "--dq-fit-bottom": `${fitOffsets.bottom}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      {/* Always present, so what an import or a deletion did is announced when it changes. */}
      <p className="dq-sr-only" aria-live="polite">
        {pageNotice && !pageNotice.alert ? pageNotice.text : ""}
      </p>
      {review && usesWorkspace ? (
        <ReviewWorkspace
          key={review.id}
          // The saved review, never the grid's temporary criteria: the workspace reads those from
          // the URL as its query, so the queue still differs from the saved review after Grid → Single.
          review={(savedReview ?? review) as MediaReview}
          canWrite={occurrenceReview ? canWriteTags : canWriteMedia}
          canAssess={absenceFieldStatus?.kind === "ready" && canWriteMedia}
          onBusy={setPending}
          editRequest={editRequest}
          onEditRequestHandled={() => setEditRequest(0)}
          onSaveDefaults={canConfigure ? saveFromView : undefined}
          pageControls={{
            onBack: showAllReviews,
            moreItems: (edit) => openReviewMenuItems(savedReview ?? review, edit),
            onGrid: videoReview
              ? () => setLayoutOverride({ id: videoReview.id, mode: "multiple" })
              : undefined,
            notices: pageNotices,
            busy: duplicating,
          }}
          stayOnTap={stayOnTap}
          onStayOnTapChange={setStayOnTap}
        />
      ) : review ? (
        renderGridReview(review)
      ) : (
        <ReviewList
          reviews={reviews}
          counts={reviewCounts}
          sort={listSort}
          direction={listDirection}
          onSortChange={(sort) => changeListOrder({ sort })}
          onDirectionChange={(direction) => changeListOrder({ direction })}
          storage={STORAGE_SUMMARY[storageMode]}
          canConfigure={canConfigure}
          busy={listLocked}
          headingRef={listHeadingRef}
          notices={pageNotices}
          onOpen={chooseReview}
          onNew={() => startCreating()}
          onImport={(file) => void importReviews(file)}
          onExportAll={() => downloadReviews(reviews, "data-quality-reviews.json")}
          rowMenuItems={(item) => [
            {
              label: "Edit",
              icon: <Pencil aria-hidden="true" />,
              disabled: !canConfigure || listLocked,
              onSelect: () => editReview(item.id),
            },
            ...reviewMenuItems(item),
          ]}
        />
      )}

      {previewOpen && previewVideo && videoReview && (
        <ReviewPreview
          video={previewVideo}
          review={videoReview}
          selectedCount={selectedIds.size}
          pending={pending}
          refreshing={queueLoading || !!queueError}
          error={actionError}
          canWrite={canWriteVideos}
          assessmentReady={absenceFieldStatus?.kind === "ready"}
          trees={trees}
          selected={selectedIds.has(previewVideo.id)}
          hasPrevious={itemIds.indexOf(previewVideo.id) > 0}
          hasNext={
            itemIds.indexOf(previewVideo.id) >= 0 &&
            itemIds.indexOf(previewVideo.id) < itemIds.length - 1
          }
          onToggleSelected={() =>
            updateSelection((current) => toggleOne(current, previewVideo.id))
          }
          onPrevious={() => moveFocus(-1)}
          onNext={() => moveFocus(1)}
          onClose={() => {
            setPreviewOpen(false);
            focusCard(focusedRef.current);
          }}
          onAction={execute}
          findOpen={findOpen}
          onFindOpenChange={setFindOpen}
        />
      )}
      {findOpen && review && !usesWorkspace && !previewOpen && (
        <FindAction
          actions={review.actions}
          tagGroups={tagGroups}
          trees={trees}
          isDisabled={gridActionBlocked}
          canStay={false}
          onApply={(action) => {
            setFindOpen(false);
            void execute(action);
          }}
          onClose={() => setFindOpen(false)}
        />
      )}
      {creating && (
        <NewReviewDialog
          draft={creating}
          onChange={(next) => setCreating((current) => current && { ...current, review: next, error: "" })}
          onCreate={() => void createReview()}
          onCancel={() => setCreating(null)}
        />
      )}
      <ConfirmDialog
        open={!!deleting}
        title="Delete review?"
        message={
          deleting
            ? `“${deleting.review.name}” will be deleted. Export it first to keep a copy you can import again.`
            : ""
        }
        confirmLabel="Delete review"
        isPending={deleting?.pending ?? false}
        onConfirm={() => void deleteReview()}
        onCancel={() => setDeleting((current) => (current?.pending ? current : null))}
      />
    </div>
  );

  async function resumeQueue(
    target: Review,
    nextFilter: Record<string, unknown>,
    startFromEnd = false,
    /** False when focus belongs elsewhere: Reset hands it to the header's More. */
    focusTheCard = true,
  ) {
    const priorFocus = focusedRef.current;
    const priorIndex = Math.max(0, itemIds.indexOf(priorFocus ?? -1));
    try {
      const loading = fetchQueue(
        target,
        nextFilter,
        startFromEnd,
        target.view.selectAllOnLoad === true,
      );
      // fetchQueue takes its load generation at once. A newer load (the next
      // letters of a search) supersedes this one: leave selection and focus to it.
      const generation = loadGeneration.current;
      const result = await loading;
      if (generation !== loadGeneration.current) return;
      const ids = result.items.map((item) => item.id);
      setSelectedIds(
        (current) => new Set([...current].filter((id) => ids.includes(id))),
      );
      const nextFocus = resumeFocus(ids, priorFocus, priorIndex);
      setFocusedId(nextFocus);
      if (focusTheCard && !previewOpenRef.current) focusCard(nextFocus, false);
    } catch {
      /* The query error keeps the retry control and old queue visible. */
    }
  }

  function applyQueueToolbarFilter(nextFilter: Record<string, unknown>) {
    const toolbarObjectFilter = pendingToolbarObjectFilter.current;
    pendingToolbarObjectFilter.current = null;
    if (toolbarLocked || !review || !savedReview) return;
    const requestedObjectFilter =
      toolbarObjectFilter ?? review.view.objectFilter;
    const objectFilter = objectFiltersEqual(
      requestedObjectFilter,
      savedReview.view.objectFilter,
    )
      ? savedReview.view.objectFilter
      : requestedObjectFilter;
    const targetFilter = boundedFilter({ ...nextFilter, page: 1 });
    const adjusted = {
      ...review,
      view: {
        ...review.view,
        filter: targetFilter,
        objectFilter,
      },
    };
    const keepsTemporaryQueue = !sameQueue(adjusted, savedReview);
    const target = keepsTemporaryQueue ? adjusted : savedReview;
    setTemporaryReview(keepsTemporaryQueue ? adjusted : null);
    setMessage(keepsTemporaryQueue ? "" : "Review queue defaults restored.");
    void resumeQueue(target, targetFilter, true);
  }

  function resetQueueToReviewDefaults() {
    if (pending || queueLoading || gridSaving || !savedReview) return;
    pendingToolbarObjectFilter.current = null;
    const targetFilter = boundedFilter({
      ...savedReview.view.filter,
      page: 1,
    });
    setTemporaryReview(null);
    setMessage("Review queue defaults restored.");
    // The header hands focus to More as the button leaves (as in the single-item view); the
    // reload leaves it there, the new focused card still the one the keys act on.
    void resumeQueue(
      savedReview,
      targetFilter,
      savedReview.view.startFrom !== "beginning",
      false,
    );
  }

  function saveTemporaryQueue() {
    // As in the drawer: a queue that failed to load does not show the criteria Save would keep.
    if (
      pending ||
      queueLoading ||
      queueError ||
      gridSaving ||
      !review ||
      !savableQueue ||
      !canConfigure
    )
      return;
    const live = review;
    const updated = savableQueue;
    // The queue's controls wait while this saves (see gridSaving), so the queue still shows the
    // criteria saved when the save lands. A duplicate saved just before it may have opened its
    // copy by then: the copy's view is left as it is, and a failure is said under the header.
    setQueueSaving(true);
    void saveReview(updated)
      .then((saved) => {
        if (!saved || activeIdRef.current !== updated.id) return;
        setTemporaryReview(pressedBinsAfterSave(updated, live));
        setMessage("Queue saved to this review.");
      })
      .catch((error) => {
        if (activeIdRef.current !== updated.id) reportLeftSaveFailure(updated, error);
        else setActionError(error instanceof Error ? error.message : "Could not save queue.");
      })
      .finally(() => setQueueSaving(false));
  }

  /**
   * Edit review on the grid: the drawer edits the saved definition while the header's toolbar and
   * tag bins keep reshaping the queue as the draft's preview. What Cancel restores is kept here.
   */
  function openGridEditor() {
    if (!review || !savedReview || pendingRef.current || gridEditor || queueSaving) return;
    gridEditOpener.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    gridEditSnapshot.current = {
      temporaryReview,
      filter,
      loadedFilter,
      queue,
      queueError,
      retryFromEnd: queueRetryFromEnd,
      selectedIds: new Set(selectedIds),
      focusedId,
      pageCursor: pageCursor.current,
      url: window.location.pathname + window.location.search + window.location.hash,
    };
    // The direction starts as the queue's; the criteria stay the live queue's throughout. Whatever
    // the queue already differs by from the saved review counts as the draft's unsaved changes.
    const draft = structuredClone({
      ...savedReview,
      view: { ...savedReview.view, startFrom: review.view.startFrom ?? "end" },
    }) as Review;
    setFindOpen(false);
    setPreviewOpen(false);
    setMessage("");
    setActionError("");
    setGridEditor({ draft, saving: false, error: "" });
  }

  /** Closes the grid's drawer and hands focus back to what opened it. */
  function closeGridEditor() {
    setGridEditor(null);
    gridEditSnapshot.current = null;
    const opener = gridEditOpener.current;
    gridEditOpener.current = null;
    requestAnimationFrame(() => {
      // An opener that is gone, disabled or the page itself (focus had drifted) hands focus to
      // the focused card instead.
      const usable =
        opener?.isConnected &&
        opener !== document.body &&
        !(opener instanceof HTMLButtonElement && opener.disabled);
      if (usable) opener.focus({ preventScroll: true });
      else focusCard(focusedRef.current, false);
    });
  }

  /** Cancel: the queue, its selection and focus, and the URL return to how they were. */
  function cancelGridEditor() {
    if (!gridEditor || gridEditor.saving) return;
    const snapshot = gridEditSnapshot.current;
    if (snapshot) {
      loadGeneration.current += 1;
      queueAbort.current?.abort();
      pendingToolbarObjectFilter.current = null;
      setQueueLoading(false);
      setTemporaryReview(snapshot.temporaryReview);
      setFilter(snapshot.filter);
      setLoadedFilter(snapshot.loadedFilter);
      setQueue(snapshot.queue);
      setQueueError(snapshot.queueError);
      setQueueRetryFromEnd(snapshot.retryFromEnd);
      updateSelection(() => snapshot.selectedIds);
      setFocusedId(snapshot.focusedId);
      pageCursor.current = snapshot.pageCursor;
      window.history.replaceState(window.history.state, "", snapshot.url);
    }
    closeGridEditor();
  }

  /** Save review: the draft with the queue's live criteria becomes the saved review. */
  async function saveGridEditor() {
    if (!gridEditor || gridEditor.saving || !gridDraft || !review) return;
    const live = review;
    const updated = { ...gridDraft, name: gridDraft.name.trim() } as Review;
    const invalid = reviewValidation(updated);
    if (invalid) {
      setGridEditor((editor) => editor && { ...editor, error: invalid });
      return;
    }
    setGridEditor((editor) => editor && { ...editor, saving: true, error: "" });
    try {
      if (!(await saveReview(updated))) throw new Error("Could not save reviews.");
      // The browser's Back and Forward do not wait for the save. When the page has left the
      // review (or Cove the page) by then, the review is saved, and nothing of its view is left
      // to update: above all, the URL now belongs to what the page shows.
      if (!mountedRef.current || activeIdRef.current !== updated.id) return;
      // The saved review holds the queue's criteria now, but never its bins. (The toolbar and
      // bins wait while the drawer saves, so the queue is still the one saved.)
      setTemporaryReview(pressedBinsAfterSave(updated, live));
      // The queue now runs in the saved direction. The URL says so at once, page and bins kept:
      // when the save also switched to Single video, the workspace reads its query from there.
      if (reviewEntityType(updated) === "video")
        writeQuery(updated.id, {
          filter,
          objectFilter: live.view.objectFilter,
          searchMode: updated.view.searchMode,
          startFrom: updated.view.startFrom ?? "end",
        });
      setMessage("Review saved.");
      closeGridEditor();
    } catch (error) {
      if (activeIdRef.current !== updated.id) {
        reportLeftSaveFailure(updated, error);
        return;
      }
      setGridEditor(
        (editor) =>
          editor && {
            ...editor,
            saving: false,
            error:
              "Could not save review. Your edits are still open. " +
              (error instanceof Error ? error.message : "Retry saving."),
          },
      );
    }
  }

  function retryGridQueue() {
    if (!review) return;
    void fetchQueue(review, filter, queueRetryFromEnd, selectAllOnLoad).catch(() => undefined);
  }

  function clearPageState() {
    setSelectedIds(new Set());
    selectionVersions.current.clear();
    setFocusedId(null);
  }

  function goToPage(next: number) {
    if (!review || pending || gridSaving || next === Number(filter.page)) return;
    setFilterAndLoad(
      { ...filter, page: next },
      review,
      (target, nextFilter) => fetchQueue(target, nextFilter, false, selectAllOnLoad),
      clearPageState,
    );
  }

  /**
   * A queue tag bin narrows the queue to its tag, from the first page; pressed again, it lifts
   * the narrowing. Back at the saved queue, the queue starts where the review starts, as Reset does.
   */
  function toggleQueueTagBin(id: number) {
    if (!videoReview || !savedReview || pending || queueLoading || gridSaving) return;
    const adjusted = toggleTagBin(videoReview, id, savedReview.view.objectFilter);
    const keepsTemporaryQueue = !sameQueue(adjusted, savedReview);
    setTemporaryReview(keepsTemporaryQueue ? adjusted : null);
    if (keepsTemporaryQueue) void resumeQueue(adjusted, { ...filter, page: 1 });
    else
      void resumeQueue(
        savedReview,
        { ...filter, page: 1 },
        savedReview.view.startFrom !== "beginning",
      );
  }

  /**
   * The card grid of video reviews in the Grid layout and of tag reviews: the review header (with
   * the queue's one pager in the host toolbar's byline), the cards, which alone scroll, and the
   * action bar floating over their bottom edge.
   */
  function renderGridReview(current: Review) {
    const tagReview = entityType === "tag";
    const noun = tagReview ? "tag" : "video";
    const perPage = Math.max(1, Number(filter.perPage) || 40);
    const pages = Math.max(1, Math.ceil(queue.totalCount / perPage));
    const page = Math.min(Math.max(1, Number(filter.page) || 1), pages);
    const notes = [
      canWriteCurrent ? "" : `${writeSubject} write permission is required to apply actions.`,
      tagReview && tagGroupsError ? `Tag groups are unavailable. ${tagGroupsError}` : "",
    ].filter(Boolean);
    const showsError = !!actionError && !previewOpen;
    return (
      <section
        className="dq-grid-review"
        aria-label={tagReview ? "Tag review" : "Video review grid"}
      >
        <ReviewHeader
          name={current.name}
          description={current.description}
          entityType={entityType}
          onBack={showAllReviews}
          backDisabled={pending || !!gridEditor || duplicating}
          // While the drawer is open, Edit review takes focus back to it. A queue URL that could
          // not be read must be reset first: the drawer saves the queue's criteria.
          onEdit={gridEditor ? () => drawerRef.current?.focus() : openGridEditor}
          editDisabled={
            !gridEditor &&
            (pending || queueLoading || queueUrlError || queueSaving || duplicating || !canConfigure)
          }
          editing={!!gridEditor}
          toolbar={
            <fieldset className="dq-review-toolbar" disabled={toolbarLocked}>
              <legend className="dq-sr-only">
                {tagReview ? "Tag filters" : "Video filters"}
              </legend>
              <DetailListToolbar
                filter={queueError ? loadedFilter : filter}
                onFilterChange={applyQueueToolbarFilter}
                totalCount={queue.totalCount}
                sortOptions={tagReview ? TAG_SORT_OPTIONS : VIDEO_SORT_OPTIONS}
                showSearch
                showSort
                // Without a change handler Cove shows no view buttons of its own (the header's
                // Cards/Wall switch replaces them), only the card size control for this view.
                displayMode={displayMode}
                zoomLevel={(cardSize - 225) / 50}
                onZoomChange={(level) => setCardSize(Math.round(225 + level * 50))}
                cardSizeEntityType={tagReview ? "tags" : "videos"}
                criteriaDefinitions={tagReview ? TAG_CRITERIA : VIDEO_CRITERIA}
                customFieldEntityType={entityType === "video" ? "video" : undefined}
                objectFilter={toolbarObjectFilter}
                onObjectFilterChange={(objectFilter) => {
                  if (!toolbarLocked)
                    pendingToolbarObjectFilter.current =
                      entityType === "video"
                        ? stripCustomFieldPresentation(
                            objectFilter,
                            customFieldTagNames,
                            current.view.objectFilter,
                          )
                        : objectFilter;
                }}
                showPagingControls={false}
                metadataByline={
                  <ReviewPager page={page} pages={pages} onPage={goToPage} />
                }
              />
            </fieldset>
          }
          trailing={
            <>
              {videoReview && (
                <LayoutSwitch
                  mode="multiple"
                  disabled={
                    pending || queueLoading || pageDialogOpen || !!gridEditor || queueSaving || duplicating
                  }
                  onChange={() =>
                    setLayoutOverride({ id: videoReview.id, mode: "single" })
                  }
                />
              )}
              <CardViewSwitch<ReviewDisplayMode>
                options={tagReview ? TAG_CARD_VIEWS : VIDEO_CARD_VIEWS}
                value={displayMode}
                onChange={(mode) =>
                  setDisplayMode(supportedDisplayMode(mode, entityType))
                }
              />
            </>
          }
          trailingEnd={
            <MoreMenu
              disabled={pending || !!gridEditor}
              items={openReviewMenuItems(savedReview ?? current, {
                onSelect: openGridEditor,
                disabled: queueLoading || queueUrlError || queueSaving || !canConfigure,
              })}
            />
          }
          // Unknown until the grid has read this review's query from the URL (see the load effect),
          // so opening a grid on a differing queue is not announced as a change.
          queueDiffers={progressReady ? temporaryReview?.id === activeId : undefined}
          // While the drawer is open the queue is the draft's preview, which its Save review keeps.
          queueChange={
            !gridEditor && temporaryReview?.id === activeId
              ? {
                  // Tag bins alone leave nothing to save: a review never keeps them.
                  onSave: savableQueueDiffers ? saveTemporaryQueue : undefined,
                  saveDisabled:
                    pending || queueLoading || !!queueError || gridSaving || !canConfigure,
                  onReset: resetQueueToReviewDefaults,
                  resetDisabled: pending || queueLoading || gridSaving,
                }
              : undefined
          }
          chipsAfter={
            videoReview?.presentation?.binParents?.length ? (
              <TagBins
                videos={queue.items as MediaItem[]}
                review={videoReview}
                savedObjectFilter={(savedReview ?? videoReview).view.objectFilter}
                trees={presentationTags.ids}
                disabled={pending || queueLoading || gridSaving}
                onToggle={toggleQueueTagBin}
              />
            ) : undefined
          }
          chipsEnd={
            gridEditor ? <span className="dq-defaults-note">Previewing the draft</span> : undefined
          }
        />
        {pageNotices}
        {videoReview && presentationTags.error && (
          <p role="alert" className="dq-alert">
            {presentationTags.error}
          </p>
        )}
        <div className="dq-review-area">
          {gridEditor && gridDraft && (
            <EditorDrawer
              drawerRef={drawerRef}
              draft={gridDraft}
              onChange={(next) =>
                setGridEditor((editor) => editor && { ...editor, draft: next })
              }
              direction={gridEditor.draft.view.startFrom ?? "end"}
              onDirectionChange={(startFrom) =>
                setGridEditor(
                  (editor) =>
                    editor && {
                      ...editor,
                      draft: { ...editor.draft, view: { ...editor.draft.view, startFrom } } as Review,
                    },
                )
              }
              tagGroups={tagGroups}
              trees={trees}
              saving={gridEditor.saving}
              // A queue that failed to load shows other criteria than the ones Save would keep.
              saveDisabled={queueLoading || !!queueError}
              error={gridEditor.error}
              dirty={gridDirty}
              criteriaChanged={savableQueueDiffers}
              notices={
                // The grid's own error sits under the drawer at narrower widths.
                queueError && !queueLoading ? (
                  <p className="dq-alert">
                    <AlertTriangle aria-hidden="true" />
                    <span>
                      The queue could not load: {queueError}{" "}
                      <button type="button" className="dq-link-button" onClick={retryGridQueue}>
                        Retry
                      </button>
                    </span>
                  </p>
                ) : undefined
              }
              onSave={() => void saveGridEditor()}
              onCancel={cancelGridEditor}
            />
          )}
          <div
            className="dq-grid-stage"
            style={{ "--dq-dock-height": `${dockHeight}px` } as React.CSSProperties}
          >
            <div className="dq-grid-content">
              {queueLoading && !queue.items.length && (
                <CenteredStatus label="Loading review queue…" />
              )}
              {queueError && !queueLoading && (
                <ErrorState
                  message={queueError}
                  retryLabel={queueUrlError ? "Reset to review defaults" : "Retry"}
                  onRetry={() => {
                    if (queueUrlError && savedReview && reviewEntityType(savedReview) === "video") {
                      const defaults = defaultQuery(savedReview as VideoReview);
                      writeQuery(savedReview.id, { ...defaults, filter: { ...defaults.filter, page: undefined } });
                      setQueryRevision(value => value + 1);
                      return;
                    }
                    retryGridQueue();
                  }}
                />
              )}
              {!pending && !queueLoading && !queueError && !queue.items.length && (
                <div className="dq-empty">
                  <Film />
                  <p>No {noun}s match this review.</p>
                </div>
              )}
              {!!queue.items.length && (
                <div ref={gridRef}>
                  <div
                    className={displayMode === "list" ? "dq-tag-list" : "dq-grid"}
                    style={{ "--dq-card-width": `${cardSize}px` } as React.CSSProperties}
                  >
                    {queue.items.map(renderCard)}
                  </div>
                </div>
              )}
            </div>
            <div className="dq-bar-dock" ref={dockRef}>
              <ActionBar
                // While the drawer is open the paused bar shows the draft's actions, as the pad does.
                actions={gridEditor ? (gridEditor.draft.actions as ReviewAction[]) : current.actions}
                tagGroups={tagGroups}
                trees={trees}
                isDisabled={gridActionBlocked}
                paused={!!gridEditor}
                busy={pending || queueLoading}
                onApply={(action) => void execute(action)}
                onFind={() => setFindOpen(true)}
                status={pending ? `Applying action to ${pendingTargetLabel}…` : ""}
                summary={
                  <>
                    {/* Always name the target: with nothing selected, actions fall back to the
                        focused card, which its ring alone does not say. */}
                    <p className="dq-bar-target">
                      {selectedIds.size
                        ? `${selectedIds.size} selected`
                        : focusedId == null
                          ? "Nothing to apply to"
                          : `Applies to the focused ${noun}`}
                    </p>
                    <button
                      type="button"
                      className="dq-text-button"
                      aria-keyshortcuts="Control+A Meta+A"
                      title="Select every card on this page"
                      disabled={!itemIds.length || allShownSelected}
                      onClick={() =>
                        updateSelection((selected) => new Set([...selected, ...itemIds]))
                      }
                    >
                      Select all
                      <KeyCap binding={keyLabels.selectAll} hidden />
                    </button>
                    <button
                      type="button"
                      className="dq-text-button"
                      aria-keyshortcuts="Escape"
                      disabled={!selectedIds.size}
                      onClick={() => updateSelection(() => new Set())}
                    >
                      Clear
                      <KeyCap binding="Esc" hidden />
                    </button>
                  </>
                }
                hints={notes.length ? notes.join(" ") : undefined}
                keyHints={
                  tagReview
                    ? "Arrows move · Space selects · Enter opens"
                    : gridEditor
                      ? "Arrows move · Space selects"
                      : "Arrows move · Space selects · Enter previews"
                }
                notices={
                  showsError || message ? (
                    <>
                      {showsError && (
                        <div role="alert" className="dq-alert">
                          <AlertTriangle aria-hidden="true" />
                          {actionError}
                        </div>
                      )}
                      {message && (
                        <p role="status" className="dq-status">
                          {message}
                        </p>
                      )}
                    </>
                  ) : undefined
                }
              />
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderCard(item: ReviewEntity) {
    if (entityType === "tag") {
      const tag = item as Tag;
      return (
        <ReviewTagCard
          key={tag.id}
          tag={tag}
          displayMode={displayMode === "list" ? "list" : "grid"}
          focused={tag.id === focusedId}
          selected={selectedIds.has(tag.id)}
          setRef={(node) => {
            if (node) cardRefs.current.set(tag.id, node);
            else cardRefs.current.delete(tag.id);
          }}
          onFocus={() => setFocusedId(tag.id)}
          onToggle={() => {
            updateSelection((current) => toggleOne(current, tag.id));
            focusCard(tag.id, false);
          }}
          onOpen={() =>
            window.open(`/tag/${tag.id}`, "_blank", "noopener,noreferrer")
          }
          onNavigate={onNavigate}
        />
      );
    }
    const video = item as MediaItem;
    return (
      <ReviewCard
        key={video.id}
        video={presentedVideo(video, videoReview, presentationTags.ids)}
        showTagBins={videoReview?.presentation?.annotations?.includes("tags") && !!videoReview.presentation.annotationParents?.length}
        displayMode={displayMode}
        cardsScroll={cardsScroll}
        focused={video.id === focusedId}
        selected={selectedIds.has(video.id)}
        setRef={(node) => {
          if (node) cardRefs.current.set(video.id, node);
          else cardRefs.current.delete(video.id);
        }}
        onFocus={() => setFocusedId(video.id)}
        onToggle={() =>
          updateSelection((current) => toggleOne(current, video.id))
        }
        onPreview={() => {
          // The preview would cover the editor drawer, and its actions are paused meanwhile.
          if (gridEditor) return;
          setFocusedId(video.id);
          setPreviewOpen(true);
        }}
        onNavigate={onNavigate}
      />
    );
  }
}

function setFilterAndLoad(
  next: Record<string, unknown>,
  review: Review,
  fetchQueue: (
    review: Review,
    filter: Record<string, unknown>,
  ) => Promise<ReviewPage>,
  clear: () => void,
) {
  clear();
  void fetchQueue(review, next).catch(() => undefined);
}

function toggleOne(current: Set<number>, id: number) {
  const next = new Set(current);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

/**
 * The saved reviews with one review's new definition in its place. A review deleted meanwhile is
 * not brought back: its save fails instead.
 */
function withReview(current: Review[], updated: Review): Review[] {
  if (!current.some((item) => item.id === updated.id)) throw new Error("This review was deleted.");
  return current.map((item) => (item.id === updated.id ? updated : item));
}

function withoutPreferredCardSize(review: Review): Review {
  if (review.presentation?.cardSize === undefined) return review;
  const presentation = { ...review.presentation };
  delete presentation.cardSize;
  return { ...review, presentation };
}

function ReviewTagCard({
  tag,
  displayMode,
  focused,
  selected,
  setRef,
  onFocus,
  onToggle,
  onOpen,
  onNavigate,
}: {
  tag: Tag;
  displayMode: "grid" | "list";
  focused: boolean;
  selected: boolean;
  setRef: (node: HTMLElement | null) => void;
  onFocus: () => void;
  onToggle: () => void;
  onOpen: () => void;
  onNavigate: (route: { page: string; id?: number }) => void;
}) {
  return (
    <article
      ref={setRef}
      tabIndex={0}
      aria-current={focused ? "true" : undefined}
      aria-label={`${tag.name}${selected ? ", selected" : ""}`}
      onFocus={onFocus}
      onClick={(event) => {
        onFocus();
        event.currentTarget.focus({ preventScroll: true });
      }}
      className={`dq-review-card dq-tag-card ${displayMode} ${focused ? "focused" : ""} ${selected ? "selected" : ""}`}
    >
      {displayMode === "grid" ? (
        <TagTile
          tag={tag}
          selected={selected}
          onSelect={onToggle}
          onClick={onOpen}
          onNavigate={onNavigate}
        />
      ) : (
        <div className="dq-tag-list-row">
          <button
            type="button"
            aria-label={selected ? `Deselect ${tag.name}` : `Select ${tag.name}`}
            aria-pressed={selected}
            onClick={(event) => {
              event.stopPropagation();
              onToggle();
            }}
          >
            {selected ? "✓" : ""}
          </button>
          <button type="button" className="dq-tag-list-name" onClick={onOpen}>
            {tag.name}
          </button>
          <span>{tag.tagGroupName || "Ungrouped"}</span>
          <span>{tag.description || ""}</span>
          <span>{tag.videoCount ?? 0} videos</span>
        </div>
      )}
    </article>
  );
}

function ReviewCard({
  video,
  showTagBins,
  displayMode,
  cardsScroll,
  focused,
  selected,
  setRef,
  onFocus,
  onToggle,
  onPreview,
  onNavigate,
}: {
  video: MediaItem;
  showTagBins?: boolean;
  displayMode: ReviewDisplayMode;
  /** Whether the cards scroll on their own (the page fits the window). */
  cardsScroll: boolean;
  focused: boolean;
  selected: boolean;
  setRef: (node: HTMLElement | null) => void;
  onFocus: () => void;
  onToggle: () => void;
  onPreview: () => void;
  onNavigate: (route: { page: string; id?: number }) => void;
}) {
  const title = videoTitle(video);
  const root = useRef<HTMLElement | null>(null);
  const nativeVideo = {
    ...video,
    organized: video.organized ?? false,
    urls: video.urls ?? [],
    tags: video.tags ?? [],
    groups: video.groups ?? [],
    galleries: video.galleries ?? [],
    createdAt: video.createdAt ?? video.updatedAt,
  };
  const hasCardMetadata = Boolean(nativeVideo.date || nativeVideo.studioName);
  const hasCardFooter = Boolean(
    nativeVideo.performers.length || nativeVideo.tags.length,
  );
  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const link = element.querySelector<HTMLAnchorElement>(
      `a[href="/video/${video.id}"]`,
    );
    const cardTitle = element.querySelector<HTMLElement>(".card-title");
    const cardTitleId = `dq-card-title-${video.id}`;
    if (cardTitle) {
      cardTitle.id = cardTitleId;
    }
    if (link) {
      link.target = "_blank";
      link.rel = "noreferrer";
      link.removeAttribute("aria-label");
      link.setAttribute("aria-labelledby", cardTitleId);
      link.classList.add("dq-card-link");
    }
    const selection = element.querySelector<HTMLButtonElement>(
      'button[aria-label="Select item"], button[aria-label="Deselect item"]',
    );
    if (selection)
      selection.setAttribute(
        "aria-label",
        selected ? `Deselect ${title}` : `Select ${title}`,
      );
    const quickView = element.querySelector<HTMLButtonElement>(
      'button[title="Quick View"]',
    );
    if (quickView) quickView.setAttribute("aria-label", `Preview ${title}`);
  });
  return (
    <article
      ref={(node) => {
        root.current = node;
        setRef(node);
      }}
      tabIndex={0}
      aria-current={focused ? "true" : undefined}
      aria-label={`${title}${selected ? ", selected" : ""}`}
      onFocus={onFocus}
      onClick={(event) => {
        onFocus();
        event.currentTarget.focus({ preventScroll: true });
      }}
      className={`dq-review-card relative h-full ${displayMode} ${hasCardMetadata ? "has-card-metadata" : "no-card-metadata"} ${hasCardFooter ? "has-card-footer" : "no-card-footer"} ${focused ? "focused" : ""} ${selected ? "selected" : ""}`}
    >
      <VideoCard
        video={nativeVideo}
        selected={selected}
        onSelect={onToggle}
        onNavigate={onNavigate}
        onQuickView={onPreview}
        onClick={() => {
          window.open(`/video/${video.id}`, "_blank", "noopener,noreferrer");
        }}
      />
      {showTagBins && <section className="dq-card-tag-bins" aria-label="Card tag bins">
        {video.tags?.map(tag => <span key={tag.id}>{tag.name}</span>)}
        {!video.tags?.length && <small>No matching tags</small>}
      </section>}
      {displayMode === "wall" && <WallPreview video={video} cardsScroll={cardsScroll} />}
    </article>
  );
}

function WallPreview({ video, cardsScroll }: { video: MediaItem; cardsScroll: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [play, setPlay] = useState(false);
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const element = root.current;
    if (!element || !video.files.length) return;
    if (typeof IntersectionObserver === "undefined") {
      setLoad(true);
      setPlay(true);
      return;
    }
    // Where the cards scroll on their own (the page fits the window), previews load as they near
    // that area's edges rather than the window's.
    const scrollRoot = cardsScroll ? element.closest<HTMLElement>(".dq-grid-stage") : null;
    const loadObserver = new IntersectionObserver(
      ([entry]) => setLoad(entry.isIntersecting),
      { root: scrollRoot, rootMargin: "320px 0px", threshold: 0 },
    );
    const playObserver = new IntersectionObserver(
      ([entry]) =>
        setPlay(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { root: scrollRoot, threshold: [0, 0.6, 1] },
    );
    loadObserver.observe(element);
    playObserver.observe(element);
    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [video.id, video.files.length, cardsScroll]);
  useEffect(() => {
    if (!load) {
      setAvailable(false);
      return;
    }
    const controller = new AbortController();
    request<{ available?: boolean }>(videoPreviewStatusUrl(video.id), {
      signal: controller.signal,
    })
      .then((status) => {
        if (!controller.signal.aborted) setAvailable(status.available === true);
      })
      .catch(() => {
        if (!controller.signal.aborted) setAvailable(false);
      });
    return () => controller.abort();
  }, [load, video.id]);
  useEffect(() => {
    const element = media.current;
    if (!element) return;
    if (play) void Promise.resolve(element.play()).catch(() => undefined);
    else element.pause();
  }, [available, play]);
  return (
    <div ref={root} className="dq-wall-autoplay" aria-hidden="true">
      {available && (
        <video
          ref={media}
          src={videoPreviewUrl(video.id)}
          muted
          loop
          playsInline
          preload="metadata"
          className="dq-wall-preview-video"
        />
      )}
    </div>
  );
}

function ReviewPreview({
  video,
  review,
  selectedCount,
  pending,
  refreshing,
  error,
  canWrite,
  assessmentReady,
  trees,
  selected,
  hasPrevious,
  hasNext,
  onToggleSelected,
  onPrevious,
  onNext,
  onClose,
  onAction,
  findOpen,
  onFindOpenChange: setFindOpen,
}: {
  video: MediaItem;
  review: VideoReview;
  /** How many cards are selected; actions apply to them, or else to this video. */
  selectedCount: number;
  pending: boolean;
  refreshing: boolean;
  error: string;
  canWrite: boolean;
  assessmentReady: boolean;
  trees: TagTrees;
  selected: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onToggleSelected: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onAction: (action: MediaReviewAction) => Promise<void>;
  /** Find action inside the preview; the page owns the state so its keys pause too. */
  findOpen: boolean;
  onFindOpenChange(open: boolean): void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  // Phone-sized windows: no key caps or key hints, and the title takes a line of its own.
  const mobile = useMobileLayout();
  const playerControls = useRef<{
    toggle(): void;
    seekBy(seconds: number): void;
  } | null>(null);
  const file = video.files[0];
  const title = videoTitle(video);
  const actionBlocked = (action: ReviewAction) =>
    pending ||
    refreshing ||
    ("steps" in action && action.steps.length > 0 && !canWrite) ||
    (hasAssessmentSteps(action) && !assessmentReady);
  // The preview is a dialog, which holds Cove's page surfaces back, so its
  // action keys and Find action live on the overlay surface. Action keys keep
  // working after a click on any preview control, including its action tiles.
  useReviewKeys({
    surface: "overlay",
    enabled: !findOpen,
    actions: review.actions,
    onAction: (index) => {
      const action = review.actions[index];
      if (action) void onAction(action);
    },
    onFind: () => setFindOpen(true),
  });
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
  function trapFocus(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Tab") return;
    const focusable = [
      ...(dialog.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ) ?? []),
    ].filter((element) => element.offsetParent !== null);
    if (!focusable.length) {
      event.preventDefault();
      dialog.current?.focus();
      return;
    }
    const activeIndex = focusable.indexOf(
      document.activeElement as HTMLElement,
    );
    if (event.shiftKey && activeIndex <= 0) {
      event.preventDefault();
      focusable.at(-1)?.focus();
    } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
      event.preventDefault();
      focusable[0].focus();
    }
  }
  function handlePlayerKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    // Find action owns the keyboard while it is open, wherever focus is; the
    // page closes it on Escape.
    if (findOpen) return;
    if (event.defaultPrevented || event.ctrlKey || event.metaKey) return;
    if (
      (event.target as HTMLElement).closest(
        'button, input, select, textarea, a, [contenteditable="true"], [role="combobox"], [role="slider"]',
      )
    )
      return;
    const arrow = event.key === "ArrowLeft" || event.key === "ArrowRight";
    if (event.altKey && !arrow) return;
    const controls = playerControls.current;
    const videoElement = event.currentTarget.querySelector("video");
    if (event.key === "Enter" || event.key === "Escape") {
      if (!event.repeat) onClose();
    } else if (event.key === " " && controls) {
      if (!event.repeat) controls.toggle();
    } else if (arrow && controls) {
      controls.seekBy(
        (event.key === "ArrowLeft" ? -1 : 1) *
          (event.shiftKey ? 5 : event.altKey ? 10 : 60),
      );
    } else if ((event.key === "," || event.key === ".") && controls) {
      const sourceDuration =
        [file?.duration, videoElement?.duration].find(
          (value) => value != null && Number.isFinite(value) && value > 0,
        ) ?? 0;
      const duration =
        video.parentVideoId != null
          ? (video.clipEndSec ?? sourceDuration) - (video.clipStartSec ?? 0)
          : sourceDuration;
      if (Number.isFinite(duration) && duration > 0)
        controls.seekBy((event.key === "," ? -1 : 1) * duration * 0.1);
    } else if (
      event.key.toLowerCase() === "n" ||
      event.key.toLowerCase() === "m"
    ) {
      if (!event.repeat && !pending && !refreshing) {
        if (event.key.toLowerCase() === "n" && hasPrevious) onPrevious();
        if (event.key.toLowerCase() === "m" && hasNext) onNext();
      }
    } else if (event.key === "ArrowUp" && videoElement)
      videoElement.volume = Math.min(1, videoElement.volume + 0.1);
    else if (event.key === "ArrowDown" && videoElement)
      videoElement.volume = Math.max(0, videoElement.volume - 0.1);
    else return;
    consumeShortcut(event);
  }
  // The preview's own keys (Space, the arrows, n and m) need focus inside it, on the preview
  // rather than on a button, which takes Space and Enter for itself. So a pointer click on one of
  // the preview's own buttons or links hands focus back to the preview. A button pressed from the
  // keyboard keeps focus, as keyboard users expect. The player's controls (portalled menus
  // included) and Find action keep their focus.
  function keepFocus(event: ReactMouseEvent<HTMLDivElement>) {
    const root = dialog.current;
    const control =
      event.target instanceof Element ? event.target.closest("button, a[href]") : null;
    if (
      !root ||
      !control ||
      !root.contains(control) ||
      control.closest(".dq-player, .dq-find-action") ||
      event.detail === 0
    )
      return;
    root.focus({ preventScroll: true });
  }
  // A focused control that a running action or the last video disables drops focus to the page,
  // which would leave the preview's keys dead until a click back in, and so does a focused bar
  // button that goes when the window crosses the phone-sized width. Once the browser has done so
  // (it does at the next rendering update), focus returns to the preview.
  useEffect(() => {
    if (findOpen) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        const active = document.activeElement;
        if (
          dialog.current?.isConnected &&
          (!active || active === document.body || active === document.documentElement)
        )
          dialog.current.focus({ preventScroll: true });
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [findOpen, pending, refreshing, hasNext, hasPrevious, video.id, mobile]);
  const target = selectedCount
    ? `the ${selectedCount} selected video${selectedCount === 1 ? "" : "s"}`
    : "this video";
  return (
    <div
      ref={dialog}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={`Review preview: ${title}`}
      className={`dq-preview${mobile ? " dq-preview-mobile" : ""}`}
      onKeyDown={trapFocus}
      onKeyDownCapture={handlePlayerKey}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onClick={keepFocus}
    >
      <div className="dq-preview-shell">
        <header className="dq-preview-header">
          <button
            type="button"
            className="dq-preview-button"
            aria-label="Previous video"
            aria-keyshortcuts="n"
            title="Previous video"
            disabled={!hasPrevious || pending || refreshing}
            onClick={onPrevious}
          >
            <ChevronLeft aria-hidden="true" />
            {!mobile && <KeyCap binding="n" hidden />}
          </button>
          <button
            type="button"
            className="dq-preview-button"
            aria-label="Next video"
            aria-keyshortcuts="m"
            title="Next video"
            disabled={!hasNext || pending || refreshing}
            onClick={onNext}
          >
            {!mobile && <KeyCap binding="m" hidden />}
            <ChevronRight aria-hidden="true" />
          </button>
          <div className="dq-preview-title">
            <h2>{title}</h2>
            <p>Actions apply to {target}</p>
          </div>
          <button
            type="button"
            className="dq-preview-button dq-preview-select"
            aria-pressed={selected}
            disabled={refreshing}
            onClick={onToggleSelected}
          >
            <span className="dq-preview-check" aria-hidden="true">
              {selected && <Check />}
            </span>
            Selected
          </button>
          <a
            href={`/video/${video.id}`}
            target="_blank"
            rel="noreferrer"
            className="dq-preview-button dq-preview-icon"
            aria-label={`Open ${title} in a new tab`}
            title="Open video in a new tab"
          >
            <ExternalLink aria-hidden="true" />
          </a>
          <button
            type="button"
            className="dq-preview-button dq-preview-icon"
            aria-label="Close preview"
            aria-keyshortcuts="Escape"
            title="Close preview"
            onClick={onClose}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="dq-player" data-review-player-controls tabIndex={0}>
          <div className="dq-preview-video">
            {file ? (
              <VideoPlayer
                autostart
                streamUrl={mediaStreamUrl("video", video.id)}
                posterUrl={videoScreenshotUrl(video)}
                format={file.format}
                audioCodec={file.audioCodec}
                duration={file.duration ?? 0}
                videoId={video.id}
                showAbLoop={false}
                extensionSurface="quick-view"
                onPlaybackControlRegister={(controls) => {
                  playerControls.current = controls;
                  return () => {
                    if (playerControls.current === controls)
                      playerControls.current = null;
                  };
                }}
                clip={
                  video.parentVideoId != null
                    ? {
                        start: video.clipStartSec ?? 0,
                        end: video.clipEndSec,
                        loop: false,
                      }
                    : undefined
                }
              />
            ) : (
              <img src={videoScreenshotUrl(video)} alt="" />
            )}
          </div>
        </div>
        {error && (
          <p role="alert" className="dq-alert dq-preview-alert">
            {error}
          </p>
        )}
        {!mobile && (
          <p className="dq-preview-hints">
            <span>Space play / pause</span>
            <span>← → ±60 s · Alt ±10 s · Shift ±5 s</span>
            <span>, . ±10 %</span>
            <span>↑ ↓ volume</span>
            <span>N M previous / next</span>
            <span>Enter or Esc closes</span>
          </p>
        )}
        <ActionBar
          className="dq-action-bar-docked"
          actions={review.actions}
          trees={trees}
          isDisabled={actionBlocked}
          busy={pending || refreshing}
          onApply={(action) => void onAction(action as MediaReviewAction)}
          onFind={() => setFindOpen(true)}
          status={pending ? `Applying action to ${target}…` : ""}
          summary={
            <p className="dq-bar-target">
              {selectedCount ? `${selectedCount} selected` : "This video"}
            </p>
          }
        />
      </div>
      {findOpen && (
        <FindAction
          actions={review.actions}
          trees={trees}
          isDisabled={actionBlocked}
          canStay={false}
          onApply={(action) => {
            setFindOpen(false);
            void onAction(action as MediaReviewAction);
          }}
          onClose={() => setFindOpen(false)}
        />
      )}
    </div>
  );
}

async function exportRecovery() {
  const me = await request<{ user: { id: string | number } }>("/api/auth/me");
  const id = String(me.user.id);
  const current = localStorage.getItem("cove-data-quality-v2:" + id);
  let raw =
    current ??
    localStorage.getItem("cove-data-quality-reviews-v1:" + id) ??
    localStorage.getItem("cove-video-reviews-v1:" + id) ??
    "[]";
  if (current) {
    try {
      const config = JSON.parse(current);
      if (Array.isArray(config.reviews))
        raw = JSON.stringify(config.reviews, null, 2);
    } catch {
      /* Export the original corrupt payload without modifying it. */
    }
  }
  const url = URL.createObjectURL(
    new Blob([raw], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "data-quality-browser-recovery.json";
  link.click();
  URL.revokeObjectURL(url);
}

function CenteredStatus({ label }: { label: string }) {
  return (
    <div role="status" className="dq-centered">
      <Loader2 className="dq-spin" />
      {label}
    </div>
  );
}
function ErrorState({
  message,
  onRetry,
  retryLabel = "Retry",
}: {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}) {
  return (
    <div role="alert" className="dq-error">
      <AlertTriangle />
      <p>{message}</p>
      <button className="dq-button" type="button" onClick={onRetry}>
        {retryLabel}
      </button>
    </div>
  );
}

export default { components: { DataQualityPage } };
