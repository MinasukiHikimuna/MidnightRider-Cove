import { EntityReferenceMultiSelector } from "@cove/runtime/components";
import { mediaLabel } from "./api";
import {
  conditionSeeksMissingTags,
  OCCURRENCE_CONDITION_LABELS,
  OCCURRENCE_CONDITIONS,
  reviewMediaKind,
  type OccurrenceReview,
} from "./model";
import { ReviewWorkspace } from "./ReviewWorkspace";

export function OccurrenceSettings({
  review,
  onChange,
  choices = false,
}: {
  review: OccurrenceReview;
  onChange(review: OccurrenceReview): void;
  choices?: boolean;
}) {
  const settings = review.occurrence;
  const host = mediaLabel(reviewMediaKind(review)).queue;
  const update = (change: Partial<OccurrenceReview["occurrence"]>) =>
    onChange({ ...review, occurrence: { ...settings, ...change } });
  if (choices)
    return (
      <fieldset className="dq-queue-fields">
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
  return (
    <fieldset className="dq-queue-fields">
      <legend>Occurrence condition (optional)</legend>
      <p>
        Leave this unrestricted to review any appearance. Set performer matching
        in the review workspace and save it with the rule.
      </p>
      <label>
        Occurrence condition
        <select
          aria-label="Occurrence condition"
          value={settings.condition}
          onChange={(event) =>
            update({
              condition: event.target.value as typeof settings.condition,
            })
          }
        >
          {OCCURRENCE_CONDITIONS.map((condition) => (
            <option value={condition} key={condition}>
              {OCCURRENCE_CONDITION_LABELS[condition]}
            </option>
          ))}
        </select>
      </label>
      {!["any", "isNull"].includes(settings.condition) && (
        <>
          <EntityReferenceMultiSelector
            entityType="tag"
            values={settings.conditionTagIds}
            onChange={(conditionTagIds) => update({ conditionTagIds })}
            placeholder="Search occurrence condition tags..."
            allowCreate={false}
          />
          <label className="dq-checkbox">
            <input
              type="checkbox"
              checked={settings.includeSubtags ?? true}
              onChange={(event) => update({ includeSubtags: event.target.checked })}
            />
            Include subtags
          </label>
          {conditionSeeksMissingTags(settings.condition) && (
            <label className="dq-checkbox">
              <input
                type="checkbox"
                checked={settings.hideConfirmedAbsent ?? true}
                onChange={(event) => update({ hideConfirmedAbsent: event.target.checked })}
              />
              Hide occurrences confirmed absent
            </label>
          )}
        </>
      )}
      <p>
        Conditions check tags on the same performer’s occurrence,
        independently of {host} tags and the performer’s profile.
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
    <fieldset className="dq-queue-fields">
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

export function OccurrenceWorkspace({
  review,
  canWrite,
  onBusy,
}: {
  review: OccurrenceReview;
  storageKey: string;
  canWrite: boolean;
  onBusy(value: boolean): void;
}) {
  return (
    <ReviewWorkspace review={review} canWrite={canWrite} onBusy={onBusy} />
  );
}
