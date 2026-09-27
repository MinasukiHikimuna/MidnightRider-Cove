import { EntityReferenceMultiSelector } from "@cove/runtime/components";
import { mediaLabel } from "./api";
import { reviewMediaKind, type OccurrenceReview } from "./model";

/**
 * The tags a legacy occurrence review (one without actions) offers as choices on the reviewed
 * performer's occurrence, and whether several may be chosen.
 */
export function TagChoiceSettings({
  review,
  onChange,
}: {
  review: OccurrenceReview;
  onChange(review: OccurrenceReview): void;
}) {
  const settings = review.occurrence;
  const host = mediaLabel(reviewMediaKind(review)).queue;
  const update = (change: Partial<OccurrenceReview["occurrence"]>) =>
    onChange({ ...review, occurrence: { ...settings, ...change } });
  return (
    <fieldset className="dq-settings-group">
      <legend>Tag choices</legend>
      <p>
        Choose the tags this review can change on the active performer’s
        appearance in one {host}. Other tags are preserved.
      </p>
      <EntityReferenceMultiSelector
        entityType="tag"
        values={settings.tagIds}
        onChange={(tagIds) => update({ tagIds })}
        placeholder="Search review tag choices..."
        allowCreate={false}
      />
      <label className="dq-checkbox">
        <input
          type="checkbox"
          checked={settings.multiple}
          onChange={(event) => update({ multiple: event.target.checked })}
        />
        Allow multiple tags, for example when something changes part-way
        through the {host}
      </label>
      <p>
        Save & next performer applies the selected tags and advances. Save
        choices stays on the performer. Skip only moves the cursor;
        eligibility comes from the filters.
      </p>
    </fieldset>
  );
}

export function PerformerFlagSettings({
  review,
  onChange,
}: {
  review: OccurrenceReview;
  onChange(review: OccurrenceReview): void;
}) {
  const host = mediaLabel(reviewMediaKind(review)).many;
  return (
    <fieldset className="dq-settings-group">
      <legend>Performer flags</legend>
      <p>
        Flag performers whose profile has any of these tags in the performer
        list and batches, for example a tag noting that something changed during
        their career. Check a flagged performer’s earliest and latest {host}{" "}
        before applying one batch to all of them.
      </p>
      <EntityReferenceMultiSelector
        entityType="tag"
        values={review.occurrence.flagPerformerTagIds ?? []}
        onChange={(ids) => {
          const { flagPerformerTagIds: _previous, ...occurrence } = review.occurrence;
          onChange({
            ...review,
            occurrence: ids.length ? { ...occurrence, flagPerformerTagIds: ids } : occurrence,
          });
        }}
        placeholder="Search performer flag tags..."
        allowCreate={false}
      />
    </fieldset>
  );
}
