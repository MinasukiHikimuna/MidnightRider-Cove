export type DisplayMode = "grid" | "list" | "wall" | "tagger";

export interface ReviewView {
  filter: Record<string, unknown>;
  objectFilter: Record<string, unknown>;
  displayMode: DisplayMode;
  searchMode: string;
}

export interface ReviewStep {
  mode: "ADD" | "REMOVE" | "REMOVE_TREE";
  tagIds: number[];
}

export interface ReviewAction {
  id: string;
  label: string;
  shortcut?: string;
  steps: ReviewStep[];
}

export interface VideoReview {
  id: string;
  name: string;
  description: string;
  view: ReviewView;
  actions: ReviewAction[];
  importNotes?: string[];
  presentation?: {
    cardSize?: number | null;
    annotations?: Array<"date" | "studio" | "performers" | "tags">;
    annotationParents?: number[];
    binParents?: number[];
  };
}

export function actionShortcut(action: ReviewAction, index: number): string {
  const value = action.shortcut ?? (index < 9 ? String(index + 1) : "");
  return /^[1-9]$/.test(value) ? value : "";
}

export function moveItem<T>(items: T[], index: number, delta: number): T[] {
  const next = [...items];
  const target = index + delta;
  if (
    index < 0 ||
    target < 0 ||
    index >= items.length ||
    target >= items.length
  )
    return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function reviewValidation(review: VideoReview): string {
  if (!review.name.trim() || !review.actions.every(validAction))
    return "Name the review and complete every action step before saving.";
  if (new Set(review.actions.map((a) => a.id)).size !== review.actions.length)
    return "Action IDs must be unique within a review.";
  const keys = review.actions
    .map(
      (action, index) =>
        action.shortcut ?? (index < 9 ? String(index + 1) : ""),
    )
    .filter(Boolean);
  if (
    keys.some((key) => !/^[1-9]$/.test(key)) ||
    new Set(keys).size !== keys.length
  )
    return "Assign each shortcut 1–9 only once, or choose None. Navigation and player keys are reserved.";
  return "";
}

export function boundedFilter(
  filter: Record<string, unknown>,
): Record<string, unknown> {
  const positive = (value: unknown, fallback: number) =>
    Number.isFinite(Number(value)) && Number(value) > 0
      ? Math.floor(Number(value))
      : fallback;
  return {
    ...filter,
    page: Math.max(1, positive(filter.page, 1)),
    perPage: Math.max(1, Math.min(100, positive(filter.perPage, 40))),
  };
}

export function resumeFocus(
  ids: number[],
  focusedId: number | null,
  index: number,
): number | null {
  return focusedId != null && ids.includes(focusedId)
    ? focusedId
    : (ids[Math.max(0, Math.min(index, ids.length - 1))] ?? null);
}

export function queueSignature(review: VideoReview): string {
  const { page: _page, ...filter } = review.view.filter;
  return JSON.stringify([
    filter,
    review.view.objectFilter,
    review.view.searchMode,
  ]);
}

export function validAction(action: ReviewAction): boolean {
  return (
    Boolean(action.label.trim()) &&
    action.steps.every(
      (step) =>
        ["ADD", "REMOVE", "REMOVE_TREE"].includes(step.mode) &&
        step.tagIds.length > 0 &&
        step.tagIds.every((id) => Number.isSafeInteger(id) && id > 0),
    )
  );
}

export function parseReviews(raw: string | null): VideoReview[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (
    !Array.isArray(data) ||
    !data.every(
      (review) =>
        review &&
        typeof review === "object" &&
        typeof review.id === "string" &&
        typeof review.name === "string" &&
        typeof review.description === "string" &&
        review.view &&
        typeof review.view === "object" &&
        ["grid", "list", "wall", "tagger"].includes(review.view.displayMode) &&
        typeof review.view.searchMode === "string" &&
        review.view.filter &&
        typeof review.view.filter === "object" &&
        !Array.isArray(review.view.filter) &&
        review.view.objectFilter &&
        typeof review.view.objectFilter === "object" &&
        !Array.isArray(review.view.objectFilter) &&
        validPresentation(review.presentation) &&
        (review.importNotes === undefined ||
          (Array.isArray(review.importNotes) &&
            review.importNotes.every(
              (note: unknown) => typeof note === "string",
            ))) &&
        Array.isArray(review.actions) &&
        review.actions.every(
          (action: ReviewAction) =>
            typeof action?.id === "string" &&
            typeof action.label === "string" &&
            (action.shortcut === undefined ||
              typeof action.shortcut === "string") &&
            Array.isArray(action.steps) &&
            action.steps.every((step) => step && Array.isArray(step.tagIds)) &&
            validAction(action),
        ),
    )
  ) {
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept.",
    );
  }
  if ((data as VideoReview[]).some((review) => reviewValidation(review)))
    throw new Error(
      "Saved reviews contain invalid actions or shortcuts. Existing data has been kept; assign shortcuts 1–9 only once or leave them empty.",
    );
  if (
    new Set((data as VideoReview[]).map((review) => review.id)).size !==
    data.length
  )
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept.",
    );
  return data as VideoReview[];
}

function validPresentation(value: unknown): boolean {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const settings = value as NonNullable<VideoReview["presentation"]>;
  return (
    (settings.cardSize === undefined ||
      settings.cardSize === null ||
      (Number.isFinite(settings.cardSize) &&
        settings.cardSize >= 115 &&
        settings.cardSize <= 380)) &&
    (settings.annotations === undefined ||
      (Array.isArray(settings.annotations) &&
        settings.annotations.every((field) =>
          ["date", "studio", "performers", "tags"].includes(field),
        ))) &&
    [settings.annotationParents, settings.binParents].every(
      (ids) =>
        ids === undefined ||
        (Array.isArray(ids) &&
          ids.every((id) => Number.isSafeInteger(id) && id > 0)),
    )
  );
}

export function mergeReviews(...sources: VideoReview[][]): VideoReview[] {
  const merged: VideoReview[] = [];
  const seen = new Set<string>();
  for (const source of sources) {
    for (const review of source) {
      if (seen.has(review.id)) continue;
      seen.add(review.id);
      merged.push(review);
    }
  }
  return merged;
}

export function getReviewActionTargets(
  selectedIds: ReadonlySet<number>,
  focusedId: number | null,
): number[] {
  if (selectedIds.size > 0)
    return [...selectedIds].sort((left, right) => left - right);
  return focusedId == null ? [] : [focusedId];
}

export function getNextReviewFocus(
  previousIds: readonly number[],
  nextIds: readonly number[],
  focusedId: number | null,
  advance: boolean,
): number | null {
  if (nextIds.length === 0) return null;
  if (focusedId == null) return nextIds[0];
  if (!advance && nextIds.includes(focusedId)) return focusedId;
  const previousIndex = Math.max(0, previousIds.indexOf(focusedId));
  if (advance) {
    for (const id of previousIds.slice(previousIndex + 1))
      if (nextIds.includes(id)) return id;
    if (nextIds.includes(focusedId)) {
      for (const id of previousIds.slice(0, previousIndex).reverse())
        if (nextIds.includes(id)) return id;
      return focusedId;
    }
  }
  return nextIds[Math.min(previousIndex, nextIds.length - 1)];
}

export function toggleShownReviewSelection(
  selectedIds: ReadonlySet<number>,
  shownIds: readonly number[],
): Set<number> {
  const next = new Set(selectedIds);
  const allShownSelected =
    shownIds.length > 0 && shownIds.every((id) => next.has(id));
  for (const id of shownIds) {
    if (allShownSelected) next.delete(id);
    else next.add(id);
  }
  return next;
}

export function isReviewShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !target.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]',
  );
}
