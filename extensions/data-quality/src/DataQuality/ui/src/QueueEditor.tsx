import { useState } from "react";
import {
  AUDIO_CRITERIA,
  AUDIO_SORT_OPTIONS,
  FilterDialog,
  TAG_CRITERIA,
  TAG_SORT_OPTIONS,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  EntityReferenceMultiSelector,
  useCustomFieldFilterSection,
} from "@cove/runtime/components";
import {
  isOccurrenceReview,
  reviewEntityType,
  reviewMediaKind,
  supportsMultipleReviewMode,
  type Review,
  type VideoReview,
} from "./model";

export function QueueEditor({
  draft,
  onChange,
  presentation = true,
  queue = true,
}: {
  draft: Review;
  onChange(review: Review): void;
  presentation?: boolean;
  queue?: boolean;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  // The queue subject: tags, or the review's media kind. Occurrence reviews queue their host media.
  const entityType =
    reviewEntityType(draft) === "tag" ? "tag" : reviewMediaKind(draft);
  const plural = entityType === "tag" ? "tags" : `${entityType}s`;
  const customFieldSection = useCustomFieldFilterSection(
    entityType === "tag" ? undefined : entityType,
    draft.view.objectFilter,
  );
  const filter = draft.view.filter;
  const sortOptions =
    entityType === "tag"
      ? TAG_SORT_OPTIONS
      : entityType === "audio"
        ? AUDIO_SORT_OPTIONS
        : VIDEO_SORT_OPTIONS;
  const criteria =
    entityType === "tag"
      ? TAG_CRITERIA
      : entityType === "audio"
        ? AUDIO_CRITERIA
        : VIDEO_CRITERIA;
  const updateFilter = (change: Record<string, unknown>) =>
    onChange({
      ...draft,
      view: { ...draft.view, filter: { ...filter, ...change } },
    });
  const settings =
    entityType === "video"
      ? ((draft as VideoReview).presentation ?? {})
      : {};
  const gridReview = entityType !== "audio";
  const updatePresentation = (
    change: NonNullable<VideoReview["presentation"]>,
  ) => onChange({ ...draft, presentation: { ...settings, ...change } });
  return (
    <>
      {queue && (
        <fieldset className="dq-queue-fields">
          <legend>Queue</legend>
          <label>
            Search
            <input
              value={String(filter.q ?? "")}
              onChange={(e) => updateFilter({ q: e.target.value })}
            />
          </label>
          <div className="dq-field-grid">
            <label>
              Sort
              <select
                aria-label="Sort"
                value={String(filter.sort ?? "date")}
                onChange={(e) =>
                  updateFilter({ sort: e.target.value, sorts: undefined })
                }
              >
                {!sortOptions.some((o) => o.value === filter.sort) &&
                  filter.sort != null && (
                    <option value={String(filter.sort)}>
                      {String(filter.sort)}
                    </option>
                  )}
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Direction
              <select
                aria-label="Direction"
                value={String(filter.direction ?? "desc")}
                onChange={(e) => updateFilter({ direction: e.target.value })}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </label>
            <label>
              {entityType === "tag" ? "Tags" : "Videos"} per page
              <input
                type="number"
                min="1"
                max="1000"
                value={Number(filter.perPage) || 40}
                onChange={(e) =>
                  updateFilter({
                    perPage: Math.max(
                      1,
                      Math.min(1000, Number(e.target.value) || 40),
                    ),
                  })
                }
              />
            </label>
            <label>
              Start from
              <select
                aria-label="Start from"
                value={draft.view.startFrom ?? "end"}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    view: {
                      ...draft.view,
                      startFrom: e.target.value as "beginning" | "end",
                    },
                  })
                }
              >
                <option value="end">The end</option>
                <option value="beginning">The beginning</option>
              </select>
            </label>
          </div>
          <button
            type="button"
            className="dq-button"
            onClick={() => setFiltersOpen(true)}
          >
            Edit {entityType} filters
          </button>
          <p>
            {Object.keys(draft.view.objectFilter).length
              ? `${entityType[0].toUpperCase()}${entityType.slice(1)} filters configured`
              : `No ${entityType} filters`}
            . Choose which {plural} enter the queue.
          </p>
          {filtersOpen && (
            <div onKeyDown={(e) => e.stopPropagation()}>
              <FilterDialog
                open
                onClose={() => setFiltersOpen(false)}
                criteria={criteria}
                activeFilter={draft.view.objectFilter}
                customSections={
                  customFieldSection ? [customFieldSection] : undefined
                }
                supportsFilterExpressions={entityType !== "tag"}
                subjectLabel={plural}
                onApply={(objectFilter) => {
                  onChange({ ...draft, view: { ...draft.view, objectFilter } });
                  setFiltersOpen(false);
                }}
              />
            </div>
          )}
        </fieldset>
      )}
      {presentation && (
        <>
          <h3>Appearance</h3>
          <p className="dq-editor-note">
            Choose how {entityType === "tag" ? "tags" : `${plural} and tags`} appear while reviewing.
          </p>
          <div className="dq-field-grid">
            {supportsMultipleReviewMode(draft) && <label>
              Preferred review layout
              <select
                value={draft.view.reviewMode ?? "single"}
                onChange={(event) => onChange({ ...draft, view: { ...draft.view, reviewMode: event.target.value as "single" | "multiple" } })}
              >
                <option value="single">Single video</option>
                <option value="multiple">Multiple videos</option>
              </select>
            </label>}
            {!isOccurrenceReview(draft) && gridReview && <label className="dq-checkbox">
              <input
                type="checkbox"
                checked={draft.view.selectAllOnLoad ?? false}
                onChange={(event) => onChange({ ...draft, view: { ...draft.view, selectAllOnLoad: event.target.checked ? true : undefined } })}
              />
              Select all {plural} on page load
              {entityType === "video" && <small> (multiple-videos layout)</small>}
            </label>}
            {gridReview && <label>
              Preferred view
              <select
                value={
                  entityType === "tag"
                    ? draft.view.displayMode === "list"
                      ? "list"
                      : "grid"
                    : draft.view.displayMode === "wall"
                      ? "wall"
                      : "grid"
                }
                onChange={(e) =>
                  onChange({
                    ...draft,
                    view: {
                      ...draft.view,
                      displayMode: e.target.value as
                        | "grid"
                        | "list"
                        | "wall",
                    },
                  })
                }
              >
                {(entityType === "tag" ? ["grid", "list"] : ["grid", "wall"]).map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </label>}
          </div>
          {entityType === "video" && <><h4>Card annotations</h4>
          <div className="dq-annotation-options">
            {(["date", "studio", "performers", "tags"] as const).map((name) => {
              const selected = settings.annotations ?? [];
              return (
                <label key={name} className="dq-checkbox">
                  <input
                    type="checkbox"
                    checked={selected.includes(name)}
                    onChange={(e) =>
                      updatePresentation({
                        annotations: e.target.checked
                          ? [...selected, name]
                          : selected.filter((x) => x !== name),
                      })
                    }
                  />
                  {name}
                </label>
              );
            })}
          </div>
          {(settings.annotations ?? []).includes("tags") && (
            <>
              <h4>Card tag bins</h4>
              <p>
                Choose parent tags. Only their descendant tags appear on the
                card; no tags appear until a parent is selected. This setting
                is separate from the queue filters.
              </p>
              <EntityReferenceMultiSelector
                entityType="tag"
                values={settings.annotationParents ?? []}
                placeholder="Search annotation parent tags..."
                onChange={(annotationParents) =>
                  updatePresentation({ annotationParents })
                }
                allowCreate={false}
              />
            </>
          )}
          <h4>Queue tag bins</h4>
          <p>
            Choose parent tags. Their descendants become temporary queue
            filters. Counts describe the loaded page.
          </p>
          <EntityReferenceMultiSelector
            entityType="tag"
            values={settings.binParents ?? []}
            placeholder="Search tag-bin parent tags..."
            onChange={(binParents) => updatePresentation({ binParents })}
            allowCreate={false}
          />
          </>}
        </>
      )}
    </>
  );
}
