export type DisplayMode = "grid" | "list" | "wall" | "tagger";

export interface ReviewView {
  filter: Record<string, unknown>;
  objectFilter: Record<string, unknown>;
  displayMode: DisplayMode;
  searchMode: string;
  startFrom?: "beginning" | "end";
  reviewMode?: "single" | "multiple";
}

export interface ReviewStep {
  mode:
    | "ADD"
    | "REMOVE"
    | "REMOVE_TREE"
    | "MARK_PRESENT"
    | "MARK_ABSENT"
    | "CLEAR_ABSENCE";
  tagIds: number[];
}

interface ReviewActionBase {
  id: string;
  label: string;
  shortcut?: string;
}

export interface VideoReviewAction extends ReviewActionBase {
  steps: ReviewStep[];
}

export type TagReviewEffect =
  | { mode: "SET_TAG_GROUP"; tagGroupId: number }
  | { mode: "CLEAR_TAG_GROUP" }
  | { mode: "SKIP" };

export interface TagReviewAction extends ReviewActionBase {
  effect: TagReviewEffect;
}

export type ReviewAction = VideoReviewAction | TagReviewAction;

interface ReviewBase {
  id: string;
  name: string;
  description: string;
  view: ReviewView;
  importNotes?: string[];
}

export interface VideoReview extends ReviewBase {
  entityType?: "video";
  actions: VideoReviewAction[];
  presentation?: {
    cardSize?: number | null;
    annotations?: Array<"date" | "studio" | "performers" | "tags">;
    annotationParents?: number[];
    binParents?: number[];
  };
}

export interface TagReview extends ReviewBase {
  entityType: "tag";
  actions: TagReviewAction[];
  presentation?: { cardSize?: number | null };
}

export interface OccurrenceReview extends ReviewBase {
  entityType: "performerOccurrence";
  actions: VideoReviewAction[];
  occurrence: {
    targetMode: "all" | "selected" | "filter";
    performerIds: number[];
    performerFilter: Record<string, unknown>;
    condition: "any" | "includes" | "includesAll" | "excludes" | "isNull";
    conditionTagIds: number[];
    includeSubtags?: boolean;
    tagIds: number[];
    multiple: boolean;
  };
  presentation?: { cardSize?: number | null };
}

export type Review = VideoReview | TagReview | OccurrenceReview;
export type ReviewEntityType = "video" | "tag" | "performerOccurrence";

export function occurrenceAnswerSignature(review: OccurrenceReview): string {
  if (review.actions.length) return JSON.stringify(["actions", review.actions.map((action) => action.steps)]);
  return JSON.stringify([[...review.occurrence.tagIds].sort((a, b) => a - b), review.occurrence.multiple]);
}

export function reviewEntityType(review: Review): ReviewEntityType {
  return review.entityType ?? "video";
}

export function actionShortcut(action: ReviewAction, index: number): string {
  void action;
  return "qwertyuiop"[index] ?? "";
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

export function reviewValidation(review: Review): string {
  if (review.entityType === "performerOccurrence") {
    if (!validOccurrenceSettings(review.occurrence))
      return "Complete the optional occurrence condition before saving.";
    if (review.actions.some((action) => action.steps.some((step) => !["ADD", "REMOVE", "REMOVE_TREE"].includes(step.mode))))
      return "Occurrence actions support adding and removing tags on the active performer. Video tag assessments are not supported here.";
  }
  if (
    reviewEntityType(review) === "video" &&
    review.actions.some((action) =>
      hasContradictoryAssessments(action as VideoReviewAction),
    )
  )
    return "An action cannot contain contradictory assessments for the same tag.";
  if (
    !review.name.trim() ||
    !review.actions.every((action) => validAction(action, reviewEntityType(review)))
  )
    return "Name the review and complete every action step before saving.";
  if (new Set(review.actions.map((a) => a.id)).size !== review.actions.length)
    return "Action IDs must be unique within a review.";
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
    perPage: Math.max(1, Math.min(1000, positive(filter.perPage, 40))),
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

export function queueSignature(review: Review): string {
  const { page: _page, ...filter } = review.view.filter;
  const signature = [
    filter,
    review.view.objectFilter,
    review.view.searchMode,
  ];
  return JSON.stringify(
    review.entityType === "performerOccurrence"
      ? ["performerOccurrence", ...signature, review.occurrence]
      : reviewEntityType(review) === "tag" ? ["tag", ...signature] : signature,
  );
}

export function validAction(
  action: ReviewAction,
  entityType?: ReviewEntityType,
): boolean {
  const actionType = entityType ?? ("effect" in action ? "tag" : "video");
  if (!action.label.trim()) return false;
  if (actionType === "tag") {
    if (
      !("effect" in action) ||
      "steps" in action ||
      !action.effect ||
      typeof action.effect !== "object"
    )
      return false;
    return (
      ["SET_TAG_GROUP", "CLEAR_TAG_GROUP", "SKIP"].includes(
        action.effect.mode,
      ) &&
      (action.effect.mode !== "SET_TAG_GROUP" ||
        (Number.isSafeInteger(action.effect.tagGroupId) &&
          action.effect.tagGroupId > 0))
    );
  }
  if (!("steps" in action) || "effect" in action) return false;
  return (
    action.steps.every(
      (step) =>
        [
          "ADD",
          "REMOVE",
          "REMOVE_TREE",
          "MARK_PRESENT",
          "MARK_ABSENT",
          "CLEAR_ABSENCE",
        ].includes(step.mode) &&
        step.tagIds.length > 0 &&
        step.tagIds.every((id) => Number.isSafeInteger(id) && id > 0),
    ) &&
    !hasContradictoryAssessments(action)
  );
}

export function hasAssessmentSteps(action: ReviewAction): boolean {
  if (!("steps" in action)) return false;
  return action.steps.some((step) =>
    ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(step.mode),
  );
}

function hasContradictoryAssessments(action: VideoReviewAction): boolean {
  const assessments = new Map<number, ReviewStep["mode"]>();
  for (const step of action.steps) {
    if (!["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(step.mode))
      continue;
    for (const id of step.tagIds) {
      const previous = assessments.get(id);
      if (previous && previous !== step.mode) return true;
      assessments.set(id, step.mode);
    }
  }
  return false;
}

export function parseReviews(raw: string | null): Review[] {
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
        (review.entityType === undefined ||
          review.entityType === "video" ||
          review.entityType === "tag" ||
          review.entityType === "performerOccurrence") &&
        (review.entityType !== "performerOccurrence" || validOccurrenceSettings(review.occurrence)) &&
        review.view &&
        typeof review.view === "object" &&
        (review.entityType === "tag"
          ? ["grid", "list"].includes(review.view.displayMode)
          : ["grid", "list", "wall", "tagger"].includes(
              review.view.displayMode,
            )) &&
        typeof review.view.searchMode === "string" &&
        (review.view.startFrom === undefined ||
          ["beginning", "end"].includes(review.view.startFrom)) &&
        (review.view.reviewMode === undefined ||
          ["single", "multiple"].includes(review.view.reviewMode)) &&
        review.view.filter &&
        typeof review.view.filter === "object" &&
        !Array.isArray(review.view.filter) &&
        review.view.objectFilter &&
        typeof review.view.objectFilter === "object" &&
        !Array.isArray(review.view.objectFilter) &&
        validPresentation(review.presentation, review.entityType === "tag") &&
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
            (review.entityType === "tag"
              ? "effect" in action &&
                !("steps" in action) &&
                validAction(action, "tag")
              : "steps" in action &&
                !("effect" in action) &&
                Array.isArray(action.steps) &&
                action.steps.every(
                  (step) => step && Array.isArray(step.tagIds),
                ) &&
                validAction(action, "video")),
        ),
    )
  ) {
    throw new Error(
      "Saved reviews could not be read. Existing browser data has been kept.",
    );
  }
  if ((data as Review[]).some((review) => reviewValidation(review)))
    throw new Error(
      "Saved reviews contain invalid actions. Existing data has been kept.",
    );
  if (
    new Set((data as Review[]).map((review) => review.id)).size !==
    data.length
  )
    throw new Error(
      "Saved review IDs must be unique. Existing data has been kept.",
    );
  return data as Review[];
}

function validPresentation(value: unknown, tagReview: boolean): boolean {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const settings = value as NonNullable<VideoReview["presentation"]>;
  return (
    (settings.cardSize === undefined ||
      settings.cardSize === null ||
      (Number.isFinite(settings.cardSize) &&
        settings.cardSize >= 115 &&
        settings.cardSize <= 380)) &&
    (!tagReview ||
      (settings.annotations === undefined &&
        settings.annotationParents === undefined &&
        settings.binParents === undefined)) &&
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

export function mergeReviews(...sources: Review[][]): Review[] {
  const merged: Review[] = [];
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

function validOccurrenceSettings(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const settings = value as OccurrenceReview["occurrence"];
  const ids = (value: unknown): value is number[] => Array.isArray(value) &&
    value.every((id) => Number.isSafeInteger(id) && id > 0) && new Set(value).size === value.length;
  return ["all", "selected", "filter"].includes(settings.targetMode) &&
    ids(settings.performerIds) && (settings.targetMode !== "selected" || settings.performerIds.length > 0) &&
    !!settings.performerFilter && typeof settings.performerFilter === "object" && !Array.isArray(settings.performerFilter) &&
    ["any", "includes", "includesAll", "excludes", "isNull"].includes(settings.condition) &&
    ids(settings.conditionTagIds) && (["any", "isNull"].includes(settings.condition) || settings.conditionTagIds.length > 0) &&
    (settings.includeSubtags === undefined || typeof settings.includeSubtags === "boolean") &&
    ids(settings.tagIds) && typeof settings.multiple === "boolean";
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
