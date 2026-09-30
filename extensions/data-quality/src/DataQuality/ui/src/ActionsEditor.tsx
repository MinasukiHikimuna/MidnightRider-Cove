import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  EntityReferenceMultiSelector,
  SortableList,
  type DragHandleProps,
} from "@cove/runtime/components";
import {
  AlertTriangle,
  ChevronDown,
  Copy,
  GripVertical,
  Plus,
  Search,
  Trash2,
  X,
} from "@cove/runtime/lucide-react";
import type { TagGroup } from "./api";
import { ActionsFromTags } from "./ActionsFromTags";
import { actionGroups, groupKey, unanswerableGroups } from "./answerGroups";
import type { TagTrees } from "./effectPreview";
import { actionEffectParts, actionTagIds } from "./FindAction";
import { GroupField } from "./GroupField";
import { ActionKeyButton } from "./KeyPicker";
import {
  hasContradictoryAssessments,
  isComposingKey,
  isOccurrenceReview,
  NO_ACTION_KEY,
  reviewEntityType,
  validAction,
  withActionKey,
  type MediaReview,
  type MediaReviewAction,
  type Review,
  type ReviewAction,
  type ReviewEntityType,
  type ReviewStep,
  type TagReviewAction,
} from "./model";
import { useActionKeyMap } from "./reviewKeys";
import { useTagNames } from "./tagNames";

const STEP_MODES: ReadonlyArray<{ mode: ReviewStep["mode"]; label: string }> = [
  { mode: "ADD", label: "Add tags" },
  { mode: "REMOVE", label: "Remove tags" },
  { mode: "REMOVE_TREE", label: "Remove tags and descendants" },
  { mode: "MARK_PRESENT", label: "Mark present" },
  { mode: "MARK_ABSENT", label: "Mark absent" },
  { mode: "CLEAR_ABSENCE", label: "Clear absence" },
];

/** Whether a step's tags come on or go; the chosen operation says so in words as well. */
function stepTone(mode: ReviewStep["mode"]): "add" | "remove" | "neutral" {
  if (mode === "ADD" || mode === "MARK_PRESENT") return "add";
  if (mode === "CLEAR_ABSENCE") return "neutral";
  return "remove";
}

/** What keeps an action from being saved, in a few words; "" when it can be saved. */
export function actionProblem(action: ReviewAction, entityType: ReviewEntityType): string {
  if (validAction(action, entityType)) return "";
  if (!action.label.trim()) return "Needs a label";
  if ("steps" in action) {
    if (action.steps.some((step) => !step.tagIds.length)) return "A step has no tags";
    if (hasContradictoryAssessments(action)) return "Contradictory assessments";
  }
  return "Incomplete";
}

/**
 * Cove's drag handles ask for a 44 px touch target; the compact rows keep theirs to the row and
 * leave the size to the stylesheet.
 */
function compactHandle(style: CSSProperties | undefined): CSSProperties {
  return { ...style, minWidth: undefined, minHeight: undefined };
}

function newAction(entityType: ReviewEntityType): ReviewAction {
  return entityType === "tag"
    ? { id: crypto.randomUUID(), label: "", effect: { mode: "SKIP" } }
    : { id: crypto.randomUUID(), label: "", steps: [] };
}

/**
 * The review's actions as compact rows in review order: drag handle, key, label, answer group
 * and what the action changes, with duplicate, delete and expand. The key opens the key picker,
 * which pins the action to a key, leaves it to Auto (the next free key in keyboard order) or gives
 * it none. One action at a time opens in full to edit its label, group and ordered steps (or, in
 * tag reviews, its effect). Find an action narrows the rows by label; reordering, by dragging a
 * handle or Alt + ↑/↓ on it, works on the full list only. Media reviews also choose here whether
 * an item waits for every answer group (answerGroups.ts).
 */
export function ActionsEditor({
  review,
  onChange,
  tagGroups,
  trees,
  saving,
  expandedId,
  onExpand,
  reveal,
}: {
  review: Review;
  onChange(review: Review): void;
  tagGroups: readonly TagGroup[];
  /** Resolved removal trees, for "− rest of <tree>" wording. */
  trees: TagTrees;
  saving: boolean;
  /** The action shown in full, or null. */
  expandedId: string | null;
  onExpand(id: string | null): void;
  /** Changes when the expanded action's label should take focus, as after a refused save. */
  reveal: number;
}) {
  const entityType = reviewEntityType(review);
  const media = entityType !== "tag";
  const actions = review.actions as readonly ReviewAction[];
  const keyMap = useActionKeyMap(actions);
  const names = useTagNames(useMemo(() => actionTagIds(actions), [actions]));
  // The groups the actions name, each once as first spelled: the group field's list.
  const groupNames = useMemo(
    () => (media ? actionGroups(actions as readonly MediaReviewAction[]).map((group) => group.name) : []),
    [media, actions],
  );
  // Those the other actions name, for the open action's group field: a typed name none of them has
  // is a new group.
  const expandedIndex = actions.findIndex((action) => action.id === expandedId);
  const otherGroupNames = useMemo(
    () =>
      media && expandedIndex >= 0
        ? actionGroups(
            (actions as readonly MediaReviewAction[]).filter((_, index) => index !== expandedIndex),
          ).map((group) => group.name)
        : [],
    [media, actions, expandedIndex],
  );
  const staysForGroups = media && (review as MediaReview).stayUntilGroupsAnswered === true;
  // A group none of whose actions can answer it would hold every item until skipped.
  const unanswerable = useMemo(
    () =>
      new Set(
        staysForGroups
          ? unanswerableGroups(actions as readonly MediaReviewAction[]).map((group) => group.key)
          : [],
      ),
    [staysForGroups, actions],
  );
  const [filter, setFilter] = useState("");
  const [fromTags, setFromTags] = useState(false);
  // The confirmation lasts until the actions change again.
  const [added, setAdded] = useState<{ actions: readonly ReviewAction[]; count: number } | null>(
    null,
  );
  const baseId = useId();
  const fromTagsPanel = `${baseId}-from-tags`;
  const fromTagsButton = useRef<HTMLButtonElement>(null);
  const addButton = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  // Where focus goes once the rows have rendered: a row's label field or its expand button, or
  // Add action when no row is left.
  const pendingFocus = useRef<{ id: string; part: "label" | "toggle" } | "add" | null>(null);
  // Steps have no ids; each keeps a generated key while it is edited, moved or reordered.
  const stepKeys = useRef(new WeakMap<ReviewStep, string>());
  const stepKey = (step: ReviewStep): string => {
    let key = stepKeys.current.get(step);
    if (!key) {
      key = crypto.randomUUID();
      stepKeys.current.set(step, key);
    }
    return key;
  };

  const needle = filter.trim().toLocaleLowerCase();
  const shown = needle
    ? actions.filter((action) => action.label.toLocaleLowerCase().includes(needle))
    : actions;

  const update = (next: readonly ReviewAction[]) =>
    onChange({ ...review, actions: next } as Review);
  const replace = (index: number, action: ReviewAction) =>
    update(actions.map((item, itemIndex) => (itemIndex === index ? action : item)));

  function rowElement(id: string): HTMLElement | undefined {
    return [...(list.current?.querySelectorAll<HTMLElement>("[data-action-id]") ?? [])].find(
      (row) => row.dataset.actionId === id,
    );
  }
  function focusRow(id: string, part: "label" | "toggle") {
    const row = rowElement(id);
    const target = row?.querySelector<HTMLElement>(
      part === "label" ? ".dq-action-label-input" : ".dq-action-toggle",
    );
    target?.focus();
    return Boolean(target);
  }
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === "add" || !focusRow(target.id, target.part)) addButton.current?.focus();
  });
  useEffect(() => {
    if (!reveal || !expandedId) return;
    // An action that Find an action hides is shown again first.
    if (shown.some((action) => action.id === expandedId)) focusRow(expandedId, "label");
    else {
      setFilter("");
      pendingFocus.current = { id: expandedId, part: "label" };
    }
    // Only a new request moves focus; expanding by hand leaves it where it is.
  }, [reveal]);

  function addAction() {
    const action = newAction(entityType);
    setFilter("");
    update([...actions, action]);
    onExpand(action.id);
    pendingFocus.current = { id: action.id, part: "label" };
  }
  function duplicate(index: number) {
    const action = actions[index];
    // A key holds one action: the copy of a pinned action starts on Auto, and one without a key
    // stays without.
    const { shortcut, ...copied } = structuredClone(action);
    const copy = {
      ...copied,
      ...(shortcut === NO_ACTION_KEY ? { shortcut } : {}),
      id: crypto.randomUUID(),
      label: `${action.label} copy`,
    };
    update([...actions.slice(0, index + 1), copy, ...actions.slice(index + 1)]);
    onExpand(copy.id);
    pendingFocus.current = { id: copy.id, part: "label" };
  }
  function remove(index: number) {
    const action = actions[index];
    const position = shown.indexOf(action);
    const neighbour = shown[position + 1] ?? shown[position - 1];
    update(actions.filter((_, itemIndex) => itemIndex !== index));
    if (expandedId === action.id) onExpand(null);
    pendingFocus.current = neighbour ? { id: neighbour.id, part: "toggle" } : "add";
  }
  function closeFromTags() {
    setFromTags(false);
    requestAnimationFrame(() => fromTagsButton.current?.focus());
  }

  return (
    <div className="dq-actions-editor">
      <div className="dq-actions-head">
        <div className="dq-actions-toolbar">
          <button
            ref={addButton}
            type="button"
            className="dq-header-button"
            onClick={addAction}
          >
            <Plus aria-hidden="true" />
            Add action
          </button>
          {media && (
            <button
              ref={fromTagsButton}
              type="button"
              className="dq-header-button"
              aria-expanded={fromTags}
              aria-controls={fromTags ? fromTagsPanel : undefined}
              onClick={() => {
                setAdded(null);
                setFromTags(!fromTags);
              }}
            >
              Add from parent tags…
            </button>
          )}
          <label className="dq-actions-filter">
            <Search aria-hidden="true" />
            <input
              type="search"
              aria-label="Find an action"
              placeholder="Find an action…"
              autoComplete="off"
              spellCheck={false}
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              onKeyDown={(event: ReactKeyboardEvent<HTMLInputElement>) => {
                // Esc empties the filter first; only an empty one lets Esc reach the drawer.
                if (event.key === "Escape" && filter && !isComposingKey(event)) {
                  event.preventDefault();
                  event.stopPropagation();
                  setFilter("");
                }
              }}
            />
          </label>
        </div>
        <p className="dq-actions-hint">
          Choose a key on its key cap; Auto takes the next free key in this order. Drag a handle,
          or press Alt + ↑ / ↓, to reorder.
        </p>
        {media && (
          <div className="dq-actions-groups">
            <label className="dq-checkbox">
              <input
                type="checkbox"
                checked={staysForGroups}
                aria-describedby={`${baseId}-groups-note`}
                onChange={(event) =>
                  onChange({
                    ...review,
                    stayUntilGroupsAnswered: event.target.checked ? true : undefined,
                  } as Review)
                }
              />
              Stay until every group is answered
            </label>
            <p className="dq-actions-hint" id={`${baseId}-groups-note`}>
              {staysForGroups && !groupNames.length
                ? "No action has a group yet: give the actions of each question the same group."
                : "Single-item view: a plain action moves on once every group has an answer."}
            </p>
          </div>
        )}
        <span role="status" className="dq-actions-status">
          {added?.actions === actions
            ? `Added ${added.count} action${added.count === 1 ? "" : "s"} at the end.`
            : ""}
        </span>
      </div>
      {media && fromTags && (
        // Esc closes this panel before it can reach the drawer, whose Esc would lose the parents
        // and ticks chosen here. An Esc that cancels a composition belongs to the input method.
        <div
          onKeyDown={(event) => {
            if (event.key !== "Escape" || event.defaultPrevented || isComposingKey(event)) return;
            event.preventDefault();
            event.stopPropagation();
            closeFromTags();
          }}
        >
          <ActionsFromTags
            id={fromTagsPanel}
            review={review as MediaReview}
            disabled={saving}
            onAdd={(generated) => {
              const next = [...actions, ...generated];
              update(next);
              setAdded({ actions: next, count: generated.length });
              closeFromTags();
            }}
            onCancel={closeFromTags}
          />
        </div>
      )}
      <div ref={list}>
        {shown.length > 0 && (
          <SortableList
            items={shown as ReviewAction[]}
            getKey={(action) => action.id}
            // Reordering a filtered list would move actions past ones that are not shown.
            disabled={saving || Boolean(needle)}
            className="dq-action-list"
            onReorder={(next) => update(next)}
            renderItem={(action, { dragHandleProps, isOver }) => {
              const index = actions.indexOf(action);
              const open = expandedId === action.id;
              return (
                <ActionRow
                  action={action}
                  entityType={entityType}
                  keyButton={
                    <ActionKeyButton
                      actions={actions}
                      index={index}
                      keyMap={keyMap}
                      name={action.label.trim() || "New action"}
                      onChoose={(choice) => update(withActionKey(actions, index, choice))}
                    />
                  }
                  takenPin={keyMap.duplicatePins.has(index) ? action.shortcut : undefined}
                  groupUnanswerable={
                    "steps" in action && unanswerable.has(groupKey(action.group))
                  }
                  effect={actionEffectParts(action, names, tagGroups, trees)}
                  open={open}
                  detailId={`${baseId}-detail-${action.id}`}
                  dragHandleProps={dragHandleProps}
                  isOver={isOver}
                  reorderDisabled={saving || Boolean(needle)}
                  onToggle={() => onExpand(open ? null : action.id)}
                  onDuplicate={() => duplicate(index)}
                  onDelete={() => remove(index)}
                >
                  {"steps" in action ? (
                    <MediaActionDetail
                      action={action}
                      groupNames={groupNames}
                      otherGroupNames={otherGroupNames}
                      occurrence={isOccurrenceReview(review)}
                      saving={saving}
                      stepKey={stepKey}
                      rememberStepKey={(next, previous) =>
                        stepKeys.current.set(next, stepKey(previous))
                      }
                      onChange={(next) => replace(index, next)}
                    />
                  ) : (
                    <TagActionDetail
                      action={action}
                      tagGroups={tagGroups}
                      onChange={(next) => replace(index, next)}
                    />
                  )}
                </ActionRow>
              );
            }}
          />
        )}
      </div>
      {!actions.length ? (
        <p className="dq-actions-empty">
          {media
            ? "No actions yet. Add one, or add them from parent tags."
            : "No actions yet."}
        </p>
      ) : (
        !shown.length && (
          <p className="dq-actions-empty" role="status">
            No action matches “{filter.trim()}”.
          </p>
        )
      )}
    </div>
  );
}

function ActionRow({
  action,
  entityType,
  keyButton,
  takenPin,
  groupUnanswerable = false,
  effect,
  open,
  detailId,
  dragHandleProps,
  isOver,
  reorderDisabled,
  onToggle,
  onDuplicate,
  onDelete,
  children,
}: {
  action: ReviewAction;
  entityType: ReviewEntityType;
  /** The action's key, as a button that opens the key picker. */
  keyButton: ReactNode;
  /** A key the action is pinned to that an earlier action is pinned to as well. */
  takenPin?: string;
  /** The review waits for its groups, and no action of this action's group can answer it. */
  groupUnanswerable?: boolean;
  effect: ReturnType<typeof actionEffectParts>;
  open: boolean;
  detailId: string;
  dragHandleProps: DragHandleProps;
  isOver: boolean;
  reorderDisabled: boolean;
  onToggle(): void;
  onDuplicate(): void;
  onDelete(): void;
  children: ReactNode;
}) {
  const name = action.label.trim() || "New action";
  const problem = actionProblem(action, entityType);
  const group = "steps" in action && groupKey(action.group) ? action.group!.trim() : "";
  return (
    <div
      className={`dq-action-row${open ? " dq-action-row-open" : ""}${isOver ? " dq-drag-over" : ""}`}
      data-action-id={action.id}
    >
      <div className="dq-action-row-head">
        <button
          type="button"
          {...dragHandleProps}
          style={compactHandle(dragHandleProps.style)}
          className="dq-drag-handle"
          aria-label={`Reorder ${name}`}
          title={reorderDisabled ? "Clear the filter to reorder" : "Drag, or Alt + ↑ / ↓, to reorder"}
          disabled={reorderDisabled}
        >
          <GripVertical aria-hidden="true" />
        </button>
        {keyButton}
        {/* A click on the name or the summary opens the action too; the button at the end is the
            control for keyboards and assistive technology. */}
        <div className="dq-action-row-summary" onClick={onToggle}>
          <span className="dq-action-row-label" title={name}>
            {name}
          </span>
          {group && (
            <span className="dq-action-row-group" title={`Group: ${group}`}>
              <span className="dq-sr-only">Group: </span>
              {group}
            </span>
          )}
          {!open && (
            <span className="dq-action-row-effect">
              {effect.map((part, position) => (
                <span key={position} data-effect-tone={part.tone}>
                  {part.text}
                </span>
              ))}
            </span>
          )}
          {problem && (
            <span className="dq-action-problem">
              <AlertTriangle aria-hidden="true" />
              {problem}
            </span>
          )}
          {takenPin && (
            <span
              className="dq-action-problem"
              title={`An earlier action is pinned to ${takenPin.toLocaleUpperCase()} too, so this one takes a free key as Auto does. Choose its key to settle it.`}
            >
              <AlertTriangle aria-hidden="true" />
              {`${takenPin.toLocaleUpperCase()} is pinned twice`}
            </span>
          )}
          {groupUnanswerable && (
            <span
              className="dq-action-problem"
              title="No action in this group adds a tag or marks one absent, so the group is never answered and items wait there until skipped."
            >
              <AlertTriangle aria-hidden="true" />
              {`${group} can't be answered`}
            </span>
          )}
        </div>
        <button
          type="button"
          className="dq-icon-button dq-icon-button-small"
          aria-label={`Duplicate ${name}`}
          title="Duplicate"
          onClick={onDuplicate}
        >
          <Copy aria-hidden="true" />
        </button>
        <button
          type="button"
          className="dq-icon-button dq-icon-button-small"
          aria-label={`Delete ${name}`}
          title="Delete"
          onClick={onDelete}
        >
          <Trash2 aria-hidden="true" />
        </button>
        <button
          type="button"
          className="dq-icon-button dq-icon-button-small dq-action-toggle"
          aria-label={`${open ? "Collapse" : "Expand"} ${name}`}
          aria-expanded={open}
          aria-controls={open ? detailId : undefined}
          onClick={onToggle}
        >
          <ChevronDown aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div id={detailId} className="dq-action-detail">
          {children}
        </div>
      )}
    </div>
  );
}

function LabelField({
  action,
  onChange,
}: {
  action: ReviewAction;
  onChange(label: string): void;
}) {
  return (
    <label className="dq-action-field">
      <span className="dq-action-field-name">Button label</span>
      <input
        className="dq-input dq-action-label-input"
        value={action.label}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function MediaActionDetail({
  action,
  groupNames,
  otherGroupNames,
  occurrence,
  saving,
  stepKey,
  rememberStepKey,
  onChange,
}: {
  action: MediaReviewAction;
  /** The groups the review's actions name, for the group field's list. */
  groupNames: readonly string[];
  /** The groups the review's other actions name. */
  otherGroupNames: readonly string[];
  /** An occurrence review's action, whose groups also decide where answers can be mixed. */
  occurrence: boolean;
  saving: boolean;
  stepKey(step: ReviewStep): string;
  rememberStepKey(next: ReviewStep, previous: ReviewStep): void;
  onChange(action: MediaReviewAction): void;
}) {
  const stepsLabel = useId();
  const steps = useRef<HTMLDivElement>(null);
  // A step just added takes focus in its tag field, the next thing to fill in.
  const focusStep = useRef<number | null>(null);
  useLayoutEffect(() => {
    const index = focusStep.current;
    if (index == null) return;
    focusStep.current = null;
    steps.current
      ?.querySelector<HTMLElement>(`[data-step-index="${index}"] input`)
      ?.focus();
  });
  const setSteps = (next: ReviewStep[]) => onChange({ ...action, steps: next });
  return (
    <>
      <LabelField action={action} onChange={(label) => onChange({ ...action, label })} />
      <GroupField
        action={action}
        groupNames={groupNames}
        otherGroupNames={otherGroupNames}
        occurrence={occurrence}
        onChange={onChange}
      />
      <div className="dq-action-field dq-action-field-top" role="group" aria-labelledby={stepsLabel}>
        <span className="dq-action-field-name" id={stepsLabel}>
          Steps
        </span>
        <div className="dq-steps" ref={steps}>
          {action.steps.length > 0 ? (
            <SortableList
              items={action.steps}
              getKey={stepKey}
              disabled={saving}
              className="dq-step-list"
              onReorder={setSteps}
              renderItem={(step, { index, dragHandleProps, isOver }) => (
                <StepRow
                  step={step}
                  index={index}
                  dragHandleProps={dragHandleProps}
                  isOver={isOver}
                  saving={saving}
                  onChange={(next) => {
                    rememberStepKey(next, step);
                    setSteps(action.steps.map((item, itemIndex) => (itemIndex === index ? next : item)));
                  }}
                  onRemove={() => setSteps(action.steps.filter((_, itemIndex) => itemIndex !== index))}
                />
              )}
            />
          ) : (
            <p className="dq-drawer-note">No steps: the action skips the item.</p>
          )}
          <button
            type="button"
            className="dq-add-step"
            onClick={() => {
              focusStep.current = action.steps.length;
              setSteps([...action.steps, { mode: "ADD", tagIds: [] }]);
            }}
          >
            <Plus aria-hidden="true" />
            Add step
          </button>
          <p className="dq-drawer-note">
            Steps run in order; if one fails, earlier ones stay applied. Removing tags and
            descendants never removes a tag the same action adds.
          </p>
        </div>
      </div>
    </>
  );
}

function StepRow({
  step,
  index,
  dragHandleProps,
  isOver,
  saving,
  onChange,
  onRemove,
}: {
  step: ReviewStep;
  index: number;
  dragHandleProps: DragHandleProps;
  isOver: boolean;
  saving: boolean;
  onChange(step: ReviewStep): void;
  onRemove(): void;
}) {
  const number = index + 1;
  return (
    <div
      className={`dq-step${isOver ? " dq-drag-over" : ""}`}
      data-step-tone={stepTone(step.mode)}
      data-step-index={index}
    >
      <button
        type="button"
        {...dragHandleProps}
        style={compactHandle(dragHandleProps.style)}
        className="dq-step-handle"
        aria-label={`Reorder step ${number}`}
        title="Drag, or Alt + ↑ / ↓, to reorder"
        disabled={saving}
      >
        <GripVertical aria-hidden="true" />
        <span aria-hidden="true">{number}</span>
      </button>
      <select
        className="dq-select dq-step-mode"
        aria-label={`Step ${number} operation`}
        value={step.mode}
        onChange={(event) =>
          onChange({ ...step, mode: event.target.value as ReviewStep["mode"] })
        }
      >
        {STEP_MODES.map(({ mode, label }) => (
          <option key={mode} value={mode}>
            {label}
          </option>
        ))}
      </select>
      <EntityReferenceMultiSelector
        entityType="tag"
        values={step.tagIds}
        onChange={(tagIds) => onChange({ ...step, tagIds })}
        placeholder="Add tag…"
        inputAriaLabel={`Add a tag to step ${number}`}
        containerClassName="dq-chip-input dq-step-tags"
        inputClassName="dq-chip-input-field"
        allowCreate={false}
        disabled={saving}
      />
      <button
        type="button"
        className="dq-icon-button dq-icon-button-small"
        aria-label={`Remove step ${number}`}
        title="Remove step"
        onClick={onRemove}
      >
        <X aria-hidden="true" />
      </button>
    </div>
  );
}

function TagActionDetail({
  action,
  tagGroups,
  onChange,
}: {
  action: TagReviewAction;
  tagGroups: readonly TagGroup[];
  onChange(action: TagReviewAction): void;
}) {
  const effect = action.effect;
  const value = effect.mode === "SET_TAG_GROUP" ? `group:${effect.tagGroupId}` : effect.mode;
  const unavailable =
    effect.mode === "SET_TAG_GROUP" && !tagGroups.some((group) => group.id === effect.tagGroupId);
  return (
    <>
      <LabelField action={action} onChange={(label) => onChange({ ...action, label })} />
      <label className="dq-action-field">
        <span className="dq-action-field-name">Effect</span>
        <select
          className="dq-select"
          aria-label="Tag group action"
          value={value}
          onChange={(event) => {
            const next = event.target.value;
            onChange({
              ...action,
              effect:
                next === "SKIP"
                  ? { mode: "SKIP" }
                  : next === "CLEAR_TAG_GROUP"
                    ? { mode: "CLEAR_TAG_GROUP" }
                    : { mode: "SET_TAG_GROUP", tagGroupId: Number(next.slice("group:".length)) },
            });
          }}
        >
          <option value="SKIP">Skip</option>
          <option value="CLEAR_TAG_GROUP">Ungrouped</option>
          {unavailable && (
            <option value={value} disabled>
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
    </>
  );
}
