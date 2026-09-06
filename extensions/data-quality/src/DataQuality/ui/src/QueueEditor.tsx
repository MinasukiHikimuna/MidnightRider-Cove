import { useState } from "react";
import {
  FilterDialog,
  VIDEO_CRITERIA,
  VIDEO_SORT_OPTIONS,
  EntityReferenceMultiSelector,
} from "@cove/runtime/components";
import type { VideoReview } from "./model";

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
                value={
                  draft.view.displayMode === "tagger"
                    ? "grid"
                    : draft.view.displayMode
                }
                onChange={(e) =>
                  onChange({
                    ...draft,
                    view: {
                      ...draft.view,
                      displayMode: e.target.value as "grid" | "list" | "wall",
                    },
                  })
                }
              >
                {["grid", "list", "wall"].map((mode) => (
                  <option key={mode}>{mode}</option>
                ))}
              </select>
            </label>
            <label>
              Preferred card width
              <select
                value={settings.cardSize ?? 180}
                onChange={(e) =>
                  updatePresentation({
                    cardSize: Number(e.target.value),
                  })
                }
              >
                {[130, 180, 260, 380].map((size) => (
                  <option key={size} value={size}>
                    {size} px
                  </option>
                ))}
              </select>
            </label>
          </div>
          <h4>Card annotations</h4>
          <div className="dq-annotation-options">
            {(["date", "studio", "performers", "tags"] as const).map((name) => {
              const selected = settings.annotations ?? [
                "date",
                "studio",
                "performers",
              ];
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
          <p>
            Show annotated tags only below these parents (empty means all tags).
          </p>
          <EntityReferenceMultiSelector
            entityType="tag"
            values={settings.annotationParents ?? []}
            onChange={(annotationParents) =>
              updatePresentation({ annotationParents })
            }
            allowCreate={false}
          />
          <h4>Tag bins</h4>
          <p>
            Choose parent tags. Their descendants become temporary queue
            filters. Counts describe the loaded page.
          </p>
          <EntityReferenceMultiSelector
            entityType="tag"
            values={settings.binParents ?? []}
            onChange={(binParents) => updatePresentation({ binParents })}
            allowCreate={false}
          />
        </>
      )}
    </>
  );
}
