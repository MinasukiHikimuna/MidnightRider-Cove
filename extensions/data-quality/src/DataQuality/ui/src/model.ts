export type DisplayMode = "grid" | "list" | "wall" | "tagger";

export interface ReviewView {
  filter: Record<string, unknown>;
  objectFilter: Record<string, unknown>;
  displayMode: DisplayMode;
  searchMode: string;
  startFrom?: "beginning" | "end";
  reviewMode?: "single" | "multiple";
  selectAllOnLoad?: boolean;
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

export interface MediaReviewAction extends ReviewActionBase {
  steps: ReviewStep[];
  /**
   * The answer group the action belongs to, such as one question with an action per answer (see
   * answerGroups.ts). Names match trimmed and ignoring case; none, or only spaces, is no group.
   */
  group?: string;
}

export type TagReviewEffect =
  | { mode: "SET_TAG_GROUP"; tagGroupId: number }
  | { mode: "CLEAR_TAG_GROUP" }
  | { mode: "SKIP" };

export interface TagReviewAction extends ReviewActionBase {
  effect: TagReviewEffect;
}

export type ReviewAction = MediaReviewAction | TagReviewAction;

interface ReviewBase {
  id: string;
  name: string;
  description: string;
  view: ReviewView;
  importNotes?: string[];
}

/** Settings of the reviews whose actions write tags, which run in the single-item workspace. */
interface MediaReviewSettings {
  /**
   * In the single-item workspace, a plain action moves on only once every answer group of the
   * review's actions is answered on the item (see answerGroups.ts). Off when missing.
   */
  stayUntilGroupsAnswered?: boolean;
}

export interface VideoReview extends ReviewBase, MediaReviewSettings {
  entityType?: "video";
  actions: MediaReviewAction[];
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

/**
 * Audio reviews run one audio at a time: audios have nothing to show in a card grid, so the
 * multiple-item layouts, card annotations and tag bins stay video-only.
 */
export interface AudioReview extends ReviewBase, MediaReviewSettings {
  entityType: "audio";
  actions: MediaReviewAction[];
  presentation?: { cardSize?: number | null };
}

export type OccurrenceCondition =
  | "any"
  | "includes"
  | "includesAll"
  | "excludes"
  | "excludesAll"
  | "isNull";
export const OCCURRENCE_CONDITION_LABELS: Record<OccurrenceCondition, string> = {
  any: "Any occurrence tags",
  includes: "Has any selected tag",
  includesAll: "Has all selected tags",
  excludes: "Has none of the selected tags",
  excludesAll: "Missing at least one selected tag",
  isNull: "Has no occurrence tags",
};
export const OCCURRENCE_CONDITIONS = Object.keys(
  OCCURRENCE_CONDITION_LABELS,
) as OccurrenceCondition[];

/**
 * Conditions that look for missing tags. A recorded absence answers such an occurrence, and
 * each condition tag is a category a batch fills with one answer.
 */
export function conditionSeeksMissingTags(condition: OccurrenceCondition): boolean {
  return condition === "excludes" || condition === "excludesAll";
}

/** No selected performers and an empty performer filter both leave the scope unnarrowed. */
export function targetsAllPerformers(
  settings: Pick<OccurrenceReview["occurrence"], "targetMode" | "performerIds" | "performerFilter">,
): boolean {
  return (
    settings.targetMode === "all" ||
    (settings.targetMode === "selected" && settings.performerIds.length === 0) ||
    (settings.targetMode === "filter" && Object.keys(settings.performerFilter).length === 0)
  );
}

/**
 * A performer flag: a performer profile tag that flags the performers who carry it, and the
 * category it affects, that tag and everything under it (see attention.ts). Without a category the
 * flag affects the whole review.
 */
export interface PerformerFlag {
  tagId: number;
  categoryTagId?: number;
}

export interface OccurrenceReview extends ReviewBase, MediaReviewSettings {
  entityType: "performerOccurrence" | "audioPerformerOccurrence";
  actions: MediaReviewAction[];
  occurrence: {
    targetMode: "all" | "selected" | "filter";
    performerIds: number[];
    performerFilter: Record<string, unknown>;
    condition: OccurrenceCondition;
    conditionTagIds: number[];
    includeSubtags?: boolean;
    /**
     * With "excludes" or "excludesAll": hide occurrences whose missing condition tags are all
     * confirmed absent. Defaults to true.
     */
    hideConfirmedAbsent?: boolean;
    /** The review's performer flags; read them with performerFlags(), which reads both fields. */
    performerFlags?: PerformerFlag[];
    /**
     * Performer flags as older versions saved them: profile tags that flag a performer for the
     * whole review. Read as whole-review flags; the editor moves them to `performerFlags` once the
     * flags change.
     */
    flagPerformerTagIds?: number[];
    tagIds: number[];
    multiple: boolean;
  };
  presentation?: { cardSize?: number | null };
}

/**
 * A review's performer flags: its flag pairs, then the tags older versions saved as flags, each a
 * whole-review flag unless a pair says so already.
 */
export function performerFlags(
  settings: Pick<OccurrenceReview["occurrence"], "performerFlags" | "flagPerformerTagIds">,
): PerformerFlag[] {
  const flags = [...(settings.performerFlags ?? [])];
  for (const tagId of settings.flagPerformerTagIds ?? [])
    if (!flags.some((flag) => flag.tagId === tagId && flag.categoryTagId === undefined))
      flags.push({ tagId });
  return flags;
}

/**
 * The occurrence settings with these performer flags, kept in `performerFlags` only (the older
 * field goes) and without either field when there are none. A flag given twice is kept once.
 */
export function withPerformerFlags<S extends OccurrenceReview["occurrence"]>(
  settings: S,
  flags: readonly PerformerFlag[],
): S {
  const { performerFlags: _flags, flagPerformerTagIds: _older, ...rest } = settings;
  const kept: PerformerFlag[] = [];
  for (const flag of flags)
    if (
      !kept.some(
        (other) => other.tagId === flag.tagId && other.categoryTagId === flag.categoryTagId,
      )
    )
      kept.push(
        flag.categoryTagId === undefined
          ? { tagId: flag.tagId }
          : { tagId: flag.tagId, categoryTagId: flag.categoryTagId },
      );
  return (kept.length ? { ...rest, performerFlags: kept } : rest) as S;
}

export type Review = VideoReview | AudioReview | TagReview | OccurrenceReview;
/** Reviews that queue media items and run the single-item workspace or the card grid. */
export type MediaReview = VideoReview | AudioReview | OccurrenceReview;
export type ReviewEntityType =
  | "video"
  | "audio"
  | "tag"
  | "performerOccurrence"
  | "audioPerformerOccurrence";
export const REVIEW_ENTITY_TYPES: ReviewEntityType[] = [
  "video",
  "audio",
  "tag",
  "performerOccurrence",
  "audioPerformerOccurrence",
];
/** Which library entity a review's queue and writes address. */
export type MediaKind = "video" | "audio";

export function isOccurrenceReview(review: Review): review is OccurrenceReview {
  return (
    review.entityType === "performerOccurrence" ||
    review.entityType === "audioPerformerOccurrence"
  );
}

export function isMediaReview(review: Review): review is MediaReview {
  return reviewEntityType(review) !== "tag";
}

export function mediaKindOf(entityType: ReviewEntityType): MediaKind {
  return entityType === "audio" || entityType === "audioPerformerOccurrence"
    ? "audio"
    : "video";
}

export function reviewMediaKind(review: Review): MediaKind {
  return mediaKindOf(reviewEntityType(review));
}

/** Audios have no card grid, so only video reviews offer the multiple-item layouts. */
export function supportsMultipleReviewMode(review: Review): boolean {
  return reviewEntityType(review) === "video";
}

export function occurrenceAnswerSignature(review: OccurrenceReview): string {
  if (review.actions.length) return JSON.stringify(["actions", review.actions.map((action) => action.steps)]);
  return JSON.stringify([[...review.occurrence.tagIds].sort((a, b) => a - b), review.occurrence.multiple]);
}

export function reviewEntityType(review: Review): ReviewEntityType {
  return review.entityType ?? "video";
}

/**
 * Action keys in keyboard order, the order Auto fills them: the letter rows of a Finnish/Swedish
 * keyboard, skipping n and m (previous/next in the grid preview). None needs AltGr. The keys are
 * fixed: reviewKeys.ts registers them with Cove whatever keyboard preset the user has.
 */
export const ACTION_KEYS = [
  "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "å",
  "a", "s", "d", "f", "g", "h", "j", "k", "l", "ö", "ä",
  "z", "x", "c", "v", "b",
] as const;
export type ActionKey = (typeof ACTION_KEYS)[number];
/** The action keys by keyboard row: q…å, a…ä, z…b. */
export const ACTION_KEY_ROWS: ReadonlyArray<readonly ActionKey[]> = [
  ACTION_KEYS.slice(0, 11),
  ACTION_KEYS.slice(11, 22),
  ACTION_KEYS.slice(22),
];

/** The saved `shortcut` of an action without a key, reached only through Find action. */
export const NO_ACTION_KEY = "none";
/** How an action gets its key: pinned to one, none, or Auto (the next free key). */
export type ActionKeyChoice = ActionKey | typeof NO_ACTION_KEY | "auto";

export function isActionKey(value: unknown): value is ActionKey {
  return typeof value === "string" && (ACTION_KEYS as readonly string[]).includes(value);
}

/**
 * An action's saved `shortcut`, read: one of the action keys pins it there, "none" leaves it
 * without a key, and anything else (no value, or the digits older versions saved) is Auto.
 */
export function actionKeyChoice(action: Pick<ReviewAction, "shortcut">): ActionKeyChoice {
  const value = action.shortcut;
  return isActionKey(value) || value === NO_ACTION_KEY ? value : "auto";
}

/** Which key each of a review's actions has; see actionKeyMap. */
export interface ActionKeyMap {
  /** Each action's key, by its position among the review's actions; "" when it has none. */
  keys: ReadonlyArray<ActionKey | "">;
  /** The position of the action on each key that holds one. */
  actionOn: ReadonlyMap<ActionKey, number>;
  /**
   * Actions pinned to a key an earlier action is pinned to (imported or hand-edited data): the
   * earlier one keeps the key and these take a key as Auto does.
   */
  duplicatePins: ReadonlySet<number>;
}

/**
 * The keys of a review's actions. Pinned keys come first; a key pinned twice stays with the first
 * action. Then the Auto actions, in review order, take the free keys in keyboard order
 * (ACTION_KEYS; n and m are never used). Actions set to no key, and Auto actions past the last
 * free key, have none and are reached with Find action. Everything that shows, registers or
 * edits action keys reads them from here.
 */
export function actionKeyMap(actions: ReadonlyArray<Pick<ReviewAction, "shortcut">>): ActionKeyMap {
  const keys: Array<ActionKey | ""> = actions.map(() => "");
  const actionOn = new Map<ActionKey, number>();
  const duplicatePins = new Set<number>();
  const auto: number[] = [];
  actions.forEach((action, index) => {
    const choice = actionKeyChoice(action);
    if (choice === NO_ACTION_KEY) return;
    if (choice !== "auto") {
      if (!actionOn.has(choice)) {
        actionOn.set(choice, index);
        keys[index] = choice;
        return;
      }
      duplicatePins.add(index);
    }
    auto.push(index);
  });
  const free = ACTION_KEYS.filter((key) => !actionOn.has(key));
  auto.forEach((index, position) => {
    const key = free[position];
    if (key === undefined) return;
    keys[index] = key;
    actionOn.set(key, index);
  });
  return { keys, actionOn, duplicatePins };
}

/**
 * The actions after choosing one action's key. Choosing a key another action holds swaps them:
 * that action takes this one's pinned key, or turns Auto when this one had no pin of its own. Any
 * other action still pinned to a key that changes hands turns Auto, so each choice takes effect
 * as made. Auto clears the saved key; No key saves "none".
 */
export function withActionKey<A extends ReviewAction>(
  actions: readonly A[],
  index: number,
  choice: ActionKeyChoice,
): A[] {
  const { keys, actionOn } = actionKeyMap(actions);
  const settings = new Map<number, string | undefined>([[index, choice === "auto" ? undefined : choice]]);
  if (isActionKey(choice)) {
    const holder = actionOn.get(choice);
    const own = keys[index];
    if (holder !== undefined && holder !== index)
      settings.set(holder, own && actions[index].shortcut === own ? own : undefined);
  }
  const claimed = new Set([...settings.values()].filter(isActionKey));
  return actions.map((action, position) => {
    const setting = settings.has(position)
      ? settings.get(position)
      : isActionKey(action.shortcut) && claimed.has(action.shortcut)
        ? undefined
        : action.shortcut;
    if (setting === action.shortcut) return action;
    const { shortcut: _previous, ...rest } = action;
    return (setting === undefined ? rest : { ...rest, shortcut: setting }) as A;
  });
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
  if (isOccurrenceReview(review)) {
    if (!validOccurrenceSettings(review.occurrence))
      return "Complete the optional occurrence condition before saving.";
  }
  if (
    !supportsMultipleReviewMode(review) &&
    review.view.reviewMode === "multiple"
  )
    return "Only video reviews support the multiple-item layout.";
  if (
    reviewEntityType(review) !== "tag" &&
    review.actions.some((action) =>
      hasContradictoryAssessments(action as MediaReviewAction),
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

/**
 * Cove's audio list endpoint caps a page at 250 rows while the video one does not, so the queue's
 * own page arithmetic must use the size the server will actually apply.
 */
export const MEDIA_MAX_PER_PAGE: Record<MediaKind, number> = {
  video: 1000,
  audio: 250,
};

export function boundedFilter(
  filter: Record<string, unknown>,
  kind: MediaKind = "video",
): Record<string, unknown> {
  const positive = (value: unknown, fallback: number) =>
    Number.isFinite(Number(value)) && Number(value) > 0
      ? Math.floor(Number(value))
      : fallback;
  return {
    ...filter,
    page: Math.max(1, positive(filter.page, 1)),
    perPage: Math.max(
      1,
      Math.min(MEDIA_MAX_PER_PAGE[kind], positive(filter.perPage, 40)),
    ),
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
    isOccurrenceReview(review)
      ? [review.entityType, ...signature, review.occurrence]
      : reviewEntityType(review) === "video"
        ? signature
        : [reviewEntityType(review), ...signature],
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

function isOccurrenceEntityType(value: unknown): boolean {
  return value === "performerOccurrence" || value === "audioPerformerOccurrence";
}

export function isAssessmentMode(mode: ReviewStep["mode"]): boolean {
  return ["MARK_PRESENT", "MARK_ABSENT", "CLEAR_ABSENCE"].includes(mode);
}

/** The tags an action adds, including the ones it marks present. */
export function tagsAddedBy(action: MediaReviewAction): Set<number> {
  return new Set(
    action.steps
      .filter((step) => step.mode === "ADD" || step.mode === "MARK_PRESENT")
      .flatMap((step) => step.tagIds),
  );
}

/**
 * Whether applying the action can stay on the item: an action without steps changes nothing and
 * only moves on, so the Stay on this item switch leaves it moving on.
 */
export function canApplyAndStay(action: ReviewAction): boolean {
  return "steps" in action && action.steps.length > 0;
}

export function hasAssessmentSteps(action: ReviewAction): boolean {
  if (!("steps" in action)) return false;
  return action.steps.some((step) => isAssessmentMode(step.mode));
}

/** Whether one of the action's tags is both marked present and absent, or cleared and marked. */
export function hasContradictoryAssessments(action: MediaReviewAction): boolean {
  const assessments = new Map<number, ReviewStep["mode"]>();
  for (const step of action.steps) {
    if (!isAssessmentMode(step.mode))
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
          REVIEW_ENTITY_TYPES.includes(review.entityType)) &&
        (!isOccurrenceEntityType(review.entityType) ||
          validOccurrenceSettings(review.occurrence)) &&
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
        (review.view.reviewMode !== "multiple" ||
          (review.entityType ?? "video") === "video") &&
        (review.view.selectAllOnLoad === undefined ||
          typeof review.view.selectAllOnLoad === "boolean") &&
        review.view.filter &&
        typeof review.view.filter === "object" &&
        !Array.isArray(review.view.filter) &&
        review.view.objectFilter &&
        typeof review.view.objectFilter === "object" &&
        !Array.isArray(review.view.objectFilter) &&
        validPresentation(
          review.presentation,
          (review.entityType ?? "video") !== "video",
        ) &&
        (review.importNotes === undefined ||
          (Array.isArray(review.importNotes) &&
            review.importNotes.every(
              (note: unknown) => typeof note === "string",
            ))) &&
        // Answer groups belong to actions that write tags; tag reviews have neither.
        (review.stayUntilGroupsAnswered === undefined ||
          (typeof review.stayUntilGroupsAnswered === "boolean" &&
            review.entityType !== "tag")) &&
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
                !("group" in action) &&
                validAction(action, "tag")
              : "steps" in action &&
                !("effect" in action) &&
                Array.isArray(action.steps) &&
                action.steps.every(
                  (step) => step && Array.isArray(step.tagIds),
                ) &&
                (action.group === undefined || typeof action.group === "string") &&
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

/** Card annotations and tag bins belong to the video card grid; no other review kind renders one. */
function validPresentation(value: unknown, gridless: boolean): boolean {
  if (value === undefined) return true;
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const settings = value as NonNullable<VideoReview["presentation"]>;
  return (
    (settings.cardSize === undefined ||
      settings.cardSize === null ||
      (Number.isFinite(settings.cardSize) &&
        settings.cardSize >= 115 &&
        settings.cardSize <= 380)) &&
    (!gridless ||
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

/**
 * The name of a review's copy: "<name> copy", else "<name> copy 2", "<name> copy 3", …, the first
 * that no review has (names compared trimmed, ignoring case). A copy's copy numbers on from the
 * same name, "<name> copy" giving "<name> copy 2" rather than "<name> copy copy", while a review
 * named "<name>" is there; otherwise a trailing " copy" or " copy N" belongs to the name itself
 * ("<name> copy 2024" gives "<name> copy 2024 copy").
 */
export function copyName(name: string, reviews: readonly Review[]): string {
  const key = (value: string) => value.trim().toLocaleLowerCase();
  const taken = new Set(reviews.map((review) => key(review.name)));
  const trimmed = name.trim();
  const stem = trimmed.replace(/ copy(?: \d+)?$/i, "");
  const base = `${stem !== trimmed && taken.has(key(stem)) ? stem : trimmed} copy`;
  for (let number = 1; ; number++) {
    const candidate = number === 1 ? base : `${base} ${number}`;
    if (!taken.has(key(candidate))) return candidate;
  }
}

/** Duplicate: the review as saved under a new id and its copy's name. */
export function duplicateReview(source: Review, reviews: readonly Review[], id: string): Review {
  return { ...structuredClone(source), id, name: copyName(source.name, reviews) };
}

function validOccurrenceSettings(value: unknown): boolean {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const settings = value as OccurrenceReview["occurrence"];
  const ids = (value: unknown): value is number[] => Array.isArray(value) &&
    value.every((id) => Number.isSafeInteger(id) && id > 0) && new Set(value).size === value.length;
  return ["all", "selected", "filter"].includes(settings.targetMode) &&
    ids(settings.performerIds) &&
    !!settings.performerFilter && typeof settings.performerFilter === "object" && !Array.isArray(settings.performerFilter) &&
    OCCURRENCE_CONDITIONS.includes(settings.condition) &&
    ids(settings.conditionTagIds) && (["any", "isNull"].includes(settings.condition) || settings.conditionTagIds.length > 0) &&
    (settings.includeSubtags === undefined || typeof settings.includeSubtags === "boolean") &&
    (settings.hideConfirmedAbsent === undefined || typeof settings.hideConfirmedAbsent === "boolean") &&
    (settings.performerFlags === undefined || validPerformerFlags(settings.performerFlags)) &&
    (settings.flagPerformerTagIds === undefined || ids(settings.flagPerformerTagIds)) &&
    ids(settings.tagIds) && typeof settings.multiple === "boolean";
}

/** Flag pairs: a positive tag id each, an optional positive category tag id, no pair twice. */
function validPerformerFlags(value: unknown): boolean {
  if (!Array.isArray(value)) return false;
  const positive = (id: unknown) => Number.isSafeInteger(id) && (id as number) > 0;
  const seen = new Set<string>();
  return value.every((flag: unknown) => {
    if (!flag || typeof flag !== "object" || Array.isArray(flag)) return false;
    const { tagId, categoryTagId } = flag as Record<string, unknown>;
    if (!positive(tagId) || (categoryTagId !== undefined && !positive(categoryTagId)))
      return false;
    const key = `${tagId}:${categoryTagId ?? ""}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

// Gates the grid's Space and Enter, which plain buttons and links need for
// themselves. Escape uses isReviewEscapeTarget, arrows the narrower
// isReviewGridArrowTarget. Action letters, Find action and select all are
// fixed keys dispatched by Cove (see reviewKeys.ts) and are not gated here.
export function isReviewShortcutTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !target.closest(
    'input, textarea, select, button, a, video, [contenteditable="true"], [role="combobox"], [data-review-player-controls]',
  );
}

/**
 * Escape clears the grid selection after focus drifts to the page body or to
 * the extension's own controls: cards, the action bar, the header's pager and
 * the review preview. Host-owned widgets inside the page (the list toolbar,
 * filter chips, dialogs) and text entry keep their Escape, so an allowlist of
 * extension surfaces is used rather than a guess at host markup.
 */
export function isReviewEscapeTarget(
  target: EventTarget | null,
): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target === document.body || target === document.documentElement)
    return true;
  if (
    !target.closest(
      ".dq-review-card, .dq-grid, .dq-tag-list, .dq-action-bar, .dq-pager, .dq-preview",
    )
  )
    return false;
  return !target.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="menu"], [role="dialog"]:not(.dq-preview), [aria-modal="true"]:not(.dq-preview), [data-review-player-controls]',
  );
}

/**
 * Whether the element takes typed keys itself, as Cove's keyboard dispatch sees it (inputs,
 * text areas, selects and editable content), so action keys stay out of it. Focus is never
 * moved away from such an element to a card.
 */
export function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement) || !target.isConnected) return false;
  return (
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
    target.isContentEditable ||
    target.closest('[contenteditable]:not([contenteditable="false"])') != null
  );
}

/**
 * Arrow keys keep navigating the review grid wherever focus has drifted,
 * including the page body and plain controls such as buttons and links.
 * Only elements with their own arrow-key semantics keep them.
 */
export function isReviewGridArrowTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return !target.closest(
    'input, textarea, select, video, [contenteditable]:not([contenteditable="false"]), [role="combobox"], [role="listbox"], [role="option"], [role="menu"], [role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"], [role="radiogroup"], [role="slider"], [role="tablist"], [role="tree"], [role="dialog"], [role="alertdialog"], [aria-modal="true"], [data-review-player-controls]',
  );
}

export function reviewGridArrowDelta(key: string, columns: number): number {
  switch (key) {
    case "ArrowLeft":
      return -1;
    case "ArrowRight":
      return 1;
    case "ArrowUp":
      return -columns;
    case "ArrowDown":
      return columns;
    default:
      return 0;
  }
}
