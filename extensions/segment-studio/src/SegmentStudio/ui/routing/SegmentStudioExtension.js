import { h, useEffect, useState } from "../shared/runtime.js";

import {
  normalizeSegmentStudioFeatureProfile,
  resolveSegmentStudioRoute,
  segmentStudioLegacyMode,
} from "../shared/capabilities.js";

import { requestJson } from "../shared/api.js";

import { SegmentStudioSettingsPage } from "../settings/SegmentStudioSettingsPage.js";

import { SegmentStudioBrowsePage } from "../browse/SegmentStudioBrowsePage.js";

import { SegmentStudioBinPage } from "../recycling-bin/SegmentStudioBinPage.js";

import { SegmentStudioDiscoveryPage } from "../discovery/SegmentStudioDiscoveryPage.js";

import { SegmentStudioEditorPage } from "../editor/SegmentStudioEditorPage.js";

export function isSegmentStudioSettingsRoute(id, slug, pathname) {
  return slug === "settings"
    || id === "settings"
    || (slug == null
      && id == null
      && pathname.replace(/\/+$/, "") === "/segment-studio/settings");
}

export function isSegmentStudioSegmentsRoute(id, slug, pathname) {
  return slug === "segments"
    || id === "segments"
    || slug === "review"
    || id === "review"
    || (slug == null
      && id == null
      && ["/segment-studio/segments", "/segment-studio/review"]
        .includes(pathname.replace(/\/+$/, "")));
}

export function isSegmentStudioBinRoute(id, slug, pathname) {
  return slug === "bin"
    || id === "bin"
    || (slug == null
      && id == null
      && pathname.replace(/\/+$/, "") === "/segment-studio/bin");
}

function SegmentStudioRoutes({
  id, slug, onNavigate, profile, onProfileChange,
}) {
  const compatibilityMode = profile.legacyCompatibilityRequired;
  const mode = segmentStudioLegacyMode(profile);
  const settingsRoute = isSegmentStudioSettingsRoute(id, slug, window.location.pathname);
  const segmentsRoute = isSegmentStudioSegmentsRoute(id, slug, window.location.pathname);
  const binRoute = isSegmentStudioBinRoute(id, slug, window.location.pathname);
  const requestedRoute = settingsRoute
    ? "settings"
    : segmentsRoute
      ? "segments"
      : binRoute
        ? "bin"
        : "videos";
  const resolvedRoute = resolveSegmentStudioRoute(requestedRoute, profile);
  if (resolvedRoute === "videos" && requestedRoute !== "videos") {
    window.history.replaceState({}, "", "/segment-studio");
    return h(SegmentStudioDiscoveryPage, {
      onNavigate, compatibilityMode, mode, profile,
    });
  }
  if (settingsRoute) return h(SegmentStudioSettingsPage, {
    onNavigate, profile, onProfileChange,
  });
  if (compatibilityMode) {
    if (segmentsRoute) return h(SegmentStudioBrowsePage, { onNavigate, profile });
    const compatibilityVideoId = Number(id);
    if (Number.isInteger(compatibilityVideoId) && compatibilityVideoId > 0)
      return h(SegmentStudioEditorPage, {
        videoId: compatibilityVideoId, onNavigate, compatibilityMode: true, profile,
      });
    return h(SegmentStudioDiscoveryPage, {
      onNavigate, compatibilityMode: true, mode, profile,
    });
  }
  if (binRoute) return h(SegmentStudioBinPage, { onNavigate, profile });
  const videoId = Number(id);
  if (segmentsRoute)
    return h(SegmentStudioBrowsePage, { onNavigate, profile });
  if (Number.isInteger(videoId) && videoId > 0)
    return h(SegmentStudioEditorPage, {
      videoId, onNavigate, compatibilityMode: mode === "review", profile,
    });
  return h(SegmentStudioDiscoveryPage, {
    onNavigate, mode, profile,
  });
}

function SegmentStudioPage({ id, slug, onNavigate }) {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    requestJson("/preferences", { signal: controller.signal })
      .then((loaded) => setProfile(normalizeSegmentStudioFeatureProfile(loaded)))
      .catch((requestError) => { if (requestError.name !== "AbortError") setError(requestError.message); });
    return () => controller.abort();
  }, []);
  if (error) return h("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, error);
  if (profile == null) return h("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…");
  return h(SegmentStudioRoutes, {
    id, slug, onNavigate, profile, onProfileChange: setProfile,
  });
}

export function segmentStudioActionTarget(payload) {
  const selectedIds = Array.isArray(payload?.selectedIds)
    ? payload.selectedIds
    : payload?.entityIds;
  if (!Array.isArray(selectedIds) || selectedIds.length !== 1) return null;
  const videoId = Number(selectedIds[0]);
  return Number.isInteger(videoId) && videoId > 0
    ? `/segment-studio/${videoId}`
    : null;
}

function openSegmentStudio(_action, payload) {
  const target = segmentStudioActionTarget(payload);
  if (!target) {
    window.alert("Segment Studio can only open one video at a time.");
    return { cancelled: true };
  }
  window.location.assign(target);
  return { cancelled: true };
}

export default {
  components: { SegmentStudioPage },
  actionHandlers: { openSegmentStudio },
};

export { SegmentStudioRoutes, SegmentStudioPage, openSegmentStudio };
