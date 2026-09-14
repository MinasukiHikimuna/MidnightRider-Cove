import oo from "@cove/runtime/react";
import { createPortal as hs } from "@cove/runtime/react-dom";
import { extensionFetch as Ea } from "@cove/runtime/api";
import { formatDuration as vs, EntityReferenceSelector as Hn, useExtensionKeyboardBindings as xs, VideoPlayer as Da, useRegisterExtensionKeyboardActions as Pa, getDefaultFilter as Oa, useListUrlState as La, ListPage as Fa } from "@cove/runtime/components";
import { ChevronDown as ja, StepBack as Ss, StepForward as ks, Loader2 as ws } from "@cove/runtime/lucide-react";
const ao = "com.midnightrider.segment-studio", Ba = "segment-studio.layout.v1", en = "segment-studio.operations.v1", Ga = "segment-studio.collapsed-segment-groups.v1", Ua = "segment-studio.playback-shortcuts.v1", Ka = "segment-studio.timing-clipboard.v1", za = "segment-studio.hide-derived-segments.v1", Ha = "segment-studio.merge-confirmation.v1", mt = ["unreviewed", "approved", "rejected"], Ns = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], zo = "(min-width: 1024px) and (min-height: 640px)", Ho = "(min-width: 1024px) and (min-height: 900px)", _n = 1e-3, _o = 15, Is = 30, _a = 12, ft = {
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
function Cs(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + Is : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + _o + _n && p >= i - _o - _n;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function $s(e, t, r) {
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
function Ts(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function su(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function As(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function Rs(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ms(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Es(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Wr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Ds(e, t, r = 10) {
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
function Ps(e, t = _a) {
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
function Os(e) {
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
function Ls(e) {
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
function Fs(e, t, r) {
  return r > 0 ? lo((t + r - e) / r, r) : ft.timelineRatio;
}
function lu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function js(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= _n ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Qt(e, t, r, o) {
  return e === t && r === o;
}
const fr = "__segment-studio-cleared-selection__";
function Bs(e) {
  return e === "true";
}
function Gs(e) {
  return e !== "false";
}
function Va() {
  try {
    return Gs(window.localStorage.getItem(Ha));
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
function Us(e, t) {
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
  return Us(e || [], o).filter((u) => {
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
function Ks(e, t = !1) {
  const r = xt(e);
  return +(r.reviewStates.length !== mt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function zs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Hs(e, t, r, o) {
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
function _s(e, t, r = null) {
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
function qs(e, t, r) {
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
function Ws(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Qa(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Vs(e, t, r = null, o = !1) {
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
      ...Ws(u, s, t, g, !0),
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
function Js(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Ys(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Vo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Jo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Vo(t, o) - Vo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Qs(e, t, r) {
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
function Zs(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Xs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Yo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function el() {
  try {
    return Bs(window.localStorage.getItem(za));
  } catch {
    return !1;
  }
}
function tl(e) {
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
function nl(e, t) {
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
function rl({ getContext: e = () => ({}), drainAfterSettle: t = !0 } = {}) {
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
    $.resolveTargets = () => E.targets.map((S) => nl($.segments, S)).filter(Boolean), u();
    let G;
    try {
      G = E.run($);
    } catch (S) {
      G = Promise.reject(S);
    }
    Promise.resolve(G).then(
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
      const G = i[$], S = m(G);
      if (S === "failed") {
        i = i.filter((C) => C !== G), f(G, { status: "dropped", reason: "dependency-failed" }), E = !0, $ -= 1;
        continue;
      }
      if (S !== "pending" && !(G.exclusive && $ > 0) && !i.slice(0, $).some((C) => Za(C.targets, G.targets)) && !(G.ready && !G.ready(e()))) {
        i = i.filter((C) => C !== G), p(G);
        return;
      }
    }
    E && u();
  }
  function w(E) {
    if (s || (o == null ? void 0 : o.exclusive) || i.some((A) => A.exclusive) || o != null && E.whenBusy !== "enqueue") return null;
    let G;
    const S = new Promise((A) => {
      G = A;
    }), C = {
      id: r++,
      kind: E.kind,
      lockId: E.lockId ?? null,
      targets: Object.freeze([...E.targets || []]),
      exclusive: E.exclusive === !0,
      dependsOn: E.dependsOn ?? null,
      ready: E.ready || null,
      run: E.run,
      resolve: G
    };
    return i = [...i, C], u(), y(), { id: C.id, done: S };
  }
  function k(E = {}) {
    let $ = null;
    const G = w({
      ...E,
      whenBusy: "reject",
      run: () => new Promise((C) => {
        $ = C;
      })
    });
    if (!G) return null;
    if ($ == null)
      return j((C) => C.id === G.id), null;
    let S = !1;
    return () => {
      S || (S = !0, $());
    };
  }
  function j(E) {
    const $ = i.filter((G) => E(Gr(G)));
    if ($.length === 0) return 0;
    i = i.filter((G) => !$.includes(G));
    for (const G of $) f(G, { status: "cancelled" });
    return u(), y(), $.length;
  }
  return {
    enqueue: w,
    acquire: k,
    cancel: j,
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
      for (const $ of E) f($, { status: "cancelled" });
      c.clear();
    }
  };
}
let ol = 1;
function uo() {
  return `pending-${ol++}`;
}
function al(e) {
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
function il(e, t) {
  const r = (e || []).filter((o) => !ei(o, t));
  return r.length === (e || []).length ? e : r;
}
function sl(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !ei(i, t) ? i : (r = !0, { ...i, settled: !0 }));
  return r ? o : e;
}
function ll(e, t, r) {
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
  return al(r);
}
function dl(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((i) => i.op === "insert" && !i.settled).map((i) => i.segment)
  ], o = e.filter((i) => i.settled ? !1 : i.op === "insert" ? !0 : i.targets.some((a) => r.some((s) => Cn(a, s))));
  return o.length === e.length ? e : o;
}
function cl(e, t) {
  switch (t.type) {
    case "add":
      return Xa(e, t.entry);
    case "discard":
      return il(e, t.key);
    case "settle":
      return sl(e, t.key);
    case "retarget":
      return ll(e, t.temporaryId, t.identity);
    case "prune":
      return dl(e, t.detail);
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
function ni(e) {
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
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ni).filter(Boolean)]));
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
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ni({
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
function ri(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function yl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(ri).join(" / ") : "Unassigned";
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
function oi(e) {
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
function ai() {
  try {
    return oi(window.localStorage.getItem(Ua));
  } catch {
    return { ...io };
  }
}
function ra(e) {
  const t = oi(JSON.stringify(e));
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
function ii(e) {
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
  return si(e).values;
}
function si(e) {
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
  const r = ia(t.activitiesCriterion, t.activityId), o = ia(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = si(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
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
function li(e) {
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
function ot(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function mo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Hr(e, t) {
  const r = new Set(mo(t).map((o) => String(ot(o))));
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
function di(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((h, y) => String(h.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), p = [...t].sort((h, y) => String(h.name).localeCompare(String(y.name)) || Number(ot(h)) - Number(ot(y)));
    return [{
      assignments: Object.fromEntries(m.map((h, y) => [String(h.slotDefinitionId), String(ot(p[y]))])),
      description: p.map((h) => h.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, h) => ({ performer: p, index: h })).filter(({ performer: p }) => {
    var h;
    return !((h = m.genderHints) != null && h.length) || m.genderHints.some((y) => zt(y) === zt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : da(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(ot(m)), p]));
  function f(m, p, h) {
    if (s.length >= a) return;
    const y = c.slice(m), w = i ? y.filter(($) => $.length > 0).length : da(y.map(($) => $.filter((G) => !p.has(String(ot(t[G]))))), t.length);
    if (h + w < g) return;
    if (m === e.length) {
      if (h !== g) return;
      const $ = Object.fromEntries(d.map(({ slot: S, performer: C }) => [String(S.slotDefinitionId), C ? String(ot(C)) : ""])), G = o.length === 0 ? Object.values($).sort().join(",") : [...new Set(e.map((S) => String(S.label || "")))].map((S) => `${S}:${d.filter(({ slot: C }) => String(C.label || "") === S).map(({ performer: C }) => C ? String(ot(C)) : "").sort().join(",")}`).join("|");
      !l.has(G) && s.length < a && (l.add(G), s.push({
        assignments: $,
        description: d.map(({ slot: S, performer: C }) => o.length ? `${S.label}: ${(C == null ? void 0 : C.name) || "Unassigned"}` : (C == null ? void 0 : C.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const k = e[m], j = [...d].reverse().find(({ slot: $ }) => la($) === la(k)), E = j ? u.get(String(ot(j.performer))) : -1;
    for (const $ of c[m]) {
      const G = t[$], S = ot(G);
      if (!($ < E) && !(S == null || !i && p.has(String(S))) && (d.push({ slot: k, performer: G }), i || p.add(String(S)), f(m + 1, p, h + 1), i || p.delete(String(S)), d.pop(), s.length >= a))
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
function ci(e, t, r) {
  const o = ot, i = new Set((t || []).map(o)), a = new Set((r || []).map(zt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = zt(l.gender || l.genderIdentity), f = zt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: ui, useLayoutEffect: ql, useMemo: qe, useReducer: Wl, useRef: pe, useState: B, useSyncExternalStore: Vl } = oo, n = oo.createElement, mi = "/api/plugins/segment-studio";
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
  const o = await Ea(`${mi}${e}`, t);
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
  const r = String(e).startsWith("/api/") ? e : `${mi}${e}`, o = await Ea(r, t);
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
function Me(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function Xr() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function gi(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Xl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function pi(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function ed(e, t) {
  const { sceneCount: r, segmentCount: o } = pi(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function fi(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = pi(r, e == null ? void 0 : e.totalCount);
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
function yi(e) {
  return { ...(Ct[e] || Ct.unreviewed).badge };
}
function bi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const hi = {
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
    style: yi(e)
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
function vi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function xi(e) {
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
  const r = (t || []).map((i) => vi(e, i.id));
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
  return bo(vi(e, t));
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
function Si(e, t, r, o = 240) {
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
function ki(e, { nativeOnly: t = !1 } = {}) {
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
function wi({ assignments: e, className: t = "" }) {
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
  const o = pe(null), i = `performer-slots-${ui()}`, [a, s] = B(null);
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
    a ? hs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(wi, {
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
function Ni(e, t) {
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
function Ii(e, t) {
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
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, currentTime: i, detail: a, editorFilters: s, endInput: l, hideDerivedSegments: d, historyRef: c, mediaDuration: g, onConflict: u, onDetailChange: f, onReload: m, optimisticSegmentIdRef: p, pendingDuplicateRef: h, pendingFirstSegmentStartSecRef: y, pendingTagEditSegmentIdRef: w, heldCreatedSegmentTag: k, setHeldCreatedSegmentTag: j, replaceSegmentSelection: E, savingSegmentId: $, segments: G, selectedSegment: S, selectedSegmentIdRef: C, selectedSegments: A, selectionAnchorIdRef: D, selectionRangeBaseIdsRef: K, setCreatingSegmentId: ae, setEditorFilters: _, setFirstSegmentTagOpen: T, setHideDerivedSegments: P, setHistory: H, setHistoryOpen: ne, setPublishApprovedError: re, setSaveMessage: V, setSelectedSegmentGroupKey: le, setSelectedSegmentId: L, setSelectedSegmentIds: te, setTagEditing: ue, startInput: be, tagEditingRef: we, timelineDuration: xe, video: Y } = e;
  function fe(N) {
    c.current = N || Bt, H(c.current);
  }
  async function ee(N, M, J, U, ce = null) {
    var R;
    try {
      const W = await X(`/videos/${Y.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: c.current.revision,
          kind: N,
          label: M,
          beforeState: J,
          afterState: U,
          receiptId: ce
        })
      });
      return fe(W), !0;
    } catch (W) {
      return W.status === 409 && ((R = W.payload) != null && R.current) && fe(W.payload.current), V("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function Q(N, M, J = !0, U = null, ce = !1, R = M, W = !0) {
    var Ze;
    if (!N || $ != null) return null;
    const q = A.map((Ie) => Ie.id), ge = C.current, Ce = J && !r ? crypto.randomUUID() : null, $e = t("segment", N.id);
    if (!$e) return null;
    V(J ? "Saving directly to Cove…" : "Restoring history…");
    const Se = ce ? uo() : null;
    Se && o({
      type: "add",
      entry: { id: Se, op: "patch", targets: [co(N)], values: R }
    });
    const Xe = () => {
      Se && o({ type: "settle", key: Se });
    };
    try {
      if (r && N.nativeSegmentId == null && N.itemId != null) {
        const Je = `draft-update:${Y.id}:${N.itemId}:${N.revision}:${M.tagId}:${M.startSec}:${M.endSec ?? "open"}:${M.reviewState ?? N.reviewState}`, Ke = await X(`/videos/${Y.id}/drafts/${N.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Je),
            expectedRevision: N.revision,
            startSec: M.startSec,
            endSec: M.endSec,
            tagId: M.tagId,
            reviewState: M.reviewState
          })
        });
        Ue(Je);
        const Z = {
          ...N,
          ...Ke.draft,
          id: N.id,
          itemId: N.itemId
        };
        return J && await ee(
          "segment.update",
          U || "Changed segment",
          sr(N, r),
          sr(
            Z,
            r
          )
        ), ha(N, M, r) ? await m() : f((de) => ({
          ...de,
          approvedSetVersion: Ke.approvedSetVersion || de.approvedSetVersion,
          segments: (de.segments || []).map((Ee) => Ee.id === N.id ? Z : Ee).sort((Ee, Be) => Ee.startSec - Be.startSec || Ee.id - Be.id)
        }), Y.id), Xe(), V(((Ze = Ke.draft) == null ? void 0 : Ze.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Z;
      }
      const Ie = await X(`/videos/${Y.id}/segments/${N.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...M,
          expectedUpdatedAt: N.updatedAt,
          historyReceiptId: Ce
        })
      }), He = {
        ...N,
        ...Ie,
        reviewState: M.reviewState ?? N.reviewState
      };
      return ha(N, M, r) ? await m() : f((Je) => ({
        ...Je,
        segments: (Je.segments || []).map((Ke) => Ke.id === N.id ? He : Ke).sort((Ke, Z) => Ke.startSec - Z.startSec || Ke.id - Z.id)
      }), Y.id), Xe(), J && await ee(
        "segment.update",
        U || "Changed segment",
        sr(N, r),
        sr(
          He,
          r
        ),
        Ce
      ), V(J ? "Saved to Cove" : "History restored"), He;
    } catch (Ie) {
      return Se && o({ type: "discard", key: Se }), ce && W && (te(q), L(ge), D.current = ge, K.current = []), Ie.status === 409 ? (V("Conflict — loading the latest segment…"), await u()) : V(Ie.message || "Unable to save the segment."), null;
    } finally {
      $e();
    }
  }
  async function ie() {
    if (!r) return !1;
    const N = G.filter((U) => !U.published && U.reviewState === "approved").length;
    if (N === 0 || $ != null) return !1;
    const M = `complete-review:${Y.id}:${a.approvedSetVersion}`, J = t("publish", -1);
    if (!J) return !1;
    re(""), V(`Publishing ${N} Approved draft${N === 1 ? "" : "s"}…`);
    try {
      const U = await X(`/videos/${Y.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(M),
          expectedApprovedSetVersion: a.approvedSetVersion
        })
      });
      Ue(M), fe(Bt), ne(!1);
      const ce = await m(), R = $l(
        G,
        C.current,
        U.published
      ), W = R ? Qe(ce == null ? void 0 : ce.segments, R) : null;
      return W && L(W.id), V(`${U.published.length} Approved draft${U.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (U) {
      const ce = U.status === 409 ? "The approved drafts changed. Review the updated list and try again." : U.message || "Unable to publish the approved drafts.";
      return U.status === 409 && await u(), re(ce), V(ce), !1;
    } finally {
      J();
    }
  }
  async function z(N = null, M = null) {
    var Ze;
    if ($ != null || oe()) return;
    const J = N != null ? y.current : null, U = Number.isFinite(J) ? J : i, ce = Math.min(xe, U + 20);
    if (ce <= U) {
      V("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const R = kl(G, S, N);
    if (R.kind === "choose-tag") {
      y.current = U, V(""), T(!0);
      return;
    }
    if (R.kind === "invalid-selection") {
      V("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: W } = R, q = `create-draft:${Y.id}:${W}:${U}`, ge = r ? null : crypto.randomUUID(), Ce = C.current, $e = {
      ...S || {},
      id: p.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: W,
      tagName: M || (S == null ? void 0 : S.tagName) || "Tag segment",
      tagSortName: W === (S == null ? void 0 : S.tagId) && (S == null ? void 0 : S.tagSortName) || null,
      startSec: U,
      endSec: ce,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Se = t("create", -1);
    if (!Se) return;
    const Xe = Ld(a, $e);
    T(!1), f(Xe, Y.id), R.openTagEditor && (ae($e.id), w.current = $e.id, ue(!0)), E($e.id), le(It(
      Xt(Xe.segments, Xe.segmentGroups || [], Xe.performerSlots || []),
      $e.id
    ));
    try {
      let Ie;
      if (r) {
        const Ke = await X(`/videos/${Y.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: je(q), tagId: W, startSec: U, endSec: ce })
        });
        Ue(q), Ie = { itemId: (Ze = Ke.draft) == null ? void 0 : Ze.itemId };
      } else
        Ie = { nativeSegmentId: (await X(`/videos/${Y.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: W,
            startSec: U,
            endSec: ce,
            historyReceiptId: ge
          })
        })).id };
      y.current = null, T(!1);
      const He = await m();
      if (!He) {
        f((Ke) => to(
          Ke,
          [$e.id]
        ), Y.id), E(Ce), V(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${R.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
        return;
      }
      const Je = Qe(He == null ? void 0 : He.segments, Ie);
      Je ? (R.openTagEditor && (we.current && (w.current = Je.id), j((Ke) => (Ke == null ? void 0 : Ke.segmentId) === $e.id ? { ...Ke, segmentId: Je.id } : Ke), ae(Je.id)), E(Je.id), le(It(
        Xt(He.segments || [], He.segmentGroups || [], He.performerSlots || []),
        Je.id
      )), r || await ee(
        "segment.create",
        "Created segment",
        vt([], !1),
        vt([Je], !1),
        ge
      )) : (ue(!1), V(`Segment created, but it could not be selected${R.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
    } catch (Ie) {
      f((He) => to(
        He,
        [$e.id]
      ), Y.id), E(Ce), N != null && T(!0), V(Ie.message || "Unable to create the draft.");
    } finally {
      j((Ie) => (Ie == null ? void 0 : Ie.segmentId) === $e.id ? null : Ie), ae(null), Se();
    }
  }
  function oe() {
    return k == null || k.segmentId !== (S == null ? void 0 : S.id) ? !1 : (V("Close the tag field to save the new segment's tag first."), !0);
  }
  async function I() {
    if (A.length !== 1 || !S || $ != null || oe()) return;
    const N = i;
    if (N <= S.startSec || S.endSec != null && N >= S.endSec) {
      V("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const M = `split-draft:${S.itemId}:${S.revision}:${N}`, J = r ? null : vt([S], !1), U = r ? null : crypto.randomUUID(), ce = t("split", S.id);
    if (ce)
      try {
        let R = null;
        r && S.nativeSegmentId == null ? (await X(`/videos/${Y.id}/drafts/${S.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(M),
            expectedRevision: S.revision,
            splitSec: N
          })
        }), Ue(M)) : R = { nativeSegmentId: (await X(`/videos/${Y.id}/segments/${S.id}/split`, {
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
            J,
            vt(q, !1),
            U
          );
        }
        V(r ? `Segment split; both ranges remain ${S.reviewState}.` : "Segment split.");
      } catch (R) {
        R.status === 409 ? await u() : V(R.message || "Unable to split the draft.");
      } finally {
        ce();
      }
  }
  async function b(N = !1) {
    var R, W;
    if (A.length !== 1 || !S || $ != null || oe()) return;
    const M = N ? i : S.startSec, J = Sl(Y.id, S, N, M), U = r ? null : crypto.randomUUID(), ce = t("duplicate", S.id);
    if (ce)
      try {
        const q = ((R = h.current) == null ? void 0 : R.operationKey) === J ? h.current : null;
        let ge = (q == null ? void 0 : q.duplicateIdentity) ?? null;
        if (ge == null && r && S.nativeSegmentId == null) {
          const Se = await X(`/videos/${Y.id}/drafts/${S.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(J),
              expectedRevision: S.revision,
              startSec: N ? M : null
            })
          });
          ge = ta(!1, Se), h.current = { operationKey: J, duplicateIdentity: ge };
        } else if (ge == null) {
          const Se = await X(`/videos/${Y.id}/segments/${S.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: S.updatedAt,
              startSec: N ? M : null,
              historyReceiptId: U
            })
          });
          ge = ta(!0, Se), h.current = { operationKey: J, duplicateIdentity: ge };
        }
        const Ce = await m(), $e = Qe(Ce == null ? void 0 : Ce.segments, ge);
        if ($e) {
          r || await ee(
            "segment.duplicate",
            "Duplicated segment",
            vt([], !1),
            vt([$e], !1),
            U
          );
          const Se = Ya(
            $e,
            Ce.performerSlots || [],
            s,
            d,
            Ce.segmentGroups || []
          );
          _(Se.filters), P(Se.hideDerivedSegments), te([$e.id]), L($e.id), D.current = $e.id, K.current = [], le(It(
            Xt(Ce.segments || [], Ce.segmentGroups || [], Ce.performerSlots || []),
            $e.id
          )), r && S.nativeSegmentId == null && Ue(J), h.current = null, V(N ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          V("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (q) {
        ((W = h.current) == null ? void 0 : W.operationKey) === J ? V("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : q.status === 409 ? await u() : V(q.message || "Unable to duplicate the draft.");
      } finally {
        ce();
      }
  }
  async function v() {
    if (A.length !== 1 || !S) return;
    const N = Number(be), M = l.trim() === "" ? null : Number(l), J = qo(N, M, g);
    if (J.error) {
      V(J.error);
      return;
    }
    if (N === S.startSec && M === S.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await Q(S, { startSec: N, endSec: M, tagId: S.tagId }, !0, null, !0);
  }
  async function x(N, M) {
    if (A.length !== 1 || !S) return;
    const J = qo(N, M, g);
    if (J.error) {
      V(J.error);
      return;
    }
    if (N === S.startSec && M === S.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await Q(S, { startSec: N, endSec: M, tagId: S.tagId }, !0, null, !0);
  }
  return { acceptHistory: fe, recordHistoryAction: ee, mutateSegment: Q, completeReview: ie, createSegment: z, splitSegment: I, duplicateSegment: b, saveTiming: v, applyShortcutTiming: x };
}
function Bd() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(zo).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Gd() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(Ho).matches);
  return ye(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ho), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Ud() {
  try {
    return Ls(window.localStorage.getItem(Ba));
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
  const t = hi[e];
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
      ...yi(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${Ct[t].symbol}${e[t]}`)));
}
function Vd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = mo(a), [m, p] = B(() => Hr(o, f)), [h, y] = B(!1), [w, k] = B(""), j = pe(!1), E = o.map((D) => `${D.slotDefinitionId}:${D.performerId || ""}`).join("|"), $ = f.map((D) => ot(D)).join("|"), G = di(
    o,
    f
  );
  ye(() => {
    p(Hr(o, f)), k("");
  }, [t, r, E, $]);
  async function S(D = m) {
    if (!j.current) {
      j.current = !0, y(!0), k("Saving performer slots…");
      try {
        const K = Hr(o.map((T) => ({
          ...T,
          performerId: D[T.slotDefinitionId] || null
        })), f), ae = o.map((T) => {
          const P = K[T.slotDefinitionId] ? Number(K[T.slotDefinitionId]) : null, H = f.find((ne) => String(ot(ne)) === String(P));
          return {
            ...T,
            performerId: P,
            performerName: (H == null ? void 0 : H.name) || null
          };
        });
        s(ae);
        const _ = await X(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((T) => ({ slotDefinitionId: T.slotDefinitionId, performerId: K[T.slotDefinitionId] ? Number(K[T.slotDefinitionId]) : null }))
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
      } catch (K) {
        d && await d(o, K), K.status === 409 ? (k("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : k(K.message || "Unable to save performer slots.");
      } finally {
        j.current = !1, y(!1);
      }
    }
  }
  function C(D, K) {
    k(`Option ${K + 1} applied; save to confirm.`), p({ ...m, ...D.assignments });
  }
  async function A(D) {
    const K = { ...m, ...D.assignments };
    p(K), await S(K);
  }
  return ye(() => {
    if (u)
      return u.current = (D) => j.current || !G[D] ? !1 : (A(G[D]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    G.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, G.map((D, K) => n("button", {
        key: K,
        type: "button",
        disabled: h,
        onClick: () => C(D, K),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${K + 1}: ${D.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, K + 1),
        n("span", { key: "description" }, D.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${G.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((D) => n("label", { key: D.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, gt(D)),
      (D.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(D.genderHints || []).map(vr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[D.slotDefinitionId] || "", disabled: h, onChange: (K) => p({ ...m, [D.slotDefinitionId]: K.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ci(f, f, D.genderHints).map((K) => n("option", { key: ot(K), value: ot(K) }, K.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: h, onClick: () => S(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function Jd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var G;
  const s = ((G = t[0]) == null ? void 0 : G.slots) || [], l = mo(r), d = di(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((S, C) => {
    const A = t.map((D) => {
      var K;
      return String(((K = D.slots[C]) == null ? void 0 : K.performerId) || "");
    });
    return [S.slotDefinitionId, A.every((D) => D === A[0]) ? A[0] : c];
  })), [u, f] = B(g), [m, p] = B(!1), [h, y] = B(""), w = pe(!1), k = t.map((S) => `${S.itemId ?? `native:${S.segmentId}`}:${S.revision}:${S.slots.map((C) => `${C.slotDefinitionId}:${C.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    f(g());
  }, [k]);
  async function j(S = u) {
    if (w.current) return;
    w.current = !0, p(!0), y(`Saving performer slots for ${t.length} segments…`);
    const C = [];
    try {
      for (const A of t) {
        const D = A.slots.map((ae, _) => {
          const T = S[s[_].slotDefinitionId];
          return {
            slotDefinitionId: ae.slotDefinitionId,
            performerId: T === c ? ae.performerId || null : T ? Number(T) : null
          };
        }), K = await X(A.itemId != null ? `/videos/${e}/drafts/${A.itemId}/slots` : `/videos/${e}/segments/${A.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: A.revision, assignments: D })
        });
        C.push({
          segmentId: A.segmentId,
          itemId: A.itemId,
          revision: K.revision,
          slots: K.slots || []
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
    f(C), await j(C);
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
        ...ci(l, l, S.genderHints).map((C) => n("option", {
          key: ot(C),
          value: ot(C)
        }, C.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: m,
        onClick: () => j(),
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
  const [r, o] = B(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = Yd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
  const [u, f] = B([]), m = e.flatMap((w) => w.lanes.map((k) => k.key)), p = m.join("|");
  ye(() => {
    const w = new Set(m);
    f((k) => k.filter((j) => w.has(j)));
  }, [p]);
  const h = br(t), y = !!ki(
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
        const j = u.includes(k.key), E = k.markers.some(({ segment: G }) => G.id === r), $ = `selected-segment-lane-${k.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: k.key,
          "data-selected-segment-lane": k.key,
          className: `rounded-md border ${E ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": j,
            "aria-controls": $,
            "aria-current": E ? "true" : void 0,
            onClick: () => f((G) => j ? G.filter((S) => S !== k.key) : [...G, k.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, j ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, qn(k)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(k.selectedCount)),
            a ? n(Ht, { key: "states", counts: k.counts }) : null
          ]),
          j ? n("div", {
            key: "segments",
            id: $,
            className: "space-y-1 border-t border-border p-1.5"
          }, k.markers.map(({ segment: G }) => {
            const S = G.endSec == null ? Me(G.startSec) : `${Me(G.startSec)} – ${Me(G.endSec)}`;
            return n("button", {
              key: G.id,
              type: "button",
              onClick: () => i(G),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${G.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${G.tagName || "Segment"}, ${G.reviewState}, ${S}` : `${G.tagName || "Segment"}, ${S}`,
              "aria-current": G.id === r ? "true" : void 0
            }, [
              a ? n(tn, {
                key: "state",
                state: G.reviewState,
                includeLabel: !1
              }) : null,
              G.isDerived ? n(Sr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, S),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                $t(G.sourceKey)
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
function Ci(e, t, r) {
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
function $i({ item: e, showReviewStates: t = !1 }) {
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
function Ti({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
      n(Ti, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, vs(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n($i, { item: e, showReviewStates: r }))
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
    n(Ti, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
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
        n($i, { key: "segments", item: e, showReviewStates: r })
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
      ) ? n(Ai, { key: "bin", onNavigate: t }) : null,
      n(Ri, { key: "settings", onNavigate: t })
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
function Ai({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = B(null);
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
function Ri({ onNavigate: e, compact: t = !1 }) {
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
  const o = pe(null), [i, a] = B("maximum"), s = (f, m) => {
    const p = Hs(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var h;
    const p = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    p && s(f, zs(m.clientX, p.left, p.width));
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
            const w = Number(ot(y));
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
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(ri)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
  const s = Dd(e), [l, d] = B([]), c = s.map((g) => g.tagName).join("|");
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
            const h = `${Me(p.startSec)}${p.endSec == null ? "" : ` – ${Me(p.endSec)}`}`, y = r === p.id;
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
  const [o, i] = B(""), [a, s] = B(0), l = pe(null), d = qe(() => zl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = _l(d);
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
      const p = f.segment || f, h = p.endSec == null ? Me(p.startSec) : `${Me(p.startSec)} – ${Me(p.endSec)}`, y = `${$t(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = m === c, k = m > 0 ? d[m - 1].groupKey : null, j = g && f.groupKey !== k ? n("div", {
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
      return j ? [j, E] : [E];
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
  const s = qe(() => mc(e), [e]), [l, d] = B([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = pe(null);
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
            const y = h.endSec == null ? Me(h.startSec) : `${Me(h.startSec)} – ${Me(h.endSec)}`, w = `${$t(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
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
  const a = Kl(e), [s, l] = B(() => /* @__PURE__ */ new Set()), [d, c] = B(() => new Set(a.map((h) => h.key))), g = a.flatMap((h) => d.has(h.key) ? h.candidates : []), u = (h) => l((y) => {
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
            const w = y.endSec == null ? Me(y.startSec) : `${Me(y.startSec)} – ${Me(y.endSec)}`, k = `${$t(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
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
  const [s, l] = B(!1), d = pe(null);
  if (fo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Me(e.endSec);
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
        `${Me(e.startSec)} – ${c}`
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
                `${m.rootTagName} @ ${Me(m.rootStartSec)}`
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
  acquireSaveLock: j,
  onSlotsChanged: E,
  onRecordHistory: $,
  onCancelQueuedReview: G,
  splitSegment: S,
  duplicateSegment: C,
  provenance: A,
  lineage: D,
  onNavigateLineageItem: K,
  tagEditing: ae,
  onCancelTagEditing: _,
  detailPanelRef: T,
  onReduceSelection: P
}) {
  var xe, Y, fe, ee;
  const H = pe(null), ne = pe(null), re = () => {
    var Q;
    (Q = ne.current) == null || Q.call(ne), ne.current = null;
  }, V = pe(null), le = pe(null), L = pe(null), te = pe(null), [ue, be] = B(!1);
  ye(() => {
    H.current && (H.current.scrollTop = 0), be(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var Q, ie;
    ue && ((ie = (Q = V.current) == null ? void 0 : Q.querySelector("input, select, button")) == null || ie.focus({ preventScroll: !0 }));
  }, [ue]);
  function we() {
    be(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = h.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const Q = !r.some((oe) => oe.isDerived), ie = e && g ? gd(f, r) : null, z = (ie == null ? void 0 : ie.map((oe, I) => {
      var v;
      const b = r[I];
      return {
        segmentId: b.nativeSegmentId,
        itemId: b.published ? null : b.itemId,
        revision: (v = m.performerSlotRevisions) == null ? void 0 : v[b.id],
        slots: oe
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
        tagEditable: Q,
        slotsEditable: z.length > 0 && a == null,
        onEditSlots: () => be(!0),
        slotButtonRef: h,
        saveMessage: i
      }),
      ae && Q ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (oe) => {
          oe.target === oe.currentTarget && _();
        },
        onKeyDownCapture: (oe) => yt(oe, { onCancel: _ })
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
          onChange: (oe, I) => oe == null ? _() : l(oe, I == null ? void 0 : I.label),
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
      ue && z.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (oe) => {
          oe.target === oe.currentTarget && we();
        },
        onKeyDownCapture: (oe) => {
          var b, v;
          if (!(typeof ((b = oe.target) == null ? void 0 : b.closest) == "function" ? oe.target.closest("input, textarea, select, [contenteditable='true']") : null) && !oe.repeat && !oe.ctrlKey && !oe.altKey && !oe.metaKey && !oe.shiftKey && /^[1-9]$/.test(oe.key) && ((v = te.current) != null && v.call(te, Number(oe.key) - 1))) {
            oe.preventDefault(), oe.stopPropagation();
            return;
          }
          yt(oe, { onCancel: we });
        }
      }, n("section", {
        ref: V,
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
          n("button", { key: "close", type: "button", onClick: we, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jd, {
          videoId: p.id,
          targets: z,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: te,
          onSaved: async ({ beforeState: oe, afterState: I }) => {
            await $(
              "performer-slots.assign",
              `Assigned performers to ${z.length} segments`,
              oe,
              I
            ), we(), E();
          },
          onConflict: E
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (Q) => {
      H.current = Q, T && (T.current = Q);
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
        t && ae ? n("div", {
          key: "tag-editor",
          ref: y,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (Q) => {
            Q.key === "Escape" && (Q.preventDefault(), Q.stopPropagation(), _());
          },
          onKeyDown: (Q) => {
            dd(Q, t.tagName) && (Q.preventDefault(), Q.stopPropagation(), l(t.tagId));
          }
        }, n(Hn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (Q, ie) => Q == null ? _() : l(Q, ie == null ? void 0 : ie.label),
          disabled: wl(a, t.id, s) || ((xe = D.data) == null ? void 0 : xe.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Me(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Me(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Wd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(wi, {
        assignments: u.map((Q) => {
          const ie = bd(Q);
          return {
            key: String(Q.slotDefinitionId),
            label: ie.label,
            performer: ie.filled ? { id: Number(Q.performerId), name: ie.performer } : null,
            title: ie.title
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
          (Y = D.data.parents) != null && Y.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...D.data.parents.map((Q) => n("button", {
              key: Q.nodeId,
              type: "button",
              onClick: () => K(Q.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${Q.ruleKey} ${Q.ruleVersion}`))
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
          onClick: () => be(!0),
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
    ue && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (Q) => {
        Q.target === Q.currentTarget && we();
      },
      onKeyDownCapture: (Q) => {
        var z, oe;
        if (!(typeof ((z = Q.target) == null ? void 0 : z.closest) == "function" ? Q.target.closest("input, textarea, select, [contenteditable='true']") : null) && !Q.repeat && !Q.ctrlKey && !Q.altKey && !Q.metaKey && !Q.shiftKey && /^[1-9]$/.test(Q.key) && ((oe = L.current) != null && oe.call(L, Number(Q.key) - 1))) {
          Q.preventDefault(), Q.stopPropagation();
          return;
        }
        yt(Q, {
          onCancel: we,
          onConfirm: () => {
            var I;
            return (I = le.current) == null ? void 0 : I.click();
          }
        });
      }
    }, n("section", {
      ref: V,
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
        n("button", { key: "close", type: "button", onClick: we, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ee = m.performerSlotRevisions) == null ? void 0 : ee[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: le,
        shortcutRef: L,
        onOptimisticSave: (Q) => {
          w((ie) => _r(
            ie,
            t.id,
            Q
          ), p.id), re(), ne.current = j("slots", t.id), k("Saving performer slots…"), we();
        },
        onSaved: async (Q, { beforeState: ie, afterState: z }) => {
          w((oe) => _r(
            oe,
            t.id,
            Q.slots || [],
            Q.revision
          ), p.id), k("Performer slots saved.");
          try {
            await $(
              "performer-slots.assign",
              "Assigned performers",
              ie,
              z
            ), await E(Q) || G([t]);
          } finally {
            re();
          }
        },
        onRollback: async (Q, ie) => {
          G([t]), w((z) => {
            var oe;
            return _r(
              z,
              t.id,
              Q,
              (oe = m.performerSlotRevisions) == null ? void 0 : oe[t.id]
            );
          }, p.id), k(ie.message || "Unable to save performer slots.");
          try {
            ie.status === 409 && await E();
          } finally {
            re();
          }
        },
        onConflict: E
      }))
    ])) : null
  ]);
}
function xc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: h, onSelectAll: y, onConfigureTag: w, onSeekTime: k, centerRef: j, showReviewState: E = !0, swimlaneTitleWidth: $, onSwimlaneTitleWidthChange: G }) {
  const S = pe(null), C = pe(null), [A, D] = B(0), [K, ae] = B({ scrollTop: 0, height: 320 }), [_, T] = B(null), P = qe(
    () => Xt(e, r, o),
    [e, r, o]
  ), H = qe(
    () => xi(o),
    [o]
  ), ne = qe(() => ho(P), [P]), re = qe(
    () => kd(ne, i, r.length > 0),
    [ne, i, r.length]
  ), V = qe(
    () => Si(re.rows, Math.max(0, K.scrollTop - 24), K.height),
    [re, K]
  ), le = Math.max(0, Number(d) || 0), L = Os(A), te = ur($, L), ue = te / 16, be = Ds(c, le, ue), we = Ts(le), xe = As(le, Math.max(1, A - ue * 16), g), Y = we.filter((v, x) => x === 0 || x % xe === 0), fe = qe(() => P.map((v) => `${v.key}:${v.trackCount}:${v.markers.map(({ segment: x, track: N }) => `${x.id}:${x.startSec}:${x.endSec ?? ""}:${N}`).join(",")}`).join("|"), [P]);
  function ee() {
    const v = C.current;
    if (!v) return;
    const x = v.querySelector("[data-timeline-track]"), N = v.firstElementChild, M = x == null ? void 0 : x.getBoundingClientRect(), J = N == null ? void 0 : N.getBoundingClientRect(), U = M && J ? Math.max(0, M.left - J.left) : ue * 16, ce = (J == null ? void 0 : J.width) ?? v.scrollWidth;
    v.scrollTo({
      left: Es(c, le, ce, v.clientWidth, U, _a),
      behavior: "smooth"
    });
  }
  ye(() => (j.current = ee, () => {
    j.current === ee && (j.current = null);
  })), ye(() => {
    ee();
  }, [g]);
  function Q() {
    const v = C.current, x = re.rows.find((ce) => ce.kind === "lane" && ce.lane.markers.some(({ segment: R }) => R.id === s));
    if (!v || !x) return;
    const N = 24, M = x.top + N, J = M + x.height;
    let U = v.scrollTop;
    M < v.scrollTop + N ? U = Math.max(0, M - N) : J > v.scrollTop + v.clientHeight && (U = Math.max(0, J - v.clientHeight)), U !== v.scrollTop && (v.scrollTop = U), ae({ scrollTop: U, height: v.clientHeight });
  }
  ye(() => {
    Q();
  }, [s, fe, re]), ye(() => {
    const v = C.current, x = re.rows.find((ce) => ce.kind === "group" && ce.group.key === a);
    if (!v || !x) return;
    const N = 24, M = x.top + N, J = M + x.height;
    let U = v.scrollTop;
    M < v.scrollTop + N ? U = Math.max(0, M - N) : J > v.scrollTop + v.clientHeight && (U = Math.max(0, J - v.clientHeight)), U !== v.scrollTop && (v.scrollTop = U), ae({ scrollTop: U, height: v.clientHeight });
  }, [a, re]), ye(() => {
    const v = C.current;
    if (!v || typeof ResizeObserver > "u") return;
    const x = () => {
      D(v.clientWidth), ae({ scrollTop: v.scrollTop, height: v.clientHeight }), Q();
    }, N = new ResizeObserver(x);
    return N.observe(v), x(), () => N.disconnect();
  }, [s, fe, re]);
  function ie(v) {
    if (!(le > 0)) return;
    const x = v.currentTarget.getBoundingClientRect(), N = Math.min(1, Math.max(0, (v.clientX - x.left) / x.width));
    k(N * le);
  }
  function z(v) {
    const x = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let N = null;
    Object.hasOwn(x, v.key) && (N = c + x[v.key]), v.key === "Home" && (N = 0), v.key === "End" && (N = le), N != null && (v.preventDefault(), v.stopPropagation(), k(Math.min(le, Math.max(0, N))));
  }
  function oe(v) {
    var N;
    const x = (N = S.current) == null ? void 0 : N.getBoundingClientRect();
    x && G(ur(v.clientX - x.left, L));
  }
  function I(v) {
    const x = v.shiftKey ? 40 : 16;
    let N = null;
    v.key === "ArrowLeft" && (N = te - x), v.key === "ArrowRight" && (N = te + x), v.key === "Home" && (N = 160), v.key === "End" && (N = L), N != null && (v.preventDefault(), v.stopPropagation(), G(ur(N, L)));
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
      "aria-valuemax": Math.round(L),
      "aria-valuenow": Math.round(te),
      "aria-valuetext": `${Math.round(te)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (v) => {
        v.currentTarget.setPointerCapture(v.pointerId), oe(v);
      },
      onPointerMove: (v) => {
        v.currentTarget.hasPointerCapture(v.pointerId) && oe(v);
      },
      onKeyDown: I,
      onDoubleClick: () => G(ft.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${te - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: C,
      onScroll: (v) => ae({
        scrollTop: v.currentTarget.scrollTop,
        height: v.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ps(g) }, [
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
          "aria-valuemax": le,
          "aria-valuenow": Math.min(le, Math.max(0, c)),
          "aria-valuetext": Me(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: ie,
          onKeyDown: z
        }, Y.map((v, x) => n("span", {
          key: v,
          className: `absolute top-0 ${Rs(x, Y.length, le > 0 ? v / le * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ms(x, Y.length, le > 0 ? v / le * 100 : 0)
        }, Me(v))).concat(t.map((v) => {
          const x = le > 0 ? v.startSec / le * 100 : 0;
          return n("button", {
            key: `shot-boundary:${v.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Me(v.startSec)} – ${Me(v.endSec)}`,
            title: `Shot boundary · ${v.source || "manual"} · ${Me(v.startSec)} – ${Me(v.endSec)}`,
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
            ...Wo(be),
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
        style: P.length > 0 ? { height: re.height } : void 0
      }, [
        P.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...Wo(be, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        P.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : V.map((v) => {
          var W;
          const x = v.group, N = i.includes(x.key), M = a === x.key, J = hr(M);
          if (v.kind === "group") return n("div", {
            key: v.key,
            "data-segment-group": x.key,
            "data-segment-group-collapsed": N ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              backgroundColor: J,
              top: v.top,
              height: v.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (q) => {
                if (q.metaKey || q.ctrlKey) {
                  h(x.lanes.flatMap((ge) => ge.markers.map((Ce) => Ce.segment.id)));
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
                backgroundColor: J
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
          const U = v.lane, ce = od(v.laneIndex), R = U.markers.some(({ segment: q }) => q.id === s);
          return n("div", {
            key: v.key,
            "data-grouped-swimlane": x.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ue}rem minmax(0,1fr)`,
              top: v.top,
              height: v.height,
              backgroundColor: ce
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": R ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: ad(R, ce),
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
              var Ke;
              const Ce = Wr(q.startSec, le), $e = q.endSec == null ? q.startSec : Math.max(q.startSec, q.endSec), Se = Math.max(0, Wr($e, le) - Ce), Xe = l.includes(q.id), Ze = q.id === s, Ie = bo(H.get(q.id)), He = q.endSec == null ? Me(q.startSec) : `${Me(q.startSec)} – ${Me(q.endSec)}`, Je = (Ke = hi[Ie]) == null ? void 0 : Ke.label;
              return n("button", {
                key: q.id,
                type: "button",
                onClick: (Z) => {
                  Z.stopPropagation(), p(q, {
                    additive: Z.metaKey || Z.ctrlKey,
                    rangeSegmentIds: Z.shiftKey ? U.markers.map((de) => de.segment.id) : null
                  });
                },
                "aria-pressed": Xe,
                "aria-current": Ze ? "true" : void 0,
                "data-selected-timeline-marker": Ze ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ze ? "true" : void 0,
                "aria-label": E ? `${q.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${q.reviewState}${Je ? `, ${Je}` : ""}, ${He}` : `${q.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${He}`,
                title: E ? `${q.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${q.reviewState}${Je ? ` · ${Je}` : ""} · ${He}` : `${q.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${He}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...E ? td(q.reviewState, Xe, Ie, Ze) : nd(Xe, Ze),
                  left: `${Ce}%`,
                  top: `${id(ge)}rem`,
                  width: rd(q.endSec, Se),
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
  const [a, s] = B(null), [l, d] = B([]), [c, g] = B(null), [u, f] = B(""), [m, p] = B(!0), [h, y] = B(null), [w, k] = B(""), [j, E] = B(!1), $ = pe(null), G = pe(0);
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
      const H = P.find((ne) => (ne.tags || []).some((re) => Number(re.tagId) === Number(e)));
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
      definitions: H.map((ne, re) => ({ ...ne, sortOrder: re }))
    });
  }
  function A(_) {
    const T = a.definitions[_], P = Number(T.assignmentCount) || 0, H = P === 0 ? "" : ` and its ${P} assignment${P === 1 ? "" : "s"}`;
    window.confirm(`Delete “${gt(T)}”${H}?`) && (P > 0 && E(!0), s({
      ...a,
      definitions: a.definitions.filter((ne, re) => re !== _).map((ne, re) => ({ ...ne, sortOrder: re }))
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
          confirmDeleteAssigned: j,
          definitions: a.definitions.map((P, H) => {
            var ne;
            return {
              id: P.id || void 0,
              label: ((ne = P.label) == null ? void 0 : ne.trim()) || null,
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
  async function K() {
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
          const H = T.value.find((re) => (re.tags || []).some((V) => Number(V.tagId) === Number(e))), ne = (H == null ? void 0 : H.id) ?? null;
          g(ne), f(ne == null ? "" : String(ne));
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
  const ae = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
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
          onClick: K,
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
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ns.map((P) => n("label", { key: P, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: h != null,
                  checked: (_.genderHints || []).includes(P),
                  onChange: (H) => S(T, {
                    genderHints: H.target.checked ? [.../* @__PURE__ */ new Set([..._.genderHints || [], P])] : (_.genderHints || []).filter((ne) => ne !== P)
                  })
                }),
                n("span", { key: "text" }, vr(P))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${_.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: h != null || T === 0, onClick: () => C(T, -1), className: ae, "aria-label": `Move ${gt(_)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: h != null || T === a.definitions.length - 1, onClick: () => C(T, 1), className: ae, "aria-label": `Move ${gt(_)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: h != null, onClick: () => A(T), className: `${ae} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++G.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: ae
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
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: h, centerTimelineRef: y, closeEditorFilters: w, closeFirstSegmentTagDialog: k, closeMaterializeDialog: j, closeMergeConfirmation: E, closePublishApprovedDialog: $, closeTagEditing: G, collapsedSegmentGroups: S, commonActionsRef: C, compatibilityMode: A, configuringTag: D, createSegment: K, creatingSegmentId: ae, currentTime: _, deleteRejectedSegments: T, detail: P, detailPanelRef: H, detailWidth: ne, duplicateSegment: re, editorFilters: V, editorLayout: le, editorRef: L, exportingExamples: te, filtersButtonRef: ue, filtersOpen: be, firstSegmentTagOpen: we, focusRowRef: xe, handleSeparatorKeyDown: Y, handleSeparatorPointerDown: fe, handleSeparatorPointerMove: ee, hasNextUnreviewed: Q, hasPreviousUnreviewed: ie, hideDerivedSegments: z, history: oe, historyOpen: I, historySaving: b, horizontalLayoutSize: v, importNativeSegments: x, incorrectExamples: N, incorrectExamplesOpen: M, lineage: J, markerRailWidth: U, materializeButtonRef: ce, materializeCancelButtonRef: R, materializeDerivedSegments: W, materializeError: q, materializeLoading: ge, materializeOpen: Ce, materializePreview: $e, materializing: Se, mediaStackRef: Xe, mergeCancelButtonRef: Ze, mergeConfirmation: Ie, mergeSaving: He, mergeSelectedSwimlane: Je, nativeImportState: Ke, onDetailChange: Z, onNavigate: de, onReload: Ee, onSlotsChanged: Be, openPublishApprovedDialog: ke, panelSeparatorProps: _e, pendingInitialSeekRef: Ye, performerSlots: Ne, performerSlotsAvailable: he, playbackControlsRef: We, previewDerivedSegments: Pe, provenance: Te, provenanceSources: et, publishApprovedCancelButtonRef: Ge, publishApprovedDrafts: Oe, publishApprovedError: De, publishApprovedOpen: ze, quickSearchOpen: Pt, railScrollRef: Le, railToggleRef: St, recordHistoryAction: An, rejectedDeletionPreview: dt, removeIncorrectExample: Ae, removingExampleId: Re, restoreHistoryTarget: Ve, runEditorAction: bt, saveMessage: st, saveTag: Ut, saveTiming: pt, savingSegmentId: at, seekRef: Ot, segmentGroups: Rn, segmentRailLayout: nn, segments: Tt, selectAllVideoSegments: qt, selectSegment: rn, selectSegmentCollection: kr, selectedGroups: on, selectedPerformerSlots: wr, selectedSegment: kt, selectedSegmentGroupKey: Wt, selectedSegmentIds: Yn, selectedSegments: Vt, selectedSlotStatus: Mn, setAutoAssignError: Qn, setAutoAssignOpen: an, setConfiguringTag: Kt, setCurrentTime: sn, setEditorFilters: Zn, setEditorLayout: Nr, setFiltersOpen: Xn, setHideDerivedSegments: Ir, setHistoryOpen: ln, setIncorrectExamplesOpen: dn, setQuickSearchOpen: En, setRailViewport: cn, setRejectedDeletionPreview: Cr, setSaveMessage: er, setSelectedSegmentGroupKey: un, setSelectedSegmentId: Jt, setShortcutsOpen: mn, setTimelineZoom: Dn, shotBoundaries: ct, shortcutsOpen: tr, slotButtonRef: Pn, splitLayout: At, splitSegment: nr, startFullAnalysis: gn, stepVideoFrame: pn, tagEditing: $r, tagSearchRef: Tr, timelineDuration: Ar, timelineRatioBounds: fn, timelineZoom: On, toggleSegmentGroup: yn, toggleSegmentRail: tt, updateTimelineRatio: lt, video: it, videoPerformers: rr, visibleCounts: wt, visibleSegmentRailRows: ht, visibleSegments: or, wideLayout: Lt, workspaceRef: Ln } = e, bn = qe(
    () => Tt.filter((O) => !O.published && O.reviewState === "approved"),
    [Tt]
  ), Fn = xs(ao), jn = bn.length, hn = $e ? $e.createCount + $e.linkCount : null, Rt = at != null, Yt = Vt.length > 0, Mt = Vt.length === 1, Ft = Yt && Vt.every((O) => O.reviewState === "approved"), Rr = Yt && Vt.every((O) => O.reviewState === "rejected"), Mr = [
    { id: "marker.create", label: "New segment", disabled: Rt },
    { id: "marker.editTag", label: "Edit tag", disabled: Rt || !Yt },
    { id: "marker.setStart", label: "Set start", disabled: Rt || !Mt },
    { id: "marker.setEnd", label: "Set end", disabled: Rt || !Mt },
    { id: "marker.split", label: "Split", disabled: Rt || !Mt },
    ...A ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !ie, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Ft ? "Unapprove" : "Approve", disabled: Rt || !Yt, tone: "approve" },
      { id: "marker.reject", label: Rr ? "Unreject" : "Reject", disabled: Rt || !Yt, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !Q, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...A ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Rt || !p, tone: "reject" }
    ]
  ];
  function Er(O) {
    const ve = Yn.includes(O.id), me = O.id === (kt == null ? void 0 : kt.id), nt = O.endSec == null ? Me(O.startSec) : `${Me(O.startSec)} – ${Me(O.endSec)}`, jt = `${$t(O.sourceKey)}${O.confidence != null ? ` · ${Math.round(O.confidence * 100)}%` : ""}`;
    return n("button", {
      key: O.id,
      type: "button",
      onClick: (Et) => rn(O, { additive: Et.metaKey || Et.ctrlKey }),
      "aria-pressed": ve,
      "aria-current": me ? "true" : void 0,
      "data-selected-segment-shortcut-target": me ? "true" : void 0,
      "aria-label": A ? `${O.tagName || "Tag segment"}, ${O.reviewState}${O.isDerived ? ", derived segment" : ""}, ${nt}` : `${O.tagName || "Tag segment"}${O.isDerived ? ", derived segment" : ""}, ${nt}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: bi(ve, me)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        A ? n(tn, { key: "review", state: O.reviewState, includeLabel: !1 }) : null,
        O.isDerived ? n(Sr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          O.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, nt),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: jt
        }, jt)
      ])
    ]);
  }
  const vn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", xn = [...oe.actions || []].reverse().find((O) => O.sequence <= oe.cursorSequence);
  return n("section", {
    ref: L,
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
            onClick: (O) => Ci(O, de, { page: "segment-studio" }),
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
            key: ot(O),
            performer: { id: ot(O), name: O.name },
            compact: !0,
            tooltip: O.name
          })),
          A ? n(Ht, { key: "review-counts", counts: wt }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          A ? null : n(Ai, { key: "bin", onNavigate: de, compact: !0 }),
          n(Ri, { key: "settings", onNavigate: de, compact: !0 })
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
        Ke.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, Ke.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
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
        Ke.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, Ke.error) : null
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
                  var nt;
                  (nt = me.currentTarget.closest("details")) == null || nt.removeAttribute("open"), gn(ve);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, O)))
            ])
          ]) : null,
          A ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: at != null || d.length === 0,
            onClick: () => {
              Qn(""), an(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          A ? n("button", {
            key: "materialize-derived",
            ref: ce,
            type: "button",
            disabled: at != null || ge || Se || hn === 0,
            onClick: Pe,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, ge ? "Analyzing…" : `Auto-Materialize${hn != null ? ` (${hn})` : ""}`) : null,
          A ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: at != null || jn === 0,
            onClick: (O) => ke(O.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": ze,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${jn ? ` (${jn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: te || Re != null || N.length === 0,
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
            ref: ue,
            type: "button",
            onClick: () => Xn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": be,
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
            disabled: (A ? oe.actions.length === 0 : xn == null) || at != null || b,
            onClick: A ? () => ln((O) => !O) : () => Ve(
              xn.sequence - 1
            ),
            "aria-haspopup": A ? "dialog" : void 0,
            "aria-expanded": A ? I : void 0,
            className: vn
          }, [
            n(dr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, A ? `History${oe.actions.length ? ` (${oe.actions.length})` : ""}` : xn ? `Undo ${xn.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: St,
            type: "button",
            onClick: tt,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": le.markerRailOpen,
            className: vn
          }, [
            n(dr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, le.markerRailOpen ? "Hide segment rail" : "Show segment rail")
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
        ...[...oe.actions].reverse().map((O) => n("button", {
          key: O.sequence,
          type: "button",
          disabled: b,
          onClick: () => Ve(O.sequence),
          "aria-current": oe.cursorSequence === O.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${O.sequence > oe.cursorSequence ? "text-secondary" : "text-foreground"} ${oe.cursorSequence === O.sequence ? "bg-accent/15" : ""}`
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
          onClick: () => Ve(oe.baselineSequence),
          "aria-current": oe.cursorSequence === oe.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${oe.cursorSequence === oe.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    be ? n(lc, {
      key: "editor-filters",
      filters: V,
      hideDerivedSegments: z,
      performers: rr,
      provenanceSources: et,
      reviewCounts: l,
      segments: Tt,
      segmentGroups: Rn,
      reviewMode: A,
      onChange: Zn,
      onHideDerivedChange: Ir,
      onClose: w
    }) : null,
    we ? n(sc, {
      key: "first-segment-tag-dialog",
      saving: at != null,
      error: st,
      onSelect: (O, ve) => K(O, ve),
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
          return (O = L.current) == null ? void 0 : O.focus({ preventScroll: !0 });
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
    Ie ? n(yc, {
      key: "merge-selection-dialog",
      merge: Ie,
      processing: He,
      undoable: !A,
      cancelButtonRef: Ze,
      onConfirm: (O) => Je(!0, O, Ie),
      onClose: E
    }) : null,
    Ce ? n(hc, {
      key: "materialize-derived-dialog",
      preview: $e,
      loading: ge,
      processing: Se,
      error: q,
      cancelButtonRef: R,
      onConfirm: W,
      onClose: () => {
        Se || j();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Ln,
      className: `${At ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      le.markerRailOpen ? n("aside", {
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
            const nt = S.includes(O.group.key), jt = O.group.lanes.reduce((Et, Dr) => Et + Dr.markers.length, 0);
            ve = n("button", {
              type: "button",
              onClick: () => {
                un(O.group.key), yn(O.group.key);
              },
              "aria-expanded": !nt,
              "aria-current": Wt === O.group.key ? "true" : void 0,
              "data-segment-rail-group": O.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Wt === O.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, nt ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: O.group.name }, O.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, jt),
              A && nt ? n(Ht, { key: "states", counts: O.group.counts }) : null
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
          ref: Xe,
          className: `${At ? "min-h-0 flex-1" : ""} grid`,
          style: At ? {
            gridTemplateRows: `minmax(16rem, ${(1 - le.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${le.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: xe,
            className: "grid min-h-0 gap-2",
            style: Lt ? {
              gridTemplateColumns: le.markerRailOpen ? `${ne}px 0.5rem minmax(0,1fr) 0.5rem ${U}px` : `${ne}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(vc, {
              key: "tools",
              compatibilityMode: A,
              selectedSegment: kt,
              selectedSegments: Vt,
              selectedGroups: on,
              saveMessage: st,
              savingSegmentId: at,
              creatingSegmentId: ae,
              acquireSaveLock: t,
              setSaveMessage: er,
              saveTag: Ut,
              slotStatus: Mn,
              performerSlotsAvailable: he,
              selectedPerformerSlots: wr,
              performerSlots: Ne,
              detail: P,
              onDetailChange: Z,
              onCancelQueuedReview: m,
              video: it,
              slotButtonRef: Pn,
              tagSearchRef: Tr,
              tagEditing: $r,
              onCancelTagEditing: G,
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
              duplicateSegment: re,
              provenance: Te,
              lineage: J,
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
            Lt && le.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ..._e("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Lt && le.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: C,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Mr.map((O) => {
              var nt;
              const ve = (nt = Fn[O.id]) == null ? void 0 : nt[0], me = O.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : O.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
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
              }, n(Ss, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !it.videoFile,
                onClick: () => pn(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ks, { className: "h-4 w-4", "aria-hidden": !0 }))
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
            "aria-valuenow": Math.round(le.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(le.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: fe,
            onPointerMove: ee,
            onKeyDown: Y,
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
            swimlaneTitleWidth: le.swimlaneTitleWidth,
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
      onSaved: Ee,
      onClose: () => {
        const O = D.trigger;
        Kt(null), requestAnimationFrame(() => {
          var ve;
          O != null && O.isConnected ? O.focus({ preventScroll: !0 }) : (ve = L.current) == null || ve.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    ze ? n(gc, {
      key: "publish-approved-dialog",
      drafts: bn,
      processing: at === -1,
      error: De,
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
          return (O = L.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Cr(null), requestAnimationFrame(() => {
          var O;
          return (O = L.current) == null ? void 0 : O.focus({ preventScroll: !0 });
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
      exporting: te,
      removingExampleId: Re,
      onExport: h,
      onRemove: Ae,
      onClose: () => dn(!1)
    }) : null
  ]);
}
function wc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: h, setSelectedSegmentId: y, setSelectedSegmentIds: w } = e;
  function k(S) {
    const C = It(t, S);
    C && u((A) => Ni(A, C));
  }
  function j(S) {
    y(S), w(S == null ? [] : [S]), c.current = S, g.current = [];
  }
  function E(S, {
    focusEditor: C = !1,
    seekToSegment: A = !1,
    additive: D = !1,
    rangeSegmentIds: K = null
  } = {}) {
    var _, T;
    const ae = Vs({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, S.id, K, D);
    w(ae.selectedSegmentIds), y(ae.activeSegmentId), c.current = ae.anchorSegmentId, g.current = ae.rangeBaseSegmentIds, ae.activeSegmentId != null && h(It(t, ae.activeSegmentId)), k(S.id), C && ((_ = r.current) == null || _.focus({ preventScroll: !0 })), A && ((T = i.current) == null || T.call(i, S.startSec, !1));
  }
  function $(S) {
    const C = qs(
      d,
      l,
      S
    );
    w(C.selectedSegmentIds), y(C.activeSegmentId), c.current = C.activeSegmentId, g.current = [], C.activeSegmentId != null && (h(It(t, C.activeSegmentId)), k(C.activeSegmentId));
  }
  function G() {
    var A;
    const S = Ys(s), C = S.includes(l) ? l : S[0] ?? null;
    f(xt({})), m(!1), w(S), y(C), c.current = C, g.current = [], C != null && h(It(
      Xt(s, a, o),
      C
    )), p(S.length === 0 ? "There are no segments to select." : `${S.length} segments selected. Collapsed Segment groups keep their selected segments.`), (A = r.current) == null || A.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: k, replaceSegmentSelection: j, selectSegment: E, selectSegmentCollection: $, selectAllVideoSegments: G };
}
function Nc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, dispatchPendingChanges: s, enqueueSave: l, getSaveQueueSnapshot: d, historyRef: c, onConflict: g, onDetailChange: u, onReload: f, recordHistoryAction: m, revealSegmentGroupForSelection: p, savingSegmentId: h, selectedGroups: y, selectedSegment: w, selectedSegmentIdRef: k, selectedSegments: j, selectionAnchorIdRef: E, selectionRangeBaseIdsRef: $, setMergeConfirmation: G, setSaveMessage: S, setSelectedSegmentId: C, setSelectedSegmentIds: A, video: D } = e;
  function K() {
    G(null), requestAnimationFrame(() => {
      var P;
      return (P = a.current) == null ? void 0 : P.focus({ preventScroll: !0 });
    });
  }
  async function ae(P = !1, H = !1, ne = null) {
    if (h != null) return;
    const re = ne || ki(
      y,
      { nativeOnly: !o }
    );
    if (!re) {
      S("Select at least two segments from one swimlane.");
      return;
    }
    if (!P && Va()) {
      G(re);
      return;
    }
    H && Ja(!1);
    const V = r("merge", re.segments[0].id);
    if (!V) return;
    K();
    const le = re.endSec == null ? "open end" : Me(re.endSec);
    let L = re.segments[0];
    const te = o ? null : vt(re.segments, !1), ue = o ? null : crypto.randomUUID(), be = re.segments.map((xe) => xe.id), we = Fd(i, re.segments);
    u(we, D.id), A([L.id]), C(L.id), E.current = L.id, $.current = [];
    try {
      const xe = re.segments.slice(1);
      if (!o || L.nativeSegmentId != null) {
        const Y = xe.map((ee) => {
          const Q = `merge-native-selection:${D.id}:${L.id}:${ee.id}:${L.updatedAt}:${ee.updatedAt}`;
          return { key: Q, operationId: je(Q), segmentId: ee.id, expectedUpdatedAt: ee.updatedAt };
        }), fe = await X(`/videos/${D.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: L.id,
            expectedSurvivorUpdatedAt: L.updatedAt,
            consumedSegments: Y.map(({ key: ee, ...Q }) => Q),
            historyReceiptId: ue
          })
        });
        L = fe.survivor, u((ee) => ma(ee, fe), D.id), Y.forEach(({ key: ee }) => Ue(ee));
      } else {
        const Y = xe.map((ee) => {
          const Q = `merge-draft-selection:${D.id}:${L.itemId}:${ee.itemId}:${L.revision}:${ee.revision}`;
          return { key: Q, operationId: je(Q), itemId: ee.itemId, expectedRevision: ee.revision };
        }), fe = await X(`/videos/${D.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: L.itemId,
            expectedSurvivorRevision: L.revision,
            consumedDrafts: Y.map(({ key: ee, ...Q }) => Q)
          })
        });
        L = fe.survivor, u((ee) => ma(ee, fe), D.id), Y.forEach(({ key: ee }) => Ue(ee));
      }
      A([L.id]), C(L.id), E.current = L.id, $.current = [], o ? t(Bt) : await m(
        "segments.merge",
        `Merged ${re.segments.length} segments`,
        te,
        vt([L], !1),
        ue
      ), p(L.id), S(`${re.segments.length} segments merged into ${Me(re.startSec)} – ${le}.`);
    } catch (xe) {
      u((Y) => Ii(
        no(Y, [re.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        re.segments.slice(1)
      ), D.id), A(be), C((w == null ? void 0 : w.id) ?? be[0] ?? null), E.current = (w == null ? void 0 : w.id) ?? be[0] ?? null, $.current = [], xe.status === 409 ? await g() : S(xe.message || "Unable to merge selected segments.");
    } finally {
      V();
    }
  }
  function _(P, H = j, ne = w) {
    if (H.length === 0) return Promise.resolve(null);
    const re = hl(P, H, ne), V = Jr(d()) != null, le = l({
      kind: "review",
      lockId: re.activeIdentity.id,
      targets: re.identities,
      whenBusy: "enqueue",
      run: (L) => T(L, re)
    });
    return le ? (V && S(`${P === "approved" ? "Approval" : "Rejection"} queued…`), le.done) : Promise.resolve(null);
  }
  async function T({ detail: P, segments: H, onConflict: ne, onReload: re }, V) {
    var Q;
    const le = vl(V, H);
    if (!le) {
      S("The queued review could not find its segment after refreshing.");
      return;
    }
    const { requestedState: L, selectedSegments: te, selectedSegment: ue } = le, be = bl(te, L), we = te.filter((ie) => ie.reviewState !== be);
    if (we.length === 0) return;
    const xe = te.map((ie) => ({
      id: ie.id,
      itemId: ie.itemId,
      nativeSegmentId: ie.nativeSegmentId
    })), Y = xe.find((ie) => ie.id === (ue == null ? void 0 : ue.id)) || xe[0], fe = (ie, z = !1) => {
      if (!(ie != null && ie.segments) || !z && !Qr(k.current, Y.id))
        return;
      const oe = xe.map((b) => Qe(ie == null ? void 0 : ie.segments, b)).filter(Boolean), I = Qe(ie == null ? void 0 : ie.segments, Y) || oe[0] || null;
      A(oe.map((b) => b.id)), C((I == null ? void 0 : I.id) ?? null), E.current = (I == null ? void 0 : I.id) ?? null, $.current = [];
    };
    S(`Updating ${we.length} selected segment${we.length === 1 ? "" : "s"}…`);
    const ee = uo();
    s({
      type: "add",
      entry: { id: ee, op: "patch", targets: we.map(co), values: { reviewState: be } }
    });
    try {
      const ie = await X(`/videos/${D.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: c.current.revision,
          reviewState: be,
          segments: te.map((b) => b.published ? {
            nativeSegmentId: b.nativeSegmentId,
            expectedUpdatedAt: b.updatedAt
          } : {
            itemId: b.itemId,
            expectedRevision: b.revision
          })
        })
      }), z = new Map((ie.items || []).map((b) => [
        b.requestedNativeSegmentId != null ? `native:${b.requestedNativeSegmentId}` : `item:${b.requestedItemId}`,
        b
      ]));
      if (xe.forEach((b) => {
        const v = z.get(b.nativeSegmentId != null ? `native:${b.nativeSegmentId}` : `item:${b.itemId}`);
        v && (b.nativeSegmentId = v.nativeSegmentId, b.itemId = v.itemId);
      }), ie.history && t(ie.history), be === "rejected" || (ie.items || []).some((b) => b.requestedNativeSegmentId != null && b.nativeSegmentId !== b.requestedNativeSegmentId)) {
        fe(await re()), s({ type: "settle", key: ee }), S(`${ie.updatedCount} selected segment${ie.updatedCount === 1 ? "" : "s"} ${be === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const I = (b) => ({
        ...b,
        approvedSetVersion: ie.approvedSetVersion || b.approvedSetVersion,
        segments: (b.segments || []).map((v) => {
          const x = z.get(v.nativeSegmentId != null ? `native:${v.nativeSegmentId}` : `item:${v.itemId}`);
          return x ? {
            ...v,
            id: x.nativeSegmentId != null ? x.nativeSegmentId : -x.itemId,
            itemId: x.itemId,
            nativeSegmentId: x.nativeSegmentId,
            published: x.nativeSegmentId != null,
            reviewState: be,
            revision: x.nativeSegmentId != null ? v.revision : x.revision,
            updatedAt: x.updatedAt
          } : v;
        })
      });
      u(I, D.id), s({ type: "settle", key: ee }), fe(I(P)), S(`${ie.updatedCount} selected segment${ie.updatedCount === 1 ? "" : "s"} ${be === "approved" ? "approved" : be === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (ie) {
      s({ type: "discard", key: ee }), ie.status === 409 && ((Q = ie.payload) != null && Q.currentHistory) && t(ie.payload.currentHistory);
      const z = ie.status === 409 ? await ne() : P;
      fe(z, !0), S(ie.message || "Unable to update the selected segments.");
    }
  }
  return { closeMergeConfirmation: K, mergeSelectedSwimlane: ae, saveSelectedReviewState: _ };
}
function Ic(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, exportingExamples: p, hideDerivedSegments: h, heldCreatedSegmentTag: y, incorrectExamples: w, lineage: k, materializeButtonRef: j, materializePreview: E, materializeRestoreFocusRef: $, materializing: G, mutateSegment: S, onConflict: C, onDetailChange: A, onReload: D, performerSlots: K, recordHistoryAction: ae, refreshMaterializationPreview: _, removingExampleId: T, revealSegmentGroupForSelection: P, savingSegmentId: H, segmentGroups: ne, segments: re, selectedSegment: V, selectedSegmentIdRef: le, selectedSegments: L, selectionAnchorIdRef: te, selectionRangeBaseIdsRef: ue, setAutoAssignError: be, setAutoAssignOpen: we, setAutoAssigning: xe, setEditorFilters: Y, setExportingExamples: fe, setHeldCreatedSegmentTag: ee, setHideDerivedSegments: Q, setIncorrectExamples: ie, setMaterializeError: z, setMaterializeLoading: oe, setMaterializeOpen: I, setMaterializePreview: b, setMaterializing: v, setRejectedDeletionPreview: x, setRemovingExampleId: N, setSaveMessage: M, setSelectedSegmentGroupKey: J, setSelectedSegmentId: U, setSelectedSegmentIds: ce, video: R } = e;
  async function W() {
    var Te, et, Ge;
    if (L.length === 0 || !V || H != null) return;
    const Z = Md(L, w), de = Z.segments;
    if (de.length === 0) return;
    const Ee = L.map((Oe) => ({
      id: Oe.id,
      itemId: Oe.itemId,
      nativeSegmentId: Oe.nativeSegmentId
    })), Be = Ee.find((Oe) => Oe.id === V.id) || Ee[0], ke = [], _e = [];
    let Ye = !1, Ne = u, he = !1;
    const We = [], Pe = r("feedback", Be.id);
    if (Pe) {
      M(Z.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Oe = async (Ae, Re) => {
          const Ve = Ae.nativeSegmentId != null, bt = Z.action === "remove" ? `incorrect-example-remove:${R.id}:${Re == null ? void 0 : Re.id}:${Re == null ? void 0 : Re.revision}:${Re == null ? void 0 : Re.representationRevision}` : `incorrect-example-collect:${R.id}:${Ve ? `native:${Ae.nativeSegmentId}:${Ae.updatedAt}` : `item:${Ae.itemId}:${Ae.revision}`}`;
          if (Z.action === "remove" && !Re)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let st;
          try {
            st = Z.action === "remove" ? await X(
              `/videos/${R.id}/incorrect-examples/${Re.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: je(bt),
                  expectedExampleRevision: Re.revision,
                  expectedRepresentationRevision: Re.representationRevision
                })
              }
            ) : await X(`/videos/${R.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: je(bt),
                nativeSegmentId: Ve ? Ae.nativeSegmentId : null,
                itemId: Ve ? null : Ae.itemId,
                expectedUpdatedAt: Ve ? Ae.updatedAt : null,
                expectedRevision: Ve ? null : Ae.revision
              })
            });
          } catch (Ut) {
            throw Ut.operationKey = bt, Ut;
          }
          if (!Ed(Z.action, st))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ue(bt), st;
        };
        for (const Ae of de) {
          const Re = Z.action === "remove" ? w.find((Ve) => Ve.itemId != null && Ve.itemId === Ae.itemId) : null;
          try {
            const Ve = Ee.find((pt) => pt.id === Ae.id);
            let bt = Qe(
              Ne == null ? void 0 : Ne.segments,
              Ve
            ) || Ae, st;
            try {
              st = await Oe(bt, Re);
            } catch (pt) {
              if (pt.status === 409 && ((et = (Te = pt.payload) == null ? void 0 : Te.result) == null ? void 0 : et.code) === "OPERATION_REPLAYED")
                Ne = await X(
                  `/videos/${R.id}/editor`
                ), he = !0, We.length = 0, Ue(pt.operationKey), st = pt.payload.result;
              else {
                if (Z.action !== "collect" || pt.status !== 409) throw pt;
                const at = await X(
                  `/videos/${R.id}/editor`
                );
                Ne = at, he = !0, We.length = 0;
                const Ot = Qe(
                  at == null ? void 0 : at.segments,
                  Ve
                );
                if (!Ot) throw pt;
                bt = Ot, st = await Oe(bt, null);
              }
            }
            Ve && st.itemId != null && (Ve.itemId = st.itemId), Ne = mr(
              Ne,
              st.editorDelta
            ), We.push(st.editorDelta);
            const Ut = { segment: Ae, result: st, example: Re };
            ke.push(Ut);
          } catch (Ve) {
            if (_e.push(Ve), ![400, 404, 409].includes(Ve.status)) break;
          }
        }
        if (c && ke.length > 0) {
          const Ae = Z.action === "remove", Re = ke.length;
          await ae(
            Ae ? "feedback.remove" : "feedback.collect",
            Ae ? `Removed ${Re} incorrect AI example${Re === 1 ? "" : "s"}` : `Collected ${Re} incorrect AI example${Re === 1 ? "" : "s"}`,
            lr(ke, Ae),
            lr(ke, !Ae)
          ) || (Ye = !0);
        }
        ke.some(({ result: Ae }) => Ae.representation === "basicNativeBin") && zn();
        const De = Qr(
          le.current,
          Be.id
        ), ze = Z.action === "collect" && ke.some(({ segment: Ae }) => Ae.id === Be.id), Pt = ke.map(({ segment: Ae }) => Ae.id), Le = ze ? Zs(
          o,
          Pt,
          Be.id
        ) : null, St = ze ? (Le == null ? void 0 : Le.id) ?? null : Be.id;
        De && ze && (ce(Le ? [Le.id] : []), U((Le == null ? void 0 : Le.id) ?? fr), te.current = (Le == null ? void 0 : Le.id) ?? null, ue.current = []);
        const An = await X(`/videos/${R.id}/incorrect-examples`);
        ie(An);
        const dt = Ne;
        if (A(he ? dt : (Ae) => We.reduce(mr, Ae), R.id), De && Qr(
          le.current,
          St
        )) {
          let Ae, Re;
          ze ? (Re = Le ? Qe(dt == null ? void 0 : dt.segments, {
            id: Le.id,
            itemId: Le.itemId,
            nativeSegmentId: Le.nativeSegmentId
          }) : null, Ae = Re ? [Re] : []) : (Ae = Ee.map((Ve) => Qe(dt == null ? void 0 : dt.segments, Ve)).filter(Boolean), Re = Qe(dt == null ? void 0 : dt.segments, Be) || Ae[0] || null), ce(Ae.map((Ve) => Ve.id)), U((Re == null ? void 0 : Re.id) ?? (ze ? fr : null)), te.current = (Re == null ? void 0 : Re.id) ?? null, ue.current = [], J(Re ? It(o, Re.id) : null), Re && P(Re.id);
        }
        if (_e.length > 0) {
          const Ae = ((Ge = _e[0]) == null ? void 0 : Ge.message) || "Only segments with registered AI provenance can be collected.";
          ke.length === 0 ? M(Ae) : Z.action === "remove" ? M(
            `Partially removed ${ke.length} of ${de.length} selected incorrect examples. ${Ae}`
          ) : M(
            `Partially collected ${ke.length} of ${de.length} selected segments. ${Ae}`
          );
        } else if (Z.action === "remove")
          M(
            `${ke.length} incorrect example${ke.length === 1 ? "" : "s"} removed and ${ke.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Ae = ke.filter(({ result: Re }) => Re.representation === "basicNativeBin").length;
          M(Ae === ke.length ? `${ke.length} incorrect AI example${ke.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ke.length} incorrect AI example${ke.length === 1 ? "" : "s"} collected and ${ke.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Ye && M("The change saved, but editor history could not be updated.");
      } catch (Oe) {
        M(Oe.message || "Unable to update the selected incorrect examples.");
      } finally {
        Pe();
      }
    }
  }
  async function q(Z) {
    var Ee, Be;
    if (!Z || T != null || p) return;
    N(Z.id);
    const de = `incorrect-example-remove:${R.id}:${Z.id}:${Z.revision}:${Z.representationRevision}`;
    try {
      let ke, _e = !1;
      try {
        ke = await X(
          `/videos/${R.id}/incorrect-examples/${Z.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(de),
              expectedExampleRevision: Z.revision,
              expectedRepresentationRevision: Z.representationRevision
            })
          }
        );
      } catch (he) {
        if (he.status !== 409 || ((Be = (Ee = he.payload) == null ? void 0 : Ee.result) == null ? void 0 : Be.code) !== "OPERATION_REPLAYED")
          throw he;
        ke = he.payload.result, _e = !0;
      }
      Ue(de);
      let Ye = !0;
      if (c) {
        const We = [{ segment: Qe(u.segments, {
          itemId: Z.itemId
        }) || {
          id: Z.itemId == null ? null : -Z.itemId,
          itemId: Z.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: Z.representationRevision
        }, result: ke, example: Z }];
        Ye = await ae(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          lr(We, !0),
          lr(We, !1)
        );
      }
      const Ne = await X(
        `/videos/${R.id}/incorrect-examples`
      );
      ie(Ne), _e ? await D() : A(
        (he) => mr(he, ke.editorDelta),
        R.id
      ), Z.representation === "basicNativeBin" && zn(), M(Ye ? _e ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Z.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ke) {
      ke.status === 409 && await C(), M(ke.message || "Unable to remove the incorrect example.");
    } finally {
      N(null);
    }
  }
  async function ge() {
    if (p || T != null || w.length === 0) return;
    fe(!0);
    const Z = `incorrect-example-export:${R.id}:${w.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await Pd(
        R.id,
        w
      ), Ee = new FormData();
      Ee.append("metadata", JSON.stringify({
        operationId: je(Z),
        examples: de.captures
      }));
      for (const he of de.files)
        Ee.append(he.fieldName, he.file);
      const Be = await X(
        `/videos/${R.id}/incorrect-examples/export`,
        { method: "POST", body: Ee }
      ), ke = await Ql(Be.downloadUrl), _e = URL.createObjectURL(ke.blob), Ye = document.createElement("a");
      Ye.href = _e, Ye.download = ke.fileName, Ye.click(), setTimeout(() => URL.revokeObjectURL(_e), 1e3);
      const Ne = await X(
        `/training-exports/${Be.id}/complete`,
        { method: "POST" }
      );
      Ue(Z), ie(await X(
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
  async function Ce(Z = null) {
    const de = re.filter((Pe) => Pe.reviewState === "rejected"), Ee = de.length, Be = w.some((Pe) => Pe.representation === "fullItem");
    if (Z == null && Ee === 0 && !Be) {
      M("There are no rejected segments to delete.");
      return;
    }
    if (Z == null) {
      const Pe = r("delete-rejected", -1);
      if (!Pe) return;
      M("Preparing deletion summary…");
      try {
        const Te = await X(`/videos/${R.id}/rejected/deletion/preview`, { method: "POST" }), et = Number(Te.deletedSegmentCount) || 0, Ge = Number(Te.deferredRejectedSegmentCount) || 0, Oe = Number(Te.protectedIncorrectExampleCount) || 0;
        if (et === 0) {
          Ge > 0 ? M(
            `${Ge} feedback-protected rejected segment${Ge === 1 ? "" : "s"} kept. ${Oe} AI feedback example${Oe === 1 ? "" : "s"} must be exported before ${Ge === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : M("There are no rejected segments to delete.");
          return;
        }
        if (!gi(Te, M)) return;
        x(Te), M("");
      } catch (Te) {
        M(Te.message || "Unable to prepare rejected segment deletion.");
      } finally {
        Pe();
      }
      return;
    }
    const ke = Z, _e = Number(ke.deferredRejectedSegmentCount) || 0, Ye = le.current, Ne = _e === 0 ? to(u, de.map((Pe) => Pe.id)) : u, he = Ne.segments.find((Pe) => Pe.reviewState === "unreviewed") || Ne.segments[0] || null, We = r("delete-rejected", -1);
    if (We) {
      x(null), M("Deleting rejected segments…"), _e === 0 && (A(Ne, R.id), ce(he ? [he.id] : []), U((he == null ? void 0 : he.id) ?? null), te.current = (he == null ? void 0 : he.id) ?? null, ue.current = []);
      try {
        const Pe = `rejected-dependency-delete:${R.id}:${ke.fingerprint}`, Te = await X(`/videos/${R.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Pe),
            fingerprint: ke.fingerprint
          })
        });
        Ue(Pe), await D(), Te.deletedSegmentCount > 0 && t(Bt);
        const et = _e > 0 ? ` ${_e} feedback-protected rejected segment${_e === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
        M(`${Te.deletedSegmentCount} segment${Te.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${et}`);
      } catch (Pe) {
        _e === 0 && A((Te) => Ii(
          Te,
          de
        ), R.id), ce(Ye == null ? [] : [Ye]), U(Ye), te.current = Ye, ue.current = [], M(Pe.message || "Unable to delete rejected segments.");
      } finally {
        We();
      }
    }
  }
  async function $e(Z = i) {
    if (!(a || Z.length === 0)) {
      xe(!0), be("");
      try {
        const de = await X(`/videos/${R.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: Z.flatMap((Ee) => Ee.nativeSegmentId == null ? [] : [Ee.nativeSegmentId]),
            itemIds: Z.flatMap((Ee) => Ee.published || Ee.itemId == null ? [] : [Ee.itemId])
          })
        });
        we(!1), await D(), M(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (de) {
        be(de.message || "Unable to auto-assign performers.");
      } finally {
        xe(!1);
      }
    }
  }
  async function Se() {
    I(!0), z(""), !E && (oe(!0), _());
  }
  function Xe() {
    $.current = !0, I(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = j.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  async function Ze() {
    if (!E || G || E.createCount + E.linkCount === 0)
      return;
    v(!0), z("");
    let Z;
    try {
      const de = `materialize-derived:${R.id}:${E.fingerprint}`;
      Z = await X(`/videos/${R.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(de),
          fingerprint: E.fingerprint,
          maxDepth: 3
        })
      }), Ue(de);
    } catch (de) {
      de.status === 409 && b(null), z(de.message || "Unable to materialize derived segments."), v(!1);
      return;
    }
    b((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await D(), Xe(), b(null);
      const de = Z.createdCount + Z.linkedCount;
      M(`${Z.createdCount} derived segment${Z.createdCount === 1 ? "" : "s"} created and ${Z.linkedCount} existing segment${Z.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && M("Every applicable derivation was already materialized.");
    } catch {
      z("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    v(!1);
  }
  async function Ie(Z, de = null) {
    var Be, ke, _e, Ye;
    const Ee = {
      tagId: Z,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (L.length > 1) {
      const Ne = L.filter((Ge) => Ge.tagId !== Z);
      if (Ne.length === 0) {
        d();
        return;
      }
      const he = L.map((Ge) => ({
        id: Ge.id,
        itemId: Ge.itemId,
        nativeSegmentId: Ge.nativeSegmentId
      })), We = L.map((Ge) => !c || Ge.nativeSegmentId != null ? `native:${Ge.nativeSegmentId}:${Ge.updatedAt}` : `item:${Ge.itemId}:${Ge.revision}`).sort().join(","), Pe = `bulk-tag:${R.id}:${Z}:${We}`, Te = r("tag", (V == null ? void 0 : V.id) ?? Ne[0].id);
      if (!Te) return;
      M(`Changing tag for ${Ne.length} selected segment${Ne.length === 1 ? "" : "s"}…`);
      const et = ba(
        u,
        Ne.map((Ge) => Ge.id),
        Ee
      );
      A(et, R.id), d();
      try {
        const Ge = c ? null : crypto.randomUUID();
        await X(`/videos/${R.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Pe),
            tagId: Z,
            historyReceiptId: Ge,
            segments: L.map((Le) => {
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
          L,
          c
        ), De = await D(), ze = he.map((Le) => Qe(De == null ? void 0 : De.segments, Le)).filter(Boolean);
        await ae(
          "segments.tag",
          `Changed tag for ${Ne.length} segment${Ne.length === 1 ? "" : "s"}`,
          Oe,
          vt(ze, c),
          Ge
        );
        const Pt = he.map((Le) => Qe(De == null ? void 0 : De.segments, Le)).filter(Boolean);
        ce(Pt.map((Le) => Le.id)), U(((Be = Pt.find((Le) => Le.id === (V == null ? void 0 : V.id))) == null ? void 0 : Be.id) ?? ((ke = Pt[0]) == null ? void 0 : ke.id) ?? null), d(), M(`${Ne.length} selected segment${Ne.length === 1 ? "" : "s"} retagged.`);
      } catch (Ge) {
        A((ze) => no(
          ze,
          Ne,
          Object.keys(Ee)
        ), R.id);
        const Oe = he.map((ze) => Qe(u.segments, ze)).filter(Boolean), De = Qe(u.segments, {
          id: V == null ? void 0 : V.id,
          itemId: V == null ? void 0 : V.itemId,
          nativeSegmentId: V == null ? void 0 : V.nativeSegmentId
        }) || Oe[0] || null;
        ce(Oe.map((ze) => ze.id)), U((De == null ? void 0 : De.id) ?? null), te.current = (De == null ? void 0 : De.id) ?? null, ue.current = [], Ge.status === 409 && await C(), M(Ge.message || "Unable to change the selected segment tags.");
      } finally {
        Te();
      }
      return;
    }
    if (!(L.length !== 1 || !V)) {
      if (V.id === g || (y == null ? void 0 : y.segmentId) === V.id) {
        const Ne = y != null, he = Nl(y, V, Z, de);
        if (ee(he), he) {
          const We = Ya(
            { ...V, tagId: he.tagId },
            K,
            f,
            h,
            ne
          );
          Y(We.filters), Q(We.hideDerivedSegments), M("Tag change queued…");
        } else Ne && M("");
        d();
        return;
      }
      if (Z === V.tagId) {
        d();
        return;
      }
      if (V.itemId != null && ((Ye = (_e = k.data) == null ? void 0 : _e.children) == null ? void 0 : Ye.length) > 0) {
        const Ne = r("lineage-tag", V.id);
        if (!Ne) return;
        M("Checking lineage impact…");
        try {
          const he = await X(`/items/${V.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: V.revision, tagId: Z })
          }), We = he.deletedItemIds.length > 0 || he.removedEdgeIds.length > 0;
          if (We && !window.confirm(
            `Changing this tag removes ${he.removedEdgeIds.length} lineage edge${he.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${he.deletedItemIds.length} derived segment${he.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            M("Tag change canceled.");
            return;
          }
          const Pe = ba(
            u,
            [V.id],
            Ee
          );
          A(Pe, R.id), d();
          const Te = `tag-change:${V.itemId}:${V.revision}:${he.componentFingerprint}:${Z}`;
          await X(`/items/${V.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Te),
              expectedRevision: V.revision,
              componentFingerprint: he.componentFingerprint,
              tagId: Z
            })
          }), Ue(Te), await D(), d(), M(We ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (he) {
          A((We) => no(
            We,
            [V],
            Object.keys(Ee)
          ), R.id), ce([V.id]), U(V.id), te.current = V.id, ue.current = [], he.status === 409 ? (M("Lineage changed — loading the latest segments…"), await C()) : M(he.message || "Unable to reconcile the lineage.");
        } finally {
          Ne();
        }
        return;
      }
      d(), await S(V, {
        startSec: V.startSec,
        endSec: V.endSec,
        tagId: Z
      }, !0, null, !0, Ee);
    }
  }
  async function He(Z) {
    const de = re.find((Be) => Be.id === Z.segmentId);
    if (!de) return;
    await S(de, {
      startSec: de.startSec,
      endSec: de.endSec,
      tagId: Z.tagId
    }, !0, null, !0, {
      tagId: Z.tagId,
      ...Z.tagName ? { tagName: Z.tagName } : {},
      tagSortName: null
    }, !1) || M(`The new segment was not retagged${Z.tagName ? ` to ${Z.tagName}` : ""}. Choose its tag again.`);
  }
  async function Je() {
    var Ne, he, We, Pe;
    if (!l || !V || H != null) return;
    const Z = [...L].sort((Te, et) => Number(Te.nativeSegmentId ?? Te.id) - Number(et.nativeSegmentId ?? et.id)), de = new Set(Z.map((Te) => Te.id)), Ee = Z.map((Te) => `${Te.nativeSegmentId ?? Te.id}:${Te.updatedAt}`).join("|"), Be = r("bin", V.id);
    if (!Be) return;
    M(`Moving ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin…`);
    const ke = `bulk-move:${R.id}:${Ee}`, _e = je(ke), Ye = c ? null : crypto.randomUUID();
    try {
      const Te = (De = !1) => X(`/videos/${R.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: _e,
          segments: Z.map((ze) => ({
            segmentId: ze.nativeSegmentId ?? ze.id,
            expectedUpdatedAt: ze.updatedAt
          })),
          discardMissingImage: De,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Ye
        })
      });
      let et;
      try {
        et = await Te(
          go(ke)
        );
      } catch (De) {
        if (((Ne = De.payload) == null ? void 0 : Ne.code) !== "missing-image" || !window.confirm(`${De.message}

Continue and discard the missing image reference?`)) throw De;
        po(ke), et = await Te(!0);
      }
      Ue(ke), zn();
      const Ge = new Map((et.items || []).map((De) => [
        Number(De.segmentId),
        De
      ]));
      await ae(
        "segments.moveToBin",
        `Moved ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin`,
        vt(Z, !1),
        vt(Z.map((De) => {
          const ze = Ge.get(
            Number(De.nativeSegmentId ?? De.id)
          );
          return {
            ...De,
            recycleBinItemId: (ze == null ? void 0 : ze.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (ze == null ? void 0 : ze.revision) ?? null
          };
        }), !1),
        Ye
      );
      const Oe = Qs(o, de, V.id);
      A((De) => ({
        ...De,
        segments: (De.segments || []).filter((ze) => !de.has(ze.id))
      }), R.id), ce(Oe ? [Oe.id] : []), U((Oe == null ? void 0 : Oe.id) ?? null), te.current = (Oe == null ? void 0 : Oe.id) ?? null, ue.current = [], Oe && (J(It(o, Oe.id)), P(Oe.id)), requestAnimationFrame(() => {
        var De;
        return (De = m.current) == null ? void 0 : De.focus({ preventScroll: !0 });
      }), M(`Moved ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Te) {
      const et = ((he = Te.payload) == null ? void 0 : he.code) || ((Pe = (We = Te.payload) == null ? void 0 : We.result) == null ? void 0 : Pe.code);
      Te.status === 409 && et === "CANONICAL_SEGMENT_CHANGED" ? await C() : M(Te.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Be();
    }
  }
  async function Ke() {
    if (!(c || s.current || H != null)) {
      s.current = !0, M("Checking the recycling bin…");
      try {
        const Z = await X("/bin"), de = await fi(Z, () => M("Emptying the recycling bin…"));
        if (de.status === "empty") {
          M("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          M("The recycling bin was not emptied.");
          return;
        }
        M(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Z) {
        M(Z.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: W, removeIncorrectExample: q, captureTrainingExport: ge, deleteRejectedSegments: Ce, autoAssignPerformers: $e, previewDerivedSegments: Se, closeMaterializeDialog: Xe, materializeDerivedSegments: Ze, saveTag: Ie, applyHeldCreatedSegmentTag: He, moveToBin: Je, emptyRecyclingBin: Ke };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, commonActionsRef: o, compatibilityMode: i, currentTime: a, detail: s, editorLayout: l, focusRowRef: d, history: c, historyRef: g, historySaving: u, horizontalLayoutSize: f, mediaStackHeight: m, mediaStackRef: p, onDetailChange: h, onReload: y, railToggleRef: w, recordHistoryAction: k, savingSegmentId: j, savingShot: E, savingShotRef: $, setCollapsedSegmentGroups: G, setEditorLayout: S, setHistorySaving: C, setIncorrectExamples: A, setSaveMessage: D, setSavingShot: K, shotBoundaries: ae, timelineDuration: _, video: T, workspaceRef: P } = e;
  async function H(I, b, v) {
    var J, U, ce, R;
    const x = I.type === "segment" ? [I] : I.segments || [], N = (b == null ? void 0 : b.type) === "segment" ? [b] : (b == null ? void 0 : b.segments) || [];
    let M = v;
    for (const [W, q] of x.entries()) {
      const ge = N[W], Ce = ((J = q.identity) == null ? void 0 : J.nativeSegmentId) != null || ((U = q.identity) == null ? void 0 : U.published) === !0, $e = ((ce = ge == null ? void 0 : ge.identity) == null ? void 0 : ce.recycleBinItemId) ?? ((R = ge == null ? void 0 : ge.identity) == null ? void 0 : R.itemId);
      let Se = Qe(M.segments, ge == null ? void 0 : ge.identity) || Qe(M.segments, q.identity);
      if (!Se && Ce && $e != null && ge.identity.revision != null) {
        const Ie = `history-restore:${T.id}:${$e}:${ge.identity.revision}`;
        await X(`/bin/${$e}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Ie),
            expectedRevision: ge.identity.revision
          })
        }), Ue(Ie), M = await y(), Se = M.segments.find((He) => He.tagId === q.values.tagId && He.startSec === q.values.startSec && He.endSec === q.values.endSec);
      }
      if (!Se)
        throw new Error("A segment in this history state no longer exists.");
      if ((Se.nativeSegmentId != null || Se.published === !0) !== Ce) {
        if (Ce) {
          const Ie = Se.recycleBinItemId ?? Se.itemId ?? $e;
          if (Ie == null)
            throw new Error("This recycled segment can no longer be restored.");
          const He = `history-restore:${T.id}:${Ie}:${Se.revision}:${q.values.reviewState ?? "native"}`;
          await X(`/bin/${Ie}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(He),
              expectedRevision: Se.revision
            })
          }), Ue(He);
        } else {
          const Ie = `history-bin:${T.id}:${Se.nativeSegmentId}:${Se.updatedAt}:${q.values.reviewState}`;
          await X(`/videos/${T.id}/segments/${Se.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Ie),
              expectedUpdatedAt: Se.updatedAt,
              reviewState: q.values.reviewState
            })
          }), Ue(Ie);
        }
        if (M = await y(), !Ce)
          continue;
        if (Se = Qe(M.segments, q.identity) || M.segments.find((Ie) => Ie.tagId === q.values.tagId && Ie.startSec === q.values.startSec && Ie.endSec === q.values.endSec), !Se)
          throw new Error("The restored segment could not be found.");
      }
      const Ze = q.values;
      if (Se.nativeSegmentId == null && Se.itemId != null) {
        const Ie = `history-draft-update:${T.id}:${Se.itemId}:${Se.revision}:${Ze.tagId}:${Ze.startSec}:${Ze.endSec ?? "open"}:${Ze.reviewState}`;
        await X(`/videos/${T.id}/drafts/${Se.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Ie),
            expectedRevision: Se.revision,
            ...Ze
          })
        }), Ue(Ie);
      } else
        await X(`/videos/${T.id}/segments/${Se.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ze, expectedUpdatedAt: Se.updatedAt })
        });
      M = await y();
    }
    return M;
  }
  async function ne(I, b) {
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
  async function re(I, b, v) {
    if (!i)
      throw new Error("AI feedback history is only available in Full mode.");
    let x = b, N = await X(`/videos/${T.id}/incorrect-examples`);
    const M = (J) => N.find((U) => {
      var ce;
      return U.id === J.exampleId || ((ce = J.collectedIdentity) == null ? void 0 : ce.itemId) != null && U.itemId === J.collectedIdentity.itemId;
    });
    for (const [J, U] of (I.entries || []).entries()) {
      const ce = `history-feedback:${T.id}:${v.action.sequence}:${v.direction}:${J}`, R = M(U);
      if (I.collected && R) {
        Ue(ce);
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
            operationId: je(ce),
            nativeSegmentId: ge ? q.nativeSegmentId : null,
            itemId: ge ? null : q.itemId,
            expectedUpdatedAt: ge ? q.updatedAt : null,
            expectedRevision: ge ? null : q.revision
          })
        });
      } else {
        if (!R) {
          Ue(ce);
          continue;
        }
        W = await X(
          `/videos/${T.id}/incorrect-examples/${R.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(ce),
              expectedExampleRevision: R.revision,
              expectedRepresentationRevision: R.representationRevision
            })
          }
        );
      }
      Ue(ce), x = mr(
        x,
        W.editorDelta
      ), N = await X(
        `/videos/${T.id}/incorrect-examples`
      );
    }
    return A(N), x;
  }
  async function V(I, b, v = []) {
    const x = I.state;
    if (!i && ((x == null ? void 0 : x.type) === "segment" || (x == null ? void 0 : x.type) === "segments")) {
      const M = `basic-history:${T.id}:${g.current.revision}:${I.action.sequence}:${I.direction}`, J = await X(`/videos/${T.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(M),
          expectedHistoryRevision: g.current.revision,
          actionSequence: I.action.sequence,
          direction: I.direction
        })
      });
      return t(J.history), v.push(M), y();
    }
    const N = I.direction === "backward" ? I.action.afterState : I.action.beforeState;
    if ((x == null ? void 0 : x.type) === "composite") {
      let M = b;
      const J = (N == null ? void 0 : N.type) === "composite" ? N.states || [] : [];
      for (const [U, ce] of (x.states || []).entries()) {
        const R = J[U];
        M = await V({
          ...I,
          state: ce,
          action: {
            ...I.action,
            beforeState: I.direction === "backward" ? ce : R,
            afterState: I.direction === "backward" ? R : ce
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
      return ne(x, b);
    if ((x == null ? void 0 : x.type) === "incorrectExamples")
      return re(x, b, I);
    if ((x == null ? void 0 : x.type) === "shots") {
      const M = Kn(b.shotBoundaries || []), J = await X(`/videos/${T.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(`history-shots:${T.id}:${M}:${x.fingerprint}`),
          expectedFingerprint: M,
          boundaries: x.boundaries
        })
      });
      return { ...b, shotBoundaries: J };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function le(I) {
    var x;
    if (u || j != null || E || I === c.cursorSequence)
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
          N = await V(
            U,
            N,
            M
          );
        const J = i ? await X(`/videos/${T.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: g.current.revision,
            targetSequence: I
          })
        }) : g.current;
        M.forEach(Ue), t(J), await y(), D("History restored.");
      } catch (N) {
        N.status === 409 && ((x = N.payload) != null && x.current) && t(N.payload.current), await y(), D(N.message || "Unable to restore editor history.");
      } finally {
        v(), C(!1);
      }
    }
  }
  function L(I) {
    S((b) => ({ ...b, timelineRatio: lo(I, m) }));
  }
  function te(I) {
    var x, N;
    const b = (x = p.current) == null ? void 0 : x.getBoundingClientRect();
    if (!b) return;
    const v = ((N = o.current) == null ? void 0 : N.offsetHeight) || 0;
    L(Fs(
      I.clientY,
      b.top + v,
      Math.max(0, b.height - v)
    ));
  }
  function ue(I) {
    I.currentTarget.setPointerCapture(I.pointerId), te(I);
  }
  function be(I) {
    I.currentTarget.hasPointerCapture(I.pointerId) && te(I);
  }
  function we(I) {
    const b = I.shiftKey ? 0.1 : 0.05;
    let v = null;
    I.key === "ArrowUp" && (v = l.timelineRatio + b), I.key === "ArrowDown" && (v = l.timelineRatio - b);
    const x = so(m);
    I.key === "Home" && (v = x.minimum), I.key === "End" && (v = x.maximum), v != null && (I.preventDefault(), I.stopPropagation(), L(v));
  }
  function xe(I) {
    const b = I === "detailWidth" ? f.focusRow : f.workspace, v = f.workspace > 0 ? Vr(f.workspace, 600) : 560, x = Zt(l.markerRailWidth, v), N = I === "detailWidth" ? 344 + (l.markerRailOpen ? x + 24 : 0) : 600;
    return b > 0 ? Vr(b, N) : 560;
  }
  function Y(I, b) {
    S((v) => ({ ...v, [I]: Zt(b, xe(I)) }));
  }
  function fe(I, b) {
    var x, N;
    const v = b === "detailWidth" ? (x = d.current) == null ? void 0 : x.getBoundingClientRect() : (N = P.current) == null ? void 0 : N.getBoundingClientRect();
    v && Y(b, b === "detailWidth" ? I.clientX - v.left : v.right - I.clientX);
  }
  function ee(I, b) {
    const v = xe(I), x = Zt(l[I], v);
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
        let J = null;
        N.key === "ArrowLeft" && (J = I === "detailWidth" ? -M : M), N.key === "ArrowRight" && (J = I === "detailWidth" ? M : -M);
        let U = J == null ? null : x + J;
        N.key === "Home" && (U = 240), N.key === "End" && (U = v), U != null && (N.preventDefault(), N.stopPropagation(), Y(I, U));
      },
      onDoubleClick: () => Y(I, ft[I]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function Q() {
    S((I) => ({ ...I, markerRailOpen: !I.markerRailOpen })), requestAnimationFrame(() => {
      var I;
      return (I = w.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
  }
  function ie(I) {
    G((b) => b.includes(I) ? b.filter((v) => v !== I) : _t([...b, I]));
  }
  async function z(I, b = !0, v = a) {
    var J;
    if ($.current) return null;
    const x = Number((J = T.videoFile) == null ? void 0 : J.duration) || _, N = Kn(ae), M = `shot-${I}:${T.id}:${v.toFixed(3)}:${x.toFixed(3)}:${N}`;
    $.current = !0, K(!0), D(I === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const U = await X(`/videos/${T.id}/shot-boundaries/${I}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(I === "split" ? { operationId: je(M), timeSec: v } : { operationId: je(M), timeSec: v })
      });
      return Ue(M), h((ce) => ({ ...ce, shotBoundaries: U }), T.id), b && await k(
        "shots.update",
        I === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: ae,
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
      $.current = !1, K(!1);
    }
  }
  async function oe(I) {
    if ($.current) return null;
    const b = `shot-restore:${T.id}:${I.afterFingerprint}`;
    $.current = !0, K(!0), D("Undoing shot edit…");
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
      $.current = !1, K(!1);
    }
  }
  return { applySegmentHistoryState: H, applyPerformerSlotHistoryState: ne, applyHistoryState: V, restoreHistoryTarget: le, updateTimelineRatio: L, updateTimelineRatioFromPointer: te, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: be, handleSeparatorKeyDown: we, panelWidthMaximum: xe, updatePanelWidth: Y, handlePanelSeparatorPointer: fe, panelSeparatorProps: ee, toggleSegmentRail: Q, toggleSegmentGroup: ie, mutateShotBoundary: z, restoreShotBoundaries: oe };
}
function $c(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: h, mutateShotBoundary: y, openPublishApprovedDialog: w, playbackControlsRef: k, playbackShortcutConfig: j, saveSelectedReviewState: E, seekRef: $, segmentGroupKeys: G, selectSegment: S, selectedSegment: C, selectedSegmentGroupForSegment: A, selectedSegmentGroupKey: D, selectedSegments: K, setCollapsedSegmentGroups: ae, setIncorrectExamplesOpen: _, setQuickSearchOpen: T, setSaveMessage: P, setSelectedSegmentGroupKey: H, setTagEditing: ne, setTimelineZoom: re, shotBoundaries: V, slotButtonRef: le, splitSegment: L, swimlanes: te, timelineDuration: ue, toggleIncorrectExample: be, toggleSegmentGroup: we, updateTimelineRatio: xe, videoFrameRate: Y, visibleSegments: fe } = e;
  function ee(z) {
    var oe, I;
    (oe = k.current) == null || oe.pause(), (I = k.current) == null || I.seekBy(Al(z, Y));
  }
  function Q(z, oe) {
    if (K.length > 1 && ml(z.id))
      return;
    let I = null;
    z.id === "video.playPause" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.toggle();
    }), z.id === "video.seekSmallBackward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-j.smallSeekTime);
    }), z.id === "video.seekSmallForward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(j.smallSeekTime);
    }), z.id === "video.seekMediumBackward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-j.mediumSeekTime);
    }), z.id === "video.seekMediumForward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(j.mediumSeekTime);
    }), z.id === "video.seekLongBackward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(-j.longSeekTime);
    }), z.id === "video.seekLongForward" && (I = () => {
      var b;
      return (b = k.current) == null ? void 0 : b.seekBy(j.longSeekTime);
    }), z.id === "video.playSelected" && C && (I = () => {
      var b;
      (b = $.current) == null || b.call($, C.startSec, !0), requestAnimationFrame(() => {
        var v;
        return (v = g.current) == null ? void 0 : v.focus({ preventScroll: !0 });
      });
    }), (z.id === "video.playPreviousSegment" || z.id === "video.playNextSegment") && (I = () => {
      var v;
      const b = eo(
        te,
        C == null ? void 0 : C.id,
        z.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !b || b.id === (C == null ? void 0 : C.id) || (S(b, { focusEditor: !0, seekToSegment: !1 }), (v = $.current) == null || v.call($, b.startSec, !0));
    }), z.id.startsWith("video.seekPercent") && (I = () => {
      var v;
      const b = Number(z.id.slice(17)) / 10;
      (v = $.current) == null || v.call($, Xs(m ?? ue, b), !1);
    }), z.id === "video.jumpToSegmentStart" && C && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, C.startSec, !1);
    }), z.id === "video.jumpToSegmentEnd" && C && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, C.endSec ?? C.startSec, !1);
    }), z.id === "video.jumpToVideoStart" && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, 0, !1);
    }), z.id === "video.jumpToVideoEnd" && (I = () => {
      var b;
      return (b = $.current) == null ? void 0 : b.call($, ue, !1);
    }), z.id.startsWith("video.frame") && (I = () => {
      const b = z.id.includes("Small") ? "small" : z.id.includes("Medium") ? "medium" : "long", v = j[`${b}FrameStep`] * (z.id.endsWith("Backward") ? -1 : 1);
      ee(v);
    }), z.id.startsWith("navigation.swimlane") && (I = () => {
      const b = z.id.slice(19).toLowerCase(), v = eo(te, C == null ? void 0 : C.id, b, s);
      v && S(v, { focusEditor: !0, seekToSegment: !1 });
    }), (z.id === "navigation.extendSwimlaneLeft" || z.id === "navigation.extendSwimlaneRight") && (I = () => {
      const b = $d(
        t,
        C == null ? void 0 : C.id,
        z.id.endsWith("Left") ? "left" : "right"
      );
      b && S(b.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: b.segmentIds
      });
    }), (z.id === "navigation.segmentGroupUp" || z.id === "navigation.segmentGroupDown") && (I = () => {
      const b = Td(
        G,
        D ?? A,
        z.id.endsWith("Up") ? -1 : 1
      );
      b && H(b);
    }), (z.id === "navigation.previousAtPlayhead" || z.id === "navigation.nextAtPlayhead") && (I = () => {
      const b = js(fe, s, z.id === "navigation.previousAtPlayhead" ? -1 : 1, C == null ? void 0 : C.id);
      b && S(b, { focusEditor: !0, seekToSegment: !1 });
    }), z.id === "navigation.nearestInCurrentSwimlane" && (I = () => {
      const b = $s(
        te,
        C == null ? void 0 : C.id,
        s
      );
      b && S(b, { focusEditor: !0, seekToSegment: !1 });
    }), z.id.includes("Unreviewed") && (I = () => {
      const b = gr(
        te,
        C == null ? void 0 : C.id,
        z.id.startsWith("navigation.previous") ? -1 : 1,
        z.id.endsWith("Global")
      );
      b && S(b, { focusEditor: !oe.preserveFocus, seekToSegment: !1 });
    }), (z.id === "navigation.nextTouchingPlayhead" || z.id === "navigation.previousTouchingPlayhead") && (I = () => {
      const b = Cs(te, s, z.id === "navigation.previousTouchingPlayhead" ? -1 : 1, C == null ? void 0 : C.id);
      b && S(b, { focusEditor: !0, seekToSegment: !1 });
    }), z.id === "navigation.quickSearch" && (I = () => T(!0)), (z.id === "navigation.previousShot" || z.id === "navigation.nextShot") && (I = () => {
      var v;
      const b = Tl(V, s, z.id === "navigation.previousShot" ? -1 : 1);
      b && ((v = $.current) == null || v.call($, b.startSec, !1));
    }), z.id === "shot.split" && (I = () => y("split")), z.id === "shot.merge" && (I = () => y("merge")), z.id === "marker.create" && (I = () => a()), z.id === "marker.duplicate" && (I = () => d(!1)), z.id === "marker.duplicateAtPlayhead" && (I = () => d(!0)), z.id === "marker.split" && (I = () => L()), z.id === "marker.editTag" && (I = () => {
      var b;
      if (K.length > 1 && K.some((v) => v.isDerived)) {
        P("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((b = f.data) != null && b.tagReadOnly) {
        P("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ne(!0);
    }), z.id === "marker.setStart" && C && (I = () => r(s, C.endSec)), z.id === "marker.setEnd" && C && (I = () => r(C.startSec, s)), z.id === "marker.copyTiming" && C && (I = () => {
      P(qd(C) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), z.id === "marker.pasteTiming" && C && (I = () => {
      const b = _d();
      if (!b) {
        P("No copied segment timing is available.");
        return;
      }
      r(b.startSec, b.endSec);
    }), z.id === "marker.mergeSelection" && (I = () => p()), z.id === "marker.moveToBin" && (I = () => h()), z.id === "marker.toggleIncorrectExample" && C && (I = () => be()), z.id === "marker.openIncorrectExamples" && (I = () => _(!0)), z.id === "markerGroup.toggleCollapse" && D && (I = () => we(D)), z.id === "markerGroup.toggleAll" && (I = () => ae((b) => Cd(b, G))), z.id === "marker.assignSlots" && (I = () => {
      var b;
      return (b = le.current) == null ? void 0 : b.click();
    }), z.id === "navigation.zoomIn" && (I = () => re((b) => pr(b + 0.5))), z.id === "navigation.zoomOut" && (I = () => re((b) => pr(b - 0.5))), z.id === "navigation.resetZoom" && (I = () => re(1)), z.id === "navigation.centerPlayhead" && (I = () => {
      var b;
      return (b = o.current) == null ? void 0 : b.call(o);
    }), z.id === "layout.growSwimlanes" && (I = () => xe(c.timelineRatio + 0.05)), z.id === "layout.shrinkSwimlanes" && (I = () => xe(c.timelineRatio - 0.05)), z.id === "marker.confirm" && C && (I = () => E("approved")), z.id === "system.publishApproved" && (I = () => w(oe.target)), z.id === "marker.reject" && C && (I = () => E("rejected")), z.id === "system.emptyBin" && (I = () => u()), z.id === "system.deleteRejected" && (I = () => l()), I && I();
  }
  function ie(z, oe) {
    const I = Vn.find((b) => b.id === z);
    I && $n(I, i) && Q(I, oe);
  }
  return {
    executeShortcutById: ie,
    stepVideoFrame: (z) => ee(z < 0 ? -1 : 1)
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
  const [a, s] = B(null), [l, d] = B(null), [c, g] = B(""), [u, f] = B({
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
      const j = (k == null ? void 0 : k[0]) || null;
      return s(j), (j == null ? void 0 : j.status) === "completed" && m.current !== j.id && (m.current = j.id, await t()), ((j == null ? void 0 : j.status) === "failed" || (j == null ? void 0 : j.status) === "cancelled") && g(j.errorMessage || "Video analysis did not complete."), j;
    } catch (k) {
      return w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(w = null) {
    g("");
    const k = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), j = k.includes("omnishotcut") && o > 0;
    if (!(j && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const E = await X(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: k,
            replaceShotBoundaries: j,
            expectedShotBoundaryFingerprint: j ? i : null
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
    let k = setTimeout(async function j() {
      await h(w), w.isActive() && (k = setTimeout(j, 2500));
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
  const [g, u] = B(null), [f, m] = B([]), p = pe(null), h = pe(null), y = pe([]), w = pe(null), [k, j] = B(() => xt({})), [E, $] = B(!1), [G, S] = B(el), [C, A] = B(0), D = pe(null), [K] = B(() => rl({
    getContext: () => D.current,
    drainAfterSettle: !1
  })), ae = Vl(K.subscribe, K.getSnapshot), _ = Jr(ae), T = (F, se) => K.acquire({ kind: F, lockId: se }), P = (F) => K.enqueue(F), H = K.getSnapshot, [ne, re] = Wl(cl, []), [V, le] = B(!1), [L, te] = B(""), [ue, be] = B(""), [we, xe] = B(""), [Y, fe] = B(1), [ee, Q] = B(Ud), [ie, z] = B(0), [oe, I] = B({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [b, v] = B(Bt), x = pe(Bt), [N, M] = B(!1), [J, U] = B(!1), [ce, R] = B(!1), W = pe(!1);
  W.current = ce;
  const [q, ge] = B(null), [Ce, $e] = B(null), [Se, Xe] = B(!1), [Ze, Ie] = B(null), [He, Je] = B(null), Ke = pe(null), [Z, de] = B(!1), [Ee, Be] = B(""), ke = pe(null), _e = pe(null), Ye = pe(!1), [Ne, he] = B(Kd), [We, Pe] = B(null), [Te, et] = B(!1), [Ge, Oe] = B(!1), [De, ze] = B(!1), [Pt, Le] = B(!1), [St, An] = B(!1), [dt, Ae] = B(""), {
    analysisError: Re,
    analysisRun: Ve,
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
  ), [at, Ot] = B(!1), [Rn, nn] = B(null), [Tt, qt] = B(l), [rn, kr] = B(0), [on, wr] = B(!1), [kt, Wt] = B(""), [Yn, Vt] = B(null), Mn = pe(null), Qn = pe(null), an = pe(!1), [Kt, sn] = B([]), [Zn, Nr] = B(!1), [Xn, Ir] = B(null), ln = Bd(), dn = pe(null), En = pe(null), cn = pe(null), Cr = pe(s), er = pe(null), un = pe(null), Jt = pe(null), mn = pe(null), Dn = pe(null), ct = pe(null), tr = pe(null), Pn = pe(null), At = pe(null), nr = pe(null), gn = pe(null), pn = pe(null), $r = pe(-1e12), Tr = pe(null), Ar = pe(!1), fn = pe(null), [On, yn] = B({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!at || on || !kt) return;
    const F = requestAnimationFrame(() => {
      var se;
      return (se = Qn.current) == null ? void 0 : se.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(F);
  }, [at, on, kt]), ye(() => {
    if (!an.current || at || Tt) return;
    const F = requestAnimationFrame(() => {
      var se;
      (se = Mn.current) == null || se.focus({ preventScroll: !0 }), an.current = !1;
    });
    return () => cancelAnimationFrame(F);
  }, [at, Tt]);
  const tt = e.video, lt = e.segments || Un, it = qe(() => JSON.stringify({
    segments: lt.map((F) => [
      F.id,
      F.itemId,
      F.nativeSegmentId,
      F.tagId,
      F.startSec,
      F.endSec,
      F.reviewState,
      F.published,
      F.sourceKey,
      F.sourceRunId,
      F.confidence,
      F.revision,
      F.updatedAt
    ]),
    performerSlots: (e.performerSlots || Un).map((F) => [
      F.segmentId,
      F.slotDefinitionId,
      F.performerId,
      F.sortOrder
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
    let F = !0;
    qt(!0);
    const se = setTimeout(() => {
      X(`/videos/${tt.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((Fe) => {
        F && (nn(Fe), Wt(""));
      }).catch((Fe) => {
        F && (nn(null), Wt(Fe.message || "Unable to preview derived segments."));
      }).finally(() => {
        F && qt(!1);
      });
    }, 150);
    return () => {
      F = !1, clearTimeout(se);
    };
  }, [l, tt.id, it, rn, _]);
  const rr = () => kr((F) => F + 1), wt = e.segmentGroups || Un, ht = e.performerSlots || Un, or = l && e.performerSlotsAvailable !== !1, Lt = qe(
    () => (e.performerCandidates || []).filter((F) => F.isVideoPerformer),
    [e.performerCandidates]
  ), Ln = e.shotBoundaries || Un, bn = qe(
    () => xi(ht),
    [ht]
  ), Fn = qe(
    () => lt.map((F) => {
      const se = bn.get(F.id) || [];
      return {
        ...F,
        slots: se,
        assignment: se.every((Fe) => Fe.performerId == null) ? Ul(se, Lt) : null
      };
    }).filter((F) => F.slots.length > 0 && F.assignment != null),
    [lt, bn, Lt]
  ), jn = Number((jo = tt.videoFile) == null ? void 0 : jo.frameRate) > 0 ? Number(tt.videoFile.frameRate) : 30;
  function hn() {
    const F = W.current;
    R(!1), F && requestAnimationFrame(() => {
      var se;
      return (se = ct.current) == null ? void 0 : se.focus({ preventScroll: !0 });
    });
  }
  function Rt() {
    _ == null && (pn.current = null, Xe(!1), te(""), requestAnimationFrame(() => {
      var F;
      return (F = ct.current) == null ? void 0 : F.focus({ preventScroll: !0 });
    }));
  }
  function Yt() {
    $(!1), requestAnimationFrame(() => {
      var F, se;
      (F = Pn.current) != null && F.isConnected ? Pn.current.focus({ preventScroll: !0 }) : (se = ct.current) == null || se.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    gn.current === g ? (gn.current = null, R(!0)) : R(!1);
  }, [g]), ye(() => {
    var se;
    if (!ce) return;
    const F = (se = nr.current) == null ? void 0 : se.querySelector("input");
    document.activeElement !== F && (F == null || F.focus({ preventScroll: !0 }), F == null || F.select());
  }, [ce, g]), ye(() => {
    var se;
    if (ce) return;
    const F = (se = ct.current) == null ? void 0 : se.ownerDocument;
    F && F.activeElement === F.body && ct.current.focus({ preventScroll: !0 });
  }, [ce]), ye(() => {
    var Fe, rt, Nt;
    const F = Xt(
      Br(
        e.segments,
        e.performerSlots || [],
        xt({}),
        l && G,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), se = ((Fe = e.segments.find((wn) => wn.id === s)) == null ? void 0 : Fe.id) ?? ((rt = qa(F)) == null ? void 0 : rt.id) ?? null;
    u(se), m(se == null ? [] : [se]), h.current = se, y.current = [], Pe(It(F, se)), j(xt({})), $(!1), pn.current = null, Xe(!1), $e(null), fe(1), te(""), v(Bt), x.current = Bt, M(!1), (Nt = ct.current) == null || Nt.focus({ preventScroll: !0 });
  }, [tt.id, s]), ye(() => {
    const F = new AbortController();
    return X(`/videos/${tt.id}/incorrect-examples`, { signal: F.signal }).then(sn).catch((se) => {
      se.name !== "AbortError" && sn([]);
    }), () => F.abort();
  }, [tt.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const F = new AbortController();
    return X(`/videos/${tt.id}/history`, { signal: F.signal }).then((se) => {
      const Fe = se || Bt;
      x.current = Fe, v(Fe);
    }).catch((se) => {
      se.name !== "AbortError" && te(se.message || "Unable to load editor history.");
    }), () => F.abort();
  }, [tt.id]), ye(() => {
    Hd(ee);
  }, [ee.timelineRatio, ee.markerRailOpen, ee.detailWidth, ee.markerRailWidth, ee.swimlaneTitleWidth]), ye(() => {
    zd(Ne);
  }, [Ne]), ye(() => {
    tl(G);
  }, [G]), ye(() => {
    const F = un.current;
    if (!a || !F || typeof ResizeObserver > "u") return;
    const se = () => {
      var Nt;
      const rt = Math.max(0, F.clientHeight - (((Nt = Jt.current) == null ? void 0 : Nt.offsetHeight) || 0));
      z(rt), Q((wn) => {
        const Ko = lo(wn.timelineRatio, rt);
        return Ko === wn.timelineRatio ? wn : { ...wn, timelineRatio: Ko };
      });
    }, Fe = new ResizeObserver(se);
    return Fe.observe(F), Jt.current && Fe.observe(Jt.current), se(), () => Fe.disconnect();
  }, [a]), ye(() => {
    if (!ln || typeof ResizeObserver > "u") return;
    const F = Dn.current, se = mn.current;
    if (!F || !se) return;
    const Fe = () => I({
      workspace: F.clientWidth,
      focusRow: se.clientWidth,
      focusRowHeight: se.clientHeight
    }), rt = new ResizeObserver(Fe);
    return rt.observe(F), rt.observe(se), Fe(), () => rt.disconnect();
  }, [ln, ee.markerRailOpen]);
  const Mt = qe(
    () => ti(Il(lt, Ce), ne),
    [lt, Ce, ne]
  );
  ql(() => {
    ne.length > 0 && re({ type: "prune", detail: e });
  }, [e, ne]);
  const Ft = qe(
    () => pa(
      Br(
        Mt,
        ht,
        k,
        l && G,
        wt
      ),
      Kt,
      !0
    ),
    [
      Mt,
      ht,
      k,
      G,
      wt,
      l,
      Kt
    ]
  ), Rr = Object.fromEntries(mt.map((F) => [F, Ft.filter((se) => se.reviewState === F).length])), Mr = pa(
    Br(
      Mt,
      ht,
      { ...k, reviewStates: mt },
      l && G,
      wt
    ),
    Kt,
    !0
  ), Er = Object.fromEntries(mt.map((F) => [F, Mr.filter((se) => se.reviewState === F).length])), vn = [...new Set(Mt.map((F) => F.sourceKey).filter(Boolean))].sort((F, se) => $t(F).localeCompare($t(se))), xn = Ks(
    k,
    l && G
  ), O = qe(
    () => Xt(Ft, wt, ht),
    [Ft, wt, ht]
  ), ve = _s(
    O,
    g,
    s
  ), me = ve == null ? null : lt.find((F) => F.id === ve.id) || ve, nt = Yo(lt, Yo(Ft, f).map((F) => F.id)), jt = !l && nt.length > 0 && nt.every((F) => F.nativeSegmentId != null), Et = Ft.map((F) => F.id), Dr = Et.join("|");
  p.current = (me == null ? void 0 : me.id) ?? null;
  const So = bn.get(me == null ? void 0 : me.id) || [], Mi = bo(So), ko = qe(
    () => wd(O, f),
    [O, f]
  ), Pr = qe(() => ho(O), [O]), Bn = qe(
    () => Sd(Pr, Ne),
    [Pr, Ne]
  ), Ei = qe(
    () => Si(
      Bn.rows,
      On.scrollTop,
      On.height
    ),
    [Bn, On]
  ), Or = qe(
    () => Id(O, Ne),
    [O, Ne]
  ), Di = gr(Or, me == null ? void 0 : me.id, -1, !0) != null, Pi = gr(Or, me == null ? void 0 : me.id, 1, !0) != null, Sn = me ? It(O, me.id) : null, Lr = wt.length > 0 ? Pr.map((F) => F.key) : [], Oi = Lr.join("|"), ar = Math.max(
    0,
    Number((Bo = tt.videoFile) == null ? void 0 : Bo.duration) || 0,
    ...Mt.map((F) => Number(F.endSec ?? F.startSec) || 0)
  ), wo = Number((Go = tt.videoFile) == null ? void 0 : Go.duration) > 0 ? Number(tt.videoFile.duration) : null;
  b.actions;
  const Li = ai();
  ye(() => {
    const F = g === fr ? g : (me == null ? void 0 : me.id) ?? null;
    F !== g && u(F);
  }, [me, g]), ye(() => {
    m((F) => {
      const se = Js(
        F,
        Et,
        (me == null ? void 0 : me.id) ?? null
      );
      return se.length === F.length && se.every((Fe, rt) => Fe === F[rt]) ? F : se;
    });
  }, [Dr, me == null ? void 0 : me.id]);
  const kn = (me == null ? void 0 : me.itemId) == null ? null : ((Uo = e.itemMetadata) == null ? void 0 : Uo[me.itemId]) || null, Fi = {
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
    be(ve == null ? "" : String(ve.startSec)), xe((ve == null ? void 0 : ve.endSec) == null ? "" : String(ve.endSec));
  }, [ve == null ? void 0 : ve.id, ve == null ? void 0 : ve.startSec, ve == null ? void 0 : ve.endSec]), ye(() => {
    Sn && he((F) => Ni(F, Sn));
  }, [tt.id, s, Sn]), ye(() => {
    Pe((F) => Ad(Lr, F, Sn));
  }, [tt.id, Oi, Sn]), ye(() => {
    if (!ee.markerRailOpen || (me == null ? void 0 : me.id) == null) return;
    const F = fn.current, se = Bn.rows.find((Nt) => Nt.kind === "segment" && Nt.segment.id === me.id);
    if (!F || !se) return;
    const Fe = se.top + se.height;
    let rt = F.scrollTop;
    se.top < F.scrollTop ? rt = se.top : Fe > F.scrollTop + F.clientHeight && (rt = Math.max(0, Fe - F.clientHeight)), rt !== F.scrollTop && (F.scrollTop = rt), yn({ scrollTop: rt, height: F.clientHeight });
  }, [me == null ? void 0 : me.id, Bn, ee.markerRailOpen]), ye(() => {
    const F = fn.current;
    if (!ee.markerRailOpen || !F) return;
    const se = () => yn({
      scrollTop: F.scrollTop,
      height: F.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      se();
      return;
    }
    const Fe = new ResizeObserver(se);
    return Fe.observe(F), se(), () => Fe.disconnect();
  }, [ee.markerRailOpen]);
  const { revealSegmentGroupForSelection: No, replaceSegmentSelection: ji, selectSegment: Io, selectSegmentCollection: Bi, selectAllVideoSegments: Gi } = wc({
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
    setCollapsedSegmentGroups: he,
    setEditorFilters: j,
    setHideDerivedSegments: S,
    setSaveMessage: te,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: jr, recordHistoryAction: ir, mutateSegment: Ui, completeReview: Ki, createSegment: Co, splitSegment: $o, duplicateSegment: To, saveTiming: zi, applyShortcutTiming: Hi } = jd({
    compatibilityMode: l,
    currentTime: C,
    detail: e,
    editorFilters: k,
    endInput: we,
    hideDerivedSegments: G,
    historyRef: x,
    mediaDuration: wo,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: $r,
    pendingDuplicateRef: Tr,
    pendingFirstSegmentStartSecRef: pn,
    pendingTagEditSegmentIdRef: gn,
    heldCreatedSegmentTag: Ce,
    setHeldCreatedSegmentTag: $e,
    replaceSegmentSelection: ji,
    savingSegmentId: _,
    segments: lt,
    selectedSegment: me,
    selectedSegmentIdRef: p,
    selectedSegments: nt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setCreatingSegmentId: ge,
    setEditorFilters: j,
    setFirstSegmentTagOpen: Xe,
    setHideDerivedSegments: S,
    setHistory: v,
    setHistoryOpen: M,
    setPublishApprovedError: Be,
    setSaveMessage: te,
    acquireSaveLock: T,
    dispatchPendingChanges: re,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: R,
    startInput: ue,
    tagEditingRef: W,
    timelineDuration: ar,
    video: tt
  });
  function Ao(F = null) {
    var rt;
    if (!l || _ != null || !lt.some((Nt) => !Nt.published && Nt.reviewState === "approved")) return;
    const se = ((rt = ct.current) == null ? void 0 : rt.ownerDocument) ?? document, Fe = se.activeElement === se.body ? null : se.activeElement;
    _e.current = F != null && F.isConnected && F !== se.body ? F : Fe, Be(""), de(!0);
  }
  function Ro() {
    _ == null && (de(!1), Be(""), requestAnimationFrame(() => {
      Ac(
        _e.current,
        ct.current
      ), _e.current = null;
    }));
  }
  async function _i() {
    await Ki() && Ro();
  }
  const { closeMergeConfirmation: qi, mergeSelectedSwimlane: Mo, saveSelectedReviewState: Wi } = Nc({
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
    selectedSegments: nt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: Ie,
    setSaveMessage: te,
    acquireSaveLock: T,
    dispatchPendingChanges: re,
    enqueueSave: P,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  }), Vi = (F) => {
    const se = (F || []).map(co);
    K.cancel((Fe) => Fe.kind === "review" && Za(Fe.targets, se));
  };
  D.current = { detail: e, segments: lt, onConflict: r, onDetailChange: t, onReload: o }, ye(() => {
    K.poke();
  });
  const { toggleIncorrectExample: Ji, removeIncorrectExample: Yi, captureTrainingExport: Qi, deleteRejectedSegments: Eo, autoAssignPerformers: Zi, previewDerivedSegments: Xi, closeMaterializeDialog: es, materializeDerivedSegments: ts, saveTag: ns, applyHeldCreatedSegmentTag: rs, moveToBin: os, emptyRecyclingBin: as } = Ic({
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
    hideDerivedSegments: G,
    incorrectExamples: Kt,
    lineage: Fr,
    materializeButtonRef: Mn,
    materializePreview: Rn,
    materializeRestoreFocusRef: an,
    materializing: on,
    mutateSegment: Ui,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: ht,
    heldCreatedSegmentTag: Ce,
    setHeldCreatedSegmentTag: $e,
    recordHistoryAction: ir,
    refreshMaterializationPreview: rr,
    removingExampleId: Xn,
    revealSegmentGroupForSelection: No,
    savingSegmentId: _,
    segmentGroups: wt,
    segments: lt,
    selectedSegment: me,
    selectedSegmentIdRef: p,
    selectedSegments: nt,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: Ae,
    setAutoAssignOpen: Le,
    setAutoAssigning: An,
    setEditorFilters: j,
    setExportingExamples: Nr,
    setHideDerivedSegments: S,
    setIncorrectExamples: sn,
    setMaterializeError: Wt,
    setMaterializeLoading: qt,
    setMaterializeOpen: Ot,
    setMaterializePreview: nn,
    setMaterializing: wr,
    setRemovingExampleId: Ir,
    setRejectedDeletionPreview: Je,
    setSaveMessage: te,
    acquireSaveLock: T,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: tt
  });
  ye(() => {
    const F = Ce, se = Cl(F, {
      segments: lt,
      savingSegmentId: Jr(K.getSnapshot()),
      reviewSaving: Qo(K.getSnapshot(), "review"),
      tagEditing: ce,
      selectedSegmentIds: f,
      activeSegmentId: me == null ? void 0 : me.id
    });
    se === "none" || se === "wait" || ($e(null), se === "apply" && rs(F));
  }, [Ce, lt, _, me == null ? void 0 : me.id, f, ce]);
  const { restoreHistoryTarget: is, updateTimelineRatio: Do, handleSeparatorPointerDown: ss, handleSeparatorPointerMove: ls, handleSeparatorKeyDown: ds, panelWidthMaximum: Po, panelSeparatorProps: cs, toggleSegmentRail: us, toggleSegmentGroup: Oo, mutateShotBoundary: ms } = Cc({
    acceptHistory: jr,
    compatibilityMode: l,
    currentTime: C,
    detail: e,
    editorLayout: ee,
    focusRowRef: mn,
    history: b,
    historyRef: x,
    historySaving: J,
    horizontalLayoutSize: oe,
    mediaStackHeight: ie,
    mediaStackRef: un,
    commonActionsRef: Jt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: tr,
    recordHistoryAction: ir,
    savingSegmentId: _,
    savingShot: V,
    savingShotRef: Ar,
    setCollapsedSegmentGroups: he,
    setEditorLayout: Q,
    setHistorySaving: U,
    setIncorrectExamples: sn,
    setSaveMessage: te,
    acquireSaveLock: T,
    setSavingShot: le,
    shotBoundaries: Ln,
    timelineDuration: ar,
    video: tt,
    workspaceRef: Dn
  }), { executeShortcutById: Lo, stepVideoFrame: gs } = $c({
    allSwimlanes: O,
    applyShortcutTiming: Hi,
    centerTimelineRef: er,
    compatibilityMode: l,
    createSegment: Co,
    currentTime: C,
    deleteRejectedSegments: Eo,
    duplicateSegment: To,
    editorLayout: ee,
    editorRef: ct,
    emptyRecyclingBin: as,
    lineage: Fr,
    mediaDuration: wo,
    mergeSelectedSwimlane: Mo,
    moveToBin: os,
    mutateShotBoundary: ms,
    openPublishApprovedDialog: Ao,
    playbackControlsRef: En,
    playbackShortcutConfig: Li,
    saveSelectedReviewState: Wi,
    seekRef: dn,
    segmentGroupKeys: Lr,
    selectSegment: Io,
    selectedSegment: me,
    selectedSegmentGroupForSegment: Sn,
    selectedSegmentGroupKey: We,
    selectedSegments: nt,
    setCollapsedSegmentGroups: he,
    setIncorrectExamplesOpen: ze,
    setQuickSearchOpen: Oe,
    setSaveMessage: te,
    setSelectedSegmentGroupKey: Pe,
    setTagEditing: R,
    setTimelineZoom: fe,
    shotBoundaries: Ln,
    slotButtonRef: At,
    splitSegment: $o,
    swimlanes: Or,
    timelineDuration: ar,
    toggleIncorrectExample: Ji,
    toggleSegmentGroup: Oo,
    updateTimelineRatio: Do,
    videoFrameRate: jn,
    visibleSegments: Ft
  });
  cn.current = Lo;
  const ps = qe(() => Vn.map((F) => ({
    id: F.id,
    enabled: $n(F, l),
    surface: "local",
    action: (se) => {
      var Fe;
      return (Fe = cn.current) == null ? void 0 : Fe.call(cn, F.id, se);
    }
  })), [l]);
  Pa(ao, ps);
  const fs = so(ie), ys = Zt(ee.markerRailWidth, Po("markerRailWidth")), bs = Zt(ee.detailWidth, Po("detailWidth"));
  return n(kc, {
    activeFilterCount: xn,
    allSwimlanes: O,
    analysisError: Re,
    analysisRun: Ve,
    analysisStatus: bt,
    approvalFacetCounts: Er,
    autoAssignCandidates: Fn,
    autoAssignError: dt,
    autoAssignOpen: Pt,
    autoAssignPerformers: Zi,
    autoAssigning: St,
    canMoveSelectionToBin: jt,
    captureTrainingExport: Qi,
    cancelQueuedReviewsForSegments: Vi,
    removeIncorrectExample: Yi,
    rejectedDeletionPreview: He,
    centerTimelineRef: er,
    closeEditorFilters: Yt,
    closeFirstSegmentTagDialog: Rt,
    closeMaterializeDialog: es,
    closeMergeConfirmation: qi,
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
    detailWidth: bs,
    duplicateSegment: To,
    editorFilters: k,
    editorLayout: ee,
    editorRef: ct,
    exportingExamples: Zn,
    filtersButtonRef: Pn,
    filtersOpen: E,
    firstSegmentTagOpen: Se,
    focusRowRef: mn,
    handleSeparatorKeyDown: ds,
    handleSeparatorPointerDown: ss,
    handleSeparatorPointerMove: ls,
    hideDerivedSegments: G,
    history: b,
    historyOpen: N,
    historySaving: J,
    hasNextUnreviewed: Pi,
    hasPreviousUnreviewed: Di,
    horizontalLayoutSize: oe,
    importNativeSegments: st,
    incorrectExamples: Kt,
    incorrectExamplesOpen: De,
    removingExampleId: Xn,
    lineage: Fr,
    markerRailWidth: ys,
    materializeButtonRef: Mn,
    materializeCancelButtonRef: Qn,
    materializeDerivedSegments: ts,
    materializeError: kt,
    materializeLoading: Tt,
    materializeOpen: at,
    materializePreview: Rn,
    materializing: on,
    mediaStackRef: un,
    mergeCancelButtonRef: Ke,
    mergeConfirmation: Ze,
    mergeSaving: Qo(ae, "merge"),
    mergeSelectedSwimlane: Mo,
    nativeImportState: Ut,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: Ao,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: cs,
    pendingInitialSeekRef: Cr,
    performerSlots: ht,
    performerSlotsAvailable: or,
    playbackControlsRef: En,
    previewDerivedSegments: Xi,
    provenance: Fi,
    provenanceSources: vn,
    publishApprovedCancelButtonRef: ke,
    publishApprovedDrafts: _i,
    publishApprovedError: Ee,
    publishApprovedOpen: Z,
    quickSearchOpen: Ge,
    railScrollRef: fn,
    railToggleRef: tr,
    recordHistoryAction: ir,
    restoreHistoryTarget: is,
    runEditorAction: Lo,
    stepVideoFrame: gs,
    saveMessage: L,
    setSaveMessage: te,
    saveTag: ns,
    saveTiming: zi,
    savingSegmentId: _,
    acquireSaveLock: T,
    seekRef: dn,
    segmentGroups: wt,
    segmentRailLayout: Bn,
    segments: Mt,
    selectAllVideoSegments: Gi,
    selectSegment: Io,
    selectSegmentCollection: Bi,
    selectedGroups: ko,
    selectedPerformerSlots: So,
    selectedSegment: ve,
    selectedSegmentGroupKey: We,
    selectedSegmentIds: f,
    selectedSegments: nt,
    selectedSlotStatus: Mi,
    setAutoAssignError: Ae,
    setAutoAssignOpen: Le,
    setConfiguringTag: Vt,
    setCurrentTime: A,
    setEditorFilters: j,
    setEditorLayout: Q,
    setFiltersOpen: $,
    setHideDerivedSegments: S,
    setHistoryOpen: M,
    setIncorrectExamplesOpen: ze,
    setQuickSearchOpen: Oe,
    setRejectedDeletionPreview: Je,
    setRailViewport: yn,
    setSelectedSegmentGroupKey: Pe,
    setSelectedSegmentId: u,
    setShortcutsOpen: et,
    setTimelineZoom: fe,
    shotBoundaries: Ln,
    shortcutsOpen: Te,
    slotButtonRef: At,
    splitLayout: a,
    splitSegment: $o,
    startFullAnalysis: pt,
    tagEditing: ce,
    creatingSegmentId: q,
    tagSearchRef: nr,
    timelineDuration: ar,
    timelineRatioBounds: fs,
    timelineZoom: Y,
    toggleSegmentGroup: Oo,
    toggleSegmentRail: us,
    updateTimelineRatio: Do,
    video: tt,
    videoPerformers: Lt,
    visibleCounts: Rr,
    visibleSegmentRailRows: Ei,
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
    const w = new Set(y), k = y.map((S) => o.get(S)), j = l.filter((S) => w.has(S.sourceTagId) && w.has(S.derivedTagId)), E = j.flatMap((S) => S.rules), $ = k.filter((S) => S.outgoingRuleCount === 0).sort((S, C) => ut(S.name, C.name)), G = $.length > 0 ? $ : [...k].sort((S, C) => ut(S.name, C.name));
    g.push({
      id: [...y].sort((S, C) => S - C).join(":"),
      label: G.length > 1 ? `${G[0].name} + ${G.length - 1}` : ((m = G[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: k,
      connections: j,
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
    var D, K;
    (D = g.get(A.sourceTagId)) == null || D.add(A.derivedTagId), (K = u.get(A.derivedTagId)) == null || K.add(A.sourceTagId);
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
  const j = [...k.values()].sort((A, D) => A.sortOrder - D.sortOrder || ut(A.name, D.name));
  let E = 28;
  const $ = [], G = j.map((A) => {
    const D = /* @__PURE__ */ new Map();
    A.nodes.forEach((P) => {
      const H = m.get(P.tagId) || 0;
      D.has(H) || D.set(H, []), D.get(H).push(P);
    });
    for (const P of D.values())
      P.sort((H, ne) => H.segmentGroupTagSortOrder - ne.segmentGroupTagSortOrder || ut(H.name, ne.name));
    const K = Math.max(1, ...[...D.values()].map((P) => P.length)), ae = K * 58 + (K - 1) * 18, _ = 70 + ae, T = {
      ...A,
      x: 12,
      y: E,
      width: w - 24,
      height: _
    };
    for (const [P, H] of D.entries()) {
      const ne = H.length * 58 + Math.max(0, H.length - 1) * 18, re = (ae - ne) / 2;
      H.forEach((V, le) => $.push({
        ...V,
        rank: P,
        x: 28 + P * 296,
        y: E + 34 + 18 + re + le * 76,
        width: 184,
        height: 58
      }));
    }
    return E += _ + 16, T;
  }), S = new Map($.map((A) => [A.tagId, A])), C = e.connections.map((A) => {
    const D = S.get(A.sourceTagId), K = S.get(A.derivedTagId), ae = D.x + D.width, _ = D.y + D.height / 2, T = K.x, P = K.y + K.height / 2, H = Math.max(48, (T - ae) * 0.48);
    return {
      ...A,
      path: `M ${ae} ${_} C ${ae + H} ${_}, ${T - H} ${P}, ${T} ${P}`
    };
  });
  return {
    width: w,
    height: Math.max(r, E - 16 + 28),
    nodes: $,
    connections: C,
    groups: G
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
      const h = m.get(p.sourceTagId), y = m.get(p.derivedTagId), w = h.x + h.width, k = h.y + h.height / 2, j = y.x, E = y.y + y.height / 2, $ = Math.max(48, (j - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${k} C ${w + $} ${k}, ${j - $} ${E}, ${j} ${E}`
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
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: h, materializationOffer: y, materializeOutgoingRules: w, materializeRule: k, message: j, normalizedQuery: E, query: $, refreshConfiguredTag: G, revealEditor: S, rules: C, save: A, segmentGroupKey: D, selectedNode: K, selectedRule: ae, selection: _, setConfiguringTag: T, setDraft: P, setListSort: H, setMaterializationOffer: ne, setQuery: re, setSegmentGroupKey: V, setSelection: le, setView: L, sortedVisibleRules: te, sourceSlots: ue, sourceSlotsLoading: be, updateMapping: we, updateTag: xe, view: Y, visibleComponents: fe, visibleRules: ee } = e;
  function Q(b) {
    const v = m.nodes.find((N) => N.tagId === Number(b.sourceTagId)), x = m.nodes.find((N) => N.tagId === Number(b.derivedTagId));
    return (v == null ? void 0 : v.segmentGroupKey) === (x == null ? void 0 : x.segmentGroupKey) ? v.segmentGroupKey : "cross-group";
  }
  function ie() {
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
              onChange: (b, v) => xe("source", b, v == null ? void 0 : v.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !be && ue.length === 0 ? n("div", {
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
              onChange: (b, v) => xe("derived", b, v == null ? void 0 : v.label),
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
            disabled: r || ue.length === 0 || s.length === 0,
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
              onChange: (x) => we(v, "sourceSlotDefinitionId", x.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${v + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ue.map((x) => n("option", { key: x.id, value: x.id }, gt(x)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: b.derivedSlotDefinitionId,
              disabled: r,
              onChange: (x) => we(v, "derivedSlotDefinitionId", x.target.value),
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
  function z() {
    if (K) {
      const x = ee.filter((J) => Number(J.derivedTagId) === K.tagId), N = ee.filter((J) => Number(J.sourceTagId) === K.tagId), M = (J, U, ce) => n("div", {
        key: J.id,
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
            `${J.sourceTagName} → ${J.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          ce ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => k(J),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => g(J, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(J),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, K.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, K.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${K.incomingRuleCount} incoming · ${K.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (J) => T({
            tagId: K.tagId,
            tagName: K.name,
            trigger: J.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        N.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(K, N),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${N.length})`) : null,
        N.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...N.map((J) => M(J, "Derives", !0))
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
            x.map((J) => M(J, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!ae)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const b = m.nodes.find((x) => x.tagId === Number(ae.sourceTagId)), v = m.nodes.find((x) => x.tagId === Number(ae.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (b == null ? void 0 : b.segmentGroupName) || "Ungrouped"),
          (b == null ? void 0 : b.segmentGroupKey) !== (v == null ? void 0 : v.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(v == null ? void 0 : v.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${ae.sourceTagName} → ${ae.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${ae.edgeCount} materialized lineage edge${ae.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === ae.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => k(ae, y),
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
        ae.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : ae.slotMappings.map((x, N) => n("div", {
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
          ae.createdAt ? new Date(ae.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          ae.updatedAt ? new Date(ae.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => k(ae),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(ae),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(ae),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function oe() {
    if (fe.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, E ? "No derivation relationships match your search." : "No derivation rules.");
    const b = K == null ? void 0 : K.tagId, v = /* @__PURE__ */ new Set();
    return K && (v.add(K.tagId), p.connections.forEach((x) => {
      (x.sourceTagId === K.tagId || x.derivedTagId === K.tagId) && (v.add(x.sourceTagId), v.add(x.derivedTagId));
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
            const N = b === x.sourceTagId || b === x.derivedTagId, M = K != null, J = N ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${x.id}:visible`,
              d: x.path,
              fill: "none",
              stroke: J,
              strokeWidth: N ? 2.5 : 1.5,
              opacity: M && !N ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((x) => {
          const N = !E || x.name.toLocaleLowerCase().includes(E), M = K != null, J = v.has(x.tagId), U = (K == null ? void 0 : K.tagId) === x.tagId;
          return n("button", {
            key: `node:${x.tagId}`,
            type: "button",
            onClick: () => le({ type: "node", id: x.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${U ? "border-accent bg-accent/15 ring-2 ring-accent/25" : J ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${x.x}px`,
              top: `${x.y}px`,
              width: `${x.width}px`,
              height: `${x.height}px`,
              opacity: !N || M && !J ? 0.62 : 1
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
          const N = p.nodes.find((J) => J.tagId === x.sourceTagId), M = p.nodes.find((J) => J.tagId === x.derivedTagId);
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
    te.forEach((x) => {
      const N = Q(x);
      b.has(N) || b.set(N, []), b.get(N).push(x);
    });
    const v = [
      ...m.segmentGroups.map((x) => x.key),
      "cross-group"
    ].filter((x) => b.has(x));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, v.map((x) => {
      const N = m.segmentGroups.find((U) => U.key === x), M = x === "cross-group" ? "Cross-group relationships" : (N == null ? void 0 : N.name) || "Ungrouped", J = b.get(x);
      return n("section", { key: x, "aria-label": M }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, M),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${J.length} rule${J.length === 1 ? "" : "s"}`
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
          ...J.map((U) => n("button", {
            key: U.id,
            type: "button",
            role: "row",
            onClick: () => le({ type: "rule", id: U.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(ae == null ? void 0 : ae.id) === U.id ? "bg-accent/10" : ""}`,
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
          P(f()), le(null), S();
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
            re(b.target.value), le(null);
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
            V(b.target.value), le(null), P(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((b) => n("option", { key: b.key, value: b.key }, b.name))
        ])
      ]),
      Y === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
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
            L(b), b === "graph" && (_ == null ? void 0 : _.type) === "rule" && le(null);
          },
          "aria-pressed": Y === b,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Y === b ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        Y === "graph" ? oe() : I()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? ie() : z()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      j ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, j) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => G(i),
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
  }), [o, i] = B([]), [a, s] = B(null), [l, d] = B([]), [c, g] = B([]), [u, f] = B(!1), [m, p] = B(!1), [h, y] = B(!1), [w, k] = B(""), [j, E] = B(""), [$, G] = B("graph"), [S, C] = B("all"), [A, D] = B(null), [K, ae] = B("relationship"), [_, T] = B(null), [P, H] = B(null), ne = pe(null), re = pe(null), V = ui().replace(/:/g, "");
  function le() {
    requestAnimationFrame(() => {
      var R;
      return (R = ne.current) == null ? void 0 : R.scrollIntoView({ block: "nearest" });
    });
  }
  async function L(R) {
    const W = await X("/derivation-rules", R ? { signal: R } : void 0);
    i(W || []);
  }
  ye(() => {
    const R = new AbortController();
    return L(R.signal).catch((W) => {
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
    re.current !== R && (re.current = R, s((W) => !W || Number(W.sourceTagId) !== Number(a.sourceTagId) || Number(W.derivedTagId) !== Number(a.derivedTagId) ? W : yd(W, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function te(R, W = !1) {
    W || D({ type: "rule", id: R.id }), re.current = null, s({
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
    }), k(""), le();
  }
  function ue(R, W, q = "") {
    re.current = null, R === "source" ? (d([]), f(W != null)) : (g([]), p(W != null)), s((ge) => ({
      ...ge,
      [`${R}TagId`]: W == null ? null : Number(W),
      [`${R}TagName`]: q || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function be(R) {
    (a == null ? void 0 : a.ruleId) == null && (re.current = null);
    const W = [L(), t == null ? void 0 : t()];
    return R.draftKind === "source" ? (f(!0), W.push(X(`/slot-definitions/${R.tagId}`).then((q) => d(q.definitions || [])).finally(() => f(!1)))) : R.draftKind === "derived" && (p(!0), W.push(X(`/slot-definitions/${R.tagId}`).then((q) => g(q.definitions || [])).finally(() => p(!1)))), Promise.all(W);
  }
  function we(R, W, q) {
    s((ge) => ({
      ...ge,
      slotMappings: ge.slotMappings.map((Ce, $e) => $e === R ? { ...Ce, [W]: q } : Ce)
    }));
  }
  async function xe() {
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
      if (await L(), D($ === "graph" ? { type: "node", id: Number(q.sourceTagId) } : { type: "rule", id: q.id }), s(null), a.ruleId == null)
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
  async function Y(R) {
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
      }), Ue(q), await L(), (a == null ? void 0 : a.ruleId) === R.id && s(null), (A == null ? void 0 : A.type) === "rule" && A.id === R.id && D(null), (_ == null ? void 0 : _.ruleId) === R.id && T(null), k(`Rule deleted with ${W.deletedSegmentCount} exclusively derived segment${W.deletedSegmentCount === 1 ? "" : "s"}.`);
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
    const ge = `derivation-rule-materialize:${R.id}:${q.fingerprint}`, Ce = await X(`/derivation-rules/${R.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: je(ge),
        fingerprint: q.fingerprint
      })
    });
    return Ue(ge), Ce;
  }
  async function ee(R, W = null) {
    y(!0), k("Finding pending derivations…");
    try {
      const q = await fe(R, W);
      if (T(null), await L(), q.createdCount + q.linkedCount === 0) {
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
  async function Q(R, W) {
    if (W.length === 0) return;
    y(!0), k(`Finding pending derivations from ${R.name}…`);
    let q = 0, ge = 0;
    try {
      for (const Ce of W) {
        const $e = await fe(Ce);
        q += $e.createdCount, ge += $e.linkedCount;
      }
      T(null), await L(), k(q + ge === 0 ? `Every outgoing derivation from ${R.name} is already materialized.` : `${q} derived segment${q === 1 ? "" : "s"} created and ${ge} existing segment${ge === 1 ? "" : "s"} linked from ${R.name}.`);
    } catch (Ce) {
      await L().catch(() => {
      }), k(Ce.message || `Unable to materialize derivations from ${R.name}.`);
    } finally {
      y(!1);
    }
  }
  const ie = $a(a, o), z = qe(
    () => Lc(o, e),
    [o, e]
  ), oe = j.trim().toLocaleLowerCase(), b = z.components.filter((R) => S === "all" || R.segmentGroupKeys.includes(S)).filter((R) => !oe || R.nodes.some((W) => W.name.toLocaleLowerCase().includes(oe))), v = b.flatMap((R) => R.rules), x = new Set(
    b.flatMap((R) => R.nodes.map((W) => W.tagId))
  ), N = qe(
    () => jc(b),
    [b]
  ), M = $ === "list" ? Bc(
    A,
    v,
    oe.length > 0
  ) : null, J = (A == null ? void 0 : A.type) === "node" && z.nodes.find((R) => R.tagId === A.id && x.has(R.tagId)) || null, U = [...v].sort((R, W) => K === "source" ? ut(R.sourceTagName, W.sourceTagName) || ut(R.derivedTagName, W.derivedTagName) : K === "target" ? ut(R.derivedTagName, W.derivedTagName) || ut(R.sourceTagName, W.sourceTagName) : K === "materialized" ? (Number(W.edgeCount) || 0) - (Number(R.edgeCount) || 0) || ut(R.sourceTagName, W.sourceTagName) : ut(
    `${R.sourceTagName} ${R.derivedTagName}`,
    `${W.sourceTagName} ${W.derivedTagName}`
  ));
  return n(Gc, {
    arrowMarkerId: V,
    busy: h,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: P,
    deleteRule: Y,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: ie,
    editRule: te,
    editorRef: ne,
    emptyDraft: r,
    graph: z,
    layout: N,
    listSort: K,
    materializationOffer: _,
    materializeOutgoingRules: Q,
    materializeRule: ee,
    message: w,
    normalizedQuery: oe,
    query: j,
    refreshConfiguredTag: be,
    revealEditor: le,
    rules: o,
    save: xe,
    segmentGroupKey: S,
    selectedNode: J,
    selectedRule: M,
    selection: A,
    setConfiguringTag: H,
    setDraft: s,
    setListSort: ae,
    setMaterializationOffer: T,
    setQuery: E,
    setSegmentGroupKey: C,
    setSelection: D,
    setView: G,
    sortedVisibleRules: U,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: we,
    updateTag: ue,
    view: $,
    visibleComponents: b,
    visibleRules: v
  });
}
function Kc() {
  const [e, t] = B(ai), r = [
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
  const [o, i] = B([]), [a, s] = B(!1), [l, d] = B(!1), [c, g] = B(""), [u, f] = B(""), [m, p] = B("all"), [h, y] = B(() => /* @__PURE__ */ new Set()), [w, k] = B(null);
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
  async function j() {
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
  function G(T) {
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
  ), A = S.flatMap((T) => T.tags), D = A.filter((T) => T.definitions.length > 0).length, K = A.length - D, ae = [
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
        `${A.length} tags · ${D} with slots · ${K} without slots`
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
          ae.map(([T, P]) => n("button", {
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
        onClick: j,
        className: "rounded-md border border-destructive/50 px-3 py-1.5 text-xs font-medium disabled:opacity-50"
      }, "Retry")
    ]) : null,
    a && C.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, C.map((T) => {
      const P = h.has(T.overviewKey), H = T.tags.filter((ne) => ne.definitions.length > 0).length;
      return n("article", {
        key: T.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => G(T.overviewKey),
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
          T.tags.map((ne) => n("li", {
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
            }, ne.definitions.map((re) => n("li", {
              key: re.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, gt(re)),
              ...(re.genderHints || []).map((V) => n("span", {
                key: V,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, vr(V)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (re) => k({
                tagId: ne.tagId,
                tagName: ne.tagName,
                trigger: re.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ne.tagName}`,
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
  const [o, i] = B("general"), [a, s] = B([]), [l, d] = B(!1), [c, g] = B(""), [u, f] = B(""), [m, p] = B(null), [h, y] = B(!0), [w, k] = B(!1), [j, E] = B(""), [$, G] = B(!0), [S, C] = B(Va), A = El(t), D = A.map(([P]) => P);
  ye(() => {
    D.includes(o) || i(D[0] || "general");
  }, [t.effectiveMode]);
  async function K(P) {
    const H = await X("/segment-groups", P ? { signal: P } : void 0);
    s(H || []);
  }
  ye(() => {
    const P = new AbortController();
    return K(P.signal).catch((H) => {
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
    ]).then(([H, ne]) => {
      G(!0), f((H == null ? void 0 : H.baseUrl) || ""), p(ne);
    }).catch((H) => {
      if (H.name !== "AbortError") {
        if (H.status === 403) {
          G(!1), E("You do not have permission to manage the analysis service connection.");
          return;
        }
        E(H.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      P.signal.aborted || y(!1);
    }), () => P.abort();
  }, [t.effectiveMode]);
  async function ae(P) {
    if (P !== t.requestedMode) {
      d(!0), g("");
      try {
        const H = await X(
          `/preferences/transition?mode=${encodeURIComponent(P)}`
        );
        let ne = !1, re = null, V = null, le = null, L = !1;
        if (t.requestedMode === "basic" && P === "full") {
          if (!window.confirm(Ol(
            H.recyclingBinCount,
            H.protectedRecyclingBinCount
          )))
            return;
          L = !0, H.recyclingBinCount > 0 && (ne = !0, le = H.recyclingBinFingerprint, re = `mode-switch-empty-bin:${le}`, V = je(re));
        }
        let te = !1;
        if (t.requestedMode === "full" && P === "basic") {
          if (!window.confirm(Pl(
            H.extensionOwnedSegmentCount
          )))
            return;
          te = !0;
        }
        const ue = await X("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: P,
            confirmHiddenExtensionOwnedSegments: te,
            confirmBasicHistoryCleanup: L,
            emptyRecyclingBin: ne,
            operationId: V,
            expectedRecyclingBinFingerprint: le
          })
        });
        re && Ue(re), r == null || r(ii(ue)), g("Workflow mode saved.");
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
      const ne = await X("/analysis/status");
      p(ne), E(H != null && H.baseUrl ? ne != null && ne.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ne == null ? void 0 : ne.error) || "The service is not ready."}` : "Analysis service disabled.");
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
    n("a", { key: "back", href: "/segment-studio", onClick: (P) => Ci(P, e, T), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
        onModeChange: ae,
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
        j || (h ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    D.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Uc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => K()
      })
    ) : null,
    D.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(zc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => K()
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
  })), c = li(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: bi(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Me(e.startSec)} to ${e.endSec == null ? "end of video" : Me(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Me(e.startSec)} → end` : `${Me(e.startSec)} – ${Me(e.endSec)}`)
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
      n("a", { key: "edit", href: li(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Aa({ onNavigate: e, profile: t }) {
  const r = qe(() => {
    const L = Oa("ext:com.midnightrider.segment-studio:segments");
    return L ? {
      ...Kr,
      defaultFilter: { ...Kr.defaultFilter, ...L.findFilter || {} },
      defaultObjectFilter: L.objectFilter || {}
    } : Kr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = La(r), [l, d] = B(null), [c, g] = B({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = B(null), [m, p] = B(null), [h, y] = B(0), [w, k] = B(""), [j, E] = B(!0), [$, G] = B(""), S = pe(0), C = aa(o, i), A = C.activityTagId, D = In(i.slots), K = qe(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (L) => Object.keys(In(L)).length > 0,
    sanitize: (L) => zr(A, In(L)),
    summarize: (L) => `${Object.keys(In(L)).length} assigned`,
    renderEditor: (L, te) => A ? n(Ta, {
      facets: l,
      values: In(L),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ue, be) => {
        const we = { ...In(L) };
        be ? we[ue] = Number(be) : delete we[ue], te(zr(A, we));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [A, l, c.performerSlotsAvailable]), ae = JSON.stringify(C);
  ye(() => {
    if (d(null), !A) return;
    const L = new AbortController();
    return X(`/browse/activities/${A}/facets`, { signal: L.signal }).then(d).catch((te) => {
      te.status === 403 ? d({ slots: [], restricted: !0 }) : te.name !== "AbortError" && G(te.message);
    }), () => L.abort();
  }, [A]), ye(() => {
    const L = ++S.current, te = new AbortController();
    return E(!0), G(""), X("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(C), signal: te.signal }).then((ue) => {
      L === S.current && g({ ...ue, totalCount: ue.totalCount ?? ue.total ?? 0 });
    }).catch((ue) => {
      if (!(L !== S.current || ue.name === "AbortError")) {
        if (ue.status === 400 && ue.message.includes("unrestricted performer read access")) {
          g((be) => ({ ...be, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), G("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        G(ue.message);
      }
    }).finally(() => {
      L === S.current && E(!1);
    }), () => {
      S.current++, te.abort();
    };
  }, [ae, h]);
  const _ = c.items.findIndex((L) => L.key === u), T = c.items[_] || null;
  function P(L) {
    s(L), a({ ...o, page: 1 });
  }
  function H(L) {
    const te = aa(o, L), ue = L.slots && te.activityTagId != null && te.slotAssignments.length > 0 ? L.slots : void 0;
    P({ ...L, slots: ue });
  }
  function ne(L, te) {
    const ue = { ...D };
    te ? ue[L] = Number(te) : delete ue[L], P({ ...i, slots: zr(A, ue) });
  }
  function re() {
    const L = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => L == null ? void 0 : L.focus());
  }
  async function V(L) {
    var be;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(L.key), k("");
    const te = `browse-restore:${L.itemId}:${L.revision}`, ue = je(te);
    try {
      const we = (xe = !1) => X(`/bin/${L.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ue,
          expectedRevision: L.revision,
          discardMissingImage: xe
        })
      });
      try {
        await we(go(te));
      } catch (xe) {
        if (((be = xe.payload) == null ? void 0 : be.code) !== "missing-image" || !window.confirm(`${xe.message}

Continue and discard the missing image reference?`))
          throw xe;
        po(te), await we(!0);
      }
      Ue(te), u === L.key && f(null), k("Segment restored to Cove."), y((xe) => xe + 1);
    } catch (we) {
      k(we.message || "Unable to restore the segment."), we.status === 409 && y((xe) => xe + 1);
    } finally {
      p(null);
    }
  }
  async function le(L) {
    p(L.key), k("");
    try {
      const te = await X(`/items/${L.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: L.revision })
      });
      if (!gi(te, k) || !Xl(te))
        return;
      const ue = `browse-dependency-delete:${L.itemId}:${te.fingerprint}`;
      await X(`/items/${L.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(ue),
          fingerprint: te.fingerprint
        })
      }), Ue(ue), u === L.key && f(null), k(`${te.deletedSegmentCount} segment${te.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((be) => be + 1);
    } catch (te) {
      k(te.message || "Unable to permanently delete the segment."), te.status === 409 && y((ue) => ue + 1);
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
      isLoading: j,
      error: $ ? new Error($) : null,
      onRetry: () => y((L) => L + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? oa.filter((L) => L.id !== "performers") : oa,
      objectFilter: i,
      onObjectFilterChange: H,
      customFilterSections: K,
      searchPlaceholder: "Search segments..."
    }, [
      A ? n(Ta, { key: "slots", facets: l, values: D, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ne }) : null,
      n(qc, { key: "player", item: T, index: _, count: c.items.length, onPrevious: () => {
        var L;
        return f((L = c.items[_ - 1]) == null ? void 0 : L.key);
      }, onNext: () => {
        var L;
        return f((L = c.items[_ + 1]) == null ? void 0 : L.key);
      }, onClose: re, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !j && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      j ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((L) => n(_c, {
        key: L.key,
        item: L,
        selected: L.key === u,
        busy: m === L.key,
        onSelect: () => f(L.key),
        onRestore: V,
        onPurge: le
      })))
    ])
  ]);
}
function Wc({ onNavigate: e, profile: t }) {
  const [r, o] = B([]), [i, a] = B(""), [s, l] = B(0), [d, c] = B(!0), [g, u] = B(null), [f, m] = B(""), p = pe(null);
  async function h(k) {
    const j = await X("/bin", k ? { signal: k } : void 0);
    return o(j.items || []), a(j.fingerprint || ""), l(Number(j.totalCount) || 0), j;
  }
  ye(() => {
    const k = new AbortController();
    return c(!0), h(k.signal).catch((j) => {
      j.name !== "AbortError" && m(j.message);
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
    const j = `restore:${k.itemId}:${k.revision}`, E = je(j);
    try {
      const G = (S = !1) => X(`/bin/${k.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: E, expectedRevision: k.revision, discardMissingImage: S })
      });
      try {
        await G(go(j));
      } catch (S) {
        if ((($ = S.payload) == null ? void 0 : $.code) !== "missing-image" || !window.confirm(`${S.message}

Continue and discard the missing image reference?`)) throw S;
        po(j), await G(!0);
      }
      Ue(j), await h(), zn(), m("Segment restored with a new native ID.");
    } catch (G) {
      m(G.message || "Unable to restore the segment."), G.status === 409 && await h();
    } finally {
      u(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const k = await fi({
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
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, k.endSec == null ? Me(k.startSec) : `${Me(k.startSec)} – ${Me(k.endSec)}`),
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
    const Y = Oa(Ra), fe = (ee = Y == null ? void 0 : Y.uiOptions) == null ? void 0 : ee.displayMode;
    return Y ? {
      ...Gn,
      defaultFilter: { ...Gn.defaultFilter, ...Y.findFilter || {} },
      defaultObjectFilter: Y.objectFilter || {},
      defaultDisplayMode: Gn.allowedDisplayModes.includes(fe) ? fe : Gn.defaultDisplayMode
    } : Gn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = La(i), [u, f] = B({ items: [], totalCount: 0 }), [m, p] = B(!0), [h, y] = B(""), [w, k] = B(0), [j, E] = B(/* @__PURE__ */ new Set()), [$, G] = B(null), [S, C] = B({ busy: !1, error: "", announcement: "" }), A = pe(0), D = pe(null), K = pe(null);
  K.current || (K.current = Ec());
  const ae = JSON.stringify(a), _ = JSON.stringify(s), T = t || r === "review";
  ye(() => {
    K.current.selectionChanged(), D.current = null, E(/* @__PURE__ */ new Set()), C((Y) => ({ busy: Y.busy, error: "", announcement: "" }));
  }, [ae, _]), ye(() => {
    if (!T) return;
    const Y = new AbortController();
    return X("/analysis/status", { signal: Y.signal }).then(G).catch((fe) => {
      fe.name !== "AbortError" && G({ configured: !0, ready: !1, error: fe.message || "Unable to check Full Scan readiness." });
    }), () => Y.abort();
  }, [T]), ye(() => {
    const Y = ++A.current, fe = new AbortController();
    return p(!0), y(""), X(`/videos?${ec(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: fe.signal }).then((ee) => {
      Y === A.current && f(ee);
    }).catch((ee) => {
      Y === A.current && ee.name !== "AbortError" && y(ee.message || "Unable to discover videos.");
    }).finally(() => {
      Y === A.current && p(!1);
    }), () => {
      A.current++, fe.abort();
    };
  }, [ae, _, t, r, w]);
  function P(Y) {
    d({ ...Y, page: Y.page || 1 });
  }
  function H(Y) {
    c(Y), d({ ...a, page: 1 });
  }
  function ne(Y, fe = !1) {
    E((ee) => tc(
      ee,
      u.items.map((Q) => Q.videoId),
      Y,
      D.current,
      fe
    )), D.current = Y;
  }
  function re() {
    D.current = null, E(new Set(u.items.map((Y) => Y.videoId)));
  }
  function V() {
    D.current = null, E(/* @__PURE__ */ new Set());
  }
  function le() {
    D.current = null, E((Y) => new Set(u.items.map((fe) => fe.videoId).filter((fe) => !Y.has(fe))));
  }
  async function L(Y = ["aiTagging", "omnishotcut"]) {
    const fe = K.current.begin();
    if (fe) {
      C({ busy: !0, error: "", announcement: "" });
      try {
        const ee = await Dc(
          [...j],
          Y,
          X,
          (Q) => window.confirm(Q)
        );
        if (ee.cancelled) {
          C({ busy: !1, error: "", announcement: "" });
          return;
        }
        ee.queuedIds.length > 0 && K.current.ownsCurrentSelection(fe) && (ee.queuedIds.includes(D.current) && (D.current = null), E((Q) => {
          const ie = new Set(Q);
          return ee.queuedIds.forEach((z) => ie.delete(z)), ie;
        })), C({
          busy: !1,
          announcement: ee.queuedIds.length > 0 ? `${ee.queuedIds.length} ${ee.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ee.failed.length > 0 ? `${ee.failed.length} selected ${ee.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ee.failed[0].error}` : ""
        });
      } catch (ee) {
        C({ busy: !1, error: ee.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        K.current.finish(fe);
      }
    }
  }
  const te = t || r === "review" ? xa : xa.filter((Y) => !["reviewState", "shotBoundaries"].includes(Y.id)), ue = $ === null || $.configured === !1 || $.ready === !1, be = S.busy || ue, we = ($ == null ? void 0 : $.error) || ($ === null ? "Checking Full Scan availability" : $.configured === !1 ? "Configure the analysis service before running Full Scan" : $.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), xe = S.busy ? "Queueing scans…" : $ === null ? "Checking Full Scan…" : $.configured === !1 ? "Full Scan not configured" : $.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
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
      onRetry: () => k((Y) => Y + 1),
      sortOptions: t || r === "review" ? [...va, { value: "unreviewed_count", label: "Unreviewed count" }] : va,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: te,
      objectFilter: s,
      onObjectFilterChange: H,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: T ? j : void 0,
      onSelectAll: T ? re : void 0,
      onSelectNone: T ? V : void 0,
      onInvertSelection: T ? le : void 0,
      selectionActions: T ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: be,
          onClick: () => L(),
          title: we,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, xe),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": be,
            title: we,
            onClick: (Y) => {
              be && Y.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${be ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(ja, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([Y, fe]) => n("button", {
            key: Y,
            type: "button",
            disabled: S.busy,
            onClick: (ee) => {
              var Q;
              (Q = ee.currentTarget.closest("details")) == null || Q.removeAttribute("open"), L(fe);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, Y)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, S.announcement),
      S.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, S.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((Y) => n(nc, { key: Y.videoId, item: Y, onNavigate: e, showReviewStates: T, selected: j.has(Y.videoId), selectionActive: j.size > 0, onSelect: T ? ne : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((Y) => n(rc, { key: Y.videoId, item: Y, onNavigate: e, showReviewStates: T, selected: j.has(Y.videoId), selectionActive: j.size > 0, onSelect: T ? ne : null }))) : null
    ])
  ]);
}
function Ma({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = B(null), [s, l] = B(!0), [d, c] = B(""), g = pe(0), u = pe(0), f = pe(e), m = Gd();
  f.current = e;
  const p = (j) => `/videos/${j}/editor`;
  async function h(j, E, $) {
    const G = await X(p(E), $ ? { signal: $.signal } : void 0);
    return Qt(j, $ ? g.current : u.current, E, f.current) ? (a(G), !0) : !1;
  }
  ye(() => {
    const j = ++g.current, E = e, $ = new AbortController();
    return a(null), l(!0), c(""), h(j, E, $).catch((G) => {
      Qt(j, g.current, E, f.current) && G.name !== "AbortError" && c(G.message || "Unable to load the editor.");
    }).finally(() => {
      Qt(j, g.current, E, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, $.abort();
    };
  }, [e]);
  function y(j, E) {
    a(($) => ($ == null ? void 0 : $.video.id) !== E ? $ : typeof j == "function" ? j($) : j);
  }
  async function w() {
    const j = e, E = ++u.current;
    try {
      const $ = await X(p(j));
      return Qt(E, u.current, j, f.current) ? (a($), c("A newer canonical segment was loaded. Your stale change was not applied."), $) : null;
    } catch ($) {
      return Qt(E, u.current, j, f.current) && c($.message || "Unable to reload the latest segment."), null;
    }
  }
  async function k() {
    const j = e, E = ++u.current;
    try {
      const $ = await X(p(j));
      return Qt(E, u.current, j, f.current) ? (a($), c(""), $) : null;
    } catch ($) {
      return Qt(E, u.current, j, f.current) && c($.message || "Unable to reload performer slots."), null;
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
      n(ws, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
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
  const [o, i] = B(null), [a, s] = B("");
  return ye(() => {
    const l = new AbortController();
    return X("/preferences", { signal: l.signal }).then((d) => i(ii(d))).catch((d) => {
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
  Ks as activeEditorFilterCount,
  Xa as addPendingChange,
  yd as applyDerivationRuleSlotSuggestions,
  mr as applyFeedbackEditorDelta,
  ti as applyPendingChanges,
  ma as applySegmentMergeDelta,
  nd as basicSegmentTimelineStyle,
  jl as browseClipEnd,
  li as browseEditorHref,
  aa as buildBrowseRequest,
  Lc as buildDerivationRuleGraph,
  ec as buildDiscoverySearchParams,
  Ts as buildMinuteTimelineTicks,
  Pc as buildPerformerSlotOverview,
  Hl as buildSegmentQuickSearchEntries,
  Sd as buildSegmentRailRows,
  kd as buildTimelineRows,
  iu as buildTimelineTicks,
  Es as calculateCenteredTimelineScroll,
  Vr as calculateEditorPanelMaximum,
  As as calculateMinuteLabelStride,
  su as calculateMinuteTimelineWidth,
  Os as calculateSwimlaneTitleMaximum,
  Ds as calculateTimelinePlayheadPosition,
  so as calculateTimelineRatioBounds,
  Fs as calculateTimelineRatioFromPointer,
  lu as calculateVerticalRevealOffset,
  Zt as clampEditorPanelWidth,
  ur as clampSwimlaneTitleWidth,
  Wa as clampTimelineRatio,
  lo as clampTimelineRatioForHeight,
  pr as clampTimelineZoom,
  Yd as compactProvenanceSummary,
  Ec as createBulkAnalysisCoordinator,
  hl as createQueuedReviewRequest,
  rl as createSaveQueue,
  Na as createSegmentAnalysisRequestScope,
  ku as default,
  il as discardPendingChange,
  Il as displayHeldSegmentTag,
  Zl as downloadFileNameFromContentDisposition,
  zs as dualRangeValueFromPointer,
  ta as duplicateIdentityFromResponse,
  Sl as duplicateOperationKey,
  Ya as editorVisibilityIncludingSegment,
  Id as expandedSwimlanes,
  Pl as extensionOwnedSegmentsModeSwitchPrompt,
  Rd as feedbackFrameTimestamps,
  Ed as feedbackResultMatchesAction,
  Md as feedbackSelectionPlan,
  Us as filterDerivedSegments,
  Br as filterEditorSegments,
  Oc as filterPerformerSlotOverview,
  zl as filterSegmentQuickSearch,
  pu as filterSegmentStudioShortcuts,
  Td as findAdjacentSegmentGroupKey,
  Tl as findAdjacentShot,
  fl as findEditorShortcut,
  qa as findInitialSegmentSelection,
  $s as findNearestSegmentInCurrentSwimlane,
  $l as findPublishedSelectionIdentity,
  Qe as findSegmentByStableIdentity,
  js as findSegmentFromPlayhead,
  Cs as findSegmentNearPlayhead,
  $d as findSwimlaneRangeSelection,
  eo as findSwimlaneSelection,
  Ul as findUniquePerformerSlotAssignment,
  gr as findUnreviewedSelection,
  cd as focusDialogDefaultButton,
  vr as formatGenderHint,
  Al as frameStepSeconds,
  di as generatePerformerSlotAssignmentRecommendations,
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
  xi as indexPerformerSlotsBySegment,
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
  Qs as nextSegmentAfterRemoval,
  Zs as nextUnreviewedAfterRemoval,
  _t as normalizeCollapsedSegmentGroups,
  ka as normalizeDiscoveryIds,
  xt as normalizeEditorSegmentFilters,
  zt as normalizeGender,
  na as normalizeReviewFilter,
  ii as normalizeSegmentStudioFeatureProfile,
  fu as normalizeSegmentStudioMode,
  Zr as normalizeSegmentStudioPublicMode,
  In as parseBrowseSlotFilters,
  Ls as parseEditorLayout,
  Bs as parseHideDerivedSegmentsPreference,
  Gs as parseMergeConfirmationPreference,
  oi as parsePlaybackShortcutConfig,
  gl as parseShortcutBindingOverrides,
  _r as patchPerformerSlotProjection,
  ba as patchSegmentProjection,
  cl as pendingChangesReducer,
  Xs as percentageSeekTime,
  Gl as performInitialSegmentSeek,
  ot as performerOptionId,
  yr as performerSlotHistoryState,
  gt as performerSlotLabel,
  bd as performerSlotPresentation,
  Su as performerSlotStatus,
  bo as performerSlotStatusFromSegmentSlots,
  vi as performerSlotsForSegment,
  $t as provenanceSourceLabel,
  dl as prunePendingChanges,
  Nl as queueCreatedSegmentTagChoice,
  ci as rankPerformerOptions,
  Ad as reconcileSegmentGroupKey,
  Js as reconcileSelectedSegmentIds,
  oc as recyclingBinActionText,
  ed as recyclingBinDeletionPrompt,
  pi as recyclingBinDeletionSummary,
  Ol as recyclingBinModeSwitchPrompt,
  yu as removeQueuedReviewsForSegments,
  to as removeSegmentsProjection,
  sa as requestedOwnedItemId,
  Bl as requestedSegmentId,
  _s as resolveEditorSegmentSelection,
  Cl as resolveQueuedCreatedSegmentTag,
  vl as resolveQueuedReviewRequest,
  kl as resolveSegmentCreationAction,
  Dl as resolveSegmentStudioRoute,
  pl as resolveSegmentStudioShortcuts,
  nl as resolveSegmentTarget,
  Bc as resolveSelectedDerivationRule,
  Yo as resolveSelectedSegments,
  Sc as restoreDisabledToolbarActionFocus,
  Ac as restorePublishApprovedFocus,
  no as restoreSegmentFieldsProjection,
  Ii as restoreSegmentsProjection,
  ll as retargetPendingChanges,
  Ni as revealCollapsedSegmentGroup,
  Dc as runSelectedDiscoveryAnalysis,
  Cn as sameSegmentIdentity,
  Jr as savingSegmentIdFrom,
  yi as segmentBadgeStyle,
  hr as segmentGroupHeaderBackground,
  It as segmentGroupKeyForSegment,
  yo as segmentHistoryIdentity,
  sr as segmentHistoryState,
  co as segmentIdentity,
  bi as segmentRailItemStyle,
  hu as segmentStateStyle,
  Xc as segmentStudioActionTarget,
  Rl as segmentStudioLegacyMode,
  td as segmentTimelineStyle,
  vt as segmentsHistoryState,
  Ys as selectAllVideoSegmentIds,
  Ll as selectedBrowseStates,
  ki as selectedSwimlaneMerge,
  Ci as setBackLinkNavigation,
  sl as settlePendingChange,
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
  Ps as timelineContentStyle,
  Wo as timelinePlayheadHorizontalStyle,
  rd as timelineSegmentWidth,
  Rs as timelineTickAlignment,
  Ms as timelineTickPosition,
  Wr as timelineTimePercent,
  Cd as toggleAllCollapsedSegmentGroups,
  bl as toggledSelectionReviewState,
  Dt as trapModalFocus,
  Jl as tryParseJsonResponseText,
  Vs as updateAnchoredSegmentSelection,
  tc as updateDiscoverySelection,
  Hs as updateDualRangeValues,
  qs as updateSegmentCollectionSelection,
  Ws as updateSegmentRangeSelection,
  Qa as updateSegmentSelection,
  $a as validateDerivationRuleDraft,
  qo as validateSegmentTiming,
  mo as videoPerformerOptions,
  Hr as videoPerformerSlotAssignments,
  El as visibleSegmentStudioSettingsTabs,
  Ml as visibleSegmentStudioTabs,
  Si as visibleVirtualRows
};
