import io from "@cove/runtime/react";
import { createPortal as fs } from "@cove/runtime/react-dom";
import { extensionFetch as Ra } from "@cove/runtime/api";
import { formatDuration as ys, EntityReferenceSelector as Kn, useExtensionKeyboardBindings as bs, VideoPlayer as Ma, useRegisterExtensionKeyboardActions as Ea, getDefaultFilter as Da, useListUrlState as Oa, ListPage as Pa } from "@cove/runtime/components";
import { ChevronDown as La, StepBack as hs, StepForward as vs, Loader2 as xs } from "@cove/runtime/lucide-react";
const so = "com.midnightrider.segment-studio", Fa = "segment-studio.layout.v1", tn = "segment-studio.operations.v1", ja = "segment-studio.collapsed-segment-groups.v1", Ba = "segment-studio.playback-shortcuts.v1", Ga = "segment-studio.timing-clipboard.v1", Ua = "segment-studio.hide-derived-segments.v1", Ka = "segment-studio.merge-confirmation.v1", pt = ["unreviewed", "approved", "rejected"], Ss = ["MALE", "FEMALE", "TRANSGENDER_MALE", "TRANSGENDER_FEMALE"], zo = "(min-width: 1024px) and (min-height: 640px)", Ho = "(min-width: 1024px) and (min-height: 900px)", zn = 1e-3, _o = 15, ks = 30, za = 12, yt = {
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
}, Ut = {
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
function Ha(e, t = null) {
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
function ws(e, t, r, o = null) {
  var d, c;
  const i = Number(t);
  if (!Number.isFinite(i)) return null;
  const a = e.flatMap((g, u) => g.markers.filter(({ segment: f }) => {
    const m = Number(f.startSec), p = f.endSec == null ? m + ks : Number(f.endSec);
    return Number.isFinite(m) && Number.isFinite(p) && p >= m && m <= i + _o + zn && p >= i - _o - zn;
  }).map(({ segment: f }) => ({ segment: f, laneIndex: u }))).sort((g, u) => g.laneIndex - u.laneIndex || Math.abs(g.segment.startSec - i) - Math.abs(u.segment.startSec - i) || g.segment.id - u.segment.id);
  if (a.length === 0) return null;
  const s = e.findIndex((g) => g.markers.some((u) => u.segment.id === o));
  if (s < 0) return r < 0 ? a.at(-1).segment : a[0].segment;
  const l = a.filter((g) => g.laneIndex !== s);
  return l.length === 0 ? r < 0 ? a.at(-1).segment : a[0].segment : r < 0 ? ((d = l.findLast((g) => g.laneIndex < s)) == null ? void 0 : d.segment) ?? l.at(-1).segment : ((c = l.find((g) => g.laneIndex > s)) == null ? void 0 : c.segment) ?? l[0].segment;
}
function Ns(e, t, r) {
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
function Is(e) {
  return !Number.isFinite(e) || e <= 0 ? [0] : Array.from({ length: Math.floor(e / 60) + 1 }, (t, r) => r * 60);
}
function su(e, t = 1, r = 48) {
  return !Number.isFinite(e) || e <= 0 ? Math.max(1, r) : Math.ceil(e / 60) * Math.max(1, r) * Math.max(1, t);
}
function Cs(e, t, r = 1, o = 48) {
  const i = Math.max(1, Math.ceil((Number(e) || 0) / 60)), a = Math.max(1, Number(t) || 0) * Math.max(1, Number(r) || 1);
  return Math.max(1, Math.ceil(i * Math.max(1, o) / a));
}
function $s(e, t, r = null) {
  return e <= 0 || e >= t - 1 && (r == null || r >= 100) ? "translate-x-0" : "-translate-x-1/2";
}
function Ts(e, t, r) {
  return t <= 1 ? { left: "0%" } : e >= t - 1 && r >= 100 ? { right: "0" } : { left: `${r}%` };
}
function As(e, t, r, o, i = 160, a = 0) {
  if (!(t > 0) || !(r > o)) return 0;
  const s = Math.max(0, r - i - Math.max(0, Number(a) || 0)), l = i + Math.min(1, Math.max(0, e / t)) * s;
  return Math.min(r - o, Math.max(0, l - o / 2));
}
function Jr(e, t) {
  const r = Number(e);
  return t > 0 && Number.isFinite(r) ? Math.min(1, Math.max(0, r / t)) * 100 : 0;
}
function Rs(e, t, r = 10) {
  const o = Jr(e, t), i = o / 100;
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
function Ms(e, t = za) {
  return {
    width: `${e * 100}%`,
    minWidth: "100%",
    boxSizing: "border-box",
    paddingRight: `${Math.max(0, Number(t) || 0)}px`
  };
}
function _a(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(0.7, Math.max(0.25, t)) : yt.timelineRatio;
}
function Yr(e, t) {
  const r = Number(e) - Number(t);
  return Math.min(560, Math.max(240, Number.isFinite(r) ? r : 560));
}
function Xt(e, t = 560) {
  return typeof e != "number" || !Number.isFinite(e) ? yt.detailWidth : Math.min(Yr(t, 0), Math.max(240, e));
}
function cr(e, t = 400) {
  return typeof e != "number" || !Number.isFinite(e) ? yt.swimlaneTitleWidth : Math.min(Math.max(160, t), Math.max(160, e));
}
function Es(e) {
  return e > 0 ? Math.min(400, Math.max(160, e - 320)) : 400;
}
function co(e) {
  const t = Math.max(1, Number(e) - 12);
  if (t < 480) return { minimum: yt.timelineRatio, maximum: yt.timelineRatio };
  const r = Math.max(0.25, 224 / t), o = Math.min(0.7, 1 - 256 / t);
  return { minimum: r, maximum: Math.max(r, o) };
}
function uo(e, t) {
  const r = _a(e);
  if (!(t > 0)) return r;
  const o = co(t);
  return Math.min(o.maximum, Math.max(o.minimum, r));
}
function Ds(e) {
  if (!e) return { ...yt };
  try {
    const t = JSON.parse(e), r = t == null ? void 0 : t.timelineRatio;
    return {
      timelineRatio: typeof r == "number" && Number.isFinite(r) ? _a(r) : yt.timelineRatio,
      markerRailOpen: typeof (t == null ? void 0 : t.markerRailOpen) == "boolean" ? t.markerRailOpen : !0,
      detailWidth: Xt(t == null ? void 0 : t.detailWidth),
      markerRailWidth: Xt(t == null ? void 0 : t.markerRailWidth),
      swimlaneTitleWidth: cr(t == null ? void 0 : t.swimlaneTitleWidth)
    };
  } catch {
    return { ...yt };
  }
}
function Os(e, t, r) {
  return r > 0 ? uo((t + r - e) / r, r) : yt.timelineRatio;
}
function lu(e, t, r, o, i = 2) {
  const a = Math.max(0, Number(i) || 0);
  return e < r + a ? e - r - a : t > o - a ? t - o + a : 0;
}
function Ps(e, t, r, o = null) {
  var d;
  const i = [...e].sort((c, g) => c.startSec - g.startSec || c.id - g.id), a = i.findIndex((c) => c.id === o), s = Number((d = i[a]) == null ? void 0 : d.startSec), l = Number(t);
  return a >= 0 && Number.isFinite(s) && Number.isFinite(l) && Math.abs(s - l) <= zn ? i[a + (r < 0 ? -1 : 1)] ?? null : r < 0 ? i.findLast((c) => c.startSec < l) ?? null : i.find((c) => c.startSec > l) ?? null;
}
function Zt(e, t, r, o) {
  return e === t && r === o;
}
const fr = "__segment-studio-cleared-selection__";
function Ls(e) {
  return e === "true";
}
function Fs(e) {
  return e !== "false";
}
function qa() {
  try {
    return Fs(window.localStorage.getItem(Ka));
  } catch {
    return !0;
  }
}
function Wa(e) {
  try {
    window.localStorage.setItem(Ka, String(!!e));
  } catch {
  }
}
function js(e, t) {
  return t ? e.filter((r) => !r.isDerived) : e;
}
function Nt(e = {}) {
  const t = pt.filter((g) => Array.isArray(e.reviewStates) ? e.reviewStates.includes(g) : !0), r = Number(e.performerId), o = Number(e.tagId), i = Number(e.segmentGroupId), a = e.segmentGroupId === "ungrouped" ? "ungrouped" : i > 0 ? i : null, s = String(e.sourceKey || "").trim() || null, l = (g, u) => {
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
function Ur(e, t, r, o = !1, i = []) {
  var c, g;
  const a = Nt(r), s = a.performerId == null ? null : new Set((t || []).filter((u) => Number(u.performerId) === a.performerId).map((u) => u.segmentId)), l = new Set((i || []).flatMap((u) => u.tags || []).map((u) => Number(u.tagId))), d = a.segmentGroupId == null || a.segmentGroupId === "ungrouped" ? null : new Set(((g = (c = (i || []).find((u) => Number(u.id) === a.segmentGroupId)) == null ? void 0 : c.tags) == null ? void 0 : g.map((u) => Number(u.tagId))) || []);
  return js(e || [], o).filter((u) => {
    if (u.reviewState != null && !a.reviewStates.includes(u.reviewState) || s && !s.has(u.id) || a.tagId != null && Number(u.tagId) !== a.tagId || d && !d.has(Number(u.tagId)) || a.segmentGroupId === "ungrouped" && l.has(Number(u.tagId)) || a.sourceKey != null && u.sourceKey !== a.sourceKey) return !1;
    const f = Number(u.confidence);
    return u.confidence == null || !Number.isFinite(f) ? a.includeUnscored : f >= a.confidenceMin && f <= a.confidenceMax;
  });
}
function Va(e, t, r, o = !1, i = []) {
  var l;
  const a = Nt(r);
  if (!e) return { filters: a, hideDerivedSegments: o };
  if (a.reviewStates.includes(e.reviewState) || (a.reviewStates = Nt({
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
    filters: Nt(a),
    hideDerivedSegments: o && !e.isDerived
  };
}
function Bs(e, t = !1) {
  const r = Nt(e);
  return +(r.reviewStates.length !== pt.length) + +(r.performerId != null) + +(r.tagId != null) + +(r.segmentGroupId != null) + +(r.sourceKey != null) + +(r.confidenceMin > 0 || r.confidenceMax < 1) + +!r.includeUnscored + Number(t);
}
function Gs(e, t, r) {
  const o = Number(e), i = Number(t), a = Number(r);
  return !Number.isFinite(o) || !Number.isFinite(i) || !(a > 0) ? 0 : Math.round(Math.min(1, Math.max(0, (o - i) / a)) * 100) / 100;
}
function Us(e, t, r, o) {
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
function Ks(e, t, r = null) {
  return t === fr ? null : Ha(
    e,
    t ?? r
  );
}
function Ja(e, t, r, o = !1) {
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
function zs(e, t, r) {
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
function Hs(e, t, r, o, i = !1) {
  const a = [...new Set((o || []).filter((c) => c != null))], s = a.indexOf(t), l = a.indexOf(r);
  if (s < 0 || l < 0)
    return Ja(e, t, r, i);
  const d = a.slice(Math.min(s, l), Math.max(s, l) + 1);
  return {
    selectedSegmentIds: i ? [.../* @__PURE__ */ new Set([...e || [], ...d])] : d,
    activeSegmentId: r
  };
}
function _s(e, t, r = null, o = !1) {
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
      ...Hs(u, s, t, g, !0),
      anchorSegmentId: s,
      rangeBaseSegmentIds: u
    };
  }
  const d = Ja(i, a, t, o);
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
function qs(e, t, r) {
  const o = [...new Set((t || []).filter((s) => s != null))], i = new Set(o), a = [...new Set((e || []).filter((s) => i.has(s)))];
  return r != null && i.has(r) && !a.includes(r) && a.push(r), a.length === 0 && (e || []).length > 0 && o.length > 0 && a.push(o[0]), a;
}
function Ws(e) {
  return [...new Set((e || []).map((t) => t.id).filter((t) => t != null))];
}
function Vo(e, t) {
  const r = Number(e == null ? void 0 : e.startSec) || 0, o = Math.max(r, Number((e == null ? void 0 : e.endSec) ?? r) || r), i = Number(t == null ? void 0 : t.startSec) || 0, a = Math.max(i, Number((t == null ? void 0 : t.endSec) ?? i) || i);
  return a < r ? r - a : i > o ? i - o : 0;
}
function Jo(e, t, r) {
  return (e || []).map((o) => o.segment).filter((o) => o && !r.has(o.id)).sort((o, i) => Vo(t, o) - Vo(t, i) || Math.abs(Number(o.startSec) - Number(t.startSec)) - Math.abs(Number(i.startSec) - Number(t.startSec)) || Number(o.startSec) - Number(i.startSec) || Number(o.id) - Number(i.id))[0] ?? null;
}
function Vs(e, t, r) {
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
function Js(e, t, r) {
  const o = new Set(t || []), i = (e || []).flatMap((l) => (l.markers || []).map(({ segment: d }) => d).filter(Boolean)), a = i.findIndex((l) => l.id === r);
  return (a < 0 ? i : i.slice(a + 1)).find((l) => !o.has(l.id) && l.reviewState === "unreviewed") ?? null;
}
function Ys(e, t) {
  const r = Math.max(0, Number(e) || 0), o = Math.min(9, Math.max(0, Math.trunc(Number(t) || 0)));
  return r * o / 10;
}
function Yo(e, t) {
  const r = new Map((e || []).map((o) => [o.id, o]));
  return [...new Set(t || [])].map((o) => r.get(o)).filter(Boolean);
}
function Qs() {
  try {
    return Ls(window.localStorage.getItem(Ua));
  } catch {
    return !1;
  }
}
function Zs(e) {
  try {
    window.localStorage.setItem(Ua, String(!!e));
  } catch {
  }
}
function hn(e, t) {
  return !e || !t ? !1 : e.itemId != null && e.itemId === t.itemId || e.nativeSegmentId != null && e.nativeSegmentId === t.nativeSegmentId ? !0 : e.id != null && e.id === t.id;
}
function Xs(e, t) {
  return (e || []).some((r) => (t || []).some((o) => hn(r, o)));
}
function el(e) {
  return { id: e.id, itemId: e.itemId ?? null, nativeSegmentId: e.nativeSegmentId ?? null };
}
function tl(e, t) {
  return (e || []).find((r) => hn(t, r)) || null;
}
function ur(e) {
  var t;
  return ((t = e.running) == null ? void 0 : t.lockId) ?? null;
}
function Qr(e, t) {
  var r;
  return ((r = e.running) == null ? void 0 : r.kind) === t;
}
function du(e) {
  return e.running != null || e.queued.length > 0;
}
const Qo = Object.freeze({ running: null, queued: Object.freeze([]), lastFailure: null });
function Kr(e) {
  return Object.freeze({
    id: e.id,
    kind: e.kind,
    lockId: e.lockId,
    targets: e.targets,
    exclusive: e.exclusive
  });
}
function nl({ getContext: e = () => ({}) } = {}) {
  let t = 1, r = null, o = [], i = null, a = !1, s = Qo;
  const l = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Set();
  let c = [];
  function g() {
    s = r == null && o.length === 0 && i == null ? Qo : Object.freeze({
      running: r ? Kr(r) : null,
      queued: Object.freeze(o.map(Kr)),
      lastFailure: i
    });
    for (const I of [...d]) I();
    if (r == null && o.length === 0) {
      const I = c;
      c = [];
      for (const L of I) L();
    }
  }
  function u(I, L) {
    l.set(I.id, L.status), I.resolve(L);
  }
  function f(I) {
    if (I.dependsOn == null) return "met";
    const L = l.get(I.dependsOn);
    return L === "fulfilled" ? "met" : L != null ? "failed" : "pending";
  }
  function m(I) {
    r = I;
    const L = { ...e(), taskId: I.id };
    L.resolveTargets = () => I.targets.map((K) => tl(L.segments, K)).filter(Boolean), g();
    let R;
    try {
      R = I.run(L);
    } catch (K) {
      R = Promise.reject(K);
    }
    Promise.resolve(R).then(
      (K) => p(I, { status: "fulfilled", value: K }),
      (K) => p(I, { status: "rejected", error: K })
    );
  }
  function p(I, L) {
    u(I, L), !a && (r = null, L.status === "rejected" && (i = Object.freeze({ id: I.id, kind: I.kind, error: L.error })), g(), b());
  }
  function b() {
    if (a || r != null) return;
    let I = !1;
    for (let L = 0; L < o.length; L += 1) {
      const R = o[L], K = f(R);
      if (K === "failed") {
        o = o.filter((v) => v !== R), u(R, { status: "dropped", reason: "dependency-failed" }), I = !0, L -= 1;
        continue;
      }
      if (K !== "pending" && !(R.exclusive && L > 0) && !o.slice(0, L).some((v) => Xs(v.targets, R.targets)) && !(R.ready && !R.ready(e()))) {
        o = o.filter((v) => v !== R), m(R);
        return;
      }
    }
    I && g();
  }
  function y(I) {
    if (a || (r == null ? void 0 : r.exclusive) || o.some((A) => A.exclusive) || r != null && I.whenBusy !== "enqueue") return null;
    let R;
    const K = new Promise((A) => {
      R = A;
    }), v = {
      id: t++,
      kind: I.kind,
      lockId: I.lockId ?? null,
      targets: Object.freeze([...I.targets || []]),
      exclusive: I.exclusive === !0,
      dependsOn: I.dependsOn ?? null,
      ready: I.ready || null,
      run: I.run,
      resolve: R
    };
    return o = [...o, v], g(), b(), { id: v.id, done: K };
  }
  function w(I = {}) {
    let L = null;
    const R = y({
      ...I,
      whenBusy: "reject",
      run: () => new Promise((v) => {
        L = v;
      })
    });
    if (!R) return null;
    if (L == null)
      return k((v) => v.id === R.id), null;
    let K = !1;
    return () => {
      K || (K = !0, L());
    };
  }
  function k(I) {
    const L = o.filter((R) => I(Kr(R)));
    if (L.length === 0) return 0;
    o = o.filter((R) => !L.includes(R));
    for (const R of L) u(R, { status: "cancelled" });
    return g(), b(), L.length;
  }
  return {
    enqueue: y,
    acquire: w,
    cancel: k,
    poke: b,
    subscribe(I) {
      return d.add(I), () => d.delete(I);
    },
    getSnapshot: () => s,
    whenIdle() {
      return r == null && o.length === 0 ? Promise.resolve() : new Promise((I) => c.push(I));
    },
    dispose() {
      if (a) return;
      const I = o;
      o = [], a = !0;
      for (const L of I) u(L, { status: "cancelled" });
      d.clear();
    }
  };
}
let rl = 1;
function Ya() {
  return `pending-${rl++}`;
}
function ol(e) {
  return e.sort((t, r) => t.startSec - r.startSec || t.id - r.id);
}
function zr(e, t) {
  return (t || []).some((r) => hn(r, e));
}
function Qa(e, t) {
  return [...e || [], {
    id: t.id ?? Ya(),
    taskId: t.taskId ?? null,
    op: t.op,
    targets: t.targets || (t.segment ? [{ id: t.segment.id }] : []),
    values: t.values || null,
    segment: t.segment || null,
    settled: !1
  }];
}
function Za(e, t) {
  return e.id === t || e.taskId != null && e.taskId === t;
}
function al(e, t) {
  const r = (e || []).filter((o) => !Za(o, t));
  return r.length === (e || []).length ? e : r;
}
function il(e, t) {
  let r = !1;
  const o = (e || []).map((i) => i.settled || !Za(i, t) ? i : (r = !0, { ...i, settled: !0 }));
  return r ? o : e;
}
function sl(e, t, r) {
  let o = !1;
  const i = (e || []).map((a) => a.targets.some((s) => s.id === t && s.itemId == null && s.nativeSegmentId == null) ? (o = !0, {
    ...a,
    targets: a.targets.map((s) => s.id === t ? { ...r } : s)
  }) : a);
  return o ? i : e;
}
function Xa(e, t) {
  if (!t || t.length === 0) return e;
  let r = [...e || []];
  for (const o of t)
    if (o.op === "insert")
      r.some((i) => hn(o.segment, i)) || r.push(o.segment);
    else if (o.op === "patch")
      r = r.map((i) => zr(i, o.targets) ? { ...i, ...o.values } : i);
    else if (o.op === "remove")
      r = r.filter((i) => !zr(i, o.targets));
    else if (o.op === "merge") {
      const [i, ...a] = o.targets;
      r = r.filter((s) => !zr(s, a)).map((s) => hn(i, s) ? { ...s, ...o.values } : s);
    }
  return ol(r);
}
function ll(e, t) {
  if (!e || e.length === 0) return e;
  const r = [
    ...(t == null ? void 0 : t.segments) || [],
    ...e.filter((i) => i.op === "insert" && !i.settled).map((i) => i.segment)
  ], o = e.filter((i) => i.settled ? !1 : i.op === "insert" ? !0 : i.targets.some((a) => r.some((s) => hn(a, s))));
  return o.length === e.length ? e : o;
}
function dl(e, t) {
  switch (t.type) {
    case "add":
      return Qa(e, t.entry);
    case "discard":
      return al(e, t.key);
    case "settle":
      return il(e, t.key);
    case "retarget":
      return sl(e, t.temporaryId, t.identity);
    case "prune":
      return ll(e, t.detail);
    case "reset":
      return [];
    default:
      return e;
  }
}
const qn = [
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
], cl = /* @__PURE__ */ new Set([
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
function ul(e) {
  return cl.has(e);
}
function ei(e) {
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
function ml(e) {
  try {
    const t = typeof e == "string" ? JSON.parse(e || "{}") : e;
    if (!t || typeof t != "object" || Array.isArray(t)) return {};
    const r = new Set(qn.map((o) => o.id));
    return Object.fromEntries(Object.entries(t).filter(([o, i]) => r.has(o) && Array.isArray(i)).map(([o, i]) => [o, i.slice(0, 4).map(ei).filter(Boolean)]));
  } catch {
    return {};
  }
}
function gl(e = {}) {
  const t = ml(e);
  return qn.map((r) => ({
    ...r,
    bindings: Object.hasOwn(t, r.id) ? t[r.id] : r.bindings
  }));
}
function Zo(e, t = 2) {
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
  return !t || ["Control", "Shift", "Alt", "Meta", "Escape"].includes(t) ? null : ei({
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
function Zr(e, t) {
  const r = String(e.key || "").toLowerCase(), o = t.key.toLowerCase(), i = t.code && String(e.code || "").toLowerCase() === t.code.toLowerCase();
  if (r !== o && !i) return !1;
  const a = "+_?:<>".includes(t.key);
  return (t.platform ? !!e.ctrlKey != !!e.metaKey : !!e.ctrlKey == !!t.ctrl && !!e.metaKey == !!t.meta) && !!e.altKey == !!t.alt && (a && !t.shift ? !0 : !!e.shiftKey == !!t.shift);
}
function Xo(e, t) {
  const r = {
    comma: [",", "<"],
    period: [".", ">"]
  }[String(e || "").toLowerCase()];
  return !!(r != null && r.includes(String(t || "").toLowerCase()));
}
function mu(e, t) {
  if (!e || !t) return !1;
  const r = String(e.key).toLowerCase() === String(t.key).toLowerCase(), o = e.code && t.code && String(e.code).toLowerCase() === String(t.code).toLowerCase(), i = Xo(e.code, t.key), a = Xo(t.code, e.key);
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
          if (Zr(f, e) && Zr(f, t)) return !0;
        }
  return !1;
}
function vn(e, t = !1) {
  return (!e.reviewOnly || t) && (!e.basicOnly || !t);
}
function gu(e, t) {
  return [!1, !0].some((r) => vn(e, r) && vn(t, r));
}
function pl(e, t = !1, r = {}) {
  return gl(r).find((o) => vn(o, t) && o.bindings.some((i) => Zr(e, i))) || null;
}
function ti(e) {
  return e.label ? e.label : [
    e.platform ? "Ctrl/Cmd" : e.ctrl ? "Ctrl" : null,
    e.alt ? "Alt" : null,
    e.shift ? "Shift" : null,
    e.meta ? "Meta" : null,
    e.key === " " ? "Space" : e.key
  ].filter(Boolean).join("+");
}
function fl(e, t = !1) {
  return t ? "Press keys…" : e.bindings.length ? e.bindings.map(ti).join(" / ") : "Unassigned";
}
function pu(e, t) {
  const r = String(t || "").trim().toLowerCase();
  return r ? e.filter((o) => [o.description, o.category, fl(o)].some((i) => String(i || "").toLowerCase().includes(r))) : e;
}
function fu(e) {
  return e === "review" ? "review" : "editor";
}
function Je(e, { itemId: t = null, nativeSegmentId: r = null } = {}) {
  if (t != null) {
    const o = (e || []).find((i) => i.itemId === t);
    if (o) return o;
  }
  return r == null ? null : (e || []).find((o) => o.nativeSegmentId === r) || null;
}
function yl(e, t) {
  return (e || []).length > 0 && e.every((r) => r.reviewState === t) ? "unreviewed" : t;
}
function bl(e, t, r) {
  const o = t.map(({ id: a, itemId: s, nativeSegmentId: l }) => ({
    id: a,
    itemId: s,
    nativeSegmentId: l
  })), i = o.find((a) => a.id === (r == null ? void 0 : r.id)) || o[0] || null;
  return { requestedState: e, identities: o, activeIdentity: i };
}
function hl(e, t) {
  var o;
  if (!((o = e == null ? void 0 : e.identities) != null && o.length)) return null;
  const r = e.identities.map((i) => Je(t, i)).filter(Boolean);
  return r.length === 0 ? null : {
    requestedState: e.requestedState,
    selectedSegments: r,
    selectedSegment: Je(t, e.activeIdentity) || r[0]
  };
}
function vl(e, t) {
  return (e == null ? void 0 : e.itemId) != null && (t == null ? void 0 : t.itemId) != null ? e.itemId === t.itemId : (e == null ? void 0 : e.nativeSegmentId) != null && (t == null ? void 0 : t.nativeSegmentId) != null ? e.nativeSegmentId === t.nativeSegmentId : (e == null ? void 0 : e.id) != null && (t == null ? void 0 : t.id) != null && e.id === t.id;
}
function xl(e, t) {
  return (e || []).filter((r) => !r.identities.some((o) => (t || []).some((i) => vl(o, i))));
}
function ea(e, t) {
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
  return t ? Xa(e, Qa([], {
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
function Xr(e, t) {
  return e === t;
}
function $l(e, t, r) {
  const o = (e || []).find((i) => i.id === t);
  return (o == null ? void 0 : o.itemId) == null ? null : (r || []).find((i) => i.itemId === o.itemId) || null;
}
function Tl(e, t, r) {
  const o = [...e || []].sort((i, a) => i.startSec - a.startSec || i.id - a.id);
  return r < 0 ? o.filter((i) => i.startSec < t - zn).at(-1) || null : o.find((i) => i.startSec > t + zn) || null;
}
function Gn(e) {
  return [...e || []].sort((t, r) => t.startSec - r.startSec || t.id - r.id).map((t) => `${t.id}:${t.revision}`).join(",");
}
function ta(e) {
  const t = e && typeof e == "object" ? e : {};
  return {
    query: typeof t.query == "string" ? t.query : "",
    reviewState: pt.includes(t.reviewState) ? t.reviewState : "all",
    sort: ["default", "time", "updated"].includes(t.sort) ? t.sort : "default",
    direction: t.direction === "desc" ? "desc" : "asc",
    page: Math.max(1, Number(t.page) || 1),
    perPage: Math.min(100, Math.max(1, Number(t.perPage) || 24))
  };
}
function yu(e, t = null, r = !1) {
  const o = ta(r ? {} : e);
  return t ? { ...o, videoId: t } : o;
}
function yn(e, t, r, o) {
  const i = Number(e);
  return Number.isFinite(i) ? Math.min(o, Math.max(r, i)) : t;
}
function ni(e) {
  try {
    const t = e ? JSON.parse(e) : {};
    return {
      smallSeekTime: yn(t.smallSeekTime, 5, 0.1, 60),
      mediumSeekTime: yn(t.mediumSeekTime, 10, 0.1, 120),
      longSeekTime: yn(t.longSeekTime, 30, 1, 300),
      smallFrameStep: Math.round(yn(t.smallFrameStep, 1, 1, 30)),
      mediumFrameStep: Math.round(yn(t.mediumFrameStep, 10, 1, 120)),
      longFrameStep: Math.round(yn(t.longFrameStep, 30, 1, 300))
    };
  } catch {
    return { ...lo };
  }
}
function Al(e, t = 30) {
  const r = Number(t);
  return Number(e) / (Number.isFinite(r) && r > 0 ? r : 30);
}
function ri() {
  try {
    return ni(window.localStorage.getItem(Ba));
  } catch {
    return { ...lo };
  }
}
function na(e) {
  const t = ni(JSON.stringify(e));
  try {
    window.localStorage.setItem(Ba, JSON.stringify(t));
  } catch {
  }
  return t;
}
const Kt = Object.freeze({
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
function eo(e) {
  return e === "full" || e === "review" ? "full" : "basic";
}
function oi(e) {
  const t = (e == null ? void 0 : e.schemaVersion) === 1, r = (e == null ? void 0 : e.requestedMode) === "basic" || (e == null ? void 0 : e.requestedMode) === "full" || (e == null ? void 0 : e.requestedMode) === "editor" || (e == null ? void 0 : e.requestedMode) === "review", o = (e == null ? void 0 : e.effectiveMode) === "basic" || (e == null ? void 0 : e.effectiveMode) === "full" || (e == null ? void 0 : e.effectiveMode) === "editor" || (e == null ? void 0 : e.effectiveMode) === "review", i = t && r && o;
  return {
    schemaVersion: i ? 1 : 0,
    requestedMode: i ? eo(e.requestedMode) : "basic",
    effectiveMode: i ? eo(e.effectiveMode) : "basic",
    legacyCompatibilityRequired: i && e.legacyCompatibilityRequired === !0,
    capabilities: i && Array.isArray(e.capabilities) ? [...new Set(e.capabilities.filter((a) => typeof a == "string"))] : []
  };
}
function xn(e, t) {
  return Array.isArray(e == null ? void 0 : e.capabilities) && e.capabilities.includes(t);
}
function Rl(e) {
  return (e == null ? void 0 : e.effectiveMode) === "full" ? "review" : "editor";
}
function Ml(e) {
  const t = [];
  return xn(e, Kt.navigationVideos) && t.push({ key: "videos", label: "Videos", href: "/segment-studio", route: { page: "segment-studio" } }), xn(e, Kt.navigationSegmentInventory) && t.push({ key: "segments", label: "Segments", href: "/segment-studio/segments", route: { page: "segment-studio", slug: "segments" } }), t;
}
function El(e) {
  return [
    ["general", "General", Kt.settingsGeneral],
    ["shortcuts", "Shortcuts", Kt.settingsShortcuts],
    ["performer-slots", "Performer slots", Kt.settingsPerformerSlots],
    ["derivation", "Derivation", Kt.settingsDerivation]
  ].filter(([, , r]) => xn(e, r)).map(([r, o]) => [r, o]);
}
function Dl(e, t) {
  return e === "segments" && !xn(
    t,
    Kt.navigationSegmentInventory
  ) || e === "bin" && !xn(
    t,
    Kt.recyclingBinView
  ) ? "videos" : e;
}
function Ol(e) {
  const t = Number(e), r = Number.isFinite(t) && t >= 0 ? Math.trunc(t) : 0;
  if (r === 0)
    return `Basic mode hides Full-only expanded metadata, including review, lineage, derivation, and performer slots.

Nothing will be deleted. Hidden metadata will reappear when you return to Full mode.`;
  const o = r === 1;
  return `You have ${r} extension-owned ${o ? "segment" : "segments"}. Basic mode only shows Cove's native segments. If you proceed, ${o ? "this segment" : "these segments"} will be hidden.

Full-only expanded metadata, including review, lineage, derivation, and performer slots, will also be hidden. Nothing will be deleted. The hidden ${o ? "segment" : "segments"} and metadata will reappear when you return to Full mode.`;
}
function Pl(e, t = 0) {
  const r = Number(e), o = Number.isFinite(r) && r >= 0 ? Math.trunc(r) : 0, i = Number(t), a = Number.isFinite(i) && i >= 0 ? Math.trunc(i) : 0, s = a > 0 ? `

${a} collected incorrect ${a === 1 ? "example remains" : "examples remain"} protected and manageable after the switch.` : "";
  return o === 0 ? `Switching to Full mode clears Basic undo history because Full uses a separate history workflow.${s}

Switch to Full mode and clear Basic undo history?` : `The recycling bin contains ${o} unprotected ${o === 1 ? "segment" : "segments"}. ${o === 1 ? "It" : "They"} must be permanently removed before switching. Basic undo history will also be cleared because Full uses a separate history workflow.${s}

Remove the unprotected ${o === 1 ? "segment" : "segments"}, clear Basic undo history, and switch to Full mode? This cannot be undone.`;
}
const Hr = {
  resetKey: "segment-studio-browse",
  defaultFilter: { page: 1, perPage: 24, sort: "default", direction: "desc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid"]
}, ra = [
  { id: "activities", label: "Tags", type: "multiId", entityType: "tags", filterKey: "activitiesCriterion", modifiers: ["INCLUDES"] },
  { id: "performers", label: "Performers", type: "multiId", entityType: "performers", filterKey: "performersCriterion", modifiers: ["INCLUDES"] },
  { id: "reviewState", label: "Review State", type: "enum", filterKey: "reviewStateCriterion", modifiers: ["EQUALS"], options: pt.map((e) => ({ value: e, label: e[0].toUpperCase() + e.slice(1) })) }
];
function Ll(e) {
  const t = String(e || "").split(",").filter((r) => pt.includes(r));
  return t.length === 0 ? [...pt] : [...new Set(t)];
}
function bn(e) {
  return ai(e).values;
}
function ai(e) {
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
function _r(e, t) {
  return Object.keys(t || {}).length ? JSON.stringify({ activityTagId: e, values: t }) : void 0;
}
function oa(e, t) {
  var l;
  const r = aa(t.activitiesCriterion, t.activityId), o = aa(t.performersCriterion, t.performerId), i = r.length === 1 ? r[0] : null, a = ai(t.slots), s = i && (a.activityTagId == null || a.activityTagId === i) ? Object.entries(a.values).map(([d, c]) => ({
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
function aa(e, t) {
  const r = Array.isArray(e == null ? void 0 : e.value) ? e.value : [t];
  return [...new Set(r.map(Number).filter((o) => Number.isInteger(o) && o > 0))];
}
function Fl(e, t) {
  return pt.includes(e == null ? void 0 : e.value) ? [e.value] : Ll(t);
}
function ii(e) {
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
function ia(e = typeof window > "u" ? "" : window.location.search) {
  const t = Number(new URLSearchParams(e).get("item"));
  return Number.isInteger(t) && t > 0 ? t : null;
}
function Gl(e, t, r) {
  if (typeof r != "function" || e == null) return !1;
  const o = (t || []).find((i) => i.id === e);
  return o ? (r(o.startSec, !1), !0) : !1;
}
function nt(e) {
  return (e == null ? void 0 : e.id) ?? (e == null ? void 0 : e.performerId);
}
function mo(e) {
  return (e || []).filter((t) => t.isVideoPerformer);
}
function qr(e, t) {
  const r = new Set(mo(t).map((o) => String(nt(o))));
  return Object.fromEntries((e || []).map((o) => [
    o.slotDefinitionId,
    o.performerId != null && r.has(String(o.performerId)) ? String(o.performerId) : ""
  ]));
}
function qt(e) {
  return String(e || "").toLowerCase().replaceAll(/[^a-z]/g, "");
}
function sa(e) {
  return `${String(e.label || "").trim()}|${(e.genderHints || []).map(qt).sort().join(",")}`;
}
function si(e, t, r = 9) {
  if (!(e != null && e.length) || !(t != null && t.length)) return [];
  const o = e.filter((m) => String(m.label || "").trim());
  if (o.length > 0 && o.length < e.length) return [];
  const i = e[0].allowSamePerformerInMultipleSlots === !0, a = Math.max(0, Math.min(9, Math.floor(Number(r)) || 0));
  if (a === 0) return [];
  if (o.length === 0 && e.every((m) => {
    var p;
    return !((p = m.genderHints) != null && p.length);
  }) && e.length === t.length && !i) {
    const m = [...e].sort((b, y) => String(b.slotDefinitionId).localeCompare(String(y.slotDefinitionId))), p = [...t].sort((b, y) => String(b.name).localeCompare(String(y.name)) || Number(nt(b)) - Number(nt(y)));
    return [{
      assignments: Object.fromEntries(m.map((b, y) => [String(b.slotDefinitionId), String(nt(p[y]))])),
      description: p.map((b) => b.name).join(", ")
    }];
  }
  const s = [], l = /* @__PURE__ */ new Set(), d = [], c = e.map((m) => t.map((p, b) => ({ performer: p, index: b })).filter(({ performer: p }) => {
    var b;
    return !((b = m.genderHints) != null && b.length) || m.genderHints.some((y) => qt(y) === qt(p.gender || p.genderIdentity));
  }).map(({ index: p }) => p)), g = i ? c.filter((m) => m.length > 0).length : la(c, t.length);
  if (g === 0) return [];
  const u = new Map(t.map((m, p) => [String(nt(m)), p]));
  function f(m, p, b) {
    if (s.length >= a) return;
    const y = c.slice(m), w = i ? y.filter((R) => R.length > 0).length : la(y.map((R) => R.filter((K) => !p.has(String(nt(t[K]))))), t.length);
    if (b + w < g) return;
    if (m === e.length) {
      if (b !== g) return;
      const R = Object.fromEntries(d.map(({ slot: v, performer: A }) => [String(v.slotDefinitionId), A ? String(nt(A)) : ""])), K = o.length === 0 ? Object.values(R).sort().join(",") : [...new Set(e.map((v) => String(v.label || "")))].map((v) => `${v}:${d.filter(({ slot: A }) => String(A.label || "") === v).map(({ performer: A }) => A ? String(nt(A)) : "").sort().join(",")}`).join("|");
      !l.has(K) && s.length < a && (l.add(K), s.push({
        assignments: R,
        description: d.map(({ slot: v, performer: A }) => o.length ? `${v.label}: ${(A == null ? void 0 : A.name) || "Unassigned"}` : (A == null ? void 0 : A.name) || "Unassigned").join(", ")
      }));
      return;
    }
    const k = e[m], I = [...d].reverse().find(({ slot: R }) => sa(R) === sa(k)), L = I ? u.get(String(nt(I.performer))) : -1;
    for (const R of c[m]) {
      const K = t[R], v = nt(K);
      if (!(R < L) && !(v == null || !i && p.has(String(v))) && (d.push({ slot: k, performer: K }), i || p.add(String(v)), f(m + 1, p, b + 1), i || p.delete(String(v)), d.pop(), s.length >= a))
        return;
    }
    d.push({ slot: k, performer: null }), f(m + 1, p, b), d.pop();
  }
  return f(0, /* @__PURE__ */ new Set(), 0), s;
}
function la(e, t) {
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
      !o && d.has(u.performerId) || (g = c.genderHints) != null && g.length && !c.genderHints.some((f) => qt(f) === qt(u.gender)) || (a.push({ slot: c, performer: u }), o || d.add(u.performerId), s(l + 1, d), o || d.delete(u.performerId), a.pop());
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
function li(e, t, r) {
  const o = nt, i = new Set((t || []).map(o)), a = new Set((r || []).map(qt));
  return [...new Map([...t || [], ...e || []].map((l) => [o(l), l])).values()].sort((l, d) => {
    const c = l.isVideoPerformer ?? i.has(o(l)), g = d.isVideoPerformer ?? i.has(o(d));
    if (c !== g) return g - c;
    const u = qt(l.gender || l.genderIdentity), f = qt(d.gender || d.genderIdentity), m = l.matchesGenderHint ?? a.has(u);
    return (d.matchesGenderHint ?? a.has(f)) - m || String(l.name).localeCompare(String(d.name)) || o(l) - o(d);
  });
}
const { useEffect: ye, useId: di, useLayoutEffect: ql, useMemo: qe, useReducer: Wl, useRef: fe, useState: j, useSyncExternalStore: Vl } = io, n = io.createElement, ci = "/api/plugins/segment-studio";
function Fe(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(tn) || "{}");
    if (typeof t[e] == "string" && t[e]) return t[e];
    const r = to();
    return t[e] = r, window.localStorage.setItem(tn, JSON.stringify(t)), r;
  } catch {
    return to();
  }
}
function Ue(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(tn) || "{}");
    delete t[e], delete t[`${e}:discardMissingImage`], window.localStorage.setItem(tn, JSON.stringify(t));
  } catch {
  }
}
function go(e) {
  try {
    return JSON.parse(window.localStorage.getItem(tn) || "{}")[`${e}:discardMissingImage`] === !0;
  } catch {
    return !1;
  }
}
function po(e) {
  try {
    const t = JSON.parse(window.localStorage.getItem(tn) || "{}");
    t[`${e}:discardMissingImage`] = !0, window.localStorage.setItem(tn, JSON.stringify(t));
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
async function Z(e, t, r = 0) {
  var d;
  const o = await Ra(`${ci}${e}`, t);
  if (o.status === 204) return null;
  const i = await o.text(), a = Jl(i);
  if (!o.ok) {
    const c = new Error(((d = a.value) == null ? void 0 : d.error) || "Unable to load Segment Studio.");
    throw c.status = o.status, c.payload = a.value, c;
  }
  if (a.parsed) return a.value;
  if (String((t == null ? void 0 : t.method) || "GET").toUpperCase() === "GET" && r < 2)
    return await Yl(250 * (r + 1), t == null ? void 0 : t.signal), Z(e, t, r + 1);
  const l = new Error("Segment Studio received an unexpected response. Reload and try again.");
  throw l.status = o.status, l;
}
async function Ql(e, t) {
  const r = String(e).startsWith("/api/") ? e : `${ci}${e}`, o = await Ra(r, t);
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
function Ae(e) {
  if (e == null) return "—";
  const t = e < 0 ? "−" : "", r = Math.abs(e), o = Math.floor(r), i = Math.floor(o / 3600), a = Math.floor(o % 3600 / 60), s = o % 60, l = i > 0 ? `${i}:${String(a).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${a}:${String(s).padStart(2, "0")}`, d = Math.round((r - o) * 1e3);
  return `${t}${d > 0 ? `${l}.${String(d).padStart(3, "0")}` : l}`;
}
function to() {
  var e, t;
  return ((t = (e = globalThis.crypto) == null ? void 0 : e.randomUUID) == null ? void 0 : t.call(e)) || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function ui(e, t) {
  return e.permissionFailureCount > 0 ? (t("You do not have permission to delete every affected segment."), !1) : (e.integrityWarnings || []).length > 0 ? (t("Repair the affected derivation data before deleting these segments."), !1) : !0;
}
function Xl(e) {
  const t = Number(e.selectedSegmentCount) || 0, r = Number(e.dependentSegmentCount) || 0, o = Number(e.deletedSegmentCount) || t + r, i = Number(e.retainedSharedSegmentCount) || 0, a = Number(e.deferredRejectedSegmentCount) || 0, s = `${t} selected segment${t === 1 ? "" : "s"}`, l = r > 0 ? ` and ${r} dependent derived segment${r === 1 ? "" : "s"}` : "", d = i > 0 ? ` ${i} shared derived segment${i === 1 ? "" : "s"} will be kept.` : "", c = a > 0 ? ` ${a} feedback-protected rejected segment${a === 1 ? "" : "s"} will be kept until ${a === 1 ? "its" : "their"} AI feedback is exported.` : "";
  return !!window.confirm(
    `Permanently delete ${s}${l} (${o} total)?${d}${c} This cannot be undone.`
  );
}
function mi(e, t) {
  const r = Array.isArray(e) ? e : [], o = Number(t), i = Number.isFinite(o) && o >= 0 ? Math.trunc(o) : r.length;
  return { sceneCount: new Set(r.map((s) => s == null ? void 0 : s.videoId).filter((s) => s != null)).size, segmentCount: i };
}
function ed(e, t) {
  const { sceneCount: r, segmentCount: o } = mi(e, t);
  return `Permanently delete ${o} segment${o === 1 ? "" : "s"} from ${r} scene${r === 1 ? "" : "s"} in the recycling bin? This cannot be undone.`;
}
async function gi(e, t) {
  const r = (e == null ? void 0 : e.items) || [], o = mi(r, e == null ? void 0 : e.totalCount);
  if (o.segmentCount === 0)
    return { status: "empty", ...o };
  if (!(e != null && e.fingerprint))
    throw new Error("The recycling-bin fingerprint is unavailable. Reload and try again.");
  if (!window.confirm(ed(r, o.segmentCount)))
    return { status: "canceled", ...o };
  t == null || t();
  const i = `bin-empty:${e.fingerprint}`, a = await Z("/bin/empty", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      operationId: Fe(i),
      expectedFingerprint: e.fingerprint
    })
  });
  return Ue(i), {
    status: "emptied",
    sceneCount: Array.isArray(a.videoIds) ? a.videoIds.length : o.sceneCount,
    segmentCount: Number(a.deletedCount) || o.segmentCount
  };
}
function da({ children: e }) {
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
function bu(e, t) {
  return {
    ...(At[e] || At.unreviewed).row,
    ...t ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {}
  };
}
function pi(e) {
  return { ...(At[e] || At.unreviewed).badge };
}
function fi(e, t = !1) {
  return {
    backgroundColor: "var(--color-card)",
    ...e ? { outline: "2px solid var(--color-accent)", outlineOffset: "-2px" } : {},
    ...t ? { outline: "3px solid var(--color-accent)", outlineOffset: "1px", zIndex: 30 } : {}
  };
}
const yi = {
  complete: { label: "Slots filled", color: "rgb(34, 211, 238)", backgroundColor: "rgba(34, 211, 238, 0.14)" },
  partial: { label: "Slots partially filled", color: "rgb(192, 132, 252)", backgroundColor: "rgba(192, 132, 252, 0.14)" },
  empty: { label: "Slots empty", color: "rgb(251, 146, 60)", backgroundColor: "rgba(251, 146, 60, 0.14)" }
};
function td(e, t, r = "not-applicable", o = !1) {
  const i = At[e] || At.unreviewed, a = e === "approved" ? "rgb(22, 163, 74)" : e === "rejected" ? "rgb(220, 38, 38)" : "rgb(234, 179, 8)", s = e !== "rejected" && (r === "empty" || r === "partial");
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
function vr(e = !1) {
  return `color-mix(in srgb, var(--color-accent) ${e ? 14 : 8}%, var(--color-surface))`;
}
function id(e) {
  return 0.34375 + Math.max(0, Number(e) || 0) * 1.25;
}
function nn({ state: e, includeLabel: t = !0 }) {
  const r = At[e] || At.unreviewed;
  return n("span", {
    "aria-label": `Review state: ${e}`,
    className: "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold",
    style: pi(e)
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
function hu(e, t) {
  var a, s, l;
  if (!t) return !1;
  const r = e.target, o = ((a = e.view) == null ? void 0 : a.document) ?? (r == null ? void 0 : r.ownerDocument), i = o == null ? void 0 : o.activeElement;
  return r === t || ((s = t.contains) == null ? void 0 : s.call(t, r)) || i === t || ((l = t.contains) == null ? void 0 : l.call(t, i)) || r === (o == null ? void 0 : o.body) && i === o.body;
}
function ld(e, t = document) {
  return !(e.defaultPrevented || sd(e.target, e.key) || t.querySelector("[role='dialog'], [role='listbox'], [role='menu'], [aria-modal='true']"));
}
function vu(e, t = document, r = !1, o = {}) {
  return ld(e, t) ? pl(e, r, o) != null : !1;
}
function bt(e, { onCancel: t, onConfirm: r } = {}) {
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
function Lt(e) {
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
function ir(e, t = !0) {
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
function wt(e, t = !0) {
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
function sr(e, t) {
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
function bi(e, t) {
  return (e || []).filter((r) => r.segmentId === t).sort((r, o) => r.sortOrder - o.sortOrder || String(r.slotDefinitionId).localeCompare(String(o.slotDefinitionId)));
}
function hi(e) {
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
  const r = (t || []).map((i) => bi(e, i.id));
  if (r.length === 0 || r.some((i) => i.length === 0)) return null;
  const o = (i) => i.map((a) => JSON.stringify({
    label: ft(a),
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
function xu(e, t) {
  return bo(bi(e, t));
}
function ft(e) {
  return String((e == null ? void 0 : e.label) || "").trim() || `Slot ${Math.max(0, Number(e == null ? void 0 : e.sortOrder) || 0) + 1}`;
}
function fd(e, t) {
  const r = (d) => ft(d).trim().toLocaleLowerCase().replaceAll(/\s+/g, " "), o = (d, c) => (Number(d.sortOrder) || 0) - (Number(c.sortOrder) || 0) || String(d.id).localeCompare(String(c.id)), i = (d) => {
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
  const t = ft(e), r = Number(e == null ? void 0 : e.performerId), o = r > 0, i = String((e == null ? void 0 : e.performerName) || "").trim(), a = o ? i || `Performer ${r}` : "Unfilled", s = ((e == null ? void 0 : e.genderHints) || []).map(xr).filter(Boolean);
  return {
    label: t,
    performer: a,
    filled: o,
    title: `${t}${s.length ? ` (${s.join("/")})` : ""}: ${a}`
  };
}
function xr(e) {
  const t = String(e || "").trim().toLowerCase().replaceAll("_", " ");
  return t ? `${t[0].toUpperCase()}${t.slice(1)}` : "";
}
function br(e) {
  const t = { unreviewed: 0, approved: 0, rejected: 0 };
  for (const r of e)
    Object.hasOwn(t, r.reviewState) && (t[r.reviewState] += 1);
  return t;
}
function ca(e) {
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
  const t = e.map(ft), r = /* @__PURE__ */ new Map();
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
    return [ca({ ...e, performerLabel: null, performers: [], performerAssignments: [] })];
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
        const c = hd(l.slots), g = l.slots.filter((b) => !a.has(String(b.slotDefinitionId))), u = o.length === 1 ? l.slots : g, f = u.map((b) => `${c.get(String(b.slotDefinitionId))} · ${b.performerName || `Performer ${b.performerId}`}`).join(" · "), m = [...new Map(u.map((b) => [
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
          performerLabel: f,
          performers: m,
          performerAssignments: p,
          segments: []
        });
      }
    s.get(d).segments.push(l.segment);
  }
  return [...s.values()].sort((l, d) => +(l.performerLabel === "Unfilled performer slots") - +(d.performerLabel === "Unfilled performer slots") || l.performerLabel.localeCompare(d.performerLabel) || l.key.localeCompare(d.key)).map(ca);
}
function en(e, t = [], r = []) {
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
    for (const s of pt)
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
function vi(e, t, r, o = 240) {
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
function xi(e, { nativeOnly: t = !1 } = {}) {
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
function ua(e, t) {
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
function Vt(e) {
  return Array.isArray(e) ? [...new Set(e.filter((t) => t === "ungrouped" || /^group:\d+$/.test(t)))] : [];
}
function Hn(e) {
  return e.performerLabel && e.performerLabel !== "Unfilled performer slots" ? `${e.label} · ${e.performerLabel}` : e.label;
}
function Nd(e) {
  return String(e || "?").split(/\s+/).filter(Boolean).slice(0, 2).map((t) => {
    var r;
    return (r = t[0]) == null ? void 0 : r.toUpperCase();
  }).join("") || "?";
}
function _n({ performer: e, compact: t = !1, tooltip: r = null }) {
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
function Si({ assignments: e, className: t = "" }) {
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
      n(_n, {
        key: `${r.key}:avatar`,
        performer: r.performer
      })
    ];
  }));
}
function Sr({ performers: e, performerAssignments: t, interactive: r = !0 }) {
  const o = fe(null), i = `performer-slots-${di()}`, [a, s] = j(null);
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
    ...e.slice(0, 3).map((c) => n(_n, {
      key: c.id,
      performer: c,
      compact: !0
    })),
    a ? fs(n("span", {
      id: i,
      role: "tooltip",
      className: "pointer-events-none fixed z-[100] overflow-y-auto rounded-md border border-border bg-card p-2 text-left shadow-xl",
      style: { ...a, maxHeight: "calc(100vh - 1rem)" }
    }, n(Si, {
      assignments: (t || []).map((c) => ({
        ...c,
        key: c.slotDefinitionId
      }))
    })), document.body) : null
  ]) : n("span", {
    className: "ml-auto flex shrink-0 -space-x-1",
    "aria-label": d,
    title: d
  }, e.slice(0, 3).map((c) => n(_n, {
    key: c.id,
    performer: c,
    compact: !0
  })));
}
function Id(e, t) {
  const r = new Set(Vt(t));
  return (e || []).filter((o) => !r.has(o.segmentGroupId == null ? "ungrouped" : `group:${o.segmentGroupId}`));
}
function ki(e, t) {
  return t ? Vt(e).filter((r) => r !== t) : Vt(e);
}
function Cd(e, t) {
  const r = Vt(t), o = new Set(Vt(e));
  return r.length > 0 && r.every((i) => o.has(i)) ? [] : r;
}
function Tt(e, t) {
  const r = (e || []).find((o) => o.markers.some((i) => i.segment.id === t));
  return r ? r.segmentGroupId == null ? "ungrouped" : `group:${r.segmentGroupId}` : null;
}
function ma(e, t, r) {
  const o = Number(r);
  if (!Number.isFinite(o)) return 0;
  const i = (l) => {
    const d = Number(l.segment.startSec) || 0, c = l.segment.endSec == null ? d : Number(l.segment.endSec), g = Number.isFinite(c) && c >= d ? c : d, u = d <= o && g >= o, f = u ? 0 : Math.min(Math.abs(o - d), Math.abs(o - g));
    return { contains: u, distance: f, duration: g - d, start: d };
  }, a = i(e), s = i(t);
  return Number(s.contains) - Number(a.contains) || (a.contains && s.contains ? s.duration - a.duration : a.distance - s.distance) || a.start - s.start || e.segment.id - t.segment.id;
}
function no(e, t, r, o = null) {
  var g, u, f, m, p, b;
  const i = e.findIndex((y) => y.markers.some((w) => w.segment.id === t));
  if (i < 0) {
    const y = [...((g = e[0]) == null ? void 0 : g.markers) || []];
    return o != null && Number.isFinite(Number(o)) && y.sort((w, k) => ma(w, k, o)), ((u = y[0]) == null ? void 0 : u.segment) ?? null;
  }
  const a = e[i], s = a.markers.findIndex((y) => y.segment.id === t);
  if (r === "left" || r === "right") {
    const y = r === "left" ? -1 : 1, w = Math.min(a.markers.length - 1, Math.max(0, s + y));
    return ((f = a.markers[w]) == null ? void 0 : f.segment) ?? null;
  }
  const l = Math.min(e.length - 1, Math.max(0, i + (r === "up" ? -1 : 1))), d = Number((m = a.markers[s]) == null ? void 0 : m.segment.startSec) || 0, c = o != null && Number.isFinite(Number(o));
  return l === i ? ((p = a.markers[s]) == null ? void 0 : p.segment) ?? null : ((b = [...e[l].markers].sort(c ? (y, w) => ma(y, w, Number(o)) : (y, w) => Math.abs(y.segment.startSec - d) - Math.abs(w.segment.startSec - d) || y.segment.startSec - w.segment.startSec || y.segment.id - w.segment.id)[0]) == null ? void 0 : b.segment) ?? null;
}
function $d(e, t, r) {
  const o = (e || []).find((a) => a.markers.some((s) => s.segment.id === t));
  if (!o) return null;
  const i = no([o], t, r);
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
  if (!Number.isFinite(o) || o <= r) return [fa(r)];
  const i = o - r, a = i < 30 ? [4] : i < 60 ? [4, 20] : i < 120 ? [4, 20, 50] : [4, 20, 50, 100], s = Math.max(r, o - 1e-3);
  return [...new Set(a.map((l) => fa(Math.min(s, r + l))))];
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
function ga(e, t, r) {
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
async function Od(e, t) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error("Collect at least one incorrect example before exporting.");
  const r = document.createElement("video");
  r.preload = "auto", r.muted = !0, r.playsInline = !0, r.style.cssText = "position:fixed;width:1px;height:1px;left:-10000px;top:-10000px;opacity:0;pointer-events:none", document.body.append(r);
  try {
    if (r.src = `/api/stream/video/${encodeURIComponent(e)}`, await pa(r, "loadeddata"), !r.videoWidth || !r.videoHeight)
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
        Math.abs(r.currentTime - f) > 5e-4 && (r.currentTime = f, await pa(r, "seeked")), i.drawImage(r, 0, 0, o.width, o.height);
        const m = await Pd(o), p = `example-${l + 1}-frame-${u + 1}`;
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
function pa(e, t) {
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
function Pd(e) {
  return new Promise((t, r) => {
    e.toBlob(
      (o) => o ? t(o) : r(new Error("The browser could not encode a JPEG frame.")),
      "image/jpeg",
      0.95
    );
  });
}
function fa(e) {
  return Math.round(e * 1e3) / 1e3;
}
function ro(e, t, r) {
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
function oo(e, t) {
  const r = new Set(t || []);
  return {
    ...e,
    segments: (e.segments || []).filter((o) => !r.has(o.id))
  };
}
function hr(e, t, r) {
  const o = new Map((t || []).map((i) => [i.id, i]));
  return {
    ...e,
    segments: (e.segments || []).map((i) => {
      const a = o.get(i.id);
      return a ? r.reduce((s, l) => ({ ...s, [l]: a[l] }), i) : i;
    }).sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function wi(e, t) {
  const r = t || [], o = new Set((e.segments || []).map((i) => i.id));
  return {
    ...e,
    segments: [
      ...e.segments || [],
      ...r.filter((i) => !o.has(i.id))
    ].sort((i, a) => i.startSec - a.startSec || i.id - a.id)
  };
}
function Wr(e, t, r, o) {
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
function ya(e, t, r) {
  return t.tagId !== e.tagId || t.reviewState != null && t.reviewState !== e.reviewState;
}
function jd(e) {
  const { acquireSaveLock: t, compatibilityMode: r, dispatchPendingChanges: o, currentTime: i, detail: a, editorFilters: s, endInput: l, hideDerivedSegments: d, historyRef: c, mediaDuration: g, onConflict: u, onDetailChange: f, onReload: m, optimisticSegmentIdRef: p, pendingDuplicateRef: b, pendingFirstSegmentStartSecRef: y, pendingTagEditSegmentIdRef: w, heldCreatedSegmentTag: k, setHeldCreatedSegmentTag: I, replaceSegmentSelection: L, savingSegmentId: R, segments: K, selectedSegment: v, selectedSegmentIdRef: A, selectedSegments: $, selectionAnchorIdRef: D, selectionRangeBaseIdsRef: W, setCreatingSegmentId: ee, setEditorFilters: q, setFirstSegmentTagOpen: C, setHideDerivedSegments: P, setHistory: G, setHistoryOpen: te, setPublishApprovedError: ce, setSaveMessage: z, setSelectedSegmentGroupKey: se, setSelectedSegmentId: H, setSelectedSegmentIds: ae, setTagEditing: ge, startInput: xe, tagEditingRef: oe, timelineDuration: he, video: B } = e;
  function ue(N) {
    c.current = N || Ut, G(c.current);
  }
  async function re(N, E, J, U, pe = null) {
    var M;
    try {
      const Y = await Z(`/videos/${B.id}/history/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expectedRevision: c.current.revision,
          kind: N,
          label: E,
          beforeState: J,
          afterState: U,
          receiptId: pe
        })
      });
      return ue(Y), !0;
    } catch (Y) {
      return Y.status === 409 && ((M = Y.payload) != null && M.current) && ue(Y.payload.current), z("The change saved, but editor history could not be updated."), !1;
    }
  }
  async function X(N, E, J = !0, U = null, pe = !1, M = E, Y = !0) {
    var Ye;
    if (!N || R != null) return null;
    const _ = $.map((we) => we.id), me = A.current, Me = J && !r ? crypto.randomUUID() : null, Ne = t("segment", N.id);
    if (!Ne) return null;
    z(J ? "Saving directly to Cove…" : "Restoring history…");
    const ke = pe ? Ya() : null;
    ke && o({
      type: "add",
      entry: { id: ke, op: "patch", targets: [el(N)], values: M }
    });
    const rt = () => {
      ke && o({ type: "settle", key: ke });
    };
    try {
      if (r && N.nativeSegmentId == null && N.itemId != null) {
        const Qe = `draft-update:${B.id}:${N.itemId}:${N.revision}:${E.tagId}:${E.startSec}:${E.endSec ?? "open"}:${E.reviewState ?? N.reviewState}`, je = await Z(`/videos/${B.id}/drafts/${N.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(Qe),
            expectedRevision: N.revision,
            startSec: E.startSec,
            endSec: E.endSec,
            tagId: E.tagId,
            reviewState: E.reviewState
          })
        });
        Ue(Qe);
        const Q = {
          ...N,
          ...je.draft,
          id: N.id,
          itemId: N.itemId
        };
        return J && await re(
          "segment.update",
          U || "Changed segment",
          ir(N, r),
          ir(
            Q,
            r
          )
        ), ya(N, E, r) ? await m() : f((de) => ({
          ...de,
          approvedSetVersion: je.approvedSetVersion || de.approvedSetVersion,
          segments: (de.segments || []).map((Ee) => Ee.id === N.id ? Q : Ee).sort((Ee, Be) => Ee.startSec - Be.startSec || Ee.id - Be.id)
        }), B.id), rt(), z(((Ye = je.draft) == null ? void 0 : Ye.reviewState) === "approved" ? "Approved draft saved" : "Draft saved"), Q;
      }
      const we = await Z(`/videos/${B.id}/segments/${N.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...E,
          expectedUpdatedAt: N.updatedAt,
          historyReceiptId: Me
        })
      }), Ke = {
        ...N,
        ...we,
        reviewState: E.reviewState ?? N.reviewState
      };
      return ya(N, E, r) ? await m() : f((Qe) => ({
        ...Qe,
        segments: (Qe.segments || []).map((je) => je.id === N.id ? Ke : je).sort((je, Q) => je.startSec - Q.startSec || je.id - Q.id)
      }), B.id), rt(), J && await re(
        "segment.update",
        U || "Changed segment",
        ir(N, r),
        ir(
          Ke,
          r
        ),
        Me
      ), z(J ? "Saved to Cove" : "History restored"), Ke;
    } catch (we) {
      return ke && o({ type: "discard", key: ke }), pe && Y && (ae(_), H(me), D.current = me, W.current = []), we.status === 409 ? (z("Conflict — loading the latest segment…"), await u()) : z(we.message || "Unable to save the segment."), null;
    } finally {
      Ne();
    }
  }
  async function be() {
    if (!r) return !1;
    const N = K.filter((U) => !U.published && U.reviewState === "approved").length;
    if (N === 0 || R != null) return !1;
    const E = `complete-review:${B.id}:${a.approvedSetVersion}`, J = t("publish", -1);
    if (!J) return !1;
    ce(""), z(`Publishing ${N} Approved draft${N === 1 ? "" : "s"}…`);
    try {
      const U = await Z(`/videos/${B.id}/complete-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(E),
          expectedApprovedSetVersion: a.approvedSetVersion
        })
      });
      Ue(E), ue(Ut), te(!1);
      const pe = await m(), M = $l(
        K,
        A.current,
        U.published
      ), Y = M ? Je(pe == null ? void 0 : pe.segments, M) : null;
      return Y && H(Y.id), z(`${U.published.length} Approved draft${U.published.length === 1 ? "" : "s"} published to Cove.`), !0;
    } catch (U) {
      const pe = U.status === 409 ? "The approved drafts changed. Review the updated list and try again." : U.message || "Unable to publish the approved drafts.";
      return U.status === 409 && await u(), ce(pe), z(pe), !1;
    } finally {
      J();
    }
  }
  async function V(N = null, E = null) {
    var Ye;
    if (R != null || ie()) return;
    const J = N != null ? y.current : null, U = Number.isFinite(J) ? J : i, pe = Math.min(he, U + 20);
    if (pe <= U) {
      z("Move the playhead before the end of the video to create a segment.");
      return;
    }
    const M = kl(K, v, N);
    if (M.kind === "choose-tag") {
      y.current = U, z(""), C(!0);
      return;
    }
    if (M.kind === "invalid-selection") {
      z("Select a swimlane before creating a segment.");
      return;
    }
    const { tagId: Y } = M, _ = `create-draft:${B.id}:${Y}:${U}`, me = r ? null : crypto.randomUUID(), Me = A.current, Ne = {
      ...v || {},
      id: p.current--,
      itemId: null,
      nativeSegmentId: null,
      published: !1,
      tagId: Y,
      tagName: E || (v == null ? void 0 : v.tagName) || "Tag segment",
      tagSortName: Y === (v == null ? void 0 : v.tagId) && (v == null ? void 0 : v.tagSortName) || null,
      startSec: U,
      endSec: pe,
      reviewState: "unreviewed",
      revision: 0,
      updatedAt: null,
      sourceKey: "user",
      sourceRunId: null,
      confidence: null,
      isDerived: !1
    }, ke = t("create", -1);
    if (!ke) return;
    const rt = Ld(a, Ne);
    C(!1), f(rt, B.id), M.openTagEditor && (ee(Ne.id), w.current = Ne.id, ge(!0)), L(Ne.id), se(Tt(
      en(rt.segments, rt.segmentGroups || [], rt.performerSlots || []),
      Ne.id
    ));
    try {
      let we;
      if (r) {
        const je = await Z(`/videos/${B.id}/drafts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ operationId: Fe(_), tagId: Y, startSec: U, endSec: pe })
        });
        Ue(_), we = { itemId: (Ye = je.draft) == null ? void 0 : Ye.itemId };
      } else
        we = { nativeSegmentId: (await Z(`/videos/${B.id}/segments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tagId: Y,
            startSec: U,
            endSec: pe,
            historyReceiptId: me
          })
        })).id };
      y.current = null, C(!1);
      const Ke = await m();
      if (!Ke) {
        f((je) => oo(
          je,
          [Ne.id]
        ), B.id), L(Me), z(`Segment created, but the editor could not refresh it. Reload Segment Studio to see the saved segment${M.openTagEditor ? " and choose its tag again if you picked one" : ""}.`);
        return;
      }
      const Qe = Je(Ke == null ? void 0 : Ke.segments, we);
      Qe ? (M.openTagEditor && (oe.current && (w.current = Qe.id), I((je) => (je == null ? void 0 : je.segmentId) === Ne.id ? { ...je, segmentId: Qe.id } : je), ee(Qe.id)), L(Qe.id), se(Tt(
        en(Ke.segments || [], Ke.segmentGroups || [], Ke.performerSlots || []),
        Qe.id
      )), r || await re(
        "segment.create",
        "Created segment",
        wt([], !1),
        wt([Qe], !1),
        me
      )) : (ge(!1), z(`Segment created, but it could not be selected${M.openTagEditor ? "; choose its tag again if you picked one" : ""}.`));
    } catch (we) {
      f((Ke) => oo(
        Ke,
        [Ne.id]
      ), B.id), L(Me), N != null && C(!0), z(we.message || "Unable to create the draft.");
    } finally {
      I((we) => (we == null ? void 0 : we.segmentId) === Ne.id ? null : we), ee(null), ke();
    }
  }
  function ie() {
    return k == null || k.segmentId !== (v == null ? void 0 : v.id) ? !1 : (z("Close the tag field to save the new segment's tag first."), !0);
  }
  async function T() {
    if ($.length !== 1 || !v || R != null || ie()) return;
    const N = i;
    if (N <= v.startSec || v.endSec != null && N >= v.endSec) {
      z("Move the playhead inside the selected segment before splitting.");
      return;
    }
    const E = `split-draft:${v.itemId}:${v.revision}:${N}`, J = r ? null : wt([v], !1), U = r ? null : crypto.randomUUID(), pe = t("split", v.id);
    if (pe)
      try {
        let M = null;
        r && v.nativeSegmentId == null ? (await Z(`/videos/${B.id}/drafts/${v.itemId}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(E),
            expectedRevision: v.revision,
            splitSec: N
          })
        }), Ue(E)) : M = { nativeSegmentId: (await Z(`/videos/${B.id}/segments/${v.id}/split`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            expectedUpdatedAt: v.updatedAt,
            splitSec: N,
            historyReceiptId: U
          })
        })).id };
        const Y = await m();
        if (!r) {
          const _ = [
            Je(Y == null ? void 0 : Y.segments, {
              nativeSegmentId: v.nativeSegmentId ?? v.id
            }),
            Je(
              Y == null ? void 0 : Y.segments,
              M
            )
          ].filter(Boolean);
          await re(
            "segment.split",
            "Split segment",
            J,
            wt(_, !1),
            U
          );
        }
        z(r ? `Segment split; both ranges remain ${v.reviewState}.` : "Segment split.");
      } catch (M) {
        M.status === 409 ? await u() : z(M.message || "Unable to split the draft.");
      } finally {
        pe();
      }
  }
  async function h(N = !1) {
    var M, Y;
    if ($.length !== 1 || !v || R != null || ie()) return;
    const E = N ? i : v.startSec, J = Sl(B.id, v, N, E), U = r ? null : crypto.randomUUID(), pe = t("duplicate", v.id);
    if (pe)
      try {
        const _ = ((M = b.current) == null ? void 0 : M.operationKey) === J ? b.current : null;
        let me = (_ == null ? void 0 : _.duplicateIdentity) ?? null;
        if (me == null && r && v.nativeSegmentId == null) {
          const ke = await Z(`/videos/${B.id}/drafts/${v.itemId}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(J),
              expectedRevision: v.revision,
              startSec: N ? E : null
            })
          });
          me = ea(!1, ke), b.current = { operationKey: J, duplicateIdentity: me };
        } else if (me == null) {
          const ke = await Z(`/videos/${B.id}/segments/${v.id}/duplicate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              expectedUpdatedAt: v.updatedAt,
              startSec: N ? E : null,
              historyReceiptId: U
            })
          });
          me = ea(!0, ke), b.current = { operationKey: J, duplicateIdentity: me };
        }
        const Me = await m(), Ne = Je(Me == null ? void 0 : Me.segments, me);
        if (Ne) {
          r || await re(
            "segment.duplicate",
            "Duplicated segment",
            wt([], !1),
            wt([Ne], !1),
            U
          );
          const ke = Va(
            Ne,
            Me.performerSlots || [],
            s,
            d,
            Me.segmentGroups || []
          );
          q(ke.filters), P(ke.hideDerivedSegments), ae([Ne.id]), H(Ne.id), D.current = Ne.id, W.current = [], se(Tt(
            en(Me.segments || [], Me.segmentGroups || [], Me.performerSlots || []),
            Ne.id
          )), r && v.nativeSegmentId == null && Ue(J), b.current = null, z(N ? "Duplicate created at the playhead." : "Duplicate created in place.");
        } else
          z("Duplicate created, but it could not be selected; repeat the duplicate shortcut to retry selection.");
      } catch (_) {
        ((Y = b.current) == null ? void 0 : Y.operationKey) === J ? z("Duplicate created, but the editor could not refresh it; repeat the duplicate shortcut to retry selection.") : _.status === 409 ? await u() : z(_.message || "Unable to duplicate the draft.");
      } finally {
        pe();
      }
  }
  async function x() {
    if ($.length !== 1 || !v) return;
    const N = Number(xe), E = l.trim() === "" ? null : Number(l), J = qo(N, E, g);
    if (J.error) {
      z(J.error);
      return;
    }
    if (N === v.startSec && E === v.endSec) {
      z("Timing is unchanged.");
      return;
    }
    await X(v, { startSec: N, endSec: E, tagId: v.tagId }, !0, null, !0);
  }
  async function S(N, E) {
    if ($.length !== 1 || !v) return;
    const J = qo(N, E, g);
    if (J.error) {
      z(J.error);
      return;
    }
    if (N === v.startSec && E === v.endSec) {
      z("Timing is unchanged.");
      return;
    }
    await X(v, { startSec: N, endSec: E, tagId: v.tagId }, !0, null, !0);
  }
  return { acceptHistory: ue, recordHistoryAction: re, mutateSegment: X, completeReview: be, createSegment: V, splitSegment: T, duplicateSegment: h, saveTiming: x, applyShortcutTiming: S };
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
    return Ds(window.localStorage.getItem(Fa));
  } catch {
    return { ...yt };
  }
}
function Kd() {
  try {
    return Vt(JSON.parse(window.localStorage.getItem(ja) || "[]"));
  } catch {
    return [];
  }
}
function zd(e) {
  try {
    window.localStorage.setItem(ja, JSON.stringify(Vt(e)));
  } catch {
  }
}
function Hd(e) {
  try {
    window.localStorage.setItem(Fa, JSON.stringify(e));
  } catch {
  }
}
function _d() {
  try {
    const e = JSON.parse(window.localStorage.getItem(Ga) || "null");
    return e && Number.isFinite(e.startSec) && (e.endSec == null || Number.isFinite(e.endSec)) ? e : null;
  } catch {
    return null;
  }
}
function qd(e) {
  try {
    return window.localStorage.setItem(Ga, JSON.stringify({
      startSec: e.startSec,
      endSec: e.endSec
    })), !0;
  } catch {
    return !1;
  }
}
function Wd({ status: e }) {
  const t = yi[e];
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
function Wt({ counts: e }) {
  return n("span", {
    role: "img",
    "aria-label": `${e.unreviewed} unreviewed, ${e.approved} approved, ${e.rejected} rejected`,
    className: "flex shrink-0 items-center gap-0.5 font-mono text-[10px]"
  }, pt.map((t) => n("span", {
    key: t,
    className: "rounded px-1 py-0.5",
    style: {
      ...pi(t),
      filter: e[t] > 0 ? "saturate(1)" : "saturate(0.25)"
    },
    title: `${e[t]} ${t}`
  }, `${At[t].symbol}${e[t]}`)));
}
function Vd({ videoId: e, segmentId: t, itemId: r, slots: o, revision: i, performerCandidates: a, onOptimisticSave: s = () => {
}, onSaved: l, onRollback: d = null, onConflict: c, confirmRef: g, shortcutRef: u }) {
  const f = mo(a), [m, p] = j(() => qr(o, f)), [b, y] = j(!1), [w, k] = j(""), I = fe(!1), L = o.map((D) => `${D.slotDefinitionId}:${D.performerId || ""}`).join("|"), R = f.map((D) => nt(D)).join("|"), K = si(
    o,
    f
  );
  ye(() => {
    p(qr(o, f)), k("");
  }, [t, r, L, R]);
  async function v(D = m) {
    if (!I.current) {
      I.current = !0, y(!0), k("Saving performer slots…");
      try {
        const W = qr(o.map((C) => ({
          ...C,
          performerId: D[C.slotDefinitionId] || null
        })), f), ee = o.map((C) => {
          const P = W[C.slotDefinitionId] ? Number(W[C.slotDefinitionId]) : null, G = f.find((te) => String(nt(te)) === String(P));
          return {
            ...C,
            performerId: P,
            performerName: (G == null ? void 0 : G.name) || null
          };
        });
        s(ee);
        const q = await Z(r != null ? `/videos/${e}/drafts/${r}/slots` : `/videos/${e}/segments/${t}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            revision: i,
            assignments: o.map((C) => ({ slotDefinitionId: C.slotDefinitionId, performerId: W[C.slotDefinitionId] ? Number(W[C.slotDefinitionId]) : null }))
          })
        });
        k("Performer slots saved."), await l(q, {
          beforeState: yr([{
            segmentId: t,
            itemId: r,
            revision: i,
            slots: o
          }]),
          afterState: yr([{
            segmentId: t,
            itemId: r,
            revision: q.revision,
            slots: q.slots || []
          }])
        });
      } catch (W) {
        d && await d(o, W), W.status === 409 ? (k("Slot definitions or assignments changed; current values were reloaded."), d || await c()) : k(W.message || "Unable to save performer slots.");
      } finally {
        I.current = !1, y(!1);
      }
    }
  }
  function A(D, W) {
    k(`Option ${W + 1} applied; save to confirm.`), p({ ...m, ...D.assignments });
  }
  async function $(D) {
    const W = { ...m, ...D.assignments };
    p(W), await v(W);
  }
  return ye(() => {
    if (u)
      return u.current = (D) => I.current || !K[D] ? !1 : ($(K[D]), !0), () => {
        u.current = null;
      };
  }), n("div", { className: "space-y-2" }, [
    K.length ? n("section", { key: "recommendations", className: "rounded-md bg-surface p-3", "aria-label": "Auto-assignment options" }, [
      n("h3", { key: "heading", className: "mb-2 text-sm font-semibold text-green-400" }, "Auto-assignment options"),
      n("div", { key: "options", className: "space-y-2" }, K.map((D, W) => n("button", {
        key: W,
        type: "button",
        disabled: b,
        onClick: () => A(D, W),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${W + 1}: ${D.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, W + 1),
        n("span", { key: "description" }, D.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${K.length} to apply and save`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, o.map((D) => n("label", { key: D.slotDefinitionId, className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary" }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, ft(D)),
      (D.genderHints || []).length ? n("span", { key: "hints", className: "block text-[10px]" }, `Hint: ${(D.genderHints || []).map(xr).join(" · ")}`) : null,
      n("select", { key: "select", value: m[D.slotDefinitionId] || "", disabled: b, onChange: (W) => p({ ...m, [D.slotDefinitionId]: W.target.value }), className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground" }, [
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...li(f, f, D.genderHints).map((W) => n("option", { key: nt(W), value: nt(W) }, W.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [n("button", { key: "save", ref: g, type: "button", disabled: b, onClick: () => v(), className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50" }, "Save performer slots"), n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, w)])
  ]);
}
function Jd({ videoId: e, targets: t, performerCandidates: r, onSaved: o, onConflict: i, shortcutRef: a }) {
  var K;
  const s = ((K = t[0]) == null ? void 0 : K.slots) || [], l = mo(r), d = si(
    s,
    l
  ), c = "__mixed__", g = () => Object.fromEntries(s.map((v, A) => {
    const $ = t.map((D) => {
      var W;
      return String(((W = D.slots[A]) == null ? void 0 : W.performerId) || "");
    });
    return [v.slotDefinitionId, $.every((D) => D === $[0]) ? $[0] : c];
  })), [u, f] = j(g), [m, p] = j(!1), [b, y] = j(""), w = fe(!1), k = t.map((v) => `${v.itemId ?? `native:${v.segmentId}`}:${v.revision}:${v.slots.map((A) => `${A.slotDefinitionId}:${A.performerId || ""}`).join(",")}`).join("|");
  ye(() => {
    f(g());
  }, [k]);
  async function I(v = u) {
    if (w.current) return;
    w.current = !0, p(!0), y(`Saving performer slots for ${t.length} segments…`);
    const A = [];
    try {
      for (const $ of t) {
        const D = $.slots.map((ee, q) => {
          const C = v[s[q].slotDefinitionId];
          return {
            slotDefinitionId: ee.slotDefinitionId,
            performerId: C === c ? ee.performerId || null : C ? Number(C) : null
          };
        }), W = await Z($.itemId != null ? `/videos/${e}/drafts/${$.itemId}/slots` : `/videos/${e}/segments/${$.segmentId}/slots`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ revision: $.revision, assignments: D })
        });
        A.push({
          segmentId: $.segmentId,
          itemId: $.itemId,
          revision: W.revision,
          slots: W.slots || []
        });
      }
      y("Performer slots saved."), o({
        beforeState: yr(t),
        afterState: yr(A)
      });
    } catch ($) {
      const D = await i();
      $.status === 409 ? y(D ? "Slot definitions or assignments changed; current values were reloaded." : "Slot definitions or assignments changed, but the latest values could not be reloaded.") : y($.message || (D ? "The completed assignments were reloaded after a partial save." : "Some assignments may have saved, but the latest values could not be reloaded."));
    } finally {
      w.current = !1, p(!1);
    }
  }
  function L(v, A) {
    y(`Option ${A + 1} applied; save to confirm.`), f({ ...u, ...v.assignments });
  }
  async function R(v) {
    const A = { ...u, ...v.assignments };
    f(A), await I(A);
  }
  return ye(() => {
    if (a)
      return a.current = (v) => w.current || !d[v] ? !1 : (R(d[v]), !0), () => {
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
      n("div", { key: "options", className: "space-y-2" }, d.map((v, A) => n("button", {
        key: A,
        type: "button",
        disabled: m,
        onClick: () => L(v, A),
        className: "flex w-full items-center rounded-md bg-muted/40 px-2 py-1.5 text-left text-xs text-foreground transition-colors hover:bg-muted/70 disabled:opacity-50",
        "aria-label": `Apply option ${A + 1} to all selected segments: ${v.description}`
      }, [
        n("span", { key: "number", className: "mr-2 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded bg-green-600 text-[10px] font-bold text-white" }, A + 1),
        n("span", { key: "description" }, v.description)
      ]))),
      n("p", { key: "hint", className: "mt-2 text-xs text-secondary" }, `Press number keys 1-${d.length} to apply and save across the selection`)
    ]) : null,
    n("div", { key: "slots", className: "grid gap-2" }, s.map((v) => n("label", {
      key: v.slotDefinitionId,
      className: "space-y-1 rounded-md border border-border bg-surface p-2 text-xs text-secondary"
    }, [
      n("span", { key: "label", className: "font-semibold uppercase tracking-wide" }, ft(v)),
      n("select", {
        key: "select",
        value: u[v.slotDefinitionId] || "",
        disabled: m,
        onChange: (A) => f({ ...u, [v.slotDefinitionId]: A.target.value }),
        className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm text-foreground"
      }, [
        u[v.slotDefinitionId] === c ? n("option", { key: "mixed", value: c }, "Mixed — leave unchanged") : null,
        n("option", { key: "clear", value: "" }, "No performer assigned"),
        ...li(l, l, v.genderHints).map((A) => n("option", {
          key: nt(A),
          value: nt(A)
        }, A.name))
      ])
    ]))),
    n("div", { key: "actions", className: "flex items-center gap-3" }, [
      n("button", {
        key: "save",
        type: "button",
        disabled: m,
        onClick: () => I(),
        className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
      }, "Save performer slots"),
      n("span", { key: "message", role: "status", className: "text-xs text-secondary" }, b)
    ])
  ]);
}
function Rt(e, t = null) {
  const r = String(e || "").trim().toLowerCase();
  return r === "ext:segment-studio:stash-marker-studio" || r === "stash-marker-studio" || r === "stash-marker-studio:manual" ? "Stash Marker Studio · legacy" : r === "stash-marker-studio:skier-ai" ? "Stash Marker Studio AI · legacy" : r === "segment-studio/user" || r === "user" ? "Manual" : r === "ext:ai.tagging" ? "Cove AI Tagging" : t != null && t.trim() ? t.trim() : r === "tpdb" ? "TPDB" : r ? r.split(/[:/._-]+/).filter(Boolean).slice(-2).map((o) => o.charAt(0).toUpperCase() + o.slice(1)).join(" ") : "Origin unavailable";
}
function Yd(e, t) {
  if (e != null && e.loading) return "Loading origin…";
  const r = Array.isArray(e == null ? void 0 : e.items) ? e.items : [];
  if (r.length === 0) return Rt(t);
  const o = [...new Set(r.map((i) => Rt(i.sourceKey, i.sourceDisplayName)))];
  return o.length === 1 ? o[0] : `${o[0]} +${o.length - 1}`;
}
function kr() {
  return n("span", {
    title: "Derived segment",
    "aria-label": "Derived segment",
    className: "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded text-xs font-semibold text-accent"
  }, "↳");
}
function lr({ name: e }) {
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
    n(kr, { key: "derived" })
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
            Rt(u.sourceKey, u.sourceDisplayName)
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
    f((k) => k.filter((I) => w.has(I)));
  }, [p]);
  const b = br(t), y = !!xi(
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
      a ? n(Wt, { key: "counts", counts: b }) : null
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
        const I = u.includes(k.key), L = k.markers.some(({ segment: K }) => K.id === r), R = `selected-segment-lane-${k.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
        return n("div", {
          key: k.key,
          "data-selected-segment-lane": k.key,
          className: `rounded-md border ${L ? "border-accent bg-accent/10" : "border-border bg-surface"}`
        }, [
          n("button", {
            key: "toggle",
            type: "button",
            "aria-expanded": I,
            "aria-controls": R,
            "aria-current": L ? "true" : void 0,
            onClick: () => f((K) => I ? K.filter((v) => v !== k.key) : [...K, k.key]),
            className: "flex w-full items-center gap-2 px-2 py-2 text-left"
          }, [
            n("span", { key: "indicator", "aria-hidden": "true", className: "text-xs text-secondary" }, I ? "▾" : "▸"),
            n("span", { key: "label", className: "min-w-0 flex-1 truncate text-xs font-semibold text-foreground" }, Hn(k)),
            n("span", { key: "count", className: "shrink-0 text-[10px] text-secondary" }, String(k.selectedCount)),
            a ? n(Wt, { key: "states", counts: k.counts }) : null
          ]),
          I ? n("div", {
            key: "segments",
            id: R,
            className: "space-y-1 border-t border-border p-1.5"
          }, k.markers.map(({ segment: K }) => {
            const v = K.endSec == null ? Ae(K.startSec) : `${Ae(K.startSec)} – ${Ae(K.endSec)}`;
            return n("button", {
              key: K.id,
              type: "button",
              onClick: () => i(K),
              className: `flex w-full items-center gap-1.5 rounded px-2 py-1.5 text-left hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-accent ${K.id === r ? "bg-accent/15" : ""}`,
              "aria-label": a ? `${K.tagName || "Segment"}, ${K.reviewState}, ${v}` : `${K.tagName || "Segment"}, ${v}`,
              "aria-current": K.id === r ? "true" : void 0
            }, [
              a ? n(nn, {
                key: "state",
                state: K.reviewState,
                includeLabel: !1
              }) : null,
              K.isDerived ? n(kr, { key: "derived" }) : null,
              n("span", { key: "time", className: "shrink-0 font-mono text-[10px] text-foreground" }, v),
              n(
                "span",
                { key: "source", className: "min-w-0 flex-1 truncate text-right text-[10px] text-secondary" },
                Rt(K.sourceKey)
              )
            ]);
          })) : null
        ]);
      })
    ]))
  ]);
}
const jn = {
  resetKey: "segment-studio",
  defaultFilter: { page: 1, perPage: 24, sort: "title", direction: "asc" },
  defaultObjectFilter: {},
  defaultDisplayMode: "grid",
  allowedDisplayModes: ["grid", "list"]
}, ba = [
  { value: "title", label: "Title" },
  { value: "updated_at", label: "Updated" },
  { value: "created_at", label: "Created" },
  { value: "segment_count", label: "Segment count" },
  { value: "random", label: "Random" }
], ha = [
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
function Wn(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), t(r));
}
function Ni(e, t, r) {
  e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || (e.preventDefault(), window.history.length > 1 ? window.history.back() : t(r));
}
function va(e, t = "value") {
  return Array.isArray(e == null ? void 0 : e[t]) ? [...new Set(e[t].map(Number).filter((r) => Number.isInteger(r) && r > 0))] : [];
}
function dr(e, t, r, o = null) {
  const i = va(t), a = va(t, "excludes");
  i.forEach((l) => e.append(r, String(l))), a.forEach((l) => e.append(`exclude${r[0].toUpperCase()}${r.slice(1)}`, String(l)));
  const s = { INCLUDES_ALL: "all", IS_NULL: "null", NOT_NULL: "not-null" }[t == null ? void 0 : t.modifier];
  s && e.set(`${r}Mode`, s), o && (t == null ? void 0 : t.depth) === -1 && (i.length > 0 || a.length > 0) && e.set(o, "true");
}
function ec(e, t, r = null) {
  var u, f, m;
  const o = new URLSearchParams();
  e.q && o.set("q", e.q), e.page && o.set("page", String(e.page)), e.perPage && o.set("perPage", String(e.perPage)), e.sort && o.set("sort", e.sort), e.direction && o.set("direction", e.direction), e.sort === "random" && Number.isInteger(e.seed) && e.seed > 0 && o.set("seed", String(e.seed));
  const i = (u = t.hasSegmentsCriterion) == null ? void 0 : u.value;
  typeof i == "boolean" ? o.set("hasSegments", String(i)) : t.segments === "has" ? o.set("hasSegments", "true") : t.segments === "none" && o.set("hasSegments", "false"), dr(o, t.segmentTagsCriterion, "segmentTag", "includeSegmentSubtags"), dr(o, t.tagsCriterion, "videoTag", "includeVideoSubtags"), dr(o, t.performersCriterion, "performer"), dr(o, t.studiosCriterion, "studio", "includeSubstudios");
  const a = Number(t.segmentTagId ?? t.tagId) || null;
  a && !o.has("segmentTag") && o.set("segmentTagId", String(a));
  const s = xa(t.videoTagIds);
  s.length > 0 && !o.has("videoTag") && o.set("videoTagIds", s.join(","));
  const l = xa(t.performerIds);
  l.length > 0 && !o.has("performer") && o.set("performerIds", l.join(","));
  const d = Number(t.studioId) || null;
  d && !o.has("studio") && o.set("studioId", String(d));
  const c = ((f = t.reviewStateCriterion) == null ? void 0 : f.value) ?? t.reviewState;
  r && ["unreviewed", "approved", "rejected"].includes(c) && o.set("reviewState", c), r && o.set("workflow", r);
  const g = (m = t.shotBoundariesCriterion) == null ? void 0 : m.value;
  return r && typeof g == "boolean" ? o.set("hasShotBoundaries", String(g)) : r && t.shotBoundaries === "has" ? o.set("hasShotBoundaries", "true") : r && t.shotBoundaries === "none" && o.set("hasShotBoundaries", "false"), o;
}
function xa(e) {
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
function Ii({ item: e, showReviewStates: t = !1 }) {
  return e.segmentCount === 0 ? n("div", { className: "text-[11px]" }, n(da, null, "No tag segments")) : t ? n("div", { className: "flex flex-wrap items-center gap-1 text-[11px]" }, pt.flatMap((r) => {
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
    n(da, null, `${e.segmentCount} tag segment${e.segmentCount === 1 ? "" : "s"}`)
  );
}
function Ci({ item: e, selected: t, selectionActive: r, onSelect: o }) {
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
      onClick: (l) => Wn(l, t, s),
      className: "absolute inset-0 z-[1] rounded-md focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }),
    n("div", { key: "media", className: "relative aspect-video bg-black" }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=640&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "h-full w-full object-cover" }),
      n(Ci, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
      e.duration > 0 ? n("span", { key: "duration", className: "absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-medium text-white" }, ys(e.duration)) : null
    ]),
    n("div", { key: "body", className: "flex flex-1 flex-col gap-1.5 p-2.5" }, [
      n("div", { key: "title", className: "line-clamp-2 text-sm font-semibold leading-snug text-foreground" }, e.title),
      n("div", { key: "meta", className: "flex min-h-4 flex-wrap gap-2 text-[11px] text-secondary" }, [
        e.date ? n("span", { key: "date" }, e.date) : null,
        e.organized ? n("span", { key: "organized" }, "Organized") : null,
        e.isVr ? n("span", { key: "vr" }, "VR") : null
      ]),
      n("div", { key: "segments", className: "mt-auto border-t border-border/50 pt-1.5" }, n(Ii, { item: e, showReviewStates: r }))
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
    n(Ci, { key: "selection", item: e, selected: o, selectionActive: i, onSelect: a }),
    n(i ? "div" : "a", {
      key: "link",
      href: i ? void 0 : `/segment-studio/${e.videoId}`,
      onClick: i ? void 0 : (l) => Wn(l, t, s),
      className: "flex items-center gap-3 text-left hover:bg-muted/20 focus:outline-none focus:ring-2 focus:ring-accent",
      "aria-label": `Open segment editor for ${e.title}`
    }, [
      n("img", { key: "image", src: `/api/videos/${e.videoId}/image?maxDimension=320&v=${encodeURIComponent(e.updatedAt)}`, alt: "", loading: "lazy", className: "aspect-video h-20 shrink-0 bg-black object-cover" }),
      n("div", { key: "copy", className: "min-w-0 flex-1 py-2" }, [
        n("div", { key: "title", className: "truncate text-sm font-semibold text-foreground" }, e.title),
        n(Ii, { key: "segments", item: e, showReviewStates: r })
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
      onClick: (s) => Wn(s, t, a.route),
      "aria-current": e === a.key ? "page" : void 0,
      className: `border-b-2 px-4 py-2 text-sm font-semibold ${e === a.key ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
    }, a.label))),
    n("div", { key: "actions", className: "mb-1 flex items-center gap-2" }, [
      r && xn(
        o,
        Kt.recyclingBinView
      ) ? n($i, { key: "bin", onNavigate: t }) : null,
      n(Ti, { key: "settings", onNavigate: t })
    ])
  ]);
}
const ao = "segment-studio:recycling-bin-changed";
function oc(e) {
  if (e == null) return "Recycling bin";
  const t = Number(e);
  return !Number.isFinite(t) || t < 0 ? "Recycling bin" : `Recycling bin (${Math.trunc(t)})`;
}
function Un() {
  window.dispatchEvent(new CustomEvent(ao));
}
function $i({ onNavigate: e, compact: t = !1 }) {
  const [r, o] = j(null);
  ye(() => {
    let a = !1, s = 0;
    const l = async () => {
      const c = ++s;
      try {
        const g = await Z("/bin"), u = Number(g == null ? void 0 : g.totalCount);
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
  const i = oc(r);
  return n("a", {
    href: "/segment-studio/bin",
    onClick: (a) => Wn(a, e, { page: "segment-studio", slug: "bin" }),
    "aria-label": r == null ? "Open recycling bin" : `Open recycling bin, ${r} item${r === 1 ? "" : "s"}`,
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "♲"), n("span", { key: "label" }, i)]);
}
function Ti({ onNavigate: e, compact: t = !1 }) {
  return n("a", {
    href: "/segment-studio/settings",
    onClick: (r) => Wn(r, e, { page: "segment-studio", slug: "settings" }),
    "aria-label": "Segment Studio settings",
    className: `inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 ${t ? "text-xs" : "text-sm"} font-medium text-foreground hover:border-accent/60 hover:bg-muted/40`
  }, [n("span", { key: "icon", "aria-hidden": "true" }, "⚙"), n("span", { key: "label" }, "Settings")]);
}
function ac({ mode: e, onModeChange: t, disabled: r = !1 }) {
  function o(i) {
    const a = eo(i.target.value);
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
  const o = fe(null), [i, a] = j("maximum"), s = (f, m) => {
    const p = Us(e, t, f, m);
    a(p.coincidentTop), r({ minimum: p.minimum, maximum: p.maximum });
  }, l = (f, m) => {
    var b;
    const p = (b = o.current) == null ? void 0 : b.getBoundingClientRect();
    p && s(f, Gs(m.clientX, p.left, p.width));
  }, d = (f, m) => {
    var p, b;
    m.preventDefault(), (b = (p = m.currentTarget).setPointerCapture) == null || b.call(p, m.pointerId), l(f, m);
  }, c = (f, m) => {
    var p, b;
    (b = (p = m.currentTarget).hasPointerCapture) != null && b.call(p, m.pointerId) && l(f, m);
  }, g = (f, m) => {
    const p = f === "minimum" ? e : t, b = f === "minimum" ? 0 : e, y = f === "minimum" ? t : 1, w = m.shiftKey ? 0.1 : 0.01;
    let k = null;
    ["ArrowLeft", "ArrowDown"].includes(m.key) && (k = p - w), ["ArrowRight", "ArrowUp"].includes(m.key) && (k = p + w), m.key === "PageDown" && (k = p - 0.1), m.key === "PageUp" && (k = p + 0.1), m.key === "Home" && (k = b), m.key === "End" && (k = y), k != null && (m.preventDefault(), s(f, Math.min(y, Math.max(b, k))));
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
    onKeyDownCapture: (s) => bt(s, { onCancel: a })
  }, n("section", {
    ref: i,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-first-segment-tag-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
    n(Kn, {
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
  const u = Nt(e), f = [...new Map((a || []).map((y) => [
    Number(y.tagId),
    y.tagName || `Tag ${y.tagId}`
  ])).entries()].sort((y, w) => y[1].localeCompare(w[1]) || y[0] - w[0]), m = (y) => d(Nt({ ...u, ...y })), p = (y) => m({
    reviewStates: u.reviewStates.includes(y) ? u.reviewStates.filter((w) => w !== y) : [...u.reviewStates, y]
  }), b = (y) => `rounded-md border px-2.5 py-1.5 text-xs font-medium ${y ? "border-accent bg-accent/20 text-foreground" : "border-border bg-card text-secondary hover:bg-muted/40"}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (y) => {
      y.target === y.currentTarget && g();
    },
    onKeyDownCapture: (y) => bt(y, { onCancel: g })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-editor-filters-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
        n("div", { className: "flex flex-wrap gap-2" }, pt.map((y) => {
          const w = u.reviewStates.includes(y), k = At[y];
          return n("button", {
            key: y,
            type: "button",
            onClick: () => p(y),
            "aria-pressed": w,
            className: b(w)
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
            className: b(u.performerId == null)
          }, "All performers"),
          ...r.map((y) => {
            const w = Number(nt(y));
            return n("button", {
              key: w,
              type: "button",
              onClick: () => m({ performerId: w }),
              "aria-pressed": u.performerId === w,
              className: b(u.performerId === w)
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
            className: b(u.sourceKey == null)
          }, "All provenance"),
          ...o.map((y) => n("button", {
            key: y,
            type: "button",
            onClick: () => m({ sourceKey: y }),
            "aria-pressed": u.sourceKey === y,
            title: y,
            className: b(u.sourceKey === y)
          }, Rt(y)))
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
          d(Nt({})), l && c(!1);
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
  const o = qn.filter((l) => vn(l, e)), i = Zo(o, 1)[0], a = Zo(o), s = ({ category: l, shortcuts: d }) => {
    const c = d.map((g) => n("div", { key: g.id, className: "flex items-center justify-between text-sm" }, [
      n("span", { key: "description", className: "min-w-0 flex-1 text-foreground" }, g.description),
      n(
        "span",
        { key: "bindings", className: "ml-4 flex shrink-0 flex-wrap justify-end gap-2" },
        (t[g.id] ? t[g.id].length > 0 ? t[g.id] : ["Unassigned"] : g.bindings.map(ti)).map((u, f) => n("kbd", { key: `${g.id}:${f}`, className: "rounded bg-surface px-2 py-0.5 font-mono text-xs text-foreground" }, u))
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
    onKeyDownCapture: (l) => bt(l, { onCancel: r })
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
    onKeyDownCapture: (g) => bt(g, {
      onCancel: t || r != null ? void 0 : a
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-examples-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
            onClick: () => d((p) => f ? p.filter((b) => b !== g.tagName) : [...p, g.tagName]),
            className: "flex w-full items-center gap-2 px-3 py-2 text-left",
            style: { background: vr(!1) }
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
            const b = `${Ae(p.startSec)}${p.endSec == null ? "" : ` – ${Ae(p.endSec)}`}`, y = r === p.id;
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
function uc({ segments: e, onSelect: t, onClose: r }) {
  const [o, i] = j(""), [a, s] = j(0), l = fe(null), d = qe(() => zl(e, o), [e, o]), c = Math.min(a, Math.max(0, d.length - 1)), g = _l(d);
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
        Lt(f);
      else if (f.key === "Escape")
        f.preventDefault(), f.stopPropagation(), r();
      else if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault(), f.stopPropagation();
        const p = f.key === "ArrowDown" ? 1 : -1;
        s((b) => d.length ? (b + p + d.length) % d.length : 0);
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
      var R;
      const p = f.segment || f, b = p.endSec == null ? Ae(p.startSec) : `${Ae(p.startSec)} – ${Ae(p.endSec)}`, y = `${Rt(p.sourceKey)}${p.confidence == null ? "" : ` · ${Math.round(p.confidence * 100)}%`}`, w = m === c, k = m > 0 ? d[m - 1].groupKey : null, I = g && f.groupKey !== k ? n("div", {
        key: `group:${f.groupKey}`,
        role: "presentation",
        className: "mb-1 mt-2 rounded-md border border-border bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-secondary first:mt-0"
      }, f.groupName) : null, L = n("button", {
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
        n(nn, { key: "review", state: p.reviewState, includeLabel: !1 }),
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          p.tagName || "Tag segment"
        ),
        (R = f.performers) != null && R.length ? n(Sr, {
          key: "performers",
          performers: f.performers,
          performerAssignments: f.performerAssignments
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
      return I ? [I, L] : [L];
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
  const s = qe(() => mc(e), [e]), [l, d] = j([]), c = s.reduce((m, p) => m + p.drafts.length, 0), g = fe(null);
  fo({ confirmRef: g, cancelRef: o, confirmReady: !t && c > 0 });
  const u = (m) => d((p) => p.includes(m) ? p.filter((b) => b !== m) : [...p, m]), f = (m) => `segment-studio-publish-approved-${m.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !t && a();
    },
    onKeyDownCapture: (m) => bt(m, {
      onCancel: t ? void 0 : a,
      onConfirm: c > 0 && !t ? i : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-publish-approved-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
            style: { background: vr(!1) }
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
          }, m.drafts.map((b) => {
            const y = b.endSec == null ? Ae(b.startSec) : `${Ae(b.startSec)} – ${Ae(b.endSec)}`, w = `${Rt(b.sourceKey)}${b.confidence == null ? "" : ` · ${Math.round(b.confidence * 100)}%`}`;
            return n("div", { key: b.id, className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5" }, [
              n(nn, { key: "review", state: b.reviewState, includeLabel: !1 }),
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
  const a = Kl(e), [s, l] = j(() => /* @__PURE__ */ new Set()), [d, c] = j(() => new Set(a.map((b) => b.key))), g = a.flatMap((b) => d.has(b.key) ? b.candidates : []), u = (b) => l((y) => {
    const w = new Set(y);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), f = (b) => c((y) => {
    const w = new Set(y);
    return w.has(b) ? w.delete(b) : w.add(b), w;
  }), m = (b) => b.assignment.map(({ slot: y, performer: w }) => `${y.label || `Slot ${y.sortOrder + 1}`}: ${w.name}`).join(", "), p = (b) => `segment-studio-auto-assign-${b.key.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (b) => {
      b.target === b.currentTarget && !t && i();
    },
    onKeyDownCapture: (b) => {
      b.key === "Enter" && b.target instanceof HTMLInputElement || bt(b, {
        onCancel: t ? void 0 : i,
        onConfirm: g.length && !t ? () => o(g) : void 0
      });
    }
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-auto-assign-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
          style: { background: vr(!1) }
        }, [
          n("input", {
            key: "selected",
            type: "checkbox",
            checked: d.has(b.key),
            disabled: t,
            onChange: () => f(b.key),
            "aria-label": `Include ${b.tagName} assignment: ${m(b)}`,
            className: "h-4 w-4 shrink-0 accent-violet-500"
          }),
          n("button", {
            key: "toggle",
            type: "button",
            disabled: t,
            "aria-expanded": s.has(b.key),
            "aria-controls": p(b),
            "aria-label": `${s.has(b.key) ? "Collapse" : "Expand"} ${b.tagName} assignment: ${m(b)}`,
            onClick: () => u(b.key),
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
            b.assignment.map(({ slot: y, performer: w }) => {
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
                n(_n, {
                  key: "avatar",
                  performer: { id: w.performerId, name: w.name },
                  compact: !0
                })
              ]);
            })
          ),
          n(Wt, { key: "states", counts: b.counts }),
          n("button", {
            key: "assign-group",
            type: "button",
            disabled: t,
            onClick: () => o(b.candidates),
            "aria-label": `Auto-Assign ${b.tagName}: ${m(b)}`,
            className: "shrink-0 rounded-md border border-violet-400/60 bg-violet-500/15 px-2 py-1 text-[10px] font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign (${b.candidates.length})`)
        ]),
        s.has(b.key) ? n(
          "div",
          { key: "segments", id: p(b), className: "divide-y divide-border/70" },
          b.candidates.map((y) => {
            const w = y.endSec == null ? Ae(y.startSec) : `${Ae(y.startSec)} – ${Ae(y.endSec)}`, k = `${Rt(y.sourceKey)}${y.confidence == null ? "" : ` · ${Math.round(y.confidence * 100)}%`}`;
            return n("div", {
              key: y.id,
              className: "flex min-w-0 items-center gap-1.5 bg-card px-2 py-1.5"
            }, [
              n(nn, { key: "review", state: y.reviewState, includeLabel: !1 }),
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
    onKeyDownCapture: (d) => bt(d, { onCancel: r, onConfirm: t })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-delete-rejected-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
  const [s, l] = j(!1), d = fe(null);
  if (fo({ confirmRef: d, cancelRef: o, confirmReady: !t }), !e) return null;
  const c = e.endSec == null ? "open end" : Ae(e.endSec);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (g) => {
      g.target === g.currentTarget && !t && a();
    },
    onKeyDownCapture: (g) => bt(g, {
      onCancel: t ? void 0 : a,
      onConfirm: t ? void 0 : () => i(s)
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-merge-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
  const l = e ? e.createCount + e.linkCount : 0, d = fe(null);
  fo({ confirmRef: d, cancelRef: i, confirmReady: !t && !r && l > 0 && !o });
  const c = ((u = e == null ? void 0 : e.outputs) == null ? void 0 : u.slice(0, 200)) || [], g = bc(c);
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (m) => {
      m.target === m.currentTarget && !r && s();
    },
    onKeyDownCapture: (m) => bt(m, {
      onCancel: r ? void 0 : s,
      onConfirm: e && l > 0 && !r ? a : void 0
    })
  }, n("section", {
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-materialize-derived-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
                `${m.rootTagName} @ ${Ae(m.rootStartSec)}`
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
              m.outputs.map((p, b) => n("div", {
                key: `${p.ruleId}:${p.depth}:${b}`,
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
  slotButtonRef: b,
  tagSearchRef: y,
  onDetailChange: w,
  setSaveMessage: k,
  acquireSaveLock: I,
  onSlotsChanged: L,
  onRecordHistory: R,
  onCancelQueuedReview: K,
  splitSegment: v,
  duplicateSegment: A,
  provenance: $,
  lineage: D,
  onNavigateLineageItem: W,
  tagEditing: ee,
  onCancelTagEditing: q,
  detailPanelRef: C,
  onReduceSelection: P
}) {
  var he, B, ue, re;
  const G = fe(null), te = fe(null), ce = () => {
    var X;
    (X = te.current) == null || X.call(te), te.current = null;
  }, z = fe(null), se = fe(null), H = fe(null), ae = fe(null), [ge, xe] = j(!1);
  ye(() => {
    G.current && (G.current.scrollTop = 0), xe(!1);
  }, [t == null ? void 0 : t.id]), ye(() => {
    var X, be;
    ge && ((be = (X = z.current) == null ? void 0 : X.querySelector("input, select, button")) == null || be.focus({ preventScroll: !0 }));
  }, [ge]);
  function oe() {
    xe(!1), requestAnimationFrame(() => {
      var X;
      return (X = b.current) == null ? void 0 : X.focus({ preventScroll: !0 });
    });
  }
  if (r.length > 1) {
    const X = !r.some((ie) => ie.isDerived), be = e && g ? gd(f, r) : null, V = (be == null ? void 0 : be.map((ie, T) => {
      var x;
      const h = r[T];
      return {
        segmentId: h.nativeSegmentId,
        itemId: h.published ? null : h.itemId,
        revision: (x = m.performerSlotRevisions) == null ? void 0 : x[h.id],
        slots: ie
      };
    })) || [];
    return n(io.Fragment, null, [
      n(Xd, {
        key: "details",
        selectedGroups: o,
        selectedSegments: r,
        activeSegmentId: t == null ? void 0 : t.id,
        detailPanelRef: C,
        onReduceSelection: P,
        reviewable: e,
        tagEditable: X,
        slotsEditable: V.length > 0 && a == null,
        onEditSlots: () => xe(!0),
        slotButtonRef: b,
        saveMessage: i
      }),
      ee && X ? n("div", {
        key: "multi-tag-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ie) => {
          ie.target === ie.currentTarget && q();
        },
        onKeyDownCapture: (ie) => bt(ie, { onCancel: q })
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
        n(Kn, {
          key: "tag",
          entityType: "tag",
          value: null,
          selectedDisplay: "input",
          selectedLabel: "",
          onChange: (ie, T) => ie == null ? q() : l(ie, T == null ? void 0 : T.label),
          disabled: a != null,
          placeholder: "Find a tag…",
          inputClassName: "w-full rounded-md border border-border bg-surface px-2 py-1.5 text-sm text-foreground",
          creatable: !1,
          allowCreate: !1
        }),
        n("button", {
          key: "cancel",
          type: "button",
          onClick: q,
          className: "rounded-md border border-border px-3 py-1.5 text-sm text-secondary hover:bg-muted/40"
        }, "Cancel")
      ])) : null,
      ge && V.length > 0 ? n("div", {
        key: "performer-slot-dialog-overlay",
        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
        onMouseDown: (ie) => {
          ie.target === ie.currentTarget && oe();
        },
        onKeyDownCapture: (ie) => {
          var h, x;
          if (!(typeof ((h = ie.target) == null ? void 0 : h.closest) == "function" ? ie.target.closest("input, textarea, select, [contenteditable='true']") : null) && !ie.repeat && !ie.ctrlKey && !ie.altKey && !ie.metaKey && !ie.shiftKey && /^[1-9]$/.test(ie.key) && ((x = ae.current) != null && x.call(ae, Number(ie.key) - 1))) {
            ie.preventDefault(), ie.stopPropagation();
            return;
          }
          bt(ie, { onCancel: oe });
        }
      }, n("section", {
        ref: z,
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
          n("button", { key: "close", type: "button", onClick: oe, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
        ]),
        n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Jd, {
          videoId: p.id,
          targets: V,
          performerCandidates: m.performerCandidates || [],
          shortcutRef: ae,
          onSaved: async ({ beforeState: ie, afterState: T }) => {
            await R(
              "performer-slots.assign",
              `Assigned performers to ${V.length} segments`,
              ie,
              T
            ), oe(), L();
          },
          onConflict: L
        }))
      ])) : null
    ]);
  }
  return n("div", {
    ref: (X) => {
      G.current = X, C && (C.current = X);
    },
    tabIndex: -1,
    role: "region",
    "aria-label": "Selected segment editor",
    "data-active-segment-scroll": "true",
    className: "min-h-0 space-y-2 overflow-y-auto rounded-md border border-border bg-card p-3 focus:outline-none focus:ring-2 focus:ring-accent"
  }, [
    n("div", { key: "selected-header", className: "min-w-0 space-y-1.5" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-1.5" }, [
        e && t ? n(nn, { key: "state", state: t.reviewState, includeLabel: !1 }) : null,
        t != null && t.isDerived ? n(kr, { key: "derived" }) : null,
        t && ee ? n("div", {
          key: "tag-editor",
          ref: y,
          className: "min-w-0 flex-1",
          onKeyDownCapture: (X) => {
            X.key === "Escape" && (X.preventDefault(), X.stopPropagation(), q());
          },
          onKeyDown: (X) => {
            dd(X, t.tagName) && (X.preventDefault(), X.stopPropagation(), l(t.tagId));
          }
        }, n(Kn, {
          entityType: "tag",
          value: t.tagId,
          selectedDisplay: "input",
          selectedLabel: t.tagName,
          onChange: (X, be) => X == null ? q() : l(X, be == null ? void 0 : be.label),
          disabled: wl(a, t.id, s) || ((he = D.data) == null ? void 0 : he.tagReadOnly) === !0,
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
      e && t && (c === "empty" || c === "partial") ? n("div", { key: "slots-row" }, n(Wd, { status: c })) : null,
      t && g && u.length > 0 ? n("div", {
        key: "slot-assignments",
        role: "group",
        "aria-label": "Performer slots",
        className: "rounded-md border border-border bg-surface p-2"
      }, n(Si, {
        assignments: u.map((X) => {
          const be = bd(X);
          return {
            key: String(X.slotDefinitionId),
            label: be.label,
            performer: be.filled ? { id: Number(X.performerId), name: be.performer } : null,
            title: be.title
          };
        })
      })) : null,
      i ? n("span", { key: "save", role: "status", "aria-live": "polite", className: "block text-xs text-secondary" }, i) : null
    ]),
    t ? n(Zd, {
      key: `provenance:${t.id}`,
      segment: t,
      provenance: $
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
          (B = D.data.parents) != null && B.length ? n("div", { key: "parents" }, [
            n("span", { key: "label" }, "Parents: "),
            ...D.data.parents.map((X) => n("button", {
              key: X.nodeId,
              type: "button",
              onClick: () => W(X.itemId),
              className: "mr-1 underline decoration-dotted hover:text-foreground"
            }, `${X.ruleKey} ${X.ruleVersion}`))
          ]) : null,
          (ue = D.data.children) != null && ue.length ? n("p", { key: "children" }, `Children: ${D.data.children.length}`) : null
        ]) : n("p", { key: "empty", className: "mt-1 text-xs text-secondary" }, "No lineage recorded.")
      ]),
      n("div", { key: "actions", className: "flex flex-wrap items-center gap-2" }, [
        n("button", { key: "apply", type: "button", disabled: a != null, onClick: d, className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-accent/25 disabled:opacity-50" }, "Save timing"),
        e ? n("button", {
          key: "slots",
          ref: b,
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
          onClick: v,
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
    ge && e && t && g && u.length > 0 ? n("div", {
      key: "performer-slot-dialog-overlay",
      className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
      onMouseDown: (X) => {
        X.target === X.currentTarget && oe();
      },
      onKeyDownCapture: (X) => {
        var V, ie;
        if (!(typeof ((V = X.target) == null ? void 0 : V.closest) == "function" ? X.target.closest("input, textarea, select, [contenteditable='true']") : null) && !X.repeat && !X.ctrlKey && !X.altKey && !X.metaKey && !X.shiftKey && /^[1-9]$/.test(X.key) && ((ie = H.current) != null && ie.call(H, Number(X.key) - 1))) {
          X.preventDefault(), X.stopPropagation();
          return;
        }
        bt(X, {
          onCancel: oe,
          onConfirm: () => {
            var T;
            return (T = se.current) == null ? void 0 : T.click();
          }
        });
      }
    }, n("section", {
      ref: z,
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
        n("button", { key: "close", type: "button", onClick: oe, className: "rounded-md border border-border px-2 py-1 text-sm text-secondary hover:bg-muted/40", "aria-label": "Close performer slots" }, "×")
      ]),
      n("div", { key: "body", className: "min-h-0 overflow-y-auto p-4" }, n(Vd, {
        key: `${t.id}:${m.performerSlotsRevision || m.slotRevision || ""}`,
        videoId: p.id,
        segmentId: t.nativeSegmentId,
        itemId: t.published ? null : t.itemId,
        slots: u,
        revision: (re = m.performerSlotRevisions) == null ? void 0 : re[t.id],
        performerCandidates: m.performerCandidates || [],
        confirmRef: se,
        shortcutRef: H,
        onOptimisticSave: (X) => {
          w((be) => Wr(
            be,
            t.id,
            X
          ), p.id), ce(), te.current = I("slots", t.id), k("Saving performer slots…"), oe();
        },
        onSaved: async (X, { beforeState: be, afterState: V }) => {
          w((ie) => Wr(
            ie,
            t.id,
            X.slots || [],
            X.revision
          ), p.id), k("Performer slots saved.");
          try {
            await R(
              "performer-slots.assign",
              "Assigned performers",
              be,
              V
            ), await L(X) || K([t]);
          } finally {
            ce();
          }
        },
        onRollback: async (X, be) => {
          K([t]), w((V) => {
            var ie;
            return Wr(
              V,
              t.id,
              X,
              (ie = m.performerSlotRevisions) == null ? void 0 : ie[t.id]
            );
          }, p.id), k(be.message || "Unable to save performer slots.");
          try {
            be.status === 409 && await L();
          } finally {
            ce();
          }
        },
        onConflict: L
      }))
    ])) : null
  ]);
}
function xc({ segments: e, shotBoundaries: t = [], segmentGroups: r, performerSlots: o = [], collapsedGroupKeys: i = [], selectedGroupKey: a, selectedSegmentId: s, selectedSegmentIds: l = [], duration: d, currentTime: c, zoom: g, onZoomChange: u, onSelectGroup: f, onToggleGroup: m, onSelect: p, onSelectSegments: b, onSelectAll: y, onConfigureTag: w, onSeekTime: k, centerRef: I, showReviewState: L = !0, swimlaneTitleWidth: R, onSwimlaneTitleWidthChange: K }) {
  const v = fe(null), A = fe(null), [$, D] = j(0), [W, ee] = j({ scrollTop: 0, height: 320 }), [q, C] = j(null), P = qe(
    () => en(e, r, o),
    [e, r, o]
  ), G = qe(
    () => hi(o),
    [o]
  ), te = qe(() => ho(P), [P]), ce = qe(
    () => kd(te, i, r.length > 0),
    [te, i, r.length]
  ), z = qe(
    () => vi(ce.rows, Math.max(0, W.scrollTop - 24), W.height),
    [ce, W]
  ), se = Math.max(0, Number(d) || 0), H = Es($), ae = cr(R, H), ge = ae / 16, xe = Rs(c, se, ge), oe = Is(se), he = Cs(se, Math.max(1, $ - ge * 16), g), B = oe.filter((x, S) => S === 0 || S % he === 0), ue = qe(() => P.map((x) => `${x.key}:${x.trackCount}:${x.markers.map(({ segment: S, track: N }) => `${S.id}:${S.startSec}:${S.endSec ?? ""}:${N}`).join(",")}`).join("|"), [P]);
  function re() {
    const x = A.current;
    if (!x) return;
    const S = x.querySelector("[data-timeline-track]"), N = x.firstElementChild, E = S == null ? void 0 : S.getBoundingClientRect(), J = N == null ? void 0 : N.getBoundingClientRect(), U = E && J ? Math.max(0, E.left - J.left) : ge * 16, pe = (J == null ? void 0 : J.width) ?? x.scrollWidth;
    x.scrollTo({
      left: As(c, se, pe, x.clientWidth, U, za),
      behavior: "smooth"
    });
  }
  ye(() => (I.current = re, () => {
    I.current === re && (I.current = null);
  })), ye(() => {
    re();
  }, [g]);
  function X() {
    const x = A.current, S = ce.rows.find((pe) => pe.kind === "lane" && pe.lane.markers.some(({ segment: M }) => M.id === s));
    if (!x || !S) return;
    const N = 24, E = S.top + N, J = E + S.height;
    let U = x.scrollTop;
    E < x.scrollTop + N ? U = Math.max(0, E - N) : J > x.scrollTop + x.clientHeight && (U = Math.max(0, J - x.clientHeight)), U !== x.scrollTop && (x.scrollTop = U), ee({ scrollTop: U, height: x.clientHeight });
  }
  ye(() => {
    X();
  }, [s, ue, ce]), ye(() => {
    const x = A.current, S = ce.rows.find((pe) => pe.kind === "group" && pe.group.key === a);
    if (!x || !S) return;
    const N = 24, E = S.top + N, J = E + S.height;
    let U = x.scrollTop;
    E < x.scrollTop + N ? U = Math.max(0, E - N) : J > x.scrollTop + x.clientHeight && (U = Math.max(0, J - x.clientHeight)), U !== x.scrollTop && (x.scrollTop = U), ee({ scrollTop: U, height: x.clientHeight });
  }, [a, ce]), ye(() => {
    const x = A.current;
    if (!x || typeof ResizeObserver > "u") return;
    const S = () => {
      D(x.clientWidth), ee({ scrollTop: x.scrollTop, height: x.clientHeight }), X();
    }, N = new ResizeObserver(S);
    return N.observe(x), S(), () => N.disconnect();
  }, [s, ue, ce]);
  function be(x) {
    if (!(se > 0)) return;
    const S = x.currentTarget.getBoundingClientRect(), N = Math.min(1, Math.max(0, (x.clientX - S.left) / S.width));
    k(N * se);
  }
  function V(x) {
    const S = {
      ArrowLeft: -1,
      ArrowDown: -1,
      ArrowRight: 1,
      ArrowUp: 1,
      PageDown: -10,
      PageUp: 10
    };
    let N = null;
    Object.hasOwn(S, x.key) && (N = c + S[x.key]), x.key === "Home" && (N = 0), x.key === "End" && (N = se), N != null && (x.preventDefault(), x.stopPropagation(), k(Math.min(se, Math.max(0, N))));
  }
  function ie(x) {
    var N;
    const S = (N = v.current) == null ? void 0 : N.getBoundingClientRect();
    S && K(cr(x.clientX - S.left, H));
  }
  function T(x) {
    const S = x.shiftKey ? 40 : 16;
    let N = null;
    x.key === "ArrowLeft" && (N = ae - S), x.key === "ArrowRight" && (N = ae + S), x.key === "Home" && (N = 160), x.key === "End" && (N = H), N != null && (x.preventDefault(), x.stopPropagation(), K(cr(N, H)));
  }
  const h = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("section", {
    ref: v,
    "aria-label": "Segment swimlane timeline",
    className: "relative flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-border bg-surface"
  }, [
    n("header", { key: "header", className: "flex h-9 items-center gap-2 border-b border-border px-2" }, [
      n("button", {
        key: "title",
        type: "button",
        onClick: (x) => {
          (x.metaKey || x.ctrlKey) && (x.preventDefault(), y == null || y());
        },
        onKeyDown: (x) => {
          x.key !== "Enter" && x.key !== " " || (x.preventDefault(), y == null || y());
        },
        title: "Cmd/Ctrl+click or press Enter to select every segment in this video",
        "aria-label": "Swimlanes; Command or Control click, Enter, or Space selects every segment",
        className: "mr-auto text-xs font-semibold text-foreground hover:underline focus:outline-none focus:underline"
      }, "Swimlanes"),
      n("button", { key: "out", type: "button", className: h, disabled: g <= 1, onClick: () => u(pr(g - 0.5)), "aria-label": "Zoom out", title: "Zoom out (-)" }, "−"),
      n("button", { key: "fit", type: "button", className: h, disabled: g === 1, onClick: () => u(1), "aria-label": "Fit timeline", title: "Fit timeline (0)" }, `${Math.round(g * 100)}%`),
      n("button", { key: "in", type: "button", className: h, disabled: g >= 8, onClick: () => u(pr(g + 0.5)), "aria-label": "Zoom in", title: "Zoom in (+)" }, "+"),
      n("button", { key: "center", type: "button", className: h, onClick: re, "aria-label": "Center playhead", title: "Center playhead (H)" }, "◎")
    ]),
    n("div", {
      key: "title-separator",
      role: "separator",
      tabIndex: 0,
      "aria-label": "Resize swimlane titles",
      "aria-orientation": "vertical",
      "aria-valuemin": 160,
      "aria-valuemax": Math.round(H),
      "aria-valuenow": Math.round(ae),
      "aria-valuetext": `${Math.round(ae)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (x) => {
        x.currentTarget.setPointerCapture(x.pointerId), ie(x);
      },
      onPointerMove: (x) => {
        x.currentTarget.hasPointerCapture(x.pointerId) && ie(x);
      },
      onKeyDown: T,
      onDoubleClick: () => K(yt.swimlaneTitleWidth),
      className: "absolute bottom-0 z-50 flex w-2 items-center justify-center hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
      style: { top: "2.25rem", left: `${ae - 4}px`, touchAction: "none", cursor: "col-resize" }
    }, n("span", { className: "h-16 w-1 rounded-full bg-border" })),
    n("div", {
      key: "scroll",
      ref: A,
      onScroll: (x) => ee({
        scrollTop: x.currentTarget.scrollTop,
        height: x.currentTarget.clientHeight
      }),
      className: "min-h-0 flex-1 overflow-x-auto overflow-y-auto"
    }, n("div", { style: Ms(g) }, [
      n("div", { key: "axis", "data-timeline-axis": "true", className: "sticky top-0 z-30 grid border-b border-border bg-surface", style: { gridTemplateColumns: `${ge}rem minmax(0,1fr)`, height: "1.5rem" } }, [
        n("div", { key: "axis-label", "data-timeline-label-gutter": "true", "aria-hidden": "true", className: "sticky left-0 z-40 border-r border-border", style: { backgroundColor: "var(--color-surface)" } }),
        n("div", {
          key: "ticks",
          role: "slider",
          tabIndex: 0,
          "data-timeline-seeker": "true",
          "data-timeline-track": "true",
          "aria-label": "Timeline seek",
          "aria-valuemin": 0,
          "aria-valuemax": se,
          "aria-valuenow": Math.min(se, Math.max(0, c)),
          "aria-valuetext": Ae(c),
          className: "relative cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent",
          onClick: be,
          onKeyDown: V
        }, B.map((x, S) => n("span", {
          key: x,
          className: `absolute top-0 ${$s(S, B.length, se > 0 ? x / se * 100 : 0)} font-mono text-[10px] text-secondary`,
          style: Ts(S, B.length, se > 0 ? x / se * 100 : 0)
        }, Ae(x))).concat(t.map((x) => {
          const S = se > 0 ? x.startSec / se * 100 : 0;
          return n("button", {
            key: `shot-boundary:${x.id}`,
            type: "button",
            "data-shot-boundary-marker": "true",
            "aria-label": `Shot ${Ae(x.startSec)} – ${Ae(x.endSec)}`,
            title: `Shot boundary · ${x.source || "manual"} · ${Ae(x.startSec)} – ${Ae(x.endSec)}`,
            className: "group absolute top-0 z-10 h-full cursor-pointer border-0 bg-transparent p-0",
            style: { left: `${S}%`, width: "2px" },
            onClick: (N) => {
              N.stopPropagation(), k(x.startSec);
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
        style: P.length > 0 ? { height: ce.height } : void 0
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
        P.length === 0 ? n("p", { key: "empty", className: "px-3 py-4 text-xs text-secondary" }, "No segments match the current filter.") : z.map((x) => {
          var Y;
          const S = x.group, N = i.includes(S.key), E = a === S.key, J = vr(E);
          if (x.kind === "group") return n("div", {
            key: x.key,
            "data-segment-group": S.key,
            "data-segment-group-collapsed": N ? "true" : "false",
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ge}rem minmax(0,1fr)`,
              backgroundColor: J,
              top: x.top,
              height: x.height
            }
          }, [
            n("button", {
              key: "name",
              type: "button",
              onClick: (_) => {
                if (_.metaKey || _.ctrlKey) {
                  b(S.lanes.flatMap((me) => me.markers.map((Me) => Me.segment.id)));
                  return;
                }
                f(S.key), m(S.key);
              },
              "aria-expanded": !N,
              "aria-current": E ? "true" : void 0,
              "data-selected-timeline-group": E ? "true" : "false",
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-1.5 border-l-4 border-r border-border px-2 text-left hover:ring-1 hover:ring-inset hover:ring-accent/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
              style: {
                borderLeftColor: S.id == null ? "var(--color-border)" : "var(--color-accent)",
                backgroundColor: J
              },
              title: `${N ? "Expand" : "Collapse"} ${S.name}`
            }, [
              n("span", { key: "chevron", "aria-hidden": "true", className: "shrink-0 text-[10px] text-secondary" }, N ? "▶" : "▼"),
              n("span", { key: "label", className: "truncate text-xs font-semibold capitalize text-foreground" }, S.name)
            ]),
            n(
              "div",
              { key: "summary", className: "flex min-w-0 items-center justify-between gap-2 px-2" },
              N ? [
                n(
                  "span",
                  { key: "lanes", className: "truncate rounded-full bg-card px-2 py-0.5 text-[10px] text-secondary" },
                  `${S.lanes.length} swimlane${S.lanes.length === 1 ? "" : "s"} hidden`
                ),
                L ? n(Wt, { key: "states", counts: S.counts }) : null
              ] : null
            )
          ]);
          const U = x.lane, pe = od(x.laneIndex), M = U.markers.some(({ segment: _ }) => _.id === s);
          return n("div", {
            key: x.key,
            "data-grouped-swimlane": S.key,
            className: "absolute left-0 right-0 grid border-b border-border",
            style: {
              gridTemplateColumns: `${ge}rem minmax(0,1fr)`,
              top: x.top,
              height: x.height,
              backgroundColor: pe
            }
          }, [
            n("div", {
              key: "label",
              "data-timeline-label-gutter": "true",
              "data-active-swimlane": M ? "true" : void 0,
              className: "sticky left-0 z-40 flex min-w-0 items-center gap-2 border-r border-border px-3 pl-5",
              style: ad(M, pe),
              title: `${Hn(U)} · Cmd/Ctrl+click to toggle all segments`,
              "aria-label": Hn(U),
              onClick: (_) => {
                (_.metaKey || _.ctrlKey) && b(U.markers.map((me) => me.segment.id));
              },
              onMouseEnter: () => C(U.key),
              onMouseLeave: () => C((_) => _ === U.key ? null : _)
            }, [
              U.tagId != null ? n("button", {
                key: "configure",
                type: "button",
                onClick: (_) => {
                  _.stopPropagation(), w({ tagId: U.tagId, tagName: U.label, trigger: _.currentTarget });
                },
                "aria-label": `Configure ${U.label}`,
                title: "Configure tag",
                className: "absolute left-0.5 flex items-center justify-center rounded text-secondary opacity-0 transition-opacity hover:bg-muted/60 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent",
                style: { width: "1.125rem", height: "1.125rem", fontSize: "1rem", lineHeight: 1, opacity: q === U.key ? 1 : void 0 }
              }, "⚙") : null,
              n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, U.label),
              (Y = U.performers) != null && Y.length ? n(Sr, {
                key: "performers",
                performers: U.performers,
                performerAssignments: U.performerAssignments
              }) : null,
              L ? n(Wt, { key: "counts", counts: U.counts }) : null
            ]),
            n("div", { key: "track", className: "relative" }, U.markers.map(({ segment: _, track: me }) => {
              var je;
              const Me = Jr(_.startSec, se), Ne = _.endSec == null ? _.startSec : Math.max(_.startSec, _.endSec), ke = Math.max(0, Jr(Ne, se) - Me), rt = l.includes(_.id), Ye = _.id === s, we = bo(G.get(_.id)), Ke = _.endSec == null ? Ae(_.startSec) : `${Ae(_.startSec)} – ${Ae(_.endSec)}`, Qe = (je = yi[we]) == null ? void 0 : je.label;
              return n("button", {
                key: _.id,
                type: "button",
                onClick: (Q) => {
                  Q.stopPropagation(), p(_, {
                    additive: Q.metaKey || Q.ctrlKey,
                    rangeSegmentIds: Q.shiftKey ? U.markers.map((de) => de.segment.id) : null
                  });
                },
                "aria-pressed": rt,
                "aria-current": Ye ? "true" : void 0,
                "data-selected-timeline-marker": Ye ? "true" : void 0,
                "data-selected-segment-shortcut-target": Ye ? "true" : void 0,
                "aria-label": L ? `${_.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${_.reviewState}${Qe ? `, ${Qe}` : ""}, ${Ke}` : `${_.tagName || "Tag segment"}${U.performerLabel ? `, ${U.performerLabel}` : ""}, ${Ke}`,
                title: L ? `${_.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${_.reviewState}${Qe ? ` · ${Qe}` : ""} · ${Ke}` : `${_.tagName || "Tag segment"}${U.performerLabel ? ` · ${U.performerLabel}` : ""} · ${Ke}`,
                className: "absolute rounded-sm border",
                style: {
                  borderColor: "var(--color-border)",
                  ...L ? td(_.reviewState, rt, we, Ye) : nd(rt, Ye),
                  left: `${Me}%`,
                  top: `${id(me)}rem`,
                  width: rd(_.endSec, ke),
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
  const [a, s] = j(null), [l, d] = j([]), [c, g] = j(null), [u, f] = j(""), [m, p] = j(!0), [b, y] = j(null), [w, k] = j(""), [I, L] = j(!1), R = fe(null), K = fe(0);
  ye(() => {
    const q = requestAnimationFrame(() => {
      var C;
      return (C = R.current) == null ? void 0 : C.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(q);
  }, [e]), ye(() => {
    const q = new AbortController();
    return p(!0), k(""), Promise.all([
      r ? Z(`/slot-definitions/${e}`, { signal: q.signal }) : Promise.resolve(null),
      Z("/segment-groups", { signal: q.signal })
    ]).then(([C, P]) => {
      const G = P.find((te) => (te.tags || []).some((ce) => Number(ce.tagId) === Number(e)));
      s(C), d(P), g((G == null ? void 0 : G.id) ?? null), f(G == null ? "" : String(G.id)), L(!1);
    }).catch((C) => {
      C.name !== "AbortError" && k(C.message || "Unable to load tag configuration.");
    }).finally(() => {
      q.signal.aborted || p(!1);
    }), () => q.abort();
  }, [r, e]);
  function v(q, C) {
    s({
      ...a,
      definitions: a.definitions.map((P, G) => G === q ? { ...P, ...C } : P)
    });
  }
  function A(q, C) {
    const P = q + C;
    if (P < 0 || P >= a.definitions.length) return;
    const G = [...a.definitions];
    [G[q], G[P]] = [G[P], G[q]], s({
      ...a,
      definitions: G.map((te, ce) => ({ ...te, sortOrder: ce }))
    });
  }
  function $(q) {
    const C = a.definitions[q], P = Number(C.assignmentCount) || 0, G = P === 0 ? "" : ` and its ${P} assignment${P === 1 ? "" : "s"}`;
    window.confirm(`Delete “${ft(C)}”${G}?`) && (P > 0 && L(!0), s({
      ...a,
      definitions: a.definitions.filter((te, ce) => ce !== q).map((te, ce) => ({ ...te, sortOrder: ce }))
    }));
  }
  async function D() {
    var C;
    y("slots"), k("Saving performer slots…");
    let q;
    try {
      q = await Z(`/slot-definitions/${e}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: a.revision,
          allowSamePerformerInMultipleSlots: !!a.allowSamePerformerInMultipleSlots,
          confirmDeleteAssigned: I,
          definitions: a.definitions.map((P, G) => {
            var te;
            return {
              id: P.id || void 0,
              label: ((te = P.label) == null ? void 0 : te.trim()) || null,
              sortOrder: G,
              genderHints: P.genderHints || []
            };
          })
        })
      }), s(q), L(!1);
    } catch (P) {
      P.status === 409 ? (k("Performer slots changed elsewhere; current values were reloaded."), (C = P.payload) != null && C.current && (s(P.payload.current), L(!1))) : k(P.message || "Unable to save performer slots."), y(null);
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
  async function W() {
    const q = u === "" ? null : Number(u);
    if (q !== c) {
      y("group"), k("Saving tag group…");
      try {
        await Z(`/segment-groups/tags/${e}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ groupId: q })
        });
      } catch (C) {
        k(C.message || "Unable to assign the tag group."), y(null);
        return;
      }
      try {
        const [C, P] = await Promise.allSettled([
          Z("/segment-groups"),
          o()
        ]);
        if (C.status === "fulfilled") {
          d(C.value);
          const G = C.value.find((ce) => (ce.tags || []).some((z) => Number(z.tagId) === Number(e))), te = (G == null ? void 0 : G.id) ?? null;
          g(te), f(te == null ? "" : String(te));
        }
        k(
          C.status === "fulfilled" && P.status === "fulfilled" ? "Tag group saved." : "Tag group saved, but the configuration could not be fully refreshed."
        );
      } finally {
        y(null);
      }
    }
  }
  l.find((q) => Number(q.id) === Number(c));
  const ee = "rounded-md border border-border bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50";
  return n("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4",
    onMouseDown: (q) => {
      q.target === q.currentTarget && !b && i();
    },
    onKeyDownCapture: (q) => bt(q, {
      onCancel: b ? void 0 : i
    })
  }, n("section", {
    ref: R,
    role: "dialog",
    "aria-modal": "true",
    "aria-labelledby": "segment-studio-inline-tag-configuration-title",
    tabIndex: -1,
    onKeyDownCapture: Lt,
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
            disabled: b != null,
            onChange: (q) => f(q.target.value),
            className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground"
          }, [
            n("option", { key: "ungrouped", value: "" }, "Ungrouped"),
            ...l.map((q) => n("option", { key: q.id, value: String(q.id) }, q.name))
          ])
        ]),
        m ? null : n("button", {
          key: "save",
          type: "button",
          disabled: b != null || (u === "" ? null : Number(u)) === c,
          onClick: W,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, b === "group" ? "Saving…" : "Save tag group")
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
              disabled: b != null,
              onChange: (q) => s({ ...a, allowSamePerformerInMultipleSlots: q.target.checked })
            }),
            n("span", { key: "label" }, "Allow the same performer in multiple slots")
          ]),
          ...(a.definitions || []).map((q, C) => n("article", {
            key: q.id || q._clientKey,
            className: "grid gap-2 rounded-md border border-border bg-surface p-3 sm:grid-cols-[1fr_1fr_auto]"
          }, [
            n("label", { key: "name", className: "space-y-1 text-xs text-secondary" }, [
              n("span", { key: "label" }, "Slot label"),
              n("input", {
                key: "input",
                value: q.label || "",
                disabled: b != null,
                onChange: (P) => v(C, { label: P.target.value }),
                className: "w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
              })
            ]),
            n("fieldset", { key: "hints", className: "space-y-1 text-xs text-secondary" }, [
              n("legend", { key: "label" }, "Gender hints"),
              n("div", { key: "choices", className: "flex flex-wrap gap-x-3 gap-y-1" }, Ss.map((P) => n("label", { key: P, className: "inline-flex items-center gap-1" }, [
                n("input", {
                  key: "input",
                  type: "checkbox",
                  disabled: b != null,
                  checked: (q.genderHints || []).includes(P),
                  onChange: (G) => v(C, {
                    genderHints: G.target.checked ? [.../* @__PURE__ */ new Set([...q.genderHints || [], P])] : (q.genderHints || []).filter((te) => te !== P)
                  })
                }),
                n("span", { key: "text" }, xr(P))
              ])))
            ]),
            n("div", { key: "actions", className: "flex items-end gap-1" }, [
              n("span", { key: "count", className: "mr-1 text-xs text-secondary" }, `${q.assignmentCount || 0} assigned`),
              n("button", { key: "up", type: "button", disabled: b != null || C === 0, onClick: () => A(C, -1), className: ee, "aria-label": `Move ${ft(q)} up` }, "↑"),
              n("button", { key: "down", type: "button", disabled: b != null || C === a.definitions.length - 1, onClick: () => A(C, 1), className: ee, "aria-label": `Move ${ft(q)} down` }, "↓"),
              n("button", { key: "delete", type: "button", disabled: b != null, onClick: () => $(C), className: `${ee} text-red-300` }, "Delete")
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
                  _clientKey: `new-${++K.current}`,
                  label: "",
                  sortOrder: a.definitions.length,
                  genderHints: [],
                  assignmentCount: 0
                }]
              }),
              className: ee
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
function Sc(e, t, r) {
  if (!(e != null && e.disabled) || !r) return !1;
  const o = (t == null ? void 0 : t.querySelector(`[data-action-id="${r}"]:not(:disabled)`)) || (t == null ? void 0 : t.querySelector("button:not(:disabled)"));
  return o ? (o.focus(), !0) : !1;
}
function kc(e) {
  const { acquireSaveLock: t, activeFilterCount: r, allSwimlanes: o, analysisError: i, analysisRun: a, analysisStatus: s, approvalFacetCounts: l, autoAssignCandidates: d, autoAssignError: c, autoAssignOpen: g, autoAssignPerformers: u, autoAssigning: f, cancelQueuedReviewsForSegments: m, canMoveSelectionToBin: p, captureTrainingExport: b, centerTimelineRef: y, closeEditorFilters: w, closeFirstSegmentTagDialog: k, closeMaterializeDialog: I, closeMergeConfirmation: L, closePublishApprovedDialog: R, closeTagEditing: K, collapsedSegmentGroups: v, commonActionsRef: A, compatibilityMode: $, configuringTag: D, createSegment: W, creatingSegmentId: ee, currentTime: q, deleteRejectedSegments: C, detail: P, detailPanelRef: G, detailWidth: te, duplicateSegment: ce, editorFilters: z, editorLayout: se, editorRef: H, exportingExamples: ae, filtersButtonRef: ge, filtersOpen: xe, firstSegmentTagOpen: oe, focusRowRef: he, handleSeparatorKeyDown: B, handleSeparatorPointerDown: ue, handleSeparatorPointerMove: re, hasNextUnreviewed: X, hasPreviousUnreviewed: be, hideDerivedSegments: V, history: ie, historyOpen: T, historySaving: h, horizontalLayoutSize: x, importNativeSegments: S, incorrectExamples: N, incorrectExamplesOpen: E, lineage: J, markerRailWidth: U, materializeButtonRef: pe, materializeCancelButtonRef: M, materializeDerivedSegments: Y, materializeError: _, materializeLoading: me, materializeOpen: Me, materializePreview: Ne, materializing: ke, mediaStackRef: rt, mergeCancelButtonRef: Ye, mergeConfirmation: we, mergeSaving: Ke, mergeSelectedSwimlane: Qe, nativeImportState: je, onDetailChange: Q, onNavigate: de, onReload: Ee, onSlotsChanged: Be, openPublishApprovedDialog: ve, panelSeparatorProps: We, pendingInitialSeekRef: ze, performerSlots: Ie, performerSlotsAvailable: Se, playbackControlsRef: Ge, previewDerivedSegments: _e, provenance: Ce, provenanceSources: Xe, publishApprovedCancelButtonRef: Oe, publishApprovedDrafts: Pe, publishApprovedError: Re, publishApprovedOpen: He, quickSearchOpen: Mt, railScrollRef: Le, railToggleRef: Et, recordHistoryAction: Sn, rejectedDeletionPreview: it, removeIncorrectExample: Te, removingExampleId: $e, restoreHistoryTarget: Ve, runEditorAction: ht, saveMessage: st, saveTag: zt, saveTiming: lt, savingSegmentId: ut, seekRef: Dt, segmentGroups: Jt, segmentRailLayout: kn, segments: vt, selectAllVideoSegments: wr, selectSegment: rn, selectSegmentCollection: on, selectedGroups: Nr, selectedPerformerSlots: wn, selectedSegment: It, selectedSegmentGroupKey: Nn, selectedSegmentIds: Vn, selectedSegments: Ft, selectedSlotStatus: Jn, setAutoAssignError: In, setAutoAssignOpen: Ht, setConfiguringTag: Yt, setCurrentTime: Yn, setEditorFilters: Ir, setEditorLayout: Qn, setFiltersOpen: Cr, setHideDerivedSegments: Cn, setHistoryOpen: an, setIncorrectExamplesOpen: $n, setQuickSearchOpen: Qt, setRailViewport: $r, setRejectedDeletionPreview: Zn, setSaveMessage: Tn, setSelectedSegmentGroupKey: _t, setSelectedSegmentId: An, setShortcutsOpen: sn, setTimelineZoom: mt, shotBoundaries: Xn, shortcutsOpen: Rn, slotButtonRef: er, splitLayout: Ot, splitSegment: Mn, startFullAnalysis: ln, stepVideoFrame: tr, tagEditing: Tr, tagSearchRef: Ar, timelineDuration: En, timelineRatioBounds: dn, timelineZoom: Dn, toggleSegmentGroup: Ze, toggleSegmentRail: ot, updateTimelineRatio: Rr, video: at, videoPerformers: xt, visibleCounts: St, visibleSegmentRailRows: Mr, visibleSegments: cn, wideLayout: jt, workspaceRef: On } = e, Pn = qe(
    () => vt.filter((O) => !O.published && O.reviewState === "approved"),
    [vt]
  ), nr = bs(so), un = Pn.length, Ln = Ne ? Ne.createCount + Ne.linkCount : null, Pt = ut != null, kt = Ft.length > 0, Ct = Ft.length === 1, Er = kt && Ft.every((O) => O.reviewState === "approved"), Dr = kt && Ft.every((O) => O.reviewState === "rejected"), Or = [
    { id: "marker.create", label: "New segment", disabled: Pt },
    { id: "marker.editTag", label: "Edit tag", disabled: Pt || !kt },
    { id: "marker.setStart", label: "Set start", disabled: Pt || !Ct },
    { id: "marker.setEnd", label: "Set end", disabled: Pt || !Ct },
    { id: "marker.split", label: "Split", disabled: Pt || !Ct },
    ...$ ? [
      { id: "navigation.previousUnreviewedGlobal", label: "Previous unreviewed", disabled: !be, focusWhenDisabled: "navigation.nextUnreviewedGlobal" },
      { id: "marker.confirm", label: Er ? "Unapprove" : "Approve", disabled: Pt || !kt, tone: "approve" },
      { id: "marker.reject", label: Dr ? "Unreject" : "Reject", disabled: Pt || !kt, tone: "reject" },
      { id: "navigation.nextUnreviewedGlobal", label: "Next unreviewed", disabled: !X, focusWhenDisabled: "navigation.previousUnreviewedGlobal" }
    ] : [],
    ...$ ? [] : [
      { id: "marker.moveToBin", label: "Move to bin", disabled: Pt || !p, tone: "reject" }
    ]
  ];
  function Pr(O) {
    const ne = Vn.includes(O.id), et = O.id === (It == null ? void 0 : It.id), ct = O.endSec == null ? Ae(O.startSec) : `${Ae(O.startSec)} – ${Ae(O.endSec)}`, Bt = `${Rt(O.sourceKey)}${O.confidence != null ? ` · ${Math.round(O.confidence * 100)}%` : ""}`;
    return n("button", {
      key: O.id,
      type: "button",
      onClick: (Gt) => rn(O, { additive: Gt.metaKey || Gt.ctrlKey }),
      "aria-pressed": ne,
      "aria-current": et ? "true" : void 0,
      "data-selected-segment-shortcut-target": et ? "true" : void 0,
      "aria-label": $ ? `${O.tagName || "Tag segment"}, ${O.reviewState}${O.isDerived ? ", derived segment" : ""}, ${ct}` : `${O.tagName || "Tag segment"}${O.isDerived ? ", derived segment" : ""}, ${ct}`,
      className: "relative mb-1 w-full rounded-md border border-border bg-card px-2 py-1.5 text-left transition-colors hover:bg-muted/40 last:mb-0",
      style: fi(ne, et)
    }, [
      n("div", { key: "row", className: "flex min-w-0 items-center gap-1.5" }, [
        $ ? n(nn, { key: "review", state: O.reviewState, includeLabel: !1 }) : null,
        O.isDerived ? n(kr, { key: "derived" }) : null,
        n(
          "span",
          { key: "tag", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" },
          O.tagName || "Tag segment"
        ),
        n("span", { key: "time", className: "shrink-0 whitespace-nowrap font-mono text-[10px] text-secondary" }, ct),
        n("span", {
          key: "provenance",
          className: "max-w-24 shrink truncate text-right text-[10px] text-secondary",
          title: Bt
        }, Bt)
      ])
    ]);
  }
  const mn = "inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium text-secondary hover:bg-muted/40 hover:text-foreground disabled:opacity-50", dt = [...ie.actions || []].reverse().find((O) => O.sequence <= ie.cursorSequence);
  return n("section", {
    ref: H,
    tabIndex: -1,
    "aria-label": "Segment Studio segment editor",
    className: `${Ot ? "min-h-0 flex-1" : ""} flex flex-col gap-2 outline-none`
  }, [
    n("header", { key: "header", className: "flex shrink-0 flex-col items-stretch gap-2 rounded-md border border-border bg-surface px-3 py-2" }, [
      n("div", { key: "title-row", className: "flex min-w-0 items-center gap-3" }, [
        n("div", { key: "identity", className: "flex min-w-0 flex-1 items-center gap-1.5" }, [
          n("a", {
            key: "exit",
            href: "/segment-studio",
            onClick: (O) => Ni(O, de, { page: "segment-studio" }),
            "aria-label": "Go back",
            title: "Go back",
            className: "shrink-0 px-1 text-lg leading-none text-secondary hover:text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          }, "←"),
          n("h1", { key: "title", className: "min-w-0 truncate text-lg font-semibold text-foreground" }, n("a", {
            href: `/video/${at.id}`,
            className: "hover:underline focus:underline focus:outline-none",
            title: at.title || `Video ${at.id}`
          }, at.title || `Video ${at.id}`)),
          ...xt.map((O) => n(_n, {
            key: nt(O),
            performer: { id: nt(O), name: O.name },
            compact: !0,
            tooltip: O.name
          })),
          $ ? n(Wt, { key: "review-counts", counts: St }) : null
        ]),
        n("div", { key: "actions", className: "flex shrink-0 items-center gap-1.5" }, [
          $ ? null : n($i, { key: "bin", onNavigate: de, compact: !0 }),
          n(Ti, { key: "settings", onNavigate: de, compact: !0 })
        ])
      ]),
      $ && P.nativeImportCount > 0 ? n("div", {
        key: "native-import",
        className: "flex flex-wrap items-center gap-2 rounded-md border border-amber-400/50 bg-amber-500/10 px-3 py-2 text-xs"
      }, [
        n(
          "span",
          { key: "message", className: "mr-auto text-amber-100" },
          `${P.nativeImportCount} Cove segment${P.nativeImportCount === 1 ? "" : "s"} ${P.nativeImportCount === 1 ? "is" : "are"} not in Segment Studio.`
        ),
        je.busy ? n("span", {
          key: "progress",
          role: "status",
          className: "font-medium text-foreground"
        }, je.reviewState === "approved" ? "Importing as approved…" : "Importing for review…") : [
          n("button", {
            key: "review",
            type: "button",
            onClick: () => S("unreviewed"),
            className: "rounded-md border border-amber-300/60 px-2.5 py-1 font-medium text-foreground hover:bg-amber-500/20"
          }, "Import for review"),
          n("button", {
            key: "approved",
            type: "button",
            onClick: () => S("approved"),
            className: "rounded-md border border-emerald-400/60 bg-emerald-500/10 px-2.5 py-1 font-medium text-foreground hover:bg-emerald-500/20"
          }, "Import as approved")
        ],
        je.error ? n("span", {
          key: "error",
          role: "alert",
          className: "w-full text-red-300"
        }, je.error) : null
      ]) : null,
      i && (s == null ? void 0 : s.configured) !== !1 ? n("div", {
        key: "analysis-error",
        role: "alert",
        className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-xs text-red-300"
      }, i) : null,
      n("div", { key: "toolbar", className: "flex flex-wrap items-center justify-between gap-2" }, [
        n("div", { key: "workflow", className: "flex flex-wrap items-center gap-1.5" }, [
          $ ? n("div", {
            key: "full-analysis",
            className: "inline-flex items-stretch"
          }, [
            n("button", {
              key: "run",
              type: "button",
              disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
              onClick: () => ln(),
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
              }, n(La, { className: "h-4 w-4" })),
              n("div", {
                key: "menu",
                className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl"
              }, [
                ["AI analysis only", ["aiTagging"]],
                ["Shot boundaries only", ["omnishotcut"]]
              ].map(([O, ne]) => n("button", {
                key: O,
                type: "button",
                disabled: (s == null ? void 0 : s.configured) === !1 || (s == null ? void 0 : s.ready) === !1 || (a == null ? void 0 : a.status) === "queued" || (a == null ? void 0 : a.status) === "running",
                onClick: (et) => {
                  var ct;
                  (ct = et.currentTarget.closest("details")) == null || ct.removeAttribute("open"), ln(ne);
                },
                className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
              }, O)))
            ])
          ]) : null,
          $ ? n("button", {
            key: "auto-assign-performers",
            type: "button",
            disabled: ut != null || d.length === 0,
            onClick: () => {
              In(""), Ht(!0);
            },
            title: "Auto-assign performers to segments with one valid complete slot match",
            className: "rounded-md border border-violet-400/60 bg-violet-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-violet-500/25 disabled:opacity-50"
          }, `Auto-Assign Performers${d.length ? ` (${d.length})` : ""}`) : null,
          $ ? n("button", {
            key: "materialize-derived",
            ref: pe,
            type: "button",
            disabled: ut != null || me || ke || Ln === 0,
            onClick: _e,
            title: "Preview and materialize segments implied by derivation rules",
            className: "rounded-md border border-indigo-400/60 bg-indigo-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-indigo-500/25 disabled:opacity-50"
          }, me ? "Analyzing…" : `Auto-Materialize${Ln != null ? ` (${Ln})` : ""}`) : null,
          $ ? n("button", {
            key: "complete-review",
            type: "button",
            disabled: ut != null || un === 0,
            onClick: (O) => ve(O.currentTarget),
            "aria-haspopup": "dialog",
            "aria-expanded": He,
            className: "rounded-md border border-emerald-500/60 bg-emerald-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-emerald-500/25 disabled:opacity-50"
          }, `Publish approved${un ? ` (${un})` : ""}`) : null,
          n("button", {
            key: "feedback",
            type: "button",
            disabled: ae || $e != null || N.length === 0,
            onClick: () => $n(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": E,
            "aria-label": `Open AI feedback collection, ${N.length} example${N.length === 1 ? "" : "s"}`,
            title: "Manage incorrect examples (Shift+C)",
            className: "rounded-md border border-cyan-400/60 bg-cyan-500/15 px-3 py-1.5 text-xs font-medium text-foreground hover:bg-cyan-500/25 disabled:opacity-50"
          }, `AI Feedback${N.length ? ` (${N.length})` : ""}`)
        ]),
        n("div", { key: "utilities", className: "ml-auto flex flex-wrap items-center justify-end gap-1.5" }, [
          n("button", {
            key: "filters",
            ref: ge,
            type: "button",
            onClick: () => Cr(!0),
            "aria-haspopup": "dialog",
            "aria-expanded": xe,
            className: `${mn} ${r ? "border-accent bg-accent/20 text-foreground" : ""}`
          }, [
            n(lr, { key: "icon", name: "filter" }),
            n("span", { key: "label" }, `Filter${r ? ` (${r})` : ""}`)
          ]),
          n("button", {
            key: "shortcuts",
            type: "button",
            onClick: () => sn(!0),
            className: mn
          }, [n(lr, { key: "icon", name: "keyboard" }), n("span", { key: "label" }, "Shortcuts")]),
          n("button", {
            key: "history",
            type: "button",
            disabled: ($ ? ie.actions.length === 0 : dt == null) || ut != null || h,
            onClick: $ ? () => an((O) => !O) : () => Ve(
              dt.sequence - 1
            ),
            "aria-haspopup": $ ? "dialog" : void 0,
            "aria-expanded": $ ? T : void 0,
            className: mn
          }, [
            n(lr, { key: "icon", name: "history" }),
            n("span", { key: "label" }, $ ? `History${ie.actions.length ? ` (${ie.actions.length})` : ""}` : dt ? `Undo ${dt.label}` : "Undo")
          ]),
          n("button", {
            key: "rail",
            ref: Et,
            type: "button",
            onClick: ot,
            "aria-controls": "segment-studio-segment-rail",
            "aria-expanded": se.markerRailOpen,
            className: mn
          }, [
            n(lr, { key: "icon", name: "list" }),
            n("span", { key: "label" }, se.markerRailOpen ? "Hide segment rail" : "Show segment rail")
          ])
        ])
      ])
    ]),
    $ && T ? n("section", {
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
          onClick: () => an(!1),
          className: "rounded px-2 py-1 text-xs text-secondary hover:bg-muted/40"
        }, "Close")
      ]),
      n("div", { key: "actions", className: "max-h-72 overflow-y-auto" }, [
        ...[...ie.actions].reverse().map((O) => n("button", {
          key: O.sequence,
          type: "button",
          disabled: h,
          onClick: () => Ve(O.sequence),
          "aria-current": ie.cursorSequence === O.sequence ? "step" : void 0,
          className: `flex w-full items-center justify-between gap-3 rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${O.sequence > ie.cursorSequence ? "text-secondary" : "text-foreground"} ${ie.cursorSequence === O.sequence ? "bg-accent/15" : ""}`
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
          disabled: h,
          onClick: () => Ve(ie.baselineSequence),
          "aria-current": ie.cursorSequence === ie.baselineSequence ? "step" : void 0,
          className: `w-full rounded px-2 py-2 text-left text-sm hover:bg-muted/40 disabled:opacity-50 ${ie.cursorSequence === ie.baselineSequence ? "bg-accent/15 text-foreground" : "text-secondary"}`
        }, "Before recent changes")
      ])
    ]) : null,
    xe ? n(lc, {
      key: "editor-filters",
      filters: z,
      hideDerivedSegments: V,
      performers: xt,
      provenanceSources: Xe,
      reviewCounts: l,
      segments: vt,
      segmentGroups: Jt,
      reviewMode: $,
      onChange: Ir,
      onHideDerivedChange: Cn,
      onClose: w
    }) : null,
    oe ? n(sc, {
      key: "first-segment-tag-dialog",
      saving: ut != null,
      error: st,
      onSelect: (O, ne) => W(O, ne),
      onClose: k
    }) : null,
    Mt ? n(uc, {
      key: "quick-search-dialog",
      segments: Hl(o),
      onSelect: (O) => {
        Qt(!1), rn(O, { focusEditor: !0, seekToSegment: !1 });
      },
      onClose: () => {
        Qt(!1), requestAnimationFrame(() => {
          var O;
          return (O = H.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    g ? n(pc, {
      key: "auto-assign-dialog",
      candidates: d,
      processing: f,
      error: c,
      onConfirm: u,
      onClose: () => Ht(!1)
    }) : null,
    we ? n(yc, {
      key: "merge-selection-dialog",
      merge: we,
      processing: Ke,
      undoable: !$,
      cancelButtonRef: Ye,
      onConfirm: (O) => Qe(!0, O, we),
      onClose: L
    }) : null,
    Me ? n(hc, {
      key: "materialize-derived-dialog",
      preview: Ne,
      loading: me,
      processing: ke,
      error: _,
      cancelButtonRef: M,
      onConfirm: Y,
      onClose: () => {
        ke || I();
      }
    }) : null,
    n("div", {
      key: "workspace",
      ref: On,
      className: `${Ot ? "min-h-0 flex-1" : ""} relative grid gap-2`
    }, [
      se.markerRailOpen ? n("aside", {
        key: "segment-rail",
        id: "segment-studio-segment-rail",
        "aria-label": "Segment rail",
        className: "order-2 flex min-h-[24rem] flex-col overflow-hidden rounded-md border border-border bg-surface lg:min-h-0",
        style: jt ? { position: "absolute", top: 0, right: 0, width: U, height: x.focusRowHeight || "16rem", zIndex: 1 } : { height: "32rem" }
      }, [
        vt.length === 0 ? n("p", { key: "empty", className: "p-4 text-sm text-secondary" }, "This video has no ordinary tag segments.") : cn.length === 0 ? n(
          "p",
          { key: "filtered-empty", className: "p-4 text-sm text-secondary" },
          "No segments match the current editor filters."
        ) : n("div", {
          key: "segments",
          ref: Le,
          onScroll: (O) => $r({
            scrollTop: O.currentTarget.scrollTop,
            height: O.currentTarget.clientHeight
          }),
          className: "min-h-0 flex-1 overflow-y-auto p-2"
        }, n("div", {
          className: "relative",
          style: { height: kn.height }
        }, Mr.map((O) => {
          var et;
          let ne;
          if (O.kind === "group") {
            const ct = v.includes(O.group.key), Bt = O.group.lanes.reduce((Gt, rr) => Gt + rr.markers.length, 0);
            ne = n("button", {
              type: "button",
              onClick: () => {
                _t(O.group.key), Ze(O.group.key);
              },
              "aria-expanded": !ct,
              "aria-current": Nn === O.group.key ? "true" : void 0,
              "data-segment-rail-group": O.group.key,
              className: `flex w-full items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs font-semibold text-foreground hover:bg-muted/50 ${Nn === O.group.key ? "border-accent bg-accent/15" : "border-border bg-muted/30"}`
            }, [
              n("span", { key: "toggle", "aria-hidden": "true", className: "w-3 shrink-0 text-center" }, ct ? "▸" : "▾"),
              n("span", { key: "name", className: "min-w-0 flex-1 truncate", title: O.group.name }, O.group.name),
              n("span", { key: "count", className: "shrink-0 tabular-nums text-secondary" }, Bt),
              $ && ct ? n(Wt, { key: "states", counts: O.group.counts }) : null
            ]);
          } else O.kind === "lane" ? ne = n("div", {
            className: "flex min-w-0 items-center gap-2 rounded-md border border-border bg-muted/30 px-2 py-1.5",
            title: Hn(O.lane),
            "aria-label": Hn(O.lane)
          }, [
            n("span", { key: "name", className: "min-w-0 flex-1 truncate text-xs font-medium text-foreground" }, O.lane.label),
            (et = O.lane.performers) != null && et.length ? n(Sr, {
              key: "performers",
              performers: O.lane.performers,
              performerAssignments: O.lane.performerAssignments
            }) : null,
            $ ? n(Wt, { key: "states", counts: O.lane.counts }) : null
          ]) : ne = Pr(O.segment);
          return n("div", {
            key: O.key,
            className: "absolute left-0 right-0",
            style: { top: O.top, height: O.height }
          }, ne);
        })))
      ]) : null,
      n("div", { key: "review-pane", className: `${Ot ? "min-h-0" : ""} order-1 flex min-w-0 flex-col gap-2 lg:order-1` }, [
        n("div", {
          key: "media-stack",
          ref: rt,
          className: `${Ot ? "min-h-0 flex-1" : ""} grid`,
          style: Ot ? {
            gridTemplateRows: `minmax(16rem, ${(1 - se.timelineRatio) * 100}fr) auto 0.5rem minmax(14rem, ${se.timelineRatio * 100}fr)`
          } : { rowGap: "0.5rem" }
        }, [
          n("div", {
            key: "focus-row",
            ref: he,
            className: "grid min-h-0 gap-2",
            style: jt ? {
              gridTemplateColumns: se.markerRailOpen ? `${te}px 0.5rem minmax(0,1fr) 0.5rem ${U}px` : `${te}px 0.5rem minmax(0,1fr)`
            } : void 0
          }, [
            n(vc, {
              key: "tools",
              compatibilityMode: $,
              selectedSegment: It,
              selectedSegments: Ft,
              selectedGroups: Nr,
              saveMessage: st,
              savingSegmentId: ut,
              creatingSegmentId: ee,
              acquireSaveLock: t,
              setSaveMessage: Tn,
              saveTag: zt,
              slotStatus: Jn,
              performerSlotsAvailable: Se,
              selectedPerformerSlots: wn,
              performerSlots: Ie,
              detail: P,
              onDetailChange: Q,
              onCancelQueuedReview: m,
              video: at,
              slotButtonRef: er,
              tagSearchRef: Ar,
              tagEditing: Tr,
              onCancelTagEditing: K,
              detailPanelRef: G,
              onReduceSelection: (O) => {
                rn(O), requestAnimationFrame(() => {
                  var ne;
                  return (ne = G.current) == null ? void 0 : ne.focus({ preventScroll: !0 });
                });
              },
              saveTiming: lt,
              onSlotsChanged: Be,
              onRecordHistory: Sn,
              splitSegment: Mn,
              duplicateSegment: ce,
              provenance: Ce,
              lineage: J,
              onNavigateLineageItem: (O) => {
                const ne = vt.find((et) => et.itemId === O);
                ne && An(ne.id);
              }
            }),
            jt ? n(
              "div",
              { key: "detail-separator", ...We("detailWidth", "Resize segment details") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            at.videoFile ? n(
              "div",
              { key: "player", "data-segment-player": "true", className: "flex min-h-0 items-center overflow-hidden rounded-md border border-border bg-black", style: { minHeight: "16rem" } },
              n("div", { className: "h-full min-h-0 w-full" }, n(Ma, {
                streamUrl: `/api/stream/video/${at.id}`,
                posterUrl: `/api/stream/video/${at.id}/screenshot?v=${encodeURIComponent(at.updatedAt || "")}`,
                format: at.videoFile.format,
                audioCodec: at.videoFile.audioCodec,
                duration: at.videoFile.duration,
                videoId: at.id,
                trackingEnabled: !1,
                onSeekRegister: (O) => {
                  Dt.current = O, Gl(ze.current, vt, O) && (ze.current = null);
                },
                onPlaybackControlRegister: (O) => {
                  Ge.current = O;
                },
                onTimeUpdate: Yn
              }))
            ) : n("p", { key: "no-player", className: "flex min-h-0 items-center justify-center rounded-md border border-dashed border-border p-4 text-sm text-secondary", style: { minHeight: "16rem" } }, "This video has no playable file."),
            jt && se.markerRailOpen ? n(
              "div",
              { key: "rail-separator", ...We("markerRailWidth", "Resize segment rail") },
              n("span", { className: "h-16 w-1 rounded-full bg-border" })
            ) : null,
            jt && se.markerRailOpen ? n("div", { key: "rail-placeholder", "aria-hidden": "true" }) : null
          ]),
          n("div", {
            key: "common-actions",
            ref: A,
            role: "toolbar",
            "aria-label": "Common segment actions",
            className: "flex flex-wrap items-center gap-1.5 rounded-md border border-border bg-surface px-2 py-1.5"
          }, [
            ...Or.map((O) => {
              var ct;
              const ne = (ct = nr[O.id]) == null ? void 0 : ct[0], et = O.tone === "approve" ? "border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500/20" : O.tone === "reject" ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/20" : "border-border bg-card hover:bg-muted/50";
              return n("button", {
                key: O.id,
                type: "button",
                disabled: O.disabled,
                "data-action-id": O.id,
                onClick: (Bt) => {
                  const Gt = Bt.currentTarget;
                  ht(O.id, { target: Gt, preserveFocus: !0 }), O.focusWhenDisabled && requestAnimationFrame(() => {
                    Sc(Gt, A.current, O.focusWhenDisabled);
                  });
                },
                title: ne ? `${O.label} (${ne})` : O.label,
                className: `inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40 ${et}`
              }, [
                n("span", { key: "label" }, O.label),
                ne ? n("kbd", {
                  key: "shortcut",
                  className: "rounded border border-border/70 bg-background/70 px-1 py-0.5 font-mono text-[10px] leading-none text-secondary"
                }, ne) : null
              ]);
            }),
            n("div", { key: "frame-actions", className: "ml-auto flex items-center gap-1" }, [
              n("button", {
                key: "previous-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => tr(-1),
                title: "Previous frame",
                "aria-label": "Previous frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(hs, { className: "h-4 w-4", "aria-hidden": !0 })),
              n("button", {
                key: "next-frame",
                type: "button",
                disabled: !at.videoFile,
                onClick: () => tr(1),
                title: "Next frame",
                "aria-label": "Next frame",
                className: "inline-flex rounded-md border border-border bg-card p-1.5 text-foreground hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-40"
              }, n(vs, { className: "h-4 w-4", "aria-hidden": !0 }))
            ])
          ]),
          Ot ? n("div", {
            key: "separator",
            role: "separator",
            tabIndex: 0,
            "aria-label": "Resize player and swimlanes",
            "aria-orientation": "horizontal",
            "aria-valuemin": Math.round(dn.minimum * 100),
            "aria-valuemax": Math.round(dn.maximum * 100),
            "aria-valuenow": Math.round(se.timelineRatio * 100),
            "aria-valuetext": `Swimlanes use ${Math.round(se.timelineRatio * 100)} percent of the media area`,
            title: "Drag or use Up/Down to resize · Shift for larger steps · double-click to reset",
            onPointerDown: ue,
            onPointerMove: re,
            onKeyDown: B,
            onDoubleClick: () => Rr(yt.timelineRatio),
            className: "flex items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent",
            style: { touchAction: "none", cursor: "row-resize" }
          }, n("span", { className: "h-1 w-16 rounded-full bg-border" })) : null,
          n("div", { key: "timeline", className: "min-h-0", style: Ot ? void 0 : { height: "20rem" } }, n(xc, {
            segments: cn,
            shotBoundaries: Xn,
            segmentGroups: Jt,
            performerSlots: Ie,
            collapsedGroupKeys: v,
            selectedGroupKey: Nn,
            selectedSegmentId: It == null ? void 0 : It.id,
            selectedSegmentIds: Vn,
            duration: En,
            currentTime: q,
            zoom: Dn,
            onZoomChange: mt,
            onSelectGroup: _t,
            onToggleGroup: Ze,
            onSelect: (O, ne) => rn(O, ne),
            onSelectSegments: on,
            onSelectAll: wr,
            onConfigureTag: (O) => Yt(O),
            onSeekTime: (O) => {
              var ne;
              return (ne = Dt.current) == null ? void 0 : ne.call(Dt, O, !1);
            },
            centerRef: y,
            showReviewState: $,
            swimlaneTitleWidth: se.swimlaneTitleWidth,
            onSwimlaneTitleWidthChange: (O) => Qn((ne) => ({ ...ne, swimlaneTitleWidth: O }))
          }))
        ])
      ])
    ]),
    D ? n(xo, {
      key: `configure-tag:${D.tagId}`,
      tagId: D.tagId,
      tagName: D.tagName,
      performerSlotsEnabled: $,
      onSaved: Ee,
      onClose: () => {
        const O = D.trigger;
        Yt(null), requestAnimationFrame(() => {
          var ne;
          O != null && O.isConnected ? O.focus({ preventScroll: !0 }) : (ne = H.current) == null || ne.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    He ? n(gc, {
      key: "publish-approved-dialog",
      drafts: Pn,
      processing: ut === -1,
      error: Re,
      cancelButtonRef: Oe,
      onConfirm: Pe,
      onClose: R
    }) : null,
    it ? n(fc, {
      key: "rejected-deletion-dialog",
      preview: it,
      onConfirm: () => {
        C(it), requestAnimationFrame(() => {
          var O;
          return (O = H.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      },
      onClose: () => {
        Zn(null), requestAnimationFrame(() => {
          var O;
          return (O = H.current) == null ? void 0 : O.focus({ preventScroll: !0 });
        });
      }
    }) : null,
    Rn ? n(dc, {
      key: "shortcuts-dialog",
      reviewMode: $,
      bindings: nr,
      onClose: () => sn(!1)
    }) : null,
    E ? n(cc, {
      key: "incorrect-examples-dialog",
      examples: N,
      exporting: ae,
      removingExampleId: $e,
      onExport: b,
      onRemove: Te,
      onClose: () => $n(!1)
    }) : null
  ]);
}
function wc(e) {
  const { allSwimlanes: t, editorRef: r, performerSlots: o, seekRef: i, segmentGroups: a, segments: s, selectedSegmentId: l, selectedSegmentIds: d, selectionAnchorIdRef: c, selectionRangeBaseIdsRef: g, setCollapsedSegmentGroups: u, setEditorFilters: f, setHideDerivedSegments: m, setSaveMessage: p, setSelectedSegmentGroupKey: b, setSelectedSegmentId: y, setSelectedSegmentIds: w } = e;
  function k(v) {
    const A = Tt(t, v);
    A && u(($) => ki($, A));
  }
  function I(v) {
    y(v), w(v == null ? [] : [v]), c.current = v, g.current = [];
  }
  function L(v, {
    focusEditor: A = !1,
    seekToSegment: $ = !1,
    additive: D = !1,
    rangeSegmentIds: W = null
  } = {}) {
    var q, C;
    const ee = _s({
      selectedSegmentIds: d,
      activeSegmentId: l,
      anchorSegmentId: c.current,
      rangeBaseSegmentIds: g.current
    }, v.id, W, D);
    w(ee.selectedSegmentIds), y(ee.activeSegmentId), c.current = ee.anchorSegmentId, g.current = ee.rangeBaseSegmentIds, ee.activeSegmentId != null && b(Tt(t, ee.activeSegmentId)), k(v.id), A && ((q = r.current) == null || q.focus({ preventScroll: !0 })), $ && ((C = i.current) == null || C.call(i, v.startSec, !1));
  }
  function R(v) {
    const A = zs(
      d,
      l,
      v
    );
    w(A.selectedSegmentIds), y(A.activeSegmentId), c.current = A.activeSegmentId, g.current = [], A.activeSegmentId != null && (b(Tt(t, A.activeSegmentId)), k(A.activeSegmentId));
  }
  function K() {
    var $;
    const v = Ws(s), A = v.includes(l) ? l : v[0] ?? null;
    f(Nt({})), m(!1), w(v), y(A), c.current = A, g.current = [], A != null && b(Tt(
      en(s, a, o),
      A
    )), p(v.length === 0 ? "There are no segments to select." : `${v.length} segments selected. Collapsed Segment groups keep their selected segments.`), ($ = r.current) == null || $.focus({ preventScroll: !0 });
  }
  return { revealSegmentGroupForSelection: k, replaceSegmentSelection: I, selectSegment: L, selectSegmentCollection: R, selectAllVideoSegments: K };
}
function Nc(e) {
  const { acceptHistory: t, acquireSaveLock: r, compatibilityMode: o, detail: i, detailPanelRef: a, getSaveQueueSnapshot: s, historyRef: l, onConflict: d, onDetailChange: c, onReload: g, pendingReviewStateRef: u, recordHistoryAction: f, revealSegmentGroupForSelection: m, savingSegmentId: p, selectedGroups: b, selectedSegment: y, selectedSegmentIdRef: w, selectedSegments: k, selectionAnchorIdRef: I, selectionRangeBaseIdsRef: L, setMergeConfirmation: R, setSaveMessage: K, setSelectedSegmentId: v, setSelectedSegmentIds: A, video: $ } = e;
  function D() {
    R(null), requestAnimationFrame(() => {
      var q;
      return (q = a.current) == null ? void 0 : q.focus({ preventScroll: !0 });
    });
  }
  async function W(q = !1, C = !1, P = null) {
    if (p != null) return;
    const G = P || xi(
      b,
      { nativeOnly: !o }
    );
    if (!G) {
      K("Select at least two segments from one swimlane.");
      return;
    }
    if (!q && qa()) {
      R(G);
      return;
    }
    C && Wa(!1);
    const te = r("merge", G.segments[0].id);
    if (!te) return;
    D();
    const ce = G.endSec == null ? "open end" : Ae(G.endSec);
    let z = G.segments[0];
    const se = o ? null : wt(G.segments, !1), H = o ? null : crypto.randomUUID(), ae = G.segments.map((xe) => xe.id), ge = Fd(i, G.segments);
    c(ge, $.id), A([z.id]), v(z.id), I.current = z.id, L.current = [];
    try {
      const xe = G.segments.slice(1);
      if (!o || z.nativeSegmentId != null) {
        const oe = xe.map((B) => {
          const ue = `merge-native-selection:${$.id}:${z.id}:${B.id}:${z.updatedAt}:${B.updatedAt}`;
          return { key: ue, operationId: Fe(ue), segmentId: B.id, expectedUpdatedAt: B.updatedAt };
        }), he = await Z(`/videos/${$.id}/segments/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorSegmentId: z.id,
            expectedSurvivorUpdatedAt: z.updatedAt,
            consumedSegments: oe.map(({ key: B, ...ue }) => ue),
            historyReceiptId: H
          })
        });
        z = he.survivor, c((B) => ua(B, he), $.id), oe.forEach(({ key: B }) => Ue(B));
      } else {
        const oe = xe.map((B) => {
          const ue = `merge-draft-selection:${$.id}:${z.itemId}:${B.itemId}:${z.revision}:${B.revision}`;
          return { key: ue, operationId: Fe(ue), itemId: B.itemId, expectedRevision: B.revision };
        }), he = await Z(`/videos/${$.id}/drafts/merge-selection`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            survivorItemId: z.itemId,
            expectedSurvivorRevision: z.revision,
            consumedDrafts: oe.map(({ key: B, ...ue }) => ue)
          })
        });
        z = he.survivor, c((B) => ua(B, he), $.id), oe.forEach(({ key: B }) => Ue(B));
      }
      A([z.id]), v(z.id), I.current = z.id, L.current = [], o ? t(Ut) : await f(
        "segments.merge",
        `Merged ${G.segments.length} segments`,
        se,
        wt([z], !1),
        H
      ), m(z.id), K(`${G.segments.length} segments merged into ${Ae(G.startSec)} – ${ce}.`);
    } catch (xe) {
      c((oe) => wi(
        hr(oe, [G.segments[0]], [
          "startSec",
          "endSec",
          "sourceKey",
          "sourceRunId",
          "confidence",
          "isDerived"
        ]),
        G.segments.slice(1)
      ), $.id), A(ae), v((y == null ? void 0 : y.id) ?? ae[0] ?? null), I.current = (y == null ? void 0 : y.id) ?? ae[0] ?? null, L.current = [], xe.status === 409 ? await d() : K(xe.message || "Unable to merge selected segments.");
    } finally {
      te();
    }
  }
  async function ee(q, C = k, P = y) {
    var xe;
    if (C.length === 0) return;
    const G = s();
    if (Qr(G, "review")) return;
    if (ur(G) != null) {
      u.current.push(bl(
        q,
        C,
        P
      )), K(`${q === "approved" ? "Approval" : "Rejection"} queued…`);
      return;
    }
    const te = yl(C, q), ce = C.filter((oe) => oe.reviewState !== te);
    if (ce.length === 0) return;
    const z = C.map((oe) => ({
      id: oe.id,
      itemId: oe.itemId,
      nativeSegmentId: oe.nativeSegmentId
    })), se = z.find((oe) => oe.id === (P == null ? void 0 : P.id)) || z[0], H = (oe, he = !1) => {
      if (!(oe != null && oe.segments) || !he && !Xr(w.current, se.id))
        return;
      const B = z.map((re) => Je(oe == null ? void 0 : oe.segments, re)).filter(Boolean), ue = Je(oe == null ? void 0 : oe.segments, se) || B[0] || null;
      A(B.map((re) => re.id)), v((ue == null ? void 0 : ue.id) ?? null), I.current = (ue == null ? void 0 : ue.id) ?? null, L.current = [];
    }, ae = r("review", (P == null ? void 0 : P.id) ?? ce[0].id);
    if (!ae) return;
    K(`Updating ${ce.length} selected segment${ce.length === 1 ? "" : "s"}…`);
    const ge = ro(
      i,
      ce.map((oe) => oe.id),
      { reviewState: te }
    );
    c(ge, $.id);
    try {
      const oe = await Z(`/videos/${$.id}/segments/review-state`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: crypto.randomUUID(),
          expectedHistoryRevision: l.current.revision,
          reviewState: te,
          segments: C.map((re) => re.published ? {
            nativeSegmentId: re.nativeSegmentId,
            expectedUpdatedAt: re.updatedAt
          } : {
            itemId: re.itemId,
            expectedRevision: re.revision
          })
        })
      }), he = new Map((oe.items || []).map((re) => [
        re.requestedNativeSegmentId != null ? `native:${re.requestedNativeSegmentId}` : `item:${re.requestedItemId}`,
        re
      ]));
      if (z.forEach((re) => {
        const X = he.get(re.nativeSegmentId != null ? `native:${re.nativeSegmentId}` : `item:${re.itemId}`);
        X && (re.nativeSegmentId = X.nativeSegmentId, re.itemId = X.itemId);
      }), oe.history && t(oe.history), te === "rejected" || (oe.items || []).some((re) => re.requestedNativeSegmentId != null && re.nativeSegmentId !== re.requestedNativeSegmentId)) {
        H(await g()), K(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${te === "rejected" ? "rejected" : "reset to unreviewed"}.`);
        return;
      }
      const ue = (re) => ({
        ...re,
        approvedSetVersion: oe.approvedSetVersion || re.approvedSetVersion,
        segments: (re.segments || []).map((X) => {
          const be = he.get(X.nativeSegmentId != null ? `native:${X.nativeSegmentId}` : `item:${X.itemId}`);
          return be ? {
            ...X,
            id: be.nativeSegmentId != null ? be.nativeSegmentId : -be.itemId,
            itemId: be.itemId,
            nativeSegmentId: be.nativeSegmentId,
            published: be.nativeSegmentId != null,
            reviewState: te,
            revision: be.nativeSegmentId != null ? X.revision : be.revision,
            updatedAt: be.updatedAt
          } : X;
        })
      });
      c(ue, $.id), H(ue(i)), K(`${oe.updatedCount} selected segment${oe.updatedCount === 1 ? "" : "s"} ${te === "approved" ? "approved" : te === "rejected" ? "rejected" : "reset to unreviewed"}.`);
    } catch (oe) {
      c((B) => hr(
        B,
        ce,
        ["reviewState"]
      ), $.id), oe.status === 409 && ((xe = oe.payload) != null && xe.currentHistory) && t(oe.payload.currentHistory);
      const he = oe.status === 409 ? await d() : i;
      H(he, !0), K(oe.message || "Unable to update the selected segments.");
    } finally {
      ae();
    }
  }
  return { closeMergeConfirmation: D, mergeSelectedSwimlane: W, saveSelectedReviewState: ee };
}
function Ic(e) {
  const { acceptHistory: t, acquireSaveLock: r, allSwimlanes: o, autoAssignCandidates: i, autoAssigning: a, binEmptyingRef: s, canMoveSelectionToBin: l, closeTagEditing: d, compatibilityMode: c, creatingSegmentId: g, detail: u, editorFilters: f, editorRef: m, exportingExamples: p, hideDerivedSegments: b, heldCreatedSegmentTag: y, incorrectExamples: w, lineage: k, materializeButtonRef: I, materializePreview: L, materializeRestoreFocusRef: R, materializing: K, mutateSegment: v, onConflict: A, onDetailChange: $, onReload: D, performerSlots: W, recordHistoryAction: ee, refreshMaterializationPreview: q, removingExampleId: C, revealSegmentGroupForSelection: P, savingSegmentId: G, segmentGroups: te, segments: ce, selectedSegment: z, selectedSegmentIdRef: se, selectedSegments: H, selectionAnchorIdRef: ae, selectionRangeBaseIdsRef: ge, setAutoAssignError: xe, setAutoAssignOpen: oe, setAutoAssigning: he, setEditorFilters: B, setExportingExamples: ue, setHeldCreatedSegmentTag: re, setHideDerivedSegments: X, setIncorrectExamples: be, setMaterializeError: V, setMaterializeLoading: ie, setMaterializeOpen: T, setMaterializePreview: h, setMaterializing: x, setRejectedDeletionPreview: S, setRemovingExampleId: N, setSaveMessage: E, setSelectedSegmentGroupKey: J, setSelectedSegmentId: U, setSelectedSegmentIds: pe, video: M } = e;
  async function Y() {
    var Ce, Xe, Oe;
    if (H.length === 0 || !z || G != null) return;
    const Q = Md(H, w), de = Q.segments;
    if (de.length === 0) return;
    const Ee = H.map((Pe) => ({
      id: Pe.id,
      itemId: Pe.itemId,
      nativeSegmentId: Pe.nativeSegmentId
    })), Be = Ee.find((Pe) => Pe.id === z.id) || Ee[0], ve = [], We = [];
    let ze = !1, Ie = u, Se = !1;
    const Ge = [], _e = r("feedback", Be.id);
    if (_e) {
      E(Q.action === "remove" ? `Removing ${de.length} selected incorrect example${de.length === 1 ? "" : "s"}…` : `Collecting ${de.length} selected segment${de.length === 1 ? "" : "s"} as incorrect AI feedback…`);
      try {
        const Pe = async (Te, $e) => {
          const Ve = Te.nativeSegmentId != null, ht = Q.action === "remove" ? `incorrect-example-remove:${M.id}:${$e == null ? void 0 : $e.id}:${$e == null ? void 0 : $e.revision}:${$e == null ? void 0 : $e.representationRevision}` : `incorrect-example-collect:${M.id}:${Ve ? `native:${Te.nativeSegmentId}:${Te.updatedAt}` : `item:${Te.itemId}:${Te.revision}`}`;
          if (Q.action === "remove" && !$e)
            throw new Error("The incorrect-example collection changed. Reload and try again.");
          let st;
          try {
            st = Q.action === "remove" ? await Z(
              `/videos/${M.id}/incorrect-examples/${$e.id}/remove`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  operationId: Fe(ht),
                  expectedExampleRevision: $e.revision,
                  expectedRepresentationRevision: $e.representationRevision
                })
              }
            ) : await Z(`/videos/${M.id}/incorrect-examples/collect`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                operationId: Fe(ht),
                nativeSegmentId: Ve ? Te.nativeSegmentId : null,
                itemId: Ve ? null : Te.itemId,
                expectedUpdatedAt: Ve ? Te.updatedAt : null,
                expectedRevision: Ve ? null : Te.revision
              })
            });
          } catch (zt) {
            throw zt.operationKey = ht, zt;
          }
          if (!Ed(Q.action, st))
            throw new Error("The server returned an unexpected incorrect-example state. Reload and try again.");
          return Ue(ht), st;
        };
        for (const Te of de) {
          const $e = Q.action === "remove" ? w.find((Ve) => Ve.itemId != null && Ve.itemId === Te.itemId) : null;
          try {
            const Ve = Ee.find((lt) => lt.id === Te.id);
            let ht = Je(
              Ie == null ? void 0 : Ie.segments,
              Ve
            ) || Te, st;
            try {
              st = await Pe(ht, $e);
            } catch (lt) {
              if (lt.status === 409 && ((Xe = (Ce = lt.payload) == null ? void 0 : Ce.result) == null ? void 0 : Xe.code) === "OPERATION_REPLAYED")
                Ie = await Z(
                  `/videos/${M.id}/editor`
                ), Se = !0, Ge.length = 0, Ue(lt.operationKey), st = lt.payload.result;
              else {
                if (Q.action !== "collect" || lt.status !== 409) throw lt;
                const ut = await Z(
                  `/videos/${M.id}/editor`
                );
                Ie = ut, Se = !0, Ge.length = 0;
                const Dt = Je(
                  ut == null ? void 0 : ut.segments,
                  Ve
                );
                if (!Dt) throw lt;
                ht = Dt, st = await Pe(ht, null);
              }
            }
            Ve && st.itemId != null && (Ve.itemId = st.itemId), Ie = mr(
              Ie,
              st.editorDelta
            ), Ge.push(st.editorDelta);
            const zt = { segment: Te, result: st, example: $e };
            ve.push(zt);
          } catch (Ve) {
            if (We.push(Ve), ![400, 404, 409].includes(Ve.status)) break;
          }
        }
        if (c && ve.length > 0) {
          const Te = Q.action === "remove", $e = ve.length;
          await ee(
            Te ? "feedback.remove" : "feedback.collect",
            Te ? `Removed ${$e} incorrect AI example${$e === 1 ? "" : "s"}` : `Collected ${$e} incorrect AI example${$e === 1 ? "" : "s"}`,
            sr(ve, Te),
            sr(ve, !Te)
          ) || (ze = !0);
        }
        ve.some(({ result: Te }) => Te.representation === "basicNativeBin") && Un();
        const Re = Xr(
          se.current,
          Be.id
        ), He = Q.action === "collect" && ve.some(({ segment: Te }) => Te.id === Be.id), Mt = ve.map(({ segment: Te }) => Te.id), Le = He ? Js(
          o,
          Mt,
          Be.id
        ) : null, Et = He ? (Le == null ? void 0 : Le.id) ?? null : Be.id;
        Re && He && (pe(Le ? [Le.id] : []), U((Le == null ? void 0 : Le.id) ?? fr), ae.current = (Le == null ? void 0 : Le.id) ?? null, ge.current = []);
        const Sn = await Z(`/videos/${M.id}/incorrect-examples`);
        be(Sn);
        const it = Ie;
        if ($(Se ? it : (Te) => Ge.reduce(mr, Te), M.id), Re && Xr(
          se.current,
          Et
        )) {
          let Te, $e;
          He ? ($e = Le ? Je(it == null ? void 0 : it.segments, {
            id: Le.id,
            itemId: Le.itemId,
            nativeSegmentId: Le.nativeSegmentId
          }) : null, Te = $e ? [$e] : []) : (Te = Ee.map((Ve) => Je(it == null ? void 0 : it.segments, Ve)).filter(Boolean), $e = Je(it == null ? void 0 : it.segments, Be) || Te[0] || null), pe(Te.map((Ve) => Ve.id)), U(($e == null ? void 0 : $e.id) ?? (He ? fr : null)), ae.current = ($e == null ? void 0 : $e.id) ?? null, ge.current = [], J($e ? Tt(o, $e.id) : null), $e && P($e.id);
        }
        if (We.length > 0) {
          const Te = ((Oe = We[0]) == null ? void 0 : Oe.message) || "Only segments with registered AI provenance can be collected.";
          ve.length === 0 ? E(Te) : Q.action === "remove" ? E(
            `Partially removed ${ve.length} of ${de.length} selected incorrect examples. ${Te}`
          ) : E(
            `Partially collected ${ve.length} of ${de.length} selected segments. ${Te}`
          );
        } else if (Q.action === "remove")
          E(
            `${ve.length} incorrect example${ve.length === 1 ? "" : "s"} removed and ${ve.length === 1 ? "segment returned" : "segments returned"} to unreviewed.`
          );
        else {
          const Te = ve.filter(({ result: $e }) => $e.representation === "basicNativeBin").length;
          E(Te === ve.length ? `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and moved to the recycling bin.` : `${ve.length} incorrect AI example${ve.length === 1 ? "" : "s"} collected and ${ve.length === 1 ? "segment rejected" : "segments rejected"}.`);
        }
        ze && E("The change saved, but editor history could not be updated.");
      } catch (Pe) {
        E(Pe.message || "Unable to update the selected incorrect examples.");
      } finally {
        _e();
      }
    }
  }
  async function _(Q) {
    var Ee, Be;
    if (!Q || C != null || p) return;
    N(Q.id);
    const de = `incorrect-example-remove:${M.id}:${Q.id}:${Q.revision}:${Q.representationRevision}`;
    try {
      let ve, We = !1;
      try {
        ve = await Z(
          `/videos/${M.id}/incorrect-examples/${Q.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(de),
              expectedExampleRevision: Q.revision,
              expectedRepresentationRevision: Q.representationRevision
            })
          }
        );
      } catch (Se) {
        if (Se.status !== 409 || ((Be = (Ee = Se.payload) == null ? void 0 : Ee.result) == null ? void 0 : Be.code) !== "OPERATION_REPLAYED")
          throw Se;
        ve = Se.payload.result, We = !0;
      }
      Ue(de);
      let ze = !0;
      if (c) {
        const Ge = [{ segment: Je(u.segments, {
          itemId: Q.itemId
        }) || {
          id: Q.itemId == null ? null : -Q.itemId,
          itemId: Q.itemId,
          nativeSegmentId: null,
          published: !1,
          revision: Q.representationRevision
        }, result: ve, example: Q }];
        ze = await ee(
          "feedback.remove",
          "Removed 1 incorrect AI example",
          sr(Ge, !0),
          sr(Ge, !1)
        );
      }
      const Ie = await Z(
        `/videos/${M.id}/incorrect-examples`
      );
      be(Ie), We ? await D() : $(
        (Se) => mr(Se, ve.editorDelta),
        M.id
      ), Q.representation === "basicNativeBin" && Un(), E(ze ? We ? c ? "Incorrect example removal was already applied and added to history." : "Incorrect example removal was already applied." : Q.representation === "basicNativeBin" ? "Incorrect example removed and its native segment restored." : "Incorrect example removed and segment returned to unreviewed." : "The change saved, but editor history could not be updated.");
    } catch (ve) {
      ve.status === 409 && await A(), E(ve.message || "Unable to remove the incorrect example.");
    } finally {
      N(null);
    }
  }
  async function me() {
    if (p || C != null || w.length === 0) return;
    ue(!0);
    const Q = `incorrect-example-export:${M.id}:${w.map((de) => `${de.id}:${de.revision}:${de.representationRevision}`).join(",")}`;
    try {
      const de = await Od(
        M.id,
        w
      ), Ee = new FormData();
      Ee.append("metadata", JSON.stringify({
        operationId: Fe(Q),
        examples: de.captures
      }));
      for (const Se of de.files)
        Ee.append(Se.fieldName, Se.file);
      const Be = await Z(
        `/videos/${M.id}/incorrect-examples/export`,
        { method: "POST", body: Ee }
      ), ve = await Ql(Be.downloadUrl), We = URL.createObjectURL(ve.blob), ze = document.createElement("a");
      ze.href = We, ze.download = ve.fileName, ze.click(), setTimeout(() => URL.revokeObjectURL(We), 1e3);
      const Ie = await Z(
        `/training-exports/${Be.id}/complete`,
        { method: "POST" }
      );
      Ue(Q), be(await Z(
        `/videos/${M.id}/incorrect-examples`
      )), E(
        `Downloaded ${Be.exampleCount} incorrect example${Be.exampleCount === 1 ? "" : "s"} in an AI Feedback ZIP and cleared ${Ie.clearedExampleCount} from the working collection.`
      );
    } catch (de) {
      E(de.message || "Unable to capture and download the training export. The working collection was kept.");
    } finally {
      ue(!1);
    }
  }
  async function Me(Q = null) {
    const de = ce.filter((_e) => _e.reviewState === "rejected"), Ee = de.length, Be = w.some((_e) => _e.representation === "fullItem");
    if (Q == null && Ee === 0 && !Be) {
      E("There are no rejected segments to delete.");
      return;
    }
    if (Q == null) {
      const _e = r("delete-rejected", -1);
      if (!_e) return;
      E("Preparing deletion summary…");
      try {
        const Ce = await Z(`/videos/${M.id}/rejected/deletion/preview`, { method: "POST" }), Xe = Number(Ce.deletedSegmentCount) || 0, Oe = Number(Ce.deferredRejectedSegmentCount) || 0, Pe = Number(Ce.protectedIncorrectExampleCount) || 0;
        if (Xe === 0) {
          Oe > 0 ? E(
            `${Oe} feedback-protected rejected segment${Oe === 1 ? "" : "s"} kept. ${Pe} AI feedback example${Pe === 1 ? "" : "s"} must be exported before ${Oe === 1 ? "this segment can" : "these segments can"} be deleted.`
          ) : E("There are no rejected segments to delete.");
          return;
        }
        if (!ui(Ce, E)) return;
        S(Ce), E("");
      } catch (Ce) {
        E(Ce.message || "Unable to prepare rejected segment deletion.");
      } finally {
        _e();
      }
      return;
    }
    const ve = Q, We = Number(ve.deferredRejectedSegmentCount) || 0, ze = se.current, Ie = We === 0 ? oo(u, de.map((_e) => _e.id)) : u, Se = Ie.segments.find((_e) => _e.reviewState === "unreviewed") || Ie.segments[0] || null, Ge = r("delete-rejected", -1);
    if (Ge) {
      S(null), E("Deleting rejected segments…"), We === 0 && ($(Ie, M.id), pe(Se ? [Se.id] : []), U((Se == null ? void 0 : Se.id) ?? null), ae.current = (Se == null ? void 0 : Se.id) ?? null, ge.current = []);
      try {
        const _e = `rejected-dependency-delete:${M.id}:${ve.fingerprint}`, Ce = await Z(`/videos/${M.id}/rejected/deletion/execute`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(_e),
            fingerprint: ve.fingerprint
          })
        });
        Ue(_e), await D(), Ce.deletedSegmentCount > 0 && t(Ut);
        const Xe = We > 0 ? ` ${We} feedback-protected rejected segment${We === 1 ? " was" : "s were"} kept for a later post-export batch.` : "";
        E(`${Ce.deletedSegmentCount} segment${Ce.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.${Xe}`);
      } catch (_e) {
        We === 0 && $((Ce) => wi(
          Ce,
          de
        ), M.id), pe(ze == null ? [] : [ze]), U(ze), ae.current = ze, ge.current = [], E(_e.message || "Unable to delete rejected segments.");
      } finally {
        Ge();
      }
    }
  }
  async function Ne(Q = i) {
    if (!(a || Q.length === 0)) {
      he(!0), xe("");
      try {
        const de = await Z(`/videos/${M.id}/segments/auto-assign-performer-slots`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            nativeSegmentIds: Q.flatMap((Ee) => Ee.nativeSegmentId == null ? [] : [Ee.nativeSegmentId]),
            itemIds: Q.flatMap((Ee) => Ee.published || Ee.itemId == null ? [] : [Ee.itemId])
          })
        });
        oe(!1), await D(), E(`${de.assignedSegmentCount} segment${de.assignedSegmentCount === 1 ? "" : "s"} received ${de.assignedSlotCount} performer-slot assignment${de.assignedSlotCount === 1 ? "" : "s"}.`);
      } catch (de) {
        xe(de.message || "Unable to auto-assign performers.");
      } finally {
        he(!1);
      }
    }
  }
  async function ke() {
    T(!0), V(""), !L && (ie(!0), q());
  }
  function rt() {
    R.current = !0, T(!1), requestAnimationFrame(() => {
      var Q;
      return (Q = I.current) == null ? void 0 : Q.focus({ preventScroll: !0 });
    });
  }
  async function Ye() {
    if (!L || K || L.createCount + L.linkCount === 0)
      return;
    x(!0), V("");
    let Q;
    try {
      const de = `materialize-derived:${M.id}:${L.fingerprint}`;
      Q = await Z(`/videos/${M.id}/derived-segments/materialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(de),
          fingerprint: L.fingerprint,
          maxDepth: 3
        })
      }), Ue(de);
    } catch (de) {
      de.status === 409 && h(null), V(de.message || "Unable to materialize derived segments."), x(!1);
      return;
    }
    h((de) => de && { ...de, createCount: 0, linkCount: 0 });
    try {
      await D(), rt(), h(null);
      const de = Q.createdCount + Q.linkedCount;
      E(`${Q.createdCount} derived segment${Q.createdCount === 1 ? "" : "s"} created and ${Q.linkedCount} existing segment${Q.linkedCount === 1 ? "" : "s"} linked.`), de === 0 && E("Every applicable derivation was already materialized.");
    } catch {
      V("Derived segments were materialized, but the editor could not refresh. Close this dialog and reload Segment Studio.");
    }
    x(!1);
  }
  async function we(Q, de = null) {
    var Be, ve, We, ze;
    const Ee = {
      tagId: Q,
      ...de ? { tagName: de } : {},
      // The previous tag's sort name would misplace the destination lane until the reload.
      tagSortName: null
    };
    if (H.length > 1) {
      const Ie = H.filter((Oe) => Oe.tagId !== Q);
      if (Ie.length === 0) {
        d();
        return;
      }
      const Se = H.map((Oe) => ({
        id: Oe.id,
        itemId: Oe.itemId,
        nativeSegmentId: Oe.nativeSegmentId
      })), Ge = H.map((Oe) => !c || Oe.nativeSegmentId != null ? `native:${Oe.nativeSegmentId}:${Oe.updatedAt}` : `item:${Oe.itemId}:${Oe.revision}`).sort().join(","), _e = `bulk-tag:${M.id}:${Q}:${Ge}`, Ce = r("tag", (z == null ? void 0 : z.id) ?? Ie[0].id);
      if (!Ce) return;
      E(`Changing tag for ${Ie.length} selected segment${Ie.length === 1 ? "" : "s"}…`);
      const Xe = ro(
        u,
        Ie.map((Oe) => Oe.id),
        Ee
      );
      $(Xe, M.id), d();
      try {
        const Oe = c ? null : crypto.randomUUID();
        await Z(`/videos/${M.id}/segments/tag`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(_e),
            tagId: Q,
            historyReceiptId: Oe,
            segments: H.map((Le) => {
              const Et = !c || Le.nativeSegmentId != null;
              return {
                nativeSegmentId: Et ? Le.nativeSegmentId : null,
                itemId: Et ? null : Le.itemId,
                expectedUpdatedAt: Et ? Le.updatedAt : null,
                expectedRevision: Et ? null : Le.revision
              };
            })
          })
        }), Ue(_e);
        const Pe = wt(
          H,
          c
        ), Re = await D(), He = Se.map((Le) => Je(Re == null ? void 0 : Re.segments, Le)).filter(Boolean);
        await ee(
          "segments.tag",
          `Changed tag for ${Ie.length} segment${Ie.length === 1 ? "" : "s"}`,
          Pe,
          wt(He, c),
          Oe
        );
        const Mt = Se.map((Le) => Je(Re == null ? void 0 : Re.segments, Le)).filter(Boolean);
        pe(Mt.map((Le) => Le.id)), U(((Be = Mt.find((Le) => Le.id === (z == null ? void 0 : z.id))) == null ? void 0 : Be.id) ?? ((ve = Mt[0]) == null ? void 0 : ve.id) ?? null), d(), E(`${Ie.length} selected segment${Ie.length === 1 ? "" : "s"} retagged.`);
      } catch (Oe) {
        $((He) => hr(
          He,
          Ie,
          Object.keys(Ee)
        ), M.id);
        const Pe = Se.map((He) => Je(u.segments, He)).filter(Boolean), Re = Je(u.segments, {
          id: z == null ? void 0 : z.id,
          itemId: z == null ? void 0 : z.itemId,
          nativeSegmentId: z == null ? void 0 : z.nativeSegmentId
        }) || Pe[0] || null;
        pe(Pe.map((He) => He.id)), U((Re == null ? void 0 : Re.id) ?? null), ae.current = (Re == null ? void 0 : Re.id) ?? null, ge.current = [], Oe.status === 409 && await A(), E(Oe.message || "Unable to change the selected segment tags.");
      } finally {
        Ce();
      }
      return;
    }
    if (!(H.length !== 1 || !z)) {
      if (z.id === g || (y == null ? void 0 : y.segmentId) === z.id) {
        const Ie = y != null, Se = Nl(y, z, Q, de);
        if (re(Se), Se) {
          const Ge = Va(
            { ...z, tagId: Se.tagId },
            W,
            f,
            b,
            te
          );
          B(Ge.filters), X(Ge.hideDerivedSegments), E("Tag change queued…");
        } else Ie && E("");
        d();
        return;
      }
      if (Q === z.tagId) {
        d();
        return;
      }
      if (z.itemId != null && ((ze = (We = k.data) == null ? void 0 : We.children) == null ? void 0 : ze.length) > 0) {
        const Ie = r("lineage-tag", z.id);
        if (!Ie) return;
        E("Checking lineage impact…");
        try {
          const Se = await Z(`/items/${z.itemId}/tag-change/preview`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ expectedRevision: z.revision, tagId: Q })
          }), Ge = Se.deletedItemIds.length > 0 || Se.removedEdgeIds.length > 0;
          if (Ge && !window.confirm(
            `Changing this tag removes ${Se.removedEdgeIds.length} lineage edge${Se.removedEdgeIds.length === 1 ? "" : "s"} and permanently deletes ${Se.deletedItemIds.length} derived segment${Se.deletedItemIds.length === 1 ? "" : "s"}. Continue?`
          )) {
            E("Tag change canceled.");
            return;
          }
          const _e = ro(
            u,
            [z.id],
            Ee
          );
          $(_e, M.id), d();
          const Ce = `tag-change:${z.itemId}:${z.revision}:${Se.componentFingerprint}:${Q}`;
          await Z(`/items/${z.itemId}/tag-change/execute`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Ce),
              expectedRevision: z.revision,
              componentFingerprint: Se.componentFingerprint,
              tagId: Q
            })
          }), Ue(Ce), await D(), d(), E(Ge ? "Tag changed and lineage reconciled." : "Tag changed.");
        } catch (Se) {
          $((Ge) => hr(
            Ge,
            [z],
            Object.keys(Ee)
          ), M.id), pe([z.id]), U(z.id), ae.current = z.id, ge.current = [], Se.status === 409 ? (E("Lineage changed — loading the latest segments…"), await A()) : E(Se.message || "Unable to reconcile the lineage.");
        } finally {
          Ie();
        }
        return;
      }
      d(), await v(z, {
        startSec: z.startSec,
        endSec: z.endSec,
        tagId: Q
      }, !0, null, !0, Ee);
    }
  }
  async function Ke(Q) {
    const de = ce.find((Be) => Be.id === Q.segmentId);
    if (!de) return;
    await v(de, {
      startSec: de.startSec,
      endSec: de.endSec,
      tagId: Q.tagId
    }, !0, null, !0, {
      tagId: Q.tagId,
      ...Q.tagName ? { tagName: Q.tagName } : {},
      tagSortName: null
    }, !1) || E(`The new segment was not retagged${Q.tagName ? ` to ${Q.tagName}` : ""}. Choose its tag again.`);
  }
  async function Qe() {
    var Ie, Se, Ge, _e;
    if (!l || !z || G != null) return;
    const Q = [...H].sort((Ce, Xe) => Number(Ce.nativeSegmentId ?? Ce.id) - Number(Xe.nativeSegmentId ?? Xe.id)), de = new Set(Q.map((Ce) => Ce.id)), Ee = Q.map((Ce) => `${Ce.nativeSegmentId ?? Ce.id}:${Ce.updatedAt}`).join("|"), Be = r("bin", z.id);
    if (!Be) return;
    E(`Moving ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin…`);
    const ve = `bulk-move:${M.id}:${Ee}`, We = Fe(ve), ze = c ? null : crypto.randomUUID();
    try {
      const Ce = (Re = !1) => Z(`/videos/${M.id}/segments/move-to-bin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: We,
          segments: Q.map((He) => ({
            segmentId: He.nativeSegmentId ?? He.id,
            expectedUpdatedAt: He.updatedAt
          })),
          discardMissingImage: Re,
          ...c ? { reviewState: "rejected" } : {},
          historyReceiptId: ze
        })
      });
      let Xe;
      try {
        Xe = await Ce(
          go(ve)
        );
      } catch (Re) {
        if (((Ie = Re.payload) == null ? void 0 : Ie.code) !== "missing-image" || !window.confirm(`${Re.message}

Continue and discard the missing image reference?`)) throw Re;
        po(ve), Xe = await Ce(!0);
      }
      Ue(ve), Un();
      const Oe = new Map((Xe.items || []).map((Re) => [
        Number(Re.segmentId),
        Re
      ]));
      await ee(
        "segments.moveToBin",
        `Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin`,
        wt(Q, !1),
        wt(Q.map((Re) => {
          const He = Oe.get(
            Number(Re.nativeSegmentId ?? Re.id)
          );
          return {
            ...Re,
            recycleBinItemId: (He == null ? void 0 : He.itemId) ?? null,
            nativeSegmentId: null,
            published: !1,
            revision: (He == null ? void 0 : He.revision) ?? null
          };
        }), !1),
        ze
      );
      const Pe = Vs(o, de, z.id);
      $((Re) => ({
        ...Re,
        segments: (Re.segments || []).filter((He) => !de.has(He.id))
      }), M.id), pe(Pe ? [Pe.id] : []), U((Pe == null ? void 0 : Pe.id) ?? null), ae.current = (Pe == null ? void 0 : Pe.id) ?? null, ge.current = [], Pe && (J(Tt(o, Pe.id)), P(Pe.id)), requestAnimationFrame(() => {
        var Re;
        return (Re = m.current) == null ? void 0 : Re.focus({ preventScroll: !0 });
      }), E(`Moved ${Q.length} segment${Q.length === 1 ? "" : "s"} to recycling bin.`);
    } catch (Ce) {
      const Xe = ((Se = Ce.payload) == null ? void 0 : Se.code) || ((_e = (Ge = Ce.payload) == null ? void 0 : Ge.result) == null ? void 0 : _e.code);
      Ce.status === 409 && Xe === "CANONICAL_SEGMENT_CHANGED" ? await A() : E(Ce.message || "Unable to move the selected segments to the recycling bin.");
    } finally {
      Be();
    }
  }
  async function je() {
    if (!(c || s.current || G != null)) {
      s.current = !0, E("Checking the recycling bin…");
      try {
        const Q = await Z("/bin"), de = await gi(Q, () => E("Emptying the recycling bin…"));
        if (de.status === "empty") {
          E("The recycling bin is empty.");
          return;
        }
        if (de.status === "canceled") {
          E("The recycling bin was not emptied.");
          return;
        }
        E(`${de.segmentCount} segment${de.segmentCount === 1 ? "" : "s"} from ${de.sceneCount} scene${de.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (Q) {
        E(Q.message || "Unable to empty the recycling bin.");
      } finally {
        s.current = !1;
      }
    }
  }
  return { toggleIncorrectExample: Y, removeIncorrectExample: _, captureTrainingExport: me, deleteRejectedSegments: Me, autoAssignPerformers: Ne, previewDerivedSegments: ke, closeMaterializeDialog: rt, materializeDerivedSegments: Ye, saveTag: we, applyHeldCreatedSegmentTag: Ke, moveToBin: Qe, emptyRecyclingBin: je };
}
function Cc(e) {
  const { acceptHistory: t, acquireSaveLock: r, commonActionsRef: o, compatibilityMode: i, currentTime: a, detail: s, editorLayout: l, focusRowRef: d, history: c, historyRef: g, historySaving: u, horizontalLayoutSize: f, mediaStackHeight: m, mediaStackRef: p, onDetailChange: b, onReload: y, railToggleRef: w, recordHistoryAction: k, savingSegmentId: I, savingShot: L, savingShotRef: R, setCollapsedSegmentGroups: K, setEditorLayout: v, setHistorySaving: A, setIncorrectExamples: $, setSaveMessage: D, setSavingShot: W, shotBoundaries: ee, timelineDuration: q, video: C, workspaceRef: P } = e;
  async function G(T, h, x) {
    var J, U, pe, M;
    const S = T.type === "segment" ? [T] : T.segments || [], N = (h == null ? void 0 : h.type) === "segment" ? [h] : (h == null ? void 0 : h.segments) || [];
    let E = x;
    for (const [Y, _] of S.entries()) {
      const me = N[Y], Me = ((J = _.identity) == null ? void 0 : J.nativeSegmentId) != null || ((U = _.identity) == null ? void 0 : U.published) === !0, Ne = ((pe = me == null ? void 0 : me.identity) == null ? void 0 : pe.recycleBinItemId) ?? ((M = me == null ? void 0 : me.identity) == null ? void 0 : M.itemId);
      let ke = Je(E.segments, me == null ? void 0 : me.identity) || Je(E.segments, _.identity);
      if (!ke && Me && Ne != null && me.identity.revision != null) {
        const we = `history-restore:${C.id}:${Ne}:${me.identity.revision}`;
        await Z(`/bin/${Ne}/restore`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(we),
            expectedRevision: me.identity.revision
          })
        }), Ue(we), E = await y(), ke = E.segments.find((Ke) => Ke.tagId === _.values.tagId && Ke.startSec === _.values.startSec && Ke.endSec === _.values.endSec);
      }
      if (!ke)
        throw new Error("A segment in this history state no longer exists.");
      if ((ke.nativeSegmentId != null || ke.published === !0) !== Me) {
        if (Me) {
          const we = ke.recycleBinItemId ?? ke.itemId ?? Ne;
          if (we == null)
            throw new Error("This recycled segment can no longer be restored.");
          const Ke = `history-restore:${C.id}:${we}:${ke.revision}:${_.values.reviewState ?? "native"}`;
          await Z(`/bin/${we}/restore`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(Ke),
              expectedRevision: ke.revision
            })
          }), Ue(Ke);
        } else {
          const we = `history-bin:${C.id}:${ke.nativeSegmentId}:${ke.updatedAt}:${_.values.reviewState}`;
          await Z(`/videos/${C.id}/segments/${ke.nativeSegmentId}/move-to-bin`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(we),
              expectedUpdatedAt: ke.updatedAt,
              reviewState: _.values.reviewState
            })
          }), Ue(we);
        }
        if (E = await y(), !Me)
          continue;
        if (ke = Je(E.segments, _.identity) || E.segments.find((we) => we.tagId === _.values.tagId && we.startSec === _.values.startSec && we.endSec === _.values.endSec), !ke)
          throw new Error("The restored segment could not be found.");
      }
      const Ye = _.values;
      if (ke.nativeSegmentId == null && ke.itemId != null) {
        const we = `history-draft-update:${C.id}:${ke.itemId}:${ke.revision}:${Ye.tagId}:${Ye.startSec}:${Ye.endSec ?? "open"}:${Ye.reviewState}`;
        await Z(`/videos/${C.id}/drafts/${ke.itemId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(we),
            expectedRevision: ke.revision,
            ...Ye
          })
        }), Ue(we);
      } else
        await Z(`/videos/${C.id}/segments/${ke.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...Ye, expectedUpdatedAt: ke.updatedAt })
        });
      E = await y();
    }
    return E;
  }
  async function te(T, h) {
    var x;
    for (const S of T.targets || []) {
      const N = Je(h.segments, S.identity);
      if (!N)
        throw new Error("A segment in this performer-assignment history no longer exists.");
      const E = (x = h.performerSlotRevisions) == null ? void 0 : x[N.id];
      await Z(N.published ? `/videos/${C.id}/segments/${N.nativeSegmentId}/slots` : `/videos/${C.id}/drafts/${N.itemId}/slots`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          revision: E,
          assignments: S.assignments
        })
      }), h = await y();
    }
    return h;
  }
  async function ce(T, h, x) {
    if (!i)
      throw new Error("AI feedback history is only available in Full mode.");
    let S = h, N = await Z(`/videos/${C.id}/incorrect-examples`);
    const E = (J) => N.find((U) => {
      var pe;
      return U.id === J.exampleId || ((pe = J.collectedIdentity) == null ? void 0 : pe.itemId) != null && U.itemId === J.collectedIdentity.itemId;
    });
    for (const [J, U] of (T.entries || []).entries()) {
      const pe = `history-feedback:${C.id}:${x.action.sequence}:${x.direction}:${J}`, M = E(U);
      if (T.collected && M) {
        Ue(pe);
        continue;
      }
      let Y;
      if (T.collected) {
        const _ = Je(
          S.segments,
          U.collectedIdentity
        ) || Je(
          S.segments,
          U.originalIdentity
        );
        if (!_)
          throw new Error("A segment in this AI feedback history no longer exists.");
        const me = _.nativeSegmentId != null;
        Y = await Z(`/videos/${C.id}/incorrect-examples/collect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: Fe(pe),
            nativeSegmentId: me ? _.nativeSegmentId : null,
            itemId: me ? null : _.itemId,
            expectedUpdatedAt: me ? _.updatedAt : null,
            expectedRevision: me ? null : _.revision
          })
        });
      } else {
        if (!M) {
          Ue(pe);
          continue;
        }
        Y = await Z(
          `/videos/${C.id}/incorrect-examples/${M.id}/remove`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              operationId: Fe(pe),
              expectedExampleRevision: M.revision,
              expectedRepresentationRevision: M.representationRevision
            })
          }
        );
      }
      Ue(pe), S = mr(
        S,
        Y.editorDelta
      ), N = await Z(
        `/videos/${C.id}/incorrect-examples`
      );
    }
    return $(N), S;
  }
  async function z(T, h, x = []) {
    const S = T.state;
    if (!i && ((S == null ? void 0 : S.type) === "segment" || (S == null ? void 0 : S.type) === "segments")) {
      const E = `basic-history:${C.id}:${g.current.revision}:${T.action.sequence}:${T.direction}`, J = await Z(`/videos/${C.id}/history/native-state`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(E),
          expectedHistoryRevision: g.current.revision,
          actionSequence: T.action.sequence,
          direction: T.direction
        })
      });
      return t(J.history), x.push(E), y();
    }
    const N = T.direction === "backward" ? T.action.afterState : T.action.beforeState;
    if ((S == null ? void 0 : S.type) === "composite") {
      let E = h;
      const J = (N == null ? void 0 : N.type) === "composite" ? N.states || [] : [];
      for (const [U, pe] of (S.states || []).entries()) {
        const M = J[U];
        E = await z({
          ...T,
          state: pe,
          action: {
            ...T.action,
            beforeState: T.direction === "backward" ? pe : M,
            afterState: T.direction === "backward" ? M : pe
          }
        }, E, x);
      }
      return E;
    }
    if ((S == null ? void 0 : S.type) === "segment" || (S == null ? void 0 : S.type) === "segments")
      return G(
        S,
        N,
        h
      );
    if ((S == null ? void 0 : S.type) === "performerSlots")
      return te(S, h);
    if ((S == null ? void 0 : S.type) === "incorrectExamples")
      return ce(S, h, T);
    if ((S == null ? void 0 : S.type) === "shots") {
      const E = Gn(h.shotBoundaries || []), J = await Z(`/videos/${C.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(`history-shots:${C.id}:${E}:${S.fingerprint}`),
          expectedFingerprint: E,
          boundaries: S.boundaries
        })
      });
      return { ...h, shotBoundaries: J };
    }
    throw new Error("This history action cannot be restored.");
  }
  async function se(T) {
    var S;
    if (u || I != null || L || T === c.cursorSequence)
      return;
    const h = ud(c, T);
    if (h.length === 0) return;
    const x = r("history", -1);
    if (x) {
      A(!0), D(`Restoring ${h.length} history ${h.length === 1 ? "action" : "actions"}…`);
      try {
        let N = s;
        const E = [];
        for (const U of h)
          N = await z(
            U,
            N,
            E
          );
        const J = i ? await Z(`/videos/${C.id}/history/cursor`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operationId: crypto.randomUUID(),
            expectedRevision: g.current.revision,
            targetSequence: T
          })
        }) : g.current;
        E.forEach(Ue), t(J), await y(), D("History restored.");
      } catch (N) {
        N.status === 409 && ((S = N.payload) != null && S.current) && t(N.payload.current), await y(), D(N.message || "Unable to restore editor history.");
      } finally {
        x(), A(!1);
      }
    }
  }
  function H(T) {
    v((h) => ({ ...h, timelineRatio: uo(T, m) }));
  }
  function ae(T) {
    var S, N;
    const h = (S = p.current) == null ? void 0 : S.getBoundingClientRect();
    if (!h) return;
    const x = ((N = o.current) == null ? void 0 : N.offsetHeight) || 0;
    H(Os(
      T.clientY,
      h.top + x,
      Math.max(0, h.height - x)
    ));
  }
  function ge(T) {
    T.currentTarget.setPointerCapture(T.pointerId), ae(T);
  }
  function xe(T) {
    T.currentTarget.hasPointerCapture(T.pointerId) && ae(T);
  }
  function oe(T) {
    const h = T.shiftKey ? 0.1 : 0.05;
    let x = null;
    T.key === "ArrowUp" && (x = l.timelineRatio + h), T.key === "ArrowDown" && (x = l.timelineRatio - h);
    const S = co(m);
    T.key === "Home" && (x = S.minimum), T.key === "End" && (x = S.maximum), x != null && (T.preventDefault(), T.stopPropagation(), H(x));
  }
  function he(T) {
    const h = T === "detailWidth" ? f.focusRow : f.workspace, x = f.workspace > 0 ? Yr(f.workspace, 600) : 560, S = Xt(l.markerRailWidth, x), N = T === "detailWidth" ? 344 + (l.markerRailOpen ? S + 24 : 0) : 600;
    return h > 0 ? Yr(h, N) : 560;
  }
  function B(T, h) {
    v((x) => ({ ...x, [T]: Xt(h, he(T)) }));
  }
  function ue(T, h) {
    var S, N;
    const x = h === "detailWidth" ? (S = d.current) == null ? void 0 : S.getBoundingClientRect() : (N = P.current) == null ? void 0 : N.getBoundingClientRect();
    x && B(h, h === "detailWidth" ? T.clientX - x.left : x.right - T.clientX);
  }
  function re(T, h) {
    const x = he(T), S = Xt(l[T], x);
    return {
      role: "separator",
      tabIndex: 0,
      "aria-label": h,
      "aria-orientation": "vertical",
      "aria-valuemin": 240,
      "aria-valuemax": Math.round(x),
      "aria-valuenow": Math.round(S),
      "aria-valuetext": `${Math.round(S)} pixels wide`,
      title: "Drag or use Left/Right to resize · Shift for larger steps · double-click to reset",
      onPointerDown: (N) => {
        N.currentTarget.setPointerCapture(N.pointerId), ue(N, T);
      },
      onPointerMove: (N) => {
        N.currentTarget.hasPointerCapture(N.pointerId) && ue(N, T);
      },
      onKeyDown: (N) => {
        const E = N.shiftKey ? 40 : 16;
        let J = null;
        N.key === "ArrowLeft" && (J = T === "detailWidth" ? -E : E), N.key === "ArrowRight" && (J = T === "detailWidth" ? E : -E);
        let U = J == null ? null : S + J;
        N.key === "Home" && (U = 240), N.key === "End" && (U = x), U != null && (N.preventDefault(), N.stopPropagation(), B(T, U));
      },
      onDoubleClick: () => B(T, yt[T]),
      className: "hidden items-center justify-center rounded-sm hover:bg-muted/40 focus:outline-none focus:ring-2 focus:ring-accent lg:flex",
      style: { touchAction: "none", cursor: "col-resize" }
    };
  }
  function X() {
    v((T) => ({ ...T, markerRailOpen: !T.markerRailOpen })), requestAnimationFrame(() => {
      var T;
      return (T = w.current) == null ? void 0 : T.focus({ preventScroll: !0 });
    });
  }
  function be(T) {
    K((h) => h.includes(T) ? h.filter((x) => x !== T) : Vt([...h, T]));
  }
  async function V(T, h = !0, x = a) {
    var J;
    if (R.current) return null;
    const S = Number((J = C.videoFile) == null ? void 0 : J.duration) || q, N = Gn(ee), E = `shot-${T}:${C.id}:${x.toFixed(3)}:${S.toFixed(3)}:${N}`;
    R.current = !0, W(!0), D(T === "split" ? "Adding shot boundary…" : "Merging shots…");
    try {
      const U = await Z(`/videos/${C.id}/shot-boundaries/${T}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(T === "split" ? { operationId: Fe(E), timeSec: x } : { operationId: Fe(E), timeSec: x })
      });
      return Ue(E), b((pe) => ({ ...pe, shotBoundaries: U }), C.id), h && await k(
        "shots.update",
        T === "split" ? "Added shot boundary" : "Merged shots",
        {
          type: "shots",
          boundaries: ee,
          fingerprint: N
        },
        {
          type: "shots",
          boundaries: U,
          fingerprint: Gn(U)
        }
      ), D(T === "split" ? "Shot boundary added." : "Shots merged."), U;
    } catch (U) {
      return D(U.message || "Unable to edit shot boundaries."), null;
    } finally {
      R.current = !1, W(!1);
    }
  }
  async function ie(T) {
    if (R.current) return null;
    const h = `shot-restore:${C.id}:${T.afterFingerprint}`;
    R.current = !0, W(!0), D("Undoing shot edit…");
    try {
      const x = await Z(`/videos/${C.id}/shot-boundaries/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(h),
          expectedFingerprint: T.afterFingerprint,
          boundaries: T.before
        })
      });
      return Ue(h), b((S) => ({ ...S, shotBoundaries: x }), C.id), x;
    } catch (x) {
      return D(x.message || "Unable to undo the shot edit."), null;
    } finally {
      R.current = !1, W(!1);
    }
  }
  return { applySegmentHistoryState: G, applyPerformerSlotHistoryState: te, applyHistoryState: z, restoreHistoryTarget: se, updateTimelineRatio: H, updateTimelineRatioFromPointer: ae, handleSeparatorPointerDown: ge, handleSeparatorPointerMove: xe, handleSeparatorKeyDown: oe, panelWidthMaximum: he, updatePanelWidth: B, handlePanelSeparatorPointer: ue, panelSeparatorProps: re, toggleSegmentRail: X, toggleSegmentGroup: be, mutateShotBoundary: V, restoreShotBoundaries: ie };
}
function $c(e) {
  const { allSwimlanes: t, applyShortcutTiming: r, centerTimelineRef: o, compatibilityMode: i, createSegment: a, currentTime: s, deleteRejectedSegments: l, duplicateSegment: d, editorLayout: c, editorRef: g, emptyRecyclingBin: u, lineage: f, mediaDuration: m, mergeSelectedSwimlane: p, moveToBin: b, mutateShotBoundary: y, openPublishApprovedDialog: w, playbackControlsRef: k, playbackShortcutConfig: I, saveSelectedReviewState: L, seekRef: R, segmentGroupKeys: K, selectSegment: v, selectedSegment: A, selectedSegmentGroupForSegment: $, selectedSegmentGroupKey: D, selectedSegments: W, setCollapsedSegmentGroups: ee, setIncorrectExamplesOpen: q, setQuickSearchOpen: C, setSaveMessage: P, setSelectedSegmentGroupKey: G, setTagEditing: te, setTimelineZoom: ce, shotBoundaries: z, slotButtonRef: se, splitSegment: H, swimlanes: ae, timelineDuration: ge, toggleIncorrectExample: xe, toggleSegmentGroup: oe, updateTimelineRatio: he, videoFrameRate: B, visibleSegments: ue } = e;
  function re(V) {
    var ie, T;
    (ie = k.current) == null || ie.pause(), (T = k.current) == null || T.seekBy(Al(V, B));
  }
  function X(V, ie) {
    if (W.length > 1 && ul(V.id))
      return;
    let T = null;
    V.id === "video.playPause" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.toggle();
    }), V.id === "video.seekSmallBackward" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.seekBy(-I.smallSeekTime);
    }), V.id === "video.seekSmallForward" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.seekBy(I.smallSeekTime);
    }), V.id === "video.seekMediumBackward" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.seekBy(-I.mediumSeekTime);
    }), V.id === "video.seekMediumForward" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.seekBy(I.mediumSeekTime);
    }), V.id === "video.seekLongBackward" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.seekBy(-I.longSeekTime);
    }), V.id === "video.seekLongForward" && (T = () => {
      var h;
      return (h = k.current) == null ? void 0 : h.seekBy(I.longSeekTime);
    }), V.id === "video.playSelected" && A && (T = () => {
      var h;
      (h = R.current) == null || h.call(R, A.startSec, !0), requestAnimationFrame(() => {
        var x;
        return (x = g.current) == null ? void 0 : x.focus({ preventScroll: !0 });
      });
    }), (V.id === "video.playPreviousSegment" || V.id === "video.playNextSegment") && (T = () => {
      var x;
      const h = no(
        ae,
        A == null ? void 0 : A.id,
        V.id === "video.playPreviousSegment" ? "left" : "right"
      );
      !h || h.id === (A == null ? void 0 : A.id) || (v(h, { focusEditor: !0, seekToSegment: !1 }), (x = R.current) == null || x.call(R, h.startSec, !0));
    }), V.id.startsWith("video.seekPercent") && (T = () => {
      var x;
      const h = Number(V.id.slice(17)) / 10;
      (x = R.current) == null || x.call(R, Ys(m ?? ge, h), !1);
    }), V.id === "video.jumpToSegmentStart" && A && (T = () => {
      var h;
      return (h = R.current) == null ? void 0 : h.call(R, A.startSec, !1);
    }), V.id === "video.jumpToSegmentEnd" && A && (T = () => {
      var h;
      return (h = R.current) == null ? void 0 : h.call(R, A.endSec ?? A.startSec, !1);
    }), V.id === "video.jumpToVideoStart" && (T = () => {
      var h;
      return (h = R.current) == null ? void 0 : h.call(R, 0, !1);
    }), V.id === "video.jumpToVideoEnd" && (T = () => {
      var h;
      return (h = R.current) == null ? void 0 : h.call(R, ge, !1);
    }), V.id.startsWith("video.frame") && (T = () => {
      const h = V.id.includes("Small") ? "small" : V.id.includes("Medium") ? "medium" : "long", x = I[`${h}FrameStep`] * (V.id.endsWith("Backward") ? -1 : 1);
      re(x);
    }), V.id.startsWith("navigation.swimlane") && (T = () => {
      const h = V.id.slice(19).toLowerCase(), x = no(ae, A == null ? void 0 : A.id, h, s);
      x && v(x, { focusEditor: !0, seekToSegment: !1 });
    }), (V.id === "navigation.extendSwimlaneLeft" || V.id === "navigation.extendSwimlaneRight") && (T = () => {
      const h = $d(
        t,
        A == null ? void 0 : A.id,
        V.id.endsWith("Left") ? "left" : "right"
      );
      h && v(h.segment, {
        focusEditor: !0,
        seekToSegment: !1,
        rangeSegmentIds: h.segmentIds
      });
    }), (V.id === "navigation.segmentGroupUp" || V.id === "navigation.segmentGroupDown") && (T = () => {
      const h = Td(
        K,
        D ?? $,
        V.id.endsWith("Up") ? -1 : 1
      );
      h && G(h);
    }), (V.id === "navigation.previousAtPlayhead" || V.id === "navigation.nextAtPlayhead") && (T = () => {
      const h = Ps(ue, s, V.id === "navigation.previousAtPlayhead" ? -1 : 1, A == null ? void 0 : A.id);
      h && v(h, { focusEditor: !0, seekToSegment: !1 });
    }), V.id === "navigation.nearestInCurrentSwimlane" && (T = () => {
      const h = Ns(
        ae,
        A == null ? void 0 : A.id,
        s
      );
      h && v(h, { focusEditor: !0, seekToSegment: !1 });
    }), V.id.includes("Unreviewed") && (T = () => {
      const h = gr(
        ae,
        A == null ? void 0 : A.id,
        V.id.startsWith("navigation.previous") ? -1 : 1,
        V.id.endsWith("Global")
      );
      h && v(h, { focusEditor: !ie.preserveFocus, seekToSegment: !1 });
    }), (V.id === "navigation.nextTouchingPlayhead" || V.id === "navigation.previousTouchingPlayhead") && (T = () => {
      const h = ws(ae, s, V.id === "navigation.previousTouchingPlayhead" ? -1 : 1, A == null ? void 0 : A.id);
      h && v(h, { focusEditor: !0, seekToSegment: !1 });
    }), V.id === "navigation.quickSearch" && (T = () => C(!0)), (V.id === "navigation.previousShot" || V.id === "navigation.nextShot") && (T = () => {
      var x;
      const h = Tl(z, s, V.id === "navigation.previousShot" ? -1 : 1);
      h && ((x = R.current) == null || x.call(R, h.startSec, !1));
    }), V.id === "shot.split" && (T = () => y("split")), V.id === "shot.merge" && (T = () => y("merge")), V.id === "marker.create" && (T = () => a()), V.id === "marker.duplicate" && (T = () => d(!1)), V.id === "marker.duplicateAtPlayhead" && (T = () => d(!0)), V.id === "marker.split" && (T = () => H()), V.id === "marker.editTag" && (T = () => {
      var h;
      if (W.length > 1 && W.some((x) => x.isDerived)) {
        P("Derived segments cannot be retagged because their tags are set by derivation rules.");
        return;
      }
      if ((h = f.data) != null && h.tagReadOnly) {
        P("This tag is read-only because it is set by a derivation rule.");
        return;
      }
      te(!0);
    }), V.id === "marker.setStart" && A && (T = () => r(s, A.endSec)), V.id === "marker.setEnd" && A && (T = () => r(A.startSec, s)), V.id === "marker.copyTiming" && A && (T = () => {
      P(qd(A) ? "Segment timing copied." : "Unable to copy segment timing.");
    }), V.id === "marker.pasteTiming" && A && (T = () => {
      const h = _d();
      if (!h) {
        P("No copied segment timing is available.");
        return;
      }
      r(h.startSec, h.endSec);
    }), V.id === "marker.mergeSelection" && (T = () => p()), V.id === "marker.moveToBin" && (T = () => b()), V.id === "marker.toggleIncorrectExample" && A && (T = () => xe()), V.id === "marker.openIncorrectExamples" && (T = () => q(!0)), V.id === "markerGroup.toggleCollapse" && D && (T = () => oe(D)), V.id === "markerGroup.toggleAll" && (T = () => ee((h) => Cd(h, K))), V.id === "marker.assignSlots" && (T = () => {
      var h;
      return (h = se.current) == null ? void 0 : h.click();
    }), V.id === "navigation.zoomIn" && (T = () => ce((h) => pr(h + 0.5))), V.id === "navigation.zoomOut" && (T = () => ce((h) => pr(h - 0.5))), V.id === "navigation.resetZoom" && (T = () => ce(1)), V.id === "navigation.centerPlayhead" && (T = () => {
      var h;
      return (h = o.current) == null ? void 0 : h.call(o);
    }), V.id === "layout.growSwimlanes" && (T = () => he(c.timelineRatio + 0.05)), V.id === "layout.shrinkSwimlanes" && (T = () => he(c.timelineRatio - 0.05)), V.id === "marker.confirm" && A && (T = () => L("approved")), V.id === "system.publishApproved" && (T = () => w(ie.target)), V.id === "marker.reject" && A && (T = () => L("rejected")), V.id === "system.emptyBin" && (T = () => u()), V.id === "system.deleteRejected" && (T = () => l()), T && T();
  }
  function be(V, ie) {
    const T = qn.find((h) => h.id === V);
    T && vn(T, i) && X(T, ie);
  }
  return {
    executeShortcutById: be,
    stepVideoFrame: (V) => re(V < 0 ? -1 : 1)
  };
}
function Sa(e) {
  return e === !0;
}
function ka() {
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
  }), m = fe(null);
  async function p(w) {
    f({ busy: !0, reviewState: w, error: "" });
    try {
      await Z(`/videos/${e}/native-segments/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: to(), reviewState: w })
      }), await t(), f({ busy: !1, reviewState: null, error: "" });
    } catch (k) {
      f({
        busy: !1,
        reviewState: null,
        error: k.message || "Unable to import Cove segments."
      });
    }
  }
  async function b(w) {
    try {
      const k = await Z(`/videos/${e}/analysis-runs`, {
        signal: w.signal
      });
      if (!w.isActive()) return null;
      const I = (k == null ? void 0 : k[0]) || null;
      return s(I), (I == null ? void 0 : I.status) === "completed" && m.current !== I.id && (m.current = I.id, await t()), ((I == null ? void 0 : I.status) === "failed" || (I == null ? void 0 : I.status) === "cancelled") && g(I.errorMessage || "Video analysis did not complete."), I;
    } catch (k) {
      return w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to load video analysis status."), null;
    }
  }
  async function y(w = null) {
    g("");
    const k = w || (r ? ["aiTagging", "omnishotcut"] : ["aiTagging"]), I = k.includes("omnishotcut") && o > 0;
    if (!(I && !window.confirm(
      `Replace ${o} existing shot ${o === 1 ? "boundary" : "boundaries"} when this analysis succeeds? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
    )))
      try {
        const L = await Z(`/videos/${e}/analysis-runs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            analyses: k,
            replaceShotBoundaries: I,
            expectedShotBoundaryFingerprint: I ? i : null
          })
        });
        s(L);
      } catch (L) {
        g(L.message || "Unable to start video analysis.");
      }
  }
  return ye(() => {
    if (!Sa(r)) {
      s(null), d(null), g("");
      return;
    }
    const w = ka();
    return b(w), Z("/analysis/status", { signal: w.signal }).then((k) => {
      w.isActive() && (d(k), k.configured || g(""));
    }).catch((k) => {
      w.isActive() && k.name !== "AbortError" && g(k.message || "Unable to check video analysis readiness.");
    }), w.dispose;
  }, [e, r]), ye(() => {
    if (!Sa(r) || (a == null ? void 0 : a.status) !== "queued" && (a == null ? void 0 : a.status) !== "running") return;
    const w = ka();
    let k = setTimeout(async function I() {
      await b(w), w.isActive() && (k = setTimeout(I, 2500));
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
const Bn = Object.freeze([]);
function Ac(e, t) {
  var o;
  const r = e != null && e.isConnected && e.disabled !== !0 && e.tagName !== "BODY" && typeof e.focus == "function" ? e : t;
  (o = r == null ? void 0 : r.focus) == null || o.call(r, { preventScroll: !0 });
}
function Rc({ detail: e, onDetailChange: t, onConflict: r, onReload: o, onSlotsChanged: i, splitLayout: a, initialSegmentId: s, compatibilityMode: l = !1, profile: d, onNavigate: c }) {
  var Fo, jo, Bo, Go, Uo;
  const [g, u] = j(null), [f, m] = j([]), p = fe(null), b = fe(null), y = fe([]), w = fe(null), [k, I] = j(() => Nt({})), [L, R] = j(!1), [K, v] = j(Qs), [A, $] = j(0), [D] = j(() => nl()), W = Vl(D.subscribe, D.getSnapshot), ee = ur(W), q = (F, le) => D.acquire({ kind: F, lockId: le }), C = D.getSnapshot, [P, G] = Wl(dl, []), [te, ce] = j(!1), [z, se] = j(""), [H, ae] = j(""), [ge, xe] = j(""), [oe, he] = j(1), [B, ue] = j(Ud), [re, X] = j(0), [be, V] = j({ workspace: 0, focusRow: 0, focusRowHeight: 0 }), [ie, T] = j(Ut), h = fe(Ut), [x, S] = j(!1), [N, E] = j(!1), [J, U] = j(!1), pe = fe(!1);
  pe.current = J;
  const [M, Y] = j(null), [_, me] = j(null), [Me, Ne] = j(!1), [ke, rt] = j(null), [Ye, we] = j(null), Ke = fe(null), [Qe, je] = j(!1), [Q, de] = j(""), Ee = fe(null), Be = fe(null), ve = fe([]), We = fe(!1), [ze, Ie] = j(Kd), [Se, Ge] = j(null), [_e, Ce] = j(!1), [Xe, Oe] = j(!1), [Pe, Re] = j(!1), [He, Mt] = j(!1), [Le, Et] = j(!1), [Sn, it] = j(""), {
    analysisError: Te,
    analysisRun: $e,
    analysisStatus: Ve,
    importNativeSegments: ht,
    nativeImportState: st,
    startFullAnalysis: zt
  } = Tc(
    e.video.id,
    o,
    l,
    ((Fo = e.shotBoundaries) == null ? void 0 : Fo.length) || 0,
    Gn(e.shotBoundaries || [])
  ), [lt, ut] = j(!1), [Dt, Jt] = j(null), [kn, vt] = j(l), [wr, rn] = j(0), [on, Nr] = j(!1), [wn, It] = j(""), [Nn, Vn] = j(null), Ft = fe(null), Jn = fe(null), In = fe(!1), [Ht, Yt] = j([]), [Yn, Ir] = j(!1), [Qn, Cr] = j(null), Cn = Bd(), an = fe(null), $n = fe(null), Qt = fe(null), $r = fe(s), Zn = fe(null), Tn = fe(null), _t = fe(null), An = fe(null), sn = fe(null), mt = fe(null), Xn = fe(null), Rn = fe(null), er = fe(null), Ot = fe(null), Mn = fe(null), ln = fe(null), tr = fe(-1e12), Tr = fe(null), Ar = fe(!1), En = fe(null), [dn, Dn] = j({ scrollTop: 0, height: 512 });
  ye(() => {
    if (!lt || on || !wn) return;
    const F = requestAnimationFrame(() => {
      var le;
      return (le = Jn.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
    return () => cancelAnimationFrame(F);
  }, [lt, on, wn]), ye(() => {
    if (!In.current || lt || kn) return;
    const F = requestAnimationFrame(() => {
      var le;
      (le = Ft.current) == null || le.focus({ preventScroll: !0 }), In.current = !1;
    });
    return () => cancelAnimationFrame(F);
  }, [lt, kn]);
  const Ze = e.video, ot = e.segments || Bn, Rr = qe(() => JSON.stringify({
    segments: ot.map((F) => [
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
    performerSlots: (e.performerSlots || Bn).map((F) => [
      F.segmentId,
      F.slotDefinitionId,
      F.performerId,
      F.sortOrder
    ]),
    itemMetadata: e.itemMetadata || {}
  }), [ot, e.performerSlots, e.itemMetadata]);
  ye(() => {
    if (!l) {
      Jt(null), vt(!1);
      return;
    }
    if (ee != null) {
      vt(!0);
      return;
    }
    let F = !0;
    vt(!0);
    const le = setTimeout(() => {
      Z(`/videos/${Ze.id}/derived-segments/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maxDepth: 3 })
      }).then((De) => {
        F && (Jt(De), It(""));
      }).catch((De) => {
        F && (Jt(null), It(De.message || "Unable to preview derived segments."));
      }).finally(() => {
        F && vt(!1);
      });
    }, 150);
    return () => {
      F = !1, clearTimeout(le);
    };
  }, [l, Ze.id, Rr, wr, ee]);
  const at = () => rn((F) => F + 1), xt = e.segmentGroups || Bn, St = e.performerSlots || Bn, Mr = l && e.performerSlotsAvailable !== !1, cn = qe(
    () => (e.performerCandidates || []).filter((F) => F.isVideoPerformer),
    [e.performerCandidates]
  ), jt = e.shotBoundaries || Bn, On = qe(
    () => hi(St),
    [St]
  ), Pn = qe(
    () => ot.map((F) => {
      const le = On.get(F.id) || [];
      return {
        ...F,
        slots: le,
        assignment: le.every((De) => De.performerId == null) ? Ul(le, cn) : null
      };
    }).filter((F) => F.slots.length > 0 && F.assignment != null),
    [ot, On, cn]
  ), nr = Number((jo = Ze.videoFile) == null ? void 0 : jo.frameRate) > 0 ? Number(Ze.videoFile.frameRate) : 30;
  function un() {
    const F = pe.current;
    U(!1), F && requestAnimationFrame(() => {
      var le;
      return (le = mt.current) == null ? void 0 : le.focus({ preventScroll: !0 });
    });
  }
  function Ln() {
    ee == null && (ln.current = null, Ne(!1), se(""), requestAnimationFrame(() => {
      var F;
      return (F = mt.current) == null ? void 0 : F.focus({ preventScroll: !0 });
    }));
  }
  function Pt() {
    R(!1), requestAnimationFrame(() => {
      var F, le;
      (F = Rn.current) != null && F.isConnected ? Rn.current.focus({ preventScroll: !0 }) : (le = mt.current) == null || le.focus({ preventScroll: !0 });
    });
  }
  ye(() => {
    Mn.current === g ? (Mn.current = null, U(!0)) : U(!1);
  }, [g]), ye(() => {
    var le;
    if (!J) return;
    const F = (le = Ot.current) == null ? void 0 : le.querySelector("input");
    document.activeElement !== F && (F == null || F.focus({ preventScroll: !0 }), F == null || F.select());
  }, [J, g]), ye(() => {
    var le;
    if (J) return;
    const F = (le = mt.current) == null ? void 0 : le.ownerDocument;
    F && F.activeElement === F.body && mt.current.focus({ preventScroll: !0 });
  }, [J]), ye(() => {
    var De, tt, $t;
    const F = en(
      Ur(
        e.segments,
        e.performerSlots || [],
        Nt({}),
        l && K,
        e.segmentGroups || []
      ),
      e.segmentGroups || [],
      e.performerSlots || []
    ), le = ((De = e.segments.find((fn) => fn.id === s)) == null ? void 0 : De.id) ?? ((tt = Ha(F)) == null ? void 0 : tt.id) ?? null;
    u(le), m(le == null ? [] : [le]), b.current = le, y.current = [], Ge(Tt(F, le)), I(Nt({})), R(!1), ln.current = null, Ne(!1), me(null), he(1), se(""), T(Ut), h.current = Ut, S(!1), ($t = mt.current) == null || $t.focus({ preventScroll: !0 });
  }, [Ze.id, s]), ye(() => {
    const F = new AbortController();
    return Z(`/videos/${Ze.id}/incorrect-examples`, { signal: F.signal }).then(Yt).catch((le) => {
      le.name !== "AbortError" && Yt([]);
    }), () => F.abort();
  }, [Ze.id, d == null ? void 0 : d.effectiveMode]), ye(() => {
    const F = new AbortController();
    return Z(`/videos/${Ze.id}/history`, { signal: F.signal }).then((le) => {
      const De = le || Ut;
      h.current = De, T(De);
    }).catch((le) => {
      le.name !== "AbortError" && se(le.message || "Unable to load editor history.");
    }), () => F.abort();
  }, [Ze.id]), ye(() => {
    Hd(B);
  }, [B.timelineRatio, B.markerRailOpen, B.detailWidth, B.markerRailWidth, B.swimlaneTitleWidth]), ye(() => {
    zd(ze);
  }, [ze]), ye(() => {
    Zs(K);
  }, [K]), ye(() => {
    const F = Tn.current;
    if (!a || !F || typeof ResizeObserver > "u") return;
    const le = () => {
      var $t;
      const tt = Math.max(0, F.clientHeight - ((($t = _t.current) == null ? void 0 : $t.offsetHeight) || 0));
      X(tt), ue((fn) => {
        const Ko = uo(fn.timelineRatio, tt);
        return Ko === fn.timelineRatio ? fn : { ...fn, timelineRatio: Ko };
      });
    }, De = new ResizeObserver(le);
    return De.observe(F), _t.current && De.observe(_t.current), le(), () => De.disconnect();
  }, [a]), ye(() => {
    if (!Cn || typeof ResizeObserver > "u") return;
    const F = sn.current, le = An.current;
    if (!F || !le) return;
    const De = () => V({
      workspace: F.clientWidth,
      focusRow: le.clientWidth,
      focusRowHeight: le.clientHeight
    }), tt = new ResizeObserver(De);
    return tt.observe(F), tt.observe(le), De(), () => tt.disconnect();
  }, [Cn, B.markerRailOpen]);
  const kt = qe(
    () => Xa(Il(ot, _), P),
    [ot, _, P]
  );
  ql(() => {
    P.length > 0 && G({ type: "prune", detail: e });
  }, [e, P]);
  const Ct = qe(
    () => ga(
      Ur(
        kt,
        St,
        k,
        l && K,
        xt
      ),
      Ht,
      !0
    ),
    [
      kt,
      St,
      k,
      K,
      xt,
      l,
      Ht
    ]
  ), Er = Object.fromEntries(pt.map((F) => [F, Ct.filter((le) => le.reviewState === F).length])), Dr = ga(
    Ur(
      kt,
      St,
      { ...k, reviewStates: pt },
      l && K,
      xt
    ),
    Ht,
    !0
  ), Or = Object.fromEntries(pt.map((F) => [F, Dr.filter((le) => le.reviewState === F).length])), Pr = [...new Set(kt.map((F) => F.sourceKey).filter(Boolean))].sort((F, le) => Rt(F).localeCompare(Rt(le))), mn = Bs(
    k,
    l && K
  ), dt = qe(
    () => en(Ct, xt, St),
    [Ct, xt, St]
  ), O = Ks(
    dt,
    g,
    s
  ), ne = O == null ? null : ot.find((F) => F.id === O.id) || O, et = Yo(ot, Yo(Ct, f).map((F) => F.id)), ct = !l && et.length > 0 && et.every((F) => F.nativeSegmentId != null), Bt = Ct.map((F) => F.id), Gt = Bt.join("|");
  p.current = (ne == null ? void 0 : ne.id) ?? null;
  const rr = On.get(ne == null ? void 0 : ne.id) || [], Ai = bo(rr), So = qe(
    () => wd(dt, f),
    [dt, f]
  ), Lr = qe(() => ho(dt), [dt]), Fn = qe(
    () => Sd(Lr, ze),
    [Lr, ze]
  ), Ri = qe(
    () => vi(
      Fn.rows,
      dn.scrollTop,
      dn.height
    ),
    [Fn, dn]
  ), Fr = qe(
    () => Id(dt, ze),
    [dt, ze]
  ), Mi = gr(Fr, ne == null ? void 0 : ne.id, -1, !0) != null, Ei = gr(Fr, ne == null ? void 0 : ne.id, 1, !0) != null, gn = ne ? Tt(dt, ne.id) : null, jr = xt.length > 0 ? Lr.map((F) => F.key) : [], Di = jr.join("|"), or = Math.max(
    0,
    Number((Bo = Ze.videoFile) == null ? void 0 : Bo.duration) || 0,
    ...kt.map((F) => Number(F.endSec ?? F.startSec) || 0)
  ), ko = Number((Go = Ze.videoFile) == null ? void 0 : Go.duration) > 0 ? Number(Ze.videoFile.duration) : null;
  ie.actions;
  const Oi = ri();
  ye(() => {
    const F = g === fr ? g : (ne == null ? void 0 : ne.id) ?? null;
    F !== g && u(F);
  }, [ne, g]), ye(() => {
    m((F) => {
      const le = qs(
        F,
        Bt,
        (ne == null ? void 0 : ne.id) ?? null
      );
      return le.length === F.length && le.every((De, tt) => De === F[tt]) ? F : le;
    });
  }, [Gt, ne == null ? void 0 : ne.id]);
  const pn = (ne == null ? void 0 : ne.itemId) == null ? null : ((Uo = e.itemMetadata) == null ? void 0 : Uo[ne.itemId]) || null, Pi = {
    key: (ne == null ? void 0 : ne.itemId) != null ? `item:${ne.itemId}` : (ne == null ? void 0 : ne.nativeSegmentId) != null ? `native:${ne.nativeSegmentId}` : null,
    loading: !1,
    error: e.itemMetadataAvailable === !1 ? "Provenance is unavailable." : null,
    items: e.itemMetadataAvailable ? (pn == null ? void 0 : pn.provenance) || (ne == null ? void 0 : ne.fieldProvenance) || [] : []
  }, Br = (ne == null ? void 0 : ne.itemId) != null ? {
    loading: !1,
    error: e.lineageMetadataAvailable === !1 ? "Lineage is unavailable." : null,
    data: e.lineageMetadataAvailable && (pn == null ? void 0 : pn.lineage) || null
  } : {
    loading: !1,
    error: "Lineage is available in Full mode.",
    data: null
  };
  ye(() => {
    ae(O == null ? "" : String(O.startSec)), xe((O == null ? void 0 : O.endSec) == null ? "" : String(O.endSec));
  }, [O == null ? void 0 : O.id, O == null ? void 0 : O.startSec, O == null ? void 0 : O.endSec]), ye(() => {
    gn && Ie((F) => ki(F, gn));
  }, [Ze.id, s, gn]), ye(() => {
    Ge((F) => Ad(jr, F, gn));
  }, [Ze.id, Di, gn]), ye(() => {
    if (!B.markerRailOpen || (ne == null ? void 0 : ne.id) == null) return;
    const F = En.current, le = Fn.rows.find(($t) => $t.kind === "segment" && $t.segment.id === ne.id);
    if (!F || !le) return;
    const De = le.top + le.height;
    let tt = F.scrollTop;
    le.top < F.scrollTop ? tt = le.top : De > F.scrollTop + F.clientHeight && (tt = Math.max(0, De - F.clientHeight)), tt !== F.scrollTop && (F.scrollTop = tt), Dn({ scrollTop: tt, height: F.clientHeight });
  }, [ne == null ? void 0 : ne.id, Fn, B.markerRailOpen]), ye(() => {
    const F = En.current;
    if (!B.markerRailOpen || !F) return;
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
  }, [B.markerRailOpen]);
  const { revealSegmentGroupForSelection: wo, replaceSegmentSelection: Li, selectSegment: No, selectSegmentCollection: Fi, selectAllVideoSegments: ji } = wc({
    allSwimlanes: dt,
    editorRef: mt,
    performerSlots: St,
    seekRef: an,
    segmentGroups: xt,
    segments: ot,
    selectedSegmentId: g,
    selectedSegmentIds: f,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setCollapsedSegmentGroups: Ie,
    setEditorFilters: I,
    setHideDerivedSegments: v,
    setSaveMessage: se,
    setSelectedSegmentGroupKey: Ge,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m
  }), { acceptHistory: Gr, recordHistoryAction: ar, mutateSegment: Bi, completeReview: Gi, createSegment: Io, splitSegment: Co, duplicateSegment: $o, saveTiming: Ui, applyShortcutTiming: Ki } = jd({
    compatibilityMode: l,
    currentTime: A,
    detail: e,
    editorFilters: k,
    endInput: ge,
    hideDerivedSegments: K,
    historyRef: h,
    mediaDuration: ko,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    optimisticSegmentIdRef: tr,
    pendingDuplicateRef: Tr,
    pendingFirstSegmentStartSecRef: ln,
    pendingTagEditSegmentIdRef: Mn,
    heldCreatedSegmentTag: _,
    setHeldCreatedSegmentTag: me,
    replaceSegmentSelection: Li,
    savingSegmentId: ee,
    segments: ot,
    selectedSegment: ne,
    selectedSegmentIdRef: p,
    selectedSegments: et,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setCreatingSegmentId: Y,
    setEditorFilters: I,
    setFirstSegmentTagOpen: Ne,
    setHideDerivedSegments: v,
    setHistory: T,
    setHistoryOpen: S,
    setPublishApprovedError: de,
    setSaveMessage: se,
    acquireSaveLock: q,
    dispatchPendingChanges: G,
    setSelectedSegmentGroupKey: Ge,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    setTagEditing: U,
    startInput: H,
    tagEditingRef: pe,
    timelineDuration: or,
    video: Ze
  });
  function To(F = null) {
    var tt;
    if (!l || ee != null || !ot.some(($t) => !$t.published && $t.reviewState === "approved")) return;
    const le = ((tt = mt.current) == null ? void 0 : tt.ownerDocument) ?? document, De = le.activeElement === le.body ? null : le.activeElement;
    Be.current = F != null && F.isConnected && F !== le.body ? F : De, de(""), je(!0);
  }
  function Ao() {
    ee == null && (je(!1), de(""), requestAnimationFrame(() => {
      Ac(
        Be.current,
        mt.current
      ), Be.current = null;
    }));
  }
  async function zi() {
    await Gi() && Ao();
  }
  const { closeMergeConfirmation: Hi, mergeSelectedSwimlane: Ro, saveSelectedReviewState: Mo } = Nc({
    acceptHistory: Gr,
    compatibilityMode: l,
    detail: e,
    detailPanelRef: w,
    getSaveQueueSnapshot: C,
    historyRef: h,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    pendingReviewStateRef: ve,
    recordHistoryAction: ar,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: ee,
    selectedGroups: So,
    selectedSegment: ne,
    selectedSegmentIdRef: p,
    selectedSegments: et,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setMergeConfirmation: rt,
    setSaveMessage: se,
    acquireSaveLock: q,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: Ze
  }), _i = (F) => {
    ve.current = xl(
      ve.current,
      F
    );
  };
  ye(() => {
    if (ur(D.getSnapshot()) != null) return;
    let F = !1;
    for (; ve.current.length > 0; ) {
      const le = ve.current.shift(), De = hl(le, ot);
      if (!De) {
        F = !0;
        continue;
      }
      Mo(
        De.requestedState,
        De.selectedSegments,
        De.selectedSegment
      );
      return;
    }
    F && se("The queued review could not find its segment after refreshing.");
  }, [ee, ot]);
  const { toggleIncorrectExample: qi, removeIncorrectExample: Wi, captureTrainingExport: Vi, deleteRejectedSegments: Eo, autoAssignPerformers: Ji, previewDerivedSegments: Yi, closeMaterializeDialog: Qi, materializeDerivedSegments: Zi, saveTag: Xi, applyHeldCreatedSegmentTag: es, moveToBin: ts, emptyRecyclingBin: ns } = Ic({
    acceptHistory: Gr,
    allSwimlanes: dt,
    autoAssignCandidates: Pn,
    autoAssigning: Le,
    binEmptyingRef: We,
    canMoveSelectionToBin: ct,
    closeTagEditing: un,
    compatibilityMode: l,
    creatingSegmentId: M,
    detail: e,
    editorFilters: k,
    editorRef: mt,
    exportingExamples: Yn,
    hideDerivedSegments: K,
    incorrectExamples: Ht,
    lineage: Br,
    materializeButtonRef: Ft,
    materializePreview: Dt,
    materializeRestoreFocusRef: In,
    materializing: on,
    mutateSegment: Bi,
    onConflict: r,
    onDetailChange: t,
    onReload: o,
    performerSlots: St,
    heldCreatedSegmentTag: _,
    setHeldCreatedSegmentTag: me,
    recordHistoryAction: ar,
    refreshMaterializationPreview: at,
    removingExampleId: Qn,
    revealSegmentGroupForSelection: wo,
    savingSegmentId: ee,
    segmentGroups: xt,
    segments: ot,
    selectedSegment: ne,
    selectedSegmentIdRef: p,
    selectedSegments: et,
    selectionAnchorIdRef: b,
    selectionRangeBaseIdsRef: y,
    setAutoAssignError: it,
    setAutoAssignOpen: Mt,
    setAutoAssigning: Et,
    setEditorFilters: I,
    setExportingExamples: Ir,
    setHideDerivedSegments: v,
    setIncorrectExamples: Yt,
    setMaterializeError: It,
    setMaterializeLoading: vt,
    setMaterializeOpen: ut,
    setMaterializePreview: Jt,
    setMaterializing: Nr,
    setRemovingExampleId: Cr,
    setRejectedDeletionPreview: we,
    setSaveMessage: se,
    acquireSaveLock: q,
    setSelectedSegmentGroupKey: Ge,
    setSelectedSegmentId: u,
    setSelectedSegmentIds: m,
    video: Ze
  });
  ye(() => {
    const F = _, le = Cl(F, {
      segments: ot,
      savingSegmentId: ur(D.getSnapshot()),
      reviewSaving: Qr(D.getSnapshot(), "review"),
      tagEditing: J,
      selectedSegmentIds: f,
      activeSegmentId: ne == null ? void 0 : ne.id
    });
    le === "none" || le === "wait" || (me(null), le === "apply" && es(F));
  }, [_, ot, ee, ne == null ? void 0 : ne.id, f, J]);
  const { restoreHistoryTarget: rs, updateTimelineRatio: Do, handleSeparatorPointerDown: os, handleSeparatorPointerMove: as, handleSeparatorKeyDown: is, panelWidthMaximum: Oo, panelSeparatorProps: ss, toggleSegmentRail: ls, toggleSegmentGroup: Po, mutateShotBoundary: ds } = Cc({
    acceptHistory: Gr,
    compatibilityMode: l,
    currentTime: A,
    detail: e,
    editorLayout: B,
    focusRowRef: An,
    history: ie,
    historyRef: h,
    historySaving: N,
    horizontalLayoutSize: be,
    mediaStackHeight: re,
    mediaStackRef: Tn,
    commonActionsRef: _t,
    onDetailChange: t,
    onReload: o,
    railToggleRef: Xn,
    recordHistoryAction: ar,
    savingSegmentId: ee,
    savingShot: te,
    savingShotRef: Ar,
    setCollapsedSegmentGroups: Ie,
    setEditorLayout: ue,
    setHistorySaving: E,
    setIncorrectExamples: Yt,
    setSaveMessage: se,
    acquireSaveLock: q,
    setSavingShot: ce,
    shotBoundaries: jt,
    timelineDuration: or,
    video: Ze,
    workspaceRef: sn
  }), { executeShortcutById: Lo, stepVideoFrame: cs } = $c({
    allSwimlanes: dt,
    applyShortcutTiming: Ki,
    centerTimelineRef: Zn,
    compatibilityMode: l,
    createSegment: Io,
    currentTime: A,
    deleteRejectedSegments: Eo,
    duplicateSegment: $o,
    editorLayout: B,
    editorRef: mt,
    emptyRecyclingBin: ns,
    lineage: Br,
    mediaDuration: ko,
    mergeSelectedSwimlane: Ro,
    moveToBin: ts,
    mutateShotBoundary: ds,
    openPublishApprovedDialog: To,
    playbackControlsRef: $n,
    playbackShortcutConfig: Oi,
    saveSelectedReviewState: Mo,
    seekRef: an,
    segmentGroupKeys: jr,
    selectSegment: No,
    selectedSegment: ne,
    selectedSegmentGroupForSegment: gn,
    selectedSegmentGroupKey: Se,
    selectedSegments: et,
    setCollapsedSegmentGroups: Ie,
    setIncorrectExamplesOpen: Re,
    setQuickSearchOpen: Oe,
    setSaveMessage: se,
    setSelectedSegmentGroupKey: Ge,
    setTagEditing: U,
    setTimelineZoom: he,
    shotBoundaries: jt,
    slotButtonRef: er,
    splitSegment: Co,
    swimlanes: Fr,
    timelineDuration: or,
    toggleIncorrectExample: qi,
    toggleSegmentGroup: Po,
    updateTimelineRatio: Do,
    videoFrameRate: nr,
    visibleSegments: Ct
  });
  Qt.current = Lo;
  const us = qe(() => qn.map((F) => ({
    id: F.id,
    enabled: vn(F, l),
    surface: "local",
    action: (le) => {
      var De;
      return (De = Qt.current) == null ? void 0 : De.call(Qt, F.id, le);
    }
  })), [l]);
  Ea(so, us);
  const ms = co(re), gs = Xt(B.markerRailWidth, Oo("markerRailWidth")), ps = Xt(B.detailWidth, Oo("detailWidth"));
  return n(kc, {
    activeFilterCount: mn,
    allSwimlanes: dt,
    analysisError: Te,
    analysisRun: $e,
    analysisStatus: Ve,
    approvalFacetCounts: Or,
    autoAssignCandidates: Pn,
    autoAssignError: Sn,
    autoAssignOpen: He,
    autoAssignPerformers: Ji,
    autoAssigning: Le,
    canMoveSelectionToBin: ct,
    captureTrainingExport: Vi,
    cancelQueuedReviewsForSegments: _i,
    removeIncorrectExample: Wi,
    rejectedDeletionPreview: Ye,
    centerTimelineRef: Zn,
    closeEditorFilters: Pt,
    closeFirstSegmentTagDialog: Ln,
    closeMaterializeDialog: Qi,
    closeMergeConfirmation: Hi,
    closePublishApprovedDialog: Ao,
    closeTagEditing: un,
    collapsedSegmentGroups: ze,
    commonActionsRef: _t,
    compatibilityMode: l,
    configuringTag: Nn,
    createSegment: Io,
    currentTime: A,
    deleteRejectedSegments: Eo,
    detail: e,
    detailPanelRef: w,
    detailWidth: ps,
    duplicateSegment: $o,
    editorFilters: k,
    editorLayout: B,
    editorRef: mt,
    exportingExamples: Yn,
    filtersButtonRef: Rn,
    filtersOpen: L,
    firstSegmentTagOpen: Me,
    focusRowRef: An,
    handleSeparatorKeyDown: is,
    handleSeparatorPointerDown: os,
    handleSeparatorPointerMove: as,
    hideDerivedSegments: K,
    history: ie,
    historyOpen: x,
    historySaving: N,
    hasNextUnreviewed: Ei,
    hasPreviousUnreviewed: Mi,
    horizontalLayoutSize: be,
    importNativeSegments: ht,
    incorrectExamples: Ht,
    incorrectExamplesOpen: Pe,
    removingExampleId: Qn,
    lineage: Br,
    markerRailWidth: gs,
    materializeButtonRef: Ft,
    materializeCancelButtonRef: Jn,
    materializeDerivedSegments: Zi,
    materializeError: wn,
    materializeLoading: kn,
    materializeOpen: lt,
    materializePreview: Dt,
    materializing: on,
    mediaStackRef: Tn,
    mergeCancelButtonRef: Ke,
    mergeConfirmation: ke,
    mergeSaving: Qr(W, "merge"),
    mergeSelectedSwimlane: Ro,
    nativeImportState: st,
    onNavigate: c,
    onDetailChange: t,
    openPublishApprovedDialog: To,
    onReload: o,
    onSlotsChanged: i,
    panelSeparatorProps: ss,
    pendingInitialSeekRef: $r,
    performerSlots: St,
    performerSlotsAvailable: Mr,
    playbackControlsRef: $n,
    previewDerivedSegments: Yi,
    provenance: Pi,
    provenanceSources: Pr,
    publishApprovedCancelButtonRef: Ee,
    publishApprovedDrafts: zi,
    publishApprovedError: Q,
    publishApprovedOpen: Qe,
    quickSearchOpen: Xe,
    railScrollRef: En,
    railToggleRef: Xn,
    recordHistoryAction: ar,
    restoreHistoryTarget: rs,
    runEditorAction: Lo,
    stepVideoFrame: cs,
    saveMessage: z,
    setSaveMessage: se,
    saveTag: Xi,
    saveTiming: Ui,
    savingSegmentId: ee,
    acquireSaveLock: q,
    seekRef: an,
    segmentGroups: xt,
    segmentRailLayout: Fn,
    segments: kt,
    selectAllVideoSegments: ji,
    selectSegment: No,
    selectSegmentCollection: Fi,
    selectedGroups: So,
    selectedPerformerSlots: rr,
    selectedSegment: O,
    selectedSegmentGroupKey: Se,
    selectedSegmentIds: f,
    selectedSegments: et,
    selectedSlotStatus: Ai,
    setAutoAssignError: it,
    setAutoAssignOpen: Mt,
    setConfiguringTag: Vn,
    setCurrentTime: $,
    setEditorFilters: I,
    setEditorLayout: ue,
    setFiltersOpen: R,
    setHideDerivedSegments: v,
    setHistoryOpen: S,
    setIncorrectExamplesOpen: Re,
    setQuickSearchOpen: Oe,
    setRejectedDeletionPreview: we,
    setRailViewport: Dn,
    setSelectedSegmentGroupKey: Ge,
    setSelectedSegmentId: u,
    setShortcutsOpen: Ce,
    setTimelineZoom: he,
    shotBoundaries: jt,
    shortcutsOpen: _e,
    slotButtonRef: er,
    splitLayout: a,
    splitSegment: Co,
    startFullAnalysis: zt,
    tagEditing: J,
    creatingSegmentId: M,
    tagSearchRef: Ot,
    timelineDuration: or,
    timelineRatioBounds: ms,
    timelineZoom: oe,
    toggleSegmentGroup: Po,
    toggleSegmentRail: ls,
    updateTimelineRatio: Do,
    video: Ze,
    videoPerformers: cn,
    visibleCounts: Er,
    visibleSegmentRailRows: Ri,
    visibleSegments: Ct,
    wideLayout: Cn,
    workspaceRef: sn
  });
}
const Mc = /* @__PURE__ */ new Set(["queued", "running"]);
async function wa(e, t, r = 4) {
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
function Na(e, t) {
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
  const s = a.includes("omnishotcut"), l = await wa(i, async (m) => {
    try {
      const [p, b] = await Promise.all([
        r(`/videos/${m}/analysis-runs`),
        s ? r(`/videos/${m}/editor`) : null
      ]);
      if ((p || []).some((w) => Mc.has(w == null ? void 0 : w.status)))
        throw new Error("A Full Scan is already queued or running.");
      const y = (b == null ? void 0 : b.shotBoundaries) || [];
      return { videoId: m, shotBoundaries: y };
    } catch (p) {
      return Na(m, p);
    }
  }), d = l.filter((m) => !m.error), c = l.filter((m) => m.error), g = d.filter((m) => m.shotBoundaries.length > 0), u = g.reduce((m, p) => m + p.shotBoundaries.length, 0);
  if (u > 0 && !o(
    `Replace ${u} existing shot ${u === 1 ? "boundary" : "boundaries"} across ${g.length} selected ${g.length === 1 ? "video" : "videos"} when these scans succeed? Existing automatic and manual shot edits will be replaced. This cannot be undone. If analysis fails, the current boundaries will remain unchanged.`
  )) return { queuedIds: [], failed: c, cancelled: !0 };
  const f = await wa(d, async ({ videoId: m, shotBoundaries: p }) => {
    const b = s && p.length > 0;
    try {
      return await r(`/videos/${m}/analysis-runs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          analyses: a,
          replaceShotBoundaries: b,
          expectedShotBoundaryFingerprint: b ? Gn(p) : null
        })
      }), { videoId: m };
    } catch (y) {
      return Na(m, y);
    }
  });
  return {
    queuedIds: f.filter((m) => !m.error).map((m) => m.videoId),
    failed: [...c, ...f.filter((m) => m.error)],
    cancelled: !1
  };
}
function Oc(e = [], t = []) {
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
function Pc(e = [], t = "", r = "all") {
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
function gt(e, t) {
  return String(e || "").localeCompare(String(t || ""), void 0, {
    numeric: !0,
    sensitivity: "base"
  });
}
function Lc(e = [], t = []) {
  var m;
  const r = /* @__PURE__ */ new Map();
  [...t].sort((p, b) => (p.sortOrder ?? 0) - (b.sortOrder ?? 0) || Number(p.id) - Number(b.id)).forEach((p, b) => {
    [...p.tags || []].sort((y, w) => (y.sortOrder ?? 0) - (w.sortOrder ?? 0) || Number(y.tagId) - Number(w.tagId)).forEach((y, w) => r.set(Number(y.tagId), {
      key: `group:${p.id}`,
      id: p.id,
      name: p.name,
      sortOrder: p.sortOrder ?? b,
      tagSortOrder: y.sortOrder ?? w
    }));
  });
  const o = /* @__PURE__ */ new Map();
  function i(p, b) {
    const y = Number(p);
    if (!o.has(y)) {
      const w = r.get(y);
      o.set(y, {
        tagId: y,
        name: b || `Tag ${y}`,
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
    const b = i(p.sourceTagId, p.sourceTagName), y = i(p.derivedTagId, p.derivedTagName);
    b.outgoingRuleCount++, y.incomingRuleCount++;
    const w = `${b.tagId}:${y.tagId}`;
    a.has(w) || a.set(w, {
      id: w,
      sourceTagId: b.tagId,
      derivedTagId: y.tagId,
      rules: [],
      edgeCount: 0
    });
    const k = a.get(w);
    k.rules.push(p), k.edgeCount += Number(p.edgeCount) || 0;
  });
  const s = [...o.values()], l = [...a.values()], d = new Map(s.map((p) => [p.tagId, /* @__PURE__ */ new Set()]));
  l.forEach((p) => {
    var b, y;
    (b = d.get(p.sourceTagId)) == null || b.add(p.derivedTagId), (y = d.get(p.derivedTagId)) == null || y.add(p.sourceTagId);
  });
  const c = /* @__PURE__ */ new Set(), g = [];
  for (const p of s) {
    if (c.has(p.tagId)) continue;
    const b = [p.tagId], y = [];
    for (c.add(p.tagId); b.length > 0; ) {
      const v = b.shift();
      y.push(v);
      for (const A of d.get(v) || [])
        c.has(A) || (c.add(A), b.push(A));
    }
    const w = new Set(y), k = y.map((v) => o.get(v)), I = l.filter((v) => w.has(v.sourceTagId) && w.has(v.derivedTagId)), L = I.flatMap((v) => v.rules), R = k.filter((v) => v.outgoingRuleCount === 0).sort((v, A) => gt(v.name, A.name)), K = R.length > 0 ? R : [...k].sort((v, A) => gt(v.name, A.name));
    g.push({
      id: [...y].sort((v, A) => v - A).join(":"),
      label: K.length > 1 ? `${K[0].name} + ${K.length - 1}` : ((m = K[0]) == null ? void 0 : m.name) || "Derivation component",
      nodes: k,
      connections: I,
      rules: L,
      segmentGroupKeys: [...new Set(k.map((v) => v.segmentGroupKey))],
      materializedEdgeCount: L.reduce(
        (v, A) => v + (Number(A.edgeCount) || 0),
        0
      )
    });
  }
  g.sort((p, b) => b.rules.length - p.rules.length || gt(p.label, b.label));
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
    p.nodes.forEach((b) => {
      var y;
      return (y = u.get(b.segmentGroupKey)) == null ? void 0 : y.componentIds.add(p.id);
    }), p.rules.forEach((b) => {
      var y, w;
      (y = u.get(o.get(Number(b.sourceTagId)).segmentGroupKey)) == null || y.ruleIds.add(b.id), (w = u.get(o.get(Number(b.derivedTagId)).segmentGroupKey)) == null || w.ruleIds.add(b.id);
    });
  });
  const f = [...u.values()].sort((p, b) => p.sortOrder - b.sortOrder || gt(p.name, b.name)).map((p) => ({
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
  const g = new Map(e.nodes.map(($) => [$.tagId, /* @__PURE__ */ new Set()])), u = new Map(e.nodes.map(($) => [$.tagId, /* @__PURE__ */ new Set()]));
  e.connections.forEach(($) => {
    var D, W;
    (D = g.get($.sourceTagId)) == null || D.add($.derivedTagId), (W = u.get($.derivedTagId)) == null || W.add($.sourceTagId);
  });
  const f = new Map(e.nodes.map(($) => {
    var D;
    return [
      $.tagId,
      ((D = u.get($.tagId)) == null ? void 0 : D.size) || 0
    ];
  })), m = new Map(e.nodes.map(($) => [$.tagId, 0])), p = e.nodes.filter(($) => f.get($.tagId) === 0).sort(($, D) => gt($.name, D.name)).map(($) => $.tagId), b = /* @__PURE__ */ new Set();
  for (; p.length > 0; ) {
    const $ = p.shift();
    if (!b.has($)) {
      b.add($);
      for (const D of g.get($) || [])
        m.set(D, Math.max(m.get(D) || 0, (m.get($) || 0) + 1)), f.set(D, f.get(D) - 1), f.get(D) === 0 && p.push(D);
    }
  }
  b.size !== e.nodes.length && e.nodes.filter(($) => !b.has($.tagId)).sort(($, D) => gt($.name, D.name)).forEach(($) => m.set($.tagId, 0));
  const y = Math.max(0, ...m.values()), w = Math.max(
    t,
    240 + y * 296
  ), k = /* @__PURE__ */ new Map();
  e.nodes.forEach(($) => {
    k.has($.segmentGroupKey) || k.set($.segmentGroupKey, {
      key: $.segmentGroupKey,
      id: $.segmentGroupId,
      name: $.segmentGroupName,
      sortOrder: $.segmentGroupSortOrder,
      nodes: []
    }), k.get($.segmentGroupKey).nodes.push($);
  });
  const I = [...k.values()].sort(($, D) => $.sortOrder - D.sortOrder || gt($.name, D.name));
  let L = 28;
  const R = [], K = I.map(($) => {
    const D = /* @__PURE__ */ new Map();
    $.nodes.forEach((P) => {
      const G = m.get(P.tagId) || 0;
      D.has(G) || D.set(G, []), D.get(G).push(P);
    });
    for (const P of D.values())
      P.sort((G, te) => G.segmentGroupTagSortOrder - te.segmentGroupTagSortOrder || gt(G.name, te.name));
    const W = Math.max(1, ...[...D.values()].map((P) => P.length)), ee = W * 58 + (W - 1) * 18, q = 70 + ee, C = {
      ...$,
      x: 12,
      y: L,
      width: w - 24,
      height: q
    };
    for (const [P, G] of D.entries()) {
      const te = G.length * 58 + Math.max(0, G.length - 1) * 18, ce = (ee - te) / 2;
      G.forEach((z, se) => R.push({
        ...z,
        rank: P,
        x: 28 + P * 296,
        y: L + 34 + 18 + ce + se * 76,
        width: 184,
        height: 58
      }));
    }
    return L += q + 16, C;
  }), v = new Map(R.map(($) => [$.tagId, $])), A = e.connections.map(($) => {
    const D = v.get($.sourceTagId), W = v.get($.derivedTagId), ee = D.x + D.width, q = D.y + D.height / 2, C = W.x, P = W.y + W.height / 2, G = Math.max(48, (C - ee) * 0.48);
    return {
      ...$,
      path: `M ${ee} ${q} C ${ee + G} ${q}, ${C - G} ${P}, ${C} ${P}`
    };
  });
  return {
    width: w,
    height: Math.max(r, L - 16 + 28),
    nodes: R,
    connections: A,
    groups: K
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
      const b = m.get(p.sourceTagId), y = m.get(p.derivedTagId), w = b.x + b.width, k = b.y + b.height / 2, I = y.x, L = y.y + y.height / 2, R = Math.max(48, (I - w) * 0.48);
      return {
        ...p,
        componentId: d.id,
        path: `M ${w} ${k} C ${w + R} ${k}, ${I - R} ${L}, ${I} ${L}`
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
function Ia(e, t = []) {
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
  const { arrowMarkerId: t, busy: r, buttonClass: o, configuringTag: i, deleteRule: a, derivedSlots: s, derivedSlotsLoading: l, draft: d, draftIssue: c, editRule: g, editorRef: u, emptyDraft: f, graph: m, layout: p, listSort: b, materializationOffer: y, materializeOutgoingRules: w, materializeRule: k, message: I, normalizedQuery: L, query: R, refreshConfiguredTag: K, revealEditor: v, rules: A, save: $, segmentGroupKey: D, selectedNode: W, selectedRule: ee, selection: q, setConfiguringTag: C, setDraft: P, setListSort: G, setMaterializationOffer: te, setQuery: ce, setSegmentGroupKey: z, setSelection: se, setView: H, sortedVisibleRules: ae, sourceSlots: ge, sourceSlotsLoading: xe, updateMapping: oe, updateTag: he, view: B, visibleComponents: ue, visibleRules: re } = e;
  function X(h) {
    const x = m.nodes.find((N) => N.tagId === Number(h.sourceTagId)), S = m.nodes.find((N) => N.tagId === Number(h.derivedTagId));
    return (x == null ? void 0 : x.segmentGroupKey) === (S == null ? void 0 : S.segmentGroupKey) ? x.segmentGroupKey : "cross-group";
  }
  function be() {
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
            n(Kn, {
              key: "selector",
              entityType: "tag",
              value: d.sourceTagId,
              selectedDisplay: "input",
              selectedLabel: d.sourceTagName || void 0,
              onChange: (h, x) => he("source", h, x == null ? void 0 : x.label),
              disabled: r,
              placeholder: "Find a source tag…",
              inputClassName: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground",
              creatable: !1,
              allowCreate: !1
            })
          ]),
          d.ruleId == null && d.sourceTagId && !xe && ge.length === 0 ? n("div", {
            key: "missing-slots",
            className: "flex flex-wrap items-center justify-between gap-2 rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-2"
          }, [
            n("span", { key: "message", className: "text-xs text-secondary" }, "No performer slots configured."),
            n("button", {
              key: "configure",
              type: "button",
              disabled: r,
              onClick: (h) => C({
                tagId: d.sourceTagId,
                tagName: d.sourceTagName || "Source tag",
                draftKind: "source",
                trigger: h.currentTarget
              }),
              className: "rounded-md border border-amber-500/50 bg-card px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40 disabled:opacity-50"
            }, "Configure source tag")
          ]) : null
        ]),
        n("div", { key: "derived", className: "space-y-2" }, [
          n("label", { key: "field", className: "space-y-1 text-xs text-secondary" }, [
            n("span", { key: "label" }, "Derived tag (general)"),
            n(Kn, {
              key: "selector",
              entityType: "tag",
              value: d.derivedTagId,
              selectedDisplay: "input",
              selectedLabel: d.derivedTagName || void 0,
              onChange: (h, x) => he("derived", h, x == null ? void 0 : x.label),
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
              onClick: (h) => C({
                tagId: d.derivedTagId,
                tagName: d.derivedTagName || "Derived tag",
                draftKind: "derived",
                trigger: h.currentTarget
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
            disabled: r || ge.length === 0 || s.length === 0,
            onClick: () => P((h) => ({
              ...h,
              slotMappings: [...h.slotMappings, { sourceSlotDefinitionId: "", derivedSlotDefinitionId: "" }]
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
          ...d.slotMappings.map((h, x) => n("div", { key: x, className: "flex items-center gap-2" }, [
            n("select", {
              key: "source",
              value: h.sourceSlotDefinitionId,
              disabled: r,
              onChange: (S) => oe(x, "sourceSlotDefinitionId", S.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Source slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Source slot…"), ...ge.map((S) => n("option", { key: S.id, value: S.id }, ft(S)))]),
            n("span", { key: "arrow", className: "self-center text-secondary" }, "→"),
            n("select", {
              key: "derived",
              value: h.derivedSlotDefinitionId,
              disabled: r,
              onChange: (S) => oe(x, "derivedSlotDefinitionId", S.target.value),
              className: "min-w-0 flex-1 rounded-md border border-border bg-surface px-2 py-1.5 text-sm",
              "aria-label": `Derived slot mapping ${x + 1}`
            }, [n("option", { key: "none", value: "" }, "Derived slot…"), ...s.map((S) => n("option", { key: S.id, value: S.id }, ft(S)))]),
            n("button", {
              key: "remove",
              type: "button",
              disabled: r,
              onClick: () => P((S) => ({
                ...S,
                slotMappings: S.slotMappings.filter((N, E) => E !== x)
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
          disabled: r || !d.sourceTagId || !d.derivedTagId || c != null || d.slotMappings.some((h) => !h.sourceSlotDefinitionId || !h.derivedSlotDefinitionId),
          onClick: $,
          className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium disabled:opacity-50"
        }, "Save rule"),
        n("button", { key: "cancel", type: "button", disabled: r, onClick: () => P(null), className: o }, "Cancel")
      ])
    ]);
  }
  function V() {
    if (W) {
      const S = re.filter((J) => Number(J.derivedTagId) === W.tagId), N = re.filter((J) => Number(J.sourceTagId) === W.tagId), E = (J, U, pe) => n("div", {
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
          pe ? n("button", {
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
          n("div", { key: "group", className: "text-xs font-medium text-accent" }, W.segmentGroupName),
          n("h3", { key: "name", className: "mt-1 text-lg font-semibold text-foreground" }, W.name),
          n(
            "p",
            { key: "counts", className: "mt-1 text-xs text-secondary" },
            `${W.incomingRuleCount} incoming · ${W.outgoingRuleCount} outgoing`
          )
        ]),
        n("button", {
          key: "configure-tag",
          type: "button",
          disabled: r || d != null,
          onClick: (J) => C({
            tagId: W.tagId,
            tagName: W.name,
            trigger: J.currentTarget
          }),
          className: "w-full rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:border-accent/60 hover:bg-muted/40 disabled:opacity-50"
        }, "Configure tag"),
        N.length ? n("button", {
          key: "materialize-outgoing",
          type: "button",
          disabled: r || d != null,
          onClick: () => w(W, N),
          className: "w-full rounded-md border border-accent bg-accent/15 px-3 py-2 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, `Materialize outgoing (${N.length})`) : null,
        N.length ? n("div", { key: "outgoing", className: "space-y-2" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, "Outgoing rules"),
          ...N.map((J) => E(J, "Derives", !0))
        ]) : null,
        S.length ? n("details", {
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
              S.length
            )
          ]),
          n(
            "div",
            { key: "rules", className: "space-y-2 border-t border-border p-2" },
            S.map((J) => E(J, "Derived by", !1))
          )
        ]) : null
      ]);
    }
    if (!ee)
      return n(
        "div",
        { key: "empty-details", className: "p-5 text-sm text-secondary" },
        "Select a tag or relationship to inspect it."
      );
    const h = m.nodes.find((S) => S.tagId === Number(ee.sourceTagId)), x = m.nodes.find((S) => S.tagId === Number(ee.derivedTagId));
    return n("div", { key: "rule-details", className: "space-y-4 p-4" }, [
      n("div", { key: "identity" }, [
        n("div", { key: "groups", className: "flex flex-wrap items-center gap-1 text-xs text-accent" }, [
          n("span", { key: "source" }, (h == null ? void 0 : h.segmentGroupName) || "Ungrouped"),
          (h == null ? void 0 : h.segmentGroupKey) !== (x == null ? void 0 : x.segmentGroupKey) ? n("span", { key: "derived" }, `→ ${(x == null ? void 0 : x.segmentGroupName) || "Ungrouped"}`) : null
        ]),
        n(
          "h3",
          { key: "name", className: "mt-1 text-lg font-semibold leading-snug text-foreground" },
          `${ee.sourceTagName} → ${ee.derivedTagName}`
        ),
        n(
          "p",
          { key: "edges", className: "mt-2 text-sm text-secondary" },
          `${ee.edgeCount} materialized lineage edge${ee.edgeCount === 1 ? "" : "s"}`
        )
      ]),
      (y == null ? void 0 : y.ruleId) === ee.id ? n("div", { key: "offer", className: "space-y-2 rounded-md border border-accent/40 bg-accent/10 p-3" }, [
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
            onClick: () => k(ee, y),
            className: "rounded-md border border-accent bg-accent/20 px-3 py-1.5 text-sm font-medium text-foreground disabled:opacity-50"
          }, "Materialize now"),
          n("button", {
            key: "later",
            type: "button",
            disabled: r,
            onClick: () => te(null),
            className: o
          }, "Later")
        ])
      ]) : null,
      n("div", { key: "mappings", className: "space-y-2" }, [
        n("h4", { key: "title", className: "text-sm font-medium text-foreground" }, "Performer slot mappings"),
        ee.slotMappings.length === 0 ? n("p", { key: "empty", className: "text-xs text-secondary" }, "No performer slots are copied.") : ee.slotMappings.map((S, N) => n("div", {
          key: `${S.sourceSlotDefinitionId}:${S.derivedSlotDefinitionId}`,
          className: "grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 rounded-md border border-border bg-card p-2 text-xs"
        }, [
          n(
            "span",
            { key: "source", className: "truncate text-foreground", title: S.sourceSlotLabel || "Unnamed slot" },
            S.sourceSlotLabel || "Unnamed slot"
          ),
          n("span", { key: "arrow", className: "text-secondary" }, "→"),
          n(
            "span",
            { key: "derived", className: "truncate text-foreground", title: S.derivedSlotLabel || "Unnamed slot" },
            S.derivedSlotLabel || "Unnamed slot"
          )
        ]))
      ]),
      n("dl", { key: "metadata", className: "grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 border-t border-border pt-3 text-xs" }, [
        n("dt", { key: "created-label", className: "text-secondary" }, "Created"),
        n(
          "dd",
          { key: "created", className: "text-right text-foreground" },
          ee.createdAt ? new Date(ee.createdAt).toLocaleDateString() : "Unknown"
        ),
        n("dt", { key: "updated-label", className: "text-secondary" }, "Updated"),
        n(
          "dd",
          { key: "updated", className: "text-right text-foreground" },
          ee.updatedAt ? new Date(ee.updatedAt).toLocaleDateString() : "Unknown"
        )
      ]),
      n("div", { key: "actions", className: "flex flex-wrap gap-2" }, [
        n("button", {
          key: "materialize",
          type: "button",
          disabled: r || d != null,
          onClick: () => k(ee),
          className: o
        }, "Materialize pending"),
        n("button", {
          key: "edit",
          type: "button",
          disabled: r || d != null,
          onClick: () => g(ee),
          className: "rounded-md border border-accent bg-accent/15 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-accent/25 disabled:opacity-50"
        }, "Edit rule"),
        n("button", {
          key: "delete",
          type: "button",
          disabled: r,
          onClick: () => a(ee),
          className: `${o} text-red-300`
        }, "Delete")
      ])
    ]);
  }
  function ie() {
    if (ue.length === 0)
      return n("p", {
        className: "grid min-h-[26rem] place-items-center p-8 text-center text-sm text-secondary",
        role: "status"
      }, L ? "No derivation relationships match your search." : "No derivation rules.");
    const h = W == null ? void 0 : W.tagId, x = /* @__PURE__ */ new Set();
    return W && (x.add(W.tagId), p.connections.forEach((S) => {
      (S.sourceTagId === W.tagId || S.derivedTagId === W.tagId) && (x.add(S.sourceTagId), x.add(S.derivedTagId));
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
        ...p.groups.map((S) => n("div", {
          key: `group:${S.componentId}:${S.key}`,
          className: `absolute rounded-xl border ${D === S.key ? "border-accent/60 bg-accent/5" : "border-border bg-surface/75"}`,
          style: {
            left: `${S.x}px`,
            top: `${S.y}px`,
            width: `${S.width}px`,
            height: `${S.height}px`
          }
        }, n("div", {
          className: "absolute left-3 top-2 max-w-[16rem] truncate text-[11px] font-semibold uppercase tracking-wide text-secondary",
          title: S.name
        }, S.name))),
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
          ...p.connections.map((S) => {
            const N = h === S.sourceTagId || h === S.derivedTagId, E = W != null, J = N ? "var(--color-accent)" : "var(--color-secondary)";
            return n("path", {
              key: `${S.id}:visible`,
              d: S.path,
              fill: "none",
              stroke: J,
              strokeWidth: N ? 2.5 : 1.5,
              opacity: E && !N ? 0.2 : 0.7,
              markerEnd: `url(#${t})`
            });
          })
        ]),
        ...p.nodes.map((S) => {
          const N = !L || S.name.toLocaleLowerCase().includes(L), E = W != null, J = x.has(S.tagId), U = (W == null ? void 0 : W.tagId) === S.tagId;
          return n("button", {
            key: `node:${S.tagId}`,
            type: "button",
            onClick: () => se({ type: "node", id: S.tagId }),
            className: `absolute z-20 overflow-hidden rounded-lg border px-3 py-2 text-left shadow-sm transition ${U ? "border-accent bg-accent/15 ring-2 ring-accent/25" : J ? "border-accent/70 bg-card" : "border-border bg-card hover:border-accent/60 hover:bg-muted/30"}`,
            style: {
              left: `${S.x}px`,
              top: `${S.y}px`,
              width: `${S.width}px`,
              height: `${S.height}px`,
              opacity: !N || E && !J ? 0.62 : 1
            },
            title: `${S.name} — ${S.segmentGroupName}`,
            "aria-label": `${S.name}, ${S.incomingRuleCount} incoming and ${S.outgoingRuleCount} outgoing derivation rules`
          }, [
            n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground" }, S.name),
            n("span", { key: "counts", className: "mt-1 flex items-center gap-2 text-[11px] text-secondary" }, [
              n("span", { key: "in" }, `${S.incomingRuleCount} in`),
              n("span", { key: "arrow", "aria-hidden": "true" }, "→"),
              n("span", { key: "out" }, `${S.outgoingRuleCount} out`)
            ])
          ]);
        }),
        ...p.connections.filter((S) => S.rules.length > 1).map((S) => {
          const N = p.nodes.find((J) => J.tagId === S.sourceTagId), E = p.nodes.find((J) => J.tagId === S.derivedTagId);
          return n("div", {
            key: `bundle:${S.id}`,
            className: "pointer-events-none absolute z-20 rounded-full border border-amber-500/40 bg-surface px-2 py-0.5 text-[10px] font-medium text-amber-200 shadow",
            style: {
              left: `${(N.x + N.width + E.x) / 2 - 24}px`,
              top: `${(N.y + N.height / 2 + E.y + E.height / 2) / 2 - 10}px`
            },
            "aria-label": `${S.rules.length} rules connect ${S.rules[0].sourceTagName} to ${S.rules[0].derivedTagName}`
          }, `${S.rules.length} rules`);
        })
      ])
    ]);
  }
  function T() {
    if (ue.length === 0)
      return n(
        "p",
        { className: "p-8 text-center text-sm text-secondary", role: "status" },
        L ? "No derivation relationships match your search." : "No derivation rules."
      );
    const h = /* @__PURE__ */ new Map();
    ae.forEach((S) => {
      const N = X(S);
      h.has(N) || h.set(N, []), h.get(N).push(S);
    });
    const x = [
      ...m.segmentGroups.map((S) => S.key),
      "cross-group"
    ].filter((S) => h.has(S));
    return n("div", { className: "overflow-auto", style: { maxHeight: "42rem" } }, x.map((S) => {
      const N = m.segmentGroups.find((U) => U.key === S), E = S === "cross-group" ? "Cross-group relationships" : (N == null ? void 0 : N.name) || "Ungrouped", J = h.get(S);
      return n("section", { key: S, "aria-label": E }, [
        n("div", { key: "heading", className: "sticky top-0 z-10 flex items-center justify-between border-y border-border bg-surface/95 px-3 py-2 backdrop-blur" }, [
          n("h4", { key: "title", className: "text-xs font-semibold uppercase tracking-wide text-secondary" }, E),
          n(
            "span",
            { key: "count", className: "text-xs text-secondary" },
            `${J.length} rule${J.length === 1 ? "" : "s"}`
          )
        ]),
        n("div", { key: "table", role: "table", "aria-label": `${E} derivation rules` }, [
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
            onClick: () => se({ type: "rule", id: U.id }),
            className: `grid w-full gap-3 border-b border-border px-3 py-3 text-left text-sm hover:bg-muted/30 ${(ee == null ? void 0 : ee.id) === U.id ? "bg-accent/10" : ""}`,
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
          `${A.length} rules · ${m.nodes.length} tags`
        )
      ]),
      n("button", {
        key: "add",
        type: "button",
        disabled: r || d != null,
        onClick: () => {
          P(f()), se(null), v();
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
          onChange: (h) => {
            ce(h.target.value), se(null);
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
          onChange: (h) => {
            z(h.target.value), se(null), P(null);
          },
          "aria-label": "Segment group",
          className: "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground disabled:opacity-50"
        }, [
          n("option", { key: "all", value: "all" }, "All Segment groups"),
          ...m.segmentGroups.map((h) => n("option", { key: h.key, value: h.key }, h.name))
        ])
      ]),
      B === "list" ? n("label", { key: "sort", className: "min-w-[10rem] space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Sort"),
        n("select", {
          key: "select",
          value: b,
          onChange: (h) => G(h.target.value),
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
        ].map(([h, x]) => n("button", {
          key: h,
          type: "button",
          onClick: () => {
            H(h), h === "graph" && (q == null ? void 0 : q.type) === "rule" && se(null);
          },
          "aria-pressed": B === h,
          className: `rounded px-3 py-1.5 text-sm font-medium ${B === h ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
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
        B === "graph" ? ie() : T()
      ),
      n("aside", {
        key: "details",
        className: "min-w-0 overflow-auto bg-surface",
        style: { maxHeight: "42rem" },
        "aria-label": "Rule details"
      }, [
        n("div", { key: "heading", className: "border-b border-border px-4 py-3 text-sm font-semibold text-foreground" }, "Rule details"),
        d ? be() : V()
      ])
    ])),
    n("div", { key: "footer", className: "flex flex-wrap items-center justify-end gap-2 border-t border-border px-4 py-3" }, [
      I ? n("p", { key: "message", role: "status", className: "text-sm text-secondary" }, I) : null
    ]),
    i ? n(xo, {
      key: `derivation-configure-tag:${i.tagId}`,
      tagId: i.tagId,
      tagName: i.tagName,
      onSaved: () => K(i),
      onClose: () => {
        const h = i.trigger;
        C(null), requestAnimationFrame(() => {
          h != null && h.isConnected && h.focus();
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
  }), [o, i] = j([]), [a, s] = j(null), [l, d] = j([]), [c, g] = j([]), [u, f] = j(!1), [m, p] = j(!1), [b, y] = j(!1), [w, k] = j(""), [I, L] = j(""), [R, K] = j("graph"), [v, A] = j("all"), [$, D] = j(null), [W, ee] = j("relationship"), [q, C] = j(null), [P, G] = j(null), te = fe(null), ce = fe(null), z = di().replace(/:/g, "");
  function se() {
    requestAnimationFrame(() => {
      var M;
      return (M = te.current) == null ? void 0 : M.scrollIntoView({ block: "nearest" });
    });
  }
  async function H(M) {
    const Y = await Z("/derivation-rules", M ? { signal: M } : void 0);
    i(Y || []);
  }
  ye(() => {
    const M = new AbortController();
    return H(M.signal).catch((Y) => {
      Y.name !== "AbortError" && k(Y.message || "Unable to load derived segment rules.");
    }), () => M.abort();
  }, []), ye(() => {
    const M = new AbortController();
    return a != null && a.sourceTagId ? (f(!0), Z(`/slot-definitions/${a.sourceTagId}`, { signal: M.signal }).then((Y) => d(Y.definitions || [])).catch((Y) => {
      Y.name !== "AbortError" && d([]);
    }).finally(() => {
      M.signal.aborted || f(!1);
    })) : (d([]), f(!1)), a != null && a.derivedTagId ? (p(!0), Z(`/slot-definitions/${a.derivedTagId}`, { signal: M.signal }).then((Y) => g(Y.definitions || [])).catch((Y) => {
      Y.name !== "AbortError" && g([]);
    }).finally(() => {
      M.signal.aborted || p(!1);
    })) : (g([]), p(!1)), () => M.abort();
  }, [a == null ? void 0 : a.sourceTagId, a == null ? void 0 : a.derivedTagId]), ye(() => {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId) || a.ruleId != null || u || m)
      return;
    const M = `${a.sourceTagId}:${a.derivedTagId}`;
    ce.current !== M && (ce.current = M, s((Y) => !Y || Number(Y.sourceTagId) !== Number(a.sourceTagId) || Number(Y.derivedTagId) !== Number(a.derivedTagId) ? Y : yd(Y, l, c)));
  }, [
    a == null ? void 0 : a.ruleId,
    a == null ? void 0 : a.sourceTagId,
    a == null ? void 0 : a.derivedTagId,
    l,
    c,
    u,
    m
  ]);
  function ae(M, Y = !1) {
    Y || D({ type: "rule", id: M.id }), ce.current = null, s({
      ruleId: M.id,
      sourceTagId: M.sourceTagId,
      sourceTagName: M.sourceTagName,
      derivedTagId: M.derivedTagId,
      derivedTagName: M.derivedTagName,
      slotMappings: M.slotMappings.map((_) => ({
        sourceSlotDefinitionId: _.sourceSlotDefinitionId,
        derivedSlotDefinitionId: _.derivedSlotDefinitionId
      })),
      slotMappingsSuggested: !1
    }), k(""), se();
  }
  function ge(M, Y, _ = "") {
    ce.current = null, M === "source" ? (d([]), f(Y != null)) : (g([]), p(Y != null)), s((me) => ({
      ...me,
      [`${M}TagId`]: Y == null ? null : Number(Y),
      [`${M}TagName`]: _ || "",
      slotMappings: [],
      slotMappingsSuggested: !1
    }));
  }
  async function xe(M) {
    (a == null ? void 0 : a.ruleId) == null && (ce.current = null);
    const Y = [H(), t == null ? void 0 : t()];
    return M.draftKind === "source" ? (f(!0), Y.push(Z(`/slot-definitions/${M.tagId}`).then((_) => d(_.definitions || [])).finally(() => f(!1)))) : M.draftKind === "derived" && (p(!0), Y.push(Z(`/slot-definitions/${M.tagId}`).then((_) => g(_.definitions || [])).finally(() => p(!1)))), Promise.all(Y);
  }
  function oe(M, Y, _) {
    s((me) => ({
      ...me,
      slotMappings: me.slotMappings.map((Me, Ne) => Ne === M ? { ...Me, [Y]: _ } : Me)
    }));
  }
  async function he() {
    if (!(a != null && a.sourceTagId) || !(a != null && a.derivedTagId)) return;
    const M = Ia(a, o);
    if (M) {
      k(M.message);
      return;
    }
    if (a.slotMappings.some((Y) => !Y.sourceSlotDefinitionId || !Y.derivedSlotDefinitionId)) {
      k("Complete or remove every performer slot mapping before saving.");
      return;
    }
    y(!0), k(a.ruleId == null ? "Saving derived segment rule…" : "Previewing materializations that must be removed…");
    try {
      let Y = null;
      if (a.ruleId != null) {
        const me = await Z(
          `/derivation-rules/${a.ruleId}/deletion/preview`,
          { method: "POST" }
        );
        if (!window.confirm(
          `Saving this rule removes its existing materializations.

Deleted segments: ${me.deletedSegmentCount}
Removed lineage edges: ${me.removedEdgeCount}
Shared derived segments retained: ${me.retainedSharedSegmentCount}

Continue saving?`
        )) return;
        Y = me.fingerprint;
      }
      k("Saving derived segment rule…");
      const _ = await Z("/derivation-rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleId: a.ruleId,
          sourceTagId: a.sourceTagId,
          derivedTagId: a.derivedTagId,
          slotMappings: a.slotMappings,
          cleanupFingerprint: Y
        })
      });
      if (await H(), D(R === "graph" ? { type: "node", id: Number(_.sourceTagId) } : { type: "rule", id: _.id }), s(null), a.ruleId == null)
        try {
          const me = await Z(
            `/derivation-rules/${_.id}/materialization/preview`,
            { method: "POST" }
          );
          C(
            me.createCount + me.linkCount > 0 ? me : null
          ), k(me.createCount + me.linkCount > 0 ? "Rule saved. Its pending derivations can be materialized now or later." : "Derived segment rule saved; every applicable derivation is already materialized.");
        } catch {
          C(null), k("Rule saved. Pending derivations can be materialized from the rule later.");
        }
      else
        C(null), k("Derived segment rule saved. Previous materializations were removed.");
    } catch (Y) {
      k(Y.message || "Unable to save derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function B(M) {
    y(!0), k("Previewing rule deletion…");
    try {
      const Y = await Z(
        `/derivation-rules/${M.id}/deletion/preview`,
        { method: "POST" }
      );
      if (!window.confirm(
        `Delete ${M.sourceTagName} → ${M.derivedTagName}?

Deleted segments: ${Y.deletedSegmentCount}
Removed lineage edges: ${Y.removedEdgeCount}
Shared derived segments retained: ${Y.retainedSharedSegmentCount}

This cannot be undone.`
      )) return;
      const _ = `derivation-rule-delete:${M.id}:${Y.fingerprint}`;
      await Z(`/derivation-rules/${M.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(_),
          fingerprint: Y.fingerprint
        })
      }), Ue(_), await H(), (a == null ? void 0 : a.ruleId) === M.id && s(null), ($ == null ? void 0 : $.type) === "rule" && $.id === M.id && D(null), (q == null ? void 0 : q.ruleId) === M.id && C(null), k(`Rule deleted with ${Y.deletedSegmentCount} exclusively derived segment${Y.deletedSegmentCount === 1 ? "" : "s"}.`);
    } catch (Y) {
      k(Y.message || "Unable to delete derived segment rule.");
    } finally {
      y(!1);
    }
  }
  async function ue(M, Y = null) {
    const _ = Y || await Z(
      `/derivation-rules/${M.id}/materialization/preview`,
      { method: "POST" }
    );
    if (_.createCount + _.linkCount === 0)
      return { createdCount: 0, linkedCount: 0 };
    const me = `derivation-rule-materialize:${M.id}:${_.fingerprint}`, Me = await Z(`/derivation-rules/${M.id}/materialize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operationId: Fe(me),
        fingerprint: _.fingerprint
      })
    });
    return Ue(me), Me;
  }
  async function re(M, Y = null) {
    y(!0), k("Finding pending derivations…");
    try {
      const _ = await ue(M, Y);
      if (C(null), await H(), _.createdCount + _.linkedCount === 0) {
        k("Every applicable derivation is already materialized.");
        return;
      }
      k(
        `${_.createdCount} derived segment${_.createdCount === 1 ? "" : "s"} created and ${_.linkedCount} existing segment${_.linkedCount === 1 ? "" : "s"} linked.`
      );
    } catch (_) {
      k(_.message || "Unable to materialize pending derivations.");
    } finally {
      y(!1);
    }
  }
  async function X(M, Y) {
    if (Y.length === 0) return;
    y(!0), k(`Finding pending derivations from ${M.name}…`);
    let _ = 0, me = 0;
    try {
      for (const Me of Y) {
        const Ne = await ue(Me);
        _ += Ne.createdCount, me += Ne.linkedCount;
      }
      C(null), await H(), k(_ + me === 0 ? `Every outgoing derivation from ${M.name} is already materialized.` : `${_} derived segment${_ === 1 ? "" : "s"} created and ${me} existing segment${me === 1 ? "" : "s"} linked from ${M.name}.`);
    } catch (Me) {
      await H().catch(() => {
      }), k(Me.message || `Unable to materialize derivations from ${M.name}.`);
    } finally {
      y(!1);
    }
  }
  const be = Ia(a, o), V = qe(
    () => Lc(o, e),
    [o, e]
  ), ie = I.trim().toLocaleLowerCase(), h = V.components.filter((M) => v === "all" || M.segmentGroupKeys.includes(v)).filter((M) => !ie || M.nodes.some((Y) => Y.name.toLocaleLowerCase().includes(ie))), x = h.flatMap((M) => M.rules), S = new Set(
    h.flatMap((M) => M.nodes.map((Y) => Y.tagId))
  ), N = qe(
    () => jc(h),
    [h]
  ), E = R === "list" ? Bc(
    $,
    x,
    ie.length > 0
  ) : null, J = ($ == null ? void 0 : $.type) === "node" && V.nodes.find((M) => M.tagId === $.id && S.has(M.tagId)) || null, U = [...x].sort((M, Y) => W === "source" ? gt(M.sourceTagName, Y.sourceTagName) || gt(M.derivedTagName, Y.derivedTagName) : W === "target" ? gt(M.derivedTagName, Y.derivedTagName) || gt(M.sourceTagName, Y.sourceTagName) : W === "materialized" ? (Number(Y.edgeCount) || 0) - (Number(M.edgeCount) || 0) || gt(M.sourceTagName, Y.sourceTagName) : gt(
    `${M.sourceTagName} ${M.derivedTagName}`,
    `${Y.sourceTagName} ${Y.derivedTagName}`
  ));
  return n(Gc, {
    arrowMarkerId: z,
    busy: b,
    buttonClass: "rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted/40 disabled:opacity-50",
    configuringTag: P,
    deleteRule: B,
    derivedSlots: c,
    derivedSlotsLoading: m,
    draft: a,
    draftIssue: be,
    editRule: ae,
    editorRef: te,
    emptyDraft: r,
    graph: V,
    layout: N,
    listSort: W,
    materializationOffer: q,
    materializeOutgoingRules: X,
    materializeRule: re,
    message: w,
    normalizedQuery: ie,
    query: I,
    refreshConfiguredTag: xe,
    revealEditor: se,
    rules: o,
    save: he,
    segmentGroupKey: v,
    selectedNode: J,
    selectedRule: E,
    selection: $,
    setConfiguringTag: G,
    setDraft: s,
    setListSort: ee,
    setMaterializationOffer: C,
    setQuery: L,
    setSegmentGroupKey: A,
    setSelection: D,
    setView: K,
    sortedVisibleRules: U,
    sourceSlots: l,
    sourceSlotsLoading: u,
    updateMapping: oe,
    updateTag: ge,
    view: R,
    visibleComponents: h,
    visibleRules: x
  });
}
function Kc() {
  const [e, t] = j(ri), r = [
    ["smallSeekTime", "Small seek (seconds)", 0.1, 60, 0.5],
    ["mediumSeekTime", "Medium seek (seconds)", 0.1, 120, 0.5],
    ["longSeekTime", "Long seek (seconds)", 1, 300, 1],
    ["smallFrameStep", "Small frame step (frames)", 1, 30, 1],
    ["mediumFrameStep", "Medium frame step (frames)", 1, 120, 1],
    ["longFrameStep", "Long frame step (frames)", 1, 300, 1]
  ];
  function o(a, s) {
    t((l) => na({ ...l, [a]: s }));
  }
  function i() {
    t(na(lo));
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
  const [o, i] = j([]), [a, s] = j(!1), [l, d] = j(!1), [c, g] = j(""), [u, f] = j(""), [m, p] = j("all"), [b, y] = j(() => /* @__PURE__ */ new Set()), [w, k] = j(null);
  ye(() => {
    if (!e || a) return;
    const C = new AbortController();
    return d(!0), g(""), Z("/slot-definitions", { signal: C.signal }).then((P) => {
      i(P || []), s(!0);
    }).catch((P) => {
      P.name !== "AbortError" && g(P.message || "Unable to load performer slot definitions.");
    }).finally(() => {
      C.signal.aborted || d(!1);
    }), () => C.abort();
  }, [e, a]);
  async function I() {
    d(!0), g("");
    try {
      const C = await Z("/slot-definitions");
      i(C || []), s(!0);
    } catch (C) {
      g(C.message || "Unable to load performer slot definitions.");
    } finally {
      d(!1);
    }
  }
  async function L() {
    const [C] = await Promise.all([
      Z("/slot-definitions"),
      r == null ? void 0 : r()
    ]);
    i(C || []), s(!0), g("");
  }
  function R() {
    const C = w == null ? void 0 : w.trigger;
    k(null), requestAnimationFrame(() => {
      C != null && C.isConnected && C.focus({ preventScroll: !0 });
    });
  }
  function K(C) {
    y((P) => {
      const G = new Set(P);
      return G.has(C) ? G.delete(C) : G.add(C), G;
    });
  }
  const v = qe(
    () => Oc(t, o),
    [t, o]
  ), A = qe(
    () => Pc(v, u, m),
    [v, u, m]
  ), $ = v.flatMap((C) => C.tags), D = $.filter((C) => C.definitions.length > 0).length, W = $.length - D, ee = [
    ["all", "All"],
    ["with", "With slots"],
    ["without", "Without slots"]
  ], q = "rounded-md border border-border bg-card px-3 py-1.5 text-xs font-medium text-secondary hover:border-accent/60 hover:text-foreground";
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
        `${$.length} tags · ${D} with slots · ${W} without slots`
      ) : null
    ]),
    n("div", { key: "toolbar", className: "flex flex-wrap items-end gap-3 rounded-lg border border-border bg-surface p-3" }, [
      n("label", { key: "search", className: "min-w-[16rem] flex-1 space-y-1 text-xs text-secondary" }, [
        n("span", { key: "label" }, "Search"),
        n("input", {
          key: "input",
          type: "search",
          value: u,
          onChange: (C) => f(C.target.value),
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
          ee.map(([C, P]) => n("button", {
            key: C,
            type: "button",
            onClick: () => p(C),
            "aria-pressed": m === C,
            className: `rounded px-3 py-1.5 text-xs font-medium ${m === C ? "bg-accent/20 text-foreground" : "text-secondary hover:text-foreground"}`
          }, P))
        )
      ]),
      n("div", { key: "group-actions", className: "ml-auto flex items-center gap-2" }, [
        n("button", {
          key: "expand",
          type: "button",
          onClick: () => y(/* @__PURE__ */ new Set()),
          className: q
        }, "Expand all"),
        n("button", {
          key: "collapse",
          type: "button",
          onClick: () => y(new Set(v.map((C) => C.overviewKey))),
          className: q
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
    a && A.length === 0 ? n(
      "p",
      { key: "empty", role: "status", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" },
      "No tags match the current search and coverage filter."
    ) : null,
    a ? n("div", { key: "groups", className: "space-y-3" }, A.map((C) => {
      const P = b.has(C.overviewKey), G = C.tags.filter((te) => te.definitions.length > 0).length;
      return n("article", {
        key: C.overviewKey,
        className: "overflow-hidden rounded-lg border border-border bg-surface"
      }, [
        n("button", {
          key: "header",
          type: "button",
          onClick: () => K(C.overviewKey),
          "aria-expanded": !P,
          className: "flex w-full items-center gap-3 border-b border-border bg-card/40 px-4 py-3 text-left hover:bg-muted/30"
        }, [
          n("span", { key: "indicator", "aria-hidden": "true", className: "w-4 shrink-0 text-secondary" }, P ? "▸" : "▾"),
          n("span", { key: "name", className: "min-w-0 flex-1 font-semibold text-foreground" }, C.name),
          n(
            "span",
            { key: "count", className: "shrink-0 text-xs text-secondary" },
            `${C.tags.length} tag${C.tags.length === 1 ? "" : "s"} · ${G} with slots`
          )
        ]),
        P ? null : n(
          "ul",
          { key: "tags", className: "divide-y divide-border" },
          C.tags.map((te) => n("li", {
            key: te.tagId,
            className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-start"
          }, [
            n("div", {
              key: "tag",
              className: "min-w-0",
              style: { width: "14rem", flexShrink: 0 }
            }, [
              n("span", { key: "name", className: "block truncate text-sm font-medium text-foreground", title: te.tagName }, te.tagName),
              te.allowSamePerformerInMultipleSlots ? n(
                "span",
                { key: "duplicates", className: "mt-1 inline-flex rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] text-accent" },
                "Allow same performer"
              ) : null
            ]),
            te.definitions.length === 0 ? n("span", {
              key: "empty",
              className: "text-sm text-secondary",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, "No performer slots") : n("ul", {
              key: "slots",
              "aria-label": `Performer slots for ${te.tagName}`,
              className: "grid min-w-0 gap-2",
              style: { width: "100%", maxWidth: "32rem", flexShrink: 1 }
            }, te.definitions.map((ce) => n("li", {
              key: ce.id,
              className: "flex w-full flex-wrap items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs"
            }, [
              n("span", { key: "label", className: "font-medium text-foreground" }, ft(ce)),
              ...(ce.genderHints || []).map((z) => n("span", {
                key: z,
                className: "rounded-full bg-muted/50 px-1.5 py-0.5 text-[10px] text-secondary"
              }, xr(z)))
            ]))),
            n("button", {
              key: "edit",
              type: "button",
              onClick: (ce) => k({
                tagId: te.tagId,
                tagName: te.tagName,
                trigger: ce.currentTarget
              }),
              "aria-label": `Edit performer slots for ${te.tagName}`,
              className: `${q} self-start`,
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
      onSaved: L,
      onClose: R
    }) : null
  ]);
}
function Hc({ onNavigate: e, profile: t, onProfileChange: r }) {
  const [o, i] = j("general"), [a, s] = j([]), [l, d] = j(!1), [c, g] = j(""), [u, f] = j(""), [m, p] = j(null), [b, y] = j(!0), [w, k] = j(!1), [I, L] = j(""), [R, K] = j(!0), [v, A] = j(qa), $ = El(t), D = $.map(([P]) => P);
  ye(() => {
    D.includes(o) || i(D[0] || "general");
  }, [t.effectiveMode]);
  async function W(P) {
    const G = await Z("/segment-groups", P ? { signal: P } : void 0);
    s(G || []);
  }
  ye(() => {
    const P = new AbortController();
    return W(P.signal).catch((G) => {
      G.name !== "AbortError" && g(G.message || "Unable to load tag groups.");
    }), () => P.abort();
  }, []), ye(() => {
    if (t.effectiveMode !== "full") {
      y(!1);
      return;
    }
    const P = new AbortController();
    return L(""), y(!0), Promise.all([
      Z("/analysis/settings", { signal: P.signal }),
      Z("/analysis/status", { signal: P.signal })
    ]).then(([G, te]) => {
      K(!0), f((G == null ? void 0 : G.baseUrl) || ""), p(te);
    }).catch((G) => {
      if (G.name !== "AbortError") {
        if (G.status === 403) {
          K(!1), L("You do not have permission to manage the analysis service connection.");
          return;
        }
        L(G.message || "Unable to load analysis service settings.");
      }
    }).finally(() => {
      P.signal.aborted || y(!1);
    }), () => P.abort();
  }, [t.effectiveMode]);
  async function ee(P) {
    if (P !== t.requestedMode) {
      d(!0), g("");
      try {
        const G = await Z(
          `/preferences/transition?mode=${encodeURIComponent(P)}`
        );
        let te = !1, ce = null, z = null, se = null, H = !1;
        if (t.requestedMode === "basic" && P === "full") {
          if (!window.confirm(Pl(
            G.recyclingBinCount,
            G.protectedRecyclingBinCount
          )))
            return;
          H = !0, G.recyclingBinCount > 0 && (te = !0, se = G.recyclingBinFingerprint, ce = `mode-switch-empty-bin:${se}`, z = Fe(ce));
        }
        let ae = !1;
        if (t.requestedMode === "full" && P === "basic") {
          if (!window.confirm(Ol(
            G.extensionOwnedSegmentCount
          )))
            return;
          ae = !0;
        }
        const ge = await Z("/preferences", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: P,
            confirmHiddenExtensionOwnedSegments: ae,
            confirmBasicHistoryCleanup: H,
            emptyRecyclingBin: te,
            operationId: z,
            expectedRecyclingBinFingerprint: se
          })
        });
        ce && Ue(ce), r == null || r(oi(ge)), g("Workflow mode saved.");
      } catch (G) {
        g(G.message || "Unable to save workflow mode.");
      } finally {
        d(!1);
      }
    }
  }
  async function q(P) {
    P.preventDefault(), k(!0), L("");
    try {
      const G = await Z("/analysis/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ baseUrl: u })
      });
      f((G == null ? void 0 : G.baseUrl) || "");
      const te = await Z("/analysis/status");
      p(te), L(G != null && G.baseUrl ? te != null && te.ready ? "Analysis Server URL saved. The service is ready." : `Analysis Server URL saved. ${(te == null ? void 0 : te.error) || "The service is not ready."}` : "Analysis service disabled.");
    } catch (G) {
      L(G.message || "Unable to save analysis service settings.");
    } finally {
      k(!1);
    }
  }
  const C = { page: "segment-studio" };
  return n("div", {
    className: "mx-auto w-full max-w-none space-y-5 px-0 py-4 sm:py-6"
  }, [
    n("a", { key: "back", href: "/segment-studio", onClick: (P) => Ni(P, e, C), className: "inline-flex text-sm font-medium text-accent hover:underline" }, "← Go back"),
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
      $.map(([P, G]) => n("button", {
        key: P,
        type: "button",
        onClick: () => i(P),
        "aria-current": o === P ? "page" : void 0,
        className: `shrink-0 border-b-2 px-4 py-2 text-sm font-semibold ${o === P ? "border-accent text-foreground" : "border-transparent text-secondary hover:text-foreground"}`
      }, G))
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
        onModeChange: ee,
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
          checked: v,
          onChange: (P) => {
            const G = P.target.checked;
            Wa(G), A(G);
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
      n("form", { key: "form", onSubmit: q, className: "flex flex-col gap-3 sm:flex-row sm:items-end" }, [
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
        I || (b ? "Loading analysis service settings…" : (m == null ? void 0 : m.configured) === !1 ? "Full Scan is not configured." : m != null && m.ready ? "Analysis service is ready." : (m == null ? void 0 : m.error) || "Analysis service is configured but not ready.")
      )
    ]) : null,
    D.includes("derivation") ? n(
      "div",
      { key: "derivation-rules-panel", hidden: o !== "derivation" },
      n(Uc, {
        segmentGroups: a,
        onSegmentGroupsChanged: () => W()
      })
    ) : null,
    D.includes("performer-slots") ? n(
      "div",
      { key: "performer-slots-panel", hidden: o !== "performer-slots" },
      n(zc, {
        active: o === "performer-slots",
        segmentGroups: a,
        onSegmentGroupsChanged: () => W()
      })
    ) : null,
    c ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, c) : null
  ]);
}
function Ca({ facets: e, values: t, disabled: r, onChange: o }) {
  var i;
  return r ? n(
    "p",
    { className: "rounded-md border border-dashed border-border p-3 text-xs text-secondary" },
    "Performer slot filters are unavailable for your current access. Browse and playback remain available."
  ) : (i = e == null ? void 0 : e.slots) != null && i.length ? n("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3" }, e.slots.map((a) => n("label", { key: a.id, className: "space-y-1 text-xs text-secondary" }, [
    n("span", { key: "label" }, ft(a)),
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
    label: ft(f),
    performer: { id: f.performerId, name: f.performerName }
  })), c = ii(e);
  return n("article", {
    className: "overflow-hidden rounded-md border border-border bg-card shadow-sm",
    style: fi(t)
  }, [
    n("button", { key: "select", type: "button", onClick: o, "data-segment-key": e.key, className: "block w-full text-left focus:outline-none focus:ring-2 focus:ring-accent", "aria-label": `Play ${((g = e.activity) == null ? void 0 : g.name) || "segment"}, ${e.reviewState}, ${Ae(e.startSec)} to ${e.endSec == null ? "end of video" : Ae(e.endSec)}` }, [
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
          n(nn, { key: "state", state: e.reviewState, includeLabel: !1 }),
          n("span", { key: "activity", className: "line-clamp-1 min-w-0 flex-1 text-sm font-semibold text-foreground" }, ((u = e.activity) == null ? void 0 : u.name) || "Tag segment"),
          l.length ? n(Sr, {
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
    l ? n("div", { key: "player", className: "aspect-video overflow-hidden rounded-md bg-black" }, n(Ma, {
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
      n("a", { key: "edit", href: ii(e), className: "text-sm font-semibold text-accent hover:underline" }, "Edit segment")
    ])
  ]);
}
function $a({ onNavigate: e, profile: t }) {
  const r = qe(() => {
    const H = Da("ext:com.midnightrider.segment-studio:segments");
    return H ? {
      ...Hr,
      defaultFilter: { ...Hr.defaultFilter, ...H.findFilter || {} },
      defaultObjectFilter: H.objectFilter || {}
    } : Hr;
  }, []), { filter: o, objectFilter: i, setFilter: a, setObjectFilter: s } = Oa(r), [l, d] = j(null), [c, g] = j({ items: [], totalCount: 0, performerSlotsAvailable: !0 }), [u, f] = j(null), [m, p] = j(null), [b, y] = j(0), [w, k] = j(""), [I, L] = j(!0), [R, K] = j(""), v = fe(0), A = oa(o, i), $ = A.activityTagId, D = bn(i.slots), W = qe(() => [{
    id: "slots",
    label: "Performer Slots",
    filterKey: "slots",
    defaultValue: void 0,
    isActive: (H) => Object.keys(bn(H)).length > 0,
    sanitize: (H) => _r($, bn(H)),
    summarize: (H) => `${Object.keys(bn(H)).length} assigned`,
    renderEditor: (H, ae) => $ ? n(Ca, {
      facets: l,
      values: bn(H),
      disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted),
      onChange: (ge, xe) => {
        const oe = { ...bn(H) };
        xe ? oe[ge] = Number(xe) : delete oe[ge], ae(_r($, oe));
      }
    }) : n("p", { className: "text-sm text-secondary" }, "Select one tag before filtering performer slots.")
  }], [$, l, c.performerSlotsAvailable]), ee = JSON.stringify(A);
  ye(() => {
    if (d(null), !$) return;
    const H = new AbortController();
    return Z(`/browse/activities/${$}/facets`, { signal: H.signal }).then(d).catch((ae) => {
      ae.status === 403 ? d({ slots: [], restricted: !0 }) : ae.name !== "AbortError" && K(ae.message);
    }), () => H.abort();
  }, [$]), ye(() => {
    const H = ++v.current, ae = new AbortController();
    return L(!0), K(""), Z("/browse/segments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(A), signal: ae.signal }).then((ge) => {
      H === v.current && g({ ...ge, totalCount: ge.totalCount ?? ge.total ?? 0 });
    }).catch((ge) => {
      if (!(H !== v.current || ge.name === "AbortError")) {
        if (ge.status === 400 && ge.message.includes("unrestricted performer read access")) {
          g((xe) => ({ ...xe, performerSlotsAvailable: !1 })), s({ ...i, performerId: void 0, performersCriterion: void 0, slots: void 0 }), K("Performer filters were cleared because performer details are unavailable.");
          return;
        }
        K(ge.message);
      }
    }).finally(() => {
      H === v.current && L(!1);
    }), () => {
      v.current++, ae.abort();
    };
  }, [ee, b]);
  const q = c.items.findIndex((H) => H.key === u), C = c.items[q] || null;
  function P(H) {
    s(H), a({ ...o, page: 1 });
  }
  function G(H) {
    const ae = oa(o, H), ge = H.slots && ae.activityTagId != null && ae.slotAssignments.length > 0 ? H.slots : void 0;
    P({ ...H, slots: ge });
  }
  function te(H, ae) {
    const ge = { ...D };
    ae ? ge[H] = Number(ae) : delete ge[H], P({ ...i, slots: _r($, ge) });
  }
  function ce() {
    const H = document.querySelector(`[data-segment-key="${u}"]`);
    f(null), requestAnimationFrame(() => H == null ? void 0 : H.focus());
  }
  async function z(H) {
    var xe;
    if (!window.confirm("Restore this rejected segment to Cove? It will receive a new native ID.")) return;
    p(H.key), k("");
    const ae = `browse-restore:${H.itemId}:${H.revision}`, ge = Fe(ae);
    try {
      const oe = (he = !1) => Z(`/bin/${H.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: ge,
          expectedRevision: H.revision,
          discardMissingImage: he
        })
      });
      try {
        await oe(go(ae));
      } catch (he) {
        if (((xe = he.payload) == null ? void 0 : xe.code) !== "missing-image" || !window.confirm(`${he.message}

Continue and discard the missing image reference?`))
          throw he;
        po(ae), await oe(!0);
      }
      Ue(ae), u === H.key && f(null), k("Segment restored to Cove."), y((he) => he + 1);
    } catch (oe) {
      k(oe.message || "Unable to restore the segment."), oe.status === 409 && y((he) => he + 1);
    } finally {
      p(null);
    }
  }
  async function se(H) {
    p(H.key), k("");
    try {
      const ae = await Z(`/items/${H.itemId}/delete/preview`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ expectedRevision: H.revision })
      });
      if (!ui(ae, k) || !Xl(ae))
        return;
      const ge = `browse-dependency-delete:${H.itemId}:${ae.fingerprint}`;
      await Z(`/items/${H.itemId}/delete/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          operationId: Fe(ge),
          fingerprint: ae.fingerprint
        })
      }), Ue(ge), u === H.key && f(null), k(`${ae.deletedSegmentCount} segment${ae.deletedSegmentCount === 1 ? "" : "s"} permanently deleted.`), y((xe) => xe + 1);
    } catch (ae) {
      k(ae.message || "Unable to permanently delete the segment."), ae.status === 409 && y((ge) => ge + 1);
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
    n(Pa, {
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
      error: R ? new Error(R) : null,
      onRetry: () => y((H) => H + 1),
      sortOptions: [{ value: "default", label: "Updated" }],
      displayMode: "grid",
      availableDisplayModes: ["grid"],
      criteriaDefinitions: c.performerSlotsAvailable === !1 ? ra.filter((H) => H.id !== "performers") : ra,
      objectFilter: i,
      onObjectFilterChange: G,
      customFilterSections: W,
      searchPlaceholder: "Search segments..."
    }, [
      $ ? n(Ca, { key: "slots", facets: l, values: D, disabled: c.performerSlotsAvailable === !1 || (l == null ? void 0 : l.restricted), onChange: te }) : null,
      n(qc, { key: "player", item: C, index: q, count: c.items.length, onPrevious: () => {
        var H;
        return f((H = c.items[q - 1]) == null ? void 0 : H.key);
      }, onNext: () => {
        var H;
        return f((H = c.items[q + 1]) == null ? void 0 : H.key);
      }, onClose: ce, onNavigate: e }),
      w ? n("p", { key: "message", role: "status", className: "rounded-md border border-border bg-card px-3 py-2 text-sm text-secondary" }, w) : null,
      !I && c.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No segments match these filters.") : null,
      I ? null : n("section", { key: "cards", "aria-label": "Browse results", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, c.items.map((H) => n(_c, {
        key: H.key,
        item: H,
        selected: H.key === u,
        busy: m === H.key,
        onSelect: () => f(H.key),
        onRestore: z,
        onPurge: se
      })))
    ])
  ]);
}
function Wc({ onNavigate: e, profile: t }) {
  const [r, o] = j([]), [i, a] = j(""), [s, l] = j(0), [d, c] = j(!0), [g, u] = j(null), [f, m] = j(""), p = fe(null);
  async function b(k) {
    const I = await Z("/bin", k ? { signal: k } : void 0);
    return o(I.items || []), a(I.fingerprint || ""), l(Number(I.totalCount) || 0), I;
  }
  ye(() => {
    const k = new AbortController();
    return c(!0), b(k.signal).catch((I) => {
      I.name !== "AbortError" && m(I.message);
    }).finally(() => {
      k.signal.aborted || c(!1);
    }), () => k.abort();
  }, []), Ea(so, [{
    id: "system.emptyBin",
    surface: "local",
    action: () => {
      var k;
      return (k = p.current) == null ? void 0 : k.call(p);
    }
  }]);
  async function y(k) {
    var R;
    if (!window.confirm("Restore this segment to Cove? It will receive a new native ID. Relationships owned outside Segment Studio that referenced the old native ID will not be restored.")) return;
    u(k.itemId), m("");
    const I = `restore:${k.itemId}:${k.revision}`, L = Fe(I);
    try {
      const K = (v = !1) => Z(`/bin/${k.itemId}/restore`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: L, expectedRevision: k.revision, discardMissingImage: v })
      });
      try {
        await K(go(I));
      } catch (v) {
        if (((R = v.payload) == null ? void 0 : R.code) !== "missing-image" || !window.confirm(`${v.message}

Continue and discard the missing image reference?`)) throw v;
        po(I), await K(!0);
      }
      Ue(I), await b(), Un(), m("Segment restored with a new native ID.");
    } catch (K) {
      m(K.message || "Unable to restore the segment."), K.status === 409 && await b();
    } finally {
      u(null);
    }
  }
  async function w() {
    if (g == null)
      try {
        const k = await gi({
          items: r,
          fingerprint: i,
          totalCount: s
        }, () => {
          u(-1), m("");
        });
        if (k.status !== "emptied") return;
        await b(), Un(), m(`${k.segmentCount} segment${k.segmentCount === 1 ? "" : "s"} from ${k.sceneCount} scene${k.sceneCount === 1 ? "" : "s"} permanently deleted.`);
      } catch (k) {
        m(k.message || "Unable to empty the recycling bin."), k.status === 409 && await b();
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
        n("p", { key: "time", className: "font-mono text-xs text-secondary" }, k.endSec == null ? Ae(k.startSec) : `${Ae(k.startSec)} – ${Ae(k.endSec)}`),
        n("p", { key: "source", className: "mt-1 text-xs text-secondary" }, `Source ${k.sourceKey || "unknown"}`)
      ]),
      n("a", { key: "video", href: `/video/${k.videoId}`, className: "text-sm font-medium text-accent hover:underline" }, "Open video"),
      n("button", { key: "restore", type: "button", disabled: g != null, onClick: () => y(k), className: "rounded-md border border-accent bg-accent/20 px-3 py-2 text-sm font-medium disabled:opacity-50" }, "Restore")
    ]))
  ]);
}
const Ta = "ext:com.midnightrider.segment-studio:videos";
function Vr({
  onNavigate: e,
  compatibilityMode: t = !1,
  mode: r = "editor",
  profile: o
}) {
  const i = qe(() => {
    var re;
    const B = Da(Ta), ue = (re = B == null ? void 0 : B.uiOptions) == null ? void 0 : re.displayMode;
    return B ? {
      ...jn,
      defaultFilter: { ...jn.defaultFilter, ...B.findFilter || {} },
      defaultObjectFilter: B.objectFilter || {},
      defaultDisplayMode: jn.allowedDisplayModes.includes(ue) ? ue : jn.defaultDisplayMode
    } : jn;
  }, []), { filter: a, objectFilter: s, displayMode: l, setFilter: d, setObjectFilter: c, setDisplayMode: g } = Oa(i), [u, f] = j({ items: [], totalCount: 0 }), [m, p] = j(!0), [b, y] = j(""), [w, k] = j(0), [I, L] = j(/* @__PURE__ */ new Set()), [R, K] = j(null), [v, A] = j({ busy: !1, error: "", announcement: "" }), $ = fe(0), D = fe(null), W = fe(null);
  W.current || (W.current = Ec());
  const ee = JSON.stringify(a), q = JSON.stringify(s), C = t || r === "review";
  ye(() => {
    W.current.selectionChanged(), D.current = null, L(/* @__PURE__ */ new Set()), A((B) => ({ busy: B.busy, error: "", announcement: "" }));
  }, [ee, q]), ye(() => {
    if (!C) return;
    const B = new AbortController();
    return Z("/analysis/status", { signal: B.signal }).then(K).catch((ue) => {
      ue.name !== "AbortError" && K({ configured: !0, ready: !1, error: ue.message || "Unable to check Full Scan readiness." });
    }), () => B.abort();
  }, [C]), ye(() => {
    const B = ++$.current, ue = new AbortController();
    return p(!0), y(""), Z(`/videos?${ec(a, s, t ? "compatibility" : r === "review" ? "full" : null)}`, { signal: ue.signal }).then((re) => {
      B === $.current && f(re);
    }).catch((re) => {
      B === $.current && re.name !== "AbortError" && y(re.message || "Unable to discover videos.");
    }).finally(() => {
      B === $.current && p(!1);
    }), () => {
      $.current++, ue.abort();
    };
  }, [ee, q, t, r, w]);
  function P(B) {
    d({ ...B, page: B.page || 1 });
  }
  function G(B) {
    c(B), d({ ...a, page: 1 });
  }
  function te(B, ue = !1) {
    L((re) => tc(
      re,
      u.items.map((X) => X.videoId),
      B,
      D.current,
      ue
    )), D.current = B;
  }
  function ce() {
    D.current = null, L(new Set(u.items.map((B) => B.videoId)));
  }
  function z() {
    D.current = null, L(/* @__PURE__ */ new Set());
  }
  function se() {
    D.current = null, L((B) => new Set(u.items.map((ue) => ue.videoId).filter((ue) => !B.has(ue))));
  }
  async function H(B = ["aiTagging", "omnishotcut"]) {
    const ue = W.current.begin();
    if (ue) {
      A({ busy: !0, error: "", announcement: "" });
      try {
        const re = await Dc(
          [...I],
          B,
          Z,
          (X) => window.confirm(X)
        );
        if (re.cancelled) {
          A({ busy: !1, error: "", announcement: "" });
          return;
        }
        re.queuedIds.length > 0 && W.current.ownsCurrentSelection(ue) && (re.queuedIds.includes(D.current) && (D.current = null), L((X) => {
          const be = new Set(X);
          return re.queuedIds.forEach((V) => be.delete(V)), be;
        })), A({
          busy: !1,
          announcement: re.queuedIds.length > 0 ? `${re.queuedIds.length} ${re.queuedIds.length === 1 ? "scan" : "scans"} queued.` : "",
          error: re.failed.length > 0 ? `${re.failed.length} selected ${re.failed.length === 1 ? "video could" : "videos could"} not be queued. ${re.failed[0].error}` : ""
        });
      } catch (re) {
        A({ busy: !1, error: re.message || "Unable to queue the selected scans.", announcement: "" });
      } finally {
        W.current.finish(ue);
      }
    }
  }
  const ae = t || r === "review" ? ha : ha.filter((B) => !["reviewState", "shotBoundaries"].includes(B.id)), ge = R === null || R.configured === !1 || R.ready === !1, xe = v.busy || ge, oe = (R == null ? void 0 : R.error) || (R === null ? "Checking Full Scan availability" : R.configured === !1 ? "Configure the analysis service before running Full Scan" : R.ready === !1 ? "Full Scan is currently unavailable" : "Run AI tagging and shot boundary analysis for selected videos"), he = v.busy ? "Queueing scans…" : R === null ? "Checking Full Scan…" : R.configured === !1 ? "Full Scan not configured" : R.ready === !1 ? "Full Scan unavailable" : "Full Scan selected";
  return n("div", { className: "w-full space-y-5" }, [
    n(vo, {
      key: "tabs",
      active: "videos",
      onNavigate: e,
      showBin: !t && r === "editor",
      profile: o
    }),
    n(Pa, {
      key: "list",
      title: "Videos",
      pageKey: "segment-studio-videos",
      savedFilterScope: Ta,
      cardSizeEntityType: "video",
      maxPageSize: 1e3,
      filter: a,
      onFilterChange: P,
      totalCount: u.totalCount,
      isLoading: m,
      error: b ? new Error(b) : null,
      onRetry: () => k((B) => B + 1),
      sortOptions: t || r === "review" ? [...ba, { value: "unreviewed_count", label: "Unreviewed count" }] : ba,
      displayMode: l,
      onDisplayModeChange: g,
      availableDisplayModes: ["grid", "list"],
      criteriaDefinitions: ae,
      objectFilter: s,
      onObjectFilterChange: G,
      searchPlaceholder: "Search Segment Studio videos...",
      selectedIds: C ? I : void 0,
      onSelectAll: C ? ce : void 0,
      onSelectNone: C ? z : void 0,
      onInvertSelection: C ? se : void 0,
      selectionActions: C ? n("div", { className: "inline-flex items-stretch" }, [
        n("button", {
          key: "full",
          type: "button",
          disabled: xe,
          onClick: () => H(),
          title: oe,
          className: "rounded-l-md bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
        }, he),
        n("details", { key: "choices", className: "relative flex" }, [
          n("summary", {
            key: "summary",
            "aria-label": "Choose selected video scan analyses",
            "aria-disabled": xe,
            title: oe,
            onClick: (B) => {
              xe && B.preventDefault();
            },
            className: `inline-flex list-none items-center justify-center rounded-r-md border-l border-white/30 bg-accent px-2 py-1.5 text-white marker:hidden [&::-webkit-details-marker]:hidden ${xe ? "pointer-events-none opacity-50" : "cursor-pointer hover:opacity-90"}`
          }, n(La, { className: "h-4 w-4" })),
          n("div", { key: "menu", className: "absolute right-0 top-full z-50 mt-1 min-w-48 whitespace-nowrap rounded-md border border-border bg-card p-1 shadow-xl" }, [
            ["AI analysis only", ["aiTagging"]],
            ["Shot boundaries only", ["omnishotcut"]]
          ].map(([B, ue]) => n("button", {
            key: B,
            type: "button",
            disabled: v.busy,
            onClick: (re) => {
              var X;
              (X = re.currentTarget.closest("details")) == null || X.removeAttribute("open"), H(ue);
            },
            className: "block w-full rounded px-2.5 py-2 text-left text-xs text-foreground hover:bg-muted/60 disabled:opacity-50"
          }, B)))
        ])
      ]) : null
    }, [
      n("p", { key: "scan-announcement", role: "status", "aria-live": "polite", className: "sr-only" }, v.announcement),
      v.error ? n("p", { key: "scan-error", role: "alert", className: "rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-300" }, v.error) : null,
      !m && u.items.length === 0 ? n("p", { key: "empty", className: "rounded-lg border border-dashed border-border p-8 text-center text-sm text-secondary" }, "No videos match these filters.") : null,
      !m && l === "grid" ? n("section", { key: "grid", className: "grid gap-3", style: { gridTemplateColumns: "repeat(auto-fill, minmax(var(--card-min-width, 275px), 1fr))" } }, u.items.map((B) => n(nc, { key: B.videoId, item: B, onNavigate: e, showReviewStates: C, selected: I.has(B.videoId), selectionActive: I.size > 0, onSelect: C ? te : null }))) : null,
      !m && l === "list" ? n("section", { key: "rows", className: "space-y-3" }, u.items.map((B) => n(rc, { key: B.videoId, item: B, onNavigate: e, showReviewStates: C, selected: I.has(B.videoId), selectionActive: I.size > 0, onSelect: C ? te : null }))) : null
    ])
  ]);
}
function Aa({
  videoId: e,
  onNavigate: t,
  compatibilityMode: r = !1,
  profile: o
}) {
  const [i, a] = j(null), [s, l] = j(!0), [d, c] = j(""), g = fe(0), u = fe(0), f = fe(e), m = Gd();
  f.current = e;
  const p = (I) => `/videos/${I}/editor`;
  async function b(I, L, R) {
    const K = await Z(p(L), R ? { signal: R.signal } : void 0);
    return Zt(I, R ? g.current : u.current, L, f.current) ? (a(K), !0) : !1;
  }
  ye(() => {
    const I = ++g.current, L = e, R = new AbortController();
    return a(null), l(!0), c(""), b(I, L, R).catch((K) => {
      Zt(I, g.current, L, f.current) && K.name !== "AbortError" && c(K.message || "Unable to load the editor.");
    }).finally(() => {
      Zt(I, g.current, L, f.current) && l(!1);
    }), () => {
      g.current++, u.current++, R.abort();
    };
  }, [e]);
  function y(I, L) {
    a((R) => (R == null ? void 0 : R.video.id) !== L ? R : typeof I == "function" ? I(R) : I);
  }
  async function w() {
    const I = e, L = ++u.current;
    try {
      const R = await Z(p(I));
      return Zt(L, u.current, I, f.current) ? (a(R), c("A newer canonical segment was loaded. Your stale change was not applied."), R) : null;
    } catch (R) {
      return Zt(L, u.current, I, f.current) && c(R.message || "Unable to reload the latest segment."), null;
    }
  }
  async function k() {
    const I = e, L = ++u.current;
    try {
      const R = await Z(p(I));
      return Zt(L, u.current, I, f.current) ? (a(R), c(""), R) : null;
    } catch (R) {
      return Zt(L, u.current, I, f.current) && c(R.message || "Unable to reload performer slots."), null;
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
      n(xs, { key: "indicator", "aria-hidden": !0, className: "h-6 w-6 animate-spin text-muted" }),
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
      initialSegmentId: ia() ? -ia() : Bl(),
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
    return window.history.replaceState({}, "", "/segment-studio"), n(Vr, {
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
    if (d) return n($a, { onNavigate: r, profile: o });
    const m = Number(e);
    return Number.isInteger(m) && m > 0 ? n(Aa, {
      videoId: m,
      onNavigate: r,
      compatibilityMode: !0,
      profile: o
    }) : n(Vr, {
      onNavigate: r,
      compatibilityMode: !0,
      mode: s,
      profile: o
    });
  }
  if (c) return n(Wc, { onNavigate: r, profile: o });
  const f = Number(e);
  return d ? n($a, { onNavigate: r, profile: o }) : Number.isInteger(f) && f > 0 ? n(Aa, {
    videoId: f,
    onNavigate: r,
    compatibilityMode: s === "review",
    profile: o
  }) : n(Vr, {
    onNavigate: r,
    mode: s,
    profile: o
  });
}
function Zc({ id: e, slug: t, onNavigate: r }) {
  const [o, i] = j(null), [a, s] = j("");
  return ye(() => {
    const l = new AbortController();
    return Z("/preferences", { signal: l.signal }).then((d) => i(oi(d))).catch((d) => {
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
const Su = {
  components: { SegmentStudioPage: Zc },
  actionHandlers: { openSegmentStudio: eu }
};
export {
  fr as CLEARED_SEGMENT_SELECTION_ID,
  ba as DISCOVERY_SORT_OPTIONS,
  Kt as SEGMENT_STUDIO_CAPABILITIES,
  so as SEGMENT_STUDIO_EXTENSION_ID,
  qn as SEGMENT_STUDIO_SHORTCUTS,
  Bs as activeEditorFilterCount,
  Qa as addPendingChange,
  yd as applyDerivationRuleSlotSuggestions,
  mr as applyFeedbackEditorDelta,
  Xa as applyPendingChanges,
  ua as applySegmentMergeDelta,
  nd as basicSegmentTimelineStyle,
  jl as browseClipEnd,
  ii as browseEditorHref,
  oa as buildBrowseRequest,
  Lc as buildDerivationRuleGraph,
  ec as buildDiscoverySearchParams,
  Is as buildMinuteTimelineTicks,
  Oc as buildPerformerSlotOverview,
  Hl as buildSegmentQuickSearchEntries,
  Sd as buildSegmentRailRows,
  kd as buildTimelineRows,
  iu as buildTimelineTicks,
  As as calculateCenteredTimelineScroll,
  Yr as calculateEditorPanelMaximum,
  Cs as calculateMinuteLabelStride,
  su as calculateMinuteTimelineWidth,
  Es as calculateSwimlaneTitleMaximum,
  Rs as calculateTimelinePlayheadPosition,
  co as calculateTimelineRatioBounds,
  Os as calculateTimelineRatioFromPointer,
  lu as calculateVerticalRevealOffset,
  Xt as clampEditorPanelWidth,
  cr as clampSwimlaneTitleWidth,
  _a as clampTimelineRatio,
  uo as clampTimelineRatioForHeight,
  pr as clampTimelineZoom,
  Yd as compactProvenanceSummary,
  Ec as createBulkAnalysisCoordinator,
  bl as createQueuedReviewRequest,
  nl as createSaveQueue,
  ka as createSegmentAnalysisRequestScope,
  Su as default,
  al as discardPendingChange,
  Il as displayHeldSegmentTag,
  Zl as downloadFileNameFromContentDisposition,
  Gs as dualRangeValueFromPointer,
  ea as duplicateIdentityFromResponse,
  Sl as duplicateOperationKey,
  Va as editorVisibilityIncludingSegment,
  Id as expandedSwimlanes,
  Ol as extensionOwnedSegmentsModeSwitchPrompt,
  Rd as feedbackFrameTimestamps,
  Ed as feedbackResultMatchesAction,
  Md as feedbackSelectionPlan,
  js as filterDerivedSegments,
  Ur as filterEditorSegments,
  Pc as filterPerformerSlotOverview,
  zl as filterSegmentQuickSearch,
  pu as filterSegmentStudioShortcuts,
  Td as findAdjacentSegmentGroupKey,
  Tl as findAdjacentShot,
  pl as findEditorShortcut,
  Ha as findInitialSegmentSelection,
  Ns as findNearestSegmentInCurrentSwimlane,
  $l as findPublishedSelectionIdentity,
  Je as findSegmentByStableIdentity,
  Ps as findSegmentFromPlayhead,
  ws as findSegmentNearPlayhead,
  $d as findSwimlaneRangeSelection,
  no as findSwimlaneSelection,
  Ul as findUniquePerformerSlotAssignment,
  gr as findUnreviewedSelection,
  cd as focusDialogDefaultButton,
  xr as formatGenderHint,
  Al as frameStepSeconds,
  si as generatePerformerSlotAssignmentRecommendations,
  mc as groupApprovedDraftsForPublishing,
  Kl as groupAutoAssignCandidates,
  Dd as groupIncorrectExamplesByTag,
  bc as groupMaterializationOutputs,
  en as groupSegmentsIntoSwimlanes,
  wd as groupSelectedSwimlanes,
  ho as groupSwimlanesBySegmentGroup,
  bt as handleModalKey,
  xn as hasSegmentStudioCapability,
  ga as hideCollectedFeedbackSegments,
  ud as historyActionsForTarget,
  sr as incorrectExampleHistoryState,
  hi as indexPerformerSlotsBySegment,
  yu as initialReviewFilter,
  Ld as insertSegmentProjection,
  Zt as isCurrentEditorRequest,
  sd as isEditableTarget,
  hu as isEditorShortcutOwner,
  Qr as isKindRunning,
  du as isSaveQueueBusy,
  Yc as isSegmentStudioBinRoute,
  Jc as isSegmentStudioSegmentsRoute,
  Vc as isSegmentStudioSettingsRoute,
  Fc as layoutDerivationRuleComponent,
  jc as layoutDerivationRuleComponents,
  Fd as mergeSegmentsProjection,
  pd as multiSelectionActionHint,
  Vs as nextSegmentAfterRemoval,
  Js as nextUnreviewedAfterRemoval,
  Vt as normalizeCollapsedSegmentGroups,
  xa as normalizeDiscoveryIds,
  Nt as normalizeEditorSegmentFilters,
  qt as normalizeGender,
  ta as normalizeReviewFilter,
  oi as normalizeSegmentStudioFeatureProfile,
  fu as normalizeSegmentStudioMode,
  eo as normalizeSegmentStudioPublicMode,
  bn as parseBrowseSlotFilters,
  Ds as parseEditorLayout,
  Ls as parseHideDerivedSegmentsPreference,
  Fs as parseMergeConfirmationPreference,
  ni as parsePlaybackShortcutConfig,
  ml as parseShortcutBindingOverrides,
  Wr as patchPerformerSlotProjection,
  ro as patchSegmentProjection,
  dl as pendingChangesReducer,
  Ys as percentageSeekTime,
  Gl as performInitialSegmentSeek,
  nt as performerOptionId,
  yr as performerSlotHistoryState,
  ft as performerSlotLabel,
  bd as performerSlotPresentation,
  xu as performerSlotStatus,
  bo as performerSlotStatusFromSegmentSlots,
  bi as performerSlotsForSegment,
  Rt as provenanceSourceLabel,
  ll as prunePendingChanges,
  Nl as queueCreatedSegmentTagChoice,
  li as rankPerformerOptions,
  Ad as reconcileSegmentGroupKey,
  qs as reconcileSelectedSegmentIds,
  oc as recyclingBinActionText,
  ed as recyclingBinDeletionPrompt,
  mi as recyclingBinDeletionSummary,
  Pl as recyclingBinModeSwitchPrompt,
  xl as removeQueuedReviewsForSegments,
  oo as removeSegmentsProjection,
  ia as requestedOwnedItemId,
  Bl as requestedSegmentId,
  Ks as resolveEditorSegmentSelection,
  Cl as resolveQueuedCreatedSegmentTag,
  hl as resolveQueuedReviewRequest,
  kl as resolveSegmentCreationAction,
  Dl as resolveSegmentStudioRoute,
  gl as resolveSegmentStudioShortcuts,
  tl as resolveSegmentTarget,
  Bc as resolveSelectedDerivationRule,
  Yo as resolveSelectedSegments,
  Sc as restoreDisabledToolbarActionFocus,
  Ac as restorePublishApprovedFocus,
  hr as restoreSegmentFieldsProjection,
  wi as restoreSegmentsProjection,
  sl as retargetPendingChanges,
  ki as revealCollapsedSegmentGroup,
  Dc as runSelectedDiscoveryAnalysis,
  hn as sameSegmentIdentity,
  ur as savingSegmentIdFrom,
  pi as segmentBadgeStyle,
  vr as segmentGroupHeaderBackground,
  Tt as segmentGroupKeyForSegment,
  yo as segmentHistoryIdentity,
  ir as segmentHistoryState,
  el as segmentIdentity,
  fi as segmentRailItemStyle,
  bu as segmentStateStyle,
  Xc as segmentStudioActionTarget,
  Rl as segmentStudioLegacyMode,
  td as segmentTimelineStyle,
  wt as segmentsHistoryState,
  Ws as selectAllVideoSegmentIds,
  Ll as selectedBrowseStates,
  xi as selectedSwimlaneMerge,
  Ni as setBackLinkNavigation,
  il as settlePendingChange,
  md as sharedPerformerSlotShape,
  gd as sharedTagPerformerSlotShape,
  vn as shortcutAvailableInMode,
  fl as shortcutBindingDisplayText,
  cu as shortcutBindingFromEvent,
  mu as shortcutBindingsOverlap,
  gu as shortcutModesOverlap,
  ul as shortcutRequiresSingleSegment,
  Gn as shotBoundaryFingerprint,
  dd as shouldAcceptCurrentTagFromEnter,
  uu as shouldExitShortcutCapture,
  vu as shouldHandleEditorShortcut,
  Sa as shouldLoadSegmentAnalysis,
  ya as shouldReloadAfterSegmentMutation,
  Xr as shouldRestoreTransitionSelection,
  _l as shouldShowQuickSearchGroups,
  Zo as splitShortcutCategoriesIntoColumns,
  fd as suggestDerivationRuleSlotMappings,
  Hn as swimlaneDisplayLabel,
  id as swimlaneMarkerTop,
  od as swimlaneStripeBackground,
  wl as tagEditorLockedBySave,
  Xs as targetsOverlap,
  Ms as timelineContentStyle,
  Wo as timelinePlayheadHorizontalStyle,
  rd as timelineSegmentWidth,
  $s as timelineTickAlignment,
  Ts as timelineTickPosition,
  Jr as timelineTimePercent,
  Cd as toggleAllCollapsedSegmentGroups,
  yl as toggledSelectionReviewState,
  Lt as trapModalFocus,
  Jl as tryParseJsonResponseText,
  _s as updateAnchoredSegmentSelection,
  tc as updateDiscoverySelection,
  Us as updateDualRangeValues,
  zs as updateSegmentCollectionSelection,
  Hs as updateSegmentRangeSelection,
  Ja as updateSegmentSelection,
  Ia as validateDerivationRuleDraft,
  qo as validateSegmentTiming,
  mo as videoPerformerOptions,
  qr as videoPerformerSlotAssignments,
  El as visibleSegmentStudioSettingsTabs,
  Ml as visibleSegmentStudioTabs,
  vi as visibleVirtualRows
};
