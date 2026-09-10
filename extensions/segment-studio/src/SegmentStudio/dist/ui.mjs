import Tr from "@cove/runtime/react";
import { createPortal as Ni } from "@cove/runtime/react-dom";
import { extensionFetch as _o } from "@cove/runtime/api";
import { formatDuration as Ii, EntityReferenceSelector as Nn, useExtensionKeyboardBindings as Ci, VideoPlayer as Ho, useRegisterExtensionKeyboardActions as qo, getDefaultFilter as Wo, useListUrlState as Vo, ListPage as Jo } from "@cove/runtime/components";
import { ChevronDown as $i, Loader2 as Ti } from "@cove/runtime/lucide-react";
const Ar = "com.midnightrider.segment-studio", Yo = "segment-studio.layout.v1", Ft = "segment-studio.operations.v1", Zo = "segment-studio.collapsed-segment-groups.v1", Qo = "segment-studio.playback-shortcuts.v1", Xo = "segment-studio.timing-clipboard.v1", ea = "segment-studio.hide-derived-segments.v1", ta = "segment-studio.merge-confirmation.v1", Xe = ["unreviewed", "approved", "rejected"], Ai = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], io = "(min-width: 1024px) and (min-height: 640px)", so = "(min-width: 1024px) and (min-height: 900px)", In = 1e-3, lo = 15, Mi = 30, na = 12, rt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Mr = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, kt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
}, vr = "__segment-studio-cleared-selection__";
function Ri(e) {
  return e === "true";
}
function Ei(e) {
  return e !== "false";
}
function ra() {
  try {
    return Ei(window.localStorage.getItem(ta));
  } catch {
    return !0;
  }
}
function oa(e) {
  try {
    window.localStorage.setItem(ta, String(!!e));
  } catch {
  }
}
function Di(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function dt(e = {}) {
  const t = Xe.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, m) => {
    const u = Number(g);
    return Number.isFinite(u) ? Math.min(1, Math.max(0, u)) : m;
  }, d = l(e.confidenceMin, 0), c = l(e.confidenceMax, 1);
  return {
    reviewStates: t,
    performerId: r > 0 ? r : null,
    tagId: o > 0 ? o : null,
    segmentGroupId: a,
    sourceKey: s,
    confidenceMin: Math.min(d, c),
    confidenceMax: Math.max(d, c),
    includeUnscored: e.includeUnscored !== !1
  };
}
function pr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = dt(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return Di(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function Oi(e, t, r, o = !1, i = []) {
  var l;
  const a = dt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = dt({
    ...a,
    reviewStates: [...a.reviewStates, e.reviewState]
  }).reviewStates), a.performerId != null && !(t || []).some((d) => d.segmentId === e.id && Number(d.performerId) === a.performerId) && (a.performerId = null), a.tagId != null && Number(e.tagId) !== a.tagId && (a.tagId = null), a.segmentGroupId != null) {
    const d = new Set((i || []).flatMap((c) => c.tags || []).map((c) => Number(c.tagId)));
    if (a.segmentGroupId === "ungrouped")
      d.has(Number(e.tagId)) && (a.segmentGroupId = null);
    else {
      const c = (i || []).find((g) => Number(g.id) === a.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((g) => Number(g.tagId) === Number(e.tagId)) || (a.segmentGroupId = null);
    }
  }
  a.sourceKey != null && e.sourceKey !== a.sourceKey && (a.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (a.confidenceMin = Math.min(a.confidenceMin, Math.floor(s * 100) / 100), a.confidenceMax = Math.max(a.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (a.includeUnscored = !0), {
    filters: dt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Pi(e, t = !1) {
  const r = dt(e);
  return +(r.reviewStates.length !== Xe.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Li(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Fi(e, t, r, o) {
  const i = Math.round(Math.min(1, Math.max(0, Number(o))) * 100) / 100;
  if (r === "minimum") {
    const s = Math.min(i, t);
    return {
      minimum: s,
      maximum: t,
      coincidentTop: s === t ? "maximum" : "minimum"
    };
  }
  const a = Math.max(i, e);
  return {
    minimum: e,
    maximum: a,
    coincidentTop: a === e ? "minimum" : "maximum"
  };
}
function Bi(e, t) {
  return t === vr ? null : e.find((r) => r.id === t) || e[0] || null;
}
function Gi(e, t, r) {
  var o;
  return r == null || !e.some((i) => i.id === r) || t.some((i) => i.id === r) ? r : ((o = t[0]) == null ? void 0 : o.id) ?? null;
}
function aa(e, t, r, o = !1) {
  const i = [...new Set((e || []).filter((s) => s != null))];
  if (!o) return { selectedSegmentIds: [r], activeSegmentId: r };
  if (!i.includes(r))
    return { selectedSegmentIds: [...i, r], activeSegmentId: r };
  const a = i.filter((s) => s !== r);
  return a.length === 0 ? { selectedSegmentIds: i, activeSegmentId: t } : {
    selectedSegmentIds: a,
    activeSegmentId: r === t ? a.at(-1) ?? null : t
  };
}
function ji(e, t, r) {
  const o = [...new Set((e || []).filter((s) => s != null))], i = [...new Set((r || []).filter((s) => s != null))];
  if (i.length === 0)
    return { selectedSegmentIds: o, activeSegmentId: t };
  const a = new Set(i);
  if (i.every((s) => o.includes(s))) {
    const s = o.filter((l) => !a.has(l));
    return s.length === 0 ? { selectedSegmentIds: o, activeSegmentId: t } : {
      selectedSegmentIds: s,
      activeSegmentId: a.has(t) ? s.at(-1) : t
    };
  }
  return {
    selectedSegmentIds: [.../* @__PURE__ */ new Set([...o, ...i])],
    activeSegmentId: i[0]
  };
}
function Ki(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return aa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Ui(e, t, r = null, o = !1) {
  const i = (e == null ? void 0 : e.selectedSegmentIds) || [], a = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? a, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (r) {
    const g = [...new Set(r)];
    if (!g.includes(s) || !g.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const m = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Ki(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = aa(i, a, t, o);
  if (!o)
    return {
      ...d,
      anchorSegmentId: t,
      rangeBaseSegmentIds: []
    };
  const c = d.selectedSegmentIds.includes(t) ? t : d.activeSegmentId;
  return {
    ...d,
    anchorSegmentId: c,
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((g) => g !== c)
  };
}
function zi(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function _i(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function co(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function uo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => co(t, o) - co(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Hi(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: b }) => !i.has(b.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = uo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return uo(d == null ? void 0 : d.markers, s, i);
}
function qi(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Wi(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Vi(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Ji() {
  try {
    return Ri(window.localStorage.getItem(ea));
  } catch {
    return !1;
  }
}
function Yi(e) {
  try {
    window.localStorage.setItem(ea, String(!!e));
  } catch {
  }
}
const Tn = [
  { id: "video.playPause", category: "Playback", bindings: [{ key: " " }, { key: "k" }], description: "Play or pause" },
  { id: "video.seekSmallBackward", category: "Playback", bindings: [{ key: "j" }], description: "Seek backward by the small interval" },
  { id: "video.seekSmallForward", category: "Playback", bindings: [{ key: "l" }], description: "Seek forward by the small interval" },
  { id: "video.seekMediumBackward", category: "Playback", bindings: [], description: "Seek backward by the medium interval" },
  { id: "video.seekMediumForward", category: "Playback", bindings: [], description: "Seek forward by the medium interval" },
  { id: "video.seekLongBackward", category: "Playback", bindings: [{ key: "j", ctrl: !0, shift: !0 }], description: "Seek backward by the long interval" },
  { id: "video.seekLongForward", category: "Playback", bindings: [{ key: "l", ctrl: !0, shift: !0 }], description: "Seek forward by the long interval" },
  { id: "video.playSelected", category: "Playback", bindings: [{ key: "Enter" }], description: "Play from the selected segment" },
  { id: "video.playPreviousSegment", category: "Playback", bindings: [{ key: "j", shift: !0 }], description: "Select and play the previous segment in this swimlane" },
  { id: "video.playNextSegment", category: "Playback", bindings: [{ key: "l", shift: !0 }], description: "Select and play the next segment in this swimlane" },
  ...Array.from({ length: 9 }, (e, t) => {
    const r = t + 1;
    return {
      id: `video.seekPercent${r * 10}`,
      category: "Playback",
      bindings: [{ key: String(r) }],
      description: `Seek to ${r * 10}% of the video`
    };
  }),
  { id: "video.jumpToSegmentStart", category: "Playback", bindings: [{ key: "i" }], description: "Jump to the selected segment start" },
  { id: "video.jumpToVideoStart", category: "Playback", bindings: [{ key: "i", shift: !0 }], description: "Jump to the video start" },
  { id: "video.jumpToSegmentEnd", category: "Playback", bindings: [{ key: "o" }], description: "Jump to the selected segment end" },
  { id: "video.jumpToVideoEnd", category: "Playback", bindings: [{ key: "o", shift: !0 }], description: "Jump to the video end" },
  { id: "video.frameSmallBackward", category: "Playback", bindings: [{ key: "," }], description: "Step backward by the small frame count" },
  { id: "video.frameSmallForward", category: "Playback", bindings: [{ key: "." }], description: "Step forward by the small frame count" },
  { id: "video.frameMediumBackward", category: "Playback", bindings: [{ key: ",", code: "Comma", shift: !0, label: "Shift+," }, { key: ";" }], description: "Step backward by the medium frame count" },
  { id: "video.frameMediumForward", category: "Playback", bindings: [{ key: ".", code: "Period", shift: !0, label: "Shift+." }, { key: ":" }], description: "Step forward by the medium frame count" },
  { id: "video.frameLongBackward", category: "Playback", bindings: [{ key: ",", ctrl: !0, label: "Ctrl+," }], description: "Step backward by the long frame count" },
  { id: "video.frameLongForward", category: "Playback", bindings: [{ key: ".", ctrl: !0, label: "Ctrl+." }], description: "Step forward by the long frame count" },
  { id: "navigation.swimlaneUp", category: "Selection", bindings: [{ key: "ArrowUp" }], description: "Select nearest segment in the swimlane above" },
  { id: "navigation.swimlaneDown", category: "Selection", bindings: [{ key: "ArrowDown" }], description: "Select nearest segment in the swimlane below" },
  { id: "navigation.segmentGroupUp", category: "Selection", bindings: [{ key: "ArrowUp", shift: !0 }], description: "Select the swimlane group above" },
  { id: "navigation.segmentGroupDown", category: "Selection", bindings: [{ key: "ArrowDown", shift: !0 }], description: "Select the swimlane group below" },
  { id: "navigation.swimlaneLeft", category: "Selection", bindings: [{ key: "ArrowLeft" }], description: "Select previous segment in this swimlane" },
  { id: "navigation.swimlaneRight", category: "Selection", bindings: [{ key: "ArrowRight" }], description: "Select next segment in this swimlane" },
  { id: "navigation.extendSwimlaneLeft", category: "Selection", bindings: [{ key: "ArrowLeft", shift: !0 }], description: "Extend selection to the previous segment in this swimlane" },
  { id: "navigation.extendSwimlaneRight", category: "Selection", bindings: [{ key: "ArrowRight", shift: !0 }], description: "Extend selection to the next segment in this swimlane" },
  { id: "navigation.previousAtPlayhead", category: "Selection", bindings: [{ key: "[" }], description: "Select previous segment at the playhead" },
  { id: "navigation.nextAtPlayhead", category: "Selection", bindings: [{ key: "]" }], description: "Select next segment at the playhead" },
  { id: "navigation.nearestInCurrentSwimlane", category: "Selection", bindings: [{ key: "p" }], description: "Select the segment nearest the playhead in this swimlane" },
  { id: "navigation.previousUnreviewedInSwimlane", category: "Selection", bindings: [{ key: "n" }], description: "Select previous unreviewed segment in this swimlane", reviewOnly: !0 },
  { id: "navigation.previousUnreviewedGlobal", category: "Selection", bindings: [{ key: "n", shift: !0 }], description: "Select previous unreviewed segment across swimlanes", reviewOnly: !0 },
  { id: "navigation.nextUnreviewedInSwimlane", category: "Selection", bindings: [{ key: "m" }], description: "Select next unreviewed segment in this swimlane", reviewOnly: !0 },
  { id: "navigation.nextUnreviewedGlobal", category: "Selection", bindings: [{ key: "m", shift: !0 }], description: "Select next unreviewed segment across swimlanes", reviewOnly: !0 },
  { id: "navigation.nextTouchingPlayhead", category: "Selection", bindings: [{ key: "Tab" }], description: "Select next segment near the playhead" },
  { id: "navigation.previousTouchingPlayhead", category: "Selection", bindings: [{ key: "Tab", shift: !0 }], description: "Select previous segment near the playhead" },
  { id: "navigation.quickSearch", category: "Selection", bindings: [{ key: "f" }], description: "Quick-search visible segments" },
  { id: "navigation.previousShot", category: "Shots", bindings: [{ key: "y" }], description: "Jump to previous shot", reviewOnly: !0 },
  { id: "navigation.nextShot", category: "Shots", bindings: [{ key: "u" }], description: "Jump to next shot", reviewOnly: !0 },
  { id: "shot.split", category: "Shots", bindings: [{ key: "a", shift: !0 }, { key: "v" }], description: "Add or split a shot boundary at the playhead", reviewOnly: !0 },
  { id: "shot.merge", category: "Shots", bindings: [{ key: "v", shift: !0 }], description: "Remove the shot boundary at the playhead and merge adjacent shots", reviewOnly: !0 },
  { id: "markerGroup.toggleCollapse", category: "Segment groups", bindings: [{ key: "b" }], description: "Collapse or expand the selected segment group" },
  { id: "markerGroup.toggleAll", category: "Segment groups", bindings: [{ key: "b", shift: !0 }], description: "Collapse or expand all segment groups" },
  { id: "marker.create", category: "Editing", bindings: [{ key: "a" }], description: "Create segment at the playhead" },
  { id: "marker.duplicate", category: "Editing", bindings: [{ key: "d" }], description: "Duplicate selected segment in place" },
  { id: "marker.duplicateAtPlayhead", category: "Editing", bindings: [{ key: "d", shift: !0 }], description: "Duplicate selected segment at the playhead" },
  { id: "marker.split", category: "Editing", bindings: [{ key: "s" }], description: "Split selected segment at the playhead" },
  { id: "marker.editTag", category: "Editing", bindings: [{ key: "q" }], description: "Edit the selected segment tag" },
  { id: "marker.setStart", category: "Editing", bindings: [{ key: "w" }], description: "Set selected segment start to the playhead" },
  { id: "marker.setEnd", category: "Editing", bindings: [{ key: "e" }], description: "Set selected segment end to the playhead" },
  { id: "marker.copyTiming", category: "Editing", bindings: [{ key: "t" }], description: "Copy selected segment timing" },
  { id: "marker.pasteTiming", category: "Editing", bindings: [{ key: "t", shift: !0 }], description: "Paste copied timing onto the selected segment" },
  { id: "marker.mergeSelection", category: "Editing", bindings: [{ key: "r" }], description: "Merge selected segments in one swimlane" },
  { id: "marker.moveToBin", category: "Editing", bindings: [{ key: "x" }], description: "Move selected segments to the recycling bin", basicOnly: !0 },
  { id: "system.emptyBin", category: "Editing", bindings: [{ key: "x", shift: !0 }], description: "Empty the recycling bin", basicOnly: !0 },
  { id: "marker.toggleIncorrectExample", category: "AI feedback", bindings: [{ key: "c" }], description: "Collect selected eligible AI segments as incorrect examples" },
  { id: "marker.openIncorrectExamples", category: "AI feedback", bindings: [{ key: "c", shift: !0 }], description: "Manage incorrect examples and download an AI Feedback ZIP" },
  { id: "marker.assignSlots", category: "Editing", bindings: [{ key: "g" }], description: "Assign performers to segment slots", reviewOnly: !0 },
  { id: "navigation.centerPlayhead", category: "Timeline", bindings: [{ key: "h" }], description: "Center timeline on playhead" },
  { id: "navigation.zoomIn", category: "Timeline", bindings: [{ key: "+" }, { key: "=" }], description: "Zoom in" },
  { id: "navigation.zoomOut", category: "Timeline", bindings: [{ key: "-" }, { key: "_" }], description: "Zoom out" },
  { id: "navigation.resetZoom", category: "Timeline", bindings: [{ key: "0" }], description: "Fit timeline" },
  { id: "layout.growSwimlanes", category: "Timeline", bindings: [{ key: "ArrowUp", platform: !0 }], description: "Give swimlanes more height" },
  { id: "layout.shrinkSwimlanes", category: "Timeline", bindings: [{ key: "ArrowDown", platform: !0 }], description: "Give swimlanes less height" },
  { id: "marker.confirm", category: "Review", bindings: [{ key: "z" }], description: "Approve or unapprove segment", reviewOnly: !0 },
  { id: "system.publishApproved", category: "Review", bindings: [{ key: "z", shift: !0 }], description: "Preview approved draft publishing", reviewOnly: !0 },
  { id: "marker.reject", category: "Review", bindings: [{ key: "x" }], description: "Reject or unreject segment", reviewOnly: !0 },
  { id: "system.deleteRejected", category: "Review", bindings: [{ key: "x", shift: !0 }], description: "Delete all rejected segments", reviewOnly: !0 }
], Zi = /* @__PURE__ */ new Set([
  "video.playSelected",
  "video.jumpToSegmentStart",
  "video.jumpToSegmentEnd",
  "marker.duplicate",
  "marker.duplicateAtPlayhead",
  "marker.split",
  "marker.setStart",
  "marker.setEnd",
  "marker.copyTiming",
  "marker.pasteTiming"
]);
function Qi(e) {
  return Zi.has(e);
}
function ia(e) {
  if (!e || typeof e != "object" || typeof e.key != "string") return null;
  const t = e.key === " " ? " " : e.key.trim(), r = typeof e.code == "string" ? e.code.trim() : "", o = ["Comma", "Period"].includes(r) ? r : "";
  return !t || t.length > 32 || ["Control", "Shift", "Alt", "Meta"].includes(t) ? null : {
    key: t,
    ...o && o.length <= 32 ? { code: o } : {},
    ...e.ctrl ? { ctrl: !0 } : {},
    ...e.alt ? { alt: !0 } : {},
    ...e.shift ? { shift: !0 } : {},
    ...e.meta ? { meta: !0 } : {},
    ...e.platform ? { platform: !0 } : {}
  };
}
function Xi(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Tn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ia).filter(Boolean)]));
  } catch {
    return {};
  }
}
function es(e = {}) {
  const t = Xi(e);
  return Tn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function mo(e, t = 2) {
  const o = [...new Set(e.map((s) => s.category))].map((s, l) => ({
    category: s,
    index: l,
    shortcuts: e.filter((d) => d.category === s)
  })), i = Math.max(1, Math.min(o.length || 1, Math.floor(t) || 1)), a = Array.from({ length: i }, () => ({ groups: [], weight: 0 }));
  return [...o].sort((s, l) => l.shortcuts.length - s.shortcuts.length || s.index - l.index).forEach((s) => {
    const l = a.reduce((d, c) => c.weight < d.weight ? c : d);
    l.groups.push(s), l.weight += s.shortcuts.length + 2;
  }), a.map((s) => s.groups.sort((l, d) => l.index - d.index));
}
function Gd(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ia({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function jd(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function xr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function go(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Kd(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = go(e.code, t.key), a = go(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const g of [!1, !0])
        for (const m of [!1, !0]) {
          const u = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: g,
            shiftKey: m
          };
          if (xr(u, e) && xr(u, t)) return !0;
        }
  return !1;
}
function tn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Ud(e, t) {
  return [!1, !0].some((r) => tn(e, r) && tn(t, r));
}
function ts(e, t = !1, r = {}) {
  return es(r).find((o) => tn(o, t) && o.bindings.some((i) => xr(e, i))) || null;
}
function sa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function ns(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(sa).join(" / ") : "Unassigned";
}
function zd(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, ns(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function _d(e) {
  return e === "review" ? "review" : "editor";
}
function ze(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function rs(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function po(e, t) {
  var o;
  if (e) {
    const i = (t == null ? void 0 : t.nativeSegmentId) ?? (t == null ? void 0 : t.id) ?? null;
    if (i == null) throw new Error("Duplicate response did not include a stable native identity.");
    return { nativeSegmentId: i };
  }
  const r = ((o = t == null ? void 0 : t.createdDraft) == null ? void 0 : o.itemId) ?? null;
  if (r == null) throw new Error("Duplicate response did not include a stable item identity.");
  return { itemId: r };
}
function os(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function as(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Sr(e, t) {
  return e === t;
}
function is(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function ss(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - In).at(-1) || null : o.find((i) => i.startSec > t + In) || null;
}
function qn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function fo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: Xe.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function Hd(e, t = null, r = !1) {
  const o = fo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Xt(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function la(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Xt(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Xt(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Xt(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Xt(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Xt(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Xt(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Mr };
  }
}
function ls(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function da() {
  try {
    return la(window.localStorage.getItem(Qo));
  } catch {
    return { ...Mr };
  }
}
function yo(e) {
  const t = la(JSON.stringify(e));
  try {
    window.localStorage.setItem(Qo, JSON.stringify(t));
  } catch {
  }
  return t;
}
const wt = Object.freeze({
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
  feedbackManage: "feedback.manage"
});
function kr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ca(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? kr(e.requestedMode) : "basic",
    effectiveMode: i ? kr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function nn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function ds(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function cs(e) {
  const t = [];
  return nn(e, wt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), nn(e, wt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function us(e) {
  return [
    ["general", "General", wt.settingsGeneral],
    ["shortcuts", "Shortcuts", wt.settingsShortcuts],
    ["performer-slots", "Performer slots", wt.settingsPerformerSlots],
    ["derivation", "Derivation", wt.settingsDerivation]
  ].filter(([, , r]) => nn(e, r)).map(([r, o]) => [r, o]);
}
function ms(e, t) {
  return e === "segments" && !nn(
    t,
    wt.navigationSegmentInventory
  ) || e === "bin" && !nn(
    t,
    wt.recyclingBinView
  ) ? "videos" : e;
}
function gs(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function ps(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const fr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, bo = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Xe.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function fs(e) {
  const t = String(e || "").split(",").filter((r) => Xe.includes(r));
  return t.length === 0 ? [...Xe] : [...new Set(t)];
}
function en(e) {
  return ua(e).values;
}
function ua(e) {
  if (!e) return { activityTagId: null, values: {} };
  try {
    const t = JSON.parse(String(e));
    if (!t || Array.isArray(t) || typeof t != "object") return { activityTagId: null, values: {} };
    const r = t.values && typeof t.values == "object" && !Array.isArray(t.values) ? t.values : t;
    return {
      activityTagId: Number.isInteger(Number(t.activityTagId)) && Number(t.activityTagId) > 0 ? Number(t.activityTagId) : null,
      values: Object.fromEntries(Object.entries(r).filter(([o, i]) => o && Number.isInteger(Number(i)) && Number(i) > 0))
    };
  } catch {
    return { activityTagId: null, values: {} };
  }
}
function yr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function ho(e, t) {
  var l;
  const r = vo(t.activitiesCriterion, t.activityId), o = vo(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ua(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: ys(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function vo(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function ys(e, t) {
  return Xe.includes(e == null ? void 0 : e.value) ? [e.value] : fs(t);
}
function ma(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function bs(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function hs(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function xo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function vs(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function Ke(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Rr(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function br(e, t) {
  const r = new Set(Rr(t).map((o) => String(Ke(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function $t(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function So(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map($t).sort().join(",")}`;
}
function ga(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((b) => String(b.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((b) => {
    var p;
    return !((p = b.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const b = [...e].sort((h, f) => String(h.slotDefinitionId).localeCompare(String(f.slotDefinitionId))), p = [...t].sort((h, f) => String(h.name).localeCompare(String(f.name)) || Number(Ke(h)) - Number(Ke(f)));
    return [{
      assignments: Object.fromEntries(b.map((h, f) => [String(h.slotDefinitionId), String(Ke(p[f]))])),
      description: p.map((h) => h.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((b) => t.map((p, h) => ({ performer: p, index: h })).filter(({ performer: p }) => {
    var h;
    return !((h = b.genderHints) != null && h.length) || b.genderHints.some((f) => $t(f) === $t(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((b) => b.length > 0).length : ko(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((b, p) => [String(Ke(b)), p]));
  function u(b, p, h) {
    if (s.length >= a) return;
    const f = c.slice(b), S = i ? f.filter((C) => C.length > 0).length : ko(f.map((C) => C.filter((q) => !p.has(String(Ke(t[q]))))), t.length);
    if (h + S < g) return;
    if (b === e.length) {
      if (h !== g) return;
      const C = Object.fromEntries(d.map(({ slot: A, performer: w }) => [String(A.slotDefinitionId), w ? String(Ke(w)) : ""])), q = o.length === 0 ? Object.values(C).sort().join(",") : [...new Set(e.map((A) => String(A.label || "")))].map((A) => `${A}:${d.filter(({ slot: w }) => String(w.label || "") === A).map(({ performer: w }) => w ? String(Ke(w)) : "").sort().join(",")}`).join("|");
      !l.has(q) && s.length < a && (l.add(q), s.push({
        assignments: C,
        description: d.map(({ slot: A, performer: w }) => o.length ? `${A.label}: ${(w == null ? void 0 : w.name) || "Unassigned"}` : (w == null ? void 0 : w.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const y = e[b], O = [...d].reverse().find(({ slot: C }) => So(C) === So(y)), V = O ? m.get(String(Ke(O.performer))) : -1;
    for (const C of c[b]) {
      const q = t[C], A = Ke(q);
      if (!(C < V) && !(A == null || !i && p.has(String(A))) && (d.push({ slot: y, performer: q }), i || p.add(String(A)), u(b + 1, p, h + 1), i || p.delete(String(A)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: y, performer: null }), u(b + 1, p, h), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function ko(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function xs(e, t) {
  if (!(e != null && e.length) || !(t != null && t.length)) return null;
  const r = e.some((l) => String(l.label || "").trim());
  if (r && e.some((l) => !String(l.label || "").trim())) return null;
  const o = e[0].allowSamePerformerInMultipleSlots === !0;
  if (!r && e.every((l) => {
    var d;
    return !((d = l.genderHints) != null && d.length);
  }) && e.length === t.length && !o) {
    const l = [...e].sort((c, g) => String(c.slotDefinitionId).localeCompare(String(g.slotDefinitionId))), d = [...t].sort((c, g) => String(c.name).localeCompare(String(g.name)) || c.performerId - g.performerId);
    return l.map((c, g) => ({ slot: c, performer: d[g] }));
  }
  const i = /* @__PURE__ */ new Map(), a = [];
  function s(l, d) {
    var g;
    if (i.size > 1) return;
    if (l === e.length) {
      const m = [...new Set(e.map((u) => u.label || ""))].map((u) => `${u}:${a.filter((b) => (b.slot.label || "") === u).map((b) => b.performer.performerId).sort((b, p) => b - p).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => $t(u) === $t(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Ss(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = r.assignment || [], i = o.map(({ slot: l, performer: d }) => `${l.slotDefinitionId}:${d.performerId}`).join("|"), a = `${r.tagId}:${i}`;
    t.has(a) || t.set(a, {
      key: a,
      tagName: r.tagName || "Tag segment",
      candidates: [],
      assignment: o,
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    });
    const s = t.get(a);
    s.candidates.push(r), s.counts[r.reviewState] = (s.counts[r.reviewState] || 0) + 1;
  }
  return [...t.values()].map((r) => ({
    ...r,
    candidates: [...r.candidates].sort((o, i) => o.startSec - i.startSec || (o.endSec ?? o.startSec) - (i.endSec ?? i.startSec) || o.id - i.id)
  }));
}
function ks(e, t, r = 20) {
  const o = String(t || "").trim().toLocaleLowerCase(), i = (a) => {
    var d;
    if (!o) return !0;
    const s = String(((d = a.segment) == null ? void 0 : d.tagName) || a.tagName || "").toLocaleLowerCase();
    if (s.includes(o)) return !0;
    let l = -1;
    for (const c of o) {
      const g = s.indexOf(c, l + 1);
      if (g < 0) return !1;
      l = g;
    }
    return !0;
  };
  return (e || []).filter(i).slice(0, Math.max(1, Number(r) || 20));
}
function ws(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Ns(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function pa(e, t, r) {
  const o = Ke, i = new Set((t || []).map(o)), a = new Set((r || []).map($t));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = $t(l.gender || l.genderIdentity), u = $t(d.gender || d.genderIdentity), b = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - b || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: fe, useId: fa, useMemo: De, useRef: pe, useState: D } = Tr, n = Tr.createElement, ya = "/api/plugins/segment-studio";
function Ae(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ft) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = wr();
    return t[e] = r, window.localStorage.setItem(Ft, JSON.stringify(t)), r;
  } catch {
    return wr();
  }
}
function Me(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ft) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Ft, JSON.stringify(t));
  } catch {
  }
}
function Er(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Ft) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Dr(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Ft) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Ft, JSON.stringify(t));
  } catch {
  }
}
function Is(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Cs(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Q(e, t, r = 0) {
  var d;
  const o = await _o(`${ya}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Is(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Cs(250 * (r + 1), t == null ? void 0 : t.signal), Q(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function $s(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${ya}${e}`, o = await _o(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Ts(
      o.headers.get("Content-Disposition")
    )
  };
}
function Ts(e, t = "segment-studio-ai-feedback.zip") {
  var s, l, d;
  const r = String(e || ""), o = (s = /filename\*\s*=\s*UTF-8''([^;]+)/i.exec(r)) == null ? void 0 : s[1];
  let i = null;
  if (o)
    try {
      i = decodeURIComponent(o.replace(/^"|"$/g, ""));
    } catch {
      i = null;
    }
  if (!i) {
    const c = /filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(r);
    i = (c == null ? void 0 : c[1]) || ((l = c == null ? void 0 : c[2]) == null ? void 0 : l.trim()) || null;
  }
  return ((d = i == null ? void 0 : i.split(/[\\/]/).pop()) == null ? void 0 : d.replace(/[\u0000-\u001f\u007f]/g, "").trim()) || t;
}
function Se(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function wr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ba(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function ha(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function va(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function As(e, t) {
  const { sceneCount: r, segmentCount: o } = va(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function xa(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = va(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(As(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Q("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Ae(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Me(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function wo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const pt = {
  unreviewed: {
    symbol: "?",
    badge: {
      borderColor: "rgba(250, 204, 21, 0.65)",
      backgroundColor: "rgba(250, 204, 21, 0.12)",
      color: "var(--color-foreground)"
    },
    row: {
      borderLeftColor: "rgb(250, 204, 21)",
      backgroundColor: "rgba(250, 204, 21, 0.06)"
    }
  },
  approved: {
    symbol: "✓",
    badge: {
      borderColor: "rgba(52, 211, 153, 0.65)",
      backgroundColor: "rgba(52, 211, 153, 0.12)",
      color: "var(--color-foreground)"
    },
    row: {
      borderLeftColor: "rgb(52, 211, 153)",
      backgroundColor: "rgba(52, 211, 153, 0.06)"
    }
  },
  rejected: {
    symbol: "×",
    badge: {
      borderColor: "rgba(248, 113, 113, 0.65)",
      backgroundColor: "rgba(248, 113, 113, 0.12)",
      color: "var(--color-foreground)"
    },
    row: {
      borderLeftColor: "rgb(248, 113, 113)",
      backgroundColor: "rgba(248, 113, 113, 0.06)"
    }
  }
};
function qd(e, t) {
  return {
    ...(pt[e] || pt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Sa(e) {
  return { ...(pt[e] || pt.unreviewed).badge };
}
function ka(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const wa = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Ms(e, t, r = "not-applicable", o = !1) {
  const i = pt[e] || pt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Rs(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Es(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Ds(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Os(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Zn(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Ps(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Bt({ state: e, includeLabel: t = !0 }) {
  const r = pt[e] || pt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Sa(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Ls(e, t = null) {
  if (!(e instanceof Element) || t === "Enter" && e.closest("[data-selected-segment-shortcut-target='true']")) return !1;
  if (e.closest("[data-segment-player]"))
    return !!(t === "Tab" || e.closest("button, a[href]") && ["Enter", " "].includes(t) || e.closest("[role='slider'], video") && ["ArrowLeft", "ArrowRight", "PageDown", "PageUp", "Home", "End"].includes(t));
  if (e.closest("input, textarea, select, [contenteditable='true'], [role='textbox'], [role='dialog'], [role='listbox'], [role='menu']"))
    return !0;
  if (e.closest("[role='slider']"))
    return t == null || ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "PageDown", "PageUp", "Home", "End", "Tab"].includes(t);
  if (e.closest("button, a[href]"))
    return t == null || ["Enter", " ", "Tab"].includes(t);
  if (e.closest("[data-timeline-seeker]"))
    return t == null || ["ArrowLeft", "ArrowDown", "ArrowRight", "ArrowUp", "PageDown", "PageUp", "Home", "End"].includes(t) ? !0 : ["Enter", " "].includes(t) && !!e.closest("button, a");
  const r = e.closest("[role='separator']");
  return r ? t == null || ["Home", "End", "Tab"].includes(t) ? !0 : r.getAttribute("aria-orientation") === "horizontal" ? ["ArrowUp", "ArrowDown"].includes(t) : ["ArrowLeft", "ArrowRight"].includes(t) : !1;
}
function Wd(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Fs(e, t = document) {
  return !(e.defaultPrevented || Ls(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function Vd(e, t = document, r = !1, o = {}) {
  return Fs(e, t) ? ts(e, r, o) != null : !1;
}
function ct(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function Bs(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function Nt(e) {
  var a;
  if (e.key !== "Tab") return !1;
  const t = [...e.currentTarget.querySelectorAll(
    "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
  )].filter((s) => !s.hidden && s.getAttribute("aria-hidden") !== "true");
  if (t.length === 0)
    return e.preventDefault(), e.currentTarget.focus(), !0;
  const r = t[0], o = t[t.length - 1], i = (a = e.currentTarget.ownerDocument) == null ? void 0 : a.activeElement;
  return !t.includes(i) || !e.shiftKey && i === o || e.shiftKey && i === r ? (e.preventDefault(), (e.shiftKey ? o : r).focus(), !0) : !1;
}
function Gs(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Na(e, t = !0) {
  const r = (e == null ? void 0 : e.nativeSegmentId) ?? (e != null && e.published ? (e == null ? void 0 : e.id) ?? null : null);
  return t ? {
    itemId: (e == null ? void 0 : e.itemId) ?? null,
    nativeSegmentId: r,
    published: r != null,
    revision: (e == null ? void 0 : e.revision) ?? null
  } : {
    nativeSegmentId: r,
    recycleBinItemId: (e == null ? void 0 : e.recycleBinItemId) ?? null,
    revision: (e == null ? void 0 : e.revision) ?? null,
    updatedAt: (e == null ? void 0 : e.updatedAt) ?? null
  };
}
function zn(e, t = !0) {
  return {
    type: "segment",
    identity: Na(e, t),
    values: {
      startSec: e.startSec,
      endSec: e.endSec ?? null,
      tagId: e.tagId,
      sourceKey: e.sourceKey || "user",
      sourceRunId: e.sourceRunId ?? null,
      confidence: e.confidence ?? null,
      ...t ? {} : {
        kind: e.kind || "tag",
        refId: e.refId ?? null,
        payloadJson: e.payloadJson ?? null,
        title: e.title ?? null,
        colorHint: e.colorHint ?? null,
        imageBlobId: e.imageBlobId ?? null,
        createdAt: e.createdAt,
        fieldProvenance: e.fieldProvenance || []
      },
      ...t ? { reviewState: e.reviewState } : {}
    }
  };
}
function lt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: Na(r, t),
      values: {
        startSec: r.startSec,
        endSec: r.endSec ?? null,
        tagId: r.tagId,
        sourceKey: r.sourceKey || "user",
        sourceRunId: r.sourceRunId ?? null,
        confidence: r.confidence ?? null,
        ...t ? {} : {
          kind: r.kind || "tag",
          refId: r.refId ?? null,
          payloadJson: r.payloadJson ?? null,
          title: r.title ?? null,
          colorHint: r.colorHint ?? null,
          imageBlobId: r.imageBlobId ?? null,
          createdAt: r.createdAt,
          fieldProvenance: r.fieldProvenance || []
        },
        ...t ? { reviewState: r.reviewState } : {}
      }
    }))
  };
}
function Vn(e) {
  return {
    type: "performerSlots",
    targets: (e || []).map((t) => ({
      identity: {
        itemId: t.itemId ?? null,
        nativeSegmentId: t.segmentId ?? null
      },
      revision: t.revision,
      assignments: (t.slots || []).map((r) => ({
        slotDefinitionId: r.slotDefinitionId,
        performerId: r.performerId ?? null
      }))
    }))
  };
}
function Ia(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Ca(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Or(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function Jd(e, t) {
  const r = t instanceof Set ? t : new Set(t || []), o = e || [], i = o.findIndex((a) => (a.markers || []).some((s) => r.has(s.segment.id)));
  if (i < 0)
    return null;
  for (const a of o.slice(i)) {
    const s = (a.markers || []).find((l) => !r.has(l.segment.id) && l.segment.reviewState === "unreviewed");
    if (s)
      return s.segment;
  }
  return null;
}
function js(e, t) {
  const r = (t || []).map((i) => Ia(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: et(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function Ks(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : js(e, t);
}
function Us({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Yd(e, t) {
  return Or(Ia(e, t));
}
function et(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function zs(e, t) {
  const r = (d) => et(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const g of d || []) {
      const m = r(g);
      c.has(m) || c.set(m, []), c.get(m).push(g);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const g = s.get(d);
    if (!g || c.length !== g.length)
      continue;
    const m = [...c].sort(o), u = [...g].sort(o);
    m.forEach((b, p) => l.push({
      sourceSlotDefinitionId: b.id,
      derivedSlotDefinitionId: u[p].id
    }));
  }
  return l;
}
function _s(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = zs(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function Hs(e) {
  const t = et(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Qn).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Qn(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Jn(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function No(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Jn(o),
    trackCount: Math.max(1, t.length)
  };
}
function qs(e) {
  const t = e.map(et), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Ws(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [No({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
  const i = o.map((l) => r.find((d) => d.signature === l).slots), a = new Set((i[0] || []).filter((l) => i.every((d) => d.some((c) => String(c.slotDefinitionId) === String(l.slotDefinitionId) && Number(c.performerId) === Number(l.performerId)))).map((l) => String(l.slotDefinitionId))), s = /* @__PURE__ */ new Map();
  for (const l of r) {
    const d = l.signature || "unfilled";
    if (!s.has(d))
      if (!l.signature)
        s.set(d, {
          ...e,
          key: `${e.key}:performers:unfilled`,
          performerLabel: "Unfilled performer slots",
          performers: [],
          performerAssignments: [],
          segments: []
        });
      else {
        const c = qs(l.slots), g = l.slots.filter((h) => !a.has(String(h.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((h) => `${c.get(String(h.slotDefinitionId))} · ${h.performerName || `Performer ${h.performerId}`}`).join(" · "), b = [...new Map(m.map((h) => [
          Number(h.performerId),
          { id: Number(h.performerId), name: h.performerName || `Performer ${h.performerId}` }
        ])).values()], p = l.slots.map((h) => ({
          slotDefinitionId: String(h.slotDefinitionId),
          label: c.get(String(h.slotDefinitionId)),
          performer: {
            id: Number(h.performerId),
            name: h.performerName || `Performer ${h.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: u,
          performers: b,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(No);
}
function rn(e, t = [], r = []) {
  const o = /* @__PURE__ */ new Map();
  for (const [s, l] of t.entries())
    for (const d of l.tags || [])
      o.set(d.tagId, {
        segmentGroupId: l.id,
        segmentGroupName: l.name,
        segmentGroupSortOrder: s,
        segmentGroupTagSortOrder: d.sortOrder
      });
  const i = /* @__PURE__ */ new Map();
  for (const s of e) {
    const l = s.tagName || "Tag segment", d = s.tagId == null ? `name:${l}` : `tag:${s.tagId}`;
    i.has(d) || i.set(d, {
      key: d,
      tagId: s.tagId,
      label: l,
      tagSortName: s.tagSortName || null,
      ...o.get(s.tagId) || {
        segmentGroupId: null,
        segmentGroupName: null,
        segmentGroupSortOrder: Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: Number.MAX_SAFE_INTEGER
      },
      segments: []
    }), i.get(d).segments.push(s);
  }
  const a = /* @__PURE__ */ new Map();
  for (const s of r || [])
    a.has(s.segmentId) || a.set(s.segmentId, []), a.get(s.segmentId).push(s);
  for (const s of a.values())
    s.sort((l, d) => l.sortOrder - d.sortOrder || String(l.slotDefinitionId).localeCompare(String(d.slotDefinitionId)));
  return [...i.values()].sort((s, l) => s.segmentGroupSortOrder - l.segmentGroupSortOrder || s.segmentGroupTagSortOrder - l.segmentGroupTagSortOrder || (s.tagSortName || s.label).localeCompare(l.tagSortName || l.label, void 0, {
    sensitivity: "base"
  }) || s.key.localeCompare(l.key)).flatMap((s) => Ws(s, a));
}
function Pr(e) {
  var r;
  const t = [];
  for (const o of e) {
    const i = o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`;
    let a = t.at(-1);
    (!a || a.key !== i) && (a = {
      key: i,
      id: o.segmentGroupId,
      name: o.segmentGroupName || "Ungrouped",
      lanes: [],
      counts: { unreviewed: 0, approved: 0, rejected: 0 }
    }, t.push(a)), a.lanes.push(o);
    for (const s of Xe)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const Vs = {
  group: 38,
  lane: 33,
  segment: 41
};
function Js(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = Vs[s.kind];
    o.push({ ...s, top: i, height: l }), i += l;
  };
  for (const s of e || [])
    if (a({ kind: "group", key: `${s.key}:header`, group: s }), !r.has(s.key))
      for (const l of s.lanes || []) {
        a({ kind: "lane", key: `${l.key}:label`, group: s, lane: l });
        for (const d of l.markers || [])
          a({ kind: "segment", key: `segment:${d.segment.id}`, group: s, lane: l, segment: d.segment });
      }
  return { rows: o, height: i };
}
function $a(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Ys(e, t = [], r = !0) {
  const o = new Set(t || []), i = [];
  let a = 0;
  const s = (l, d) => {
    i.push({ ...l, top: a, height: d }), a += d;
  };
  for (const l of e || [])
    if (r && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const g = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, g);
      }
  return { rows: i, height: a };
}
function Zs(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Jn(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Pr(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Jn(a)
    };
  });
}
function Ta(e, { nativeOnly: t = !1 } = {}) {
  const r = (e || []).flatMap((i) => i.lanes || []);
  if (r.length !== 1 || (r[0].markers || []).length < 2) return null;
  const o = r[0].markers.map(({ segment: i }) => i).sort((i, a) => i.startSec - a.startSec || (i.nativeSegmentId ?? i.itemId ?? i.id) - (a.nativeSegmentId ?? a.itemId ?? a.id));
  return t && o.some((i) => i.nativeSegmentId == null) || !t && new Set(o.map((i) => i.nativeSegmentId != null ? "native" : "extension")).size !== 1 ? null : {
    lane: r[0],
    segments: o,
    startSec: o[0].startSec,
    endSec: Math.max(...o.map((i) => i.endSec ?? i.startSec))
  };
}
function Io(e, t) {
  const r = new Set(t.removedSegmentIds || []), o = new Set(t.removedItemIds || []), i = t.survivor, a = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => c.id === i.id ? { ...c, ...i } : c);
  a.some((c) => c.id === i.id) || a.push(i);
  const s = t.performerSlots == null ? e.performerSlots : (e.performerSlots || []).filter((c) => c.segmentId !== i.id && !r.has(c.segmentId)).concat(t.performerSlots), l = { ...e.performerSlotRevisions || {} };
  t.performerSlotRevisions != null && (delete l[i.id], r.forEach((c) => delete l[c]), Object.assign(l, t.performerSlotRevisions));
  const d = { ...e.itemMetadata || {} };
  return t.itemMetadata != null && (i.itemId != null && delete d[i.itemId], o.forEach((c) => delete d[c]), Object.assign(d, t.itemMetadata)), {
    ...e,
    segments: a,
    performerSlots: s,
    performerSlotRevisions: l,
    itemMetadata: d,
    approvedSetVersion: t.approvedSetVersion ?? e.approvedSetVersion
  };
}
function At(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Cn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Qs(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function $n({ performer: e, compact: t = !1, tooltip: r = null }) {
  const o = Number(e == null ? void 0 : e.id) > 0;
  return n("span", {
    title: r || void 0,
    "aria-label": r || void 0,
    className: `relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted font-semibold text-secondary ${t ? "h-[1.125rem] w-[1.125rem] border-border text-[7px]" : `h-6 w-6 justify-self-end text-[8px] ${o ? "border-border" : "border-dashed border-amber-500/50"}`}`
  }, [
    n("span", {
      key: "fallback",
      "aria-hidden": "true",
      className: "flex h-full w-full items-center justify-center"
    }, o ? Qs(e.name) : "—"),
    o ? n("img", {
      key: "image",
      src: `/api/performers/${e.id}/image?max=64`,
      alt: "",
      loading: "lazy",
      className: "absolute inset-0 h-full w-full object-cover",
      onError: (i) => {
        i.currentTarget.style.display = "none";
      }
    }) : null
  ]);
}
function Aa({ assignments: e, className: t = "" }) {
  return n("span", {
    className: `grid items-center gap-x-3 gap-y-1.5 ${t}`,
    style: { gridTemplateColumns: "minmax(4.5rem, auto) minmax(0, 1fr) 1.5rem" }
  }, (e || []).flatMap((r) => {
    var o;
    return [
      n("span", {
        key: `${r.key}:slot`,
        className: "truncate text-[10px] font-semibold uppercase tracking-wide text-secondary"
      }, r.label),
      n("span", {
        key: `${r.key}:performer`,
        className: "min-w-0 truncate text-xs text-foreground",
        title: r.title,
        "aria-label": r.title
      }, ((o = r.performer) == null ? void 0 : o.name) || "Unfilled"),
      n($n, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Xn({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${fa()}`, [a, s] = D(null);
  function l() {
    var b;
    const c = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    if (!c) return;
    const g = Math.max(0, Math.min(256, window.innerWidth - 16)), m = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), u = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - g - 8, c.right - g)),
      top: u >= m + 8 ? c.bottom + 4 : Math.max(8, c.top - m - 4),
      width: g
    });
  }
  fe(() => {
    if (a)
      return window.addEventListener("scroll", l, !0), window.addEventListener("resize", l), () => {
        window.removeEventListener("scroll", l, !0), window.removeEventListener("resize", l);
      };
  }, [a != null, t == null ? void 0 : t.length]);
  const d = (t || []).map((c) => `${c.label}: ${c.performer.name}`).join(", ") || "Performer assignments";
  return r ? n("span", {
    ref: o,
    tabIndex: 0,
    className: "relative ml-auto flex shrink-0 -space-x-1 rounded-full focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": d,
    "aria-describedby": i,
    onMouseEnter: l,
    onMouseLeave: () => s(null),
    onFocus: l,
    onBlur: () => s(null),
    onKeyDown: (c) => {
      c.key === "Escape" && s(null);
    }
  }, [
    ...e.slice(0, 3).map((c) => n($n, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Ni(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Aa, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n($n, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Xs(e, t) {
  const r = new Set(At(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ma(e, t) {
  return t ? At(e).filter((r) => r !== t) : At(e);
}
function el(e, t) {
  const r = At(t), o = new Set(At(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function ht(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Co(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Nr(e, t, r, o = null) {
  var g, m, u, b, p, h;
  const i = e.findIndex((f) => f.markers.some((S) => S.segment.id === t));
  if (i < 0) {
    const f = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && f.sort((S, y) => Co(S, y, o)), ((m = f[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((f) => f.segment.id === t);
  if (r === "left" || r === "right") {
    const f = r === "left" ? -1 : 1, S = Math.min(a.markers.length - 1, Math.max(0, s + f));
    return ((u = a.markers[S]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((b = a.markers[s]) == null ? void 0 : b.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((h = [...e[l].markers].sort(c ? (f, S) => Co(f, S, Number(o)) : (f, S) => Math.abs(f.segment.startSec - d) - Math.abs(S.segment.startSec - d) || f.segment.startSec - S.segment.startSec || f.segment.id - S.segment.id)[0]) == null ? void 0 : h.segment) ?? null;
}
function tl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Nr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function nl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function rl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function $o(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function To(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? Ra(e, null, 1, !0) ?? r[0] ?? null;
}
function Ra(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((m) => m.markers.some((u) => u.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((u) => u.markers.map((b) => b.segment)).filter((u) => u.reviewState === "unreviewed");
    return r < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((u) => u.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((u) => u.segment)), d = l.findIndex((m) => m.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function ol(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const b = Number(u.startSec), p = u.endSec == null ? b + Mi : Number(u.endSec);
    return Number.isFinite(b) && Number.isFinite(p) && p >= b && b <= i + lo + In && p >= i - lo - In;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function al(e, t, r) {
  var a;
  const o = Number(r);
  if (!Number.isFinite(o) || t == null) return null;
  const i = (Array.isArray(e) ? e : []).find((s) => {
    var l;
    return (l = s.markers) == null ? void 0 : l.some(({ segment: d }) => d.id === t);
  });
  return i ? ((a = i.markers.map(({ segment: s }) => {
    const l = Number(s.startSec), d = s.endSec == null ? l : Number(s.endSec), c = Number.isFinite(d) && d >= l ? d : l, g = o < l ? l - o : o > c ? o - c : 0;
    return { segment: s, distance: g, startDistance: Math.abs(l - o) };
  }).filter((s) => Number.isFinite(s.distance)).sort((s, l) => s.distance - l.distance || s.startDistance - l.startDistance || String(s.segment.id).localeCompare(String(l.segment.id)))[0]) == null ? void 0 : a.segment) ?? null : null;
}
function Yn(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Zd(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function il(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function Qd(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function sl(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function ll(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function dl(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function cl(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Ir(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function ul(e, t, r = 10) {
  const o = Ir(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Ao(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function ml(e, t = na) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ea(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : rt.timelineRatio;
}
function Cr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Lt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.detailWidth : Math.min(Cr(t, 0), Math.max(240, e));
}
function Wn(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function gl(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Lr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: rt.timelineRatio, maximum: rt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function Fr(e, t) {
  const r = Ea(e);
  if (!(t > 0)) return r;
  const o = Lr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function pl(e) {
  if (!e) return { ...rt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ea(r) : rt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Lt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Lt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Wn(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...rt };
  }
}
function fl(e, t, r) {
  return r > 0 ? Fr((t + r - e) / r, r) : rt.timelineRatio;
}
function Xd(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function yl(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= In ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Pt(e, t, r, o) {
  return e === t && r === o;
}
function bl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [Do(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => Do(Math.min(s, r + l))))];
}
function hl(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function vl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Mo(e, t) {
  if (!e || !t) return e;
  const r = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((c) => [c.previousId, c.currentId])
  ), i = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((c) => [c.id, c])
  ), a = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => i.has(c.id) ? { ...c, ...i.get(c.id) } : c), s = new Set(a.map((c) => c.id));
  for (const c of i.values())
    s.has(c.id) || a.push(c);
  a.sort((c, g) => Number(c.startSec) - Number(g.startSec) || String(c.key || "").localeCompare(String(g.key || "")));
  const l = (e.performerSlots || []).filter((c) => !r.has(c.segmentId) || o.has(c.segmentId)).map((c) => o.has(c.segmentId) ? { ...c, segmentId: o.get(c.segmentId) } : c), d = {};
  for (const [c, g] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const m = Number(c);
    r.has(m) && !o.has(m) || (d[o.get(m) ?? c] = g);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function Ro(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function xl(e) {
  if (!Array.isArray(e)) return [];
  const t = [], r = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!o) continue;
    const i = String(o.tagName || "").trim() || "Tag segment";
    let a = r.get(i);
    a || (a = { tagName: i, examples: [] }, r.set(i, a), t.push(a)), a.examples.push(o);
  }
  return t;
}
async function Sl(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await Eo(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = bl(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await Eo(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const b = await kl(o), p = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: p, timestampSec: u }), s.push({
          fieldName: p,
          file: new File(
            [b],
            `${p}.jpg`,
            { type: "image/jpeg" }
          )
        });
      }
      a.push({
        exampleId: d.id,
        expectedExampleRevision: d.revision,
        expectedRepresentationRevision: d.representationRevision,
        frames: c
      });
    }
    return { captures: a, files: s };
  } finally {
    r.pause(), r.removeAttribute("src"), r.load(), r.remove();
  }
}
function Eo(e, t) {
  return t === "loadedmetadata" && e.readyState >= 1 || t === "loadeddata" && e.readyState >= 2 ? Promise.resolve() : new Promise((r, o) => {
    const i = setTimeout(
      () => l(
        o,
        new Error("Timed out while reading video frames.")
      ),
      3e4
    ), a = () => l(r), s = () => l(
      o,
      new Error("The video could not be decoded for frame capture.")
    ), l = (d, c) => {
      clearTimeout(i), e.removeEventListener(t, a), e.removeEventListener("error", s), d(c);
    };
    e.addEventListener(t, a, { once: !0 }), e.addEventListener("error", s, { once: !0 });
  });
}
function kl(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Do(e) {
  return Math.round(e * 1e3) / 1e3;
}
function Oo(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function wl(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, pendingDuplicateRef: u, pendingFirstSegmentStartSecRef: b, pendingTagEditSegmentIdRef: p, replaceSegmentSelection: h, savingSegmentId: f, segments: S, selectedSegment: y, selectedSegmentIdRef: O, selectedSegments: V, selectionAnchorIdRef: C, selectionRangeBaseIdsRef: q, setEditorFilters: A, setFirstSegmentTagOpen: w, setHideDerivedSegments: $, setHistory: G, setHistoryOpen: Z, setPublishApprovedError: P, setSaveMessage: L, setSavingSegmentId: T, setSelectedSegmentGroupKey: R, setSelectedSegmentId: F, setSelectedSegmentIds: ae, startInput: ee, timelineDuration: ke, video: J } = e;
  function K(oe) {
    l.current = oe || kt, G(l.current);
  }
  async function Y(oe, x, U, I, N = null) {
    var M;
    try {
      const v = await Q(`/videos/${J.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: oe,
          label: x,
          beforeState: U,
          afterState: I,
          receiptId: N
        })
      });
      return K(v), !0;
    } catch (v) {
      return v.status === 409 && ((M = v.payload) != null && M.current) && K(v.payload.current), L("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function j(oe, x, U = !0, I = null) {
    var M;
    if (!oe || f != null) return null;
    const N = U && !t ? crypto.randomUUID() : null;
    T(oe.id), L(U ? "Saving directly to Cove…" : "Restoring history…");
    try {
      if (t && oe.nativeSegmentId == null && oe.itemId != null) {
        const se = `draft-update:${J.id}:${oe.itemId}:${oe.revision}:${x.tagId}:${x.startSec}:${x.endSec ?? "open"}:${x.reviewState ?? oe.reviewState}`, ne = await Q(`/videos/${J.id}/drafts/${oe.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ae(se),
            expectedRevision: oe.revision,
            startSec: x.startSec,
            endSec: x.endSec,
            tagId: x.tagId,
            reviewState: x.reviewState
          })
        });
        Me(se);
        const ie = {
          ...oe,
          ...ne.draft,
          id: oe.id,
          itemId: oe.itemId
        };
        return U && await Y(
          "segment.update",
          I || "Changed segment",
          zn(oe, t),
          zn(
            ie,
            t
          )
        ), Oo(oe, x, t) ? await m() : g({
          ...o,
          approvedSetVersion: ne.approvedSetVersion || o.approvedSetVersion,
          segments: S.map((ve) => ve.id === oe.id ? ie : ve).sort((ve, W) => ve.startSec - W.startSec || ve.id - W.id)
        }, J.id), L(((M = ne.draft) == null ? void 0 : M.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ie;
      }
      const v = await Q(`/videos/${J.id}/segments/${oe.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...x,
          expectedUpdatedAt: oe.updatedAt,
          historyReceiptId: N
        })
      }), k = {
        ...oe,
        ...v,
        reviewState: x.reviewState ?? oe.reviewState
      }, z = S.map((se) => se.id === oe.id ? k : se).sort((se, ne) => se.startSec - ne.startSec || se.id - ne.id);
      return Oo(oe, x, t) ? await m() : g({ ...o, segments: z }, J.id), U && await Y(
        "segment.update",
        I || "Changed segment",
        zn(oe, t),
        zn(
          k,
          t
        ),
        N
      ), L(U ? "Saved to Cove" : "History restored"), k;
    } catch (v) {
      return v.status === 409 ? (L("Conflict — loading the latest segment…"), await c()) : L(v.message || "Unable to save the segment."), null;
    } finally {
      T(null);
    }
  }
  async function X() {
    if (!t) return !1;
    const oe = S.filter((U) => !U.published && U.reviewState === "approved").length;
    if (oe === 0 || f != null) return !1;
    const x = `complete-review:${J.id}:${o.approvedSetVersion}`;
    P(""), T(-1), L(`Publishing ${oe} Approved draft${oe === 1 ? "" : "s"}…`);
    try {
      const U = await Q(`/videos/${J.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(x),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Me(x), K(kt), Z(!1);
      const I = await m(), N = is(
        S,
        O.current,
        U.published
      ), M = N ? ze(I == null ? void 0 : I.segments, N) : null;
      return M && F(M.id), L(`${U.published.length} Approved draft${U.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (U) {
      const I = U.status === 409 ? "The approved drafts changed. Review the updated list and try again." : U.message || "Unable to publish the approved drafts.";
      return U.status === 409 && await c(), P(I), L(I), !1;
    } finally {
      T(null);
    }
  }
  async function re(oe = null) {
    var z;
    if (f != null) return;
    const x = oe != null ? b.current : null, U = Number.isFinite(x) ? x : r, I = Math.min(ke, U + 20);
    if (I <= U) {
      L("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const N = as(S, y, oe);
    if (N.kind === "choose-tag") {
      b.current = U, L(""), w(!0);
      return;
    }
    if (N.kind === "invalid-selection") {
      L("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: M } = N, v = `create-draft:${J.id}:${M}:${U}`, k = t ? null : crypto.randomUUID();
    T(-1);
    try {
      let se;
      if (t) {
        const ve = await Q(`/videos/${J.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Ae(v), tagId: M, startSec: U, endSec: I })
        });
        Me(v), se = { itemId: (z = ve.draft) == null ? void 0 : z.itemId };
      } else
        se = { nativeSegmentId: (await Q(`/videos/${J.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: M,
            startSec: U,
            endSec: I,
            historyReceiptId: k
          })
        })).id };
      b.current = null, w(!1);
      const ne = await m(), ie = ze(ne == null ? void 0 : ne.segments, se);
      ie ? (t || await Y(
        "segment.create",
        "Created segment",
        lt([], !1),
        lt([ie], !1),
        k
      ), N.openTagEditor && (p.current = ie.id), h(ie.id), R(ht(
        rn(ne.segments || [], ne.segmentGroups || [], ne.performerSlots || []),
        ie.id
      ))) : L("Segment created, but it could not be selected.");
    } catch (se) {
      L(se.message || "Unable to create the draft.");
    } finally {
      T(null);
    }
  }
  async function de() {
    if (V.length !== 1 || !y || f != null) return;
    const oe = r;
    if (oe <= y.startSec || y.endSec != null && oe >= y.endSec) {
      L("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const x = `split-draft:${y.itemId}:${y.revision}:${oe}`, U = t ? null : lt([y], !1), I = t ? null : crypto.randomUUID();
    T(y.id);
    try {
      let N = null;
      t && y.nativeSegmentId == null ? (await Q(`/videos/${J.id}/drafts/${y.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(x),
          expectedRevision: y.revision,
          splitSec: oe
        })
      }), Me(x)) : N = { nativeSegmentId: (await Q(`/videos/${J.id}/segments/${y.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: y.updatedAt,
          splitSec: oe,
          historyReceiptId: I
        })
      })).id };
      const M = await m();
      if (!t) {
        const v = [
          ze(M == null ? void 0 : M.segments, {
            nativeSegmentId: y.nativeSegmentId ?? y.id
          }),
          ze(
            M == null ? void 0 : M.segments,
            N
          )
        ].filter(Boolean);
        await Y(
          "segment.split",
          "Split segment",
          U,
          lt(v, !1),
          I
        );
      }
      L(t ? `Segment split; both ranges remain ${y.reviewState}.` : "Segment split.");
    } catch (N) {
      N.status === 409 ? await c() : L(N.message || "Unable to split the draft.");
    } finally {
      T(null);
    }
  }
  async function Te(oe = !1) {
    var N, M;
    if (V.length !== 1 || !y || f != null) return;
    const x = oe ? r : y.startSec, U = os(J.id, y, oe, x), I = t ? null : crypto.randomUUID();
    T(y.id);
    try {
      const v = ((N = u.current) == null ? void 0 : N.operationKey) === U ? u.current : null;
      let k = (v == null ? void 0 : v.duplicateIdentity) ?? null;
      if (k == null && t && y.nativeSegmentId == null) {
        const ne = await Q(`/videos/${J.id}/drafts/${y.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ae(U),
            expectedRevision: y.revision,
            startSec: oe ? x : null
          })
        });
        k = po(!1, ne), u.current = { operationKey: U, duplicateIdentity: k };
      } else if (k == null) {
        const ne = await Q(`/videos/${J.id}/segments/${y.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: y.updatedAt,
            startSec: oe ? x : null,
            historyReceiptId: I
          })
        });
        k = po(!0, ne), u.current = { operationKey: U, duplicateIdentity: k };
      }
      const z = await m(), se = ze(z == null ? void 0 : z.segments, k);
      if (se) {
        t || await Y(
          "segment.duplicate",
          "Duplicated segment",
          lt([], !1),
          lt([se], !1),
          I
        );
        const ne = Oi(
          se,
          z.performerSlots || [],
          i,
          s,
          z.segmentGroups || []
        );
        A(ne.filters), $(ne.hideDerivedSegments), ae([se.id]), F(se.id), C.current = se.id, q.current = [], R(ht(
          rn(z.segments || [], z.segmentGroups || [], z.performerSlots || []),
          se.id
        )), t && y.nativeSegmentId == null && Me(U), u.current = null, L(oe ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        L("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (v) {
      ((M = u.current) == null ? void 0 : M.operationKey) === U ? L("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : v.status === 409 ? await c() : L(v.message || "Unable to duplicate the draft.");
    } finally {
      T(null);
    }
  }
  async function le() {
    if (V.length !== 1 || !y) return;
    const oe = Number(ee), x = a.trim() === "" ? null : Number(a), U = $o(oe, x, d);
    if (U.error) {
      L(U.error);
      return;
    }
    if (oe === y.startSec && x === y.endSec) {
      L("Timing is unchanged.");
      return;
    }
    await j(y, { startSec: oe, endSec: x, tagId: y.tagId });
  }
  async function Ne(oe, x) {
    if (V.length !== 1 || !y) return;
    const U = $o(oe, x, d);
    if (U.error) {
      L(U.error);
      return;
    }
    if (oe === y.startSec && x === y.endSec) {
      L("Timing is unchanged.");
      return;
    }
    await j(y, { startSec: oe, endSec: x, tagId: y.tagId });
  }
  return { acceptHistory: K, recordHistoryAction: Y, mutateSegment: j, completeReview: X, createSegment: re, splitSegment: de, duplicateSegment: Te, saveTiming: le, applyShortcutTiming: Ne };
}
function Nl() {
  const [e, t] = D(() => typeof window < "u" && window.matchMedia(io).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(io), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Il() {
  const [e, t] = D(() => typeof window < "u" && window.matchMedia(so).matches);
  return fe(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(so), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Cl() {
  try {
    return pl(window.localStorage.getItem(Yo));
  } catch {
    return { ...rt };
  }
}
function $l() {
  try {
    return At(JSON.parse(window.localStorage.getItem(Zo) || "[]"));
  } catch {
    return [];
  }
}
function Tl(e) {
  try {
    window.localStorage.setItem(Zo, JSON.stringify(At(e)));
  } catch {
  }
}
function Al(e) {
  try {
    window.localStorage.setItem(Yo, JSON.stringify(e));
  } catch {
  }
}
function Ml() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Xo) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Rl(e) {
  try {
    return window.localStorage.setItem(Xo, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function El({ status: e }) {
  const t = wa[e];
  return t ? n("span", {
    "aria-label": `Slot status: ${e}`,
    className: "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: {
      borderColor: t.color,
      backgroundColor: t.backgroundColor,
      color: "var(--color-foreground)"
    }
  }, "Slots unfilled") : null;
}
function Tt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Xe.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...Sa(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${pt[t].symbol}${e[t]}`)));
}
function Dl({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onSaved: s, onConflict: l, confirmRef: d, shortcutRef: c }) {
  const g = Rr(a), [m, u] = D(() => br(o, g)), [b, p] = D(!1), [h, f] = D(""), S = pe(!1), y = o.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join("|"), O = g.map((w) => Ke(w)).join("|"), V = ga(
    o,
    g
  );
  fe(() => {
    u(br(o, g)), f("");
  }, [t, r, y, O]);
  async function C(w = m) {
    if (!S.current) {
      S.current = !0, p(!0), f("Saving performer slots…");
      try {
        const $ = br(o.map((Z) => ({
          ...Z,
          performerId: w[Z.slotDefinitionId] || null
        })), g), G = await Q(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((Z) => ({ slotDefinitionId: Z.slotDefinitionId, performerId: $[Z.slotDefinitionId] ? Number($[Z.slotDefinitionId]) : null }))
          })
        });
        f("Performer slots saved."), s(G, {
          beforeState: Vn([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Vn([{
            segmentId: t,
            itemId: r,
            revision: G.revision,
            slots: G.slots || []
          }])
        });
      } catch ($) {
        $.status === 409 ? (f("Slot definitions or assignments changed; current values were reloaded."), l()) : f($.message || "Unable to save performer slots.");
      } finally {
        S.current = !1, p(!1);
      }
    }
  }
  function q(w, $) {
    f(`Option ${$ + 1} applied; save to confirm.`), u({ ...m, ...w.assignments });
  }
  async function A(w) {
    const $ = { ...m, ...w.assignments };
    u($), await C($);
  }
  return fe(() => {
    if (c)
      return c.current = (w) => S.current || !V[w] ? !1 : (A(V[w]), !0), () => {
        c.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    V.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, V.map((w, $) => n("button", {
        key: $,
        type: "button",
        disabled: b,
        onClick: () => q(w, $),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${$ + 1}: ${w.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, $ + 1),
        n("span", { key: "description" }, w.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${V.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((w) => n("label", { key: w.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(w)),
      (w.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(w.genderHints || []).map(Qn).join(" · ")}`) : null,
      n("select", { key: "select", value: m[w.slotDefinitionId] || "", disabled: b, onChange: ($) => u({ ...m, [w.slotDefinitionId]: $.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...pa(g, g, w.genderHints).map(($) => n("option", { key: Ke($), value: Ke($) }, $.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: d, type: "button", disabled: b, onClick: () => C(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)])
  ]);
}
function Ol({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var q;
  const s = ((q = t[0]) == null ? void 0 : q.slots) || [], l = Rr(r), d = ga(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((A, w) => {
    const $ = t.map((G) => {
      var Z;
      return String(((Z = G.slots[w]) == null ? void 0 : Z.performerId) || "");
    });
    return [A.slotDefinitionId, $.every((G) => G === $[0]) ? $[0] : c];
  })), [m, u] = D(g), [b, p] = D(!1), [h, f] = D(""), S = pe(!1), y = t.map((A) => `${A.itemId ?? `native:${A.segmentId}`}:${A.revision}:${A.slots.map((w) => `${w.slotDefinitionId}:${w.performerId || ""}`).join(",")}`).join("|");
  fe(() => {
    u(g());
  }, [y]);
  async function O(A = m) {
    if (S.current) return;
    S.current = !0, p(!0), f(`Saving performer slots for ${t.length} segments…`);
    const w = [];
    try {
      for (const $ of t) {
        const G = $.slots.map((P, L) => {
          const T = A[s[L].slotDefinitionId];
          return {
            slotDefinitionId: P.slotDefinitionId,
            performerId: T === c ? P.performerId || null : T ? Number(T) : null
          };
        }), Z = await Q($.itemId != null ? `/videos/${e}/drafts/${$.itemId}/slots` : `/videos/${e}/segments/${$.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: $.revision, assignments: G })
        });
        w.push({
          segmentId: $.segmentId,
          itemId: $.itemId,
          revision: Z.revision,
          slots: Z.slots || []
        });
      }
      f("Performer slots saved."), o({
        beforeState: Vn(t),
        afterState: Vn(w)
      });
    } catch ($) {
      const G = await i();
      $.status === 409 ? f(G ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : f($.message || (G ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      S.current = !1, p(!1);
    }
  }
  function V(A, w) {
    f(`Option ${w + 1} applied; save to confirm.`), u({ ...m, ...A.assignments });
  }
  async function C(A) {
    const w = { ...m, ...A.assignments };
    u(w), await O(w);
  }
  return fe(() => {
    if (a)
      return a.current = (A) => S.current || !d[A] ? !1 : (C(d[A]), !0), () => {
        a.current = null;
      };
  }), n("div", { className: "space-y-3" }, [
    n(
      "p",
      { key: "scope", className: "text-xs text-secondary" },
      `Changes apply to all ${t.length} selected segments. Mixed values remain unchanged unless replaced.`
    ),
    d.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, d.map((A, w) => n("button", {
        key: w,
        type: "button",
        disabled: b,
        onClick: () => V(A, w),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${w + 1} to all selected segments: ${A.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, w + 1),
        n("span", { key: "description" }, A.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((A) => n("label", {
      key: A.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(A)),
      n("select", {
        key: "select",
        value: m[A.slotDefinitionId] || "",
        disabled: b,
        onChange: (w) => u({ ...m, [A.slotDefinitionId]: w.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[A.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...pa(l, l, A.genderHints).map((w) => n("option", {
          key: Ke(w),
          value: Ke(w)
        }, w.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: b,
        onClick: () => O(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function ft(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Pl(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return ft(t);
  const o = [...new Set(r.map((i) => ft(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function er() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function _n({ name: e }) {
  const t = {
    filter: [
      n("path", { key: "shape", d: "M3 5h18l-7 8v5l-4 2v-7L3 5Z" })
    ],
    keyboard: [
      n("rect", { key: "frame", x: "3", y: "6", width: "18", height: "12", rx: "2" }),
      n("path", { key: "keys", d: "M7 10h.01M11 10h.01M15 10h.01M19 10h.01M7 14h.01M11 14h6" })
    ],
    history: [
      n("path", { key: "shape", d: "M3 12a9 9 0 1 0 3-6.7L3 8" }),
      n("path", { key: "arrow", d: "M3 3v5h5M12 7v5l3 2" })
    ],
    list: [
      n("path", { key: "rows", d: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" })
    ]
  };
  return n("svg", {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
    className: "h-3.5 w-3.5 shrink-0"
  }, t[e] || null);
}
function Ll({ hidden: e }) {
  return n("span", { className: "flex items-center gap-0.5", "aria-hidden": "true" }, [
    n("svg", {
      key: "eye",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 1.8,
      className: "h-4 w-4"
    }, [
      n("path", { key: "outline", d: "M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" }),
      n("circle", { key: "pupil", cx: 12, cy: 12, r: 2.5 }),
      e ? n("path", { key: "slash", d: "M4 4l16 16" }) : null
    ]),
    n(er, { key: "derived" })
  ]);
}
function Fl({ segment: e, provenance: t }) {
  var g;
  const [r, o] = D(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Pl(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((m) => !m),
      "aria-expanded": r,
      "aria-controls": l,
      className: "flex w-full min-w-0 items-center gap-2 px-2 py-1.5 text-left"
    }, [
      n("span", { key: "chevron", "aria-hidden": "true", className: "w-3 shrink-0 text-[10px] text-secondary" }, r ? "▼" : "▶"),
      n("span", { key: "heading", className: "shrink-0 text-[11px] font-semibold text-foreground" }, "Provenance"),
      n(
        "span",
        { key: "summary", className: "min-w-0 flex-1 truncate text-right text-[11px] text-secondary" },
        `${d}${c}`
      )
    ]),
    r ? n(
      "div",
      { key: "details", id: l, className: "space-y-2 border-t border-border px-3 py-2" },
      a.loading ? n("p", { className: "text-xs text-secondary" }, "Loading provenance…") : a.error ? n("p", { className: "text-xs text-secondary" }, a.error) : s.length === 0 ? n(
        "p",
        { className: "text-xs text-secondary" },
        (g = e.sourceKey) != null && g.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((m) => {
        const u = m.modelIdentifier || m.modelKey, b = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return n("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            ft(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${b == null ? "" : ` · ${b}`}`
          ) : null,
          m.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          u ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${u}${m.modelVersion ? ` · ${m.modelVersion}` : ""}`
          ) : null,
          m.activityExternalRunId || m.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${m.activityExternalRunId || m.sourceRunId}`) : null,
          m.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(m.confidence * 100)}%`
          ) : null,
          m.recordedAt || m.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${m.recordedAt || m.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function Bl({
  selectedGroups: e,
  selectedSegments: t,
  activeSegmentId: r,
  detailPanelRef: o,
  onReduceSelection: i,
  reviewable: a,
  tagEditable: s,
  slotsEditable: l,
  onEditSlots: d,
  slotButtonRef: c,
  saveMessage: g
}) {
  const [m, u] = D([]), b = e.flatMap((S) => S.lanes.map((y) => y.key)), p = b.join("|");
  fe(() => {
    const S = new Set(b);
    u((y) => y.filter((O) => S.has(O)));
  }, [p]);
  const h = Jn(t), f = !!Ta(
    e,
    { nativeOnly: !a }
  );
  return n("section", {
    ref: o,
    tabIndex: -1,
    "aria-label": "Selected segment details",
    className: "min-h-0 space-y-3 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("header", { key: "summary", className: "space-y-1" }, [
      n(
        "div",
        { key: "title", className: "text-sm font-semibold text-foreground" },
        `${t.length} segments selected`
      ),
      n(
        "div",
        { key: "scope", className: "text-xs text-secondary" },
        `${b.length} swimlane${b.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(Tt, { key: "counts", counts: h }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      Us({ mergeable: f, reviewable: a, tagEditable: s, slotsEditable: l })
    ),
    l ? n("button", {
      key: "slots",
      ref: c,
      type: "button",
      onClick: d,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
    }, "Edit performer slots") : null,
    g ? n("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary"
    }, g) : null,
    ...e.map((S) => n("section", {
      key: S.key,
      "data-selected-segment-group": S.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, S.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${S.selectedCount} selected`)
      ]),
      ...S.lanes.map((y) => {
        const O = m.includes(y.key), V = y.markers.some(({ segment: q }) => q.id === r), C = `selected-segment-lane-${y.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: y.key,
          "data-selected-segment-lane": y.key,
          className: `rounded-md border ${V ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": O,
            "aria-controls": C,
            "aria-current": V ? "true" : void 0,
            onClick: () => u((q) => O ? q.filter((A) => A !== y.key) : [...q, y.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, O ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Cn(y)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(y.selectedCount)),
            a ? n(Tt, { key: "states", counts: y.counts }) : null
          ]),
          O ? n("div", {
            key: "segments",
            id: C,
            className: "space-y-1 border-t border-border p-1.5"
          }, y.markers.map(({ segment: q }) => {
            const A = q.endSec == null ? Se(q.startSec) : `${Se(q.startSec)} – ${Se(q.endSec)}`;
            return n("button", {
              key: q.id,
              type: "button",
              onClick: () => i(q),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${q.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${q.tagName || "Segment"}, ${q.reviewState}, ${A}` : `${q.tagName || "Segment"}, ${A}`,
              "aria-current": q.id === r ? "true" : void 0
            }, [
              a ? n(Bt, {
                key: "state",
                state: q.reviewState,
                includeLabel: !1
              }) : null,
              q.isDerived ? n(er, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, A),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                ft(q.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Sn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, Po = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Lo = [
  { id: "hasSegments", label: "Has Segments", type: "bool", filterKey: "hasSegmentsCriterion" },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: [
    { value: "unreviewed", label: "Has unreviewed" },
    { value: "approved", label: "Has approved" },
    { value: "rejected", label: "Has rejected" }
  ] },
  { id: "segmentTags", label: "Segment Tags", type: "multiId", entityType: "tags", filterKey: "segmentTagsCriterion", hierarchyToggleLabel: "Include sub-tags" },
  { id: "shotBoundaries", label: "Has Shot Boundaries", type: "bool", filterKey: "shotBoundariesCriterion" },
  { id: "tags", label: "Video Tags", type: "multiId", entityType: "tags", filterKey: "tagsCriterion", hierarchyToggleLabel: "Include sub-tags" },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion" },
  { id: "studios", label: "Studios", type: "multiId", entityType: "studios", filterKey: "studiosCriterion", hierarchyToggleLabel: "Include sub-studios" }
];
function An(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Da(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Fo(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Hn(e, t, r, o = null) {
  const i = Fo(t), a = Fo(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Gl(e, t, r = null) {
  var m, u, b;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Hn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Hn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Hn(o, t.performersCriterion, "performer"), Hn(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Bo(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Bo(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (b = t.shotBoundariesCriterion) == null ? void 0 : b.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Bo(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function Oa({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(wo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Xe.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = pt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(wo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function jl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/60" }, [
    n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (i) => An(i, t, o),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Ii(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Oa, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Kl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "overflow-hidden rounded-md border border-border bg-card" }, n("a", {
    href: `/segment-studio/${e.videoId}`,
    onClick: (i) => An(i, t, o),
    className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": `Open segment editor for ${e.title}`
  }, [
    n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
    n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
      n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
      n(Oa, { key: "segments", item: e, showReviewStates: r })
    ]),
    n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
  ]));
}
function Br({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = cs(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => An(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && nn(
        o,
        wt.recyclingBinView
      ) ? n(Pa, { key: "bin", onNavigate: t }) : null,
      n(La, { key: "settings", onNavigate: t })
    ])
  ]);
}
const $r = "segment-studio:recycling-bin-changed";
function Ul(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function wn() {
  window.dispatchEvent(new CustomEvent($r));
}
function Pa({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = D(null);
  fe(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await Q("/bin"), m = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(m) && m >= 0 ? Math.trunc(m) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener($r, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener($r, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Ul(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => An(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function La({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => An(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function zl({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = kr(i.target.value);
    t == null || t(a);
  }
  return n("label", { className: "block space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, "Mode"),
    n("select", {
      key: "select",
      value: e,
      onChange: o,
      disabled: r,
      className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
    }, [
      n("option", { key: "basic", value: "basic" }, "Basic"),
      n("option", { key: "full", value: "full" }, "Full")
    ]),
    n("span", { key: "help", className: "block max-w-sm" }, "Mode is saved to your Cove user account and applies across browsers.")
  ]);
}
function _l({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = D("maximum"), s = (u, b) => {
    const p = Fi(e, t, u, b);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (u, b) => {
    var h;
    const p = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    p && s(u, Li(b.clientX, p.left, p.width));
  }, d = (u, b) => {
    var p, h;
    b.preventDefault(), (h = (p = b.currentTarget).setPointerCapture) == null || h.call(p, b.pointerId), l(u, b);
  }, c = (u, b) => {
    var p, h;
    (h = (p = b.currentTarget).hasPointerCapture) != null && h.call(p, b.pointerId) && l(u, b);
  }, g = (u, b) => {
    const p = u === "minimum" ? e : t, h = u === "minimum" ? 0 : e, f = u === "minimum" ? t : 1, S = b.shiftKey ? 0.1 : 0.01;
    let y = null;
    ["ArrowLeft", "ArrowDown"].includes(b.key) && (y = p - S), ["ArrowRight", "ArrowUp"].includes(b.key) && (y = p + S), b.key === "PageDown" && (y = p - 0.1), b.key === "PageUp" && (y = p + 0.1), b.key === "Home" && (y = h), b.key === "End" && (y = f), y != null && (b.preventDefault(), s(u, Math.min(f, Math.max(h, y))));
  }, m = (u, b) => n("span", {
    key: u,
    role: "slider",
    tabIndex: 0,
    "aria-label": u === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((u === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((u === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(b * 100),
    "aria-valuetext": `${Math.round(b * 100)} percent`,
    onPointerDown: (p) => d(u, p),
    onPointerMove: (p) => c(u, p),
    onKeyDown: (p) => g(u, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${b * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === u ? 2 : 1
    }
  });
  return n("div", { className: "space-y-2", "data-confidence-range": "true" }, [
    n("div", { key: "values", className: "flex items-center justify-between gap-4 text-xs text-secondary" }, [
      n("span", { key: "minimum" }, ["Minimum ", n("strong", { key: "value", className: "font-mono text-foreground" }, `${Math.round(e * 100)}%`)]),
      n("span", { key: "maximum" }, ["Maximum ", n("strong", { key: "value", className: "font-mono text-foreground" }, `${Math.round(t * 100)}%`)])
    ]),
    n(
      "div",
      { key: "track-wrap", className: "px-2 py-2" },
      n("div", {
        ref: o,
        className: "relative h-2 rounded-full bg-muted"
      }, [
        n("span", {
          key: "selected-range",
          "aria-hidden": "true",
          className: "absolute inset-y-0 rounded-full bg-accent",
          style: { left: `${e * 100}%`, right: `${(1 - t) * 100}%` }
        }),
        m("minimum", e),
        m("maximum", t)
      ])
    )
  ]);
}
function Hl({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = pe(null);
  fe(() => {
    var l;
    const s = (l = i.current) == null ? void 0 : l.querySelector("input");
    s == null || s.focus({ preventScroll: !0 });
  }, []);
  const a = () => {
    e || o();
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (s) => {
      s.target === s.currentTarget && a();
    },
    onKeyDownCapture: (s) => ct(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "w-full max-w-lg space-y-4 rounded-lg border border-border bg-card p-5 shadow-2xl"
  }, [
    n("header", { key: "header", className: "space-y-1" }, [
      n("h2", {
        key: "title",
        id: "segment-studio-first-segment-tag-title",
        className: "text-lg font-semibold text-foreground"
      }, "Choose a tag for the first segment"),
      n(
        "p",
        { key: "description", className: "text-sm text-secondary" },
        "The selected tag creates the first swimlane at the playhead."
      )
    ]),
    n(Nn, {
      key: "tag",
      entityType: "tag",
      value: null,
      selectedDisplay: "input",
      selectedLabel: "",
      onChange: (s) => {
        s != null && r(s);
      },
      disabled: e,
      placeholder: "Find a tag…",
      inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
      creatable: !1,
      allowCreate: !1
    }),
    t ? n("p", { key: "error", role: "status", className: "text-sm text-red-300" }, t) : null,
    n("div", { key: "actions", className: "flex justify-end" }, n("button", {
      type: "button",
      disabled: e,
      onClick: a,
      className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40 disabled:opacity-50"
    }, e ? "Creating…" : "Cancel"))
  ]));
}
function ql({
  filters: e,
  hideDerivedSegments: t,
  performers: r,
  provenanceSources: o,
  reviewCounts: i,
  segments: a,
  segmentGroups: s,
  reviewMode: l = !1,
  onChange: d,
  onHideDerivedChange: c,
  onClose: g
}) {
  const m = dt(e), u = [...new Map((a || []).map((f) => [
    Number(f.tagId),
    f.tagName || `Tag ${f.tagId}`
  ])).entries()].sort((f, S) => f[1].localeCompare(S[1]) || f[0] - S[0]), b = (f) => d(dt({ ...m, ...f })), p = (f) => b({
    reviewStates: m.reviewStates.includes(f) ? m.reviewStates.filter((S) => S !== f) : [...m.reviewStates, f]
  }), h = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && g();
    },
    onKeyDownCapture: (f) => ct(f, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "flex items-start justify-between gap-4 border-b border-border px-5 py-4" }, [
      n("div", { key: "copy" }, [
        n("h2", { id: "segment-studio-editor-filters-title", className: "text-lg font-semibold text-foreground" }, "Editor filters"),
        n(
          "p",
          { className: "mt-1 text-sm text-secondary" },
          "These filters apply to the segment rail, swimlanes, selection, counts, and keyboard navigation."
        )
      ]),
      n("button", {
        key: "close",
        type: "button",
        autoFocus: !0,
        onClick: g,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    n("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? n("fieldset", { key: "approval", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        n("div", { className: "flex flex-wrap gap-2" }, Xe.map((f) => {
          const S = m.reviewStates.includes(f), y = pt[f];
          return n("button", {
            key: f,
            type: "button",
            onClick: () => p(f),
            "aria-pressed": S,
            className: h(S)
          }, `${y.symbol} ${f} (${i[f] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => b({ performerId: null }),
            "aria-pressed": m.performerId == null,
            className: h(m.performerId == null)
          }, "All performers"),
          ...r.map((f) => {
            const S = Number(Ke(f));
            return n("button", {
              key: S,
              type: "button",
              onClick: () => b({ performerId: S }),
              "aria-pressed": m.performerId === S,
              className: h(m.performerId === S)
            }, f.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: m.tagId ?? "",
            onChange: (f) => b({
              tagId: f.target.value === "" ? null : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...u.map(([f, S]) => n("option", { key: f, value: f }, S))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: m.segmentGroupId ?? "",
            onChange: (f) => b({
              segmentGroupId: f.target.value === "" ? null : f.target.value === "ungrouped" ? "ungrouped" : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((f) => n("option", { key: f.id, value: f.id }, f.name)),
            n("option", { key: "ungrouped", value: "ungrouped" }, "Ungrouped")
          ])
        ])
      ]),
      n("fieldset", { key: "provenance", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Provenance"),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "all",
            type: "button",
            onClick: () => b({ sourceKey: null }),
            "aria-pressed": m.sourceKey == null,
            className: h(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((f) => n("button", {
            key: f,
            type: "button",
            onClick: () => b({ sourceKey: f }),
            "aria-pressed": m.sourceKey === f,
            title: f,
            className: h(m.sourceKey === f)
          }, ft(f)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(_l, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: f, maximum: S }) => b({
            confidenceMin: f,
            confidenceMax: S
          })
        }),
        n("label", {
          key: "unscored",
          className: "flex items-center gap-2 text-xs text-secondary"
        }, [
          n("input", {
            key: "input",
            type: "checkbox",
            checked: m.includeUnscored,
            onChange: (f) => b({
              includeUnscored: f.target.checked
            }),
            className: "h-4 w-4 accent-[var(--color-accent)]"
          }),
          n("span", { key: "label" }, "Include unscored segments")
        ])
      ]),
      l ? n("label", { key: "derived", className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground" }, [
        n("input", {
          key: "input",
          type: "checkbox",
          checked: t,
          onChange: (f) => c(f.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(Ll, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(dt({})), l && c(!1);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
      }, "Reset filters"),
      n("button", {
        key: "done",
        type: "button",
        onClick: g,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
function Wl({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Tn.filter((l) => tn(l, e)), i = mo(o, 1)[0], a = mo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(sa)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
      )
    ]));
    return n("section", { key: l, className: "space-y-2", "aria-label": `${l} shortcuts` }, [
      n("h3", { key: "heading", className: "mb-3 font-semibold text-primary" }, l),
      n("div", { key: "items", className: "space-y-1" }, c)
    ]);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (l) => {
      l.target === l.currentTarget && r();
    },
    onKeyDownCapture: (l) => ct(l, { onCancel: r })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-shortcuts-title",
    className: "flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "flex shrink-0 items-center justify-between gap-4 p-6 pb-4" }, [
      n("h2", { key: "title", id: "segment-studio-shortcuts-title", className: "text-xl font-bold text-foreground" }, "Keyboard shortcuts"),
      n("button", { key: "close", type: "button", autoFocus: !0, onClick: r, className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground", "aria-label": "Close keyboard shortcuts" }, "×")
    ]),
    n("div", { key: "body", className: "min-h-0 overflow-y-auto px-6 pb-6" }, [
      n("div", { key: "mobile", className: "space-y-6 lg:hidden" }, i.map(s)),
      n(
        "div",
        { key: "desktop", className: "hidden items-start gap-6 lg:grid lg:grid-cols-2" },
        a.map((l, d) => n("div", { key: d, className: "space-y-6" }, l.map(s)))
      )
    ])
  ]));
}
function Vl({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = xl(e), [l, d] = D([]), c = s.map((g) => g.tagName).join("|");
  return fe(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => ct(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((g, m) => {
        const u = l.includes(g.tagName), b = `incorrect-example-tag-${m}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": u,
            "aria-controls": b,
            onClick: () => d((p) => u ? p.filter((h) => h !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Zn(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              u ? "▾" : "▸"
            ),
            n(
              "span",
              { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              g.tagName
            ),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${g.examples.length} example${g.examples.length === 1 ? "" : "s"}`
            )
          ]),
          u ? n("div", {
            key: "examples",
            id: b,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((p) => {
            const h = `${Se(p.startSec)}${p.endSec == null ? "" : ` – ${Se(p.endSec)}`}`, f = r === p.id;
            return n("div", {
              key: p.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                h
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => i(p),
                "aria-label": `${f ? "Restoring" : "Restore to review"} ${g.tagName} example at ${h}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, f ? "Restoring…" : "Restore to review")
            ]);
          })) : null
        ]);
      }) : [n("p", { key: "empty", className: "text-sm text-secondary" }, "Select one or more segments and press C to collect incorrect examples.")]),
      n(
        "p",
        { key: "artifact-help", className: "mt-4 text-xs text-secondary" },
        "The ZIP contains sampled JPEG frames, legacy metadata.json, and a provenance-rich manifest.json. Download it for manual submission; Segment Studio does not upload it automatically."
      )
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "cancel",
        type: "button",
        autoFocus: !0,
        disabled: t || r != null,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t || r != null || e.length === 0,
        onClick: o,
        className: "rounded-md border border-cyan-400/60 bg-cyan-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-cyan-500/30 disabled:opacity-50"
      }, t ? "Capturing frames…" : `Download ${e.length} Example${e.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function Jl({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = D(""), [a, s] = D(0), l = pe(null), d = De(() => ks(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Ns(d);
  fe(() => {
    var u;
    (u = l.current) == null || u.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const m = () => {
    const u = d[c];
    u && t(u.segment || u);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (u) => {
      u.target === u.currentTarget && r();
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (u) => {
      var b;
      if (u.key === "Tab")
        Nt(u);
      else if (u.key === "Escape")
        u.preventDefault(), u.stopPropagation(), r();
      else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
        u.preventDefault(), u.stopPropagation();
        const p = u.key === "ArrowDown" ? 1 : -1;
        s((h) => d.length ? (h + p + d.length) % d.length : 0);
      } else u.key === "Enter" && !((b = u.nativeEvent) != null && b.isComposing) && (u.preventDefault(), u.stopPropagation(), m());
    }
  }, [
    n("header", { key: "header", className: "border-b border-border p-4" }, [
      n(
        "h2",
        { key: "title", id: "segment-studio-quick-search-title", className: "text-base font-semibold text-foreground" },
        "Select a segment"
      ),
      n("input", {
        key: "input",
        type: "search",
        autoFocus: !0,
        value: o,
        onChange: (u) => {
          i(u.target.value), s(0);
        },
        placeholder: "Search segment tags…",
        "aria-label": "Search segment tags",
        "aria-controls": "segment-studio-quick-search-results",
        "aria-activedescendant": d[c] ? `segment-quick-search-${(d[c].segment || d[c]).id}` : void 0,
        className: "mt-3 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      })
    ]),
    n("div", {
      key: "results",
      id: "segment-studio-quick-search-results",
      role: "listbox",
      "aria-label": "Matching segments",
      className: "min-h-0 flex-1 overflow-y-auto p-2"
    }, d.length ? d.flatMap((u, b) => {
      var C;
      const p = u.segment || u, h = p.endSec == null ? Se(p.startSec) : `${Se(p.startSec)} – ${Se(p.endSec)}`, f = `${ft(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, S = b === c, y = b > 0 ? d[b - 1].groupKey : null, O = g && u.groupKey !== y ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, V = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: S ? l : null,
        type: "button",
        role: "option",
        "aria-selected": S,
        onMouseEnter: () => s(b),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${S ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${u.groupName} group`) : null,
        n(Bt, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (C = u.performers) != null && C.length ? n(Xn, {
          key: "performers",
          performers: u.performers,
          performerAssignments: u.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          h
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: f
        }, f)
      ]);
      return O ? [O, V] : [V];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function Yl(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    if (r.published || r.reviewState !== "approved") continue;
    const o = String(r.tagId ?? `name:${r.tagName || ""}`);
    t.has(o) || t.set(o, {
      key: o,
      tagName: r.tagName || "Tag segment",
      drafts: []
    }), t.get(o).drafts.push(r);
  }
  return [...t.values()].map((r) => ({
    ...r,
    drafts: r.drafts.sort((o, i) => o.startSec - i.startSec || String(o.id).localeCompare(String(i.id)))
  })).sort((r, o) => r.tagName.localeCompare(o.tagName) || r.key.localeCompare(o.key));
}
function Zl({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = De(() => Yl(e), [e]), [l, d] = D([]), c = s.reduce((u, b) => u + b.drafts.length, 0), g = (u) => d((b) => b.includes(u) ? b.filter((p) => p !== u) : [...b, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => ct(u, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n(
        "h2",
        { key: "title", id: "segment-studio-publish-approved-title", className: "text-lg font-semibold text-foreground" },
        "Publish approved drafts?"
      ),
      n(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        "These approved drafts will become native Cove segments. Expand a tag to inspect timing and provenance before publishing."
      )
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("dl", { key: "summary", className: "mb-4 grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 text-sm" }, [
        ["Approved drafts", c],
        ["Tags", s.length]
      ].flatMap(([u, b]) => [
        n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
        n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(b))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((u) => {
        const b = l.includes(u.key);
        return n("section", { key: u.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": b,
            "aria-controls": m(u),
            onClick: () => g(u.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Zn(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, b ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, u.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.drafts.length} draft${u.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          b ? n("div", {
            key: "drafts",
            id: m(u),
            className: "divide-y divide-border border-t border-border"
          }, u.drafts.map((p) => {
            const h = p.endSec == null ? Se(p.startSec) : `${Se(p.startSec)} – ${Se(p.endSec)}`, f = `${ft(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return n("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Bt, { key: "review", state: p.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, h),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: f
              }, f)
            ]);
          })) : null
        ]);
      })) : n(
        "p",
        { key: "empty", className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
        "No unpublished approved drafts are available."
      )
    ]),
    r ? n("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, r) : null,
    n("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "cancel",
        ref: o,
        type: "button",
        autoFocus: !0,
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function Ql({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Ss(e), [s, l] = D(() => /* @__PURE__ */ new Set()), [d, c] = D(() => new Set(a.map((h) => h.key))), g = a.flatMap((h) => d.has(h.key) ? h.candidates : []), m = (h) => l((f) => {
    const S = new Set(f);
    return S.has(h) ? S.delete(h) : S.add(h), S;
  }), u = (h) => c((f) => {
    const S = new Set(f);
    return S.has(h) ? S.delete(h) : S.add(h), S;
  }), b = (h) => h.assignment.map(({ slot: f, performer: S }) => `${f.label || `Slot ${f.sortOrder + 1}`}: ${S.name}`).join(", "), p = (h) => `segment-studio-auto-assign-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && i();
    },
    onKeyDownCapture: (h) => {
      h.key === "Enter" && h.target instanceof HTMLInputElement || ct(h, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "flex max-h-[80vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-auto-assign-title", className: "text-lg font-semibold text-foreground" }, "Auto-Assign Performers"),
      n(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        `${e.length} unfilled segment${e.length === 1 ? "" : "s"} ${e.length === 1 ? "has" : "have"} one valid complete assignment. Only these reviewed segments can change.`
      )
    ]),
    n(
      "div",
      { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" },
      e.length ? n("div", { className: "space-y-3" }, a.map((h) => n("section", { key: h.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: Zn(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(h.key),
            disabled: t,
            onChange: () => u(h.key),
            "aria-label": `Include ${h.tagName} assignment: ${b(h)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(h.key),
            "aria-controls": p(h),
            "aria-label": `${s.has(h.key) ? "Collapse" : "Expand"} ${h.tagName} assignment: ${b(h)}`,
            onClick: () => m(h.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(h.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            h.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            h.assignment.map(({ slot: f, performer: S }) => {
              const y = f.label || `Slot ${f.sortOrder + 1}`;
              return n("span", {
                key: f.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${y}: ${S.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${y}: ${S.name}`
                }, `${y}: ${S.name}`),
                n($n, {
                  key: "avatar",
                  performer: { id: S.performerId, name: S.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Tt, { key: "states", counts: h.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(h.candidates),
            "aria-label": `Auto-Assign ${h.tagName}: ${b(h)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${h.candidates.length})`)
        ]),
        s.has(h.key) ? n(
          "div",
          { key: "segments", id: p(h), className: "divide-y divide-border/70" },
          h.candidates.map((f) => {
            const S = f.endSec == null ? Se(f.startSec) : `${Se(f.startSec)} – ${Se(f.endSec)}`, y = `${ft(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", {
              key: f.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Bt, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                f.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                S
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: y
              }, y)
            ]);
          })
        ) : null
      ]))) : n(
        "p",
        { className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
        "No segments have completely unfilled performer slots."
      )
    ),
    r ? n("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, r) : null,
    n("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      n("button", { key: "cancel", type: "button", disabled: t, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        autoFocus: !0,
        disabled: t || g.length === 0,
        onClick: () => o(g),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${g.length} Segment${g.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function Xl({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = D(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : Se(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => ct(c, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "w-full max-w-lg rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n(
        "h2",
        { key: "title", id: "segment-studio-merge-title", className: "text-lg font-semibold text-foreground" },
        `Merge ${e.segments.length} selected segments?`
      ),
      n(
        "p",
        { key: "range", className: "mt-1 font-mono text-xs text-secondary" },
        `${Se(e.startSec)} – ${d}`
      )
    ]),
    n("div", { key: "body", className: "space-y-3 px-5 py-4 text-sm text-secondary" }, [
      n(
        "p",
        { key: "survivor" },
        r ? "The chronologically first segment is retained and replaces the other selected native ranges." : "The chronologically first segment is retained and the others are permanently removed."
      ),
      n(
        "p",
        { key: "provenance" },
        r ? "The merged result becomes manually sourced. You can undo the native merge from the editor toolbar." : "The merged result becomes manually sourced; model, confidence, and active provenance are removed. This cannot be undone."
      ),
      n("label", { key: "skip", className: "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-foreground" }, [
        n("input", {
          key: "input",
          type: "checkbox",
          checked: s,
          onChange: (c) => l(c.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n("span", { key: "label" }, "Do not ask again")
      ])
    ]),
    n("footer", { key: "footer", className: "flex justify-end gap-2 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "cancel",
        ref: o,
        type: "button",
        autoFocus: !0,
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t,
        onClick: () => i(s),
        className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25 disabled:opacity-50"
      }, t ? "Merging…" : "Merge segments")
    ])
  ]));
}
function ed(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = String(r.rootItemId || `${r.rootTagName}:${r.rootStartSec}`);
    t.has(o) || t.set(o, {
      key: o,
      rootTagName: r.rootTagName || r.sourceTagName,
      rootStartSec: r.rootStartSec,
      outputs: []
    }), t.get(o).outputs.push(r);
  }
  return [...t.values()];
}
function td({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = ed(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => ct(u, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-materialize-derived-title", className: "text-lg font-semibold text-foreground" }, "Auto-Materialize Derived Segments"),
      n(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        "Preview derivation rules before creating or linking any segments."
      )
    ]),
    n(
      "div",
      { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" },
      t ? n("p", { className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" }, "Analyzing derived segments…") : e ? n("div", { className: "space-y-4" }, [
        n("dl", { key: "summary", className: "grid grid-cols-2 gap-2 rounded-md border border-border bg-surface p-3 text-sm sm:grid-cols-5" }, [
          ["Source roots", e.sourceCount],
          ["Create", e.createCount],
          ["Link existing", e.linkCount],
          ["Already materialized", e.alreadyMaterializedCount],
          ["Conflicts skipped", e.conflictCount || 0]
        ].flatMap(([u, b]) => [
          n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
          n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(b))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        c.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...c.map((u) => n("article", {
            key: u.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${u.rootTagName} @ ${Se(u.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${u.outputs.length} ${u.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              u.outputs.map((b, p) => n("div", {
                key: `${b.ruleId}:${b.depth}:${p}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, b.depth - 1) * 1.25}rem` }
              }, [
                n("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                n(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${b.sourceTagName} → ${b.derivedTagName}`
                ),
                n("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${b.depth}`),
                n(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  b.action === "create" ? "Create" : "Link existing"
                )
              ]))
            )
          ])),
          (((m = e.outputs) == null ? void 0 : m.length) || 0) > d.length ? n(
            "p",
            { key: "more", className: "text-xs text-secondary" },
            `${e.outputs.length - d.length} additional output${e.outputs.length - d.length === 1 ? "" : "s"} omitted from this preview list.`
          ) : null
        ]) : n(
          "p",
          { key: "empty", className: "rounded-md border border-dashed border-border p-6 text-center text-sm text-secondary" },
          e.conflictCount > 0 ? "No safe materialization changes are available until the conflicting lineage is resolved." : "Every applicable derivation is already materialized."
        )
      ]) : null
    ),
    o ? n("p", { key: "error", role: "alert", className: "mx-5 mb-3 rounded-md border border-destructive/50 bg-destructive/10 px-3 py-2 text-sm text-destructive" }, o) : null,
    n("footer", { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-5 py-4" }, [
      n("button", { key: "cancel", ref: i, type: "button", autoFocus: !0, disabled: r, onClick: s, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        type: "button",
        disabled: t || r || l === 0,
        onClick: a,
        className: "rounded-md border border-indigo-400/60 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-indigo-500/30 disabled:opacity-50"
      }, r ? "Materializing…" : `Materialize ${l} change${l === 1 ? "" : "s"}`)
    ])
  ]));
}
function nd({
  compatibilityMode: e,
  selectedSegment: t,
  selectedSegments: r = [],
  selectedGroups: o = [],
  saveMessage: i,
  savingSegmentId: a,
  saveTag: s,
  saveTiming: l,
  slotStatus: d,
  performerSlotsAvailable: c,
  selectedPerformerSlots: g,
  performerSlots: m,
  detail: u,
  video: b,
  slotButtonRef: p,
  tagSearchRef: h,
  onSlotsChanged: f,
  onRecordHistory: S,
  splitSegment: y,
  duplicateSegment: O,
  provenance: V,
  lineage: C,
  onNavigateLineageItem: q,
  tagEditing: A,
  onCancelTagEditing: w,
  detailPanelRef: $,
  onReduceSelection: G
}) {
  var ke, J, K, Y;
  const Z = pe(null), P = pe(null), L = pe(null), T = pe(null), R = pe(null), [F, ae] = D(!1);
  fe(() => {
    Z.current && (Z.current.scrollTop = 0), ae(!1);
  }, [t == null ? void 0 : t.id]), fe(() => {
    var j, X;
    F && ((X = (j = P.current) == null ? void 0 : j.querySelector("input, select, button")) == null || X.focus({ preventScroll: !0 }));
  }, [F]);
  function ee() {
    ae(!1), requestAnimationFrame(() => {
      var j;
      return (j = p.current) == null ? void 0 : j.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const j = !r.some((de) => de.isDerived), X = e && c ? Ks(m, r) : null, re = (X == null ? void 0 : X.map((de, Te) => {
      var Ne;
      const le = r[Te];
      return {
        segmentId: le.nativeSegmentId,
        itemId: le.published ? null : le.itemId,
        revision: (Ne = u.performerSlotRevisions) == null ? void 0 : Ne[le.id],
        slots: de
      };
    })) || [];
    return n(Tr.Fragment, null, [
      n(Bl, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: $,
        onReduceSelection: G,
        reviewable: e,
        tagEditable: j,
        slotsEditable: re.length > 0,
        onEditSlots: () => ae(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      A && j ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (de) => {
          de.target === de.currentTarget && w();
        },
        onKeyDownCapture: (de) => ct(de, { onCancel: w })
      }, n("section", {
        ref: h,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "segment-studio-multi-tag-dialog-title",
        className: "w-full max-w-lg space-y-3 rounded-lg border border-border bg-card p-4 shadow-2xl"
      }, [
        n("header", { key: "header", className: "space-y-1" }, [
          n("h2", {
            key: "title",
            id: "segment-studio-multi-tag-dialog-title",
            className: "text-base font-semibold text-foreground"
          }, `Change tag for ${r.length} segments`),
          n(
            "p",
            { key: "description", className: "text-xs text-secondary" },
            "Choose one tag to apply across the complete selection."
          )
        ]),
        n(Nn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (de) => de == null ? w() : s(de),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: w,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      F && re.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (de) => {
          de.target === de.currentTarget && ee();
        },
        onKeyDownCapture: (de) => {
          var le, Ne;
          if (!(typeof ((le = de.target) == null ? void 0 : le.closest) == "function" ? de.target.closest("input, textarea, select, [contenteditable='true']") : null) && !de.repeat && !de.ctrlKey && !de.altKey && !de.metaKey && !de.shiftKey && /^[1-9]$/.test(de.key) && ((Ne = R.current) != null && Ne.call(R, Number(de.key) - 1))) {
            de.preventDefault(), de.stopPropagation();
            return;
          }
          ct(de, { onCancel: ee });
        }
      }, n("section", {
        ref: P,
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "segment-studio-multi-slot-dialog-title",
        tabIndex: -1,
        className: "flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
      }, [
        n("header", { key: "header", className: "flex items-start justify-between gap-4 border-b border-border px-4 py-3" }, [
          n("div", { key: "copy" }, [
            n("h2", { key: "title", id: "segment-studio-multi-slot-dialog-title", className: "text-base font-semibold text-foreground" }, "Performer slots"),
            n("p", { key: "description", className: "mt-0.5 text-xs text-secondary" }, "Assign the shared performer-slot shape across the selection.")
          ]),
          n("button", { key: "close", type: "button", onClick: ee, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Ol, {
          videoId: b.id,
          targets: re,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: R,
          onSaved: async ({ beforeState: de, afterState: Te }) => {
            await S(
              "performer-slots.assign",
              `Assigned performers to ${re.length} segments`,
              de,
              Te
            ), ee(), f();
          },
          onConflict: f
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (j) => {
      Z.current = j, $ && ($.current = j);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Bt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(er, { key: "derived" }) : null,
        t && A ? n("div", {
          key: "tag-editor",
          ref: h,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (j) => {
            j.key === "Escape" && (j.preventDefault(), j.stopPropagation(), w());
          },
          onKeyDown: (j) => {
            Bs(j, t.tagName) && (j.preventDefault(), j.stopPropagation(), s(t.tagId));
          }
        }, n(Nn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (j) => j == null ? w() : s(j),
          disabled: a != null || ((ke = C.data) == null ? void 0 : ke.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Se(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Se(t.endSec))
      ]) : null,
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(El, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Aa, {
        assignments: g.map((j) => {
          const X = Hs(j);
          return {
            key: String(j.slotDefinitionId),
            label: X.label,
            performer: X.filled ? { id: Number(j.performerId), name: X.performer } : null,
            title: X.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Fl, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: V
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        C.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : C.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, C.error) : C.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${C.data.derived ? "Derived segment" : "Root segment"} · ${C.data.componentSize} segment${C.data.componentSize === 1 ? "" : "s"} · ${C.data.integrityState}`
          ),
          (J = C.data.parents) != null && J.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...C.data.parents.map((j) => n("button", {
              key: j.nodeId,
              type: "button",
              onClick: () => q(j.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${j.ruleKey} ${j.ruleVersion}`))
          ]) : null,
          (K = C.data.children) != null && K.length ? n("p", { key: "children" }, `Children: ${C.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: !c || g.length === 0,
          onClick: () => ae(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: y,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => O(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => O(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    F && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (j) => {
        j.target === j.currentTarget && ee();
      },
      onKeyDownCapture: (j) => {
        var re, de;
        if (!(typeof ((re = j.target) == null ? void 0 : re.closest) == "function" ? j.target.closest("input, textarea, select, [contenteditable='true']") : null) && !j.repeat && !j.ctrlKey && !j.altKey && !j.metaKey && !j.shiftKey && /^[1-9]$/.test(j.key) && ((de = T.current) != null && de.call(T, Number(j.key) - 1))) {
          j.preventDefault(), j.stopPropagation();
          return;
        }
        ct(j, {
          onCancel: ee,
          onConfirm: () => {
            var Te;
            return (Te = L.current) == null ? void 0 : Te.click();
          }
        });
      }
    }, n("section", {
      ref: P,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "segment-studio-slot-dialog-title",
      "data-performer-slot-dialog": "true",
      className: "flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
    }, [
      n("header", { key: "header", className: "flex shrink-0 items-start justify-between gap-4 border-b border-border px-4 py-3" }, [
        n("div", { key: "copy" }, [
          n("h2", { key: "title", id: "segment-studio-slot-dialog-title", className: "text-base font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "description", className: "mt-0.5 text-xs text-secondary" }, "Candidates matching each slot's gender hints are ranked first.")
        ]),
        n("button", { key: "close", type: "button", onClick: ee, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Dl, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: b.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (Y = u.performerSlotRevisions) == null ? void 0 : Y[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: L,
        shortcutRef: T,
        onSaved: async (j, { beforeState: X, afterState: re }) => {
          await S(
            "performer-slots.assign",
            "Assigned performers",
            X,
            re
          ), ee(), f(j);
        },
        onConflict: f
      }))
    ])) : null
  ]);
}
function rd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: b, onSelect: p, onSelectSegments: h, onSelectAll: f, onConfigureTag: S, onSeekTime: y, centerRef: O, showReviewState: V = !0, swimlaneTitleWidth: C, onSwimlaneTitleWidthChange: q }) {
  const A = pe(null), w = pe(null), [$, G] = D(0), [Z, P] = D({ scrollTop: 0, height: 320 }), [L, T] = D(null), R = De(
    () => rn(e, r, o),
    [e, r, o]
  ), F = De(
    () => Ca(o),
    [o]
  ), ae = De(() => Pr(R), [R]), ee = De(
    () => Ys(ae, i, r.length > 0),
    [ae, i, r.length]
  ), ke = De(
    () => $a(ee.rows, Math.max(0, Z.scrollTop - 24), Z.height),
    [ee, Z]
  ), J = Math.max(0, Number(d) || 0), K = gl($), Y = Wn(C, K), j = Y / 16, X = ul(c, J, j), re = il(J), de = sl(J, Math.max(1, $ - j * 16), g), Te = re.filter((v, k) => k === 0 || k % de === 0), le = De(() => R.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: k, track: z }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${z}`).join(",")}`).join("|"), [R]);
  function Ne() {
    const v = w.current;
    if (!v) return;
    const k = v.querySelector("[data-timeline-track]"), z = v.firstElementChild, se = k == null ? void 0 : k.getBoundingClientRect(), ne = z == null ? void 0 : z.getBoundingClientRect(), ie = se && ne ? Math.max(0, se.left - ne.left) : j * 16, ve = (ne == null ? void 0 : ne.width) ?? v.scrollWidth;
    v.scrollTo({
      left: cl(c, J, ve, v.clientWidth, ie, na),
      behavior: "smooth"
    });
  }
  fe(() => (O.current = Ne, () => {
    O.current === Ne && (O.current = null);
  })), fe(() => {
    Ne();
  }, [g]);
  function oe() {
    const v = w.current, k = ee.rows.find((ve) => ve.kind === "lane" && ve.lane.markers.some(({ segment: W }) => W.id === s));
    if (!v || !k) return;
    const z = 24, se = k.top + z, ne = se + k.height;
    let ie = v.scrollTop;
    se < v.scrollTop + z ? ie = Math.max(0, se - z) : ne > v.scrollTop + v.clientHeight && (ie = Math.max(0, ne - v.clientHeight)), ie !== v.scrollTop && (v.scrollTop = ie), P({ scrollTop: ie, height: v.clientHeight });
  }
  fe(() => {
    oe();
  }, [s, le, ee]), fe(() => {
    const v = w.current, k = ee.rows.find((ve) => ve.kind === "group" && ve.group.key === a);
    if (!v || !k) return;
    const z = 24, se = k.top + z, ne = se + k.height;
    let ie = v.scrollTop;
    se < v.scrollTop + z ? ie = Math.max(0, se - z) : ne > v.scrollTop + v.clientHeight && (ie = Math.max(0, ne - v.clientHeight)), ie !== v.scrollTop && (v.scrollTop = ie), P({ scrollTop: ie, height: v.clientHeight });
  }, [a, ee]), fe(() => {
    const v = w.current;
    if (!v || typeof ResizeObserver > "u") return;
    const k = () => {
      G(v.clientWidth), P({ scrollTop: v.scrollTop, height: v.clientHeight }), oe();
    }, z = new ResizeObserver(k);
    return z.observe(v), k(), () => z.disconnect();
  }, [s, le, ee]);
  function x(v) {
    if (!(J > 0)) return;
    const k = v.currentTarget.getBoundingClientRect(), z = Math.min(1, Math.max(0, (v.clientX - k.left) / k.width));
    y(z * J);
  }
  function U(v) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let z = null;
    Object.hasOwn(k, v.key) && (z = c + k[v.key]), v.key === "Home" && (z = 0), v.key === "End" && (z = J), z != null && (v.preventDefault(), v.stopPropagation(), y(Math.min(J, Math.max(0, z))));
  }
  function I(v) {
    var z;
    const k = (z = A.current) == null ? void 0 : z.getBoundingClientRect();
    k && q(Wn(v.clientX - k.left, K));
  }
  function N(v) {
    const k = v.shiftKey ? 40 : 16;
    let z = null;
    v.key === "ArrowLeft" && (z = Y - k), v.key === "ArrowRight" && (z = Y + k), v.key === "Home" && (z = 160), v.key === "End" && (z = K), z != null && (v.preventDefault(), v.stopPropagation(), q(Wn(z, K)));
  }
  const M = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: A,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (v) => {
          (v.metaKey || v.ctrlKey) && (v.preventDefault(), f == null || f());
        },
        onKeyDown: (v) => {
          v.key !== "Enter" && v.key !== " " || (v.preventDefault(), f == null || f());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: M, disabled: g <= 1, onClick: () => m(Yn(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: M, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: M, disabled: g >= 8, onClick: () => m(Yn(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: M, onClick: Ne, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(K),
      "aria-valuenow": Math.round(Y),
      "aria-valuetext": `${Math.round(Y)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), I(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && I(v);
      },
      onKeyDown: N,
      onDoubleClick: () => q(rt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${Y - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: w,
      onScroll: (v) => P({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: ml(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${j}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": J,
          "aria-valuenow": Math.min(J, Math.max(0, c)),
          "aria-valuetext": Se(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: x,
          onKeyDown: U
        }, Te.map((v, k) => n("span", {
          key: v,
          className: `absolute top-0 ${ll(k, Te.length, J > 0 ? v / J * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: dl(k, Te.length, J > 0 ? v / J * 100 : 0)
        }, Se(v))).concat(t.map((v) => {
          const k = J > 0 ? v.startSec / J * 100 : 0;
          return n("button", {
            key: `shot-boundary:${v.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Se(v.startSec)} – ${Se(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Se(v.startSec)} – ${Se(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (z) => {
              z.stopPropagation(), y(v.startSec);
            }
          }, [
            n("span", {
              key: "line",
              "aria-hidden": "true",
              className: "block h-full w-full bg-orange-400 opacity-60 transition-opacity group-hover:opacity-100"
            }),
            n("span", {
              key: "indicator",
              "aria-hidden": "true",
              className: "absolute bottom-0 left-0 h-1 w-1 -translate-x-1/2 rounded-full bg-orange-400 opacity-80"
            })
          ]);
        }), n("span", {
          key: "playhead",
          "data-timeline-playhead": "axis",
          "aria-hidden": "true",
          className: "pointer-events-none absolute top-0 z-20",
          style: {
            ...Ao(X),
            width: "2px",
            height: "calc(100% + 2px)",
            backgroundColor: "var(--color-accent)"
          }
        })))
      ]),
      n("div", {
        key: "body",
        "data-timeline-body": "true",
        className: "relative",
        style: R.length > 0 ? { height: ee.height } : void 0
      }, [
        R.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Ao(X, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        R.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : ke.map((v) => {
          var te;
          const k = v.group, z = i.includes(k.key), se = a === k.key, ne = Zn(se);
          if (v.kind === "group") return n("div", {
            key: v.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": z ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${j}rem minmax(0,1fr)`,
              backgroundColor: ne,
              top: v.top,
              height: v.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (E) => {
                if (E.metaKey || E.ctrlKey) {
                  h(k.lanes.flatMap((_) => _.markers.map((be) => be.segment.id)));
                  return;
                }
                u(k.key), b(k.key);
              },
              "aria-expanded": !z,
              "aria-current": se ? "true" : void 0,
              "data-selected-timeline-group": se ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: ne
              },
              title: `${z ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, z ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              z ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                V ? n(Tt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const ie = v.lane, ve = Ds(v.laneIndex), W = ie.markers.some(({ segment: E }) => E.id === s);
          return n("div", {
            key: v.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${j}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: ve
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": W ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Os(W, ve),
              title: `${Cn(ie)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Cn(ie),
              onClick: (E) => {
                (E.metaKey || E.ctrlKey) && h(ie.markers.map((_) => _.segment.id));
              },
              onMouseEnter: () => T(ie.key),
              onMouseLeave: () => T((E) => E === ie.key ? null : E)
            }, [
              ie.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (E) => {
                  E.stopPropagation(), S({ tagId: ie.tagId, tagName: ie.label, trigger: E.currentTarget });
                },
                "aria-label": `Configure ${ie.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: L === ie.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, ie.label),
              (te = ie.performers) != null && te.length ? n(Xn, {
                key: "performers",
                performers: ie.performers,
                performerAssignments: ie.performerAssignments
              }) : null,
              V ? n(Tt, { key: "counts", counts: ie.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, ie.markers.map(({ segment: E, track: _ }) => {
              var Ce;
              const be = Ir(E.startSec, J), me = E.endSec == null ? E.startSec : Math.max(E.startSec, E.endSec), ge = Math.max(0, Ir(me, J) - be), ye = l.includes(E.id), we = E.id === s, Le = Or(F.get(E.id)), Fe = E.endSec == null ? Se(E.startSec) : `${Se(E.startSec)} – ${Se(E.endSec)}`, xe = (Ce = wa[Le]) == null ? void 0 : Ce.label;
              return n("button", {
                key: E.id,
                type: "button",
                onClick: (Oe) => {
                  Oe.stopPropagation(), p(E, {
                    additive: Oe.metaKey || Oe.ctrlKey,
                    rangeSegmentIds: Oe.shiftKey ? ie.markers.map((Ve) => Ve.segment.id) : null
                  });
                },
                "aria-pressed": ye,
                "aria-current": we ? "true" : void 0,
                "data-selected-timeline-marker": we ? "true" : void 0,
                "data-selected-segment-shortcut-target": we ? "true" : void 0,
                "aria-label": V ? `${E.tagName || "Tag segment"}${ie.performerLabel ? `, ${ie.performerLabel}` : ""}, ${E.reviewState}${xe ? `, ${xe}` : ""}, ${Fe}` : `${E.tagName || "Tag segment"}${ie.performerLabel ? `, ${ie.performerLabel}` : ""}, ${Fe}`,
                title: V ? `${E.tagName || "Tag segment"}${ie.performerLabel ? ` · ${ie.performerLabel}` : ""} · ${E.reviewState}${xe ? ` · ${xe}` : ""} · ${Fe}` : `${E.tagName || "Tag segment"}${ie.performerLabel ? ` · ${ie.performerLabel}` : ""} · ${Fe}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...V ? Ms(E.reviewState, ye, Le, we) : Rs(ye, we),
                  left: `${be}%`,
                  top: `${Ps(_)}rem`,
                  width: Es(E.endSec, ge),
                  height: "1rem"
                }
              });
            }))
          ]);
        })
      ])
    ]))
  ]);
}
function Gr({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = D(null), [l, d] = D([]), [c, g] = D(null), [m, u] = D(""), [b, p] = D(!0), [h, f] = D(null), [S, y] = D(""), [O, V] = D(!1), C = pe(null), q = pe(0);
  fe(() => {
    const L = requestAnimationFrame(() => {
      var T;
      return (T = C.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [e]), fe(() => {
    const L = new AbortController();
    return p(!0), y(""), Promise.all([
      r ? Q(`/slot-definitions/${e}`, { signal: L.signal }) : Promise.resolve(null),
      Q("/segment-groups", { signal: L.signal })
    ]).then(([T, R]) => {
      const F = R.find((ae) => (ae.tags || []).some((ee) => Number(ee.tagId) === Number(e)));
      s(T), d(R), g((F == null ? void 0 : F.id) ?? null), u(F == null ? "" : String(F.id)), V(!1);
    }).catch((T) => {
      T.name !== "AbortError" && y(T.message || "Unable to load tag configuration.");
    }).finally(() => {
      L.signal.aborted || p(!1);
    }), () => L.abort();
  }, [r, e]);
  function A(L, T) {
    s({
      ...a,
      definitions: a.definitions.map((R, F) => F === L ? { ...R, ...T } : R)
    });
  }
  function w(L, T) {
    const R = L + T;
    if (R < 0 || R >= a.definitions.length) return;
    const F = [...a.definitions];
    [F[L], F[R]] = [F[R], F[L]], s({
      ...a,
      definitions: F.map((ae, ee) => ({ ...ae, sortOrder: ee }))
    });
  }
  function $(L) {
    const T = a.definitions[L], R = Number(T.assignmentCount) || 0, F = R === 0 ? "" : ` and its ${R} assignment${R === 1 ? "" : "s"}`;
    window.confirm(`Delete “${et(T)}”${F}?`) && (R > 0 && V(!0), s({
      ...a,
      definitions: a.definitions.filter((ae, ee) => ee !== L).map((ae, ee) => ({ ...ae, sortOrder: ee }))
    }));
  }
  async function G() {
    var T;
    f("slots"), y("Saving performer slots…");
    let L;
    try {
      L = await Q(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: O,
          definitions: a.definitions.map((R, F) => {
            var ae;
            return {
              id: R.id || void 0,
              label: ((ae = R.label) == null ? void 0 : ae.trim()) || null,
              sortOrder: F,
              genderHints: R.genderHints || []
            };
          })
        })
      }), s(L), V(!1);
    } catch (R) {
      R.status === 409 ? (y("Performer slots changed elsewhere; current values were reloaded."), (T = R.payload) != null && T.current && (s(R.payload.current), V(!1))) : y(R.message || "Unable to save performer slots."), f(null);
      return;
    }
    try {
      await o(), y("Performer slots saved.");
    } catch {
      y("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      f(null);
    }
  }
  async function Z() {
    const L = m === "" ? null : Number(m);
    if (L !== c) {
      f("group"), y("Saving tag group…");
      try {
        await Q(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: L })
        });
      } catch (T) {
        y(T.message || "Unable to assign the tag group."), f(null);
        return;
      }
      try {
        const [T, R] = await Promise.allSettled([
          Q("/segment-groups"),
          o()
        ]);
        if (T.status === "fulfilled") {
          d(T.value);
          const F = T.value.find((ee) => (ee.tags || []).some((ke) => Number(ke.tagId) === Number(e))), ae = (F == null ? void 0 : F.id) ?? null;
          g(ae), u(ae == null ? "" : String(ae));
        }
        y(
          T.status === "fulfilled" && R.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        f(null);
      }
    }
  }
  l.find((L) => Number(L.id) === Number(c));
  const P = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (L) => {
      L.target === L.currentTarget && !h && i();
    },
    onKeyDownCapture: (L) => ct(L, {
      onCancel: h ? void 0 : i
    })
  }, n("section", {
    ref: C,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Nt,
    className: "flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", {
        key: "title",
        id: "segment-studio-inline-tag-configuration-title",
        className: "text-lg font-semibold text-foreground"
      }, `Configure Tag: ${t}`),
      n(
        "p",
        { key: "description", className: "mt-1 text-sm text-secondary" },
        r ? "Assign this tag to a Cove tag group and configure its performer roles." : "Assign this tag to a Cove tag group."
      )
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 space-y-5 overflow-y-auto p-5" }, [
      n("section", { key: "group", className: "space-y-3", "aria-labelledby": "inline-tag-segment-group-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-segment-group-heading", className: "text-sm font-semibold text-foreground" }, "Cove tag group"),
          n(
            "p",
            { key: "copy", className: "text-xs text-secondary" },
            "Choose where this tag appears in the swimlane hierarchy."
          )
        ]),
        b ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: m,
            disabled: h != null,
            onChange: (L) => u(L.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((L) => n("option", { key: L.id, value: String(L.id) }, L.name))
          ])
        ]),
        b ? null : n("button", {
          key: "save",
          type: "button",
          disabled: h != null || (m === "" ? null : Number(m)) === c,
          onClick: Z,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, h === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        b ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: h != null,
              onChange: (L) => s({ ...a, allowSamePerformerInMultipleSlots: L.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((L, T) => n("article", {
            key: L.id || L._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: L.label || "",
                disabled: h != null,
                onChange: (R) => A(T, { label: R.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ai.map((R) => n("label", { key: R, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: h != null,
                  checked: (L.genderHints || []).includes(R),
                  onChange: (F) => A(T, {
                    genderHints: F.target.checked ? [.../* @__PURE__ */ new Set([...L.genderHints || [], R])] : (L.genderHints || []).filter((ae) => ae !== R)
                  })
                }),
                n("span", { key: "text" }, Qn(R))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${L.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: h != null || T === 0, onClick: () => w(T, -1), className: P, "aria-label": `Move ${et(L)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: h != null || T === a.definitions.length - 1, onClick: () => w(T, 1), className: P, "aria-label": `Move ${et(L)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: h != null, onClick: () => $(T), className: `${P} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: h != null,
              onClick: () => s({
                ...a,
                definitions: [...a.definitions, {
                  _clientKey: `new-${++q.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: P
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: h != null,
              onClick: G,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, h === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      S ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, S) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: h != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function od(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, captureTrainingExport: u, centerTimelineRef: b, closeEditorFilters: p, closeFirstSegmentTagDialog: h, closeMaterializeDialog: f, closeMergeConfirmation: S, closePublishApprovedDialog: y, closeTagEditing: O, collapsedSegmentGroups: V, compatibilityMode: C, configuringTag: q, createSegment: A, currentTime: w, detail: $, detailPanelRef: G, detailWidth: Z, duplicateSegment: P, editorFilters: L, editorLayout: T, editorRef: R, exportingExamples: F, filtersButtonRef: ae, filtersOpen: ee, firstSegmentTagOpen: ke, focusRowRef: J, handleSeparatorKeyDown: K, handleSeparatorPointerDown: Y, handleSeparatorPointerMove: j, hideDerivedSegments: X, history: re, historyOpen: de, historySaving: Te, horizontalLayoutSize: le, importNativeSegments: Ne, incorrectExamples: oe, incorrectExamplesOpen: x, lineage: U, markerRailWidth: I, materializeButtonRef: N, materializeCancelButtonRef: M, materializeDerivedSegments: v, materializeError: k, materializeLoading: z, materializeOpen: se, materializePreview: ne, materializing: ie, mediaStackRef: ve, mergeCancelButtonRef: W, mergeConfirmation: te, mergeSavingRef: E, mergeSelectedSwimlane: _, nativeImportState: be, onNavigate: me, onReload: ge, onSlotsChanged: ye, openPublishApprovedDialog: we, panelSeparatorProps: Le, pendingInitialSeekRef: Fe, performerSlots: xe, performerSlotsAvailable: Ce, playbackControlsRef: Oe, previewDerivedSegments: Ve, provenance: ot, provenanceSources: he, publishApprovedCancelButtonRef: Ee, publishApprovedDrafts: He, publishApprovedError: Je, publishApprovedOpen: Ie, quickSearchOpen: $e, railScrollRef: Be, railToggleRef: tt, recordHistoryAction: Ye, removeIncorrectExample: qe, removingExampleId: vt, restoreHistoryTarget: It, saveMessage: Mn, saveTag: tr, saveTiming: Mt, savingSegmentId: xt, seekRef: Rt, segmentGroups: Et, segmentRailLayout: on, segments: ut, selectAllVideoSegments: nr, selectSegment: Gt, selectSegmentCollection: jt, selectedGroups: rr, selectedPerformerSlots: an, selectedSegment: mt, selectedSegmentGroupKey: sn, selectedSegmentIds: Rn, selectedSegments: ln, selectedSlotStatus: En, setAutoAssignError: dn, setAutoAssignOpen: Ct, setConfiguringTag: Kt, setCurrentTime: Dn, setEditorFilters: or, setEditorLayout: On, setFiltersOpen: ar, setHideDerivedSegments: cn, setHistoryOpen: Ut, setIncorrectExamplesOpen: un, setQuickSearchOpen: Dt, setRailViewport: ir, setSelectedSegmentGroupKey: mn, setSelectedSegmentId: gn, setShortcutsOpen: zt, setTimelineZoom: pn, shotBoundaries: at, shortcutsOpen: Pn, slotButtonRef: fn, splitLayout: yt, splitSegment: Ln, startFullAnalysis: _t, tagEditing: yn, tagSearchRef: sr, timelineDuration: lr, timelineRatioBounds: Ht, timelineZoom: bn, toggleSegmentGroup: qt, toggleSegmentRail: Ge, updateTimelineRatio: Ue, video: We, videoPerformers: Fn, visibleCounts: bt, visibleSegmentRailRows: gt, visibleSegments: Bn, wideLayout: St, workspaceRef: hn } = e, Wt = De(
    () => ut.filter((H) => !H.published && H.reviewState === "approved"),
    [ut]
  ), Gn = Ci(Ar), vn = Wt.length, Vt = ne ? ne.createCount + ne.linkCount : null;
  function dr(H) {
    const Pe = Rn.includes(H.id), it = H.id === (mt == null ? void 0 : mt.id), st = H.endSec == null ? Se(H.startSec) : `${Se(H.startSec)} – ${Se(H.endSec)}`, Yt = `${ft(H.sourceKey)}${H.confidence != null ? ` · ${Math.round(H.confidence * 100)}%` : ""}`;
    return n("button", {
      key: H.id,
      type: "button",
      onClick: (_e) => Gt(H, { additive: _e.metaKey || _e.ctrlKey }),
      "aria-pressed": Pe,
      "aria-current": it ? "true" : void 0,
      "data-selected-segment-shortcut-target": it ? "true" : void 0,
      "aria-label": C ? `${H.tagName || "Tag segment"}, ${H.reviewState}${H.isDerived ? ", derived segment" : ""}, ${st}` : `${H.tagName || "Tag segment"}${H.isDerived ? ", derived segment" : ""}, ${st}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: ka(Pe, it)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        C ? n(Bt, { key: "review", state: H.reviewState, includeLabel: !1 }) : null,
        H.isDerived ? n(er, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          H.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, st),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Yt
        }, Yt)
      ])
    ]);
  }
  const Jt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Ze = [...re.actions || []].reverse().find((H) => H.sequence <= re.cursorSequence);
  return n("section", {
    ref: R,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${yt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (H) => Da(H, me, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${We.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: We.title || `Video ${We.id}`
          }, We.title || `Video ${We.id}`)),
          ...Fn.map((H) => n($n, {
            key: Ke(H),
            performer: { id: Ke(H), name: H.name },
            compact: !0,
            tooltip: H.name
          })),
          C ? n(Tt, { key: "review-counts", counts: bt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          C ? null : n(Pa, { key: "bin", onNavigate: me, compact: !0 }),
          n(La, { key: "settings", onNavigate: me, compact: !0 })
        ])
      ]),
      C && $.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${$.nativeImportCount} Cove segment${$.nativeImportCount === 1 ? "" : "s"} ${$.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        be.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, be.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => Ne("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => Ne("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        be.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, be.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          C ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => _t(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (H) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && H.preventDefault();
                },
                onKeyDown: (H) => {
                  (H.key === "Enter" || H.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && H.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n($i, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([H, Pe]) => n("button", {
                key: H,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (it) => {
                  var st;
                  (st = it.currentTarget.closest("details")) == null || st.removeAttribute("open"), _t(Pe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, H)))
            ])
          ]) : null,
          C ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: xt != null || l.length === 0,
            onClick: () => {
              dn(""), Ct(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          C ? n("button", {
            key: "materialize-derived",
            ref: N,
            type: "button",
            disabled: xt != null || z || ie || Vt === 0,
            onClick: Ve,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, z ? "Analyzing…" : `Auto-Materialize${Vt != null ? ` (${Vt})` : ""}`) : null,
          C ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: xt != null || vn === 0,
            onClick: (H) => we(H.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Ie,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${vn ? ` (${vn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: F || vt != null || oe.length === 0,
            onClick: () => un(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": x,
            "aria-label": `Open AI feedback collection, ${oe.length} example${oe.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${oe.length ? ` (${oe.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ae,
            type: "button",
            onClick: () => ar(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ee,
            className: `${Jt} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(_n, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => zt(!0),
            className: Jt
          }, [n(_n, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (C ? re.actions.length === 0 : Ze == null) || xt != null || Te,
            onClick: C ? () => Ut((H) => !H) : () => It(
              Ze.sequence - 1
            ),
            "aria-haspopup": C ? "dialog" : void 0,
            "aria-expanded": C ? de : void 0,
            className: Jt
          }, [
            n(_n, { key: "icon", name: "history" }),
            n("span", { key: "label" }, C ? `History${re.actions.length ? ` (${re.actions.length})` : ""}` : Ze ? `Undo ${Ze.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: tt,
            type: "button",
            onClick: Ge,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": T.markerRailOpen,
            className: Jt
          }, [
            n(_n, { key: "icon", name: "list" }),
            n("span", { key: "label" }, T.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    C && de ? n("section", {
      key: "history-panel",
      role: "dialog",
      "aria-label": "Editor history",
      className: "z-20 w-full max-w-md self-end rounded-md border border-border bg-surface p-2 shadow-lg"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-3 px-2 py-1" }, [
        n("h2", { key: "title", className: "text-sm font-semibold text-foreground" }, "Editor history"),
        n("button", {
          key: "close",
          type: "button",
          onClick: () => Ut(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...re.actions].reverse().map((H) => n("button", {
          key: H.sequence,
          type: "button",
          disabled: Te,
          onClick: () => It(H.sequence),
          "aria-current": re.cursorSequence === H.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${H.sequence > re.cursorSequence ? "text-secondary" : "text-foreground"} ${re.cursorSequence === H.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, H.label),
          n("time", {
            key: "time",
            dateTime: H.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(H.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: Te,
          onClick: () => It(re.baselineSequence),
          "aria-current": re.cursorSequence === re.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${re.cursorSequence === re.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    ee ? n(ql, {
      key: "editor-filters",
      filters: L,
      hideDerivedSegments: X,
      performers: Fn,
      provenanceSources: he,
      reviewCounts: s,
      segments: ut,
      segmentGroups: Et,
      reviewMode: C,
      onChange: or,
      onHideDerivedChange: cn,
      onClose: p
    }) : null,
    ke ? n(Hl, {
      key: "first-segment-tag-dialog",
      saving: xt != null,
      error: Mn,
      onSelect: (H) => A(H),
      onClose: h
    }) : null,
    $e ? n(Jl, {
      key: "quick-search-dialog",
      segments: ws(r),
      onSelect: (H) => {
        Dt(!1), Gt(H, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Dt(!1), requestAnimationFrame(() => {
          var H;
          return (H = R.current) == null ? void 0 : H.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(Ql, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Ct(!1)
    }) : null,
    te ? n(Xl, {
      key: "merge-selection-dialog",
      merge: te,
      processing: E.current,
      undoable: !C,
      cancelButtonRef: W,
      onConfirm: (H) => _(!0, H, te),
      onClose: S
    }) : null,
    se ? n(td, {
      key: "materialize-derived-dialog",
      preview: ne,
      loading: z,
      processing: ie,
      error: k,
      cancelButtonRef: M,
      onConfirm: v,
      onClose: () => {
        ie || f();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: hn,
      className: `${yt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      T.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: St ? { position: "absolute", top: 0, right: 0, width: I, height: le.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ut.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Bn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Be,
          onScroll: (H) => ir({
            scrollTop: H.currentTarget.scrollTop,
            height: H.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: on.height }
        }, gt.map((H) => {
          var it;
          let Pe;
          if (H.kind === "group") {
            const st = V.includes(H.group.key), Yt = H.group.lanes.reduce((_e, ue) => _e + ue.markers.length, 0);
            Pe = n("button", {
              type: "button",
              onClick: () => {
                mn(H.group.key), qt(H.group.key);
              },
              "aria-expanded": !st,
              "aria-current": sn === H.group.key ? "true" : void 0,
              "data-segment-rail-group": H.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${sn === H.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, st ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: H.group.name }, H.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Yt),
              C && st ? n(Tt, { key: "states", counts: H.group.counts }) : null
            ]);
          } else H.kind === "lane" ? Pe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Cn(H.lane),
            "aria-label": Cn(H.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, H.lane.label),
            (it = H.lane.performers) != null && it.length ? n(Xn, {
              key: "performers",
              performers: H.lane.performers,
              performerAssignments: H.lane.performerAssignments
            }) : null,
            C ? n(Tt, { key: "states", counts: H.lane.counts }) : null
          ]) : Pe = dr(H.segment);
          return n("div", {
            key: H.key,
            className: "absolute left-0 right-0",
            style: { top: H.top, height: H.height }
          }, Pe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${yt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: ve,
          className: `${yt ? "min-h-0 flex-1" : ""} grid`,
          style: yt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - T.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${T.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: J,
            className: "grid min-h-0 gap-2",
            style: St ? {
              gridTemplateColumns: T.markerRailOpen ? `${Z}px 0.5rem minmax(0,1fr) 0.5rem ${I}px` : `${Z}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(nd, {
              key: "tools",
              compatibilityMode: C,
              selectedSegment: mt,
              selectedSegments: ln,
              selectedGroups: rr,
              saveMessage: Mn,
              savingSegmentId: xt,
              saveTag: tr,
              slotStatus: En,
              performerSlotsAvailable: Ce,
              selectedPerformerSlots: an,
              performerSlots: xe,
              detail: $,
              video: We,
              slotButtonRef: fn,
              tagSearchRef: sr,
              tagEditing: yn,
              onCancelTagEditing: O,
              detailPanelRef: G,
              onReduceSelection: (H) => {
                Gt(H), requestAnimationFrame(() => {
                  var Pe;
                  return (Pe = G.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Mt,
              onSlotsChanged: ye,
              onRecordHistory: Ye,
              splitSegment: Ln,
              duplicateSegment: P,
              provenance: ot,
              lineage: U,
              onNavigateLineageItem: (H) => {
                const Pe = ut.find((it) => it.itemId === H);
                Pe && gn(Pe.id);
              }
            }),
            St ? n(
              "div",
              { key: "detail-separator", ...Le("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            We.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ho, {
                streamUrl: `/api/stream/video/${We.id}`,
                posterUrl: `/api/stream/video/${We.id}/screenshot?v=${encodeURIComponent(We.updatedAt || "")}`,
                format: We.videoFile.format,
                audioCodec: We.videoFile.audioCodec,
                duration: We.videoFile.duration,
                videoId: We.id,
                trackingEnabled: !1,
                onSeekRegister: (H) => {
                  Rt.current = H, vs(Fe.current, ut, H) && (Fe.current = null);
                },
                onPlaybackControlRegister: (H) => {
                  Oe.current = H;
                },
                onTimeUpdate: Dn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            St && T.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Le("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            St && T.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          yt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(Ht.minimum * 100),
            "aria-valuemax": Math.round(Ht.maximum * 100),
            "aria-valuenow": Math.round(T.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(T.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: Y,
            onPointerMove: j,
            onKeyDown: K,
            onDoubleClick: () => Ue(rt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: yt ? void 0 : { height: "20rem" } }, n(rd, {
            segments: Bn,
            shotBoundaries: at,
            segmentGroups: Et,
            performerSlots: xe,
            collapsedGroupKeys: V,
            selectedGroupKey: sn,
            selectedSegmentId: mt == null ? void 0 : mt.id,
            selectedSegmentIds: Rn,
            duration: lr,
            currentTime: w,
            zoom: bn,
            onZoomChange: pn,
            onSelectGroup: mn,
            onToggleGroup: qt,
            onSelect: (H, Pe) => Gt(H, Pe),
            onSelectSegments: jt,
            onSelectAll: nr,
            onConfigureTag: (H) => Kt(H),
            onSeekTime: (H) => {
              var Pe;
              return (Pe = Rt.current) == null ? void 0 : Pe.call(Rt, H, !1);
            },
            centerRef: b,
            showReviewState: C,
            swimlaneTitleWidth: T.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (H) => On((Pe) => ({ ...Pe, swimlaneTitleWidth: H }))
          }))
        ])
      ])
    ]),
    q ? n(Gr, {
      key: `configure-tag:${q.tagId}`,
      tagId: q.tagId,
      tagName: q.tagName,
      performerSlotsEnabled: C,
      onSaved: ge,
      onClose: () => {
        const H = q.trigger;
        Kt(null), requestAnimationFrame(() => {
          var Pe;
          H != null && H.isConnected ? H.focus({ preventScroll: !0 }) : (Pe = R.current) == null || Pe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ie ? n(Zl, {
      key: "publish-approved-dialog",
      drafts: Wt,
      processing: xt === -1,
      error: Je,
      cancelButtonRef: Ee,
      onConfirm: He,
      onClose: y
    }) : null,
    Pn ? n(Wl, {
      key: "shortcuts-dialog",
      reviewMode: C,
      bindings: Gn,
      onClose: () => zt(!1)
    }) : null,
    x ? n(Vl, {
      key: "incorrect-examples-dialog",
      examples: oe,
      exporting: F,
      removingExampleId: vt,
      onExport: u,
      onRemove: qe,
      onClose: () => un(!1)
    }) : null
  ]);
}
function ad(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: b, setSaveMessage: p, setSelectedSegmentGroupKey: h, setSelectedSegmentId: f, setSelectedSegmentIds: S } = e;
  function y(A) {
    const w = ht(t, A);
    w && m(($) => Ma($, w));
  }
  function O(A) {
    f(A), S(A == null ? [] : [A]), c.current = A, g.current = [];
  }
  function V(A, {
    focusEditor: w = !1,
    seekToSegment: $ = !1,
    additive: G = !1,
    rangeSegmentIds: Z = null
  } = {}) {
    var L, T;
    const P = Ui({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, A.id, Z, G);
    S(P.selectedSegmentIds), f(P.activeSegmentId), c.current = P.anchorSegmentId, g.current = P.rangeBaseSegmentIds, P.activeSegmentId != null && h(ht(t, P.activeSegmentId)), y(A.id), w && ((L = r.current) == null || L.focus({ preventScroll: !0 })), $ && ((T = i.current) == null || T.call(i, A.startSec, !1));
  }
  function C(A) {
    const w = ji(
      d,
      l,
      A
    );
    S(w.selectedSegmentIds), f(w.activeSegmentId), c.current = w.activeSegmentId, g.current = [], w.activeSegmentId != null && (h(ht(t, w.activeSegmentId)), y(w.activeSegmentId));
  }
  function q() {
    var $;
    const A = _i(s), w = A.includes(l) ? l : A[0] ?? null;
    u(dt({})), b(!1), S(A), f(w), c.current = w, g.current = [], w != null && h(ht(
      rn(s, a, o),
      w
    )), p(A.length === 0 ? "There are no segments to select." : `${A.length} segments selected. Collapsed Segment groups keep their selected segments.`), ($ = r.current) == null || $.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: y, replaceSegmentSelection: O, selectSegment: V, selectSegmentCollection: C, selectAllVideoSegments: q };
}
function id(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, recordHistoryAction: g, revealSegmentGroupForSelection: m, reviewSavingRef: u, savingSegmentId: b, selectedGroups: p, selectedSegment: h, selectedSegmentIdRef: f, selectedSegments: S, selectionAnchorIdRef: y, selectionRangeBaseIdsRef: O, setMergeConfirmation: V, setSaveMessage: C, setSavingSegmentId: q, setSelectedSegmentId: A, setSelectedSegmentIds: w, video: $ } = e;
  function G() {
    V(null), requestAnimationFrame(() => {
      var L;
      return (L = i.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    });
  }
  async function Z(L = !1, T = !1, R = null) {
    if (s.current || b != null) return;
    const F = R || Ta(
      p,
      { nativeOnly: !r }
    );
    if (!F) {
      C("Select at least two segments from one swimlane.");
      return;
    }
    if (!L && ra()) {
      V(F);
      return;
    }
    T && oa(!1), G();
    const ae = F.endSec == null ? "open end" : Se(F.endSec);
    s.current = !0;
    let ee = F.segments[0];
    const ke = r ? null : lt(F.segments, !1), J = r ? null : crypto.randomUUID();
    q(ee.id);
    try {
      const K = F.segments.slice(1);
      if (!r || ee.nativeSegmentId != null) {
        const Y = K.map((X) => {
          const re = `merge-native-selection:${$.id}:${ee.id}:${X.id}:${ee.updatedAt}:${X.updatedAt}`;
          return { key: re, operationId: Ae(re), segmentId: X.id, expectedUpdatedAt: X.updatedAt };
        }), j = await Q(`/videos/${$.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ee.id,
            expectedSurvivorUpdatedAt: ee.updatedAt,
            consumedSegments: Y.map(({ key: X, ...re }) => re),
            historyReceiptId: J
          })
        });
        ee = j.survivor, d(Io(o, j), $.id), Y.forEach(({ key: X }) => Me(X));
      } else {
        const Y = K.map((X) => {
          const re = `merge-draft-selection:${$.id}:${ee.itemId}:${X.itemId}:${ee.revision}:${X.revision}`;
          return { key: re, operationId: Ae(re), itemId: X.itemId, expectedRevision: X.revision };
        }), j = await Q(`/videos/${$.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ee.itemId,
            expectedSurvivorRevision: ee.revision,
            consumedDrafts: Y.map(({ key: X, ...re }) => re)
          })
        });
        ee = j.survivor, d(Io(o, j), $.id), Y.forEach(({ key: X }) => Me(X));
      }
      w([ee.id]), A(ee.id), y.current = ee.id, O.current = [], r ? t(kt) : await g(
        "segments.merge",
        `Merged ${F.segments.length} segments`,
        ke,
        lt([ee], !1),
        J
      ), m(ee.id), C(`${F.segments.length} segments merged into ${Se(F.startSec)} – ${ae}.`);
    } catch (K) {
      K.status === 409 ? await l() : C(K.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, q(null);
    }
  }
  async function P(L) {
    var ke;
    if (S.length === 0 || u.current || b != null) return;
    const T = rs(S, L), R = S.filter((J) => J.reviewState !== T);
    if (R.length === 0) return;
    const F = S.map((J) => ({
      id: J.id,
      itemId: J.itemId,
      nativeSegmentId: J.nativeSegmentId
    })), ae = F.find((J) => J.id === (h == null ? void 0 : h.id)) || F[0], ee = (J) => {
      if (!(J != null && J.segments) || !Sr(f.current, ae.id))
        return;
      const K = F.map((j) => ze(J == null ? void 0 : J.segments, j)).filter(Boolean), Y = ze(J == null ? void 0 : J.segments, ae) || K[0] || null;
      w(K.map((j) => j.id)), A((Y == null ? void 0 : Y.id) ?? null), y.current = (Y == null ? void 0 : Y.id) ?? null, O.current = [];
    };
    u.current = !0, q((h == null ? void 0 : h.id) ?? R[0].id), C(`Updating ${R.length} selected segment${R.length === 1 ? "" : "s"}…`);
    try {
      const J = await Q(`/videos/${$.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: T,
          segments: S.map((X) => X.published ? {
            nativeSegmentId: X.nativeSegmentId,
            expectedUpdatedAt: X.updatedAt
          } : {
            itemId: X.itemId,
            expectedRevision: X.revision
          })
        })
      }), K = new Map((J.items || []).map((X) => [
        X.requestedNativeSegmentId != null ? `native:${X.requestedNativeSegmentId}` : `item:${X.requestedItemId}`,
        X
      ]));
      if (F.forEach((X) => {
        const re = K.get(X.nativeSegmentId != null ? `native:${X.nativeSegmentId}` : `item:${X.itemId}`);
        re && (X.nativeSegmentId = re.nativeSegmentId, X.itemId = re.itemId);
      }), J.history && t(J.history), T === "rejected" || (J.items || []).some((X) => X.requestedNativeSegmentId != null && X.nativeSegmentId !== X.requestedNativeSegmentId)) {
        ee(await c()), C(`${J.updatedCount} selected segment${J.updatedCount === 1 ? "" : "s"} ${T === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const j = {
        ...o,
        approvedSetVersion: J.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((X) => {
          const re = K.get(X.nativeSegmentId != null ? `native:${X.nativeSegmentId}` : `item:${X.itemId}`);
          return re ? {
            ...X,
            id: re.nativeSegmentId != null ? re.nativeSegmentId : -re.itemId,
            itemId: re.itemId,
            nativeSegmentId: re.nativeSegmentId,
            published: re.nativeSegmentId != null,
            reviewState: T,
            revision: re.nativeSegmentId != null ? X.revision : re.revision,
            updatedAt: re.updatedAt
          } : X;
        })
      };
      d(j, $.id), ee(j), C(`${J.updatedCount} selected segment${J.updatedCount === 1 ? "" : "s"} ${T === "approved" ? "approved" : T === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (J) {
      J.status === 409 && ((ke = J.payload) != null && ke.currentHistory) && t(J.payload.currentHistory), J.status === 409 && ee(await l()), C(J.message || "Unable to update the selected segments.");
    } finally {
      u.current = !1, q(null);
    }
  }
  return { closeMergeConfirmation: G, mergeSelectedSwimlane: Z, saveSelectedReviewState: P };
}
function sd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: b, materializeButtonRef: p, materializePreview: h, materializeRestoreFocusRef: f, materializing: S, mutateSegment: y, onConflict: O, onDetailChange: V, onReload: C, recordHistoryAction: q, refreshMaterializationPreview: A, removingExampleId: w, revealSegmentGroupForSelection: $, savingSegmentId: G, segments: Z, selectedSegment: P, selectedSegmentIdRef: L, selectedSegments: T, selectionAnchorIdRef: R, selectionRangeBaseIdsRef: F, setAutoAssignError: ae, setAutoAssignOpen: ee, setAutoAssigning: ke, setExportingExamples: J, setIncorrectExamples: K, setMaterializeError: Y, setMaterializeLoading: j, setMaterializeOpen: X, setMaterializePreview: re, setMaterializing: de, setRemovingExampleId: Te, setSaveMessage: le, setSavingSegmentId: Ne, setSelectedSegmentGroupKey: oe, setSelectedSegmentId: x, setSelectedSegmentIds: U, video: I } = e;
  async function N() {
    var Le, Fe, xe;
    if (T.length === 0 || !P || G != null) return;
    const E = hl(T, u), _ = E.segments;
    if (_.length === 0) return;
    const be = T.map((Ce) => ({
      id: Ce.id,
      itemId: Ce.itemId,
      nativeSegmentId: Ce.nativeSegmentId
    })), me = be.find((Ce) => Ce.id === P.id) || be[0], ge = [], ye = [];
    let we = c;
    Ne(me.id), le(E.action === "remove" ? `Removing ${_.length} selected incorrect example${_.length === 1 ? "" : "s"}…` : `Collecting ${_.length} selected segment${_.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const Ce = async (Ie, $e) => {
        const Be = Ie.nativeSegmentId != null, tt = E.action === "remove" ? `incorrect-example-remove:${I.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${I.id}:${Be ? `native:${Ie.nativeSegmentId}:${Ie.updatedAt}` : `item:${Ie.itemId}:${Ie.revision}`}`;
        if (E.action === "remove" && !$e)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Ye;
        try {
          Ye = E.action === "remove" ? await Q(
            `/videos/${I.id}/incorrect-examples/${$e.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Ae(tt),
                expectedExampleRevision: $e.revision,
                expectedRepresentationRevision: $e.representationRevision
              })
            }
          ) : await Q(`/videos/${I.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ae(tt),
              nativeSegmentId: Be ? Ie.nativeSegmentId : null,
              itemId: Be ? null : Ie.itemId,
              expectedUpdatedAt: Be ? Ie.updatedAt : null,
              expectedRevision: Be ? null : Ie.revision
            })
          });
        } catch (qe) {
          throw qe.operationKey = tt, qe;
        }
        if (!vl(E.action, Ye))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Me(tt), Ye;
      };
      for (const Ie of _) {
        const $e = E.action === "remove" ? u.find((Be) => Be.itemId != null && Be.itemId === Ie.itemId) : null;
        try {
          const Be = be.find((qe) => qe.id === Ie.id);
          let tt = ze(
            we == null ? void 0 : we.segments,
            Be
          ) || Ie, Ye;
          try {
            Ye = await Ce(tt, $e);
          } catch (qe) {
            if (qe.status === 409 && ((Fe = (Le = qe.payload) == null ? void 0 : Le.result) == null ? void 0 : Fe.code) === "OPERATION_REPLAYED")
              we = await Q(
                `/videos/${I.id}/editor`
              ), Me(qe.operationKey), Ye = qe.payload.result;
            else {
              if (E.action !== "collect" || qe.status !== 409) throw qe;
              const vt = await Q(
                `/videos/${I.id}/editor`
              );
              we = vt;
              const It = ze(
                vt == null ? void 0 : vt.segments,
                Be
              );
              if (!It) throw qe;
              tt = It, Ye = await Ce(tt, null);
            }
          }
          Be && Ye.itemId != null && (Be.itemId = Ye.itemId), we = Mo(
            we,
            Ye.editorDelta
          ), ge.push({ segment: Ie, result: Ye });
        } catch (Be) {
          if (ye.push(Be), ![400, 404, 409].includes(Be.status)) break;
        }
      }
      ge.some(({ result: Ie }) => Ie.representation === "basicNativeBin") && wn();
      const Oe = Sr(
        L.current,
        me.id
      ), Ve = E.action === "collect" && ge.some(({ segment: Ie }) => Ie.id === me.id), ot = ge.map(({ segment: Ie }) => Ie.id), he = Ve ? qi(
        r,
        ot,
        me.id
      ) : null, Ee = Ve ? (he == null ? void 0 : he.id) ?? null : me.id;
      Oe && Ve && (U(he ? [he.id] : []), x((he == null ? void 0 : he.id) ?? vr), R.current = (he == null ? void 0 : he.id) ?? null, F.current = []);
      const He = await Q(`/videos/${I.id}/incorrect-examples`);
      K(He);
      const Je = we;
      if (V(Je, I.id), Oe && Sr(
        L.current,
        Ee
      )) {
        let Ie, $e;
        Ve ? ($e = he ? ze(Je == null ? void 0 : Je.segments, {
          id: he.id,
          itemId: he.itemId,
          nativeSegmentId: he.nativeSegmentId
        }) : null, Ie = $e ? [$e] : []) : (Ie = be.map((Be) => ze(Je == null ? void 0 : Je.segments, Be)).filter(Boolean), $e = ze(Je == null ? void 0 : Je.segments, me) || Ie[0] || null), U(Ie.map((Be) => Be.id)), x(($e == null ? void 0 : $e.id) ?? (Ve ? vr : null)), R.current = ($e == null ? void 0 : $e.id) ?? null, F.current = [], oe($e ? ht(r, $e.id) : null), $e && $($e.id);
      }
      if (ye.length > 0) {
        const Ie = ((xe = ye[0]) == null ? void 0 : xe.message) || "Only segments with registered AI provenance can be collected.";
        ge.length === 0 ? le(Ie) : E.action === "remove" ? le(
          `Partially removed ${ge.length} of ${_.length} selected incorrect examples. ${Ie}`
        ) : le(
          `Partially collected ${ge.length} of ${_.length} selected segments. ${Ie}`
        );
      } else if (E.action === "remove")
        le(
          `${ge.length} incorrect example${ge.length === 1 ? "" : "s"} removed and ${ge.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Ie = ge.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
        le(Ie === ge.length ? `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ge.length} incorrect AI example${ge.length === 1 ? "" : "s"} collected and ${ge.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
    } catch (Ce) {
      le(Ce.message || "Unable to update the selected incorrect examples.");
    } finally {
      Ne(null);
    }
  }
  async function M(E) {
    var be, me;
    if (!E || w != null || m) return;
    Te(E.id);
    const _ = `incorrect-example-remove:${I.id}:${E.id}:${E.revision}:${E.representationRevision}`;
    try {
      const ge = await Q(
        `/videos/${I.id}/incorrect-examples/${E.id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ae(_),
            expectedExampleRevision: E.revision,
            expectedRepresentationRevision: E.representationRevision
          })
        }
      );
      Me(_);
      const ye = await Q(
        `/videos/${I.id}/incorrect-examples`
      );
      K(ye), V(
        Mo(c, ge.editorDelta),
        I.id
      ), E.representation === "basicNativeBin" && wn(), le(E.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed.");
    } catch (ge) {
      if (ge.status === 409 && ((me = (be = ge.payload) == null ? void 0 : be.result) == null ? void 0 : me.code) === "OPERATION_REPLAYED") {
        Me(_), K(await Q(
          `/videos/${I.id}/incorrect-examples`
        )), await C(), le("Incorrect example removal was already applied.");
        return;
      }
      ge.status === 409 && await O(), le(ge.message || "Unable to remove the incorrect example.");
    } finally {
      Te(null);
    }
  }
  async function v() {
    if (m || w != null || u.length === 0) return;
    J(!0);
    const E = `incorrect-example-export:${I.id}:${u.map((_) => `${_.id}:${_.revision}:${_.representationRevision}`).join(",")}`;
    try {
      const _ = await Sl(
        I.id,
        u
      ), be = new FormData();
      be.append("metadata", JSON.stringify({
        operationId: Ae(E),
        examples: _.captures
      }));
      for (const Fe of _.files)
        be.append(Fe.fieldName, Fe.file);
      const me = await Q(
        `/videos/${I.id}/incorrect-examples/export`,
        { method: "POST", body: be }
      ), ge = await $s(me.downloadUrl), ye = URL.createObjectURL(ge.blob), we = document.createElement("a");
      we.href = ye, we.download = ge.fileName, we.click(), setTimeout(() => URL.revokeObjectURL(ye), 1e3);
      const Le = await Q(
        `/training-exports/${me.id}/complete`,
        { method: "POST" }
      );
      Me(E), K(await Q(
        `/videos/${I.id}/incorrect-examples`
      )), le(
        `Downloaded ${me.exampleCount} incorrect example${me.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Le.clearedExampleCount} from the working collection.`
      );
    } catch (_) {
      le(_.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      J(!1);
    }
  }
  async function k() {
    const _ = Z.filter((me) => me.reviewState === "rejected").length, be = u.some((me) => me.representation === "fullItem");
    if (_ === 0 && !be) {
      le("There are no rejected segments to delete.");
      return;
    }
    Ne(-1), le("Preparing deletion summary…");
    try {
      const me = await Q(`/videos/${I.id}/rejected/deletion/preview`, { method: "POST" }), ge = Number(me.deletedSegmentCount) || 0, ye = Number(me.deferredRejectedSegmentCount) || 0, we = Number(me.protectedIncorrectExampleCount) || 0;
      if (ge === 0) {
        ye > 0 ? le(
          `${ye} feedback-protected rejected segment${ye === 1 ? "" : "s"} kept. ${we} AI feedback example${we === 1 ? "" : "s"} must be exported before ${ye === 1 ? "this segment can" : "these segments can"} be deleted.`
        ) : le("There are no rejected segments to delete.");
        return;
      }
      if (!ba(me, le) || !ha(me))
        return;
      le("Deleting rejected segments…");
      const Le = `rejected-dependency-delete:${I.id}:${me.fingerprint}`, Fe = await Q(`/videos/${I.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(Le),
          fingerprint: me.fingerprint
        })
      });
      Me(Le), await C(), Fe.deletedSegmentCount > 0 && t(kt);
      const xe = ye > 0 ? ` ${ye} feedback-protected rejected segment${ye === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      le(`${Fe.deletedSegmentCount} segment${Fe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${xe}`);
    } catch (me) {
      le(me.message || "Unable to delete rejected segments.");
    } finally {
      Ne(null);
    }
  }
  async function z(E = o) {
    if (!(i || E.length === 0)) {
      ke(!0), ae("");
      try {
        const _ = await Q(`/videos/${I.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: E.flatMap((be) => be.nativeSegmentId == null ? [] : [be.nativeSegmentId]),
            itemIds: E.flatMap((be) => be.published || be.itemId == null ? [] : [be.itemId])
          })
        });
        ee(!1), await C(), le(`${_.assignedSegmentCount} segment${_.assignedSegmentCount === 1 ? "" : "s"} received ${_.assignedSlotCount} performer-slot assignment${_.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (_) {
        ae(_.message || "Unable to auto-assign performers.");
      } finally {
        ke(!1);
      }
    }
  }
  async function se() {
    X(!0), Y(""), !h && (j(!0), A());
  }
  function ne() {
    f.current = !0, X(!1), requestAnimationFrame(() => {
      var E;
      return (E = p.current) == null ? void 0 : E.focus({ preventScroll: !0 });
    });
  }
  async function ie() {
    if (!h || S || h.createCount + h.linkCount === 0)
      return;
    de(!0), Y("");
    let E;
    try {
      const _ = `materialize-derived:${I.id}:${h.fingerprint}`;
      E = await Q(`/videos/${I.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(_),
          fingerprint: h.fingerprint,
          maxDepth: 3
        })
      }), Me(_);
    } catch (_) {
      _.status === 409 && re(null), Y(_.message || "Unable to materialize derived segments."), de(!1);
      return;
    }
    re((_) => _ && { ..._, createCount: 0, linkCount: 0 });
    try {
      await C(), ne(), re(null);
      const _ = E.createdCount + E.linkedCount;
      le(`${E.createdCount} derived segment${E.createdCount === 1 ? "" : "s"} created and ${E.linkedCount} existing segment${E.linkedCount === 1 ? "" : "s"} linked.`), _ === 0 && le("Every applicable derivation was already materialized.");
    } catch {
      Y("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    de(!1);
  }
  async function ve(E) {
    var _, be, me, ge;
    if (T.length > 1) {
      const ye = T.filter((xe) => xe.tagId !== E);
      if (ye.length === 0) {
        l();
        return;
      }
      const we = T.map((xe) => ({
        id: xe.id,
        itemId: xe.itemId,
        nativeSegmentId: xe.nativeSegmentId
      })), Le = T.map((xe) => !d || xe.nativeSegmentId != null ? `native:${xe.nativeSegmentId}:${xe.updatedAt}` : `item:${xe.itemId}:${xe.revision}`).sort().join(","), Fe = `bulk-tag:${I.id}:${E}:${Le}`;
      Ne((P == null ? void 0 : P.id) ?? ye[0].id), le(`Changing tag for ${ye.length} selected segment${ye.length === 1 ? "" : "s"}…`);
      try {
        const xe = d ? null : crypto.randomUUID();
        await Q(`/videos/${I.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ae(Fe),
            tagId: E,
            historyReceiptId: xe,
            segments: T.map((he) => {
              const Ee = !d || he.nativeSegmentId != null;
              return {
                nativeSegmentId: Ee ? he.nativeSegmentId : null,
                itemId: Ee ? null : he.itemId,
                expectedUpdatedAt: Ee ? he.updatedAt : null,
                expectedRevision: Ee ? null : he.revision
              };
            })
          })
        }), Me(Fe);
        const Ce = lt(
          T,
          d
        ), Oe = await C(), Ve = we.map((he) => ze(Oe == null ? void 0 : Oe.segments, he)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${ye.length} segment${ye.length === 1 ? "" : "s"}`,
          Ce,
          lt(Ve, d),
          xe
        );
        const ot = we.map((he) => ze(Oe == null ? void 0 : Oe.segments, he)).filter(Boolean);
        U(ot.map((he) => he.id)), x(((_ = ot.find((he) => he.id === (P == null ? void 0 : P.id))) == null ? void 0 : _.id) ?? ((be = ot[0]) == null ? void 0 : be.id) ?? null), l(), le(`${ye.length} selected segment${ye.length === 1 ? "" : "s"} retagged.`);
      } catch (xe) {
        xe.status === 409 && await O(), le(xe.message || "Unable to change the selected segment tags.");
      } finally {
        Ne(null);
      }
      return;
    }
    if (!(T.length !== 1 || !P)) {
      if (E === P.tagId) {
        l();
        return;
      }
      if (P.itemId != null && ((ge = (me = b.data) == null ? void 0 : me.children) == null ? void 0 : ge.length) > 0) {
        Ne(P.id), le("Checking lineage impact…");
        try {
          const ye = await Q(`/items/${P.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: P.revision, tagId: E })
          }), we = ye.deletedItemIds.length > 0 || ye.removedEdgeIds.length > 0;
          if (we && !window.confirm(
            `Changing this tag removes ${ye.removedEdgeIds.length} lineage edge${ye.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${ye.deletedItemIds.length} derived segment${ye.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            le("Tag change canceled.");
            return;
          }
          const Le = `tag-change:${P.itemId}:${P.revision}:${ye.componentFingerprint}:${E}`;
          await Q(`/items/${P.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ae(Le),
              expectedRevision: P.revision,
              componentFingerprint: ye.componentFingerprint,
              tagId: E
            })
          }), Me(Le), await C(), l(), le(we ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (ye) {
          ye.status === 409 ? (le("Lineage changed — loading the latest segments…"), await O()) : le(ye.message || "Unable to reconcile the lineage.");
        } finally {
          Ne(null);
        }
        return;
      }
      await y(P, {
        startSec: P.startSec,
        endSec: P.endSec,
        tagId: E
      }), l();
    }
  }
  async function W() {
    var we, Le, Fe, xe;
    if (!s || !P || G != null) return;
    const E = [...T].sort((Ce, Oe) => Number(Ce.nativeSegmentId ?? Ce.id) - Number(Oe.nativeSegmentId ?? Oe.id)), _ = new Set(E.map((Ce) => Ce.id)), be = E.map((Ce) => `${Ce.nativeSegmentId ?? Ce.id}:${Ce.updatedAt}`).join("|");
    Ne(P.id), le(`Moving ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin…`);
    const me = `bulk-move:${I.id}:${be}`, ge = Ae(me), ye = d ? null : crypto.randomUUID();
    try {
      const Ce = (Ee = !1) => Q(`/videos/${I.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ge,
          segments: E.map((He) => ({
            segmentId: He.nativeSegmentId ?? He.id,
            expectedUpdatedAt: He.updatedAt
          })),
          discardMissingImage: Ee,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: ye
        })
      });
      let Oe;
      try {
        Oe = await Ce(
          Er(me)
        );
      } catch (Ee) {
        if (((we = Ee.payload) == null ? void 0 : we.code) !== "missing-image" || !window.confirm(`${Ee.message}

Continue and discard the missing image reference?`)) throw Ee;
        Dr(me), Oe = await Ce(!0);
      }
      Me(me), wn();
      const Ve = new Map((Oe.items || []).map((Ee) => [
        Number(Ee.segmentId),
        Ee
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin`,
        lt(E, !1),
        lt(E.map((Ee) => {
          const He = Ve.get(
            Number(Ee.nativeSegmentId ?? Ee.id)
          );
          return {
            ...Ee,
            recycleBinItemId: (He == null ? void 0 : He.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (He == null ? void 0 : He.revision) ?? null
          };
        }), !1),
        ye
      );
      const ot = Z.filter((Ee) => !_.has(Ee.id)), he = Hi(r, _, P.id);
      V({ ...c, segments: ot }, I.id), U(he ? [he.id] : []), x((he == null ? void 0 : he.id) ?? null), R.current = (he == null ? void 0 : he.id) ?? null, F.current = [], he && (oe(ht(r, he.id)), $(he.id)), requestAnimationFrame(() => {
        var Ee;
        return (Ee = g.current) == null ? void 0 : Ee.focus({ preventScroll: !0 });
      }), le(`Moved ${E.length} segment${E.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ce) {
      const Oe = ((Le = Ce.payload) == null ? void 0 : Le.code) || ((xe = (Fe = Ce.payload) == null ? void 0 : Fe.result) == null ? void 0 : xe.code);
      Ce.status === 409 && Oe === "CANONICAL_SEGMENT_CHANGED" ? await O() : le(Ce.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Ne(null);
    }
  }
  async function te() {
    if (!(d || a.current || G != null)) {
      a.current = !0, le("Checking the recycling bin…");
      try {
        const E = await Q("/bin"), _ = await xa(E, () => le("Emptying the recycling bin…"));
        if (_.status === "empty") {
          le("The recycling bin is empty.");
          return;
        }
        if (_.status === "canceled") {
          le("The recycling bin was not emptied.");
          return;
        }
        le(`${_.segmentCount} segment${_.segmentCount === 1 ? "" : "s"} from ${_.sceneCount} scene${_.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (E) {
        le(E.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: N, removeIncorrectExample: M, captureTrainingExport: v, deleteRejectedSegments: k, autoAssignPerformers: z, previewDerivedSegments: se, closeMaterializeDialog: ne, materializeDerivedSegments: ie, saveTag: ve, moveToBin: W, emptyRecyclingBin: te };
}
function ld(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: b, onReload: p, railToggleRef: h, recordHistoryAction: f, savingSegmentId: S, savingShot: y, savingShotRef: O, setCollapsedSegmentGroups: V, setEditorLayout: C, setHistorySaving: q, setSaveMessage: A, setSavingSegmentId: w, setSavingShot: $, shotBoundaries: G, timelineDuration: Z, video: P, workspaceRef: L } = e;
  async function T(x, U, I) {
    var k, z, se, ne;
    const N = x.type === "segment" ? [x] : x.segments || [], M = (U == null ? void 0 : U.type) === "segment" ? [U] : (U == null ? void 0 : U.segments) || [];
    let v = I;
    for (const [ie, ve] of N.entries()) {
      const W = M[ie], te = ((k = ve.identity) == null ? void 0 : k.nativeSegmentId) != null || ((z = ve.identity) == null ? void 0 : z.published) === !0, E = ((se = W == null ? void 0 : W.identity) == null ? void 0 : se.recycleBinItemId) ?? ((ne = W == null ? void 0 : W.identity) == null ? void 0 : ne.itemId);
      let _ = ze(v.segments, W == null ? void 0 : W.identity) || ze(v.segments, ve.identity);
      if (!_ && te && E != null && W.identity.revision != null) {
        const ge = `history-restore:${P.id}:${E}:${W.identity.revision}`;
        await Q(`/bin/${E}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ae(ge),
            expectedRevision: W.identity.revision
          })
        }), Me(ge), v = await p(), _ = v.segments.find((ye) => ye.tagId === ve.values.tagId && ye.startSec === ve.values.startSec && ye.endSec === ve.values.endSec);
      }
      if (!_)
        throw new Error("A segment in this history state no longer exists.");
      if ((_.nativeSegmentId != null || _.published === !0) !== te) {
        if (te) {
          const ge = _.recycleBinItemId ?? _.itemId ?? E;
          if (ge == null)
            throw new Error("This recycled segment can no longer be restored.");
          const ye = `history-restore:${P.id}:${ge}:${_.revision}:${ve.values.reviewState ?? "native"}`;
          await Q(`/bin/${ge}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ae(ye),
              expectedRevision: _.revision
            })
          }), Me(ye);
        } else {
          const ge = `history-bin:${P.id}:${_.nativeSegmentId}:${_.updatedAt}:${ve.values.reviewState}`;
          await Q(`/videos/${P.id}/segments/${_.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Ae(ge),
              expectedUpdatedAt: _.updatedAt,
              reviewState: ve.values.reviewState
            })
          }), Me(ge);
        }
        if (v = await p(), !te)
          continue;
        if (_ = ze(v.segments, ve.identity) || v.segments.find((ge) => ge.tagId === ve.values.tagId && ge.startSec === ve.values.startSec && ge.endSec === ve.values.endSec), !_)
          throw new Error("The restored segment could not be found.");
      }
      const me = ve.values;
      if (_.nativeSegmentId == null && _.itemId != null) {
        const ge = `history-draft-update:${P.id}:${_.itemId}:${_.revision}:${me.tagId}:${me.startSec}:${me.endSec ?? "open"}:${me.reviewState}`;
        await Q(`/videos/${P.id}/drafts/${_.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Ae(ge),
            expectedRevision: _.revision,
            ...me
          })
        }), Me(ge);
      } else
        await Q(`/videos/${P.id}/segments/${_.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...me, expectedUpdatedAt: _.updatedAt })
        });
      v = await p();
    }
    return v;
  }
  async function R(x, U) {
    var I;
    for (const N of x.targets || []) {
      const M = ze(U.segments, N.identity);
      if (!M)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const v = (I = U.performerSlotRevisions) == null ? void 0 : I[M.id];
      await Q(M.published ? `/videos/${P.id}/segments/${M.nativeSegmentId}/slots` : `/videos/${P.id}/drafts/${M.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: v,
          assignments: N.assignments
        })
      }), U = await p();
    }
    return U;
  }
  async function F(x, U, I = []) {
    const N = x.state;
    if (!r && ((N == null ? void 0 : N.type) === "segment" || (N == null ? void 0 : N.type) === "segments")) {
      const v = `basic-history:${P.id}:${d.current.revision}:${x.action.sequence}:${x.direction}`, k = await Q(`/videos/${P.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(v),
          expectedHistoryRevision: d.current.revision,
          actionSequence: x.action.sequence,
          direction: x.direction
        })
      });
      return t(k.history), I.push(v), p();
    }
    const M = x.direction === "backward" ? x.action.afterState : x.action.beforeState;
    if ((N == null ? void 0 : N.type) === "composite") {
      let v = U;
      const k = (M == null ? void 0 : M.type) === "composite" ? M.states || [] : [];
      for (const [z, se] of (N.states || []).entries()) {
        const ne = k[z];
        v = await F({
          ...x,
          state: se,
          action: {
            ...x.action,
            beforeState: x.direction === "backward" ? se : ne,
            afterState: x.direction === "backward" ? ne : se
          }
        }, v, I);
      }
      return v;
    }
    if ((N == null ? void 0 : N.type) === "segment" || (N == null ? void 0 : N.type) === "segments")
      return T(
        N,
        M,
        U
      );
    if ((N == null ? void 0 : N.type) === "performerSlots")
      return R(N, U);
    if ((N == null ? void 0 : N.type) === "shots") {
      const v = qn(U.shotBoundaries || []), k = await Q(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(`history-shots:${P.id}:${v}:${N.fingerprint}`),
          expectedFingerprint: v,
          boundaries: N.boundaries
        })
      });
      return { ...U, shotBoundaries: k };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ae(x) {
    var I;
    if (c || S != null || y || x === l.cursorSequence)
      return;
    const U = Gs(l, x);
    if (U.length !== 0) {
      q(!0), w(-1), A(`Restoring ${U.length} history ${U.length === 1 ? "action" : "actions"}…`);
      try {
        let N = i;
        const M = [];
        for (const k of U)
          N = await F(
            k,
            N,
            M
          );
        const v = r ? await Q(`/videos/${P.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: x
          })
        }) : d.current;
        M.forEach(Me), t(v), await p(), A("History restored.");
      } catch (N) {
        N.status === 409 && ((I = N.payload) != null && I.current) && t(N.payload.current), await p(), A(N.message || "Unable to restore editor history.");
      } finally {
        w(null), q(!1);
      }
    }
  }
  function ee(x) {
    C((U) => ({ ...U, timelineRatio: Fr(x, m) }));
  }
  function ke(x) {
    var I;
    const U = (I = u.current) == null ? void 0 : I.getBoundingClientRect();
    U && ee(fl(x.clientY, U.top, U.height));
  }
  function J(x) {
    x.currentTarget.setPointerCapture(x.pointerId), ke(x);
  }
  function K(x) {
    x.currentTarget.hasPointerCapture(x.pointerId) && ke(x);
  }
  function Y(x) {
    const U = x.shiftKey ? 0.1 : 0.05;
    let I = null;
    x.key === "ArrowUp" && (I = a.timelineRatio + U), x.key === "ArrowDown" && (I = a.timelineRatio - U);
    const N = Lr(m);
    x.key === "Home" && (I = N.minimum), x.key === "End" && (I = N.maximum), I != null && (x.preventDefault(), x.stopPropagation(), ee(I));
  }
  function j(x) {
    const U = x === "detailWidth" ? g.focusRow : g.workspace, I = g.workspace > 0 ? Cr(g.workspace, 600) : 560, N = Lt(a.markerRailWidth, I), M = x === "detailWidth" ? 344 + (a.markerRailOpen ? N + 24 : 0) : 600;
    return U > 0 ? Cr(U, M) : 560;
  }
  function X(x, U) {
    C((I) => ({ ...I, [x]: Lt(U, j(x)) }));
  }
  function re(x, U) {
    var N, M;
    const I = U === "detailWidth" ? (N = s.current) == null ? void 0 : N.getBoundingClientRect() : (M = L.current) == null ? void 0 : M.getBoundingClientRect();
    I && X(U, U === "detailWidth" ? x.clientX - I.left : I.right - x.clientX);
  }
  function de(x, U) {
    const I = j(x), N = Lt(a[x], I);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": U,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(I),
      "aria-valuenow": Math.round(N),
      "aria-valuetext": `${Math.round(N)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (M) => {
        M.currentTarget.setPointerCapture(M.pointerId), re(M, x);
      },
      onPointerMove: (M) => {
        M.currentTarget.hasPointerCapture(M.pointerId) && re(M, x);
      },
      onKeyDown: (M) => {
        const v = M.shiftKey ? 40 : 16;
        let k = null;
        M.key === "ArrowLeft" && (k = x === "detailWidth" ? -v : v), M.key === "ArrowRight" && (k = x === "detailWidth" ? v : -v);
        let z = k == null ? null : N + k;
        M.key === "Home" && (z = 240), M.key === "End" && (z = I), z != null && (M.preventDefault(), M.stopPropagation(), X(x, z));
      },
      onDoubleClick: () => X(x, rt[x]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Te() {
    C((x) => ({ ...x, markerRailOpen: !x.markerRailOpen })), requestAnimationFrame(() => {
      var x;
      return (x = h.current) == null ? void 0 : x.focus({ preventScroll: !0 });
    });
  }
  function le(x) {
    V((U) => U.includes(x) ? U.filter((I) => I !== x) : At([...U, x]));
  }
  async function Ne(x, U = !0, I = o) {
    var k;
    if (O.current) return null;
    const N = Number((k = P.videoFile) == null ? void 0 : k.duration) || Z, M = qn(G), v = `shot-${x}:${P.id}:${I.toFixed(3)}:${N.toFixed(3)}:${M}`;
    O.current = !0, $(!0), A(x === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const z = await Q(`/videos/${P.id}/shot-boundaries/${x}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(x === "split" ? { operationId: Ae(v), timeSec: I } : { operationId: Ae(v), timeSec: I })
      });
      return Me(v), b((se) => ({ ...se, shotBoundaries: z }), P.id), U && await f(
        "shots.update",
        x === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: G,
          fingerprint: M
        },
        {
          type: "shots",
          boundaries: z,
          fingerprint: qn(z)
        }
      ), A(x === "split" ? "Shot boundary added." : "Shots merged."), z;
    } catch (z) {
      return A(z.message || "Unable to edit shot boundaries."), null;
    } finally {
      O.current = !1, $(!1);
    }
  }
  async function oe(x) {
    if (O.current) return null;
    const U = `shot-restore:${P.id}:${x.afterFingerprint}`;
    O.current = !0, $(!0), A("Undoing shot edit…");
    try {
      const I = await Q(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(U),
          expectedFingerprint: x.afterFingerprint,
          boundaries: x.before
        })
      });
      return Me(U), b((N) => ({ ...N, shotBoundaries: I }), P.id), I;
    } catch (I) {
      return A(I.message || "Unable to undo the shot edit."), null;
    } finally {
      O.current = !1, $(!1);
    }
  }
  return { applySegmentHistoryState: T, applyPerformerSlotHistoryState: R, applyHistoryState: F, restoreHistoryTarget: ae, updateTimelineRatio: ee, updateTimelineRatioFromPointer: ke, handleSeparatorPointerDown: J, handleSeparatorPointerMove: K, handleSeparatorKeyDown: Y, panelWidthMaximum: j, updatePanelWidth: X, handlePanelSeparatorPointer: re, panelSeparatorProps: de, toggleSegmentRail: Te, toggleSegmentGroup: le, mutateShotBoundary: Ne, restoreShotBoundaries: oe };
}
function dd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: b, mergeSelectedSwimlane: p, moveToBin: h, mutateShotBoundary: f, openPublishApprovedDialog: S, playbackControlsRef: y, playbackShortcutConfig: O, saveSelectedReviewState: V, seekRef: C, segmentGroupKeys: q, selectSegment: A, selectedSegment: w, selectedSegmentGroupForSegment: $, selectedSegmentGroupKey: G, selectedSegments: Z, setCollapsedSegmentGroups: P, setIncorrectExamplesOpen: L, setQuickSearchOpen: T, setSaveMessage: R, setSelectedSegmentGroupKey: F, setTagEditing: ae, setTimelineZoom: ee, shotBoundaries: ke, slotButtonRef: J, splitSegment: K, swimlanes: Y, timelineDuration: j, toggleIncorrectExample: X, toggleSegmentGroup: re, updateTimelineRatio: de, videoFrameRate: Te, visibleSegments: le } = e;
  function Ne(x, U) {
    if (Z.length > 1 && Qi(x.id))
      return;
    let I = null;
    x.id === "video.playPause" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.toggle();
    }), x.id === "video.seekSmallBackward" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.seekBy(-O.smallSeekTime);
    }), x.id === "video.seekSmallForward" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.seekBy(O.smallSeekTime);
    }), x.id === "video.seekMediumBackward" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.seekBy(-O.mediumSeekTime);
    }), x.id === "video.seekMediumForward" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.seekBy(O.mediumSeekTime);
    }), x.id === "video.seekLongBackward" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.seekBy(-O.longSeekTime);
    }), x.id === "video.seekLongForward" && (I = () => {
      var N;
      return (N = y.current) == null ? void 0 : N.seekBy(O.longSeekTime);
    }), x.id === "video.playSelected" && w && (I = () => {
      var N;
      (N = C.current) == null || N.call(C, w.startSec, !0), requestAnimationFrame(() => {
        var M;
        return (M = g.current) == null ? void 0 : M.focus({ preventScroll: !0 });
      });
    }), (x.id === "video.playPreviousSegment" || x.id === "video.playNextSegment") && (I = () => {
      var M;
      const N = Nr(
        Y,
        w == null ? void 0 : w.id,
        x.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !N || N.id === (w == null ? void 0 : w.id) || (A(N, { focusEditor: !0, seekToSegment: !1 }), (M = C.current) == null || M.call(C, N.startSec, !0));
    }), x.id.startsWith("video.seekPercent") && (I = () => {
      var M;
      const N = Number(x.id.slice(17)) / 10;
      (M = C.current) == null || M.call(C, Wi(b ?? j, N), !1);
    }), x.id === "video.jumpToSegmentStart" && w && (I = () => {
      var N;
      return (N = C.current) == null ? void 0 : N.call(C, w.startSec, !1);
    }), x.id === "video.jumpToSegmentEnd" && w && (I = () => {
      var N;
      return (N = C.current) == null ? void 0 : N.call(C, w.endSec ?? w.startSec, !1);
    }), x.id === "video.jumpToVideoStart" && (I = () => {
      var N;
      return (N = C.current) == null ? void 0 : N.call(C, 0, !1);
    }), x.id === "video.jumpToVideoEnd" && (I = () => {
      var N;
      return (N = C.current) == null ? void 0 : N.call(C, j, !1);
    }), x.id.startsWith("video.frame") && (I = () => {
      var v, k;
      const N = x.id.includes("Small") ? "small" : x.id.includes("Medium") ? "medium" : "long", M = O[`${N}FrameStep`] * (x.id.endsWith("Backward") ? -1 : 1);
      (v = y.current) == null || v.pause(), (k = y.current) == null || k.seekBy(ls(M, Te));
    }), x.id.startsWith("navigation.swimlane") && (I = () => {
      const N = x.id.slice(19).toLowerCase(), M = Nr(Y, w == null ? void 0 : w.id, N, s);
      M && A(M, { focusEditor: !0, seekToSegment: !1 });
    }), (x.id === "navigation.extendSwimlaneLeft" || x.id === "navigation.extendSwimlaneRight") && (I = () => {
      const N = tl(
        t,
        w == null ? void 0 : w.id,
        x.id.endsWith("Left") ? "left" : "right"
      );
      N && A(N.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: N.segmentIds
      });
    }), (x.id === "navigation.segmentGroupUp" || x.id === "navigation.segmentGroupDown") && (I = () => {
      const N = nl(
        q,
        G ?? $,
        x.id.endsWith("Up") ? -1 : 1
      );
      N && F(N);
    }), (x.id === "navigation.previousAtPlayhead" || x.id === "navigation.nextAtPlayhead") && (I = () => {
      const N = yl(le, s, x.id === "navigation.previousAtPlayhead" ? -1 : 1, w == null ? void 0 : w.id);
      N && A(N, { focusEditor: !0, seekToSegment: !1 });
    }), x.id === "navigation.nearestInCurrentSwimlane" && (I = () => {
      const N = al(
        Y,
        w == null ? void 0 : w.id,
        s
      );
      N && A(N, { focusEditor: !0, seekToSegment: !1 });
    }), x.id.includes("Unreviewed") && (I = () => {
      const N = Ra(
        Y,
        w == null ? void 0 : w.id,
        x.id.startsWith("navigation.previous") ? -1 : 1,
        x.id.endsWith("Global")
      );
      N && A(N, { focusEditor: !0, seekToSegment: !1 });
    }), (x.id === "navigation.nextTouchingPlayhead" || x.id === "navigation.previousTouchingPlayhead") && (I = () => {
      const N = ol(Y, s, x.id === "navigation.previousTouchingPlayhead" ? -1 : 1, w == null ? void 0 : w.id);
      N && A(N, { focusEditor: !0, seekToSegment: !1 });
    }), x.id === "navigation.quickSearch" && (I = () => T(!0)), (x.id === "navigation.previousShot" || x.id === "navigation.nextShot") && (I = () => {
      var M;
      const N = ss(ke, s, x.id === "navigation.previousShot" ? -1 : 1);
      N && ((M = C.current) == null || M.call(C, N.startSec, !1));
    }), x.id === "shot.split" && (I = () => f("split")), x.id === "shot.merge" && (I = () => f("merge")), x.id === "marker.create" && (I = () => a()), x.id === "marker.duplicate" && (I = () => d(!1)), x.id === "marker.duplicateAtPlayhead" && (I = () => d(!0)), x.id === "marker.split" && (I = () => K()), x.id === "marker.editTag" && (I = () => {
      var N;
      if (Z.length > 1 && Z.some((M) => M.isDerived)) {
        R("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((N = u.data) != null && N.tagReadOnly) {
        R("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ae(!0);
    }), x.id === "marker.setStart" && w && (I = () => r(s, w.endSec)), x.id === "marker.setEnd" && w && (I = () => r(w.startSec, s)), x.id === "marker.copyTiming" && w && (I = () => {
      R(Rl(w) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), x.id === "marker.pasteTiming" && w && (I = () => {
      const N = Ml();
      if (!N) {
        R("No copied segment timing is available.");
        return;
      }
      r(N.startSec, N.endSec);
    }), x.id === "marker.mergeSelection" && (I = () => p()), x.id === "marker.moveToBin" && (I = () => h()), x.id === "marker.toggleIncorrectExample" && w && (I = () => X()), x.id === "marker.openIncorrectExamples" && (I = () => L(!0)), x.id === "markerGroup.toggleCollapse" && G && (I = () => re(G)), x.id === "markerGroup.toggleAll" && (I = () => P((N) => el(N, q))), x.id === "marker.assignSlots" && (I = () => {
      var N;
      return (N = J.current) == null ? void 0 : N.click();
    }), x.id === "navigation.zoomIn" && (I = () => ee((N) => Yn(N + 0.5))), x.id === "navigation.zoomOut" && (I = () => ee((N) => Yn(N - 0.5))), x.id === "navigation.resetZoom" && (I = () => ee(1)), x.id === "navigation.centerPlayhead" && (I = () => {
      var N;
      return (N = o.current) == null ? void 0 : N.call(o);
    }), x.id === "layout.growSwimlanes" && (I = () => de(c.timelineRatio + 0.05)), x.id === "layout.shrinkSwimlanes" && (I = () => de(c.timelineRatio - 0.05)), x.id === "marker.confirm" && w && (I = () => V("approved")), x.id === "system.publishApproved" && (I = () => S(U.target)), x.id === "marker.reject" && w && (I = () => V("rejected")), x.id === "system.emptyBin" && (I = () => m()), x.id === "system.deleteRejected" && (I = () => l()), I && I();
  }
  function oe(x, U) {
    const I = Tn.find((N) => N.id === x);
    I && tn(I, i) && Ne(I, U);
  }
  return { executeShortcutById: oe };
}
function cd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = D(null), [l, d] = D(null), [c, g] = D(""), [m, u] = D({
    busy: !1,
    reviewState: null,
    error: ""
  }), b = pe(null);
  async function p(S) {
    u({ busy: !0, reviewState: S, error: "" });
    try {
      await Q(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: wr(), reviewState: S })
      }), await t(), u({ busy: !1, reviewState: null, error: "" });
    } catch (y) {
      u({
        busy: !1,
        reviewState: null,
        error: y.message || "Unable to import Cove segments."
      });
    }
  }
  async function h() {
    try {
      const S = await Q(`/videos/${e}/analysis-runs`), y = (S == null ? void 0 : S[0]) || null;
      return s(y), (y == null ? void 0 : y.status) === "completed" && b.current !== y.id && (b.current = y.id, await t()), ((y == null ? void 0 : y.status) === "failed" || (y == null ? void 0 : y.status) === "cancelled") && g(y.errorMessage || "Video analysis did not complete."), y;
    } catch (S) {
      return g(S.message || "Unable to load video analysis status."), null;
    }
  }
  async function f(S = null) {
    g("");
    const y = S || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), O = y.includes("omnishotcut") && o > 0;
    if (!(O && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const V = await Q(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: y,
            replaceShotBoundaries: O,
            expectedShotBoundaryFingerprint: O ? i : null
          })
        });
        s(V);
      } catch (V) {
        g(V.message || "Unable to start video analysis.");
      }
  }
  return fe(() => {
    h(), Q("/analysis/status").then((S) => {
      d(S), S.configured || g("");
    }).catch((S) => g(S.message || "Unable to check video analysis readiness."));
  }, [e, r]), fe(() => {
    if ((a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const S = setInterval(h, 2500);
    return () => clearInterval(S);
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: m,
    startFullAnalysis: f
  };
}
const kn = Object.freeze([]);
function ud(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function md({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var to, no, ro, oo, ao;
  const [g, m] = D(null), [u, b] = D([]), p = pe(null), h = pe(null), f = pe([]), S = pe(null), [y, O] = D(() => dt({})), [V, C] = D(!1), [q, A] = D(Ji), [w, $] = D(0), [G, Z] = D(null), [P, L] = D(!1), [T, R] = D(""), [F, ae] = D(""), [ee, ke] = D(""), [J, K] = D(1), [Y, j] = D(Cl), [X, re] = D(0), [de, Te] = D({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [le, Ne] = D(kt), oe = pe(kt), [x, U] = D(!1), [I, N] = D(!1), [M, v] = D(!1), [k, z] = D(!1), se = pe(!1), [ne, ie] = D(null), ve = pe(null), [W, te] = D(!1), [E, _] = D(""), be = pe(null), me = pe(null), ge = pe(!1), ye = pe(!1), [we, Le] = D($l), [Fe, xe] = D(null), [Ce, Oe] = D(!1), [Ve, ot] = D(!1), [he, Ee] = D(!1), [He, Je] = D(!1), [Ie, $e] = D(!1), [Be, tt] = D(""), {
    analysisError: Ye,
    analysisRun: qe,
    analysisStatus: vt,
    importNativeSegments: It,
    nativeImportState: Mn,
    startFullAnalysis: tr
  } = cd(
    e.video.id,
    o,
    l,
    ((to = e.shotBoundaries) == null ? void 0 : to.length) || 0,
    qn(e.shotBoundaries || [])
  ), [Mt, xt] = D(!1), [Rt, Et] = D(null), [on, ut] = D(l), [nr, Gt] = D(0), [jt, rr] = D(!1), [an, mt] = D(""), [sn, Rn] = D(null), ln = pe(null), En = pe(null), dn = pe(!1), [Ct, Kt] = D([]), [Dn, or] = D(!1), [On, ar] = D(null), cn = Nl(), Ut = pe(null), un = pe(null), Dt = pe(null), ir = pe(s), mn = pe(null), gn = pe(null), zt = pe(null), pn = pe(null), at = pe(null), Pn = pe(null), fn = pe(null), yt = pe(null), Ln = pe(null), _t = pe(null), yn = pe(null), sr = pe(null), lr = pe(!1), Ht = pe(null), [bn, qt] = D({ scrollTop: 0, height: 512 });
  fe(() => {
    if (!Mt || jt || !an) return;
    const B = requestAnimationFrame(() => {
      var ce;
      return (ce = En.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(B);
  }, [Mt, jt, an]), fe(() => {
    if (!dn.current || Mt || on) return;
    const B = requestAnimationFrame(() => {
      var ce;
      (ce = ln.current) == null || ce.focus({ preventScroll: !0 }), dn.current = !1;
    });
    return () => cancelAnimationFrame(B);
  }, [Mt, on]);
  const Ge = e.video, Ue = e.segments || kn, We = De(() => JSON.stringify({
    segments: Ue.map((B) => [
      B.id,
      B.itemId,
      B.nativeSegmentId,
      B.tagId,
      B.startSec,
      B.endSec,
      B.reviewState,
      B.published,
      B.sourceKey,
      B.sourceRunId,
      B.confidence,
      B.revision,
      B.updatedAt
    ]),
    performerSlots: (e.performerSlots || kn).map((B) => [
      B.segmentId,
      B.slotDefinitionId,
      B.performerId,
      B.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ue, e.performerSlots, e.itemMetadata]);
  fe(() => {
    if (!l) {
      Et(null), ut(!1);
      return;
    }
    let B = !0;
    ut(!0);
    const ce = setTimeout(() => {
      Q(`/videos/${Ge.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Re) => {
        B && (Et(Re), mt(""));
      }).catch((Re) => {
        B && (Et(null), mt(Re.message || "Unable to preview derived segments."));
      }).finally(() => {
        B && ut(!1);
      });
    }, 150);
    return () => {
      B = !1, clearTimeout(ce);
    };
  }, [l, Ge.id, We, nr]);
  const Fn = () => Gt((B) => B + 1), bt = e.segmentGroups || kn, gt = e.performerSlots || kn, Bn = l && e.performerSlotsAvailable !== !1, St = De(
    () => (e.performerCandidates || []).filter((B) => B.isVideoPerformer),
    [e.performerCandidates]
  ), hn = e.shotBoundaries || kn, Wt = De(
    () => Ca(gt),
    [gt]
  ), Gn = De(
    () => Ue.map((B) => {
      const ce = Wt.get(B.id) || [];
      return {
        ...B,
        slots: ce,
        assignment: ce.every((Re) => Re.performerId == null) ? xs(ce, St) : null
      };
    }).filter((B) => B.slots.length > 0 && B.assignment != null),
    [Ue, Wt, St]
  ), vn = Number((no = Ge.videoFile) == null ? void 0 : no.frameRate) > 0 ? Number(Ge.videoFile.frameRate) : 30;
  function Vt() {
    v(!1), requestAnimationFrame(() => {
      var B;
      return (B = at.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  function dr() {
    G == null && (yn.current = null, z(!1), R(""), requestAnimationFrame(() => {
      var B;
      return (B = at.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    }));
  }
  function Jt() {
    C(!1), requestAnimationFrame(() => {
      var B, ce;
      (B = fn.current) != null && B.isConnected ? fn.current.focus({ preventScroll: !0 }) : (ce = at.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  fe(() => {
    _t.current === g ? (_t.current = null, v(!0)) : v(!1);
  }, [g]), fe(() => {
    var ce;
    if (!M) return;
    const B = (ce = Ln.current) == null ? void 0 : ce.querySelector("input");
    B == null || B.focus({ preventScroll: !0 }), B == null || B.select();
  }, [M, g]), fe(() => {
    var Re, je, nt;
    const B = rn(
      pr(
        e.segments,
        e.performerSlots || [],
        dt({}),
        l && q,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Re = e.segments.find((Un) => Un.id === s)) == null ? void 0 : Re.id) ?? ((je = To(B)) == null ? void 0 : je.id) ?? null;
    m(ce), b(ce == null ? [] : [ce]), h.current = ce, f.current = [], xe(ht(B, ce)), O(dt({})), C(!1), yn.current = null, z(!1), K(1), R(""), Ne(kt), oe.current = kt, U(!1), (nt = at.current) == null || nt.focus({ preventScroll: !0 });
  }, [Ge.id, s]), fe(() => {
    const B = new AbortController();
    return Q(`/videos/${Ge.id}/incorrect-examples`, { signal: B.signal }).then(Kt).catch((ce) => {
      ce.name !== "AbortError" && Kt([]);
    }), () => B.abort();
  }, [Ge.id, d == null ? void 0 : d.effectiveMode]), fe(() => {
    const B = new AbortController();
    return Q(`/videos/${Ge.id}/history`, { signal: B.signal }).then((ce) => {
      const Re = ce || kt;
      oe.current = Re, Ne(Re);
    }).catch((ce) => {
      ce.name !== "AbortError" && R(ce.message || "Unable to load editor history.");
    }), () => B.abort();
  }, [Ge.id]), fe(() => {
    Al(Y);
  }, [Y.timelineRatio, Y.markerRailOpen, Y.detailWidth, Y.markerRailWidth, Y.swimlaneTitleWidth]), fe(() => {
    Tl(we);
  }, [we]), fe(() => {
    Yi(q);
  }, [q]), fe(() => {
    const B = gn.current;
    if (!a || !B || typeof ResizeObserver > "u") return;
    const ce = () => {
      const je = B.clientHeight;
      re(je), j((nt) => {
        const Un = Fr(nt.timelineRatio, je);
        return Un === nt.timelineRatio ? nt : { ...nt, timelineRatio: Un };
      });
    }, Re = new ResizeObserver(ce);
    return Re.observe(B), ce(), () => Re.disconnect();
  }, [a]), fe(() => {
    if (!cn || typeof ResizeObserver > "u") return;
    const B = pn.current, ce = zt.current;
    if (!B || !ce) return;
    const Re = () => Te({
      workspace: B.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), je = new ResizeObserver(Re);
    return je.observe(B), je.observe(ce), Re(), () => je.disconnect();
  }, [cn, Y.markerRailOpen]);
  const Ze = De(
    () => Ro(
      pr(
        Ue,
        gt,
        y,
        l && q,
        bt
      ),
      Ct,
      !0
    ),
    [
      Ue,
      gt,
      y,
      q,
      bt,
      l,
      Ct
    ]
  ), H = Object.fromEntries(Xe.map((B) => [B, Ze.filter((ce) => ce.reviewState === B).length])), Pe = Ro(
    pr(
      Ue,
      gt,
      { ...y, reviewStates: Xe },
      l && q,
      bt
    ),
    Ct,
    !0
  ), it = Object.fromEntries(Xe.map((B) => [B, Pe.filter((ce) => ce.reviewState === B).length])), st = [...new Set(Ue.map((B) => B.sourceKey).filter(Boolean))].sort((B, ce) => ft(B).localeCompare(ft(ce))), Yt = Pi(
    y,
    l && q
  ), _e = De(
    () => rn(Ze, bt, gt),
    [Ze, bt, gt]
  ), ue = g == null ? To(_e, s) : Bi(Ze, g), Ot = Vi(Ze, u), Fa = !l && Ot.length > 0 && Ot.every((B) => B.nativeSegmentId != null), jr = Ze.map((B) => B.id), Ba = jr.join("|");
  p.current = (ue == null ? void 0 : ue.id) ?? null;
  const Kr = Wt.get(ue == null ? void 0 : ue.id) || [], Ga = Or(Kr), Ur = De(
    () => Zs(_e, u),
    [_e, u]
  ), cr = De(() => Pr(_e), [_e]), xn = De(
    () => Js(cr, we),
    [cr, we]
  ), ja = De(
    () => $a(
      xn.rows,
      bn.scrollTop,
      bn.height
    ),
    [xn, bn]
  ), Ka = De(
    () => Xs(_e, we),
    [_e, we]
  ), Zt = ue ? ht(_e, ue.id) : null, ur = bt.length > 0 ? cr.map((B) => B.key) : [], Ua = ur.join("|"), jn = Math.max(
    0,
    Number((ro = Ge.videoFile) == null ? void 0 : ro.duration) || 0,
    ...Ue.map((B) => Number(B.endSec ?? B.startSec) || 0)
  ), zr = Number((oo = Ge.videoFile) == null ? void 0 : oo.duration) > 0 ? Number(Ge.videoFile.duration) : null;
  le.actions;
  const za = da();
  fe(() => {
    const B = Gi(Ue, Ze, g);
    B !== g && m(B);
  }, [Ue, Ze, g]), fe(() => {
    b((B) => {
      const ce = zi(
        B,
        jr,
        (ue == null ? void 0 : ue.id) ?? null
      );
      return ce.length === B.length && ce.every((Re, je) => Re === B[je]) ? B : ce;
    });
  }, [Ba, ue == null ? void 0 : ue.id]);
  const Qt = (ue == null ? void 0 : ue.itemId) == null ? null : ((ao = e.itemMetadata) == null ? void 0 : ao[ue.itemId]) || null, _a = {
    key: (ue == null ? void 0 : ue.itemId) != null ? `item:${ue.itemId}` : (ue == null ? void 0 : ue.nativeSegmentId) != null ? `native:${ue.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Qt == null ? void 0 : Qt.provenance) || (ue == null ? void 0 : ue.fieldProvenance) || [] : []
  }, mr = (ue == null ? void 0 : ue.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Qt == null ? void 0 : Qt.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  fe(() => {
    ae(ue == null ? "" : String(ue.startSec)), ke((ue == null ? void 0 : ue.endSec) == null ? "" : String(ue.endSec));
  }, [ue == null ? void 0 : ue.id, ue == null ? void 0 : ue.startSec, ue == null ? void 0 : ue.endSec]), fe(() => {
    Zt && Le((B) => Ma(B, Zt));
  }, [Ge.id, s, Zt]), fe(() => {
    xe((B) => rl(ur, B, Zt));
  }, [Ge.id, Ua, Zt]), fe(() => {
    if (!Y.markerRailOpen || (ue == null ? void 0 : ue.id) == null) return;
    const B = Ht.current, ce = xn.rows.find((nt) => nt.kind === "segment" && nt.segment.id === ue.id);
    if (!B || !ce) return;
    const Re = ce.top + ce.height;
    let je = B.scrollTop;
    ce.top < B.scrollTop ? je = ce.top : Re > B.scrollTop + B.clientHeight && (je = Math.max(0, Re - B.clientHeight)), je !== B.scrollTop && (B.scrollTop = je), qt({ scrollTop: je, height: B.clientHeight });
  }, [ue == null ? void 0 : ue.id, xn, Y.markerRailOpen]), fe(() => {
    const B = Ht.current;
    if (!Y.markerRailOpen || !B) return;
    const ce = () => qt({
      scrollTop: B.scrollTop,
      height: B.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ce();
      return;
    }
    const Re = new ResizeObserver(ce);
    return Re.observe(B), ce(), () => Re.disconnect();
  }, [Y.markerRailOpen]);
  const { revealSegmentGroupForSelection: _r, replaceSegmentSelection: Ha, selectSegment: Hr, selectSegmentCollection: qa, selectAllVideoSegments: Wa } = ad({
    allSwimlanes: _e,
    editorRef: at,
    performerSlots: gt,
    seekRef: Ut,
    segmentGroups: bt,
    segments: Ue,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setCollapsedSegmentGroups: Le,
    setEditorFilters: O,
    setHideDerivedSegments: A,
    setSaveMessage: R,
    setSelectedSegmentGroupKey: xe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: b
  }), { acceptHistory: gr, recordHistoryAction: Kn, mutateSegment: Va, completeReview: Ja, createSegment: qr, splitSegment: Wr, duplicateSegment: Vr, saveTiming: Ya, applyShortcutTiming: Za } = wl({
    compatibilityMode: l,
    currentTime: w,
    detail: e,
    editorFilters: y,
    endInput: ee,
    hideDerivedSegments: q,
    historyRef: oe,
    mediaDuration: zr,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingDuplicateRef: sr,
    pendingFirstSegmentStartSecRef: yn,
    pendingTagEditSegmentIdRef: _t,
    replaceSegmentSelection: Ha,
    savingSegmentId: G,
    segments: Ue,
    selectedSegment: ue,
    selectedSegmentIdRef: p,
    selectedSegments: Ot,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setEditorFilters: O,
    setFirstSegmentTagOpen: z,
    setHideDerivedSegments: A,
    setHistory: Ne,
    setHistoryOpen: U,
    setPublishApprovedError: _,
    setSaveMessage: R,
    setSavingSegmentId: Z,
    setSelectedSegmentGroupKey: xe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: b,
    startInput: F,
    timelineDuration: jn,
    video: Ge
  });
  function Jr(B = null) {
    var je;
    if (!l || G != null || !Ue.some((nt) => !nt.published && nt.reviewState === "approved")) return;
    const ce = ((je = at.current) == null ? void 0 : je.ownerDocument) ?? document, Re = ce.activeElement === ce.body ? null : ce.activeElement;
    me.current = B != null && B.isConnected && B !== ce.body ? B : Re, _(""), te(!0);
  }
  function Yr() {
    G == null && (te(!1), _(""), requestAnimationFrame(() => {
      ud(
        me.current,
        at.current
      ), me.current = null;
    }));
  }
  async function Qa() {
    await Ja() && Yr();
  }
  const { closeMergeConfirmation: Xa, mergeSelectedSwimlane: Zr, saveSelectedReviewState: ei } = id({
    acceptHistory: gr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: S,
    historyRef: oe,
    mergeSavingRef: se,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: Kn,
    revealSegmentGroupForSelection: _r,
    reviewSavingRef: ge,
    savingSegmentId: G,
    selectedGroups: Ur,
    selectedSegment: ue,
    selectedSegmentIdRef: p,
    selectedSegments: Ot,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setMergeConfirmation: ie,
    setSaveMessage: R,
    setSavingSegmentId: Z,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: b,
    video: Ge
  }), { toggleIncorrectExample: ti, removeIncorrectExample: ni, captureTrainingExport: ri, deleteRejectedSegments: oi, autoAssignPerformers: ai, previewDerivedSegments: ii, closeMaterializeDialog: si, materializeDerivedSegments: li, saveTag: di, moveToBin: ci, emptyRecyclingBin: ui } = sd({
    acceptHistory: gr,
    allSwimlanes: _e,
    autoAssignCandidates: Gn,
    autoAssigning: Ie,
    binEmptyingRef: ye,
    canMoveSelectionToBin: Fa,
    closeTagEditing: Vt,
    compatibilityMode: l,
    detail: e,
    editorRef: at,
    exportingExamples: Dn,
    incorrectExamples: Ct,
    lineage: mr,
    materializeButtonRef: ln,
    materializePreview: Rt,
    materializeRestoreFocusRef: dn,
    materializing: jt,
    mutateSegment: Va,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: Kn,
    refreshMaterializationPreview: Fn,
    removingExampleId: On,
    revealSegmentGroupForSelection: _r,
    savingSegmentId: G,
    segments: Ue,
    selectedSegment: ue,
    selectedSegmentIdRef: p,
    selectedSegments: Ot,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: f,
    setAutoAssignError: tt,
    setAutoAssignOpen: Je,
    setAutoAssigning: $e,
    setExportingExamples: or,
    setIncorrectExamples: Kt,
    setMaterializeError: mt,
    setMaterializeLoading: ut,
    setMaterializeOpen: xt,
    setMaterializePreview: Et,
    setMaterializing: rr,
    setRemovingExampleId: ar,
    setSaveMessage: R,
    setSavingSegmentId: Z,
    setSelectedSegmentGroupKey: xe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: b,
    video: Ge
  }), { restoreHistoryTarget: mi, updateTimelineRatio: Qr, handleSeparatorPointerDown: gi, handleSeparatorPointerMove: pi, handleSeparatorKeyDown: fi, panelWidthMaximum: Xr, panelSeparatorProps: yi, toggleSegmentRail: bi, toggleSegmentGroup: eo, mutateShotBoundary: hi } = ld({
    acceptHistory: gr,
    compatibilityMode: l,
    currentTime: w,
    detail: e,
    editorLayout: Y,
    focusRowRef: zt,
    history: le,
    historyRef: oe,
    historySaving: I,
    horizontalLayoutSize: de,
    mediaStackHeight: X,
    mediaStackRef: gn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: Pn,
    recordHistoryAction: Kn,
    savingSegmentId: G,
    savingShot: P,
    savingShotRef: lr,
    setCollapsedSegmentGroups: Le,
    setEditorLayout: j,
    setHistorySaving: N,
    setSaveMessage: R,
    setSavingSegmentId: Z,
    setSavingShot: L,
    shotBoundaries: hn,
    timelineDuration: jn,
    video: Ge,
    workspaceRef: pn
  }), { executeShortcutById: vi } = dd({
    allSwimlanes: _e,
    applyShortcutTiming: Za,
    centerTimelineRef: mn,
    compatibilityMode: l,
    createSegment: qr,
    currentTime: w,
    deleteRejectedSegments: oi,
    duplicateSegment: Vr,
    editorLayout: Y,
    editorRef: at,
    emptyRecyclingBin: ui,
    lineage: mr,
    mediaDuration: zr,
    mergeSelectedSwimlane: Zr,
    moveToBin: ci,
    mutateShotBoundary: hi,
    openPublishApprovedDialog: Jr,
    playbackControlsRef: un,
    playbackShortcutConfig: za,
    saveSelectedReviewState: ei,
    seekRef: Ut,
    segmentGroupKeys: ur,
    selectSegment: Hr,
    selectedSegment: ue,
    selectedSegmentGroupForSegment: Zt,
    selectedSegmentGroupKey: Fe,
    selectedSegments: Ot,
    setCollapsedSegmentGroups: Le,
    setIncorrectExamplesOpen: Ee,
    setQuickSearchOpen: ot,
    setSaveMessage: R,
    setSelectedSegmentGroupKey: xe,
    setTagEditing: v,
    setTimelineZoom: K,
    shotBoundaries: hn,
    slotButtonRef: yt,
    splitSegment: Wr,
    swimlanes: Ka,
    timelineDuration: jn,
    toggleIncorrectExample: ti,
    toggleSegmentGroup: eo,
    updateTimelineRatio: Qr,
    videoFrameRate: vn,
    visibleSegments: Ze
  });
  Dt.current = vi;
  const xi = De(() => Tn.map((B) => ({
    id: B.id,
    enabled: tn(B, l),
    surface: "local",
    action: (ce) => {
      var Re;
      return (Re = Dt.current) == null ? void 0 : Re.call(Dt, B.id, ce);
    }
  })), [l]);
  qo(Ar, xi);
  const Si = Lr(X), ki = Lt(Y.markerRailWidth, Xr("markerRailWidth")), wi = Lt(Y.detailWidth, Xr("detailWidth"));
  return n(od, {
    activeFilterCount: Yt,
    allSwimlanes: _e,
    analysisError: Ye,
    analysisRun: qe,
    analysisStatus: vt,
    approvalFacetCounts: it,
    autoAssignCandidates: Gn,
    autoAssignError: Be,
    autoAssignOpen: He,
    autoAssignPerformers: ai,
    autoAssigning: Ie,
    captureTrainingExport: ri,
    removeIncorrectExample: ni,
    centerTimelineRef: mn,
    closeEditorFilters: Jt,
    closeFirstSegmentTagDialog: dr,
    closeMaterializeDialog: si,
    closeMergeConfirmation: Xa,
    closePublishApprovedDialog: Yr,
    closeTagEditing: Vt,
    collapsedSegmentGroups: we,
    compatibilityMode: l,
    configuringTag: sn,
    createSegment: qr,
    currentTime: w,
    detail: e,
    detailPanelRef: S,
    detailWidth: wi,
    duplicateSegment: Vr,
    editorFilters: y,
    editorLayout: Y,
    editorRef: at,
    exportingExamples: Dn,
    filtersButtonRef: fn,
    filtersOpen: V,
    firstSegmentTagOpen: k,
    focusRowRef: zt,
    handleSeparatorKeyDown: fi,
    handleSeparatorPointerDown: gi,
    handleSeparatorPointerMove: pi,
    hideDerivedSegments: q,
    history: le,
    historyOpen: x,
    historySaving: I,
    horizontalLayoutSize: de,
    importNativeSegments: It,
    incorrectExamples: Ct,
    incorrectExamplesOpen: he,
    removingExampleId: On,
    lineage: mr,
    markerRailWidth: ki,
    materializeButtonRef: ln,
    materializeCancelButtonRef: En,
    materializeDerivedSegments: li,
    materializeError: an,
    materializeLoading: on,
    materializeOpen: Mt,
    materializePreview: Rt,
    materializing: jt,
    mediaStackRef: gn,
    mergeCancelButtonRef: ve,
    mergeConfirmation: ne,
    mergeSavingRef: se,
    mergeSelectedSwimlane: Zr,
    nativeImportState: Mn,
    onNavigate: c,
    openPublishApprovedDialog: Jr,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: yi,
    pendingInitialSeekRef: ir,
    performerSlots: gt,
    performerSlotsAvailable: Bn,
    playbackControlsRef: un,
    previewDerivedSegments: ii,
    provenance: _a,
    provenanceSources: st,
    publishApprovedCancelButtonRef: be,
    publishApprovedDrafts: Qa,
    publishApprovedError: E,
    publishApprovedOpen: W,
    quickSearchOpen: Ve,
    railScrollRef: Ht,
    railToggleRef: Pn,
    recordHistoryAction: Kn,
    restoreHistoryTarget: mi,
    saveMessage: T,
    saveTag: di,
    saveTiming: Ya,
    savingSegmentId: G,
    seekRef: Ut,
    segmentGroups: bt,
    segmentRailLayout: xn,
    segments: Ue,
    selectAllVideoSegments: Wa,
    selectSegment: Hr,
    selectSegmentCollection: qa,
    selectedGroups: Ur,
    selectedPerformerSlots: Kr,
    selectedSegment: ue,
    selectedSegmentGroupKey: Fe,
    selectedSegmentIds: u,
    selectedSegments: Ot,
    selectedSlotStatus: Ga,
    setAutoAssignError: tt,
    setAutoAssignOpen: Je,
    setConfiguringTag: Rn,
    setCurrentTime: $,
    setEditorFilters: O,
    setEditorLayout: j,
    setFiltersOpen: C,
    setHideDerivedSegments: A,
    setHistoryOpen: U,
    setIncorrectExamplesOpen: Ee,
    setQuickSearchOpen: ot,
    setRailViewport: qt,
    setSelectedSegmentGroupKey: xe,
    setSelectedSegmentId: m,
    setShortcutsOpen: Oe,
    setTimelineZoom: K,
    shotBoundaries: hn,
    shortcutsOpen: Ce,
    slotButtonRef: yt,
    splitLayout: a,
    splitSegment: Wr,
    startFullAnalysis: tr,
    tagEditing: M,
    tagSearchRef: Ln,
    timelineDuration: jn,
    timelineRatioBounds: Si,
    timelineZoom: J,
    toggleSegmentGroup: eo,
    toggleSegmentRail: bi,
    updateTimelineRatio: Qr,
    video: Ge,
    videoPerformers: St,
    visibleCounts: H,
    visibleSegmentRailRows: ja,
    visibleSegments: Ze,
    wideLayout: cn,
    workspaceRef: pn
  });
}
function gd(e = [], t = []) {
  const r = new Map((t || []).map((s) => [
    Number(s.tagId),
    {
      ...s,
      tagId: Number(s.tagId),
      definitions: [...s.definitions || []].sort((l, d) => (l.sortOrder ?? 0) - (d.sortOrder ?? 0) || String(l.id).localeCompare(String(d.id)))
    }
  ])), o = /* @__PURE__ */ new Set(), i = [...e || []].sort((s, l) => (s.sortOrder ?? 0) - (l.sortOrder ?? 0) || Number(s.id) - Number(l.id)).map((s) => ({
    ...s,
    overviewKey: `group:${s.id}`,
    tags: [...s.tags || []].sort((l, d) => (l.sortOrder ?? 0) - (d.sortOrder ?? 0) || Number(l.tagId) - Number(d.tagId)).map((l) => {
      const d = Number(l.tagId);
      o.add(d);
      const c = r.get(d);
      return {
        ...l,
        tagId: d,
        tagName: l.tagName || (c == null ? void 0 : c.tagName) || `Tag ${d}`,
        allowSamePerformerInMultipleSlots: !!(c != null && c.allowSamePerformerInMultipleSlots),
        definitions: (c == null ? void 0 : c.definitions) || []
      };
    })
  })), a = [...r.values()].filter((s) => !o.has(s.tagId) && s.definitions.length > 0).map((s) => ({
    tagId: s.tagId,
    tagName: s.tagName || `Tag ${s.tagId}`,
    sortOrder: 0,
    allowSamePerformerInMultipleSlots: !!s.allowSamePerformerInMultipleSlots,
    definitions: s.definitions
  })).sort((s, l) => String(s.tagName).localeCompare(String(l.tagName), void 0, {
    numeric: !0,
    sensitivity: "base"
  }) || s.tagId - l.tagId);
  return a.length > 0 && i.push({
    id: "ungrouped",
    overviewKey: "ungrouped",
    name: "Ungrouped",
    sortOrder: i.length,
    synthetic: !0,
    tags: a
  }), i;
}
function pd(e = [], t = "", r = "all") {
  const o = String(t || "").trim().toLocaleLowerCase();
  return e.map((i) => ({
    ...i,
    tags: (i.tags || []).filter((a) => {
      const s = (a.definitions || []).length > 0;
      return r === "with" && !s || r === "without" && s ? !1 : o ? [
        a.tagName,
        ...(a.definitions || []).map((l) => l.label)
      ].some((l) => String(l || "").toLocaleLowerCase().includes(o)) : !0;
    })
  })).filter((i) => i.tags.length > 0);
}
function Qe(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function fd(e = [], t = []) {
  var b;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, h) => (p.sortOrder ?? 0) - (h.sortOrder ?? 0) || Number(p.id) - Number(h.id)).forEach((p, h) => {
    [...p.tags || []].sort((f, S) => (f.sortOrder ?? 0) - (S.sortOrder ?? 0) || Number(f.tagId) - Number(S.tagId)).forEach((f, S) => r.set(Number(f.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? h,
      tagSortOrder: f.sortOrder ?? S
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, h) {
    const f = Number(p);
    if (!o.has(f)) {
      const S = r.get(f);
      o.set(f, {
        tagId: f,
        name: h || `Tag ${f}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (S == null ? void 0 : S.key) || "ungrouped",
        segmentGroupId: (S == null ? void 0 : S.id) ?? null,
        segmentGroupName: (S == null ? void 0 : S.name) || "Ungrouped",
        segmentGroupSortOrder: (S == null ? void 0 : S.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (S == null ? void 0 : S.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(f);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const h = i(p.sourceTagId, p.sourceTagName), f = i(p.derivedTagId, p.derivedTagName);
    h.outgoingRuleCount++, f.incomingRuleCount++;
    const S = `${h.tagId}:${f.tagId}`;
    a.has(S) || a.set(S, {
      id: S,
      sourceTagId: h.tagId,
      derivedTagId: f.tagId,
      rules: [],
      edgeCount: 0
    });
    const y = a.get(S);
    y.rules.push(p), y.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var h, f;
    (h = d.get(p.sourceTagId)) == null || h.add(p.derivedTagId), (f = d.get(p.derivedTagId)) == null || f.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const h = [p.tagId], f = [];
    for (c.add(p.tagId); h.length > 0; ) {
      const A = h.shift();
      f.push(A);
      for (const w of d.get(A) || [])
        c.has(w) || (c.add(w), h.push(w));
    }
    const S = new Set(f), y = f.map((A) => o.get(A)), O = l.filter((A) => S.has(A.sourceTagId) && S.has(A.derivedTagId)), V = O.flatMap((A) => A.rules), C = y.filter((A) => A.outgoingRuleCount === 0).sort((A, w) => Qe(A.name, w.name)), q = C.length > 0 ? C : [...y].sort((A, w) => Qe(A.name, w.name));
    g.push({
      id: [...f].sort((A, w) => A - w).join(":"),
      label: q.length > 1 ? `${q[0].name} + ${q.length - 1}` : ((b = q[0]) == null ? void 0 : b.name) || "Derivation component",
      nodes: y,
      connections: O,
      rules: V,
      segmentGroupKeys: [...new Set(y.map((A) => A.segmentGroupKey))],
      materializedEdgeCount: V.reduce(
        (A, w) => A + (Number(w.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, h) => h.rules.length - p.rules.length || Qe(p.label, h.label));
  const m = /* @__PURE__ */ new Map();
  s.forEach((p) => {
    m.has(p.segmentGroupKey) || m.set(p.segmentGroupKey, {
      key: p.segmentGroupKey,
      id: p.segmentGroupId,
      name: p.segmentGroupName,
      sortOrder: p.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), m.get(p.segmentGroupKey).nodes.push(p);
  }), g.forEach((p) => {
    p.nodes.forEach((h) => {
      var f;
      return (f = m.get(h.segmentGroupKey)) == null ? void 0 : f.componentIds.add(p.id);
    }), p.rules.forEach((h) => {
      var f, S;
      (f = m.get(o.get(Number(h.sourceTagId)).segmentGroupKey)) == null || f.ruleIds.add(h.id), (S = m.get(o.get(Number(h.derivedTagId)).segmentGroupKey)) == null || S.ruleIds.add(h.id);
    });
  });
  const u = [...m.values()].sort((p, h) => p.sortOrder - h.sortOrder || Qe(p.name, h.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: u
  };
}
function yd(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map(($) => [$.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map(($) => [$.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach(($) => {
    var G, Z;
    (G = g.get($.sourceTagId)) == null || G.add($.derivedTagId), (Z = m.get($.derivedTagId)) == null || Z.add($.sourceTagId);
  });
  const u = new Map(e.nodes.map(($) => {
    var G;
    return [
      $.tagId,
      ((G = m.get($.tagId)) == null ? void 0 : G.size) || 0
    ];
  })), b = new Map(e.nodes.map(($) => [$.tagId, 0])), p = e.nodes.filter(($) => u.get($.tagId) === 0).sort(($, G) => Qe($.name, G.name)).map(($) => $.tagId), h = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const $ = p.shift();
    if (!h.has($)) {
      h.add($);
      for (const G of g.get($) || [])
        b.set(G, Math.max(b.get(G) || 0, (b.get($) || 0) + 1)), u.set(G, u.get(G) - 1), u.get(G) === 0 && p.push(G);
    }
  }
  h.size !== e.nodes.length && e.nodes.filter(($) => !h.has($.tagId)).sort(($, G) => Qe($.name, G.name)).forEach(($) => b.set($.tagId, 0));
  const f = Math.max(0, ...b.values()), S = Math.max(
    t,
    240 + f * 296
  ), y = /* @__PURE__ */ new Map();
  e.nodes.forEach(($) => {
    y.has($.segmentGroupKey) || y.set($.segmentGroupKey, {
      key: $.segmentGroupKey,
      id: $.segmentGroupId,
      name: $.segmentGroupName,
      sortOrder: $.segmentGroupSortOrder,
      nodes: []
    }), y.get($.segmentGroupKey).nodes.push($);
  });
  const O = [...y.values()].sort(($, G) => $.sortOrder - G.sortOrder || Qe($.name, G.name));
  let V = 28;
  const C = [], q = O.map(($) => {
    const G = /* @__PURE__ */ new Map();
    $.nodes.forEach((R) => {
      const F = b.get(R.tagId) || 0;
      G.has(F) || G.set(F, []), G.get(F).push(R);
    });
    for (const R of G.values())
      R.sort((F, ae) => F.segmentGroupTagSortOrder - ae.segmentGroupTagSortOrder || Qe(F.name, ae.name));
    const Z = Math.max(1, ...[...G.values()].map((R) => R.length)), P = Z * 58 + (Z - 1) * 18, L = 70 + P, T = {
      ...$,
      x: 12,
      y: V,
      width: S - 24,
      height: L
    };
    for (const [R, F] of G.entries()) {
      const ae = F.length * 58 + Math.max(0, F.length - 1) * 18, ee = (P - ae) / 2;
      F.forEach((ke, J) => C.push({
        ...ke,
        rank: R,
        x: 28 + R * 296,
        y: V + 34 + 18 + ee + J * 76,
        width: 184,
        height: 58
      }));
    }
    return V += L + 16, T;
  }), A = new Map(C.map(($) => [$.tagId, $])), w = e.connections.map(($) => {
    const G = A.get($.sourceTagId), Z = A.get($.derivedTagId), P = G.x + G.width, L = G.y + G.height / 2, T = Z.x, R = Z.y + Z.height / 2, F = Math.max(48, (T - P) * 0.48);
    return {
      ...$,
      path: `M ${P} ${L} C ${P + F} ${L}, ${T - F} ${R}, ${T} ${R}`
    };
  });
  return {
    width: S,
    height: Math.max(r, V - 16 + 28),
    nodes: C,
    connections: w,
    groups: q
  };
}
function bd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = yd(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, m = o, u = c.nodes.map((p) => ({
      ...p,
      x: p.x + g,
      y: p.y + m
    })), b = new Map(u.map((p) => [p.tagId, p]));
    a.push(...u), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + g,
      y: p.y + m
    }))), s.push(...c.connections.map((p) => {
      const h = b.get(p.sourceTagId), f = b.get(p.derivedTagId), S = h.x + h.width, y = h.y + h.height / 2, O = f.x, V = f.y + f.height / 2, C = Math.max(48, (O - S) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${S} ${y} C ${S + C} ${y}, ${O - C} ${V}, ${O} ${V}`
      };
    })), i = Math.max(i, c.width), o += c.height + 32;
  }), {
    width: Math.max(720, i + 40),
    height: Math.max(420, o - 32 + 20),
    nodes: a,
    connections: s,
    groups: l
  };
}
function Go(e, t = []) {
  if (!(e != null && e.sourceTagId) || !(e != null && e.derivedTagId)) return null;
  const r = Number(e.sourceTagId), o = Number(e.derivedTagId);
  if (r === o)
    return {
      code: "LINEAGE_CYCLE",
      message: "A tag cannot derive itself because that would create a cycle."
    };
  const i = t.filter((d) => d.id !== e.ruleId);
  if (i.some((d) => Number(d.sourceTagId) === r && Number(d.derivedTagId) === o))
    return {
      code: "LINEAGE_RULE_DUPLICATE",
      message: "A rule already maps this source tag to this derived tag."
    };
  const a = /* @__PURE__ */ new Map();
  i.forEach((d) => {
    const c = Number(d.sourceTagId);
    a.has(c) || a.set(c, /* @__PURE__ */ new Set()), a.get(c).add(Number(d.derivedTagId));
  });
  const s = [o], l = /* @__PURE__ */ new Set();
  for (; s.length > 0; ) {
    const d = s.shift();
    if (!l.has(d)) {
      if (l.add(d), d === r)
        return {
          code: "LINEAGE_CYCLE",
          message: "This relationship would create a derivation cycle."
        };
      for (const c of a.get(d) || []) s.push(c);
    }
  }
  return null;
}
function hd(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function vd(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: b, layout: p, listSort: h, materializationOffer: f, materializeOutgoingRules: S, materializeRule: y, message: O, normalizedQuery: V, query: C, refreshConfiguredTag: q, revealEditor: A, rules: w, save: $, segmentGroupKey: G, selectedNode: Z, selectedRule: P, selection: L, setConfiguringTag: T, setDraft: R, setListSort: F, setMaterializationOffer: ae, setQuery: ee, setSegmentGroupKey: ke, setSelection: J, setView: K, sortedVisibleRules: Y, sourceSlots: j, sourceSlotsLoading: X, updateMapping: re, updateTag: de, view: Te, visibleComponents: le, visibleRules: Ne } = e;
  function oe(M) {
    const v = b.nodes.find((z) => z.tagId === Number(M.sourceTagId)), k = b.nodes.find((z) => z.tagId === Number(M.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function x() {
    return n("div", { key: "editor", ref: m, className: "space-y-4 p-4" }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2" }, [
        n("div", { key: "copy" }, [
          n(
            "h3",
            { key: "title", className: "font-semibold text-foreground" },
            d.ruleId == null ? "Add derivation rule" : "Edit derivation rule"
          ),
          n(
            "p",
            { key: "description", className: "mt-1 text-xs text-secondary" },
            "Connect a specific tag to a more general tag."
          )
        ]),
        n("button", {
          key: "close",
          type: "button",
          disabled: r,
          onClick: () => R(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Nn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (M, v) => de("source", M, v == null ? void 0 : v.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !X && j.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (M) => T({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: M.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Nn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (M, v) => de("derived", M, v == null ? void 0 : v.label),
              disabled: r,
              placeholder: "Find a derived tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.derivedTagId && !l && s.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (M) => T({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: M.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure derived tag")
          ]) : null
        ])
      ]),
      c ? n("p", {
        key: "integrity",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-200"
      }, c.message) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("div", { key: "heading", className: "flex items-center justify-between gap-2" }, [
          n("h3", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
          n("button", {
            key: "add",
            type: "button",
            disabled: r || j.length === 0 || s.length === 0,
            onClick: () => R((M) => ({
              ...M,
              slotMappings: [...M.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
            })),
            className: o
          }, "Add mapping")
        ]),
        d.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots will be copied.") : n("div", { key: "configured", className: "space-y-2" }, [
          d.slotMappingsSuggested ? n(
            "p",
            { key: "suggested", className: "text-xs text-secondary" },
            "Matching performer slots were suggested automatically."
          ) : null,
          ...d.slotMappings.map((M, v) => n("div", { key: v, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: M.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => re(v, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...j.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: M.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => re(v, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => R((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((z, se) => se !== v)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${v + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((M) => !M.sourceSlotDefinitionId || !M.derivedSlotDefinitionId),
          onClick: $,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => R(null), className: o }, "Cancel")
      ])
    ]);
  }
  function U() {
    if (Z) {
      const k = Ne.filter((ne) => Number(ne.derivedTagId) === Z.tagId), z = Ne.filter((ne) => Number(ne.sourceTagId) === Z.tagId), se = (ne, ie, ve) => n("div", {
        key: ne.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, ie),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ne.sourceTagName} → ${ne.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ve ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => y(ne),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(ne, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(ne),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, Z.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, Z.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${Z.incomingRuleCount} incoming · ${Z.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ne) => T({
            tagId: Z.tagId,
            tagName: Z.name,
            trigger: ne.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        z.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => S(Z, z),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${z.length})`) : null,
        z.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...z.map((ne) => se(ne, "Derives", !0))
        ]) : null,
        k.length ? n("details", {
          key: "incoming",
          className: "group rounded-md border border-border bg-card/40"
        }, [
          n("summary", {
            key: "summary",
            className: "flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-secondary hover:text-foreground"
          }, [
            n("span", { key: "title" }, "Incoming rules"),
            n(
              "span",
              { key: "count", className: "rounded-full border border-border px-2 py-0.5 font-medium normal-case tracking-normal" },
              k.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            k.map((ne) => se(ne, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!P)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const M = b.nodes.find((k) => k.tagId === Number(P.sourceTagId)), v = b.nodes.find((k) => k.tagId === Number(P.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (M == null ? void 0 : M.segmentGroupName) || "Ungrouped"),
          (M == null ? void 0 : M.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${P.sourceTagName} → ${P.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${P.edgeCount} materialized lineage edge${P.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (f == null ? void 0 : f.ruleId) === P.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${f.createCount + f.linkCount} pending derivation${f.createCount + f.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${f.createCount} new segments · ${f.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => y(P, f),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => ae(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        P.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : P.slotMappings.map((k, z) => n("div", {
          key: `${k.sourceSlotDefinitionId}:${k.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: k.sourceSlotLabel || "Unnamed slot" },
            k.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: k.derivedSlotLabel || "Unnamed slot" },
            k.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          P.createdAt ? new Date(P.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          P.updatedAt ? new Date(P.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => y(P),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(P),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(P),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function I() {
    if (le.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, V ? "No derivation relationships match your search." : "No derivation rules.");
    const M = Z == null ? void 0 : Z.tagId, v = /* @__PURE__ */ new Set();
    return Z && (v.add(Z.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === Z.tagId || k.derivedTagId === Z.tagId) && (v.add(k.sourceTagId), v.add(k.derivedTagId));
    })), n("div", {
      className: "min-h-[26rem] overflow-auto",
      style: {
        backgroundImage: "radial-gradient(circle at center, var(--color-border) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        maxHeight: "42rem"
      }
    }, [
      n("div", { key: "direction", className: "sticky left-0 top-0 z-30 flex min-w-[42rem] items-center gap-3 border-b border-border bg-surface/95 px-4 py-2 text-xs font-medium text-secondary backdrop-blur" }, [
        n("span", { key: "specific" }, "Specific"),
        n("span", { key: "line", className: "h-px flex-1 bg-border" }),
        n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
        n("span", { key: "general" }, "General")
      ]),
      n("div", {
        key: "canvas",
        className: "relative",
        style: { width: `${p.width}px`, height: `${p.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...p.groups.map((k) => n("div", {
          key: `group:${k.componentId}:${k.key}`,
          className: `absolute rounded-xl border ${G === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${k.x}px`,
            top: `${k.y}px`,
            width: `${k.width}px`,
            height: `${k.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: k.name
        }, k.name))),
        n("svg", {
          key: "edges",
          className: "pointer-events-none absolute inset-0 overflow-visible",
          width: p.width,
          height: p.height,
          "aria-hidden": "true"
        }, [
          n("defs", { key: "defs" }, n("marker", {
            id: t,
            viewBox: "0 0 10 10",
            refX: "9",
            refY: "5",
            markerWidth: "7",
            markerHeight: "7",
            orient: "auto-start-reverse"
          }, n("path", { d: "M 0 0 L 10 5 L 0 10 z", fill: "context-stroke" }))),
          ...p.connections.map((k) => {
            const z = M === k.sourceTagId || M === k.derivedTagId, se = Z != null, ne = z ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: ne,
              strokeWidth: z ? 2.5 : 1.5,
              opacity: se && !z ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const z = !V || k.name.toLocaleLowerCase().includes(V), se = Z != null, ne = v.has(k.tagId), ie = (Z == null ? void 0 : Z.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => J({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${ie ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ne ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !z || se && !ne ? 0.62 : 1
            },
            title: `${k.name} — ${k.segmentGroupName}`,
            "aria-label": `${k.name}, ${k.incomingRuleCount} incoming and ${k.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, k.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${k.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${k.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((k) => k.rules.length > 1).map((k) => {
          const z = p.nodes.find((ne) => ne.tagId === k.sourceTagId), se = p.nodes.find((ne) => ne.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(z.x + z.width + se.x) / 2 - 24}px`,
              top: `${(z.y + z.height / 2 + se.y + se.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function N() {
    if (le.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        V ? "No derivation relationships match your search." : "No derivation rules."
      );
    const M = /* @__PURE__ */ new Map();
    Y.forEach((k) => {
      const z = oe(k);
      M.has(z) || M.set(z, []), M.get(z).push(k);
    });
    const v = [
      ...b.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => M.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((k) => {
      const z = b.segmentGroups.find((ie) => ie.key === k), se = k === "cross-group" ? "Cross-group relationships" : (z == null ? void 0 : z.name) || "Ungrouped", ne = M.get(k);
      return n("section", { key: k, "aria-label": se }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, se),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ne.length} rule${ne.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${se} derivation rules` }, [
          n("div", {
            key: "header",
            role: "row",
            className: "grid gap-3 border-b border-border px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-secondary",
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n("span", { key: "relationship", role: "columnheader" }, "Relationship"),
            n("span", { key: "mappings", role: "columnheader" }, "Slot mappings"),
            n("span", { key: "materialized", role: "columnheader", className: "text-right" }, "Materialized")
          ]),
          ...ne.map((ie) => n("button", {
            key: ie.id,
            type: "button",
            role: "row",
            onClick: () => J({ type: "rule", id: ie.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(P == null ? void 0 : P.id) === ie.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${ie.sourceTagName} → ${ie.derivedTagName}` },
              `${ie.sourceTagName} → ${ie.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(ie.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(ie.edgeCount))
          ]))
        ])
      ]);
    }));
  }
  return n("section", {
    className: "overflow-hidden rounded-xl border border-border bg-surface",
    "aria-label": "Derived segment rules"
  }, [
    n("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3 border-b border-border p-4" }, [
      n("div", { key: "copy" }, [
        n("h2", { key: "title", className: "text-xl font-semibold text-foreground" }, "Derivation rules"),
        n(
          "p",
          { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" },
          "Map how more specific segments are materialized as more general, derived segments."
        ),
        n(
          "p",
          { key: "summary", className: "mt-2 text-xs text-secondary" },
          `${w.length} rules · ${b.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          R(u()), J(null), A();
        },
        className: "rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
      }, "Add rule")
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 border-b border-border bg-card/40 p-3" }, [
      n("label", { key: "search", className: "min-w-[13rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: C,
          onChange: (M) => {
            ee(M.target.value), J(null);
          },
          placeholder: "Find a tag or relationship…",
          "aria-label": "Search derivation rules",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
        })
      ]),
      n("label", { key: "group", className: "min-w-[12rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Segment group"),
        n("select", {
          key: "select",
          value: G,
          disabled: d != null,
          onChange: (M) => {
            ke(M.target.value), J(null), R(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...b.segmentGroups.map((M) => n("option", { key: M.key, value: M.key }, M.name))
        ])
      ]),
      Te === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: h,
          onChange: (M) => F(M.target.value),
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
        }, [
          n("option", { key: "relationship", value: "relationship" }, "Relationship"),
          n("option", { key: "source", value: "source" }, "Source tag"),
          n("option", { key: "target", value: "target" }, "Derived tag"),
          n("option", { key: "materialized", value: "materialized" }, "Most materialized")
        ])
      ]) : null,
      n(
        "div",
        { key: "view", className: "ml-auto inline-flex rounded-md border border-border bg-surface p-0.5", "aria-label": "Derivation rule view" },
        [
          ["graph", "Graph"],
          ["list", "List"]
        ].map(([M, v]) => n("button", {
          key: M,
          type: "button",
          onClick: () => {
            K(M), M === "graph" && (L == null ? void 0 : L.type) === "rule" && J(null);
          },
          "aria-pressed": Te === M,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Te === M ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, v))
      )
    ]),
    n("div", {
      key: "workspace-scroll",
      className: "overflow-x-auto"
    }, n("div", {
      key: "workspace",
      className: "grid",
      style: {
        gridTemplateColumns: "minmax(38rem, 1fr) 22rem",
        minWidth: "60rem"
      }
    }, [
      n(
        "div",
        { key: "visualization", className: "min-w-0 border-r border-border" },
        Te === "graph" ? I() : N()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? x() : U()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      O ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, O) : null
    ]),
    i ? n(Gr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => q(i),
      onClose: () => {
        const M = i.trigger;
        T(null), requestAnimationFrame(() => {
          M != null && M.isConnected && M.focus();
        });
      }
    }) : null
  ]);
}
function xd({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = D([]), [a, s] = D(null), [l, d] = D([]), [c, g] = D([]), [m, u] = D(!1), [b, p] = D(!1), [h, f] = D(!1), [S, y] = D(""), [O, V] = D(""), [C, q] = D("graph"), [A, w] = D("all"), [$, G] = D(null), [Z, P] = D("relationship"), [L, T] = D(null), [R, F] = D(null), ae = pe(null), ee = pe(null), ke = fa().replace(/:/g, "");
  function J() {
    requestAnimationFrame(() => {
      var W;
      return (W = ae.current) == null ? void 0 : W.scrollIntoView({ block: "nearest" });
    });
  }
  async function K(W) {
    const te = await Q("/derivation-rules", W ? { signal: W } : void 0);
    i(te || []);
  }
  fe(() => {
    const W = new AbortController();
    return K(W.signal).catch((te) => {
      te.name !== "AbortError" && y(te.message || "Unable to load derived segment rules.");
    }), () => W.abort();
  }, []), fe(() => {
    const W = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), Q(`/slot-definitions/${a.sourceTagId}`, { signal: W.signal }).then((te) => d(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && d([]);
    }).finally(() => {
      W.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (p(!0), Q(`/slot-definitions/${a.derivedTagId}`, { signal: W.signal }).then((te) => g(te.definitions || [])).catch((te) => {
      te.name !== "AbortError" && g([]);
    }).finally(() => {
      W.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => W.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), fe(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || b)
      return;
    const W = `${a.sourceTagId}:${a.derivedTagId}`;
    ee.current !== W && (ee.current = W, s((te) => !te || Number(te.sourceTagId) !== Number(a.sourceTagId) || Number(te.derivedTagId) !== Number(a.derivedTagId) ? te : _s(te, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    b
  ]);
  function Y(W, te = !1) {
    te || G({ type: "rule", id: W.id }), ee.current = null, s({
      ruleId: W.id,
      sourceTagId: W.sourceTagId,
      sourceTagName: W.sourceTagName,
      derivedTagId: W.derivedTagId,
      derivedTagName: W.derivedTagName,
      slotMappings: W.slotMappings.map((E) => ({
        sourceSlotDefinitionId: E.sourceSlotDefinitionId,
        derivedSlotDefinitionId: E.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), y(""), J();
  }
  function j(W, te, E = "") {
    ee.current = null, W === "source" ? (d([]), u(te != null)) : (g([]), p(te != null)), s((_) => ({
      ..._,
      [`${W}TagId`]: te == null ? null : Number(te),
      [`${W}TagName`]: E || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function X(W) {
    (a == null ? void 0 : a.ruleId) == null && (ee.current = null);
    const te = [K(), t == null ? void 0 : t()];
    return W.draftKind === "source" ? (u(!0), te.push(Q(`/slot-definitions/${W.tagId}`).then((E) => d(E.definitions || [])).finally(() => u(!1)))) : W.draftKind === "derived" && (p(!0), te.push(Q(`/slot-definitions/${W.tagId}`).then((E) => g(E.definitions || [])).finally(() => p(!1)))), Promise.all(te);
  }
  function re(W, te, E) {
    s((_) => ({
      ..._,
      slotMappings: _.slotMappings.map((be, me) => me === W ? { ...be, [te]: E } : be)
    }));
  }
  async function de() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const W = Go(a, o);
    if (W) {
      y(W.message);
      return;
    }
    if (a.slotMappings.some((te) => !te.sourceSlotDefinitionId || !te.derivedSlotDefinitionId)) {
      y("Complete or remove every performer slot mapping before saving.");
      return;
    }
    f(!0), y(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let te = null;
      if (a.ruleId != null) {
        const _ = await Q(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${_.deletedSegmentCount}
Removed lineage edges: ${_.removedEdgeCount}
Shared derived segments retained: ${_.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        te = _.fingerprint;
      }
      y("Saving derived segment rule…");
      const E = await Q("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: te
        })
      });
      if (await K(), G(C === "graph" ? { type: "node", id: Number(E.sourceTagId) } : { type: "rule", id: E.id }), s(null), a.ruleId == null)
        try {
          const _ = await Q(
            `/derivation-rules/${E.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            _.createCount + _.linkCount > 0 ? _ : null
          ), y(_.createCount + _.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), y("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), y("Derived segment rule saved. Previous materializations were removed.");
    } catch (te) {
      y(te.message || "Unable to save derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function Te(W) {
    f(!0), y("Previewing rule deletion…");
    try {
      const te = await Q(
        `/derivation-rules/${W.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${W.sourceTagName} → ${W.derivedTagName}?

Deleted segments: ${te.deletedSegmentCount}
Removed lineage edges: ${te.removedEdgeCount}
Shared derived segments retained: ${te.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const E = `derivation-rule-delete:${W.id}:${te.fingerprint}`;
      await Q(`/derivation-rules/${W.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(E),
          fingerprint: te.fingerprint
        })
      }), Me(E), await K(), (a == null ? void 0 : a.ruleId) === W.id && s(null), ($ == null ? void 0 : $.type) === "rule" && $.id === W.id && G(null), (L == null ? void 0 : L.ruleId) === W.id && T(null), y(`Rule deleted with ${te.deletedSegmentCount} exclusively derived segment${te.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (te) {
      y(te.message || "Unable to delete derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function le(W, te = null) {
    const E = te || await Q(
      `/derivation-rules/${W.id}/materialization/preview`,
      { method: "POST" }
    );
    if (E.createCount + E.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const _ = `derivation-rule-materialize:${W.id}:${E.fingerprint}`, be = await Q(`/derivation-rules/${W.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Ae(_),
        fingerprint: E.fingerprint
      })
    });
    return Me(_), be;
  }
  async function Ne(W, te = null) {
    f(!0), y("Finding pending derivations…");
    try {
      const E = await le(W, te);
      if (T(null), await K(), E.createdCount + E.linkedCount === 0) {
        y("Every applicable derivation is already materialized.");
        return;
      }
      y(
        `${E.createdCount} derived segment${E.createdCount === 1 ? "" : "s"} created and ${E.linkedCount} existing segment${E.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (E) {
      y(E.message || "Unable to materialize pending derivations.");
    } finally {
      f(!1);
    }
  }
  async function oe(W, te) {
    if (te.length === 0) return;
    f(!0), y(`Finding pending derivations from ${W.name}…`);
    let E = 0, _ = 0;
    try {
      for (const be of te) {
        const me = await le(be);
        E += me.createdCount, _ += me.linkedCount;
      }
      T(null), await K(), y(E + _ === 0 ? `Every outgoing derivation from ${W.name} is already materialized.` : `${E} derived segment${E === 1 ? "" : "s"} created and ${_} existing segment${_ === 1 ? "" : "s"} linked from ${W.name}.`);
    } catch (be) {
      await K().catch(() => {
      }), y(be.message || `Unable to materialize derivations from ${W.name}.`);
    } finally {
      f(!1);
    }
  }
  const x = Go(a, o), U = De(
    () => fd(o, e),
    [o, e]
  ), I = O.trim().toLocaleLowerCase(), M = U.components.filter((W) => A === "all" || W.segmentGroupKeys.includes(A)).filter((W) => !I || W.nodes.some((te) => te.name.toLocaleLowerCase().includes(I))), v = M.flatMap((W) => W.rules), k = new Set(
    M.flatMap((W) => W.nodes.map((te) => te.tagId))
  ), z = De(
    () => bd(M),
    [M]
  ), se = C === "list" ? hd(
    $,
    v,
    I.length > 0
  ) : null, ne = ($ == null ? void 0 : $.type) === "node" && U.nodes.find((W) => W.tagId === $.id && k.has(W.tagId)) || null, ie = [...v].sort((W, te) => Z === "source" ? Qe(W.sourceTagName, te.sourceTagName) || Qe(W.derivedTagName, te.derivedTagName) : Z === "target" ? Qe(W.derivedTagName, te.derivedTagName) || Qe(W.sourceTagName, te.sourceTagName) : Z === "materialized" ? (Number(te.edgeCount) || 0) - (Number(W.edgeCount) || 0) || Qe(W.sourceTagName, te.sourceTagName) : Qe(
    `${W.sourceTagName} ${W.derivedTagName}`,
    `${te.sourceTagName} ${te.derivedTagName}`
  ));
  return n(vd, {
    arrowMarkerId: ke,
    busy: h,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: R,
    deleteRule: Te,
    derivedSlots: c,
    derivedSlotsLoading: b,
    draft: a,
    draftIssue: x,
    editRule: Y,
    editorRef: ae,
    emptyDraft: r,
    graph: U,
    layout: z,
    listSort: Z,
    materializationOffer: L,
    materializeOutgoingRules: oe,
    materializeRule: Ne,
    message: S,
    normalizedQuery: I,
    query: O,
    refreshConfiguredTag: X,
    revealEditor: J,
    rules: o,
    save: de,
    segmentGroupKey: A,
    selectedNode: ne,
    selectedRule: se,
    selection: $,
    setConfiguringTag: F,
    setDraft: s,
    setListSort: P,
    setMaterializationOffer: T,
    setQuery: V,
    setSegmentGroupKey: w,
    setSelection: G,
    setView: q,
    sortedVisibleRules: ie,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: re,
    updateTag: j,
    view: C,
    visibleComponents: M,
    visibleRules: v
  });
}
function Sd() {
  const [e, t] = D(da), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => yo({ ...l, [a]: s }));
  }
  function i() {
    t(yo(Mr));
  }
  return n("section", { className: "space-y-3 rounded-lg border border-border bg-surface p-4", "aria-labelledby": "segment-studio-playback-shortcuts-title" }, [
    n("div", { key: "heading", className: "flex flex-wrap items-start justify-between gap-3" }, [
      n("div", { key: "copy" }, [
        n("h2", { key: "title", id: "segment-studio-playback-shortcuts-title", className: "font-semibold text-foreground" }, "Playback shortcuts"),
        n("p", { key: "description", className: "mt-1 text-xs text-secondary" }, "Configure seek intervals and frame-step sizes used by the keyboard-first editor. These settings are stored in this browser.")
      ]),
      n("button", { key: "reset", type: "button", onClick: i, className: "rounded-md border border-border bg-card px-3 py-2 text-xs font-medium hover:bg-muted/40" }, "Reset defaults")
    ]),
    n("div", { key: "fields", className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, r.map(([a, s, l, d, c]) => n("label", { key: a, className: "space-y-1 text-xs text-secondary" }, [
      n("span", { key: "label" }, s),
      n("input", {
        key: "input",
        type: "number",
        min: l,
        max: d,
        step: c,
        value: e[a],
        onChange: (g) => o(a, g.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function kd({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = D([]), [a, s] = D(!1), [l, d] = D(!1), [c, g] = D(""), [m, u] = D(""), [b, p] = D("all"), [h, f] = D(() => /* @__PURE__ */ new Set()), [S, y] = D(null);
  fe(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), g(""), Q("/slot-definitions", { signal: T.signal }).then((R) => {
      i(R || []), s(!0);
    }).catch((R) => {
      R.name !== "AbortError" && g(R.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function O() {
    d(!0), g("");
    try {
      const T = await Q("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      g(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function V() {
    const [T] = await Promise.all([
      Q("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(T || []), s(!0), g("");
  }
  function C() {
    const T = S == null ? void 0 : S.trigger;
    y(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function q(T) {
    f((R) => {
      const F = new Set(R);
      return F.has(T) ? F.delete(T) : F.add(T), F;
    });
  }
  const A = De(
    () => gd(t, o),
    [t, o]
  ), w = De(
    () => pd(A, m, b),
    [A, m, b]
  ), $ = A.flatMap((T) => T.tags), G = $.filter((T) => T.definitions.length > 0).length, Z = $.length - G, P = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], L = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
  return n("section", {
    className: "space-y-4",
    "aria-label": "Performer slot overview"
  }, [
    n("div", { key: "heading", className: "rounded-lg border border-border bg-surface p-4" }, [
      n("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Performer slots"),
      n(
        "p",
        { key: "description", className: "mt-1 max-w-3xl text-sm text-secondary" },
        "Review performer roles for every Segment tag without opening tags one at a time."
      ),
      a ? n(
        "p",
        { key: "summary", className: "mt-2 text-xs text-secondary" },
        `${$.length} tags · ${G} with slots · ${Z} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (T) => u(T.target.value),
          "aria-label": "Search tags and performer slots",
          placeholder: "Search tags or slot labels…",
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
        })
      ]),
      n("div", { key: "coverage", className: "space-y-1" }, [
        n("span", { key: "label", className: "block text-xs text-secondary" }, "Coverage"),
        n(
          "div",
          { key: "choices", role: "group", "aria-label": "Performer slot coverage", className: "inline-flex rounded-md border border-border bg-card p-0.5" },
          P.map(([T, R]) => n("button", {
            key: T,
            type: "button",
            onClick: () => p(T),
            "aria-pressed": b === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${b === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, R))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => f(/* @__PURE__ */ new Set()),
          className: L
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => f(new Set(A.map((T) => T.overviewKey))),
          className: L
        }, "Collapse all")
      ])
    ]),
    l && !a ? n(
      "p",
      { key: "loading", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "Loading performer slots…"
    ) : null,
    c ? n("div", { key: "error", role: "alert", className: "flex flex-wrap items-center gap-3 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive" }, [
      n("span", { key: "message", className: "min-w-0 flex-1" }, c),
      n("button", {
        key: "retry",
        type: "button",
        disabled: l,
        onClick: O,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && w.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, w.map((T) => {
      const R = h.has(T.overviewKey), F = T.tags.filter((ae) => ae.definitions.length > 0).length;
      return n("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => q(T.overviewKey),
          "aria-expanded": !R,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, R ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${F} with slots`
          )
        ]),
        R ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((ae) => n("li", {
            key: ae.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: ae.tagName }, ae.tagName),
              ae.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            ae.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${ae.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, ae.definitions.map((ee) => n("li", {
              key: ee.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, et(ee)),
              ...(ee.genderHints || []).map((ke) => n("span", {
                key: ke,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Qn(ke)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ee) => y({
                tagId: ae.tagId,
                tagName: ae.tagName,
                trigger: ee.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ae.tagName}`,
              className: `${L} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    S ? n(Gr, {
      key: `performer-slots-configure:${S.tagId}`,
      tagId: S.tagId,
      tagName: S.tagName,
      onSaved: V,
      onClose: C
    }) : null
  ]);
}
function wd({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = D("general"), [a, s] = D([]), [l, d] = D(!1), [c, g] = D(""), [m, u] = D(""), [b, p] = D(null), [h, f] = D(!0), [S, y] = D(!1), [O, V] = D(""), [C, q] = D(!0), [A, w] = D(ra), $ = us(t), G = $.map(([R]) => R);
  fe(() => {
    G.includes(o) || i(G[0] || "general");
  }, [t.effectiveMode]);
  async function Z(R) {
    const F = await Q("/segment-groups", R ? { signal: R } : void 0);
    s(F || []);
  }
  fe(() => {
    const R = new AbortController();
    return Z(R.signal).catch((F) => {
      F.name !== "AbortError" && g(F.message || "Unable to load tag groups.");
    }), () => R.abort();
  }, []), fe(() => {
    if (t.effectiveMode !== "full") {
      f(!1);
      return;
    }
    const R = new AbortController();
    return V(""), f(!0), Promise.all([
      Q("/analysis/settings", { signal: R.signal }),
      Q("/analysis/status", { signal: R.signal })
    ]).then(([F, ae]) => {
      q(!0), u((F == null ? void 0 : F.baseUrl) || ""), p(ae);
    }).catch((F) => {
      if (F.name !== "AbortError") {
        if (F.status === 403) {
          q(!1), V("You do not have permission to manage the analysis service connection.");
          return;
        }
        V(F.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      R.signal.aborted || f(!1);
    }), () => R.abort();
  }, [t.effectiveMode]);
  async function P(R) {
    if (R !== t.requestedMode) {
      d(!0), g("");
      try {
        const F = await Q(
          `/preferences/transition?mode=${encodeURIComponent(R)}`
        );
        let ae = !1, ee = null, ke = null, J = null, K = !1;
        if (t.requestedMode === "basic" && R === "full") {
          if (!window.confirm(ps(
            F.recyclingBinCount,
            F.protectedRecyclingBinCount
          )))
            return;
          K = !0, F.recyclingBinCount > 0 && (ae = !0, J = F.recyclingBinFingerprint, ee = `mode-switch-empty-bin:${J}`, ke = Ae(ee));
        }
        let Y = !1;
        if (t.requestedMode === "full" && R === "basic") {
          if (!window.confirm(gs(
            F.extensionOwnedSegmentCount
          )))
            return;
          Y = !0;
        }
        const j = await Q("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: R,
            confirmHiddenExtensionOwnedSegments: Y,
            confirmBasicHistoryCleanup: K,
            emptyRecyclingBin: ae,
            operationId: ke,
            expectedRecyclingBinFingerprint: J
          })
        });
        ee && Me(ee), r == null || r(ca(j)), g("Workflow mode saved.");
      } catch (F) {
        g(F.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function L(R) {
    R.preventDefault(), y(!0), V("");
    try {
      const F = await Q("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((F == null ? void 0 : F.baseUrl) || "");
      const ae = await Q("/analysis/status");
      p(ae), V(F != null && F.baseUrl ? ae != null && ae.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ae == null ? void 0 : ae.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (F) {
      V(F.message || "Unable to save analysis service settings.");
    } finally {
      y(!1);
    }
  }
  const T = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (R) => Da(R, e, T), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
    n("header", { key: "header", className: "space-y-2" }, [
      n("h1", { key: "title", className: "text-2xl font-semibold text-foreground" }, "Segment Studio settings"),
      n(
        "p",
        { key: "description", className: "max-w-3xl text-sm text-secondary" },
        t.effectiveMode === "full" ? "Configure the Segment Studio workflow, shortcuts, performer roles, and derivation behavior." : "Configure the Segment Studio workflow and shortcuts."
      )
    ]),
    n(
      "nav",
      { key: "settings-tabs", "aria-label": "Settings sections", className: "flex gap-1 overflow-x-auto border-b border-border" },
      $.map(([R, F]) => n("button", {
        key: R,
        type: "button",
        onClick: () => i(R),
        "aria-current": o === R ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === R ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, F))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Sd)
    ),
    n("section", { key: "shortcut-bindings-panel", hidden: o !== "shortcuts", className: "space-y-2 rounded-lg border border-border bg-surface p-4" }, [
      n("h2", { key: "title", className: "font-semibold text-foreground" }, "Keyboard bindings"),
      n(
        "p",
        { key: "description", className: "text-sm text-secondary" },
        "Segment Studio bindings now use Cove's keyboard shortcut settings and conflict handling."
      ),
      n(
        "a",
        { key: "link", href: "/settings/my/keyboard-shortcuts", className: "inline-flex text-sm font-medium text-accent hover:underline" },
        "Configure Segment Studio shortcuts in Cove settings →"
      )
    ]),
    n("section", { key: "mode", hidden: o !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      n("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Workflow mode"),
      n(zl, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: P,
        disabled: l || t.legacyCompatibilityRequired
      }),
      n("div", { key: "mode-guide", className: "grid gap-3 md:grid-cols-2" }, [
        n("article", { key: "basic", className: "rounded-md border border-border bg-card p-3" }, [
          n("h3", { key: "title", className: "text-sm font-semibold text-foreground" }, "Basic"),
          n(
            "p",
            { key: "description", className: "mt-1 text-xs leading-5 text-secondary" },
            "Create and edit ordinary Cove segments directly. No Segment Studio registration or review decision is required. Undo and the recycling bin provide reversible cleanup. Eligible AI examples can be collected into a protected bin entry."
          )
        ]),
        n("article", { key: "full", className: "rounded-md border border-border bg-card p-3" }, [
          n("h3", { key: "title", className: "text-sm font-semibold text-foreground" }, "Full"),
          n(
            "p",
            { key: "description", className: "mt-1 text-xs leading-5 text-secondary" },
            "Adds Segment Studio-owned drafts, review, performer slots, derivation, and shot boundaries while keeping ordinary Cove segments and shared AI feedback available."
          )
        ])
      ]),
      n(
        "p",
        { key: "boundary", className: "text-xs leading-5 text-secondary" },
        "AI feedback is available in both modes for segments with registered AI provenance. Collection preserves provenance, and downloads contain an AI Feedback ZIP for manual submission. Live segments are preserved when modes change. Collected examples also remain protected and manageable; only unprotected Basic bin entries are removed when confirmed. Switching to Full clears Basic undo history. Switching to Basic hides extension-owned segments and expanded metadata. Materialized derivations remain Segment Studio-owned and appear only in Full."
      )
    ]),
    n("section", { key: "confirmations", hidden: o !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      n("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Confirmations"),
      n("label", { key: "merge", className: "flex items-start gap-3" }, [
        n("input", {
          key: "input",
          type: "checkbox",
          checked: A,
          onChange: (R) => {
            const F = R.target.checked;
            oa(F), w(F);
          },
          className: "mt-0.5 h-4 w-4 accent-[var(--color-accent)]"
        }),
        n("span", { key: "copy", className: "space-y-0.5" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Confirm segment merges"),
          n(
            "span",
            { key: "description", className: "block text-xs text-secondary" },
            "Show the merge summary before permanently replacing selected segments."
          )
        ])
      ])
    ]),
    t.effectiveMode === "full" ? n("section", { key: "analysis", hidden: o !== "general", className: "space-y-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "heading" }, [
        n("h2", { key: "title", className: "text-lg font-semibold text-foreground" }, "Analysis service"),
        n(
          "p",
          { key: "description", className: "mt-1 text-sm text-secondary" },
          "Connect Full Scan to the Segment Studio analysis service. The URL must be reachable from the Cove API process."
        )
      ]),
      n("form", { key: "form", onSubmit: L, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: m,
            onChange: (R) => u(R.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: h || S || !C,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: h || S || !C,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, S ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        O || (h ? "Loading analysis service settings…" : (b == null ? void 0 : b.configured) === !1 ? "Full Scan is not configured." : b != null && b.ready ? "Analysis service is ready." : (b == null ? void 0 : b.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    G.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(xd, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => Z()
      })
    ) : null,
    G.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(kd, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => Z()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function jo({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, et(a)),
    n("select", {
      key: "select",
      value: t[a.id] || "",
      onChange: (s) => o(a.id, s.target.value),
      className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
    }, [
      n("option", { key: "all", value: "" }, "Any assigned performer"),
      ...(a.performers || []).map((s) => n("option", { key: s.id, value: s.id }, `${s.name} (${s.assignmentCount})`))
    ])
  ]))) : null;
}
function Nd({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, b) => u.sortOrder - b.sortOrder || String(u.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: et(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = ma(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: ka(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Se(e.startSec)} to ${e.endSec == null ? "end of video" : Se(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Se(e.startSec)} → end` : `${Se(e.startSec)} – ${Se(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(Bt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(Xn, {
            key: "performers",
            performers: l,
            performerAssignments: d,
            interactive: !1
          }) : null
        ]),
        n("div", { key: "video", className: "line-clamp-1 text-xs text-secondary", title: e.videoTitle }, e.videoTitle)
      ])
    ]),
    n(
      "div",
      { key: "footer", className: "flex items-center justify-end gap-2 border-t border-border px-2.5 py-1.5 text-right" },
      e.reviewState === "rejected" && !e.published ? [
        n("button", { key: "restore", type: "button", disabled: r, onClick: () => i(e), className: "text-xs font-semibold text-accent hover:underline disabled:opacity-50" }, "Restore"),
        n("button", { key: "purge", type: "button", disabled: r, onClick: () => a(e), className: "text-xs font-semibold text-red-400 hover:underline disabled:opacity-50" }, "Delete permanently")
      ] : n("a", {
        href: c,
        className: "text-xs font-semibold text-accent hover:underline"
      }, "Edit segment")
    )
  ]);
}
function Id({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ho, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: bs(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ma(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ko({ onNavigate: e, profile: t }) {
  const r = De(() => {
    const K = Wo("ext:com.midnightrider.segment-studio:segments");
    return K ? {
      ...fr,
      defaultFilter: { ...fr.defaultFilter, ...K.findFilter || {} },
      defaultObjectFilter: K.objectFilter || {}
    } : fr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Vo(r), [l, d] = D(null), [c, g] = D({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = D(null), [b, p] = D(null), [h, f] = D(0), [S, y] = D(""), [O, V] = D(!0), [C, q] = D(""), A = pe(0), w = ho(o, i), $ = w.activityTagId, G = en(i.slots), Z = De(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (K) => Object.keys(en(K)).length > 0,
    sanitize: (K) => yr($, en(K)),
    summarize: (K) => `${Object.keys(en(K)).length} assigned`,
    renderEditor: (K, Y) => $ ? n(jo, {
      facets: l,
      values: en(K),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (j, X) => {
        const re = { ...en(K) };
        X ? re[j] = Number(X) : delete re[j], Y(yr($, re));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [$, l, c.performerSlotsAvailable]), P = JSON.stringify(w);
  fe(() => {
    if (d(null), !$) return;
    const K = new AbortController();
    return Q(`/browse/activities/${$}/facets`, { signal: K.signal }).then(d).catch((Y) => {
      Y.status === 403 ? d({ slots: [], restricted: !0 }) : Y.name !== "AbortError" && q(Y.message);
    }), () => K.abort();
  }, [$]), fe(() => {
    const K = ++A.current, Y = new AbortController();
    return V(!0), q(""), Q("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(w), signal: Y.signal }).then((j) => {
      K === A.current && g({ ...j, totalCount: j.totalCount ?? j.total ?? 0 });
    }).catch((j) => {
      if (!(K !== A.current || j.name === "AbortError")) {
        if (j.status === 400 && j.message.includes("unrestricted performer read access")) {
          g((X) => ({ ...X, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), q("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        q(j.message);
      }
    }).finally(() => {
      K === A.current && V(!1);
    }), () => {
      A.current++, Y.abort();
    };
  }, [P, h]);
  const L = c.items.findIndex((K) => K.key === m), T = c.items[L] || null;
  function R(K) {
    s(K), a({ ...o, page: 1 });
  }
  function F(K) {
    const Y = ho(o, K), j = K.slots && Y.activityTagId != null && Y.slotAssignments.length > 0 ? K.slots : void 0;
    R({ ...K, slots: j });
  }
  function ae(K, Y) {
    const j = { ...G };
    Y ? j[K] = Number(Y) : delete j[K], R({ ...i, slots: yr($, j) });
  }
  function ee() {
    const K = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => K == null ? void 0 : K.focus());
  }
  async function ke(K) {
    var X;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(K.key), y("");
    const Y = `browse-restore:${K.itemId}:${K.revision}`, j = Ae(Y);
    try {
      const re = (de = !1) => Q(`/bin/${K.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: j,
          expectedRevision: K.revision,
          discardMissingImage: de
        })
      });
      try {
        await re(Er(Y));
      } catch (de) {
        if (((X = de.payload) == null ? void 0 : X.code) !== "missing-image" || !window.confirm(`${de.message}

Continue and discard the missing image reference?`))
          throw de;
        Dr(Y), await re(!0);
      }
      Me(Y), m === K.key && u(null), y("Segment restored to Cove."), f((de) => de + 1);
    } catch (re) {
      y(re.message || "Unable to restore the segment."), re.status === 409 && f((de) => de + 1);
    } finally {
      p(null);
    }
  }
  async function J(K) {
    p(K.key), y("");
    try {
      const Y = await Q(`/items/${K.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: K.revision })
      });
      if (!ba(Y, y) || !ha(Y))
        return;
      const j = `browse-dependency-delete:${K.itemId}:${Y.fingerprint}`;
      await Q(`/items/${K.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Ae(j),
          fingerprint: Y.fingerprint
        })
      }), Me(j), m === K.key && u(null), y(`${Y.deletedSegmentCount} segment${Y.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), f((X) => X + 1);
    } catch (Y) {
      y(Y.message || "Unable to permanently delete the segment."), Y.status === 409 && f((j) => j + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(Br, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Jo, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: O,
      error: C ? new Error(C) : null,
      onRetry: () => f((K) => K + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? bo.filter((K) => K.id !== "performers") : bo,
      objectFilter: i,
      onObjectFilterChange: F,
      customFilterSections: Z,
      searchPlaceholder: "Search segments..."
    }, [
      $ ? n(jo, { key: "slots", facets: l, values: G, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ae }) : null,
      n(Id, { key: "player", item: T, index: L, count: c.items.length, onPrevious: () => {
        var K;
        return u((K = c.items[L - 1]) == null ? void 0 : K.key);
      }, onNext: () => {
        var K;
        return u((K = c.items[L + 1]) == null ? void 0 : K.key);
      }, onClose: ee, onNavigate: e }),
      S ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, S) : null,
      !O && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      O ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((K) => n(Nd, {
        key: K.key,
        item: K,
        selected: K.key === m,
        busy: b === K.key,
        onSelect: () => u(K.key),
        onRestore: ke,
        onPurge: J
      })))
    ])
  ]);
}
function Cd({ onNavigate: e, profile: t }) {
  const [r, o] = D([]), [i, a] = D(""), [s, l] = D(0), [d, c] = D(!0), [g, m] = D(null), [u, b] = D(""), p = pe(null);
  async function h(y) {
    const O = await Q("/bin", y ? { signal: y } : void 0);
    return o(O.items || []), a(O.fingerprint || ""), l(Number(O.totalCount) || 0), O;
  }
  fe(() => {
    const y = new AbortController();
    return c(!0), h(y.signal).catch((O) => {
      O.name !== "AbortError" && b(O.message);
    }).finally(() => {
      y.signal.aborted || c(!1);
    }), () => y.abort();
  }, []), qo(Ar, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var y;
      return (y = p.current) == null ? void 0 : y.call(p);
    }
  }]);
  async function f(y) {
    var C;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(y.itemId), b("");
    const O = `restore:${y.itemId}:${y.revision}`, V = Ae(O);
    try {
      const q = (A = !1) => Q(`/bin/${y.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: V, expectedRevision: y.revision, discardMissingImage: A })
      });
      try {
        await q(Er(O));
      } catch (A) {
        if (((C = A.payload) == null ? void 0 : C.code) !== "missing-image" || !window.confirm(`${A.message}

Continue and discard the missing image reference?`)) throw A;
        Dr(O), await q(!0);
      }
      Me(O), await h(), wn(), b("Segment restored with a new native ID.");
    } catch (q) {
      b(q.message || "Unable to restore the segment."), q.status === 409 && await h();
    } finally {
      m(null);
    }
  }
  async function S() {
    if (g == null)
      try {
        const y = await xa({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), b("");
        });
        if (y.status !== "emptied") return;
        await h(), wn(), b(`${y.segmentCount} segment${y.segmentCount === 1 ? "" : "s"} from ${y.sceneCount} scene${y.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (y) {
        b(y.message || "Unable to empty the recycling bin."), y.status === 409 && await h();
      } finally {
        m(null);
      }
  }
  return p.current = S, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(Br, {
      key: "tabs",
      active: "bin",
      onNavigate: e,
      showBin: !0,
      profile: t
    }),
    n("header", { key: "header", className: "flex flex-wrap items-start justify-between gap-3" }, [
      n("div", { key: "copy", className: "space-y-2" }, [
        n("h1", { key: "title", className: "text-2xl font-semibold" }, "Recycling bin"),
        n("p", { key: "description", className: "max-w-3xl text-sm text-secondary" }, "Segments moved here from Basic mode can be restored individually. Restoring recreates the native content with a new native ID; external relationships to the old ID are not restored.")
      ]),
      n("button", {
        key: "empty",
        type: "button",
        disabled: d || g != null || s === 0,
        onClick: S,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, g === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    u ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, u) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((y) => n("article", { key: y.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${y.tagName || "Tag segment"} · ${y.videoTitle || `Video ${y.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, y.endSec == null ? Se(y.startSec) : `${Se(y.startSec)} – ${Se(y.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${y.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${y.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => f(y), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Uo = "ext:com.midnightrider.segment-studio:videos";
function hr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = De(() => {
    var P;
    const G = Wo(Uo), Z = (P = G == null ? void 0 : G.uiOptions) == null ? void 0 : P.displayMode;
    return G ? {
      ...Sn,
      defaultFilter: { ...Sn.defaultFilter, ...G.findFilter || {} },
      defaultObjectFilter: G.objectFilter || {},
      defaultDisplayMode: Sn.allowedDisplayModes.includes(Z) ? Z : Sn.defaultDisplayMode
    } : Sn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Vo(i), [m, u] = D({ items: [], totalCount: 0 }), [b, p] = D(!0), [h, f] = D(""), [S, y] = D(0), O = pe(0), V = JSON.stringify(a), C = JSON.stringify(s), q = t || r === "review";
  fe(() => {
    const G = ++O.current, Z = new AbortController();
    return p(!0), f(""), Q(`/videos?${Gl(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: Z.signal }).then((P) => {
      G === O.current && u(P);
    }).catch((P) => {
      G === O.current && P.name !== "AbortError" && f(P.message || "Unable to discover videos.");
    }).finally(() => {
      G === O.current && p(!1);
    }), () => {
      O.current++, Z.abort();
    };
  }, [V, C, t, r, S]);
  function A(G) {
    d({ ...G, page: G.page || 1 });
  }
  function w(G) {
    c(G), d({ ...a, page: 1 });
  }
  const $ = t || r === "review" ? Lo : Lo.filter((G) => !["reviewState", "shotBoundaries"].includes(G.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(Br, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Jo, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Uo,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: A,
      totalCount: m.totalCount,
      isLoading: b,
      error: h ? new Error(h) : null,
      onRetry: () => y((G) => G + 1),
      sortOptions: t || r === "review" ? [...Po, { value: "unreviewed_count", label: "Unreviewed count" }] : Po,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: $,
      objectFilter: s,
      onObjectFilterChange: w,
      searchPlaceholder: "Search Segment Studio videos..."
    }, [
      !b && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !b && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((G) => n(jl, { key: G.videoId, item: G, onNavigate: e, showReviewStates: q }))) : null,
      !b && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((G) => n(Kl, { key: G.videoId, item: G, onNavigate: e, showReviewStates: q }))) : null
    ])
  ]);
}
function zo({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = D(null), [s, l] = D(!0), [d, c] = D(""), g = pe(0), m = pe(0), u = pe(e), b = Il();
  u.current = e;
  const p = (O) => `/videos/${O}/editor`;
  async function h(O, V, C) {
    const q = await Q(p(V), C ? { signal: C.signal } : void 0);
    return Pt(O, C ? g.current : m.current, V, u.current) ? (a(q), !0) : !1;
  }
  fe(() => {
    const O = ++g.current, V = e, C = new AbortController();
    return a(null), l(!0), c(""), h(O, V, C).catch((q) => {
      Pt(O, g.current, V, u.current) && q.name !== "AbortError" && c(q.message || "Unable to load the editor.");
    }).finally(() => {
      Pt(O, g.current, V, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, C.abort();
    };
  }, [e]);
  function f(O, V) {
    a((C) => (C == null ? void 0 : C.video.id) !== V ? C : typeof O == "function" ? O(C) : O);
  }
  async function S() {
    const O = e, V = ++m.current;
    try {
      const C = await Q(p(O));
      return Pt(V, m.current, O, u.current) ? (a(C), c("A newer canonical segment was loaded. Your stale change was not applied."), C) : null;
    } catch (C) {
      return Pt(V, m.current, O, u.current) && c(C.message || "Unable to reload the latest segment."), null;
    }
  }
  async function y() {
    const O = e, V = ++m.current;
    try {
      const C = await Q(p(O));
      return Pt(V, m.current, O, u.current) ? (a(C), c(""), C) : null;
    } catch (C) {
      return Pt(V, m.current, O, u.current) && c(C.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${b ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: b ? {
      height: "calc(100dvh - 3.25rem)",
      margin: "-1rem -1.5rem -1.25rem",
      width: "calc(100% + 3rem)"
    } : void 0
  }, [
    d ? n("div", { key: "error", className: "rounded-lg border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, d) : null,
    s ? n("div", {
      key: "loading",
      role: "status",
      className: "flex min-h-[50vh] w-full items-center justify-center"
    }, [
      n(Ti, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(md, {
      key: i.video.id,
      detail: i,
      onDetailChange: f,
      onConflict: S,
      onReload: y,
      onSlotsChanged: y,
      splitLayout: b,
      profile: o,
      initialSegmentId: xo() ? -xo() : hs(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function $d(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Td(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Ad(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Md({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = ds(o), l = $d(e, t, window.location.pathname), d = Td(e, t, window.location.pathname), c = Ad(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (ms(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(hr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(wd, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ko, { onNavigate: r, profile: o });
    const b = Number(e);
    return Number.isInteger(b) && b > 0 ? n(zo, {
      videoId: b,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(hr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Cd, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(Ko, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(zo, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(hr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function Rd({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = D(null), [a, s] = D("");
  return fe(() => {
    const l = new AbortController();
    return Q("/preferences", { signal: l.signal }).then((d) => i(ca(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Md, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Ed(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Dd(e, t) {
  const r = Ed(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const ec = {
  components: { SegmentStudioPage: Rd },
  actionHandlers: { openSegmentStudio: Dd }
};
export {
  vr as CLEARED_SEGMENT_SELECTION_ID,
  Po as DISCOVERY_SORT_OPTIONS,
  wt as SEGMENT_STUDIO_CAPABILITIES,
  Ar as SEGMENT_STUDIO_EXTENSION_ID,
  Tn as SEGMENT_STUDIO_SHORTCUTS,
  Pi as activeEditorFilterCount,
  _s as applyDerivationRuleSlotSuggestions,
  Mo as applyFeedbackEditorDelta,
  Io as applySegmentMergeDelta,
  Rs as basicSegmentTimelineStyle,
  bs as browseClipEnd,
  ma as browseEditorHref,
  ho as buildBrowseRequest,
  fd as buildDerivationRuleGraph,
  Gl as buildDiscoverySearchParams,
  il as buildMinuteTimelineTicks,
  gd as buildPerformerSlotOverview,
  ws as buildSegmentQuickSearchEntries,
  Js as buildSegmentRailRows,
  Ys as buildTimelineRows,
  Zd as buildTimelineTicks,
  cl as calculateCenteredTimelineScroll,
  Cr as calculateEditorPanelMaximum,
  sl as calculateMinuteLabelStride,
  Qd as calculateMinuteTimelineWidth,
  gl as calculateSwimlaneTitleMaximum,
  ul as calculateTimelinePlayheadPosition,
  Lr as calculateTimelineRatioBounds,
  fl as calculateTimelineRatioFromPointer,
  Xd as calculateVerticalRevealOffset,
  Lt as clampEditorPanelWidth,
  Wn as clampSwimlaneTitleWidth,
  Ea as clampTimelineRatio,
  Fr as clampTimelineRatioForHeight,
  Yn as clampTimelineZoom,
  Pl as compactProvenanceSummary,
  ec as default,
  Ts as downloadFileNameFromContentDisposition,
  Li as dualRangeValueFromPointer,
  po as duplicateIdentityFromResponse,
  os as duplicateOperationKey,
  Oi as editorVisibilityIncludingSegment,
  Xs as expandedSwimlanes,
  gs as extensionOwnedSegmentsModeSwitchPrompt,
  bl as feedbackFrameTimestamps,
  vl as feedbackResultMatchesAction,
  hl as feedbackSelectionPlan,
  Di as filterDerivedSegments,
  pr as filterEditorSegments,
  pd as filterPerformerSlotOverview,
  ks as filterSegmentQuickSearch,
  zd as filterSegmentStudioShortcuts,
  nl as findAdjacentSegmentGroupKey,
  ss as findAdjacentShot,
  ts as findEditorShortcut,
  To as findInitialSegmentSelection,
  al as findNearestSegmentInCurrentSwimlane,
  is as findPublishedSelectionIdentity,
  ze as findSegmentByStableIdentity,
  yl as findSegmentFromPlayhead,
  ol as findSegmentNearPlayhead,
  tl as findSwimlaneRangeSelection,
  Nr as findSwimlaneSelection,
  xs as findUniquePerformerSlotAssignment,
  Ra as findUnreviewedSelection,
  Qn as formatGenderHint,
  ls as frameStepSeconds,
  ga as generatePerformerSlotAssignmentRecommendations,
  Yl as groupApprovedDraftsForPublishing,
  Ss as groupAutoAssignCandidates,
  xl as groupIncorrectExamplesByTag,
  ed as groupMaterializationOutputs,
  rn as groupSegmentsIntoSwimlanes,
  Zs as groupSelectedSwimlanes,
  Pr as groupSwimlanesBySegmentGroup,
  ct as handleModalKey,
  nn as hasSegmentStudioCapability,
  Ro as hideCollectedFeedbackSegments,
  Gs as historyActionsForTarget,
  Ca as indexPerformerSlotsBySegment,
  Hd as initialReviewFilter,
  Pt as isCurrentEditorRequest,
  Ls as isEditableTarget,
  Wd as isEditorShortcutOwner,
  Ad as isSegmentStudioBinRoute,
  Td as isSegmentStudioSegmentsRoute,
  $d as isSegmentStudioSettingsRoute,
  yd as layoutDerivationRuleComponent,
  bd as layoutDerivationRuleComponents,
  Us as multiSelectionActionHint,
  Hi as nextSegmentAfterRemoval,
  Jd as nextUnapprovedAfterRejectedDeletion,
  qi as nextUnreviewedAfterRemoval,
  At as normalizeCollapsedSegmentGroups,
  Bo as normalizeDiscoveryIds,
  dt as normalizeEditorSegmentFilters,
  $t as normalizeGender,
  fo as normalizeReviewFilter,
  ca as normalizeSegmentStudioFeatureProfile,
  _d as normalizeSegmentStudioMode,
  kr as normalizeSegmentStudioPublicMode,
  en as parseBrowseSlotFilters,
  pl as parseEditorLayout,
  Ri as parseHideDerivedSegmentsPreference,
  Ei as parseMergeConfirmationPreference,
  la as parsePlaybackShortcutConfig,
  Xi as parseShortcutBindingOverrides,
  Wi as percentageSeekTime,
  vs as performInitialSegmentSeek,
  Ke as performerOptionId,
  Vn as performerSlotHistoryState,
  et as performerSlotLabel,
  Hs as performerSlotPresentation,
  Yd as performerSlotStatus,
  Or as performerSlotStatusFromSegmentSlots,
  Ia as performerSlotsForSegment,
  ft as provenanceSourceLabel,
  pa as rankPerformerOptions,
  Gi as reconcileFilteredSelectedSegmentId,
  rl as reconcileSegmentGroupKey,
  zi as reconcileSelectedSegmentIds,
  Ul as recyclingBinActionText,
  As as recyclingBinDeletionPrompt,
  va as recyclingBinDeletionSummary,
  ps as recyclingBinModeSwitchPrompt,
  xo as requestedOwnedItemId,
  hs as requestedSegmentId,
  as as resolveSegmentCreationAction,
  ms as resolveSegmentStudioRoute,
  es as resolveSegmentStudioShortcuts,
  hd as resolveSelectedDerivationRule,
  Vi as resolveSelectedSegments,
  Bi as resolveVisibleSelectedSegment,
  ud as restorePublishApprovedFocus,
  Ma as revealCollapsedSegmentGroup,
  Sa as segmentBadgeStyle,
  Zn as segmentGroupHeaderBackground,
  ht as segmentGroupKeyForSegment,
  Na as segmentHistoryIdentity,
  zn as segmentHistoryState,
  ka as segmentRailItemStyle,
  qd as segmentStateStyle,
  Ed as segmentStudioActionTarget,
  ds as segmentStudioLegacyMode,
  Ms as segmentTimelineStyle,
  lt as segmentsHistoryState,
  _i as selectAllVideoSegmentIds,
  fs as selectedBrowseStates,
  Ta as selectedSwimlaneMerge,
  Da as setBackLinkNavigation,
  js as sharedPerformerSlotShape,
  Ks as sharedTagPerformerSlotShape,
  tn as shortcutAvailableInMode,
  ns as shortcutBindingDisplayText,
  Gd as shortcutBindingFromEvent,
  Kd as shortcutBindingsOverlap,
  Ud as shortcutModesOverlap,
  Qi as shortcutRequiresSingleSegment,
  qn as shotBoundaryFingerprint,
  Bs as shouldAcceptCurrentTagFromEnter,
  jd as shouldExitShortcutCapture,
  Vd as shouldHandleEditorShortcut,
  Oo as shouldReloadAfterSegmentMutation,
  Sr as shouldRestoreTransitionSelection,
  Ns as shouldShowQuickSearchGroups,
  mo as splitShortcutCategoriesIntoColumns,
  zs as suggestDerivationRuleSlotMappings,
  Cn as swimlaneDisplayLabel,
  Ps as swimlaneMarkerTop,
  Ds as swimlaneStripeBackground,
  ml as timelineContentStyle,
  Ao as timelinePlayheadHorizontalStyle,
  Es as timelineSegmentWidth,
  ll as timelineTickAlignment,
  dl as timelineTickPosition,
  Ir as timelineTimePercent,
  el as toggleAllCollapsedSegmentGroups,
  rs as toggledSelectionReviewState,
  Nt as trapModalFocus,
  Is as tryParseJsonResponseText,
  Ui as updateAnchoredSegmentSelection,
  Fi as updateDualRangeValues,
  ji as updateSegmentCollectionSelection,
  Ki as updateSegmentRangeSelection,
  aa as updateSegmentSelection,
  Go as validateDerivationRuleDraft,
  $o as validateSegmentTiming,
  Rr as videoPerformerOptions,
  br as videoPerformerSlotAssignments,
  us as visibleSegmentStudioSettingsTabs,
  cs as visibleSegmentStudioTabs,
  $a as visibleVirtualRows
};
