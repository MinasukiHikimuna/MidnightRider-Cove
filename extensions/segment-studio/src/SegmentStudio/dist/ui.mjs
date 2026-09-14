import oo from "@cove/runtime/react";
import { createPortal as vs } from "@cove/runtime/react-dom";
import { extensionFetch as Ea } from "@cove/runtime/api";
import { formatDuration as xs, EntityReferenceSelector as Hn, useExtensionKeyboardBindings as Ss, VideoPlayer as Da, useRegisterExtensionKeyboardActions as Pa, getDefaultFilter as Oa, useListUrlState as La, ListPage as Fa } from "@cove/runtime/components";
import { ChevronDown as ja, StepBack as ks, StepForward as ws, Loader2 as Ns } from "@cove/runtime/lucide-react";
const ao = "com.midnightrider.segment-studio", Ba = "segment-studio.layout.v1", en = "segment-studio.operations.v1", Ga = "segment-studio.collapsed-segment-groups.v1", Ua = "segment-studio.playback-shortcuts.v1", Ka = "segment-studio.timing-clipboard.v1", za = "segment-studio.hide-derived-segments.v1", Ha = "segment-studio.merge-confirmation.v1", mt = ["unreviewed", "approved", "rejected"], Is = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], zo = "(min-width: 1024px) and (min-height: 640px)", Ho = "(min-width: 1024px) and (min-height: 900px)", _n = 1e-3, _o = 15, Cs = 30, _a = 12, ft = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, io = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, Bt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function qo(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function qa(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? gr(e, null, 1, !0) ?? r[0] ?? null;
}
function gr(e, t, r, o = !1) {
  var g;
  const i = e.findIndex((u) => u.markers.some((f) => f.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((f) => f.markers.map((m) => m.segment)).filter((f) => f.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((g = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((f) => f.segment.reviewState === "unreviewed")) == null ? void 0 : g.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((f) => f.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function $s(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + Cs : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + _o + _n && p >= i - _o - _n;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ts(e, t, r) {
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
function pr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function iu(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function As(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function su(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Rs(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Ms(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Es(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Ds(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Wr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Ps(e, t, r = 10) {
  const o = Wr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function Wo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function Os(e, t = _a) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Wa(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : ft.timelineRatio;
}
function Vr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Zt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? ft.detailWidth : Math.min(Vr(t, 0), Math.max(240, e));
}
function ur(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? ft.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Ls(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function so(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: ft.timelineRatio, maximum: ft.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function lo(e, t) {
  const r = Wa(e);
  if (!(t > 0)) return r;
  const o = so(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Fs(e) {
  if (!e) return { ...ft };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Wa(r) : ft.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Zt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Zt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: ur(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...ft };
  }
}
function js(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : ft.timelineRatio;
}
function lu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Bs(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= _n ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Qt(e, t, r, o) {
  return e === t && r === o;
}
const fr = "__segment-studio-cleared-selection__";
function Gs(e) {
  return e === "true";
}
function Us(e) {
  return e !== "false";
}
function Va() {
  try {
    return Us(window.localStorage.getItem(Ha));
  } catch {
    return !0;
  }
}
function Ja(e) {
  try {
    window.localStorage.setItem(Ha, String(!!e));
  } catch {
  }
}
function Ks(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function xt(e = {}) {
  const t = mt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
    const f = Number(g);
    return Number.isFinite(f) ? Math.min(1, Math.max(0, f)) : u;
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
function Br(e, t, r, o = !1, i = []) {
  var c, g;
  const a = xt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return Ks(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Ya(e, t, r, o = !1, i = []) {
  var l;
  const a = xt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = xt({
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
    filters: xt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function zs(e, t = !1) {
  const r = xt(e);
  return +(r.reviewStates.length !== mt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Hs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function _s(e, t, r, o) {
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
function qs(e, t, r = null) {
  return t === fr ? null : qa(
    e,
    t ?? r
  );
}
function Qa(e, t, r, o = !1) {
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
function Ws(e, t, r) {
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
function Vs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Qa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Js(e, t, r = null, o = !1) {
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
    const u = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Vs(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Qa(i, a, t, o);
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
function Ys(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Qs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Vo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Jo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Vo(t, o) - Vo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Zs(e, t, r) {
  var c, g;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: m }) => !i.has(m.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = Jo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (g = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : g.lane;
  return Jo(d == null ? void 0 : d.markers, s, i);
}
function Xs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function el(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Yo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function tl() {
  try {
    return Gs(window.localStorage.getItem(za));
  } catch {
    return !1;
  }
}
function nl(e) {
  try {
    window.localStorage.setItem(za, String(!!e));
  } catch {
  }
}
function Cn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function Za(e, t) {
  return (e || []).some((r) => (t || []).some((o) => Cn(r, o)));
}
function co(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function rl(e, t) {
  return (e || []).find((r) => Cn(t, r)) || null;
}
function Jr(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Qo(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function du(e) {
  return e.running != null || e.queued.length > 0;
}
const Zo = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function Gr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive
  });
}
function ol({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
  let r = 1, o = null, i = [], a = null, s = !1, l = Zo;
  const d = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Set();
  let g = [];
  function u() {
    l = o == null && i.length === 0 && a == null ? Zo : Object.freeze({
      running: o ? Gr(o) : null,
      queued: Object.freeze(i.map(Gr)),
      lastFailure: a
    });
    for (const E of [...c]) E();
    if (o == null && i.length === 0) {
      const E = g;
      g = [];
      for (const $ of E) $();
    }
  }
  function f(E, $) {
    d.set(E.id, $.status), E.resolve($);
  }
  function m(E) {
    if (E.dependsOn == null) return "met";
    const $ = d.get(E.dependsOn);
    return $ === "fulfilled" ? "met" : $ != null ? "failed" : "pending";
  }
  function p(E) {
    o = E;
    const $ = { ...e(), taskId: E.id };
    $.resolveTargets = () => E.targets.map((S) => rl($.segments, S)).filter(Boolean), u();
    let B;
    try {
      B = E.run($);
    } catch (S) {
      B = Promise.reject(S);
    }
    Promise.resolve(B).then(
      (S) => h(E, { status: "fulfilled", value: S }),
      (S) => h(E, { status: "rejected", error: S })
    );
  }
  function h(E, $) {
    f(E, $), !s && (o = null, $.status === "rejected" && (a = Object.freeze({ id: E.id, kind: E.kind, error: $.error })), u(), t && y());
  }
  function y() {
    if (s || o != null) return;
    let E = !1;
    for (let $ = 0; $ < i.length; $ += 1) {
      const B = i[$], S = m(B);
      if (S === "failed") {
        i = i.filter((C) => C !== B), f(B, { status: "dropped", reason: "dependency-failed" }), E = !0, $ -= 1;
        continue;
      }
      if (S !== "pending" && !(B.exclusive && $ > 0) && !i.slice(0, $).some((C) => Za(C.targets, B.targets)) && !(B.ready && !B.ready(e()))) {
        i = i.filter((C) => C !== B), p(B);
        return;
      }
    }
    E && u();
  }
  function w(E) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((A) => A.exclusive) || o != null && E.whenBusy !== "enqueue") return null;
    let B;
    const S = new Promise((A) => {
      B = A;
    }), C = {
      id: r++,
      kind: E.kind,
      // Every running task holds the editor; -1 stands for "not tied to one segment".
      lockId: E.lockId ?? -1,
      targets: Object.freeze([...E.targets || []]),
      exclusive: E.exclusive === !0,
      dependsOn: E.dependsOn ?? null,
      ready: E.ready || null,
      run: E.run,
      resolve: B
    };
    return i = [...i, C], u(), y(), { id: C.id, done: S };
  }
  function k(E = {}) {
    let $ = null;
    const B = w({
      ...E,
      whenBusy: "reject",
      run: () => new Promise((C) => {
        $ = C;
      })
    });
    if (!B) return null;
    if ($ == null)
      return F((C) => C.id === B.id), null;
    let S = !1;
    return () => {
      S || (S = !0, $());
    };
  }
  function F(E) {
    const $ = i.filter((B) => E(Gr(B)));
    if ($.length === 0) return 0;
    i = i.filter((B) => !$.includes(B));
    for (const B of $) f(B, { status: "cancelled" });
    return u(), y(), $.length;
  }
  return {
    enqueue: w,
    acquire: k,
    cancel: F,
    poke: y,
    subscribe(E) {
      return c.add(E), () => c.delete(E);
    },
    getSnapshot: () => l,
    whenIdle() {
      return o == null && i.length === 0 ? Promise.resolve() : new Promise((E) => g.push(E));
    },
    dispose() {
      if (s) return;
      const E = i;
      i = [], s = !0;
      for (const B of E) f(B, { status: "cancelled" });
      c.clear();
      const $ = g;
      g = [];
      for (const B of $) B();
    }
  };
}
let al = 1;
function uo() {
  return `pending-${al++}`;
}
function il(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function Ur(e, t) {
  return (t || []).some((r) => Cn(r, e));
}
function Xa(e, t) {
  return [...e || [], {
    id: t.id ?? uo(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    settled: !1
  }];
}
function ei(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function sl(e, t) {
  const r = (e || []).filter((o) => !ei(o, t));
  return r.length === (e || []).length ? e : r;
}
function ll(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !ei(i, t) ? i : (r = !0, { ...i, settled: !0, settledDetail: null }));
  return r ? o : e;
}
function dl(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function ti(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => Cn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => Ur(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !Ur(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !Ur(s, a)).map((s) => Cn(i, s) ? { ...s, ...o.values } : s);
    }
  return il(r);
}
function ni(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((a) => a.op === "insert" && !a.settled).map((a) => a.segment)
  ];
  let o = !1;
  const i = [];
  for (const a of e) {
    if (a.op !== "insert" && !a.targets.some((s) => r.some((l) => Cn(s, l)))) {
      o = !0;
      continue;
    }
    if (a.settled) {
      a.settledDetail == null ? (i.push({ ...a, settledDetail: t }), o = !0) : a.settledDetail !== t ? o = !0 : i.push(a);
      continue;
    }
    i.push(a);
  }
  return o ? i : e;
}
function cl(e, t) {
  switch (t.type) {
    case "add":
      return Xa(e, t.entry);
    case "discard":
      return sl(e, t.key);
    case "settle":
      return ll(e, t.key);
    case "retarget":
      return dl(e, t.temporaryId, t.identity);
    case "prune":
      return ni(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
const Vn = [
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
], ul = /* @__PURE__ */ new Set([
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
function ml(e) {
  return ul.has(e);
}
function ri(e) {
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
function gl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Vn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ri).filter(Boolean)]));
  } catch {
    return {};
  }
}
function pl(e = {}) {
  const t = gl(e);
  return Vn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Xo(e, t = 2) {
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
function cu(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ri({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function uu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Yr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function ea(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function mu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = ea(e.code, t.key), a = ea(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const g of [!1, !0])
        for (const u of [!1, !0]) {
          const f = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: g,
            shiftKey: u
          };
          if (Yr(f, e) && Yr(f, t)) return !0;
        }
  return !1;
}
function $n(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function gu(e, t) {
  return [!1, !0].some((r) => $n(e, r) && $n(t, r));
}
function fl(e, t = !1, r = {}) {
  return pl(r).find((o) => $n(o, t) && o.bindings.some((i) => Yr(e, i))) || null;
}
function oi(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function yl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(oi).join(" / ") : "Unassigned";
}
function pu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, yl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function fu(e) {
  return e === "review" ? "review" : "editor";
}
function Qe(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function bl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function hl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function vl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Qe(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Qe(t, e.activeIdentity) || r[0]
  };
}
function xl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function yu(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => xl(o, i))));
}
function ta(e, t) {
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
function Sl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function kl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function wl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function Nl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function Il(e, t) {
  return t ? ti(e, Xa([], {
    op: "patch",
    targets: [{ id: t.segmentId }],
    values: { tagId: t.tagId, tagName: t.tagName || "Tag segment", tagSortName: null }
  })) : e;
}
function Cl(e, { segments: t, savingSegmentId: r, reviewSaving: o, tagEditing: i, selectedSegmentIds: a, activeSegmentId: s }) {
  if (!e) return "none";
  if (r != null || o) return "wait";
  const l = (t || []).find((c) => c.id === e.segmentId);
  return !l || l.tagId === e.tagId ? "drop" : i && s === e.segmentId && (a == null ? void 0 : a.length) === 1 && a[0] === e.segmentId ? "wait" : "apply";
}
function Qr(e, t) {
  return e === t;
}
function $l(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Tl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - _n).at(-1) || null : o.find((i) => i.startSec > t + _n) || null;
}
function Kn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function na(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: mt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function bu(e, t = null, r = !1) {
  const o = na(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function Nn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function ai(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: Nn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: Nn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: Nn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(Nn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(Nn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(Nn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...io };
  }
}
function Al(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ii() {
  try {
    return ai(window.localStorage.getItem(Ua));
  } catch {
    return { ...io };
  }
}
function ra(e) {
  const t = ai(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ua, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Gt = Object.freeze({
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
function Zr(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function si(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? Zr(e.requestedMode) : "basic",
    effectiveMode: i ? Zr(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function Tn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Rl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ml(e) {
  const t = [];
  return Tn(e, Gt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), Tn(e, Gt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function El(e) {
  return [
    ["general", "General", Gt.settingsGeneral],
    ["shortcuts", "Shortcuts", Gt.settingsShortcuts],
    ["performer-slots", "Performer slots", Gt.settingsPerformerSlots],
    ["derivation", "Derivation", Gt.settingsDerivation]
  ].filter(([, , r]) => Tn(e, r)).map(([r, o]) => [r, o]);
}
function Dl(e, t) {
  return e === "segments" && !Tn(
    t,
    Gt.navigationSegmentInventory
  ) || e === "bin" && !Tn(
    t,
    Gt.recyclingBinView
  ) ? "videos" : e;
}
function Pl(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Ol(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Kr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, oa = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: mt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ll(e) {
  const t = String(e || "").split(",").filter((r) => mt.includes(r));
  return t.length === 0 ? [...mt] : [...new Set(t)];
}
function In(e) {
  return li(e).values;
}
function li(e) {
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
function zr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function aa(e, t) {
  var l;
  const r = ia(t.activitiesCriterion, t.activityId), o = ia(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = li(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: Fl(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function ia(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Fl(e, t) {
  return mt.includes(e == null ? void 0 : e.value) ? [e.value] : Ll(t);
}
function di(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function jl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Bl(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function sa(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Gl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function rt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function mo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Hr(e, t) {
  const r = new Set(mo(t).map((o) => String(rt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function zt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function la(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(zt).sort().join(",")}`;
}
function ci(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((h, y) => String(h.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), p = [...t].sort((h, y) => String(h.name).localeCompare(String(y.name)) || Number(rt(h)) - Number(rt(y)));
    return [{
      assignments: Object.fromEntries(m.map((h, y) => [String(h.slotDefinitionId), String(rt(p[y]))])),
      description: p.map((h) => h.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, h) => ({ performer: p, index: h })).filter(({ performer: p }) => {
    var h;
    return !((h = m.genderHints) != null && h.length) || m.genderHints.some((y) => zt(y) === zt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : da(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(rt(m)), p]));
  function f(m, p, h) {
    if (s.length >= a) return;
    const y = c.slice(m), w = i ? y.filter(($) => $.length > 0).length : da(y.map(($) => $.filter((B) => !p.has(String(rt(t[B]))))), t.length);
    if (h + w < g) return;
    if (m === e.length) {
      if (h !== g) return;
      const $ = Object.fromEntries(d.map(({ slot: S, performer: C }) => [String(S.slotDefinitionId), C ? String(rt(C)) : ""])), B = o.length === 0 ? Object.values($).sort().join(",") : [...new Set(e.map((S) => String(S.label || "")))].map((S) => `${S}:${d.filter(({ slot: C }) => String(C.label || "") === S).map(({ performer: C }) => C ? String(rt(C)) : "").sort().join(",")}`).join("|");
      !l.has(B) && s.length < a && (l.add(B), s.push({
        assignments: $,
        description: d.map(({ slot: S, performer: C }) => o.length ? `${S.label}: ${(C == null ? void 0 : C.name) || "Unassigned"}` : (C == null ? void 0 : C.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const k = e[m], F = [...d].reverse().find(({ slot: $ }) => la($) === la(k)), E = F ? u.get(String(rt(F.performer))) : -1;
    for (const $ of c[m]) {
      const B = t[$], S = rt(B);
      if (!($ < E) && !(S == null || !i && p.has(String(S))) && (d.push({ slot: k, performer: B }), i || p.add(String(S)), f(m + 1, p, h + 1), i || p.delete(String(S)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: k, performer: null }), f(m + 1, p, h), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function da(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Ul(e, t) {
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
      const u = [...new Set(e.map((f) => f.label || ""))].map((f) => `${f}:${a.filter((m) => (m.slot.label || "") === f).map((m) => m.performer.performerId).sort((m, p) => m - p).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((f) => zt(f) === zt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Kl(e) {
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
function zl(e, t, r = 20) {
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
function Hl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function _l(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ui(e, t, r) {
  const o = rt, i = new Set((t || []).map(o)), a = new Set((r || []).map(zt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = zt(l.gender || l.genderIdentity), f = zt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: mi, useLayoutEffect: ql, useMemo: qe, useReducer: Wl, useRef: pe, useState: j, useSyncExternalStore: Vl } = oo, n = oo.createElement, gi = "/api/plugins/segment-studio";
function je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(en) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = Xr();
    return t[e] = r, window.localStorage.setItem(en, JSON.stringify(t)), r;
  } catch {
    return Xr();
  }
}
function Ue(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(en) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(en, JSON.stringify(t));
  } catch {
  }
}
function go(e) {
  try {
    return JSON.parse(window.localStorage.getItem(en) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function po(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(en) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(en, JSON.stringify(t));
  } catch {
  }
}
function Jl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function Yl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function X(e, t, r = 0) {
  var d;
  const o = await Ea(`${gi}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Jl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Yl(250 * (r + 1), t == null ? void 0 : t.signal), X(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Ql(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${gi}${e}`, o = await Ea(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: Zl(
      o.headers.get("Content-Disposition")
    )
  };
}
function Zl(e, t = "segment-studio-ai-feedback.zip") {
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
function Xr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function pi(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Xl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function fi(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function ed(e, t) {
  const { sceneCount: r, segmentCount: o } = fi(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function yi(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = fi(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(ed(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await X("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: je(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Ue(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function ca({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const Ct = {
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
function hu(e, t) {
  return {
    ...(Ct[e] || Ct.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function bi(e) {
  return { ...(Ct[e] || Ct.unreviewed).badge };
}
function hi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const vi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function td(e, t, r = "not-applicable", o = !1) {
  const i = Ct[e] || Ct.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function nd(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function rd(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function od(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function ad(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function hr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function id(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function tn({ state: e, includeLabel: t = !0 }) {
  const r = Ct[e] || Ct.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: bi(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function sd(e, t = null) {
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
function vu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function ld(e, t = document) {
  return !(e.defaultPrevented || sd(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function xu(e, t = document, r = !1, o = {}) {
  return ld(e, t) ? fl(e, r, o) != null : !1;
}
function yt(e, { onCancel: t, onConfirm: r } = {}) {
  var s, l;
  if (e.key === "Enter" && (e.isComposing || (s = e.nativeEvent) != null && s.isComposing || e.keyCode === 229)) return !1;
  const o = typeof ((l = e.target) == null ? void 0 : l.closest) == "function" ? e.target.closest("button, a, select, option, textarea") : e.target, i = String((o == null ? void 0 : o.tagName) || "").toLowerCase();
  if (i === "select" || i === "option") return !1;
  if (e.key === "Enter" && e.repeat && (i === "button" || i === "a"))
    return e.preventDefault(), !1;
  if (e.key === "Enter" && (e.repeat || ["button", "a", "textarea"].includes(i))) return !1;
  const a = e.key === "Escape" ? t : e.key === "Enter" ? r : null;
  return a ? (e.preventDefault(), e.stopPropagation(), a(), !0) : !1;
}
function dd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function cd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function fo({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  ye(() => {
    const o = requestAnimationFrame(() => cd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Dt(e) {
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
function ud(e, t) {
  const r = Number(e == null ? void 0 : e.cursorSequence) || 0, o = Number(t) || 0, i = [...(e == null ? void 0 : e.actions) || []];
  return o < r ? i.filter((a) => a.sequence > o && a.sequence <= r).sort((a, s) => s.sequence - a.sequence).map((a) => ({ action: a, direction: "backward", state: a.beforeState })) : i.filter((a) => a.sequence > r && a.sequence <= o).sort((a, s) => a.sequence - s.sequence).map((a) => ({ action: a, direction: "forward", state: a.afterState }));
}
function yo(e, t = !0) {
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
function sr(e, t = !0) {
  return {
    type: "segment",
    identity: yo(e, t),
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
function vt(e, t = !0) {
  return {
    type: "segments",
    segments: (e || []).map((r) => ({
      identity: yo(r, t),
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
function lr(e, t) {
  return {
    type: "incorrectExamples",
    collected: t,
    entries: (e || []).map(({ segment: r, result: o, example: i }) => ({
      exampleId: (o == null ? void 0 : o.exampleId) ?? (i == null ? void 0 : i.id) ?? null,
      originalIdentity: yo(r),
      collectedIdentity: {
        itemId: (o == null ? void 0 : o.itemId) ?? (i == null ? void 0 : i.itemId) ?? null,
        nativeSegmentId: (o == null ? void 0 : o.nativeSegmentId) ?? null,
        published: (o == null ? void 0 : o.nativeSegmentId) != null,
        revision: (o == null ? void 0 : o.revision) ?? null
      }
    }))
  };
}
function yr(e) {
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
function xi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function Si(e) {
  const t = /* @__PURE__ */ new Map();
  for (const r of e || []) {
    const o = t.get(r.segmentId);
    o ? o.push(r) : t.set(r.segmentId, [r]);
  }
  for (const r of t.values())
    r.sort((o, i) => o.sortOrder - i.sortOrder || String(o.slotDefinitionId).localeCompare(String(i.slotDefinitionId)));
  return t;
}
function bo(e) {
  if (!(e != null && e.length)) return "not-applicable";
  const t = e.filter((r) => Number(r.performerId) > 0).length;
  return t === 0 ? "empty" : t === e.length ? "complete" : "partial";
}
function md(e, t) {
  const r = (t || []).map((i) => xi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: gt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function gd(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : md(e, t);
}
function pd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function Su(e, t) {
  return bo(xi(e, t));
}
function gt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function fd(e, t) {
  const r = (d) => gt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const g of d || []) {
      const u = r(g);
      c.has(u) || c.set(u, []), c.get(u).push(g);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const g = s.get(d);
    if (!g || c.length !== g.length)
      continue;
    const u = [...c].sort(o), f = [...g].sort(o);
    u.forEach((m, p) => l.push({
      sourceSlotDefinitionId: m.id,
      derivedSlotDefinitionId: f[p].id
    }));
  }
  return l;
}
function yd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = fd(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function bd(e) {
  const t = gt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(vr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function vr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function br(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ua(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((g) => g.end <= s && g.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: br(o),
    trackCount: Math.max(1, t.length)
  };
}
function hd(e) {
  const t = e.map(gt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function vd(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], g = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: g };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [ua({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = hd(l.slots), g = l.slots.filter((h) => !a.has(String(h.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((h) => `${c.get(String(h.slotDefinitionId))} · ${h.performerName || `Performer ${h.performerId}`}`).join(" · "), m = [...new Map(u.map((h) => [
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
          performerLabel: f,
          performers: m,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ua);
}
function Xt(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => vd(s, a));
}
function ho(e) {
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
    for (const s of mt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const xd = {
  group: 38,
  lane: 33,
  segment: 41
};
function Sd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = xd[s.kind];
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
function ki(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function kd(e, t = [], r = !0) {
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
function wd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: br(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return ho(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: br(a)
    };
  });
}
function wi(e, { nativeOnly: t = !1 } = {}) {
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
function ma(e, t) {
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
function _t(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function qn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Nd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function Wn({ performer: e, compact: t = !1, tooltip: r = null }) {
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
    }, o ? Nd(e.name) : "—"),
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
function Ni({ assignments: e, className: t = "" }) {
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
      n(Wn, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function xr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = pe(null), i = `performer-slots-${mi()}`, [a, s] = j(null);
  function l() {
    var m;
    const c = (m = o.current) == null ? void 0 : m.getBoundingClientRect();
    if (!c) return;
    const g = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), f = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - g - 8, c.right - g)),
      top: f >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
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
    ...e.slice(0, 3).map((c) => n(Wn, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? vs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Ni, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(Wn, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Id(e, t) {
  const r = new Set(_t(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function Ii(e, t) {
  return t ? _t(e).filter((r) => r !== t) : _t(e);
}
function Cd(e, t) {
  const r = _t(t), o = new Set(_t(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function It(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ga(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function eo(e, t, r, o = null) {
  var g, u, f, m, p, h;
  const i = e.findIndex((y) => y.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const y = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && y.sort((w, k) => ga(w, k, o)), ((u = y[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((y) => y.segment.id === t);
  if (r === "left" || r === "right") {
    const y = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + y));
    return ((f = a.markers[w]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((h = [...e[l].markers].sort(c ? (y, w) => ga(y, w, Number(o)) : (y, w) => Math.abs(y.segment.startSec - d) - Math.abs(w.segment.startSec - d) || y.segment.startSec - w.segment.startSec || y.segment.id - w.segment.id)[0]) == null ? void 0 : h.segment) ?? null;
}
function $d(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = eo([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Td(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function Ad(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function Rd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [ya(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => ya(Math.min(s, r + l))))];
}
function Md(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Ed(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function mr(e, t) {
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
    const u = Number(c);
    r.has(u) && !o.has(u) || (d[o.get(u) ?? c] = g);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function pa(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Dd(e) {
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
async function Pd(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await fa(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], g = Rd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of g.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await fa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await Od(o), p = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: p, timestampSec: f }), s.push({
          fieldName: p,
          file: new File(
            [m],
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
function fa(e, t) {
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
function Od(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function ya(e) {
  return Math.round(e * 1e3) / 1e3;
}
function ba(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ld(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function to(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function no(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ci(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function _r(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Fd(e, t) {
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
function ha(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function jd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, currentTime: i, detail: a, editorFilters: s, endInput: l, hideDerivedSegments: d, historyRef: c, mediaDuration: g, onConflict: u, onDetailChange: f, onReload: m, optimisticSegmentIdRef: p, pendingDuplicateRef: h, pendingFirstSegmentStartSecRef: y, pendingTagEditSegmentIdRef: w, heldCreatedSegmentTag: k, setHeldCreatedSegmentTag: F, replaceSegmentSelection: E, savingSegmentId: $, segments: B, selectedSegment: S, selectedSegmentIdRef: C, selectedSegments: A, selectionAnchorIdRef: D, selectionRangeBaseIdsRef: z, setCreatingSegmentId: ie, setEditorFilters: _, setFirstSegmentTagOpen: T, setHideDerivedSegments: P, setHistory: H, setHistoryOpen: re, setPublishApprovedError: oe, setSaveMessage: J, setSelectedSegmentGroupKey: te, setSelectedSegmentId: G, setSelectedSegmentIds: ne, setTagEditing: ce, startInput: xe, tagEditingRef: ke, timelineDuration: Se, video: Q } = e;
  function fe(N) {
    c.current = N || Bt, H(c.current);
  }
  async function ee(N, M, Y, U, ue = null) {
    var R;
    try {
      const W = await X(`/videos/${Q.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: c.current.revision,
          kind: N,
          label: M,
          beforeState: Y,
          afterState: U,
          receiptId: ue
        })
      });
      return fe(W), !0;
    } catch (W) {
      return W.status === 409 && ((R = W.payload) != null && R.current) && fe(W.payload.current), J("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function Z(N, M, Y = !0, U = null, ue = !1, R = M, W = !0) {
    var Ze;
    if (!N || $ != null) return null;
    const q = A.map((De) => De.id), ge = C.current, Ie = Y && !r ? crypto.randomUUID() : null, Ce = t("segment", N.id);
    if (!Ce) return null;
    J(Y ? "Saving directly to Cove…" : "Restoring history…");
    const he = ue ? uo() : null;
    he && o({
      type: "add",
      entry: { id: he, op: "patch", targets: [co(N)], values: R }
    });
    const at = () => {
      he && o({ type: "settle", key: he });
    };
    try {
      if (r && N.nativeSegmentId == null && N.itemId != null) {
        const Ve = `draft-update:${Q.id}:${N.itemId}:${N.revision}:${M.tagId}:${M.startSec}:${M.endSec ?? "open"}:${M.reviewState ?? N.reviewState}`, He = await X(`/videos/${Q.id}/drafts/${N.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Ve),
            expectedRevision: N.revision,
            startSec: M.startSec,
            endSec: M.endSec,
            tagId: M.tagId,
            reviewState: M.reviewState
          })
        });
        Ue(Ve);
        const V = {
          ...N,
          ...He.draft,
          id: N.id,
          itemId: N.itemId
        };
        return Y && await ee(
          "segment.update",
          U || "Changed segment",
          sr(N, r),
          sr(
            V,
            r
          )
        ), ha(N, M, r) ? await m() : f((de) => ({
          ...de,
          approvedSetVersion: He.approvedSetVersion || de.approvedSetVersion,
          segments: (de.segments || []).map((Me) => Me.id === N.id ? V : Me).sort((Me, Be) => Me.startSec - Be.startSec || Me.id - Be.id)
        }), Q.id), at(), J(((Ze = He.draft) == null ? void 0 : Ze.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), V;
      }
      const De = await X(`/videos/${Q.id}/segments/${N.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...M,
          expectedUpdatedAt: N.updatedAt,
          historyReceiptId: Ie
        })
      }), Ke = {
        ...N,
        ...De,
        reviewState: M.reviewState ?? N.reviewState
      };
      return ha(N, M, r) ? await m() : f((Ve) => ({
        ...Ve,
        segments: (Ve.segments || []).map((He) => He.id === N.id ? Ke : He).sort((He, V) => He.startSec - V.startSec || He.id - V.id)
      }), Q.id), at(), Y && await ee(
        "segment.update",
        U || "Changed segment",
        sr(N, r),
        sr(
          Ke,
          r
        ),
        Ie
      ), J(Y ? "Saved to Cove" : "History restored"), Ke;
    } catch (De) {
      return he && o({ type: "discard", key: he }), ue && W && (ne(q), G(ge), D.current = ge, z.current = []), De.status === 409 ? (J("Conflict — loading the latest segment…"), await u()) : J(De.message || "Unable to save the segment."), null;
    } finally {
      Ce();
    }
  }
  async function se() {
    if (!r) return !1;
    const N = B.filter((U) => !U.published && U.reviewState === "approved").length;
    if (N === 0 || $ != null) return !1;
    const M = `complete-review:${Q.id}:${a.approvedSetVersion}`, Y = t("publish", -1);
    if (!Y) return !1;
    oe(""), J(`Publishing ${N} Approved draft${N === 1 ? "" : "s"}…`);
    try {
      const U = await X(`/videos/${Q.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(M),
          expectedApprovedSetVersion: a.approvedSetVersion
        })
      });
      Ue(M), fe(Bt), re(!1);
      const ue = await m(), R = $l(
        B,
        C.current,
        U.published
      ), W = R ? Qe(ue == null ? void 0 : ue.segments, R) : null;
      return W && G(W.id), J(`${U.published.length} Approved draft${U.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (U) {
      const ue = U.status === 409 ? "The approved drafts changed. Review the updated list and try again." : U.message || "Unable to publish the approved drafts.";
      return U.status === 409 && await u(), oe(ue), J(ue), !1;
    } finally {
      Y();
    }
  }
  async function K(N = null, M = null) {
    var De;
    if ($ != null || ae()) return;
    const Y = N != null ? y.current : null, U = Number.isFinite(Y) ? Y : i, ue = Math.min(Se, U + 20);
    if (ue <= U) {
      J("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const R = kl(B, S, N);
    if (R.kind === "choose-tag") {
      y.current = U, J(""), T(!0);
      return;
    }
    if (R.kind === "invalid-selection") {
      J("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: W } = R, q = `create-draft:${Q.id}:${W}:${U}`, ge = r ? null : crypto.randomUUID(), Ie = C.current, Ce = {
      ...S || {},
      id: p.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: W,
      tagName: M || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: W === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: U,
      endSec: ue,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, he = Ld(a, Ce), at = It(
      Xt(he.segments, he.segmentGroups || [], he.performerSlots || []),
      Ce.id
    ), Ze = t("create", -1);
    if (Ze) {
      T(!1), f(he, Q.id), R.openTagEditor && (ie(Ce.id), w.current = Ce.id, ce(!0)), E(Ce.id), te(at);
      try {
        let Ke;
        if (r) {
          const V = await X(`/videos/${Q.id}/drafts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ operationId: je(q), tagId: W, startSec: U, endSec: ue })
          });
          Ue(q), Ke = { itemId: (De = V.draft) == null ? void 0 : De.itemId };
        } else
          Ke = { nativeSegmentId: (await X(`/videos/${Q.id}/segments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              tagId: W,
              startSec: U,
              endSec: ue,
              historyReceiptId: ge
            })
          })).id };
        y.current = null, T(!1);
        const Ve = await m();
        if (!Ve) {
          f((V) => to(
            V,
            [Ce.id]
          ), Q.id), E(Ie), J(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${R.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
          return;
        }
        const He = Qe(Ve == null ? void 0 : Ve.segments, Ke);
        He ? (R.openTagEditor && (ke.current && (w.current = He.id), F((V) => (V == null ? void 0 : V.segmentId) === Ce.id ? { ...V, segmentId: He.id } : V), ie(He.id)), E(He.id), te(It(
          Xt(Ve.segments || [], Ve.segmentGroups || [], Ve.performerSlots || []),
          He.id
        )), r || await ee(
          "segment.create",
          "Created segment",
          vt([], !1),
          vt([He], !1),
          ge
        )) : (ce(!1), J(`Segment created, but it could not be selected${R.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
      } catch (Ke) {
        f((Ve) => to(
          Ve,
          [Ce.id]
        ), Q.id), E(Ie), N != null && T(!0), J(Ke.message || "Unable to create the draft.");
      } finally {
        F((Ke) => (Ke == null ? void 0 : Ke.segmentId) === Ce.id ? null : Ke), ie(null), Ze();
      }
    }
  }
  function ae() {
    return k == null || k.segmentId !== (S == null ? void 0 : S.id) ? !1 : (J("Close the tag field to save the new segment's tag first."), !0);
  }
  async function I() {
    if (A.length !== 1 || !S || $ != null || ae()) return;
    const N = i;
    if (N <= S.startSec || S.endSec != null && N >= S.endSec) {
      J("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const M = `split-draft:${S.itemId}:${S.revision}:${N}`, Y = r ? null : vt([S], !1), U = r ? null : crypto.randomUUID(), ue = t("split", S.id);
    if (ue)
      try {
        let R = null;
        r && S.nativeSegmentId == null ? (await X(`/videos/${Q.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(M),
            expectedRevision: S.revision,
            splitSec: N
          })
        }), Ue(M)) : R = { nativeSegmentId: (await X(`/videos/${Q.id}/segments/${S.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: S.updatedAt,
            splitSec: N,
            historyReceiptId: U
          })
        })).id };
        const W = await m();
        if (!r) {
          const q = [
            Qe(W == null ? void 0 : W.segments, {
              nativeSegmentId: S.nativeSegmentId ?? S.id
            }),
            Qe(
              W == null ? void 0 : W.segments,
              R
            )
          ].filter(Boolean);
          await ee(
            "segment.split",
            "Split segment",
            Y,
            vt(q, !1),
            U
          );
        }
        J(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (R) {
        R.status === 409 ? await u() : J(R.message || "Unable to split the draft.");
      } finally {
        ue();
      }
  }
  async function b(N = !1) {
    var R, W;
    if (A.length !== 1 || !S || $ != null || ae()) return;
    const M = N ? i : S.startSec, Y = Sl(Q.id, S, N, M), U = r ? null : crypto.randomUUID(), ue = t("duplicate", S.id);
    if (ue)
      try {
        const q = ((R = h.current) == null ? void 0 : R.operationKey) === Y ? h.current : null;
        let ge = (q == null ? void 0 : q.duplicateIdentity) ?? null;
        if (ge == null && r && S.nativeSegmentId == null) {
          const he = await X(`/videos/${Q.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Y),
              expectedRevision: S.revision,
              startSec: N ? M : null
            })
          });
          ge = ta(!1, he), h.current = { operationKey: Y, duplicateIdentity: ge };
        } else if (ge == null) {
          const he = await X(`/videos/${Q.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: N ? M : null,
              historyReceiptId: U
            })
          });
          ge = ta(!0, he), h.current = { operationKey: Y, duplicateIdentity: ge };
        }
        const Ie = await m(), Ce = Qe(Ie == null ? void 0 : Ie.segments, ge);
        if (Ce) {
          r || await ee(
            "segment.duplicate",
            "Duplicated segment",
            vt([], !1),
            vt([Ce], !1),
            U
          );
          const he = Ya(
            Ce,
            Ie.performerSlots || [],
            s,
            d,
            Ie.segmentGroups || []
          );
          _(he.filters), P(he.hideDerivedSegments), ne([Ce.id]), G(Ce.id), D.current = Ce.id, z.current = [], te(It(
            Xt(Ie.segments || [], Ie.segmentGroups || [], Ie.performerSlots || []),
            Ce.id
          )), r && S.nativeSegmentId == null && Ue(Y), h.current = null, J(N ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          J("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (q) {
        ((W = h.current) == null ? void 0 : W.operationKey) === Y ? J("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : q.status === 409 ? await u() : J(q.message || "Unable to duplicate the draft.");
      } finally {
        ue();
      }
  }
  async function v() {
    if (A.length !== 1 || !S) return;
    const N = Number(xe), M = l.trim() === "" ? null : Number(l), Y = qo(N, M, g);
    if (Y.error) {
      J(Y.error);
      return;
    }
    if (N === S.startSec && M === S.endSec) {
      J("Timing is unchanged.");
      return;
    }
    await Z(S, { startSec: N, endSec: M, tagId: S.tagId }, !0, null, !0);
  }
  async function x(N, M) {
    if (A.length !== 1 || !S) return;
    const Y = qo(N, M, g);
    if (Y.error) {
      J(Y.error);
      return;
    }
    if (N === S.startSec && M === S.endSec) {
      J("Timing is unchanged.");
      return;
    }
    await Z(S, { startSec: N, endSec: M, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: fe, recordHistoryAction: ee, mutateSegment: Z, completeReview: se, createSegment: K, splitSegment: I, duplicateSegment: b, saveTiming: v, applyShortcutTiming: x };
}
function Bd() {
  const [e, t] = j(() => typeof window < "u" && window.matchMedia(zo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Gd() {
  const [e, t] = j(() => typeof window < "u" && window.matchMedia(Ho).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ho), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ud() {
  try {
    return Fs(window.localStorage.getItem(Ba));
  } catch {
    return { ...ft };
  }
}
function Kd() {
  try {
    return _t(JSON.parse(window.localStorage.getItem(Ga) || "[]"));
  } catch {
    return [];
  }
}
function zd(e) {
  try {
    window.localStorage.setItem(Ga, JSON.stringify(_t(e)));
  } catch {
  }
}
function Hd(e) {
  try {
    window.localStorage.setItem(Ba, JSON.stringify(e));
  } catch {
  }
}
function _d() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ka) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function qd(e) {
  try {
    return window.localStorage.setItem(Ka, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Wd({ status: e }) {
  const t = vi[e];
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
function Ht({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, mt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...bi(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Ct[t].symbol}${e[t]}`)));
}
function Vd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = mo(a), [m, p] = j(() => Hr(o, f)), [h, y] = j(!1), [w, k] = j(""), F = pe(!1), E = o.map((D) => `${D.slotDefinitionId}:${D.performerId || ""}`).join("|"), $ = f.map((D) => rt(D)).join("|"), B = ci(
    o,
    f
  );
  ye(() => {
    p(Hr(o, f)), k("");
  }, [t, r, E, $]);
  async function S(D = m) {
    if (!F.current) {
      F.current = !0, y(!0), k("Saving performer slots…");
      try {
        const z = Hr(o.map((T) => ({
          ...T,
          performerId: D[T.slotDefinitionId] || null
        })), f), ie = o.map((T) => {
          const P = z[T.slotDefinitionId] ? Number(z[T.slotDefinitionId]) : null, H = f.find((re) => String(rt(re)) === String(P));
          return {
            ...T,
            performerId: P,
            performerName: (H == null ? void 0 : H.name) || null
          };
        });
        if (s(ie) === !1) {
          k("");
          return;
        }
        const _ = await X(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: z[T.slotDefinitionId] ? Number(z[T.slotDefinitionId]) : null }))
          })
        });
        k("Performer slots saved."), await l(_, {
          beforeState: yr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: yr([{
            segmentId: t,
            itemId: r,
            revision: _.revision,
            slots: _.slots || []
          }])
        });
      } catch (z) {
        d && await d(o, z), z.status === 409 ? (k("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : k(z.message || "Unable to save performer slots.");
      } finally {
        F.current = !1, y(!1);
      }
    }
  }
  function C(D, z) {
    k(`Option ${z + 1} applied; save to confirm.`), p({ ...m, ...D.assignments });
  }
  async function A(D) {
    const z = { ...m, ...D.assignments };
    p(z), await S(z);
  }
  return ye(() => {
    if (u)
      return u.current = (D) => F.current || !B[D] ? !1 : (A(B[D]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    B.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, B.map((D, z) => n("button", {
        key: z,
        type: "button",
        disabled: h,
        onClick: () => C(D, z),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${z + 1}: ${D.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, z + 1),
        n("span", { key: "description" }, D.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${B.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((D) => n("label", { key: D.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, gt(D)),
      (D.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(D.genderHints || []).map(vr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[D.slotDefinitionId] || "", disabled: h, onChange: (z) => p({ ...m, [D.slotDefinitionId]: z.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ui(f, f, D.genderHints).map((z) => n("option", { key: rt(z), value: rt(z) }, z.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: h, onClick: () => S(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function Jd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var B;
  const s = ((B = t[0]) == null ? void 0 : B.slots) || [], l = mo(r), d = ci(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((S, C) => {
    const A = t.map((D) => {
      var z;
      return String(((z = D.slots[C]) == null ? void 0 : z.performerId) || "");
    });
    return [S.slotDefinitionId, A.every((D) => D === A[0]) ? A[0] : c];
  })), [u, f] = j(g), [m, p] = j(!1), [h, y] = j(""), w = pe(!1), k = t.map((S) => `${S.itemId ?? `native:${S.segmentId}`}:${S.revision}:${S.slots.map((C) => `${C.slotDefinitionId}:${C.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    f(g());
  }, [k]);
  async function F(S = u) {
    if (w.current) return;
    w.current = !0, p(!0), y(`Saving performer slots for ${t.length} segments…`);
    const C = [];
    try {
      for (const A of t) {
        const D = A.slots.map((ie, _) => {
          const T = S[s[_].slotDefinitionId];
          return {
            slotDefinitionId: ie.slotDefinitionId,
            performerId: T === c ? ie.performerId || null : T ? Number(T) : null
          };
        }), z = await X(A.itemId != null ? `/videos/${e}/drafts/${A.itemId}/slots` : `/videos/${e}/segments/${A.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: A.revision, assignments: D })
        });
        C.push({
          segmentId: A.segmentId,
          itemId: A.itemId,
          revision: z.revision,
          slots: z.slots || []
        });
      }
      y("Performer slots saved."), o({
        beforeState: yr(t),
        afterState: yr(C)
      });
    } catch (A) {
      const D = await i();
      A.status === 409 ? y(D ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : y(A.message || (D ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function E(S, C) {
    y(`Option ${C + 1} applied; save to confirm.`), f({ ...u, ...S.assignments });
  }
  async function $(S) {
    const C = { ...u, ...S.assignments };
    f(C), await F(C);
  }
  return ye(() => {
    if (a)
      return a.current = (S) => w.current || !d[S] ? !1 : ($(d[S]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((S, C) => n("button", {
        key: C,
        type: "button",
        disabled: m,
        onClick: () => E(S, C),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${C + 1} to all selected segments: ${S.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, C + 1),
        n("span", { key: "description" }, S.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((S) => n("label", {
      key: S.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, gt(S)),
      n("select", {
        key: "select",
        value: u[S.slotDefinitionId] || "",
        disabled: m,
        onChange: (C) => f({ ...u, [S.slotDefinitionId]: C.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[S.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ui(l, l, S.genderHints).map((C) => n("option", {
          key: rt(C),
          value: rt(C)
        }, C.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: m,
        onClick: () => F(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function $t(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Yd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return $t(t);
  const o = [...new Set(r.map((i) => $t(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function Sr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function dr({ name: e }) {
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
function Qd({ hidden: e }) {
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
    n(Sr, { key: "derived" })
  ]);
}
function Zd({ segment: e, provenance: t }) {
  var g;
  const [r, o] = j(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Yd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
  return n("section", { "aria-label": "Segment provenance", className: "rounded-md border border-border bg-surface" }, [
    n("button", {
      key: "toggle",
      type: "button",
      onClick: () => o((u) => !u),
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
      ) : s.map((u) => {
        const f = u.modelIdentifier || u.modelKey, m = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            $t(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${m == null ? "" : ` · ${m}`}`
          ) : null,
          u.relation === "inherited" ? n("div", { key: "relation", className: "text-secondary" }, "Inherited origin") : null,
          f ? n(
            "div",
            { key: "model", className: "text-secondary" },
            `Model ${f}${u.modelVersion ? ` · ${u.modelVersion}` : ""}`
          ) : null,
          u.activityExternalRunId || u.sourceRunId ? n("div", { key: "run", className: "break-all text-secondary" }, `Run ${u.activityExternalRunId || u.sourceRunId}`) : null,
          u.confidence != null ? n(
            "div",
            { key: "confidence", className: "text-secondary" },
            `Confidence ${Math.round(u.confidence * 100)}%`
          ) : null,
          u.recordedAt || u.createdAt ? n("div", { key: "recorded", className: "text-secondary" }, `Recorded ${u.recordedAt || u.createdAt}`) : null
        ]);
      })
    ) : null
  ]);
}
function Xd({
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
  const [u, f] = j([]), m = e.flatMap((w) => w.lanes.map((k) => k.key)), p = m.join("|");
  ye(() => {
    const w = new Set(m);
    f((k) => k.filter((F) => w.has(F)));
  }, [p]);
  const h = br(t), y = !!wi(
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
        `${m.length} swimlane${m.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(Ht, { key: "counts", counts: h }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      pd({ mergeable: y, reviewable: a, tagEditable: s, slotsEditable: l })
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
      ...w.lanes.map((k) => {
        const F = u.includes(k.key), E = k.markers.some(({ segment: B }) => B.id === r), $ = `selected-segment-lane-${k.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: k.key,
          "data-selected-segment-lane": k.key,
          className: `rounded-md border ${E ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": F,
            "aria-controls": $,
            "aria-current": E ? "true" : void 0,
            onClick: () => f((B) => F ? B.filter((S) => S !== k.key) : [...B, k.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, F ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, qn(k)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(k.selectedCount)),
            a ? n(Ht, { key: "states", counts: k.counts }) : null
          ]),
          F ? n("div", {
            key: "segments",
            id: $,
            className: "space-y-1 border-t border-border p-1.5"
          }, k.markers.map(({ segment: B }) => {
            const S = B.endSec == null ? Re(B.startSec) : `${Re(B.startSec)} – ${Re(B.endSec)}`;
            return n("button", {
              key: B.id,
              type: "button",
              onClick: () => i(B),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${B.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${B.tagName || "Segment"}, ${B.reviewState}, ${S}` : `${B.tagName || "Segment"}, ${S}`,
              "aria-current": B.id === r ? "true" : void 0
            }, [
              a ? n(tn, {
                key: "state",
                state: B.reviewState,
                includeLabel: !1
              }) : null,
              B.isDerived ? n(Sr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, S),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                $t(B.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const Gn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, va = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], xa = [
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
function Jn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function $i(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function Sa(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function cr(e, t, r, o = null) {
  const i = Sa(t), a = Sa(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function ec(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), cr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), cr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), cr(o, t.performersCriterion, "performer"), cr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = ka(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = ka(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function ka(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function tc(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((g) => a.add(g));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function Ti({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(ca, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, mt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = Ct[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(ca, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ai({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function nc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Jn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ai, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, xs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ti, { item: e, showReviewStates: r }))
    ])
  ]);
}
function rc({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(Ai, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Jn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Ti, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function vo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Ml(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Jn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && Tn(
        o,
        Gt.recyclingBinView
      ) ? n(Ri, { key: "bin", onNavigate: t }) : null,
      n(Mi, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ro = "segment-studio:recycling-bin-changed";
function oc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function zn() {
  window.dispatchEvent(new CustomEvent(ro));
}
function Ri({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = j(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await X("/bin"), u = Number(g == null ? void 0 : g.totalCount);
        !a && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(ro, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(ro, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = oc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Jn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Mi({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Jn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function ac({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = Zr(i.target.value);
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
function ic({ minimum: e, maximum: t, onChange: r }) {
  const o = pe(null), [i, a] = j("maximum"), s = (f, m) => {
    const p = _s(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var h;
    const p = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    p && s(f, Hs(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, h;
    m.preventDefault(), (h = (p = m.currentTarget).setPointerCapture) == null || h.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, h;
    (h = (p = m.currentTarget).hasPointerCapture) != null && h.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, h = f === "minimum" ? 0 : e, y = f === "minimum" ? t : 1, w = m.shiftKey ? 0.1 : 0.01;
    let k = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (k = p - w), ["ArrowRight", "ArrowUp"].includes(m.key) && (k = p + w), m.key === "PageDown" && (k = p - 0.1), m.key === "PageUp" && (k = p + 0.1), m.key === "Home" && (k = h), m.key === "End" && (k = y), k != null && (m.preventDefault(), s(f, Math.min(y, Math.max(h, k))));
  }, u = (f, m) => n("span", {
    key: f,
    role: "slider",
    tabIndex: 0,
    "aria-label": f === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((f === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((f === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(m * 100),
    "aria-valuetext": `${Math.round(m * 100)} percent`,
    onPointerDown: (p) => d(f, p),
    onPointerMove: (p) => c(f, p),
    onKeyDown: (p) => g(f, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${m * 100}%`,
      touchAction: "none",
      zIndex: e === t && i === f ? 2 : 1
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
        u("minimum", e),
        u("maximum", t)
      ])
    )
  ]);
}
function sc({ saving: e, error: t, onSelect: r, onClose: o }) {
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
    onKeyDownCapture: (s) => yt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
    n(Hn, {
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
function lc({
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
  const u = xt(e), f = [...new Map((a || []).map((y) => [
    Number(y.tagId),
    y.tagName || `Tag ${y.tagId}`
  ])).entries()].sort((y, w) => y[1].localeCompare(w[1]) || y[0] - w[0]), m = (y) => d(xt({ ...u, ...y })), p = (y) => m({
    reviewStates: u.reviewStates.includes(y) ? u.reviewStates.filter((w) => w !== y) : [...u.reviewStates, y]
  }), h = (y) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${y ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && g();
    },
    onKeyDownCapture: (y) => yt(y, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
        n("div", { className: "flex flex-wrap gap-2" }, mt.map((y) => {
          const w = u.reviewStates.includes(y), k = Ct[y];
          return n("button", {
            key: y,
            type: "button",
            onClick: () => p(y),
            "aria-pressed": w,
            className: h(w)
          }, `${k.symbol} ${y} (${i[y] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => m({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: h(u.performerId == null)
          }, "All performers"),
          ...r.map((y) => {
            const w = Number(rt(y));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => m({ performerId: w }),
              "aria-pressed": u.performerId === w,
              className: h(u.performerId === w)
            }, y.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (y) => m({
              tagId: y.target.value === "" ? null : Number(y.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([y, w]) => n("option", { key: y, value: y }, w))
          ])
        ]),
        n("label", {
          key: "segment-group",
          className: "space-y-1 text-xs text-secondary"
        }, [
          n("span", { key: "label" }, "Segment group"),
          n("select", {
            key: "select",
            value: u.segmentGroupId ?? "",
            onChange: (y) => m({
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
            onClick: () => m({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: h(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((y) => n("button", {
            key: y,
            type: "button",
            onClick: () => m({ sourceKey: y }),
            "aria-pressed": u.sourceKey === y,
            title: y,
            className: h(u.sourceKey === y)
          }, $t(y)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(ic, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: y, maximum: w }) => m({
            confidenceMin: y,
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
            checked: u.includeUnscored,
            onChange: (y) => m({
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
        n(Qd, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(xt({})), l && c(!1);
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
function dc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Vn.filter((l) => $n(l, e)), i = Xo(o, 1)[0], a = Xo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(oi)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => yt(l, { onCancel: r })
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
function cc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Dd(e), [l, d] = j([]), c = s.map((g) => g.tagName).join("|");
  return ye(() => {
    const g = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => g.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (g) => yt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((g, u) => {
        const f = l.includes(g.tagName), m = `incorrect-example-tag-${u}`;
        return n("section", {
          key: g.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": f,
            "aria-controls": m,
            onClick: () => d((p) => f ? p.filter((h) => h !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: hr(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              f ? "▾" : "▸"
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
          f ? n("div", {
            key: "examples",
            id: m,
            className: "divide-y divide-border border-t border-border"
          }, g.examples.map((p) => {
            const h = `${Re(p.startSec)}${p.endSec == null ? "" : ` – ${Re(p.endSec)}`}`, y = r === p.id;
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
                "aria-label": `${y ? "Restoring" : "Restore to review"} ${g.tagName} example at ${h}`,
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
function uc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = j(""), [a, s] = j(0), l = pe(null), d = qe(() => zl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = _l(d);
  ye(() => {
    var f;
    (f = l.current) == null || f.scrollIntoView({ block: "nearest" });
  }, [c, o]);
  const u = () => {
    const f = d[c];
    f && t(f.segment || f);
  };
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-start justify-center bg-black/70 p-4 pt-[10vh]",
    onMouseDown: (f) => {
      f.target === f.currentTarget && r();
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-quick-search-title",
    tabIndex: -1,
    className: "flex max-h-[75vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    onKeyDownCapture: (f) => {
      var m;
      if (f.key === "Tab")
        Dt(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), r();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const p = f.key === "ArrowDown" ? 1 : -1;
        s((h) => d.length ? (h + p + d.length) % d.length : 0);
      } else f.key === "Enter" && !((m = f.nativeEvent) != null && m.isComposing) && (f.preventDefault(), f.stopPropagation(), u());
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
        onChange: (f) => {
          i(f.target.value), s(0);
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
    }, d.length ? d.flatMap((f, m) => {
      var $;
      const p = f.segment || f, h = p.endSec == null ? Re(p.startSec) : `${Re(p.startSec)} – ${Re(p.endSec)}`, y = `${$t(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = m === c, k = m > 0 ? d[m - 1].groupKey : null, F = g && f.groupKey !== k ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, E = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: w ? l : null,
        type: "button",
        role: "option",
        "aria-selected": w,
        onMouseEnter: () => s(m),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${w ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        g ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(tn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        ($ = f.performers) != null && $.length ? n(xr, {
          key: "performers",
          performers: f.performers,
          performerAssignments: f.performerAssignments
        }) : null,
        n(
          "span",
          { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
          h
        ),
        n("span", {
          key: "provenance",
          className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
          title: y
        }, y)
      ]);
      return F ? [F, E] : [E];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function mc(e) {
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
function gc({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = qe(() => mc(e), [e]), [l, d] = j([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = pe(null);
  fo({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((h) => h !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => yt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
      ].flatMap(([m, p]) => [
        n("dt", { key: `${m}:label`, className: "text-secondary" }, m),
        n("dd", { key: `${m}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((m) => {
        const p = l.includes(m.key);
        return n("section", { key: m.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": f(m),
            onClick: () => u(m.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: hr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, m.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${m.drafts.length} draft${m.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: f(m),
            className: "divide-y divide-border border-t border-border"
          }, m.drafts.map((h) => {
            const y = h.endSec == null ? Re(h.startSec) : `${Re(h.startSec)} – ${Re(h.endSec)}`, w = `${$t(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", { key: h.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(tn, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, y),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: w
              }, w)
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
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: g,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function pc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Kl(e), [s, l] = j(() => /* @__PURE__ */ new Set()), [d, c] = j(() => new Set(a.map((h) => h.key))), g = a.flatMap((h) => d.has(h.key) ? h.candidates : []), u = (h) => l((y) => {
    const w = new Set(y);
    return w.has(h) ? w.delete(h) : w.add(h), w;
  }), f = (h) => c((y) => {
    const w = new Set(y);
    return w.has(h) ? w.delete(h) : w.add(h), w;
  }), m = (h) => h.assignment.map(({ slot: y, performer: w }) => `${y.label || `Slot ${y.sortOrder + 1}`}: ${w.name}`).join(", "), p = (h) => `segment-studio-auto-assign-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && i();
    },
    onKeyDownCapture: (h) => {
      h.key === "Enter" && h.target instanceof HTMLInputElement || yt(h, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
          style: { background: hr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(h.key),
            disabled: t,
            onChange: () => f(h.key),
            "aria-label": `Include ${h.tagName} assignment: ${m(h)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(h.key),
            "aria-controls": p(h),
            "aria-label": `${s.has(h.key) ? "Collapse" : "Expand"} ${h.tagName} assignment: ${m(h)}`,
            onClick: () => u(h.key),
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
            h.assignment.map(({ slot: y, performer: w }) => {
              const k = y.label || `Slot ${y.sortOrder + 1}`;
              return n("span", {
                key: y.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${k}: ${w.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${k}: ${w.name}`
                }, `${k}: ${w.name}`),
                n(Wn, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Ht, { key: "states", counts: h.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(h.candidates),
            "aria-label": `Auto-Assign ${h.tagName}: ${m(h)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${h.candidates.length})`)
        ]),
        s.has(h.key) ? n(
          "div",
          { key: "segments", id: p(h), className: "divide-y divide-border/70" },
          h.candidates.map((y) => {
            const w = y.endSec == null ? Re(y.startSec) : `${Re(y.startSec)} – ${Re(y.endSec)}`, k = `${$t(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", {
              key: y.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(tn, { key: "review", state: y.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                y.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                w
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: k
              }, k)
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
function fc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => yt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
      n("button", { key: "cancel", type: "button", onClick: r, className: "rounded-md border border-border px-3 py-1.5 text-sm" }, "Cancel"),
      n("button", { key: "confirm", type: "button", autoFocus: !0, onClick: t, className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25" }, "Delete permanently")
    ])
  ]));
}
function yc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = j(!1), d = pe(null);
  if (fo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Re(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => yt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
        `${Re(e.startSec)} – ${c}`
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
          onChange: (g) => l(g.target.checked),
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
        disabled: t,
        onClick: a,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t,
        onClick: () => i(s),
        className: "rounded-md border border-destructive/60 bg-destructive/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-destructive/25 disabled:opacity-50"
      }, t ? "Merging…" : "Merge segments")
    ])
  ]));
}
function bc(e) {
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
function hc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = pe(null);
  fo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = bc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => yt(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
        ].flatMap(([m, p]) => [
          n("dt", { key: `${m}:label`, className: "text-secondary" }, m),
          n("dd", { key: `${m}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        g.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...g.map((m) => n("article", {
            key: m.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${m.rootTagName} @ ${Re(m.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${m.outputs.length} ${m.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              m.outputs.map((p, h) => n("div", {
                key: `${p.ruleId}:${p.depth}:${h}`,
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
          (((f = e.outputs) == null ? void 0 : f.length) || 0) > c.length ? n(
            "p",
            { key: "more", className: "text-xs text-secondary" },
            `${e.outputs.length - c.length} additional output${e.outputs.length - c.length === 1 ? "" : "s"} omitted from this preview list.`
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
      n("button", { key: "cancel", ref: i, type: "button", disabled: r, onClick: s, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Cancel"),
      n("button", {
        key: "confirm",
        ref: d,
        type: "button",
        disabled: t || r || l === 0,
        onClick: a,
        className: "rounded-md border border-indigo-400/60 bg-indigo-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-indigo-500/30 disabled:opacity-50"
      }, r ? "Materializing…" : `Materialize ${l} change${l === 1 ? "" : "s"}`)
    ])
  ]));
}
function vc({
  compatibilityMode: e,
  selectedSegment: t,
  selectedSegments: r = [],
  selectedGroups: o = [],
  saveMessage: i,
  savingSegmentId: a,
  creatingSegmentId: s = null,
  saveTag: l,
  saveTiming: d,
  slotStatus: c,
  performerSlotsAvailable: g,
  selectedPerformerSlots: u,
  performerSlots: f,
  detail: m,
  video: p,
  slotButtonRef: h,
  tagSearchRef: y,
  onDetailChange: w,
  setSaveMessage: k,
  acquireSaveLock: F,
  onSlotsChanged: E,
  onRecordHistory: $,
  onCancelQueuedReview: B,
  splitSegment: S,
  duplicateSegment: C,
  provenance: A,
  lineage: D,
  onNavigateLineageItem: z,
  tagEditing: ie,
  onCancelTagEditing: _,
  detailPanelRef: T,
  onReduceSelection: P
}) {
  var Se, Q, fe, ee;
  const H = pe(null), re = pe(null), oe = () => {
    var Z;
    (Z = re.current) == null || Z.call(re), re.current = null;
  }, J = pe(null), te = pe(null), G = pe(null), ne = pe(null), [ce, xe] = j(!1);
  ye(() => {
    H.current && (H.current.scrollTop = 0), xe(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var Z, se;
    ce && ((se = (Z = J.current) == null ? void 0 : Z.querySelector("input, select, button")) == null || se.focus({ preventScroll: !0 }));
  }, [ce]);
  function ke() {
    xe(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = h.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Z = !r.some((ae) => ae.isDerived), se = e && g ? gd(f, r) : null, K = (se == null ? void 0 : se.map((ae, I) => {
      var v;
      const b = r[I];
      return {
        segmentId: b.nativeSegmentId,
        itemId: b.published ? null : b.itemId,
        revision: (v = m.performerSlotRevisions) == null ? void 0 : v[b.id],
        slots: ae
      };
    })) || [];
    return n(oo.Fragment, null, [
      n(Xd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: T,
        onReduceSelection: P,
        reviewable: e,
        tagEditable: Z,
        slotsEditable: K.length > 0 && a == null,
        onEditSlots: () => xe(!0),
        slotButtonRef: h,
        saveMessage: i
      }),
      ie && Z ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ae) => {
          ae.target === ae.currentTarget && _();
        },
        onKeyDownCapture: (ae) => yt(ae, { onCancel: _ })
      }, n("section", {
        ref: y,
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
        n(Hn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ae, I) => ae == null ? _() : l(ae, I == null ? void 0 : I.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: _,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ce && K.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ae) => {
          ae.target === ae.currentTarget && ke();
        },
        onKeyDownCapture: (ae) => {
          var b, v;
          if (!(typeof ((b = ae.target) == null ? void 0 : b.closest) == "function" ? ae.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ae.repeat && !ae.ctrlKey && !ae.altKey && !ae.metaKey && !ae.shiftKey && /^[1-9]$/.test(ae.key) && ((v = ne.current) != null && v.call(ne, Number(ae.key) - 1))) {
            ae.preventDefault(), ae.stopPropagation();
            return;
          }
          yt(ae, { onCancel: ke });
        }
      }, n("section", {
        ref: J,
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
          n("button", { key: "close", type: "button", onClick: ke, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jd, {
          videoId: p.id,
          targets: K,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: ne,
          onSaved: async ({ beforeState: ae, afterState: I }) => {
            await $(
              "performer-slots.assign",
              `Assigned performers to ${K.length} segments`,
              ae,
              I
            ), ke(), E();
          },
          onConflict: E
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Z) => {
      H.current = Z, T && (T.current = Z);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(tn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(Sr, { key: "derived" }) : null,
        t && ie ? n("div", {
          key: "tag-editor",
          ref: y,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Z) => {
            Z.key === "Escape" && (Z.preventDefault(), Z.stopPropagation(), _());
          },
          onKeyDown: (Z) => {
            dd(Z, t.tagName) && (Z.preventDefault(), Z.stopPropagation(), l(t.tagId));
          }
        }, n(Hn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Z, se) => Z == null ? _() : l(Z, se == null ? void 0 : se.label),
          disabled: wl(a, t.id, s) || ((Se = D.data) == null ? void 0 : Se.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Wd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Ni, {
        assignments: u.map((Z) => {
          const se = bd(Z);
          return {
            key: String(Z.slotDefinitionId),
            label: se.label,
            performer: se.filled ? { id: Number(Z.performerId), name: se.performer } : null,
            title: se.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Zd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: A
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        D.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : D.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, D.error) : D.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${D.data.derived ? "Derived segment" : "Root segment"} · ${D.data.componentSize} segment${D.data.componentSize === 1 ? "" : "s"} · ${D.data.integrityState}`
          ),
          (Q = D.data.parents) != null && Q.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...D.data.parents.map((Z) => n("button", {
              key: Z.nodeId,
              type: "button",
              onClick: () => z(Z.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Z.ruleKey} ${Z.ruleVersion}`))
          ]) : null,
          (fe = D.data.children) != null && fe.length ? n("p", { key: "children" }, `Children: ${D.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: h,
          type: "button",
          disabled: a != null || !g || u.length === 0,
          onClick: () => xe(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: g ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: S,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => C(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => C(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    ce && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Z) => {
        Z.target === Z.currentTarget && ke();
      },
      onKeyDownCapture: (Z) => {
        var K, ae;
        if (!(typeof ((K = Z.target) == null ? void 0 : K.closest) == "function" ? Z.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Z.repeat && !Z.ctrlKey && !Z.altKey && !Z.metaKey && !Z.shiftKey && /^[1-9]$/.test(Z.key) && ((ae = G.current) != null && ae.call(G, Number(Z.key) - 1))) {
          Z.preventDefault(), Z.stopPropagation();
          return;
        }
        yt(Z, {
          onCancel: ke,
          onConfirm: () => {
            var I;
            return (I = te.current) == null ? void 0 : I.click();
          }
        });
      }
    }, n("section", {
      ref: J,
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
        n("button", { key: "close", type: "button", onClick: ke, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ee = m.performerSlotRevisions) == null ? void 0 : ee[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: te,
        shortcutRef: G,
        onOptimisticSave: (Z) => {
          w((K) => _r(
            K,
            t.id,
            Z
          ), p.id);
          const se = F("slots", t.id);
          if (!se)
            return k("Wait for the current save to finish before saving performer slots."), !1;
          re.current = se, k("Saving performer slots…"), ke();
        },
        onSaved: async (Z, { beforeState: se, afterState: K }) => {
          w((ae) => _r(
            ae,
            t.id,
            Z.slots || [],
            Z.revision
          ), p.id), k("Performer slots saved.");
          try {
            await $(
              "performer-slots.assign",
              "Assigned performers",
              se,
              K
            ), await E(Z) || B([t]);
          } finally {
            oe();
          }
        },
        onRollback: async (Z, se) => {
          B([t]), w((K) => {
            var ae;
            return _r(
              K,
              t.id,
              Z,
              (ae = m.performerSlotRevisions) == null ? void 0 : ae[t.id]
            );
          }, p.id), k(se.message || "Unable to save performer slots.");
          try {
            se.status === 409 && await E();
          } finally {
            oe();
          }
        },
        onConflict: E
      }))
    ])) : null
  ]);
}
function xc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: h, onSelectAll: y, onConfigureTag: w, onSeekTime: k, centerRef: F, showReviewState: E = !0, swimlaneTitleWidth: $, onSwimlaneTitleWidthChange: B }) {
  const S = pe(null), C = pe(null), [A, D] = j(0), [z, ie] = j({ scrollTop: 0, height: 320 }), [_, T] = j(null), P = qe(
    () => Xt(e, r, o),
    [e, r, o]
  ), H = qe(
    () => Si(o),
    [o]
  ), re = qe(() => ho(P), [P]), oe = qe(
    () => kd(re, i, r.length > 0),
    [re, i, r.length]
  ), J = qe(
    () => ki(oe.rows, Math.max(0, z.scrollTop - 24), z.height),
    [oe, z]
  ), te = Math.max(0, Number(d) || 0), G = Ls(A), ne = ur($, G), ce = ne / 16, xe = Ps(c, te, ce), ke = As(te), Se = Rs(te, Math.max(1, A - ce * 16), g), Q = ke.filter((v, x) => x === 0 || x % Se === 0), fe = qe(() => P.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: x, track: N }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${N}`).join(",")}`).join("|"), [P]);
  function ee() {
    const v = C.current;
    if (!v) return;
    const x = v.querySelector("[data-timeline-track]"), N = v.firstElementChild, M = x == null ? void 0 : x.getBoundingClientRect(), Y = N == null ? void 0 : N.getBoundingClientRect(), U = M && Y ? Math.max(0, M.left - Y.left) : ce * 16, ue = (Y == null ? void 0 : Y.width) ?? v.scrollWidth;
    v.scrollTo({
      left: Ds(c, te, ue, v.clientWidth, U, _a),
      behavior: "smooth"
    });
  }
  ye(() => (F.current = ee, () => {
    F.current === ee && (F.current = null);
  })), ye(() => {
    ee();
  }, [g]);
  function Z() {
    const v = C.current, x = oe.rows.find((ue) => ue.kind === "lane" && ue.lane.markers.some(({ segment: R }) => R.id === s));
    if (!v || !x) return;
    const N = 24, M = x.top + N, Y = M + x.height;
    let U = v.scrollTop;
    M < v.scrollTop + N ? U = Math.max(0, M - N) : Y > v.scrollTop + v.clientHeight && (U = Math.max(0, Y - v.clientHeight)), U !== v.scrollTop && (v.scrollTop = U), ie({ scrollTop: U, height: v.clientHeight });
  }
  ye(() => {
    Z();
  }, [s, fe, oe]), ye(() => {
    const v = C.current, x = oe.rows.find((ue) => ue.kind === "group" && ue.group.key === a);
    if (!v || !x) return;
    const N = 24, M = x.top + N, Y = M + x.height;
    let U = v.scrollTop;
    M < v.scrollTop + N ? U = Math.max(0, M - N) : Y > v.scrollTop + v.clientHeight && (U = Math.max(0, Y - v.clientHeight)), U !== v.scrollTop && (v.scrollTop = U), ie({ scrollTop: U, height: v.clientHeight });
  }, [a, oe]), ye(() => {
    const v = C.current;
    if (!v || typeof ResizeObserver > "u") return;
    const x = () => {
      D(v.clientWidth), ie({ scrollTop: v.scrollTop, height: v.clientHeight }), Z();
    }, N = new ResizeObserver(x);
    return N.observe(v), x(), () => N.disconnect();
  }, [s, fe, oe]);
  function se(v) {
    if (!(te > 0)) return;
    const x = v.currentTarget.getBoundingClientRect(), N = Math.min(1, Math.max(0, (v.clientX - x.left) / x.width));
    k(N * te);
  }
  function K(v) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let N = null;
    Object.hasOwn(x, v.key) && (N = c + x[v.key]), v.key === "Home" && (N = 0), v.key === "End" && (N = te), N != null && (v.preventDefault(), v.stopPropagation(), k(Math.min(te, Math.max(0, N))));
  }
  function ae(v) {
    var N;
    const x = (N = S.current) == null ? void 0 : N.getBoundingClientRect();
    x && B(ur(v.clientX - x.left, G));
  }
  function I(v) {
    const x = v.shiftKey ? 40 : 16;
    let N = null;
    v.key === "ArrowLeft" && (N = ne - x), v.key === "ArrowRight" && (N = ne + x), v.key === "Home" && (N = 160), v.key === "End" && (N = G), N != null && (v.preventDefault(), v.stopPropagation(), B(ur(N, G)));
  }
  const b = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: S,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (v) => {
          (v.metaKey || v.ctrlKey) && (v.preventDefault(), y == null || y());
        },
        onKeyDown: (v) => {
          v.key !== "Enter" && v.key !== " " || (v.preventDefault(), y == null || y());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: b, disabled: g <= 1, onClick: () => u(pr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: b, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: b, disabled: g >= 8, onClick: () => u(pr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: b, onClick: ee, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(G),
      "aria-valuenow": Math.round(ne),
      "aria-valuetext": `${Math.round(ne)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), ae(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && ae(v);
      },
      onKeyDown: I,
      onDoubleClick: () => B(ft.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ne - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: C,
      onScroll: (v) => ie({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Os(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${ce}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": te,
          "aria-valuenow": Math.min(te, Math.max(0, c)),
          "aria-valuetext": Re(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: se,
          onKeyDown: K
        }, Q.map((v, x) => n("span", {
          key: v,
          className: `absolute top-0 ${Ms(x, Q.length, te > 0 ? v / te * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Es(x, Q.length, te > 0 ? v / te * 100 : 0)
        }, Re(v))).concat(t.map((v) => {
          const x = te > 0 ? v.startSec / te * 100 : 0;
          return n("button", {
            key: `shot-boundary:${v.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Re(v.startSec)} – ${Re(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Re(v.startSec)} – ${Re(v.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${x}%`, width: "2px" },
            onClick: (N) => {
              N.stopPropagation(), k(v.startSec);
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
            ...Wo(xe),
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
        style: P.length > 0 ? { height: oe.height } : void 0
      }, [
        P.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Wo(xe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        P.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : J.map((v) => {
          var W;
          const x = v.group, N = i.includes(x.key), M = a === x.key, Y = hr(M);
          if (v.kind === "group") return n("div", {
            key: v.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": N ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              backgroundColor: Y,
              top: v.top,
              height: v.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (q) => {
                if (q.metaKey || q.ctrlKey) {
                  h(x.lanes.flatMap((ge) => ge.markers.map((Ie) => Ie.segment.id)));
                  return;
                }
                f(x.key), m(x.key);
              },
              "aria-expanded": !N,
              "aria-current": M ? "true" : void 0,
              "data-selected-timeline-group": M ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: x.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: Y
              },
              title: `${N ? "Expand" : "Collapse"} ${x.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, N ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, x.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              N ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${x.lanes.length} swimlane${x.lanes.length === 1 ? "" : "s"} hidden`
                ),
                E ? n(Ht, { key: "states", counts: x.counts }) : null
              ] : null
            )
          ]);
          const U = v.lane, ue = od(v.laneIndex), R = U.markers.some(({ segment: q }) => q.id === s);
          return n("div", {
            key: v.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ce}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: ue
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": R ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: ad(R, ue),
              title: `${qn(U)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": qn(U),
              onClick: (q) => {
                (q.metaKey || q.ctrlKey) && h(U.markers.map((ge) => ge.segment.id));
              },
              onMouseEnter: () => T(U.key),
              onMouseLeave: () => T((q) => q === U.key ? null : q)
            }, [
              U.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (q) => {
                  q.stopPropagation(), w({ tagId: U.tagId, tagName: U.label, trigger: q.currentTarget });
                },
                "aria-label": `Configure ${U.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: _ === U.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, U.label),
              (W = U.performers) != null && W.length ? n(xr, {
                key: "performers",
                performers: U.performers,
                performerAssignments: U.performerAssignments
              }) : null,
              E ? n(Ht, { key: "counts", counts: U.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, U.markers.map(({ segment: q, track: ge }) => {
              var He;
              const Ie = Wr(q.startSec, te), Ce = q.endSec == null ? q.startSec : Math.max(q.startSec, q.endSec), he = Math.max(0, Wr(Ce, te) - Ie), at = l.includes(q.id), Ze = q.id === s, De = bo(H.get(q.id)), Ke = q.endSec == null ? Re(q.startSec) : `${Re(q.startSec)} – ${Re(q.endSec)}`, Ve = (He = vi[De]) == null ? void 0 : He.label;
              return n("button", {
                key: q.id,
                type: "button",
                onClick: (V) => {
                  V.stopPropagation(), p(q, {
                    additive: V.metaKey || V.ctrlKey,
                    rangeSegmentIds: V.shiftKey ? U.markers.map((de) => de.segment.id) : null
                  });
                },
                "aria-pressed": at,
                "aria-current": Ze ? "true" : void 0,
                "data-selected-timeline-marker": Ze ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ze ? "true" : void 0,
                "aria-label": E ? `${q.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${q.reviewState}${Ve ? `, ${Ve}` : ""}, ${Ke}` : `${q.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${Ke}`,
                title: E ? `${q.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${q.reviewState}${Ve ? ` · ${Ve}` : ""} · ${Ke}` : `${q.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${Ke}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...E ? td(q.reviewState, at, De, Ze) : nd(at, Ze),
                  left: `${Ie}%`,
                  top: `${id(ge)}rem`,
                  width: rd(q.endSec, he),
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
function xo({
  tagId: e,
  tagName: t,
  performerSlotsEnabled: r = !1,
  onSaved: o,
  onClose: i
}) {
  const [a, s] = j(null), [l, d] = j([]), [c, g] = j(null), [u, f] = j(""), [m, p] = j(!0), [h, y] = j(null), [w, k] = j(""), [F, E] = j(!1), $ = pe(null), B = pe(0);
  ye(() => {
    const _ = requestAnimationFrame(() => {
      var T;
      return (T = $.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(_);
  }, [e]), ye(() => {
    const _ = new AbortController();
    return p(!0), k(""), Promise.all([
      r ? X(`/slot-definitions/${e}`, { signal: _.signal }) : Promise.resolve(null),
      X("/segment-groups", { signal: _.signal })
    ]).then(([T, P]) => {
      const H = P.find((re) => (re.tags || []).some((oe) => Number(oe.tagId) === Number(e)));
      s(T), d(P), g((H == null ? void 0 : H.id) ?? null), f(H == null ? "" : String(H.id)), E(!1);
    }).catch((T) => {
      T.name !== "AbortError" && k(T.message || "Unable to load tag configuration.");
    }).finally(() => {
      _.signal.aborted || p(!1);
    }), () => _.abort();
  }, [r, e]);
  function S(_, T) {
    s({
      ...a,
      definitions: a.definitions.map((P, H) => H === _ ? { ...P, ...T } : P)
    });
  }
  function C(_, T) {
    const P = _ + T;
    if (P < 0 || P >= a.definitions.length) return;
    const H = [...a.definitions];
    [H[_], H[P]] = [H[P], H[_]], s({
      ...a,
      definitions: H.map((re, oe) => ({ ...re, sortOrder: oe }))
    });
  }
  function A(_) {
    const T = a.definitions[_], P = Number(T.assignmentCount) || 0, H = P === 0 ? "" : ` and its ${P} assignment${P === 1 ? "" : "s"}`;
    window.confirm(`Delete “${gt(T)}”${H}?`) && (P > 0 && E(!0), s({
      ...a,
      definitions: a.definitions.filter((re, oe) => oe !== _).map((re, oe) => ({ ...re, sortOrder: oe }))
    }));
  }
  async function D() {
    var T;
    y("slots"), k("Saving performer slots…");
    let _;
    try {
      _ = await X(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: F,
          definitions: a.definitions.map((P, H) => {
            var re;
            return {
              id: P.id || void 0,
              label: ((re = P.label) == null ? void 0 : re.trim()) || null,
              sortOrder: H,
              genderHints: P.genderHints || []
            };
          })
        })
      }), s(_), E(!1);
    } catch (P) {
      P.status === 409 ? (k("Performer slots changed elsewhere; current values were reloaded."), (T = P.payload) != null && T.current && (s(P.payload.current), E(!1))) : k(P.message || "Unable to save performer slots."), y(null);
      return;
    }
    try {
      await o(), k("Performer slots saved.");
    } catch {
      k("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      y(null);
    }
  }
  async function z() {
    const _ = u === "" ? null : Number(u);
    if (_ !== c) {
      y("group"), k("Saving tag group…");
      try {
        await X(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: _ })
        });
      } catch (T) {
        k(T.message || "Unable to assign the tag group."), y(null);
        return;
      }
      try {
        const [T, P] = await Promise.allSettled([
          X("/segment-groups"),
          o()
        ]);
        if (T.status === "fulfilled") {
          d(T.value);
          const H = T.value.find((oe) => (oe.tags || []).some((J) => Number(J.tagId) === Number(e))), re = (H == null ? void 0 : H.id) ?? null;
          g(re), f(re == null ? "" : String(re));
        }
        k(
          T.status === "fulfilled" && P.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        y(null);
      }
    }
  }
  l.find((_) => Number(_.id) === Number(c));
  const ie = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (_) => {
      _.target === _.currentTarget && !h && i();
    },
    onKeyDownCapture: (_) => yt(_, {
      onCancel: h ? void 0 : i
    })
  }, n("section", {
    ref: $,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Dt,
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
        m ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: h != null,
            onChange: (_) => f(_.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((_) => n("option", { key: _.id, value: String(_.id) }, _.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: h != null || (u === "" ? null : Number(u)) === c,
          onClick: z,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, h === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        m ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: h != null,
              onChange: (_) => s({ ...a, allowSamePerformerInMultipleSlots: _.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((_, T) => n("article", {
            key: _.id || _._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: _.label || "",
                disabled: h != null,
                onChange: (P) => S(T, { label: P.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Is.map((P) => n("label", { key: P, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: h != null,
                  checked: (_.genderHints || []).includes(P),
                  onChange: (H) => S(T, {
                    genderHints: H.target.checked ? [.../* @__PURE__ */ new Set([..._.genderHints || [], P])] : (_.genderHints || []).filter((re) => re !== P)
                  })
                }),
                n("span", { key: "text" }, vr(P))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${_.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: h != null || T === 0, onClick: () => C(T, -1), className: ie, "aria-label": `Move ${gt(_)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: h != null || T === a.definitions.length - 1, onClick: () => C(T, 1), className: ie, "aria-label": `Move ${gt(_)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: h != null, onClick: () => A(T), className: `${ie} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++B.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: ie
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: h != null,
              onClick: D,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, h === "slots" ? "Saving…" : "Save performer slots")
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
        disabled: h != null,
        onClick: i,
        className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
      }, "Close")
    )
  ]));
}
function Sc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function kc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: h, centerTimelineRef: y, closeEditorFilters: w, closeFirstSegmentTagDialog: k, closeMaterializeDialog: F, closeMergeConfirmation: E, closePublishApprovedDialog: $, closeTagEditing: B, collapsedSegmentGroups: S, commonActionsRef: C, compatibilityMode: A, configuringTag: D, createSegment: z, creatingSegmentId: ie, currentTime: _, deleteRejectedSegments: T, detail: P, detailPanelRef: H, detailWidth: re, duplicateSegment: oe, editorFilters: J, editorLayout: te, editorRef: G, exportingExamples: ne, filtersButtonRef: ce, filtersOpen: xe, firstSegmentTagOpen: ke, focusRowRef: Se, handleSeparatorKeyDown: Q, handleSeparatorPointerDown: fe, handleSeparatorPointerMove: ee, hasNextUnreviewed: Z, hasPreviousUnreviewed: se, hideDerivedSegments: K, history: ae, historyOpen: I, historySaving: b, horizontalLayoutSize: v, importNativeSegments: x, incorrectExamples: N, incorrectExamplesOpen: M, lineage: Y, markerRailWidth: U, materializeButtonRef: ue, materializeCancelButtonRef: R, materializeDerivedSegments: W, materializeError: q, materializeLoading: ge, materializeOpen: Ie, materializePreview: Ce, materializing: he, mediaStackRef: at, mergeCancelButtonRef: Ze, mergeConfirmation: De, mergeSaving: Ke, mergeSelectedSwimlane: Ve, nativeImportState: He, onDetailChange: V, onNavigate: de, onReload: Me, onSlotsChanged: Be, openPublishApprovedDialog: we, panelSeparatorProps: _e, pendingInitialSeekRef: Ye, performerSlots: Ne, performerSlotsAvailable: be, playbackControlsRef: We, previewDerivedSegments: Pe, provenance: Ae, provenanceSources: Xe, publishApprovedCancelButtonRef: Ge, publishApprovedDrafts: Oe, publishApprovedError: Ee, publishApprovedOpen: ze, quickSearchOpen: Pt, railScrollRef: Le, railToggleRef: St, recordHistoryAction: An, rejectedDeletionPreview: dt, removeIncorrectExample: $e, removingExampleId: Te, restoreHistoryTarget: Je, runEditorAction: bt, saveMessage: st, saveTag: Ut, saveTiming: pt, savingSegmentId: ot, seekRef: Ot, segmentGroups: Rn, segmentRailLayout: nn, segments: Tt, selectAllVideoSegments: qt, selectSegment: rn, selectSegmentCollection: kr, selectedGroups: on, selectedPerformerSlots: wr, selectedSegment: kt, selectedSegmentGroupKey: Wt, selectedSegmentIds: Yn, selectedSegments: Vt, selectedSlotStatus: Mn, setAutoAssignError: Qn, setAutoAssignOpen: an, setConfiguringTag: Kt, setCurrentTime: sn, setEditorFilters: Zn, setEditorLayout: Nr, setFiltersOpen: Xn, setHideDerivedSegments: Ir, setHistoryOpen: ln, setIncorrectExamplesOpen: dn, setQuickSearchOpen: En, setRailViewport: cn, setRejectedDeletionPreview: Cr, setSaveMessage: er, setSelectedSegmentGroupKey: un, setSelectedSegmentId: Jt, setShortcutsOpen: mn, setTimelineZoom: Dn, shotBoundaries: ct, shortcutsOpen: tr, slotButtonRef: Pn, splitLayout: At, splitSegment: nr, startFullAnalysis: gn, stepVideoFrame: pn, tagEditing: $r, tagSearchRef: Tr, timelineDuration: Ar, timelineRatioBounds: fn, timelineZoom: On, toggleSegmentGroup: yn, toggleSegmentRail: et, updateTimelineRatio: lt, video: it, videoPerformers: rr, visibleCounts: wt, visibleSegmentRailRows: ht, visibleSegments: or, wideLayout: Lt, workspaceRef: Ln } = e, bn = qe(
    () => Tt.filter((O) => !O.published && O.reviewState === "approved"),
    [Tt]
  ), Fn = Ss(ao), jn = bn.length, hn = Ce ? Ce.createCount + Ce.linkCount : null, Rt = ot != null, Yt = Vt.length > 0, Mt = Vt.length === 1, Ft = Yt && Vt.every((O) => O.reviewState === "approved"), Rr = Yt && Vt.every((O) => O.reviewState === "rejected"), Mr = [
    { id: "marker.create", label: "New segment", disabled: Rt },
    { id: "marker.editTag", label: "Edit tag", disabled: Rt || !Yt },
    { id: "marker.setStart", label: "Set start", disabled: Rt || !Mt },
    { id: "marker.setEnd", label: "Set end", disabled: Rt || !Mt },
    { id: "marker.split", label: "Split", disabled: Rt || !Mt },
    ...A ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !se, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Ft ? "Unapprove" : "Approve", disabled: Rt || !Yt, tone: "approve" },
      { id: "marker.reject", label: Rr ? "Unreject" : "Reject", disabled: Rt || !Yt, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Z, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...A ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Rt || !p, tone: "reject" }
    ]
  ];
  function Er(O) {
    const ve = Yn.includes(O.id), me = O.id === (kt == null ? void 0 : kt.id), tt = O.endSec == null ? Re(O.startSec) : `${Re(O.startSec)} – ${Re(O.endSec)}`, jt = `${$t(O.sourceKey)}${O.confidence != null ? ` · ${Math.round(O.confidence * 100)}%` : ""}`;
    return n("button", {
      key: O.id,
      type: "button",
      onClick: (Et) => rn(O, { additive: Et.metaKey || Et.ctrlKey }),
      "aria-pressed": ve,
      "aria-current": me ? "true" : void 0,
      "data-selected-segment-shortcut-target": me ? "true" : void 0,
      "aria-label": A ? `${O.tagName || "Tag segment"}, ${O.reviewState}${O.isDerived ? ", derived segment" : ""}, ${tt}` : `${O.tagName || "Tag segment"}${O.isDerived ? ", derived segment" : ""}, ${tt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: hi(ve, me)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        A ? n(tn, { key: "review", state: O.reviewState, includeLabel: !1 }) : null,
        O.isDerived ? n(Sr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          O.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, tt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: jt
        }, jt)
      ])
    ]);
  }
  const vn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", xn = [...ae.actions || []].reverse().find((O) => O.sequence <= ae.cursorSequence);
  return n("section", {
    ref: G,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${At ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (O) => $i(O, de, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${it.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: it.title || `Video ${it.id}`
          }, it.title || `Video ${it.id}`)),
          ...rr.map((O) => n(Wn, {
            key: rt(O),
            performer: { id: rt(O), name: O.name },
            compact: !0,
            tooltip: O.name
          })),
          A ? n(Ht, { key: "review-counts", counts: wt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          A ? null : n(Ri, { key: "bin", onNavigate: de, compact: !0 }),
          n(Mi, { key: "settings", onNavigate: de, compact: !0 })
        ])
      ]),
      A && P.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${P.nativeImportCount} Cove segment${P.nativeImportCount === 1 ? "" : "s"} ${P.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        He.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, He.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => x("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => x("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        He.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, He.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          A ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => gn(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (O) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && O.preventDefault();
                },
                onKeyDown: (O) => {
                  (O.key === "Enter" || O.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && O.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(ja, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([O, ve]) => n("button", {
                key: O,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (me) => {
                  var tt;
                  (tt = me.currentTarget.closest("details")) == null || tt.removeAttribute("open"), gn(ve);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, O)))
            ])
          ]) : null,
          A ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ot != null || d.length === 0,
            onClick: () => {
              Qn(""), an(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          A ? n("button", {
            key: "materialize-derived",
            ref: ue,
            type: "button",
            disabled: ot != null || ge || he || hn === 0,
            onClick: Pe,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, ge ? "Analyzing…" : `Auto-Materialize${hn != null ? ` (${hn})` : ""}`) : null,
          A ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ot != null || jn === 0,
            onClick: (O) => we(O.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ze,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${jn ? ` (${jn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ne || Te != null || N.length === 0,
            onClick: () => dn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": M,
            "aria-label": `Open AI feedback collection, ${N.length} example${N.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${N.length ? ` (${N.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ce,
            type: "button",
            onClick: () => Xn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": xe,
            className: `${vn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(dr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => mn(!0),
            className: vn
          }, [n(dr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (A ? ae.actions.length === 0 : xn == null) || ot != null || b,
            onClick: A ? () => ln((O) => !O) : () => Je(
              xn.sequence - 1
            ),
            "aria-haspopup": A ? "dialog" : void 0,
            "aria-expanded": A ? I : void 0,
            className: vn
          }, [
            n(dr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, A ? `History${ae.actions.length ? ` (${ae.actions.length})` : ""}` : xn ? `Undo ${xn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: St,
            type: "button",
            onClick: et,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": te.markerRailOpen,
            className: vn
          }, [
            n(dr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, te.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    A && I ? n("section", {
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
        ...[...ae.actions].reverse().map((O) => n("button", {
          key: O.sequence,
          type: "button",
          disabled: b,
          onClick: () => Je(O.sequence),
          "aria-current": ae.cursorSequence === O.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${O.sequence > ae.cursorSequence ? "text-secondary" : "text-foreground"} ${ae.cursorSequence === O.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, O.label),
          n("time", {
            key: "time",
            dateTime: O.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(O.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: b,
          onClick: () => Je(ae.baselineSequence),
          "aria-current": ae.cursorSequence === ae.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${ae.cursorSequence === ae.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    xe ? n(lc, {
      key: "editor-filters",
      filters: J,
      hideDerivedSegments: K,
      performers: rr,
      provenanceSources: Xe,
      reviewCounts: l,
      segments: Tt,
      segmentGroups: Rn,
      reviewMode: A,
      onChange: Zn,
      onHideDerivedChange: Ir,
      onClose: w
    }) : null,
    ke ? n(sc, {
      key: "first-segment-tag-dialog",
      saving: ot != null,
      error: st,
      onSelect: (O, ve) => z(O, ve),
      onClose: k
    }) : null,
    Pt ? n(uc, {
      key: "quick-search-dialog",
      segments: Hl(o),
      onSelect: (O) => {
        En(!1), rn(O, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        En(!1), requestAnimationFrame(() => {
          var O;
          return (O = G.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(pc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => an(!1)
    }) : null,
    De ? n(yc, {
      key: "merge-selection-dialog",
      merge: De,
      processing: Ke,
      undoable: !A,
      cancelButtonRef: Ze,
      onConfirm: (O) => Ve(!0, O, De),
      onClose: E
    }) : null,
    Ie ? n(hc, {
      key: "materialize-derived-dialog",
      preview: Ce,
      loading: ge,
      processing: he,
      error: q,
      cancelButtonRef: R,
      onConfirm: W,
      onClose: () => {
        he || F();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Ln,
      className: `${At ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      te.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: Lt ? { position: "absolute", top: 0, right: 0, width: U, height: v.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Tt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : or.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Le,
          onScroll: (O) => cn({
            scrollTop: O.currentTarget.scrollTop,
            height: O.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: nn.height }
        }, ht.map((O) => {
          var me;
          let ve;
          if (O.kind === "group") {
            const tt = S.includes(O.group.key), jt = O.group.lanes.reduce((Et, Dr) => Et + Dr.markers.length, 0);
            ve = n("button", {
              type: "button",
              onClick: () => {
                un(O.group.key), yn(O.group.key);
              },
              "aria-expanded": !tt,
              "aria-current": Wt === O.group.key ? "true" : void 0,
              "data-segment-rail-group": O.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Wt === O.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, tt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: O.group.name }, O.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, jt),
              A && tt ? n(Ht, { key: "states", counts: O.group.counts }) : null
            ]);
          } else O.kind === "lane" ? ve = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: qn(O.lane),
            "aria-label": qn(O.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, O.lane.label),
            (me = O.lane.performers) != null && me.length ? n(xr, {
              key: "performers",
              performers: O.lane.performers,
              performerAssignments: O.lane.performerAssignments
            }) : null,
            A ? n(Ht, { key: "states", counts: O.lane.counts }) : null
          ]) : ve = Er(O.segment);
          return n("div", {
            key: O.key,
            className: "absolute left-0 right-0",
            style: { top: O.top, height: O.height }
          }, ve);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${At ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: at,
          className: `${At ? "min-h-0 flex-1" : ""} grid`,
          style: At ? {
            gridTemplateRows: `minmax(16rem, ${(1 - te.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${te.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: Se,
            className: "grid min-h-0 gap-2",
            style: Lt ? {
              gridTemplateColumns: te.markerRailOpen ? `${re}px 0.5rem minmax(0,1fr) 0.5rem ${U}px` : `${re}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(vc, {
              key: "tools",
              compatibilityMode: A,
              selectedSegment: kt,
              selectedSegments: Vt,
              selectedGroups: on,
              saveMessage: st,
              savingSegmentId: ot,
              creatingSegmentId: ie,
              acquireSaveLock: t,
              setSaveMessage: er,
              saveTag: Ut,
              slotStatus: Mn,
              performerSlotsAvailable: be,
              selectedPerformerSlots: wr,
              performerSlots: Ne,
              detail: P,
              onDetailChange: V,
              onCancelQueuedReview: m,
              video: it,
              slotButtonRef: Pn,
              tagSearchRef: Tr,
              tagEditing: $r,
              onCancelTagEditing: B,
              detailPanelRef: H,
              onReduceSelection: (O) => {
                rn(O), requestAnimationFrame(() => {
                  var ve;
                  return (ve = H.current) == null ? void 0 : ve.focus({ preventScroll: !0 });
                });
              },
              saveTiming: pt,
              onSlotsChanged: Be,
              onRecordHistory: An,
              splitSegment: nr,
              duplicateSegment: oe,
              provenance: Ae,
              lineage: Y,
              onNavigateLineageItem: (O) => {
                const ve = Tt.find((me) => me.itemId === O);
                ve && Jt(ve.id);
              }
            }),
            Lt ? n(
              "div",
              { key: "detail-separator", ..._e("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            it.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Da, {
                streamUrl: `/api/stream/video/${it.id}`,
                posterUrl: `/api/stream/video/${it.id}/screenshot?v=${encodeURIComponent(it.updatedAt || "")}`,
                format: it.videoFile.format,
                audioCodec: it.videoFile.audioCodec,
                duration: it.videoFile.duration,
                videoId: it.id,
                trackingEnabled: !1,
                onSeekRegister: (O) => {
                  Ot.current = O, Gl(Ye.current, Tt, O) && (Ye.current = null);
                },
                onPlaybackControlRegister: (O) => {
                  We.current = O;
                },
                onTimeUpdate: sn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            Lt && te.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ..._e("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Lt && te.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: C,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Mr.map((O) => {
              var tt;
              const ve = (tt = Fn[O.id]) == null ? void 0 : tt[0], me = O.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : O.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: O.id,
                type: "button",
                disabled: O.disabled,
                "data-action-id": O.id,
                onClick: (jt) => {
                  const Et = jt.currentTarget;
                  bt(O.id, { target: Et, preserveFocus: !0 }), O.focusWhenDisabled && requestAnimationFrame(() => {
                    Sc(Et, C.current, O.focusWhenDisabled);
                  });
                },
                title: ve ? `${O.label} (${ve})` : O.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${me}`
              }, [
                n("span", { key: "label" }, O.label),
                ve ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, ve) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !it.videoFile,
                onClick: () => pn(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ks, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !it.videoFile,
                onClick: () => pn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ws, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          At ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(fn.minimum * 100),
            "aria-valuemax": Math.round(fn.maximum * 100),
            "aria-valuenow": Math.round(te.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(te.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: fe,
            onPointerMove: ee,
            onKeyDown: Q,
            onDoubleClick: () => lt(ft.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: At ? void 0 : { height: "20rem" } }, n(xc, {
            segments: or,
            shotBoundaries: ct,
            segmentGroups: Rn,
            performerSlots: Ne,
            collapsedGroupKeys: S,
            selectedGroupKey: Wt,
            selectedSegmentId: kt == null ? void 0 : kt.id,
            selectedSegmentIds: Yn,
            duration: Ar,
            currentTime: _,
            zoom: On,
            onZoomChange: Dn,
            onSelectGroup: un,
            onToggleGroup: yn,
            onSelect: (O, ve) => rn(O, ve),
            onSelectSegments: kr,
            onSelectAll: qt,
            onConfigureTag: (O) => Kt(O),
            onSeekTime: (O) => {
              var ve;
              return (ve = Ot.current) == null ? void 0 : ve.call(Ot, O, !1);
            },
            centerRef: y,
            showReviewState: A,
            swimlaneTitleWidth: te.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (O) => Nr((ve) => ({ ...ve, swimlaneTitleWidth: O }))
          }))
        ])
      ])
    ]),
    D ? n(xo, {
      key: `configure-tag:${D.tagId}`,
      tagId: D.tagId,
      tagName: D.tagName,
      performerSlotsEnabled: A,
      onSaved: Me,
      onClose: () => {
        const O = D.trigger;
        Kt(null), requestAnimationFrame(() => {
          var ve;
          O != null && O.isConnected ? O.focus({ preventScroll: !0 }) : (ve = G.current) == null || ve.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ze ? n(gc, {
      key: "publish-approved-dialog",
      drafts: bn,
      processing: ot === -1,
      error: Ee,
      cancelButtonRef: Ge,
      onConfirm: Oe,
      onClose: $
    }) : null,
    dt ? n(fc, {
      key: "rejected-deletion-dialog",
      preview: dt,
      onConfirm: () => {
        T(dt), requestAnimationFrame(() => {
          var O;
          return (O = G.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Cr(null), requestAnimationFrame(() => {
          var O;
          return (O = G.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    tr ? n(dc, {
      key: "shortcuts-dialog",
      reviewMode: A,
      bindings: Fn,
      onClose: () => mn(!1)
    }) : null,
    M ? n(cc, {
      key: "incorrect-examples-dialog",
      examples: N,
      exporting: ne,
      removingExampleId: Te,
      onExport: h,
      onRemove: $e,
      onClose: () => dn(!1)
    }) : null
  ]);
}
function wc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: h, setSelectedSegmentId: y, setSelectedSegmentIds: w } = e;
  function k(S) {
    const C = It(t, S);
    C && u((A) => Ii(A, C));
  }
  function F(S) {
    y(S), w(S == null ? [] : [S]), c.current = S, g.current = [];
  }
  function E(S, {
    focusEditor: C = !1,
    seekToSegment: A = !1,
    additive: D = !1,
    rangeSegmentIds: z = null
  } = {}) {
    var _, T;
    const ie = Js({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, S.id, z, D);
    w(ie.selectedSegmentIds), y(ie.activeSegmentId), c.current = ie.anchorSegmentId, g.current = ie.rangeBaseSegmentIds, ie.activeSegmentId != null && h(It(t, ie.activeSegmentId)), k(S.id), C && ((_ = r.current) == null || _.focus({ preventScroll: !0 })), A && ((T = i.current) == null || T.call(i, S.startSec, !1));
  }
  function $(S) {
    const C = Ws(
      d,
      l,
      S
    );
    w(C.selectedSegmentIds), y(C.activeSegmentId), c.current = C.activeSegmentId, g.current = [], C.activeSegmentId != null && (h(It(t, C.activeSegmentId)), k(C.activeSegmentId));
  }
  function B() {
    var A;
    const S = Qs(s), C = S.includes(l) ? l : S[0] ?? null;
    f(xt({})), m(!1), w(S), y(C), c.current = C, g.current = [], C != null && h(It(
      Xt(s, a, o),
      C
    )), p(S.length === 0 ? "There are no segments to select." : `${S.length} segments selected. Collapsed Segment groups keep their selected segments.`), (A = r.current) == null || A.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: k, replaceSegmentSelection: F, selectSegment: E, selectSegmentCollection: $, selectAllVideoSegments: B };
}
function Nc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: g, onDetailChange: u, onReload: f, recordHistoryAction: m, revealSegmentGroupForSelection: p, savingSegmentId: h, selectedGroups: y, selectedSegment: w, selectedSegmentIdRef: k, selectedSegments: F, selectionAnchorIdRef: E, selectionRangeBaseIdsRef: $, setMergeConfirmation: B, setSaveMessage: S, setSelectedSegmentId: C, setSelectedSegmentIds: A, video: D } = e;
  function z() {
    B(null), requestAnimationFrame(() => {
      var P;
      return (P = a.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    });
  }
  async function ie(P = !1, H = !1, re = null) {
    if (h != null) return;
    const oe = re || wi(
      y,
      { nativeOnly: !o }
    );
    if (!oe) {
      S("Select at least two segments from one swimlane.");
      return;
    }
    if (!P && Va()) {
      B(oe);
      return;
    }
    H && Ja(!1);
    const J = oe.endSec == null ? "open end" : Re(oe.endSec);
    let te = oe.segments[0];
    const G = o ? null : vt(oe.segments, !1), ne = o ? null : crypto.randomUUID(), ce = oe.segments.map((Se) => Se.id), xe = Fd(i, oe.segments), ke = r("merge", oe.segments[0].id);
    if (ke) {
      z(), u(xe, D.id), A([te.id]), C(te.id), E.current = te.id, $.current = [];
      try {
        const Se = oe.segments.slice(1);
        if (!o || te.nativeSegmentId != null) {
          const Q = Se.map((ee) => {
            const Z = `merge-native-selection:${D.id}:${te.id}:${ee.id}:${te.updatedAt}:${ee.updatedAt}`;
            return { key: Z, operationId: je(Z), segmentId: ee.id, expectedUpdatedAt: ee.updatedAt };
          }), fe = await X(`/videos/${D.id}/segments/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorSegmentId: te.id,
              expectedSurvivorUpdatedAt: te.updatedAt,
              consumedSegments: Q.map(({ key: ee, ...Z }) => Z),
              historyReceiptId: ne
            })
          });
          te = fe.survivor, u((ee) => ma(ee, fe), D.id), Q.forEach(({ key: ee }) => Ue(ee));
        } else {
          const Q = Se.map((ee) => {
            const Z = `merge-draft-selection:${D.id}:${te.itemId}:${ee.itemId}:${te.revision}:${ee.revision}`;
            return { key: Z, operationId: je(Z), itemId: ee.itemId, expectedRevision: ee.revision };
          }), fe = await X(`/videos/${D.id}/drafts/merge-selection`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              survivorItemId: te.itemId,
              expectedSurvivorRevision: te.revision,
              consumedDrafts: Q.map(({ key: ee, ...Z }) => Z)
            })
          });
          te = fe.survivor, u((ee) => ma(ee, fe), D.id), Q.forEach(({ key: ee }) => Ue(ee));
        }
        A([te.id]), C(te.id), E.current = te.id, $.current = [], o ? t(Bt) : await m(
          "segments.merge",
          `Merged ${oe.segments.length} segments`,
          G,
          vt([te], !1),
          ne
        ), p(te.id), S(`${oe.segments.length} segments merged into ${Re(oe.startSec)} – ${J}.`);
      } catch (Se) {
        u((Q) => Ci(
          no(Q, [oe.segments[0]], [
            "startSec",
            "endSec",
            "sourceKey",
            "sourceRunId",
            "confidence",
            "isDerived"
          ]),
          oe.segments.slice(1)
        ), D.id), A(ce), C((w == null ? void 0 : w.id) ?? ce[0] ?? null), E.current = (w == null ? void 0 : w.id) ?? ce[0] ?? null, $.current = [], Se.status === 409 ? await g() : S(Se.message || "Unable to merge selected segments.");
      } finally {
        ke();
      }
    }
  }
  function _(P, H = F, re = w) {
    if (H.length === 0) return Promise.resolve(null);
    const oe = hl(P, H, re), J = Jr(d()) != null, te = l({
      kind: "review",
      lockId: oe.activeIdentity.id,
      targets: oe.identities,
      whenBusy: "enqueue",
      run: (G) => T(G, oe)
    });
    return te ? (J && S(`${P === "approved" ? "Approval" : "Rejection"} queued…`), te.done) : Promise.resolve(null);
  }
  async function T({ detail: P, segments: H, onConflict: re, onReload: oe }, J) {
    var Z;
    const te = vl(J, H);
    if (!te) {
      S("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: G, selectedSegments: ne, selectedSegment: ce } = te, xe = bl(ne, G), ke = ne.filter((se) => se.reviewState !== xe);
    if (ke.length === 0) return;
    const Se = ne.map((se) => ({
      id: se.id,
      itemId: se.itemId,
      nativeSegmentId: se.nativeSegmentId
    })), Q = Se.find((se) => se.id === (ce == null ? void 0 : ce.id)) || Se[0], fe = (se, K = !1) => {
      if (!(se != null && se.segments) || !K && !Qr(k.current, Q.id))
        return;
      const ae = Se.map((b) => Qe(se == null ? void 0 : se.segments, b)).filter(Boolean), I = Qe(se == null ? void 0 : se.segments, Q) || ae[0] || null;
      A(ae.map((b) => b.id)), C((I == null ? void 0 : I.id) ?? null), E.current = (I == null ? void 0 : I.id) ?? null, $.current = [];
    };
    S(`Updating ${ke.length} selected segment${ke.length === 1 ? "" : "s"}…`);
    const ee = uo();
    s({
      type: "add",
      entry: { id: ee, op: "patch", targets: ke.map(co), values: { reviewState: xe } }
    });
    try {
      const se = await X(`/videos/${D.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: xe,
          segments: ne.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), K = new Map((se.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (Se.forEach((b) => {
        const v = K.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        v && (b.nativeSegmentId = v.nativeSegmentId, b.itemId = v.itemId);
      }), se.history && t(se.history), xe === "rejected" || (se.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        fe(await oe()), s({ type: "settle", key: ee }), S(`${se.updatedCount} selected segment${se.updatedCount === 1 ? "" : "s"} ${xe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const I = (b) => ({
        ...b,
        approvedSetVersion: se.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((v) => {
          const x = K.get(v.nativeSegmentId != null ? `native:${v.nativeSegmentId}` : `item:${v.itemId}`);
          return x ? {
            ...v,
            id: x.nativeSegmentId != null ? x.nativeSegmentId : -x.itemId,
            itemId: x.itemId,
            nativeSegmentId: x.nativeSegmentId,
            published: x.nativeSegmentId != null,
            reviewState: xe,
            revision: x.nativeSegmentId != null ? v.revision : x.revision,
            updatedAt: x.updatedAt
          } : v;
        })
      });
      u(I, D.id), s({ type: "settle", key: ee }), fe(I(P)), S(`${se.updatedCount} selected segment${se.updatedCount === 1 ? "" : "s"} ${xe === "approved" ? "approved" : xe === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (se) {
      s({ type: "discard", key: ee }), se.status === 409 && ((Z = se.payload) != null && Z.currentHistory) && t(se.payload.currentHistory);
      const K = se.status === 409 ? await re() : P;
      fe(K, !0), S(se.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: z, mergeSelectedSwimlane: ie, saveSelectedReviewState: _ };
}
function Ic(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, exportingExamples: p, hideDerivedSegments: h, heldCreatedSegmentTag: y, incorrectExamples: w, lineage: k, materializeButtonRef: F, materializePreview: E, materializeRestoreFocusRef: $, materializing: B, mutateSegment: S, onConflict: C, onDetailChange: A, onReload: D, performerSlots: z, recordHistoryAction: ie, refreshMaterializationPreview: _, removingExampleId: T, revealSegmentGroupForSelection: P, savingSegmentId: H, segmentGroups: re, segments: oe, selectedSegment: J, selectedSegmentIdRef: te, selectedSegments: G, selectionAnchorIdRef: ne, selectionRangeBaseIdsRef: ce, setAutoAssignError: xe, setAutoAssignOpen: ke, setAutoAssigning: Se, setEditorFilters: Q, setExportingExamples: fe, setHeldCreatedSegmentTag: ee, setHideDerivedSegments: Z, setIncorrectExamples: se, setMaterializeError: K, setMaterializeLoading: ae, setMaterializeOpen: I, setMaterializePreview: b, setMaterializing: v, setRejectedDeletionPreview: x, setRemovingExampleId: N, setSaveMessage: M, setSelectedSegmentGroupKey: Y, setSelectedSegmentId: U, setSelectedSegmentIds: ue, video: R } = e;
  async function W() {
    var Ae, Xe, Ge;
    if (G.length === 0 || !J || H != null) return;
    const V = Md(G, w), de = V.segments;
    if (de.length === 0) return;
    const Me = G.map((Oe) => ({
      id: Oe.id,
      itemId: Oe.itemId,
      nativeSegmentId: Oe.nativeSegmentId
    })), Be = Me.find((Oe) => Oe.id === J.id) || Me[0], we = [], _e = [];
    let Ye = !1, Ne = u, be = !1;
    const We = [], Pe = r("feedback", Be.id);
    if (Pe) {
      M(V.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Oe = async ($e, Te) => {
          const Je = $e.nativeSegmentId != null, bt = V.action === "remove" ? `incorrect-example-remove:${R.id}:${Te == null ? void 0 : Te.id}:${Te == null ? void 0 : Te.revision}:${Te == null ? void 0 : Te.representationRevision}` : `incorrect-example-collect:${R.id}:${Je ? `native:${$e.nativeSegmentId}:${$e.updatedAt}` : `item:${$e.itemId}:${$e.revision}`}`;
          if (V.action === "remove" && !Te)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let st;
          try {
            st = V.action === "remove" ? await X(
              `/videos/${R.id}/incorrect-examples/${Te.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: je(bt),
                  expectedExampleRevision: Te.revision,
                  expectedRepresentationRevision: Te.representationRevision
                })
              }
            ) : await X(`/videos/${R.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: je(bt),
                nativeSegmentId: Je ? $e.nativeSegmentId : null,
                itemId: Je ? null : $e.itemId,
                expectedUpdatedAt: Je ? $e.updatedAt : null,
                expectedRevision: Je ? null : $e.revision
              })
            });
          } catch (Ut) {
            throw Ut.operationKey = bt, Ut;
          }
          if (!Ed(V.action, st))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ue(bt), st;
        };
        for (const $e of de) {
          const Te = V.action === "remove" ? w.find((Je) => Je.itemId != null && Je.itemId === $e.itemId) : null;
          try {
            const Je = Me.find((pt) => pt.id === $e.id);
            let bt = Qe(
              Ne == null ? void 0 : Ne.segments,
              Je
            ) || $e, st;
            try {
              st = await Oe(bt, Te);
            } catch (pt) {
              if (pt.status === 409 && ((Xe = (Ae = pt.payload) == null ? void 0 : Ae.result) == null ? void 0 : Xe.code) === "OPERATION_REPLAYED")
                Ne = await X(
                  `/videos/${R.id}/editor`
                ), be = !0, We.length = 0, Ue(pt.operationKey), st = pt.payload.result;
              else {
                if (V.action !== "collect" || pt.status !== 409) throw pt;
                const ot = await X(
                  `/videos/${R.id}/editor`
                );
                Ne = ot, be = !0, We.length = 0;
                const Ot = Qe(
                  ot == null ? void 0 : ot.segments,
                  Je
                );
                if (!Ot) throw pt;
                bt = Ot, st = await Oe(bt, null);
              }
            }
            Je && st.itemId != null && (Je.itemId = st.itemId), Ne = mr(
              Ne,
              st.editorDelta
            ), We.push(st.editorDelta);
            const Ut = { segment: $e, result: st, example: Te };
            we.push(Ut);
          } catch (Je) {
            if (_e.push(Je), ![400, 404, 409].includes(Je.status)) break;
          }
        }
        if (c && we.length > 0) {
          const $e = V.action === "remove", Te = we.length;
          await ie(
            $e ? "feedback.remove" : "feedback.collect",
            $e ? `Removed ${Te} incorrect AI example${Te === 1 ? "" : "s"}` : `Collected ${Te} incorrect AI example${Te === 1 ? "" : "s"}`,
            lr(we, $e),
            lr(we, !$e)
          ) || (Ye = !0);
        }
        we.some(({ result: $e }) => $e.representation === "basicNativeBin") && zn();
        const Ee = Qr(
          te.current,
          Be.id
        ), ze = V.action === "collect" && we.some(({ segment: $e }) => $e.id === Be.id), Pt = we.map(({ segment: $e }) => $e.id), Le = ze ? Xs(
          o,
          Pt,
          Be.id
        ) : null, St = ze ? (Le == null ? void 0 : Le.id) ?? null : Be.id;
        Ee && ze && (ue(Le ? [Le.id] : []), U((Le == null ? void 0 : Le.id) ?? fr), ne.current = (Le == null ? void 0 : Le.id) ?? null, ce.current = []);
        const An = await X(`/videos/${R.id}/incorrect-examples`);
        se(An);
        const dt = Ne;
        if (A(be ? dt : ($e) => We.reduce(mr, $e), R.id), Ee && Qr(
          te.current,
          St
        )) {
          let $e, Te;
          ze ? (Te = Le ? Qe(dt == null ? void 0 : dt.segments, {
            id: Le.id,
            itemId: Le.itemId,
            nativeSegmentId: Le.nativeSegmentId
          }) : null, $e = Te ? [Te] : []) : ($e = Me.map((Je) => Qe(dt == null ? void 0 : dt.segments, Je)).filter(Boolean), Te = Qe(dt == null ? void 0 : dt.segments, Be) || $e[0] || null), ue($e.map((Je) => Je.id)), U((Te == null ? void 0 : Te.id) ?? (ze ? fr : null)), ne.current = (Te == null ? void 0 : Te.id) ?? null, ce.current = [], Y(Te ? It(o, Te.id) : null), Te && P(Te.id);
        }
        if (_e.length > 0) {
          const $e = ((Ge = _e[0]) == null ? void 0 : Ge.message) || "Only segments with registered AI provenance can be collected.";
          we.length === 0 ? M($e) : V.action === "remove" ? M(
            `Partially removed ${we.length} of ${de.length} selected incorrect examples. ${$e}`
          ) : M(
            `Partially collected ${we.length} of ${de.length} selected segments. ${$e}`
          );
        } else if (V.action === "remove")
          M(
            `${we.length} incorrect example${we.length === 1 ? "" : "s"} removed and ${we.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const $e = we.filter(({ result: Te }) => Te.representation === "basicNativeBin").length;
          M($e === we.length ? `${we.length} incorrect AI example${we.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${we.length} incorrect AI example${we.length === 1 ? "" : "s"} collected and ${we.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ye && M("The change saved, but editor history could not be updated.");
      } catch (Oe) {
        M(Oe.message || "Unable to update the selected incorrect examples.");
      } finally {
        Pe();
      }
    }
  }
  async function q(V) {
    var Me, Be;
    if (!V || T != null || p) return;
    N(V.id);
    const de = `incorrect-example-remove:${R.id}:${V.id}:${V.revision}:${V.representationRevision}`;
    try {
      let we, _e = !1;
      try {
        we = await X(
          `/videos/${R.id}/incorrect-examples/${V.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(de),
              expectedExampleRevision: V.revision,
              expectedRepresentationRevision: V.representationRevision
            })
          }
        );
      } catch (be) {
        if (be.status !== 409 || ((Be = (Me = be.payload) == null ? void 0 : Me.result) == null ? void 0 : Be.code) !== "OPERATION_REPLAYED")
          throw be;
        we = be.payload.result, _e = !0;
      }
      Ue(de);
      let Ye = !0;
      if (c) {
        const We = [{ segment: Qe(u.segments, {
          itemId: V.itemId
        }) || {
          id: V.itemId == null ? null : -V.itemId,
          itemId: V.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: V.representationRevision
        }, result: we, example: V }];
        Ye = await ie(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          lr(We, !0),
          lr(We, !1)
        );
      }
      const Ne = await X(
        `/videos/${R.id}/incorrect-examples`
      );
      se(Ne), _e ? await D() : A(
        (be) => mr(be, we.editorDelta),
        R.id
      ), V.representation === "basicNativeBin" && zn(), M(Ye ? _e ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : V.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (we) {
      we.status === 409 && await C(), M(we.message || "Unable to remove the incorrect example.");
    } finally {
      N(null);
    }
  }
  async function ge() {
    if (p || T != null || w.length === 0) return;
    fe(!0);
    const V = `incorrect-example-export:${R.id}:${w.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await Pd(
        R.id,
        w
      ), Me = new FormData();
      Me.append("metadata", JSON.stringify({
        operationId: je(V),
        examples: de.captures
      }));
      for (const be of de.files)
        Me.append(be.fieldName, be.file);
      const Be = await X(
        `/videos/${R.id}/incorrect-examples/export`,
        { method: "POST", body: Me }
      ), we = await Ql(Be.downloadUrl), _e = URL.createObjectURL(we.blob), Ye = document.createElement("a");
      Ye.href = _e, Ye.download = we.fileName, Ye.click(), setTimeout(() => URL.revokeObjectURL(_e), 1e3);
      const Ne = await X(
        `/training-exports/${Be.id}/complete`,
        { method: "POST" }
      );
      Ue(V), se(await X(
        `/videos/${R.id}/incorrect-examples`
      )), M(
        `Downloaded ${Be.exampleCount} incorrect example${Be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ne.clearedExampleCount} from the working collection.`
      );
    } catch (de) {
      M(de.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      fe(!1);
    }
  }
  async function Ie(V = null) {
    const de = oe.filter((Pe) => Pe.reviewState === "rejected"), Me = de.length, Be = w.some((Pe) => Pe.representation === "fullItem");
    if (V == null && Me === 0 && !Be) {
      M("There are no rejected segments to delete.");
      return;
    }
    if (V == null) {
      const Pe = r("delete-rejected", -1);
      if (!Pe) return;
      M("Preparing deletion summary…");
      try {
        const Ae = await X(`/videos/${R.id}/rejected/deletion/preview`, { method: "POST" }), Xe = Number(Ae.deletedSegmentCount) || 0, Ge = Number(Ae.deferredRejectedSegmentCount) || 0, Oe = Number(Ae.protectedIncorrectExampleCount) || 0;
        if (Xe === 0) {
          Ge > 0 ? M(
            `${Ge} feedback-protected rejected segment${Ge === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Ge === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : M("There are no rejected segments to delete.");
          return;
        }
        if (!pi(Ae, M)) return;
        x(Ae), M("");
      } catch (Ae) {
        M(Ae.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Pe();
      }
      return;
    }
    const we = V, _e = Number(we.deferredRejectedSegmentCount) || 0, Ye = te.current, Ne = _e === 0 ? to(u, de.map((Pe) => Pe.id)) : u, be = Ne.segments.find((Pe) => Pe.reviewState === "unreviewed") || Ne.segments[0] || null, We = r("delete-rejected", -1);
    if (We) {
      x(null), M("Deleting rejected segments…"), _e === 0 && (A(Ne, R.id), ue(be ? [be.id] : []), U((be == null ? void 0 : be.id) ?? null), ne.current = (be == null ? void 0 : be.id) ?? null, ce.current = []);
      try {
        const Pe = `rejected-dependency-delete:${R.id}:${we.fingerprint}`, Ae = await X(`/videos/${R.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Pe),
            fingerprint: we.fingerprint
          })
        });
        Ue(Pe), await D(), Ae.deletedSegmentCount > 0 && t(Bt);
        const Xe = _e > 0 ? ` ${_e} feedback-protected rejected segment${_e === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
        M(`${Ae.deletedSegmentCount} segment${Ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Xe}`);
      } catch (Pe) {
        _e === 0 && A((Ae) => Ci(
          Ae,
          de
        ), R.id), ue(Ye == null ? [] : [Ye]), U(Ye), ne.current = Ye, ce.current = [], M(Pe.message || "Unable to delete rejected segments.");
      } finally {
        We();
      }
    }
  }
  async function Ce(V = i) {
    if (!(a || V.length === 0)) {
      Se(!0), xe("");
      try {
        const de = await X(`/videos/${R.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: V.flatMap((Me) => Me.nativeSegmentId == null ? [] : [Me.nativeSegmentId]),
            itemIds: V.flatMap((Me) => Me.published || Me.itemId == null ? [] : [Me.itemId])
          })
        });
        ke(!1), await D(), M(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (de) {
        xe(de.message || "Unable to auto-assign performers.");
      } finally {
        Se(!1);
      }
    }
  }
  async function he() {
    I(!0), K(""), !E && (ae(!0), _());
  }
  function at() {
    $.current = !0, I(!1), requestAnimationFrame(() => {
      var V;
      return (V = F.current) == null ? void 0 : V.focus({ preventScroll: !0 });
    });
  }
  async function Ze() {
    if (!E || B || E.createCount + E.linkCount === 0)
      return;
    v(!0), K("");
    let V;
    try {
      const de = `materialize-derived:${R.id}:${E.fingerprint}`;
      V = await X(`/videos/${R.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(de),
          fingerprint: E.fingerprint,
          maxDepth: 3
        })
      }), Ue(de);
    } catch (de) {
      de.status === 409 && b(null), K(de.message || "Unable to materialize derived segments."), v(!1);
      return;
    }
    b((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await D(), at(), b(null);
      const de = V.createdCount + V.linkedCount;
      M(`${V.createdCount} derived segment${V.createdCount === 1 ? "" : "s"} created and ${V.linkedCount} existing segment${V.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && M("Every applicable derivation was already materialized.");
    } catch {
      K("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    v(!1);
  }
  async function De(V, de = null) {
    var Be, we, _e, Ye;
    const Me = {
      tagId: V,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (G.length > 1) {
      const Ne = G.filter((Ge) => Ge.tagId !== V);
      if (Ne.length === 0) {
        d();
        return;
      }
      const be = G.map((Ge) => ({
        id: Ge.id,
        itemId: Ge.itemId,
        nativeSegmentId: Ge.nativeSegmentId
      })), We = G.map((Ge) => !c || Ge.nativeSegmentId != null ? `native:${Ge.nativeSegmentId}:${Ge.updatedAt}` : `item:${Ge.itemId}:${Ge.revision}`).sort().join(","), Pe = `bulk-tag:${R.id}:${V}:${We}`, Ae = ba(
        u,
        Ne.map((Ge) => Ge.id),
        Me
      ), Xe = r("tag", (J == null ? void 0 : J.id) ?? Ne[0].id);
      if (!Xe) return;
      M(`Changing tag for ${Ne.length} selected segment${Ne.length === 1 ? "" : "s"}…`), A(Ae, R.id), d();
      try {
        const Ge = c ? null : crypto.randomUUID();
        await X(`/videos/${R.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Pe),
            tagId: V,
            historyReceiptId: Ge,
            segments: G.map((Le) => {
              const St = !c || Le.nativeSegmentId != null;
              return {
                nativeSegmentId: St ? Le.nativeSegmentId : null,
                itemId: St ? null : Le.itemId,
                expectedUpdatedAt: St ? Le.updatedAt : null,
                expectedRevision: St ? null : Le.revision
              };
            })
          })
        }), Ue(Pe);
        const Oe = vt(
          G,
          c
        ), Ee = await D(), ze = be.map((Le) => Qe(Ee == null ? void 0 : Ee.segments, Le)).filter(Boolean);
        await ie(
          "segments.tag",
          `Changed tag for ${Ne.length} segment${Ne.length === 1 ? "" : "s"}`,
          Oe,
          vt(ze, c),
          Ge
        );
        const Pt = be.map((Le) => Qe(Ee == null ? void 0 : Ee.segments, Le)).filter(Boolean);
        ue(Pt.map((Le) => Le.id)), U(((Be = Pt.find((Le) => Le.id === (J == null ? void 0 : J.id))) == null ? void 0 : Be.id) ?? ((we = Pt[0]) == null ? void 0 : we.id) ?? null), d(), M(`${Ne.length} selected segment${Ne.length === 1 ? "" : "s"} retagged.`);
      } catch (Ge) {
        A((ze) => no(
          ze,
          Ne,
          Object.keys(Me)
        ), R.id);
        const Oe = be.map((ze) => Qe(u.segments, ze)).filter(Boolean), Ee = Qe(u.segments, {
          id: J == null ? void 0 : J.id,
          itemId: J == null ? void 0 : J.itemId,
          nativeSegmentId: J == null ? void 0 : J.nativeSegmentId
        }) || Oe[0] || null;
        ue(Oe.map((ze) => ze.id)), U((Ee == null ? void 0 : Ee.id) ?? null), ne.current = (Ee == null ? void 0 : Ee.id) ?? null, ce.current = [], Ge.status === 409 && await C(), M(Ge.message || "Unable to change the selected segment tags.");
      } finally {
        Xe();
      }
      return;
    }
    if (!(G.length !== 1 || !J)) {
      if (J.id === g || (y == null ? void 0 : y.segmentId) === J.id) {
        const Ne = y != null, be = Nl(y, J, V, de);
        if (ee(be), be) {
          const We = Ya(
            { ...J, tagId: be.tagId },
            z,
            f,
            h,
            re
          );
          Q(We.filters), Z(We.hideDerivedSegments), M("Tag change queued…");
        } else Ne && M("");
        d();
        return;
      }
      if (V === J.tagId) {
        d();
        return;
      }
      if (J.itemId != null && ((Ye = (_e = k.data) == null ? void 0 : _e.children) == null ? void 0 : Ye.length) > 0) {
        const Ne = r("lineage-tag", J.id);
        if (!Ne) return;
        M("Checking lineage impact…");
        try {
          const be = await X(`/items/${J.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: J.revision, tagId: V })
          }), We = be.deletedItemIds.length > 0 || be.removedEdgeIds.length > 0;
          if (We && !window.confirm(
            `Changing this tag removes ${be.removedEdgeIds.length} lineage edge${be.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${be.deletedItemIds.length} derived segment${be.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            M("Tag change canceled.");
            return;
          }
          const Pe = ba(
            u,
            [J.id],
            Me
          );
          A(Pe, R.id), d();
          const Ae = `tag-change:${J.itemId}:${J.revision}:${be.componentFingerprint}:${V}`;
          await X(`/items/${J.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Ae),
              expectedRevision: J.revision,
              componentFingerprint: be.componentFingerprint,
              tagId: V
            })
          }), Ue(Ae), await D(), d(), M(We ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (be) {
          A((We) => no(
            We,
            [J],
            Object.keys(Me)
          ), R.id), ue([J.id]), U(J.id), ne.current = J.id, ce.current = [], be.status === 409 ? (M("Lineage changed — loading the latest segments…"), await C()) : M(be.message || "Unable to reconcile the lineage.");
        } finally {
          Ne();
        }
        return;
      }
      d(), await S(J, {
        startSec: J.startSec,
        endSec: J.endSec,
        tagId: V
      }, !0, null, !0, Me);
    }
  }
  async function Ke(V) {
    const de = oe.find((Be) => Be.id === V.segmentId);
    if (!de) return;
    await S(de, {
      startSec: de.startSec,
      endSec: de.endSec,
      tagId: V.tagId
    }, !0, null, !0, {
      tagId: V.tagId,
      ...V.tagName ? { tagName: V.tagName } : {},
      tagSortName: null
    }, !1) || M(`The new segment was not retagged${V.tagName ? ` to ${V.tagName}` : ""}. Choose its tag again.`);
  }
  async function Ve() {
    var Ne, be, We, Pe;
    if (!l || !J || H != null) return;
    const V = [...G].sort((Ae, Xe) => Number(Ae.nativeSegmentId ?? Ae.id) - Number(Xe.nativeSegmentId ?? Xe.id)), de = new Set(V.map((Ae) => Ae.id)), Me = V.map((Ae) => `${Ae.nativeSegmentId ?? Ae.id}:${Ae.updatedAt}`).join("|"), Be = r("bin", J.id);
    if (!Be) return;
    M(`Moving ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin…`);
    const we = `bulk-move:${R.id}:${Me}`, _e = je(we), Ye = c ? null : crypto.randomUUID();
    try {
      const Ae = (Ee = !1) => X(`/videos/${R.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e,
          segments: V.map((ze) => ({
            segmentId: ze.nativeSegmentId ?? ze.id,
            expectedUpdatedAt: ze.updatedAt
          })),
          discardMissingImage: Ee,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ye
        })
      });
      let Xe;
      try {
        Xe = await Ae(
          go(we)
        );
      } catch (Ee) {
        if (((Ne = Ee.payload) == null ? void 0 : Ne.code) !== "missing-image" || !window.confirm(`${Ee.message}

Continue and discard the missing image reference?`)) throw Ee;
        po(we), Xe = await Ae(!0);
      }
      Ue(we), zn();
      const Ge = new Map((Xe.items || []).map((Ee) => [
        Number(Ee.segmentId),
        Ee
      ]));
      await ie(
        "segments.moveToBin",
        `Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin`,
        vt(V, !1),
        vt(V.map((Ee) => {
          const ze = Ge.get(
            Number(Ee.nativeSegmentId ?? Ee.id)
          );
          return {
            ...Ee,
            recycleBinItemId: (ze == null ? void 0 : ze.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (ze == null ? void 0 : ze.revision) ?? null
          };
        }), !1),
        Ye
      );
      const Oe = Zs(o, de, J.id);
      A((Ee) => ({
        ...Ee,
        segments: (Ee.segments || []).filter((ze) => !de.has(ze.id))
      }), R.id), ue(Oe ? [Oe.id] : []), U((Oe == null ? void 0 : Oe.id) ?? null), ne.current = (Oe == null ? void 0 : Oe.id) ?? null, ce.current = [], Oe && (Y(It(o, Oe.id)), P(Oe.id)), requestAnimationFrame(() => {
        var Ee;
        return (Ee = m.current) == null ? void 0 : Ee.focus({ preventScroll: !0 });
      }), M(`Moved ${V.length} segment${V.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ae) {
      const Xe = ((be = Ae.payload) == null ? void 0 : be.code) || ((Pe = (We = Ae.payload) == null ? void 0 : We.result) == null ? void 0 : Pe.code);
      Ae.status === 409 && Xe === "CANONICAL_SEGMENT_CHANGED" ? await C() : M(Ae.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Be();
    }
  }
  async function He() {
    if (!(c || s.current || H != null)) {
      s.current = !0, M("Checking the recycling bin…");
      try {
        const V = await X("/bin"), de = await yi(V, () => M("Emptying the recycling bin…"));
        if (de.status === "empty") {
          M("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          M("The recycling bin was not emptied.");
          return;
        }
        M(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (V) {
        M(V.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: W, removeIncorrectExample: q, captureTrainingExport: ge, deleteRejectedSegments: Ie, autoAssignPerformers: Ce, previewDerivedSegments: he, closeMaterializeDialog: at, materializeDerivedSegments: Ze, saveTag: De, applyHeldCreatedSegmentTag: Ke, moveToBin: Ve, emptyRecyclingBin: He };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, commonActionsRef: o, compatibilityMode: i, currentTime: a, detail: s, editorLayout: l, focusRowRef: d, history: c, historyRef: g, historySaving: u, horizontalLayoutSize: f, mediaStackHeight: m, mediaStackRef: p, onDetailChange: h, onReload: y, railToggleRef: w, recordHistoryAction: k, savingSegmentId: F, savingShot: E, savingShotRef: $, setCollapsedSegmentGroups: B, setEditorLayout: S, setHistorySaving: C, setIncorrectExamples: A, setSaveMessage: D, setSavingShot: z, shotBoundaries: ie, timelineDuration: _, video: T, workspaceRef: P } = e;
  async function H(I, b, v) {
    var Y, U, ue, R;
    const x = I.type === "segment" ? [I] : I.segments || [], N = (b == null ? void 0 : b.type) === "segment" ? [b] : (b == null ? void 0 : b.segments) || [];
    let M = v;
    for (const [W, q] of x.entries()) {
      const ge = N[W], Ie = ((Y = q.identity) == null ? void 0 : Y.nativeSegmentId) != null || ((U = q.identity) == null ? void 0 : U.published) === !0, Ce = ((ue = ge == null ? void 0 : ge.identity) == null ? void 0 : ue.recycleBinItemId) ?? ((R = ge == null ? void 0 : ge.identity) == null ? void 0 : R.itemId);
      let he = Qe(M.segments, ge == null ? void 0 : ge.identity) || Qe(M.segments, q.identity);
      if (!he && Ie && Ce != null && ge.identity.revision != null) {
        const De = `history-restore:${T.id}:${Ce}:${ge.identity.revision}`;
        await X(`/bin/${Ce}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(De),
            expectedRevision: ge.identity.revision
          })
        }), Ue(De), M = await y(), he = M.segments.find((Ke) => Ke.tagId === q.values.tagId && Ke.startSec === q.values.startSec && Ke.endSec === q.values.endSec);
      }
      if (!he)
        throw new Error("A segment in this history state no longer exists.");
      if ((he.nativeSegmentId != null || he.published === !0) !== Ie) {
        if (Ie) {
          const De = he.recycleBinItemId ?? he.itemId ?? Ce;
          if (De == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ke = `history-restore:${T.id}:${De}:${he.revision}:${q.values.reviewState ?? "native"}`;
          await X(`/bin/${De}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Ke),
              expectedRevision: he.revision
            })
          }), Ue(Ke);
        } else {
          const De = `history-bin:${T.id}:${he.nativeSegmentId}:${he.updatedAt}:${q.values.reviewState}`;
          await X(`/videos/${T.id}/segments/${he.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(De),
              expectedUpdatedAt: he.updatedAt,
              reviewState: q.values.reviewState
            })
          }), Ue(De);
        }
        if (M = await y(), !Ie)
          continue;
        if (he = Qe(M.segments, q.identity) || M.segments.find((De) => De.tagId === q.values.tagId && De.startSec === q.values.startSec && De.endSec === q.values.endSec), !he)
          throw new Error("The restored segment could not be found.");
      }
      const Ze = q.values;
      if (he.nativeSegmentId == null && he.itemId != null) {
        const De = `history-draft-update:${T.id}:${he.itemId}:${he.revision}:${Ze.tagId}:${Ze.startSec}:${Ze.endSec ?? "open"}:${Ze.reviewState}`;
        await X(`/videos/${T.id}/drafts/${he.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(De),
            expectedRevision: he.revision,
            ...Ze
          })
        }), Ue(De);
      } else
        await X(`/videos/${T.id}/segments/${he.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ze, expectedUpdatedAt: he.updatedAt })
        });
      M = await y();
    }
    return M;
  }
  async function re(I, b) {
    var v;
    for (const x of I.targets || []) {
      const N = Qe(b.segments, x.identity);
      if (!N)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const M = (v = b.performerSlotRevisions) == null ? void 0 : v[N.id];
      await X(N.published ? `/videos/${T.id}/segments/${N.nativeSegmentId}/slots` : `/videos/${T.id}/drafts/${N.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: M,
          assignments: x.assignments
        })
      }), b = await y();
    }
    return b;
  }
  async function oe(I, b, v) {
    if (!i)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = b, N = await X(`/videos/${T.id}/incorrect-examples`);
    const M = (Y) => N.find((U) => {
      var ue;
      return U.id === Y.exampleId || ((ue = Y.collectedIdentity) == null ? void 0 : ue.itemId) != null && U.itemId === Y.collectedIdentity.itemId;
    });
    for (const [Y, U] of (I.entries || []).entries()) {
      const ue = `history-feedback:${T.id}:${v.action.sequence}:${v.direction}:${Y}`, R = M(U);
      if (I.collected && R) {
        Ue(ue);
        continue;
      }
      let W;
      if (I.collected) {
        const q = Qe(
          x.segments,
          U.collectedIdentity
        ) || Qe(
          x.segments,
          U.originalIdentity
        );
        if (!q)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const ge = q.nativeSegmentId != null;
        W = await X(`/videos/${T.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(ue),
            nativeSegmentId: ge ? q.nativeSegmentId : null,
            itemId: ge ? null : q.itemId,
            expectedUpdatedAt: ge ? q.updatedAt : null,
            expectedRevision: ge ? null : q.revision
          })
        });
      } else {
        if (!R) {
          Ue(ue);
          continue;
        }
        W = await X(
          `/videos/${T.id}/incorrect-examples/${R.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(ue),
              expectedExampleRevision: R.revision,
              expectedRepresentationRevision: R.representationRevision
            })
          }
        );
      }
      Ue(ue), x = mr(
        x,
        W.editorDelta
      ), N = await X(
        `/videos/${T.id}/incorrect-examples`
      );
    }
    return A(N), x;
  }
  async function J(I, b, v = []) {
    const x = I.state;
    if (!i && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const M = `basic-history:${T.id}:${g.current.revision}:${I.action.sequence}:${I.direction}`, Y = await X(`/videos/${T.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(M),
          expectedHistoryRevision: g.current.revision,
          actionSequence: I.action.sequence,
          direction: I.direction
        })
      });
      return t(Y.history), v.push(M), y();
    }
    const N = I.direction === "backward" ? I.action.afterState : I.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let M = b;
      const Y = (N == null ? void 0 : N.type) === "composite" ? N.states || [] : [];
      for (const [U, ue] of (x.states || []).entries()) {
        const R = Y[U];
        M = await J({
          ...I,
          state: ue,
          action: {
            ...I.action,
            beforeState: I.direction === "backward" ? ue : R,
            afterState: I.direction === "backward" ? R : ue
          }
        }, M, v);
      }
      return M;
    }
    if ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")
      return H(
        x,
        N,
        b
      );
    if ((x == null ? void 0 : x.type) === "performerSlots")
      return re(x, b);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return oe(x, b, I);
    if ((x == null ? void 0 : x.type) === "shots") {
      const M = Kn(b.shotBoundaries || []), Y = await X(`/videos/${T.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(`history-shots:${T.id}:${M}:${x.fingerprint}`),
          expectedFingerprint: M,
          boundaries: x.boundaries
        })
      });
      return { ...b, shotBoundaries: Y };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function te(I) {
    var x;
    if (u || F != null || E || I === c.cursorSequence)
      return;
    const b = ud(c, I);
    if (b.length === 0) return;
    const v = r("history", -1);
    if (v) {
      C(!0), D(`Restoring ${b.length} history ${b.length === 1 ? "action" : "actions"}…`);
      try {
        let N = s;
        const M = [];
        for (const U of b)
          N = await J(
            U,
            N,
            M
          );
        const Y = i ? await X(`/videos/${T.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: g.current.revision,
            targetSequence: I
          })
        }) : g.current;
        M.forEach(Ue), t(Y), await y(), D("History restored.");
      } catch (N) {
        N.status === 409 && ((x = N.payload) != null && x.current) && t(N.payload.current), await y(), D(N.message || "Unable to restore editor history.");
      } finally {
        v(), C(!1);
      }
    }
  }
  function G(I) {
    S((b) => ({ ...b, timelineRatio: lo(I, m) }));
  }
  function ne(I) {
    var x, N;
    const b = (x = p.current) == null ? void 0 : x.getBoundingClientRect();
    if (!b) return;
    const v = ((N = o.current) == null ? void 0 : N.offsetHeight) || 0;
    G(js(
      I.clientY,
      b.top + v,
      Math.max(0, b.height - v)
    ));
  }
  function ce(I) {
    I.currentTarget.setPointerCapture(I.pointerId), ne(I);
  }
  function xe(I) {
    I.currentTarget.hasPointerCapture(I.pointerId) && ne(I);
  }
  function ke(I) {
    const b = I.shiftKey ? 0.1 : 0.05;
    let v = null;
    I.key === "ArrowUp" && (v = l.timelineRatio + b), I.key === "ArrowDown" && (v = l.timelineRatio - b);
    const x = so(m);
    I.key === "Home" && (v = x.minimum), I.key === "End" && (v = x.maximum), v != null && (I.preventDefault(), I.stopPropagation(), G(v));
  }
  function Se(I) {
    const b = I === "detailWidth" ? f.focusRow : f.workspace, v = f.workspace > 0 ? Vr(f.workspace, 600) : 560, x = Zt(l.markerRailWidth, v), N = I === "detailWidth" ? 344 + (l.markerRailOpen ? x + 24 : 0) : 600;
    return b > 0 ? Vr(b, N) : 560;
  }
  function Q(I, b) {
    S((v) => ({ ...v, [I]: Zt(b, Se(I)) }));
  }
  function fe(I, b) {
    var x, N;
    const v = b === "detailWidth" ? (x = d.current) == null ? void 0 : x.getBoundingClientRect() : (N = P.current) == null ? void 0 : N.getBoundingClientRect();
    v && Q(b, b === "detailWidth" ? I.clientX - v.left : v.right - I.clientX);
  }
  function ee(I, b) {
    const v = Se(I), x = Zt(l[I], v);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": b,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(v),
      "aria-valuenow": Math.round(x),
      "aria-valuetext": `${Math.round(x)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (N) => {
        N.currentTarget.setPointerCapture(N.pointerId), fe(N, I);
      },
      onPointerMove: (N) => {
        N.currentTarget.hasPointerCapture(N.pointerId) && fe(N, I);
      },
      onKeyDown: (N) => {
        const M = N.shiftKey ? 40 : 16;
        let Y = null;
        N.key === "ArrowLeft" && (Y = I === "detailWidth" ? -M : M), N.key === "ArrowRight" && (Y = I === "detailWidth" ? M : -M);
        let U = Y == null ? null : x + Y;
        N.key === "Home" && (U = 240), N.key === "End" && (U = v), U != null && (N.preventDefault(), N.stopPropagation(), Q(I, U));
      },
      onDoubleClick: () => Q(I, ft[I]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Z() {
    S((I) => ({ ...I, markerRailOpen: !I.markerRailOpen })), requestAnimationFrame(() => {
      var I;
      return (I = w.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
  }
  function se(I) {
    B((b) => b.includes(I) ? b.filter((v) => v !== I) : _t([...b, I]));
  }
  async function K(I, b = !0, v = a) {
    var Y;
    if ($.current) return null;
    const x = Number((Y = T.videoFile) == null ? void 0 : Y.duration) || _, N = Kn(ie), M = `shot-${I}:${T.id}:${v.toFixed(3)}:${x.toFixed(3)}:${N}`;
    $.current = !0, z(!0), D(I === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const U = await X(`/videos/${T.id}/shot-boundaries/${I}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(I === "split" ? { operationId: je(M), timeSec: v } : { operationId: je(M), timeSec: v })
      });
      return Ue(M), h((ue) => ({ ...ue, shotBoundaries: U }), T.id), b && await k(
        "shots.update",
        I === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: ie,
          fingerprint: N
        },
        {
          type: "shots",
          boundaries: U,
          fingerprint: Kn(U)
        }
      ), D(I === "split" ? "Shot boundary added." : "Shots merged."), U;
    } catch (U) {
      return D(U.message || "Unable to edit shot boundaries."), null;
    } finally {
      $.current = !1, z(!1);
    }
  }
  async function ae(I) {
    if ($.current) return null;
    const b = `shot-restore:${T.id}:${I.afterFingerprint}`;
    $.current = !0, z(!0), D("Undoing shot edit…");
    try {
      const v = await X(`/videos/${T.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(b),
          expectedFingerprint: I.afterFingerprint,
          boundaries: I.before
        })
      });
      return Ue(b), h((x) => ({ ...x, shotBoundaries: v }), T.id), v;
    } catch (v) {
      return D(v.message || "Unable to undo the shot edit."), null;
    } finally {
      $.current = !1, z(!1);
    }
  }
  return { applySegmentHistoryState: H, applyPerformerSlotHistoryState: re, applyHistoryState: J, restoreHistoryTarget: te, updateTimelineRatio: G, updateTimelineRatioFromPointer: ne, handleSeparatorPointerDown: ce, handleSeparatorPointerMove: xe, handleSeparatorKeyDown: ke, panelWidthMaximum: Se, updatePanelWidth: Q, handlePanelSeparatorPointer: fe, panelSeparatorProps: ee, toggleSegmentRail: Z, toggleSegmentGroup: se, mutateShotBoundary: K, restoreShotBoundaries: ae };
}
function $c(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: h, mutateShotBoundary: y, openPublishApprovedDialog: w, playbackControlsRef: k, playbackShortcutConfig: F, saveSelectedReviewState: E, seekRef: $, segmentGroupKeys: B, selectSegment: S, selectedSegment: C, selectedSegmentGroupForSegment: A, selectedSegmentGroupKey: D, selectedSegments: z, setCollapsedSegmentGroups: ie, setIncorrectExamplesOpen: _, setQuickSearchOpen: T, setSaveMessage: P, setSelectedSegmentGroupKey: H, setTagEditing: re, setTimelineZoom: oe, shotBoundaries: J, slotButtonRef: te, splitSegment: G, swimlanes: ne, timelineDuration: ce, toggleIncorrectExample: xe, toggleSegmentGroup: ke, updateTimelineRatio: Se, videoFrameRate: Q, visibleSegments: fe } = e;
  function ee(K) {
    var ae, I;
    (ae = k.current) == null || ae.pause(), (I = k.current) == null || I.seekBy(Al(K, Q));
  }
  function Z(K, ae) {
    if (z.length > 1 && ml(K.id))
      return;
    let I = null;
    K.id === "video.playPause" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.toggle();
    }), K.id === "video.seekSmallBackward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-F.smallSeekTime);
    }), K.id === "video.seekSmallForward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(F.smallSeekTime);
    }), K.id === "video.seekMediumBackward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-F.mediumSeekTime);
    }), K.id === "video.seekMediumForward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(F.mediumSeekTime);
    }), K.id === "video.seekLongBackward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-F.longSeekTime);
    }), K.id === "video.seekLongForward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(F.longSeekTime);
    }), K.id === "video.playSelected" && C && (I = () => {
      var b;
      (b = $.current) == null || b.call($, C.startSec, !0), requestAnimationFrame(() => {
        var v;
        return (v = g.current) == null ? void 0 : v.focus({ preventScroll: !0 });
      });
    }), (K.id === "video.playPreviousSegment" || K.id === "video.playNextSegment") && (I = () => {
      var v;
      const b = eo(
        ne,
        C == null ? void 0 : C.id,
        K.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !b || b.id === (C == null ? void 0 : C.id) || (S(b, { focusEditor: !0, seekToSegment: !1 }), (v = $.current) == null || v.call($, b.startSec, !0));
    }), K.id.startsWith("video.seekPercent") && (I = () => {
      var v;
      const b = Number(K.id.slice(17)) / 10;
      (v = $.current) == null || v.call($, el(m ?? ce, b), !1);
    }), K.id === "video.jumpToSegmentStart" && C && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, C.startSec, !1);
    }), K.id === "video.jumpToSegmentEnd" && C && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, C.endSec ?? C.startSec, !1);
    }), K.id === "video.jumpToVideoStart" && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, 0, !1);
    }), K.id === "video.jumpToVideoEnd" && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, ce, !1);
    }), K.id.startsWith("video.frame") && (I = () => {
      const b = K.id.includes("Small") ? "small" : K.id.includes("Medium") ? "medium" : "long", v = F[`${b}FrameStep`] * (K.id.endsWith("Backward") ? -1 : 1);
      ee(v);
    }), K.id.startsWith("navigation.swimlane") && (I = () => {
      const b = K.id.slice(19).toLowerCase(), v = eo(ne, C == null ? void 0 : C.id, b, s);
      v && S(v, { focusEditor: !0, seekToSegment: !1 });
    }), (K.id === "navigation.extendSwimlaneLeft" || K.id === "navigation.extendSwimlaneRight") && (I = () => {
      const b = $d(
        t,
        C == null ? void 0 : C.id,
        K.id.endsWith("Left") ? "left" : "right"
      );
      b && S(b.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: b.segmentIds
      });
    }), (K.id === "navigation.segmentGroupUp" || K.id === "navigation.segmentGroupDown") && (I = () => {
      const b = Td(
        B,
        D ?? A,
        K.id.endsWith("Up") ? -1 : 1
      );
      b && H(b);
    }), (K.id === "navigation.previousAtPlayhead" || K.id === "navigation.nextAtPlayhead") && (I = () => {
      const b = Bs(fe, s, K.id === "navigation.previousAtPlayhead" ? -1 : 1, C == null ? void 0 : C.id);
      b && S(b, { focusEditor: !0, seekToSegment: !1 });
    }), K.id === "navigation.nearestInCurrentSwimlane" && (I = () => {
      const b = Ts(
        ne,
        C == null ? void 0 : C.id,
        s
      );
      b && S(b, { focusEditor: !0, seekToSegment: !1 });
    }), K.id.includes("Unreviewed") && (I = () => {
      const b = gr(
        ne,
        C == null ? void 0 : C.id,
        K.id.startsWith("navigation.previous") ? -1 : 1,
        K.id.endsWith("Global")
      );
      b && S(b, { focusEditor: !ae.preserveFocus, seekToSegment: !1 });
    }), (K.id === "navigation.nextTouchingPlayhead" || K.id === "navigation.previousTouchingPlayhead") && (I = () => {
      const b = $s(ne, s, K.id === "navigation.previousTouchingPlayhead" ? -1 : 1, C == null ? void 0 : C.id);
      b && S(b, { focusEditor: !0, seekToSegment: !1 });
    }), K.id === "navigation.quickSearch" && (I = () => T(!0)), (K.id === "navigation.previousShot" || K.id === "navigation.nextShot") && (I = () => {
      var v;
      const b = Tl(J, s, K.id === "navigation.previousShot" ? -1 : 1);
      b && ((v = $.current) == null || v.call($, b.startSec, !1));
    }), K.id === "shot.split" && (I = () => y("split")), K.id === "shot.merge" && (I = () => y("merge")), K.id === "marker.create" && (I = () => a()), K.id === "marker.duplicate" && (I = () => d(!1)), K.id === "marker.duplicateAtPlayhead" && (I = () => d(!0)), K.id === "marker.split" && (I = () => G()), K.id === "marker.editTag" && (I = () => {
      var b;
      if (z.length > 1 && z.some((v) => v.isDerived)) {
        P("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((b = f.data) != null && b.tagReadOnly) {
        P("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      re(!0);
    }), K.id === "marker.setStart" && C && (I = () => r(s, C.endSec)), K.id === "marker.setEnd" && C && (I = () => r(C.startSec, s)), K.id === "marker.copyTiming" && C && (I = () => {
      P(qd(C) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), K.id === "marker.pasteTiming" && C && (I = () => {
      const b = _d();
      if (!b) {
        P("No copied segment timing is available.");
        return;
      }
      r(b.startSec, b.endSec);
    }), K.id === "marker.mergeSelection" && (I = () => p()), K.id === "marker.moveToBin" && (I = () => h()), K.id === "marker.toggleIncorrectExample" && C && (I = () => xe()), K.id === "marker.openIncorrectExamples" && (I = () => _(!0)), K.id === "markerGroup.toggleCollapse" && D && (I = () => ke(D)), K.id === "markerGroup.toggleAll" && (I = () => ie((b) => Cd(b, B))), K.id === "marker.assignSlots" && (I = () => {
      var b;
      return (b = te.current) == null ? void 0 : b.click();
    }), K.id === "navigation.zoomIn" && (I = () => oe((b) => pr(b + 0.5))), K.id === "navigation.zoomOut" && (I = () => oe((b) => pr(b - 0.5))), K.id === "navigation.resetZoom" && (I = () => oe(1)), K.id === "navigation.centerPlayhead" && (I = () => {
      var b;
      return (b = o.current) == null ? void 0 : b.call(o);
    }), K.id === "layout.growSwimlanes" && (I = () => Se(c.timelineRatio + 0.05)), K.id === "layout.shrinkSwimlanes" && (I = () => Se(c.timelineRatio - 0.05)), K.id === "marker.confirm" && C && (I = () => E("approved")), K.id === "system.publishApproved" && (I = () => w(ae.target)), K.id === "marker.reject" && C && (I = () => E("rejected")), K.id === "system.emptyBin" && (I = () => u()), K.id === "system.deleteRejected" && (I = () => l()), I && I();
  }
  function se(K, ae) {
    const I = Vn.find((b) => b.id === K);
    I && $n(I, i) && Z(I, ae);
  }
  return {
    executeShortcutById: se,
    stepVideoFrame: (K) => ee(K < 0 ? -1 : 1)
  };
}
function wa(e) {
  return e === !0;
}
function Na() {
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
function Tc(e, t, r = !1, o = 0, i = "") {
  const [a, s] = j(null), [l, d] = j(null), [c, g] = j(""), [u, f] = j({
    busy: !1,
    reviewState: null,
    error: ""
  }), m = pe(null);
  async function p(w) {
    f({ busy: !0, reviewState: w, error: "" });
    try {
      await X(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: Xr(), reviewState: w })
      }), await t(), f({ busy: !1, reviewState: null, error: "" });
    } catch (k) {
      f({
        busy: !1,
        reviewState: null,
        error: k.message || "Unable to import Cove segments."
      });
    }
  }
  async function h(w) {
    try {
      const k = await X(`/videos/${e}/analysis-runs`, {
        signal: w.signal
      });
      if (!w.isActive()) return null;
      const F = (k == null ? void 0 : k[0]) || null;
      return s(F), (F == null ? void 0 : F.status) === "completed" && m.current !== F.id && (m.current = F.id, await t()), ((F == null ? void 0 : F.status) === "failed" || (F == null ? void 0 : F.status) === "cancelled") && g(F.errorMessage || "Video analysis did not complete."), F;
    } catch (k) {
      return w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(w = null) {
    g("");
    const k = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), F = k.includes("omnishotcut") && o > 0;
    if (!(F && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const E = await X(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: k,
            replaceShotBoundaries: F,
            expectedShotBoundaryFingerprint: F ? i : null
          })
        });
        s(E);
      } catch (E) {
        g(E.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!wa(r)) {
      s(null), d(null), g("");
      return;
    }
    const w = Na();
    return h(w), X("/analysis/status", { signal: w.signal }).then((k) => {
      w.isActive() && (d(k), k.configured || g(""));
    }).catch((k) => {
      w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to check video analysis readiness.");
    }), w.dispose;
  }, [e, r]), ye(() => {
    if (!wa(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = Na();
    let k = setTimeout(async function F() {
      await h(w), w.isActive() && (k = setTimeout(F, 2500));
    }, 2500);
    return () => {
      clearTimeout(k), w.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: u,
    startFullAnalysis: y
  };
}
const Un = Object.freeze([]);
function Ac(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Rc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Fo, jo, Bo, Go, Uo;
  const [g, u] = j(null), [f, m] = j([]), p = pe(null), h = pe(null), y = pe([]), w = pe(null), [k, F] = j(() => xt({})), [E, $] = j(!1), [B, S] = j(tl), [C, A] = j(0), D = pe(null), [z] = j(() => ol({
    getContext: () => D.current,
    drainAfterSettle: !1
  })), ie = Vl(z.subscribe, z.getSnapshot), _ = Jr(ie), T = (L, le) => z.acquire({ kind: L, lockId: le }), P = (L) => z.enqueue(L), H = z.getSnapshot, [re, oe] = Wl(cl, []), [J, te] = j(!1), [G, ne] = j(""), [ce, xe] = j(""), [ke, Se] = j(""), [Q, fe] = j(1), [ee, Z] = j(Ud), [se, K] = j(0), [ae, I] = j({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [b, v] = j(Bt), x = pe(Bt), [N, M] = j(!1), [Y, U] = j(!1), [ue, R] = j(!1), W = pe(!1);
  W.current = ue;
  const [q, ge] = j(null), [Ie, Ce] = j(null), [he, at] = j(!1), [Ze, De] = j(null), [Ke, Ve] = j(null), He = pe(null), [V, de] = j(!1), [Me, Be] = j(""), we = pe(null), _e = pe(null), Ye = pe(!1), [Ne, be] = j(Kd), [We, Pe] = j(null), [Ae, Xe] = j(!1), [Ge, Oe] = j(!1), [Ee, ze] = j(!1), [Pt, Le] = j(!1), [St, An] = j(!1), [dt, $e] = j(""), {
    analysisError: Te,
    analysisRun: Je,
    analysisStatus: bt,
    importNativeSegments: st,
    nativeImportState: Ut,
    startFullAnalysis: pt
  } = Tc(
    e.video.id,
    o,
    l,
    ((Fo = e.shotBoundaries) == null ? void 0 : Fo.length) || 0,
    Kn(e.shotBoundaries || [])
  ), [ot, Ot] = j(!1), [Rn, nn] = j(null), [Tt, qt] = j(l), [rn, kr] = j(0), [on, wr] = j(!1), [kt, Wt] = j(""), [Yn, Vt] = j(null), Mn = pe(null), Qn = pe(null), an = pe(!1), [Kt, sn] = j([]), [Zn, Nr] = j(!1), [Xn, Ir] = j(null), ln = Bd(), dn = pe(null), En = pe(null), cn = pe(null), Cr = pe(s), er = pe(null), un = pe(null), Jt = pe(null), mn = pe(null), Dn = pe(null), ct = pe(null), tr = pe(null), Pn = pe(null), At = pe(null), nr = pe(null), gn = pe(null), pn = pe(null), $r = pe(-1e12), Tr = pe(null), Ar = pe(!1), fn = pe(null), [On, yn] = j({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!ot || on || !kt) return;
    const L = requestAnimationFrame(() => {
      var le;
      return (le = Qn.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(L);
  }, [ot, on, kt]), ye(() => {
    if (!an.current || ot || Tt) return;
    const L = requestAnimationFrame(() => {
      var le;
      (le = Mn.current) == null || le.focus({ preventScroll: !0 }), an.current = !1;
    });
    return () => cancelAnimationFrame(L);
  }, [ot, Tt]);
  const et = e.video, lt = e.segments || Un, it = qe(() => JSON.stringify({
    segments: lt.map((L) => [
      L.id,
      L.itemId,
      L.nativeSegmentId,
      L.tagId,
      L.startSec,
      L.endSec,
      L.reviewState,
      L.published,
      L.sourceKey,
      L.sourceRunId,
      L.confidence,
      L.revision,
      L.updatedAt
    ]),
    performerSlots: (e.performerSlots || Un).map((L) => [
      L.segmentId,
      L.slotDefinitionId,
      L.performerId,
      L.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [lt, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      nn(null), qt(!1);
      return;
    }
    if (_ != null) {
      qt(!0);
      return;
    }
    let L = !0;
    qt(!0);
    const le = setTimeout(() => {
      X(`/videos/${et.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Fe) => {
        L && (nn(Fe), Wt(""));
      }).catch((Fe) => {
        L && (nn(null), Wt(Fe.message || "Unable to preview derived segments."));
      }).finally(() => {
        L && qt(!1);
      });
    }, 150);
    return () => {
      L = !1, clearTimeout(le);
    };
  }, [l, et.id, it, rn, _]);
  const rr = () => kr((L) => L + 1), wt = e.segmentGroups || Un, ht = e.performerSlots || Un, or = l && e.performerSlotsAvailable !== !1, Lt = qe(
    () => (e.performerCandidates || []).filter((L) => L.isVideoPerformer),
    [e.performerCandidates]
  ), Ln = e.shotBoundaries || Un, bn = qe(
    () => Si(ht),
    [ht]
  ), Fn = qe(
    () => lt.map((L) => {
      const le = bn.get(L.id) || [];
      return {
        ...L,
        slots: le,
        assignment: le.every((Fe) => Fe.performerId == null) ? Ul(le, Lt) : null
      };
    }).filter((L) => L.slots.length > 0 && L.assignment != null),
    [lt, bn, Lt]
  ), jn = Number((jo = et.videoFile) == null ? void 0 : jo.frameRate) > 0 ? Number(et.videoFile.frameRate) : 30;
  function hn() {
    const L = W.current;
    R(!1), L && requestAnimationFrame(() => {
      var le;
      return (le = ct.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
  }
  function Rt() {
    _ == null && (pn.current = null, at(!1), ne(""), requestAnimationFrame(() => {
      var L;
      return (L = ct.current) == null ? void 0 : L.focus({ preventScroll: !0 });
    }));
  }
  function Yt() {
    $(!1), requestAnimationFrame(() => {
      var L, le;
      (L = Pn.current) != null && L.isConnected ? Pn.current.focus({ preventScroll: !0 }) : (le = ct.current) == null || le.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    gn.current === g ? (gn.current = null, R(!0)) : R(!1);
  }, [g]), ye(() => {
    var le;
    if (!ue) return;
    const L = (le = nr.current) == null ? void 0 : le.querySelector("input");
    document.activeElement !== L && (L == null || L.focus({ preventScroll: !0 }), L == null || L.select());
  }, [ue, g]), ye(() => {
    var le;
    if (ue) return;
    const L = (le = ct.current) == null ? void 0 : le.ownerDocument;
    L && L.activeElement === L.body && ct.current.focus({ preventScroll: !0 });
  }, [ue]), ye(() => {
    var Fe, nt, Nt;
    const L = Xt(
      Br(
        e.segments,
        e.performerSlots || [],
        xt({}),
        l && B,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), le = ((Fe = e.segments.find((wn) => wn.id === s)) == null ? void 0 : Fe.id) ?? ((nt = qa(L)) == null ? void 0 : nt.id) ?? null;
    u(le), m(le == null ? [] : [le]), h.current = le, y.current = [], Pe(It(L, le)), F(xt({})), $(!1), pn.current = null, at(!1), Ce(null), fe(1), ne(""), v(Bt), x.current = Bt, M(!1), (Nt = ct.current) == null || Nt.focus({ preventScroll: !0 });
  }, [et.id, s]), ye(() => {
    const L = new AbortController();
    return X(`/videos/${et.id}/incorrect-examples`, { signal: L.signal }).then(sn).catch((le) => {
      le.name !== "AbortError" && sn([]);
    }), () => L.abort();
  }, [et.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const L = new AbortController();
    return X(`/videos/${et.id}/history`, { signal: L.signal }).then((le) => {
      const Fe = le || Bt;
      x.current = Fe, v(Fe);
    }).catch((le) => {
      le.name !== "AbortError" && ne(le.message || "Unable to load editor history.");
    }), () => L.abort();
  }, [et.id]), ye(() => {
    Hd(ee);
  }, [ee.timelineRatio, ee.markerRailOpen, ee.detailWidth, ee.markerRailWidth, ee.swimlaneTitleWidth]), ye(() => {
    zd(Ne);
  }, [Ne]), ye(() => {
    nl(B);
  }, [B]), ye(() => {
    const L = un.current;
    if (!a || !L || typeof ResizeObserver > "u") return;
    const le = () => {
      var Nt;
      const nt = Math.max(0, L.clientHeight - (((Nt = Jt.current) == null ? void 0 : Nt.offsetHeight) || 0));
      K(nt), Z((wn) => {
        const Ko = lo(wn.timelineRatio, nt);
        return Ko === wn.timelineRatio ? wn : { ...wn, timelineRatio: Ko };
      });
    }, Fe = new ResizeObserver(le);
    return Fe.observe(L), Jt.current && Fe.observe(Jt.current), le(), () => Fe.disconnect();
  }, [a]), ye(() => {
    if (!ln || typeof ResizeObserver > "u") return;
    const L = Dn.current, le = mn.current;
    if (!L || !le) return;
    const Fe = () => I({
      workspace: L.clientWidth,
      focusRow: le.clientWidth,
      focusRowHeight: le.clientHeight
    }), nt = new ResizeObserver(Fe);
    return nt.observe(L), nt.observe(le), Fe(), () => nt.disconnect();
  }, [ln, ee.markerRailOpen]);
  const Mt = qe(
    () => ti(Il(lt, Ie), re),
    [lt, Ie, re]
  );
  ql(() => {
    ni(re, e) !== re && oe({ type: "prune", detail: e });
  }, [e, re]);
  const Ft = qe(
    () => pa(
      Br(
        Mt,
        ht,
        k,
        l && B,
        wt
      ),
      Kt,
      !0
    ),
    [
      Mt,
      ht,
      k,
      B,
      wt,
      l,
      Kt
    ]
  ), Rr = Object.fromEntries(mt.map((L) => [L, Ft.filter((le) => le.reviewState === L).length])), Mr = pa(
    Br(
      Mt,
      ht,
      { ...k, reviewStates: mt },
      l && B,
      wt
    ),
    Kt,
    !0
  ), Er = Object.fromEntries(mt.map((L) => [L, Mr.filter((le) => le.reviewState === L).length])), vn = [...new Set(Mt.map((L) => L.sourceKey).filter(Boolean))].sort((L, le) => $t(L).localeCompare($t(le))), xn = zs(
    k,
    l && B
  ), O = qe(
    () => Xt(Ft, wt, ht),
    [Ft, wt, ht]
  ), ve = qs(
    O,
    g,
    s
  ), me = ve == null ? null : lt.find((L) => L.id === ve.id) || ve, tt = Yo(lt, Yo(Ft, f).map((L) => L.id)), jt = !l && tt.length > 0 && tt.every((L) => L.nativeSegmentId != null), Et = Ft.map((L) => L.id), Dr = Et.join("|");
  p.current = (me == null ? void 0 : me.id) ?? null;
  const So = bn.get(me == null ? void 0 : me.id) || [], Ei = bo(So), ko = qe(
    () => wd(O, f),
    [O, f]
  ), Pr = qe(() => ho(O), [O]), Bn = qe(
    () => Sd(Pr, Ne),
    [Pr, Ne]
  ), Di = qe(
    () => ki(
      Bn.rows,
      On.scrollTop,
      On.height
    ),
    [Bn, On]
  ), Or = qe(
    () => Id(O, Ne),
    [O, Ne]
  ), Pi = gr(Or, me == null ? void 0 : me.id, -1, !0) != null, Oi = gr(Or, me == null ? void 0 : me.id, 1, !0) != null, Sn = me ? It(O, me.id) : null, Lr = wt.length > 0 ? Pr.map((L) => L.key) : [], Li = Lr.join("|"), ar = Math.max(
    0,
    Number((Bo = et.videoFile) == null ? void 0 : Bo.duration) || 0,
    ...Mt.map((L) => Number(L.endSec ?? L.startSec) || 0)
  ), wo = Number((Go = et.videoFile) == null ? void 0 : Go.duration) > 0 ? Number(et.videoFile.duration) : null;
  b.actions;
  const Fi = ii();
  ye(() => {
    const L = g === fr ? g : (me == null ? void 0 : me.id) ?? null;
    L !== g && u(L);
  }, [me, g]), ye(() => {
    m((L) => {
      const le = Ys(
        L,
        Et,
        (me == null ? void 0 : me.id) ?? null
      );
      return le.length === L.length && le.every((Fe, nt) => Fe === L[nt]) ? L : le;
    });
  }, [Dr, me == null ? void 0 : me.id]);
  const kn = (me == null ? void 0 : me.itemId) == null ? null : ((Uo = e.itemMetadata) == null ? void 0 : Uo[me.itemId]) || null, ji = {
    key: (me == null ? void 0 : me.itemId) != null ? `item:${me.itemId}` : (me == null ? void 0 : me.nativeSegmentId) != null ? `native:${me.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (kn == null ? void 0 : kn.provenance) || (me == null ? void 0 : me.fieldProvenance) || [] : []
  }, Fr = (me == null ? void 0 : me.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (kn == null ? void 0 : kn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    xe(ve == null ? "" : String(ve.startSec)), Se((ve == null ? void 0 : ve.endSec) == null ? "" : String(ve.endSec));
  }, [ve == null ? void 0 : ve.id, ve == null ? void 0 : ve.startSec, ve == null ? void 0 : ve.endSec]), ye(() => {
    Sn && be((L) => Ii(L, Sn));
  }, [et.id, s, Sn]), ye(() => {
    Pe((L) => Ad(Lr, L, Sn));
  }, [et.id, Li, Sn]), ye(() => {
    if (!ee.markerRailOpen || (me == null ? void 0 : me.id) == null) return;
    const L = fn.current, le = Bn.rows.find((Nt) => Nt.kind === "segment" && Nt.segment.id === me.id);
    if (!L || !le) return;
    const Fe = le.top + le.height;
    let nt = L.scrollTop;
    le.top < L.scrollTop ? nt = le.top : Fe > L.scrollTop + L.clientHeight && (nt = Math.max(0, Fe - L.clientHeight)), nt !== L.scrollTop && (L.scrollTop = nt), yn({ scrollTop: nt, height: L.clientHeight });
  }, [me == null ? void 0 : me.id, Bn, ee.markerRailOpen]), ye(() => {
    const L = fn.current;
    if (!ee.markerRailOpen || !L) return;
    const le = () => yn({
      scrollTop: L.scrollTop,
      height: L.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      le();
      return;
    }
    const Fe = new ResizeObserver(le);
    return Fe.observe(L), le(), () => Fe.disconnect();
  }, [ee.markerRailOpen]);
  const { revealSegmentGroupForSelection: No, replaceSegmentSelection: Bi, selectSegment: Io, selectSegmentCollection: Gi, selectAllVideoSegments: Ui } = wc({
    allSwimlanes: O,
    editorRef: ct,
    performerSlots: ht,
    seekRef: dn,
    segmentGroups: wt,
    segments: lt,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setCollapsedSegmentGroups: be,
    setEditorFilters: F,
    setHideDerivedSegments: S,
    setSaveMessage: ne,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: jr, recordHistoryAction: ir, mutateSegment: Ki, completeReview: zi, createSegment: Co, splitSegment: $o, duplicateSegment: To, saveTiming: Hi, applyShortcutTiming: _i } = jd({
    compatibilityMode: l,
    currentTime: C,
    detail: e,
    editorFilters: k,
    endInput: ke,
    hideDerivedSegments: B,
    historyRef: x,
    mediaDuration: wo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: $r,
    pendingDuplicateRef: Tr,
    pendingFirstSegmentStartSecRef: pn,
    pendingTagEditSegmentIdRef: gn,
    heldCreatedSegmentTag: Ie,
    setHeldCreatedSegmentTag: Ce,
    replaceSegmentSelection: Bi,
    savingSegmentId: _,
    segments: lt,
    selectedSegment: me,
    selectedSegmentIdRef: p,
    selectedSegments: tt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setCreatingSegmentId: ge,
    setEditorFilters: F,
    setFirstSegmentTagOpen: at,
    setHideDerivedSegments: S,
    setHistory: v,
    setHistoryOpen: M,
    setPublishApprovedError: Be,
    setSaveMessage: ne,
    acquireSaveLock: T,
    dispatchPendingChanges: oe,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: R,
    startInput: ce,
    tagEditingRef: W,
    timelineDuration: ar,
    video: et
  });
  function Ao(L = null) {
    var nt;
    if (!l || _ != null || !lt.some((Nt) => !Nt.published && Nt.reviewState === "approved")) return;
    const le = ((nt = ct.current) == null ? void 0 : nt.ownerDocument) ?? document, Fe = le.activeElement === le.body ? null : le.activeElement;
    _e.current = L != null && L.isConnected && L !== le.body ? L : Fe, Be(""), de(!0);
  }
  function Ro() {
    _ == null && (de(!1), Be(""), requestAnimationFrame(() => {
      Ac(
        _e.current,
        ct.current
      ), _e.current = null;
    }));
  }
  async function qi() {
    await zi() && Ro();
  }
  const { closeMergeConfirmation: Wi, mergeSelectedSwimlane: Mo, saveSelectedReviewState: Vi } = Nc({
    acceptHistory: jr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    getSaveQueueSnapshot: H,
    historyRef: x,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    recordHistoryAction: ir,
    revealSegmentGroupForSelection: No,
    savingSegmentId: _,
    selectedGroups: ko,
    selectedSegment: me,
    selectedSegmentIdRef: p,
    selectedSegments: tt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: De,
    setSaveMessage: ne,
    acquireSaveLock: T,
    dispatchPendingChanges: oe,
    enqueueSave: P,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: et
  }), Ji = (L) => {
    const le = (L || []).map(co);
    z.cancel((Fe) => Fe.kind === "review" && Za(Fe.targets, le));
  };
  D.current = { detail: e, segments: lt, onConflict: r, onDetailChange: t, onReload: o }, ye(() => {
    z.poke();
  });
  const { toggleIncorrectExample: Yi, removeIncorrectExample: Qi, captureTrainingExport: Zi, deleteRejectedSegments: Eo, autoAssignPerformers: Xi, previewDerivedSegments: es, closeMaterializeDialog: ts, materializeDerivedSegments: ns, saveTag: rs, applyHeldCreatedSegmentTag: os, moveToBin: as, emptyRecyclingBin: is } = Ic({
    acceptHistory: jr,
    allSwimlanes: O,
    autoAssignCandidates: Fn,
    autoAssigning: St,
    binEmptyingRef: Ye,
    canMoveSelectionToBin: jt,
    closeTagEditing: hn,
    compatibilityMode: l,
    creatingSegmentId: q,
    detail: e,
    editorFilters: k,
    editorRef: ct,
    exportingExamples: Zn,
    hideDerivedSegments: B,
    incorrectExamples: Kt,
    lineage: Fr,
    materializeButtonRef: Mn,
    materializePreview: Rn,
    materializeRestoreFocusRef: an,
    materializing: on,
    mutateSegment: Ki,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: ht,
    heldCreatedSegmentTag: Ie,
    setHeldCreatedSegmentTag: Ce,
    recordHistoryAction: ir,
    refreshMaterializationPreview: rr,
    removingExampleId: Xn,
    revealSegmentGroupForSelection: No,
    savingSegmentId: _,
    segmentGroups: wt,
    segments: lt,
    selectedSegment: me,
    selectedSegmentIdRef: p,
    selectedSegments: tt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: $e,
    setAutoAssignOpen: Le,
    setAutoAssigning: An,
    setEditorFilters: F,
    setExportingExamples: Nr,
    setHideDerivedSegments: S,
    setIncorrectExamples: sn,
    setMaterializeError: Wt,
    setMaterializeLoading: qt,
    setMaterializeOpen: Ot,
    setMaterializePreview: nn,
    setMaterializing: wr,
    setRemovingExampleId: Ir,
    setRejectedDeletionPreview: Ve,
    setSaveMessage: ne,
    acquireSaveLock: T,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: et
  });
  ye(() => {
    const L = Ie, le = Cl(L, {
      segments: lt,
      savingSegmentId: Jr(z.getSnapshot()),
      reviewSaving: Qo(z.getSnapshot(), "review"),
      tagEditing: ue,
      selectedSegmentIds: f,
      activeSegmentId: me == null ? void 0 : me.id
    });
    le === "none" || le === "wait" || (Ce(null), le === "apply" && os(L));
  }, [Ie, lt, _, me == null ? void 0 : me.id, f, ue]);
  const { restoreHistoryTarget: ss, updateTimelineRatio: Do, handleSeparatorPointerDown: ls, handleSeparatorPointerMove: ds, handleSeparatorKeyDown: cs, panelWidthMaximum: Po, panelSeparatorProps: us, toggleSegmentRail: ms, toggleSegmentGroup: Oo, mutateShotBoundary: gs } = Cc({
    acceptHistory: jr,
    compatibilityMode: l,
    currentTime: C,
    detail: e,
    editorLayout: ee,
    focusRowRef: mn,
    history: b,
    historyRef: x,
    historySaving: Y,
    horizontalLayoutSize: ae,
    mediaStackHeight: se,
    mediaStackRef: un,
    commonActionsRef: Jt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: tr,
    recordHistoryAction: ir,
    savingSegmentId: _,
    savingShot: J,
    savingShotRef: Ar,
    setCollapsedSegmentGroups: be,
    setEditorLayout: Z,
    setHistorySaving: U,
    setIncorrectExamples: sn,
    setSaveMessage: ne,
    acquireSaveLock: T,
    setSavingShot: te,
    shotBoundaries: Ln,
    timelineDuration: ar,
    video: et,
    workspaceRef: Dn
  }), { executeShortcutById: Lo, stepVideoFrame: ps } = $c({
    allSwimlanes: O,
    applyShortcutTiming: _i,
    centerTimelineRef: er,
    compatibilityMode: l,
    createSegment: Co,
    currentTime: C,
    deleteRejectedSegments: Eo,
    duplicateSegment: To,
    editorLayout: ee,
    editorRef: ct,
    emptyRecyclingBin: is,
    lineage: Fr,
    mediaDuration: wo,
    mergeSelectedSwimlane: Mo,
    moveToBin: as,
    mutateShotBoundary: gs,
    openPublishApprovedDialog: Ao,
    playbackControlsRef: En,
    playbackShortcutConfig: Fi,
    saveSelectedReviewState: Vi,
    seekRef: dn,
    segmentGroupKeys: Lr,
    selectSegment: Io,
    selectedSegment: me,
    selectedSegmentGroupForSegment: Sn,
    selectedSegmentGroupKey: We,
    selectedSegments: tt,
    setCollapsedSegmentGroups: be,
    setIncorrectExamplesOpen: ze,
    setQuickSearchOpen: Oe,
    setSaveMessage: ne,
    setSelectedSegmentGroupKey: Pe,
    setTagEditing: R,
    setTimelineZoom: fe,
    shotBoundaries: Ln,
    slotButtonRef: At,
    splitSegment: $o,
    swimlanes: Or,
    timelineDuration: ar,
    toggleIncorrectExample: Yi,
    toggleSegmentGroup: Oo,
    updateTimelineRatio: Do,
    videoFrameRate: jn,
    visibleSegments: Ft
  });
  cn.current = Lo;
  const fs = qe(() => Vn.map((L) => ({
    id: L.id,
    enabled: $n(L, l),
    surface: "local",
    action: (le) => {
      var Fe;
      return (Fe = cn.current) == null ? void 0 : Fe.call(cn, L.id, le);
    }
  })), [l]);
  Pa(ao, fs);
  const ys = so(se), bs = Zt(ee.markerRailWidth, Po("markerRailWidth")), hs = Zt(ee.detailWidth, Po("detailWidth"));
  return n(kc, {
    activeFilterCount: xn,
    allSwimlanes: O,
    analysisError: Te,
    analysisRun: Je,
    analysisStatus: bt,
    approvalFacetCounts: Er,
    autoAssignCandidates: Fn,
    autoAssignError: dt,
    autoAssignOpen: Pt,
    autoAssignPerformers: Xi,
    autoAssigning: St,
    canMoveSelectionToBin: jt,
    captureTrainingExport: Zi,
    cancelQueuedReviewsForSegments: Ji,
    removeIncorrectExample: Qi,
    rejectedDeletionPreview: Ke,
    centerTimelineRef: er,
    closeEditorFilters: Yt,
    closeFirstSegmentTagDialog: Rt,
    closeMaterializeDialog: ts,
    closeMergeConfirmation: Wi,
    closePublishApprovedDialog: Ro,
    closeTagEditing: hn,
    collapsedSegmentGroups: Ne,
    commonActionsRef: Jt,
    compatibilityMode: l,
    configuringTag: Yn,
    createSegment: Co,
    currentTime: C,
    deleteRejectedSegments: Eo,
    detail: e,
    detailPanelRef: w,
    detailWidth: hs,
    duplicateSegment: To,
    editorFilters: k,
    editorLayout: ee,
    editorRef: ct,
    exportingExamples: Zn,
    filtersButtonRef: Pn,
    filtersOpen: E,
    firstSegmentTagOpen: he,
    focusRowRef: mn,
    handleSeparatorKeyDown: cs,
    handleSeparatorPointerDown: ls,
    handleSeparatorPointerMove: ds,
    hideDerivedSegments: B,
    history: b,
    historyOpen: N,
    historySaving: Y,
    hasNextUnreviewed: Oi,
    hasPreviousUnreviewed: Pi,
    horizontalLayoutSize: ae,
    importNativeSegments: st,
    incorrectExamples: Kt,
    incorrectExamplesOpen: Ee,
    removingExampleId: Xn,
    lineage: Fr,
    markerRailWidth: bs,
    materializeButtonRef: Mn,
    materializeCancelButtonRef: Qn,
    materializeDerivedSegments: ns,
    materializeError: kt,
    materializeLoading: Tt,
    materializeOpen: ot,
    materializePreview: Rn,
    materializing: on,
    mediaStackRef: un,
    mergeCancelButtonRef: He,
    mergeConfirmation: Ze,
    mergeSaving: Qo(ie, "merge"),
    mergeSelectedSwimlane: Mo,
    nativeImportState: Ut,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Ao,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: us,
    pendingInitialSeekRef: Cr,
    performerSlots: ht,
    performerSlotsAvailable: or,
    playbackControlsRef: En,
    previewDerivedSegments: es,
    provenance: ji,
    provenanceSources: vn,
    publishApprovedCancelButtonRef: we,
    publishApprovedDrafts: qi,
    publishApprovedError: Me,
    publishApprovedOpen: V,
    quickSearchOpen: Ge,
    railScrollRef: fn,
    railToggleRef: tr,
    recordHistoryAction: ir,
    restoreHistoryTarget: ss,
    runEditorAction: Lo,
    stepVideoFrame: ps,
    saveMessage: G,
    setSaveMessage: ne,
    saveTag: rs,
    saveTiming: Hi,
    savingSegmentId: _,
    acquireSaveLock: T,
    seekRef: dn,
    segmentGroups: wt,
    segmentRailLayout: Bn,
    segments: Mt,
    selectAllVideoSegments: Ui,
    selectSegment: Io,
    selectSegmentCollection: Gi,
    selectedGroups: ko,
    selectedPerformerSlots: So,
    selectedSegment: ve,
    selectedSegmentGroupKey: We,
    selectedSegmentIds: f,
    selectedSegments: tt,
    selectedSlotStatus: Ei,
    setAutoAssignError: $e,
    setAutoAssignOpen: Le,
    setConfiguringTag: Vt,
    setCurrentTime: A,
    setEditorFilters: F,
    setEditorLayout: Z,
    setFiltersOpen: $,
    setHideDerivedSegments: S,
    setHistoryOpen: M,
    setIncorrectExamplesOpen: ze,
    setQuickSearchOpen: Oe,
    setRejectedDeletionPreview: Ve,
    setRailViewport: yn,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setShortcutsOpen: Xe,
    setTimelineZoom: fe,
    shotBoundaries: Ln,
    shortcutsOpen: Ae,
    slotButtonRef: At,
    splitLayout: a,
    splitSegment: $o,
    startFullAnalysis: pt,
    tagEditing: ue,
    creatingSegmentId: q,
    tagSearchRef: nr,
    timelineDuration: ar,
    timelineRatioBounds: ys,
    timelineZoom: Q,
    toggleSegmentGroup: Oo,
    toggleSegmentRail: ms,
    updateTimelineRatio: Do,
    video: et,
    videoPerformers: Lt,
    visibleCounts: Rr,
    visibleSegmentRailRows: Di,
    visibleSegments: Ft,
    wideLayout: ln,
    workspaceRef: Dn
  });
}
const Mc = /* @__PURE__ */ new Set(["queued", "running"]);
async function Ia(e, t, r = 4) {
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
function Ca(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Ec() {
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
async function Dc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((m) => Number.isInteger(m) && m > 0))], a = [...new Set(t)].filter((m) => ["aiTagging", "omnishotcut"].includes(m));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await Ia(i, async (m) => {
    try {
      const [p, h] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((w) => Mc.has(w == null ? void 0 : w.status)))
        throw new Error("A Full Scan is already queued or running.");
      const y = (h == null ? void 0 : h.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: y };
    } catch (p) {
      return Ca(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await Ia(d, async ({ videoId: m, shotBoundaries: p }) => {
    const h = s && p.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: h,
          expectedShotBoundaryFingerprint: h ? Kn(p) : null
        })
      }), { videoId: m };
    } catch (y) {
      return Ca(m, y);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Pc(e = [], t = []) {
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
function Oc(e = [], t = "", r = "all") {
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
function ut(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Lc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, h) => (p.sortOrder ?? 0) - (h.sortOrder ?? 0) || Number(p.id) - Number(h.id)).forEach((p, h) => {
    [...p.tags || []].sort((y, w) => (y.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(y.tagId) - Number(w.tagId)).forEach((y, w) => r.set(Number(y.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? h,
      tagSortOrder: y.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, h) {
    const y = Number(p);
    if (!o.has(y)) {
      const w = r.get(y);
      o.set(y, {
        tagId: y,
        name: h || `Tag ${y}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (w == null ? void 0 : w.key) || "ungrouped",
        segmentGroupId: (w == null ? void 0 : w.id) ?? null,
        segmentGroupName: (w == null ? void 0 : w.name) || "Ungrouped",
        segmentGroupSortOrder: (w == null ? void 0 : w.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (w == null ? void 0 : w.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(y);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const h = i(p.sourceTagId, p.sourceTagName), y = i(p.derivedTagId, p.derivedTagName);
    h.outgoingRuleCount++, y.incomingRuleCount++;
    const w = `${h.tagId}:${y.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: h.tagId,
      derivedTagId: y.tagId,
      rules: [],
      edgeCount: 0
    });
    const k = a.get(w);
    k.rules.push(p), k.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var h, y;
    (h = d.get(p.sourceTagId)) == null || h.add(p.derivedTagId), (y = d.get(p.derivedTagId)) == null || y.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const h = [p.tagId], y = [];
    for (c.add(p.tagId); h.length > 0; ) {
      const S = h.shift();
      y.push(S);
      for (const C of d.get(S) || [])
        c.has(C) || (c.add(C), h.push(C));
    }
    const w = new Set(y), k = y.map((S) => o.get(S)), F = l.filter((S) => w.has(S.sourceTagId) && w.has(S.derivedTagId)), E = F.flatMap((S) => S.rules), $ = k.filter((S) => S.outgoingRuleCount === 0).sort((S, C) => ut(S.name, C.name)), B = $.length > 0 ? $ : [...k].sort((S, C) => ut(S.name, C.name));
    g.push({
      id: [...y].sort((S, C) => S - C).join(":"),
      label: B.length > 1 ? `${B[0].name} + ${B.length - 1}` : ((m = B[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: k,
      connections: F,
      rules: E,
      segmentGroupKeys: [...new Set(k.map((S) => S.segmentGroupKey))],
      materializedEdgeCount: E.reduce(
        (S, C) => S + (Number(C.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, h) => h.rules.length - p.rules.length || ut(p.label, h.label));
  const u = /* @__PURE__ */ new Map();
  s.forEach((p) => {
    u.has(p.segmentGroupKey) || u.set(p.segmentGroupKey, {
      key: p.segmentGroupKey,
      id: p.segmentGroupId,
      name: p.segmentGroupName,
      sortOrder: p.segmentGroupSortOrder,
      nodes: [],
      ruleIds: /* @__PURE__ */ new Set(),
      componentIds: /* @__PURE__ */ new Set()
    }), u.get(p.segmentGroupKey).nodes.push(p);
  }), g.forEach((p) => {
    p.nodes.forEach((h) => {
      var y;
      return (y = u.get(h.segmentGroupKey)) == null ? void 0 : y.componentIds.add(p.id);
    }), p.rules.forEach((h) => {
      var y, w;
      (y = u.get(o.get(Number(h.sourceTagId)).segmentGroupKey)) == null || y.ruleIds.add(h.id), (w = u.get(o.get(Number(h.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(h.id);
    });
  });
  const f = [...u.values()].sort((p, h) => p.sortOrder - h.sortOrder || ut(p.name, h.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: g,
    segmentGroups: f
  };
}
function Fc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const g = new Map(e.nodes.map((A) => [A.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((A) => [A.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((A) => {
    var D, z;
    (D = g.get(A.sourceTagId)) == null || D.add(A.derivedTagId), (z = u.get(A.derivedTagId)) == null || z.add(A.sourceTagId);
  });
  const f = new Map(e.nodes.map((A) => {
    var D;
    return [
      A.tagId,
      ((D = u.get(A.tagId)) == null ? void 0 : D.size) || 0
    ];
  })), m = new Map(e.nodes.map((A) => [A.tagId, 0])), p = e.nodes.filter((A) => f.get(A.tagId) === 0).sort((A, D) => ut(A.name, D.name)).map((A) => A.tagId), h = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const A = p.shift();
    if (!h.has(A)) {
      h.add(A);
      for (const D of g.get(A) || [])
        m.set(D, Math.max(m.get(D) || 0, (m.get(A) || 0) + 1)), f.set(D, f.get(D) - 1), f.get(D) === 0 && p.push(D);
    }
  }
  h.size !== e.nodes.length && e.nodes.filter((A) => !h.has(A.tagId)).sort((A, D) => ut(A.name, D.name)).forEach((A) => m.set(A.tagId, 0));
  const y = Math.max(0, ...m.values()), w = Math.max(
    t,
    240 + y * 296
  ), k = /* @__PURE__ */ new Map();
  e.nodes.forEach((A) => {
    k.has(A.segmentGroupKey) || k.set(A.segmentGroupKey, {
      key: A.segmentGroupKey,
      id: A.segmentGroupId,
      name: A.segmentGroupName,
      sortOrder: A.segmentGroupSortOrder,
      nodes: []
    }), k.get(A.segmentGroupKey).nodes.push(A);
  });
  const F = [...k.values()].sort((A, D) => A.sortOrder - D.sortOrder || ut(A.name, D.name));
  let E = 28;
  const $ = [], B = F.map((A) => {
    const D = /* @__PURE__ */ new Map();
    A.nodes.forEach((P) => {
      const H = m.get(P.tagId) || 0;
      D.has(H) || D.set(H, []), D.get(H).push(P);
    });
    for (const P of D.values())
      P.sort((H, re) => H.segmentGroupTagSortOrder - re.segmentGroupTagSortOrder || ut(H.name, re.name));
    const z = Math.max(1, ...[...D.values()].map((P) => P.length)), ie = z * 58 + (z - 1) * 18, _ = 70 + ie, T = {
      ...A,
      x: 12,
      y: E,
      width: w - 24,
      height: _
    };
    for (const [P, H] of D.entries()) {
      const re = H.length * 58 + Math.max(0, H.length - 1) * 18, oe = (ie - re) / 2;
      H.forEach((J, te) => $.push({
        ...J,
        rank: P,
        x: 28 + P * 296,
        y: E + 34 + 18 + oe + te * 76,
        width: 184,
        height: 58
      }));
    }
    return E += _ + 16, T;
  }), S = new Map($.map((A) => [A.tagId, A])), C = e.connections.map((A) => {
    const D = S.get(A.sourceTagId), z = S.get(A.derivedTagId), ie = D.x + D.width, _ = D.y + D.height / 2, T = z.x, P = z.y + z.height / 2, H = Math.max(48, (T - ie) * 0.48);
    return {
      ...A,
      path: `M ${ie} ${_} C ${ie + H} ${_}, ${T - H} ${P}, ${T} ${P}`
    };
  });
  return {
    width: w,
    height: Math.max(r, E - 16 + 28),
    nodes: $,
    connections: C,
    groups: B
  };
}
function jc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Fc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), g = 20, u = o, f = c.nodes.map((p) => ({
      ...p,
      x: p.x + g,
      y: p.y + u
    })), m = new Map(f.map((p) => [p.tagId, p]));
    a.push(...f), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + g,
      y: p.y + u
    }))), s.push(...c.connections.map((p) => {
      const h = m.get(p.sourceTagId), y = m.get(p.derivedTagId), w = h.x + h.width, k = h.y + h.height / 2, F = y.x, E = y.y + y.height / 2, $ = Math.max(48, (F - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${k} C ${w + $} ${k}, ${F - $} ${E}, ${F} ${E}`
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
function $a(e, t = []) {
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
function Bc(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Gc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: h, materializationOffer: y, materializeOutgoingRules: w, materializeRule: k, message: F, normalizedQuery: E, query: $, refreshConfiguredTag: B, revealEditor: S, rules: C, save: A, segmentGroupKey: D, selectedNode: z, selectedRule: ie, selection: _, setConfiguringTag: T, setDraft: P, setListSort: H, setMaterializationOffer: re, setQuery: oe, setSegmentGroupKey: J, setSelection: te, setView: G, sortedVisibleRules: ne, sourceSlots: ce, sourceSlotsLoading: xe, updateMapping: ke, updateTag: Se, view: Q, visibleComponents: fe, visibleRules: ee } = e;
  function Z(b) {
    const v = m.nodes.find((N) => N.tagId === Number(b.sourceTagId)), x = m.nodes.find((N) => N.tagId === Number(b.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function se() {
    return n("div", { key: "editor", ref: u, className: "space-y-4 p-4" }, [
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
          onClick: () => P(null),
          className: "rounded-md px-2 py-1 text-secondary hover:bg-muted/40 hover:text-foreground",
          "aria-label": "Close rule editor"
        }, "×")
      ]),
      n("div", { key: "tags", className: "space-y-3" }, [
        n("div", { key: "source", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Source tag (specific)"),
            n(Hn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (b, v) => Se("source", b, v == null ? void 0 : v.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !xe && ce.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (b) => T({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: b.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Hn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (b, v) => Se("derived", b, v == null ? void 0 : v.label),
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
              onClick: (b) => T({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: b.currentTarget
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
            disabled: r || ce.length === 0 || s.length === 0,
            onClick: () => P((b) => ({
              ...b,
              slotMappings: [...b.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((b, v) => n("div", { key: v, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: b.sourceSlotDefinitionId,
              disabled: r,
              onChange: (x) => ke(v, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ce.map((x) => n("option", { key: x.id, value: x.id }, gt(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: b.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => ke(v, "derivedSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((x) => n("option", { key: x.id, value: x.id }, gt(x)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => P((x) => ({
                ...x,
                slotMappings: x.slotMappings.filter((N, M) => M !== v)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((b) => !b.sourceSlotDefinitionId || !b.derivedSlotDefinitionId),
          onClick: A,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => P(null), className: o }, "Cancel")
      ])
    ]);
  }
  function K() {
    if (z) {
      const x = ee.filter((Y) => Number(Y.derivedTagId) === z.tagId), N = ee.filter((Y) => Number(Y.sourceTagId) === z.tagId), M = (Y, U, ue) => n("div", {
        key: Y.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, U),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${Y.sourceTagName} → ${Y.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ue ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => k(Y),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(Y, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(Y),
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
          onClick: (Y) => T({
            tagId: z.tagId,
            tagName: z.name,
            trigger: Y.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        N.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(z, N),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${N.length})`) : null,
        N.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...N.map((Y) => M(Y, "Derives", !0))
        ]) : null,
        x.length ? n("details", {
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
              x.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            x.map((Y) => M(Y, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!ie)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const b = m.nodes.find((x) => x.tagId === Number(ie.sourceTagId)), v = m.nodes.find((x) => x.tagId === Number(ie.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (b == null ? void 0 : b.segmentGroupName) || "Ungrouped"),
          (b == null ? void 0 : b.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${ie.sourceTagName} → ${ie.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${ie.edgeCount} materialized lineage edge${ie.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === ie.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => k(ie, y),
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
        ie.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : ie.slotMappings.map((x, N) => n("div", {
          key: `${x.sourceSlotDefinitionId}:${x.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: x.sourceSlotLabel || "Unnamed slot" },
            x.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: x.derivedSlotLabel || "Unnamed slot" },
            x.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          ie.createdAt ? new Date(ie.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          ie.updatedAt ? new Date(ie.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => k(ie),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(ie),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(ie),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ae() {
    if (fe.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, E ? "No derivation relationships match your search." : "No derivation rules.");
    const b = z == null ? void 0 : z.tagId, v = /* @__PURE__ */ new Set();
    return z && (v.add(z.tagId), p.connections.forEach((x) => {
      (x.sourceTagId === z.tagId || x.derivedTagId === z.tagId) && (v.add(x.sourceTagId), v.add(x.derivedTagId));
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
        ...p.groups.map((x) => n("div", {
          key: `group:${x.componentId}:${x.key}`,
          className: `absolute rounded-xl border ${D === x.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${x.x}px`,
            top: `${x.y}px`,
            width: `${x.width}px`,
            height: `${x.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: x.name
        }, x.name))),
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
          ...p.connections.map((x) => {
            const N = b === x.sourceTagId || b === x.derivedTagId, M = z != null, Y = N ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: Y,
              strokeWidth: N ? 2.5 : 1.5,
              opacity: M && !N ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((x) => {
          const N = !E || x.name.toLocaleLowerCase().includes(E), M = z != null, Y = v.has(x.tagId), U = (z == null ? void 0 : z.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => te({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${U ? "border-accent bg-accent/15 ring-2 ring-accent/25" : Y ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !N || M && !Y ? 0.62 : 1
            },
            title: `${x.name} — ${x.segmentGroupName}`,
            "aria-label": `${x.name}, ${x.incomingRuleCount} incoming and ${x.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, x.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${x.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${x.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((x) => x.rules.length > 1).map((x) => {
          const N = p.nodes.find((Y) => Y.tagId === x.sourceTagId), M = p.nodes.find((Y) => Y.tagId === x.derivedTagId);
          return n("div", {
            key: `bundle:${x.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(N.x + N.width + M.x) / 2 - 24}px`,
              top: `${(N.y + N.height / 2 + M.y + M.height / 2) / 2 - 10}px`
            },
            "aria-label": `${x.rules.length} rules connect ${x.rules[0].sourceTagName} to ${x.rules[0].derivedTagName}`
          }, `${x.rules.length} rules`);
        })
      ])
    ]);
  }
  function I() {
    if (fe.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        E ? "No derivation relationships match your search." : "No derivation rules."
      );
    const b = /* @__PURE__ */ new Map();
    ne.forEach((x) => {
      const N = Z(x);
      b.has(N) || b.set(N, []), b.get(N).push(x);
    });
    const v = [
      ...m.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => b.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((x) => {
      const N = m.segmentGroups.find((U) => U.key === x), M = x === "cross-group" ? "Cross-group relationships" : (N == null ? void 0 : N.name) || "Ungrouped", Y = b.get(x);
      return n("section", { key: x, "aria-label": M }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, M),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${Y.length} rule${Y.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${M} derivation rules` }, [
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
          ...Y.map((U) => n("button", {
            key: U.id,
            type: "button",
            role: "row",
            onClick: () => te({ type: "rule", id: U.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(ie == null ? void 0 : ie.id) === U.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${U.sourceTagName} → ${U.derivedTagName}` },
              `${U.sourceTagName} → ${U.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(U.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(U.edgeCount))
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
          `${C.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          P(f()), te(null), S();
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
          value: $,
          onChange: (b) => {
            oe(b.target.value), te(null);
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
          onChange: (b) => {
            J(b.target.value), te(null), P(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((b) => n("option", { key: b.key, value: b.key }, b.name))
        ])
      ]),
      Q === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: h,
          onChange: (b) => H(b.target.value),
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
        ].map(([b, v]) => n("button", {
          key: b,
          type: "button",
          onClick: () => {
            G(b), b === "graph" && (_ == null ? void 0 : _.type) === "rule" && te(null);
          },
          "aria-pressed": Q === b,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Q === b ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        Q === "graph" ? ae() : I()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? se() : K()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      F ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, F) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => B(i),
      onClose: () => {
        const b = i.trigger;
        T(null), requestAnimationFrame(() => {
          b != null && b.isConnected && b.focus();
        });
      }
    }) : null
  ]);
}
function Uc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = j([]), [a, s] = j(null), [l, d] = j([]), [c, g] = j([]), [u, f] = j(!1), [m, p] = j(!1), [h, y] = j(!1), [w, k] = j(""), [F, E] = j(""), [$, B] = j("graph"), [S, C] = j("all"), [A, D] = j(null), [z, ie] = j("relationship"), [_, T] = j(null), [P, H] = j(null), re = pe(null), oe = pe(null), J = mi().replace(/:/g, "");
  function te() {
    requestAnimationFrame(() => {
      var R;
      return (R = re.current) == null ? void 0 : R.scrollIntoView({ block: "nearest" });
    });
  }
  async function G(R) {
    const W = await X("/derivation-rules", R ? { signal: R } : void 0);
    i(W || []);
  }
  ye(() => {
    const R = new AbortController();
    return G(R.signal).catch((W) => {
      W.name !== "AbortError" && k(W.message || "Unable to load derived segment rules.");
    }), () => R.abort();
  }, []), ye(() => {
    const R = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), X(`/slot-definitions/${a.sourceTagId}`, { signal: R.signal }).then((W) => d(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && d([]);
    }).finally(() => {
      R.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), X(`/slot-definitions/${a.derivedTagId}`, { signal: R.signal }).then((W) => g(W.definitions || [])).catch((W) => {
      W.name !== "AbortError" && g([]);
    }).finally(() => {
      R.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => R.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const R = `${a.sourceTagId}:${a.derivedTagId}`;
    oe.current !== R && (oe.current = R, s((W) => !W || Number(W.sourceTagId) !== Number(a.sourceTagId) || Number(W.derivedTagId) !== Number(a.derivedTagId) ? W : yd(W, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function ne(R, W = !1) {
    W || D({ type: "rule", id: R.id }), oe.current = null, s({
      ruleId: R.id,
      sourceTagId: R.sourceTagId,
      sourceTagName: R.sourceTagName,
      derivedTagId: R.derivedTagId,
      derivedTagName: R.derivedTagName,
      slotMappings: R.slotMappings.map((q) => ({
        sourceSlotDefinitionId: q.sourceSlotDefinitionId,
        derivedSlotDefinitionId: q.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), k(""), te();
  }
  function ce(R, W, q = "") {
    oe.current = null, R === "source" ? (d([]), f(W != null)) : (g([]), p(W != null)), s((ge) => ({
      ...ge,
      [`${R}TagId`]: W == null ? null : Number(W),
      [`${R}TagName`]: q || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function xe(R) {
    (a == null ? void 0 : a.ruleId) == null && (oe.current = null);
    const W = [G(), t == null ? void 0 : t()];
    return R.draftKind === "source" ? (f(!0), W.push(X(`/slot-definitions/${R.tagId}`).then((q) => d(q.definitions || [])).finally(() => f(!1)))) : R.draftKind === "derived" && (p(!0), W.push(X(`/slot-definitions/${R.tagId}`).then((q) => g(q.definitions || [])).finally(() => p(!1)))), Promise.all(W);
  }
  function ke(R, W, q) {
    s((ge) => ({
      ...ge,
      slotMappings: ge.slotMappings.map((Ie, Ce) => Ce === R ? { ...Ie, [W]: q } : Ie)
    }));
  }
  async function Se() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const R = $a(a, o);
    if (R) {
      k(R.message);
      return;
    }
    if (a.slotMappings.some((W) => !W.sourceSlotDefinitionId || !W.derivedSlotDefinitionId)) {
      k("Complete or remove every performer slot mapping before saving.");
      return;
    }
    y(!0), k(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let W = null;
      if (a.ruleId != null) {
        const ge = await X(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${ge.deletedSegmentCount}
Removed lineage edges: ${ge.removedEdgeCount}
Shared derived segments retained: ${ge.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        W = ge.fingerprint;
      }
      k("Saving derived segment rule…");
      const q = await X("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: W
        })
      });
      if (await G(), D($ === "graph" ? { type: "node", id: Number(q.sourceTagId) } : { type: "rule", id: q.id }), s(null), a.ruleId == null)
        try {
          const ge = await X(
            `/derivation-rules/${q.id}/materialization/preview`,
            { method: "POST" }
          );
          T(
            ge.createCount + ge.linkCount > 0 ? ge : null
          ), k(ge.createCount + ge.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          T(null), k("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        T(null), k("Derived segment rule saved. Previous materializations were removed.");
    } catch (W) {
      k(W.message || "Unable to save derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function Q(R) {
    y(!0), k("Previewing rule deletion…");
    try {
      const W = await X(
        `/derivation-rules/${R.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${R.sourceTagName} → ${R.derivedTagName}?

Deleted segments: ${W.deletedSegmentCount}
Removed lineage edges: ${W.removedEdgeCount}
Shared derived segments retained: ${W.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const q = `derivation-rule-delete:${R.id}:${W.fingerprint}`;
      await X(`/derivation-rules/${R.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(q),
          fingerprint: W.fingerprint
        })
      }), Ue(q), await G(), (a == null ? void 0 : a.ruleId) === R.id && s(null), (A == null ? void 0 : A.type) === "rule" && A.id === R.id && D(null), (_ == null ? void 0 : _.ruleId) === R.id && T(null), k(`Rule deleted with ${W.deletedSegmentCount} exclusively derived segment${W.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (W) {
      k(W.message || "Unable to delete derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function fe(R, W = null) {
    const q = W || await X(
      `/derivation-rules/${R.id}/materialization/preview`,
      { method: "POST" }
    );
    if (q.createCount + q.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const ge = `derivation-rule-materialize:${R.id}:${q.fingerprint}`, Ie = await X(`/derivation-rules/${R.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: je(ge),
        fingerprint: q.fingerprint
      })
    });
    return Ue(ge), Ie;
  }
  async function ee(R, W = null) {
    y(!0), k("Finding pending derivations…");
    try {
      const q = await fe(R, W);
      if (T(null), await G(), q.createdCount + q.linkedCount === 0) {
        k("Every applicable derivation is already materialized.");
        return;
      }
      k(
        `${q.createdCount} derived segment${q.createdCount === 1 ? "" : "s"} created and ${q.linkedCount} existing segment${q.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (q) {
      k(q.message || "Unable to materialize pending derivations.");
    } finally {
      y(!1);
    }
  }
  async function Z(R, W) {
    if (W.length === 0) return;
    y(!0), k(`Finding pending derivations from ${R.name}…`);
    let q = 0, ge = 0;
    try {
      for (const Ie of W) {
        const Ce = await fe(Ie);
        q += Ce.createdCount, ge += Ce.linkedCount;
      }
      T(null), await G(), k(q + ge === 0 ? `Every outgoing derivation from ${R.name} is already materialized.` : `${q} derived segment${q === 1 ? "" : "s"} created and ${ge} existing segment${ge === 1 ? "" : "s"} linked from ${R.name}.`);
    } catch (Ie) {
      await G().catch(() => {
      }), k(Ie.message || `Unable to materialize derivations from ${R.name}.`);
    } finally {
      y(!1);
    }
  }
  const se = $a(a, o), K = qe(
    () => Lc(o, e),
    [o, e]
  ), ae = F.trim().toLocaleLowerCase(), b = K.components.filter((R) => S === "all" || R.segmentGroupKeys.includes(S)).filter((R) => !ae || R.nodes.some((W) => W.name.toLocaleLowerCase().includes(ae))), v = b.flatMap((R) => R.rules), x = new Set(
    b.flatMap((R) => R.nodes.map((W) => W.tagId))
  ), N = qe(
    () => jc(b),
    [b]
  ), M = $ === "list" ? Bc(
    A,
    v,
    ae.length > 0
  ) : null, Y = (A == null ? void 0 : A.type) === "node" && K.nodes.find((R) => R.tagId === A.id && x.has(R.tagId)) || null, U = [...v].sort((R, W) => z === "source" ? ut(R.sourceTagName, W.sourceTagName) || ut(R.derivedTagName, W.derivedTagName) : z === "target" ? ut(R.derivedTagName, W.derivedTagName) || ut(R.sourceTagName, W.sourceTagName) : z === "materialized" ? (Number(W.edgeCount) || 0) - (Number(R.edgeCount) || 0) || ut(R.sourceTagName, W.sourceTagName) : ut(
    `${R.sourceTagName} ${R.derivedTagName}`,
    `${W.sourceTagName} ${W.derivedTagName}`
  ));
  return n(Gc, {
    arrowMarkerId: J,
    busy: h,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: P,
    deleteRule: Q,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: se,
    editRule: ne,
    editorRef: re,
    emptyDraft: r,
    graph: K,
    layout: N,
    listSort: z,
    materializationOffer: _,
    materializeOutgoingRules: Z,
    materializeRule: ee,
    message: w,
    normalizedQuery: ae,
    query: F,
    refreshConfiguredTag: xe,
    revealEditor: te,
    rules: o,
    save: Se,
    segmentGroupKey: S,
    selectedNode: Y,
    selectedRule: M,
    selection: A,
    setConfiguringTag: H,
    setDraft: s,
    setListSort: ie,
    setMaterializationOffer: T,
    setQuery: E,
    setSegmentGroupKey: C,
    setSelection: D,
    setView: B,
    sortedVisibleRules: U,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ke,
    updateTag: ce,
    view: $,
    visibleComponents: b,
    visibleRules: v
  });
}
function Kc() {
  const [e, t] = j(ii), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => ra({ ...l, [a]: s }));
  }
  function i() {
    t(ra(io));
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
function zc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = j([]), [a, s] = j(!1), [l, d] = j(!1), [c, g] = j(""), [u, f] = j(""), [m, p] = j("all"), [h, y] = j(() => /* @__PURE__ */ new Set()), [w, k] = j(null);
  ye(() => {
    if (!e || a) return;
    const T = new AbortController();
    return d(!0), g(""), X("/slot-definitions", { signal: T.signal }).then((P) => {
      i(P || []), s(!0);
    }).catch((P) => {
      P.name !== "AbortError" && g(P.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      T.signal.aborted || d(!1);
    }), () => T.abort();
  }, [e, a]);
  async function F() {
    d(!0), g("");
    try {
      const T = await X("/slot-definitions");
      i(T || []), s(!0);
    } catch (T) {
      g(T.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function E() {
    const [T] = await Promise.all([
      X("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(T || []), s(!0), g("");
  }
  function $() {
    const T = w == null ? void 0 : w.trigger;
    k(null), requestAnimationFrame(() => {
      T != null && T.isConnected && T.focus({ preventScroll: !0 });
    });
  }
  function B(T) {
    y((P) => {
      const H = new Set(P);
      return H.has(T) ? H.delete(T) : H.add(T), H;
    });
  }
  const S = qe(
    () => Pc(t, o),
    [t, o]
  ), C = qe(
    () => Oc(S, u, m),
    [S, u, m]
  ), A = S.flatMap((T) => T.tags), D = A.filter((T) => T.definitions.length > 0).length, z = A.length - D, ie = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], _ = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${A.length} tags · ${D} with slots · ${z} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (T) => f(T.target.value),
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
          ie.map(([T, P]) => n("button", {
            key: T,
            type: "button",
            onClick: () => p(T),
            "aria-pressed": m === T,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === T ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, P))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => y(/* @__PURE__ */ new Set()),
          className: _
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => y(new Set(S.map((T) => T.overviewKey))),
          className: _
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
        onClick: F,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && C.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, C.map((T) => {
      const P = h.has(T.overviewKey), H = T.tags.filter((re) => re.definitions.length > 0).length;
      return n("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => B(T.overviewKey),
          "aria-expanded": !P,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, P ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, T.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${T.tags.length} tag${T.tags.length === 1 ? "" : "s"} · ${H} with slots`
          )
        ]),
        P ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          T.tags.map((re) => n("li", {
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
            }, re.definitions.map((oe) => n("li", {
              key: oe.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, gt(oe)),
              ...(oe.genderHints || []).map((J) => n("span", {
                key: J,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, vr(J)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (oe) => k({
                tagId: re.tagId,
                tagName: re.tagName,
                trigger: oe.currentTarget
              }),
              "aria-label": `Edit performer slots for ${re.tagName}`,
              className: `${_} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    w ? n(xo, {
      key: `performer-slots-configure:${w.tagId}`,
      tagId: w.tagId,
      tagName: w.tagName,
      onSaved: E,
      onClose: $
    }) : null
  ]);
}
function Hc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = j("general"), [a, s] = j([]), [l, d] = j(!1), [c, g] = j(""), [u, f] = j(""), [m, p] = j(null), [h, y] = j(!0), [w, k] = j(!1), [F, E] = j(""), [$, B] = j(!0), [S, C] = j(Va), A = El(t), D = A.map(([P]) => P);
  ye(() => {
    D.includes(o) || i(D[0] || "general");
  }, [t.effectiveMode]);
  async function z(P) {
    const H = await X("/segment-groups", P ? { signal: P } : void 0);
    s(H || []);
  }
  ye(() => {
    const P = new AbortController();
    return z(P.signal).catch((H) => {
      H.name !== "AbortError" && g(H.message || "Unable to load tag groups.");
    }), () => P.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      y(!1);
      return;
    }
    const P = new AbortController();
    return E(""), y(!0), Promise.all([
      X("/analysis/settings", { signal: P.signal }),
      X("/analysis/status", { signal: P.signal })
    ]).then(([H, re]) => {
      B(!0), f((H == null ? void 0 : H.baseUrl) || ""), p(re);
    }).catch((H) => {
      if (H.name !== "AbortError") {
        if (H.status === 403) {
          B(!1), E("You do not have permission to manage the analysis service connection.");
          return;
        }
        E(H.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      P.signal.aborted || y(!1);
    }), () => P.abort();
  }, [t.effectiveMode]);
  async function ie(P) {
    if (P !== t.requestedMode) {
      d(!0), g("");
      try {
        const H = await X(
          `/preferences/transition?mode=${encodeURIComponent(P)}`
        );
        let re = !1, oe = null, J = null, te = null, G = !1;
        if (t.requestedMode === "basic" && P === "full") {
          if (!window.confirm(Ol(
            H.recyclingBinCount,
            H.protectedRecyclingBinCount
          )))
            return;
          G = !0, H.recyclingBinCount > 0 && (re = !0, te = H.recyclingBinFingerprint, oe = `mode-switch-empty-bin:${te}`, J = je(oe));
        }
        let ne = !1;
        if (t.requestedMode === "full" && P === "basic") {
          if (!window.confirm(Pl(
            H.extensionOwnedSegmentCount
          )))
            return;
          ne = !0;
        }
        const ce = await X("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: P,
            confirmHiddenExtensionOwnedSegments: ne,
            confirmBasicHistoryCleanup: G,
            emptyRecyclingBin: re,
            operationId: J,
            expectedRecyclingBinFingerprint: te
          })
        });
        oe && Ue(oe), r == null || r(si(ce)), g("Workflow mode saved.");
      } catch (H) {
        g(H.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function _(P) {
    P.preventDefault(), k(!0), E("");
    try {
      const H = await X("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((H == null ? void 0 : H.baseUrl) || "");
      const re = await X("/analysis/status");
      p(re), E(H != null && H.baseUrl ? re != null && re.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(re == null ? void 0 : re.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (H) {
      E(H.message || "Unable to save analysis service settings.");
    } finally {
      k(!1);
    }
  }
  const T = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (P) => $i(P, e, T), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      A.map(([P, H]) => n("button", {
        key: P,
        type: "button",
        onClick: () => i(P),
        "aria-current": o === P ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === P ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, H))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Kc)
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
      n(ac, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: ie,
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
          checked: S,
          onChange: (P) => {
            const H = P.target.checked;
            Ja(H), C(H);
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
      n("form", { key: "form", onSubmit: _, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (P) => f(P.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: h || w || !$,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: h || w || !$,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, w ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        F || (h ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    D.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Uc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    D.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(zc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => z()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ta({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, gt(a)),
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
function _c({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var g, u;
  const s = [...e.slots || []].sort((f, m) => f.sortOrder - m.sortOrder || String(f.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: gt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = di(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: hi(t)
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
          n(tn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(xr, {
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
function qc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Da, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: jl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: di(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Aa({ onNavigate: e, profile: t }) {
  const r = qe(() => {
    const G = Oa("ext:com.midnightrider.segment-studio:segments");
    return G ? {
      ...Kr,
      defaultFilter: { ...Kr.defaultFilter, ...G.findFilter || {} },
      defaultObjectFilter: G.objectFilter || {}
    } : Kr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = La(r), [l, d] = j(null), [c, g] = j({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = j(null), [m, p] = j(null), [h, y] = j(0), [w, k] = j(""), [F, E] = j(!0), [$, B] = j(""), S = pe(0), C = aa(o, i), A = C.activityTagId, D = In(i.slots), z = qe(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (G) => Object.keys(In(G)).length > 0,
    sanitize: (G) => zr(A, In(G)),
    summarize: (G) => `${Object.keys(In(G)).length} assigned`,
    renderEditor: (G, ne) => A ? n(Ta, {
      facets: l,
      values: In(G),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ce, xe) => {
        const ke = { ...In(G) };
        xe ? ke[ce] = Number(xe) : delete ke[ce], ne(zr(A, ke));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [A, l, c.performerSlotsAvailable]), ie = JSON.stringify(C);
  ye(() => {
    if (d(null), !A) return;
    const G = new AbortController();
    return X(`/browse/activities/${A}/facets`, { signal: G.signal }).then(d).catch((ne) => {
      ne.status === 403 ? d({ slots: [], restricted: !0 }) : ne.name !== "AbortError" && B(ne.message);
    }), () => G.abort();
  }, [A]), ye(() => {
    const G = ++S.current, ne = new AbortController();
    return E(!0), B(""), X("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(C), signal: ne.signal }).then((ce) => {
      G === S.current && g({ ...ce, totalCount: ce.totalCount ?? ce.total ?? 0 });
    }).catch((ce) => {
      if (!(G !== S.current || ce.name === "AbortError")) {
        if (ce.status === 400 && ce.message.includes("unrestricted performer read access")) {
          g((xe) => ({ ...xe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), B("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        B(ce.message);
      }
    }).finally(() => {
      G === S.current && E(!1);
    }), () => {
      S.current++, ne.abort();
    };
  }, [ie, h]);
  const _ = c.items.findIndex((G) => G.key === u), T = c.items[_] || null;
  function P(G) {
    s(G), a({ ...o, page: 1 });
  }
  function H(G) {
    const ne = aa(o, G), ce = G.slots && ne.activityTagId != null && ne.slotAssignments.length > 0 ? G.slots : void 0;
    P({ ...G, slots: ce });
  }
  function re(G, ne) {
    const ce = { ...D };
    ne ? ce[G] = Number(ne) : delete ce[G], P({ ...i, slots: zr(A, ce) });
  }
  function oe() {
    const G = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => G == null ? void 0 : G.focus());
  }
  async function J(G) {
    var xe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(G.key), k("");
    const ne = `browse-restore:${G.itemId}:${G.revision}`, ce = je(ne);
    try {
      const ke = (Se = !1) => X(`/bin/${G.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ce,
          expectedRevision: G.revision,
          discardMissingImage: Se
        })
      });
      try {
        await ke(go(ne));
      } catch (Se) {
        if (((xe = Se.payload) == null ? void 0 : xe.code) !== "missing-image" || !window.confirm(`${Se.message}

Continue and discard the missing image reference?`))
          throw Se;
        po(ne), await ke(!0);
      }
      Ue(ne), u === G.key && f(null), k("Segment restored to Cove."), y((Se) => Se + 1);
    } catch (ke) {
      k(ke.message || "Unable to restore the segment."), ke.status === 409 && y((Se) => Se + 1);
    } finally {
      p(null);
    }
  }
  async function te(G) {
    p(G.key), k("");
    try {
      const ne = await X(`/items/${G.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: G.revision })
      });
      if (!pi(ne, k) || !Xl(ne))
        return;
      const ce = `browse-dependency-delete:${G.itemId}:${ne.fingerprint}`;
      await X(`/items/${G.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(ce),
          fingerprint: ne.fingerprint
        })
      }), Ue(ce), u === G.key && f(null), k(`${ne.deletedSegmentCount} segment${ne.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((xe) => xe + 1);
    } catch (ne) {
      k(ne.message || "Unable to permanently delete the segment."), ne.status === 409 && y((ce) => ce + 1);
    } finally {
      p(null);
    }
  }
  return n("div", { className: "w-full space-y-5" }, [
    n(vo, {
      key: "tabs",
      active: "segments",
      onNavigate: e,
      profile: t
    }),
    n(Fa, {
      key: "list",
      title: "Segments",
      pageKey: "segment-studio-segments",
      savedFilterScope: "ext:com.midnightrider.segment-studio:segments",
      cardSizeEntityType: "video",
      maxPageSize: 100,
      filter: o,
      onFilterChange: a,
      totalCount: c.totalCount,
      isLoading: F,
      error: $ ? new Error($) : null,
      onRetry: () => y((G) => G + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? oa.filter((G) => G.id !== "performers") : oa,
      objectFilter: i,
      onObjectFilterChange: H,
      customFilterSections: z,
      searchPlaceholder: "Search segments..."
    }, [
      A ? n(Ta, { key: "slots", facets: l, values: D, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: re }) : null,
      n(qc, { key: "player", item: T, index: _, count: c.items.length, onPrevious: () => {
        var G;
        return f((G = c.items[_ - 1]) == null ? void 0 : G.key);
      }, onNext: () => {
        var G;
        return f((G = c.items[_ + 1]) == null ? void 0 : G.key);
      }, onClose: oe, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !F && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      F ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((G) => n(_c, {
        key: G.key,
        item: G,
        selected: G.key === u,
        busy: m === G.key,
        onSelect: () => f(G.key),
        onRestore: J,
        onPurge: te
      })))
    ])
  ]);
}
function Wc({ onNavigate: e, profile: t }) {
  const [r, o] = j([]), [i, a] = j(""), [s, l] = j(0), [d, c] = j(!0), [g, u] = j(null), [f, m] = j(""), p = pe(null);
  async function h(k) {
    const F = await X("/bin", k ? { signal: k } : void 0);
    return o(F.items || []), a(F.fingerprint || ""), l(Number(F.totalCount) || 0), F;
  }
  ye(() => {
    const k = new AbortController();
    return c(!0), h(k.signal).catch((F) => {
      F.name !== "AbortError" && m(F.message);
    }).finally(() => {
      k.signal.aborted || c(!1);
    }), () => k.abort();
  }, []), Pa(ao, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var k;
      return (k = p.current) == null ? void 0 : k.call(p);
    }
  }]);
  async function y(k) {
    var $;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(k.itemId), m("");
    const F = `restore:${k.itemId}:${k.revision}`, E = je(F);
    try {
      const B = (S = !1) => X(`/bin/${k.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: E, expectedRevision: k.revision, discardMissingImage: S })
      });
      try {
        await B(go(F));
      } catch (S) {
        if ((($ = S.payload) == null ? void 0 : $.code) !== "missing-image" || !window.confirm(`${S.message}

Continue and discard the missing image reference?`)) throw S;
        po(F), await B(!0);
      }
      Ue(F), await h(), zn(), m("Segment restored with a new native ID.");
    } catch (B) {
      m(B.message || "Unable to restore the segment."), B.status === 409 && await h();
    } finally {
      u(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const k = await yi({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (k.status !== "emptied") return;
        await h(), zn(), m(`${k.segmentCount} segment${k.segmentCount === 1 ? "" : "s"} from ${k.sceneCount} scene${k.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (k) {
        m(k.message || "Unable to empty the recycling bin."), k.status === 409 && await h();
      } finally {
        u(null);
      }
  }
  return p.current = w, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
    n(vo, {
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
    f ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((k) => n("article", { key: k.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${k.tagName || "Tag segment"} · ${k.videoTitle || `Video ${k.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, k.endSec == null ? Re(k.startSec) : `${Re(k.startSec)} – ${Re(k.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${k.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${k.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => y(k), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ra = "ext:com.midnightrider.segment-studio:videos";
function qr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = qe(() => {
    var ee;
    const Q = Oa(Ra), fe = (ee = Q == null ? void 0 : Q.uiOptions) == null ? void 0 : ee.displayMode;
    return Q ? {
      ...Gn,
      defaultFilter: { ...Gn.defaultFilter, ...Q.findFilter || {} },
      defaultObjectFilter: Q.objectFilter || {},
      defaultDisplayMode: Gn.allowedDisplayModes.includes(fe) ? fe : Gn.defaultDisplayMode
    } : Gn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = La(i), [u, f] = j({ items: [], totalCount: 0 }), [m, p] = j(!0), [h, y] = j(""), [w, k] = j(0), [F, E] = j(/* @__PURE__ */ new Set()), [$, B] = j(null), [S, C] = j({ busy: !1, error: "", announcement: "" }), A = pe(0), D = pe(null), z = pe(null);
  z.current || (z.current = Ec());
  const ie = JSON.stringify(a), _ = JSON.stringify(s), T = t || r === "review";
  ye(() => {
    z.current.selectionChanged(), D.current = null, E(/* @__PURE__ */ new Set()), C((Q) => ({ busy: Q.busy, error: "", announcement: "" }));
  }, [ie, _]), ye(() => {
    if (!T) return;
    const Q = new AbortController();
    return X("/analysis/status", { signal: Q.signal }).then(B).catch((fe) => {
      fe.name !== "AbortError" && B({ configured: !0, ready: !1, error: fe.message || "Unable to check Full Scan readiness." });
    }), () => Q.abort();
  }, [T]), ye(() => {
    const Q = ++A.current, fe = new AbortController();
    return p(!0), y(""), X(`/videos?${ec(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: fe.signal }).then((ee) => {
      Q === A.current && f(ee);
    }).catch((ee) => {
      Q === A.current && ee.name !== "AbortError" && y(ee.message || "Unable to discover videos.");
    }).finally(() => {
      Q === A.current && p(!1);
    }), () => {
      A.current++, fe.abort();
    };
  }, [ie, _, t, r, w]);
  function P(Q) {
    d({ ...Q, page: Q.page || 1 });
  }
  function H(Q) {
    c(Q), d({ ...a, page: 1 });
  }
  function re(Q, fe = !1) {
    E((ee) => tc(
      ee,
      u.items.map((Z) => Z.videoId),
      Q,
      D.current,
      fe
    )), D.current = Q;
  }
  function oe() {
    D.current = null, E(new Set(u.items.map((Q) => Q.videoId)));
  }
  function J() {
    D.current = null, E(/* @__PURE__ */ new Set());
  }
  function te() {
    D.current = null, E((Q) => new Set(u.items.map((fe) => fe.videoId).filter((fe) => !Q.has(fe))));
  }
  async function G(Q = ["aiTagging", "omnishotcut"]) {
    const fe = z.current.begin();
    if (fe) {
      C({ busy: !0, error: "", announcement: "" });
      try {
        const ee = await Dc(
          [...F],
          Q,
          X,
          (Z) => window.confirm(Z)
        );
        if (ee.cancelled) {
          C({ busy: !1, error: "", announcement: "" });
          return;
        }
        ee.queuedIds.length > 0 && z.current.ownsCurrentSelection(fe) && (ee.queuedIds.includes(D.current) && (D.current = null), E((Z) => {
          const se = new Set(Z);
          return ee.queuedIds.forEach((K) => se.delete(K)), se;
        })), C({
          busy: !1,
          announcement: ee.queuedIds.length > 0 ? `${ee.queuedIds.length} ${ee.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ee.failed.length > 0 ? `${ee.failed.length} selected ${ee.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ee.failed[0].error}` : ""
        });
      } catch (ee) {
        C({ busy: !1, error: ee.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        z.current.finish(fe);
      }
    }
  }
  const ne = t || r === "review" ? xa : xa.filter((Q) => !["reviewState", "shotBoundaries"].includes(Q.id)), ce = $ === null || $.configured === !1 || $.ready === !1, xe = S.busy || ce, ke = ($ == null ? void 0 : $.error) || ($ === null ? "Checking Full Scan availability" : $.configured === !1 ? "Configure the analysis service before running Full Scan" : $.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), Se = S.busy ? "Queueing scans…" : $ === null ? "Checking Full Scan…" : $.configured === !1 ? "Full Scan not configured" : $.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(vo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Fa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Ra,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: P,
      totalCount: u.totalCount,
      isLoading: m,
      error: h ? new Error(h) : null,
      onRetry: () => k((Q) => Q + 1),
      sortOptions: t || r === "review" ? [...va, { value: "unreviewed_count", label: "Unreviewed count" }] : va,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ne,
      objectFilter: s,
      onObjectFilterChange: H,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: T ? F : void 0,
      onSelectAll: T ? oe : void 0,
      onSelectNone: T ? J : void 0,
      onInvertSelection: T ? te : void 0,
      selectionActions: T ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: xe,
          onClick: () => G(),
          title: ke,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, Se),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": xe,
            title: ke,
            onClick: (Q) => {
              xe && Q.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${xe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(ja, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([Q, fe]) => n("button", {
            key: Q,
            type: "button",
            disabled: S.busy,
            onClick: (ee) => {
              var Z;
              (Z = ee.currentTarget.closest("details")) == null || Z.removeAttribute("open"), G(fe);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, Q)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, S.announcement),
      S.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, S.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((Q) => n(nc, { key: Q.videoId, item: Q, onNavigate: e, showReviewStates: T, selected: F.has(Q.videoId), selectionActive: F.size > 0, onSelect: T ? re : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((Q) => n(rc, { key: Q.videoId, item: Q, onNavigate: e, showReviewStates: T, selected: F.has(Q.videoId), selectionActive: F.size > 0, onSelect: T ? re : null }))) : null
    ])
  ]);
}
function Ma({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = j(null), [s, l] = j(!0), [d, c] = j(""), g = pe(0), u = pe(0), f = pe(e), m = Gd();
  f.current = e;
  const p = (F) => `/videos/${F}/editor`;
  async function h(F, E, $) {
    const B = await X(p(E), $ ? { signal: $.signal } : void 0);
    return Qt(F, $ ? g.current : u.current, E, f.current) ? (a(B), !0) : !1;
  }
  ye(() => {
    const F = ++g.current, E = e, $ = new AbortController();
    return a(null), l(!0), c(""), h(F, E, $).catch((B) => {
      Qt(F, g.current, E, f.current) && B.name !== "AbortError" && c(B.message || "Unable to load the editor.");
    }).finally(() => {
      Qt(F, g.current, E, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, $.abort();
    };
  }, [e]);
  function y(F, E) {
    a(($) => ($ == null ? void 0 : $.video.id) !== E ? $ : typeof F == "function" ? F($) : F);
  }
  async function w() {
    const F = e, E = ++u.current;
    try {
      const $ = await X(p(F));
      return Qt(E, u.current, F, f.current) ? (a($), c("A newer canonical segment was loaded. Your stale change was not applied."), $) : null;
    } catch ($) {
      return Qt(E, u.current, F, f.current) && c($.message || "Unable to reload the latest segment."), null;
    }
  }
  async function k() {
    const F = e, E = ++u.current;
    try {
      const $ = await X(p(F));
      return Qt(E, u.current, F, f.current) ? (a($), c(""), $) : null;
    } catch ($) {
      return Qt(E, u.current, F, f.current) && c($.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${m ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: m ? {
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
      n(Ns, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(Rc, {
      key: i.video.id,
      detail: i,
      onDetailChange: y,
      onConflict: w,
      onReload: k,
      onSlotsChanged: k,
      splitLayout: m,
      profile: o,
      initialSegmentId: sa() ? -sa() : Bl(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Vc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Jc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function Yc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Qc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Rl(o), l = Vc(e, t, window.location.pathname), d = Jc(e, t, window.location.pathname), c = Yc(e, t, window.location.pathname), g = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Dl(g, o) === "videos" && g !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(qr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Hc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Aa, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(Ma, {
      videoId: m,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(qr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Wc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(Aa, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Ma, {
    videoId: f,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(qr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function Zc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = j(null), [a, s] = j("");
  return ye(() => {
    const l = new AbortController();
    return X("/preferences", { signal: l.signal }).then((d) => i(si(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Qc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function Xc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function eu(e, t) {
  const r = Xc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const ku = {
  components: { SegmentStudioPage: Zc },
  actionHandlers: { openSegmentStudio: eu }
};
export {
  fr as CLEARED_SEGMENT_SELECTION_ID,
  va as DISCOVERY_SORT_OPTIONS,
  Gt as SEGMENT_STUDIO_CAPABILITIES,
  ao as SEGMENT_STUDIO_EXTENSION_ID,
  Vn as SEGMENT_STUDIO_SHORTCUTS,
  zs as activeEditorFilterCount,
  Xa as addPendingChange,
  yd as applyDerivationRuleSlotSuggestions,
  mr as applyFeedbackEditorDelta,
  ti as applyPendingChanges,
  ma as applySegmentMergeDelta,
  nd as basicSegmentTimelineStyle,
  jl as browseClipEnd,
  di as browseEditorHref,
  aa as buildBrowseRequest,
  Lc as buildDerivationRuleGraph,
  ec as buildDiscoverySearchParams,
  As as buildMinuteTimelineTicks,
  Pc as buildPerformerSlotOverview,
  Hl as buildSegmentQuickSearchEntries,
  Sd as buildSegmentRailRows,
  kd as buildTimelineRows,
  iu as buildTimelineTicks,
  Ds as calculateCenteredTimelineScroll,
  Vr as calculateEditorPanelMaximum,
  Rs as calculateMinuteLabelStride,
  su as calculateMinuteTimelineWidth,
  Ls as calculateSwimlaneTitleMaximum,
  Ps as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  js as calculateTimelineRatioFromPointer,
  lu as calculateVerticalRevealOffset,
  Zt as clampEditorPanelWidth,
  ur as clampSwimlaneTitleWidth,
  Wa as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  pr as clampTimelineZoom,
  Yd as compactProvenanceSummary,
  Ec as createBulkAnalysisCoordinator,
  hl as createQueuedReviewRequest,
  ol as createSaveQueue,
  Na as createSegmentAnalysisRequestScope,
  ku as default,
  sl as discardPendingChange,
  Il as displayHeldSegmentTag,
  Zl as downloadFileNameFromContentDisposition,
  Hs as dualRangeValueFromPointer,
  ta as duplicateIdentityFromResponse,
  Sl as duplicateOperationKey,
  Ya as editorVisibilityIncludingSegment,
  Id as expandedSwimlanes,
  Pl as extensionOwnedSegmentsModeSwitchPrompt,
  Rd as feedbackFrameTimestamps,
  Ed as feedbackResultMatchesAction,
  Md as feedbackSelectionPlan,
  Ks as filterDerivedSegments,
  Br as filterEditorSegments,
  Oc as filterPerformerSlotOverview,
  zl as filterSegmentQuickSearch,
  pu as filterSegmentStudioShortcuts,
  Td as findAdjacentSegmentGroupKey,
  Tl as findAdjacentShot,
  fl as findEditorShortcut,
  qa as findInitialSegmentSelection,
  Ts as findNearestSegmentInCurrentSwimlane,
  $l as findPublishedSelectionIdentity,
  Qe as findSegmentByStableIdentity,
  Bs as findSegmentFromPlayhead,
  $s as findSegmentNearPlayhead,
  $d as findSwimlaneRangeSelection,
  eo as findSwimlaneSelection,
  Ul as findUniquePerformerSlotAssignment,
  gr as findUnreviewedSelection,
  cd as focusDialogDefaultButton,
  vr as formatGenderHint,
  Al as frameStepSeconds,
  ci as generatePerformerSlotAssignmentRecommendations,
  mc as groupApprovedDraftsForPublishing,
  Kl as groupAutoAssignCandidates,
  Dd as groupIncorrectExamplesByTag,
  bc as groupMaterializationOutputs,
  Xt as groupSegmentsIntoSwimlanes,
  wd as groupSelectedSwimlanes,
  ho as groupSwimlanesBySegmentGroup,
  yt as handleModalKey,
  Tn as hasSegmentStudioCapability,
  pa as hideCollectedFeedbackSegments,
  ud as historyActionsForTarget,
  lr as incorrectExampleHistoryState,
  Si as indexPerformerSlotsBySegment,
  bu as initialReviewFilter,
  Ld as insertSegmentProjection,
  Qt as isCurrentEditorRequest,
  sd as isEditableTarget,
  vu as isEditorShortcutOwner,
  Qo as isKindRunning,
  du as isSaveQueueBusy,
  Yc as isSegmentStudioBinRoute,
  Jc as isSegmentStudioSegmentsRoute,
  Vc as isSegmentStudioSettingsRoute,
  Fc as layoutDerivationRuleComponent,
  jc as layoutDerivationRuleComponents,
  Fd as mergeSegmentsProjection,
  pd as multiSelectionActionHint,
  Zs as nextSegmentAfterRemoval,
  Xs as nextUnreviewedAfterRemoval,
  _t as normalizeCollapsedSegmentGroups,
  ka as normalizeDiscoveryIds,
  xt as normalizeEditorSegmentFilters,
  zt as normalizeGender,
  na as normalizeReviewFilter,
  si as normalizeSegmentStudioFeatureProfile,
  fu as normalizeSegmentStudioMode,
  Zr as normalizeSegmentStudioPublicMode,
  In as parseBrowseSlotFilters,
  Fs as parseEditorLayout,
  Gs as parseHideDerivedSegmentsPreference,
  Us as parseMergeConfirmationPreference,
  ai as parsePlaybackShortcutConfig,
  gl as parseShortcutBindingOverrides,
  _r as patchPerformerSlotProjection,
  ba as patchSegmentProjection,
  cl as pendingChangesReducer,
  el as percentageSeekTime,
  Gl as performInitialSegmentSeek,
  rt as performerOptionId,
  yr as performerSlotHistoryState,
  gt as performerSlotLabel,
  bd as performerSlotPresentation,
  Su as performerSlotStatus,
  bo as performerSlotStatusFromSegmentSlots,
  xi as performerSlotsForSegment,
  $t as provenanceSourceLabel,
  ni as prunePendingChanges,
  Nl as queueCreatedSegmentTagChoice,
  ui as rankPerformerOptions,
  Ad as reconcileSegmentGroupKey,
  Ys as reconcileSelectedSegmentIds,
  oc as recyclingBinActionText,
  ed as recyclingBinDeletionPrompt,
  fi as recyclingBinDeletionSummary,
  Ol as recyclingBinModeSwitchPrompt,
  yu as removeQueuedReviewsForSegments,
  to as removeSegmentsProjection,
  sa as requestedOwnedItemId,
  Bl as requestedSegmentId,
  qs as resolveEditorSegmentSelection,
  Cl as resolveQueuedCreatedSegmentTag,
  vl as resolveQueuedReviewRequest,
  kl as resolveSegmentCreationAction,
  Dl as resolveSegmentStudioRoute,
  pl as resolveSegmentStudioShortcuts,
  rl as resolveSegmentTarget,
  Bc as resolveSelectedDerivationRule,
  Yo as resolveSelectedSegments,
  Sc as restoreDisabledToolbarActionFocus,
  Ac as restorePublishApprovedFocus,
  no as restoreSegmentFieldsProjection,
  Ci as restoreSegmentsProjection,
  dl as retargetPendingChanges,
  Ii as revealCollapsedSegmentGroup,
  Dc as runSelectedDiscoveryAnalysis,
  Cn as sameSegmentIdentity,
  Jr as savingSegmentIdFrom,
  bi as segmentBadgeStyle,
  hr as segmentGroupHeaderBackground,
  It as segmentGroupKeyForSegment,
  yo as segmentHistoryIdentity,
  sr as segmentHistoryState,
  co as segmentIdentity,
  hi as segmentRailItemStyle,
  hu as segmentStateStyle,
  Xc as segmentStudioActionTarget,
  Rl as segmentStudioLegacyMode,
  td as segmentTimelineStyle,
  vt as segmentsHistoryState,
  Qs as selectAllVideoSegmentIds,
  Ll as selectedBrowseStates,
  wi as selectedSwimlaneMerge,
  $i as setBackLinkNavigation,
  ll as settlePendingChange,
  md as sharedPerformerSlotShape,
  gd as sharedTagPerformerSlotShape,
  $n as shortcutAvailableInMode,
  yl as shortcutBindingDisplayText,
  cu as shortcutBindingFromEvent,
  mu as shortcutBindingsOverlap,
  gu as shortcutModesOverlap,
  ml as shortcutRequiresSingleSegment,
  Kn as shotBoundaryFingerprint,
  dd as shouldAcceptCurrentTagFromEnter,
  uu as shouldExitShortcutCapture,
  xu as shouldHandleEditorShortcut,
  wa as shouldLoadSegmentAnalysis,
  ha as shouldReloadAfterSegmentMutation,
  Qr as shouldRestoreTransitionSelection,
  _l as shouldShowQuickSearchGroups,
  Xo as splitShortcutCategoriesIntoColumns,
  fd as suggestDerivationRuleSlotMappings,
  qn as swimlaneDisplayLabel,
  id as swimlaneMarkerTop,
  od as swimlaneStripeBackground,
  wl as tagEditorLockedBySave,
  Za as targetsOverlap,
  Os as timelineContentStyle,
  Wo as timelinePlayheadHorizontalStyle,
  rd as timelineSegmentWidth,
  Ms as timelineTickAlignment,
  Es as timelineTickPosition,
  Wr as timelineTimePercent,
  Cd as toggleAllCollapsedSegmentGroups,
  bl as toggledSelectionReviewState,
  Dt as trapModalFocus,
  Jl as tryParseJsonResponseText,
  Js as updateAnchoredSegmentSelection,
  tc as updateDiscoverySelection,
  _s as updateDualRangeValues,
  Ws as updateSegmentCollectionSelection,
  Vs as updateSegmentRangeSelection,
  Qa as updateSegmentSelection,
  $a as validateDerivationRuleDraft,
  qo as validateSegmentTiming,
  mo as videoPerformerOptions,
  Hr as videoPerformerSlotAssignments,
  El as visibleSegmentStudioSettingsTabs,
  Ml as visibleSegmentStudioTabs,
  ki as visibleVirtualRows
};
