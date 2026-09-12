import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  EntityReferenceMultiSelector,
  EntityDetailTabs,
  DetailListPagination,
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
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  GripVertical,
  Loader2,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Save,
  Settings,
  Tags as TagsIcon,
  Trash2,
  Upload,
  X,
} from "@cove/runtime/lucide-react";
import {
  createConfirmedAbsentTagsField,
  findTags,
  findVideos,
  getConfirmedAbsentTagsFieldStatus,
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
  videoStreamUrl,
  type Tag,
  type TagGroup,
  type Video,
  type ConfirmedAbsentTagsFieldStatus,
} from "./api";
import {
  getNextReviewFocus,
  getReviewActionTargets,
  hasAssessmentSteps,
  isReviewShortcutTarget,
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
  type VideoReview,
  type VideoReviewAction,
  type OccurrenceReview,
  type ReviewEntityType,
} from "./model";
import { OccurrenceSettings } from "./OccurrenceReview";
import { ReviewWorkspace } from "./ReviewWorkspace";
import { queryKeys, readQuery, defaultQuery, effectiveReview, writeQuery } from "./reviewQuery";
import { occurrenceSceneReview, resolvePerformers } from "./occurrences";
import { objectFiltersEqual } from "./objectFiltersEqual";
export { objectFiltersEqual } from "./objectFiltersEqual";
import "./styles.css";
import {
  usePresentationTags,
  presentedVideo,
  TagBins,
  withTagBin,
} from "./TagPresentation";
import { QueueEditor } from "./QueueEditor";
import {
  presentCustomFieldCriteria,
  preserveCustomFieldCriteria,
  stripCustomFieldPresentation,
  unresolvedCustomFieldTagIds,
} from "./CustomFieldPresentation";
import {
  actionShortcut,
  reviewValidation,
  boundedFilter,
  resumeFocus,
  queueSignature,
} from "./model";

type ReviewDisplayMode = "grid" | "list" | "wall";
type ReviewEntity = Video | Tag;
interface ReviewPage {
  items: ReviewEntity[];
  totalCount: number;
}
type ReviewBrowserSort = "name" | "count";
type ReviewBrowserDirection = "asc" | "desc";

const defaultCardSize = 180;
const customFieldQueueCriterion = {
  id: "custom-fields",
  label: "Custom Fields",
  filterKey: "customFieldCriteria",
  type: "string",
  supported: false,
};

function ReviewEntityIcon({ entityType }: { entityType: ReviewEntityType }) {
  return entityType === "tag" ? (
    <TagsIcon role="img" aria-label="Tag review" />
  ) : (
    <Film role="img" aria-label={entityType === "performerOccurrence" ? "Performer occurrence review" : "Video review"} />
  );
}

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

function videoTitle(video: Video) {
  return video.title || video.files[0]?.basename || `Video ${video.id}`;
}

function consumeShortcut(event: ReactKeyboardEvent<HTMLElement>) {
  event.preventDefault();
  event.stopPropagation();
  event.nativeEvent.stopImmediatePropagation();
}

const WORKSPACE_LAYOUT_STORAGE_KEY = "data-quality.workspace-layout.v1";
const DEFAULT_SIDEBAR_WIDTH = 240;
const MIN_SIDEBAR_WIDTH = 192;
const MAX_SIDEBAR_WIDTH = 560;

function clampSidebarWidth(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, value))
    : DEFAULT_SIDEBAR_WIDTH;
}

function readSidebarWidth() {
  try {
    const value = JSON.parse(
      localStorage.getItem(WORKSPACE_LAYOUT_STORAGE_KEY) ?? "null",
    );
    return clampSidebarWidth(value?.sidebarWidth);
  } catch {
    return DEFAULT_SIDEBAR_WIDTH;
  }
}

function writeSidebarWidth(sidebarWidth: number) {
  try {
    localStorage.setItem(
      WORKSPACE_LAYOUT_STORAGE_KEY,
      JSON.stringify({ sidebarWidth }),
    );
  } catch {
    // Resizing remains available when browser storage is unavailable.
  }
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

function reviewStepTagLabel(step: ReviewStep, tagName: string) {
  switch (step.mode) {
    case "ADD":
      return `Add ${tagName}`;
    case "REMOVE":
      return tagName;
    case "REMOVE_TREE":
      return `${tagName} tree`;
    case "MARK_PRESENT":
      return `Mark ${tagName} present`;
    case "MARK_ABSENT":
      return `Mark ${tagName} absent`;
    case "CLEAR_ABSENCE":
      return `Clear ${tagName} absence`;
  }
}

function reviewStepAccessibleTagLabel(step: ReviewStep, tagName: string) {
  if (step.mode === "REMOVE") return `Remove ${tagName}`;
  if (step.mode === "REMOVE_TREE") return `Remove ${tagName} tree`;
  return reviewStepTagLabel(step, tagName);
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
  const videoReview = entityType === "video" ? (review as VideoReview | null) : null;
  const [layoutOverride, setLayoutOverride] = useState<{ id: string; mode: "single" | "multiple" } | null>(null);
  const reviewMode = layoutOverride?.id === review?.id ? layoutOverride?.mode : review?.view.reviewMode ?? "single";
  const usesWorkspace = entityType === "performerOccurrence" || (entityType === "video" && reviewMode === "single");
  const [queryRevision, setQueryRevision] = useState(0);
  const readyQueryRevision = useRef(-1);
  const deferredNavigation = useRef(false);
  useEffect(() => {
    const restore = () => {
      if (!usesWorkspace && pendingRef.current) {
        deferredNavigation.current = true;
        return;
      }
      setActiveId(selectedReviewId());
      if (!usesWorkspace) setQueryRevision(value => value + 1);
    };
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [usesWorkspace]);
  const canWriteCurrent = entityType === "tag" ? canWriteTags : canWriteVideos;
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
  const [focusedId, setFocusedId] = useState<number | null>(null);
  const focusedRef = useRef(focusedId);
  focusedRef.current = focusedId;
  const [previewOpen, setPreviewOpen] = useState(false);
  const previewOpenRef = useRef(previewOpen);
  previewOpenRef.current = previewOpen;
  const previewVideoRef = useRef<Video | null>(null);
  const [displayMode, setDisplayMode] = useState<ReviewDisplayMode>("grid");
  const [cardSize, setCardSize] = useState(defaultCardSize);
  const [sidebarWidth, setSidebarWidth] = useState(readSidebarWidth);
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
  const [actionTagNames, setActionTagNames] = useState<
    Record<number, string | null>
  >({});
  const cardRefs = useRef(new Map<number, HTMLElement>());
  const gridRef = useRef<HTMLDivElement>(null);
  const sidebarResizeRef = useRef<{
    pointerId: number;
    startX: number;
    startWidth: number;
  } | null>(null);
  const loadGeneration = useRef(0);
  const actionGeneration = useRef(0);
  const queueAbort = useRef<AbortController | null>(null);
  const allowCustomFieldRemoval = useRef(false);
  const actionTagIds = JSON.stringify([
    ...new Set(
      videoReview?.actions.flatMap((action) =>
        action.steps.flatMap((step) => step.tagIds),
      ) ?? [],
    ),
  ]);

  function updateSidebarWidth(value: number) {
    const next = clampSidebarWidth(value);
    setSidebarWidth(next);
    writeSidebarWidth(next);
  }

  function handleSidebarSeparatorKeyDown(
    event: ReactKeyboardEvent<HTMLDivElement>,
  ) {
    const step = event.shiftKey ? 40 : 16;
    let nextWidth: number | null = null;
    if (event.key === "ArrowLeft") nextWidth = sidebarWidth + step;
    if (event.key === "ArrowRight") nextWidth = sidebarWidth - step;
    if (event.key === "Home") nextWidth = MIN_SIDEBAR_WIDTH;
    if (event.key === "End") nextWidth = MAX_SIDEBAR_WIDTH;
    if (nextWidth === null) return;
    event.preventDefault();
    event.stopPropagation();
    updateSidebarWidth(nextWidth);
  }

  useEffect(() => {
    if (!message) return;
    const timeout = window.setTimeout(() => setMessage(""), 4000);
    return () => window.clearTimeout(timeout);
  }, [message]);

  useEffect(() => {
    const ids = JSON.parse(actionTagIds) as number[];
    setActionTagNames({});
    if (!ids.length) return;
    const controller = new AbortController();
    let current = true;
    void Promise.all(
      ids.map(async (id) => {
        try {
          const tag = await request<{ name?: string }>(`/api/tags/${id}`, {
            signal: controller.signal,
          });
          return [id, tag.name?.trim() || null] as const;
        } catch {
          return [id, null] as const;
        }
      }),
    ).then((entries) => {
      if (current) setActionTagNames(Object.fromEntries(entries));
    });
    return () => {
      current = false;
      controller.abort();
    };
  }, [actionTagIds]);

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
  const queueCriteria = useMemo(
    () =>
      entityType === "video" && Array.isArray(toolbarObjectFilter.customFieldCriteria)
        ? [...VIDEO_CRITERIA, customFieldQueueCriterion]
        : entityType === "tag"
          ? TAG_CRITERIA
          : VIDEO_CRITERIA,
    [entityType, toolbarObjectFilter.customFieldCriteria],
  );

  const loadAllReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError("");
    try {
      const result = await loadReviews();
      setReviews(result.reviews);
      setStorageKey(result.storageKey);
      setCanWriteVideos(result.canWriteVideos ?? result.canWrite);
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
        item.entityType === "performerOccurrence"
          ? resolvePerformers(item, controller.signal).then(ids => ids?.length === 0 ? { items: [], totalCount: 0 } : findVideos(occurrenceSceneReview(item, ids), { ...item.view.filter, page: 1, perPage: 1 }, controller.signal))
          : reviewEntityType(item) === "tag"
          ? findTags(
              item as TagReview,
              boundedFilter({ ...item.view.filter, page: 1, perPage: 1 }),
              controller.signal,
            )
          : findVideos(
              item as VideoReview,
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

  const refreshAbsenceFieldStatus = useCallback(async () => {
    setAbsenceFieldError("");
    try {
      setAbsenceFieldStatus(await getConfirmedAbsentTagsFieldStatus());
    } catch (error) {
      setAbsenceFieldStatus(null);
      setAbsenceFieldError(
        "Tag assessment setup could not be checked. " +
          (error instanceof Error ? error.message : "Request failed."),
      );
    }
  }, []);

  useEffect(() => {
    void refreshAbsenceFieldStatus();
  }, [refreshAbsenceFieldStatus]);

  const fetchQueue = useCallback(
    async (
      targetReview: Review,
      targetFilter: Record<string, unknown>,
      startFromEnd = false,
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
            : findVideos(
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
          setQueue(result);
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
    entityType === "video" ? (focusedEntity as Video | null) : null;
  if (previewOpen && focusedVideo) previewVideoRef.current = focusedVideo;
  const previewVideo =
    focusedVideo ?? (previewOpen ? previewVideoRef.current : null);
  const targets = getReviewActionTargets(selectedIds, focusedId);
  const targetLabel =
    selectedIds.size > 0
      ? `${selectedIds.size} selected ${entityType}${selectedIds.size === 1 ? "" : "s"}`
      : focusedId == null
        ? `no ${entityType}`
        : `focused ${entityType}`;

  const focusCard = useCallback((id: number | null, scroll = true) => {
    if (id == null) return;
    window.requestAnimationFrame(() => {
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
      if (
        !review ||
        pendingRef.current ||
        queueLoading ||
        queueError ||
        (changesData && !canWriteCurrent) ||
        unavailableTagGroupAccess ||
        unavailableTagGroup ||
        (hasAssessmentSteps(action) && absenceFieldStatus?.kind !== "ready") ||
        !actionTargets.length
      )
        return;
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
        else await runReviewAction(action, actionTargets);
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
        const refreshed = await fetchQueue(review, filter);
        if (!isCurrent()) return;
        let nextIds = refreshed.items.map((item) => item.id);
        if (
          !nextIds.length &&
          refreshed.totalCount > 0 &&
          Number(filter.page) > 1
        ) {
          const previousPage = Math.max(1, Number(filter.page) - 1);
          const previousFilter = { ...filter, page: previousPage };
          setFilter(previousFilter);
          const previousResult = await fetchQueue(review, previousFilter);
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

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
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
    if (previewOpen && event.key === "Escape") {
      consumeShortcut(event);
      setPreviewOpen(false);
      focusCard(focusedRef.current);
      return;
    }
    if (!isReviewShortcutTarget(event.target)) return;
    if (event.key === "Escape") {
      consumeShortcut(event);
      updateSelection(() => new Set());
      return;
    }
    const actionIndex =
      review?.actions.findIndex(
        (action, index) => actionShortcut(action, index) === event.key.toLowerCase(),
      ) ?? -1;
    if (actionIndex >= 0 && review?.actions[actionIndex]) {
      consumeShortcut(event);
      if (!pending && !queueLoading) void execute(review.actions[actionIndex]);
      return;
    }
    if (!previewOpen && event.key === " ") {
      consumeShortcut(event);
      if (focusedId != null)
        updateSelection((current) => toggleOne(current, focusedId));
      return;
    }
    if (!previewOpen && event.key.toLowerCase() === "a") {
      consumeShortcut(event);
      updateSelection((current) =>
        toggleShownReviewSelection(current, itemIds),
      );
      return;
    }
    if (pending || queueLoading) return;
    if (previewOpen) return;
    if (event.key === "Enter" && focusedId != null) {
      consumeShortcut(event);
      if (entityType === "tag")
        window.open(`/tag/${focusedId}`, "_blank", "noopener,noreferrer");
      else setPreviewOpen(true);
      return;
    }
    const columns = gridColumnCount();
    const delta =
      event.key === "ArrowLeft"
        ? -1
        : event.key === "ArrowRight"
          ? 1
          : event.key === "ArrowUp"
            ? -columns
            : event.key === "ArrowDown"
              ? columns
              : 0;
    if (delta) {
      consumeShortcut(event);
      moveFocus(delta);
    }
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

  return (
    <div className="data-quality-page" onKeyDown={handleKeyDown}>
      <header className="data-quality-header">
        {review && (
          <button
            className="dq-header-action"
            type="button"
            aria-label="All reviews"
            title="All reviews"
            disabled={pending}
            onClick={showAllReviews}
          >
            <ChevronLeft />
          </button>
        )}
        <div className="dq-header-copy">
          <h1>{review?.name ?? "Data Quality"}</h1>
          {review?.description && (
            <p className="dq-review-description">{review.description}</p>
          )}
        </div>
        {review && savedReview && (
          <button
            type="button"
            className="dq-header-action"
            aria-label="Edit review"
            title="Edit review"
            disabled={pending || queueLoading || !canConfigure}
            onClick={() => {
              if (usesWorkspace) setWorkspaceEditRequest(value => value + 1);
              else { setEditCurrent(true); setManagerOpen(true); }
            }}
          >
            <Pencil />
          </button>
        )}
        <button
          className="dq-header-action"
          type="button"
          aria-label="Manage reviews"
          title="Manage reviews"
          disabled={pending || queueLoading || !canConfigure}
          onClick={() => {
            setEditCurrent(false);
            setManagerOpen(true);
          }}
        >
          <Settings />
        </button>
      </header>

      {storageNotice && <p className="dq-status">{storageNotice}</p>}
      {videoReview && absenceFieldStatus?.kind === "missing" && (
        <div role="status" className="dq-status">
          {absenceFieldStatus.message}{" "}
          <button
            type="button"
            disabled={absenceFieldPending}
            onClick={() => {
              setAbsenceFieldPending(true);
              setAbsenceFieldError("");
              void createConfirmedAbsentTagsField()
                .then(refreshAbsenceFieldStatus)
                .catch((error) =>
                  setAbsenceFieldError(
                    "Could not create the Confirmed absent tags custom field. " +
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
      {videoReview && (absenceFieldStatus?.kind === "incompatible" || absenceFieldError) && (
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
      {videoReview && <label className="dq-layout-control">
        Review layout
        <select aria-label="Review layout" value={reviewMode} disabled={pending || queueLoading || managerOpen}
          onChange={(event) => setLayoutOverride({ id: videoReview.id, mode: event.target.value as "single" | "multiple" })}>
          <option value="single">Single video</option>
          <option value="multiple">Multiple videos</option>
        </select>
      </label>}
      {review && savedReview && !usesWorkspace && (
        <section className="dq-queue-toolbar" aria-label="Video queue toolbar">
          <div
            className={`dq-native-toolbar-host${
              pending || queueLoading ? " dq-native-toolbar-disabled" : ""
            }`}
            aria-disabled={pending || queueLoading || undefined}
            inert={pending || queueLoading ? true : undefined}
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
                button?.getAttribute("aria-label")?.startsWith("Filters") ||
                button?.getAttribute("aria-label")?.startsWith("Edit filter:")
              )
                allowCustomFieldRemoval.current = false;
              else if (
                button?.textContent?.trim() === "Cancel" ||
                button?.getAttribute("aria-label")?.startsWith("Close ")
              )
                allowCustomFieldRemoval.current = false;
            }}
            onKeyDownCapture={(event) => {
              const button =
                event.target instanceof Element
                  ? event.target.closest("button")
                  : null;
              if (
                (event.key === "Delete" || event.key === "Backspace") &&
                button?.getAttribute("aria-label") ===
                  "Edit filter: Custom Fields"
              ) {
                event.preventDefault();
                event.stopPropagation();
                allowCustomFieldRemoval.current = true;
                button.parentElement
                  ?.querySelector<HTMLButtonElement>(
                    'button[aria-label="Remove filter: Custom Fields"]',
                  )
                  ?.click();
              } else if (event.key === "Escape")
                allowCustomFieldRemoval.current = false;
            }}
          >
            <DetailListToolbar
              filter={queueError ? loadedFilter : filter}
              onFilterChange={applyQueueToolbarFilter}
              totalCount={queue.totalCount}
              sortOptions={entityType === "tag" ? TAG_SORT_OPTIONS : VIDEO_SORT_OPTIONS}
              showSearch
              showSort
              displayMode={displayMode}
              onDisplayModeChange={(mode) =>
                setDisplayMode(supportedDisplayMode(mode, entityType))
              }
              availableDisplayModes={entityType === "tag" ? ["grid", "list"] : ["grid", "wall"]}
              zoomLevel={(cardSize - 225) / 50}
              onZoomChange={(level) =>
                setCardSize(Math.round(225 + level * 50))
              }
              cardSizeEntityType={entityType === "tag" ? "tags" : "videos"}
              criteriaDefinitions={queueCriteria}
              objectFilter={toolbarObjectFilter}
              onObjectFilterChange={(objectFilter) => {
                if (!pending && !queueLoading) {
                  const stripped =
                    entityType === "video"
                      ? stripCustomFieldPresentation(objectFilter)
                      : objectFilter;
                  pendingToolbarObjectFilter.current =
                    entityType === "video"
                      ? preserveCustomFieldCriteria(
                          review.view.objectFilter,
                          stripped,
                          allowCustomFieldRemoval.current,
                        )
                      : stripped;
                  allowCustomFieldRemoval.current = false;
                }
              }}
              showPagingControls={false}
            />
          </div>
          {temporaryReview?.id === activeId && (
            <div className="dq-review-defaults">
              <button
                type="button"
                className="dq-button"
                aria-label="Save changes to review filters"
                title="Save changes to review filters"
                disabled={pending || queueLoading || !canConfigure}
                onClick={saveTemporaryQueue}
              >
                <Save />
              </button>
              <button
                type="button"
                className="dq-button"
                aria-label="Reset to default review filters"
                title="Reset to default review filters"
                disabled={pending || queueLoading}
                onClick={resetQueueToReviewDefaults}
              >
                <RotateCcw />
              </button>
            </div>
          )}
        </section>
      )}
      {!review ? (
        reviews.length ? (
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
                const singular = itemType === "tag" ? "tag" : itemType === "performerOccurrence" ? "scene" : "video";
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
        )
      ) : usesWorkspace ? (
        <ReviewWorkspace key={review.id} review={review as VideoReview | OccurrenceReview} canWrite={review.entityType === "performerOccurrence" ? canWriteTags : canWriteVideos} onBusy={setPending} editRequest={workspaceEditRequest} renderRuleEditor={(draft, setDraft, saving) => <ReviewEditor workspace draft={draft} entityTypeLocked tagGroups={tagGroups} saving={saving} setDraft={next => setDraft(next as VideoReview | OccurrenceReview)} onSave={() => {}} onCancel={() => {}} />} onSaveDefaults={canConfigure ? updated => updateReviews(reviews.map(item => item.id === updated.id ? updated : item)) : undefined} />
      ) : (
        <>
          {videoReview && presentationTags.error && (
            <p role="alert">{presentationTags.error}</p>
          )}
          {videoReview && (
            <TagBins
              videos={queue.items as Video[]}
              review={videoReview}
              trees={presentationTags.ids}
              disabled={pending || queueLoading}
              onChoose={(id) => {
                const adjusted = withTagBin(videoReview, id);
                setTemporaryReview(adjusted);
                void resumeQueue(adjusted, { ...filter, page: 1 });
              }}
            />
          )}
          {actionError && !previewOpen && (
            <div role="alert" className="dq-alert">
              <AlertTriangle />
              {actionError}
            </div>
          )}
          {message && (
            <p role="status" aria-live="polite" className="dq-status dq-toast">
              {message}
            </p>
          )}
          {renderPagination("top")}
          <div
            className="dq-workspace"
            style={
              {
                "--dq-sidebar-width": `${sidebarWidth}px`,
              } as React.CSSProperties
            }
          >
            <main>
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
                      review,
                      filter,
                      queueRetryFromEnd,
                    ).catch(() => undefined);
                  }}
                />
              )}
              {!pending &&
                !queueLoading &&
                !queueError &&
                !queue.items.length && (
                  <div className="dq-empty">
                    <Film />
                    <p>No {entityType}s match this review.</p>
                  </div>
                )}
              {!!queue.items.length && (
                <div ref={gridRef}>
                  <div
                    className={displayMode === "list" ? "dq-tag-list" : "dq-grid"}
                    style={
                      {
                        "--dq-card-width": `${cardSize}px`,
                      } as React.CSSProperties
                    }
                  >
                    {queue.items.map(renderCard)}
                  </div>
                </div>
              )}
            </main>
            <div
              className="dq-workspace-separator"
              role="separator"
              tabIndex={0}
              aria-label="Resize review sidebar"
              aria-orientation="vertical"
              aria-valuemin={MIN_SIDEBAR_WIDTH}
              aria-valuemax={MAX_SIDEBAR_WIDTH}
              aria-valuenow={sidebarWidth}
              aria-valuetext={`${sidebarWidth} pixels wide`}
              title="Drag or use Left/Right to resize · Shift for larger steps · double-click to reset"
              onPointerDown={(event) => {
                sidebarResizeRef.current = {
                  pointerId: event.pointerId,
                  startX: event.clientX,
                  startWidth: sidebarWidth,
                };
                event.currentTarget.setPointerCapture(event.pointerId);
              }}
              onPointerMove={(event) => {
                const resize = sidebarResizeRef.current;
                if (
                  resize?.pointerId === event.pointerId &&
                  event.currentTarget.hasPointerCapture(event.pointerId)
                )
                  updateSidebarWidth(
                    resize.startWidth + resize.startX - event.clientX,
                  );
              }}
              onPointerUp={() => {
                sidebarResizeRef.current = null;
              }}
              onPointerCancel={() => {
                sidebarResizeRef.current = null;
              }}
              onKeyDown={handleSidebarSeparatorKeyDown}
              onDoubleClick={() => updateSidebarWidth(DEFAULT_SIDEBAR_WIDTH)}
            >
              <span />
            </div>
            <aside className="dq-actions">
              {selectedIds.size > 0 && <strong>{targetLabel}</strong>}
              {review.actions.map((action, index) => {
                const changesData =
                  "steps" in action
                    ? action.steps.length > 0
                    : action.effect.mode !== "SKIP";
                const targetGroupId =
                  "effect" in action &&
                  action.effect.mode === "SET_TAG_GROUP"
                    ? action.effect.tagGroupId
                    : null;
                const group =
                  targetGroupId != null
                    ? tagGroups.find((item) => item.id === targetGroupId)
                    : undefined;
                const groupUnavailable =
                  targetGroupId != null &&
                  !group;
                return <button
                  key={action.id}
                  type="button"
                  disabled={
                    pending ||
                    queueLoading ||
                    !!queueError ||
                    (changesData && !canWriteCurrent) ||
                    ("effect" in action && changesData &&
                      (!canReadTagGroups || groupUnavailable)) ||
                    (hasAssessmentSteps(action) &&
                      absenceFieldStatus?.kind !== "ready") ||
                    !targets.length
                  }
                  onClick={() => void execute(action)}
                >
                  <span className="dq-action-copy">
                    <span className="dq-action-label">{action.label}</span>
                    {"effect" in action ? (
                      <small>
                        {action.effect.mode === "SKIP"
                          ? "Skip"
                          : action.effect.mode === "CLEAR_TAG_GROUP"
                            ? "Set Ungrouped"
                            : group
                              ? `Assign ${group.name}`
                              : "Unavailable tag group"}
                      </small>
                    ) : action.steps.length ? (
                      <span className="dq-action-steps">
                        {action.steps.flatMap((step, stepIndex) =>
                          step.tagIds.map((tagId, tagIndex) => {
                            const tagName =
                              actionTagNames[tagId] === undefined
                                ? "Tag"
                                : actionTagNames[tagId] ?? "Unavailable tag";
                            const label = reviewStepTagLabel(step, tagName);
                            const accessibleLabel =
                              reviewStepAccessibleTagLabel(step, tagName);
                            return (
                              <span
                                key={`${stepIndex}-${tagId}-${tagIndex}`}
                                className="dq-step-summary"
                                data-step-tone={reviewStepTone(step.mode)}
                                aria-label={accessibleLabel}
                                title={`Step ${stepIndex + 1}: ${accessibleLabel}`}
                              >
                                {label}
                              </span>
                            );
                          }),
                        )}
                      </span>
                    ) : (
                      <small>Skip</small>
                    )}
                  </span>
                  {actionShortcut(action, index) && (
                    <kbd>{actionShortcut(action, index)}</kbd>
                  )}
                </button>;
              })}
              {!review.actions.length && <p>This review has no actions.</p>}
              {!canWriteCurrent && (
                <p>{entityType === "tag" ? "Tag" : "Video"} write permission is required to apply actions.</p>
              )}
              {entityType === "tag" && tagGroupsError && (
                <p>Tag groups are unavailable. {tagGroupsError}</p>
              )}
              {pending && (
                <p role="status">
                  <Loader2 className="dq-spin" /> Applying action to{" "}
                  {pendingTargetLabel}…
                </p>
              )}
              <p className="dq-shortcuts">
                ←→↑↓ move · space select · enter {entityType === "tag" ? "open" : "preview"} · Q–P apply · A toggle
                shown · Esc clear
              </p>
            </aside>
          </div>
          {renderPagination("bottom")}
        </>
      )}

      {previewOpen && previewVideo && videoReview && (
        <ReviewPreview
          video={previewVideo}
          review={videoReview}
          targetLabel={targetLabel}
          pending={pending}
          refreshing={queueLoading || !!queueError}
          error={actionError}
          canWrite={canWriteVideos}
          assessmentReady={absenceFieldStatus?.kind === "ready"}
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
      const result = await fetchQueue(target, nextFilter, startFromEnd);
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
    if (pending || queueLoading || !review || !savedReview) return;
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

  function renderPagination(position: "top" | "bottom") {
    if (!review) return null;
    return (
      <fieldset
        className="dq-pagination-row"
        disabled={pending || queueLoading}
        aria-label={`Review queue pagination ${position}`}
      >
        <DetailListPagination
          filter={{
            ...filter,
            page: Number(filter.page) || 1,
            perPage: Number(filter.perPage) || 40,
          }}
          totalCount={queue.totalCount}
          className="dq-pagination"
          ariaLabel={`Review queue pages ${position}`}
          onFilterChange={(next) => {
            if (pending || queueLoading || next.page === Number(filter.page))
              return;
            setFilterAndLoad(
              { ...filter, page: next.page },
              review,
              fetchQueue,
              clearPageState,
            );
          }}
        />
      </fieldset>
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
    const video = item as Video;
    return (
      <ReviewCard
        key={video.id}
        video={presentedVideo(video, videoReview, presentationTags.ids)}
        showTagBins={videoReview?.presentation?.annotations?.includes("tags") && !!videoReview.presentation.annotationParents?.length}
        displayMode={displayMode}
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
  focused,
  selected,
  setRef,
  onFocus,
  onToggle,
  onPreview,
  onNavigate,
}: {
  video: Video;
  showTagBins?: boolean;
  displayMode: ReviewDisplayMode;
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
      {displayMode === "wall" && <WallPreview video={video} />}
    </article>
  );
}

function WallPreview({ video }: { video: Video }) {
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
    const loadObserver = new IntersectionObserver(
      ([entry]) => setLoad(entry.isIntersecting),
      { rootMargin: "320px 0px", threshold: 0 },
    );
    const playObserver = new IntersectionObserver(
      ([entry]) =>
        setPlay(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] },
    );
    loadObserver.observe(element);
    playObserver.observe(element);
    return () => {
      loadObserver.disconnect();
      playObserver.disconnect();
    };
  }, [video.id, video.files.length]);
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
  targetLabel,
  pending,
  refreshing,
  error,
  canWrite,
  assessmentReady,
  selected,
  hasPrevious,
  hasNext,
  onToggleSelected,
  onPrevious,
  onNext,
  onClose,
  onAction,
}: {
  video: Video;
  review: VideoReview;
  targetLabel: string;
  pending: boolean;
  refreshing: boolean;
  error: string;
  canWrite: boolean;
  assessmentReady: boolean;
  selected: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onToggleSelected: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onAction: (action: VideoReviewAction) => Promise<void>;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const playerControls = useRef<{
    toggle(): void;
    seekBy(seconds: number): void;
  } | null>(null);
  const file = video.files[0];
  const title = videoTitle(video);
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
    >
      <div className="dq-preview-shell">
        <header data-review-player-controls>
          <button
            type="button"
            aria-label="Previous review video"
            disabled={!hasPrevious || pending || refreshing}
            onClick={onPrevious}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            aria-label="Next review video"
            disabled={!hasNext || pending || refreshing}
            onClick={onNext}
          >
            <ChevronRight />
          </button>
          <div>
            <h2>{title}</h2>
            <p>Actions target {targetLabel}.</p>
          </div>
          <button
            type="button"
            onClick={onToggleSelected}
            disabled={refreshing}
          >
            {selected ? "Selected" : "Select"}
          </button>
          <a
            href={`/video/${video.id}`}
            target="_blank"
            rel="noreferrer"
            className="dq-details-link"
            aria-label={`Open ${title} details in new tab`}
            title="Open video details in new tab"
          >
            <ExternalLink />
          </a>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close review preview"
          >
            <X />
          </button>
        </header>
        <div className="dq-player" data-review-player-controls tabIndex={0}>
          {file ? (
            <VideoPlayer
              autostart
              streamUrl={videoStreamUrl(video.id)}
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
              videoStyle={{ maxHeight: "calc(100dvh - 14rem)" }}
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
        {error && (
          <p role="alert" className="dq-alert">
            {error}
          </p>
        )}
        <p className="dq-editor-note">
          Space play/pause · ←/→ ±60s (Alt ±10s, Shift ±5s) · , / . ±10% · n/m
          previous/next · Enter/Esc close
        </p>
        <footer data-review-player-controls>
          {review.actions.map((action, index) => (
            <button
              key={action.id}
              type="button"
              disabled={
                pending ||
                refreshing ||
                (action.steps.length > 0 && !canWrite) ||
                (hasAssessmentSteps(action) && !assessmentReady)
              }
              onClick={() => void onAction(action)}
            >
              {actionShortcut(action, index) && (
                <kbd>{actionShortcut(action, index)}</kbd>
              )}
              {action.label}
            </button>
          ))}
        </footer>
      </div>
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
  const changeEntityType = (next: ReviewEntityType) => {
    if (entityTypeLocked || next === entityType) return;
    if (next === "performerOccurrence") {
      setDraft({ id: draft.id, entityType: next, name: draft.name, description: draft.description,
        view: { filter: { page: 1, perPage: 40, sort: "date", direction: "desc" }, objectFilter: {}, displayMode: "grid", searchMode: "text", startFrom: "end" },
        actions: [], occurrence: { targetMode: "all", performerIds: [], performerFilter: {}, condition: "any", conditionTagIds: [], tagIds: [], multiple: true },
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
          tabs={(setup ? ["Review"] : workspace ? ["Review", ...(entityType === "video" ? ["Appearance"] : []), "Actions", ...(entityType === "performerOccurrence" ? ["Tag choices"] : [])] : entityType === "performerOccurrence" ? ["Review", "Queue", "Actions", ...((draft as OccurrenceReview).occurrence.tagIds.length ? ["Tag choices"] : [])] : ["Review", "Queue", "Appearance", "Actions"]).map((name) => ({
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
                <option value="tag">Tags</option>
                <option value="performerOccurrence">Performer occurrence tags</option>
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
        </section>
        {!workspace && !setup && <section hidden={section !== "Queue"} className="dq-editor-section">
          <QueueEditor draft={draft} onChange={setDraft} presentation={false} />
          {draft.entityType === "performerOccurrence" && <OccurrenceSettings review={draft} onChange={setDraft} />}
        </section>}
        {!setup && draft.entityType === "performerOccurrence" && <section hidden={section !== "Tag choices"} className="dq-editor-section"><OccurrenceSettings review={draft} onChange={setDraft} choices /></section>}
        {!setup && (!workspace || entityType === "video") && <section hidden={section !== "Appearance"} className="dq-editor-section">
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
  const updateAction = (index: number, action: VideoReviewAction) =>
    setDraft({
      ...draft,
      actions: draft.actions.map((item, itemIndex) =>
        itemIndex === index ? action : item,
      ),
    });
  return (
    <>
      <h3>Actions</h3>
      {draft.entityType === "performerOccurrence" && <p>Actions apply only to the active performer in this scene. Set performer matching in the review filters below. Save review keeps those criteria with this rule.</p>}
      <p>
        Steps run in order. No steps means Skip. Earlier steps may remain
        applied if a later step fails.
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
                updateAction(index, next as VideoReviewAction)
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
                  occurrence={draft.entityType === "performerOccurrence"}
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
  occurrence = false,
  step,
  index,
  dragHandleProps,
  saving,
  isOver,
  onChange,
  onRemove,
}: {
  occurrence?: boolean;
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
        {!occurrence && <><option value="MARK_PRESENT">Mark present</option>
        <option value="MARK_ABSENT">Mark absent</option>
        <option value="CLEAR_ABSENCE">Clear absence</option></>}
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
