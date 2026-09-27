import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import {
  DetailListToolbar,
  EntityReferenceMultiSelector,
  PERFORMER_CRITERIA,
} from "@cove/runtime/components";
import { ChevronDown, Pencil, Users } from "@cove/runtime/lucide-react";
import {
  conditionSeeksMissingTags,
  OCCURRENCE_CONDITION_LABELS,
  OCCURRENCE_CONDITIONS,
  targetsAllPerformers,
  type OccurrenceCondition,
} from "./model";
import type { PerformerScope } from "./reviewQuery";
import { useTagNames } from "./tagNames";

const TARGET_MODES: Array<{ mode: PerformerScope["targetMode"]; label: string }> = [
  { mode: "all", label: "All performers" },
  { mode: "selected", label: "Specific performers" },
  { mode: "filter", label: "Matching criteria" },
];

const FOCUSABLE =
  'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/** Where the open popover goes: under its button, kept inside the window. */
interface Placement {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
}

function placeUnder(button: HTMLElement): Placement {
  const rect = button.getBoundingClientRect();
  const width = Math.min(600, window.innerWidth - 32);
  const left = Math.min(Math.max(16, rect.right - width), window.innerWidth - width - 16);
  const top = rect.bottom + 8;
  return { top, left, width, maxHeight: Math.max(160, window.innerHeight - top - 16) };
}

function joinNames(names: string[], conjunction: string): string {
  if (!names.length) return "the chosen tags";
  if (names.length <= 2) return names.join(` ${conjunction} `);
  return `${names.slice(0, 2).join(", ")} ${conjunction} ${names.length - 2} more`;
}

/** "All performers · missing A or B": who the queue reviews and which occurrences it holds. */
export function scopeSummary(
  scope: PerformerScope,
  tagNames: Record<number, string | null>,
): string {
  const performers = targetsAllPerformers(scope)
    ? "All performers"
    : scope.targetMode === "selected"
      ? scope.performerIds.length === 1
        ? "1 performer"
        : `${scope.performerIds.length} performers`
      : "Performer criteria";
  const names = scope.conditionTagIds.map((id) =>
    tagNames[id] === undefined ? "…" : (tagNames[id] ?? "Unavailable tag"),
  );
  const conditions: Record<OccurrenceCondition, string> = {
    any: "any occurrence tags",
    isNull: "no occurrence tags",
    includes: `has ${joinNames(names, "or")}`,
    includesAll: `has ${joinNames(names, "and")}`,
    excludes: `has none of ${joinNames(names, "or")}`,
    excludesAll: `missing ${joinNames(names, "or")}`,
  };
  return `${performers} · ${conditions[scope.condition]}`;
}

/**
 * The occurrence queue's scope, behind one header button: which performers to review and which
 * of their occurrences (by occurrence tags). Changes apply to the queue at once; the chip row
 * offers saving them to the review.
 */
export function ScopePopover({
  scope,
  disabled,
  onChange,
  onEditCriteria,
}: {
  scope: PerformerScope;
  disabled: boolean;
  onChange(change: Partial<PerformerScope>): void;
  onEditCriteria(): void;
}) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const names = useTagNames(scope.conditionTagIds);
  const summary = scopeSummary(scope, names);
  // Placed from the button each time it opens (and on resize): the header wraps on narrow
  // windows, which can put the button at either edge.
  useLayoutEffect(() => {
    if (!open || !button.current) return;
    const place = () => button.current && setPlacement(placeUnder(button.current));
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const pressed = panel.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]');
    if (pressed && !pressed.disabled) pressed.focus();
    else panel.current?.focus();
  }, [open]);
  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => button.current?.focus());
  };
  // It is a dialog: Tab stays inside it, and keys typed in a dialog opened from it (the
  // criteria chips open Cove's filter dialog here) belong to that dialog.
  const handleKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const nested =
      event.target instanceof Element &&
      event.target.closest('[role="dialog"]') !== panel.current;
    if (nested || event.defaultPrevented) return;
    if (event.key === "Escape") {
      event.preventDefault();
      close();
    } else if (event.key === "Tab" && panel.current) {
      const stops = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
        .filter((element) => element.closest('[role="dialog"]') === panel.current)
        // Document order, whatever order the selector engine returns them in.
        .sort((left, right) =>
          left.compareDocumentPosition(right) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
        );
      if (!stops.length) return;
      const first = stops[0];
      const last = stops[stops.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  const tagged = !["any", "isNull"].includes(scope.condition);
  return (
    <div className="dq-scope">
      <button
        ref={button}
        type="button"
        className="dq-header-button dq-scope-button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        title={summary}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Users aria-hidden="true" />
        <span className="dq-scope-name">Scope</span>
        <span className="dq-scope-summary">{summary}</span>
        <ChevronDown aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="dq-scope-backdrop" aria-hidden="true" onMouseDown={close} />
          <div
            ref={panel}
            id={panelId}
            role="dialog"
            aria-label="Queue scope"
            className="dq-scope-popover"
            tabIndex={-1}
            style={
              placement
                ? {
                    top: placement.top,
                    left: placement.left,
                    width: placement.width,
                    maxHeight: placement.maxHeight,
                  }
                : undefined
            }
            onKeyDown={handleKey}
          >
            <fieldset className="dq-scope-section" disabled={disabled}>
              <legend className="dq-eyebrow">Performers to review</legend>
              <div className="dq-segmented dq-segmented-fill" role="group" aria-label="Performers to review">
                {TARGET_MODES.map(({ mode, label }) => (
                  <button
                    key={mode}
                    type="button"
                    aria-pressed={scope.targetMode === mode}
                    onClick={() => scope.targetMode !== mode && onChange({ targetMode: mode })}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {scope.targetMode === "selected" && (
                <EntityReferenceMultiSelector
                  entityType="performer"
                  values={scope.performerIds}
                  onChange={(performerIds) => onChange({ performerIds })}
                  placeholder="All performers..."
                  allowCreate={false}
                />
              )}
              {scope.targetMode === "filter" && (
                <div className="dq-scope-criteria">
                  {/* Only the host's criteria chips apply to performers; its list controls are hidden. */}
                  <div className="dq-performer-criteria">
                    <DetailListToolbar
                      filter={{}}
                      onFilterChange={() => {}}
                      totalCount={0}
                      sortOptions={[]}
                      showSearch={false}
                      showSort={false}
                      showPagingControls={false}
                      criteriaDefinitions={PERFORMER_CRITERIA}
                      objectFilter={scope.performerFilter}
                      onObjectFilterChange={(performerFilter) => onChange({ performerFilter })}
                    />
                  </div>
                  <button type="button" className="dq-button" onClick={onEditCriteria}>
                    <Pencil aria-hidden="true" />
                    Edit criteria
                  </button>
                </div>
              )}
            </fieldset>
            <fieldset className="dq-scope-section" disabled={disabled}>
              <legend className="dq-eyebrow">Occurrence tags</legend>
              <select
                className="dq-select"
                aria-label="Occurrence condition"
                value={scope.condition}
                onChange={(event) =>
                  onChange({ condition: event.target.value as OccurrenceCondition })
                }
              >
                {OCCURRENCE_CONDITIONS.map((condition) => (
                  <option value={condition} key={condition}>
                    {OCCURRENCE_CONDITION_LABELS[condition]}
                  </option>
                ))}
              </select>
              {tagged && (
                <>
                  <EntityReferenceMultiSelector
                    entityType="tag"
                    values={scope.conditionTagIds}
                    onChange={(conditionTagIds) => onChange({ conditionTagIds })}
                    placeholder="Add a condition tag…"
                    allowCreate={false}
                  />
                  <div className="dq-scope-options">
                    <label className="dq-checkbox">
                      <input
                        type="checkbox"
                        checked={scope.includeSubtags ?? true}
                        onChange={(event) => onChange({ includeSubtags: event.target.checked })}
                      />
                      Include subtags
                    </label>
                    {conditionSeeksMissingTags(scope.condition) && (
                      <label className="dq-checkbox">
                        <input
                          type="checkbox"
                          checked={scope.hideConfirmedAbsent ?? true}
                          onChange={(event) =>
                            onChange({ hideConfirmedAbsent: event.target.checked })
                          }
                        />
                        Hide occurrences confirmed absent
                      </label>
                    )}
                  </div>
                </>
              )}
            </fieldset>
            <div className="dq-scope-footer">
              <p>Applies to this queue at once. Save it to the review from the filter row.</p>
              <button type="button" className="dq-button" onClick={close}>
                Done
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
