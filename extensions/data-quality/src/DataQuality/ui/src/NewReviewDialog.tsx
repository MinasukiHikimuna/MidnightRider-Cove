import { useEffect, useId, useRef } from "react";
import { X } from "@cove/runtime/lucide-react";
import { ReviewDetailsFields } from "./EditorDrawer";
import { exportReview } from "./reviewFiles";
import { reviewEntityType, type Review, type ReviewEntityType } from "./model";

/** A new review of the given kind, keeping only its id, name and description: no actions and the
 * kind's default queue. */
export function newReview(
  entityType: ReviewEntityType,
  { id, name, description }: Pick<Review, "id" | "name" | "description">,
): Review {
  const base = { id, name, description };
  const view = (filter: Record<string, unknown>, extra: Partial<Review["view"]> = {}) => ({
    filter: { page: 1, perPage: 40, ...filter },
    objectFilter: {},
    displayMode: "grid" as const,
    searchMode: "text",
    ...extra,
  });
  switch (entityType) {
    case "tag":
      // Tag reviews start with the ungrouped tags, by name.
      return {
        ...base,
        entityType: "tag",
        view: {
          ...view({ sort: "name", direction: "asc" }, { startFrom: "beginning" }),
          objectFilter: { tagGroupsCriterion: { value: [], modifier: "IS_NULL" } },
        },
        actions: [],
      };
    case "audio":
      // Audios have no card grid, so an audio review always runs the single-item workspace.
      return {
        ...base,
        entityType: "audio",
        view: view({ sort: "date", direction: "desc" }, { startFrom: "end", reviewMode: "single" }),
        actions: [],
      };
    case "performerOccurrence":
    case "audioPerformerOccurrence":
      return {
        ...base,
        entityType,
        view: view({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: [],
        occurrence: {
          targetMode: "all",
          performerIds: [],
          performerFilter: {},
          condition: "any",
          conditionTagIds: [],
          tagIds: [],
          multiple: true,
        },
      };
    default:
      return {
        ...base,
        entityType: "video",
        view: view({ sort: "date", direction: "desc" }, { startFrom: "end" }),
        actions: [],
      };
  }
}

/** A review being created: a new one, or a copy of a saved review. */
export interface ReviewDraft {
  review: Review;
  /** A copy keeps the kind of the review it copies. */
  duplicate: boolean;
  saving: boolean;
  /** Why the last Create & configure failed. */
  error: string;
}

/**
 * New review and Duplicate: the review's kind, name and description first; Create & configure
 * saves it, and the page opens it with its editor drawer. A modal dialog, so Cove's shortcuts and
 * the review's keys wait. Cancel, close and Esc give focus back to what opened it; while saving it
 * stays open, and a draft that cannot be saved can still be exported.
 */
export function NewReviewDialog({
  draft,
  onChange,
  onCreate,
  onCancel,
}: {
  draft: ReviewDraft;
  onChange(review: Review): void;
  onCreate(): void;
  onCancel(): void;
}) {
  const { review, duplicate, saving, error } = draft;
  const dialog = useRef<HTMLDialogElement>(null);
  const nameInput = useRef<HTMLInputElement>(null);
  const savingRef = useRef(saving);
  savingRef.current = saving;
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  useEffect(() => {
    // Only the first run finds focus still on the opener: React's StrictMode (Cove's development
    // build) runs this twice on mount, the second time with focus already in the dialog.
    opener.current ??=
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    if (dialog.current && !dialog.current.open) dialog.current.showModal();
    nameInput.current?.focus();
    // Created, the review opens with its drawer, which takes focus; otherwise focus goes back.
    return () => {
      if (opener.current?.isConnected) opener.current.focus({ preventScroll: true });
    };
  }, []);
  // A refused Create & configure without a name shows where the name goes. A save that failed
  // hands focus back to the name when the disabled fields had dropped it (Enter in the name).
  const wasSaving = useRef(saving);
  useEffect(() => {
    const active = document.activeElement;
    const focusLost = !active || active === document.body || !dialog.current?.contains(active);
    if (error && (!review.name.trim() || (wasSaving.current && !saving && focusLost)))
      nameInput.current?.focus();
    wasSaving.current = saving;
  }, [error, saving]);
  const cancel = () => {
    if (!savingRef.current) onCancel();
  };
  return (
    <dialog
      ref={dialog}
      className="dq-form-dialog"
      aria-labelledby={titleId}
      // A native dialog has no role attribute; this is what makes Cove (and the review's keys)
      // wait while it is open, as for any modal dialog.
      aria-modal="true"
      onCancel={(event) => {
        event.preventDefault();
        cancel();
      }}
      onClose={() => {
        // Chrome closes a modal on a second Esc without a cancel it lets us refuse: while the
        // review saves, show it again; otherwise finish closing as Cancel does.
        if (savingRef.current) dialog.current?.showModal();
        else onCancel();
      }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (!savingRef.current) onCreate();
        }}
      >
        <header className="dq-form-dialog-header">
          <h2 id={titleId}>{duplicate ? "Duplicate review" : "New review"}</h2>
          <button
            type="button"
            className="dq-icon-button"
            aria-label="Close dialog"
            title="Close"
            disabled={saving}
            onClick={cancel}
          >
            <X aria-hidden="true" />
          </button>
        </header>
        <div className="dq-form-dialog-body">
          <p className="dq-form-dialog-intro">
            Name the review, then configure its queue and actions.
          </p>
          {error && (
            <p role="alert" className="dq-alert">
              {error}
            </p>
          )}
          <fieldset className="dq-form-dialog-fields" disabled={saving}>
            <legend className="dq-sr-only">Review details</legend>
            <ReviewDetailsFields
              review={review}
              onChange={onChange}
              entityTypeLocked={duplicate}
              onEntityTypeChange={(entityType) => {
                if (!duplicate && entityType !== reviewEntityType(review))
                  onChange(newReview(entityType, review));
              }}
              nameRef={nameInput}
            />
          </fieldset>
        </div>
        <footer className="dq-form-dialog-footer">
          <button type="button" className="dq-text-button" onClick={() => exportReview(review)}>
            Export draft
          </button>
          <span className="dq-form-dialog-space" />
          <button type="button" className="dq-button" disabled={saving} onClick={cancel}>
            Cancel
          </button>
          {/* Focusable while saving: a disabled button would drop focus out of the dialog. */}
          <button type="submit" className="dq-button primary" aria-disabled={saving || undefined}>
            {saving ? "Creating…" : "Create & configure"}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
