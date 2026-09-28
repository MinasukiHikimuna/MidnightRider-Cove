import { useMemo, useRef, type ReactNode, type RefObject } from "react";
import { ArrowDown, ArrowUp, Download, Film, Plus, Upload } from "@cove/runtime/lucide-react";
import { mediaLabel } from "./api";
import { MoreMenu, type MoreMenuItem } from "./ReviewHeader";
import { REVIEW_KIND_NAMES, ReviewEntityIcon } from "./ReviewEntityIcon";
import { isOccurrenceReview, mediaKindOf, reviewEntityType, type Review } from "./model";

export type ReviewSort = "name" | "count";
export type SortDirection = "asc" | "desc";
/** Matching items per review id: absent while counting, null when the count failed. */
export type ReviewCounts = Record<string, number | null>;
/** How the list is sorted. */
export interface ListOrder {
  sort: ReviewSort;
  direction: SortDirection;
}

/** The list's sort is remembered per browser, apart from the reviews. */
const LIST_ORDER_KEY = "data-quality.reviews-sort.v1";
const DEFAULT_LIST_ORDER: ListOrder = { sort: "name", direction: "asc" };

/** The sort this browser last used, or by name ascending when there is none it can read. */
export function readListOrder(): ListOrder {
  try {
    const stored: unknown = JSON.parse(localStorage.getItem(LIST_ORDER_KEY) ?? "null");
    if (stored && typeof stored === "object") {
      const { sort, direction } = stored as Partial<Record<keyof ListOrder, unknown>>;
      if ((sort === "name" || sort === "count") && (direction === "asc" || direction === "desc"))
        return { sort, direction };
    }
  } catch {
    // Storage that cannot be read, or a value that is not ours: the default order.
  }
  return DEFAULT_LIST_ORDER;
}

export function writeListOrder(order: ListOrder): void {
  try {
    localStorage.setItem(
      LIST_ORDER_KEY,
      JSON.stringify({ sort: order.sort, direction: order.direction }),
    );
  } catch {
    // Without storage the choice lasts while the page stays open.
  }
}

/**
 * The list's order: by name, or by matching count with the reviews still counting or without a
 * count last; ties go by name. Natural order, case-insensitive.
 */
export function sortReviews(
  reviews: readonly Review[],
  counts: ReviewCounts,
  sort: ReviewSort,
  direction: SortDirection,
): Review[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...reviews].sort((left, right) => {
    if (sort === "count") {
      const leftCount = counts[left.id];
      const rightCount = counts[right.id];
      const leftKnown = typeof leftCount === "number";
      const rightKnown = typeof rightCount === "number";
      if (leftKnown !== rightKnown) return leftKnown ? -1 : 1;
      if (leftKnown && rightKnown && leftCount !== rightCount)
        return (leftCount - rightCount) * sign;
    }
    return (
      left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: "base" }) * sign
    );
  });
}

/** What a review's queue counts: videos, audios, tags, or scenes (audios) for occurrences. */
function countNoun(review: Review, count: number): string {
  const entityType = reviewEntityType(review);
  const media = mediaLabel(mediaKindOf(entityType));
  const one =
    entityType === "tag" ? "tag" : isOccurrenceReview(review) ? media.queue : media.one;
  return count === 1 ? one : `${one}s`;
}

function MatchingCount({ review, count }: { review: Review; count: number | null | undefined }) {
  if (count === undefined)
    return (
      <>
        <span aria-hidden="true">…</span>
        <span className="dq-sr-only">Counting matching {countNoun(review, 2)}</span>
      </>
    );
  if (count === null)
    return (
      <>
        <span aria-hidden="true" title="The count could not be loaded">
          —
        </span>
        <span className="dq-sr-only">Matching {countNoun(review, 1)} count unavailable</span>
      </>
    );
  return (
    <>
      <span aria-hidden="true">{count.toLocaleString()}</span>
      <span className="dq-sr-only">
        {count.toLocaleString()} matching {countNoun(review, count)}
      </span>
    </>
  );
}

/**
 * All reviews: the page header with Import, Export all and New review, a line with the number of
 * reviews, where they are kept and the sort order, then a table of the reviews (type, name and
 * description, kind, matching items) whose names open them and whose menus edit, duplicate, export
 * or delete them. Matching counts load per review and show as they arrive.
 */
export function ReviewList({
  reviews,
  counts,
  sort,
  direction,
  onSortChange,
  onDirectionChange,
  storage,
  canConfigure,
  busy,
  headingRef,
  notices,
  onOpen,
  onNew,
  onImport,
  onExportAll,
  rowMenuItems,
}: {
  reviews: readonly Review[];
  counts: ReviewCounts;
  sort: ReviewSort;
  direction: SortDirection;
  onSortChange(sort: ReviewSort): void;
  onDirectionChange(direction: SortDirection): void;
  /** Where the reviews are kept, after their number: "saved to your account". */
  storage: string;
  /** Saved filter write access (or browser-only storage): reviews can be created and changed. */
  canConfigure: boolean;
  /** An import is being read or saved. */
  busy: boolean;
  /** The page heading, which takes focus when the list is shown again. */
  headingRef: RefObject<HTMLHeadingElement | null>;
  /** The page's notices and what the last list action did, under the header. */
  notices?: ReactNode;
  onOpen(id: string): void;
  onNew(): void;
  onImport(file: File): void;
  onExportAll(): void;
  rowMenuItems(review: Review): MoreMenuItem[];
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const sorted = useMemo(
    () => sortReviews(reviews, counts, sort, direction),
    [reviews, counts, sort, direction],
  );
  const counted = reviews.every((item) => counts[item.id] !== undefined);
  const sortOrder = direction === "asc" ? "ascending" : "descending";
  return (
    <div className="dq-reviews-page">
      <header className="dq-reviews-header">
        <h1 ref={headingRef} tabIndex={-1}>
          Data Quality
        </h1>
        <div className="dq-reviews-header-actions">
          <button
            type="button"
            className="dq-header-button"
            title="Add the reviews in a review file"
            disabled={!canConfigure || busy}
            onClick={() => fileInput.current?.click()}
          >
            <Upload aria-hidden="true" />
            Import
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            hidden
            tabIndex={-1}
            onChange={(event) => {
              const file = event.target.files?.[0];
              // The same file can be chosen again after a refused import.
              event.target.value = "";
              if (file) onImport(file);
            }}
          />
          <button
            type="button"
            className="dq-header-button"
            title="Download every review as one review file"
            disabled={!reviews.length}
            onClick={onExportAll}
          >
            <Download aria-hidden="true" />
            Export all
          </button>
          <button
            type="button"
            className="dq-header-button dq-header-button-primary"
            disabled={!canConfigure || busy}
            onClick={onNew}
          >
            <Plus aria-hidden="true" />
            New review
          </button>
        </div>
      </header>
      {notices}
      {reviews.length ? (
        <section className="dq-reviews" aria-label="Reviews">
          <div className="dq-reviews-bar">
            <p className="dq-reviews-summary">
              {reviews.length === 1 ? "1 review" : `${reviews.length.toLocaleString()} reviews`} ·{" "}
              {storage}
            </p>
            <span className="dq-sr-only" role="status">
              {counted
                ? reviews.some((item) => counts[item.id] === null)
                  ? "Review counts loaded; some counts are unavailable."
                  : "Review counts loaded."
                : ""}
            </span>
            <div className="dq-reviews-sort">
              <label>
                <span>Sort by</span>
                <select
                  className="dq-select"
                  value={sort}
                  onChange={(event) => onSortChange(event.target.value as ReviewSort)}
                >
                  <option value="name">Name</option>
                  <option value="count">Matching items</option>
                </select>
              </label>
              <button
                type="button"
                className="dq-icon-button dq-reviews-direction"
                aria-label={`Sort direction: ${sortOrder}`}
                title={`Sort direction: ${sortOrder}`}
                onClick={() => onDirectionChange(direction === "asc" ? "desc" : "asc")}
              >
                {direction === "asc" ? (
                  <ArrowUp aria-hidden="true" />
                ) : (
                  <ArrowDown aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <table className="dq-reviews-table">
            <thead>
              <tr>
                <th scope="col" aria-sort={sort === "name" ? sortOrder : undefined}>
                  Review
                </th>
                <th scope="col" className="dq-reviews-type">
                  Type
                </th>
                <th
                  scope="col"
                  className="dq-reviews-count"
                  aria-sort={sort === "count" ? sortOrder : undefined}
                >
                  Matching
                </th>
                <th scope="col" className="dq-reviews-actions">
                  <span className="dq-sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((item) => {
                const entityType = reviewEntityType(item);
                return (
                  <tr key={item.id}>
                    <td>
                      <a
                        className="dq-reviews-link"
                        href={`?review=${encodeURIComponent(item.id)}`}
                        data-review-id={item.id}
                        onClick={(event) => {
                          // Opened in this tab without reloading; modified clicks keep the
                          // browser's own behaviour, such as a new tab.
                          if (
                            event.button !== 0 ||
                            event.metaKey ||
                            event.ctrlKey ||
                            event.shiftKey ||
                            event.altKey
                          )
                            return;
                          event.preventDefault();
                          onOpen(item.id);
                        }}
                      >
                        <span className="dq-reviews-icon">
                          <ReviewEntityIcon entityType={entityType} />
                        </span>
                        <span className="dq-reviews-text">
                          <span className="dq-reviews-name">{item.name}</span>
                          {item.description && (
                            <span className="dq-reviews-description" title={item.description}>
                              {item.description}
                            </span>
                          )}
                        </span>
                      </a>
                    </td>
                    <td className="dq-reviews-type">{REVIEW_KIND_NAMES[entityType]}</td>
                    <td className="dq-reviews-count">
                      <MatchingCount review={item} count={counts[item.id]} />
                    </td>
                    <td className="dq-reviews-actions">
                      <MoreMenu label={`Actions for ${item.name}`} items={rowMenuItems(item)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ) : (
        <div className="dq-empty">
          <Film aria-hidden="true" />
          <p>No reviews yet.</p>
          <p>
            {canConfigure
              ? "New review creates one; Import adds the reviews in a review file."
              : "Reviews can be added once saved filter write permission is granted."}
          </p>
        </div>
      )}
    </div>
  );
}
