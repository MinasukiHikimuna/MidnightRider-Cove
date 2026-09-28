import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  Pencil,
  RectangleHorizontal,
} from "@cove/runtime/lucide-react";
import { REVIEW_ENTITY_LABELS, ReviewEntityIcon } from "./ReviewEntityIcon";
import type { ReviewEntityType } from "./model";

/**
 * The review's single header row and the chip row beneath it. The host list toolbar goes in the
 * middle; it renders its controls row and its filter chips as two siblings, which the header's
 * scoped CSS places on the first and second row (see .dq-review-header in styles.css).
 */
export function ReviewHeader({
  name,
  description,
  entityType,
  onBack,
  backDisabled,
  onEdit,
  editDisabled,
  editing = false,
  toolbar,
  trailing,
  chipsStart,
  chipsAfter,
  chipsEnd,
}: {
  name: string;
  description?: string;
  entityType: ReviewEntityType;
  onBack?(): void;
  backDisabled?: boolean;
  onEdit?(): void;
  editDisabled?: boolean;
  /** The editor drawer is open; Edit review then takes focus back to it. */
  editing?: boolean;
  /** The host list toolbar, wrapped in .dq-review-toolbar. */
  toolbar: ReactNode;
  /** Controls after the toolbar: Scope, Batch…, Single/Grid, Cards/Wall, More. */
  trailing: ReactNode;
  /** Chip row, before the host's filter chips. */
  chipsStart?: ReactNode;
  /** Chip row, right after the host's filter chips (the grid's tag bins). */
  chipsAfter?: ReactNode;
  /** Chip row, right-aligned. */
  chipsEnd?: ReactNode;
}) {
  return (
    <header className="dq-review-header">
      <div className="dq-review-header-lead">
        {onBack && (
          <button
            type="button"
            className="dq-icon-button"
            aria-label="All reviews"
            title="All reviews"
            disabled={backDisabled}
            onClick={onBack}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
        )}
        <span className="dq-review-type" title={REVIEW_ENTITY_LABELS[entityType]}>
          <ReviewEntityIcon entityType={entityType} />
        </span>
        <h1 title={description || name}>{name}</h1>
        {description && <p className="dq-sr-only">{description}</p>}
        {onEdit && (
          <button
            type="button"
            className="dq-icon-button dq-icon-button-small"
            aria-label="Edit review"
            title="Edit review"
            aria-haspopup="dialog"
            aria-expanded={editing}
            disabled={editDisabled}
            onClick={onEdit}
          >
            <Pencil aria-hidden="true" />
          </button>
        )}
        <span className="dq-review-header-divider" aria-hidden="true" />
      </div>
      {toolbar}
      <div className="dq-review-header-trail">{trailing}</div>
      <div className="dq-review-header-break" aria-hidden="true" />
      {chipsStart}
      {chipsAfter && <div className="dq-review-chips-after">{chipsAfter}</div>}
      {chipsEnd && <div className="dq-review-chips-end">{chipsEnd}</div>}
    </header>
  );
}

/**
 * "‹ page / pages ›" for the toolbar's byline. The number opens a field to go to any page, so the
 * first and last pages stay one step away.
 */
export function ReviewPager({
  page,
  pages,
  onPage,
}: {
  page: number;
  pages: number;
  onPage(page: number): void;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (editing) input.current?.select();
  }, [editing]);
  const close = (restoreFocus: boolean) => {
    setEditing(false);
    if (restoreFocus) requestAnimationFrame(() => opener.current?.focus());
  };
  const go = () => {
    const target = Math.round(Number(text));
    close(true);
    if (Number.isFinite(target) && target >= 1 && target !== page)
      onPage(Math.min(pages, target));
  };
  return (
    <span className="dq-pager">
      <button
        type="button"
        className="dq-icon-button"
        aria-label="Previous page"
        title="Previous page"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        <ChevronLeft aria-hidden="true" />
      </button>
      {editing ? (
        <input
          ref={input}
          type="number"
          className="dq-pager-input"
          aria-label={`Go to page, 1 to ${pages}`}
          min={1}
          max={pages}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              go();
            } else if (event.key === "Escape") {
              event.preventDefault();
              event.stopPropagation();
              close(true);
            }
          }}
          onBlur={() => close(false)}
        />
      ) : (
        <button
          ref={opener}
          type="button"
          className="dq-pager-page"
          aria-label={`Page ${page} of ${pages}. Go to page`}
          title="Go to page"
          disabled={pages <= 1}
          onClick={() => {
            setText(String(page));
            setEditing(true);
          }}
        >
          {page} / {pages}
        </button>
      )}
      <button
        type="button"
        className="dq-icon-button"
        aria-label="Next page"
        title="Next page"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        <ChevronRight aria-hidden="true" />
      </button>
    </span>
  );
}

/** The review's transient layout for this visit: one item at a time, or the card grid. */
export function LayoutSwitch({
  mode,
  disabled,
  onChange,
}: {
  mode: "single" | "multiple";
  disabled?: boolean;
  onChange(mode: "single" | "multiple"): void;
}) {
  return (
    <div className="dq-segmented" role="group" aria-label="Review layout">
      <button
        type="button"
        aria-pressed={mode === "single"}
        disabled={disabled}
        onClick={() => mode !== "single" && onChange("single")}
      >
        <RectangleHorizontal aria-hidden="true" />
        Single
      </button>
      <button
        type="button"
        aria-pressed={mode === "multiple"}
        disabled={disabled}
        onClick={() => mode !== "multiple" && onChange("multiple")}
      >
        <LayoutGrid aria-hidden="true" />
        Grid
      </button>
    </div>
  );
}

/**
 * How the card grid shows its items: Cards or Wall (autoplaying previews) for videos, Cards or
 * List for tags. Icon buttons, named for assistive technology and on hover.
 */
export function CardViewSwitch<T extends string>({
  options,
  value,
  disabled,
  onChange,
}: {
  options: ReadonlyArray<{ value: T; label: string; icon: ReactNode }>;
  value: T;
  disabled?: boolean;
  onChange(value: T): void;
}) {
  return (
    <div className="dq-segmented dq-segmented-icons" role="group" aria-label="Card view">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-label={option.label}
          title={option.label}
          aria-pressed={value === option.value}
          disabled={disabled}
          onClick={() => value !== option.value && onChange(option.value)}
        >
          {option.icon}
        </button>
      ))}
    </div>
  );
}

export interface MoreMenuItem {
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  /** Destructive, such as Delete…: drawn in the danger colour. */
  danger?: boolean;
  /** Starts a new group of items, after a divider. */
  separated?: boolean;
  onSelect(): void;
}

/**
 * A menu button with its menu, "More review options" unless labelled otherwise (a reviews-list row
 * names its review); ↑/↓ move, Esc or Tab closes. The menu opens upwards when the window has no
 * room for it below the button.
 */
export function MoreMenu({
  items,
  disabled,
  label = "More review options",
}: {
  items: MoreMenuItem[];
  disabled?: boolean;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const [upwards, setUpwards] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuId = useId();
  useLayoutEffect(() => {
    if (!open || !menu.current || !button.current) return;
    const anchor = button.current.getBoundingClientRect();
    const needed = menu.current.offsetHeight + 12;
    const below = window.innerHeight - anchor.bottom;
    setUpwards(below < needed && anchor.top > below);
  }, [open]);
  useEffect(() => {
    // Without scrolling: an item of a menu about to open upwards would scroll the page first.
    if (open)
      menu.current
        ?.querySelector<HTMLElement>('[role="menuitem"]:not(:disabled)')
        ?.focus({ preventScroll: true });
  }, [open]);
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);
  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) button.current?.focus();
  };
  // On the wrapper, so Esc and Tab also work from the button, for example when no item is
  // available to take focus.
  const handleKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!open) return;
    const entries = [
      ...(menu.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not(:disabled)') ?? []),
    ];
    const index = entries.indexOf(document.activeElement as HTMLElement);
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      close();
    } else if (event.key === "Tab") {
      close(false);
    } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!entries.length) return;
      const step = event.key === "ArrowDown" ? 1 : -1;
      entries[(index + step + entries.length) % entries.length].focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      entries.at(event.key === "Home" ? 0 : -1)?.focus();
    }
  };
  return (
    <div className={`dq-menu${open ? " dq-menu-open" : ""}`} onKeyDown={handleKey}>
      <button
        ref={button}
        type="button"
        className="dq-icon-button"
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="dq-menu-backdrop" aria-hidden="true" onMouseDown={() => close(false)} />
          <div
            ref={menu}
            id={menuId}
            role="menu"
            aria-label={label}
            className={`dq-menu-list${upwards ? " dq-menu-list-up" : ""}`}
          >
            {items.map((item) => (
              <Fragment key={item.label}>
                {item.separated && <div role="separator" className="dq-menu-separator" />}
                <button
                  type="button"
                  role="menuitem"
                  className={item.danger ? "dq-menu-danger" : undefined}
                  disabled={item.disabled}
                  onClick={() => {
                    // Focus goes back to the button first, so whatever the item opens (a dialog)
                    // returns focus there when it closes.
                    close();
                    item.onSelect();
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
