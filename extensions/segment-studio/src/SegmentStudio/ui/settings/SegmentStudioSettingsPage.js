import { h, useEffect, useState } from "../shared/runtime.js";

import { readMergeConfirmationPreference, writeMergeConfirmationPreference } from "../editor/model/selection.js";

import {
  completeOperation,
  operationIdFor,
  requestJson,
} from "../shared/api.js";

import {
  extensionOwnedSegmentsModeSwitchPrompt,
  normalizeSegmentStudioFeatureProfile,
  recyclingBinModeSwitchPrompt,
  visibleSegmentStudioSettingsTabs,
} from "../shared/capabilities.js";

import { setBackLinkNavigation } from "../discovery/components.js";

import { DerivedSegmentRuleSettings } from "./derivation/DerivedSegmentRuleSettings.js";

import { PlaybackShortcutSettings } from "./shortcuts.js";

import { PerformerSlotOverviewSettings } from "./PerformerSlotOverviewSettings.js";

import { SegmentStudioModeSelector } from "../shared/navigation.js";

function SegmentStudioSettingsPage({ onNavigate, profile, onProfileChange }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const [groups, setGroups] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [analysisBaseUrl, setAnalysisBaseUrl] = useState("");
  const [analysisStatus, setAnalysisStatus] = useState(null);
  const [analysisLoading, setAnalysisLoading] = useState(true);
  const [analysisBusy, setAnalysisBusy] = useState(false);
  const [analysisMessage, setAnalysisMessage] = useState("");
  const [analysisCanManage, setAnalysisCanManage] = useState(true);
  const [confirmMerges, setConfirmMerges] = useState(readMergeConfirmationPreference);
  const settingsTabs = visibleSegmentStudioSettingsTabs(profile);
  const visibleSettingsTabKeys = settingsTabs.map(([key]) => key);

  useEffect(() => {
    if (!visibleSettingsTabKeys.includes(activeSettingsTab))
      setActiveSettingsTab(visibleSettingsTabKeys[0] || "general");
  }, [profile.effectiveMode]);

  async function loadGroups(signal) {
    const loaded = await requestJson("/segment-groups", signal ? { signal } : undefined);
    setGroups(loaded || []);
  }

  useEffect(() => {
    const controller = new AbortController();
    loadGroups(controller.signal)
      .catch((error) => { if (error.name !== "AbortError") setMessage(error.message || "Unable to load tag groups."); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (profile.effectiveMode !== "full") {
      setAnalysisLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setAnalysisMessage("");
    setAnalysisLoading(true);
    Promise.all([
      requestJson("/analysis/settings", { signal: controller.signal }),
      requestJson("/analysis/status", { signal: controller.signal }),
    ])
      .then(([settings, status]) => {
        setAnalysisCanManage(true);
        setAnalysisBaseUrl(settings?.baseUrl || "");
        setAnalysisStatus(status);
      })
      .catch((error) => {
        if (error.name === "AbortError") return;
        if (error.status === 403) {
          setAnalysisCanManage(false);
          setAnalysisMessage("You do not have permission to manage the analysis service connection.");
          return;
        }
        setAnalysisMessage(error.message || "Unable to load analysis service settings.");
      })
      .finally(() => { if (!controller.signal.aborted) setAnalysisLoading(false); });
    return () => controller.abort();
  }, [profile.effectiveMode]);

  async function saveMode(nextMode) {
    if (nextMode === profile.requestedMode) return;
    setBusy(true);
    setMessage("");
    try {
      const preview = await requestJson(
        `/preferences/transition?mode=${encodeURIComponent(nextMode)}`,
      );
      let emptyRecyclingBin = false;
      let operationKey = null;
      let operationId = null;
      let expectedRecyclingBinFingerprint = null;
      let confirmBasicHistoryCleanup = false;
      if (profile.requestedMode === "basic" && nextMode === "full") {
        if (!window.confirm(recyclingBinModeSwitchPrompt(
          preview.recyclingBinCount,
          preview.protectedRecyclingBinCount)))
          return;
        confirmBasicHistoryCleanup = true;
        if (preview.recyclingBinCount > 0) {
          emptyRecyclingBin = true;
          expectedRecyclingBinFingerprint =
            preview.recyclingBinFingerprint;
          operationKey =
            `mode-switch-empty-bin:${expectedRecyclingBinFingerprint}`;
          operationId = operationIdFor(operationKey);
        }
      }
      let confirmHiddenExtensionOwnedSegments = false;
      if (profile.requestedMode === "full" && nextMode === "basic") {
        if (!window.confirm(extensionOwnedSegmentsModeSwitchPrompt(
          preview.extensionOwnedSegmentCount)))
          return;
        confirmHiddenExtensionOwnedSegments = true;
      }
      const saved = await requestJson("/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: nextMode,
          confirmHiddenExtensionOwnedSegments,
          confirmBasicHistoryCleanup,
          emptyRecyclingBin,
          operationId,
          expectedRecyclingBinFingerprint,
        }),
      });
      if (operationKey) completeOperation(operationKey);
      onProfileChange?.(normalizeSegmentStudioFeatureProfile(saved));
      setMessage("Workflow mode saved.");
    } catch (error) {
      setMessage(error.message || "Unable to save workflow mode.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAnalysisSettings(event) {
    event.preventDefault();
    setAnalysisBusy(true);
    setAnalysisMessage("");
    try {
      const saved = await requestJson("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: analysisBaseUrl }),
      });
      setAnalysisBaseUrl(saved?.baseUrl || "");
      const status = await requestJson("/analysis/status");
      setAnalysisStatus(status);
      setAnalysisMessage(!saved?.baseUrl
        ? "Analysis service disabled."
        : status?.ready
          ? "Analysis Server URL saved. The service is ready."
          : `Analysis Server URL saved. ${status?.error || "The service is not ready."}`);
    } catch (error) {
      setAnalysisMessage(error.message || "Unable to save analysis service settings.");
    } finally {
      setAnalysisBusy(false);
    }
  }

  const backRoute = { page: "segment-studio" };
  return h("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6",
  }, [
    h("a", { key: "back", href: "/segment-studio", onClick: (event) => setBackLinkNavigation(event, onNavigate, backRoute), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
    h("header", { key: "header", className: "space-y-2" }, [
      h("h1", { key: "title", className: "text-2xl font-semibold text-foreground" }, "Segment Studio settings"),
      h("p", { key: "description", className: "max-w-3xl text-sm text-secondary" },
        profile.effectiveMode === "full"
          ? "Configure the Segment Studio workflow, shortcuts, performer roles, and derivation behavior."
          : "Configure the Segment Studio workflow and shortcuts."),
    ]),
    h("nav", { key: "settings-tabs", "aria-label": "Settings sections", className: "flex gap-1 overflow-x-auto border-b border-border" },
      settingsTabs.map(([key, label]) => h("button", {
        key,
        type: "button",
        onClick: () => setActiveSettingsTab(key),
        "aria-current": activeSettingsTab === key ? "page" : undefined,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${
          activeSettingsTab === key
            ? "border-accent text-foreground"
            : "border-transparent text-secondary hover:text-foreground"}`,
      }, label))),
    h("div", { key: "playback-shortcuts-panel", hidden: activeSettingsTab !== "shortcuts" },
      h(PlaybackShortcutSettings)),
    h("section", { key: "shortcut-bindings-panel", hidden: activeSettingsTab !== "shortcuts", className: "space-y-2 rounded-lg border border-border bg-surface p-4" }, [
      h("h2", { key: "title", className: "font-semibold text-foreground" }, "Keyboard bindings"),
      h("p", { key: "description", className: "text-sm text-secondary" },
        "Segment Studio bindings now use Cove's keyboard shortcut settings and conflict handling."),
      h("a", { key: "link", href: "/settings/my/keyboard-shortcuts", className: "inline-flex text-sm font-medium text-accent hover:underline" },
        "Configure Segment Studio shortcuts in Cove settings →"),
    ]),
    h("section", { key: "mode", hidden: activeSettingsTab !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      h("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Workflow mode"),
      h(SegmentStudioModeSelector, {
        key: "selector",
        mode: profile.legacyCompatibilityRequired
          ? profile.effectiveMode
          : profile.requestedMode,
        onModeChange: saveMode,
        disabled: busy || profile.legacyCompatibilityRequired,
      }),
      h("div", { key: "mode-guide", className: "grid gap-3 md:grid-cols-2" }, [
        h("article", { key: "basic", className: "rounded-md border border-border bg-card p-3" }, [
          h("h3", { key: "title", className: "text-sm font-semibold text-foreground" }, "Basic"),
          h("p", { key: "description", className: "mt-1 text-xs leading-5 text-secondary" },
            "Create and edit ordinary Cove segments directly. No Segment Studio registration or review decision is required. Undo and the recycling bin provide reversible cleanup. Eligible AI examples can be collected into a protected bin entry."),
        ]),
        h("article", { key: "full", className: "rounded-md border border-border bg-card p-3" }, [
          h("h3", { key: "title", className: "text-sm font-semibold text-foreground" }, "Full"),
          h("p", { key: "description", className: "mt-1 text-xs leading-5 text-secondary" },
            "Adds Segment Studio-owned drafts, review, performer slots, derivation, and shot boundaries while keeping ordinary Cove segments and shared AI feedback available."),
        ]),
      ]),
      h("p", { key: "boundary", className: "text-xs leading-5 text-secondary" },
        "AI feedback is available in both modes for segments with registered AI provenance. Collection preserves provenance, and downloads contain an AI Feedback ZIP for manual submission. Live segments are preserved when modes change. Collected examples also remain protected and manageable; only unprotected Basic bin entries are removed when confirmed. Switching to Full clears Basic undo history. Switching to Basic hides extension-owned segments and expanded metadata. Materialized derivations remain Segment Studio-owned and appear only in Full."),
    ]),
    h("section", { key: "confirmations", hidden: activeSettingsTab !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      h("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Confirmations"),
      h("label", { key: "merge", className: "flex items-start gap-3" }, [
        h("input", {
          key: "input",
          type: "checkbox",
          checked: confirmMerges,
          onChange: (event) => {
            const next = event.target.checked;
            writeMergeConfirmationPreference(next);
            setConfirmMerges(next);
          },
          className: "mt-0.5 h-4 w-4 accent-[var(--color-accent)]",
        }),
        h("span", { key: "copy", className: "space-y-0.5" }, [
          h("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Confirm segment merges"),
          h("span", { key: "description", className: "block text-xs text-secondary" },
            "Show the merge summary before permanently replacing selected segments."),
        ]),
      ]),
    ]),
    profile.effectiveMode === "full"
      ? h("section", { key: "analysis", hidden: activeSettingsTab !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
        h("div", { key: "heading" }, [
          h("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Analysis service"),
          h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
            "Connect Full Scan to the Segment Studio analysis service. The URL must be reachable from the Cove API process."),
        ]),
        h("form", { key: "form", onSubmit: saveAnalysisSettings, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
          h("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
            h("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
            h("input", {
              key: "input",
              type: "url",
              value: analysisBaseUrl,
              onChange: (event) => setAnalysisBaseUrl(event.target.value),
              placeholder: "http://segment-studio-analysis:8766",
              autoComplete: "off",
              spellCheck: false,
              disabled: analysisLoading || analysisBusy || !analysisCanManage,
              className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
            }),
          ]),
          h("button", {
            key: "save",
            type: "submit",
            disabled: analysisLoading || analysisBusy || !analysisCanManage,
            className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50",
          }, analysisBusy ? "Saving…" : "Save"),
        ]),
        h("p", { key: "status", className: "text-xs text-secondary", role: "status" },
          analysisMessage
            || (analysisLoading
              ? "Loading analysis service settings…"
              : analysisStatus?.configured === false
                ? "Full Scan is not configured."
                : analysisStatus?.ready
                  ? "Analysis service is ready."
                  : analysisStatus?.error || "Analysis service is configured but not ready.")),
      ])
      : null,
    visibleSettingsTabKeys.includes("derivation")
      ? h("div", { key: "derivation-rules-panel", hidden: activeSettingsTab !== "derivation" },
      h(DerivedSegmentRuleSettings, {
        segmentGroups: groups,
        onSegmentGroupsChanged: () => loadGroups(),
      }))
      : null,
    visibleSettingsTabKeys.includes("performer-slots")
      ? h("div", { key: "performer-slots-panel", hidden: activeSettingsTab !== "performer-slots" },
      h(PerformerSlotOverviewSettings, {
        active: activeSettingsTab === "performer-slots",
        segmentGroups: groups,
        onSegmentGroupsChanged: () => loadGroups(),
      }))
      : null,
    message ? h("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, message) : null,
  ]);
}

export { SegmentStudioSettingsPage };
