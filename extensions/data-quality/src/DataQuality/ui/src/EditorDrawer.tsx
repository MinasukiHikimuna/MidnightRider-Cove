import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import {
  EntityDetailTabs,
  EntityReferenceMultiSelector,
} from "@cove/runtime/components";
import { AlertTriangle, X } from "@cove/runtime/lucide-react";
import type { TagGroup } from "./api";
import { ActionsEditor } from "./ActionsEditor";
import type { TagTrees } from "./effectPreview";
import { PerformerFlagSettings, TagChoiceSettings } from "./OccurrenceReview";
import { REVIEW_KIND_NAMES } from "./ReviewEntityIcon";
import { exportReview } from "./reviewFiles";
import {
  isOccurrenceReview,
  REVIEW_ENTITY_TYPES,
  reviewEntityType,
  reviewValidation,
  validAction,
  type Review,
  type ReviewAction,
  type ReviewEntityType,
  type ReviewView,
  type VideoReview,
} from "./model";

type DrawerTab = "Review" | "Appearance" | "Actions" | "Tag choices";
type Direction = "beginning" | "end";

/**
 * A review as Save would store it, for telling whether the draft changed: key order, fields left
 * undefined and the queue's current page do not count.
 */
export function draftSignature(review: Review): string {
  const { page: _page, ...filter } = review.view.filter;
  return JSON.stringify({ ...review, view: { ...review.view, filter } }, (_key, value) =>
    value && typeof value === "object" && !Array.isArray(value)
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, (value as Record<string, unknown>)[key]]),
        )
      : value,
  );
}

/** Name, description and kind of a review: the drawer's Review tab and the new-review form. */
export function ReviewDetailsFields({
  review,
  onChange,
  entityTypeLocked,
  onEntityTypeChange,
  nameRef,
  autoFocus = false,
}: {
  review: Review;
  onChange(review: Review): void;
  entityTypeLocked: boolean;
  onEntityTypeChange?(entityType: ReviewEntityType): void;
  nameRef?: RefObject<HTMLInputElement | null>;
  autoFocus?: boolean;
}) {
  return (
    <>
      <label className="dq-drawer-field">
        <span>Entity type</span>
        <select
          className="dq-select"
          aria-label="Entity type"
          value={reviewEntityType(review)}
          disabled={entityTypeLocked}
          onChange={(event) => onEntityTypeChange?.(event.target.value as ReviewEntityType)}
        >
          {REVIEW_ENTITY_TYPES.map((entityType) => (
            <option key={entityType} value={entityType}>
              {REVIEW_KIND_NAMES[entityType]}
            </option>
          ))}
        </select>
      </label>
      <label className="dq-drawer-field">
        <span>Review name</span>
        <input
          ref={nameRef}
          className="dq-input"
          aria-label="Review name"
          autoFocus={autoFocus}
          value={review.name}
          onChange={(event) => onChange({ ...review, name: event.target.value })}
        />
      </label>
      <label className="dq-drawer-field">
        <span>Description</span>
        <textarea
          className="dq-input"
          aria-label="Description"
          rows={3}
          value={review.description}
          onChange={(event) => onChange({ ...review, description: event.target.value })}
        />
      </label>
    </>
  );
}

function drawerTabs(review: Review, legacyChoices: boolean): DrawerTab[] {
  const entityType = reviewEntityType(review);
  const tabs: DrawerTab[] = ["Review"];
  // Only reviews with a card grid have anything to arrange; audio and occurrence reviews always
  // show one item at a time.
  if (entityType === "video" || entityType === "tag") tabs.push("Appearance");
  tabs.push("Actions");
  if (legacyChoices) tabs.push("Tag choices");
  return tabs;
}

/**
 * Asks before Esc, Close or Cancel throw away unsaved changes: a small modal over the page whose
 * Keep editing (focused, and what Esc means here) returns to the drawer and whose Discard closes
 * it, restoring the view from before editing.
 */
function DiscardChangesDialog({
  onKeepEditing,
  onDiscard,
}: {
  onKeepEditing(): void;
  onDiscard(): void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const keepEditing = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const textId = useId();
  useEffect(() => {
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    keepEditing.current?.focus();
  }, []);
  return (
    <dialog
      ref={dialog}
      className="dq-confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={textId}
      // As for the page's other modals: Cove's shortcuts and the review's keys wait while it is open.
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        onKeepEditing();
      }}
      // Chrome closes a modal on a second Esc without a cancel it lets us refuse: keep editing.
      onClose={onKeepEditing}
    >
      <h2 id={titleId}>Discard unsaved changes?</h2>
      <p id={textId}>Closing the editor leaves the review as it was last saved.</p>
      <div className="dq-confirm-dialog-actions">
        <button ref={keepEditing} type="button" className="dq-button" onClick={onKeepEditing}>
          Keep editing
        </button>
        <button type="button" className="dq-button dq-button-danger" onClick={onDiscard}>
          Discard
        </button>
      </div>
    </dialog>
  );
}

/**
 * Edit review: a drawer over the right-hand column. The header's toolbar, Scope and the queue stay
 * live beside it as the draft's preview (their criteria are the draft's), while the review's
 * actions pause. Review, Appearance and Actions hold the rest of the definition; Save review keeps
 * everything, Cancel restores the view from before editing. Cancel, Esc and Close do so at once
 * while nothing has changed, and ask first when something has.
 */
export function EditorDrawer({
  draft,
  onChange,
  direction,
  onDirectionChange,
  tagGroups,
  trees,
  saving,
  saveDisabled = false,
  error,
  dirty,
  criteriaChanged = false,
  notices,
  onSave,
  onCancel,
  drawerRef,
}: {
  /** The review as Save would store it, criteria included. */
  draft: Review;
  onChange(review: Review): void;
  /** Where the queue starts: the live queue's direction in the single-item workspace. */
  direction: Direction;
  onDirectionChange(direction: Direction): void;
  tagGroups: readonly TagGroup[];
  trees: TagTrees;
  saving: boolean;
  /** Save waits, for example while the draft's queue loads. */
  saveDisabled?: boolean;
  /** Why the last save failed. */
  error: string;
  /**
   * Whether the draft differs from the saved review, the queue's criteria included: criteria
   * changed before the drawer opened count, and Esc then no longer discards the draft.
   */
  dirty: boolean;
  /** The queue's criteria (tag bins aside) differ from the saved ones, so Save review keeps them. */
  criteriaChanged?: boolean;
  /** Messages about the preview, such as a queue that could not load. */
  notices?: ReactNode;
  onSave(): void;
  onCancel(): void;
  drawerRef?: RefObject<HTMLElement | null>;
}) {
  const [tab, setTab] = useState<DrawerTab>("Review");
  // Tag choices belong to legacy occurrence reviews; the tab stays while its choices are edited.
  const [legacyChoices] = useState(
    () => isOccurrenceReview(draft) && draft.occurrence.tagIds.length > 0,
  );
  const [problem, setProblem] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [reveal, setReveal] = useState(0);
  // Esc, Close or Cancel with unsaved changes asks first; Keep editing hands focus back to what had
  // it.
  const [confirmingDiscard, setConfirmingDiscard] = useState(false);
  const discardOpener = useRef<HTMLElement | null>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const aside = useRef<HTMLElement | null>(null);
  const tabs = drawerTabs(draft, legacyChoices);
  const entityType = reviewEntityType(draft);
  const signature = useMemo(() => draftSignature(draft), [draft]);
  // What stopped the last Save press goes as soon as the draft changes.
  useEffect(() => setProblem(""), [signature]);
  useEffect(() => {
    if (confirmingDiscard) return;
    const opener = discardOpener.current;
    discardOpener.current = null;
    if (!opener) return;
    // Back where Esc, Close or Cancel was pressed; the drawer itself when that is gone, disabled or
    // outside it (some browsers do not focus a clicked button), so Esc keeps reaching the drawer.
    const usable =
      opener.isConnected &&
      !!aside.current?.contains(opener) &&
      !(opener instanceof HTMLButtonElement && opener.disabled);
    (usable ? opener : aside.current)?.focus({ preventScroll: true });
  }, [confirmingDiscard]);

  /** Esc, Close and Cancel: without changes the drawer closes at once, with changes it asks first. */
  function requestClose() {
    if (saving || confirmingDiscard) return;
    if (!dirty) {
      onCancel();
      return;
    }
    discardOpener.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setConfirmingDiscard(true);
  }

  function save() {
    const trimmed = { ...draft, name: draft.name.trim() } as Review;
    const invalid = reviewValidation(trimmed);
    if (!invalid) {
      setProblem("");
      onSave();
      return;
    }
    setProblem(invalid);
    // Show where the problem is: the name, or the first action that cannot be saved.
    if (!trimmed.name) {
      setTab("Review");
      requestAnimationFrame(() => nameInput.current?.focus());
      return;
    }
    const incomplete = (draft.actions as ReviewAction[]).find(
      (action) => !validAction(action, entityType),
    );
    if (incomplete) {
      setTab("Actions");
      setExpandedId(incomplete.id);
      setReveal((value) => value + 1);
    }
  }

  const message = problem || error;
  return (
    <>
      <aside
        ref={(node) => {
          aside.current = node;
          if (drawerRef) drawerRef.current = node;
        }}
        className="dq-drawer"
        role="dialog"
        aria-label="Edit review"
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || event.defaultPrevented || saving) return;
          event.preventDefault();
          event.stopPropagation();
          requestClose();
        }}
      >
        <header className="dq-drawer-header">
          <div className="dq-drawer-title">
            <span className="dq-eyebrow">Edit review</span>
            <h2>{draft.name.trim() || "Untitled review"}</h2>
          </div>
          <button
            type="button"
            className="dq-icon-button"
            aria-label="Close editor"
            title="Close without saving"
            disabled={saving}
            onClick={requestClose}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="dq-drawer-tabs">
          <EntityDetailTabs
            tabs={tabs.map((name) => ({
              key: name,
              label: name,
              count: name === "Actions" ? draft.actions.length : undefined,
            }))}
            activeTab={tab}
            onTabChange={(key) => setTab(key as DrawerTab)}
          />
        </div>
        <div className="dq-drawer-body">
          <fieldset className="dq-drawer-fields" disabled={saving}>
            <legend className="dq-sr-only">Review settings</legend>
            <div
              className="dq-drawer-panel"
              role="tabpanel"
              hidden={tab !== "Review"}
              aria-label="Review"
            >
              <ReviewDetailsFields
                review={draft}
                onChange={onChange}
                entityTypeLocked
                nameRef={nameInput}
                autoFocus
              />
              <label className="dq-drawer-field">
                <span>Review direction</span>
                <select
                  className="dq-select"
                  aria-label="Review direction"
                  value={direction}
                  onChange={(event) => onDirectionChange(event.target.value as Direction)}
                >
                  <option value="end">Start from the end</option>
                  <option value="beginning">Start from the beginning</option>
                </select>
                <small className="dq-drawer-note">
                  From the end, the queue opens on its last page and works towards the first.
                </small>
              </label>
              {isOccurrenceReview(draft) && (
                <PerformerFlagSettings review={draft} onChange={onChange} />
              )}
              <div>
                <button
                  type="button"
                  className="dq-text-button"
                  // Keeps a draft that cannot be saved, for example after an edit in another
                  // browser.
                  onClick={() => exportReview(draft)}
                >
                  Export draft
                </button>
              </div>
            </div>
            {tabs.includes("Appearance") && (
              <div
                className="dq-drawer-panel"
                role="tabpanel"
                hidden={tab !== "Appearance"}
                aria-label="Appearance"
              >
                <AppearanceSettings review={draft} onChange={onChange} />
              </div>
            )}
            <div
              className="dq-drawer-panel dq-actions-panel"
              role="tabpanel"
              hidden={tab !== "Actions"}
              aria-label="Actions"
            >
              <ActionsEditor
                review={draft}
                onChange={onChange}
                tagGroups={tagGroups}
                trees={trees}
                saving={saving}
                expandedId={expandedId}
                onExpand={setExpandedId}
                reveal={reveal}
              />
            </div>
            {legacyChoices && isOccurrenceReview(draft) && (
              <div
                className="dq-drawer-panel"
                role="tabpanel"
                hidden={tab !== "Tag choices"}
                aria-label="Tag choices"
              >
                <TagChoiceSettings review={draft} onChange={onChange} />
              </div>
            )}
          </fieldset>
        </div>
        {(message || notices) && (
          <div className="dq-drawer-notices">
            {notices}
            {message && (
              <p role="alert" className="dq-alert">
                <AlertTriangle aria-hidden="true" />
                {message}
              </p>
            )}
          </div>
        )}
        <footer className="dq-drawer-footer">
          <p className="dq-drawer-dirty">
            {dirty
              ? criteriaChanged
                ? "Unsaved changes, including the queue's criteria"
                : "Unsaved changes"
              : ""}
          </p>
          <button type="button" className="dq-button" disabled={saving} onClick={requestClose}>
            Cancel
          </button>
          {/* Not disabled while saving: a disabled button would drop focus to the page, where a
              failed save would leave it and the grid's keys would take Esc and Space. */}
          <button
            type="button"
            className="dq-button primary"
            aria-busy={saving || undefined}
            aria-disabled={saving || undefined}
            disabled={!saving && saveDisabled}
            onClick={() => {
              if (!saving) save();
            }}
          >
            Save review
          </button>
        </footer>
      </aside>
      {/* Outside the drawer, so its keys (Esc above all) never reach the drawer's own. */}
      {confirmingDiscard && (
        <DiscardChangesDialog
          onKeepEditing={() => setConfirmingDiscard(false)}
          onDiscard={() => {
            // The drawer closes, and whoever opened it takes focus back.
            discardOpener.current = null;
            setConfirmingDiscard(false);
            onCancel();
          }}
        />
      )}
    </>
  );
}

/**
 * How the review looks: for video reviews the layout it opens in and the card grid's settings,
 * for tag reviews the card grid's. Other reviews show one item at a time and have none of these.
 */
function AppearanceSettings({
  review,
  onChange,
}: {
  review: Review;
  onChange(review: Review): void;
}) {
  const baseId = useId();
  const view = review.view;
  const setView = (change: Partial<ReviewView>) =>
    onChange({ ...review, view: { ...view, ...change } } as Review);
  const selectAll = (
    <label className="dq-checkbox dq-setting-indent">
      <input
        type="checkbox"
        checked={view.selectAllOnLoad ?? false}
        onChange={(event) => setView({ selectAllOnLoad: event.target.checked ? true : undefined })}
      />
      Select every card when a page opens
    </label>
  );
  if (reviewEntityType(review) === "tag")
    return (
      <div className="dq-drawer-section" role="group" aria-labelledby={`${baseId}-cards`}>
        <h3 className="dq-eyebrow" id={`${baseId}-cards`}>
          Cards
        </h3>
        <ViewChoice
          label="View"
          value={view.displayMode === "list" ? "list" : "grid"}
          options={[
            { value: "grid", label: "Cards" },
            { value: "list", label: "List" },
          ]}
          onChange={(displayMode) => setView({ displayMode })}
        />
        {selectAll}
        <p className="dq-drawer-note">
          The review opens with these. The Cards / List switch in the header changes only the
          current visit.
        </p>
      </div>
    );

  const presentation = (review as VideoReview).presentation ?? {};
  const setPresentation = (change: NonNullable<VideoReview["presentation"]>) =>
    onChange({ ...review, presentation: { ...presentation, ...change } } as Review);
  const annotations = presentation.annotations ?? [];
  const layout = view.reviewMode ?? "single";
  return (
    <>
      <div className="dq-drawer-section" role="group" aria-labelledby={`${baseId}-layout`}>
        <h3 className="dq-eyebrow" id={`${baseId}-layout`}>
          Layout
        </h3>
        <div className="dq-layout-cards" role="radiogroup" aria-labelledby={`${baseId}-layout`}>
          <LayoutCard
            name={`${baseId}-layout-choice`}
            checked={layout === "single"}
            title="Single video"
            text="One video at a time, with the player and the action keys under it."
            picture={<SinglePicture />}
            onChoose={() => setView({ reviewMode: "single" })}
          />
          <LayoutCard
            name={`${baseId}-layout-choice`}
            checked={layout === "multiple"}
            title="Grid"
            text="Many videos at once. Select cards, then press an action key."
            picture={<GridPicture />}
            onChoose={() => setView({ reviewMode: "multiple" })}
          />
        </div>
        <p className="dq-drawer-note">
          The review always opens in this layout. The Single / Grid switch in the header only
          changes the current visit.
        </p>
      </div>
      <div className="dq-drawer-section" role="group" aria-labelledby={`${baseId}-grid`}>
        <h3 className="dq-eyebrow" id={`${baseId}-grid`}>
          Grid
        </h3>
        <ViewChoice
          label="Cards"
          value={view.displayMode === "wall" ? "wall" : "grid"}
          options={[
            { value: "grid", label: "Cards" },
            { value: "wall", label: "Wall" },
          ]}
          onChange={(displayMode) => setView({ displayMode })}
        />
        {selectAll}
        <div className="dq-setting-row" role="group" aria-labelledby={`${baseId}-details`}>
          <span className="dq-setting-name" id={`${baseId}-details`}>
            Card details
          </span>
          <div className="dq-setting-options">
            {(
              [
                ["date", "Date"],
                ["studio", "Studio"],
                ["performers", "Performers"],
                ["tags", "Tags"],
              ] as const
            ).map(([field, label]) => (
              <label key={field} className="dq-checkbox">
                <input
                  type="checkbox"
                  checked={annotations.includes(field)}
                  onChange={(event) =>
                    setPresentation({
                      annotations: event.target.checked
                        ? [...annotations, field]
                        : annotations.filter((item) => item !== field),
                    })
                  }
                />
                {label}
              </label>
            ))}
          </div>
        </div>
        {annotations.includes("tags") && (
          <div className="dq-setting-row dq-setting-row-top">
            <span className="dq-setting-name">Tags on cards</span>
            <div className="dq-setting-value">
              <EntityReferenceMultiSelector
                entityType="tag"
                values={presentation.annotationParents ?? []}
                onChange={(annotationParents) => setPresentation({ annotationParents })}
                placeholder="Add a parent tag…"
                inputAriaLabel="Add a parent tag for card tags"
                containerClassName="dq-chip-input"
                inputClassName="dq-chip-input-field"
                allowCreate={false}
              />
              <p className="dq-drawer-note">
                Cards show only the tags under these parents, whatever the queue filters.
              </p>
            </div>
          </div>
        )}
      </div>
      <div className="dq-drawer-section" role="group" aria-labelledby={`${baseId}-bins`}>
        <h3 className="dq-eyebrow" id={`${baseId}-bins`}>
          Queue tag bins
        </h3>
        <EntityReferenceMultiSelector
          entityType="tag"
          values={presentation.binParents ?? []}
          onChange={(binParents) => setPresentation({ binParents })}
          placeholder="Add a parent tag…"
          inputAriaLabel="Add a parent tag for queue bins"
          containerClassName="dq-chip-input"
          inputClassName="dq-chip-input-field"
          allowCreate={false}
        />
        <p className="dq-drawer-note">
          In the grid, tags under these parents become one-click filters in the filter row,
          counted on the loaded page.
        </p>
      </div>
    </>
  );
}

function ViewChoice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange(value: T): void;
}) {
  const labelId = useId();
  return (
    <div className="dq-setting-row">
      <span className="dq-setting-name" id={labelId}>
        {label}
      </span>
      <div className="dq-segmented" role="group" aria-labelledby={labelId}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => value !== option.value && onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function LayoutCard({
  name,
  checked,
  title,
  text,
  picture,
  onChoose,
}: {
  name: string;
  checked: boolean;
  title: string;
  text: string;
  picture: ReactNode;
  onChoose(): void;
}) {
  const titleId = useId();
  const textId = useId();
  return (
    <label className="dq-layout-card">
      {picture}
      <span className="dq-layout-card-name">
        <input
          type="radio"
          name={name}
          checked={checked}
          aria-labelledby={titleId}
          aria-describedby={textId}
          onChange={onChoose}
        />
        <span id={titleId}>{title}</span>
      </span>
      <span className="dq-layout-card-text" id={textId}>
        {text}
      </span>
    </label>
  );
}

/** The single-item workspace in miniature: queue, player over the key pad, item column. */
function SinglePicture() {
  return (
    <svg className="dq-layout-picture" viewBox="0 0 300 96" preserveAspectRatio="none" aria-hidden="true">
      <rect className="dq-picture-ground" x="0" y="0" width="300" height="96" rx="6" />
      {[8, 21, 34, 47, 60].map((y) => (
        <rect key={y} className="dq-picture-part" x="8" y={y} width="52" height="9" rx="2" />
      ))}
      <rect className="dq-picture-strong" x="68" y="8" width="164" height="58" rx="3" />
      {[68, 85, 102, 119, 136, 153, 170].map((x) => (
        <rect key={x} className="dq-picture-key" x={x} y="72" width="14" height="8" rx="2" />
      ))}
      {[72, 89, 106].map((x) => (
        <rect key={x} className="dq-picture-key" x={x} y="83" width="14" height="8" rx="2" />
      ))}
      <rect className="dq-picture-part" x="240" y="8" width="52" height="83" rx="3" />
    </svg>
  );
}

/** The card grid in miniature: two rows of cards, some selected, and the action bar. */
function GridPicture() {
  const selected = new Set(["80,8", "152,8", "8,44", "224,44"]);
  return (
    <svg className="dq-layout-picture" viewBox="0 0 300 96" preserveAspectRatio="none" aria-hidden="true">
      <rect className="dq-picture-ground" x="0" y="0" width="300" height="96" rx="6" />
      {[8, 44].flatMap((y) =>
        [8, 80, 152, 224].map((x) => (
          <rect
            key={`${x},${y}`}
            className={selected.has(`${x},${y}`) ? "dq-picture-selected" : "dq-picture-strong"}
            x={x}
            y={y}
            width="66"
            height="30"
            rx="3"
          />
        )),
      )}
      <rect className="dq-picture-key" x="8" y="80" width="282" height="10" rx="3" />
    </svg>
  );
}
