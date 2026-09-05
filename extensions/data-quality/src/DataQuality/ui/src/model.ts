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
  steps: ReviewStep[];
}

export interface VideoReview {
  id: string;
  name: string;
  description: string;
  view: ReviewView;
  actions: ReviewAction[];
  importNotes?: string[];
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
  return data as VideoReview[];
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
