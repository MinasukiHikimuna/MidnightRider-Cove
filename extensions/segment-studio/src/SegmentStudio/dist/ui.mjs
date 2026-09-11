import Fr from "@cove/runtime/react";
import { createPortal as Ri } from "@cove/runtime/react-dom";
import { extensionFetch as Qo } from "@cove/runtime/api";
import { formatDuration as Ei, EntityReferenceSelector as In, useExtensionKeyboardBindings as Di, VideoPlayer as Xo, useRegisterExtensionKeyboardActions as ea, getDefaultFilter as ta, useListUrlState as na, ListPage as ra } from "@cove/runtime/components";
import { ChevronDown as Oi, Loader2 as Pi } from "@cove/runtime/lucide-react";
const jr = "com.midnightrider.segment-studio", oa = "segment-studio.layout.v1", Lt = "segment-studio.operations.v1", aa = "segment-studio.collapsed-segment-groups.v1", ia = "segment-studio.playback-shortcuts.v1", sa = "segment-studio.timing-clipboard.v1", la = "segment-studio.hide-derived-segments.v1", da = "segment-studio.merge-confirmation.v1", Xe = ["unreviewed", "approved", "rejected"], Li = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], yo = "(min-width: 1024px) and (min-height: 640px)", bo = "(min-width: 1024px) and (min-height: 900px)", Cn = 1e-3, ho = 15, Fi = 30, ca = 12, rt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Br = {
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
function vo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function ua(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? ma(e, null, 1, !0) ?? r[0] ?? null;
}
function ma(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((m) => m.markers.some((u) => u.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const m = e.flatMap((u) => u.markers.map((y) => y.segment)).filter((u) => u.reviewState === "unreviewed");
    return r < 0 ? m.at(-1) ?? null : m[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((m) => m.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((u) => u.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((m) => m.markers.map((u) => u.segment)), d = l.findIndex((m) => m.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((m) => m.reviewState === "unreviewed") ?? null;
}
function ji(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const y = Number(u.startSec), p = u.endSec == null ? y + Fi : Number(u.endSec);
    return Number.isFinite(y) && Number.isFinite(p) && p >= y && y <= i + ho + Cn && p >= i - ho - Cn;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Bi(e, t, r) {
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
function Xn(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Jd(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Gi(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function Yd(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Ki(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Ui(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function zi(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function _i(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Tr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Hi(e, t, r = 10) {
  const o = Tr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function xo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function qi(e, t = ca) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function ga(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : rt.timelineRatio;
}
function Mr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Ot(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.detailWidth : Math.min(Mr(t, 0), Math.max(240, e));
}
function Zn(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? rt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Wi(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Gr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: rt.timelineRatio, maximum: rt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function Kr(e, t) {
  const r = ga(e);
  if (!(t > 0)) return r;
  const o = Gr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Vi(e) {
  if (!e) return { ...rt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? ga(r) : rt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Ot(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Ot(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Zn(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...rt };
  }
}
function Ji(e, t, r) {
  return r > 0 ? Kr((t + r - e) / r, r) : rt.timelineRatio;
}
function Zd(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Yi(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Cn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Dt(e, t, r, o) {
  return e === t && r === o;
}
const er = "__segment-studio-cleared-selection__";
function Zi(e) {
  return e === "true";
}
function Qi(e) {
  return e !== "false";
}
function pa() {
  try {
    return Qi(window.localStorage.getItem(da));
  } catch {
    return !0;
  }
}
function fa(e) {
  try {
    window.localStorage.setItem(da, String(!!e));
  } catch {
  }
}
function Xi(e, t) {
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
function kr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = dt(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return Xi(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function es(e, t, r, o = !1, i = []) {
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
function ts(e, t = !1) {
  const r = dt(e);
  return +(r.reviewStates.length !== Xe.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function ns(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function rs(e, t, r, o) {
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
function os(e, t, r = null) {
  return t === er ? null : ua(
    e,
    t ?? r
  );
}
function ya(e, t, r, o = !1) {
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
function as(e, t, r) {
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
function is(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return ya(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function ss(e, t, r = null, o = !1) {
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
      ...is(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = ya(i, a, t, o);
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
function ls(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function ds(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function So(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function ko(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => So(t, o) - So(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function cs(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: y }) => !i.has(y.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = ko(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return ko(d == null ? void 0 : d.markers, s, i);
}
function us(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function ms(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function gs(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function ps() {
  try {
    return Zi(window.localStorage.getItem(la));
  } catch {
    return !1;
  }
}
function fs(e) {
  try {
    window.localStorage.setItem(la, String(!!e));
  } catch {
  }
}
const An = [
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
], ys = /* @__PURE__ */ new Set([
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
function bs(e) {
  return ys.has(e);
}
function ba(e) {
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
function hs(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(An.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ba).filter(Boolean)]));
  } catch {
    return {};
  }
}
function vs(e = {}) {
  const t = hs(e);
  return An.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function wo(e, t = 2) {
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
function Qd(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ba({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Xd(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Ar(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function No(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function ec(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = No(e.code, t.key), a = No(t.code, e.key);
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
          if (Ar(u, e) && Ar(u, t)) return !0;
        }
  return !1;
}
function Zt(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function tc(e, t) {
  return [!1, !0].some((r) => Zt(e, r) && Zt(t, r));
}
function xs(e, t = !1, r = {}) {
  return vs(r).find((o) => Zt(o, t) && o.bindings.some((i) => Ar(e, i))) || null;
}
function ha(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function Ss(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(ha).join(" / ") : "Unassigned";
}
function nc(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, Ss(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function rc(e) {
  return e === "review" ? "review" : "editor";
}
function We(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function ks(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function Io(e, t) {
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
function ws(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function Ns(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function Rr(e, t) {
  return e === t;
}
function Is(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Cs(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Cn).at(-1) || null : o.find((i) => i.startSec > t + Cn) || null;
}
function Qn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function Co(e) {
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
function oc(e, t = null, r = !1) {
  const o = Co(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Jt(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function va(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Jt(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Jt(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Jt(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Jt(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Jt(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Jt(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Br };
  }
}
function $s(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function xa() {
  try {
    return va(window.localStorage.getItem(ia));
  } catch {
    return { ...Br };
  }
}
function $o(e) {
  const t = va(JSON.stringify(e));
  try {
    window.localStorage.setItem(ia, JSON.stringify(t));
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
function Er(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function Sa(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Er(e.requestedMode) : "basic",
    effectiveMode: i ? Er(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Qt(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Ts(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ms(e) {
  const t = [];
  return Qt(e, wt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Qt(e, wt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function As(e) {
  return [
    ["general", "General", wt.settingsGeneral],
    ["shortcuts", "Shortcuts", wt.settingsShortcuts],
    ["performer-slots", "Performer slots", wt.settingsPerformerSlots],
    ["derivation", "Derivation", wt.settingsDerivation]
  ].filter(([, , r]) => Qt(e, r)).map(([r, o]) => [r, o]);
}
function Rs(e, t) {
  return e === "segments" && !Qt(
    t,
    wt.navigationSegmentInventory
  ) || e === "bin" && !Qt(
    t,
    wt.recyclingBinView
  ) ? "videos" : e;
}
function Es(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Ds(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const wr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, To = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Xe.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Os(e) {
  const t = String(e || "").split(",").filter((r) => Xe.includes(r));
  return t.length === 0 ? [...Xe] : [...new Set(t)];
}
function Yt(e) {
  return ka(e).values;
}
function ka(e) {
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
function Nr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Mo(e, t) {
  var l;
  const r = Ao(t.activitiesCriterion, t.activityId), o = Ao(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ka(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Ps(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Ao(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Ps(e, t) {
  return Xe.includes(e == null ? void 0 : e.value) ? [e.value] : Os(t);
}
function wa(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Ls(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Fs(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Ro(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function js(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function Ve(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Ur(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Ir(e, t) {
  const r = new Set(Ur(t).map((o) => String(Ve(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Ct(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function Eo(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Ct).sort().join(",")}`;
}
function Na(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((y) => String(y.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((y) => {
    var p;
    return !((p = y.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const y = [...e].sort((b, f) => String(b.slotDefinitionId).localeCompare(String(f.slotDefinitionId))), p = [...t].sort((b, f) => String(b.name).localeCompare(String(f.name)) || Number(Ve(b)) - Number(Ve(f)));
    return [{
      assignments: Object.fromEntries(y.map((b, f) => [String(b.slotDefinitionId), String(Ve(p[f]))])),
      description: p.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((y) => t.map((p, b) => ({ performer: p, index: b })).filter(({ performer: p }) => {
    var b;
    return !((b = y.genderHints) != null && b.length) || y.genderHints.some((f) => Ct(f) === Ct(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((y) => y.length > 0).length : Do(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((y, p) => [String(Ve(y)), p]));
  function u(y, p, b) {
    if (s.length >= a) return;
    const f = c.slice(y), w = i ? f.filter((R) => R.length > 0).length : Do(f.map((R) => R.filter((_) => !p.has(String(Ve(t[_]))))), t.length);
    if (b + w < g) return;
    if (y === e.length) {
      if (b !== g) return;
      const R = Object.fromEntries(d.map(({ slot: A, performer: $ }) => [String(A.slotDefinitionId), $ ? String(Ve($)) : ""])), _ = o.length === 0 ? Object.values(R).sort().join(",") : [...new Set(e.map((A) => String(A.label || "")))].map((A) => `${A}:${d.filter(({ slot: $ }) => String($.label || "") === A).map(({ performer: $ }) => $ ? String(Ve($)) : "").sort().join(",")}`).join("|");
      !l.has(_) && s.length < a && (l.add(_), s.push({
        assignments: R,
        description: d.map(({ slot: A, performer: $ }) => o.length ? `${A.label}: ${($ == null ? void 0 : $.name) || "Unassigned"}` : ($ == null ? void 0 : $.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const v = e[y], N = [...d].reverse().find(({ slot: R }) => Eo(R) === Eo(v)), W = N ? m.get(String(Ve(N.performer))) : -1;
    for (const R of c[y]) {
      const _ = t[R], A = Ve(_);
      if (!(R < W) && !(A == null || !i && p.has(String(A))) && (d.push({ slot: v, performer: _ }), i || p.add(String(A)), u(y + 1, p, b + 1), i || p.delete(String(A)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: v, performer: null }), u(y + 1, p, b), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function Do(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Bs(e, t) {
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
      const m = [...new Set(e.map((u) => u.label || ""))].map((u) => `${u}:${a.filter((y) => (y.slot.label || "") === u).map((y) => y.performer.performerId).sort((y, p) => y - p).join(",")}`).join("|");
      i.has(m) || i.set(m, [...a]);
      return;
    }
    const c = e[l];
    for (const m of t)
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => Ct(u) === Ct(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Gs(e) {
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
function Ks(e, t, r = 20) {
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
function Us(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function zs(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Ia(e, t, r) {
  const o = Ve, i = new Set((t || []).map(o)), a = new Set((r || []).map(Ct));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = Ct(l.gender || l.genderIdentity), u = Ct(d.gender || d.genderIdentity), y = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - y || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: Ca, useMemo: Be, useRef: pe, useState: j } = Fr, n = Fr.createElement, $a = "/api/plugins/segment-studio";
function Re(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Lt) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Dr();
    return t[e] = r, window.localStorage.setItem(Lt, JSON.stringify(t)), r;
  } catch {
    return Dr();
  }
}
function Oe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Lt) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Lt, JSON.stringify(t));
  } catch {
  }
}
function zr(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Lt) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function _r(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Lt) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Lt, JSON.stringify(t));
  } catch {
  }
}
function _s(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Hs(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Z(e, t, r = 0) {
  var d;
  const o = await Qo(`${$a}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = _s(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Hs(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function qs(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${$a}${e}`, o = await Qo(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Ws(
      o.headers.get("Content-Disposition")
    )
  };
}
function Ws(e, t = "segment-studio-ai-feedback.zip") {
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
function Ie(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Dr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Ta(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Vs(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Ma(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Js(e, t) {
  const { sceneCount: r, segmentCount: o } = Ma(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Aa(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Ma(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Js(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Re(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Oe(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Oo({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const mt = {
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
function ac(e, t) {
  return {
    ...(mt[e] || mt.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function Ra(e) {
  return { ...(mt[e] || mt.unreviewed).badge };
}
function Ea(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Da = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Ys(e, t, r = "not-applicable", o = !1) {
  const i = mt[e] || mt.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Zs(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Qs(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Xs(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function el(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function or(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function tl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Ft({ state: e, includeLabel: t = !0 }) {
  const r = mt[e] || mt.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: Ra(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function nl(e, t = null) {
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
function ic(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function rl(e, t = document) {
  return !(e.defaultPrevented || nl(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function sc(e, t = document, r = !1, o = {}) {
  return rl(e, t) ? xs(e, r, o) != null : !1;
}
function ot(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function ol(e, t) {
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
function al(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Oa(e, t = !0) {
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
function Vn(e, t = !0) {
  return {
    type: "segment",
    identity: Oa(e, t),
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
      identity: Oa(r, t),
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
function tr(e) {
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
function Pa(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function La(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Hr(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function il(e, t) {
  const r = (t || []).map((i) => Pa(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: et(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function sl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : il(e, t);
}
function ll({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function lc(e, t) {
  return Hr(Pa(e, t));
}
function et(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function dl(e, t) {
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
    m.forEach((y, p) => l.push({
      sourceSlotDefinitionId: y.id,
      derivedSlotDefinitionId: u[p].id
    }));
  }
  return l;
}
function cl(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = dl(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function ul(e) {
  const t = et(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(ar).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function ar(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function nr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Po(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: nr(o),
    trackCount: Math.max(1, t.length)
  };
}
function ml(e) {
  const t = e.map(et), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function gl(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Po({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = ml(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), y = [...new Map(m.map((b) => [
          Number(b.performerId),
          { id: Number(b.performerId), name: b.performerName || `Performer ${b.performerId}` }
        ])).values()], p = l.slots.map((b) => ({
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
          performers: y,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Po);
}
function Pt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => gl(s, a));
}
function qr(e) {
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
const pl = {
  group: 38,
  lane: 33,
  segment: 41
};
function fl(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = pl[s.kind];
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
function Fa(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function yl(e, t = [], r = !0) {
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
function bl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: nr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return qr(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: nr(a)
    };
  });
}
function ja(e, { nativeOnly: t = !1 } = {}) {
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
function Lo(e, t) {
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
function Tt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function $n(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function hl(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Tn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? hl(e.name) : "—"),
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
function Ba({ assignments: e, className: t = "" }) {
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
      n(Tn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function ir({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${Ca()}`, [a, s] = j(null);
  function l() {
    var y;
    const c = (y = o.current) == null ? void 0 : y.getBoundingClientRect();
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
    ...e.slice(0, 3).map((c) => n(Tn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? Ri(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Ba, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Tn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function vl(e, t) {
  const r = new Set(Tt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ga(e, t) {
  return t ? Tt(e).filter((r) => r !== t) : Tt(e);
}
function xl(e, t) {
  const r = Tt(t), o = new Set(Tt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function ut(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Fo(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Or(e, t, r, o = null) {
  var g, m, u, y, p, b;
  const i = e.findIndex((f) => f.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const f = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && f.sort((w, v) => Fo(w, v, o)), ((m = f[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((f) => f.segment.id === t);
  if (r === "left" || r === "right") {
    const f = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + f));
    return ((u = a.markers[w]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((y = a.markers[s]) == null ? void 0 : y.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((b = [...e[l].markers].sort(c ? (f, w) => Fo(f, w, Number(o)) : (f, w) => Math.abs(f.segment.startSec - d) - Math.abs(w.segment.startSec - d) || f.segment.startSec - w.segment.startSec || f.segment.id - w.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function Sl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Or([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function kl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function wl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Nl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [Ko(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => Ko(Math.min(s, r + l))))];
}
function Il(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Cl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function jo(e, t) {
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
function Bo(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function $l(e) {
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
async function Tl(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await Go(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Nl(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await Go(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const y = await Ml(o), p = `example-${l + 1}-frame-${m + 1}`;
        c.push({ fieldName: p, timestampSec: u }), s.push({
          fieldName: p,
          file: new File(
            [y],
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
function Go(e, t) {
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
function Ml(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Ko(e) {
  return Math.round(e * 1e3) / 1e3;
}
function rr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Al(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function Pr(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Mn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ka(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Cr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Rl(e, t) {
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
function Uo(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function El(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: y, pendingFirstSegmentStartSecRef: p, pendingTagEditSegmentIdRef: b, replaceSegmentSelection: f, savingSegmentId: w, segments: v, selectedSegment: N, selectedSegmentIdRef: W, selectedSegments: R, selectionAnchorIdRef: _, selectionRangeBaseIdsRef: A, setEditorFilters: $, setFirstSegmentTagOpen: O, setHideDerivedSegments: D, setHistory: U, setHistoryOpen: P, setPublishApprovedError: V, setSaveMessage: I, setSavingSegmentId: C, setSelectedSegmentGroupKey: F, setSelectedSegmentId: re, setSelectedSegmentIds: ee, startInput: we, timelineDuration: ce, video: T } = e;
  function Q(h) {
    l.current = h || kt, U(l.current);
  }
  async function oe(h, K, M, x, E = null) {
    var S;
    try {
      const k = await Z(`/videos/${T.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: h,
          label: K,
          beforeState: M,
          afterState: x,
          receiptId: E
        })
      });
      return Q(k), !0;
    } catch (k) {
      return k.status === 409 && ((S = k.payload) != null && S.current) && Q(k.payload.current), I("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function fe(h, K, M = !0, x = null, E = !1, S = K) {
    var te;
    if (!h || w != null) return null;
    const k = R.map((xe) => xe.id), H = W.current, le = M && !t ? crypto.randomUUID() : null;
    C(h.id), I(M ? "Saving directly to Cove…" : "Restoring history…");
    const se = E ? rr(o, [h.id], S) : null;
    se && g(se, T.id);
    try {
      if (t && h.nativeSegmentId == null && h.itemId != null) {
        const J = `draft-update:${T.id}:${h.itemId}:${h.revision}:${K.tagId}:${K.startSec}:${K.endSec ?? "open"}:${K.reviewState ?? h.reviewState}`, L = await Z(`/videos/${T.id}/drafts/${h.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(J),
            expectedRevision: h.revision,
            startSec: K.startSec,
            endSec: K.endSec,
            tagId: K.tagId,
            reviewState: K.reviewState
          })
        });
        Oe(J);
        const ne = {
          ...h,
          ...L.draft,
          id: h.id,
          itemId: h.itemId
        };
        return M && await oe(
          "segment.update",
          x || "Changed segment",
          Vn(h, t),
          Vn(
            ne,
            t
          )
        ), Uo(h, K, t) ? await m() : g({
          ...o,
          approvedSetVersion: L.approvedSetVersion || o.approvedSetVersion,
          segments: v.map((me) => me.id === h.id ? ne : me).sort((me, he) => me.startSec - he.startSec || me.id - he.id)
        }, T.id), I(((te = L.draft) == null ? void 0 : te.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), ne;
      }
      const xe = await Z(`/videos/${T.id}/segments/${h.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...K,
          expectedUpdatedAt: h.updatedAt,
          historyReceiptId: le
        })
      }), q = {
        ...h,
        ...xe,
        reviewState: K.reviewState ?? h.reviewState
      }, X = v.map((J) => J.id === h.id ? q : J).sort((J, L) => J.startSec - L.startSec || J.id - L.id);
      return Uo(h, K, t) ? await m() : g({ ...o, segments: X }, T.id), M && await oe(
        "segment.update",
        x || "Changed segment",
        Vn(h, t),
        Vn(
          q,
          t
        ),
        le
      ), I(M ? "Saved to Cove" : "History restored"), q;
    } catch (xe) {
      return E && (g((q) => Mn(
        q,
        [h],
        Object.keys(S)
      ), T.id), ee(k), re(H), _.current = H, A.current = []), xe.status === 409 ? (I("Conflict — loading the latest segment…"), await c()) : I(xe.message || "Unable to save the segment."), null;
    } finally {
      C(null);
    }
  }
  async function ie() {
    if (!t) return !1;
    const h = v.filter((M) => !M.published && M.reviewState === "approved").length;
    if (h === 0 || w != null) return !1;
    const K = `complete-review:${T.id}:${o.approvedSetVersion}`;
    V(""), C(-1), I(`Publishing ${h} Approved draft${h === 1 ? "" : "s"}…`);
    try {
      const M = await Z(`/videos/${T.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(K),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Oe(K), Q(kt), P(!1);
      const x = await m(), E = Is(
        v,
        W.current,
        M.published
      ), S = E ? We(x == null ? void 0 : x.segments, E) : null;
      return S && re(S.id), I(`${M.published.length} Approved draft${M.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (M) {
      const x = M.status === 409 ? "The approved drafts changed. Review the updated list and try again." : M.message || "Unable to publish the approved drafts.";
      return M.status === 409 && await c(), V(x), I(x), !1;
    } finally {
      C(null);
    }
  }
  async function B(h = null, K = null) {
    var q;
    if (w != null) return;
    const M = h != null ? p.current : null, x = Number.isFinite(M) ? M : r, E = Math.min(ce, x + 20);
    if (E <= x) {
      I("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const S = Ns(v, N, h);
    if (S.kind === "choose-tag") {
      p.current = x, I(""), O(!0);
      return;
    }
    if (S.kind === "invalid-selection") {
      I("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: k } = S, H = `create-draft:${T.id}:${k}:${x}`, le = t ? null : crypto.randomUUID(), se = W.current, te = {
      ...N || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: k,
      tagName: K || (N == null ? void 0 : N.tagName) || "Tag segment",
      tagSortName: k === (N == null ? void 0 : N.tagId) && (N == null ? void 0 : N.tagSortName) || null,
      startSec: x,
      endSec: E,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, xe = Al(o, te);
    C(-1), O(!1), g(xe, T.id), f(te.id), F(ut(
      Pt(xe.segments, xe.segmentGroups || [], xe.performerSlots || []),
      te.id
    ));
    try {
      let X;
      if (t) {
        const ne = await Z(`/videos/${T.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Re(H), tagId: k, startSec: x, endSec: E })
        });
        Oe(H), X = { itemId: (q = ne.draft) == null ? void 0 : q.itemId };
      } else
        X = { nativeSegmentId: (await Z(`/videos/${T.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: k,
            startSec: x,
            endSec: E,
            historyReceiptId: le
          })
        })).id };
      p.current = null, O(!1);
      const J = await m();
      if (!J) {
        g((ne) => Pr(
          ne,
          [te.id]
        ), T.id), f(se), I("Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment.");
        return;
      }
      const L = We(J == null ? void 0 : J.segments, X);
      L ? (t || await oe(
        "segment.create",
        "Created segment",
        lt([], !1),
        lt([L], !1),
        le
      ), S.openTagEditor && (b.current = L.id), f(L.id), F(ut(
        Pt(J.segments || [], J.segmentGroups || [], J.performerSlots || []),
        L.id
      ))) : I("Segment created, but it could not be selected.");
    } catch (X) {
      g((J) => Pr(
        J,
        [te.id]
      ), T.id), f(se), h != null && O(!0), I(X.message || "Unable to create the draft.");
    } finally {
      C(null);
    }
  }
  async function ue() {
    if (R.length !== 1 || !N || w != null) return;
    const h = r;
    if (h <= N.startSec || N.endSec != null && h >= N.endSec) {
      I("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const K = `split-draft:${N.itemId}:${N.revision}:${h}`, M = t ? null : lt([N], !1), x = t ? null : crypto.randomUUID();
    C(N.id);
    try {
      let E = null;
      t && N.nativeSegmentId == null ? (await Z(`/videos/${T.id}/drafts/${N.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(K),
          expectedRevision: N.revision,
          splitSec: h
        })
      }), Oe(K)) : E = { nativeSegmentId: (await Z(`/videos/${T.id}/segments/${N.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: N.updatedAt,
          splitSec: h,
          historyReceiptId: x
        })
      })).id };
      const S = await m();
      if (!t) {
        const k = [
          We(S == null ? void 0 : S.segments, {
            nativeSegmentId: N.nativeSegmentId ?? N.id
          }),
          We(
            S == null ? void 0 : S.segments,
            E
          )
        ].filter(Boolean);
        await oe(
          "segment.split",
          "Split segment",
          M,
          lt(k, !1),
          x
        );
      }
      I(t ? `Segment split; both ranges remain ${N.reviewState}.` : "Segment split.");
    } catch (E) {
      E.status === 409 ? await c() : I(E.message || "Unable to split the draft.");
    } finally {
      C(null);
    }
  }
  async function Me(h = !1) {
    var E, S;
    if (R.length !== 1 || !N || w != null) return;
    const K = h ? r : N.startSec, M = ws(T.id, N, h, K), x = t ? null : crypto.randomUUID();
    C(N.id);
    try {
      const k = ((E = y.current) == null ? void 0 : E.operationKey) === M ? y.current : null;
      let H = (k == null ? void 0 : k.duplicateIdentity) ?? null;
      if (H == null && t && N.nativeSegmentId == null) {
        const te = await Z(`/videos/${T.id}/drafts/${N.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(M),
            expectedRevision: N.revision,
            startSec: h ? K : null
          })
        });
        H = Io(!1, te), y.current = { operationKey: M, duplicateIdentity: H };
      } else if (H == null) {
        const te = await Z(`/videos/${T.id}/segments/${N.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: N.updatedAt,
            startSec: h ? K : null,
            historyReceiptId: x
          })
        });
        H = Io(!0, te), y.current = { operationKey: M, duplicateIdentity: H };
      }
      const le = await m(), se = We(le == null ? void 0 : le.segments, H);
      if (se) {
        t || await oe(
          "segment.duplicate",
          "Duplicated segment",
          lt([], !1),
          lt([se], !1),
          x
        );
        const te = es(
          se,
          le.performerSlots || [],
          i,
          s,
          le.segmentGroups || []
        );
        $(te.filters), D(te.hideDerivedSegments), ee([se.id]), re(se.id), _.current = se.id, A.current = [], F(ut(
          Pt(le.segments || [], le.segmentGroups || [], le.performerSlots || []),
          se.id
        )), t && N.nativeSegmentId == null && Oe(M), y.current = null, I(h ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        I("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (k) {
      ((S = y.current) == null ? void 0 : S.operationKey) === M ? I("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : k.status === 409 ? await c() : I(k.message || "Unable to duplicate the draft.");
    } finally {
      C(null);
    }
  }
  async function Y() {
    if (R.length !== 1 || !N) return;
    const h = Number(we), K = a.trim() === "" ? null : Number(a), M = vo(h, K, d);
    if (M.error) {
      I(M.error);
      return;
    }
    if (h === N.startSec && K === N.endSec) {
      I("Timing is unchanged.");
      return;
    }
    await fe(N, { startSec: h, endSec: K, tagId: N.tagId }, !0, null, !0);
  }
  async function Se(h, K) {
    if (R.length !== 1 || !N) return;
    const M = vo(h, K, d);
    if (M.error) {
      I(M.error);
      return;
    }
    if (h === N.startSec && K === N.endSec) {
      I("Timing is unchanged.");
      return;
    }
    await fe(N, { startSec: h, endSec: K, tagId: N.tagId }, !0, null, !0);
  }
  return { acceptHistory: Q, recordHistoryAction: oe, mutateSegment: fe, completeReview: ie, createSegment: B, splitSegment: ue, duplicateSegment: Me, saveTiming: Y, applyShortcutTiming: Se };
}
function Dl() {
  const [e, t] = j(() => typeof window < "u" && window.matchMedia(yo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(yo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ol() {
  const [e, t] = j(() => typeof window < "u" && window.matchMedia(bo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(bo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Pl() {
  try {
    return Vi(window.localStorage.getItem(oa));
  } catch {
    return { ...rt };
  }
}
function Ll() {
  try {
    return Tt(JSON.parse(window.localStorage.getItem(aa) || "[]"));
  } catch {
    return [];
  }
}
function Fl(e) {
  try {
    window.localStorage.setItem(aa, JSON.stringify(Tt(e)));
  } catch {
  }
}
function jl(e) {
  try {
    window.localStorage.setItem(oa, JSON.stringify(e));
  } catch {
  }
}
function Bl() {
  try {
    const e = JSON.parse(window.localStorage.getItem(sa) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Gl(e) {
  try {
    return window.localStorage.setItem(sa, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Kl({ status: e }) {
  const t = Da[e];
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
function $t({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, Xe.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...Ra(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${mt[t].symbol}${e[t]}`)));
}
function Ul({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: m }) {
  const u = Ur(a), [y, p] = j(() => Ir(o, u)), [b, f] = j(!1), [w, v] = j(""), N = pe(!1), W = o.map((D) => `${D.slotDefinitionId}:${D.performerId || ""}`).join("|"), R = u.map((D) => Ve(D)).join("|"), _ = Na(
    o,
    u
  );
  ye(() => {
    p(Ir(o, u)), v("");
  }, [t, r, W, R]);
  async function A(D = y) {
    if (!N.current) {
      N.current = !0, f(!0), v("Saving performer slots…");
      try {
        const U = Ir(o.map((I) => ({
          ...I,
          performerId: D[I.slotDefinitionId] || null
        })), u), P = o.map((I) => {
          const C = U[I.slotDefinitionId] ? Number(U[I.slotDefinitionId]) : null, F = u.find((re) => String(Ve(re)) === String(C));
          return {
            ...I,
            performerId: C,
            performerName: (F == null ? void 0 : F.name) || null
          };
        });
        s(P);
        const V = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((I) => ({ slotDefinitionId: I.slotDefinitionId, performerId: U[I.slotDefinitionId] ? Number(U[I.slotDefinitionId]) : null }))
          })
        });
        v("Performer slots saved."), await l(V, {
          beforeState: tr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: tr([{
            segmentId: t,
            itemId: r,
            revision: V.revision,
            slots: V.slots || []
          }])
        });
      } catch (U) {
        d && await d(o, U), U.status === 409 ? (v("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : v(U.message || "Unable to save performer slots.");
      } finally {
        N.current = !1, f(!1);
      }
    }
  }
  function $(D, U) {
    v(`Option ${U + 1} applied; save to confirm.`), p({ ...y, ...D.assignments });
  }
  async function O(D) {
    const U = { ...y, ...D.assignments };
    p(U), await A(U);
  }
  return ye(() => {
    if (m)
      return m.current = (D) => N.current || !_[D] ? !1 : (O(_[D]), !0), () => {
        m.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    _.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, _.map((D, U) => n("button", {
        key: U,
        type: "button",
        disabled: b,
        onClick: () => $(D, U),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${U + 1}: ${D.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, U + 1),
        n("span", { key: "description" }, D.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${_.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((D) => n("label", { key: D.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(D)),
      (D.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(D.genderHints || []).map(ar).join(" · ")}`) : null,
      n("select", { key: "select", value: y[D.slotDefinitionId] || "", disabled: b, onChange: (U) => p({ ...y, [D.slotDefinitionId]: U.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Ia(u, u, D.genderHints).map((U) => n("option", { key: Ve(U), value: Ve(U) }, U.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: b, onClick: () => A(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function zl({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var _;
  const s = ((_ = t[0]) == null ? void 0 : _.slots) || [], l = Ur(r), d = Na(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((A, $) => {
    const O = t.map((D) => {
      var U;
      return String(((U = D.slots[$]) == null ? void 0 : U.performerId) || "");
    });
    return [A.slotDefinitionId, O.every((D) => D === O[0]) ? O[0] : c];
  })), [m, u] = j(g), [y, p] = j(!1), [b, f] = j(""), w = pe(!1), v = t.map((A) => `${A.itemId ?? `native:${A.segmentId}`}:${A.revision}:${A.slots.map(($) => `${$.slotDefinitionId}:${$.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    u(g());
  }, [v]);
  async function N(A = m) {
    if (w.current) return;
    w.current = !0, p(!0), f(`Saving performer slots for ${t.length} segments…`);
    const $ = [];
    try {
      for (const O of t) {
        const D = O.slots.map((P, V) => {
          const I = A[s[V].slotDefinitionId];
          return {
            slotDefinitionId: P.slotDefinitionId,
            performerId: I === c ? P.performerId || null : I ? Number(I) : null
          };
        }), U = await Z(O.itemId != null ? `/videos/${e}/drafts/${O.itemId}/slots` : `/videos/${e}/segments/${O.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: O.revision, assignments: D })
        });
        $.push({
          segmentId: O.segmentId,
          itemId: O.itemId,
          revision: U.revision,
          slots: U.slots || []
        });
      }
      f("Performer slots saved."), o({
        beforeState: tr(t),
        afterState: tr($)
      });
    } catch (O) {
      const D = await i();
      O.status === 409 ? f(D ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : f(O.message || (D ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function W(A, $) {
    f(`Option ${$ + 1} applied; save to confirm.`), u({ ...m, ...A.assignments });
  }
  async function R(A) {
    const $ = { ...m, ...A.assignments };
    u($), await N($);
  }
  return ye(() => {
    if (a)
      return a.current = (A) => w.current || !d[A] ? !1 : (R(d[A]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((A, $) => n("button", {
        key: $,
        type: "button",
        disabled: y,
        onClick: () => W(A, $),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${$ + 1} to all selected segments: ${A.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, $ + 1),
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
        disabled: y,
        onChange: ($) => u({ ...m, [A.slotDefinitionId]: $.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[A.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Ia(l, l, A.genderHints).map(($) => n("option", {
          key: Ve($),
          value: Ve($)
        }, $.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: y,
        onClick: () => N(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function gt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function _l(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return gt(t);
  const o = [...new Set(r.map((i) => gt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function sr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function Jn({ name: e }) {
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
function Hl({ hidden: e }) {
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
    n(sr, { key: "derived" })
  ]);
}
function ql({ segment: e, provenance: t }) {
  var g;
  const [r, o] = j(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = _l(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        const u = m.modelIdentifier || m.modelKey, y = m.value == null ? null : typeof m.value == "string" ? m.value : JSON.stringify(m.value);
        return n("div", { key: m.id || `${m.fieldKey}:${m.sourceKey}:${m.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            gt(m.sourceKey, m.sourceDisplayName)
          ),
          m.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${m.fieldKey}${y == null ? "" : ` · ${y}`}`
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
function Wl({
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
  const [m, u] = j([]), y = e.flatMap((w) => w.lanes.map((v) => v.key)), p = y.join("|");
  ye(() => {
    const w = new Set(y);
    u((v) => v.filter((N) => w.has(N)));
  }, [p]);
  const b = nr(t), f = !!ja(
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
        `${y.length} swimlane${y.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n($t, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      ll({ mergeable: f, reviewable: a, tagEditable: s, slotsEditable: l })
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
    ...e.map((w) => n("section", {
      key: w.key,
      "data-selected-segment-group": w.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, w.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${w.selectedCount} selected`)
      ]),
      ...w.lanes.map((v) => {
        const N = m.includes(v.key), W = v.markers.some(({ segment: _ }) => _.id === r), R = `selected-segment-lane-${v.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: v.key,
          "data-selected-segment-lane": v.key,
          className: `rounded-md border ${W ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": N,
            "aria-controls": R,
            "aria-current": W ? "true" : void 0,
            onClick: () => u((_) => N ? _.filter((A) => A !== v.key) : [..._, v.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, N ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, $n(v)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(v.selectedCount)),
            a ? n($t, { key: "states", counts: v.counts }) : null
          ]),
          N ? n("div", {
            key: "segments",
            id: R,
            className: "space-y-1 border-t border-border p-1.5"
          }, v.markers.map(({ segment: _ }) => {
            const A = _.endSec == null ? Ie(_.startSec) : `${Ie(_.startSec)} – ${Ie(_.endSec)}`;
            return n("button", {
              key: _.id,
              type: "button",
              onClick: () => i(_),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${_.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${_.tagName || "Segment"}, ${_.reviewState}, ${A}` : `${_.tagName || "Segment"}, ${A}`,
              "aria-current": _.id === r ? "true" : void 0
            }, [
              a ? n(Ft, {
                key: "state",
                state: _.reviewState,
                includeLabel: !1
              }) : null,
              _.isDerived ? n(sr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, A),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                gt(_.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const kn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, zo = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], _o = [
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
function Rn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Ua(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Ho(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Yn(e, t, r, o = null) {
  const i = Ho(t), a = Ho(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Vl(e, t, r = null) {
  var m, u, y;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Yn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Yn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Yn(o, t.performersCriterion, "performer"), Yn(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = qo(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = qo(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (y = t.shotBoundariesCriterion) == null ? void 0 : y.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function qo(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function za({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Oo, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Xe.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = mt[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Oo, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Jl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "group relative flex min-h-full flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm transition-colors hover:border-accent/60" }, [
    n("a", {
      key: "link",
      href: `/segment-studio/${e.videoId}`,
      onClick: (i) => Rn(i, t, o),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Ei(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(za, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Yl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
  const o = { page: "segment-studio", id: e.videoId };
  return n("article", { className: "overflow-hidden rounded-md border border-border bg-card" }, n("a", {
    href: `/segment-studio/${e.videoId}`,
    onClick: (i) => Rn(i, t, o),
    className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
    "aria-label": `Open segment editor for ${e.title}`
  }, [
    n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
    n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
      n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
      n(za, { key: "segments", item: e, showReviewStates: r })
    ]),
    n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
  ]));
}
function Wr({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Ms(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Rn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Qt(
        o,
        wt.recyclingBinView
      ) ? n(_a, { key: "bin", onNavigate: t }) : null,
      n(Ha, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Lr = "segment-studio:recycling-bin-changed";
function Zl(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Nn() {
  window.dispatchEvent(new CustomEvent(Lr));
}
function _a({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = j(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await Z("/bin"), m = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(m) && m >= 0 ? Math.trunc(m) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(Lr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Lr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Zl(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Rn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ha({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Rn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function Ql({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Er(i.target.value);
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
function Xl({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = j("maximum"), s = (u, y) => {
    const p = rs(e, t, u, y);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (u, y) => {
    var b;
    const p = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    p && s(u, ns(y.clientX, p.left, p.width));
  }, d = (u, y) => {
    var p, b;
    y.preventDefault(), (b = (p = y.currentTarget).setPointerCapture) == null || b.call(p, y.pointerId), l(u, y);
  }, c = (u, y) => {
    var p, b;
    (b = (p = y.currentTarget).hasPointerCapture) != null && b.call(p, y.pointerId) && l(u, y);
  }, g = (u, y) => {
    const p = u === "minimum" ? e : t, b = u === "minimum" ? 0 : e, f = u === "minimum" ? t : 1, w = y.shiftKey ? 0.1 : 0.01;
    let v = null;
    ["ArrowLeft", "ArrowDown"].includes(y.key) && (v = p - w), ["ArrowRight", "ArrowUp"].includes(y.key) && (v = p + w), y.key === "PageDown" && (v = p - 0.1), y.key === "PageUp" && (v = p + 0.1), y.key === "Home" && (v = b), y.key === "End" && (v = f), v != null && (y.preventDefault(), s(u, Math.min(f, Math.max(b, v))));
  }, m = (u, y) => n("span", {
    key: u,
    role: "slider",
    tabIndex: 0,
    "aria-label": u === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((u === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((u === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(y * 100),
    "aria-valuetext": `${Math.round(y * 100)} percent`,
    onPointerDown: (p) => d(u, p),
    onPointerMove: (p) => c(u, p),
    onKeyDown: (p) => g(u, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${y * 100}%`,
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
function ed({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = pe(null);
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
    onKeyDownCapture: (s) => ot(s, { onCancel: a })
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
    n(In, {
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
function td({
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
  ])).entries()].sort((f, w) => f[1].localeCompare(w[1]) || f[0] - w[0]), y = (f) => d(dt({ ...m, ...f })), p = (f) => y({
    reviewStates: m.reviewStates.includes(f) ? m.reviewStates.filter((w) => w !== f) : [...m.reviewStates, f]
  }), b = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && g();
    },
    onKeyDownCapture: (f) => ot(f, { onCancel: g })
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
        n("div", { className: "flex flex-wrap gap-2" }, Xe.map((f) => {
          const w = m.reviewStates.includes(f), v = mt[f];
          return n("button", {
            key: f,
            type: "button",
            onClick: () => p(f),
            "aria-pressed": w,
            className: b(w)
          }, `${v.symbol} ${f} (${i[f] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => y({ performerId: null }),
            "aria-pressed": m.performerId == null,
            className: b(m.performerId == null)
          }, "All performers"),
          ...r.map((f) => {
            const w = Number(Ve(f));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => y({ performerId: w }),
              "aria-pressed": m.performerId === w,
              className: b(m.performerId === w)
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
            onChange: (f) => y({
              tagId: f.target.value === "" ? null : Number(f.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...u.map(([f, w]) => n("option", { key: f, value: f }, w))
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
            onChange: (f) => y({
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
            onClick: () => y({ sourceKey: null }),
            "aria-pressed": m.sourceKey == null,
            className: b(m.sourceKey == null)
          }, "All provenance"),
          ...o.map((f) => n("button", {
            key: f,
            type: "button",
            onClick: () => y({ sourceKey: f }),
            "aria-pressed": m.sourceKey === f,
            title: f,
            className: b(m.sourceKey === f)
          }, gt(f)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Xl, {
          minimum: m.confidenceMin,
          maximum: m.confidenceMax,
          onChange: ({ minimum: f, maximum: w }) => y({
            confidenceMin: f,
            confidenceMax: w
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
            onChange: (f) => y({
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
        n(Hl, { key: "icon", hidden: t }),
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
function nd({ reviewMode: e, bindings: t, onClose: r }) {
  const o = An.filter((l) => Zt(l, e)), i = wo(o, 1)[0], a = wo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(ha)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => ot(l, { onCancel: r })
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
function rd({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = $l(e), [l, d] = j([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => ot(g, {
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
        const u = l.includes(g.tagName), y = `incorrect-example-tag-${m}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": u,
            "aria-controls": y,
            onClick: () => d((p) => u ? p.filter((b) => b !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: or(!1) }
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
            id: y,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((p) => {
            const b = `${Ie(p.startSec)}${p.endSec == null ? "" : ` – ${Ie(p.endSec)}`}`, f = r === p.id;
            return n("div", {
              key: p.id,
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
                onClick: () => i(p),
                "aria-label": `${f ? "Restoring" : "Restore to review"} ${g.tagName} example at ${b}`,
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
function od({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = j(""), [a, s] = j(0), l = pe(null), d = Be(() => Ks(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = zs(d);
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
      var y;
      if (u.key === "Tab")
        bt(u);
      else if (u.key === "Escape")
        u.preventDefault(), u.stopPropagation(), r();
      else if (u.key === "ArrowDown" || u.key === "ArrowUp") {
        u.preventDefault(), u.stopPropagation();
        const p = u.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + p + d.length) % d.length : 0);
      } else u.key === "Enter" && !((y = u.nativeEvent) != null && y.isComposing) && (u.preventDefault(), u.stopPropagation(), m());
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
    }, d.length ? d.flatMap((u, y) => {
      var R;
      const p = u.segment || u, b = p.endSec == null ? Ie(p.startSec) : `${Ie(p.startSec)} – ${Ie(p.endSec)}`, f = `${gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = y === c, v = y > 0 ? d[y - 1].groupKey : null, N = g && u.groupKey !== v ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, W = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: w ? l : null,
        type: "button",
        role: "option",
        "aria-selected": w,
        onMouseEnter: () => s(y),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${w ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${u.groupName} group`) : null,
        n(Ft, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (R = u.performers) != null && R.length ? n(ir, {
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
          title: f
        }, f)
      ]);
      return N ? [N, W] : [W];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function ad(e) {
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
function id({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = Be(() => ad(e), [e]), [l, d] = j([]), c = s.reduce((u, y) => u + y.drafts.length, 0), g = (u) => d((y) => y.includes(u) ? y.filter((p) => p !== u) : [...y, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => ot(u, {
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
      ].flatMap(([u, y]) => [
        n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
        n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(y))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((u) => {
        const y = l.includes(u.key);
        return n("section", { key: u.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": y,
            "aria-controls": m(u),
            onClick: () => g(u.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: or(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, y ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, u.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${u.drafts.length} draft${u.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          y ? n("div", {
            key: "drafts",
            id: m(u),
            className: "divide-y divide-border border-t border-border"
          }, u.drafts.map((p) => {
            const b = p.endSec == null ? Ie(p.startSec) : `${Ie(p.startSec)} – ${Ie(p.endSec)}`, f = `${gt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return n("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Ft, { key: "review", state: p.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
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
function sd({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Gs(e), [s, l] = j(() => /* @__PURE__ */ new Set()), [d, c] = j(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), m = (b) => l((f) => {
    const w = new Set(f);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), u = (b) => c((f) => {
    const w = new Set(f);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), y = (b) => b.assignment.map(({ slot: f, performer: w }) => `${f.label || `Slot ${f.sortOrder + 1}`}: ${w.name}`).join(", "), p = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || ot(b, {
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
          style: { background: or(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => u(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${y(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": p(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${y(b)}`,
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
            b.assignment.map(({ slot: f, performer: w }) => {
              const v = f.label || `Slot ${f.sortOrder + 1}`;
              return n("span", {
                key: f.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${v}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${v}: ${w.name}`
                }, `${v}: ${w.name}`),
                n(Tn, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n($t, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${y(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: p(b), className: "divide-y divide-border/70" },
          b.candidates.map((f) => {
            const w = f.endSec == null ? Ie(f.startSec) : `${Ie(f.startSec)} – ${Ie(f.endSec)}`, v = `${gt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", {
              key: f.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Ft, { key: "review", state: f.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                f.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                w
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: v
              }, v)
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
function ld({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => ot(d, { onCancel: r, onConfirm: t })
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
function dd({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = j(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : Ie(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => ot(c, {
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
        `${Ie(e.startSec)} – ${d}`
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
function cd(e) {
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
function ud({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = cd(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => ot(u, {
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
        ].flatMap(([u, y]) => [
          n("dt", { key: `${u}:label`, className: "text-secondary" }, u),
          n("dd", { key: `${u}:value`, className: "font-semibold text-foreground" }, String(y))
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
                `${u.rootTagName} @ ${Ie(u.rootStartSec)}`
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
              u.outputs.map((y, p) => n("div", {
                key: `${y.ruleId}:${y.depth}:${p}`,
                className: "flex min-w-0 items-center gap-2 text-sm",
                style: { marginLeft: `${Math.max(0, y.depth - 1) * 1.25}rem` }
              }, [
                n("span", { key: "branch", "aria-hidden": "true", className: "shrink-0 text-secondary" }, "↳"),
                n(
                  "span",
                  { key: "tags", className: "min-w-0 flex-1 truncate text-foreground" },
                  `${y.sourceTagName} → ${y.derivedTagName}`
                ),
                n("span", { key: "depth", className: "shrink-0 text-[11px] text-secondary" }, `Level ${y.depth}`),
                n(
                  "span",
                  { key: "action", className: "shrink-0 rounded-full border border-border px-2 py-0.5 text-[11px] font-medium text-foreground" },
                  y.action === "create" ? "Create" : "Link existing"
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
function md({
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
  video: y,
  slotButtonRef: p,
  tagSearchRef: b,
  onDetailChange: f,
  setSaveMessage: w,
  setSavingSegmentId: v,
  onSlotsChanged: N,
  onRecordHistory: W,
  splitSegment: R,
  duplicateSegment: _,
  provenance: A,
  lineage: $,
  onNavigateLineageItem: O,
  tagEditing: D,
  onCancelTagEditing: U,
  detailPanelRef: P,
  onReduceSelection: V
}) {
  var Q, oe, fe, ie;
  const I = pe(null), C = pe(null), F = pe(null), re = pe(null), ee = pe(null), [we, ce] = j(!1);
  ye(() => {
    I.current && (I.current.scrollTop = 0), ce(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var B, ue;
    we && ((ue = (B = C.current) == null ? void 0 : B.querySelector("input, select, button")) == null || ue.focus({ preventScroll: !0 }));
  }, [we]);
  function T() {
    ce(!1), requestAnimationFrame(() => {
      var B;
      return (B = p.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const B = !r.some((Y) => Y.isDerived), ue = e && c ? sl(m, r) : null, Me = (ue == null ? void 0 : ue.map((Y, Se) => {
      var K;
      const h = r[Se];
      return {
        segmentId: h.nativeSegmentId,
        itemId: h.published ? null : h.itemId,
        revision: (K = u.performerSlotRevisions) == null ? void 0 : K[h.id],
        slots: Y
      };
    })) || [];
    return n(Fr.Fragment, null, [
      n(Wl, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: P,
        onReduceSelection: V,
        reviewable: e,
        tagEditable: B,
        slotsEditable: Me.length > 0 && a == null,
        onEditSlots: () => ce(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      D && B ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (Y) => {
          Y.target === Y.currentTarget && U();
        },
        onKeyDownCapture: (Y) => ot(Y, { onCancel: U })
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
        n(In, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (Y, Se) => Y == null ? U() : s(Y, Se == null ? void 0 : Se.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: U,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      we && Me.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (Y) => {
          Y.target === Y.currentTarget && T();
        },
        onKeyDownCapture: (Y) => {
          var h, K;
          if (!(typeof ((h = Y.target) == null ? void 0 : h.closest) == "function" ? Y.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Y.repeat && !Y.ctrlKey && !Y.altKey && !Y.metaKey && !Y.shiftKey && /^[1-9]$/.test(Y.key) && ((K = ee.current) != null && K.call(ee, Number(Y.key) - 1))) {
            Y.preventDefault(), Y.stopPropagation();
            return;
          }
          ot(Y, { onCancel: T });
        }
      }, n("section", {
        ref: C,
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
          n("button", { key: "close", type: "button", onClick: T, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(zl, {
          videoId: y.id,
          targets: Me,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: ee,
          onSaved: async ({ beforeState: Y, afterState: Se }) => {
            await W(
              "performer-slots.assign",
              `Assigned performers to ${Me.length} segments`,
              Y,
              Se
            ), T(), N();
          },
          onConflict: N
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (B) => {
      I.current = B, P && (P.current = B);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Ft, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(sr, { key: "derived" }) : null,
        t && D ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (B) => {
            B.key === "Escape" && (B.preventDefault(), B.stopPropagation(), U());
          },
          onKeyDown: (B) => {
            ol(B, t.tagName) && (B.preventDefault(), B.stopPropagation(), s(t.tagId));
          }
        }, n(In, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (B, ue) => B == null ? U() : s(B, ue == null ? void 0 : ue.label),
          disabled: a != null || ((Q = $.data) == null ? void 0 : Q.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Ie(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Ie(t.endSec))
      ]) : null,
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(Kl, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Ba, {
        assignments: g.map((B) => {
          const ue = ul(B);
          return {
            key: String(B.slotDefinitionId),
            label: ue.label,
            performer: ue.filled ? { id: Number(B.performerId), name: ue.performer } : null,
            title: ue.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(ql, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: A
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        $.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : $.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, $.error) : $.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${$.data.derived ? "Derived segment" : "Root segment"} · ${$.data.componentSize} segment${$.data.componentSize === 1 ? "" : "s"} · ${$.data.integrityState}`
          ),
          (oe = $.data.parents) != null && oe.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...$.data.parents.map((B) => n("button", {
              key: B.nodeId,
              type: "button",
              onClick: () => O(B.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${B.ruleKey} ${B.ruleVersion}`))
          ]) : null,
          (fe = $.data.children) != null && fe.length ? n("p", { key: "children" }, `Children: ${$.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: a != null || !c || g.length === 0,
          onClick: () => ce(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: R,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => _(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => _(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    we && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (B) => {
        B.target === B.currentTarget && T();
      },
      onKeyDownCapture: (B) => {
        var Me, Y;
        if (!(typeof ((Me = B.target) == null ? void 0 : Me.closest) == "function" ? B.target.closest("input, textarea, select, [contenteditable='true']") : null) && !B.repeat && !B.ctrlKey && !B.altKey && !B.metaKey && !B.shiftKey && /^[1-9]$/.test(B.key) && ((Y = re.current) != null && Y.call(re, Number(B.key) - 1))) {
          B.preventDefault(), B.stopPropagation();
          return;
        }
        ot(B, {
          onCancel: T,
          onConfirm: () => {
            var Se;
            return (Se = F.current) == null ? void 0 : Se.click();
          }
        });
      }
    }, n("section", {
      ref: C,
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
        n("button", { key: "close", type: "button", onClick: T, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Ul, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (ie = u.performerSlotRevisions) == null ? void 0 : ie[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: F,
        shortcutRef: re,
        onOptimisticSave: (B) => {
          f((ue) => Cr(
            ue,
            t.id,
            B
          ), y.id), v(t.id), w("Saving performer slots…"), T();
        },
        onSaved: async (B, { beforeState: ue, afterState: Me }) => {
          f((Y) => Cr(
            Y,
            t.id,
            B.slots || [],
            B.revision
          ), y.id), w("Performer slots saved.");
          try {
            await W(
              "performer-slots.assign",
              "Assigned performers",
              ue,
              Me
            ), await N(B);
          } finally {
            v(null);
          }
        },
        onRollback: async (B, ue) => {
          f((Me) => {
            var Y;
            return Cr(
              Me,
              t.id,
              B,
              (Y = u.performerSlotRevisions) == null ? void 0 : Y[t.id]
            );
          }, y.id), w(ue.message || "Unable to save performer slots.");
          try {
            ue.status === 409 && await N();
          } finally {
            v(null);
          }
        },
        onConflict: N
      }))
    ])) : null
  ]);
}
function gd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: y, onSelect: p, onSelectSegments: b, onSelectAll: f, onConfigureTag: w, onSeekTime: v, centerRef: N, showReviewState: W = !0, swimlaneTitleWidth: R, onSwimlaneTitleWidthChange: _ }) {
  const A = pe(null), $ = pe(null), [O, D] = j(0), [U, P] = j({ scrollTop: 0, height: 320 }), [V, I] = j(null), C = Be(
    () => Pt(e, r, o),
    [e, r, o]
  ), F = Be(
    () => La(o),
    [o]
  ), re = Be(() => qr(C), [C]), ee = Be(
    () => yl(re, i, r.length > 0),
    [re, i, r.length]
  ), we = Be(
    () => Fa(ee.rows, Math.max(0, U.scrollTop - 24), U.height),
    [ee, U]
  ), ce = Math.max(0, Number(d) || 0), T = Wi(O), Q = Zn(R, T), oe = Q / 16, fe = Hi(c, ce, oe), ie = Gi(ce), B = Ki(ce, Math.max(1, O - oe * 16), g), ue = ie.filter((S, k) => k === 0 || k % B === 0), Me = Be(() => C.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: k, track: H }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${H}`).join(",")}`).join("|"), [C]);
  function Y() {
    const S = $.current;
    if (!S) return;
    const k = S.querySelector("[data-timeline-track]"), H = S.firstElementChild, le = k == null ? void 0 : k.getBoundingClientRect(), se = H == null ? void 0 : H.getBoundingClientRect(), te = le && se ? Math.max(0, le.left - se.left) : oe * 16, xe = (se == null ? void 0 : se.width) ?? S.scrollWidth;
    S.scrollTo({
      left: _i(c, ce, xe, S.clientWidth, te, ca),
      behavior: "smooth"
    });
  }
  ye(() => (N.current = Y, () => {
    N.current === Y && (N.current = null);
  })), ye(() => {
    Y();
  }, [g]);
  function Se() {
    const S = $.current, k = ee.rows.find((xe) => xe.kind === "lane" && xe.lane.markers.some(({ segment: q }) => q.id === s));
    if (!S || !k) return;
    const H = 24, le = k.top + H, se = le + k.height;
    let te = S.scrollTop;
    le < S.scrollTop + H ? te = Math.max(0, le - H) : se > S.scrollTop + S.clientHeight && (te = Math.max(0, se - S.clientHeight)), te !== S.scrollTop && (S.scrollTop = te), P({ scrollTop: te, height: S.clientHeight });
  }
  ye(() => {
    Se();
  }, [s, Me, ee]), ye(() => {
    const S = $.current, k = ee.rows.find((xe) => xe.kind === "group" && xe.group.key === a);
    if (!S || !k) return;
    const H = 24, le = k.top + H, se = le + k.height;
    let te = S.scrollTop;
    le < S.scrollTop + H ? te = Math.max(0, le - H) : se > S.scrollTop + S.clientHeight && (te = Math.max(0, se - S.clientHeight)), te !== S.scrollTop && (S.scrollTop = te), P({ scrollTop: te, height: S.clientHeight });
  }, [a, ee]), ye(() => {
    const S = $.current;
    if (!S || typeof ResizeObserver > "u") return;
    const k = () => {
      D(S.clientWidth), P({ scrollTop: S.scrollTop, height: S.clientHeight }), Se();
    }, H = new ResizeObserver(k);
    return H.observe(S), k(), () => H.disconnect();
  }, [s, Me, ee]);
  function h(S) {
    if (!(ce > 0)) return;
    const k = S.currentTarget.getBoundingClientRect(), H = Math.min(1, Math.max(0, (S.clientX - k.left) / k.width));
    v(H * ce);
  }
  function K(S) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let H = null;
    Object.hasOwn(k, S.key) && (H = c + k[S.key]), S.key === "Home" && (H = 0), S.key === "End" && (H = ce), H != null && (S.preventDefault(), S.stopPropagation(), v(Math.min(ce, Math.max(0, H))));
  }
  function M(S) {
    var H;
    const k = (H = A.current) == null ? void 0 : H.getBoundingClientRect();
    k && _(Zn(S.clientX - k.left, T));
  }
  function x(S) {
    const k = S.shiftKey ? 40 : 16;
    let H = null;
    S.key === "ArrowLeft" && (H = Q - k), S.key === "ArrowRight" && (H = Q + k), S.key === "Home" && (H = 160), S.key === "End" && (H = T), H != null && (S.preventDefault(), S.stopPropagation(), _(Zn(H, T)));
  }
  const E = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: A,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (S) => {
          (S.metaKey || S.ctrlKey) && (S.preventDefault(), f == null || f());
        },
        onKeyDown: (S) => {
          S.key !== "Enter" && S.key !== " " || (S.preventDefault(), f == null || f());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: E, disabled: g <= 1, onClick: () => m(Xn(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: E, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: E, disabled: g >= 8, onClick: () => m(Xn(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: E, onClick: Y, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(T),
      "aria-valuenow": Math.round(Q),
      "aria-valuetext": `${Math.round(Q)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), M(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && M(S);
      },
      onKeyDown: x,
      onDoubleClick: () => _(rt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${Q - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: $,
      onScroll: (S) => P({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: qi(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${oe}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ce,
          "aria-valuenow": Math.min(ce, Math.max(0, c)),
          "aria-valuetext": Ie(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: h,
          onKeyDown: K
        }, ue.map((S, k) => n("span", {
          key: S,
          className: `absolute top-0 ${Ui(k, ue.length, ce > 0 ? S / ce * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: zi(k, ue.length, ce > 0 ? S / ce * 100 : 0)
        }, Ie(S))).concat(t.map((S) => {
          const k = ce > 0 ? S.startSec / ce * 100 : 0;
          return n("button", {
            key: `shot-boundary:${S.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ie(S.startSec)} – ${Ie(S.endSec)}`,
            title: `Shot boundary · ${S.source || "manual"} · ${Ie(S.startSec)} – ${Ie(S.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (H) => {
              H.stopPropagation(), v(S.startSec);
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
            ...xo(fe),
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
        style: C.length > 0 ? { height: ee.height } : void 0
      }, [
        C.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...xo(fe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        C.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : we.map((S) => {
          var X;
          const k = S.group, H = i.includes(k.key), le = a === k.key, se = or(le);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": H ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${oe}rem minmax(0,1fr)`,
              backgroundColor: se,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (J) => {
                if (J.metaKey || J.ctrlKey) {
                  b(k.lanes.flatMap((L) => L.markers.map((ne) => ne.segment.id)));
                  return;
                }
                u(k.key), y(k.key);
              },
              "aria-expanded": !H,
              "aria-current": le ? "true" : void 0,
              "data-selected-timeline-group": le ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: se
              },
              title: `${H ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, H ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              H ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                W ? n($t, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const te = S.lane, xe = Xs(S.laneIndex), q = te.markers.some(({ segment: J }) => J.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${oe}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: xe
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": q ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: el(q, xe),
              title: `${$n(te)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": $n(te),
              onClick: (J) => {
                (J.metaKey || J.ctrlKey) && b(te.markers.map((L) => L.segment.id));
              },
              onMouseEnter: () => I(te.key),
              onMouseLeave: () => I((J) => J === te.key ? null : J)
            }, [
              te.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (J) => {
                  J.stopPropagation(), w({ tagId: te.tagId, tagName: te.label, trigger: J.currentTarget });
                },
                "aria-label": `Configure ${te.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: V === te.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, te.label),
              (X = te.performers) != null && X.length ? n(ir, {
                key: "performers",
                performers: te.performers,
                performerAssignments: te.performerAssignments
              }) : null,
              W ? n($t, { key: "counts", counts: te.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, te.markers.map(({ segment: J, track: L }) => {
              var $e;
              const ne = Tr(J.startSec, ce), me = J.endSec == null ? J.startSec : Math.max(J.startSec, J.endSec), he = Math.max(0, Tr(me, ce) - ne), be = l.includes(J.id), Ee = J.id === s, Pe = Hr(F.get(J.id)), ve = J.endSec == null ? Ie(J.startSec) : `${Ie(J.startSec)} – ${Ie(J.endSec)}`, Ce = ($e = Da[Pe]) == null ? void 0 : $e.label;
              return n("button", {
                key: J.id,
                type: "button",
                onClick: (ge) => {
                  ge.stopPropagation(), p(J, {
                    additive: ge.metaKey || ge.ctrlKey,
                    rangeSegmentIds: ge.shiftKey ? te.markers.map((Ge) => Ge.segment.id) : null
                  });
                },
                "aria-pressed": be,
                "aria-current": Ee ? "true" : void 0,
                "data-selected-timeline-marker": Ee ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ee ? "true" : void 0,
                "aria-label": W ? `${J.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${J.reviewState}${Ce ? `, ${Ce}` : ""}, ${ve}` : `${J.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${ve}`,
                title: W ? `${J.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${J.reviewState}${Ce ? ` · ${Ce}` : ""} · ${ve}` : `${J.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${ve}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...W ? Ys(J.reviewState, be, Pe, Ee) : Zs(be, Ee),
                  left: `${ne}%`,
                  top: `${tl(L)}rem`,
                  width: Qs(J.endSec, he),
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
function Vr({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = j(null), [l, d] = j([]), [c, g] = j(null), [m, u] = j(""), [y, p] = j(!0), [b, f] = j(null), [w, v] = j(""), [N, W] = j(!1), R = pe(null), _ = pe(0);
  ye(() => {
    const V = requestAnimationFrame(() => {
      var I;
      return (I = R.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(V);
  }, [e]), ye(() => {
    const V = new AbortController();
    return p(!0), v(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: V.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: V.signal })
    ]).then(([I, C]) => {
      const F = C.find((re) => (re.tags || []).some((ee) => Number(ee.tagId) === Number(e)));
      s(I), d(C), g((F == null ? void 0 : F.id) ?? null), u(F == null ? "" : String(F.id)), W(!1);
    }).catch((I) => {
      I.name !== "AbortError" && v(I.message || "Unable to load tag configuration.");
    }).finally(() => {
      V.signal.aborted || p(!1);
    }), () => V.abort();
  }, [r, e]);
  function A(V, I) {
    s({
      ...a,
      definitions: a.definitions.map((C, F) => F === V ? { ...C, ...I } : C)
    });
  }
  function $(V, I) {
    const C = V + I;
    if (C < 0 || C >= a.definitions.length) return;
    const F = [...a.definitions];
    [F[V], F[C]] = [F[C], F[V]], s({
      ...a,
      definitions: F.map((re, ee) => ({ ...re, sortOrder: ee }))
    });
  }
  function O(V) {
    const I = a.definitions[V], C = Number(I.assignmentCount) || 0, F = C === 0 ? "" : ` and its ${C} assignment${C === 1 ? "" : "s"}`;
    window.confirm(`Delete “${et(I)}”${F}?`) && (C > 0 && W(!0), s({
      ...a,
      definitions: a.definitions.filter((re, ee) => ee !== V).map((re, ee) => ({ ...re, sortOrder: ee }))
    }));
  }
  async function D() {
    var I;
    f("slots"), v("Saving performer slots…");
    let V;
    try {
      V = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: N,
          definitions: a.definitions.map((C, F) => {
            var re;
            return {
              id: C.id || void 0,
              label: ((re = C.label) == null ? void 0 : re.trim()) || null,
              sortOrder: F,
              genderHints: C.genderHints || []
            };
          })
        })
      }), s(V), W(!1);
    } catch (C) {
      C.status === 409 ? (v("Performer slots changed elsewhere; current values were reloaded."), (I = C.payload) != null && I.current && (s(C.payload.current), W(!1))) : v(C.message || "Unable to save performer slots."), f(null);
      return;
    }
    try {
      await o(), v("Performer slots saved.");
    } catch {
      v("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      f(null);
    }
  }
  async function U() {
    const V = m === "" ? null : Number(m);
    if (V !== c) {
      f("group"), v("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: V })
        });
      } catch (I) {
        v(I.message || "Unable to assign the tag group."), f(null);
        return;
      }
      try {
        const [I, C] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (I.status === "fulfilled") {
          d(I.value);
          const F = I.value.find((ee) => (ee.tags || []).some((we) => Number(we.tagId) === Number(e))), re = (F == null ? void 0 : F.id) ?? null;
          g(re), u(re == null ? "" : String(re));
        }
        v(
          I.status === "fulfilled" && C.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        f(null);
      }
    }
  }
  l.find((V) => Number(V.id) === Number(c));
  const P = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (V) => {
      V.target === V.currentTarget && !b && i();
    },
    onKeyDownCapture: (V) => ot(V, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: R,
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
        y ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: m,
            disabled: b != null,
            onChange: (V) => u(V.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((V) => n("option", { key: V.id, value: String(V.id) }, V.name))
          ])
        ]),
        y ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (m === "" ? null : Number(m)) === c,
          onClick: U,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        y ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: b != null,
              onChange: (V) => s({ ...a, allowSamePerformerInMultipleSlots: V.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((V, I) => n("article", {
            key: V.id || V._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: V.label || "",
                disabled: b != null,
                onChange: (C) => A(I, { label: C.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Li.map((C) => n("label", { key: C, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (V.genderHints || []).includes(C),
                  onChange: (F) => A(I, {
                    genderHints: F.target.checked ? [.../* @__PURE__ */ new Set([...V.genderHints || [], C])] : (V.genderHints || []).filter((re) => re !== C)
                  })
                }),
                n("span", { key: "text" }, ar(C))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${V.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || I === 0, onClick: () => $(I, -1), className: P, "aria-label": `Move ${et(V)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || I === a.definitions.length - 1, onClick: () => $(I, 1), className: P, "aria-label": `Move ${et(V)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => O(I), className: `${P} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++_.current}`,
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
              disabled: b != null,
              onClick: D,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, b === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      w ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, w) : null
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
function pd(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, captureTrainingExport: u, centerTimelineRef: y, closeEditorFilters: p, closeFirstSegmentTagDialog: b, closeMaterializeDialog: f, closeMergeConfirmation: w, closePublishApprovedDialog: v, closeTagEditing: N, collapsedSegmentGroups: W, compatibilityMode: R, configuringTag: _, createSegment: A, currentTime: $, deleteRejectedSegments: O, detail: D, detailPanelRef: U, detailWidth: P, duplicateSegment: V, editorFilters: I, editorLayout: C, editorRef: F, exportingExamples: re, filtersButtonRef: ee, filtersOpen: we, firstSegmentTagOpen: ce, focusRowRef: T, handleSeparatorKeyDown: Q, handleSeparatorPointerDown: oe, handleSeparatorPointerMove: fe, hideDerivedSegments: ie, history: B, historyOpen: ue, historySaving: Me, horizontalLayoutSize: Y, importNativeSegments: Se, incorrectExamples: h, incorrectExamplesOpen: K, lineage: M, markerRailWidth: x, materializeButtonRef: E, materializeCancelButtonRef: S, materializeDerivedSegments: k, materializeError: H, materializeLoading: le, materializeOpen: se, materializePreview: te, materializing: xe, mediaStackRef: q, mergeCancelButtonRef: X, mergeConfirmation: J, mergeSavingRef: L, mergeSelectedSwimlane: ne, nativeImportState: me, onDetailChange: he, onNavigate: be, onReload: Ee, onSlotsChanged: Pe, openPublishApprovedDialog: ve, panelSeparatorProps: Ce, pendingInitialSeekRef: $e, performerSlots: ge, performerSlotsAvailable: Ge, playbackControlsRef: Ae, previewDerivedSegments: at, provenance: ke, provenanceSources: De, publishApprovedCancelButtonRef: He, publishApprovedDrafts: je, publishApprovedError: Ne, publishApprovedOpen: Te, quickSearchOpen: Ke, railScrollRef: it, railToggleRef: Je, recordHistoryAction: Ye, rejectedDeletionPreview: pt, removeIncorrectExample: jt, removingExampleId: En, restoreHistoryTarget: Xt, saveMessage: Dn, saveTag: Mt, saveTiming: lr, savingSegmentId: ft, seekRef: ht, segmentGroups: Bt, segmentRailLayout: At, segments: Nt, selectAllVideoSegments: dr, selectSegment: vt, selectSegmentCollection: cr, selectedGroups: en, selectedPerformerSlots: tn, selectedSegment: xt, selectedSegmentGroupKey: nn, selectedSegmentIds: Gt, selectedSegments: On, selectedSlotStatus: rn, setAutoAssignError: Rt, setAutoAssignOpen: Kt, setConfiguringTag: on, setCurrentTime: ur, setEditorFilters: Pn, setEditorLayout: mr, setFiltersOpen: an, setHideDerivedSegments: sn, setHistoryOpen: ln, setIncorrectExamplesOpen: Et, setQuickSearchOpen: Ln, setRailViewport: Fn, setRejectedDeletionPreview: dn, setSaveMessage: cn, setSavingSegmentId: un, setSelectedSegmentGroupKey: tt, setSelectedSegmentId: jn, setShortcutsOpen: Ut, setTimelineZoom: Bn, shotBoundaries: Gn, shortcutsOpen: mn, slotButtonRef: gn, splitLayout: St, splitSegment: gr, startFullAnalysis: Kn, tagEditing: pn, tagSearchRef: fn, timelineDuration: yn, timelineRatioBounds: _e, timelineZoom: Ze, toggleSegmentGroup: Un, toggleSegmentRail: pr, updateTimelineRatio: yt, video: Ue, videoPerformers: zn, visibleCounts: bn, visibleSegmentRailRows: hn, visibleSegments: zt, wideLayout: It, workspaceRef: fr } = e, vn = Be(
    () => Nt.filter((z) => !z.published && z.reviewState === "approved"),
    [Nt]
  ), yr = Di(jr), xn = vn.length, ct = te ? te.createCount + te.linkCount : null;
  function br(z) {
    const Fe = Gt.includes(z.id), ze = z.id === (xt == null ? void 0 : xt.id), ae = z.endSec == null ? Ie(z.startSec) : `${Ie(z.startSec)} – ${Ie(z.endSec)}`, st = `${gt(z.sourceKey)}${z.confidence != null ? ` · ${Math.round(z.confidence * 100)}%` : ""}`;
    return n("button", {
      key: z.id,
      type: "button",
      onClick: (qt) => vt(z, { additive: qt.metaKey || qt.ctrlKey }),
      "aria-pressed": Fe,
      "aria-current": ze ? "true" : void 0,
      "data-selected-segment-shortcut-target": ze ? "true" : void 0,
      "aria-label": R ? `${z.tagName || "Tag segment"}, ${z.reviewState}${z.isDerived ? ", derived segment" : ""}, ${ae}` : `${z.tagName || "Tag segment"}${z.isDerived ? ", derived segment" : ""}, ${ae}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Ea(Fe, ze)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        R ? n(Ft, { key: "review", state: z.reviewState, includeLabel: !1 }) : null,
        z.isDerived ? n(sr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          z.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ae),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: st
        }, st)
      ])
    ]);
  }
  const _t = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", Ht = [...B.actions || []].reverse().find((z) => z.sequence <= B.cursorSequence);
  return n("section", {
    ref: F,
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
            onClick: (z) => Ua(z, be, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ue.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ue.title || `Video ${Ue.id}`
          }, Ue.title || `Video ${Ue.id}`)),
          ...zn.map((z) => n(Tn, {
            key: Ve(z),
            performer: { id: Ve(z), name: z.name },
            compact: !0,
            tooltip: z.name
          })),
          R ? n($t, { key: "review-counts", counts: bn }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          R ? null : n(_a, { key: "bin", onNavigate: be, compact: !0 }),
          n(Ha, { key: "settings", onNavigate: be, compact: !0 })
        ])
      ]),
      R && D.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${D.nativeImportCount} Cove segment${D.nativeImportCount === 1 ? "" : "s"} ${D.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        me.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, me.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => Se("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => Se("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        me.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, me.error) : null
      ]) : null,
      o && (a == null ? void 0 : a.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, o) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          R ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
              onClick: () => Kn(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (z) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && z.preventDefault();
                },
                onKeyDown: (z) => {
                  (z.key === "Enter" || z.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && z.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Oi, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([z, Fe]) => n("button", {
                key: z,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (ze) => {
                  var ae;
                  (ae = ze.currentTarget.closest("details")) == null || ae.removeAttribute("open"), Kn(Fe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, z)))
            ])
          ]) : null,
          R ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ft != null || l.length === 0,
            onClick: () => {
              Rt(""), Kt(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          R ? n("button", {
            key: "materialize-derived",
            ref: E,
            type: "button",
            disabled: ft != null || le || xe || ct === 0,
            onClick: at,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, le ? "Analyzing…" : `Auto-Materialize${ct != null ? ` (${ct})` : ""}`) : null,
          R ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ft != null || xn === 0,
            onClick: (z) => ve(z.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Te,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${xn ? ` (${xn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: re || En != null || h.length === 0,
            onClick: () => Et(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": K,
            "aria-label": `Open AI feedback collection, ${h.length} example${h.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${h.length ? ` (${h.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ee,
            type: "button",
            onClick: () => an(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": we,
            className: `${_t} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(Jn, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Ut(!0),
            className: _t
          }, [n(Jn, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (R ? B.actions.length === 0 : Ht == null) || ft != null || Me,
            onClick: R ? () => ln((z) => !z) : () => Xt(
              Ht.sequence - 1
            ),
            "aria-haspopup": R ? "dialog" : void 0,
            "aria-expanded": R ? ue : void 0,
            className: _t
          }, [
            n(Jn, { key: "icon", name: "history" }),
            n("span", { key: "label" }, R ? `History${B.actions.length ? ` (${B.actions.length})` : ""}` : Ht ? `Undo ${Ht.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Je,
            type: "button",
            onClick: pr,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": C.markerRailOpen,
            className: _t
          }, [
            n(Jn, { key: "icon", name: "list" }),
            n("span", { key: "label" }, C.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    R && ue ? n("section", {
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
          onClick: () => ln(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...B.actions].reverse().map((z) => n("button", {
          key: z.sequence,
          type: "button",
          disabled: Me,
          onClick: () => Xt(z.sequence),
          "aria-current": B.cursorSequence === z.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${z.sequence > B.cursorSequence ? "text-secondary" : "text-foreground"} ${B.cursorSequence === z.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, z.label),
          n("time", {
            key: "time",
            dateTime: z.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(z.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: Me,
          onClick: () => Xt(B.baselineSequence),
          "aria-current": B.cursorSequence === B.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${B.cursorSequence === B.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    we ? n(td, {
      key: "editor-filters",
      filters: I,
      hideDerivedSegments: ie,
      performers: zn,
      provenanceSources: De,
      reviewCounts: s,
      segments: Nt,
      segmentGroups: Bt,
      reviewMode: R,
      onChange: Pn,
      onHideDerivedChange: sn,
      onClose: p
    }) : null,
    ce ? n(ed, {
      key: "first-segment-tag-dialog",
      saving: ft != null,
      error: Dn,
      onSelect: (z, Fe) => A(z, Fe),
      onClose: b
    }) : null,
    Ke ? n(od, {
      key: "quick-search-dialog",
      segments: Us(r),
      onSelect: (z) => {
        Ln(!1), vt(z, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Ln(!1), requestAnimationFrame(() => {
          var z;
          return (z = F.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(sd, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Kt(!1)
    }) : null,
    J ? n(dd, {
      key: "merge-selection-dialog",
      merge: J,
      processing: L.current,
      undoable: !R,
      cancelButtonRef: X,
      onConfirm: (z) => ne(!0, z, J),
      onClose: w
    }) : null,
    se ? n(ud, {
      key: "materialize-derived-dialog",
      preview: te,
      loading: le,
      processing: xe,
      error: H,
      cancelButtonRef: S,
      onConfirm: k,
      onClose: () => {
        xe || f();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: fr,
      className: `${St ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      C.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: It ? { position: "absolute", top: 0, right: 0, width: x, height: Y.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Nt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : zt.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: it,
          onScroll: (z) => Fn({
            scrollTop: z.currentTarget.scrollTop,
            height: z.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: At.height }
        }, hn.map((z) => {
          var ze;
          let Fe;
          if (z.kind === "group") {
            const ae = W.includes(z.group.key), st = z.group.lanes.reduce((qt, _n) => qt + _n.markers.length, 0);
            Fe = n("button", {
              type: "button",
              onClick: () => {
                tt(z.group.key), Un(z.group.key);
              },
              "aria-expanded": !ae,
              "aria-current": nn === z.group.key ? "true" : void 0,
              "data-segment-rail-group": z.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${nn === z.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ae ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: z.group.name }, z.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, st),
              R && ae ? n($t, { key: "states", counts: z.group.counts }) : null
            ]);
          } else z.kind === "lane" ? Fe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: $n(z.lane),
            "aria-label": $n(z.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, z.lane.label),
            (ze = z.lane.performers) != null && ze.length ? n(ir, {
              key: "performers",
              performers: z.lane.performers,
              performerAssignments: z.lane.performerAssignments
            }) : null,
            R ? n($t, { key: "states", counts: z.lane.counts }) : null
          ]) : Fe = br(z.segment);
          return n("div", {
            key: z.key,
            className: "absolute left-0 right-0",
            style: { top: z.top, height: z.height }
          }, Fe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${St ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: q,
          className: `${St ? "min-h-0 flex-1" : ""} grid`,
          style: St ? {
            gridTemplateRows: `minmax(16rem, ${(1 - C.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${C.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: T,
            className: "grid min-h-0 gap-2",
            style: It ? {
              gridTemplateColumns: C.markerRailOpen ? `${P}px 0.5rem minmax(0,1fr) 0.5rem ${x}px` : `${P}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(md, {
              key: "tools",
              compatibilityMode: R,
              selectedSegment: xt,
              selectedSegments: On,
              selectedGroups: en,
              saveMessage: Dn,
              savingSegmentId: ft,
              setSavingSegmentId: un,
              setSaveMessage: cn,
              saveTag: Mt,
              slotStatus: rn,
              performerSlotsAvailable: Ge,
              selectedPerformerSlots: tn,
              performerSlots: ge,
              detail: D,
              onDetailChange: he,
              video: Ue,
              slotButtonRef: gn,
              tagSearchRef: fn,
              tagEditing: pn,
              onCancelTagEditing: N,
              detailPanelRef: U,
              onReduceSelection: (z) => {
                vt(z), requestAnimationFrame(() => {
                  var Fe;
                  return (Fe = U.current) == null ? void 0 : Fe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: lr,
              onSlotsChanged: Pe,
              onRecordHistory: Ye,
              splitSegment: gr,
              duplicateSegment: V,
              provenance: ke,
              lineage: M,
              onNavigateLineageItem: (z) => {
                const Fe = Nt.find((ze) => ze.itemId === z);
                Fe && jn(Fe.id);
              }
            }),
            It ? n(
              "div",
              { key: "detail-separator", ...Ce("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ue.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Xo, {
                streamUrl: `/api/stream/video/${Ue.id}`,
                posterUrl: `/api/stream/video/${Ue.id}/screenshot?v=${encodeURIComponent(Ue.updatedAt || "")}`,
                format: Ue.videoFile.format,
                audioCodec: Ue.videoFile.audioCodec,
                duration: Ue.videoFile.duration,
                videoId: Ue.id,
                trackingEnabled: !1,
                onSeekRegister: (z) => {
                  ht.current = z, js($e.current, Nt, z) && ($e.current = null);
                },
                onPlaybackControlRegister: (z) => {
                  Ae.current = z;
                },
                onTimeUpdate: ur
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            It && C.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...Ce("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            It && C.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          St ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(_e.minimum * 100),
            "aria-valuemax": Math.round(_e.maximum * 100),
            "aria-valuenow": Math.round(C.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(C.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: oe,
            onPointerMove: fe,
            onKeyDown: Q,
            onDoubleClick: () => yt(rt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: St ? void 0 : { height: "20rem" } }, n(gd, {
            segments: zt,
            shotBoundaries: Gn,
            segmentGroups: Bt,
            performerSlots: ge,
            collapsedGroupKeys: W,
            selectedGroupKey: nn,
            selectedSegmentId: xt == null ? void 0 : xt.id,
            selectedSegmentIds: Gt,
            duration: yn,
            currentTime: $,
            zoom: Ze,
            onZoomChange: Bn,
            onSelectGroup: tt,
            onToggleGroup: Un,
            onSelect: (z, Fe) => vt(z, Fe),
            onSelectSegments: cr,
            onSelectAll: dr,
            onConfigureTag: (z) => on(z),
            onSeekTime: (z) => {
              var Fe;
              return (Fe = ht.current) == null ? void 0 : Fe.call(ht, z, !1);
            },
            centerRef: y,
            showReviewState: R,
            swimlaneTitleWidth: C.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (z) => mr((Fe) => ({ ...Fe, swimlaneTitleWidth: z }))
          }))
        ])
      ])
    ]),
    _ ? n(Vr, {
      key: `configure-tag:${_.tagId}`,
      tagId: _.tagId,
      tagName: _.tagName,
      performerSlotsEnabled: R,
      onSaved: Ee,
      onClose: () => {
        const z = _.trigger;
        on(null), requestAnimationFrame(() => {
          var Fe;
          z != null && z.isConnected ? z.focus({ preventScroll: !0 }) : (Fe = F.current) == null || Fe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Te ? n(id, {
      key: "publish-approved-dialog",
      drafts: vn,
      processing: ft === -1,
      error: Ne,
      cancelButtonRef: He,
      onConfirm: je,
      onClose: v
    }) : null,
    pt ? n(ld, {
      key: "rejected-deletion-dialog",
      preview: pt,
      onConfirm: () => O(pt),
      onClose: () => {
        dn(null), requestAnimationFrame(() => {
          var z;
          return (z = F.current) == null ? void 0 : z.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    mn ? n(nd, {
      key: "shortcuts-dialog",
      reviewMode: R,
      bindings: yr,
      onClose: () => Ut(!1)
    }) : null,
    K ? n(rd, {
      key: "incorrect-examples-dialog",
      examples: h,
      exporting: re,
      removingExampleId: En,
      onExport: u,
      onRemove: jt,
      onClose: () => Et(!1)
    }) : null
  ]);
}
function fd(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: y, setSaveMessage: p, setSelectedSegmentGroupKey: b, setSelectedSegmentId: f, setSelectedSegmentIds: w } = e;
  function v(A) {
    const $ = ut(t, A);
    $ && m((O) => Ga(O, $));
  }
  function N(A) {
    f(A), w(A == null ? [] : [A]), c.current = A, g.current = [];
  }
  function W(A, {
    focusEditor: $ = !1,
    seekToSegment: O = !1,
    additive: D = !1,
    rangeSegmentIds: U = null
  } = {}) {
    var V, I;
    const P = ss({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, A.id, U, D);
    w(P.selectedSegmentIds), f(P.activeSegmentId), c.current = P.anchorSegmentId, g.current = P.rangeBaseSegmentIds, P.activeSegmentId != null && b(ut(t, P.activeSegmentId)), v(A.id), $ && ((V = r.current) == null || V.focus({ preventScroll: !0 })), O && ((I = i.current) == null || I.call(i, A.startSec, !1));
  }
  function R(A) {
    const $ = as(
      d,
      l,
      A
    );
    w($.selectedSegmentIds), f($.activeSegmentId), c.current = $.activeSegmentId, g.current = [], $.activeSegmentId != null && (b(ut(t, $.activeSegmentId)), v($.activeSegmentId));
  }
  function _() {
    var O;
    const A = ds(s), $ = A.includes(l) ? l : A[0] ?? null;
    u(dt({})), y(!1), w(A), f($), c.current = $, g.current = [], $ != null && b(ut(
      Pt(s, a, o),
      $
    )), p(A.length === 0 ? "There are no segments to select." : `${A.length} segments selected. Collapsed Segment groups keep their selected segments.`), (O = r.current) == null || O.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: v, replaceSegmentSelection: N, selectSegment: W, selectSegmentCollection: R, selectAllVideoSegments: _ };
}
function yd(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, recordHistoryAction: g, revealSegmentGroupForSelection: m, reviewSavingRef: u, savingSegmentId: y, selectedGroups: p, selectedSegment: b, selectedSegmentIdRef: f, selectedSegments: w, selectionAnchorIdRef: v, selectionRangeBaseIdsRef: N, setMergeConfirmation: W, setSaveMessage: R, setSavingSegmentId: _, setSelectedSegmentId: A, setSelectedSegmentIds: $, video: O } = e;
  function D() {
    W(null), requestAnimationFrame(() => {
      var V;
      return (V = i.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function U(V = !1, I = !1, C = null) {
    if (s.current || y != null) return;
    const F = C || ja(
      p,
      { nativeOnly: !r }
    );
    if (!F) {
      R("Select at least two segments from one swimlane.");
      return;
    }
    if (!V && pa()) {
      W(F);
      return;
    }
    I && fa(!1), D();
    const re = F.endSec == null ? "open end" : Ie(F.endSec);
    s.current = !0;
    let ee = F.segments[0];
    const we = r ? null : lt(F.segments, !1), ce = r ? null : crypto.randomUUID(), T = F.segments.map((oe) => oe.id), Q = Rl(o, F.segments);
    _(ee.id), d(Q, O.id), $([ee.id]), A(ee.id), v.current = ee.id, N.current = [];
    try {
      const oe = F.segments.slice(1);
      if (!r || ee.nativeSegmentId != null) {
        const fe = oe.map((B) => {
          const ue = `merge-native-selection:${O.id}:${ee.id}:${B.id}:${ee.updatedAt}:${B.updatedAt}`;
          return { key: ue, operationId: Re(ue), segmentId: B.id, expectedUpdatedAt: B.updatedAt };
        }), ie = await Z(`/videos/${O.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: ee.id,
            expectedSurvivorUpdatedAt: ee.updatedAt,
            consumedSegments: fe.map(({ key: B, ...ue }) => ue),
            historyReceiptId: ce
          })
        });
        ee = ie.survivor, d(Lo(o, ie), O.id), fe.forEach(({ key: B }) => Oe(B));
      } else {
        const fe = oe.map((B) => {
          const ue = `merge-draft-selection:${O.id}:${ee.itemId}:${B.itemId}:${ee.revision}:${B.revision}`;
          return { key: ue, operationId: Re(ue), itemId: B.itemId, expectedRevision: B.revision };
        }), ie = await Z(`/videos/${O.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: ee.itemId,
            expectedSurvivorRevision: ee.revision,
            consumedDrafts: fe.map(({ key: B, ...ue }) => ue)
          })
        });
        ee = ie.survivor, d(Lo(o, ie), O.id), fe.forEach(({ key: B }) => Oe(B));
      }
      $([ee.id]), A(ee.id), v.current = ee.id, N.current = [], r ? t(kt) : await g(
        "segments.merge",
        `Merged ${F.segments.length} segments`,
        we,
        lt([ee], !1),
        ce
      ), m(ee.id), R(`${F.segments.length} segments merged into ${Ie(F.startSec)} – ${re}.`);
    } catch (oe) {
      d((fe) => Ka(
        Mn(fe, [F.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        F.segments.slice(1)
      ), O.id), $(T), A((b == null ? void 0 : b.id) ?? T[0] ?? null), v.current = (b == null ? void 0 : b.id) ?? T[0] ?? null, N.current = [], oe.status === 409 ? await l() : R(oe.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, _(null);
    }
  }
  async function P(V) {
    var ce;
    if (w.length === 0 || u.current || y != null) return;
    const I = ks(w, V), C = w.filter((T) => T.reviewState !== I);
    if (C.length === 0) return;
    const F = w.map((T) => ({
      id: T.id,
      itemId: T.itemId,
      nativeSegmentId: T.nativeSegmentId
    })), re = F.find((T) => T.id === (b == null ? void 0 : b.id)) || F[0], ee = (T, Q = !1) => {
      if (!(T != null && T.segments) || !Q && !Rr(f.current, re.id))
        return;
      const oe = F.map((ie) => We(T == null ? void 0 : T.segments, ie)).filter(Boolean), fe = We(T == null ? void 0 : T.segments, re) || oe[0] || null;
      $(oe.map((ie) => ie.id)), A((fe == null ? void 0 : fe.id) ?? null), v.current = (fe == null ? void 0 : fe.id) ?? null, N.current = [];
    };
    u.current = !0, _((b == null ? void 0 : b.id) ?? C[0].id), R(`Updating ${C.length} selected segment${C.length === 1 ? "" : "s"}…`);
    const we = rr(
      o,
      C.map((T) => T.id),
      { reviewState: I }
    );
    d(we, O.id);
    try {
      const T = await Z(`/videos/${O.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: I,
          segments: w.map((ie) => ie.published ? {
            nativeSegmentId: ie.nativeSegmentId,
            expectedUpdatedAt: ie.updatedAt
          } : {
            itemId: ie.itemId,
            expectedRevision: ie.revision
          })
        })
      }), Q = new Map((T.items || []).map((ie) => [
        ie.requestedNativeSegmentId != null ? `native:${ie.requestedNativeSegmentId}` : `item:${ie.requestedItemId}`,
        ie
      ]));
      if (F.forEach((ie) => {
        const B = Q.get(ie.nativeSegmentId != null ? `native:${ie.nativeSegmentId}` : `item:${ie.itemId}`);
        B && (ie.nativeSegmentId = B.nativeSegmentId, ie.itemId = B.itemId);
      }), T.history && t(T.history), I === "rejected" || (T.items || []).some((ie) => ie.requestedNativeSegmentId != null && ie.nativeSegmentId !== ie.requestedNativeSegmentId)) {
        ee(await c()), R(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${I === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const fe = {
        ...o,
        approvedSetVersion: T.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((ie) => {
          const B = Q.get(ie.nativeSegmentId != null ? `native:${ie.nativeSegmentId}` : `item:${ie.itemId}`);
          return B ? {
            ...ie,
            id: B.nativeSegmentId != null ? B.nativeSegmentId : -B.itemId,
            itemId: B.itemId,
            nativeSegmentId: B.nativeSegmentId,
            published: B.nativeSegmentId != null,
            reviewState: I,
            revision: B.nativeSegmentId != null ? ie.revision : B.revision,
            updatedAt: B.updatedAt
          } : ie;
        })
      };
      d(fe, O.id), ee(fe), R(`${T.updatedCount} selected segment${T.updatedCount === 1 ? "" : "s"} ${I === "approved" ? "approved" : I === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (T) {
      d((oe) => Mn(
        oe,
        C,
        ["reviewState"]
      ), O.id), T.status === 409 && ((ce = T.payload) != null && ce.currentHistory) && t(T.payload.currentHistory);
      const Q = T.status === 409 ? await l() : o;
      ee(Q, !0), R(T.message || "Unable to update the selected segments.");
    } finally {
      u.current = !1, _(null);
    }
  }
  return { closeMergeConfirmation: D, mergeSelectedSwimlane: U, saveSelectedReviewState: P };
}
function bd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: y, materializeButtonRef: p, materializePreview: b, materializeRestoreFocusRef: f, materializing: w, mutateSegment: v, onConflict: N, onDetailChange: W, onReload: R, recordHistoryAction: _, refreshMaterializationPreview: A, removingExampleId: $, revealSegmentGroupForSelection: O, savingSegmentId: D, segments: U, selectedSegment: P, selectedSegmentIdRef: V, selectedSegments: I, selectionAnchorIdRef: C, selectionRangeBaseIdsRef: F, setAutoAssignError: re, setAutoAssignOpen: ee, setAutoAssigning: we, setExportingExamples: ce, setIncorrectExamples: T, setMaterializeError: Q, setMaterializeLoading: oe, setMaterializeOpen: fe, setMaterializePreview: ie, setMaterializing: B, setRejectedDeletionPreview: ue, setRemovingExampleId: Me, setSaveMessage: Y, setSavingSegmentId: Se, setSelectedSegmentGroupKey: h, setSelectedSegmentId: K, setSelectedSegmentIds: M, video: x } = e;
  async function E() {
    var ve, Ce, $e;
    if (I.length === 0 || !P || D != null) return;
    const L = Il(I, u), ne = L.segments;
    if (ne.length === 0) return;
    const me = I.map((ge) => ({
      id: ge.id,
      itemId: ge.itemId,
      nativeSegmentId: ge.nativeSegmentId
    })), he = me.find((ge) => ge.id === P.id) || me[0], be = [], Ee = [];
    let Pe = c;
    Se(he.id), Y(L.action === "remove" ? `Removing ${ne.length} selected incorrect example${ne.length === 1 ? "" : "s"}…` : `Collecting ${ne.length} selected segment${ne.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const ge = async (Ne, Te) => {
        const Ke = Ne.nativeSegmentId != null, it = L.action === "remove" ? `incorrect-example-remove:${x.id}:${Te == null ? void 0 : Te.id}:${Te == null ? void 0 : Te.revision}:${Te == null ? void 0 : Te.representationRevision}` : `incorrect-example-collect:${x.id}:${Ke ? `native:${Ne.nativeSegmentId}:${Ne.updatedAt}` : `item:${Ne.itemId}:${Ne.revision}`}`;
        if (L.action === "remove" && !Te)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Je;
        try {
          Je = L.action === "remove" ? await Z(
            `/videos/${x.id}/incorrect-examples/${Te.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Re(it),
                expectedExampleRevision: Te.revision,
                expectedRepresentationRevision: Te.representationRevision
              })
            }
          ) : await Z(`/videos/${x.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(it),
              nativeSegmentId: Ke ? Ne.nativeSegmentId : null,
              itemId: Ke ? null : Ne.itemId,
              expectedUpdatedAt: Ke ? Ne.updatedAt : null,
              expectedRevision: Ke ? null : Ne.revision
            })
          });
        } catch (Ye) {
          throw Ye.operationKey = it, Ye;
        }
        if (!Cl(L.action, Je))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Oe(it), Je;
      };
      for (const Ne of ne) {
        const Te = L.action === "remove" ? u.find((Ke) => Ke.itemId != null && Ke.itemId === Ne.itemId) : null;
        try {
          const Ke = me.find((Ye) => Ye.id === Ne.id);
          let it = We(
            Pe == null ? void 0 : Pe.segments,
            Ke
          ) || Ne, Je;
          try {
            Je = await ge(it, Te);
          } catch (Ye) {
            if (Ye.status === 409 && ((Ce = (ve = Ye.payload) == null ? void 0 : ve.result) == null ? void 0 : Ce.code) === "OPERATION_REPLAYED")
              Pe = await Z(
                `/videos/${x.id}/editor`
              ), Oe(Ye.operationKey), Je = Ye.payload.result;
            else {
              if (L.action !== "collect" || Ye.status !== 409) throw Ye;
              const pt = await Z(
                `/videos/${x.id}/editor`
              );
              Pe = pt;
              const jt = We(
                pt == null ? void 0 : pt.segments,
                Ke
              );
              if (!jt) throw Ye;
              it = jt, Je = await ge(it, null);
            }
          }
          Ke && Je.itemId != null && (Ke.itemId = Je.itemId), Pe = jo(
            Pe,
            Je.editorDelta
          ), be.push({ segment: Ne, result: Je });
        } catch (Ke) {
          if (Ee.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
        }
      }
      be.some(({ result: Ne }) => Ne.representation === "basicNativeBin") && Nn();
      const Ge = Rr(
        V.current,
        he.id
      ), Ae = L.action === "collect" && be.some(({ segment: Ne }) => Ne.id === he.id), at = be.map(({ segment: Ne }) => Ne.id), ke = Ae ? us(
        r,
        at,
        he.id
      ) : null, De = Ae ? (ke == null ? void 0 : ke.id) ?? null : he.id;
      Ge && Ae && (M(ke ? [ke.id] : []), K((ke == null ? void 0 : ke.id) ?? er), C.current = (ke == null ? void 0 : ke.id) ?? null, F.current = []);
      const He = await Z(`/videos/${x.id}/incorrect-examples`);
      T(He);
      const je = Pe;
      if (W(je, x.id), Ge && Rr(
        V.current,
        De
      )) {
        let Ne, Te;
        Ae ? (Te = ke ? We(je == null ? void 0 : je.segments, {
          id: ke.id,
          itemId: ke.itemId,
          nativeSegmentId: ke.nativeSegmentId
        }) : null, Ne = Te ? [Te] : []) : (Ne = me.map((Ke) => We(je == null ? void 0 : je.segments, Ke)).filter(Boolean), Te = We(je == null ? void 0 : je.segments, he) || Ne[0] || null), M(Ne.map((Ke) => Ke.id)), K((Te == null ? void 0 : Te.id) ?? (Ae ? er : null)), C.current = (Te == null ? void 0 : Te.id) ?? null, F.current = [], h(Te ? ut(r, Te.id) : null), Te && O(Te.id);
      }
      if (Ee.length > 0) {
        const Ne = (($e = Ee[0]) == null ? void 0 : $e.message) || "Only segments with registered AI provenance can be collected.";
        be.length === 0 ? Y(Ne) : L.action === "remove" ? Y(
          `Partially removed ${be.length} of ${ne.length} selected incorrect examples. ${Ne}`
        ) : Y(
          `Partially collected ${be.length} of ${ne.length} selected segments. ${Ne}`
        );
      } else if (L.action === "remove")
        Y(
          `${be.length} incorrect example${be.length === 1 ? "" : "s"} removed and ${be.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Ne = be.filter(({ result: Te }) => Te.representation === "basicNativeBin").length;
        Y(Ne === be.length ? `${be.length} incorrect AI example${be.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${be.length} incorrect AI example${be.length === 1 ? "" : "s"} collected and ${be.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
    } catch (ge) {
      Y(ge.message || "Unable to update the selected incorrect examples.");
    } finally {
      Se(null);
    }
  }
  async function S(L) {
    var me, he;
    if (!L || $ != null || m) return;
    Me(L.id);
    const ne = `incorrect-example-remove:${x.id}:${L.id}:${L.revision}:${L.representationRevision}`;
    try {
      const be = await Z(
        `/videos/${x.id}/incorrect-examples/${L.id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(ne),
            expectedExampleRevision: L.revision,
            expectedRepresentationRevision: L.representationRevision
          })
        }
      );
      Oe(ne);
      const Ee = await Z(
        `/videos/${x.id}/incorrect-examples`
      );
      T(Ee), W(
        jo(c, be.editorDelta),
        x.id
      ), L.representation === "basicNativeBin" && Nn(), Y(L.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed.");
    } catch (be) {
      if (be.status === 409 && ((he = (me = be.payload) == null ? void 0 : me.result) == null ? void 0 : he.code) === "OPERATION_REPLAYED") {
        Oe(ne), T(await Z(
          `/videos/${x.id}/incorrect-examples`
        )), await R(), Y("Incorrect example removal was already applied.");
        return;
      }
      be.status === 409 && await N(), Y(be.message || "Unable to remove the incorrect example.");
    } finally {
      Me(null);
    }
  }
  async function k() {
    if (m || $ != null || u.length === 0) return;
    ce(!0);
    const L = `incorrect-example-export:${x.id}:${u.map((ne) => `${ne.id}:${ne.revision}:${ne.representationRevision}`).join(",")}`;
    try {
      const ne = await Tl(
        x.id,
        u
      ), me = new FormData();
      me.append("metadata", JSON.stringify({
        operationId: Re(L),
        examples: ne.captures
      }));
      for (const Ce of ne.files)
        me.append(Ce.fieldName, Ce.file);
      const he = await Z(
        `/videos/${x.id}/incorrect-examples/export`,
        { method: "POST", body: me }
      ), be = await qs(he.downloadUrl), Ee = URL.createObjectURL(be.blob), Pe = document.createElement("a");
      Pe.href = Ee, Pe.download = be.fileName, Pe.click(), setTimeout(() => URL.revokeObjectURL(Ee), 1e3);
      const ve = await Z(
        `/training-exports/${he.id}/complete`,
        { method: "POST" }
      );
      Oe(L), T(await Z(
        `/videos/${x.id}/incorrect-examples`
      )), Y(
        `Downloaded ${he.exampleCount} incorrect example${he.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${ve.clearedExampleCount} from the working collection.`
      );
    } catch (ne) {
      Y(ne.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ce(!1);
    }
  }
  async function H(L = null) {
    const ne = U.filter(($e) => $e.reviewState === "rejected"), me = ne.length, he = u.some(($e) => $e.representation === "fullItem");
    if (L == null && me === 0 && !he) {
      Y("There are no rejected segments to delete.");
      return;
    }
    if (L == null) {
      Se(-1), Y("Preparing deletion summary…");
      try {
        const $e = await Z(`/videos/${x.id}/rejected/deletion/preview`, { method: "POST" }), ge = Number($e.deletedSegmentCount) || 0, Ge = Number($e.deferredRejectedSegmentCount) || 0, Ae = Number($e.protectedIncorrectExampleCount) || 0;
        if (ge === 0) {
          Ge > 0 ? Y(
            `${Ge} feedback-protected rejected segment${Ge === 1 ? "" : "s"} kept. ${Ae} AI feedback example${Ae === 1 ? "" : "s"} must be exported before ${Ge === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : Y("There are no rejected segments to delete.");
          return;
        }
        if (!Ta($e, Y)) return;
        ue($e), Y("");
      } catch ($e) {
        Y($e.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Se(null);
      }
      return;
    }
    const be = L, Ee = Number(be.deferredRejectedSegmentCount) || 0, Pe = V.current, ve = Ee === 0 ? Pr(c, ne.map(($e) => $e.id)) : c, Ce = ve.segments.find(($e) => $e.reviewState === "unreviewed") || ve.segments[0] || null;
    ue(null), Se(-1), Y("Deleting rejected segments…"), Ee === 0 && (W(ve, x.id), M(Ce ? [Ce.id] : []), K((Ce == null ? void 0 : Ce.id) ?? null), C.current = (Ce == null ? void 0 : Ce.id) ?? null, F.current = []);
    try {
      const $e = `rejected-dependency-delete:${x.id}:${be.fingerprint}`, ge = await Z(`/videos/${x.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re($e),
          fingerprint: be.fingerprint
        })
      });
      Oe($e), await R(), ge.deletedSegmentCount > 0 && t(kt);
      const Ge = Ee > 0 ? ` ${Ee} feedback-protected rejected segment${Ee === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      Y(`${ge.deletedSegmentCount} segment${ge.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Ge}`);
    } catch ($e) {
      Ee === 0 && W((ge) => Ka(
        ge,
        ne
      ), x.id), M(Pe == null ? [] : [Pe]), K(Pe), C.current = Pe, F.current = [], Y($e.message || "Unable to delete rejected segments.");
    } finally {
      Se(null);
    }
  }
  async function le(L = o) {
    if (!(i || L.length === 0)) {
      we(!0), re("");
      try {
        const ne = await Z(`/videos/${x.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: L.flatMap((me) => me.nativeSegmentId == null ? [] : [me.nativeSegmentId]),
            itemIds: L.flatMap((me) => me.published || me.itemId == null ? [] : [me.itemId])
          })
        });
        ee(!1), await R(), Y(`${ne.assignedSegmentCount} segment${ne.assignedSegmentCount === 1 ? "" : "s"} received ${ne.assignedSlotCount} performer-slot assignment${ne.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (ne) {
        re(ne.message || "Unable to auto-assign performers.");
      } finally {
        we(!1);
      }
    }
  }
  async function se() {
    fe(!0), Q(""), !b && (oe(!0), A());
  }
  function te() {
    f.current = !0, fe(!1), requestAnimationFrame(() => {
      var L;
      return (L = p.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    });
  }
  async function xe() {
    if (!b || w || b.createCount + b.linkCount === 0)
      return;
    B(!0), Q("");
    let L;
    try {
      const ne = `materialize-derived:${x.id}:${b.fingerprint}`;
      L = await Z(`/videos/${x.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(ne),
          fingerprint: b.fingerprint,
          maxDepth: 3
        })
      }), Oe(ne);
    } catch (ne) {
      ne.status === 409 && ie(null), Q(ne.message || "Unable to materialize derived segments."), B(!1);
      return;
    }
    ie((ne) => ne && { ...ne, createCount: 0, linkCount: 0 });
    try {
      await R(), te(), ie(null);
      const ne = L.createdCount + L.linkedCount;
      Y(`${L.createdCount} derived segment${L.createdCount === 1 ? "" : "s"} created and ${L.linkedCount} existing segment${L.linkedCount === 1 ? "" : "s"} linked.`), ne === 0 && Y("Every applicable derivation was already materialized.");
    } catch {
      Q("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    B(!1);
  }
  async function q(L, ne = null) {
    var he, be, Ee, Pe;
    const me = {
      tagId: L,
      ...ne ? { tagName: ne } : {}
    };
    if (I.length > 1) {
      const ve = I.filter((Ae) => Ae.tagId !== L);
      if (ve.length === 0) {
        l();
        return;
      }
      const Ce = I.map((Ae) => ({
        id: Ae.id,
        itemId: Ae.itemId,
        nativeSegmentId: Ae.nativeSegmentId
      })), $e = I.map((Ae) => !d || Ae.nativeSegmentId != null ? `native:${Ae.nativeSegmentId}:${Ae.updatedAt}` : `item:${Ae.itemId}:${Ae.revision}`).sort().join(","), ge = `bulk-tag:${x.id}:${L}:${$e}`;
      Se((P == null ? void 0 : P.id) ?? ve[0].id), Y(`Changing tag for ${ve.length} selected segment${ve.length === 1 ? "" : "s"}…`);
      const Ge = rr(
        c,
        ve.map((Ae) => Ae.id),
        me
      );
      W(Ge, x.id), l();
      try {
        const Ae = d ? null : crypto.randomUUID();
        await Z(`/videos/${x.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(ge),
            tagId: L,
            historyReceiptId: Ae,
            segments: I.map((je) => {
              const Ne = !d || je.nativeSegmentId != null;
              return {
                nativeSegmentId: Ne ? je.nativeSegmentId : null,
                itemId: Ne ? null : je.itemId,
                expectedUpdatedAt: Ne ? je.updatedAt : null,
                expectedRevision: Ne ? null : je.revision
              };
            })
          })
        }), Oe(ge);
        const at = lt(
          I,
          d
        ), ke = await R(), De = Ce.map((je) => We(ke == null ? void 0 : ke.segments, je)).filter(Boolean);
        await _(
          "segments.tag",
          `Changed tag for ${ve.length} segment${ve.length === 1 ? "" : "s"}`,
          at,
          lt(De, d),
          Ae
        );
        const He = Ce.map((je) => We(ke == null ? void 0 : ke.segments, je)).filter(Boolean);
        M(He.map((je) => je.id)), K(((he = He.find((je) => je.id === (P == null ? void 0 : P.id))) == null ? void 0 : he.id) ?? ((be = He[0]) == null ? void 0 : be.id) ?? null), l(), Y(`${ve.length} selected segment${ve.length === 1 ? "" : "s"} retagged.`);
      } catch (Ae) {
        W((De) => Mn(
          De,
          ve,
          Object.keys(me)
        ), x.id);
        const at = Ce.map((De) => We(c.segments, De)).filter(Boolean), ke = We(c.segments, {
          id: P == null ? void 0 : P.id,
          itemId: P == null ? void 0 : P.itemId,
          nativeSegmentId: P == null ? void 0 : P.nativeSegmentId
        }) || at[0] || null;
        M(at.map((De) => De.id)), K((ke == null ? void 0 : ke.id) ?? null), C.current = (ke == null ? void 0 : ke.id) ?? null, F.current = [], Ae.status === 409 && await N(), Y(Ae.message || "Unable to change the selected segment tags.");
      } finally {
        Se(null);
      }
      return;
    }
    if (!(I.length !== 1 || !P)) {
      if (L === P.tagId) {
        l();
        return;
      }
      if (P.itemId != null && ((Pe = (Ee = y.data) == null ? void 0 : Ee.children) == null ? void 0 : Pe.length) > 0) {
        Se(P.id), Y("Checking lineage impact…");
        try {
          const ve = await Z(`/items/${P.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: P.revision, tagId: L })
          }), Ce = ve.deletedItemIds.length > 0 || ve.removedEdgeIds.length > 0;
          if (Ce && !window.confirm(
            `Changing this tag removes ${ve.removedEdgeIds.length} lineage edge${ve.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${ve.deletedItemIds.length} derived segment${ve.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            Y("Tag change canceled.");
            return;
          }
          const $e = rr(
            c,
            [P.id],
            me
          );
          W($e, x.id), l();
          const ge = `tag-change:${P.itemId}:${P.revision}:${ve.componentFingerprint}:${L}`;
          await Z(`/items/${P.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(ge),
              expectedRevision: P.revision,
              componentFingerprint: ve.componentFingerprint,
              tagId: L
            })
          }), Oe(ge), await R(), l(), Y(Ce ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (ve) {
          W((Ce) => Mn(
            Ce,
            [P],
            Object.keys(me)
          ), x.id), M([P.id]), K(P.id), C.current = P.id, F.current = [], ve.status === 409 ? (Y("Lineage changed — loading the latest segments…"), await N()) : Y(ve.message || "Unable to reconcile the lineage.");
        } finally {
          Se(null);
        }
        return;
      }
      l(), await v(P, {
        startSec: P.startSec,
        endSec: P.endSec,
        tagId: L
      }, !0, null, !0, me);
    }
  }
  async function X() {
    var Pe, ve, Ce, $e;
    if (!s || !P || D != null) return;
    const L = [...I].sort((ge, Ge) => Number(ge.nativeSegmentId ?? ge.id) - Number(Ge.nativeSegmentId ?? Ge.id)), ne = new Set(L.map((ge) => ge.id)), me = L.map((ge) => `${ge.nativeSegmentId ?? ge.id}:${ge.updatedAt}`).join("|");
    Se(P.id), Y(`Moving ${L.length} segment${L.length === 1 ? "" : "s"} to recycling bin…`);
    const he = `bulk-move:${x.id}:${me}`, be = Re(he), Ee = d ? null : crypto.randomUUID();
    try {
      const ge = (De = !1) => Z(`/videos/${x.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: be,
          segments: L.map((He) => ({
            segmentId: He.nativeSegmentId ?? He.id,
            expectedUpdatedAt: He.updatedAt
          })),
          discardMissingImage: De,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: Ee
        })
      });
      let Ge;
      try {
        Ge = await ge(
          zr(he)
        );
      } catch (De) {
        if (((Pe = De.payload) == null ? void 0 : Pe.code) !== "missing-image" || !window.confirm(`${De.message}

Continue and discard the missing image reference?`)) throw De;
        _r(he), Ge = await ge(!0);
      }
      Oe(he), Nn();
      const Ae = new Map((Ge.items || []).map((De) => [
        Number(De.segmentId),
        De
      ]));
      await _(
        "segments.moveToBin",
        `Moved ${L.length} segment${L.length === 1 ? "" : "s"} to recycling bin`,
        lt(L, !1),
        lt(L.map((De) => {
          const He = Ae.get(
            Number(De.nativeSegmentId ?? De.id)
          );
          return {
            ...De,
            recycleBinItemId: (He == null ? void 0 : He.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (He == null ? void 0 : He.revision) ?? null
          };
        }), !1),
        Ee
      );
      const at = U.filter((De) => !ne.has(De.id)), ke = cs(r, ne, P.id);
      W({ ...c, segments: at }, x.id), M(ke ? [ke.id] : []), K((ke == null ? void 0 : ke.id) ?? null), C.current = (ke == null ? void 0 : ke.id) ?? null, F.current = [], ke && (h(ut(r, ke.id)), O(ke.id)), requestAnimationFrame(() => {
        var De;
        return (De = g.current) == null ? void 0 : De.focus({ preventScroll: !0 });
      }), Y(`Moved ${L.length} segment${L.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (ge) {
      const Ge = ((ve = ge.payload) == null ? void 0 : ve.code) || (($e = (Ce = ge.payload) == null ? void 0 : Ce.result) == null ? void 0 : $e.code);
      ge.status === 409 && Ge === "CANONICAL_SEGMENT_CHANGED" ? await N() : Y(ge.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Se(null);
    }
  }
  async function J() {
    if (!(d || a.current || D != null)) {
      a.current = !0, Y("Checking the recycling bin…");
      try {
        const L = await Z("/bin"), ne = await Aa(L, () => Y("Emptying the recycling bin…"));
        if (ne.status === "empty") {
          Y("The recycling bin is empty.");
          return;
        }
        if (ne.status === "canceled") {
          Y("The recycling bin was not emptied.");
          return;
        }
        Y(`${ne.segmentCount} segment${ne.segmentCount === 1 ? "" : "s"} from ${ne.sceneCount} scene${ne.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (L) {
        Y(L.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: E, removeIncorrectExample: S, captureTrainingExport: k, deleteRejectedSegments: H, autoAssignPerformers: le, previewDerivedSegments: se, closeMaterializeDialog: te, materializeDerivedSegments: xe, saveTag: q, moveToBin: X, emptyRecyclingBin: J };
}
function hd(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: y, onReload: p, railToggleRef: b, recordHistoryAction: f, savingSegmentId: w, savingShot: v, savingShotRef: N, setCollapsedSegmentGroups: W, setEditorLayout: R, setHistorySaving: _, setSaveMessage: A, setSavingSegmentId: $, setSavingShot: O, shotBoundaries: D, timelineDuration: U, video: P, workspaceRef: V } = e;
  async function I(h, K, M) {
    var k, H, le, se;
    const x = h.type === "segment" ? [h] : h.segments || [], E = (K == null ? void 0 : K.type) === "segment" ? [K] : (K == null ? void 0 : K.segments) || [];
    let S = M;
    for (const [te, xe] of x.entries()) {
      const q = E[te], X = ((k = xe.identity) == null ? void 0 : k.nativeSegmentId) != null || ((H = xe.identity) == null ? void 0 : H.published) === !0, J = ((le = q == null ? void 0 : q.identity) == null ? void 0 : le.recycleBinItemId) ?? ((se = q == null ? void 0 : q.identity) == null ? void 0 : se.itemId);
      let L = We(S.segments, q == null ? void 0 : q.identity) || We(S.segments, xe.identity);
      if (!L && X && J != null && q.identity.revision != null) {
        const he = `history-restore:${P.id}:${J}:${q.identity.revision}`;
        await Z(`/bin/${J}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(he),
            expectedRevision: q.identity.revision
          })
        }), Oe(he), S = await p(), L = S.segments.find((be) => be.tagId === xe.values.tagId && be.startSec === xe.values.startSec && be.endSec === xe.values.endSec);
      }
      if (!L)
        throw new Error("A segment in this history state no longer exists.");
      if ((L.nativeSegmentId != null || L.published === !0) !== X) {
        if (X) {
          const he = L.recycleBinItemId ?? L.itemId ?? J;
          if (he == null)
            throw new Error("This recycled segment can no longer be restored.");
          const be = `history-restore:${P.id}:${he}:${L.revision}:${xe.values.reviewState ?? "native"}`;
          await Z(`/bin/${he}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(be),
              expectedRevision: L.revision
            })
          }), Oe(be);
        } else {
          const he = `history-bin:${P.id}:${L.nativeSegmentId}:${L.updatedAt}:${xe.values.reviewState}`;
          await Z(`/videos/${P.id}/segments/${L.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(he),
              expectedUpdatedAt: L.updatedAt,
              reviewState: xe.values.reviewState
            })
          }), Oe(he);
        }
        if (S = await p(), !X)
          continue;
        if (L = We(S.segments, xe.identity) || S.segments.find((he) => he.tagId === xe.values.tagId && he.startSec === xe.values.startSec && he.endSec === xe.values.endSec), !L)
          throw new Error("The restored segment could not be found.");
      }
      const me = xe.values;
      if (L.nativeSegmentId == null && L.itemId != null) {
        const he = `history-draft-update:${P.id}:${L.itemId}:${L.revision}:${me.tagId}:${me.startSec}:${me.endSec ?? "open"}:${me.reviewState}`;
        await Z(`/videos/${P.id}/drafts/${L.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(he),
            expectedRevision: L.revision,
            ...me
          })
        }), Oe(he);
      } else
        await Z(`/videos/${P.id}/segments/${L.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...me, expectedUpdatedAt: L.updatedAt })
        });
      S = await p();
    }
    return S;
  }
  async function C(h, K) {
    var M;
    for (const x of h.targets || []) {
      const E = We(K.segments, x.identity);
      if (!E)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const S = (M = K.performerSlotRevisions) == null ? void 0 : M[E.id];
      await Z(E.published ? `/videos/${P.id}/segments/${E.nativeSegmentId}/slots` : `/videos/${P.id}/drafts/${E.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: S,
          assignments: x.assignments
        })
      }), K = await p();
    }
    return K;
  }
  async function F(h, K, M = []) {
    const x = h.state;
    if (!r && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const S = `basic-history:${P.id}:${d.current.revision}:${h.action.sequence}:${h.direction}`, k = await Z(`/videos/${P.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(S),
          expectedHistoryRevision: d.current.revision,
          actionSequence: h.action.sequence,
          direction: h.direction
        })
      });
      return t(k.history), M.push(S), p();
    }
    const E = h.direction === "backward" ? h.action.afterState : h.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let S = K;
      const k = (E == null ? void 0 : E.type) === "composite" ? E.states || [] : [];
      for (const [H, le] of (x.states || []).entries()) {
        const se = k[H];
        S = await F({
          ...h,
          state: le,
          action: {
            ...h.action,
            beforeState: h.direction === "backward" ? le : se,
            afterState: h.direction === "backward" ? se : le
          }
        }, S, M);
      }
      return S;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return I(
        x,
        E,
        K
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return C(x, K);
    if ((x == null ? void 0 : x.type) === "shots") {
      const S = Qn(K.shotBoundaries || []), k = await Z(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(`history-shots:${P.id}:${S}:${x.fingerprint}`),
          expectedFingerprint: S,
          boundaries: x.boundaries
        })
      });
      return { ...K, shotBoundaries: k };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function re(h) {
    var M;
    if (c || w != null || v || h === l.cursorSequence)
      return;
    const K = al(l, h);
    if (K.length !== 0) {
      _(!0), $(-1), A(`Restoring ${K.length} history ${K.length === 1 ? "action" : "actions"}…`);
      try {
        let x = i;
        const E = [];
        for (const k of K)
          x = await F(
            k,
            x,
            E
          );
        const S = r ? await Z(`/videos/${P.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: h
          })
        }) : d.current;
        E.forEach(Oe), t(S), await p(), A("History restored.");
      } catch (x) {
        x.status === 409 && ((M = x.payload) != null && M.current) && t(x.payload.current), await p(), A(x.message || "Unable to restore editor history.");
      } finally {
        $(null), _(!1);
      }
    }
  }
  function ee(h) {
    R((K) => ({ ...K, timelineRatio: Kr(h, m) }));
  }
  function we(h) {
    var M;
    const K = (M = u.current) == null ? void 0 : M.getBoundingClientRect();
    K && ee(Ji(h.clientY, K.top, K.height));
  }
  function ce(h) {
    h.currentTarget.setPointerCapture(h.pointerId), we(h);
  }
  function T(h) {
    h.currentTarget.hasPointerCapture(h.pointerId) && we(h);
  }
  function Q(h) {
    const K = h.shiftKey ? 0.1 : 0.05;
    let M = null;
    h.key === "ArrowUp" && (M = a.timelineRatio + K), h.key === "ArrowDown" && (M = a.timelineRatio - K);
    const x = Gr(m);
    h.key === "Home" && (M = x.minimum), h.key === "End" && (M = x.maximum), M != null && (h.preventDefault(), h.stopPropagation(), ee(M));
  }
  function oe(h) {
    const K = h === "detailWidth" ? g.focusRow : g.workspace, M = g.workspace > 0 ? Mr(g.workspace, 600) : 560, x = Ot(a.markerRailWidth, M), E = h === "detailWidth" ? 344 + (a.markerRailOpen ? x + 24 : 0) : 600;
    return K > 0 ? Mr(K, E) : 560;
  }
  function fe(h, K) {
    R((M) => ({ ...M, [h]: Ot(K, oe(h)) }));
  }
  function ie(h, K) {
    var x, E;
    const M = K === "detailWidth" ? (x = s.current) == null ? void 0 : x.getBoundingClientRect() : (E = V.current) == null ? void 0 : E.getBoundingClientRect();
    M && fe(K, K === "detailWidth" ? h.clientX - M.left : M.right - h.clientX);
  }
  function B(h, K) {
    const M = oe(h), x = Ot(a[h], M);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": K,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(M),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (E) => {
        E.currentTarget.setPointerCapture(E.pointerId), ie(E, h);
      },
      onPointerMove: (E) => {
        E.currentTarget.hasPointerCapture(E.pointerId) && ie(E, h);
      },
      onKeyDown: (E) => {
        const S = E.shiftKey ? 40 : 16;
        let k = null;
        E.key === "ArrowLeft" && (k = h === "detailWidth" ? -S : S), E.key === "ArrowRight" && (k = h === "detailWidth" ? S : -S);
        let H = k == null ? null : x + k;
        E.key === "Home" && (H = 240), E.key === "End" && (H = M), H != null && (E.preventDefault(), E.stopPropagation(), fe(h, H));
      },
      onDoubleClick: () => fe(h, rt[h]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function ue() {
    R((h) => ({ ...h, markerRailOpen: !h.markerRailOpen })), requestAnimationFrame(() => {
      var h;
      return (h = b.current) == null ? void 0 : h.focus({ preventScroll: !0 });
    });
  }
  function Me(h) {
    W((K) => K.includes(h) ? K.filter((M) => M !== h) : Tt([...K, h]));
  }
  async function Y(h, K = !0, M = o) {
    var k;
    if (N.current) return null;
    const x = Number((k = P.videoFile) == null ? void 0 : k.duration) || U, E = Qn(D), S = `shot-${h}:${P.id}:${M.toFixed(3)}:${x.toFixed(3)}:${E}`;
    N.current = !0, O(!0), A(h === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const H = await Z(`/videos/${P.id}/shot-boundaries/${h}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h === "split" ? { operationId: Re(S), timeSec: M } : { operationId: Re(S), timeSec: M })
      });
      return Oe(S), y((le) => ({ ...le, shotBoundaries: H }), P.id), K && await f(
        "shots.update",
        h === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: D,
          fingerprint: E
        },
        {
          type: "shots",
          boundaries: H,
          fingerprint: Qn(H)
        }
      ), A(h === "split" ? "Shot boundary added." : "Shots merged."), H;
    } catch (H) {
      return A(H.message || "Unable to edit shot boundaries."), null;
    } finally {
      N.current = !1, O(!1);
    }
  }
  async function Se(h) {
    if (N.current) return null;
    const K = `shot-restore:${P.id}:${h.afterFingerprint}`;
    N.current = !0, O(!0), A("Undoing shot edit…");
    try {
      const M = await Z(`/videos/${P.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(K),
          expectedFingerprint: h.afterFingerprint,
          boundaries: h.before
        })
      });
      return Oe(K), y((x) => ({ ...x, shotBoundaries: M }), P.id), M;
    } catch (M) {
      return A(M.message || "Unable to undo the shot edit."), null;
    } finally {
      N.current = !1, O(!1);
    }
  }
  return { applySegmentHistoryState: I, applyPerformerSlotHistoryState: C, applyHistoryState: F, restoreHistoryTarget: re, updateTimelineRatio: ee, updateTimelineRatioFromPointer: we, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: T, handleSeparatorKeyDown: Q, panelWidthMaximum: oe, updatePanelWidth: fe, handlePanelSeparatorPointer: ie, panelSeparatorProps: B, toggleSegmentRail: ue, toggleSegmentGroup: Me, mutateShotBoundary: Y, restoreShotBoundaries: Se };
}
function vd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: y, mergeSelectedSwimlane: p, moveToBin: b, mutateShotBoundary: f, openPublishApprovedDialog: w, playbackControlsRef: v, playbackShortcutConfig: N, saveSelectedReviewState: W, seekRef: R, segmentGroupKeys: _, selectSegment: A, selectedSegment: $, selectedSegmentGroupForSegment: O, selectedSegmentGroupKey: D, selectedSegments: U, setCollapsedSegmentGroups: P, setIncorrectExamplesOpen: V, setQuickSearchOpen: I, setSaveMessage: C, setSelectedSegmentGroupKey: F, setTagEditing: re, setTimelineZoom: ee, shotBoundaries: we, slotButtonRef: ce, splitSegment: T, swimlanes: Q, timelineDuration: oe, toggleIncorrectExample: fe, toggleSegmentGroup: ie, updateTimelineRatio: B, videoFrameRate: ue, visibleSegments: Me } = e;
  function Y(h, K) {
    if (U.length > 1 && bs(h.id))
      return;
    let M = null;
    h.id === "video.playPause" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.toggle();
    }), h.id === "video.seekSmallBackward" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-N.smallSeekTime);
    }), h.id === "video.seekSmallForward" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(N.smallSeekTime);
    }), h.id === "video.seekMediumBackward" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-N.mediumSeekTime);
    }), h.id === "video.seekMediumForward" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(N.mediumSeekTime);
    }), h.id === "video.seekLongBackward" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-N.longSeekTime);
    }), h.id === "video.seekLongForward" && (M = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(N.longSeekTime);
    }), h.id === "video.playSelected" && $ && (M = () => {
      var x;
      (x = R.current) == null || x.call(R, $.startSec, !0), requestAnimationFrame(() => {
        var E;
        return (E = g.current) == null ? void 0 : E.focus({ preventScroll: !0 });
      });
    }), (h.id === "video.playPreviousSegment" || h.id === "video.playNextSegment") && (M = () => {
      var E;
      const x = Or(
        Q,
        $ == null ? void 0 : $.id,
        h.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !x || x.id === ($ == null ? void 0 : $.id) || (A(x, { focusEditor: !0, seekToSegment: !1 }), (E = R.current) == null || E.call(R, x.startSec, !0));
    }), h.id.startsWith("video.seekPercent") && (M = () => {
      var E;
      const x = Number(h.id.slice(17)) / 10;
      (E = R.current) == null || E.call(R, ms(y ?? oe, x), !1);
    }), h.id === "video.jumpToSegmentStart" && $ && (M = () => {
      var x;
      return (x = R.current) == null ? void 0 : x.call(R, $.startSec, !1);
    }), h.id === "video.jumpToSegmentEnd" && $ && (M = () => {
      var x;
      return (x = R.current) == null ? void 0 : x.call(R, $.endSec ?? $.startSec, !1);
    }), h.id === "video.jumpToVideoStart" && (M = () => {
      var x;
      return (x = R.current) == null ? void 0 : x.call(R, 0, !1);
    }), h.id === "video.jumpToVideoEnd" && (M = () => {
      var x;
      return (x = R.current) == null ? void 0 : x.call(R, oe, !1);
    }), h.id.startsWith("video.frame") && (M = () => {
      var S, k;
      const x = h.id.includes("Small") ? "small" : h.id.includes("Medium") ? "medium" : "long", E = N[`${x}FrameStep`] * (h.id.endsWith("Backward") ? -1 : 1);
      (S = v.current) == null || S.pause(), (k = v.current) == null || k.seekBy($s(E, ue));
    }), h.id.startsWith("navigation.swimlane") && (M = () => {
      const x = h.id.slice(19).toLowerCase(), E = Or(Q, $ == null ? void 0 : $.id, x, s);
      E && A(E, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.extendSwimlaneLeft" || h.id === "navigation.extendSwimlaneRight") && (M = () => {
      const x = Sl(
        t,
        $ == null ? void 0 : $.id,
        h.id.endsWith("Left") ? "left" : "right"
      );
      x && A(x.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: x.segmentIds
      });
    }), (h.id === "navigation.segmentGroupUp" || h.id === "navigation.segmentGroupDown") && (M = () => {
      const x = kl(
        _,
        D ?? O,
        h.id.endsWith("Up") ? -1 : 1
      );
      x && F(x);
    }), (h.id === "navigation.previousAtPlayhead" || h.id === "navigation.nextAtPlayhead") && (M = () => {
      const x = Yi(Me, s, h.id === "navigation.previousAtPlayhead" ? -1 : 1, $ == null ? void 0 : $.id);
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.nearestInCurrentSwimlane" && (M = () => {
      const x = Bi(
        Q,
        $ == null ? void 0 : $.id,
        s
      );
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id.includes("Unreviewed") && (M = () => {
      const x = ma(
        Q,
        $ == null ? void 0 : $.id,
        h.id.startsWith("navigation.previous") ? -1 : 1,
        h.id.endsWith("Global")
      );
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.nextTouchingPlayhead" || h.id === "navigation.previousTouchingPlayhead") && (M = () => {
      const x = ji(Q, s, h.id === "navigation.previousTouchingPlayhead" ? -1 : 1, $ == null ? void 0 : $.id);
      x && A(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.quickSearch" && (M = () => I(!0)), (h.id === "navigation.previousShot" || h.id === "navigation.nextShot") && (M = () => {
      var E;
      const x = Cs(we, s, h.id === "navigation.previousShot" ? -1 : 1);
      x && ((E = R.current) == null || E.call(R, x.startSec, !1));
    }), h.id === "shot.split" && (M = () => f("split")), h.id === "shot.merge" && (M = () => f("merge")), h.id === "marker.create" && (M = () => a()), h.id === "marker.duplicate" && (M = () => d(!1)), h.id === "marker.duplicateAtPlayhead" && (M = () => d(!0)), h.id === "marker.split" && (M = () => T()), h.id === "marker.editTag" && (M = () => {
      var x;
      if (U.length > 1 && U.some((E) => E.isDerived)) {
        C("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((x = u.data) != null && x.tagReadOnly) {
        C("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      re(!0);
    }), h.id === "marker.setStart" && $ && (M = () => r(s, $.endSec)), h.id === "marker.setEnd" && $ && (M = () => r($.startSec, s)), h.id === "marker.copyTiming" && $ && (M = () => {
      C(Gl($) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), h.id === "marker.pasteTiming" && $ && (M = () => {
      const x = Bl();
      if (!x) {
        C("No copied segment timing is available.");
        return;
      }
      r(x.startSec, x.endSec);
    }), h.id === "marker.mergeSelection" && (M = () => p()), h.id === "marker.moveToBin" && (M = () => b()), h.id === "marker.toggleIncorrectExample" && $ && (M = () => fe()), h.id === "marker.openIncorrectExamples" && (M = () => V(!0)), h.id === "markerGroup.toggleCollapse" && D && (M = () => ie(D)), h.id === "markerGroup.toggleAll" && (M = () => P((x) => xl(x, _))), h.id === "marker.assignSlots" && (M = () => {
      var x;
      return (x = ce.current) == null ? void 0 : x.click();
    }), h.id === "navigation.zoomIn" && (M = () => ee((x) => Xn(x + 0.5))), h.id === "navigation.zoomOut" && (M = () => ee((x) => Xn(x - 0.5))), h.id === "navigation.resetZoom" && (M = () => ee(1)), h.id === "navigation.centerPlayhead" && (M = () => {
      var x;
      return (x = o.current) == null ? void 0 : x.call(o);
    }), h.id === "layout.growSwimlanes" && (M = () => B(c.timelineRatio + 0.05)), h.id === "layout.shrinkSwimlanes" && (M = () => B(c.timelineRatio - 0.05)), h.id === "marker.confirm" && $ && (M = () => W("approved")), h.id === "system.publishApproved" && (M = () => w(K.target)), h.id === "marker.reject" && $ && (M = () => W("rejected")), h.id === "system.emptyBin" && (M = () => m()), h.id === "system.deleteRejected" && (M = () => l()), M && M();
  }
  function Se(h, K) {
    const M = An.find((x) => x.id === h);
    M && Zt(M, i) && Y(M, K);
  }
  return { executeShortcutById: Se };
}
function xd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = j(null), [l, d] = j(null), [c, g] = j(""), [m, u] = j({
    busy: !1,
    reviewState: null,
    error: ""
  }), y = pe(null);
  async function p(w) {
    u({ busy: !0, reviewState: w, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Dr(), reviewState: w })
      }), await t(), u({ busy: !1, reviewState: null, error: "" });
    } catch (v) {
      u({
        busy: !1,
        reviewState: null,
        error: v.message || "Unable to import Cove segments."
      });
    }
  }
  async function b() {
    try {
      const w = await Z(`/videos/${e}/analysis-runs`), v = (w == null ? void 0 : w[0]) || null;
      return s(v), (v == null ? void 0 : v.status) === "completed" && y.current !== v.id && (y.current = v.id, await t()), ((v == null ? void 0 : v.status) === "failed" || (v == null ? void 0 : v.status) === "cancelled") && g(v.errorMessage || "Video analysis did not complete."), v;
    } catch (w) {
      return g(w.message || "Unable to load video analysis status."), null;
    }
  }
  async function f(w = null) {
    g("");
    const v = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), N = v.includes("omnishotcut") && o > 0;
    if (!(N && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const W = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: v,
            replaceShotBoundaries: N,
            expectedShotBoundaryFingerprint: N ? i : null
          })
        });
        s(W);
      } catch (W) {
        g(W.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    b(), Z("/analysis/status").then((w) => {
      d(w), w.configured || g("");
    }).catch((w) => g(w.message || "Unable to check video analysis readiness."));
  }, [e, r]), ye(() => {
    if ((a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = setInterval(b, 2500);
    return () => clearInterval(w);
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: m,
    startFullAnalysis: f
  };
}
const wn = Object.freeze([]);
function Sd(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function kd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var uo, mo, go, po, fo;
  const [g, m] = j(null), [u, y] = j([]), p = pe(null), b = pe(null), f = pe([]), w = pe(null), [v, N] = j(() => dt({})), [W, R] = j(!1), [_, A] = j(ps), [$, O] = j(0), [D, U] = j(null), [P, V] = j(!1), [I, C] = j(""), [F, re] = j(""), [ee, we] = j(""), [ce, T] = j(1), [Q, oe] = j(Pl), [fe, ie] = j(0), [B, ue] = j({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [Me, Y] = j(kt), Se = pe(kt), [h, K] = j(!1), [M, x] = j(!1), [E, S] = j(!1), [k, H] = j(!1), le = pe(!1), [se, te] = j(null), [xe, q] = j(null), X = pe(null), [J, L] = j(!1), [ne, me] = j(""), he = pe(null), be = pe(null), Ee = pe(!1), Pe = pe(!1), [ve, Ce] = j(Ll), [$e, ge] = j(null), [Ge, Ae] = j(!1), [at, ke] = j(!1), [De, He] = j(!1), [je, Ne] = j(!1), [Te, Ke] = j(!1), [it, Je] = j(""), {
    analysisError: Ye,
    analysisRun: pt,
    analysisStatus: jt,
    importNativeSegments: En,
    nativeImportState: Xt,
    startFullAnalysis: Dn
  } = xd(
    e.video.id,
    o,
    l,
    ((uo = e.shotBoundaries) == null ? void 0 : uo.length) || 0,
    Qn(e.shotBoundaries || [])
  ), [Mt, lr] = j(!1), [ft, ht] = j(null), [Bt, At] = j(l), [Nt, dr] = j(0), [vt, cr] = j(!1), [en, tn] = j(""), [xt, nn] = j(null), Gt = pe(null), On = pe(null), rn = pe(!1), [Rt, Kt] = j([]), [on, ur] = j(!1), [Pn, mr] = j(null), an = Dl(), sn = pe(null), ln = pe(null), Et = pe(null), Ln = pe(s), Fn = pe(null), dn = pe(null), cn = pe(null), un = pe(null), tt = pe(null), jn = pe(null), Ut = pe(null), Bn = pe(null), Gn = pe(null), mn = pe(null), gn = pe(null), St = pe(-1e12), gr = pe(null), Kn = pe(!1), pn = pe(null), [fn, yn] = j({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!Mt || vt || !en) return;
    const G = requestAnimationFrame(() => {
      var de;
      return (de = On.current) == null ? void 0 : de.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(G);
  }, [Mt, vt, en]), ye(() => {
    if (!rn.current || Mt || Bt) return;
    const G = requestAnimationFrame(() => {
      var de;
      (de = Gt.current) == null || de.focus({ preventScroll: !0 }), rn.current = !1;
    });
    return () => cancelAnimationFrame(G);
  }, [Mt, Bt]);
  const _e = e.video, Ze = e.segments || wn, Un = Be(() => JSON.stringify({
    segments: Ze.map((G) => [
      G.id,
      G.itemId,
      G.nativeSegmentId,
      G.tagId,
      G.startSec,
      G.endSec,
      G.reviewState,
      G.published,
      G.sourceKey,
      G.sourceRunId,
      G.confidence,
      G.revision,
      G.updatedAt
    ]),
    performerSlots: (e.performerSlots || wn).map((G) => [
      G.segmentId,
      G.slotDefinitionId,
      G.performerId,
      G.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [Ze, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      ht(null), At(!1);
      return;
    }
    if (D != null) {
      At(!0);
      return;
    }
    let G = !0;
    At(!0);
    const de = setTimeout(() => {
      Z(`/videos/${_e.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Le) => {
        G && (ht(Le), tn(""));
      }).catch((Le) => {
        G && (ht(null), tn(Le.message || "Unable to preview derived segments."));
      }).finally(() => {
        G && At(!1);
      });
    }, 150);
    return () => {
      G = !1, clearTimeout(de);
    };
  }, [l, _e.id, Un, Nt, D]);
  const pr = () => dr((G) => G + 1), yt = e.segmentGroups || wn, Ue = e.performerSlots || wn, zn = l && e.performerSlotsAvailable !== !1, bn = Be(
    () => (e.performerCandidates || []).filter((G) => G.isVideoPerformer),
    [e.performerCandidates]
  ), hn = e.shotBoundaries || wn, zt = Be(
    () => La(Ue),
    [Ue]
  ), It = Be(
    () => Ze.map((G) => {
      const de = zt.get(G.id) || [];
      return {
        ...G,
        slots: de,
        assignment: de.every((Le) => Le.performerId == null) ? Bs(de, bn) : null
      };
    }).filter((G) => G.slots.length > 0 && G.assignment != null),
    [Ze, zt, bn]
  ), fr = Number((mo = _e.videoFile) == null ? void 0 : mo.frameRate) > 0 ? Number(_e.videoFile.frameRate) : 30;
  function vn() {
    S(!1), requestAnimationFrame(() => {
      var G;
      return (G = tt.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    });
  }
  function yr() {
    D == null && (gn.current = null, H(!1), C(""), requestAnimationFrame(() => {
      var G;
      return (G = tt.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    }));
  }
  function xn() {
    R(!1), requestAnimationFrame(() => {
      var G, de;
      (G = Ut.current) != null && G.isConnected ? Ut.current.focus({ preventScroll: !0 }) : (de = tt.current) == null || de.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    mn.current === g ? (mn.current = null, S(!0)) : S(!1);
  }, [g]), ye(() => {
    var de;
    if (!E) return;
    const G = (de = Gn.current) == null ? void 0 : de.querySelector("input");
    G == null || G.focus({ preventScroll: !0 }), G == null || G.select();
  }, [E, g]), ye(() => {
    var Le, qe, nt;
    const G = Pt(
      kr(
        e.segments,
        e.performerSlots || [],
        dt({}),
        l && _,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), de = ((Le = e.segments.find((Wn) => Wn.id === s)) == null ? void 0 : Le.id) ?? ((qe = ua(G)) == null ? void 0 : qe.id) ?? null;
    m(de), y(de == null ? [] : [de]), b.current = de, f.current = [], ge(ut(G, de)), N(dt({})), R(!1), gn.current = null, H(!1), T(1), C(""), Y(kt), Se.current = kt, K(!1), (nt = tt.current) == null || nt.focus({ preventScroll: !0 });
  }, [_e.id, s]), ye(() => {
    const G = new AbortController();
    return Z(`/videos/${_e.id}/incorrect-examples`, { signal: G.signal }).then(Kt).catch((de) => {
      de.name !== "AbortError" && Kt([]);
    }), () => G.abort();
  }, [_e.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const G = new AbortController();
    return Z(`/videos/${_e.id}/history`, { signal: G.signal }).then((de) => {
      const Le = de || kt;
      Se.current = Le, Y(Le);
    }).catch((de) => {
      de.name !== "AbortError" && C(de.message || "Unable to load editor history.");
    }), () => G.abort();
  }, [_e.id]), ye(() => {
    jl(Q);
  }, [Q.timelineRatio, Q.markerRailOpen, Q.detailWidth, Q.markerRailWidth, Q.swimlaneTitleWidth]), ye(() => {
    Fl(ve);
  }, [ve]), ye(() => {
    fs(_);
  }, [_]), ye(() => {
    const G = dn.current;
    if (!a || !G || typeof ResizeObserver > "u") return;
    const de = () => {
      const qe = G.clientHeight;
      ie(qe), oe((nt) => {
        const Wn = Kr(nt.timelineRatio, qe);
        return Wn === nt.timelineRatio ? nt : { ...nt, timelineRatio: Wn };
      });
    }, Le = new ResizeObserver(de);
    return Le.observe(G), de(), () => Le.disconnect();
  }, [a]), ye(() => {
    if (!an || typeof ResizeObserver > "u") return;
    const G = un.current, de = cn.current;
    if (!G || !de) return;
    const Le = () => ue({
      workspace: G.clientWidth,
      focusRow: de.clientWidth,
      focusRowHeight: de.clientHeight
    }), qe = new ResizeObserver(Le);
    return qe.observe(G), qe.observe(de), Le(), () => qe.disconnect();
  }, [an, Q.markerRailOpen]);
  const ct = Be(
    () => Bo(
      kr(
        Ze,
        Ue,
        v,
        l && _,
        yt
      ),
      Rt,
      !0
    ),
    [
      Ze,
      Ue,
      v,
      _,
      yt,
      l,
      Rt
    ]
  ), br = Object.fromEntries(Xe.map((G) => [G, ct.filter((de) => de.reviewState === G).length])), _t = Bo(
    kr(
      Ze,
      Ue,
      { ...v, reviewStates: Xe },
      l && _,
      yt
    ),
    Rt,
    !0
  ), Ht = Object.fromEntries(Xe.map((G) => [G, _t.filter((de) => de.reviewState === G).length])), z = [...new Set(Ze.map((G) => G.sourceKey).filter(Boolean))].sort((G, de) => gt(G).localeCompare(gt(de))), Fe = ts(
    v,
    l && _
  ), ze = Be(
    () => Pt(ct, yt, Ue),
    [ct, yt, Ue]
  ), ae = os(
    ze,
    g,
    s
  ), st = gs(ct, u), qt = !l && st.length > 0 && st.every((G) => G.nativeSegmentId != null), _n = ct.map((G) => G.id), qa = _n.join("|");
  p.current = (ae == null ? void 0 : ae.id) ?? null;
  const Jr = zt.get(ae == null ? void 0 : ae.id) || [], Wa = Hr(Jr), Yr = Be(
    () => bl(ze, u),
    [ze, u]
  ), hr = Be(() => qr(ze), [ze]), Sn = Be(
    () => fl(hr, ve),
    [hr, ve]
  ), Va = Be(
    () => Fa(
      Sn.rows,
      fn.scrollTop,
      fn.height
    ),
    [Sn, fn]
  ), Ja = Be(
    () => vl(ze, ve),
    [ze, ve]
  ), Wt = ae ? ut(ze, ae.id) : null, vr = yt.length > 0 ? hr.map((G) => G.key) : [], Ya = vr.join("|"), Hn = Math.max(
    0,
    Number((go = _e.videoFile) == null ? void 0 : go.duration) || 0,
    ...Ze.map((G) => Number(G.endSec ?? G.startSec) || 0)
  ), Zr = Number((po = _e.videoFile) == null ? void 0 : po.duration) > 0 ? Number(_e.videoFile.duration) : null;
  Me.actions;
  const Za = xa();
  ye(() => {
    const G = g === er ? g : (ae == null ? void 0 : ae.id) ?? null;
    G !== g && m(G);
  }, [ae, g]), ye(() => {
    y((G) => {
      const de = ls(
        G,
        _n,
        (ae == null ? void 0 : ae.id) ?? null
      );
      return de.length === G.length && de.every((Le, qe) => Le === G[qe]) ? G : de;
    });
  }, [qa, ae == null ? void 0 : ae.id]);
  const Vt = (ae == null ? void 0 : ae.itemId) == null ? null : ((fo = e.itemMetadata) == null ? void 0 : fo[ae.itemId]) || null, Qa = {
    key: (ae == null ? void 0 : ae.itemId) != null ? `item:${ae.itemId}` : (ae == null ? void 0 : ae.nativeSegmentId) != null ? `native:${ae.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (Vt == null ? void 0 : Vt.provenance) || (ae == null ? void 0 : ae.fieldProvenance) || [] : []
  }, xr = (ae == null ? void 0 : ae.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (Vt == null ? void 0 : Vt.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    re(ae == null ? "" : String(ae.startSec)), we((ae == null ? void 0 : ae.endSec) == null ? "" : String(ae.endSec));
  }, [ae == null ? void 0 : ae.id, ae == null ? void 0 : ae.startSec, ae == null ? void 0 : ae.endSec]), ye(() => {
    Wt && Ce((G) => Ga(G, Wt));
  }, [_e.id, s, Wt]), ye(() => {
    ge((G) => wl(vr, G, Wt));
  }, [_e.id, Ya, Wt]), ye(() => {
    if (!Q.markerRailOpen || (ae == null ? void 0 : ae.id) == null) return;
    const G = pn.current, de = Sn.rows.find((nt) => nt.kind === "segment" && nt.segment.id === ae.id);
    if (!G || !de) return;
    const Le = de.top + de.height;
    let qe = G.scrollTop;
    de.top < G.scrollTop ? qe = de.top : Le > G.scrollTop + G.clientHeight && (qe = Math.max(0, Le - G.clientHeight)), qe !== G.scrollTop && (G.scrollTop = qe), yn({ scrollTop: qe, height: G.clientHeight });
  }, [ae == null ? void 0 : ae.id, Sn, Q.markerRailOpen]), ye(() => {
    const G = pn.current;
    if (!Q.markerRailOpen || !G) return;
    const de = () => yn({
      scrollTop: G.scrollTop,
      height: G.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      de();
      return;
    }
    const Le = new ResizeObserver(de);
    return Le.observe(G), de(), () => Le.disconnect();
  }, [Q.markerRailOpen]);
  const { revealSegmentGroupForSelection: Qr, replaceSegmentSelection: Xa, selectSegment: Xr, selectSegmentCollection: ei, selectAllVideoSegments: ti } = fd({
    allSwimlanes: ze,
    editorRef: tt,
    performerSlots: Ue,
    seekRef: sn,
    segmentGroups: yt,
    segments: Ze,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setCollapsedSegmentGroups: Ce,
    setEditorFilters: N,
    setHideDerivedSegments: A,
    setSaveMessage: C,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y
  }), { acceptHistory: Sr, recordHistoryAction: qn, mutateSegment: ni, completeReview: ri, createSegment: eo, splitSegment: to, duplicateSegment: no, saveTiming: oi, applyShortcutTiming: ai } = El({
    compatibilityMode: l,
    currentTime: $,
    detail: e,
    editorFilters: v,
    endInput: ee,
    hideDerivedSegments: _,
    historyRef: Se,
    mediaDuration: Zr,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: St,
    pendingDuplicateRef: gr,
    pendingFirstSegmentStartSecRef: gn,
    pendingTagEditSegmentIdRef: mn,
    replaceSegmentSelection: Xa,
    savingSegmentId: D,
    segments: Ze,
    selectedSegment: ae,
    selectedSegmentIdRef: p,
    selectedSegments: st,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setEditorFilters: N,
    setFirstSegmentTagOpen: H,
    setHideDerivedSegments: A,
    setHistory: Y,
    setHistoryOpen: K,
    setPublishApprovedError: me,
    setSaveMessage: C,
    setSavingSegmentId: U,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    startInput: F,
    timelineDuration: Hn,
    video: _e
  });
  function ro(G = null) {
    var qe;
    if (!l || D != null || !Ze.some((nt) => !nt.published && nt.reviewState === "approved")) return;
    const de = ((qe = tt.current) == null ? void 0 : qe.ownerDocument) ?? document, Le = de.activeElement === de.body ? null : de.activeElement;
    be.current = G != null && G.isConnected && G !== de.body ? G : Le, me(""), L(!0);
  }
  function oo() {
    D == null && (L(!1), me(""), requestAnimationFrame(() => {
      Sd(
        be.current,
        tt.current
      ), be.current = null;
    }));
  }
  async function ii() {
    await ri() && oo();
  }
  const { closeMergeConfirmation: si, mergeSelectedSwimlane: ao, saveSelectedReviewState: li } = yd({
    acceptHistory: Sr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: Se,
    mergeSavingRef: le,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: qn,
    revealSegmentGroupForSelection: Qr,
    reviewSavingRef: Ee,
    savingSegmentId: D,
    selectedGroups: Yr,
    selectedSegment: ae,
    selectedSegmentIdRef: p,
    selectedSegments: st,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setMergeConfirmation: te,
    setSaveMessage: C,
    setSavingSegmentId: U,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: _e
  }), { toggleIncorrectExample: di, removeIncorrectExample: ci, captureTrainingExport: ui, deleteRejectedSegments: io, autoAssignPerformers: mi, previewDerivedSegments: gi, closeMaterializeDialog: pi, materializeDerivedSegments: fi, saveTag: yi, moveToBin: bi, emptyRecyclingBin: hi } = bd({
    acceptHistory: Sr,
    allSwimlanes: ze,
    autoAssignCandidates: It,
    autoAssigning: Te,
    binEmptyingRef: Pe,
    canMoveSelectionToBin: qt,
    closeTagEditing: vn,
    compatibilityMode: l,
    detail: e,
    editorRef: tt,
    exportingExamples: on,
    incorrectExamples: Rt,
    lineage: xr,
    materializeButtonRef: Gt,
    materializePreview: ft,
    materializeRestoreFocusRef: rn,
    materializing: vt,
    mutateSegment: ni,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: qn,
    refreshMaterializationPreview: pr,
    removingExampleId: Pn,
    revealSegmentGroupForSelection: Qr,
    savingSegmentId: D,
    segments: Ze,
    selectedSegment: ae,
    selectedSegmentIdRef: p,
    selectedSegments: st,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setAutoAssignError: Je,
    setAutoAssignOpen: Ne,
    setAutoAssigning: Ke,
    setExportingExamples: ur,
    setIncorrectExamples: Kt,
    setMaterializeError: tn,
    setMaterializeLoading: At,
    setMaterializeOpen: lr,
    setMaterializePreview: ht,
    setMaterializing: cr,
    setRemovingExampleId: mr,
    setRejectedDeletionPreview: q,
    setSaveMessage: C,
    setSavingSegmentId: U,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: _e
  }), { restoreHistoryTarget: vi, updateTimelineRatio: so, handleSeparatorPointerDown: xi, handleSeparatorPointerMove: Si, handleSeparatorKeyDown: ki, panelWidthMaximum: lo, panelSeparatorProps: wi, toggleSegmentRail: Ni, toggleSegmentGroup: co, mutateShotBoundary: Ii } = hd({
    acceptHistory: Sr,
    compatibilityMode: l,
    currentTime: $,
    detail: e,
    editorLayout: Q,
    focusRowRef: cn,
    history: Me,
    historyRef: Se,
    historySaving: M,
    horizontalLayoutSize: B,
    mediaStackHeight: fe,
    mediaStackRef: dn,
    onDetailChange: t,
    onReload: o,
    railToggleRef: jn,
    recordHistoryAction: qn,
    savingSegmentId: D,
    savingShot: P,
    savingShotRef: Kn,
    setCollapsedSegmentGroups: Ce,
    setEditorLayout: oe,
    setHistorySaving: x,
    setSaveMessage: C,
    setSavingSegmentId: U,
    setSavingShot: V,
    shotBoundaries: hn,
    timelineDuration: Hn,
    video: _e,
    workspaceRef: un
  }), { executeShortcutById: Ci } = vd({
    allSwimlanes: ze,
    applyShortcutTiming: ai,
    centerTimelineRef: Fn,
    compatibilityMode: l,
    createSegment: eo,
    currentTime: $,
    deleteRejectedSegments: io,
    duplicateSegment: no,
    editorLayout: Q,
    editorRef: tt,
    emptyRecyclingBin: hi,
    lineage: xr,
    mediaDuration: Zr,
    mergeSelectedSwimlane: ao,
    moveToBin: bi,
    mutateShotBoundary: Ii,
    openPublishApprovedDialog: ro,
    playbackControlsRef: ln,
    playbackShortcutConfig: Za,
    saveSelectedReviewState: li,
    seekRef: sn,
    segmentGroupKeys: vr,
    selectSegment: Xr,
    selectedSegment: ae,
    selectedSegmentGroupForSegment: Wt,
    selectedSegmentGroupKey: $e,
    selectedSegments: st,
    setCollapsedSegmentGroups: Ce,
    setIncorrectExamplesOpen: He,
    setQuickSearchOpen: ke,
    setSaveMessage: C,
    setSelectedSegmentGroupKey: ge,
    setTagEditing: S,
    setTimelineZoom: T,
    shotBoundaries: hn,
    slotButtonRef: Bn,
    splitSegment: to,
    swimlanes: Ja,
    timelineDuration: Hn,
    toggleIncorrectExample: di,
    toggleSegmentGroup: co,
    updateTimelineRatio: so,
    videoFrameRate: fr,
    visibleSegments: ct
  });
  Et.current = Ci;
  const $i = Be(() => An.map((G) => ({
    id: G.id,
    enabled: Zt(G, l),
    surface: "local",
    action: (de) => {
      var Le;
      return (Le = Et.current) == null ? void 0 : Le.call(Et, G.id, de);
    }
  })), [l]);
  ea(jr, $i);
  const Ti = Gr(fe), Mi = Ot(Q.markerRailWidth, lo("markerRailWidth")), Ai = Ot(Q.detailWidth, lo("detailWidth"));
  return n(pd, {
    activeFilterCount: Fe,
    allSwimlanes: ze,
    analysisError: Ye,
    analysisRun: pt,
    analysisStatus: jt,
    approvalFacetCounts: Ht,
    autoAssignCandidates: It,
    autoAssignError: it,
    autoAssignOpen: je,
    autoAssignPerformers: mi,
    autoAssigning: Te,
    captureTrainingExport: ui,
    removeIncorrectExample: ci,
    rejectedDeletionPreview: xe,
    centerTimelineRef: Fn,
    closeEditorFilters: xn,
    closeFirstSegmentTagDialog: yr,
    closeMaterializeDialog: pi,
    closeMergeConfirmation: si,
    closePublishApprovedDialog: oo,
    closeTagEditing: vn,
    collapsedSegmentGroups: ve,
    compatibilityMode: l,
    configuringTag: xt,
    createSegment: eo,
    currentTime: $,
    deleteRejectedSegments: io,
    detail: e,
    detailPanelRef: w,
    detailWidth: Ai,
    duplicateSegment: no,
    editorFilters: v,
    editorLayout: Q,
    editorRef: tt,
    exportingExamples: on,
    filtersButtonRef: Ut,
    filtersOpen: W,
    firstSegmentTagOpen: k,
    focusRowRef: cn,
    handleSeparatorKeyDown: ki,
    handleSeparatorPointerDown: xi,
    handleSeparatorPointerMove: Si,
    hideDerivedSegments: _,
    history: Me,
    historyOpen: h,
    historySaving: M,
    horizontalLayoutSize: B,
    importNativeSegments: En,
    incorrectExamples: Rt,
    incorrectExamplesOpen: De,
    removingExampleId: Pn,
    lineage: xr,
    markerRailWidth: Mi,
    materializeButtonRef: Gt,
    materializeCancelButtonRef: On,
    materializeDerivedSegments: fi,
    materializeError: en,
    materializeLoading: Bt,
    materializeOpen: Mt,
    materializePreview: ft,
    materializing: vt,
    mediaStackRef: dn,
    mergeCancelButtonRef: X,
    mergeConfirmation: se,
    mergeSavingRef: le,
    mergeSelectedSwimlane: ao,
    nativeImportState: Xt,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: ro,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: wi,
    pendingInitialSeekRef: Ln,
    performerSlots: Ue,
    performerSlotsAvailable: zn,
    playbackControlsRef: ln,
    previewDerivedSegments: gi,
    provenance: Qa,
    provenanceSources: z,
    publishApprovedCancelButtonRef: he,
    publishApprovedDrafts: ii,
    publishApprovedError: ne,
    publishApprovedOpen: J,
    quickSearchOpen: at,
    railScrollRef: pn,
    railToggleRef: jn,
    recordHistoryAction: qn,
    restoreHistoryTarget: vi,
    saveMessage: I,
    setSaveMessage: C,
    saveTag: yi,
    saveTiming: oi,
    savingSegmentId: D,
    setSavingSegmentId: U,
    seekRef: sn,
    segmentGroups: yt,
    segmentRailLayout: Sn,
    segments: Ze,
    selectAllVideoSegments: ti,
    selectSegment: Xr,
    selectSegmentCollection: ei,
    selectedGroups: Yr,
    selectedPerformerSlots: Jr,
    selectedSegment: ae,
    selectedSegmentGroupKey: $e,
    selectedSegmentIds: u,
    selectedSegments: st,
    selectedSlotStatus: Wa,
    setAutoAssignError: Je,
    setAutoAssignOpen: Ne,
    setConfiguringTag: nn,
    setCurrentTime: O,
    setEditorFilters: N,
    setEditorLayout: oe,
    setFiltersOpen: R,
    setHideDerivedSegments: A,
    setHistoryOpen: K,
    setIncorrectExamplesOpen: He,
    setQuickSearchOpen: ke,
    setRejectedDeletionPreview: q,
    setRailViewport: yn,
    setSelectedSegmentGroupKey: ge,
    setSelectedSegmentId: m,
    setShortcutsOpen: Ae,
    setTimelineZoom: T,
    shotBoundaries: hn,
    shortcutsOpen: Ge,
    slotButtonRef: Bn,
    splitLayout: a,
    splitSegment: to,
    startFullAnalysis: Dn,
    tagEditing: E,
    tagSearchRef: Gn,
    timelineDuration: Hn,
    timelineRatioBounds: Ti,
    timelineZoom: ce,
    toggleSegmentGroup: co,
    toggleSegmentRail: Ni,
    updateTimelineRatio: so,
    video: _e,
    videoPerformers: bn,
    visibleCounts: br,
    visibleSegmentRailRows: Va,
    visibleSegments: ct,
    wideLayout: an,
    workspaceRef: un
  });
}
function wd(e = [], t = []) {
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
function Nd(e = [], t = "", r = "all") {
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
function Id(e = [], t = []) {
  var y;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, b) => (p.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(p.id) - Number(b.id)).forEach((p, b) => {
    [...p.tags || []].sort((f, w) => (f.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(f.tagId) - Number(w.tagId)).forEach((f, w) => r.set(Number(f.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? b,
      tagSortOrder: f.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, b) {
    const f = Number(p);
    if (!o.has(f)) {
      const w = r.get(f);
      o.set(f, {
        tagId: f,
        name: b || `Tag ${f}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (w == null ? void 0 : w.key) || "ungrouped",
        segmentGroupId: (w == null ? void 0 : w.id) ?? null,
        segmentGroupName: (w == null ? void 0 : w.name) || "Ungrouped",
        segmentGroupSortOrder: (w == null ? void 0 : w.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (w == null ? void 0 : w.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(f);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const b = i(p.sourceTagId, p.sourceTagName), f = i(p.derivedTagId, p.derivedTagName);
    b.outgoingRuleCount++, f.incomingRuleCount++;
    const w = `${b.tagId}:${f.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: b.tagId,
      derivedTagId: f.tagId,
      rules: [],
      edgeCount: 0
    });
    const v = a.get(w);
    v.rules.push(p), v.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var b, f;
    (b = d.get(p.sourceTagId)) == null || b.add(p.derivedTagId), (f = d.get(p.derivedTagId)) == null || f.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const b = [p.tagId], f = [];
    for (c.add(p.tagId); b.length > 0; ) {
      const A = b.shift();
      f.push(A);
      for (const $ of d.get(A) || [])
        c.has($) || (c.add($), b.push($));
    }
    const w = new Set(f), v = f.map((A) => o.get(A)), N = l.filter((A) => w.has(A.sourceTagId) && w.has(A.derivedTagId)), W = N.flatMap((A) => A.rules), R = v.filter((A) => A.outgoingRuleCount === 0).sort((A, $) => Qe(A.name, $.name)), _ = R.length > 0 ? R : [...v].sort((A, $) => Qe(A.name, $.name));
    g.push({
      id: [...f].sort((A, $) => A - $).join(":"),
      label: _.length > 1 ? `${_[0].name} + ${_.length - 1}` : ((y = _[0]) == null ? void 0 : y.name) || "Derivation component",
      nodes: v,
      connections: N,
      rules: W,
      segmentGroupKeys: [...new Set(v.map((A) => A.segmentGroupKey))],
      materializedEdgeCount: W.reduce(
        (A, $) => A + (Number($.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, b) => b.rules.length - p.rules.length || Qe(p.label, b.label));
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
    p.nodes.forEach((b) => {
      var f;
      return (f = m.get(b.segmentGroupKey)) == null ? void 0 : f.componentIds.add(p.id);
    }), p.rules.forEach((b) => {
      var f, w;
      (f = m.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || f.ruleIds.add(b.id), (w = m.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(b.id);
    });
  });
  const u = [...m.values()].sort((p, b) => p.sortOrder - b.sortOrder || Qe(p.name, b.name)).map((p) => ({
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
function Cd(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((O) => [O.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((O) => [O.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((O) => {
    var D, U;
    (D = g.get(O.sourceTagId)) == null || D.add(O.derivedTagId), (U = m.get(O.derivedTagId)) == null || U.add(O.sourceTagId);
  });
  const u = new Map(e.nodes.map((O) => {
    var D;
    return [
      O.tagId,
      ((D = m.get(O.tagId)) == null ? void 0 : D.size) || 0
    ];
  })), y = new Map(e.nodes.map((O) => [O.tagId, 0])), p = e.nodes.filter((O) => u.get(O.tagId) === 0).sort((O, D) => Qe(O.name, D.name)).map((O) => O.tagId), b = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const O = p.shift();
    if (!b.has(O)) {
      b.add(O);
      for (const D of g.get(O) || [])
        y.set(D, Math.max(y.get(D) || 0, (y.get(O) || 0) + 1)), u.set(D, u.get(D) - 1), u.get(D) === 0 && p.push(D);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((O) => !b.has(O.tagId)).sort((O, D) => Qe(O.name, D.name)).forEach((O) => y.set(O.tagId, 0));
  const f = Math.max(0, ...y.values()), w = Math.max(
    t,
    240 + f * 296
  ), v = /* @__PURE__ */ new Map();
  e.nodes.forEach((O) => {
    v.has(O.segmentGroupKey) || v.set(O.segmentGroupKey, {
      key: O.segmentGroupKey,
      id: O.segmentGroupId,
      name: O.segmentGroupName,
      sortOrder: O.segmentGroupSortOrder,
      nodes: []
    }), v.get(O.segmentGroupKey).nodes.push(O);
  });
  const N = [...v.values()].sort((O, D) => O.sortOrder - D.sortOrder || Qe(O.name, D.name));
  let W = 28;
  const R = [], _ = N.map((O) => {
    const D = /* @__PURE__ */ new Map();
    O.nodes.forEach((C) => {
      const F = y.get(C.tagId) || 0;
      D.has(F) || D.set(F, []), D.get(F).push(C);
    });
    for (const C of D.values())
      C.sort((F, re) => F.segmentGroupTagSortOrder - re.segmentGroupTagSortOrder || Qe(F.name, re.name));
    const U = Math.max(1, ...[...D.values()].map((C) => C.length)), P = U * 58 + (U - 1) * 18, V = 70 + P, I = {
      ...O,
      x: 12,
      y: W,
      width: w - 24,
      height: V
    };
    for (const [C, F] of D.entries()) {
      const re = F.length * 58 + Math.max(0, F.length - 1) * 18, ee = (P - re) / 2;
      F.forEach((we, ce) => R.push({
        ...we,
        rank: C,
        x: 28 + C * 296,
        y: W + 34 + 18 + ee + ce * 76,
        width: 184,
        height: 58
      }));
    }
    return W += V + 16, I;
  }), A = new Map(R.map((O) => [O.tagId, O])), $ = e.connections.map((O) => {
    const D = A.get(O.sourceTagId), U = A.get(O.derivedTagId), P = D.x + D.width, V = D.y + D.height / 2, I = U.x, C = U.y + U.height / 2, F = Math.max(48, (I - P) * 0.48);
    return {
      ...O,
      path: `M ${P} ${V} C ${P + F} ${V}, ${I - F} ${C}, ${I} ${C}`
    };
  });
  return {
    width: w,
    height: Math.max(r, W - 16 + 28),
    nodes: R,
    connections: $,
    groups: _
  };
}
function $d(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Cd(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, m = o, u = c.nodes.map((p) => ({
      ...p,
      x: p.x + g,
      y: p.y + m
    })), y = new Map(u.map((p) => [p.tagId, p]));
    a.push(...u), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + g,
      y: p.y + m
    }))), s.push(...c.connections.map((p) => {
      const b = y.get(p.sourceTagId), f = y.get(p.derivedTagId), w = b.x + b.width, v = b.y + b.height / 2, N = f.x, W = f.y + f.height / 2, R = Math.max(48, (N - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${v} C ${w + R} ${v}, ${N - R} ${W}, ${N} ${W}`
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
function Wo(e, t = []) {
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
function Td(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Md(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: y, layout: p, listSort: b, materializationOffer: f, materializeOutgoingRules: w, materializeRule: v, message: N, normalizedQuery: W, query: R, refreshConfiguredTag: _, revealEditor: A, rules: $, save: O, segmentGroupKey: D, selectedNode: U, selectedRule: P, selection: V, setConfiguringTag: I, setDraft: C, setListSort: F, setMaterializationOffer: re, setQuery: ee, setSegmentGroupKey: we, setSelection: ce, setView: T, sortedVisibleRules: Q, sourceSlots: oe, sourceSlotsLoading: fe, updateMapping: ie, updateTag: B, view: ue, visibleComponents: Me, visibleRules: Y } = e;
  function Se(E) {
    const S = y.nodes.find((H) => H.tagId === Number(E.sourceTagId)), k = y.nodes.find((H) => H.tagId === Number(E.derivedTagId));
    return (S == null ? void 0 : S.segmentGroupKey) === (k == null ? void 0 : k.segmentGroupKey) ? S.segmentGroupKey : "cross-group";
  }
  function h() {
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
          onClick: () => C(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(In, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (E, S) => B("source", E, S == null ? void 0 : S.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !fe && oe.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (E) => I({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: E.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(In, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (E, S) => B("derived", E, S == null ? void 0 : S.label),
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
              onClick: (E) => I({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: E.currentTarget
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
            disabled: r || oe.length === 0 || s.length === 0,
            onClick: () => C((E) => ({
              ...E,
              slotMappings: [...E.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((E, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: E.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => ie(S, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...oe.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: E.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => ie(S, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => C((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((H, le) => le !== S)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${S + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((E) => !E.sourceSlotDefinitionId || !E.derivedSlotDefinitionId),
          onClick: O,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => C(null), className: o }, "Cancel")
      ])
    ]);
  }
  function K() {
    if (U) {
      const k = Y.filter((se) => Number(se.derivedTagId) === U.tagId), H = Y.filter((se) => Number(se.sourceTagId) === U.tagId), le = (se, te, xe) => n("div", {
        key: se.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, te),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${se.sourceTagName} → ${se.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          xe ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => v(se),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(se, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(se),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, U.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, U.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${U.incomingRuleCount} incoming · ${U.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (se) => I({
            tagId: U.tagId,
            tagName: U.name,
            trigger: se.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        H.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(U, H),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${H.length})`) : null,
        H.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...H.map((se) => le(se, "Derives", !0))
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
            k.map((se) => le(se, "Derived by", !1))
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
    const E = y.nodes.find((k) => k.tagId === Number(P.sourceTagId)), S = y.nodes.find((k) => k.tagId === Number(P.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (E == null ? void 0 : E.segmentGroupName) || "Ungrouped"),
          (E == null ? void 0 : E.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
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
            onClick: () => v(P, f),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => re(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        P.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : P.slotMappings.map((k, H) => n("div", {
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
          onClick: () => v(P),
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
  function M() {
    if (Me.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, W ? "No derivation relationships match your search." : "No derivation rules.");
    const E = U == null ? void 0 : U.tagId, S = /* @__PURE__ */ new Set();
    return U && (S.add(U.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === U.tagId || k.derivedTagId === U.tagId) && (S.add(k.sourceTagId), S.add(k.derivedTagId));
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
          className: `absolute rounded-xl border ${D === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const H = E === k.sourceTagId || E === k.derivedTagId, le = U != null, se = H ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: se,
              strokeWidth: H ? 2.5 : 1.5,
              opacity: le && !H ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const H = !W || k.name.toLocaleLowerCase().includes(W), le = U != null, se = S.has(k.tagId), te = (U == null ? void 0 : U.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => ce({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${te ? "border-accent bg-accent/15 ring-2 ring-accent/25" : se ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !H || le && !se ? 0.62 : 1
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
          const H = p.nodes.find((se) => se.tagId === k.sourceTagId), le = p.nodes.find((se) => se.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(H.x + H.width + le.x) / 2 - 24}px`,
              top: `${(H.y + H.height / 2 + le.y + le.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function x() {
    if (Me.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        W ? "No derivation relationships match your search." : "No derivation rules."
      );
    const E = /* @__PURE__ */ new Map();
    Q.forEach((k) => {
      const H = Se(k);
      E.has(H) || E.set(H, []), E.get(H).push(k);
    });
    const S = [
      ...y.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => E.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((k) => {
      const H = y.segmentGroups.find((te) => te.key === k), le = k === "cross-group" ? "Cross-group relationships" : (H == null ? void 0 : H.name) || "Ungrouped", se = E.get(k);
      return n("section", { key: k, "aria-label": le }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, le),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${se.length} rule${se.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${le} derivation rules` }, [
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
          ...se.map((te) => n("button", {
            key: te.id,
            type: "button",
            role: "row",
            onClick: () => ce({ type: "rule", id: te.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(P == null ? void 0 : P.id) === te.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${te.sourceTagName} → ${te.derivedTagName}` },
              `${te.sourceTagName} → ${te.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(te.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(te.edgeCount))
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
          `${$.length} rules · ${y.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          C(u()), ce(null), A();
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
          value: R,
          onChange: (E) => {
            ee(E.target.value), ce(null);
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
          value: D,
          disabled: d != null,
          onChange: (E) => {
            we(E.target.value), ce(null), C(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...y.segmentGroups.map((E) => n("option", { key: E.key, value: E.key }, E.name))
        ])
      ]),
      ue === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (E) => F(E.target.value),
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
        ].map(([E, S]) => n("button", {
          key: E,
          type: "button",
          onClick: () => {
            T(E), E === "graph" && (V == null ? void 0 : V.type) === "rule" && ce(null);
          },
          "aria-pressed": ue === E,
          className: `rounded px-3 py-1.5 text-sm font-medium ${ue === E ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, S))
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
        ue === "graph" ? M() : x()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? h() : K()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      N ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, N) : null
    ]),
    i ? n(Vr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => _(i),
      onClose: () => {
        const E = i.trigger;
        I(null), requestAnimationFrame(() => {
          E != null && E.isConnected && E.focus();
        });
      }
    }) : null
  ]);
}
function Ad({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = j([]), [a, s] = j(null), [l, d] = j([]), [c, g] = j([]), [m, u] = j(!1), [y, p] = j(!1), [b, f] = j(!1), [w, v] = j(""), [N, W] = j(""), [R, _] = j("graph"), [A, $] = j("all"), [O, D] = j(null), [U, P] = j("relationship"), [V, I] = j(null), [C, F] = j(null), re = pe(null), ee = pe(null), we = Ca().replace(/:/g, "");
  function ce() {
    requestAnimationFrame(() => {
      var q;
      return (q = re.current) == null ? void 0 : q.scrollIntoView({ block: "nearest" });
    });
  }
  async function T(q) {
    const X = await Z("/derivation-rules", q ? { signal: q } : void 0);
    i(X || []);
  }
  ye(() => {
    const q = new AbortController();
    return T(q.signal).catch((X) => {
      X.name !== "AbortError" && v(X.message || "Unable to load derived segment rules.");
    }), () => q.abort();
  }, []), ye(() => {
    const q = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: q.signal }).then((X) => d(X.definitions || [])).catch((X) => {
      X.name !== "AbortError" && d([]);
    }).finally(() => {
      q.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (p(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: q.signal }).then((X) => g(X.definitions || [])).catch((X) => {
      X.name !== "AbortError" && g([]);
    }).finally(() => {
      q.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => q.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || y)
      return;
    const q = `${a.sourceTagId}:${a.derivedTagId}`;
    ee.current !== q && (ee.current = q, s((X) => !X || Number(X.sourceTagId) !== Number(a.sourceTagId) || Number(X.derivedTagId) !== Number(a.derivedTagId) ? X : cl(X, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    y
  ]);
  function Q(q, X = !1) {
    X || D({ type: "rule", id: q.id }), ee.current = null, s({
      ruleId: q.id,
      sourceTagId: q.sourceTagId,
      sourceTagName: q.sourceTagName,
      derivedTagId: q.derivedTagId,
      derivedTagName: q.derivedTagName,
      slotMappings: q.slotMappings.map((J) => ({
        sourceSlotDefinitionId: J.sourceSlotDefinitionId,
        derivedSlotDefinitionId: J.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), v(""), ce();
  }
  function oe(q, X, J = "") {
    ee.current = null, q === "source" ? (d([]), u(X != null)) : (g([]), p(X != null)), s((L) => ({
      ...L,
      [`${q}TagId`]: X == null ? null : Number(X),
      [`${q}TagName`]: J || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function fe(q) {
    (a == null ? void 0 : a.ruleId) == null && (ee.current = null);
    const X = [T(), t == null ? void 0 : t()];
    return q.draftKind === "source" ? (u(!0), X.push(Z(`/slot-definitions/${q.tagId}`).then((J) => d(J.definitions || [])).finally(() => u(!1)))) : q.draftKind === "derived" && (p(!0), X.push(Z(`/slot-definitions/${q.tagId}`).then((J) => g(J.definitions || [])).finally(() => p(!1)))), Promise.all(X);
  }
  function ie(q, X, J) {
    s((L) => ({
      ...L,
      slotMappings: L.slotMappings.map((ne, me) => me === q ? { ...ne, [X]: J } : ne)
    }));
  }
  async function B() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const q = Wo(a, o);
    if (q) {
      v(q.message);
      return;
    }
    if (a.slotMappings.some((X) => !X.sourceSlotDefinitionId || !X.derivedSlotDefinitionId)) {
      v("Complete or remove every performer slot mapping before saving.");
      return;
    }
    f(!0), v(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let X = null;
      if (a.ruleId != null) {
        const L = await Z(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${L.deletedSegmentCount}
Removed lineage edges: ${L.removedEdgeCount}
Shared derived segments retained: ${L.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        X = L.fingerprint;
      }
      v("Saving derived segment rule…");
      const J = await Z("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: X
        })
      });
      if (await T(), D(R === "graph" ? { type: "node", id: Number(J.sourceTagId) } : { type: "rule", id: J.id }), s(null), a.ruleId == null)
        try {
          const L = await Z(
            `/derivation-rules/${J.id}/materialization/preview`,
            { method: "POST" }
          );
          I(
            L.createCount + L.linkCount > 0 ? L : null
          ), v(L.createCount + L.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          I(null), v("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        I(null), v("Derived segment rule saved. Previous materializations were removed.");
    } catch (X) {
      v(X.message || "Unable to save derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function ue(q) {
    f(!0), v("Previewing rule deletion…");
    try {
      const X = await Z(
        `/derivation-rules/${q.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${q.sourceTagName} → ${q.derivedTagName}?

Deleted segments: ${X.deletedSegmentCount}
Removed lineage edges: ${X.removedEdgeCount}
Shared derived segments retained: ${X.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const J = `derivation-rule-delete:${q.id}:${X.fingerprint}`;
      await Z(`/derivation-rules/${q.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(J),
          fingerprint: X.fingerprint
        })
      }), Oe(J), await T(), (a == null ? void 0 : a.ruleId) === q.id && s(null), (O == null ? void 0 : O.type) === "rule" && O.id === q.id && D(null), (V == null ? void 0 : V.ruleId) === q.id && I(null), v(`Rule deleted with ${X.deletedSegmentCount} exclusively derived segment${X.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (X) {
      v(X.message || "Unable to delete derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function Me(q, X = null) {
    const J = X || await Z(
      `/derivation-rules/${q.id}/materialization/preview`,
      { method: "POST" }
    );
    if (J.createCount + J.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const L = `derivation-rule-materialize:${q.id}:${J.fingerprint}`, ne = await Z(`/derivation-rules/${q.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Re(L),
        fingerprint: J.fingerprint
      })
    });
    return Oe(L), ne;
  }
  async function Y(q, X = null) {
    f(!0), v("Finding pending derivations…");
    try {
      const J = await Me(q, X);
      if (I(null), await T(), J.createdCount + J.linkedCount === 0) {
        v("Every applicable derivation is already materialized.");
        return;
      }
      v(
        `${J.createdCount} derived segment${J.createdCount === 1 ? "" : "s"} created and ${J.linkedCount} existing segment${J.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (J) {
      v(J.message || "Unable to materialize pending derivations.");
    } finally {
      f(!1);
    }
  }
  async function Se(q, X) {
    if (X.length === 0) return;
    f(!0), v(`Finding pending derivations from ${q.name}…`);
    let J = 0, L = 0;
    try {
      for (const ne of X) {
        const me = await Me(ne);
        J += me.createdCount, L += me.linkedCount;
      }
      I(null), await T(), v(J + L === 0 ? `Every outgoing derivation from ${q.name} is already materialized.` : `${J} derived segment${J === 1 ? "" : "s"} created and ${L} existing segment${L === 1 ? "" : "s"} linked from ${q.name}.`);
    } catch (ne) {
      await T().catch(() => {
      }), v(ne.message || `Unable to materialize derivations from ${q.name}.`);
    } finally {
      f(!1);
    }
  }
  const h = Wo(a, o), K = Be(
    () => Id(o, e),
    [o, e]
  ), M = N.trim().toLocaleLowerCase(), E = K.components.filter((q) => A === "all" || q.segmentGroupKeys.includes(A)).filter((q) => !M || q.nodes.some((X) => X.name.toLocaleLowerCase().includes(M))), S = E.flatMap((q) => q.rules), k = new Set(
    E.flatMap((q) => q.nodes.map((X) => X.tagId))
  ), H = Be(
    () => $d(E),
    [E]
  ), le = R === "list" ? Td(
    O,
    S,
    M.length > 0
  ) : null, se = (O == null ? void 0 : O.type) === "node" && K.nodes.find((q) => q.tagId === O.id && k.has(q.tagId)) || null, te = [...S].sort((q, X) => U === "source" ? Qe(q.sourceTagName, X.sourceTagName) || Qe(q.derivedTagName, X.derivedTagName) : U === "target" ? Qe(q.derivedTagName, X.derivedTagName) || Qe(q.sourceTagName, X.sourceTagName) : U === "materialized" ? (Number(X.edgeCount) || 0) - (Number(q.edgeCount) || 0) || Qe(q.sourceTagName, X.sourceTagName) : Qe(
    `${q.sourceTagName} ${q.derivedTagName}`,
    `${X.sourceTagName} ${X.derivedTagName}`
  ));
  return n(Md, {
    arrowMarkerId: we,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: C,
    deleteRule: ue,
    derivedSlots: c,
    derivedSlotsLoading: y,
    draft: a,
    draftIssue: h,
    editRule: Q,
    editorRef: re,
    emptyDraft: r,
    graph: K,
    layout: H,
    listSort: U,
    materializationOffer: V,
    materializeOutgoingRules: Se,
    materializeRule: Y,
    message: w,
    normalizedQuery: M,
    query: N,
    refreshConfiguredTag: fe,
    revealEditor: ce,
    rules: o,
    save: B,
    segmentGroupKey: A,
    selectedNode: se,
    selectedRule: le,
    selection: O,
    setConfiguringTag: F,
    setDraft: s,
    setListSort: P,
    setMaterializationOffer: I,
    setQuery: W,
    setSegmentGroupKey: $,
    setSelection: D,
    setView: _,
    sortedVisibleRules: te,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: ie,
    updateTag: oe,
    view: R,
    visibleComponents: E,
    visibleRules: S
  });
}
function Rd() {
  const [e, t] = j(xa), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => $o({ ...l, [a]: s }));
  }
  function i() {
    t($o(Br));
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
function Ed({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = j([]), [a, s] = j(!1), [l, d] = j(!1), [c, g] = j(""), [m, u] = j(""), [y, p] = j("all"), [b, f] = j(() => /* @__PURE__ */ new Set()), [w, v] = j(null);
  ye(() => {
    if (!e || a) return;
    const I = new AbortController();
    return d(!0), g(""), Z("/slot-definitions", { signal: I.signal }).then((C) => {
      i(C || []), s(!0);
    }).catch((C) => {
      C.name !== "AbortError" && g(C.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      I.signal.aborted || d(!1);
    }), () => I.abort();
  }, [e, a]);
  async function N() {
    d(!0), g("");
    try {
      const I = await Z("/slot-definitions");
      i(I || []), s(!0);
    } catch (I) {
      g(I.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function W() {
    const [I] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(I || []), s(!0), g("");
  }
  function R() {
    const I = w == null ? void 0 : w.trigger;
    v(null), requestAnimationFrame(() => {
      I != null && I.isConnected && I.focus({ preventScroll: !0 });
    });
  }
  function _(I) {
    f((C) => {
      const F = new Set(C);
      return F.has(I) ? F.delete(I) : F.add(I), F;
    });
  }
  const A = Be(
    () => wd(t, o),
    [t, o]
  ), $ = Be(
    () => Nd(A, m, y),
    [A, m, y]
  ), O = A.flatMap((I) => I.tags), D = O.filter((I) => I.definitions.length > 0).length, U = O.length - D, P = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], V = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${O.length} tags · ${D} with slots · ${U} without slots`
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
          P.map(([I, C]) => n("button", {
            key: I,
            type: "button",
            onClick: () => p(I),
            "aria-pressed": y === I,
            className: `rounded px-3 py-1.5 text-xs font-medium ${y === I ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, C))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => f(/* @__PURE__ */ new Set()),
          className: V
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => f(new Set(A.map((I) => I.overviewKey))),
          className: V
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
        onClick: N,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && $.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, $.map((I) => {
      const C = b.has(I.overviewKey), F = I.tags.filter((re) => re.definitions.length > 0).length;
      return n("article", {
        key: I.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => _(I.overviewKey),
          "aria-expanded": !C,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, C ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, I.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${I.tags.length} tag${I.tags.length === 1 ? "" : "s"} · ${F} with slots`
          )
        ]),
        C ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          I.tags.map((re) => n("li", {
            key: re.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: re.tagName }, re.tagName),
              re.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            re.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${re.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, re.definitions.map((ee) => n("li", {
              key: ee.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, et(ee)),
              ...(ee.genderHints || []).map((we) => n("span", {
                key: we,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, ar(we)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ee) => v({
                tagId: re.tagId,
                tagName: re.tagName,
                trigger: ee.currentTarget
              }),
              "aria-label": `Edit performer slots for ${re.tagName}`,
              className: `${V} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(Vr, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: W,
      onClose: R
    }) : null
  ]);
}
function Dd({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = j("general"), [a, s] = j([]), [l, d] = j(!1), [c, g] = j(""), [m, u] = j(""), [y, p] = j(null), [b, f] = j(!0), [w, v] = j(!1), [N, W] = j(""), [R, _] = j(!0), [A, $] = j(pa), O = As(t), D = O.map(([C]) => C);
  ye(() => {
    D.includes(o) || i(D[0] || "general");
  }, [t.effectiveMode]);
  async function U(C) {
    const F = await Z("/segment-groups", C ? { signal: C } : void 0);
    s(F || []);
  }
  ye(() => {
    const C = new AbortController();
    return U(C.signal).catch((F) => {
      F.name !== "AbortError" && g(F.message || "Unable to load tag groups.");
    }), () => C.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      f(!1);
      return;
    }
    const C = new AbortController();
    return W(""), f(!0), Promise.all([
      Z("/analysis/settings", { signal: C.signal }),
      Z("/analysis/status", { signal: C.signal })
    ]).then(([F, re]) => {
      _(!0), u((F == null ? void 0 : F.baseUrl) || ""), p(re);
    }).catch((F) => {
      if (F.name !== "AbortError") {
        if (F.status === 403) {
          _(!1), W("You do not have permission to manage the analysis service connection.");
          return;
        }
        W(F.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      C.signal.aborted || f(!1);
    }), () => C.abort();
  }, [t.effectiveMode]);
  async function P(C) {
    if (C !== t.requestedMode) {
      d(!0), g("");
      try {
        const F = await Z(
          `/preferences/transition?mode=${encodeURIComponent(C)}`
        );
        let re = !1, ee = null, we = null, ce = null, T = !1;
        if (t.requestedMode === "basic" && C === "full") {
          if (!window.confirm(Ds(
            F.recyclingBinCount,
            F.protectedRecyclingBinCount
          )))
            return;
          T = !0, F.recyclingBinCount > 0 && (re = !0, ce = F.recyclingBinFingerprint, ee = `mode-switch-empty-bin:${ce}`, we = Re(ee));
        }
        let Q = !1;
        if (t.requestedMode === "full" && C === "basic") {
          if (!window.confirm(Es(
            F.extensionOwnedSegmentCount
          )))
            return;
          Q = !0;
        }
        const oe = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: C,
            confirmHiddenExtensionOwnedSegments: Q,
            confirmBasicHistoryCleanup: T,
            emptyRecyclingBin: re,
            operationId: we,
            expectedRecyclingBinFingerprint: ce
          })
        });
        ee && Oe(ee), r == null || r(Sa(oe)), g("Workflow mode saved.");
      } catch (F) {
        g(F.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function V(C) {
    C.preventDefault(), v(!0), W("");
    try {
      const F = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((F == null ? void 0 : F.baseUrl) || "");
      const re = await Z("/analysis/status");
      p(re), W(F != null && F.baseUrl ? re != null && re.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(re == null ? void 0 : re.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (F) {
      W(F.message || "Unable to save analysis service settings.");
    } finally {
      v(!1);
    }
  }
  const I = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (C) => Ua(C, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      O.map(([C, F]) => n("button", {
        key: C,
        type: "button",
        onClick: () => i(C),
        "aria-current": o === C ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === C ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, F))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Rd)
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
      n(Ql, {
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
          onChange: (C) => {
            const F = C.target.checked;
            fa(F), $(F);
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
      n("form", { key: "form", onSubmit: V, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: m,
            onChange: (C) => u(C.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || w || !R,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || w || !R,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        N || (b ? "Loading analysis service settings…" : (y == null ? void 0 : y.configured) === !1 ? "Full Scan is not configured." : y != null && y.ready ? "Analysis service is ready." : (y == null ? void 0 : y.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    D.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Ad, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => U()
      })
    ) : null,
    D.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Ed, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => U()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Vo({ facets: e, values: t, disabled: r, onChange: o }) {
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
function Od({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, y) => u.sortOrder - y.sortOrder || String(u.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: et(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = wa(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Ea(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Ie(e.startSec)} to ${e.endSec == null ? "end of video" : Ie(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Ie(e.startSec)} → end` : `${Ie(e.startSec)} – ${Ie(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(Ft, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(ir, {
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
function Pd({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Xo, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Ls(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: wa(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Jo({ onNavigate: e, profile: t }) {
  const r = Be(() => {
    const T = ta("ext:com.midnightrider.segment-studio:segments");
    return T ? {
      ...wr,
      defaultFilter: { ...wr.defaultFilter, ...T.findFilter || {} },
      defaultObjectFilter: T.objectFilter || {}
    } : wr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = na(r), [l, d] = j(null), [c, g] = j({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = j(null), [y, p] = j(null), [b, f] = j(0), [w, v] = j(""), [N, W] = j(!0), [R, _] = j(""), A = pe(0), $ = Mo(o, i), O = $.activityTagId, D = Yt(i.slots), U = Be(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (T) => Object.keys(Yt(T)).length > 0,
    sanitize: (T) => Nr(O, Yt(T)),
    summarize: (T) => `${Object.keys(Yt(T)).length} assigned`,
    renderEditor: (T, Q) => O ? n(Vo, {
      facets: l,
      values: Yt(T),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (oe, fe) => {
        const ie = { ...Yt(T) };
        fe ? ie[oe] = Number(fe) : delete ie[oe], Q(Nr(O, ie));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [O, l, c.performerSlotsAvailable]), P = JSON.stringify($);
  ye(() => {
    if (d(null), !O) return;
    const T = new AbortController();
    return Z(`/browse/activities/${O}/facets`, { signal: T.signal }).then(d).catch((Q) => {
      Q.status === 403 ? d({ slots: [], restricted: !0 }) : Q.name !== "AbortError" && _(Q.message);
    }), () => T.abort();
  }, [O]), ye(() => {
    const T = ++A.current, Q = new AbortController();
    return W(!0), _(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify($), signal: Q.signal }).then((oe) => {
      T === A.current && g({ ...oe, totalCount: oe.totalCount ?? oe.total ?? 0 });
    }).catch((oe) => {
      if (!(T !== A.current || oe.name === "AbortError")) {
        if (oe.status === 400 && oe.message.includes("unrestricted performer read access")) {
          g((fe) => ({ ...fe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), _("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        _(oe.message);
      }
    }).finally(() => {
      T === A.current && W(!1);
    }), () => {
      A.current++, Q.abort();
    };
  }, [P, b]);
  const V = c.items.findIndex((T) => T.key === m), I = c.items[V] || null;
  function C(T) {
    s(T), a({ ...o, page: 1 });
  }
  function F(T) {
    const Q = Mo(o, T), oe = T.slots && Q.activityTagId != null && Q.slotAssignments.length > 0 ? T.slots : void 0;
    C({ ...T, slots: oe });
  }
  function re(T, Q) {
    const oe = { ...D };
    Q ? oe[T] = Number(Q) : delete oe[T], C({ ...i, slots: Nr(O, oe) });
  }
  function ee() {
    const T = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => T == null ? void 0 : T.focus());
  }
  async function we(T) {
    var fe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(T.key), v("");
    const Q = `browse-restore:${T.itemId}:${T.revision}`, oe = Re(Q);
    try {
      const ie = (B = !1) => Z(`/bin/${T.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: oe,
          expectedRevision: T.revision,
          discardMissingImage: B
        })
      });
      try {
        await ie(zr(Q));
      } catch (B) {
        if (((fe = B.payload) == null ? void 0 : fe.code) !== "missing-image" || !window.confirm(`${B.message}

Continue and discard the missing image reference?`))
          throw B;
        _r(Q), await ie(!0);
      }
      Oe(Q), m === T.key && u(null), v("Segment restored to Cove."), f((B) => B + 1);
    } catch (ie) {
      v(ie.message || "Unable to restore the segment."), ie.status === 409 && f((B) => B + 1);
    } finally {
      p(null);
    }
  }
  async function ce(T) {
    p(T.key), v("");
    try {
      const Q = await Z(`/items/${T.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: T.revision })
      });
      if (!Ta(Q, v) || !Vs(Q))
        return;
      const oe = `browse-dependency-delete:${T.itemId}:${Q.fingerprint}`;
      await Z(`/items/${T.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(oe),
          fingerprint: Q.fingerprint
        })
      }), Oe(oe), m === T.key && u(null), v(`${Q.deletedSegmentCount} segment${Q.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), f((fe) => fe + 1);
    } catch (Q) {
      v(Q.message || "Unable to permanently delete the segment."), Q.status === 409 && f((oe) => oe + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(Wr, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(ra, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: N,
      error: R ? new Error(R) : null,
      onRetry: () => f((T) => T + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? To.filter((T) => T.id !== "performers") : To,
      objectFilter: i,
      onObjectFilterChange: F,
      customFilterSections: U,
      searchPlaceholder: "Search segments..."
    }, [
      O ? n(Vo, { key: "slots", facets: l, values: D, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: re }) : null,
      n(Pd, { key: "player", item: I, index: V, count: c.items.length, onPrevious: () => {
        var T;
        return u((T = c.items[V - 1]) == null ? void 0 : T.key);
      }, onNext: () => {
        var T;
        return u((T = c.items[V + 1]) == null ? void 0 : T.key);
      }, onClose: ee, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !N && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      N ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((T) => n(Od, {
        key: T.key,
        item: T,
        selected: T.key === m,
        busy: y === T.key,
        onSelect: () => u(T.key),
        onRestore: we,
        onPurge: ce
      })))
    ])
  ]);
}
function Ld({ onNavigate: e, profile: t }) {
  const [r, o] = j([]), [i, a] = j(""), [s, l] = j(0), [d, c] = j(!0), [g, m] = j(null), [u, y] = j(""), p = pe(null);
  async function b(v) {
    const N = await Z("/bin", v ? { signal: v } : void 0);
    return o(N.items || []), a(N.fingerprint || ""), l(Number(N.totalCount) || 0), N;
  }
  ye(() => {
    const v = new AbortController();
    return c(!0), b(v.signal).catch((N) => {
      N.name !== "AbortError" && y(N.message);
    }).finally(() => {
      v.signal.aborted || c(!1);
    }), () => v.abort();
  }, []), ea(jr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var v;
      return (v = p.current) == null ? void 0 : v.call(p);
    }
  }]);
  async function f(v) {
    var R;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(v.itemId), y("");
    const N = `restore:${v.itemId}:${v.revision}`, W = Re(N);
    try {
      const _ = (A = !1) => Z(`/bin/${v.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: W, expectedRevision: v.revision, discardMissingImage: A })
      });
      try {
        await _(zr(N));
      } catch (A) {
        if (((R = A.payload) == null ? void 0 : R.code) !== "missing-image" || !window.confirm(`${A.message}

Continue and discard the missing image reference?`)) throw A;
        _r(N), await _(!0);
      }
      Oe(N), await b(), Nn(), y("Segment restored with a new native ID.");
    } catch (_) {
      y(_.message || "Unable to restore the segment."), _.status === 409 && await b();
    } finally {
      m(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const v = await Aa({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          m(-1), y("");
        });
        if (v.status !== "emptied") return;
        await b(), Nn(), y(`${v.segmentCount} segment${v.segmentCount === 1 ? "" : "s"} from ${v.sceneCount} scene${v.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (v) {
        y(v.message || "Unable to empty the recycling bin."), v.status === 409 && await b();
      } finally {
        m(null);
      }
  }
  return p.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(Wr, {
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
        onClick: w,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, g === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    u ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, u) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((v) => n("article", { key: v.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${v.tagName || "Tag segment"} · ${v.videoTitle || `Video ${v.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, v.endSec == null ? Ie(v.startSec) : `${Ie(v.startSec)} – ${Ie(v.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${v.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${v.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => f(v), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Yo = "ext:com.midnightrider.segment-studio:videos";
function $r({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = Be(() => {
    var P;
    const D = ta(Yo), U = (P = D == null ? void 0 : D.uiOptions) == null ? void 0 : P.displayMode;
    return D ? {
      ...kn,
      defaultFilter: { ...kn.defaultFilter, ...D.findFilter || {} },
      defaultObjectFilter: D.objectFilter || {},
      defaultDisplayMode: kn.allowedDisplayModes.includes(U) ? U : kn.defaultDisplayMode
    } : kn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = na(i), [m, u] = j({ items: [], totalCount: 0 }), [y, p] = j(!0), [b, f] = j(""), [w, v] = j(0), N = pe(0), W = JSON.stringify(a), R = JSON.stringify(s), _ = t || r === "review";
  ye(() => {
    const D = ++N.current, U = new AbortController();
    return p(!0), f(""), Z(`/videos?${Vl(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: U.signal }).then((P) => {
      D === N.current && u(P);
    }).catch((P) => {
      D === N.current && P.name !== "AbortError" && f(P.message || "Unable to discover videos.");
    }).finally(() => {
      D === N.current && p(!1);
    }), () => {
      N.current++, U.abort();
    };
  }, [W, R, t, r, w]);
  function A(D) {
    d({ ...D, page: D.page || 1 });
  }
  function $(D) {
    c(D), d({ ...a, page: 1 });
  }
  const O = t || r === "review" ? _o : _o.filter((D) => !["reviewState", "shotBoundaries"].includes(D.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(Wr, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(ra, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Yo,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: A,
      totalCount: m.totalCount,
      isLoading: y,
      error: b ? new Error(b) : null,
      onRetry: () => v((D) => D + 1),
      sortOptions: t || r === "review" ? [...zo, { value: "unreviewed_count", label: "Unreviewed count" }] : zo,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: O,
      objectFilter: s,
      onObjectFilterChange: $,
      searchPlaceholder: "Search Segment Studio videos..."
    }, [
      !y && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !y && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((D) => n(Jl, { key: D.videoId, item: D, onNavigate: e, showReviewStates: _ }))) : null,
      !y && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((D) => n(Yl, { key: D.videoId, item: D, onNavigate: e, showReviewStates: _ }))) : null
    ])
  ]);
}
function Zo({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = j(null), [s, l] = j(!0), [d, c] = j(""), g = pe(0), m = pe(0), u = pe(e), y = Ol();
  u.current = e;
  const p = (N) => `/videos/${N}/editor`;
  async function b(N, W, R) {
    const _ = await Z(p(W), R ? { signal: R.signal } : void 0);
    return Dt(N, R ? g.current : m.current, W, u.current) ? (a(_), !0) : !1;
  }
  ye(() => {
    const N = ++g.current, W = e, R = new AbortController();
    return a(null), l(!0), c(""), b(N, W, R).catch((_) => {
      Dt(N, g.current, W, u.current) && _.name !== "AbortError" && c(_.message || "Unable to load the editor.");
    }).finally(() => {
      Dt(N, g.current, W, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, R.abort();
    };
  }, [e]);
  function f(N, W) {
    a((R) => (R == null ? void 0 : R.video.id) !== W ? R : typeof N == "function" ? N(R) : N);
  }
  async function w() {
    const N = e, W = ++m.current;
    try {
      const R = await Z(p(N));
      return Dt(W, m.current, N, u.current) ? (a(R), c("A newer canonical segment was loaded. Your stale change was not applied."), R) : null;
    } catch (R) {
      return Dt(W, m.current, N, u.current) && c(R.message || "Unable to reload the latest segment."), null;
    }
  }
  async function v() {
    const N = e, W = ++m.current;
    try {
      const R = await Z(p(N));
      return Dt(W, m.current, N, u.current) ? (a(R), c(""), R) : null;
    } catch (R) {
      return Dt(W, m.current, N, u.current) && c(R.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${y ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: y ? {
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
      n(Pi, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(kd, {
      key: i.video.id,
      detail: i,
      onDetailChange: f,
      onConflict: w,
      onReload: v,
      onSlotsChanged: v,
      splitLayout: y,
      profile: o,
      initialSegmentId: Ro() ? -Ro() : Fs(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Fd(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function jd(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Bd(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Gd({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Ts(o), l = Fd(e, t, window.location.pathname), d = jd(e, t, window.location.pathname), c = Bd(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Rs(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n($r, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Dd, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Jo, { onNavigate: r, profile: o });
    const y = Number(e);
    return Number.isInteger(y) && y > 0 ? n(Zo, {
      videoId: y,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n($r, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Ld, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(Jo, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(Zo, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n($r, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function Kd({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = j(null), [a, s] = j("");
  return ye(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(Sa(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Gd, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Ud(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function zd(e, t) {
  const r = Ud(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const dc = {
  components: { SegmentStudioPage: Kd },
  actionHandlers: { openSegmentStudio: zd }
};
export {
  er as CLEARED_SEGMENT_SELECTION_ID,
  zo as DISCOVERY_SORT_OPTIONS,
  wt as SEGMENT_STUDIO_CAPABILITIES,
  jr as SEGMENT_STUDIO_EXTENSION_ID,
  An as SEGMENT_STUDIO_SHORTCUTS,
  ts as activeEditorFilterCount,
  cl as applyDerivationRuleSlotSuggestions,
  jo as applyFeedbackEditorDelta,
  Lo as applySegmentMergeDelta,
  Zs as basicSegmentTimelineStyle,
  Ls as browseClipEnd,
  wa as browseEditorHref,
  Mo as buildBrowseRequest,
  Id as buildDerivationRuleGraph,
  Vl as buildDiscoverySearchParams,
  Gi as buildMinuteTimelineTicks,
  wd as buildPerformerSlotOverview,
  Us as buildSegmentQuickSearchEntries,
  fl as buildSegmentRailRows,
  yl as buildTimelineRows,
  Jd as buildTimelineTicks,
  _i as calculateCenteredTimelineScroll,
  Mr as calculateEditorPanelMaximum,
  Ki as calculateMinuteLabelStride,
  Yd as calculateMinuteTimelineWidth,
  Wi as calculateSwimlaneTitleMaximum,
  Hi as calculateTimelinePlayheadPosition,
  Gr as calculateTimelineRatioBounds,
  Ji as calculateTimelineRatioFromPointer,
  Zd as calculateVerticalRevealOffset,
  Ot as clampEditorPanelWidth,
  Zn as clampSwimlaneTitleWidth,
  ga as clampTimelineRatio,
  Kr as clampTimelineRatioForHeight,
  Xn as clampTimelineZoom,
  _l as compactProvenanceSummary,
  dc as default,
  Ws as downloadFileNameFromContentDisposition,
  ns as dualRangeValueFromPointer,
  Io as duplicateIdentityFromResponse,
  ws as duplicateOperationKey,
  es as editorVisibilityIncludingSegment,
  vl as expandedSwimlanes,
  Es as extensionOwnedSegmentsModeSwitchPrompt,
  Nl as feedbackFrameTimestamps,
  Cl as feedbackResultMatchesAction,
  Il as feedbackSelectionPlan,
  Xi as filterDerivedSegments,
  kr as filterEditorSegments,
  Nd as filterPerformerSlotOverview,
  Ks as filterSegmentQuickSearch,
  nc as filterSegmentStudioShortcuts,
  kl as findAdjacentSegmentGroupKey,
  Cs as findAdjacentShot,
  xs as findEditorShortcut,
  ua as findInitialSegmentSelection,
  Bi as findNearestSegmentInCurrentSwimlane,
  Is as findPublishedSelectionIdentity,
  We as findSegmentByStableIdentity,
  Yi as findSegmentFromPlayhead,
  ji as findSegmentNearPlayhead,
  Sl as findSwimlaneRangeSelection,
  Or as findSwimlaneSelection,
  Bs as findUniquePerformerSlotAssignment,
  ma as findUnreviewedSelection,
  ar as formatGenderHint,
  $s as frameStepSeconds,
  Na as generatePerformerSlotAssignmentRecommendations,
  ad as groupApprovedDraftsForPublishing,
  Gs as groupAutoAssignCandidates,
  $l as groupIncorrectExamplesByTag,
  cd as groupMaterializationOutputs,
  Pt as groupSegmentsIntoSwimlanes,
  bl as groupSelectedSwimlanes,
  qr as groupSwimlanesBySegmentGroup,
  ot as handleModalKey,
  Qt as hasSegmentStudioCapability,
  Bo as hideCollectedFeedbackSegments,
  al as historyActionsForTarget,
  La as indexPerformerSlotsBySegment,
  oc as initialReviewFilter,
  Al as insertSegmentProjection,
  Dt as isCurrentEditorRequest,
  nl as isEditableTarget,
  ic as isEditorShortcutOwner,
  Bd as isSegmentStudioBinRoute,
  jd as isSegmentStudioSegmentsRoute,
  Fd as isSegmentStudioSettingsRoute,
  Cd as layoutDerivationRuleComponent,
  $d as layoutDerivationRuleComponents,
  Rl as mergeSegmentsProjection,
  ll as multiSelectionActionHint,
  cs as nextSegmentAfterRemoval,
  us as nextUnreviewedAfterRemoval,
  Tt as normalizeCollapsedSegmentGroups,
  qo as normalizeDiscoveryIds,
  dt as normalizeEditorSegmentFilters,
  Ct as normalizeGender,
  Co as normalizeReviewFilter,
  Sa as normalizeSegmentStudioFeatureProfile,
  rc as normalizeSegmentStudioMode,
  Er as normalizeSegmentStudioPublicMode,
  Yt as parseBrowseSlotFilters,
  Vi as parseEditorLayout,
  Zi as parseHideDerivedSegmentsPreference,
  Qi as parseMergeConfirmationPreference,
  va as parsePlaybackShortcutConfig,
  hs as parseShortcutBindingOverrides,
  Cr as patchPerformerSlotProjection,
  rr as patchSegmentProjection,
  ms as percentageSeekTime,
  js as performInitialSegmentSeek,
  Ve as performerOptionId,
  tr as performerSlotHistoryState,
  et as performerSlotLabel,
  ul as performerSlotPresentation,
  lc as performerSlotStatus,
  Hr as performerSlotStatusFromSegmentSlots,
  Pa as performerSlotsForSegment,
  gt as provenanceSourceLabel,
  Ia as rankPerformerOptions,
  wl as reconcileSegmentGroupKey,
  ls as reconcileSelectedSegmentIds,
  Zl as recyclingBinActionText,
  Js as recyclingBinDeletionPrompt,
  Ma as recyclingBinDeletionSummary,
  Ds as recyclingBinModeSwitchPrompt,
  Pr as removeSegmentsProjection,
  Ro as requestedOwnedItemId,
  Fs as requestedSegmentId,
  os as resolveEditorSegmentSelection,
  Ns as resolveSegmentCreationAction,
  Rs as resolveSegmentStudioRoute,
  vs as resolveSegmentStudioShortcuts,
  Td as resolveSelectedDerivationRule,
  gs as resolveSelectedSegments,
  Sd as restorePublishApprovedFocus,
  Mn as restoreSegmentFieldsProjection,
  Ka as restoreSegmentsProjection,
  Ga as revealCollapsedSegmentGroup,
  Ra as segmentBadgeStyle,
  or as segmentGroupHeaderBackground,
  ut as segmentGroupKeyForSegment,
  Oa as segmentHistoryIdentity,
  Vn as segmentHistoryState,
  Ea as segmentRailItemStyle,
  ac as segmentStateStyle,
  Ud as segmentStudioActionTarget,
  Ts as segmentStudioLegacyMode,
  Ys as segmentTimelineStyle,
  lt as segmentsHistoryState,
  ds as selectAllVideoSegmentIds,
  Os as selectedBrowseStates,
  ja as selectedSwimlaneMerge,
  Ua as setBackLinkNavigation,
  il as sharedPerformerSlotShape,
  sl as sharedTagPerformerSlotShape,
  Zt as shortcutAvailableInMode,
  Ss as shortcutBindingDisplayText,
  Qd as shortcutBindingFromEvent,
  ec as shortcutBindingsOverlap,
  tc as shortcutModesOverlap,
  bs as shortcutRequiresSingleSegment,
  Qn as shotBoundaryFingerprint,
  ol as shouldAcceptCurrentTagFromEnter,
  Xd as shouldExitShortcutCapture,
  sc as shouldHandleEditorShortcut,
  Uo as shouldReloadAfterSegmentMutation,
  Rr as shouldRestoreTransitionSelection,
  zs as shouldShowQuickSearchGroups,
  wo as splitShortcutCategoriesIntoColumns,
  dl as suggestDerivationRuleSlotMappings,
  $n as swimlaneDisplayLabel,
  tl as swimlaneMarkerTop,
  Xs as swimlaneStripeBackground,
  qi as timelineContentStyle,
  xo as timelinePlayheadHorizontalStyle,
  Qs as timelineSegmentWidth,
  Ui as timelineTickAlignment,
  zi as timelineTickPosition,
  Tr as timelineTimePercent,
  xl as toggleAllCollapsedSegmentGroups,
  ks as toggledSelectionReviewState,
  bt as trapModalFocus,
  _s as tryParseJsonResponseText,
  ss as updateAnchoredSegmentSelection,
  rs as updateDualRangeValues,
  as as updateSegmentCollectionSelection,
  is as updateSegmentRangeSelection,
  ya as updateSegmentSelection,
  Wo as validateDerivationRuleDraft,
  vo as validateSegmentTiming,
  Ur as videoPerformerOptions,
  Ir as videoPerformerSlotAssignments,
  As as visibleSegmentStudioSettingsTabs,
  Ms as visibleSegmentStudioTabs,
  Fa as visibleVirtualRows
};
