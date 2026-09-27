import {
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent as ReactFocusEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { Pencil, Search } from "@cove/runtime/lucide-react";
import {
  KeyCap,
  createActionPreviewStore,
  useActionPreview,
  type ActionPreviewStore,
} from "./ActionPad";
import { actionEffectParts, actionTagIds } from "./FindAction";
import type { TagTrees } from "./effectPreview";
import { ACTION_KEYS, type ReviewAction } from "./model";
import { useReviewKeyLabels } from "./reviewKeys";
import { useTagNames } from "./tagNames";

type TagGroups = ReadonlyArray<{ id: number; name: string }>;

/**
 * The card grid's actions, in one bar under the cards (and at the foot of the grid preview): what
 * the actions apply to, then a compact tile per action key (key cap and label, wrapping onto more
 * rows when needed) and Find action, which also reaches the actions past the last key. Tiles
 * share the pad's key caps and effect wording: pointing at or focusing one shows what it changes
 * above the bar, and the tile carries the same text as its description.
 */
export function ActionBar({
  actions,
  tagGroups,
  trees,
  isDisabled,
  busy,
  onApply,
  onFind,
  summary,
  hints,
  notices,
  status,
  className = "",
  paused = false,
}: {
  actions: readonly ReviewAction[];
  /** Names the groups tag actions assign. */
  tagGroups?: TagGroups;
  /** Resolved removal trees, for "− rest of <tree>" wording. */
  trees?: TagTrees;
  isDisabled(action: ReviewAction): boolean;
  /** A write or load is running: tiles refuse input without fading. */
  busy: boolean;
  onApply(action: ReviewAction): void;
  onFind(): void;
  /** What the actions apply to, and any selection controls. */
  summary: ReactNode;
  /** Right-hand hint or note. */
  hints?: ReactNode;
  /** Messages shown just above the bar. */
  notices?: ReactNode;
  /** Read out while an action runs. */
  status?: string;
  className?: string;
  /** The review is being edited: every tile is disabled and dimmed, and the bar says why. */
  paused?: boolean;
}) {
  const keys = useReviewKeyLabels();
  const baseId = useId();
  const names = useTagNames(useMemo(() => actionTagIds(actions), [actions]));
  const [preview] = useState(() => createActionPreviewStore<ReviewAction>());
  const bar = useRef<HTMLElement>(null);
  const stacked = useStackedLayout(bar, actions);
  const keyed = actions.slice(0, ACTION_KEYS.length);
  const extra = actions.length - keyed.length;
  const effectText = (action: ReviewAction) =>
    actionEffectParts(action, names, tagGroups, trees)
      .map((part) => part.text)
      .join(", ");
  const previewHandlers = (action: ReviewAction) => ({
    onMouseEnter: () => preview.set(action),
    onMouseLeave: () => preview.clear(action),
    onFocus: () => preview.set(action),
    onBlur: (event: ReactFocusEvent<HTMLElement>) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) preview.clear(action);
    },
  });

  return (
    <section
      ref={bar}
      className={`dq-action-bar${stacked ? " dq-bar-stacked" : ""}${busy ? " dq-bar-busy" : ""}${paused ? " dq-bar-paused" : ""}${className ? ` ${className}` : ""}`}
      aria-label="Actions"
    >
      <div className="dq-bar-summary">{summary}</div>
      <span className="dq-bar-divider" aria-hidden="true" />
      <div className="dq-bar-tiles" aria-busy={busy || undefined}>
        {keyed.map((action, index) => {
          const binding = keys.action(index);
          return (
            <button
              key={action.id}
              type="button"
              className="dq-bar-tile"
              title={action.label}
              aria-keyshortcuts={binding || undefined}
              aria-describedby={`${baseId}-effect-${index}`}
              disabled={paused || isDisabled(action)}
              onClick={() => onApply(action)}
              {...(paused ? {} : previewHandlers(action))}
            >
              {/* The space keeps the accessible name readable: "q Observation". */}
              {binding && <KeyCap binding={binding} />}{" "}
              <span className="dq-bar-label">{action.label}</span>
            </button>
          );
        })}
        {actions.length > 0 ? (
          <button
            type="button"
            className="dq-bar-tile dq-bar-find"
            aria-label={extra > 0 ? `Find action, ${extra} more` : "Find action"}
            aria-keyshortcuts={keys.find}
            disabled={paused}
            onClick={onFind}
          >
            <KeyCap binding={keys.find} hidden />
            <Search aria-hidden="true" />
            <span className="dq-bar-label">{extra > 0 ? `${extra} more` : "Find action"}</span>
          </button>
        ) : (
          <p className="dq-bar-empty">This review has no actions.</p>
        )}
      </div>
      {hints && <p className="dq-bar-hints">{hints}</p>}
      {/* Paused, the tiles preview nothing: the line above the bar says why they wait instead. */}
      {paused ? (
        <p className="dq-bar-effect dq-bar-paused-note">
          <Pencil aria-hidden="true" />
          Actions are paused while you edit the review
        </p>
      ) : (
        <BarEffect actions={keyed} preview={preview} names={names} tagGroups={tagGroups} trees={trees} />
      )}
      {notices && <div className="dq-bar-notices">{notices}</div>}
      {/* What each tile changes, read out with the tile; the line above the bar is visual. */}
      <div hidden>
        {keyed.map((action, index) => (
          <span key={action.id} id={`${baseId}-effect-${index}`}>
            {effectText(action)}
          </span>
        ))}
      </div>
      <span className="dq-sr-only" role="status">
        {status}
      </span>
    </section>
  );
}

/**
 * Whether the summary and hints should take a line of their own above the tiles: when the tiles
 * then need fewer lines in all than beside them. Every width compared is the content's own, the
 * same in both layouts, so the choice never flips back and forth.
 */
function useStackedLayout(bar: RefObject<HTMLElement | null>, actions: readonly ReviewAction[]) {
  const [stacked, setStacked] = useState(false);
  useLayoutEffect(() => {
    const element = bar.current;
    if (!element || typeof ResizeObserver === "undefined") return;
    const summary = element.querySelector<HTMLElement>(".dq-bar-summary");
    const measure = () => {
      const style = getComputedStyle(element);
      const gap = parseFloat(style.columnGap) || 0;
      const width =
        element.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      const tiles = [...element.querySelectorAll<HTMLElement>(".dq-bar-tiles > *")].map(
        (tile) => tile.offsetWidth,
      );
      const tileGap = parseFloat(getComputedStyle(element.querySelector(".dq-bar-tiles")!).columnGap) || 0;
      const hints = element.querySelector<HTMLElement>(".dq-bar-hints");
      const beside =
        (summary?.offsetWidth ?? 0) +
        (hints ? hints.offsetWidth + gap : 0) +
        1 + // the divider
        2 * gap;
      const rows = (room: number) => {
        let count = 1;
        let line = 0;
        for (const tile of tiles) {
          if (line > 0 && line + tileGap + tile > room) {
            count += 1;
            line = tile;
          } else line += (line > 0 ? tileGap : 0) + tile;
        }
        return count;
      };
      setStacked(1 + rows(width) < rows(width - beside));
    };
    // Any part changing size (a selection count, a note replacing the hints, a font arriving)
    // measures again; the parts' own widths do not depend on the layout, so this settles.
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    for (const part of element.querySelectorAll(".dq-bar-summary, .dq-bar-tiles, .dq-bar-hints"))
      observer.observe(part);
    measure();
    let live = true;
    void document.fonts?.ready.then(() => {
      if (live) measure();
    });
    return () => {
      live = false;
      observer.disconnect();
    };
  }, [bar, actions]);
  return stacked;
}

/** Above the bar while a tile is pointed at or focused: "Q Label + Tag − rest of Tree". */
function BarEffect({
  actions,
  preview,
  names,
  tagGroups,
  trees,
}: {
  actions: readonly ReviewAction[];
  preview: ActionPreviewStore<ReviewAction>;
  names: Record<number, string | null>;
  tagGroups?: TagGroups;
  trees?: TagTrees;
}) {
  const keys = useReviewKeyLabels();
  const action = useActionPreview(preview);
  const index = action ? actions.indexOf(action) : -1;
  if (!action || index < 0) return null;
  const binding = keys.action(index);
  return (
    <p className="dq-bar-effect" aria-hidden="true">
      {binding && <KeyCap binding={binding} />}
      <strong>{action.label}</strong>
      {actionEffectParts(action, names, tagGroups, trees).map((part, position) => (
        <span key={position} data-effect-tone={part.tone}>
          {part.text}
        </span>
      ))}
    </p>
  );
}
