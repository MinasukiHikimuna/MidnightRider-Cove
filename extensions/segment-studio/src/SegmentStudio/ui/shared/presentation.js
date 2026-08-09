import { h } from "./runtime.js";

import { findEditorShortcut, readShortcutBindingOverrides } from "../editor/model/shortcuts.js";

function StateBadge({ children }) {
  return h("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary",
  }, children);
}

const SEGMENT_STATE_PRESENTATION = {
  unreviewed: {
    symbol: "?",
    badge: {
      borderColor: "rgba(250, 204, 21, 0.65)",
      backgroundColor: "rgba(250, 204, 21, 0.12)",
      color: "var(--color-foreground)",
    },
    row: {
      borderLeftColor: "rgb(250, 204, 21)",
      backgroundColor: "rgba(250, 204, 21, 0.06)",
    },
  },
  approved: {
    symbol: "✓",
    badge: {
      borderColor: "rgba(52, 211, 153, 0.65)",
      backgroundColor: "rgba(52, 211, 153, 0.12)",
      color: "var(--color-foreground)",
    },
    row: {
      borderLeftColor: "rgb(52, 211, 153)",
      backgroundColor: "rgba(52, 211, 153, 0.06)",
    },
  },
  rejected: {
    symbol: "×",
    badge: {
      borderColor: "rgba(248, 113, 113, 0.65)",
      backgroundColor: "rgba(248, 113, 113, 0.12)",
      color: "var(--color-foreground)",
    },
    row: {
      borderLeftColor: "rgb(248, 113, 113)",
      backgroundColor: "rgba(248, 113, 113, 0.06)",
    },
  },
};

export function segmentStateStyle(reviewState, selected) {
  const presentation = SEGMENT_STATE_PRESENTATION[reviewState] || SEGMENT_STATE_PRESENTATION.unreviewed;
  return {
    ...presentation.row,
    ...(selected ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}),
  };
}

export function segmentBadgeStyle(reviewState) {
  const presentation = SEGMENT_STATE_PRESENTATION[reviewState] || SEGMENT_STATE_PRESENTATION.unreviewed;
  return { ...presentation.badge };
}

export function segmentRailItemStyle(selected, active = false) {
  return {
    backgroundColor: "var(--color-card)",
    ...(selected ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}),
    ...(active ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}),
  };
}

const SLOT_STATUS_PRESENTATION = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" },
};

export function segmentTimelineStyle(reviewState, selected, slotStatus = "not-applicable", active = false) {
  const review = SEGMENT_STATE_PRESENTATION[reviewState] || SEGMENT_STATE_PRESENTATION.unreviewed;
  const backgroundColor = reviewState === "approved"
    ? "rgb(22, 163, 74)"
    : reviewState === "rejected"
      ? "rgb(220, 38, 38)"
      : "rgb(234, 179, 8)";
  const unfilled = reviewState !== "rejected"
    && (slotStatus === "empty" || slotStatus === "partial");
  return {
    borderColor: review.row.borderLeftColor,
    backgroundColor,
    ...(unfilled ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {}),
    ...(selected ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {}),
    ...(active ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}),
  };
}

export function basicSegmentTimelineStyle(selected, active = false) {
  const turquoise = "rgb(20, 184, 166)";
  return {
    borderColor: turquoise,
    backgroundColor: turquoise,
    ...(selected ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {}),
    ...(active ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}),
  };
}

export function timelineSegmentWidth(endSec, widthPercent) {
  return endSec == null ? "4px" : `${Math.max(0, Number(widthPercent) || 0)}%`;
}

export function swimlaneStripeBackground(laneIndex) {
  return laneIndex % 2 === 0
    ? "var(--color-surface)"
    : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}

export function activeSwimlaneLabelStyle(active, backgroundColor) {
  return {
    backgroundColor,
    ...(active ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)",
    } : {}),
  };
}

export function segmentGroupHeaderBackground(selected = false) {
  return `color-mix(in srgb, var(--color-accent) ${selected ? 14 : 8}%, var(--color-surface))`;
}

export function swimlaneMarkerTop(track) {
  return 0.34375 + Math.max(0, Number(track) || 0) * 1.25;
}

function SegmentStateBadge({ state, includeLabel = true }) {
  const presentation = SEGMENT_STATE_PRESENTATION[state] || SEGMENT_STATE_PRESENTATION.unreviewed;
  return h("span", {
    "aria-label": `Review state: ${state}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: segmentBadgeStyle(state),
  }, includeLabel ? `${presentation.symbol} ${state}` : presentation.symbol);
}

export function isEditableTarget(target, key = null) {
  if (!(target instanceof Element)) return false;
  if (key === "Enter" && target.closest("[data-selected-segment-shortcut-target='true']")) return false;
  if (target.closest("[data-segment-player]")) {
    // Keep native activation and focus traversal, but let editor navigation win
    // over player sliders so an escaped volume focus cannot consume arrow keys.
    if (key === "Tab") return true;
    if (target.closest("button, a[href]") && ["Enter", " "].includes(key)) return true;
    if (target.closest("[role='slider'], video")
        && ["ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End"].includes(key))
      return true;
    return false;
  }
  if (target.closest("input, textarea, select, [contenteditable='true'], [role='textbox'], [role='dialog'], [role='listbox'], [role='menu']"))
    return true;
  if (target.closest("[role='slider']")) {
    return key == null || ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "PageDown", "PageUp", "Home", "End", "Tab"].includes(key);
  }
  if (target.closest("button, a[href]")) {
    return key == null || ["Enter", " ", "Tab"].includes(key);
  }
  if (target.closest("[data-timeline-seeker]")) {
    if (key == null || ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(key))
      return true;
    return ["Enter", " "].includes(key) && Boolean(target.closest("button, a"));
  }
  const separator = target.closest("[role='separator']");
  if (separator) {
    if (key == null || ["Home", "End", "Tab"].includes(key)) return true;
    return separator.getAttribute("aria-orientation") === "horizontal"
      ? ["ArrowUp", "ArrowDown"].includes(key)
      : ["ArrowLeft", "ArrowRight"].includes(key);
  }
  return false;
}

export function isEditorShortcutOwner(event, editorElement) {
  if (!editorElement) return false;
  const target = event.target;
  const ownerDocument = event.view?.document ?? target?.ownerDocument;
  const activeElement = ownerDocument?.activeElement;
  return target === editorElement
    || editorElement.contains?.(target)
    || activeElement === editorElement
    || editorElement.contains?.(activeElement)
    || (target === ownerDocument?.body && activeElement === ownerDocument.body);
}

export function shouldHandleEditorShortcut(event, ownerDocument = document, reviewMode = false, overrides = readShortcutBindingOverrides()) {
  if (event.defaultPrevented || isEditableTarget(event.target, event.key)) return false;
  if (ownerDocument.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']")) return false;
  return findEditorShortcut(event, reviewMode, overrides) != null;
}

export function handleModalKey(event, { onCancel, onConfirm } = {}) {
  if (event.key === "Enter" && (event.isComposing || event.nativeEvent?.isComposing || event.keyCode === 229)) return false;
  const actionableTarget = typeof event.target?.closest === "function"
    ? event.target.closest("button, a, select, option, textarea")
    : event.target;
  const tagName = String(actionableTarget?.tagName || "").toLowerCase();
  if (tagName === "select" || tagName === "option") return false;
  if (event.key === "Enter" && (event.repeat || ["button", "a", "textarea"].includes(tagName))) return false;
  const action = event.key === "Escape" ? onCancel : event.key === "Enter" ? onConfirm : null;
  if (!action) return false;
  event.preventDefault();
  event.stopPropagation();
  action();
  return true;
}

export function shouldAcceptCurrentTagFromEnter(event, currentTagName) {
  if (event.key !== "Enter"
    || event.defaultPrevented
    || event.isComposing
    || event.nativeEvent?.isComposing
    || event.keyCode === 229)
    return false;
  const input = event.currentTarget?.querySelector?.("input");
  if (!input || input.value.trim() !== String(currentTagName || "").trim()) return false;
  if (input.getAttribute?.("aria-activedescendant")) return false;
  return !event.currentTarget.querySelector?.(
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]',
  );
}

export function trapModalFocus(event) {
  if (event.key !== "Tab") return false;
  const focusable = [...event.currentTarget.querySelectorAll(
    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])",
  )].filter((element) => !element.hidden && element.getAttribute("aria-hidden") !== "true");
  if (focusable.length === 0) {
    event.preventDefault();
    event.currentTarget.focus();
    return true;
  }
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const activeElement = event.currentTarget.ownerDocument?.activeElement;
  if (!focusable.includes(activeElement)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return true;
  }
  if ((!event.shiftKey && activeElement === last)
      || (event.shiftKey && activeElement === first)) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
    return true;
  }
  return false;
}

export { StateBadge, SEGMENT_STATE_PRESENTATION, SLOT_STATUS_PRESENTATION, SegmentStateBadge };
