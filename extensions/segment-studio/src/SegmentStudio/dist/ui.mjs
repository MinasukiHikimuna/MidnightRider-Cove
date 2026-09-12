import Gr from "@cove/runtime/react";
import { createPortal as Gi } from "@cove/runtime/react-dom";
import { extensionFetch as ia } from "@cove/runtime/api";
import { formatDuration as Ki, EntityReferenceSelector as Tn, useExtensionKeyboardBindings as Ui, VideoPlayer as sa, useRegisterExtensionKeyboardActions as la, getDefaultFilter as da, useListUrlState as ca, ListPage as ua } from "@cove/runtime/components";
import { ChevronDown as ma, Loader2 as zi } from "@cove/runtime/lucide-react";
const Kr = "com.midnightrider.segment-studio", ga = "segment-studio.layout.v1", Gt = "segment-studio.operations.v1", pa = "segment-studio.collapsed-segment-groups.v1", fa = "segment-studio.playback-shortcuts.v1", ya = "segment-studio.timing-clipboard.v1", ba = "segment-studio.hide-derived-segments.v1", ha = "segment-studio.merge-confirmation.v1", tt = ["unreviewed", "approved", "rejected"], _i = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], So = "(min-width: 1024px) and (min-height: 640px)", ko = "(min-width: 1024px) and (min-height: 900px)", An = 1e-3, wo = 15, Hi = 30, va = 12, at = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Ur = {
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
};
function No(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function xa(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? Sa(e, null, 1, !0) ?? r[0] ?? null;
}
function Sa(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((m) => m.markers.some((u) => u.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((u) => u.markers.map((p) => p.segment)).filter((u) => u.reviewState === "unreviewed");
    return r < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((u) => u.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((u) => u.segment)), d = l.findIndex((m) => m.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function qi(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const p = Number(u.startSec), f = u.endSec == null ? p + Hi : Number(u.endSec);
    return Number.isFinite(p) && Number.isFinite(f) && f >= p && p <= i + wo + An && f >= i - wo - An;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Wi(e, t, r) {
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
function tr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function uc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Vi(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function mc(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Ji(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Yi(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Qi(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Zi(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Rr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Xi(e, t, r = 10) {
  const o = Rr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Io(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function es(e, t = va) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function ka(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : at.timelineRatio;
}
function Mr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function jt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? at.detailWidth : Math.min(Mr(t, 0), Math.max(240, e));
}
function er(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? at.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function ts(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function zr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: at.timelineRatio, maximum: at.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function _r(e, t) {
  const r = ka(e);
  if (!(t > 0)) return r;
  const o = zr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function ns(e) {
  if (!e) return { ...at };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? ka(r) : at.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: jt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: jt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: er(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...at };
  }
}
function rs(e, t, r) {
  return r > 0 ? _r((t + r - e) / r, r) : at.timelineRatio;
}
function gc(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function os(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= An ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Ft(e, t, r, o) {
  return e === t && r === o;
}
const nr = "__segment-studio-cleared-selection__";
function as(e) {
  return e === "true";
}
function is(e) {
  return e !== "false";
}
function wa() {
  try {
    return is(window.localStorage.getItem(ha));
  } catch {
    return !0;
  }
}
function Na(e) {
  try {
    window.localStorage.setItem(ha, String(!!e));
  } catch {
  }
}
function ss(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function ct(e = {}) {
  const t = tt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, m) => {
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
function Nr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = ct(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return ss(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function ls(e, t, r, o = !1, i = []) {
  var l;
  const a = ct(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = ct({
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
    filters: ct(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function ds(e, t = !1) {
  const r = ct(e);
  return +(r.reviewStates.length !== tt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function cs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function us(e, t, r, o) {
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
function ms(e, t, r = null) {
  return t === nr ? null : xa(
    e,
    t ?? r
  );
}
function Ia(e, t, r, o = !1) {
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
function gs(e, t, r) {
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
function ps(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Ia(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function fs(e, t, r = null, o = !1) {
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
      ...ps(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = Ia(i, a, t, o);
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
function ys(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function bs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function $o(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Co(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => $o(t, o) - $o(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function hs(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: p }) => !i.has(p.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = Co(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return Co(d == null ? void 0 : d.markers, s, i);
}
function vs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function xs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Ss(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function ks() {
  try {
    return as(window.localStorage.getItem(ba));
  } catch {
    return !1;
  }
}
function ws(e) {
  try {
    window.localStorage.setItem(ba, String(!!e));
  } catch {
  }
}
const Dn = [
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
], Ns = /* @__PURE__ */ new Set([
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
function Is(e) {
  return Ns.has(e);
}
function $a(e) {
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
function $s(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Dn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map($a).filter(Boolean)]));
  } catch {
    return {};
  }
}
function Cs(e = {}) {
  const t = $s(e);
  return Dn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function To(e, t = 2) {
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
function pc(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : $a({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function fc(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Er(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Ao(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function yc(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Ao(e.code, t.key), a = Ao(t.code, e.key);
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
          if (Er(u, e) && Er(u, t)) return !0;
        }
  return !1;
}
function Xt(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function bc(e, t) {
  return [!1, !0].some((r) => Xt(e, r) && Xt(t, r));
}
function Ts(e, t = !1, r = {}) {
  return Cs(r).find((o) => Xt(o, t) && o.bindings.some((i) => Er(e, i))) || null;
}
function Ca(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function As(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Ca).join(" / ") : "Unassigned";
}
function hc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, As(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function vc(e) {
  return e === "review" ? "review" : "editor";
}
function Ke(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function Rs(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Ms(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function Es(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ke(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ke(t, e.activeIdentity) || r[0]
  };
}
function Ds(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function Os(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => Ds(o, i))));
}
function Ro(e, t) {
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
function Ps(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Ls(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Dr(e, t) {
  return e === t;
}
function Fs(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function js(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - An).at(-1) || null : o.find((i) => i.startSec > t + An) || null;
}
function $n(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Mo(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: tt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function xc(e, t = null, r = !1) {
  const o = Mo(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Qt(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Ta(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Qt(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Qt(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Qt(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Qt(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Qt(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Qt(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Ur };
  }
}
function Bs(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function Aa() {
  try {
    return Ta(window.localStorage.getItem(fa));
  } catch {
    return { ...Ur };
  }
}
function Eo(e) {
  const t = Ta(JSON.stringify(e));
  try {
    window.localStorage.setItem(fa, JSON.stringify(t));
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
function Or(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Ra(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Or(e.requestedMode) : "basic",
    effectiveMode: i ? Or(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function en(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Gs(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ks(e) {
  const t = [];
  return en(e, wt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), en(e, wt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Us(e) {
  return [
    ["general", "General", wt.settingsGeneral],
    ["shortcuts", "Shortcuts", wt.settingsShortcuts],
    ["performer-slots", "Performer slots", wt.settingsPerformerSlots],
    ["derivation", "Derivation", wt.settingsDerivation]
  ].filter(([, , r]) => en(e, r)).map(([r, o]) => [r, o]);
}
function zs(e, t) {
  return e === "segments" && !en(
    t,
    wt.navigationSegmentInventory
  ) || e === "bin" && !en(
    t,
    wt.recyclingBinView
  ) ? "videos" : e;
}
function _s(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Hs(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Ir = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, Do = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: tt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function qs(e) {
  const t = String(e || "").split(",").filter((r) => tt.includes(r));
  return t.length === 0 ? [...tt] : [...new Set(t)];
}
function Zt(e) {
  return Ma(e).values;
}
function Ma(e) {
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
function $r(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Oo(e, t) {
  var l;
  const r = Po(t.activitiesCriterion, t.activityId), o = Po(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = Ma(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Ws(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Po(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Ws(e, t) {
  return tt.includes(e == null ? void 0 : e.value) ? [e.value] : qs(t);
}
function Ea(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Vs(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Js(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Lo(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ys(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function Ve(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Hr(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Cr(e, t) {
  const r = new Set(Hr(t).map((o) => String(Ve(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Tt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Fo(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Tt).sort().join(",")}`;
}
function Da(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((p) => String(p.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((p) => {
    var f;
    return !((f = p.genderHints) != null && f.length);
  }) && e.length === t.length && !i) {
    const p = [...e].sort((b, y) => String(b.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), f = [...t].sort((b, y) => String(b.name).localeCompare(String(y.name)) || Number(Ve(b)) - Number(Ve(y)));
    return [{
      assignments: Object.fromEntries(p.map((b, y) => [String(b.slotDefinitionId), String(Ve(f[y]))])),
      description: f.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((p) => t.map((f, b) => ({ performer: f, index: b })).filter(({ performer: f }) => {
    var b;
    return !((b = p.genderHints) != null && b.length) || p.genderHints.some((y) => Tt(y) === Tt(f.gender || f.genderIdentity));
  }).map(({ index: f }) => f)), g = i ? c.filter((p) => p.length > 0).length : jo(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((p, f) => [String(Ve(p)), f]));
  function u(p, f, b) {
    if (s.length >= a) return;
    const y = c.slice(p), N = i ? y.filter((D) => D.length > 0).length : jo(y.map((D) => D.filter((L) => !f.has(String(Ve(t[L]))))), t.length);
    if (b + N < g) return;
    if (p === e.length) {
      if (b !== g) return;
      const D = Object.fromEntries(d.map(({ slot: A, performer: C }) => [String(A.slotDefinitionId), C ? String(Ve(C)) : ""])), L = o.length === 0 ? Object.values(D).sort().join(",") : [...new Set(e.map((A) => String(A.label || "")))].map((A) => `${A}:${d.filter(({ slot: C }) => String(C.label || "") === A).map(({ performer: C }) => C ? String(Ve(C)) : "").sort().join(",")}`).join("|");
      !l.has(L) && s.length < a && (l.add(L), s.push({
        assignments: D,
        description: d.map(({ slot: A, performer: C }) => o.length ? `${A.label}: ${(C == null ? void 0 : C.name) || "Unassigned"}` : (C == null ? void 0 : C.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const x = e[p], w = [...d].reverse().find(({ slot: D }) => Fo(D) === Fo(x)), V = w ? m.get(String(Ve(w.performer))) : -1;
    for (const D of c[p]) {
      const L = t[D], A = Ve(L);
      if (!(D < V) && !(A == null || !i && f.has(String(A))) && (d.push({ slot: x, performer: L }), i || f.add(String(A)), u(p + 1, f, b + 1), i || f.delete(String(A)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: x, performer: null }), u(p + 1, f, b), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function jo(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Qs(e, t) {
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
      const m = [...new Set(e.map((u) => u.label || ""))].map((u) => `${u}:${a.filter((p) => (p.slot.label || "") === u).map((p) => p.performer.performerId).sort((p, f) => p - f).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => Tt(u) === Tt(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Zs(e) {
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
function Xs(e, t, r = 20) {
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
function el(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function tl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Oa(e, t, r) {
  const o = Ve, i = new Set((t || []).map(o)), a = new Set((r || []).map(Tt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = Tt(l.gender || l.genderIdentity), u = Tt(d.gender || d.genderIdentity), p = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - p || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: Pa, useMemo: Be, useRef: fe, useState: P } = Gr, n = Gr.createElement, La = "/api/plugins/segment-studio";
function Oe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Gt) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Pr();
    return t[e] = r, window.localStorage.setItem(Gt, JSON.stringify(t)), r;
  } catch {
    return Pr();
  }
}
function Pe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Gt) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Gt, JSON.stringify(t));
  } catch {
  }
}
function qr(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Gt) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Wr(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Gt) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Gt, JSON.stringify(t));
  } catch {
  }
}
function nl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function rl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function X(e, t, r = 0) {
  var d;
  const o = await ia(`${La}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = nl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await rl(250 * (r + 1), t == null ? void 0 : t.signal), X(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function ol(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${La}${e}`, o = await ia(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: al(
      o.headers.get("Content-Disposition")
    )
  };
}
function al(e, t = "segment-studio-ai-feedback.zip") {
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
function Re(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Pr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Fa(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function il(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function ja(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function sl(e, t) {
  const { sceneCount: r, segmentCount: o } = ja(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ba(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = ja(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(sl(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await X("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Oe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Pe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Bo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const gt = {
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
function Sc(e, t) {
  return {
    ...(gt[e] || gt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ga(e) {
  return { ...(gt[e] || gt.unreviewed).badge };
}
function Ka(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Ua = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function ll(e, t, r = "not-applicable", o = !1) {
  const i = gt[e] || gt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function dl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function cl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function ul(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function ml(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function ir(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function gl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Kt({ state: e, includeLabel: t = !0 }) {
  const r = gt[e] || gt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ga(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function pl(e, t = null) {
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
function kc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function fl(e, t = document) {
  return !(e.defaultPrevented || pl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function wc(e, t = document, r = !1, o = {}) {
  return fl(e, t) ? Ts(e, r, o) != null : !1;
}
function it(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function yl(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function bt(e) {
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
function bl(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Vr(e, t = !0) {
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
function Yn(e, t = !0) {
  return {
    type: "segment",
    identity: Vr(e, t),
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
function dt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: Vr(r, t),
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
function Qn(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: Vr(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function rr(e) {
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
function za(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function _a(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Jr(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function hl(e, t) {
  const r = (t || []).map((i) => za(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: nt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function vl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : hl(e, t);
}
function xl({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Nc(e, t) {
  return Jr(za(e, t));
}
function nt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function Sl(e, t) {
  const r = (d) => nt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
    m.forEach((p, f) => l.push({
      sourceSlotDefinitionId: p.id,
      derivedSlotDefinitionId: u[f].id
    }));
  }
  return l;
}
function kl(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = Sl(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function wl(e) {
  const t = nt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(sr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function sr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function or(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Go(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: or(o),
    trackCount: Math.max(1, t.length)
  };
}
function Nl(e) {
  const t = e.map(nt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function Il(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Go({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = Nl(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), p = [...new Map(m.map((b) => [
          Number(b.performerId),
          { id: Number(b.performerId), name: b.performerName || `Performer ${b.performerId}` }
        ])).values()], f = l.slots.map((b) => ({
          slotDefinitionId: String(b.slotDefinitionId),
          label: c.get(String(b.slotDefinitionId)),
          performer: {
            id: Number(b.performerId),
            name: b.performerName || `Performer ${b.performerId}`
          }
        }));
        s.set(d, {
          ...e,
          key: `${e.key}:performers:${d}`,
          performerLabel: u,
          performers: p,
          performerAssignments: f,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Go);
}
function Bt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => Il(s, a));
}
function Yr(e) {
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
    for (const s of tt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const $l = {
  group: 38,
  lane: 33,
  segment: 41
};
function Cl(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = $l[s.kind];
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
function Ha(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function Tl(e, t = [], r = !0) {
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
function Al(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: or(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Yr(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: or(a)
    };
  });
}
function qa(e, { nativeOnly: t = !1 } = {}) {
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
function Ko(e, t) {
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
function Rt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Rn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Rl(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Mn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? Rl(e.name) : "—"),
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
function Wa({ assignments: e, className: t = "" }) {
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
      n(Mn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function lr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = fe(null), i = `performer-slots-${Pa()}`, [a, s] = P(null);
  function l() {
    var p;
    const c = (p = o.current) == null ? void 0 : p.getBoundingClientRect();
    if (!c) return;
    const g = Math.max(0, Math.min(256, window.innerWidth - 16)), m = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), u = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - g - 8, c.right - g)),
      top: u >= m + 8 ? c.bottom + 4 : Math.max(8, c.top - m - 4),
      width: g
    });
  }
  ye(() => {
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
    ...e.slice(0, 3).map((c) => n(Mn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Gi(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Wa, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Mn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Ml(e, t) {
  const r = new Set(Rt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Va(e, t) {
  return t ? Rt(e).filter((r) => r !== t) : Rt(e);
}
function El(e, t) {
  const r = Rt(t), o = new Set(Rt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function mt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Uo(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Lr(e, t, r, o = null) {
  var g, m, u, p, f, b;
  const i = e.findIndex((y) => y.markers.some((N) => N.segment.id === t));
  if (i < 0) {
    const y = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && y.sort((N, x) => Uo(N, x, o)), ((m = y[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((y) => y.segment.id === t);
  if (r === "left" || r === "right") {
    const y = r === "left" ? -1 : 1, N = Math.min(a.markers.length - 1, Math.max(0, s + y));
    return ((u = a.markers[N]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((p = a.markers[s]) == null ? void 0 : p.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((f = a.markers[s]) == null ? void 0 : f.segment) ?? null : ((b = [...e[l].markers].sort(c ? (y, N) => Uo(y, N, Number(o)) : (y, N) => Math.abs(y.segment.startSec - d) - Math.abs(N.segment.startSec - d) || y.segment.startSec - N.segment.startSec || y.segment.id - N.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function Dl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Lr([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Ol(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Pl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Ll(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [Ho(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => Ho(Math.min(s, r + l))))];
}
function Fl(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function jl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Fr(e, t) {
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
function zo(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Bl(e) {
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
async function Gl(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await _o(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Ll(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await _o(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const p = await Kl(o), f = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: f, timestampSec: u }), s.push({
          fieldName: f,
          file: new File(
            [p],
            `${f}.jpg`,
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
function _o(e, t) {
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
function Kl(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Ho(e) {
  return Math.round(e * 1e3) / 1e3;
}
function ar(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ul(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function jr(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function En(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ja(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Tr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function zl(e, t) {
  const r = [...t || []].sort((s, l) => s.startSec - l.startSec || s.id - l.id), o = r[0];
  if (!o) return e;
  const i = new Set(r.slice(1).map((s) => s.id)), a = {
    ...o,
    startSec: r[0].startSec,
    endSec: Math.max(...r.map((s) => s.endSec ?? s.startSec)),
    sourceKey: "user",
    sourceRunId: null,
    confidence: null,
    isDerived: !1
  };
  return {
    ...e,
    segments: (e.segments || []).filter((s) => !i.has(s.id)).map((s) => s.id === o.id ? a : s).sort((s, l) => s.startSec - l.startSec || s.id - l.id)
  };
}
function qo(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function _l(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: p, pendingFirstSegmentStartSecRef: f, pendingTagEditSegmentIdRef: b, replaceSegmentSelection: y, savingSegmentId: N, segments: x, selectedSegment: w, selectedSegmentIdRef: V, selectedSegments: D, selectionAnchorIdRef: L, selectionRangeBaseIdsRef: A, setEditorFilters: C, setFirstSegmentTagOpen: E, setHideDerivedSegments: O, setHistory: z, setHistoryOpen: H, setPublishApprovedError: B, setSaveMessage: I, setSavingSegmentId: $, setSelectedSegmentGroupKey: F, setSelectedSegmentId: Z, setSelectedSegmentIds: le, startInput: pe, timelineDuration: ge, video: j } = e;
  function te(M) {
    l.current = M || kt, z(l.current);
  }
  async function ue(M, se, S, k, R = null) {
    var h;
    try {
      const v = await X(`/videos/${j.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: M,
          label: se,
          beforeState: S,
          afterState: k,
          receiptId: R
        })
      });
      return te(v), !0;
    } catch (v) {
      return v.status === 409 && ((h = v.payload) != null && h.current) && te(v.payload.current), I("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function oe(M, se, S = !0, k = null, R = !1, h = se) {
    var ee;
    if (!M || N != null) return null;
    const v = D.map((we) => we.id), G = V.current, ie = S && !t ? crypto.randomUUID() : null;
    $(M.id), I(S ? "Saving directly to Cove…" : "Restoring history…");
    const ne = R ? ar(o, [M.id], h) : null;
    ne && g(ne, j.id);
    try {
      if (t && M.nativeSegmentId == null && M.itemId != null) {
        const q = `draft-update:${j.id}:${M.itemId}:${M.revision}:${se.tagId}:${se.startSec}:${se.endSec ?? "open"}:${se.reviewState ?? M.reviewState}`, K = await X(`/videos/${j.id}/drafts/${M.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Oe(q),
            expectedRevision: M.revision,
            startSec: se.startSec,
            endSec: se.endSec,
            tagId: se.tagId,
            reviewState: se.reviewState
          })
        });
        Pe(q);
        const re = {
          ...M,
          ...K.draft,
          id: M.id,
          itemId: M.itemId
        };
        return S && await ue(
          "segment.update",
          k || "Changed segment",
          Yn(M, t),
          Yn(
            re,
            t
          )
        ), qo(M, se, t) ? await m() : g({
          ...o,
          approvedSetVersion: K.approvedSetVersion || o.approvedSetVersion,
          segments: x.map((ce) => ce.id === M.id ? re : ce).sort((ce, Ee) => ce.startSec - Ee.startSec || ce.id - Ee.id)
        }, j.id), I(((ee = K.draft) == null ? void 0 : ee.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), re;
      }
      const we = await X(`/videos/${j.id}/segments/${M.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...se,
          expectedUpdatedAt: M.updatedAt,
          historyReceiptId: ie
        })
      }), Y = {
        ...M,
        ...we,
        reviewState: se.reviewState ?? M.reviewState
      }, Q = x.map((q) => q.id === M.id ? Y : q).sort((q, K) => q.startSec - K.startSec || q.id - K.id);
      return qo(M, se, t) ? await m() : g({ ...o, segments: Q }, j.id), S && await ue(
        "segment.update",
        k || "Changed segment",
        Yn(M, t),
        Yn(
          Y,
          t
        ),
        ie
      ), I(S ? "Saved to Cove" : "History restored"), Y;
    } catch (we) {
      return R && (g((Y) => En(
        Y,
        [M],
        Object.keys(h)
      ), j.id), le(v), Z(G), L.current = G, A.current = []), we.status === 409 ? (I("Conflict — loading the latest segment…"), await c()) : I(we.message || "Unable to save the segment."), null;
    } finally {
      $(null);
    }
  }
  async function he() {
    if (!t) return !1;
    const M = x.filter((S) => !S.published && S.reviewState === "approved").length;
    if (M === 0 || N != null) return !1;
    const se = `complete-review:${j.id}:${o.approvedSetVersion}`;
    B(""), $(-1), I(`Publishing ${M} Approved draft${M === 1 ? "" : "s"}…`);
    try {
      const S = await X(`/videos/${j.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(se),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Pe(se), te(kt), H(!1);
      const k = await m(), R = Fs(
        x,
        V.current,
        S.published
      ), h = R ? Ke(k == null ? void 0 : k.segments, R) : null;
      return h && Z(h.id), I(`${S.published.length} Approved draft${S.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (S) {
      const k = S.status === 409 ? "The approved drafts changed. Review the updated list and try again." : S.message || "Unable to publish the approved drafts.";
      return S.status === 409 && await c(), B(k), I(k), !1;
    } finally {
      $(null);
    }
  }
  async function xe(M = null, se = null) {
    var Y;
    if (N != null) return;
    const S = M != null ? f.current : null, k = Number.isFinite(S) ? S : r, R = Math.min(ge, k + 20);
    if (R <= k) {
      I("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const h = Ls(x, w, M);
    if (h.kind === "choose-tag") {
      f.current = k, I(""), E(!0);
      return;
    }
    if (h.kind === "invalid-selection") {
      I("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: v } = h, G = `create-draft:${j.id}:${v}:${k}`, ie = t ? null : crypto.randomUUID(), ne = V.current, ee = {
      ...w || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: v,
      tagName: se || (w == null ? void 0 : w.tagName) || "Tag segment",
      tagSortName: v === (w == null ? void 0 : w.tagId) && (w == null ? void 0 : w.tagSortName) || null,
      startSec: k,
      endSec: R,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, we = Ul(o, ee);
    $(-1), E(!1), g(we, j.id), y(ee.id), F(mt(
      Bt(we.segments, we.segmentGroups || [], we.performerSlots || []),
      ee.id
    ));
    try {
      let Q;
      if (t) {
        const re = await X(`/videos/${j.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Oe(G), tagId: v, startSec: k, endSec: R })
        });
        Pe(G), Q = { itemId: (Y = re.draft) == null ? void 0 : Y.itemId };
      } else
        Q = { nativeSegmentId: (await X(`/videos/${j.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: v,
            startSec: k,
            endSec: R,
            historyReceiptId: ie
          })
        })).id };
      f.current = null, E(!1);
      const q = await m();
      if (!q) {
        g((re) => jr(
          re,
          [ee.id]
        ), j.id), y(ne), I("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const K = Ke(q == null ? void 0 : q.segments, Q);
      K ? (t || await ue(
        "segment.create",
        "Created segment",
        dt([], !1),
        dt([K], !1),
        ie
      ), h.openTagEditor && (b.current = K.id), y(K.id), F(mt(
        Bt(q.segments || [], q.segmentGroups || [], q.performerSlots || []),
        K.id
      ))) : I("Segment created, but it could not be selected.");
    } catch (Q) {
      g((q) => jr(
        q,
        [ee.id]
      ), j.id), y(ne), M != null && E(!0), I(Q.message || "Unable to create the draft.");
    } finally {
      $(null);
    }
  }
  async function T() {
    if (D.length !== 1 || !w || N != null) return;
    const M = r;
    if (M <= w.startSec || w.endSec != null && M >= w.endSec) {
      I("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const se = `split-draft:${w.itemId}:${w.revision}:${M}`, S = t ? null : dt([w], !1), k = t ? null : crypto.randomUUID();
    $(w.id);
    try {
      let R = null;
      t && w.nativeSegmentId == null ? (await X(`/videos/${j.id}/drafts/${w.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(se),
          expectedRevision: w.revision,
          splitSec: M
        })
      }), Pe(se)) : R = { nativeSegmentId: (await X(`/videos/${j.id}/segments/${w.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: w.updatedAt,
          splitSec: M,
          historyReceiptId: k
        })
      })).id };
      const h = await m();
      if (!t) {
        const v = [
          Ke(h == null ? void 0 : h.segments, {
            nativeSegmentId: w.nativeSegmentId ?? w.id
          }),
          Ke(
            h == null ? void 0 : h.segments,
            R
          )
        ].filter(Boolean);
        await ue(
          "segment.split",
          "Split segment",
          S,
          dt(v, !1),
          k
        );
      }
      I(t ? `Segment split; both ranges remain ${w.reviewState}.` : "Segment split.");
    } catch (R) {
      R.status === 409 ? await c() : I(R.message || "Unable to split the draft.");
    } finally {
      $(null);
    }
  }
  async function J(M = !1) {
    var R, h;
    if (D.length !== 1 || !w || N != null) return;
    const se = M ? r : w.startSec, S = Ps(j.id, w, M, se), k = t ? null : crypto.randomUUID();
    $(w.id);
    try {
      const v = ((R = p.current) == null ? void 0 : R.operationKey) === S ? p.current : null;
      let G = (v == null ? void 0 : v.duplicateIdentity) ?? null;
      if (G == null && t && w.nativeSegmentId == null) {
        const ee = await X(`/videos/${j.id}/drafts/${w.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Oe(S),
            expectedRevision: w.revision,
            startSec: M ? se : null
          })
        });
        G = Ro(!1, ee), p.current = { operationKey: S, duplicateIdentity: G };
      } else if (G == null) {
        const ee = await X(`/videos/${j.id}/segments/${w.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: w.updatedAt,
            startSec: M ? se : null,
            historyReceiptId: k
          })
        });
        G = Ro(!0, ee), p.current = { operationKey: S, duplicateIdentity: G };
      }
      const ie = await m(), ne = Ke(ie == null ? void 0 : ie.segments, G);
      if (ne) {
        t || await ue(
          "segment.duplicate",
          "Duplicated segment",
          dt([], !1),
          dt([ne], !1),
          k
        );
        const ee = ls(
          ne,
          ie.performerSlots || [],
          i,
          s,
          ie.segmentGroups || []
        );
        C(ee.filters), O(ee.hideDerivedSegments), le([ne.id]), Z(ne.id), L.current = ne.id, A.current = [], F(mt(
          Bt(ie.segments || [], ie.segmentGroups || [], ie.performerSlots || []),
          ne.id
        )), t && w.nativeSegmentId == null && Pe(S), p.current = null, I(M ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        I("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (v) {
      ((h = p.current) == null ? void 0 : h.operationKey) === S ? I("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : v.status === 409 ? await c() : I(v.message || "Unable to duplicate the draft.");
    } finally {
      $(null);
    }
  }
  async function _() {
    if (D.length !== 1 || !w) return;
    const M = Number(pe), se = a.trim() === "" ? null : Number(a), S = No(M, se, d);
    if (S.error) {
      I(S.error);
      return;
    }
    if (M === w.startSec && se === w.endSec) {
      I("Timing is unchanged.");
      return;
    }
    await oe(w, { startSec: M, endSec: se, tagId: w.tagId }, !0, null, !0);
  }
  async function ae(M, se) {
    if (D.length !== 1 || !w) return;
    const S = No(M, se, d);
    if (S.error) {
      I(S.error);
      return;
    }
    if (M === w.startSec && se === w.endSec) {
      I("Timing is unchanged.");
      return;
    }
    await oe(w, { startSec: M, endSec: se, tagId: w.tagId }, !0, null, !0);
  }
  return { acceptHistory: te, recordHistoryAction: ue, mutateSegment: oe, completeReview: he, createSegment: xe, splitSegment: T, duplicateSegment: J, saveTiming: _, applyShortcutTiming: ae };
}
function Hl() {
  const [e, t] = P(() => typeof window < "u" && window.matchMedia(So).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(So), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function ql() {
  const [e, t] = P(() => typeof window < "u" && window.matchMedia(ko).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Wl() {
  try {
    return ns(window.localStorage.getItem(ga));
  } catch {
    return { ...at };
  }
}
function Vl() {
  try {
    return Rt(JSON.parse(window.localStorage.getItem(pa) || "[]"));
  } catch {
    return [];
  }
}
function Jl(e) {
  try {
    window.localStorage.setItem(pa, JSON.stringify(Rt(e)));
  } catch {
  }
}
function Yl(e) {
  try {
    window.localStorage.setItem(ga, JSON.stringify(e));
  } catch {
  }
}
function Ql() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ya) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Zl(e) {
  try {
    return window.localStorage.setItem(ya, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Xl({ status: e }) {
  const t = Ua[e];
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
function At({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, tt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...Ga(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${gt[t].symbol}${e[t]}`)));
}
function ed({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: m }) {
  const u = Hr(a), [p, f] = P(() => Cr(o, u)), [b, y] = P(!1), [N, x] = P(""), w = fe(!1), V = o.map((O) => `${O.slotDefinitionId}:${O.performerId || ""}`).join("|"), D = u.map((O) => Ve(O)).join("|"), L = Da(
    o,
    u
  );
  ye(() => {
    f(Cr(o, u)), x("");
  }, [t, r, V, D]);
  async function A(O = p) {
    if (!w.current) {
      w.current = !0, y(!0), x("Saving performer slots…");
      try {
        const z = Cr(o.map((I) => ({
          ...I,
          performerId: O[I.slotDefinitionId] || null
        })), u), H = o.map((I) => {
          const $ = z[I.slotDefinitionId] ? Number(z[I.slotDefinitionId]) : null, F = u.find((Z) => String(Ve(Z)) === String($));
          return {
            ...I,
            performerId: $,
            performerName: (F == null ? void 0 : F.name) || null
          };
        });
        s(H);
        const B = await X(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((I) => ({ slotDefinitionId: I.slotDefinitionId, performerId: z[I.slotDefinitionId] ? Number(z[I.slotDefinitionId]) : null }))
          })
        });
        x("Performer slots saved."), await l(B, {
          beforeState: rr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: rr([{
            segmentId: t,
            itemId: r,
            revision: B.revision,
            slots: B.slots || []
          }])
        });
      } catch (z) {
        d && await d(o, z), z.status === 409 ? (x("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : x(z.message || "Unable to save performer slots.");
      } finally {
        w.current = !1, y(!1);
      }
    }
  }
  function C(O, z) {
    x(`Option ${z + 1} applied; save to confirm.`), f({ ...p, ...O.assignments });
  }
  async function E(O) {
    const z = { ...p, ...O.assignments };
    f(z), await A(z);
  }
  return ye(() => {
    if (m)
      return m.current = (O) => w.current || !L[O] ? !1 : (E(L[O]), !0), () => {
        m.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    L.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, L.map((O, z) => n("button", {
        key: z,
        type: "button",
        disabled: b,
        onClick: () => C(O, z),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${z + 1}: ${O.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, z + 1),
        n("span", { key: "description" }, O.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${L.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((O) => n("label", { key: O.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, nt(O)),
      (O.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(O.genderHints || []).map(sr).join(" · ")}`) : null,
      n("select", { key: "select", value: p[O.slotDefinitionId] || "", disabled: b, onChange: (z) => f({ ...p, [O.slotDefinitionId]: z.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Oa(u, u, O.genderHints).map((z) => n("option", { key: Ve(z), value: Ve(z) }, z.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: b, onClick: () => A(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, N)])
  ]);
}
function td({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var L;
  const s = ((L = t[0]) == null ? void 0 : L.slots) || [], l = Hr(r), d = Da(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((A, C) => {
    const E = t.map((O) => {
      var z;
      return String(((z = O.slots[C]) == null ? void 0 : z.performerId) || "");
    });
    return [A.slotDefinitionId, E.every((O) => O === E[0]) ? E[0] : c];
  })), [m, u] = P(g), [p, f] = P(!1), [b, y] = P(""), N = fe(!1), x = t.map((A) => `${A.itemId ?? `native:${A.segmentId}`}:${A.revision}:${A.slots.map((C) => `${C.slotDefinitionId}:${C.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    u(g());
  }, [x]);
  async function w(A = m) {
    if (N.current) return;
    N.current = !0, f(!0), y(`Saving performer slots for ${t.length} segments…`);
    const C = [];
    try {
      for (const E of t) {
        const O = E.slots.map((H, B) => {
          const I = A[s[B].slotDefinitionId];
          return {
            slotDefinitionId: H.slotDefinitionId,
            performerId: I === c ? H.performerId || null : I ? Number(I) : null
          };
        }), z = await X(E.itemId != null ? `/videos/${e}/drafts/${E.itemId}/slots` : `/videos/${e}/segments/${E.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: E.revision, assignments: O })
        });
        C.push({
          segmentId: E.segmentId,
          itemId: E.itemId,
          revision: z.revision,
          slots: z.slots || []
        });
      }
      y("Performer slots saved."), o({
        beforeState: rr(t),
        afterState: rr(C)
      });
    } catch (E) {
      const O = await i();
      E.status === 409 ? y(O ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : y(E.message || (O ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      N.current = !1, f(!1);
    }
  }
  function V(A, C) {
    y(`Option ${C + 1} applied; save to confirm.`), u({ ...m, ...A.assignments });
  }
  async function D(A) {
    const C = { ...m, ...A.assignments };
    u(C), await w(C);
  }
  return ye(() => {
    if (a)
      return a.current = (A) => N.current || !d[A] ? !1 : (D(d[A]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((A, C) => n("button", {
        key: C,
        type: "button",
        disabled: p,
        onClick: () => V(A, C),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${C + 1} to all selected segments: ${A.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, C + 1),
        n("span", { key: "description" }, A.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((A) => n("label", {
      key: A.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, nt(A)),
      n("select", {
        key: "select",
        value: m[A.slotDefinitionId] || "",
        disabled: p,
        onChange: (C) => u({ ...m, [A.slotDefinitionId]: C.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[A.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Oa(l, l, A.genderHints).map((C) => n("option", {
          key: Ve(C),
          value: Ve(C)
        }, C.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: p,
        onClick: () => w(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function pt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function nd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return pt(t);
  const o = [...new Set(r.map((i) => pt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function dr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Zn({ name: e }) {
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
function rd({ hidden: e }) {
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
    n(dr, { key: "derived" })
  ]);
}
function od({ segment: e, provenance: t }) {
  var g;
  const [r, o] = P(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = nd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const u = m.modelIdentifier || m.modelKey, p = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return n("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            pt(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${p == null ? "" : ` · ${p}`}`
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
function ad({
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
  const [m, u] = P([]), p = e.flatMap((N) => N.lanes.map((x) => x.key)), f = p.join("|");
  ye(() => {
    const N = new Set(p);
    u((x) => x.filter((w) => N.has(w)));
  }, [f]);
  const b = or(t), y = !!qa(
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
        `${p.length} swimlane${p.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(At, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      xl({ mergeable: y, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((N) => n("section", {
      key: N.key,
      "data-selected-segment-group": N.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, N.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${N.selectedCount} selected`)
      ]),
      ...N.lanes.map((x) => {
        const w = m.includes(x.key), V = x.markers.some(({ segment: L }) => L.id === r), D = `selected-segment-lane-${x.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: x.key,
          "data-selected-segment-lane": x.key,
          className: `rounded-md border ${V ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": w,
            "aria-controls": D,
            "aria-current": V ? "true" : void 0,
            onClick: () => u((L) => w ? L.filter((A) => A !== x.key) : [...L, x.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, w ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Rn(x)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(x.selectedCount)),
            a ? n(At, { key: "states", counts: x.counts }) : null
          ]),
          w ? n("div", {
            key: "segments",
            id: D,
            className: "space-y-1 border-t border-border p-1.5"
          }, x.markers.map(({ segment: L }) => {
            const A = L.endSec == null ? Re(L.startSec) : `${Re(L.startSec)} – ${Re(L.endSec)}`;
            return n("button", {
              key: L.id,
              type: "button",
              onClick: () => i(L),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${L.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${L.tagName || "Segment"}, ${L.reviewState}, ${A}` : `${L.tagName || "Segment"}, ${A}`,
              "aria-current": L.id === r ? "true" : void 0
            }, [
              a ? n(Kt, {
                key: "state",
                state: L.reviewState,
                includeLabel: !1
              }) : null,
              L.isDerived ? n(dr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, A),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                pt(L.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Nn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, Wo = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Vo = [
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
function On(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Ya(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Jo(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Xn(e, t, r, o = null) {
  const i = Jo(t), a = Jo(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function id(e, t, r = null) {
  var m, u, p;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Xn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Xn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Xn(o, t.performersCriterion, "performer"), Xn(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Yo(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Yo(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (p = t.shotBoundariesCriterion) == null ? void 0 : p.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Yo(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function sd(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Qa({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Bo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, tt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = gt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Bo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Za({ item: e, selected: t, selectionActive: r, onSelect: o }) {
  return o ? n("button", {
    type: "button",
    "aria-label": t ? "Deselect item" : "Select item",
    "aria-pressed": t,
    onClick: (i) => {
      i.preventDefault(), i.stopPropagation(), o(e.videoId, i.shiftKey);
    },
    className: `absolute left-0.5 top-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-md transition-opacity ${t || r ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`
  }, n("span", {
    className: `flex h-4 w-4 items-center justify-center rounded border shadow-sm ${t ? "border-accent bg-accent text-white" : "border-border bg-background/95 text-transparent"}`
  }, n("svg", {
    viewBox: "0 0 16 16",
    className: "h-3 w-3",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  }, n("path", { d: "M3.5 8.25 6.5 11.25 12.5 4.75" })))) : null;
}
function ld({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative flex min-h-full flex-col overflow-hidden rounded-md border bg-card shadow-sm transition-colors hover:border-accent/60 ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    i ? null : n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (l) => On(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Za, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Ki(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Qa, { item: e, showReviewStates: r }))
    ])
  ]);
}
function dd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Za, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => On(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Qa, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function Qr({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Ks(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => On(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && en(
        o,
        wt.recyclingBinView
      ) ? n(Xa, { key: "bin", onNavigate: t }) : null,
      n(ei, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Br = "segment-studio:recycling-bin-changed";
function cd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Cn() {
  window.dispatchEvent(new CustomEvent(Br));
}
function Xa({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = P(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await X("/bin"), m = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(m) && m >= 0 ? Math.trunc(m) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(Br, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Br, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = cd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => On(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function ei({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => On(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function ud({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Or(i.target.value);
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
function md({ minimum: e, maximum: t, onChange: r }) {
  const o = fe(null), [i, a] = P("maximum"), s = (u, p) => {
    const f = us(e, t, u, p);
    a(f.coincidentTop), r({ minimum: f.minimum, maximum: f.maximum });
  }, l = (u, p) => {
    var b;
    const f = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    f && s(u, cs(p.clientX, f.left, f.width));
  }, d = (u, p) => {
    var f, b;
    p.preventDefault(), (b = (f = p.currentTarget).setPointerCapture) == null || b.call(f, p.pointerId), l(u, p);
  }, c = (u, p) => {
    var f, b;
    (b = (f = p.currentTarget).hasPointerCapture) != null && b.call(f, p.pointerId) && l(u, p);
  }, g = (u, p) => {
    const f = u === "minimum" ? e : t, b = u === "minimum" ? 0 : e, y = u === "minimum" ? t : 1, N = p.shiftKey ? 0.1 : 0.01;
    let x = null;
    ["ArrowLeft", "ArrowDown"].includes(p.key) && (x = f - N), ["ArrowRight", "ArrowUp"].includes(p.key) && (x = f + N), p.key === "PageDown" && (x = f - 0.1), p.key === "PageUp" && (x = f + 0.1), p.key === "Home" && (x = b), p.key === "End" && (x = y), x != null && (p.preventDefault(), s(u, Math.min(y, Math.max(b, x))));
  }, m = (u, p) => n("span", {
    key: u,
    role: "slider",
    tabIndex: 0,
    "aria-label": u === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((u === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((u === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(p * 100),
    "aria-valuetext": `${Math.round(p * 100)} percent`,
    onPointerDown: (f) => d(u, f),
    onPointerMove: (f) => c(u, f),
    onKeyDown: (f) => g(u, f),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${p * 100}%`,
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
function gd({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = fe(null);
  ye(() => {
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
    onKeyDownCapture: (s) => it(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
    n(Tn, {
      key: "tag",
      entityType: "tag",
      value: null,
      selectedDisplay: "input",
      selectedLabel: "",
      onChange: (s, l) => {
        s != null && r(s, l == null ? void 0 : l.label);
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
function pd({
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
  const m = ct(e), u = [...new Map((a || []).map((y) => [
    Number(y.tagId),
    y.tagName || `Tag ${y.tagId}`
  ])).entries()].sort((y, N) => y[1].localeCompare(N[1]) || y[0] - N[0]), p = (y) => d(ct({ ...m, ...y })), f = (y) => p({
    reviewStates: m.reviewStates.includes(y) ? m.reviewStates.filter((N) => N !== y) : [...m.reviewStates, y]
  }), b = (y) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${y ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && g();
    },
    onKeyDownCapture: (y) => it(y, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
        n("div", { className: "flex flex-wrap gap-2" }, tt.map((y) => {
          const N = m.reviewStates.includes(y), x = gt[y];
          return n("button", {
            key: y,
            type: "button",
            onClick: () => f(y),
            "aria-pressed": N,
            className: b(N)
          }, `${x.symbol} ${y} (${i[y] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => p({ performerId: null }),
            "aria-pressed": m.performerId == null,
            className: b(m.performerId == null)
          }, "All performers"),
          ...r.map((y) => {
            const N = Number(Ve(y));
            return n("button", {
              key: N,
              type: "button",
              onClick: () => p({ performerId: N }),
              "aria-pressed": m.performerId === N,
              className: b(m.performerId === N)
            }, y.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: m.tagId ?? "",
            onChange: (y) => p({
              tagId: y.target.value === "" ? null : Number(y.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...u.map(([y, N]) => n("option", { key: y, value: y }, N))
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
            onChange: (y) => p({
              segmentGroupId: y.target.value === "" ? null : y.target.value === "ungrouped" ? "ungrouped" : Number(y.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((y) => n("option", { key: y.id, value: y.id }, y.name)),
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
            onClick: () => p({ sourceKey: null }),
            "aria-pressed": m.sourceKey == null,
            className: b(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((y) => n("button", {
            key: y,
            type: "button",
            onClick: () => p({ sourceKey: y }),
            "aria-pressed": m.sourceKey === y,
            title: y,
            className: b(m.sourceKey === y)
          }, pt(y)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(md, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: y, maximum: N }) => p({
            confidenceMin: y,
            confidenceMax: N
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
            onChange: (y) => p({
              includeUnscored: y.target.checked
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
          onChange: (y) => c(y.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(rd, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(ct({})), l && c(!1);
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
function fd({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Dn.filter((l) => Xt(l, e)), i = To(o, 1)[0], a = To(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(Ca)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => it(l, { onCancel: r })
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
function yd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Bl(e), [l, d] = P([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => it(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((g, m) => {
        const u = l.includes(g.tagName), p = `incorrect-example-tag-${m}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": u,
            "aria-controls": p,
            onClick: () => d((f) => u ? f.filter((b) => b !== g.tagName) : [...f, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: ir(!1) }
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
            id: p,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((f) => {
            const b = `${Re(f.startSec)}${f.endSec == null ? "" : ` – ${Re(f.endSec)}`}`, y = r === f.id;
            return n("div", {
              key: f.id,
              className: "flex items-center justify-between gap-3 px-3 py-2 text-sm"
            }, [
              n(
                "span",
                { key: "time", className: "font-mono text-xs text-secondary" },
                b
              ),
              n("button", {
                key: "remove",
                type: "button",
                disabled: t || r != null,
                onClick: () => i(f),
                "aria-label": `${y ? "Restoring" : "Restore to review"} ${g.tagName} example at ${b}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, y ? "Restoring…" : "Restore to review")
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
function bd({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = P(""), [a, s] = P(0), l = fe(null), d = Be(() => Xs(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = tl(d);
  ye(() => {
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
      var p;
      if (u.key === "Tab")
        bt(u);
      else if (u.key === "Escape")
        u.preventDefault(), u.stopPropagation(), r();
      else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
        u.preventDefault(), u.stopPropagation();
        const f = u.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + f + d.length) % d.length : 0);
      } else u.key === "Enter" && !((p = u.nativeEvent) != null && p.isComposing) && (u.preventDefault(), u.stopPropagation(), m());
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
    }, d.length ? d.flatMap((u, p) => {
      var D;
      const f = u.segment || u, b = f.endSec == null ? Re(f.startSec) : `${Re(f.startSec)} – ${Re(f.endSec)}`, y = `${pt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`, N = p === c, x = p > 0 ? d[p - 1].groupKey : null, w = g && u.groupKey !== x ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, V = n("button", {
        key: f.id,
        id: `segment-quick-search-${f.id}`,
        ref: N ? l : null,
        type: "button",
        role: "option",
        "aria-selected": N,
        onMouseEnter: () => s(p),
        onClick: () => t(f),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${N ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${u.groupName} group`) : null,
        n(Kt, { key: "review", state: f.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          f.tagName || "Tag segment"
        ),
        (D = u.performers) != null && D.length ? n(lr, {
          key: "performers",
          performers: u.performers,
          performerAssignments: u.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          b
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: y
        }, y)
      ]);
      return w ? [w, V] : [V];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function hd(e) {
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
function vd({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Be(() => hd(e), [e]), [l, d] = P([]), c = s.reduce((u, p) => u + p.drafts.length, 0), g = (u) => d((p) => p.includes(u) ? p.filter((f) => f !== u) : [...p, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => it(u, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
      ].flatMap(([u, p]) => [
        n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
        n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((u) => {
        const p = l.includes(u.key);
        return n("section", { key: u.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": m(u),
            onClick: () => g(u.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: ir(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, u.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.drafts.length} draft${u.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: m(u),
            className: "divide-y divide-border border-t border-border"
          }, u.drafts.map((f) => {
            const b = f.endSec == null ? Re(f.startSec) : `${Re(f.startSec)} – ${Re(f.endSec)}`, y = `${pt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", { key: f.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Kt, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: y
              }, y)
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
function xd({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Zs(e), [s, l] = P(() => /* @__PURE__ */ new Set()), [d, c] = P(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), m = (b) => l((y) => {
    const N = new Set(y);
    return N.has(b) ? N.delete(b) : N.add(b), N;
  }), u = (b) => c((y) => {
    const N = new Set(y);
    return N.has(b) ? N.delete(b) : N.add(b), N;
  }), p = (b) => b.assignment.map(({ slot: y, performer: N }) => `${y.label || `Slot ${y.sortOrder + 1}`}: ${N.name}`).join(", "), f = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || it(b, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
      e.length ? n("div", { className: "space-y-3" }, a.map((b) => n("section", { key: b.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
        n("header", {
          key: "header",
          className: "flex min-w-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2",
          style: { background: ir(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => u(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${p(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": f(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${p(b)}`,
            onClick: () => m(b.key),
            className: "shrink-0 rounded px-1 text-sm text-secondary hover:bg-muted/50 hover:text-foreground disabled:opacity-50"
          }, s.has(b.key) ? "▾" : "▸"),
          n(
            "span",
            { key: "tag", className: "min-w-24 flex-1 truncate text-sm font-semibold text-foreground" },
            b.tagName
          ),
          n(
            "span",
            { key: "performers", className: "flex min-w-0 flex-wrap items-center gap-2" },
            b.assignment.map(({ slot: y, performer: N }) => {
              const x = y.label || `Slot ${y.sortOrder + 1}`;
              return n("span", {
                key: y.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${x}: ${N.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${x}: ${N.name}`
                }, `${x}: ${N.name}`),
                n(Mn, {
                  key: "avatar",
                  performer: { id: N.performerId, name: N.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(At, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${p(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: f(b), className: "divide-y divide-border/70" },
          b.candidates.map((y) => {
            const N = y.endSec == null ? Re(y.startSec) : `${Re(y.startSec)} – ${Re(y.endSec)}`, x = `${pt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", {
              key: y.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Kt, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                y.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                N
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: x
              }, x)
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
function Sd({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => it(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
    className: "w-full max-w-lg overflow-hidden rounded-lg border border-border bg-card shadow-2xl"
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-delete-rejected-title", className: "text-lg font-semibold text-foreground" }, "Permanently delete rejected segments?"),
      n(
        "p",
        { key: "summary", className: "mt-1 text-sm text-secondary" },
        `${o} rejected segment${o === 1 ? "" : "s"}${i ? ` and ${i} dependent derived segment${i === 1 ? "" : "s"}` : ""} will be deleted (${a} total).`
      )
    ]),
    n("div", { key: "body", className: "space-y-2 px-5 py-4 text-sm text-secondary" }, [
      s ? n("p", { key: "retained" }, `${s} shared derived segment${s === 1 ? "" : "s"} will be kept.`) : null,
      l ? n("p", { key: "deferred" }, `${l} feedback-protected rejected segment${l === 1 ? "" : "s"} will be kept until AI feedback is exported.`) : null,
      n("p", { key: "warning", className: "font-medium text-foreground" }, "This cannot be undone.")
    ]),
    n("footer", { key: "footer", className: "flex justify-end gap-2 border-t border-border px-5 py-4" }, [
      n("button", { key: "cancel", type: "button", autoFocus: !0, onClick: r, className: "rounded-md border border-border px-3 py-1.5 text-sm" }, "Cancel"),
      n("button", { key: "confirm", type: "button", onClick: t, className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25" }, "Delete permanently")
    ])
  ]));
}
function kd({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = P(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : Re(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => it(c, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
        `${Re(e.startSec)} – ${d}`
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
function wd(e) {
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
function Nd({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = wd(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => it(u, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
        ].flatMap(([u, p]) => [
          n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
          n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(p))
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
                `${u.rootTagName} @ ${Re(u.rootStartSec)}`
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
              u.outputs.map((p, f) => n("div", {
                key: `${p.ruleId}:${p.depth}:${f}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, p.depth - 1) * 1.25}rem` }
              }, [
                n("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                n(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${p.sourceTagName} → ${p.derivedTagName}`
                ),
                n("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${p.depth}`),
                n(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  p.action === "create" ? "Create" : "Link existing"
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
function Id({
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
  video: p,
  slotButtonRef: f,
  tagSearchRef: b,
  onDetailChange: y,
  setSaveMessage: N,
  setSavingSegmentId: x,
  onSlotsChanged: w,
  onRecordHistory: V,
  onCancelQueuedReview: D,
  splitSegment: L,
  duplicateSegment: A,
  provenance: C,
  lineage: E,
  onNavigateLineageItem: O,
  tagEditing: z,
  onCancelTagEditing: H,
  detailPanelRef: B,
  onReduceSelection: I
}) {
  var ue, oe, he, xe;
  const $ = fe(null), F = fe(null), Z = fe(null), le = fe(null), pe = fe(null), [ge, j] = P(!1);
  ye(() => {
    $.current && ($.current.scrollTop = 0), j(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var T, J;
    ge && ((J = (T = F.current) == null ? void 0 : T.querySelector("input, select, button")) == null || J.focus({ preventScroll: !0 }));
  }, [ge]);
  function te() {
    j(!1), requestAnimationFrame(() => {
      var T;
      return (T = f.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const T = !r.some((ae) => ae.isDerived), J = e && c ? vl(m, r) : null, _ = (J == null ? void 0 : J.map((ae, M) => {
      var S;
      const se = r[M];
      return {
        segmentId: se.nativeSegmentId,
        itemId: se.published ? null : se.itemId,
        revision: (S = u.performerSlotRevisions) == null ? void 0 : S[se.id],
        slots: ae
      };
    })) || [];
    return n(Gr.Fragment, null, [
      n(ad, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: B,
        onReduceSelection: I,
        reviewable: e,
        tagEditable: T,
        slotsEditable: _.length > 0 && a == null,
        onEditSlots: () => j(!0),
        slotButtonRef: f,
        saveMessage: i
      }),
      z && T ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ae) => {
          ae.target === ae.currentTarget && H();
        },
        onKeyDownCapture: (ae) => it(ae, { onCancel: H })
      }, n("section", {
        ref: b,
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
        n(Tn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ae, M) => ae == null ? H() : s(ae, M == null ? void 0 : M.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: H,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ge && _.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ae) => {
          ae.target === ae.currentTarget && te();
        },
        onKeyDownCapture: (ae) => {
          var se, S;
          if (!(typeof ((se = ae.target) == null ? void 0 : se.closest) == "function" ? ae.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ae.repeat && !ae.ctrlKey && !ae.altKey && !ae.metaKey && !ae.shiftKey && /^[1-9]$/.test(ae.key) && ((S = pe.current) != null && S.call(pe, Number(ae.key) - 1))) {
            ae.preventDefault(), ae.stopPropagation();
            return;
          }
          it(ae, { onCancel: te });
        }
      }, n("section", {
        ref: F,
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
          n("button", { key: "close", type: "button", onClick: te, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(td, {
          videoId: p.id,
          targets: _,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: pe,
          onSaved: async ({ beforeState: ae, afterState: M }) => {
            await V(
              "performer-slots.assign",
              `Assigned performers to ${_.length} segments`,
              ae,
              M
            ), te(), w();
          },
          onConflict: w
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (T) => {
      $.current = T, B && (B.current = T);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Kt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(dr, { key: "derived" }) : null,
        t && z ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (T) => {
            T.key === "Escape" && (T.preventDefault(), T.stopPropagation(), H());
          },
          onKeyDown: (T) => {
            yl(T, t.tagName) && (T.preventDefault(), T.stopPropagation(), s(t.tagId));
          }
        }, n(Tn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (T, J) => T == null ? H() : s(T, J == null ? void 0 : J.label),
          disabled: a != null || ((ue = E.data) == null ? void 0 : ue.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Re(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Re(t.endSec))
      ]) : null,
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(Xl, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Wa, {
        assignments: g.map((T) => {
          const J = wl(T);
          return {
            key: String(T.slotDefinitionId),
            label: J.label,
            performer: J.filled ? { id: Number(T.performerId), name: J.performer } : null,
            title: J.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(od, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: C
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        E.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : E.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, E.error) : E.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${E.data.derived ? "Derived segment" : "Root segment"} · ${E.data.componentSize} segment${E.data.componentSize === 1 ? "" : "s"} · ${E.data.integrityState}`
          ),
          (oe = E.data.parents) != null && oe.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...E.data.parents.map((T) => n("button", {
              key: T.nodeId,
              type: "button",
              onClick: () => O(T.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${T.ruleKey} ${T.ruleVersion}`))
          ]) : null,
          (he = E.data.children) != null && he.length ? n("p", { key: "children" }, `Children: ${E.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: f,
          type: "button",
          disabled: a != null || !c || g.length === 0,
          onClick: () => j(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: L,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => A(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => A(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    ge && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (T) => {
        T.target === T.currentTarget && te();
      },
      onKeyDownCapture: (T) => {
        var _, ae;
        if (!(typeof ((_ = T.target) == null ? void 0 : _.closest) == "function" ? T.target.closest("input, textarea, select, [contenteditable='true']") : null) && !T.repeat && !T.ctrlKey && !T.altKey && !T.metaKey && !T.shiftKey && /^[1-9]$/.test(T.key) && ((ae = le.current) != null && ae.call(le, Number(T.key) - 1))) {
          T.preventDefault(), T.stopPropagation();
          return;
        }
        it(T, {
          onCancel: te,
          onConfirm: () => {
            var M;
            return (M = Z.current) == null ? void 0 : M.click();
          }
        });
      }
    }, n("section", {
      ref: F,
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
        n("button", { key: "close", type: "button", onClick: te, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(ed, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (xe = u.performerSlotRevisions) == null ? void 0 : xe[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: Z,
        shortcutRef: le,
        onOptimisticSave: (T) => {
          y((J) => Tr(
            J,
            t.id,
            T
          ), p.id), x(t.id), N("Saving performer slots…"), te();
        },
        onSaved: async (T, { beforeState: J, afterState: _ }) => {
          y((ae) => Tr(
            ae,
            t.id,
            T.slots || [],
            T.revision
          ), p.id), N("Performer slots saved.");
          try {
            await V(
              "performer-slots.assign",
              "Assigned performers",
              J,
              _
            ), await w(T) || D([t]);
          } finally {
            x(null);
          }
        },
        onRollback: async (T, J) => {
          D([t]), y((_) => {
            var ae;
            return Tr(
              _,
              t.id,
              T,
              (ae = u.performerSlotRevisions) == null ? void 0 : ae[t.id]
            );
          }, p.id), N(J.message || "Unable to save performer slots.");
          try {
            J.status === 409 && await w();
          } finally {
            x(null);
          }
        },
        onConflict: w
      }))
    ])) : null
  ]);
}
function $d({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: p, onSelect: f, onSelectSegments: b, onSelectAll: y, onConfigureTag: N, onSeekTime: x, centerRef: w, showReviewState: V = !0, swimlaneTitleWidth: D, onSwimlaneTitleWidthChange: L }) {
  const A = fe(null), C = fe(null), [E, O] = P(0), [z, H] = P({ scrollTop: 0, height: 320 }), [B, I] = P(null), $ = Be(
    () => Bt(e, r, o),
    [e, r, o]
  ), F = Be(
    () => _a(o),
    [o]
  ), Z = Be(() => Yr($), [$]), le = Be(
    () => Tl(Z, i, r.length > 0),
    [Z, i, r.length]
  ), pe = Be(
    () => Ha(le.rows, Math.max(0, z.scrollTop - 24), z.height),
    [le, z]
  ), ge = Math.max(0, Number(d) || 0), j = ts(E), te = er(D, j), ue = te / 16, oe = Xi(c, ge, ue), he = Vi(ge), xe = Ji(ge, Math.max(1, E - ue * 16), g), T = he.filter((h, v) => v === 0 || v % xe === 0), J = Be(() => $.map((h) => `${h.key}:${h.trackCount}:${h.markers.map(({ segment: v, track: G }) => `${v.id}:${v.startSec}:${v.endSec ?? ""}:${G}`).join(",")}`).join("|"), [$]);
  function _() {
    const h = C.current;
    if (!h) return;
    const v = h.querySelector("[data-timeline-track]"), G = h.firstElementChild, ie = v == null ? void 0 : v.getBoundingClientRect(), ne = G == null ? void 0 : G.getBoundingClientRect(), ee = ie && ne ? Math.max(0, ie.left - ne.left) : ue * 16, we = (ne == null ? void 0 : ne.width) ?? h.scrollWidth;
    h.scrollTo({
      left: Zi(c, ge, we, h.clientWidth, ee, va),
      behavior: "smooth"
    });
  }
  ye(() => (w.current = _, () => {
    w.current === _ && (w.current = null);
  })), ye(() => {
    _();
  }, [g]);
  function ae() {
    const h = C.current, v = le.rows.find((we) => we.kind === "lane" && we.lane.markers.some(({ segment: Y }) => Y.id === s));
    if (!h || !v) return;
    const G = 24, ie = v.top + G, ne = ie + v.height;
    let ee = h.scrollTop;
    ie < h.scrollTop + G ? ee = Math.max(0, ie - G) : ne > h.scrollTop + h.clientHeight && (ee = Math.max(0, ne - h.clientHeight)), ee !== h.scrollTop && (h.scrollTop = ee), H({ scrollTop: ee, height: h.clientHeight });
  }
  ye(() => {
    ae();
  }, [s, J, le]), ye(() => {
    const h = C.current, v = le.rows.find((we) => we.kind === "group" && we.group.key === a);
    if (!h || !v) return;
    const G = 24, ie = v.top + G, ne = ie + v.height;
    let ee = h.scrollTop;
    ie < h.scrollTop + G ? ee = Math.max(0, ie - G) : ne > h.scrollTop + h.clientHeight && (ee = Math.max(0, ne - h.clientHeight)), ee !== h.scrollTop && (h.scrollTop = ee), H({ scrollTop: ee, height: h.clientHeight });
  }, [a, le]), ye(() => {
    const h = C.current;
    if (!h || typeof ResizeObserver > "u") return;
    const v = () => {
      O(h.clientWidth), H({ scrollTop: h.scrollTop, height: h.clientHeight }), ae();
    }, G = new ResizeObserver(v);
    return G.observe(h), v(), () => G.disconnect();
  }, [s, J, le]);
  function M(h) {
    if (!(ge > 0)) return;
    const v = h.currentTarget.getBoundingClientRect(), G = Math.min(1, Math.max(0, (h.clientX - v.left) / v.width));
    x(G * ge);
  }
  function se(h) {
    const v = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let G = null;
    Object.hasOwn(v, h.key) && (G = c + v[h.key]), h.key === "Home" && (G = 0), h.key === "End" && (G = ge), G != null && (h.preventDefault(), h.stopPropagation(), x(Math.min(ge, Math.max(0, G))));
  }
  function S(h) {
    var G;
    const v = (G = A.current) == null ? void 0 : G.getBoundingClientRect();
    v && L(er(h.clientX - v.left, j));
  }
  function k(h) {
    const v = h.shiftKey ? 40 : 16;
    let G = null;
    h.key === "ArrowLeft" && (G = te - v), h.key === "ArrowRight" && (G = te + v), h.key === "Home" && (G = 160), h.key === "End" && (G = j), G != null && (h.preventDefault(), h.stopPropagation(), L(er(G, j)));
  }
  const R = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: A,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (h) => {
          (h.metaKey || h.ctrlKey) && (h.preventDefault(), y == null || y());
        },
        onKeyDown: (h) => {
          h.key !== "Enter" && h.key !== " " || (h.preventDefault(), y == null || y());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: R, disabled: g <= 1, onClick: () => m(tr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: R, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: R, disabled: g >= 8, onClick: () => m(tr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: R, onClick: _, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(j),
      "aria-valuenow": Math.round(te),
      "aria-valuetext": `${Math.round(te)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (h) => {
        h.currentTarget.setPointerCapture(h.pointerId), S(h);
      },
      onPointerMove: (h) => {
        h.currentTarget.hasPointerCapture(h.pointerId) && S(h);
      },
      onKeyDown: k,
      onDoubleClick: () => L(at.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${te - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: C,
      onScroll: (h) => H({
        scrollTop: h.currentTarget.scrollTop,
        height: h.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: es(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${ue}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ge,
          "aria-valuenow": Math.min(ge, Math.max(0, c)),
          "aria-valuetext": Re(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: M,
          onKeyDown: se
        }, T.map((h, v) => n("span", {
          key: h,
          className: `absolute top-0 ${Yi(v, T.length, ge > 0 ? h / ge * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Qi(v, T.length, ge > 0 ? h / ge * 100 : 0)
        }, Re(h))).concat(t.map((h) => {
          const v = ge > 0 ? h.startSec / ge * 100 : 0;
          return n("button", {
            key: `shot-boundary:${h.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Re(h.startSec)} – ${Re(h.endSec)}`,
            title: `Shot boundary · ${h.source || "manual"} · ${Re(h.startSec)} – ${Re(h.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${v}%`, width: "2px" },
            onClick: (G) => {
              G.stopPropagation(), x(h.startSec);
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
            ...Io(oe),
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
        style: $.length > 0 ? { height: le.height } : void 0
      }, [
        $.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Io(oe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        $.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : pe.map((h) => {
          var Q;
          const v = h.group, G = i.includes(v.key), ie = a === v.key, ne = ir(ie);
          if (h.kind === "group") return n("div", {
            key: h.key,
            "data-segment-group": v.key,
            "data-segment-group-collapsed": G ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              backgroundColor: ne,
              top: h.top,
              height: h.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (q) => {
                if (q.metaKey || q.ctrlKey) {
                  b(v.lanes.flatMap((K) => K.markers.map((re) => re.segment.id)));
                  return;
                }
                u(v.key), p(v.key);
              },
              "aria-expanded": !G,
              "aria-current": ie ? "true" : void 0,
              "data-selected-timeline-group": ie ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: v.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: ne
              },
              title: `${G ? "Expand" : "Collapse"} ${v.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, G ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, v.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              G ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${v.lanes.length} swimlane${v.lanes.length === 1 ? "" : "s"} hidden`
                ),
                V ? n(At, { key: "states", counts: v.counts }) : null
              ] : null
            )
          ]);
          const ee = h.lane, we = ul(h.laneIndex), Y = ee.markers.some(({ segment: q }) => q.id === s);
          return n("div", {
            key: h.key,
            "data-grouped-swimlane": v.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              top: h.top,
              height: h.height,
              backgroundColor: we
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": Y ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: ml(Y, we),
              title: `${Rn(ee)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Rn(ee),
              onClick: (q) => {
                (q.metaKey || q.ctrlKey) && b(ee.markers.map((K) => K.segment.id));
              },
              onMouseEnter: () => I(ee.key),
              onMouseLeave: () => I((q) => q === ee.key ? null : q)
            }, [
              ee.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (q) => {
                  q.stopPropagation(), N({ tagId: ee.tagId, tagName: ee.label, trigger: q.currentTarget });
                },
                "aria-label": `Configure ${ee.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: B === ee.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, ee.label),
              (Q = ee.performers) != null && Q.length ? n(lr, {
                key: "performers",
                performers: ee.performers,
                performerAssignments: ee.performerAssignments
              }) : null,
              V ? n(At, { key: "counts", counts: ee.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, ee.markers.map(({ segment: q, track: K }) => {
              var Ie;
              const re = Rr(q.startSec, ge), ce = q.endSec == null ? q.startSec : Math.max(q.startSec, q.endSec), Ee = Math.max(0, Rr(ce, ge) - re), be = l.includes(q.id), ve = q.id === s, Me = Jr(F.get(q.id)), Se = q.endSec == null ? Re(q.startSec) : `${Re(q.startSec)} – ${Re(q.endSec)}`, ke = (Ie = Ua[Me]) == null ? void 0 : Ie.label;
              return n("button", {
                key: q.id,
                type: "button",
                onClick: ($e) => {
                  $e.stopPropagation(), f(q, {
                    additive: $e.metaKey || $e.ctrlKey,
                    rangeSegmentIds: $e.shiftKey ? ee.markers.map((Te) => Te.segment.id) : null
                  });
                },
                "aria-pressed": be,
                "aria-current": ve ? "true" : void 0,
                "data-selected-timeline-marker": ve ? "true" : void 0,
                "data-selected-segment-shortcut-target": ve ? "true" : void 0,
                "aria-label": V ? `${q.tagName || "Tag segment"}${ee.performerLabel ? `, ${ee.performerLabel}` : ""}, ${q.reviewState}${ke ? `, ${ke}` : ""}, ${Se}` : `${q.tagName || "Tag segment"}${ee.performerLabel ? `, ${ee.performerLabel}` : ""}, ${Se}`,
                title: V ? `${q.tagName || "Tag segment"}${ee.performerLabel ? ` · ${ee.performerLabel}` : ""} · ${q.reviewState}${ke ? ` · ${ke}` : ""} · ${Se}` : `${q.tagName || "Tag segment"}${ee.performerLabel ? ` · ${ee.performerLabel}` : ""} · ${Se}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...V ? ll(q.reviewState, be, Me, ve) : dl(be, ve),
                  left: `${re}%`,
                  top: `${gl(K)}rem`,
                  width: cl(q.endSec, Ee),
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
function Zr({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = P(null), [l, d] = P([]), [c, g] = P(null), [m, u] = P(""), [p, f] = P(!0), [b, y] = P(null), [N, x] = P(""), [w, V] = P(!1), D = fe(null), L = fe(0);
  ye(() => {
    const B = requestAnimationFrame(() => {
      var I;
      return (I = D.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(B);
  }, [e]), ye(() => {
    const B = new AbortController();
    return f(!0), x(""), Promise.all([
      r ? X(`/slot-definitions/${e}`, { signal: B.signal }) : Promise.resolve(null),
      X("/segment-groups", { signal: B.signal })
    ]).then(([I, $]) => {
      const F = $.find((Z) => (Z.tags || []).some((le) => Number(le.tagId) === Number(e)));
      s(I), d($), g((F == null ? void 0 : F.id) ?? null), u(F == null ? "" : String(F.id)), V(!1);
    }).catch((I) => {
      I.name !== "AbortError" && x(I.message || "Unable to load tag configuration.");
    }).finally(() => {
      B.signal.aborted || f(!1);
    }), () => B.abort();
  }, [r, e]);
  function A(B, I) {
    s({
      ...a,
      definitions: a.definitions.map(($, F) => F === B ? { ...$, ...I } : $)
    });
  }
  function C(B, I) {
    const $ = B + I;
    if ($ < 0 || $ >= a.definitions.length) return;
    const F = [...a.definitions];
    [F[B], F[$]] = [F[$], F[B]], s({
      ...a,
      definitions: F.map((Z, le) => ({ ...Z, sortOrder: le }))
    });
  }
  function E(B) {
    const I = a.definitions[B], $ = Number(I.assignmentCount) || 0, F = $ === 0 ? "" : ` and its ${$} assignment${$ === 1 ? "" : "s"}`;
    window.confirm(`Delete “${nt(I)}”${F}?`) && ($ > 0 && V(!0), s({
      ...a,
      definitions: a.definitions.filter((Z, le) => le !== B).map((Z, le) => ({ ...Z, sortOrder: le }))
    }));
  }
  async function O() {
    var I;
    y("slots"), x("Saving performer slots…");
    let B;
    try {
      B = await X(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: w,
          definitions: a.definitions.map(($, F) => {
            var Z;
            return {
              id: $.id || void 0,
              label: ((Z = $.label) == null ? void 0 : Z.trim()) || null,
              sortOrder: F,
              genderHints: $.genderHints || []
            };
          })
        })
      }), s(B), V(!1);
    } catch ($) {
      $.status === 409 ? (x("Performer slots changed elsewhere; current values were reloaded."), (I = $.payload) != null && I.current && (s($.payload.current), V(!1))) : x($.message || "Unable to save performer slots."), y(null);
      return;
    }
    try {
      await o(), x("Performer slots saved.");
    } catch {
      x("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      y(null);
    }
  }
  async function z() {
    const B = m === "" ? null : Number(m);
    if (B !== c) {
      y("group"), x("Saving tag group…");
      try {
        await X(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: B })
        });
      } catch (I) {
        x(I.message || "Unable to assign the tag group."), y(null);
        return;
      }
      try {
        const [I, $] = await Promise.allSettled([
          X("/segment-groups"),
          o()
        ]);
        if (I.status === "fulfilled") {
          d(I.value);
          const F = I.value.find((le) => (le.tags || []).some((pe) => Number(pe.tagId) === Number(e))), Z = (F == null ? void 0 : F.id) ?? null;
          g(Z), u(Z == null ? "" : String(Z));
        }
        x(
          I.status === "fulfilled" && $.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        y(null);
      }
    }
  }
  l.find((B) => Number(B.id) === Number(c));
  const H = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (B) => {
      B.target === B.currentTarget && !b && i();
    },
    onKeyDownCapture: (B) => it(B, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: D,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: bt,
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
        p ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: m,
            disabled: b != null,
            onChange: (B) => u(B.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((B) => n("option", { key: B.id, value: String(B.id) }, B.name))
          ])
        ]),
        p ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (m === "" ? null : Number(m)) === c,
          onClick: z,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        p ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: b != null,
              onChange: (B) => s({ ...a, allowSamePerformerInMultipleSlots: B.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((B, I) => n("article", {
            key: B.id || B._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: B.label || "",
                disabled: b != null,
                onChange: ($) => A(I, { label: $.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, _i.map(($) => n("label", { key: $, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (B.genderHints || []).includes($),
                  onChange: (F) => A(I, {
                    genderHints: F.target.checked ? [.../* @__PURE__ */ new Set([...B.genderHints || [], $])] : (B.genderHints || []).filter((Z) => Z !== $)
                  })
                }),
                n("span", { key: "text" }, sr($))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${B.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || I === 0, onClick: () => C(I, -1), className: H, "aria-label": `Move ${nt(B)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || I === a.definitions.length - 1, onClick: () => C(I, 1), className: H, "aria-label": `Move ${nt(B)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => E(I), className: `${H} text-red-300` }, "Delete")
            ])
          ])),
          n("div", { key: "buttons", className: "flex items-center gap-2" }, [
            n("button", {
              key: "add",
              type: "button",
              disabled: b != null,
              onClick: () => s({
                ...a,
                definitions: [...a.definitions, {
                  _clientKey: `new-${++L.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: H
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: O,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, b === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      N ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, N) : null
    ]),
    n(
      "footer",
      { key: "footer", className: "flex items-center justify-end border-t border-border px-5 py-4" },
      n("button", {
        type: "button",
        disabled: b != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Cd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, cancelQueuedReviewsForSegments: u, captureTrainingExport: p, centerTimelineRef: f, closeEditorFilters: b, closeFirstSegmentTagDialog: y, closeMaterializeDialog: N, closeMergeConfirmation: x, closePublishApprovedDialog: w, closeTagEditing: V, collapsedSegmentGroups: D, compatibilityMode: L, configuringTag: A, createSegment: C, currentTime: E, deleteRejectedSegments: O, detail: z, detailPanelRef: H, detailWidth: B, duplicateSegment: I, editorFilters: $, editorLayout: F, editorRef: Z, exportingExamples: le, filtersButtonRef: pe, filtersOpen: ge, firstSegmentTagOpen: j, focusRowRef: te, handleSeparatorKeyDown: ue, handleSeparatorPointerDown: oe, handleSeparatorPointerMove: he, hideDerivedSegments: xe, history: T, historyOpen: J, historySaving: _, horizontalLayoutSize: ae, importNativeSegments: M, incorrectExamples: se, incorrectExamplesOpen: S, lineage: k, markerRailWidth: R, materializeButtonRef: h, materializeCancelButtonRef: v, materializeDerivedSegments: G, materializeError: ie, materializeLoading: ne, materializeOpen: ee, materializePreview: we, materializing: Y, mediaStackRef: Q, mergeCancelButtonRef: q, mergeConfirmation: K, mergeSavingRef: re, mergeSelectedSwimlane: ce, nativeImportState: Ee, onDetailChange: be, onNavigate: ve, onReload: Me, onSlotsChanged: Se, openPublishApprovedDialog: ke, panelSeparatorProps: Ie, pendingInitialSeekRef: $e, performerSlots: Te, performerSlotsAvailable: Le, playbackControlsRef: Qe, previewDerivedSegments: Fe, provenance: Ne, provenanceSources: He, publishApprovedCancelButtonRef: qe, publishApprovedDrafts: Je, publishApprovedError: Ae, publishApprovedOpen: Ce, quickSearchOpen: Ge, railScrollRef: st, railToggleRef: Ze, recordHistoryAction: Nt, rejectedDeletionPreview: Xe, removeIncorrectExample: It, removingExampleId: Mt, restoreHistoryTarget: tn, saveMessage: Pn, saveTag: Et, saveTiming: cr, savingSegmentId: ft, seekRef: ht, segmentGroups: Ut, segmentRailLayout: Dt, segments: $t, selectAllVideoSegments: ur, selectSegment: vt, selectSegmentCollection: mr, selectedGroups: nn, selectedPerformerSlots: rn, selectedSegment: xt, selectedSegmentGroupKey: on, selectedSegmentIds: zt, selectedSegments: Ln, selectedSlotStatus: an, setAutoAssignError: Ot, setAutoAssignOpen: Pt, setConfiguringTag: sn, setCurrentTime: gr, setEditorFilters: Fn, setEditorLayout: pr, setFiltersOpen: ln, setHideDerivedSegments: dn, setHistoryOpen: cn, setIncorrectExamplesOpen: Lt, setQuickSearchOpen: jn, setRailViewport: Bn, setRejectedDeletionPreview: un, setSaveMessage: mn, setSavingSegmentId: gn, setSelectedSegmentGroupKey: rt, setSelectedSegmentId: Gn, setShortcutsOpen: _t, setTimelineZoom: Kn, shotBoundaries: Un, shortcutsOpen: pn, slotButtonRef: fn, splitLayout: St, splitSegment: fr, startFullAnalysis: zn, tagEditing: yn, tagSearchRef: bn, timelineDuration: hn, timelineRatioBounds: _e, timelineZoom: Ye, toggleSegmentGroup: _n, toggleSegmentRail: yr, updateTimelineRatio: yt, video: Ue, videoPerformers: Hn, visibleCounts: vn, visibleSegmentRailRows: xn, visibleSegments: Ht, wideLayout: Ct, workspaceRef: br } = e, Sn = Be(
    () => $t.filter((W) => !W.published && W.reviewState === "approved"),
    [$t]
  ), hr = Ui(Kr), kn = Sn.length, ut = we ? we.createCount + we.linkCount : null;
  function vr(W) {
    const je = zt.includes(W.id), ze = W.id === (xt == null ? void 0 : xt.id), de = W.endSec == null ? Re(W.startSec) : `${Re(W.startSec)} – ${Re(W.endSec)}`, lt = `${pt(W.sourceKey)}${W.confidence != null ? ` · ${Math.round(W.confidence * 100)}%` : ""}`;
    return n("button", {
      key: W.id,
      type: "button",
      onClick: (Vt) => vt(W, { additive: Vt.metaKey || Vt.ctrlKey }),
      "aria-pressed": je,
      "aria-current": ze ? "true" : void 0,
      "data-selected-segment-shortcut-target": ze ? "true" : void 0,
      "aria-label": L ? `${W.tagName || "Tag segment"}, ${W.reviewState}${W.isDerived ? ", derived segment" : ""}, ${de}` : `${W.tagName || "Tag segment"}${W.isDerived ? ", derived segment" : ""}, ${de}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Ka(je, ze)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        L ? n(Kt, { key: "review", state: W.reviewState, includeLabel: !1 }) : null,
        W.isDerived ? n(dr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          W.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, de),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: lt
        }, lt)
      ])
    ]);
  }
  const qt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Wt = [...T.actions || []].reverse().find((W) => W.sequence <= T.cursorSequence);
  return n("section", {
    ref: Z,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${St ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (W) => Ya(W, ve, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ue.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ue.title || `Video ${Ue.id}`
          }, Ue.title || `Video ${Ue.id}`)),
          ...Hn.map((W) => n(Mn, {
            key: Ve(W),
            performer: { id: Ve(W), name: W.name },
            compact: !0,
            tooltip: W.name
          })),
          L ? n(At, { key: "review-counts", counts: vn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          L ? null : n(Xa, { key: "bin", onNavigate: ve, compact: !0 }),
          n(ei, { key: "settings", onNavigate: ve, compact: !0 })
        ])
      ]),
      L && z.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${z.nativeImportCount} Cove segment${z.nativeImportCount === 1 ? "" : "s"} ${z.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        Ee.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Ee.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => M("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => M("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        Ee.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Ee.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          L ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => zn(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (W) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && W.preventDefault();
                },
                onKeyDown: (W) => {
                  (W.key === "Enter" || W.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && W.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(ma, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([W, je]) => n("button", {
                key: W,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (ze) => {
                  var de;
                  (de = ze.currentTarget.closest("details")) == null || de.removeAttribute("open"), zn(je);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, W)))
            ])
          ]) : null,
          L ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ft != null || l.length === 0,
            onClick: () => {
              Ot(""), Pt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          L ? n("button", {
            key: "materialize-derived",
            ref: h,
            type: "button",
            disabled: ft != null || ne || Y || ut === 0,
            onClick: Fe,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, ne ? "Analyzing…" : `Auto-Materialize${ut != null ? ` (${ut})` : ""}`) : null,
          L ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ft != null || kn === 0,
            onClick: (W) => ke(W.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Ce,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${kn ? ` (${kn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: le || Mt != null || se.length === 0,
            onClick: () => Lt(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": S,
            "aria-label": `Open AI feedback collection, ${se.length} example${se.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${se.length ? ` (${se.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: pe,
            type: "button",
            onClick: () => ln(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": ge,
            className: `${qt} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(Zn, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => _t(!0),
            className: qt
          }, [n(Zn, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (L ? T.actions.length === 0 : Wt == null) || ft != null || _,
            onClick: L ? () => cn((W) => !W) : () => tn(
              Wt.sequence - 1
            ),
            "aria-haspopup": L ? "dialog" : void 0,
            "aria-expanded": L ? J : void 0,
            className: qt
          }, [
            n(Zn, { key: "icon", name: "history" }),
            n("span", { key: "label" }, L ? `History${T.actions.length ? ` (${T.actions.length})` : ""}` : Wt ? `Undo ${Wt.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Ze,
            type: "button",
            onClick: yr,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": F.markerRailOpen,
            className: qt
          }, [
            n(Zn, { key: "icon", name: "list" }),
            n("span", { key: "label" }, F.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    L && J ? n("section", {
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
          onClick: () => cn(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...T.actions].reverse().map((W) => n("button", {
          key: W.sequence,
          type: "button",
          disabled: _,
          onClick: () => tn(W.sequence),
          "aria-current": T.cursorSequence === W.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${W.sequence > T.cursorSequence ? "text-secondary" : "text-foreground"} ${T.cursorSequence === W.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, W.label),
          n("time", {
            key: "time",
            dateTime: W.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(W.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: _,
          onClick: () => tn(T.baselineSequence),
          "aria-current": T.cursorSequence === T.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${T.cursorSequence === T.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    ge ? n(pd, {
      key: "editor-filters",
      filters: $,
      hideDerivedSegments: xe,
      performers: Hn,
      provenanceSources: He,
      reviewCounts: s,
      segments: $t,
      segmentGroups: Ut,
      reviewMode: L,
      onChange: Fn,
      onHideDerivedChange: dn,
      onClose: b
    }) : null,
    j ? n(gd, {
      key: "first-segment-tag-dialog",
      saving: ft != null,
      error: Pn,
      onSelect: (W, je) => C(W, je),
      onClose: y
    }) : null,
    Ge ? n(bd, {
      key: "quick-search-dialog",
      segments: el(r),
      onSelect: (W) => {
        jn(!1), vt(W, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        jn(!1), requestAnimationFrame(() => {
          var W;
          return (W = Z.current) == null ? void 0 : W.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(xd, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Pt(!1)
    }) : null,
    K ? n(kd, {
      key: "merge-selection-dialog",
      merge: K,
      processing: re.current,
      undoable: !L,
      cancelButtonRef: q,
      onConfirm: (W) => ce(!0, W, K),
      onClose: x
    }) : null,
    ee ? n(Nd, {
      key: "materialize-derived-dialog",
      preview: we,
      loading: ne,
      processing: Y,
      error: ie,
      cancelButtonRef: v,
      onConfirm: G,
      onClose: () => {
        Y || N();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: br,
      className: `${St ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      F.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Ct ? { position: "absolute", top: 0, right: 0, width: R, height: ae.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        $t.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Ht.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: st,
          onScroll: (W) => Bn({
            scrollTop: W.currentTarget.scrollTop,
            height: W.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Dt.height }
        }, xn.map((W) => {
          var ze;
          let je;
          if (W.kind === "group") {
            const de = D.includes(W.group.key), lt = W.group.lanes.reduce((Vt, qn) => Vt + qn.markers.length, 0);
            je = n("button", {
              type: "button",
              onClick: () => {
                rt(W.group.key), _n(W.group.key);
              },
              "aria-expanded": !de,
              "aria-current": on === W.group.key ? "true" : void 0,
              "data-segment-rail-group": W.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${on === W.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, de ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: W.group.name }, W.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, lt),
              L && de ? n(At, { key: "states", counts: W.group.counts }) : null
            ]);
          } else W.kind === "lane" ? je = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Rn(W.lane),
            "aria-label": Rn(W.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, W.lane.label),
            (ze = W.lane.performers) != null && ze.length ? n(lr, {
              key: "performers",
              performers: W.lane.performers,
              performerAssignments: W.lane.performerAssignments
            }) : null,
            L ? n(At, { key: "states", counts: W.lane.counts }) : null
          ]) : je = vr(W.segment);
          return n("div", {
            key: W.key,
            className: "absolute left-0 right-0",
            style: { top: W.top, height: W.height }
          }, je);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${St ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Q,
          className: `${St ? "min-h-0 flex-1" : ""} grid`,
          style: St ? {
            gridTemplateRows: `minmax(16rem, ${(1 - F.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${F.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: te,
            className: "grid min-h-0 gap-2",
            style: Ct ? {
              gridTemplateColumns: F.markerRailOpen ? `${B}px 0.5rem minmax(0,1fr) 0.5rem ${R}px` : `${B}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(Id, {
              key: "tools",
              compatibilityMode: L,
              selectedSegment: xt,
              selectedSegments: Ln,
              selectedGroups: nn,
              saveMessage: Pn,
              savingSegmentId: ft,
              setSavingSegmentId: gn,
              setSaveMessage: mn,
              saveTag: Et,
              slotStatus: an,
              performerSlotsAvailable: Le,
              selectedPerformerSlots: rn,
              performerSlots: Te,
              detail: z,
              onDetailChange: be,
              onCancelQueuedReview: u,
              video: Ue,
              slotButtonRef: fn,
              tagSearchRef: bn,
              tagEditing: yn,
              onCancelTagEditing: V,
              detailPanelRef: H,
              onReduceSelection: (W) => {
                vt(W), requestAnimationFrame(() => {
                  var je;
                  return (je = H.current) == null ? void 0 : je.focus({ preventScroll: !0 });
                });
              },
              saveTiming: cr,
              onSlotsChanged: Se,
              onRecordHistory: Nt,
              splitSegment: fr,
              duplicateSegment: I,
              provenance: Ne,
              lineage: k,
              onNavigateLineageItem: (W) => {
                const je = $t.find((ze) => ze.itemId === W);
                je && Gn(je.id);
              }
            }),
            Ct ? n(
              "div",
              { key: "detail-separator", ...Ie("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ue.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(sa, {
                streamUrl: `/api/stream/video/${Ue.id}`,
                posterUrl: `/api/stream/video/${Ue.id}/screenshot?v=${encodeURIComponent(Ue.updatedAt || "")}`,
                format: Ue.videoFile.format,
                audioCodec: Ue.videoFile.audioCodec,
                duration: Ue.videoFile.duration,
                videoId: Ue.id,
                trackingEnabled: !1,
                onSeekRegister: (W) => {
                  ht.current = W, Ys($e.current, $t, W) && ($e.current = null);
                },
                onPlaybackControlRegister: (W) => {
                  Qe.current = W;
                },
                onTimeUpdate: gr
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Ct && F.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ie("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ct && F.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          St ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(_e.minimum * 100),
            "aria-valuemax": Math.round(_e.maximum * 100),
            "aria-valuenow": Math.round(F.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(F.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: oe,
            onPointerMove: he,
            onKeyDown: ue,
            onDoubleClick: () => yt(at.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: St ? void 0 : { height: "20rem" } }, n($d, {
            segments: Ht,
            shotBoundaries: Un,
            segmentGroups: Ut,
            performerSlots: Te,
            collapsedGroupKeys: D,
            selectedGroupKey: on,
            selectedSegmentId: xt == null ? void 0 : xt.id,
            selectedSegmentIds: zt,
            duration: hn,
            currentTime: E,
            zoom: Ye,
            onZoomChange: Kn,
            onSelectGroup: rt,
            onToggleGroup: _n,
            onSelect: (W, je) => vt(W, je),
            onSelectSegments: mr,
            onSelectAll: ur,
            onConfigureTag: (W) => sn(W),
            onSeekTime: (W) => {
              var je;
              return (je = ht.current) == null ? void 0 : je.call(ht, W, !1);
            },
            centerRef: f,
            showReviewState: L,
            swimlaneTitleWidth: F.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (W) => pr((je) => ({ ...je, swimlaneTitleWidth: W }))
          }))
        ])
      ])
    ]),
    A ? n(Zr, {
      key: `configure-tag:${A.tagId}`,
      tagId: A.tagId,
      tagName: A.tagName,
      performerSlotsEnabled: L,
      onSaved: Me,
      onClose: () => {
        const W = A.trigger;
        sn(null), requestAnimationFrame(() => {
          var je;
          W != null && W.isConnected ? W.focus({ preventScroll: !0 }) : (je = Z.current) == null || je.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ce ? n(vd, {
      key: "publish-approved-dialog",
      drafts: Sn,
      processing: ft === -1,
      error: Ae,
      cancelButtonRef: qe,
      onConfirm: Je,
      onClose: w
    }) : null,
    Xe ? n(Sd, {
      key: "rejected-deletion-dialog",
      preview: Xe,
      onConfirm: () => O(Xe),
      onClose: () => {
        un(null), requestAnimationFrame(() => {
          var W;
          return (W = Z.current) == null ? void 0 : W.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    pn ? n(fd, {
      key: "shortcuts-dialog",
      reviewMode: L,
      bindings: hr,
      onClose: () => _t(!1)
    }) : null,
    S ? n(yd, {
      key: "incorrect-examples-dialog",
      examples: se,
      exporting: le,
      removingExampleId: Mt,
      onExport: p,
      onRemove: It,
      onClose: () => Lt(!1)
    }) : null
  ]);
}
function Td(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: p, setSaveMessage: f, setSelectedSegmentGroupKey: b, setSelectedSegmentId: y, setSelectedSegmentIds: N } = e;
  function x(A) {
    const C = mt(t, A);
    C && m((E) => Va(E, C));
  }
  function w(A) {
    y(A), N(A == null ? [] : [A]), c.current = A, g.current = [];
  }
  function V(A, {
    focusEditor: C = !1,
    seekToSegment: E = !1,
    additive: O = !1,
    rangeSegmentIds: z = null
  } = {}) {
    var B, I;
    const H = fs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, A.id, z, O);
    N(H.selectedSegmentIds), y(H.activeSegmentId), c.current = H.anchorSegmentId, g.current = H.rangeBaseSegmentIds, H.activeSegmentId != null && b(mt(t, H.activeSegmentId)), x(A.id), C && ((B = r.current) == null || B.focus({ preventScroll: !0 })), E && ((I = i.current) == null || I.call(i, A.startSec, !1));
  }
  function D(A) {
    const C = gs(
      d,
      l,
      A
    );
    N(C.selectedSegmentIds), y(C.activeSegmentId), c.current = C.activeSegmentId, g.current = [], C.activeSegmentId != null && (b(mt(t, C.activeSegmentId)), x(C.activeSegmentId));
  }
  function L() {
    var E;
    const A = bs(s), C = A.includes(l) ? l : A[0] ?? null;
    u(ct({})), p(!1), N(A), y(C), c.current = C, g.current = [], C != null && b(mt(
      Bt(s, a, o),
      C
    )), f(A.length === 0 ? "There are no segments to select." : `${A.length} segments selected. Collapsed Segment groups keep their selected segments.`), (E = r.current) == null || E.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: x, replaceSegmentSelection: w, selectSegment: V, selectSegmentCollection: D, selectAllVideoSegments: L };
}
function Ad(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, pendingReviewStateRef: g, recordHistoryAction: m, revealSegmentGroupForSelection: u, reviewSavingRef: p, savingSegmentId: f, selectedGroups: b, selectedSegment: y, selectedSegmentIdRef: N, selectedSegments: x, selectionAnchorIdRef: w, selectionRangeBaseIdsRef: V, setMergeConfirmation: D, setSaveMessage: L, setSavingSegmentId: A, setSelectedSegmentId: C, setSelectedSegmentIds: E, video: O } = e;
  function z() {
    D(null), requestAnimationFrame(() => {
      var I;
      return (I = i.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
  }
  async function H(I = !1, $ = !1, F = null) {
    if (s.current || f != null) return;
    const Z = F || qa(
      b,
      { nativeOnly: !r }
    );
    if (!Z) {
      L("Select at least two segments from one swimlane.");
      return;
    }
    if (!I && wa()) {
      D(Z);
      return;
    }
    $ && Na(!1), z();
    const le = Z.endSec == null ? "open end" : Re(Z.endSec);
    s.current = !0;
    let pe = Z.segments[0];
    const ge = r ? null : dt(Z.segments, !1), j = r ? null : crypto.randomUUID(), te = Z.segments.map((oe) => oe.id), ue = zl(o, Z.segments);
    A(pe.id), d(ue, O.id), E([pe.id]), C(pe.id), w.current = pe.id, V.current = [];
    try {
      const oe = Z.segments.slice(1);
      if (!r || pe.nativeSegmentId != null) {
        const he = oe.map((T) => {
          const J = `merge-native-selection:${O.id}:${pe.id}:${T.id}:${pe.updatedAt}:${T.updatedAt}`;
          return { key: J, operationId: Oe(J), segmentId: T.id, expectedUpdatedAt: T.updatedAt };
        }), xe = await X(`/videos/${O.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: pe.id,
            expectedSurvivorUpdatedAt: pe.updatedAt,
            consumedSegments: he.map(({ key: T, ...J }) => J),
            historyReceiptId: j
          })
        });
        pe = xe.survivor, d(Ko(o, xe), O.id), he.forEach(({ key: T }) => Pe(T));
      } else {
        const he = oe.map((T) => {
          const J = `merge-draft-selection:${O.id}:${pe.itemId}:${T.itemId}:${pe.revision}:${T.revision}`;
          return { key: J, operationId: Oe(J), itemId: T.itemId, expectedRevision: T.revision };
        }), xe = await X(`/videos/${O.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: pe.itemId,
            expectedSurvivorRevision: pe.revision,
            consumedDrafts: he.map(({ key: T, ...J }) => J)
          })
        });
        pe = xe.survivor, d(Ko(o, xe), O.id), he.forEach(({ key: T }) => Pe(T));
      }
      E([pe.id]), C(pe.id), w.current = pe.id, V.current = [], r ? t(kt) : await m(
        "segments.merge",
        `Merged ${Z.segments.length} segments`,
        ge,
        dt([pe], !1),
        j
      ), u(pe.id), L(`${Z.segments.length} segments merged into ${Re(Z.startSec)} – ${le}.`);
    } catch (oe) {
      d((he) => Ja(
        En(he, [Z.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        Z.segments.slice(1)
      ), O.id), E(te), C((y == null ? void 0 : y.id) ?? te[0] ?? null), w.current = (y == null ? void 0 : y.id) ?? te[0] ?? null, V.current = [], oe.status === 409 ? await l() : L(oe.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, A(null);
    }
  }
  async function B(I, $ = x, F = y) {
    var ue;
    if ($.length === 0 || p.current) return;
    if (f != null) {
      g.current.push(Ms(
        I,
        $,
        F
      )), L(`${I === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const Z = Rs($, I), le = $.filter((oe) => oe.reviewState !== Z);
    if (le.length === 0) return;
    const pe = $.map((oe) => ({
      id: oe.id,
      itemId: oe.itemId,
      nativeSegmentId: oe.nativeSegmentId
    })), ge = pe.find((oe) => oe.id === (F == null ? void 0 : F.id)) || pe[0], j = (oe, he = !1) => {
      if (!(oe != null && oe.segments) || !he && !Dr(N.current, ge.id))
        return;
      const xe = pe.map((J) => Ke(oe == null ? void 0 : oe.segments, J)).filter(Boolean), T = Ke(oe == null ? void 0 : oe.segments, ge) || xe[0] || null;
      E(xe.map((J) => J.id)), C((T == null ? void 0 : T.id) ?? null), w.current = (T == null ? void 0 : T.id) ?? null, V.current = [];
    };
    p.current = !0, A((F == null ? void 0 : F.id) ?? le[0].id), L(`Updating ${le.length} selected segment${le.length === 1 ? "" : "s"}…`);
    const te = ar(
      o,
      le.map((oe) => oe.id),
      { reviewState: Z }
    );
    d(te, O.id);
    try {
      const oe = await X(`/videos/${O.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: Z,
          segments: $.map((J) => J.published ? {
            nativeSegmentId: J.nativeSegmentId,
            expectedUpdatedAt: J.updatedAt
          } : {
            itemId: J.itemId,
            expectedRevision: J.revision
          })
        })
      }), he = new Map((oe.items || []).map((J) => [
        J.requestedNativeSegmentId != null ? `native:${J.requestedNativeSegmentId}` : `item:${J.requestedItemId}`,
        J
      ]));
      if (pe.forEach((J) => {
        const _ = he.get(J.nativeSegmentId != null ? `native:${J.nativeSegmentId}` : `item:${J.itemId}`);
        _ && (J.nativeSegmentId = _.nativeSegmentId, J.itemId = _.itemId);
      }), oe.history && t(oe.history), Z === "rejected" || (oe.items || []).some((J) => J.requestedNativeSegmentId != null && J.nativeSegmentId !== J.requestedNativeSegmentId)) {
        j(await c()), L(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${Z === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const T = {
        ...o,
        approvedSetVersion: oe.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((J) => {
          const _ = he.get(J.nativeSegmentId != null ? `native:${J.nativeSegmentId}` : `item:${J.itemId}`);
          return _ ? {
            ...J,
            id: _.nativeSegmentId != null ? _.nativeSegmentId : -_.itemId,
            itemId: _.itemId,
            nativeSegmentId: _.nativeSegmentId,
            published: _.nativeSegmentId != null,
            reviewState: Z,
            revision: _.nativeSegmentId != null ? J.revision : _.revision,
            updatedAt: _.updatedAt
          } : J;
        })
      };
      d(T, O.id), j(T), L(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${Z === "approved" ? "approved" : Z === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (oe) {
      d((xe) => En(
        xe,
        le,
        ["reviewState"]
      ), O.id), oe.status === 409 && ((ue = oe.payload) != null && ue.currentHistory) && t(oe.payload.currentHistory);
      const he = oe.status === 409 ? await l() : o;
      j(he, !0), L(oe.message || "Unable to update the selected segments.");
    } finally {
      p.current = !1, A(null);
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: H, saveSelectedReviewState: B };
}
function Rd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: p, materializeButtonRef: f, materializePreview: b, materializeRestoreFocusRef: y, materializing: N, mutateSegment: x, onConflict: w, onDetailChange: V, onReload: D, recordHistoryAction: L, refreshMaterializationPreview: A, removingExampleId: C, revealSegmentGroupForSelection: E, savingSegmentId: O, segments: z, selectedSegment: H, selectedSegmentIdRef: B, selectedSegments: I, selectionAnchorIdRef: $, selectionRangeBaseIdsRef: F, setAutoAssignError: Z, setAutoAssignOpen: le, setAutoAssigning: pe, setExportingExamples: ge, setIncorrectExamples: j, setMaterializeError: te, setMaterializeLoading: ue, setMaterializeOpen: oe, setMaterializePreview: he, setMaterializing: xe, setRejectedDeletionPreview: T, setRemovingExampleId: J, setSaveMessage: _, setSavingSegmentId: ae, setSelectedSegmentGroupKey: M, setSelectedSegmentId: se, setSelectedSegmentIds: S, video: k } = e;
  async function R() {
    var ke, Ie, $e;
    if (I.length === 0 || !H || O != null) return;
    const K = Fl(I, u), re = K.segments;
    if (re.length === 0) return;
    const ce = I.map((Te) => ({
      id: Te.id,
      itemId: Te.itemId,
      nativeSegmentId: Te.nativeSegmentId
    })), Ee = ce.find((Te) => Te.id === H.id) || ce[0], be = [], ve = [];
    let Me = !1, Se = c;
    ae(Ee.id), _(K.action === "remove" ? `Removing ${re.length} selected incorrect example${re.length === 1 ? "" : "s"}…` : `Collecting ${re.length} selected segment${re.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const Te = async (Ae, Ce) => {
        const Ge = Ae.nativeSegmentId != null, st = K.action === "remove" ? `incorrect-example-remove:${k.id}:${Ce == null ? void 0 : Ce.id}:${Ce == null ? void 0 : Ce.revision}:${Ce == null ? void 0 : Ce.representationRevision}` : `incorrect-example-collect:${k.id}:${Ge ? `native:${Ae.nativeSegmentId}:${Ae.updatedAt}` : `item:${Ae.itemId}:${Ae.revision}`}`;
        if (K.action === "remove" && !Ce)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Ze;
        try {
          Ze = K.action === "remove" ? await X(
            `/videos/${k.id}/incorrect-examples/${Ce.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Oe(st),
                expectedExampleRevision: Ce.revision,
                expectedRepresentationRevision: Ce.representationRevision
              })
            }
          ) : await X(`/videos/${k.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Oe(st),
              nativeSegmentId: Ge ? Ae.nativeSegmentId : null,
              itemId: Ge ? null : Ae.itemId,
              expectedUpdatedAt: Ge ? Ae.updatedAt : null,
              expectedRevision: Ge ? null : Ae.revision
            })
          });
        } catch (Nt) {
          throw Nt.operationKey = st, Nt;
        }
        if (!jl(K.action, Ze))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Pe(st), Ze;
      };
      for (const Ae of re) {
        const Ce = K.action === "remove" ? u.find((Ge) => Ge.itemId != null && Ge.itemId === Ae.itemId) : null;
        try {
          const Ge = ce.find((Xe) => Xe.id === Ae.id);
          let st = Ke(
            Se == null ? void 0 : Se.segments,
            Ge
          ) || Ae, Ze;
          try {
            Ze = await Te(st, Ce);
          } catch (Xe) {
            if (Xe.status === 409 && ((Ie = (ke = Xe.payload) == null ? void 0 : ke.result) == null ? void 0 : Ie.code) === "OPERATION_REPLAYED")
              Se = await X(
                `/videos/${k.id}/editor`
              ), Pe(Xe.operationKey), Ze = Xe.payload.result;
            else {
              if (K.action !== "collect" || Xe.status !== 409) throw Xe;
              const It = await X(
                `/videos/${k.id}/editor`
              );
              Se = It;
              const Mt = Ke(
                It == null ? void 0 : It.segments,
                Ge
              );
              if (!Mt) throw Xe;
              st = Mt, Ze = await Te(st, null);
            }
          }
          Ge && Ze.itemId != null && (Ge.itemId = Ze.itemId), Se = Fr(
            Se,
            Ze.editorDelta
          );
          const Nt = { segment: Ae, result: Ze, example: Ce };
          be.push(Nt);
        } catch (Ge) {
          if (ve.push(Ge), ![400, 404, 409].includes(Ge.status)) break;
        }
      }
      if (d && be.length > 0) {
        const Ae = K.action === "remove", Ce = be.length;
        await L(
          Ae ? "feedback.remove" : "feedback.collect",
          Ae ? `Removed ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}` : `Collected ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}`,
          Qn(be, Ae),
          Qn(be, !Ae)
        ) || (Me = !0);
      }
      be.some(({ result: Ae }) => Ae.representation === "basicNativeBin") && Cn();
      const Le = Dr(
        B.current,
        Ee.id
      ), Qe = K.action === "collect" && be.some(({ segment: Ae }) => Ae.id === Ee.id), Fe = be.map(({ segment: Ae }) => Ae.id), Ne = Qe ? vs(
        r,
        Fe,
        Ee.id
      ) : null, He = Qe ? (Ne == null ? void 0 : Ne.id) ?? null : Ee.id;
      Le && Qe && (S(Ne ? [Ne.id] : []), se((Ne == null ? void 0 : Ne.id) ?? nr), $.current = (Ne == null ? void 0 : Ne.id) ?? null, F.current = []);
      const qe = await X(`/videos/${k.id}/incorrect-examples`);
      j(qe);
      const Je = Se;
      if (V(Je, k.id), Le && Dr(
        B.current,
        He
      )) {
        let Ae, Ce;
        Qe ? (Ce = Ne ? Ke(Je == null ? void 0 : Je.segments, {
          id: Ne.id,
          itemId: Ne.itemId,
          nativeSegmentId: Ne.nativeSegmentId
        }) : null, Ae = Ce ? [Ce] : []) : (Ae = ce.map((Ge) => Ke(Je == null ? void 0 : Je.segments, Ge)).filter(Boolean), Ce = Ke(Je == null ? void 0 : Je.segments, Ee) || Ae[0] || null), S(Ae.map((Ge) => Ge.id)), se((Ce == null ? void 0 : Ce.id) ?? (Qe ? nr : null)), $.current = (Ce == null ? void 0 : Ce.id) ?? null, F.current = [], M(Ce ? mt(r, Ce.id) : null), Ce && E(Ce.id);
      }
      if (ve.length > 0) {
        const Ae = (($e = ve[0]) == null ? void 0 : $e.message) || "Only segments with registered AI provenance can be collected.";
        be.length === 0 ? _(Ae) : K.action === "remove" ? _(
          `Partially removed ${be.length} of ${re.length} selected incorrect examples. ${Ae}`
        ) : _(
          `Partially collected ${be.length} of ${re.length} selected segments. ${Ae}`
        );
      } else if (K.action === "remove")
        _(
          `${be.length} incorrect example${be.length === 1 ? "" : "s"} removed and ${be.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Ae = be.filter(({ result: Ce }) => Ce.representation === "basicNativeBin").length;
        _(Ae === be.length ? `${be.length} incorrect AI example${be.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${be.length} incorrect AI example${be.length === 1 ? "" : "s"} collected and ${be.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
      Me && _("The change saved, but editor history could not be updated.");
    } catch (Te) {
      _(Te.message || "Unable to update the selected incorrect examples.");
    } finally {
      ae(null);
    }
  }
  async function h(K) {
    var ce, Ee;
    if (!K || C != null || m) return;
    J(K.id);
    const re = `incorrect-example-remove:${k.id}:${K.id}:${K.revision}:${K.representationRevision}`;
    try {
      let be, ve = !1;
      try {
        be = await X(
          `/videos/${k.id}/incorrect-examples/${K.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Oe(re),
              expectedExampleRevision: K.revision,
              expectedRepresentationRevision: K.representationRevision
            })
          }
        );
      } catch (ke) {
        if (ke.status !== 409 || ((Ee = (ce = ke.payload) == null ? void 0 : ce.result) == null ? void 0 : Ee.code) !== "OPERATION_REPLAYED")
          throw ke;
        be = ke.payload.result, ve = !0;
      }
      Pe(re);
      let Me = !0;
      if (d) {
        const Ie = [{ segment: Ke(c.segments, {
          itemId: K.itemId
        }) || {
          id: K.itemId == null ? null : -K.itemId,
          itemId: K.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: K.representationRevision
        }, result: be, example: K }];
        Me = await L(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          Qn(Ie, !0),
          Qn(Ie, !1)
        );
      }
      const Se = await X(
        `/videos/${k.id}/incorrect-examples`
      );
      j(Se), ve ? await D() : V(
        Fr(c, be.editorDelta),
        k.id
      ), K.representation === "basicNativeBin" && Cn(), _(Me ? ve ? d ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : K.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (be) {
      be.status === 409 && await w(), _(be.message || "Unable to remove the incorrect example.");
    } finally {
      J(null);
    }
  }
  async function v() {
    if (m || C != null || u.length === 0) return;
    ge(!0);
    const K = `incorrect-example-export:${k.id}:${u.map((re) => `${re.id}:${re.revision}:${re.representationRevision}`).join(",")}`;
    try {
      const re = await Gl(
        k.id,
        u
      ), ce = new FormData();
      ce.append("metadata", JSON.stringify({
        operationId: Oe(K),
        examples: re.captures
      }));
      for (const ke of re.files)
        ce.append(ke.fieldName, ke.file);
      const Ee = await X(
        `/videos/${k.id}/incorrect-examples/export`,
        { method: "POST", body: ce }
      ), be = await ol(Ee.downloadUrl), ve = URL.createObjectURL(be.blob), Me = document.createElement("a");
      Me.href = ve, Me.download = be.fileName, Me.click(), setTimeout(() => URL.revokeObjectURL(ve), 1e3);
      const Se = await X(
        `/training-exports/${Ee.id}/complete`,
        { method: "POST" }
      );
      Pe(K), j(await X(
        `/videos/${k.id}/incorrect-examples`
      )), _(
        `Downloaded ${Ee.exampleCount} incorrect example${Ee.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Se.clearedExampleCount} from the working collection.`
      );
    } catch (re) {
      _(re.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ge(!1);
    }
  }
  async function G(K = null) {
    const re = z.filter((Ie) => Ie.reviewState === "rejected"), ce = re.length, Ee = u.some((Ie) => Ie.representation === "fullItem");
    if (K == null && ce === 0 && !Ee) {
      _("There are no rejected segments to delete.");
      return;
    }
    if (K == null) {
      ae(-1), _("Preparing deletion summary…");
      try {
        const Ie = await X(`/videos/${k.id}/rejected/deletion/preview`, { method: "POST" }), $e = Number(Ie.deletedSegmentCount) || 0, Te = Number(Ie.deferredRejectedSegmentCount) || 0, Le = Number(Ie.protectedIncorrectExampleCount) || 0;
        if ($e === 0) {
          Te > 0 ? _(
            `${Te} feedback-protected rejected segment${Te === 1 ? "" : "s"} kept. ${Le} AI feedback example${Le === 1 ? "" : "s"} must be exported before ${Te === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : _("There are no rejected segments to delete.");
          return;
        }
        if (!Fa(Ie, _)) return;
        T(Ie), _("");
      } catch (Ie) {
        _(Ie.message || "Unable to prepare rejected segment deletion.");
      } finally {
        ae(null);
      }
      return;
    }
    const be = K, ve = Number(be.deferredRejectedSegmentCount) || 0, Me = B.current, Se = ve === 0 ? jr(c, re.map((Ie) => Ie.id)) : c, ke = Se.segments.find((Ie) => Ie.reviewState === "unreviewed") || Se.segments[0] || null;
    T(null), ae(-1), _("Deleting rejected segments…"), ve === 0 && (V(Se, k.id), S(ke ? [ke.id] : []), se((ke == null ? void 0 : ke.id) ?? null), $.current = (ke == null ? void 0 : ke.id) ?? null, F.current = []);
    try {
      const Ie = `rejected-dependency-delete:${k.id}:${be.fingerprint}`, $e = await X(`/videos/${k.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(Ie),
          fingerprint: be.fingerprint
        })
      });
      Pe(Ie), await D(), $e.deletedSegmentCount > 0 && t(kt);
      const Te = ve > 0 ? ` ${ve} feedback-protected rejected segment${ve === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      _(`${$e.deletedSegmentCount} segment${$e.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Te}`);
    } catch (Ie) {
      ve === 0 && V(($e) => Ja(
        $e,
        re
      ), k.id), S(Me == null ? [] : [Me]), se(Me), $.current = Me, F.current = [], _(Ie.message || "Unable to delete rejected segments.");
    } finally {
      ae(null);
    }
  }
  async function ie(K = o) {
    if (!(i || K.length === 0)) {
      pe(!0), Z("");
      try {
        const re = await X(`/videos/${k.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: K.flatMap((ce) => ce.nativeSegmentId == null ? [] : [ce.nativeSegmentId]),
            itemIds: K.flatMap((ce) => ce.published || ce.itemId == null ? [] : [ce.itemId])
          })
        });
        le(!1), await D(), _(`${re.assignedSegmentCount} segment${re.assignedSegmentCount === 1 ? "" : "s"} received ${re.assignedSlotCount} performer-slot assignment${re.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (re) {
        Z(re.message || "Unable to auto-assign performers.");
      } finally {
        pe(!1);
      }
    }
  }
  async function ne() {
    oe(!0), te(""), !b && (ue(!0), A());
  }
  function ee() {
    y.current = !0, oe(!1), requestAnimationFrame(() => {
      var K;
      return (K = f.current) == null ? void 0 : K.focus({ preventScroll: !0 });
    });
  }
  async function we() {
    if (!b || N || b.createCount + b.linkCount === 0)
      return;
    xe(!0), te("");
    let K;
    try {
      const re = `materialize-derived:${k.id}:${b.fingerprint}`;
      K = await X(`/videos/${k.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(re),
          fingerprint: b.fingerprint,
          maxDepth: 3
        })
      }), Pe(re);
    } catch (re) {
      re.status === 409 && he(null), te(re.message || "Unable to materialize derived segments."), xe(!1);
      return;
    }
    he((re) => re && { ...re, createCount: 0, linkCount: 0 });
    try {
      await D(), ee(), he(null);
      const re = K.createdCount + K.linkedCount;
      _(`${K.createdCount} derived segment${K.createdCount === 1 ? "" : "s"} created and ${K.linkedCount} existing segment${K.linkedCount === 1 ? "" : "s"} linked.`), re === 0 && _("Every applicable derivation was already materialized.");
    } catch {
      te("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    xe(!1);
  }
  async function Y(K, re = null) {
    var Ee, be, ve, Me;
    const ce = {
      tagId: K,
      ...re ? { tagName: re } : {}
    };
    if (I.length > 1) {
      const Se = I.filter((Le) => Le.tagId !== K);
      if (Se.length === 0) {
        l();
        return;
      }
      const ke = I.map((Le) => ({
        id: Le.id,
        itemId: Le.itemId,
        nativeSegmentId: Le.nativeSegmentId
      })), Ie = I.map((Le) => !d || Le.nativeSegmentId != null ? `native:${Le.nativeSegmentId}:${Le.updatedAt}` : `item:${Le.itemId}:${Le.revision}`).sort().join(","), $e = `bulk-tag:${k.id}:${K}:${Ie}`;
      ae((H == null ? void 0 : H.id) ?? Se[0].id), _(`Changing tag for ${Se.length} selected segment${Se.length === 1 ? "" : "s"}…`);
      const Te = ar(
        c,
        Se.map((Le) => Le.id),
        ce
      );
      V(Te, k.id), l();
      try {
        const Le = d ? null : crypto.randomUUID();
        await X(`/videos/${k.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Oe($e),
            tagId: K,
            historyReceiptId: Le,
            segments: I.map((qe) => {
              const Je = !d || qe.nativeSegmentId != null;
              return {
                nativeSegmentId: Je ? qe.nativeSegmentId : null,
                itemId: Je ? null : qe.itemId,
                expectedUpdatedAt: Je ? qe.updatedAt : null,
                expectedRevision: Je ? null : qe.revision
              };
            })
          })
        }), Pe($e);
        const Qe = dt(
          I,
          d
        ), Fe = await D(), Ne = ke.map((qe) => Ke(Fe == null ? void 0 : Fe.segments, qe)).filter(Boolean);
        await L(
          "segments.tag",
          `Changed tag for ${Se.length} segment${Se.length === 1 ? "" : "s"}`,
          Qe,
          dt(Ne, d),
          Le
        );
        const He = ke.map((qe) => Ke(Fe == null ? void 0 : Fe.segments, qe)).filter(Boolean);
        S(He.map((qe) => qe.id)), se(((Ee = He.find((qe) => qe.id === (H == null ? void 0 : H.id))) == null ? void 0 : Ee.id) ?? ((be = He[0]) == null ? void 0 : be.id) ?? null), l(), _(`${Se.length} selected segment${Se.length === 1 ? "" : "s"} retagged.`);
      } catch (Le) {
        V((Ne) => En(
          Ne,
          Se,
          Object.keys(ce)
        ), k.id);
        const Qe = ke.map((Ne) => Ke(c.segments, Ne)).filter(Boolean), Fe = Ke(c.segments, {
          id: H == null ? void 0 : H.id,
          itemId: H == null ? void 0 : H.itemId,
          nativeSegmentId: H == null ? void 0 : H.nativeSegmentId
        }) || Qe[0] || null;
        S(Qe.map((Ne) => Ne.id)), se((Fe == null ? void 0 : Fe.id) ?? null), $.current = (Fe == null ? void 0 : Fe.id) ?? null, F.current = [], Le.status === 409 && await w(), _(Le.message || "Unable to change the selected segment tags.");
      } finally {
        ae(null);
      }
      return;
    }
    if (!(I.length !== 1 || !H)) {
      if (K === H.tagId) {
        l();
        return;
      }
      if (H.itemId != null && ((Me = (ve = p.data) == null ? void 0 : ve.children) == null ? void 0 : Me.length) > 0) {
        ae(H.id), _("Checking lineage impact…");
        try {
          const Se = await X(`/items/${H.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: H.revision, tagId: K })
          }), ke = Se.deletedItemIds.length > 0 || Se.removedEdgeIds.length > 0;
          if (ke && !window.confirm(
            `Changing this tag removes ${Se.removedEdgeIds.length} lineage edge${Se.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Se.deletedItemIds.length} derived segment${Se.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            _("Tag change canceled.");
            return;
          }
          const Ie = ar(
            c,
            [H.id],
            ce
          );
          V(Ie, k.id), l();
          const $e = `tag-change:${H.itemId}:${H.revision}:${Se.componentFingerprint}:${K}`;
          await X(`/items/${H.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Oe($e),
              expectedRevision: H.revision,
              componentFingerprint: Se.componentFingerprint,
              tagId: K
            })
          }), Pe($e), await D(), l(), _(ke ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (Se) {
          V((ke) => En(
            ke,
            [H],
            Object.keys(ce)
          ), k.id), S([H.id]), se(H.id), $.current = H.id, F.current = [], Se.status === 409 ? (_("Lineage changed — loading the latest segments…"), await w()) : _(Se.message || "Unable to reconcile the lineage.");
        } finally {
          ae(null);
        }
        return;
      }
      l(), await x(H, {
        startSec: H.startSec,
        endSec: H.endSec,
        tagId: K
      }, !0, null, !0, ce);
    }
  }
  async function Q() {
    var Me, Se, ke, Ie;
    if (!s || !H || O != null) return;
    const K = [...I].sort(($e, Te) => Number($e.nativeSegmentId ?? $e.id) - Number(Te.nativeSegmentId ?? Te.id)), re = new Set(K.map(($e) => $e.id)), ce = K.map(($e) => `${$e.nativeSegmentId ?? $e.id}:${$e.updatedAt}`).join("|");
    ae(H.id), _(`Moving ${K.length} segment${K.length === 1 ? "" : "s"} to recycling bin…`);
    const Ee = `bulk-move:${k.id}:${ce}`, be = Oe(Ee), ve = d ? null : crypto.randomUUID();
    try {
      const $e = (Ne = !1) => X(`/videos/${k.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: be,
          segments: K.map((He) => ({
            segmentId: He.nativeSegmentId ?? He.id,
            expectedUpdatedAt: He.updatedAt
          })),
          discardMissingImage: Ne,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: ve
        })
      });
      let Te;
      try {
        Te = await $e(
          qr(Ee)
        );
      } catch (Ne) {
        if (((Me = Ne.payload) == null ? void 0 : Me.code) !== "missing-image" || !window.confirm(`${Ne.message}

Continue and discard the missing image reference?`)) throw Ne;
        Wr(Ee), Te = await $e(!0);
      }
      Pe(Ee), Cn();
      const Le = new Map((Te.items || []).map((Ne) => [
        Number(Ne.segmentId),
        Ne
      ]));
      await L(
        "segments.moveToBin",
        `Moved ${K.length} segment${K.length === 1 ? "" : "s"} to recycling bin`,
        dt(K, !1),
        dt(K.map((Ne) => {
          const He = Le.get(
            Number(Ne.nativeSegmentId ?? Ne.id)
          );
          return {
            ...Ne,
            recycleBinItemId: (He == null ? void 0 : He.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (He == null ? void 0 : He.revision) ?? null
          };
        }), !1),
        ve
      );
      const Qe = z.filter((Ne) => !re.has(Ne.id)), Fe = hs(r, re, H.id);
      V({ ...c, segments: Qe }, k.id), S(Fe ? [Fe.id] : []), se((Fe == null ? void 0 : Fe.id) ?? null), $.current = (Fe == null ? void 0 : Fe.id) ?? null, F.current = [], Fe && (M(mt(r, Fe.id)), E(Fe.id)), requestAnimationFrame(() => {
        var Ne;
        return (Ne = g.current) == null ? void 0 : Ne.focus({ preventScroll: !0 });
      }), _(`Moved ${K.length} segment${K.length === 1 ? "" : "s"} to recycling bin.`);
    } catch ($e) {
      const Te = ((Se = $e.payload) == null ? void 0 : Se.code) || ((Ie = (ke = $e.payload) == null ? void 0 : ke.result) == null ? void 0 : Ie.code);
      $e.status === 409 && Te === "CANONICAL_SEGMENT_CHANGED" ? await w() : _($e.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      ae(null);
    }
  }
  async function q() {
    if (!(d || a.current || O != null)) {
      a.current = !0, _("Checking the recycling bin…");
      try {
        const K = await X("/bin"), re = await Ba(K, () => _("Emptying the recycling bin…"));
        if (re.status === "empty") {
          _("The recycling bin is empty.");
          return;
        }
        if (re.status === "canceled") {
          _("The recycling bin was not emptied.");
          return;
        }
        _(`${re.segmentCount} segment${re.segmentCount === 1 ? "" : "s"} from ${re.sceneCount} scene${re.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (K) {
        _(K.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: R, removeIncorrectExample: h, captureTrainingExport: v, deleteRejectedSegments: G, autoAssignPerformers: ie, previewDerivedSegments: ne, closeMaterializeDialog: ee, materializeDerivedSegments: we, saveTag: Y, moveToBin: Q, emptyRecyclingBin: q };
}
function Md(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: p, onReload: f, railToggleRef: b, recordHistoryAction: y, savingSegmentId: N, savingShot: x, savingShotRef: w, setCollapsedSegmentGroups: V, setEditorLayout: D, setHistorySaving: L, setIncorrectExamples: A, setSaveMessage: C, setSavingSegmentId: E, setSavingShot: O, shotBoundaries: z, timelineDuration: H, video: B, workspaceRef: I } = e;
  async function $(S, k, R) {
    var ie, ne, ee, we;
    const h = S.type === "segment" ? [S] : S.segments || [], v = (k == null ? void 0 : k.type) === "segment" ? [k] : (k == null ? void 0 : k.segments) || [];
    let G = R;
    for (const [Y, Q] of h.entries()) {
      const q = v[Y], K = ((ie = Q.identity) == null ? void 0 : ie.nativeSegmentId) != null || ((ne = Q.identity) == null ? void 0 : ne.published) === !0, re = ((ee = q == null ? void 0 : q.identity) == null ? void 0 : ee.recycleBinItemId) ?? ((we = q == null ? void 0 : q.identity) == null ? void 0 : we.itemId);
      let ce = Ke(G.segments, q == null ? void 0 : q.identity) || Ke(G.segments, Q.identity);
      if (!ce && K && re != null && q.identity.revision != null) {
        const ve = `history-restore:${B.id}:${re}:${q.identity.revision}`;
        await X(`/bin/${re}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Oe(ve),
            expectedRevision: q.identity.revision
          })
        }), Pe(ve), G = await f(), ce = G.segments.find((Me) => Me.tagId === Q.values.tagId && Me.startSec === Q.values.startSec && Me.endSec === Q.values.endSec);
      }
      if (!ce)
        throw new Error("A segment in this history state no longer exists.");
      if ((ce.nativeSegmentId != null || ce.published === !0) !== K) {
        if (K) {
          const ve = ce.recycleBinItemId ?? ce.itemId ?? re;
          if (ve == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Me = `history-restore:${B.id}:${ve}:${ce.revision}:${Q.values.reviewState ?? "native"}`;
          await X(`/bin/${ve}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Oe(Me),
              expectedRevision: ce.revision
            })
          }), Pe(Me);
        } else {
          const ve = `history-bin:${B.id}:${ce.nativeSegmentId}:${ce.updatedAt}:${Q.values.reviewState}`;
          await X(`/videos/${B.id}/segments/${ce.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Oe(ve),
              expectedUpdatedAt: ce.updatedAt,
              reviewState: Q.values.reviewState
            })
          }), Pe(ve);
        }
        if (G = await f(), !K)
          continue;
        if (ce = Ke(G.segments, Q.identity) || G.segments.find((ve) => ve.tagId === Q.values.tagId && ve.startSec === Q.values.startSec && ve.endSec === Q.values.endSec), !ce)
          throw new Error("The restored segment could not be found.");
      }
      const be = Q.values;
      if (ce.nativeSegmentId == null && ce.itemId != null) {
        const ve = `history-draft-update:${B.id}:${ce.itemId}:${ce.revision}:${be.tagId}:${be.startSec}:${be.endSec ?? "open"}:${be.reviewState}`;
        await X(`/videos/${B.id}/drafts/${ce.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Oe(ve),
            expectedRevision: ce.revision,
            ...be
          })
        }), Pe(ve);
      } else
        await X(`/videos/${B.id}/segments/${ce.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...be, expectedUpdatedAt: ce.updatedAt })
        });
      G = await f();
    }
    return G;
  }
  async function F(S, k) {
    var R;
    for (const h of S.targets || []) {
      const v = Ke(k.segments, h.identity);
      if (!v)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const G = (R = k.performerSlotRevisions) == null ? void 0 : R[v.id];
      await X(v.published ? `/videos/${B.id}/segments/${v.nativeSegmentId}/slots` : `/videos/${B.id}/drafts/${v.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: G,
          assignments: h.assignments
        })
      }), k = await f();
    }
    return k;
  }
  async function Z(S, k, R) {
    if (!r)
      throw new Error("AI feedback history is only available in Full mode.");
    let h = k, v = await X(`/videos/${B.id}/incorrect-examples`);
    const G = (ie) => v.find((ne) => {
      var ee;
      return ne.id === ie.exampleId || ((ee = ie.collectedIdentity) == null ? void 0 : ee.itemId) != null && ne.itemId === ie.collectedIdentity.itemId;
    });
    for (const [ie, ne] of (S.entries || []).entries()) {
      const ee = `history-feedback:${B.id}:${R.action.sequence}:${R.direction}:${ie}`, we = G(ne);
      if (S.collected && we) {
        Pe(ee);
        continue;
      }
      let Y;
      if (S.collected) {
        const Q = Ke(
          h.segments,
          ne.collectedIdentity
        ) || Ke(
          h.segments,
          ne.originalIdentity
        );
        if (!Q)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const q = Q.nativeSegmentId != null;
        Y = await X(`/videos/${B.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Oe(ee),
            nativeSegmentId: q ? Q.nativeSegmentId : null,
            itemId: q ? null : Q.itemId,
            expectedUpdatedAt: q ? Q.updatedAt : null,
            expectedRevision: q ? null : Q.revision
          })
        });
      } else {
        if (!we) {
          Pe(ee);
          continue;
        }
        Y = await X(
          `/videos/${B.id}/incorrect-examples/${we.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Oe(ee),
              expectedExampleRevision: we.revision,
              expectedRepresentationRevision: we.representationRevision
            })
          }
        );
      }
      Pe(ee), h = Fr(
        h,
        Y.editorDelta
      ), v = await X(
        `/videos/${B.id}/incorrect-examples`
      );
    }
    return A(v), h;
  }
  async function le(S, k, R = []) {
    const h = S.state;
    if (!r && ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")) {
      const G = `basic-history:${B.id}:${d.current.revision}:${S.action.sequence}:${S.direction}`, ie = await X(`/videos/${B.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(G),
          expectedHistoryRevision: d.current.revision,
          actionSequence: S.action.sequence,
          direction: S.direction
        })
      });
      return t(ie.history), R.push(G), f();
    }
    const v = S.direction === "backward" ? S.action.afterState : S.action.beforeState;
    if ((h == null ? void 0 : h.type) === "composite") {
      let G = k;
      const ie = (v == null ? void 0 : v.type) === "composite" ? v.states || [] : [];
      for (const [ne, ee] of (h.states || []).entries()) {
        const we = ie[ne];
        G = await le({
          ...S,
          state: ee,
          action: {
            ...S.action,
            beforeState: S.direction === "backward" ? ee : we,
            afterState: S.direction === "backward" ? we : ee
          }
        }, G, R);
      }
      return G;
    }
    if ((h == null ? void 0 : h.type) === "segment" || (h == null ? void 0 : h.type) === "segments")
      return $(
        h,
        v,
        k
      );
    if ((h == null ? void 0 : h.type) === "performerSlots")
      return F(h, k);
    if ((h == null ? void 0 : h.type) === "incorrectExamples")
      return Z(h, k, S);
    if ((h == null ? void 0 : h.type) === "shots") {
      const G = $n(k.shotBoundaries || []), ie = await X(`/videos/${B.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(`history-shots:${B.id}:${G}:${h.fingerprint}`),
          expectedFingerprint: G,
          boundaries: h.boundaries
        })
      });
      return { ...k, shotBoundaries: ie };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function pe(S) {
    var R;
    if (c || N != null || x || S === l.cursorSequence)
      return;
    const k = bl(l, S);
    if (k.length !== 0) {
      L(!0), E(-1), C(`Restoring ${k.length} history ${k.length === 1 ? "action" : "actions"}…`);
      try {
        let h = i;
        const v = [];
        for (const ie of k)
          h = await le(
            ie,
            h,
            v
          );
        const G = r ? await X(`/videos/${B.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: S
          })
        }) : d.current;
        v.forEach(Pe), t(G), await f(), C("History restored.");
      } catch (h) {
        h.status === 409 && ((R = h.payload) != null && R.current) && t(h.payload.current), await f(), C(h.message || "Unable to restore editor history.");
      } finally {
        E(null), L(!1);
      }
    }
  }
  function ge(S) {
    D((k) => ({ ...k, timelineRatio: _r(S, m) }));
  }
  function j(S) {
    var R;
    const k = (R = u.current) == null ? void 0 : R.getBoundingClientRect();
    k && ge(rs(S.clientY, k.top, k.height));
  }
  function te(S) {
    S.currentTarget.setPointerCapture(S.pointerId), j(S);
  }
  function ue(S) {
    S.currentTarget.hasPointerCapture(S.pointerId) && j(S);
  }
  function oe(S) {
    const k = S.shiftKey ? 0.1 : 0.05;
    let R = null;
    S.key === "ArrowUp" && (R = a.timelineRatio + k), S.key === "ArrowDown" && (R = a.timelineRatio - k);
    const h = zr(m);
    S.key === "Home" && (R = h.minimum), S.key === "End" && (R = h.maximum), R != null && (S.preventDefault(), S.stopPropagation(), ge(R));
  }
  function he(S) {
    const k = S === "detailWidth" ? g.focusRow : g.workspace, R = g.workspace > 0 ? Mr(g.workspace, 600) : 560, h = jt(a.markerRailWidth, R), v = S === "detailWidth" ? 344 + (a.markerRailOpen ? h + 24 : 0) : 600;
    return k > 0 ? Mr(k, v) : 560;
  }
  function xe(S, k) {
    D((R) => ({ ...R, [S]: jt(k, he(S)) }));
  }
  function T(S, k) {
    var h, v;
    const R = k === "detailWidth" ? (h = s.current) == null ? void 0 : h.getBoundingClientRect() : (v = I.current) == null ? void 0 : v.getBoundingClientRect();
    R && xe(k, k === "detailWidth" ? S.clientX - R.left : R.right - S.clientX);
  }
  function J(S, k) {
    const R = he(S), h = jt(a[S], R);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": k,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(R),
      "aria-valuenow": Math.round(h),
      "aria-valuetext": `${Math.round(h)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), T(v, S);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && T(v, S);
      },
      onKeyDown: (v) => {
        const G = v.shiftKey ? 40 : 16;
        let ie = null;
        v.key === "ArrowLeft" && (ie = S === "detailWidth" ? -G : G), v.key === "ArrowRight" && (ie = S === "detailWidth" ? G : -G);
        let ne = ie == null ? null : h + ie;
        v.key === "Home" && (ne = 240), v.key === "End" && (ne = R), ne != null && (v.preventDefault(), v.stopPropagation(), xe(S, ne));
      },
      onDoubleClick: () => xe(S, at[S]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function _() {
    D((S) => ({ ...S, markerRailOpen: !S.markerRailOpen })), requestAnimationFrame(() => {
      var S;
      return (S = b.current) == null ? void 0 : S.focus({ preventScroll: !0 });
    });
  }
  function ae(S) {
    V((k) => k.includes(S) ? k.filter((R) => R !== S) : Rt([...k, S]));
  }
  async function M(S, k = !0, R = o) {
    var ie;
    if (w.current) return null;
    const h = Number((ie = B.videoFile) == null ? void 0 : ie.duration) || H, v = $n(z), G = `shot-${S}:${B.id}:${R.toFixed(3)}:${h.toFixed(3)}:${v}`;
    w.current = !0, O(!0), C(S === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const ne = await X(`/videos/${B.id}/shot-boundaries/${S}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(S === "split" ? { operationId: Oe(G), timeSec: R } : { operationId: Oe(G), timeSec: R })
      });
      return Pe(G), p((ee) => ({ ...ee, shotBoundaries: ne }), B.id), k && await y(
        "shots.update",
        S === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: z,
          fingerprint: v
        },
        {
          type: "shots",
          boundaries: ne,
          fingerprint: $n(ne)
        }
      ), C(S === "split" ? "Shot boundary added." : "Shots merged."), ne;
    } catch (ne) {
      return C(ne.message || "Unable to edit shot boundaries."), null;
    } finally {
      w.current = !1, O(!1);
    }
  }
  async function se(S) {
    if (w.current) return null;
    const k = `shot-restore:${B.id}:${S.afterFingerprint}`;
    w.current = !0, O(!0), C("Undoing shot edit…");
    try {
      const R = await X(`/videos/${B.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(k),
          expectedFingerprint: S.afterFingerprint,
          boundaries: S.before
        })
      });
      return Pe(k), p((h) => ({ ...h, shotBoundaries: R }), B.id), R;
    } catch (R) {
      return C(R.message || "Unable to undo the shot edit."), null;
    } finally {
      w.current = !1, O(!1);
    }
  }
  return { applySegmentHistoryState: $, applyPerformerSlotHistoryState: F, applyHistoryState: le, restoreHistoryTarget: pe, updateTimelineRatio: ge, updateTimelineRatioFromPointer: j, handleSeparatorPointerDown: te, handleSeparatorPointerMove: ue, handleSeparatorKeyDown: oe, panelWidthMaximum: he, updatePanelWidth: xe, handlePanelSeparatorPointer: T, panelSeparatorProps: J, toggleSegmentRail: _, toggleSegmentGroup: ae, mutateShotBoundary: M, restoreShotBoundaries: se };
}
function Ed(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: p, mergeSelectedSwimlane: f, moveToBin: b, mutateShotBoundary: y, openPublishApprovedDialog: N, playbackControlsRef: x, playbackShortcutConfig: w, saveSelectedReviewState: V, seekRef: D, segmentGroupKeys: L, selectSegment: A, selectedSegment: C, selectedSegmentGroupForSegment: E, selectedSegmentGroupKey: O, selectedSegments: z, setCollapsedSegmentGroups: H, setIncorrectExamplesOpen: B, setQuickSearchOpen: I, setSaveMessage: $, setSelectedSegmentGroupKey: F, setTagEditing: Z, setTimelineZoom: le, shotBoundaries: pe, slotButtonRef: ge, splitSegment: j, swimlanes: te, timelineDuration: ue, toggleIncorrectExample: oe, toggleSegmentGroup: he, updateTimelineRatio: xe, videoFrameRate: T, visibleSegments: J } = e;
  function _(M, se) {
    if (z.length > 1 && Is(M.id))
      return;
    let S = null;
    M.id === "video.playPause" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.toggle();
    }), M.id === "video.seekSmallBackward" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.seekBy(-w.smallSeekTime);
    }), M.id === "video.seekSmallForward" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.seekBy(w.smallSeekTime);
    }), M.id === "video.seekMediumBackward" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.seekBy(-w.mediumSeekTime);
    }), M.id === "video.seekMediumForward" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.seekBy(w.mediumSeekTime);
    }), M.id === "video.seekLongBackward" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.seekBy(-w.longSeekTime);
    }), M.id === "video.seekLongForward" && (S = () => {
      var k;
      return (k = x.current) == null ? void 0 : k.seekBy(w.longSeekTime);
    }), M.id === "video.playSelected" && C && (S = () => {
      var k;
      (k = D.current) == null || k.call(D, C.startSec, !0), requestAnimationFrame(() => {
        var R;
        return (R = g.current) == null ? void 0 : R.focus({ preventScroll: !0 });
      });
    }), (M.id === "video.playPreviousSegment" || M.id === "video.playNextSegment") && (S = () => {
      var R;
      const k = Lr(
        te,
        C == null ? void 0 : C.id,
        M.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !k || k.id === (C == null ? void 0 : C.id) || (A(k, { focusEditor: !0, seekToSegment: !1 }), (R = D.current) == null || R.call(D, k.startSec, !0));
    }), M.id.startsWith("video.seekPercent") && (S = () => {
      var R;
      const k = Number(M.id.slice(17)) / 10;
      (R = D.current) == null || R.call(D, xs(p ?? ue, k), !1);
    }), M.id === "video.jumpToSegmentStart" && C && (S = () => {
      var k;
      return (k = D.current) == null ? void 0 : k.call(D, C.startSec, !1);
    }), M.id === "video.jumpToSegmentEnd" && C && (S = () => {
      var k;
      return (k = D.current) == null ? void 0 : k.call(D, C.endSec ?? C.startSec, !1);
    }), M.id === "video.jumpToVideoStart" && (S = () => {
      var k;
      return (k = D.current) == null ? void 0 : k.call(D, 0, !1);
    }), M.id === "video.jumpToVideoEnd" && (S = () => {
      var k;
      return (k = D.current) == null ? void 0 : k.call(D, ue, !1);
    }), M.id.startsWith("video.frame") && (S = () => {
      var h, v;
      const k = M.id.includes("Small") ? "small" : M.id.includes("Medium") ? "medium" : "long", R = w[`${k}FrameStep`] * (M.id.endsWith("Backward") ? -1 : 1);
      (h = x.current) == null || h.pause(), (v = x.current) == null || v.seekBy(Bs(R, T));
    }), M.id.startsWith("navigation.swimlane") && (S = () => {
      const k = M.id.slice(19).toLowerCase(), R = Lr(te, C == null ? void 0 : C.id, k, s);
      R && A(R, { focusEditor: !0, seekToSegment: !1 });
    }), (M.id === "navigation.extendSwimlaneLeft" || M.id === "navigation.extendSwimlaneRight") && (S = () => {
      const k = Dl(
        t,
        C == null ? void 0 : C.id,
        M.id.endsWith("Left") ? "left" : "right"
      );
      k && A(k.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: k.segmentIds
      });
    }), (M.id === "navigation.segmentGroupUp" || M.id === "navigation.segmentGroupDown") && (S = () => {
      const k = Ol(
        L,
        O ?? E,
        M.id.endsWith("Up") ? -1 : 1
      );
      k && F(k);
    }), (M.id === "navigation.previousAtPlayhead" || M.id === "navigation.nextAtPlayhead") && (S = () => {
      const k = os(J, s, M.id === "navigation.previousAtPlayhead" ? -1 : 1, C == null ? void 0 : C.id);
      k && A(k, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.nearestInCurrentSwimlane" && (S = () => {
      const k = Wi(
        te,
        C == null ? void 0 : C.id,
        s
      );
      k && A(k, { focusEditor: !0, seekToSegment: !1 });
    }), M.id.includes("Unreviewed") && (S = () => {
      const k = Sa(
        te,
        C == null ? void 0 : C.id,
        M.id.startsWith("navigation.previous") ? -1 : 1,
        M.id.endsWith("Global")
      );
      k && A(k, { focusEditor: !0, seekToSegment: !1 });
    }), (M.id === "navigation.nextTouchingPlayhead" || M.id === "navigation.previousTouchingPlayhead") && (S = () => {
      const k = qi(te, s, M.id === "navigation.previousTouchingPlayhead" ? -1 : 1, C == null ? void 0 : C.id);
      k && A(k, { focusEditor: !0, seekToSegment: !1 });
    }), M.id === "navigation.quickSearch" && (S = () => I(!0)), (M.id === "navigation.previousShot" || M.id === "navigation.nextShot") && (S = () => {
      var R;
      const k = js(pe, s, M.id === "navigation.previousShot" ? -1 : 1);
      k && ((R = D.current) == null || R.call(D, k.startSec, !1));
    }), M.id === "shot.split" && (S = () => y("split")), M.id === "shot.merge" && (S = () => y("merge")), M.id === "marker.create" && (S = () => a()), M.id === "marker.duplicate" && (S = () => d(!1)), M.id === "marker.duplicateAtPlayhead" && (S = () => d(!0)), M.id === "marker.split" && (S = () => j()), M.id === "marker.editTag" && (S = () => {
      var k;
      if (z.length > 1 && z.some((R) => R.isDerived)) {
        $("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((k = u.data) != null && k.tagReadOnly) {
        $("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      Z(!0);
    }), M.id === "marker.setStart" && C && (S = () => r(s, C.endSec)), M.id === "marker.setEnd" && C && (S = () => r(C.startSec, s)), M.id === "marker.copyTiming" && C && (S = () => {
      $(Zl(C) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), M.id === "marker.pasteTiming" && C && (S = () => {
      const k = Ql();
      if (!k) {
        $("No copied segment timing is available.");
        return;
      }
      r(k.startSec, k.endSec);
    }), M.id === "marker.mergeSelection" && (S = () => f()), M.id === "marker.moveToBin" && (S = () => b()), M.id === "marker.toggleIncorrectExample" && C && (S = () => oe()), M.id === "marker.openIncorrectExamples" && (S = () => B(!0)), M.id === "markerGroup.toggleCollapse" && O && (S = () => he(O)), M.id === "markerGroup.toggleAll" && (S = () => H((k) => El(k, L))), M.id === "marker.assignSlots" && (S = () => {
      var k;
      return (k = ge.current) == null ? void 0 : k.click();
    }), M.id === "navigation.zoomIn" && (S = () => le((k) => tr(k + 0.5))), M.id === "navigation.zoomOut" && (S = () => le((k) => tr(k - 0.5))), M.id === "navigation.resetZoom" && (S = () => le(1)), M.id === "navigation.centerPlayhead" && (S = () => {
      var k;
      return (k = o.current) == null ? void 0 : k.call(o);
    }), M.id === "layout.growSwimlanes" && (S = () => xe(c.timelineRatio + 0.05)), M.id === "layout.shrinkSwimlanes" && (S = () => xe(c.timelineRatio - 0.05)), M.id === "marker.confirm" && C && (S = () => V("approved")), M.id === "system.publishApproved" && (S = () => N(se.target)), M.id === "marker.reject" && C && (S = () => V("rejected")), M.id === "system.emptyBin" && (S = () => m()), M.id === "system.deleteRejected" && (S = () => l()), S && S();
  }
  function ae(M, se) {
    const S = Dn.find((k) => k.id === M);
    S && Xt(S, i) && _(S, se);
  }
  return { executeShortcutById: ae };
}
function Qo(e) {
  return e === !0;
}
function Zo() {
  const e = new AbortController();
  let t = !0;
  return {
    signal: e.signal,
    isActive: () => t && !e.signal.aborted,
    dispose: () => {
      t = !1, e.abort();
    }
  };
}
function Dd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = P(null), [l, d] = P(null), [c, g] = P(""), [m, u] = P({
    busy: !1,
    reviewState: null,
    error: ""
  }), p = fe(null);
  async function f(N) {
    u({ busy: !0, reviewState: N, error: "" });
    try {
      await X(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Pr(), reviewState: N })
      }), await t(), u({ busy: !1, reviewState: null, error: "" });
    } catch (x) {
      u({
        busy: !1,
        reviewState: null,
        error: x.message || "Unable to import Cove segments."
      });
    }
  }
  async function b(N) {
    try {
      const x = await X(`/videos/${e}/analysis-runs`, {
        signal: N.signal
      });
      if (!N.isActive()) return null;
      const w = (x == null ? void 0 : x[0]) || null;
      return s(w), (w == null ? void 0 : w.status) === "completed" && p.current !== w.id && (p.current = w.id, await t()), ((w == null ? void 0 : w.status) === "failed" || (w == null ? void 0 : w.status) === "cancelled") && g(w.errorMessage || "Video analysis did not complete."), w;
    } catch (x) {
      return N.isActive() && x.name !== "AbortError" && g(x.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(N = null) {
    g("");
    const x = N || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), w = x.includes("omnishotcut") && o > 0;
    if (!(w && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const V = await X(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: x,
            replaceShotBoundaries: w,
            expectedShotBoundaryFingerprint: w ? i : null
          })
        });
        s(V);
      } catch (V) {
        g(V.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!Qo(r)) {
      s(null), d(null), g("");
      return;
    }
    const N = Zo();
    return b(N), X("/analysis/status", { signal: N.signal }).then((x) => {
      N.isActive() && (d(x), x.configured || g(""));
    }).catch((x) => {
      N.isActive() && x.name !== "AbortError" && g(x.message || "Unable to check video analysis readiness.");
    }), N.dispose;
  }, [e, r]), ye(() => {
    if (!Qo(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const N = Zo();
    let x = setTimeout(async function w() {
      await b(N), N.isActive() && (x = setTimeout(w, 2500));
    }, 2500);
    return () => {
      clearTimeout(x), N.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: f,
    nativeImportState: m,
    startFullAnalysis: y
  };
}
const In = Object.freeze([]);
function Od(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Pd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var yo, bo, ho, vo, xo;
  const [g, m] = P(null), [u, p] = P([]), f = fe(null), b = fe(null), y = fe([]), N = fe(null), [x, w] = P(() => ct({})), [V, D] = P(!1), [L, A] = P(ks), [C, E] = P(0), [O, z] = P(null), [H, B] = P(!1), [I, $] = P(""), [F, Z] = P(""), [le, pe] = P(""), [ge, j] = P(1), [te, ue] = P(Wl), [oe, he] = P(0), [xe, T] = P({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [J, _] = P(kt), ae = fe(kt), [M, se] = P(!1), [S, k] = P(!1), [R, h] = P(!1), [v, G] = P(!1), ie = fe(!1), [ne, ee] = P(null), [we, Y] = P(null), Q = fe(null), [q, K] = P(!1), [re, ce] = P(""), Ee = fe(null), be = fe(null), ve = fe(!1), Me = fe([]), Se = fe(!1), [ke, Ie] = P(Vl), [$e, Te] = P(null), [Le, Qe] = P(!1), [Fe, Ne] = P(!1), [He, qe] = P(!1), [Je, Ae] = P(!1), [Ce, Ge] = P(!1), [st, Ze] = P(""), {
    analysisError: Nt,
    analysisRun: Xe,
    analysisStatus: It,
    importNativeSegments: Mt,
    nativeImportState: tn,
    startFullAnalysis: Pn
  } = Dd(
    e.video.id,
    o,
    l,
    ((yo = e.shotBoundaries) == null ? void 0 : yo.length) || 0,
    $n(e.shotBoundaries || [])
  ), [Et, cr] = P(!1), [ft, ht] = P(null), [Ut, Dt] = P(l), [$t, ur] = P(0), [vt, mr] = P(!1), [nn, rn] = P(""), [xt, on] = P(null), zt = fe(null), Ln = fe(null), an = fe(!1), [Ot, Pt] = P([]), [sn, gr] = P(!1), [Fn, pr] = P(null), ln = Hl(), dn = fe(null), cn = fe(null), Lt = fe(null), jn = fe(s), Bn = fe(null), un = fe(null), mn = fe(null), gn = fe(null), rt = fe(null), Gn = fe(null), _t = fe(null), Kn = fe(null), Un = fe(null), pn = fe(null), fn = fe(null), St = fe(-1e12), fr = fe(null), zn = fe(!1), yn = fe(null), [bn, hn] = P({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Et || vt || !nn) return;
    const U = requestAnimationFrame(() => {
      var me;
      return (me = Ln.current) == null ? void 0 : me.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(U);
  }, [Et, vt, nn]), ye(() => {
    if (!an.current || Et || Ut) return;
    const U = requestAnimationFrame(() => {
      var me;
      (me = zt.current) == null || me.focus({ preventScroll: !0 }), an.current = !1;
    });
    return () => cancelAnimationFrame(U);
  }, [Et, Ut]);
  const _e = e.video, Ye = e.segments || In, _n = Be(() => JSON.stringify({
    segments: Ye.map((U) => [
      U.id,
      U.itemId,
      U.nativeSegmentId,
      U.tagId,
      U.startSec,
      U.endSec,
      U.reviewState,
      U.published,
      U.sourceKey,
      U.sourceRunId,
      U.confidence,
      U.revision,
      U.updatedAt
    ]),
    performerSlots: (e.performerSlots || In).map((U) => [
      U.segmentId,
      U.slotDefinitionId,
      U.performerId,
      U.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ye, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      ht(null), Dt(!1);
      return;
    }
    if (O != null) {
      Dt(!0);
      return;
    }
    let U = !0;
    Dt(!0);
    const me = setTimeout(() => {
      X(`/videos/${_e.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((De) => {
        U && (ht(De), rn(""));
      }).catch((De) => {
        U && (ht(null), rn(De.message || "Unable to preview derived segments."));
      }).finally(() => {
        U && Dt(!1);
      });
    }, 150);
    return () => {
      U = !1, clearTimeout(me);
    };
  }, [l, _e.id, _n, $t, O]);
  const yr = () => ur((U) => U + 1), yt = e.segmentGroups || In, Ue = e.performerSlots || In, Hn = l && e.performerSlotsAvailable !== !1, vn = Be(
    () => (e.performerCandidates || []).filter((U) => U.isVideoPerformer),
    [e.performerCandidates]
  ), xn = e.shotBoundaries || In, Ht = Be(
    () => _a(Ue),
    [Ue]
  ), Ct = Be(
    () => Ye.map((U) => {
      const me = Ht.get(U.id) || [];
      return {
        ...U,
        slots: me,
        assignment: me.every((De) => De.performerId == null) ? Qs(me, vn) : null
      };
    }).filter((U) => U.slots.length > 0 && U.assignment != null),
    [Ye, Ht, vn]
  ), br = Number((bo = _e.videoFile) == null ? void 0 : bo.frameRate) > 0 ? Number(_e.videoFile.frameRate) : 30;
  function Sn() {
    h(!1), requestAnimationFrame(() => {
      var U;
      return (U = rt.current) == null ? void 0 : U.focus({ preventScroll: !0 });
    });
  }
  function hr() {
    O == null && (fn.current = null, G(!1), $(""), requestAnimationFrame(() => {
      var U;
      return (U = rt.current) == null ? void 0 : U.focus({ preventScroll: !0 });
    }));
  }
  function kn() {
    D(!1), requestAnimationFrame(() => {
      var U, me;
      (U = _t.current) != null && U.isConnected ? _t.current.focus({ preventScroll: !0 }) : (me = rt.current) == null || me.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    pn.current === g ? (pn.current = null, h(!0)) : h(!1);
  }, [g]), ye(() => {
    var me;
    if (!R) return;
    const U = (me = Un.current) == null ? void 0 : me.querySelector("input");
    U == null || U.focus({ preventScroll: !0 }), U == null || U.select();
  }, [R, g]), ye(() => {
    var De, We, ot;
    const U = Bt(
      Nr(
        e.segments,
        e.performerSlots || [],
        ct({}),
        l && L,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), me = ((De = e.segments.find((Jn) => Jn.id === s)) == null ? void 0 : De.id) ?? ((We = xa(U)) == null ? void 0 : We.id) ?? null;
    m(me), p(me == null ? [] : [me]), b.current = me, y.current = [], Te(mt(U, me)), w(ct({})), D(!1), fn.current = null, G(!1), j(1), $(""), _(kt), ae.current = kt, se(!1), (ot = rt.current) == null || ot.focus({ preventScroll: !0 });
  }, [_e.id, s]), ye(() => {
    const U = new AbortController();
    return X(`/videos/${_e.id}/incorrect-examples`, { signal: U.signal }).then(Pt).catch((me) => {
      me.name !== "AbortError" && Pt([]);
    }), () => U.abort();
  }, [_e.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const U = new AbortController();
    return X(`/videos/${_e.id}/history`, { signal: U.signal }).then((me) => {
      const De = me || kt;
      ae.current = De, _(De);
    }).catch((me) => {
      me.name !== "AbortError" && $(me.message || "Unable to load editor history.");
    }), () => U.abort();
  }, [_e.id]), ye(() => {
    Yl(te);
  }, [te.timelineRatio, te.markerRailOpen, te.detailWidth, te.markerRailWidth, te.swimlaneTitleWidth]), ye(() => {
    Jl(ke);
  }, [ke]), ye(() => {
    ws(L);
  }, [L]), ye(() => {
    const U = un.current;
    if (!a || !U || typeof ResizeObserver > "u") return;
    const me = () => {
      const We = U.clientHeight;
      he(We), ue((ot) => {
        const Jn = _r(ot.timelineRatio, We);
        return Jn === ot.timelineRatio ? ot : { ...ot, timelineRatio: Jn };
      });
    }, De = new ResizeObserver(me);
    return De.observe(U), me(), () => De.disconnect();
  }, [a]), ye(() => {
    if (!ln || typeof ResizeObserver > "u") return;
    const U = gn.current, me = mn.current;
    if (!U || !me) return;
    const De = () => T({
      workspace: U.clientWidth,
      focusRow: me.clientWidth,
      focusRowHeight: me.clientHeight
    }), We = new ResizeObserver(De);
    return We.observe(U), We.observe(me), De(), () => We.disconnect();
  }, [ln, te.markerRailOpen]);
  const ut = Be(
    () => zo(
      Nr(
        Ye,
        Ue,
        x,
        l && L,
        yt
      ),
      Ot,
      !0
    ),
    [
      Ye,
      Ue,
      x,
      L,
      yt,
      l,
      Ot
    ]
  ), vr = Object.fromEntries(tt.map((U) => [U, ut.filter((me) => me.reviewState === U).length])), qt = zo(
    Nr(
      Ye,
      Ue,
      { ...x, reviewStates: tt },
      l && L,
      yt
    ),
    Ot,
    !0
  ), Wt = Object.fromEntries(tt.map((U) => [U, qt.filter((me) => me.reviewState === U).length])), W = [...new Set(Ye.map((U) => U.sourceKey).filter(Boolean))].sort((U, me) => pt(U).localeCompare(pt(me))), je = ds(
    x,
    l && L
  ), ze = Be(
    () => Bt(ut, yt, Ue),
    [ut, yt, Ue]
  ), de = ms(
    ze,
    g,
    s
  ), lt = Ss(ut, u), Vt = !l && lt.length > 0 && lt.every((U) => U.nativeSegmentId != null), qn = ut.map((U) => U.id), ti = qn.join("|");
  f.current = (de == null ? void 0 : de.id) ?? null;
  const Xr = Ht.get(de == null ? void 0 : de.id) || [], ni = Jr(Xr), eo = Be(
    () => Al(ze, u),
    [ze, u]
  ), xr = Be(() => Yr(ze), [ze]), wn = Be(
    () => Cl(xr, ke),
    [xr, ke]
  ), ri = Be(
    () => Ha(
      wn.rows,
      bn.scrollTop,
      bn.height
    ),
    [wn, bn]
  ), oi = Be(
    () => Ml(ze, ke),
    [ze, ke]
  ), Jt = de ? mt(ze, de.id) : null, Sr = yt.length > 0 ? xr.map((U) => U.key) : [], ai = Sr.join("|"), Wn = Math.max(
    0,
    Number((ho = _e.videoFile) == null ? void 0 : ho.duration) || 0,
    ...Ye.map((U) => Number(U.endSec ?? U.startSec) || 0)
  ), to = Number((vo = _e.videoFile) == null ? void 0 : vo.duration) > 0 ? Number(_e.videoFile.duration) : null;
  J.actions;
  const ii = Aa();
  ye(() => {
    const U = g === nr ? g : (de == null ? void 0 : de.id) ?? null;
    U !== g && m(U);
  }, [de, g]), ye(() => {
    p((U) => {
      const me = ys(
        U,
        qn,
        (de == null ? void 0 : de.id) ?? null
      );
      return me.length === U.length && me.every((De, We) => De === U[We]) ? U : me;
    });
  }, [ti, de == null ? void 0 : de.id]);
  const Yt = (de == null ? void 0 : de.itemId) == null ? null : ((xo = e.itemMetadata) == null ? void 0 : xo[de.itemId]) || null, si = {
    key: (de == null ? void 0 : de.itemId) != null ? `item:${de.itemId}` : (de == null ? void 0 : de.nativeSegmentId) != null ? `native:${de.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Yt == null ? void 0 : Yt.provenance) || (de == null ? void 0 : de.fieldProvenance) || [] : []
  }, kr = (de == null ? void 0 : de.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Yt == null ? void 0 : Yt.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    Z(de == null ? "" : String(de.startSec)), pe((de == null ? void 0 : de.endSec) == null ? "" : String(de.endSec));
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.startSec, de == null ? void 0 : de.endSec]), ye(() => {
    Jt && Ie((U) => Va(U, Jt));
  }, [_e.id, s, Jt]), ye(() => {
    Te((U) => Pl(Sr, U, Jt));
  }, [_e.id, ai, Jt]), ye(() => {
    if (!te.markerRailOpen || (de == null ? void 0 : de.id) == null) return;
    const U = yn.current, me = wn.rows.find((ot) => ot.kind === "segment" && ot.segment.id === de.id);
    if (!U || !me) return;
    const De = me.top + me.height;
    let We = U.scrollTop;
    me.top < U.scrollTop ? We = me.top : De > U.scrollTop + U.clientHeight && (We = Math.max(0, De - U.clientHeight)), We !== U.scrollTop && (U.scrollTop = We), hn({ scrollTop: We, height: U.clientHeight });
  }, [de == null ? void 0 : de.id, wn, te.markerRailOpen]), ye(() => {
    const U = yn.current;
    if (!te.markerRailOpen || !U) return;
    const me = () => hn({
      scrollTop: U.scrollTop,
      height: U.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      me();
      return;
    }
    const De = new ResizeObserver(me);
    return De.observe(U), me(), () => De.disconnect();
  }, [te.markerRailOpen]);
  const { revealSegmentGroupForSelection: no, replaceSegmentSelection: li, selectSegment: ro, selectSegmentCollection: di, selectAllVideoSegments: ci } = Td({
    allSwimlanes: ze,
    editorRef: rt,
    performerSlots: Ue,
    seekRef: dn,
    segmentGroups: yt,
    segments: Ye,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setCollapsedSegmentGroups: Ie,
    setEditorFilters: w,
    setHideDerivedSegments: A,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: Te,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p
  }), { acceptHistory: wr, recordHistoryAction: Vn, mutateSegment: ui, completeReview: mi, createSegment: oo, splitSegment: ao, duplicateSegment: io, saveTiming: gi, applyShortcutTiming: pi } = _l({
    compatibilityMode: l,
    currentTime: C,
    detail: e,
    editorFilters: x,
    endInput: le,
    hideDerivedSegments: L,
    historyRef: ae,
    mediaDuration: to,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: St,
    pendingDuplicateRef: fr,
    pendingFirstSegmentStartSecRef: fn,
    pendingTagEditSegmentIdRef: pn,
    replaceSegmentSelection: li,
    savingSegmentId: O,
    segments: Ye,
    selectedSegment: de,
    selectedSegmentIdRef: f,
    selectedSegments: lt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setEditorFilters: w,
    setFirstSegmentTagOpen: G,
    setHideDerivedSegments: A,
    setHistory: _,
    setHistoryOpen: se,
    setPublishApprovedError: ce,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSelectedSegmentGroupKey: Te,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    startInput: F,
    timelineDuration: Wn,
    video: _e
  });
  function so(U = null) {
    var We;
    if (!l || O != null || !Ye.some((ot) => !ot.published && ot.reviewState === "approved")) return;
    const me = ((We = rt.current) == null ? void 0 : We.ownerDocument) ?? document, De = me.activeElement === me.body ? null : me.activeElement;
    be.current = U != null && U.isConnected && U !== me.body ? U : De, ce(""), K(!0);
  }
  function lo() {
    O == null && (K(!1), ce(""), requestAnimationFrame(() => {
      Od(
        be.current,
        rt.current
      ), be.current = null;
    }));
  }
  async function fi() {
    await mi() && lo();
  }
  const { closeMergeConfirmation: yi, mergeSelectedSwimlane: co, saveSelectedReviewState: uo } = Ad({
    acceptHistory: wr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: N,
    historyRef: ae,
    mergeSavingRef: ie,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: Me,
    recordHistoryAction: Vn,
    revealSegmentGroupForSelection: no,
    reviewSavingRef: ve,
    savingSegmentId: O,
    selectedGroups: eo,
    selectedSegment: de,
    selectedSegmentIdRef: f,
    selectedSegments: lt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: ee,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    video: _e
  }), bi = (U) => {
    Me.current = Os(
      Me.current,
      U
    );
  };
  ye(() => {
    if (O != null || ve.current) return;
    let U = !1;
    for (; Me.current.length > 0; ) {
      const me = Me.current.shift(), De = Es(me, Ye);
      if (!De) {
        U = !0;
        continue;
      }
      uo(
        De.requestedState,
        De.selectedSegments,
        De.selectedSegment
      );
      return;
    }
    U && $("The queued review could not find its segment after refreshing.");
  }, [O, Ye]);
  const { toggleIncorrectExample: hi, removeIncorrectExample: vi, captureTrainingExport: xi, deleteRejectedSegments: mo, autoAssignPerformers: Si, previewDerivedSegments: ki, closeMaterializeDialog: wi, materializeDerivedSegments: Ni, saveTag: Ii, moveToBin: $i, emptyRecyclingBin: Ci } = Rd({
    acceptHistory: wr,
    allSwimlanes: ze,
    autoAssignCandidates: Ct,
    autoAssigning: Ce,
    binEmptyingRef: Se,
    canMoveSelectionToBin: Vt,
    closeTagEditing: Sn,
    compatibilityMode: l,
    detail: e,
    editorRef: rt,
    exportingExamples: sn,
    incorrectExamples: Ot,
    lineage: kr,
    materializeButtonRef: zt,
    materializePreview: ft,
    materializeRestoreFocusRef: an,
    materializing: vt,
    mutateSegment: ui,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: Vn,
    refreshMaterializationPreview: yr,
    removingExampleId: Fn,
    revealSegmentGroupForSelection: no,
    savingSegmentId: O,
    segments: Ye,
    selectedSegment: de,
    selectedSegmentIdRef: f,
    selectedSegments: lt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: Ze,
    setAutoAssignOpen: Ae,
    setAutoAssigning: Ge,
    setExportingExamples: gr,
    setIncorrectExamples: Pt,
    setMaterializeError: rn,
    setMaterializeLoading: Dt,
    setMaterializeOpen: cr,
    setMaterializePreview: ht,
    setMaterializing: mr,
    setRemovingExampleId: pr,
    setRejectedDeletionPreview: Y,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSelectedSegmentGroupKey: Te,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: p,
    video: _e
  }), { restoreHistoryTarget: Ti, updateTimelineRatio: go, handleSeparatorPointerDown: Ai, handleSeparatorPointerMove: Ri, handleSeparatorKeyDown: Mi, panelWidthMaximum: po, panelSeparatorProps: Ei, toggleSegmentRail: Di, toggleSegmentGroup: fo, mutateShotBoundary: Oi } = Md({
    acceptHistory: wr,
    compatibilityMode: l,
    currentTime: C,
    detail: e,
    editorLayout: te,
    focusRowRef: mn,
    history: J,
    historyRef: ae,
    historySaving: S,
    horizontalLayoutSize: xe,
    mediaStackHeight: oe,
    mediaStackRef: un,
    onDetailChange: t,
    onReload: o,
    railToggleRef: Gn,
    recordHistoryAction: Vn,
    savingSegmentId: O,
    savingShot: H,
    savingShotRef: zn,
    setCollapsedSegmentGroups: Ie,
    setEditorLayout: ue,
    setHistorySaving: k,
    setIncorrectExamples: Pt,
    setSaveMessage: $,
    setSavingSegmentId: z,
    setSavingShot: B,
    shotBoundaries: xn,
    timelineDuration: Wn,
    video: _e,
    workspaceRef: gn
  }), { executeShortcutById: Pi } = Ed({
    allSwimlanes: ze,
    applyShortcutTiming: pi,
    centerTimelineRef: Bn,
    compatibilityMode: l,
    createSegment: oo,
    currentTime: C,
    deleteRejectedSegments: mo,
    duplicateSegment: io,
    editorLayout: te,
    editorRef: rt,
    emptyRecyclingBin: Ci,
    lineage: kr,
    mediaDuration: to,
    mergeSelectedSwimlane: co,
    moveToBin: $i,
    mutateShotBoundary: Oi,
    openPublishApprovedDialog: so,
    playbackControlsRef: cn,
    playbackShortcutConfig: ii,
    saveSelectedReviewState: uo,
    seekRef: dn,
    segmentGroupKeys: Sr,
    selectSegment: ro,
    selectedSegment: de,
    selectedSegmentGroupForSegment: Jt,
    selectedSegmentGroupKey: $e,
    selectedSegments: lt,
    setCollapsedSegmentGroups: Ie,
    setIncorrectExamplesOpen: qe,
    setQuickSearchOpen: Ne,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: Te,
    setTagEditing: h,
    setTimelineZoom: j,
    shotBoundaries: xn,
    slotButtonRef: Kn,
    splitSegment: ao,
    swimlanes: oi,
    timelineDuration: Wn,
    toggleIncorrectExample: hi,
    toggleSegmentGroup: fo,
    updateTimelineRatio: go,
    videoFrameRate: br,
    visibleSegments: ut
  });
  Lt.current = Pi;
  const Li = Be(() => Dn.map((U) => ({
    id: U.id,
    enabled: Xt(U, l),
    surface: "local",
    action: (me) => {
      var De;
      return (De = Lt.current) == null ? void 0 : De.call(Lt, U.id, me);
    }
  })), [l]);
  la(Kr, Li);
  const Fi = zr(oe), ji = jt(te.markerRailWidth, po("markerRailWidth")), Bi = jt(te.detailWidth, po("detailWidth"));
  return n(Cd, {
    activeFilterCount: je,
    allSwimlanes: ze,
    analysisError: Nt,
    analysisRun: Xe,
    analysisStatus: It,
    approvalFacetCounts: Wt,
    autoAssignCandidates: Ct,
    autoAssignError: st,
    autoAssignOpen: Je,
    autoAssignPerformers: Si,
    autoAssigning: Ce,
    captureTrainingExport: xi,
    cancelQueuedReviewsForSegments: bi,
    removeIncorrectExample: vi,
    rejectedDeletionPreview: we,
    centerTimelineRef: Bn,
    closeEditorFilters: kn,
    closeFirstSegmentTagDialog: hr,
    closeMaterializeDialog: wi,
    closeMergeConfirmation: yi,
    closePublishApprovedDialog: lo,
    closeTagEditing: Sn,
    collapsedSegmentGroups: ke,
    compatibilityMode: l,
    configuringTag: xt,
    createSegment: oo,
    currentTime: C,
    deleteRejectedSegments: mo,
    detail: e,
    detailPanelRef: N,
    detailWidth: Bi,
    duplicateSegment: io,
    editorFilters: x,
    editorLayout: te,
    editorRef: rt,
    exportingExamples: sn,
    filtersButtonRef: _t,
    filtersOpen: V,
    firstSegmentTagOpen: v,
    focusRowRef: mn,
    handleSeparatorKeyDown: Mi,
    handleSeparatorPointerDown: Ai,
    handleSeparatorPointerMove: Ri,
    hideDerivedSegments: L,
    history: J,
    historyOpen: M,
    historySaving: S,
    horizontalLayoutSize: xe,
    importNativeSegments: Mt,
    incorrectExamples: Ot,
    incorrectExamplesOpen: He,
    removingExampleId: Fn,
    lineage: kr,
    markerRailWidth: ji,
    materializeButtonRef: zt,
    materializeCancelButtonRef: Ln,
    materializeDerivedSegments: Ni,
    materializeError: nn,
    materializeLoading: Ut,
    materializeOpen: Et,
    materializePreview: ft,
    materializing: vt,
    mediaStackRef: un,
    mergeCancelButtonRef: Q,
    mergeConfirmation: ne,
    mergeSavingRef: ie,
    mergeSelectedSwimlane: co,
    nativeImportState: tn,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: so,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: Ei,
    pendingInitialSeekRef: jn,
    performerSlots: Ue,
    performerSlotsAvailable: Hn,
    playbackControlsRef: cn,
    previewDerivedSegments: ki,
    provenance: si,
    provenanceSources: W,
    publishApprovedCancelButtonRef: Ee,
    publishApprovedDrafts: fi,
    publishApprovedError: re,
    publishApprovedOpen: q,
    quickSearchOpen: Fe,
    railScrollRef: yn,
    railToggleRef: Gn,
    recordHistoryAction: Vn,
    restoreHistoryTarget: Ti,
    saveMessage: I,
    setSaveMessage: $,
    saveTag: Ii,
    saveTiming: gi,
    savingSegmentId: O,
    setSavingSegmentId: z,
    seekRef: dn,
    segmentGroups: yt,
    segmentRailLayout: wn,
    segments: Ye,
    selectAllVideoSegments: ci,
    selectSegment: ro,
    selectSegmentCollection: di,
    selectedGroups: eo,
    selectedPerformerSlots: Xr,
    selectedSegment: de,
    selectedSegmentGroupKey: $e,
    selectedSegmentIds: u,
    selectedSegments: lt,
    selectedSlotStatus: ni,
    setAutoAssignError: Ze,
    setAutoAssignOpen: Ae,
    setConfiguringTag: on,
    setCurrentTime: E,
    setEditorFilters: w,
    setEditorLayout: ue,
    setFiltersOpen: D,
    setHideDerivedSegments: A,
    setHistoryOpen: se,
    setIncorrectExamplesOpen: qe,
    setQuickSearchOpen: Ne,
    setRejectedDeletionPreview: Y,
    setRailViewport: hn,
    setSelectedSegmentGroupKey: Te,
    setSelectedSegmentId: m,
    setShortcutsOpen: Qe,
    setTimelineZoom: j,
    shotBoundaries: xn,
    shortcutsOpen: Le,
    slotButtonRef: Kn,
    splitLayout: a,
    splitSegment: ao,
    startFullAnalysis: Pn,
    tagEditing: R,
    tagSearchRef: Un,
    timelineDuration: Wn,
    timelineRatioBounds: Fi,
    timelineZoom: ge,
    toggleSegmentGroup: fo,
    toggleSegmentRail: Di,
    updateTimelineRatio: go,
    video: _e,
    videoPerformers: vn,
    visibleCounts: vr,
    visibleSegmentRailRows: ri,
    visibleSegments: ut,
    wideLayout: ln,
    workspaceRef: gn
  });
}
const Ld = /* @__PURE__ */ new Set(["queued", "running"]);
async function Xo(e, t, r = 4) {
  const o = new Array(e.length);
  let i = 0;
  async function a() {
    for (; i < e.length; ) {
      const s = i++;
      o[s] = await t(e[s], s);
    }
  }
  return await Promise.all(Array.from({ length: Math.min(r, e.length) }, a)), o;
}
function ea(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Fd() {
  let e = null, t = 0;
  return {
    begin() {
      return e ? null : (e = { selectionVersion: t }, e);
    },
    selectionChanged() {
      t++;
    },
    ownsCurrentSelection(r) {
      return e === r && r.selectionVersion === t;
    },
    finish(r) {
      e === r && (e = null);
    }
  };
}
async function jd(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((p) => Number.isInteger(p) && p > 0))], a = [...new Set(t)].filter((p) => ["aiTagging", "omnishotcut"].includes(p));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Xo(i, async (p) => {
    try {
      const [f, b] = await Promise.all([
        r(`/videos/${p}/analysis-runs`),
        s ? r(`/videos/${p}/editor`) : null
      ]);
      if ((f || []).some((N) => Ld.has(N == null ? void 0 : N.status)))
        throw new Error("A Full Scan is already queued or running.");
      const y = (b == null ? void 0 : b.shotBoundaries) || [];
      return { videoId: p, shotBoundaries: y };
    } catch (f) {
      return ea(p, f);
    }
  }), d = l.filter((p) => !p.error), c = l.filter((p) => p.error), g = d.filter((p) => p.shotBoundaries.length > 0), m = g.reduce((p, f) => p + f.shotBoundaries.length, 0);
  if (m > 0 && !o(
    `Replace ${m} existing shot ${m === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const u = await Xo(d, async ({ videoId: p, shotBoundaries: f }) => {
    const b = s && f.length > 0;
    try {
      return await r(`/videos/${p}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: b,
          expectedShotBoundaryFingerprint: b ? $n(f) : null
        })
      }), { videoId: p };
    } catch (y) {
      return ea(p, y);
    }
  });
  return {
    queuedIds: u.filter((p) => !p.error).map((p) => p.videoId),
    failed: [...c, ...u.filter((p) => p.error)],
    cancelled: !1
  };
}
function Bd(e = [], t = []) {
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
function Gd(e = [], t = "", r = "all") {
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
function et(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Kd(e = [], t = []) {
  var p;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((f, b) => (f.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(f.id) - Number(b.id)).forEach((f, b) => {
    [...f.tags || []].sort((y, N) => (y.sortOrder ?? 0) - (N.sortOrder ?? 0) || Number(y.tagId) - Number(N.tagId)).forEach((y, N) => r.set(Number(y.tagId), {
      key: `group:${f.id}`,
      id: f.id,
      name: f.name,
      sortOrder: f.sortOrder ?? b,
      tagSortOrder: y.sortOrder ?? N
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(f, b) {
    const y = Number(f);
    if (!o.has(y)) {
      const N = r.get(y);
      o.set(y, {
        tagId: y,
        name: b || `Tag ${y}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (N == null ? void 0 : N.key) || "ungrouped",
        segmentGroupId: (N == null ? void 0 : N.id) ?? null,
        segmentGroupName: (N == null ? void 0 : N.name) || "Ungrouped",
        segmentGroupSortOrder: (N == null ? void 0 : N.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (N == null ? void 0 : N.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(y);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((f) => {
    const b = i(f.sourceTagId, f.sourceTagName), y = i(f.derivedTagId, f.derivedTagName);
    b.outgoingRuleCount++, y.incomingRuleCount++;
    const N = `${b.tagId}:${y.tagId}`;
    a.has(N) || a.set(N, {
      id: N,
      sourceTagId: b.tagId,
      derivedTagId: y.tagId,
      rules: [],
      edgeCount: 0
    });
    const x = a.get(N);
    x.rules.push(f), x.edgeCount += Number(f.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((f) => [f.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((f) => {
    var b, y;
    (b = d.get(f.sourceTagId)) == null || b.add(f.derivedTagId), (y = d.get(f.derivedTagId)) == null || y.add(f.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const f of s) {
    if (c.has(f.tagId)) continue;
    const b = [f.tagId], y = [];
    for (c.add(f.tagId); b.length > 0; ) {
      const A = b.shift();
      y.push(A);
      for (const C of d.get(A) || [])
        c.has(C) || (c.add(C), b.push(C));
    }
    const N = new Set(y), x = y.map((A) => o.get(A)), w = l.filter((A) => N.has(A.sourceTagId) && N.has(A.derivedTagId)), V = w.flatMap((A) => A.rules), D = x.filter((A) => A.outgoingRuleCount === 0).sort((A, C) => et(A.name, C.name)), L = D.length > 0 ? D : [...x].sort((A, C) => et(A.name, C.name));
    g.push({
      id: [...y].sort((A, C) => A - C).join(":"),
      label: L.length > 1 ? `${L[0].name} + ${L.length - 1}` : ((p = L[0]) == null ? void 0 : p.name) || "Derivation component",
      nodes: x,
      connections: w,
      rules: V,
      segmentGroupKeys: [...new Set(x.map((A) => A.segmentGroupKey))],
      materializedEdgeCount: V.reduce(
        (A, C) => A + (Number(C.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((f, b) => b.rules.length - f.rules.length || et(f.label, b.label));
  const m = /* @__PURE__ */ new Map();
  s.forEach((f) => {
    m.has(f.segmentGroupKey) || m.set(f.segmentGroupKey, {
      key: f.segmentGroupKey,
      id: f.segmentGroupId,
      name: f.segmentGroupName,
      sortOrder: f.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), m.get(f.segmentGroupKey).nodes.push(f);
  }), g.forEach((f) => {
    f.nodes.forEach((b) => {
      var y;
      return (y = m.get(b.segmentGroupKey)) == null ? void 0 : y.componentIds.add(f.id);
    }), f.rules.forEach((b) => {
      var y, N;
      (y = m.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || y.ruleIds.add(b.id), (N = m.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || N.ruleIds.add(b.id);
    });
  });
  const u = [...m.values()].sort((f, b) => f.sortOrder - b.sortOrder || et(f.name, b.name)).map((f) => ({
    ...f,
    ruleCount: f.ruleIds.size,
    componentCount: f.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: u
  };
}
function Ud(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((E) => [E.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((E) => {
    var O, z;
    (O = g.get(E.sourceTagId)) == null || O.add(E.derivedTagId), (z = m.get(E.derivedTagId)) == null || z.add(E.sourceTagId);
  });
  const u = new Map(e.nodes.map((E) => {
    var O;
    return [
      E.tagId,
      ((O = m.get(E.tagId)) == null ? void 0 : O.size) || 0
    ];
  })), p = new Map(e.nodes.map((E) => [E.tagId, 0])), f = e.nodes.filter((E) => u.get(E.tagId) === 0).sort((E, O) => et(E.name, O.name)).map((E) => E.tagId), b = /* @__PURE__ */ new Set();
  for (; f.length > 0; ) {
    const E = f.shift();
    if (!b.has(E)) {
      b.add(E);
      for (const O of g.get(E) || [])
        p.set(O, Math.max(p.get(O) || 0, (p.get(E) || 0) + 1)), u.set(O, u.get(O) - 1), u.get(O) === 0 && f.push(O);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((E) => !b.has(E.tagId)).sort((E, O) => et(E.name, O.name)).forEach((E) => p.set(E.tagId, 0));
  const y = Math.max(0, ...p.values()), N = Math.max(
    t,
    240 + y * 296
  ), x = /* @__PURE__ */ new Map();
  e.nodes.forEach((E) => {
    x.has(E.segmentGroupKey) || x.set(E.segmentGroupKey, {
      key: E.segmentGroupKey,
      id: E.segmentGroupId,
      name: E.segmentGroupName,
      sortOrder: E.segmentGroupSortOrder,
      nodes: []
    }), x.get(E.segmentGroupKey).nodes.push(E);
  });
  const w = [...x.values()].sort((E, O) => E.sortOrder - O.sortOrder || et(E.name, O.name));
  let V = 28;
  const D = [], L = w.map((E) => {
    const O = /* @__PURE__ */ new Map();
    E.nodes.forEach(($) => {
      const F = p.get($.tagId) || 0;
      O.has(F) || O.set(F, []), O.get(F).push($);
    });
    for (const $ of O.values())
      $.sort((F, Z) => F.segmentGroupTagSortOrder - Z.segmentGroupTagSortOrder || et(F.name, Z.name));
    const z = Math.max(1, ...[...O.values()].map(($) => $.length)), H = z * 58 + (z - 1) * 18, B = 70 + H, I = {
      ...E,
      x: 12,
      y: V,
      width: N - 24,
      height: B
    };
    for (const [$, F] of O.entries()) {
      const Z = F.length * 58 + Math.max(0, F.length - 1) * 18, le = (H - Z) / 2;
      F.forEach((pe, ge) => D.push({
        ...pe,
        rank: $,
        x: 28 + $ * 296,
        y: V + 34 + 18 + le + ge * 76,
        width: 184,
        height: 58
      }));
    }
    return V += B + 16, I;
  }), A = new Map(D.map((E) => [E.tagId, E])), C = e.connections.map((E) => {
    const O = A.get(E.sourceTagId), z = A.get(E.derivedTagId), H = O.x + O.width, B = O.y + O.height / 2, I = z.x, $ = z.y + z.height / 2, F = Math.max(48, (I - H) * 0.48);
    return {
      ...E,
      path: `M ${H} ${B} C ${H + F} ${B}, ${I - F} ${$}, ${I} ${$}`
    };
  });
  return {
    width: N,
    height: Math.max(r, V - 16 + 28),
    nodes: D,
    connections: C,
    groups: L
  };
}
function zd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Ud(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, m = o, u = c.nodes.map((f) => ({
      ...f,
      x: f.x + g,
      y: f.y + m
    })), p = new Map(u.map((f) => [f.tagId, f]));
    a.push(...u), l.push(...c.groups.map((f) => ({
      ...f,
      componentId: d.id,
      x: f.x + g,
      y: f.y + m
    }))), s.push(...c.connections.map((f) => {
      const b = p.get(f.sourceTagId), y = p.get(f.derivedTagId), N = b.x + b.width, x = b.y + b.height / 2, w = y.x, V = y.y + y.height / 2, D = Math.max(48, (w - N) * 0.48);
      return {
        ...f,
        componentId: d.id,
        path: `M ${N} ${x} C ${N + D} ${x}, ${w - D} ${V}, ${w} ${V}`
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
function ta(e, t = []) {
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
function _d(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Hd(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: p, layout: f, listSort: b, materializationOffer: y, materializeOutgoingRules: N, materializeRule: x, message: w, normalizedQuery: V, query: D, refreshConfiguredTag: L, revealEditor: A, rules: C, save: E, segmentGroupKey: O, selectedNode: z, selectedRule: H, selection: B, setConfiguringTag: I, setDraft: $, setListSort: F, setMaterializationOffer: Z, setQuery: le, setSegmentGroupKey: pe, setSelection: ge, setView: j, sortedVisibleRules: te, sourceSlots: ue, sourceSlotsLoading: oe, updateMapping: he, updateTag: xe, view: T, visibleComponents: J, visibleRules: _ } = e;
  function ae(R) {
    const h = p.nodes.find((G) => G.tagId === Number(R.sourceTagId)), v = p.nodes.find((G) => G.tagId === Number(R.derivedTagId));
    return (h == null ? void 0 : h.segmentGroupKey) === (v == null ? void 0 : v.segmentGroupKey) ? h.segmentGroupKey : "cross-group";
  }
  function M() {
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
          onClick: () => $(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Tn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (R, h) => xe("source", R, h == null ? void 0 : h.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !oe && ue.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (R) => I({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: R.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Tn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (R, h) => xe("derived", R, h == null ? void 0 : h.label),
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
              onClick: (R) => I({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: R.currentTarget
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
            disabled: r || ue.length === 0 || s.length === 0,
            onClick: () => $((R) => ({
              ...R,
              slotMappings: [...R.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((R, h) => n("div", { key: h, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: R.sourceSlotDefinitionId,
              disabled: r,
              onChange: (v) => he(h, "sourceSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ue.map((v) => n("option", { key: v.id, value: v.id }, nt(v)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: R.derivedSlotDefinitionId,
              disabled: r,
              onChange: (v) => he(h, "derivedSlotDefinitionId", v.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${h + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((v) => n("option", { key: v.id, value: v.id }, nt(v)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => $((v) => ({
                ...v,
                slotMappings: v.slotMappings.filter((G, ie) => ie !== h)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${h + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((R) => !R.sourceSlotDefinitionId || !R.derivedSlotDefinitionId),
          onClick: E,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => $(null), className: o }, "Cancel")
      ])
    ]);
  }
  function se() {
    if (z) {
      const v = _.filter((ne) => Number(ne.derivedTagId) === z.tagId), G = _.filter((ne) => Number(ne.sourceTagId) === z.tagId), ie = (ne, ee, we) => n("div", {
        key: ne.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, ee),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${ne.sourceTagName} → ${ne.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          we ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => x(ne),
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
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, z.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, z.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${z.incomingRuleCount} incoming · ${z.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ne) => I({
            tagId: z.tagId,
            tagName: z.name,
            trigger: ne.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        G.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => N(z, G),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${G.length})`) : null,
        G.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...G.map((ne) => ie(ne, "Derives", !0))
        ]) : null,
        v.length ? n("details", {
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
              v.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            v.map((ne) => ie(ne, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!H)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const R = p.nodes.find((v) => v.tagId === Number(H.sourceTagId)), h = p.nodes.find((v) => v.tagId === Number(H.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (R == null ? void 0 : R.segmentGroupName) || "Ungrouped"),
          (R == null ? void 0 : R.segmentGroupKey) !== (h == null ? void 0 : h.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(h == null ? void 0 : h.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${H.sourceTagName} → ${H.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${H.edgeCount} materialized lineage edge${H.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === H.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${y.createCount + y.linkCount} pending derivation${y.createCount + y.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${y.createCount} new segments · ${y.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => x(H, y),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => Z(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        H.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : H.slotMappings.map((v, G) => n("div", {
          key: `${v.sourceSlotDefinitionId}:${v.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: v.sourceSlotLabel || "Unnamed slot" },
            v.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: v.derivedSlotLabel || "Unnamed slot" },
            v.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          H.createdAt ? new Date(H.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          H.updatedAt ? new Date(H.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => x(H),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(H),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(H),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function S() {
    if (J.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, V ? "No derivation relationships match your search." : "No derivation rules.");
    const R = z == null ? void 0 : z.tagId, h = /* @__PURE__ */ new Set();
    return z && (h.add(z.tagId), f.connections.forEach((v) => {
      (v.sourceTagId === z.tagId || v.derivedTagId === z.tagId) && (h.add(v.sourceTagId), h.add(v.derivedTagId));
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
        style: { width: `${f.width}px`, height: `${f.height}px` },
        "aria-label": "Derivation rule graph"
      }, [
        ...f.groups.map((v) => n("div", {
          key: `group:${v.componentId}:${v.key}`,
          className: `absolute rounded-xl border ${O === v.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${v.x}px`,
            top: `${v.y}px`,
            width: `${v.width}px`,
            height: `${v.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: v.name
        }, v.name))),
        n("svg", {
          key: "edges",
          className: "pointer-events-none absolute inset-0 overflow-visible",
          width: f.width,
          height: f.height,
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
          ...f.connections.map((v) => {
            const G = R === v.sourceTagId || R === v.derivedTagId, ie = z != null, ne = G ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${v.id}:visible`,
              d: v.path,
              fill: "none",
              stroke: ne,
              strokeWidth: G ? 2.5 : 1.5,
              opacity: ie && !G ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...f.nodes.map((v) => {
          const G = !V || v.name.toLocaleLowerCase().includes(V), ie = z != null, ne = h.has(v.tagId), ee = (z == null ? void 0 : z.tagId) === v.tagId;
          return n("button", {
            key: `node:${v.tagId}`,
            type: "button",
            onClick: () => ge({ type: "node", id: v.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${ee ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ne ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${v.x}px`,
              top: `${v.y}px`,
              width: `${v.width}px`,
              height: `${v.height}px`,
              opacity: !G || ie && !ne ? 0.62 : 1
            },
            title: `${v.name} — ${v.segmentGroupName}`,
            "aria-label": `${v.name}, ${v.incomingRuleCount} incoming and ${v.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, v.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${v.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${v.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...f.connections.filter((v) => v.rules.length > 1).map((v) => {
          const G = f.nodes.find((ne) => ne.tagId === v.sourceTagId), ie = f.nodes.find((ne) => ne.tagId === v.derivedTagId);
          return n("div", {
            key: `bundle:${v.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(G.x + G.width + ie.x) / 2 - 24}px`,
              top: `${(G.y + G.height / 2 + ie.y + ie.height / 2) / 2 - 10}px`
            },
            "aria-label": `${v.rules.length} rules connect ${v.rules[0].sourceTagName} to ${v.rules[0].derivedTagName}`
          }, `${v.rules.length} rules`);
        })
      ])
    ]);
  }
  function k() {
    if (J.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        V ? "No derivation relationships match your search." : "No derivation rules."
      );
    const R = /* @__PURE__ */ new Map();
    te.forEach((v) => {
      const G = ae(v);
      R.has(G) || R.set(G, []), R.get(G).push(v);
    });
    const h = [
      ...p.segmentGroups.map((v) => v.key),
      "cross-group"
    ].filter((v) => R.has(v));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, h.map((v) => {
      const G = p.segmentGroups.find((ee) => ee.key === v), ie = v === "cross-group" ? "Cross-group relationships" : (G == null ? void 0 : G.name) || "Ungrouped", ne = R.get(v);
      return n("section", { key: v, "aria-label": ie }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, ie),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ne.length} rule${ne.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${ie} derivation rules` }, [
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
          ...ne.map((ee) => n("button", {
            key: ee.id,
            type: "button",
            role: "row",
            onClick: () => ge({ type: "rule", id: ee.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(H == null ? void 0 : H.id) === ee.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${ee.sourceTagName} → ${ee.derivedTagName}` },
              `${ee.sourceTagName} → ${ee.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(ee.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(ee.edgeCount))
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
          `${C.length} rules · ${p.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          $(u()), ge(null), A();
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
          value: D,
          onChange: (R) => {
            le(R.target.value), ge(null);
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
          value: O,
          disabled: d != null,
          onChange: (R) => {
            pe(R.target.value), ge(null), $(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...p.segmentGroups.map((R) => n("option", { key: R.key, value: R.key }, R.name))
        ])
      ]),
      T === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (R) => F(R.target.value),
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
        ].map(([R, h]) => n("button", {
          key: R,
          type: "button",
          onClick: () => {
            j(R), R === "graph" && (B == null ? void 0 : B.type) === "rule" && ge(null);
          },
          "aria-pressed": T === R,
          className: `rounded px-3 py-1.5 text-sm font-medium ${T === R ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, h))
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
        T === "graph" ? S() : k()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? M() : se()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      w ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, w) : null
    ]),
    i ? n(Zr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => L(i),
      onClose: () => {
        const R = i.trigger;
        I(null), requestAnimationFrame(() => {
          R != null && R.isConnected && R.focus();
        });
      }
    }) : null
  ]);
}
function qd({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = P([]), [a, s] = P(null), [l, d] = P([]), [c, g] = P([]), [m, u] = P(!1), [p, f] = P(!1), [b, y] = P(!1), [N, x] = P(""), [w, V] = P(""), [D, L] = P("graph"), [A, C] = P("all"), [E, O] = P(null), [z, H] = P("relationship"), [B, I] = P(null), [$, F] = P(null), Z = fe(null), le = fe(null), pe = Pa().replace(/:/g, "");
  function ge() {
    requestAnimationFrame(() => {
      var Y;
      return (Y = Z.current) == null ? void 0 : Y.scrollIntoView({ block: "nearest" });
    });
  }
  async function j(Y) {
    const Q = await X("/derivation-rules", Y ? { signal: Y } : void 0);
    i(Q || []);
  }
  ye(() => {
    const Y = new AbortController();
    return j(Y.signal).catch((Q) => {
      Q.name !== "AbortError" && x(Q.message || "Unable to load derived segment rules.");
    }), () => Y.abort();
  }, []), ye(() => {
    const Y = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), X(`/slot-definitions/${a.sourceTagId}`, { signal: Y.signal }).then((Q) => d(Q.definitions || [])).catch((Q) => {
      Q.name !== "AbortError" && d([]);
    }).finally(() => {
      Y.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (f(!0), X(`/slot-definitions/${a.derivedTagId}`, { signal: Y.signal }).then((Q) => g(Q.definitions || [])).catch((Q) => {
      Q.name !== "AbortError" && g([]);
    }).finally(() => {
      Y.signal.aborted || f(!1);
    })) : (g([]), f(!1)), () => Y.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || p)
      return;
    const Y = `${a.sourceTagId}:${a.derivedTagId}`;
    le.current !== Y && (le.current = Y, s((Q) => !Q || Number(Q.sourceTagId) !== Number(a.sourceTagId) || Number(Q.derivedTagId) !== Number(a.derivedTagId) ? Q : kl(Q, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    p
  ]);
  function te(Y, Q = !1) {
    Q || O({ type: "rule", id: Y.id }), le.current = null, s({
      ruleId: Y.id,
      sourceTagId: Y.sourceTagId,
      sourceTagName: Y.sourceTagName,
      derivedTagId: Y.derivedTagId,
      derivedTagName: Y.derivedTagName,
      slotMappings: Y.slotMappings.map((q) => ({
        sourceSlotDefinitionId: q.sourceSlotDefinitionId,
        derivedSlotDefinitionId: q.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), x(""), ge();
  }
  function ue(Y, Q, q = "") {
    le.current = null, Y === "source" ? (d([]), u(Q != null)) : (g([]), f(Q != null)), s((K) => ({
      ...K,
      [`${Y}TagId`]: Q == null ? null : Number(Q),
      [`${Y}TagName`]: q || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function oe(Y) {
    (a == null ? void 0 : a.ruleId) == null && (le.current = null);
    const Q = [j(), t == null ? void 0 : t()];
    return Y.draftKind === "source" ? (u(!0), Q.push(X(`/slot-definitions/${Y.tagId}`).then((q) => d(q.definitions || [])).finally(() => u(!1)))) : Y.draftKind === "derived" && (f(!0), Q.push(X(`/slot-definitions/${Y.tagId}`).then((q) => g(q.definitions || [])).finally(() => f(!1)))), Promise.all(Q);
  }
  function he(Y, Q, q) {
    s((K) => ({
      ...K,
      slotMappings: K.slotMappings.map((re, ce) => ce === Y ? { ...re, [Q]: q } : re)
    }));
  }
  async function xe() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const Y = ta(a, o);
    if (Y) {
      x(Y.message);
      return;
    }
    if (a.slotMappings.some((Q) => !Q.sourceSlotDefinitionId || !Q.derivedSlotDefinitionId)) {
      x("Complete or remove every performer slot mapping before saving.");
      return;
    }
    y(!0), x(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let Q = null;
      if (a.ruleId != null) {
        const K = await X(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${K.deletedSegmentCount}
Removed lineage edges: ${K.removedEdgeCount}
Shared derived segments retained: ${K.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        Q = K.fingerprint;
      }
      x("Saving derived segment rule…");
      const q = await X("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: Q
        })
      });
      if (await j(), O(D === "graph" ? { type: "node", id: Number(q.sourceTagId) } : { type: "rule", id: q.id }), s(null), a.ruleId == null)
        try {
          const K = await X(
            `/derivation-rules/${q.id}/materialization/preview`,
            { method: "POST" }
          );
          I(
            K.createCount + K.linkCount > 0 ? K : null
          ), x(K.createCount + K.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          I(null), x("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        I(null), x("Derived segment rule saved. Previous materializations were removed.");
    } catch (Q) {
      x(Q.message || "Unable to save derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function T(Y) {
    y(!0), x("Previewing rule deletion…");
    try {
      const Q = await X(
        `/derivation-rules/${Y.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${Y.sourceTagName} → ${Y.derivedTagName}?

Deleted segments: ${Q.deletedSegmentCount}
Removed lineage edges: ${Q.removedEdgeCount}
Shared derived segments retained: ${Q.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const q = `derivation-rule-delete:${Y.id}:${Q.fingerprint}`;
      await X(`/derivation-rules/${Y.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(q),
          fingerprint: Q.fingerprint
        })
      }), Pe(q), await j(), (a == null ? void 0 : a.ruleId) === Y.id && s(null), (E == null ? void 0 : E.type) === "rule" && E.id === Y.id && O(null), (B == null ? void 0 : B.ruleId) === Y.id && I(null), x(`Rule deleted with ${Q.deletedSegmentCount} exclusively derived segment${Q.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (Q) {
      x(Q.message || "Unable to delete derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function J(Y, Q = null) {
    const q = Q || await X(
      `/derivation-rules/${Y.id}/materialization/preview`,
      { method: "POST" }
    );
    if (q.createCount + q.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const K = `derivation-rule-materialize:${Y.id}:${q.fingerprint}`, re = await X(`/derivation-rules/${Y.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Oe(K),
        fingerprint: q.fingerprint
      })
    });
    return Pe(K), re;
  }
  async function _(Y, Q = null) {
    y(!0), x("Finding pending derivations…");
    try {
      const q = await J(Y, Q);
      if (I(null), await j(), q.createdCount + q.linkedCount === 0) {
        x("Every applicable derivation is already materialized.");
        return;
      }
      x(
        `${q.createdCount} derived segment${q.createdCount === 1 ? "" : "s"} created and ${q.linkedCount} existing segment${q.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (q) {
      x(q.message || "Unable to materialize pending derivations.");
    } finally {
      y(!1);
    }
  }
  async function ae(Y, Q) {
    if (Q.length === 0) return;
    y(!0), x(`Finding pending derivations from ${Y.name}…`);
    let q = 0, K = 0;
    try {
      for (const re of Q) {
        const ce = await J(re);
        q += ce.createdCount, K += ce.linkedCount;
      }
      I(null), await j(), x(q + K === 0 ? `Every outgoing derivation from ${Y.name} is already materialized.` : `${q} derived segment${q === 1 ? "" : "s"} created and ${K} existing segment${K === 1 ? "" : "s"} linked from ${Y.name}.`);
    } catch (re) {
      await j().catch(() => {
      }), x(re.message || `Unable to materialize derivations from ${Y.name}.`);
    } finally {
      y(!1);
    }
  }
  const M = ta(a, o), se = Be(
    () => Kd(o, e),
    [o, e]
  ), S = w.trim().toLocaleLowerCase(), R = se.components.filter((Y) => A === "all" || Y.segmentGroupKeys.includes(A)).filter((Y) => !S || Y.nodes.some((Q) => Q.name.toLocaleLowerCase().includes(S))), h = R.flatMap((Y) => Y.rules), v = new Set(
    R.flatMap((Y) => Y.nodes.map((Q) => Q.tagId))
  ), G = Be(
    () => zd(R),
    [R]
  ), ie = D === "list" ? _d(
    E,
    h,
    S.length > 0
  ) : null, ne = (E == null ? void 0 : E.type) === "node" && se.nodes.find((Y) => Y.tagId === E.id && v.has(Y.tagId)) || null, ee = [...h].sort((Y, Q) => z === "source" ? et(Y.sourceTagName, Q.sourceTagName) || et(Y.derivedTagName, Q.derivedTagName) : z === "target" ? et(Y.derivedTagName, Q.derivedTagName) || et(Y.sourceTagName, Q.sourceTagName) : z === "materialized" ? (Number(Q.edgeCount) || 0) - (Number(Y.edgeCount) || 0) || et(Y.sourceTagName, Q.sourceTagName) : et(
    `${Y.sourceTagName} ${Y.derivedTagName}`,
    `${Q.sourceTagName} ${Q.derivedTagName}`
  ));
  return n(Hd, {
    arrowMarkerId: pe,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: $,
    deleteRule: T,
    derivedSlots: c,
    derivedSlotsLoading: p,
    draft: a,
    draftIssue: M,
    editRule: te,
    editorRef: Z,
    emptyDraft: r,
    graph: se,
    layout: G,
    listSort: z,
    materializationOffer: B,
    materializeOutgoingRules: ae,
    materializeRule: _,
    message: N,
    normalizedQuery: S,
    query: w,
    refreshConfiguredTag: oe,
    revealEditor: ge,
    rules: o,
    save: xe,
    segmentGroupKey: A,
    selectedNode: ne,
    selectedRule: ie,
    selection: E,
    setConfiguringTag: F,
    setDraft: s,
    setListSort: H,
    setMaterializationOffer: I,
    setQuery: V,
    setSegmentGroupKey: C,
    setSelection: O,
    setView: L,
    sortedVisibleRules: ee,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: he,
    updateTag: ue,
    view: D,
    visibleComponents: R,
    visibleRules: h
  });
}
function Wd() {
  const [e, t] = P(Aa), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => Eo({ ...l, [a]: s }));
  }
  function i() {
    t(Eo(Ur));
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
function Vd({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = P([]), [a, s] = P(!1), [l, d] = P(!1), [c, g] = P(""), [m, u] = P(""), [p, f] = P("all"), [b, y] = P(() => /* @__PURE__ */ new Set()), [N, x] = P(null);
  ye(() => {
    if (!e || a) return;
    const I = new AbortController();
    return d(!0), g(""), X("/slot-definitions", { signal: I.signal }).then(($) => {
      i($ || []), s(!0);
    }).catch(($) => {
      $.name !== "AbortError" && g($.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      I.signal.aborted || d(!1);
    }), () => I.abort();
  }, [e, a]);
  async function w() {
    d(!0), g("");
    try {
      const I = await X("/slot-definitions");
      i(I || []), s(!0);
    } catch (I) {
      g(I.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function V() {
    const [I] = await Promise.all([
      X("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(I || []), s(!0), g("");
  }
  function D() {
    const I = N == null ? void 0 : N.trigger;
    x(null), requestAnimationFrame(() => {
      I != null && I.isConnected && I.focus({ preventScroll: !0 });
    });
  }
  function L(I) {
    y(($) => {
      const F = new Set($);
      return F.has(I) ? F.delete(I) : F.add(I), F;
    });
  }
  const A = Be(
    () => Bd(t, o),
    [t, o]
  ), C = Be(
    () => Gd(A, m, p),
    [A, m, p]
  ), E = A.flatMap((I) => I.tags), O = E.filter((I) => I.definitions.length > 0).length, z = E.length - O, H = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], B = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${E.length} tags · ${O} with slots · ${z} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (I) => u(I.target.value),
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
          H.map(([I, $]) => n("button", {
            key: I,
            type: "button",
            onClick: () => f(I),
            "aria-pressed": p === I,
            className: `rounded px-3 py-1.5 text-xs font-medium ${p === I ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, $))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => y(/* @__PURE__ */ new Set()),
          className: B
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => y(new Set(A.map((I) => I.overviewKey))),
          className: B
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
        onClick: w,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && C.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, C.map((I) => {
      const $ = b.has(I.overviewKey), F = I.tags.filter((Z) => Z.definitions.length > 0).length;
      return n("article", {
        key: I.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => L(I.overviewKey),
          "aria-expanded": !$,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, $ ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, I.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${I.tags.length} tag${I.tags.length === 1 ? "" : "s"} · ${F} with slots`
          )
        ]),
        $ ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          I.tags.map((Z) => n("li", {
            key: Z.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: Z.tagName }, Z.tagName),
              Z.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            Z.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${Z.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, Z.definitions.map((le) => n("li", {
              key: le.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, nt(le)),
              ...(le.genderHints || []).map((pe) => n("span", {
                key: pe,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, sr(pe)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (le) => x({
                tagId: Z.tagId,
                tagName: Z.tagName,
                trigger: le.currentTarget
              }),
              "aria-label": `Edit performer slots for ${Z.tagName}`,
              className: `${B} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    N ? n(Zr, {
      key: `performer-slots-configure:${N.tagId}`,
      tagId: N.tagId,
      tagName: N.tagName,
      onSaved: V,
      onClose: D
    }) : null
  ]);
}
function Jd({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = P("general"), [a, s] = P([]), [l, d] = P(!1), [c, g] = P(""), [m, u] = P(""), [p, f] = P(null), [b, y] = P(!0), [N, x] = P(!1), [w, V] = P(""), [D, L] = P(!0), [A, C] = P(wa), E = Us(t), O = E.map(([$]) => $);
  ye(() => {
    O.includes(o) || i(O[0] || "general");
  }, [t.effectiveMode]);
  async function z($) {
    const F = await X("/segment-groups", $ ? { signal: $ } : void 0);
    s(F || []);
  }
  ye(() => {
    const $ = new AbortController();
    return z($.signal).catch((F) => {
      F.name !== "AbortError" && g(F.message || "Unable to load tag groups.");
    }), () => $.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      y(!1);
      return;
    }
    const $ = new AbortController();
    return V(""), y(!0), Promise.all([
      X("/analysis/settings", { signal: $.signal }),
      X("/analysis/status", { signal: $.signal })
    ]).then(([F, Z]) => {
      L(!0), u((F == null ? void 0 : F.baseUrl) || ""), f(Z);
    }).catch((F) => {
      if (F.name !== "AbortError") {
        if (F.status === 403) {
          L(!1), V("You do not have permission to manage the analysis service connection.");
          return;
        }
        V(F.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      $.signal.aborted || y(!1);
    }), () => $.abort();
  }, [t.effectiveMode]);
  async function H($) {
    if ($ !== t.requestedMode) {
      d(!0), g("");
      try {
        const F = await X(
          `/preferences/transition?mode=${encodeURIComponent($)}`
        );
        let Z = !1, le = null, pe = null, ge = null, j = !1;
        if (t.requestedMode === "basic" && $ === "full") {
          if (!window.confirm(Hs(
            F.recyclingBinCount,
            F.protectedRecyclingBinCount
          )))
            return;
          j = !0, F.recyclingBinCount > 0 && (Z = !0, ge = F.recyclingBinFingerprint, le = `mode-switch-empty-bin:${ge}`, pe = Oe(le));
        }
        let te = !1;
        if (t.requestedMode === "full" && $ === "basic") {
          if (!window.confirm(_s(
            F.extensionOwnedSegmentCount
          )))
            return;
          te = !0;
        }
        const ue = await X("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: $,
            confirmHiddenExtensionOwnedSegments: te,
            confirmBasicHistoryCleanup: j,
            emptyRecyclingBin: Z,
            operationId: pe,
            expectedRecyclingBinFingerprint: ge
          })
        });
        le && Pe(le), r == null || r(Ra(ue)), g("Workflow mode saved.");
      } catch (F) {
        g(F.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function B($) {
    $.preventDefault(), x(!0), V("");
    try {
      const F = await X("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((F == null ? void 0 : F.baseUrl) || "");
      const Z = await X("/analysis/status");
      f(Z), V(F != null && F.baseUrl ? Z != null && Z.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(Z == null ? void 0 : Z.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (F) {
      V(F.message || "Unable to save analysis service settings.");
    } finally {
      x(!1);
    }
  }
  const I = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: ($) => Ya($, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      E.map(([$, F]) => n("button", {
        key: $,
        type: "button",
        onClick: () => i($),
        "aria-current": o === $ ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === $ ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, F))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Wd)
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
      n(ud, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: H,
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
          onChange: ($) => {
            const F = $.target.checked;
            Na(F), C(F);
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
      n("form", { key: "form", onSubmit: B, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: m,
            onChange: ($) => u($.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || N || !D,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || N || !D,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, N ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        w || (b ? "Loading analysis service settings…" : (p == null ? void 0 : p.configured) === !1 ? "Full Scan is not configured." : p != null && p.ready ? "Analysis service is ready." : (p == null ? void 0 : p.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    O.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(qd, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    O.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Vd, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function na({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, nt(a)),
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
function Yd({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, p) => u.sortOrder - p.sortOrder || String(u.slotDefinitionId).localeCompare(String(p.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: nt(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = Ea(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Ka(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Re(e.startSec)} to ${e.endSec == null ? "end of video" : Re(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Re(e.startSec)} → end` : `${Re(e.startSec)} – ${Re(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(Kt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(lr, {
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
function Qd({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(sa, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Vs(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: Ea(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function ra({ onNavigate: e, profile: t }) {
  const r = Be(() => {
    const j = da("ext:com.midnightrider.segment-studio:segments");
    return j ? {
      ...Ir,
      defaultFilter: { ...Ir.defaultFilter, ...j.findFilter || {} },
      defaultObjectFilter: j.objectFilter || {}
    } : Ir;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = ca(r), [l, d] = P(null), [c, g] = P({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = P(null), [p, f] = P(null), [b, y] = P(0), [N, x] = P(""), [w, V] = P(!0), [D, L] = P(""), A = fe(0), C = Oo(o, i), E = C.activityTagId, O = Zt(i.slots), z = Be(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (j) => Object.keys(Zt(j)).length > 0,
    sanitize: (j) => $r(E, Zt(j)),
    summarize: (j) => `${Object.keys(Zt(j)).length} assigned`,
    renderEditor: (j, te) => E ? n(na, {
      facets: l,
      values: Zt(j),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ue, oe) => {
        const he = { ...Zt(j) };
        oe ? he[ue] = Number(oe) : delete he[ue], te($r(E, he));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [E, l, c.performerSlotsAvailable]), H = JSON.stringify(C);
  ye(() => {
    if (d(null), !E) return;
    const j = new AbortController();
    return X(`/browse/activities/${E}/facets`, { signal: j.signal }).then(d).catch((te) => {
      te.status === 403 ? d({ slots: [], restricted: !0 }) : te.name !== "AbortError" && L(te.message);
    }), () => j.abort();
  }, [E]), ye(() => {
    const j = ++A.current, te = new AbortController();
    return V(!0), L(""), X("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(C), signal: te.signal }).then((ue) => {
      j === A.current && g({ ...ue, totalCount: ue.totalCount ?? ue.total ?? 0 });
    }).catch((ue) => {
      if (!(j !== A.current || ue.name === "AbortError")) {
        if (ue.status === 400 && ue.message.includes("unrestricted performer read access")) {
          g((oe) => ({ ...oe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), L("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        L(ue.message);
      }
    }).finally(() => {
      j === A.current && V(!1);
    }), () => {
      A.current++, te.abort();
    };
  }, [H, b]);
  const B = c.items.findIndex((j) => j.key === m), I = c.items[B] || null;
  function $(j) {
    s(j), a({ ...o, page: 1 });
  }
  function F(j) {
    const te = Oo(o, j), ue = j.slots && te.activityTagId != null && te.slotAssignments.length > 0 ? j.slots : void 0;
    $({ ...j, slots: ue });
  }
  function Z(j, te) {
    const ue = { ...O };
    te ? ue[j] = Number(te) : delete ue[j], $({ ...i, slots: $r(E, ue) });
  }
  function le() {
    const j = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => j == null ? void 0 : j.focus());
  }
  async function pe(j) {
    var oe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    f(j.key), x("");
    const te = `browse-restore:${j.itemId}:${j.revision}`, ue = Oe(te);
    try {
      const he = (xe = !1) => X(`/bin/${j.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ue,
          expectedRevision: j.revision,
          discardMissingImage: xe
        })
      });
      try {
        await he(qr(te));
      } catch (xe) {
        if (((oe = xe.payload) == null ? void 0 : oe.code) !== "missing-image" || !window.confirm(`${xe.message}

Continue and discard the missing image reference?`))
          throw xe;
        Wr(te), await he(!0);
      }
      Pe(te), m === j.key && u(null), x("Segment restored to Cove."), y((xe) => xe + 1);
    } catch (he) {
      x(he.message || "Unable to restore the segment."), he.status === 409 && y((xe) => xe + 1);
    } finally {
      f(null);
    }
  }
  async function ge(j) {
    f(j.key), x("");
    try {
      const te = await X(`/items/${j.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: j.revision })
      });
      if (!Fa(te, x) || !il(te))
        return;
      const ue = `browse-dependency-delete:${j.itemId}:${te.fingerprint}`;
      await X(`/items/${j.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Oe(ue),
          fingerprint: te.fingerprint
        })
      }), Pe(ue), m === j.key && u(null), x(`${te.deletedSegmentCount} segment${te.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((oe) => oe + 1);
    } catch (te) {
      x(te.message || "Unable to permanently delete the segment."), te.status === 409 && y((ue) => ue + 1);
    } finally {
      f(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(Qr, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(ua, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: w,
      error: D ? new Error(D) : null,
      onRetry: () => y((j) => j + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? Do.filter((j) => j.id !== "performers") : Do,
      objectFilter: i,
      onObjectFilterChange: F,
      customFilterSections: z,
      searchPlaceholder: "Search segments..."
    }, [
      E ? n(na, { key: "slots", facets: l, values: O, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: Z }) : null,
      n(Qd, { key: "player", item: I, index: B, count: c.items.length, onPrevious: () => {
        var j;
        return u((j = c.items[B - 1]) == null ? void 0 : j.key);
      }, onNext: () => {
        var j;
        return u((j = c.items[B + 1]) == null ? void 0 : j.key);
      }, onClose: le, onNavigate: e }),
      N ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, N) : null,
      !w && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      w ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((j) => n(Yd, {
        key: j.key,
        item: j,
        selected: j.key === m,
        busy: p === j.key,
        onSelect: () => u(j.key),
        onRestore: pe,
        onPurge: ge
      })))
    ])
  ]);
}
function Zd({ onNavigate: e, profile: t }) {
  const [r, o] = P([]), [i, a] = P(""), [s, l] = P(0), [d, c] = P(!0), [g, m] = P(null), [u, p] = P(""), f = fe(null);
  async function b(x) {
    const w = await X("/bin", x ? { signal: x } : void 0);
    return o(w.items || []), a(w.fingerprint || ""), l(Number(w.totalCount) || 0), w;
  }
  ye(() => {
    const x = new AbortController();
    return c(!0), b(x.signal).catch((w) => {
      w.name !== "AbortError" && p(w.message);
    }).finally(() => {
      x.signal.aborted || c(!1);
    }), () => x.abort();
  }, []), la(Kr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var x;
      return (x = f.current) == null ? void 0 : x.call(f);
    }
  }]);
  async function y(x) {
    var D;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(x.itemId), p("");
    const w = `restore:${x.itemId}:${x.revision}`, V = Oe(w);
    try {
      const L = (A = !1) => X(`/bin/${x.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: V, expectedRevision: x.revision, discardMissingImage: A })
      });
      try {
        await L(qr(w));
      } catch (A) {
        if (((D = A.payload) == null ? void 0 : D.code) !== "missing-image" || !window.confirm(`${A.message}

Continue and discard the missing image reference?`)) throw A;
        Wr(w), await L(!0);
      }
      Pe(w), await b(), Cn(), p("Segment restored with a new native ID.");
    } catch (L) {
      p(L.message || "Unable to restore the segment."), L.status === 409 && await b();
    } finally {
      m(null);
    }
  }
  async function N() {
    if (g == null)
      try {
        const x = await Ba({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), p("");
        });
        if (x.status !== "emptied") return;
        await b(), Cn(), p(`${x.segmentCount} segment${x.segmentCount === 1 ? "" : "s"} from ${x.sceneCount} scene${x.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (x) {
        p(x.message || "Unable to empty the recycling bin."), x.status === 409 && await b();
      } finally {
        m(null);
      }
  }
  return f.current = N, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(Qr, {
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
        onClick: N,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, g === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    u ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, u) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((x) => n("article", { key: x.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${x.tagName || "Tag segment"} · ${x.videoTitle || `Video ${x.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, x.endSec == null ? Re(x.startSec) : `${Re(x.startSec)} – ${Re(x.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${x.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${x.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => y(x), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const oa = "ext:com.midnightrider.segment-studio:videos";
function Ar({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Be(() => {
    var _;
    const T = da(oa), J = (_ = T == null ? void 0 : T.uiOptions) == null ? void 0 : _.displayMode;
    return T ? {
      ...Nn,
      defaultFilter: { ...Nn.defaultFilter, ...T.findFilter || {} },
      defaultObjectFilter: T.objectFilter || {},
      defaultDisplayMode: Nn.allowedDisplayModes.includes(J) ? J : Nn.defaultDisplayMode
    } : Nn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = ca(i), [m, u] = P({ items: [], totalCount: 0 }), [p, f] = P(!0), [b, y] = P(""), [N, x] = P(0), [w, V] = P(/* @__PURE__ */ new Set()), [D, L] = P(null), [A, C] = P({ busy: !1, error: "", announcement: "" }), E = fe(0), O = fe(null), z = fe(null);
  z.current || (z.current = Fd());
  const H = JSON.stringify(a), B = JSON.stringify(s), I = t || r === "review";
  ye(() => {
    z.current.selectionChanged(), O.current = null, V(/* @__PURE__ */ new Set()), C((T) => ({ busy: T.busy, error: "", announcement: "" }));
  }, [H, B]), ye(() => {
    if (!I) return;
    const T = new AbortController();
    return X("/analysis/status", { signal: T.signal }).then(L).catch((J) => {
      J.name !== "AbortError" && L({ configured: !0, ready: !1, error: J.message || "Unable to check Full Scan readiness." });
    }), () => T.abort();
  }, [I]), ye(() => {
    const T = ++E.current, J = new AbortController();
    return f(!0), y(""), X(`/videos?${id(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: J.signal }).then((_) => {
      T === E.current && u(_);
    }).catch((_) => {
      T === E.current && _.name !== "AbortError" && y(_.message || "Unable to discover videos.");
    }).finally(() => {
      T === E.current && f(!1);
    }), () => {
      E.current++, J.abort();
    };
  }, [H, B, t, r, N]);
  function $(T) {
    d({ ...T, page: T.page || 1 });
  }
  function F(T) {
    c(T), d({ ...a, page: 1 });
  }
  function Z(T, J = !1) {
    V((_) => sd(
      _,
      m.items.map((ae) => ae.videoId),
      T,
      O.current,
      J
    )), O.current = T;
  }
  function le() {
    O.current = null, V(new Set(m.items.map((T) => T.videoId)));
  }
  function pe() {
    O.current = null, V(/* @__PURE__ */ new Set());
  }
  function ge() {
    O.current = null, V((T) => new Set(m.items.map((J) => J.videoId).filter((J) => !T.has(J))));
  }
  async function j(T = ["aiTagging", "omnishotcut"]) {
    const J = z.current.begin();
    if (J) {
      C({ busy: !0, error: "", announcement: "" });
      try {
        const _ = await jd(
          [...w],
          T,
          X,
          (ae) => window.confirm(ae)
        );
        if (_.cancelled) {
          C({ busy: !1, error: "", announcement: "" });
          return;
        }
        _.queuedIds.length > 0 && z.current.ownsCurrentSelection(J) && (_.queuedIds.includes(O.current) && (O.current = null), V((ae) => {
          const M = new Set(ae);
          return _.queuedIds.forEach((se) => M.delete(se)), M;
        })), C({
          busy: !1,
          announcement: _.queuedIds.length > 0 ? `${_.queuedIds.length} ${_.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: _.failed.length > 0 ? `${_.failed.length} selected ${_.failed.length === 1 ? "video could" : "videos could"} not be queued. ${_.failed[0].error}` : ""
        });
      } catch (_) {
        C({ busy: !1, error: _.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        z.current.finish(J);
      }
    }
  }
  const te = t || r === "review" ? Vo : Vo.filter((T) => !["reviewState", "shotBoundaries"].includes(T.id)), ue = D === null || D.configured === !1 || D.ready === !1, oe = A.busy || ue, he = (D == null ? void 0 : D.error) || (D === null ? "Checking Full Scan availability" : D.configured === !1 ? "Configure the analysis service before running Full Scan" : D.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), xe = A.busy ? "Queueing scans…" : D === null ? "Checking Full Scan…" : D.configured === !1 ? "Full Scan not configured" : D.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(Qr, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(ua, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: oa,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: $,
      totalCount: m.totalCount,
      isLoading: p,
      error: b ? new Error(b) : null,
      onRetry: () => x((T) => T + 1),
      sortOptions: t || r === "review" ? [...Wo, { value: "unreviewed_count", label: "Unreviewed count" }] : Wo,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: te,
      objectFilter: s,
      onObjectFilterChange: F,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: I ? w : void 0,
      onSelectAll: I ? le : void 0,
      onSelectNone: I ? pe : void 0,
      onInvertSelection: I ? ge : void 0,
      selectionActions: I ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: oe,
          onClick: () => j(),
          title: he,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, xe),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": oe,
            title: he,
            onClick: (T) => {
              oe && T.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${oe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(ma, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([T, J]) => n("button", {
            key: T,
            type: "button",
            disabled: A.busy,
            onClick: (_) => {
              var ae;
              (ae = _.currentTarget.closest("details")) == null || ae.removeAttribute("open"), j(J);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, T)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, A.announcement),
      A.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, A.error) : null,
      !p && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !p && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((T) => n(ld, { key: T.videoId, item: T, onNavigate: e, showReviewStates: I, selected: w.has(T.videoId), selectionActive: w.size > 0, onSelect: I ? Z : null }))) : null,
      !p && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((T) => n(dd, { key: T.videoId, item: T, onNavigate: e, showReviewStates: I, selected: w.has(T.videoId), selectionActive: w.size > 0, onSelect: I ? Z : null }))) : null
    ])
  ]);
}
function aa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = P(null), [s, l] = P(!0), [d, c] = P(""), g = fe(0), m = fe(0), u = fe(e), p = ql();
  u.current = e;
  const f = (w) => `/videos/${w}/editor`;
  async function b(w, V, D) {
    const L = await X(f(V), D ? { signal: D.signal } : void 0);
    return Ft(w, D ? g.current : m.current, V, u.current) ? (a(L), !0) : !1;
  }
  ye(() => {
    const w = ++g.current, V = e, D = new AbortController();
    return a(null), l(!0), c(""), b(w, V, D).catch((L) => {
      Ft(w, g.current, V, u.current) && L.name !== "AbortError" && c(L.message || "Unable to load the editor.");
    }).finally(() => {
      Ft(w, g.current, V, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, D.abort();
    };
  }, [e]);
  function y(w, V) {
    a((D) => (D == null ? void 0 : D.video.id) !== V ? D : typeof w == "function" ? w(D) : w);
  }
  async function N() {
    const w = e, V = ++m.current;
    try {
      const D = await X(f(w));
      return Ft(V, m.current, w, u.current) ? (a(D), c("A newer canonical segment was loaded. Your stale change was not applied."), D) : null;
    } catch (D) {
      return Ft(V, m.current, w, u.current) && c(D.message || "Unable to reload the latest segment."), null;
    }
  }
  async function x() {
    const w = e, V = ++m.current;
    try {
      const D = await X(f(w));
      return Ft(V, m.current, w, u.current) ? (a(D), c(""), D) : null;
    } catch (D) {
      return Ft(V, m.current, w, u.current) && c(D.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${p ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: p ? {
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
      n(zi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Pd, {
      key: i.video.id,
      detail: i,
      onDetailChange: y,
      onConflict: N,
      onReload: x,
      onSlotsChanged: x,
      splitLayout: p,
      profile: o,
      initialSegmentId: Lo() ? -Lo() : Js(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Xd(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function ec(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function tc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function nc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Gs(o), l = Xd(e, t, window.location.pathname), d = ec(e, t, window.location.pathname), c = tc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (zs(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Ar, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Jd, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(ra, { onNavigate: r, profile: o });
    const p = Number(e);
    return Number.isInteger(p) && p > 0 ? n(aa, {
      videoId: p,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Ar, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Zd, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(ra, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(aa, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Ar, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function rc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = P(null), [a, s] = P("");
  return ye(() => {
    const l = new AbortController();
    return X("/preferences", { signal: l.signal }).then((d) => i(Ra(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(nc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function oc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function ac(e, t) {
  const r = oc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const Ic = {
  components: { SegmentStudioPage: rc },
  actionHandlers: { openSegmentStudio: ac }
};
export {
  nr as CLEARED_SEGMENT_SELECTION_ID,
  Wo as DISCOVERY_SORT_OPTIONS,
  wt as SEGMENT_STUDIO_CAPABILITIES,
  Kr as SEGMENT_STUDIO_EXTENSION_ID,
  Dn as SEGMENT_STUDIO_SHORTCUTS,
  ds as activeEditorFilterCount,
  kl as applyDerivationRuleSlotSuggestions,
  Fr as applyFeedbackEditorDelta,
  Ko as applySegmentMergeDelta,
  dl as basicSegmentTimelineStyle,
  Vs as browseClipEnd,
  Ea as browseEditorHref,
  Oo as buildBrowseRequest,
  Kd as buildDerivationRuleGraph,
  id as buildDiscoverySearchParams,
  Vi as buildMinuteTimelineTicks,
  Bd as buildPerformerSlotOverview,
  el as buildSegmentQuickSearchEntries,
  Cl as buildSegmentRailRows,
  Tl as buildTimelineRows,
  uc as buildTimelineTicks,
  Zi as calculateCenteredTimelineScroll,
  Mr as calculateEditorPanelMaximum,
  Ji as calculateMinuteLabelStride,
  mc as calculateMinuteTimelineWidth,
  ts as calculateSwimlaneTitleMaximum,
  Xi as calculateTimelinePlayheadPosition,
  zr as calculateTimelineRatioBounds,
  rs as calculateTimelineRatioFromPointer,
  gc as calculateVerticalRevealOffset,
  jt as clampEditorPanelWidth,
  er as clampSwimlaneTitleWidth,
  ka as clampTimelineRatio,
  _r as clampTimelineRatioForHeight,
  tr as clampTimelineZoom,
  nd as compactProvenanceSummary,
  Fd as createBulkAnalysisCoordinator,
  Ms as createQueuedReviewRequest,
  Zo as createSegmentAnalysisRequestScope,
  Ic as default,
  al as downloadFileNameFromContentDisposition,
  cs as dualRangeValueFromPointer,
  Ro as duplicateIdentityFromResponse,
  Ps as duplicateOperationKey,
  ls as editorVisibilityIncludingSegment,
  Ml as expandedSwimlanes,
  _s as extensionOwnedSegmentsModeSwitchPrompt,
  Ll as feedbackFrameTimestamps,
  jl as feedbackResultMatchesAction,
  Fl as feedbackSelectionPlan,
  ss as filterDerivedSegments,
  Nr as filterEditorSegments,
  Gd as filterPerformerSlotOverview,
  Xs as filterSegmentQuickSearch,
  hc as filterSegmentStudioShortcuts,
  Ol as findAdjacentSegmentGroupKey,
  js as findAdjacentShot,
  Ts as findEditorShortcut,
  xa as findInitialSegmentSelection,
  Wi as findNearestSegmentInCurrentSwimlane,
  Fs as findPublishedSelectionIdentity,
  Ke as findSegmentByStableIdentity,
  os as findSegmentFromPlayhead,
  qi as findSegmentNearPlayhead,
  Dl as findSwimlaneRangeSelection,
  Lr as findSwimlaneSelection,
  Qs as findUniquePerformerSlotAssignment,
  Sa as findUnreviewedSelection,
  sr as formatGenderHint,
  Bs as frameStepSeconds,
  Da as generatePerformerSlotAssignmentRecommendations,
  hd as groupApprovedDraftsForPublishing,
  Zs as groupAutoAssignCandidates,
  Bl as groupIncorrectExamplesByTag,
  wd as groupMaterializationOutputs,
  Bt as groupSegmentsIntoSwimlanes,
  Al as groupSelectedSwimlanes,
  Yr as groupSwimlanesBySegmentGroup,
  it as handleModalKey,
  en as hasSegmentStudioCapability,
  zo as hideCollectedFeedbackSegments,
  bl as historyActionsForTarget,
  Qn as incorrectExampleHistoryState,
  _a as indexPerformerSlotsBySegment,
  xc as initialReviewFilter,
  Ul as insertSegmentProjection,
  Ft as isCurrentEditorRequest,
  pl as isEditableTarget,
  kc as isEditorShortcutOwner,
  tc as isSegmentStudioBinRoute,
  ec as isSegmentStudioSegmentsRoute,
  Xd as isSegmentStudioSettingsRoute,
  Ud as layoutDerivationRuleComponent,
  zd as layoutDerivationRuleComponents,
  zl as mergeSegmentsProjection,
  xl as multiSelectionActionHint,
  hs as nextSegmentAfterRemoval,
  vs as nextUnreviewedAfterRemoval,
  Rt as normalizeCollapsedSegmentGroups,
  Yo as normalizeDiscoveryIds,
  ct as normalizeEditorSegmentFilters,
  Tt as normalizeGender,
  Mo as normalizeReviewFilter,
  Ra as normalizeSegmentStudioFeatureProfile,
  vc as normalizeSegmentStudioMode,
  Or as normalizeSegmentStudioPublicMode,
  Zt as parseBrowseSlotFilters,
  ns as parseEditorLayout,
  as as parseHideDerivedSegmentsPreference,
  is as parseMergeConfirmationPreference,
  Ta as parsePlaybackShortcutConfig,
  $s as parseShortcutBindingOverrides,
  Tr as patchPerformerSlotProjection,
  ar as patchSegmentProjection,
  xs as percentageSeekTime,
  Ys as performInitialSegmentSeek,
  Ve as performerOptionId,
  rr as performerSlotHistoryState,
  nt as performerSlotLabel,
  wl as performerSlotPresentation,
  Nc as performerSlotStatus,
  Jr as performerSlotStatusFromSegmentSlots,
  za as performerSlotsForSegment,
  pt as provenanceSourceLabel,
  Oa as rankPerformerOptions,
  Pl as reconcileSegmentGroupKey,
  ys as reconcileSelectedSegmentIds,
  cd as recyclingBinActionText,
  sl as recyclingBinDeletionPrompt,
  ja as recyclingBinDeletionSummary,
  Hs as recyclingBinModeSwitchPrompt,
  Os as removeQueuedReviewsForSegments,
  jr as removeSegmentsProjection,
  Lo as requestedOwnedItemId,
  Js as requestedSegmentId,
  ms as resolveEditorSegmentSelection,
  Es as resolveQueuedReviewRequest,
  Ls as resolveSegmentCreationAction,
  zs as resolveSegmentStudioRoute,
  Cs as resolveSegmentStudioShortcuts,
  _d as resolveSelectedDerivationRule,
  Ss as resolveSelectedSegments,
  Od as restorePublishApprovedFocus,
  En as restoreSegmentFieldsProjection,
  Ja as restoreSegmentsProjection,
  Va as revealCollapsedSegmentGroup,
  jd as runSelectedDiscoveryAnalysis,
  Ga as segmentBadgeStyle,
  ir as segmentGroupHeaderBackground,
  mt as segmentGroupKeyForSegment,
  Vr as segmentHistoryIdentity,
  Yn as segmentHistoryState,
  Ka as segmentRailItemStyle,
  Sc as segmentStateStyle,
  oc as segmentStudioActionTarget,
  Gs as segmentStudioLegacyMode,
  ll as segmentTimelineStyle,
  dt as segmentsHistoryState,
  bs as selectAllVideoSegmentIds,
  qs as selectedBrowseStates,
  qa as selectedSwimlaneMerge,
  Ya as setBackLinkNavigation,
  hl as sharedPerformerSlotShape,
  vl as sharedTagPerformerSlotShape,
  Xt as shortcutAvailableInMode,
  As as shortcutBindingDisplayText,
  pc as shortcutBindingFromEvent,
  yc as shortcutBindingsOverlap,
  bc as shortcutModesOverlap,
  Is as shortcutRequiresSingleSegment,
  $n as shotBoundaryFingerprint,
  yl as shouldAcceptCurrentTagFromEnter,
  fc as shouldExitShortcutCapture,
  wc as shouldHandleEditorShortcut,
  Qo as shouldLoadSegmentAnalysis,
  qo as shouldReloadAfterSegmentMutation,
  Dr as shouldRestoreTransitionSelection,
  tl as shouldShowQuickSearchGroups,
  To as splitShortcutCategoriesIntoColumns,
  Sl as suggestDerivationRuleSlotMappings,
  Rn as swimlaneDisplayLabel,
  gl as swimlaneMarkerTop,
  ul as swimlaneStripeBackground,
  es as timelineContentStyle,
  Io as timelinePlayheadHorizontalStyle,
  cl as timelineSegmentWidth,
  Yi as timelineTickAlignment,
  Qi as timelineTickPosition,
  Rr as timelineTimePercent,
  El as toggleAllCollapsedSegmentGroups,
  Rs as toggledSelectionReviewState,
  bt as trapModalFocus,
  nl as tryParseJsonResponseText,
  fs as updateAnchoredSegmentSelection,
  sd as updateDiscoverySelection,
  us as updateDualRangeValues,
  gs as updateSegmentCollectionSelection,
  ps as updateSegmentRangeSelection,
  Ia as updateSegmentSelection,
  ta as validateDerivationRuleDraft,
  No as validateSegmentTiming,
  Hr as videoPerformerOptions,
  Cr as videoPerformerSlotAssignments,
  Us as visibleSegmentStudioSettingsTabs,
  Ks as visibleSegmentStudioTabs,
  Ha as visibleVirtualRows
};
