import React, {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import {
  EntityReferenceMultiSelector,
  EntityDetailTabs,
  DetailListToolbar,
  SortableList,
  TAG_CRITERIA,
  TAG_SORT_OPTIONS,
  TagTile,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  type DragHandleProps,
  VideoCard,
  VideoPlayer,
} from "@cove/runtime/components";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  Grid3X3,
  GripVertical,
  LayoutGrid,
  List,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Trash2,
  Upload,
  X,
} from "@cove/runtime/lucide-react";
import {
  createConfirmedAbsentTagsField,
  createOccurrenceAbsenceField,
  findTags,
  findMedia,
  mediaLabel,
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
  reviewMediaKind,
  getReviewActionTargets,
  hasAssessmentSteps,
  isEditableTarget,
  isReviewShortcutTarget,
  isReviewEscapeTarget,
  isReviewGridArrowTarget,
  reviewGridArrowDelta,
  mergeReviews,
  parseReviews,
  reviewEntityType,
  toggleShownReviewSelection,
  type Review,
  type ReviewAction,
  type ReviewStep,
  type TagReview,
  type TagReviewAction,
  type TagReviewEffect,
  type MediaReview,
  type VideoReview,
  type MediaReviewAction,
  type OccurrenceReview,
  type ReviewEntityType,
} from "./model";
import { OccurrenceSettings, PerformerFlagSettings } from "./OccurrenceReview";
import { ActionsFromTags } from "./ActionsFromTags";
import { ActionBar } from "./ActionBar";
import { KeyCap } from "./ActionPad";
import { FindAction } from "./FindAction";
import { useTagTrees, type TagTrees } from "./effectPreview";
import {
  CardViewSwitch,
  LayoutSwitch,
  MoreMenu,
  ReviewHeader,
  ReviewPager,
} from "./ReviewHeader";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { ReviewEntityIcon } from "./ReviewEntityIcon";
import { useReviewKeyLabels, useReviewKeys } from "./reviewKeys";
import { queryKeys, readQuery, defaultQuery, effectiveReview, writeQuery } from "./reviewQuery";
import { occurrenceSceneReview, resolvePerformers } from "./occurrences";
import { objectFiltersEqual } from "./objectFiltersEqual";
export { objectFiltersEqual } from "./objectFiltersEqual";
import "./styles.css";
import {
  usePresentationTags,
  presentedVideo,
  TagBins,
  toggleTagBin,
} from "./TagPresentation";
import { QueueEditor } from "./QueueEditor";
import {
  presentCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
import {
  reviewValidation,
  boundedFilter,
  resumeFocus,
  queueSignature,
} from "./model";

type ReviewDisplayMode = "grid" | "list" | "wall";
type ReviewEntity = MediaItem | Tag;
interface ReviewPage {
  items: ReviewEntity[];
  totalCount: number;
}
type ReviewBrowserSort = "name" | "count";
type ReviewBrowserDirection = "asc" | "desc";

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

function writeSelectedReviewId(reviewId: string) {
  const params = new URLSearchParams(window.location.search);
  queryKeys.forEach(key => params.delete(key));
  if (reviewId) params.set("review", reviewId);
  else params.delete("review");
  const query = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${query ? `?${query}` : ""}`,
  );
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

function reviewStepTone(mode: ReviewStep["mode"]) {
  switch (mode) {
    case "ADD":
      return "positive";
    case "REMOVE":
    case "REMOVE_TREE":
      return "negative";
    case "MARK_PRESENT":
      return "present";
    case "MARK_ABSENT":
      return "absent";
    case "CLEAR_ABSENCE":
      return "neutral";
  }
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
  const [storageNotice, setStorageNotice] = useState("");
  const [progressError, setProgressError] = useState("");
  const [progressLoadBlocked, setProgressLoadBlocked] = useState(false);
  const [progressReady, setProgressReady] = useState(false);
  const [activeId, setActiveId] = useState(selectedReviewId);
  const [reviewCounts, setReviewCounts] = useState<
    Record<string, number | null>
  >({});
  const [reviewBrowserSort, setReviewBrowserSort] =
    useState<ReviewBrowserSort>("name");
  const [reviewBrowserDirection, setReviewBrowserDirection] =
    useState<ReviewBrowserDirection>("asc");
  const reviewBrowserHeadingRef = useRef<HTMLHeadingElement>(null);
  const focusReviewBrowser = useRef(false);
  const [workspaceEditRequest, setWorkspaceEditRequest] = useState(0);
  const [managerOpen, setManagerOpen] = useState(false);
  const [editCurrent, setEditCurrent] = useState(false);
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
  useEffect(() => {
    const restore = () => {
      if (!usesWorkspace && pendingRef.current) {
        deferredNavigation.current = true;
        return;
      }
      // A URL write still pending from the last render must not overwrite the URL navigated to.
      readyQueryRevision.current = -1;
      setActiveId(selectedReviewId());
      if (!usesWorkspace) setQueryRevision(value => value + 1);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [usesWorkspace]);
  const canWriteMedia = mediaKind === "audio" ? canWriteAudios : canWriteVideos;
  const writeSubject =
    entityType === "tag" ? "Tag" : mediaKind === "audio" ? "Audio" : "Video";
  const canWriteCurrent = entityType === "tag" ? canWriteTags : canWriteMedia;
  const sortedReviews = useMemo(() => {
    const direction = reviewBrowserDirection === "asc" ? 1 : -1;
    return [...reviews].sort((left, right) => {
      if (reviewBrowserSort === "count") {
        const leftCount = reviewCounts[left.id];
        const rightCount = reviewCounts[right.id];
        const leftKnown = typeof leftCount === "number";
        const rightKnown = typeof rightCount === "number";
        if (leftKnown !== rightKnown) return leftKnown ? -1 : 1;
        if (leftKnown && rightKnown && leftCount !== rightCount)
          return (leftCount - rightCount) * direction;
      }
      return (
        left.name.localeCompare(right.name, undefined, {
          numeric: true,
          sensitivity: "base",
        }) * direction
      );
    });
  }, [reviewBrowserDirection, reviewBrowserSort, reviewCounts, reviews]);
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
  // The grid's action wording ("− rest of <tree>"); the single-item workspace resolves its own.
  const trees = useTagTrees(review && !usesWorkspace ? review.actions : NO_ACTIONS);

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);

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

  useEffect(() => {
    if (activeId || reviews.length === 0) return;
    const controller = new AbortController();
    setReviewCounts({});
    for (const item of reviews) {
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

  useLayoutEffect(() => {
    if (activeId || reviewsLoading || !focusReviewBrowser.current) return;
    focusReviewBrowser.current = false;
    reviewBrowserHeadingRef.current?.focus();
  }, [activeId, reviewsLoading]);

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
    setProgressReady(false);
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
      }
    })();
    return () => {
      current = false;
      actionGeneration.current++;
      loadGeneration.current++;
      queueAbort.current?.abort();
    };
  }, [review?.id, usesWorkspace, queryRevision]);

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
      progressLoadBlocked
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
      // actions. The card still becomes the focused one for the keys.
      if (isEditableTarget(document.activeElement)) return;
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
            setActiveId(selectedReviewId());
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
    if (managerOpen) return;
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
    if (usesWorkspace || managerOpen || previewOpen || findOpen) return;
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
  const toolbarLocked = pending || (queueLoading && !progressReady);

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
      !managerOpen &&
      !previewOpen &&
      !findOpen &&
      !queueError &&
      (queue.items.length > 0 || queueLoading || pending),
    actionCount: review?.actions.length ?? 0,
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
    setWorkspaceEditRequest(0);
    setActiveId(id);
    writeSelectedReviewId(id);
  }

  function showAllReviews() {
    focusReviewBrowser.current = true;
    setReviewCounts({});
    chooseReview("");
  }

  async function updateReviews(next: Review[]): Promise<boolean> {
    if (!storageKey) return false;
    const normalized = next.map(withoutPreferredCardSize);
    try {
      await saveReviews(storageKey, normalized);
    } catch (error) {
      throw error;
    }
    setReviews(normalized);
    if (activeId && !normalized.some((item) => item.id === activeId))
      chooseReview("");
    const updated = normalized.find((item) => item.id === activeId);
    if (updated) setLayoutOverride(null);
    if (
      updated &&
      savedReview &&
      JSON.stringify(updated) !== JSON.stringify(savedReview)
    ) {
      if (updated.view.displayMode !== savedReview.view.displayMode)
        setDisplayMode(initialDisplayMode(updated));
      if (queueSignature(updated) !== queueSignature(savedReview)) {
        setTemporaryReview(null);
        if (reviewEntityType(updated) === "video") writeQuery(updated.id, {
          filter: boundedFilter(updated.view.filter),
          objectFilter: updated.view.objectFilter,
          searchMode: updated.view.searchMode,
          startFrom: updated.view.startFrom ?? "end",
        });
        if (!usesWorkspace) void resumeQueue(
          updated,
          boundedFilter({ ...updated.view.filter, page: filter.page }),
        );
      }
    }
    return true;
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
      {review && usesWorkspace ? (
        <ReviewWorkspace
          key={review.id}
          review={review as MediaReview}
          canWrite={occurrenceReview ? canWriteTags : canWriteMedia}
          canAssess={absenceFieldStatus?.kind === "ready" && canWriteMedia}
          onBusy={setPending}
          editRequest={workspaceEditRequest}
          renderRuleEditor={(draft, setDraft, saving) => <ReviewEditor workspace draft={draft} entityTypeLocked tagGroups={tagGroups} saving={saving} setDraft={next => setDraft(next as MediaReview)} onSave={() => {}} onCancel={() => {}} />}
          onSaveDefaults={canConfigure ? updated => updateReviews(reviews.map(item => item.id === updated.id ? updated : item)) : undefined}
          pageControls={{
            onBack: showAllReviews,
            onManage: () => {
              setEditCurrent(false);
              setManagerOpen(true);
            },
            manageDisabled: !canConfigure,
            onGrid: videoReview
              ? () => setLayoutOverride({ id: videoReview.id, mode: "multiple" })
              : undefined,
            notices: pageNotices,
          }}
        />
      ) : review ? (
        renderGridReview(review)
      ) : (
        <>
          <header className="data-quality-header">
            <div className="dq-header-copy">
              <h1>Data Quality</h1>
            </div>
            <button
              className="dq-header-action"
              type="button"
              aria-label="Manage reviews"
              title="Manage reviews"
              disabled={!canConfigure}
              onClick={() => {
                setEditCurrent(false);
                setManagerOpen(true);
              }}
            >
              <Settings />
            </button>
          </header>
          {pageNotices}
          {reviews.length ? (
            <section
              className="dq-review-browser"
              aria-labelledby="dq-reviews-title"
            >
              <div className="dq-review-browser-heading">
                <div>
                  <h2
                    id="dq-reviews-title"
                    ref={reviewBrowserHeadingRef}
                    tabIndex={-1}
                  >
                    Reviews
                  </h2>
                  <p>Choose a review to open its queue.</p>
                  <span className="dq-sr-only" role="status">
                    {reviews.every(
                      (item) => reviewCounts[item.id] !== undefined,
                    )
                      ? reviews.some((item) => reviewCounts[item.id] === null)
                        ? "Review counts loaded; some counts are unavailable."
                        : "Review counts loaded."
                      : ""}
                  </span>
                </div>
                <div className="dq-review-browser-sort">
                  <label>
                    <span className="dq-sr-only">Sort reviews by</span>
                    <select
                      aria-label="Sort reviews by"
                      value={reviewBrowserSort}
                      onChange={(event) =>
                        setReviewBrowserSort(
                          event.target.value as ReviewBrowserSort,
                        )
                      }
                    >
                      <option value="name">Name</option>
                      <option value="count">Item count</option>
                    </select>
                  </label>
                  <button
                    type="button"
                    aria-label={
                      reviewBrowserDirection === "asc"
                        ? "Ascending"
                        : "Descending"
                    }
                    title={
                      reviewBrowserDirection === "asc"
                        ? "Ascending"
                        : "Descending"
                    }
                    onClick={() =>
                      setReviewBrowserDirection((current) =>
                        current === "asc" ? "desc" : "asc",
                      )
                    }
                  >
                    <ChevronRight
                      className={
                        reviewBrowserDirection === "asc"
                          ? "dq-sort-ascending"
                          : "dq-sort-descending"
                      }
                    />
                  </button>
                </div>
              </div>
              <div className="dq-review-browser-list">
                {sortedReviews.map((item) => {
                  const count = reviewCounts[item.id];
                  const itemType = reviewEntityType(item);
                  const singular =
                    itemType === "tag"
                      ? "tag"
                      : isOccurrenceReview(item)
                        ? mediaLabel(mediaKindOf(itemType)).queue
                        : mediaLabel(mediaKindOf(itemType)).one;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      disabled={pending}
                      onClick={() => chooseReview(item.id)}
                    >
                      <span className="dq-review-browser-summary">
                        <span className="dq-review-title">
                          <ReviewEntityIcon entityType={itemType} />
                          <strong>{item.name}</strong>
                        </span>
                        <span
                          className="dq-review-count"
                          aria-label={
                            count === undefined
                              ? `Counting matching ${singular}s`
                              : count === null
                                ? `Matching ${singular} count unavailable`
                                : `${count.toLocaleString()} matching ${count === 1 ? singular : `${singular}s`}`
                          }
                        >
                          {count === undefined
                            ? "…"
                            : count === null
                              ? "—"
                              : count.toLocaleString()}
                        </span>
                      </span>
                      {item.description && (
                        <span className="dq-review-rule-name">
                          {item.description}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          ) : (
            <div className="dq-empty">
              <Film />
              <p>No saved reviews are available in this browser.</p>
            </div>
          )}
        </>
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
      {managerOpen && (
        <ReviewManager
          reviews={reviews}
          activeReview={savedReview}
          tagGroups={tagGroups}
          initialEdit={editCurrent}
          onSave={updateReviews}
          onChoose={chooseReview}
          onEditWorkspace={id => { if (id !== activeId) chooseReview(id); setLayoutOverride({ id, mode: "single" }); setWorkspaceEditRequest(value => value + 1); setManagerOpen(false); }}
          onClose={() => {
            setManagerOpen(false);
            if (editCurrent) focusCard(focusedRef.current, false);
          }}
        />
      )}
    </div>
  );

  async function resumeQueue(
    target: Review,
    nextFilter: Record<string, unknown>,
    startFromEnd = false,
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
      if (!previewOpenRef.current) focusCard(nextFocus, false);
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
    const keepsTemporaryQueue =
      queueSignature(adjusted) !== queueSignature(savedReview);
    const target = keepsTemporaryQueue ? adjusted : savedReview;
    setTemporaryReview(keepsTemporaryQueue ? adjusted : null);
    setMessage(keepsTemporaryQueue ? "" : "Review queue defaults restored.");
    void resumeQueue(target, targetFilter, true);
  }

  function resetQueueToReviewDefaults() {
    if (pending || queueLoading || !savedReview) return;
    pendingToolbarObjectFilter.current = null;
    const targetFilter = boundedFilter({
      ...savedReview.view.filter,
      page: 1,
    });
    setTemporaryReview(null);
    setMessage("Review queue defaults restored.");
    void resumeQueue(
      savedReview,
      targetFilter,
      savedReview.view.startFrom !== "beginning",
    );
  }

  function saveTemporaryQueue() {
    if (
      pending ||
      queueLoading ||
      !review ||
      !savedReview ||
      !canConfigure
    )
      return;
    void updateReviews(
      reviews.map((item) =>
        item.id === activeId
          ? {
              ...item,
              view: {
                ...review.view,
                filter: { ...filter, page: 1 },
              },
            }
          : item,
      ),
    )
      .then(() => {
        setTemporaryReview(null);
        setMessage("Queue saved to this review.");
      })
      .catch((error) =>
        setActionError(
          error instanceof Error ? error.message : "Could not save queue.",
        ),
      );
  }

  function clearPageState() {
    setSelectedIds(new Set());
    selectionVersions.current.clear();
    setFocusedId(null);
  }

  function goToPage(next: number) {
    if (!review || pending || next === Number(filter.page)) return;
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
    if (!videoReview || !savedReview || pending || queueLoading) return;
    const adjusted = toggleTagBin(videoReview, id, savedReview.view.objectFilter);
    const keepsTemporaryQueue =
      queueSignature(adjusted) !== queueSignature(savedReview);
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
          backDisabled={pending}
          onEdit={() => {
            setEditCurrent(true);
            setManagerOpen(true);
          }}
          editDisabled={pending || queueLoading || !canConfigure}
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
                  disabled={pending || queueLoading || managerOpen}
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
              <MoreMenu
                disabled={pending}
                items={[
                  {
                    label: "Manage reviews",
                    disabled: queueLoading || !canConfigure,
                    onSelect: () => {
                      setEditCurrent(false);
                      setManagerOpen(true);
                    },
                  },
                ]}
              />
            </>
          }
          chipsAfter={
            videoReview?.presentation?.binParents?.length ? (
              <TagBins
                videos={queue.items as MediaItem[]}
                review={videoReview}
                savedObjectFilter={(savedReview ?? videoReview).view.objectFilter}
                trees={presentationTags.ids}
                disabled={pending || queueLoading}
                onToggle={toggleQueueTagBin}
              />
            ) : undefined
          }
          chipsEnd={
            temporaryReview?.id === activeId ? (
              <>
                <span className="dq-defaults-note">
                  Queue differs from the saved review
                </span>
                <button
                  type="button"
                  className="dq-text-button"
                  title="Save the current queue criteria to this review"
                  disabled={pending || queueLoading || !canConfigure}
                  onClick={saveTemporaryQueue}
                >
                  <Save aria-hidden="true" />
                  Save to review
                </button>
                <button
                  type="button"
                  className="dq-text-button"
                  title="Reset the queue to the review's saved criteria"
                  disabled={pending || queueLoading}
                  onClick={resetQueueToReviewDefaults}
                >
                  <RotateCcw aria-hidden="true" />
                  Reset
                </button>
              </>
            ) : undefined
          }
        />
        {pageNotices}
        {videoReview && presentationTags.error && (
          <p role="alert" className="dq-alert">
            {presentationTags.error}
          </p>
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
                  void fetchQueue(
                    current,
                    filter,
                    queueRetryFromEnd,
                    selectAllOnLoad,
                  ).catch(() => undefined);
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
              actions={current.actions}
              tagGroups={tagGroups}
              trees={trees}
              isDisabled={gridActionBlocked}
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
              hints={
                notes.length
                  ? notes.join(" ")
                  : `Arrows move · Space selects · Enter ${tagReview ? "opens" : "previews"}`
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
    actionCount: review.actions.length,
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
  // which would leave the preview's keys dead until a click back in. Once the browser has done so
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
  }, [findOpen, pending, refreshing, hasNext, hasPrevious, video.id]);
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
      className="dq-preview"
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
            <KeyCap binding="n" hidden />
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
            <KeyCap binding="m" hidden />
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
        <p className="dq-preview-hints">
          <span>Space play / pause</span>
          <span>← → ±60 s · Alt ±10 s · Shift ±5 s</span>
          <span>, . ±10 %</span>
          <span>↑ ↓ volume</span>
          <span>N M previous / next</span>
          <span>Enter or Esc closes</span>
        </p>
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

function ReviewManager({
  reviews,
  activeReview,
  tagGroups,
  initialEdit = false,
  onEditWorkspace,
  onSave,
  onChoose,
  onClose,
}: {
  reviews: Review[];
  activeReview: Review | null;
  tagGroups: TagGroup[];
  initialEdit?: boolean;
  onEditWorkspace(id: string): void;
  onSave: (reviews: Review[]) => boolean | Promise<boolean>;
  onChoose: (id: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Review | null>(() =>
    initialEdit && activeReview ? structuredClone(activeReview) : null,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [entityTypeLocked, setEntityTypeLocked] = useState(
    initialEdit && activeReview != null,
  );
  const dialog = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.current
      ?.querySelector<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      )
      ?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);
  function handleManagerKey(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.defaultPrevented) {
      event.stopPropagation();
      return;
    }
    if (event.key === "Escape") {
      consumeShortcut(event);
      if (!saving) onClose();
      return;
    }
    if (event.key !== "Tab") {
      event.stopPropagation();
      return;
    }
    const focusable = [
      ...(dialog.current?.querySelectorAll<HTMLElement>(
        'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
      ) ?? []),
    ].filter((element) => element.offsetParent !== null);
    if (!focusable.length) {
      consumeShortcut(event);
      dialog.current?.focus();
      return;
    }
    const activeIndex = focusable.indexOf(
      document.activeElement as HTMLElement,
    );
    if (event.shiftKey && activeIndex <= 0) {
      consumeShortcut(event);
      focusable.at(-1)?.focus();
    } else if (!event.shiftKey && activeIndex === focusable.length - 1) {
      consumeShortcut(event);
      focusable[0].focus();
    } else event.stopPropagation();
  }
  function begin(review?: Review, lockEntityType = Boolean(review)) {
    setEntityTypeLocked(lockEntityType);
    setDraft(
      review
        ? structuredClone(review)
        : {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            entityType: "video",
            view: {
              filter: {
                page: 1,
                perPage: 40,
                sort: "date",
                direction: "desc",
              },
              objectFilter: {},
              displayMode: "grid",
              searchMode: "text",
              startFrom: "end",
            },
            actions: [],
          },
    );
    setError("");
  }
  async function persistDraft() {
    if (saving) return;
    if (!draft || reviewValidation(draft)) {
      setError(draft ? reviewValidation(draft) : "Choose a review.");
      return;
    }
    const saved = { ...draft, name: draft.name.trim() };
    const next = reviews.some((item) => item.id === saved.id)
      ? reviews.map((item) => (item.id === saved.id ? saved : item))
      : [...reviews, saved];
    setSaving(true);
    setError("");
    try {
      if (!(await onSave(next))) throw new Error("Could not save reviews.");
      if (!reviews.some(item => item.id === saved.id) && saved.entityType !== "tag") onEditWorkspace(saved.id);
      else { onChoose(saved.id); onClose(); }
    } catch (error) {
      setError(
        "Could not save reviews. Your edits are still open. " +
          (error instanceof Error ? error.message : "Retry saving."),
      );
    } finally {
      setSaving(false);
    }
  }
  async function persistList(next: Review[]) {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      if (!(await onSave(next))) throw new Error("Could not save reviews.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not save reviews.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function importFile(event: ChangeEvent<HTMLInputElement>) {
    if (saving) return;
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > 2_000_000) {
      setError("Review files must be smaller than 2 MB.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const imported = parseReviews(await file.text());
      if (!(await onSave(mergeReviews(reviews, imported))))
        throw new Error("Could not save reviews.");
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not import reviews.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={dialog}
      tabIndex={-1}
      className="dq-manager-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="Manage Data Quality reviews"
      onKeyDown={handleManagerKey}
    >
      <div className="dq-manager">
        <header>
          <div>
            <h2>
              {draft
                ? reviews.some((item) => item.id === draft.id)
                  ? "Edit review"
                  : "New review"
                : "Manage reviews"}
            </h2>
            <p>Edit your review, then save or cancel to resume your position.</p>
          </div>
          <button
            type="button"
            aria-label="Close review manager"
            disabled={saving}
            onClick={onClose}
          >
            <X />
          </button>
        </header>
        {error && (
          <p role="alert" className="dq-alert">
            {error}
          </p>
        )}
        <fieldset disabled={saving} className="dq-manager-content">
          {draft ? (
            <ReviewEditor
              setup={draft.entityType !== "tag" && !reviews.some(item => item.id === draft.id)}
              draft={draft}
              entityTypeLocked={entityTypeLocked}
              tagGroups={tagGroups}
              saving={saving}
              setDraft={setDraft}
              onSave={() => void persistDraft()}
              onCancel={onClose}
            />
          ) : (
            <>
              <div className="dq-manager-tools">
                <button type="button" className="dq-button" onClick={() => {
                  const url = URL.createObjectURL(new Blob([JSON.stringify(reviews, null, 2)], { type: "application/json" }));
                  const link = document.createElement("a"); link.href = url; link.download = "data-quality-reviews.json"; link.click(); URL.revokeObjectURL(url);
                }}>Export reviews</button>
                <button
                  className="dq-button"
                  type="button"
                  onClick={() => begin()}
                >
                  <Plus /> New review
                </button>
                <label className="dq-button">
                  <Upload /> Import reviews
                  <input
                    type="file"
                    accept="application/json,.json"
                    onChange={importFile}
                  />
                </label>
              </div>
              <div className="dq-review-list">
                {reviews.map((review) => (
                  <article key={review.id}>
                    <div>
                      <div className="dq-review-title">
                        <ReviewEntityIcon entityType={reviewEntityType(review)} />
                        <strong>{review.name}</strong>
                      </div>
                      <p>{review.description || "No description"}</p>
                    </div>
                    <button type="button" onClick={() => review.entityType === "tag" || (reviewEntityType(review) === "video" && review.view.reviewMode === "multiple") ? begin(review) : onEditWorkspace(review.id)}>
                      <Pencil /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        begin({
                          ...structuredClone(review),
                          id: crypto.randomUUID(),
                          name: `${review.name} copy`,
                        }, true)
                      }
                    >
                      Duplicate
                    </button>
                    <button
                      type="button"
                      aria-label={`Delete ${review.name}`}
                      onClick={() => {
                        if (window.confirm(`Delete review “${review.name}”?`))
                          void persistList(
                            reviews.filter((item) => item.id !== review.id),
                          );
                      }}
                    >
                      <Trash2 />
                    </button>
                  </article>
                ))}
              </div>
            </>
          )}
        </fieldset>
      </div>
    </div>
  );
}

function ReviewEditor({
  workspace = false,
  setup = false,
  draft,
  entityTypeLocked,
  tagGroups,
  saving = false,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: Review;
  workspace?: boolean;
  setup?: boolean;
  entityTypeLocked: boolean;
  tagGroups: TagGroup[];
  saving?: boolean;
  setDraft: (review: Review) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [section, setSection] = useState("Review");
  const entityType = reviewEntityType(draft);
  const occurrenceDraft = isOccurrenceReview(draft);
  const changeEntityType = (next: ReviewEntityType) => {
    if (entityTypeLocked || next === entityType) return;
    if (next === "performerOccurrence" || next === "audioPerformerOccurrence") {
      setDraft({ id: draft.id, entityType: next, name: draft.name, description: draft.description,
        view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
        actions: [], occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: true },
      });
      return;
    }
    if (next === "audio") {
      // Audios have no card grid, so an audio review always runs the single-item workspace.
      setDraft({ id: draft.id, entityType: "audio", name: draft.name, description: draft.description,
        view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end", reviewMode: "single" },
        actions: [],
      });
      return;
    }
    setDraft(
      next === "tag"
        ? {
            id: draft.id,
            entityType: "tag",
            name: draft.name,
            description: draft.description,
            view: {
              filter: {
                page: 1,
                perPage: 40,
                sort: "name",
                direction: "asc",
              },
              objectFilter: {
                tagGroupsCriterion: { value: [], modifier: "IS_NULL" },
              },
              displayMode: "grid",
              searchMode: "text",
              startFrom: "beginning",
            },
            actions: [],
          }
        : {
            id: draft.id,
            entityType: "video",
            name: draft.name,
            description: draft.description,
            view: {
              filter: {
                page: 1,
                perPage: 40,
                sort: "date",
                direction: "desc",
              },
              objectFilter: {},
              displayMode: "grid",
              searchMode: "text",
              startFrom: "end",
            },
            actions: [],
          },
    );
  };
  const stepKeys = useRef(new WeakMap<ReviewStep, string>());
  const stepKey = (step: ReviewStep): string => {
    let key = stepKeys.current.get(step);
    if (!key) {
      key = crypto.randomUUID();
      stepKeys.current.set(step, key);
    }
    return key;
  };
  return (
    <div className="dq-editor">
      <div className="dq-editor-nav">
        <EntityDetailTabs
          tabs={(setup ? ["Review"] : workspace ? ["Review", ...(entityType === "video" ? ["Appearance"] : []), "Actions", ...(occurrenceDraft ? ["Tag choices"] : [])] : occurrenceDraft ? ["Review", "Queue", "Actions", ...((draft as OccurrenceReview).occurrence.tagIds.length ? ["Tag choices"] : [])] : entityType === "audio" ? ["Review", "Queue", "Actions"] : ["Review", "Queue", "Appearance", "Actions"]).map((name) => ({
            key: name,
            label: name,
            count: name === "Actions" ? draft.actions.length : undefined,
            disabled: saving,
          }))}
          activeTab={section}
          onTabChange={setSection}
        />
      </div>
      <div className="dq-editor-body">
        <section hidden={section !== "Review"} className="dq-editor-section">
            <h3>Review details</h3>
            <p className="dq-editor-note">
              Give this review a name and describe what you want to check.
            </p>
            <label>
              Entity type
              <select
                aria-label="Entity type"
                value={entityType}
                disabled={entityTypeLocked}
                onChange={(event) =>
                  changeEntityType(event.target.value as ReviewEntityType)
                }
              >
                <option value="video">Videos</option>
                <option value="audio">Audios</option>
                <option value="tag">Tags</option>
                <option value="performerOccurrence">Performer occurrence tags</option>
                <option value="audioPerformerOccurrence">
                  Audio performer occurrence tags
                </option>
              </select>
            </label>
            <label>
              Review name
              <input
                autoFocus
                aria-label="Review name"
                value={draft.name}
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
              />
            </label>
            <label>
              Description
              <textarea
                aria-label="Description"
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
              />
            </label>
            {occurrenceDraft && !setup && (
              <PerformerFlagSettings
                review={draft as OccurrenceReview}
                onChange={setDraft}
              />
            )}
        </section>
        {!workspace && !setup && <section hidden={section !== "Queue"} className="dq-editor-section">
          <QueueEditor draft={draft} onChange={setDraft} presentation={false} />
          {occurrenceDraft && <OccurrenceSettings review={draft as OccurrenceReview} onChange={setDraft} />}
        </section>}
        {!setup && occurrenceDraft && <section hidden={section !== "Tag choices"} className="dq-editor-section"><OccurrenceSettings review={draft as OccurrenceReview} onChange={setDraft} choices /></section>}
        {!setup && entityType !== "audio" && !occurrenceDraft && (!workspace || entityType === "video") && <section hidden={section !== "Appearance"} className="dq-editor-section">
            <QueueEditor draft={draft} onChange={setDraft} queue={false} />
        </section>}
        {!setup && <section hidden={section !== "Actions"} className="dq-editor-section">
          {entityType === "tag" ? (
            <TagActionsEditor
              draft={draft as TagReview}
              saving={saving}
              tagGroups={tagGroups}
              setDraft={setDraft}
            />
          ) : (
            <VideoActionsEditor
              draft={draft as VideoReview | OccurrenceReview}
              saving={saving}
              stepKey={stepKey}
              rememberStepKey={(next, previous) =>
                stepKeys.current.set(next, stepKey(previous))
              }
              setDraft={setDraft}
            />
          )}
        </section>}
      </div>
      {!workspace && <div className="dq-editor-footer">
        <button
          className="dq-button"
          type="button"
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([JSON.stringify([draft], null, 2)], {
                type: "application/json",
              }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "data-quality-review.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
        >
          Export draft
        </button>
        <button className="dq-button" type="button" onClick={onCancel}>
          Cancel
        </button>
        <button className="dq-button primary" type="button" onClick={onSave}>
          {setup ? "Create & configure" : "Save review"}
        </button>
      </div>}
    </div>
  );
}

function ActionIdentityFields({
  action,
  onChange,
}: {
  action: ReviewAction;
  onChange: (action: ReviewAction) => void;
}) {
  return (
    <div className="dq-field-grid">
      <label>
        Button label
        <input
          value={action.label}
          onChange={(event) =>
            onChange({ ...action, label: event.target.value })
          }
        />
      </label>
    </div>
  );
}

function VideoActionsEditor({
  draft,
  saving,
  stepKey,
  rememberStepKey,
  setDraft,
}: {
  draft: VideoReview | OccurrenceReview;
  saving: boolean;
  stepKey: (step: ReviewStep) => string;
  rememberStepKey: (next: ReviewStep, previous: ReviewStep) => void;
  setDraft: (review: Review) => void;
}) {
  const [fromTags, setFromTags] = useState(false);
  // The confirmation lasts until the actions change again.
  const [added, setAdded] = useState<{ actions: MediaReviewAction[]; count: number } | null>(null);
  const fromTagsButton = useRef<HTMLButtonElement>(null);
  const fromTagsPanel = useId();
  const closeFromTags = () => {
    setFromTags(false);
    requestAnimationFrame(() => fromTagsButton.current?.focus());
  };
  const updateAction = (index: number, action: MediaReviewAction) =>
    setDraft({
      ...draft,
      actions: draft.actions.map((item, itemIndex) =>
        itemIndex === index ? action : item,
      ),
    });
  return (
    <>
      <h3>Actions</h3>
      {isOccurrenceReview(draft) && <p>Actions apply only to the active performer in this {mediaLabel(reviewMediaKind(draft)).one}. Set performer matching in the review filters below. Save review keeps those criteria with this rule.</p>}
      <p>
        Steps run in order. No steps means Skip. Earlier steps may remain
        applied if a later step fails. Removing tags and descendants never
        removes a tag the same action adds.
      </p>
      <p className="dq-editor-note">
        Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓.
      </p>
      <SortableList
        items={draft.actions}
        getKey={(action) => action.id}
        disabled={saving}
        className="dq-sortable-list"
        onReorder={(actions) => setDraft({ ...draft, actions })}
        renderItem={(action, { index, dragHandleProps, isOver }) => (
          <fieldset
            className={isOver ? "dq-action-card dq-drag-over" : "dq-action-card"}
          >
            <legend>Action {index + 1}</legend>
            <div className="dq-action-heading">
              <button
                type="button"
                {...dragHandleProps}
                disabled={saving}
                className="dq-drag-handle"
                aria-label={`Reorder action ${index + 1}`}
              >
                <GripVertical />
              </button>
              <strong>{action.label || "New action"}</strong>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    actions: [
                      ...draft.actions.slice(0, index + 1),
                      {
                        ...structuredClone(action),
                        id: crypto.randomUUID(),
                        label: action.label + " copy",
                      },
                      ...draft.actions.slice(index + 1),
                    ],
                  })
                }
              >
                Duplicate action
              </button>
            </div>
            <ActionIdentityFields
              action={action}
              onChange={(next) =>
                updateAction(index, next as MediaReviewAction)
              }
            />
            <SortableList
              items={action.steps}
              getKey={stepKey}
              disabled={saving}
              className="dq-sortable-list"
              onReorder={(steps) => updateAction(index, { ...action, steps })}
              renderItem={(step, state) => (
                <ActionStep
                  dragHandleProps={state.dragHandleProps}
                  saving={saving}
                  isOver={state.isOver}
                  step={step}
                  index={state.index}
                  onChange={(next) => {
                    rememberStepKey(next, step);
                    updateAction(index, {
                      ...action,
                      steps: action.steps.map((item, itemIndex) =>
                        itemIndex === state.index ? next : item,
                      ),
                    });
                  }}
                  onRemove={() =>
                    updateAction(index, {
                      ...action,
                      steps: action.steps.filter(
                        (_, itemIndex) => itemIndex !== state.index,
                      ),
                    })
                  }
                />
              )}
            />
            <div className="dq-row">
              <button
                className="dq-button"
                type="button"
                onClick={() =>
                  updateAction(index, {
                    ...action,
                    steps: [...action.steps, { mode: "ADD", tagIds: [] }],
                  })
                }
              >
                Add step
              </button>
              <button
                className="dq-button"
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    actions: draft.actions.filter(
                      (_, itemIndex) => itemIndex !== index,
                    ),
                  })
                }
              >
                Remove action
              </button>
            </div>
          </fieldset>
        )}
      />
      <div className="dq-row dq-add-actions">
        <button
          className="dq-button"
          type="button"
          onClick={() =>
            setDraft({
              ...draft,
              actions: [
                ...draft.actions,
                { id: crypto.randomUUID(), label: "", steps: [] },
              ],
            })
          }
        >
          Add action
        </button>
        <button
          ref={fromTagsButton}
          className="dq-button"
          type="button"
          aria-expanded={fromTags}
          aria-controls={fromTags ? fromTagsPanel : undefined}
          disabled={saving}
          onClick={() => {
            setAdded(null);
            setFromTags(!fromTags);
          }}
        >
          Add actions from parent tags…
        </button>
        <span role="status" className="dq-editor-note">
          {added?.actions === draft.actions
            ? `Added ${added.count} action${added.count === 1 ? "" : "s"} at the end.`
            : ""}
        </span>
      </div>
      {fromTags && (
        <ActionsFromTags
          id={fromTagsPanel}
          review={draft}
          disabled={saving}
          onAdd={(actions) => {
            const next = [...draft.actions, ...actions];
            setDraft({ ...draft, actions: next });
            setAdded({ actions: next, count: actions.length });
            closeFromTags();
          }}
          onCancel={closeFromTags}
        />
      )}
    </>
  );
}

function TagActionsEditor({
  draft,
  saving,
  tagGroups,
  setDraft,
}: {
  draft: TagReview;
  saving: boolean;
  tagGroups: TagGroup[];
  setDraft: (review: Review) => void;
}) {
  const updateAction = (index: number, action: TagReviewAction) =>
    setDraft({
      ...draft,
      actions: draft.actions.map((item, itemIndex) =>
        itemIndex === index ? action : item,
      ),
    });
  return (
    <>
      <h3>Actions</h3>
      <p>Each action assigns one tag group, clears the group, or skips.</p>
      <p className="dq-editor-note">
        Drag the handles to reorder. With a handle focused, use Alt + ↑ or ↓.
      </p>
      <SortableList
        items={draft.actions}
        getKey={(action) => action.id}
        disabled={saving}
        className="dq-sortable-list"
        onReorder={(actions) => setDraft({ ...draft, actions })}
        renderItem={(action, { index, dragHandleProps, isOver }) => (
          <fieldset
            className={isOver ? "dq-action-card dq-drag-over" : "dq-action-card"}
          >
            <legend>Action {index + 1}</legend>
            <div className="dq-action-heading">
              <button
                type="button"
                {...dragHandleProps}
                disabled={saving}
                className="dq-drag-handle"
                aria-label={`Reorder action ${index + 1}`}
              >
                <GripVertical />
              </button>
              <strong>{action.label || "New action"}</strong>
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    actions: [
                      ...draft.actions.slice(0, index + 1),
                      {
                        ...structuredClone(action),
                        id: crypto.randomUUID(),
                        label: action.label + " copy",
                      },
                      ...draft.actions.slice(index + 1),
                    ],
                  })
                }
              >
                Duplicate action
              </button>
            </div>
            <ActionIdentityFields
              action={action}
              onChange={(next) => updateAction(index, next as TagReviewAction)}
            />
            <label>
              Action effect
              <select
                aria-label="Tag group action"
                value={
                  action.effect.mode === "SET_TAG_GROUP"
                    ? `group:${action.effect.tagGroupId}`
                    : action.effect.mode
                }
                onChange={(event) => {
                  const value = event.target.value;
                  updateAction(index, {
                    ...action,
                    effect:
                      value === "SKIP"
                        ? { mode: "SKIP" }
                        : value === "CLEAR_TAG_GROUP"
                          ? { mode: "CLEAR_TAG_GROUP" }
                          : {
                              mode: "SET_TAG_GROUP",
                              tagGroupId: Number(value.slice("group:".length)),
                            },
                  });
                }}
              >
                <option value="SKIP">Skip</option>
                <option value="CLEAR_TAG_GROUP">Ungrouped</option>
                {action.effect.mode === "SET_TAG_GROUP" &&
                  !tagGroups.some(
                    (group) =>
                      group.id ===
                      (action.effect as Extract<
                        TagReviewEffect,
                        { mode: "SET_TAG_GROUP" }
                      >).tagGroupId,
                  ) && (
                    <option
                      value={`group:${action.effect.tagGroupId}`}
                      disabled
                    >
                      Unavailable tag group
                    </option>
                  )}
                {tagGroups.map((group) => (
                  <option key={group.id} value={`group:${group.id}`}>
                    {group.name}
                  </option>
                ))}
              </select>
            </label>
            <button
              className="dq-button"
              type="button"
              onClick={() =>
                setDraft({
                  ...draft,
                  actions: draft.actions.filter(
                    (_, itemIndex) => itemIndex !== index,
                  ),
                })
              }
            >
              Remove action
            </button>
          </fieldset>
        )}
      />
      <button
        className="dq-button"
        type="button"
        onClick={() =>
          setDraft({
            ...draft,
            actions: [
              ...draft.actions,
              {
                id: crypto.randomUUID(),
                label: "",
                effect: { mode: "SKIP" as const },
              },
            ],
          })
        }
      >
        Add action
      </button>
    </>
  );
}

function ActionStep({
  step,
  index,
  dragHandleProps,
  saving,
  isOver,
  onChange,
  onRemove,
}: {
  step: ReviewStep;
  index: number;
  dragHandleProps: DragHandleProps;
  saving: boolean;
  isOver: boolean;
  onChange: (step: ReviewStep) => void;
  onRemove: () => void;
}) {
  const tone = reviewStepTone(step.mode);
  return (
    <div
      className={isOver ? "dq-action-step dq-drag-over" : "dq-action-step"}
      data-step-tone={tone}
    >
      <button
        type="button"
        {...dragHandleProps}
        disabled={saving}
        className="dq-drag-handle"
        aria-label={`Reorder step ${index + 1}`}
      >
        <GripVertical />
      </button>
      <span>Step {index + 1}</span>
      <select
        aria-label="Tag operation"
        value={step.mode}
        onChange={(event) =>
          onChange({ ...step, mode: event.target.value as ReviewStep["mode"] })
        }
      >
        <option value="ADD">Add tags</option>
        <option value="REMOVE">Remove tags</option>
        <option value="REMOVE_TREE">Remove tags and descendants</option>
        <option value="MARK_PRESENT">Mark present</option>
        <option value="MARK_ABSENT">Mark absent</option>
        <option value="CLEAR_ABSENCE">Clear absence</option>
      </select>
      <div className="dq-step-tags">
        <EntityReferenceMultiSelector
          entityType="tag"
          values={step.tagIds}
          onChange={(tagIds) => onChange({ ...step, tagIds })}
          placeholder="Choose tags"
          allowCreate={false}
        />
      </div>
      <button type="button" aria-label="Remove step" onClick={onRemove}>
        <Trash2 />
      </button>
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
