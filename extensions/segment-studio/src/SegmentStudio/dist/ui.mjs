import io from "@cove/runtime/react";
import { createPortal as us } from "@cove/runtime/react-dom";
import { extensionFetch as Aa } from "@cove/runtime/api";
import { formatDuration as ms, EntityReferenceSelector as Hn, useExtensionKeyboardBindings as gs, VideoPlayer as Ra, useRegisterExtensionKeyboardActions as Ma, getDefaultFilter as Ea, useListUrlState as Da, ListPage as Oa } from "@cove/runtime/components";
import { ChevronDown as Pa, StepBack as ps, StepForward as fs, Loader2 as ys } from "@cove/runtime/lucide-react";
const so = "com.midnightrider.segment-studio", La = "segment-studio.layout.v1", nn = "segment-studio.operations.v1", Fa = "segment-studio.collapsed-segment-groups.v1", ja = "segment-studio.playback-shortcuts.v1", Ba = "segment-studio.timing-clipboard.v1", Ga = "segment-studio.hide-derived-segments.v1", Ua = "segment-studio.merge-confirmation.v1", yt = ["unreviewed", "approved", "rejected"], bs = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], Ko = "(min-width: 1024px) and (min-height: 640px)", zo = "(min-width: 1024px) and (min-height: 900px)", _n = 1e-3, Ho = 15, hs = 30, Ka = 12, ht = {
  timelineRatio: 0.45,
  markerRailOpen: !0,
  detailWidth: 352,
  markerRailWidth: 352,
  swimlaneTitleWidth: 256
}, lo = {
  smallSeekTime: 5,
  mediumSeekTime: 10,
  longSeekTime: 30,
  smallFrameStep: 1,
  mediumFrameStep: 10,
  longFrameStep: 30
}, jt = {
  revision: 0,
  cursorSequence: 0,
  baselineSequence: 0,
  actions: []
};
function _o(e, t, r) {
  if (!Number.isFinite(e) || t != null && !Number.isFinite(t))
    return { error: "Enter finite start and end times." };
  const o = Number.isFinite(r) && r > 0;
  return e < 0 || o && e > r || t != null && (t < 0 || o && t > r) ? { error: "Timing must stay within the video." } : t != null && t < e ? { error: "End time cannot be before start time." } : { startSec: e, endSec: t };
}
function za(e, t = null) {
  const r = e.flatMap((o) => o.markers.map((i) => i.segment));
  return r.find((o) => o.id === t) ?? hr(e, null, 1, !0) ?? r[0] ?? null;
}
function hr(e, t, r, o = !1) {
  var m;
  const i = e.findIndex((u) => u.markers.some((f) => f.segment.id === t));
  if (i < 0) {
    if (!o) return null;
    const u = e.flatMap((f) => f.markers.map((g) => g.segment)).filter((f) => f.reviewState === "unreviewed");
    return r < 0 ? u.at(-1) ?? null : u[0] ?? null;
  }
  const a = e[i], s = a.markers.findIndex((u) => u.segment.id === t);
  if (!o)
    return ((m = (r < 0 ? a.markers.slice(0, s).reverse() : a.markers.slice(s + 1)).find((f) => f.segment.reviewState === "unreviewed")) == null ? void 0 : m.segment) ?? null;
  const l = e.flatMap((u) => u.markers.map((f) => f.segment)), d = l.findIndex((u) => u.id === t);
  return (r < 0 ? l.slice(0, d).reverse() : l.slice(d + 1)).find((u) => u.reviewState === "unreviewed") ?? null;
}
function vs(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((m, u) => m.markers.filter(({ segment: f }) => {
    const g = Number(f.startSec), p = f.endSec == null ? g + hs : Number(f.endSec);
    return Number.isFinite(g) && Number.isFinite(p) && p >= g && g <= i + Ho + _n && p >= i - Ho - _n;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((m, u) => m.laneIndex - u.laneIndex || Math.abs(m.segment.startSec - i) - Math.abs(u.segment.startSec - i) || m.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((m) => m.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((m) => m.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((m) => m.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((m) => m.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function xs(e, t, r) {
  var a;
  const o = Number(r);
  if (!Number.isFinite(o) || t == null) return null;
  const i = (Array.isArray(e) ? e : []).find((s) => {
    var l;
    return (l = s.markers) == null ? void 0 : l.some(({ segment: d }) => d.id === t);
  });
  return i ? ((a = i.markers.map(({ segment: s }) => {
    const l = Number(s.startSec), d = s.endSec == null ? l : Number(s.endSec), c = Number.isFinite(d) && d >= l ? d : l, m = o < l ? l - o : o > c ? o - c : 0;
    return { segment: s, distance: m, startDistance: Math.abs(l - o) };
  }).filter((s) => Number.isFinite(s.distance)).sort((s, l) => s.distance - l.distance || s.startDistance - l.startDistance || String(s.segment.id).localeCompare(String(l.segment.id)))[0]) == null ? void 0 : a.segment) ?? null : null;
}
function vr(e) {
  return Math.min(8, Math.max(1, Math.round(Number(e) * 4) / 4));
}
function Xc(e, t = 6) {
  if (!Number.isFinite(e) || e <= 0) return [0];
  const r = Math.max(2, Math.floor(t));
  return Array.from({ length: r }, (o, i) => e * i / (r - 1));
}
function Ss(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function eu(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function ks(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function ws(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ns(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function Is(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Yr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Cs(e, t, r = 10) {
  const o = Yr(e, t), i = o / 100;
  return {
    percent: o,
    labelOffsetRem: Math.max(0, Number(r) || 0) * (1 - i)
  };
}
function qo(e, t = !1) {
  return {
    left: t ? `calc(${e.labelOffsetRem}rem + ${e.percent}%)` : `${e.percent}%`,
    transform: "translateX(-50%)"
  };
}
function $s(e, t = Ka) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function Ha(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : ht.timelineRatio;
}
function Qr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function en(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? ht.detailWidth : Math.min(Qr(t, 0), Math.max(240, e));
}
function fr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? ht.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Ts(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function co(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: ht.timelineRatio, maximum: ht.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function uo(e, t) {
  const r = Ha(e);
  if (!(t > 0)) return r;
  const o = co(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function As(e) {
  if (!e) return { ...ht };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? Ha(r) : ht.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: en(t == null ? void 0 : t.detailWidth),
      markerRailWidth: en(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: fr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...ht };
  }
}
function Rs(e, t, r) {
  return r > 0 ? uo((t + r - e) / r, r) : ht.timelineRatio;
}
function tu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Ms(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, m) => c.startSec - m.startSec || c.id - m.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= _n ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Xt(e, t, r, o) {
  return e === t && r === o;
}
const xr = "__segment-studio-cleared-selection__";
function Es(e) {
  return e === "true";
}
function Ds(e) {
  return e !== "false";
}
function _a() {
  try {
    return Ds(window.localStorage.getItem(Ua));
  } catch {
    return !0;
  }
}
function qa(e) {
  try {
    window.localStorage.setItem(Ua, String(!!e));
  } catch {
  }
}
function Os(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function kt(e = {}) {
  const t = yt.filter((m) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(m) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (m, u) => {
    const f = Number(m);
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
function Kr(e, t, r, o = !1, i = []) {
  var c, m;
  const a = kt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((m = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : m.map((u) => Number(u.tagId))) || []);
  return Os(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Wa(e, t, r, o = !1, i = []) {
  var l;
  const a = kt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = kt({
    ...a,
    reviewStates: [...a.reviewStates, e.reviewState]
  }).reviewStates), a.performerId != null && !(t || []).some((d) => d.segmentId === e.id && Number(d.performerId) === a.performerId) && (a.performerId = null), a.tagId != null && Number(e.tagId) !== a.tagId && (a.tagId = null), a.segmentGroupId != null) {
    const d = new Set((i || []).flatMap((c) => c.tags || []).map((c) => Number(c.tagId)));
    if (a.segmentGroupId === "ungrouped")
      d.has(Number(e.tagId)) && (a.segmentGroupId = null);
    else {
      const c = (i || []).find((m) => Number(m.id) === a.segmentGroupId);
      (l = c == null ? void 0 : c.tags) != null && l.some((m) => Number(m.tagId) === Number(e.tagId)) || (a.segmentGroupId = null);
    }
  }
  a.sourceKey != null && e.sourceKey !== a.sourceKey && (a.sourceKey = null);
  const s = Number(e.confidence);
  return e.confidence != null && Number.isFinite(s) && (a.confidenceMin = Math.min(a.confidenceMin, Math.floor(s * 100) / 100), a.confidenceMax = Math.max(a.confidenceMax, Math.ceil(s * 100) / 100)), (e.confidence == null || !Number.isFinite(s)) && (a.includeUnscored = !0), {
    filters: kt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Ps(e, t = !1) {
  const r = kt(e);
  return +(r.reviewStates.length !== yt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Ls(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Fs(e, t, r, o) {
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
function js(e, t, r = null) {
  return t === xr ? null : za(
    e,
    t ?? r
  );
}
function Va(e, t, r, o = !1) {
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
function Bs(e, t, r) {
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
function Gs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Va(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function Us(e, t, r = null, o = !1) {
  const i = (e == null ? void 0 : e.selectedSegmentIds) || [], a = (e == null ? void 0 : e.activeSegmentId) ?? null, s = (e == null ? void 0 : e.anchorSegmentId) ?? a, l = (e == null ? void 0 : e.rangeBaseSegmentIds) || [];
  if (r) {
    const m = [...new Set(r)];
    if (!m.includes(s) || !m.includes(t))
      return {
        selectedSegmentIds: [t],
        activeSegmentId: t,
        anchorSegmentId: t,
        rangeBaseSegmentIds: []
      };
    const u = o ? [.../* @__PURE__ */ new Set([...l, ...i])] : l;
    return {
      ...Gs(u, s, t, m, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Va(i, a, t, o);
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
    rangeBaseSegmentIds: d.selectedSegmentIds.filter((m) => m !== c)
  };
}
function Ks(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function zs(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Wo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Vo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Wo(t, o) - Wo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Hs(e, t, r) {
  var c, m;
  const o = e || [], i = new Set(t || []), a = o.findIndex((u) => (u.markers || []).some(({ segment: f }) => f.id === r)), s = a < 0 ? null : (c = o[a].markers.find(({ segment: u }) => u.id === r)) == null ? void 0 : c.segment;
  if (!s) {
    for (const u of o) {
      const f = (u.markers || []).find(({ segment: g }) => !i.has(g.id));
      if (f) return f.segment;
    }
    return null;
  }
  const l = Vo(
    o[a].markers,
    s,
    i
  );
  if (l) return l;
  const d = (m = o.map((u, f) => ({ lane: u, index: f })).filter(({ lane: u }) => (u.markers || []).some(({ segment: f }) => !i.has(f.id))).sort((u, f) => Math.abs(u.index - a) - Math.abs(f.index - a) || +(u.index < a) - +(f.index < a) || u.index - f.index)[0]) == null ? void 0 : m.lane;
  return Vo(d == null ? void 0 : d.markers, s, i);
}
function _s(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function qs(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Jo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Ws() {
  try {
    return Es(window.localStorage.getItem(Ga));
  } catch {
    return !1;
  }
}
function Vs(e) {
  try {
    window.localStorage.setItem(Ga, String(!!e));
  } catch {
  }
}
function fn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function Js(e, t) {
  return (e || []).some((r) => (t || []).some((o) => fn(r, o)));
}
function nu(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function Ys(e, t) {
  return (e || []).find((r) => fn(t, r)) || null;
}
function yr(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Zr(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function ru(e) {
  return e.running != null || e.queued.length > 0;
}
const Yo = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function zr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive
  });
}
function Qs({ getContext: e = () => ({}) } = {}) {
  let t = 1, r = null, o = [], i = null, a = !1, s = Yo;
  const l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let c = [];
  function m() {
    s = r == null && o.length === 0 && i == null ? Yo : Object.freeze({
      running: r ? zr(r) : null,
      queued: Object.freeze(o.map(zr)),
      lastFailure: i
    });
    for (const w of [...d]) w();
    if (r == null && o.length === 0) {
      const w = c;
      c = [];
      for (const P of w) P();
    }
  }
  function u(w, P) {
    l.set(w.id, P.status), w.resolve(P);
  }
  function f(w) {
    if (w.dependsOn == null) return "met";
    const P = l.get(w.dependsOn);
    return P === "fulfilled" ? "met" : P != null ? "failed" : "pending";
  }
  function g(w) {
    r = w;
    const P = { ...e(), taskId: w.id };
    P.resolveTargets = () => w.targets.map((C) => Ys(P.segments, C)).filter(Boolean), m();
    let M;
    try {
      M = w.run(P);
    } catch (C) {
      M = Promise.reject(C);
    }
    Promise.resolve(M).then(
      (C) => p(w, { status: "fulfilled", value: C }),
      (C) => p(w, { status: "rejected", error: C })
    );
  }
  function p(w, P) {
    u(w, P), !a && (r = null, P.status === "rejected" && (i = Object.freeze({ id: w.id, kind: w.kind, error: P.error })), m(), h());
  }
  function h() {
    if (a || r != null) return;
    let w = !1;
    for (let P = 0; P < o.length; P += 1) {
      const M = o[P], C = f(M);
      if (C === "failed") {
        o = o.filter(($) => $ !== M), u(M, { status: "dropped", reason: "dependency-failed" }), w = !0, P -= 1;
        continue;
      }
      if (C !== "pending" && !(M.exclusive && P > 0) && !o.slice(0, P).some(($) => Js($.targets, M.targets)) && !(M.ready && !M.ready(e()))) {
        o = o.filter(($) => $ !== M), g(M);
        return;
      }
    }
    w && m();
  }
  function b(w) {
    if (a || (r == null ? void 0 : r.exclusive) || o.some((R) => R.exclusive) || r != null && w.whenBusy !== "enqueue") return null;
    let M;
    const C = new Promise((R) => {
      M = R;
    }), $ = {
      id: t++,
      kind: w.kind,
      lockId: w.lockId ?? null,
      targets: Object.freeze([...w.targets || []]),
      exclusive: w.exclusive === !0,
      dependsOn: w.dependsOn ?? null,
      ready: w.ready || null,
      run: w.run,
      resolve: M
    };
    return o = [...o, $], m(), h(), { id: $.id, done: C };
  }
  function k(w = {}) {
    let P = null;
    const M = b({
      ...w,
      whenBusy: "reject",
      run: () => new Promise(($) => {
        P = $;
      })
    });
    if (!M) return null;
    if (P == null)
      return S(($) => $.id === M.id), null;
    let C = !1;
    return () => {
      C || (C = !0, P());
    };
  }
  function S(w) {
    const P = o.filter((M) => w(zr(M)));
    if (P.length === 0) return 0;
    o = o.filter((M) => !P.includes(M));
    for (const M of P) u(M, { status: "cancelled" });
    return m(), h(), P.length;
  }
  return {
    enqueue: b,
    acquire: k,
    cancel: S,
    poke: h,
    subscribe(w) {
      return d.add(w), () => d.delete(w);
    },
    getSnapshot: () => s,
    whenIdle() {
      return r == null && o.length === 0 ? Promise.resolve() : new Promise((w) => c.push(w));
    },
    dispose() {
      if (a) return;
      const w = o;
      o = [], a = !0;
      for (const P of w) u(P, { status: "cancelled" });
      d.clear();
    }
  };
}
let Zs = 1;
function Xs(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function Hr(e, t) {
  return (t || []).some((r) => fn(r, e));
}
function Ja(e, t) {
  return [...e || [], {
    id: t.id ?? `pending-${Zs++}`,
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    settled: !1
  }];
}
function Ya(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function el(e, t) {
  const r = (e || []).filter((o) => !Ya(o, t));
  return r.length === (e || []).length ? e : r;
}
function tl(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !Ya(i, t) ? i : (r = !0, { ...i, settled: !0 }));
  return r ? o : e;
}
function nl(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function rl(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => fn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => Hr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !Hr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !Hr(s, a)).map((s) => fn(i, s) ? { ...s, ...o.values } : s);
    }
  return Xs(r);
}
function ol(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((i) => i.op === "insert" && !i.settled).map((i) => i.segment)
  ], o = e.filter((i) => i.settled ? !1 : i.op === "insert" ? !0 : i.targets.some((a) => r.some((s) => fn(a, s))));
  return o.length === e.length ? e : o;
}
function ou(e, t) {
  switch (t.type) {
    case "add":
      return Ja(e, t.entry);
    case "discard":
      return el(e, t.key);
    case "settle":
      return tl(e, t.key);
    case "retarget":
      return nl(e, t.temporaryId, t.identity);
    case "prune":
      return ol(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
const Jn = [
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
], al = /* @__PURE__ */ new Set([
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
function il(e) {
  return al.has(e);
}
function Qa(e) {
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
function sl(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(Jn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(Qa).filter(Boolean)]));
  } catch {
    return {};
  }
}
function ll(e = {}) {
  const t = sl(e);
  return Jn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Qo(e, t = 2) {
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
function au(e) {
  const t = String(e.key || "");
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : Qa({
    key: t,
    code: e.code,
    ctrl: e.ctrlKey,
    alt: e.altKey,
    shift: e.shiftKey,
    meta: e.metaKey
  });
}
function iu(e) {
  return e.key === "Tab" && !e.ctrlKey && !e.altKey && !e.metaKey;
}
function Xr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Zo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function su(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Zo(e.code, t.key), a = Zo(t.code, e.key);
  if (!r && !o && !i && !a) return !1;
  const s = i ? t.key : e.key, l = i ? e.code : a ? t.code : o ? e.code : e.code || t.code;
  for (const d of [!1, !0])
    for (const c of [!1, !0])
      for (const m of [!1, !0])
        for (const u of [!1, !0]) {
          const f = {
            key: s,
            code: l,
            ctrlKey: d,
            metaKey: c,
            altKey: m,
            shiftKey: u
          };
          if (Xr(f, e) && Xr(f, t)) return !0;
        }
  return !1;
}
function yn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function lu(e, t) {
  return [!1, !0].some((r) => yn(e, r) && yn(t, r));
}
function dl(e, t = !1, r = {}) {
  return ll(r).find((o) => yn(o, t) && o.bindings.some((i) => Xr(e, i))) || null;
}
function Za(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function cl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(Za).join(" / ") : "Unassigned";
}
function du(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, cl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function cu(e) {
  return e === "review" ? "review" : "editor";
}
function Ze(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function ul(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function ml(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function gl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Ze(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Ze(t, e.activeIdentity) || r[0]
  };
}
function pl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function fl(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => pl(o, i))));
}
function Xo(e, t) {
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
function yl(e, t, r, o) {
  const i = r ? o : "in-place";
  return t != null && t.published ? `duplicate-native:${e}:${t.nativeSegmentId ?? t.id}:${t.updatedAt}:${i}` : `duplicate-draft:${e}:${t == null ? void 0 : t.itemId}:${t == null ? void 0 : t.revision}:${i}`;
}
function bl(e, t, r = null) {
  const o = Number(r);
  if (r != null && Number.isInteger(o) && o > 0)
    return { kind: "create", tagId: o, openTagEditor: !1 };
  const i = Number(t == null ? void 0 : t.tagId);
  return Number.isInteger(i) && i > 0 ? { kind: "create", tagId: i, openTagEditor: !0 } : (e || []).length === 0 ? { kind: "choose-tag" } : { kind: "invalid-selection" };
}
function hl(e, t, r) {
  return e != null && (r == null || t !== r);
}
function vl(e, t, r, o = null) {
  if (r === t.tagId) return null;
  const i = (e == null ? void 0 : e.segmentId) === t.id ? e : null;
  return {
    segmentId: t.id,
    tagId: r,
    tagName: o || ((i == null ? void 0 : i.tagId) === r ? i.tagName : null)
  };
}
function xl(e, t) {
  return t ? rl(e, Ja([], {
    op: "patch",
    targets: [{ id: t.segmentId }],
    values: { tagId: t.tagId, tagName: t.tagName || "Tag segment", tagSortName: null }
  })) : e;
}
function Sl(e, { segments: t, savingSegmentId: r, reviewSaving: o, tagEditing: i, selectedSegmentIds: a, activeSegmentId: s }) {
  if (!e) return "none";
  if (r != null || o) return "wait";
  const l = (t || []).find((c) => c.id === e.segmentId);
  return !l || l.tagId === e.tagId ? "drop" : i && s === e.segmentId && (a == null ? void 0 : a.length) === 1 && a[0] === e.segmentId ? "wait" : "apply";
}
function eo(e, t) {
  return e === t;
}
function kl(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function wl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - _n).at(-1) || null : o.find((i) => i.startSec > t + _n) || null;
}
function Kn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ea(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: yt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function uu(e, t = null, r = !1) {
  const o = ea(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function gn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function Xa(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: gn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: gn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: gn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(gn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(gn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(gn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...lo };
  }
}
function Nl(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ei() {
  try {
    return Xa(window.localStorage.getItem(ja));
  } catch {
    return { ...lo };
  }
}
function ta(e) {
  const t = Xa(JSON.stringify(e));
  try {
    window.localStorage.setItem(ja, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Bt = Object.freeze({
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
function to(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function ti(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? to(e.requestedMode) : "basic",
    effectiveMode: i ? to(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function bn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Il(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Cl(e) {
  const t = [];
  return bn(e, Bt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), bn(e, Bt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function $l(e) {
  return [
    ["general", "General", Bt.settingsGeneral],
    ["shortcuts", "Shortcuts", Bt.settingsShortcuts],
    ["performer-slots", "Performer slots", Bt.settingsPerformerSlots],
    ["derivation", "Derivation", Bt.settingsDerivation]
  ].filter(([, , r]) => bn(e, r)).map(([r, o]) => [r, o]);
}
function Tl(e, t) {
  return e === "segments" && !bn(
    t,
    Bt.navigationSegmentInventory
  ) || e === "bin" && !bn(
    t,
    Bt.recyclingBinView
  ) ? "videos" : e;
}
function Al(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Rl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const _r = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, na = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: yt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ml(e) {
  const t = String(e || "").split(",").filter((r) => yt.includes(r));
  return t.length === 0 ? [...yt] : [...new Set(t)];
}
function pn(e) {
  return ni(e).values;
}
function ni(e) {
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
function qr(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function ra(e, t) {
  var l;
  const r = oa(t.activitiesCriterion, t.activityId), o = oa(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ni(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
    slotDefinitionId: d,
    performerId: Number(c)
  })) : [];
  return {
    query: String(e.q || "").trim() || null,
    activityTagId: i,
    activityTagIds: r,
    includeActivitySubtags: ((l = t.activitiesCriterion) == null ? void 0 : l.depth) === -1,
    reviewStates: El(t.reviewStateCriterion, t.states),
    slotAssignments: s,
    page: Math.max(1, Number(e.page) || 1),
    perPage: Math.max(1, Number(e.perPage) || 24),
    sort: e.sort || "default",
    direction: e.direction || "desc",
    performerIds: o
  };
}
function oa(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function El(e, t) {
  return yt.includes(e == null ? void 0 : e.value) ? [e.value] : Ml(t);
}
function ri(e) {
  return e.published === !1 && e.itemId != null ? `/segment-studio/${e.videoId}?item=${encodeURIComponent(e.itemId)}` : `/segment-studio/${e.videoId}?segment=${encodeURIComponent(e.segmentId ?? e.id)}`;
}
function Dl(e) {
  var i;
  const t = Number(e.startSec) || 0, r = Number(e.endSec);
  if (e.endSec != null && Number.isFinite(r)) return Math.max(t, r);
  const o = Number((i = e.videoFile) == null ? void 0 : i.duration);
  return Number.isFinite(o) && o > t ? o : t + 1e-3;
}
function Ol(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("segment"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function aa(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Pl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function at(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function mo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function Wr(e, t) {
  const r = new Set(mo(t).map((o) => String(at(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function Ht(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function ia(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(Ht).sort().join(",")}`;
}
function oi(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((g) => String(g.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((g) => {
    var p;
    return !((p = g.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const g = [...e].sort((h, b) => String(h.slotDefinitionId).localeCompare(String(b.slotDefinitionId))), p = [...t].sort((h, b) => String(h.name).localeCompare(String(b.name)) || Number(at(h)) - Number(at(b)));
    return [{
      assignments: Object.fromEntries(g.map((h, b) => [String(h.slotDefinitionId), String(at(p[b]))])),
      description: p.map((h) => h.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((g) => t.map((p, h) => ({ performer: p, index: h })).filter(({ performer: p }) => {
    var h;
    return !((h = g.genderHints) != null && h.length) || g.genderHints.some((b) => Ht(b) === Ht(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), m = i ? c.filter((g) => g.length > 0).length : sa(c, t.length);
  if (m === 0) return [];
  const u = new Map(t.map((g, p) => [String(at(g)), p]));
  function f(g, p, h) {
    if (s.length >= a) return;
    const b = c.slice(g), k = i ? b.filter((M) => M.length > 0).length : sa(b.map((M) => M.filter((C) => !p.has(String(at(t[C]))))), t.length);
    if (h + k < m) return;
    if (g === e.length) {
      if (h !== m) return;
      const M = Object.fromEntries(d.map(({ slot: $, performer: R }) => [String($.slotDefinitionId), R ? String(at(R)) : ""])), C = o.length === 0 ? Object.values(M).sort().join(",") : [...new Set(e.map(($) => String($.label || "")))].map(($) => `${$}:${d.filter(({ slot: R }) => String(R.label || "") === $).map(({ performer: R }) => R ? String(at(R)) : "").sort().join(",")}`).join("|");
      !l.has(C) && s.length < a && (l.add(C), s.push({
        assignments: M,
        description: d.map(({ slot: $, performer: R }) => o.length ? `${$.label}: ${(R == null ? void 0 : R.name) || "Unassigned"}` : (R == null ? void 0 : R.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const S = e[g], w = [...d].reverse().find(({ slot: M }) => ia(M) === ia(S)), P = w ? u.get(String(at(w.performer))) : -1;
    for (const M of c[g]) {
      const C = t[M], $ = at(C);
      if (!(M < P) && !($ == null || !i && p.has(String($))) && (d.push({ slot: S, performer: C }), i || p.add(String($)), f(g + 1, p, h + 1), i || p.delete(String($)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: S, performer: null }), f(g + 1, p, h), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function sa(e, t) {
  const r = Array(t).fill(-1);
  function o(i, a) {
    for (const s of e[i])
      if (!a.has(s) && (a.add(s), r[s] === -1 || o(r[s], a)))
        return r[s] = i, !0;
    return !1;
  }
  return e.reduce((i, a, s) => i + (o(s, /* @__PURE__ */ new Set()) ? 1 : 0), 0);
}
function Ll(e, t) {
  if (!(e != null && e.length) || !(t != null && t.length)) return null;
  const r = e.some((l) => String(l.label || "").trim());
  if (r && e.some((l) => !String(l.label || "").trim())) return null;
  const o = e[0].allowSamePerformerInMultipleSlots === !0;
  if (!r && e.every((l) => {
    var d;
    return !((d = l.genderHints) != null && d.length);
  }) && e.length === t.length && !o) {
    const l = [...e].sort((c, m) => String(c.slotDefinitionId).localeCompare(String(m.slotDefinitionId))), d = [...t].sort((c, m) => String(c.name).localeCompare(String(m.name)) || c.performerId - m.performerId);
    return l.map((c, m) => ({ slot: c, performer: d[m] }));
  }
  const i = /* @__PURE__ */ new Map(), a = [];
  function s(l, d) {
    var m;
    if (i.size > 1) return;
    if (l === e.length) {
      const u = [...new Set(e.map((f) => f.label || ""))].map((f) => `${f}:${a.filter((g) => (g.slot.label || "") === f).map((g) => g.performer.performerId).sort((g, p) => g - p).join(",")}`).join("|");
      i.has(u) || i.set(u, [...a]);
      return;
    }
    const c = e[l];
    for (const u of t)
      !o && d.has(u.performerId) || (m = c.genderHints) != null && m.length && !c.genderHints.some((f) => Ht(f) === Ht(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
  }
  return s(0, /* @__PURE__ */ new Set()), i.size === 1 ? [...i.values()][0] : null;
}
function Fl(e) {
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
function jl(e, t, r = 20) {
  const o = String(t || "").trim().toLocaleLowerCase(), i = (a) => {
    var d;
    if (!o) return !0;
    const s = String(((d = a.segment) == null ? void 0 : d.tagName) || a.tagName || "").toLocaleLowerCase();
    if (s.includes(o)) return !0;
    let l = -1;
    for (const c of o) {
      const m = s.indexOf(c, l + 1);
      if (m < 0) return !1;
      l = m;
    }
    return !0;
  };
  return (e || []).filter(i).slice(0, Math.max(1, Number(r) || 20));
}
function Bl(e) {
  return (e || []).flatMap((t) => t.markers.map((r) => ({
    segment: r.segment,
    laneKey: t.key,
    groupKey: t.segmentGroupId == null ? "ungrouped" : `group:${t.segmentGroupId}`,
    groupName: t.segmentGroupName || "Ungrouped",
    performers: t.performers || [],
    performerAssignments: t.performerAssignments || []
  })));
}
function Gl(e) {
  return new Set((e || []).map((t) => t.groupKey)).size > 1;
}
function ai(e, t, r) {
  const o = at, i = new Set((t || []).map(o)), a = new Set((r || []).map(Ht));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), m = d.isVideoPerformer ?? i.has(o(d));
    if (c !== m) return m - c;
    const u = Ht(l.gender || l.genderIdentity), f = Ht(d.gender || d.genderIdentity), g = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - g || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: be, useId: ii, useMemo: _e, useRef: ye, useState: B, useSyncExternalStore: Ul } = io, n = io.createElement, si = "/api/plugins/segment-studio";
function je(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(nn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = no();
    return t[e] = r, window.localStorage.setItem(nn, JSON.stringify(t)), r;
  } catch {
    return no();
  }
}
function Ue(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(nn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(nn, JSON.stringify(t));
  } catch {
  }
}
function go(e) {
  try {
    return JSON.parse(window.localStorage.getItem(nn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function po(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(nn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(nn, JSON.stringify(t));
  } catch {
  }
}
function Kl(e) {
  try {
    return { parsed: !0, value: JSON.parse(e) };
  } catch {
    return { parsed: !1, value: null };
  }
}
function zl(e, t) {
  return t != null && t.aborted ? Promise.reject(new DOMException("The request was aborted.", "AbortError")) : new Promise((r, o) => {
    const i = setTimeout(r, e);
    t == null || t.addEventListener("abort", () => {
      clearTimeout(i), o(new DOMException("The request was aborted.", "AbortError"));
    }, { once: !0 });
  });
}
async function X(e, t, r = 0) {
  var d;
  const o = await Aa(`${si}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Kl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await zl(250 * (r + 1), t == null ? void 0 : t.signal), X(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Hl(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${si}${e}`, o = await Aa(r, t);
  if (!o.ok) {
    const i = await o.json().catch(() => null);
    throw new Error((i == null ? void 0 : i.error) || "Unable to download the Segment Studio artifact.");
  }
  return {
    blob: await o.blob(),
    fileName: _l(
      o.headers.get("Content-Disposition")
    )
  };
}
function _l(e, t = "segment-studio-ai-feedback.zip") {
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
function Ae(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function no() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function li(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function ql(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function di(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function Wl(e, t) {
  const { sceneCount: r, segmentCount: o } = di(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function ci(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = di(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(Wl(r, o.segmentCount)))
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
function la({ children: e }) {
  return n("span", {
    className: "inline-flex rounded-full border border-border bg-muted/40 px-2 py-0.5 text-xs font-medium text-secondary"
  }, e);
}
const At = {
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
function mu(e, t) {
  return {
    ...(At[e] || At.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function ui(e) {
  return { ...(At[e] || At.unreviewed).badge };
}
function mi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const gi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function Vl(e, t, r = "not-applicable", o = !1) {
  const i = At[e] || At.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
  return {
    borderColor: i.row.borderLeftColor,
    backgroundColor: a,
    ...s ? { boxShadow: "inset 0 0 0 2px rgb(253, 224, 71)" } : {},
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...o ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Jl(e, t = !1) {
  const r = "rgb(20, 184, 166)";
  return {
    borderColor: r,
    backgroundColor: r,
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px", zIndex: 20 } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 25 } : {}
  };
}
function Yl(e, t) {
  return e == null ? "4px" : `${Math.max(0, Number(t) || 0)}%`;
}
function Ql(e) {
  return e % 2 === 0 ? "var(--color-surface)" : "color-mix(in srgb, var(--color-muted) 14%, var(--color-surface))";
}
function Zl(e, t) {
  return {
    backgroundColor: t,
    ...e ? {
      boxShadow: "inset 3px 0 0 var(--color-accent), inset 0 0 16px color-mix(in srgb, var(--color-accent) 22%, transparent)"
    } : {}
  };
}
function Nr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function Xl(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function rn({ state: e, includeLabel: t = !0 }) {
  const r = At[e] || At.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: ui(e)
  }, t ? `${r.symbol} ${e}` : r.symbol);
}
function ed(e, t = null) {
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
function gu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function td(e, t = document) {
  return !(e.defaultPrevented || ed(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function pu(e, t = document, r = !1, o = {}) {
  return td(e, t) ? dl(e, r, o) != null : !1;
}
function vt(e, { onCancel: t, onConfirm: r } = {}) {
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
function nd(e, t) {
  var o, i, a, s, l, d;
  if (e.key !== "Enter" || e.defaultPrevented || e.isComposing || (o = e.nativeEvent) != null && o.isComposing || e.keyCode === 229)
    return !1;
  const r = (a = (i = e.currentTarget) == null ? void 0 : i.querySelector) == null ? void 0 : a.call(i, "input");
  return !r || r.value.trim() !== String(t || "").trim() || (s = r.getAttribute) != null && s.call(r, "aria-activedescendant") ? !1 : !((d = (l = e.currentTarget).querySelector) != null && d.call(
    l,
    '[role="option"][aria-selected="true"], [role="option"][data-active="true"], [role="option"][data-highlighted="true"]'
  ));
}
function rd({ confirm: e, cancel: t, confirmReady: r }) {
  const o = r && e && !e.disabled ? e : t;
  return !o || o.disabled ? null : (o.focus({ preventScroll: !0 }), o);
}
function fo({ confirmRef: e, cancelRef: t, confirmReady: r }) {
  be(() => {
    const o = requestAnimationFrame(() => rd({
      confirm: e.current,
      cancel: t == null ? void 0 : t.current,
      confirmReady: r
    }));
    return () => cancelAnimationFrame(o);
  }, [r]);
}
function Mt(e) {
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
function od(e, t) {
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
function ur(e, t = !0) {
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
function St(e, t = !0) {
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
function mr(e, t) {
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
function Sr(e) {
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
function pi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function fi(e) {
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
function ad(e, t) {
  const r = (t || []).map((i) => pi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: bt(a),
    genderHints: [...a.genderHints || []].sort(),
    allowSamePerformerInMultipleSlots: a.allowSamePerformerInMultipleSlots === !0
  })).join("|");
  return r.every((i) => o(i) === o(r[0])) ? r : null;
}
function id(e, t) {
  return new Set((t || []).map((r) => r.tagId)).size !== 1 ? null : ad(e, t);
}
function sd({ mergeable: e, reviewable: t, tagEditable: r = !1, slotsEditable: o }) {
  const i = [
    e ? "merged (R)" : null,
    r ? "retagged (Q)" : null,
    t ? "approved (Z)" : null,
    t ? "rejected (X)" : null,
    o ? "assigned performers (G)" : null
  ].filter(Boolean);
  return i.length === 0 ? "Choose one segment to edit it." : i.length === 1 ? `Selected segments can be ${i[0]}.` : `Selected segments can be ${i.slice(0, -1).join(", ")} or ${i.at(-1)}.`;
}
function fu(e, t) {
  return bo(pi(e, t));
}
function bt(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function ld(e, t) {
  const r = (d) => bt(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
    const c = /* @__PURE__ */ new Map();
    for (const m of d || []) {
      const u = r(m);
      c.has(u) || c.set(u, []), c.get(u).push(m);
    }
    return c;
  }, a = i(e), s = i(t), l = [];
  for (const [d, c] of a) {
    const m = s.get(d);
    if (!m || c.length !== m.length)
      continue;
    const u = [...c].sort(o), f = [...m].sort(o);
    u.forEach((g, p) => l.push({
      sourceSlotDefinitionId: g.id,
      derivedSlotDefinitionId: f[p].id
    }));
  }
  return l;
}
function dd(e, t, r) {
  if (!e || e.ruleId != null || (e.slotMappings || []).length > 0)
    return e;
  const o = ld(t, r);
  return o.length === 0 ? e : { ...e, slotMappings: o, slotMappingsSuggested: !0 };
}
function cd(e) {
  const t = bt(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(Ir).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function Ir(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function kr(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function da(e) {
  const t = [], r = [...e.segments].sort((a, s) => a.startSec - s.startSec || a.id - s.id).map((a) => {
    const s = Number(a.startSec) || 0, l = a.endSec == null ? s : Number(a.endSec), d = Number.isFinite(l) ? Math.max(s, l) : s;
    let c = t.findIndex((m) => m.end <= s && m.start !== s);
    return c < 0 && (c = t.length), t[c] = { start: s, end: d }, { segment: a, track: c };
  }), { segments: o, ...i } = e;
  return {
    ...i,
    markers: r,
    counts: kr(o),
    trackCount: Math.max(1, t.length)
  };
}
function ud(e) {
  const t = e.map(bt), r = /* @__PURE__ */ new Map();
  for (const i of t) r.set(i, (r.get(i) || 0) + 1);
  const o = /* @__PURE__ */ new Map();
  return new Map(e.map((i, a) => {
    const s = t[a], l = (o.get(s) || 0) + 1;
    return o.set(s, l), [String(i.slotDefinitionId), r.get(s) > 1 ? `${s} ${l}` : s];
  }));
}
function md(e, t) {
  const r = e.segments.map((l) => {
    const d = t.get(l.id) || [], m = d.length > 0 && d.every((u) => Number(u.performerId) > 0) ? d.map((u) => `${u.slotDefinitionId}:${Number(u.performerId)}`).join("|") : null;
    return { segment: l, slots: d, signature: m };
  }), o = [...new Set(r.map((l) => l.signature).filter(Boolean))];
  if (o.length === 0)
    return [da({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = ud(l.slots), m = l.slots.filter((h) => !a.has(String(h.slotDefinitionId))), u = o.length === 1 ? l.slots : m, f = u.map((h) => `${c.get(String(h.slotDefinitionId))} · ${h.performerName || `Performer ${h.performerId}`}`).join(" · "), g = [...new Map(u.map((h) => [
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
          performers: g,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(da);
}
function tn(e, t = [], r = []) {
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
  }) || s.key.localeCompare(l.key)).flatMap((s) => md(s, a));
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
    for (const s of yt)
      a.counts[s] += Number((r = o.counts) == null ? void 0 : r[s]) || 0;
  }
  return t;
}
const gd = {
  group: 38,
  lane: 33,
  segment: 41
};
function pd(e, t = []) {
  const r = new Set(t || []), o = [];
  let i = 0;
  const a = (s) => {
    const l = gd[s.kind];
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
function yi(e, t, r, o = 240) {
  const i = Math.max(0, Number(t) - o), a = Math.max(i, Number(t) + Math.max(0, Number(r)) + o);
  return (e || []).filter((s) => s.top + s.height >= i && s.top <= a);
}
function fd(e, t = [], r = !0) {
  const o = new Set(t || []), i = [];
  let a = 0;
  const s = (l, d) => {
    i.push({ ...l, top: a, height: d }), a += d;
  };
  for (const l of e || [])
    if (r && s({ kind: "group", key: `header:${l.key}`, group: l }, 32), !o.has(l.key))
      for (const [d, c] of (l.lanes || []).entries()) {
        const m = Math.max(1.75, c.trackCount * 1.25 + 0.5) * 16;
        s({ kind: "lane", key: c.key, group: l, lane: c, laneIndex: d }, m);
      }
  return { rows: i, height: a };
}
function yd(e, t) {
  const r = new Set(t || []), o = (e || []).map((i) => {
    const a = (i.markers || []).filter(({ segment: s }) => r.has(s.id));
    return a.length === 0 ? null : {
      ...i,
      selectedCount: a.length,
      counts: kr(a.map(({ segment: s }) => s)),
      markers: a
    };
  }).filter(Boolean);
  return ho(o).map((i) => {
    const a = i.lanes.flatMap((s) => s.markers.map(({ segment: l }) => l));
    return {
      ...i,
      selectedCount: a.length,
      counts: kr(a)
    };
  });
}
function bi(e, { nativeOnly: t = !1 } = {}) {
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
function ca(e, t) {
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
function qt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function qn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function bd(e) {
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
    }, o ? bd(e.name) : "—"),
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
function hi({ assignments: e, className: t = "" }) {
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
function Cr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = ye(null), i = `performer-slots-${ii()}`, [a, s] = B(null);
  function l() {
    var g;
    const c = (g = o.current) == null ? void 0 : g.getBoundingClientRect();
    if (!c) return;
    const m = Math.max(0, Math.min(256, window.innerWidth - 16)), u = Math.min(window.innerHeight - 16, Math.max(48, ((t == null ? void 0 : t.length) || 0) * 36 + 16)), f = window.innerHeight - c.bottom;
    s({
      left: Math.max(8, Math.min(window.innerWidth - m - 8, c.right - m)),
      top: f >= u + 8 ? c.bottom + 4 : Math.max(8, c.top - u - 4),
      width: m
    });
  }
  be(() => {
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
    a ? us(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(hi, {
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
function hd(e, t) {
  const r = new Set(qt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function vi(e, t) {
  return t ? qt(e).filter((r) => r !== t) : qt(e);
}
function vd(e, t) {
  const r = qt(t), o = new Set(qt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Tt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ua(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), m = Number.isFinite(c) && c >= d ? c : d, u = d <= o && m >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - m));
    return { contains: u, distance: f, duration: m - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function ro(e, t, r, o = null) {
  var m, u, f, g, p, h;
  const i = e.findIndex((b) => b.markers.some((k) => k.segment.id === t));
  if (i < 0) {
    const b = [...((m = e[0]) == null ? void 0 : m.markers) || []];
    return o != null && Number.isFinite(Number(o)) && b.sort((k, S) => ua(k, S, o)), ((u = b[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((b) => b.segment.id === t);
  if (r === "left" || r === "right") {
    const b = r === "left" ? -1 : 1, k = Math.min(a.markers.length - 1, Math.max(0, s + b));
    return ((f = a.markers[k]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((g = a.markers[s]) == null ? void 0 : g.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((h = [...e[l].markers].sort(c ? (b, k) => ua(b, k, Number(o)) : (b, k) => Math.abs(b.segment.startSec - d) - Math.abs(k.segment.startSec - d) || b.segment.startSec - k.segment.startSec || b.segment.id - k.segment.id)[0]) == null ? void 0 : h.segment) ?? null;
}
function xd(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = ro([o], t, r);
  return i ? { segment: i, segmentIds: o.markers.map((a) => a.segment.id) } : null;
}
function Sd(e, t, r) {
  if (!Array.isArray(e) || e.length === 0) return null;
  const o = e.indexOf(t);
  return o < 0 ? e[0] : e[Math.min(e.length - 1, Math.max(0, o + r))];
}
function kd(e, t, r) {
  return !Array.isArray(e) || e.length === 0 ? null : e.includes(t) ? t : e.includes(r) ? r : e[0];
}
function wd(e, t) {
  const r = Number(e);
  if (!Number.isFinite(r)) return [];
  const o = t == null ? null : Number(t);
  if (!Number.isFinite(o) || o <= r) return [pa(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => pa(Math.min(s, r + l))))];
}
function Nd(e, t) {
  const r = Array.isArray(e) ? e.filter(Boolean) : [], o = new Set(
    (Array.isArray(t) ? t : []).map((s) => s == null ? void 0 : s.itemId).filter((s) => s != null)
  ), i = (s) => (s == null ? void 0 : s.itemId) != null && o.has(s.itemId);
  return {
    action: r.length > 0 && r.every(i) ? "remove" : "collect",
    segments: r
  };
}
function Id(e, t) {
  return (t == null ? void 0 : t.collected) === (e === "collect");
}
function br(e, t) {
  if (!e || !t) return e;
  const r = new Set(t.removedSegmentIds || []), o = new Map(
    (t.identityChanges || []).map((c) => [c.previousId, c.currentId])
  ), i = new Map(
    [...t.upsertedSegments || [], ...t.upsertedBasicSegments || []].map((c) => [c.id, c])
  ), a = (e.segments || []).filter((c) => !r.has(c.id)).map((c) => i.has(c.id) ? { ...c, ...i.get(c.id) } : c), s = new Set(a.map((c) => c.id));
  for (const c of i.values())
    s.has(c.id) || a.push(c);
  a.sort((c, m) => Number(c.startSec) - Number(m.startSec) || String(c.key || "").localeCompare(String(m.key || "")));
  const l = (e.performerSlots || []).filter((c) => !r.has(c.segmentId) || o.has(c.segmentId)).map((c) => o.has(c.segmentId) ? { ...c, segmentId: o.get(c.segmentId) } : c), d = {};
  for (const [c, m] of Object.entries(
    e.performerSlotRevisions || {}
  )) {
    const u = Number(c);
    r.has(u) && !o.has(u) || (d[o.get(u) ?? c] = m);
  }
  return {
    ...e,
    approvedSetVersion: t.approvedSetVersion || e.approvedSetVersion,
    segments: a,
    performerSlots: l,
    performerSlotRevisions: d
  };
}
function ma(e, t, r) {
  const o = Array.isArray(e) ? e : [];
  if (!r) return o;
  const i = new Set(
    (Array.isArray(t) ? t : []).map((a) => a == null ? void 0 : a.itemId).filter((a) => a != null)
  );
  return i.size === 0 ? o : o.filter((a) => (a == null ? void 0 : a.itemId) == null || !i.has(a.itemId));
}
function Cd(e) {
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
async function $d(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await ga(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
      throw new Error("The video has no decodable image frames.");
    const o = document.createElement("canvas");
    o.width = r.videoWidth, o.height = r.videoHeight;
    const i = o.getContext("2d");
    if (!i)
      throw new Error("This browser cannot capture video frames.");
    const a = [], s = [];
    for (const [l, d] of t.entries()) {
      const c = [], m = wd(
        d.startSec,
        d.endSec
      );
      for (const [u, f] of m.entries()) {
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await ga(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const g = await Td(o), p = `example-${l + 1}-frame-${u + 1}`;
        c.push({ fieldName: p, timestampSec: f }), s.push({
          fieldName: p,
          file: new File(
            [g],
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
function ga(e, t) {
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
function Td(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function pa(e) {
  return Math.round(e * 1e3) / 1e3;
}
function wr(e, t, r) {
  const o = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).map((i) => o.has(i.id) ? { ...i, ...r } : i).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Ad(e, t) {
  return {
    ...e,
    segments: [...e.segments || [], t].sort((r, o) => r.startSec - o.startSec || r.id - o.id)
  };
}
function oo(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function Vn(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function xi(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Vr(e, t, r, o) {
  const i = (r || []).map((d) => ({ ...d, segmentId: t })), a = e.performerSlots || [], s = a.findIndex((d) => d.segmentId === t), l = a.filter((d) => d.segmentId !== t);
  return l.splice(s < 0 ? l.length : s, 0, ...i), {
    ...e,
    performerSlots: l,
    performerSlotRevisions: o == null ? e.performerSlotRevisions : { ...e.performerSlotRevisions || {}, [t]: o }
  };
}
function Rd(e, t) {
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
function fa(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function Md(e) {
  const { acquireSaveLock: t, compatibilityMode: r, currentTime: o, detail: i, editorFilters: a, endInput: s, hideDerivedSegments: l, historyRef: d, mediaDuration: c, onConflict: m, onDetailChange: u, onReload: f, optimisticSegmentIdRef: g, pendingDuplicateRef: p, pendingFirstSegmentStartSecRef: h, pendingTagEditSegmentIdRef: b, heldCreatedSegmentTag: k, setHeldCreatedSegmentTag: S, replaceSegmentSelection: w, savingSegmentId: P, segments: M, selectedSegment: C, selectedSegmentIdRef: $, selectedSegments: R, selectionAnchorIdRef: T, selectionRangeBaseIdsRef: O, setCreatingSegmentId: _, setEditorFilters: re, setFirstSegmentTagOpen: z, setHideDerivedSegments: I, setHistory: L, setHistoryOpen: G, setPublishApprovedError: ne, setSaveMessage: V, setSelectedSegmentGroupKey: J, setSelectedSegmentId: ce, setSelectedSegmentIds: U, setTagEditing: oe, startInput: fe, tagEditingRef: xe, timelineDuration: ee, video: ue } = e;
  function Y(y) {
    d.current = y || jt, L(d.current);
  }
  async function me(y, N, D, W, K = null) {
    var pe;
    try {
      const E = await X(`/videos/${ue.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: d.current.revision,
          kind: y,
          label: N,
          beforeState: D,
          afterState: W,
          receiptId: K
        })
      });
      return Y(E), !0;
    } catch (E) {
      return E.status === 409 && ((pe = E.payload) != null && pe.current) && Y(E.payload.current), V("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function ae(y, N, D = !0, W = null, K = !1, pe = N, E = !0) {
    var Te;
    if (!y || P != null) return null;
    const Q = R.map((Xe) => Xe.id), q = $.current, ge = D && !r ? crypto.randomUUID() : null, we = t("segment", y.id);
    if (!we) return null;
    V(D ? "Saving directly to Cove…" : "Restoring history…");
    const Be = K ? wr(i, [y.id], pe) : null;
    Be && u(Be, ue.id);
    try {
      if (r && y.nativeSegmentId == null && y.itemId != null) {
        const Ie = `draft-update:${ue.id}:${y.itemId}:${y.revision}:${N.tagId}:${N.startSec}:${N.endSec ?? "open"}:${N.reviewState ?? y.reviewState}`, Ee = await X(`/videos/${ue.id}/drafts/${y.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Ie),
            expectedRevision: y.revision,
            startSec: N.startSec,
            endSec: N.endSec,
            tagId: N.tagId,
            reviewState: N.reviewState
          })
        });
        Ue(Ie);
        const qe = {
          ...y,
          ...Ee.draft,
          id: y.id,
          itemId: y.itemId
        };
        return D && await me(
          "segment.update",
          W || "Changed segment",
          ur(y, r),
          ur(
            qe,
            r
          )
        ), fa(y, N, r) ? await f() : u((st) => ({
          ...st,
          approvedSetVersion: Ee.approvedSetVersion || st.approvedSetVersion,
          segments: (st.segments || []).map((Z) => Z.id === y.id ? qe : Z).sort((Z, de) => Z.startSec - de.startSec || Z.id - de.id)
        }), ue.id), V(((Te = Ee.draft) == null ? void 0 : Te.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), qe;
      }
      const Xe = await X(`/videos/${ue.id}/segments/${y.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...N,
          expectedUpdatedAt: y.updatedAt,
          historyReceiptId: ge
        })
      }), Oe = {
        ...y,
        ...Xe,
        reviewState: N.reviewState ?? y.reviewState
      };
      return fa(y, N, r) ? await f() : u((Ie) => ({
        ...Ie,
        segments: (Ie.segments || []).map((Ee) => Ee.id === y.id ? Oe : Ee).sort((Ee, qe) => Ee.startSec - qe.startSec || Ee.id - qe.id)
      }), ue.id), D && await me(
        "segment.update",
        W || "Changed segment",
        ur(y, r),
        ur(
          Oe,
          r
        ),
        ge
      ), V(D ? "Saved to Cove" : "History restored"), Oe;
    } catch (Xe) {
      return K && u((Oe) => Vn(
        Oe,
        [y],
        Object.keys(pe)
      ), ue.id), K && E && (U(Q), ce(q), T.current = q, O.current = []), Xe.status === 409 ? (V("Conflict — loading the latest segment…"), await m()) : V(Xe.message || "Unable to save the segment."), null;
    } finally {
      we();
    }
  }
  async function te() {
    if (!r) return !1;
    const y = M.filter((W) => !W.published && W.reviewState === "approved").length;
    if (y === 0 || P != null) return !1;
    const N = `complete-review:${ue.id}:${i.approvedSetVersion}`, D = t("publish", -1);
    if (!D) return !1;
    ne(""), V(`Publishing ${y} Approved draft${y === 1 ? "" : "s"}…`);
    try {
      const W = await X(`/videos/${ue.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(N),
          expectedApprovedSetVersion: i.approvedSetVersion
        })
      });
      Ue(N), Y(jt), G(!1);
      const K = await f(), pe = kl(
        M,
        $.current,
        W.published
      ), E = pe ? Ze(K == null ? void 0 : K.segments, pe) : null;
      return E && ce(E.id), V(`${W.published.length} Approved draft${W.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (W) {
      const K = W.status === 409 ? "The approved drafts changed. Review the updated list and try again." : W.message || "Unable to publish the approved drafts.";
      return W.status === 409 && await m(), ne(K), V(K), !1;
    } finally {
      D();
    }
  }
  async function he(y = null, N = null) {
    var Xe;
    if (P != null || H()) return;
    const D = y != null ? h.current : null, W = Number.isFinite(D) ? D : o, K = Math.min(ee, W + 20);
    if (K <= W) {
      V("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const pe = bl(M, C, y);
    if (pe.kind === "choose-tag") {
      h.current = W, V(""), z(!0);
      return;
    }
    if (pe.kind === "invalid-selection") {
      V("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: E } = pe, Q = `create-draft:${ue.id}:${E}:${W}`, q = r ? null : crypto.randomUUID(), ge = $.current, we = {
      ...C || {},
      id: g.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: E,
      tagName: N || (C == null ? void 0 : C.tagName) || "Tag segment",
      tagSortName: E === (C == null ? void 0 : C.tagId) && (C == null ? void 0 : C.tagSortName) || null,
      startSec: W,
      endSec: K,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, Be = t("create", -1);
    if (!Be) return;
    const Te = Ad(i, we);
    z(!1), u(Te, ue.id), pe.openTagEditor && (_(we.id), b.current = we.id, oe(!0)), w(we.id), J(Tt(
      tn(Te.segments, Te.segmentGroups || [], Te.performerSlots || []),
      we.id
    ));
    try {
      let Oe;
      if (r) {
        const qe = await X(`/videos/${ue.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: je(Q), tagId: E, startSec: W, endSec: K })
        });
        Ue(Q), Oe = { itemId: (Xe = qe.draft) == null ? void 0 : Xe.itemId };
      } else
        Oe = { nativeSegmentId: (await X(`/videos/${ue.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: E,
            startSec: W,
            endSec: K,
            historyReceiptId: q
          })
        })).id };
      h.current = null, z(!1);
      const Ie = await f();
      if (!Ie) {
        u((qe) => oo(
          qe,
          [we.id]
        ), ue.id), w(ge), V(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${pe.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
        return;
      }
      const Ee = Ze(Ie == null ? void 0 : Ie.segments, Oe);
      Ee ? (pe.openTagEditor && (xe.current && (b.current = Ee.id), S((qe) => (qe == null ? void 0 : qe.segmentId) === we.id ? { ...qe, segmentId: Ee.id } : qe), _(Ee.id)), w(Ee.id), J(Tt(
        tn(Ie.segments || [], Ie.segmentGroups || [], Ie.performerSlots || []),
        Ee.id
      )), r || await me(
        "segment.create",
        "Created segment",
        St([], !1),
        St([Ee], !1),
        q
      )) : (oe(!1), V(`Segment created, but it could not be selected${pe.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
    } catch (Oe) {
      u((Ie) => oo(
        Ie,
        [we.id]
      ), ue.id), w(ge), y != null && z(!0), V(Oe.message || "Unable to create the draft.");
    } finally {
      S((Oe) => (Oe == null ? void 0 : Oe.segmentId) === we.id ? null : Oe), _(null), Be();
    }
  }
  function H() {
    return k == null || k.segmentId !== (C == null ? void 0 : C.id) ? !1 : (V("Close the tag field to save the new segment's tag first."), !0);
  }
  async function ie() {
    if (R.length !== 1 || !C || P != null || H()) return;
    const y = o;
    if (y <= C.startSec || C.endSec != null && y >= C.endSec) {
      V("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const N = `split-draft:${C.itemId}:${C.revision}:${y}`, D = r ? null : St([C], !1), W = r ? null : crypto.randomUUID(), K = t("split", C.id);
    if (K)
      try {
        let pe = null;
        r && C.nativeSegmentId == null ? (await X(`/videos/${ue.id}/drafts/${C.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(N),
            expectedRevision: C.revision,
            splitSec: y
          })
        }), Ue(N)) : pe = { nativeSegmentId: (await X(`/videos/${ue.id}/segments/${C.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: C.updatedAt,
            splitSec: y,
            historyReceiptId: W
          })
        })).id };
        const E = await f();
        if (!r) {
          const Q = [
            Ze(E == null ? void 0 : E.segments, {
              nativeSegmentId: C.nativeSegmentId ?? C.id
            }),
            Ze(
              E == null ? void 0 : E.segments,
              pe
            )
          ].filter(Boolean);
          await me(
            "segment.split",
            "Split segment",
            D,
            St(Q, !1),
            W
          );
        }
        V(r ? `Segment split; both ranges remain ${C.reviewState}.` : "Segment split.");
      } catch (pe) {
        pe.status === 409 ? await m() : V(pe.message || "Unable to split the draft.");
      } finally {
        K();
      }
  }
  async function A(y = !1) {
    var pe, E;
    if (R.length !== 1 || !C || P != null || H()) return;
    const N = y ? o : C.startSec, D = yl(ue.id, C, y, N), W = r ? null : crypto.randomUUID(), K = t("duplicate", C.id);
    if (K)
      try {
        const Q = ((pe = p.current) == null ? void 0 : pe.operationKey) === D ? p.current : null;
        let q = (Q == null ? void 0 : Q.duplicateIdentity) ?? null;
        if (q == null && r && C.nativeSegmentId == null) {
          const Be = await X(`/videos/${ue.id}/drafts/${C.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(D),
              expectedRevision: C.revision,
              startSec: y ? N : null
            })
          });
          q = Xo(!1, Be), p.current = { operationKey: D, duplicateIdentity: q };
        } else if (q == null) {
          const Be = await X(`/videos/${ue.id}/segments/${C.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: C.updatedAt,
              startSec: y ? N : null,
              historyReceiptId: W
            })
          });
          q = Xo(!0, Be), p.current = { operationKey: D, duplicateIdentity: q };
        }
        const ge = await f(), we = Ze(ge == null ? void 0 : ge.segments, q);
        if (we) {
          r || await me(
            "segment.duplicate",
            "Duplicated segment",
            St([], !1),
            St([we], !1),
            W
          );
          const Be = Wa(
            we,
            ge.performerSlots || [],
            a,
            l,
            ge.segmentGroups || []
          );
          re(Be.filters), I(Be.hideDerivedSegments), U([we.id]), ce(we.id), T.current = we.id, O.current = [], J(Tt(
            tn(ge.segments || [], ge.segmentGroups || [], ge.performerSlots || []),
            we.id
          )), r && C.nativeSegmentId == null && Ue(D), p.current = null, V(y ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          V("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (Q) {
        ((E = p.current) == null ? void 0 : E.operationKey) === D ? V("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : Q.status === 409 ? await m() : V(Q.message || "Unable to duplicate the draft.");
      } finally {
        K();
      }
  }
  async function v() {
    if (R.length !== 1 || !C) return;
    const y = Number(fe), N = s.trim() === "" ? null : Number(s), D = _o(y, N, c);
    if (D.error) {
      V(D.error);
      return;
    }
    if (y === C.startSec && N === C.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await ae(C, { startSec: y, endSec: N, tagId: C.tagId }, !0, null, !0);
  }
  async function x(y, N) {
    if (R.length !== 1 || !C) return;
    const D = _o(y, N, c);
    if (D.error) {
      V(D.error);
      return;
    }
    if (y === C.startSec && N === C.endSec) {
      V("Timing is unchanged.");
      return;
    }
    await ae(C, { startSec: y, endSec: N, tagId: C.tagId }, !0, null, !0);
  }
  return { acceptHistory: Y, recordHistoryAction: me, mutateSegment: ae, completeReview: te, createSegment: he, splitSegment: ie, duplicateSegment: A, saveTiming: v, applyShortcutTiming: x };
}
function Ed() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(Ko).matches);
  return be(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(Ko), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Dd() {
  const [e, t] = B(() => typeof window < "u" && window.matchMedia(zo).matches);
  return be(() => {
    if (typeof window > "u") return;
    const r = window.matchMedia(zo), o = () => t(r.matches);
    return o(), r.addEventListener("change", o), () => r.removeEventListener("change", o);
  }, []), e;
}
function Od() {
  try {
    return As(window.localStorage.getItem(La));
  } catch {
    return { ...ht };
  }
}
function Pd() {
  try {
    return qt(JSON.parse(window.localStorage.getItem(Fa) || "[]"));
  } catch {
    return [];
  }
}
function Ld(e) {
  try {
    window.localStorage.setItem(Fa, JSON.stringify(qt(e)));
  } catch {
  }
}
function Fd(e) {
  try {
    window.localStorage.setItem(La, JSON.stringify(e));
  } catch {
  }
}
function jd() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ba) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function Bd(e) {
  try {
    return window.localStorage.setItem(Ba, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Gd({ status: e }) {
  const t = gi[e];
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
function _t({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, yt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...ui(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${At[t].symbol}${e[t]}`)));
}
function Ud({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: m, shortcutRef: u }) {
  const f = mo(a), [g, p] = B(() => Wr(o, f)), [h, b] = B(!1), [k, S] = B(""), w = ye(!1), P = o.map((O) => `${O.slotDefinitionId}:${O.performerId || ""}`).join("|"), M = f.map((O) => at(O)).join("|"), C = oi(
    o,
    f
  );
  be(() => {
    p(Wr(o, f)), S("");
  }, [t, r, P, M]);
  async function $(O = g) {
    if (!w.current) {
      w.current = !0, b(!0), S("Saving performer slots…");
      try {
        const _ = Wr(o.map((I) => ({
          ...I,
          performerId: O[I.slotDefinitionId] || null
        })), f), re = o.map((I) => {
          const L = _[I.slotDefinitionId] ? Number(_[I.slotDefinitionId]) : null, G = f.find((ne) => String(at(ne)) === String(L));
          return {
            ...I,
            performerId: L,
            performerName: (G == null ? void 0 : G.name) || null
          };
        });
        s(re);
        const z = await X(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((I) => ({ slotDefinitionId: I.slotDefinitionId, performerId: _[I.slotDefinitionId] ? Number(_[I.slotDefinitionId]) : null }))
          })
        });
        S("Performer slots saved."), await l(z, {
          beforeState: Sr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: Sr([{
            segmentId: t,
            itemId: r,
            revision: z.revision,
            slots: z.slots || []
          }])
        });
      } catch (_) {
        d && await d(o, _), _.status === 409 ? (S("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : S(_.message || "Unable to save performer slots.");
      } finally {
        w.current = !1, b(!1);
      }
    }
  }
  function R(O, _) {
    S(`Option ${_ + 1} applied; save to confirm.`), p({ ...g, ...O.assignments });
  }
  async function T(O) {
    const _ = { ...g, ...O.assignments };
    p(_), await $(_);
  }
  return be(() => {
    if (u)
      return u.current = (O) => w.current || !C[O] ? !1 : (T(C[O]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    C.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, C.map((O, _) => n("button", {
        key: _,
        type: "button",
        disabled: h,
        onClick: () => R(O, _),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${_ + 1}: ${O.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, _ + 1),
        n("span", { key: "description" }, O.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${C.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((O) => n("label", { key: O.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, bt(O)),
      (O.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(O.genderHints || []).map(Ir).join(" · ")}`) : null,
      n("select", { key: "select", value: g[O.slotDefinitionId] || "", disabled: h, onChange: (_) => p({ ...g, [O.slotDefinitionId]: _.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(f, f, O.genderHints).map((_) => n("option", { key: at(_), value: at(_) }, _.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: m, type: "button", disabled: h, onClick: () => $(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, k)])
  ]);
}
function Kd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var C;
  const s = ((C = t[0]) == null ? void 0 : C.slots) || [], l = mo(r), d = oi(
    s,
    l
  ), c = "__mixed__", m = () => Object.fromEntries(s.map(($, R) => {
    const T = t.map((O) => {
      var _;
      return String(((_ = O.slots[R]) == null ? void 0 : _.performerId) || "");
    });
    return [$.slotDefinitionId, T.every((O) => O === T[0]) ? T[0] : c];
  })), [u, f] = B(m), [g, p] = B(!1), [h, b] = B(""), k = ye(!1), S = t.map(($) => `${$.itemId ?? `native:${$.segmentId}`}:${$.revision}:${$.slots.map((R) => `${R.slotDefinitionId}:${R.performerId || ""}`).join(",")}`).join("|");
  be(() => {
    f(m());
  }, [S]);
  async function w($ = u) {
    if (k.current) return;
    k.current = !0, p(!0), b(`Saving performer slots for ${t.length} segments…`);
    const R = [];
    try {
      for (const T of t) {
        const O = T.slots.map((re, z) => {
          const I = $[s[z].slotDefinitionId];
          return {
            slotDefinitionId: re.slotDefinitionId,
            performerId: I === c ? re.performerId || null : I ? Number(I) : null
          };
        }), _ = await X(T.itemId != null ? `/videos/${e}/drafts/${T.itemId}/slots` : `/videos/${e}/segments/${T.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: T.revision, assignments: O })
        });
        R.push({
          segmentId: T.segmentId,
          itemId: T.itemId,
          revision: _.revision,
          slots: _.slots || []
        });
      }
      b("Performer slots saved."), o({
        beforeState: Sr(t),
        afterState: Sr(R)
      });
    } catch (T) {
      const O = await i();
      T.status === 409 ? b(O ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : b(T.message || (O ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      k.current = !1, p(!1);
    }
  }
  function P($, R) {
    b(`Option ${R + 1} applied; save to confirm.`), f({ ...u, ...$.assignments });
  }
  async function M($) {
    const R = { ...u, ...$.assignments };
    f(R), await w(R);
  }
  return be(() => {
    if (a)
      return a.current = ($) => k.current || !d[$] ? !1 : (M(d[$]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map(($, R) => n("button", {
        key: R,
        type: "button",
        disabled: g,
        onClick: () => P($, R),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${R + 1} to all selected segments: ${$.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, R + 1),
        n("span", { key: "description" }, $.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map(($) => n("label", {
      key: $.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, bt($)),
      n("select", {
        key: "select",
        value: u[$.slotDefinitionId] || "",
        disabled: g,
        onChange: (R) => f({ ...u, [$.slotDefinitionId]: R.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[$.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...ai(l, l, $.genderHints).map((R) => n("option", {
          key: at(R),
          value: at(R)
        }, R.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: g,
        onClick: () => w(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, h)
    ])
  ]);
}
function Rt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function zd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Rt(t);
  const o = [...new Set(r.map((i) => Rt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function $r() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function gr({ name: e }) {
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
function Hd({ hidden: e }) {
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
    n($r, { key: "derived" })
  ]);
}
function _d({ segment: e, provenance: t }) {
  var m;
  const [r, o] = B(!1), i = e.itemId != null ? `item:${e.itemId}` : e.nativeSegmentId != null ? `native:${e.nativeSegmentId}` : null, a = t.key === i ? t : { loading: !0, error: null, items: [] }, s = Array.isArray(a.items) ? a.items : [], l = `segment-provenance-${e.id}`, d = zd(a, e.sourceKey), c = e.confidence == null ? "" : ` · ${Math.round(e.confidence * 100)}%`;
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
        (m = e.sourceKey) != null && m.includes("stash-marker-studio") ? "Imported from Stash Marker Studio. Detailed run and model information was not recorded for this legacy segment." : "No detailed provenance was recorded for this segment."
      ) : s.map((u) => {
        const f = u.modelIdentifier || u.modelKey, g = u.value == null ? null : typeof u.value == "string" ? u.value : JSON.stringify(u.value);
        return n("div", { key: u.id || `${u.fieldKey}:${u.sourceKey}:${u.sourceRunId || ""}`, className: "space-y-0.5 text-xs" }, [
          n(
            "div",
            { key: "source", className: "font-medium text-foreground" },
            Rt(u.sourceKey, u.sourceDisplayName)
          ),
          u.fieldKey ? n(
            "div",
            { key: "field", className: "text-secondary" },
            `Field ${u.fieldKey}${g == null ? "" : ` · ${g}`}`
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
function qd({
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
  saveMessage: m
}) {
  const [u, f] = B([]), g = e.flatMap((k) => k.lanes.map((S) => S.key)), p = g.join("|");
  be(() => {
    const k = new Set(g);
    f((S) => S.filter((w) => k.has(w)));
  }, [p]);
  const h = kr(t), b = !!bi(
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
        `${g.length} swimlane${g.length === 1 ? "" : "s"} · ${e.length} group${e.length === 1 ? "" : "s"}`
      ),
      a ? n(_t, { key: "counts", counts: h }) : null
    ]),
    n(
      "p",
      { key: "actions", className: "rounded-md border border-border bg-surface px-3 py-2 text-xs text-secondary" },
      sd({ mergeable: b, reviewable: a, tagEditable: s, slotsEditable: l })
    ),
    l ? n("button", {
      key: "slots",
      ref: c,
      type: "button",
      onClick: d,
      className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/40"
    }, "Edit performer slots") : null,
    m ? n("p", {
      key: "save-message",
      role: "status",
      "aria-live": "polite",
      className: "text-xs text-secondary"
    }, m) : null,
    ...e.map((k) => n("section", {
      key: k.key,
      "data-selected-segment-group": k.key,
      className: "space-y-1.5"
    }, [
      n("div", { key: "heading", className: "flex items-center justify-between gap-2 px-1" }, [
        n("h3", { key: "name", className: "truncate text-xs font-semibold uppercase tracking-wide text-secondary" }, k.name),
        n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, `${k.selectedCount} selected`)
      ]),
      ...k.lanes.map((S) => {
        const w = u.includes(S.key), P = S.markers.some(({ segment: C }) => C.id === r), M = `selected-segment-lane-${S.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: S.key,
          "data-selected-segment-lane": S.key,
          className: `rounded-md border ${P ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": w,
            "aria-controls": M,
            "aria-current": P ? "true" : void 0,
            onClick: () => f((C) => w ? C.filter(($) => $ !== S.key) : [...C, S.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, w ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, qn(S)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(S.selectedCount)),
            a ? n(_t, { key: "states", counts: S.counts }) : null
          ]),
          w ? n("div", {
            key: "segments",
            id: M,
            className: "space-y-1 border-t border-border p-1.5"
          }, S.markers.map(({ segment: C }) => {
            const $ = C.endSec == null ? Ae(C.startSec) : `${Ae(C.startSec)} – ${Ae(C.endSec)}`;
            return n("button", {
              key: C.id,
              type: "button",
              onClick: () => i(C),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${C.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${C.tagName || "Segment"}, ${C.reviewState}, ${$}` : `${C.tagName || "Segment"}, ${$}`,
              "aria-current": C.id === r ? "true" : void 0
            }, [
              a ? n(rn, {
                key: "state",
                state: C.reviewState,
                includeLabel: !1
              }) : null,
              C.isDerived ? n($r, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, $),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Rt(C.sourceKey)
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
}, ya = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], ba = [
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
function Yn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Si(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function ha(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function pr(e, t, r, o = null) {
  const i = ha(t), a = ha(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function Wd(e, t, r = null) {
  var u, f, g;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), pr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), pr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), pr(o, t.performersCriterion, "performer"), pr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = va(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = va(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const m = (g = t.shotBoundariesCriterion) == null ? void 0 : g.value;
  return r && typeof m == "boolean" ? o.set("hasShotBoundaries", String(m)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function va(e) {
  const t = Array.isArray(e) ? e : String(e || "").split(",");
  return [...new Set(t.map(Number).filter((r) => Number.isInteger(r) && r > 0))];
}
function Vd(e, t, r, o = null, i = !1) {
  const a = new Set(e), s = t.indexOf(o), l = t.indexOf(r);
  if (i && s >= 0 && l >= 0) {
    const d = Math.min(s, l), c = Math.max(s, l);
    t.slice(d, c + 1).forEach((m) => a.add(m));
  } else a.has(r) ? a.delete(r) : a.add(r);
  return a;
}
function ki({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(la, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, yt.flatMap((r) => {
    const o = Number(e[`${r}Count`]) || 0;
    if (o === 0) return [];
    const i = At[r];
    return [n("span", {
      key: r,
      title: `${o} ${r} segment${o === 1 ? "" : "s"}`,
      className: "inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 font-semibold",
      style: i.badge
    }, `${i.symbol} ${o}`)];
  })) : n(
    "div",
    { className: "text-[11px]" },
    n(la, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function wi({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
function Jd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
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
      onClick: (l) => Yn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(wi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ms(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(ki, { item: e, showReviewStates: r }))
    ])
  ]);
}
function Yd({ item: e, onNavigate: t, showReviewStates: r = !1, selected: o = !1, selectionActive: i = !1, onSelect: a = null }) {
  const s = { page: "segment-studio", id: e.videoId };
  return n("article", {
    onClick: i ? (l) => {
      l.button === 0 && a(e.videoId, l.shiftKey);
    } : void 0,
    className: `group relative overflow-hidden rounded-md border bg-card ${i ? "cursor-pointer" : ""} ${o ? "border-accent ring-2 ring-accent" : "border-border"}`
  }, [
    n(wi, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Yn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(ki, { key: "segments", item: e, showReviewStates: r })
      ]),
      n("span", { key: "action", "aria-hidden": "true", className: "shrink-0 px-3 text-secondary" }, "›")
    ])
  ]);
}
function vo({ active: e, onNavigate: t, showBin: r = !1, profile: o }) {
  const i = Cl(o);
  return n("nav", { "aria-label": "Segment Studio", className: "flex items-end justify-between gap-3 border-b border-border" }, [
    n("div", { key: "tabs", className: "flex gap-1" }, i.map((a) => n("a", {
      key: a.key,
      href: a.href,
      onClick: (s) => Yn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && bn(
        o,
        Bt.recyclingBinView
      ) ? n(Ni, { key: "bin", onNavigate: t }) : null,
      n(Ii, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ao = "segment-studio:recycling-bin-changed";
function Qd(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function zn() {
  window.dispatchEvent(new CustomEvent(ao));
}
function Ni({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = B(null);
  be(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const m = await X("/bin"), u = Number(m == null ? void 0 : m.totalCount);
        !a && c === s && o(Number.isFinite(u) && u >= 0 ? Math.trunc(u) : null);
      } catch {
        !a && c === s && o(null);
      }
    }, d = () => {
      l();
    };
    return l(), window.addEventListener(ao, d), window.addEventListener("focus", d), () => {
      a = !0, window.removeEventListener(ao, d), window.removeEventListener("focus", d);
    };
  }, []);
  const i = Qd(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Yn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ii({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Yn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function Zd({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = to(i.target.value);
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
function Xd({ minimum: e, maximum: t, onChange: r }) {
  const o = ye(null), [i, a] = B("maximum"), s = (f, g) => {
    const p = Fs(e, t, f, g);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, g) => {
    var h;
    const p = (h = o.current) == null ? void 0 : h.getBoundingClientRect();
    p && s(f, Ls(g.clientX, p.left, p.width));
  }, d = (f, g) => {
    var p, h;
    g.preventDefault(), (h = (p = g.currentTarget).setPointerCapture) == null || h.call(p, g.pointerId), l(f, g);
  }, c = (f, g) => {
    var p, h;
    (h = (p = g.currentTarget).hasPointerCapture) != null && h.call(p, g.pointerId) && l(f, g);
  }, m = (f, g) => {
    const p = f === "minimum" ? e : t, h = f === "minimum" ? 0 : e, b = f === "minimum" ? t : 1, k = g.shiftKey ? 0.1 : 0.01;
    let S = null;
    ["ArrowLeft", "ArrowDown"].includes(g.key) && (S = p - k), ["ArrowRight", "ArrowUp"].includes(g.key) && (S = p + k), g.key === "PageDown" && (S = p - 0.1), g.key === "PageUp" && (S = p + 0.1), g.key === "Home" && (S = h), g.key === "End" && (S = b), S != null && (g.preventDefault(), s(f, Math.min(b, Math.max(h, S))));
  }, u = (f, g) => n("span", {
    key: f,
    role: "slider",
    tabIndex: 0,
    "aria-label": f === "minimum" ? "Minimum AI confidence" : "Maximum AI confidence",
    "aria-valuemin": Math.round((f === "minimum" ? 0 : e) * 100),
    "aria-valuemax": Math.round((f === "minimum" ? t : 1) * 100),
    "aria-valuenow": Math.round(g * 100),
    "aria-valuetext": `${Math.round(g * 100)} percent`,
    onPointerDown: (p) => d(f, p),
    onPointerMove: (p) => c(f, p),
    onKeyDown: (p) => m(f, p),
    className: "absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize rounded-full border-2 border-accent bg-card shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-card",
    style: {
      left: `${g * 100}%`,
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
function ec({ saving: e, error: t, onSelect: r, onClose: o }) {
  const i = ye(null);
  be(() => {
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
    onKeyDownCapture: (s) => vt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
function tc({
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
  onClose: m
}) {
  const u = kt(e), f = [...new Map((a || []).map((b) => [
    Number(b.tagId),
    b.tagName || `Tag ${b.tagId}`
  ])).entries()].sort((b, k) => b[1].localeCompare(k[1]) || b[0] - k[0]), g = (b) => d(kt({ ...u, ...b })), p = (b) => g({
    reviewStates: u.reviewStates.includes(b) ? u.reviewStates.filter((k) => k !== b) : [...u.reviewStates, b]
  }), h = (b) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${b ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && m();
    },
    onKeyDownCapture: (b) => vt(b, { onCancel: m })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
        onClick: m,
        "aria-label": "Close editor filters",
        className: "rounded-md px-2 py-1 text-xl leading-none text-secondary hover:bg-muted/40 hover:text-foreground"
      }, "×")
    ]),
    n("div", { key: "body", className: "min-h-0 space-y-5 overflow-y-auto p-5" }, [
      l ? n("fieldset", { key: "approval", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Approval state"),
        n("div", { className: "flex flex-wrap gap-2" }, yt.map((b) => {
          const k = u.reviewStates.includes(b), S = At[b];
          return n("button", {
            key: b,
            type: "button",
            onClick: () => p(b),
            "aria-pressed": k,
            className: h(k)
          }, `${S.symbol} ${b} (${i[b] || 0})`);
        }))
      ]) : null,
      l ? n("fieldset", { key: "performer", className: "space-y-2" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "Performer"),
        n("p", { className: "text-xs text-secondary" }, "Any assigned slot may match the selected performer."),
        n("div", { className: "flex flex-wrap gap-2" }, [
          n("button", {
            key: "any",
            type: "button",
            onClick: () => g({ performerId: null }),
            "aria-pressed": u.performerId == null,
            className: h(u.performerId == null)
          }, "All performers"),
          ...r.map((b) => {
            const k = Number(at(b));
            return n("button", {
              key: k,
              type: "button",
              onClick: () => g({ performerId: k }),
              "aria-pressed": u.performerId === k,
              className: h(u.performerId === k)
            }, b.name);
          })
        ])
      ]) : null,
      n("div", { key: "native-scope", className: "grid gap-3 sm:grid-cols-2" }, [
        n("label", { key: "tag", className: "space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Tag"),
          n("select", {
            key: "select",
            value: u.tagId ?? "",
            onChange: (b) => g({
              tagId: b.target.value === "" ? null : Number(b.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All tags"),
            ...f.map(([b, k]) => n("option", { key: b, value: b }, k))
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
            onChange: (b) => g({
              segmentGroupId: b.target.value === "" ? null : b.target.value === "ungrouped" ? "ungrouped" : Number(b.target.value)
            }),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "all", value: "" }, "All Segment groups"),
            ...(s || []).map((b) => n("option", { key: b.id, value: b.id }, b.name)),
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
            onClick: () => g({ sourceKey: null }),
            "aria-pressed": u.sourceKey == null,
            className: h(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((b) => n("button", {
            key: b,
            type: "button",
            onClick: () => g({ sourceKey: b }),
            "aria-pressed": u.sourceKey === b,
            title: b,
            className: h(u.sourceKey === b)
          }, Rt(b)))
        ])
      ]),
      n("fieldset", { key: "confidence", className: "space-y-3" }, [
        n("legend", { className: "text-sm font-semibold text-foreground" }, "AI confidence"),
        n(
          "p",
          { className: "text-xs text-secondary" },
          "The confidence range applies only to AI segments that record confidence; manual and unscored segments remain visible."
        ),
        n(Xd, {
          minimum: u.confidenceMin,
          maximum: u.confidenceMax,
          onChange: ({ minimum: b, maximum: k }) => g({
            confidenceMin: b,
            confidenceMax: k
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
            onChange: (b) => g({
              includeUnscored: b.target.checked
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
          onChange: (b) => c(b.target.checked),
          className: "h-4 w-4 accent-[var(--color-accent)]"
        }),
        n(Hd, { key: "icon", hidden: t }),
        n("span", { key: "label" }, "Hide derived segments")
      ]) : null
    ]),
    n("footer", { key: "footer", className: "flex items-center justify-between gap-3 border-t border-border px-5 py-4" }, [
      n("button", {
        key: "reset",
        type: "button",
        onClick: () => {
          d(kt({})), l && c(!1);
        },
        className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
      }, "Reset filters"),
      n("button", {
        key: "done",
        type: "button",
        onClick: m,
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground"
      }, "Done")
    ])
  ]));
}
function nc({ reviewMode: e, bindings: t, onClose: r }) {
  const o = Jn.filter((l) => yn(l, e)), i = Qo(o, 1)[0], a = Qo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((m) => n("div", { key: m.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, m.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[m.id] ? t[m.id].length > 0 ? t[m.id] : ["Unassigned"] : m.bindings.map(Za)).map((u, f) => n("kbd", { key: `${m.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => vt(l, { onCancel: r })
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
function rc({
  examples: e,
  exporting: t,
  removingExampleId: r,
  onExport: o,
  onRemove: i,
  onClose: a
}) {
  const s = Cd(e), [l, d] = B([]), c = s.map((m) => m.tagName).join("|");
  return be(() => {
    const m = new Set(s.map((u) => u.tagName));
    d((u) => u.filter((f) => m.has(f)));
  }, [c]), n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && r == null && a();
    },
    onKeyDownCapture: (m) => vt(m, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
    className: "flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-2xl",
    style: { maxHeight: "calc(100dvh - 2rem)" }
  }, [
    n("header", { key: "header", className: "border-b border-border px-5 py-4" }, [
      n("h2", { key: "title", id: "segment-studio-examples-title", className: "text-lg font-semibold text-foreground" }, "AI Feedback"),
      n("p", { key: "description", className: "mt-1 text-sm text-secondary" }, `${e.length} registered-AI example${e.length === 1 ? "" : "s"} in this video. Expand a tag to inspect or restore examples before export.`)
    ]),
    n("div", { key: "body", className: "min-h-0 flex-1 overflow-y-auto p-5" }, [
      n("div", { key: "items", className: "space-y-3" }, e.length ? s.map((m, u) => {
        const f = l.includes(m.tagName), g = `incorrect-example-tag-${u}`;
        return n("section", {
          key: m.tagName,
          className: "overflow-hidden rounded-md border border-border bg-card"
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": f,
            "aria-controls": g,
            onClick: () => d((p) => f ? p.filter((h) => h !== m.tagName) : [...p, m.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: Nr(!1) }
          }, [
            n(
              "span",
              { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" },
              f ? "▾" : "▸"
            ),
            n(
              "span",
              { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
              m.tagName
            ),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${m.examples.length} example${m.examples.length === 1 ? "" : "s"}`
            )
          ]),
          f ? n("div", {
            key: "examples",
            id: g,
            className: "divide-y divide-border border-t border-border"
          }, m.examples.map((p) => {
            const h = `${Ae(p.startSec)}${p.endSec == null ? "" : ` – ${Ae(p.endSec)}`}`, b = r === p.id;
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
                "aria-label": `${b ? "Restoring" : "Restore to review"} ${m.tagName} example at ${h}`,
                className: "rounded border border-border px-2 py-1 text-xs font-medium disabled:opacity-50"
              }, b ? "Restoring…" : "Restore to review")
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
function oc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = B(""), [a, s] = B(0), l = ye(null), d = _e(() => jl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), m = Gl(d);
  be(() => {
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
      var g;
      if (f.key === "Tab")
        Mt(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), r();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const p = f.key === "ArrowDown" ? 1 : -1;
        s((h) => d.length ? (h + p + d.length) % d.length : 0);
      } else f.key === "Enter" && !((g = f.nativeEvent) != null && g.isComposing) && (f.preventDefault(), f.stopPropagation(), u());
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
    }, d.length ? d.flatMap((f, g) => {
      var M;
      const p = f.segment || f, h = p.endSec == null ? Ae(p.startSec) : `${Ae(p.startSec)} – ${Ae(p.endSec)}`, b = `${Rt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, k = g === c, S = g > 0 ? d[g - 1].groupKey : null, w = m && f.groupKey !== S ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, P = n("button", {
        key: p.id,
        id: `segment-quick-search-${p.id}`,
        ref: k ? l : null,
        type: "button",
        role: "option",
        "aria-selected": k,
        onMouseEnter: () => s(g),
        onClick: () => t(p),
        className: `mb-1 flex w-full min-w-0 items-center gap-1.5 rounded-md border px-2 py-1.5 text-left last:mb-0 ${k ? "border-accent bg-accent/15" : "border-border bg-surface hover:bg-muted/40"}`
      }, [
        m ? n("span", { key: "group", className: "sr-only" }, `${f.groupName} group`) : null,
        n(rn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (M = f.performers) != null && M.length ? n(Cr, {
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
          title: b
        }, b)
      ]);
      return w ? [w, P] : [P];
    }) : n("p", { className: "p-6 text-center text-sm text-secondary" }, "No visible segments match that search."))
  ]));
}
function ac(e) {
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
function ic({
  drafts: e,
  processing: t,
  error: r,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const s = _e(() => ac(e), [e]), [l, d] = B([]), c = s.reduce((g, p) => g + p.drafts.length, 0), m = ye(null);
  fo({ confirmRef: m, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (g) => d((p) => p.includes(g) ? p.filter((h) => h !== g) : [...p, g]), f = (g) => `segment-studio-publish-approved-${g.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => vt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
      ].flatMap(([g, p]) => [
        n("dt", { key: `${g}:label`, className: "text-secondary" }, g),
        n("dd", { key: `${g}:value`, className: "font-semibold text-foreground" }, String(p))
      ])),
      s.length ? n("div", { key: "groups", className: "space-y-2" }, s.map((g) => {
        const p = l.includes(g.key);
        return n("section", { key: g.key, className: "overflow-hidden rounded-md border border-border bg-surface" }, [
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": p,
            "aria-controls": f(g),
            onClick: () => u(g.key),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left disabled:opacity-50",
            style: { background: Nr(!1) }
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "shrink-0 text-xs text-secondary" }, p ? "▾" : "▸"),
            n("span", { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, g.tagName),
            n(
              "span",
              { key: "count", className: "shrink-0 text-xs text-secondary" },
              `${g.drafts.length} draft${g.drafts.length === 1 ? "" : "s"}`
            )
          ]),
          p ? n("div", {
            key: "drafts",
            id: f(g),
            className: "divide-y divide-border border-t border-border"
          }, g.drafts.map((h) => {
            const b = h.endSec == null ? Ae(h.startSec) : `${Ae(h.startSec)} – ${Ae(h.endSec)}`, k = `${Rt(h.sourceKey)}${h.confidence == null ? "" : ` · ${Math.round(h.confidence * 100)}%`}`;
            return n("div", { key: h.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(rn, { key: "review", state: h.reviewState, includeLabel: !1 }),
              n("span", { key: "time", className: "min-w-0 flex-1 whitespace-nowrap font-mono text-xs text-foreground" }, b),
              n("span", {
                key: "provenance",
                className: "max-w-36 shrink truncate text-right text-[10px] text-secondary",
                title: k
              }, k)
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
        ref: m,
        type: "button",
        disabled: t || c === 0,
        onClick: i,
        className: "rounded-md border border-emerald-500/60 bg-emerald-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-emerald-500/30 disabled:opacity-50"
      }, t ? "Publishing…" : `Publish ${c} approved draft${c === 1 ? "" : "s"}`)
    ])
  ]));
}
function sc({ candidates: e, processing: t, error: r, onConfirm: o, onClose: i }) {
  const a = Fl(e), [s, l] = B(() => /* @__PURE__ */ new Set()), [d, c] = B(() => new Set(a.map((h) => h.key))), m = a.flatMap((h) => d.has(h.key) ? h.candidates : []), u = (h) => l((b) => {
    const k = new Set(b);
    return k.has(h) ? k.delete(h) : k.add(h), k;
  }), f = (h) => c((b) => {
    const k = new Set(b);
    return k.has(h) ? k.delete(h) : k.add(h), k;
  }), g = (h) => h.assignment.map(({ slot: b, performer: k }) => `${b.label || `Slot ${b.sortOrder + 1}`}: ${k.name}`).join(", "), p = (h) => `segment-studio-auto-assign-${h.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (h) => {
      h.target === h.currentTarget && !t && i();
    },
    onKeyDownCapture: (h) => {
      h.key === "Enter" && h.target instanceof HTMLInputElement || vt(h, {
        onCancel: t ? void 0 : i,
        onConfirm: m.length && !t ? () => o(m) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
          style: { background: Nr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(h.key),
            disabled: t,
            onChange: () => f(h.key),
            "aria-label": `Include ${h.tagName} assignment: ${g(h)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(h.key),
            "aria-controls": p(h),
            "aria-label": `${s.has(h.key) ? "Collapse" : "Expand"} ${h.tagName} assignment: ${g(h)}`,
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
            h.assignment.map(({ slot: b, performer: k }) => {
              const S = b.label || `Slot ${b.sortOrder + 1}`;
              return n("span", {
                key: b.slotDefinitionId,
                className: "flex items-center gap-1",
                "aria-label": `${S}: ${k.name}`
              }, [
                n("span", {
                  key: "assignment",
                  "aria-hidden": "true",
                  className: "max-w-28 truncate text-[10px] font-medium text-secondary",
                  title: `${S}: ${k.name}`
                }, `${S}: ${k.name}`),
                n(Wn, {
                  key: "avatar",
                  performer: { id: k.performerId, name: k.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(_t, { key: "states", counts: h.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(h.candidates),
            "aria-label": `Auto-Assign ${h.tagName}: ${g(h)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${h.candidates.length})`)
        ]),
        s.has(h.key) ? n(
          "div",
          { key: "segments", id: p(h), className: "divide-y divide-border/70" },
          h.candidates.map((b) => {
            const k = b.endSec == null ? Ae(b.startSec) : `${Ae(b.startSec)} – ${Ae(b.endSec)}`, S = `${Rt(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", {
              key: b.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(rn, { key: "review", state: b.reviewState, includeLabel: !1 }),
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
                b.tagName || "Tag segment"
              ),
              n(
                "span",
                { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" },
                k
              ),
              n("span", {
                key: "provenance",
                className: "max-w-28 shrink truncate text-right text-[10px] text-secondary",
                title: S
              }, S)
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
        disabled: t || m.length === 0,
        onClick: () => o(m),
        className: "rounded-md border border-violet-400/60 bg-violet-500/20 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-violet-500/30 disabled:opacity-50"
      }, t ? "Assigning…" : `Auto-Assign ${m.length} Segment${m.length === 1 ? "" : "s"}`)
    ])
  ]));
}
function lc({ preview: e, onConfirm: t, onClose: r }) {
  const o = Number(e.selectedSegmentCount) || 0, i = Number(e.dependentSegmentCount) || 0, a = Number(e.deletedSegmentCount) || o + i, s = Number(e.retainedSharedSegmentCount) || 0, l = Number(e.deferredRejectedSegmentCount) || 0;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (d) => {
      d.target === d.currentTarget && r();
    },
    onKeyDownCapture: (d) => vt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
function dc({
  merge: e,
  processing: t,
  undoable: r = !1,
  cancelButtonRef: o,
  onConfirm: i,
  onClose: a
}) {
  const [s, l] = B(!1), d = ye(null);
  if (fo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => vt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
        `${Ae(e.startSec)} – ${c}`
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
          onChange: (m) => l(m.target.checked),
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
function cc(e) {
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
function uc({ preview: e, loading: t, processing: r, error: o, cancelButtonRef: i, onConfirm: a, onClose: s }) {
  var u, f;
  const l = e ? e.createCount + e.linkCount : 0, d = ye(null);
  fo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], m = cc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !r && s();
    },
    onKeyDownCapture: (g) => vt(g, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
        ].flatMap(([g, p]) => [
          n("dt", { key: `${g}:label`, className: "text-secondary" }, g),
          n("dd", { key: `${g}:value`, className: "font-semibold text-foreground" }, String(p))
        ])),
        e.conflictCount > 0 ? n(
          "p",
          { key: "conflicts", role: "status", className: "rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-foreground" },
          `${e.conflictCount} existing derivation ${e.conflictCount === 1 ? "branch was" : "branches were"} skipped because its lineage no longer matches the active rule. Resolve these through lineage maintenance.`
        ) : null,
        m.length ? n("div", { key: "outputs", className: "space-y-2" }, [
          ...m.map((g) => n("article", {
            key: g.key,
            className: "rounded-md border border-border bg-surface p-3"
          }, [
            n("div", { key: "root", className: "flex min-w-0 items-center gap-2" }, [
              n(
                "span",
                { key: "tag", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" },
                `${g.rootTagName} @ ${Ae(g.rootStartSec)}`
              ),
              n(
                "span",
                { key: "count", className: "shrink-0 text-xs font-medium text-secondary" },
                `${g.outputs.length} ${g.outputs.length === 1 ? "change" : "changes"}`
              )
            ]),
            n(
              "div",
              { key: "tree", className: "mt-2 space-y-1 border-l border-border pl-2" },
              g.outputs.map((p, h) => n("div", {
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
function mc({
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
  performerSlotsAvailable: m,
  selectedPerformerSlots: u,
  performerSlots: f,
  detail: g,
  video: p,
  slotButtonRef: h,
  tagSearchRef: b,
  onDetailChange: k,
  setSaveMessage: S,
  acquireSaveLock: w,
  onSlotsChanged: P,
  onRecordHistory: M,
  onCancelQueuedReview: C,
  splitSegment: $,
  duplicateSegment: R,
  provenance: T,
  lineage: O,
  onNavigateLineageItem: _,
  tagEditing: re,
  onCancelTagEditing: z,
  detailPanelRef: I,
  onReduceSelection: L
}) {
  var ue, Y, me, ae;
  const G = ye(null), ne = ye(null), V = () => {
    var te;
    (te = ne.current) == null || te.call(ne), ne.current = null;
  }, J = ye(null), ce = ye(null), U = ye(null), oe = ye(null), [fe, xe] = B(!1);
  be(() => {
    G.current && (G.current.scrollTop = 0), xe(!1);
  }, [t == null ? void 0 : t.id]), be(() => {
    var te, he;
    fe && ((he = (te = J.current) == null ? void 0 : te.querySelector("input, select, button")) == null || he.focus({ preventScroll: !0 }));
  }, [fe]);
  function ee() {
    xe(!1), requestAnimationFrame(() => {
      var te;
      return (te = h.current) == null ? void 0 : te.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const te = !r.some((ie) => ie.isDerived), he = e && m ? id(f, r) : null, H = (he == null ? void 0 : he.map((ie, A) => {
      var x;
      const v = r[A];
      return {
        segmentId: v.nativeSegmentId,
        itemId: v.published ? null : v.itemId,
        revision: (x = g.performerSlotRevisions) == null ? void 0 : x[v.id],
        slots: ie
      };
    })) || [];
    return n(io.Fragment, null, [
      n(qd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: I,
        onReduceSelection: L,
        reviewable: e,
        tagEditable: te,
        slotsEditable: H.length > 0 && a == null,
        onEditSlots: () => xe(!0),
        slotButtonRef: h,
        saveMessage: i
      }),
      re && te ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ie) => {
          ie.target === ie.currentTarget && z();
        },
        onKeyDownCapture: (ie) => vt(ie, { onCancel: z })
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
        n(Hn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ie, A) => ie == null ? z() : l(ie, A == null ? void 0 : A.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: z,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      fe && H.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ie) => {
          ie.target === ie.currentTarget && ee();
        },
        onKeyDownCapture: (ie) => {
          var v, x;
          if (!(typeof ((v = ie.target) == null ? void 0 : v.closest) == "function" ? ie.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ie.repeat && !ie.ctrlKey && !ie.altKey && !ie.metaKey && !ie.shiftKey && /^[1-9]$/.test(ie.key) && ((x = oe.current) != null && x.call(oe, Number(ie.key) - 1))) {
            ie.preventDefault(), ie.stopPropagation();
            return;
          }
          vt(ie, { onCancel: ee });
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
          n("button", { key: "close", type: "button", onClick: ee, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Kd, {
          videoId: p.id,
          targets: H,
          performerCandidates: g.performerCandidates || [],
          shortcutRef: oe,
          onSaved: async ({ beforeState: ie, afterState: A }) => {
            await M(
              "performer-slots.assign",
              `Assigned performers to ${H.length} segments`,
              ie,
              A
            ), ee(), P();
          },
          onConflict: P
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (te) => {
      G.current = te, I && (I.current = te);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(rn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n($r, { key: "derived" }) : null,
        t && re ? n("div", {
          key: "tag-editor",
          ref: b,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (te) => {
            te.key === "Escape" && (te.preventDefault(), te.stopPropagation(), z());
          },
          onKeyDown: (te) => {
            nd(te, t.tagName) && (te.preventDefault(), te.stopPropagation(), l(t.tagId));
          }
        }, n(Hn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (te, he) => te == null ? z() : l(te, he == null ? void 0 : he.label),
          disabled: hl(a, t.id, s) || ((ue = O.data) == null ? void 0 : ue.tagReadOnly) === !0,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        })) : t ? n("div", { key: "selected", className: "min-w-0 flex-1 truncate text-sm font-semibold text-foreground" }, t.tagName || "Tag segment") : n("div", { key: "none", className: "text-sm text-secondary" }, "No segment selected")
      ]),
      t ? n("div", { key: "timing-row", className: "flex items-center gap-2 font-mono text-xs text-secondary" }, [
        n("span", { key: "start" }, Ae(t.startSec)),
        t.endSec == null ? null : n("span", { key: "time-separator" }, "–"),
        t.endSec == null ? null : n("span", { key: "end" }, Ae(t.endSec))
      ]) : null,
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Gd, { status: c })) : null,
      t && m && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(hi, {
        assignments: u.map((te) => {
          const he = cd(te);
          return {
            key: String(te.slotDefinitionId),
            label: he.label,
            performer: he.filled ? { id: Number(te.performerId), name: he.performer } : null,
            title: he.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(_d, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: T
    }) : null,
    t ? n("div", { key: "controls", hidden: !0 }, [
      n("section", { key: "lineage", "aria-label": "Segment lineage", className: "rounded-md border border-border bg-surface p-2" }, [
        n("h3", { key: "heading", className: "text-[11px] font-semibold uppercase tracking-wide text-secondary" }, "Lineage"),
        O.loading ? n("p", { key: "loading", className: "mt-1 text-xs text-secondary" }, "Loading lineage…") : O.error ? n("p", { key: "error", className: "mt-1 text-xs text-secondary" }, O.error) : O.data ? n("div", { key: "details", className: "mt-1 space-y-1 text-xs text-secondary" }, [
          n(
            "p",
            { key: "summary" },
            `${O.data.derived ? "Derived segment" : "Root segment"} · ${O.data.componentSize} segment${O.data.componentSize === 1 ? "" : "s"} · ${O.data.integrityState}`
          ),
          (Y = O.data.parents) != null && Y.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...O.data.parents.map((te) => n("button", {
              key: te.nodeId,
              type: "button",
              onClick: () => _(te.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${te.ruleKey} ${te.ruleVersion}`))
          ]) : null,
          (me = O.data.children) != null && me.length ? n("p", { key: "children" }, `Children: ${O.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: h,
          type: "button",
          disabled: a != null || !m || u.length === 0,
          onClick: () => xe(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50",
          title: m ? u.length === 0 ? "No performer slots are defined for this segment tag." : "Assign performers; candidates matching each slot's gender hints are ranked first." : "Performer slot details are unavailable for your current access."
        }, u.length === 0 ? "No performer slots" : "Edit performer slots") : null,
        n("button", {
          key: "split",
          type: "button",
          disabled: a != null,
          onClick: $,
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Split at playhead"),
        n("button", {
          key: "duplicate",
          type: "button",
          disabled: a != null,
          onClick: () => R(!1),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate in place"),
        n("button", {
          key: "duplicate-at-playhead",
          type: "button",
          disabled: a != null,
          onClick: () => R(!0),
          className: "rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
        }, "Duplicate at playhead")
      ])
    ]) : null,
    fe && e && t && m && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (te) => {
        te.target === te.currentTarget && ee();
      },
      onKeyDownCapture: (te) => {
        var H, ie;
        if (!(typeof ((H = te.target) == null ? void 0 : H.closest) == "function" ? te.target.closest("input, textarea, select, [contenteditable='true']") : null) && !te.repeat && !te.ctrlKey && !te.altKey && !te.metaKey && !te.shiftKey && /^[1-9]$/.test(te.key) && ((ie = U.current) != null && ie.call(U, Number(te.key) - 1))) {
          te.preventDefault(), te.stopPropagation();
          return;
        }
        vt(te, {
          onCancel: ee,
          onConfirm: () => {
            var A;
            return (A = ce.current) == null ? void 0 : A.click();
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
        n("button", { key: "close", type: "button", onClick: ee, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Ud, {
        key: `${t.id}:${g.performerSlotsRevision || g.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (ae = g.performerSlotRevisions) == null ? void 0 : ae[t.id],
        performerCandidates: g.performerCandidates || [],
        confirmRef: ce,
        shortcutRef: U,
        onOptimisticSave: (te) => {
          k((he) => Vr(
            he,
            t.id,
            te
          ), p.id), V(), ne.current = w("slots", t.id), S("Saving performer slots…"), ee();
        },
        onSaved: async (te, { beforeState: he, afterState: H }) => {
          k((ie) => Vr(
            ie,
            t.id,
            te.slots || [],
            te.revision
          ), p.id), S("Performer slots saved.");
          try {
            await M(
              "performer-slots.assign",
              "Assigned performers",
              he,
              H
            ), await P(te) || C([t]);
          } finally {
            V();
          }
        },
        onRollback: async (te, he) => {
          C([t]), k((H) => {
            var ie;
            return Vr(
              H,
              t.id,
              te,
              (ie = g.performerSlotRevisions) == null ? void 0 : ie[t.id]
            );
          }, p.id), S(he.message || "Unable to save performer slots.");
          try {
            he.status === 409 && await P();
          } finally {
            V();
          }
        },
        onConflict: P
      }))
    ])) : null
  ]);
}
function gc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: m, onZoomChange: u, onSelectGroup: f, onToggleGroup: g, onSelect: p, onSelectSegments: h, onSelectAll: b, onConfigureTag: k, onSeekTime: S, centerRef: w, showReviewState: P = !0, swimlaneTitleWidth: M, onSwimlaneTitleWidthChange: C }) {
  const $ = ye(null), R = ye(null), [T, O] = B(0), [_, re] = B({ scrollTop: 0, height: 320 }), [z, I] = B(null), L = _e(
    () => tn(e, r, o),
    [e, r, o]
  ), G = _e(
    () => fi(o),
    [o]
  ), ne = _e(() => ho(L), [L]), V = _e(
    () => fd(ne, i, r.length > 0),
    [ne, i, r.length]
  ), J = _e(
    () => yi(V.rows, Math.max(0, _.scrollTop - 24), _.height),
    [V, _]
  ), ce = Math.max(0, Number(d) || 0), U = Ts(T), oe = fr(M, U), fe = oe / 16, xe = Cs(c, ce, fe), ee = Ss(ce), ue = ks(ce, Math.max(1, T - fe * 16), m), Y = ee.filter((x, y) => y === 0 || y % ue === 0), me = _e(() => L.map((x) => `${x.key}:${x.trackCount}:${x.markers.map(({ segment: y, track: N }) => `${y.id}:${y.startSec}:${y.endSec ?? ""}:${N}`).join(",")}`).join("|"), [L]);
  function ae() {
    const x = R.current;
    if (!x) return;
    const y = x.querySelector("[data-timeline-track]"), N = x.firstElementChild, D = y == null ? void 0 : y.getBoundingClientRect(), W = N == null ? void 0 : N.getBoundingClientRect(), K = D && W ? Math.max(0, D.left - W.left) : fe * 16, pe = (W == null ? void 0 : W.width) ?? x.scrollWidth;
    x.scrollTo({
      left: Is(c, ce, pe, x.clientWidth, K, Ka),
      behavior: "smooth"
    });
  }
  be(() => (w.current = ae, () => {
    w.current === ae && (w.current = null);
  })), be(() => {
    ae();
  }, [m]);
  function te() {
    const x = R.current, y = V.rows.find((pe) => pe.kind === "lane" && pe.lane.markers.some(({ segment: E }) => E.id === s));
    if (!x || !y) return;
    const N = 24, D = y.top + N, W = D + y.height;
    let K = x.scrollTop;
    D < x.scrollTop + N ? K = Math.max(0, D - N) : W > x.scrollTop + x.clientHeight && (K = Math.max(0, W - x.clientHeight)), K !== x.scrollTop && (x.scrollTop = K), re({ scrollTop: K, height: x.clientHeight });
  }
  be(() => {
    te();
  }, [s, me, V]), be(() => {
    const x = R.current, y = V.rows.find((pe) => pe.kind === "group" && pe.group.key === a);
    if (!x || !y) return;
    const N = 24, D = y.top + N, W = D + y.height;
    let K = x.scrollTop;
    D < x.scrollTop + N ? K = Math.max(0, D - N) : W > x.scrollTop + x.clientHeight && (K = Math.max(0, W - x.clientHeight)), K !== x.scrollTop && (x.scrollTop = K), re({ scrollTop: K, height: x.clientHeight });
  }, [a, V]), be(() => {
    const x = R.current;
    if (!x || typeof ResizeObserver > "u") return;
    const y = () => {
      O(x.clientWidth), re({ scrollTop: x.scrollTop, height: x.clientHeight }), te();
    }, N = new ResizeObserver(y);
    return N.observe(x), y(), () => N.disconnect();
  }, [s, me, V]);
  function he(x) {
    if (!(ce > 0)) return;
    const y = x.currentTarget.getBoundingClientRect(), N = Math.min(1, Math.max(0, (x.clientX - y.left) / y.width));
    S(N * ce);
  }
  function H(x) {
    const y = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let N = null;
    Object.hasOwn(y, x.key) && (N = c + y[x.key]), x.key === "Home" && (N = 0), x.key === "End" && (N = ce), N != null && (x.preventDefault(), x.stopPropagation(), S(Math.min(ce, Math.max(0, N))));
  }
  function ie(x) {
    var N;
    const y = (N = $.current) == null ? void 0 : N.getBoundingClientRect();
    y && C(fr(x.clientX - y.left, U));
  }
  function A(x) {
    const y = x.shiftKey ? 40 : 16;
    let N = null;
    x.key === "ArrowLeft" && (N = oe - y), x.key === "ArrowRight" && (N = oe + y), x.key === "Home" && (N = 160), x.key === "End" && (N = U), N != null && (x.preventDefault(), x.stopPropagation(), C(fr(N, U)));
  }
  const v = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: $,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (x) => {
          (x.metaKey || x.ctrlKey) && (x.preventDefault(), b == null || b());
        },
        onKeyDown: (x) => {
          x.key !== "Enter" && x.key !== " " || (x.preventDefault(), b == null || b());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: v, disabled: m <= 1, onClick: () => u(vr(m - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: v, disabled: m === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(m * 100)}%`),
      n("button", { key: "in", type: "button", className: v, disabled: m >= 8, onClick: () => u(vr(m + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: v, onClick: ae, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(U),
      "aria-valuenow": Math.round(oe),
      "aria-valuetext": `${Math.round(oe)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (x) => {
        x.currentTarget.setPointerCapture(x.pointerId), ie(x);
      },
      onPointerMove: (x) => {
        x.currentTarget.hasPointerCapture(x.pointerId) && ie(x);
      },
      onKeyDown: A,
      onDoubleClick: () => C(ht.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${oe - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: R,
      onScroll: (x) => re({
        scrollTop: x.currentTarget.scrollTop,
        height: x.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: $s(m) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${fe}rem minmax(0,1fr)`, height: "1.5rem" } }, [
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
          "aria-valuetext": Ae(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: he,
          onKeyDown: H
        }, Y.map((x, y) => n("span", {
          key: x,
          className: `absolute top-0 ${ws(y, Y.length, ce > 0 ? x / ce * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ns(y, Y.length, ce > 0 ? x / ce * 100 : 0)
        }, Ae(x))).concat(t.map((x) => {
          const y = ce > 0 ? x.startSec / ce * 100 : 0;
          return n("button", {
            key: `shot-boundary:${x.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(x.startSec)} – ${Ae(x.endSec)}`,
            title: `Shot boundary · ${x.source || "manual"} · ${Ae(x.startSec)} – ${Ae(x.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${y}%`, width: "2px" },
            onClick: (N) => {
              N.stopPropagation(), S(x.startSec);
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
            ...qo(xe),
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
        style: L.length > 0 ? { height: V.height } : void 0
      }, [
        L.length > 0 ? n("span", {
          key: "playhead",
          "data-timeline-playhead": "body",
          "aria-hidden": "true",
          className: "pointer-events-none absolute inset-y-0 z-30",
          style: {
            ...qo(xe, !0),
            width: "2px",
            backgroundColor: "var(--color-accent)"
          }
        }) : null,
        L.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : J.map((x) => {
          var Q;
          const y = x.group, N = i.includes(y.key), D = a === y.key, W = Nr(D);
          if (x.kind === "group") return n("div", {
            key: x.key,
            "data-segment-group": y.key,
            "data-segment-group-collapsed": N ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${fe}rem minmax(0,1fr)`,
              backgroundColor: W,
              top: x.top,
              height: x.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (q) => {
                if (q.metaKey || q.ctrlKey) {
                  h(y.lanes.flatMap((ge) => ge.markers.map((we) => we.segment.id)));
                  return;
                }
                f(y.key), g(y.key);
              },
              "aria-expanded": !N,
              "aria-current": D ? "true" : void 0,
              "data-selected-timeline-group": D ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: y.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: W
              },
              title: `${N ? "Expand" : "Collapse"} ${y.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, N ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, y.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              N ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${y.lanes.length} swimlane${y.lanes.length === 1 ? "" : "s"} hidden`
                ),
                P ? n(_t, { key: "states", counts: y.counts }) : null
              ] : null
            )
          ]);
          const K = x.lane, pe = Ql(x.laneIndex), E = K.markers.some(({ segment: q }) => q.id === s);
          return n("div", {
            key: x.key,
            "data-grouped-swimlane": y.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${fe}rem minmax(0,1fr)`,
              top: x.top,
              height: x.height,
              backgroundColor: pe
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": E ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: Zl(E, pe),
              title: `${qn(K)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": qn(K),
              onClick: (q) => {
                (q.metaKey || q.ctrlKey) && h(K.markers.map((ge) => ge.segment.id));
              },
              onMouseEnter: () => I(K.key),
              onMouseLeave: () => I((q) => q === K.key ? null : q)
            }, [
              K.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (q) => {
                  q.stopPropagation(), k({ tagId: K.tagId, tagName: K.label, trigger: q.currentTarget });
                },
                "aria-label": `Configure ${K.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: z === K.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, K.label),
              (Q = K.performers) != null && Q.length ? n(Cr, {
                key: "performers",
                performers: K.performers,
                performerAssignments: K.performerAssignments
              }) : null,
              P ? n(_t, { key: "counts", counts: K.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, K.markers.map(({ segment: q, track: ge }) => {
              var st;
              const we = Yr(q.startSec, ce), Be = q.endSec == null ? q.startSec : Math.max(q.startSec, q.endSec), Te = Math.max(0, Yr(Be, ce) - we), Xe = l.includes(q.id), Oe = q.id === s, Ie = bo(G.get(q.id)), Ee = q.endSec == null ? Ae(q.startSec) : `${Ae(q.startSec)} – ${Ae(q.endSec)}`, qe = (st = gi[Ie]) == null ? void 0 : st.label;
              return n("button", {
                key: q.id,
                type: "button",
                onClick: (Z) => {
                  Z.stopPropagation(), p(q, {
                    additive: Z.metaKey || Z.ctrlKey,
                    rangeSegmentIds: Z.shiftKey ? K.markers.map((de) => de.segment.id) : null
                  });
                },
                "aria-pressed": Xe,
                "aria-current": Oe ? "true" : void 0,
                "data-selected-timeline-marker": Oe ? "true" : void 0,
                "data-selected-segment-shortcut-target": Oe ? "true" : void 0,
                "aria-label": P ? `${q.tagName || "Tag segment"}${K.performerLabel ? `, ${K.performerLabel}` : ""}, ${q.reviewState}${qe ? `, ${qe}` : ""}, ${Ee}` : `${q.tagName || "Tag segment"}${K.performerLabel ? `, ${K.performerLabel}` : ""}, ${Ee}`,
                title: P ? `${q.tagName || "Tag segment"}${K.performerLabel ? ` · ${K.performerLabel}` : ""} · ${q.reviewState}${qe ? ` · ${qe}` : ""} · ${Ee}` : `${q.tagName || "Tag segment"}${K.performerLabel ? ` · ${K.performerLabel}` : ""} · ${Ee}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...P ? Vl(q.reviewState, Xe, Ie, Oe) : Jl(Xe, Oe),
                  left: `${we}%`,
                  top: `${Xl(ge)}rem`,
                  width: Yl(q.endSec, Te),
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
  const [a, s] = B(null), [l, d] = B([]), [c, m] = B(null), [u, f] = B(""), [g, p] = B(!0), [h, b] = B(null), [k, S] = B(""), [w, P] = B(!1), M = ye(null), C = ye(0);
  be(() => {
    const z = requestAnimationFrame(() => {
      var I;
      return (I = M.current) == null ? void 0 : I.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(z);
  }, [e]), be(() => {
    const z = new AbortController();
    return p(!0), S(""), Promise.all([
      r ? X(`/slot-definitions/${e}`, { signal: z.signal }) : Promise.resolve(null),
      X("/segment-groups", { signal: z.signal })
    ]).then(([I, L]) => {
      const G = L.find((ne) => (ne.tags || []).some((V) => Number(V.tagId) === Number(e)));
      s(I), d(L), m((G == null ? void 0 : G.id) ?? null), f(G == null ? "" : String(G.id)), P(!1);
    }).catch((I) => {
      I.name !== "AbortError" && S(I.message || "Unable to load tag configuration.");
    }).finally(() => {
      z.signal.aborted || p(!1);
    }), () => z.abort();
  }, [r, e]);
  function $(z, I) {
    s({
      ...a,
      definitions: a.definitions.map((L, G) => G === z ? { ...L, ...I } : L)
    });
  }
  function R(z, I) {
    const L = z + I;
    if (L < 0 || L >= a.definitions.length) return;
    const G = [...a.definitions];
    [G[z], G[L]] = [G[L], G[z]], s({
      ...a,
      definitions: G.map((ne, V) => ({ ...ne, sortOrder: V }))
    });
  }
  function T(z) {
    const I = a.definitions[z], L = Number(I.assignmentCount) || 0, G = L === 0 ? "" : ` and its ${L} assignment${L === 1 ? "" : "s"}`;
    window.confirm(`Delete “${bt(I)}”${G}?`) && (L > 0 && P(!0), s({
      ...a,
      definitions: a.definitions.filter((ne, V) => V !== z).map((ne, V) => ({ ...ne, sortOrder: V }))
    }));
  }
  async function O() {
    var I;
    b("slots"), S("Saving performer slots…");
    let z;
    try {
      z = await X(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: w,
          definitions: a.definitions.map((L, G) => {
            var ne;
            return {
              id: L.id || void 0,
              label: ((ne = L.label) == null ? void 0 : ne.trim()) || null,
              sortOrder: G,
              genderHints: L.genderHints || []
            };
          })
        })
      }), s(z), P(!1);
    } catch (L) {
      L.status === 409 ? (S("Performer slots changed elsewhere; current values were reloaded."), (I = L.payload) != null && I.current && (s(L.payload.current), P(!1))) : S(L.message || "Unable to save performer slots."), b(null);
      return;
    }
    try {
      await o(), S("Performer slots saved.");
    } catch {
      S("Performer slots saved, but the editor could not be refreshed.");
    } finally {
      b(null);
    }
  }
  async function _() {
    const z = u === "" ? null : Number(u);
    if (z !== c) {
      b("group"), S("Saving tag group…");
      try {
        await X(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: z })
        });
      } catch (I) {
        S(I.message || "Unable to assign the tag group."), b(null);
        return;
      }
      try {
        const [I, L] = await Promise.allSettled([
          X("/segment-groups"),
          o()
        ]);
        if (I.status === "fulfilled") {
          d(I.value);
          const G = I.value.find((V) => (V.tags || []).some((J) => Number(J.tagId) === Number(e))), ne = (G == null ? void 0 : G.id) ?? null;
          m(ne), f(ne == null ? "" : String(ne));
        }
        S(
          I.status === "fulfilled" && L.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        b(null);
      }
    }
  }
  l.find((z) => Number(z.id) === Number(c));
  const re = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (z) => {
      z.target === z.currentTarget && !h && i();
    },
    onKeyDownCapture: (z) => vt(z, {
      onCancel: h ? void 0 : i
    })
  }, n("section", {
    ref: M,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Mt,
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
        g ? null : n("label", { key: "choice", className: "block space-y-1 text-xs text-secondary" }, [
          n("span", { key: "label" }, "Assigned group"),
          n("select", {
            key: "select",
            value: u,
            disabled: h != null,
            onChange: (z) => f(z.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((z) => n("option", { key: z.id, value: String(z.id) }, z.name))
          ])
        ]),
        g ? null : n("button", {
          key: "save",
          type: "button",
          disabled: h != null || (u === "" ? null : Number(u)) === c,
          onClick: _,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, h === "group" ? "Saving…" : "Save tag group")
      ]),
      r ? n("section", { key: "slots", className: "space-y-3 border-t border-border pt-5", "aria-labelledby": "inline-tag-slots-heading" }, [
        n("div", { key: "heading" }, [
          n("h3", { key: "title", id: "inline-tag-slots-heading", className: "text-sm font-semibold text-foreground" }, "Performer slots"),
          n("p", { key: "copy", className: "text-xs text-secondary" }, "Define the ordered performer roles used by this tag.")
        ]),
        g ? n("p", { key: "loading", className: "rounded-md border border-dashed border-border p-4 text-sm text-secondary" }, "Loading performer slots…") : a ? n("div", { key: "editor", className: "space-y-3" }, [
          n("label", { key: "duplicates", className: "flex items-center gap-2 text-sm" }, [
            n("input", {
              key: "input",
              type: "checkbox",
              checked: !!a.allowSamePerformerInMultipleSlots,
              disabled: h != null,
              onChange: (z) => s({ ...a, allowSamePerformerInMultipleSlots: z.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((z, I) => n("article", {
            key: z.id || z._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: z.label || "",
                disabled: h != null,
                onChange: (L) => $(I, { label: L.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, bs.map((L) => n("label", { key: L, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: h != null,
                  checked: (z.genderHints || []).includes(L),
                  onChange: (G) => $(I, {
                    genderHints: G.target.checked ? [.../* @__PURE__ */ new Set([...z.genderHints || [], L])] : (z.genderHints || []).filter((ne) => ne !== L)
                  })
                }),
                n("span", { key: "text" }, Ir(L))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${z.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: h != null || I === 0, onClick: () => R(I, -1), className: re, "aria-label": `Move ${bt(z)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: h != null || I === a.definitions.length - 1, onClick: () => R(I, 1), className: re, "aria-label": `Move ${bt(z)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: h != null, onClick: () => T(I), className: `${re} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++C.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: re
            }, "Add slot"),
            n("button", {
              key: "save",
              type: "button",
              disabled: h != null,
              onClick: O,
              className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
            }, h === "slots" ? "Saving…" : "Save performer slots")
          ])
        ]) : null
      ]) : null,
      k ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, k) : null
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
function pc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function fc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: m, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: g, canMoveSelectionToBin: p, captureTrainingExport: h, centerTimelineRef: b, closeEditorFilters: k, closeFirstSegmentTagDialog: S, closeMaterializeDialog: w, closeMergeConfirmation: P, closePublishApprovedDialog: M, closeTagEditing: C, collapsedSegmentGroups: $, commonActionsRef: R, compatibilityMode: T, configuringTag: O, createSegment: _, creatingSegmentId: re, currentTime: z, deleteRejectedSegments: I, detail: L, detailPanelRef: G, detailWidth: ne, duplicateSegment: V, editorFilters: J, editorLayout: ce, editorRef: U, exportingExamples: oe, filtersButtonRef: fe, filtersOpen: xe, firstSegmentTagOpen: ee, focusRowRef: ue, handleSeparatorKeyDown: Y, handleSeparatorPointerDown: me, handleSeparatorPointerMove: ae, hasNextUnreviewed: te, hasPreviousUnreviewed: he, hideDerivedSegments: H, history: ie, historyOpen: A, historySaving: v, horizontalLayoutSize: x, importNativeSegments: y, incorrectExamples: N, incorrectExamplesOpen: D, lineage: W, markerRailWidth: K, materializeButtonRef: pe, materializeCancelButtonRef: E, materializeDerivedSegments: Q, materializeError: q, materializeLoading: ge, materializeOpen: we, materializePreview: Be, materializing: Te, mediaStackRef: Xe, mergeCancelButtonRef: Oe, mergeConfirmation: Ie, mergeSaving: Ee, mergeSelectedSwimlane: qe, nativeImportState: st, onDetailChange: Z, onNavigate: de, onReload: Me, onSlotsChanged: We, openPublishApprovedDialog: ve, panelSeparatorProps: ze, pendingInitialSeekRef: Qe, performerSlots: ke, performerSlotsAvailable: Se, playbackControlsRef: Ve, previewDerivedSegments: He, provenance: Ne, provenanceSources: tt, publishApprovedCancelButtonRef: Le, publishApprovedDrafts: Fe, publishApprovedError: Re, publishApprovedOpen: Ke, quickSearchOpen: Et, railScrollRef: Ge, railToggleRef: wt, recordHistoryAction: hn, rejectedDeletionPreview: lt, removeIncorrectExample: $e, removingExampleId: Ce, restoreHistoryTarget: Je, runEditorAction: xt, saveMessage: nt, saveTag: Gt, saveTiming: mt, savingSegmentId: it, seekRef: Nt, segmentGroups: Ut, segmentRailLayout: Tr, segments: Kt, selectAllVideoSegments: on, selectSegment: an, selectSegmentCollection: vn, selectedGroups: xn, selectedPerformerSlots: Ar, selectedSegment: Dt, selectedSegmentGroupKey: Wt, selectedSegmentIds: Sn, selectedSegments: Ot, selectedSlotStatus: Vt, setAutoAssignError: sn, setAutoAssignOpen: kn, setConfiguringTag: Qn, setCurrentTime: Zn, setEditorFilters: Rr, setEditorLayout: wn, setFiltersOpen: Nn, setHideDerivedSegments: Xn, setHistoryOpen: Jt, setIncorrectExamplesOpen: er, setQuickSearchOpen: In, setRailViewport: Cn, setRejectedDeletionPreview: Yt, setSaveMessage: $n, setSelectedSegmentGroupKey: ln, setSelectedSegmentId: gt, setShortcutsOpen: Tn, setTimelineZoom: An, shotBoundaries: tr, shortcutsOpen: nr, slotButtonRef: Rn, splitLayout: It, splitSegment: Mr, startFullAnalysis: rr, stepVideoFrame: or, tagEditing: Mn, tagSearchRef: En, timelineDuration: Dn, timelineRatioBounds: et, timelineZoom: rt, toggleSegmentGroup: ar, toggleSegmentRail: Er, updateTimelineRatio: Ct, video: Ye, videoPerformers: ir, visibleCounts: On, visibleSegmentRailRows: Pn, visibleSegments: dn, wideLayout: zt, workspaceRef: Dr } = e, Ln = _e(
    () => Kt.filter((j) => !j.published && j.reviewState === "approved"),
    [Kt]
  ), sr = gs(so), Fn = Ln.length, Qt = Be ? Be.createCount + Be.linkCount : null, dt = it != null, Zt = Ot.length > 0, jn = Ot.length === 1, Or = Zt && Ot.every((j) => j.reviewState === "approved"), Pr = Zt && Ot.every((j) => j.reviewState === "rejected"), Lr = [
    { id: "marker.create", label: "New segment", disabled: dt },
    { id: "marker.editTag", label: "Edit tag", disabled: dt || !Zt },
    { id: "marker.setStart", label: "Set start", disabled: dt || !jn },
    { id: "marker.setEnd", label: "Set end", disabled: dt || !jn },
    { id: "marker.split", label: "Split", disabled: dt || !jn },
    ...T ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !he, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Or ? "Unapprove" : "Approve", disabled: dt || !Zt, tone: "approve" },
      { id: "marker.reject", label: Pr ? "Unreject" : "Reject", disabled: dt || !Zt, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !te, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...T ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: dt || !p, tone: "reject" }
    ]
  ];
  function pt(j) {
    const Pe = Sn.includes(j.id), ct = j.id === (Dt == null ? void 0 : Dt.id), ut = j.endSec == null ? Ae(j.startSec) : `${Ae(j.startSec)} – ${Ae(j.endSec)}`, Lt = `${Rt(j.sourceKey)}${j.confidence != null ? ` · ${Math.round(j.confidence * 100)}%` : ""}`;
    return n("button", {
      key: j.id,
      type: "button",
      onClick: (Ft) => an(j, { additive: Ft.metaKey || Ft.ctrlKey }),
      "aria-pressed": Pe,
      "aria-current": ct ? "true" : void 0,
      "data-selected-segment-shortcut-target": ct ? "true" : void 0,
      "aria-label": T ? `${j.tagName || "Tag segment"}, ${j.reviewState}${j.isDerived ? ", derived segment" : ""}, ${ut}` : `${j.tagName || "Tag segment"}${j.isDerived ? ", derived segment" : ""}, ${ut}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: mi(Pe, ct)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        T ? n(rn, { key: "review", state: j.reviewState, includeLabel: !1 }) : null,
        j.isDerived ? n($r, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          j.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ut),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Lt
        }, Lt)
      ])
    ]);
  }
  const Pt = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", se = [...ie.actions || []].reverse().find((j) => j.sequence <= ie.cursorSequence);
  return n("section", {
    ref: U,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${It ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (j) => Si(j, de, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${Ye.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: Ye.title || `Video ${Ye.id}`
          }, Ye.title || `Video ${Ye.id}`)),
          ...ir.map((j) => n(Wn, {
            key: at(j),
            performer: { id: at(j), name: j.name },
            compact: !0,
            tooltip: j.name
          })),
          T ? n(_t, { key: "review-counts", counts: On }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          T ? null : n(Ni, { key: "bin", onNavigate: de, compact: !0 }),
          n(Ii, { key: "settings", onNavigate: de, compact: !0 })
        ])
      ]),
      T && L.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${L.nativeImportCount} Cove segment${L.nativeImportCount === 1 ? "" : "s"} ${L.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        st.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, st.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => y("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => y("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        st.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, st.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          T ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => rr(),
              title: (s == null ? void 0 : s.error) || "Run AI tagging and shot boundary analysis into the Full review workflow",
              className: "segment-studio-full-scan-run inline-flex items-center justify-center bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
            }, (s == null ? void 0 : s.configured) === !1 ? "Full Scan not configured" : (s == null ? void 0 : s.ready) === !1 ? "Full Scan unavailable" : (a == null ? void 0 : a.status) === "queued" ? "Full Scan queued…" : (a == null ? void 0 : a.status) === "running" ? "Full Scan running…" : "Full Scan"),
            n("details", { key: "choices", className: "relative flex" }, [
              n("summary", {
                key: "summary",
                "aria-label": "Choose Full Scan analyses",
                "aria-disabled": (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                title: "Choose analyses",
                onClick: (j) => {
                  ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && j.preventDefault();
                },
                onKeyDown: (j) => {
                  (j.key === "Enter" || j.key === " ") && ((s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running") && j.preventDefault();
                },
                className: `segment-studio-full-scan-arrow inline-flex list-none items-center justify-center border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${(s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running" ? "pointer-events-none cursor-default opacity-50" : "cursor-pointer hover:opacity-90"}`
              }, n(Pa, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([j, Pe]) => n("button", {
                key: j,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (ct) => {
                  var ut;
                  (ut = ct.currentTarget.closest("details")) == null || ut.removeAttribute("open"), rr(Pe);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, j)))
            ])
          ]) : null,
          T ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: it != null || d.length === 0,
            onClick: () => {
              sn(""), kn(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          T ? n("button", {
            key: "materialize-derived",
            ref: pe,
            type: "button",
            disabled: it != null || ge || Te || Qt === 0,
            onClick: He,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, ge ? "Analyzing…" : `Auto-Materialize${Qt != null ? ` (${Qt})` : ""}`) : null,
          T ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: it != null || Fn === 0,
            onClick: (j) => ve(j.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": Ke,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${Fn ? ` (${Fn})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: oe || Ce != null || N.length === 0,
            onClick: () => er(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": D,
            "aria-label": `Open AI feedback collection, ${N.length} example${N.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${N.length ? ` (${N.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: fe,
            type: "button",
            onClick: () => Nn(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": xe,
            className: `${Pt} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(gr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => Tn(!0),
            className: Pt
          }, [n(gr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: (T ? ie.actions.length === 0 : se == null) || it != null || v,
            onClick: T ? () => Jt((j) => !j) : () => Je(
              se.sequence - 1
            ),
            "aria-haspopup": T ? "dialog" : void 0,
            "aria-expanded": T ? A : void 0,
            className: Pt
          }, [
            n(gr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, T ? `History${ie.actions.length ? ` (${ie.actions.length})` : ""}` : se ? `Undo ${se.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: wt,
            type: "button",
            onClick: Er,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": ce.markerRailOpen,
            className: Pt
          }, [
            n(gr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, ce.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    T && A ? n("section", {
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
          onClick: () => Jt(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...ie.actions].reverse().map((j) => n("button", {
          key: j.sequence,
          type: "button",
          disabled: v,
          onClick: () => Je(j.sequence),
          "aria-current": ie.cursorSequence === j.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${j.sequence > ie.cursorSequence ? "text-secondary" : "text-foreground"} ${ie.cursorSequence === j.sequence ? "bg-accent/15" : ""}`
        }, [
          n("span", { key: "label", className: "min-w-0 flex-1 truncate" }, j.label),
          n("time", {
            key: "time",
            dateTime: j.createdAt,
            className: "shrink-0 text-[10px] text-secondary"
          }, new Date(j.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))
        ])),
        n("button", {
          key: "baseline",
          type: "button",
          disabled: v,
          onClick: () => Je(ie.baselineSequence),
          "aria-current": ie.cursorSequence === ie.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${ie.cursorSequence === ie.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    xe ? n(tc, {
      key: "editor-filters",
      filters: J,
      hideDerivedSegments: H,
      performers: ir,
      provenanceSources: tt,
      reviewCounts: l,
      segments: Kt,
      segmentGroups: Ut,
      reviewMode: T,
      onChange: Rr,
      onHideDerivedChange: Xn,
      onClose: k
    }) : null,
    ee ? n(ec, {
      key: "first-segment-tag-dialog",
      saving: it != null,
      error: nt,
      onSelect: (j, Pe) => _(j, Pe),
      onClose: S
    }) : null,
    Et ? n(oc, {
      key: "quick-search-dialog",
      segments: Bl(o),
      onSelect: (j) => {
        In(!1), an(j, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        In(!1), requestAnimationFrame(() => {
          var j;
          return (j = U.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    m ? n(sc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => kn(!1)
    }) : null,
    Ie ? n(dc, {
      key: "merge-selection-dialog",
      merge: Ie,
      processing: Ee,
      undoable: !T,
      cancelButtonRef: Oe,
      onConfirm: (j) => qe(!0, j, Ie),
      onClose: P
    }) : null,
    we ? n(uc, {
      key: "materialize-derived-dialog",
      preview: Be,
      loading: ge,
      processing: Te,
      error: q,
      cancelButtonRef: E,
      onConfirm: Q,
      onClose: () => {
        Te || w();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: Dr,
      className: `${It ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      ce.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: zt ? { position: "absolute", top: 0, right: 0, width: K, height: x.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        Kt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : dn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Ge,
          onScroll: (j) => Cn({
            scrollTop: j.currentTarget.scrollTop,
            height: j.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: Tr.height }
        }, Pn.map((j) => {
          var ct;
          let Pe;
          if (j.kind === "group") {
            const ut = $.includes(j.group.key), Lt = j.group.lanes.reduce((Ft, lr) => Ft + lr.markers.length, 0);
            Pe = n("button", {
              type: "button",
              onClick: () => {
                ln(j.group.key), ar(j.group.key);
              },
              "aria-expanded": !ut,
              "aria-current": Wt === j.group.key ? "true" : void 0,
              "data-segment-rail-group": j.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Wt === j.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ut ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: j.group.name }, j.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Lt),
              T && ut ? n(_t, { key: "states", counts: j.group.counts }) : null
            ]);
          } else j.kind === "lane" ? Pe = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: qn(j.lane),
            "aria-label": qn(j.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, j.lane.label),
            (ct = j.lane.performers) != null && ct.length ? n(Cr, {
              key: "performers",
              performers: j.lane.performers,
              performerAssignments: j.lane.performerAssignments
            }) : null,
            T ? n(_t, { key: "states", counts: j.lane.counts }) : null
          ]) : Pe = pt(j.segment);
          return n("div", {
            key: j.key,
            className: "absolute left-0 right-0",
            style: { top: j.top, height: j.height }
          }, Pe);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${It ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: Xe,
          className: `${It ? "min-h-0 flex-1" : ""} grid`,
          style: It ? {
            gridTemplateRows: `minmax(16rem, ${(1 - ce.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${ce.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: ue,
            className: "grid min-h-0 gap-2",
            style: zt ? {
              gridTemplateColumns: ce.markerRailOpen ? `${ne}px 0.5rem minmax(0,1fr) 0.5rem ${K}px` : `${ne}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(mc, {
              key: "tools",
              compatibilityMode: T,
              selectedSegment: Dt,
              selectedSegments: Ot,
              selectedGroups: xn,
              saveMessage: nt,
              savingSegmentId: it,
              creatingSegmentId: re,
              acquireSaveLock: t,
              setSaveMessage: $n,
              saveTag: Gt,
              slotStatus: Vt,
              performerSlotsAvailable: Se,
              selectedPerformerSlots: Ar,
              performerSlots: ke,
              detail: L,
              onDetailChange: Z,
              onCancelQueuedReview: g,
              video: Ye,
              slotButtonRef: Rn,
              tagSearchRef: En,
              tagEditing: Mn,
              onCancelTagEditing: C,
              detailPanelRef: G,
              onReduceSelection: (j) => {
                an(j), requestAnimationFrame(() => {
                  var Pe;
                  return (Pe = G.current) == null ? void 0 : Pe.focus({ preventScroll: !0 });
                });
              },
              saveTiming: mt,
              onSlotsChanged: We,
              onRecordHistory: hn,
              splitSegment: Mr,
              duplicateSegment: V,
              provenance: Ne,
              lineage: W,
              onNavigateLineageItem: (j) => {
                const Pe = Kt.find((ct) => ct.itemId === j);
                Pe && gt(Pe.id);
              }
            }),
            zt ? n(
              "div",
              { key: "detail-separator", ...ze("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            Ye.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ra, {
                streamUrl: `/api/stream/video/${Ye.id}`,
                posterUrl: `/api/stream/video/${Ye.id}/screenshot?v=${encodeURIComponent(Ye.updatedAt || "")}`,
                format: Ye.videoFile.format,
                audioCodec: Ye.videoFile.audioCodec,
                duration: Ye.videoFile.duration,
                videoId: Ye.id,
                trackingEnabled: !1,
                onSeekRegister: (j) => {
                  Nt.current = j, Pl(Qe.current, Kt, j) && (Qe.current = null);
                },
                onPlaybackControlRegister: (j) => {
                  Ve.current = j;
                },
                onTimeUpdate: Zn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            zt && ce.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...ze("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            zt && ce.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: R,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Lr.map((j) => {
              var ut;
              const Pe = (ut = sr[j.id]) == null ? void 0 : ut[0], ct = j.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : j.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: j.id,
                type: "button",
                disabled: j.disabled,
                "data-action-id": j.id,
                onClick: (Lt) => {
                  const Ft = Lt.currentTarget;
                  xt(j.id, { target: Ft, preserveFocus: !0 }), j.focusWhenDisabled && requestAnimationFrame(() => {
                    pc(Ft, R.current, j.focusWhenDisabled);
                  });
                },
                title: Pe ? `${j.label} (${Pe})` : j.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${ct}`
              }, [
                n("span", { key: "label" }, j.label),
                Pe ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, Pe) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !Ye.videoFile,
                onClick: () => or(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(ps, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !Ye.videoFile,
                onClick: () => or(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(fs, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          It ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(et.minimum * 100),
            "aria-valuemax": Math.round(et.maximum * 100),
            "aria-valuenow": Math.round(ce.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(ce.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: me,
            onPointerMove: ae,
            onKeyDown: Y,
            onDoubleClick: () => Ct(ht.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: It ? void 0 : { height: "20rem" } }, n(gc, {
            segments: dn,
            shotBoundaries: tr,
            segmentGroups: Ut,
            performerSlots: ke,
            collapsedGroupKeys: $,
            selectedGroupKey: Wt,
            selectedSegmentId: Dt == null ? void 0 : Dt.id,
            selectedSegmentIds: Sn,
            duration: Dn,
            currentTime: z,
            zoom: rt,
            onZoomChange: An,
            onSelectGroup: ln,
            onToggleGroup: ar,
            onSelect: (j, Pe) => an(j, Pe),
            onSelectSegments: vn,
            onSelectAll: on,
            onConfigureTag: (j) => Qn(j),
            onSeekTime: (j) => {
              var Pe;
              return (Pe = Nt.current) == null ? void 0 : Pe.call(Nt, j, !1);
            },
            centerRef: b,
            showReviewState: T,
            swimlaneTitleWidth: ce.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (j) => wn((Pe) => ({ ...Pe, swimlaneTitleWidth: j }))
          }))
        ])
      ])
    ]),
    O ? n(xo, {
      key: `configure-tag:${O.tagId}`,
      tagId: O.tagId,
      tagName: O.tagName,
      performerSlotsEnabled: T,
      onSaved: Me,
      onClose: () => {
        const j = O.trigger;
        Qn(null), requestAnimationFrame(() => {
          var Pe;
          j != null && j.isConnected ? j.focus({ preventScroll: !0 }) : (Pe = U.current) == null || Pe.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Ke ? n(ic, {
      key: "publish-approved-dialog",
      drafts: Ln,
      processing: it === -1,
      error: Re,
      cancelButtonRef: Le,
      onConfirm: Fe,
      onClose: M
    }) : null,
    lt ? n(lc, {
      key: "rejected-deletion-dialog",
      preview: lt,
      onConfirm: () => {
        I(lt), requestAnimationFrame(() => {
          var j;
          return (j = U.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Yt(null), requestAnimationFrame(() => {
          var j;
          return (j = U.current) == null ? void 0 : j.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    nr ? n(nc, {
      key: "shortcuts-dialog",
      reviewMode: T,
      bindings: sr,
      onClose: () => Tn(!1)
    }) : null,
    D ? n(rc, {
      key: "incorrect-examples-dialog",
      examples: N,
      exporting: oe,
      removingExampleId: Ce,
      onExport: h,
      onRemove: $e,
      onClose: () => er(!1)
    }) : null
  ]);
}
function yc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: m, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: g, setSaveMessage: p, setSelectedSegmentGroupKey: h, setSelectedSegmentId: b, setSelectedSegmentIds: k } = e;
  function S($) {
    const R = Tt(t, $);
    R && u((T) => vi(T, R));
  }
  function w($) {
    b($), k($ == null ? [] : [$]), c.current = $, m.current = [];
  }
  function P($, {
    focusEditor: R = !1,
    seekToSegment: T = !1,
    additive: O = !1,
    rangeSegmentIds: _ = null
  } = {}) {
    var z, I;
    const re = Us({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: m.current
    }, $.id, _, O);
    k(re.selectedSegmentIds), b(re.activeSegmentId), c.current = re.anchorSegmentId, m.current = re.rangeBaseSegmentIds, re.activeSegmentId != null && h(Tt(t, re.activeSegmentId)), S($.id), R && ((z = r.current) == null || z.focus({ preventScroll: !0 })), T && ((I = i.current) == null || I.call(i, $.startSec, !1));
  }
  function M($) {
    const R = Bs(
      d,
      l,
      $
    );
    k(R.selectedSegmentIds), b(R.activeSegmentId), c.current = R.activeSegmentId, m.current = [], R.activeSegmentId != null && (h(Tt(t, R.activeSegmentId)), S(R.activeSegmentId));
  }
  function C() {
    var T;
    const $ = zs(s), R = $.includes(l) ? l : $[0] ?? null;
    f(kt({})), g(!1), k($), b(R), c.current = R, m.current = [], R != null && h(Tt(
      tn(s, a, o),
      R
    )), p($.length === 0 ? "There are no segments to select." : `${$.length} segments selected. Collapsed Segment groups keep their selected segments.`), (T = r.current) == null || T.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: S, replaceSegmentSelection: w, selectSegment: P, selectSegmentCollection: M, selectAllVideoSegments: C };
}
function bc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, getSaveQueueSnapshot: s, historyRef: l, onConflict: d, onDetailChange: c, onReload: m, pendingReviewStateRef: u, recordHistoryAction: f, revealSegmentGroupForSelection: g, savingSegmentId: p, selectedGroups: h, selectedSegment: b, selectedSegmentIdRef: k, selectedSegments: S, selectionAnchorIdRef: w, selectionRangeBaseIdsRef: P, setMergeConfirmation: M, setSaveMessage: C, setSelectedSegmentId: $, setSelectedSegmentIds: R, video: T } = e;
  function O() {
    M(null), requestAnimationFrame(() => {
      var z;
      return (z = a.current) == null ? void 0 : z.focus({ preventScroll: !0 });
    });
  }
  async function _(z = !1, I = !1, L = null) {
    if (p != null) return;
    const G = L || bi(
      h,
      { nativeOnly: !o }
    );
    if (!G) {
      C("Select at least two segments from one swimlane.");
      return;
    }
    if (!z && _a()) {
      M(G);
      return;
    }
    I && qa(!1);
    const ne = r("merge", G.segments[0].id);
    if (!ne) return;
    O();
    const V = G.endSec == null ? "open end" : Ae(G.endSec);
    let J = G.segments[0];
    const ce = o ? null : St(G.segments, !1), U = o ? null : crypto.randomUUID(), oe = G.segments.map((xe) => xe.id), fe = Rd(i, G.segments);
    c(fe, T.id), R([J.id]), $(J.id), w.current = J.id, P.current = [];
    try {
      const xe = G.segments.slice(1);
      if (!o || J.nativeSegmentId != null) {
        const ee = xe.map((Y) => {
          const me = `merge-native-selection:${T.id}:${J.id}:${Y.id}:${J.updatedAt}:${Y.updatedAt}`;
          return { key: me, operationId: je(me), segmentId: Y.id, expectedUpdatedAt: Y.updatedAt };
        }), ue = await X(`/videos/${T.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: J.id,
            expectedSurvivorUpdatedAt: J.updatedAt,
            consumedSegments: ee.map(({ key: Y, ...me }) => me),
            historyReceiptId: U
          })
        });
        J = ue.survivor, c((Y) => ca(Y, ue), T.id), ee.forEach(({ key: Y }) => Ue(Y));
      } else {
        const ee = xe.map((Y) => {
          const me = `merge-draft-selection:${T.id}:${J.itemId}:${Y.itemId}:${J.revision}:${Y.revision}`;
          return { key: me, operationId: je(me), itemId: Y.itemId, expectedRevision: Y.revision };
        }), ue = await X(`/videos/${T.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: J.itemId,
            expectedSurvivorRevision: J.revision,
            consumedDrafts: ee.map(({ key: Y, ...me }) => me)
          })
        });
        J = ue.survivor, c((Y) => ca(Y, ue), T.id), ee.forEach(({ key: Y }) => Ue(Y));
      }
      R([J.id]), $(J.id), w.current = J.id, P.current = [], o ? t(jt) : await f(
        "segments.merge",
        `Merged ${G.segments.length} segments`,
        ce,
        St([J], !1),
        U
      ), g(J.id), C(`${G.segments.length} segments merged into ${Ae(G.startSec)} – ${V}.`);
    } catch (xe) {
      c((ee) => xi(
        Vn(ee, [G.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        G.segments.slice(1)
      ), T.id), R(oe), $((b == null ? void 0 : b.id) ?? oe[0] ?? null), w.current = (b == null ? void 0 : b.id) ?? oe[0] ?? null, P.current = [], xe.status === 409 ? await d() : C(xe.message || "Unable to merge selected segments.");
    } finally {
      ne();
    }
  }
  async function re(z, I = S, L = b) {
    var xe;
    if (I.length === 0) return;
    const G = s();
    if (Zr(G, "review")) return;
    if (yr(G) != null) {
      u.current.push(ml(
        z,
        I,
        L
      )), C(`${z === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const ne = ul(I, z), V = I.filter((ee) => ee.reviewState !== ne);
    if (V.length === 0) return;
    const J = I.map((ee) => ({
      id: ee.id,
      itemId: ee.itemId,
      nativeSegmentId: ee.nativeSegmentId
    })), ce = J.find((ee) => ee.id === (L == null ? void 0 : L.id)) || J[0], U = (ee, ue = !1) => {
      if (!(ee != null && ee.segments) || !ue && !eo(k.current, ce.id))
        return;
      const Y = J.map((ae) => Ze(ee == null ? void 0 : ee.segments, ae)).filter(Boolean), me = Ze(ee == null ? void 0 : ee.segments, ce) || Y[0] || null;
      R(Y.map((ae) => ae.id)), $((me == null ? void 0 : me.id) ?? null), w.current = (me == null ? void 0 : me.id) ?? null, P.current = [];
    }, oe = r("review", (L == null ? void 0 : L.id) ?? V[0].id);
    if (!oe) return;
    C(`Updating ${V.length} selected segment${V.length === 1 ? "" : "s"}…`);
    const fe = wr(
      i,
      V.map((ee) => ee.id),
      { reviewState: ne }
    );
    c(fe, T.id);
    try {
      const ee = await X(`/videos/${T.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: l.current.revision,
          reviewState: ne,
          segments: I.map((ae) => ae.published ? {
            nativeSegmentId: ae.nativeSegmentId,
            expectedUpdatedAt: ae.updatedAt
          } : {
            itemId: ae.itemId,
            expectedRevision: ae.revision
          })
        })
      }), ue = new Map((ee.items || []).map((ae) => [
        ae.requestedNativeSegmentId != null ? `native:${ae.requestedNativeSegmentId}` : `item:${ae.requestedItemId}`,
        ae
      ]));
      if (J.forEach((ae) => {
        const te = ue.get(ae.nativeSegmentId != null ? `native:${ae.nativeSegmentId}` : `item:${ae.itemId}`);
        te && (ae.nativeSegmentId = te.nativeSegmentId, ae.itemId = te.itemId);
      }), ee.history && t(ee.history), ne === "rejected" || (ee.items || []).some((ae) => ae.requestedNativeSegmentId != null && ae.nativeSegmentId !== ae.requestedNativeSegmentId)) {
        U(await m()), C(`${ee.updatedCount} selected segment${ee.updatedCount === 1 ? "" : "s"} ${ne === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const me = (ae) => ({
        ...ae,
        approvedSetVersion: ee.approvedSetVersion || ae.approvedSetVersion,
        segments: (ae.segments || []).map((te) => {
          const he = ue.get(te.nativeSegmentId != null ? `native:${te.nativeSegmentId}` : `item:${te.itemId}`);
          return he ? {
            ...te,
            id: he.nativeSegmentId != null ? he.nativeSegmentId : -he.itemId,
            itemId: he.itemId,
            nativeSegmentId: he.nativeSegmentId,
            published: he.nativeSegmentId != null,
            reviewState: ne,
            revision: he.nativeSegmentId != null ? te.revision : he.revision,
            updatedAt: he.updatedAt
          } : te;
        })
      });
      c(me, T.id), U(me(i)), C(`${ee.updatedCount} selected segment${ee.updatedCount === 1 ? "" : "s"} ${ne === "approved" ? "approved" : ne === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (ee) {
      c((Y) => Vn(
        Y,
        V,
        ["reviewState"]
      ), T.id), ee.status === 409 && ((xe = ee.payload) != null && xe.currentHistory) && t(ee.payload.currentHistory);
      const ue = ee.status === 409 ? await d() : i;
      U(ue, !0), C(ee.message || "Unable to update the selected segments.");
    } finally {
      oe();
    }
  }
  return { closeMergeConfirmation: O, mergeSelectedSwimlane: _, saveSelectedReviewState: re };
}
function hc(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: m, detail: u, editorFilters: f, editorRef: g, exportingExamples: p, hideDerivedSegments: h, heldCreatedSegmentTag: b, incorrectExamples: k, lineage: S, materializeButtonRef: w, materializePreview: P, materializeRestoreFocusRef: M, materializing: C, mutateSegment: $, onConflict: R, onDetailChange: T, onReload: O, performerSlots: _, recordHistoryAction: re, refreshMaterializationPreview: z, removingExampleId: I, revealSegmentGroupForSelection: L, savingSegmentId: G, segmentGroups: ne, segments: V, selectedSegment: J, selectedSegmentIdRef: ce, selectedSegments: U, selectionAnchorIdRef: oe, selectionRangeBaseIdsRef: fe, setAutoAssignError: xe, setAutoAssignOpen: ee, setAutoAssigning: ue, setEditorFilters: Y, setExportingExamples: me, setHeldCreatedSegmentTag: ae, setHideDerivedSegments: te, setIncorrectExamples: he, setMaterializeError: H, setMaterializeLoading: ie, setMaterializeOpen: A, setMaterializePreview: v, setMaterializing: x, setRejectedDeletionPreview: y, setRemovingExampleId: N, setSaveMessage: D, setSelectedSegmentGroupKey: W, setSelectedSegmentId: K, setSelectedSegmentIds: pe, video: E } = e;
  async function Q() {
    var Ne, tt, Le;
    if (U.length === 0 || !J || G != null) return;
    const Z = Nd(U, k), de = Z.segments;
    if (de.length === 0) return;
    const Me = U.map((Fe) => ({
      id: Fe.id,
      itemId: Fe.itemId,
      nativeSegmentId: Fe.nativeSegmentId
    })), We = Me.find((Fe) => Fe.id === J.id) || Me[0], ve = [], ze = [];
    let Qe = !1, ke = u, Se = !1;
    const Ve = [], He = r("feedback", We.id);
    if (He) {
      D(Z.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Fe = async ($e, Ce) => {
          const Je = $e.nativeSegmentId != null, xt = Z.action === "remove" ? `incorrect-example-remove:${E.id}:${Ce == null ? void 0 : Ce.id}:${Ce == null ? void 0 : Ce.revision}:${Ce == null ? void 0 : Ce.representationRevision}` : `incorrect-example-collect:${E.id}:${Je ? `native:${$e.nativeSegmentId}:${$e.updatedAt}` : `item:${$e.itemId}:${$e.revision}`}`;
          if (Z.action === "remove" && !Ce)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let nt;
          try {
            nt = Z.action === "remove" ? await X(
              `/videos/${E.id}/incorrect-examples/${Ce.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: je(xt),
                  expectedExampleRevision: Ce.revision,
                  expectedRepresentationRevision: Ce.representationRevision
                })
              }
            ) : await X(`/videos/${E.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: je(xt),
                nativeSegmentId: Je ? $e.nativeSegmentId : null,
                itemId: Je ? null : $e.itemId,
                expectedUpdatedAt: Je ? $e.updatedAt : null,
                expectedRevision: Je ? null : $e.revision
              })
            });
          } catch (Gt) {
            throw Gt.operationKey = xt, Gt;
          }
          if (!Id(Z.action, nt))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ue(xt), nt;
        };
        for (const $e of de) {
          const Ce = Z.action === "remove" ? k.find((Je) => Je.itemId != null && Je.itemId === $e.itemId) : null;
          try {
            const Je = Me.find((mt) => mt.id === $e.id);
            let xt = Ze(
              ke == null ? void 0 : ke.segments,
              Je
            ) || $e, nt;
            try {
              nt = await Fe(xt, Ce);
            } catch (mt) {
              if (mt.status === 409 && ((tt = (Ne = mt.payload) == null ? void 0 : Ne.result) == null ? void 0 : tt.code) === "OPERATION_REPLAYED")
                ke = await X(
                  `/videos/${E.id}/editor`
                ), Se = !0, Ve.length = 0, Ue(mt.operationKey), nt = mt.payload.result;
              else {
                if (Z.action !== "collect" || mt.status !== 409) throw mt;
                const it = await X(
                  `/videos/${E.id}/editor`
                );
                ke = it, Se = !0, Ve.length = 0;
                const Nt = Ze(
                  it == null ? void 0 : it.segments,
                  Je
                );
                if (!Nt) throw mt;
                xt = Nt, nt = await Fe(xt, null);
              }
            }
            Je && nt.itemId != null && (Je.itemId = nt.itemId), ke = br(
              ke,
              nt.editorDelta
            ), Ve.push(nt.editorDelta);
            const Gt = { segment: $e, result: nt, example: Ce };
            ve.push(Gt);
          } catch (Je) {
            if (ze.push(Je), ![400, 404, 409].includes(Je.status)) break;
          }
        }
        if (c && ve.length > 0) {
          const $e = Z.action === "remove", Ce = ve.length;
          await re(
            $e ? "feedback.remove" : "feedback.collect",
            $e ? `Removed ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}` : `Collected ${Ce} incorrect AI example${Ce === 1 ? "" : "s"}`,
            mr(ve, $e),
            mr(ve, !$e)
          ) || (Qe = !0);
        }
        ve.some(({ result: $e }) => $e.representation === "basicNativeBin") && zn();
        const Re = eo(
          ce.current,
          We.id
        ), Ke = Z.action === "collect" && ve.some(({ segment: $e }) => $e.id === We.id), Et = ve.map(({ segment: $e }) => $e.id), Ge = Ke ? _s(
          o,
          Et,
          We.id
        ) : null, wt = Ke ? (Ge == null ? void 0 : Ge.id) ?? null : We.id;
        Re && Ke && (pe(Ge ? [Ge.id] : []), K((Ge == null ? void 0 : Ge.id) ?? xr), oe.current = (Ge == null ? void 0 : Ge.id) ?? null, fe.current = []);
        const hn = await X(`/videos/${E.id}/incorrect-examples`);
        he(hn);
        const lt = ke;
        if (T(Se ? lt : ($e) => Ve.reduce(br, $e), E.id), Re && eo(
          ce.current,
          wt
        )) {
          let $e, Ce;
          Ke ? (Ce = Ge ? Ze(lt == null ? void 0 : lt.segments, {
            id: Ge.id,
            itemId: Ge.itemId,
            nativeSegmentId: Ge.nativeSegmentId
          }) : null, $e = Ce ? [Ce] : []) : ($e = Me.map((Je) => Ze(lt == null ? void 0 : lt.segments, Je)).filter(Boolean), Ce = Ze(lt == null ? void 0 : lt.segments, We) || $e[0] || null), pe($e.map((Je) => Je.id)), K((Ce == null ? void 0 : Ce.id) ?? (Ke ? xr : null)), oe.current = (Ce == null ? void 0 : Ce.id) ?? null, fe.current = [], W(Ce ? Tt(o, Ce.id) : null), Ce && L(Ce.id);
        }
        if (ze.length > 0) {
          const $e = ((Le = ze[0]) == null ? void 0 : Le.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? D($e) : Z.action === "remove" ? D(
            `Partially removed ${ve.length} of ${de.length} selected incorrect examples. ${$e}`
          ) : D(
            `Partially collected ${ve.length} of ${de.length} selected segments. ${$e}`
          );
        } else if (Z.action === "remove")
          D(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const $e = ve.filter(({ result: Ce }) => Ce.representation === "basicNativeBin").length;
          D($e === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        Qe && D("The change saved, but editor history could not be updated.");
      } catch (Fe) {
        D(Fe.message || "Unable to update the selected incorrect examples.");
      } finally {
        He();
      }
    }
  }
  async function q(Z) {
    var Me, We;
    if (!Z || I != null || p) return;
    N(Z.id);
    const de = `incorrect-example-remove:${E.id}:${Z.id}:${Z.revision}:${Z.representationRevision}`;
    try {
      let ve, ze = !1;
      try {
        ve = await X(
          `/videos/${E.id}/incorrect-examples/${Z.id}/remove`,
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
      } catch (Se) {
        if (Se.status !== 409 || ((We = (Me = Se.payload) == null ? void 0 : Me.result) == null ? void 0 : We.code) !== "OPERATION_REPLAYED")
          throw Se;
        ve = Se.payload.result, ze = !0;
      }
      Ue(de);
      let Qe = !0;
      if (c) {
        const Ve = [{ segment: Ze(u.segments, {
          itemId: Z.itemId
        }) || {
          id: Z.itemId == null ? null : -Z.itemId,
          itemId: Z.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: Z.representationRevision
        }, result: ve, example: Z }];
        Qe = await re(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          mr(Ve, !0),
          mr(Ve, !1)
        );
      }
      const ke = await X(
        `/videos/${E.id}/incorrect-examples`
      );
      he(ke), ze ? await O() : T(
        (Se) => br(Se, ve.editorDelta),
        E.id
      ), Z.representation === "basicNativeBin" && zn(), D(Qe ? ze ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Z.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await R(), D(ve.message || "Unable to remove the incorrect example.");
    } finally {
      N(null);
    }
  }
  async function ge() {
    if (p || I != null || k.length === 0) return;
    me(!0);
    const Z = `incorrect-example-export:${E.id}:${k.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await $d(
        E.id,
        k
      ), Me = new FormData();
      Me.append("metadata", JSON.stringify({
        operationId: je(Z),
        examples: de.captures
      }));
      for (const Se of de.files)
        Me.append(Se.fieldName, Se.file);
      const We = await X(
        `/videos/${E.id}/incorrect-examples/export`,
        { method: "POST", body: Me }
      ), ve = await Hl(We.downloadUrl), ze = URL.createObjectURL(ve.blob), Qe = document.createElement("a");
      Qe.href = ze, Qe.download = ve.fileName, Qe.click(), setTimeout(() => URL.revokeObjectURL(ze), 1e3);
      const ke = await X(
        `/training-exports/${We.id}/complete`,
        { method: "POST" }
      );
      Ue(Z), he(await X(
        `/videos/${E.id}/incorrect-examples`
      )), D(
        `Downloaded ${We.exampleCount} incorrect example${We.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${ke.clearedExampleCount} from the working collection.`
      );
    } catch (de) {
      D(de.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      me(!1);
    }
  }
  async function we(Z = null) {
    const de = V.filter((He) => He.reviewState === "rejected"), Me = de.length, We = k.some((He) => He.representation === "fullItem");
    if (Z == null && Me === 0 && !We) {
      D("There are no rejected segments to delete.");
      return;
    }
    if (Z == null) {
      const He = r("delete-rejected", -1);
      if (!He) return;
      D("Preparing deletion summary…");
      try {
        const Ne = await X(`/videos/${E.id}/rejected/deletion/preview`, { method: "POST" }), tt = Number(Ne.deletedSegmentCount) || 0, Le = Number(Ne.deferredRejectedSegmentCount) || 0, Fe = Number(Ne.protectedIncorrectExampleCount) || 0;
        if (tt === 0) {
          Le > 0 ? D(
            `${Le} feedback-protected rejected segment${Le === 1 ? "" : "s"} kept. ${Fe} AI feedback example${Fe === 1 ? "" : "s"} must be exported before ${Le === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : D("There are no rejected segments to delete.");
          return;
        }
        if (!li(Ne, D)) return;
        y(Ne), D("");
      } catch (Ne) {
        D(Ne.message || "Unable to prepare rejected segment deletion.");
      } finally {
        He();
      }
      return;
    }
    const ve = Z, ze = Number(ve.deferredRejectedSegmentCount) || 0, Qe = ce.current, ke = ze === 0 ? oo(u, de.map((He) => He.id)) : u, Se = ke.segments.find((He) => He.reviewState === "unreviewed") || ke.segments[0] || null, Ve = r("delete-rejected", -1);
    if (Ve) {
      y(null), D("Deleting rejected segments…"), ze === 0 && (T(ke, E.id), pe(Se ? [Se.id] : []), K((Se == null ? void 0 : Se.id) ?? null), oe.current = (Se == null ? void 0 : Se.id) ?? null, fe.current = []);
      try {
        const He = `rejected-dependency-delete:${E.id}:${ve.fingerprint}`, Ne = await X(`/videos/${E.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(He),
            fingerprint: ve.fingerprint
          })
        });
        Ue(He), await O(), Ne.deletedSegmentCount > 0 && t(jt);
        const tt = ze > 0 ? ` ${ze} feedback-protected rejected segment${ze === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
        D(`${Ne.deletedSegmentCount} segment${Ne.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${tt}`);
      } catch (He) {
        ze === 0 && T((Ne) => xi(
          Ne,
          de
        ), E.id), pe(Qe == null ? [] : [Qe]), K(Qe), oe.current = Qe, fe.current = [], D(He.message || "Unable to delete rejected segments.");
      } finally {
        Ve();
      }
    }
  }
  async function Be(Z = i) {
    if (!(a || Z.length === 0)) {
      ue(!0), xe("");
      try {
        const de = await X(`/videos/${E.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: Z.flatMap((Me) => Me.nativeSegmentId == null ? [] : [Me.nativeSegmentId]),
            itemIds: Z.flatMap((Me) => Me.published || Me.itemId == null ? [] : [Me.itemId])
          })
        });
        ee(!1), await O(), D(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (de) {
        xe(de.message || "Unable to auto-assign performers.");
      } finally {
        ue(!1);
      }
    }
  }
  async function Te() {
    A(!0), H(""), !P && (ie(!0), z());
  }
  function Xe() {
    M.current = !0, A(!1), requestAnimationFrame(() => {
      var Z;
      return (Z = w.current) == null ? void 0 : Z.focus({ preventScroll: !0 });
    });
  }
  async function Oe() {
    if (!P || C || P.createCount + P.linkCount === 0)
      return;
    x(!0), H("");
    let Z;
    try {
      const de = `materialize-derived:${E.id}:${P.fingerprint}`;
      Z = await X(`/videos/${E.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(de),
          fingerprint: P.fingerprint,
          maxDepth: 3
        })
      }), Ue(de);
    } catch (de) {
      de.status === 409 && v(null), H(de.message || "Unable to materialize derived segments."), x(!1);
      return;
    }
    v((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await O(), Xe(), v(null);
      const de = Z.createdCount + Z.linkedCount;
      D(`${Z.createdCount} derived segment${Z.createdCount === 1 ? "" : "s"} created and ${Z.linkedCount} existing segment${Z.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && D("Every applicable derivation was already materialized.");
    } catch {
      H("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    x(!1);
  }
  async function Ie(Z, de = null) {
    var We, ve, ze, Qe;
    const Me = {
      tagId: Z,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (U.length > 1) {
      const ke = U.filter((Le) => Le.tagId !== Z);
      if (ke.length === 0) {
        d();
        return;
      }
      const Se = U.map((Le) => ({
        id: Le.id,
        itemId: Le.itemId,
        nativeSegmentId: Le.nativeSegmentId
      })), Ve = U.map((Le) => !c || Le.nativeSegmentId != null ? `native:${Le.nativeSegmentId}:${Le.updatedAt}` : `item:${Le.itemId}:${Le.revision}`).sort().join(","), He = `bulk-tag:${E.id}:${Z}:${Ve}`, Ne = r("tag", (J == null ? void 0 : J.id) ?? ke[0].id);
      if (!Ne) return;
      D(`Changing tag for ${ke.length} selected segment${ke.length === 1 ? "" : "s"}…`);
      const tt = wr(
        u,
        ke.map((Le) => Le.id),
        Me
      );
      T(tt, E.id), d();
      try {
        const Le = c ? null : crypto.randomUUID();
        await X(`/videos/${E.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(He),
            tagId: Z,
            historyReceiptId: Le,
            segments: U.map((Ge) => {
              const wt = !c || Ge.nativeSegmentId != null;
              return {
                nativeSegmentId: wt ? Ge.nativeSegmentId : null,
                itemId: wt ? null : Ge.itemId,
                expectedUpdatedAt: wt ? Ge.updatedAt : null,
                expectedRevision: wt ? null : Ge.revision
              };
            })
          })
        }), Ue(He);
        const Fe = St(
          U,
          c
        ), Re = await O(), Ke = Se.map((Ge) => Ze(Re == null ? void 0 : Re.segments, Ge)).filter(Boolean);
        await re(
          "segments.tag",
          `Changed tag for ${ke.length} segment${ke.length === 1 ? "" : "s"}`,
          Fe,
          St(Ke, c),
          Le
        );
        const Et = Se.map((Ge) => Ze(Re == null ? void 0 : Re.segments, Ge)).filter(Boolean);
        pe(Et.map((Ge) => Ge.id)), K(((We = Et.find((Ge) => Ge.id === (J == null ? void 0 : J.id))) == null ? void 0 : We.id) ?? ((ve = Et[0]) == null ? void 0 : ve.id) ?? null), d(), D(`${ke.length} selected segment${ke.length === 1 ? "" : "s"} retagged.`);
      } catch (Le) {
        T((Ke) => Vn(
          Ke,
          ke,
          Object.keys(Me)
        ), E.id);
        const Fe = Se.map((Ke) => Ze(u.segments, Ke)).filter(Boolean), Re = Ze(u.segments, {
          id: J == null ? void 0 : J.id,
          itemId: J == null ? void 0 : J.itemId,
          nativeSegmentId: J == null ? void 0 : J.nativeSegmentId
        }) || Fe[0] || null;
        pe(Fe.map((Ke) => Ke.id)), K((Re == null ? void 0 : Re.id) ?? null), oe.current = (Re == null ? void 0 : Re.id) ?? null, fe.current = [], Le.status === 409 && await R(), D(Le.message || "Unable to change the selected segment tags.");
      } finally {
        Ne();
      }
      return;
    }
    if (!(U.length !== 1 || !J)) {
      if (J.id === m || (b == null ? void 0 : b.segmentId) === J.id) {
        const ke = b != null, Se = vl(b, J, Z, de);
        if (ae(Se), Se) {
          const Ve = Wa(
            { ...J, tagId: Se.tagId },
            _,
            f,
            h,
            ne
          );
          Y(Ve.filters), te(Ve.hideDerivedSegments), D("Tag change queued…");
        } else ke && D("");
        d();
        return;
      }
      if (Z === J.tagId) {
        d();
        return;
      }
      if (J.itemId != null && ((Qe = (ze = S.data) == null ? void 0 : ze.children) == null ? void 0 : Qe.length) > 0) {
        const ke = r("lineage-tag", J.id);
        if (!ke) return;
        D("Checking lineage impact…");
        try {
          const Se = await X(`/items/${J.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: J.revision, tagId: Z })
          }), Ve = Se.deletedItemIds.length > 0 || Se.removedEdgeIds.length > 0;
          if (Ve && !window.confirm(
            `Changing this tag removes ${Se.removedEdgeIds.length} lineage edge${Se.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Se.deletedItemIds.length} derived segment${Se.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            D("Tag change canceled.");
            return;
          }
          const He = wr(
            u,
            [J.id],
            Me
          );
          T(He, E.id), d();
          const Ne = `tag-change:${J.itemId}:${J.revision}:${Se.componentFingerprint}:${Z}`;
          await X(`/items/${J.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Ne),
              expectedRevision: J.revision,
              componentFingerprint: Se.componentFingerprint,
              tagId: Z
            })
          }), Ue(Ne), await O(), d(), D(Ve ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (Se) {
          T((Ve) => Vn(
            Ve,
            [J],
            Object.keys(Me)
          ), E.id), pe([J.id]), K(J.id), oe.current = J.id, fe.current = [], Se.status === 409 ? (D("Lineage changed — loading the latest segments…"), await R()) : D(Se.message || "Unable to reconcile the lineage.");
        } finally {
          ke();
        }
        return;
      }
      d(), await $(J, {
        startSec: J.startSec,
        endSec: J.endSec,
        tagId: Z
      }, !0, null, !0, Me);
    }
  }
  async function Ee(Z) {
    const de = V.find((We) => We.id === Z.segmentId);
    if (!de) return;
    await $(de, {
      startSec: de.startSec,
      endSec: de.endSec,
      tagId: Z.tagId
    }, !0, null, !0, {
      tagId: Z.tagId,
      ...Z.tagName ? { tagName: Z.tagName } : {},
      tagSortName: null
    }, !1) || D(`The new segment was not retagged${Z.tagName ? ` to ${Z.tagName}` : ""}. Choose its tag again.`);
  }
  async function qe() {
    var ke, Se, Ve, He;
    if (!l || !J || G != null) return;
    const Z = [...U].sort((Ne, tt) => Number(Ne.nativeSegmentId ?? Ne.id) - Number(tt.nativeSegmentId ?? tt.id)), de = new Set(Z.map((Ne) => Ne.id)), Me = Z.map((Ne) => `${Ne.nativeSegmentId ?? Ne.id}:${Ne.updatedAt}`).join("|"), We = r("bin", J.id);
    if (!We) return;
    D(`Moving ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${E.id}:${Me}`, ze = je(ve), Qe = c ? null : crypto.randomUUID();
    try {
      const Ne = (Re = !1) => X(`/videos/${E.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ze,
          segments: Z.map((Ke) => ({
            segmentId: Ke.nativeSegmentId ?? Ke.id,
            expectedUpdatedAt: Ke.updatedAt
          })),
          discardMissingImage: Re,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: Qe
        })
      });
      let tt;
      try {
        tt = await Ne(
          go(ve)
        );
      } catch (Re) {
        if (((ke = Re.payload) == null ? void 0 : ke.code) !== "missing-image" || !window.confirm(`${Re.message}

Continue and discard the missing image reference?`)) throw Re;
        po(ve), tt = await Ne(!0);
      }
      Ue(ve), zn();
      const Le = new Map((tt.items || []).map((Re) => [
        Number(Re.segmentId),
        Re
      ]));
      await re(
        "segments.moveToBin",
        `Moved ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin`,
        St(Z, !1),
        St(Z.map((Re) => {
          const Ke = Le.get(
            Number(Re.nativeSegmentId ?? Re.id)
          );
          return {
            ...Re,
            recycleBinItemId: (Ke == null ? void 0 : Ke.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (Ke == null ? void 0 : Ke.revision) ?? null
          };
        }), !1),
        Qe
      );
      const Fe = Hs(o, de, J.id);
      T((Re) => ({
        ...Re,
        segments: (Re.segments || []).filter((Ke) => !de.has(Ke.id))
      }), E.id), pe(Fe ? [Fe.id] : []), K((Fe == null ? void 0 : Fe.id) ?? null), oe.current = (Fe == null ? void 0 : Fe.id) ?? null, fe.current = [], Fe && (W(Tt(o, Fe.id)), L(Fe.id)), requestAnimationFrame(() => {
        var Re;
        return (Re = g.current) == null ? void 0 : Re.focus({ preventScroll: !0 });
      }), D(`Moved ${Z.length} segment${Z.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ne) {
      const tt = ((Se = Ne.payload) == null ? void 0 : Se.code) || ((He = (Ve = Ne.payload) == null ? void 0 : Ve.result) == null ? void 0 : He.code);
      Ne.status === 409 && tt === "CANONICAL_SEGMENT_CHANGED" ? await R() : D(Ne.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      We();
    }
  }
  async function st() {
    if (!(c || s.current || G != null)) {
      s.current = !0, D("Checking the recycling bin…");
      try {
        const Z = await X("/bin"), de = await ci(Z, () => D("Emptying the recycling bin…"));
        if (de.status === "empty") {
          D("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          D("The recycling bin was not emptied.");
          return;
        }
        D(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Z) {
        D(Z.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Q, removeIncorrectExample: q, captureTrainingExport: ge, deleteRejectedSegments: we, autoAssignPerformers: Be, previewDerivedSegments: Te, closeMaterializeDialog: Xe, materializeDerivedSegments: Oe, saveTag: Ie, applyHeldCreatedSegmentTag: Ee, moveToBin: qe, emptyRecyclingBin: st };
}
function vc(e) {
  const { acceptHistory: t, acquireSaveLock: r, commonActionsRef: o, compatibilityMode: i, currentTime: a, detail: s, editorLayout: l, focusRowRef: d, history: c, historyRef: m, historySaving: u, horizontalLayoutSize: f, mediaStackHeight: g, mediaStackRef: p, onDetailChange: h, onReload: b, railToggleRef: k, recordHistoryAction: S, savingSegmentId: w, savingShot: P, savingShotRef: M, setCollapsedSegmentGroups: C, setEditorLayout: $, setHistorySaving: R, setIncorrectExamples: T, setSaveMessage: O, setSavingShot: _, shotBoundaries: re, timelineDuration: z, video: I, workspaceRef: L } = e;
  async function G(A, v, x) {
    var W, K, pe, E;
    const y = A.type === "segment" ? [A] : A.segments || [], N = (v == null ? void 0 : v.type) === "segment" ? [v] : (v == null ? void 0 : v.segments) || [];
    let D = x;
    for (const [Q, q] of y.entries()) {
      const ge = N[Q], we = ((W = q.identity) == null ? void 0 : W.nativeSegmentId) != null || ((K = q.identity) == null ? void 0 : K.published) === !0, Be = ((pe = ge == null ? void 0 : ge.identity) == null ? void 0 : pe.recycleBinItemId) ?? ((E = ge == null ? void 0 : ge.identity) == null ? void 0 : E.itemId);
      let Te = Ze(D.segments, ge == null ? void 0 : ge.identity) || Ze(D.segments, q.identity);
      if (!Te && we && Be != null && ge.identity.revision != null) {
        const Ie = `history-restore:${I.id}:${Be}:${ge.identity.revision}`;
        await X(`/bin/${Be}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Ie),
            expectedRevision: ge.identity.revision
          })
        }), Ue(Ie), D = await b(), Te = D.segments.find((Ee) => Ee.tagId === q.values.tagId && Ee.startSec === q.values.startSec && Ee.endSec === q.values.endSec);
      }
      if (!Te)
        throw new Error("A segment in this history state no longer exists.");
      if ((Te.nativeSegmentId != null || Te.published === !0) !== we) {
        if (we) {
          const Ie = Te.recycleBinItemId ?? Te.itemId ?? Be;
          if (Ie == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ee = `history-restore:${I.id}:${Ie}:${Te.revision}:${q.values.reviewState ?? "native"}`;
          await X(`/bin/${Ie}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Ee),
              expectedRevision: Te.revision
            })
          }), Ue(Ee);
        } else {
          const Ie = `history-bin:${I.id}:${Te.nativeSegmentId}:${Te.updatedAt}:${q.values.reviewState}`;
          await X(`/videos/${I.id}/segments/${Te.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(Ie),
              expectedUpdatedAt: Te.updatedAt,
              reviewState: q.values.reviewState
            })
          }), Ue(Ie);
        }
        if (D = await b(), !we)
          continue;
        if (Te = Ze(D.segments, q.identity) || D.segments.find((Ie) => Ie.tagId === q.values.tagId && Ie.startSec === q.values.startSec && Ie.endSec === q.values.endSec), !Te)
          throw new Error("The restored segment could not be found.");
      }
      const Oe = q.values;
      if (Te.nativeSegmentId == null && Te.itemId != null) {
        const Ie = `history-draft-update:${I.id}:${Te.itemId}:${Te.revision}:${Oe.tagId}:${Oe.startSec}:${Oe.endSec ?? "open"}:${Oe.reviewState}`;
        await X(`/videos/${I.id}/drafts/${Te.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(Ie),
            expectedRevision: Te.revision,
            ...Oe
          })
        }), Ue(Ie);
      } else
        await X(`/videos/${I.id}/segments/${Te.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Oe, expectedUpdatedAt: Te.updatedAt })
        });
      D = await b();
    }
    return D;
  }
  async function ne(A, v) {
    var x;
    for (const y of A.targets || []) {
      const N = Ze(v.segments, y.identity);
      if (!N)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const D = (x = v.performerSlotRevisions) == null ? void 0 : x[N.id];
      await X(N.published ? `/videos/${I.id}/segments/${N.nativeSegmentId}/slots` : `/videos/${I.id}/drafts/${N.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: D,
          assignments: y.assignments
        })
      }), v = await b();
    }
    return v;
  }
  async function V(A, v, x) {
    if (!i)
      throw new Error("AI feedback history is only available in Full mode.");
    let y = v, N = await X(`/videos/${I.id}/incorrect-examples`);
    const D = (W) => N.find((K) => {
      var pe;
      return K.id === W.exampleId || ((pe = W.collectedIdentity) == null ? void 0 : pe.itemId) != null && K.itemId === W.collectedIdentity.itemId;
    });
    for (const [W, K] of (A.entries || []).entries()) {
      const pe = `history-feedback:${I.id}:${x.action.sequence}:${x.direction}:${W}`, E = D(K);
      if (A.collected && E) {
        Ue(pe);
        continue;
      }
      let Q;
      if (A.collected) {
        const q = Ze(
          y.segments,
          K.collectedIdentity
        ) || Ze(
          y.segments,
          K.originalIdentity
        );
        if (!q)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const ge = q.nativeSegmentId != null;
        Q = await X(`/videos/${I.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: je(pe),
            nativeSegmentId: ge ? q.nativeSegmentId : null,
            itemId: ge ? null : q.itemId,
            expectedUpdatedAt: ge ? q.updatedAt : null,
            expectedRevision: ge ? null : q.revision
          })
        });
      } else {
        if (!E) {
          Ue(pe);
          continue;
        }
        Q = await X(
          `/videos/${I.id}/incorrect-examples/${E.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: je(pe),
              expectedExampleRevision: E.revision,
              expectedRepresentationRevision: E.representationRevision
            })
          }
        );
      }
      Ue(pe), y = br(
        y,
        Q.editorDelta
      ), N = await X(
        `/videos/${I.id}/incorrect-examples`
      );
    }
    return T(N), y;
  }
  async function J(A, v, x = []) {
    const y = A.state;
    if (!i && ((y == null ? void 0 : y.type) === "segment" || (y == null ? void 0 : y.type) === "segments")) {
      const D = `basic-history:${I.id}:${m.current.revision}:${A.action.sequence}:${A.direction}`, W = await X(`/videos/${I.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(D),
          expectedHistoryRevision: m.current.revision,
          actionSequence: A.action.sequence,
          direction: A.direction
        })
      });
      return t(W.history), x.push(D), b();
    }
    const N = A.direction === "backward" ? A.action.afterState : A.action.beforeState;
    if ((y == null ? void 0 : y.type) === "composite") {
      let D = v;
      const W = (N == null ? void 0 : N.type) === "composite" ? N.states || [] : [];
      for (const [K, pe] of (y.states || []).entries()) {
        const E = W[K];
        D = await J({
          ...A,
          state: pe,
          action: {
            ...A.action,
            beforeState: A.direction === "backward" ? pe : E,
            afterState: A.direction === "backward" ? E : pe
          }
        }, D, x);
      }
      return D;
    }
    if ((y == null ? void 0 : y.type) === "segment" || (y == null ? void 0 : y.type) === "segments")
      return G(
        y,
        N,
        v
      );
    if ((y == null ? void 0 : y.type) === "performerSlots")
      return ne(y, v);
    if ((y == null ? void 0 : y.type) === "incorrectExamples")
      return V(y, v, A);
    if ((y == null ? void 0 : y.type) === "shots") {
      const D = Kn(v.shotBoundaries || []), W = await X(`/videos/${I.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(`history-shots:${I.id}:${D}:${y.fingerprint}`),
          expectedFingerprint: D,
          boundaries: y.boundaries
        })
      });
      return { ...v, shotBoundaries: W };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function ce(A) {
    var y;
    if (u || w != null || P || A === c.cursorSequence)
      return;
    const v = od(c, A);
    if (v.length === 0) return;
    const x = r("history", -1);
    if (x) {
      R(!0), O(`Restoring ${v.length} history ${v.length === 1 ? "action" : "actions"}…`);
      try {
        let N = s;
        const D = [];
        for (const K of v)
          N = await J(
            K,
            N,
            D
          );
        const W = i ? await X(`/videos/${I.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: m.current.revision,
            targetSequence: A
          })
        }) : m.current;
        D.forEach(Ue), t(W), await b(), O("History restored.");
      } catch (N) {
        N.status === 409 && ((y = N.payload) != null && y.current) && t(N.payload.current), await b(), O(N.message || "Unable to restore editor history.");
      } finally {
        x(), R(!1);
      }
    }
  }
  function U(A) {
    $((v) => ({ ...v, timelineRatio: uo(A, g) }));
  }
  function oe(A) {
    var y, N;
    const v = (y = p.current) == null ? void 0 : y.getBoundingClientRect();
    if (!v) return;
    const x = ((N = o.current) == null ? void 0 : N.offsetHeight) || 0;
    U(Rs(
      A.clientY,
      v.top + x,
      Math.max(0, v.height - x)
    ));
  }
  function fe(A) {
    A.currentTarget.setPointerCapture(A.pointerId), oe(A);
  }
  function xe(A) {
    A.currentTarget.hasPointerCapture(A.pointerId) && oe(A);
  }
  function ee(A) {
    const v = A.shiftKey ? 0.1 : 0.05;
    let x = null;
    A.key === "ArrowUp" && (x = l.timelineRatio + v), A.key === "ArrowDown" && (x = l.timelineRatio - v);
    const y = co(g);
    A.key === "Home" && (x = y.minimum), A.key === "End" && (x = y.maximum), x != null && (A.preventDefault(), A.stopPropagation(), U(x));
  }
  function ue(A) {
    const v = A === "detailWidth" ? f.focusRow : f.workspace, x = f.workspace > 0 ? Qr(f.workspace, 600) : 560, y = en(l.markerRailWidth, x), N = A === "detailWidth" ? 344 + (l.markerRailOpen ? y + 24 : 0) : 600;
    return v > 0 ? Qr(v, N) : 560;
  }
  function Y(A, v) {
    $((x) => ({ ...x, [A]: en(v, ue(A)) }));
  }
  function me(A, v) {
    var y, N;
    const x = v === "detailWidth" ? (y = d.current) == null ? void 0 : y.getBoundingClientRect() : (N = L.current) == null ? void 0 : N.getBoundingClientRect();
    x && Y(v, v === "detailWidth" ? A.clientX - x.left : x.right - A.clientX);
  }
  function ae(A, v) {
    const x = ue(A), y = en(l[A], x);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": v,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(x),
      "aria-valuenow": Math.round(y),
      "aria-valuetext": `${Math.round(y)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (N) => {
        N.currentTarget.setPointerCapture(N.pointerId), me(N, A);
      },
      onPointerMove: (N) => {
        N.currentTarget.hasPointerCapture(N.pointerId) && me(N, A);
      },
      onKeyDown: (N) => {
        const D = N.shiftKey ? 40 : 16;
        let W = null;
        N.key === "ArrowLeft" && (W = A === "detailWidth" ? -D : D), N.key === "ArrowRight" && (W = A === "detailWidth" ? D : -D);
        let K = W == null ? null : y + W;
        N.key === "Home" && (K = 240), N.key === "End" && (K = x), K != null && (N.preventDefault(), N.stopPropagation(), Y(A, K));
      },
      onDoubleClick: () => Y(A, ht[A]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function te() {
    $((A) => ({ ...A, markerRailOpen: !A.markerRailOpen })), requestAnimationFrame(() => {
      var A;
      return (A = k.current) == null ? void 0 : A.focus({ preventScroll: !0 });
    });
  }
  function he(A) {
    C((v) => v.includes(A) ? v.filter((x) => x !== A) : qt([...v, A]));
  }
  async function H(A, v = !0, x = a) {
    var W;
    if (M.current) return null;
    const y = Number((W = I.videoFile) == null ? void 0 : W.duration) || z, N = Kn(re), D = `shot-${A}:${I.id}:${x.toFixed(3)}:${y.toFixed(3)}:${N}`;
    M.current = !0, _(!0), O(A === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const K = await X(`/videos/${I.id}/shot-boundaries/${A}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(A === "split" ? { operationId: je(D), timeSec: x } : { operationId: je(D), timeSec: x })
      });
      return Ue(D), h((pe) => ({ ...pe, shotBoundaries: K }), I.id), v && await S(
        "shots.update",
        A === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: re,
          fingerprint: N
        },
        {
          type: "shots",
          boundaries: K,
          fingerprint: Kn(K)
        }
      ), O(A === "split" ? "Shot boundary added." : "Shots merged."), K;
    } catch (K) {
      return O(K.message || "Unable to edit shot boundaries."), null;
    } finally {
      M.current = !1, _(!1);
    }
  }
  async function ie(A) {
    if (M.current) return null;
    const v = `shot-restore:${I.id}:${A.afterFingerprint}`;
    M.current = !0, _(!0), O("Undoing shot edit…");
    try {
      const x = await X(`/videos/${I.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(v),
          expectedFingerprint: A.afterFingerprint,
          boundaries: A.before
        })
      });
      return Ue(v), h((y) => ({ ...y, shotBoundaries: x }), I.id), x;
    } catch (x) {
      return O(x.message || "Unable to undo the shot edit."), null;
    } finally {
      M.current = !1, _(!1);
    }
  }
  return { applySegmentHistoryState: G, applyPerformerSlotHistoryState: ne, applyHistoryState: J, restoreHistoryTarget: ce, updateTimelineRatio: U, updateTimelineRatioFromPointer: oe, handleSeparatorPointerDown: fe, handleSeparatorPointerMove: xe, handleSeparatorKeyDown: ee, panelWidthMaximum: ue, updatePanelWidth: Y, handlePanelSeparatorPointer: me, panelSeparatorProps: ae, toggleSegmentRail: te, toggleSegmentGroup: he, mutateShotBoundary: H, restoreShotBoundaries: ie };
}
function xc(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: m, emptyRecyclingBin: u, lineage: f, mediaDuration: g, mergeSelectedSwimlane: p, moveToBin: h, mutateShotBoundary: b, openPublishApprovedDialog: k, playbackControlsRef: S, playbackShortcutConfig: w, saveSelectedReviewState: P, seekRef: M, segmentGroupKeys: C, selectSegment: $, selectedSegment: R, selectedSegmentGroupForSegment: T, selectedSegmentGroupKey: O, selectedSegments: _, setCollapsedSegmentGroups: re, setIncorrectExamplesOpen: z, setQuickSearchOpen: I, setSaveMessage: L, setSelectedSegmentGroupKey: G, setTagEditing: ne, setTimelineZoom: V, shotBoundaries: J, slotButtonRef: ce, splitSegment: U, swimlanes: oe, timelineDuration: fe, toggleIncorrectExample: xe, toggleSegmentGroup: ee, updateTimelineRatio: ue, videoFrameRate: Y, visibleSegments: me } = e;
  function ae(H) {
    var ie, A;
    (ie = S.current) == null || ie.pause(), (A = S.current) == null || A.seekBy(Nl(H, Y));
  }
  function te(H, ie) {
    if (_.length > 1 && il(H.id))
      return;
    let A = null;
    H.id === "video.playPause" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.toggle();
    }), H.id === "video.seekSmallBackward" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(-w.smallSeekTime);
    }), H.id === "video.seekSmallForward" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(w.smallSeekTime);
    }), H.id === "video.seekMediumBackward" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(-w.mediumSeekTime);
    }), H.id === "video.seekMediumForward" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(w.mediumSeekTime);
    }), H.id === "video.seekLongBackward" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(-w.longSeekTime);
    }), H.id === "video.seekLongForward" && (A = () => {
      var v;
      return (v = S.current) == null ? void 0 : v.seekBy(w.longSeekTime);
    }), H.id === "video.playSelected" && R && (A = () => {
      var v;
      (v = M.current) == null || v.call(M, R.startSec, !0), requestAnimationFrame(() => {
        var x;
        return (x = m.current) == null ? void 0 : x.focus({ preventScroll: !0 });
      });
    }), (H.id === "video.playPreviousSegment" || H.id === "video.playNextSegment") && (A = () => {
      var x;
      const v = ro(
        oe,
        R == null ? void 0 : R.id,
        H.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !v || v.id === (R == null ? void 0 : R.id) || ($(v, { focusEditor: !0, seekToSegment: !1 }), (x = M.current) == null || x.call(M, v.startSec, !0));
    }), H.id.startsWith("video.seekPercent") && (A = () => {
      var x;
      const v = Number(H.id.slice(17)) / 10;
      (x = M.current) == null || x.call(M, qs(g ?? fe, v), !1);
    }), H.id === "video.jumpToSegmentStart" && R && (A = () => {
      var v;
      return (v = M.current) == null ? void 0 : v.call(M, R.startSec, !1);
    }), H.id === "video.jumpToSegmentEnd" && R && (A = () => {
      var v;
      return (v = M.current) == null ? void 0 : v.call(M, R.endSec ?? R.startSec, !1);
    }), H.id === "video.jumpToVideoStart" && (A = () => {
      var v;
      return (v = M.current) == null ? void 0 : v.call(M, 0, !1);
    }), H.id === "video.jumpToVideoEnd" && (A = () => {
      var v;
      return (v = M.current) == null ? void 0 : v.call(M, fe, !1);
    }), H.id.startsWith("video.frame") && (A = () => {
      const v = H.id.includes("Small") ? "small" : H.id.includes("Medium") ? "medium" : "long", x = w[`${v}FrameStep`] * (H.id.endsWith("Backward") ? -1 : 1);
      ae(x);
    }), H.id.startsWith("navigation.swimlane") && (A = () => {
      const v = H.id.slice(19).toLowerCase(), x = ro(oe, R == null ? void 0 : R.id, v, s);
      x && $(x, { focusEditor: !0, seekToSegment: !1 });
    }), (H.id === "navigation.extendSwimlaneLeft" || H.id === "navigation.extendSwimlaneRight") && (A = () => {
      const v = xd(
        t,
        R == null ? void 0 : R.id,
        H.id.endsWith("Left") ? "left" : "right"
      );
      v && $(v.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: v.segmentIds
      });
    }), (H.id === "navigation.segmentGroupUp" || H.id === "navigation.segmentGroupDown") && (A = () => {
      const v = Sd(
        C,
        O ?? T,
        H.id.endsWith("Up") ? -1 : 1
      );
      v && G(v);
    }), (H.id === "navigation.previousAtPlayhead" || H.id === "navigation.nextAtPlayhead") && (A = () => {
      const v = Ms(me, s, H.id === "navigation.previousAtPlayhead" ? -1 : 1, R == null ? void 0 : R.id);
      v && $(v, { focusEditor: !0, seekToSegment: !1 });
    }), H.id === "navigation.nearestInCurrentSwimlane" && (A = () => {
      const v = xs(
        oe,
        R == null ? void 0 : R.id,
        s
      );
      v && $(v, { focusEditor: !0, seekToSegment: !1 });
    }), H.id.includes("Unreviewed") && (A = () => {
      const v = hr(
        oe,
        R == null ? void 0 : R.id,
        H.id.startsWith("navigation.previous") ? -1 : 1,
        H.id.endsWith("Global")
      );
      v && $(v, { focusEditor: !ie.preserveFocus, seekToSegment: !1 });
    }), (H.id === "navigation.nextTouchingPlayhead" || H.id === "navigation.previousTouchingPlayhead") && (A = () => {
      const v = vs(oe, s, H.id === "navigation.previousTouchingPlayhead" ? -1 : 1, R == null ? void 0 : R.id);
      v && $(v, { focusEditor: !0, seekToSegment: !1 });
    }), H.id === "navigation.quickSearch" && (A = () => I(!0)), (H.id === "navigation.previousShot" || H.id === "navigation.nextShot") && (A = () => {
      var x;
      const v = wl(J, s, H.id === "navigation.previousShot" ? -1 : 1);
      v && ((x = M.current) == null || x.call(M, v.startSec, !1));
    }), H.id === "shot.split" && (A = () => b("split")), H.id === "shot.merge" && (A = () => b("merge")), H.id === "marker.create" && (A = () => a()), H.id === "marker.duplicate" && (A = () => d(!1)), H.id === "marker.duplicateAtPlayhead" && (A = () => d(!0)), H.id === "marker.split" && (A = () => U()), H.id === "marker.editTag" && (A = () => {
      var v;
      if (_.length > 1 && _.some((x) => x.isDerived)) {
        L("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((v = f.data) != null && v.tagReadOnly) {
        L("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      ne(!0);
    }), H.id === "marker.setStart" && R && (A = () => r(s, R.endSec)), H.id === "marker.setEnd" && R && (A = () => r(R.startSec, s)), H.id === "marker.copyTiming" && R && (A = () => {
      L(Bd(R) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), H.id === "marker.pasteTiming" && R && (A = () => {
      const v = jd();
      if (!v) {
        L("No copied segment timing is available.");
        return;
      }
      r(v.startSec, v.endSec);
    }), H.id === "marker.mergeSelection" && (A = () => p()), H.id === "marker.moveToBin" && (A = () => h()), H.id === "marker.toggleIncorrectExample" && R && (A = () => xe()), H.id === "marker.openIncorrectExamples" && (A = () => z(!0)), H.id === "markerGroup.toggleCollapse" && O && (A = () => ee(O)), H.id === "markerGroup.toggleAll" && (A = () => re((v) => vd(v, C))), H.id === "marker.assignSlots" && (A = () => {
      var v;
      return (v = ce.current) == null ? void 0 : v.click();
    }), H.id === "navigation.zoomIn" && (A = () => V((v) => vr(v + 0.5))), H.id === "navigation.zoomOut" && (A = () => V((v) => vr(v - 0.5))), H.id === "navigation.resetZoom" && (A = () => V(1)), H.id === "navigation.centerPlayhead" && (A = () => {
      var v;
      return (v = o.current) == null ? void 0 : v.call(o);
    }), H.id === "layout.growSwimlanes" && (A = () => ue(c.timelineRatio + 0.05)), H.id === "layout.shrinkSwimlanes" && (A = () => ue(c.timelineRatio - 0.05)), H.id === "marker.confirm" && R && (A = () => P("approved")), H.id === "system.publishApproved" && (A = () => k(ie.target)), H.id === "marker.reject" && R && (A = () => P("rejected")), H.id === "system.emptyBin" && (A = () => u()), H.id === "system.deleteRejected" && (A = () => l()), A && A();
  }
  function he(H, ie) {
    const A = Jn.find((v) => v.id === H);
    A && yn(A, i) && te(A, ie);
  }
  return {
    executeShortcutById: he,
    stepVideoFrame: (H) => ae(H < 0 ? -1 : 1)
  };
}
function xa(e) {
  return e === !0;
}
function Sa() {
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
function Sc(e, t, r = !1, o = 0, i = "") {
  const [a, s] = B(null), [l, d] = B(null), [c, m] = B(""), [u, f] = B({
    busy: !1,
    reviewState: null,
    error: ""
  }), g = ye(null);
  async function p(k) {
    f({ busy: !0, reviewState: k, error: "" });
    try {
      await X(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: no(), reviewState: k })
      }), await t(), f({ busy: !1, reviewState: null, error: "" });
    } catch (S) {
      f({
        busy: !1,
        reviewState: null,
        error: S.message || "Unable to import Cove segments."
      });
    }
  }
  async function h(k) {
    try {
      const S = await X(`/videos/${e}/analysis-runs`, {
        signal: k.signal
      });
      if (!k.isActive()) return null;
      const w = (S == null ? void 0 : S[0]) || null;
      return s(w), (w == null ? void 0 : w.status) === "completed" && g.current !== w.id && (g.current = w.id, await t()), ((w == null ? void 0 : w.status) === "failed" || (w == null ? void 0 : w.status) === "cancelled") && m(w.errorMessage || "Video analysis did not complete."), w;
    } catch (S) {
      return k.isActive() && S.name !== "AbortError" && m(S.message || "Unable to load video analysis status."), null;
    }
  }
  async function b(k = null) {
    m("");
    const S = k || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), w = S.includes("omnishotcut") && o > 0;
    if (!(w && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const P = await X(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: S,
            replaceShotBoundaries: w,
            expectedShotBoundaryFingerprint: w ? i : null
          })
        });
        s(P);
      } catch (P) {
        m(P.message || "Unable to start video analysis.");
      }
  }
  return be(() => {
    if (!xa(r)) {
      s(null), d(null), m("");
      return;
    }
    const k = Sa();
    return h(k), X("/analysis/status", { signal: k.signal }).then((S) => {
      k.isActive() && (d(S), S.configured || m(""));
    }).catch((S) => {
      k.isActive() && S.name !== "AbortError" && m(S.message || "Unable to check video analysis readiness.");
    }), k.dispose;
  }, [e, r]), be(() => {
    if (!xa(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const k = Sa();
    let S = setTimeout(async function w() {
      await h(k), k.isActive() && (S = setTimeout(w, 2500));
    }, 2500);
    return () => {
      clearTimeout(S), k.dispose();
    };
  }, [a == null ? void 0 : a.id, a == null ? void 0 : a.status, r]), {
    analysisError: c,
    analysisRun: a,
    analysisStatus: l,
    importNativeSegments: p,
    nativeImportState: u,
    startFullAnalysis: b
  };
}
const Un = Object.freeze([]);
function kc(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function wc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Lo, Fo, jo, Bo, Go;
  const [m, u] = B(null), [f, g] = B([]), p = ye(null), h = ye(null), b = ye([]), k = ye(null), [S, w] = B(() => kt({})), [P, M] = B(!1), [C, $] = B(Ws), [R, T] = B(0), [O] = B(() => Qs()), _ = Ul(O.subscribe, O.getSnapshot), re = yr(_), z = (F, le) => O.acquire({ kind: F, lockId: le }), I = O.getSnapshot, [L, G] = B(!1), [ne, V] = B(""), [J, ce] = B(""), [U, oe] = B(""), [fe, xe] = B(1), [ee, ue] = B(Od), [Y, me] = B(0), [ae, te] = B({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [he, H] = B(jt), ie = ye(jt), [A, v] = B(!1), [x, y] = B(!1), [N, D] = B(!1), W = ye(!1);
  W.current = N;
  const [K, pe] = B(null), [E, Q] = B(null), [q, ge] = B(!1), [we, Be] = B(null), [Te, Xe] = B(null), Oe = ye(null), [Ie, Ee] = B(!1), [qe, st] = B(""), Z = ye(null), de = ye(null), Me = ye([]), We = ye(!1), [ve, ze] = B(Pd), [Qe, ke] = B(null), [Se, Ve] = B(!1), [He, Ne] = B(!1), [tt, Le] = B(!1), [Fe, Re] = B(!1), [Ke, Et] = B(!1), [Ge, wt] = B(""), {
    analysisError: hn,
    analysisRun: lt,
    analysisStatus: $e,
    importNativeSegments: Ce,
    nativeImportState: Je,
    startFullAnalysis: xt
  } = Sc(
    e.video.id,
    o,
    l,
    ((Lo = e.shotBoundaries) == null ? void 0 : Lo.length) || 0,
    Kn(e.shotBoundaries || [])
  ), [nt, Gt] = B(!1), [mt, it] = B(null), [Nt, Ut] = B(l), [Tr, Kt] = B(0), [on, an] = B(!1), [vn, xn] = B(""), [Ar, Dt] = B(null), Wt = ye(null), Sn = ye(null), Ot = ye(!1), [Vt, sn] = B([]), [kn, Qn] = B(!1), [Zn, Rr] = B(null), wn = Ed(), Nn = ye(null), Xn = ye(null), Jt = ye(null), er = ye(s), In = ye(null), Cn = ye(null), Yt = ye(null), $n = ye(null), ln = ye(null), gt = ye(null), Tn = ye(null), An = ye(null), tr = ye(null), nr = ye(null), Rn = ye(null), It = ye(null), Mr = ye(-1e12), rr = ye(null), or = ye(!1), Mn = ye(null), [En, Dn] = B({ scrollTop: 0, height: 512 });
  be(() => {
    if (!nt || on || !vn) return;
    const F = requestAnimationFrame(() => {
      var le;
      return (le = Sn.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(F);
  }, [nt, on, vn]), be(() => {
    if (!Ot.current || nt || Nt) return;
    const F = requestAnimationFrame(() => {
      var le;
      (le = Wt.current) == null || le.focus({ preventScroll: !0 }), Ot.current = !1;
    });
    return () => cancelAnimationFrame(F);
  }, [nt, Nt]);
  const et = e.video, rt = e.segments || Un, ar = _e(() => JSON.stringify({
    segments: rt.map((F) => [
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
  }), [rt, e.performerSlots, e.itemMetadata]);
  be(() => {
    if (!l) {
      it(null), Ut(!1);
      return;
    }
    if (re != null) {
      Ut(!0);
      return;
    }
    let F = !0;
    Ut(!0);
    const le = setTimeout(() => {
      X(`/videos/${et.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((De) => {
        F && (it(De), xn(""));
      }).catch((De) => {
        F && (it(null), xn(De.message || "Unable to preview derived segments."));
      }).finally(() => {
        F && Ut(!1);
      });
    }, 150);
    return () => {
      F = !1, clearTimeout(le);
    };
  }, [l, et.id, ar, Tr, re]);
  const Er = () => Kt((F) => F + 1), Ct = e.segmentGroups || Un, Ye = e.performerSlots || Un, ir = l && e.performerSlotsAvailable !== !1, On = _e(
    () => (e.performerCandidates || []).filter((F) => F.isVideoPerformer),
    [e.performerCandidates]
  ), Pn = e.shotBoundaries || Un, dn = _e(
    () => fi(Ye),
    [Ye]
  ), zt = _e(
    () => rt.map((F) => {
      const le = dn.get(F.id) || [];
      return {
        ...F,
        slots: le,
        assignment: le.every((De) => De.performerId == null) ? Ll(le, On) : null
      };
    }).filter((F) => F.slots.length > 0 && F.assignment != null),
    [rt, dn, On]
  ), Dr = Number((Fo = et.videoFile) == null ? void 0 : Fo.frameRate) > 0 ? Number(et.videoFile.frameRate) : 30;
  function Ln() {
    const F = W.current;
    D(!1), F && requestAnimationFrame(() => {
      var le;
      return (le = gt.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
  }
  function sr() {
    re == null && (It.current = null, ge(!1), V(""), requestAnimationFrame(() => {
      var F;
      return (F = gt.current) == null ? void 0 : F.focus({ preventScroll: !0 });
    }));
  }
  function Fn() {
    M(!1), requestAnimationFrame(() => {
      var F, le;
      (F = An.current) != null && F.isConnected ? An.current.focus({ preventScroll: !0 }) : (le = gt.current) == null || le.focus({ preventScroll: !0 });
    });
  }
  be(() => {
    Rn.current === m ? (Rn.current = null, D(!0)) : D(!1);
  }, [m]), be(() => {
    var le;
    if (!N) return;
    const F = (le = nr.current) == null ? void 0 : le.querySelector("input");
    document.activeElement !== F && (F == null || F.focus({ preventScroll: !0 }), F == null || F.select());
  }, [N, m]), be(() => {
    var le;
    if (N) return;
    const F = (le = gt.current) == null ? void 0 : le.ownerDocument;
    F && F.activeElement === F.body && gt.current.focus({ preventScroll: !0 });
  }, [N]), be(() => {
    var De, ot, $t;
    const F = tn(
      Kr(
        e.segments,
        e.performerSlots || [],
        kt({}),
        l && C,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), le = ((De = e.segments.find((mn) => mn.id === s)) == null ? void 0 : De.id) ?? ((ot = za(F)) == null ? void 0 : ot.id) ?? null;
    u(le), g(le == null ? [] : [le]), h.current = le, b.current = [], ke(Tt(F, le)), w(kt({})), M(!1), It.current = null, ge(!1), Q(null), xe(1), V(""), H(jt), ie.current = jt, v(!1), ($t = gt.current) == null || $t.focus({ preventScroll: !0 });
  }, [et.id, s]), be(() => {
    const F = new AbortController();
    return X(`/videos/${et.id}/incorrect-examples`, { signal: F.signal }).then(sn).catch((le) => {
      le.name !== "AbortError" && sn([]);
    }), () => F.abort();
  }, [et.id, d == null ? void 0 : d.effectiveMode]), be(() => {
    const F = new AbortController();
    return X(`/videos/${et.id}/history`, { signal: F.signal }).then((le) => {
      const De = le || jt;
      ie.current = De, H(De);
    }).catch((le) => {
      le.name !== "AbortError" && V(le.message || "Unable to load editor history.");
    }), () => F.abort();
  }, [et.id]), be(() => {
    Fd(ee);
  }, [ee.timelineRatio, ee.markerRailOpen, ee.detailWidth, ee.markerRailWidth, ee.swimlaneTitleWidth]), be(() => {
    Ld(ve);
  }, [ve]), be(() => {
    Vs(C);
  }, [C]), be(() => {
    const F = Cn.current;
    if (!a || !F || typeof ResizeObserver > "u") return;
    const le = () => {
      var $t;
      const ot = Math.max(0, F.clientHeight - ((($t = Yt.current) == null ? void 0 : $t.offsetHeight) || 0));
      me(ot), ue((mn) => {
        const Uo = uo(mn.timelineRatio, ot);
        return Uo === mn.timelineRatio ? mn : { ...mn, timelineRatio: Uo };
      });
    }, De = new ResizeObserver(le);
    return De.observe(F), Yt.current && De.observe(Yt.current), le(), () => De.disconnect();
  }, [a]), be(() => {
    if (!wn || typeof ResizeObserver > "u") return;
    const F = ln.current, le = $n.current;
    if (!F || !le) return;
    const De = () => te({
      workspace: F.clientWidth,
      focusRow: le.clientWidth,
      focusRowHeight: le.clientHeight
    }), ot = new ResizeObserver(De);
    return ot.observe(F), ot.observe(le), De(), () => ot.disconnect();
  }, [wn, ee.markerRailOpen]);
  const Qt = _e(
    () => xl(rt, E),
    [rt, E]
  ), dt = _e(
    () => ma(
      Kr(
        Qt,
        Ye,
        S,
        l && C,
        Ct
      ),
      Vt,
      !0
    ),
    [
      Qt,
      Ye,
      S,
      C,
      Ct,
      l,
      Vt
    ]
  ), Zt = Object.fromEntries(yt.map((F) => [F, dt.filter((le) => le.reviewState === F).length])), jn = ma(
    Kr(
      Qt,
      Ye,
      { ...S, reviewStates: yt },
      l && C,
      Ct
    ),
    Vt,
    !0
  ), Or = Object.fromEntries(yt.map((F) => [F, jn.filter((le) => le.reviewState === F).length])), Pr = [...new Set(rt.map((F) => F.sourceKey).filter(Boolean))].sort((F, le) => Rt(F).localeCompare(Rt(le))), Lr = Ps(
    S,
    l && C
  ), pt = _e(
    () => tn(dt, Ct, Ye),
    [dt, Ct, Ye]
  ), Pt = js(
    pt,
    m,
    s
  ), se = Pt == null ? null : rt.find((F) => F.id === Pt.id) || Pt, j = Jo(rt, Jo(dt, f).map((F) => F.id)), Pe = !l && j.length > 0 && j.every((F) => F.nativeSegmentId != null), ct = dt.map((F) => F.id), ut = ct.join("|");
  p.current = (se == null ? void 0 : se.id) ?? null;
  const Lt = dn.get(se == null ? void 0 : se.id) || [], Ft = bo(Lt), lr = _e(
    () => yd(pt, f),
    [pt, f]
  ), Fr = _e(() => ho(pt), [pt]), Bn = _e(
    () => pd(Fr, ve),
    [Fr, ve]
  ), Ci = _e(
    () => yi(
      Bn.rows,
      En.scrollTop,
      En.height
    ),
    [Bn, En]
  ), jr = _e(
    () => hd(pt, ve),
    [pt, ve]
  ), $i = hr(jr, se == null ? void 0 : se.id, -1, !0) != null, Ti = hr(jr, se == null ? void 0 : se.id, 1, !0) != null, cn = se ? Tt(pt, se.id) : null, Br = Ct.length > 0 ? Fr.map((F) => F.key) : [], Ai = Br.join("|"), dr = Math.max(
    0,
    Number((jo = et.videoFile) == null ? void 0 : jo.duration) || 0,
    ...rt.map((F) => Number(F.endSec ?? F.startSec) || 0)
  ), So = Number((Bo = et.videoFile) == null ? void 0 : Bo.duration) > 0 ? Number(et.videoFile.duration) : null;
  he.actions;
  const Ri = ei();
  be(() => {
    const F = m === xr ? m : (se == null ? void 0 : se.id) ?? null;
    F !== m && u(F);
  }, [se, m]), be(() => {
    g((F) => {
      const le = Ks(
        F,
        ct,
        (se == null ? void 0 : se.id) ?? null
      );
      return le.length === F.length && le.every((De, ot) => De === F[ot]) ? F : le;
    });
  }, [ut, se == null ? void 0 : se.id]);
  const un = (se == null ? void 0 : se.itemId) == null ? null : ((Go = e.itemMetadata) == null ? void 0 : Go[se.itemId]) || null, Mi = {
    key: (se == null ? void 0 : se.itemId) != null ? `item:${se.itemId}` : (se == null ? void 0 : se.nativeSegmentId) != null ? `native:${se.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (un == null ? void 0 : un.provenance) || (se == null ? void 0 : se.fieldProvenance) || [] : []
  }, Gr = (se == null ? void 0 : se.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (un == null ? void 0 : un.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  be(() => {
    ce(se == null ? "" : String(se.startSec)), oe((se == null ? void 0 : se.endSec) == null ? "" : String(se.endSec));
  }, [se == null ? void 0 : se.id, se == null ? void 0 : se.startSec, se == null ? void 0 : se.endSec]), be(() => {
    cn && ze((F) => vi(F, cn));
  }, [et.id, s, cn]), be(() => {
    ke((F) => kd(Br, F, cn));
  }, [et.id, Ai, cn]), be(() => {
    if (!ee.markerRailOpen || (se == null ? void 0 : se.id) == null) return;
    const F = Mn.current, le = Bn.rows.find(($t) => $t.kind === "segment" && $t.segment.id === se.id);
    if (!F || !le) return;
    const De = le.top + le.height;
    let ot = F.scrollTop;
    le.top < F.scrollTop ? ot = le.top : De > F.scrollTop + F.clientHeight && (ot = Math.max(0, De - F.clientHeight)), ot !== F.scrollTop && (F.scrollTop = ot), Dn({ scrollTop: ot, height: F.clientHeight });
  }, [se == null ? void 0 : se.id, Bn, ee.markerRailOpen]), be(() => {
    const F = Mn.current;
    if (!ee.markerRailOpen || !F) return;
    const le = () => Dn({
      scrollTop: F.scrollTop,
      height: F.clientHeight
    });
    if (typeof ResizeObserver > "u") {
      le();
      return;
    }
    const De = new ResizeObserver(le);
    return De.observe(F), le(), () => De.disconnect();
  }, [ee.markerRailOpen]);
  const { revealSegmentGroupForSelection: ko, replaceSegmentSelection: Ei, selectSegment: wo, selectSegmentCollection: Di, selectAllVideoSegments: Oi } = yc({
    allSwimlanes: pt,
    editorRef: gt,
    performerSlots: Ye,
    seekRef: Nn,
    segmentGroups: Ct,
    segments: rt,
    selectedSegmentId: m,
    selectedSegmentIds: f,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: b,
    setCollapsedSegmentGroups: ze,
    setEditorFilters: w,
    setHideDerivedSegments: $,
    setSaveMessage: V,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g
  }), { acceptHistory: Ur, recordHistoryAction: cr, mutateSegment: Pi, completeReview: Li, createSegment: No, splitSegment: Io, duplicateSegment: Co, saveTiming: Fi, applyShortcutTiming: ji } = Md({
    compatibilityMode: l,
    currentTime: R,
    detail: e,
    editorFilters: S,
    endInput: U,
    hideDerivedSegments: C,
    historyRef: ie,
    mediaDuration: So,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: Mr,
    pendingDuplicateRef: rr,
    pendingFirstSegmentStartSecRef: It,
    pendingTagEditSegmentIdRef: Rn,
    heldCreatedSegmentTag: E,
    setHeldCreatedSegmentTag: Q,
    replaceSegmentSelection: Ei,
    savingSegmentId: re,
    segments: rt,
    selectedSegment: se,
    selectedSegmentIdRef: p,
    selectedSegments: j,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: b,
    setCreatingSegmentId: pe,
    setEditorFilters: w,
    setFirstSegmentTagOpen: ge,
    setHideDerivedSegments: $,
    setHistory: H,
    setHistoryOpen: v,
    setPublishApprovedError: st,
    setSaveMessage: V,
    acquireSaveLock: z,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    setTagEditing: D,
    startInput: J,
    tagEditingRef: W,
    timelineDuration: dr,
    video: et
  });
  function $o(F = null) {
    var ot;
    if (!l || re != null || !rt.some(($t) => !$t.published && $t.reviewState === "approved")) return;
    const le = ((ot = gt.current) == null ? void 0 : ot.ownerDocument) ?? document, De = le.activeElement === le.body ? null : le.activeElement;
    de.current = F != null && F.isConnected && F !== le.body ? F : De, st(""), Ee(!0);
  }
  function To() {
    re == null && (Ee(!1), st(""), requestAnimationFrame(() => {
      kc(
        de.current,
        gt.current
      ), de.current = null;
    }));
  }
  async function Bi() {
    await Li() && To();
  }
  const { closeMergeConfirmation: Gi, mergeSelectedSwimlane: Ao, saveSelectedReviewState: Ro } = bc({
    acceptHistory: Ur,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: k,
    getSaveQueueSnapshot: I,
    historyRef: ie,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: Me,
    recordHistoryAction: cr,
    revealSegmentGroupForSelection: ko,
    savingSegmentId: re,
    selectedGroups: lr,
    selectedSegment: se,
    selectedSegmentIdRef: p,
    selectedSegments: j,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: b,
    setMergeConfirmation: Be,
    setSaveMessage: V,
    acquireSaveLock: z,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    video: et
  }), Ui = (F) => {
    Me.current = fl(
      Me.current,
      F
    );
  };
  be(() => {
    if (yr(O.getSnapshot()) != null) return;
    let F = !1;
    for (; Me.current.length > 0; ) {
      const le = Me.current.shift(), De = gl(le, rt);
      if (!De) {
        F = !0;
        continue;
      }
      Ro(
        De.requestedState,
        De.selectedSegments,
        De.selectedSegment
      );
      return;
    }
    F && V("The queued review could not find its segment after refreshing.");
  }, [re, rt]);
  const { toggleIncorrectExample: Ki, removeIncorrectExample: zi, captureTrainingExport: Hi, deleteRejectedSegments: Mo, autoAssignPerformers: _i, previewDerivedSegments: qi, closeMaterializeDialog: Wi, materializeDerivedSegments: Vi, saveTag: Ji, applyHeldCreatedSegmentTag: Yi, moveToBin: Qi, emptyRecyclingBin: Zi } = hc({
    acceptHistory: Ur,
    allSwimlanes: pt,
    autoAssignCandidates: zt,
    autoAssigning: Ke,
    binEmptyingRef: We,
    canMoveSelectionToBin: Pe,
    closeTagEditing: Ln,
    compatibilityMode: l,
    creatingSegmentId: K,
    detail: e,
    editorFilters: S,
    editorRef: gt,
    exportingExamples: kn,
    hideDerivedSegments: C,
    incorrectExamples: Vt,
    lineage: Gr,
    materializeButtonRef: Wt,
    materializePreview: mt,
    materializeRestoreFocusRef: Ot,
    materializing: on,
    mutateSegment: Pi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: Ye,
    heldCreatedSegmentTag: E,
    setHeldCreatedSegmentTag: Q,
    recordHistoryAction: cr,
    refreshMaterializationPreview: Er,
    removingExampleId: Zn,
    revealSegmentGroupForSelection: ko,
    savingSegmentId: re,
    segmentGroups: Ct,
    segments: rt,
    selectedSegment: se,
    selectedSegmentIdRef: p,
    selectedSegments: j,
    selectionAnchorIdRef: h,
    selectionRangeBaseIdsRef: b,
    setAutoAssignError: wt,
    setAutoAssignOpen: Re,
    setAutoAssigning: Et,
    setEditorFilters: w,
    setExportingExamples: Qn,
    setHideDerivedSegments: $,
    setIncorrectExamples: sn,
    setMaterializeError: xn,
    setMaterializeLoading: Ut,
    setMaterializeOpen: Gt,
    setMaterializePreview: it,
    setMaterializing: an,
    setRemovingExampleId: Rr,
    setRejectedDeletionPreview: Xe,
    setSaveMessage: V,
    acquireSaveLock: z,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: g,
    video: et
  });
  be(() => {
    const F = E, le = Sl(F, {
      segments: rt,
      savingSegmentId: yr(O.getSnapshot()),
      reviewSaving: Zr(O.getSnapshot(), "review"),
      tagEditing: N,
      selectedSegmentIds: f,
      activeSegmentId: se == null ? void 0 : se.id
    });
    le === "none" || le === "wait" || (Q(null), le === "apply" && Yi(F));
  }, [E, rt, re, se == null ? void 0 : se.id, f, N]);
  const { restoreHistoryTarget: Xi, updateTimelineRatio: Eo, handleSeparatorPointerDown: es, handleSeparatorPointerMove: ts, handleSeparatorKeyDown: ns, panelWidthMaximum: Do, panelSeparatorProps: rs, toggleSegmentRail: os, toggleSegmentGroup: Oo, mutateShotBoundary: as } = vc({
    acceptHistory: Ur,
    compatibilityMode: l,
    currentTime: R,
    detail: e,
    editorLayout: ee,
    focusRowRef: $n,
    history: he,
    historyRef: ie,
    historySaving: x,
    horizontalLayoutSize: ae,
    mediaStackHeight: Y,
    mediaStackRef: Cn,
    commonActionsRef: Yt,
    onDetailChange: t,
    onReload: o,
    railToggleRef: Tn,
    recordHistoryAction: cr,
    savingSegmentId: re,
    savingShot: L,
    savingShotRef: or,
    setCollapsedSegmentGroups: ze,
    setEditorLayout: ue,
    setHistorySaving: y,
    setIncorrectExamples: sn,
    setSaveMessage: V,
    acquireSaveLock: z,
    setSavingShot: G,
    shotBoundaries: Pn,
    timelineDuration: dr,
    video: et,
    workspaceRef: ln
  }), { executeShortcutById: Po, stepVideoFrame: is } = xc({
    allSwimlanes: pt,
    applyShortcutTiming: ji,
    centerTimelineRef: In,
    compatibilityMode: l,
    createSegment: No,
    currentTime: R,
    deleteRejectedSegments: Mo,
    duplicateSegment: Co,
    editorLayout: ee,
    editorRef: gt,
    emptyRecyclingBin: Zi,
    lineage: Gr,
    mediaDuration: So,
    mergeSelectedSwimlane: Ao,
    moveToBin: Qi,
    mutateShotBoundary: as,
    openPublishApprovedDialog: $o,
    playbackControlsRef: Xn,
    playbackShortcutConfig: Ri,
    saveSelectedReviewState: Ro,
    seekRef: Nn,
    segmentGroupKeys: Br,
    selectSegment: wo,
    selectedSegment: se,
    selectedSegmentGroupForSegment: cn,
    selectedSegmentGroupKey: Qe,
    selectedSegments: j,
    setCollapsedSegmentGroups: ze,
    setIncorrectExamplesOpen: Le,
    setQuickSearchOpen: Ne,
    setSaveMessage: V,
    setSelectedSegmentGroupKey: ke,
    setTagEditing: D,
    setTimelineZoom: xe,
    shotBoundaries: Pn,
    slotButtonRef: tr,
    splitSegment: Io,
    swimlanes: jr,
    timelineDuration: dr,
    toggleIncorrectExample: Ki,
    toggleSegmentGroup: Oo,
    updateTimelineRatio: Eo,
    videoFrameRate: Dr,
    visibleSegments: dt
  });
  Jt.current = Po;
  const ss = _e(() => Jn.map((F) => ({
    id: F.id,
    enabled: yn(F, l),
    surface: "local",
    action: (le) => {
      var De;
      return (De = Jt.current) == null ? void 0 : De.call(Jt, F.id, le);
    }
  })), [l]);
  Ma(so, ss);
  const ls = co(Y), ds = en(ee.markerRailWidth, Do("markerRailWidth")), cs = en(ee.detailWidth, Do("detailWidth"));
  return n(fc, {
    activeFilterCount: Lr,
    allSwimlanes: pt,
    analysisError: hn,
    analysisRun: lt,
    analysisStatus: $e,
    approvalFacetCounts: Or,
    autoAssignCandidates: zt,
    autoAssignError: Ge,
    autoAssignOpen: Fe,
    autoAssignPerformers: _i,
    autoAssigning: Ke,
    canMoveSelectionToBin: Pe,
    captureTrainingExport: Hi,
    cancelQueuedReviewsForSegments: Ui,
    removeIncorrectExample: zi,
    rejectedDeletionPreview: Te,
    centerTimelineRef: In,
    closeEditorFilters: Fn,
    closeFirstSegmentTagDialog: sr,
    closeMaterializeDialog: Wi,
    closeMergeConfirmation: Gi,
    closePublishApprovedDialog: To,
    closeTagEditing: Ln,
    collapsedSegmentGroups: ve,
    commonActionsRef: Yt,
    compatibilityMode: l,
    configuringTag: Ar,
    createSegment: No,
    currentTime: R,
    deleteRejectedSegments: Mo,
    detail: e,
    detailPanelRef: k,
    detailWidth: cs,
    duplicateSegment: Co,
    editorFilters: S,
    editorLayout: ee,
    editorRef: gt,
    exportingExamples: kn,
    filtersButtonRef: An,
    filtersOpen: P,
    firstSegmentTagOpen: q,
    focusRowRef: $n,
    handleSeparatorKeyDown: ns,
    handleSeparatorPointerDown: es,
    handleSeparatorPointerMove: ts,
    hideDerivedSegments: C,
    history: he,
    historyOpen: A,
    historySaving: x,
    hasNextUnreviewed: Ti,
    hasPreviousUnreviewed: $i,
    horizontalLayoutSize: ae,
    importNativeSegments: Ce,
    incorrectExamples: Vt,
    incorrectExamplesOpen: tt,
    removingExampleId: Zn,
    lineage: Gr,
    markerRailWidth: ds,
    materializeButtonRef: Wt,
    materializeCancelButtonRef: Sn,
    materializeDerivedSegments: Vi,
    materializeError: vn,
    materializeLoading: Nt,
    materializeOpen: nt,
    materializePreview: mt,
    materializing: on,
    mediaStackRef: Cn,
    mergeCancelButtonRef: Oe,
    mergeConfirmation: we,
    mergeSaving: Zr(_, "merge"),
    mergeSelectedSwimlane: Ao,
    nativeImportState: Je,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: $o,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: rs,
    pendingInitialSeekRef: er,
    performerSlots: Ye,
    performerSlotsAvailable: ir,
    playbackControlsRef: Xn,
    previewDerivedSegments: qi,
    provenance: Mi,
    provenanceSources: Pr,
    publishApprovedCancelButtonRef: Z,
    publishApprovedDrafts: Bi,
    publishApprovedError: qe,
    publishApprovedOpen: Ie,
    quickSearchOpen: He,
    railScrollRef: Mn,
    railToggleRef: Tn,
    recordHistoryAction: cr,
    restoreHistoryTarget: Xi,
    runEditorAction: Po,
    stepVideoFrame: is,
    saveMessage: ne,
    setSaveMessage: V,
    saveTag: Ji,
    saveTiming: Fi,
    savingSegmentId: re,
    acquireSaveLock: z,
    seekRef: Nn,
    segmentGroups: Ct,
    segmentRailLayout: Bn,
    segments: rt,
    selectAllVideoSegments: Oi,
    selectSegment: wo,
    selectSegmentCollection: Di,
    selectedGroups: lr,
    selectedPerformerSlots: Lt,
    selectedSegment: Pt,
    selectedSegmentGroupKey: Qe,
    selectedSegmentIds: f,
    selectedSegments: j,
    selectedSlotStatus: Ft,
    setAutoAssignError: wt,
    setAutoAssignOpen: Re,
    setConfiguringTag: Dt,
    setCurrentTime: T,
    setEditorFilters: w,
    setEditorLayout: ue,
    setFiltersOpen: M,
    setHideDerivedSegments: $,
    setHistoryOpen: v,
    setIncorrectExamplesOpen: Le,
    setQuickSearchOpen: Ne,
    setRejectedDeletionPreview: Xe,
    setRailViewport: Dn,
    setSelectedSegmentGroupKey: ke,
    setSelectedSegmentId: u,
    setShortcutsOpen: Ve,
    setTimelineZoom: xe,
    shotBoundaries: Pn,
    shortcutsOpen: Se,
    slotButtonRef: tr,
    splitLayout: a,
    splitSegment: Io,
    startFullAnalysis: xt,
    tagEditing: N,
    creatingSegmentId: K,
    tagSearchRef: nr,
    timelineDuration: dr,
    timelineRatioBounds: ls,
    timelineZoom: fe,
    toggleSegmentGroup: Oo,
    toggleSegmentRail: os,
    updateTimelineRatio: Eo,
    video: et,
    videoPerformers: On,
    visibleCounts: Zt,
    visibleSegmentRailRows: Ci,
    visibleSegments: dt,
    wideLayout: wn,
    workspaceRef: ln
  });
}
const Nc = /* @__PURE__ */ new Set(["queued", "running"]);
async function ka(e, t, r = 4) {
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
function wa(e, t) {
  return { videoId: e, error: (t == null ? void 0 : t.message) || String(t || "Unable to start Full Scan.") };
}
function Ic() {
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
async function Cc(e, t, r, o) {
  const i = [...new Set(e.map(Number).filter((g) => Number.isInteger(g) && g > 0))], a = [...new Set(t)].filter((g) => ["aiTagging", "omnishotcut"].includes(g));
  if (i.length === 0 || a.length === 0)
    return { queuedIds: [], failed: [], cancelled: !1 };
  const s = a.includes("omnishotcut"), l = await ka(i, async (g) => {
    try {
      const [p, h] = await Promise.all([
        r(`/videos/${g}/analysis-runs`),
        s ? r(`/videos/${g}/editor`) : null
      ]);
      if ((p || []).some((k) => Nc.has(k == null ? void 0 : k.status)))
        throw new Error("A Full Scan is already queued or running.");
      const b = (h == null ? void 0 : h.shotBoundaries) || [];
      return { videoId: g, shotBoundaries: b };
    } catch (p) {
      return wa(g, p);
    }
  }), d = l.filter((g) => !g.error), c = l.filter((g) => g.error), m = d.filter((g) => g.shotBoundaries.length > 0), u = m.reduce((g, p) => g + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${m.length} selected ${m.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await ka(d, async ({ videoId: g, shotBoundaries: p }) => {
    const h = s && p.length > 0;
    try {
      return await r(`/videos/${g}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: h,
          expectedShotBoundaryFingerprint: h ? Kn(p) : null
        })
      }), { videoId: g };
    } catch (b) {
      return wa(g, b);
    }
  });
  return {
    queuedIds: f.filter((g) => !g.error).map((g) => g.videoId),
    failed: [...c, ...f.filter((g) => g.error)],
    cancelled: !1
  };
}
function $c(e = [], t = []) {
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
function Tc(e = [], t = "", r = "all") {
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
function ft(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Ac(e = [], t = []) {
  var g;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, h) => (p.sortOrder ?? 0) - (h.sortOrder ?? 0) || Number(p.id) - Number(h.id)).forEach((p, h) => {
    [...p.tags || []].sort((b, k) => (b.sortOrder ?? 0) - (k.sortOrder ?? 0) || Number(b.tagId) - Number(k.tagId)).forEach((b, k) => r.set(Number(b.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? h,
      tagSortOrder: b.sortOrder ?? k
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, h) {
    const b = Number(p);
    if (!o.has(b)) {
      const k = r.get(b);
      o.set(b, {
        tagId: b,
        name: h || `Tag ${b}`,
        incomingRuleCount: 0,
        outgoingRuleCount: 0,
        segmentGroupKey: (k == null ? void 0 : k.key) || "ungrouped",
        segmentGroupId: (k == null ? void 0 : k.id) ?? null,
        segmentGroupName: (k == null ? void 0 : k.name) || "Ungrouped",
        segmentGroupSortOrder: (k == null ? void 0 : k.sortOrder) ?? Number.MAX_SAFE_INTEGER,
        segmentGroupTagSortOrder: (k == null ? void 0 : k.tagSortOrder) ?? Number.MAX_SAFE_INTEGER
      });
    }
    return o.get(b);
  }
  const a = /* @__PURE__ */ new Map();
  e.forEach((p) => {
    const h = i(p.sourceTagId, p.sourceTagName), b = i(p.derivedTagId, p.derivedTagName);
    h.outgoingRuleCount++, b.incomingRuleCount++;
    const k = `${h.tagId}:${b.tagId}`;
    a.has(k) || a.set(k, {
      id: k,
      sourceTagId: h.tagId,
      derivedTagId: b.tagId,
      rules: [],
      edgeCount: 0
    });
    const S = a.get(k);
    S.rules.push(p), S.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var h, b;
    (h = d.get(p.sourceTagId)) == null || h.add(p.derivedTagId), (b = d.get(p.derivedTagId)) == null || b.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), m = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const h = [p.tagId], b = [];
    for (c.add(p.tagId); h.length > 0; ) {
      const $ = h.shift();
      b.push($);
      for (const R of d.get($) || [])
        c.has(R) || (c.add(R), h.push(R));
    }
    const k = new Set(b), S = b.map(($) => o.get($)), w = l.filter(($) => k.has($.sourceTagId) && k.has($.derivedTagId)), P = w.flatMap(($) => $.rules), M = S.filter(($) => $.outgoingRuleCount === 0).sort(($, R) => ft($.name, R.name)), C = M.length > 0 ? M : [...S].sort(($, R) => ft($.name, R.name));
    m.push({
      id: [...b].sort(($, R) => $ - R).join(":"),
      label: C.length > 1 ? `${C[0].name} + ${C.length - 1}` : ((g = C[0]) == null ? void 0 : g.name) || "Derivation component",
      nodes: S,
      connections: w,
      rules: P,
      segmentGroupKeys: [...new Set(S.map(($) => $.segmentGroupKey))],
      materializedEdgeCount: P.reduce(
        ($, R) => $ + (Number(R.edgeCount) || 0),
        0
      )
    });
  }
  m.sort((p, h) => h.rules.length - p.rules.length || ft(p.label, h.label));
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
  }), m.forEach((p) => {
    p.nodes.forEach((h) => {
      var b;
      return (b = u.get(h.segmentGroupKey)) == null ? void 0 : b.componentIds.add(p.id);
    }), p.rules.forEach((h) => {
      var b, k;
      (b = u.get(o.get(Number(h.sourceTagId)).segmentGroupKey)) == null || b.ruleIds.add(h.id), (k = u.get(o.get(Number(h.derivedTagId)).segmentGroupKey)) == null || k.ruleIds.add(h.id);
    });
  });
  const f = [...u.values()].sort((p, h) => p.sortOrder - h.sortOrder || ft(p.name, h.name)).map((p) => ({
    ...p,
    ruleCount: p.ruleIds.size,
    componentCount: p.componentIds.size
  }));
  return {
    nodes: s,
    connections: l,
    components: m,
    segmentGroups: f
  };
}
function Rc(e, {
  minimumWidth: t = 720,
  minimumHeight: r = 420
} = {}) {
  if (!e || e.nodes.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  const m = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map((T) => [T.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach((T) => {
    var O, _;
    (O = m.get(T.sourceTagId)) == null || O.add(T.derivedTagId), (_ = u.get(T.derivedTagId)) == null || _.add(T.sourceTagId);
  });
  const f = new Map(e.nodes.map((T) => {
    var O;
    return [
      T.tagId,
      ((O = u.get(T.tagId)) == null ? void 0 : O.size) || 0
    ];
  })), g = new Map(e.nodes.map((T) => [T.tagId, 0])), p = e.nodes.filter((T) => f.get(T.tagId) === 0).sort((T, O) => ft(T.name, O.name)).map((T) => T.tagId), h = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const T = p.shift();
    if (!h.has(T)) {
      h.add(T);
      for (const O of m.get(T) || [])
        g.set(O, Math.max(g.get(O) || 0, (g.get(T) || 0) + 1)), f.set(O, f.get(O) - 1), f.get(O) === 0 && p.push(O);
    }
  }
  h.size !== e.nodes.length && e.nodes.filter((T) => !h.has(T.tagId)).sort((T, O) => ft(T.name, O.name)).forEach((T) => g.set(T.tagId, 0));
  const b = Math.max(0, ...g.values()), k = Math.max(
    t,
    240 + b * 296
  ), S = /* @__PURE__ */ new Map();
  e.nodes.forEach((T) => {
    S.has(T.segmentGroupKey) || S.set(T.segmentGroupKey, {
      key: T.segmentGroupKey,
      id: T.segmentGroupId,
      name: T.segmentGroupName,
      sortOrder: T.segmentGroupSortOrder,
      nodes: []
    }), S.get(T.segmentGroupKey).nodes.push(T);
  });
  const w = [...S.values()].sort((T, O) => T.sortOrder - O.sortOrder || ft(T.name, O.name));
  let P = 28;
  const M = [], C = w.map((T) => {
    const O = /* @__PURE__ */ new Map();
    T.nodes.forEach((L) => {
      const G = g.get(L.tagId) || 0;
      O.has(G) || O.set(G, []), O.get(G).push(L);
    });
    for (const L of O.values())
      L.sort((G, ne) => G.segmentGroupTagSortOrder - ne.segmentGroupTagSortOrder || ft(G.name, ne.name));
    const _ = Math.max(1, ...[...O.values()].map((L) => L.length)), re = _ * 58 + (_ - 1) * 18, z = 70 + re, I = {
      ...T,
      x: 12,
      y: P,
      width: k - 24,
      height: z
    };
    for (const [L, G] of O.entries()) {
      const ne = G.length * 58 + Math.max(0, G.length - 1) * 18, V = (re - ne) / 2;
      G.forEach((J, ce) => M.push({
        ...J,
        rank: L,
        x: 28 + L * 296,
        y: P + 34 + 18 + V + ce * 76,
        width: 184,
        height: 58
      }));
    }
    return P += z + 16, I;
  }), $ = new Map(M.map((T) => [T.tagId, T])), R = e.connections.map((T) => {
    const O = $.get(T.sourceTagId), _ = $.get(T.derivedTagId), re = O.x + O.width, z = O.y + O.height / 2, I = _.x, L = _.y + _.height / 2, G = Math.max(48, (I - re) * 0.48);
    return {
      ...T,
      path: `M ${re} ${z} C ${re + G} ${z}, ${I - G} ${L}, ${I} ${L}`
    };
  });
  return {
    width: k,
    height: Math.max(r, P - 16 + 28),
    nodes: M,
    connections: R,
    groups: C
  };
}
function Mc(e) {
  if (!e || e.length === 0)
    return { width: 720, height: 420, nodes: [], connections: [], groups: [] };
  let o = 20, i = 0;
  const a = [], s = [], l = [];
  return e.forEach((d) => {
    const c = Rc(d, {
      minimumWidth: 0,
      minimumHeight: 0
    }), m = 20, u = o, f = c.nodes.map((p) => ({
      ...p,
      x: p.x + m,
      y: p.y + u
    })), g = new Map(f.map((p) => [p.tagId, p]));
    a.push(...f), l.push(...c.groups.map((p) => ({
      ...p,
      componentId: d.id,
      x: p.x + m,
      y: p.y + u
    }))), s.push(...c.connections.map((p) => {
      const h = g.get(p.sourceTagId), b = g.get(p.derivedTagId), k = h.x + h.width, S = h.y + h.height / 2, w = b.x, P = b.y + b.height / 2, M = Math.max(48, (w - k) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${k} ${S} C ${k + M} ${S}, ${w - M} ${P}, ${w} ${P}`
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
function Na(e, t = []) {
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
function Ec(e, t, r) {
  return (e == null ? void 0 : e.type) === "rule" ? t.find((o) => o.id === e.id) || null : e == null && !r && t[0] || null;
}
function Dc(e) {
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: m, editorRef: u, emptyDraft: f, graph: g, layout: p, listSort: h, materializationOffer: b, materializeOutgoingRules: k, materializeRule: S, message: w, normalizedQuery: P, query: M, refreshConfiguredTag: C, revealEditor: $, rules: R, save: T, segmentGroupKey: O, selectedNode: _, selectedRule: re, selection: z, setConfiguringTag: I, setDraft: L, setListSort: G, setMaterializationOffer: ne, setQuery: V, setSegmentGroupKey: J, setSelection: ce, setView: U, sortedVisibleRules: oe, sourceSlots: fe, sourceSlotsLoading: xe, updateMapping: ee, updateTag: ue, view: Y, visibleComponents: me, visibleRules: ae } = e;
  function te(v) {
    const x = g.nodes.find((N) => N.tagId === Number(v.sourceTagId)), y = g.nodes.find((N) => N.tagId === Number(v.derivedTagId));
    return (x == null ? void 0 : x.segmentGroupKey) === (y == null ? void 0 : y.segmentGroupKey) ? x.segmentGroupKey : "cross-group";
  }
  function he() {
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
          onClick: () => L(null),
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
              onChange: (v, x) => ue("source", v, x == null ? void 0 : x.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !xe && fe.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (v) => I({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: v.currentTarget
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
              onChange: (v, x) => ue("derived", v, x == null ? void 0 : x.label),
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
              onClick: (v) => I({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: v.currentTarget
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
            disabled: r || fe.length === 0 || s.length === 0,
            onClick: () => L((v) => ({
              ...v,
              slotMappings: [...v.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((v, x) => n("div", { key: x, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: v.sourceSlotDefinitionId,
              disabled: r,
              onChange: (y) => ee(x, "sourceSlotDefinitionId", y.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...fe.map((y) => n("option", { key: y.id, value: y.id }, bt(y)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: v.derivedSlotDefinitionId,
              disabled: r,
              onChange: (y) => ee(x, "derivedSlotDefinitionId", y.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((y) => n("option", { key: y.id, value: y.id }, bt(y)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => L((y) => ({
                ...y,
                slotMappings: y.slotMappings.filter((N, D) => D !== x)
              })),
              className: `${o} shrink-0 text-red-300`,
              "aria-label": `Remove performer slot mapping ${x + 1}`,
              title: "Remove mapping"
            }, "🗑")
          ]))
        ])
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "save",
          type: "button",
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((v) => !v.sourceSlotDefinitionId || !v.derivedSlotDefinitionId),
          onClick: T,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => L(null), className: o }, "Cancel")
      ])
    ]);
  }
  function H() {
    if (_) {
      const y = ae.filter((W) => Number(W.derivedTagId) === _.tagId), N = ae.filter((W) => Number(W.sourceTagId) === _.tagId), D = (W, K, pe) => n("div", {
        key: W.id,
        className: "space-y-2 rounded-md border border-border bg-card p-2"
      }, [
        n("div", {
          key: "relationship",
          className: "text-xs"
        }, [
          n("span", { key: "direction", className: "block text-secondary" }, K),
          n(
            "span",
            { key: "relationship", className: "mt-0.5 block font-medium text-foreground" },
            `${W.sourceTagName} → ${W.derivedTagName}`
          )
        ]),
        n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
          pe ? n("button", {
            key: "materialize",
            type: "button",
            disabled: r || d != null,
            onClick: () => S(W),
            className: o
          }, "Materialize") : null,
          n("button", {
            key: "edit",
            type: "button",
            disabled: r || d != null,
            onClick: () => m(W, !0),
            className: o
          }, "Edit rule"),
          n("button", {
            key: "delete",
            type: "button",
            disabled: r || d != null,
            onClick: () => a(W),
            className: `${o} text-red-300`
          }, "Delete")
        ])
      ]);
      return n("div", { key: "node-details", className: "space-y-4 p-4" }, [
        n("div", { key: "identity" }, [
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, _.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, _.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${_.incomingRuleCount} incoming · ${_.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (W) => I({
            tagId: _.tagId,
            tagName: _.name,
            trigger: W.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        N.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => k(_, N),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${N.length})`) : null,
        N.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...N.map((W) => D(W, "Derives", !0))
        ]) : null,
        y.length ? n("details", {
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
              y.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            y.map((W) => D(W, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!re)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const v = g.nodes.find((y) => y.tagId === Number(re.sourceTagId)), x = g.nodes.find((y) => y.tagId === Number(re.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (v == null ? void 0 : v.segmentGroupName) || "Ungrouped"),
          (v == null ? void 0 : v.segmentGroupKey) !== (x == null ? void 0 : x.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(x == null ? void 0 : x.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${re.sourceTagName} → ${re.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${re.edgeCount} materialized lineage edge${re.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (b == null ? void 0 : b.ruleId) === re.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
        n(
          "p",
          { key: "summary", className: "text-sm font-medium text-foreground" },
          `${b.createCount + b.linkCount} pending derivation${b.createCount + b.linkCount === 1 ? "" : "s"}`
        ),
        n(
          "p",
          { key: "details", className: "text-xs text-secondary" },
          `${b.createCount} new segments · ${b.linkCount} existing segments to link`
        ),
        n("div", { key: "actions", className: "flex gap-2" }, [
          n("button", {
            key: "materialize",
            type: "button",
            disabled: r,
            onClick: () => S(re, b),
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
        re.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : re.slotMappings.map((y, N) => n("div", {
          key: `${y.sourceSlotDefinitionId}:${y.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: y.sourceSlotLabel || "Unnamed slot" },
            y.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: y.derivedSlotLabel || "Unnamed slot" },
            y.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          re.createdAt ? new Date(re.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          re.updatedAt ? new Date(re.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => S(re),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => m(re),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(re),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ie() {
    if (me.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, P ? "No derivation relationships match your search." : "No derivation rules.");
    const v = _ == null ? void 0 : _.tagId, x = /* @__PURE__ */ new Set();
    return _ && (x.add(_.tagId), p.connections.forEach((y) => {
      (y.sourceTagId === _.tagId || y.derivedTagId === _.tagId) && (x.add(y.sourceTagId), x.add(y.derivedTagId));
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
        ...p.groups.map((y) => n("div", {
          key: `group:${y.componentId}:${y.key}`,
          className: `absolute rounded-xl border ${O === y.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${y.x}px`,
            top: `${y.y}px`,
            width: `${y.width}px`,
            height: `${y.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: y.name
        }, y.name))),
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
          ...p.connections.map((y) => {
            const N = v === y.sourceTagId || v === y.derivedTagId, D = _ != null, W = N ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${y.id}:visible`,
              d: y.path,
              fill: "none",
              stroke: W,
              strokeWidth: N ? 2.5 : 1.5,
              opacity: D && !N ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((y) => {
          const N = !P || y.name.toLocaleLowerCase().includes(P), D = _ != null, W = x.has(y.tagId), K = (_ == null ? void 0 : _.tagId) === y.tagId;
          return n("button", {
            key: `node:${y.tagId}`,
            type: "button",
            onClick: () => ce({ type: "node", id: y.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${K ? "border-accent bg-accent/15 ring-2 ring-accent/25" : W ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${y.x}px`,
              top: `${y.y}px`,
              width: `${y.width}px`,
              height: `${y.height}px`,
              opacity: !N || D && !W ? 0.62 : 1
            },
            title: `${y.name} — ${y.segmentGroupName}`,
            "aria-label": `${y.name}, ${y.incomingRuleCount} incoming and ${y.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, y.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${y.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${y.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((y) => y.rules.length > 1).map((y) => {
          const N = p.nodes.find((W) => W.tagId === y.sourceTagId), D = p.nodes.find((W) => W.tagId === y.derivedTagId);
          return n("div", {
            key: `bundle:${y.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(N.x + N.width + D.x) / 2 - 24}px`,
              top: `${(N.y + N.height / 2 + D.y + D.height / 2) / 2 - 10}px`
            },
            "aria-label": `${y.rules.length} rules connect ${y.rules[0].sourceTagName} to ${y.rules[0].derivedTagName}`
          }, `${y.rules.length} rules`);
        })
      ])
    ]);
  }
  function A() {
    if (me.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        P ? "No derivation relationships match your search." : "No derivation rules."
      );
    const v = /* @__PURE__ */ new Map();
    oe.forEach((y) => {
      const N = te(y);
      v.has(N) || v.set(N, []), v.get(N).push(y);
    });
    const x = [
      ...g.segmentGroups.map((y) => y.key),
      "cross-group"
    ].filter((y) => v.has(y));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, x.map((y) => {
      const N = g.segmentGroups.find((K) => K.key === y), D = y === "cross-group" ? "Cross-group relationships" : (N == null ? void 0 : N.name) || "Ungrouped", W = v.get(y);
      return n("section", { key: y, "aria-label": D }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, D),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${W.length} rule${W.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${D} derivation rules` }, [
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
          ...W.map((K) => n("button", {
            key: K.id,
            type: "button",
            role: "row",
            onClick: () => ce({ type: "rule", id: K.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(re == null ? void 0 : re.id) === K.id ? "bg-accent/10" : ""}`,
            style: { gridTemplateColumns: "minmax(15rem, 1fr) 7rem 7rem" }
          }, [
            n(
              "span",
              { key: "relationship", role: "cell", className: "min-w-0 truncate font-medium text-foreground", title: `${K.sourceTagName} → ${K.derivedTagName}` },
              `${K.sourceTagName} → ${K.derivedTagName}`
            ),
            n("span", { key: "mappings", role: "cell", className: "text-secondary" }, String(K.slotMappings.length)),
            n("span", { key: "materialized", role: "cell", className: "text-right text-secondary" }, String(K.edgeCount))
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
          `${R.length} rules · ${g.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          L(f()), ce(null), $();
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
          value: M,
          onChange: (v) => {
            V(v.target.value), ce(null);
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
          onChange: (v) => {
            J(v.target.value), ce(null), L(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...g.segmentGroups.map((v) => n("option", { key: v.key, value: v.key }, v.name))
        ])
      ]),
      Y === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: h,
          onChange: (v) => G(v.target.value),
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
        ].map(([v, x]) => n("button", {
          key: v,
          type: "button",
          onClick: () => {
            U(v), v === "graph" && (z == null ? void 0 : z.type) === "rule" && ce(null);
          },
          "aria-pressed": Y === v,
          className: `rounded px-3 py-1.5 text-sm font-medium ${Y === v ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
        }, x))
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
        Y === "graph" ? ie() : A()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? he() : H()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      w ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, w) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => C(i),
      onClose: () => {
        const v = i.trigger;
        I(null), requestAnimationFrame(() => {
          v != null && v.isConnected && v.focus();
        });
      }
    }) : null
  ]);
}
function Oc({ segmentGroups: e = [], onSegmentGroupsChanged: t }) {
  const r = () => ({
    ruleId: null,
    sourceTagId: null,
    sourceTagName: "",
    derivedTagId: null,
    derivedTagName: "",
    slotMappings: [],
    slotMappingsSuggested: !1
  }), [o, i] = B([]), [a, s] = B(null), [l, d] = B([]), [c, m] = B([]), [u, f] = B(!1), [g, p] = B(!1), [h, b] = B(!1), [k, S] = B(""), [w, P] = B(""), [M, C] = B("graph"), [$, R] = B("all"), [T, O] = B(null), [_, re] = B("relationship"), [z, I] = B(null), [L, G] = B(null), ne = ye(null), V = ye(null), J = ii().replace(/:/g, "");
  function ce() {
    requestAnimationFrame(() => {
      var E;
      return (E = ne.current) == null ? void 0 : E.scrollIntoView({ block: "nearest" });
    });
  }
  async function U(E) {
    const Q = await X("/derivation-rules", E ? { signal: E } : void 0);
    i(Q || []);
  }
  be(() => {
    const E = new AbortController();
    return U(E.signal).catch((Q) => {
      Q.name !== "AbortError" && S(Q.message || "Unable to load derived segment rules.");
    }), () => E.abort();
  }, []), be(() => {
    const E = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), X(`/slot-definitions/${a.sourceTagId}`, { signal: E.signal }).then((Q) => d(Q.definitions || [])).catch((Q) => {
      Q.name !== "AbortError" && d([]);
    }).finally(() => {
      E.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), X(`/slot-definitions/${a.derivedTagId}`, { signal: E.signal }).then((Q) => m(Q.definitions || [])).catch((Q) => {
      Q.name !== "AbortError" && m([]);
    }).finally(() => {
      E.signal.aborted || p(!1);
    })) : (m([]), p(!1)), () => E.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), be(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || g)
      return;
    const E = `${a.sourceTagId}:${a.derivedTagId}`;
    V.current !== E && (V.current = E, s((Q) => !Q || Number(Q.sourceTagId) !== Number(a.sourceTagId) || Number(Q.derivedTagId) !== Number(a.derivedTagId) ? Q : dd(Q, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    g
  ]);
  function oe(E, Q = !1) {
    Q || O({ type: "rule", id: E.id }), V.current = null, s({
      ruleId: E.id,
      sourceTagId: E.sourceTagId,
      sourceTagName: E.sourceTagName,
      derivedTagId: E.derivedTagId,
      derivedTagName: E.derivedTagName,
      slotMappings: E.slotMappings.map((q) => ({
        sourceSlotDefinitionId: q.sourceSlotDefinitionId,
        derivedSlotDefinitionId: q.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), S(""), ce();
  }
  function fe(E, Q, q = "") {
    V.current = null, E === "source" ? (d([]), f(Q != null)) : (m([]), p(Q != null)), s((ge) => ({
      ...ge,
      [`${E}TagId`]: Q == null ? null : Number(Q),
      [`${E}TagName`]: q || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function xe(E) {
    (a == null ? void 0 : a.ruleId) == null && (V.current = null);
    const Q = [U(), t == null ? void 0 : t()];
    return E.draftKind === "source" ? (f(!0), Q.push(X(`/slot-definitions/${E.tagId}`).then((q) => d(q.definitions || [])).finally(() => f(!1)))) : E.draftKind === "derived" && (p(!0), Q.push(X(`/slot-definitions/${E.tagId}`).then((q) => m(q.definitions || [])).finally(() => p(!1)))), Promise.all(Q);
  }
  function ee(E, Q, q) {
    s((ge) => ({
      ...ge,
      slotMappings: ge.slotMappings.map((we, Be) => Be === E ? { ...we, [Q]: q } : we)
    }));
  }
  async function ue() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const E = Na(a, o);
    if (E) {
      S(E.message);
      return;
    }
    if (a.slotMappings.some((Q) => !Q.sourceSlotDefinitionId || !Q.derivedSlotDefinitionId)) {
      S("Complete or remove every performer slot mapping before saving.");
      return;
    }
    b(!0), S(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let Q = null;
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
        Q = ge.fingerprint;
      }
      S("Saving derived segment rule…");
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
      if (await U(), O(M === "graph" ? { type: "node", id: Number(q.sourceTagId) } : { type: "rule", id: q.id }), s(null), a.ruleId == null)
        try {
          const ge = await X(
            `/derivation-rules/${q.id}/materialization/preview`,
            { method: "POST" }
          );
          I(
            ge.createCount + ge.linkCount > 0 ? ge : null
          ), S(ge.createCount + ge.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          I(null), S("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        I(null), S("Derived segment rule saved. Previous materializations were removed.");
    } catch (Q) {
      S(Q.message || "Unable to save derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function Y(E) {
    b(!0), S("Previewing rule deletion…");
    try {
      const Q = await X(
        `/derivation-rules/${E.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${E.sourceTagName} → ${E.derivedTagName}?

Deleted segments: ${Q.deletedSegmentCount}
Removed lineage edges: ${Q.removedEdgeCount}
Shared derived segments retained: ${Q.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const q = `derivation-rule-delete:${E.id}:${Q.fingerprint}`;
      await X(`/derivation-rules/${E.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(q),
          fingerprint: Q.fingerprint
        })
      }), Ue(q), await U(), (a == null ? void 0 : a.ruleId) === E.id && s(null), (T == null ? void 0 : T.type) === "rule" && T.id === E.id && O(null), (z == null ? void 0 : z.ruleId) === E.id && I(null), S(`Rule deleted with ${Q.deletedSegmentCount} exclusively derived segment${Q.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (Q) {
      S(Q.message || "Unable to delete derived segment rule.");
    } finally {
      b(!1);
    }
  }
  async function me(E, Q = null) {
    const q = Q || await X(
      `/derivation-rules/${E.id}/materialization/preview`,
      { method: "POST" }
    );
    if (q.createCount + q.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const ge = `derivation-rule-materialize:${E.id}:${q.fingerprint}`, we = await X(`/derivation-rules/${E.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: je(ge),
        fingerprint: q.fingerprint
      })
    });
    return Ue(ge), we;
  }
  async function ae(E, Q = null) {
    b(!0), S("Finding pending derivations…");
    try {
      const q = await me(E, Q);
      if (I(null), await U(), q.createdCount + q.linkedCount === 0) {
        S("Every applicable derivation is already materialized.");
        return;
      }
      S(
        `${q.createdCount} derived segment${q.createdCount === 1 ? "" : "s"} created and ${q.linkedCount} existing segment${q.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (q) {
      S(q.message || "Unable to materialize pending derivations.");
    } finally {
      b(!1);
    }
  }
  async function te(E, Q) {
    if (Q.length === 0) return;
    b(!0), S(`Finding pending derivations from ${E.name}…`);
    let q = 0, ge = 0;
    try {
      for (const we of Q) {
        const Be = await me(we);
        q += Be.createdCount, ge += Be.linkedCount;
      }
      I(null), await U(), S(q + ge === 0 ? `Every outgoing derivation from ${E.name} is already materialized.` : `${q} derived segment${q === 1 ? "" : "s"} created and ${ge} existing segment${ge === 1 ? "" : "s"} linked from ${E.name}.`);
    } catch (we) {
      await U().catch(() => {
      }), S(we.message || `Unable to materialize derivations from ${E.name}.`);
    } finally {
      b(!1);
    }
  }
  const he = Na(a, o), H = _e(
    () => Ac(o, e),
    [o, e]
  ), ie = w.trim().toLocaleLowerCase(), v = H.components.filter((E) => $ === "all" || E.segmentGroupKeys.includes($)).filter((E) => !ie || E.nodes.some((Q) => Q.name.toLocaleLowerCase().includes(ie))), x = v.flatMap((E) => E.rules), y = new Set(
    v.flatMap((E) => E.nodes.map((Q) => Q.tagId))
  ), N = _e(
    () => Mc(v),
    [v]
  ), D = M === "list" ? Ec(
    T,
    x,
    ie.length > 0
  ) : null, W = (T == null ? void 0 : T.type) === "node" && H.nodes.find((E) => E.tagId === T.id && y.has(E.tagId)) || null, K = [...x].sort((E, Q) => _ === "source" ? ft(E.sourceTagName, Q.sourceTagName) || ft(E.derivedTagName, Q.derivedTagName) : _ === "target" ? ft(E.derivedTagName, Q.derivedTagName) || ft(E.sourceTagName, Q.sourceTagName) : _ === "materialized" ? (Number(Q.edgeCount) || 0) - (Number(E.edgeCount) || 0) || ft(E.sourceTagName, Q.sourceTagName) : ft(
    `${E.sourceTagName} ${E.derivedTagName}`,
    `${Q.sourceTagName} ${Q.derivedTagName}`
  ));
  return n(Dc, {
    arrowMarkerId: J,
    busy: h,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: L,
    deleteRule: Y,
    derivedSlots: c,
    derivedSlotsLoading: g,
    draft: a,
    draftIssue: he,
    editRule: oe,
    editorRef: ne,
    emptyDraft: r,
    graph: H,
    layout: N,
    listSort: _,
    materializationOffer: z,
    materializeOutgoingRules: te,
    materializeRule: ae,
    message: k,
    normalizedQuery: ie,
    query: w,
    refreshConfiguredTag: xe,
    revealEditor: ce,
    rules: o,
    save: ue,
    segmentGroupKey: $,
    selectedNode: W,
    selectedRule: D,
    selection: T,
    setConfiguringTag: G,
    setDraft: s,
    setListSort: re,
    setMaterializationOffer: I,
    setQuery: P,
    setSegmentGroupKey: R,
    setSelection: O,
    setView: C,
    sortedVisibleRules: K,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: ee,
    updateTag: fe,
    view: M,
    visibleComponents: v,
    visibleRules: x
  });
}
function Pc() {
  const [e, t] = B(ei), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => ta({ ...l, [a]: s }));
  }
  function i() {
    t(ta(lo));
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
        onChange: (m) => o(a, m.target.value),
        className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
      })
    ])))
  ]);
}
function Lc({ active: e, segmentGroups: t, onSegmentGroupsChanged: r }) {
  const [o, i] = B([]), [a, s] = B(!1), [l, d] = B(!1), [c, m] = B(""), [u, f] = B(""), [g, p] = B("all"), [h, b] = B(() => /* @__PURE__ */ new Set()), [k, S] = B(null);
  be(() => {
    if (!e || a) return;
    const I = new AbortController();
    return d(!0), m(""), X("/slot-definitions", { signal: I.signal }).then((L) => {
      i(L || []), s(!0);
    }).catch((L) => {
      L.name !== "AbortError" && m(L.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      I.signal.aborted || d(!1);
    }), () => I.abort();
  }, [e, a]);
  async function w() {
    d(!0), m("");
    try {
      const I = await X("/slot-definitions");
      i(I || []), s(!0);
    } catch (I) {
      m(I.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function P() {
    const [I] = await Promise.all([
      X("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(I || []), s(!0), m("");
  }
  function M() {
    const I = k == null ? void 0 : k.trigger;
    S(null), requestAnimationFrame(() => {
      I != null && I.isConnected && I.focus({ preventScroll: !0 });
    });
  }
  function C(I) {
    b((L) => {
      const G = new Set(L);
      return G.has(I) ? G.delete(I) : G.add(I), G;
    });
  }
  const $ = _e(
    () => $c(t, o),
    [t, o]
  ), R = _e(
    () => Tc($, u, g),
    [$, u, g]
  ), T = $.flatMap((I) => I.tags), O = T.filter((I) => I.definitions.length > 0).length, _ = T.length - O, re = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], z = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${T.length} tags · ${O} with slots · ${_} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (I) => f(I.target.value),
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
          re.map(([I, L]) => n("button", {
            key: I,
            type: "button",
            onClick: () => p(I),
            "aria-pressed": g === I,
            className: `rounded px-3 py-1.5 text-xs font-medium ${g === I ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, L))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => b(/* @__PURE__ */ new Set()),
          className: z
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => b(new Set($.map((I) => I.overviewKey))),
          className: z
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
    a && R.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, R.map((I) => {
      const L = h.has(I.overviewKey), G = I.tags.filter((ne) => ne.definitions.length > 0).length;
      return n("article", {
        key: I.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => C(I.overviewKey),
          "aria-expanded": !L,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, L ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, I.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${I.tags.length} tag${I.tags.length === 1 ? "" : "s"} · ${G} with slots`
          )
        ]),
        L ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          I.tags.map((ne) => n("li", {
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
            }, ne.definitions.map((V) => n("li", {
              key: V.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, bt(V)),
              ...(V.genderHints || []).map((J) => n("span", {
                key: J,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, Ir(J)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (V) => S({
                tagId: ne.tagId,
                tagName: ne.tagName,
                trigger: V.currentTarget
              }),
              "aria-label": `Edit performer slots for ${ne.tagName}`,
              className: `${z} self-start`,
              style: { marginLeft: "auto", flexShrink: 0 }
            }, "Edit")
          ]))
        )
      ]);
    })) : null,
    k ? n(xo, {
      key: `performer-slots-configure:${k.tagId}`,
      tagId: k.tagId,
      tagName: k.tagName,
      onSaved: P,
      onClose: M
    }) : null
  ]);
}
function Fc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = B("general"), [a, s] = B([]), [l, d] = B(!1), [c, m] = B(""), [u, f] = B(""), [g, p] = B(null), [h, b] = B(!0), [k, S] = B(!1), [w, P] = B(""), [M, C] = B(!0), [$, R] = B(_a), T = $l(t), O = T.map(([L]) => L);
  be(() => {
    O.includes(o) || i(O[0] || "general");
  }, [t.effectiveMode]);
  async function _(L) {
    const G = await X("/segment-groups", L ? { signal: L } : void 0);
    s(G || []);
  }
  be(() => {
    const L = new AbortController();
    return _(L.signal).catch((G) => {
      G.name !== "AbortError" && m(G.message || "Unable to load tag groups.");
    }), () => L.abort();
  }, []), be(() => {
    if (t.effectiveMode !== "full") {
      b(!1);
      return;
    }
    const L = new AbortController();
    return P(""), b(!0), Promise.all([
      X("/analysis/settings", { signal: L.signal }),
      X("/analysis/status", { signal: L.signal })
    ]).then(([G, ne]) => {
      C(!0), f((G == null ? void 0 : G.baseUrl) || ""), p(ne);
    }).catch((G) => {
      if (G.name !== "AbortError") {
        if (G.status === 403) {
          C(!1), P("You do not have permission to manage the analysis service connection.");
          return;
        }
        P(G.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      L.signal.aborted || b(!1);
    }), () => L.abort();
  }, [t.effectiveMode]);
  async function re(L) {
    if (L !== t.requestedMode) {
      d(!0), m("");
      try {
        const G = await X(
          `/preferences/transition?mode=${encodeURIComponent(L)}`
        );
        let ne = !1, V = null, J = null, ce = null, U = !1;
        if (t.requestedMode === "basic" && L === "full") {
          if (!window.confirm(Rl(
            G.recyclingBinCount,
            G.protectedRecyclingBinCount
          )))
            return;
          U = !0, G.recyclingBinCount > 0 && (ne = !0, ce = G.recyclingBinFingerprint, V = `mode-switch-empty-bin:${ce}`, J = je(V));
        }
        let oe = !1;
        if (t.requestedMode === "full" && L === "basic") {
          if (!window.confirm(Al(
            G.extensionOwnedSegmentCount
          )))
            return;
          oe = !0;
        }
        const fe = await X("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: L,
            confirmHiddenExtensionOwnedSegments: oe,
            confirmBasicHistoryCleanup: U,
            emptyRecyclingBin: ne,
            operationId: J,
            expectedRecyclingBinFingerprint: ce
          })
        });
        V && Ue(V), r == null || r(ti(fe)), m("Workflow mode saved.");
      } catch (G) {
        m(G.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function z(L) {
    L.preventDefault(), S(!0), P("");
    try {
      const G = await X("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((G == null ? void 0 : G.baseUrl) || "");
      const ne = await X("/analysis/status");
      p(ne), P(G != null && G.baseUrl ? ne != null && ne.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(ne == null ? void 0 : ne.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (G) {
      P(G.message || "Unable to save analysis service settings.");
    } finally {
      S(!1);
    }
  }
  const I = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (L) => Si(L, e, I), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      T.map(([L, G]) => n("button", {
        key: L,
        type: "button",
        onClick: () => i(L),
        "aria-current": o === L ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === L ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, G))
    ),
    n(
      "div",
      { key: "playback-shortcuts-panel", hidden: o !== "shortcuts" },
      n(Pc)
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
      n(Zd, {
        key: "selector",
        mode: t.legacyCompatibilityRequired ? t.effectiveMode : t.requestedMode,
        onModeChange: re,
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
          checked: $,
          onChange: (L) => {
            const G = L.target.checked;
            qa(G), R(G);
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
      n("form", { key: "form", onSubmit: z, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
        n("label", { key: "url", className: "min-w-0 flex-1 space-y-1" }, [
          n("span", { key: "label", className: "block text-sm font-medium text-foreground" }, "Server URL"),
          n("input", {
            key: "input",
            type: "url",
            value: u,
            onChange: (L) => f(L.target.value),
            placeholder: "http://segment-studio-analysis:8766",
            autoComplete: "off",
            spellCheck: !1,
            disabled: h || k || !M,
            className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground"
          })
        ]),
        n("button", {
          key: "save",
          type: "submit",
          disabled: h || k || !M,
          className: "rounded-md bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground disabled:opacity-50"
        }, k ? "Saving…" : "Save")
      ]),
      n(
        "p",
        { key: "status", className: "text-xs text-secondary", role: "status" },
        w || (h ? "Loading analysis service settings…" : (g == null ? void 0 : g.configured) === !1 ? "Full Scan is not configured." : g != null && g.ready ? "Analysis service is ready." : (g == null ? void 0 : g.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    O.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Oc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => _()
      })
    ) : null,
    O.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(Lc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => _()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ia({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, bt(a)),
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
function jc({ item: e, selected: t, busy: r, onSelect: o, onRestore: i, onPurge: a }) {
  var m, u;
  const s = [...e.slots || []].sort((f, g) => f.sortOrder - g.sortOrder || String(f.slotDefinitionId).localeCompare(String(g.slotDefinitionId))), l = [...new Map(s.map((f) => [
    f.performerId,
    { id: f.performerId, name: f.performerName }
  ])).values()], d = s.map((f) => ({
    slotDefinitionId: f.slotDefinitionId,
    label: bt(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = ri(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: mi(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((m = e.activity) == null ? void 0 : m.name) || "segment"}, ${e.reviewState}, ${Ae(e.startSec)} to ${e.endSec == null ? "end of video" : Ae(e.endSec)}` }, [
      n("div", { key: "image", className: "relative aspect-video bg-black" }, [
        n("img", {
          key: "image",
          src: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
          alt: "",
          loading: "lazy",
          className: "h-full w-full object-cover"
        }),
        n("span", { key: "time", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 font-mono text-[11px] text-white" }, e.endSec == null ? `${Ae(e.startSec)} → end` : `${Ae(e.startSec)} – ${Ae(e.endSec)}`)
      ]),
      n("div", { key: "body", className: "flex flex-col gap-1.5 p-2.5" }, [
        n("div", { key: "segment", className: "flex min-w-0 items-center gap-1.5" }, [
          n(rn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Cr, {
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
function Bc({ item: e, index: t, count: r, onPrevious: o, onNext: i, onClose: a, onNavigate: s }) {
  if (!e) return null;
  const l = e.videoFile;
  return n("section", { "aria-label": "Selected segment player", className: "sticky top-2 z-20 mx-auto w-full max-w-2xl space-y-3 rounded-lg border border-border bg-surface p-3 shadow-lg" }, [
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ra, {
      streamUrl: `/api/stream/video/${e.videoId}`,
      posterUrl: `/api/stream/video/${e.videoId}/screenshot?seconds=${encodeURIComponent(e.startSec)}&v=${encodeURIComponent(e.videoUpdatedAt || "")}`,
      format: l.format,
      audioCodec: l.audioCodec,
      duration: l.duration,
      videoId: e.videoId,
      clip: { start: e.startSec, end: Dl(e), loop: !1 },
      autostart: !0,
      trackingEnabled: !1
    })) : n("p", { key: "missing", className: "p-6 text-center text-sm text-secondary" }, "This segment has no playable file."),
    n("div", { key: "controls", className: "flex flex-wrap items-center gap-2" }, [
      n("button", { key: "previous", type: "button", disabled: t <= 0, onClick: o, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Previous"),
      n("span", { key: "position", className: "text-xs text-secondary" }, `${t + 1} of ${r}`),
      n("button", { key: "next", type: "button", disabled: t < 0 || t >= r - 1, onClick: i, className: "rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50" }, "Next"),
      n("button", { key: "close", type: "button", onClick: a, "aria-label": "Close segment preview", className: "ml-auto rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted/40" }, "Close preview"),
      n("a", { key: "edit", href: ri(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function Ca({ onNavigate: e, profile: t }) {
  const r = _e(() => {
    const U = Ea("ext:com.midnightrider.segment-studio:segments");
    return U ? {
      ..._r,
      defaultFilter: { ..._r.defaultFilter, ...U.findFilter || {} },
      defaultObjectFilter: U.objectFilter || {}
    } : _r;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Da(r), [l, d] = B(null), [c, m] = B({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = B(null), [g, p] = B(null), [h, b] = B(0), [k, S] = B(""), [w, P] = B(!0), [M, C] = B(""), $ = ye(0), R = ra(o, i), T = R.activityTagId, O = pn(i.slots), _ = _e(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (U) => Object.keys(pn(U)).length > 0,
    sanitize: (U) => qr(T, pn(U)),
    summarize: (U) => `${Object.keys(pn(U)).length} assigned`,
    renderEditor: (U, oe) => T ? n(Ia, {
      facets: l,
      values: pn(U),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (fe, xe) => {
        const ee = { ...pn(U) };
        xe ? ee[fe] = Number(xe) : delete ee[fe], oe(qr(T, ee));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [T, l, c.performerSlotsAvailable]), re = JSON.stringify(R);
  be(() => {
    if (d(null), !T) return;
    const U = new AbortController();
    return X(`/browse/activities/${T}/facets`, { signal: U.signal }).then(d).catch((oe) => {
      oe.status === 403 ? d({ slots: [], restricted: !0 }) : oe.name !== "AbortError" && C(oe.message);
    }), () => U.abort();
  }, [T]), be(() => {
    const U = ++$.current, oe = new AbortController();
    return P(!0), C(""), X("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(R), signal: oe.signal }).then((fe) => {
      U === $.current && m({ ...fe, totalCount: fe.totalCount ?? fe.total ?? 0 });
    }).catch((fe) => {
      if (!(U !== $.current || fe.name === "AbortError")) {
        if (fe.status === 400 && fe.message.includes("unrestricted performer read access")) {
          m((xe) => ({ ...xe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), C("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        C(fe.message);
      }
    }).finally(() => {
      U === $.current && P(!1);
    }), () => {
      $.current++, oe.abort();
    };
  }, [re, h]);
  const z = c.items.findIndex((U) => U.key === u), I = c.items[z] || null;
  function L(U) {
    s(U), a({ ...o, page: 1 });
  }
  function G(U) {
    const oe = ra(o, U), fe = U.slots && oe.activityTagId != null && oe.slotAssignments.length > 0 ? U.slots : void 0;
    L({ ...U, slots: fe });
  }
  function ne(U, oe) {
    const fe = { ...O };
    oe ? fe[U] = Number(oe) : delete fe[U], L({ ...i, slots: qr(T, fe) });
  }
  function V() {
    const U = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => U == null ? void 0 : U.focus());
  }
  async function J(U) {
    var xe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(U.key), S("");
    const oe = `browse-restore:${U.itemId}:${U.revision}`, fe = je(oe);
    try {
      const ee = (ue = !1) => X(`/bin/${U.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: fe,
          expectedRevision: U.revision,
          discardMissingImage: ue
        })
      });
      try {
        await ee(go(oe));
      } catch (ue) {
        if (((xe = ue.payload) == null ? void 0 : xe.code) !== "missing-image" || !window.confirm(`${ue.message}

Continue and discard the missing image reference?`))
          throw ue;
        po(oe), await ee(!0);
      }
      Ue(oe), u === U.key && f(null), S("Segment restored to Cove."), b((ue) => ue + 1);
    } catch (ee) {
      S(ee.message || "Unable to restore the segment."), ee.status === 409 && b((ue) => ue + 1);
    } finally {
      p(null);
    }
  }
  async function ce(U) {
    p(U.key), S("");
    try {
      const oe = await X(`/items/${U.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: U.revision })
      });
      if (!li(oe, S) || !ql(oe))
        return;
      const fe = `browse-dependency-delete:${U.itemId}:${oe.fingerprint}`;
      await X(`/items/${U.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: je(fe),
          fingerprint: oe.fingerprint
        })
      }), Ue(fe), u === U.key && f(null), S(`${oe.deletedSegmentCount} segment${oe.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), b((xe) => xe + 1);
    } catch (oe) {
      S(oe.message || "Unable to permanently delete the segment."), oe.status === 409 && b((fe) => fe + 1);
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
    n(Oa, {
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
      error: M ? new Error(M) : null,
      onRetry: () => b((U) => U + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? na.filter((U) => U.id !== "performers") : na,
      objectFilter: i,
      onObjectFilterChange: G,
      customFilterSections: _,
      searchPlaceholder: "Search segments..."
    }, [
      T ? n(Ia, { key: "slots", facets: l, values: O, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: ne }) : null,
      n(Bc, { key: "player", item: I, index: z, count: c.items.length, onPrevious: () => {
        var U;
        return f((U = c.items[z - 1]) == null ? void 0 : U.key);
      }, onNext: () => {
        var U;
        return f((U = c.items[z + 1]) == null ? void 0 : U.key);
      }, onClose: V, onNavigate: e }),
      k ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, k) : null,
      !w && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      w ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((U) => n(jc, {
        key: U.key,
        item: U,
        selected: U.key === u,
        busy: g === U.key,
        onSelect: () => f(U.key),
        onRestore: J,
        onPurge: ce
      })))
    ])
  ]);
}
function Gc({ onNavigate: e, profile: t }) {
  const [r, o] = B([]), [i, a] = B(""), [s, l] = B(0), [d, c] = B(!0), [m, u] = B(null), [f, g] = B(""), p = ye(null);
  async function h(S) {
    const w = await X("/bin", S ? { signal: S } : void 0);
    return o(w.items || []), a(w.fingerprint || ""), l(Number(w.totalCount) || 0), w;
  }
  be(() => {
    const S = new AbortController();
    return c(!0), h(S.signal).catch((w) => {
      w.name !== "AbortError" && g(w.message);
    }).finally(() => {
      S.signal.aborted || c(!1);
    }), () => S.abort();
  }, []), Ma(so, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var S;
      return (S = p.current) == null ? void 0 : S.call(p);
    }
  }]);
  async function b(S) {
    var M;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(S.itemId), g("");
    const w = `restore:${S.itemId}:${S.revision}`, P = je(w);
    try {
      const C = ($ = !1) => X(`/bin/${S.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: P, expectedRevision: S.revision, discardMissingImage: $ })
      });
      try {
        await C(go(w));
      } catch ($) {
        if (((M = $.payload) == null ? void 0 : M.code) !== "missing-image" || !window.confirm(`${$.message}

Continue and discard the missing image reference?`)) throw $;
        po(w), await C(!0);
      }
      Ue(w), await h(), zn(), g("Segment restored with a new native ID.");
    } catch (C) {
      g(C.message || "Unable to restore the segment."), C.status === 409 && await h();
    } finally {
      u(null);
    }
  }
  async function k() {
    if (m == null)
      try {
        const S = await ci({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), g("");
        });
        if (S.status !== "emptied") return;
        await h(), zn(), g(`${S.segmentCount} segment${S.segmentCount === 1 ? "" : "s"} from ${S.sceneCount} scene${S.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (S) {
        g(S.message || "Unable to empty the recycling bin."), S.status === 409 && await h();
      } finally {
        u(null);
      }
  }
  return p.current = k, n("div", { className: "mx-auto w-full max-w-6xl space-y-5 p-4 sm:p-6" }, [
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
        disabled: d || m != null || s === 0,
        onClick: k,
        className: "rounded-md border border-red-500/50 px-3 py-2 text-sm font-medium text-red-300 hover:bg-red-500/10 disabled:opacity-50"
      }, m === -1 ? "Emptying…" : `Empty recycling bin${s ? ` (${s})` : ""}`)
    ]),
    f ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, f) : null,
    d ? n("p", { key: "loading", role: "status", className: "text-sm text-secondary" }, "Loading recycled segments…") : null,
    !d && r.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "The recycling bin is empty.") : null,
    ...r.map((S) => n("article", { key: S.itemId, className: "flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4" }, [
      n("div", { key: "copy", className: "min-w-0 flex-1" }, [
        n("h2", { key: "title", className: "truncate font-semibold" }, `${S.tagName || "Tag segment"} · ${S.videoTitle || `Video ${S.videoId}`}`),
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, S.endSec == null ? Ae(S.startSec) : `${Ae(S.startSec)} – ${Ae(S.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${S.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${S.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: m != null, onClick: () => b(S), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const $a = "ext:com.midnightrider.segment-studio:videos";
function Jr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = _e(() => {
    var ae;
    const Y = Ea($a), me = (ae = Y == null ? void 0 : Y.uiOptions) == null ? void 0 : ae.displayMode;
    return Y ? {
      ...Gn,
      defaultFilter: { ...Gn.defaultFilter, ...Y.findFilter || {} },
      defaultObjectFilter: Y.objectFilter || {},
      defaultDisplayMode: Gn.allowedDisplayModes.includes(me) ? me : Gn.defaultDisplayMode
    } : Gn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: m } = Da(i), [u, f] = B({ items: [], totalCount: 0 }), [g, p] = B(!0), [h, b] = B(""), [k, S] = B(0), [w, P] = B(/* @__PURE__ */ new Set()), [M, C] = B(null), [$, R] = B({ busy: !1, error: "", announcement: "" }), T = ye(0), O = ye(null), _ = ye(null);
  _.current || (_.current = Ic());
  const re = JSON.stringify(a), z = JSON.stringify(s), I = t || r === "review";
  be(() => {
    _.current.selectionChanged(), O.current = null, P(/* @__PURE__ */ new Set()), R((Y) => ({ busy: Y.busy, error: "", announcement: "" }));
  }, [re, z]), be(() => {
    if (!I) return;
    const Y = new AbortController();
    return X("/analysis/status", { signal: Y.signal }).then(C).catch((me) => {
      me.name !== "AbortError" && C({ configured: !0, ready: !1, error: me.message || "Unable to check Full Scan readiness." });
    }), () => Y.abort();
  }, [I]), be(() => {
    const Y = ++T.current, me = new AbortController();
    return p(!0), b(""), X(`/videos?${Wd(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: me.signal }).then((ae) => {
      Y === T.current && f(ae);
    }).catch((ae) => {
      Y === T.current && ae.name !== "AbortError" && b(ae.message || "Unable to discover videos.");
    }).finally(() => {
      Y === T.current && p(!1);
    }), () => {
      T.current++, me.abort();
    };
  }, [re, z, t, r, k]);
  function L(Y) {
    d({ ...Y, page: Y.page || 1 });
  }
  function G(Y) {
    c(Y), d({ ...a, page: 1 });
  }
  function ne(Y, me = !1) {
    P((ae) => Vd(
      ae,
      u.items.map((te) => te.videoId),
      Y,
      O.current,
      me
    )), O.current = Y;
  }
  function V() {
    O.current = null, P(new Set(u.items.map((Y) => Y.videoId)));
  }
  function J() {
    O.current = null, P(/* @__PURE__ */ new Set());
  }
  function ce() {
    O.current = null, P((Y) => new Set(u.items.map((me) => me.videoId).filter((me) => !Y.has(me))));
  }
  async function U(Y = ["aiTagging", "omnishotcut"]) {
    const me = _.current.begin();
    if (me) {
      R({ busy: !0, error: "", announcement: "" });
      try {
        const ae = await Cc(
          [...w],
          Y,
          X,
          (te) => window.confirm(te)
        );
        if (ae.cancelled) {
          R({ busy: !1, error: "", announcement: "" });
          return;
        }
        ae.queuedIds.length > 0 && _.current.ownsCurrentSelection(me) && (ae.queuedIds.includes(O.current) && (O.current = null), P((te) => {
          const he = new Set(te);
          return ae.queuedIds.forEach((H) => he.delete(H)), he;
        })), R({
          busy: !1,
          announcement: ae.queuedIds.length > 0 ? `${ae.queuedIds.length} ${ae.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: ae.failed.length > 0 ? `${ae.failed.length} selected ${ae.failed.length === 1 ? "video could" : "videos could"} not be queued. ${ae.failed[0].error}` : ""
        });
      } catch (ae) {
        R({ busy: !1, error: ae.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        _.current.finish(me);
      }
    }
  }
  const oe = t || r === "review" ? ba : ba.filter((Y) => !["reviewState", "shotBoundaries"].includes(Y.id)), fe = M === null || M.configured === !1 || M.ready === !1, xe = $.busy || fe, ee = (M == null ? void 0 : M.error) || (M === null ? "Checking Full Scan availability" : M.configured === !1 ? "Configure the analysis service before running Full Scan" : M.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), ue = $.busy ? "Queueing scans…" : M === null ? "Checking Full Scan…" : M.configured === !1 ? "Full Scan not configured" : M.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(vo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Oa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: $a,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: L,
      totalCount: u.totalCount,
      isLoading: g,
      error: h ? new Error(h) : null,
      onRetry: () => S((Y) => Y + 1),
      sortOptions: t || r === "review" ? [...ya, { value: "unreviewed_count", label: "Unreviewed count" }] : ya,
      displayMode: l,
      onDisplayModeChange: m,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: oe,
      objectFilter: s,
      onObjectFilterChange: G,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: I ? w : void 0,
      onSelectAll: I ? V : void 0,
      onSelectNone: I ? J : void 0,
      onInvertSelection: I ? ce : void 0,
      selectionActions: I ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: xe,
          onClick: () => U(),
          title: ee,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, ue),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": xe,
            title: ee,
            onClick: (Y) => {
              xe && Y.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${xe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(Pa, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([Y, me]) => n("button", {
            key: Y,
            type: "button",
            disabled: $.busy,
            onClick: (ae) => {
              var te;
              (te = ae.currentTarget.closest("details")) == null || te.removeAttribute("open"), U(me);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, Y)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, $.announcement),
      $.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, $.error) : null,
      !g && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !g && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((Y) => n(Jd, { key: Y.videoId, item: Y, onNavigate: e, showReviewStates: I, selected: w.has(Y.videoId), selectionActive: w.size > 0, onSelect: I ? ne : null }))) : null,
      !g && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((Y) => n(Yd, { key: Y.videoId, item: Y, onNavigate: e, showReviewStates: I, selected: w.has(Y.videoId), selectionActive: w.size > 0, onSelect: I ? ne : null }))) : null
    ])
  ]);
}
function Ta({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = B(null), [s, l] = B(!0), [d, c] = B(""), m = ye(0), u = ye(0), f = ye(e), g = Dd();
  f.current = e;
  const p = (w) => `/videos/${w}/editor`;
  async function h(w, P, M) {
    const C = await X(p(P), M ? { signal: M.signal } : void 0);
    return Xt(w, M ? m.current : u.current, P, f.current) ? (a(C), !0) : !1;
  }
  be(() => {
    const w = ++m.current, P = e, M = new AbortController();
    return a(null), l(!0), c(""), h(w, P, M).catch((C) => {
      Xt(w, m.current, P, f.current) && C.name !== "AbortError" && c(C.message || "Unable to load the editor.");
    }).finally(() => {
      Xt(w, m.current, P, f.current) && l(!1);
    }), () => {
      m.current++, u.current++, M.abort();
    };
  }, [e]);
  function b(w, P) {
    a((M) => (M == null ? void 0 : M.video.id) !== P ? M : typeof w == "function" ? w(M) : w);
  }
  async function k() {
    const w = e, P = ++u.current;
    try {
      const M = await X(p(w));
      return Xt(P, u.current, w, f.current) ? (a(M), c("A newer canonical segment was loaded. Your stale change was not applied."), M) : null;
    } catch (M) {
      return Xt(P, u.current, w, f.current) && c(M.message || "Unable to reload the latest segment."), null;
    }
  }
  async function S() {
    const w = e, P = ++u.current;
    try {
      const M = await X(p(w));
      return Xt(P, u.current, w, f.current) ? (a(M), c(""), M) : null;
    } catch (M) {
      return Xt(P, u.current, w, f.current) && c(M.message || "Unable to reload performer slots."), null;
    }
  }
  return n("div", {
    className: `mx-auto flex w-full flex-col gap-2 ${g ? "lg:overflow-hidden" : "p-3 sm:p-4"}`,
    style: g ? {
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
      n(ys, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
      n("span", { key: "label", className: "sr-only" }, "Loading editor…")
    ]) : null,
    i ? n(wc, {
      key: i.video.id,
      detail: i,
      onDetailChange: b,
      onConflict: k,
      onReload: S,
      onSlotsChanged: S,
      splitLayout: g,
      profile: o,
      initialSegmentId: aa() ? -aa() : Ol(),
      compatibilityMode: r,
      onNavigate: t
    }) : null
  ]);
}
function Uc(e, t, r) {
  return t === "settings" || e === "settings" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/settings";
}
function Kc(e, t, r) {
  return t === "segments" || e === "segments" || t === "review" || e === "review" || t == null && e == null && ["/segment-studio/segments", "/segment-studio/review"].includes(r.replace(/\/+$/, ""));
}
function zc(e, t, r) {
  return t === "bin" || e === "bin" || t == null && e == null && r.replace(/\/+$/, "") === "/segment-studio/bin";
}
function Hc({
  id: e,
  slug: t,
  onNavigate: r,
  profile: o,
  onProfileChange: i
}) {
  const a = o.legacyCompatibilityRequired, s = Il(o), l = Uc(e, t, window.location.pathname), d = Kc(e, t, window.location.pathname), c = zc(e, t, window.location.pathname), m = l ? "settings" : d ? "segments" : c ? "bin" : "videos";
  if (Tl(m, o) === "videos" && m !== "videos")
    return window.history.replaceState({}, "", "/segment-studio"), n(Jr, {
      onNavigate: r,
      compatibilityMode: a,
      mode: s,
      profile: o
    });
  if (l) return n(Fc, {
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
  if (a) {
    if (d) return n(Ca, { onNavigate: r, profile: o });
    const g = Number(e);
    return Number.isInteger(g) && g > 0 ? n(Ta, {
      videoId: g,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Jr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Gc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n(Ca, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Ta, {
    videoId: f,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Jr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function _c({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = B(null), [a, s] = B("");
  return be(() => {
    const l = new AbortController();
    return X("/preferences", { signal: l.signal }).then((d) => i(ti(d))).catch((d) => {
      d.name !== "AbortError" && s(d.message);
    }), () => l.abort();
  }, []), a ? n("p", { className: "m-6 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300" }, a) : o == null ? n("p", { role: "status", className: "m-6 text-sm text-secondary" }, "Loading Segment Studio…") : n(Hc, {
    id: e,
    slug: t,
    onNavigate: r,
    profile: o,
    onProfileChange: i
  });
}
function qc(e) {
  const t = Array.isArray(e == null ? void 0 : e.selectedIds) ? e.selectedIds : e == null ? void 0 : e.entityIds;
  if (!Array.isArray(t) || t.length !== 1) return null;
  const r = Number(t[0]);
  return Number.isInteger(r) && r > 0 ? `/segment-studio/${r}` : null;
}
function Wc(e, t) {
  const r = qc(t);
  return r ? (window.location.assign(r), { cancelled: !0 }) : (window.alert("Segment Studio can only open one video at a time."), { cancelled: !0 });
}
const yu = {
  components: { SegmentStudioPage: _c },
  actionHandlers: { openSegmentStudio: Wc }
};
export {
  xr as CLEARED_SEGMENT_SELECTION_ID,
  ya as DISCOVERY_SORT_OPTIONS,
  Bt as SEGMENT_STUDIO_CAPABILITIES,
  so as SEGMENT_STUDIO_EXTENSION_ID,
  Jn as SEGMENT_STUDIO_SHORTCUTS,
  Ps as activeEditorFilterCount,
  Ja as addPendingChange,
  dd as applyDerivationRuleSlotSuggestions,
  br as applyFeedbackEditorDelta,
  rl as applyPendingChanges,
  ca as applySegmentMergeDelta,
  Jl as basicSegmentTimelineStyle,
  Dl as browseClipEnd,
  ri as browseEditorHref,
  ra as buildBrowseRequest,
  Ac as buildDerivationRuleGraph,
  Wd as buildDiscoverySearchParams,
  Ss as buildMinuteTimelineTicks,
  $c as buildPerformerSlotOverview,
  Bl as buildSegmentQuickSearchEntries,
  pd as buildSegmentRailRows,
  fd as buildTimelineRows,
  Xc as buildTimelineTicks,
  Is as calculateCenteredTimelineScroll,
  Qr as calculateEditorPanelMaximum,
  ks as calculateMinuteLabelStride,
  eu as calculateMinuteTimelineWidth,
  Ts as calculateSwimlaneTitleMaximum,
  Cs as calculateTimelinePlayheadPosition,
  co as calculateTimelineRatioBounds,
  Rs as calculateTimelineRatioFromPointer,
  tu as calculateVerticalRevealOffset,
  en as clampEditorPanelWidth,
  fr as clampSwimlaneTitleWidth,
  Ha as clampTimelineRatio,
  uo as clampTimelineRatioForHeight,
  vr as clampTimelineZoom,
  zd as compactProvenanceSummary,
  Ic as createBulkAnalysisCoordinator,
  ml as createQueuedReviewRequest,
  Qs as createSaveQueue,
  Sa as createSegmentAnalysisRequestScope,
  yu as default,
  el as discardPendingChange,
  xl as displayHeldSegmentTag,
  _l as downloadFileNameFromContentDisposition,
  Ls as dualRangeValueFromPointer,
  Xo as duplicateIdentityFromResponse,
  yl as duplicateOperationKey,
  Wa as editorVisibilityIncludingSegment,
  hd as expandedSwimlanes,
  Al as extensionOwnedSegmentsModeSwitchPrompt,
  wd as feedbackFrameTimestamps,
  Id as feedbackResultMatchesAction,
  Nd as feedbackSelectionPlan,
  Os as filterDerivedSegments,
  Kr as filterEditorSegments,
  Tc as filterPerformerSlotOverview,
  jl as filterSegmentQuickSearch,
  du as filterSegmentStudioShortcuts,
  Sd as findAdjacentSegmentGroupKey,
  wl as findAdjacentShot,
  dl as findEditorShortcut,
  za as findInitialSegmentSelection,
  xs as findNearestSegmentInCurrentSwimlane,
  kl as findPublishedSelectionIdentity,
  Ze as findSegmentByStableIdentity,
  Ms as findSegmentFromPlayhead,
  vs as findSegmentNearPlayhead,
  xd as findSwimlaneRangeSelection,
  ro as findSwimlaneSelection,
  Ll as findUniquePerformerSlotAssignment,
  hr as findUnreviewedSelection,
  rd as focusDialogDefaultButton,
  Ir as formatGenderHint,
  Nl as frameStepSeconds,
  oi as generatePerformerSlotAssignmentRecommendations,
  ac as groupApprovedDraftsForPublishing,
  Fl as groupAutoAssignCandidates,
  Cd as groupIncorrectExamplesByTag,
  cc as groupMaterializationOutputs,
  tn as groupSegmentsIntoSwimlanes,
  yd as groupSelectedSwimlanes,
  ho as groupSwimlanesBySegmentGroup,
  vt as handleModalKey,
  bn as hasSegmentStudioCapability,
  ma as hideCollectedFeedbackSegments,
  od as historyActionsForTarget,
  mr as incorrectExampleHistoryState,
  fi as indexPerformerSlotsBySegment,
  uu as initialReviewFilter,
  Ad as insertSegmentProjection,
  Xt as isCurrentEditorRequest,
  ed as isEditableTarget,
  gu as isEditorShortcutOwner,
  Zr as isKindRunning,
  ru as isSaveQueueBusy,
  zc as isSegmentStudioBinRoute,
  Kc as isSegmentStudioSegmentsRoute,
  Uc as isSegmentStudioSettingsRoute,
  Rc as layoutDerivationRuleComponent,
  Mc as layoutDerivationRuleComponents,
  Rd as mergeSegmentsProjection,
  sd as multiSelectionActionHint,
  Hs as nextSegmentAfterRemoval,
  _s as nextUnreviewedAfterRemoval,
  qt as normalizeCollapsedSegmentGroups,
  va as normalizeDiscoveryIds,
  kt as normalizeEditorSegmentFilters,
  Ht as normalizeGender,
  ea as normalizeReviewFilter,
  ti as normalizeSegmentStudioFeatureProfile,
  cu as normalizeSegmentStudioMode,
  to as normalizeSegmentStudioPublicMode,
  pn as parseBrowseSlotFilters,
  As as parseEditorLayout,
  Es as parseHideDerivedSegmentsPreference,
  Ds as parseMergeConfirmationPreference,
  Xa as parsePlaybackShortcutConfig,
  sl as parseShortcutBindingOverrides,
  Vr as patchPerformerSlotProjection,
  wr as patchSegmentProjection,
  ou as pendingChangesReducer,
  qs as percentageSeekTime,
  Pl as performInitialSegmentSeek,
  at as performerOptionId,
  Sr as performerSlotHistoryState,
  bt as performerSlotLabel,
  cd as performerSlotPresentation,
  fu as performerSlotStatus,
  bo as performerSlotStatusFromSegmentSlots,
  pi as performerSlotsForSegment,
  Rt as provenanceSourceLabel,
  ol as prunePendingChanges,
  vl as queueCreatedSegmentTagChoice,
  ai as rankPerformerOptions,
  kd as reconcileSegmentGroupKey,
  Ks as reconcileSelectedSegmentIds,
  Qd as recyclingBinActionText,
  Wl as recyclingBinDeletionPrompt,
  di as recyclingBinDeletionSummary,
  Rl as recyclingBinModeSwitchPrompt,
  fl as removeQueuedReviewsForSegments,
  oo as removeSegmentsProjection,
  aa as requestedOwnedItemId,
  Ol as requestedSegmentId,
  js as resolveEditorSegmentSelection,
  Sl as resolveQueuedCreatedSegmentTag,
  gl as resolveQueuedReviewRequest,
  bl as resolveSegmentCreationAction,
  Tl as resolveSegmentStudioRoute,
  ll as resolveSegmentStudioShortcuts,
  Ys as resolveSegmentTarget,
  Ec as resolveSelectedDerivationRule,
  Jo as resolveSelectedSegments,
  pc as restoreDisabledToolbarActionFocus,
  kc as restorePublishApprovedFocus,
  Vn as restoreSegmentFieldsProjection,
  xi as restoreSegmentsProjection,
  nl as retargetPendingChanges,
  vi as revealCollapsedSegmentGroup,
  Cc as runSelectedDiscoveryAnalysis,
  fn as sameSegmentIdentity,
  yr as savingSegmentIdFrom,
  ui as segmentBadgeStyle,
  Nr as segmentGroupHeaderBackground,
  Tt as segmentGroupKeyForSegment,
  yo as segmentHistoryIdentity,
  ur as segmentHistoryState,
  nu as segmentIdentity,
  mi as segmentRailItemStyle,
  mu as segmentStateStyle,
  qc as segmentStudioActionTarget,
  Il as segmentStudioLegacyMode,
  Vl as segmentTimelineStyle,
  St as segmentsHistoryState,
  zs as selectAllVideoSegmentIds,
  Ml as selectedBrowseStates,
  bi as selectedSwimlaneMerge,
  Si as setBackLinkNavigation,
  tl as settlePendingChange,
  ad as sharedPerformerSlotShape,
  id as sharedTagPerformerSlotShape,
  yn as shortcutAvailableInMode,
  cl as shortcutBindingDisplayText,
  au as shortcutBindingFromEvent,
  su as shortcutBindingsOverlap,
  lu as shortcutModesOverlap,
  il as shortcutRequiresSingleSegment,
  Kn as shotBoundaryFingerprint,
  nd as shouldAcceptCurrentTagFromEnter,
  iu as shouldExitShortcutCapture,
  pu as shouldHandleEditorShortcut,
  xa as shouldLoadSegmentAnalysis,
  fa as shouldReloadAfterSegmentMutation,
  eo as shouldRestoreTransitionSelection,
  Gl as shouldShowQuickSearchGroups,
  Qo as splitShortcutCategoriesIntoColumns,
  ld as suggestDerivationRuleSlotMappings,
  qn as swimlaneDisplayLabel,
  Xl as swimlaneMarkerTop,
  Ql as swimlaneStripeBackground,
  hl as tagEditorLockedBySave,
  Js as targetsOverlap,
  $s as timelineContentStyle,
  qo as timelinePlayheadHorizontalStyle,
  Yl as timelineSegmentWidth,
  ws as timelineTickAlignment,
  Ns as timelineTickPosition,
  Yr as timelineTimePercent,
  vd as toggleAllCollapsedSegmentGroups,
  ul as toggledSelectionReviewState,
  Mt as trapModalFocus,
  Kl as tryParseJsonResponseText,
  Us as updateAnchoredSegmentSelection,
  Vd as updateDiscoverySelection,
  Fs as updateDualRangeValues,
  Bs as updateSegmentCollectionSelection,
  Gs as updateSegmentRangeSelection,
  Va as updateSegmentSelection,
  Na as validateDerivationRuleDraft,
  _o as validateSegmentTiming,
  mo as videoPerformerOptions,
  Wr as videoPerformerSlotAssignments,
  $l as visibleSegmentStudioSettingsTabs,
  Cl as visibleSegmentStudioTabs,
  yi as visibleVirtualRows
};
