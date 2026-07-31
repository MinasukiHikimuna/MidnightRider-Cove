import { useEffect, useState } from "../../shared/runtime.js";

import { COLLAPSED_SEGMENT_GROUPS_STORAGE_KEY, DEFAULT_EDITOR_LAYOUT, EDITOR_LAYOUT_STORAGE_KEY, SPLIT_EDITOR_QUERY, TIMING_CLIPBOARD_STORAGE_KEY, WIDE_EDITOR_QUERY } from "../../shared/constants.js";

import { normalizeCollapsedSegmentGroups } from "./swimlanes.js";

import { parseEditorLayout } from "./timeline.js";

function useWideEditorLayout() {
  const [wide, setWide] = useState(() => typeof window !== "undefined" && window.matchMedia(WIDE_EDITOR_QUERY).matches);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const query = window.matchMedia(WIDE_EDITOR_QUERY);
    const update = () => setWide(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return wide;
}

function useSplitEditorLayout() {
  const [split, setSplit] = useState(() => typeof window !== "undefined" && window.matchMedia(SPLIT_EDITOR_QUERY).matches);
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const query = window.matchMedia(SPLIT_EDITOR_QUERY);
    const update = () => setSplit(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return split;
}

function readEditorLayout() {
  try {
    return parseEditorLayout(window.localStorage.getItem(EDITOR_LAYOUT_STORAGE_KEY));
  } catch {
    return { ...DEFAULT_EDITOR_LAYOUT };
  }
}

function readCollapsedSegmentGroups() {
  try { return normalizeCollapsedSegmentGroups(JSON.parse(window.localStorage.getItem(COLLAPSED_SEGMENT_GROUPS_STORAGE_KEY) || "[]")); }
  catch { return []; }
}

function writeCollapsedSegmentGroups(value) {
  try { window.localStorage.setItem(COLLAPSED_SEGMENT_GROUPS_STORAGE_KEY, JSON.stringify(normalizeCollapsedSegmentGroups(value))); }
  catch { /* Collapsed groups remain usable without persistence. */ }
}

function writeEditorLayout(layout) {
  try {
    window.localStorage.setItem(EDITOR_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    // Layout persistence is optional; editor behavior remains available without storage.
  }
}

function readTimingClipboard() {
  try {
    const value = JSON.parse(window.localStorage.getItem(TIMING_CLIPBOARD_STORAGE_KEY) || "null");
    return value && Number.isFinite(value.startSec) && (value.endSec == null || Number.isFinite(value.endSec)) ? value : null;
  } catch {
    return null;
  }
}

function writeTimingClipboard(segment) {
  try {
    window.localStorage.setItem(TIMING_CLIPBOARD_STORAGE_KEY, JSON.stringify({
      startSec: segment.startSec,
      endSec: segment.endSec,
    }));
    return true;
  } catch {
    return false;
  }
}

export { useWideEditorLayout, useSplitEditorLayout, readEditorLayout, readCollapsedSegmentGroups, writeCollapsedSegmentGroups, writeEditorLayout, readTimingClipboard, writeTimingClipboard };
