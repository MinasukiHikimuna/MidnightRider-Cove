import {
  Fragment,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type RefObject,
} from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  LayoutGrid,
  Pencil,
  RectangleHorizontal,
  RotateCcw,
  Save,
} from "@cove/runtime/lucide-react";
import { REVIEW_ENTITY_LABELS, ReviewEntityIcon } from "./ReviewEntityIcon";
import { useMediaQuery } from "./viewport";
import { isComposingKey, type ReviewEntityType } from "./model";

/**
 * What the header offers while the queue differs from the saved review: Save to review, unless
 * only queue tag bins differ (no save keeps them), and Reset.
 */
export interface QueueChange {
  /** Absent while only queue tag bins differ: then Reset alone is offered. */
  onSave?(): void;
  saveDisabled?: boolean;
  onReset(): void;
  resetDisabled?: boolean;
}

/** Said politely when the queue starts to differ, as the buttons alone carry no visible note. */
export const QUEUE_DIFFERS_ANNOUNCEMENT = "The queue differs from the saved review.";

/**
 * The review's single header row and the chip row beneath it. The host list toolbar goes in the
 * middle; it renders its controls row and its filter chips as two siblings, which the header's
 * scoped CSS places on the first and second row (see .dq-review-header in styles.css). The chip
 * row takes no room while it has nothing to show.
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
  trailingEnd,
  queueChange,
  queueDiffers,
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
  /** Controls after the toolbar: Scope, Single/Grid, Cards/Wall. */
  trailing: ReactNode;
  /** The header's last controls, after Save to review and Reset: Batch… and More. */
  trailingEnd?: ReactNode;
  /**
   * The queue differs from the saved review and no draft is being previewed: Save to review and
   * Reset join the header row just before Batch… and More.
   */
  queueChange?: QueueChange;
  /**
   * Whether the queue differs from the saved review, whether or not the editor drawer is open;
   * undefined while the view is still reading its query. The header announces when it becomes
   * true, but not when it first learns so (a view opening on a differing queue says nothing).
   */
  queueDiffers?: boolean;
  /** Chip row, before the host's filter chips. */
  chipsStart?: ReactNode;
  /** Chip row, right after the host's filter chips (the grid's tag bins). */
  chipsAfter?: ReactNode;
  /** Chip row, right-aligned. */
  chipsEnd?: ReactNode;
}) {
  const header = useRef<HTMLElement>(null);
  useOneRowHeader(header);
  const handOffFocus = useQueueFocusHandOff(header);
  // Announced when the queue starts to differ, and cleared when it no longer does, so the next
  // difference is announced again. What the header learns from nothing (undefined) is taken in
  // quietly. The drawer hides the buttons, not the difference, so closing it says nothing new.
  const [announcement, setAnnouncement] = useState({ differs: queueDiffers, text: "" });
  if (announcement.differs !== queueDiffers)
    setAnnouncement({
      differs: queueDiffers,
      text: !queueDiffers
        ? ""
        : announcement.differs === false
          ? QUEUE_DIFFERS_ANNOUNCEMENT
          : announcement.text,
    });
  return (
    <header ref={header} className="dq-review-header">
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
      <div className="dq-review-header-trail">
        {trailing}
        {queueChange && <QueueChangeButtons change={queueChange} onPress={handOffFocus} />}
        {trailingEnd}
      </div>
      <div className="dq-review-header-break" aria-hidden="true" />
      {chipsStart}
      {chipsAfter && <div className="dq-review-chips-after">{chipsAfter}</div>}
      {chipsEnd && <div className="dq-review-chips-end">{chipsEnd}</div>}
      {/* Always present, so the announcement is heard when its text changes. */}
      <p className="dq-sr-only" aria-live="polite">
        {announcement.text}
      </p>
    </header>
  );
}

/**
 * Save to review and Reset in a quiet tint, their explanation in a tooltip and as their
 * accessible description. The labels sit in spans so a crowded header can show only the icons
 * (see useOneRowHeader) while the names stay for assistive technology.
 */
function QueueChangeButtons({
  change,
  onPress,
}: {
  change: QueueChange;
  /** Called as either is pressed, before its action (see useQueueFocusHandOff). */
  onPress(): void;
}) {
  const saveNote = useId();
  const resetNote = useId();
  const saveText = `${QUEUE_DIFFERS_ANNOUNCEMENT} Save these filters to the review.`;
  const resetText = change.onSave
    ? `${QUEUE_DIFFERS_ANNOUNCEMENT} Go back to the review's saved filters.`
    : "Only the queue's tag bins differ from the saved review, and no save keeps them. " +
      "Go back to the review's saved filters.";
  return (
    <>
      {change.onSave && (
        <button
          type="button"
          className="dq-header-button dq-queue-button"
          title={saveText}
          aria-describedby={saveNote}
          disabled={change.saveDisabled}
          onClick={() => {
            onPress();
            change.onSave?.();
          }}
        >
          <Save aria-hidden="true" />
          <span className="dq-queue-label">Save to review</span>
          <span id={saveNote} hidden>
            {saveText}
          </span>
        </button>
      )}
      <button
        type="button"
        className="dq-header-button dq-queue-button"
        title={resetText}
        aria-describedby={resetNote}
        disabled={change.resetDisabled}
        onClick={() => {
          onPress();
          change.onReset();
        }}
      >
        <RotateCcw aria-hidden="true" />
        <span className="dq-queue-label">Reset</span>
        <span id={resetNote} hidden>
          {resetText}
        </span>
      </button>
    </>
  );
}

/**
 * What gives way, in this order, when the header's first row would otherwise wrap: Save to
 * review's and Reset's labels while they are there (icons and names stay), the Scope summary, the
 * review name's width (a rem at a time, down to 6rem), the Single/Grid labels (after the name, as
 * the grid's Grid icon looks much like Cards beside it), then the range text. The header wraps
 * rather than shrinks (its chip row is part of the same flex container), so each step is tried in
 * turn.
 */
export const HEADER_COMPACT_STEPS = ["queue", "summary", "name", "layout", "range"] as const;
/** What each step acts on: a header without it skips the step. */
const COMPACT_STEP_TARGETS: Record<(typeof HEADER_COMPACT_STEPS)[number], string> = {
  queue: ".dq-queue-button",
  summary: ".dq-scope-summary",
  name: ".dq-review-header-lead h1",
  layout: ".dq-layout-switch",
  range: ".dq-review-toolbar > div:first-of-type > div:first-child > span:first-child",
};
/** Narrower windows wrap the header by design. */
export const ONE_ROW_HEADER_QUERY = "(min-width: 1400px)";

/**
 * Whether the header's first row holds everything: the trail ends it, so once the trail starts
 * below the lead the row has wrapped. Without a layout (nothing measured) there is nothing to fit.
 */
function firstRowFits(header: HTMLElement): boolean {
  const lead = header.querySelector(".dq-review-header-lead");
  const trail = header.querySelector(".dq-review-header-trail");
  if (!lead || !trail) return true;
  const start = lead.getBoundingClientRect();
  return !start.height || trail.getBoundingClientRect().top < start.bottom;
}

/**
 * Lays the header out afresh, then takes HEADER_COMPACT_STEPS until its first row fits (listed in
 * data-compact, which styles.css follows; the name's narrower width is set on it directly). A row
 * that still wraps after every step gets everything back, wrapping as narrower windows do. Returns
 * false then.
 */
function fitHeader(header: HTMLElement, wide: boolean): boolean {
  const name = header.querySelector<HTMLElement>(".dq-review-header-lead h1");
  const restore = () => {
    header.removeAttribute("data-compact");
    name?.style.removeProperty("max-width");
  };
  restore();
  if (!wide) return true;
  const steps = HEADER_COMPACT_STEPS.filter((step) =>
    header.querySelector(COMPACT_STEP_TARGETS[step]),
  );
  for (let taken = 1; taken <= steps.length && !firstRowFits(header); taken++) {
    header.dataset.compact = steps.slice(0, taken).join(" ");
    if (steps[taken - 1] !== "name" || !name) continue;
    // Only as narrow as the row needs, so as much of the name as possible stays readable.
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    let width = name.getBoundingClientRect().width;
    while (!firstRowFits(header) && width > 6 * rem) {
      width = Math.max(6 * rem, width - rem);
      name.style.maxWidth = `${width}px`;
    }
  }
  if (firstRowFits(header)) return true;
  restore();
  return false;
}

/**
 * Keeps the header on one row in windows 1400 px and wider, taking only as many
 * HEADER_COMPACT_STEPS as that needs; narrower windows wrap it by design.
 */
function useOneRowHeader(header: RefObject<HTMLElement | null>) {
  const wide = useMediaQuery(ONE_ROW_HEADER_QUERY);
  // Bumped when the header or its ends change size (the window, the name, the scope summary, the
  // queue's buttons, a font): the header is fitted again after the change, never inside the
  // observer's callback, so fitting never resizes an element while the observer reports on it.
  const [resized, setResized] = useState(0);
  // The last fit found no single row: renders do not retry it until a size changes.
  const unfit = useRef(false);
  useLayoutEffect(() => {
    if (header.current) unfit.current = !fitHeader(header.current, wide);
  }, [header, wide, resized]);
  // After any other render, a row that has wrapped since (a longer range, a filter count, Save to
  // review and Reset joining it) is fitted again before it is painted. One that fits is left as
  // it is.
  useLayoutEffect(() => {
    const element = header.current;
    if (element && wide && !unfit.current && !firstRowFits(element))
      unfit.current = !fitHeader(element, wide);
  });
  useEffect(() => {
    const element = header.current;
    if (!element || !wide || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => setResized((value) => value + 1));
    observer.observe(element);
    for (const end of element.querySelectorAll(".dq-review-header-lead, .dq-review-header-trail"))
      observer.observe(end);
    return () => observer.disconnect();
  }, [header, wide]);
}

/**
 * Save to review and Reset leave the header once they have done their work, and wait disabled
 * while they do, which would drop focus to the page. Pressing one hands focus on once the page has
 * settled: to a queue button still offered (Save to review that failed, or Reset when tag bins
 * outlive a save), otherwise to More, which closes the header's row in every view. Focus the
 * reviewer, or the view, moved elsewhere meanwhile stays where it is. Returns what the buttons call
 * when pressed.
 */
function useQueueFocusHandOff(header: RefObject<HTMLElement | null>): () => void {
  const pending = useRef(false);
  useEffect(() => {
    const element = header.current;
    if (!pending.current || !element) return;
    const active = document.activeElement;
    const onButton = active?.closest<HTMLButtonElement>(".dq-queue-button") ?? null;
    if (active && active !== document.body && !onButton) {
      pending.current = false;
      return;
    }
    // Nothing has happened yet: look again after the next render.
    if (onButton && !onButton.disabled) return;
    const target =
      element.querySelector<HTMLButtonElement>(".dq-queue-button") ??
      element.querySelector<HTMLButtonElement>(".dq-review-header-trail .dq-menu > button");
    // Still at work: the buttons wait disabled, and More while the queue reloads.
    if (!target || target.disabled) return;
    pending.current = false;
    target.focus();
  });
  return () => {
    pending.current = true;
  };
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
            // Keys composing a character (full-width digits) belong to the input method.
            if (isComposingKey(event)) return;
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

/**
 * The review's transient layout for this visit: one item at a time, or the card grid. The labels
 * sit in spans so a crowded header can show only the icons (see useOneRowHeader), their titles
 * saying what each shows.
 */
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
    <div className="dq-segmented dq-layout-switch" role="group" aria-label="Review layout">
      <button
        type="button"
        title="One item at a time"
        aria-pressed={mode === "single"}
        disabled={disabled}
        onClick={() => mode !== "single" && onChange("single")}
      >
        <RectangleHorizontal aria-hidden="true" />
        <span className="dq-layout-label">Single</span>
      </button>
      <button
        type="button"
        title="Cards in a grid"
        aria-pressed={mode === "multiple"}
        disabled={disabled}
        onClick={() => mode !== "multiple" && onChange("multiple")}
      >
        <LayoutGrid aria-hidden="true" />
        <span className="dq-layout-label">Grid</span>
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
