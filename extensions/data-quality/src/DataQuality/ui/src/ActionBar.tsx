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
  MobileActionGroups,
  MobileFindButton,
  actionsByKeyRow,
  createActionPreviewStore,
  mobilePreviewHandlers,
  useActionPreview,
  useEndPreviewOnLayoutChange,
  type ActionPreviewStore,
} from "./ActionPad";
import { actionEffectParts, actionTagIds } from "./FindAction";
import type { TagTrees } from "./effectPreview";
import type { ActionKeyMap, ReviewAction } from "./model";
import { useActionKeyMap, useReviewKeyLabels } from "./reviewKeys";
import { useTagNames } from "./tagNames";
import { useMobileLayout } from "./viewport";

type TagGroups = ReadonlyArray<{ id: number; name: string }>;

/**
 * The card grid's actions, in one bar under the cards (and at the foot of the grid preview): what
 * the actions apply to, then a compact tile per keyed action (key cap and label), one line per
 * keyboard row that holds actions, in key order (a long line wraps), and Find action, which also
 * reaches the actions without a key. Tiles share the pad's key caps and effect wording: pointing
 * at or focusing one shows what it changes above the bar, and the tile carries the same text as
 * its description. Phone-sized windows get the pad's plain groups of buttons instead
 * (MobileActionGroups), under the summary, without key caps or key hints.
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
  keyHints,
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
  /** Right-hand note, such as why some actions cannot run. */
  hints?: ReactNode;
  /** Keyboard hints, shown when there is no note; phone-sized windows leave them out. */
  keyHints?: ReactNode;
  /** Messages shown just above the bar. */
  notices?: ReactNode;
  /** Read out while an action runs. */
  status?: string;
  className?: string;
  /** The review is being edited: every tile is disabled and dimmed, and the bar says why. */
  paused?: boolean;
}) {
  const keys = useReviewKeyLabels();
  const keyMap = useActionKeyMap(actions);
  const mobile = useMobileLayout();
  const baseId = useId();
  const names = useTagNames(useMemo(() => actionTagIds(actions), [actions]));
  const [preview] = useState(() => createActionPreviewStore<ReviewAction>());
  useEndPreviewOnLayoutChange(preview, mobile);
  const bar = useRef<HTMLElement>(null);
  const stacked = useStackedLayout(bar, actions, !mobile);
  // The positions of the keyed actions, one line per keyboard row, in key order.
  const lines = actionsByKeyRow(keyMap);
  if (!lines.length && actions.length) lines.push([]);
  const keyed = lines.flat();
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
  const hint = hints ?? (mobile ? undefined : keyHints);
  const mobileTile = (index: number) => {
    const action = actions[index];
    return (
      <button
        key={action.id}
        type="button"
        className="dq-mobile-tile"
        title={action.label}
        aria-keyshortcuts={keyMap.keys[index] || undefined}
        aria-describedby={`${baseId}-effect-${index}`}
        disabled={paused || isDisabled(action)}
        onClick={() => {
          // A tap that focused the button leaves no preview behind.
          preview.clear(action);
          onApply(action);
        }}
        {...(paused ? {} : mobilePreviewHandlers(preview, action))}
      >
        <span className="dq-mobile-label">{action.label}</span>
      </button>
    );
  };

  return (
    <section
      ref={bar}
      className={`dq-action-bar${mobile ? " dq-bar-mobile" : stacked ? " dq-bar-stacked" : ""}${busy ? " dq-bar-busy" : ""}${paused ? " dq-bar-paused" : ""}${className ? ` ${className}` : ""}`}
      aria-label="Actions"
    >
      <div className="dq-bar-summary">{summary}</div>
      <span className="dq-bar-divider" aria-hidden="true" />
      <div
        className={`dq-bar-tiles${mobile ? " dq-mobile-actions" : ""}`}
        aria-busy={busy || undefined}
      >
        {mobile && actions.length > 0 && (
          <MobileActionGroups
            groups={lines}
            renderAction={mobileTile}
            find={
              <MobileFindButton
                extra={extra}
                findKey={keys.find}
                disabled={paused}
                onFind={onFind}
              />
            }
          />
        )}
        {!mobile && lines.map((line, lineIndex) => (
          <div key={lineIndex} className="dq-bar-line">
            {line.map((index) => {
              const action = actions[index];
              const binding = keyMap.keys[index];
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
            {/* Find action closes the last line, as the - key follows the letters. */}
            {lineIndex === lines.length - 1 && (
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
            )}
          </div>
        ))}
        {!actions.length && <p className="dq-bar-empty">This review has no actions.</p>}
      </div>
      {hint && <p className="dq-bar-hints">{hint}</p>}
      {/* Paused, the tiles preview nothing: the line above the bar says why they wait instead. */}
      {paused ? (
        <p className="dq-bar-effect dq-bar-paused-note">
          <Pencil aria-hidden="true" />
          Actions are paused while you edit the review
        </p>
      ) : (
        <BarEffect
          actions={actions}
          keyMap={keyMap}
          preview={preview}
          names={names}
          tagGroups={tagGroups}
          trees={trees}
          showKey={!mobile}
        />
      )}
      {notices && <div className="dq-bar-notices">{notices}</div>}
      {/* What each tile changes, read out with the tile; the line above the bar is visual. */}
      <div hidden>
        {keyed.map((index) => (
          <span key={actions[index].id} id={`${baseId}-effect-${index}`}>
            {effectText(actions[index])}
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
 * then need fewer lines in all than beside them, or as many while that keeps every keyboard row
 * on a single line. Every width compared is the content's own, the same in both layouts, so the
 * choice never flips back and forth.
 */
function useStackedLayout(
  bar: RefObject<HTMLElement | null>,
  actions: readonly ReviewAction[],
  /** False for the phone-sized layout, which always puts the summary over the buttons. */
  enabled: boolean,
) {
  const [stacked, setStacked] = useState(false);
  useLayoutEffect(() => {
    const element = bar.current;
    if (!element || !enabled || typeof ResizeObserver === "undefined") return;
    const summary = element.querySelector<HTMLElement>(".dq-bar-summary");
    const measure = () => {
      const style = getComputedStyle(element);
      const gap = parseFloat(style.columnGap) || 0;
      const width =
        element.clientWidth - (parseFloat(style.paddingLeft) || 0) - (parseFloat(style.paddingRight) || 0);
      // Each keyboard row's tiles start a line of their own and wrap within it.
      const lines = [...element.querySelectorAll<HTMLElement>(".dq-bar-line")].map((line) =>
        [...line.children].map((tile) => (tile as HTMLElement).offsetWidth),
      );
      const firstLine = element.querySelector(".dq-bar-line");
      const tileGap = firstLine ? parseFloat(getComputedStyle(firstLine).columnGap) || 0 : 0;
      const hints = element.querySelector<HTMLElement>(".dq-bar-hints");
      const beside =
        (summary?.offsetWidth ?? 0) +
        (hints ? hints.offsetWidth + gap : 0) +
        1 + // the divider
        2 * gap;
      // How many rows each keyboard row's line takes in this width.
      const rows = (room: number) =>
        lines.map((tiles) => {
          let count = 1;
          let line = 0;
          for (const tile of tiles) {
            if (line > 0 && line + tileGap + tile > room) {
              count += 1;
              line = tile;
            } else line += (line > 0 ? tileGap : 0) + tile;
          }
          return count;
        });
      const total = (counts: number[]) => Math.max(1, counts.reduce((sum, count) => sum + count, 0));
      const under = rows(width);
      const besideRows = total(rows(width - beside));
      setStacked(
        1 + total(under) < besideRows ||
          (1 + total(under) === besideRows && under.every((count) => count === 1)),
      );
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
  }, [bar, actions, enabled]);
  return stacked;
}

/**
 * Above the bar while a tile is pointed at or focused: "Q Label + Tag − rest of Tree", without the
 * key cap in phone-sized windows.
 */
function BarEffect({
  actions,
  keyMap,
  preview,
  names,
  tagGroups,
  trees,
  showKey,
}: {
  actions: readonly ReviewAction[];
  keyMap: ActionKeyMap;
  preview: ActionPreviewStore<ReviewAction>;
  names: Record<number, string | null>;
  tagGroups?: TagGroups;
  trees?: TagTrees;
  showKey: boolean;
}) {
  const action = useActionPreview(preview);
  const index = action ? actions.indexOf(action) : -1;
  if (!action || index < 0) return null;
  const binding = keyMap.keys[index];
  return (
    <p className="dq-bar-effect" aria-hidden="true">
      {binding && showKey && <KeyCap binding={binding} />}
      <strong>{action.label}</strong>
      {actionEffectParts(action, names, tagGroups, trees).map((part, position) => (
        <span key={position} data-effect-tone={part.tone}>
          {part.text}
        </span>
      ))}
    </p>
  );
}
