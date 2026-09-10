import { EntityReferenceMultiSelector } from "@cove/runtime/components";
import type { OccurrenceReview } from "./model";
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
  const update = (change: Partial<OccurrenceReview["occurrence"]>) =>
    onChange({ ...review, occurrence: { ...settings, ...change } });
  if (choices)
    return (
      <fieldset className="dq-queue-fields">
        <legend>Tag choices</legend>
        <p>
          Choose the tags this review can change on the active performer’s
          appearance in a scene. Other tags are preserved.
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
          Allow multiple tags, for example when a hairstyle changes during the
          scene
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
          <option value="any">Any occurrence tags</option>
          <option value="includes">Has any selected tag</option>
          <option value="includesAll">Has all selected tags</option>
          <option value="excludes">Has none of the selected tags</option>
          <option value="isNull">Has no occurrence tags</option>
        </select>
      </label>
      {!["any", "isNull"].includes(settings.condition) && (
        <EntityReferenceMultiSelector
          entityType="tag"
          values={settings.conditionTagIds}
          onChange={(conditionTagIds) => update({ conditionTagIds })}
          placeholder="Search occurrence condition tags..."
          allowCreate={false}
        />
      )}
      <p>
        Conditions check exact tags on the same performer’s occurrence,
        independently of scene tags and the performer’s profile.
      </p>
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
