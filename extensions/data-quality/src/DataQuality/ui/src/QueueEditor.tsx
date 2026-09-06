import { useState } from "react";
import {
  ActiveObjectFilterChips,
  countActiveObjectFilters,
  FilterDialog,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  EntityReferenceMultiSelector,
} from "@cove/runtime/components";
import type { VideoReview } from "./model";

export function QueueFilterPanel({
  objectFilter,
  overridden,
  disabled,
  onApply,
  onReset,
}: {
  objectFilter: Record<string, unknown>;
  overridden: boolean;
  disabled: boolean;
  onApply(objectFilter: Record<string, unknown>): void;
  onReset(): void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCount = countActiveObjectFilters(VIDEO_CRITERIA, objectFilter);
  return (
    <section className="dq-filter-panel">
      <details>
        <summary>
          <span>Queue filters</span>
          <span className="dq-filter-count">
            {activeCount} active{overridden ? " · adjusted" : ""}
          </span>
        </summary>
        <div className="dq-filter-panel-body">
          {activeCount ? (
            <div
              className={disabled ? "dq-filter-chips-disabled" : undefined}
              aria-disabled={disabled || undefined}
              inert={disabled ? true : undefined}
            >
              <ActiveObjectFilterChips
                criteriaDefinitions={VIDEO_CRITERIA}
                objectFilter={objectFilter}
                onRemove={() => undefined}
                onEdit={() => {
                  if (!disabled) setFiltersOpen(true);
                }}
                ariaLabel="Current queue filters"
                removable={false}
              />
            </div>
          ) : (
            <p>No video filters. All videos can enter the queue.</p>
          )}
          <div className="dq-filter-panel-actions">
            <button
              type="button"
              className="dq-button"
              disabled={disabled}
              onClick={() => setFiltersOpen(true)}
            >
              Adjust filters
            </button>
            {overridden && (
              <button
                type="button"
                className="dq-button"
                disabled={disabled}
                onClick={onReset}
              >
                Reset filters to review defaults
              </button>
            )}
          </div>
        </div>
      </details>
      {filtersOpen && (
        <div onKeyDown={(event) => event.stopPropagation()}>
          <FilterDialog
            open
            onClose={() => setFiltersOpen(false)}
            criteria={VIDEO_CRITERIA}
            activeFilter={objectFilter}
            supportsFilterExpressions
            subjectLabel="videos"
            onApply={(nextFilter) => {
              if (disabled) return;
              onApply(nextFilter);
              setFiltersOpen(false);
            }}
          />
        </div>
      )}
    </section>
  );
}

export function QueueEditor({
  draft,
  onChange,
  presentation = true,
  queue = true,
}: {
  draft: VideoReview;
  onChange(review: VideoReview): void;
  presentation?: boolean;
  queue?: boolean;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filter = draft.view.filter;
  const updateFilter = (change: Record<string, unknown>) =>
    onChange({
      ...draft,
      view: { ...draft.view, filter: { ...filter, ...change } },
    });
  const settings = draft.presentation ?? {};
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
                {!VIDEO_SORT_OPTIONS.some((o) => o.value === filter.sort) &&
                  filter.sort != null && (
                    <option value={String(filter.sort)}>
                      {String(filter.sort)}
                    </option>
                  )}
                {VIDEO_SORT_OPTIONS.map((o) => (
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
              Videos per page
              <input
                type="number"
                min="1"
                max="100"
                value={Number(filter.perPage) || 40}
                onChange={(e) =>
                  updateFilter({
                    perPage: Math.max(
                      1,
                      Math.min(100, Number(e.target.value) || 40),
                    ),
                  })
                }
              />
            </label>
          </div>
          <button
            type="button"
            className="dq-button"
            onClick={() => setFiltersOpen(true)}
          >
            Edit video filters
          </button>
          <p>
            {Object.keys(draft.view.objectFilter).length
              ? "Video filters configured"
              : "No video filters"}
            . Choose which videos enter the queue.
          </p>
          {filtersOpen && (
            <div onKeyDown={(e) => e.stopPropagation()}>
              <FilterDialog
                open
                onClose={() => setFiltersOpen(false)}
                criteria={VIDEO_CRITERIA}
                activeFilter={draft.view.objectFilter}
                supportsFilterExpressions
                subjectLabel="videos"
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
            Choose how videos and tags appear while reviewing.
          </p>
          <div className="dq-field-grid">
            <label>
              Preferred view
              <select
                value={draft.view.displayMode === "wall" ? "wall" : "grid"}
                onChange={(e) =>
                  onChange({
                    ...draft,
                    view: {
                      ...draft.view,
                      displayMode: e.target.value as "grid" | "wall",
                    },
                  })
                }
              >
                {["grid", "wall"].map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </label>
          </div>
          <h4>Card annotations</h4>
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
              <p>
                Choose parent tags. Only their descendant tags appear on the
                card; no tags appear until a parent is selected.
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
          <h4>Tag bins</h4>
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
        </>
      )}
    </>
  );
}
