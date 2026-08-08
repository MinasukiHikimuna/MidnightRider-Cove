import { EntityReferenceSelector, h, useEffect, useState } from "../shared/runtime.js";

import { readMergeConfirmationPreference, writeMergeConfirmationPreference } from "../editor/model/selection.js";

import {
  completeOperation,
  operationIdFor,
  requestCoveJson,
  requestJson,
} from "../shared/api.js";

import {
  extensionOwnedSegmentsModeSwitchPrompt,
  normalizeSegmentStudioFeatureProfile,
  recyclingBinModeSwitchPrompt,
  visibleSegmentStudioSettingsTabs,
} from "../shared/capabilities.js";

import { setBackLinkNavigation } from "../discovery/components.js";

import { SegmentGroupCard, moveSegmentGroupTag, reorderSegmentGroups } from "./organization.js";

import { DerivedSegmentRuleSettings } from "./derivation/DerivedSegmentRuleSettings.js";

import { PlaybackShortcutSettings, ShortcutBindingSettings } from "./shortcuts.js";

import { PerformerSlotOverviewSettings } from "./PerformerSlotOverviewSettings.js";

import { SegmentStudioModeSelector } from "../shared/navigation.js";

function SegmentStudioSettingsPage({ onNavigate, profile, onProfileChange }) {
  const [activeSettingsTab, setActiveSettingsTab] = useState("general");
  const [groups, setGroups] = useState([]);
  const [correspondingTagMappings, setCorrespondingTagMappings] = useState({});
  const [correspondingTagBusy, setCorrespondingTagBusy] = useState(false);
  const [correspondingSourceTag, setCorrespondingSourceTag] = useState(null);
  const [correspondingTargetTag, setCorrespondingTargetTag] = useState(null);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newName, setNewName] = useState("");
  const [pickerGroupId, setPickerGroupId] = useState(null);
  const [pickerQuery, setPickerQuery] = useState("");
  const [pickerOptions, setPickerOptions] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [dragState, setDragState] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [loading, setLoading] = useState(true);
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
    const options = signal ? { signal } : undefined;
    const [loaded, mappings] = await Promise.all([
      requestJson("/segment-groups", options),
      requestJson("/corresponding-tag-mappings", options),
    ]);
    setGroups(loaded || []);
    setCorrespondingTagMappings(Object.fromEntries((mappings || []).map((mapping) => [mapping.sourceTagId, mapping])));
  }

  async function changeCorrespondingTag(sourceTagId, correspondingTagId) {
    const current = correspondingTagMappings[sourceTagId] || null;
    setCorrespondingTagBusy(true);
    setMessage("");
    try {
      const mappings = await requestJson("/corresponding-tag-mappings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mappings: [{
          sourceTagId,
          correspondingTagId,
          expectedUpdatedAt: current?.updatedAt ?? null,
        }] }),
      });
      setCorrespondingTagMappings(Object.fromEntries((mappings || []).map((mapping) => [mapping.sourceTagId, mapping])));
      setMessage(correspondingTagId == null ? "Corresponding tag cleared." : "Corresponding tag saved.");
      if (correspondingTagId != null) {
        setCorrespondingSourceTag(null);
        setCorrespondingTargetTag(null);
      }
    } catch (error) {
      setMessage(error.message || "Unable to save corresponding tag.");
      try { await loadGroups(); } catch {}
    } finally {
      setCorrespondingTagBusy(false);
    }
  }

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loadGroups(controller.signal)
      .catch((error) => { if (error.name !== "AbortError") setMessage(error.message || "Unable to load Segment groups."); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
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

  useEffect(() => {
    if (pickerGroupId == null) {
      setPickerOptions([]);
      setPickerLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    setPickerLoading(true);
    const timer = setTimeout(() => {
      const params = new URLSearchParams({ page: "1", perPage: "100", sort: "name", direction: "asc", includeCounts: "false" });
      if (pickerQuery.trim()) params.set("q", pickerQuery.trim());
      requestCoveJson(`/api/tags?${params}`, { signal: controller.signal })
        .then((loaded) => setPickerOptions(loaded.items || []))
        .catch((error) => { if (error.name !== "AbortError") setMessage(error.message || "Unable to load tags."); })
        .finally(() => { if (!controller.signal.aborted) setPickerLoading(false); });
    }, 150);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [pickerGroupId, pickerQuery]);

  async function runMutation(action, successMessage) {
    setBusy(true);
    setMessage("");
    try {
      await action();
      await loadGroups();
      setMessage(successMessage);
      return true;
    } catch (error) {
      try { await loadGroups(); } catch {}
      setMessage(error.message || "Unable to change Segment groups.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  function createGroup(event) {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    runMutation(() => requestJson("/segment-groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }), "Segment group created.").then((saved) => {
      if (!saved) return;
      setNewName("");
      setShowCreateGroup(false);
    });
  }

  function updateGroup(group, next) {
    return runMutation(() => requestJson(`/segment-groups/${group.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(next),
    }), "Segment group saved.");
  }

  function closePicker() {
    setPickerGroupId(null);
    setPickerQuery("");
    setPickerOptions([]);
    setSelectedTagIds([]);
  }

  function togglePicker(groupId) {
    if (pickerGroupId === groupId) {
      closePicker();
      return;
    }
    setPickerGroupId(groupId);
    setPickerQuery("");
    setPickerOptions([]);
    setSelectedTagIds([]);
  }

  function toggleTagSelection(tagId) {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((candidate) => candidate !== tagId)
        : [...current, tagId]);
  }

  async function addSelectedTags(group) {
    const tagIds = [
      ...group.tags.map((tag) => tag.tagId),
      ...selectedTagIds.filter((tagId) => !group.tags.some((tag) => tag.tagId === tagId)),
    ];
    const saved = await updateGroup(group, { name: group.name, tagIds });
    if (saved) closePicker();
  }

  function removeTag(group, tagId) {
    return updateGroup(group, {
      name: group.name,
      tagIds: group.tags.filter((tag) => tag.tagId !== tagId).map((tag) => tag.tagId),
    });
  }

  function startGroupDrag(event, groupId) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `segment-group:${groupId}`);
    setDragState({ kind: "group", groupId });
    setDropTarget(null);
  }

  function startTagDrag(event, tagId, sourceGroupId) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `segment-tag:${tagId}`);
    setDragState({ kind: "tag", tagId, sourceGroupId });
    setDropTarget(null);
  }

  function endDrag() {
    setDragState(null);
    setDropTarget(null);
  }

  function dropGroup() {
    if (dragState?.kind !== "group" || dropTarget?.kind !== "group") {
      endDrag();
      return;
    }
    const sourceIndex = groups.findIndex((group) => group.id === dragState.groupId);
    const targetIndex = dropTarget.index > sourceIndex ? dropTarget.index - 1 : dropTarget.index;
    const next = reorderSegmentGroups(groups, dragState.groupId, targetIndex);
    endDrag();
    if (next === groups || next.every((group, index) => group.id === groups[index]?.id)) return;
    setGroups(next);
    runMutation(() => requestJson("/segment-groups/order", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupIds: next.map((group) => group.id) }),
    }), "Segment group order saved.");
  }

  function dropTag() {
    if (dragState?.kind !== "tag" || dropTarget?.kind !== "tag") {
      endDrag();
      return;
    }
    const sourceGroup = groups.find((group) => group.id === dragState.sourceGroupId);
    const sourceIndex = sourceGroup?.tags.findIndex((tag) => tag.tagId === dragState.tagId) ?? -1;
    const targetIndex = dragState.sourceGroupId === dropTarget.groupId && dropTarget.index > sourceIndex
      ? dropTarget.index - 1
      : dropTarget.index;
    const next = moveSegmentGroupTag(groups, dragState.tagId, dropTarget.groupId, targetIndex);
    endDrag();
    if (next === groups) return;
    const unchanged = next.every((group, groupIndex) =>
      group.tags.every((tag, tagIndex) => tag.tagId === groups[groupIndex]?.tags[tagIndex]?.tagId)
      && group.tags.length === groups[groupIndex]?.tags.length);
    if (unchanged) return;
    const targetGroup = next.find((group) => group.id === dropTarget.groupId);
    setGroups(next);
    runMutation(() => requestJson(`/segment-groups/${targetGroup.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: targetGroup.name,
        tagIds: targetGroup.tags.map((tag) => tag.tagId),
      }),
    }), dragState.sourceGroupId === targetGroup.id ? "Tag order saved." : "Tag moved to another group.");
  }

  function deleteGroup(group) {
    if (!window.confirm(`Delete Segment group “${group.name}”? Tags and segments will not be changed.`)) return;
    runMutation(() => requestJson(`/segment-groups/${group.id}`, { method: "DELETE" }), "Segment group deleted.");
  }

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
          ? "Configure the Segment Studio workflow, shortcuts, organization, performer roles, and derivation behavior."
          : "Configure the Segment Studio workflow, shortcuts, and organization."),
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
    h("div", { key: "shortcut-bindings-panel", hidden: activeSettingsTab !== "shortcuts" },
      h(ShortcutBindingSettings)),
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
    h("section", { key: "organization-heading", hidden: activeSettingsTab !== "organization", className: "flex flex-wrap items-start justify-between gap-3 rounded-lg border border-border bg-surface p-4" }, [
      h("div", { key: "copy" }, [
        h("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Segment groups"),
        h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
          "Create ordered groups, then drag groups and tags into the order used by the editor."),
      ]),
      h("button", {
        key: "create",
        type: "button",
        disabled: busy,
        onClick: () => {
          setShowCreateGroup(true);
          setNewName("");
        },
        className: "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50",
      }, "Create group"),
      showCreateGroup ? h("form", {
        key: "form",
        onSubmit: createGroup,
        className: "flex w-full flex-wrap items-end gap-2 border-t border-border pt-3",
      }, [
        h("label", { key: "name", className: "min-w-[14rem] flex-1 space-y-1 text-xs text-secondary" }, [
          h("span", { key: "label" }, "Group name"),
          h("input", {
            key: "input",
            value: newName,
            maxLength: 200,
            autoFocus: true,
            onChange: (event) => setNewName(event.target.value),
            onKeyDown: (event) => {
              if (event.key !== "Escape") return;
              setShowCreateGroup(false);
              setNewName("");
            },
            placeholder: "Group name",
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground",
          }),
        ]),
        h("button", { key: "submit", type: "submit", disabled: busy || !newName.trim(), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium text-foreground disabled:opacity-50" }, "Create"),
        h("button", {
          key: "cancel",
          type: "button",
          disabled: busy,
          onClick: () => {
            setShowCreateGroup(false);
            setNewName("");
          },
          className: "rounded-md border border-border px-3 py-2 text-sm font-medium text-secondary hover:bg-muted/40",
        }, "Cancel"),
      ]) : null,
    ]),
    h("section", { key: "corresponding-tags", hidden: activeSettingsTab !== "corresponding-tags", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      h("div", { key: "heading" }, [
        h("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Corresponding tags"),
        h("p", { key: "description", className: "mt-1 text-sm text-secondary" },
          "Map model or source tags to the long-term library tags used when segments are converted."),
      ]),
      h("div", { key: "create-scroll", className: "overflow-x-auto" }, h("div", {
        className: "grid min-w-[42rem] items-center gap-2",
        style: { gridTemplateColumns: "minmax(12rem, 1fr) auto minmax(12rem, 1fr) auto" },
      }, [
        h("label", { key: "source", className: "min-w-0" }, [
          h("span", { key: "label", className: "sr-only" }, "Source tag"),
          h(EntityReferenceSelector, {
            key: `source:${correspondingSourceTag?.id ?? "none"}`,
            entityType: "tag",
            value: correspondingSourceTag?.id ?? null,
            selectedDisplay: "input",
            selectedLabel: correspondingSourceTag?.label || "",
            onChange: (tagId, option) => setCorrespondingSourceTag(tagId == null ? null : { id: Number(tagId), label: option?.label || `Tag ${tagId}` }),
            disabled: correspondingTagBusy,
            excludeIds: [
              ...Object.keys(correspondingTagMappings).map(Number),
              ...(correspondingTargetTag ? [correspondingTargetTag.id] : []),
            ],
            placeholder: "Choose source tag…",
            creatable: false,
            allowCreate: false,
          }),
        ]),
        h("span", { key: "arrow", "aria-hidden": "true", className: "hidden text-center text-secondary md:block" }, "→"),
        h("label", { key: "target", className: "min-w-0" }, [
          h("span", { key: "label", className: "sr-only" }, "Corresponding library tag"),
          h(EntityReferenceSelector, {
            key: `target:${correspondingTargetTag?.id ?? "none"}`,
            entityType: "tag",
            value: correspondingTargetTag?.id ?? null,
            selectedDisplay: "input",
            selectedLabel: correspondingTargetTag?.label || "",
            onChange: (tagId, option) => setCorrespondingTargetTag(tagId == null ? null : { id: Number(tagId), label: option?.label || `Tag ${tagId}` }),
            disabled: correspondingTagBusy,
            excludeIds: correspondingSourceTag ? [correspondingSourceTag.id] : [],
            placeholder: "Choose corresponding tag…",
            creatable: false,
            allowCreate: false,
          }),
        ]),
        h("button", {
          key: "save",
          type: "button",
          disabled: correspondingTagBusy || !correspondingSourceTag || !correspondingTargetTag
            || correspondingSourceTag.id === correspondingTargetTag.id,
          onClick: () => changeCorrespondingTag(correspondingSourceTag.id, correspondingTargetTag.id),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50",
        }, correspondingTagBusy ? "Saving…" : "Add mapping"),
      ])),
      h("div", { key: "mappings", className: "space-y-2 overflow-x-auto" }, Object.values(correspondingTagMappings).length === 0
        ? h("p", { className: "rounded-md border border-dashed border-border p-4 text-center text-sm text-secondary" }, "No corresponding tags configured yet.")
        : Object.values(correspondingTagMappings)
            .sort((left, right) => left.sourceTagName.localeCompare(right.sourceTagName, undefined, { numeric: true, sensitivity: "base" }))
            .map((mapping) => h("div", {
              key: mapping.sourceTagId,
              className: "grid min-w-[42rem] items-center gap-2 rounded-md border border-border bg-card p-2",
              style: { gridTemplateColumns: "minmax(12rem, 1fr) auto minmax(12rem, 1fr) auto" },
            }, [
              h("span", { key: "source", className: "min-w-0 truncate text-sm font-medium text-foreground", title: mapping.sourceTagName }, mapping.sourceTagName),
              h("span", { key: "arrow", "aria-hidden": "true", className: "hidden text-center text-secondary md:block" }, "→"),
              h("label", { key: "target", className: "min-w-0" }, [
                h("span", { key: "label", className: "sr-only" }, `Corresponding tag for ${mapping.sourceTagName}`),
                h(EntityReferenceSelector, {
                  key: `mapping:${mapping.sourceTagId}:${mapping.correspondingTagId}`,
                  entityType: "tag",
                  value: mapping.correspondingTagId,
                  selectedDisplay: "input",
                  selectedLabel: mapping.correspondingTagName,
                  onChange: (tagId) => changeCorrespondingTag(mapping.sourceTagId, tagId == null ? null : Number(tagId)),
                  disabled: correspondingTagBusy,
                  excludeIds: [mapping.sourceTagId],
                  placeholder: "Choose corresponding tag…",
                  creatable: false,
                  allowCreate: false,
                }),
              ]),
              h("button", { key: "clear", type: "button", disabled: correspondingTagBusy, onClick: () => changeCorrespondingTag(mapping.sourceTagId, null), className: "rounded-md border border-border px-3 py-2 text-xs text-secondary hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50" }, "Clear"),
            ]))),
    ]),
    message ? h("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, message) : null,
    activeSettingsTab === "organization" && loading ? h("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading Segment groups…") : null,
    activeSettingsTab === "organization" && !loading && groups.length === 0 ? h("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No Segment groups configured yet.") : null,
    ...groups.map((group, groupIndex) => h("div", { key: group.id, hidden: activeSettingsTab !== "organization" },
      h(SegmentGroupCard, {
        group,
        groups,
        groupIndex,
        busy,
        pickerOpen: pickerGroupId === group.id,
        pickerQuery,
        pickerOptions,
        pickerLoading,
        selectedTagIds,
        dragState,
        dropTarget,
        onTogglePicker: togglePicker,
        onPickerQueryChange: setPickerQuery,
        onToggleTagSelection: toggleTagSelection,
        onAddTags: addSelectedTags,
        onCancelPicker: closePicker,
        onUpdate: updateGroup,
        onDelete: deleteGroup,
        onRemoveTag: removeTag,
        onGroupDragStart: startGroupDrag,
        onTagDragStart: startTagDrag,
        onDragEnd: endDrag,
        onGroupDragOver: (index) => setDropTarget({ kind: "group", index }),
        onGroupDrop: dropGroup,
        onTagDragOver: (groupId, index) => setDropTarget({ kind: "tag", groupId, index }),
        onTagDrop: dropTag,
      }))),
  ]);
}

export { SegmentStudioSettingsPage };
