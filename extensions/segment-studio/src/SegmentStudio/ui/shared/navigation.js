import { h, useEffect, useState } from "./runtime.js";

import {
  SEGMENT_STUDIO_CAPABILITIES,
  hasSegmentStudioCapability,
  normalizeSegmentStudioPublicMode,
  visibleSegmentStudioTabs,
} from "./capabilities.js";

import { requestJson } from "./api.js";

import { setPlainLinkNavigation } from "../discovery/components.js";

function SegmentStudioTabs({ active, onNavigate, showBin = false, profile }) {
  const tabs = visibleSegmentStudioTabs(profile);
  return h("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    h("div", { key: "tabs", className: "flex gap-1" }, tabs.map((tab) =>
      h("a", {
        key: tab.key,
        href: tab.href,
        onClick: (event) => setPlainLinkNavigation(event, onNavigate, tab.route),
        "aria-current": active === tab.key ? "page" : undefined,
        className: `border-b-2 px-4 py-2 text-sm font-semibold ${active === tab.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`,
      }, tab.label))),
    h("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      showBin && hasSegmentStudioCapability(
        profile,
        SEGMENT_STUDIO_CAPABILITIES.recyclingBinView)
        ? h(SegmentStudioBinAction, { key: "bin", onNavigate })
        : null,
      h(SegmentStudioSettingsAction, { key: "settings", onNavigate }),
    ]),
  ]);
}

const RECYCLING_BIN_CHANGED_EVENT = "segment-studio:recycling-bin-changed";

export function recyclingBinActionText(count) {
  if (count == null) return "Recycling bin";
  const parsed = Number(count);
  if (!Number.isFinite(parsed) || parsed < 0) return "Recycling bin";
  return `Recycling bin (${Math.trunc(parsed)})`;
}

function notifyRecyclingBinChanged() {
  window.dispatchEvent(new CustomEvent(RECYCLING_BIN_CHANGED_EVENT));
}

function SegmentStudioBinAction({ onNavigate, compact = false }) {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let disposed = false;
    let requestId = 0;
    const load = async () => {
      const currentRequestId = ++requestId;
      try {
        const snapshot = await requestJson("/bin");
        const parsedCount = Number(snapshot?.totalCount);
        if (!disposed && currentRequestId === requestId) {
          setCount(Number.isFinite(parsedCount) && parsedCount >= 0 ? Math.trunc(parsedCount) : null);
        }
      } catch {
        if (!disposed && currentRequestId === requestId) setCount(null);
      }
    };
    const refresh = () => { void load(); };
    void load();
    window.addEventListener(RECYCLING_BIN_CHANGED_EVENT, refresh);
    window.addEventListener("focus", refresh);
    return () => {
      disposed = true;
      window.removeEventListener(RECYCLING_BIN_CHANGED_EVENT, refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const label = recyclingBinActionText(count);
  return h("a", {
    href: "/segment-studio/bin",
    onClick: (event) => setPlainLinkNavigation(event, onNavigate, { page: "segment-studio", slug: "bin" }),
    "aria-label": count == null
      ? "Open recycling bin"
      : `Open recycling bin, ${count} item${count === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${compact ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`,
  }, [h("span", { key: "icon", "aria-hidden": "true" }, "♲"), h("span", { key: "label" }, label)]);
}

function SegmentStudioSettingsAction({ onNavigate, compact = false }) {
  return h("a", {
    href: "/segment-studio/settings",
    onClick: (event) => setPlainLinkNavigation(event, onNavigate, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${compact ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`,
  }, [h("span", { key: "icon", "aria-hidden": "true" }, "⚙"), h("span", { key: "label" }, "Settings")]);
}

function SegmentStudioModeSelector({ mode, onModeChange, disabled = false }) {
  function updateMode(event) {
    const next = normalizeSegmentStudioPublicMode(event.target.value);
    onModeChange?.(next);
  }
  return h("label", { className: "block space-y-1 text-xs text-secondary" }, [
    h("span", { key: "label" }, "Mode"),
    h("select", {
      key: "select",
      value: mode,
      onChange: updateMode,
      disabled,
      className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
    }, [
      h("option", { key: "basic", value: "basic" }, "Basic"),
      h("option", { key: "full", value: "full" }, "Full"),
    ]),
    h("span", { key: "help", className: "block max-w-sm" }, "Mode is saved to your Cove user account and applies across browsers."),
  ]);
}

export { SegmentStudioTabs, RECYCLING_BIN_CHANGED_EVENT, notifyRecyclingBinChanged, SegmentStudioBinAction, SegmentStudioSettingsAction, SegmentStudioModeSelector };
