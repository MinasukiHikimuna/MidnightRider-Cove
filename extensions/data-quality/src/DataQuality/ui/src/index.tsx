import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  EntityReferenceMultiSelector,
  EntityDetailTabs,
  DetailListPagination,
  SortableList,
  type DragHandleProps,
  VideoPlayer,
  formatDuration,
  getResolutionLabel,
} from "@cove/runtime/components";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Film,
  GripVertical,
  Loader2,
  Pencil,
  Play,
  Plus,
  Trash2,
  Upload,
  X,
} from "@cove/runtime/lucide-react";
import {
  findVideos,
  loadReviews,
  loadProgress,
  saveProgress,
  request,
  runReviewAction,
  settleReviewWrites,
  saveReviews,
  videoCoverUrl,
  videoPreviewStatusUrl,
  videoPreviewUrl,
  videoScreenshotUrl,
  videoStreamUrl,
  type Video,
  type VideoPage,
} from "./api";
import {
  getNextReviewFocus,
  getReviewActionTargets,
  isReviewShortcutTarget,
  mergeReviews,
  parseReviews,
  toggleShownReviewSelection,
  validAction,
  type ReviewAction,
  type ReviewStep,
  type VideoReview,
} from "./model";
import "./styles.css";
import {
  usePresentationTags,
  annotations,
  TagBins,
  withTagBin,
} from "./TagPresentation";
import { QueueEditor } from "./QueueEditor";
import {
  actionShortcut,
  reviewValidation,
  boundedFilter,
  resumeFocus,
  queueSignature,
} from "./model";

type ReviewDisplayMode = "grid" | "list" | "wall";

function initialDisplayMode(review: VideoReview): ReviewDisplayMode {
  return review.view.displayMode === "wall" ||
    review.view.displayMode === "list"
    ? review.view.displayMode
    : "grid";
}

function selectedReviewId() {
  return new URLSearchParams(window.location.search).get("review") ?? "";
}

function writeSelectedReviewId(reviewId: string) {
  const params = new URLSearchParams(window.location.search);
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

export function DataQualityPage({
  onNavigate,
}: {
  onNavigate: (route: { page: string; id?: number }) => void;
}) {
  const [reviews, setReviews] = useState<VideoReview[]>([]);
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
  const [canWrite, setCanWrite] = useState(false);
  const [canConfigure, setCanConfigure] = useState(true);
  const [storageNotice, setStorageNotice] = useState("");
  const [progressError, setProgressError] = useState("");
  const [progressLoadBlocked, setProgressLoadBlocked] = useState(false);
  const [progressReady, setProgressReady] = useState(false);
  const [activeId, setActiveId] = useState(selectedReviewId);
  const [managerOpen, setManagerOpen] = useState(false);
  const [editCurrent, setEditCurrent] = useState(false);
  const [temporaryEditor, setTemporaryEditor] = useState(false);
  const [temporaryReview, setTemporaryReview] = useState<VideoReview | null>(
    null,
  );
  const savedReview = reviews.find((item) => item.id === activeId) ?? null;
  const review = useMemo(
    () =>
      temporaryReview?.id === activeId && savedReview
        ? { ...savedReview, view: temporaryReview.view }
        : savedReview,
    [temporaryReview, activeId, savedReview],
  );
  const presentationTags = usePresentationTags(review);
  const [filter, setFilter] = useState<Record<string, unknown>>({
    page: 1,
    perPage: 40,
    sort: "date",
    direction: "desc",
  });
  const [queue, setQueue] = useState<VideoPage>({ items: [], totalCount: 0 });
  const [queueLoading, setQueueLoading] = useState(false);
  const [queueError, setQueueError] = useState("");
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
  const [cardSize, setCardSize] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const [pendingTargetLabel, setPendingTargetLabel] = useState("");
  const [message, setMessage] = useState("");
  const [actionError, setActionError] = useState("");
  const cardRefs = useRef(new Map<number, HTMLElement>());
  const gridRef = useRef<HTMLDivElement>(null);
  const loadGeneration = useRef(0);
  const actionGeneration = useRef(0);
  const queueAbort = useRef<AbortController | null>(null);

  const loadAllReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError("");
    try {
      const result = await loadReviews();
      setReviews(result.reviews);
      setStorageKey(result.storageKey);
      setCanWrite(result.canWrite);
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
    void loadAllReviews();
  }, []);

  const fetchQueue = useCallback(
    async (
      targetReview: VideoReview,
      targetFilter: Record<string, unknown>,
    ) => {
      const generation = ++loadGeneration.current;
      queueAbort.current?.abort();
      const controller = new AbortController();
      queueAbort.current = controller;
      targetFilter = boundedFilter(targetFilter);
      setFilter(targetFilter);
      setQueueLoading(true);
      setQueueError("");
      try {
        let result = await findVideos(
          targetReview,
          targetFilter,
          controller.signal,
        );
        const lastPage = Math.max(
          1,
          Math.ceil(result.totalCount / Number(targetFilter.perPage)),
        );
        if (Number(targetFilter.page) > lastPage) {
          targetFilter = { ...targetFilter, page: lastPage };
          result = await findVideos(
            targetReview,
            targetFilter,
            controller.signal,
          );
        }
        if (generation === loadGeneration.current) {
          setQueue(result);
          setFilter(targetFilter);
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
    if (!review) {
      setQueueLoading(false);
      return;
    }
    let current = true;
    setQueueLoading(true);
    void (async () => {
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
        progress?.signature === queueSignature(review) ? progress : null;
      const nextFilter = resume
        ? boundedFilter(resume.filter)
        : pageFilter(review.view.filter);
      setFilter(nextFilter);
      setDisplayMode(resume?.displayMode ?? initialDisplayMode(review));
      setCardSize(
        resume ? resume.cardSize : (review.presentation?.cardSize ?? null),
      );
      try {
        const result = await fetchQueue(review, nextFilter);
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
      if (current) setProgressReady(true);
    })();
    return () => {
      current = false;
      actionGeneration.current++;
      loadGeneration.current++;
      queueAbort.current?.abort();
    };
  }, [review?.id]);

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

  const focusedVideo =
    queue.items.find((item) => item.id === focusedId) ?? null;
  if (previewOpen && focusedVideo) previewVideoRef.current = focusedVideo;
  const previewVideo =
    focusedVideo ?? (previewOpen ? previewVideoRef.current : null);
  const targets = getReviewActionTargets(selectedIds, focusedId);
  const targetLabel =
    selectedIds.size > 0
      ? `${selectedIds.size} selected video${selectedIds.size === 1 ? "" : "s"}`
      : focusedId == null
        ? "no video"
        : "focused video";

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
      const actionTargets = getReviewActionTargets(
        selectedRef.current,
        focusedRef.current,
      );
      if (
        !review ||
        pendingRef.current ||
        queueLoading ||
        queueError ||
        !canWrite ||
        !actionTargets.length
      )
        return;
      const generation = ++actionGeneration.current;
      const reviewId = review.id;
      const previousIds = [...itemIds];
      const previousFocus = focusedRef.current;
      const versions = new Map(
        actionTargets.map((id) => [id, selectionVersions.current.get(id) ?? 0]),
      );
      const isCurrent = () =>
        generation === actionGeneration.current && review.id === reviewId;
      pendingRef.current = true;
      setPending(true);
      setPendingTargetLabel(
        selectedRef.current.size
          ? `${actionTargets.length} selected videos`
          : "the focused video",
      );
      setMessage("");
      setActionError("");
      let succeeded = false;
      try {
        await runReviewAction(action, actionTargets);
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
          `${action.label}: ${actionTargets.length} video${actionTargets.length === 1 ? "" : "s"} ${action.steps.length ? "updated" : "skipped"}.`,
        );
      } catch (error) {
        if (!isCurrent()) return;
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
        }
      }
    },
    [
      canWrite,
      fetchQueue,
      filter,
      focusCard,
      itemIds,
      queueLoading,
      queueError,
      review,
    ],
  );

  function gridColumnCount() {
    const grid = gridRef.current?.firstElementChild;
    const template = grid ? getComputedStyle(grid).gridTemplateColumns : "";
    return Math.max(1, template.split(" ").filter(Boolean).length);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (
      event.defaultPrevented ||
      event.repeat ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey
    )
      return;
    if (managerOpen || temporaryEditor) return;
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
        (action, index) => actionShortcut(action, index) === event.key,
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
      setPreviewOpen(true);
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
    setActiveId(id);
    writeSelectedReviewId(id);
  }

  async function updateReviews(next: VideoReview[]): Promise<boolean> {
    if (!storageKey) return false;
    try {
      await saveReviews(storageKey, next);
    } catch (error) {
      throw error;
    }
    setReviews(next);
    if (activeId && !next.some((item) => item.id === activeId))
      chooseReview("");
    const updated = next.find((item) => item.id === activeId);
    if (
      updated &&
      savedReview &&
      JSON.stringify(updated) !== JSON.stringify(savedReview)
    ) {
      if (updated.view.displayMode !== savedReview.view.displayMode)
        setDisplayMode(initialDisplayMode(updated));
      if (updated.presentation?.cardSize !== savedReview.presentation?.cardSize)
        setCardSize(updated.presentation?.cardSize ?? null);
      if (queueSignature(updated) !== queueSignature(savedReview)) {
        setTemporaryReview(null);
        void resumeQueue(
          updated,
          boundedFilter({ ...updated.view.filter, page: filter.page }),
        );
      }
    }
    return true;
  }

  if (reviewsLoading)
    return <CenteredStatus label="Loading Data Quality reviews…" />;
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
        <div>
          <h1>Data Quality</h1>
          <p>
            A focused queue for previewing videos and applying saved review
            actions.
          </p>
        </div>
        <label>
          Review
          <select
            value={review?.id ?? ""}
            disabled={pending}
            onChange={(event) => chooseReview(event.target.value)}
          >
            <option value="">Choose a review…</option>
            {reviews.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <button
          className="dq-button"
          type="button"
          disabled={pending || queueLoading || !canConfigure}
          onClick={() => {
            setEditCurrent(false);
            setManagerOpen(true);
          }}
        >
          <Pencil /> Manage reviews
        </button>
      </header>

      <p className="dq-status">{storageNotice}</p>
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
      {!review ? (
        <div className="dq-empty">
          <Film />
          <p>
            {reviews.length
              ? "Choose a saved review to open its queue."
              : "No saved reviews are available in this browser."}
          </p>
        </div>
      ) : (
        <>
          <section className="dq-toolbar">
            <button
              type="button"
              className="dq-button"
              disabled={pending || queueLoading || !canConfigure}
              onClick={() => {
                setEditCurrent(true);
                setManagerOpen(true);
              }}
            >
              Edit review
            </button>
            <button
              type="button"
              className="dq-button"
              disabled={pending || queueLoading}
              onClick={() => setTemporaryEditor(true)}
            >
              Adjust queue
            </button>
            {temporaryReview?.id === activeId && (
              <>
                <span>Temporary queue</span>
                <button
                  type="button"
                  className="dq-button"
                  disabled={pending || queueLoading || !canConfigure}
                  onClick={() => {
                    if (savedReview) {
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
                            error instanceof Error
                              ? error.message
                              : "Could not save queue.",
                          ),
                        );
                    }
                  }}
                >
                  Save queue to review
                </button>
                <button
                  type="button"
                  className="dq-button"
                  disabled={pending || queueLoading}
                  onClick={() => {
                    setTemporaryReview(null);
                    if (savedReview)
                      void resumeQueue(
                        savedReview,
                        boundedFilter({
                          ...savedReview.view.filter,
                          page: filter.page,
                        }),
                      );
                  }}
                >
                  Reset to saved queue
                </button>
              </>
            )}
            <div className="dq-review-title">
              <h2>{review.name}</h2>
              {review.description && <p>{review.description}</p>}
            </div>
            <div
              className="dq-view-switch"
              role="group"
              aria-label="Review view"
            >
              {(["grid", "list", "wall"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  aria-pressed={displayMode === mode}
                  onClick={() => setDisplayMode(mode)}
                >
                  {mode}
                </button>
              ))}
            </div>
            {displayMode !== "list" && (
              <>
                <label className="dq-card-size">
                  Card width
                  <input
                    aria-label="Review card size"
                    type="range"
                    min="115"
                    max="380"
                    step="5"
                    value={cardSize ?? (displayMode === "wall" ? 130 : 180)}
                    onChange={(event) =>
                      setCardSize(Number(event.target.value))
                    }
                  />
                </label>
                <button
                  className={`dq-button ${cardSize == null ? "active" : ""}`}
                  type="button"
                  onClick={() => setCardSize(null)}
                >
                  Auto fit
                </button>
              </>
            )}
            <span>{queue.totalCount.toLocaleString()} matching</span>
          </section>
          {presentationTags.error && (
            <p role="alert">{presentationTags.error}</p>
          )}
          <TagBins
            videos={queue.items}
            review={review}
            trees={presentationTags.ids}
            disabled={pending || queueLoading}
            onChoose={(id) => {
              const adjusted = withTagBin(review, id);
              setTemporaryReview(adjusted);
              void resumeQueue(adjusted, { ...filter, page: 1 });
            }}
          />
          {actionError && !previewOpen && (
            <div role="alert" className="dq-alert">
              <AlertTriangle />
              {actionError}
            </div>
          )}
          {message && (
            <p role="status" className="dq-status">
              {message}
            </p>
          )}
          <div className="dq-workspace">
            <main>
              {renderPagination("top")}
              {queueLoading && !queue.items.length && (
                <CenteredStatus label="Loading review queue…" />
              )}
              {queueError && !queueLoading && (
                <ErrorState
                  message={queueError}
                  onRetry={() =>
                    void fetchQueue(review, filter).catch(() => undefined)
                  }
                />
              )}
              {!queueLoading && !queueError && !queue.items.length && (
                <div className="dq-empty">
                  <Film />
                  <p>No videos match this review.</p>
                </div>
              )}
              {!!queue.items.length && (
                <div ref={gridRef}>
                  {displayMode === "list" ? (
                    <div className="dq-list" data-review-layout="list">
                      {queue.items.map(renderCard)}
                    </div>
                  ) : (
                    <div
                      className="dq-grid"
                      style={
                        {
                          "--dq-card-width":
                            cardSize == null
                              ? displayMode === "wall"
                                ? "clamp(115px, 10vw, 150px)"
                                : "clamp(145px, 14vw, 180px)"
                              : `${cardSize}px`,
                        } as React.CSSProperties
                      }
                    >
                      {queue.items.map(renderCard)}
                    </div>
                  )}
                </div>
              )}
              {renderPagination("bottom")}
            </main>
            <aside className="dq-actions">
              <strong>{targetLabel}</strong>
              {review.actions.map((action, index) => (
                <button
                  key={action.id}
                  type="button"
                  disabled={
                    pending ||
                    queueLoading ||
                    !!queueError ||
                    !canWrite ||
                    !targets.length
                  }
                  onClick={() => void execute(action)}
                >
                  {actionShortcut(action, index) && (
                    <kbd>{actionShortcut(action, index)}</kbd>
                  )}
                  <span>{action.label}</span>
                  <small>
                    {action.steps.length
                      ? `${action.steps.length} step(s)`
                      : "Skip"}
                  </small>
                </button>
              ))}
              {!review.actions.length && <p>This review has no actions.</p>}
              {!canWrite && (
                <p>Video write permission is required to apply actions.</p>
              )}
              {pending && (
                <p role="status">
                  <Loader2 className="dq-spin" /> Applying action to{" "}
                  {pendingTargetLabel}…
                </p>
              )}
              <p className="dq-shortcuts">
                ←→↑↓ move · space select · enter preview · 1–9 apply · A toggle
                shown · Esc clear
              </p>
            </aside>
          </div>
        </>
      )}

      {previewOpen && previewVideo && review && (
        <ReviewPreview
          video={previewVideo}
          review={review}
          targetLabel={targetLabel}
          pending={pending}
          refreshing={queueLoading || !!queueError}
          error={actionError}
          canWrite={canWrite}
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
          onOpen={() => onNavigate({ page: "video", id: previewVideo.id })}
        />
      )}
      {temporaryEditor && review && (
        <ReviewManager
          reviews={reviews}
          activeReview={{ ...review, view: { ...review.view, filter } }}
          initialEdit
          temporary
          onSave={(next) => {
            const adjusted = next.find((item) => item.id === activeId)!;
            setTemporaryReview(adjusted);
            void resumeQueue(
              adjusted,
              boundedFilter({ ...adjusted.view.filter, page: filter.page }),
            );
            return true;
          }}
          onChoose={() => undefined}
          onClose={() => {
            setTemporaryEditor(false);
            focusCard(focusedRef.current, false);
          }}
        />
      )}
      {managerOpen && (
        <ReviewManager
          reviews={reviews}
          activeReview={savedReview}
          initialEdit={editCurrent}
          onSave={updateReviews}
          onChoose={chooseReview}
          onClose={() => {
            setManagerOpen(false);
            if (editCurrent) focusCard(focusedRef.current, false);
          }}
        />
      )}
    </div>
  );

  async function resumeQueue(
    target: VideoReview,
    nextFilter: Record<string, unknown>,
  ) {
    const priorFocus = focusedRef.current;
    const priorIndex = Math.max(0, itemIds.indexOf(priorFocus ?? -1));
    try {
      const result = await fetchQueue(target, nextFilter);
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
            if (
              pending ||
              queueLoading ||
              next.page === Number(filter.page)
            ) return;
            setFilterAndLoad(
              { ...filter, page: next.page },
              review,
              setFilter,
              fetchQueue,
              clearPageState,
            );
          }}
        />
      </fieldset>
    );
  }

  function renderCard(video: Video) {
    return (
      <ReviewCard
        key={video.id}
        video={video}
        annotation={annotations(video, review, presentationTags.ids)}
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
      />
    );
  }
}

function setFilterAndLoad(
  next: Record<string, unknown>,
  review: VideoReview,
  setFilter: (value: Record<string, unknown>) => void,
  fetchQueue: (
    review: VideoReview,
    filter: Record<string, unknown>,
  ) => Promise<VideoPage>,
  clear: () => void,
) {
  setFilter(next);
  clear();
  void fetchQueue(review, next).catch(() => undefined);
}

function toggleOne(current: Set<number>, id: number) {
  const next = new Set(current);
  if (next.has(id)) next.delete(id);
  else next.add(id);
  return next;
}

function ReviewCard({
  video,
  annotation,
  displayMode,
  focused,
  selected,
  setRef,
  onFocus,
  onToggle,
  onPreview,
}: {
  video: Video;
  annotation: string;
  displayMode: ReviewDisplayMode;
  focused: boolean;
  selected: boolean;
  setRef: (node: HTMLElement | null) => void;
  onFocus: () => void;
  onToggle: () => void;
  onPreview: () => void;
}) {
  const file = video.files[0];
  const title = videoTitle(video);
  const overlays = (
    <>
      <button
        type="button"
        aria-label={selected ? `Deselect ${title}` : `Select ${title}`}
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        className={`dq-select ${selected ? "selected" : ""}`}
      >
        {selected && <Check />}
      </button>
      <button
        type="button"
        aria-label={`Preview ${title}`}
        onClick={(event) => {
          event.stopPropagation();
          onPreview();
        }}
        className="dq-preview-button"
      >
        <Play />
      </button>
      <div className="dq-badges">
        {file && <span>{getResolutionLabel(file.width, file.height)}</span>}
        {file?.duration ? <span>{formatDuration(file.duration)}</span> : null}
      </div>
    </>
  );
  return (
    <article
      ref={setRef}
      tabIndex={0}
      aria-current={focused ? "true" : undefined}
      aria-label={`${title}${selected ? ", selected" : ""}`}
      onFocus={onFocus}
      onClick={(event) => {
        onFocus();
        event.currentTarget.focus({ preventScroll: true });
      }}
      className={`dq-card ${displayMode} ${focused ? "focused" : ""} ${selected ? "selected" : ""}`}
    >
      {displayMode === "wall" ? (
        <WallPreview video={video}>
          {overlays}
          <p className="dq-wall-title">{title}</p>
        </WallPreview>
      ) : (
        <div className="dq-poster">
          <img src={videoCoverUrl(video)} alt="" />
          {overlays}
        </div>
      )}
      {(displayMode !== "wall" || annotation) && (
        <div className="dq-card-copy">
          <strong>{title}</strong>
          <small>{annotation} </small>
        </div>
      )}
    </article>
  );
}

function WallPreview({
  video,
  children,
}: {
  video: Video;
  children: ReactNode;
}) {
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
    <div ref={root} className="dq-wall-media">
      <img src={videoCoverUrl(video)} alt="" />
      {available && (
        <video
          ref={media}
          src={videoPreviewUrl(video.id)}
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      {children}
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
  selected,
  hasPrevious,
  hasNext,
  onToggleSelected,
  onPrevious,
  onNext,
  onClose,
  onAction,
  onOpen,
}: {
  video: Video;
  review: VideoReview;
  targetLabel: string;
  pending: boolean;
  refreshing: boolean;
  error: string;
  canWrite: boolean;
  selected: boolean;
  hasPrevious: boolean;
  hasNext: boolean;
  onToggleSelected: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  onAction: (action: ReviewAction) => Promise<void>;
  onOpen: () => void;
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
          <button
            type="button"
            onClick={onOpen}
            aria-label="Open video details"
          >
            <ExternalLink />
          </button>
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
              disabled={pending || refreshing || !canWrite}
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
  initialEdit = false,
  temporary = false,
  onSave,
  onChoose,
  onClose,
}: {
  reviews: VideoReview[];
  activeReview: VideoReview | null;
  initialEdit?: boolean;
  temporary?: boolean;
  onSave: (reviews: VideoReview[]) => boolean | Promise<boolean>;
  onChoose: (id: string) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<VideoReview | null>(() =>
    initialEdit && activeReview ? structuredClone(activeReview) : null,
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
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
  function begin(review?: VideoReview) {
    setDraft(
      review
        ? structuredClone(review)
        : {
            id: crypto.randomUUID(),
            name: "",
            description: "",
            view: structuredClone(
              activeReview?.view ?? {
                filter: {
                  page: 1,
                  perPage: 40,
                  sort: "date",
                  direction: "desc",
                },
                objectFilter: {},
                displayMode: "grid",
                searchMode: "text",
              },
            ),
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
      onChoose(saved.id);
      onClose();
    } catch (error) {
      setError(
        "Could not save reviews. Your edits are still open. " +
          (error instanceof Error ? error.message : "Retry saving."),
      );
    } finally {
      setSaving(false);
    }
  }
  async function persistList(next: VideoReview[]) {
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
              {temporary
                ? "Adjust queue temporarily"
                : draft
                  ? reviews.some((item) => item.id === draft.id)
                    ? "Edit review"
                    : "New review"
                  : "Manage reviews"}
            </h2>
            <p>
              {temporary
                ? "Apply changes for this session. Saved review settings stay available through Reset to saved queue."
                : "Edit your review, then save or cancel to resume your position."}
            </p>
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
              draft={draft}
              temporary={temporary}
              saving={saving}
              setDraft={setDraft}
              onSave={() => void persistDraft()}
              onCancel={onClose}
            />
          ) : (
            <>
              <div className="dq-manager-tools">
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
                      <strong>{review.name}</strong>
                      <p>{review.description || "No description"}</p>
                    </div>
                    <button type="button" onClick={() => begin(review)}>
                      <Pencil /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        begin({
                          ...structuredClone(review),
                          id: crypto.randomUUID(),
                          name: `${review.name} copy`,
                        })
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
  draft,
  temporary = false,
  saving = false,
  setDraft,
  onSave,
  onCancel,
}: {
  draft: VideoReview;
  temporary?: boolean;
  saving?: boolean;
  setDraft: (review: VideoReview) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [section, setSection] = useState("Review");
  const stepKeys = useRef(new WeakMap<ReviewStep, string>());
  const stepKey = (step: ReviewStep): string => {
    let key = stepKeys.current.get(step);
    if (!key) {
      key = crypto.randomUUID();
      stepKeys.current.set(step, key);
    }
    return key;
  };
  const updateAction = (index: number, action: ReviewAction) =>
    setDraft({
      ...draft,
      actions: draft.actions.map((item, itemIndex) =>
        itemIndex === index ? action : item,
      ),
    });
  return (
    <div className="dq-editor">
      {!temporary && (
        <div className="dq-editor-nav">
          <EntityDetailTabs
            tabs={["Review", "Queue", "Appearance", "Actions"].map(name => ({
              key: name, label: name,
              count: name === "Actions" ? draft.actions.length : undefined,
              disabled: saving,
            }))}
            activeTab={section}
            onTabChange={setSection}
          />
        </div>
      )}
      <div className="dq-editor-body">
        {!temporary && (
          <section hidden={section !== "Review"} className="dq-editor-section">
            <h3>Review details</h3>
            <p className="dq-editor-note">
              Give this review a name and describe what you want to check.
            </p>
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
        )}
        <section
          hidden={!temporary && section !== "Queue"}
          className="dq-editor-section"
        >
          <QueueEditor draft={draft} onChange={setDraft} presentation={false} />
        </section>
        {!temporary && (
          <section
            hidden={section !== "Appearance"}
            className="dq-editor-section"
          >
            <QueueEditor draft={draft} onChange={setDraft} queue={false} />
          </section>
        )}
        {!temporary && (
          <section hidden={section !== "Actions"} className="dq-editor-section">
            <h3>Actions</h3>
            <p>
              Steps run in order. No steps means Skip. Earlier steps may remain
              applied if a later step fails.
            </p>
            <p className="dq-editor-note">
              Drag the handles to reorder. With a handle focused, use Alt + ↑ or
              ↓.
            </p>
            <SortableList
              items={draft.actions}
              getKey={(action) => action.id}
              disabled={saving}
              className="dq-sortable-list"
              onReorder={(actions) => setDraft({ ...draft, actions })}
              renderItem={(action, { index, dragHandleProps, isOver }) => (
                <fieldset
                  className={
                    isOver ? "dq-action-card dq-drag-over" : "dq-action-card"
                  }
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
                    <div className="dq-row">
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
                                shortcut: "",
                              },
                              ...draft.actions.slice(index + 1),
                            ],
                          })
                        }
                      >
                        Duplicate action
                      </button>
                    </div>
                  </div>
                  <div className="dq-field-grid">
                    <label>
                      Shortcut
                      <select
                        value={action.shortcut ?? "auto"}
                        onChange={(e) =>
                          updateAction(index, {
                            ...action,
                            shortcut:
                              e.target.value === "auto"
                                ? undefined
                                : e.target.value,
                          })
                        }
                      >
                        <option value="auto">
                          Position ({index < 9 ? index + 1 : "none"})
                        </option>
                        <option value="">None</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      Button label
                      <input
                        value={action.label}
                        onChange={(event) =>
                          updateAction(index, {
                            ...action,
                            label: event.target.value,
                          })
                        }
                      />
                    </label>
                  </div>
                  <SortableList
                    items={action.steps}
                    getKey={stepKey}
                    disabled={saving}
                    className="dq-sortable-list"
                    onReorder={(steps) =>
                      updateAction(index, { ...action, steps })
                    }
                    renderItem={(
                      step,
                      { index: stepIndex, dragHandleProps, isOver },
                    ) => (
                      <ActionStep
                        dragHandleProps={dragHandleProps}
                        saving={saving}
                        isOver={isOver}
                        step={step}
                        index={stepIndex}
                        onChange={(next) => {
                          stepKeys.current.set(next, stepKey(step));
                          updateAction(index, {
                            ...action,
                            steps: action.steps.map((item, itemIndex) =>
                              itemIndex === stepIndex ? next : item,
                            ),
                          });
                        }}
                        onRemove={() =>
                          updateAction(index, {
                            ...action,
                            steps: action.steps.filter(
                              (_, itemIndex) => itemIndex !== stepIndex,
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
          </section>
        )}
      </div>
      <div className="dq-editor-footer">
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
          {temporary ? "Apply temporary queue" : "Save review"}
        </button>
      </div>
    </div>
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
  return (
    <div className={isOver ? "dq-action-step dq-drag-over" : "dq-action-step"}>
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
      </select>
      <EntityReferenceMultiSelector
        entityType="tag"
        values={step.tagIds}
        onChange={(tagIds) => onChange({ ...step, tagIds })}
        placeholder="Choose tags"
        allowCreate={false}
      />
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
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div role="alert" className="dq-error">
      <AlertTriangle />
      <p>{message}</p>
      <button className="dq-button" type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}

export default { components: { DataQualityPage } };
