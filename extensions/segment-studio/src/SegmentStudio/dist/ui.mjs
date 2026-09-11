import Er from "@cove/runtime/react";
import { createPortal as $i } from "@cove/runtime/react-dom";
import { extensionFetch as Vo } from "@cove/runtime/api";
import { formatDuration as Ti, EntityReferenceSelector as In, useExtensionKeyboardBindings as Mi, VideoPlayer as Jo, useRegisterExtensionKeyboardActions as Yo, getDefaultFilter as Zo, useListUrlState as Qo, ListPage as Xo } from "@cove/runtime/components";
import { ChevronDown as Ai, Loader2 as Ri } from "@cove/runtime/lucide-react";
const Dr = "com.midnightrider.segment-studio", ea = "segment-studio.layout.v1", Bt = "segment-studio.operations.v1", ta = "segment-studio.collapsed-segment-groups.v1", na = "segment-studio.playback-shortcuts.v1", ra = "segment-studio.timing-clipboard.v1", oa = "segment-studio.hide-derived-segments.v1", aa = "segment-studio.merge-confirmation.v1", Xe = ["unreviewed", "approved", "rejected"], Ei = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], mo = "(min-width: 1024px) and (min-height: 640px)", go = "(min-width: 1024px) and (min-height: 900px)", Cn = 1e-3, po = 15, Di = 30, ia = 12, nt = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, Or = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, wt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function fo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function sa(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? la(e, null, 1, !0) ?? r[0] ?? null;
}
function la(e, t, r, o = !1) {
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
function Oi(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, m) => g.markers.filter(({ segment: u }) => {
    const y = Number(u.startSec), p = u.endSec == null ? y + Di : Number(u.endSec);
    return Number.isFinite(y) && Number.isFinite(p) && p >= y && y <= i + po + Cn && p >= i - po - Cn;
  }).map(({ segment: u }) => ({ segment: u, laneIndex: m }))).sort((g, m) => g.laneIndex - m.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(m.segment.startSec - i) || g.segment.id - m.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((m) => m.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Pi(e, t, r) {
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
function qd(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Li(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function Wd(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Fi(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function ji(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Bi(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Gi(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Nr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Ki(e, t, r = 10) {
  const o = Nr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function yo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Ui(e, t = ia) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function da(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : nt.timelineRatio;
}
function Ir(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Ft(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? nt.detailWidth : Math.min(Ir(t, 0), Math.max(240, e));
}
function Vn(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? nt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function zi(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function Pr(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: nt.timelineRatio, maximum: nt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function Lr(e, t) {
  const r = da(e);
  if (!(t > 0)) return r;
  const o = Pr(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function _i(e) {
  if (!e) return { ...nt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? da(r) : nt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Ft(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Ft(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: Vn(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...nt };
  }
}
function Hi(e, t, r) {
  return r > 0 ? Lr((t + r - e) / r, r) : nt.timelineRatio;
}
function Vd(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function qi(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= Cn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Lt(e, t, r, o) {
  return e === t && r === o;
}
const Zn = "__segment-studio-cleared-selection__";
function Wi(e) {
  return e === "true";
}
function Vi(e) {
  return e !== "false";
}
function ca() {
  try {
    return Vi(window.localStorage.getItem(aa));
  } catch {
    return !0;
  }
}
function ua(e) {
  try {
    window.localStorage.setItem(aa, String(!!e));
  } catch {
  }
}
function Ji(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function ct(e = {}) {
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
function vr(e, t, r, o = !1, i = []) {
  var c, g;
  const a = ct(r), s = a.performerId == null ? null : new Set((t || []).filter((m) => Number(m.performerId) === a.performerId).map((m) => m.segmentId)), l = new Set((i || []).flatMap((m) => m.tags || []).map((m) => Number(m.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((m) => Number(m.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((m) => Number(m.tagId))) || []);
  return Ji(e || [], o).filter((m) => {
    if (m.reviewState != null && !a.reviewStates.includes(m.reviewState) || s && !s.has(m.id) || a.tagId != null && Number(m.tagId) !== a.tagId || d && !d.has(Number(m.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(m.tagId)) || a.sourceKey != null && m.sourceKey !== a.sourceKey) return !1;
    const u = Number(m.confidence);
    return m.confidence == null || !Number.isFinite(u) ? a.includeUnscored : u >= a.confidenceMin && u <= a.confidenceMax;
  });
}
function Yi(e, t, r, o = !1, i = []) {
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
function Zi(e, t = !1) {
  const r = ct(e);
  return +(r.reviewStates.length !== Xe.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Qi(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Xi(e, t, r, o) {
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
function es(e, t, r = null) {
  return t === Zn ? null : sa(
    e,
    t ?? r
  );
}
function ma(e, t, r, o = !1) {
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
function ts(e, t, r) {
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
function ns(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return ma(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function rs(e, t, r = null, o = !1) {
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
      ...ns(m, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: m
    };
  }
  const d = ma(i, a, t, o);
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
function os(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function as(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function bo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function ho(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => bo(t, o) - bo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function is(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((m) => (m.markers || []).some(({ segment: u }) => u.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: m }) => m.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const m of o) {
      const u = (m.markers || []).find(({ segment: y }) => !i.has(y.id));
      if (u) return u.segment;
    }
    return null;
  }
  const l = ho(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((m, u) => ({ lane: m, index: u })).filter(({ lane: m }) => (m.markers || []).some(({ segment: u }) => !i.has(u.id))).sort((m, u) => Math.abs(m.index - a) - Math.abs(u.index - a) || +(m.index < a) - +(u.index < a) || m.index - u.index)[0]) == null ? void 0 : g.lane;
  return ho(d == null ? void 0 : d.markers, s, i);
}
function ss(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function ls(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function ds(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function cs() {
  try {
    return Wi(window.localStorage.getItem(oa));
  } catch {
    return !1;
  }
}
function us(e) {
  try {
    window.localStorage.setItem(oa, String(!!e));
  } catch {
  }
}
const Mn = [
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
], ms = /* @__PURE__ */ new Set([
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
function gs(e) {
  return ms.has(e);
}
function ga(e) {
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
function ps(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Mn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ga).filter(Boolean)]));
  } catch {
    return {};
  }
}
function fs(e = {}) {
  const t = ps(e);
  return Mn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function vo(e, t = 2) {
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
function Jd(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ga({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function Yd(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Cr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function xo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function Zd(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = xo(e.code, t.key), a = xo(t.code, e.key);
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
          if (Cr(u, e) && Cr(u, t)) return !0;
        }
  return !1;
}
function on(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function Qd(e, t) {
  return [!1, !0].some((r) => on(e, r) && on(t, r));
}
function ys(e, t = !1, r = {}) {
  return fs(r).find((o) => on(o, t) && o.bindings.some((i) => Cr(e, i))) || null;
}
function pa(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function bs(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(pa).join(" / ") : "Unassigned";
}
function Xd(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, bs(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function ec(e) {
  return e === "review" ? "review" : "editor";
}
function We(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function hs(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function So(e, t) {
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
function vs(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function xs(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function $r(e, t) {
  return e === t;
}
function Ss(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function ks(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - Cn).at(-1) || null : o.find((i) => i.startSec > t + Cn) || null;
}
function Jn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ko(e) {
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
function tc(e, t = null, r = !1) {
  const o = ko(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function nn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function fa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: nn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: nn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: nn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(nn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(nn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(nn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...Or };
  }
}
function ws(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ya() {
  try {
    return fa(window.localStorage.getItem(na));
  } catch {
    return { ...Or };
  }
}
function wo(e) {
  const t = fa(JSON.stringify(e));
  try {
    window.localStorage.setItem(na, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Nt = Object.freeze({
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
function Tr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ba(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Tr(e.requestedMode) : "basic",
    effectiveMode: i ? Tr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function an(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Ns(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Is(e) {
  const t = [];
  return an(e, Nt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), an(e, Nt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function Cs(e) {
  return [
    ["general", "General", Nt.settingsGeneral],
    ["shortcuts", "Shortcuts", Nt.settingsShortcuts],
    ["performer-slots", "Performer slots", Nt.settingsPerformerSlots],
    ["derivation", "Derivation", Nt.settingsDerivation]
  ].filter(([, , r]) => an(e, r)).map(([r, o]) => [r, o]);
}
function $s(e, t) {
  return e === "segments" && !an(
    t,
    Nt.navigationSegmentInventory
  ) || e === "bin" && !an(
    t,
    Nt.recyclingBinView
  ) ? "videos" : e;
}
function Ts(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Ms(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const xr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, No = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: Xe.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function As(e) {
  const t = String(e || "").split(",").filter((r) => Xe.includes(r));
  return t.length === 0 ? [...Xe] : [...new Set(t)];
}
function rn(e) {
  return ha(e).values;
}
function ha(e) {
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
function Sr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function Io(e, t) {
  var l;
  const r = Co(t.activitiesCriterion, t.activityId), o = Co(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ha(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Rs(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function Co(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Rs(e, t) {
  return Xe.includes(e == null ? void 0 : e.value) ? [e.value] : As(t);
}
function va(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Es(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Ds(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function $o(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Os(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function He(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function Fr(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function kr(e, t) {
  const r = new Set(Fr(t).map((o) => String(He(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function $t(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function To(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map($t).sort().join(",")}`;
}
function xa(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((y) => String(y.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((y) => {
    var p;
    return !((p = y.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const y = [...e].sort((b, f) => String(b.slotDefinitionId).localeCompare(String(f.slotDefinitionId))), p = [...t].sort((b, f) => String(b.name).localeCompare(String(f.name)) || Number(He(b)) - Number(He(f)));
    return [{
      assignments: Object.fromEntries(y.map((b, f) => [String(b.slotDefinitionId), String(He(p[f]))])),
      description: p.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((y) => t.map((p, b) => ({ performer: p, index: b })).filter(({ performer: p }) => {
    var b;
    return !((b = y.genderHints) != null && b.length) || y.genderHints.some((f) => $t(f) === $t(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((y) => y.length > 0).length : Mo(c, t.length);
  if (g === 0) return [];
  const m = new Map(t.map((y, p) => [String(He(y)), p]));
  function u(y, p, b) {
    if (s.length >= a) return;
    const f = c.slice(y), w = i ? f.filter((C) => C.length > 0).length : Mo(f.map((C) => C.filter((q) => !p.has(String(He(t[q]))))), t.length);
    if (b + w < g) return;
    if (y === e.length) {
      if (b !== g) return;
      const C = Object.fromEntries(d.map(({ slot: E, performer: N }) => [String(E.slotDefinitionId), N ? String(He(N)) : ""])), q = o.length === 0 ? Object.values(C).sort().join(",") : [...new Set(e.map((E) => String(E.label || "")))].map((E) => `${E}:${d.filter(({ slot: N }) => String(N.label || "") === E).map(({ performer: N }) => N ? String(He(N)) : "").sort().join(",")}`).join("|");
      !l.has(q) && s.length < a && (l.add(q), s.push({
        assignments: C,
        description: d.map(({ slot: E, performer: N }) => o.length ? `${E.label}: ${(N == null ? void 0 : N.name) || "Unassigned"}` : (N == null ? void 0 : N.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const v = e[y], I = [...d].reverse().find(({ slot: C }) => To(C) === To(v)), H = I ? m.get(String(He(I.performer))) : -1;
    for (const C of c[y]) {
      const q = t[C], E = He(q);
      if (!(C < H) && !(E == null || !i && p.has(String(E))) && (d.push({ slot: v, performer: q }), i || p.add(String(E)), u(y + 1, p, b + 1), i || p.delete(String(E)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: v, performer: null }), u(y + 1, p, b), d.pop();
  }
  return u(0, /* @__PURE__ */ new Set(), 0), s;
}
function Mo(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Ps(e, t) {
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
      !o && d.has(m.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((u) => $t(u) === $t(m.gender)) || (a.push({ slot: c, performer: m }), o || d.add(m.performerId), s(l + 1, d), o || d.delete(m.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Ls(e) {
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
function Fs(e, t, r = 20) {
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
function js(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Bs(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function Sa(e, t, r) {
  const o = He, i = new Set((t || []).map(o)), a = new Set((r || []).map($t));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const m = $t(l.gender || l.genderIdentity), u = $t(d.gender || d.genderIdentity), y = l.matchesGenderHint ?? a.has(m);
    return (d.matchesGenderHint ?? a.has(u)) - y || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ge, useId: ka, useMemo: je, useRef: me, useState: P } = Er, n = Er.createElement, wa = "/api/plugins/segment-studio";
function Re(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Bt) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Mr();
    return t[e] = r, window.localStorage.setItem(Bt, JSON.stringify(t)), r;
  } catch {
    return Mr();
  }
}
function Ee(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Bt) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(Bt, JSON.stringify(t));
  } catch {
  }
}
function jr(e) {
  try {
    return JSON.parse(window.localStorage.getItem(Bt) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function Br(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(Bt) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(Bt, JSON.stringify(t));
  } catch {
  }
}
function Gs(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Ks(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function Q(e, t, r = 0) {
  var d;
  const o = await Vo(`${wa}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Gs(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Ks(250 * (r + 1), t == null ? void 0 : t.signal), Q(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Us(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${wa}${e}`, o = await Vo(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: zs(
      o.headers.get("Content-Disposition")
    )
  };
}
function zs(e, t = "segment-studio-ai-feedback.zip") {
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
function ke(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Mr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function Na(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function _s(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function Ia(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Hs(e, t) {
  const { sceneCount: r, segmentCount: o } = Ia(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function Ca(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = Ia(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Hs(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Q("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Re(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Ee(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function Ao({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const ft = {
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
function nc(e, t) {
  return {
    ...(ft[e] || ft.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function $a(e) {
  return { ...(ft[e] || ft.unreviewed).badge };
}
function Ta(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const Ma = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function qs(e, t, r = "not-applicable", o = !1) {
  const i = ft[e] || ft.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Ws(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Vs(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Js(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Ys(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function tr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Zs(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function Gt({ state: e, includeLabel: t = !0 }) {
  const r = ft[e] || ft.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: $a(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function Qs(e, t = null) {
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
function rc(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function Xs(e, t = document) {
  return !(e.defaultPrevented || Qs(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function oc(e, t = document, r = !1, o = {}) {
  return Xs(e, t) ? ys(e, r, o) != null : !1;
}
function rt(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option" || e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function el(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function vt(e) {
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
function tl(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function Aa(e, t = !0) {
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
function Hn(e, t = !0) {
  return {
    type: "segment",
    identity: Aa(e, t),
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
      identity: Aa(r, t),
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
function Qn(e) {
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
function Ra(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Ea(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function Gr(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function nl(e, t) {
  const r = (t || []).map((i) => Ra(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: et(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function rl(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : nl(e, t);
}
function ol({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function ac(e, t) {
  return Gr(Ra(e, t));
}
function et(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function al(e, t) {
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
function il(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = al(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function sl(e) {
  const t = et(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(nr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function nr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function Xn(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function Ro(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: Xn(o),
    trackCount: Math.max(1, t.length)
  };
}
function ll(e) {
  const t = e.map(et), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function dl(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((m) => Number(m.performerId) > 0) ? d.map((m) => `${m.slotDefinitionId}:${Number(m.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [Ro({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = ll(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), m = o.length === 1 ? l.slots : g, u = m.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), y = [...new Map(m.map((b) => [
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
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(Ro);
}
function jt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => dl(s, a));
}
function Kr(e) {
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
const cl = {
  group: 38,
  lane: 33,
  segment: 41
};
function ul(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = cl[s.kind];
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
function Da(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function ml(e, t = [], r = !0) {
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
function gl(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: Xn(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return Kr(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: Xn(a)
    };
  });
}
function Oa(e, { nativeOnly: t = !1 } = {}) {
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
function Eo(e, t) {
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
function Mt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function $n(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function pl(e) {
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
    }, o ? pl(e.name) : "—"),
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
function Pa({ assignments: e, className: t = "" }) {
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
function rr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = me(null), i = `performer-slots-${ka()}`, [a, s] = P(null);
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
  ge(() => {
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
    a ? $i(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Pa, {
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
function fl(e, t) {
  const r = new Set(Mt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function La(e, t) {
  return t ? Mt(e).filter((r) => r !== t) : Mt(e);
}
function yl(e, t) {
  const r = Mt(t), o = new Set(Mt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function pt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function Do(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, m = d <= o && g >= o, u = m ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: m, distance: u, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function Ar(e, t, r, o = null) {
  var g, m, u, y, p, b;
  const i = e.findIndex((f) => f.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const f = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && f.sort((w, v) => Do(w, v, o)), ((m = f[0]) == null ? void 0 : m.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((f) => f.segment.id === t);
  if (r === "left" || r === "right") {
    const f = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + f));
    return ((u = a.markers[w]) == null ? void 0 : u.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((y = a.markers[s]) == null ? void 0 : y.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((b = [...e[l].markers].sort(c ? (f, w) => Do(f, w, Number(o)) : (f, w) => Math.abs(f.segment.startSec - d) - Math.abs(w.segment.startSec - d) || f.segment.startSec - w.segment.startSec || f.segment.id - w.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function bl(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = Ar([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function hl(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function vl(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function xl(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [Fo(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => Fo(Math.min(s, r + l))))];
}
function Sl(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function kl(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function Oo(e, t) {
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
function Po(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function wl(e) {
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
async function Nl(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await Lo(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = xl(
        d.startSec,
        d.endSec
      );
      for (const [m, u] of g.entries()) {
        Math.abs(r.currentTime - u) > 5e-4 && (r.currentTime = u, await Lo(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const y = await Il(o), p = `example-${l + 1}-frame-${m + 1}`;
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
function Lo(e, t) {
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
function Il(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function Fo(e) {
  return Math.round(e * 1e3) / 1e3;
}
function er(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Cl(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function $l(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Tl(e, t) {
  const r = [...t || []].sort((l, d) => l.startSec - d.startSec || l.id - d.id), o = r[0];
  if (!o) return e;
  const i = new Set(r.slice(1).map((l) => l.id)), a = r.map((l) => l.endSec).filter(Number.isFinite), s = {
    ...o,
    startSec: r[0].startSec,
    endSec: a.length > 0 ? Math.max(...a) : null,
    sourceKey: "user",
    sourceRunId: null,
    confidence: null,
    isDerived: !1
  };
  return {
    ...e,
    segments: (e.segments || []).filter((l) => !i.has(l.id)).map((l) => l.id === o.id ? s : l).sort((l, d) => l.startSec - d.startSec || l.id - d.id)
  };
}
function jo(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Ml(e) {
  const { compatibilityMode: t, currentTime: r, detail: o, editorFilters: i, endInput: a, hideDerivedSegments: s, historyRef: l, mediaDuration: d, onConflict: c, onDetailChange: g, onReload: m, optimisticSegmentIdRef: u, pendingDuplicateRef: y, pendingFirstSegmentStartSecRef: p, pendingTagEditSegmentIdRef: b, replaceSegmentSelection: f, savingSegmentId: w, segments: v, selectedSegment: I, selectedSegmentIdRef: H, selectedSegments: C, selectionAnchorIdRef: q, selectionRangeBaseIdsRef: E, setEditorFilters: N, setFirstSegmentTagOpen: T, setHideDerivedSegments: F, setHistory: J, setHistoryOpen: j, setPublishApprovedError: V, setSaveMessage: M, setSavingSegmentId: $, setSelectedSegmentGroupKey: L, setSelectedSegmentId: ne, setSelectedSegmentIds: X, startInput: we, timelineDuration: ue, video: A } = e;
  function ee(h) {
    l.current = h || wt, J(l.current);
  }
  async function B(h, z, R, x, D = null) {
    var S;
    try {
      const k = await Q(`/videos/${A.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: l.current.revision,
          kind: h,
          label: z,
          beforeState: R,
          afterState: x,
          receiptId: D
        })
      });
      return ee(k), !0;
    } catch (k) {
      return k.status === 409 && ((S = k.payload) != null && S.current) && ee(k.payload.current), M("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function se(h, z, R = !0, x = null, D = !1, S = z) {
    var le;
    if (!h || w != null) return null;
    const k = R && !t ? crypto.randomUUID() : null;
    $(h.id), M(R ? "Saving directly to Cove…" : "Restoring history…");
    const _ = D ? er(o, [h.id], S) : null;
    _ && g(_, A.id);
    try {
      if (t && h.nativeSegmentId == null && h.itemId != null) {
        const K = `draft-update:${A.id}:${h.itemId}:${h.revision}:${z.tagId}:${z.startSec}:${z.endSec ?? "open"}:${z.reviewState ?? h.reviewState}`, Z = await Q(`/videos/${A.id}/drafts/${h.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(K),
            expectedRevision: h.revision,
            startSec: z.startSec,
            endSec: z.endSec,
            tagId: z.tagId,
            reviewState: z.reviewState
          })
        });
        Ee(K);
        const Y = {
          ...h,
          ...Z.draft,
          id: h.id,
          itemId: h.itemId
        };
        return R && await B(
          "segment.update",
          x || "Changed segment",
          Hn(h, t),
          Hn(
            Y,
            t
          )
        ), jo(h, z, t) ? await m() : g({
          ...o,
          approvedSetVersion: Z.approvedSetVersion || o.approvedSetVersion,
          segments: v.map((O) => O.id === h.id ? Y : O).sort((O, re) => O.startSec - re.startSec || O.id - re.id)
        }, A.id), M(((le = Z.draft) == null ? void 0 : le.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Y;
      }
      const ae = await Q(`/videos/${A.id}/segments/${h.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...z,
          expectedUpdatedAt: h.updatedAt,
          historyReceiptId: k
        })
      }), te = {
        ...h,
        ...ae,
        reviewState: z.reviewState ?? h.reviewState
      }, xe = v.map((K) => K.id === h.id ? te : K).sort((K, Z) => K.startSec - Z.startSec || K.id - Z.id);
      return jo(h, z, t) ? await m() : g({ ...o, segments: xe }, A.id), R && await B(
        "segment.update",
        x || "Changed segment",
        Hn(h, t),
        Hn(
          te,
          t
        ),
        k
      ), M(R ? "Saved to Cove" : "History restored"), te;
    } catch (ae) {
      return D && g(o, A.id), ae.status === 409 ? (M("Conflict — loading the latest segment…"), await c()) : M(ae.message || "Unable to save the segment."), null;
    } finally {
      $(null);
    }
  }
  async function oe() {
    if (!t) return !1;
    const h = v.filter((R) => !R.published && R.reviewState === "approved").length;
    if (h === 0 || w != null) return !1;
    const z = `complete-review:${A.id}:${o.approvedSetVersion}`;
    V(""), $(-1), M(`Publishing ${h} Approved draft${h === 1 ? "" : "s"}…`);
    try {
      const R = await Q(`/videos/${A.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(z),
          expectedApprovedSetVersion: o.approvedSetVersion
        })
      });
      Ee(z), ee(wt), j(!1);
      const x = await m(), D = Ss(
        v,
        H.current,
        R.published
      ), S = D ? We(x == null ? void 0 : x.segments, D) : null;
      return S && ne(S.id), M(`${R.published.length} Approved draft${R.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (R) {
      const x = R.status === 409 ? "The approved drafts changed. Review the updated list and try again." : R.message || "Unable to publish the approved drafts.";
      return R.status === 409 && await c(), V(x), M(x), !1;
    } finally {
      $(null);
    }
  }
  async function W(h = null, z = null) {
    var K;
    if (w != null) return;
    const R = h != null ? p.current : null, x = Number.isFinite(R) ? R : r, D = Math.min(ue, x + 20);
    if (D <= x) {
      M("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const S = xs(v, I, h);
    if (S.kind === "choose-tag") {
      p.current = x, M(""), T(!0);
      return;
    }
    if (S.kind === "invalid-selection") {
      M("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: k } = S, _ = `create-draft:${A.id}:${k}:${x}`, le = t ? null : crypto.randomUUID(), ae = H.current, te = {
      ...I || {},
      id: u.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: k,
      tagName: z || (I == null ? void 0 : I.tagName) || "Tag segment",
      tagSortName: k === (I == null ? void 0 : I.tagId) && (I == null ? void 0 : I.tagSortName) || null,
      startSec: x,
      endSec: D,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, xe = Cl(o, te);
    $(-1), T(!1), g(xe, A.id), f(te.id), L(pt(
      jt(xe.segments, xe.segmentGroups || [], xe.performerSlots || []),
      te.id
    ));
    try {
      let Z;
      if (t) {
        const re = await Q(`/videos/${A.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Re(_), tagId: k, startSec: x, endSec: D })
        });
        Ee(_), Z = { itemId: (K = re.draft) == null ? void 0 : K.itemId };
      } else
        Z = { nativeSegmentId: (await Q(`/videos/${A.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: k,
            startSec: x,
            endSec: D,
            historyReceiptId: le
          })
        })).id };
      p.current = null, T(!1);
      const Y = await m(), O = We(Y == null ? void 0 : Y.segments, Z);
      O ? (t || await B(
        "segment.create",
        "Created segment",
        dt([], !1),
        dt([O], !1),
        le
      ), S.openTagEditor && (b.current = O.id), f(O.id), L(pt(
        jt(Y.segments || [], Y.segmentGroups || [], Y.performerSlots || []),
        O.id
      ))) : M("Segment created, but it could not be selected.");
    } catch (Z) {
      g(o, A.id), f(ae), h != null && T(!0), M(Z.message || "Unable to create the draft.");
    } finally {
      $(null);
    }
  }
  async function ve() {
    if (C.length !== 1 || !I || w != null) return;
    const h = r;
    if (h <= I.startSec || I.endSec != null && h >= I.endSec) {
      M("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const z = `split-draft:${I.itemId}:${I.revision}:${h}`, R = t ? null : dt([I], !1), x = t ? null : crypto.randomUUID();
    $(I.id);
    try {
      let D = null;
      t && I.nativeSegmentId == null ? (await Q(`/videos/${A.id}/drafts/${I.itemId}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(z),
          expectedRevision: I.revision,
          splitSec: h
        })
      }), Ee(z)) : D = { nativeSegmentId: (await Q(`/videos/${A.id}/segments/${I.id}/split`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedUpdatedAt: I.updatedAt,
          splitSec: h,
          historyReceiptId: x
        })
      })).id };
      const S = await m();
      if (!t) {
        const k = [
          We(S == null ? void 0 : S.segments, {
            nativeSegmentId: I.nativeSegmentId ?? I.id
          }),
          We(
            S == null ? void 0 : S.segments,
            D
          )
        ].filter(Boolean);
        await B(
          "segment.split",
          "Split segment",
          R,
          dt(k, !1),
          x
        );
      }
      M(t ? `Segment split; both ranges remain ${I.reviewState}.` : "Segment split.");
    } catch (D) {
      D.status === 409 ? await c() : M(D.message || "Unable to split the draft.");
    } finally {
      $(null);
    }
  }
  async function Ae(h = !1) {
    var D, S;
    if (C.length !== 1 || !I || w != null) return;
    const z = h ? r : I.startSec, R = vs(A.id, I, h, z), x = t ? null : crypto.randomUUID();
    $(I.id);
    try {
      const k = ((D = y.current) == null ? void 0 : D.operationKey) === R ? y.current : null;
      let _ = (k == null ? void 0 : k.duplicateIdentity) ?? null;
      if (_ == null && t && I.nativeSegmentId == null) {
        const te = await Q(`/videos/${A.id}/drafts/${I.itemId}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(R),
            expectedRevision: I.revision,
            startSec: h ? z : null
          })
        });
        _ = So(!1, te), y.current = { operationKey: R, duplicateIdentity: _ };
      } else if (_ == null) {
        const te = await Q(`/videos/${A.id}/segments/${I.id}/duplicate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: I.updatedAt,
            startSec: h ? z : null,
            historyReceiptId: x
          })
        });
        _ = So(!0, te), y.current = { operationKey: R, duplicateIdentity: _ };
      }
      const le = await m(), ae = We(le == null ? void 0 : le.segments, _);
      if (ae) {
        t || await B(
          "segment.duplicate",
          "Duplicated segment",
          dt([], !1),
          dt([ae], !1),
          x
        );
        const te = Yi(
          ae,
          le.performerSlots || [],
          i,
          s,
          le.segmentGroups || []
        );
        N(te.filters), F(te.hideDerivedSegments), X([ae.id]), ne(ae.id), q.current = ae.id, E.current = [], L(pt(
          jt(le.segments || [], le.segmentGroups || [], le.performerSlots || []),
          ae.id
        )), t && I.nativeSegmentId == null && Ee(R), y.current = null, M(h ? "Duplicate created at the playhead." : "Duplicate created in place.");
      } else
        M("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
    } catch (k) {
      ((S = y.current) == null ? void 0 : S.operationKey) === R ? M("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : k.status === 409 ? await c() : M(k.message || "Unable to duplicate the draft.");
    } finally {
      $(null);
    }
  }
  async function ie() {
    if (C.length !== 1 || !I) return;
    const h = Number(we), z = a.trim() === "" ? null : Number(a), R = fo(h, z, d);
    if (R.error) {
      M(R.error);
      return;
    }
    if (h === I.startSec && z === I.endSec) {
      M("Timing is unchanged.");
      return;
    }
    await se(I, { startSec: h, endSec: z, tagId: I.tagId }, !0, null, !0);
  }
  async function Te(h, z) {
    if (C.length !== 1 || !I) return;
    const R = fo(h, z, d);
    if (R.error) {
      M(R.error);
      return;
    }
    if (h === I.startSec && z === I.endSec) {
      M("Timing is unchanged.");
      return;
    }
    await se(I, { startSec: h, endSec: z, tagId: I.tagId }, !0, null, !0);
  }
  return { acceptHistory: ee, recordHistoryAction: B, mutateSegment: se, completeReview: oe, createSegment: W, splitSegment: ve, duplicateSegment: Ae, saveTiming: ie, applyShortcutTiming: Te };
}
function Al() {
  const [e, t] = P(() => typeof window < "u" && window.matchMedia(mo).matches);
  return ge(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(mo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Rl() {
  const [e, t] = P(() => typeof window < "u" && window.matchMedia(go).matches);
  return ge(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(go), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function El() {
  try {
    return _i(window.localStorage.getItem(ea));
  } catch {
    return { ...nt };
  }
}
function Dl() {
  try {
    return Mt(JSON.parse(window.localStorage.getItem(ta) || "[]"));
  } catch {
    return [];
  }
}
function Ol(e) {
  try {
    window.localStorage.setItem(ta, JSON.stringify(Mt(e)));
  } catch {
  }
}
function Pl(e) {
  try {
    window.localStorage.setItem(ea, JSON.stringify(e));
  } catch {
  }
}
function Ll() {
  try {
    const e = JSON.parse(window.localStorage.getItem(ra) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Fl(e) {
  try {
    return window.localStorage.setItem(ra, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function jl({ status: e }) {
  const t = Ma[e];
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
      ...$a(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${ft[t].symbol}${e[t]}`)));
}
function Bl({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onSaved: s, onConflict: l, confirmRef: d, shortcutRef: c }) {
  const g = Fr(a), [m, u] = P(() => kr(o, g)), [y, p] = P(!1), [b, f] = P(""), w = me(!1), v = o.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join("|"), I = g.map((N) => He(N)).join("|"), H = xa(
    o,
    g
  );
  ge(() => {
    u(kr(o, g)), f("");
  }, [t, r, v, I]);
  async function C(N = m) {
    if (!w.current) {
      w.current = !0, p(!0), f("Saving performer slots…");
      try {
        const T = kr(o.map((J) => ({
          ...J,
          performerId: N[J.slotDefinitionId] || null
        })), g), F = await Q(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((J) => ({ slotDefinitionId: J.slotDefinitionId, performerId: T[J.slotDefinitionId] ? Number(T[J.slotDefinitionId]) : null }))
          })
        });
        f("Performer slots saved."), s(F, {
          beforeState: Qn([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Qn([{
            segmentId: t,
            itemId: r,
            revision: F.revision,
            slots: F.slots || []
          }])
        });
      } catch (T) {
        T.status === 409 ? (f("Slot definitions or assignments changed; current values were reloaded."), l()) : f(T.message || "Unable to save performer slots.");
      } finally {
        w.current = !1, p(!1);
      }
    }
  }
  function q(N, T) {
    f(`Option ${T + 1} applied; save to confirm.`), u({ ...m, ...N.assignments });
  }
  async function E(N) {
    const T = { ...m, ...N.assignments };
    u(T), await C(T);
  }
  return ge(() => {
    if (c)
      return c.current = (N) => w.current || !H[N] ? !1 : (E(H[N]), !0), () => {
        c.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    H.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, H.map((N, T) => n("button", {
        key: T,
        type: "button",
        disabled: y,
        onClick: () => q(N, T),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${T + 1}: ${N.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, T + 1),
        n("span", { key: "description" }, N.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${H.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((N) => n("label", { key: N.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(N)),
      (N.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(N.genderHints || []).map(nr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[N.slotDefinitionId] || "", disabled: y, onChange: (T) => u({ ...m, [N.slotDefinitionId]: T.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Sa(g, g, N.genderHints).map((T) => n("option", { key: He(T), value: He(T) }, T.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: d, type: "button", disabled: y, onClick: () => C(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)])
  ]);
}
function Gl({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var q;
  const s = ((q = t[0]) == null ? void 0 : q.slots) || [], l = Fr(r), d = xa(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((E, N) => {
    const T = t.map((F) => {
      var J;
      return String(((J = F.slots[N]) == null ? void 0 : J.performerId) || "");
    });
    return [E.slotDefinitionId, T.every((F) => F === T[0]) ? T[0] : c];
  })), [m, u] = P(g), [y, p] = P(!1), [b, f] = P(""), w = me(!1), v = t.map((E) => `${E.itemId ?? `native:${E.segmentId}`}:${E.revision}:${E.slots.map((N) => `${N.slotDefinitionId}:${N.performerId || ""}`).join(",")}`).join("|");
  ge(() => {
    u(g());
  }, [v]);
  async function I(E = m) {
    if (w.current) return;
    w.current = !0, p(!0), f(`Saving performer slots for ${t.length} segments…`);
    const N = [];
    try {
      for (const T of t) {
        const F = T.slots.map((j, V) => {
          const M = E[s[V].slotDefinitionId];
          return {
            slotDefinitionId: j.slotDefinitionId,
            performerId: M === c ? j.performerId || null : M ? Number(M) : null
          };
        }), J = await Q(T.itemId != null ? `/videos/${e}/drafts/${T.itemId}/slots` : `/videos/${e}/segments/${T.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: T.revision, assignments: F })
        });
        N.push({
          segmentId: T.segmentId,
          itemId: T.itemId,
          revision: J.revision,
          slots: J.slots || []
        });
      }
      f("Performer slots saved."), o({
        beforeState: Qn(t),
        afterState: Qn(N)
      });
    } catch (T) {
      const F = await i();
      T.status === 409 ? f(F ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : f(T.message || (F ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function H(E, N) {
    f(`Option ${N + 1} applied; save to confirm.`), u({ ...m, ...E.assignments });
  }
  async function C(E) {
    const N = { ...m, ...E.assignments };
    u(N), await I(N);
  }
  return ge(() => {
    if (a)
      return a.current = (E) => w.current || !d[E] ? !1 : (C(d[E]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((E, N) => n("button", {
        key: N,
        type: "button",
        disabled: y,
        onClick: () => H(E, N),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${N + 1} to all selected segments: ${E.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, N + 1),
        n("span", { key: "description" }, E.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((E) => n("label", {
      key: E.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, et(E)),
      n("select", {
        key: "select",
        value: m[E.slotDefinitionId] || "",
        disabled: y,
        onChange: (N) => u({ ...m, [E.slotDefinitionId]: N.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        m[E.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...Sa(l, l, E.genderHints).map((N) => n("option", {
          key: He(N),
          value: He(N)
        }, N.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: y,
        onClick: () => I(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function yt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Kl(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return yt(t);
  const o = [...new Set(r.map((i) => yt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function or() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function qn({ name: e }) {
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
function Ul({ hidden: e }) {
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
    n(or, { key: "derived" })
  ]);
}
function zl({ segment: e, provenance: t }) {
  var g;
  const [r, o] = P(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Kl(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
            yt(m.sourceKey, m.sourceDisplayName)
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
function _l({
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
  const [m, u] = P([]), y = e.flatMap((w) => w.lanes.map((v) => v.key)), p = y.join("|");
  ge(() => {
    const w = new Set(y);
    u((v) => v.filter((I) => w.has(I)));
  }, [p]);
  const b = Xn(t), f = !!Oa(
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
      a ? n(Tt, { key: "counts", counts: b }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      ol({ mergeable: f, reviewable: a, tagEditable: s, slotsEditable: l })
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
        const I = m.includes(v.key), H = v.markers.some(({ segment: q }) => q.id === r), C = `selected-segment-lane-${v.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: v.key,
          "data-selected-segment-lane": v.key,
          className: `rounded-md border ${H ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": I,
            "aria-controls": C,
            "aria-current": H ? "true" : void 0,
            onClick: () => u((q) => I ? q.filter((E) => E !== v.key) : [...q, v.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, I ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, $n(v)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(v.selectedCount)),
            a ? n(Tt, { key: "states", counts: v.counts }) : null
          ]),
          I ? n("div", {
            key: "segments",
            id: C,
            className: "space-y-1 border-t border-border p-1.5"
          }, v.markers.map(({ segment: q }) => {
            const E = q.endSec == null ? ke(q.startSec) : `${ke(q.startSec)} – ${ke(q.endSec)}`;
            return n("button", {
              key: q.id,
              type: "button",
              onClick: () => i(q),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${q.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${q.tagName || "Segment"}, ${q.reviewState}, ${E}` : `${q.tagName || "Segment"}, ${E}`,
              "aria-current": q.id === r ? "true" : void 0
            }, [
              a ? n(Gt, {
                key: "state",
                state: q.reviewState,
                includeLabel: !1
              }) : null,
              q.isDerived ? n(or, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, E),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                yt(q.sourceKey)
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
}, Bo = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], Go = [
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
function Fa(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Ko(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function Wn(e, t, r, o = null) {
  const i = Ko(t), a = Ko(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Hl(e, t, r = null) {
  var m, u, y;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (m = t.hasSegmentsCriterion) == null ? void 0 : m.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), Wn(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), Wn(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), Wn(o, t.performersCriterion, "performer"), Wn(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = Uo(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = Uo(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((u = t.reviewStateCriterion) == null ? void 0 : u.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (y = t.shotBoundariesCriterion) == null ? void 0 : y.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function Uo(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function ja({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(Ao, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, Xe.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = ft[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(Ao, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function ql({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
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
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, Ti(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(ja, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Wl({ item: e, onNavigate: t, showReviewStates: r = !1 }) {
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
      n(ja, { key: "segments", item: e, showReviewStates: r })
    ]),
    n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
  ]));
}
function Ur({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Is(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => An(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && an(
        o,
        Nt.recyclingBinView
      ) ? n(Ba, { key: "bin", onNavigate: t }) : null,
      n(Ga, { key: "settings", onNavigate: t })
    ])
  ]);
}
const Rr = "segment-studio:recycling-bin-changed";
function Vl(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Nn() {
  window.dispatchEvent(new CustomEvent(Rr));
}
function Ba({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = P(null);
  ge(() => {
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
    return l(), window.addEventListener(Rr, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(Rr, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Vl(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => An(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ga({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => An(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function Jl({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Tr(i.target.value);
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
function Yl({ minimum: e, maximum: t, onChange: r }) {
  const o = me(null), [i, a] = P("maximum"), s = (u, y) => {
    const p = Xi(e, t, u, y);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (u, y) => {
    var b;
    const p = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    p && s(u, Qi(y.clientX, p.left, p.width));
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
function Zl({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = me(null);
  ge(() => {
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
    onKeyDownCapture: (s) => rt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
function Ql({
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
  const m = ct(e), u = [...new Map((a || []).map((f) => [
    Number(f.tagId),
    f.tagName || `Tag ${f.tagId}`
  ])).entries()].sort((f, w) => f[1].localeCompare(w[1]) || f[0] - w[0]), y = (f) => d(ct({ ...m, ...f })), p = (f) => y({
    reviewStates: m.reviewStates.includes(f) ? m.reviewStates.filter((w) => w !== f) : [...m.reviewStates, f]
  }), b = (f) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${f ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (f) => {
      f.target === f.currentTarget && g();
    },
    onKeyDownCapture: (f) => rt(f, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
          const w = m.reviewStates.includes(f), v = ft[f];
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
            const w = Number(He(f));
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
          }, yt(f)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Yl, {
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
        n(Ul, { key: "icon", hidden: t }),
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
function Xl({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Mn.filter((l) => on(l, e)), i = vo(o, 1)[0], a = vo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(pa)).map((m, u) => n("kbd", { key: `${g.id}:${u}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, m))
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
    onKeyDownCapture: (l) => rt(l, { onCancel: r })
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
function ed({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = wl(e), [l, d] = P([]), c = s.map((g) => g.tagName).join("|");
  return ge(() => {
    const g = new Set(s.map((m) => m.tagName));
    d((m) => m.filter((u) => g.has(u)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => rt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
            style: { background: tr(!1) }
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
            const b = `${ke(p.startSec)}${p.endSec == null ? "" : ` – ${ke(p.endSec)}`}`, f = r === p.id;
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
function td({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = P(""), [a, s] = P(0), l = me(null), d = je(() => Fs(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = Bs(d);
  ge(() => {
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
        vt(u);
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
      var C;
      const p = u.segment || u, b = p.endSec == null ? ke(p.startSec) : `${ke(p.startSec)} – ${ke(p.endSec)}`, f = `${yt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = y === c, v = y > 0 ? d[y - 1].groupKey : null, I = g && u.groupKey !== v ? n("div", {
        key: `group:${u.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, u.groupName) : null, H = n("button", {
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
        n(Gt, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (C = u.performers) != null && C.length ? n(rr, {
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
      return I ? [I, H] : [H];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function nd(e) {
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
function rd({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = je(() => nd(e), [e]), [l, d] = P([]), c = s.reduce((u, y) => u + y.drafts.length, 0), g = (u) => d((y) => y.includes(u) ? y.filter((p) => p !== u) : [...y, u]), m = (u) => `segment-studio-publish-approved-${u.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !t && a();
    },
    onKeyDownCapture: (u) => rt(u, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
            style: { background: tr(!1) }
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
            const b = p.endSec == null ? ke(p.startSec) : `${ke(p.startSec)} – ${ke(p.endSec)}`, f = `${yt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`;
            return n("div", { key: p.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(Gt, { key: "review", state: p.reviewState, includeLabel: !1 }),
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
function od({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Ls(e), [s, l] = P(() => /* @__PURE__ */ new Set()), [d, c] = P(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), m = (b) => l((f) => {
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
      b.key === "Enter" && b.target instanceof HTMLInputElement || rt(b, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
          style: { background: tr(!1) }
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
          n(Tt, { key: "states", counts: b.counts }),
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
            const w = f.endSec == null ? ke(f.startSec) : `${ke(f.startSec)} – ${ke(f.endSec)}`, v = `${yt(f.sourceKey)}${f.confidence == null ? "" : ` · ${Math.round(f.confidence * 100)}%`}`;
            return n("div", {
              key: f.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(Gt, { key: "review", state: f.reviewState, includeLabel: !1 }),
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
function ad({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => rt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
function id({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = P(!1);
  if (!e) return null;
  const d = e.endSec == null ? "open end" : ke(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (c) => {
      c.target === c.currentTarget && !t && a();
    },
    onKeyDownCapture: (c) => rt(c, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
        `${ke(e.startSec)} – ${d}`
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
function sd(e) {
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
function ld({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var g, m;
  const l = e ? e.createCount + e.linkCount : 0, d = ((g = e == null ? void 0 : e.outputs) == null ? void 0 : g.slice(0, 200)) || [], c = sd(d);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (u) => {
      u.target === u.currentTarget && !r && s();
    },
    onKeyDownCapture: (u) => rt(u, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
                `${u.rootTagName} @ ${ke(u.rootStartSec)}`
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
function dd({
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
  onSlotsChanged: f,
  onRecordHistory: w,
  splitSegment: v,
  duplicateSegment: I,
  provenance: H,
  lineage: C,
  onNavigateLineageItem: q,
  tagEditing: E,
  onCancelTagEditing: N,
  detailPanelRef: T,
  onReduceSelection: F
}) {
  var we, ue, A, ee;
  const J = me(null), j = me(null), V = me(null), M = me(null), $ = me(null), [L, ne] = P(!1);
  ge(() => {
    J.current && (J.current.scrollTop = 0), ne(!1);
  }, [t == null ? void 0 : t.id]), ge(() => {
    var B, se;
    L && ((se = (B = j.current) == null ? void 0 : B.querySelector("input, select, button")) == null || se.focus({ preventScroll: !0 }));
  }, [L]);
  function X() {
    ne(!1), requestAnimationFrame(() => {
      var B;
      return (B = p.current) == null ? void 0 : B.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const B = !r.some((W) => W.isDerived), se = e && c ? rl(m, r) : null, oe = (se == null ? void 0 : se.map((W, ve) => {
      var ie;
      const Ae = r[ve];
      return {
        segmentId: Ae.nativeSegmentId,
        itemId: Ae.published ? null : Ae.itemId,
        revision: (ie = u.performerSlotRevisions) == null ? void 0 : ie[Ae.id],
        slots: W
      };
    })) || [];
    return n(Er.Fragment, null, [
      n(_l, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: T,
        onReduceSelection: F,
        reviewable: e,
        tagEditable: B,
        slotsEditable: oe.length > 0,
        onEditSlots: () => ne(!0),
        slotButtonRef: p,
        saveMessage: i
      }),
      E && B ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (W) => {
          W.target === W.currentTarget && N();
        },
        onKeyDownCapture: (W) => rt(W, { onCancel: N })
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
          onChange: (W, ve) => W == null ? N() : s(W, ve == null ? void 0 : ve.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: N,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      L && oe.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (W) => {
          W.target === W.currentTarget && X();
        },
        onKeyDownCapture: (W) => {
          var Ae, ie;
          if (!(typeof ((Ae = W.target) == null ? void 0 : Ae.closest) == "function" ? W.target.closest("input, textarea, select, [contenteditable='true']") : null) && !W.repeat && !W.ctrlKey && !W.altKey && !W.metaKey && !W.shiftKey && /^[1-9]$/.test(W.key) && ((ie = $.current) != null && ie.call($, Number(W.key) - 1))) {
            W.preventDefault(), W.stopPropagation();
            return;
          }
          rt(W, { onCancel: X });
        }
      }, n("section", {
        ref: j,
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
          n("button", { key: "close", type: "button", onClick: X, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Gl, {
          videoId: y.id,
          targets: oe,
          performerCandidates: u.performerCandidates || [],
          shortcutRef: $,
          onSaved: async ({ beforeState: W, afterState: ve }) => {
            await w(
              "performer-slots.assign",
              `Assigned performers to ${oe.length} segments`,
              W,
              ve
            ), X(), f();
          },
          onConflict: f
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (B) => {
      J.current = B, T && (T.current = B);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(Gt, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(or, { key: "derived" }) : null,
        t && E ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (B) => {
            B.key === "Escape" && (B.preventDefault(), B.stopPropagation(), N());
          },
          onKeyDown: (B) => {
            el(B, t.tagName) && (B.preventDefault(), B.stopPropagation(), s(t.tagId));
          }
        }, n(In, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (B, se) => B == null ? N() : s(B, se == null ? void 0 : se.label),
          disabled: a != null || ((we = C.data) == null ? void 0 : we.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, ke(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, ke(t.endSec))
      ]) : null,
      e && t && (d === "empty" || d === "partial") ? n("div", { key: "slots-row" }, n(jl, { status: d })) : null,
      t && c && g.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Pa, {
        assignments: g.map((B) => {
          const se = sl(B);
          return {
            key: String(B.slotDefinitionId),
            label: se.label,
            performer: se.filled ? { id: Number(B.performerId), name: se.performer } : null,
            title: se.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(zl, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: H
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
          (ue = C.data.parents) != null && ue.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...C.data.parents.map((B) => n("button", {
              key: B.nodeId,
              type: "button",
              onClick: () => q(B.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${B.ruleKey} ${B.ruleVersion}`))
          ]) : null,
          (A = C.data.children) != null && A.length ? n("p", { key: "children" }, `Children: ${C.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: l, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: p,
          type: "button",
          disabled: !c || g.length === 0,
          onClick: () => ne(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: c ? g.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, g.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: v,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => I(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => I(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    L && e && t && c && g.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (B) => {
        B.target === B.currentTarget && X();
      },
      onKeyDownCapture: (B) => {
        var oe, W;
        if (!(typeof ((oe = B.target) == null ? void 0 : oe.closest) == "function" ? B.target.closest("input, textarea, select, [contenteditable='true']") : null) && !B.repeat && !B.ctrlKey && !B.altKey && !B.metaKey && !B.shiftKey && /^[1-9]$/.test(B.key) && ((W = M.current) != null && W.call(M, Number(B.key) - 1))) {
          B.preventDefault(), B.stopPropagation();
          return;
        }
        rt(B, {
          onCancel: X,
          onConfirm: () => {
            var ve;
            return (ve = V.current) == null ? void 0 : ve.click();
          }
        });
      }
    }, n("section", {
      ref: j,
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
        n("button", { key: "close", type: "button", onClick: X, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Bl, {
        key: `${t.id}:${u.performerSlotsRevision || u.slotRevision || ""}`,
        videoId: y.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: g,
        revision: (ee = u.performerSlotRevisions) == null ? void 0 : ee[t.id],
        performerCandidates: u.performerCandidates || [],
        confirmRef: V,
        shortcutRef: M,
        onSaved: async (B, { beforeState: se, afterState: oe }) => {
          await w(
            "performer-slots.assign",
            "Assigned performers",
            se,
            oe
          ), X(), f(B);
        },
        onConflict: f
      }))
    ])) : null
  ]);
}
function cd({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: m, onSelectGroup: u, onToggleGroup: y, onSelect: p, onSelectSegments: b, onSelectAll: f, onConfigureTag: w, onSeekTime: v, centerRef: I, showReviewState: H = !0, swimlaneTitleWidth: C, onSwimlaneTitleWidthChange: q }) {
  const E = me(null), N = me(null), [T, F] = P(0), [J, j] = P({ scrollTop: 0, height: 320 }), [V, M] = P(null), $ = je(
    () => jt(e, r, o),
    [e, r, o]
  ), L = je(
    () => Ea(o),
    [o]
  ), ne = je(() => Kr($), [$]), X = je(
    () => ml(ne, i, r.length > 0),
    [ne, i, r.length]
  ), we = je(
    () => Da(X.rows, Math.max(0, J.scrollTop - 24), J.height),
    [X, J]
  ), ue = Math.max(0, Number(d) || 0), A = zi(T), ee = Vn(C, A), B = ee / 16, se = Ki(c, ue, B), oe = Li(ue), W = Fi(ue, Math.max(1, T - B * 16), g), ve = oe.filter((S, k) => k === 0 || k % W === 0), Ae = je(() => $.map((S) => `${S.key}:${S.trackCount}:${S.markers.map(({ segment: k, track: _ }) => `${k.id}:${k.startSec}:${k.endSec ?? ""}:${_}`).join(",")}`).join("|"), [$]);
  function ie() {
    const S = N.current;
    if (!S) return;
    const k = S.querySelector("[data-timeline-track]"), _ = S.firstElementChild, le = k == null ? void 0 : k.getBoundingClientRect(), ae = _ == null ? void 0 : _.getBoundingClientRect(), te = le && ae ? Math.max(0, le.left - ae.left) : B * 16, xe = (ae == null ? void 0 : ae.width) ?? S.scrollWidth;
    S.scrollTo({
      left: Gi(c, ue, xe, S.clientWidth, te, ia),
      behavior: "smooth"
    });
  }
  ge(() => (I.current = ie, () => {
    I.current === ie && (I.current = null);
  })), ge(() => {
    ie();
  }, [g]);
  function Te() {
    const S = N.current, k = X.rows.find((xe) => xe.kind === "lane" && xe.lane.markers.some(({ segment: K }) => K.id === s));
    if (!S || !k) return;
    const _ = 24, le = k.top + _, ae = le + k.height;
    let te = S.scrollTop;
    le < S.scrollTop + _ ? te = Math.max(0, le - _) : ae > S.scrollTop + S.clientHeight && (te = Math.max(0, ae - S.clientHeight)), te !== S.scrollTop && (S.scrollTop = te), j({ scrollTop: te, height: S.clientHeight });
  }
  ge(() => {
    Te();
  }, [s, Ae, X]), ge(() => {
    const S = N.current, k = X.rows.find((xe) => xe.kind === "group" && xe.group.key === a);
    if (!S || !k) return;
    const _ = 24, le = k.top + _, ae = le + k.height;
    let te = S.scrollTop;
    le < S.scrollTop + _ ? te = Math.max(0, le - _) : ae > S.scrollTop + S.clientHeight && (te = Math.max(0, ae - S.clientHeight)), te !== S.scrollTop && (S.scrollTop = te), j({ scrollTop: te, height: S.clientHeight });
  }, [a, X]), ge(() => {
    const S = N.current;
    if (!S || typeof ResizeObserver > "u") return;
    const k = () => {
      F(S.clientWidth), j({ scrollTop: S.scrollTop, height: S.clientHeight }), Te();
    }, _ = new ResizeObserver(k);
    return _.observe(S), k(), () => _.disconnect();
  }, [s, Ae, X]);
  function h(S) {
    if (!(ue > 0)) return;
    const k = S.currentTarget.getBoundingClientRect(), _ = Math.min(1, Math.max(0, (S.clientX - k.left) / k.width));
    v(_ * ue);
  }
  function z(S) {
    const k = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let _ = null;
    Object.hasOwn(k, S.key) && (_ = c + k[S.key]), S.key === "Home" && (_ = 0), S.key === "End" && (_ = ue), _ != null && (S.preventDefault(), S.stopPropagation(), v(Math.min(ue, Math.max(0, _))));
  }
  function R(S) {
    var _;
    const k = (_ = E.current) == null ? void 0 : _.getBoundingClientRect();
    k && q(Vn(S.clientX - k.left, A));
  }
  function x(S) {
    const k = S.shiftKey ? 40 : 16;
    let _ = null;
    S.key === "ArrowLeft" && (_ = ee - k), S.key === "ArrowRight" && (_ = ee + k), S.key === "Home" && (_ = 160), S.key === "End" && (_ = A), _ != null && (S.preventDefault(), S.stopPropagation(), q(Vn(_, A)));
  }
  const D = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: E,
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
      n("button", { key: "out", type: "button", className: D, disabled: g <= 1, onClick: () => m(Yn(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: D, disabled: g === 1, onClick: () => m(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: D, disabled: g >= 8, onClick: () => m(Yn(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: D, onClick: ie, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(A),
      "aria-valuenow": Math.round(ee),
      "aria-valuetext": `${Math.round(ee)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (S) => {
        S.currentTarget.setPointerCapture(S.pointerId), R(S);
      },
      onPointerMove: (S) => {
        S.currentTarget.hasPointerCapture(S.pointerId) && R(S);
      },
      onKeyDown: x,
      onDoubleClick: () => q(nt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ee - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: N,
      onScroll: (S) => j({
        scrollTop: S.currentTarget.scrollTop,
        height: S.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ui(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${B}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": ue,
          "aria-valuenow": Math.min(ue, Math.max(0, c)),
          "aria-valuetext": ke(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: h,
          onKeyDown: z
        }, ve.map((S, k) => n("span", {
          key: S,
          className: `absolute top-0 ${ji(k, ve.length, ue > 0 ? S / ue * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Bi(k, ve.length, ue > 0 ? S / ue * 100 : 0)
        }, ke(S))).concat(t.map((S) => {
          const k = ue > 0 ? S.startSec / ue * 100 : 0;
          return n("button", {
            key: `shot-boundary:${S.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${ke(S.startSec)} – ${ke(S.endSec)}`,
            title: `Shot boundary · ${S.source || "manual"} · ${ke(S.startSec)} – ${ke(S.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${k}%`, width: "2px" },
            onClick: (_) => {
              _.stopPropagation(), v(S.startSec);
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
            ...yo(se),
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
        style: $.length > 0 ? { height: X.height } : void 0
      }, [
        $.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...yo(se, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        $.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : we.map((S) => {
          var Z;
          const k = S.group, _ = i.includes(k.key), le = a === k.key, ae = tr(le);
          if (S.kind === "group") return n("div", {
            key: S.key,
            "data-segment-group": k.key,
            "data-segment-group-collapsed": _ ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${B}rem minmax(0,1fr)`,
              backgroundColor: ae,
              top: S.top,
              height: S.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (Y) => {
                if (Y.metaKey || Y.ctrlKey) {
                  b(k.lanes.flatMap((O) => O.markers.map((re) => re.segment.id)));
                  return;
                }
                u(k.key), y(k.key);
              },
              "aria-expanded": !_,
              "aria-current": le ? "true" : void 0,
              "data-selected-timeline-group": le ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: k.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: ae
              },
              title: `${_ ? "Expand" : "Collapse"} ${k.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, _ ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, k.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              _ ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${k.lanes.length} swimlane${k.lanes.length === 1 ? "" : "s"} hidden`
                ),
                H ? n(Tt, { key: "states", counts: k.counts }) : null
              ] : null
            )
          ]);
          const te = S.lane, xe = Js(S.laneIndex), K = te.markers.some(({ segment: Y }) => Y.id === s);
          return n("div", {
            key: S.key,
            "data-grouped-swimlane": k.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${B}rem minmax(0,1fr)`,
              top: S.top,
              height: S.height,
              backgroundColor: xe
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": K ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Ys(K, xe),
              title: `${$n(te)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": $n(te),
              onClick: (Y) => {
                (Y.metaKey || Y.ctrlKey) && b(te.markers.map((O) => O.segment.id));
              },
              onMouseEnter: () => M(te.key),
              onMouseLeave: () => M((Y) => Y === te.key ? null : Y)
            }, [
              te.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (Y) => {
                  Y.stopPropagation(), w({ tagId: te.tagId, tagName: te.label, trigger: Y.currentTarget });
                },
                "aria-label": `Configure ${te.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: V === te.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, te.label),
              (Z = te.performers) != null && Z.length ? n(rr, {
                key: "performers",
                performers: te.performers,
                performerAssignments: te.performerAssignments
              }) : null,
              H ? n(Tt, { key: "counts", counts: te.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, te.markers.map(({ segment: Y, track: O }) => {
              var Ne;
              const re = Nr(Y.startSec, ue), ye = Y.endSec == null ? Y.startSec : Math.max(Y.startSec, Y.endSec), be = Math.max(0, Nr(ye, ue) - re), fe = l.includes(Y.id), Le = Y.id === s, De = Gr(L.get(Y.id)), he = Y.endSec == null ? ke(Y.startSec) : `${ke(Y.startSec)} – ${ke(Y.endSec)}`, $e = (Ne = Ma[De]) == null ? void 0 : Ne.label;
              return n("button", {
                key: Y.id,
                type: "button",
                onClick: (pe) => {
                  pe.stopPropagation(), p(Y, {
                    additive: pe.metaKey || pe.ctrlKey,
                    rangeSegmentIds: pe.shiftKey ? te.markers.map((Be) => Be.segment.id) : null
                  });
                },
                "aria-pressed": fe,
                "aria-current": Le ? "true" : void 0,
                "data-selected-timeline-marker": Le ? "true" : void 0,
                "data-selected-segment-shortcut-target": Le ? "true" : void 0,
                "aria-label": H ? `${Y.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${Y.reviewState}${$e ? `, ${$e}` : ""}, ${he}` : `${Y.tagName || "Tag segment"}${te.performerLabel ? `, ${te.performerLabel}` : ""}, ${he}`,
                title: H ? `${Y.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${Y.reviewState}${$e ? ` · ${$e}` : ""} · ${he}` : `${Y.tagName || "Tag segment"}${te.performerLabel ? ` · ${te.performerLabel}` : ""} · ${he}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...H ? qs(Y.reviewState, fe, De, Le) : Ws(fe, Le),
                  left: `${re}%`,
                  top: `${Zs(O)}rem`,
                  width: Vs(Y.endSec, be),
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
function zr({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = P(null), [l, d] = P([]), [c, g] = P(null), [m, u] = P(""), [y, p] = P(!0), [b, f] = P(null), [w, v] = P(""), [I, H] = P(!1), C = me(null), q = me(0);
  ge(() => {
    const V = requestAnimationFrame(() => {
      var M;
      return (M = C.current) == null ? void 0 : M.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(V);
  }, [e]), ge(() => {
    const V = new AbortController();
    return p(!0), v(""), Promise.all([
      r ? Q(`/slot-definitions/${e}`, { signal: V.signal }) : Promise.resolve(null),
      Q("/segment-groups", { signal: V.signal })
    ]).then(([M, $]) => {
      const L = $.find((ne) => (ne.tags || []).some((X) => Number(X.tagId) === Number(e)));
      s(M), d($), g((L == null ? void 0 : L.id) ?? null), u(L == null ? "" : String(L.id)), H(!1);
    }).catch((M) => {
      M.name !== "AbortError" && v(M.message || "Unable to load tag configuration.");
    }).finally(() => {
      V.signal.aborted || p(!1);
    }), () => V.abort();
  }, [r, e]);
  function E(V, M) {
    s({
      ...a,
      definitions: a.definitions.map(($, L) => L === V ? { ...$, ...M } : $)
    });
  }
  function N(V, M) {
    const $ = V + M;
    if ($ < 0 || $ >= a.definitions.length) return;
    const L = [...a.definitions];
    [L[V], L[$]] = [L[$], L[V]], s({
      ...a,
      definitions: L.map((ne, X) => ({ ...ne, sortOrder: X }))
    });
  }
  function T(V) {
    const M = a.definitions[V], $ = Number(M.assignmentCount) || 0, L = $ === 0 ? "" : ` and its ${$} assignment${$ === 1 ? "" : "s"}`;
    window.confirm(`Delete “${et(M)}”${L}?`) && ($ > 0 && H(!0), s({
      ...a,
      definitions: a.definitions.filter((ne, X) => X !== V).map((ne, X) => ({ ...ne, sortOrder: X }))
    }));
  }
  async function F() {
    var M;
    f("slots"), v("Saving performer slots…");
    let V;
    try {
      V = await Q(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: I,
          definitions: a.definitions.map(($, L) => {
            var ne;
            return {
              id: $.id || void 0,
              label: ((ne = $.label) == null ? void 0 : ne.trim()) || null,
              sortOrder: L,
              genderHints: $.genderHints || []
            };
          })
        })
      }), s(V), H(!1);
    } catch ($) {
      $.status === 409 ? (v("Performer slots changed elsewhere; current values were reloaded."), (M = $.payload) != null && M.current && (s($.payload.current), H(!1))) : v($.message || "Unable to save performer slots."), f(null);
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
  async function J() {
    const V = m === "" ? null : Number(m);
    if (V !== c) {
      f("group"), v("Saving tag group…");
      try {
        await Q(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: V })
        });
      } catch (M) {
        v(M.message || "Unable to assign the tag group."), f(null);
        return;
      }
      try {
        const [M, $] = await Promise.allSettled([
          Q("/segment-groups"),
          o()
        ]);
        if (M.status === "fulfilled") {
          d(M.value);
          const L = M.value.find((X) => (X.tags || []).some((we) => Number(we.tagId) === Number(e))), ne = (L == null ? void 0 : L.id) ?? null;
          g(ne), u(ne == null ? "" : String(ne));
        }
        v(
          M.status === "fulfilled" && $.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        f(null);
      }
    }
  }
  l.find((V) => Number(V.id) === Number(c));
  const j = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (V) => {
      V.target === V.currentTarget && !b && i();
    },
    onKeyDownCapture: (V) => rt(V, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: C,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: vt,
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
          onClick: J,
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
          ...(a.definitions || []).map((V, M) => n("article", {
            key: V.id || V._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: V.label || "",
                disabled: b != null,
                onChange: ($) => E(M, { label: $.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ei.map(($) => n("label", { key: $, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (V.genderHints || []).includes($),
                  onChange: (L) => E(M, {
                    genderHints: L.target.checked ? [.../* @__PURE__ */ new Set([...V.genderHints || [], $])] : (V.genderHints || []).filter((ne) => ne !== $)
                  })
                }),
                n("span", { key: "text" }, nr($))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${V.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || M === 0, onClick: () => N(M, -1), className: j, "aria-label": `Move ${et(V)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || M === a.definitions.length - 1, onClick: () => N(M, 1), className: j, "aria-label": `Move ${et(V)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => T(M), className: `${j} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++q.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: j
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: b != null,
              onClick: F,
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
function ud(e) {
  const { activeFilterCount: t, allSwimlanes: r, analysisError: o, analysisRun: i, analysisStatus: a, approvalFacetCounts: s, autoAssignCandidates: l, autoAssignError: d, autoAssignOpen: c, autoAssignPerformers: g, autoAssigning: m, captureTrainingExport: u, centerTimelineRef: y, closeEditorFilters: p, closeFirstSegmentTagDialog: b, closeMaterializeDialog: f, closeMergeConfirmation: w, closePublishApprovedDialog: v, closeTagEditing: I, collapsedSegmentGroups: H, compatibilityMode: C, configuringTag: q, createSegment: E, currentTime: N, deleteRejectedSegments: T, detail: F, detailPanelRef: J, detailWidth: j, duplicateSegment: V, editorFilters: M, editorLayout: $, editorRef: L, exportingExamples: ne, filtersButtonRef: X, filtersOpen: we, firstSegmentTagOpen: ue, focusRowRef: A, handleSeparatorKeyDown: ee, handleSeparatorPointerDown: B, handleSeparatorPointerMove: se, hideDerivedSegments: oe, history: W, historyOpen: ve, historySaving: Ae, horizontalLayoutSize: ie, importNativeSegments: Te, incorrectExamples: h, incorrectExamplesOpen: z, lineage: R, markerRailWidth: x, materializeButtonRef: D, materializeCancelButtonRef: S, materializeDerivedSegments: k, materializeError: _, materializeLoading: le, materializeOpen: ae, materializePreview: te, materializing: xe, mediaStackRef: K, mergeCancelButtonRef: Z, mergeConfirmation: Y, mergeSavingRef: O, mergeSelectedSwimlane: re, nativeImportState: ye, onNavigate: be, onReload: fe, onSlotsChanged: Le, openPublishApprovedDialog: De, panelSeparatorProps: he, pendingInitialSeekRef: $e, performerSlots: Ne, performerSlotsAvailable: pe, playbackControlsRef: Be, previewDerivedSegments: Me, provenance: xt, provenanceSources: Ie, publishApprovedCancelButtonRef: Ge, publishApprovedDrafts: Ue, publishApprovedError: Fe, publishApprovedOpen: Se, quickSearchOpen: Ce, railScrollRef: Ke, railToggleRef: ot, recordHistoryAction: Je, rejectedDeletionPreview: qe, removeIncorrectExample: It, removingExampleId: At, restoreHistoryTarget: sn, saveMessage: Rn, saveTag: ar, saveTiming: Rt, savingSegmentId: St, seekRef: Et, segmentGroups: Dt, segmentRailLayout: ln, segments: ut, selectAllVideoSegments: ir, selectSegment: Kt, selectSegmentCollection: Ut, selectedGroups: sr, selectedPerformerSlots: dn, selectedSegment: mt, selectedSegmentGroupKey: cn, selectedSegmentIds: En, selectedSegments: un, selectedSlotStatus: Dn, setAutoAssignError: mn, setAutoAssignOpen: Ct, setConfiguringTag: zt, setCurrentTime: On, setEditorFilters: lr, setEditorLayout: Pn, setFiltersOpen: dr, setHideDerivedSegments: gn, setHistoryOpen: _t, setIncorrectExamplesOpen: pn, setQuickSearchOpen: Ot, setRailViewport: cr, setRejectedDeletionPreview: Ln, setSelectedSegmentGroupKey: Ht, setSelectedSegmentId: fn, setShortcutsOpen: qt, setTimelineZoom: at, shotBoundaries: Fn, shortcutsOpen: yn, slotButtonRef: jn, splitLayout: bt, splitSegment: bn, startFullAnalysis: Wt, tagEditing: ur, tagSearchRef: mr, timelineDuration: gr, timelineRatioBounds: Vt, timelineZoom: hn, toggleSegmentGroup: Jt, toggleSegmentRail: ze, updateTimelineRatio: Ye, video: Ze, videoPerformers: Bn, visibleCounts: ht, visibleSegmentRailRows: gt, visibleSegments: Gn, wideLayout: kt, workspaceRef: vn } = e, Yt = je(
    () => ut.filter((U) => !U.published && U.reviewState === "approved"),
    [ut]
  ), Kn = Mi(Dr), xn = Yt.length, Zt = te ? te.createCount + te.linkCount : null;
  function pr(U) {
    const Pe = En.includes(U.id), st = U.id === (mt == null ? void 0 : mt.id), lt = U.endSec == null ? ke(U.startSec) : `${ke(U.startSec)} – ${ke(U.endSec)}`, Xt = `${yt(U.sourceKey)}${U.confidence != null ? ` · ${Math.round(U.confidence * 100)}%` : ""}`;
    return n("button", {
      key: U.id,
      type: "button",
      onClick: (Ve) => Kt(U, { additive: Ve.metaKey || Ve.ctrlKey }),
      "aria-pressed": Pe,
      "aria-current": st ? "true" : void 0,
      "data-selected-segment-shortcut-target": st ? "true" : void 0,
      "aria-label": C ? `${U.tagName || "Tag segment"}, ${U.reviewState}${U.isDerived ? ", derived segment" : ""}, ${lt}` : `${U.tagName || "Tag segment"}${U.isDerived ? ", derived segment" : ""}, ${lt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: Ta(Pe, st)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        C ? n(Gt, { key: "review", state: U.reviewState, includeLabel: !1 }) : null,
        U.isDerived ? n(or, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          U.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, lt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Xt
        }, Xt)
      ])
    ]);
  }
  const Qt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", it = [...W.actions || []].reverse().find((U) => U.sequence <= W.cursorSequence);
  return n("section", {
    ref: L,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${bt ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (U) => Fa(U, be, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ze.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ze.title || `Video ${Ze.id}`
          }, Ze.title || `Video ${Ze.id}`)),
          ...Bn.map((U) => n(Tn, {
            key: He(U),
            performer: { id: He(U), name: U.name },
            compact: !0,
            tooltip: U.name
          })),
          C ? n(Tt, { key: "review-counts", counts: ht }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          C ? null : n(Ba, { key: "bin", onNavigate: be, compact: !0 }),
          n(Ga, { key: "settings", onNavigate: be, compact: !0 })
        ])
      ]),
      C && F.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${F.nativeImportCount} Cove segment${F.nativeImportCount === 1 ? "" : "s"} ${F.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        ye.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, ye.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => Te("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => Te("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        ye.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, ye.error) : null
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
              onClick: () => Wt(),
              title: (a == null ? void 0 : a.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (a == null ? void 0 : a.configured) === !1 ? "Full Scan not configured" : (a == null ? void 0 : a.ready) === !1 ? "Full Scan unavailable" : (i == null ? void 0 : i.status) === "queued" ? "Full Scan queued…" : (i == null ? void 0 : i.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                title: "Choose analyses",
                onClick: (U) => {
                  ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && U.preventDefault();
                },
                onKeyDown: (U) => {
                  (U.key === "Enter" || U.key === " ") && ((a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running") && U.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Ai, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([U, Pe]) => n("button", {
                key: U,
                type: "button",
                disabled: (a == null ? void 0 : a.configured) === !1 || (a == null ? void 0 : a.ready) === !1 || (i == null ? void 0 : i.status) === "queued" || (i == null ? void 0 : i.status) === "running",
                onClick: (st) => {
                  var lt;
                  (lt = st.currentTarget.closest("details")) == null || lt.removeAttribute("open"), Wt(Pe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, U)))
            ])
          ]) : null,
          C ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: St != null || l.length === 0,
            onClick: () => {
              mn(""), Ct(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${l.length ? ` (${l.length})` : ""}`) : null,
          C ? n("button", {
            key: "materialize-derived",
            ref: D,
            type: "button",
            disabled: St != null || le || xe || Zt === 0,
            onClick: Me,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, le ? "Analyzing…" : `Auto-Materialize${Zt != null ? ` (${Zt})` : ""}`) : null,
          C ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: St != null || xn === 0,
            onClick: (U) => De(U.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Se,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${xn ? ` (${xn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ne || At != null || h.length === 0,
            onClick: () => pn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": z,
            "aria-label": `Open AI feedback collection, ${h.length} example${h.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${h.length ? ` (${h.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: X,
            type: "button",
            onClick: () => dr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": we,
            className: `${Qt} ${t ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(qn, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${t ? ` (${t})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => qt(!0),
            className: Qt
          }, [n(qn, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (C ? W.actions.length === 0 : it == null) || St != null || Ae,
            onClick: C ? () => _t((U) => !U) : () => sn(
              it.sequence - 1
            ),
            "aria-haspopup": C ? "dialog" : void 0,
            "aria-expanded": C ? ve : void 0,
            className: Qt
          }, [
            n(qn, { key: "icon", name: "history" }),
            n("span", { key: "label" }, C ? `History${W.actions.length ? ` (${W.actions.length})` : ""}` : it ? `Undo ${it.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: ot,
            type: "button",
            onClick: ze,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": $.markerRailOpen,
            className: Qt
          }, [
            n(qn, { key: "icon", name: "list" }),
            n("span", { key: "label" }, $.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    C && ve ? n("section", {
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
          onClick: () => _t(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...W.actions].reverse().map((U) => n("button", {
          key: U.sequence,
          type: "button",
          disabled: Ae,
          onClick: () => sn(U.sequence),
          "aria-current": W.cursorSequence === U.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${U.sequence > W.cursorSequence ? "text-secondary" : "text-foreground"} ${W.cursorSequence === U.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, U.label),
          n("time", {
            key: "time",
            dateTime: U.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(U.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: Ae,
          onClick: () => sn(W.baselineSequence),
          "aria-current": W.cursorSequence === W.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${W.cursorSequence === W.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    we ? n(Ql, {
      key: "editor-filters",
      filters: M,
      hideDerivedSegments: oe,
      performers: Bn,
      provenanceSources: Ie,
      reviewCounts: s,
      segments: ut,
      segmentGroups: Dt,
      reviewMode: C,
      onChange: lr,
      onHideDerivedChange: gn,
      onClose: p
    }) : null,
    ue ? n(Zl, {
      key: "first-segment-tag-dialog",
      saving: St != null,
      error: Rn,
      onSelect: (U, Pe) => E(U, Pe),
      onClose: b
    }) : null,
    Ce ? n(td, {
      key: "quick-search-dialog",
      segments: js(r),
      onSelect: (U) => {
        Ot(!1), Kt(U, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Ot(!1), requestAnimationFrame(() => {
          var U;
          return (U = L.current) == null ? void 0 : U.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    c ? n(od, {
      key: "auto-assign-dialog",
      candidates: l,
      processing: m,
      error: d,
      onConfirm: g,
      onClose: () => Ct(!1)
    }) : null,
    Y ? n(id, {
      key: "merge-selection-dialog",
      merge: Y,
      processing: O.current,
      undoable: !C,
      cancelButtonRef: Z,
      onConfirm: (U) => re(!0, U, Y),
      onClose: w
    }) : null,
    ae ? n(ld, {
      key: "materialize-derived-dialog",
      preview: te,
      loading: le,
      processing: xe,
      error: _,
      cancelButtonRef: S,
      onConfirm: k,
      onClose: () => {
        xe || f();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: vn,
      className: `${bt ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      $.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: kt ? { position: "absolute", top: 0, right: 0, width: x, height: ie.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        ut.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : Gn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ke,
          onScroll: (U) => cr({
            scrollTop: U.currentTarget.scrollTop,
            height: U.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: ln.height }
        }, gt.map((U) => {
          var st;
          let Pe;
          if (U.kind === "group") {
            const lt = H.includes(U.group.key), Xt = U.group.lanes.reduce((Ve, de) => Ve + de.markers.length, 0);
            Pe = n("button", {
              type: "button",
              onClick: () => {
                Ht(U.group.key), Jt(U.group.key);
              },
              "aria-expanded": !lt,
              "aria-current": cn === U.group.key ? "true" : void 0,
              "data-segment-rail-group": U.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${cn === U.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, lt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: U.group.name }, U.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Xt),
              C && lt ? n(Tt, { key: "states", counts: U.group.counts }) : null
            ]);
          } else U.kind === "lane" ? Pe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: $n(U.lane),
            "aria-label": $n(U.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, U.lane.label),
            (st = U.lane.performers) != null && st.length ? n(rr, {
              key: "performers",
              performers: U.lane.performers,
              performerAssignments: U.lane.performerAssignments
            }) : null,
            C ? n(Tt, { key: "states", counts: U.lane.counts }) : null
          ]) : Pe = pr(U.segment);
          return n("div", {
            key: U.key,
            className: "absolute left-0 right-0",
            style: { top: U.top, height: U.height }
          }, Pe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${bt ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: K,
          className: `${bt ? "min-h-0 flex-1" : ""} grid`,
          style: bt ? {
            gridTemplateRows: `minmax(16rem, ${(1 - $.timelineRatio) * 100}fr) 0.5rem minmax(14rem, ${$.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: A,
            className: "grid min-h-0 gap-2",
            style: kt ? {
              gridTemplateColumns: $.markerRailOpen ? `${j}px 0.5rem minmax(0,1fr) 0.5rem ${x}px` : `${j}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(dd, {
              key: "tools",
              compatibilityMode: C,
              selectedSegment: mt,
              selectedSegments: un,
              selectedGroups: sr,
              saveMessage: Rn,
              savingSegmentId: St,
              saveTag: ar,
              slotStatus: Dn,
              performerSlotsAvailable: pe,
              selectedPerformerSlots: dn,
              performerSlots: Ne,
              detail: F,
              video: Ze,
              slotButtonRef: jn,
              tagSearchRef: mr,
              tagEditing: ur,
              onCancelTagEditing: I,
              detailPanelRef: J,
              onReduceSelection: (U) => {
                Kt(U), requestAnimationFrame(() => {
                  var Pe;
                  return (Pe = J.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: Rt,
              onSlotsChanged: Le,
              onRecordHistory: Je,
              splitSegment: bn,
              duplicateSegment: V,
              provenance: xt,
              lineage: R,
              onNavigateLineageItem: (U) => {
                const Pe = ut.find((st) => st.itemId === U);
                Pe && fn(Pe.id);
              }
            }),
            kt ? n(
              "div",
              { key: "detail-separator", ...he("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ze.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Jo, {
                streamUrl: `/api/stream/video/${Ze.id}`,
                posterUrl: `/api/stream/video/${Ze.id}/screenshot?v=${encodeURIComponent(Ze.updatedAt || "")}`,
                format: Ze.videoFile.format,
                audioCodec: Ze.videoFile.audioCodec,
                duration: Ze.videoFile.duration,
                videoId: Ze.id,
                trackingEnabled: !1,
                onSeekRegister: (U) => {
                  Et.current = U, Os($e.current, ut, U) && ($e.current = null);
                },
                onPlaybackControlRegister: (U) => {
                  Be.current = U;
                },
                onTimeUpdate: On
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            kt && $.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...he("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            kt && $.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          bt ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(Vt.minimum * 100),
            "aria-valuemax": Math.round(Vt.maximum * 100),
            "aria-valuenow": Math.round($.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round($.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: B,
            onPointerMove: se,
            onKeyDown: ee,
            onDoubleClick: () => Ye(nt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: bt ? void 0 : { height: "20rem" } }, n(cd, {
            segments: Gn,
            shotBoundaries: Fn,
            segmentGroups: Dt,
            performerSlots: Ne,
            collapsedGroupKeys: H,
            selectedGroupKey: cn,
            selectedSegmentId: mt == null ? void 0 : mt.id,
            selectedSegmentIds: En,
            duration: gr,
            currentTime: N,
            zoom: hn,
            onZoomChange: at,
            onSelectGroup: Ht,
            onToggleGroup: Jt,
            onSelect: (U, Pe) => Kt(U, Pe),
            onSelectSegments: Ut,
            onSelectAll: ir,
            onConfigureTag: (U) => zt(U),
            onSeekTime: (U) => {
              var Pe;
              return (Pe = Et.current) == null ? void 0 : Pe.call(Et, U, !1);
            },
            centerRef: y,
            showReviewState: C,
            swimlaneTitleWidth: $.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (U) => Pn((Pe) => ({ ...Pe, swimlaneTitleWidth: U }))
          }))
        ])
      ])
    ]),
    q ? n(zr, {
      key: `configure-tag:${q.tagId}`,
      tagId: q.tagId,
      tagName: q.tagName,
      performerSlotsEnabled: C,
      onSaved: fe,
      onClose: () => {
        const U = q.trigger;
        zt(null), requestAnimationFrame(() => {
          var Pe;
          U != null && U.isConnected ? U.focus({ preventScroll: !0 }) : (Pe = L.current) == null || Pe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Se ? n(rd, {
      key: "publish-approved-dialog",
      drafts: Yt,
      processing: St === -1,
      error: Fe,
      cancelButtonRef: Ge,
      onConfirm: Ue,
      onClose: v
    }) : null,
    qe ? n(ad, {
      key: "rejected-deletion-dialog",
      preview: qe,
      onConfirm: () => T(qe),
      onClose: () => {
        Ln(null), requestAnimationFrame(() => {
          var U;
          return (U = L.current) == null ? void 0 : U.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    yn ? n(Xl, {
      key: "shortcuts-dialog",
      reviewMode: C,
      bindings: Kn,
      onClose: () => qt(!1)
    }) : null,
    z ? n(ed, {
      key: "incorrect-examples-dialog",
      examples: h,
      exporting: ne,
      removingExampleId: At,
      onExport: u,
      onRemove: It,
      onClose: () => pn(!1)
    }) : null
  ]);
}
function md(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: m, setEditorFilters: u, setHideDerivedSegments: y, setSaveMessage: p, setSelectedSegmentGroupKey: b, setSelectedSegmentId: f, setSelectedSegmentIds: w } = e;
  function v(E) {
    const N = pt(t, E);
    N && m((T) => La(T, N));
  }
  function I(E) {
    f(E), w(E == null ? [] : [E]), c.current = E, g.current = [];
  }
  function H(E, {
    focusEditor: N = !1,
    seekToSegment: T = !1,
    additive: F = !1,
    rangeSegmentIds: J = null
  } = {}) {
    var V, M;
    const j = rs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, E.id, J, F);
    w(j.selectedSegmentIds), f(j.activeSegmentId), c.current = j.anchorSegmentId, g.current = j.rangeBaseSegmentIds, j.activeSegmentId != null && b(pt(t, j.activeSegmentId)), v(E.id), N && ((V = r.current) == null || V.focus({ preventScroll: !0 })), T && ((M = i.current) == null || M.call(i, E.startSec, !1));
  }
  function C(E) {
    const N = ts(
      d,
      l,
      E
    );
    w(N.selectedSegmentIds), f(N.activeSegmentId), c.current = N.activeSegmentId, g.current = [], N.activeSegmentId != null && (b(pt(t, N.activeSegmentId)), v(N.activeSegmentId));
  }
  function q() {
    var T;
    const E = as(s), N = E.includes(l) ? l : E[0] ?? null;
    u(ct({})), y(!1), w(E), f(N), c.current = N, g.current = [], N != null && b(pt(
      jt(s, a, o),
      N
    )), p(E.length === 0 ? "There are no segments to select." : `${E.length} segments selected. Collapsed Segment groups keep their selected segments.`), (T = r.current) == null || T.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: v, replaceSegmentSelection: I, selectSegment: H, selectSegmentCollection: C, selectAllVideoSegments: q };
}
function gd(e) {
  const { acceptHistory: t, compatibilityMode: r, detail: o, detailPanelRef: i, historyRef: a, mergeSavingRef: s, onConflict: l, onDetailChange: d, onReload: c, recordHistoryAction: g, revealSegmentGroupForSelection: m, reviewSavingRef: u, savingSegmentId: y, selectedGroups: p, selectedSegment: b, selectedSegmentIdRef: f, selectedSegments: w, selectionAnchorIdRef: v, selectionRangeBaseIdsRef: I, setMergeConfirmation: H, setSaveMessage: C, setSavingSegmentId: q, setSelectedSegmentId: E, setSelectedSegmentIds: N, video: T } = e;
  function F() {
    H(null), requestAnimationFrame(() => {
      var V;
      return (V = i.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function J(V = !1, M = !1, $ = null) {
    if (s.current || y != null) return;
    const L = $ || Oa(
      p,
      { nativeOnly: !r }
    );
    if (!L) {
      C("Select at least two segments from one swimlane.");
      return;
    }
    if (!V && ca()) {
      H(L);
      return;
    }
    M && ua(!1), F();
    const ne = L.endSec == null ? "open end" : ke(L.endSec);
    s.current = !0;
    let X = L.segments[0];
    const we = r ? null : dt(L.segments, !1), ue = r ? null : crypto.randomUUID(), A = L.segments.map((B) => B.id), ee = Tl(o, L.segments);
    q(X.id), d(ee, T.id), N([X.id]), E(X.id), v.current = X.id, I.current = [];
    try {
      const B = L.segments.slice(1);
      if (!r || X.nativeSegmentId != null) {
        const se = B.map((W) => {
          const ve = `merge-native-selection:${T.id}:${X.id}:${W.id}:${X.updatedAt}:${W.updatedAt}`;
          return { key: ve, operationId: Re(ve), segmentId: W.id, expectedUpdatedAt: W.updatedAt };
        }), oe = await Q(`/videos/${T.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: X.id,
            expectedSurvivorUpdatedAt: X.updatedAt,
            consumedSegments: se.map(({ key: W, ...ve }) => ve),
            historyReceiptId: ue
          })
        });
        X = oe.survivor, d(Eo(o, oe), T.id), se.forEach(({ key: W }) => Ee(W));
      } else {
        const se = B.map((W) => {
          const ve = `merge-draft-selection:${T.id}:${X.itemId}:${W.itemId}:${X.revision}:${W.revision}`;
          return { key: ve, operationId: Re(ve), itemId: W.itemId, expectedRevision: W.revision };
        }), oe = await Q(`/videos/${T.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: X.itemId,
            expectedSurvivorRevision: X.revision,
            consumedDrafts: se.map(({ key: W, ...ve }) => ve)
          })
        });
        X = oe.survivor, d(Eo(o, oe), T.id), se.forEach(({ key: W }) => Ee(W));
      }
      N([X.id]), E(X.id), v.current = X.id, I.current = [], r ? t(wt) : await g(
        "segments.merge",
        `Merged ${L.segments.length} segments`,
        we,
        dt([X], !1),
        ue
      ), m(X.id), C(`${L.segments.length} segments merged into ${ke(L.startSec)} – ${ne}.`);
    } catch (B) {
      d(o, T.id), N(A), E((b == null ? void 0 : b.id) ?? A[0] ?? null), v.current = (b == null ? void 0 : b.id) ?? A[0] ?? null, I.current = [], B.status === 409 ? await l() : C(B.message || "Unable to merge selected segments.");
    } finally {
      s.current = !1, q(null);
    }
  }
  async function j(V) {
    var ue;
    if (w.length === 0 || u.current || y != null) return;
    const M = hs(w, V), $ = w.filter((A) => A.reviewState !== M);
    if ($.length === 0) return;
    const L = w.map((A) => ({
      id: A.id,
      itemId: A.itemId,
      nativeSegmentId: A.nativeSegmentId
    })), ne = L.find((A) => A.id === (b == null ? void 0 : b.id)) || L[0], X = (A) => {
      if (!(A != null && A.segments) || !$r(f.current, ne.id))
        return;
      const ee = L.map((se) => We(A == null ? void 0 : A.segments, se)).filter(Boolean), B = We(A == null ? void 0 : A.segments, ne) || ee[0] || null;
      N(ee.map((se) => se.id)), E((B == null ? void 0 : B.id) ?? null), v.current = (B == null ? void 0 : B.id) ?? null, I.current = [];
    };
    u.current = !0, q((b == null ? void 0 : b.id) ?? $[0].id), C(`Updating ${$.length} selected segment${$.length === 1 ? "" : "s"}…`);
    const we = er(
      o,
      $.map((A) => A.id),
      { reviewState: M }
    );
    d(we, T.id);
    try {
      const A = await Q(`/videos/${T.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: a.current.revision,
          reviewState: M,
          segments: w.map((oe) => oe.published ? {
            nativeSegmentId: oe.nativeSegmentId,
            expectedUpdatedAt: oe.updatedAt
          } : {
            itemId: oe.itemId,
            expectedRevision: oe.revision
          })
        })
      }), ee = new Map((A.items || []).map((oe) => [
        oe.requestedNativeSegmentId != null ? `native:${oe.requestedNativeSegmentId}` : `item:${oe.requestedItemId}`,
        oe
      ]));
      if (L.forEach((oe) => {
        const W = ee.get(oe.nativeSegmentId != null ? `native:${oe.nativeSegmentId}` : `item:${oe.itemId}`);
        W && (oe.nativeSegmentId = W.nativeSegmentId, oe.itemId = W.itemId);
      }), A.history && t(A.history), M === "rejected" || (A.items || []).some((oe) => oe.requestedNativeSegmentId != null && oe.nativeSegmentId !== oe.requestedNativeSegmentId)) {
        X(await c()), C(`${A.updatedCount} selected segment${A.updatedCount === 1 ? "" : "s"} ${M === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const se = {
        ...o,
        approvedSetVersion: A.approvedSetVersion || o.approvedSetVersion,
        segments: (o.segments || []).map((oe) => {
          const W = ee.get(oe.nativeSegmentId != null ? `native:${oe.nativeSegmentId}` : `item:${oe.itemId}`);
          return W ? {
            ...oe,
            id: W.nativeSegmentId != null ? W.nativeSegmentId : -W.itemId,
            itemId: W.itemId,
            nativeSegmentId: W.nativeSegmentId,
            published: W.nativeSegmentId != null,
            reviewState: M,
            revision: W.nativeSegmentId != null ? oe.revision : W.revision,
            updatedAt: W.updatedAt
          } : oe;
        })
      };
      d(se, T.id), X(se), C(`${A.updatedCount} selected segment${A.updatedCount === 1 ? "" : "s"} ${M === "approved" ? "approved" : M === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (A) {
      d(o, T.id), A.status === 409 && ((ue = A.payload) != null && ue.currentHistory) && t(A.payload.currentHistory), A.status === 409 && X(await l()), C(A.message || "Unable to update the selected segments.");
    } finally {
      u.current = !1, q(null);
    }
  }
  return { closeMergeConfirmation: F, mergeSelectedSwimlane: J, saveSelectedReviewState: j };
}
function pd(e) {
  const { acceptHistory: t, allSwimlanes: r, autoAssignCandidates: o, autoAssigning: i, binEmptyingRef: a, canMoveSelectionToBin: s, closeTagEditing: l, compatibilityMode: d, detail: c, editorRef: g, exportingExamples: m, incorrectExamples: u, lineage: y, materializeButtonRef: p, materializePreview: b, materializeRestoreFocusRef: f, materializing: w, mutateSegment: v, onConflict: I, onDetailChange: H, onReload: C, recordHistoryAction: q, refreshMaterializationPreview: E, removingExampleId: N, revealSegmentGroupForSelection: T, savingSegmentId: F, segments: J, selectedSegment: j, selectedSegmentIdRef: V, selectedSegments: M, selectionAnchorIdRef: $, selectionRangeBaseIdsRef: L, setAutoAssignError: ne, setAutoAssignOpen: X, setAutoAssigning: we, setExportingExamples: ue, setIncorrectExamples: A, setMaterializeError: ee, setMaterializeLoading: B, setMaterializeOpen: se, setMaterializePreview: oe, setMaterializing: W, setRejectedDeletionPreview: ve, setRemovingExampleId: Ae, setSaveMessage: ie, setSavingSegmentId: Te, setSelectedSegmentGroupKey: h, setSelectedSegmentId: z, setSelectedSegmentIds: R, video: x } = e;
  async function D() {
    var he, $e, Ne;
    if (M.length === 0 || !j || F != null) return;
    const O = Sl(M, u), re = O.segments;
    if (re.length === 0) return;
    const ye = M.map((pe) => ({
      id: pe.id,
      itemId: pe.itemId,
      nativeSegmentId: pe.nativeSegmentId
    })), be = ye.find((pe) => pe.id === j.id) || ye[0], fe = [], Le = [];
    let De = c;
    Te(be.id), ie(O.action === "remove" ? `Removing ${re.length} selected incorrect example${re.length === 1 ? "" : "s"}…` : `Collecting ${re.length} selected segment${re.length === 1 ? "" : "s"} as incorrect AI feedback…`);
    try {
      const pe = async (Se, Ce) => {
        const Ke = Se.nativeSegmentId != null, ot = O.action === "remove" ? `incorrect-example-remove:${x.id}:${Ce == null ? void 0 : Ce.id}:${Ce == null ? void 0 : Ce.revision}:${Ce == null ? void 0 : Ce.representationRevision}` : `incorrect-example-collect:${x.id}:${Ke ? `native:${Se.nativeSegmentId}:${Se.updatedAt}` : `item:${Se.itemId}:${Se.revision}`}`;
        if (O.action === "remove" && !Ce)
          throw new Error("The incorrect-example collection changed. Reload and try again.");
        let Je;
        try {
          Je = O.action === "remove" ? await Q(
            `/videos/${x.id}/incorrect-examples/${Ce.id}/remove`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Re(ot),
                expectedExampleRevision: Ce.revision,
                expectedRepresentationRevision: Ce.representationRevision
              })
            }
          ) : await Q(`/videos/${x.id}/incorrect-examples/collect`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(ot),
              nativeSegmentId: Ke ? Se.nativeSegmentId : null,
              itemId: Ke ? null : Se.itemId,
              expectedUpdatedAt: Ke ? Se.updatedAt : null,
              expectedRevision: Ke ? null : Se.revision
            })
          });
        } catch (qe) {
          throw qe.operationKey = ot, qe;
        }
        if (!kl(O.action, Je))
          throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
        return Ee(ot), Je;
      };
      for (const Se of re) {
        const Ce = O.action === "remove" ? u.find((Ke) => Ke.itemId != null && Ke.itemId === Se.itemId) : null;
        try {
          const Ke = ye.find((qe) => qe.id === Se.id);
          let ot = We(
            De == null ? void 0 : De.segments,
            Ke
          ) || Se, Je;
          try {
            Je = await pe(ot, Ce);
          } catch (qe) {
            if (qe.status === 409 && (($e = (he = qe.payload) == null ? void 0 : he.result) == null ? void 0 : $e.code) === "OPERATION_REPLAYED")
              De = await Q(
                `/videos/${x.id}/editor`
              ), Ee(qe.operationKey), Je = qe.payload.result;
            else {
              if (O.action !== "collect" || qe.status !== 409) throw qe;
              const It = await Q(
                `/videos/${x.id}/editor`
              );
              De = It;
              const At = We(
                It == null ? void 0 : It.segments,
                Ke
              );
              if (!At) throw qe;
              ot = At, Je = await pe(ot, null);
            }
          }
          Ke && Je.itemId != null && (Ke.itemId = Je.itemId), De = Oo(
            De,
            Je.editorDelta
          ), fe.push({ segment: Se, result: Je });
        } catch (Ke) {
          if (Le.push(Ke), ![400, 404, 409].includes(Ke.status)) break;
        }
      }
      fe.some(({ result: Se }) => Se.representation === "basicNativeBin") && Nn();
      const Be = $r(
        V.current,
        be.id
      ), Me = O.action === "collect" && fe.some(({ segment: Se }) => Se.id === be.id), xt = fe.map(({ segment: Se }) => Se.id), Ie = Me ? ss(
        r,
        xt,
        be.id
      ) : null, Ge = Me ? (Ie == null ? void 0 : Ie.id) ?? null : be.id;
      Be && Me && (R(Ie ? [Ie.id] : []), z((Ie == null ? void 0 : Ie.id) ?? Zn), $.current = (Ie == null ? void 0 : Ie.id) ?? null, L.current = []);
      const Ue = await Q(`/videos/${x.id}/incorrect-examples`);
      A(Ue);
      const Fe = De;
      if (H(Fe, x.id), Be && $r(
        V.current,
        Ge
      )) {
        let Se, Ce;
        Me ? (Ce = Ie ? We(Fe == null ? void 0 : Fe.segments, {
          id: Ie.id,
          itemId: Ie.itemId,
          nativeSegmentId: Ie.nativeSegmentId
        }) : null, Se = Ce ? [Ce] : []) : (Se = ye.map((Ke) => We(Fe == null ? void 0 : Fe.segments, Ke)).filter(Boolean), Ce = We(Fe == null ? void 0 : Fe.segments, be) || Se[0] || null), R(Se.map((Ke) => Ke.id)), z((Ce == null ? void 0 : Ce.id) ?? (Me ? Zn : null)), $.current = (Ce == null ? void 0 : Ce.id) ?? null, L.current = [], h(Ce ? pt(r, Ce.id) : null), Ce && T(Ce.id);
      }
      if (Le.length > 0) {
        const Se = ((Ne = Le[0]) == null ? void 0 : Ne.message) || "Only segments with registered AI provenance can be collected.";
        fe.length === 0 ? ie(Se) : O.action === "remove" ? ie(
          `Partially removed ${fe.length} of ${re.length} selected incorrect examples. ${Se}`
        ) : ie(
          `Partially collected ${fe.length} of ${re.length} selected segments. ${Se}`
        );
      } else if (O.action === "remove")
        ie(
          `${fe.length} incorrect example${fe.length === 1 ? "" : "s"} removed and ${fe.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
        );
      else {
        const Se = fe.filter(({ result: Ce }) => Ce.representation === "basicNativeBin").length;
        ie(Se === fe.length ? `${fe.length} incorrect AI example${fe.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${fe.length} incorrect AI example${fe.length === 1 ? "" : "s"} collected and ${fe.length === 1 ? "segment rejected" : "segments rejected"}.`);
      }
    } catch (pe) {
      ie(pe.message || "Unable to update the selected incorrect examples.");
    } finally {
      Te(null);
    }
  }
  async function S(O) {
    var ye, be;
    if (!O || N != null || m) return;
    Ae(O.id);
    const re = `incorrect-example-remove:${x.id}:${O.id}:${O.revision}:${O.representationRevision}`;
    try {
      const fe = await Q(
        `/videos/${x.id}/incorrect-examples/${O.id}/remove`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(re),
            expectedExampleRevision: O.revision,
            expectedRepresentationRevision: O.representationRevision
          })
        }
      );
      Ee(re);
      const Le = await Q(
        `/videos/${x.id}/incorrect-examples`
      );
      A(Le), H(
        Oo(c, fe.editorDelta),
        x.id
      ), O.representation === "basicNativeBin" && Nn(), ie(O.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed.");
    } catch (fe) {
      if (fe.status === 409 && ((be = (ye = fe.payload) == null ? void 0 : ye.result) == null ? void 0 : be.code) === "OPERATION_REPLAYED") {
        Ee(re), A(await Q(
          `/videos/${x.id}/incorrect-examples`
        )), await C(), ie("Incorrect example removal was already applied.");
        return;
      }
      fe.status === 409 && await I(), ie(fe.message || "Unable to remove the incorrect example.");
    } finally {
      Ae(null);
    }
  }
  async function k() {
    if (m || N != null || u.length === 0) return;
    ue(!0);
    const O = `incorrect-example-export:${x.id}:${u.map((re) => `${re.id}:${re.revision}:${re.representationRevision}`).join(",")}`;
    try {
      const re = await Nl(
        x.id,
        u
      ), ye = new FormData();
      ye.append("metadata", JSON.stringify({
        operationId: Re(O),
        examples: re.captures
      }));
      for (const $e of re.files)
        ye.append($e.fieldName, $e.file);
      const be = await Q(
        `/videos/${x.id}/incorrect-examples/export`,
        { method: "POST", body: ye }
      ), fe = await Us(be.downloadUrl), Le = URL.createObjectURL(fe.blob), De = document.createElement("a");
      De.href = Le, De.download = fe.fileName, De.click(), setTimeout(() => URL.revokeObjectURL(Le), 1e3);
      const he = await Q(
        `/training-exports/${be.id}/complete`,
        { method: "POST" }
      );
      Ee(O), A(await Q(
        `/videos/${x.id}/incorrect-examples`
      )), ie(
        `Downloaded ${be.exampleCount} incorrect example${be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${he.clearedExampleCount} from the working collection.`
      );
    } catch (re) {
      ie(re.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ue(!1);
    }
  }
  async function _(O = null) {
    const re = J.filter((Ne) => Ne.reviewState === "rejected"), ye = re.length, be = u.some((Ne) => Ne.representation === "fullItem");
    if (O == null && ye === 0 && !be) {
      ie("There are no rejected segments to delete.");
      return;
    }
    if (O == null) {
      Te(-1), ie("Preparing deletion summary…");
      try {
        const Ne = await Q(`/videos/${x.id}/rejected/deletion/preview`, { method: "POST" }), pe = Number(Ne.deletedSegmentCount) || 0, Be = Number(Ne.deferredRejectedSegmentCount) || 0, Me = Number(Ne.protectedIncorrectExampleCount) || 0;
        if (pe === 0) {
          Be > 0 ? ie(
            `${Be} feedback-protected rejected segment${Be === 1 ? "" : "s"} kept. ${Me} AI feedback example${Me === 1 ? "" : "s"} must be exported before ${Be === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : ie("There are no rejected segments to delete.");
          return;
        }
        if (!Na(Ne, ie)) return;
        ve(Ne), ie("");
      } catch (Ne) {
        ie(Ne.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Te(null);
      }
      return;
    }
    const fe = O, Le = Number(fe.deferredRejectedSegmentCount) || 0, De = V.current, he = $l(
      c,
      re.map((Ne) => Ne.id)
    ), $e = he.segments.find((Ne) => Ne.reviewState === "unreviewed") || he.segments[0] || null;
    ve(null), Te(-1), ie("Deleting rejected segments…"), H(he, x.id), R($e ? [$e.id] : []), z(($e == null ? void 0 : $e.id) ?? null), $.current = ($e == null ? void 0 : $e.id) ?? null, L.current = [];
    try {
      const Ne = `rejected-dependency-delete:${x.id}:${fe.fingerprint}`, pe = await Q(`/videos/${x.id}/rejected/deletion/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(Ne),
          fingerprint: fe.fingerprint
        })
      });
      Ee(Ne), await C(), pe.deletedSegmentCount > 0 && t(wt);
      const Be = Le > 0 ? ` ${Le} feedback-protected rejected segment${Le === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
      ie(`${pe.deletedSegmentCount} segment${pe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Be}`);
    } catch (Ne) {
      H(c, x.id), R(De == null ? [] : [De]), z(De), $.current = De, L.current = [], ie(Ne.message || "Unable to delete rejected segments.");
    } finally {
      Te(null);
    }
  }
  async function le(O = o) {
    if (!(i || O.length === 0)) {
      we(!0), ne("");
      try {
        const re = await Q(`/videos/${x.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: O.flatMap((ye) => ye.nativeSegmentId == null ? [] : [ye.nativeSegmentId]),
            itemIds: O.flatMap((ye) => ye.published || ye.itemId == null ? [] : [ye.itemId])
          })
        });
        X(!1), await C(), ie(`${re.assignedSegmentCount} segment${re.assignedSegmentCount === 1 ? "" : "s"} received ${re.assignedSlotCount} performer-slot assignment${re.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (re) {
        ne(re.message || "Unable to auto-assign performers.");
      } finally {
        we(!1);
      }
    }
  }
  async function ae() {
    se(!0), ee(""), !b && (B(!0), E());
  }
  function te() {
    f.current = !0, se(!1), requestAnimationFrame(() => {
      var O;
      return (O = p.current) == null ? void 0 : O.focus({ preventScroll: !0 });
    });
  }
  async function xe() {
    if (!b || w || b.createCount + b.linkCount === 0)
      return;
    W(!0), ee("");
    let O;
    try {
      const re = `materialize-derived:${x.id}:${b.fingerprint}`;
      O = await Q(`/videos/${x.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(re),
          fingerprint: b.fingerprint,
          maxDepth: 3
        })
      }), Ee(re);
    } catch (re) {
      re.status === 409 && oe(null), ee(re.message || "Unable to materialize derived segments."), W(!1);
      return;
    }
    oe((re) => re && { ...re, createCount: 0, linkCount: 0 });
    try {
      await C(), te(), oe(null);
      const re = O.createdCount + O.linkedCount;
      ie(`${O.createdCount} derived segment${O.createdCount === 1 ? "" : "s"} created and ${O.linkedCount} existing segment${O.linkedCount === 1 ? "" : "s"} linked.`), re === 0 && ie("Every applicable derivation was already materialized.");
    } catch {
      ee("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    W(!1);
  }
  async function K(O, re = null) {
    var be, fe, Le, De;
    const ye = {
      tagId: O,
      ...re ? { tagName: re } : {}
    };
    if (M.length > 1) {
      const he = M.filter((Me) => Me.tagId !== O);
      if (he.length === 0) {
        l();
        return;
      }
      const $e = M.map((Me) => ({
        id: Me.id,
        itemId: Me.itemId,
        nativeSegmentId: Me.nativeSegmentId
      })), Ne = M.map((Me) => !d || Me.nativeSegmentId != null ? `native:${Me.nativeSegmentId}:${Me.updatedAt}` : `item:${Me.itemId}:${Me.revision}`).sort().join(","), pe = `bulk-tag:${x.id}:${O}:${Ne}`;
      Te((j == null ? void 0 : j.id) ?? he[0].id), ie(`Changing tag for ${he.length} selected segment${he.length === 1 ? "" : "s"}…`);
      const Be = er(
        c,
        he.map((Me) => Me.id),
        ye
      );
      H(Be, x.id), l();
      try {
        const Me = d ? null : crypto.randomUUID();
        await Q(`/videos/${x.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(pe),
            tagId: O,
            historyReceiptId: Me,
            segments: M.map((Fe) => {
              const Se = !d || Fe.nativeSegmentId != null;
              return {
                nativeSegmentId: Se ? Fe.nativeSegmentId : null,
                itemId: Se ? null : Fe.itemId,
                expectedUpdatedAt: Se ? Fe.updatedAt : null,
                expectedRevision: Se ? null : Fe.revision
              };
            })
          })
        }), Ee(pe);
        const xt = dt(
          M,
          d
        ), Ie = await C(), Ge = $e.map((Fe) => We(Ie == null ? void 0 : Ie.segments, Fe)).filter(Boolean);
        await q(
          "segments.tag",
          `Changed tag for ${he.length} segment${he.length === 1 ? "" : "s"}`,
          xt,
          dt(Ge, d),
          Me
        );
        const Ue = $e.map((Fe) => We(Ie == null ? void 0 : Ie.segments, Fe)).filter(Boolean);
        R(Ue.map((Fe) => Fe.id)), z(((be = Ue.find((Fe) => Fe.id === (j == null ? void 0 : j.id))) == null ? void 0 : be.id) ?? ((fe = Ue[0]) == null ? void 0 : fe.id) ?? null), l(), ie(`${he.length} selected segment${he.length === 1 ? "" : "s"} retagged.`);
      } catch (Me) {
        H(c, x.id), Me.status === 409 && await I(), ie(Me.message || "Unable to change the selected segment tags.");
      } finally {
        Te(null);
      }
      return;
    }
    if (!(M.length !== 1 || !j)) {
      if (O === j.tagId) {
        l();
        return;
      }
      if (j.itemId != null && ((De = (Le = y.data) == null ? void 0 : Le.children) == null ? void 0 : De.length) > 0) {
        Te(j.id), ie("Checking lineage impact…");
        try {
          const he = await Q(`/items/${j.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: j.revision, tagId: O })
          }), $e = he.deletedItemIds.length > 0 || he.removedEdgeIds.length > 0;
          if ($e && !window.confirm(
            `Changing this tag removes ${he.removedEdgeIds.length} lineage edge${he.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${he.deletedItemIds.length} derived segment${he.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            ie("Tag change canceled.");
            return;
          }
          const Ne = er(
            c,
            [j.id],
            ye
          );
          H(Ne, x.id), l();
          const pe = `tag-change:${j.itemId}:${j.revision}:${he.componentFingerprint}:${O}`;
          await Q(`/items/${j.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(pe),
              expectedRevision: j.revision,
              componentFingerprint: he.componentFingerprint,
              tagId: O
            })
          }), Ee(pe), await C(), l(), ie($e ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (he) {
          H(c, x.id), he.status === 409 ? (ie("Lineage changed — loading the latest segments…"), await I()) : ie(he.message || "Unable to reconcile the lineage.");
        } finally {
          Te(null);
        }
        return;
      }
      l(), await v(j, {
        startSec: j.startSec,
        endSec: j.endSec,
        tagId: O
      }, !0, null, !0, ye);
    }
  }
  async function Z() {
    var De, he, $e, Ne;
    if (!s || !j || F != null) return;
    const O = [...M].sort((pe, Be) => Number(pe.nativeSegmentId ?? pe.id) - Number(Be.nativeSegmentId ?? Be.id)), re = new Set(O.map((pe) => pe.id)), ye = O.map((pe) => `${pe.nativeSegmentId ?? pe.id}:${pe.updatedAt}`).join("|");
    Te(j.id), ie(`Moving ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin…`);
    const be = `bulk-move:${x.id}:${ye}`, fe = Re(be), Le = d ? null : crypto.randomUUID();
    try {
      const pe = (Ge = !1) => Q(`/videos/${x.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: fe,
          segments: O.map((Ue) => ({
            segmentId: Ue.nativeSegmentId ?? Ue.id,
            expectedUpdatedAt: Ue.updatedAt
          })),
          discardMissingImage: Ge,
          ...d ? { reviewState: "rejected" } : {},
          historyReceiptId: Le
        })
      });
      let Be;
      try {
        Be = await pe(
          jr(be)
        );
      } catch (Ge) {
        if (((De = Ge.payload) == null ? void 0 : De.code) !== "missing-image" || !window.confirm(`${Ge.message}

Continue and discard the missing image reference?`)) throw Ge;
        Br(be), Be = await pe(!0);
      }
      Ee(be), Nn();
      const Me = new Map((Be.items || []).map((Ge) => [
        Number(Ge.segmentId),
        Ge
      ]));
      await q(
        "segments.moveToBin",
        `Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin`,
        dt(O, !1),
        dt(O.map((Ge) => {
          const Ue = Me.get(
            Number(Ge.nativeSegmentId ?? Ge.id)
          );
          return {
            ...Ge,
            recycleBinItemId: (Ue == null ? void 0 : Ue.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Ue == null ? void 0 : Ue.revision) ?? null
          };
        }), !1),
        Le
      );
      const xt = J.filter((Ge) => !re.has(Ge.id)), Ie = is(r, re, j.id);
      H({ ...c, segments: xt }, x.id), R(Ie ? [Ie.id] : []), z((Ie == null ? void 0 : Ie.id) ?? null), $.current = (Ie == null ? void 0 : Ie.id) ?? null, L.current = [], Ie && (h(pt(r, Ie.id)), T(Ie.id)), requestAnimationFrame(() => {
        var Ge;
        return (Ge = g.current) == null ? void 0 : Ge.focus({ preventScroll: !0 });
      }), ie(`Moved ${O.length} segment${O.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (pe) {
      const Be = ((he = pe.payload) == null ? void 0 : he.code) || ((Ne = ($e = pe.payload) == null ? void 0 : $e.result) == null ? void 0 : Ne.code);
      pe.status === 409 && Be === "CANONICAL_SEGMENT_CHANGED" ? await I() : ie(pe.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Te(null);
    }
  }
  async function Y() {
    if (!(d || a.current || F != null)) {
      a.current = !0, ie("Checking the recycling bin…");
      try {
        const O = await Q("/bin"), re = await Ca(O, () => ie("Emptying the recycling bin…"));
        if (re.status === "empty") {
          ie("The recycling bin is empty.");
          return;
        }
        if (re.status === "canceled") {
          ie("The recycling bin was not emptied.");
          return;
        }
        ie(`${re.segmentCount} segment${re.segmentCount === 1 ? "" : "s"} from ${re.sceneCount} scene${re.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (O) {
        ie(O.message || "Unable to empty the recycling bin.");
      } finally {
        a.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: D, removeIncorrectExample: S, captureTrainingExport: k, deleteRejectedSegments: _, autoAssignPerformers: le, previewDerivedSegments: ae, closeMaterializeDialog: te, materializeDerivedSegments: xe, saveTag: K, moveToBin: Z, emptyRecyclingBin: Y };
}
function fd(e) {
  const { acceptHistory: t, compatibilityMode: r, currentTime: o, detail: i, editorLayout: a, focusRowRef: s, history: l, historyRef: d, historySaving: c, horizontalLayoutSize: g, mediaStackHeight: m, mediaStackRef: u, onDetailChange: y, onReload: p, railToggleRef: b, recordHistoryAction: f, savingSegmentId: w, savingShot: v, savingShotRef: I, setCollapsedSegmentGroups: H, setEditorLayout: C, setHistorySaving: q, setSaveMessage: E, setSavingSegmentId: N, setSavingShot: T, shotBoundaries: F, timelineDuration: J, video: j, workspaceRef: V } = e;
  async function M(h, z, R) {
    var k, _, le, ae;
    const x = h.type === "segment" ? [h] : h.segments || [], D = (z == null ? void 0 : z.type) === "segment" ? [z] : (z == null ? void 0 : z.segments) || [];
    let S = R;
    for (const [te, xe] of x.entries()) {
      const K = D[te], Z = ((k = xe.identity) == null ? void 0 : k.nativeSegmentId) != null || ((_ = xe.identity) == null ? void 0 : _.published) === !0, Y = ((le = K == null ? void 0 : K.identity) == null ? void 0 : le.recycleBinItemId) ?? ((ae = K == null ? void 0 : K.identity) == null ? void 0 : ae.itemId);
      let O = We(S.segments, K == null ? void 0 : K.identity) || We(S.segments, xe.identity);
      if (!O && Z && Y != null && K.identity.revision != null) {
        const be = `history-restore:${j.id}:${Y}:${K.identity.revision}`;
        await Q(`/bin/${Y}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(be),
            expectedRevision: K.identity.revision
          })
        }), Ee(be), S = await p(), O = S.segments.find((fe) => fe.tagId === xe.values.tagId && fe.startSec === xe.values.startSec && fe.endSec === xe.values.endSec);
      }
      if (!O)
        throw new Error("A segment in this history state no longer exists.");
      if ((O.nativeSegmentId != null || O.published === !0) !== Z) {
        if (Z) {
          const be = O.recycleBinItemId ?? O.itemId ?? Y;
          if (be == null)
            throw new Error("This recycled segment can no longer be restored.");
          const fe = `history-restore:${j.id}:${be}:${O.revision}:${xe.values.reviewState ?? "native"}`;
          await Q(`/bin/${be}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(fe),
              expectedRevision: O.revision
            })
          }), Ee(fe);
        } else {
          const be = `history-bin:${j.id}:${O.nativeSegmentId}:${O.updatedAt}:${xe.values.reviewState}`;
          await Q(`/videos/${j.id}/segments/${O.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Re(be),
              expectedUpdatedAt: O.updatedAt,
              reviewState: xe.values.reviewState
            })
          }), Ee(be);
        }
        if (S = await p(), !Z)
          continue;
        if (O = We(S.segments, xe.identity) || S.segments.find((be) => be.tagId === xe.values.tagId && be.startSec === xe.values.startSec && be.endSec === xe.values.endSec), !O)
          throw new Error("The restored segment could not be found.");
      }
      const ye = xe.values;
      if (O.nativeSegmentId == null && O.itemId != null) {
        const be = `history-draft-update:${j.id}:${O.itemId}:${O.revision}:${ye.tagId}:${ye.startSec}:${ye.endSec ?? "open"}:${ye.reviewState}`;
        await Q(`/videos/${j.id}/drafts/${O.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Re(be),
            expectedRevision: O.revision,
            ...ye
          })
        }), Ee(be);
      } else
        await Q(`/videos/${j.id}/segments/${O.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...ye, expectedUpdatedAt: O.updatedAt })
        });
      S = await p();
    }
    return S;
  }
  async function $(h, z) {
    var R;
    for (const x of h.targets || []) {
      const D = We(z.segments, x.identity);
      if (!D)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const S = (R = z.performerSlotRevisions) == null ? void 0 : R[D.id];
      await Q(D.published ? `/videos/${j.id}/segments/${D.nativeSegmentId}/slots` : `/videos/${j.id}/drafts/${D.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: S,
          assignments: x.assignments
        })
      }), z = await p();
    }
    return z;
  }
  async function L(h, z, R = []) {
    const x = h.state;
    if (!r && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const S = `basic-history:${j.id}:${d.current.revision}:${h.action.sequence}:${h.direction}`, k = await Q(`/videos/${j.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(S),
          expectedHistoryRevision: d.current.revision,
          actionSequence: h.action.sequence,
          direction: h.direction
        })
      });
      return t(k.history), R.push(S), p();
    }
    const D = h.direction === "backward" ? h.action.afterState : h.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let S = z;
      const k = (D == null ? void 0 : D.type) === "composite" ? D.states || [] : [];
      for (const [_, le] of (x.states || []).entries()) {
        const ae = k[_];
        S = await L({
          ...h,
          state: le,
          action: {
            ...h.action,
            beforeState: h.direction === "backward" ? le : ae,
            afterState: h.direction === "backward" ? ae : le
          }
        }, S, R);
      }
      return S;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return M(
        x,
        D,
        z
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return $(x, z);
    if ((x == null ? void 0 : x.type) === "shots") {
      const S = Jn(z.shotBoundaries || []), k = await Q(`/videos/${j.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(`history-shots:${j.id}:${S}:${x.fingerprint}`),
          expectedFingerprint: S,
          boundaries: x.boundaries
        })
      });
      return { ...z, shotBoundaries: k };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ne(h) {
    var R;
    if (c || w != null || v || h === l.cursorSequence)
      return;
    const z = tl(l, h);
    if (z.length !== 0) {
      q(!0), N(-1), E(`Restoring ${z.length} history ${z.length === 1 ? "action" : "actions"}…`);
      try {
        let x = i;
        const D = [];
        for (const k of z)
          x = await L(
            k,
            x,
            D
          );
        const S = r ? await Q(`/videos/${j.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: d.current.revision,
            targetSequence: h
          })
        }) : d.current;
        D.forEach(Ee), t(S), await p(), E("History restored.");
      } catch (x) {
        x.status === 409 && ((R = x.payload) != null && R.current) && t(x.payload.current), await p(), E(x.message || "Unable to restore editor history.");
      } finally {
        N(null), q(!1);
      }
    }
  }
  function X(h) {
    C((z) => ({ ...z, timelineRatio: Lr(h, m) }));
  }
  function we(h) {
    var R;
    const z = (R = u.current) == null ? void 0 : R.getBoundingClientRect();
    z && X(Hi(h.clientY, z.top, z.height));
  }
  function ue(h) {
    h.currentTarget.setPointerCapture(h.pointerId), we(h);
  }
  function A(h) {
    h.currentTarget.hasPointerCapture(h.pointerId) && we(h);
  }
  function ee(h) {
    const z = h.shiftKey ? 0.1 : 0.05;
    let R = null;
    h.key === "ArrowUp" && (R = a.timelineRatio + z), h.key === "ArrowDown" && (R = a.timelineRatio - z);
    const x = Pr(m);
    h.key === "Home" && (R = x.minimum), h.key === "End" && (R = x.maximum), R != null && (h.preventDefault(), h.stopPropagation(), X(R));
  }
  function B(h) {
    const z = h === "detailWidth" ? g.focusRow : g.workspace, R = g.workspace > 0 ? Ir(g.workspace, 600) : 560, x = Ft(a.markerRailWidth, R), D = h === "detailWidth" ? 344 + (a.markerRailOpen ? x + 24 : 0) : 600;
    return z > 0 ? Ir(z, D) : 560;
  }
  function se(h, z) {
    C((R) => ({ ...R, [h]: Ft(z, B(h)) }));
  }
  function oe(h, z) {
    var x, D;
    const R = z === "detailWidth" ? (x = s.current) == null ? void 0 : x.getBoundingClientRect() : (D = V.current) == null ? void 0 : D.getBoundingClientRect();
    R && se(z, z === "detailWidth" ? h.clientX - R.left : R.right - h.clientX);
  }
  function W(h, z) {
    const R = B(h), x = Ft(a[h], R);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": z,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(R),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (D) => {
        D.currentTarget.setPointerCapture(D.pointerId), oe(D, h);
      },
      onPointerMove: (D) => {
        D.currentTarget.hasPointerCapture(D.pointerId) && oe(D, h);
      },
      onKeyDown: (D) => {
        const S = D.shiftKey ? 40 : 16;
        let k = null;
        D.key === "ArrowLeft" && (k = h === "detailWidth" ? -S : S), D.key === "ArrowRight" && (k = h === "detailWidth" ? S : -S);
        let _ = k == null ? null : x + k;
        D.key === "Home" && (_ = 240), D.key === "End" && (_ = R), _ != null && (D.preventDefault(), D.stopPropagation(), se(h, _));
      },
      onDoubleClick: () => se(h, nt[h]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function ve() {
    C((h) => ({ ...h, markerRailOpen: !h.markerRailOpen })), requestAnimationFrame(() => {
      var h;
      return (h = b.current) == null ? void 0 : h.focus({ preventScroll: !0 });
    });
  }
  function Ae(h) {
    H((z) => z.includes(h) ? z.filter((R) => R !== h) : Mt([...z, h]));
  }
  async function ie(h, z = !0, R = o) {
    var k;
    if (I.current) return null;
    const x = Number((k = j.videoFile) == null ? void 0 : k.duration) || J, D = Jn(F), S = `shot-${h}:${j.id}:${R.toFixed(3)}:${x.toFixed(3)}:${D}`;
    I.current = !0, T(!0), E(h === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const _ = await Q(`/videos/${j.id}/shot-boundaries/${h}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(h === "split" ? { operationId: Re(S), timeSec: R } : { operationId: Re(S), timeSec: R })
      });
      return Ee(S), y((le) => ({ ...le, shotBoundaries: _ }), j.id), z && await f(
        "shots.update",
        h === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: F,
          fingerprint: D
        },
        {
          type: "shots",
          boundaries: _,
          fingerprint: Jn(_)
        }
      ), E(h === "split" ? "Shot boundary added." : "Shots merged."), _;
    } catch (_) {
      return E(_.message || "Unable to edit shot boundaries."), null;
    } finally {
      I.current = !1, T(!1);
    }
  }
  async function Te(h) {
    if (I.current) return null;
    const z = `shot-restore:${j.id}:${h.afterFingerprint}`;
    I.current = !0, T(!0), E("Undoing shot edit…");
    try {
      const R = await Q(`/videos/${j.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(z),
          expectedFingerprint: h.afterFingerprint,
          boundaries: h.before
        })
      });
      return Ee(z), y((x) => ({ ...x, shotBoundaries: R }), j.id), R;
    } catch (R) {
      return E(R.message || "Unable to undo the shot edit."), null;
    } finally {
      I.current = !1, T(!1);
    }
  }
  return { applySegmentHistoryState: M, applyPerformerSlotHistoryState: $, applyHistoryState: L, restoreHistoryTarget: ne, updateTimelineRatio: X, updateTimelineRatioFromPointer: we, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: A, handleSeparatorKeyDown: ee, panelWidthMaximum: B, updatePanelWidth: se, handlePanelSeparatorPointer: oe, panelSeparatorProps: W, toggleSegmentRail: ve, toggleSegmentGroup: Ae, mutateShotBoundary: ie, restoreShotBoundaries: Te };
}
function yd(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: m, lineage: u, mediaDuration: y, mergeSelectedSwimlane: p, moveToBin: b, mutateShotBoundary: f, openPublishApprovedDialog: w, playbackControlsRef: v, playbackShortcutConfig: I, saveSelectedReviewState: H, seekRef: C, segmentGroupKeys: q, selectSegment: E, selectedSegment: N, selectedSegmentGroupForSegment: T, selectedSegmentGroupKey: F, selectedSegments: J, setCollapsedSegmentGroups: j, setIncorrectExamplesOpen: V, setQuickSearchOpen: M, setSaveMessage: $, setSelectedSegmentGroupKey: L, setTagEditing: ne, setTimelineZoom: X, shotBoundaries: we, slotButtonRef: ue, splitSegment: A, swimlanes: ee, timelineDuration: B, toggleIncorrectExample: se, toggleSegmentGroup: oe, updateTimelineRatio: W, videoFrameRate: ve, visibleSegments: Ae } = e;
  function ie(h, z) {
    if (J.length > 1 && gs(h.id))
      return;
    let R = null;
    h.id === "video.playPause" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.toggle();
    }), h.id === "video.seekSmallBackward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-I.smallSeekTime);
    }), h.id === "video.seekSmallForward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(I.smallSeekTime);
    }), h.id === "video.seekMediumBackward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-I.mediumSeekTime);
    }), h.id === "video.seekMediumForward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(I.mediumSeekTime);
    }), h.id === "video.seekLongBackward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(-I.longSeekTime);
    }), h.id === "video.seekLongForward" && (R = () => {
      var x;
      return (x = v.current) == null ? void 0 : x.seekBy(I.longSeekTime);
    }), h.id === "video.playSelected" && N && (R = () => {
      var x;
      (x = C.current) == null || x.call(C, N.startSec, !0), requestAnimationFrame(() => {
        var D;
        return (D = g.current) == null ? void 0 : D.focus({ preventScroll: !0 });
      });
    }), (h.id === "video.playPreviousSegment" || h.id === "video.playNextSegment") && (R = () => {
      var D;
      const x = Ar(
        ee,
        N == null ? void 0 : N.id,
        h.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !x || x.id === (N == null ? void 0 : N.id) || (E(x, { focusEditor: !0, seekToSegment: !1 }), (D = C.current) == null || D.call(C, x.startSec, !0));
    }), h.id.startsWith("video.seekPercent") && (R = () => {
      var D;
      const x = Number(h.id.slice(17)) / 10;
      (D = C.current) == null || D.call(C, ls(y ?? B, x), !1);
    }), h.id === "video.jumpToSegmentStart" && N && (R = () => {
      var x;
      return (x = C.current) == null ? void 0 : x.call(C, N.startSec, !1);
    }), h.id === "video.jumpToSegmentEnd" && N && (R = () => {
      var x;
      return (x = C.current) == null ? void 0 : x.call(C, N.endSec ?? N.startSec, !1);
    }), h.id === "video.jumpToVideoStart" && (R = () => {
      var x;
      return (x = C.current) == null ? void 0 : x.call(C, 0, !1);
    }), h.id === "video.jumpToVideoEnd" && (R = () => {
      var x;
      return (x = C.current) == null ? void 0 : x.call(C, B, !1);
    }), h.id.startsWith("video.frame") && (R = () => {
      var S, k;
      const x = h.id.includes("Small") ? "small" : h.id.includes("Medium") ? "medium" : "long", D = I[`${x}FrameStep`] * (h.id.endsWith("Backward") ? -1 : 1);
      (S = v.current) == null || S.pause(), (k = v.current) == null || k.seekBy(ws(D, ve));
    }), h.id.startsWith("navigation.swimlane") && (R = () => {
      const x = h.id.slice(19).toLowerCase(), D = Ar(ee, N == null ? void 0 : N.id, x, s);
      D && E(D, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.extendSwimlaneLeft" || h.id === "navigation.extendSwimlaneRight") && (R = () => {
      const x = bl(
        t,
        N == null ? void 0 : N.id,
        h.id.endsWith("Left") ? "left" : "right"
      );
      x && E(x.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: x.segmentIds
      });
    }), (h.id === "navigation.segmentGroupUp" || h.id === "navigation.segmentGroupDown") && (R = () => {
      const x = hl(
        q,
        F ?? T,
        h.id.endsWith("Up") ? -1 : 1
      );
      x && L(x);
    }), (h.id === "navigation.previousAtPlayhead" || h.id === "navigation.nextAtPlayhead") && (R = () => {
      const x = qi(Ae, s, h.id === "navigation.previousAtPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.nearestInCurrentSwimlane" && (R = () => {
      const x = Pi(
        ee,
        N == null ? void 0 : N.id,
        s
      );
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id.includes("Unreviewed") && (R = () => {
      const x = la(
        ee,
        N == null ? void 0 : N.id,
        h.id.startsWith("navigation.previous") ? -1 : 1,
        h.id.endsWith("Global")
      );
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), (h.id === "navigation.nextTouchingPlayhead" || h.id === "navigation.previousTouchingPlayhead") && (R = () => {
      const x = Oi(ee, s, h.id === "navigation.previousTouchingPlayhead" ? -1 : 1, N == null ? void 0 : N.id);
      x && E(x, { focusEditor: !0, seekToSegment: !1 });
    }), h.id === "navigation.quickSearch" && (R = () => M(!0)), (h.id === "navigation.previousShot" || h.id === "navigation.nextShot") && (R = () => {
      var D;
      const x = ks(we, s, h.id === "navigation.previousShot" ? -1 : 1);
      x && ((D = C.current) == null || D.call(C, x.startSec, !1));
    }), h.id === "shot.split" && (R = () => f("split")), h.id === "shot.merge" && (R = () => f("merge")), h.id === "marker.create" && (R = () => a()), h.id === "marker.duplicate" && (R = () => d(!1)), h.id === "marker.duplicateAtPlayhead" && (R = () => d(!0)), h.id === "marker.split" && (R = () => A()), h.id === "marker.editTag" && (R = () => {
      var x;
      if (J.length > 1 && J.some((D) => D.isDerived)) {
        $("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((x = u.data) != null && x.tagReadOnly) {
        $("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ne(!0);
    }), h.id === "marker.setStart" && N && (R = () => r(s, N.endSec)), h.id === "marker.setEnd" && N && (R = () => r(N.startSec, s)), h.id === "marker.copyTiming" && N && (R = () => {
      $(Fl(N) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), h.id === "marker.pasteTiming" && N && (R = () => {
      const x = Ll();
      if (!x) {
        $("No copied segment timing is available.");
        return;
      }
      r(x.startSec, x.endSec);
    }), h.id === "marker.mergeSelection" && (R = () => p()), h.id === "marker.moveToBin" && (R = () => b()), h.id === "marker.toggleIncorrectExample" && N && (R = () => se()), h.id === "marker.openIncorrectExamples" && (R = () => V(!0)), h.id === "markerGroup.toggleCollapse" && F && (R = () => oe(F)), h.id === "markerGroup.toggleAll" && (R = () => j((x) => yl(x, q))), h.id === "marker.assignSlots" && (R = () => {
      var x;
      return (x = ue.current) == null ? void 0 : x.click();
    }), h.id === "navigation.zoomIn" && (R = () => X((x) => Yn(x + 0.5))), h.id === "navigation.zoomOut" && (R = () => X((x) => Yn(x - 0.5))), h.id === "navigation.resetZoom" && (R = () => X(1)), h.id === "navigation.centerPlayhead" && (R = () => {
      var x;
      return (x = o.current) == null ? void 0 : x.call(o);
    }), h.id === "layout.growSwimlanes" && (R = () => W(c.timelineRatio + 0.05)), h.id === "layout.shrinkSwimlanes" && (R = () => W(c.timelineRatio - 0.05)), h.id === "marker.confirm" && N && (R = () => H("approved")), h.id === "system.publishApproved" && (R = () => w(z.target)), h.id === "marker.reject" && N && (R = () => H("rejected")), h.id === "system.emptyBin" && (R = () => m()), h.id === "system.deleteRejected" && (R = () => l()), R && R();
  }
  function Te(h, z) {
    const R = Mn.find((x) => x.id === h);
    R && on(R, i) && ie(R, z);
  }
  return { executeShortcutById: Te };
}
function bd(e, t, r = !1, o = 0, i = "") {
  const [a, s] = P(null), [l, d] = P(null), [c, g] = P(""), [m, u] = P({
    busy: !1,
    reviewState: null,
    error: ""
  }), y = me(null);
  async function p(w) {
    u({ busy: !0, reviewState: w, error: "" });
    try {
      await Q(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Mr(), reviewState: w })
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
      const w = await Q(`/videos/${e}/analysis-runs`), v = (w == null ? void 0 : w[0]) || null;
      return s(v), (v == null ? void 0 : v.status) === "completed" && y.current !== v.id && (y.current = v.id, await t()), ((v == null ? void 0 : v.status) === "failed" || (v == null ? void 0 : v.status) === "cancelled") && g(v.errorMessage || "Video analysis did not complete."), v;
    } catch (w) {
      return g(w.message || "Unable to load video analysis status."), null;
    }
  }
  async function f(w = null) {
    g("");
    const v = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), I = v.includes("omnishotcut") && o > 0;
    if (!(I && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const H = await Q(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: v,
            replaceShotBoundaries: I,
            expectedShotBoundaryFingerprint: I ? i : null
          })
        });
        s(H);
      } catch (H) {
        g(H.message || "Unable to start video analysis.");
      }
  }
  return ge(() => {
    b(), Q("/analysis/status").then((w) => {
      d(w), w.configured || g("");
    }).catch((w) => g(w.message || "Unable to check video analysis readiness."));
  }, [e, r]), ge(() => {
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
function hd(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function vd({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var io, so, lo, co, uo;
  const [g, m] = P(null), [u, y] = P([]), p = me(null), b = me(null), f = me([]), w = me(null), [v, I] = P(() => ct({})), [H, C] = P(!1), [q, E] = P(cs), [N, T] = P(0), [F, J] = P(null), [j, V] = P(!1), [M, $] = P(""), [L, ne] = P(""), [X, we] = P(""), [ue, A] = P(1), [ee, B] = P(El), [se, oe] = P(0), [W, ve] = P({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [Ae, ie] = P(wt), Te = me(wt), [h, z] = P(!1), [R, x] = P(!1), [D, S] = P(!1), [k, _] = P(!1), le = me(!1), [ae, te] = P(null), [xe, K] = P(null), Z = me(null), [Y, O] = P(!1), [re, ye] = P(""), be = me(null), fe = me(null), Le = me(!1), De = me(!1), [he, $e] = P(Dl), [Ne, pe] = P(null), [Be, Me] = P(!1), [xt, Ie] = P(!1), [Ge, Ue] = P(!1), [Fe, Se] = P(!1), [Ce, Ke] = P(!1), [ot, Je] = P(""), {
    analysisError: qe,
    analysisRun: It,
    analysisStatus: At,
    importNativeSegments: sn,
    nativeImportState: Rn,
    startFullAnalysis: ar
  } = bd(
    e.video.id,
    o,
    l,
    ((io = e.shotBoundaries) == null ? void 0 : io.length) || 0,
    Jn(e.shotBoundaries || [])
  ), [Rt, St] = P(!1), [Et, Dt] = P(null), [ln, ut] = P(l), [ir, Kt] = P(0), [Ut, sr] = P(!1), [dn, mt] = P(""), [cn, En] = P(null), un = me(null), Dn = me(null), mn = me(!1), [Ct, zt] = P([]), [On, lr] = P(!1), [Pn, dr] = P(null), gn = Al(), _t = me(null), pn = me(null), Ot = me(null), cr = me(s), Ln = me(null), Ht = me(null), fn = me(null), qt = me(null), at = me(null), Fn = me(null), yn = me(null), jn = me(null), bt = me(null), bn = me(null), Wt = me(null), ur = me(-1e12), mr = me(null), gr = me(!1), Vt = me(null), [hn, Jt] = P({ scrollTop: 0, height: 512 });
  ge(() => {
    if (!Rt || Ut || !dn) return;
    const G = requestAnimationFrame(() => {
      var ce;
      return (ce = Dn.current) == null ? void 0 : ce.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(G);
  }, [Rt, Ut, dn]), ge(() => {
    if (!mn.current || Rt || ln) return;
    const G = requestAnimationFrame(() => {
      var ce;
      (ce = un.current) == null || ce.focus({ preventScroll: !0 }), mn.current = !1;
    });
    return () => cancelAnimationFrame(G);
  }, [Rt, ln]);
  const ze = e.video, Ye = e.segments || wn, Ze = je(() => JSON.stringify({
    segments: Ye.map((G) => [
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
  }), [Ye, e.performerSlots, e.itemMetadata]);
  ge(() => {
    if (!l) {
      Dt(null), ut(!1);
      return;
    }
    let G = !0;
    ut(!0);
    const ce = setTimeout(() => {
      Q(`/videos/${ze.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Oe) => {
        G && (Dt(Oe), mt(""));
      }).catch((Oe) => {
        G && (Dt(null), mt(Oe.message || "Unable to preview derived segments."));
      }).finally(() => {
        G && ut(!1);
      });
    }, 150);
    return () => {
      G = !1, clearTimeout(ce);
    };
  }, [l, ze.id, Ze, ir]);
  const Bn = () => Kt((G) => G + 1), ht = e.segmentGroups || wn, gt = e.performerSlots || wn, Gn = l && e.performerSlotsAvailable !== !1, kt = je(
    () => (e.performerCandidates || []).filter((G) => G.isVideoPerformer),
    [e.performerCandidates]
  ), vn = e.shotBoundaries || wn, Yt = je(
    () => Ea(gt),
    [gt]
  ), Kn = je(
    () => Ye.map((G) => {
      const ce = Yt.get(G.id) || [];
      return {
        ...G,
        slots: ce,
        assignment: ce.every((Oe) => Oe.performerId == null) ? Ps(ce, kt) : null
      };
    }).filter((G) => G.slots.length > 0 && G.assignment != null),
    [Ye, Yt, kt]
  ), xn = Number((so = ze.videoFile) == null ? void 0 : so.frameRate) > 0 ? Number(ze.videoFile.frameRate) : 30;
  function Zt() {
    S(!1), requestAnimationFrame(() => {
      var G;
      return (G = at.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    });
  }
  function pr() {
    F == null && (Wt.current = null, _(!1), $(""), requestAnimationFrame(() => {
      var G;
      return (G = at.current) == null ? void 0 : G.focus({ preventScroll: !0 });
    }));
  }
  function Qt() {
    C(!1), requestAnimationFrame(() => {
      var G, ce;
      (G = yn.current) != null && G.isConnected ? yn.current.focus({ preventScroll: !0 }) : (ce = at.current) == null || ce.focus({ preventScroll: !0 });
    });
  }
  ge(() => {
    bn.current === g ? (bn.current = null, S(!0)) : S(!1);
  }, [g]), ge(() => {
    var ce;
    if (!D) return;
    const G = (ce = bt.current) == null ? void 0 : ce.querySelector("input");
    G == null || G.focus({ preventScroll: !0 }), G == null || G.select();
  }, [D, g]), ge(() => {
    var Oe, _e, tt;
    const G = jt(
      vr(
        e.segments,
        e.performerSlots || [],
        ct({}),
        l && q,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), ce = ((Oe = e.segments.find((_n) => _n.id === s)) == null ? void 0 : Oe.id) ?? ((_e = sa(G)) == null ? void 0 : _e.id) ?? null;
    m(ce), y(ce == null ? [] : [ce]), b.current = ce, f.current = [], pe(pt(G, ce)), I(ct({})), C(!1), Wt.current = null, _(!1), A(1), $(""), ie(wt), Te.current = wt, z(!1), (tt = at.current) == null || tt.focus({ preventScroll: !0 });
  }, [ze.id, s]), ge(() => {
    const G = new AbortController();
    return Q(`/videos/${ze.id}/incorrect-examples`, { signal: G.signal }).then(zt).catch((ce) => {
      ce.name !== "AbortError" && zt([]);
    }), () => G.abort();
  }, [ze.id, d == null ? void 0 : d.effectiveMode]), ge(() => {
    const G = new AbortController();
    return Q(`/videos/${ze.id}/history`, { signal: G.signal }).then((ce) => {
      const Oe = ce || wt;
      Te.current = Oe, ie(Oe);
    }).catch((ce) => {
      ce.name !== "AbortError" && $(ce.message || "Unable to load editor history.");
    }), () => G.abort();
  }, [ze.id]), ge(() => {
    Pl(ee);
  }, [ee.timelineRatio, ee.markerRailOpen, ee.detailWidth, ee.markerRailWidth, ee.swimlaneTitleWidth]), ge(() => {
    Ol(he);
  }, [he]), ge(() => {
    us(q);
  }, [q]), ge(() => {
    const G = Ht.current;
    if (!a || !G || typeof ResizeObserver > "u") return;
    const ce = () => {
      const _e = G.clientHeight;
      oe(_e), B((tt) => {
        const _n = Lr(tt.timelineRatio, _e);
        return _n === tt.timelineRatio ? tt : { ...tt, timelineRatio: _n };
      });
    }, Oe = new ResizeObserver(ce);
    return Oe.observe(G), ce(), () => Oe.disconnect();
  }, [a]), ge(() => {
    if (!gn || typeof ResizeObserver > "u") return;
    const G = qt.current, ce = fn.current;
    if (!G || !ce) return;
    const Oe = () => ve({
      workspace: G.clientWidth,
      focusRow: ce.clientWidth,
      focusRowHeight: ce.clientHeight
    }), _e = new ResizeObserver(Oe);
    return _e.observe(G), _e.observe(ce), Oe(), () => _e.disconnect();
  }, [gn, ee.markerRailOpen]);
  const it = je(
    () => Po(
      vr(
        Ye,
        gt,
        v,
        l && q,
        ht
      ),
      Ct,
      !0
    ),
    [
      Ye,
      gt,
      v,
      q,
      ht,
      l,
      Ct
    ]
  ), U = Object.fromEntries(Xe.map((G) => [G, it.filter((ce) => ce.reviewState === G).length])), Pe = Po(
    vr(
      Ye,
      gt,
      { ...v, reviewStates: Xe },
      l && q,
      ht
    ),
    Ct,
    !0
  ), st = Object.fromEntries(Xe.map((G) => [G, Pe.filter((ce) => ce.reviewState === G).length])), lt = [...new Set(Ye.map((G) => G.sourceKey).filter(Boolean))].sort((G, ce) => yt(G).localeCompare(yt(ce))), Xt = Zi(
    v,
    l && q
  ), Ve = je(
    () => jt(it, ht, gt),
    [it, ht, gt]
  ), de = es(
    Ve,
    g,
    s
  ), Pt = ds(it, u), Ka = !l && Pt.length > 0 && Pt.every((G) => G.nativeSegmentId != null), _r = it.map((G) => G.id), Ua = _r.join("|");
  p.current = (de == null ? void 0 : de.id) ?? null;
  const Hr = Yt.get(de == null ? void 0 : de.id) || [], za = Gr(Hr), qr = je(
    () => gl(Ve, u),
    [Ve, u]
  ), fr = je(() => Kr(Ve), [Ve]), Sn = je(
    () => ul(fr, he),
    [fr, he]
  ), _a = je(
    () => Da(
      Sn.rows,
      hn.scrollTop,
      hn.height
    ),
    [Sn, hn]
  ), Ha = je(
    () => fl(Ve, he),
    [Ve, he]
  ), en = de ? pt(Ve, de.id) : null, yr = ht.length > 0 ? fr.map((G) => G.key) : [], qa = yr.join("|"), Un = Math.max(
    0,
    Number((lo = ze.videoFile) == null ? void 0 : lo.duration) || 0,
    ...Ye.map((G) => Number(G.endSec ?? G.startSec) || 0)
  ), Wr = Number((co = ze.videoFile) == null ? void 0 : co.duration) > 0 ? Number(ze.videoFile.duration) : null;
  Ae.actions;
  const Wa = ya();
  ge(() => {
    const G = g === Zn ? g : (de == null ? void 0 : de.id) ?? null;
    G !== g && m(G);
  }, [de, g]), ge(() => {
    y((G) => {
      const ce = os(
        G,
        _r,
        (de == null ? void 0 : de.id) ?? null
      );
      return ce.length === G.length && ce.every((Oe, _e) => Oe === G[_e]) ? G : ce;
    });
  }, [Ua, de == null ? void 0 : de.id]);
  const tn = (de == null ? void 0 : de.itemId) == null ? null : ((uo = e.itemMetadata) == null ? void 0 : uo[de.itemId]) || null, Va = {
    key: (de == null ? void 0 : de.itemId) != null ? `item:${de.itemId}` : (de == null ? void 0 : de.nativeSegmentId) != null ? `native:${de.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (tn == null ? void 0 : tn.provenance) || (de == null ? void 0 : de.fieldProvenance) || [] : []
  }, br = (de == null ? void 0 : de.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (tn == null ? void 0 : tn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ge(() => {
    ne(de == null ? "" : String(de.startSec)), we((de == null ? void 0 : de.endSec) == null ? "" : String(de.endSec));
  }, [de == null ? void 0 : de.id, de == null ? void 0 : de.startSec, de == null ? void 0 : de.endSec]), ge(() => {
    en && $e((G) => La(G, en));
  }, [ze.id, s, en]), ge(() => {
    pe((G) => vl(yr, G, en));
  }, [ze.id, qa, en]), ge(() => {
    if (!ee.markerRailOpen || (de == null ? void 0 : de.id) == null) return;
    const G = Vt.current, ce = Sn.rows.find((tt) => tt.kind === "segment" && tt.segment.id === de.id);
    if (!G || !ce) return;
    const Oe = ce.top + ce.height;
    let _e = G.scrollTop;
    ce.top < G.scrollTop ? _e = ce.top : Oe > G.scrollTop + G.clientHeight && (_e = Math.max(0, Oe - G.clientHeight)), _e !== G.scrollTop && (G.scrollTop = _e), Jt({ scrollTop: _e, height: G.clientHeight });
  }, [de == null ? void 0 : de.id, Sn, ee.markerRailOpen]), ge(() => {
    const G = Vt.current;
    if (!ee.markerRailOpen || !G) return;
    const ce = () => Jt({
      scrollTop: G.scrollTop,
      height: G.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      ce();
      return;
    }
    const Oe = new ResizeObserver(ce);
    return Oe.observe(G), ce(), () => Oe.disconnect();
  }, [ee.markerRailOpen]);
  const { revealSegmentGroupForSelection: Vr, replaceSegmentSelection: Ja, selectSegment: Jr, selectSegmentCollection: Ya, selectAllVideoSegments: Za } = md({
    allSwimlanes: Ve,
    editorRef: at,
    performerSlots: gt,
    seekRef: _t,
    segmentGroups: ht,
    segments: Ye,
    selectedSegmentId: g,
    selectedSegmentIds: u,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setCollapsedSegmentGroups: $e,
    setEditorFilters: I,
    setHideDerivedSegments: E,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y
  }), { acceptHistory: hr, recordHistoryAction: zn, mutateSegment: Qa, completeReview: Xa, createSegment: Yr, splitSegment: Zr, duplicateSegment: Qr, saveTiming: ei, applyShortcutTiming: ti } = Ml({
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorFilters: v,
    endInput: X,
    hideDerivedSegments: q,
    historyRef: Te,
    mediaDuration: Wr,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: ur,
    pendingDuplicateRef: mr,
    pendingFirstSegmentStartSecRef: Wt,
    pendingTagEditSegmentIdRef: bn,
    replaceSegmentSelection: Ja,
    savingSegmentId: F,
    segments: Ye,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: Pt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setEditorFilters: I,
    setFirstSegmentTagOpen: _,
    setHideDerivedSegments: E,
    setHistory: ie,
    setHistoryOpen: z,
    setPublishApprovedError: ye,
    setSaveMessage: $,
    setSavingSegmentId: J,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    startInput: L,
    timelineDuration: Un,
    video: ze
  });
  function Xr(G = null) {
    var _e;
    if (!l || F != null || !Ye.some((tt) => !tt.published && tt.reviewState === "approved")) return;
    const ce = ((_e = at.current) == null ? void 0 : _e.ownerDocument) ?? document, Oe = ce.activeElement === ce.body ? null : ce.activeElement;
    fe.current = G != null && G.isConnected && G !== ce.body ? G : Oe, ye(""), O(!0);
  }
  function eo() {
    F == null && (O(!1), ye(""), requestAnimationFrame(() => {
      hd(
        fe.current,
        at.current
      ), fe.current = null;
    }));
  }
  async function ni() {
    await Xa() && eo();
  }
  const { closeMergeConfirmation: ri, mergeSelectedSwimlane: to, saveSelectedReviewState: oi } = gd({
    acceptHistory: hr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    historyRef: Te,
    mergeSavingRef: le,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: zn,
    revealSegmentGroupForSelection: Vr,
    reviewSavingRef: Le,
    savingSegmentId: F,
    selectedGroups: qr,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: Pt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setMergeConfirmation: te,
    setSaveMessage: $,
    setSavingSegmentId: J,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: ze
  }), { toggleIncorrectExample: ai, removeIncorrectExample: ii, captureTrainingExport: si, deleteRejectedSegments: no, autoAssignPerformers: li, previewDerivedSegments: di, closeMaterializeDialog: ci, materializeDerivedSegments: ui, saveTag: mi, moveToBin: gi, emptyRecyclingBin: pi } = pd({
    acceptHistory: hr,
    allSwimlanes: Ve,
    autoAssignCandidates: Kn,
    autoAssigning: Ce,
    binEmptyingRef: De,
    canMoveSelectionToBin: Ka,
    closeTagEditing: Zt,
    compatibilityMode: l,
    detail: e,
    editorRef: at,
    exportingExamples: On,
    incorrectExamples: Ct,
    lineage: br,
    materializeButtonRef: un,
    materializePreview: Et,
    materializeRestoreFocusRef: mn,
    materializing: Ut,
    mutateSegment: Qa,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: zn,
    refreshMaterializationPreview: Bn,
    removingExampleId: Pn,
    revealSegmentGroupForSelection: Vr,
    savingSegmentId: F,
    segments: Ye,
    selectedSegment: de,
    selectedSegmentIdRef: p,
    selectedSegments: Pt,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: f,
    setAutoAssignError: Je,
    setAutoAssignOpen: Se,
    setAutoAssigning: Ke,
    setExportingExamples: lr,
    setIncorrectExamples: zt,
    setMaterializeError: mt,
    setMaterializeLoading: ut,
    setMaterializeOpen: St,
    setMaterializePreview: Dt,
    setMaterializing: sr,
    setRemovingExampleId: dr,
    setRejectedDeletionPreview: K,
    setSaveMessage: $,
    setSavingSegmentId: J,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setSelectedSegmentIds: y,
    video: ze
  }), { restoreHistoryTarget: fi, updateTimelineRatio: ro, handleSeparatorPointerDown: yi, handleSeparatorPointerMove: bi, handleSeparatorKeyDown: hi, panelWidthMaximum: oo, panelSeparatorProps: vi, toggleSegmentRail: xi, toggleSegmentGroup: ao, mutateShotBoundary: Si } = fd({
    acceptHistory: hr,
    compatibilityMode: l,
    currentTime: N,
    detail: e,
    editorLayout: ee,
    focusRowRef: fn,
    history: Ae,
    historyRef: Te,
    historySaving: R,
    horizontalLayoutSize: W,
    mediaStackHeight: se,
    mediaStackRef: Ht,
    onDetailChange: t,
    onReload: o,
    railToggleRef: Fn,
    recordHistoryAction: zn,
    savingSegmentId: F,
    savingShot: j,
    savingShotRef: gr,
    setCollapsedSegmentGroups: $e,
    setEditorLayout: B,
    setHistorySaving: x,
    setSaveMessage: $,
    setSavingSegmentId: J,
    setSavingShot: V,
    shotBoundaries: vn,
    timelineDuration: Un,
    video: ze,
    workspaceRef: qt
  }), { executeShortcutById: ki } = yd({
    allSwimlanes: Ve,
    applyShortcutTiming: ti,
    centerTimelineRef: Ln,
    compatibilityMode: l,
    createSegment: Yr,
    currentTime: N,
    deleteRejectedSegments: no,
    duplicateSegment: Qr,
    editorLayout: ee,
    editorRef: at,
    emptyRecyclingBin: pi,
    lineage: br,
    mediaDuration: Wr,
    mergeSelectedSwimlane: to,
    moveToBin: gi,
    mutateShotBoundary: Si,
    openPublishApprovedDialog: Xr,
    playbackControlsRef: pn,
    playbackShortcutConfig: Wa,
    saveSelectedReviewState: oi,
    seekRef: _t,
    segmentGroupKeys: yr,
    selectSegment: Jr,
    selectedSegment: de,
    selectedSegmentGroupForSegment: en,
    selectedSegmentGroupKey: Ne,
    selectedSegments: Pt,
    setCollapsedSegmentGroups: $e,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: Ie,
    setSaveMessage: $,
    setSelectedSegmentGroupKey: pe,
    setTagEditing: S,
    setTimelineZoom: A,
    shotBoundaries: vn,
    slotButtonRef: jn,
    splitSegment: Zr,
    swimlanes: Ha,
    timelineDuration: Un,
    toggleIncorrectExample: ai,
    toggleSegmentGroup: ao,
    updateTimelineRatio: ro,
    videoFrameRate: xn,
    visibleSegments: it
  });
  Ot.current = ki;
  const wi = je(() => Mn.map((G) => ({
    id: G.id,
    enabled: on(G, l),
    surface: "local",
    action: (ce) => {
      var Oe;
      return (Oe = Ot.current) == null ? void 0 : Oe.call(Ot, G.id, ce);
    }
  })), [l]);
  Yo(Dr, wi);
  const Ni = Pr(se), Ii = Ft(ee.markerRailWidth, oo("markerRailWidth")), Ci = Ft(ee.detailWidth, oo("detailWidth"));
  return n(ud, {
    activeFilterCount: Xt,
    allSwimlanes: Ve,
    analysisError: qe,
    analysisRun: It,
    analysisStatus: At,
    approvalFacetCounts: st,
    autoAssignCandidates: Kn,
    autoAssignError: ot,
    autoAssignOpen: Fe,
    autoAssignPerformers: li,
    autoAssigning: Ce,
    captureTrainingExport: si,
    removeIncorrectExample: ii,
    rejectedDeletionPreview: xe,
    centerTimelineRef: Ln,
    closeEditorFilters: Qt,
    closeFirstSegmentTagDialog: pr,
    closeMaterializeDialog: ci,
    closeMergeConfirmation: ri,
    closePublishApprovedDialog: eo,
    closeTagEditing: Zt,
    collapsedSegmentGroups: he,
    compatibilityMode: l,
    configuringTag: cn,
    createSegment: Yr,
    currentTime: N,
    deleteRejectedSegments: no,
    detail: e,
    detailPanelRef: w,
    detailWidth: Ci,
    duplicateSegment: Qr,
    editorFilters: v,
    editorLayout: ee,
    editorRef: at,
    exportingExamples: On,
    filtersButtonRef: yn,
    filtersOpen: H,
    firstSegmentTagOpen: k,
    focusRowRef: fn,
    handleSeparatorKeyDown: hi,
    handleSeparatorPointerDown: yi,
    handleSeparatorPointerMove: bi,
    hideDerivedSegments: q,
    history: Ae,
    historyOpen: h,
    historySaving: R,
    horizontalLayoutSize: W,
    importNativeSegments: sn,
    incorrectExamples: Ct,
    incorrectExamplesOpen: Ge,
    removingExampleId: Pn,
    lineage: br,
    markerRailWidth: Ii,
    materializeButtonRef: un,
    materializeCancelButtonRef: Dn,
    materializeDerivedSegments: ui,
    materializeError: dn,
    materializeLoading: ln,
    materializeOpen: Rt,
    materializePreview: Et,
    materializing: Ut,
    mediaStackRef: Ht,
    mergeCancelButtonRef: Z,
    mergeConfirmation: ae,
    mergeSavingRef: le,
    mergeSelectedSwimlane: to,
    nativeImportState: Rn,
    onNavigate: c,
    openPublishApprovedDialog: Xr,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: vi,
    pendingInitialSeekRef: cr,
    performerSlots: gt,
    performerSlotsAvailable: Gn,
    playbackControlsRef: pn,
    previewDerivedSegments: di,
    provenance: Va,
    provenanceSources: lt,
    publishApprovedCancelButtonRef: be,
    publishApprovedDrafts: ni,
    publishApprovedError: re,
    publishApprovedOpen: Y,
    quickSearchOpen: xt,
    railScrollRef: Vt,
    railToggleRef: Fn,
    recordHistoryAction: zn,
    restoreHistoryTarget: fi,
    saveMessage: M,
    saveTag: mi,
    saveTiming: ei,
    savingSegmentId: F,
    seekRef: _t,
    segmentGroups: ht,
    segmentRailLayout: Sn,
    segments: Ye,
    selectAllVideoSegments: Za,
    selectSegment: Jr,
    selectSegmentCollection: Ya,
    selectedGroups: qr,
    selectedPerformerSlots: Hr,
    selectedSegment: de,
    selectedSegmentGroupKey: Ne,
    selectedSegmentIds: u,
    selectedSegments: Pt,
    selectedSlotStatus: za,
    setAutoAssignError: Je,
    setAutoAssignOpen: Se,
    setConfiguringTag: En,
    setCurrentTime: T,
    setEditorFilters: I,
    setEditorLayout: B,
    setFiltersOpen: C,
    setHideDerivedSegments: E,
    setHistoryOpen: z,
    setIncorrectExamplesOpen: Ue,
    setQuickSearchOpen: Ie,
    setRejectedDeletionPreview: K,
    setRailViewport: Jt,
    setSelectedSegmentGroupKey: pe,
    setSelectedSegmentId: m,
    setShortcutsOpen: Me,
    setTimelineZoom: A,
    shotBoundaries: vn,
    shortcutsOpen: Be,
    slotButtonRef: jn,
    splitLayout: a,
    splitSegment: Zr,
    startFullAnalysis: ar,
    tagEditing: D,
    tagSearchRef: bt,
    timelineDuration: Un,
    timelineRatioBounds: Ni,
    timelineZoom: ue,
    toggleSegmentGroup: ao,
    toggleSegmentRail: xi,
    updateTimelineRatio: ro,
    video: ze,
    videoPerformers: kt,
    visibleCounts: U,
    visibleSegmentRailRows: _a,
    visibleSegments: it,
    wideLayout: gn,
    workspaceRef: qt
  });
}
function xd(e = [], t = []) {
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
function Sd(e = [], t = "", r = "all") {
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
function kd(e = [], t = []) {
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
      const E = b.shift();
      f.push(E);
      for (const N of d.get(E) || [])
        c.has(N) || (c.add(N), b.push(N));
    }
    const w = new Set(f), v = f.map((E) => o.get(E)), I = l.filter((E) => w.has(E.sourceTagId) && w.has(E.derivedTagId)), H = I.flatMap((E) => E.rules), C = v.filter((E) => E.outgoingRuleCount === 0).sort((E, N) => Qe(E.name, N.name)), q = C.length > 0 ? C : [...v].sort((E, N) => Qe(E.name, N.name));
    g.push({
      id: [...f].sort((E, N) => E - N).join(":"),
      label: q.length > 1 ? `${q[0].name} + ${q.length - 1}` : ((y = q[0]) == null ? void 0 : y.name) || "Derivation component",
      nodes: v,
      connections: I,
      rules: H,
      segmentGroupKeys: [...new Set(v.map((E) => E.segmentGroupKey))],
      materializedEdgeCount: H.reduce(
        (E, N) => E + (Number(N.edgeCount) || 0),
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
function wd(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()])), m = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((T) => {
    var F, J;
    (F = g.get(T.sourceTagId)) == null || F.add(T.derivedTagId), (J = m.get(T.derivedTagId)) == null || J.add(T.sourceTagId);
  });
  const u = new Map(e.nodes.map((T) => {
    var F;
    return [
      T.tagId,
      ((F = m.get(T.tagId)) == null ? void 0 : F.size) || 0
    ];
  })), y = new Map(e.nodes.map((T) => [T.tagId, 0])), p = e.nodes.filter((T) => u.get(T.tagId) === 0).sort((T, F) => Qe(T.name, F.name)).map((T) => T.tagId), b = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const T = p.shift();
    if (!b.has(T)) {
      b.add(T);
      for (const F of g.get(T) || [])
        y.set(F, Math.max(y.get(F) || 0, (y.get(T) || 0) + 1)), u.set(F, u.get(F) - 1), u.get(F) === 0 && p.push(F);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter((T) => !b.has(T.tagId)).sort((T, F) => Qe(T.name, F.name)).forEach((T) => y.set(T.tagId, 0));
  const f = Math.max(0, ...y.values()), w = Math.max(
    t,
    240 + f * 296
  ), v = /* @__PURE__ */ new Map();
  e.nodes.forEach((T) => {
    v.has(T.segmentGroupKey) || v.set(T.segmentGroupKey, {
      key: T.segmentGroupKey,
      id: T.segmentGroupId,
      name: T.segmentGroupName,
      sortOrder: T.segmentGroupSortOrder,
      nodes: []
    }), v.get(T.segmentGroupKey).nodes.push(T);
  });
  const I = [...v.values()].sort((T, F) => T.sortOrder - F.sortOrder || Qe(T.name, F.name));
  let H = 28;
  const C = [], q = I.map((T) => {
    const F = /* @__PURE__ */ new Map();
    T.nodes.forEach(($) => {
      const L = y.get($.tagId) || 0;
      F.has(L) || F.set(L, []), F.get(L).push($);
    });
    for (const $ of F.values())
      $.sort((L, ne) => L.segmentGroupTagSortOrder - ne.segmentGroupTagSortOrder || Qe(L.name, ne.name));
    const J = Math.max(1, ...[...F.values()].map(($) => $.length)), j = J * 58 + (J - 1) * 18, V = 70 + j, M = {
      ...T,
      x: 12,
      y: H,
      width: w - 24,
      height: V
    };
    for (const [$, L] of F.entries()) {
      const ne = L.length * 58 + Math.max(0, L.length - 1) * 18, X = (j - ne) / 2;
      L.forEach((we, ue) => C.push({
        ...we,
        rank: $,
        x: 28 + $ * 296,
        y: H + 34 + 18 + X + ue * 76,
        width: 184,
        height: 58
      }));
    }
    return H += V + 16, M;
  }), E = new Map(C.map((T) => [T.tagId, T])), N = e.connections.map((T) => {
    const F = E.get(T.sourceTagId), J = E.get(T.derivedTagId), j = F.x + F.width, V = F.y + F.height / 2, M = J.x, $ = J.y + J.height / 2, L = Math.max(48, (M - j) * 0.48);
    return {
      ...T,
      path: `M ${j} ${V} C ${j + L} ${V}, ${M - L} ${$}, ${M} ${$}`
    };
  });
  return {
    width: w,
    height: Math.max(r, H - 16 + 28),
    nodes: C,
    connections: N,
    groups: q
  };
}
function Nd(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = wd(d, {
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
      const b = y.get(p.sourceTagId), f = y.get(p.derivedTagId), w = b.x + b.width, v = b.y + b.height / 2, I = f.x, H = f.y + f.height / 2, C = Math.max(48, (I - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${v} C ${w + C} ${v}, ${I - C} ${H}, ${I} ${H}`
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
function zo(e, t = []) {
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
function Id(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Cd(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: m, emptyDraft: u, graph: y, layout: p, listSort: b, materializationOffer: f, materializeOutgoingRules: w, materializeRule: v, message: I, normalizedQuery: H, query: C, refreshConfiguredTag: q, revealEditor: E, rules: N, save: T, segmentGroupKey: F, selectedNode: J, selectedRule: j, selection: V, setConfiguringTag: M, setDraft: $, setListSort: L, setMaterializationOffer: ne, setQuery: X, setSegmentGroupKey: we, setSelection: ue, setView: A, sortedVisibleRules: ee, sourceSlots: B, sourceSlotsLoading: se, updateMapping: oe, updateTag: W, view: ve, visibleComponents: Ae, visibleRules: ie } = e;
  function Te(D) {
    const S = y.nodes.find((_) => _.tagId === Number(D.sourceTagId)), k = y.nodes.find((_) => _.tagId === Number(D.derivedTagId));
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
          onClick: () => $(null),
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
              onChange: (D, S) => W("source", D, S == null ? void 0 : S.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !se && B.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (D) => M({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: D.currentTarget
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
              onChange: (D, S) => W("derived", D, S == null ? void 0 : S.label),
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
              onClick: (D) => M({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: D.currentTarget
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
            disabled: r || B.length === 0 || s.length === 0,
            onClick: () => $((D) => ({
              ...D,
              slotMappings: [...D.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((D, S) => n("div", { key: S, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: D.sourceSlotDefinitionId,
              disabled: r,
              onChange: (k) => oe(S, "sourceSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...B.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: D.derivedSlotDefinitionId,
              disabled: r,
              onChange: (k) => oe(S, "derivedSlotDefinitionId", k.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${S + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((k) => n("option", { key: k.id, value: k.id }, et(k)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => $((k) => ({
                ...k,
                slotMappings: k.slotMappings.filter((_, le) => le !== S)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((D) => !D.sourceSlotDefinitionId || !D.derivedSlotDefinitionId),
          onClick: T,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => $(null), className: o }, "Cancel")
      ])
    ]);
  }
  function z() {
    if (J) {
      const k = ie.filter((ae) => Number(ae.derivedTagId) === J.tagId), _ = ie.filter((ae) => Number(ae.sourceTagId) === J.tagId), le = (ae, te, xe) => n("div", {
        key: ae.id,
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
            `${ae.sourceTagName} → ${ae.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          xe ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => v(ae),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(ae, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(ae),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, J.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, J.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${J.incomingRuleCount} incoming · ${J.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (ae) => M({
            tagId: J.tagId,
            tagName: J.name,
            trigger: ae.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        _.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(J, _),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${_.length})`) : null,
        _.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ..._.map((ae) => le(ae, "Derives", !0))
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
            k.map((ae) => le(ae, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!j)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const D = y.nodes.find((k) => k.tagId === Number(j.sourceTagId)), S = y.nodes.find((k) => k.tagId === Number(j.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (D == null ? void 0 : D.segmentGroupName) || "Ungrouped"),
          (D == null ? void 0 : D.segmentGroupKey) !== (S == null ? void 0 : S.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(S == null ? void 0 : S.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${j.sourceTagName} → ${j.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${j.edgeCount} materialized lineage edge${j.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (f == null ? void 0 : f.ruleId) === j.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => v(j, f),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => ne(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        j.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : j.slotMappings.map((k, _) => n("div", {
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
          j.createdAt ? new Date(j.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          j.updatedAt ? new Date(j.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => v(j),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(j),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(j),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function R() {
    if (Ae.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, H ? "No derivation relationships match your search." : "No derivation rules.");
    const D = J == null ? void 0 : J.tagId, S = /* @__PURE__ */ new Set();
    return J && (S.add(J.tagId), p.connections.forEach((k) => {
      (k.sourceTagId === J.tagId || k.derivedTagId === J.tagId) && (S.add(k.sourceTagId), S.add(k.derivedTagId));
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
          className: `absolute rounded-xl border ${F === k.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
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
            const _ = D === k.sourceTagId || D === k.derivedTagId, le = J != null, ae = _ ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${k.id}:visible`,
              d: k.path,
              fill: "none",
              stroke: ae,
              strokeWidth: _ ? 2.5 : 1.5,
              opacity: le && !_ ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((k) => {
          const _ = !H || k.name.toLocaleLowerCase().includes(H), le = J != null, ae = S.has(k.tagId), te = (J == null ? void 0 : J.tagId) === k.tagId;
          return n("button", {
            key: `node:${k.tagId}`,
            type: "button",
            onClick: () => ue({ type: "node", id: k.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${te ? "border-accent bg-accent/15 ring-2 ring-accent/25" : ae ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${k.x}px`,
              top: `${k.y}px`,
              width: `${k.width}px`,
              height: `${k.height}px`,
              opacity: !_ || le && !ae ? 0.62 : 1
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
          const _ = p.nodes.find((ae) => ae.tagId === k.sourceTagId), le = p.nodes.find((ae) => ae.tagId === k.derivedTagId);
          return n("div", {
            key: `bundle:${k.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(_.x + _.width + le.x) / 2 - 24}px`,
              top: `${(_.y + _.height / 2 + le.y + le.height / 2) / 2 - 10}px`
            },
            "aria-label": `${k.rules.length} rules connect ${k.rules[0].sourceTagName} to ${k.rules[0].derivedTagName}`
          }, `${k.rules.length} rules`);
        })
      ])
    ]);
  }
  function x() {
    if (Ae.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        H ? "No derivation relationships match your search." : "No derivation rules."
      );
    const D = /* @__PURE__ */ new Map();
    ee.forEach((k) => {
      const _ = Te(k);
      D.has(_) || D.set(_, []), D.get(_).push(k);
    });
    const S = [
      ...y.segmentGroups.map((k) => k.key),
      "cross-group"
    ].filter((k) => D.has(k));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, S.map((k) => {
      const _ = y.segmentGroups.find((te) => te.key === k), le = k === "cross-group" ? "Cross-group relationships" : (_ == null ? void 0 : _.name) || "Ungrouped", ae = D.get(k);
      return n("section", { key: k, "aria-label": le }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, le),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${ae.length} rule${ae.length === 1 ? "" : "s"}`
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
          ...ae.map((te) => n("button", {
            key: te.id,
            type: "button",
            role: "row",
            onClick: () => ue({ type: "rule", id: te.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(j == null ? void 0 : j.id) === te.id ? "bg-accent/10" : ""}`,
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
          `${N.length} rules · ${y.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          $(u()), ue(null), E();
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
          onChange: (D) => {
            X(D.target.value), ue(null);
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
          value: F,
          disabled: d != null,
          onChange: (D) => {
            we(D.target.value), ue(null), $(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...y.segmentGroups.map((D) => n("option", { key: D.key, value: D.key }, D.name))
        ])
      ]),
      ve === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (D) => L(D.target.value),
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
        ].map(([D, S]) => n("button", {
          key: D,
          type: "button",
          onClick: () => {
            A(D), D === "graph" && (V == null ? void 0 : V.type) === "rule" && ue(null);
          },
          "aria-pressed": ve === D,
          className: `rounded px-3 py-1.5 text-sm font-medium ${ve === D ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        ve === "graph" ? R() : x()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? h() : z()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      I ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, I) : null
    ]),
    i ? n(zr, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => q(i),
      onClose: () => {
        const D = i.trigger;
        M(null), requestAnimationFrame(() => {
          D != null && D.isConnected && D.focus();
        });
      }
    }) : null
  ]);
}
function $d({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = P([]), [a, s] = P(null), [l, d] = P([]), [c, g] = P([]), [m, u] = P(!1), [y, p] = P(!1), [b, f] = P(!1), [w, v] = P(""), [I, H] = P(""), [C, q] = P("graph"), [E, N] = P("all"), [T, F] = P(null), [J, j] = P("relationship"), [V, M] = P(null), [$, L] = P(null), ne = me(null), X = me(null), we = ka().replace(/:/g, "");
  function ue() {
    requestAnimationFrame(() => {
      var K;
      return (K = ne.current) == null ? void 0 : K.scrollIntoView({ block: "nearest" });
    });
  }
  async function A(K) {
    const Z = await Q("/derivation-rules", K ? { signal: K } : void 0);
    i(Z || []);
  }
  ge(() => {
    const K = new AbortController();
    return A(K.signal).catch((Z) => {
      Z.name !== "AbortError" && v(Z.message || "Unable to load derived segment rules.");
    }), () => K.abort();
  }, []), ge(() => {
    const K = new AbortController();
    return a != null && a.sourceTagId ? (u(!0), Q(`/slot-definitions/${a.sourceTagId}`, { signal: K.signal }).then((Z) => d(Z.definitions || [])).catch((Z) => {
      Z.name !== "AbortError" && d([]);
    }).finally(() => {
      K.signal.aborted || u(!1);
    })) : (d([]), u(!1)), a != null && a.derivedTagId ? (p(!0), Q(`/slot-definitions/${a.derivedTagId}`, { signal: K.signal }).then((Z) => g(Z.definitions || [])).catch((Z) => {
      Z.name !== "AbortError" && g([]);
    }).finally(() => {
      K.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => K.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ge(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || m || y)
      return;
    const K = `${a.sourceTagId}:${a.derivedTagId}`;
    X.current !== K && (X.current = K, s((Z) => !Z || Number(Z.sourceTagId) !== Number(a.sourceTagId) || Number(Z.derivedTagId) !== Number(a.derivedTagId) ? Z : il(Z, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    m,
    y
  ]);
  function ee(K, Z = !1) {
    Z || F({ type: "rule", id: K.id }), X.current = null, s({
      ruleId: K.id,
      sourceTagId: K.sourceTagId,
      sourceTagName: K.sourceTagName,
      derivedTagId: K.derivedTagId,
      derivedTagName: K.derivedTagName,
      slotMappings: K.slotMappings.map((Y) => ({
        sourceSlotDefinitionId: Y.sourceSlotDefinitionId,
        derivedSlotDefinitionId: Y.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), v(""), ue();
  }
  function B(K, Z, Y = "") {
    X.current = null, K === "source" ? (d([]), u(Z != null)) : (g([]), p(Z != null)), s((O) => ({
      ...O,
      [`${K}TagId`]: Z == null ? null : Number(Z),
      [`${K}TagName`]: Y || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function se(K) {
    (a == null ? void 0 : a.ruleId) == null && (X.current = null);
    const Z = [A(), t == null ? void 0 : t()];
    return K.draftKind === "source" ? (u(!0), Z.push(Q(`/slot-definitions/${K.tagId}`).then((Y) => d(Y.definitions || [])).finally(() => u(!1)))) : K.draftKind === "derived" && (p(!0), Z.push(Q(`/slot-definitions/${K.tagId}`).then((Y) => g(Y.definitions || [])).finally(() => p(!1)))), Promise.all(Z);
  }
  function oe(K, Z, Y) {
    s((O) => ({
      ...O,
      slotMappings: O.slotMappings.map((re, ye) => ye === K ? { ...re, [Z]: Y } : re)
    }));
  }
  async function W() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const K = zo(a, o);
    if (K) {
      v(K.message);
      return;
    }
    if (a.slotMappings.some((Z) => !Z.sourceSlotDefinitionId || !Z.derivedSlotDefinitionId)) {
      v("Complete or remove every performer slot mapping before saving.");
      return;
    }
    f(!0), v(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let Z = null;
      if (a.ruleId != null) {
        const O = await Q(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${O.deletedSegmentCount}
Removed lineage edges: ${O.removedEdgeCount}
Shared derived segments retained: ${O.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        Z = O.fingerprint;
      }
      v("Saving derived segment rule…");
      const Y = await Q("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: Z
        })
      });
      if (await A(), F(C === "graph" ? { type: "node", id: Number(Y.sourceTagId) } : { type: "rule", id: Y.id }), s(null), a.ruleId == null)
        try {
          const O = await Q(
            `/derivation-rules/${Y.id}/materialization/preview`,
            { method: "POST" }
          );
          M(
            O.createCount + O.linkCount > 0 ? O : null
          ), v(O.createCount + O.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          M(null), v("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        M(null), v("Derived segment rule saved. Previous materializations were removed.");
    } catch (Z) {
      v(Z.message || "Unable to save derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function ve(K) {
    f(!0), v("Previewing rule deletion…");
    try {
      const Z = await Q(
        `/derivation-rules/${K.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${K.sourceTagName} → ${K.derivedTagName}?

Deleted segments: ${Z.deletedSegmentCount}
Removed lineage edges: ${Z.removedEdgeCount}
Shared derived segments retained: ${Z.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const Y = `derivation-rule-delete:${K.id}:${Z.fingerprint}`;
      await Q(`/derivation-rules/${K.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(Y),
          fingerprint: Z.fingerprint
        })
      }), Ee(Y), await A(), (a == null ? void 0 : a.ruleId) === K.id && s(null), (T == null ? void 0 : T.type) === "rule" && T.id === K.id && F(null), (V == null ? void 0 : V.ruleId) === K.id && M(null), v(`Rule deleted with ${Z.deletedSegmentCount} exclusively derived segment${Z.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (Z) {
      v(Z.message || "Unable to delete derived segment rule.");
    } finally {
      f(!1);
    }
  }
  async function Ae(K, Z = null) {
    const Y = Z || await Q(
      `/derivation-rules/${K.id}/materialization/preview`,
      { method: "POST" }
    );
    if (Y.createCount + Y.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const O = `derivation-rule-materialize:${K.id}:${Y.fingerprint}`, re = await Q(`/derivation-rules/${K.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Re(O),
        fingerprint: Y.fingerprint
      })
    });
    return Ee(O), re;
  }
  async function ie(K, Z = null) {
    f(!0), v("Finding pending derivations…");
    try {
      const Y = await Ae(K, Z);
      if (M(null), await A(), Y.createdCount + Y.linkedCount === 0) {
        v("Every applicable derivation is already materialized.");
        return;
      }
      v(
        `${Y.createdCount} derived segment${Y.createdCount === 1 ? "" : "s"} created and ${Y.linkedCount} existing segment${Y.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (Y) {
      v(Y.message || "Unable to materialize pending derivations.");
    } finally {
      f(!1);
    }
  }
  async function Te(K, Z) {
    if (Z.length === 0) return;
    f(!0), v(`Finding pending derivations from ${K.name}…`);
    let Y = 0, O = 0;
    try {
      for (const re of Z) {
        const ye = await Ae(re);
        Y += ye.createdCount, O += ye.linkedCount;
      }
      M(null), await A(), v(Y + O === 0 ? `Every outgoing derivation from ${K.name} is already materialized.` : `${Y} derived segment${Y === 1 ? "" : "s"} created and ${O} existing segment${O === 1 ? "" : "s"} linked from ${K.name}.`);
    } catch (re) {
      await A().catch(() => {
      }), v(re.message || `Unable to materialize derivations from ${K.name}.`);
    } finally {
      f(!1);
    }
  }
  const h = zo(a, o), z = je(
    () => kd(o, e),
    [o, e]
  ), R = I.trim().toLocaleLowerCase(), D = z.components.filter((K) => E === "all" || K.segmentGroupKeys.includes(E)).filter((K) => !R || K.nodes.some((Z) => Z.name.toLocaleLowerCase().includes(R))), S = D.flatMap((K) => K.rules), k = new Set(
    D.flatMap((K) => K.nodes.map((Z) => Z.tagId))
  ), _ = je(
    () => Nd(D),
    [D]
  ), le = C === "list" ? Id(
    T,
    S,
    R.length > 0
  ) : null, ae = (T == null ? void 0 : T.type) === "node" && z.nodes.find((K) => K.tagId === T.id && k.has(K.tagId)) || null, te = [...S].sort((K, Z) => J === "source" ? Qe(K.sourceTagName, Z.sourceTagName) || Qe(K.derivedTagName, Z.derivedTagName) : J === "target" ? Qe(K.derivedTagName, Z.derivedTagName) || Qe(K.sourceTagName, Z.sourceTagName) : J === "materialized" ? (Number(Z.edgeCount) || 0) - (Number(K.edgeCount) || 0) || Qe(K.sourceTagName, Z.sourceTagName) : Qe(
    `${K.sourceTagName} ${K.derivedTagName}`,
    `${Z.sourceTagName} ${Z.derivedTagName}`
  ));
  return n(Cd, {
    arrowMarkerId: we,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: $,
    deleteRule: ve,
    derivedSlots: c,
    derivedSlotsLoading: y,
    draft: a,
    draftIssue: h,
    editRule: ee,
    editorRef: ne,
    emptyDraft: r,
    graph: z,
    layout: _,
    listSort: J,
    materializationOffer: V,
    materializeOutgoingRules: Te,
    materializeRule: ie,
    message: w,
    normalizedQuery: R,
    query: I,
    refreshConfiguredTag: se,
    revealEditor: ue,
    rules: o,
    save: W,
    segmentGroupKey: E,
    selectedNode: ae,
    selectedRule: le,
    selection: T,
    setConfiguringTag: L,
    setDraft: s,
    setListSort: j,
    setMaterializationOffer: M,
    setQuery: H,
    setSegmentGroupKey: N,
    setSelection: F,
    setView: q,
    sortedVisibleRules: te,
    sourceSlots: l,
    sourceSlotsLoading: m,
    updateMapping: oe,
    updateTag: B,
    view: C,
    visibleComponents: D,
    visibleRules: S
  });
}
function Td() {
  const [e, t] = P(ya), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => wo({ ...l, [a]: s }));
  }
  function i() {
    t(wo(Or));
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
function Md({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = P([]), [a, s] = P(!1), [l, d] = P(!1), [c, g] = P(""), [m, u] = P(""), [y, p] = P("all"), [b, f] = P(() => /* @__PURE__ */ new Set()), [w, v] = P(null);
  ge(() => {
    if (!e || a) return;
    const M = new AbortController();
    return d(!0), g(""), Q("/slot-definitions", { signal: M.signal }).then(($) => {
      i($ || []), s(!0);
    }).catch(($) => {
      $.name !== "AbortError" && g($.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      M.signal.aborted || d(!1);
    }), () => M.abort();
  }, [e, a]);
  async function I() {
    d(!0), g("");
    try {
      const M = await Q("/slot-definitions");
      i(M || []), s(!0);
    } catch (M) {
      g(M.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function H() {
    const [M] = await Promise.all([
      Q("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(M || []), s(!0), g("");
  }
  function C() {
    const M = w == null ? void 0 : w.trigger;
    v(null), requestAnimationFrame(() => {
      M != null && M.isConnected && M.focus({ preventScroll: !0 });
    });
  }
  function q(M) {
    f(($) => {
      const L = new Set($);
      return L.has(M) ? L.delete(M) : L.add(M), L;
    });
  }
  const E = je(
    () => xd(t, o),
    [t, o]
  ), N = je(
    () => Sd(E, m, y),
    [E, m, y]
  ), T = E.flatMap((M) => M.tags), F = T.filter((M) => M.definitions.length > 0).length, J = T.length - F, j = [
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
        `${T.length} tags · ${F} with slots · ${J} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: m,
          onChange: (M) => u(M.target.value),
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
          j.map(([M, $]) => n("button", {
            key: M,
            type: "button",
            onClick: () => p(M),
            "aria-pressed": y === M,
            className: `rounded px-3 py-1.5 text-xs font-medium ${y === M ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, $))
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
          onClick: () => f(new Set(E.map((M) => M.overviewKey))),
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
        onClick: I,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && N.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, N.map((M) => {
      const $ = b.has(M.overviewKey), L = M.tags.filter((ne) => ne.definitions.length > 0).length;
      return n("article", {
        key: M.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => q(M.overviewKey),
          "aria-expanded": !$,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, $ ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, M.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${M.tags.length} tag${M.tags.length === 1 ? "" : "s"} · ${L} with slots`
          )
        ]),
        $ ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          M.tags.map((ne) => n("li", {
            key: ne.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: ne.tagName }, ne.tagName),
              ne.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            ne.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${ne.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, ne.definitions.map((X) => n("li", {
              key: X.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, et(X)),
              ...(X.genderHints || []).map((we) => n("span", {
                key: we,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, nr(we)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (X) => v({
                tagId: ne.tagId,
                tagName: ne.tagName,
                trigger: X.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ne.tagName}`,
              className: `${V} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(zr, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: H,
      onClose: C
    }) : null
  ]);
}
function Ad({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = P("general"), [a, s] = P([]), [l, d] = P(!1), [c, g] = P(""), [m, u] = P(""), [y, p] = P(null), [b, f] = P(!0), [w, v] = P(!1), [I, H] = P(""), [C, q] = P(!0), [E, N] = P(ca), T = Cs(t), F = T.map(([$]) => $);
  ge(() => {
    F.includes(o) || i(F[0] || "general");
  }, [t.effectiveMode]);
  async function J($) {
    const L = await Q("/segment-groups", $ ? { signal: $ } : void 0);
    s(L || []);
  }
  ge(() => {
    const $ = new AbortController();
    return J($.signal).catch((L) => {
      L.name !== "AbortError" && g(L.message || "Unable to load tag groups.");
    }), () => $.abort();
  }, []), ge(() => {
    if (t.effectiveMode !== "full") {
      f(!1);
      return;
    }
    const $ = new AbortController();
    return H(""), f(!0), Promise.all([
      Q("/analysis/settings", { signal: $.signal }),
      Q("/analysis/status", { signal: $.signal })
    ]).then(([L, ne]) => {
      q(!0), u((L == null ? void 0 : L.baseUrl) || ""), p(ne);
    }).catch((L) => {
      if (L.name !== "AbortError") {
        if (L.status === 403) {
          q(!1), H("You do not have permission to manage the analysis service connection.");
          return;
        }
        H(L.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      $.signal.aborted || f(!1);
    }), () => $.abort();
  }, [t.effectiveMode]);
  async function j($) {
    if ($ !== t.requestedMode) {
      d(!0), g("");
      try {
        const L = await Q(
          `/preferences/transition?mode=${encodeURIComponent($)}`
        );
        let ne = !1, X = null, we = null, ue = null, A = !1;
        if (t.requestedMode === "basic" && $ === "full") {
          if (!window.confirm(Ms(
            L.recyclingBinCount,
            L.protectedRecyclingBinCount
          )))
            return;
          A = !0, L.recyclingBinCount > 0 && (ne = !0, ue = L.recyclingBinFingerprint, X = `mode-switch-empty-bin:${ue}`, we = Re(X));
        }
        let ee = !1;
        if (t.requestedMode === "full" && $ === "basic") {
          if (!window.confirm(Ts(
            L.extensionOwnedSegmentCount
          )))
            return;
          ee = !0;
        }
        const B = await Q("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: $,
            confirmHiddenExtensionOwnedSegments: ee,
            confirmBasicHistoryCleanup: A,
            emptyRecyclingBin: ne,
            operationId: we,
            expectedRecyclingBinFingerprint: ue
          })
        });
        X && Ee(X), r == null || r(ba(B)), g("Workflow mode saved.");
      } catch (L) {
        g(L.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function V($) {
    $.preventDefault(), v(!0), H("");
    try {
      const L = await Q("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: m })
      });
      u((L == null ? void 0 : L.baseUrl) || "");
      const ne = await Q("/analysis/status");
      p(ne), H(L != null && L.baseUrl ? ne != null && ne.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ne == null ? void 0 : ne.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (L) {
      H(L.message || "Unable to save analysis service settings.");
    } finally {
      v(!1);
    }
  }
  const M = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: ($) => Fa($, e, M), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      T.map(([$, L]) => n("button", {
        key: $,
        type: "button",
        onClick: () => i($),
        "aria-current": o === $ ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === $ ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, L))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Td)
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
      n(Jl, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: j,
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
          checked: E,
          onChange: ($) => {
            const L = $.target.checked;
            ua(L), N(L);
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
            onChange: ($) => u($.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: b || w || !C,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: b || w || !C,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        I || (b ? "Loading analysis service settings…" : (y == null ? void 0 : y.configured) === !1 ? "Full Scan is not configured." : y != null && y.ready ? "Analysis service is ready." : (y == null ? void 0 : y.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    F.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n($d, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => J()
      })
    ) : null,
    F.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Md, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => J()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function _o({ facets: e, values: t, disabled: r, onChange: o }) {
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
function Rd({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, m;
  const s = [...e.slots || []].sort((u, y) => u.sortOrder - y.sortOrder || String(u.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), l = [...new Map(s.map((u) => [
    u.performerId,
    { id: u.performerId, name: u.performerName }
  ])).values()], d = s.map((u) => ({
    slotDefinitionId: u.slotDefinitionId,
    label: et(u),
    performer: { id: u.performerId, name: u.performerName }
  })), c = va(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: Ta(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${ke(e.startSec)} to ${e.endSec == null ? "end of video" : ke(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${ke(e.startSec)} → end` : `${ke(e.startSec)} – ${ke(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(Gt, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((m = e.activity) == null ? void 0 : m.name) || "Tag segment"),
          l.length ? n(rr, {
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
function Ed({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Jo, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Es(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: va(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ho({ onNavigate: e, profile: t }) {
  const r = je(() => {
    const A = Zo("ext:com.midnightrider.segment-studio:segments");
    return A ? {
      ...xr,
      defaultFilter: { ...xr.defaultFilter, ...A.findFilter || {} },
      defaultObjectFilter: A.objectFilter || {}
    } : xr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Qo(r), [l, d] = P(null), [c, g] = P({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [m, u] = P(null), [y, p] = P(null), [b, f] = P(0), [w, v] = P(""), [I, H] = P(!0), [C, q] = P(""), E = me(0), N = Io(o, i), T = N.activityTagId, F = rn(i.slots), J = je(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (A) => Object.keys(rn(A)).length > 0,
    sanitize: (A) => Sr(T, rn(A)),
    summarize: (A) => `${Object.keys(rn(A)).length} assigned`,
    renderEditor: (A, ee) => T ? n(_o, {
      facets: l,
      values: rn(A),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (B, se) => {
        const oe = { ...rn(A) };
        se ? oe[B] = Number(se) : delete oe[B], ee(Sr(T, oe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [T, l, c.performerSlotsAvailable]), j = JSON.stringify(N);
  ge(() => {
    if (d(null), !T) return;
    const A = new AbortController();
    return Q(`/browse/activities/${T}/facets`, { signal: A.signal }).then(d).catch((ee) => {
      ee.status === 403 ? d({ slots: [], restricted: !0 }) : ee.name !== "AbortError" && q(ee.message);
    }), () => A.abort();
  }, [T]), ge(() => {
    const A = ++E.current, ee = new AbortController();
    return H(!0), q(""), Q("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(N), signal: ee.signal }).then((B) => {
      A === E.current && g({ ...B, totalCount: B.totalCount ?? B.total ?? 0 });
    }).catch((B) => {
      if (!(A !== E.current || B.name === "AbortError")) {
        if (B.status === 400 && B.message.includes("unrestricted performer read access")) {
          g((se) => ({ ...se, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), q("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        q(B.message);
      }
    }).finally(() => {
      A === E.current && H(!1);
    }), () => {
      E.current++, ee.abort();
    };
  }, [j, b]);
  const V = c.items.findIndex((A) => A.key === m), M = c.items[V] || null;
  function $(A) {
    s(A), a({ ...o, page: 1 });
  }
  function L(A) {
    const ee = Io(o, A), B = A.slots && ee.activityTagId != null && ee.slotAssignments.length > 0 ? A.slots : void 0;
    $({ ...A, slots: B });
  }
  function ne(A, ee) {
    const B = { ...F };
    ee ? B[A] = Number(ee) : delete B[A], $({ ...i, slots: Sr(T, B) });
  }
  function X() {
    const A = document.querySelector(`[data-segment-key="${m}"]`);
    u(null), requestAnimationFrame(() => A == null ? void 0 : A.focus());
  }
  async function we(A) {
    var se;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(A.key), v("");
    const ee = `browse-restore:${A.itemId}:${A.revision}`, B = Re(ee);
    try {
      const oe = (W = !1) => Q(`/bin/${A.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: B,
          expectedRevision: A.revision,
          discardMissingImage: W
        })
      });
      try {
        await oe(jr(ee));
      } catch (W) {
        if (((se = W.payload) == null ? void 0 : se.code) !== "missing-image" || !window.confirm(`${W.message}

Continue and discard the missing image reference?`))
          throw W;
        Br(ee), await oe(!0);
      }
      Ee(ee), m === A.key && u(null), v("Segment restored to Cove."), f((W) => W + 1);
    } catch (oe) {
      v(oe.message || "Unable to restore the segment."), oe.status === 409 && f((W) => W + 1);
    } finally {
      p(null);
    }
  }
  async function ue(A) {
    p(A.key), v("");
    try {
      const ee = await Q(`/items/${A.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: A.revision })
      });
      if (!Na(ee, v) || !_s(ee))
        return;
      const B = `browse-dependency-delete:${A.itemId}:${ee.fingerprint}`;
      await Q(`/items/${A.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Re(B),
          fingerprint: ee.fingerprint
        })
      }), Ee(B), m === A.key && u(null), v(`${ee.deletedSegmentCount} segment${ee.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), f((se) => se + 1);
    } catch (ee) {
      v(ee.message || "Unable to permanently delete the segment."), ee.status === 409 && f((B) => B + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(Ur, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Xo, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: I,
      error: C ? new Error(C) : null,
      onRetry: () => f((A) => A + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? No.filter((A) => A.id !== "performers") : No,
      objectFilter: i,
      onObjectFilterChange: L,
      customFilterSections: J,
      searchPlaceholder: "Search segments..."
    }, [
      T ? n(_o, { key: "slots", facets: l, values: F, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ne }) : null,
      n(Ed, { key: "player", item: M, index: V, count: c.items.length, onPrevious: () => {
        var A;
        return u((A = c.items[V - 1]) == null ? void 0 : A.key);
      }, onNext: () => {
        var A;
        return u((A = c.items[V + 1]) == null ? void 0 : A.key);
      }, onClose: X, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !I && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      I ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((A) => n(Rd, {
        key: A.key,
        item: A,
        selected: A.key === m,
        busy: y === A.key,
        onSelect: () => u(A.key),
        onRestore: we,
        onPurge: ue
      })))
    ])
  ]);
}
function Dd({ onNavigate: e, profile: t }) {
  const [r, o] = P([]), [i, a] = P(""), [s, l] = P(0), [d, c] = P(!0), [g, m] = P(null), [u, y] = P(""), p = me(null);
  async function b(v) {
    const I = await Q("/bin", v ? { signal: v } : void 0);
    return o(I.items || []), a(I.fingerprint || ""), l(Number(I.totalCount) || 0), I;
  }
  ge(() => {
    const v = new AbortController();
    return c(!0), b(v.signal).catch((I) => {
      I.name !== "AbortError" && y(I.message);
    }).finally(() => {
      v.signal.aborted || c(!1);
    }), () => v.abort();
  }, []), Yo(Dr, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var v;
      return (v = p.current) == null ? void 0 : v.call(p);
    }
  }]);
  async function f(v) {
    var C;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    m(v.itemId), y("");
    const I = `restore:${v.itemId}:${v.revision}`, H = Re(I);
    try {
      const q = (E = !1) => Q(`/bin/${v.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: H, expectedRevision: v.revision, discardMissingImage: E })
      });
      try {
        await q(jr(I));
      } catch (E) {
        if (((C = E.payload) == null ? void 0 : C.code) !== "missing-image" || !window.confirm(`${E.message}

Continue and discard the missing image reference?`)) throw E;
        Br(I), await q(!0);
      }
      Ee(I), await b(), Nn(), y("Segment restored with a new native ID.");
    } catch (q) {
      y(q.message || "Unable to restore the segment."), q.status === 409 && await b();
    } finally {
      m(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const v = await Ca({
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
    n(Ur, {
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
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, v.endSec == null ? ke(v.startSec) : `${ke(v.startSec)} – ${ke(v.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${v.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${v.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => f(v), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const qo = "ext:com.midnightrider.segment-studio:videos";
function wr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = je(() => {
    var j;
    const F = Zo(qo), J = (j = F == null ? void 0 : F.uiOptions) == null ? void 0 : j.displayMode;
    return F ? {
      ...kn,
      defaultFilter: { ...kn.defaultFilter, ...F.findFilter || {} },
      defaultObjectFilter: F.objectFilter || {},
      defaultDisplayMode: kn.allowedDisplayModes.includes(J) ? J : kn.defaultDisplayMode
    } : kn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Qo(i), [m, u] = P({ items: [], totalCount: 0 }), [y, p] = P(!0), [b, f] = P(""), [w, v] = P(0), I = me(0), H = JSON.stringify(a), C = JSON.stringify(s), q = t || r === "review";
  ge(() => {
    const F = ++I.current, J = new AbortController();
    return p(!0), f(""), Q(`/videos?${Hl(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: J.signal }).then((j) => {
      F === I.current && u(j);
    }).catch((j) => {
      F === I.current && j.name !== "AbortError" && f(j.message || "Unable to discover videos.");
    }).finally(() => {
      F === I.current && p(!1);
    }), () => {
      I.current++, J.abort();
    };
  }, [H, C, t, r, w]);
  function E(F) {
    d({ ...F, page: F.page || 1 });
  }
  function N(F) {
    c(F), d({ ...a, page: 1 });
  }
  const T = t || r === "review" ? Go : Go.filter((F) => !["reviewState", "shotBoundaries"].includes(F.id));
  return n("div", { className: "w-full space-y-5" }, [
    n(Ur, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Xo, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: qo,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: E,
      totalCount: m.totalCount,
      isLoading: y,
      error: b ? new Error(b) : null,
      onRetry: () => v((F) => F + 1),
      sortOptions: t || r === "review" ? [...Bo, { value: "unreviewed_count", label: "Unreviewed count" }] : Bo,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: T,
      objectFilter: s,
      onObjectFilterChange: N,
      searchPlaceholder: "Search Segment Studio videos..."
    }, [
      !y && m.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !y && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, m.items.map((F) => n(ql, { key: F.videoId, item: F, onNavigate: e, showReviewStates: q }))) : null,
      !y && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, m.items.map((F) => n(Wl, { key: F.videoId, item: F, onNavigate: e, showReviewStates: q }))) : null
    ])
  ]);
}
function Wo({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = P(null), [s, l] = P(!0), [d, c] = P(""), g = me(0), m = me(0), u = me(e), y = Rl();
  u.current = e;
  const p = (I) => `/videos/${I}/editor`;
  async function b(I, H, C) {
    const q = await Q(p(H), C ? { signal: C.signal } : void 0);
    return Lt(I, C ? g.current : m.current, H, u.current) ? (a(q), !0) : !1;
  }
  ge(() => {
    const I = ++g.current, H = e, C = new AbortController();
    return a(null), l(!0), c(""), b(I, H, C).catch((q) => {
      Lt(I, g.current, H, u.current) && q.name !== "AbortError" && c(q.message || "Unable to load the editor.");
    }).finally(() => {
      Lt(I, g.current, H, u.current) && l(!1);
    }), () => {
      g.current++, m.current++, C.abort();
    };
  }, [e]);
  function f(I, H) {
    a((C) => (C == null ? void 0 : C.video.id) !== H ? C : typeof I == "function" ? I(C) : I);
  }
  async function w() {
    const I = e, H = ++m.current;
    try {
      const C = await Q(p(I));
      return Lt(H, m.current, I, u.current) ? (a(C), c("A newer canonical segment was loaded. Your stale change was not applied."), C) : null;
    } catch (C) {
      return Lt(H, m.current, I, u.current) && c(C.message || "Unable to reload the latest segment."), null;
    }
  }
  async function v() {
    const I = e, H = ++m.current;
    try {
      const C = await Q(p(I));
      return Lt(H, m.current, I, u.current) ? (a(C), c(""), C) : null;
    } catch (C) {
      return Lt(H, m.current, I, u.current) && c(C.message || "Unable to reload performer slots."), null;
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
      n(Ri, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(vd, {
      key: i.video.id,
      detail: i,
      onDetailChange: f,
      onConflict: w,
      onReload: v,
      onSlotsChanged: v,
      splitLayout: y,
      profile: o,
      initialSegmentId: $o() ? -$o() : Ds(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Od(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Pd(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Ld(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Fd({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Ns(o), l = Od(e, t, window.location.pathname), d = Pd(e, t, window.location.pathname), c = Ld(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if ($s(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(wr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Ad, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ho, { onNavigate: r, profile: o });
    const y = Number(e);
    return Number.isInteger(y) && y > 0 ? n(Wo, {
      videoId: y,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(wr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Dd, { onNavigate: r, profile: o });
  const u = Number(e);
  return d ? n(Ho, { onNavigate: r, profile: o }) : Number.isInteger(u) && u > 0 ? n(Wo, {
    videoId: u,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(wr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function jd({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = P(null), [a, s] = P("");
  return ge(() => {
    const l = new AbortController();
    return Q("/preferences", { signal: l.signal }).then((d) => i(ba(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Fd, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Bd(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Gd(e, t) {
  const r = Bd(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const ic = {
  components: { SegmentStudioPage: jd },
  actionHandlers: { openSegmentStudio: Gd }
};
export {
  Zn as CLEARED_SEGMENT_SELECTION_ID,
  Bo as DISCOVERY_SORT_OPTIONS,
  Nt as SEGMENT_STUDIO_CAPABILITIES,
  Dr as SEGMENT_STUDIO_EXTENSION_ID,
  Mn as SEGMENT_STUDIO_SHORTCUTS,
  Zi as activeEditorFilterCount,
  il as applyDerivationRuleSlotSuggestions,
  Oo as applyFeedbackEditorDelta,
  Eo as applySegmentMergeDelta,
  Ws as basicSegmentTimelineStyle,
  Es as browseClipEnd,
  va as browseEditorHref,
  Io as buildBrowseRequest,
  kd as buildDerivationRuleGraph,
  Hl as buildDiscoverySearchParams,
  Li as buildMinuteTimelineTicks,
  xd as buildPerformerSlotOverview,
  js as buildSegmentQuickSearchEntries,
  ul as buildSegmentRailRows,
  ml as buildTimelineRows,
  qd as buildTimelineTicks,
  Gi as calculateCenteredTimelineScroll,
  Ir as calculateEditorPanelMaximum,
  Fi as calculateMinuteLabelStride,
  Wd as calculateMinuteTimelineWidth,
  zi as calculateSwimlaneTitleMaximum,
  Ki as calculateTimelinePlayheadPosition,
  Pr as calculateTimelineRatioBounds,
  Hi as calculateTimelineRatioFromPointer,
  Vd as calculateVerticalRevealOffset,
  Ft as clampEditorPanelWidth,
  Vn as clampSwimlaneTitleWidth,
  da as clampTimelineRatio,
  Lr as clampTimelineRatioForHeight,
  Yn as clampTimelineZoom,
  Kl as compactProvenanceSummary,
  ic as default,
  zs as downloadFileNameFromContentDisposition,
  Qi as dualRangeValueFromPointer,
  So as duplicateIdentityFromResponse,
  vs as duplicateOperationKey,
  Yi as editorVisibilityIncludingSegment,
  fl as expandedSwimlanes,
  Ts as extensionOwnedSegmentsModeSwitchPrompt,
  xl as feedbackFrameTimestamps,
  kl as feedbackResultMatchesAction,
  Sl as feedbackSelectionPlan,
  Ji as filterDerivedSegments,
  vr as filterEditorSegments,
  Sd as filterPerformerSlotOverview,
  Fs as filterSegmentQuickSearch,
  Xd as filterSegmentStudioShortcuts,
  hl as findAdjacentSegmentGroupKey,
  ks as findAdjacentShot,
  ys as findEditorShortcut,
  sa as findInitialSegmentSelection,
  Pi as findNearestSegmentInCurrentSwimlane,
  Ss as findPublishedSelectionIdentity,
  We as findSegmentByStableIdentity,
  qi as findSegmentFromPlayhead,
  Oi as findSegmentNearPlayhead,
  bl as findSwimlaneRangeSelection,
  Ar as findSwimlaneSelection,
  Ps as findUniquePerformerSlotAssignment,
  la as findUnreviewedSelection,
  nr as formatGenderHint,
  ws as frameStepSeconds,
  xa as generatePerformerSlotAssignmentRecommendations,
  nd as groupApprovedDraftsForPublishing,
  Ls as groupAutoAssignCandidates,
  wl as groupIncorrectExamplesByTag,
  sd as groupMaterializationOutputs,
  jt as groupSegmentsIntoSwimlanes,
  gl as groupSelectedSwimlanes,
  Kr as groupSwimlanesBySegmentGroup,
  rt as handleModalKey,
  an as hasSegmentStudioCapability,
  Po as hideCollectedFeedbackSegments,
  tl as historyActionsForTarget,
  Ea as indexPerformerSlotsBySegment,
  tc as initialReviewFilter,
  Cl as insertSegmentProjection,
  Lt as isCurrentEditorRequest,
  Qs as isEditableTarget,
  rc as isEditorShortcutOwner,
  Ld as isSegmentStudioBinRoute,
  Pd as isSegmentStudioSegmentsRoute,
  Od as isSegmentStudioSettingsRoute,
  wd as layoutDerivationRuleComponent,
  Nd as layoutDerivationRuleComponents,
  Tl as mergeSegmentsProjection,
  ol as multiSelectionActionHint,
  is as nextSegmentAfterRemoval,
  ss as nextUnreviewedAfterRemoval,
  Mt as normalizeCollapsedSegmentGroups,
  Uo as normalizeDiscoveryIds,
  ct as normalizeEditorSegmentFilters,
  $t as normalizeGender,
  ko as normalizeReviewFilter,
  ba as normalizeSegmentStudioFeatureProfile,
  ec as normalizeSegmentStudioMode,
  Tr as normalizeSegmentStudioPublicMode,
  rn as parseBrowseSlotFilters,
  _i as parseEditorLayout,
  Wi as parseHideDerivedSegmentsPreference,
  Vi as parseMergeConfirmationPreference,
  fa as parsePlaybackShortcutConfig,
  ps as parseShortcutBindingOverrides,
  er as patchSegmentProjection,
  ls as percentageSeekTime,
  Os as performInitialSegmentSeek,
  He as performerOptionId,
  Qn as performerSlotHistoryState,
  et as performerSlotLabel,
  sl as performerSlotPresentation,
  ac as performerSlotStatus,
  Gr as performerSlotStatusFromSegmentSlots,
  Ra as performerSlotsForSegment,
  yt as provenanceSourceLabel,
  Sa as rankPerformerOptions,
  vl as reconcileSegmentGroupKey,
  os as reconcileSelectedSegmentIds,
  Vl as recyclingBinActionText,
  Hs as recyclingBinDeletionPrompt,
  Ia as recyclingBinDeletionSummary,
  Ms as recyclingBinModeSwitchPrompt,
  $l as removeSegmentsProjection,
  $o as requestedOwnedItemId,
  Ds as requestedSegmentId,
  es as resolveEditorSegmentSelection,
  xs as resolveSegmentCreationAction,
  $s as resolveSegmentStudioRoute,
  fs as resolveSegmentStudioShortcuts,
  Id as resolveSelectedDerivationRule,
  ds as resolveSelectedSegments,
  hd as restorePublishApprovedFocus,
  La as revealCollapsedSegmentGroup,
  $a as segmentBadgeStyle,
  tr as segmentGroupHeaderBackground,
  pt as segmentGroupKeyForSegment,
  Aa as segmentHistoryIdentity,
  Hn as segmentHistoryState,
  Ta as segmentRailItemStyle,
  nc as segmentStateStyle,
  Bd as segmentStudioActionTarget,
  Ns as segmentStudioLegacyMode,
  qs as segmentTimelineStyle,
  dt as segmentsHistoryState,
  as as selectAllVideoSegmentIds,
  As as selectedBrowseStates,
  Oa as selectedSwimlaneMerge,
  Fa as setBackLinkNavigation,
  nl as sharedPerformerSlotShape,
  rl as sharedTagPerformerSlotShape,
  on as shortcutAvailableInMode,
  bs as shortcutBindingDisplayText,
  Jd as shortcutBindingFromEvent,
  Zd as shortcutBindingsOverlap,
  Qd as shortcutModesOverlap,
  gs as shortcutRequiresSingleSegment,
  Jn as shotBoundaryFingerprint,
  el as shouldAcceptCurrentTagFromEnter,
  Yd as shouldExitShortcutCapture,
  oc as shouldHandleEditorShortcut,
  jo as shouldReloadAfterSegmentMutation,
  $r as shouldRestoreTransitionSelection,
  Bs as shouldShowQuickSearchGroups,
  vo as splitShortcutCategoriesIntoColumns,
  al as suggestDerivationRuleSlotMappings,
  $n as swimlaneDisplayLabel,
  Zs as swimlaneMarkerTop,
  Js as swimlaneStripeBackground,
  Ui as timelineContentStyle,
  yo as timelinePlayheadHorizontalStyle,
  Vs as timelineSegmentWidth,
  ji as timelineTickAlignment,
  Bi as timelineTickPosition,
  Nr as timelineTimePercent,
  yl as toggleAllCollapsedSegmentGroups,
  hs as toggledSelectionReviewState,
  vt as trapModalFocus,
  Gs as tryParseJsonResponseText,
  rs as updateAnchoredSegmentSelection,
  Xi as updateDualRangeValues,
  ts as updateSegmentCollectionSelection,
  ns as updateSegmentRangeSelection,
  ma as updateSegmentSelection,
  zo as validateDerivationRuleDraft,
  fo as validateSegmentTiming,
  Fr as videoPerformerOptions,
  kr as videoPerformerSlotAssignments,
  Cs as visibleSegmentStudioSettingsTabs,
  Is as visibleSegmentStudioTabs,
  Da as visibleVirtualRows
};
