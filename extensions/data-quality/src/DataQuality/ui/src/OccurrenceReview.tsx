import {
  EntityReferenceMultiSelector,
  EntityReferenceSelector,
} from "@cove/runtime/components";
import { Flag, Trash2 } from "@cove/runtime/lucide-react";
import { mediaLabel } from "./api";
import {
  performerFlags,
  reviewMediaKind,
  withPerformerFlags,
  type OccurrenceReview,
  type PerformerFlag,
} from "./model";
import { ReviewTagBadge } from "./TagDisplay";
import { useTags } from "./tagNames";

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

/**
 * The review's performer flags: each a performer profile tag and the category it affects (that tag
 * and everything under it), the review's condition categories suggested first; without a category
 * a flag affects the whole review. A flag is added by choosing its tag, for the whole review.
 */
export function PerformerFlagSettings({
  review,
  onChange,
}: {
  review: OccurrenceReview;
  onChange(review: OccurrenceReview): void;
}) {
  const host = mediaLabel(reviewMediaKind(review)).many;
  const settings = review.occurrence;
  const flags = performerFlags(settings);
  const suggested = ["any", "isNull"].includes(settings.condition) ? [] : settings.conditionTagIds;
  const tags = useTags([
    ...flags.flatMap((flag) => [flag.tagId, ...(flag.categoryTagId ? [flag.categoryTagId] : [])]),
    ...suggested,
  ]);
  const name = (id: number) =>
    tags[id]?.name ?? (tags[id] === null ? `Unavailable tag ${id}` : `Tag ${id}`);
  const save = (next: PerformerFlag[]) =>
    onChange({ ...review, occurrence: withPerformerFlags(settings, next) });
  const affect = (index: number, categoryTagId: number | undefined) =>
    save(
      flags.map((flag, position) =>
        position !== index
          ? flag
          : categoryTagId === undefined
            ? { tagId: flag.tagId }
            : { tagId: flag.tagId, categoryTagId },
      ),
    );
  return (
    <fieldset className="dq-settings-group dq-flag-settings">
      <legend>Performer flags</legend>
      <p>
        Flag performers whose profile has one of these tags, for example a tag noting that
        something changed during their career. <strong>Affects</strong> names the category the
        flag is about, that tag and everything under it: the flag then asks for attention only where
        an answer changes that category. Leave it empty for the whole review. Check a flagged
        performer’s earliest and latest {host} before applying one batch to all of them.
      </p>
      {flags.length > 0 && (
        <ul className="dq-flag-pairs" aria-label="Performer flags">
          {flags.map((flag, index) => {
            const flagName = name(flag.tagId);
            // The same tag's other pairs: their categories are taken, as a pair given twice is one.
            const siblings = flags.filter(
              (other, position) => position !== index && other.tagId === flag.tagId,
            );
            const taken = (categoryTagId: number | undefined) =>
              siblings.some((other) => other.categoryTagId === categoryTagId);
            // Stable while a pair's category changes or another tag's pair goes.
            const key = `${flag.tagId}#${flags.slice(0, index).filter((other) => other.tagId === flag.tagId).length}`;
            return (
              <li key={key} className="dq-flag-pair">
                <span className="dq-flag-pair-tag">
                  <Flag aria-hidden="true" />
                  <ReviewTagBadge tag={tags[flag.tagId]} name={flagName} />
                </span>
                <div className="dq-flag-pair-affects">
                  <span className="dq-flag-pair-label" aria-hidden="true">
                    Affects
                  </span>
                  <EntityReferenceSelector
                    entityType="tag"
                    value={flag.categoryTagId}
                    onChange={(id) => affect(index, id)}
                    placeholder="Whole review"
                    allowCreate={false}
                    selectedDisplay="input"
                    inputClassName="dq-input"
                    inputAriaLabel={`Affects, ${flagName}`}
                    excludeIds={siblings.flatMap((other) =>
                      other.categoryTagId === undefined ? [] : [other.categoryTagId],
                    )}
                  />
                </div>
                <button
                  type="button"
                  className="dq-icon-button"
                  aria-label={`Remove flag ${flagName}`}
                  title="Remove flag"
                  onClick={() => save(flags.filter((_, position) => position !== index))}
                >
                  <Trash2 aria-hidden="true" />
                </button>
                {suggested.length > 0 && (
                  <div
                    className="dq-flag-suggestions"
                    role="group"
                    aria-label={`Suggested categories for ${flagName}`}
                  >
                    <span aria-hidden="true">Condition categories</span>
                    <button
                      type="button"
                      className="dq-flag-suggestion"
                      aria-pressed={flag.categoryTagId === undefined}
                      disabled={taken(undefined)}
                      onClick={() => affect(index, undefined)}
                    >
                      Whole review
                    </button>
                    {suggested.map((id) => (
                      <button
                        type="button"
                        key={id}
                        className="dq-flag-suggestion"
                        aria-pressed={flag.categoryTagId === id}
                        disabled={taken(id)}
                        onClick={() => affect(index, id)}
                      >
                        {name(id)}
                      </button>
                    ))}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <EntityReferenceSelector
        entityType="tag"
        value={undefined}
        onChange={(id) => {
          if (id !== undefined) save([...flags, { tagId: id }]);
        }}
        placeholder="Search performer flag tags..."
        allowCreate={false}
        inputClassName="dq-input"
        inputAriaLabel="Add a performer flag"
        // A tag flagging the whole review already would add nothing.
        excludeIds={flags.flatMap((flag) => (flag.categoryTagId === undefined ? [flag.tagId] : []))}
      />
    </fieldset>
  );
}
