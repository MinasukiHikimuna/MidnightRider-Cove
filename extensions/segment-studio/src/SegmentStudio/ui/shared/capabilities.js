export const SEGMENT_STUDIO_CAPABILITIES = Object.freeze({
  navigationVideos: "navigation.videos",
  navigationSegmentInventory: "navigation.segmentInventory",
  settingsGeneral: "settings.general",
  settingsShortcuts: "settings.shortcuts",
  settingsPerformerSlots: "settings.performerSlots",
  settingsDerivation: "settings.derivation",
  nativeSegmentsRead: "nativeSegments.read",
  nativeSegmentsCreate: "nativeSegments.create",
  nativeSegmentsDuplicate: "nativeSegments.duplicate",
  nativeSegmentsSplit: "nativeSegments.split",
  nativeSegmentsMerge: "nativeSegments.merge",
  nativeSegmentsEdit: "nativeSegments.edit",
  nativeSegmentsBulkRetag: "nativeSegments.bulkRetag",
  nativeSegmentsRemove: "nativeSegments.remove",
  ownedSegmentsRead: "ownedSegments.read",
  segmentReview: "segments.review",
  provenanceRead: "provenance.read",
  lineageManage: "lineage.manage",
  performerSlotsManage: "performerSlots.manage",
  analysisFullScan: "analysis.fullScan",
  shotBoundariesManage: "shotBoundaries.manage",
  editorUndo: "editor.undo",
  editorFiltersNative: "editor.filters.native",
  editorFiltersWorkflow: "editor.filters.workflow",
  recyclingBinView: "recyclingBin.view",
  recyclingBinMove: "recyclingBin.move",
  recyclingBinRestore: "recyclingBin.restore",
  recyclingBinEmpty: "recyclingBin.empty",
  workflowDeletionManage: "workflowDeletion.manage",
  segmentGroupsManage: "segmentGroups.manage",
  feedbackManage: "feedback.manage",
});

export function normalizeSegmentStudioPublicMode(value) {
  return value === "full" || value === "review" ? "full" : "basic";
}

export function normalizeSegmentStudioFeatureProfile(value) {
  const validSchema = value?.schemaVersion === 1;
  const validRequestedMode = value?.requestedMode === "basic"
    || value?.requestedMode === "full"
    || value?.requestedMode === "editor"
    || value?.requestedMode === "review";
  const validEffectiveMode = value?.effectiveMode === "basic"
    || value?.effectiveMode === "full"
    || value?.effectiveMode === "editor"
    || value?.effectiveMode === "review";
  const validProfile = validSchema && validRequestedMode && validEffectiveMode;
  return {
    schemaVersion: validProfile ? 1 : 0,
    requestedMode: validProfile
      ? normalizeSegmentStudioPublicMode(value.requestedMode)
      : "basic",
    effectiveMode: validProfile
      ? normalizeSegmentStudioPublicMode(value.effectiveMode)
      : "basic",
    legacyCompatibilityRequired: validProfile
      && value.legacyCompatibilityRequired === true,
    capabilities: validProfile && Array.isArray(value.capabilities)
      ? [...new Set(value.capabilities.filter((capability) => typeof capability === "string"))]
      : [],
  };
}

export function hasSegmentStudioCapability(profile, capability) {
  return Array.isArray(profile?.capabilities)
    && profile.capabilities.includes(capability);
}

export function segmentStudioLegacyMode(profile) {
  return profile?.effectiveMode === "full" ? "review" : "editor";
}

export function visibleSegmentStudioTabs(profile) {
  const tabs = [];
  if (hasSegmentStudioCapability(profile, SEGMENT_STUDIO_CAPABILITIES.navigationVideos))
    tabs.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } });
  if (hasSegmentStudioCapability(profile, SEGMENT_STUDIO_CAPABILITIES.navigationSegmentInventory))
    tabs.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } });
  return tabs;
}

export function visibleSegmentStudioSettingsTabs(profile) {
  const candidates = [
    ["general", "General", SEGMENT_STUDIO_CAPABILITIES.settingsGeneral],
    ["shortcuts", "Shortcuts", SEGMENT_STUDIO_CAPABILITIES.settingsShortcuts],
    ["performer-slots", "Performer slots", SEGMENT_STUDIO_CAPABILITIES.settingsPerformerSlots],
    ["derivation", "Derivation", SEGMENT_STUDIO_CAPABILITIES.settingsDerivation],
  ];
  return candidates
    .filter(([, , capability]) => hasSegmentStudioCapability(profile, capability))
    .map(([key, label]) => [key, label]);
}

export function resolveSegmentStudioRoute(route, profile) {
  if (route === "segments"
      && !hasSegmentStudioCapability(
        profile,
        SEGMENT_STUDIO_CAPABILITIES.navigationSegmentInventory))
    return "videos";
  if (route === "bin"
      && !hasSegmentStudioCapability(
        profile,
        SEGMENT_STUDIO_CAPABILITIES.recyclingBinView))
    return "videos";
  return route;
}

export function extensionOwnedSegmentsModeSwitchPrompt(count) {
  const parsed = Number(count);
  const segmentCount = Number.isFinite(parsed) && parsed >= 0
    ? Math.trunc(parsed)
    : 0;
  if (segmentCount === 0) {
    return "Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.\n\nNothing will be deleted. Hidden metadata will reappear when you return to Full mode.";
  }
  const singular = segmentCount === 1;
  return `You have ${segmentCount} extension-owned ${singular ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${singular ? "this segment" : "these segments"} will be hidden.\n\nFull-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${singular ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}

export function recyclingBinModeSwitchPrompt(count, protectedCount = 0) {
  const parsed = Number(count);
  const itemCount = Number.isFinite(parsed) && parsed >= 0
    ? Math.trunc(parsed)
    : 0;
  const parsedProtected = Number(protectedCount);
  const protectedItemCount =
    Number.isFinite(parsedProtected) && parsedProtected >= 0
      ? Math.trunc(parsedProtected)
      : 0;
  const protectedMessage = protectedItemCount > 0
    ? `\n\n${protectedItemCount} collected incorrect ${protectedItemCount === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.`
    : "";
  if (itemCount === 0) {
    return `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${protectedMessage}\n\nSwitch to Full mode and clear Basic undo history?`;
  }
  return `The recycling bin contains ${itemCount} unprotected ${itemCount === 1 ? "segment" : "segments"}. ${itemCount === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${protectedMessage}\n\nRemove the unprotected ${itemCount === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
